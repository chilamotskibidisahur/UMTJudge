const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const test = require('node:test');
const { ROADMAP_STAGES, ROADMAP_LESSONS } = require('../server/roadmapData.cjs');
const db = require('../server/db.cjs');

test('Roadmap structure validation', () => {
  const olympicStages = ROADMAP_STAGES.filter(s => !s.track || s.track === 'all' || s.track === 'olympic');
  const careerStages = ROADMAP_STAGES.filter(s => !s.track || s.track === 'all' || s.track === 'career');
  assert.equal(olympicStages.length, 9, 'Should have exactly 9 stages for Olympic track');
  assert.equal(careerStages.length, 9, 'Should have exactly 9 stages for Career track');
  assert.ok(ROADMAP_LESSONS.length >= 240, 'Should have ~250 lessons');

  // Verify all lessons belong to valid stages
  const stageIds = new Set(ROADMAP_STAGES.map(s => s.id));
  ROADMAP_LESSONS.forEach(l => {
    assert.ok(stageIds.has(l.stageId), `Lesson ${l.id} must reference a valid stageId: ${l.stageId}`);
    assert.ok(l.title && l.title.length > 0, `Lesson ${l.id} must have a title`);
    assert.ok(l.shortTheory && l.shortTheory.length > 0, `Lesson ${l.id} must have theory`);
    assert.ok(Array.isArray(l.hints) && l.hints.length >= 2, `Lesson ${l.id} must have hints`);
  });
});

test('Roadmap initial progress calculation for guest/new user', () => {
  const result = db.computeRoadmapProgress(null);
  assert.ok(result.stages && result.stages.length === 9);
  assert.ok(result.lessons && result.lessons.length >= 240);
  assert.ok(result.summary);

  // Stage 1 must be unlocked, others locked initially
  assert.equal(result.stages[0].unlocked, true, 'Stage 1 should be unlocked by default');
  assert.equal(result.stages[1].unlocked, false, 'Stage 2 should be locked by default when checkpoint not passed');

  // Lesson 1 in Stage 1 has no prerequisites so it should be unlocked
  const les1 = result.lessons.find(l => l.id === 'les-1-1');
  assert.ok(les1, 'Lesson 1-1 must exist');
  assert.equal(les1.unlocked, true, 'Lesson 1-1 should be unlocked');

  // Lesson 1-2 requires les-1-1, so it should be locked initially
  const les2 = result.lessons.find(l => l.id === 'les-1-2');
  if (les2 && les2.prerequisiteLessonIds.includes('les-1-1')) {
    assert.equal(les2.unlocked, false, 'Lesson 1-2 should be locked until les-1-1 is done');
    assert.ok(les2.lockReason && les2.lockReason.includes('les-1-1') || les2.lockReason.includes('Cấu trúc'), 'Should specify lock reason');
  }

  // Continue target should be les-1-1
  assert.equal(result.summary.continueTargetLessonId, 'les-1-1', 'Continue target should be les-1-1');
});

test('Prerequisite unlock logic when lesson is marked done', () => {
  const mockUserId = 'test-user-prereq-' + crypto.randomUUID();
  
  // Mark les-1-1 as done
  db.markLessonDone(mockUserId, 'les-1-1');
  
  const result = db.computeRoadmapProgress(mockUserId);
  const les1 = result.lessons.find(l => l.id === 'les-1-1');
  assert.equal(les1.status, 'done', 'les-1-1 should be done');

  const les2 = result.lessons.find(l => l.id === 'les-1-2');
  if (les2 && les2.prerequisiteLessonIds.length === 1 && les2.prerequisiteLessonIds[0] === 'les-1-1') {
    assert.equal(les2.unlocked, true, 'les-1-2 should unlock once les-1-1 is done');
  }
});

test('Stage test-out marks stage done and unlocks next stage', () => {
  const mockUserId = 'test-user-testout-' + crypto.randomUUID();

  // Initially Stage 2 is locked
  let res = db.computeRoadmapProgress(mockUserId);
  assert.equal(res.stages[1].unlocked, false, 'Stage 2 should be locked initially');

  // Test-out Stage 1
  db.testOutStage(mockUserId, 'stage-1');

  res = db.computeRoadmapProgress(mockUserId);
  assert.equal(res.stages[0].completed, true, 'Stage 1 should be marked completed');
  assert.equal(res.stages[0].testedOut, true, 'Stage 1 should have testedOut = true');
  assert.equal(res.stages[1].unlocked, true, 'Stage 2 should now be unlocked!');

  // Continue target should advance to Stage 2
  const nextTarget = res.summary.continueTargetLessonId;
  const targetLesson = res.lessons.find(l => l.id === nextTarget);
  assert.ok(targetLesson, 'Should have a valid next continue lesson');
  assert.equal(targetLesson.stageId, 'stage-2', 'Continue target should now be in stage-2');
});

test('Overall progress and streak calculation', () => {
  const mockUserId = 'test-user-progress-' + crypto.randomUUID();
  
  // Test-out Stage 1
  db.testOutStage(mockUserId, 'stage-1');
  const res = db.computeRoadmapProgress(mockUserId);

  const stage1Count = ROADMAP_LESSONS.filter(l => l.stageId === 'stage-1').length;
  assert.ok(res.summary.completedLessons >= stage1Count, `At least ${stage1Count} lessons completed in Stage 1`);
});

test('Multi-track roadmap: Olympic vs Career tracks and class auto-detection', () => {
  // 1. Explicit track query
  const olpProg = db.computeRoadmapProgress(null, 'olympic');
  assert.equal(olpProg.activeTrack, 'olympic');
  assert.equal(olpProg.stages.length, 9);
  assert.equal(olpProg.stages[0].id, 'stage-1');

  const careerProg = db.computeRoadmapProgress(null, 'career');
  assert.equal(careerProg.activeTrack, 'career');
  assert.equal(careerProg.stages.length, 9);
  assert.equal(careerProg.stages[0].id, 'stage-c1');

  // 2. Class auto-detection
  const mockCareerUser = {
    id: 'user-dev-' + crypto.randomUUID(),
    username: 'dev_student',
    classes: ['class-career']
  };
  db.data.users.push(mockCareerUser);
  const detectedCareer = db.computeRoadmapProgress(mockCareerUser.id);
  assert.equal(detectedCareer.activeTrack, 'career');
  assert.equal(detectedCareer.stages[0].id, 'stage-c1');

  const mockOlpUser = {
    id: 'user-olp-' + crypto.randomUUID(),
    username: 'olp_student',
    classes: ['class-olp']
  };
  db.data.users.push(mockOlpUser);
  const detectedOlp = db.computeRoadmapProgress(mockOlpUser.id);
  assert.equal(detectedOlp.activeTrack, 'olympic');
  assert.equal(detectedOlp.stages[0].id, 'stage-1');
});
