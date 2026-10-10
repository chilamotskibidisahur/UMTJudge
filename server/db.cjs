const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DEFAULT_ACHIEVEMENTS, DEFAULT_REWARDS } = require('./achievementsData.cjs');
const { ROADMAP_STAGES, ROADMAP_LESSONS, ALGORITHM_ROADMAP_TOPICS } = require('./roadmapData.cjs');
const { resolveProblemSubmission, SCORING_MODES } = require('./scoring.cjs');

function newId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function getDataDir() {
  if (process.env.SCHOOLJUDGE_DATA_DIR) {
    const configuredPath = path.resolve(process.env.SCHOOLJUDGE_DATA_DIR);
    if (!fs.existsSync(configuredPath)) fs.mkdirSync(configuredPath, { recursive: true });
    return configuredPath;
  }

  try {
    const electron = require('electron');
    const app = electron.app || electron.remote?.app;
    if (app && typeof app.getPath === 'function') {
      const userPath = path.join(app.getPath('userData'), 'data');
      if (!fs.existsSync(userPath)) fs.mkdirSync(userPath, { recursive: true });
      return userPath;
    }
  } catch (e) {}

  if (process.env.APPDATA) {
    const appDataPath = path.join(process.env.APPDATA, 'chaucaojudge', 'data');
    if (fs.existsSync(appDataPath)) return appDataPath;
    const oldAppDataPath = path.join(process.env.APPDATA, 'quan-ly-code', 'data');
    if (fs.existsSync(oldAppDataPath)) return oldAppDataPath;
  }
  return process.cwd();
}

const DATA_DIR = getDataDir();
const DATA_FILE = path.join(DATA_DIR, 'schooljudge_data.json');

// Auto-migrate from process.cwd() if exists and new location is empty
if (DATA_DIR !== process.cwd() && !fs.existsSync(DATA_FILE)) {
  const oldPath = path.join(process.cwd(), 'schooljudge_data.json');
  if (fs.existsSync(oldPath)) {
    try {
      fs.copyFileSync(oldPath, DATA_FILE);
    } catch (e) {}
  }
}

// Empty initial database template (Completely blank as required)
const BLANK_DATA = {
  settings: {
    serverName: "ChauCaoJudge LAN - Máy Chủ Chấm Bài C++",
    port: 4000,
    compilerPath: "g++",
    useDocker: false,
    dockerImage: "gcc:latest",
    globalMemoryLimit: 256, // System-wide default memory limit: 256MB
    contestMode: false,
    contestEndTime: null,
    freezeScoreboard: false,
    allowCustomRun: true,
    submissionMode: 'direct',
    submissionsClosed: false
  },
  classes: [],
  users: [],
  problems: [],
  submissions: [],
  contests: [],
  virtual_sessions: [],
  contest_attendance: {},
  achievements: DEFAULT_ACHIEVEMENTS,
  rewards: DEFAULT_REWARDS,
  student_achievements: [],
  reward_redemptions: [],
  roadmap_stages: ROADMAP_STAGES,
  roadmap_lessons: ROADMAP_LESSONS,
  roadmap_user_progress: {}
};

const TESTCASES_DIR = path.join(DATA_DIR, 'testcases');
if (!fs.existsSync(TESTCASES_DIR)) {
  try { fs.mkdirSync(TESTCASES_DIR, { recursive: true }); } catch (e) {}
}

const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
if (!fs.existsSync(BACKUPS_DIR)) {
  try { fs.mkdirSync(BACKUPS_DIR, { recursive: true }); } catch (e) {}
}

class Database {
  constructor() {
    this.DATA_DIR = DATA_DIR;
    this.TESTCASES_DIR = TESTCASES_DIR;
    this.BACKUPS_DIR = BACKUPS_DIR;
    this._testCasesCache = new Map();
    this._saveTimer = null;
    this._lastSnapshotTime = 0;
    this.data = this.load();

    // Flush pending changes on process exit or crash
    const handleExit = () => {
      this.flushSync();
    };
    process.on('beforeExit', handleExit);
    process.on('exit', handleExit);
    process.on('SIGINT', () => { handleExit(); process.exit(0); });
    process.on('SIGTERM', () => { handleExit(); process.exit(0); });
    process.on('uncaughtException', (err) => {
      console.error('FATAL UNCAUGHT EXCEPTION - Auto-flushing database:', err);
      try { this.flushSync(); } catch (e) {}
    });
    process.on('unhandledRejection', (reason) => {
      console.error('FATAL UNHANDLED REJECTION - Auto-flushing database:', reason);
      try { this.flushSync(); } catch (e) {}
    });
  }

  // Tự động tạo bản sao lưu snapshot có xoay vòng (giữ tối đa 5 bản gần nhất)
  createBackupSnapshot(cleanData) {
    const now = Date.now();
    // Tạo snapshot cách nhau tối thiểu 15 phút khi có thay đổi dữ liệu
    if (now - this._lastSnapshotTime < 15 * 60 * 1000) return;
    try {
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      const snapFile = path.join(this.BACKUPS_DIR, `schooljudge_backup_${stamp}.json`);
      fs.writeFileSync(snapFile, JSON.stringify(cleanData, null, 2), 'utf8');
      this._lastSnapshotTime = now;

      // Xoay vòng bản sao lưu: chỉ giữ tối đa 5 bản gần nhất
      const allFiles = fs.readdirSync(this.BACKUPS_DIR)
        .filter(f => f.startsWith('schooljudge_backup_') && f.endsWith('.json'))
        .sort();
      while (allFiles.length > 5) {
        const oldest = allFiles.shift();
        try { fs.unlinkSync(path.join(this.BACKUPS_DIR, oldest)); } catch (e) {}
      }
    } catch (err) {
      console.error('Lỗi khi tạo bản sao lưu snapshot:', err);
    }
  }

  hashPassword(password) {
    if (!password) return '';
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async reloadCache() {
    this.data = this.load();
    return this.data;
  }

  // Get testcases from memory cache or individual testcase file on disk
  getProblemTestCases(problemId) {
    if (!problemId) return [];
    if (this._testCasesCache.has(problemId)) {
      return this._testCasesCache.get(problemId);
    }
    const tcFile = path.join(this.TESTCASES_DIR, `${problemId}.json`);
    if (fs.existsSync(tcFile)) {
      try {
        const raw = fs.readFileSync(tcFile, 'utf8');
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          this._testCasesCache.set(problemId, list);
          return list;
        }
      } catch (e) {
        console.error(`Error reading testcases for ${problemId}:`, e);
      }
    }
    return [];
  }

  // Save testcases into dedicated file atomically and update in-memory cache
  setProblemTestCases(problemId, testCases) {
    if (!problemId) return;
    const list = Array.isArray(testCases) ? testCases : [];
    this._testCasesCache.set(problemId, list);
    
    // Save to testcases/<problemId>.json atomically using .tmp rename
    const tcFile = path.join(this.TESTCASES_DIR, `${problemId}.json`);
    const tmpFile = `${tcFile}.tmp`;
    try {
      fs.writeFileSync(tmpFile, JSON.stringify(list), 'utf8');
      fs.renameSync(tmpFile, tcFile);
    } catch (e) {
      try {
        fs.writeFileSync(tcFile, JSON.stringify(list), 'utf8');
      } catch (err) {
        console.error(`Error saving testcase file for ${problemId}:`, err);
      }
    }

    // Sync testCount in problem object
    const prob = this.data.problems?.find(p => p.id === problemId);
    if (prob) {
      prob.testCount = list.length;
    }
  }

  // Attach transparent getter/setter so prob.testCases works seamlessly for backend/judge
  // but is non-enumerable so JSON.stringify(this.data) remains super small (<30KB instead of 25MB)
  attachTestCaseProperty(prob) {
    if (!prob || !prob.id) return;
    const self = this;
    Object.defineProperty(prob, 'testCases', {
      get() {
        return self.getProblemTestCases(prob.id);
      },
      set(val) {
        self.setProblemTestCases(prob.id, val);
      },
      enumerable: false,
      configurable: true
    });
  }

