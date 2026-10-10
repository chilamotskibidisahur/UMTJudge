const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
let PDFParse;
try {
  const pdfModule = require('pdf-parse');
  PDFParse = pdfModule.PDFParse || pdfModule;
} catch (e) {
  PDFParse = null;
}
let mammoth;
try {
  mammoth = require('mammoth');
} catch (e) {
  mammoth = null;
}

/**
 * Extract raw layout text from a file (PDF or DOCX or TXT) or raw buffer/string
 */
async function extractRawText(options = {}) {
  const { filePath, buffer, rawText, fileName = '' } = options;

  if (rawText && typeof rawText === 'string') {
    return rawText;
  }

  const effectiveName = fileName || (filePath ? path.basename(filePath) : '');
  const ext = path.extname(effectiveName).toLowerCase();
  const fileBuf = buffer || (filePath && fs.existsSync(filePath) ? fs.readFileSync(filePath) : null);

  if (!fileBuf) {
    return '';
  }

  if (ext === '.pdf') {
    // Try pdftotext -layout first if available on system
    if (filePath && fs.existsSync(filePath)) {
      try {
        const txt = execFileSync('pdftotext', ['-layout', filePath, '-'], { encoding: 'utf8' });
        if (txt && txt.trim().length > 50) return txt;
      } catch (e) {}
    }

    // Pure JS PDFParse
    if (PDFParse) {
      try {
        const parser = new PDFParse(new Uint8Array(fileBuf));
        const res = await parser.getText();
        return res.text || '';
      } catch (e) {
        console.warn('PDFParse error:', e.message);
      }
    }
  }

  if ((ext === '.docx' || ext === '.doc') && mammoth) {
    try {
      const res = await mammoth.extractRawText({ buffer: fileBuf });
      return res.value || '';
    } catch (e) {
      console.warn('Mammoth docx parse error:', e.message);
    }
  }

  return fileBuf.toString('utf8');
}

/**
 * Standardize mathematical and Vietnamese typography to KaTeX / Markdown
 */
function normalizeMath(text) {
  if (!text) return '';
  let res = text;

  // Remove page markers
  res = res.replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '');
  res = res.replace(/\n\s*(\d+)\s*\n(?=\s*(?:Bài|Subtask|Ví dụ|[A-ZÀ-Ỹ]))/gi, '\n');

  // Math symbols
  res = res.replace(/≤/g, ' \\le ');
  res = res.replace(/≥/g, ' \\ge ');
  res = res.replace(/≠/g, ' \\ne ');
  res = res.replace(/×/g, ' \\times ');
  res = res.replace(/·/g, ' \\cdot ');

  // Superscripts
  res = res.replace(/10¹⁰/g, '10^{10}');
  res = res.replace(/10⁹/g, '10^9');
  res = res.replace(/10⁶/g, '10^6');
  res = res.replace(/10⁵/g, '10^5');
  res = res.replace(/10⁴/g, '10^4');
  res = res.replace(/10³/g, '10^3');
  res = res.replace(/10²/g, '10^2');
  res = res.replace(/a²/g, 'a^2');
  res = res.replace(/b²/g, 'b^2');
  res = res.replace(/c²/g, 'c^2');

  // Subscripts
  res = res.replace(/aᵢ₋₁/g, 'a_{i-1}');
  res = res.replace(/sᵢ₋₁/g, 's_{i-1}');
  res = res.replace(/sᵢ₊₁/g, 's_{i+1}');
  res = res.replace(/aᵢ/g, 'a_i');
  res = res.replace(/bᵢ/g, 'b_i');
  res = res.replace(/sᵢ/g, 's_i');
  res = res.replace(/sⱼ/g, 's_j');
  res = res.replace(/sₖ/g, 's_k');
  res = res.replace(/dᵢ/g, 'd_i');
  res = res.replace(/pᵢ/g, 'p_i');
  res = res.replace(/xᵢ/g, 'x_i');
  res = res.replace(/yᵢ/g, 'y_i');
  res = res.replace(/aₙ/g, 'a_n');
  res = res.replace(/bₘ/g, 'b_m');
  res = res.replace(/a₁/g, 'a_1');
  res = res.replace(/a₂/g, 'a_2');
  res = res.replace(/b₁/g, 'b_1');
  res = res.replace(/b₂/g, 'b_2');

  return res;
}

