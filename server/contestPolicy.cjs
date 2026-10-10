const crypto = require('crypto');

class ContestPolicyError extends Error {
  constructor(code, message, status = 403) {
    super(message);
    this.name = 'ContestPolicyError';
    this.code = code;
    this.status = status;
  }
}

function pinsMatch(expected, supplied) {
  const left = Buffer.from(String(expected || ''), 'utf8');
  const right = Buffer.from(String(supplied || ''), 'utf8');
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function assertIdentityEligible(contest, user) {
  if (!contest) throw new ContestPolicyError('CONTEST_NOT_FOUND', 'Kỳ thi không tồn tại.', 404);
  if (!user) throw new ContestPolicyError('STUDENT_REQUIRED', 'Vui lòng đăng nhập.');
  if (user.role === 'host' || user.role === 'admin') {
    return;
  }
  if (user.role !== 'user') throw new ContestPolicyError('STUDENT_REQUIRED', 'Chỉ tài khoản học sinh được tham gia kỳ thi.');
  if (user.isLocked) throw new ContestPolicyError('ACCOUNT_LOCKED', 'Tài khoản đang bị khóa.');

  const scopeType = String(contest.scopeType || 'ALL').toUpperCase();

  // 1. Chỉ định theo danh sách thí sinh cụ thể
  const targetStudents = (Array.isArray(contest.targetStudents) && contest.targetStudents.length > 0)
    ? contest.targetStudents
    : (Array.isArray(contest.candidateIds) ? contest.candidateIds : []);
  if (scopeType === 'STUDENT' || (scopeType !== 'GRADE' && scopeType !== 'CLASS' && targetStudents.length > 0)) {
    if (targetStudents.length > 0 && !targetStudents.includes(user.id)) {
      throw new ContestPolicyError('NOT_A_CANDIDATE', 'Bạn không có tên trong danh sách thí sinh được tham gia kỳ thi này.');
    }
    if (scopeType === 'STUDENT') return;
  }

  // 2. Chỉ định theo lớp học cụ thể (vd: 11C7)
  const targetClasses = (Array.isArray(contest.targetClasses) && contest.targetClasses.length > 0)
    ? contest.targetClasses
    : (Array.isArray(contest.classIds) ? contest.classIds : []);
  if (scopeType === 'CLASS' || (scopeType === 'ALL' && targetClasses.length > 0)) {
    if (targetClasses.length > 0) {
      const userClasses = Array.isArray(user.classes) && user.classes.length > 0
        ? user.classes
        : (user.classId ? [user.classId] : []);
      
      const hasMatchingClass = userClasses.some(clsIdentifier => {
        const strId = String(clsIdentifier || '').trim().toLowerCase();
        return targetClasses.some(tc => {
          const strTc = String(tc || '').trim().toLowerCase();
          return strId === strTc;
        });
      });

      if (!hasMatchingClass) {
        throw new ContestPolicyError('CLASS_NOT_ELIGIBLE', 'Kỳ thi này chỉ dành cho lớp được chỉ định. Lớp của bạn không thuộc danh sách được tham gia.');
      }
    }
    if (scopeType === 'CLASS') return;
  }

  // 3. Chỉ định theo khối (vd: Khối 11)
  const targetGrades = Array.isArray(contest.targetGrades) ? contest.targetGrades.map(Number).filter(n => !isNaN(n)) : [];
  if (scopeType === 'GRADE' && targetGrades.length > 0) {
    const userClasses = Array.isArray(user.classes) && user.classes.length > 0
      ? user.classes
      : (user.classId ? [user.classId] : []);
    
    const userGrades = userClasses.map(cls => {
      const match = String(cls).match(/\d+/);
      return match ? parseInt(match[0], 10) : NaN;
    }).filter(n => !isNaN(n));

    const matchesGrade = userGrades.some(g => targetGrades.includes(g));
    if (!matchesGrade && userGrades.length > 0) {
      throw new ContestPolicyError('GRADE_NOT_ELIGIBLE', 'Kỳ thi này chỉ dành cho khối được chỉ định. Bạn không thuộc khối này.');
    }
  }
}

function effectiveEndTime(contest, attendance, now = Date.now()) {
  const extraMinutes = Math.max(0, Number(attendance?.extraMinutes) || 0);
  const durationMinutes = Number(contest?.durationMinutes) || 0;
  const contestEnd = contest?.endTime ? new Date(contest.endTime).getTime() : NaN;
  const contestStart = contest?.startTime ? new Date(contest.startTime).getTime() : NaN;

  if (durationMinutes > 0) {
    let studentJoinedTime = attendance?.joinedAt ? new Date(attendance.joinedAt).getTime() : 0;
    // Nếu kỳ thi có mốc startTime mới hơn mốc joinedAt cũ của học sinh (giáo viên mở lại/bắt đầu lại ca thi)
    // thì mốc joinedAt cũ không còn hiệu lực, tính thời gian theo phiên mới.
    if (Number.isFinite(contestStart) && studentJoinedTime > 0 && studentJoinedTime < contestStart) {
      studentJoinedTime = 0;
    }

    const studentStartTime = studentJoinedTime > 0 
      ? studentJoinedTime 
      : (Number.isFinite(contestStart) && now < contestStart ? contestStart : now);

    const studentLimit = studentStartTime + (durationMinutes + extraMinutes) * 60 * 1000;
    if (Number.isFinite(contestEnd) && contest?.manualEndOnly !== true) {
      return Math.min(contestEnd + extraMinutes * 60 * 1000, studentLimit);
    }
    return studentLimit;
  }

  if (Number.isFinite(contestEnd)) {
    return contestEnd + extraMinutes * 60 * 1000;
  }
  return now + (extraMinutes > 0 ? extraMinutes * 60 * 1000 : 3600 * 1000);
}

function assertTimingAllowed(contest, attendance, now) {
  const start = new Date(contest.startTime).getTime();
  const end = effectiveEndTime(contest, attendance, now);
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    throw new ContestPolicyError('INVALID_CONTEST_TIME', 'Thời gian kỳ thi không hợp lệ.', 500);
  }
  const CLOCK_TOLERANCE_MS = 30 * 1000;
  if (Number.isFinite(start) && (now + CLOCK_TOLERANCE_MS) < start) {
    throw new ContestPolicyError('CONTEST_NOT_STARTED', 'Kỳ thi chưa bắt đầu.');
  }
  if (contest.status === 'upcoming' && (!Number.isFinite(start) || (now + CLOCK_TOLERANCE_MS) < start)) {
    throw new ContestPolicyError('CONTEST_NOT_STARTED', 'Kỳ thi chưa bắt đầu.');
  }
  const manuallyReopened = !!attendance?.reopened;
  const isTimeExpired = contest.manualEndOnly !== true && now > end;
  const isStudentExpired = !!attendance?.joinedAt && now > end;
  if (((isTimeExpired || isStudentExpired) || contest.status === 'ended') && !manuallyReopened) {
    throw new ContestPolicyError('CONTEST_ENDED', 'Kỳ thi đã kết thúc hoặc hết giờ làm bài.');
  }
  if (attendance?.status === 'suspended') {
    throw new ContestPolicyError('PARTICIPATION_SUSPENDED', 'Lượt thi đã bị đình chỉ.');
  }
}

