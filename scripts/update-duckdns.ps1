# DuckDNS Auto Updater for SchoolJudge
$domain = "chaucaojudge"
$token = "7109e39c-b324-49d1-93db-5d017d418715"
$url = "https://www.duckdns.org/update?domains=$domain&token=$token&ip="

try {
    $res = Invoke-RestMethod -Uri $url -Method Get
    Write-Host "[DuckDNS] Updated chaucaojudge.duckdns.org: $res" -ForegroundColor Green
} catch {
    Write-Host "[DuckDNS] Error: $_" -ForegroundColor Red
}
