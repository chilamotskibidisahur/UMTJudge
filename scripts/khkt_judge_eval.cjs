// Real accuracy experiment for the ChauCaoJudge judge engine (KHKT report, Table 2/3).
// Runs known-outcome C++ programs through server/judge.cjs and records expected vs actual verdict.
// Does NOT touch the database.
'use strict';
const fs = require('fs');
const path = require('path');
const judge = require(path.resolve('server/judge.cjs'));

const REPEAT = 5;
const tests = [];
for (let i = 1; i <= 5; i++) {
  const a = i * 123457, b = i * 7654321;
  tests.push({ id: `tc${i}`, input: `${a} ${b}`, expectedOutput: String(a + b), isSample: i === 1, score: 20 });
}
const problem = { id: 'prob-khkt-eval', code: 'SUM2', timeLimit: 1000, memoryLimit: 64, points: 100, testCases: tests };

const H = '#include <bits/stdc++.h>\nusing namespace std;\n';
const programs = [
  { name: 'Lời giải đúng', expected: 'AC', code: H + 'int main(){long long a,b;cin>>a>>b;cout<<a+b;}' },
  { name: 'Sai công thức (a-b)', expected: 'WA', code: H + 'int main(){long long a,b;cin>>a>>b;cout<<a-b;}' },
  { name: 'Vòng lặp vô hạn', expected: 'TLE', code: H + 'int main(){volatile long long x=0;while(true){x++;}}' },
  { name: 'Lỗi cú pháp (thiếu ;)', expected: 'CE', code: H + 'int main(){long long a,b cin>>a>>b;cout<<a+b;}' },
  { name: 'Truy cập bộ nhớ sai', expected: 'RE', code: H + 'int main(){int *p=nullptr; *p=5; cout<<*p;}' },
  { name: 'Cấp phát ~512 MB', expected: 'MLE', code: H + 'int main(){vector<long long> v(64*1024*1024,1);long long s=0;for(size_t i=0;i<v.size();i+=4096)s+=v[i];long long a,b;cin>>a>>b;cout<<a+b+(s<0);}' },
];

(async () => {
  const diag = judge.getDiagnostics();
  const rows = [];
  for (const p of programs) {
    for (let r = 1; r <= REPEAT; r++) {
      const t0 = Date.now();
      const res = await judge.gradeSubmission({ id: `khkt-${Date.now()}-${r}`, code: p.code, requireFreopen: false }, problem, null);
      rows.push({
        program: p.name, expected: p.expected, actual: res.status, score: res.score,
        passed: res.passedTests, total: res.totalTests,
        execTimeMs: res.executionTime ?? null, wallMs: Date.now() - t0, memory: res.memoryUsed ?? null
      });
      process.stdout.write(`${p.expected} run${r}: ${res.status} (${Date.now() - t0} ms)\n`);
    }
  }
  const outDir = path.resolve('output');
  fs.mkdirSync(outDir, { recursive: true });
  const result = {
    runAt: new Date().toISOString(),
    environment: { node: process.version, platform: process.platform, hasNativeGpp: diag.hasNativeGpp, hasDocker: diag.hasDocker },
    repeat: REPEAT, rows
  };
  fs.writeFileSync(path.join(outDir, 'judge_eval_results.json'), JSON.stringify(result, null, 2), 'utf8');
  console.log('Saved output/judge_eval_results.json');
  process.exit(0);
})();