/**
 * Extract Sample Input/Output from Example table text
 */
function parseSampleTests(exampleText, probCode) {
  if (!exampleText) return [];
  const samples = [];
  const lines = exampleText.split('\n').map(l => l.trimEnd());

  // Find header line of example table
  const headerIdx = lines.findIndex(l => 
    l.includes('.INP') || l.includes('INP') || l.includes('Dữ liệu vào')
  );

  if (headerIdx === -1) {
    return samples;
  }

  const tableLines = lines.slice(headerIdx + 1);
  let currentInput = [];
  let currentOutput = [];
  let currentExplanation = [];
  let inTest = false;

  for (const line of tableLines) {
    if (!line.trim()) continue;
    if (/^Subtask/i.test(line.trim())) break;

    const parts = line.trim().split(/\s{2,}/);
    if (parts.length >= 2) {
      if (inTest && currentInput.length > 0 && currentOutput.length > 0) {
        samples.push({
          input: currentInput.join('\n').trim(),
          output: currentOutput.join('\n').trim(),
          explanation: currentExplanation.join('\n').trim()
        });
        currentInput = [];
        currentOutput = [];
        currentExplanation = [];
      }
      inTest = true;
      currentInput.push(parts[0].trim());
      currentOutput.push(parts[1].trim());
      if (parts[2]) currentExplanation.push(parts[2].trim());
    } else if (inTest) {
      const single = line.trim();
      currentExplanation.push(single);
    }
  }

  if (inTest && currentInput.length > 0) {
    samples.push({
      input: currentInput.join('\n').trim(),
      output: currentOutput.join('\n').trim(),
      explanation: currentExplanation.join('\n').trim()
    });
  }

  // Fallback if no multi-space column detected
  if (samples.length === 0 && tableLines.length > 0) {
    const rawNonEmpty = tableLines.filter(l => l.trim() && !/^Subtask/i.test(l.trim()));
    if (rawNonEmpty.length >= 2) {
      samples.push({
        input: rawNonEmpty[0].trim(),
        output: rawNonEmpty[1].trim(),
        explanation: rawNonEmpty.slice(2).join('\n').trim()
      });
    }
  }

  return samples;
}

/**
 * Format description into clean Markdown headings
 */
function formatDescriptionMarkdown(desc, subtasks, samples, meta) {
  let md = desc.trim();

  // Emphasize key sections
  md = md.replace(/(?:^|\n)\s*Yêu cầu:\s*/gi, '\n\n### Yêu cầu\n');
  md = md.replace(/(?:^|\n)\s*Dữ liệu vào:\s*/gi, '\n\n### Dữ liệu vào\n');
  md = md.replace(/(?:^|\n)\s*Dữ liệu ra:\s*/gi, '\n\n### Dữ liệu ra\n');

  if (subtasks && subtasks.trim()) {
    md += '\n\n### Giới hạn (Subtasks)\n' + subtasks.trim();
  }

  if (samples && samples.length > 0) {
    md += '\n\n### Ví dụ\n';
    samples.forEach((s, idx) => {
      md += `\n**Ví dụ ${idx + 1}:**\n`;
      md += `* \`${meta.inputFile}\`:\n\`\`\`\n${s.input}\n\`\`\`\n`;
      md += `* \`${meta.outputFile}\`:\n\`\`\`\n${s.output}\n\`\`\`\n`;
      if (s.explanation) {
        md += `* *Giải thích*: ${s.explanation}\n`;
      }
    });
  }

  return md;
}

/**
 * Parse inside a problem block
 */
