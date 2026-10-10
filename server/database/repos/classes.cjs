'use strict';

const crypto = require('crypto');
const { query } = require('../pool.cjs');

function newId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function sortClassesNaturally(list) {
  return [...list].sort((a, b) => {
    const numA = parseInt(String(a.name || '').match(/^(\d+)/)?.[1] || (a.grade != null ? String(a.grade) : '999'), 10);
    const numB = parseInt(String(b.name || '').match(/^(\d+)/)?.[1] || (b.grade != null ? String(b.grade) : '999'), 10);
    if (numA !== numB) return numA - numB;
    return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' });
  });
}

/**
 * Lấy danh sách toàn bộ các lớp học kèm theo số lượng học sinh (Sắp xếp thông minh theo Khối và Tên)
 */
async function getClasses() {
  const sql = `
    SELECT 
      c.id, c.name, c.grade, c.teacher, c.join_code AS "joinCode", c.created_at AS "createdAt",
      COUNT(se.student_id)::INT AS "studentCount"
    FROM classes c
    LEFT JOIN student_enrollments se ON se.class_id = c.id
    GROUP BY c.id
  `;
  const res = await query(sql);
  return sortClassesNaturally(res.rows);
}

/**
 * Lấy chi tiết một lớp theo ID
 */
async function getClass(id) {
  if (!id) return null;
  const sql = `
    SELECT 
      c.id, c.name, c.grade, c.teacher, c.join_code AS "joinCode", c.created_at AS "createdAt",
      COUNT(se.student_id)::INT AS "studentCount"
    FROM classes c
    LEFT JOIN student_enrollments se ON se.class_id = c.id
    WHERE c.id = $1
    GROUP BY c.id
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
}

/**
 * Tạo lớp học mới
 */
async function createClass(cls) {
  const name = cls.name.trim();
  const autoGrade = parseInt(name.match(/\d+/)?.[0] || '0', 10) || null;
  const grade = cls.grade !== undefined && cls.grade !== null && cls.grade !== '' ? Number(cls.grade) : autoGrade;
  const id = cls.id || newId('cls');
  const teacher = cls.teacher || 'Giáo viên';
  const joinCode = (cls.joinCode || Math.random().toString(36).substring(2, 8)).toUpperCase();

  const sql = `
    INSERT INTO classes (id, name, grade, teacher, join_code)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, grade, teacher, join_code AS "joinCode", created_at AS "createdAt"
  `;
  const res = await query(sql, [id, name, grade, teacher, joinCode]);
  return res.rows[0];
}

/**
 * Cập nhật thông tin lớp học
 */
async function updateClass(id, updates = {}) {
  const current = await getClass(id);
  if (!current) return null;

  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.name !== undefined) {
    fields.push(`name = $${idx++}`);
    values.push(updates.name.trim());
  }
  if (updates.grade !== undefined) {
    fields.push(`grade = $${idx++}`);
    values.push(updates.grade !== null && updates.grade !== '' ? Number(updates.grade) : null);
  }
  if (updates.teacher !== undefined) {
    fields.push(`teacher = $${idx++}`);
    values.push(updates.teacher.trim());
  }
  if (updates.joinCode !== undefined) {
    fields.push(`join_code = $${idx++}`);
    values.push(updates.joinCode.trim().toUpperCase());
  }

  if (fields.length === 0) return current;

  values.push(id);
  const sql = `
    UPDATE classes SET ${fields.join(', ')} 
    WHERE id = $${idx}
    RETURNING id, name, grade, teacher, join_code AS "joinCode", created_at AS "createdAt"
  `;
  const res = await query(sql, values);
  return res.rows[0] || null;
}

/**
 * Xóa lớp học
 */
async function deleteClass(id) {
  const res = await query('DELETE FROM classes WHERE id = $1 RETURNING id', [id]);
  return res.rows.length > 0;
}

/**
 * Lấy danh sách các lớp của một học sinh
 */
async function getStudentClasses(studentId) {
  const sql = `
    SELECT c.id, c.name, c.grade, c.teacher, c.join_code AS "joinCode"
    FROM classes c
    JOIN student_enrollments se ON se.class_id = c.id
    WHERE se.student_id = $1
    ORDER BY c.name ASC
  `;
  const res = await query(sql, [studentId]);
  return res.rows;
}

/**
 * Ghi danh học sinh vào lớp
 */
async function enrollStudent(studentId, classId) {
  const sql = `
    INSERT INTO student_enrollments (student_id, class_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `;
  await query(sql, [studentId, classId]);
  return true;
}

/**
 * Rút học sinh khỏi lớp
 */
async function unenrollStudent(studentId, classId) {
  const sql = `DELETE FROM student_enrollments WHERE student_id = $1 AND class_id = $2`;
  await query(sql, [studentId, classId]);
  return true;
}

/**
 * Chuyển năm học mới (Đôn khối tự động: 10->11, 11->12, 12 tốt nghiệp)
 */
async function promoteSchoolYear() {
  const list = await getClasses();
  let promotedCount = 0;
  let graduatedCount = 0;

  for (const cls of list) {
    const rawGrade = cls.grade ?? parseInt(cls.name.match(/^(\d+)/)?.[1] || '0', 10);
    if (!rawGrade) continue;

    if (rawGrade >= 12) {
      const newName = cls.name.startsWith('[Cựu HS]') ? cls.name : `[Cựu HS] ${cls.name}`;
      await updateClass(cls.id, { name: newName, grade: null });
      graduatedCount++;
    } else {
      const nextGrade = rawGrade + 1;
      const newName = cls.name.replace(new RegExp(`^${rawGrade}`), String(nextGrade));
      await updateClass(cls.id, { name: newName, grade: nextGrade });
      promotedCount++;
    }
  }

  return { success: true, promotedCount, graduatedCount };
}

module.exports = {
  sortClassesNaturally,
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  getStudentClasses,
  enrollStudent,
  unenrollStudent,
  promoteSchoolYear
};
