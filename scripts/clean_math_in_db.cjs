'use strict';

const fs = require('fs');
const path = require('path');

const repoJson = path.resolve(__dirname, '..', 'schooljudge_data.json');
const roadmapDataJs = path.resolve(__dirname, '..', 'server', 'roadmapData.cjs');
const appDataJson = process.env.APPDATA 
  ? path.join(process.env.APPDATA, 'chaucaojudge', 'data', 'schooljudge_data.json')
  : null;

function cleanMathString(str) {
  if (!str || typeof str !== 'string') return str;
  let s = str;
  // Replace LaTeX symbols
  s = s.replace(/\\pmod\s*([a-zA-Z0-9_]+)/g, ' (mod $1)');
  s = s.replace(/\\cdot/g, ' × ');
  s = s.replace(/\\times/g, ' × ');
  s = s.replace(/\\le\b/g, '≤');
  s = s.replace(/\\ge\b/g, '≥');
  s = s.replace(/\\ne\b|\\neq\b/g, '≠');
  s = s.replace(/\\pm\b/g, '±');
  s = s.replace(/\\equiv\b/g, '≡');
  s = s.replace(/\\sqrt\{([^}]+)\}/g, '√$1');
  s = s.replace(/\\sqrt\s*([a-zA-Z0-9]+)/g, '√$1');
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)');
  s = s.replace(/\\dots\b/g, '…');
  s = s.replace(/\\log\b/g, 'log');
  s = s.replace(/\\gcd\b/g, 'gcd');
  s = s.replace(/\\text\{([^}]+)\}/g, '$1');
  s = s.replace(/\\\{/g, '{').replace(/\\\}/g, '}');

  // Strip single-letter math wrappers like $A$, $B$, $N$ or $1 \le A \le 10^9$ into clean math text
  // e.g. "$A$" -> "A", "$B$" -> "B", "$1 ≤ A, B ≤ 10^9$" -> "1 ≤ A, B ≤ 10^9"
  // Note: we can keep it as $...$ or strip $...$ depending on whether we want plain Unicode
  // But wait! If we keep or format:
  // Inside HTML or statements, replacing $A$ with A or <i>A</i> or keeping $...$ without \le:
  // E.g. $1 \le A, B \le 10^9$ -> $1 ≤ A, B ≤ 10^9$
  return s;
}

function processJsonFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  console.log(`Đang xử lý ${filePath}...`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let count = 0;

  if (Array.isArray(data.problems)) {
    for (const prob of data.problems) {
      if (prob.description) prob.description = cleanMathString(prob.description);
      if (prob.statement) prob.statement = cleanMathString(prob.statement);
      if (prob.statementHtml) prob.statementHtml = cleanMathString(prob.statementHtml);
      if (prob.inputDescription) prob.inputDescription = cleanMathString(prob.inputDescription);
      if (prob.outputDescription) prob.outputDescription = cleanMathString(prob.outputDescription);
      if (prob.constraints) prob.constraints = cleanMathString(prob.constraints);
      if (Array.isArray(prob.hints)) {
        prob.hints = prob.hints.map(h => cleanMathString(h));
      }
      count++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✓ Đã chuẩn hóa ${count} bài tập trong ${filePath}`);
}

processJsonFile(repoJson);
if (appDataJson && fs.existsSync(appDataJson)) {
  processJsonFile(appDataJson);
}

// Clean roadmapData.cjs
if (fs.existsSync(roadmapDataJs)) {
  console.log(`Đang xử lý ${roadmapDataJs}...`);
  let content = fs.readFileSync(roadmapDataJs, 'utf8');
  content = cleanMathString(content);
  fs.writeFileSync(roadmapDataJs, content, 'utf8');
  console.log(`✓ Đã chuẩn hóa ${roadmapDataJs}`);
}
