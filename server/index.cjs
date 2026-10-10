const fs = require('fs');
const path = require('path');

// Tự động nạp cấu hình từ .env (Node v20.12+)
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(envPath);
  } catch (e) {}
}

const crypto = require('crypto');
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const db = require('./database/index.cjs');
const { AuthError, createAuthService, hashPassword, safeUser } = require('./auth.cjs');
const { ContestPolicyError, assertIdentityEligible, assertJoinAllowed, assertSubmissionAllowed, effectiveEndTime, pinsMatch } = require('./contestPolicy.cjs');
const { compareVersions, verifyUpdateArtifact } = require('./updateSecurity.cjs');
const {
  canStudentViewSubmissionDetails,
  sanitizeContestForHost,
  sanitizeContestForStudent,
  sanitizeProblemForHost,
  sanitizeProblemForStudent,
  sanitizeSubmissionForStudent
} = require('./serializers.cjs');
const judge = require('./judge.cjs');
const queue = require('./queue.cjs');
const lan = require('./lanDiscovery.cjs');
const antiCheat = require('./antiCheat.cjs');
const duckdns = require('./duckdns.cjs');
const mammoth = require('mammoth');
const arena = require('./arena.cjs');
const reformParser = require('./reformParser.cjs');

// Read version from package.json dynamically
const APP_VERSION = (() => {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    return pkg.version || '1.0.0';
  } catch (e) {
    return '1.0.0';
  }
})();

const uploadsDir = path.join(db.DATA_DIR || process.cwd(), 'uploads', 'pdfs');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
app.set('trust proxy', true);
const auth = createAuthService(db);
const requireHost = auth.requireRole('host');
app.use((req, res, next) => {
  if (req.url && req.url.includes('//')) {
    req.url = req.url.replace(/\/{2,}/g, '/');
  }
  next();
});
app.use(cors());
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Handle JSON body parse errors (e.g. payload too large) gracefully
app.use((err, req, res, next) => {
  if (err && (err.type === 'entity.too.large' || err.status === 413)) {
    return res.status(413).json({
      error: 'Dung lượng dữ liệu gửi lên quá lớn (vượt quá giới hạn 500MB). Vui lòng kiểm tra lại kích thước các file test case hoặc file đề thi.'
    });
  }
  next(err);
});

const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 1e8, // 100MB socket buffer
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

queue.setSocketIO(io);
arena.init(io, db, judge);

// Rate limiting & Brute-force protection stores
const submissionTimestamps = new Map(); // ip/userId -> lastTimestamp
const loginAttempts = new Map(); // ip -> { count, resetAt }

function loginRateLimiter(req, res, next) {
  if (process.env.NODE_ENV === 'test' || process.env.SCHOOLJUDGE_DATA_DIR) return next();
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (record) {
    if (now > record.resetAt) {
      loginAttempts.set(ip, { count: 1, resetAt: now + 60000 });
    } else {
      record.count++;
      if (record.count > 10) { // 10 attempts / min to avoid accidental lockouts during class
        return res.status(429).json({
          code: 'RATE_LIMIT_EXCEEDED',
          error: 'Quá nhiều lần thử đăng nhập. Vui lòng đợi 1 phút trước khi thử lại.'
        });
      }
    }
  } else {
    loginAttempts.set(ip, { count: 1, resetAt: now + 60000 });
  }
  next();
}

function submissionRateLimiter(req, res, next) {
  if (process.env.NODE_ENV === 'test' || process.env.SCHOOLJUDGE_DATA_DIR) return next();
  const key = req.user?.id || req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const lastTime = submissionTimestamps.get(key) || 0;
  if (now - lastTime < 5000) { // Max 1 submission every 5 seconds
    const waitSec = Math.ceil((5000 - (now - lastTime)) / 1000);
    return res.status(429).json({ error: `Bạn đang nộp bài quá nhanh. Vui lòng đợi ${waitSec} giây trước lần nộp tiếp theo.` });
  }
  submissionTimestamps.set(key, now);
  next();
}

// Online User & Socket Tracking
const onlineUsers = new Map(); // socketId -> { socketId, userId, username, fullName, role, ip, lastSeen }
const studentLockStates = new Map(); // userId -> { isLocked: boolean, reason?: string, lockedAt: number }
const latestScreenFrames = new Map(); // userId -> { userId, username, fullName, frame, timestamp }
let activeMonitorViewers = 0;
let currentFocusedStudentId = null;

function getActiveStudentCount() {
  const studentIds = new Set();
  for (const u of onlineUsers.values()) {
    if (u.role === 'user' && u.userId) {
      studentIds.add(u.userId);
    }
  }
  return Math.max(1, studentIds.size);
}

function calculateDynamicFps(studentCount) {
  // Ít học sinh (<=1): 30 FPS mượt mà tuyệt đối
  if (studentCount <= 1) return 30;
  // 2 - 3 học sinh: 20 FPS
  if (studentCount <= 3) return 20;
  // 4 - 6 học sinh: 12 FPS
  if (studentCount <= 6) return 12;
  // 7 - 10 học sinh: 8 FPS
  if (studentCount <= 10) return 8;
  // 11 - 20 học sinh: 4 FPS
  if (studentCount <= 20) return 4;
  // 21 - 40 học sinh: 2 FPS
  if (studentCount <= 40) return 2;
  // Trên 40 học sinh: 1 FPS tối ưu tải CPU & băng thông
  return 1;
}

function broadcastDynamicCaptureState() {
  if (activeMonitorViewers <= 0) return;
  const studentCount = getActiveStudentCount();
  const baseFps = calculateDynamicFps(studentCount);
  const baseInterval = Math.round(1000 / baseFps);

  const processedUserIds = new Set();
  for (const u of onlineUsers.values()) {
    if (u.role !== 'user' || !u.userId || processedUserIds.has(u.userId)) continue;
    processedUserIds.add(u.userId);

    const isFocused = currentFocusedStudentId && u.userId === currentFocusedStudentId;
    const fps = isFocused ? 30 : baseFps;
    const intervalMs = isFocused ? 33 : baseInterval;

    io.to(`user:${u.userId}`).emit('monitor:capture_state', {
      active: true,
      fps,
      intervalMs,
      isFocused: !!isFocused,
      studentCount
    });
  }

  io.to('room:live_monitor').to('role:host').emit('monitor:fps_status', {
    baseFps,
    baseInterval,
    studentCount,
    focusedStudentId: currentFocusedStudentId
  });
}

io.use((socket, next) => {
  const token = String(
    socket.handshake.auth?.token ||
    socket.handshake.headers?.['x-access-token'] ||
    socket.handshake.headers?.authorization ||
    socket.handshake.query?.token ||
    ''
  ).replace(/^Bearer\s+/i, '').trim();
  const user = auth.resolveAccessToken(token);
  if (!user) return next(new Error('AUTH_REQUIRED'));
  socket.data.user = user;
  socket.data.accessToken = token;
  next();
});

// Socket.IO real-time events
io.on('connection', (socket) => {
  const clientIp = String(socket.handshake.address || '').replace(/^::ffff:/, '');
  const user = socket.data.user;

  socket.join(`user:${user.id}`);
  socket.join(`role:${user.role}`);
  onlineUsers.set(socket.id, {
    socketId: socket.id,
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
    ip: clientIp || '127.0.0.1',
    lastSeen: Date.now()
  });
  io.to('role:host').emit('users:online_update', Array.from(onlineUsers.values()));

  socket.emit('queue:status', {
    queueLength: queue.queue.length,
    activeWorkers: queue.activeWorkers
  });

  // If student connects and was locked, send immediate lock state
  if (user.role === 'user' && studentLockStates.has(user.id)) {
    const lockInfo = studentLockStates.get(user.id);
    if (lockInfo && lockInfo.isLocked) {
      socket.emit('student:lock_state', lockInfo);
    }
  }

  // Kích hoạt screen capture động nếu có giáo viên đang theo dõi Live Monitor
  if (user.role === 'user') {
    if (activeMonitorViewers > 0) {
      broadcastDynamicCaptureState();
    } else {
      socket.emit('monitor:capture_state', { active: false });
    }
  }

  let isMonitorViewer = false;

  // Teacher joins Live Monitor room
  socket.on('monitor:join', () => {
    if (user.role !== 'host') return;
    if (!isMonitorViewer) {
      isMonitorViewer = true;
      socket.join('room:live_monitor');
      activeMonitorViewers++;
    }
    // Gửi cấu hình FPS tự động thích ứng tới toàn bộ học sinh
    broadcastDynamicCaptureState();

    // Send current lock states to this teacher
    const locksObj = {};
    for (const [uid, info] of studentLockStates.entries()) {
      if (info.isLocked) locksObj[uid] = info;
    }
    socket.emit('monitor:all_lock_states', locksObj);

    // Send cached initial frames immediately so teacher sees student screens without delay
    const initialFrames = Array.from(latestScreenFrames.values());
    if (initialFrames.length > 0) {
      socket.emit('monitor:initial_frames', initialFrames);
    }

    // Immediately push current online users list to this teacher
    socket.emit('users:online_update', Array.from(onlineUsers.values()));
  });

  // Teacher leaves Live Monitor room
  socket.on('monitor:leave', () => {
    if (isMonitorViewer) {
      isMonitorViewer = false;
      socket.leave('room:live_monitor');
      activeMonitorViewers = Math.max(0, activeMonitorViewers - 1);
      if (activeMonitorViewers === 0) {
        currentFocusedStudentId = null;
        io.to('role:user').emit('monitor:capture_state', { active: false });
      } else {
        broadcastDynamicCaptureState();
      }
    }
  });

  // Teacher focuses on a student for high-speed 30 FPS viewing
  socket.on('monitor:focus_student', (data) => {
    if (user.role !== 'host') return;
    currentFocusedStudentId = (data && data.studentId) ? String(data.studentId) : null;
    broadcastDynamicCaptureState();
  });

  // Teacher closes inspect modal, return to normal FPS
  socket.on('monitor:unfocus_student', () => {
    if (user.role !== 'host') return;
    currentFocusedStudentId = null;
    broadcastDynamicCaptureState();
  });

  // Student sends a compressed screen frame
  socket.on('student:screen_frame', (data) => {
    if (user.role !== 'user' || !data || !data.frame) return;
    const frameStr = String(data.frame);
    // Ignore invalid, empty, or dummy test frames
    if (!frameStr.startsWith('data:image/') || frameStr.length < 200) return;

    const isFocused = currentFocusedStudentId && currentFocusedStudentId === user.id;
    const framePayload = {
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
      frame: frameStr,
      fps: data.fps || (isFocused ? 30 : calculateDynamicFps(getActiveStudentCount())),
      isFocused: !!isFocused,
      timestamp: Date.now()
    };
    latestScreenFrames.set(user.id, framePayload);
    io.to('room:live_monitor').to('role:host').emit('monitor:frame_received', framePayload);
  });

  // Teacher locks a specific student
  socket.on('teacher:lock_student', (data) => {
    if (user.role !== 'host' || !data || !data.studentId) return;
    const lockData = {
      isLocked: true,
      reason: data.reason || 'Giáo viên tạm khóa bài làm',
      lockedAt: Date.now()
    };
    studentLockStates.set(data.studentId, lockData);
    io.to(`user:${data.studentId}`).emit('student:lock_state', lockData);
    io.to('room:live_monitor').to('role:host').emit('monitor:lock_updated', {
      studentId: data.studentId,
      ...lockData
    });
  });

  // Teacher unlocks a specific student
  socket.on('teacher:unlock_student', (data) => {
    if (user.role !== 'host' || !data || !data.studentId) return;
    studentLockStates.delete(data.studentId);
    io.to(`user:${data.studentId}`).emit('student:lock_state', { isLocked: false });
    io.to('room:live_monitor').to('role:host').emit('monitor:lock_updated', {
      studentId: data.studentId,
      isLocked: false
    });
  });

  // Teacher locks all students
  socket.on('teacher:broadcast_lock', (data) => {
    if (user.role !== 'host') return;
    const reason = (data && data.reason) || 'Giáo viên tạm khóa toàn phòng thi';
    for (const u of onlineUsers.values()) {
      if (u.role === 'user') {
        const lockData = { isLocked: true, reason, lockedAt: Date.now() };
        studentLockStates.set(u.userId, lockData);
        io.to(`user:${u.userId}`).emit('student:lock_state', lockData);
        io.to('room:live_monitor').to('role:host').emit('monitor:lock_updated', {
          studentId: u.userId,
          ...lockData
        });
      }
    }
  });

  // Teacher unlocks all students
  socket.on('teacher:broadcast_unlock', () => {
    if (user.role !== 'host') return;
    for (const studentId of Array.from(studentLockStates.keys())) {
      studentLockStates.delete(studentId);
      io.to(`user:${studentId}`).emit('student:lock_state', { isLocked: false });
      io.to('room:live_monitor').to('role:host').emit('monitor:lock_updated', {
        studentId,
        isLocked: false
      });
    }
  });

  // Teacher sends remote alert/notification
  socket.on('teacher:send_alert', (data) => {
    if (user.role !== 'host' || !data || !data.message) return;
    const payload = {
      message: data.message,
      level: data.level || 'warning',
      from: user.fullName || 'Giáo viên',
      timestamp: Date.now()
    };
    if (data.studentId) {
      io.to(`user:${data.studentId}`).emit('student:received_alert', payload);
    } else {
      io.to('role:user').emit('student:received_alert', payload);
    }
  });

  // Student sends ping / request unlock to teacher
  socket.on('student:ping_teacher', (data) => {
    if (user.role !== 'user') return;
    io.to('room:live_monitor').to('role:host').emit('student:ping_received', {
      studentId: user.id,
      username: user.username,
      fullName: user.fullName,
      message: (data && data.message) || 'Học sinh xin phép mở khóa bài thi.',
      timestamp: Date.now()
    });
  });

  socket.on('disconnect', () => {
    if (isMonitorViewer) {
      activeMonitorViewers = Math.max(0, activeMonitorViewers - 1);
      if (activeMonitorViewers === 0) {
        currentFocusedStudentId = null;
        io.to('role:user').emit('monitor:capture_state', { active: false });
      } else {
        broadcastDynamicCaptureState();
      }
    }
    if (onlineUsers.has(socket.id)) {
      onlineUsers.delete(socket.id);
      io.to('role:host').emit('users:online_update', Array.from(onlineUsers.values()));
      if (user.role === 'user') {
        if (currentFocusedStudentId && currentFocusedStudentId === user.id) {
          currentFocusedStudentId = null;
        }
        if (activeMonitorViewers > 0) {
          broadcastDynamicCaptureState();
        }
      }
    }
  });
});

// PING / HEARTBEAT
app.get('/api/ping', (req, res) => {
  res.json({
    status: 'online',
    serverName: db.getSettings().serverName,
    isFirstRun: db.isFirstRun(),
    time: Date.now(),
    version: APP_VERSION
  });
});

// FIRST RUN STATUS & SETUP
app.get('/api/system/status', (req, res) => {
  res.json({
    isFirstRun: db.isFirstRun(),
    serverName: db.getSettings().serverName,
    globalMemoryLimit: db.getSettings().globalMemoryLimit || 256,
    version: APP_VERSION
  });
});

// STUDENT EXAM LOCK STATUS
app.get('/api/student/exam-lock-status', (req, res) => {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/, '');
  const user = auth.resolveAccessToken(token);
  if (!user) return res.status(401).json({ code: 'AUTH_REQUIRED', error: 'Vui lòng đăng nhập.' });

  const lockInfo = studentLockStates.get(user.id);
  if (lockInfo && lockInfo.isLocked) {
    return res.json({ isLocked: true, reason: lockInfo.reason, lockedAt: lockInfo.lockedAt });
  }
  return res.json({ isLocked: false });
});

function isLoopbackRequest(req) {
  const address = String(req.socket?.remoteAddress || '').replace(/^::ffff:/, '');
  return address === '127.0.0.1' || address === '::1';
}

function handleAuthFailure(res, error) {
  if (error instanceof AuthError) {
    return res.status(error.status).json({ code: error.code, error: error.message });
  }
  console.error('[Auth Error]', error);
  return res.status(500).json({ code: 'AUTH_INTERNAL_ERROR', error: 'Không thể xử lý yêu cầu xác thực.' });
}

function handlePolicyFailure(res, error) {
  if (error instanceof ContestPolicyError) {
    return res.status(error.status).json({ code: error.code, error: error.message });
  }
  console.error('[Contest Policy Error]', error);
  return res.status(500).json({ code: 'CONTEST_POLICY_ERROR', error: 'Không thể kiểm tra điều kiện kỳ thi.' });
}

function getBearerToken(req) {
  const authorization = String(req.headers.authorization || '');
  const match = authorization.match(/^Bearer\s+([^\s]+)$/i);
  if (match) return match[1];
  const custom = req.headers['x-access-token'] || req.headers['x-auth-token'];
  if (custom) return String(custom).trim();
  if (req.query?.token || req.query?.accessToken) {
    return String(req.query.token || req.query.accessToken).trim();
  }
  return '';
}

function generateTemporaryPassword() {
  return crypto.randomBytes(12).toString('base64url');
}

app.post('/api/system/setup', async (req, res) => {
  if (process.env.REQUIRE_LOOPBACK_SETUP === 'true' && !isLoopbackRequest(req)) {
    return res.status(403).json({ code: 'LOOPBACK_REQUIRED', error: 'Thiết lập ban đầu chỉ được thực hiện trên máy chủ.' });
  }
  if (!db.isFirstRun()) {
    return res.status(400).json({ error: 'Hệ thống đã được khởi tạo tài khoản quản trị trước đó.' });
  }
  const { username, password, fullName, serverName, className } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Tên đăng nhập và mật khẩu không được để trống.' });
  }
  try {
    const passwordHash = await hashPassword(password);
    const result = db.setupFirstAdmin({ username, passwordHash, fullName, serverName, className });
    const session = await auth.login(username, password);
    res.json({ success: true, ...session, user: safeUser(result.admin), defaultClass: result.defaultClass });
  } catch (error) {
    handleAuthFailure(res, error);
  }
});

