/**
 * Benchmark Script for ChauCaoJudge
 * Đo lường 16.c: Thời gian chờ kết quả khi 5, 20, 40 bài nộp cùng lúc
 * Giữ nguyên mô hình queue hiện tại của dự án:
 * - Thuật toán: FIFO
 * - Concurrency: 2 workers song song (server/queue.cjs: line 9)
 * - Mỗi bài: Mã nguồn C++ đúng đơn giản (A + B), compile g++ -O2 -std=c++17, chạy 1 testcase
 * - Đo: Thời gian chờ từ lúc nộp (enqueue) đến khi nhận kết quả (done)
 * - Lặp: 3 lượt cho mỗi mức (5, 20, 40 bài)
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const BENCH_DIR = path.join(__dirname, 'bench_concurrency_temp');

function formatMs(ms) {
    return (ms / 1000).toFixed(2) + 's (' + ms.toFixed(0) + 'ms)';
}

// Hàm compile & run 1 submission độc lập (mô phỏng đúng judge.cjs)
async function judgeSingleTask(id, codeFile, inputFile, expectedOutput) {
    const taskDir = path.join(BENCH_DIR, `task_${id}_${Date.now()}_${Math.random().toString(36).substring(7)}`);
    fs.mkdirSync(taskDir, { recursive: true });

    const srcPath = path.join(taskDir, 'solution.cpp');
    const exePath = path.join(taskDir, 'solution.exe');
    fs.copyFileSync(codeFile, srcPath);

    try {
        // 1. Biên dịch
        await new Promise((resolve, reject) => {
            const cp = spawn('g++', ['-O2', '-std=c++17', '-o', exePath, srcPath], { windowsHide: true });
            const timer = setTimeout(() => {
                try { execSync(`taskkill /pid ${cp.pid} /t /f`, { stdio: 'ignore' }); } catch (e) {}
                reject(new Error('Compilation timeout'));
            }, 10000);
            cp.on('close', (code) => {
                clearTimeout(timer);
                if (code === 0) resolve();
                else reject(new Error(`Compilation error code ${code}`));
            });
            cp.on('error', (err) => {
                clearTimeout(timer);
                reject(err);
            });
        });

        // 2. Chạy test case
        const stdout = await new Promise((resolve, reject) => {
            const inputData = fs.readFileSync(inputFile);
            const proc = spawn(exePath, [], { windowsHide: true });
            let out = '';
            const timer = setTimeout(() => {
                try { execSync(`taskkill /pid ${proc.pid} /t /f`, { stdio: 'ignore' }); } catch (e) {}
                reject(new Error('Runtime timeout'));
            }, 2000);

            proc.stdout.on('data', d => out += d.toString());
            proc.on('close', (code) => {
                clearTimeout(timer);
                resolve(out);
            });
            proc.on('error', (err) => {
                clearTimeout(timer);
                reject(err);
            });
            proc.stdin.write(inputData);
            proc.stdin.end();
        });

        // 3. So khớp
        const isAc = stdout.trim() === expectedOutput.trim();
        return { status: isAc ? 'AC' : 'WA' };
    } finally {
        // Dọn dẹp
        try { fs.rmSync(taskDir, { recursive: true, force: true }); } catch (e) {}
    }
}

// Hàng đợi FIFO concurrency = 2 (chuẩn theo server/queue.cjs)
class BenchmarkQueue {
    constructor(concurrency = 2) {
        this.concurrency = concurrency;
        this.queue = [];
        this.activeWorkers = 0;
    }

    submit(taskFn) {
        return new Promise((resolve, reject) => {
            const enqueueTime = process.hrtime.bigint();
            this.queue.push({ taskFn, resolve, reject, enqueueTime });
            this.processNext();
        });
    }

    async processNext() {
        if (this.activeWorkers >= this.concurrency || this.queue.length === 0) {
            return;
        }

        const item = this.queue.shift();
        this.activeWorkers++;

        try {
            const result = await item.taskFn();
            const doneTime = process.hrtime.bigint();
            const waitTimeMs = Number(doneTime - item.enqueueTime) / 1e6;
            item.resolve({ ...result, waitTimeMs });
        } catch (err) {
            const doneTime = process.hrtime.bigint();
            const waitTimeMs = Number(doneTime - item.enqueueTime) / 1e6;
            item.resolve({ status: 'ERR', error: err.message, waitTimeMs });
        } finally {
            this.activeWorkers--;
            this.processNext();
        }
    }
}

async function runLevel(subCount, round, codeFile, inputFile, expectedOutput) {
    const queue = new BenchmarkQueue(2); // Giữ nguyên concurrency = 2
    const promises = [];

    const startAll = process.hrtime.bigint();
    for (let i = 0; i < subCount; i++) {
        promises.push(queue.submit(() => judgeSingleTask(i, codeFile, inputFile, expectedOutput)));
    }

    const results = await Promise.all(promises);
    const endAll = process.hrtime.bigint();
    const totalBatchMs = Number(endAll - startAll) / 1e6;

    const waitTimes = results.map(r => r.waitTimeMs);
    const avgWait = waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length;
    const maxWait = Math.max(...waitTimes);
    const minWait = Math.min(...waitTimes);

    console.log(`[N=${subCount} bài | Lượt ${round}]: Trung bình = ${formatMs(avgWait)}, Lâu nhất = ${formatMs(maxWait)}, Nhanh nhất = ${formatMs(minWait)}, Tổng batch = ${formatMs(totalBatchMs)}`);

    return { subCount, round, avgWait, maxWait, minWait, totalBatchMs };
}

async function main() {
    console.log('=== PHÉP ĐO 16.c: THỜI GIAN CHỜ KHI 5, 20, 40 BÀI NỘP CÙNG LÚC (CONCURRENCY = 2) ===\n');
    fs.mkdirSync(BENCH_DIR, { recursive: true });

    const codeFile = path.join(BENCH_DIR, 'aplusb.cpp');
    const inputFile = path.join(BENCH_DIR, 'input.txt');
    fs.writeFileSync(codeFile, '#include <iostream>\nint main() { long long a, b; if (std::cin >> a >> b) std::cout << a + b; return 0; }\n');
    fs.writeFileSync(inputFile, '123456789 987654321\n');
    const expectedOutput = '1111111110';

    const testCounts = [5, 20, 40];
    const allResults = {};

    try {
        for (const count of testCounts) {
            allResults[count] = [];
            console.log(`--- Đang đo mức ${count} bài nộp cùng lúc (3 lượt) ---`);
            for (let round = 1; round <= 3; round++) {
                const res = await runLevel(count, round, codeFile, inputFile, expectedOutput);
                allResults[count].push(res);
            }
            const overallAvg = allResults[count].reduce((acc, r) => acc + r.avgWait, 0) / 3;
            const overallMax = Math.max(...allResults[count].map(r => r.maxWait));
            console.log(`=> TỔNG KẾT MỨC ${count} BÀI: Trung bình cộng = ${formatMs(overallAvg)} | Lâu nhất đỉnh điểm = ${formatMs(overallMax)}\n`);
        }

        const outJson = path.join(__dirname, 'results_16c.json');
        fs.writeFileSync(outJson, JSON.stringify(allResults, null, 2));
        console.log(`Đã lưu kết quả đo vào ${outJson}`);
    } finally {
        try { fs.rmSync(BENCH_DIR, { recursive: true, force: true }); } catch (e) {}
    }
}

main();
