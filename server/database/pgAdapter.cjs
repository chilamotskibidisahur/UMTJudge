'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const pool = require('./pool.cjs');
const usersRepo = require('./repos/users.cjs');
const classesRepo = require('./repos/classes.cjs');
const problemsRepo = require('./repos/problems.cjs');
const contestsRepo = require('./repos/contests.cjs');
const submissionsRepo = require('./repos/submissions.cjs');
const leaderboardRepo = require('./repos/leaderboard.cjs');
const settingsRepo = require('./repos/settings.cjs');
const achievementsRepo = require('./repos/achievements.cjs');
const { resolveProblemSubmission, SCORING_MODES } = require('../scoring.cjs');

function newId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

class PgAdapter {
  constructor() {
    this.DATA_DIR = process.cwd();
    this.STORAGE_DIR = path.join(process.cwd(), 'storage');
    this.cache = {
      settings: { ...settingsRepo.DEFAULT_SETTINGS },
      classes: [],
      users: [],
      problems: [],
      submissions: [],
      contests: [],
      virtual_sessions: [],
      contest_attendance: {},
      achievements: [],
      rewards: []
    };
    this.isReady = false;
    this._syncPromise = this.initCache();
  }

  async initCache() {
    try {
      const isConnected = await pool.testConnection();
      if (!isConnected.ok) {
        console.warn('⚠️ [PgAdapter] PostgreSQL chưa chạy (Docker offline). Tự động nạp dữ liệu từ schooljudge_data.json để tiếp tục hoạt động.');
        try {
          const fallbackDb = require('../db.cjs');
          const fbData = fallbackDb.load();
          this.cache.settings = fbData.settings || settingsRepo.DEFAULT_SETTINGS;
          this.cache.classes = fbData.classes || [];
          this.cache.users = fbData.users || [];
          this.cache.problems = fbData.problems || [];
          this.cache.contests = fbData.contests || [];
          this.cache.submissions = fbData.submissions || [];
          this.cache.achievements = fbData.achievements || [];
          this.cache.rewards = fbData.rewards || [];
          this.isReady = true;
        } catch (e) {
          console.error('[PgAdapter] Fallback nạp JSON thất bại:', e);
        }
        return;
      }

      // Nạp dữ liệu song song từ PostgreSQL vào cache
      const [settings, classes, users, problems, contests, submissions, achievements, rewards] = await Promise.all([
        settingsRepo.getSettings().catch(() => settingsRepo.DEFAULT_SETTINGS),
        classesRepo.getClasses().catch(() => []),
        usersRepo.getUsers().catch(() => []),
        problemsRepo.getProblems({ includeTestCases: false }).catch(() => []),
        contestsRepo.getContests().catch(() => []),
        submissionsRepo.getSubmissions({}).catch(() => []),
        achievementsRepo.getAchievements().catch(() => []),
        achievementsRepo.getRewards().catch(() => [])
      ]);

      this.cache.settings = settings;
      this.cache.classes = classes;
      this.cache.users = users;
      this.cache.problems = problems;
      this.cache.contests = contests;
      this.cache.submissions = submissions;
      this.cache.achievements = achievements;
      this.cache.rewards = rewards;
      this.isReady = true;

      console.log('⚡ [PgAdapter] Đã đồng bộ cache từ PostgreSQL vào bộ nhớ thành công.');
    } catch (err) {
      console.error('[PgAdapter] Lỗi khởi tạo cache từ PostgreSQL:', err);
    }
  }

  async reloadCache() {
    return this.initCache();
  }

  // --------------------------------------------------------------------------
  // Settings
  // --------------------------------------------------------------------------
  getSettings() {
    return this.cache.settings;
  }

  updateSettings(newSettings = {}) {
    this.cache.settings = { ...this.cache.settings, ...newSettings };
    settingsRepo.updateSettings(newSettings).catch(err => {
      console.error('[PgAdapter] Lỗi ghi settings vào PG:', err);
    });
    return this.cache.settings;
  }

  // --------------------------------------------------------------------------
  // First Run Check & Admin Setup
  // --------------------------------------------------------------------------
  isFirstRun() {
    return !this.cache.users.some(u => u.role === 'host' || u.role === 'admin');
  }

  setupFirstAdmin(adminData) {
    if (!adminData.passwordHash) {
      const error = new Error('A pre-hashed password is required');
      error.code = 'PASSWORD_HASH_REQUIRED';
      throw error;
    }

    const admin = {
      id: newId('usr'),
      username: adminData.username.trim().toLowerCase(),
      passwordHash: adminData.passwordHash,
      fullName: adminData.fullName || "Quản trị viên / Giáo viên",
      role: 'host',
      classId: 'admin-class',
      classes: ['admin-class'],
      createdAt: new Date().toISOString()
    };

    const defaultClass = {
      id: newId('cls'),
      name: adminData.className || "Lớp Tin Học 1",
      teacher: admin.fullName,
      joinCode: "TIN01"
    };

    if (adminData.serverName) {
      this.cache.settings.serverName = adminData.serverName.trim();
    }

    this.cache.users = [admin];
    this.cache.classes = [defaultClass];

    // Ghi vào PostgreSQL ngầm
    usersRepo.setupFirstAdmin(adminData).catch(err => {
      console.error('[PgAdapter] Lỗi ghi setupFirstAdmin vào PG:', err);
    });

    return { admin, defaultClass };
  }

  // --------------------------------------------------------------------------
  // Problems
  // --------------------------------------------------------------------------
  getProblems(options = {}) {
    return this.cache.problems.map(p => ({
      ...p,
      testCases: []
    }));
  }

  getProblem(idOrCode, options = {}) {
    if (!idOrCode) return null;
    const clean = String(idOrCode).trim().toUpperCase();
    const prob = this.cache.problems.find(p => p.id === idOrCode || String(p.code).toUpperCase() === clean);
    if (!prob) return null;

    if (options.includeTestCases !== false) {
      // Đọc testcases từ file đĩa
      const tcs = this.getProblemTestCases(prob.id);
      return { ...prob, testCases: tcs };
    }
    return { ...prob, testCases: [] };
  }

  getProblemTestCases(problemId) {
    if (!problemId) return [];
    const probDir = path.join(this.STORAGE_DIR, 'testcases', problemId);
    if (!fs.existsSync(probDir)) return [];

    try {
      const files = fs.readdirSync(probDir);
      const inpFiles = files.filter(f => f.toLowerCase().endsWith('.inp')).sort();
      return inpFiles.map((inpF, idx) => {
        const baseName = inpF.replace(/\.inp$/i, '');
        const outF = files.find(f => f.toLowerCase() === `${baseName.toLowerCase()}.out`);
        const inContent = fs.readFileSync(path.join(probDir, inpF), 'utf8');
        const outContent = outF ? fs.readFileSync(path.join(probDir, outF), 'utf8') : '';
        return {
          id: `${problemId}-tc-${idx + 1}`,
          name: baseName,
          score: 10,
          isSample: idx === 0,
          input: inContent,
          expectedOutput: outContent
        };
      });
    } catch (e) {
      return [];
    }
  }

