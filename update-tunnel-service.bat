@echo off
cls
echo ====================================================================
echo      CAP NHAT CLOUDFLARE TUNNEL SERVICE CHO CHAUCAOJUDGE.XYZ
echo ====================================================================
echo.
echo [*] Dang yeu cau quyen Administrator de cai dat Token moi vao Windows Service...
powershell -Command "Start-Process powershell -Verb RunAs -ArgumentList '-NoProfile -Command \"& ''C:\Program Files (x86)\cloudflared\cloudflared.exe'' service stop; & ''C:\Program Files (x86)\cloudflared\cloudflared.exe'' service uninstall; & ''C:\Program Files (x86)\cloudflared\cloudflared.exe'' service install eyJhIjoiNjYwYzJiNjFjYjcwYzk5ODQwNzE3ZTA0NjhiZmI1MWYiLCJ0IjoiZTI2Y2ZjYmItYzJjYi00ODRiLThjNmYtYWM2NzhjOGYwOGM2IiwicyI6Ik9XRTBOV00wTlRNdFpEY3daaTAwTm1GbUxXSTJZMll0TmpZME1EY3dOV1U0TXpaaSJ9; & ''C:\Program Files (x86)\cloudflared\cloudflared.exe'' service start\"'"
echo.
echo [*] Da gui lenh cap nhat den Windows. Vui long bam YES neu co popup UAC hoi quyen.
echo.
pause
