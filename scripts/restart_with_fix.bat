@echo off
chcp 65001 >nul
echo Đang đóng máy chủ ChauCaoJudge để nạp dữ liệu chuẩn...
taskkill /F /IM ChauCaoJudge.exe 2>nul
timeout /t 2 /nobreak >nul
echo Đang cập nhật trạng thái các kỳ thi sang RUNNING và mở quyền thi cho Phat Ta...
node "%~dp0fix_active_contests.cjs"
echo Đang khởi động lại ChauCaoJudge...
start "" "%LOCALAPPDATA%\Programs\ChauCaoJudge\ChauCaoJudge.exe"
echo Hoàn tất!
