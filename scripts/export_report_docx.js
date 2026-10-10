'use strict';

const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  TableOfContents
} = require('docx');

const repoRoot = path.resolve(__dirname, '..');
const mdPath = path.join(repoRoot, 'BAO_CAO_NGHIEN_CUU_KHOA_HOC.md');
const outDocxPath = path.join(repoRoot, 'BAO_CAO_NGHIEN_CUU_KHOA_HOC_UMTJUDGE.docx');

const mdContent = fs.readFileSync(mdPath, 'utf8');

// Styling constants
const FONT_FAMILY = 'Times New Roman';
const COLOR_PRIMARY = '1E3A8A';   // Dark Blue
const COLOR_SECONDARY = '0F766E'; // Teal
const COLOR_TEXT = '1F2937';      // Dark Gray / Charcoal
const COLOR_MUTED = '4B5563';

function cleanLatexAndMarkdown(text) {
  if (!text) return '';
  let s = String(text);
  // Replace LaTeX \text{...} with inside text
  s = s.replace(/\\text\{([^}]+)\}/g, '$1');
  // Replace LaTeX symbols with Unicode equivalents
  s = s.replace(/\\le\b/g, '≤')
       .replace(/\\ge\b/g, '≥')
       .replace(/\\times\b/g, '×')
       .replace(/\\neq\b/g, '≠')
       .replace(/\\in\b/g, '∈')
       .replace(/\\exists\b/g, '∃')
       .replace(/\\forall\b/g, '∀')
       .replace(/\\wedge\b/g, ' và ')
       .replace(/\\vee\b/g, ' hoặc ')
       .replace(/\\rightarrow\b/g, '→')
       .replace(/\\left/g, '')
       .replace(/\\right/g, '')
       .replace(/\\begin\{[a-zA-Z*]+\}/g, '')
       .replace(/\\end\{[a-zA-Z*]+\}/g, '')
       .replace(/\\cdot\b/g, '·')
       .replace(/\\dots\b/g, '...')
       .replace(/\\cases\b/g, '')
       .replace(/\\[a-zA-Z]+\b/g, '') // remove remaining backslash commands
       .replace(/\\{2,}/g, ' ')
       .replace(/\$/g, '');
  return s;
}

function parseInlineFormatting(text, baseOptions = {}) {
  const cleaned = cleanLatexAndMarkdown(text);
  const runs = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      runs.push(new TextRun({
        text: cleaned.slice(lastIndex, match.index),
        font: baseOptions.font || FONT_FAMILY,
        size: baseOptions.size || 26,
        color: baseOptions.color || COLOR_TEXT,
        italics: baseOptions.italics || false,
        bold: baseOptions.bold || false
      }));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      runs.push(new TextRun({
        text: token.slice(2, -2),
        font: baseOptions.font || FONT_FAMILY,
        size: baseOptions.size || 26,
        bold: true,
        color: baseOptions.color || COLOR_TEXT,
        italics: baseOptions.italics || false
      }));
    } else if (token.startsWith('`') && token.endsWith('`')) {
      runs.push(new TextRun({
        text: token.slice(1, -1),
        font: 'Consolas',
        size: (baseOptions.size || 26) - 2,
        bold: false,
        color: '0F766E'
      }));
    } else if (token.startsWith('*') && token.endsWith('*')) {
      runs.push(new TextRun({
        text: token.slice(1, -1),
        font: baseOptions.font || FONT_FAMILY,
        size: baseOptions.size || 26,
        bold: false,
        color: baseOptions.color || COLOR_TEXT,
        italics: true
      }));
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < cleaned.length) {
    runs.push(new TextRun({
      text: cleaned.slice(lastIndex),
      font: baseOptions.font || FONT_FAMILY,
      size: baseOptions.size || 26,
      color: baseOptions.color || COLOR_TEXT,
      italics: baseOptions.italics || false,
      bold: baseOptions.bold || false
    }));
  }

  if (runs.length === 0) {
    runs.push(new TextRun({
      text: '',
      font: baseOptions.font || FONT_FAMILY,
      size: baseOptions.size || 26
    }));
  }

  return runs;
}

function createPara(text, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.LEFT,
    spacing: {
      before: options.spaceBefore !== undefined ? options.spaceBefore : 80,
      after: options.spaceAfter !== undefined ? options.spaceAfter : 120,
      line: 320 // 1.33x line spacing
    },
    children: parseInlineFormatting(text, options)
  });
}

function createHeading1(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [
      new TextRun({
        text: title,
        font: FONT_FAMILY,
        size: 32, // 16pt
        bold: true,
        color: COLOR_PRIMARY
      })
    ]
  });
}

