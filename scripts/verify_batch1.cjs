'use strict';

const fs = require('fs');
const path = require('path');
const db = require('../server/db.cjs');

const batch1Codes = [
  'RM_TIMECONV', 'RM_BIGSUM', 'RM_BUSCOUNT', 'RM_CLOCKADD', 'RM_SWAPDIGITS',
  'RM_MAX3', 'RM_SORT3', 'RM_LEAPYEAR', 'RM_DAYSINMONTH', 'RM_WEEKDAY',
  'RM_VALIDDATE', 'RM_GRADECLASS', 'RM_ELECTRICBILL', 'RM_TAXBRACKET', 'RM_COUNTDIGITS'
];

console.log('=== KIỂM THỬ XÁC MINH TOÀN DIỆN BATCH 1 (15 BÀI TẬP) ===\n');

let allPassed = true;

batch1Codes.forEach((code, idx) => {
  const prob = db.getProblem(code);
  if (!prob) {
    console.error(`❌ [${idx + 1}] Bài [${code}] không tìm thấy trong Database!`);
    allPassed = false;
    return;
  }

  const tcs = db.getProblemTestCases(prob.id);
  if (!tcs || tcs.length !== 10) {
    console.error(`❌ [${idx + 1}] Bài [${code}] thiếu testcase: có ${tcs ? tcs.length : 0}/10 test!`);
    allPassed = false;
    return;
  }

  // Check no float outputs and non-empty
  let validOutputs = true;
  for (let i = 0; i < tcs.length; i++) {
    const out = tcs[i].expectedOutput.trim();
    if (!out) {
      console.error(`❌ Test ${i + 1} của [${code}] có output rỗng!`);
      validOutputs = false;
    }
    // Check no decimal dot with floating point format (unless text)
    if (/^\d+\.\d+$/.test(out)) {
      console.error(`❌ Test ${i + 1} của [${code}] có output số thực: "${out}"`);
      validOutputs = false;
    }
  }

  if (validOutputs) {
    console.log(`✓ [${idx + 1}/15] [${code}] ${prob.title} | 10/10 testcases hợp lệ | Sample: "${tcs[0].input.trim()}" -> "${tcs[0].expectedOutput.trim()}"`);
  } else {
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\n🎉 TẤT CẢ 15 BÀI TẬP BATCH 1 ĐÃ VƯỢT QUA KIỂM THỬ XÁC MINH!');
} else {
  console.error('\n⚠️ Có lỗi kiểm thử trong Batch 1!');
  process.exit(1);
}