  setProblemTestCases(problemId, testCases = []) {
    problemsRepo.setProblemTestCases(problemId, testCases).catch(err => {
      console.error('[PgAdapter] Lỗi ghi testcases vào PG/disk:', err);
    });
    const prob = this.cache.problems.find(p => p.id === problemId);
    if (prob) {
      prob.testCount = Array.isArray(testCases) ? testCases.length : 0;
    }
  }

  createProblem(probData) {
    const id = probData.id || newId('prob');
    const newProb = {
      id,
      code: String(probData.code || 'BAI').toUpperCase().trim(),
      title: String(probData.title || probData.code || 'Bài tập').trim(),
      difficulty: probData.difficulty || "Trung bình",
      points: Number(probData.points) || 100,
      timeLimit: Number(probData.timeLimit) || 1000,
      memoryLimit: Number(probData.memoryLimit) || (this.cache.settings.globalMemoryLimit || 256),
      category: probData.category || "C++11",
      description: probData.description || "",
      statement: probData.statement || "",
      statementHtml: probData.statementHtml || "",
      samples: Array.isArray(probData.samples) ? probData.samples : [],
      sampleCode: probData.sampleCode || `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Code C++\n    return 0;\n}\n`,
      pdfUrl: probData.pdfUrl || "",
      pdfFileName: probData.pdfFileName || "",
      testCount: Array.isArray(probData.testCases) ? probData.testCases.length : 0
    };

    this.cache.problems.unshift(newProb);
    if (Array.isArray(probData.testCases)) {
      this.setProblemTestCases(id, probData.testCases);
    }

    problemsRepo.createProblem({ ...newProb, testCases: probData.testCases }).catch(err => {
      console.error('[PgAdapter] Lỗi ghi bài tập vào PG:', err);
    });

    return { ...newProb, testCases: probData.testCases || [] };
  }

  updateProblem(id, updates = {}) {
    const idx = this.cache.problems.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const merged = { ...this.cache.problems[idx], ...updates };
    this.cache.problems[idx] = merged;

    if (Array.isArray(updates.testCases)) {
      this.setProblemTestCases(id, updates.testCases);
      merged.testCount = updates.testCases.length;
    }

    problemsRepo.updateProblem(id, updates).catch(err => {
      console.error('[PgAdapter] Lỗi cập nhật bài tập vào PG:', err);
    });

    return merged;
  }

  deleteProblem(id) {
    const initialLen = this.cache.problems.length;
    this.cache.problems = this.cache.problems.filter(p => p.id !== id);
    problemsRepo.deleteProblem(id).catch(err => {
      console.error('[PgAdapter] Lỗi xóa bài tập trong PG:', err);
    });
    return this.cache.problems.length !== initialLen;
  }

  // --------------------------------------------------------------------------
  // Users & Auth
  // --------------------------------------------------------------------------
  getUsers() {
    return this.cache.users;
  }

  getUser(idOrUsername) {
    if (!idOrUsername) return null;
    const clean = String(idOrUsername).trim().toLowerCase();
    return this.cache.users.find(u => u.id === idOrUsername || u.username.toLowerCase() === clean) || null;
  }

  createUser(user) {
    if (!user.passwordHash) {
      const error = new Error('A pre-hashed password is required');
      error.code = 'PASSWORD_HASH_REQUIRED';
      throw error;
    }
    const id = user.id || newId('usr');
    const classes = Array.isArray(user.classes) && user.classes.length > 0
      ? user.classes
      : (user.classId ? [user.classId] : [this.cache.classes[0]?.id || "cls-1"]);

    const newUser = {
      id,
      username: user.username.trim().toLowerCase(),
      passwordHash: user.passwordHash,
      fullName: user.fullName || user.username,
      role: user.role || "user",
      classId: classes[0] || (this.cache.classes[0]?.id || "cls-1"),
      classes,
      streak: 1,
      badges: [],
      isLocked: false,
      mustChangePassword: !!user.mustChangePassword,
      contestRating: Number(user.contestRating) || 1200,
      ratingHistory: Array.isArray(user.ratingHistory) ? user.ratingHistory : [],
      points: Number(user.points) || 0,
      arenaWins: Number(user.arenaWins) || 0,
      arenaLosses: Number(user.arenaLosses) || 0,
      arenaDraws: Number(user.arenaDraws) || 0,
      createdAt: new Date().toISOString()
    };

    this.cache.users.push(newUser);
    usersRepo.createUser(newUser).catch(err => {
      console.error('[PgAdapter] Lỗi thêm user vào PG:', err);
    });
    return newUser;
  }

  updateUser(id, updates = {}) {
    const user = this.getUser(id);
    if (!user) return null;

    if (updates.fullName) user.fullName = updates.fullName.trim();
    if (updates.classId) user.classId = updates.classId;
    if (updates.classes && Array.isArray(updates.classes)) {
      user.classes = updates.classes;
      if (!user.classId && updates.classes.length > 0) user.classId = updates.classes[0];
    }
    if (updates.isLocked !== undefined) user.isLocked = !!updates.isLocked;
    if (updates.contestRating !== undefined) user.contestRating = Number(updates.contestRating) || 1200;
    if (updates.ratingHistory !== undefined) user.ratingHistory = Array.isArray(updates.ratingHistory) ? updates.ratingHistory : [];
    if (updates.points !== undefined) user.points = Number(updates.points) || 0;
    if (updates.arenaWins !== undefined) user.arenaWins = Number(updates.arenaWins) || 0;
    if (updates.arenaLosses !== undefined) user.arenaLosses = Number(updates.arenaLosses) || 0;
    if (updates.arenaDraws !== undefined) user.arenaDraws = Number(updates.arenaDraws) || 0;

    usersRepo.updateUser(user.id, updates).catch(err => {
      console.error('[PgAdapter] Lỗi cập nhật user vào PG:', err);
    });
    return user;
  }

  setUserPasswordHash(id, passwordHash, mustChangePassword = false) {
    const user = this.getUser(id);
    if (!user) return null;
    user.passwordHash = passwordHash;
    user.mustChangePassword = !!mustChangePassword;

    usersRepo.setUserPasswordHash(user.id, passwordHash, mustChangePassword).catch(err => {
      console.error('[PgAdapter] Lỗi đổi mật khẩu trong PG:', err);
    });
    return user;
  }