function createHeading2(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text: title,
        font: FONT_FAMILY,
        size: 28, // 14pt
        bold: true,
        color: COLOR_SECONDARY
      })
    ]
  });
}

function createHeading3(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text: title,
        font: FONT_FAMILY,
        size: 26, // 13pt
        bold: true,
        color: COLOR_TEXT
      })
    ]
  });
}

function createCodeBlock(codeText) {
  const lines = codeText.split('\n');
  return lines.map(line => new Paragraph({
    spacing: { before: 40, after: 40, line: 260 },
    children: [
      new TextRun({
        text: line,
        font: 'Consolas',
        size: 21, // 10.5pt
        color: '0F172A'
      })
    ]
  }));
}

function createStyledTable(rowsData) {
  const tableRows = rowsData.map((row, rIdx) => {
    const isHeader = rIdx === 0;
    const cells = row.map(cellText => {
      return new TableCell({
        shading: {
          fill: isHeader ? 'E2E8F0' : (rIdx % 2 === 0 ? 'F8FAFC' : 'FFFFFF')
        },
        margins: { top: 120, bottom: 120, left: 160, right: 160 },
        children: [
          new Paragraph({
            alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
            spacing: { before: 40, after: 40, line: 260 },
            children: parseInlineFormatting(String(cellText || '').trim(), {
              size: isHeader ? 23 : 21,
              bold: isHeader,
              color: isHeader ? '0F172A' : COLOR_TEXT
            })
          })
        ]
      });
    });
    return new TableRow({ children: cells });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  });
}

