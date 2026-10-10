const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { marked } = require('marked');

function getBase64Image(filePath) {
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).replace('.', '') || 'png';
    const data = fs.readFileSync(filePath).toString('base64');
    return `data:image/${ext};base64,${data}`;
  }
  return '';
}

function main() {
  const mdPath = path.resolve('docs/user-guide/USER_GUIDE.md');
  const pdfPath = path.resolve('docs/user-guide/ChauCaoJudge_Full_User_Guide.pdf');
  const legacyPdfPath = path.resolve('docs/user-guide/ChauCaoJudge_User_Guide.pdf');
  const htmlDir = path.resolve('docs/user-guide/html');
  const htmlPath = path.resolve(htmlDir, 'ChauCaoJudge_User_Guide_Full.html');

  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true });
  }

  let mdContent = fs.readFileSync(mdPath, 'utf8');

  // Convert images to base64
  const imgLogo = getBase64Image('docs/user-guide/images/app_logo.png');
  const imgArch = getBase64Image('docs/user-guide/images/01_architecture_overview.png');
  const imgTeacher = getBase64Image('docs/user-guide/images/02_teacher_workflow.png');
  const imgRating = getBase64Image('docs/user-guide/images/03_rating_tiers.png');
  const imgStudent = getBase64Image('docs/user-guide/images/04_student_workflow.png');
  const imgJudge = getBase64Image('docs/user-guide/images/05_judge_pipeline.png');

  // Parse markdown
  const bodyHtml = marked.parse(mdContent);

  const fullHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>ChauCaoJudge LAN v1.6.0 - Sổ Tay Hướng Dẫn Sử Dụng Toàn Diện</title>