  toggleUserLock(id) {
    const user = this.getUser(id);
    if (!user) return null;
    user.isLocked = !user.isLocked;

    usersRepo.toggleUserLock(user.id).catch(err => {
      console.error('[PgAdapter] Lỗi khóa user trong PG:', err);
    });
    return user;
  }

  deleteUser(id) {
    const initialLen = this.cache.users.length;
    this.cache.users = this.cache.users.filter(u => u.id !== id && u.username !== id);
    usersRepo.deleteUser(id).catch(err => {
      console.error('[PgAdapter] Lỗi xóa user trong PG:', err);
    });
    return this.cache.users.length !== initialLen;
  }

  authenticate(username, password) {
    const cleanUser = String(username || '').trim().toLowerCase();
    const user = this.cache.users.find(u => u.username === cleanUser);
    if (!user) return null;

    const hash = crypto.createHash('sha256').update(password).digest('hex');
    if (user.passwordHash && user.passwordHash !== hash) {
      return null;
    }
    return user;
  }

  // --------------------------------------------------------------------------
  // Classes
  // --------------------------------------------------------------------------
  getClasses() {
    return classesRepo.sortClassesNaturally(this.cache.classes || []);
  }

  async promoteSchoolYear() {
    const res = await classesRepo.promoteSchoolYear();
    const freshClasses = await classesRepo.getClasses();
    this.cache.classes = freshClasses;
    return res;
  }

  createClass(cls) {
    const name = cls.name.trim();
    const autoGrade = parseInt(name.match(/\d+/)?.[0] || '0', 10) || null;
    const newClass = {
      id: cls.id || newId('cls'),
      name,
      grade: cls.grade !== undefined && cls.grade !== null && cls.grade !== '' ? Number(cls.grade) : autoGrade,
      teacher: cls.teacher || "Giáo viên",
      joinCode: (cls.joinCode || Math.random().toString(36).substring(2, 8)).toUpperCase()
    };
    this.cache.classes.push(newClass);

    classesRepo.createClass(newClass).catch(err => {
      console.error('[PgAdapter] Lỗi tạo lớp vào PG:', err);
    });
    return newClass;
  }

  async deleteClass(id) {
    const idx = (this.cache.classes || []).findIndex(c => c.id === id);
    if (idx !== -1) {
      this.cache.classes.splice(idx, 1);
    }
    await classesRepo.deleteClass(id).catch(err => {
      console.error('[PgAdapter] Lỗi xóa lớp trong PG:', err);
    });
    return true;
  }

  // --------------------------------------------------------------------------
  // Contests
  // --------------------------------------------------------------------------
  getContests() {
    return this.cache.contests;
  }

  getContest(id) {
    return this.cache.contests.find(c => c.id === id) || null;
  }

  createContest(contest) {
    const id = contest.id || newId('cnt');
    const targetClasses = Array.isArray(contest.targetClasses) 
      ? contest.targetClasses 
      : (Array.isArray(contest.classIds) ? contest.classIds : []);
    const targetStudents = Array.isArray(contest.targetStudents) 
      ? contest.targetStudents 
      : (Array.isArray(contest.candidateIds) ? contest.candidateIds : []);
    const targetGrades = Array.isArray(contest.targetGrades) 
      ? contest.targetGrades.map(Number) 
      : [];

    let scopeType = contest.scopeType || 'ALL';
    if (!contest.scopeType) {
      if (targetStudents.length > 0) scopeType = 'STUDENT';
      else if (targetGrades.length > 0) scopeType = 'GRADE';
      else if (targetClasses.length > 0) scopeType = 'CLASS';
      else scopeType = 'ALL';
    }

    const newContest = {
      id,
      title: String(contest.title || "").trim(),
      description: String(contest.description || ""),
      mode: contest.mode || "offline",
      scopeType,
      targetGrades,
      targetClasses,
      targetStudents,
      totalScore: Number(contest.totalScore) || 100,
      memoryLimit: Math.min(5120, Math.max(16, Number(contest.memoryLimit) || 256)),
      category: contest.category || "regular",
      classIds: targetClasses,
      candidateIds: targetStudents,
      problemIds: Array.isArray(contest.problemIds) ? contest.problemIds : [],
      pdfUrl: contest.pdfUrl || "",
      pdfFileName: contest.pdfFileName || "",
      statementHtml: contest.statementHtml || "",
      startTime: contest.startTime || new Date().toISOString(),
      endTime: contest.endTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      durationMinutes: Number(contest.durationMinutes) || 45,
      status: contest.status || "running",
      gradingMode: contest.gradingMode || "direct",
      freezeScoreboardMinutes: Number(contest.freezeScoreboardMinutes) || 15,
      pinCode: contest.pinCode ? String(contest.pinCode).trim() : "",
      hideTestDetailsForStudents: contest.hideTestDetailsForStudents !== false,
      requireFreopen: !!contest.requireFreopen,
      allowReopen: contest.allowReopen !== false,
      ioMode: contest.ioMode || (contest.requireFreopen ? 'freopen' : 'stdin'),
      scoringMode: ['LIVE_BEST', 'OLYMPIC_LATEST', 'PRETEST'].includes(contest.scoringMode) ? contest.scoringMode : 'LIVE_BEST',
      ipWhitelist: String(contest.ipWhitelist || '').trim(),
      antiCheat: contest.antiCheat || { preventTabSwitch: true, maxTabViolations: 3, preventCopyPaste: false },
      createdAt: new Date().toISOString()
    };

    this.cache.contests.unshift(newContest);
    contestsRepo.createContest(newContest).catch(err => {
      console.error('[PgAdapter] Lỗi ghi kỳ thi vào PG:', err);
    });
    return newContest;
  }

  updateContest(id, updates) {
    const idx = this.cache.contests.findIndex(c => c.id === id);
    if (idx === -1) return null;

    const merged = { ...this.cache.contests[idx], ...updates };
    this.cache.contests[idx] = merged;

    contestsRepo.updateContest(id, updates).catch(err => {
      console.error('[PgAdapter] Lỗi cập nhật kỳ thi vào PG:', err);
    });
    return merged;
  }

  deleteContest(id) {
    const initialLen = this.cache.contests.length;
    this.cache.contests = this.cache.contests.filter(c => c.id !== id);
    contestsRepo.deleteContest(id).catch(err => {
      console.error('[PgAdapter] Lỗi xóa kỳ thi trong PG:', err);
    });
    return this.cache.contests.length !== initialLen;
  }

