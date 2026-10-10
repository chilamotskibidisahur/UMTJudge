'use strict';

const { query } = require('../pool.cjs');
const { isStudentEligible } = require('./contests.cjs');

/**
 * Lấy bảng xếp hạng tổng quan toàn trường (Global Leaderboard)
 */
async function getLeaderboard() {
  const sql = `
    WITH best_problem_scores AS (
      SELECT 
        s.user_id,
        s.problem_id,
        MAX(s.score) AS max_score,
        BOOL_OR(s.status = 'AC') AS is_ac,
        MIN(s.execution_time) AS min_time
      FROM submissions s
      WHERE s.is_virtual = false
      GROUP BY s.user_id, s.problem_id
    ),
    user_stats AS (
      SELECT 
        u.id AS user_id,
        u.full_name,
        u.username,
        u.streak,
        COALESCE(SUM(bps.max_score), 0) AS total_score,
        COUNT(bps.problem_id) FILTER (WHERE bps.is_ac) AS solved_count,
        COALESCE(SUM(bps.min_time), 0) AS total_time,
        COALESCE(
          jsonb_object_agg(bps.problem_id, json_build_object('score', bps.max_score, 'status', CASE WHEN bps.is_ac THEN 'AC' ELSE 'WA' END))
          FILTER (WHERE bps.problem_id IS NOT NULL),
          '{}'::jsonb
        ) AS solved_problems
      FROM users u
      LEFT JOIN best_problem_scores bps ON bps.user_id = u.id
      WHERE u.role = 'user'
      GROUP BY u.id, u.full_name, u.username, u.streak
    )
    SELECT 
      user_id AS "userId",
      full_name AS "userName",
      username,
      total_score::NUMERIC(8, 2) AS "totalScore",
      solved_count::INT AS "solved",
      solved_count::INT AS "problemsSolved",
      total_time::INT AS "totalTime",
      streak,
      solved_problems AS "solvedProblems",
      ROW_NUMBER() OVER(ORDER BY total_score DESC, solved_count DESC, total_time ASC) AS rank
    FROM user_stats
    ORDER BY rank ASC
  `;
  const res = await query(sql);
  return res.rows.map(r => ({
    ...r,
    rank: Number(r.rank),
    totalScore: Number(r.totalScore),
    solved: Number(r.solved),
    problemsSolved: Number(r.problemsSolved),
    totalTime: Number(r.totalTime),
    streak: Number(r.streak),
    solvedProblems: r.solvedProblems || {},
    badges: []
  }));
}

/**
 * Lấy bảng xếp hạng của một kỳ thi cụ thể (Contest Leaderboard)
 */
