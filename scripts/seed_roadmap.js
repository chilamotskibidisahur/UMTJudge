/**
 * SEED AND SYNC ALGORITHM ROADMAP DATA (IDEMPOTENT & SAFE)
 * Usage: node scripts/seed_roadmap.js
 */

const fs = require('fs');
const path = require('path');
const { ALGORITHM_ROADMAP_TOPICS } = require('../server/roadmapData.cjs');

function getDatabaseFiles() {
  const files = [];
  const localFile = path.resolve('schooljudge_data.json');
  if (fs.existsSync(localFile)) files.push(localFile);

  if (process.env.APPDATA) {
    const appDataFile = path.join(process.env.APPDATA, 'chaucaojudge', 'data', 'schooljudge_data.json');
    if (fs.existsSync(appDataFile)) files.push(appDataFile);
  }
  return files;
}

function backupFile(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.bak_${timestamp}`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`[BACKUP] Created database backup at: ${backupPath}`);
  return backupPath;
}

function validateRoadmap(topics, existingProblemCodes) {
  const errors = [];
  const warnings = [];
  const topicIdSet = new Set();
  const linkedProblems = new Set();

  // 1. Check unique IDs
  for (const t of topics) {
    if (!t.id) {
      errors.push(`Topic has missing id: ${t.title}`);
    } else if (topicIdSet.has(t.id)) {
      errors.push(`Duplicate topic id detected: ${t.id}`);
    } else {
      topicIdSet.add(t.id);
    }
  }

  // 2. Check problem codes existence
  for (const t of topics) {
    for (const code of t.problemCodes || []) {
      if (existingProblemCodes.has(code.toUpperCase())) {
        linkedProblems.add(code.toUpperCase());
      } else {
        warnings.push(`Topic [${t.id}] has problem code not in this DB: ${code}`);
      }
    }
  }

  // 3. Check prerequisites
  for (const t of topics) {
    for (const prereqId of t.prerequisites || []) {
      if (!topicIdSet.has(prereqId)) {
        errors.push(`Topic [${t.id}] references non-existent prerequisite: ${prereqId}`);
      }
    }
  }

  // 4. Check for cycles in prerequisites (DAG check)
  const visited = new Map(); // 0: unvisited, 1: visiting, 2: visited
  const adj = new Map();
  for (const t of topics) {
    adj.set(t.id, t.prerequisites || []);
    visited.set(t.id, 0);
  }

  function hasCycle(u) {
    visited.set(u, 1);
    const prereqs = adj.get(u) || [];
    for (const v of prereqs) {
      if (visited.get(v) === 1) return true; // back-edge = cycle
      if (visited.get(v) === 0 && hasCycle(v)) return true;
    }
    visited.set(u, 2);
    return false;
  }

  for (const t of topics) {
    if (visited.get(t.id) === 0) {
      if (hasCycle(t.id)) {
        errors.push(`Prerequisite cycle detected involving topic [${t.id}]!`);
        break;
      }
    }
  }

  return { errors, warnings, linkedProblems, totalTopics: topics.length };
}

function syncDatabaseFile(filePath) {
  console.log(`\n==================================================`);
  console.log(`Processing database file: ${filePath}`);
  console.log(`==================================================`);

  backupFile(filePath);

  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse JSON in ${filePath}:`, err);
    return false;
  }

  // Extract problems
  const problems = data.problems || [];
  const problemCodes = new Set(problems.map(p => (p.code || '').trim().toUpperCase()));
  console.log(`Found ${problems.length} problems in database.`);

  // Validation
  const validation = validateRoadmap(ALGORITHM_ROADMAP_TOPICS, problemCodes);
  if (validation.errors.length > 0) {
    console.error(`Validation failed with ${validation.errors.length} errors:`);
    validation.errors.forEach(e => console.error(`  - ERROR: ${e}`));
    return false;
  }

  console.log(`Roadmap DAG and problem code validation passed successfully!`);

  // Idempotent merge
  const existingTopics = Array.isArray(data.roadmap_topics) ? data.roadmap_topics : [];
  const existingMap = new Map(existingTopics.map(t => [t.id, t]));

  const mergedTopics = ALGORITHM_ROADMAP_TOPICS.map(topic => {
    const existing = existingMap.get(topic.id);
    const validProblemCodes = (topic.problemCodes || []).filter(code => problemCodes.has(code.toUpperCase()));
    return {
      ...(existing || {}),
      ...topic,
      id: topic.id,
      order: topic.order,
      title: topic.title,
      description: topic.description,
      guide: topic.guide,
      level: topic.level,
      icon: topic.icon,
      phase: topic.phase,
      difficulty: topic.difficulty,
      prerequisites: topic.prerequisites,
      estimatedMinutes: topic.estimatedMinutes,
      problemCodes: validProblemCodes,
      updatedAt: new Date().toISOString()
    };
  });

  // Sort by order
  mergedTopics.sort((a, b) => (a.order || 0) - (b.order || 0));

  data.roadmap_topics = mergedTopics;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Successfully updated ${mergedTopics.length} topics into: ${filePath}`);

  // Report statistics
  console.log(`--- STATISTICS ---`);
  console.log(`Total topics in roadmap: ${mergedTopics.length}`);
  console.log(`Total problems linked: ${validation.linkedProblems.size} / ${problems.length}`);
  const unlinked = mergedTopics.filter(t => !t.problemCodes || t.problemCodes.length === 0);
  console.log(`Topics without problems yet: ${unlinked.length} (${unlinked.map(t => t.id).join(', ')})`);

  return true;
}

function run() {
  const dbFiles = getDatabaseFiles();
  if (dbFiles.length === 0) {
    console.error('No database files found to sync!');
    process.exit(1);
  }

  console.log(`Found ${dbFiles.length} database target file(s).`);
  let successAll = true;
  for (const f of dbFiles) {
    const ok = syncDatabaseFile(f);
    if (!ok) successAll = false;
  }

  if (successAll) {
    console.log('\n[SUCCESS] Algorithm Roadmap seeded and synchronized completely!');
  } else {
    console.error('\n[FAILED] Encountered errors during seeding!');
    process.exit(1);
  }
}

run();