app.post('/api/auth/register', loginRateLimiter, async (req, res) => {
  try {
    const result = await auth.registerStudent(req.body || {});
    res.status(201).json(result);
  } catch (error) {
    handleAuthFailure(res, error);
  }
});

app.post('/api/auth/login', loginRateLimiter, async (req, res) => {
  try {
    const rawUsername = String(req.body?.username || '').trim().toLowerCase();
    const existingUser = db.getUser(rawUsername);

    // Chặn đăng nhập trùng: Mỗi tài khoản chỉ được 1 người đăng nhập để đồng bộ dữ liệu
    if (existingUser && existingUser.role !== 'host') {
      const activeOnline = Array.from(onlineUsers.values()).find(u => 
        u.userId === existingUser.id && io && io.sockets && io.sockets.sockets && io.sockets.sockets.has(u.socketId)
      );
      if (activeOnline) {
        return res.status(409).json({
          code: 'ACCOUNT_ALREADY_LOGGED_IN',
          error: `Tài khoản "${existingUser.fullName || existingUser.username}" hiện đang được đăng nhập trên một thiết bị khác (${activeOnline.ip || 'đang online'}). Mỗi tài khoản chỉ được phép 1 người sử dụng để đảm bảo đồng bộ dữ liệu.`
        });
      }
    }

    const result = await auth.login(req.body?.username, req.body?.password);
    res.json(result);
  } catch (error) {
    handleAuthFailure(res, error);
  }
});

app.get('/api/auth/me', auth.authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/logout', auth.authenticate, (req, res) => {
  auth.revokeAccessToken(req.accessToken);
  if (req.user?.id) {
    for (const [sockId, u] of onlineUsers.entries()) {
      if (u.userId === req.user.id) {
        onlineUsers.delete(sockId);
      }
    }
    io.to('role:host').emit('users:online_update', Array.from(onlineUsers.values()));
  }
  res.json({ success: true });
});

app.put('/api/auth/password', auth.authenticate, async (req, res) => {
  try {
    const user = await auth.changePassword(req.user.id, req.body?.currentPassword, req.body?.newPassword);
    res.json({ success: true, user });
  } catch (error) {
    handleAuthFailure(res, error);
  }
});

app.use('/api', (req, res, next) => {
  const isPublicUpdateRead = req.method === 'GET' && (
    req.path === '/update/check' || req.path === '/update/download'
  );
  if (isPublicUpdateRead) return next();
  return auth.authenticate(req, res, next);
});

// DIAGNOSTICS & SYSTEM STATUS
app.get('/api/diagnostics', requireHost, (req, res) => {
  const diag = judge.getDiagnostics();
  const ips = lan.getLocalIPs();
  res.json({
    ...diag,
    localIps: ips,
    queue: {
      length: queue.queue.length,
      activeWorkers: queue.activeWorkers,
      concurrency: queue.concurrency
    },
    settings: db.getSettings()
  });
});

// SETTINGS
app.get('/api/settings', requireHost, (req, res) => {
  res.json(db.getSettings());
});

app.put('/api/settings', requireHost, (req, res) => {
  const updated = db.updateSettings(req.body);
  io.emit('settings:update', updated);
  res.json(updated);
});

function emitProblemUpdate(problem) {
  io.to('role:host').emit('problems:update', sanitizeProblemForHost(problem));
  io.to('role:user').emit('problems:update', sanitizeProblemForStudent(problem));
}

function emitContestEvent(eventName, contest) {
  const rawProblems = (contest.problemIds || []).map(pId => db.getProblem(pId)).filter(Boolean);
  io.to('role:host').emit(eventName, sanitizeContestForHost(contest, rawProblems));
  io.to('role:user').emit(eventName, sanitizeContestForStudent(contest, rawProblems));
}

// Helper to enrich a problem with contest information
function enrichProblemWithContests(prob, contests) {
  if (!prob) return prob;
  const pId = prob.id;
  const pCode = String(prob.code || '').trim().toUpperCase();
  const linkedContests = (contests || []).filter(c => {
    if (!Array.isArray(c.problemIds)) return false;
    return c.problemIds.some(id => id === pId || String(id).trim().toUpperCase() === pCode);
  });

  const contestSummaries = linkedContests.map(c => ({
    id: c.id,
    title: c.title,
    pdfUrl: c.pdfUrl || (c._pdfDiskPath ? `/api/contests/${c.id}/pdf` : ''),
    pdfFileName: c.pdfFileName || '',
    statementHtml: c.statementHtml || ''
  }));

  const primaryContest = contestSummaries[0] || null;

  return {
    ...prob,
    contestId: prob.contestId || (primaryContest ? primaryContest.id : undefined),
    contestTitle: prob.contestTitle || (primaryContest ? primaryContest.title : undefined),
    contestDocUrl: prob.contestDocUrl || (primaryContest ? primaryContest.pdfUrl : undefined),
    contestDocFileName: prob.contestDocFileName || (primaryContest ? primaryContest.pdfFileName : undefined),
    contestStatementHtml: prob.contestStatementHtml || (primaryContest ? primaryContest.statementHtml : undefined),
    contests: contestSummaries
  };
}

// PROBLEMS
app.get('/api/problems', async (req, res) => {
  if (req.user && req.user.role === 'host' && (req.query.refresh === 'true' || req.query.refresh === '1')) {
    if (typeof db.reloadCache === 'function') {
      try { await db.reloadCache(); } catch (e) {}
    }
  }
  const problems = db.getProblems();
  const allContests = typeof db.getContests === 'function' ? db.getContests() : [];
  const enriched = problems.map(p => enrichProblemWithContests(p, allContests));
  const serializer = req.user.role === 'host' ? sanitizeProblemForHost : sanitizeProblemForStudent;
  res.json(enriched.map(serializer));
});

app.get('/api/problems/:id', (req, res) => {
  const prob = db.getProblem(req.params.id);
  if (!prob) return res.status(404).json({ error: 'Bài tập không tồn tại' });

  const allContests = typeof db.getContests === 'function' ? db.getContests() : [];
  const enrichedProb = enrichProblemWithContests(prob, allContests);

  if (req.user.role !== 'host') {
    return res.json(sanitizeProblemForStudent(enrichedProb));
  }

  res.json(sanitizeProblemForHost(enrichedProb));
});

app.post('/api/problems', requireHost, (req, res) => {
  try {
    const prob = db.createProblem(req.body);
    emitProblemUpdate(prob);
    res.json(prob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/problems/:id', requireHost, (req, res) => {
  const updated = db.updateProblem(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Không tìm thấy bài tập' });
  emitProblemUpdate(updated);
  res.json(updated);
});

// SOLUTION FOR PROBLEM (Editorial / Algorithm guide / Reference code)
app.get('/api/problems/:id/solution', (req, res) => {
  const prob = db.getProblem(req.params.id);
  if (!prob) return res.status(404).json({ error: 'Không tìm thấy bài tập' });

  // Host can always view
  if (req.user.role === 'host') {
    return res.json({ 
      allowed: true, 
      solution: prob.solution || '', 
      solutionVisible: !!prob.solutionVisible,
      problemCode: prob.code,
      problemTitle: prob.title
    });
  }

  // Student can view if:
  // 1. Teacher explicitly enabled solutionVisible, OR
  // 2. Student already has an AC submission for this problem
  let canView = !!prob.solutionVisible;
  if (!canView && req.user) {
    const subs = db.getSubmissions().filter(s => s.userId === req.user.id && (s.problemId === prob.id || s.problemCode === prob.code));
    const hasAc = subs.some(s => s.status === 'AC' || (s.score && s.score >= (prob.points || 100)));
    if (hasAc) {
      canView = true;
    }
  }

  if (!canView) {
    return res.status(403).json({ 
      allowed: false, 
      error: 'Lời giải chưa được công bố hoặc bạn cần đạt AC (100 điểm) bài này trước để mở khóa lời giải.',
      hasAcRequired: true,
      hasSolution: !!(prob.solution && prob.solution.trim())
    });
  }

  res.json({
    allowed: true,
    solution: prob.solution || '',
    problemCode: prob.code,
    problemTitle: prob.title
  });
});

app.delete('/api/problems/:id', requireHost, (req, res) => {
  const prob = db.getProblem(req.params.id);
  if (prob && prob._pdfDiskPath && fs.existsSync(prob._pdfDiskPath)) {
    try { fs.unlinkSync(prob._pdfDiskPath); } catch (e) {}
  }
  db.deleteProblem(req.params.id);
  io.emit('problems:delete', req.params.id);
  res.json({ success: true });
});

// HELPER: MIME TYPE FOR ATTACHMENT STATEMENTS
function getStatementMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.pdf': return 'application/pdf';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.bmp': return 'image/bmp';
    case '.txt': return 'text/plain; charset=utf-8';
    case '.md': return 'text/markdown; charset=utf-8';
    case '.docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case '.doc': return 'application/msword';
    default: return 'application/octet-stream';
  }
}

// HELPER: Convert DOCX/DOC or TXT/MD to HTML/Text for Online Docs Reader
async function parseDocumentToHtml(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return '';
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.docx' || ext === '.doc') {
    try {
      const buffer = fs.readFileSync(filePath);
      const result = await mammoth.convertToHtml({ buffer });
      return result.value || '';
    } catch (e) {
      console.warn('Mammoth docx parse error:', e.message);
      return '';
    }
  } else if (ext === '.txt' || ext === '.md') {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (e) {
      return '';
    }
  }
  return '';
}

// PARSE DOCUMENT ON THE FLY (FOR INSTANT DOCUMENT PREVIEW BEFORE SAVING)
app.post('/api/parse-document', requireHost, async (req, res) => {
  try {
    const { fileName, fileData } = req.body;
    if (!fileData) return res.status(400).json({ error: 'Không có dữ liệu file' });
    const ext = path.extname(fileName || '').toLowerCase();
    
    // Extract base64 buffer
    let buffer;
    if (fileData.includes(';base64,')) {
      const b64 = fileData.split(';base64,')[1];
      buffer = Buffer.from(b64, 'base64');
    } else {
      buffer = Buffer.from(fileData, 'base64');
    }

    if (ext === '.docx' || ext === '.doc') {
      try {
        const result = await mammoth.convertToHtml({ buffer });
        return res.json({ type: 'html', content: result.value || '', fileName });
      } catch (err) {
        return res.json({ type: 'error', error: 'Không thể giải mã file DOCX: ' + err.message, fileName });
      }
    } else if (ext === '.txt' || ext === '.md') {
      const text = buffer.toString('utf8');
      return res.json({ type: 'text', content: text, fileName });
    } else if (ext === '.pdf') {
      return res.json({ type: 'pdf', content: fileData, fileName });
    } else if (['.png', '.jpg', '.jpeg', '.webp', '.bmp'].includes(ext)) {
      return res.json({ type: 'image', content: fileData, fileName });
    }
    return res.json({ type: 'other', fileName });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi parse document: ' + err.message });
  }
});

// REFORM API: Parse a single problem statement (auto-fill in ProblemManager)
app.post('/api/reform/parse-problem', requireHost, async (req, res) => {
  try {
    const { fileName, fileData, rawText } = req.body;
    let buffer = null;
    if (fileData) {
      const b64 = fileData.includes(';base64,') ? fileData.split(';base64,')[1] : fileData;
      buffer = Buffer.from(b64, 'base64');
    }
    const problem = await reformParser.parseSingleProblem({ buffer, fileName, rawText });
    if (!problem) {
      return res.status(400).json({ error: 'Không thể nhận diện cấu trúc bài tập từ dữ liệu cung cấp.' });
    }
    res.json({ success: true, problem });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi parse bài tập: ' + err.message });
  }
});

// REFORM API: Parse an entire exam / contest (auto-fill in ContestManager)
app.post('/api/reform/parse-contest', requireHost, async (req, res) => {
  try {
    const { fileName, fileData, rawText } = req.body;
    let buffer = null;
    if (fileData) {
      const b64 = fileData.includes(';base64,') ? fileData.split(';base64,')[1] : fileData;
      buffer = Buffer.from(b64, 'base64');
    }
    const result = await reformParser.parseExam({ buffer, fileName, rawText });
    if (!result || !result.problems || result.problems.length === 0) {
      return res.status(400).json({ error: 'Không tìm thấy bài tập nào trong đề thi cung cấp.' });
    }
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi parse đề thi: ' + err.message });
  }
});

// GET STATEMENT CONTENT FOR PROBLEM (Inline Docs/HTML reader)
app.get('/api/problems/:id/statement-content', async (req, res) => {
  const prob = db.getProblem(req.params.id);
  if (!prob) return res.status(404).json({ error: 'Không tìm thấy bài tập' });

  let filePath = prob._pdfDiskPath;
  if (!filePath || !fs.existsSync(filePath)) {
    try {
      const files = fs.readdirSync(uploadsDir);
      const match = files.find(f => f.startsWith(`prob_${prob.id}_`));
      if (match) filePath = path.join(uploadsDir, match);
    } catch (e) {}
  }

  if (!filePath || !fs.existsSync(filePath)) {
    const testFolder = path.join(process.cwd(), 'TEST', prob.code);
    if (fs.existsSync(testFolder)) {
      try {
        const files = fs.readdirSync(testFolder);
        const match = files.find(f => {
          const l = f.toLowerCase();
          return l.endsWith('.pdf') || l.endsWith('.docx') || l.endsWith('.doc') || 
                 l.endsWith('.png') || l.endsWith('.jpg') || l.endsWith('.jpeg') || 
                 l.endsWith('.webp') || l.endsWith('.txt') || l.endsWith('.md');
        });
        if (match) filePath = path.join(testFolder, match);
      } catch (e) {}
    }
  }

  if (!filePath || !fs.existsSync(filePath)) {
    return res.json({ 
      type: prob.statementHtml ? 'html' : (prob.description ? 'text' : 'none'), 
      content: prob.statementHtml || prob.description || '', 
      fileName: prob.pdfFileName || '' 
    });
  }

  const ext = path.extname(filePath).toLowerCase();
  const fileName = prob.pdfFileName || path.basename(filePath);

  if (ext === '.docx' || ext === '.doc') {
    const html = await parseDocumentToHtml(filePath);
    return res.json({ type: 'html', content: html, fileName, url: prob.pdfUrl || `/api/problems/${prob.id}/pdf` });
  } else if (ext === '.txt' || ext === '.md') {
    const text = fs.readFileSync(filePath, 'utf8');
    return res.json({ type: 'text', content: text, fileName, url: prob.pdfUrl || `/api/problems/${prob.id}/pdf` });
  } else if (ext === '.pdf') {
    return res.json({ type: 'pdf', content: '', fileName, url: prob.pdfUrl || `/api/problems/${prob.id}/pdf` });
  } else if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
    return res.json({ type: 'image', content: '', fileName, url: prob.pdfUrl || `/api/problems/${prob.id}/pdf` });
  }

  res.json({ type: 'other', content: '', fileName, url: prob.pdfUrl || `/api/problems/${prob.id}/pdf` });
});