async function getContestLeaderboard(contestId, isVirtual = false, options = {}) {
  // 1. Lấy thông tin contest và danh sách bài tập thuộc contest
  const contestRes = await query('SELECT * FROM contests WHERE id = $1', [contestId]);
  if (contestRes.rows.length === 0) return [];
  const contest = contestRes.rows[0];

  const probRes = await query(`
    SELECT cp.problem_id, cp.score_weight, p.code, p.title
    FROM contest_problems cp
    JOIN problems p ON p.id = cp.problem_id
    WHERE cp.contest_id = $1
    ORDER BY cp.order_index ASC
  `, [contestId]);
  const contestProblems = probRes.rows;

  // 2. Lấy danh sách học sinh tham gia hoặc đủ điều kiện
  const usersRes = await query(`
    SELECT DISTINCT u.id, u.full_name, u.username,
      COALESCE(array_agg(se.class_id) FILTER (WHERE se.class_id IS NOT NULL), ARRAY[]::VARCHAR[]) AS classes
    FROM users u
    LEFT JOIN student_enrollments se ON se.student_id = u.id
    WHERE u.role = 'user'
    GROUP BY u.id
  `);

  const eligibleUsers = [];
  for (const u of usersRes.rows) {
    if (isVirtual || await isStudentEligible(u, contest)) {
      eligibleUsers.push(u);
    }
  }
  const eligibleUserIds = new Set(eligibleUsers.map(u => u.id));

  // 3. Lấy tất cả submissions của contest này
  const subsSql = `
    SELECT 
      s.id, s.user_id, s.problem_id, s.status, s.score,
      s.execution_time, s.submitted_at
    FROM submissions s
    WHERE s.contest_id = $1 AND s.is_virtual = $2
    ORDER BY s.submitted_at ASC
  `;
  const subsRes = await query(subsSql, [contestId, isVirtual]);
  const submissions = subsRes.rows;

  // 4. Tính toán điểm theo scoringMode ('LIVE_BEST' hoặc 'OLYMPIC_LATEST')
  const scoringMode = contest.scoring_mode || 'LIVE_BEST';
  const userMap = {};

  for (const u of eligibleUsers) {
    userMap[u.id] = {
      userId: u.id,
      userName: u.full_name,
      username: u.username,
      classId: u.classes[0] || 'cls-1',
      classes: u.classes,
      totalScore: 0,
      problemsSolved: 0,
      totalSubmissions: 0,
      problemScores: {},
      solvedProblems: {},
      lastSubmissionTime: null
    };
  }

  for (const sub of submissions) {
    if (!isVirtual && !eligibleUserIds.has(sub.user_id)) continue;
    if (!userMap[sub.user_id]) continue;
    userMap[sub.user_id].totalSubmissions++;
    const pEntry = userMap[sub.user_id].problemScores[sub.problem_id];
    const score = Number(sub.score) || 0;
    const subTime = new Date(sub.submitted_at).getTime();

    if (scoringMode === 'OLYMPIC_LATEST') {
      const entryData = {
        score,
        status: sub.status,
        executionTime: Number(sub.execution_time),
        submittedAt: sub.submitted_at
      };
      userMap[sub.user_id].problemScores[sub.problem_id] = entryData;
      userMap[sub.user_id].solvedProblems[sub.problem_id] = entryData;
    } else {
      // Mặc định LIVE_BEST: Giữ điểm cao nhất
      if (!pEntry || score > pEntry.score) {
        const entryData = {
          score,
          status: sub.status,
          executionTime: Number(sub.execution_time),
          submittedAt: sub.submitted_at
        };
        userMap[sub.user_id].problemScores[sub.problem_id] = entryData;
        userMap[sub.user_id].solvedProblems[sub.problem_id] = entryData;
      }
    }

    if (!userMap[sub.user_id].lastSubmissionTime || subTime > userMap[sub.user_id].lastSubmissionTime) {
      userMap[sub.user_id].lastSubmissionTime = subTime;
    }
  }

  // 5. Tính tổng điểm, số bài giải được và xếp hạng
  const list = Object.values(userMap).map(u => {
    let sum = 0;
    let solved = 0;
    for (const pid of Object.keys(u.problemScores)) {
      const pScore = u.problemScores[pid].score || 0;
      sum += pScore;
      if (u.problemScores[pid].status === 'AC' || pScore > 0) {
        solved++;
      }
    }
    return {
      ...u,
      totalScore: Math.round(sum * 100) / 100,
      problemsSolved: solved,
      totalSubmissions: u.totalSubmissions || 0
    };
  });

  // Chỉ lấy những thí sinh có nộp bài hoặc có điểm
  const activeParticipants = list.filter(u => u.totalSubmissions > 0 || Object.keys(u.problemScores).length > 0);

  activeParticipants.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.problemsSolved !== a.problemsSolved) return b.problemsSolved - a.problemsSolved;
    return (a.lastSubmissionTime || 0) - (b.lastSubmissionTime || 0);
  });

  return activeParticipants.map((u, idx) => ({
    ...u,
    rank: idx + 1
  }));
}

module.exports = {
  getLeaderboard,
  getContestLeaderboard
};
