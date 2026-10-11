'use strict';

const crypto = require('crypto');
const { query, transaction } = require('../pool.cjs');
const { ROADMAP_STAGES, ROADMAP_LESSONS, ALGORITHM_ROADMAP_TOPICS } = require('../../roadmapData.cjs');

function newId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function mapStageRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    track: row.track || 'olympic',
    title: row.title,
    monthRange: row.month_range || '',
    goal: row.goal || '',
    skillGained: row.skill_gained || '',
    estimatedHoursPerWeek: Number(row.estimated_hours_per_week) || 8,
    checkpoint: typeof row.checkpoint === 'string' ? JSON.parse(row.checkpoint) : (row.checkpoint || { problemIds: [], passScore: 70 }),
    icon: row.icon || 'Compass',
    color: row.color || 'blue',
    order: Number(row.sort_order) || 0
  };
}

function mapLessonRow(row) {
  if (!row) return null;
  const prerequisiteLessonIds = typeof row.prerequisite_lesson_ids === 'string'
    ? JSON.parse(row.prerequisite_lesson_ids)
    : (Array.isArray(row.prerequisite_lesson_ids) ? row.prerequisite_lesson_ids : []);

  const hints = typeof row.hints === 'string'
    ? JSON.parse(row.hints)
    : (Array.isArray(row.hints) ? row.hints : []);

  let problemCodes = typeof row.problem_codes === 'string'
    ? JSON.parse(row.problem_codes)
    : (Array.isArray(row.problem_codes) ? row.problem_codes : []);

  if (problemCodes.length === 0 && row.problem_code) {
    problemCodes = [row.problem_code];
  }

  return {
    id: row.id,
    stageId: row.stage_id,
    track: row.track || 'olympic',
    title: row.title,
    summary: row.summary || '',
    shortTheory: row.short_theory || '',
    contentMarkdown: row.content_markdown || '',
    estimatedMinutes: Number(row.duration_minutes) || 30,
    difficulty: Number(row.difficulty) || 1,
    order: Number(row.sort_order) || 0,
    prerequisiteLessonIds,
    hints,
    problemCode: problemCodes[0] || row.problem_code || null,
    problemCodes,
    problemId: row.problem_id || null
  };
}

function mapTopicRow(row) {
  if (!row) return null;
  const problemCodes = typeof row.problem_ids === 'string'
    ? JSON.parse(row.problem_ids)
    : (Array.isArray(row.problem_ids) ? row.problem_ids : []);

  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    level: row.difficulty || 'Cơ bản',
    color: row.color || '#3b82f6',
    problemCodes,
    order: Number(row.sort_order) || 0,
    createdAt: row.created_at
  };
}

/**
 * Lấy danh sách các chặng lộ trình
 */
async function getRoadmapStages(track = null) {
  try {
    let sql = `
      SELECT id, track, title, month_range, goal, skill_gained, estimated_hours_per_week, checkpoint, icon, color, sort_order
      FROM roadmap_stages
    `;
    const params = [];
    if (track && track !== 'all') {
      sql += ` WHERE track = $1 OR track = 'all'`;
      params.push(track);
    }
    sql += ` ORDER BY sort_order ASC`;

    const res = await query(sql, params);
    if (!res || res.rows.length === 0) {
      let list = ROADMAP_STAGES;
      if (track && track !== 'all') {
        list = list.filter(s => !s.track || s.track === 'all' || s.track === track);
      }
      return list;
    }
    return res.rows.map(mapStageRow);
  } catch (err) {
    console.warn('[repos/roadmap] getRoadmapStages fallback to seed data:', err.message);
    let list = ROADMAP_STAGES;
    if (track && track !== 'all') {
      list = list.filter(s => !s.track || s.track === 'all' || s.track === track);
    }
    return list;
  }
}

/**
 * Lấy chi tiết 1 chặng theo id
 */