  load() {
    let parsed = null;
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        if (raw && raw.trim().length > 0) {
          parsed = JSON.parse(raw);
        }
      }
    } catch (err) {
      console.error('CẢNH BÁO: Lỗi đọc file CSDL chính, tiến hành kiểm tra bản sao lưu phục hồi:', err);
    }

    // 🛡️ TỰ ĐỘNG PHỤC HỒI NẾU FILE CHÍNH BỊ LỖI HOẶC RỖNG DO SẬP NGUỒN
    if (!parsed || !parsed.users) {
      const bakFile = `${DATA_FILE}.bak`;
      if (fs.existsSync(bakFile)) {
        try {
          const bakRaw = fs.readFileSync(bakFile, 'utf8');
          const bakParsed = JSON.parse(bakRaw);
          if (bakParsed && Array.isArray(bakParsed.users) && bakParsed.users.length > 0) {
            console.log('🛡️ [Auto-Recovery]: Đã tự động phục hồi CSDL thành công từ file .bak!');
            parsed = bakParsed;
            try { fs.copyFileSync(bakFile, DATA_FILE); } catch (e) {}
          }
        } catch (bakErr) {
          console.error('Lỗi khi đọc file .bak dự phòng:', bakErr);
        }
      }

      // Nếu .bak cũng hỏng, tìm trong thư mục snapshot backups/
      if (!parsed || !parsed.users) {
        try {
          if (fs.existsSync(this.BACKUPS_DIR)) {
            const snapFiles = fs.readdirSync(this.BACKUPS_DIR)
              .filter(f => f.startsWith('schooljudge_backup_') && f.endsWith('.json'))
              .sort()
              .reverse();
            for (const sf of snapFiles) {
              try {
                const sRaw = fs.readFileSync(path.join(this.BACKUPS_DIR, sf), 'utf8');
                const sParsed = JSON.parse(sRaw);
                if (sParsed && Array.isArray(sParsed.users) && sParsed.users.length > 0) {
                  console.log(`🛡️ [Auto-Recovery]: Đã tự động phục hồi CSDL từ bản sao lưu snapshot ${sf}!`);
                  parsed = sParsed;
                  try { fs.copyFileSync(path.join(this.BACKUPS_DIR, sf), DATA_FILE); } catch (e) {}
                  break;
                }
              } catch (e) {}
            }
          }
        } catch (e) {}
      }
    }

    if (!parsed) {
      parsed = JSON.parse(JSON.stringify(BLANK_DATA));
    }

    if (!parsed.settings) parsed.settings = { ...BLANK_DATA.settings };
    if (parsed.settings.submissionMode === undefined) parsed.settings.submissionMode = 'direct';
    if (parsed.settings.submissionsClosed === undefined) parsed.settings.submissionsClosed = false;
    if (!parsed.problems) parsed.problems = [];
    if (!parsed.contests) parsed.contests = [];
    if (!parsed.virtual_sessions) parsed.virtual_sessions = [];
    if (!parsed.contest_attendance) parsed.contest_attendance = {};
    if (!parsed.achievements || !Array.isArray(parsed.achievements) || parsed.achievements.length === 0) {
      parsed.achievements = JSON.parse(JSON.stringify(DEFAULT_ACHIEVEMENTS));
    }
    if (!parsed.rewards || !Array.isArray(parsed.rewards) || parsed.rewards.length === 0) {
      parsed.rewards = JSON.parse(JSON.stringify(DEFAULT_REWARDS));
    }
    if (!parsed.student_achievements) parsed.student_achievements = [];
    if (!parsed.reward_redemptions) parsed.reward_redemptions = [];
    if (!parsed.roadmap_stages || !Array.isArray(parsed.roadmap_stages) || parsed.roadmap_stages.length === 0) {
      parsed.roadmap_stages = JSON.parse(JSON.stringify(ROADMAP_STAGES));
    }
    if (!parsed.roadmap_lessons || !Array.isArray(parsed.roadmap_lessons) || parsed.roadmap_lessons.length === 0) {
      parsed.roadmap_lessons = JSON.parse(JSON.stringify(ROADMAP_LESSONS));
    }
    if (!parsed.roadmap_user_progress || typeof parsed.roadmap_user_progress !== 'object') {
      parsed.roadmap_user_progress = {};
    }

    // Auto-migrate heavy testCases out of schooljudge_data.json into testcases/ directory
    let migratedAny = false;
    for (const prob of parsed.problems) {
      if (Array.isArray(prob.testCases) && prob.testCases.length > 0) {
        // Has inline testcases, save to dedicated file
        const tcFile = path.join(this.TESTCASES_DIR, `${prob.id}.json`);
        try {
          fs.writeFileSync(tcFile, JSON.stringify(prob.testCases), 'utf8');
          this._testCasesCache.set(prob.id, prob.testCases);
          prob.testCount = prob.testCases.length;
          migratedAny = true;
        } catch (e) {
          console.error(`Migration error for problem ${prob.id}:`, e);
        }
      } else if (prob.testCount === undefined) {
        const existing = this.getProblemTestCases(prob.id);
        prob.testCount = existing.length;
      }
      // Strip inline testCases from enumerable keys to reduce file from 25MB -> 6KB
      delete prob.testCases;
      this.attachTestCaseProperty(prob);
    }

    if (migratedAny) {
      console.log('⚡ Successfully extracted heavy testcases to testcases/ folder. Database size optimized!');
      this.flushSync(parsed);
    }

    return parsed;
  }

  // Debounced non-blocking save
  save(dataToSave = this.data) {
    if (this._saveTimer) {
      clearTimeout(this._saveTimer);
    }
    this._saveTimer = setTimeout(() => {
      this._saveTimer = null;
      this.flushSync(dataToSave);
    }, 150);
  }

  // Immediate synchronous flush for critical persistence (e.g. shutdown, admin creation)
  flushSync(dataToSave = this.data) {
    try {
      if (this._saveTimer) {
        clearTimeout(this._saveTimer);
        this._saveTimer = null;
      }

      // Prepare clean data ensuring testCases are not serialized into main DB file
      const cleanData = {
        ...dataToSave,
        problems: (dataToSave.problems || []).map(p => {
          const count = p.testCount !== undefined 
            ? p.testCount 
            : (Array.isArray(p.testCases) ? p.testCases.length : this.getProblemTestCases(p.id).length);
          const copy = { ...p, testCount: count };
          delete copy.testCases;
          return copy;
        })
      };

      // Write atomically using .tmp and rename to prevent file corruption on sudden crash
      const tmpFile = `${DATA_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(cleanData, null, 2), 'utf8');
      fs.renameSync(tmpFile, DATA_FILE);

      // 🛡️ TÍNH BỀN VỮNG: Giữ một bản backup liền kề .bak để chống hỏng tệp khi mất điện
      try {
        fs.copyFileSync(DATA_FILE, `${DATA_FILE}.bak`);
      } catch (e) {}

      // Tự động snapshot theo chu kỳ
      this.createBackupSnapshot(cleanData);
    } catch (err) {
      console.error('Error writing DB file atomically:', err);
      try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf8');
      } catch (fallbackErr) {
        console.error('Fallback DB write also failed:', fallbackErr);
      }
    }
  }

  // First Run Check
  isFirstRun() {
    const hasAdmin = this.data.users.some(u => u.role === 'host' || u.role === 'admin');
    return !hasAdmin;
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
      createdAt: new Date().toISOString()
    };

    if (adminData.serverName) {
      this.data.settings.serverName = adminData.serverName.trim();
    }

    this.data.users = [admin];

    // Seed a default class for students
    const defaultClass = {
      id: newId('cls'),
      name: adminData.className || "Lớp Tin Học 1",
      teacher: admin.fullName,
      joinCode: "TIN01"
    };
    this.data.classes = [defaultClass];

    this.flushSync();
    return { admin, defaultClass };
  }

  // Settings
  getSettings() { return this.data.settings; }
  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  // Problems
  getProblems(options = {}) {
    // If includeTestCases is explicitly requested, return full testcases
    // Otherwise return lightweight problems with testCount & metadata
    return this.data.problems.map(p => {
      const tcs = this.getProblemTestCases(p.id);
      return {
        ...p,
        testCount: p.testCount !== undefined ? p.testCount : tcs.length,
        testCases: options.includeTestCases 
          ? tcs 
          : tcs.map(tc => ({ id: tc.id, name: tc.name, score: tc.score, isSample: tc.isSample }))
      };
    });
  }

  getProblem(id, options = {}) {
    const prob = this.data.problems.find(p => p.id === id || p.code === id);
    if (!prob) return null;
    const tcs = this.getProblemTestCases(prob.id);
    return {
      ...prob,
      testCount: prob.testCount !== undefined ? prob.testCount : tcs.length,
      testCases: options.includeTestCases === false 
        ? tcs.map(tc => ({ id: tc.id, name: tc.name, score: tc.score, isSample: tc.isSample }))
        : tcs
    };
  }
  
  createProblem(prob) {
    if (!this.data.problems) this.data.problems = [];
    const globalMem = this.data.settings?.globalMemoryLimit || 256;
    const probId = newId('prob');
    const rawTestCases = Array.isArray(prob.testCases) ? prob.testCases : [];
    
    // Save testcases to dedicated storage
    this.setProblemTestCases(probId, rawTestCases);

    const newProb = {
      id: probId,
      code: String(prob.code || 'BAI').toUpperCase().trim(),
      title: String(prob.title || prob.code || 'Bài tập').trim(),
      difficulty: prob.difficulty || "Trung bình",
      points: Number(prob.points) || 100,
      timeLimit: Number(prob.timeLimit) || 1000,
      memoryLimit: Number(prob.memoryLimit) || globalMem,
      category: prob.category || "C++11",
      description: prob.description || "",
      statement: prob.statement || "",
      statementHtml: prob.statementHtml || "",
      samples: Array.isArray(prob.samples) ? prob.samples : [],
      sampleCode: prob.sampleCode || `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Code C++11\n    return 0;\n}\n`,
      pdfUrl: prob.pdfUrl || "",
      pdfFileName: prob.pdfFileName || "",
      testCount: rawTestCases.length
    };

    this.attachTestCaseProperty(newProb);
    this.data.problems.push(newProb);
    this.flushSync();
    return { ...newProb, testCases: rawTestCases };
  }

  updateProblem(id, updates) {
    const idx = this.data.problems.findIndex(p => p.id === id);
    if (idx !== -1) {
      if (updates.testCases !== undefined) {
        const existingTcs = this.getProblemTestCases(id);
        const incoming = Array.isArray(updates.testCases) ? updates.testCases : [];
        
        // Safeguard against accidental testcase wipe:
        if (incoming.length === 0 && existingTcs.length > 0 && updates.clearTestCases !== true) {
          // Client sent empty array unintentionally (e.g. form didn't fetch testcases) -> keep existing tests!
          delete updates.testCases;
        } else if (incoming.length > 0) {
          // If incoming testcases are metadata-only (empty input/output) but existing testcases have real content,
          // merge and preserve existing input & output data
          const mergedTcs = incoming.map((tc, i) => {
            const oldTc = existingTcs.find(o => o.id === tc.id) || existingTcs[i];
            const hasInput = tc.input !== undefined && tc.input !== '';
            const hasOutput = tc.expectedOutput !== undefined && tc.expectedOutput !== '';
            return {
              ...tc,
              input: hasInput ? tc.input : (oldTc ? (oldTc.input || '') : ''),
              expectedOutput: hasOutput ? tc.expectedOutput : (oldTc ? (oldTc.expectedOutput || '') : ''),
              score: tc.score !== undefined ? tc.score : (tc.points !== undefined ? tc.points : (oldTc ? oldTc.score || 10 : 10))
            };
          });
          this.setProblemTestCases(id, mergedTcs);
          updates.testCount = mergedTcs.length;
          delete updates.testCases;
        } else {
          this.setProblemTestCases(id, []);
          updates.testCount = 0;
          delete updates.testCases;
        }
      }

      this.data.problems[idx] = { 
        ...this.data.problems[idx], 
        ...updates,
        points: updates.points !== undefined ? Number(updates.points) : this.data.problems[idx].points,
        timeLimit: updates.timeLimit !== undefined ? Number(updates.timeLimit) : this.data.problems[idx].timeLimit,
        memoryLimit: updates.memoryLimit !== undefined ? Number(updates.memoryLimit) : (this.data.problems[idx].memoryLimit || 256)
      };
      this.attachTestCaseProperty(this.data.problems[idx]);
      this.flushSync();
      return this.getProblem(id);
    }
    return null;
  }

  deleteProblem(id) {
    this.data.problems = this.data.problems.filter(p => p.id !== id);
    this._testCasesCache.delete(id);
    const tcFile = path.join(this.TESTCASES_DIR, `${id}.json`);
    try {
      if (fs.existsSync(tcFile)) fs.unlinkSync(tcFile);
    } catch (e) {}
    this.flushSync();
    return true;
  }

  // Users & Auth
  getUsers() { return this.data.users; }
  getUser(id) {
    if (!id) return null;
    const needle = String(id).toLowerCase();
    return this.data.users.find(u => u.id === id || (u.username && u.username.toLowerCase() === needle));
  }
  
  createUser(user) {
    if (!user.passwordHash) {
      const error = new Error('A pre-hashed password is required');
      error.code = 'PASSWORD_HASH_REQUIRED';
      throw error;
    }
    const classes = Array.isArray(user.classes) && user.classes.length > 0
      ? user.classes
      : (user.classId ? [user.classId] : [this.data.classes[0]?.id || "cls-1"]);
    const newUser = {
      id: newId('usr'),
      username: user.username.trim().toLowerCase(),
      passwordHash: user.passwordHash,
      fullName: user.fullName || user.username,
      role: user.role || "user",
      classId: classes[0] || (this.data.classes[0]?.id || "cls-1"),
      classes: classes,
      streak: 1,
      badges: [],
      isLocked: false,
      mustChangePassword: !!user.mustChangePassword,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  toggleUserLock(id) {
    const user = this.data.users.find(u => u.id === id || u.username === id);
    if (user) {
      user.isLocked = !user.isLocked;
      this.save();
      return user;
    }
    return null;
  }

  updateUser(id, updates = {}) {
    const user = this.data.users.find(u => u.id === id || u.username === id);
    if (user) {
      if (updates.fullName) user.fullName = updates.fullName.trim();
      if (updates.classId) user.classId = updates.classId;
      if (updates.classes && Array.isArray(updates.classes)) {
        user.classes = updates.classes;
        if (!user.classId && updates.classes.length > 0) user.classId = updates.classes[0];
      } else if (updates.classId && (!user.classes || user.classes.length === 0)) {
        user.classes = [updates.classId];
      }
      if (updates.isLocked !== undefined) user.isLocked = !!updates.isLocked;
      if (updates.contestRating !== undefined) user.contestRating = Number(updates.contestRating) || 1200;
      if (updates.rating !== undefined) user.rating = Number(updates.rating) || user.contestRating || 1200;
      if (updates.arenaRating !== undefined) user.arenaRating = Number(updates.arenaRating) || 1200;
      if (updates.ratingHistory !== undefined) user.ratingHistory = Array.isArray(updates.ratingHistory) ? updates.ratingHistory : [];
      if (updates.points !== undefined) user.points = Number(updates.points) || 0;
      if (updates.arenaWins !== undefined) user.arenaWins = Number(updates.arenaWins) || 0;
      if (updates.arenaLosses !== undefined) user.arenaLosses = Number(updates.arenaLosses) || 0;
      if (updates.arenaDraws !== undefined) user.arenaDraws = Number(updates.arenaDraws) || 0;
      this.save();
      return user;
    }
    return null;
  }

  setUserPasswordHash(id, passwordHash, mustChangePassword = false) {
    if (!passwordHash) {
      const error = new Error('A pre-hashed password is required');
      error.code = 'PASSWORD_HASH_REQUIRED';
      throw error;
    }
    const user = this.data.users.find(u => u.id === id || u.username === id);
    if (user) {
      user.passwordHash = passwordHash;
      user.mustChangePassword = !!mustChangePassword;
      this.save();
      return user;
    }
    return null;
  }

  deleteUser(id) {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id && u.username !== id);
    if (this.data.users.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  authenticate(username, password) {
    const cleanUser = username.trim().toLowerCase();
    const user = this.data.users.find(u => u.username === cleanUser);
    if (!user) return null;

    const hash = this.hashPassword(password);
    if (user.passwordHash && user.passwordHash !== hash) {
      return null;
    }
    return user;
  }

  // Classes
  getClasses() {
    return [...(this.data.classes || [])].sort((a, b) => {
      const numA = parseInt(String(a.name || '').match(/^(\d+)/)?.[1] || (a.grade != null ? String(a.grade) : '999'), 10);
      const numB = parseInt(String(b.name || '').match(/^(\d+)/)?.[1] || (b.grade != null ? String(b.grade) : '999'), 10);
      if (numA !== numB) return numA - numB;
      return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' });
    });
  }

  promoteSchoolYear() {
    let promotedCount = 0;
    let graduatedCount = 0;
    (this.data.classes || []).forEach(cls => {
      const rawGrade = cls.grade ?? parseInt(cls.name.match(/^(\d+)/)?.[1] || '0', 10);
      if (!rawGrade) return;
      if (rawGrade >= 12) {
        if (!cls.name.startsWith('[Cựu HS]')) cls.name = `[Cựu HS] ${cls.name}`;
        cls.grade = null;
        graduatedCount++;
      } else {
        const nextGrade = rawGrade + 1;
        cls.name = cls.name.replace(new RegExp(`^${rawGrade}`), String(nextGrade));
        cls.grade = nextGrade;
        promotedCount++;
      }
    });
    this.save();
    return { success: true, promotedCount, graduatedCount };
  }

  createClass(cls) {
    const name = cls.name.trim();
    const autoGrade = parseInt(name.match(/\d+/)?.[0] || '0', 10) || null;
    const newClass = {
      id: newId('cls'),
      name,
      grade: cls.grade !== undefined && cls.grade !== null && cls.grade !== '' ? Number(cls.grade) : autoGrade,
      teacher: cls.teacher || "Giáo viên",
      joinCode: (cls.joinCode || Math.random().toString(36).substring(2, 8)).toUpperCase()
    };
    this.data.classes.push(newClass);
    this.save();
    return newClass;
  }

  // Submissions
  getSubmissions(filter = {}) {
    let list = [...this.data.submissions];
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
    return list
      .map(s => {
        if (s.contestId && !s.contestTitle) {
          const c = this.getContest(s.contestId);
          if (c) s.contestTitle = c.title;
        }
        return s;
      })
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  getSubmission(id) {
    const s = this.data.submissions.find(s => s.id === id);
    if (!s) return null;
    if (s.contestId && !s.contestTitle) {
      const c = this.getContest(s.contestId);
      if (c) s.contestTitle = c.title;
    }
    return s;
  }

  createSubmission(sub) {
    let contestTitle = sub.contestTitle || '';
    if (!contestTitle && sub.contestId) {
      const c = this.getContest(sub.contestId);
      if (c) contestTitle = c.title;
    }
    const newSub = {
      id: newId('sub'),
      userId: sub.userId,
      userName: sub.userName || "Học sinh",
      className: sub.className || (this.data.contest_attendance?.[sub.contestId]?.[sub.userId]?.className) || '',
      problemId: sub.problemId,
      problemCode: sub.problemCode,
      code: sub.code,
      status: "QUEUED",
      score: 0,
      passedTests: 0,
      totalTests: sub.totalTests || 0,
      executionTime: 0,
      memoryUsed: 0,
      submittedAt: new Date().toISOString(),
      details: [],
      contestId: sub.contestId || null,
      contestTitle: contestTitle || '',
      isVirtual: !!sub.isVirtual || sub.participationType === 'VIRTUAL',
      participationType: (!!sub.isVirtual || sub.participationType === 'VIRTUAL') ? 'VIRTUAL' : 'REAL',
      virtualSessionId: sub.virtualSessionId || null
    };
    this.data.submissions.unshift(newSub);
    this.save();
    return newSub;
  }

  updateSubmission(id, updates) {
    const idx = this.data.submissions.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.submissions[idx] = { ...this.data.submissions[idx], ...updates };
      const finalStatuses = ['AC', 'WA', 'TLE', 'MLE', 'CE', 'RE', 'SKIPPED'];
      if (updates.status && finalStatuses.includes(updates.status)) {
        this.flushSync();
      } else {
        this.save();
      }
      return this.data.submissions[idx];
    }
    return null;
  }

  normalizeSubmissionScores() {
    const problemsMap = (this.data.problems || []).reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});

    let fixedCount = 0;
    const finalStatuses = ['AC', 'WA', 'TLE', 'MLE', 'CE', 'RE', 'SKIPPED'];

    for (const sub of (this.data.submissions || [])) {
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
        sub.score = correctScore;
        if (Array.isArray(sub.details) && sub.details.length > 0) {
          const eachWeight = Math.round((maxProbPoints / totalTests) * 100) / 100;
          sub.details.forEach(d => {
            if (d.status === 'AC') {
              d.scoreEarned = eachWeight;
            } else {
              d.scoreEarned = 0;
            }
          });
        }
        fixedCount++;
      }
    }

    if (fixedCount > 0) {
      this.flushSync();
      console.log(`⚡ [Database] Đã chuẩn hóa lại điểm số cho ${fixedCount} bài nộp cũ về đúng thang điểm bài.`);
    }
    return { fixedCount, totalSubmissions: (this.data.submissions || []).length };
  }

  // Leaderboard
  getLeaderboard() {
    const userMap = {};
    for (const u of this.data.users.filter(u => u.role === 'user')) {
      userMap[u.id] = {
        userId: u.id,
        userName: u.fullName,
        username: u.username,
        classId: u.classId,
        rating: u.contestRating || 1200,
        ratingHistory: u.ratingHistory || [],
        points: u.points || 0,
        totalScore: 0,
        problemsSolved: 0,
        totalSubmissions: 0,
        solvedProblems: {},
        badges: u.badges || []
      };
    }

    const pretestContestIds = new Set(
      (this.data.contests || [])
        .filter(c => c.scoringMode === 'PRETEST')
        .map(c => c.id)
    );

    for (const sub of this.data.submissions) {
      if (!userMap[sub.userId]) continue;
      if (sub.isVirtual) continue;
      if (sub.contestId && pretestContestIds.has(sub.contestId)) continue;
      userMap[sub.userId].totalSubmissions++;
      const currentScore = userMap[sub.userId].solvedProblems[sub.problemId]?.score || 0;
      if (sub.score > currentScore) {
        userMap[sub.userId].solvedProblems[sub.problemId] = {
          score: sub.score,
          status: sub.status,
          time: sub.executionTime
        };
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
        problemsSolved: solved
      };
    });

    return leaderboard.sort((a, b) => b.totalScore - a.totalScore || b.problemsSolved - a.problemsSolved);
  }

  // ─── Contests Management ──────────────────────────────────────────────────
  getContests() {
    return this.data.contests || [];
  }

  getContest(id) {
    return (this.data.contests || []).find(c => c.id === id);
  }

  createContest(contest) {
    if (!this.data.contests) this.data.contests = [];
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
      id: newId('cnt'),
      title: String(contest.title || "").trim(),
      description: String(contest.description || ""),
      mode: contest.mode || "offline", // "offline" = Mạng LAN phòng máy; "online" = Trực tuyến qua Internet
      scopeType,
      targetGrades,
      targetClasses,
      targetStudents,
      totalScore: Number(contest.totalScore) || 100, // Tổng điểm toàn kỳ thi (mặc định 100)
      memoryLimit: Math.min(5120, Math.max(16, Number(contest.memoryLimit) || 256)), // RAM tối đa 5120 MB (5 GB), mặc định 256 MB
      category: contest.category || "regular",
      classIds: Array.isArray(contest.classIds) ? contest.classIds : (targetClasses || []), // Array of class IDs allowed to take contest ([] = all)
      candidateIds: Array.isArray(contest.candidateIds) ? contest.candidateIds : (targetStudents || []),
      problemIds: Array.isArray(contest.problemIds) ? contest.problemIds : [], // Array of problem IDs in contest
      pdfUrl: contest.pdfUrl || "",
      pdfFileName: contest.pdfFileName || "",
      statementHtml: contest.statementHtml || "",
      _pdfDiskPath: contest._pdfDiskPath || "",
      startTime: contest.startTime || new Date().toISOString(),
      endTime: contest.endTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      durationMinutes: Number(contest.durationMinutes) || 45,
      status: contest.status || "running", // "upcoming" | "running" | "ended"
      gradingMode: contest.gradingMode || "direct", // "direct" | "batch_after_deadline"
      freezeScoreboardMinutes: Number(contest.freezeScoreboardMinutes) || 15,
      pinCode: contest.pinCode ? String(contest.pinCode).trim() : "",
      hideTestDetailsForStudents: contest.hideTestDetailsForStudents !== false,
      requireFreopen: !!contest.requireFreopen,
      allowReopen: contest.allowReopen !== false,
      manualEndOnly: contest.manualEndOnly !== false,
      ioMode: contest.ioMode || (contest.requireFreopen ? 'freopen' : 'stdin'),
      scoringMode: ['LIVE_BEST', 'OLYMPIC_LATEST', 'PRETEST'].includes(contest.scoringMode) ? contest.scoringMode : 'LIVE_BEST',
      ipWhitelist: String(contest.ipWhitelist || '').trim(),
      antiCheat: {
        preventTabSwitch: contest.antiCheat?.preventTabSwitch !== false,
        maxTabViolations: Number(contest.antiCheat?.maxTabViolations) || 3,
        preventCopyPaste: !!contest.antiCheat?.preventCopyPaste
      },
      createdAt: new Date().toISOString()
    };
    this.data.contests.unshift(newContest);
    this.flushSync();
    return newContest;
  }

  updateContest(id, updates) {
    if (!this.data.contests) this.data.contests = [];
    const idx = this.data.contests.findIndex(c => c.id === id);
    if (idx !== -1) {
      const merged = { ...this.data.contests[idx], ...updates };
      if (updates.targetClasses !== undefined) {
        merged.classIds = updates.targetClasses;
      } else if (updates.classIds !== undefined && updates.targetClasses === undefined) {
        merged.targetClasses = updates.classIds;
      }
      if (updates.targetStudents !== undefined) {
        merged.candidateIds = updates.targetStudents;
      } else if (updates.candidateIds !== undefined && updates.targetStudents === undefined) {
        merged.targetStudents = updates.candidateIds;
      }
      if (updates.targetGrades !== undefined) {
        merged.targetGrades = Array.isArray(updates.targetGrades) ? updates.targetGrades.map(Number) : [];
      }
      if (updates.totalScore !== undefined) {
        merged.totalScore = Number(updates.totalScore);
      }
      if (updates.memoryLimit !== undefined) {
        merged.memoryLimit = Math.min(5120, Math.max(16, Number(updates.memoryLimit) || 256));
      }
      if (updates.category !== undefined) {
        merged.category = updates.category;
      }
      if (updates.allowReopen !== undefined) {
        merged.allowReopen = updates.allowReopen !== false;
      }
      if (updates.manualEndOnly !== undefined) {
        merged.manualEndOnly = updates.manualEndOnly !== false;
      }
      if (updates.ioMode !== undefined) {
        merged.ioMode = updates.ioMode;
      }
      if (updates.scoringMode !== undefined) {
        merged.scoringMode = ['LIVE_BEST', 'OLYMPIC_LATEST', 'PRETEST'].includes(updates.scoringMode) ? updates.scoringMode : 'LIVE_BEST';
      }
      this.data.contests[idx] = merged;
      this.flushSync();
      return this.data.contests[idx];
    }
    return null;
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
      const targetGrades = Array.isArray(contest.targetGrades)
        ? contest.targetGrades.map(Number)
        : (contest.targetGrade ? [Number(contest.targetGrade)] : []);
      if (targetGrades.length === 0) return true;

      const allClasses = this.getClasses() || [];
      return studentClasses.some(cId => {
        const cls = allClasses.find(c => c.id === cId || c.name === cId);
        const grade = cls && cls.grade !== undefined && cls.grade !== null 
          ? Number(cls.grade) 
          : parseInt(String(cls ? cls.name : cId).match(/\d+/)?.[0] || '0', 10);
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

  deleteContest(id) {
    if (!this.data.contests) return false;
    const initialLen = this.data.contests.length;
    this.data.contests = this.data.contests.filter(c => c.id !== id);
    if (this.data.contests.length !== initialLen) {
      this.flushSync();
      return true;
    }
    return false;
  }

  getContestLeaderboard(contestId, isVirtual = false, options = {}) {
    const contest = this.getContest(contestId);
    if (!contest) return [];

    const classMap = {};
    (this.data.classes || []).forEach(c => { classMap[c.id] = c.name; });

    // Xác định xem kỳ thi có chỉ định phạm vi cụ thể (lớp/khối/danh sách học sinh) hay không
    const scopeType = (contest.scopeType || '').toUpperCase();
    const hasSpecificScope = (
      (scopeType === 'GRADE' && ((contest.targetGrades && contest.targetGrades.length > 0) || contest.targetGrade)) ||
      (scopeType === 'CLASS' && ((contest.targetClasses && contest.targetClasses.length > 0) || (contest.classIds && contest.classIds.length > 0))) ||
      (scopeType === 'STUDENT' && ((contest.targetStudents && contest.targetStudents.length > 0) || (contest.candidateIds && contest.candidateIds.length > 0))) ||
      ((!scopeType || scopeType === 'ALL') && ((contest.classIds && contest.classIds.length > 0) || (contest.candidateIds && contest.candidateIds.length > 0)))
    );

    // Lọc chỉ những thí sinh được phép tham gia kỳ thi này
    let eligibleUsers = this.data.users.filter(u => {
      if (u.role !== 'user') return false;
      if (isVirtual) return true; // Với thi ảo: cho phép học sinh tham gia thi ảo
      // Kỳ thi thật: BẮT BUỘC học sinh phải được phân bổ tham gia kỳ thi
      const att = this.data.contest_attendance?.[contestId]?.[u.id];
      if (att) return true;
      return this.isStudentEligible(u, contest);
    });

    const eligibleUserIds = new Set(eligibleUsers.map(u => u.id));

    const userMap = {};
    for (const u of eligibleUsers) {
      const att = this.data.contest_attendance?.[contestId]?.[u.id];
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

    // Submissions for this contest: strictly separate official vs virtual!
    const contestSubs = this.data.submissions.filter(s => {
      const matchContest = s.contestId === contestId;
      if (!matchContest) return false;

      // Phân tách triệt để: Kỳ thi thật KHÔNG ĐƯỢC chứa bài thi ảo
      if (isVirtual) {
        if (!s.isVirtual && !s.virtualSessionId && s.participationType !== 'VIRTUAL') return false;
      } else {
        if (s.isVirtual || s.virtualSessionId || s.participationType === 'VIRTUAL') return false;
        // Chỉ thí sinh được phân bổ tham gia kỳ thi mới được tính bài nộp
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

    // Group submissions by user and problem
    const userProblemSubs = {};
    for (const sub of contestSubs) {
      if (!userMap[sub.userId]) {
        if (isVirtual) {
          // Add user to virtual map if not initially in userMap
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
          // Kỳ thi thật: Bỏ qua tuyệt đối thí sinh không thuộc danh sách được tham gia
          continue;
        }
      }
      userMap[sub.userId].totalSubmissions++;
      if (!userProblemSubs[sub.userId]) userProblemSubs[sub.userId] = {};
      if (!userProblemSubs[sub.userId][sub.problemId]) userProblemSubs[sub.userId][sub.problemId] = [];
      userProblemSubs[sub.userId][sub.problemId].push(sub);
    }

    // Resolve final submission per problem according to contest scoringMode
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

    // Lọc kết quả trả về:
    // - Với thi ảo: chỉ lấy thí sinh có làm bài thi ảo (totalSubmissions > 0)
    // - Với kỳ thi thật mở toàn trường: chỉ hiển thị thí sinh có tham gia (nộp bài hoặc điểm danh)
    // - Với kỳ thi thật có chỉ định lớp/khối/danh sách cụ thể: hiển thị đầy đủ danh sách thí sinh thuộc phạm vi đó
    const result = isVirtual 
      ? leaderboard.filter(u => u.totalSubmissions > 0)
      : hasSpecificScope 
      ? leaderboard 
      : leaderboard.filter(u => u.totalSubmissions > 0 || this.data.contest_attendance?.[contestId]?.[u.userId]);

    return result.sort((a, b) => b.totalScore - a.totalScore || b.problemsSolved - a.problemsSolved);
  }

  // ─── Codeforces Contest Rating Engine ──────────────────────────────────────
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
    contest.ratingsCalculatedAt = Date.now();
    this.save();

    return { success: true, count: changes.length, changes };
  }

  // ─── Student Rating Leaderboard (Codeforces) ──────────────────────────────
  getRatingLeaderboard(filterClassId = null) {
    const users = (this.data.users || []).filter(u => u.role === 'user' || !u.role || u.role === 'student');
    const classes = this.data.classes || [];
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

  // ─── Student Transcript / Report Card ──────────────────────────────────────
  getStudentTranscript(userId) {
    const user = this.getUser(userId);
    if (!user) return null;

    const userSubs = (this.data.submissions || []).filter(s => s.userId === userId && !s.isVirtual);
    const contests = this.getContests() || [];
    const problems = this.getProblems() || [];
    const probMap = {};
    problems.forEach(p => { probMap[p.id] = p; });

    const transcriptContests = [];
    let totalScoreSum = 0;

    for (const contest of contests) {
      const contestSubs = userSubs.filter(s => s.contestId === contest.id);
      const isAttended = (this.data.contest_attendance?.[contest.id]?.[userId]) || contestSubs.length > 0;
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

  // Virtual Session Management
  createVirtualSession({ userId, userName, contestId, durationMinutes }) {
    if (!this.data.virtual_sessions) this.data.virtual_sessions = [];
    const contest = this.getContest(contestId);
    const duration = durationMinutes || (contest ? contest.durationMinutes : 90);
    const now = Date.now();
    const session = {
      id: newId('vs'),
      userId,
      userName,
      contestId,
      contestTitle: contest ? contest.title : 'Kỳ thi',
      startTime: new Date(now).toISOString(),
      endTime: new Date(now + duration * 60 * 1000).toISOString(),
      durationMinutes: duration,
      status: 'running',
      allowReopen: contest ? contest.allowReopen !== false : true,
      score: 0,
      problemsSolved: 0,
      totalSubmissions: 0,
      lastActiveAt: new Date(now).toISOString(),
      createdAt: new Date().toISOString()
    };
    this.data.virtual_sessions.push(session);
    this.save();
    return session;
  }

  getVirtualSessions({ userId, contestId } = {}) {
    if (!this.data.virtual_sessions) this.data.virtual_sessions = [];
    return this.data.virtual_sessions.filter(vs => {
      if (userId && vs.userId !== userId) return false;
      if (contestId && vs.contestId !== contestId) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getVirtualSession(id) {
    if (!this.data.virtual_sessions) this.data.virtual_sessions = [];
    return this.data.virtual_sessions.find(vs => vs.id === id);
  }

  leaveVirtualSession(id) {
    const session = this.getVirtualSession(id);
    if (!session) return null;
    if (session.status === 'running') {
      session.status = 'left';
    }
    session.lastActiveAt = new Date().toISOString();
    this.save();
    return session;
  }

  resumeVirtualSession(id) {
    const session = this.getVirtualSession(id);
    if (!session) return null;
    if (session.status === 'left') {
      session.status = 'running';
    }
    session.lastActiveAt = new Date().toISOString();
    this.save();
    return session;
  }

  getActiveVirtualSession(userId) {
    if (!this.data.virtual_sessions) this.data.virtual_sessions = [];
    const now = Date.now();
    const session = this.data.virtual_sessions.find(vs => 
      vs.userId === userId && (vs.status === 'running' || vs.status === 'left')
    );
    if (!session) return null;
    const end = new Date(session.endTime).getTime();
    if (now > end) {
      return this.finishVirtualSession(session.id, 'timeout');
    }
    return session;
  }

  finishVirtualSession(id, endReason = 'manual') {
    const session = this.getVirtualSession(id);
    if (!session) return null;
    session.status = endReason === 'timeout' ? 'timeout' : 'completed';
    session.endReason = endReason;
    session.endedAt = new Date().toISOString();
    session.lastActiveAt = session.endedAt;
    const sessionSubs = this.data.submissions.filter(s => s.virtualSessionId === id);
    const probMap = {};
    for (const sub of sessionSubs) {
      if (!probMap[sub.problemId] || sub.score > probMap[sub.problemId].score) {
        probMap[sub.problemId] = sub;
      }
    }
    let totalScore = 0;
    let solved = 0;
    for (const pId in probMap) {
      totalScore += probMap[pId].score || 0;
      if (probMap[pId].status === 'AC') solved++;
    }
    session.score = totalScore;
    session.problemsSolved = solved;
    session.totalSubmissions = sessionSubs.length;
    this.save();
    return session;
  }

  // Student Exam History & Portfolio
  getUserExamHistory(userId) {
    const history = [];
    const contests = this.data.contests || [];
    for (const contest of contests) {
      const attendance = (this.data.contest_attendance?.[contest.id]?.[userId]) || null;
      const isCandidate = (contest.candidateIds && contest.candidateIds.includes(userId)) ||
        (!contest.candidateIds || contest.candidateIds.length === 0);
      const userSubs = (this.data.submissions || []).filter(s => s.contestId === contest.id && s.userId === userId && !s.isVirtual);
      
      if (attendance || userSubs.length > 0 || isCandidate) {
        const lb = this.getContestLeaderboard(contest.id);
        const myEntry = lb.find(e => e.userId === userId);
        const myRank = myEntry ? lb.findIndex(e => e.userId === userId) + 1 : 0;

        const contestProblems = (contest.problemIds || []).map(pId => this.getProblem(pId)).filter(Boolean);
        let maxScore = 0;
        if (contestProblems.length > 0) {
          maxScore = contestProblems.reduce((sum, p) => sum + (Number(p.points) || 100), 0);
        } else {
          maxScore = Number(contest.totalScore) || 100;
        }
        if (maxScore <= 0) maxScore = 100;

        const score = myEntry ? myEntry.totalScore : 0;
        const scorePercentage = Math.round((score / maxScore) * 1000) / 10;
        const isParticipated = !!(userSubs.length > 0 || (attendance && (attendance.status === 'present' || attendance.status === 'submitted' || attendance.joinedAt)));
        
        history.push({
          contestId: contest.id,
          contestTitle: contest.title,
          date: contest.startTime,
          score,
          maxScore,
          totalScore: maxScore,
          scorePercentage,
          rank: myRank,
          totalParticipants: lb.length,
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

  // Contest Attendance & Candidate Whitelist
  getContestAttendanceRecord(contestId, userId) {
    const record = this.data.contest_attendance?.[contestId]?.[userId];
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
    if (!this.data.contest_attendance) this.data.contest_attendance = {};
    if (!this.data.contest_attendance[contestId]) this.data.contest_attendance[contestId] = {};
    const attMap = this.data.contest_attendance[contestId];

    const classMap = {};
    (this.data.classes || []).forEach(c => { classMap[c.id] = c.name; });

    const allStudents = this.data.users.filter(u => u.role !== 'host');
    let candidateUsers = [];
    if (contest.candidateIds && contest.candidateIds.length > 0) {
      candidateUsers = allStudents.filter(u => contest.candidateIds.includes(u.id));
    } else if (contest.classIds && contest.classIds.length > 0) {
      candidateUsers = allStudents.filter(u => contest.classIds.includes(u.classId));
    } else {
      candidateUsers = allStudents;
    }

    const contestSubs = (this.data.submissions || []).filter(s => s.contestId === contestId && !s.isVirtual);

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

      const displayClass = record.className || (classMap[u.classId] || u.classId || '');

      return {
        userId: u.id,
        username: u.username,
        fullName: u.fullName,
        classId: u.classId,
        className: displayClass,
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
    if (!this.data.contest_attendance) this.data.contest_attendance = {};
    if (!this.data.contest_attendance[contestId]) this.data.contest_attendance[contestId] = {};
    
    const existing = this.data.contest_attendance[contestId][userId] || { status: 'present', extraMinutes: 0, reason: '', reopened: false };
    if (data.status) existing.status = data.status;
    if (data.joinedAt && !existing.joinedAt) existing.joinedAt = data.joinedAt;
    if (data.reason !== undefined) existing.reason = data.reason;
    if (data.extraMinutes !== undefined) existing.extraMinutes = Number(data.extraMinutes) || 0;
    if (data.ip) existing.ip = data.ip;
    if (data.lastActive) existing.lastActive = data.lastActive;
    if (data.reopened !== undefined) existing.reopened = !!data.reopened;
    if (data.className !== undefined) existing.className = String(data.className).trim();
    if (data.enteredClassName !== undefined) existing.enteredClassName = String(data.enteredClassName).trim();

    this.data.contest_attendance[contestId][userId] = existing;
    this.save();
    return existing;
  }

  addExtraTime(contestId, userId, extraMinutes = 5) {
    if (!this.data.contest_attendance) this.data.contest_attendance = {};
    if (!this.data.contest_attendance[contestId]) this.data.contest_attendance[contestId] = {};
    
    const existing = this.data.contest_attendance[contestId][userId] || { status: 'present', extraMinutes: 0, reason: '', reopened: false };
    existing.extraMinutes = (existing.extraMinutes || 0) + Number(extraMinutes);
    this.data.contest_attendance[contestId][userId] = existing;
    this.save();
    return existing;
  }

  reopenContestForUser(contestId, userId) {
    if (!this.data.contest_attendance) this.data.contest_attendance = {};
    if (!this.data.contest_attendance[contestId]) this.data.contest_attendance[contestId] = {};
    
    const existing = this.data.contest_attendance[contestId][userId] || { status: 'present', extraMinutes: 0, reason: '', reopened: false };
    existing.status = 'present';
    existing.reopened = true;
    if (existing.joinedAt) existing.joinedAt = new Date().toISOString();
    this.data.contest_attendance[contestId][userId] = existing;

    const vs = (this.data.virtual_sessions || []).find(v => v.contestId === contestId && v.userId === userId && v.status === 'completed');
    if (vs) {
      vs.status = 'running';
    }

    this.save();
    return existing;
  }

  updateContestCandidates(contestId, candidateIds = []) {
    const contest = this.getContest(contestId);
    if (!contest) return null;
    contest.candidateIds = candidateIds;
    this.save();
    return contest;
  }

  // Official Report: Strictly participationType === 'REAL' (excludes virtual!)
  getOfficialContestReport(contestId) {
    const contest = this.getContest(contestId);
    if (!contest) return null;

    // Nếu giáo viên đã chỉnh sửa báo cáo điểm và lưu lại, ưu tiên trả về bản đã chỉnh sửa
    if (contest.customOfficialReport && Array.isArray(contest.customOfficialReport.rows)) {
      return {
        ...contest.customOfficialReport,
        contestId: contest.id,
        contestTitle: contest.customOfficialReport.contestTitle || contest.title,
        isCustom: true
      };
    }

    const classMap = {};
    (this.data.classes || []).forEach(c => { classMap[c.id] = c.name; });

    const contestProblems = (contest.problemIds || []).map(pId => {
      const prob = this.getProblem(pId);
      return {
        id: pId,
        code: prob?.code || pId,
        title: prob?.title || prob?.code || pId,
        points: Number(prob?.points) || 100
      };
    });

    // Official Leaderboard (isVirtual = false)
    const officialLeaderboard = this.getContestLeaderboard(contestId, false);

    // Filter to only candidates who actually participated or submitted official code
    // Sort by Total Score DESC, then solved problems DESC, then student name ASC
    const participants = officialLeaderboard
      .filter(u => u.totalSubmissions > 0 || u.totalScore > 0)
      .sort((a, b) => b.totalScore - a.totalScore || b.problemsSolved - a.problemsSolved || (a.userName || '').localeCompare(b.userName || ''));

    const rows = participants.map((item, idx) => {
      const problemScores = {};
      contestProblems.forEach(p => {
        problemScores[p.id] = item.solvedProblems?.[p.id]?.score ?? 0;
      });

      const att = this.data.contest_attendance?.[contestId]?.[item.userId];
      // Chỉ lấy lớp mà khi vào kỳ thi học sinh nhập, không hiện các lớp được tick sẵn (user.classId / u.classes)
      const enteredClassName = (att?.enteredClassName || att?.className || '').trim();

      return {
        stt: idx + 1,
        userId: item.userId,
        fullName: item.userName,
        className: enteredClassName || '-',
        score: item.totalScore,
        problemScores,
        problemsSolved: item.problemsSolved,
        totalSubmissions: item.totalSubmissions,
        participationType: 'REAL'
      };
    });

    return {
      contestId: contest.id,
      contestTitle: contest.title,
      startTime: contest.startTime,
      endTime: contest.endTime,
      totalScore: contest.totalScore || 100,
      participantCount: rows.length,
      problems: contestProblems,
      rows,
      isCustom: false
    };
  }

  saveOfficialContestReport(contestId, reportData) {
    const contest = this.getContest(contestId);
    if (!contest) return null;
    contest.customOfficialReport = {
      ...reportData,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return { ...contest.customOfficialReport, isCustom: true };
  }

  resetOfficialContestReport(contestId) {
    const contest = this.getContest(contestId);
    if (!contest) return null;
    delete contest.customOfficialReport;
    this.save();
    return this.getOfficialContestReport(contestId);
  }

  // ==================== ACHIEVEMENTS ====================
  getAchievements() {
    return this.data.achievements || [];
  }

  getAchievement(id) {
    return (this.data.achievements || []).find(a => a.id === id || a.code === id);
  }

  createAchievement(data) {
    const ach = {
      id: data.id || ('ach_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
      code: data.code || ('ACH_' + Date.now()),
      name: data.name || 'Thành tựu mới',
      description: data.description || '',
      icon: data.icon || '🏆',
      category: data.category || 'SPECIAL',
      conditionType: data.conditionType || 'MANUAL',
      conditionValue: Number(data.conditionValue) || 1,
      points: Number(data.points) || 10,
      rarity: data.rarity || 'COMMON',
      isActive: data.isActive !== undefined ? !!data.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.achievements = this.data.achievements || [];
    this.data.achievements.push(ach);
    this.save();
    return ach;
  }

  updateAchievement(id, updates) {
    const ach = this.getAchievement(id);
    if (!ach) return null;
    Object.assign(ach, updates, { updatedAt: new Date().toISOString() });
    if (updates.points !== undefined) ach.points = Number(updates.points);
    if (updates.conditionValue !== undefined) ach.conditionValue = Number(updates.conditionValue);
    this.save();
    return ach;
  }

  deleteAchievement(id) {
    const idx = (this.data.achievements || []).findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.data.achievements.splice(idx, 1);
    this.save();
    return true;
  }

  getStudentAchievements(studentId) {
    return (this.data.student_achievements || []).filter(sa => sa.studentId === studentId);
  }

  awardAchievement(studentId, achievementId) {
    const existing = (this.data.student_achievements || []).find(
      sa => sa.studentId === studentId && sa.achievementId === achievementId
    );
    if (existing) return existing;

    const ach = this.getAchievement(achievementId);
    if (!ach || !ach.isActive) return null;

    const award = {
      id: 'sa_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      studentId,
      achievementId,
      awardedAt: new Date().toISOString()
    };
    this.data.student_achievements = this.data.student_achievements || [];
    this.data.student_achievements.push(award);

    // Add points to user profile
    const user = this.getUser(studentId);
    if (user) {
      user.points = (user.points || 0) + (ach.points || 0);
    }
    this.save();
    return award;
  }

  checkAndAwardAchievements(studentId) {
    if (!studentId) return [];
    const user = this.getUser(studentId);
    if (!user) return [];

    const existingAwards = new Set(
      (this.data.student_achievements || [])
        .filter(sa => sa.studentId === studentId)
        .map(sa => sa.achievementId)
    );

    const submissions = this.getSubmissions({ userId: studentId });
    const acSubmissions = submissions.filter(s => s.status === 'Accepted');
    const solvedProblemIds = new Set(acSubmissions.map(s => s.problemId));
    const contestIds = new Set(submissions.filter(s => s.contestId).map(s => s.contestId));

    const newlyAwarded = [];
    const allAchievements = this.getAchievements();

    for (const ach of allAchievements) {
      if (!ach.isActive) continue;
      if (existingAwards.has(ach.id)) continue;

      let eligible = false;
      const targetVal = ach.conditionValue || 1;

      switch (ach.conditionType) {
        case 'FIRST_SUBMISSION':
          eligible = submissions.length >= 1;
          break;
        case 'FIRST_AC':
          eligible = acSubmissions.length >= 1;
          break;
        case 'AC_COUNT':
          eligible = acSubmissions.length >= targetVal;
          break;
        case 'SUBMISSION_COUNT':
          eligible = submissions.length >= targetVal;
          break;
        case 'SOLVE_COUNT':
          eligible = solvedProblemIds.size >= targetVal;
          break;
        case 'CONTEST_COUNT':
          eligible = contestIds.size >= targetVal;
          break;
        case 'POINTS':
          eligible = (user.points || 0) >= targetVal;
          break;
        default:
          break;
      }

      if (eligible) {
        const award = this.awardAchievement(studentId, ach.id);
        if (award) {
          existingAwards.add(ach.id);
          newlyAwarded.push({ ...award, achievement: ach });
        }
      }
    }

    return newlyAwarded;
  }

  // ==================== REWARDS ====================
  getRewards() {
    return this.data.rewards || [];
  }

  getReward(id) {
    return (this.data.rewards || []).find(r => r.id === id);
  }

  createReward(data) {
    const reward = {
      id: data.id || ('rew_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
      name: data.name || 'Phần thưởng mới',
      description: data.description || '',
      icon: data.icon || '🎁',
      image: data.image || '',
      pointsRequired: Number(data.pointsRequired) || 50,
      stock: Number(data.stock) !== undefined ? Number(data.stock) : 10,
      isActive: data.isActive !== undefined ? !!data.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.rewards = this.data.rewards || [];
    this.data.rewards.push(reward);
    this.save();
    return reward;
  }

  updateReward(id, updates) {
    const reward = this.getReward(id);
    if (!reward) return null;
    Object.assign(reward, updates, { updatedAt: new Date().toISOString() });
    if (updates.pointsRequired !== undefined) reward.pointsRequired = Number(updates.pointsRequired);
    if (updates.stock !== undefined) reward.stock = Math.max(0, Number(updates.stock));
    this.save();
    return reward;
  }

  deleteReward(id) {
    const idx = (this.data.rewards || []).findIndex(r => r.id === id);
    if (idx === -1) return false;
    this.data.rewards.splice(idx, 1);
    this.save();
    return true;
  }

  redeemReward(studentId, rewardId) {
    const reward = this.getReward(rewardId);
    if (!reward || !reward.isActive) {
      throw new Error('Phần thưởng không tồn tại hoặc đã tạm dừng đổi');
    }
    if (reward.stock <= 0) {
      throw new Error('Phần thưởng đã hết hàng trong kho');
    }
    const user = this.getUser(studentId);
    if (!user) {
      throw new Error('Không tìm thấy tài khoản người dùng');
    }
    const currentPoints = user.points || 0;
    if (currentPoints < reward.pointsRequired) {
      throw new Error(`Bạn cần ${reward.pointsRequired} điểm để đổi, hiện chỉ có ${currentPoints} điểm`);
    }

    // Deduct stock and points safely
    reward.stock -= 1;
    user.points = currentPoints - reward.pointsRequired;

    const redemption = {
      id: 'red_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      studentId,
      studentName: user.name || user.username,
      rewardId: reward.id,
      rewardName: reward.name,
      rewardIcon: reward.icon || '🎁',
      pointsSpent: reward.pointsRequired,
      status: 'PENDING',
      requestedAt: new Date().toISOString()
    };

    this.data.reward_redemptions = this.data.reward_redemptions || [];
    this.data.reward_redemptions.unshift(redemption);
    this.save();
    return redemption;
  }

  getRewardRedemptions(studentId = null) {
    const list = this.data.reward_redemptions || [];
    if (studentId) {
      return list.filter(r => r.studentId === studentId);
    }
    return list;
  }

  updateRedemptionStatus(redemptionId, status) {
    const red = (this.data.reward_redemptions || []).find(r => r.id === redemptionId);
    if (!red) return null;
    const oldStatus = red.status;
    red.status = status;
    red.processedAt = new Date().toISOString();

    // If rejected, refund points & stock
    if (status === 'REJECTED' && oldStatus !== 'REJECTED') {
      const user = this.getUser(red.studentId);
      if (user) {
        user.points = (user.points || 0) + (red.pointsSpent || 0);
      }
      const reward = this.getReward(red.rewardId);
      if (reward) {
        reward.stock += 1;
      }
    }
    this.save();
    return red;
  }
  // ─── ROADMAP METHODS (STAGES, LESSONS, CHECKPOINTS & PROGRESS) ──────────────
  getRoadmapStages() {
    if (!this.data.roadmap_stages || !Array.isArray(this.data.roadmap_stages) || this.data.roadmap_stages.length === 0) {
      this.data.roadmap_stages = JSON.parse(JSON.stringify(ROADMAP_STAGES));
      this.save();
    }
    return (this.data.roadmap_stages || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getRoadmapStage(id) {
    return this.getRoadmapStages().find(s => s.id === id) || null;
  }

  getRoadmapLessons(stageId = null) {
    if (!this.data.roadmap_lessons || !Array.isArray(this.data.roadmap_lessons) || this.data.roadmap_lessons.length === 0) {
      this.data.roadmap_lessons = JSON.parse(JSON.stringify(ROADMAP_LESSONS));
      this.save();
    }
    let list = this.data.roadmap_lessons || [];
    if (stageId) {
      list = list.filter(l => l.stageId === stageId);
    }
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getRoadmapLesson(id) {
    return this.getRoadmapLessons().find(l => l.id === id) || null;
  }

  attachProblemToLesson(lessonId, problemCodeOrId) {
    const lessons = this.getRoadmapLessons();
    const target = lessons.find(l => l.id === lessonId);
    if (!target) return null;

    const prob = this.getProblems().find(p => p.code === problemCodeOrId || p.id === problemCodeOrId);
    if (!prob) {
      target.problemCode = problemCodeOrId;
      target.problemId = null;
    } else {
      target.problemCode = prob.code;
      target.problemId = prob.id;
    }

    this.data.roadmap_lessons = lessons;
    this.save();
    return target;
  }

  detachProblemFromLesson(lessonId) {
    const lessons = this.getRoadmapLessons();
    const target = lessons.find(l => l.id === lessonId);
    if (!target) return null;

    target.problemCode = null;
    target.problemId = null;
    this.data.roadmap_lessons = lessons;
    this.save();
    return target;
  }

  markLessonDone(userId, lessonId) {
    if (!userId || !lessonId) return false;
    this.data.roadmap_user_progress = this.data.roadmap_user_progress || {};
    if (!this.data.roadmap_user_progress[userId]) {
      this.data.roadmap_user_progress[userId] = { completedLessonIds: [], testedOutStageIds: [] };
    }
    const prog = this.data.roadmap_user_progress[userId];
    prog.completedLessonIds = prog.completedLessonIds || [];
    if (!prog.completedLessonIds.includes(lessonId)) {
      prog.completedLessonIds.push(lessonId);
      this.save();
    }
    return true;
  }

  testOutStage(userId, stageId) {
    if (!userId || !stageId) return false;
    this.data.roadmap_user_progress = this.data.roadmap_user_progress || {};
    if (!this.data.roadmap_user_progress[userId]) {
      this.data.roadmap_user_progress[userId] = { completedLessonIds: [], testedOutStageIds: [] };
    }
    const prog = this.data.roadmap_user_progress[userId];
    prog.testedOutStageIds = prog.testedOutStageIds || [];
    if (!prog.testedOutStageIds.includes(stageId)) {
      prog.testedOutStageIds.push(stageId);
      this.save();
    }
    return true;
  }

  getUnlinkedLessons() {
    return this.getRoadmapLessons().filter(l => !l.problemCode && !l.problemId);
  }

  computeRoadmapProgress(userId) {
    const stages = this.getRoadmapStages();
    const lessons = this.getRoadmapLessons();
    const problems = this.getProblems();
    const probMap = new Map();
    const probIdMap = new Map();
    problems.forEach(p => {
      probMap.set(p.code, p);
      probIdMap.set(p.id, p);
    });

    const user = userId ? this.getUser(userId) : null;
    const userSubs = userId ? this.getSubmissions().filter(s => s.userId === userId) : [];
    const bestScores = new Map();
    const isPassed = new Set();

    userSubs.forEach(s => {
      const code = s.problemCode;
      const pid = s.problemId;
      const score = s.score || 0;
      if (code) {
        if (score > (bestScores.get(code) || 0)) bestScores.set(code, score);
        if (s.status === 'AC' || score >= 100) isPassed.add(code);
      }
      if (pid) {
        if (score > (bestScores.get(pid) || 0)) bestScores.set(pid, score);
        if (s.status === 'AC' || score >= 100) isPassed.add(pid);
      }
    });

    const userProgress = (this.data.roadmap_user_progress && userId && this.data.roadmap_user_progress[userId]) || {
      completedLessonIds: [],
      testedOutStageIds: []
    };
    const customDone = new Set(userProgress.completedLessonIds || []);
    const testedOutStages = new Set(userProgress.testedOutStageIds || []);

    // 1. Initial lesson evaluation
    const lessonStatusMap = new Map();
    const processedLessons = lessons.map(lesson => {
      const prob = (lesson.problemCode && probMap.get(lesson.problemCode)) || 
                   (lesson.problemId && probIdMap.get(lesson.problemId)) || null;

      let status = 'not_started';
      let userScore = 0;

      if (testedOutStages.has(lesson.stageId) || customDone.has(lesson.id)) {
        status = 'done';
        userScore = 100;
      } else if (prob) {
        const passed = isPassed.has(prob.code) || isPassed.has(prob.id);
        const score = Math.max(bestScores.get(prob.code) || 0, bestScores.get(prob.id) || 0);
        userScore = score;
        if (passed) {
          status = 'done';
        } else if (score > 0 || userSubs.some(s => s.problemCode === prob.code || s.problemId === prob.id)) {
          status = 'in_progress';
        }
      } else {
        if (customDone.has(lesson.id)) {
          status = 'done';
          userScore = 100;
        }
      }

      lessonStatusMap.set(lesson.id, status);

      return {
        ...lesson,
        status,
        userScore,
        problem: prob ? {
          id: prob.id,
          code: prob.code,
          title: prob.title,
          difficulty: prob.difficulty,
          points: prob.points
        } : null
      };
    });

    const lessonMap = new Map(processedLessons.map(l => [l.id, l]));

    // 2. Compute Stage statuses and unlocks sequentially
    let prevStagePassed = true; // Stage 1 is always unlocked
    const stageMap = new Map();

    const processedStages = stages.map((stage, idx) => {
      const stageLessons = processedLessons.filter(l => l.stageId === stage.id);
      const isTestedOut = testedOutStages.has(stage.id);

      // Checkpoint evaluation
      const checkpointProbKeys = stage.checkpoint && Array.isArray(stage.checkpoint.problemIds) ? stage.checkpoint.problemIds : [];
      let checkpointScore = 0;
      let checkpointPassed = false;

      if (isTestedOut) {
        checkpointScore = 100;
        checkpointPassed = true;
      } else if (checkpointProbKeys.length > 0) {
        let totalScore = 0;
        checkpointProbKeys.forEach(key => {
          const score = Math.max(bestScores.get(key) || 0, isPassed.has(key) ? 100 : 0);
          totalScore += score;
        });
        checkpointScore = Math.round(totalScore / checkpointProbKeys.length);
        checkpointPassed = checkpointScore >= (stage.checkpoint.passScore || 70);
      } else {
        // If checkpoint has no problems yet, check completed lessons
        const total = stageLessons.length;
        const done = stageLessons.filter(l => l.status === 'done').length;
        checkpointScore = total > 0 ? Math.round((done / total) * 100) : 100;
        checkpointPassed = checkpointScore >= (stage.checkpoint.passScore || 70);
      }

      const completedCount = stageLessons.filter(l => l.status === 'done').length;
      const totalCount = stageLessons.length;
      const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      const completed = isTestedOut || (completedCount === totalCount && totalCount > 0);

      // Stage unlocked if it is stage 1 OR previous stage passed checkpoint/tested-out
      const unlocked = idx === 0 || prevStagePassed;

      // Update prevStagePassed for next stage
      prevStagePassed = checkpointPassed || isTestedOut || completed;

      const stageObj = {
        ...stage,
        unlocked,
        completed,
        testedOut: isTestedOut,
        checkpointScore,
        checkpointPassed,
        completedLessonCount: completedCount,
        totalLessonCount: totalCount,
        progressPercent
      };

      stageMap.set(stage.id, stageObj);
      return stageObj;
    });

    // 3. Compute lesson unlocks based on stage unlock and prerequisites
    const finalLessons = processedLessons.map(lesson => {
      const stage = stageMap.get(lesson.stageId);
      if (!stage || !stage.unlocked) {
        return {
          ...lesson,
          unlocked: false,
          lockReason: `Chặng "${stage ? stage.title : ''}" chưa được mở khóa. Hãy hoàn thành checkpoint chặng trước.`
        };
      }

      const prereqs = lesson.prerequisiteLessonIds || [];
      if (prereqs.length === 0) {
        return {
          ...lesson,
          unlocked: true,
          lockReason: null
        };
      }

      const missing = prereqs.filter(pId => lessonStatusMap.get(pId) !== 'done');
      if (missing.length === 0) {
        return {
          ...lesson,
          unlocked: true,
          lockReason: null
        };
      }

      const missingTitles = missing.map(pId => lessonMap.get(pId)?.title || pId).join(', ');
      return {
        ...lesson,
        unlocked: false,
        lockReason: `Cần hoàn thành bài học tiên quyết: ${missingTitles}`
      };
    });

    // 4. Find "Continue where you left off" target
    let continueTargetLessonId = null;
    let continueTargetStageId = null;

    for (const stage of processedStages) {
      if (stage.unlocked) {
        const stageLessons = finalLessons.filter(l => l.stageId === stage.id);
        const nextLesson = stageLessons.find(l => l.unlocked && l.status !== 'done');
        if (nextLesson) {
          continueTargetLessonId = nextLesson.id;
          continueTargetStageId = stage.id;
          break;
        }
      }
    }

    if (!continueTargetLessonId && finalLessons.length > 0) {
      const firstUnlocked = finalLessons.find(l => l.unlocked);
      if (firstUnlocked) {
        continueTargetLessonId = firstUnlocked.id;
        continueTargetStageId = firstUnlocked.stageId;
      }
    }

    const totalLessons = finalLessons.length;
    const completedLessons = finalLessons.filter(l => l.status === 'done').length;
    const overallPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const streak = user ? (Number(user.streak) || 0) : 0;
    const allStagesCompleted = processedStages.every(s => s.completed);

    return {
      stages: processedStages,
      lessons: finalLessons,
      summary: {
        overallPercent,
        totalLessons,
        completedLessons,
        streak,
        continueTargetLessonId,
        continueTargetStageId,
        allStagesCompleted
      }
    };
  }

  // Legacy compatibility for old roadmap_topics methods
  getRoadmapTopics() {
    if (!this.data.roadmap_topics || this.data.roadmap_topics.length === 0) {
      this.data.roadmap_topics = JSON.parse(JSON.stringify(ALGORITHM_ROADMAP_TOPICS));
      this.save();
    }
    return (this.data.roadmap_topics || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getRoadmapTopic(id) {
    return this.getRoadmapTopics().find(t => t.id === id) || null;
  }

  createRoadmapTopic(topic) {
    const list = this.getRoadmapTopics();
    const newTopic = {
      ...topic,
      id: topic.id || newId('topic'),
      title: topic.title || 'Chủ đề mới',
      description: topic.description || '',
      guide: topic.guide || '',
      level: topic.level || 'Cơ bản',
      icon: topic.icon || 'Code2',
      order: topic.order !== undefined ? Number(topic.order) : (list.length + 1),
      problemCodes: Array.isArray(topic.problemCodes) ? topic.problemCodes : [],
      createdAt: topic.createdAt || new Date().toISOString()
    };
    list.push(newTopic);
    this.data.roadmap_topics = list;
    this.save();
    return newTopic;
  }

  updateRoadmapTopic(id, updates) {
    const list = this.getRoadmapTopics();
    const idx = list.findIndex(t => t.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, id };
    if (updates.order !== undefined) {
      list[idx].order = Number(updates.order);
    }
    this.data.roadmap_topics = list;
    this.save();
    return list[idx];
  }

  deleteRoadmapTopic(id) {
    const list = this.getRoadmapTopics();
    const filtered = list.filter(t => t.id !== id);
    if (filtered.length === list.length) return false;
    this.data.roadmap_topics = filtered;
    this.save();
    return true;
  }

  // ─── STUDENT CUSTOM CONTESTS & TEST GROUNDS ─────────────────────────────────
  getStudentCustomContests(userId) {
    this.data.student_custom_contests = this.data.student_custom_contests || [];
    if (userId) {
      return this.data.student_custom_contests.filter(c => c.userId === userId);
    }
    return this.data.student_custom_contests;
  }

  getStudentCustomContest(id) {
    this.data.student_custom_contests = this.data.student_custom_contests || [];
    return this.data.student_custom_contests.find(c => c.id === id) || null;
  }

  saveStudentCustomContest(userId, contestData) {
    this.data.student_custom_contests = this.data.student_custom_contests || [];
    const id = contestData.id || newId('custom-contest');
    const existingIdx = this.data.student_custom_contests.findIndex(c => c.id === id);

    const record = {
      ...(existingIdx >= 0 ? this.data.student_custom_contests[existingIdx] : {}),
      ...contestData,
      id,
      userId,
      timeLimit: contestData.timeLimit || 1000,
      memoryLimit: contestData.memoryLimit || 256,
      testCases: Array.isArray(contestData.testCases) ? contestData.testCases : [],
      updatedAt: new Date().toISOString()
    };
    if (!record.createdAt) record.createdAt = new Date().toISOString();

    if (existingIdx >= 0) {
      this.data.student_custom_contests[existingIdx] = record;
    } else {
      this.data.student_custom_contests.unshift(record);
    }
    this.save();
    return record;
  }

  deleteStudentCustomContest(id, userId) {
    this.data.student_custom_contests = this.data.student_custom_contests || [];
    const initialLen = this.data.student_custom_contests.length;
    this.data.student_custom_contests = this.data.student_custom_contests.filter(c => c.id !== id || (userId && c.userId !== userId));
    const deleted = this.data.student_custom_contests.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }
}

module.exports = new Database();