  isStudentEligible(student, contest) {
    if (!student || !contest) return false;
    if (student.role === 'host') return true;

    const scopeType = (contest.scopeType || '').toUpperCase();
    const studentClasses = Array.isArray(student.classes) && student.classes.length > 0
      ? student.classes
      : (student.classId ? [student.classId] : []);

    if (!scopeType || scopeType === 'ALL') {
      if (Array.isArray(contest.candidateIds) && contest.candidateIds.length > 0) {
        return contest.candidateIds.includes(student.id);
      }
      if (Array.isArray(contest.classIds) && contest.classIds.length > 0) {
        return studentClasses.some(cId => contest.classIds.includes(cId));
      }
      return true;
    }

    if (scopeType === 'GRADE') {
      const targetGrades = Array.isArray(contest.targetGrades) ? contest.targetGrades.map(Number) : [];
      if (targetGrades.length === 0) return true;
      const allClasses = this.getClasses() || [];
      return studentClasses.some(cId => {
        const cls = allClasses.find(c => c.id === cId || c.name === cId);
        const grade = cls && cls.grade !== undefined ? Number(cls.grade) : parseInt(String(cls ? cls.name : cId).match(/\d+/)?.[0] || '0', 10);
        return targetGrades.includes(grade);
      });
    }

    if (scopeType === 'CLASS') {
      const targetClasses = (Array.isArray(contest.targetClasses) && contest.targetClasses.length > 0)
        ? contest.targetClasses
        : (contest.classIds || []);
      if (targetClasses.length === 0) return true;
      return studentClasses.some(cId => targetClasses.includes(cId));
    }

    if (scopeType === 'STUDENT') {
      const targetStudents = (Array.isArray(contest.targetStudents) && contest.targetStudents.length > 0)
        ? contest.targetStudents
        : (contest.candidateIds || []);
      return targetStudents.includes(student.id);
    }

    return true;
  }

  // --------------------------------------------------------------------------
  // Submissions
  // --------------------------------------------------------------------------
  getSubmissions(filter = {}) {
    let list = [...this.cache.submissions];
    if (filter.userId) list = list.filter(s => s.userId === filter.userId);
    if (filter.problemId) list = list.filter(s => s.problemId === filter.problemId);
    if (filter.contestId) list = list.filter(s => s.contestId === filter.contestId);
    if (filter.virtualSessionId) list = list.filter(s => s.virtualSessionId === filter.virtualSessionId);
    if (filter.isVirtual !== undefined) {
      const isVirt = filter.isVirtual === 'true' || filter.isVirtual === true;
      list = list.filter(s => !!s.isVirtual === isVirt);
    }
    if (filter.participationType) {
      const pType = String(filter.participationType).toUpperCase();
      if (pType === 'REAL') {
        list = list.filter(s => !s.isVirtual && s.participationType !== 'VIRTUAL');
      } else if (pType === 'VIRTUAL') {
        list = list.filter(s => !!s.isVirtual || s.participationType === 'VIRTUAL');
      }
    }
    return list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  getSubmission(id) {
    return this.cache.submissions.find(s => s.id === id) || null;
  }

  createSubmission(sub) {
    const id = sub.id || newId('sub');
    const user = this.getUser(sub.userId);
    const prob = this.getProblem(sub.problemId, { includeTestCases: false });

    const newSub = {
      id,
      userId: sub.userId,
      userName: user ? user.fullName : sub.userId,
      problemId: sub.problemId,
      problemCode: prob ? prob.code : 'CODE',
      contestId: sub.contestId || null,
      code: sub.code || "",
      status: sub.status || 'QUEUED',
      score: Number(sub.score) || 0,
      passedTests: Number(sub.passedTests) || 0,
      totalTests: Number(sub.totalTests) || 0,
      executionTime: Number(sub.executionTime) || 0,
      memoryUsed: Number(sub.memoryUsed) || 0,
      submittedAt: new Date().toISOString(),
      compileError: null,
      isVirtual: !!sub.isVirtual,
      participationType: sub.participationType || (sub.isVirtual ? 'VIRTUAL' : 'REAL'),
      virtualSessionId: sub.virtualSessionId || null,
      details: []
    };

    this.cache.submissions.unshift(newSub);
    submissionsRepo.createSubmission(newSub).catch(err => {
      console.error('[PgAdapter] Lỗi ghi bài nộp vào PG:', err);
    });
    return newSub;
  }

  updateSubmission(id, updates) {
    const idx = this.cache.submissions.findIndex(s => s.id === id);
    if (idx === -1) return null;

    const merged = { ...this.cache.submissions[idx], ...updates };
    this.cache.submissions[idx] = merged;

    submissionsRepo.updateSubmission(id, updates).catch(err => {
      console.error('[PgAdapter] Lỗi cập nhật bài nộp trong PG:', err);
    });
    return merged;
  }

  normalizeSubmissionScores() {
    const problemsMap = (this.cache.problems || []).reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});

    let fixedCount = 0;
    const finalStatuses = ['AC', 'WA', 'TLE', 'MLE', 'CE', 'RE', 'SKIPPED'];

    for (const sub of (this.cache.submissions || [])) {
      if (!sub.problemId || !finalStatuses.includes(sub.status)) continue;
      const prob = problemsMap[sub.problemId];
      if (!prob) continue;

      const maxProbPoints = Number(prob.points) || 100;
      const totalTests = sub.totalTests || (sub.details ? sub.details.length : 0);
      if (totalTests === 0) continue;

      let correctScore = 0;
      if (sub.passedTests === totalTests) {
        correctScore = maxProbPoints;
      } else if (sub.passedTests === 0) {
        correctScore = 0;
      } else {
        correctScore = Math.min(maxProbPoints, Math.round(((sub.passedTests / totalTests) * maxProbPoints) * 10) / 10);
      }

      if (sub.score !== correctScore) {
        const updates = { score: correctScore };
        if (Array.isArray(sub.details) && sub.details.length > 0) {
          const eachWeight = Math.round((maxProbPoints / totalTests) * 100) / 100;
          updates.details = sub.details.map(d => ({
            ...d,
            scoreEarned: d.status === 'AC' ? eachWeight : 0
          }));
        }
        this.updateSubmission(sub.id, updates);
        fixedCount++;
      }
    }