async function getRoadmapStage(id) {
  try {
    const sql = `
      SELECT id, track, title, month_range, goal, skill_gained, estimated_hours_per_week, checkpoint, icon, color, sort_order
      FROM roadmap_stages
      WHERE id = $1
    `;
    const res = await query(sql, [id]);
    if (res && res.rows.length > 0) {
      return mapStageRow(res.rows[0]);
    }
    return ROADMAP_STAGES.find(s => s.id === id) || null;
  } catch (err) {
    return ROADMAP_STAGES.find(s => s.id === id) || null;
  }
}

/**
 * Thêm mới hoặc cập nhật một chặng
 */
async function saveRoadmapStage(stageData) {
  const id = stageData.id || newId('stage');
  const track = stageData.track || 'olympic';
  const title = stageData.title || '';
  const monthRange = stageData.monthRange || stageData.month_range || '';
  const goal = stageData.goal || '';
  const skillGained = stageData.skillGained || stageData.skill_gained || '';
  const estimatedHours = Number(stageData.estimatedHoursPerWeek || stageData.estimated_hours_per_week) || 8;
  const checkpoint = JSON.stringify(stageData.checkpoint || { problemIds: [], passScore: 70 });
  const icon = stageData.icon || 'Compass';
  const color = stageData.color || 'blue';
  const sortOrder = stageData.order != null ? Number(stageData.order) : (Number(stageData.sort_order) || 0);

  const sql = `
    INSERT INTO roadmap_stages (id, track, title, month_range, goal, skill_gained, estimated_hours_per_week, checkpoint, icon, color, sort_order)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT (id) DO UPDATE SET
      track = EXCLUDED.track,
      title = EXCLUDED.title,
      month_range = EXCLUDED.month_range,
      goal = EXCLUDED.goal,
      skill_gained = EXCLUDED.skill_gained,
      estimated_hours_per_week = EXCLUDED.estimated_hours_per_week,
      checkpoint = EXCLUDED.checkpoint,
      icon = EXCLUDED.icon,
      color = EXCLUDED.color,
      sort_order = EXCLUDED.sort_order
    RETURNING id, track, title, month_range, goal, skill_gained, estimated_hours_per_week, checkpoint, icon, color, sort_order
  `;

  const res = await query(sql, [id, track, title, monthRange, goal, skillGained, estimatedHours, checkpoint, icon, color, sortOrder]);
  return mapStageRow(res.rows[0]);
}

/**
 * Xóa một chặng
 */
async function deleteRoadmapStage(id) {
  const sql = `DELETE FROM roadmap_stages WHERE id = $1`;
  const res = await query(sql, [id]);
  return (res.rowCount || 0) > 0;
}

/**
 * Lấy danh sách các bài học
 */
async function getRoadmapLessons(stageId = null, track = null) {
  try {
    let sql = `
      SELECT id, stage_id, track, title, summary, short_theory, content_markdown, duration_minutes, difficulty, sort_order,
             prerequisite_lesson_ids, hints, problem_code, problem_codes, problem_id
      FROM roadmap_lessons
    `;
    const params = [];
    const wheres = [];

    if (stageId) {
      params.push(stageId);
      wheres.push(`stage_id = $${params.length}`);
    }
    if (track && track !== 'all') {
      params.push(track);
      wheres.push(`(track = $${params.length} OR track = 'all')`);
    }

    if (wheres.length > 0) {
      sql += ` WHERE ` + wheres.join(' AND ');
    }
    sql += ` ORDER BY sort_order ASC`;

    const res = await query(sql, params);
    if (!res || res.rows.length === 0) {
      let list = ROADMAP_LESSONS;
      if (stageId) list = list.filter(l => l.stageId === stageId);
      if (track && track !== 'all') list = list.filter(l => !l.track || l.track === 'all' || l.track === track);
      return list;
    }
    return res.rows.map(mapLessonRow);
  } catch (err) {
    console.warn('[repos/roadmap] getRoadmapLessons fallback to seed data:', err.message);
    let list = ROADMAP_LESSONS;
    if (stageId) list = list.filter(l => l.stageId === stageId);
    if (track && track !== 'all') list = list.filter(l => !l.track || l.track === 'all' || l.track === track);
    return list;
  }
}