async function buildDocx() {
  console.log('Đang chuyển đổi tệp Markdown sang Word DOCX...');

  const docChildren = [];

  // 1. BÌA TRANG TRỌNG
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({
          text: 'TRƯỜNG ĐẠI HỌC QUẢN LÝ VÀ CÔNG NGHỆ (UMT)',
          font: FONT_FAMILY,
          size: 28,
          bold: true,
          color: '1E293B'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 200 },
      children: [
        new TextRun({
          text: 'KHOA CÔNG NGHỆ THÔNG TIN & TRUYỀN THÔNG',
          font: FONT_FAMILY,
          size: 24,
          bold: true,
          color: '475569'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 120 },
      children: [
        new TextRun({
          text: 'BÁO CÁO ĐỒ ÁN TỐT NGHIỆP / NGHIÊN CỨU KHOA HỌC',
          font: FONT_FAMILY,
          size: 28,
          bold: true,
          color: COLOR_PRIMARY
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 360 },
      children: [
        new TextRun({
          text: 'ĐỀ TÀI:',
          font: FONT_FAMILY,
          size: 26,
          bold: true,
          color: COLOR_SECONDARY
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 800 },
      children: [
        new TextRun({
          text: 'NGHIÊN CỨU, THIẾT KẾ VÀ PHÁT TRIỂN HỆ THỐNG ĐÁNH GIÁ MÃ NGUỒN TỰ ĐỘNG KẾT HỢP LỘ TRÌNH ĐÀO TẠO THUẬT TOÁN ĐA NỀN TẢNG — UMTJUDGE',
          font: FONT_FAMILY,
          size: 34,
          bold: true,
          color: '0F172A'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 600, after: 80 },
      children: [
        new TextRun({ text: '• Sinh viên thực hiện: ', font: FONT_FAMILY, size: 26, bold: true }),
        new TextRun({ text: '[Họ và tên sinh viên]   —   MSSV: [Mã số sinh viên]', font: FONT_FAMILY, size: 26 })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 80, after: 80 },
      children: [
        new TextRun({ text: '• Chuyên ngành: ', font: FONT_FAMILY, size: 26, bold: true }),
        new TextRun({ text: 'Kỹ thuật Phần mềm / Công nghệ Thông tin', font: FONT_FAMILY, size: 26 })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 80, after: 400 },
      children: [
        new TextRun({ text: '• Giảng viên hướng dẫn: ', font: FONT_FAMILY, size: 26, bold: true }),
        new TextRun({ text: '[Học hàm, Học vị, Họ tên GVHD]', font: FONT_FAMILY, size: 26 })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 100 },
      children: [
        new TextRun({
          text: 'Thành phố Hồ Chí Minh, Năm 2026',
          font: FONT_FAMILY,
          size: 24,
          italics: true,
          color: COLOR_MUTED
        })
      ],
      pageBreakBefore: false
    })
  );

  // Thêm ngắt trang sau bìa
  docChildren.push(new Paragraph({ children: [], pageBreakBefore: true }));

  // Parse nội dung Markdown
  const lines = mdContent.split('\n');
  let inCodeBlock = false;
  let codeBuffer = [];
  let inTable = false;
  let tableBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        const codeParas = createCodeBlock(codeBuffer.join('\n'));
        docChildren.push(...codeParas);
        codeBuffer = [];
      } else {
        inCodeBlock = true;
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Check tables
    if (line.startsWith('|') && line.endsWith('|')) {
      // Bỏ qua dòng phân cách |:---|:---:|
      if (line.includes('---')) {
        continue;
      }
      const cols = line.split('|').slice(1, -1).map(c => c.trim().replace(/<br>/g, '\n').replace(/\*\*/g, '').replace(/\$/g, ''));
      if (!inTable) {
        inTable = true;
        tableBuffer = [];
      }
      tableBuffer.push(cols);
      continue;
    } else if (inTable) {
      inTable = false;
      if (tableBuffer.length > 0) {
        docChildren.push(createStyledTable(tableBuffer));
        docChildren.push(new Paragraph({ spacing: { before: 100, after: 100 } }));
        tableBuffer = [];
      }
    }

    // Bỏ qua tiêu đề bìa đầu file Markdown vì đã vẽ trang bìa riêng
    if (line.startsWith('# TRƯỜNG') || line.startsWith('## KHOA') || line.startsWith('# BÁO CÁO') || line.startsWith('### ĐỀ TÀI:') || line.startsWith('* **Sinh viên') || line.startsWith('* **Mã số') || line.startsWith('* **Ngành') || line.startsWith('* **Giảng viên') || line.startsWith('* **Năm học')) {
      continue;
    }

    // Headings
    if (line.startsWith('# CHƯƠNG')) {
      docChildren.push(createHeading1(line.replace(/^#\s*/, '')));
      continue;
    }
    if (line.startsWith('## TÓM TẮT') || line.startsWith('## MỤC LỤC') || line.startsWith('## TÀI LIỆU')) {
      docChildren.push(createHeading1(line.replace(/^##\s*/, '')));
      continue;
    }
    if (line.startsWith('### ')) {
      docChildren.push(createHeading2(line.replace(/^###\s*/, '')));
      continue;
    }
    if (line.startsWith('#### ')) {
      docChildren.push(createHeading3(line.replace(/^####\s*/, '')));
      continue;
    }

    // Bullet points
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const rawBullet = line.substring(2);
      docChildren.push(new Paragraph({
        bullet: { level: 0 },
        spacing: { before: 40, after: 40, line: 300 },
        children: parseInlineFormatting(rawBullet)
      }));
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const numPrefix = line.match(/^\d+\.\s*/)[0];
      const rawNumbered = line.substring(numPrefix.length);
      docChildren.push(new Paragraph({
        spacing: { before: 50, after: 50, line: 300 },
        children: [
          new TextRun({
            text: numPrefix,
            font: FONT_FAMILY,
            size: 26,
            bold: true,
            color: COLOR_SECONDARY
          }),
          ...parseInlineFormatting(rawNumbered)
        ]
      }));
      continue;
    }

    // Horizontal line
    if (line === '---' || line === '***') {
      continue;
    }

    // Normal paragraph
    if (line.length > 0) {
      docChildren.push(createPara(line));
    }
  }

  // Kết thúc nếu còn bảng
  if (inTable && tableBuffer.length > 0) {
    docChildren.push(createStyledTable(tableBuffer));
  }

  // Tạo tài liệu DOCX với header và footer
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch = 2.54 cm
              bottom: 1440,
              left: 1700,   // ~3 cm đóng gáy
              right: 1440
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: 'Đồ Án Tốt Nghiệp — UMTJudge: Hệ Thống Đánh Giá Tự Động & Lộ Trình Thuật Toán',
                    font: FONT_FAMILY,
                    size: 18, // 9pt
                    italics: true,
                    color: COLOR_MUTED
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: ['Trang ', PageNumber.CURRENT, ' / ', PageNumber.TOTAL_PAGES],
                    font: FONT_FAMILY,
                    size: 20,
                    color: COLOR_MUTED
                  })
                ]
              })
            ]
          })
        },
        children: docChildren
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outDocxPath, buffer);
  console.log(`✓ Đã tạo thành công tệp Microsoft Word: ${outDocxPath}`);
}

buildDocx().catch(err => {
  console.error('Lỗi xuất file docx:', err);
  process.exit(1);
});