function assertJoinAllowed({ contest, user, suppliedPin = '', attendance = null, now = Date.now() }) {
  assertIdentityEligible(contest, user);
  if (user?.role !== 'host' && user?.role !== 'admin') {
    assertTimingAllowed(contest, attendance, now);
    if (contest.pinCode && !pinsMatch(contest.pinCode, suppliedPin)) {
      throw new ContestPolicyError('INVALID_CONTEST_PIN', 'Mã PIN kỳ thi không đúng.');
    }
  }
  return { effectiveEndTime: effectiveEndTime(contest, attendance, now) };
}

function assertSubmissionAllowed({ contest, user, attendance = null, now = Date.now(), joined, problemId }) {
  assertIdentityEligible(contest, user);
  if (!joined && user?.role !== 'host' && user?.role !== 'admin') {
    throw new ContestPolicyError('CONTEST_JOIN_REQUIRED', 'Bạn phải vào phòng thi trước khi nộp bài.');
  }
  if (user?.role !== 'host' && user?.role !== 'admin') {
    assertTimingAllowed(contest, attendance, now);
  }
  if (!Array.isArray(contest.problemIds) || !contest.problemIds.includes(problemId)) {
    throw new ContestPolicyError('PROBLEM_NOT_IN_CONTEST', 'Bài tập không thuộc kỳ thi này.');
  }
  return { effectiveEndTime: effectiveEndTime(contest, attendance, now) };
}

module.exports = {
  ContestPolicyError,
  assertIdentityEligible,
  assertJoinAllowed,
  assertSubmissionAllowed,
  effectiveEndTime,
  pinsMatch
};