/**
 * Lấy 1 bài học theo id
 */
async function getRoadmapLesson(id) {
  try {
    const sql = `
      SELECT id, stage_id, track, title, summary, short_theory, content_markdown, duration_minutes, difficulty, sort_order,
             prerequisite_lesson_ids, hints, problem_code, problem_codes, problem_id
      FROM roadmap_lessons
      WHERE id = $1
    `;
    const res = await query(sql, [id]);
    if (res && res.rows.length > 0) {
      return mapLessonRow(res.rows[0]);
    }
    return ROADMAP_LESSONS.find(l => l.id === id) || null;
  } catch (err) {
    return ROADMAP_LESSONS.find(l => l.id === id) || null;
  }
}

/**
 * Thêm mới hoặc cập nhật 1 bài học
 */
async function saveRoadmapLesson(lessonData) {
  const id = lessonData.id || newId('les');
  const stageId = lessonData.stageId || lessonData.stage_id;
  const track = lessonData.track || 'olympic';
  const title = lessonData.title || '';
  const summary = lessonData.summary || '';
  const shortTheory = lessonData.shortTheory || lessonData.short_theory || '';
  const contentMarkdown = lessonData.contentMarkdown || lessonData.content_markdown || '';
  const durationMinutes = Number(lessonData.estimatedMinutes || lessonData.duration_minutes || lessonData.durationMinutes) || 30;
  const difficulty = Number(lessonData.difficulty) || 1;
  const sortOrder = lessonData.order != null ? Number(lessonData.order) : (Number(lessonData.sort_order) || 0);
  const prereqs = JSON.stringify(lessonData.prerequisiteLessonIds || lessonData.prerequisite_lesson_ids || []);
  const hints = JSON.stringify(lessonData.hints || []);

  const probCodesArray = Array.isArray(lessonData.problemCodes)
    ? lessonData.problemCodes.filter(Boolean)
    : (lessonData.problemCode ? [lessonData.problemCode] : []);
  const problemCodes = JSON.stringify(probCodesArray);
  const problemCode = probCodesArray[0] || lessonData.problemCode || null;
  const problemId = lessonData.problemId || null;

  const sql = `
    INSERT INTO roadmap_lessons (id, stage_id, track, title, summary, short_theory, content_markdown, duration_minutes, difficulty, sort_order, prerequisite_lesson_ids, hints, problem_code, problem_codes, problem_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    ON CONFLICT (id) DO UPDATE SET
      stage_id = EXCLUDED.stage_id,
      track = EXCLUDED.track,
      title = EXCLUDED.title,
      summary = EXCLUDED.summary,
      short_theory = EXCLUDED.short_theory,
      content_markdown = EXCLUDED.content_markdown,
      duration_minutes = EXCLUDED.duration_minutes,
      difficulty = EXCLUDED.difficulty,
      sort_order = EXCLUDED.sort_order,
      prerequisite_lesson_ids = EXCLUDED.prerequisite_lesson_ids,
      hints = EXCLUDED.hints,
      problem_code = EXCLUDED.problem_code,
      problem_codes = EXCLUDED.problem_codes,
      problem_id = EXCLUDED.problem_id
    RETURNING id, stage_id, track, title, summary, short_theory, content_markdown, duration_minutes, difficulty, sort_order,
              prerequisite_lesson_ids, hints, problem_code, problem_codes, problem_id
  `;

  const res = await query(sql, [
    id, stageId, track, title, summary, shortTheory, contentMarkdown,
    durationMinutes, difficulty, sortOrder, prereqs, hints,
    problemCode, problemCodes, problemId
  ]);
  return mapLessonRow(res.rows[0]);
}

/**
 * Xóa 1 bài học
 */
async function deleteRoadmapLesson(id) {
  const sql = `DELETE FROM roadmap_lessons WHERE id = $1`;
  const res = await query(sql, [id]);
  return (res.rowCount || 0) > 0;
}