    if (fixedCount > 0) {
      console.log(`⚡ [PgAdapter] Đã chuẩn hóa lại điểm số cho ${fixedCount} bài nộp cũ về đúng thang điểm bài.`);
    }
    return { fixedCount, totalSubmissions: (this.cache.submissions || []).length };
  }

  // --------------------------------------------------------------------------
  // Leaderboards
  // --------------------------------------------------------------------------
  getLeaderboard() {
    return leaderboardRepo.getLeaderboard();
  }

  getContestLeaderboard(contestId, isVirtual = false, options = {}) {
    const contest = this.getContest(contestId);
    if (!contest) return [];

    const classMap = {};
    (this.getClasses() || []).forEach(c => { classMap[c.id] = c.name; });

    const scopeType = (contest.scopeType || '').toUpperCase();
    const hasSpecificScope = (
      (scopeType === 'GRADE' && ((contest.targetGrades && contest.targetGrades.length > 0) || contest.targetGrade)) ||
      (scopeType === 'CLASS' && ((contest.targetClasses && contest.targetClasses.length > 0) || (contest.classIds && contest.classIds.length > 0))) ||
      (scopeType === 'STUDENT' && ((contest.targetStudents && contest.targetStudents.length > 0) || (contest.candidateIds && contest.candidateIds.length > 0))) ||
      ((!scopeType || scopeType === 'ALL') && ((contest.classIds && contest.classIds.length > 0) || (contest.candidateIds && contest.candidateIds.length > 0)))
    );

    let eligibleUsers = (this.cache.users || []).filter(u => {
      if (u.role !== 'user') return false;
      if (isVirtual) return true;
      const att = this.cache.contest_attendance?.[contestId]?.[u.id];
      if (att) return true;
      return this.isStudentEligible(u, contest);
    });

    const eligibleUserIds = new Set(eligibleUsers.map(u => u.id));

    const userMap = {};
    for (const u of eligibleUsers) {
      const att = this.cache.contest_attendance?.[contestId]?.[u.id];
      const uClasses = Array.isArray(u.classes) && u.classes.length > 0 ? u.classes : (u.classId ? [u.classId] : []);
      const resolvedClassName = att?.className || uClasses.map(cId => classMap[cId] || cId).join(', ') || classMap[u.classId] || u.classId || '';

      userMap[u.id] = {
        userId: u.id,
        userName: u.fullName,
        username: u.username,
        classId: u.classId || (uClasses[0] || ''),
        className: resolvedClassName,
        rating: u.contestRating || 1200,
        points: u.points || 0,
        totalScore: 0,
        problemsSolved: 0,
        totalSubmissions: 0,
        solvedProblems: {},
        badges: u.badges || []
      };
    }

    const contestSubs = (this.cache.submissions || []).filter(s => {
      const matchContest = s.contestId === contestId;
      if (!matchContest) return false;

      if (isVirtual) {
        if (!s.isVirtual && !s.virtualSessionId && s.participationType !== 'VIRTUAL') return false;
      } else {
        if (s.isVirtual || s.virtualSessionId || s.participationType === 'VIRTUAL') return false;
        if (!eligibleUserIds.has(s.userId)) return false;
      }

      if (options.submittedBefore) {
        const submittedAt = new Date(s.submittedAt).getTime();
        if (!Number.isFinite(submittedAt) || submittedAt > options.submittedBefore) return false;
      }
      return true;
    });

    const scoringMode = contest.scoringMode || 'LIVE_BEST';
    const isPretest = scoringMode === 'PRETEST';

    const userProblemSubs = {};
    for (const sub of contestSubs) {
      if (!userMap[sub.userId]) {
        if (isVirtual) {
          userMap[sub.userId] = {
            userId: sub.userId,
            userName: sub.userName,
            username: sub.userName,
            classId: '',
            className: 'Thi ảo',
            totalScore: 0,
            problemsSolved: 0,
            totalSubmissions: 0,
            solvedProblems: {},
            badges: [],
            isPretest,
            isOfficial: false
          };
        } else {
          continue;
        }
      }
      userMap[sub.userId].totalSubmissions++;
      if (!userProblemSubs[sub.userId]) userProblemSubs[sub.userId] = {};
      if (!userProblemSubs[sub.userId][sub.problemId]) userProblemSubs[sub.userId][sub.problemId] = [];
      userProblemSubs[sub.userId][sub.problemId].push(sub);
    }

    for (const userId of Object.keys(userProblemSubs)) {
      const probMap = userProblemSubs[userId];
      for (const pId of Object.keys(probMap)) {
        const pSubs = probMap[pId];
        const res = resolveProblemSubmission(pSubs, scoringMode);
        if (res && res.finalSubmission) {
          userMap[userId].solvedProblems[pId] = {
            score: res.finalScore,
            status: res.finalSubmission.status,
            time: res.finalSubmission.executionTime,
            bestScore: res.bestScore,
            latestScore: res.latestScore,
            submissionId: res.finalSubmission.id
          };
        }
      }
    }

    const leaderboard = Object.values(userMap).map(u => {
      let total = 0;
      let solved = 0;
      for (const pId in u.solvedProblems) {
        total += u.solvedProblems[pId].score;
        if (u.solvedProblems[pId].status === 'AC') solved++;
      }
      return {
        ...u,
        totalScore: total,
        officialScore: (!isPretest && !isVirtual) ? total : 0,
        problemsSolved: solved,
        isPretest,
        isOfficial: !isPretest && !isVirtual,
        scoringMode
      };
    });

    const result = isVirtual 
      ? leaderboard.filter(u => u.totalSubmissions > 0)
      : hasSpecificScope 
      ? leaderboard 
      : leaderboard.filter(u => u.totalSubmissions > 0 || this.cache.contest_attendance?.[contestId]?.[u.userId]);

    return result.sort((a, b) => b.totalScore - a.totalScore || b.problemsSolved - a.problemsSolved);
  }

  // Official Report: Strictly participationType === 'REAL' (excludes virtual!)
  getOfficialContestReport(contestId) {
    const contest = this.getContest(contestId);
    if (!contest) return null;

    const classMap = {};
    (this.getClasses() || []).forEach(c => { classMap[c.id] = c.name; });

    const contestProblems = (contest.problemIds || []).map(pId => {
      const prob = this.getProblem(pId);
      return {
        id: pId,
        code: prob?.code || pId,
        title: prob?.title || prob?.code || pId,
        points: Number(prob?.points) || 100
      };
    });

    const scoringMode = contest.scoringMode || 'LIVE_BEST';

    // Submissions cho contest này, chỉ tính chính thức (REAL)
    const allSubs = this.getSubmissions() || [];
    const contestSubs = allSubs.filter(s => {
      if (s.contestId !== contestId) return false;
      if (s.isVirtual || s.participationType === 'VIRTUAL') return false;
      return true;
    });

    // Gom bài nộp theo user và problem
    const userProblemSubs = {};
    const userSubmitCount = {};
    for (const sub of contestSubs) {
      const uId = sub.userId;
      const pId = sub.problemId;
      if (!uId || !pId) continue;
      userSubmitCount[uId] = (userSubmitCount[uId] || 0) + 1;
      if (!userProblemSubs[uId]) userProblemSubs[uId] = {};
      if (!userProblemSubs[uId][pId]) userProblemSubs[uId][pId] = [];
      userProblemSubs[uId][pId].push(sub);
    }

    const allUsers = this.getUsers().filter(u => u.role === 'user');
    const userMap = {};
    for (const u of allUsers) {
      userMap[u.id] = u;
    }

    // Lấy danh sách thí sinh có bài nộp
    const participantIds = Object.keys(userProblemSubs);

    const rows = participantIds.map(uId => {
      const u = userMap[uId] || { id: uId, fullName: uId, classId: '' };
      const probMap = userProblemSubs[uId] || {};
      const problemScores = {};
      let totalScore = 0;
      let solvedCount = 0;

      contestProblems.forEach(p => {
        const pSubs = probMap[p.id] || [];
        const res = resolveProblemSubmission(pSubs, scoringMode);
        const score = res ? Number(res.finalScore) || 0 : 0;
        problemScores[p.id] = score;
        totalScore += score;
        if (score >= (p.points || 100)) solvedCount++;
      });

      // Chỉ lấy lớp mà khi vào kỳ thi học sinh nhập, không hiện các lớp được tick sẵn (u.classes / u.classId)
      const att = this.getContestAttendanceRecord(contestId, uId) || this.cache.contest_attendance?.[contestId]?.[uId];
      const enteredClassName = (att?.enteredClassName || att?.className || '').trim();

      return {
        userId: uId,
        fullName: u.fullName || u.username || uId,
        className: enteredClassName || '-',
        score: Math.round(totalScore * 100) / 100,
        problemScores,
        problemsSolved: solvedCount,
        totalSubmissions: userSubmitCount[uId] || 0,
        participationType: 'REAL'
      };
    });

    rows.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.problemsSolved !== a.problemsSolved) return b.problemsSolved - a.problemsSolved;
      return (a.fullName || '').localeCompare(b.fullName || '');
    });

    rows.forEach((r, idx) => {
      r.stt = idx + 1;
    });

    return {
      contestId: contest.id,
      contestTitle: contest.title,
      startTime: contest.startTime,
      endTime: contest.endTime,
      totalScore: contest.totalScore || 100,
      participantCount: rows.length,
      problems: contestProblems,
      rows
    };
  }

  // --------------------------------------------------------------------------
  // Virtual Sessions & Attendance
  // --------------------------------------------------------------------------
  getVirtualSession(id) {
    return (this.cache.virtual_sessions || []).find(s => s.id === id) || null;
  }

  createVirtualSession(sessionData) {
    const sess = {
      id: sessionData.id || newId('vsess'),
      contestId: sessionData.contestId,
      userId: sessionData.userId,
      status: 'running',
      startTime: sessionData.startTime || new Date().toISOString(),
      endTime: sessionData.endTime,
      durationMinutes: sessionData.durationMinutes || 45,
      createdAt: new Date().toISOString()
    };
    if (!this.cache.virtual_sessions) this.cache.virtual_sessions = [];
    this.cache.virtual_sessions.unshift(sess);
    return sess;
  }

  finishVirtualSession(id, endReason = 'manual') {
    const sess = this.getVirtualSession(id);
    if (sess) {
      sess.status = 'finished';
      sess.endReason = endReason;
      return sess;
    }
    return null;
  }

  getVirtualSessions({ userId, contestId } = {}) {
    if (!this.cache.virtual_sessions) this.cache.virtual_sessions = [];
    return this.cache.virtual_sessions.filter(vs => {
      if (userId && vs.userId !== userId) return false;
      if (contestId && vs.contestId !== contestId) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getActiveVirtualSession(userId) {
    if (!this.cache.virtual_sessions) this.cache.virtual_sessions = [];
    const now = Date.now();
    const session = this.cache.virtual_sessions.find(vs => 
      vs.userId === userId && (vs.status === 'running' || vs.status === 'left')
    );
    if (!session) return null;
    const end = new Date(session.endTime).getTime();
    if (now > end) {
      return this.finishVirtualSession(session.id, 'timeout');
    }
    return session;
  }

  leaveVirtualSession(id) {
    const sess = this.getVirtualSession(id);
    if (sess) {
      sess.status = 'paused';
      return sess;
    }
    return null;
  }

  resumeVirtualSession(id) {
    const sess = this.getVirtualSession(id);
    if (sess) {
      sess.status = 'running';
      return sess;
    }
    return null;
  }

  getContestAttendanceRecord(contestId, userId) {
    if (!this.cache.contest_attendance) this.cache.contest_attendance = {};
    const record = this.cache.contest_attendance?.[contestId]?.[userId];
    if (!record) return null;
    return {
      status: record.status || 'present',
      extraMinutes: Number(record.extraMinutes) || 0,
      reason: record.reason || '',
      reopened: !!record.reopened,
      ...(record.className ? { className: record.className } : {}),
      ...(record.enteredClassName ? { enteredClassName: record.enteredClassName } : {}),
      ...(record.joinedAt ? { joinedAt: record.joinedAt } : {}),
      ...(record.ip ? { ip: record.ip } : {}),
      ...(record.lastActive ? { lastActive: record.lastActive } : {})
    };
  }

  getContestAttendance(contestId) {
    const contest = this.getContest(contestId);
    if (!contest) return [];
    if (!this.cache.contest_attendance) this.cache.contest_attendance = {};
    if (!this.cache.contest_attendance[contestId]) this.cache.contest_attendance[contestId] = {};
    const attMap = this.cache.contest_attendance[contestId];

    const allStudents = this.getUsers().filter(u => u.role !== 'host');
    let candidateUsers = [];
    if (contest.candidateIds && contest.candidateIds.length > 0) {
      candidateUsers = allStudents.filter(u => contest.candidateIds.includes(u.id));
    } else if (contest.classIds && contest.classIds.length > 0) {
      candidateUsers = allStudents.filter(u => contest.classIds.includes(u.classId));
    } else {
      candidateUsers = allStudents;
    }

    const contestSubs = (this.cache.submissions || []).filter(s => s.contestId === contestId && !s.isVirtual);

    const result = candidateUsers.map(u => {
      const record = attMap[u.id] || { status: 'absent_unexcused', extraMinutes: 0, reason: '' };
      const mySubs = contestSubs.filter(s => s.userId === u.id);
      
      const probBest = {};
      for (const s of mySubs) {
        if (!probBest[s.problemId] || s.score > probBest[s.problemId]) {
          probBest[s.problemId] = s.score;
        }
      }
      const currentScore = Object.values(probBest).reduce((a, b) => a + b, 0);

      let currentStatus = record.status;
      if (mySubs.length > 0 && currentStatus === 'absent_unexcused') {
        currentStatus = 'present';
      }

      return {
        userId: u.id,
        username: u.username,
        fullName: u.fullName,
        classId: u.classId,
        isLocked: !!u.isLocked,
        status: currentStatus,
        extraMinutes: record.extraMinutes || 0,
        reason: record.reason || '',
        joinedAt: record.joinedAt || null,
        ip: record.ip || '',
        lastActive: record.lastActive || (mySubs.length > 0 ? mySubs[mySubs.length - 1].submittedAt : null),
        submissionsCount: mySubs.length,
        currentScore
      };
    });

    return result;
  }

  updateContestAttendance(contestId, userId, data = {}) {
    if (!this.cache.contest_attendance) this.cache.contest_attendance = {};
    if (!this.cache.contest_attendance[contestId]) this.cache.contest_attendance[contestId] = {};
    
    const existing = this.cache.contest_attendance[contestId][userId] || { status: 'present', extraMinutes: 0, reason: '', reopened: false };
    if (data.status) existing.status = data.status;
    if (data.joinedAt && !existing.joinedAt) existing.joinedAt = data.joinedAt;
    if (data.reason !== undefined) existing.reason = data.reason;
    if (data.extraMinutes !== undefined) existing.extraMinutes = Number(data.extraMinutes) || 0;
    if (data.ip) existing.ip = data.ip;
    if (data.lastActive) existing.lastActive = data.lastActive;
    if (data.reopened !== undefined) existing.reopened = !!data.reopened;
    if (data.className !== undefined) existing.className = String(data.className).trim();
    if (data.enteredClassName !== undefined) existing.enteredClassName = String(data.enteredClassName).trim();

    this.cache.contest_attendance[contestId][userId] = existing;
    return existing;
  }

  addExtraTime(contestId, userId, extraMinutes = 5) {
    if (!this.cache.contest_attendance) this.cache.contest_attendance = {};
    if (!this.cache.contest_attendance[contestId]) this.cache.contest_attendance[contestId] = {};
    
    const existing = this.cache.contest_attendance[contestId][userId] || { status: 'present', extraMinutes: 0, reason: '', reopened: false };
    existing.extraMinutes = (existing.extraMinutes || 0) + Number(extraMinutes);
    this.cache.contest_attendance[contestId][userId] = existing;
    return existing;
  }

  reopenContestForUser(contestId, userId) {
    if (!this.cache.contest_attendance) this.cache.contest_attendance = {};
    if (!this.cache.contest_attendance[contestId]) this.cache.contest_attendance[contestId] = {};
    
    const existing = this.cache.contest_attendance[contestId][userId] || { status: 'present', extraMinutes: 0, reason: '', reopened: false };
    existing.status = 'present';
    existing.reopened = true;
    if (existing.joinedAt) existing.joinedAt = new Date().toISOString();
    this.cache.contest_attendance[contestId][userId] = existing;
    return existing;
  }

  getUserExamHistory(userId) {
    const history = [];
    const allContests = this.getContests() || [];
    const allSubs = this.cache.submissions || [];
    const userSubs = allSubs.filter(s => s.userId === userId);

    for (const contest of allContests) {
      const attendance = this.getContestAttendanceRecord(contest.id, userId);
      const isCandidate = (contest.candidateIds || []).includes(userId) || 
                          (contest.classIds || []).includes(this.getUser(userId)?.classId) ||
                          (!contest.candidateIds?.length && !contest.classIds?.length);

      if (isCandidate || attendance || userSubs.some(s => s.contestId === contest.id)) {
        const contestLeaderboard = this.getContestLeaderboard ? this.getContestLeaderboard(contest.id) : [];
        const myEntry = contestLeaderboard.find(e => e.userId === userId);
        const score = myEntry ? myEntry.totalScore : 0;
        const maxScore = Number(contest.totalScore) || 100;
        const scorePercentage = Math.round((score / (maxScore || 100)) * 1000) / 10;

        const isParticipated = !!(userSubs.length > 0 || (attendance && (attendance.status === 'present' || attendance.status === 'submitted' || attendance.joinedAt)));

        history.push({
          contestId: contest.id,
          contestTitle: contest.title,
          date: contest.startTime,
          duration: contest.durationMinutes,
          rank: myEntry ? myEntry.rank : null,
          totalParticipants: contestLeaderboard.length,
          score,
          maxScore,
          totalScore: maxScore,
          scorePercentage,
          problemsSolved: myEntry ? myEntry.problemsSolved : 0,
          totalProblems: contest.problemIds?.length || 0,
          status: attendance?.status || (userSubs.length > 0 ? 'present' : 'absent_unexcused'),
          participated: isParticipated,
          extraMinutes: attendance?.extraMinutes || 0,
          reason: attendance?.reason || ''
        });
      }
    }
    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // --------------------------------------------------------------------------
  // Codeforces Contest Rating Engine
  // --------------------------------------------------------------------------
  calculateContestRatings(contestId) {
    const contest = this.getContest(contestId);
    if (!contest) return { success: false, error: 'Không tìm thấy kỳ thi' };

    const leaderboard = this.getContestLeaderboard(contestId, false);
    const participants = leaderboard.filter(p => p.totalSubmissions > 0);
    if (participants.length < 2) {
      return { success: false, error: 'Cần ít nhất 2 thí sinh có nộp bài để tính biến động Rating Codeforces' };
    }

    const n = participants.length;
    const userRatings = {};
    for (const p of participants) {
      const u = this.getUser(p.userId);
      userRatings[p.userId] = u?.contestRating || 1200;
    }

    const changes = [];
    participants.forEach((p, actualRankIdx) => {
      const actualRank = actualRankIdx + 1;
      const myRating = userRatings[p.userId];
      let expectedRank = 1;
      for (const other of participants) {
        if (other.userId === p.userId) continue;
        const otherRating = userRatings[other.userId];
        const prob = 1 / (1 + Math.pow(10, (otherRating - myRating) / 400));
        expectedRank += prob;
      }

      // Delta: Chuẩn hóa theo số lượng thí sinh
      const kFactor = Math.min(100, Math.max(30, Math.round(400 / Math.sqrt(n))));
      let delta = Math.round(((expectedRank - actualRank) / (n - 1 || 1)) * kFactor);
      delta = Math.max(-120, Math.min(250, delta));

      const oldRating = myRating;
      const newRating = Math.max(100, oldRating + delta);

      const user = this.getUser(p.userId);
      if (user) {
        user.contestRating = newRating;
        if (!Array.isArray(user.ratingHistory)) user.ratingHistory = [];
        
        user.ratingHistory = user.ratingHistory.filter(h => h.contestId !== contestId);
        user.ratingHistory.push({
          contestId,
          contestTitle: contest.title,
          rank: actualRank,
          totalParticipants: n,
          oldRating,
          newRating,
          delta,
          date: Date.now()
        });
        this.updateUser(p.userId, {
          contestRating: newRating,
          ratingHistory: user.ratingHistory
        });
      }

      changes.push({
        userId: p.userId,
        username: p.username,
        fullName: p.userName,
        rank: actualRank,
        oldRating,
        newRating,
        delta
      });
    });

    contest.ratingsCalculated = true;
    contest.ratingsCalculatedAt = new Date().toISOString();
    this.updateContest(contestId, {
      ratingsCalculated: true,
      ratingsCalculatedAt: contest.ratingsCalculatedAt
    });

    return { success: true, count: changes.length, changes };
  }

  // --------------------------------------------------------------------------
  // Student Rating Leaderboard (Codeforces)
  // --------------------------------------------------------------------------
  getRatingLeaderboard(filterClassId = null) {
    const users = (this.getUsers() || []).filter(u => u.role === 'user' || !u.role || u.role === 'student');
    const classes = this.getClasses() || [];
    const classMap = {};
    classes.forEach(c => { classMap[c.id] = c.name; });

    let list = users.map(u => {
      const rating = typeof u.contestRating === 'number' ? u.contestRating : 1200;
      const history = Array.isArray(u.ratingHistory) ? u.ratingHistory : [];
      const contestsCount = history.length;
      const lastEntry = history.length > 0 ? history[history.length - 1] : null;
      const lastDelta = lastEntry ? (lastEntry.delta || 0) : 0;
      const points = typeof u.points === 'number' ? u.points : 0;

      const userClasses = Array.isArray(u.classes) && u.classes.length > 0
        ? u.classes
        : (u.classId ? [u.classId] : []);

      const classNames = userClasses.map(cid => classMap[cid] || cid).filter(Boolean);
      const primaryClassName = classNames[0] || (classMap[u.classId] || 'Chưa xếp lớp');

      const maxRating = history.length > 0
        ? Math.max(...history.map(h => typeof h.newRating === 'number' ? h.newRating : 1200), rating)
        : rating;

      return {
        userId: u.id,
        username: u.username,
        fullName: u.fullName || u.username,
        avatar: u.avatar || null,
        classId: u.classId || (userClasses[0] || ''),
        classes: userClasses,
        className: primaryClassName,
        classNames: classNames,
        rating,
        maxRating,
        lastDelta,
        contestsCount,
        points,
        streak: u.streak || 0
      };
    });

    if (filterClassId && filterClassId !== 'ALL') {
      list = list.filter(u => (u.classes && u.classes.includes(filterClassId)) || u.classId === filterClassId);
    }

    // Sort by rating desc, then points desc, then contestsCount desc, then username asc
    list.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      if (b.points !== a.points) return b.points - a.points;
      if (b.contestsCount !== a.contestsCount) return b.contestsCount - a.contestsCount;
      return (a.fullName || a.username).localeCompare(b.fullName || b.username);
    });

    return list.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }

  // --------------------------------------------------------------------------
  // Student Transcript / Report Card
  // --------------------------------------------------------------------------
  getStudentTranscript(userId) {
    const user = this.getUser(userId);
    if (!user) return null;

    const userSubs = (this.cache.submissions || []).filter(s => s.userId === userId && !s.isVirtual);
    const contests = this.getContests() || [];
    const problems = this.getProblems({ includeTestCases: false }) || [];
    const probMap = {};
    problems.forEach(p => { probMap[p.id] = p; });

    const transcriptContests = [];
    let totalScoreSum = 0;

    for (const contest of contests) {
      const contestSubs = userSubs.filter(s => s.contestId === contest.id);
      const isAttended = (this.cache.contest_attendance?.[contest.id]?.[userId]) || contestSubs.length > 0;
      if (!isAttended && contestSubs.length === 0) continue;

      const lb = this.getContestLeaderboard(contest.id, false);
      const rankIdx = lb.findIndex(entry => entry.userId === userId);
      const myEntry = rankIdx >= 0 ? lb[rankIdx] : null;

      const problemScoreSum = Array.isArray(contest.problemIds) && contest.problemIds.length > 0
        ? contest.problemIds.reduce((sum, pId) => sum + (Number(probMap[pId]?.points) || 100), 0)
        : (Number(contest.totalScore) || 100);
      const totalContestScore = Math.max(problemScoreSum, Number(contest.totalScore) || 100);
      const myScore = myEntry ? myEntry.totalScore : 0;
      const score10 = Number(Math.min(10.0, Math.max(0.0, (myScore / (totalContestScore || 100)) * 10)).toFixed(1));

      totalScoreSum += score10;

      const problemDetails = [];
      if (Array.isArray(contest.problemIds)) {
        for (const pId of contest.problemIds) {
          const prob = probMap[pId];
          const result = myEntry?.solvedProblems?.[pId];
          problemDetails.push({
            problemId: pId,
            code: prob?.code || pId,
            title: prob?.title || '',
            score: result?.score || 0,
            status: result?.status || 'NO_SUB',
            bestScore: result?.bestScore || 0
          });
        }
      }

      const ratingChange = (user.ratingHistory || []).find(h => h.contestId === contest.id);

      transcriptContests.push({
        contestId: contest.id,
        title: contest.title,
        category: contest.category || 'regular',
        startTime: contest.startTime,
        endTime: contest.endTime,
        totalScore: totalContestScore,
        myScore,
        score10,
        rank: rankIdx >= 0 ? rankIdx + 1 : null,
        totalParticipants: lb.length,
        problemsSolved: myEntry?.problemsSolved || 0,
        problemDetails,
        ratingDelta: ratingChange ? ratingChange.delta : null,
        newRating: ratingChange ? ratingChange.newRating : null
      });
    }

    transcriptContests.sort((a, b) => new Date(a.startTime || 0).getTime() - new Date(b.startTime || 0).getTime());

    const totalExams = transcriptContests.length;
    const gpa10 = totalExams > 0 ? Number((totalScoreSum / totalExams).toFixed(2)) : 0;

    let academicRank = 'Chưa xếp loại';
    if (totalExams > 0) {
      if (gpa10 >= 9.0) academicRank = 'Xuất sắc';
      else if (gpa10 >= 8.0) academicRank = 'Giỏi';
      else if (gpa10 >= 6.5) academicRank = 'Khá';
      else if (gpa10 >= 5.0) academicRank = 'Trung bình';
      else academicRank = 'Cần cố gắng';
    }

    return {
      student: {
        id: user.id,
        username: user.username,
        fullName: user.fullName || user.username,
        classId: user.classId,
        contestRating: user.contestRating || 1200,
        achievementPoints: user.points || 0,
        arenaWins: user.arenaWins || 0,
        arenaLosses: user.arenaLosses || 0,
        arenaDraws: user.arenaDraws || 0,
        ratingHistory: user.ratingHistory || []
      },
      summary: {
        totalExams,
        gpa10,
        academicRank,
        totalProblemsSolved: userSubs.filter(s => s.status === 'AC').length,
        currentRating: user.contestRating || 1200
      },
      contests: transcriptContests
    };
  }

  save() {
    // Không làm gì - PostgreSQL ghi tự động bằng transaction
    return true;
  }

  flushSync() {
    // Không làm gì - PostgreSQL đã có WAL & ACID
    return true;
  }
}

module.exports = new PgAdapter();
