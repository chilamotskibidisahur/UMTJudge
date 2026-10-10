/**
 * Benchmark Script for ChauCaoJudge
 * Đo lường 16.a: Thời gian biên dịch C++ tối thiểu vs thời gian chạy
 * Đo lường 16.b: Chi tiết các khâu của bài lặp vô hạn (Infinite Loop - TLE)
 */
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

function formatMs(ms) {
    return ms.toFixed(2) + ' ms';
}

async function runCommand(cmd, args, timeoutMs = 15000) {
    return new Promise((resolve) => {
        const start = process.hrtime.bigint();
        const proc = spawn(cmd, args, { windowsHide: true });
        let stdout = '';
        let stderr = '';
        let killed = false;

        const timer = setTimeout(() => {
            killed = true;
            if (process.platform === 'win32') {
                try { execSync(`taskkill /pid ${proc.pid} /t /f`, { stdio: 'ignore' }); } catch (e) {}
            } else {
                proc.kill('SIGKILL');
            }
        }, timeoutMs);

        proc.stdout.on('data', d => stdout += d.toString());
        proc.stderr.on('data', d => stderr += d.toString());

        proc.on('close', (code) => {
            clearTimeout(timer);
            const end = process.hrtime.bigint();
            const elapsedMs = Number(end - start) / 1e6;
            resolve({ code, stdout, stderr, killed, elapsedMs });
        });

        proc.on('error', (err) => {
            clearTimeout(timer);
            const end = process.hrtime.bigint();
            resolve({ code: -1, stdout, stderr: err.message, killed: false, elapsedMs: Number(end - start) / 1e6 });
        });
    });
}

async function benchmark16a() {
    console.log('=== PHÉP ĐO 16.a: THỜI GIAN BIÊN DỊCH VÀ CHẠY CHƯƠNG TRÌNH C++ TỐI THIỂU ===');
    const cppCode = '#include <iostream>\nint main() { std::cout << "OK"; return 0; }\n';
    const srcFile = path.join(TEMP_DIR, 'min_program.cpp');
    const exeFile = path.join(TEMP_DIR, 'min_program.exe');
    fs.writeFileSync(srcFile, cppCode);

    const compileTimes = [];
    const runTimes = [];

    for (let i = 1; i <= 5; i++) {
        if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
        // Biên dịch như server/judge.cjs: g++ -O2 -std=c++17 -o ... ...
        const compRes = await runCommand('g++', ['-O2', '-std=c++17', '-o', exeFile, srcFile]);
        compileTimes.push(compRes.elapsedMs);

        // Chạy
        const runRes = await runCommand(exeFile, []);
        runTimes.push(runRes.elapsedMs);

        console.log(`Lần ${i}: Compile = ${formatMs(compRes.elapsedMs)}, Run = ${formatMs(runRes.elapsedMs)} (Output: ${runRes.stdout.trim()})`);
    }

    const avgCompile = compileTimes.reduce((a, b) => a + b, 0) / compileTimes.length;
    const avgRun = runTimes.reduce((a, b) => a + b, 0) / runTimes.length;
    console.log(`-> Trung bình: Compile = ${formatMs(avgCompile)}, Run = ${formatMs(avgRun)}\n`);
    return { compileTimes, runTimes, avgCompile, avgRun };
}

async function benchmark16b() {
    console.log('=== PHÉP ĐO 16.b: BÓC TÁCH CHI TIẾT BÀI LẶP VÔ HẠN (5 TEST CASES × 1S LIMIT) ===');
    const infCode = '#include <iostream>\nint main() { while(true) {} return 0; }\n';
    const srcFile = path.join(TEMP_DIR, 'infinite_loop.cpp');
    const exeFile = path.join(TEMP_DIR, 'infinite_loop.exe');
    fs.writeFileSync(srcFile, infCode);

    // Biên dịch
    const compRes = await runCommand('g++', ['-O2', '-std=c++17', '-o', exeFile, srcFile]);
    console.log(`Biên dịch infinite_loop.cpp: ${formatMs(compRes.elapsedMs)}`);

    const timeLimitMs = 1000;
    const marginMs = 500; // judge.cjs: timeout = timeLimitMs + 500
    const effectiveTimeoutMs = timeLimitMs + marginMs; // 1500ms

    const testDetails = [];
    const totalStart = process.hrtime.bigint();

    for (let test = 1; test <= 5; test++) {
        const tStart = process.hrtime.bigint();
        
        // Đo spawn + chờ timeout
        let procKilled = false;
        let killOverheadMs = 0;

        const pStart = process.hrtime.bigint();
        const proc = spawn(exeFile, [], { windowsHide: true });
        
        await new Promise((resolve) => {
            const timer = setTimeout(() => {
                procKilled = true;
                const kStart = process.hrtime.bigint();
                try {
                    execSync(`taskkill /pid ${proc.pid} /t /f`, { stdio: 'ignore' });
                } catch (e) {}
                const kEnd = process.hrtime.bigint();
                killOverheadMs = Number(kEnd - kStart) / 1e6;
            }, effectiveTimeoutMs);

            proc.on('close', () => {
                clearTimeout(timer);
                resolve();
            });
            proc.on('error', () => {
                clearTimeout(timer);
                resolve();
            });
        });

        const tEnd = process.hrtime.bigint();
        const totalTestMs = Number(tEnd - tStart) / 1e6;
        const waitBeforeKillMs = effectiveTimeoutMs;
        testDetails.push({ test, totalTestMs, waitBeforeKillMs, killOverheadMs });

        console.log(`Test ${test}: Timeout timer = ${effectiveTimeoutMs}ms, Taskkill overhead = ${formatMs(killOverheadMs)}, Tổng test = ${formatMs(totalTestMs)}`);
    }

    const totalEnd = process.hrtime.bigint();
    const grandTotalMs = Number(totalEnd - totalStart) / 1e6;
    console.log(`-> Tổng thời gian chạy 5 test cases: ${formatMs(grandTotalMs)} (${(grandTotalMs / 1000).toFixed(2)}s)\n`);
    return { testDetails, grandTotalMs };
}

async function main() {
    try {
        const resA = await benchmark16a();
        const resB = await benchmark16b();
        const summary = {
            system: {
                platform: os.platform(),
                release: os.release(),
                cpus: os.cpus()[0].model,
                cpuCores: os.cpus().length,
                totalRamGb: (os.totalmem() / (1024**3)).toFixed(2),
                nodeVersion: process.version,
            },
            resA,
            resB
        };
        fs.writeFileSync(path.join(__dirname, 'results_16ab.json'), JSON.stringify(summary, null, 2));
        console.log('Đã lưu kết quả đo vào benchmarks/results_16ab.json');
    } finally {
        try { fs.rmSync(TEMP_DIR, { recursive: true, force: true }); } catch (e) {}
    }
}

main();