/**
 * Đính kèm một bài tập vào bài học
 */
async function attachProblemToLesson(lessonId, problemCodeOrId, problemId = null) {
  const lesson = await getRoadmapLesson(lessonId);
  if (!lesson) return null;

  const codes = Array.isArray(lesson.problemCodes) ? [...lesson.problemCodes] : [];
  if (!codes.includes(problemCodeOrId)) {
    codes.push(problemCodeOrId);
  }
  lesson.problemCodes = codes;
  lesson.problemCode = codes[0];
  if (problemId) lesson.problemId = problemId;

  return saveRoadmapLesson(lesson);
}

/**
 * Gỡ bỏ một bài tập khỏi bài học
 */
async function detachProblemFromLesson(lessonId, problemCodeOrId = null) {
  const lesson = await getRoadmapLesson(lessonId);
  if (!lesson) return null;

  if (problemCodeOrId) {
    lesson.problemCodes = (lesson.problemCodes || []).filter(c => c !== problemCodeOrId);
  } else {
    lesson.problemCodes = [];
  }
  lesson.problemCode = lesson.problemCodes[0] || null;

  return saveRoadmapLesson(lesson);
}

/**
 * Đánh dấu hoàn thành bài học
 */
async function markLessonDone(userId, lessonId) {
  if (!userId || !lessonId) return false;
  const sql = `
    INSERT INTO roadmap_user_progress (user_id, lesson_id, status, score, completed_at)
    VALUES ($1, $2, 'completed', 100, NOW())
    ON CONFLICT (user_id, lesson_id) DO UPDATE SET
      status = 'completed',
      score = 100,
      completed_at = NOW()
  `;
  await query(sql, [userId, lessonId]);
  return true;
}

/**
 * Đánh dấu vượt chặng (test-out)
 */
async function testOutStage(userId, stageId) {
  if (!userId || !stageId) return false;
  const sql = `
    INSERT INTO roadmap_stage_progress (user_id, stage_id, status, score, completed_at)
    VALUES ($1, $2, 'tested_out', 100, NOW())
    ON CONFLICT (user_id, stage_id) DO UPDATE SET
      status = 'tested_out',
      score = 100,
      completed_at = NOW()
  `;
  await query(sql, [userId, stageId]);
  return true;
}

/**
 * Lấy toàn bộ tiến độ của học sinh
 */
async function getUserProgress(userId) {
  if (!userId) return { completedLessonIds: [], testedOutStageIds: [] };

  const [lessonRes, stageRes] = await Promise.all([
    query('SELECT lesson_id FROM roadmap_user_progress WHERE user_id = $1', [userId]).catch(() => ({ rows: [] })),
    query('SELECT stage_id FROM roadmap_stage_progress WHERE user_id = $1', [userId]).catch(() => ({ rows: [] }))
  ]);

  return {
    completedLessonIds: lessonRes.rows.map(r => r.lesson_id),
    testedOutStageIds: stageRes.rows.map(r => r.stage_id)
  };
}

/**
 * Khôi phục lộ trình về mặc định
 */
