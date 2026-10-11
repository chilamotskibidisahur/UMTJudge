/**
 * MATH & LATEX FORMATTER FOR UMTJUDGE / CHAUCAOJUDGE
 * Parses mathematical LaTeX expressions, symbols, and formulas into clean,
 * accessible HTML with proper sub/superscripts, fractions, roots, and Greek symbols.
 */

// Helper to match balanced curly braces: \cmd{arg1}{arg2}...
function replaceBalancedCommand(
  str: string,
  cmd: string,
  callback: (args: string[]) => string
): string {
  let idx = 0;
  while ((idx = str.indexOf(cmd)) !== -1) {
    let p = idx + cmd.length;
    while (p < str.length && /\s/.test(str[p])) p++;
    if (str[p] !== '{') {
      // Single character or word argument, e.g. \sqrt 2
      const m = str.substring(p).match(/^([a-zA-Z0-9]+)/);
      if (m) {
        const repl = callback([m[1]]);
        str = str.substring(0, idx) + repl + str.substring(p + m[1].length);
      } else {
        break;
      }
      continue;
    }
    const args: string[] = [];
    let failed = false;
    while (p < str.length && str[p] === '{') {
      let depth = 1;
      const start = p + 1;
      p++;
      while (p < str.length && depth > 0) {
        if (str[p] === '{') depth++;
        else if (str[p] === '}') depth--;
        p++;
      }
      if (depth !== 0) {
        failed = true;
        break;
      }
      args.push(str.substring(start, p - 1));
      while (p < str.length && /\s/.test(str[p])) p++;
    }
    if (failed || args.length === 0) break;
    const repl = callback(args);
    str = str.substring(0, idx) + repl + str.substring(p);
  }
  return str;
}

/**
 * Converts raw LaTeX mathematical expressions to clean HTML.
 */
export function cleanMathToHtml(raw: string): string {
  if (!raw) return '';
  let s = raw.trim();

  // 1. Balanced-brace composite commands
  // \frac{num}{den}
  s = replaceBalancedCommand(s, '\\frac', (args) => {
    const num = cleanMathToHtml(args[0]);
    const den = cleanMathToHtml(args[1] || '1');
    const numWrapped = num.includes(' ') && !num.startsWith('(') ? `(${num})` : num;
    const denWrapped = den.includes(' ') && !den.startsWith('(') ? `(${den})` : den;
    return `${numWrapped} / ${denWrapped}`;
  });

  // \sqrt{expr} or \sqrt[n]{expr}
  s = replaceBalancedCommand(s, '\\sqrt', (args) => {
    const inner = cleanMathToHtml(args[0]);
    return `√(${inner})`;
  });

  // \binom{n}{k}
  s = replaceBalancedCommand(s, '\\binom', (args) => {
    return `C(${cleanMathToHtml(args[0])}, ${cleanMathToHtml(args[1])})`;
  });

  // \text{...} or \mathrm{...}
  s = replaceBalancedCommand(s, '\\text', (args) => ` ${args[0]} `);
  s = replaceBalancedCommand(s, '\\mathrm', (args) => ` ${args[0]} `);
  s = replaceBalancedCommand(s, '\\mathbf', (args) => ` ${args[0]} `);

  // 2. Delimiters, brackets, floor & ceiling
  s = s.replace(/\\left\\lfloor|\\lfloor/g, '⌊')
       .replace(/\\right\\rfloor|\\rfloor/g, '⌋')
       .replace(/\\left\\lceil|\\lceil/g, '⌈')
       .replace(/\\right\\rceil|\\rceil/g, '⌉')
       .replace(/\\left\(/g, '(')
       .replace(/\\right\)/g, ')')
       .replace(/\\left\[/g, '[')
       .replace(/\\right\]/g, ']')
       .replace(/\\left\\{/g, '{')
       .replace(/\\right\\}/g, '}')
       .replace(/\\left\||\\right\|/g, '|')
       .replace(/\\left\.|\\right\./g, '');

  // 3. Greek & Special Math Symbols (lookahead (?![a-zA-Z]) to preserve subscripts like \prod_i)
  s = s.replace(/\\prod(?![a-zA-Z])/g, '∏')
       .replace(/\\sum(?![a-zA-Z])/g, '∑')
       .replace(/\\int(?![a-zA-Z])/g, '∫')
       .replace(/\\sigma(?![a-zA-Z])/g, 'σ')
       .replace(/\\Sigma(?![a-zA-Z])/g, 'Σ')
       .replace(/\\phi(?![a-zA-Z])|\\varphi(?![a-zA-Z])/g, 'φ')
       .replace(/\\Phi(?![a-zA-Z])/g, 'Φ')
       .replace(/\\alpha(?![a-zA-Z])/g, 'α')
       .replace(/\\beta(?![a-zA-Z])/g, 'β')
       .replace(/\\gamma(?![a-zA-Z])/g, 'γ')
       .replace(/\\delta(?![a-zA-Z])/g, 'δ')
       .replace(/\\Delta(?![a-zA-Z])/g, 'Δ')
       .replace(/\\theta(?![a-zA-Z])/g, 'θ')
       .replace(/\\lambda(?![a-zA-Z])/g, 'λ')
       .replace(/\\mu(?![a-zA-Z])/g, 'μ')
       .replace(/\\pi(?![a-zA-Z])/g, 'π')
       .replace(/\\omega(?![a-zA-Z])/g, 'ω')
       .replace(/\\Omega(?![a-zA-Z])/g, 'Ω')
       .replace(/\\infty(?![a-zA-Z])/g, '∞');

  // 4. Operators, relations & notation
  s = s.replace(/\\pmod\s*\{([^}]+)\}/g, ' (mod $1)')
       .replace(/\\pmod\s*([a-zA-Z0-9_+^]+)/g, ' (mod $1)')
       .replace(/\\bmod(?![a-zA-Z])/g, ' mod ')
       .replace(/\\gcd(?![a-zA-Z])/g, 'gcd')
       .replace(/\\lcm(?![a-zA-Z])/g, 'lcm')
       .replace(/\\log(?![a-zA-Z])/g, 'log')
       .replace(/\\min(?![a-zA-Z])/g, 'min')
       .replace(/\\max(?![a-zA-Z])/g, 'max')
       .replace(/\\cdot(?![a-zA-Z])/g, ' × ')
       .replace(/\\times(?![a-zA-Z])/g, ' × ')
       .replace(/\\le(?![a-zA-Z])|\\leq(?![a-zA-Z])/g, ' ≤ ')
       .replace(/\\ge(?![a-zA-Z])|\\geq(?![a-zA-Z])/g, ' ≥ ')
       .replace(/\\ne(?![a-zA-Z])|\\neq(?![a-zA-Z])/g, ' ≠ ')
       .replace(/\\equiv(?![a-zA-Z])/g, ' ≡ ')
       .replace(/\\approx(?![a-zA-Z])/g, ' ≈ ')
       .replace(/\\pm(?![a-zA-Z])/g, ' ± ')
       .replace(/\\mp(?![a-zA-Z])/g, ' ∓ ')
       .replace(/\\dots(?![a-zA-Z])|\\ldots(?![a-zA-Z])|\\cdots(?![a-zA-Z])/g, '…')
       .replace(/\\to(?![a-zA-Z])|\\rightarrow(?![a-zA-Z])/g, ' → ')
       .replace(/\\gets(?![a-zA-Z])|\\leftarrow(?![a-zA-Z])/g, ' ← ')
       .replace(/\\in(?![a-zA-Z])/g, ' ∈ ')
       .replace(/\\notin(?![a-zA-Z])/g, ' ∉ ')
       .replace(/\\subset(?![a-zA-Z])/g, ' ⊂ ')
       .replace(/\\cup(?![a-zA-Z])/g, ' ∪ ')
       .replace(/\\cap(?![a-zA-Z])/g, ' ∩ ');

  // 5. Subscripts & superscripts
  // Braced subscripts & superscripts: ^{...} và _{...}
  while (/\^\{([^}]+)\}/.test(s)) {
    s = s.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
  }
  while (/_\{([^}]+)\}/.test(s)) {
    s = s.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
  }

  // Single word/char/number subscripts & superscripts
  s = s.replace(/\^([a-zA-Z0-9∞]+)/g, '<sup>$1</sup>');
  s = s.replace(/_([a-zA-Z0-9∞]+)/g, '<sub>$1</sub>');

  // 6. Clean remaining stray backslashes and commands
  s = s.replace(/\\([a-zA-Z]+)/g, '$1');
  s = s.replace(/\\/g, '');

  // Clean extra spaces
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

