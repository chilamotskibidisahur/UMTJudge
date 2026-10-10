function sanitizeProblemForStudent(problem) {
  if (!problem) return null;
  const samples = Array.isArray(problem.samples) && problem.samples.length > 0
    ? problem.samples.map(sample => ({ ...sample }))
    : [];

  return {
    id: problem.id,
    code: problem.code,
    title: problem.title,
    difficulty: problem.difficulty,
    points: problem.points || 100,
    timeLimit: problem.timeLimit || 1000,
    memoryLimit: problem.memoryLimit || 256,
    category: problem.category,
    description: problem.description || '',
    inputDescription: problem.inputDescription || '',
    outputDescription: problem.outputDescription || '',
    constraints: problem.constraints || '',
    statement: problem.statement || '',
    statementHtml: problem.statementHtml || '',
    sampleCode: problem.sampleCode,
    pdfUrl: problem.pdfUrl,
    pdfFileName: problem.pdfFileName,
    testCount: problem.testCount ?? (Array.isArray(problem.testCases) ? problem.testCases.length : 0),
    ioMode: problem.ioMode || 'stdin',
    inputFile: problem.inputFile,
    outputFile: problem.outputFile,
    hasSolution: !!(problem.solution && problem.solution.trim()),
    solutionVisible: !!problem.solutionVisible,
    contestId: problem.contestId,
    contestTitle: problem.contestTitle,
    contestDocUrl: problem.contestDocUrl,
    contestDocFileName: problem.contestDocFileName,
    contestStatementHtml: problem.contestStatementHtml,
    contests: problem.contests || [],
    samples,
    testCases: []
  };
}

function sanitizeProblemForHost(problem) {
  if (!problem) return null;
  const safe = { ...problem };
  delete safe._pdfDiskPath;
  const rawTcs = Array.isArray(problem.testCases) ? problem.testCases : [];
  safe.testCount = problem.testCount !== undefined ? problem.testCount : rawTcs.length;
  safe.hasSolution = !!(problem.solution && problem.solution.trim());
  safe.solutionVisible = !!problem.solutionVisible;
  // Retain lightweight metadata (id, name, score, isSample, isTrap) for host UI
  // without sending large input/output contents over network
  safe.testCases = rawTcs.map((tc, idx) => ({
    id: tc.id || `tc-${idx + 1}`,
    name: tc.name || `test${String(idx + 1).padStart(2, '0')}`,
    score: tc.score !== undefined ? tc.score : (tc.points !== undefined ? tc.points : 10),
    isSample: !!tc.isSample,
    isTrap: !!tc.isTrap
  }));
  return safe;
}

function sanitizeContestForStudent(contest, problems) {
  if (!contest) return null;
  const safe = { ...contest };
  delete safe.pinCode;
  delete safe.candidateIds;
  delete safe._pdfDiskPath;
  safe.requiresPin = !!contest.pinCode;
  if (problems !== undefined) safe.problems = (problems || []).map(sanitizeProblemForStudent);
  else if (Array.isArray(safe.problems)) safe.problems = safe.problems.map(sanitizeProblemForStudent);
  return safe;
}

function sanitizeContestForHost(contest, problems) {
  if (!contest) return null;
  const safe = { ...contest };
  delete safe._pdfDiskPath;
  if (problems !== undefined) safe.problems = (problems || []).map(sanitizeProblemForHost);
  else if (Array.isArray(safe.problems)) safe.problems = safe.problems.map(sanitizeProblemForHost);
  return safe;
}

function canStudentViewSubmissionDetails(submission, db) {
  if (!submission) return false;
  // Bài nộp tự do ngoài kỳ thi -> cho phép xem chi tiết
  if (!submission.contestId) return true;
  // Bài nộp trong kỳ thi -> kiểm tra xem kỳ thi đã kết thúc chưa
  if (db && typeof db.getContest === 'function') {
    const contest = db.getContest(submission.contestId);
    if (!contest) return true;
    if (contest.status === 'ended') return true;
    if (contest.endTime && Date.now() > new Date(contest.endTime).getTime()) return true;
  }
  // Phiên thi ảo (virtual) -> kiểm tra phiên thi ảo đã kết thúc chưa
  if (submission.isVirtual && submission.virtualSessionId && db && typeof db.getVirtualSession === 'function') {
    const vs = db.getVirtualSession(submission.virtualSessionId);
    if (vs && (vs.status === 'completed' || vs.status === 'timeout' || (vs.endTime && Date.now() > new Date(vs.endTime).getTime()))) {
      return true;
    }
  }
  return false;
}

function sanitizeSubmissionForStudent(submission, options = {}) {
  if (!submission) return null;
  const allowDetails = !!options.allowDetails;

  return {
    id: submission.id,
    userId: submission.userId,
    userName: submission.userName,
    className: submission.className,
    problemId: submission.problemId,
    problemCode: submission.problemCode,
    code: submission.code,
    status: submission.status,
    score: submission.score,
    passedTests: submission.passedTests,
    totalTests: submission.totalTests,
    executionTime: submission.executionTime,
    memoryUsed: submission.memoryUsed,
    submittedAt: submission.submittedAt,
    compileError: submission.compileError,
    contestId: submission.contestId,
    contestTitle: submission.contestTitle || '',
    isVirtual: !!submission.isVirtual,
    participationType: submission.participationType,
    virtualSessionId: submission.virtualSessionId,
    canViewDetails: allowDetails,
    details: (submission.details || []).map(detail => ({
      testIndex: detail.testIndex,
      name: detail.name,
      status: detail.status,
      time: detail.time,
      memory: detail.memory,
      scoreEarned: detail.scoreEarned,
      message: detail.message,
      // Sau khi thi xong, cung cấp chi tiết input/output/expectedOutput/diff cho học sinh:
      input: allowDetails ? (detail.input || '') : undefined,
      userOutput: allowDetails ? (detail.userOutput || '') : undefined,
      expectedOutput: allowDetails ? (detail.expectedOutput || '') : undefined,
      diff: allowDetails ? (detail.diff || null) : undefined,
      diffTruncated: allowDetails ? (detail.diffTruncated || false) : undefined
    }))
  };
}

module.exports = {
  canStudentViewSubmissionDetails,
  sanitizeContestForHost,
  sanitizeContestForStudent,
  sanitizeProblemForHost,
  sanitizeProblemForStudent,
  sanitizeSubmissionForStudent
};