async function resetRoadmapToDefault() {
  await transaction(async (client) => {
    await client.query('DELETE FROM roadmap_lessons');
    await client.query('DELETE FROM roadmap_stages');

    for (const s of ROADMAP_STAGES) {
      await client.query(`
        INSERT INTO roadmap_stages (id, track, title, month_range, goal, skill_gained, estimated_hours_per_week, checkpoint, icon, color, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        s.id, s.track || 'olympic', s.title, s.monthRange || '', s.goal || '',
        s.skillGained || '', s.estimatedHoursPerWeek || 8, JSON.stringify(s.checkpoint || {}),
        s.icon || 'Compass', s.color || 'blue', s.order != null ? s.order : 0
      ]);
    }

    for (const l of ROADMAP_LESSONS) {
      const probCodes = Array.isArray(l.problemCodes) && l.problemCodes.length > 0
        ? l.problemCodes
        : (l.problemCode ? [l.problemCode] : []);

      await client.query(`
        INSERT INTO roadmap_lessons (id, stage_id, track, title, summary, short_theory, content_markdown, duration_minutes, difficulty, sort_order, prerequisite_lesson_ids, hints, problem_code, problem_codes, problem_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        l.id, l.stageId, l.track || 'olympic', l.title, l.summary || '',
        l.shortTheory || '', l.contentMarkdown || '', l.estimatedMinutes || 30,
        l.difficulty || 1, l.order != null ? l.order : 0,
        JSON.stringify(l.prerequisiteLessonIds || []),
        JSON.stringify(l.hints || []),
        probCodes[0] || l.problemCode || null,
        JSON.stringify(probCodes),
        l.problemId || null
      ]);
    }
  });

  return { stages: ROADMAP_STAGES, lessons: ROADMAP_LESSONS };
}

/**
 * Lấy danh sách Topics (Chủ đề tự do)
 */
async function getRoadmapTopics() {
  try {
    const sql = `
      SELECT id, title, description, difficulty, color, problem_ids, sort_order, created_at
      FROM roadmap_topics
      ORDER BY sort_order ASC
    `;
    const res = await query(sql);
    if (!res || res.rows.length === 0) {
      return ALGORITHM_ROADMAP_TOPICS;
    }
    return res.rows.map(mapTopicRow);
  } catch (err) {
    return ALGORITHM_ROADMAP_TOPICS;
  }
}

async function getRoadmapTopic(id) {
  try {
    const sql = `
      SELECT id, title, description, difficulty, color, problem_ids, sort_order, created_at
      FROM roadmap_topics
      WHERE id = $1
    `;
    const res = await query(sql, [id]);
    if (res && res.rows.length > 0) return mapTopicRow(res.rows[0]);
    return ALGORITHM_ROADMAP_TOPICS.find(t => t.id === id) || null;
  } catch (err) {
    return ALGORITHM_ROADMAP_TOPICS.find(t => t.id === id) || null;
  }
}

async function createRoadmapTopic(topic) {
  const id = topic.id || newId('topic');
  const title = topic.title || 'Chủ đề mới';
  const description = topic.description || '';
  const difficulty = topic.level || topic.difficulty || 'Cơ bản';
  const color = topic.color || '#3b82f6';
  const problemIds = JSON.stringify(Array.isArray(topic.problemCodes) ? topic.problemCodes : (topic.problemIds || []));
  const sortOrder = topic.order != null ? Number(topic.order) : 0;

  const sql = `
    INSERT INTO roadmap_topics (id, title, description, difficulty, color, problem_ids, sort_order)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, title, description, difficulty, color, problem_ids, sort_order, created_at
  `;
  const res = await query(sql, [id, title, description, difficulty, color, problemIds, sortOrder]);
  return mapTopicRow(res.rows[0]);
}

async function updateRoadmapTopic(id, updates) {
  const existing = await getRoadmapTopic(id);
  if (!existing) return null;

  const title = updates.title !== undefined ? updates.title : existing.title;
  const description = updates.description !== undefined ? updates.description : existing.description;
  const difficulty = updates.level !== undefined ? updates.level : (updates.difficulty !== undefined ? updates.difficulty : existing.level);
  const color = updates.color !== undefined ? updates.color : existing.color;
  const problemIds = JSON.stringify(Array.isArray(updates.problemCodes) ? updates.problemCodes : (updates.problemIds || existing.problemCodes || []));
  const sortOrder = updates.order !== undefined ? Number(updates.order) : existing.order;

  const sql = `
    UPDATE roadmap_topics
    SET title = $2, description = $3, difficulty = $4, color = $5, problem_ids = $6, sort_order = $7
    WHERE id = $1
    RETURNING id, title, description, difficulty, color, problem_ids, sort_order, created_at
  `;
  const res = await query(sql, [id, title, description, difficulty, color, problemIds, sortOrder]);
  return mapTopicRow(res.rows[0]);
}