/**
 * Replaces standalone loose LaTeX symbols outside of $ blocks
 */
export function cleanLooseMathSymbols(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\le(?![a-zA-Z])|\\leq(?![a-zA-Z])/g, '≤')
    .replace(/\\ge(?![a-zA-Z])|\\geq(?![a-zA-Z])/g, '≥')
    .replace(/\\times(?![a-zA-Z])/g, '×')
    .replace(/\\cdot(?![a-zA-Z])/g, '×')
    .replace(/\\ne(?![a-zA-Z])|\\neq(?![a-zA-Z])/g, '≠')
    .replace(/\\equiv(?![a-zA-Z])/g, '≡')
    .replace(/\\approx(?![a-zA-Z])/g, '≈')
    .replace(/\\pm(?![a-zA-Z])/g, '±')
    .replace(/\\dots(?![a-zA-Z])|\\ldots(?![a-zA-Z])/g, '…')
    .replace(/\\to(?![a-zA-Z])|\\rightarrow(?![a-zA-Z])/g, '→')
    .replace(/\\sigma(?![a-zA-Z])/g, 'σ')
    .replace(/\\prod(?![a-zA-Z])/g, '∏')
    .replace(/\\sum(?![a-zA-Z])/g, '∑')
    .replace(/\\infty(?![a-zA-Z])/g, '∞');
}

/**
 * Formats a block of text/HTML containing $...$ or $$...$$ math blocks.
 * Wraps math expressions in problem-math-chip spans with proper styling.
 */
export function formatMathHtml(raw: string): string {
  if (!raw) return '';
  let s = raw;

  // 1. Double dollar $$...$$ display math
  s = s.replace(/\$\$([^$]+)\$\$/g, (_match, mathContent) => {
    const formatted = cleanMathToHtml(mathContent);
    return `<div class="problem-math-block" style="display:block; text-align:center; margin:8px 0; font-family:'JetBrains Mono',Consolas,monospace; color:var(--accent-cyan,#38bdf8); background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.2); padding:6px 12px; border-radius:6px; font-weight:600; font-size:0.95em;">${formatted}</div>`;
  });

  // 2. Single dollar $...$ inline math
  s = s.replace(/\$([^$]+)\$/g, (_match, mathContent) => {
    const formatted = cleanMathToHtml(mathContent);
    return `<span class="problem-math-chip" style="display:inline-block; font-family:'JetBrains Mono',Consolas,monospace; color:var(--accent-cyan,#38bdf8); background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.25); padding:1px 6px; border-radius:4px; font-weight:600; font-size:0.92em; margin:0 2px; vertical-align:baseline;">${formatted}</span>`;
  });

  // 3. Clean loose LaTeX outside math blocks
  return cleanLooseMathSymbols(s);
}