// STATEMENT UPLOAD FOR PROBLEM (PDF, Word, Ảnh, Text...)
app.post('/api/problems/:id/pdf', requireHost, async (req, res) => {
  const prob = db.getProblem(req.params.id);
  if (!prob) return res.status(404).json({ error: 'Không tìm thấy bài tập' });

  const { fileName, fileData } = req.body;
  if (!fileData) return res.status(400).json({ error: 'Thiếu dữ liệu file đề bài' });

  try {
    const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const safeName = (fileName || 'debai.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
    const diskFileName = `prob_${prob.id}_${Date.now()}_${safeName}`;
    const filePath = path.join(uploadsDir, diskFileName);

    if (prob._pdfDiskPath && fs.existsSync(prob._pdfDiskPath)) {
      try { fs.unlinkSync(prob._pdfDiskPath); } catch (e) {}
    }

    fs.writeFileSync(filePath, buffer);

    let statementHtml = '';
    if (safeName.toLowerCase().endsWith('.docx') || safeName.toLowerCase().endsWith('.doc')) {
      try {
        const r = await mammoth.convertToHtml({ buffer });
        statementHtml = r.value || '';
      } catch (e) {}
    }

    const updated = db.updateProblem(prob.id, {
      pdfUrl: `/api/problems/${prob.id}/pdf`,
      pdfFileName: fileName || safeName,
      statementHtml,
      _pdfDiskPath: filePath
    });

    emitProblemUpdate(updated);
    res.json({ success: true, problem: updated });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi lưu file đề bài: ' + err.message });
  }
});

// GET STATEMENT FILE FOR PROBLEM (Inline view or download for PDF, Images, Word, Text)
app.get('/api/problems/:id/pdf', (req, res) => {
  const prob = db.getProblem(req.params.id);
  if (!prob) return res.status(404).json({ error: 'Không tìm thấy bài tập' });

  let filePath = prob._pdfDiskPath;
  if (!filePath || !fs.existsSync(filePath)) {
    try {
      const files = fs.readdirSync(uploadsDir);
      const match = files.find(f => f.startsWith(`prob_${prob.id}_`));
      if (match) filePath = path.join(uploadsDir, match);
    } catch (e) {}
  }

  // Also check if problem folder has a statement in TEST/{code}/*.(pdf|docx|png|jpg|txt|md)
  if (!filePath || !fs.existsSync(filePath)) {
    const testFolder = path.join(process.cwd(), 'TEST', prob.code);
    if (fs.existsSync(testFolder)) {
      try {
        const files = fs.readdirSync(testFolder);
        const match = files.find(f => {
          const l = f.toLowerCase();
          return l.endsWith('.pdf') || l.endsWith('.docx') || l.endsWith('.doc') || 
                 l.endsWith('.png') || l.endsWith('.jpg') || l.endsWith('.jpeg') || 
                 l.endsWith('.webp') || l.endsWith('.txt') || l.endsWith('.md');
        });
        if (match) filePath = path.join(testFolder, match);
      } catch (e) {}
    }
  }

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Không tìm thấy file đề bài' });
  }

  const mimeType = getStatementMimeType(filePath);
  const isInline = mimeType.startsWith('image/') || mimeType === 'application/pdf' || mimeType.startsWith('text/');

  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Disposition', `${isInline ? 'inline' : 'attachment'}; filename="${encodeURIComponent(prob.pdfFileName || prob.code + path.extname(filePath))}"`);
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

// DELETE STATEMENT FOR PROBLEM
app.delete('/api/problems/:id/pdf', requireHost, (req, res) => {
  const prob = db.getProblem(req.params.id);
  if (!prob) return res.status(404).json({ error: 'Không tìm thấy bài tập' });

  if (prob._pdfDiskPath && fs.existsSync(prob._pdfDiskPath)) {
    try { fs.unlinkSync(prob._pdfDiskPath); } catch (e) {}
  }

  const updated = db.updateProblem(prob.id, {
    pdfUrl: '',
    pdfFileName: '',
    statementHtml: '',
    _pdfDiskPath: ''
  });

  emitProblemUpdate(updated);
  res.json({ success: true, problem: updated });
});

// STATEMENT UPLOAD FOR CONTEST (Đề thi tổng hợp kỳ thi - PDF, Word, Ảnh, Text)
app.post('/api/contests/:id/pdf', requireHost, async (req, res) => {
  const contest = db.getContest(req.params.id);
  if (!contest) return res.status(404).json({ error: 'Không tìm thấy kỳ thi' });

  const { fileName, fileData } = req.body;
  if (!fileData) return res.status(400).json({ error: 'Thiếu dữ liệu file đề thi' });

  try {
    const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const safeName = (fileName || 'dethi.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
    const diskFileName = `contest_${contest.id}_${Date.now()}_${safeName}`;
    const filePath = path.join(uploadsDir, diskFileName);

    if (contest._pdfDiskPath && fs.existsSync(contest._pdfDiskPath)) {
      try { fs.unlinkSync(contest._pdfDiskPath); } catch (e) {}
    }

    fs.writeFileSync(filePath, buffer);

    let statementHtml = '';
    if (safeName.toLowerCase().endsWith('.docx') || safeName.toLowerCase().endsWith('.doc')) {
      try {
        const r = await mammoth.convertToHtml({ buffer });
        statementHtml = r.value || '';
      } catch (e) {}
    }

    const updated = db.updateContest(contest.id, {
      pdfUrl: `/api/contests/${contest.id}/pdf`,
      pdfFileName: fileName || safeName,
      statementHtml,
      _pdfDiskPath: filePath
    });

    emitContestEvent('contest:updated', updated);
    res.json({ success: true, contest: updated });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi lưu file đề thi: ' + err.message });
  }
});

// GET STATEMENT CONTENT FOR CONTEST (Inline Docs/HTML reader)
app.get('/api/contests/:id/statement-content', async (req, res) => {
  const contest = db.getContest(req.params.id);
  if (!contest) return res.status(404).json({ error: 'Không tìm thấy kỳ thi' });

  let filePath = contest._pdfDiskPath;
  if (!filePath || !fs.existsSync(filePath)) {
    try {
      const files = fs.readdirSync(uploadsDir);
      const match = files.find(f => f.startsWith(`contest_${contest.id}_`));
      if (match) filePath = path.join(uploadsDir, match);
    } catch (e) {}
  }

  if (!filePath || !fs.existsSync(filePath)) {
    return res.json({ 
      type: contest.statementHtml ? 'html' : (contest.description ? 'text' : 'none'), 
      content: contest.statementHtml || contest.description || '', 
      fileName: contest.pdfFileName || '' 
    });
  }

  const ext = path.extname(filePath).toLowerCase();
  const fileName = contest.pdfFileName || path.basename(filePath);

  if (ext === '.docx' || ext === '.doc') {
    const html = await parseDocumentToHtml(filePath);
    return res.json({ type: 'html', content: html, fileName, url: contest.pdfUrl || `/api/contests/${contest.id}/pdf` });
  } else if (ext === '.txt' || ext === '.md') {
    const text = fs.readFileSync(filePath, 'utf8');
    return res.json({ type: 'text', content: text, fileName, url: contest.pdfUrl || `/api/contests/${contest.id}/pdf` });
  } else if (ext === '.pdf') {
    return res.json({ type: 'pdf', content: '', fileName, url: contest.pdfUrl || `/api/contests/${contest.id}/pdf` });
  } else if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
    return res.json({ type: 'image', content: '', fileName, url: contest.pdfUrl || `/api/contests/${contest.id}/pdf` });
  }

  res.json({ type: 'other', content: '', fileName, url: contest.pdfUrl || `/api/contests/${contest.id}/pdf` });
});

// GET STATEMENT FILE FOR CONTEST (Xem trực tiếp hoặc tải về)
app.get('/api/contests/:id/pdf', (req, res) => {
  const contest = db.getContest(req.params.id);
  if (!contest) return res.status(404).json({ error: 'Không tìm thấy kỳ thi' });

  let filePath = contest._pdfDiskPath;
  if (!filePath || !fs.existsSync(filePath)) {
    try {
      const files = fs.readdirSync(uploadsDir);
      const match = files.find(f => f.startsWith(`contest_${contest.id}_`));
      if (match) filePath = path.join(uploadsDir, match);
    } catch (e) {}
  }

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Không tìm thấy file đề thi' });
  }

  const mimeType = getStatementMimeType(filePath);
  const isInline = mimeType.startsWith('image/') || mimeType === 'application/pdf' || mimeType.startsWith('text/');

  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Disposition', `${isInline ? 'inline' : 'attachment'}; filename="${encodeURIComponent(contest.pdfFileName || contest.title + path.extname(filePath))}"`);
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

// DELETE STATEMENT FOR CONTEST
app.delete('/api/contests/:id/pdf', requireHost, (req, res) => {
  const contest = db.getContest(req.params.id);
  if (!contest) return res.status(404).json({ error: 'Không tìm thấy kỳ thi' });

  if (contest._pdfDiskPath && fs.existsSync(contest._pdfDiskPath)) {
    try { fs.unlinkSync(contest._pdfDiskPath); } catch (e) {}
  }

  const updated = db.updateContest(contest.id, {
    pdfUrl: '',
    pdfFileName: '',
    statementHtml: '',
    _pdfDiskPath: ''
  });

  emitContestEvent('contest:updated', updated);
  res.json({ success: true, contest: updated });
});

// LIST AVAILABLE SAMPLE TESTS FROM 'TEST/' DIRECTORY
app.get('/api/sample-tests', requireHost, (req, res) => {
  const testRoot = path.join(process.cwd(), 'TEST');
  if (!fs.existsSync(testRoot)) {
    return res.json([]);
  }

  try {
    const entries = fs.readdirSync(testRoot, { withFileTypes: true });
    const problems = [];

    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      const probFolder = path.join(testRoot, ent.name);
      const subEntries = fs.readdirSync(probFolder, { withFileTypes: true });

      const testDirs = subEntries
        .filter(e => e.isDirectory() && /^test\d+/i.test(e.name))
        .map(e => e.name)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      const pdfFile = subEntries.find(e => !e.isDirectory() && e.name.toLowerCase().endsWith('.pdf'));

      let sampleInput = '';
      let sampleOutput = '';
      if (testDirs.length > 0) {
        const firstTestDir = path.join(probFolder, testDirs[0]);
        const testFiles = fs.readdirSync(firstTestDir);
        const inpFile = testFiles.find(f => f.toLowerCase().endsWith('.inp'));
        const outFile = testFiles.find(f => f.toLowerCase().endsWith('.out'));
        if (inpFile) {
          try { sampleInput = fs.readFileSync(path.join(firstTestDir, inpFile), 'utf8'); } catch (e) {}
        }
        if (outFile) {
          try { sampleOutput = fs.readFileSync(path.join(firstTestDir, outFile), 'utf8'); } catch (e) {}
        }
      }

      problems.push({
        code: ent.name.toUpperCase(),
        folder: ent.name,
        testCount: testDirs.length,
        hasPdf: !!pdfFile,
        pdfFileName: pdfFile ? pdfFile.name : null,
        sampleInput: sampleInput.slice(0, 200),
        sampleOutput: sampleOutput.slice(0, 200)
      });
    }

    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi đọc thư mục TEST: ' + err.message });
  }
});

// IMPORT SAMPLE PROBLEMS FROM 'TEST/' FOLDER
app.post('/api/sample-tests/import', requireHost, (req, res) => {
  const { folder, folders, importAll } = req.body || {};
  const testRoot = path.join(process.cwd(), 'TEST');
  if (!fs.existsSync(testRoot)) {
    return res.status(404).json({ error: 'Không tìm thấy thư mục TEST trên máy chủ' });
  }

  try {
    const allEntries = fs.readdirSync(testRoot, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name);

    let targetFolders = [];
    if (importAll) {
      targetFolders = allEntries;
    } else if (folders && Array.isArray(folders)) {
      targetFolders = folders;
    } else if (folder) {
      targetFolders = [folder];
    } else {
      targetFolders = allEntries;
    }

    const importedProblems = [];
    const existingProblems = db.getProblems();

    for (const fName of targetFolders) {
      const probFolder = path.join(testRoot, fName);
      if (!fs.existsSync(probFolder)) continue;

      const subEntries = fs.readdirSync(probFolder, { withFileTypes: true });
      const testDirs = subEntries
        .filter(e => e.isDirectory() && /^test\d+/i.test(e.name))
        .map(e => e.name)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      const pdfFile = subEntries.find(e => !e.isDirectory() && e.name.toLowerCase().endsWith('.pdf'));

      const testCases = [];
      const cleanCode = fName.toLowerCase();

      testDirs.forEach((td, idx) => {
        const tdPath = path.join(probFolder, td);
        const tf = fs.readdirSync(tdPath);
        const inp = tf.find(f => f.toLowerCase() === `${cleanCode}.inp` || f.toLowerCase().endsWith('.inp'));
        const out = tf.find(f => f.toLowerCase() === `${cleanCode}.out` || f.toLowerCase().endsWith('.out'));

        const inputContent = inp ? fs.readFileSync(path.join(tdPath, inp), 'utf8') : '';
        const outputContent = out ? fs.readFileSync(path.join(tdPath, out), 'utf8') : '';

        testCases.push({
          id: `tc-${Date.now()}-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`,
          input: inputContent,
          expectedOutput: outputContent,
          isSample: idx === 0,
          isTrap: false,
          score: Math.max(1, Math.round(100 / Math.max(1, testDirs.length)))
        });
      });

      const upperCode = fName.toUpperCase();
      let existing = existingProblems.find(p => p.code === upperCode);
      let probObj;

      const sampleCode = `#include <iostream>\n#include <cstdio>\nusing namespace std;\n\nint main() {\n    // Hỗ trợ cả freopen("${cleanCode}.inp", "r", stdin) hoặc cin/cout:\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    // Viết lời giải bài ${upperCode} tại đây\n    \n    return 0;\n}\n`;

      const titleMap = {
        'LUCKY': 'Con Số May Mắn (LUCKY)',
        'PLAN': 'Kế Hoạch Xây Dựng (PLAN)',
        'TEAM': 'Thành Lập Đội Tuyển (TEAM)'
      };

      if (existing) {
        probObj = db.updateProblem(existing.id, {
          testCases,
          ...(pdfFile ? { pdfUrl: `/api/problems/${existing.id}/pdf`, pdfFileName: pdfFile.name } : {})
        });
      } else {
        probObj = db.createProblem({
          code: upperCode,
          title: titleMap[upperCode] || `Bài Tập ${upperCode}`,
          difficulty: upperCode === 'LUCKY' ? 'Dễ' : upperCode === 'PLAN' ? 'Trung bình' : 'Khó',
          points: 100,
          timeLimit: 1000,
          memoryLimit: 256,
          category: 'C++11',
          description: `### Đề bài ${upperCode}\n\nXem chi tiết yêu cầu trong file đề bài PDF hoặc trao đổi với giáo viên.\n\n- File dữ liệu vào: \`${cleanCode}.inp\` (hoặc nhập từ bàn phím)\n- File dữ liệu ra: \`${cleanCode}.out\` (hoặc in ra màn hình)\n- Giới hạn thời gian: 1000 ms\n- Giới hạn bộ nhớ: 256 MB\n`,
          sampleCode,
          testCases,
          pdfUrl: pdfFile ? `/api/problems/pending/pdf` : '',
          pdfFileName: pdfFile ? pdfFile.name : ''
        });

        if (pdfFile) {
          probObj = db.updateProblem(probObj.id, {
            pdfUrl: `/api/problems/${probObj.id}/pdf`
          });
        }
      }

      emitProblemUpdate(probObj);
      importedProblems.push(probObj);
    }

    res.json({
      success: true,
      message: `Đã import thành công ${importedProblems.length} bài tập từ thư mục TEST!`,
      problems: importedProblems
    });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi import từ thư mục TEST: ' + err.message });
  }
});

// IMPORT TESTCASES FROM DIRECTORY FORMAT: {ten}/test0x/{ten}.inp,.out
app.post('/api/problems/:id/import-folder', requireHost, (req, res) => {
  const prob = db.getProblem(req.params.id);
  if (!prob) return res.status(404).json({ error: 'Không tìm thấy bài tập' });

  const { problemCode, tests, append = false } = req.body;
  if (!tests || !Array.isArray(tests) || tests.length === 0) {
    return res.status(400).json({ error: 'Không tìm thấy test case nào trong thư mục' });
  }

  const cleanCode = (problemCode || prob.code).trim().toLowerCase();
  const errors = [];
  const validTestCases = [];

  tests.sort((a, b) => (a.testName || '').localeCompare(b.testName || '', undefined, { numeric: true }));

  const currentTestCases = prob.testCases || [];
  const startIdx = append ? currentTestCases.length : 0;
  const totalCount = append ? currentTestCases.length + tests.length : tests.length;
  const probPoints = Number(prob.points) || 100;
  const eachScore = Math.max(0.1, Math.round((probPoints / totalCount) * 100) / 100);

  tests.forEach((t, idx) => {
    const expectedInp = `${cleanCode}.inp`;
    const expectedOut = `${cleanCode}.out`;
    const actualInp = (t.inpFile || '').trim().toLowerCase();
    const actualOut = (t.outFile || '').trim().toLowerCase();

    if (actualInp !== expectedInp) {
      errors.push(`Thư mục [${t.testName}]: Tên file input "${t.inpFile}" không khớp "${cleanCode}.inp"`);
    }
    if (actualOut !== expectedOut) {
      errors.push(`Thư mục [${t.testName}]: Tên file output "${t.outFile}" không khớp "${cleanCode}.out"`);
    }

    if (t.input === undefined || t.expectedOutput === undefined) {
      errors.push(`Thư mục [${t.testName}]: Thiếu file input hoặc output`);
    }

    validTestCases.push({
      id: `tc-${Date.now()}-${startIdx + idx + 1}`,
      name: t.testName || `test${String(startIdx + idx + 1).padStart(2, '0')}`,
      input: t.input || '',
      expectedOutput: t.expectedOutput || '',
      isSample: !append && idx === 0,
      isTrap: false,
      score: eachScore
    });
  });

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: `Thư mục test case không hợp lệ (${errors.length} lỗi)`, 
      details: errors 
    });
  }

  const finalTestCases = append ? [...currentTestCases, ...validTestCases] : validTestCases;
  const updated = db.updateProblem(prob.id, { testCases: finalTestCases });
  emitProblemUpdate(updated);
  res.json({ success: true, count: finalTestCases.length, problem: updated });
});

// GET TESTCASES ON DEMAND FOR TEACHER (Lazy-loaded, ultra-fast)
app.get('/api/problems/:id/testcases', requireHost, (req, res) => {
  const prob = db.getProblem(req.params.id);
  if (!prob) return res.status(404).json({ error: 'Không tìm thấy bài tập' });
  const testCases = db.getProblemTestCases(prob.id);
  res.json(testCases);
});

// DIRECT TESTCASES UPDATE (Add, edit, delete, reorder, score weight, sample toggle)
app.put('/api/problems/:id/testcases', requireHost, (req, res) => {
  const prob = db.getProblem(req.params.id);
  if (!prob) return res.status(404).json({ error: 'Không tìm thấy bài tập' });
  const { testCases } = req.body;
  if (!Array.isArray(testCases)) return res.status(400).json({ error: 'Dữ liệu test cases không hợp lệ' });
  const updated = db.updateProblem(prob.id, { testCases });
  emitProblemUpdate(updated);
  res.json({ success: true, count: testCases.length, testCases: updated.testCases });
});