function parseProblemContent(block, meta = {}) {
  let text = block;

  // Header extraction if meta is incomplete
  const pMatch = text.match(/Bài\s*(\d+)[\.:]\s*([^\n\(\r]+)(?:\(([\d,\.]+)\s*điểm\))?/i);
  const order = meta.order || (pMatch ? parseInt(pMatch[1], 10) : 1);
  const rawTitle = meta.title || (pMatch ? pMatch[2].trim() : `Bài ${order}`);
  const points = meta.points !== undefined ? meta.points : (pMatch && pMatch[3] ? parseFloat(pMatch[3].replace(',', '.')) : 5.0);

  // Strip header line
  text = text.replace(/^Bài\s*\d+[\.:][^\n]*\n?/i, '').trim();

  // Detect code from file .INP/.OUT mention in text if meta.code is missing
  let detectedCode = meta.code;
  if (!detectedCode) {
    const inpMatch = text.match(/([A-Za-z0-9_]+)\.INP/i);
    if (inpMatch) {
      detectedCode = inpMatch[1].toUpperCase();
    } else {
      detectedCode = `BAI${order}`;
    }
  }

  const inputFile = meta.inputFile || `${detectedCode}.INP`;
  const outputFile = meta.outputFile || `${detectedCode}.OUT`;

  // Find subsections
  const subtaskIdx = text.search(/(?:^|\n)\s*(?:Subtask\s*\d|Subtask\s+Điểm|\bSubtasks?\b)/i);
  const exampleIdx = text.search(/(?:^|\n)\s*Ví dụ\s*:/i);

  let descriptionArea = text;
  let subtaskArea = '';
  let exampleArea = '';

  const cutIdx = (subtaskIdx !== -1 && exampleIdx !== -1)
    ? Math.min(subtaskIdx, exampleIdx)
    : (subtaskIdx !== -1 ? subtaskIdx : (exampleIdx !== -1 ? exampleIdx : -1));

  if (cutIdx !== -1) {
    descriptionArea = text.slice(0, cutIdx).trim();
    const remaining = text.slice(cutIdx);
    
    if (subtaskIdx !== -1 && exampleIdx !== -1) {
      if (subtaskIdx < exampleIdx) {
        subtaskArea = text.slice(subtaskIdx, exampleIdx).trim();
        exampleArea = text.slice(exampleIdx).trim();
      } else {
        exampleArea = text.slice(exampleIdx, subtaskIdx).trim();
        subtaskArea = text.slice(subtaskIdx).trim();
      }
    } else if (subtaskIdx !== -1) {
      subtaskArea = remaining;
    } else if (exampleIdx !== -1) {
      exampleArea = remaining;
    }
  }

  const samples = parseSampleTests(exampleArea, detectedCode);
  const markdownDescription = formatDescriptionMarkdown(descriptionArea, subtaskArea, samples, {
    inputFile,
    outputFile
  });

  const sampleCode = `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    freopen("${inputFile}", "r", stdin);
    freopen("${outputFile}", "w", stdout);

    // TODO: Viết thuật toán cho bài ${rawTitle} (${detectedCode}) tại đây
    return 0;
}
`;

  return {
    order,
    code: detectedCode,
    title: rawTitle,
    points,
    timeLimit: 1000,
    memoryLimit: 256,
    difficulty: order <= 1 ? 'Dễ' : (order <= 3 ? 'Trung bình' : 'Khó'),
    description: markdownDescription,
    inputFile,
    outputFile,
    samples,
    sampleCode
  };
}

/**
 * Parse an entire exam file or text (Contest + Overview table + Problems)
 */
async function parseExam(options = {}) {
  const rawText = await extractRawText(options);
  const normalizedText = normalizeMath(rawText);

  // 1. Contest info
  const contest = {
    title: 'KỲ THI CHỌN HỌC SINH GIỎI',
    durationMinutes: 180,
    totalScore: 20,
    examCode: ''
  };

  const titleMatch = normalizedText.match(/(KỲ THI CHỌN HỌC SINH GIỎI[^\n]+(?:\n[^\n]+)?)/i);
  if (titleMatch) {
    contest.title = titleMatch[1].replace(/\s+/g, ' ').trim();
  }

  const durationMatch = normalizedText.match(/Thời gian:\s*(\d+)\s*phút/i);
  if (durationMatch) {
    contest.durationMinutes = parseInt(durationMatch[1], 10);
  }

  const codeMatch = normalizedText.match(/Mã đề:\s*([A-Za-z0-9_-]+)/i);
  if (codeMatch) {
    contest.examCode = codeMatch[1].trim();
  }

  // 2. Table TỔNG QUAN ĐỀ THI
  const overviewMap = new Map();
  const overviewRegex = /(\d+)\s+([^\n\r]+?)\s+([A-Za-z0-9_]+)\.\*\s+([A-Za-z0-9_]+)\.INP\s+([A-Za-z0-9_]+)\.OUT/gi;
  let match;
  while ((match = overviewRegex.exec(normalizedText)) !== null) {
    const num = parseInt(match[1], 10);
    overviewMap.set(num, {
      order: num,
      title: match[2].trim(),
      code: match[3].trim().toUpperCase(),
      inputFile: `${match[4].trim().toUpperCase()}.INP`,
      outputFile: `${match[5].trim().toUpperCase()}.OUT`
    });
  }

  // 3. Problem splits
  const problemSplits = [];
  const probHeaderRegex = /(?:^|\n)\s*(Bài\s*(\d+)[\.:]\s*([^\n\(\r]+)(?:\(([\d,\.]+)\s*điểm\))?)/gi;
  let pMatch;
  const indices = [];

  while ((pMatch = probHeaderRegex.exec(normalizedText)) !== null) {
    indices.push({
      fullHeader: pMatch[1],
      order: parseInt(pMatch[2], 10),
      rawTitle: pMatch[3].trim(),
      points: pMatch[4] ? parseFloat(pMatch[4].replace(',', '.')) : 5.0,
      index: pMatch.index
    });
  }

  for (let i = 0; i < indices.length; i++) {
    const current = indices[i];
    const nextIndex = (i + 1 < indices.length) ? indices[i + 1].index : normalizedText.length;
    let block = normalizedText.slice(current.index, nextIndex).trim();

    if (i === indices.length - 1) {
      block = block.replace(/-+\s*HẾT\s*-+[\s\S]*$/i, '').trim();
    }

    const ov = overviewMap.get(current.order) || {};
    const code = ov.code || `BAI${current.order}`;
    const title = ov.title || current.rawTitle || `Bài ${current.order}`;
    const inputFile = ov.inputFile || `${code}.INP`;
    const outputFile = ov.outputFile || `${code}.OUT`;

    const problem = parseProblemContent(block, {
      order: current.order,
      title,
      code,
      points: current.points,
      inputFile,
      outputFile
    });

    problemSplits.push(problem);
  }

  if (problemSplits.length > 0) {
    contest.totalScore = problemSplits.reduce((acc, p) => acc + (p.points || 0), 0);
  }

  return {
    contest,
    problems: problemSplits
  };
}

/**
 * Parse a single problem (when user imports or pastes a single problem statement)
 */
async function parseSingleProblem(options = {}) {
  const rawText = await extractRawText(options);
  const normalizedText = normalizeMath(rawText);

  // If text contains multiple problems, we can parse as exam and return the first one
  if (/TỔNG QUAN ĐỀ THI/i.test(normalizedText) || (normalizedText.match(/Bài\s*\d+[\.:]/gi) || []).length > 1) {
    const exam = await parseExam({ rawText: normalizedText });
    return exam.problems[0] || null;
  }

  return parseProblemContent(normalizedText);
}

module.exports = {
  extractRawText,
  normalizeMath,
  parseExam,
  parseSingleProblem
};