<style>
  @page {
    size: A4;
    margin: 18mm 16mm 20mm 16mm;
    @bottom-right {
      content: counter(page);
    }
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.6;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }

  /* Cover Page */
  .cover-page {
    page-break-after: always;
    text-align: center;
    padding-top: 80px;
    padding-bottom: 60px;
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .cover-logo {
    width: 130px;
    height: auto;
    margin-bottom: 25px;
    filter: drop-shadow(0 4px 12px rgba(37, 99, 235, 0.2));
  }

  .cover-badge {
    display: inline-block;
    background: #eff6ff;
    color: #2563eb;
    border: 1px solid #bfdbfe;
    padding: 6px 16px;
    border-radius: 999px;
    font-size: 10pt;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-bottom: 15px;
    text-transform: uppercase;
  }

  .cover-title {
    font-size: 28pt;
    font-weight: 900;
    color: #1e3a8a;
    margin: 0 0 12px 0;
    line-height: 1.2;
    letter-spacing: -0.5px;
  }

  .cover-subtitle {
    font-size: 14pt;
    font-weight: 700;
    color: #475569;
    margin-bottom: 25px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .cover-desc {
    font-size: 11pt;
    color: #64748b;
    line-height: 1.7;
    max-width: 580px;
    margin: 0 auto 50px auto;
  }

  .cover-meta {
    font-size: 9.5pt;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    padding-top: 25px;
    max-width: 450px;
    margin: 0 auto;
    text-align: left;
    background: #f8fafc;
    border-radius: 8px;
    padding: 16px 24px;
    border: 1px solid #e2e8f0;
  }

  .cover-meta p {
    margin: 4px 0;
  }

  /* Headings */
  h1 {
    font-size: 18pt;
    color: #1e3a8a;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 6px;
    margin-top: 36px;
    margin-bottom: 16px;
    page-break-after: avoid;
  }

  /* Page break for major parts */
  h1:not(:first-of-type) {
    page-break-before: always;
  }

  h2 {
    font-size: 13.5pt;
    color: #1e40af;
    border-left: 4px solid #3b82f6;
    padding-left: 10px;
    margin-top: 26px;
    margin-bottom: 12px;
    page-break-after: avoid;
  }

  h3 {
    font-size: 11.5pt;
    color: #0f766e;
    margin-top: 20px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }

  h4 {
    font-size: 10.5pt;
    color: #334155;
    margin-top: 14px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }

  /* Paragraphs & Lists */
  p {
    margin: 0 0 10px 0;
    text-align: justify;
  }

  ul, ol {
    margin: 0 0 14px 0;
    padding-left: 24px;
  }

  li {
    margin-bottom: 6px;
  }

  /* Bold highlights */
  strong {
    color: #0f172a;
  }

  /* Code & Pre */
  code {
    font-family: 'Consolas', 'Courier New', monospace;
    background: #f1f5f9;
    color: #be185d;
    padding: 2px 5px;
    border-radius: 4px;
    font-size: 9pt;
    border: 1px solid #e2e8f0;
  }

  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 12px 16px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 8.5pt;
    line-height: 1.45;
    margin: 12px 0 16px 0;
    page-break-inside: avoid;
  }

  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
    border: none;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0 20px 0;
    font-size: 9pt;
    page-break-inside: avoid;
  }

  th, td {
    border: 1px solid #cbd5e1;
    padding: 8px 10px;
    text-align: left;
    vertical-align: top;
  }

  th {
    background-color: #f1f5f9;
    color: #1e293b;
    font-weight: 700;
  }

  tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  /* Blockquotes / Callout boxes */
  blockquote {
    margin: 14px 0;
    padding: 10px 16px;
    background-color: #f0fdf4;
    border-left: 4px solid #22c55e;
    color: #166534;
    font-size: 9.5pt;
    border-radius: 0 6px 6px 0;
    page-break-inside: avoid;
  }

  /* Horizontal Rules */
  hr {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 24px 0;
  }

  /* Footer styling simulation */
  .footer-notice {
    font-size: 8pt;
    color: #94a3b8;
    text-align: center;
    border-top: 1px solid #e2e8f0;
    padding-top: 8px;
    margin-top: 30px;
  }

  /* Print optimization */
  @media print {
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
</style>
</head>
<body>

<!-- Cover Page -->
<div class="cover-page">
  ${imgLogo ? `<img src="${imgLogo}" class="cover-logo" alt="Logo">` : ''}
  <div class="cover-badge">Hệ Thống Máy Chấm & Thi Lập Trình LAN v1.6.0</div>
  <h1 class="cover-title">CHAUCAOJUDGE</h1>
  <div class="cover-subtitle">Sổ Tay Hướng Dẫn Sử Dụng Toàn Diện</div>
  <div class="cover-desc">
    Tài liệu hướng dẫn chi tiết toàn bộ tính năng, mục đích vận hành và quy trình từng bước dành cho Quản trị viên, Giáo viên Tin học và Học sinh trong môi trường mạng nội bộ trường học.
  </div>
  <div class="cover-meta">
    <p><strong>Cơ quan ban hành:</strong> Phòng Thực Hành Tin Học & Ban Quản Trị Hệ Thống</p>
    <p><strong>Phiên bản tài liệu:</strong> ChauCaoJudge v1.6.0 (Cập nhật tháng 10/2026)</p>
    <p><strong>Phạm vi sử dụng:</strong> Mạng nội bộ phòng máy (LAN 100% Offline), Web & Desktop App</p>
    <p><strong>Tiêu chuẩn công nghệ:</strong> Elo Rating Codeforces, Monaco IDE, Sandbox MinGW G++</p>
  </div>
</div>

<!-- Main Content -->
${bodyHtml}

<div class="footer-notice">
  © 2026 ChauCaoJudge LAN System. Bản quyền tài liệu thuộc về Ban Quản Trị và Nhóm Phát Triển.
</div>

</body>
</html>`;

  fs.writeFileSync(htmlPath, fullHtml, 'utf8');
  console.log(`Đã xuất file HTML trung gian: ${htmlPath} (${fs.statSync(htmlPath).size} bytes)`);

  // Detect Chrome / Edge path
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log(`Đang chạy trình duyệt: ${browserPath} để render PDF...`);
  
  if (fs.existsSync(pdfPath)) {
    try { fs.unlinkSync(pdfPath); } catch (e) {}
  }

  const { spawnSync } = require('child_process');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  
  const args = [
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${pdfPath}`,
    fileUrl
  ];

  const result = spawnSync(browserPath, args, { stdio: 'inherit' });
  if (result.error) {
    console.error('Lỗi khi chạy browser:', result.error);
  }

  if (fs.existsSync(pdfPath)) {
    const size = fs.statSync(pdfPath).size;
    const mtime = fs.statSync(pdfPath).mtime;
    console.log(`✓ XUẤT THÀNH CÔNG FILE PDF: ${pdfPath} (${size} bytes, thời gian: ${mtime.toISOString()})`);
    try {
      fs.copyFileSync(pdfPath, legacyPdfPath);
      console.log(`✓ Đã đồng bộ sang: ${legacyPdfPath}`);
    } catch (e) {
      console.log(`(Tệp ${legacyPdfPath} đang mở trong ứng dụng khác nên chưa ghi đè được, đã lưu tại ${pdfPath})`);
    }
  } else {
    console.error('Không tìm thấy file PDF được tạo!');
  }
}

main();