// SUBMISSIONS
app.get('/api/submissions', (req, res) => {
  const filter = {
    userId: req.user.role === 'host' ? req.query.userId : req.user.id,
    problemId: req.query.problemId,
    contestId: req.query.contestId,
    virtualSessionId: req.query.virtualSessionId,
    isVirtual: req.query.isVirtual
  };
  const submissions = db.getSubmissions(filter);
  res.json(req.user.role === 'host'
    ? submissions
    : submissions.map(sub => sanitizeSubmissionForStudent(sub, { allowDetails: canStudentViewSubmissionDetails(sub, db) }))
  );
});

app.get('/api/submissions/:id', (req, res) => {
  const sub = db.getSubmission(req.params.id);
  if (!sub) return res.status(404).json({ error: 'Submission not found' });
  if (req.user.role !== 'host' && sub.userId !== req.user.id) {
    return res.status(403).json({ code: 'SUBMISSION_FORBIDDEN', error: 'Bạn không có quyền xem bài nộp này.' });
  }
  const allowDetails = req.user.role === 'host' || canStudentViewSubmissionDetails(sub, db);
  res.json(req.user.role === 'host' ? sub : sanitizeSubmissionForStudent(sub, { allowDetails }));
});

// GET FULL RAW TESTCASE DETAILS FOR SUBMISSION (On-demand inspection for teachers and students after exam)
app.get('/api/submissions/:id/full-test/:testIndex', (req, res) => {
  const sub = db.getSubmission(req.params.id);
  if (!sub) return res.status(404).json({ error: 'Không tìm thấy bài nộp' });

  // Kiểm tra quyền: Giáo viên hoặc học sinh chủ bài nộp khi đã thi xong
  if (req.user.role !== 'host') {
    if (sub.userId !== req.user.id) {
      return res.status(403).json({ code: 'FORBIDDEN', error: 'Bạn không có quyền xem bài nộp này.' });
    }
    if (!canStudentViewSubmissionDetails(sub, db)) {
      return res.status(403).json({ code: 'CONTEST_RUNNING', error: 'Kỳ thi đang diễn ra. Chi tiết testcase chỉ mở sau khi kỳ thi kết thúc.' });
    }
  }

  const testIdx = parseInt(req.params.testIndex, 10);
  const detail = (sub.details || []).find(d => d.testIndex === testIdx) || sub.details?.[testIdx - 1];

  // Fetch complete raw testcase directly from testcase store on disk
  const testCases = db.getProblemTestCases(sub.problemId);
  const tc = (testCases && testCases.length >= testIdx) ? testCases[testIdx - 1] : null;

  res.json({
    testIndex: testIdx,
    name: detail?.name || tc?.name || `Test #${testIdx}`,
    status: detail?.status || 'UNKNOWN',
    time: detail?.time || 0,
    memory: detail?.memory || 0,
    scoreEarned: detail?.scoreEarned || 0,
    message: detail?.message || '',
    fullInput: tc?.input !== undefined ? tc.input : (detail?.input || ''),
    fullExpectedOutput: tc?.expectedOutput !== undefined ? tc.expectedOutput : (detail?.expectedOutput || ''),
    userOutput: detail?.userOutput || '',
    diff: detail?.diff || ''
  });
});

// Helper: Check if client IP is within whitelist (supports exact, wildcard 192.168.1.*, or range 192.168.1.10-50)
function isIpAllowed(clientIp, whitelistStr) {
  if (!whitelistStr || !whitelistStr.trim()) return true;
  const cleanClient = String(clientIp || '').replace(/^::ffff:/, '').trim();

  const rules = whitelistStr.split(/[,;\n]+/).map(r => r.trim()).filter(Boolean);
  if (rules.length === 0) return true;

  for (const rule of rules) {
    if (rule === cleanClient || (cleanClient === '127.0.0.1' && (rule === 'localhost' || rule === '127.0.0.1'))) {
      return true;
    }
    if (rule.includes('*')) {
      const regexPattern = '^' + rule.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$';
      if (new RegExp(regexPattern).test(cleanClient)) {
        return true;
      }
    }
    if (rule.includes('-')) {
      const [startStr, endStr] = rule.split('-').map(s => s.trim());
      const ipToNum = (ip) => {
        const parts = ip.split('.').map(Number);
        if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return null;
        return ((parts[0] << 24) >>> 0) + ((parts[1] << 16) >>> 0) + ((parts[2] << 8) >>> 0) + parts[3];
      };

      const clientNum = ipToNum(cleanClient);
      const startNum = ipToNum(startStr);
      let endNum = ipToNum(endStr);

      if (!endNum && /^\d+$/.test(endStr) && startStr.includes('.')) {
        const parts = startStr.split('.');
        parts[3] = endStr;
        endNum = ipToNum(parts.join('.'));
      }

      if (clientNum !== null && startNum !== null && endNum !== null) {
        if (clientNum >= Math.min(startNum, endNum) && clientNum <= Math.max(startNum, endNum)) {
          return true;
        }
      }
    }
  }
  return false;
}

app.get('/api/student/exam-lock-status', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Chưa đăng nhập' });
  }
  const lock = studentLockStates.get(req.user.id);
  if (lock && lock.isLocked) {
    return res.json({ isLocked: true, reason: lock.reason, lockedAt: lock.lockedAt });
  }
  return res.json({ isLocked: false });
});

app.post('/api/submissions', submissionRateLimiter, (req, res) => {
  const { problemId, code, contestId, virtualSessionId } = req.body;
  if (!code || !code.trim()) {
    return res.status(400).json({ error: 'Mã nguồn không được để trống' });
  }
  if (req.user.role !== 'user') {
    return res.status(403).json({ code: 'STUDENT_REQUIRED', error: 'Chỉ tài khoản học sinh được nộp bài.' });
  }

  const lockInfo = studentLockStates.get(req.user.id);
  if (lockInfo && lockInfo.isLocked) {
    return res.status(403).json({
      code: 'EXAM_LOCKED',
      error: `Bài thi của bạn đang bị giáo viên tạm khóa: ${lockInfo.reason || 'Vui lòng chờ giáo viên mở khóa.'}`
    });
  }

  const settings = db.getSettings();
  if (settings && settings.submissionsClosed) {
    return res.status(403).json({ error: 'Cổng nộp bài hiện đã đóng. Giáo viên không nhận thêm bài nộp.' });
  }

  let contest = null;
  let virtualSession = null;
  const isVirtualSubmission = !!virtualSessionId;
  if (isVirtualSubmission) {
    virtualSession = db.getVirtualSession(virtualSessionId);
    if (!virtualSession) {
      return res.status(404).json({ code: 'VIRTUAL_SESSION_NOT_FOUND', error: 'Phiên thi ảo không tồn tại.' });
    }
    if (virtualSession.userId !== req.user.id) {
      return res.status(403).json({ code: 'VIRTUAL_SESSION_FORBIDDEN', error: 'Phiên thi ảo không thuộc tài khoản này.' });
    }
    const now = Date.now();
    const end = new Date(virtualSession.endTime).getTime();
    if (virtualSession.status === 'completed' || virtualSession.status === 'timeout' || now > end) {
      if (now > end && virtualSession.status !== 'completed' && virtualSession.status !== 'timeout') {
        db.finishVirtualSession(virtualSession.id, 'timeout');
      }
      return res.status(403).json({ code: 'VIRTUAL_SESSION_ENDED', error: 'Phiên thi ảo đã hết giờ làm bài hoặc đã kết thúc.' });
    }
    if (virtualSession.status === 'left' && virtualSession.allowReopen === false) {
      return res.status(403).json({ code: 'VIRTUAL_REOPEN_DENIED', error: 'Kỳ thi không cho phép nộp bài sau khi đã rời màn hình.' });
    }
    if (contestId && contestId !== virtualSession.contestId) {
      return res.status(403).json({ code: 'VIRTUAL_CONTEST_MISMATCH', error: 'Phiên thi ảo không thuộc kỳ thi đã gửi.' });
    }
    contest = db.getContest(virtualSession.contestId);
    if (!contest) return res.status(404).json({ code: 'CONTEST_NOT_FOUND', error: 'Kỳ thi không tồn tại.' });
    contest = withDynamicContestStatus(contest);
  } else if (contestId) {
    contest = db.getContest(contestId);
    if (!contest) return res.status(404).json({ code: 'CONTEST_NOT_FOUND', error: 'Kỳ thi không tồn tại.' });
    contest = withDynamicContestStatus(contest);
  }

  const rawCode = String(req.body.problemCode || problemId || req.body.filename || '').trim();
  const cleanCode = rawCode.replace(/\.(cpp|pas|py|c|java|txt)$/i, '').trim().toLowerCase();

  let prob = db.getProblem(problemId);
  if (!prob && cleanCode) {
    prob = db.getProblem(cleanCode);
  }
  if (!prob && contest) {
    const contestProbs = (contest.problemIds || []).map(pId => db.getProblem(pId)).filter(Boolean);
    prob = contestProbs.find(p => 
      p.id === problemId || 
      p.code.toLowerCase() === cleanCode ||
      p.code.toLowerCase() === rawCode.toLowerCase()
    );
  }
  if (!prob && cleanCode && !contest) {
    // Search all problems in db by code case-insensitively
    prob = db.getProblems().find(p => p.code?.toLowerCase() === cleanCode);
  }
  if (!prob) {
    return res.status(404).json({ error: 'Không tìm thấy bài tập tương ứng để chấm (Tên bài không khớp với đề thi)' });
  }

  if (contest && !isVirtualSubmission) {
    try {
      assertSubmissionAllowed({
        contest,
        user: req.user,
        attendance: db.getContestAttendanceRecord(contest.id, req.user.id),
        now: Date.now(),
        joined: auth.hasJoinedContest(getBearerToken(req), contest.id),
        problemId: prob.id
      });
    } catch (error) {
      return handlePolicyFailure(res, error);
    }

    if (contest.ipWhitelist && contest.ipWhitelist.trim()) {
      const clientIp = String(req.socket.remoteAddress || '').replace(/^::ffff:/, '');
      if (!isIpAllowed(clientIp, contest.ipWhitelist)) {
        return res.status(403).json({ code: 'IP_NOT_ALLOWED', error: `Địa chỉ IP (${clientIp}) không nằm trong dải phòng thi được phép.` });
      }
    }
  }

  if (contest && isVirtualSubmission && !(contest.problemIds || []).includes(prob.id)) {
    return res.status(403).json({ code: 'PROBLEM_NOT_IN_CONTEST', error: 'Bài tập không thuộc kỳ thi này.' });
  }

  const studentLock = studentLockStates.get(req.user.id);
  if (studentLock && studentLock.isLocked) {
    return res.status(403).json({
      code: 'EXAM_LOCKED',
      error: `Bài làm của bạn đang bị tạm khóa: ${studentLock.reason || 'Giáo viên tạm khóa bài làm để kiểm tra'}`
    });
  }

  const att = contest ? db.getContestAttendanceRecord(contest.id, req.user.id) : null;
  const userClassName = (att?.enteredClassName || att?.className || '').trim();

  const sub = db.createSubmission({
    userId: req.user.id,
    userName: req.user.fullName || req.user.username,
    className: userClassName,
    problemId: prob.id,
    problemCode: prob.code,
    code,
    totalTests: (prob.testCases || []).length,
    contestId: contest ? contest.id : null,
    isVirtual: isVirtualSubmission,
    virtualSessionId: virtualSessionId || null,
    requireFreopen: !!contest?.requireFreopen
  });

  // Check submission mode: direct vs batch (chế độ nộp bài)
  // Ưu tiên gradingMode của kỳ thi; nếu làm bài tự do ngoài kỳ thi thì theo settings.submissionMode.
  // Trong kỳ thi ảo (virtual), luôn chấm trực tiếp để phản hồi ngay.
  const isBatchMode = !isVirtualSubmission && (contest ? contest.gradingMode === 'batch_after_deadline' : settings?.submissionMode === 'batch');
  if (!isBatchMode) {
    queue.enqueue(sub.id);
  }

  io.to('role:host').emit('submission:created', sub);
  io.to(`user:${sub.userId}`).emit('submission:created', sanitizeSubmissionForStudent(sub));
  res.json({
    ...sanitizeSubmissionForStudent(sub),
    mode: isBatchMode ? 'batch' : 'direct',
    note: isBatchMode ? 'Bài nộp đã được ghi nhận trong kỳ thi. Kết quả sẽ được công bố sau khi kết thúc giờ làm bài.' : undefined
  });
});

// Toggle submission portal open/close
app.post('/api/submissions/toggle-close', requireHost, (req, res) => {
  const current = db.getSettings();
  const updated = db.updateSettings({ submissionsClosed: !current.submissionsClosed });
  io.emit('settings:update', updated);
  res.json({ submissionsClosed: updated.submissionsClosed });
});