async function deleteRoadmapTopic(id) {
  const sql = `DELETE FROM roadmap_topics WHERE id = $1`;
  const res = await query(sql, [id]);
  return (res.rowCount || 0) > 0;
}

/**
 * Student Custom Contests
 */
async function getStudentCustomContests(userId) {
  try {
    let sql = `
      SELECT id, user_id AS "userId", title, description, time_limit AS "timeLimit", memory_limit AS "memoryLimit",
             test_cases AS "testCases", created_at AS "createdAt", updated_at AS "updatedAt"
      FROM student_custom_contests
    `;
    const params = [];
    if (userId) {
      sql += ` WHERE user_id = $1`;
      params.push(userId);
    }
    sql += ` ORDER BY created_at DESC`;
    const res = await query(sql, params);
    return res.rows.map(r => ({
      ...r,
      testCases: typeof r.testCases === 'string' ? JSON.parse(r.testCases) : (r.testCases || [])
    }));
  } catch (err) {
    return [];
  }
}

async function getStudentCustomContest(id) {
  try {
    const sql = `
      SELECT id, user_id AS "userId", title, description, time_limit AS "timeLimit", memory_limit AS "memoryLimit",
             test_cases AS "testCases", created_at AS "createdAt", updated_at AS "updatedAt"
      FROM student_custom_contests
      WHERE id = $1
    `;
    const res = await query(sql, [id]);
    if (!res || res.rows.length === 0) return null;
    const r = res.rows[0];
    return {
      ...r,
      testCases: typeof r.testCases === 'string' ? JSON.parse(r.testCases) : (r.testCases || [])
    };
  } catch (err) {
    return null;
  }
}

async function saveStudentCustomContest(userId, contestData) {
  const id = contestData.id || newId('custom-contest');
  const title = contestData.title || 'Đề thi tự luyện';
  const description = contestData.description || '';
  const timeLimit = Number(contestData.timeLimit) || 1000;
  const memoryLimit = Number(contestData.memoryLimit) || 256;
  const testCases = JSON.stringify(Array.isArray(contestData.testCases) ? contestData.testCases : []);

  const sql = `
    INSERT INTO student_custom_contests (id, user_id, title, description, time_limit, memory_limit, test_cases, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      time_limit = EXCLUDED.time_limit,
      memory_limit = EXCLUDED.memory_limit,
      test_cases = EXCLUDED.test_cases,
      updated_at = NOW()
    RETURNING id, user_id AS "userId", title, description, time_limit AS "timeLimit", memory_limit AS "memoryLimit",
              test_cases AS "testCases", created_at AS "createdAt", updated_at AS "updatedAt"
  `;
  const res = await query(sql, [id, userId, title, description, timeLimit, memoryLimit, testCases]);
  const r = res.rows[0];
  return {
    ...r,
    testCases: typeof r.testCases === 'string' ? JSON.parse(r.testCases) : (r.testCases || [])
  };
}

async function deleteStudentCustomContest(id, userId) {
  let sql = `DELETE FROM student_custom_contests WHERE id = $1`;
  const params = [id];
  if (userId) {
    sql += ` AND user_id = $2`;
    params.push(userId);
  }
  const res = await query(sql, params);
  return (res.rowCount || 0) > 0;
}

module.exports = {
  getRoadmapStages,
  getRoadmapStage,
  saveRoadmapStage,
  deleteRoadmapStage,
  getRoadmapLessons,
  getRoadmapLesson,
  saveRoadmapLesson,
  deleteRoadmapLesson,
  attachProblemToLesson,
  detachProblemFromLesson,
  markLessonDone,
  testOutStage,
  getUserProgress,
  resetRoadmapToDefault,
  getRoadmapTopics,
  getRoadmapTopic,
  createRoadmapTopic,
  updateRoadmapTopic,
  deleteRoadmapTopic,
  getStudentCustomContests,
  getStudentCustomContest,
  saveStudentCustomContest,
  deleteStudentCustomContest
};