// CUSTOM INPUT RUN (Instant test run without scoring)
app.post('/api/custom-run', async (req, res) => {
  const { code, input, problemCode, timeLimit = 1500, memoryLimit = 256 } = req.body;
  if (!code) return res.status(400).json({ error: 'Vui lòng nhập code' });

  try {
    const result = await judge.runCustomInput(code, input || '', Number(timeLimit) || 1500, Number(memoryLimit) || 256, problemCode);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LEADERBOARD
app.get('/api/leaderboard', async (req, res) => {
  try {
    const lb = await db.getLeaderboard();
    res.json(Array.isArray(lb) ? lb : []);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Lỗi tải bảng xếp hạng' });
  }
});

// STUDENT RATING LEADERBOARD (Codeforces Rating)
app.get('/api/leaderboard/rating', async (req, res) => {
  try {
    const classId = req.query.classId || null;
    const ratingLb = typeof db.getRatingLeaderboard === 'function'
      ? db.getRatingLeaderboard(classId)
      : [];
    res.json(Array.isArray(ratingLb) ? ratingLb : []);
  } catch (err) {
    console.error('Error fetching rating leaderboard:', err);
    res.status(500).json({ error: 'Lỗi tải BXH Rating' });
  }
});

// STUDENT TRANSCRIPT & REPORT CARD
app.get('/api/student/transcript', async (req, res) => {
  try {
    const targetUserId = req.query.userId ? String(req.query.userId) : req.user?.id;

    if (!targetUserId) {
      return res.status(400).json({ error: 'Thiếu định danh học sinh' });
    }

    const transcript = typeof db.getStudentTranscript === 'function'
      ? db.getStudentTranscript(targetUserId)
      : null;

    if (!transcript) {
      return res.status(404).json({ error: 'Không tìm thấy dữ liệu học bạ' });
    }
    res.json(transcript);
  } catch (err) {
    console.error('Error fetching student transcript:', err);
    res.status(500).json({ error: 'Lỗi tải học bạ học sinh' });
  }
});

// CALCULATE CONTEST RATINGS (Codeforces Rating Engine)
app.post('/api/contests/:id/calculate-ratings', requireHost, async (req, res) => {
  try {
    const contestId = req.params.id;
    const result = typeof db.calculateContestRatings === 'function'
      ? db.calculateContestRatings(contestId)
      : { success: false, error: 'Tính năng chưa hỗ trợ' };

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Broadcast updated leaderboard to all users
    const updatedLb = await db.getLeaderboard();
    io.emit('leaderboard:update', updatedLb);
    if (typeof db.getRatingLeaderboard === 'function') {
      io.emit('leaderboard:rating:update', db.getRatingLeaderboard());
    }

    res.json(result);
  } catch (err) {
    console.error('Error calculating contest ratings:', err);
    res.status(500).json({ error: err.message || 'Lỗi tính toán rating kỳ thi' });
  }
});

// RECALCULATE & NORMALIZE SUBMISSION SCORES (Chuẩn hóa điểm số các bài nộp cũ)
app.post('/api/submissions/recalculate-scores', requireHost, (req, res) => {
  try {
    const result = typeof db.normalizeSubmissionScores === 'function'
      ? db.normalizeSubmissionScores()
      : { fixedCount: 0, totalSubmissions: 0 };
    res.json({ success: true, message: `Đã chuẩn hóa ${result.fixedCount} bài nộp`, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BATCH GRADE ALL (Teacher: grade all submissions that haven't been judged or re-grade)
// In-memory cancel token per job
let batchGradeJob = null; // { cancel: boolean }

app.post('/api/grade-all', requireHost, async (req, res) => {
  // Accept optional problemId filter
  const { problemId, regrade = false } = req.body || {};

  let allSubs = db.getSubmissions(problemId ? { problemId } : {});
  if (!regrade) {
    // Only grade QUEUED or not-yet-judged
    allSubs = allSubs.filter(s => !s.status || s.status === 'QUEUED');
  }

  if (allSubs.length === 0) {
    return res.json({ message: 'Không có bài nào cần chấm.', total: 0 });
  }

  // Cancel any previous job
  if (batchGradeJob) batchGradeJob.cancel = true;
  batchGradeJob = { cancel: false };
  const job = batchGradeJob;

  const total = allSubs.length;
  let done = 0, success = 0, errors = 0;
  const errorList = [];

  // Respond immediately so client can listen to socket events
  res.json({ message: 'Batch grading started', total });

  // Emit initial progress
  io.emit('batch:grade:progress', { total, done, success, errors, finished: false, cancelled: false });

  // Process sequentially (to avoid overloading the judge)
  for (const sub of allSubs) {
    if (job.cancel) {
      io.emit('batch:grade:progress', { total, done, success, errors, finished: false, cancelled: true, errorList });
      batchGradeJob = null;
      return;
    }

    const problem = db.getProblem(sub.problemId);
    if (!problem) {
      errors++;
      done++;
      errorList.push({ submissionId: sub.id, userName: sub.userName || sub.userId, problemCode: sub.problemCode, error: 'Bài tập không tồn tại', status: 'RE' });
      io.emit('batch:grade:progress', { total, done, success, errors, currentUser: sub.userName, currentProblem: sub.problemCode, finished: false, cancelled: false, errorList });
      continue;
    }

    io.emit('batch:grade:progress', {
      total, done, success, errors,
      currentUser: sub.userName || sub.userId,
      currentProblem: problem.code,
      finished: false,
      cancelled: false,
      errorList
    });

    try {
      const result = await judge.gradeSubmission(sub, problem, null);
      db.updateSubmission(sub.id, {
        status: result.status,
        score: result.score,
        passedTests: result.passedTests,
        totalTests: result.totalTests,
        executionTime: result.executionTime,
        memoryUsed: result.memoryUsed,
        compileError: result.compileError,
        details: result.details
      });
      if (result.status === 'CE' || result.status === 'RE') {
        errors++;
        errorList.push({
          submissionId: sub.id,
          userName: sub.userName || sub.userId,
          problemCode: problem.code,
          status: result.status,
          error: result.status === 'CE' 
            ? `Lỗi biên dịch (CE): ${result.compileError ? result.compileError.split('\n')[0].slice(0, 100) : 'Lỗi cú pháp'}` 
            : 'Lỗi thực thi (Runtime Error)'
        });
      } else {
        success++;
      }
    } catch (err) {
      errors++;
      errorList.push({ submissionId: sub.id, userName: sub.userName || sub.userId, problemCode: problem.code, error: err.message, status: 'RE' });
    }
    done++;

    io.emit('batch:grade:progress', {
      total, done, success, errors,
      currentUser: sub.userName || sub.userId,
      currentProblem: problem.code,
      finished: false,
      cancelled: false,
      errorList
    });
  }

  // Final result
  batchGradeJob = null;
  io.emit('batch:grade:progress', { total, done, success, errors, finished: true, cancelled: false, errorList });
  io.emit('leaderboard:update', db.getLeaderboard());
});

app.delete('/api/grade-all/cancel', requireHost, (req, res) => {
  if (batchGradeJob) {
    batchGradeJob.cancel = true;
    res.json({ message: 'Hủy đang được xử lý...' });
  } else {
    res.json({ message: 'Không có tác vụ chấm hàng loạt nào đang chạy.' });
  }
});

// ─── CONTESTS APIS ────────────────────────────────────────────────────────
function withDynamicContestStatus(contest, now = Date.now()) {
  const start = new Date(contest.startTime).getTime();
  const end = new Date(contest.endTime).getTime();
  let status = contest.status || 'upcoming';
  if (status !== 'ended') {
    if (status === 'running') {
      if (contest.manualEndOnly !== true && Number.isFinite(end) && now > end) {
        status = 'ended';
      }
    } else {
      if (now < start) {
        status = 'upcoming';
      } else if (contest.manualEndOnly === true) {
        status = 'running';
      } else if (now <= end) {
        status = 'running';
      } else {
        status = 'ended';
      }
    }
  }
  return { ...contest, status };
}

app.get('/api/contests', async (req, res) => {
  if (req.user && req.user.role === 'host' && (req.query.refresh === 'true' || req.query.refresh === '1')) {
    if (typeof db.reloadCache === 'function') {
      try { await db.reloadCache(); } catch (e) {}
    }
  }
  let contests = db.getContests().map(contest => withDynamicContestStatus(contest));

  if (req.user.role === 'host') {
    return res.json(contests.map(contest => {
      const rawProblems = (contest.problemIds || []).map(pId => db.getProblem(pId)).filter(Boolean);
      return sanitizeContestForHost(contest, rawProblems);
    }));
  }

  contests = contests.filter(contest => {
    if (typeof db.isStudentEligible === 'function') {
      return db.isStudentEligible(req.user, contest);
    }
    const targetStudents = (Array.isArray(contest.targetStudents) && contest.targetStudents.length > 0)
      ? contest.targetStudents
      : (Array.isArray(contest.candidateIds) ? contest.candidateIds : []);
    if (targetStudents.length > 0) {
      return targetStudents.includes(req.user.id);
    }
    const targetClasses = (Array.isArray(contest.targetClasses) && contest.targetClasses.length > 0)
      ? contest.targetClasses
      : (Array.isArray(contest.classIds) ? contest.classIds : []);
    if (targetClasses.length > 0) {
      const userClasses = Array.isArray(req.user.classes) && req.user.classes.length > 0
        ? req.user.classes
        : (req.user.classId ? [req.user.classId] : []);
      return userClasses.some(cId => targetClasses.some(tc => String(tc).toLowerCase() === String(cId).toLowerCase()));
    }
    return true;
  });
  res.json(contests.map(contest => {
    const rawProblems = (contest.problemIds || []).map(pId => db.getProblem(pId)).filter(Boolean);
    const sanitized = sanitizeContestForStudent(contest, rawProblems);
    if (!sanitized) return null;
    const att = req.user ? db.getContestAttendanceRecord(contest.id, req.user.id) : null;
    const effEnd = effectiveEndTime(contest, att, Date.now());
    return {
      ...sanitized,
      joinedAt: att?.joinedAt || undefined,
      reopened: !!att?.reopened,
      effectiveEndTime: new Date(effEnd).toISOString()
    };
  }).filter(Boolean));
});

app.post('/api/system/sync-db', requireHost, async (req, res) => {
  try {
    if (typeof db.reloadCache === 'function') {
      await db.reloadCache();
    }
    res.json({ ok: true, message: 'Đã đồng bộ lại dữ liệu từ PostgreSQL Docker.' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi đồng bộ CSDL: ' + err.message });
  }
});

app.get('/api/contests/:id', (req, res) => {
  const contest = db.getContest(req.params.id);
  if (!contest) return res.status(404).json({ error: 'Kỳ thi không tồn tại' });
  
  const dynamicContest = withDynamicContestStatus(contest);
  const rawProblems = (contest.problemIds || []).map(pId => db.getProblem(pId)).filter(Boolean);
  if (req.user.role === 'host') {
    return res.json(sanitizeContestForHost(dynamicContest, rawProblems));
  }
  const hasJoined = auth.hasJoinedContest(getBearerToken(req), contest.id);
  const isEnded = dynamicContest.status === 'ended';
  const att = req.user ? db.getContestAttendanceRecord(contest.id, req.user.id) : null;
  const effEnd = effectiveEndTime(dynamicContest, att, Date.now());
  const sanitized = sanitizeContestForStudent(dynamicContest, (hasJoined || isEnded) ? rawProblems : undefined);
  if (!hasJoined && !isEnded) {
    delete sanitized.problems;
  }
  res.json({
    ...sanitized,
    joinedAt: att?.joinedAt || undefined,
    effectiveEndTime: new Date(effEnd).toISOString()
  });
});

app.post('/api/contests/:id/join', async (req, res) => {
  const contest = db.getContest(req.params.id);
  if (!contest) return res.status(404).json({ error: 'Kỳ thi không tồn tại' });
  const attendance = db.getContestAttendanceRecord(req.params.id, req.user.id);
  const dynamicContest = withDynamicContestStatus(contest);
  const isEnded = dynamicContest.status === 'ended';

  try {
    // Chỉ ghi nhận mã/tên lớp học sinh nhập để phục vụ lập danh sách và báo cáo điểm thi cho kỳ thi này
    // Tuyệt đối không tự động tạo lớp học mới trong CSDL và không sửa hồ sơ lớp cố định của học sinh
    const enteredClassName = String(req.body?.className || '').trim();

    // 1. Cho phép học sinh xem lại đề thi & các bài đã nộp khi contest đã kết thúc (Review / Practice Mode)
    if (isEnded) {
      assertIdentityEligible(dynamicContest, req.user);
      if (contest.pinCode && !pinsMatch(contest.pinCode, req.body?.pinCode)) {
        throw new ContestPolicyError('INVALID_CONTEST_PIN', 'Mã PIN kỳ thi không đúng.');
      }
      auth.markContestJoined(getBearerToken(req), contest.id);
      const problems = (contest.problemIds || []).map(problemId => db.getProblem(problemId)).filter(Boolean);
      return res.json({
        ...sanitizeContestForStudent(dynamicContest, problems),
        isEnded: true,
        isReviewMode: true,
        joinedAt: attendance?.joinedAt || new Date().toISOString(),
        effectiveEndTime: dynamicContest.endTime || new Date().toISOString()
      });
    }

    // 2. Với contest đang diễn ra: Kiểm tra điều kiện tham gia
    const policy = assertJoinAllowed({
      contest: dynamicContest,
      user: req.user,
      suppliedPin: req.body?.pinCode,
      attendance,
      now: Date.now()
    });
    if (!auth.markContestJoined(getBearerToken(req), contest.id)) {
      return res.status(401).json({ code: 'AUTH_REQUIRED', error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' });
    }

    // Làm mới joinedAt nếu phiên tham gia cũ nằm trước mốc bắt đầu/mở lại kỳ thi
    let joinedAt = attendance?.joinedAt;
    const contestStart = contest.startTime ? new Date(contest.startTime).getTime() : 0;
    if (!joinedAt || (contestStart && new Date(joinedAt).getTime() < contestStart)) {
      joinedAt = new Date().toISOString();
    }

    const resolvedClassName = enteredClassName || attendance?.enteredClassName || attendance?.className || '';

    db.updateContestAttendance(contest.id, req.user.id, {
      status: 'present',
      joinedAt: joinedAt,
      ip: String(req.socket.remoteAddress || '').replace(/^::ffff:/, ''),
      lastActive: new Date().toISOString(),
      className: resolvedClassName,
      enteredClassName: enteredClassName || attendance?.enteredClassName || ''
    });
    const problems = (contest.problemIds || []).map(problemId => db.getProblem(problemId)).filter(Boolean);
    res.json({
      ...sanitizeContestForStudent(dynamicContest, problems),
      joinedAt,
      reopened: !!attendance?.reopened,
      effectiveEndTime: new Date(policy.effectiveEndTime).toISOString()
    });
  } catch (error) {
    handlePolicyFailure(res, error);
  }
});

function processContestImportedProblems(importedProblems, existingProblemIds = []) {
  if (!Array.isArray(importedProblems) || importedProblems.length === 0) {
    return existingProblemIds;
  }
  const problemIds = [...existingProblemIds];
  const allProblems = db.getProblems() || [];

  for (const imp of importedProblems) {
    if (!imp || !imp.code) continue;
    const cleanCode = String(imp.code).trim().toUpperCase();
    const cleanTitle = String(imp.title || imp.code || '').trim() || cleanCode;
    const existing = allProblems.find(p => p && p.code && p.code.toUpperCase() === cleanCode);
    const probPoints = Number(imp.points) || 100;
    const testCount = Math.max(1, (imp.testCases || []).length);
    const autoScore = Math.round((probPoints / testCount) * 100) / 100;

    const testCases = (imp.testCases || []).map((tc, idx) => ({
      id: `tc-${Date.now()}-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`,
      name: tc.name || `test${String(idx + 1).padStart(2, '0')}`,
      input: tc.input || '',
      expectedOutput: tc.expectedOutput || '',
      isSample: false,
      score: Number(tc.points) || autoScore
    }));

    // Extract samples for students - strictly teacher-defined, never auto-generated from official test cases
    const samples = (imp.samples && Array.isArray(imp.samples))
      ? imp.samples
      : (existing && Array.isArray(existing.samples) ? existing.samples : []);

    const hasRealTestContent = testCases.some(tc => (tc.input && tc.input.trim()) || (tc.expectedOutput && tc.expectedOutput.trim()));

    const ioMode = imp.ioMode || 'stdin';
    const defaultInpFile = `${cleanCode.toLowerCase()}.inp`;
    const defaultOutFile = `${cleanCode.toLowerCase()}.out`;
    const inputFile = imp.inputFile || (ioMode === 'freopen' ? defaultInpFile : undefined);
    const outputFile = imp.outputFile || (ioMode === 'freopen' ? defaultOutFile : undefined);

    if (existing) {
      const updatePayload = {
        title: cleanTitle,
        samples: samples,
        points: probPoints,
        timeLimit: Number(imp.timeLimit) || existing.timeLimit || 1000,
        memoryLimit: Number(imp.memoryLimit) || existing.memoryLimit || 256,
        ioMode,
        inputFile,
        outputFile
      };
      // Chỉ cập nhật testCases khi có nội dung test thực tế từ upload/import
      if (hasRealTestContent) {
        updatePayload.testCases = testCases;
      }
      db.updateProblem(existing.id, updatePayload);
      if (!problemIds.includes(existing.id)) {
        problemIds.push(existing.id);
      }
    } else {
      const created = db.createProblem({
        code: cleanCode,
        title: cleanTitle,
        difficulty: 'Trung bình',
        points: probPoints,
        timeLimit: Number(imp.timeLimit) || 1000,
        memoryLimit: Number(imp.memoryLimit) || 256,
        ioMode,
        inputFile,
        outputFile,
        samples: samples,
        testCases: testCases
      });
      if (created && !problemIds.includes(created.id)) {
        problemIds.push(created.id);
      }
    }
  }
  return problemIds;
}

app.post('/api/contests', requireHost, (req, res) => {
  try {
    const { title, importedProblems, problemConfigs } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Tên kỳ thi không được để trống' });
    }
    let contestData = { ...req.body };

    // RAM configuration: up to 5120 MB (5 GB), default 256 MB
    let memoryLimit = contestData.memoryLimit !== undefined ? Number(contestData.memoryLimit) : 256;
    if (isNaN(memoryLimit) || memoryLimit < 16 || memoryLimit > 5120) {
      return res.status(400).json({ error: 'Cấu hình RAM kỳ thi phải nằm trong khoảng từ 16 MB đến 5120 MB (5 GB)' });
    }
    contestData.memoryLimit = memoryLimit;

    if (Array.isArray(importedProblems) && importedProblems.length > 0) {
      contestData.problemIds = processContestImportedProblems(importedProblems, contestData.problemIds || []);
    }
    if (problemConfigs && typeof problemConfigs === 'object') {
      for (const [probId, cfg] of Object.entries(problemConfigs)) {
        if (probId && cfg) {
          const fields = {};
          if (cfg.points !== undefined && !isNaN(Number(cfg.points))) fields.points = Number(cfg.points);
          if (cfg.timeLimit !== undefined && !isNaN(Number(cfg.timeLimit))) fields.timeLimit = Number(cfg.timeLimit);
          if (cfg.memoryLimit !== undefined && !isNaN(Number(cfg.memoryLimit))) fields.memoryLimit = Number(cfg.memoryLimit);
          if (cfg.title) fields.title = String(cfg.title).trim();
          db.updateProblem(probId, fields);
        }
      }
    }
    const contest = db.createContest(contestData);
    emitContestEvent('contest:created', contest);
    res.json(contest);
  } catch (err) {
    console.error('[Create Contest Error]', err);
    res.status(500).json({ error: err.message || 'Lỗi khi lưu kỳ thi trên máy chủ' });
  }
});

app.put('/api/contests/:id', requireHost, (req, res) => {
  try {
    const { problemConfigs } = req.body;
    let updateData = { ...req.body };

    // Validate RAM if provided (up to 5120 MB / 5 GB)
    if (updateData.memoryLimit !== undefined) {
      const memoryLimit = Number(updateData.memoryLimit);
      if (isNaN(memoryLimit) || memoryLimit < 16 || memoryLimit > 5120) {
        return res.status(400).json({ error: 'Cấu hình RAM kỳ thi phải nằm trong khoảng từ 16 MB đến 5120 MB (5 GB)' });
      }
      updateData.memoryLimit = memoryLimit;
    }

    if (Array.isArray(req.body.importedProblems) && req.body.importedProblems.length > 0) {
      const existing = db.getContest(req.params.id);
      const existingIds = updateData.problemIds || existing?.problemIds || [];
      updateData.problemIds = processContestImportedProblems(req.body.importedProblems, existingIds);
    }
    if (problemConfigs && typeof problemConfigs === 'object') {
      for (const [probId, cfg] of Object.entries(problemConfigs)) {
        if (probId && cfg) {
          const fields = {};
          if (cfg.points !== undefined && !isNaN(Number(cfg.points))) fields.points = Number(cfg.points);
          if (cfg.timeLimit !== undefined && !isNaN(Number(cfg.timeLimit))) fields.timeLimit = Number(cfg.timeLimit);
          if (cfg.memoryLimit !== undefined && !isNaN(Number(cfg.memoryLimit))) fields.memoryLimit = Number(cfg.memoryLimit);
          if (cfg.title) fields.title = String(cfg.title).trim();
          db.updateProblem(probId, fields);
        }
      }
    }
    const updated = db.updateContest(req.params.id, updateData);
    if (!updated) return res.status(404).json({ error: 'Kỳ thi không tồn tại' });
    emitContestEvent('contest:updated', updated);
    res.json(updated);
  } catch (err) {
    console.error('[Update Contest Error]', err);
    res.status(500).json({ error: err.message || 'Lỗi khi cập nhật kỳ thi trên máy chủ' });
  }
});

app.delete('/api/contests/:id', requireHost, (req, res) => {
  const ok = db.deleteContest(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Kỳ thi không tồn tại' });
  io.to('role:user').to('role:host').emit('contest:deleted', { id: req.params.id });
  res.json({ success: true });
});

app.post('/api/contests/:id/toggle-status', requireHost, (req, res) => {
  const contest = db.getContest(req.params.id);
  if (!contest) return res.status(404).json({ error: 'Kỳ thi không tồn tại' });
  const { status } = req.body; // 'running' | 'ended' | 'upcoming'
  const updates = { status };
  const now = Date.now();
  if (status === 'running') {
    // Nếu bấm Bắt đầu / Mở lại:
    // 1. Nếu startTime ở tương lai, đưa startTime về now để có hiệu lực ngay lập tức
    // 2. Nếu endTime đã qua hoặc chưa có, tự động gia hạn endTime theo durationMinutes từ thời điểm hiện tại
    const durMinutes = Math.max(1, Number(contest.durationMinutes) || 45);
    const currentStart = new Date(contest.startTime).getTime();
    const currentEnd = new Date(contest.endTime).getTime();
    if (!currentStart || now < currentStart) {
      updates.startTime = new Date(now).toISOString();
    }
    if (!currentEnd || now >= currentEnd) {
      updates.startTime = new Date(now).toISOString();
      updates.endTime = new Date(now + durMinutes * 60 * 1000).toISOString();
    }
  } else if (status === 'ended') {
    // Chốt thời gian kết thúc ngay lúc giáo viên bấm nút Dừng
    updates.endTime = new Date(now).toISOString();
    if (!contest.ratingsCalculated && typeof db.calculateContestRatings === 'function') {
      try {
        const ratingRes = db.calculateContestRatings(req.params.id);
        if (ratingRes && ratingRes.success) {
          updates.ratingsCalculated = true;
          updates.ratingsCalculatedAt = new Date().toISOString();
          if (typeof db.getRatingLeaderboard === 'function') {
            io.emit('leaderboard:rating:update', db.getRatingLeaderboard());
          }
        }
      } catch (rErr) {
        console.warn('[Auto Rating on End Contest Error]', rErr);
      }
    }
  }
  const updated = db.updateContest(req.params.id, updates);
  const dynamicContest = withDynamicContestStatus(updated);
  emitContestEvent('contest:updated', dynamicContest);
  res.json(dynamicContest);
});

app.get('/api/contests/:id/leaderboard', async (req, res) => {
  try {
    const isVirtual = req.query.virtual === 'true';
    const contest = await db.getContest(req.params.id);
    if (!contest) return res.status(404).json({ error: 'Kỳ thi không tồn tại' });
    let submittedBefore;
    const dynamicContest = withDynamicContestStatus(contest);
    const freezeMinutes = Math.max(0, Number(contest.freezeScoreboardMinutes) || 0);
    if (req.user && req.user.role !== 'host' && !isVirtual && dynamicContest.status === 'running' && freezeMinutes > 0) {
      const freezeAt = new Date(contest.endTime).getTime() - freezeMinutes * 60 * 1000;
      if (Date.now() >= freezeAt) submittedBefore = freezeAt;
    }
    const leaderboard = await db.getContestLeaderboard(req.params.id, isVirtual, { submittedBefore });
    res.json(Array.isArray(leaderboard) ? leaderboard : []);
  } catch (err) {
    console.error('Error fetching contest leaderboard:', err);
    res.status(500).json({ error: 'Lỗi tải bảng xếp hạng kỳ thi' });
  }
});

// ─── VIRTUAL PARTICIPATION (THI ẢO) ─────────────────────────────────────────
app.post('/api/contests/:id/virtual-start', (req, res) => {
  const contest = db.getContest(req.params.id);
  if (!contest) return res.status(404).json({ error: 'Kỳ thi không tồn tại' });
  if (req.user.role !== 'user') {
    return res.status(403).json({ code: 'STUDENT_REQUIRED', error: 'Chỉ tài khoản học sinh được thi ảo.' });
  }
  if (withDynamicContestStatus(contest).status !== 'ended') {
    return res.status(403).json({ code: 'VIRTUAL_NOT_AVAILABLE', error: 'Thi ảo chỉ mở sau khi kỳ thi chính thức kết thúc.' });
  }

  const now = Date.now();
  const existingSessions = db.getVirtualSessions({ contestId: contest.id, userId: req.user.id });
  const activeSession = existingSessions.find(s => s.status === 'running' || s.status === 'left');

  if (activeSession) {
    const end = new Date(activeSession.endTime).getTime();
    if (now > end) {
      db.finishVirtualSession(activeSession.id, 'timeout');
    } else if (activeSession.status === 'left') {
      if (activeSession.allowReopen === false) {
        return res.status(403).json({ code: 'VIRTUAL_REOPEN_DENIED', error: 'Kỳ thi không cho phép vào lại sau khi đã rời màn hình.' });
      }
      const resumed = db.resumeVirtualSession(activeSession.id);
      const problems = (contest.problemIds || []).map(problemId => db.getProblem(problemId)).filter(Boolean);
      return res.json({ ...resumed, contest: sanitizeContestForStudent(withDynamicContestStatus(contest), problems) });
    } else {
      const problems = (contest.problemIds || []).map(problemId => db.getProblem(problemId)).filter(Boolean);
      return res.json({ ...activeSession, contest: sanitizeContestForStudent(withDynamicContestStatus(contest), problems) });
    }
  }

  const session = db.createVirtualSession({
    userId: req.user.id,
    userName: req.user.fullName || req.user.username,
    contestId: contest.id,
    durationMinutes: contest.durationMinutes
  });
  const problems = (contest.problemIds || []).map(problemId => db.getProblem(problemId)).filter(Boolean);
  res.json({ ...session, contest: sanitizeContestForStudent(withDynamicContestStatus(contest), problems) });
});

app.get('/api/virtual-sessions/active', (req, res) => {
  const session = db.getActiveVirtualSession(req.user.id);
  if (!session || session.status === 'completed' || session.status === 'timeout') {
    return res.json(null);
  }
  const contest = db.getContest(session.contestId);
  const problems = contest ? (contest.problemIds || []).map(pId => db.getProblem(pId)).filter(Boolean) : [];
  res.json({
    ...session,
    contest: contest ? sanitizeContestForStudent(withDynamicContestStatus(contest), problems) : null
  });
});

app.post('/api/virtual-sessions/:id/leave', (req, res) => {
  const session = db.getVirtualSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'Phiên thi ảo không tồn tại' });
  if (req.user.role !== 'host' && session.userId !== req.user.id) {
    return res.status(403).json({ error: 'Phiên thi ảo không thuộc tài khoản này.' });
  }
  const updated = db.leaveVirtualSession(req.params.id);
  io.to('role:host').emit('virtual_session:updated', updated);
  res.json(updated);
});

app.post('/api/virtual-sessions/:id/resume', (req, res) => {
  const session = db.getVirtualSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'Phiên thi ảo không tồn tại' });
  if (req.user.role !== 'host' && session.userId !== req.user.id) {
    return res.status(403).json({ error: 'Phiên thi ảo không thuộc tài khoản này.' });
  }
  const now = Date.now();
  const end = new Date(session.endTime).getTime();
  if (session.status === 'completed' || session.status === 'timeout' || now > end) {
    if (now > end && session.status !== 'completed' && session.status !== 'timeout') {
      db.finishVirtualSession(session.id, 'timeout');
    }
    return res.status(403).json({ code: 'VIRTUAL_SESSION_ENDED', error: 'Phiên thi ảo đã hết giờ làm bài hoặc đã kết thúc.' });
  }
  if (session.status === 'left' && session.allowReopen === false) {
    return res.status(403).json({ code: 'VIRTUAL_REOPEN_DENIED', error: 'Kỳ thi không cho phép vào lại sau khi đã rời màn hình.' });
  }
  const updated = db.resumeVirtualSession(req.params.id);
  io.to('role:host').emit('virtual_session:updated', updated);
  res.json(updated);
});

app.get('/api/contests/:id/virtual-sessions', (req, res) => {
  const userId = req.user.role === 'host' ? req.query.userId : req.user.id;
  const sessions = db.getVirtualSessions({ contestId: req.params.id, userId });
  res.json(sessions);
});

app.post('/api/virtual-sessions/:id/finish', (req, res) => {
  const session = db.getVirtualSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'Phiên thi ảo không tồn tại' });
  if (req.user.role !== 'host' && session.userId !== req.user.id) {
    return res.status(403).json({ code: 'VIRTUAL_SESSION_FORBIDDEN', error: 'Phiên thi ảo không thuộc tài khoản này.' });
  }
  const endReason = req.body?.endReason || 'manual';
  const finished = db.finishVirtualSession(req.params.id, endReason);
  io.to('role:host').emit('virtual_session:updated', finished);
  res.json(finished);
});

app.get('/api/contests/:id/virtual-leaderboard', (req, res) => {
  const board = db.getContestLeaderboard(req.params.id, true);
  res.json(board);
});

// CONTEST ATTENDANCE & ROOM CONTROL
app.get('/api/contests/:id/attendance', requireHost, (req, res) => {
  const attendance = db.getContestAttendance(req.params.id);
  // Merge live socket online status & IP
  const onlineList = Array.from(onlineUsers.values());
  const enriched = attendance.map(item => {
    const live = onlineList.find(o => o.userId === item.userId);
    return {
      ...item,
      isOnline: !!live,
      ip: live?.ip || item.ip || ''
    };
  });
  res.json(enriched);
});

app.post('/api/contests/:id/attendance', requireHost, (req, res) => {
  const { userId, status, reason, extraMinutes } = req.body;
  if (!userId) return res.status(400).json({ error: 'Thiếu userId' });
  const updated = db.updateContestAttendance(req.params.id, userId, { status, reason, extraMinutes });
  io.to('role:host').emit('contest:attendance_changed', { contestId: req.params.id, userId, ...updated });
  res.json(updated);
});

app.post('/api/contests/:id/candidates', requireHost, (req, res) => {
  const { candidateIds } = req.body;
  if (!Array.isArray(candidateIds)) return res.status(400).json({ error: 'Danh sách candidateIds không hợp lệ' });
  const contest = db.updateContestCandidates(req.params.id, candidateIds);
  if (!contest) return res.status(404).json({ error: 'Không tìm thấy kỳ thi' });
  io.to('role:host').emit('contest:candidates_updated', { contestId: req.params.id, candidateIds });
  res.json({ success: true, count: candidateIds.length, contest });
});

app.post('/api/contests/:id/extra-time', requireHost, (req, res) => {
  const { userId, extraMinutes = 5 } = req.body;
  if (!userId) return res.status(400).json({ error: 'Thiếu userId' });
  const updated = db.addExtraTime(req.params.id, userId, extraMinutes);
  
  // Realtime notify specific student socket
  for (const [sockId, client] of onlineUsers.entries()) {
    if (client.userId === userId) {
      io.to(sockId).emit('contest:extra_time', {
        contestId: req.params.id,
        extraMinutes: Number(extraMinutes),
        totalExtraMinutes: updated.extraMinutes
      });
    }
  }
  
  io.to('role:host').emit('contest:attendance_changed', { contestId: req.params.id, userId, ...updated });
  res.json({ success: true, extraMinutes, totalExtraMinutes: updated.extraMinutes });
});

app.post('/api/contests/:id/reopen', requireHost, (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Thiếu userId' });
  const updated = db.reopenContestForUser(req.params.id, userId);

  // Realtime notify student
  for (const [sockId, client] of onlineUsers.entries()) {
    if (client.userId === userId) {
      io.to(sockId).emit('contest:reopened', { contestId: req.params.id });
    }
  }

  io.to('role:host').emit('contest:attendance_changed', { contestId: req.params.id, userId, ...updated });
  res.json({ success: true, message: 'Đã mở lại lượt thi thành công' });
});

app.post('/api/contests/:id/suspend', requireHost, (req, res) => {
  const { userId, reason = 'Vi phạm quy chế phòng thi' } = req.body;
  if (!userId) return res.status(400).json({ error: 'Thiếu userId' });
  const updated = db.updateContestAttendance(req.params.id, userId, { status: 'suspended', reason });

  // Realtime notify student
  for (const [sockId, client] of onlineUsers.entries()) {
    if (client.userId === userId) {
      io.to(sockId).emit('contest:suspended', { contestId: req.params.id, reason });
    }
  }

  io.to('role:host').emit('contest:attendance_changed', { contestId: req.params.id, userId, ...updated });
  res.json({ success: true, message: 'Đã đình chỉ bài thi của học sinh' });
});

// CLASSES & USERS
app.get('/api/classes', requireHost, async (req, res) => {
  try {
    const raw = typeof db.getClasses === 'function' ? await db.getClasses() : [];
    res.json(Array.isArray(raw) ? raw : []);
  } catch (err) {
    res.json([]);
  }
});

app.post('/api/classes/join', async (req, res) => {
  if (!req.user || req.user.role !== 'user') {
    return res.status(401).json({ error: 'Chỉ học sinh mới có thể tham gia lớp học' });
  }
  const classNameInput = String(req.body?.className || req.body?.name || req.body?.joinCode || '').trim();
  if (!classNameInput) {
    return res.status(400).json({ error: 'Vui lòng nhập tên lớp của bạn (Ví dụ: 11C7, 10A1...)' });
  }

  const rawClasses = typeof db.getClasses === 'function' ? await db.getClasses() : [];
  const classes = Array.isArray(rawClasses) ? rawClasses : [];
  let targetClass = classes.find(c => 
    c.id === classNameInput || 
    c.name.toLowerCase() === classNameInput.toLowerCase() ||
    (c.joinCode && c.joinCode.toUpperCase() === classNameInput.toUpperCase())
  );
  if (!targetClass) {
    const gradeMatch = classNameInput.match(/^(\d+)/);
    const grade = gradeMatch ? parseInt(gradeMatch[1], 10) : undefined;
    targetClass = typeof db.createClass === 'function' 
      ? await db.createClass({ name: classNameInput, grade, teacher: 'Giáo viên phụ trách' })
      : { id: classNameInput, name: classNameInput };
  }

  const currentClasses = Array.isArray(req.user.classes) && req.user.classes.length > 0 
    ? [...req.user.classes] 
    : (req.user.classId ? [req.user.classId] : []);
  if (!currentClasses.includes(targetClass.id)) {
    currentClasses.push(targetClass.id);
  }

  if (typeof db.updateUser === 'function') {
    await db.updateUser(req.user.id, {
      classId: targetClass.id,
      classes: currentClasses
    });
  }

  const updatedUser = typeof db.getUser === 'function' ? await db.getUser(req.user.id) : req.user;
  res.json({ success: true, message: `Đã tham gia lớp ${targetClass.name}`, class: targetClass, user: safeUser(updatedUser) });
});

app.post('/api/classes', requireHost, async (req, res) => {
  const cls = typeof db.createClass === 'function' ? await db.createClass(req.body) : req.body;
  res.json(cls);
});

app.get('/api/users', requireHost, (req, res) => {
  res.json(db.getUsers().map(safeUser));
});

app.post('/api/users', requireHost, async (req, res) => {
  try {
    const rawPassword = req.body?.password || req.body?.temporaryPassword || '123456';
    const user = db.createUser({
      username: req.body?.username,
      fullName: req.body?.fullName,
      role: 'user',
      classId: req.body?.classId,
      classes: req.body?.classes,
      passwordHash: rawPassword,
      mustChangePassword: false
    });
    res.status(201).json({ user: safeUser(user), password: rawPassword, temporaryPassword: rawPassword });
  } catch (error) {
    handleAuthFailure(res, error);
  }
});

// BATCH CREATE STUDENTS
app.post('/api/users/batch', requireHost, async (req, res) => {
  const { students, classId, defaultPassword } = req.body;
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ error: 'Danh sách học sinh không hợp lệ' });
  }

  const created = [];
  const credentials = [];
  const existingUsers = db.getUsers();

  for (const s of students) {
    const cleanUser = (s.username || '').trim().toLowerCase();
    if (!cleanUser) continue;

    let user = existingUsers.find(u => u.username === cleanUser);
    if (!user) {
      const rawPassword = s.password || defaultPassword || '123456';
      user = db.createUser({
        username: cleanUser,
        passwordHash: rawPassword,
        fullName: s.fullName || cleanUser,
        role: 'user',
        classId: s.classId || classId || (db.getClasses()[0]?.id || 'cls-1'),
        classes: s.classes,
        mustChangePassword: false
      });
      created.push(safeUser(user));
      credentials.push({ username: user.username, password: rawPassword, temporaryPassword: rawPassword });
      existingUsers.push(user);
    }
  }

  res.json({ success: true, count: created.length, created, credentials });
});

// RESET STUDENT PASSWORD
app.put('/api/users/:id/reset-password', requireHost, async (req, res) => {
  const newPassword = req.body?.newPassword || req.body?.password || '123456';
  const user = db.setUserPasswordHash(req.params.id, newPassword, false);
  if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
  auth.revokeUserSessions(user.id);
  res.json({ success: true, message: 'Đã đặt lại mật khẩu thành công', user: safeUser(user), password: newPassword, temporaryPassword: newPassword });
});

// ONLINE USERS
app.get('/api/users/online', requireHost, (req, res) => {
  res.json(Array.from(onlineUsers.values()));
});

// UPDATE USER DETAILS
app.put('/api/users/:id', requireHost, (req, res) => {
  const updated = db.updateUser(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
  res.json(safeUser(updated));
});

// TOGGLE USER LOCK
app.post('/api/users/:id/toggle-lock', requireHost, (req, res) => {
  const updated = db.toggleUserLock(req.params.id);
  if (!updated) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
  
  // If user is locked, disconnect any active sockets
  if (updated.isLocked) {
    auth.revokeUserSessions(updated.id);
    for (const [sockId, client] of onlineUsers.entries()) {
      if (client.userId === req.params.id) {
        const targetSock = io.sockets.sockets.get(sockId);
        if (targetSock) {
          targetSock.emit('auth:locked', { message: 'Tài khoản của bạn đã bị khóa bởi giáo viên' });
          targetSock.disconnect(true);
        }
      }
    }
  }

  res.json(safeUser(updated));
});

// GET USER EXAM HISTORY & PORTFOLIO
app.get('/api/users/:id/history', requireHost, (req, res) => {
  const history = db.getUserExamHistory(req.params.id);
  res.json(history);
});

// DELETE STUDENT ACCOUNT
app.delete('/api/users/:id', requireHost, (req, res) => {
  const user = db.getUser(req.params.id);
  if (user && user.role === 'host') {
    return res.status(403).json({ error: 'Không thể xóa tài khoản Quản trị viên (Admin)' });
  }
  const ok = db.deleteUser(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
  auth.revokeUserSessions(req.params.id);
  res.json({ success: true });
});

// EXCEL IMPORT STUDENTS
app.post('/api/users/import-excel', requireHost, async (req, res) => {
  try {
    const XLSX = require('xlsx');
    let rows = [];
    if (req.body?.fileBase64) {
      const buffer = Buffer.from(req.body.fileBase64, 'base64');
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else if (Array.isArray(req.body?.students)) {
      rows = req.body.students;
    } else {
      return res.status(400).json({ error: 'Dữ liệu file Excel không hợp lệ.' });
    }

    const created = [];
    const existingUsers = db.getUsers();

    for (const r of rows) {
      const fullName = (r['Họ và tên'] || r['Họ Tên'] || r['fullName'] || r['name'] || '').toString().trim();
      const rawUser = (r['Tên đăng nhập'] || r['Mã học sinh'] || r['username'] || r['user'] || '').toString().trim().toLowerCase();
      const initialPassword = (r['Mật khẩu'] || r['Mật khẩu ban đầu'] || r['password'] || req.body?.defaultPassword || '123456').toString().trim();

      if (!rawUser) continue;
      const cleanUser = rawUser.replace(/[^a-z0-9._-]/g, '');
      if (!cleanUser) continue;

      let user = existingUsers.find(u => u.username === cleanUser);
      if (!user) {
        user = db.createUser({
          username: cleanUser,
          fullName: fullName || cleanUser,
          role: 'user',
          isAdmin: false,
          classId: 'class-1',
          classes: ['class-1'],
          passwordHash: initialPassword,
          mustChangePassword: false
        });
        created.push({ username: user.username, fullName: user.fullName, password: initialPassword });
        existingUsers.push(user);
      }
    }

    res.json({ success: true, count: created.length, created });
  } catch (err) {
    console.error('Excel Import Error:', err);
    res.status(500).json({ error: 'Lỗi khi đọc file Excel: ' + err.message });
  }
});

// EXCEL EXPORT STUDENTS
app.get('/api/users/export-excel', requireHost, (req, res) => {
  try {
    const XLSX = require('xlsx');
    const users = db.getUsers().filter(u => u.role !== 'host' && !u.isAdmin);
    const data = users.map((u, idx) => ({
      'STT': idx + 1,
      'Mã học sinh / Username': u.username,
      'Họ và tên': u.fullName || u.username,
      'Điểm tích lũy': u.points || 0,
      'Trạng thái': u.isLocked ? 'Đang bị khóa' : 'Hoạt động'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Học Sinh');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Danh_sach_hoc_sinh_UMTJudge.xlsx"');
    res.send(buffer);
  } catch (err) {
    console.error('Excel Export Error:', err);
    res.status(500).json({ error: 'Lỗi khi xuất file Excel: ' + err.message });
  }
});

// ANTI-CHEAT PLAGIARISM CHECKER
app.get('/api/anticheat/scan/:problemId', requireHost, (req, res) => {
  const threshold = Number(req.query.threshold) || 60;
  const results = antiCheat.scanProblemSubmissions(req.params.problemId, threshold);
  res.json(results);
});

// EXPORT REPORT (CSV) - Điểm tổng quan toàn hệ thống kèm điểm thành phần từng bài
app.get('/api/export/csv', requireHost, async (req, res) => {
  try {
    const leaderboard = await db.getLeaderboard();
    const problems = await db.getProblems();
    const rawClasses = typeof db.getClasses === 'function' ? await db.getClasses() : [];
    const classMap = {};
    (Array.isArray(rawClasses) ? rawClasses : []).forEach(c => { classMap[c.id] = c.name; });

    let csv = 'Hạng,Họ và Tên,Lớp,Tên Đăng Nhập,Điểm Tổng,Số Bài AC';
    for (const p of problems) {
      csv += `,"${p.code || p.title} (${p.points || 100}đ)"`;
    }
    csv += '\n';

    (Array.isArray(leaderboard) ? leaderboard : []).forEach((user, idx) => {
      const displayClass = user.className || classMap[user.classId] || user.classId || 'Tự do';
      let row = `${idx + 1},"${user.userName}","${displayClass}","${user.username}",${user.totalScore},${user.problemsSolved ?? user.solved ?? 0}`;
      for (const p of problems) {
        const pObj = user.solvedProblems?.[p.id];
        const score = typeof pObj === 'object' ? (pObj?.score ?? 0) : (Number(pObj) || 0);
        row += `,${score}`;
      }
      csv += row + '\n';
    });

    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment('Bao_Cao_Diem_SchoolJudge.csv');
    res.send('\uFEFF' + csv);
  } catch (err) {
    console.error('Error exporting CSV:', err);
    res.status(500).send('Lỗi khi xuất file báo cáo điểm');
  }
});

// OFFICIAL CONTEST REPORT & EXPORT (Strictly REAL participants only)
app.get('/api/contests/:id/official-report', requireHost, async (req, res) => {
  try {
    const report = await db.getOfficialContestReport(req.params.id);
    if (!report) return res.status(404).json({ error: 'Không tìm thấy kỳ thi' });
    res.json(report);
  } catch (err) {
    console.error('Error in official-report:', err);
    res.status(500).json({ error: 'Lỗi khi tạo báo cáo kỳ thi' });
  }
});

app.post('/api/contests/:id/official-report', requireHost, async (req, res) => {
  try {
    const report = db.saveOfficialContestReport(req.params.id, req.body);
    if (!report) return res.status(404).json({ error: 'Không tìm thấy kỳ thi' });
    res.json({ success: true, report });
  } catch (err) {
    console.error('Error saving official-report:', err);
    res.status(500).json({ error: 'Lỗi khi lưu báo cáo kỳ thi' });
  }
});

app.post('/api/contests/:id/official-report/reset', requireHost, async (req, res) => {
  try {
    const report = db.resetOfficialContestReport(req.params.id);
    if (!report) return res.status(404).json({ error: 'Không tìm thấy kỳ thi' });
    res.json({ success: true, report });
  } catch (err) {
    console.error('Error resetting official-report:', err);
    res.status(500).json({ error: 'Lỗi khi đặt lại báo cáo kỳ thi' });
  }
});

app.get('/api/contests/:id/export-official-csv', requireHost, async (req, res) => {
  try {
    const report = await db.getOfficialContestReport(req.params.id);
    if (!report) return res.status(404).send('Không tìm thấy kỳ thi');

    // Format: STT, HỌ VÀ TÊN, LỚP, [CÁC BÀI THI], TỔNG ĐIỂM
    let csv = `BẢNG ĐIỂM KỲ THI: ${report.contestTitle}\n`;
    csv += `Ngày lập: ${new Date().toLocaleDateString('vi-VN')}\n\n`;

    const problems = report.problems || [];
    let header = 'STT,HỌ VÀ TÊN,LỚP';
    problems.forEach(p => {
      header += `,"${p.code || p.title} (${p.points || 100}đ)"`;
    });
    header += ',TỔNG ĐIỂM\n';
    csv += header;

    (report.rows || []).forEach(r => {
      let row = `${r.stt},"${r.fullName}","${r.className}"`;
      problems.forEach(p => {
        const pScore = r.problemScores?.[p.id] ?? 0;
        row += `,${pScore}`;
      });
      row += `,${r.score}\n`;
      csv += row;
    });

    const safeFileName = `Bang_Diem_${report.contestTitle.replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_')}.csv`;
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment(safeFileName);
    res.send('\uFEFF' + csv);
  } catch (err) {
    console.error('Error in export-official-csv:', err);
    res.status(500).send('Lỗi khi xuất bảng điểm CSV');
  }
});

// EXPORT CONTEST LEADERBOARD CSV (Bảng xếp hạng kỳ thi chi tiết từng bài thi)
app.get('/api/contests/:id/export-leaderboard-csv', requireHost, async (req, res) => {
  try {
    const contest = await db.getContest(req.params.id);
    if (!contest) return res.status(404).send('Không tìm thấy kỳ thi');

    const leaderboard = await db.getContestLeaderboard(req.params.id, false);
    const contestProblems = (contest.problemIds || []).map(pId => {
      const p = db.getProblem(pId);
      return {
        id: pId,
        code: p?.code || pId,
        title: p?.title || p?.code || pId,
        points: Number(p?.points) || 100
      };
    });

    let csv = `BẢNG XẾP HẠNG KỲ THI: ${contest.title}\n`;
    csv += `Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}\n\n`;

    let header = 'HẠNG,HỌ VÀ TÊN,LỚP,TÊN ĐĂNG NHẬP';
    contestProblems.forEach(p => {
      header += `,"${p.code || p.title} (${p.points}đ)"`;
    });
    header += ',TỔNG ĐIỂM,SỐ BÀI ĐÃ GIẢI,LẦN NỘP\n';
    csv += header;

    (Array.isArray(leaderboard) ? leaderboard : []).forEach((u, idx) => {
      let row = `${u.rank || idx + 1},"${u.userName}","${u.className || ''}","${u.username}"`;
      contestProblems.forEach(p => {
        const pScore = u.problemScores?.[p.id]?.score ?? u.solvedProblems?.[p.id]?.score ?? 0;
        row += `,${pScore}`;
      });
      row += `,${u.totalScore},${u.problemsSolved ?? 0},${u.totalSubmissions ?? 0}\n`;
      csv += row;
    });

    const safeFileName = `BXH_${contest.title.replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_')}.csv`;
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment(safeFileName);
    res.send('\uFEFF' + csv);
  } catch (err) {
    console.error('Error exporting leaderboard CSV:', err);
    res.status(500).send('Lỗi khi xuất bảng xếp hạng CSV');
  }
});

// PROMOTE SCHOOL YEAR (Đôn khối học sinh sang năm học mới: 10->11, 11->12, 12 tốt nghiệp)
app.post('/api/classes/promote-school-year', requireHost, async (req, res) => {
  try {
    const result = typeof db.promoteSchoolYear === 'function' ? await db.promoteSchoolYear() : { success: false, error: 'Chức năng chưa hỗ trợ' };
    res.json(result);
  } catch (err) {
    console.error('Error in promote-school-year:', err);
    res.status(500).json({ error: 'Lỗi khi chuyển năm học mới' });
  }
});

// SERVE BUILT FRONTEND FOR DIRECT LAN WEB ACCESS (Port 4000)
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/socket.io')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      next();
    }
  });
}

// ========================================
// AUTO-UPDATE API (LAN-based)
// ========================================

function getUpdatesDir() {
  const appDataDir = process.env.APPDATA || process.env.HOME || process.cwd();
  const dir = path.join(appDataDir, 'SchoolJudge LAN', 'updates');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function findLatestSignedUpdate(platform = 'win32') {
  const updatesDir = getUpdatesDir();
  const isLinux = platform === 'linux';
  const manifestFileName = isLinux ? 'update-manifest-linux.json' : 'update-manifest.json';
  const manifestPath = path.join(updatesDir, manifestFileName);
  try {
    // 1. Kiểm tra file update-manifest[-linux].json nếu có
    const candidateManifests = isLinux
      ? [manifestPath, path.join(updatesDir, 'update-manifest.json')]
      : [manifestPath];

    for (const mPath of candidateManifests) {
      if (fs.existsSync(mPath)) {
        try {
          const manifest = JSON.parse(fs.readFileSync(mPath, 'utf8'));
          const rawFileName = manifest.fileName || (manifest.url ? path.basename(manifest.url) : '');
          const isDebOrAppImage = /\.(deb|AppImage|tar\.gz)$/i.test(rawFileName);
          if (isLinux && !isDebOrAppImage) continue;
          if (!isLinux && !/\.exe$/i.test(rawFileName)) continue;

          const installerPath = rawFileName ? path.join(updatesDir, rawFileName) : '';
          if (installerPath && fs.existsSync(installerPath)) {
            const stat = fs.statSync(installerPath);
            if (stat.isFile()) {
              manifest.fileName = rawFileName;
              manifest.size = stat.size;
              return { manifest, installerPath, manifestPath: mPath };
            }
          }
        } catch {}
      }
    }

    // 2. Dự phòng: Tự động quét tìm file installer (.deb / .AppImage cho Linux, .exe cho Windows)
    const candidateDirs = [updatesDir, path.join(process.cwd(), 'release')].filter(d => fs.existsSync(d));
    const targetFiles = [];

    for (const cDir of candidateDirs) {
      try {
        const files = fs.readdirSync(cDir);
        for (const f of files) {
          if (f.endsWith('.tmp') || f.endsWith('.part') || f.endsWith('.blockmap')) continue;
          const lower = f.toLowerCase();
          if (isLinux) {
            if (!lower.endsWith('.deb') && !lower.endsWith('.appimage') && !lower.endsWith('.tar.gz')) continue;
          } else {
            if (!lower.endsWith('.exe')) continue;
          }
          const fullPath = path.join(cDir, f);
          try {
            if (fs.statSync(fullPath).isFile()) {
              targetFiles.push({ file: f, path: fullPath, dir: cDir });
            }
          } catch {}
        }
      } catch {}
    }

    if (targetFiles.length > 0) {
      targetFiles.sort((a, b) => {
        const vA = (a.file.match(/(\d+\.\d+\.\d+)/) || [])[1] || '0.0.0';
        const vB = (b.file.match(/(\d+\.\d+\.\d+)/) || [])[1] || '0.0.0';
        try {
          return compareVersions(vB, vA);
        } catch {
          return b.file.localeCompare(a.file);
        }
      });

      const bestItem = targetFiles[0];
      const installerPath = bestItem.path;
      const stat = fs.statSync(installerPath);
      const versionMatch = bestItem.file.match(/(\d+\.\d+\.\d+)/);
      const version = versionMatch ? versionMatch[1] : APP_VERSION;

      const manifest = {
        schemaVersion: 1,
        appId: 'com.umtjudge.lan',
        version,
        fileName: bestItem.file,
        url: `updates/${bestItem.file}`,
        size: stat.size,
        sha256: crypto.createHash('sha256').update(fs.readFileSync(installerPath)).digest('hex'),
        publishedAt: new Date().toISOString()
      };
      try {
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
      } catch (e) {}

      return { manifest, installerPath, manifestPath };
    }
  } catch (error) {
    console.error('[Auto-Update] Lỗi nhận diện file cập nhật:', error.message);
  }
  return null;
}

// Check for updates - called by Student machines
app.get('/api/update/check', (req, res) => {
  const clientVersion = req.query.version || '0.0.0';
  const force = req.query.force === 'true';
  const platform = req.query.platform || (req.headers['user-agent']?.includes('Linux') ? 'linux' : 'win32');
  const latest = findLatestSignedUpdate(platform);

  if (!latest) {
    return res.json({
      updateAvailable: false,
      currentVersion: APP_VERSION,
      clientVersion,
      message: 'Không có bản cập nhật nào trên máy chủ.'
    });
  }

  let isNewer = false;
  try {
    isNewer = force || compareVersions(latest.manifest.version, clientVersion) > 0;
  } catch (error) {
    isNewer = force || (latest.manifest.version !== clientVersion);
  }

  res.json({
    updateAvailable: isNewer,
    currentVersion: APP_VERSION,
    latestVersion: latest.manifest.version,
    clientVersion,
    fileName: latest.manifest.fileName,
    fileSize: latest.manifest.size,
    fileSizeMB: (latest.manifest.size / (1024 * 1024)).toFixed(1),
    manifest: latest.manifest,
    message: isNewer
      ? `Có bản cập nhật mới: v${latest.manifest.version}`
      : 'Phần mềm đã là phiên bản mới nhất.'
  });
});

// Get update info
app.get('/api/update/info', requireHost, (req, res) => {
  const platform = req.query.platform || 'win32';
  const latest = findLatestSignedUpdate(platform);
  const updatesDir = getUpdatesDir();

  // Try to read release notes if exists
  let releaseNotes = '';
  try {
    const notesPath = path.join(updatesDir, 'RELEASE_NOTES.txt');
    if (fs.existsSync(notesPath)) {
      releaseNotes = fs.readFileSync(notesPath, 'utf8');
    }
  } catch (e) {}

  res.json({
    serverVersion: APP_VERSION,
    latestInstaller: latest ? {
      version: latest.manifest.version,
      fileName: latest.manifest.fileName,
      fileSize: latest.manifest.size,
      fileSizeMB: (latest.manifest.size / (1024 * 1024)).toFixed(1),
      signed: true
    } : null,
    releaseNotes,
    updatesDir
  });
});

// Download the installer file
app.get('/api/update/download', (req, res) => {
  const platform = req.query.platform || (req.headers['user-agent']?.includes('Linux') ? 'linux' : 'win32');
  const latest = findLatestSignedUpdate(platform);

  if (!latest) {
    return res.status(404).json({ error: 'Không tìm thấy file cập nhật trên máy chủ.' });
  }

  try {
    const stat = fs.statSync(latest.installerPath);
    if (!stat.isFile()) {
      return res.status(404).json({ error: 'File cập nhật không hợp lệ.' });
    }
    const fileName = latest.manifest.fileName || path.basename(latest.installerPath);
    const fileSize = latest.manifest.size || stat.size;

    console.log(`[Auto-Update] Serving installer: ${fileName} (${(fileSize / (1024 * 1024)).toFixed(1)} MB) to ${req.ip}`);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', fileSize);
    res.setHeader('X-Update-Version', latest.manifest.version || APP_VERSION);
  } catch (err) {
    return res.status(404).json({ error: 'Không thể đọc file cập nhật.' });
  }

  const stream = fs.createReadStream(latest.installerPath);
  stream.pipe(res);
  stream.on('error', (err) => {
    console.error('[Auto-Update] Stream error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Lỗi khi tải file cập nhật.' });
    }
  });
});

// Direct app installer download shortcuts for web users
app.get('/api/download/app', (req, res) => res.redirect('/api/update/download'));
app.get('/api/download', (req, res) => res.redirect('/api/update/download'));
app.get('/download', (req, res) => res.redirect('/api/update/download'));

// Broadcast update notification to all connected students via Socket.IO
app.post('/api/update/broadcast', requireHost, (req, res) => {
  const latest = findLatestSignedUpdate();
  if (latest) {
    io.emit('system:update_available', {
      version: latest.manifest.version,
      fileName: latest.manifest.fileName,
      fileSize: latest.manifest.size,
      fileSizeMB: (latest.manifest.size / (1024 * 1024)).toFixed(1),
      signed: true
    });
    console.log(`[Auto-Update] Broadcasted signed update v${latest.manifest.version} to all clients`);
    return res.json({ success: true, broadcasted: true, latest: latest.manifest });
  }
  res.json({ success: false, message: 'Chưa có file cập nhật nào trong thư mục updates.' });
});

// ==================== ACHIEVEMENTS API ====================
// Get all achievements
app.get('/api/achievements', (req, res) => {
  try {
    const list = db.getAchievements();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new achievement (Admin only)
app.post('/api/achievements', requireHost, (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Tên thành tựu không được để trống' });
    }
    const created = db.createAchievement(req.body);
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update achievement (Admin only)
app.put('/api/achievements/:id', requireHost, (req, res) => {
  try {
    const updated = db.updateAchievement(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Thành tựu không tồn tại' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete achievement (Admin only)
app.delete('/api/achievements/:id', requireHost, (req, res) => {
  try {
    const success = db.deleteAchievement(req.params.id);
    if (!success) return res.status(404).json({ error: 'Thành tựu không tồn tại' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Award achievement to student manually (Host/Admin only)
app.post('/api/achievements/award', requireHost, (req, res) => {
  try {
    const { studentId, achievementId } = req.body;
    if (!studentId || !achievementId) {
      return res.status(400).json({ error: 'Thiếu studentId hoặc achievementId' });
    }
    const award = db.awardAchievement(studentId, achievementId);
    if (!award) {
      return res.status(404).json({ error: 'Không tìm thấy danh hiệu hoặc danh hiệu chưa kích hoạt' });
    }
    if (io) {
      io.to(`user:${studentId}`).emit('achievement:unlocked', {
        achievementId,
        awardedAt: award.awardedAt
      });
    }
    res.json({ success: true, award });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student's earned achievements
app.get('/api/student/achievements', auth.authenticate, (req, res) => {
  try {
    // Automatically check and award any newly met achievements
    db.checkAndAwardAchievements(req.user.id);
    const earned = db.getStudentAchievements(req.user.id);
    const user = db.getUser(req.user.id);
    res.json({
      earned,
      points: user?.points || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== REWARDS API ====================
// Get rewards catalog
app.get('/api/rewards', (req, res) => {
  try {
    const rewards = db.getRewards();
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create reward (Admin only)
app.post('/api/rewards', requireHost, (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Tên phần thưởng không được để trống' });
    }
    const created = db.createReward(req.body);
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update reward (Admin only)
app.put('/api/rewards/:id', requireHost, (req, res) => {
  try {
    const updated = db.updateReward(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Phần thưởng không tồn tại' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete reward (Admin only)
app.delete('/api/rewards/:id', requireHost, (req, res) => {
  try {
    const success = db.deleteReward(req.params.id);
    if (!success) return res.status(404).json({ error: 'Phần thưởng không tồn tại' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student redeem reward
app.post('/api/rewards/:id/redeem', auth.authenticate, (req, res) => {
  try {
    const redemption = db.redeemReward(req.user.id, req.params.id);
    const user = db.getUser(req.user.id);
    // Broadcast redemption event to host
    io.to('role:host').emit('reward:redeemed', redemption);
    res.json({
      success: true,
      redemption,
      remainingPoints: user?.points || 0
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get redemptions list (host sees all, student sees own)
app.get('/api/rewards/redemptions', auth.authenticate, (req, res) => {
  try {
    if (req.user.role === 'host') {
      const redemptions = db.getRewardRedemptions();
      res.json(redemptions);
    } else {
      const redemptions = db.getRewardRedemptions(req.user.id);
      res.json(redemptions);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Host updates redemption status (APPROVED, REJECTED, CLAIMED)
app.put('/api/rewards/redemptions/:id/status', requireHost, (req, res) => {
  try {
    const { status } = req.body;
    if (!['PENDING', 'APPROVED', 'CLAIMED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }
    const updated = db.updateRedemptionStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Yêu cầu đổi quà không tồn tại' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── NEW COMPREHENSIVE ROADMAP APIS (STAGES, LESSONS, CHECKPOINTS & UNLOCKS) ───
app.get('/api/roadmap/progress', (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const track = req.query.track || null;
    const progress = db.computeRoadmapProgress(userId, track);
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/roadmap/stages', (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const track = req.query.track || null;
    const progress = db.computeRoadmapProgress(userId, track);
    res.json(progress.stages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/roadmap/lessons/:id', (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const track = req.query.track || null;
    const progress = db.computeRoadmapProgress(userId, track);
    let lesson = progress.lessons.find(l => l.id === req.params.id);
    if (!lesson) {
      lesson = db.getRoadmapLesson(req.params.id);
    }
    if (!lesson) return res.status(404).json({ error: 'Bài học không tồn tại' });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/roadmap/lessons/:id/mark-done', (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Vui lòng đăng nhập' });
    const success = db.markLessonDone(req.user.id, req.params.id);
    if (!success) return res.status(400).json({ error: 'Không thể đánh dấu hoàn thành' });
    const track = req.query.track || req.body?.track || null;
    const updated = db.computeRoadmapProgress(req.user.id, track);
    res.json({ success: true, progress: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/roadmap/stages/:id/test-out', (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Vui lòng đăng nhập' });
    const stage = db.getRoadmapStage(req.params.id);
    if (!stage) return res.status(404).json({ error: 'Chặng không tồn tại' });

    db.testOutStage(req.user.id, stage.id);
    const track = req.query.track || req.body?.track || null;
    const updated = db.computeRoadmapProgress(req.user.id, track);
    res.json({ success: true, message: `Chúc mừng bạn đã vượt qua chặng "${stage.title}"!`, progress: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/roadmap/unlinked-lessons', requireHost, (req, res) => {
  try {
    const unlinked = db.getUnlinkedLessons();
    res.json(unlinked);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/roadmap/lessons/:id/attach-problem', requireHost, (req, res) => {
  try {
    const { problemCode } = req.body;
    if (!problemCode) return res.status(400).json({ error: 'Thiếu mã bài tập' });
    const updated = db.attachProblemToLesson(req.params.id, problemCode);
    if (!updated) return res.status(404).json({ error: 'Bài học không tồn tại' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/roadmap/lessons/:id/detach-problem', requireHost, (req, res) => {
  try {
    const updated = db.detachProblemFromLesson(req.params.id);
    if (!updated) return res.status(404).json({ error: 'Bài học không tồn tại' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stage CRUD (Host / Teacher only)
app.post('/api/roadmap/stages', requireHost, (req, res) => {
  try {
    const stage = db.saveRoadmapStage(req.body);
    res.json(stage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/roadmap/stages/:id', requireHost, (req, res) => {
  try {
    const stage = db.saveRoadmapStage({ ...req.body, id: req.params.id });
    res.json(stage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/roadmap/stages/:id', requireHost, (req, res) => {
  try {
    const success = db.deleteRoadmapStage(req.params.id);
    if (!success) return res.status(404).json({ error: 'Chặng không tồn tại' });
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lesson CRUD (Host / Teacher only)
app.post('/api/roadmap/lessons', requireHost, (req, res) => {
  try {
    const lesson = db.saveRoadmapLesson(req.body);
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/roadmap/lessons/:id', requireHost, (req, res) => {
  try {
    const lesson = db.saveRoadmapLesson({ ...req.body, id: req.params.id });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/roadmap/lessons/:id', requireHost, (req, res) => {
  try {
    const success = db.deleteRoadmapLesson(req.params.id);
    if (!success) return res.status(404).json({ error: 'Bài học không tồn tại' });
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset roadmap to default seed data
app.post('/api/roadmap/reset-default', requireHost, (req, res) => {
  try {
    const result = db.resetRoadmapToDefault();
    res.json({ success: true, message: 'Đã khôi phục lộ trình mặc định thành công!', ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ROADMAP APIS (LỘ TRÌNH HỌC TẬP THEO CHỦ ĐỀ & BÀI TẬP THỦ CÔNG) ────────
app.get('/api/roadmap', (req, res) => {
  try {
    const topics = db.getRoadmapTopics();
    const allProblems = db.getProblems();
    const probMap = new Map(allProblems.map(p => [p.code, p]));

    // Check user's AC submissions if user is logged in
    const userSubs = req.user ? db.getSubmissions().filter(s => s.userId === req.user.id) : [];
    const passedCodes = new Set();
    const bestScores = new Map();
    userSubs.forEach(s => {
      const code = s.problemCode;
      const score = s.score || 0;
      if (score > (bestScores.get(code) || 0)) {
        bestScores.set(code, score);
      }
      if (s.status === 'AC' || score >= 100) {
        passedCodes.add(code);
      }
    });

    const populated = topics.map(topic => {
      const exercises = (topic.problemCodes || []).map(code => {
        const prob = probMap.get(code);
        if (!prob) {
          return {
            code,
            title: `Bài tập [${code}]`,
            difficulty: 'Cơ bản',
            points: 100,
            isPassed: passedCodes.has(code),
            userScore: bestScores.get(code) || 0
          };
        }
        return {
          code: prob.code,
          title: prob.title,
          difficulty: prob.difficulty || 'Dễ',
          points: prob.points || 100,
          isPassed: passedCodes.has(prob.code),
          userScore: bestScores.get(prob.code) || 0
        };
      });

      const total = exercises.length;
      const completed = exercises.filter(e => e.isPassed).length;
      const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        ...topic,
        exercises,
        total,
        completed,
        progressPercent
      };
    });

    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/roadmap', requireHost, (req, res) => {
  try {
    const created = db.createRoadmapTopic(req.body);
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/roadmap/:id', requireHost, (req, res) => {
  try {
    const updated = db.updateRoadmapTopic(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Chủ đề không tồn tại' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/roadmap/:id', requireHost, (req, res) => {
  try {
    const success = db.deleteRoadmapTopic(req.params.id);
    if (!success) return res.status(404).json({ error: 'Chủ đề không tồn tại' });
    res.json({ message: 'Đã xóa chủ đề khỏi lộ trình' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── STUDENT CUSTOM CONTESTS & TEST GROUNDS ─────────────────────────────────
app.get('/api/student/custom-contests', (req, res) => {
  try {
    const list = db.getStudentCustomContests(req.user ? req.user.id : null);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/student/custom-contests', (req, res) => {
  try {
    const saved = db.saveStudentCustomContest(req.user.id, req.body);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/student/custom-contests/:id', (req, res) => {
  try {
    const success = db.deleteStudentCustomContest(req.params.id, req.user.id);
    if (!success) return res.status(404).json({ error: 'Không tìm thấy kỳ thi tự luyện' });
    res.json({ message: 'Đã xóa kỳ thi tự luyện' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/student/custom-contests/:id/run', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: 'Mã nguồn không được để trống' });
    }

    const contest = db.getStudentCustomContest(req.params.id);
    if (!contest) {
      return res.status(404).json({ error: 'Không tìm thấy kỳ thi tự luyện' });
    }

    const testCases = (contest.testCases || []).map((tc, idx) => ({
      id: tc.id || `tc-${idx}`,
      name: tc.name || `Test #${idx + 1}`,
      input: tc.input || '',
      expectedOutput: tc.expectedOutput || '',
      score: tc.score || Math.round(100 / Math.max(1, (contest.testCases || []).length))
    }));

    if (testCases.length === 0) {
      return res.status(400).json({ error: 'Vui lòng thêm ít nhất 1 test case để chạy thử' });
    }

    const dummyProblem = {
      id: contest.id,
      code: 'CUSTOM',
      title: contest.title,
      timeLimit: contest.timeLimit || 1000,
      memoryLimit: contest.memoryLimit || 256,
      points: 100,
      testCases
    };

    const dummySub = {
      id: `custom-run-${Date.now()}`,
      userId: req.user.id,
      code,
      language: 'cpp'
    };

    const result = await judge.gradeSubmission(dummySub, dummyProblem);

    // Save last result on contest
    db.saveStudentCustomContest(req.user.id, {
      ...contest,
      lastCode: code,
      lastRunResult: result
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── TOURNAMENT ARENA (SWISS STAGE 1V1 ARENA) ───────────────────────────────
app.get('/api/arena/profile', (req, res) => {
  try {
    const profile = arena.getUserArenaProfile(req.user.id);
    res.json(profile || { rating: 1200, wins: 0, losses: 0, draws: 0, winRate: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/arena/leaderboard', (req, res) => {
  try {
    const board = arena.getArenaLeaderboard();
    res.json(board);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/arena/active-match', (req, res) => {
  try {
    const matchId = arena.userMatchMap.get(req.user.id);
    if (!matchId) return res.json({ hasActiveMatch: false });
    const match = arena.activeMatches.get(matchId);
    if (!match || match.status !== 'RUNNING') return res.json({ hasActiveMatch: false });
    res.json({ hasActiveMatch: true, match: arena.sanitizeMatchForPlayer(match, req.user.id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── STATIC WEB APPLICATION SERVING (BROWSER & CROSS-PLATFORM) ─────────────
const distDir = path.join(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io') || req.path.startsWith('/uploads')) {
      return next();
    }
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

async function autoSeedAdmin() {
  const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'phatt123';
  try {
    const existing = await db.getUser(adminUsername);
    if (!existing) {
      console.log(`[UMTJudge AUTH] Tự động khởi tạo tài khoản Admin từ cấu hình: "${adminUsername}"`);
      const passwordHash = await hashPassword(adminPassword);
      if (typeof db.setupFirstAdmin === 'function' && db.isFirstRun && db.isFirstRun()) {
        db.setupFirstAdmin({
          username: adminUsername,
          passwordHash,
          fullName: 'Quản trị viên UMTJudge',
          serverName: 'UMTJudge Server',
          className: 'Lớp Tin Học'
        });
      } else if (typeof db.createUser === 'function') {
        db.createUser({
          username: adminUsername,
          passwordHash,
          fullName: 'Quản trị viên UMTJudge',
          role: 'host',
          isAdmin: true,
          classId: 'admin-class',
          classes: ['admin-class']
        });
      }
    } else {
      if (existing.role !== 'host' || !existing.isAdmin) {
        existing.role = 'host';
        existing.isAdmin = true;
        if (typeof db.updateUser === 'function') {
          db.updateUser(existing.id, { role: 'host', isAdmin: true });
        }
      }
    }
  } catch (err) {
    console.error('[UMTJudge AUTH] Lỗi khởi tạo admin:', err.message);
  }
}

// Start Server with graceful EADDRINUSE handling
function startServer(port = 4000) {
  if (server.listening) {
    console.log(`[SchoolJudge LAN Server] Already listening on port ${port}`);
    return;
  }

  if (server.listenerCount('error') === 0) {
    let retryCount = 0;
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        retryCount++;
        if (retryCount <= 2) {
          console.warn(`[SchoolJudge LAN Server] Port ${port} is in use (attempt ${retryCount}/2), retrying in 2 seconds...`);
          setTimeout(() => {
            try { server.close(); } catch(e) {}
            try { server.listen(port, '0.0.0.0'); } catch(e) {}
          }, 2000);
        } else {
          console.log(`[SchoolJudge LAN Server] Port ${port} is already active and serving on this machine.`);
        }
      } else {
        console.error('[SchoolJudge Server Error]', err);
      }
    });
  }

  try {
    server.listen(port, '0.0.0.0', () => {
      const settings = db.getSettings();
      console.log(`[UMTJudge Server] Running on http://0.0.0.0:${port}`);
      autoSeedAdmin().catch(console.error);

      // Tự động chuẩn hóa điểm các bài nộp cũ bị phồng/sai thang điểm bài
      if (typeof db.normalizeSubmissionScores === 'function') {
        try {
          db.normalizeSubmissionScores();
        } catch (e) {
          console.warn('[SchoolJudge] Lỗi chuẩn hóa điểm bài nộp ban đầu:', e.message);
        }
      }
    });
  } catch (err) {
    console.error('[SchoolJudge Server listen error]', err);
  }
}

function stopServer(callback) {
  try {
    lan.stopHostBeacon();
    duckdns.stopAutoUpdate();
  } catch (e) {}

  if (server && server.listening) {
    try {
      if (typeof server.closeAllConnections === 'function') {
        server.closeAllConnections();
      }
      server.close((err) => {
        if (callback) callback(err);
      });
    } catch (e) {
      if (callback) callback(e);
    }
  } else if (callback) {
    callback();
  }
}

module.exports = { app, server, startServer, stopServer, io };

if (require.main === module) {
  startServer(process.env.PORT || 4000);
}
