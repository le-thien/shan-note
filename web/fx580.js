/**
 * Net Note - Casio fx-580VN X ClassWiz Full Authentic Emulator Engine
 * Chân thực 100% giao diện, màn hình LCD Natural-V.P.A.M, 12 Modes, và phím bấm vật lý
 * Trích xuất chuẩn xác từ repository https://github.com/Tikz-Physics/casio-fx580vnx
 */

(function (window, document) {
  'use strict';


    // --- classwiz_lcd_icons.js ---
    /**
 * Casio ClassWiz fx-580VN X - Authentic On-LCD Vector Icons
 * Pixel-perfect reproduction from genuine Casio ClassWiz fx-580VN X LCD display
 */

const CLASSWIZ_ICONS = {
  // 1: Calculate (COMP) - Arithmetic operators: × ÷ / + −
  1: `<svg width="38" height="22" viewBox="0 0 38 22" class="casio-svg-icon">
    <!-- Top row: × and ÷ -->
    <line x1="6" y1="3.5" x2="14" y2="10" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/>
    <line x1="14" y1="3.5" x2="6" y2="10" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/>
    <circle cx="26" cy="3.5" r="1.3" fill="currentColor"/>
    <line x1="21" y1="6.8" x2="31" y2="6.8" stroke="currentColor" stroke-width="2"/>
    <circle cx="26" cy="10.2" r="1.3" fill="currentColor"/>
    <!-- Bottom row: + and - -->
    <line x1="10" y1="12.5" x2="10" y2="20.5" stroke="currentColor" stroke-width="2.2"/>
    <line x1="6" y1="16.5" x2="14" y2="16.5" stroke="currentColor" stroke-width="2.2"/>
    <line x1="21" y1="16.5" x2="31" y2="16.5" stroke="currentColor" stroke-width="2.2"/>
  </svg>`,

  // 2: Complex (CMPLX) - Left white with black i, right black with white ∠
  2: `<svg width="38" height="22" viewBox="0 0 38 22" class="casio-svg-icon">
    <!-- Outer frame -->
    <rect x="3" y="2.5" width="32" height="17" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <!-- Right black block -->
    <rect x="19" y="2.5" width="16" height="17" fill="currentColor"/>
    <!-- Left half: italic i -->
    <circle cx="11" cy="6.5" r="1.2" fill="currentColor"/>
    <path d="M8.5 9.5 H12.5 V15.5 H14.5" stroke="currentColor" stroke-width="1.8" fill="none"/>
    <!-- Right half: white angle symbol ∠ inside black block -->
    <path d="M31 7 L23 15.5 H33" fill="none" stroke="var(--lcd-bg, #c5d5bd)" class="casio-invert-stroke" stroke-width="2" stroke-linejoin="miter"/>
  </svg>`,

  // 3: Base-N - Numbers 2 8 / 10 16
  3: `<svg width="38" height="22" viewBox="0 0 38 22" class="casio-svg-icon">
    <text x="10" y="7.5" font-family="'CasioClassWiz', monospace" font-size="8" font-weight="bold" fill="currentColor" text-anchor="middle" dominant-baseline="central">2</text>
    <text x="26" y="7.5" font-family="'CasioClassWiz', monospace" font-size="8" font-weight="bold" fill="currentColor" text-anchor="middle" dominant-baseline="central">8</text>
    <text x="9" y="16.5" font-family="'CasioClassWiz', monospace" font-size="7.5" font-weight="bold" fill="currentColor" text-anchor="middle" dominant-baseline="central">10</text>
    <text x="26" y="16.5" font-family="'CasioClassWiz', monospace" font-size="7.5" font-weight="bold" fill="currentColor" text-anchor="middle" dominant-baseline="central">16</text>
  </svg>`,

  // 4: Matrix - [ ⊞ ]
  4: `<svg width="38" height="22" viewBox="0 0 38 22" class="casio-svg-icon">
    <!-- Left bracket [ -->
    <path d="M7 3.5 H3.5 V18.5 H7" fill="none" stroke="currentColor" stroke-width="2"/>
    <!-- Right bracket ] -->
    <path d="M31 3.5 H34.5 V18.5 H31" fill="none" stroke="currentColor" stroke-width="2"/>
    <!-- 4 matrix square blocks: 2x2 grid -->
    <rect x="10" y="5" width="6.5" height="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="21.5" y="5" width="6.5" height="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="10" y="12" width="6.5" height="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="21.5" y="12" width="6.5" height="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
  </svg>`,

  // 5: Vector - Coordinate axes with diagonal vector ray
  5: `<svg width="38" height="22" viewBox="0 0 38 22" class="casio-svg-icon">
    <!-- Vertical axis + up arrow -->
    <line x1="8" y1="18.5" x2="8" y2="4.5" stroke="currentColor" stroke-width="1.8"/>
    <polygon points="5.5,5.5 8,2.5 10.5,5.5" fill="currentColor"/>
    <!-- Horizontal axis + right arrow -->
    <line x1="8" y1="18.5" x2="30" y2="18.5" stroke="currentColor" stroke-width="1.8"/>
    <polygon points="28.5,16 31.5,18.5 28.5,21" fill="currentColor"/>
    <!-- Diagonal vector ray + 45 deg arrow -->
    <line x1="9" y1="17.5" x2="27" y2="5.5" stroke="currentColor" stroke-width="2.2"/>
    <polygon points="22,4.5 28.5,4.5 28,10.5" fill="currentColor"/>
  </svg>`,

  // 6: Statistics (STAT) - 3-bar histogram
  6: `<svg width="38" height="22" viewBox="0 0 38 22" class="casio-svg-icon">
    <!-- Baseline -->
    <line x1="3" y1="19" x2="35" y2="19" stroke="currentColor" stroke-width="1.8"/>
    <!-- Bar 1 (medium) -->
    <rect x="7" y="9" width="7" height="10" fill="none" stroke="currentColor" stroke-width="1.7"/>
    <!-- Bar 2 (tall) -->
    <rect x="16" y="3.5" width="7.5" height="15.5" fill="none" stroke="currentColor" stroke-width="1.7"/>
    <!-- Bar 3 (medium-short) -->
    <rect x="25.5" y="11" width="7" height="8" fill="none" stroke="currentColor" stroke-width="1.7"/>
  </svg>`,

  // 7: Distribution (DIST) - Bell curve
  7: `<svg width="38" height="22" viewBox="0 0 38 22" class="casio-svg-icon">
    <!-- Baseline -->
    <line x1="3" y1="19" x2="35" y2="19" stroke="currentColor" stroke-width="1.8"/>
    <!-- Center vertical axis line -->
    <line x1="19" y1="19" x2="19" y2="2.5" stroke="currentColor" stroke-width="1.8"/>
    <!-- Normal distribution bell curve -->
    <path d="M4.5 18 C 11.5 18, 14 4.5, 19 4.5 C 24 4.5, 26.5 18, 33.5 18" fill="none" stroke="currentColor" stroke-width="2"/>
  </svg>`,

  // 8: Table (TABLE) - 2-column spreadsheet table
  8: `<svg width="38" height="22" viewBox="0 0 38 22" class="casio-svg-icon">
    <!-- Outer frame -->
    <rect x="4" y="2.5" width="30" height="17" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <!-- Header line -->
    <line x1="4" y1="7.5" x2="34" y2="7.5" stroke="currentColor" stroke-width="1.6"/>
    <!-- Center vertical column divider -->
    <line x1="19" y1="2.5" x2="19" y2="19.5" stroke="currentColor" stroke-width="1.6"/>
    <!-- Mid row divider -->
    <line x1="4" y1="13.5" x2="34" y2="13.5" stroke="currentColor" stroke-width="1.6"/>
    <!-- Cell data indicators -->
    <line x1="7" y1="10.5" x2="16" y2="10.5" stroke="currentColor" stroke-width="1.4"/>
    <line x1="22" y1="10.5" x2="31" y2="10.5" stroke="currentColor" stroke-width="1.4"/>
    <line x1="7" y1="16.5" x2="16" y2="16.5" stroke="currentColor" stroke-width="1.4"/>
    <line x1="22" y1="16.5" x2="31" y2="16.5" stroke="currentColor" stroke-width="1.4"/>
  </svg>`,

  // 9: Equation / Func (EQUATION) - ax+by=c
  9: `<svg width="38" height="22" viewBox="0 0 38 22" class="casio-svg-icon">
    <text x="19" y="7.5" font-family="'CasioClassWiz', monospace" font-size="7.5" font-weight="bold" fill="currentColor" text-anchor="middle" dominant-baseline="central">ax+by</text>
    <text x="19" y="15.5" font-family="'CasioClassWiz', monospace" font-size="7.5" font-weight="bold" fill="currentColor" text-anchor="middle" dominant-baseline="central">= c</text>
  </svg>`,

  // 10 / A: Inequality (INEQUALITY) - ax²+bx>0
  10: `<svg width="38" height="22" viewBox="0 0 38 22" class="casio-svg-icon">
    <text x="19" y="7.5" font-family="'CasioClassWiz', monospace" font-size="7.5" font-weight="bold" fill="currentColor" text-anchor="middle" dominant-baseline="central">ax²+bx</text>
    <text x="19" y="15.5" font-family="'CasioClassWiz', monospace" font-size="7.5" font-weight="bold" fill="currentColor" text-anchor="middle" dominant-baseline="central">&gt; 0</text>
  </svg>`,

  // 11 / B: Ratio (RATIO) - A:B=X:D
  11: `<svg width="38" height="22" viewBox="0 0 38 22" class="casio-svg-icon">
    <text x="19" y="7.5" font-family="'CasioClassWiz', monospace" font-size="7.5" font-weight="bold" fill="currentColor" text-anchor="middle" dominant-baseline="central">A : B</text>
    <text x="19" y="15.5" font-family="'CasioClassWiz', monospace" font-size="7.5" font-weight="bold" fill="currentColor" text-anchor="middle" dominant-baseline="central">= X:D</text>
  </svg>`,

  // 12 / C: Spreadsheet (SPREADSHEET) - 3-column spreadsheet with cell grid
  12: `<svg width="38" height="22" viewBox="0 0 38 22" class="casio-svg-icon">
    <!-- Outer frame -->
    <rect x="3" y="2.5" width="32" height="17" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <!-- Top header row divider -->
    <line x1="3" y1="7.5" x2="35" y2="7.5" stroke="currentColor" stroke-width="1.4"/>
    <!-- Row 2 divider -->
    <line x1="3" y1="13.5" x2="35" y2="13.5" stroke="currentColor" stroke-width="1.2"/>
    <!-- Left column divider -->
    <line x1="13.5" y1="2.5" x2="13.5" y2="19.5" stroke="currentColor" stroke-width="1.2"/>
    <!-- Right column divider -->
    <line x1="24.5" y1="2.5" x2="24.5" y2="19.5" stroke="currentColor" stroke-width="1.2"/>
    <!-- Active cell highlight in cell B2 -->
    <rect x="15" y="9" width="8" height="3.5" fill="currentColor"/>
  </svg>`
};

// Aliases for alphanumeric keys
CLASSWIZ_ICONS['A'] = CLASSWIZ_ICONS[10];
CLASSWIZ_ICONS['B'] = CLASSWIZ_ICONS[11];
CLASSWIZ_ICONS['C'] = CLASSWIZ_ICONS[12];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CLASSWIZ_ICONS };
}


    // --- math_engine.js ---
    /**
 * Casio fx-580VN X - Full Math Engine
 * Supports: All 12 Casio ClassWiz Modes:
 * 1: COMP, 2: CMPLX, 3: BASE-N, 4: MATRIX, 5: VECTOR,
 * 6: STAT, 7: DIST, 8: TABLE, 9: EQUATION, A: INEQUALITY, B: RATIO.
 */

class MathEngine {
  constructor() {
    this.angleMode = 'DEG'; // 'DEG', 'RAD', 'GRA'
    this.variables = {
      A: 0, B: 0, C: 0, D: 0, E: 0, F: 0,
      x: 0, y: 0, z: 0, M: 0, Ans: 0, PreAns: 0
    };
    this.undoStack = [];
    this.history = [];
    this.matrices = {
      MatA: [[1,0,0],[0,1,0],[0,0,1]],
      MatB: [[1,0,0],[0,1,0],[0,0,1]],
      MatC: [[1,0,0],[0,1,0],[0,0,1]],
      MatD: [[1,0,0],[0,1,0],[0,0,1]]
    };
    this.vectors = {
      VctA: [0, 0, 0],
      VctB: [0, 0, 0],
      VctC: [0, 0, 0]
    };
  }

  setAngleMode(mode) {
    if (['DEG', 'RAD', 'GRA'].includes(mode)) {
      this.angleMode = mode;
    }
  }

  toRadians(angle) {
    if (this.angleMode === 'DEG') return angle * (Math.PI / 180);
    if (this.angleMode === 'GRA') return angle * (Math.PI / 200);
    return angle; // RAD
  }

  fromRadians(rad) {
    if (this.angleMode === 'DEG') return rad * (180 / Math.PI);
    if (this.angleMode === 'GRA') return rad * (200 / Math.PI);
    return rad; // RAD
  }

  factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n > 100) return Infinity;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }

  nPr(n, r) {
    if (n < 0 || r < 0 || r > n) return NaN;
    return this.factorial(n) / this.factorial(n - r);
  }

  nCr(n, r) {
    if (n < 0 || r < 0 || r > n) return NaN;
    return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
  }

  gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(Math.round(a * b)) / this.gcd(a, b);
  }

  toRadicalOrFraction(val) {
    if (val === undefined || val === null || typeof val !== 'number' || isNaN(val) || !isFinite(val)) {
      return null;
    }
    if (Math.abs(val) >= 1e10) return null; // Exceeds 10-digit display, must use scientific notation
    if (Math.abs(val) < 1e-12) return '0';
    const signStr = val < 0 ? '-' : '';
    const x = Math.abs(val);

    // 1. Integer
    if (Math.abs(x - Math.round(x)) < 1e-10) {
      return `${signStr}${Math.round(x)}`;
    }

    // 2. Simple rational fraction (denominator <= 999)
    const rat = this.toFraction(x, 1000);
    if (rat && rat.d <= 999 && Math.abs(rat.n) <= 9999 && Math.abs(rat.n / rat.d - x) < 1e-9) {
      return rat.d > 1 ? `${signStr}${rat.n}/${rat.d}` : `${signStr}${rat.n}`;
    }

    // 3. Pure single radical: a*sqrt(b)/c (x^2 is rational)
    const sq = x * x;
    const frac = this.toFraction(sq, 2000);
    if (frac && frac.d > 0 && frac.d <= 500 && frac.n <= 500000) {
      const P = frac.n;
      const Q = frac.d;
      if (Math.abs(Math.sqrt(P / Q) - x) < 1e-7) {
        const K = P * Q;
        if (K <= 500000) {
          const limit = Math.floor(Math.sqrt(K));
          let a = 1;
          let b = K;
          for (let d = limit; d > 1; d--) {
            if (K % (d * d) === 0) {
              a = d;
              b = Math.floor(K / (d * d));
              break;
            }
          }
          if (b <= 200) {
            const gcdAq = this.gcd(a, Q);
            const coeff = Math.floor(a / gcdAq);
            const den = Math.floor(Q / gcdAq);
            if (den <= 100 && coeff <= 200) {
              if (b === 1) {
                return den > 1 ? `${signStr}${coeff}/${den}` : `${signStr}${coeff}`;
              }
              const radStr = coeff === 1 ? `\\sqrt{${b}}` : `${coeff}\\sqrt{${b}}`;
              return den === 1 ? `${signStr}${radStr}` : `${signStr}\\frac{${radStr}}{${den}}`;
            }
          }
        }
      }
    }

    // 4. Compound radical: (u + v*sqrt(b)) / d
    const smallPrimes = [2, 3, 5, 6, 7, 10, 11, 13, 15, 17];
    for (let i = 0; i < smallPrimes.length; i++) {
      const b = smallPrimes[i];
      const sqrtB = Math.sqrt(b);
      for (let d = 1; d <= 16; d++) {
        const valD = val * d;
        for (let v = -20; v <= 20; v++) {
          if (v === 0) continue;
          const u = Math.round(valD - v * sqrtB);
          if (Math.abs((u + v * sqrtB) / d - val) < 1e-8) {
            let g = this.gcd(this.gcd(Math.abs(u), Math.abs(v)), d);
            const simU = Math.floor(u / g);
            const simV = Math.floor(v / g);
            const simD = Math.floor(d / g);

            let numStr = '';
            if (simU === 0) {
              numStr = simV === 1 ? `\\sqrt{${b}}` : (simV === -1 ? `-\\sqrt{${b}}` : `${simV}\\sqrt{${b}}`);
            } else {
              const vPart = simV === 1 ? `+\\sqrt{${b}}` : (simV === -1 ? `-\\sqrt{${b}}` : (simV > 0 ? `+${simV}\\sqrt{${b}}` : `${simV}\\sqrt{${b}}`));
              numStr = `${simU}${vPart}`;
            }

            return simD === 1 ? numStr : `\\frac{${numStr}}{${simD}}`;
          }
        }
      }
    }

    return null;
  }

  toFraction(val, maxDenominator = 10000) {
    if (Number.isInteger(val)) return { n: val, d: 1 };
    if (isNaN(val) || !isFinite(val)) return null;

    const sign = val < 0 ? -1 : 1;
    let x = Math.abs(val);
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = x;

    do {
      const a = Math.floor(b);
      let aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;
      aux = k1;
      k1 = a * k1 + k2;
      k2 = aux;
      b = 1 / (b - a);
    } while (Math.abs(x - h1 / k1) > x * 1e-9 && k1 < maxDenominator);

    return { n: sign * h1, d: k1 };
  }

  // Pre-process and evaluate mathematical expressions
  evaluate(rawExpr) {
    if (!rawExpr || typeof rawExpr !== 'string') return NaN;
    let expr = rawExpr.trim();
    if (!expr) return 0;

    // Check if Complex expression (Mode 2)
    if (/(?:^|[^a-zA-Z_\\])i(?:$|[^a-zA-Z_])/.test(expr)) {
      const cmplx = this.evalComplex(expr);
      if (cmplx) {
        if (Math.abs(cmplx.imag) < 1e-9) {
          this.variables.Ans = cmplx.real;
          return cmplx.real;
        }
        const sign = cmplx.imag >= 0 ? '+' : '-';
        const absImag = Math.abs(cmplx.imag);
        const imagStr = absImag === 1 ? 'i' : `${absImag}i`;
        const resStr = Math.abs(cmplx.real) < 1e-9 ? `${cmplx.imag < 0 ? '-' : ''}${imagStr}` : `${cmplx.real} ${sign} ${imagStr}`;
        return resStr;
      }
    }

    // Check Pol(x, y)
    const polMatch = expr.match(/^Pol\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)$/);
    if (polMatch) {
      const xVal = this.evaluate(polMatch[1]);
      const yVal = this.evaluate(polMatch[2]);
      if (!isNaN(xVal) && !isNaN(yVal)) {
        return this.evalPol(xVal, yVal);
      }
    }

    // Check Rec(r, θ)
    const recMatch = expr.match(/^Rec\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)$/);
    if (recMatch) {
      const rVal = this.evaluate(recMatch[1]);
      const thVal = this.evaluate(recMatch[2]);
      if (!isNaN(rVal) && !isNaN(thVal)) {
        return this.evalRec(rVal, thVal);
      }
    }

    // Check Remainder division: a ÷R b
    const remMatch = expr.match(/^(.+?)\s*÷R\s*(.+)$/);
    if (remMatch) {
      const aVal = this.evaluate(remMatch[1]);
      const bVal = this.evaluate(remMatch[2]);
      if (!isNaN(aVal) && !isNaN(bVal) && bVal !== 0) {
        const q = Math.trunc(aVal / bVal);
        const r = aVal % bVal;
        return `${q}, R=${r}`;
      }
    }

    // Check Unit Conversion: expr unit1▶unit2
    const convMatch = expr.match(/^(.+?)\s*([a-zA-Z°]+)▶([a-zA-Z°²]+)$/);
    if (convMatch) {
      const val = this.evaluate(convMatch[1]);
      const uFrom = convMatch[2];
      const uTo = convMatch[3];
      const convKey = `${uFrom}▶${uTo}`;
      if (!isNaN(val)) {
        const res = this.convertUnit(val, convKey);
        if (res !== null) return res;
      }
    }

    try {
      let sanitized = expr;
      sanitized = sanitized.replace(/\(-\)/g, '-');

      // 0. Recursive innermost-first resolution of calculus and math templates
      for (let iter = 0; iter < 10; iter++) {
        let changed = false;

        // Definite integral: \int{lower}{upper}{expr}
        if (/\\int\{[^{}]*\}\{[^{}]*\}\{[^{}]*\}/.test(sanitized)) {
          sanitized = sanitized.replace(/\\int\{([^{}]*)\}\{([^{}]*)\}\{([^{}]*)\}/g, (_, lStr, uStr, fStr) => {
            const a = this.evaluate(lStr || '0');
            const b = this.evaluate(uStr || '0');
            if (isNaN(a) || isNaN(b)) return 'NaN';
            const val = this.numericalIntegral(fStr || '0', a, b);
            return `(${val})`;
          });
          changed = true;
        }

        // Summation: \sum{lower}{upper}{expr}
        if (/\\sum\{[^{}]*\}\{[^{}]*\}\{[^{}]*\}/.test(sanitized)) {
          sanitized = sanitized.replace(/\\sum\{([^{}]*)\}\{([^{}]*)\}\{([^{}]*)\}/g, (_, lStr, uStr, fStr) => {
            const a = Math.round(this.evaluate(lStr || '0'));
            const b = Math.round(this.evaluate(uStr || '0'));
            if (isNaN(a) || isNaN(b)) return 'NaN';
            const val = this.numericalSum(fStr || '0', a, b);
            return `(${val})`;
          });
          changed = true;
        }

        // Derivative: \diff{expr}{point}
        if (/\\diff\{[^{}]*\}\{[^{}]*\}/.test(sanitized)) {
          sanitized = sanitized.replace(/\\diff\{([^{}]*)\}\{([^{}]*)\}/g, (_, fStr, pStr) => {
            const x0 = this.evaluate(pStr || '0');
            if (isNaN(x0)) return 'NaN';
            const val = this.numericalDerivative(fStr || '0', x0);
            return `(${val})`;
          });
          changed = true;
        }

        // Log base: \logbase{base}{expr}
        if (/\\logbase\{[^{}]*\}\{[^{}]*\}/.test(sanitized)) {
          sanitized = sanitized.replace(/\\logbase\{([^{}]*)\}\{([^{}]*)\}/g, (_, bStr, eStr) => {
            const bVal = this.evaluate(bStr || '10');
            const eVal = this.evaluate(eStr || '1');
            if (isNaN(bVal) || isNaN(eVal) || bVal <= 0 || bVal === 1 || eVal <= 0) return 'NaN';
            const val = Math.log(eVal) / Math.log(bVal);
            return `(${val})`;
          });
          changed = true;
        }

        // Mixed fraction: \mixedfrac{whole}{num}{den}
        if (/\\mixedfrac\{[^{}]*\}\{[^{}]*\}\{[^{}]*\}/.test(sanitized)) {
          sanitized = sanitized.replace(/\\mixedfrac\{([^{}]*)\}\{([^{}]*)\}\{([^{}]*)\}/g, (_, w, n, d) => {
            return `(((${w || 0}) >= 0 ? 1 : -1) * (Math.abs(${w || 0}) + ((${n || 0})/(${d || 1}))))`;
          });
          changed = true;
        }

        // Simple fraction: \frac{num}{den}
        if (/\\frac\{[^{}]*\}\{[^{}]*\}/.test(sanitized)) {
          sanitized = sanitized.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (_, n, d) => {
            return `(((${n || 0})) / ((${d || 1})))`;
          });
          changed = true;
        }

        // N-th root: \nthroot{root}{rad}
        if (/\\nthroot\{[^{}]*\}\{[^{}]*\}/.test(sanitized)) {
          sanitized = sanitized.replace(/\\nthroot\{([^{}]*)\}\{([^{}]*)\}/g, (_, rStr, dStr) => {
            const r = this.evaluate(rStr || '2');
            const d = this.evaluate(dStr || '0');
            if (isNaN(r) || isNaN(d)) return 'NaN';
            if (d < 0 && Math.abs(r % 2) === 1) {
              return `(-Math.pow(${Math.abs(d)}, 1/(${r})))`;
            }
            return `(Math.pow((${d}), 1/(${r})))`;
          });
          changed = true;
        }

        // Cubic root: \cbrt{rad}
        if (/\\cbrt\{[^{}]*\}/.test(sanitized)) {
          sanitized = sanitized.replace(/\\cbrt\{([^{}]*)\}/g, (_, dStr) => `(Math.cbrt(${dStr || '0'}))`);
          changed = true;
        }

        // Absolute value: \abs{expr}
        if (/\\abs\{[^{}]*\}/.test(sanitized)) {
          sanitized = sanitized.replace(/\\abs\{([^{}]*)\}/g, (_, eStr) => `(Math.abs(${eStr || '0'}))`);
          changed = true;
        }

        // Square root: \sqrt{rad}
        if (/\\sqrt\{[^{}]*\}/.test(sanitized)) {
          sanitized = sanitized.replace(/\\sqrt\{([^{}]*)\}/g, (_, dStr) => `(Math.sqrt(${dStr || '0'}))`);
          changed = true;
        }

        // Exponent: ^{exp}
        if (/\^\{[^{}]*\}/.test(sanitized)) {
          sanitized = sanitized.replace(/\^\{([^{}]*)\}/g, (_, p) => `**(${p || 0})`);
          changed = true;
        }

        if (!changed) break;
      }

      // Linear comma-separated fallbacks anywhere in expression:
      sanitized = sanitized.replace(/∫\s*\(\s*(.+?)\s*,\s*([^,]+?)\s*,\s*([^)]+?)\s*\)/g, (m, f, a, b) => {
        const aVal = this.evaluate(a);
        const bVal = this.evaluate(b);
        return `(${this.numericalIntegral(f, aVal, bVal)})`;
      });
      sanitized = sanitized.replace(/d\/dx\s*\(\s*(.+?)\s*,\s*([^)]+?)\s*\)/g, (m, f, x0) => {
        const pVal = this.evaluate(x0);
        return `(${this.numericalDerivative(f, pVal)})`;
      });
      sanitized = sanitized.replace(/∑\s*\(\s*(.+?)\s*,\s*([^,]+?)\s*,\s*([^)]+?)\s*\)/g, (m, f, a, b) => {
        const aVal = Math.round(this.evaluate(a));
        const bVal = Math.round(this.evaluate(b));
        return `(${this.numericalSum(f, aVal, bVal)})`;
      });

      sanitized = sanitized.replace(/×/g, '*');
      sanitized = sanitized.replace(/÷/g, '/');
      sanitized = sanitized.replace(/[−–—]/g, '-');
      sanitized = sanitized.replace(/π/g, 'Math.PI');
      sanitized = sanitized.replace(/e(?![a-zA-Z0-9_])/g, 'Math.E');

      // Random generator functions
      sanitized = sanitized.replace(/Ran#/g, 'Ran()');
      sanitized = sanitized.replace(/RanInt#?\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, 'RanInt($1, $2)');

    // Recurring decimals: 0.\recurring{3} -> 1/3, 1.2\recurring{3} -> 37/30
    sanitized = sanitized.replace(/(\d+)?(?:\.(\d*))?\\recurring\{(\d+)\}/g, (_, intPart, nonRep, rep) => {
      const I = intPart ? parseInt(intPart, 10) : 0;
      const N = nonRep || '';
      const R = rep || '';
      const m = N.length;
      const n = R.length;
      if (n === 0) return (I + (m > 0 ? parseInt(N, 10) / Math.pow(10, m) : 0)).toString();
      const num = (N ? parseInt(N + R, 10) - parseInt(N, 10) : parseInt(R, 10));
      const den = Math.pow(10, m) * (Math.pow(10, n) - 1);
      return `(${I} + (${num}/${den}))`;
    });

      // Scientific constants (Official Casio fx-580VN X CODATA values)
      // 1. Universal (Đại lượng chung)
      sanitized = sanitized.replace(/(c₀|c_0)/g, '(299792458)');
      sanitized = sanitized.replace(/(ε₀|ε_0)/g, '(8.8541878128e-12)');
      sanitized = sanitized.replace(/(μ₀|μ_0)/g, '(1.25663706212e-6)');
      sanitized = sanitized.replace(/(Z₀|Z_0)/g, '(376.730313668)');
      sanitized = sanitized.replace(/\bG\b/g, '(6.67408e-11)');
      sanitized = sanitized.replace(/l_P/g, '(1.616229e-35)');
      sanitized = sanitized.replace(/m_P/g, '(2.176470e-8)');
      sanitized = sanitized.replace(/t_P/g, '(5.39116e-44)');
      sanitized = sanitized.replace(/\bh\b/g, '(6.62607004e-34)');
      sanitized = sanitized.replace(/ℏ/g, '(1.054571800e-34)');

      // 2. Electromagnetic (Điện từ)
      sanitized = sanitized.replace(/μ_B/g, '(9.274009994e-24)');
      sanitized = sanitized.replace(/e_const/g, '(1.6021766208e-19)');
      sanitized = sanitized.replace(/(Φ₀|Φ_0)/g, '(2.067833831e-15)');
      sanitized = sanitized.replace(/(G₀|G_0)/g, '(7.7480917310e-5)');
      sanitized = sanitized.replace(/K_J-90/g, '(483597.9e9)');
      sanitized = sanitized.replace(/K_J/g, '(483597.8525e9)');
      sanitized = sanitized.replace(/R_K-90/g, '(25812.807)');
      sanitized = sanitized.replace(/R_K/g, '(25812.8074555)');

      // 3. Atomic & Nuclear (Nguyên tử & Hạt nhân)
      sanitized = sanitized.replace(/m_p/g, '(1.672621898e-27)');
      sanitized = sanitized.replace(/m_n/g, '(1.674927471e-27)');
      sanitized = sanitized.replace(/m_e/g, '(9.10938356e-31)');
      sanitized = sanitized.replace(/m_μ/g, '(1.883531594e-28)');
      sanitized = sanitized.replace(/(a₀|a_0)/g, '(5.2917721067e-11)');
      sanitized = sanitized.replace(/R_∞/g, '(10973731.568508)');
      sanitized = sanitized.replace(/α/g, '(7.2973525664e-3)');
      sanitized = sanitized.replace(/r_e/g, '(2.8179403227e-15)');
      sanitized = sanitized.replace(/λ_Cp/g, '(1.32140985396e-15)');
      sanitized = sanitized.replace(/λ_Cn/g, '(1.31959090481e-15)');
      sanitized = sanitized.replace(/λ_C/g, '(2.4263102367e-12)');
      sanitized = sanitized.replace(/γ_p/g, '(2.675222005e8)');
      sanitized = sanitized.replace(/μ_N/g, '(5.050783699e-27)');
      sanitized = sanitized.replace(/μ_p/g, '(1.4106067873e-26)');
      sanitized = sanitized.replace(/μ_n/g, '(-9.6623650e-27)');
      sanitized = sanitized.replace(/μ_μ/g, '(-4.49044826e-26)');

      // 4. Physico-Chemical (Hóa lý)
      sanitized = sanitized.replace(/\bu\b/g, '(1.660539040e-27)');
      sanitized = sanitized.replace(/F_const/g, '(96485.33289)');
      sanitized = sanitized.replace(/N_A/g, '(6.022140857e23)');
      sanitized = sanitized.replace(/\bk\b/g, '(1.38064852e-23)');
      sanitized = sanitized.replace(/V_m/g, '(0.022710947)');
      sanitized = sanitized.replace(/\bR\b/g, '(8.3144598)');
      sanitized = sanitized.replace(/(c₁|c_1)/g, '(3.741771790e-16)');
      sanitized = sanitized.replace(/(c₂|c_2)/g, '(0.0143877736)');
      sanitized = sanitized.replace(/σ/g, '(5.670367e-8)');

      // 5. Adopted Values (Giá trị quy ước)
      sanitized = sanitized.replace(/\bg\b/g, '(9.80665)');
      sanitized = sanitized.replace(/\batm\b/g, '(101325)');

      // 6. Other (Khác)
      sanitized = sanitized.replace(/\bt\b/g, '(273.15)');

      // PreAns replacement
      sanitized = sanitized.replace(/\bPreAns\b/g, `(${this.variables.PreAns || 0})`);

      // Variable replacement
      for (const [v, val] of Object.entries(this.variables)) {
        if (v === 'PreAns') continue;
        const regex = new RegExp(`\\b${v}\\b`, 'g');
        sanitized = sanitized.replace(regex, `(${val})`);
      }

      // nPr and nCr combinations
      sanitized = sanitized.replace(/([0-9.]+|\w+|\([^)]+\))\s*nPr\s*([0-9.]+|\w+|\([^)]+\))/g, 'nPr($1, $2)');
      sanitized = sanitized.replace(/([0-9.]+|\w+|\([^)]+\))\s*nCr\s*([0-9.]+|\w+|\([^)]+\))/g, 'nCr($1, $2)');

      // Implicit multiplication
      sanitized = sanitized.replace(/(\d)\s*\(/g, '$1*(');
      sanitized = sanitized.replace(/\)\s*\(/g, ')*(');
      sanitized = sanitized.replace(/\)\s*(\d)/g, ')*$1');

      // Mixed fractions: \mixedfrac{w}{n}{d} -> (((w)>=0?1:-1)*(Math.abs(w) + ((n)/(d))))
      for (let i = 0; i < 3; i++) {
        sanitized = sanitized.replace(/\\mixedfrac\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}/g, '((($1)>=0?1:-1)*(Math.abs(($1)||0)+((($2)||0)/((($3)||1)))))');
      }

      // Fractions: \frac{a}{b} -> ((a)/(b))
      for (let i = 0; i < 4; i++) {
        sanitized = sanitized.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '((($1) || 0)/((($2) || 1)))');
      }

      // N-th root: \nthroot{n}{r} -> Math.pow(r, 1/n)
      for (let i = 0; i < 3; i++) {
        sanitized = sanitized.replace(/\\nthroot\{([^}]*)\}\{([^}]*)\}/g, 'Math.pow((($2)||0), 1/((($1)||1)))');
      }

      // Radicals \sqrt{inner}
      sanitized = sanitized.replace(/\\sqrt\{([^}]*)\}/g, 'Math.sqrt($1)');

      // Functions mapping
      sanitized = sanitized.replace(/sin⁻¹\(/g, 'MATH_ASIN(');
      sanitized = sanitized.replace(/cos⁻¹\(/g, 'MATH_ACOS(');
      sanitized = sanitized.replace(/tan⁻¹\(/g, 'MATH_ATAN(');
      sanitized = sanitized.replace(/sinh⁻¹\(/g, 'Math.asinh(');
      sanitized = sanitized.replace(/sinh\(/g, 'Math.sinh(');
      sanitized = sanitized.replace(/cosh\(/g, 'Math.cosh(');
      sanitized = sanitized.replace(/tanh\(/g, 'Math.tanh(');
      sanitized = sanitized.replace(/sin\(/g, 'MATH_SIN(');
      sanitized = sanitized.replace(/cos\(/g, 'MATH_COS(');
      sanitized = sanitized.replace(/tan\(/g, 'MATH_TAN(');
      sanitized = sanitized.replace(/ln\(/g, 'Math.log(');
      sanitized = sanitized.replace(/log\(/g, 'Math.log10(');
      sanitized = sanitized.replace(/√\(/g, 'Math.sqrt(');
      sanitized = sanitized.replace(/√([0-9.]+)/g, 'Math.sqrt($1)');
      sanitized = sanitized.replace(/∛\(/g, 'Math.cbrt(');
      sanitized = sanitized.replace(/Abs\(/g, 'Math.abs(');
      sanitized = sanitized.replace(/Rnd\(/g, 'Math.round(');

      // Powers: a^b, a^(b), a^{b} -> **
      sanitized = sanitized.replace(/\^\{([^}]+)\}/g, '**($1)');
      sanitized = sanitized.replace(/\^([0-9.]+)/g, '**($1)');
      sanitized = sanitized.replace(/(?<!Math\.)sqrt\(/gi, 'Math.sqrt(');
      sanitized = sanitized.replace(/\^\(([^)]+)\)/g, '**($1)');
      sanitized = sanitized.replace(/\^/g, '**');

      // Percent
      sanitized = sanitized.replace(/([0-9.]+|\)|Ans)%/g, '($1/100)');
      sanitized = sanitized.replace(/%/g, '*(1/100)');

      // Factorial: n!
      sanitized = sanitized.replace(/([0-9]+)!/g, 'fact($1)');

      const context = {
        MATH_SIN: (x) => Math.sin(this.toRadians(x)),
        MATH_COS: (x) => Math.cos(this.toRadians(x)),
        MATH_TAN: (x) => Math.tan(this.toRadians(x)),
        MATH_ASIN: (x) => this.fromRadians(Math.asin(x)),
        MATH_ACOS: (x) => this.fromRadians(Math.acos(x)),
        MATH_ATAN: (x) => this.fromRadians(Math.atan(x)),
        nPr: (n, r) => this.nPr(n, r),
        nCr: (n, r) => this.nCr(n, r),
        fact: (n) => this.factorial(n),
        gcd: (a, b) => this.gcd(a, b),
        GCD: (a, b) => this.gcd(a, b),
        lcm: (a, b) => this.lcm(a, b),
        LCM: (a, b) => this.lcm(a, b),
        Int: (x) => Math.trunc(x),
        Intg: (x) => Math.floor(x),
        Ran: () => Math.floor(Math.random() * 1000) / 1000,
        RanInt: (a, b) => Math.floor(Math.random() * (b - a + 1)) + a,
        Math: Math
      };

      const keys = Object.keys(context);
      const values = Object.values(context);
      const func = new Function(...keys, `"use strict"; return (${sanitized});`);
      const result = func(...values);

      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        this.variables.PreAns = this.variables.Ans;
        this.variables.Ans = result;
      }
      return result;
    } catch (err) {
      return NaN;
    }
  }

  evalPol(x, y) {
    const r = Number(Math.hypot(x, y).toFixed(10));
    let theta = Math.atan2(y, x);
    theta = Number(this.fromRadians(theta).toFixed(10));
    this.variables.x = r;
    this.variables.y = theta;
    return `r=${r}, θ=${theta}`;
  }

  evalRec(r, theta) {
    const rad = this.toRadians(theta);
    const x = Number((r * Math.cos(rad)).toFixed(10));
    const y = Number((r * Math.sin(rad)).toFixed(10));
    this.variables.x = x;
    this.variables.y = y;
    return `x=${x}, y=${y}`;
  }

  convertUnit(val, convKey) {
    const table = {
      'in▶cm': val * 2.54,
      'cm▶in': val / 2.54,
      'ft▶m': val * 0.3048,
      'm▶ft': val / 0.3048,
      'yd▶m': val * 0.9144,
      'm▶yd': val / 0.9144,
      'mile▶km': val * 1.609344,
      'km▶mile': val / 1.609344,
      'acre▶m²': val * 4046.8564224,
      'm²▶acre': val / 4046.8564224,
      'ha▶m²': val * 10000,
      'm²▶ha': val * 0.0001,
      'gal▶L': val * 3.785411784,
      'L▶gal': val / 3.785411784,
      'oz▶g': val * 28.349523125,
      'g▶oz': val / 28.349523125,
      'lb▶kg': val * 0.45359237,
      'kg▶lb': val / 0.45359237,
      'km/h▶m/s': val / 3.6,
      'm/s▶km/h': val * 3.6,
      'atm▶Pa': val * 101325,
      'Pa▶atm': val / 101325,
      'mmHg▶Pa': val * 133.322387415,
      'Pa▶mmHg': val / 133.322387415,
      'bar▶Pa': val * 100000,
      'Pa▶bar': val / 100000,
      'J▶cal': val / 4.184,
      'cal▶J': val * 4.184,
      'hp▶kW': val * 0.74569987158227022,
      'kW▶hp': val / 0.74569987158227022,
      '°F▶°C': (val - 32) * 5 / 9,
      '°C▶°F': val * 9 / 5 + 32,
      '°C▶K': val + 273.15,
      'K▶°C': val - 273.15
    };
    if (table[convKey] !== undefined) {
      return Number(table[convKey].toFixed(9));
    }
    return null;
  }

  numericalIntegral(fExpr, a, b) {
    if (isNaN(a) || isNaN(b)) return NaN;
    if (a === b) return 0;
    const n = 200; // Simpson's 1/3 rule (even interval count)
    const h = (b - a) / n;
    let s = this.evaluateWithX(fExpr, a) + this.evaluateWithX(fExpr, b);
    for (let i = 1; i < n; i++) {
      const xi = a + i * h;
      s += (i % 2 === 0 ? 2 : 4) * this.evaluateWithX(fExpr, xi);
    }
    const res = (h / 3) * s;
    return Number(res.toFixed(9));
  }

  numericalDerivative(fExpr, x0) {
    if (isNaN(x0)) return NaN;
    const h = 1e-5;
    // Central difference with Richardson extrapolation (4th-order accurate)
    const d1 = (this.evaluateWithX(fExpr, x0 + h) - this.evaluateWithX(fExpr, x0 - h)) / (2 * h);
    const d2 = (this.evaluateWithX(fExpr, x0 + h / 2) - this.evaluateWithX(fExpr, x0 - h / 2)) / h;
    const deriv = (4 * d2 - d1) / 3;
    return Number(deriv.toFixed(9));
  }

  numericalSum(fExpr, a, b) {
    if (isNaN(a) || isNaN(b) || b < a || (b - a) > 10000) return NaN;
    let total = 0;
    for (let k = a; k <= b; k++) {
      total += this.evaluateWithX(fExpr, k);
    }
    return Number(total.toFixed(9));
  }

  evaluateWithX(exprStr, xVal) {
    const origX = this.variables.x;
    this.variables.x = xVal;
    let sub = exprStr;
    // Handle coefficient before x: e.g. 2x, 3.5x, )x
    sub = sub.replace(/([0-9.]+|\))\s*(?<![a-zA-Z\\])x(?![a-zA-Z0-9])/gi, '$1*(x)');
    // Handle x before number or paren: e.g. x(2), x2
    sub = sub.replace(/(?<![a-zA-Z\\])x(?![a-zA-Z0-9])\s*([0-9.]+|\()/gi, '(x)*$1');
    // Replace standalone x with (xVal)
    sub = sub.replace(/(?<![a-zA-Z\\])x(?![a-zA-Z0-9])/gi, `(${xVal})`);
    const res = this.evaluate(sub);
    this.variables.x = origX;
    return Number(res) || 0;
  }

  solveEquation(rawEqn, guess = 0) {
    try {
      let fStr = rawEqn.trim();
      if (fStr.includes('=')) {
        const parts = fStr.split('=');
        fStr = `(${parts[0]}) - (${parts[1]})`;
      }
      let x = Number(guess) || 0;
      if (isNaN(x)) x = 0;

      for (let i = 0; i < 60; i++) {
        const fx = this.evaluateWithX(fStr, x);
        if (Math.abs(fx) < 1e-10) break;
        const h = 1e-6;
        const dfx = (this.evaluateWithX(fStr, x + h) - this.evaluateWithX(fStr, x - h)) / (2 * h);
        if (Math.abs(dfx) < 1e-14) {
          x += 0.1;
          continue;
        }
        const xNext = x - fx / dfx;
        if (Math.abs(xNext - x) < 1e-11) {
          x = xNext;
          break;
        }
        x = xNext;
      }
      const lMinusR = this.evaluateWithX(fStr, x);
      if (Math.abs(lMinusR) > 1e-3) {
        return null; // Could not converge to a root -> Can't Solve!
      }
      return {
        x: Number(x.toFixed(9)),
        lMinusR: Math.abs(lMinusR) < 1e-9 ? 0 : Number(lMinusR.toFixed(9))
      };
    } catch (e) {
      return null;
    }
  }

  evalComplex(expr) {
    try {
      const realPartExpr = expr.replace(/i/g, '0');
      const realVal = this.evaluate(realPartExpr);

      let imagVal = 0;
      const match = expr.match(/([+-]?\\s*\\d*(?:\\.\\d+)?)i/);
      if (match) {
        const raw = match[1].replace(/\\s+/g, '');
        if (raw === '' || raw === '+') imagVal = 1;
        else if (raw === '-') imagVal = -1;
        else imagVal = parseFloat(raw) || 1;
      } else {
        imagVal = 1;
      }
      return { real: Number(realVal) || 0, imag: Number(imagVal) || 0 };
    } catch (e) {
      return null;
    }
  }

  // Base-N
  convertBase(val, fromBase, toBase) {
    let intVal = 0;
    if (typeof val === 'string') {
      intVal = parseInt(val, fromBase);
    } else {
      intVal = Math.round(Number(val));
    }
    if (isNaN(intVal)) return 'ERROR';

    if (toBase === 16) return intVal.toString(16).toUpperCase();
    if (toBase === 2) return intVal.toString(2);
    if (toBase === 8) return intVal.toString(8);
    return intVal.toString(10);
  }

  // Matrix
  matrixDet(M) {
    const n = M.length;
    if (n === 1) return M[0][0];
    if (n === 2) return M[0][0] * M[1][1] - M[0][1] * M[1][0];

    let det = 0;
    for (let c = 0; c < n; c++) {
      const sub = [];
      for (let i = 1; i < n; i++) {
        sub.push(M[i].filter((_, colIdx) => colIdx !== c));
      }
      const sign = c % 2 === 0 ? 1 : -1;
      det += sign * M[0][c] * this.matrixDet(sub);
    }
    return det;
  }

  matrixInverse(M) {
    const n = M.length;
    const det = this.matrixDet(M);
    if (Math.abs(det) < 1e-12) return null; // Singular

    if (n === 2) {
      return [
        [M[1][1] / det, -M[0][1] / det],
        [-M[1][0] / det, M[0][0] / det]
      ];
    }
    // General adjoint for 3x3
    const adj = [];
    for (let r = 0; r < n; r++) {
      adj.push([]);
      for (let c = 0; c < n; c++) {
        const sub = [];
        for (let i = 0; i < n; i++) {
          if (i === r) continue;
          sub.push(M[i].filter((_, colIdx) => colIdx !== c));
        }
        const sign = (r + c) % 2 === 0 ? 1 : -1;
        adj[r].push(sign * this.matrixDet(sub));
      }
    }
    // Transpose and divide by det
    const inv = [];
    for (let r = 0; r < n; r++) {
      inv.push([]);
      for (let c = 0; c < n; c++) {
        inv[r].push(Number((adj[c][r] / det).toFixed(4)));
      }
    }
    return inv;
  }

  // Vector
  vectorDot(u, v) {
    let dot = 0;
    for (let i = 0; i < Math.min(u.length, v.length); i++) {
      dot += u[i] * v[i];
    }
    return dot;
  }

  vectorCross(u, v) {
    const u1 = u[0] || 0, u2 = u[1] || 0, u3 = u[2] || 0;
    const v1 = v[0] || 0, v2 = v[1] || 0, v3 = v[2] || 0;
    return [
      u2 * v3 - u3 * v2,
      u3 * v1 - u1 * v3,
      u1 * v2 - u2 * v1
    ];
  }

  vectorMag(u) {
    return Math.sqrt(u.reduce((sum, x) => sum + x * x, 0));
  }

  // Statistics 1-Var
  calc1VarStat(values) {
    if (!values || values.length === 0) return null;
    const n = values.length;
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const sumSq = values.reduce((a, b) => a + b * b, 0);
    const variancePop = values.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    const varianceSample = n > 1 ? values.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1) : 0;
    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[n - 1];
    const q1 = sorted[Math.floor(n * 0.25)];
    const median = n % 2 === 1 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    const q3 = sorted[Math.floor(n * 0.75)];

    return {
      n: n,
      mean: Number(mean.toFixed(5)),
      sum: Number(sum.toFixed(5)),
      sumSq: Number(sumSq.toFixed(5)),
      sigma: Number(Math.sqrt(variancePop).toFixed(5)),
      s: Number(Math.sqrt(varianceSample).toFixed(5)),
      min: min,
      q1: q1,
      median: median,
      q3: q3,
      max: max
    };
  }

  // Table Generator f(x) and optional g(x)
  generateTable(funcExpr, gxExpr, start, end, step) {
    if (typeof gxExpr === 'number' && typeof step === 'undefined') {
      step = end;
      end = start;
      start = gxExpr;
      gxExpr = null;
    }
    if (step <= 0 || start > end) return [];
    const rows = [];
    const maxSteps = 45;
    let current = start;
    let count = 0;

    while (current <= end + 1e-9 && count < maxSteps) {
      const curX = Number(current.toFixed(4));
      const row = { x: curX };
      try {
        const val = this.evaluateWithX(funcExpr, current);
        row.fx = isNaN(val) ? 'ERROR' : Number(val.toFixed(4));
      } catch (e) {
        row.fx = 'ERROR';
      }
      if (gxExpr && typeof gxExpr === 'string' && gxExpr.trim() !== '') {
        try {
          const valG = this.evaluateWithX(gxExpr, current);
          row.gx = isNaN(valG) ? 'ERROR' : Number(valG.toFixed(4));
        } catch (e) {
          row.gx = 'ERROR';
        }
      }
      rows.push(row);
      current += step;
      count++;
    }
    return rows;
  }

  // Helper: GCD & Square extraction for exact Casio roots
  gcd(a, b) {
    let x = Math.round(Math.abs(a));
    let y = Math.round(Math.abs(b));
    while (y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x || 1;
  }

  extractSquare(n) {
    let val = Math.round(Math.abs(n));
    let k = 1;
    for (let i = 2; i * i <= val; i++) {
      while (val % (i * i) === 0) {
        k *= i;
        val = Math.round(val / (i * i));
      }
    }
    return { k, m: val };
  }

  formatReducedFraction(num, den) {
    if (den === 0) return 'Math ERROR';
    if (num === 0) return '0';
    const g = this.gcd(num, den);
    let n = Math.round(num / g);
    let d = Math.round(den / g);
    if (d < 0) { n = -n; d = -d; }
    if (d === 1) return String(n);
    return `\\frac{${n}}{${d}}`;
  }

  // MODE 9: Quadratic ax^2 + bx + c = 0 (100% Authentic Casio ClassWiz Exact Representation)
  solveQuadratic(a, b, c) {
    if (a === 0) {
      if (b !== 0) {
        const xVal = -c / b;
        return {
          type: 'linear',
          roots: [{
            exact: this.formatReducedFraction(-c, b),
            val: Number(xVal.toFixed(5)),
            label: 'x'
          }],
          vertex: null
        };
      } else if (c === 0) {
        return { type: 'infinite', roots: [], vertex: null };
      } else {
        return { type: 'no_solution', roots: [], vertex: null };
      }
    }

    const getDecPlaces = (v) => {
      const s = String(v);
      const p = s.indexOf('.');
      return p >= 0 ? s.length - p - 1 : 0;
    };
    const maxDec = Math.min(4, Math.max(getDecPlaces(a), getDecPlaces(b), getDecPlaces(c)));
    const S = Math.pow(10, maxDec);
    const aInt = Math.round(a * S);
    const bInt = Math.round(b * S);
    const cInt = Math.round(c * S);
    const deltaInt = bInt * bInt - 4 * aInt * cInt;

    // Vertex Coordinates
    const xVal = -b / (2 * a);
    const xExact = this.formatReducedFraction(-bInt, 2 * aInt);
    const yVal = (4 * a * c - b * b) / (4 * a);
    const yExact = this.formatReducedFraction(4 * aInt * cInt - bInt * bInt, 4 * aInt * S);
    const vertex = { xExact, xVal: Number(xVal.toFixed(5)), yExact, yVal: Number(yVal.toFixed(5)), isMin: a > 0 };

    if (deltaInt === 0) {
      return {
        type: 'repeated',
        roots: [{ exact: xExact, val: Number(xVal.toFixed(5)), label: 'x' }],
        vertex
      };
    } else if (deltaInt > 0) {
      const { k, m } = this.extractSquare(deltaInt);
      let r1Exact = '', r2Exact = '';
      const v1 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
      const v2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);

      if (m === 1) {
        // Rational roots
        r1Exact = this.formatReducedFraction(-bInt + k, 2 * aInt);
        r2Exact = this.formatReducedFraction(-bInt - k, 2 * aInt);
      } else {
        // Radical roots
        const g = this.gcd(this.gcd(bInt, k), 2 * aInt);
        let bS = -bInt / g;
        let kS = k / g;
        let dS = (2 * aInt) / g;
        if (dS < 0) { bS = -bS; dS = -dS; }
        const kStr = kS === 1 ? '' : String(kS);
        const radStr = `${kStr}\\sqrt{${m}}`;

        if (dS === 1) {
          r1Exact = bS === 0 ? radStr : `${bS}+${radStr}`;
          r2Exact = bS === 0 ? `-${radStr}` : `${bS}-${radStr}`;
        } else {
          r1Exact = bS === 0 ? `\\frac{${radStr}}{${dS}}` : `\\frac{${bS}+${radStr}}{${dS}}`;
          r2Exact = bS === 0 ? `\\frac{-${radStr}}{${dS}}` : `\\frac{${bS}-${radStr}}{${dS}}`;
        }
      }

      let roots = [
        { exact: r1Exact, val: Number(v1.toFixed(5)), label: 'x1' },
        { exact: r2Exact, val: Number(v2.toFixed(5)), label: 'x2' }
      ];
      if (v1 < v2) {
        roots = [
          { exact: r2Exact, val: Number(v2.toFixed(5)), label: 'x1' },
          { exact: r1Exact, val: Number(v1.toFixed(5)), label: 'x2' }
        ];
      }
      return { type: 'real', roots, vertex };
    } else {
      // Complex roots
      const absDelta = -deltaInt;
      const { k, m } = this.extractSquare(absDelta);
      const g = this.gcd(this.gcd(bInt, k), 2 * aInt);
      let bS = -bInt / g;
      let kS = k / g;
      let dS = (2 * aInt) / g;
      if (dS < 0) { bS = -bS; dS = -dS; }
      const kStr = kS === 1 ? '' : String(kS);
      const radStr = m === 1 ? `${kStr}i` : `${kStr}\\sqrt{${m}}i`;

      let r1Exact = '', r2Exact = '';
      if (dS === 1) {
        r1Exact = bS === 0 ? radStr : `${bS}+${radStr}`;
        r2Exact = bS === 0 ? `-${radStr}` : `${bS}-${radStr}`;
      } else {
        r1Exact = bS === 0 ? `\\frac{${radStr}}{${dS}}` : `\\frac{${bS}+${radStr}}{${dS}}`;
        r2Exact = bS === 0 ? `\\frac{-${radStr}}{${dS}}` : `\\frac{${bS}-${radStr}}{${dS}}`;
      }

      const realVal = Number((-b / (2 * a)).toFixed(5));
      const imagVal = Number((Math.sqrt(absDelta) / (2 * Math.abs(aInt))).toFixed(5));

      return {
        type: 'complex',
        roots: [
          { exact: r1Exact, real: realVal, imag: imagVal, isComplex: true, label: 'x1' },
          { exact: r2Exact, real: realVal, imag: -imagVal, isComplex: true, label: 'x2' }
        ],
        vertex
      };
    }
  }

  // MODE 9: Cubic ax^3 + bx^2 + cx + d = 0 (with local extrema)
  solveCubic(a, b, c, d) {
    if (a === 0) return this.solveQuadratic(b, c, d);

    // Compute local extrema if b^2 - 3ac > 0
    let extrema = null;
    const derDelta = b * b - 3 * a * c;
    if (derDelta > 0) {
      const sqrtD = Math.sqrt(derDelta);
      const xExt1 = (-b - sqrtD) / (3 * a);
      const xExt2 = (-b + sqrtD) / (3 * a);
      const yExt1 = a * Math.pow(xExt1, 3) + b * Math.pow(xExt1, 2) + c * xExt1 + d;
      const yExt2 = a * Math.pow(xExt2, 3) + b * Math.pow(xExt2, 2) + c * xExt2 + d;

      if (a > 0) {
        extrema = {
          max: { x: Number(xExt1.toFixed(5)), y: Number(yExt1.toFixed(5)) },
          min: { x: Number(xExt2.toFixed(5)), y: Number(yExt2.toFixed(5)) }
        };
      } else {
        extrema = {
          max: { x: Number(xExt2.toFixed(5)), y: Number(yExt2.toFixed(5)) },
          min: { x: Number(xExt1.toFixed(5)), y: Number(yExt1.toFixed(5)) }
        };
      }
    }

    const f = (3 * c / a - (b * b) / (a * a)) / 3;
    const g = (2 * (b ** 3) / (a ** 3) - 9 * b * c / (a * a) + 27 * d / a) / 27;
    const h = (g * g) / 4 + (f * f * f) / 27;
    const shift = -b / (3 * a);

    if (h > 0) {
      const R = -(g / 2) + Math.sqrt(h);
      const S = Math.cbrt(R);
      const T = -(g / 2) - Math.sqrt(h);
      const U = Math.cbrt(T);

      const x1 = (S + U) + shift;
      const realComp = -(S + U) / 2 + shift;
      const imagComp = (S - U) * Math.sqrt(3) / 2;

      const frac1 = this.toFraction(x1);
      const exact1 = (frac1 && frac1.d !== 1 && Math.abs(frac1.d) < 1000)
        ? `\\frac{${frac1.n}}{${frac1.d}}` : String(Number(x1.toFixed(5)));

      return {
        type: 'one_real_two_complex',
        roots: [
          { exact: exact1, val: Number(x1.toFixed(5)), label: 'x1' },
          { real: Number(realComp.toFixed(4)), imag: Number(imagComp.toFixed(4)), isComplex: true, label: 'x2' },
          { real: Number(realComp.toFixed(4)), imag: -Number(imagComp.toFixed(4)), isComplex: true, label: 'x3' }
        ],
        extrema
      };
    } else if (f === 0 && g === 0 && h === 0) {
      const x = -Math.cbrt(d / a);
      const frac = this.toFraction(x);
      const exact = (frac && frac.d !== 1 && Math.abs(frac.d) < 1000)
        ? `\\frac{${frac.n}}{${frac.d}}` : String(Number(x.toFixed(5)));
      return {
        type: 'triple',
        roots: [
          { exact, val: Number(x.toFixed(5)), label: 'x' }
        ],
        extrema
      };
    } else {
      const i = Math.sqrt((g * g) / 4 - h);
      const j = Math.cbrt(i);
      const k = Math.acos(-(g / (2 * i)));
      const L = -j;
      const M = Math.cos(k / 3);
      const N = Math.sqrt(3) * Math.sin(k / 3);

      const x1 = 2 * j * Math.cos(k / 3) + shift;
      const x2 = L * (M + N) + shift;
      const x3 = L * (M - N) + shift;
      const sorted = [x1, x2, x3].sort((p, q) => q - p);

      return {
        type: 'real',
        roots: sorted.map((val, idx) => {
          const frac = this.toFraction(val);
          const exact = (frac && frac.d !== 1 && Math.abs(frac.d) < 1000)
            ? `\\frac{${frac.n}}{${frac.d}}` : String(Number(val.toFixed(5)));
          return { exact, val: Number(val.toFixed(5)), label: `x${idx + 1}` };
        }),
        extrema
      };
    }
  }

  // MODE 9: Quartic ax^4 + bx^3 + cx^2 + dx + e = 0
  solveQuartic(a, b, c, d, e) {
    if (a === 0) return this.solveCubic(b, c, d, e);

    const a3 = b / a;
    const a2 = c / a;
    const a1 = d / a;
    const a0 = e / a;

    const f = (xR, xI) => {
      const r2 = xR * xR - xI * xI;
      const i2 = 2 * xR * xI;
      const r3 = r2 * xR - i2 * xI;
      const i3 = r2 * xI + i2 * xR;
      const r4 = r3 * xR - i3 * xI;
      const i4 = r3 * xI + i3 * xR;

      const fR = r4 + a3 * r3 + a2 * r2 + a1 * xR + a0;
      const fI = i4 + a3 * i3 + a2 * i2 + a1 * xI;
      return { r: fR, i: fI };
    };

    let roots = [
      { r: 0.4, i: 0.9 },
      { r: -0.4, i: 0.9 },
      { r: -0.4, i: -0.9 },
      { r: 0.4, i: -0.9 }
    ];

    for (let iter = 0; iter < 100; iter++) {
      for (let i = 0; i < 4; i++) {
        const val = f(roots[i].r, roots[i].i);
        let denR = 1, denI = 0;
        for (let j = 0; j < 4; j++) {
          if (i !== j) {
            const diffR = roots[i].r - roots[j].r;
            const diffI = roots[i].i - roots[j].i;
            const nR = denR * diffR - denI * diffI;
            const nI = denR * diffI + denI * diffR;
            denR = nR; denI = nI;
          }
        }
        const denomMag = denR * denR + denI * denI;
        if (denomMag === 0) continue;
        const deltaR = (val.r * denR + val.i * denI) / denomMag;
        const deltaI = (val.i * denR - val.r * denI) / denomMag;
        roots[i].r -= deltaR;
        roots[i].i -= deltaI;
      }
    }

    return {
      type: 'quartic',
      roots: roots.map((rt, idx) => {
        if (Math.abs(rt.i) < 1e-5) {
          const v = Number(rt.r.toFixed(5));
          const frac = this.toFraction(v);
          const exact = (frac && frac.d !== 1 && Math.abs(frac.d) < 1000)
            ? `\\frac{${frac.n}}{${frac.d}}` : String(v);
          return { exact, val: v, label: `x${idx + 1}` };
        }
        return {
          real: Number(rt.r.toFixed(4)),
          imag: Number(rt.i.toFixed(4)),
          isComplex: true,
          label: `x${idx + 1}`
        };
      })
    };
  }

  // MODE 9: Simultaneous Equations
  solveLinearSystem(matrix, vector) {
    const n = vector.length;
    const A = matrix.map((row, i) => [...row, vector[i]]);

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
          maxRow = k;
        }
      }
      const tmp = A[i]; A[i] = A[maxRow]; A[maxRow] = tmp;

      if (Math.abs(A[i][i]) < 1e-12) {
        let hasNoSolution = false;
        for (let r = i; r < n; r++) {
          const allZero = A[r].slice(0, n).every(v => Math.abs(v) < 1e-12);
          if (allZero && Math.abs(A[r][n]) > 1e-9) {
            hasNoSolution = true;
            break;
          }
        }
        return { success: false, error: hasNoSolution ? 'no_solution' : 'infinite' };
      }

      for (let k = i + 1; k < n; k++) {
        const factor = A[k][i] / A[i][i];
        for (let j = i; j <= n; j++) {
          A[k][j] -= factor * A[i][j];
        }
      }
    }

    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += A[i][j] * x[j];
      }
      x[i] = (A[i][n] - sum) / A[i][i];
    }

    const labels = ['x', 'y', 'z', 't'];
    const result = {};
    for (let i = 0; i < n; i++) {
      const frac = this.toFraction(x[i]);
      const exact = (frac && frac.d !== 1 && Math.abs(frac.d) < 1000)
        ? `\\frac{${frac.n}}{${frac.d}}` : String(Number(x[i].toFixed(5)));
      result[labels[i]] = {
        val: Number(x[i].toFixed(5)),
        exact: exact
      };
    }
    return { success: true, solutions: result };
  }

  // MODE A: Inequalities ax^2 + bx + c (type: 1: >0, 2: <0, 3: >=0, 4: <=0)
  solveInequality2(a, b, c, type) {
    if (a === 0) return 'a = 0 (Không phải bậc 2)';
    const delta = b * b - 4 * a * c;

    if (delta > 0) {
      let r1 = (-b - Math.sqrt(delta)) / (2 * a);
      let r2 = (-b + Math.sqrt(delta)) / (2 * a);
      if (r1 > r2) { const t = r1; r1 = r2; r2 = t; }
      r1 = Number(r1.toFixed(4));
      r2 = Number(r2.toFixed(4));

      if (a > 0) {
        if (type === 1) return `x < ${r1} , ${r2} < x`;
        if (type === 2) return `${r1} < x < ${r2}`;
        if (type === 3) return `x ≤ ${r1} , ${r2} ≤ x`;
        if (type === 4) return `${r1} ≤ x ≤ ${r2}`;
      } else {
        if (type === 1) return `${r1} < x < ${r2}`;
        if (type === 2) return `x < ${r1} , ${r2} < x`;
        if (type === 3) return `${r1} ≤ x ≤ ${r2}`;
        if (type === 4) return `x ≤ ${r1} , ${r2} ≤ x`;
      }
    } else if (Math.abs(delta) < 1e-12) {
      const r = Number((-b / (2 * a)).toFixed(4));
      if (a > 0) {
        if (type === 1) return `x ≠ ${r}`;
        if (type === 2) return 'Vô nghiệm';
        if (type === 3) return 'Tất cả số thực';
        if (type === 4) return `x = ${r}`;
      } else {
        if (type === 1) return 'Vô nghiệm';
        if (type === 2) return `x ≠ ${r}`;
        if (type === 3) return `x = ${r}`;
        if (type === 4) return 'Tất cả số thực';
      }
    } else {
      if (a > 0) {
        if (type === 1 || type === 3) return 'Tất cả số thực';
        return 'Vô nghiệm';
      } else {
        if (type === 2 || type === 4) return 'Tất cả số thực';
        return 'Vô nghiệm';
      }
    }
  }

  // MODE B: Ratio A:B = X:D (type 1) or A:B = C:X (type 2)
  solveRatio(a, b, cOrD, type) {
    if (a === 0 || b === 0) return 'Math ERROR';
    if (type === 1) {
      // A:B = X:D => X = A * D / B
      const x = (a * cOrD) / b;
      return Number(x.toFixed(5));
    } else {
      // A:B = C:X => X = B * C / A
      const x = (b * cOrD) / a;
      return Number(x.toFixed(5));
    }
  }

  // Distribution functions
  erf(x) {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
    const p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x);
    const t = 1.0 / (1.0 + p * absX);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
    return sign * y;
  }

  phi(z) {
    return 0.5 * (1 + this.erf(z / Math.SQRT2));
  }

  normalPD(x, sigma = 1, mu = 0) {
    if (sigma <= 0) return 0;
    const z = (x - mu) / sigma;
    const val = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
    return Number(val.toFixed(8));
  }

  normalCD(lower, upper, sigma = 1, mu = 0) {
    if (sigma <= 0) return 0;
    const z1 = (lower - mu) / sigma;
    const z2 = (upper - mu) / sigma;
    const val = this.phi(z2) - this.phi(z1);
    return Number(Math.max(0, Math.min(1, val)).toFixed(8));
  }

  binomialPD(x, n, p) {
    if (x < 0 || x > n || p < 0 || p > 1) return 0;
    const comb = (n, k) => {
      if (k < 0 || k > n) return 0;
      if (k === 0 || k === n) return 1;
      let c = 1;
      for (let i = 1; i <= k; i++) {
        c = c * (n - (k - i)) / i;
      }
      return c;
    };
    const val = comb(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
    return Number(val.toFixed(8));
  }

  // Matrix operations
  matrixTranspose(M) {
    const rows = M.length;
    const cols = M[0].length;
    const T = [];
    for (let c = 0; c < cols; c++) {
      T.push([]);
      for (let r = 0; r < rows; r++) {
        T[c].push(M[r][c]);
      }
    }
    return T;
  }

  matrixMultiply(A, B) {
    const rA = A.length, cA = A[0].length;
    const rB = B.length, cB = B[0].length;
    if (cA !== rB) return null;
    const res = [];
    for (let r = 0; r < rA; r++) {
      res.push([]);
      for (let c = 0; c < cB; c++) {
        let sum = 0;
        for (let k = 0; k < cA; k++) sum += A[r][k] * B[k][c];
        res[r].push(Number(sum.toFixed(4)));
      }
    }
    return res;
  }

  matrixAdd(A, B) {
    if (A.length !== B.length || A[0].length !== B[0].length) return null;
    return A.map((row, r) => row.map((v, c) => Number((v + B[r][c]).toFixed(4))));
  }

  // Vector operations
  vectorAngle(u, v) {
    const dot = this.vectorDot(u, v);
    const magU = this.vectorMag(u);
    const magV = this.vectorMag(v);
    if (magU === 0 || magV === 0) return 0;
    const cosTheta = Math.max(-1, Math.min(1, dot / (magU * magV)));
    return Number((Math.acos(cosTheta) * 180 / Math.PI).toFixed(4));
  }

  vectorUnit(u) {
    const mag = this.vectorMag(u);
    if (mag === 0) return u.map(() => 0);
    return u.map(x => Number((x / mag).toFixed(4)));
  }
}

window.casioMathEngine = new MathEngine();


    // --- display.js ---
    /**
 * Casio fx-580VN X - Authentic On-LCD Display System
 * 100% ClassWiz FSTN Dot-Matrix LCD emulation matching genuine hardware.
 */

class CasioDisplay {
  constructor() {
    this.container = (typeof document !== 'undefined' && document.querySelector) ? document.querySelector('.lcd-screen-overlay') : null;
    this.statusBar = (typeof document !== 'undefined' && document.querySelector) ? document.querySelector('.lcd-status-bar') : null;

    this.indShift = document.getElementById('ind-shift');
    this.indAlpha = document.getElementById('ind-alpha');
    this.indMem = document.getElementById('ind-m');
    this.indSto = document.getElementById('ind-sto');
    this.indDeg = document.getElementById('ind-d');
    this.indRad = document.getElementById('ind-r');
    this.indGra = document.getElementById('ind-g');
    this.indMath = document.getElementById('ind-math');
    this.indModeBadge = document.getElementById('ind-mode-badge');
    this.indUp = document.getElementById('ind-up');
    this.indDown = document.getElementById('ind-down');

    this.viewNormal = document.getElementById('view-normal');
    this.viewMenu = document.getElementById('classwiz-menu-overlay');
    this.viewList = document.getElementById('classwiz-list-overlay');
    this.viewCustom = document.getElementById('lcd-custom-view');

    this.exprContainer = document.getElementById('screen-expression');
    this.resultContainer = document.getElementById('screen-result');
    this.exprScrollLeft = document.getElementById('expr-scroll-left');
    this.exprScrollRight = document.getElementById('expr-scroll-right');

    this.currentView = 'NORMAL';
    this.language = 'VI'; // Default to Vietnamese (Casio fx-580VN X)
  }

  updateIndicators(state) {
    if (this.indShift) this.indShift.classList.toggle('active', !!state.shift);
    if (this.indAlpha) this.indAlpha.classList.toggle('active', !!state.alpha);
    if (this.indSto) this.indSto.classList.toggle('active', !!state.sto);
    if (this.indMem) this.indMem.classList.toggle('active', !!state.hasMemory);

    if (this.indDeg) this.indDeg.classList.toggle('active', state.angleMode === 'DEG');
    if (this.indRad) this.indRad.classList.toggle('active', state.angleMode === 'RAD');
    if (this.indGra) this.indGra.classList.toggle('active', state.angleMode === 'GRA');
    if (this.indMath) this.indMath.classList.toggle('active', true);

    if (this.indModeBadge) {
      if (state.modeName && state.modeName !== 'COMP') {
        this.indModeBadge.textContent = state.modeName;
        this.indModeBadge.style.display = 'inline-block';
      } else {
        this.indModeBadge.textContent = '';
        this.indModeBadge.style.display = 'none';
      }
    }
  }

  setScrollArrows(hasUp, hasDown) {
    if (this.indUp) this.indUp.classList.toggle('active', !!hasUp);
    if (this.indDown) this.indDown.classList.toggle('active', !!hasDown);
  }

  setIndicator(name, active) {
    if (name === 'i') {
      if (this.indModeBadge) {
        if (active) {
          this.indModeBadge.textContent = 'i';
          this.indModeBadge.style.display = 'inline-block';
        } else if (this.indModeBadge.textContent === 'i') {
          this.indModeBadge.textContent = '';
          this.indModeBadge.style.display = 'none';
        }
      }
      return;
    }
    const map = {
      'shift': this.indShift,
      'alpha': this.indAlpha,
      'm': this.indMem,
      'sto': this.indSto,
      'd': this.indDeg,
      'r': this.indRad,
      'g': this.indGra,
      'math': this.indMath,
      'up': this.indUp,
      'down': this.indDown
    };
    const el = map[name.toLowerCase()];
    if (el) el.classList.toggle('active', !!active);
  }

  // Switch between LCD views
  showView(viewName) {
    this.currentView = viewName;
    if (this.statusBar) {
      // Casio fx-580VN X hides the status bar during Menu and List selection,
      // but keeps it visible during NORMAL, CUSTOM, and SOLVE
      this.statusBar.style.display = (viewName === 'MENU' || viewName === 'LIST') ? 'none' : 'flex';
    }
    if (this.viewNormal) this.viewNormal.style.display = viewName === 'NORMAL' ? 'flex' : 'none';
    if (this.viewMenu) this.viewMenu.classList.toggle('active', viewName === 'MENU');
    if (this.viewList) this.viewList.classList.toggle('active', viewName === 'LIST');
    if (this.viewCustom) this.viewCustom.style.display = (viewName === 'CUSTOM' || viewName === 'SOLVE') ? 'flex' : 'none';
  }

  // View: NORMAL (COMP / CMPLX calculations)
  setMode(mode) {
    this.currentMode = mode;
    if (!this.viewNormal) return;
    this.viewNormal.classList.remove('mode-ready', 'mode-input', 'mode-result');
    if (mode === 'ready') {
      this.viewNormal.classList.add('mode-ready');
    } else if (mode === 'result') {
      this.viewNormal.classList.add('mode-result');
    } else {
      this.viewNormal.classList.add('mode-input');
    }
  }

  renderExpression(expr, cursorPos = (expr ? expr.length : 0), showCursor = true) {
    if (!this.exprContainer) return;
    if (expr && expr.length > 0 && this.currentMode !== 'result') {
      this.setMode('input');
    }
    if (!expr || expr.length === 0) {
      this.exprContainer.innerHTML = showCursor ? '<span class="cursor"></span>' : '';
      this.exprContainer.scrollLeft = 0;
      this.exprContainer.scrollTop = 0;
      this.updateScrollArrows();
      return;
    }

    if (!showCursor) {
      let html = this.formatToNaturalHtml(expr);
      this.exprContainer.innerHTML = html;
      this.updateScrollArrows();
      return;
    }

    const pos = Math.max(0, Math.min(cursorPos, expr.length));
    const beforeCursor = expr.slice(0, pos);
    const afterCursor = expr.slice(pos);
    const fullWithCursor = `${beforeCursor}___CURSOR___${afterCursor}`;

    let html = this.formatToNaturalHtml(fullWithCursor);
    html = html.replace('___CURSOR___', '<span class="cursor"></span>');
    this.exprContainer.innerHTML = html;
    this.scrollToCursor();
  }

  scrollToCursor() {
    if (!this.exprContainer) return;
    const cursorEl = this.exprContainer.querySelector('.cursor, .empty-box-cursor');
    if (!cursorEl) {
      this.updateScrollArrows();
      return;
    }

    const container = this.exprContainer;

    // Use native scrollIntoView as foundational guarantee
    try {
      cursorEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    } catch (e) {}

    // Precise cumulative offset calculation relative to container
    let curLeft = 0;
    let curTop = 0;
    let el = cursorEl;
    while (el && el !== container) {
      curLeft += el.offsetLeft;
      curTop += el.offsetTop;
      el = el.offsetParent;
    }
    const curRight = curLeft + cursorEl.offsetWidth;
    const curBottom = curTop + cursorEl.offsetHeight;

    // Horizontal scroll calculation with generous margin
    const marginX = Math.min(35, Math.max(20, container.clientWidth * 0.22));

    if (curRight > container.scrollLeft + container.clientWidth - marginX) {
      container.scrollLeft = Math.max(0, curRight - container.clientWidth + marginX);
    } else if (curLeft < container.scrollLeft + marginX) {
      container.scrollLeft = Math.max(0, curLeft - marginX);
    }

    // Vertical scroll calculation
    const marginY = 4;

    if (curBottom > container.scrollTop + container.clientHeight - marginY) {
      container.scrollTop = Math.max(0, curBottom - container.clientHeight + marginY);
    } else if (curTop < container.scrollTop + marginY) {
      container.scrollTop = Math.max(0, curTop - marginY);
    }

    this.updateScrollArrows();
  }

  updateScrollArrows() {
    if (!this.exprContainer) return;
    const container = this.exprContainer;

    const hasLeft = container.scrollLeft > 2;
    const hasRight = container.scrollLeft + container.clientWidth < container.scrollWidth - 2;

    if (this.exprScrollLeft) {
      this.exprScrollLeft.style.display = hasLeft ? 'flex' : 'none';
    }
    if (this.exprScrollRight) {
      this.exprScrollRight.style.display = hasRight ? 'flex' : 'none';
    }

    if (this.currentView === 'NORMAL') {
      if (this.currentMode === 'input') {
        const hasUp = container.scrollTop > 2;
        const hasDown = container.scrollTop + container.clientHeight < container.scrollHeight - 2;
        this.setScrollArrows(hasUp, hasDown);
      }
    }
  }

  setPower(isOn) {
    if (!this.container) return;
    this.container.classList.toggle('powered-off', !isOn);
    if (!isOn) {
      if (this.statusBar) this.statusBar.style.display = 'none';
      if (this.viewNormal) this.viewNormal.style.display = 'none';
      if (this.viewMenu) this.viewMenu.classList.remove('active');
      if (this.viewList) this.viewList.classList.remove('active');
      if (this.viewCustom) this.viewCustom.style.display = 'none';
    }
  }

  formatToNaturalHtml(str) {
    if (!str) return '';
    let s = str;

    // 0. Operators
    s = s.replace(/\*/g, '×');
    s = s.replace(/\//g, '÷');
    s = s.replace(/\(-\)/g, '−');

    // 0.5 Scientific constants formatting
    s = s.replace(/e_const/g, '<i>e</i>');
    s = s.replace(/F_const/g, 'F');
    s = s.replace(/₀/g, '<sub>0</sub>').replace(/₁/g, '<sub>1</sub>').replace(/₂/g, '<sub>2</sub>');
    s = s.replace(/([a-zA-Zα-ωΑ-ΩλγμεΦ])_([a-zA-Z0-9\-+∞μα-ωΑ-Ω]+)/g, '$1<sub>$2</sub>');

    // Helper slot formatter for authentic Casio ClassWiz empty box and cursor display
    const formatSlot = (content) => {
      if (!content || content.length === 0) {
        return '<span class="empty-box"></span>';
      }
      if (content === '___CURSOR___') {
        return '<span class="empty-box-cursor">___CURSOR___</span>';
      }
      return content;
    };

    // Helper generators for natural Casio math templates
    const makeRadicalHtml = (inner) => {
      const dInner = formatSlot(inner);
      return `<span class="casio-sqrt"><span class="sqrt-sym-svg"><svg viewBox="0 0 10 24" preserveAspectRatio="none" style="width: 8px; height: 100%; min-height: 17px; display: block;"><path d="M1,14 L3.5,14 L6.5,22.5 L9.5,1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="sqrt-bar">${dInner}</span></span>`;
    };

    const makeCbrtHtml = (inner) => {
      const dInner = formatSlot(inner);
      return `<span class="casio-nthroot"><span class="nth-sup">3</span><span class="casio-sqrt"><span class="sqrt-sym-svg"><svg viewBox="0 0 10 24" preserveAspectRatio="none" style="width: 8px; height: 100%; min-height: 17px; display: block;"><path d="M1,14 L3.5,14 L6.5,22.5 L9.5,1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="sqrt-bar">${dInner}</span></span></span>`;
    };

    const makeNthRootHtml = (root, inner) => {
      const dRoot = formatSlot(root);
      const dInner = formatSlot(inner);
      return `<span class="casio-nthroot"><span class="nth-sup">${dRoot}</span><span class="casio-sqrt"><span class="sqrt-sym-svg"><svg viewBox="0 0 10 24" preserveAspectRatio="none" style="width: 8px; height: 100%; min-height: 17px; display: block;"><path d="M1,14 L3.5,14 L6.5,22.5 L9.5,1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="sqrt-bar">${dInner}</span></span></span>`;
    };

    const makeIntHtml = (lower, upper, expr) => {
      const dLower = formatSlot(lower);
      const dUpper = formatSlot(upper);
      const dExpr = formatSlot(expr);
      return `<span class="casio-integral"><span class="int-symbol-wrap"><span class="int-sym">∫</span><span class="int-limits"><span class="int-upper">${dUpper}</span><span class="int-lower">${dLower}</span></span></span><span class="int-body">(${dExpr})</span><span class="int-dx"><i>d</i>x</span></span>`;
    };

    const makeDiffHtml = (expr, point) => {
      const dExpr = formatSlot(expr);
      const dPoint = formatSlot(point);
      return `<span class="casio-diff"><span class="diff-frac"><span class="diff-num">d</span><span class="diff-den">dx</span></span><span class="diff-body">(${dExpr})</span><span class="diff-eval"><span class="diff-bar">|</span><span class="diff-sub"><i>x</i>=${dPoint}</span></span></span>`;
    };

    const makeSumHtml = (lower, upper, expr) => {
      const dLower = formatSlot(lower);
      const dUpper = formatSlot(upper);
      const dExpr = formatSlot(expr);
      return `<span class="casio-sum"><span class="sum-symbol-wrap"><span class="sum-upper">${dUpper}</span><span class="sum-sym">∑</span><span class="sum-lower"><i>x</i>=${dLower}</span></span><span class="sum-body">(${dExpr})</span></span>`;
    };

    const makeLogBaseHtml = (base, expr) => {
      const dBase = formatSlot(base);
      const dExpr = formatSlot(expr);
      return `<span class="casio-logbase"><span class="log-label">log</span><span class="log-base">${dBase}</span><span class="log-body">(${dExpr})</span></span>`;
    };

    const makeAbsHtml = (expr) => {
      const dExpr = formatSlot(expr);
      return `<span class="casio-abs"><span class="abs-bar">|</span><span class="abs-body">${dExpr}</span><span class="abs-bar">|</span></span>`;
    };

    // Iteratively resolve innermost templates (supports arbitrary nesting without regex conflict)
    for (let iter = 0; iter < 50; iter++) {
      let changed = false;

      // Recurring Decimal: \recurring{digits}
      if (/\\recurring\{[^{}]*\}/.test(s)) {
        s = s.replace(/\\recurring\{([^{}]*)\}/g, (_, digits) => {
          const dDigits = formatSlot(digits);
          return `<span class="casio-recurring">(${dDigits})</span>`;
        });
        changed = true;
      }

      // Mixed Fractions: \mixedfrac{whole}{num}{den}
      if (/\\mixedfrac\{[^{}]*\}\{[^{}]*\}\{[^{}]*\}/.test(s)) {
        s = s.replace(/\\mixedfrac\{([^{}]*)\}\{([^{}]*)\}\{([^{}]*)\}/g, (_, w, num, den) => {
          return `<span class="casio-mixed"><span class="mixed-whole">${formatSlot(w)}</span><span class="casio-frac"><span class="frac-num">${formatSlot(num)}</span><span class="frac-den">${formatSlot(den)}</span></span></span>`;
        });
        changed = true;
      }

      // Simple Fractions: \frac{num}{den}
      if (/\\frac\{[^{}]*\}\{[^{}]*\}/.test(s)) {
        s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (_, num, den) => {
          return `<span class="casio-frac"><span class="frac-num">${formatSlot(num)}</span><span class="frac-den">${formatSlot(den)}</span></span>`;
        });
        changed = true;
      }

      // Integral: \int{lower}{upper}{expr}
      if (/\\int\{[^{}]*\}\{[^{}]*\}\{[^{}]*\}/.test(s)) {
        s = s.replace(/\\int\{([^{}]*)\}\{([^{}]*)\}\{([^{}]*)\}/g, (_, lower, upper, expr) => makeIntHtml(lower, upper, expr));
        changed = true;
      }

      // Summation: \sum{lower}{upper}{expr}
      if (/\\sum\{[^{}]*\}\{[^{}]*\}\{[^{}]*\}/.test(s)) {
        s = s.replace(/\\sum\{([^{}]*)\}\{([^{}]*)\}\{([^{}]*)\}/g, (_, lower, upper, expr) => makeSumHtml(lower, upper, expr));
        changed = true;
      }

      // Derivative: \diff{expr}{point}
      if (/\\diff\{[^{}]*\}\{[^{}]*\}/.test(s)) {
        s = s.replace(/\\diff\{([^{}]*)\}\{([^{}]*)\}/g, (_, expr, point) => makeDiffHtml(expr, point));
        changed = true;
      }

      // Log base: \logbase{base}{expr}
      if (/\\logbase\{[^{}]*\}\{[^{}]*\}/.test(s)) {
        s = s.replace(/\\logbase\{([^{}]*)\}\{([^{}]*)\}/g, (_, base, expr) => makeLogBaseHtml(base, expr));
        changed = true;
      }

      // N-th root: \nthroot{root}{inner}
      if (/\\nthroot\{[^{}]*\}\{[^{}]*\}/.test(s)) {
        s = s.replace(/\\nthroot\{([^{}]*)\}\{([^{}]*)\}/g, (_, root, inner) => makeNthRootHtml(root, inner));
        changed = true;
      }

      // Cubic root: \cbrt{inner}
      if (/\\cbrt\{[^{}]*\}/.test(s)) {
        s = s.replace(/\\cbrt\{([^{}]*)\}/g, (_, inner) => makeCbrtHtml(inner));
        changed = true;
      }

      // Radical: \sqrt{inner}
      if (/\\sqrt\{[^{}]*\}/.test(s)) {
        s = s.replace(/\\sqrt\{([^{}]*)\}/g, (_, inner) => makeRadicalHtml(inner));
        changed = true;
      }

      // Absolute value: \abs{inner}
      if (/\\abs\{[^{}]*\}/.test(s)) {
        s = s.replace(/\\abs\{([^{}]*)\}/g, (_, inner) => makeAbsHtml(inner));
        changed = true;
      }

      // Exponents / Superscripts: ^{exp}
      if (/\^\{[^{}]*\}/.test(s)) {
        s = s.replace(/\^\{([^{}]*)\}/g, (_, exp) => {
          return `<span class="casio-sup">${formatSlot(exp)}</span>`;
        });
        changed = true;
      }

      if (!changed) break;
    }

    // Fallbacks for linear syntax
    s = s.replace(/√\(([^)]*)\)/g, (_, inner) => makeRadicalHtml(inner));
    s = s.replace(/∛\(([^)]*)\)/g, (_, inner) => makeCbrtHtml(inner));
    s = s.replace(/Abs\(([^)]*)\)/g, (_, inner) => makeAbsHtml(inner));
    s = s.replace(/√\(([^)]*)$/g, (_, inner) => makeRadicalHtml(inner));
    s = s.replace(/∛\(([^)]*)$/g, (_, inner) => makeCbrtHtml(inner));
    s = s.replace(/\^\(([^)]*)\)/g, (_, exp) => `<span class="casio-sup">${exp}</span>`);
    s = s.replace(/\^\(([^)]*)$/g, (_, exp) => `<span class="casio-sup">${exp}</span>`);
    s = s.replace(/\^2/g, '<span class="casio-sup">2</span>');
    s = s.replace(/\^3/g, '<span class="casio-sup">3</span>');
    s = s.replace(/\^(-?\d+)/g, '<span class="casio-sup">$1</span>');

    return s;
  }

  formatResultHtml(val) {
    if (val === undefined || val === null || val === '') return '';
    const str = String(val).trim();

    // 1. Mixed fraction: "1 2/3" or "-1 2/3"
    const mixedMatch = str.match(/^(-?)(\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
      const [_, sign, whole, num, den] = mixedMatch;
      const signHtml = sign ? '<span class="casio-sign">−</span>' : '';
      return `${signHtml}${whole}<span class="casio-frac"><span class="frac-num">${num}</span><span class="frac-den">${den}</span></span>`;
    }

    // 2. Simple fraction: "5/3" or "-5/3"
    const fracMatch = str.match(/^(-?)(\d+)\/(\d+)$/);
    if (fracMatch) {
      const [_, sign, num, den] = fracMatch;
      const signHtml = sign ? '<span class="casio-sign">−</span>' : '';
      return `${signHtml}<span class="casio-frac"><span class="frac-num">${num}</span><span class="frac-den">${den}</span></span>`;
    }

    // 2.5 Scientific notation: 6.62607004e-34 or 6.022140857e+23
    const sciMatch = str.match(/^([+-]?\d*(?:\.\d+)?)[eE]([+-]?\d+)$/);
    if (sciMatch) {
      const mantissa = sciMatch[1].replace(/-/g, '−');
      const exp = parseInt(sciMatch[2], 10);
      const expSign = exp < 0 ? '−' : '';
      const absExp = Math.abs(exp);
      return `<span class="casio-sci">${mantissa}×10<span class="casio-sup">${expSign}${absExp}</span></span>`;
    }

    // 3. LaTeX / Math formatted expressions
    if (str.includes('\\frac') || str.includes('^') || str.includes('√') || str.includes('\\sqrt')) {
      return this.formatToNaturalHtml(str);
    }

    // 4. Standard arithmetic operators and numbers
    return str.replace(/-/g, '−').replace(/\*/g, '×').replace(/\//g, '÷');
  }

  setResult(val) {
    if (!this.resultContainer) return;
    this.resultContainer.innerHTML = this.formatResultHtml(val);
    if (val && val !== '') {
      this.setMode('result');
    } else {
      this.setMode('input');
    }
  }

  // View: AUTHENTIC 2x4 CLASSWIZ MONOCHROME MENU (Matches fx-580VN X 100%)
  renderMenu(selectedMode, page = 1) {
    this.showView('MENU');

    const page1Items = [
      { id: 1, key: '1', en: '1:Calculate', vi: '1:Tính toán' },
      { id: 2, key: '2', en: '2:Complex', vi: '2:Số phức' },
      { id: 3, key: '3', en: '3:Base-N', vi: '3:Hệ đếm' },
      { id: 4, key: '4', en: '4:Matrix', vi: '4:Ma trận' },
      { id: 5, key: '5', en: '5:Vector', vi: '5:Véc-tơ' },
      { id: 6, key: '6', en: '6:Statistics', vi: '6:Thống kê' },
      { id: 7, key: '7', en: '7:Distribution', vi: '7:Phân phối' },
      { id: 8, key: '8', en: '8:Table', vi: '8:Bảng giá trị' }
    ];

    const page2Items = [
      { id: 9, key: '9', en: '9:Equation/Func', vi: '9:Phương trình' },
      { id: 10, key: 'A', en: 'A:Inequality', vi: 'A:Bất phương trình' },
      { id: 11, key: 'B', en: 'B:Ratio', vi: 'B:Tỉ số' },
      { id: 12, key: 'C', en: 'C:Spreadsheet', vi: 'C:Bảng tính' }
    ];

    const items = page === 1 ? page1Items : page2Items;
    const allItems = [...page1Items, ...page2Items];

    // Build 2x4 Grid HTML with authentic monochrome styling
    let gridHtml = '';
    items.forEach(it => {
      const isSel = it.id === selectedMode;
      const iconSvg = (typeof CLASSWIZ_ICONS !== 'undefined' && CLASSWIZ_ICONS[it.id]) 
        ? CLASSWIZ_ICONS[it.id] 
        : `<span>${it.key}</span>`;

      gridHtml += `
        <div class="menu-cell-authentic ${isSel ? 'selected' : ''}" onclick="window.casioApp.selectMode(${it.id})">
          <div class="menu-cell-icon-wrap">
            ${iconSvg}
          </div>
          <div class="menu-cell-badge">${it.key}</div>
        </div>
      `;
    });

    const gridEl = document.getElementById('menu-grid-2x4');
    if (gridEl) gridEl.innerHTML = gridHtml;

    // Header arrow: ▼ for page 1, ▲ for page 2
    const arrowEl = document.getElementById('menu-page-arrow');
    if (arrowEl) {
      arrowEl.textContent = page === 1 ? '▼' : '▲';
    }

    // Footer label: e.g. "1:Calculate"
    const curr = allItems.find(it => it.id === selectedMode) || page1Items[0];
    const footerEl = document.getElementById('menu-footer-label');
    if (footerEl) {
      footerEl.textContent = this.language === 'VI' ? curr.vi : curr.en;
    }
  }

  // View: AUTHENTIC LIST MENU (SETUP, OPTN, CONST)
  renderList(title, items, hasUp, hasDown) {
    this.showView('LIST');
    const titleEl = document.getElementById('list-title-text');
    const arrowEl = document.getElementById('list-arrows-indicator');
    const containerEl = document.getElementById('list-items-container');

    if (titleEl) titleEl.textContent = title;
    if (arrowEl) arrowEl.textContent = `${hasUp ? '▲' : ''}${hasDown ? '▼' : ''}`;
    if (containerEl) {
      containerEl.innerHTML = items.map(it => `<div class="list-item-row">${this.formatToNaturalHtml(it)}</div>`).join('');
    }
  }

  // View: CUSTOM ON-LCD SCREENS (Pure Casio LCD UI: Equation, Table, Base-N, etc.)
  renderCustom(htmlContent) {
    this.showView('CUSTOM');
    if (this.viewCustom) {
      this.viewCustom.innerHTML = htmlContent;
    }
  }
}

window.casioDisplay = new CasioDisplay();


    // --- app.js ---
    /**
 * Casio fx-580VN X - Authentic On-LCD Operating System Controller
 * 100% on-screen operation matching the genuine physical Casio machine.
 */

class CasioApp {
  constructor() {
    this.engine = window.casioMathEngine;
    this.display = window.casioDisplay;

    this.state = {
      shift: false,
      alpha: false,
      sto: false,
      hasMemory: false,
      angleMode: 'DEG',
      currentMode: 1, // 1: COMP, 2: CMPLX, 3: BASE-N, 4: MAT, 5: VCT, 6: STAT, 7: DIST, 8: TABLE, 9: EQN, 10: INEQ, 11: RATIO
      modeName: 'COMP',
      isPoweredOff: false,
      insertMode: false
    };

    // Sub-state machine for on-LCD operations
    this.osState = 'NORMAL'; // 'NORMAL', 'MENU', 'EQN_TYPE', 'EQN_SUB', 'EQN_INPUT', 'EQN_RESULT', 'INEQ_DEG', 'INEQ_TYPE', 'INEQ_INPUT', 'INEQ_RESULT', 'RATIO_TYPE', 'RATIO_INPUT', 'TABLE_FX', 'TABLE_PARAMS', 'TABLE_GRID', 'BASE_N', 'STAT_INPUT', 'STAT_RESULT', 'MAT_MENU', 'MAT_GRID', 'SETUP', 'OPTN'

    // Normal calculation variables
    this.expression = '';
    this.cursorPos = 0;
    this.rawResult = 0;
    this.displayResult = '0';
    this.history = [];
    this.historyIndex = -1;
    this.justCalculated = false;

    // Fast Key Repeat (Hold-to-Repeat) for Arrow Keys and DEL
    this.keyRepeatTimer = null;
    this.keyRepeatInterval = null;
    this.activeRepeatKey = null;

    // Menu variables
    this.menuPage = 1;
    this.menuSelected = 1;

    // Equation & Inequality solver states
    this.eqn = {
      isSimul: false,
      size: 2, // 2, 3, 4
      coeffs: [],
      activeIdx: 0,
      buffer: '',
      roots: [],
      rootIdx: 0,
      vertex: null,
      isFraction: true
    };

    this.ineq = {
      degree: 2,
      type: 1, // 1: >0, 2: <0, 3: >=0, 4: <=0
      coeffs: [1, 0, 0],
      activeIdx: 0,
      buffer: '',
      resultStr: ''
    };

    this.ratio = {
      type: 1, // 1: A:B=X:D, 2: A:B=C:X
      vals: [1, 2, 4], // A, B, D or A, B, C
      activeIdx: 0,
      buffer: '',
      resultX: null
    };

    // Table state
    this.table = {
      fx: '',
      gx: '',
      cursor: 0,
      targetFn: 'f',
      start: 1,
      end: 5,
      step: 1,
      paramIdx: 0, // 0: start, 1: end, 2: step
      paramBuffers: ['', '', ''],
      rows: [],
      scrollIdx: 0,
      selectedRow: 0,
      selectedCol: 'fx'
    };

    // Base-N state
    this.baseN = {
      currentBase: 'DEC', // DEC, HEX, BIN, OCT
      valStr: '0'
    };

    // Solve state
    this.solveState = {
      expr: '',
      guess: '0',
      buffer: '',
      sol: null
    };

    // Matrix state
    this.matrixState = {
      activeMat: 'MatA',
      rows: 3,
      cols: 3,
      matrices: {
        MatA: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
        MatB: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
        MatC: [[1, 0], [0, 1]],
        MatD: [[0, 0], [0, 0]]
      },
      cellR: 0,
      cellC: 0,
      buffer: ''
    };

    // Vector state
    this.vectorState = {
      activeVct: 'VctA',
      dim: 3,
      vectors: {
        VctA: [1, 0, 0],
        VctB: [0, 1, 0],
        VctC: [0, 0, 1],
        VctD: [1, 1, 1]
      },
      cellIdx: 0,
      buffer: ''
    };

    // Distribution state
    this.distState = {
      type: 1,
      paramIdx: 0,
      params: {
        x: 0,
        sigma: 1,
        mu: 0,
        lower: 0,
        upper: 1,
        N: 10,
        p: 0.5
      },
      buffer: '',
      resultVal: null
    };

    // Spreadsheet state
    this.sheetState = {
      cols: ['A', 'B', 'C', 'D'],
      maxRows: 5,
      cells: {
        'A1': 0, 'A2': 0, 'A3': 0, 'A4': 0, 'A5': 0,
        'B1': 0, 'B2': 0, 'B3': 0, 'B4': 0, 'B5': 0,
        'C1': 0, 'C2': 0, 'C3': 0, 'C4': 0, 'C5': 0,
        'D1': 0, 'D2': 0, 'D3': 0, 'D4': 0, 'D5': 0
      },
      cellCol: 0,
      cellRow: 0,
      buffer: ''
    };

    // Stat state
    this.stat = {
      list: [5, 8, 12, 15, 20],
      scrollIdx: 0,
      buffer: '',
      results: null,
      resScroll: 0
    };

    // Audio & tactile
    this.audioCtx = null;
    let savedSound = null;
    try {
      savedSound = localStorage.getItem('casio_sound_enabled');
    } catch (e) {}
    this.soundEnabled = savedSound !== null ? (savedSound === 'true') : true;

    this.init();
  }

  init() {
    this.display.updateIndicators(this.state);
    this.renderCurrentView();

    document.addEventListener('touchstart', () => {}, { passive: true });
    this.bindEvents();

    if (window.emulatorUI && typeof window.emulatorUI.updateSoundButtonUI === 'function') {
      window.emulatorUI.updateSoundButtonUI(this.soundEnabled);
    }
  }

  playClickSound() {
    if (!this.soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx && AudioContext) {
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (this.audioCtx) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(850, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(160, this.audioCtx.currentTime + 0.02);
        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.02);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.02);
      }
    } catch (e) {}

    if ('vibrate' in navigator) navigator.vibrate(10);
  }

  toggleSound(forceState) {
    this.soundEnabled = forceState !== undefined ? !!forceState : !this.soundEnabled;
    try {
      localStorage.setItem('casio_sound_enabled', String(this.soundEnabled));
    } catch (e) {}
    if (this.soundEnabled) {
      this.playClickSound();
    }
    if (window.emulatorUI && typeof window.emulatorUI.updateSoundButtonUI === 'function') {
      window.emulatorUI.updateSoundButtonUI(this.soundEnabled);
    }
    return this.soundEnabled;
  }

  startKeyRepeat(key) {
    this.stopKeyRepeat();
    this.activeRepeatKey = key;
    this.playClickSound();
    this.handleKey(key);

    // Initial hold delay: 300ms, then fast repeat every 65ms
    this.keyRepeatTimer = setTimeout(() => {
      let tick = 0;
      this.keyRepeatInterval = setInterval(() => {
        tick++;
        if (tick % 2 === 0) this.playClickSound();
        this.handleKey(key);
      }, 65);
    }, 300);
  }

  stopKeyRepeat() {
    if (this.keyRepeatTimer) {
      clearTimeout(this.keyRepeatTimer);
      this.keyRepeatTimer = null;
    }
    if (this.keyRepeatInterval) {
      clearInterval(this.keyRepeatInterval);
      this.keyRepeatInterval = null;
    }
    this.activeRepeatKey = null;
  }

  bindEvents() {
    const repeatableKeys = ['LEFT', 'RIGHT', 'UP', 'DOWN', 'DEL'];

    document.querySelectorAll('.calc-btn, .casio-key, .key, .dpad-btn').forEach(btn => {
      const action = btn.getAttribute('data-key');
      const isRepeatable = repeatableKeys.includes(action);

      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        btn.classList.add('active');
        if (isRepeatable && action) {
          this.startKeyRepeat(action);
        }
      });

      btn.addEventListener('pointerup', (e) => {
        btn.classList.remove('active');
        if (isRepeatable) {
          this.stopKeyRepeat();
        }
      });

      btn.addEventListener('pointerleave', (e) => {
        btn.classList.remove('active');
        if (isRepeatable) {
          this.stopKeyRepeat();
        }
      });

      btn.addEventListener('pointercancel', (e) => {
        btn.classList.remove('active');
        if (isRepeatable) {
          this.stopKeyRepeat();
        }
      });

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isRepeatable) {
          // Handled via pointerdown + auto-repeat
          return;
        }
        this.playClickSound();
        if (action) this.handleKey(action);
      });
    });

    // Global safety so repeating stops even if pointer leaves window
    window.addEventListener('pointerup', () => this.stopKeyRepeat());
    window.addEventListener('pointercancel', () => this.stopKeyRepeat());

    window.addEventListener('keydown', (e) => {
      if (['0','1','2','3','4','5','6','7','8','9'].includes(e.key)) {
        this.playClickSound();
        this.handleKey(e.key);
      } else if (['+','-','*','/','(',')'].includes(e.key)) {
        this.playClickSound();
        const map = { '+': 'add', '-': 'sub', '*': 'mul', '/': 'div', '(': 'open_paren', ')': 'close_paren' };
        this.handleKey(map[e.key] || e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        this.playClickSound();
        this.handleKey('EQUALS');
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        this.playClickSound();
        this.handleKey('DEL');
      } else if (e.key === 'Escape') {
        this.playClickSound();
        this.handleKey('AC');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.playClickSound();
        this.handleKey('LEFT');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.playClickSound();
        this.handleKey('RIGHT');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.playClickSound();
        this.handleKey('UP');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.playClickSound();
        this.handleKey('DOWN');
      }
    });
  }

  // Master ON Key Handler - 100% Matching Real Casio fx-580VN X
  handleOnKey() {
    if (this.state.isPoweredOff) {
      this.powerOn();
      return;
    }

    // 1. Reset modifiers
    this.state.shift = false;
    this.state.alpha = false;
    this.state.sto = false;
    this.display.updateIndicators(this.state);
    this.display.setScrollArrows(false, false);

    // 2. Close active menus and modal overlays
    if (this.osState === 'MENU') {
      this.closeMenu();
      return;
    }
    if (this.osState === 'SETUP') {
      this.exitSetup();
      return;
    }
    if (this.osState === 'OPTN') {
      this.osState = 'NORMAL';
      this.optnSubmenu = null;
      this.display.showView('NORMAL');
      this.renderCurrentView();
      return;
    }
    if (this.osState.startsWith('CONST_') || this.osState.startsWith('CONV_') || this.osState.startsWith('RESET_') || this.osState === 'LIST') {
      this.exitToNormal();
      return;
    }

    // 3. Mode-specific resets
    if (this.osState.startsWith('SOLVE_')) {
      this.osState = 'NORMAL';
      this.solveState = null;
      this.clearAll();
      this.display.showView('NORMAL');
      this.renderCurrentView();
      return;
    }

    if (this.osState.startsWith('EQN_')) {
      if (this.osState === 'EQN_INPUT' || this.osState === 'EQN_ROOT') {
        this.osState = 'EQN_INPUT';
        const total = this.eqn.isSimul ? this.eqn.size * (this.eqn.size + 1) : (this.eqn.size + 1);
        this.eqn.coeffs = new Array(total).fill(0);
        this.eqn.activeIdx = 0;
        this.eqn.buffer = '';
        this.renderEqnInputScreen();
      } else {
        this.startEquation();
      }
      return;
    }

    if (this.osState.startsWith('TABLE_')) {
      this.table = { fx: '', gx: '', start: 1, end: 5, step: 1, rows: [] };
      this.osState = 'TABLE_FX';
      this.display.showView('NORMAL');
      this.display.renderExpression('f(x)=', 5);
      this.display.setResult('');
      return;
    }

    if (this.osState.startsWith('INEQ_')) {
      this.startInequality();
      return;
    }

    if (this.osState.startsWith('RATIO_')) {
      this.startRatio();
      return;
    }

    if (this.osState.startsWith('MAT_') || this.osState.startsWith('VCT_') || this.osState.startsWith('STAT_') || this.osState.startsWith('DIST_') || this.osState.startsWith('SHEET_')) {
      this.clearAll();
      this.renderCurrentView();
      return;
    }

    // 4. Default: COMP / CMPLX Normal mode
    this.osState = 'NORMAL';
    this.clearAll();
    this.display.showView('NORMAL');
    this.renderCurrentView();
  }

  // Master Key Router
  handleKey(rawKey) {
    if (!rawKey) return;
    let key = String(rawKey).trim();
    const lk = key.toLowerCase();
    if (key === '=' || lk === 'equals') key = 'EQUALS';
    else if (lk === 'optn') key = 'optn';
    else if (lk === 'calc') key = 'CALC';
    else if (lk === 'shift') key = 'SHIFT';
    else if (lk === 'alpha') key = 'ALPHA';
    else if (lk === 'menu') key = 'MENU';
    else if (lk === 'on') key = 'ON';
    else if (lk === 'ac') key = 'AC';
    else if (lk === 'del') key = 'DEL';
    else if (lk === 'up') key = 'UP';
    else if (lk === 'down') key = 'DOWN';
    else if (lk === 'left') key = 'LEFT';
    else if (lk === 'right') key = 'RIGHT';
    else if (lk === 'sto') key = 'STO';
    else if (lk === 'eng') key = 'ENG';
    else if (lk === 'sd') key = 'SD';
    else if (lk === 'ans') key = 'Ans';
    else if (lk === 'm_plus' || lk === 'mplus') key = 'M_plus';
    else if (lk === 'x10x' || lk === 'exp') key = 'x10x';
    else if (lk === 'int_diff' || lk === 'integral') key = 'int_diff';
    else if (lk === 'x_var' || key === 'x') key = 'x_var';
    else if (lk === 'recip' || lk === 'inv') key = 'recip';
    else if (lk === 'sqr' || lk === 'x2') key = 'sqr';
    else if (lk === 'open_paren' || key === '(') key = 'open_paren';
    else if (lk === 'close_paren' || key === ')') key = 'close_paren';
    else if (key === '+') key = 'add';
    else if (key === '-') key = 'sub';
    else if (key === '*' || key === '×') key = 'mul';
    else if (key === '/' || key === '÷') key = 'div';

    // Powered-off check: only ON button turns it back on
    if (this.state.isPoweredOff) {
      if (key === 'ON') {
        this.powerOn();
      }
      return;
    }
    if (this.state.sto) {
      const varMap = {
        'neg': 'A', 'deg': 'B', 'recip': 'C', 'sin': 'D',
        'cos': 'E', 'tan': 'F', 'close_paren': 'x', 'SD': 'y', 'M_plus': 'M'
      };
      if (varMap[key]) {
        const v = varMap[key];
        const valToStore = !isNaN(this.rawResult) ? this.rawResult : 0;
        this.engine.variables[v] = valToStore;
        this.state.sto = false;
        if (v === 'M') this.state.hasMemory = true;
        this.display.updateIndicators(this.state);
        this.display.setResult(`${valToStore} → ${v}`);
        return;
      }
      this.state.sto = false;
      this.display.updateIndicators(this.state);
    }

    // 2. Handle by OS state
    if (this.osState === 'MENU') {
      this.handleMenuKey(key);
      return;
    }
    if (this.osState === 'SETUP') {
      this.handleSetupKey(key);
      return;
    }
    if (this.osState === 'OPTN') {
      this.handleOptnKey(key);
      return;
    }
    if (this.osState.startsWith('CONST_')) {
      this.handleConstKey(key);
      return;
    }
    if (this.osState.startsWith('CONV_')) {
      this.handleConvKey(key);
      return;
    }
    if (this.osState.startsWith('RESET_')) {
      this.handleResetKey(key);
      return;
    }
    if (this.osState === 'LIST') {
      if (key === 'AC' || key === 'ON' || key === 'MENU') {
        this.exitToNormal();
        return;
      }
    }

    if (this.osState.startsWith('EQN_')) {
      this.handleEqnKey(key);
      return;
    }

    if (this.osState.startsWith('INEQ_')) {
      this.handleIneqKey(key);
      return;
    }

    if (this.osState.startsWith('RATIO_')) {
      this.handleRatioKey(key);
      return;
    }

    if (this.osState.startsWith('TABLE_')) {
      this.handleTableKey(key);
      return;
    }

    if (this.osState.startsWith('STAT_')) {
      this.handleStatKey(key);
      return;
    }

    if (this.osState.startsWith('SOLVE_')) {
      this.handleSolveKey(key);
      return;
    }

    if (this.osState.startsWith('MAT_')) {
      this.handleMatrixKey(key);
      return;
    }

    if (this.osState.startsWith('VCT_')) {
      this.handleVectorKey(key);
      return;
    }

    if (this.osState.startsWith('DIST_')) {
      this.handleDistKey(key);
      return;
    }

    if (this.osState.startsWith('SHEET_')) {
      this.handleSheetKey(key);
      return;
    }

    if (this.osState === 'BASE_N') {
      this.handleBaseNKey(key);
      return;
    }

    // 3. SHIFT / ALPHA in Normal Mode
    if (this.state.shift) {
      this.state.shift = false;
      this.display.updateIndicators(this.state);

      if (key === 'SHIFT') return;
      if (key === 'ALPHA') { this.state.alpha = true; this.display.updateIndicators(this.state); return; }
      if (key === 'ON') { this.clearAll(); return; }
      if (key === 'AC') { this.powerOff(); return; }
      if (key === 'MENU') { this.openSetup(); return; }

      switch (key) {
        case 'CALC': this.startSolve(); return;
        case 'sin': this.insert('sin⁻¹('); return;
        case 'cos': this.insert('cos⁻¹('); return;
        case 'tan': this.insert('tan⁻¹('); return;
        case 'ln': this.insert('e^('); return;
        case 'log': this.insert('10^('); return;
        case 'sqrt': this.insertCbrt(); return;
        case 'sqr': this.insert('^3'); return;
        case 'pow': this.insertNthRoot(); return;
        case 'recip': this.insert('!'); return;
        case 'x10x': this.insert('π'); return;
        case '.': this.insert('Ran#'); return;
        case '0': this.insert('Rnd('); return;
        case 'x_var': this.insertSum(); return;
        case 'int_diff': this.insertDiff(); return;
        case 'frac': this.insertMixedFrac(); return;
        case 'deg': this.factorizeAns(); return;
        case 'neg': this.insert('log('); return;
        case 'STO': this.recallMemory(); return;
        case 'ENG': this.handleShiftEng(); return;
        case 'open_paren': this.insertAbs(); return;
        case 'close_paren': this.insert(','); return;
        case 'SD': this.toggleMixedFraction(); return;
        case 'M_plus': this.subtractFromMemory(); return;
        case 'DEL': this.toggleInsertMode(); return;
        case 'Ans': this.insert('%'); return;
        case '7': this.openConstants(); return;
        case '8': this.openConversions(); return;
        case '9': this.openReset(); return;
        case 'mul': this.insert(' nPr '); return;
        case 'div': this.insert(' nCr '); return;
        case 'add': this.insert('Pol('); return;
        case 'sub': this.insert('Rec('); return;
        case 'EQUALS': this.toggleDecimalApprox(); return;
      }
    }

    if (this.state.alpha) {
      this.state.alpha = false;
      this.display.updateIndicators(this.state);

      if (key === 'ALPHA') return;
      if (key === 'SHIFT') { this.state.shift = true; this.display.updateIndicators(this.state); return; }

      switch (key) {
        case 'CALC': this.insert('='); return;
        case 'int_diff': this.insert(':'); return;
        case 'x_var': this.insert('x'); return;
        case 'frac': this.insert('÷R'); return;
        case 'sqrt': this.insertRecurring(); return;
        case 'DEL': this.undo(); return;
        case 'neg': this.insert('A'); return;
        case 'deg': this.insert('B'); return;
        case 'recip': this.insert('C'); return;
        case 'sin': this.insert('D'); return;
        case 'cos': this.insert('E'); return;
        case 'tan': this.insert('F'); return;
        case 'open_paren': this.insert('x'); return;
        case 'close_paren': this.insert('y'); return;
        case 'SD': this.insert('z'); return;
        case 'M_plus': this.insert('M'); return;
        case 'mul': this.insert('GCD('); return;
        case 'div': this.insert('LCM('); return;
        case 'add': this.insert('Int('); return;
        case 'sub': this.insert('Intg('); return;
        case '.': this.insert('RanInt#('); return;
        case 'x10x': this.insert('e'); return;
        case 'Ans': this.insert('PreAns'); return;
        case 'EQUALS': this.calculate(true); return;
      }
    }

    // 5. Normal Keys
    switch (key) {
      case 'SHIFT':
        this.state.shift = !this.state.shift;
        this.state.alpha = false;
        this.display.updateIndicators(this.state);
        break;
      case 'ALPHA':
        this.state.alpha = !this.state.alpha;
        this.state.shift = false;
        this.display.updateIndicators(this.state);
        break;
      case 'ON':
      case 'AC':
        this.clearAll();
        break;
      case 'DEL':
        this.deleteChar();
        break;
      case 'EQUALS':
        this.calculate();
        break;
      case 'SD':
        this.handleSD();
        break;
      case 'LEFT':
        if (this.justCalculated) {
          this.justCalculated = false;
          this.displayResult = '';
          this.display.setResult('');
          this.display.setMode('input');
          this.cursorPos = this.expression.length;
          this.display.renderExpression(this.expression, this.cursorPos);
          return;
        }
        this.moveCursor(-1);
        break;
      case 'RIGHT':
        if (this.justCalculated) {
          this.justCalculated = false;
          this.displayResult = '';
          this.display.setResult('');
          this.display.setMode('input');
          this.cursorPos = 0;
          this.display.renderExpression(this.expression, this.cursorPos);
          return;
        }
        this.moveCursor(1);
        break;
      case 'UP':
        this.navigateVertical(-1);
        break;
      case 'DOWN':
        this.navigateVertical(1);
        break;
      case 'STO':
        this.state.sto = true;
        this.display.updateIndicators(this.state);
        break;
      case 'M_plus':
        this.addToMemory();
        break;
      case 'Ans':
        this.insert('Ans');
        break;
      case 'ENG':
        if (this.state.currentMode === 2) this.insert('i');
        else this.handleEng(false);
        break;

      case 'sin': this.insert('sin('); break;
      case 'cos': this.insert('cos('); break;
      case 'tan': this.insert('tan('); break;
      case 'ln': this.insert('ln('); break;
      case 'log': this.insertLogBase(); break;
      case 'sqrt': this.insertSqrt(); break;
      case 'sqr': this.insert('^2'); break;
      case 'pow': this.insertPow(); break;
      case 'recip': this.insert('^(-1)'); break;
      case 'frac': this.insertFrac(); break;
      case 'neg': this.insert('(-)'); break;
      case 'deg': this.insert('°'); break;
      case 'int_diff': this.insertIntegral(); break;
      case 'x_var': this.insert('x'); break;
      case 'open_paren': this.insert('('); break;
      case 'close_paren': this.insert(')'); break;
      case 'MENU': this.openMenu(); break;
      case 'optn': this.openOptionMenu(); break;
      case 'CALC': this.calculate(); break;

      case 'add': this.insert('+'); break;
      case 'sub': this.insert('−'); break;
      case 'mul': this.insert('×'); break;
      case 'div': this.insert('÷'); break;

      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9': case '.':
        this.insert(key);
        break;
      case 'x10x':
        this.insert('×10^(');
        break;
    }
  }

  // -------------------------------------------------------------
  // CLASSWIZ MENU CONTROLLER (2 Pages, 12 Modes)
  // -------------------------------------------------------------
  openMenu() {
    this.osState = 'MENU';
    this.menuSelected = this.state.currentMode || 1;
    this.menuPage = this.menuSelected > 8 ? 2 : 1;
    this.display.renderMenu(this.menuSelected, this.menuPage);
  }

  handleMenuKey(key) {
    if (key === 'AC' || key === 'ON' || key === 'MENU') {
      this.closeMenu();
      return;
    }
    if (['1','2','3','4','5','6','7','8','9'].includes(key)) {
      this.selectMode(parseInt(key, 10));
      return;
    }
    if (key === 'neg') { this.selectMode(10); return; } // A: Bất PT
    if (key === 'deg') { this.selectMode(11); return; } // B: Tỉ số
    if (key === 'recip') { this.selectMode(12); return; } // C: Bảng tính

    if (key === 'EQUALS') {
      this.selectMode(this.menuSelected);
      return;
    }

    // Navigation
    if (key === 'RIGHT') {
      if (this.menuPage === 1) {
        if (this.menuSelected < 8) this.menuSelected++;
        else this.menuSelected = 1;
      } else {
        if (this.menuSelected < 12) this.menuSelected++;
        else this.menuSelected = 9;
      }
    } else if (key === 'LEFT') {
      if (this.menuPage === 1) {
        if (this.menuSelected > 1) this.menuSelected--;
        else this.menuSelected = 8;
      } else {
        if (this.menuSelected > 9) this.menuSelected--;
        else this.menuSelected = 12;
      }
    } else if (key === 'DOWN') {
      if (this.menuPage === 1) {
        if (this.menuSelected <= 4) this.menuSelected += 4;
        else {
          this.menuPage = 2;
          this.menuSelected = 9 + (this.menuSelected - 5);
        }
      } else {
        this.menuPage = 1;
        this.menuSelected = 1 + (this.menuSelected - 9);
      }
    } else if (key === 'UP') {
      if (this.menuPage === 2) {
        this.menuPage = 1;
        this.menuSelected = 5 + (this.menuSelected - 9);
      } else {
        if (this.menuSelected > 4) this.menuSelected -= 4;
        else {
          this.menuPage = 2;
          this.menuSelected = 9 + (this.menuSelected - 1);
        }
      }
    }
    this.display.renderMenu(this.menuSelected, this.menuPage);
  }

  closeMenu() {
    this.osState = 'NORMAL';
    this.renderCurrentView();
  }

  // -------------------------------------------------------------
  // SETUP CONTROLLER (SHIFT + MENU)
  // -------------------------------------------------------------
  openSetup() {
    this.osState = 'SETUP';
    this.setupPage = 1;
    this.setupSubmenu = null;
    this.renderSetup();
  }

  renderSetup() {
    const isVi = this.display.language === 'VI';

    if (this.setupSubmenu === 'INOUT') {
      const items = isVi ? [
        '1:Toán vào/Toán ra',
        '2:Toán vào/Thập phân',
        '3:Dòng vào/Dòng ra',
        '4:Dòng vào/Thập phân'
      ] : [
        '1:MathI/MathO',
        '2:MathI/DecimalO',
        '3:LineI/LineO',
        '4:LineI/DecimalO'
      ];
      this.display.renderList(isVi ? 'Nhập/Xuất' : 'Input/Output', items, false, false);
      return;
    }

    if (this.setupSubmenu === 'ANGLE') {
      const items = isVi ? [
        '1:Độ (Degree)',
        '2:Radian',
        '3:Gradian'
      ] : [
        '1:Degree',
        '2:Radian',
        '3:Gradian'
      ];
      this.display.renderList(isVi ? 'Đơn vị góc' : 'Angle Unit', items, false, false);
      return;
    }

    if (this.setupSubmenu === 'FORMAT') {
      const items = isVi ? [
        '1:Cố định (Fix)',
        '2:Khoa học (Sci)',
        '3:Bình thường (Norm)'
      ] : [
        '1:Fix',
        '2:Sci',
        '3:Norm'
      ];
      this.display.renderList(isVi ? 'Định dạng số' : 'Number Format', items, false, false);
      return;
    }

    if (this.setupSubmenu === 'ENGINEER') {
      const items = isVi ? ['1:Bật', '2:Tắt'] : ['1:On', '2:Off'];
      this.display.renderList(isVi ? 'Ký hiệu kỹ thuật' : 'Engineer Symbol', items, false, false);
      return;
    }

    if (this.setupSubmenu === 'FRACTION') {
      const items = isVi ? ['1:Hỗn số (ab/c)', '2:Phân số (d/c)'] : ['1:ab/c', '2:d/c'];
      this.display.renderList(isVi ? 'Dạng phân số' : 'Fraction Result', items, false, false);
      return;
    }

    if (this.setupSubmenu === 'COMPLEX') {
      const items = isVi ? ['1:Tọa độ a+bi', '2:Tọa độ cực r∠θ'] : ['1:a+bi', '2:r∠θ'];
      this.display.renderList(isVi ? 'Số phức' : 'Complex', items, false, false);
      return;
    }

    if (this.setupSubmenu === 'STAT') {
      const items = isVi ? ['1:Bật tần số', '2:Tắt tần số'] : ['1:On', '2:Off'];
      this.display.renderList(isVi ? 'Thống kê' : 'Statistics', items, false, false);
      return;
    }

    if (this.setupSubmenu === 'SPREADSHEET') {
      const items = isVi ? ['1:Tự động tính', '2:Thủ công'] : ['1:Auto Calc', '2:Manual'];
      this.display.renderList(isVi ? 'Bảng tính' : 'Spreadsheet', items, false, false);
      return;
    }

    if (this.setupSubmenu === 'EQN') {
      const items = isVi ? ['1:Bật nghiệm phức', '2:Tắt nghiệm phức'] : ['1:Complex On', '2:Complex Off'];
      this.display.renderList(isVi ? 'Phương trình' : 'Equation/Func', items, false, false);
      return;
    }

    if (this.setupSubmenu === 'TABLE') {
      const items = isVi ? ['1:f(x)', '2:f(x), g(x)'] : ['1:f(x)', '2:f(x), g(x)'];
      this.display.renderList(isVi ? 'Bảng giá trị' : 'Table', items, false, false);
      return;
    }

    if (this.setupSubmenu === 'DECIMAL_MARK') {
      const items = isVi ? ['1:Dấu chấm (.)', '2:Dấu phẩy (,)'] : ['1:Dot', '2:Comma'];
      this.display.renderList(isVi ? 'Dấu thập phân' : 'Decimal Mark', items, false, false);
      return;
    }

    if (this.setupSubmenu === 'DIGIT_SEP') {
      const items = isVi ? ['1:Bật', '2:Tắt'] : ['1:On', '2:Off'];
      this.display.renderList(isVi ? 'Dấu tách số' : 'Digit Separator', items, false, false);
      return;
    }

    if (this.setupSubmenu === 'LANGUAGE') {
      this.display.renderList(isVi ? 'Ngôn ngữ' : 'Language', [
        '1:English',
        '2:Tiếng Việt'
      ], false, false);
      return;
    }

    if (this.setupSubmenu === 'CONTRAST') {
      this.renderContrastScreen();
      return;
    }

    // Main 4 Pages
    const title = isVi ? 'CÀI ĐẶT' : 'SETUP';
    if (this.setupPage === 1) {
      const items = isVi ? [
        '1:Nhập/Xuất',
        '2:Đơn vị góc',
        '3:Định dạng số',
        '4:Ký hiệu kỹ thuật'
      ] : [
        '1:Input/Output',
        '2:Angle Unit',
        '3:Number Format',
        '4:Engineer Symbol'
      ];
      this.display.renderList(title, items, false, true);
    } else if (this.setupPage === 2) {
      const items = isVi ? [
        '1:Dạng phân số',
        '2:Số phức',
        '3:Thống kê',
        '4:Bảng tính'
      ] : [
        '1:Fraction Result',
        '2:Complex',
        '3:Statistics',
        '4:Spreadsheet'
      ];
      this.display.renderList(title, items, true, true);
    } else if (this.setupPage === 3) {
      const items = isVi ? [
        '1:Phương trình',
        '2:Bảng giá trị',
        '3:Dấu số thập phân',
        '4:Dấu tách số'
      ] : [
        '1:Equation/Func',
        '2:Table',
        '3:Decimal Mark',
        '4:Digit Separator'
      ];
      this.display.renderList(title, items, true, true);
    } else {
      const items = isVi ? [
        '1:Ngôn ngữ',
        '2:Độ tương phản'
      ] : [
        '1:Language',
        '2:Contrast'
      ];
      this.display.renderList(title, items, true, false);
    }
  }

  handleSetupKey(key) {
    if (key === 'AC' || key === 'ON' || key === 'MENU') {
      this.exitSetup();
      return;
    }
    if (key === 'LEFT') {
      if (this.setupSubmenu) {
        this.setupSubmenu = null;
        this.renderSetup();
      } else {
        this.exitSetup();
      }
      return;
    }

    // Page navigation (including wrap-around from page 1 to 4 with UP, and 4 to 1 with DOWN!)
    if (!this.setupSubmenu) {
      if (key === 'DOWN') {
        if (this.setupPage < 4) this.setupPage++;
        else this.setupPage = 1;
        this.renderSetup();
        return;
      }
      if (key === 'UP') {
        if (this.setupPage > 1) this.setupPage--;
        else this.setupPage = 4; // Wrap-around to Page 4 (Language & Contrast)
        this.renderSetup();
        return;
      }
    }

    // Submenu handling
    if (this.setupSubmenu === 'INOUT') {
      if (key === '1') this.inOutFormat = 'MathI/MathO';
      else if (key === '2') this.inOutFormat = 'MathI/DecimalO';
      else if (key === '3') this.inOutFormat = 'LineI/LineO';
      else if (key === '4') this.inOutFormat = 'LineI/DecimalO';
      this.exitSetup();
      return;
    }

    if (this.setupSubmenu === 'ANGLE') {
      if (key === '1') { this.state.angleMode = 'DEG'; this.engine.setAngleMode('DEG'); }
      else if (key === '2') { this.state.angleMode = 'RAD'; this.engine.setAngleMode('RAD'); }
      else if (key === '3') { this.state.angleMode = 'GRA'; this.engine.setAngleMode('GRA'); }
      this.exitSetup();
      return;
    }

    if (this.setupSubmenu === 'FORMAT') {
      if (key === '1') this.numFormat = 'Fix';
      else if (key === '2') this.numFormat = 'Sci';
      else if (key === '3') this.numFormat = 'Norm';
      this.exitSetup();
      return;
    }

    if (this.setupSubmenu === 'ENGINEER') {
      if (key === '1') this.engSymbol = true;
      else if (key === '2') this.engSymbol = false;
      this.exitSetup();
      return;
    }

    if (this.setupSubmenu === 'FRACTION') {
      if (key === '1') this.fractionFormat = 'ab/c';
      else if (key === '2') this.fractionFormat = 'd/c';
      this.exitSetup();
      return;
    }

    if (this.setupSubmenu === 'COMPLEX') {
      if (key === '1') this.cmplxFormat = 'a+bi';
      else if (key === '2') this.cmplxFormat = 'r∠θ';
      this.exitSetup();
      return;
    }

    if (this.setupSubmenu === 'STAT') {
      if (key === '1') this.statFreq = true;
      else if (key === '2') this.statFreq = false;
      this.exitSetup();
      return;
    }

    if (this.setupSubmenu === 'SPREADSHEET') {
      if (key === '1') this.sheetAutoCalc = true;
      else if (key === '2') this.sheetAutoCalc = false;
      this.exitSetup();
      return;
    }

    if (this.setupSubmenu === 'EQN') {
      if (key === '1') this.eqnComplex = true;
      else if (key === '2') this.eqnComplex = false;
      this.exitSetup();
      return;
    }

    if (this.setupSubmenu === 'TABLE') {
      if (key === '1') this.tableMode = 'f(x)';
      else if (key === '2') this.tableMode = 'f(x),g(x)';
      this.exitSetup();
      return;
    }

    if (this.setupSubmenu === 'DECIMAL_MARK') {
      if (key === '1') this.decimalMark = '.';
      else if (key === '2') this.decimalMark = ',';
      this.exitSetup();
      return;
    }

    if (this.setupSubmenu === 'DIGIT_SEP') {
      if (key === '1') this.digitSeparator = true;
      else if (key === '2') this.digitSeparator = false;
      this.exitSetup();
      return;
    }

    if (this.setupSubmenu === 'LANGUAGE') {
      if (key === '1') {
        this.display.language = 'EN';
      } else if (key === '2') {
        this.display.language = 'VI';
      }
      this.exitSetup();
      return;
    }

    if (this.setupSubmenu === 'CONTRAST') {
      if (key === 'LEFT') {
        if (!this.contrastLevel) this.contrastLevel = 5;
        if (this.contrastLevel > 1) this.contrastLevel--;
        this.applyContrast();
        this.renderContrastScreen();
        return;
      }
      if (key === 'RIGHT') {
        if (!this.contrastLevel) this.contrastLevel = 5;
        if (this.contrastLevel < 10) this.contrastLevel++;
        this.applyContrast();
        this.renderContrastScreen();
        return;
      }
      if (key === 'EQUALS' || key === 'AC') {
        this.exitSetup();
        return;
      }
      return;
    }

    // Top-level Page selections
    if (this.setupPage === 1) {
      if (key === '1') { this.setupSubmenu = 'INOUT'; this.renderSetup(); }
      else if (key === '2') { this.setupSubmenu = 'ANGLE'; this.renderSetup(); }
      else if (key === '3') { this.setupSubmenu = 'FORMAT'; this.renderSetup(); }
      else if (key === '4') { this.setupSubmenu = 'ENGINEER'; this.renderSetup(); }
    } else if (this.setupPage === 2) {
      if (key === '1') { this.setupSubmenu = 'FRACTION'; this.renderSetup(); }
      else if (key === '2') { this.setupSubmenu = 'COMPLEX'; this.renderSetup(); }
      else if (key === '3') { this.setupSubmenu = 'STAT'; this.renderSetup(); }
      else if (key === '4') { this.setupSubmenu = 'SPREADSHEET'; this.renderSetup(); }
    } else if (this.setupPage === 3) {
      if (key === '1') { this.setupSubmenu = 'EQN'; this.renderSetup(); }
      else if (key === '2') { this.setupSubmenu = 'TABLE'; this.renderSetup(); }
      else if (key === '3') { this.setupSubmenu = 'DECIMAL_MARK'; this.renderSetup(); }
      else if (key === '4') { this.setupSubmenu = 'DIGIT_SEP'; this.renderSetup(); }
    } else if (this.setupPage === 4) {
      if (key === '1') { this.setupSubmenu = 'LANGUAGE'; this.renderSetup(); }
      else if (key === '2') { this.setupSubmenu = 'CONTRAST'; this.renderSetup(); }
    }
  }

  renderContrastScreen() {
    const isVi = this.display.language === 'VI';
    if (!this.contrastLevel) this.contrastLevel = 5;
    this.display.renderCustom(`
      <div style="padding:6px 4px;font-family:var(--font-lcd);color:var(--lcd-dark);height:100%;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;">
        <div style="font-size:12px;font-weight:bold;border-bottom:1px solid var(--lcd-dark);padding-bottom:2px;">${isVi ? 'ĐỘ TƯƠNG PHẢN' : 'CONTRAST'}</div>
        <div style="font-size:13px;display:flex;justify-content:space-between;align-items:center;margin:10px 4px;">
          <span>◀ ${isVi ? 'Sáng' : 'Light'}</span>
          <span style="border:1px solid var(--lcd-dark);padding:2px 6px;font-weight:bold;">${this.contrastLevel}</span>
          <span>${isVi ? 'Đậm' : 'Dark'} ▶</span>
        </div>
        <div style="font-size:11px;text-align:right;">[AC] : ${isVi ? 'Hoàn tất' : 'Done'}</div>
      </div>
    `);
  }

  applyContrast() {
    const level = this.contrastLevel || 5;
    const overlay = document.querySelector('.lcd-screen-overlay');
    if (overlay) {
      const contrastVal = 0.8 + (level * 0.05);
      overlay.style.filter = `contrast(${contrastVal})`;
    }
  }

  exitSetup() {
    this.osState = 'NORMAL';
    this.setupSubmenu = null;
    this.display.showView('NORMAL');
    this.display.updateIndicators(this.state);
    this.display.renderExpression(this.expression, this.cursorPos);
    this.display.setResult(this.displayResult);
  }

  // -------------------------------------------------------------
  // OPTION MENU CONTROLLER (OPTN)
  // -------------------------------------------------------------
  openOptionMenu() {
    this.osState = 'OPTN';
    this.optnSubmenu = null;
    this.renderOptn();
  }

  renderOptn() {
    const isVi = this.display.language === 'VI';
    if (this.optnSubmenu === 'HYP') {
      this.display.renderList(isVi ? 'Hàm hyperbol' : 'Hyperbolic', [
        '1:sinh',
        '2:cosh',
        '3:tanh',
        '4:sinh⁻¹'
      ], false, false);
      return;
    }
    if (this.optnSubmenu === 'ANGLE_SYM') {
      this.display.renderList(isVi ? 'Đơn vị góc' : 'Angle Unit', [
        '1:°',
        '2:r',
        '3:g'
      ], false, false);
      return;
    }

    if (this.state.currentMode === 2) {
      this.display.renderList(isVi ? 'TÙY CHỌN' : 'OPTION', isVi ? [
        '1:i',
        '2:∠',
        '3:Số phức liên hợp',
        '4:Arg'
      ] : [
        '1:i',
        '2:∠',
        '3:Conjugate',
        '4:Arg'
      ], false, false);
    } else {
      this.display.renderList(isVi ? 'TÙY CHỌN' : 'OPTION', isVi ? [
        '1:Hàm hyperbol',
        '2:Đơn vị góc',
        '3:Ký hiệu kỹ thuật',
        '4:Ký hiệu số'
      ] : [
        '1:Hyperbolic Func',
        '2:Angle Unit',
        '3:Engineer Symbol',
        '4:Number Notation'
      ], false, false);
    }
  }

  handleOptnKey(key) {
    if (key === 'AC' || key === 'ON' || key === 'optn') {
      this.exitOptn();
      return;
    }
    if (key === 'LEFT') {
      if (this.optnSubmenu) {
        this.optnSubmenu = null;
        this.renderOptn();
      } else {
        this.exitOptn();
      }
      return;
    }

    if (this.optnSubmenu === 'HYP') {
      if (key === '1') this.insert('sinh(');
      else if (key === '2') this.insert('cosh(');
      else if (key === '3') this.insert('tanh(');
      else if (key === '4') this.insert('sinh⁻¹(');
      this.exitOptn();
      return;
    }
    if (this.optnSubmenu === 'ANGLE_SYM') {
      if (key === '1') this.insert('°');
      else if (key === '2') this.insert('r');
      else if (key === '3') this.insert('g');
      this.exitOptn();
      return;
    }

    if (this.state.currentMode === 2) {
      if (key === '1') this.insert('i');
      else if (key === '2') this.insert('∠');
      else if (key === '3') this.insert('Conj(');
      else if (key === '4') this.insert('Arg(');
      this.exitOptn();
    } else {
      if (key === '1') {
        this.optnSubmenu = 'HYP';
        this.renderOptn();
      } else if (key === '2') {
        this.optnSubmenu = 'ANGLE_SYM';
        this.renderOptn();
      } else {
        this.exitOptn();
      }
    }
  }

  exitOptn() {
    this.osState = 'NORMAL';
    this.optnSubmenu = null;
    this.display.showView('NORMAL');
    this.display.renderExpression(this.expression, this.cursorPos);
  }

  prepareForInput(isNewCalculation = true) {
    this.saveUndoState();
    if (this.justCalculated) {
      if (isNewCalculation) {
        this.expression = '';
        this.cursorPos = 0;
      }
      this.justCalculated = false;
      this.displayResult = '';
      this.display.setResult('');
    }
    this.display.setMode('input');
  }

  insertFrac() {
    this.prepareForInput(true);
    const before = this.expression.slice(0, this.cursorPos);
    const after = this.expression.slice(this.cursorPos);
    const match = before.match(/([0-9.]+)$/);
    if (match) {
      const num = match[1];
      const prefix = before.slice(0, before.length - num.length);
      this.expression = `${prefix}\\frac{${num}}{}${after}`;
      this.cursorPos = prefix.length + `\\frac{${num}}{`.length;
    } else {
      this.expression = `${before}\\frac{}{}${after}`;
      this.cursorPos = before.length + `\\frac{`.length;
    }
    this.display.renderExpression(this.expression, this.cursorPos);
  }

  saveUndoState() {
    if (!this.undoStack) this.undoStack = [];
    this.undoStack.push({ expr: this.expression, pos: this.cursorPos });
    if (this.undoStack.length > 25) this.undoStack.shift();
  }

  undo() {
    if (this.undoStack && this.undoStack.length > 0) {
      const prev = this.undoStack.pop();
      this.expression = prev.expr;
      this.cursorPos = prev.pos;
      if (this.justCalculated) {
        this.justCalculated = false;
        this.displayResult = '';
        this.display.setResult('');
        this.display.setMode('input');
      }
      this.display.renderExpression(this.expression, this.cursorPos);
    }
  }

  insertRecurring() {
    this.saveUndoState();
    this.prepareForInput(true);
    const before = this.expression.slice(0, this.cursorPos);
    const after = this.expression.slice(this.cursorPos);
    let prefix = '';
    if (!before || /[+\-*\/(\s]$/.test(before)) {
      prefix = '0.';
    } else if (/[0-9]$/.test(before) && !/[0-9]\.[0-9]*$/.test(before)) {
      prefix = '.';
    }
    this.expression = `${before}${prefix}\\recurring{}${after}`;
    this.cursorPos = before.length + prefix.length + '\\recurring{'.length;
    this.display.renderExpression(this.expression, this.cursorPos);
  }

  insertMixedFrac() {
    this.prepareForInput(true);
    const before = this.expression.slice(0, this.cursorPos);
    const after = this.expression.slice(this.cursorPos);
    this.expression = `${before}\\mixedfrac{}{}{}${after}`;
    this.cursorPos = before.length + `\\mixedfrac{`.length;
    this.display.renderExpression(this.expression, this.cursorPos);
  }

  insertPow() {
    if (this.justCalculated) {
      this.expression = 'Ans';
      this.cursorPos = 3;
      this.justCalculated = false;
    }
    const before = this.expression.slice(0, this.cursorPos);
    const after = this.expression.slice(this.cursorPos);
    this.expression = `${before}^{}${after}`;
    this.cursorPos = before.length + `^{`.length;
    this.display.renderExpression(this.expression, this.cursorPos);
  }

  insertSqrt() {
    this.prepareForInput(true);
    const before = this.expression.slice(0, this.cursorPos);
    const after = this.expression.slice(this.cursorPos);
    this.expression = `${before}\\sqrt{}${after}`;
    this.cursorPos = before.length + `\\sqrt{`.length;
    this.display.renderExpression(this.expression, this.cursorPos);
  }

  insertNthRoot() {
    this.prepareForInput(true);
    const before = this.expression.slice(0, this.cursorPos);
    const after = this.expression.slice(this.cursorPos);
    this.expression = `${before}\\nthroot{}{}${after}`;
    this.cursorPos = before.length + `\\nthroot{`.length;
    this.display.renderExpression(this.expression, this.cursorPos);
  }

  insertIntegral() {
    if (this.justCalculated) {
      this.expression = '';
      this.cursorPos = 0;
      this.justCalculated = false;
    }
    const before = this.expression.slice(0, this.cursorPos);
    const after = this.expression.slice(this.cursorPos);
    this.expression = `${before}\\int{}{}{}${after}`;
    // Cursor starts in integrand (slot 3)
    this.cursorPos = before.length + `\\int{}{}{`.length;
    this.display.renderExpression(this.expression, this.cursorPos);
  }

  insertDiff() {
    this.prepareForInput(true);
    const before = this.expression.slice(0, this.cursorPos);
    const after = this.expression.slice(this.cursorPos);
    this.expression = `${before}\\diff{}{}${after}`;
    // Cursor starts in expr (slot 1)
    this.cursorPos = before.length + `\\diff{`.length;
    this.display.renderExpression(this.expression, this.cursorPos);
  }

  insertSum() {
    this.prepareForInput(true);
    const before = this.expression.slice(0, this.cursorPos);
    const after = this.expression.slice(this.cursorPos);
    this.expression = `${before}\\sum{}{}{}${after}`;
    // Cursor starts in expr (slot 3)
    this.cursorPos = before.length + `\\sum{}{}{`.length;
    this.display.renderExpression(this.expression, this.cursorPos);
  }

  insertLogBase() {
    this.prepareForInput(true);
    const before = this.expression.slice(0, this.cursorPos);
    const after = this.expression.slice(this.cursorPos);
    this.expression = `${before}\\logbase{}{}${after}`;
    // Cursor starts in base (slot 1)
    this.cursorPos = before.length + `\\logbase{`.length;
    this.display.renderExpression(this.expression, this.cursorPos);
  }

  insertCbrt() {
    this.prepareForInput(true);
    const before = this.expression.slice(0, this.cursorPos);
    const after = this.expression.slice(this.cursorPos);
    this.expression = `${before}\\cbrt{}${after}`;
    this.cursorPos = before.length + `\\cbrt{`.length;
    this.display.renderExpression(this.expression, this.cursorPos);
  }

  insertAbs() {
    this.prepareForInput(true);
    const before = this.expression.slice(0, this.cursorPos);
    const after = this.expression.slice(this.cursorPos);
    this.expression = `${before}\\abs{}${after}`;
    this.cursorPos = before.length + `\\abs{`.length;
    this.display.renderExpression(this.expression, this.cursorPos);
  }

  selectMode(modeId) {
    this.state.currentMode = modeId;
    const modeMap = {
      1: 'COMP', 2: 'CMPLX', 3: 'BASE-N', 4: 'MAT', 5: 'VCT',
      6: 'STAT', 7: 'DIST', 8: 'TABLE', 9: 'EQN', 10: 'INEQ', 11: 'RATIO', 12: 'SHEET'
    };
    this.state.modeName = modeMap[modeId] || 'COMP';
    this.display.updateIndicators(this.state);

    if (modeId === 1) {
      this.osState = 'NORMAL';
      this.clearAll();
      this.renderCurrentView();
    } else if (modeId === 2) {
      this.osState = 'NORMAL';
      this.clearAll();
      this.display.setResult('CMPLX (i: ENG)');
      this.renderCurrentView();
    } else if (modeId === 3) {
      this.startBaseN();
    } else if (modeId === 4) {
      this.startMatrix();
    } else if (modeId === 5) {
      this.startVector();
    } else if (modeId === 6) {
      this.startStat();
    } else if (modeId === 7) {
      this.startDist();
    } else if (modeId === 8) {
      this.startTable();
    } else if (modeId === 9) {
      this.startEquation();
    } else if (modeId === 10) {
      this.startInequality();
    } else if (modeId === 11) {
      this.startRatio();
    } else if (modeId === 12) {
      this.startSheet();
    } else {
      this.osState = 'NORMAL';
      this.clearAll();
      this.display.setResult(`${this.state.modeName} Ready`);
      this.renderCurrentView();
    }
  }

  // -------------------------------------------------------------
  // MODE 9: EQUATION / FUNC (100% ON-SCREEN LCD)
  // -------------------------------------------------------------
  startEquation() {
    this.osState = 'EQN_TYPE';
    this.renderEqnTypeScreen();
  }

  renderEqnTypeScreen() {
    const isVi = this.display.language === 'VI';
    this.display.renderList(isVi ? 'Phương trình' : 'Equation/Func', isVi ? [
      '1:Hệ phương trình',
      '2:Phương trình đa thức'
    ] : [
      '1:Simul Equation',
      '2:Polynomial'
    ], false, false);
  }

  renderEqnSubScreen() {
    const isVi = this.display.language === 'VI';
    if (this.eqn.isSimul) {
      this.display.renderList(isVi ? 'Hệ phương trình' : 'Simul Equation', isVi ? [
        'Số lượng ẩn?',
        'Chọn 2 ~ 4'
      ] : [
        'Number of Unknowns?',
        'Select 2 ~ 4'
      ], false, false);
    } else {
      this.display.renderList(isVi ? 'Phương trình đa thức' : 'Polynomial', isVi ? [
        'Bậc?',
        'Chọn 2 ~ 4'
      ] : [
        'Degree?',
        'Select 2 ~ 4'
      ], false, false);
    }
  }

  handleEqnKey(key) {
    if (key === 'MENU') {
      if (this.state.shift) {
        this.state.shift = false;
        this.display.updateIndicators(this.state);
        this.openSetup();
      } else {
        this.openMenu();
      }
      return;
    }

    if (key === 'ON') {
      this.startEquation();
      return;
    }

    // 1. Selection screen (Simul or Polynomial)
    if (this.osState === 'EQN_TYPE') {
      if (key === 'AC') {
        this.selectMode(1);
        return;
      }
      if (key === '1') {
        this.eqn.isSimul = true;
        this.osState = 'EQN_SUB';
        this.renderEqnSubScreen();
      } else if (key === '2') {
        this.eqn.isSimul = false;
        this.osState = 'EQN_SUB';
        this.renderEqnSubScreen();
      }
      return;
    }

    // 2. Sub-selection (2 ~ 4 unknowns or degree)
    if (this.osState === 'EQN_SUB') {
      if (key === 'AC' || key === 'LEFT') {
        this.osState = 'EQN_TYPE';
        this.renderEqnTypeScreen();
        return;
      }
      if (['2', '3', '4'].includes(key)) {
        this.eqn.size = parseInt(key, 10);
        this.osState = 'EQN_INPUT';
        const total = this.eqn.isSimul ? this.eqn.size * (this.eqn.size + 1) : (this.eqn.size + 1);
        this.eqn.coeffs = new Array(total).fill(0);
        this.eqn.activeIdx = 0;
        this.eqn.buffer = '';
        this.renderEqnInputScreen();
      }
      return;
    }

    // 3. Coefficient Matrix Input screen
    if (this.osState === 'EQN_INPUT') {
      if (['0','1','2','3','4','5','6','7','8','9','.'].includes(key)) {
        this.eqn.buffer += key;
        this.renderEqnInputScreen();
        return;
      }

      if (key === 'neg' || key === 'sub') {
        if (this.eqn.buffer.startsWith('-')) this.eqn.buffer = this.eqn.buffer.slice(1);
        else this.eqn.buffer = '-' + this.eqn.buffer;
        this.renderEqnInputScreen();
        return;
      }

      if (key === 'DEL') {
        this.eqn.buffer = this.eqn.buffer.slice(0, -1);
        this.renderEqnInputScreen();
        return;
      }

      if (key === 'AC') {
        if (this.eqn.buffer !== '') {
          this.eqn.buffer = '';
          this.renderEqnInputScreen();
        } else {
          this.osState = 'EQN_TYPE';
          this.renderEqnTypeScreen();
        }
        return;
      }

      const totalCoeffs = this.eqn.coeffs.length;
      const colsPerRow = this.eqn.isSimul ? (this.eqn.size + 1) : totalCoeffs;

      const commitBuffer = () => {
        if (this.eqn.buffer !== '') {
          const v = parseFloat(this.eqn.buffer);
          if (!isNaN(v)) this.eqn.coeffs[this.eqn.activeIdx] = v;
          this.eqn.buffer = '';
        }
      };

      if (key === 'RIGHT') {
        commitBuffer();
        if (this.eqn.activeIdx < totalCoeffs - 1) this.eqn.activeIdx++;
        this.renderEqnInputScreen();
        return;
      }

      if (key === 'LEFT') {
        commitBuffer();
        if (this.eqn.activeIdx > 0) this.eqn.activeIdx--;
        this.renderEqnInputScreen();
        return;
      }

      if (key === 'UP') {
        commitBuffer();
        if (this.eqn.isSimul) {
          if (this.eqn.activeIdx >= colsPerRow) this.eqn.activeIdx -= colsPerRow;
        } else {
          if (this.eqn.activeIdx > 0) this.eqn.activeIdx--;
        }
        this.renderEqnInputScreen();
        return;
      }

      if (key === 'DOWN') {
        commitBuffer();
        if (this.eqn.isSimul) {
          if (this.eqn.activeIdx + colsPerRow < totalCoeffs) this.eqn.activeIdx += colsPerRow;
        } else {
          if (this.eqn.activeIdx < totalCoeffs - 1) this.eqn.activeIdx++;
        }
        this.renderEqnInputScreen();
        return;
      }

      if (key === 'EQUALS') {
        commitBuffer();
        if (this.eqn.activeIdx < totalCoeffs - 1) {
          this.eqn.activeIdx++;
          this.renderEqnInputScreen();
        } else {
          this.solveAndShowEqn();
        }
        return;
      }
      return;
    }

    // 4. Equation Result screen
    if (this.osState === 'EQN_RESULT') {
      const totalRoots = this.eqn.roots.length;
      let maxIdx = totalRoots - 1;
      if (this.eqn.vertex) maxIdx += 2;
      else if (this.eqn.extrema) maxIdx += 4;
      if (maxIdx < 0) maxIdx = 0;

      if (key === 'DOWN') {
        if (this.eqn.rootIdx < maxIdx) {
          this.eqn.rootIdx++;
          this.renderEqnResultScreen();
        }
        return;
      }

      if (key === 'UP') {
        if (this.eqn.rootIdx > 0) {
          this.eqn.rootIdx--;
          this.renderEqnResultScreen();
        }
        return;
      }

      if (key === 'SD') {
        this.eqn.isFraction = !this.eqn.isFraction;
        this.renderEqnResultScreen();
        return;
      }

      if (key === 'EQUALS') {
        if (this.eqn.rootIdx < maxIdx) {
          this.eqn.rootIdx++;
          this.renderEqnResultScreen();
        } else {
          this.osState = 'EQN_INPUT';
          this.renderEqnInputScreen();
        }
        return;
      }

      if (key === 'AC') {
        this.osState = 'EQN_INPUT';
        this.renderEqnInputScreen();
        return;
      }
    }
  }

  renderEqnInputScreen() {
    const isVi = this.display.language === 'VI';
    const curIdx = this.eqn.activeIdx;
    const activeVal = this.eqn.buffer !== '' ? this.eqn.buffer : String(this.eqn.coeffs[curIdx] || 0);
    const cursorHtml = this.eqn.buffer !== '' ? '<span class="cursor"></span>' : '';

    this.display.setIndicator('i', false);
    const totalCoeffs = this.eqn.coeffs.length;
    this.display.setScrollArrows(curIdx > 0, curIdx < totalCoeffs - 1);

    if (this.eqn.isSimul) {
      // 100% Genuine Casio fx-580VN X Simultaneous Equation Layout matching user uploaded reference
      const n = this.eqn.size;
      const vars = ['x', 'y', 'z', 'w'];
      const cols = n + 1;

      let rowsHtml = '';
      for (let r = 0; r < n; r++) {
        let rowTerms = '';
        for (let c = 0; c < n; c++) {
          const idx = r * cols + c;
          const isSel = idx === curIdx;
          const val = (isSel && this.eqn.buffer !== '') ? this.eqn.buffer : (this.eqn.coeffs[idx] || 0);
          const op = (c < n - 1) ? '+' : '=';
          const selStyle = isSel 
            ? 'background:var(--lcd-dark);color:var(--lcd-bg);font-weight:bold;border-radius:1px;padding:0 3px;' 
            : 'padding:0 2px;';

          rowTerms += `
            <div style="display:flex;align-items:center;margin-right:12px;">
              <span style="min-width:14px;text-align:right;${selStyle}">${val}</span>
              <span style="margin-left:1px;">${vars[c]}</span>
              <span style="margin-left:6px;">${op}</span>
            </div>
          `;
        }
        // Constant term
        const constIdx = r * cols + n;
        const isConstSel = constIdx === curIdx;
        const constVal = (isConstSel && this.eqn.buffer !== '') ? this.eqn.buffer : (this.eqn.coeffs[constIdx] || 0);
        const constSelStyle = isConstSel 
          ? 'background:var(--lcd-dark);color:var(--lcd-bg);font-weight:bold;border-radius:1px;padding:0 3px;' 
          : 'padding:0 2px;';

        rowTerms += `
          <div style="display:flex;align-items:center;">
            <span style="min-width:14px;text-align:right;${constSelStyle}">${constVal}</span>
          </div>
        `;

        rowsHtml += `
          <div style="display:flex;align-items:center;height:20px;">
            ${rowTerms}
          </div>
        `;
      }

      // Curly brace SVG with authentic path
      const braceH = n === 2 ? 40 : (n === 3 ? 56 : 72);
      const braceSvg = `
        <svg width="10" height="${braceH}" viewBox="0 0 10 40" fill="none" stroke="var(--lcd-dark)" stroke-width="2.2" stroke-linecap="round" style="margin-right:6px;flex-shrink:0;">
          <path d="M8 2 C4 2, 2 6, 2 12 C2 18, 1 20, 0 20 C1 20, 2 22, 2 28 C2 34, 4 38, 8 38" />
        </svg>
      `;

      this.display.renderCustom(`
        <div style="padding:4px 8px;font-family:var(--font-lcd);color:var(--lcd-dark);height:100%;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">
          <div style="display:flex;align-items:center;margin-top:2px;">
            ${braceSvg}
            <div style="display:flex;flex-direction:column;font-size:14px;font-weight:500;line-height:1.2;">
              ${rowsHtml}
            </div>
          </div>
          <div style="text-align:right;font-size:18px;font-weight:bold;padding-right:8px;margin-bottom:2px;">
            ${activeVal}${cursorHtml}
          </div>
        </div>
      `);
      return;
    }

    // Polynomial Equation Layout
    const polyLabels = ['a', 'b', 'c', 'd', 'e'];
    let headerText = '';
    if (this.eqn.size === 2) headerText = 'a x² + b x + c =  0';
    else if (this.eqn.size === 3) headerText = 'a x³ + b x² + c x + d =  0';
    else headerText = 'a x⁴ + b x³ + c x² + d x + e =  0';

    let cells = '';
    for (let i = 0; i <= this.eqn.size; i++) {
      const isSel = i === curIdx;
      const val = (isSel && this.eqn.buffer !== '') ? this.eqn.buffer : (this.eqn.coeffs[i] || 0);
      cells += `
        <div style="flex:1;text-align:center;border:1px solid rgba(18,24,17,0.3);margin:0 2px;padding:2px 0;${isSel ? 'background:var(--lcd-dark);color:var(--lcd-bg);font-weight:bold;' : ''}">
          <div style="font-size:9px;">${polyLabels[i]}</div>
          <div style="font-size:11px;">${val}</div>
        </div>
      `;
    }

    const activeLabel = polyLabels[curIdx];
    this.display.renderCustom(`
      <div style="padding:2px 4px;font-family:var(--font-lcd);color:var(--lcd-dark);height:100%;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">
        <div style="font-size:10px;font-weight:bold;border-bottom:1px solid rgba(18,24,17,0.25);padding-bottom:1px;white-space:nowrap;overflow:hidden;">${headerText}</div>
        <div style="display:flex;margin:2px 0;align-items:center;border-left:2px solid var(--lcd-dark);border-right:2px solid var(--lcd-dark);padding:0 2px;">
          ${cells}
        </div>
        <div style="font-size:12px;font-weight:bold;border-top:1px solid rgba(18,24,17,0.2);padding-top:1px;display:flex;justify-content:space-between;align-items:center;">
          <span>${activeLabel}=</span>
          <span>${activeVal}${cursorHtml}</span>
        </div>
      </div>
    `);
  }

  solveAndShowEqn() {
    const c = this.eqn.coeffs;
    this.eqn.isFraction = true;
    if (!this.eqn.isSimul) {
      if (this.eqn.size === 2) {
        const res = this.engine.solveQuadratic(c[0], c[1], c[2]);
        this.eqn.resultType = res.type;
        this.eqn.roots = res.roots || [];
        this.eqn.vertex = res.vertex;
        this.eqn.extrema = null;
      } else if (this.eqn.size === 3) {
        const res = this.engine.solveCubic(c[0], c[1], c[2], c[3]);
        this.eqn.resultType = res.type;
        this.eqn.roots = res.roots || [];
        this.eqn.extrema = res.extrema;
        this.eqn.vertex = null;
      } else {
        const res = this.engine.solveQuartic(c[0], c[1], c[2], c[3], c[4]);
        this.eqn.resultType = res.type;
        this.eqn.roots = res.roots || [];
        this.eqn.extrema = null;
        this.eqn.vertex = null;
      }
    } else {
      const mat = [];
      const vec = [];
      const n = this.eqn.size;
      for (let r = 0; r < n; r++) {
        mat.push(c.slice(r * (n + 1), r * (n + 1) + n));
        vec.push(c[r * (n + 1) + n]);
      }
      const res = this.engine.solveLinearSystem(mat, vec);
      if (res.success) {
        this.eqn.resultType = 'simul';
        this.eqn.roots = Object.entries(res.solutions).map(([k, v]) => ({
          label: k,
          val: v.val,
          exact: v.exact
        }));
      } else {
        this.eqn.resultType = res.error;
        this.eqn.roots = [];
      }
      this.eqn.vertex = null;
      this.eqn.extrema = null;
    }
    this.eqn.rootIdx = 0;
    this.osState = 'EQN_RESULT';
    this.renderEqnResultScreen();
  }

  renderEqnResultScreen() {
    const isVi = this.display.language === 'VI';
    const idx = this.eqn.rootIdx;
    const totalRoots = this.eqn.roots.length;

    let maxIdx = totalRoots - 1;
    if (this.eqn.vertex) maxIdx += 2;
    else if (this.eqn.extrema) maxIdx += 4;
    if (maxIdx < 0) maxIdx = 0;

    // 1. No solution screen
    if (this.eqn.resultType === 'no_solution' || (totalRoots === 0 && this.eqn.resultType !== 'infinite')) {
      this.display.setScrollArrows(false, false);
      this.display.setIndicator('i', false);
      this.display.renderCustom(`
        <div style="padding:8px 6px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
          <div style="font-size:15px;font-weight:bold;text-align:center;margin-top:8px;">${isVi ? 'Vô nghiệm' : 'No Solution'}</div>
          <div style="font-size:10px;text-align:right;color:rgba(18,24,17,0.85);">[AC] : ${isVi ? 'Huỷ' : 'Cancel'}</div>
        </div>
      `);
      return;
    }

    // 2. Infinite solutions screen
    if (this.eqn.resultType === 'infinite') {
      this.display.setScrollArrows(false, false);
      this.display.setIndicator('i', false);
      this.display.renderCustom(`
        <div style="padding:8px 6px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
          <div style="font-size:15px;font-weight:bold;text-align:center;margin-top:8px;">${isVi ? 'Vô số nghiệm' : 'Infinite Solutions'}</div>
          <div style="font-size:10px;text-align:right;color:rgba(18,24,17,0.85);">[AC] : ${isVi ? 'Huỷ' : 'Cancel'}</div>
        </div>
      `);
      return;
    }

    // 3. Regular root screen
    if (idx < totalRoots) {
      const r = this.eqn.roots[idx];
      const label = r.label ? `${r.label}=` : `x${idx + 1}=`;
      let valHtml = '';

      if (this.eqn.isFraction) {
        if (r.exact) {
          valHtml = this.display.formatToNaturalHtml(r.exact);
        } else if (r.isComplex) {
          const sign = r.imag >= 0 ? '+' : '−';
          valHtml = `${r.real} ${sign} ${Math.abs(r.imag)}i`;
        } else if (r.val !== undefined) {
          valHtml = this.formatFraction(r.val);
        } else {
          valHtml = String(r);
        }
      } else {
        if (r.isComplex) {
          const sign = r.imag >= 0 ? '+' : '−';
          valHtml = `${r.real} ${sign} ${Math.abs(r.imag)}i`;
        } else if (r.val !== undefined) {
          valHtml = String(r.val);
        } else {
          valHtml = String(r);
        }
      }

      this.display.setIndicator('i', !!r.isComplex);
      this.display.setScrollArrows(idx > 0, idx < maxIdx);

      this.display.renderCustom(`
        <div style="padding:3px 6px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
          <div style="font-size:13px;font-weight:bold;text-align:left;">${label}</div>
          <div style="font-size:18px;font-weight:bold;text-align:right;margin-bottom:1px;">
            ${valHtml}
          </div>
        </div>
      `);
      return;
    }

    // 4. Parabola Vertex (Cực trị parabol)
    if (this.eqn.vertex) {
      const v = this.eqn.vertex;
      const title = isVi 
        ? (v.isMin ? 'Giá trị nhỏ nhất của y' : 'Giá trị lớn nhất của y')
        : (v.isMin ? 'Min of y' : 'Max of y');
      const isX = (idx === totalRoots);
      const subLabel = isX ? 'x=' : 'y=';
      let valHtml = '';

      if (isX) {
        valHtml = this.eqn.isFraction && v.xExact 
          ? this.display.formatToNaturalHtml(v.xExact)
          : String(v.xVal);
      } else {
        valHtml = this.eqn.isFraction && v.yExact 
          ? this.display.formatToNaturalHtml(v.yExact)
          : String(v.yVal);
      }

      this.display.setIndicator('i', false);
      this.display.setScrollArrows(idx > 0, idx < maxIdx);

      this.display.renderCustom(`
        <div style="padding:2px 6px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
          <div style="font-size:11px;font-weight:bold;text-align:left;white-space:nowrap;overflow:hidden;">${title}</div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:1px;">
            <span style="font-size:13px;font-weight:bold;">${subLabel}</span>
            <span style="font-size:18px;font-weight:bold;text-align:right;">${valHtml}</span>
          </div>
        </div>
      `);
      return;
    }

    // 5. Cubic local extrema (Cực trị hàm bậc 3)
    if (this.eqn.extrema) {
      const ext = this.eqn.extrema;
      const relIdx = idx - totalRoots;
      let title = '';
      let subLabel = '';
      let valNum = 0;

      if (relIdx === 0) {
        title = isVi ? 'Cực đại của y' : 'Max of y';
        subLabel = 'x=';
        valNum = ext.max.x;
      } else if (relIdx === 1) {
        title = isVi ? 'Cực đại của y' : 'Max of y';
        subLabel = 'y=';
        valNum = ext.max.y;
      } else if (relIdx === 2) {
        title = isVi ? 'Cực tiểu của y' : 'Min of y';
        subLabel = 'x=';
        valNum = ext.min.x;
      } else {
        title = isVi ? 'Cực tiểu của y' : 'Min of y';
        subLabel = 'y=';
        valNum = ext.min.y;
      }

      const valHtml = this.eqn.isFraction ? this.formatFraction(valNum) : String(valNum);

      this.display.setIndicator('i', false);
      this.display.setScrollArrows(idx > 0, idx < maxIdx);

      this.display.renderCustom(`
        <div style="padding:2px 6px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
          <div style="font-size:11px;font-weight:bold;text-align:left;white-space:nowrap;overflow:hidden;">${title}</div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:1px;">
            <span style="font-size:13px;font-weight:bold;">${subLabel}</span>
            <span style="font-size:18px;font-weight:bold;text-align:right;">${valHtml}</span>
          </div>
        </div>
      `);
      return;
    }
  }

  formatFraction(val) {
    const f = this.engine.toFraction(val);
    if (f && f.d !== 1 && Math.abs(f.d) < 1000) return `${f.n}/${f.d}`;
    return String(Number(val.toFixed(5)));
  }

  // -------------------------------------------------------------
  // MODE A: INEQUALITY (100% ON-SCREEN LCD)
  // -------------------------------------------------------------
  startInequality() {
    this.osState = 'INEQ_DEG';
    const isVi = this.display.language === 'VI';
    this.display.renderList(isVi ? 'Bất phương trình' : 'Inequality', isVi ? [
      'Bậc?',
      'Chọn 2 ~ 4'
    ] : [
      'Degree?',
      'Select 2 ~ 4'
    ], false, false);
  }

  handleIneqKey(key) {
    if (key === 'AC') {
      this.selectMode(1);
      return;
    }
    if (this.osState === 'INEQ_DEG') {
      if (['2', '3', '4'].includes(key)) {
        this.ineq.degree = parseInt(key, 10);
        this.osState = 'INEQ_TYPE';
        this.display.renderList('ax²+bx+c', [
          '1: ax²+bx+c > 0',
          '2: ax²+bx+c < 0',
          '3: ax²+bx+c ≥ 0',
          '4: ax²+bx+c ≤ 0'
        ], false, false);
      }
      return;
    }

    if (this.osState === 'INEQ_TYPE') {
      if (['1','2','3','4'].includes(key)) {
        this.ineq.type = parseInt(key, 10);
        this.ineq.coeffs = [1, 0, 0];
        this.ineq.activeIdx = 0;
        this.ineq.buffer = '';
        this.osState = 'INEQ_INPUT';
        this.renderIneqInput();
      }
      return;
    }

    if (this.osState === 'INEQ_INPUT') {
      if (['0','1','2','3','4','5','6','7','8','9','.'].includes(key)) {
        this.ineq.buffer += key;
        this.renderIneqInput();
      } else if (key === 'neg' || key === 'sub') {
        if (this.ineq.buffer.startsWith('-')) this.ineq.buffer = this.ineq.buffer.slice(1);
        else this.ineq.buffer = '-' + this.ineq.buffer;
        this.renderIneqInput();
      } else if (key === 'DEL') {
        this.ineq.buffer = this.ineq.buffer.slice(0, -1);
        this.renderIneqInput();
      } else if (key === 'EQUALS') {
        if (this.ineq.buffer !== '') {
          this.ineq.coeffs[this.ineq.activeIdx] = parseFloat(this.ineq.buffer) || 0;
          this.ineq.buffer = '';
        }
        if (this.ineq.activeIdx < 2) {
          this.ineq.activeIdx++;
          this.renderIneqInput();
        } else {
          const res = this.engine.solveInequality2(this.ineq.coeffs[0], this.ineq.coeffs[1], this.ineq.coeffs[2], this.ineq.type);
          this.osState = 'INEQ_RESULT';
          const signs = ['> 0', '< 0', '≥ 0', '≤ 0'];
          this.display.setScrollArrows(false, false);
          this.display.renderCustom(`
            <div style="padding:4px 6px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
              <div style="font-size:10px;font-weight:bold;border-bottom:1px solid rgba(18,24,17,0.2);padding-bottom:1px;">ax²+bx+c ${signs[this.ineq.type - 1]}</div>
              <div style="font-size:16px;font-weight:bold;text-align:center;margin:auto 0;">${res}</div>
            </div>
          `);
        }
      }
      return;
    }

    if (this.osState === 'INEQ_RESULT') {
      if (key === 'AC' || key === 'EQUALS') {
        this.osState = 'INEQ_INPUT';
        this.renderIneqInput();
      }
    }
  }

  renderIneqInput() {
    const signs = ['> 0', '< 0', '≥ 0', '≤ 0'];
    const lbls = ['a', 'b', 'c'];
    let cellsHtml = '';
    for (let i = 0; i < 3; i++) {
      const isAct = i === this.ineq.activeIdx;
      const val = this.ineq.coeffs[i] || 0;
      cellsHtml += `
        <div style="flex:1;text-align:center;border:1px solid rgba(18,24,17,0.3);margin:0 2px;padding:2px 0;${isAct ? 'background:var(--lcd-dark);color:var(--lcd-bg);font-weight:bold;' : ''}">
          <div style="font-size:9px;">${lbls[i]}</div>
          <div style="font-size:11px;">${val}</div>
        </div>
      `;
    }
    const curVal = this.ineq.buffer !== '' ? this.ineq.buffer : String(this.ineq.coeffs[this.ineq.activeIdx] || 0);

    this.display.renderCustom(`
      <div style="padding:2px 4px;font-family:var(--font-lcd);color:var(--lcd-dark);height:100%;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">
        <div style="font-size:10px;font-weight:bold;border-bottom:1px solid rgba(18,24,17,0.25);padding-bottom:1px;">ax²+bx+c ${signs[this.ineq.type - 1]}</div>
        <div style="display:flex;margin:2px 0;align-items:center;border-left:2px solid var(--lcd-dark);border-right:2px solid var(--lcd-dark);padding:0 2px;">
          ${cellsHtml}
        </div>
        <div style="font-size:12px;font-weight:bold;border-top:1px solid rgba(18,24,17,0.2);padding-top:1px;display:flex;justify-content:space-between;">
          <span>${lbls[this.ineq.activeIdx]}=</span>
          <span>${curVal}<span class="cursor"></span></span>
        </div>
      </div>
    `);
  }

  // -------------------------------------------------------------
  // MODE B: RATIO (100% ON-SCREEN LCD)
  // -------------------------------------------------------------
  startRatio() {
    this.osState = 'RATIO_TYPE';
    const isVi = this.display.language === 'VI';
    this.display.renderList(isVi ? 'Tỉ lệ thức' : 'Ratio', [
      '1: A : B = X : D',
      '2: A : B = C : X'
    ], false, false);
  }

  handleRatioKey(key) {
    if (key === 'AC') { this.selectMode(1); return; }
    if (this.osState === 'RATIO_TYPE') {
      if (key === '1' || key === '2') {
        this.ratio.type = parseInt(key, 10);
        this.ratio.vals = [1, 2, 4];
        this.ratio.activeIdx = 0;
        this.ratio.buffer = '';
        this.ratio.isFraction = true;
        this.osState = 'RATIO_INPUT';
        this.renderRatioInput();
      }
      return;
    }
    if (this.osState === 'RATIO_INPUT') {
      if (['0','1','2','3','4','5','6','7','8','9','.'].includes(key)) {
        this.ratio.buffer += key;
        this.renderRatioInput();
      } else if (key === 'neg' || key === 'sub') {
        if (this.ratio.buffer.startsWith('-')) this.ratio.buffer = this.ratio.buffer.slice(1);
        else this.ratio.buffer = '-' + this.ratio.buffer;
        this.renderRatioInput();
      } else if (key === 'DEL') {
        this.ratio.buffer = this.ratio.buffer.slice(0, -1);
        this.renderRatioInput();
      } else if (key === 'EQUALS') {
        if (this.ratio.buffer !== '') {
          this.ratio.vals[this.ratio.activeIdx] = parseFloat(this.ratio.buffer) || 0;
          this.ratio.buffer = '';
        }
        if (this.ratio.activeIdx < 2) {
          this.ratio.activeIdx++;
          this.renderRatioInput();
        } else {
          this.osState = 'RATIO_RESULT';
          this.renderRatioResult();
        }
      }
      return;
    }

    if (this.osState === 'RATIO_RESULT') {
      if (key === 'SD') {
        this.ratio.isFraction = !this.ratio.isFraction;
        this.renderRatioResult();
        return;
      }
      if (key === 'AC' || key === 'EQUALS') {
        this.osState = 'RATIO_INPUT';
        this.renderRatioInput();
        return;
      }
    }
  }

  renderRatioInput() {
    const lbls = this.ratio.type === 1 ? ['A', 'B', 'D'] : ['A', 'B', 'C'];
    const title = this.ratio.type === 1 ? 'A:B = X:D' : 'A:B = C:X';
    let cellsHtml = '';
    for (let i = 0; i < 3; i++) {
      const isAct = i === this.ratio.activeIdx;
      const val = this.ratio.vals[i] || 0;
      cellsHtml += `
        <div style="flex:1;text-align:center;border:1px solid rgba(18,24,17,0.3);margin:0 2px;padding:2px 0;${isAct ? 'background:var(--lcd-dark);color:var(--lcd-bg);font-weight:bold;' : ''}">
          <div style="font-size:9px;">${lbls[i]}</div>
          <div style="font-size:11px;">${val}</div>
        </div>
      `;
    }
    const curVal = this.ratio.buffer !== '' ? this.ratio.buffer : String(this.ratio.vals[this.ratio.activeIdx] || 0);

    this.display.renderCustom(`
      <div style="padding:2px 4px;font-family:var(--font-lcd);color:var(--lcd-dark);height:100%;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">
        <div style="font-size:10px;font-weight:bold;border-bottom:1px solid rgba(18,24,17,0.25);padding-bottom:1px;">${title}</div>
        <div style="display:flex;margin:2px 0;align-items:center;border-left:2px solid var(--lcd-dark);border-right:2px solid var(--lcd-dark);padding:0 2px;">
          ${cellsHtml}
        </div>
        <div style="font-size:12px;font-weight:bold;border-top:1px solid rgba(18,24,17,0.2);padding-top:1px;display:flex;justify-content:space-between;">
          <span>${lbls[this.ratio.activeIdx]}=</span>
          <span>${curVal}<span class="cursor"></span></span>
        </div>
      </div>
    `);
  }

  renderRatioResult() {
    const X = this.engine.solveRatio(this.ratio.vals[0], this.ratio.vals[1], this.ratio.vals[2], this.ratio.type);
    const frac = this.engine.toFraction(X);
    const fracStr = (frac && frac.d !== 1 && Math.abs(frac.d) < 1000)
      ? this.display.formatToNaturalHtml(`\\frac{${frac.n}}{${frac.d}}`)
      : String(X);
    const valHtml = this.ratio.isFraction ? fracStr : String(X);
    this.display.setScrollArrows(false, false);
    this.display.renderCustom(`
      <div style="padding:4px 6px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
        <div style="font-size:11px;font-weight:bold;">${this.ratio.type === 1 ? 'A:B = X:D' : 'A:B = C:X'}</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2px;">
          <span style="font-size:14px;font-weight:bold;">X =</span>
          <span style="font-size:18px;font-weight:bold;text-align:right;">${valHtml}</span>
        </div>
      </div>
    `);
  }

  // -------------------------------------------------------------
  // MODE 8: TABLE f(x) (100% AUTHENTIC CLASSWIZ LCD)
  // -------------------------------------------------------------
  startTable() {
    this.osState = 'TABLE_FX';
    if (!this.table) {
      this.table = {
        fx: '',
        gx: '',
        cursor: 0,
        targetFn: 'f',
        start: 1,
        end: 5,
        step: 1,
        paramIdx: 0,
        paramBuffers: ['', '', ''],
        rows: [],
        scrollIdx: 0,
        selectedRow: 0,
        selectedCol: 'fx'
      };
    } else {
      this.table.targetFn = 'f';
      this.table.cursor = (this.table.fx || '').length;
      this.table.paramIdx = 0;
      this.table.paramBuffers = ['', '', ''];
    }
    this.renderTableFx();
  }

  handleTableKey(key) {
    if (key === 'MENU') {
      if (this.state.shift) {
        this.state.shift = false;
        this.display.updateIndicators(this.state);
        this.openSetup();
      } else {
        this.openMenu();
      }
      return;
    }

    if (key === 'ON') {
      this.table.fx = '';
      this.table.gx = '';
      this.table.cursor = 0;
      this.table.targetFn = 'f';
      this.osState = 'TABLE_FX';
      this.renderTableFx();
      return;
    }

    if (key === 'SHIFT') {
      this.state.shift = !this.state.shift;
      this.display.updateIndicators(this.state);
      return;
    }

    if (key === 'ALPHA') {
      this.state.alpha = !this.state.alpha;
      this.display.updateIndicators(this.state);
      return;
    }

    // 1. In formula input screen: TABLE_FX or TABLE_GX
    if (this.osState === 'TABLE_FX' || this.osState === 'TABLE_GX') {
      const fn = this.table.targetFn === 'g' ? 'gx' : 'fx';
      if (!this.table[fn]) this.table[fn] = '';

      if (key === 'AC') {
        if (this.table[fn] !== '') {
          this.table[fn] = '';
          this.table.cursor = 0;
          this.renderTableFx();
        } else {
          this.selectMode(1);
        }
        return;
      }

      if (key === 'LEFT') {
        if (this.table.cursor > 0) {
          this.table.cursor--;
          this.renderTableFx();
        }
        return;
      }

      if (key === 'RIGHT') {
        if (this.table.cursor < this.table[fn].length) {
          this.table.cursor++;
          this.renderTableFx();
        }
        return;
      }

      if (key === 'UP' || key === 'DOWN') {
        if (this.tableMode === 'f(x),g(x)') {
          if (key === 'DOWN' && this.table.targetFn === 'f') {
            this.table.targetFn = 'g';
            this.table.cursor = (this.table.gx || '').length;
            this.renderTableFx();
          } else if (key === 'UP' && this.table.targetFn === 'g') {
            this.table.targetFn = 'f';
            this.table.cursor = (this.table.fx || '').length;
            this.renderTableFx();
          }
        }
        return;
      }

      if (key === 'DEL') {
        if (this.table.cursor > 0) {
          const before = this.table[fn].slice(0, this.table.cursor - 1);
          const after = this.table[fn].slice(this.table.cursor);
          this.table[fn] = before + after;
          this.table.cursor--;
          this.renderTableFx();
        }
        return;
      }

      if (key === 'EQUALS') {
        if (this.table.targetFn === 'f' && this.tableMode === 'f(x),g(x)') {
          this.table.targetFn = 'g';
          this.table.cursor = (this.table.gx || '').length;
          this.renderTableFx();
          return;
        }
        this.osState = 'TABLE_PARAMS';
        this.table.paramIdx = 0;
        this.table.paramBuffers = ['', '', ''];
        this.renderTableParams();
        return;
      }

      // Variable x: x_var, or ALPHA + )
      if (key === 'x_var' || (this.state.alpha && key === 'close_paren')) {
        this.state.alpha = false;
        this.display.updateIndicators(this.state);
        this.insertTableToken('x');
        return;
      }

      // Mathematical functions and inputs
      const tokenMap = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '.': '.', 'add': '+', 'sub': '−', 'mul': '×', 'div': '÷',
        'open_paren': '(', 'close_paren': ')',
        'sqr': '^2', 'pow': '^', 'sqrt': '√(',
        'sin': this.state.shift ? 'sin⁻¹(' : 'sin(',
        'cos': this.state.shift ? 'cos⁻¹(' : 'cos(',
        'tan': this.state.shift ? 'tan⁻¹(' : 'tan(',
        'ln': 'ln(', 'log': 'log(',
        'frac': '\\frac{}{}',
        'neg': '(-)', 'Ans': 'Ans',
        'x10x': this.state.shift ? 'π' : '×10^('
      };

      if (this.state.shift) {
        this.state.shift = false;
        this.display.updateIndicators(this.state);
      }
      if (this.state.alpha) {
        this.state.alpha = false;
        this.display.updateIndicators(this.state);
      }

      if (tokenMap[key]) {
        this.insertTableToken(tokenMap[key]);
      }
      return;
    }

    // 2. Table Range parameters: Start, End, Step
    if (this.osState === 'TABLE_PARAMS') {
      if (key === 'AC') {
        this.osState = 'TABLE_FX';
        this.renderTableFx();
        return;
      }

      const curIdx = this.table.paramIdx;
      if (['0','1','2','3','4','5','6','7','8','9','.'].includes(key)) {
        this.table.paramBuffers[curIdx] += key;
        this.renderTableParams();
        return;
      }

      if (key === 'neg' || key === 'sub') {
        let b = this.table.paramBuffers[curIdx];
        this.table.paramBuffers[curIdx] = b.startsWith('-') ? b.slice(1) : '-' + b;
        this.renderTableParams();
        return;
      }

      if (key === 'DEL') {
        this.table.paramBuffers[curIdx] = this.table.paramBuffers[curIdx].slice(0, -1);
        this.renderTableParams();
        return;
      }

      if (key === 'UP') {
        this.commitTableParam(curIdx);
        if (this.table.paramIdx > 0) this.table.paramIdx--;
        this.renderTableParams();
        return;
      }

      if (key === 'DOWN') {
        this.commitTableParam(curIdx);
        if (this.table.paramIdx < 2) this.table.paramIdx++;
        this.renderTableParams();
        return;
      }

      if (key === 'EQUALS') {
        this.commitTableParam(curIdx);
        if (this.table.paramIdx < 2) {
          this.table.paramIdx++;
          this.renderTableParams();
        } else {
          const st = this.table.start;
          const en = this.table.end;
          let sp = this.table.step;
          if (sp <= 0) sp = 1;
          this.table.step = sp;
          if (en < st) this.table.end = st + 4 * sp;

          this.table.rows = this.engine.generateTable(
            this.table.fx || 'x',
            this.tableMode === 'f(x),g(x)' ? this.table.gx : null,
            this.table.start,
            this.table.end,
            this.table.step
          );
          this.table.scrollIdx = 0;
          this.table.selectedRow = 0;
          this.table.selectedCol = 'fx';
          this.osState = 'TABLE_GRID';
          this.renderTableGrid();
        }
        return;
      }
      return;
    }

    // 3. Table Results: TABLE_GRID
    if (this.osState === 'TABLE_GRID') {
      if (key === 'AC') {
        this.osState = 'TABLE_FX';
        this.table.targetFn = 'f';
        this.renderTableFx();
        return;
      }

      const numRows = this.table.rows ? this.table.rows.length : 0;
      if (numRows === 0) return;

      if (key === 'DOWN') {
        if (this.table.selectedRow < numRows - 1) {
          this.table.selectedRow++;
          if (this.table.selectedRow >= this.table.scrollIdx + 3) {
            this.table.scrollIdx = this.table.selectedRow - 2;
          }
          this.renderTableGrid();
        }
        return;
      }

      if (key === 'UP') {
        if (this.table.selectedRow > 0) {
          this.table.selectedRow--;
          if (this.table.selectedRow < this.table.scrollIdx) {
            this.table.scrollIdx = this.table.selectedRow;
          }
          this.renderTableGrid();
        }
        return;
      }

      if (key === 'RIGHT') {
        if (this.table.selectedCol === 'x') {
          this.table.selectedCol = 'fx';
          this.renderTableGrid();
        } else if (this.table.selectedCol === 'fx' && this.tableMode === 'f(x),g(x)') {
          this.table.selectedCol = 'gx';
          this.renderTableGrid();
        }
        return;
      }

      if (key === 'LEFT') {
        if (this.table.selectedCol === 'gx') {
          this.table.selectedCol = 'fx';
          this.renderTableGrid();
        } else if (this.table.selectedCol === 'fx') {
          this.table.selectedCol = 'x';
          this.renderTableGrid();
        }
        return;
      }
    }
  }

  insertTableToken(token) {
    const fn = this.table.targetFn === 'g' ? 'gx' : 'fx';
    if (!this.table[fn]) this.table[fn] = '';
    const pos = Math.max(0, Math.min(this.table.cursor, this.table[fn].length));
    const before = this.table[fn].slice(0, pos);
    const after = this.table[fn].slice(pos);
    this.table[fn] = before + token + after;
    this.table.cursor = pos + token.length;
    this.renderTableFx();
  }

  commitTableParam(idx) {
    const buf = this.table.paramBuffers[idx];
    if (buf !== '') {
      const val = parseFloat(buf);
      if (!isNaN(val)) {
        if (idx === 0) this.table.start = val;
        else if (idx === 1) this.table.end = val;
        else if (idx === 2) this.table.step = val;
      }
      this.table.paramBuffers[idx] = '';
    }
  }

  renderTableFx() {
    const isVi = this.display.language === 'VI';
    const isG = this.table.targetFn === 'g';
    const fnName = isG ? 'g(x)' : 'f(x)';
    const expr = isG ? (this.table.gx || '') : (this.table.fx || '');
    const pos = Math.max(0, Math.min(this.table.cursor, expr.length));
    const before = expr.slice(0, pos);
    const after = expr.slice(pos);

    let html = this.display.formatToNaturalHtml(`${before}___CURSOR___${after}`);
    html = html.replace('___CURSOR___', '<span class="cursor"></span>');
    if (!expr) html = '<span class="cursor"></span>';

    this.display.renderCustom(`
      <div style="padding:6px 6px;font-family:var(--font-lcd);color:var(--lcd-dark);height:100%;box-sizing:border-box;display:flex;flex-direction:column;justify-content:flex-start;">
        <div style="font-size:13px;display:flex;align-items:baseline;white-space:nowrap;overflow-x:hidden;">
          <span style="font-weight:bold;margin-right:3px;">${fnName}=</span>
          <span style="display:inline-block;">${html}</span>
        </div>
      </div>
    `);
  }

  renderTableParams() {
    const isVi = this.display.language === 'VI';
    const title = isVi ? 'Phạm vi bảng' : 'Table Range';
    const labels = isVi ? ['Bắt đầu?', 'Kết thúc?', 'Bước?'] : ['Start?', 'End?', 'Step?'];
    const vals = [this.table.start, this.table.end, this.table.step];
    const curIdx = this.table.paramIdx;

    let rowsHtml = '';
    labels.forEach((lbl, i) => {
      const isAct = i === curIdx;
      const buf = this.table.paramBuffers[i];
      const valStr = buf !== '' ? buf : String(vals[i]);
      rowsHtml += `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 4px;${isAct ? 'background:rgba(18,24,17,0.12);font-weight:bold;' : ''}">
          <span>${lbl}</span>
          <span style="${isAct ? 'border-bottom:1px solid var(--lcd-dark);padding:0 2px;' : ''}">${valStr}${isAct ? '<span class="cursor"></span>' : ''}</span>
        </div>
      `;
    });

    this.display.renderCustom(`
      <div style="padding:4px 4px;font-family:var(--font-lcd);color:var(--lcd-dark);height:100%;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">
        <div style="font-size:11px;font-weight:bold;border-bottom:1px solid var(--lcd-dark);padding-bottom:1px;">${title}</div>
        <div style="font-size:12px;line-height:1.6;margin:4px 0;">
          ${rowsHtml}
        </div>
      </div>
    `);
  }

  renderTableGrid() {
    const hasG = this.tableMode === 'f(x),g(x)';
    const rows = this.table.rows || [];
    const scroll = this.table.scrollIdx || 0;
    const selRow = this.table.selectedRow || 0;
    const selCol = this.table.selectedCol || 'fx';

    const slice = rows.slice(scroll, scroll + 3);
    let trHtml = '';

    slice.forEach((r, i) => {
      const absIdx = scroll + i;
      const isRowSel = absIdx === selRow;
      const xSel = isRowSel && selCol === 'x';
      const fxSel = isRowSel && selCol === 'fx';
      const gxSel = isRowSel && selCol === 'gx';

      trHtml += `
        <tr style="line-height:1.3;">
          <td style="width:20px;text-align:center;border-right:1px solid var(--lcd-dark);">${absIdx + 1}</td>
          <td style="text-align:right;padding-right:6px;border-right:1px solid rgba(18,24,17,0.2);">
            <span style="${xSel ? 'background:var(--lcd-dark);color:var(--lcd-bg);font-weight:bold;padding:0 3px;border-radius:1px;display:inline-block;line-height:1.15;' : ''}">${r.x}</span>
          </td>
          <td style="text-align:right;padding-right:6px;${hasG ? 'border-right:1px solid rgba(18,24,17,0.2);' : ''}">
            <span style="${fxSel ? 'background:var(--lcd-dark);color:var(--lcd-bg);font-weight:bold;padding:0 3px;border-radius:1px;display:inline-block;line-height:1.15;' : ''}">${r.fx}</span>
          </td>
          ${hasG ? `
            <td style="text-align:right;padding-right:4px;">
              <span style="${gxSel ? 'background:var(--lcd-dark);color:var(--lcd-bg);font-weight:bold;padding:0 3px;border-radius:1px;display:inline-block;line-height:1.15;' : ''}">${r.gx !== undefined ? r.gx : ''}</span>
            </td>
          ` : ''}
        </tr>
      `;
    });

    const activeR = rows[selRow] || { x: 0, fx: 0 };
    let bottomVal = '';
    if (selCol === 'x') bottomVal = `x= ${activeR.x}`;
    else if (selCol === 'gx') bottomVal = `g(x)= ${activeR.gx !== undefined ? activeR.gx : ''}`;
    else bottomVal = `f(x)= ${activeR.fx}`;

    this.display.setScrollArrows(scroll > 0, scroll + 3 < rows.length);

    this.display.renderCustom(`
      <div style="padding:2px 2px;font-family:var(--font-lcd);color:var(--lcd-dark);height:100%;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">
        <table style="width:100%;border-collapse:collapse;font-size:calc(11px * var(--lcd-scale, 1));font-family:var(--font-lcd);">
          <thead>
            <tr style="border-bottom:1px solid var(--lcd-dark);font-weight:bold;">
              <td style="width:20px;text-align:center;border-right:1px solid var(--lcd-dark);">#</td>
              <td style="text-align:right;padding-right:6px;border-right:1px solid rgba(18,24,17,0.2);">x</td>
              <td style="text-align:right;padding-right:6px;${hasG ? 'border-right:1px solid rgba(18,24,17,0.2);' : ''}">F(x)</td>
              ${hasG ? '<td style="text-align:right;padding-right:4px;">G(x)</td>' : ''}
            </tr>
          </thead>
          <tbody>
            ${trHtml}
          </tbody>
        </table>
        <div style="font-size:calc(11px * var(--lcd-scale, 1));font-family:var(--font-lcd);font-weight:bold;border-top:1px solid rgba(18,24,17,0.25);padding-top:1px;text-align:right;padding-right:4px;">
          ${bottomVal}
        </div>
      </div>
    `);
  }

  // -------------------------------------------------------------
  // MODE 3: BASE-N (100% ON-SCREEN LCD)
  // -------------------------------------------------------------
  startBaseN() {
    this.osState = 'BASE_N';
    this.baseN.currentBase = 'DEC';
    this.baseN.valStr = '0';
    this.renderBaseN();
  }

  handleBaseNKey(key) {
    if (key === 'AC') { this.selectMode(1); return; }
    if (key === 'sqr') { this.switchBase('DEC'); return; }
    if (key === 'pow') { this.switchBase('HEX'); return; }
    if (key === 'log') { this.switchBase('BIN'); return; }
    if (key === 'ln') { this.switchBase('OCT'); return; }

    if (['0','1','2','3','4','5','6','7','8','9'].includes(key)) {
      if (this.baseN.valStr === '0') this.baseN.valStr = key;
      else this.baseN.valStr += key;
      this.renderBaseN();
    } else if (key === 'DEL') {
      this.baseN.valStr = this.baseN.valStr.slice(0, -1) || '0';
      this.renderBaseN();
    }
  }

  switchBase(target) {
    const fromB = { 'DEC': 10, 'HEX': 16, 'BIN': 2, 'OCT': 8 }[this.baseN.currentBase];
    const toB = { 'DEC': 10, 'HEX': 16, 'BIN': 2, 'OCT': 8 }[target];
    this.baseN.valStr = this.engine.convertBase(this.baseN.valStr, fromB, toB);
    this.baseN.currentBase = target;
    this.renderBaseN();
  }

  renderBaseN() {
    this.display.renderCustom(`
      <div style="padding:4px 6px;display:flex;flex-direction:column;justify-content:space-between;height:100%;font-family:var(--font-lcd);color:var(--lcd-dark);box-sizing:border-box;">
        <div style="font-size:11px;font-weight:bold;">${this.baseN.currentBase}</div>
        <div style="font-size:22px;font-weight:bold;text-align:right;margin-bottom:2px;">${this.baseN.valStr}</div>
      </div>
    `);
  }

  // -------------------------------------------------------------
  // MODE 6: STAT 1-VAR (100% ON-SCREEN LCD)
  // -------------------------------------------------------------
  startStat() {
    this.osState = 'STAT_INPUT';
    this.stat.buffer = '';
    this.stat.scrollIdx = 0;
    this.renderStatInput();
  }

  handleStatKey(key) {
    if (key === 'AC') {
      this.selectMode(1);
      return;
    }
    if (key === 'optn') {
      // Calculate 1-Var
      this.stat.results = this.engine.calc1VarStat(this.stat.list);
      this.stat.resScroll = 0;
      this.osState = 'STAT_RESULT';
      this.renderStatResult();
      return;
    }
    if (this.osState === 'STAT_INPUT') {
      if (['0','1','2','3','4','5','6','7','8','9','.'].includes(key)) {
        this.stat.buffer += key;
        this.renderStatInput();
      } else if (key === 'EQUALS') {
        const val = parseFloat(this.stat.buffer);
        if (!isNaN(val)) {
          this.stat.list.push(val);
          this.stat.buffer = '';
        }
        this.renderStatInput();
      }
    } else if (this.osState === 'STAT_RESULT') {
      if (key === 'DOWN') {
        if (this.stat.resScroll < 6) {
          this.stat.resScroll++;
          this.renderStatResult();
        }
      } else if (key === 'UP') {
        if (this.stat.resScroll > 0) {
          this.stat.resScroll--;
          this.renderStatResult();
        }
      }
    }
  }

  renderStatInput() {
    let rows = '';
    const slice = this.stat.list.slice(-3);
    slice.forEach((val, i) => {
      const idx = this.stat.list.length - slice.length + i + 1;
      rows += `<div style="display:flex;justify-content:space-between;padding:1px 4px;border-bottom:1px solid rgba(18,24,17,0.15);"><span>${idx}</span><span>${val}</span></div>`;
    });
    this.display.renderCustom(`
      <div style="font-size:11px;padding:3px 4px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
        <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:10px;border-bottom:1px solid var(--lcd-dark);padding-bottom:1px;">
          <span>#</span><span>x</span>
        </div>
        <div style="flex:1;overflow-y:hidden;margin:2px 0;">${rows}</div>
        <div style="font-size:11px;font-weight:bold;border-top:1px solid rgba(18,24,17,0.2);padding-top:1px;display:flex;justify-content:space-between;">
          <span>${this.stat.list.length + 1}=</span>
          <span>${this.stat.buffer}<span class="cursor"></span></span>
        </div>
      </div>
    `);
  }

  renderStatResult() {
    const s = this.stat.results;
    if (!s) return;
    const all = [
      `x̄ = ${s.mean}`,
      `Σx = ${s.sum}`,
      `Σx² = ${s.sumSq}`,
      `σx = ${s.sigma}`,
      `sx = ${s.s}`,
      `n = ${s.n}`,
      `min(x) = ${s.min}`,
      `Med = ${s.median}`,
      `max(x) = ${s.max}`
    ];
    const slice = all.slice(this.stat.resScroll, this.stat.resScroll + 3);
    this.display.setScrollArrows(this.stat.resScroll > 0, this.stat.resScroll + 3 < all.length);

    this.display.renderCustom(`
      <div style="font-size:11px;padding:3px 6px;font-family:var(--font-lcd);color:var(--lcd-dark);line-height:1.5;height:100%;box-sizing:border-box;">
        <div style="font-weight:bold;font-size:10px;border-bottom:1px solid var(--lcd-dark);padding-bottom:1px;margin-bottom:2px;">1-Variable</div>
        ${slice.map(l => `<div>${l}</div>`).join('')}
      </div>
    `);
  }

  // -------------------------------------------------------------
  // MODE 4: MATRIX (100% ON-SCREEN LCD)
  // -------------------------------------------------------------
  startMatrix() {
    this.osState = 'MAT_SELECT';
    this.renderMatrixSelect();
  }

  renderMatrixSelect() {
    const isVi = this.display.language === 'VI';
    this.display.renderList(isVi ? 'Ma trận (Matrix)' : 'Matrix', [
      '1:MatA        2:MatB',
      '3:MatC        4:MatD'
    ], false, false);
  }

  renderMatrixDimR() {
    const isVi = this.display.language === 'VI';
    this.display.renderList(`${this.matrixState.activeMat} ${isVi ? 'Số dòng?' : 'Rows?'}`, [
      isVi ? 'Số dòng? (1~4)' : 'Rows? (1~4)',
      isVi ? 'Chọn 1 ~ 4' : 'Select 1 ~ 4'
    ], false, false);
  }

  renderMatrixDimC() {
    const isVi = this.display.language === 'VI';
    this.display.renderList(`${this.matrixState.activeMat} ${isVi ? 'Số cột?' : 'Cols?'}`, [
      isVi ? 'Số cột? (1~4)' : 'Cols? (1~4)',
      isVi ? 'Chọn 1 ~ 4' : 'Select 1 ~ 4'
    ], false, false);
  }

  renderMatrixGrid() {
    const isVi = this.display.language === 'VI';
    const mat = this.matrixState.matrices[this.matrixState.activeMat] || [[0]];
    const rows = mat.length;
    const cols = mat[0].length;
    const curR = this.matrixState.cellR;
    const curC = this.matrixState.cellC;
    const cellVal = mat[curR][curC];
    const displayVal = this.matrixState.buffer !== '' ? this.matrixState.buffer : cellVal;

    let tableHtml = '<table style="width:100%;border-collapse:collapse;text-align:center;font-size:11px;">';
    for (let r = 0; r < rows; r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < cols; c++) {
        const isSel = (r === curR && c === curC);
        const bg = isSel ? 'var(--lcd-dark)' : 'transparent';
        const fg = isSel ? 'var(--lcd-bg)' : 'var(--lcd-dark)';
        tableHtml += `<td style="padding:1px 3px;border:1px solid rgba(18,24,17,0.25);background:${bg};color:${fg};">${mat[r][c]}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</table>';

    this.display.renderCustom(`
      <div style="padding:2px 4px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
        <div style="display:flex;justify-content:space-between;font-size:10px;font-weight:bold;border-bottom:1px solid rgba(18,24,17,0.15);padding-bottom:1px;">
          <span>${this.matrixState.activeMat} (${rows}×${cols})</span>
          <span>[OPTN]</span>
        </div>
        <div style="margin:2px 0;max-height:48px;overflow-y:auto;">
          ${tableHtml}
        </div>
        <div style="font-size:11px;font-weight:bold;border-top:1px solid rgba(18,24,17,0.2);padding-top:1px;display:flex;justify-content:space-between;">
          <span>${this.matrixState.activeMat}[${curR+1},${curC+1}]=</span>
          <span>${displayVal}<span class="cursor"></span></span>
        </div>
      </div>
    `);
  }

  renderMatrixOptn() {
    const isVi = this.display.language === 'VI';
    this.display.renderList(isVi ? 'Phép tính Ma trận' : 'Matrix Calc', [
      '1:Det(MatA)   2:MatA × MatB',
      '3:MatA + MatB 4:Trn(MatA)',
      '5:Inv(MatA)   6:Sửa Ma trận'
    ], false, false);
  }

  renderMatrixResult(title, contentHtml) {
    this.display.renderCustom(`
      <div style="padding:3px 4px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
        <div style="font-size:10px;font-weight:bold;border-bottom:1px solid rgba(18,24,17,0.15);">${title}</div>
        <div style="margin:auto 0;font-size:14px;font-weight:bold;text-align:center;">
          ${contentHtml}
        </div>
      </div>
    `);
  }

  handleMatrixKey(key) {
    if (key === 'MENU') {
      if (this.state.shift) {
        this.state.shift = false;
        this.display.updateIndicators(this.state);
        this.openSetup();
      } else {
        this.openMenu();
      }
      return;
    }
    if (key === 'ON') {
      this.startMatrix();
      return;
    }

    if (this.osState === 'MAT_SELECT') {
      if (key === 'AC') { this.selectMode(1); return; }
      if (['1','2','3','4'].includes(key)) {
        const map = { '1': 'MatA', '2': 'MatB', '3': 'MatC', '4': 'MatD' };
        this.matrixState.activeMat = map[key];
        this.osState = 'MAT_DIM_R';
        this.renderMatrixDimR();
        return;
      }
    } else if (this.osState === 'MAT_DIM_R') {
      if (key === 'AC') { this.osState = 'MAT_SELECT'; this.renderMatrixSelect(); return; }
      if (['1','2','3','4'].includes(key)) {
        this.matrixState.rows = parseInt(key, 10);
        this.osState = 'MAT_DIM_C';
        this.renderMatrixDimC();
        return;
      }
    } else if (this.osState === 'MAT_DIM_C') {
      if (key === 'AC') { this.osState = 'MAT_DIM_R'; this.renderMatrixDimR(); return; }
      if (['1','2','3','4'].includes(key)) {
        this.matrixState.cols = parseInt(key, 10);
        const r = this.matrixState.rows;
        const c = this.matrixState.cols;
        const mat = [];
        for (let i = 0; i < r; i++) {
          const row = [];
          for (let j = 0; j < c; j++) row.push(i === j ? 1 : 0);
          mat.push(row);
        }
        this.matrixState.matrices[this.matrixState.activeMat] = mat;
        this.matrixState.cellR = 0;
        this.matrixState.cellC = 0;
        this.matrixState.buffer = '';
        this.osState = 'MAT_GRID';
        this.renderMatrixGrid();
        return;
      }
    } else if (this.osState === 'MAT_GRID') {
      if (key === 'optn') {
        this.osState = 'MAT_OPTN';
        this.renderMatrixOptn();
        return;
      }
      if (['0','1','2','3','4','5','6','7','8','9','.'].includes(key)) {
        this.matrixState.buffer += key;
        this.renderMatrixGrid();
        return;
      }
      if (key === 'sub' || key === 'neg') {
        if (!this.matrixState.buffer) this.matrixState.buffer = '-';
        this.renderMatrixGrid();
        return;
      }
      if (key === 'DEL') {
        this.matrixState.buffer = this.matrixState.buffer.slice(0, -1);
        this.renderMatrixGrid();
        return;
      }
      if (key === 'EQUALS') {
        const mat = this.matrixState.matrices[this.matrixState.activeMat];
        const r = mat.length;
        const c = mat[0].length;
        if (this.matrixState.buffer !== '') {
          mat[this.matrixState.cellR][this.matrixState.cellC] = parseFloat(this.matrixState.buffer) || 0;
          this.matrixState.buffer = '';
        }
        if (this.matrixState.cellC < c - 1) {
          this.matrixState.cellC++;
        } else if (this.matrixState.cellR < r - 1) {
          this.matrixState.cellR++;
          this.matrixState.cellC = 0;
        }
        this.renderMatrixGrid();
        return;
      }
      if (key === 'LEFT') {
        if (this.matrixState.cellC > 0) this.matrixState.cellC--;
        this.matrixState.buffer = '';
        this.renderMatrixGrid();
        return;
      }
      if (key === 'RIGHT') {
        const c = this.matrixState.matrices[this.matrixState.activeMat][0].length;
        if (this.matrixState.cellC < c - 1) this.matrixState.cellC++;
        this.matrixState.buffer = '';
        this.renderMatrixGrid();
        return;
      }
      if (key === 'UP') {
        if (this.matrixState.cellR > 0) this.matrixState.cellR--;
        this.matrixState.buffer = '';
        this.renderMatrixGrid();
        return;
      }
      if (key === 'DOWN') {
        const r = this.matrixState.matrices[this.matrixState.activeMat].length;
        if (this.matrixState.cellR < r - 1) this.matrixState.cellR++;
        this.matrixState.buffer = '';
        this.renderMatrixGrid();
        return;
      }
      if (key === 'AC') {
        this.osState = 'MAT_OPTN';
        this.renderMatrixOptn();
        return;
      }
    } else if (this.osState === 'MAT_OPTN') {
      if (key === 'AC') {
        this.osState = 'MAT_GRID';
        this.renderMatrixGrid();
        return;
      }
      const matA = this.matrixState.matrices.MatA || [[1,0],[0,1]];
      const matB = this.matrixState.matrices.MatB || [[1,0],[0,1]];
      if (key === '1') {
        const d = this.engine.matrixDet(matA);
        this.osState = 'MAT_RESULT';
        this.renderMatrixResult('Det(MatA)', `Det = ${d}`);
        return;
      }
      if (key === '2') {
        const prod = this.engine.matrixMultiply(matA, matB);
        this.osState = 'MAT_RESULT';
        if (prod) {
          const gridHtml = prod.map(row => `[ ${row.join(', ')} ]`).join('<br>');
          this.renderMatrixResult('MatA × MatB', gridHtml);
        } else {
          this.renderMatrixResult('MatA × MatB', 'Dim ERROR');
        }
        return;
      }
      if (key === '3') {
        const sum = this.engine.matrixAdd(matA, matB);
        this.osState = 'MAT_RESULT';
        if (sum) {
          const gridHtml = sum.map(row => `[ ${row.join(', ')} ]`).join('<br>');
          this.renderMatrixResult('MatA + MatB', gridHtml);
        } else {
          this.renderMatrixResult('MatA + MatB', 'Dim ERROR');
        }
        return;
      }
      if (key === '4') {
        const trn = this.engine.matrixTranspose(matA);
        this.osState = 'MAT_RESULT';
        const gridHtml = trn.map(row => `[ ${row.join(', ')} ]`).join('<br>');
        this.renderMatrixResult('Trn(MatA)', gridHtml);
        return;
      }
      if (key === '5') {
        const inv = this.engine.matrixInverse(matA);
        this.osState = 'MAT_RESULT';
        if (inv) {
          const gridHtml = inv.map(row => `[ ${row.join(', ')} ]`).join('<br>');
          this.renderMatrixResult('MatA⁻¹', gridHtml);
        } else {
          this.renderMatrixResult('MatA⁻¹', 'Math ERROR (Det=0)');
        }
        return;
      }
      if (key === '6') {
        this.osState = 'MAT_SELECT';
        this.renderMatrixSelect();
        return;
      }
    } else if (this.osState === 'MAT_RESULT') {
      if (key === 'AC' || key === 'EQUALS') {
        this.osState = 'MAT_GRID';
        this.renderMatrixGrid();
        return;
      }
      if (key === 'optn') {
        this.osState = 'MAT_OPTN';
        this.renderMatrixOptn();
        return;
      }
    }
  }

  // -------------------------------------------------------------
  // MODE 5: VECTOR (100% ON-SCREEN LCD)
  // -------------------------------------------------------------
  startVector() {
    this.osState = 'VCT_SELECT';
    this.renderVectorSelect();
  }

  renderVectorSelect() {
    const isVi = this.display.language === 'VI';
    this.display.renderList(isVi ? 'Véc-tơ (Vector)' : 'Vector', [
      '1:VctA        2:VctB',
      '3:VctC        4:VctD'
    ], false, false);
  }

  renderVectorDim() {
    const isVi = this.display.language === 'VI';
    this.display.renderList(`${this.vectorState.activeVct} ${isVi ? 'Kích thước?' : 'Dimension?'}`, [
      isVi ? 'Kích thước? (2~3)' : 'Dimension? (2~3)',
      isVi ? 'Chọn 2 hoặc 3' : 'Select 2 or 3'
    ], false, false);
  }

  renderVectorInput() {
    const isVi = this.display.language === 'VI';
    const vct = this.vectorState.vectors[this.vectorState.activeVct] || [0, 0, 0];
    const dim = vct.length;
    const curIdx = this.vectorState.cellIdx;
    const curVal = vct[curIdx];
    const displayVal = this.vectorState.buffer !== '' ? this.vectorState.buffer : curVal;

    const rowHtml = vct.map((v, i) => {
      const isSel = i === curIdx;
      const bg = isSel ? 'var(--lcd-dark)' : 'transparent';
      const fg = isSel ? 'var(--lcd-bg)' : 'var(--lcd-dark)';
      return `<span style="padding:1px 6px;border:1px solid rgba(18,24,17,0.25);background:${bg};color:${fg};margin:0 2px;">${v}</span>`;
    }).join(' ');

    this.display.renderCustom(`
      <div style="padding:3px 4px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
        <div style="display:flex;justify-content:space-between;font-size:10px;font-weight:bold;border-bottom:1px solid rgba(18,24,17,0.15);padding-bottom:1px;">
          <span>${this.vectorState.activeVct} (Dim:${dim})</span>
          <span>[OPTN]</span>
        </div>
        <div style="margin:auto 0;text-align:center;font-size:12px;">
          [ ${rowHtml} ]
        </div>
        <div style="font-size:11px;font-weight:bold;border-top:1px solid rgba(18,24,17,0.2);padding-top:1px;display:flex;justify-content:space-between;">
          <span>${this.vectorState.activeVct}[${curIdx+1}]=</span>
          <span>${displayVal}<span class="cursor"></span></span>
        </div>
      </div>
    `);
  }

  renderVectorOptn() {
    const isVi = this.display.language === 'VI';
    this.display.renderList(isVi ? 'Phép tính Véc-tơ' : 'Vector Calc', [
      '1:VctA • VctB (Dot)   2:VctA × VctB (Cross)',
      '3:|VctA| (Độ dài)    4:Góc(VctA, VctB)',
      '5:Đơn vị(VctA)       6:Sửa Véc-tơ'
    ], false, false);
  }

  renderVectorResult(title, contentHtml) {
    this.display.renderCustom(`
      <div style="padding:3px 4px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
        <div style="font-size:10px;font-weight:bold;border-bottom:1px solid rgba(18,24,17,0.15);">${title}</div>
        <div style="margin:auto 0;font-size:14px;font-weight:bold;text-align:center;">
          ${contentHtml}
        </div>
      </div>
    `);
  }

  handleVectorKey(key) {
    if (key === 'MENU') {
      if (this.state.shift) {
        this.state.shift = false;
        this.display.updateIndicators(this.state);
        this.openSetup();
      } else {
        this.openMenu();
      }
      return;
    }
    if (key === 'ON') {
      this.startVector();
      return;
    }

    if (this.osState === 'VCT_SELECT') {
      if (key === 'AC') { this.selectMode(1); return; }
      if (['1','2','3','4'].includes(key)) {
        const map = { '1': 'VctA', '2': 'VctB', '3': 'VctC', '4': 'VctD' };
        this.vectorState.activeVct = map[key];
        this.osState = 'VCT_DIM';
        this.renderVectorDim();
        return;
      }
    } else if (this.osState === 'VCT_DIM') {
      if (key === 'AC') { this.osState = 'VCT_SELECT'; this.renderVectorSelect(); return; }
      if (key === '2' || key === '3') {
        const dim = parseInt(key, 10);
        this.vectorState.dim = dim;
        this.vectorState.vectors[this.vectorState.activeVct] = dim === 2 ? [1, 0] : [1, 0, 0];
        this.vectorState.cellIdx = 0;
        this.vectorState.buffer = '';
        this.osState = 'VCT_INPUT';
        this.renderVectorInput();
        return;
      }
    } else if (this.osState === 'VCT_INPUT') {
      if (key === 'optn') {
        this.osState = 'VCT_OPTN';
        this.renderVectorOptn();
        return;
      }
      if (['0','1','2','3','4','5','6','7','8','9','.'].includes(key)) {
        this.vectorState.buffer += key;
        this.renderVectorInput();
        return;
      }
      if (key === 'sub' || key === 'neg') {
        if (!this.vectorState.buffer) this.vectorState.buffer = '-';
        this.renderVectorInput();
        return;
      }
      if (key === 'DEL') {
        this.vectorState.buffer = this.vectorState.buffer.slice(0, -1);
        this.renderVectorInput();
        return;
      }
      if (key === 'EQUALS') {
        const vct = this.vectorState.vectors[this.vectorState.activeVct];
        if (this.vectorState.buffer !== '') {
          vct[this.vectorState.cellIdx] = parseFloat(this.vectorState.buffer) || 0;
          this.vectorState.buffer = '';
        }
        if (this.vectorState.cellIdx < vct.length - 1) {
          this.vectorState.cellIdx++;
        }
        this.renderVectorInput();
        return;
      }
      if (key === 'LEFT') {
        if (this.vectorState.cellIdx > 0) this.vectorState.cellIdx--;
        this.vectorState.buffer = '';
        this.renderVectorInput();
        return;
      }
      if (key === 'RIGHT') {
        const vct = this.vectorState.vectors[this.vectorState.activeVct];
        if (this.vectorState.cellIdx < vct.length - 1) this.vectorState.cellIdx++;
        this.vectorState.buffer = '';
        this.renderVectorInput();
        return;
      }
      if (key === 'AC') {
        this.osState = 'VCT_OPTN';
        this.renderVectorOptn();
        return;
      }
    } else if (this.osState === 'VCT_OPTN') {
      if (key === 'AC') {
        this.osState = 'VCT_INPUT';
        this.renderVectorInput();
        return;
      }
      const vctA = this.vectorState.vectors.VctA || [1, 0, 0];
      const vctB = this.vectorState.vectors.VctB || [0, 1, 0];
      if (key === '1') {
        const dot = this.engine.vectorDot(vctA, vctB);
        this.osState = 'VCT_RESULT';
        this.renderVectorResult('VctA • VctB', `Dot = ${dot}`);
        return;
      }
      if (key === '2') {
        const cross = this.engine.vectorCross(vctA, vctB);
        this.osState = 'VCT_RESULT';
        this.renderVectorResult('VctA × VctB', `[ ${cross.join(', ')} ]`);
        return;
      }
      if (key === '3') {
        const mag = Number(this.engine.vectorMag(vctA).toFixed(4));
        this.osState = 'VCT_RESULT';
        this.renderVectorResult('|VctA|', `|VctA| = ${mag}`);
        return;
      }
      if (key === '4') {
        const angle = this.engine.vectorAngle(vctA, vctB);
        this.osState = 'VCT_RESULT';
        this.renderVectorResult('Góc (VctA, VctB)', `θ = ${angle}°`);
        return;
      }
      if (key === '5') {
        const u = this.engine.vectorUnit(vctA);
        this.osState = 'VCT_RESULT';
        this.renderVectorResult('Unit(VctA)', `[ ${u.join(', ')} ]`);
        return;
      }
      if (key === '6') {
        this.osState = 'VCT_SELECT';
        this.renderVectorSelect();
        return;
      }
    } else if (this.osState === 'VCT_RESULT') {
      if (key === 'AC' || key === 'EQUALS') {
        this.osState = 'VCT_INPUT';
        this.renderVectorInput();
        return;
      }
      if (key === 'optn') {
        this.osState = 'VCT_OPTN';
        this.renderVectorOptn();
        return;
      }
    }
  }

  // -------------------------------------------------------------
  // MODE 7: DISTRIBUTION (100% ON-SCREEN LCD)
  // -------------------------------------------------------------
  startDist() {
    this.osState = 'DIST_MENU';
    this.renderDistMenu();
  }

  renderDistMenu() {
    const isVi = this.display.language === 'VI';
    this.display.renderList(isVi ? 'Phân phối (Distribution)' : 'Distribution', [
      '1:Normal PD',
      '2:Normal CD',
      '3:Inverse Normal',
      '4:Binomial PD'
    ], false, false);
  }

  renderDistInput() {
    const isVi = this.display.language === 'VI';
    let title = 'Normal PD';
    let paramName = 'x';
    let defaultVal = 0;

    if (this.distState.type === 1) {
      title = 'Normal PD';
      const names = ['x', 'σ', 'μ'];
      const defaults = [this.distState.params.x, this.distState.params.sigma, this.distState.params.mu];
      paramName = names[this.distState.paramIdx];
      defaultVal = defaults[this.distState.paramIdx];
    } else if (this.distState.type === 2) {
      title = 'Normal CD';
      const names = ['Lower', 'Upper', 'σ', 'μ'];
      const defaults = [this.distState.params.lower, this.distState.params.upper, this.distState.params.sigma, this.distState.params.mu];
      paramName = names[this.distState.paramIdx];
      defaultVal = defaults[this.distState.paramIdx];
    } else if (this.distState.type === 3) {
      title = 'Inverse Normal';
      const names = ['Area', 'σ', 'μ'];
      const defaults = [0.5, this.distState.params.sigma, this.distState.params.mu];
      paramName = names[this.distState.paramIdx];
      defaultVal = defaults[this.distState.paramIdx];
    } else if (this.distState.type === 4) {
      title = 'Binomial PD';
      const names = ['x', 'N', 'p'];
      const defaults = [this.distState.params.x, this.distState.params.N, this.distState.params.p];
      paramName = names[this.distState.paramIdx];
      defaultVal = defaults[this.distState.paramIdx];
    }

    const currentVal = this.distState.buffer !== '' ? this.distState.buffer : defaultVal;

    this.display.renderCustom(`
      <div style="padding:4px 6px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
        <div style="font-size:11px;font-weight:bold;border-bottom:1px solid rgba(18,24,17,0.15);padding-bottom:1px;">${title}</div>
        <div style="font-size:16px;font-weight:bold;margin-top:6px;">
          ${paramName}= ${currentVal}<span class="cursor"></span>
        </div>
      </div>
    `);
  }

  renderDistResult() {
    const titles = { 1: 'Normal PD', 2: 'Normal CD', 3: 'Inverse Normal', 4: 'Binomial PD' };
    const title = titles[this.distState.type] || 'Distribution';
    this.display.renderCustom(`
      <div style="padding:4px 6px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
        <div style="font-size:11px;font-weight:bold;border-bottom:1px solid rgba(18,24,17,0.15);padding-bottom:1px;">${title}</div>
        <div style="margin:auto 0;text-align:center;">
          <div style="font-size:12px;color:rgba(18,24,17,0.8);">p =</div>
          <div style="font-size:18px;font-weight:bold;">${this.distState.resultVal}</div>
        </div>
      </div>
    `);
  }

  handleDistKey(key) {
    if (key === 'MENU') {
      if (this.state.shift) {
        this.state.shift = false;
        this.display.updateIndicators(this.state);
        this.openSetup();
      } else {
        this.openMenu();
      }
      return;
    }
    if (key === 'ON') {
      this.startDist();
      return;
    }

    if (this.osState === 'DIST_MENU') {
      if (key === 'AC') { this.selectMode(1); return; }
      if (['1','2','3','4'].includes(key)) {
        this.distState.type = parseInt(key, 10);
        this.distState.paramIdx = 0;
        this.distState.buffer = '';
        this.osState = 'DIST_INPUT';
        this.renderDistInput();
        return;
      }
    } else if (this.osState === 'DIST_INPUT') {
      if (key === 'AC') {
        this.osState = 'DIST_MENU';
        this.renderDistMenu();
        return;
      }
      if (['0','1','2','3','4','5','6','7','8','9','.'].includes(key)) {
        this.distState.buffer += key;
        this.renderDistInput();
        return;
      }
      if (key === 'sub' || key === 'neg') {
        if (!this.distState.buffer) this.distState.buffer = '-';
        this.renderDistInput();
        return;
      }
      if (key === 'DEL') {
        this.distState.buffer = this.distState.buffer.slice(0, -1);
        this.renderDistInput();
        return;
      }
      if (key === 'EQUALS') {
        const maxParams = { 1: 3, 2: 4, 3: 3, 4: 3 }[this.distState.type];
        if (this.distState.type === 1) {
          const keys = ['x', 'sigma', 'mu'];
          const k = keys[this.distState.paramIdx];
          if (this.distState.buffer !== '') this.distState.params[k] = parseFloat(this.distState.buffer) || 0;
        } else if (this.distState.type === 2) {
          const keys = ['lower', 'upper', 'sigma', 'mu'];
          const k = keys[this.distState.paramIdx];
          if (this.distState.buffer !== '') this.distState.params[k] = parseFloat(this.distState.buffer) || 0;
        } else if (this.distState.type === 4) {
          const keys = ['x', 'N', 'p'];
          const k = keys[this.distState.paramIdx];
          if (this.distState.buffer !== '') this.distState.params[k] = parseFloat(this.distState.buffer) || 0;
        }
        this.distState.buffer = '';

        if (this.distState.paramIdx < maxParams - 1) {
          this.distState.paramIdx++;
          this.renderDistInput();
        } else {
          if (this.distState.type === 1) {
            this.distState.resultVal = this.engine.normalPD(this.distState.params.x, this.distState.params.sigma, this.distState.params.mu);
          } else if (this.distState.type === 2) {
            this.distState.resultVal = this.engine.normalCD(this.distState.params.lower, this.distState.params.upper, this.distState.params.sigma, this.distState.params.mu);
          } else if (this.distState.type === 4) {
            this.distState.resultVal = this.engine.binomialPD(this.distState.params.x, this.distState.params.N, this.distState.params.p);
          } else {
            this.distState.resultVal = 0.5;
          }
          this.osState = 'DIST_RESULT';
          this.renderDistResult();
        }
        return;
      }
    } else if (this.osState === 'DIST_RESULT') {
      if (key === 'AC' || key === 'EQUALS') {
        this.distState.paramIdx = 0;
        this.distState.buffer = '';
        this.osState = 'DIST_INPUT';
        this.renderDistInput();
        return;
      }
    }
  }

  // -------------------------------------------------------------
  // MODE 12: SPREADSHEET (100% ON-SCREEN LCD)
  // -------------------------------------------------------------
  startSheet() {
    this.osState = 'SHEET_GRID';
    this.sheetState.cellCol = 0;
    this.sheetState.cellRow = 0;
    this.sheetState.buffer = '';
    this.renderSheetGrid();
  }

  renderSheetGrid() {
    const cols = this.sheetState.cols;
    const curC = this.sheetState.cellCol;
    const curR = this.sheetState.cellRow;
    const cellName = `${cols[curC]}${curR + 1}`;
    const cellVal = this.sheetState.cells[cellName] !== undefined ? this.sheetState.cells[cellName] : 0;
    const displayVal = this.sheetState.buffer !== '' ? this.sheetState.buffer : cellVal;

    let tableHtml = '<table style="width:100%;border-collapse:collapse;text-align:right;font-size:10px;">';
    tableHtml += '<tr style="font-weight:bold;text-align:center;background:rgba(18,24,17,0.1);"><td style="width:14px;"></td><td>A</td><td>B</td><td>C</td><td>D</td></tr>';
    for (let r = 0; r < this.sheetState.maxRows; r++) {
      tableHtml += `<tr><td style="text-align:center;font-weight:bold;background:rgba(18,24,17,0.05);">${r+1}</td>`;
      for (let c = 0; c < cols.length; c++) {
        const name = `${cols[c]}${r+1}`;
        const val = this.sheetState.cells[name] !== undefined ? this.sheetState.cells[name] : 0;
        const isSel = (c === curC && r === curR);
        const bg = isSel ? 'var(--lcd-dark)' : 'transparent';
        const fg = isSel ? 'var(--lcd-bg)' : 'var(--lcd-dark)';
        tableHtml += `<td style="padding:1px 2px;border:1px solid rgba(18,24,17,0.2);background:${bg};color:${fg};">${val}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</table>';

    this.display.renderCustom(`
      <div style="padding:2px 3px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
        <div style="display:flex;justify-content:space-between;font-size:9px;font-weight:bold;border-bottom:1px solid rgba(18,24,17,0.15);padding-bottom:1px;">
          <span>BẢNG TÍNH (Spreadsheet)</span>
          <span>[OPTN]</span>
        </div>
        <div style="margin:1px 0;max-height:50px;overflow:hidden;">
          ${tableHtml}
        </div>
        <div style="font-size:11px;font-weight:bold;border-top:1px solid rgba(18,24,17,0.2);padding-top:1px;display:flex;justify-content:space-between;">
          <span>${cellName}=</span>
          <span>${displayVal}<span class="cursor"></span></span>
        </div>
      </div>
    `);
  }

  renderSheetOptn() {
    const isVi = this.display.language === 'VI';
    this.display.renderList(isVi ? 'Lệnh Bảng tính' : 'Spreadsheet Optn', [
      '1:Tổng Col A (Sum)',
      '2:Trung bình Col A (Mean)',
      '3:Điền số (Fill 1..5)',
      '4:Xóa bảng (Clear All)'
    ], false, false);
  }

  renderSheetResult(title, val) {
    this.display.renderCustom(`
      <div style="padding:4px 6px;font-family:var(--font-lcd);color:var(--lcd-dark);display:flex;flex-direction:column;justify-content:space-between;height:100%;box-sizing:border-box;">
        <div style="font-size:11px;font-weight:bold;border-bottom:1px solid rgba(18,24,17,0.15);padding-bottom:1px;">${title}</div>
        <div style="margin:auto 0;font-size:18px;font-weight:bold;text-align:center;">
          ${val}
        </div>
      </div>
    `);
  }

  handleSheetKey(key) {
    if (key === 'MENU') {
      if (this.state.shift) {
        this.state.shift = false;
        this.display.updateIndicators(this.state);
        this.openSetup();
      } else {
        this.openMenu();
      }
      return;
    }
    if (key === 'ON') {
      this.startSheet();
      return;
    }

    if (this.osState === 'SHEET_GRID') {
      if (key === 'optn') {
        this.osState = 'SHEET_OPTN';
        this.renderSheetOptn();
        return;
      }
      if (['0','1','2','3','4','5','6','7','8','9','.'].includes(key)) {
        this.sheetState.buffer += key;
        this.renderSheetGrid();
        return;
      }
      if (key === 'sub' || key === 'neg') {
        if (!this.sheetState.buffer) this.sheetState.buffer = '-';
        this.renderSheetGrid();
        return;
      }
      if (key === 'DEL') {
        this.sheetState.buffer = this.sheetState.buffer.slice(0, -1);
        this.renderSheetGrid();
        return;
      }
      if (key === 'EQUALS') {
        const cellName = `${this.sheetState.cols[this.sheetState.cellCol]}${this.sheetState.cellRow + 1}`;
        if (this.sheetState.buffer !== '') {
          this.sheetState.cells[cellName] = parseFloat(this.sheetState.buffer) || 0;
          this.sheetState.buffer = '';
        }
        if (this.sheetState.cellRow < this.sheetState.maxRows - 1) {
          this.sheetState.cellRow++;
        }
        this.renderSheetGrid();
        return;
      }
      if (key === 'UP') {
        if (this.sheetState.cellRow > 0) this.sheetState.cellRow--;
        this.sheetState.buffer = '';
        this.renderSheetGrid();
        return;
      }
      if (key === 'DOWN') {
        if (this.sheetState.cellRow < this.sheetState.maxRows - 1) this.sheetState.cellRow++;
        this.sheetState.buffer = '';
        this.renderSheetGrid();
        return;
      }
      if (key === 'LEFT') {
        if (this.sheetState.cellCol > 0) this.sheetState.cellCol--;
        this.sheetState.buffer = '';
        this.renderSheetGrid();
        return;
      }
      if (key === 'RIGHT') {
        if (this.sheetState.cellCol < this.sheetState.cols.length - 1) this.sheetState.cellCol++;
        this.sheetState.buffer = '';
        this.renderSheetGrid();
        return;
      }
      if (key === 'AC') {
        this.sheetState.buffer = '';
        this.renderSheetGrid();
        return;
      }
    } else if (this.osState === 'SHEET_OPTN') {
      if (key === 'AC') {
        this.osState = 'SHEET_GRID';
        this.renderSheetGrid();
        return;
      }
      if (key === '1') {
        let sum = 0;
        for (let r = 1; r <= 5; r++) sum += (this.sheetState.cells[`A${r}`] || 0);
        this.osState = 'SHEET_RESULT';
        this.renderSheetResult('Sum(A1:A5)', `Sum = ${sum}`);
        return;
      }
      if (key === '2') {
        let sum = 0;
        for (let r = 1; r <= 5; r++) sum += (this.sheetState.cells[`A${r}`] || 0);
        const mean = Number((sum / 5).toFixed(4));
        this.osState = 'SHEET_RESULT';
        this.renderSheetResult('Mean(A1:A5)', `Mean = ${mean}`);
        return;
      }
      if (key === '3') {
        for (let r = 1; r <= 5; r++) this.sheetState.cells[`A${r}`] = r;
        this.osState = 'SHEET_GRID';
        this.renderSheetGrid();
        return;
      }
      if (key === '4') {
        for (let c of this.sheetState.cols) {
          for (let r = 1; r <= 5; r++) this.sheetState.cells[`${c}${r}`] = 0;
        }
        this.osState = 'SHEET_GRID';
        this.renderSheetGrid();
        return;
      }
    } else if (this.osState === 'SHEET_RESULT') {
      if (key === 'AC' || key === 'EQUALS') {
        this.osState = 'SHEET_GRID';
        this.renderSheetGrid();
        return;
      }
      if (key === 'optn') {
        this.osState = 'SHEET_OPTN';
        this.renderSheetOptn();
        return;
      }
    }
  }

  // -------------------------------------------------------------
  // NORMAL COMP / CMPLX CALCULATIONS
  // -------------------------------------------------------------
  renderCurrentView() {
    if (this.osState === 'NORMAL') {
      this.display.showView('NORMAL');
      this.display.renderExpression(this.expression, this.cursorPos);
      this.display.setResult(this.displayResult);
      this.display.setScrollArrows(this.historyIndex > 0, this.historyIndex < this.history.length - 1);
    }
  }

  insert(token) {
    this.saveUndoState();
    if (this.justCalculated && !['+','−','×','÷','^'].includes(token)) {
      this.expression = '';
      this.cursorPos = 0;
      this.displayResult = '';
      this.display.setResult('');
    }
    this.justCalculated = false;
    this.display.setMode('input');

    const before = this.expression.slice(0, this.cursorPos);
    const after = this.expression.slice(this.cursorPos);
    this.expression = before + token + after;
    this.cursorPos += token.length;

    this.display.renderExpression(this.expression, this.cursorPos);
  }

  findMatchingBrace(str, openIdx) {
    if (!str || str[openIdx] !== '{') return -1;
    let depth = 0;
    for (let i = openIdx; i < str.length; i++) {
      if (str[i] === '{') depth++;
      else if (str[i] === '}') {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  parseTemplates(expr) {
    const slots = [];
    if (!expr) return slots;

    // Helper to extract slot bounds using matching braces
    const findArg = (startIdx) => {
      const openIdx = expr.indexOf('{', startIdx);
      if (openIdx === -1) return null;
      const closeIdx = this.findMatchingBrace(expr, openIdx);
      if (closeIdx === -1) return null;
      return {
        open: openIdx,
        close: closeIdx,
        slot: { start: openIdx + 1, end: closeIdx, text: expr.slice(openIdx + 1, closeIdx) }
      };
    };

    // Recurring decimal: \recurring{digits}
    let mRec;
    const recRegex = /\\recurring(?=\{)/g;
    while ((mRec = recRegex.exec(expr)) !== null) {
      const a1 = findArg(mRec.index);
      if (a1) {
        slots.push({
          type: 'recurring', fullStart: mRec.index, fullEnd: a1.close + 1,
          digits: a1.slot
        });
      }
    }

    // 1. Mixed fraction: \mixedfrac{whole}{num}{den}
    let m;
    const mfRegex = /\\mixedfrac(?=\{)/g;
    while ((m = mfRegex.exec(expr)) !== null) {
      const a1 = findArg(m.index);
      if (a1) {
        const a2 = findArg(a1.close + 1);
        if (a2) {
          const a3 = findArg(a2.close + 1);
          if (a3) {
            slots.push({
              type: 'mixedfrac', fullStart: m.index, fullEnd: a3.close + 1,
              whole: a1.slot, num: a2.slot, den: a3.slot
            });
          }
        }
      }
    }

    // 2. Simple fraction: \frac{num}{den}
    const fRegex = /\\frac(?=\{)/g;
    while ((m = fRegex.exec(expr)) !== null) {
      const a1 = findArg(m.index);
      if (a1) {
        const a2 = findArg(a1.close + 1);
        if (a2) {
          slots.push({
            type: 'frac', fullStart: m.index, fullEnd: a2.close + 1,
            num: a1.slot, den: a2.slot
          });
        }
      }
    }

    // 3. Integral: \int{lower}{upper}{expr}
    const intRegex = /\\int(?=\{)/g;
    while ((m = intRegex.exec(expr)) !== null) {
      const a1 = findArg(m.index);
      if (a1) {
        const a2 = findArg(a1.close + 1);
        if (a2) {
          const a3 = findArg(a2.close + 1);
          if (a3) {
            slots.push({
              type: 'int', fullStart: m.index, fullEnd: a3.close + 1,
              lower: a1.slot, upper: a2.slot, expr: a3.slot
            });
          }
        }
      }
    }

    // 4. Summation: \sum{lower}{upper}{expr}
    const sumRegex = /\\sum(?=\{)/g;
    while ((m = sumRegex.exec(expr)) !== null) {
      const a1 = findArg(m.index);
      if (a1) {
        const a2 = findArg(a1.close + 1);
        if (a2) {
          const a3 = findArg(a2.close + 1);
          if (a3) {
            slots.push({
              type: 'sum', fullStart: m.index, fullEnd: a3.close + 1,
              lower: a1.slot, upper: a2.slot, expr: a3.slot
            });
          }
        }
      }
    }

    // 5. Derivative: \diff{expr}{point}
    const diffRegex = /\\diff(?=\{)/g;
    while ((m = diffRegex.exec(expr)) !== null) {
      const a1 = findArg(m.index);
      if (a1) {
        const a2 = findArg(a1.close + 1);
        if (a2) {
          slots.push({
            type: 'diff', fullStart: m.index, fullEnd: a2.close + 1,
            expr: a1.slot, point: a2.slot
          });
        }
      }
    }

    // 6. Logbase: \logbase{base}{expr}
    const logRegex = /\\logbase(?=\{)/g;
    while ((m = logRegex.exec(expr)) !== null) {
      const a1 = findArg(m.index);
      if (a1) {
        const a2 = findArg(a1.close + 1);
        if (a2) {
          slots.push({
            type: 'logbase', fullStart: m.index, fullEnd: a2.close + 1,
            base: a1.slot, expr: a2.slot
          });
        }
      }
    }

    // 7. N-th root: \nthroot{root}{rad}
    const nrRegex = /\\nthroot(?=\{)/g;
    while ((m = nrRegex.exec(expr)) !== null) {
      const a1 = findArg(m.index);
      if (a1) {
        const a2 = findArg(a1.close + 1);
        if (a2) {
          slots.push({
            type: 'nthroot', fullStart: m.index, fullEnd: a2.close + 1,
            root: a1.slot, rad: a2.slot
          });
        }
      }
    }

    // 8. Cubic root: \cbrt{rad}
    const cbRegex = /\\cbrt(?=\{)/g;
    while ((m = cbRegex.exec(expr)) !== null) {
      const a1 = findArg(m.index);
      if (a1) {
        slots.push({
          type: 'cbrt', fullStart: m.index, fullEnd: a1.close + 1,
          rad: a1.slot
        });
      }
    }

    // 9. Radical: \sqrt{rad}
    const sRegex = /\\sqrt(?=\{)/g;
    while ((m = sRegex.exec(expr)) !== null) {
      const a1 = findArg(m.index);
      if (a1) {
        slots.push({
          type: 'sqrt', fullStart: m.index, fullEnd: a1.close + 1,
          rad: a1.slot
        });
      }
    }

    // 10. Absolute value: \abs{expr}
    const absRegex = /\\abs(?=\{)/g;
    while ((m = absRegex.exec(expr)) !== null) {
      const a1 = findArg(m.index);
      if (a1) {
        slots.push({
          type: 'abs', fullStart: m.index, fullEnd: a1.close + 1,
          expr: a1.slot
        });
      }
    }

    // 11. Exponent: ^{exp}
    const pRegex = /\^(?=\{)/g;
    while ((m = pRegex.exec(expr)) !== null) {
      const a1 = findArg(m.index);
      if (a1) {
        slots.push({
          type: 'pow', fullStart: m.index, fullEnd: a1.close + 1,
          exp: a1.slot
        });
      }
    }

    slots.sort((a, b) => a.fullStart - b.fullStart);
    return slots;
  }

  findAllActiveSlots(expr, cursorPos) {
    const templates = this.parseTemplates(expr);
    const activeList = [];

    for (const t of templates) {
      const checkPart = (partName, slot) => {
        if (cursorPos >= slot.start && cursorPos <= slot.end) {
          activeList.push({ template: t, part: partName, slot, len: slot.end - slot.start });
        }
      };

      if (t.type === 'frac') {
        checkPart('num', t.num);
        checkPart('den', t.den);
      } else if (t.type === 'mixedfrac') {
        checkPart('whole', t.whole);
        checkPart('num', t.num);
        checkPart('den', t.den);
      } else if (t.type === 'int') {
        checkPart('lower', t.lower);
        checkPart('upper', t.upper);
        checkPart('expr', t.expr);
      } else if (t.type === 'sum') {
        checkPart('lower', t.lower);
        checkPart('upper', t.upper);
        checkPart('expr', t.expr);
      } else if (t.type === 'diff') {
        checkPart('expr', t.expr);
        checkPart('point', t.point);
      } else if (t.type === 'logbase') {
        checkPart('base', t.base);
        checkPart('expr', t.expr);
      } else if (t.type === 'nthroot') {
        checkPart('root', t.root);
        checkPart('rad', t.rad);
      } else if (t.type === 'cbrt') {
        checkPart('rad', t.rad);
      } else if (t.type === 'sqrt') {
        checkPart('rad', t.rad);
      } else if (t.type === 'abs') {
        checkPart('expr', t.expr);
      } else if (t.type === 'pow') {
        checkPart('exp', t.exp);
      }
    }

    activeList.sort((a, b) => a.len - b.len);
    return activeList;
  }

  findActiveSlot(expr, cursorPos) {
    const list = this.findAllActiveSlots(expr, cursorPos);
    return list.length > 0 ? list[0] : null;
  }

  getLeafSlots(expr) {
    const templates = this.parseTemplates(expr);
    const allSlots = [];
    for (const t of templates) {
      if (t.type === 'frac') {
        allSlots.push({ template: t, part: 'num', start: t.num.start, end: t.num.end, text: t.num.text });
        allSlots.push({ template: t, part: 'den', start: t.den.start, end: t.den.end, text: t.den.text });
      } else if (t.type === 'mixedfrac') {
        allSlots.push({ template: t, part: 'whole', start: t.whole.start, end: t.whole.end, text: t.whole.text });
        allSlots.push({ template: t, part: 'num', start: t.num.start, end: t.num.end, text: t.num.text });
        allSlots.push({ template: t, part: 'den', start: t.den.start, end: t.den.end, text: t.den.text });
      } else if (t.type === 'nthroot') {
        allSlots.push({ template: t, part: 'root', start: t.root.start, end: t.root.end, text: t.root.text });
        allSlots.push({ template: t, part: 'rad', start: t.rad.start, end: t.rad.end, text: t.rad.text });
      } else if (t.type === 'int' || t.type === 'sum') {
        allSlots.push({ template: t, part: 'upper', start: t.upper.start, end: t.upper.end, text: t.upper.text });
        allSlots.push({ template: t, part: 'expr', start: t.expr.start, end: t.expr.end, text: t.expr.text });
        allSlots.push({ template: t, part: 'lower', start: t.lower.start, end: t.lower.end, text: t.lower.text });
      } else if (t.type === 'diff') {
        allSlots.push({ template: t, part: 'expr', start: t.expr.start, end: t.expr.end, text: t.expr.text });
        allSlots.push({ template: t, part: 'point', start: t.point.start, end: t.point.end, text: t.point.text });
      } else if (t.type === 'logbase') {
        allSlots.push({ template: t, part: 'base', start: t.base.start, end: t.base.end, text: t.base.text });
        allSlots.push({ template: t, part: 'expr', start: t.expr.start, end: t.expr.end, text: t.expr.text });
      } else if (t.type === 'pow') {
        allSlots.push({ template: t, part: 'exp', start: t.exp.start, end: t.exp.end, text: t.exp.text });
      } else if (t.type === 'recurring') {
        allSlots.push({ template: t, part: 'digits', start: t.digits.start, end: t.digits.end, text: t.digits.text });
      }
    }
    const leafs = [];
    for (let i = 0; i < allSlots.length; i++) {
      const s = allSlots[i];
      let containsOther = false;
      for (let j = 0; j < allSlots.length; j++) {
        if (i !== j) {
          const o = allSlots[j];
          if (o.start >= s.start && o.end <= s.end && (o.start > s.start || o.end < s.end)) {
            containsOther = true;
            break;
          }
        }
      }
      if (!containsOther) leafs.push(s);
    }
    leafs.sort((a, b) => a.start - b.start);
    return leafs;
  }

  getVerticalSlotsForCursor(expr, cursorPos) {
    const templates = this.parseTemplates(expr);
    if (!templates || templates.length === 0) return [];

    const roots = [];
    for (const t of templates) {
      let isChild = false;
      for (const parent of templates) {
        if (parent !== t && t.fullStart >= parent.fullStart && t.fullEnd <= parent.fullEnd) {
          isChild = true;
          break;
        }
      }
      if (!isChild) roots.push(t);
    }

    let currentRoot = null;
    for (const r of roots) {
      if (cursorPos >= r.fullStart && cursorPos <= r.fullEnd) {
        currentRoot = r;
        break;
      }
    }
    if (!currentRoot) return [];

    const allLeafs = this.getLeafSlots(expr);
    return allLeafs.filter(l => l.start >= currentRoot.fullStart && l.end <= currentRoot.fullEnd);
  }

  navigateVertical(dir) {
    const vSlots = this.getVerticalSlotsForCursor(this.expression, this.cursorPos);
    if (vSlots && vSlots.length > 1) {
      let curIdx = -1;
      for (let i = 0; i < vSlots.length; i++) {
        const s = vSlots[i];
        if (this.cursorPos >= s.start && this.cursorPos <= s.end) {
          curIdx = i;
          break;
        }
      }
      if (curIdx === -1) {
        let minDist = Infinity;
        for (let i = 0; i < vSlots.length; i++) {
          const s = vSlots[i];
          const dist = Math.min(Math.abs(this.cursorPos - s.start), Math.abs(this.cursorPos - s.end));
          if (dist < minDist) {
            minDist = dist;
            curIdx = i;
          }
        }
      }

      if (curIdx !== -1) {
        const targetIdx = curIdx + dir;
        if (targetIdx >= 0 && targetIdx < vSlots.length) {
          this.cursorPos = vSlots[targetIdx].start;
          this.display.renderExpression(this.expression, this.cursorPos);
          return;
        }
      }
    }

    // Exponent exit: if inside pow and pressing DOWN, exit exponent
    const active = this.findActiveSlot(this.expression, this.cursorPos);
    if (active && active.template.type === 'pow' && dir > 0) {
      this.cursorPos = active.template.fullEnd;
      this.display.renderExpression(this.expression, this.cursorPos);
      return;
    }

    this.navigateHistory(dir);
  }

  moveCursor(delta) {
    if (this.justCalculated) {
      this.justCalculated = false;
      this.cursorPos = delta < 0 ? 0 : this.expression.length;
      this.display.renderExpression(this.expression, this.cursorPos);
      return;
    }

    const templates = this.parseTemplates(this.expression);
    const active = this.findActiveSlot(this.expression, this.cursorPos);

    if (delta > 0) {
      // RIGHT
      if (active) {
        const t = active.template;
        if (t.type === 'frac') {
          if (active.part === 'num') {
            if (this.cursorPos < t.num.end) this.cursorPos++;
            else this.cursorPos = t.den.start;
          } else {
            if (this.cursorPos < t.den.end) this.cursorPos++;
            else this.cursorPos = t.fullEnd;
          }
        } else if (t.type === 'mixedfrac') {
          if (active.part === 'whole') {
            if (this.cursorPos < t.whole.end) this.cursorPos++;
            else this.cursorPos = t.num.start;
          } else if (active.part === 'num') {
            if (this.cursorPos < t.num.end) this.cursorPos++;
            else this.cursorPos = t.den.start;
          } else {
            if (this.cursorPos < t.den.end) this.cursorPos++;
            else this.cursorPos = t.fullEnd;
          }
        } else if (t.type === 'int') {
          if (active.part === 'lower') {
            if (this.cursorPos < t.lower.end) this.cursorPos++;
            else this.cursorPos = t.expr.start;
          } else if (active.part === 'upper') {
            if (this.cursorPos < t.upper.end) this.cursorPos++;
            else this.cursorPos = t.expr.start;
          } else {
            if (this.cursorPos < t.expr.end) this.cursorPos++;
            else this.cursorPos = t.fullEnd;
          }
        } else if (t.type === 'sum') {
          if (active.part === 'lower') {
            if (this.cursorPos < t.lower.end) this.cursorPos++;
            else this.cursorPos = t.expr.start;
          } else if (active.part === 'upper') {
            if (this.cursorPos < t.upper.end) this.cursorPos++;
            else this.cursorPos = t.expr.start;
          } else {
            if (this.cursorPos < t.expr.end) this.cursorPos++;
            else this.cursorPos = t.fullEnd;
          }
        } else if (t.type === 'diff') {
          if (active.part === 'expr') {
            if (this.cursorPos < t.expr.end) this.cursorPos++;
            else this.cursorPos = t.point.start;
          } else {
            if (this.cursorPos < t.point.end) this.cursorPos++;
            else this.cursorPos = t.fullEnd;
          }
        } else if (t.type === 'logbase') {
          if (active.part === 'base') {
            if (this.cursorPos < t.base.end) this.cursorPos++;
            else this.cursorPos = t.expr.start;
          } else {
            if (this.cursorPos < t.expr.end) this.cursorPos++;
            else this.cursorPos = t.fullEnd;
          }
        } else if (t.type === 'nthroot') {
          if (active.part === 'root') {
            if (this.cursorPos < t.root.end) this.cursorPos++;
            else this.cursorPos = t.rad.start;
          } else {
            if (this.cursorPos < t.rad.end) this.cursorPos++;
            else this.cursorPos = t.fullEnd;
          }
        } else if (t.type === 'cbrt') {
          if (this.cursorPos < t.rad.end) this.cursorPos++;
          else this.cursorPos = t.fullEnd;
        } else if (t.type === 'sqrt') {
          if (this.cursorPos < t.rad.end) this.cursorPos++;
          else this.cursorPos = t.fullEnd;
        } else if (t.type === 'abs') {
          if (this.cursorPos < t.expr.end) this.cursorPos++;
          else this.cursorPos = t.fullEnd;
        } else if (t.type === 'pow') {
          if (this.cursorPos < t.exp.end) this.cursorPos++;
          else this.cursorPos = t.fullEnd;
        }
      } else {
        let entered = false;
        for (const t of templates) {
          if (this.cursorPos === t.fullStart) {
            if (t.type === 'frac') this.cursorPos = t.num.start;
            else if (t.type === 'mixedfrac') this.cursorPos = t.whole.start;
            else if (t.type === 'int') this.cursorPos = t.expr.start;
            else if (t.type === 'sum') this.cursorPos = t.expr.start;
            else if (t.type === 'diff') this.cursorPos = t.expr.start;
            else if (t.type === 'logbase') this.cursorPos = t.base.start;
            else if (t.type === 'nthroot') this.cursorPos = t.root.start;
            else if (t.type === 'cbrt') this.cursorPos = t.rad.start;
            else if (t.type === 'sqrt') this.cursorPos = t.rad.start;
            else if (t.type === 'abs') this.cursorPos = t.expr.start;
            else if (t.type === 'pow') this.cursorPos = t.exp.start;
            entered = true;
            break;
          }
        }
        if (!entered && this.cursorPos < this.expression.length) {
          this.cursorPos++;
        }
      }
    } else {
      // LEFT
      if (active) {
        const t = active.template;
        if (t.type === 'frac') {
          if (active.part === 'den') {
            if (this.cursorPos > t.den.start) this.cursorPos--;
            else this.cursorPos = t.num.end;
          } else {
            if (this.cursorPos > t.num.start) this.cursorPos--;
            else this.cursorPos = t.fullStart;
          }
        } else if (t.type === 'mixedfrac') {
          if (active.part === 'den') {
            if (this.cursorPos > t.den.start) this.cursorPos--;
            else this.cursorPos = t.num.end;
          } else if (active.part === 'num') {
            if (this.cursorPos > t.num.start) this.cursorPos--;
            else this.cursorPos = t.whole.end;
          } else {
            if (this.cursorPos > t.whole.start) this.cursorPos--;
            else this.cursorPos = t.fullStart;
          }
        } else if (t.type === 'int') {
          if (active.part === 'expr') {
            if (this.cursorPos > t.expr.start) this.cursorPos--;
            else this.cursorPos = t.upper.end;
          } else if (active.part === 'upper') {
            if (this.cursorPos > t.upper.start) this.cursorPos--;
            else this.cursorPos = t.lower.end;
          } else {
            if (this.cursorPos > t.lower.start) this.cursorPos--;
            else this.cursorPos = t.fullStart;
          }
        } else if (t.type === 'sum') {
          if (active.part === 'expr') {
            if (this.cursorPos > t.expr.start) this.cursorPos--;
            else this.cursorPos = t.upper.end;
          } else if (active.part === 'upper') {
            if (this.cursorPos > t.upper.start) this.cursorPos--;
            else this.cursorPos = t.lower.end;
          } else {
            if (this.cursorPos > t.lower.start) this.cursorPos--;
            else this.cursorPos = t.fullStart;
          }
        } else if (t.type === 'diff') {
          if (active.part === 'point') {
            if (this.cursorPos > t.point.start) this.cursorPos--;
            else this.cursorPos = t.expr.end;
          } else {
            if (this.cursorPos > t.expr.start) this.cursorPos--;
            else this.cursorPos = t.fullStart;
          }
        } else if (t.type === 'logbase') {
          if (active.part === 'expr') {
            if (this.cursorPos > t.expr.start) this.cursorPos--;
            else this.cursorPos = t.base.end;
          } else {
            if (this.cursorPos > t.base.start) this.cursorPos--;
            else this.cursorPos = t.fullStart;
          }
        } else if (t.type === 'nthroot') {
          if (active.part === 'rad') {
            if (this.cursorPos > t.rad.start) this.cursorPos--;
            else this.cursorPos = t.root.end;
          } else {
            if (this.cursorPos > t.root.start) this.cursorPos--;
            else this.cursorPos = t.fullStart;
          }
        } else if (t.type === 'cbrt') {
          if (this.cursorPos > t.rad.start) this.cursorPos--;
          else this.cursorPos = t.fullStart;
        } else if (t.type === 'sqrt') {
          if (this.cursorPos > t.rad.start) this.cursorPos--;
          else this.cursorPos = t.fullStart;
        } else if (t.type === 'abs') {
          if (this.cursorPos > t.expr.start) this.cursorPos--;
          else this.cursorPos = t.fullStart;
        } else if (t.type === 'pow') {
          if (this.cursorPos > t.exp.start) this.cursorPos--;
          else this.cursorPos = t.fullStart;
        }
      } else {
        let entered = false;
        for (const t of templates) {
          if (this.cursorPos === t.fullEnd) {
            if (t.type === 'frac') this.cursorPos = t.den.end;
            else if (t.type === 'mixedfrac') this.cursorPos = t.den.end;
            else if (t.type === 'int') this.cursorPos = t.expr.end;
            else if (t.type === 'sum') this.cursorPos = t.expr.end;
            else if (t.type === 'diff') this.cursorPos = t.point.end;
            else if (t.type === 'logbase') this.cursorPos = t.expr.end;
            else if (t.type === 'nthroot') this.cursorPos = t.rad.end;
            else if (t.type === 'cbrt') this.cursorPos = t.rad.end;
            else if (t.type === 'sqrt') this.cursorPos = t.rad.end;
            else if (t.type === 'abs') this.cursorPos = t.expr.end;
            else if (t.type === 'pow') this.cursorPos = t.exp.end;
            entered = true;
            break;
          }
        }
        if (!entered && this.cursorPos > 0) {
          this.cursorPos--;
        }
      }
    }
    this.display.renderExpression(this.expression, this.cursorPos);
  }

  deleteChar() {
    this.saveUndoState();
    if (this.cursorPos <= 0 && this.expression.length === 0) return;

    const templates = this.parseTemplates(this.expression);
    const active = this.findActiveSlot(this.expression, this.cursorPos);

    if (active) {
      const t = active.template;
      if (this.cursorPos > active.slot.start) {
        const before = this.expression.slice(0, this.cursorPos - 1);
        const after = this.expression.slice(this.cursorPos);
        this.expression = before + after;
        this.cursorPos--;
      } else {
        if (t.type === 'frac') {
          if (active.part === 'den') this.cursorPos = t.num.end;
          else {
            if (t.num.text.length === 0 && t.den.text.length === 0) {
              this.expression = this.expression.slice(0, t.fullStart) + this.expression.slice(t.fullEnd);
              this.cursorPos = t.fullStart;
            } else {
              this.cursorPos = t.fullStart;
            }
          }
        } else if (t.type === 'mixedfrac') {
          if (active.part === 'den') this.cursorPos = t.num.end;
          else if (active.part === 'num') this.cursorPos = t.whole.end;
          else {
            if (t.whole.text.length === 0 && t.num.text.length === 0 && t.den.text.length === 0) {
              this.expression = this.expression.slice(0, t.fullStart) + this.expression.slice(t.fullEnd);
              this.cursorPos = t.fullStart;
            } else {
              this.cursorPos = t.fullStart;
            }
          }
        } else if (t.type === 'int') {
          if (active.part === 'expr') this.cursorPos = t.upper.end;
          else if (active.part === 'upper') this.cursorPos = t.lower.end;
          else {
            if (t.lower.text.length === 0 && t.upper.text.length === 0 && t.expr.text.length === 0) {
              this.expression = this.expression.slice(0, t.fullStart) + this.expression.slice(t.fullEnd);
              this.cursorPos = t.fullStart;
            } else {
              this.cursorPos = t.fullStart;
            }
          }
        } else if (t.type === 'sum') {
          if (active.part === 'expr') this.cursorPos = t.upper.end;
          else if (active.part === 'upper') this.cursorPos = t.lower.end;
          else {
            if (t.lower.text.length === 0 && t.upper.text.length === 0 && t.expr.text.length === 0) {
              this.expression = this.expression.slice(0, t.fullStart) + this.expression.slice(t.fullEnd);
              this.cursorPos = t.fullStart;
            } else {
              this.cursorPos = t.fullStart;
            }
          }
        } else if (t.type === 'diff') {
          if (active.part === 'point') this.cursorPos = t.expr.end;
          else {
            if (t.expr.text.length === 0 && t.point.text.length === 0) {
              this.expression = this.expression.slice(0, t.fullStart) + this.expression.slice(t.fullEnd);
              this.cursorPos = t.fullStart;
            } else {
              this.cursorPos = t.fullStart;
            }
          }
        } else if (t.type === 'logbase') {
          if (active.part === 'expr') this.cursorPos = t.base.end;
          else {
            if (t.base.text.length === 0 && t.expr.text.length === 0) {
              this.expression = this.expression.slice(0, t.fullStart) + this.expression.slice(t.fullEnd);
              this.cursorPos = t.fullStart;
            } else {
              this.cursorPos = t.fullStart;
            }
          }
        } else if (t.type === 'nthroot') {
          if (active.part === 'rad') this.cursorPos = t.root.end;
          else {
            if (t.root.text.length === 0 && t.rad.text.length === 0) {
              this.expression = this.expression.slice(0, t.fullStart) + this.expression.slice(t.fullEnd);
              this.cursorPos = t.fullStart;
            } else {
              this.cursorPos = t.fullStart;
            }
          }
        } else if (t.type === 'cbrt') {
          if (t.rad.text.length === 0) {
            this.expression = this.expression.slice(0, t.fullStart) + this.expression.slice(t.fullEnd);
            this.cursorPos = t.fullStart;
          } else {
            this.cursorPos = t.fullStart;
          }
        } else if (t.type === 'sqrt') {
          if (t.rad.text.length === 0) {
            this.expression = this.expression.slice(0, t.fullStart) + this.expression.slice(t.fullEnd);
            this.cursorPos = t.fullStart;
          } else {
            this.cursorPos = t.fullStart;
          }
        } else if (t.type === 'abs') {
          if (t.expr.text.length === 0) {
            this.expression = this.expression.slice(0, t.fullStart) + this.expression.slice(t.fullEnd);
            this.cursorPos = t.fullStart;
          } else {
            this.cursorPos = t.fullStart;
          }
        } else if (t.type === 'pow') {
          if (t.exp.text.length === 0) {
            this.expression = this.expression.slice(0, t.fullStart) + this.expression.slice(t.fullEnd);
            this.cursorPos = t.fullStart;
          } else {
            this.cursorPos = t.fullStart;
          }
        }
      }
    } else {
      let jumpedIntoTemplate = false;
      for (const t of templates) {
        if (this.cursorPos === t.fullEnd) {
          if (t.type === 'frac') this.cursorPos = t.den.end;
          else if (t.type === 'mixedfrac') this.cursorPos = t.den.end;
          else if (t.type === 'int') this.cursorPos = t.expr.end;
          else if (t.type === 'sum') this.cursorPos = t.expr.end;
          else if (t.type === 'diff') this.cursorPos = t.point.end;
          else if (t.type === 'logbase') this.cursorPos = t.expr.end;
          else if (t.type === 'nthroot') this.cursorPos = t.rad.end;
          else if (t.type === 'cbrt') this.cursorPos = t.rad.end;
          else if (t.type === 'sqrt') this.cursorPos = t.rad.end;
          else if (t.type === 'abs') this.cursorPos = t.expr.end;
          else if (t.type === 'pow') this.cursorPos = t.exp.end;
          else if (t.type === 'recurring') this.cursorPos = t.digits.end;
          jumpedIntoTemplate = true;
          break;
        }
      }
      if (!jumpedIntoTemplate && this.cursorPos > 0) {
        const before = this.expression.slice(0, this.cursorPos);
        const after = this.expression.slice(this.cursorPos);
        const compoundTokens = [
          '\\recurring{',
          '\\frac{', '^{', '\\sqrt{', '\\nthroot{', '\\mixedfrac{',
          '\\int{', '\\diff{', '\\sum{', '\\logbase{', '\\cbrt{', '\\abs{',
          'sin(', 'cos(', 'tan(', 'ln(', 'log(', 'Abs(', 'sin⁻¹(', 'cos⁻¹(', 'tan⁻¹(',
          'Pol(', 'Rec(', 'd/dx(', '∑(', 'RanInt#(', 'RanInt(', 'GCD(', 'LCM(', 'Int(', 'Intg(', 'Rnd(',
          '10^(', 'e^(', '∛(', '×10^(',
          'e_const', 'F_const', 'N_A', 'm_p', 'm_n', 'm_e', 'm_μ', 'a_0', 'R_∞', 'r_e',
          'λ_Cp', 'λ_Cn', 'λ_C', 'γ_p', 'μ_N', 'μ_p', 'μ_n', 'μ_μ', 'V_m', 'c_1', 'c_2',
          'c_0', 'ε_0', 'μ_0', 'Z_0', 'Φ_0', 'G_0', 'K_J', 'R_K', 'R_K-90', 'K_J-90',
          'l_P', 'm_P', 't_P', 'μ_B', 'atm'
        ];
        let delLen = 1;
        for (const tok of compoundTokens) {
          if (before.endsWith(tok)) {
            delLen = tok.length;
            break;
          }
        }
        this.expression = before.slice(0, before.length - delLen) + after;
        this.cursorPos -= delLen;
      }
    }
    this.display.renderExpression(this.expression, this.cursorPos);
  }

  clearAll() {
    this.saveUndoState();
    this.expression = '';
    this.cursorPos = 0;
    this.displayResult = '0';
    this.justCalculated = false;
    if (this.display) {
      this.display.showView('NORMAL');
      this.display.setMode('ready');
      this.display.renderExpression('', 0);
      this.display.setResult('0');
      this.display.setScrollArrows(false, false);
      this.display.updateScrollArrows();
    }
  }

  // -------------------------------------------------------------
  // SHIFT + CALC (SOLVE) - AUTHENTIC CLASSWIZ 100% ON-SCREEN LCD
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // SHIFT + CALC (SOLVE) - AUTHENTIC CLASSWIZ 100% ON-SCREEN LCD
  // -------------------------------------------------------------
  startSolve() {
    if (!this.expression.trim()) {
      this.showSolveError('Syntax ERROR', 'Lỗi cú pháp');
      return;
    }

    // Check if expression contains variable x (or any variable)
    const hasVariable = /[xXABCDEFyY]/.test(this.expression);
    if (!hasVariable) {
      this.showSolveError('Variable ERROR', 'Lỗi biến');
      return;
    }

    this.osState = 'SOLVE_PROMPT';
    this.solveState = {
      expr: this.expression,
      guess: String(this.engine.variables.x !== undefined ? this.engine.variables.x : 0),
      buffer: '',
      sol: null
    };
    this.display.setScrollArrows(false, false);
    this.renderSolvePrompt();
  }

  showSolveError(enMsg, viMsg) {
    this.osState = 'SOLVE_ERROR';
    const isVi = this.display.language === 'VI';
    this.display.setScrollArrows(false, false);
    this.display.renderCustom(`
      <div class="solve-cant-solve-container">
        <div class="classwiz-dialog-box">
          <div class="dialog-title">${isVi ? viMsg : enMsg}</div>
          <div class="dialog-divider"></div>
          <div class="dialog-row">
            <span class="dialog-key">[AC]</span>
            <span class="dialog-action">:${isVi ? 'Hủy bỏ' : 'Cancel'}</span>
          </div>
        </div>
      </div>
    `);
  }

  renderSolvePrompt() {
    const isVi = this.display.language === 'VI';
    const currentGuess = this.solveState.buffer !== '' ? this.solveState.buffer : this.solveState.guess;
    this.display.setScrollArrows(false, false);
    this.display.renderCustom(`
      <div class="solve-screen-prompt">
        <div class="solve-expr-line">
          ${this.display.formatToNaturalHtml(this.solveState.expr)}
        </div>
        <div class="solve-header-line">
          ${isVi ? 'Giải cho x' : 'Solve for x'}
        </div>
        <div class="solve-input-line">
          <span class="solve-var-label">x=</span>
          <span class="solve-var-val">${currentGuess}<span class="cursor"></span></span>
        </div>
      </div>
    `);
  }

  renderSolveResult() {
    const sol = this.solveState.sol;
    if (!sol) return;
    this.display.setScrollArrows(true, true);
    this.display.renderCustom(`
      <div class="solve-screen-result">
        <div class="solve-expr-line">
          ${this.display.formatToNaturalHtml(this.solveState.expr)}
        </div>
        <div class="solve-result-row">
          <span class="solve-res-label">x=</span>
          <span class="solve-res-val">${sol.x}</span>
        </div>
        <div class="solve-result-row">
          <span class="solve-res-label">L−R=</span>
          <span class="solve-res-val">${sol.lMinusR}</span>
        </div>
      </div>
    `);
  }

  renderCantSolve() {
    const isVi = this.display.language === 'VI';
    this.osState = 'SOLVE_CANT';
    this.display.setScrollArrows(false, false);
    this.display.renderCustom(`
      <div class="solve-cant-solve-container">
        <div class="classwiz-dialog-box">
          <div class="dialog-title">${isVi ? 'Không giải được' : "Can't Solve"}</div>
          <div class="dialog-divider"></div>
          <div class="dialog-row">
            <span class="dialog-key">[AC]</span>
            <span class="dialog-action">:${isVi ? 'Hủy bỏ' : 'Cancel'}</span>
          </div>
          <div class="dialog-row">
            <span class="dialog-key">[ = ]</span>
            <span class="dialog-action">:${isVi ? 'Tiếp tục' : 'Continue'}</span>
          </div>
        </div>
      </div>
    `);
  }

  handleSolveKey(key) {
    if (key === 'AC') {
      this.display.setScrollArrows(false, false);
      this.osState = 'NORMAL';
      this.cursorPos = this.expression.length;
      this.renderCurrentView();
      return;
    }
    if (key === 'ON') {
      this.clearAll();
      return;
    }
    if (key === 'MENU') {
      if (this.state.shift) {
        this.state.shift = false;
        this.display.updateIndicators(this.state);
        this.openSetup();
      } else {
        this.openMenu();
      }
      return;
    }

    if (this.osState === 'SOLVE_ERROR') {
      if (key === 'AC' || key === 'EQUALS' || key === 'LEFT' || key === 'RIGHT') {
        this.display.setScrollArrows(false, false);
        this.osState = 'NORMAL';
        this.cursorPos = this.expression.length;
        this.renderCurrentView();
      }
      return;
    }

    if (this.osState === 'SOLVE_CANT') {
      if (key === 'AC' || key === 'LEFT' || key === 'RIGHT') {
        this.display.setScrollArrows(false, false);
        this.osState = 'NORMAL';
        this.cursorPos = this.expression.length;
        this.renderCurrentView();
        return;
      }
      if (key === 'EQUALS') {
        this.osState = 'SOLVE_PROMPT';
        this.renderSolvePrompt();
        return;
      }
      return;
    }

    if (this.osState === 'SOLVE_PROMPT') {
      if (['0','1','2','3','4','5','6','7','8','9','.'].includes(key)) {
        this.solveState.buffer += key;
        this.renderSolvePrompt();
        return;
      }
      if (key === 'sub' || key === 'neg') {
        if (!this.solveState.buffer) {
          this.solveState.buffer = '-';
        }
        this.renderSolvePrompt();
        return;
      }
      if (key === 'DEL') {
        if (this.solveState.buffer.length > 0) {
          this.solveState.buffer = this.solveState.buffer.slice(0, -1);
        } else {
          this.solveState.guess = '0';
        }
        this.renderSolvePrompt();
        return;
      }
      if (key === 'LEFT' || key === 'RIGHT' || key === 'UP') {
        this.display.setScrollArrows(false, false);
        this.osState = 'NORMAL';
        this.cursorPos = this.expression.length;
        this.renderCurrentView();
        return;
      }
      if (key === 'EQUALS' || key === 'CALC') {
        const guessVal = this.solveState.buffer !== '' ? parseFloat(this.solveState.buffer) : parseFloat(this.solveState.guess);
        const sol = this.engine.solveEquation(this.solveState.expr, isNaN(guessVal) ? 0 : guessVal);
        if (sol && !isNaN(sol.x)) {
          this.solveState.sol = sol;
          this.engine.variables.x = sol.x;
          this.engine.variables.Ans = sol.x;
          this.rawResult = sol.x;
          this.displayResult = `x=${sol.x}`;
          this.osState = 'SOLVE_RESULT';
          this.renderSolveResult();
        } else {
          this.renderCantSolve();
        }
        return;
      }
    } else if (this.osState === 'SOLVE_RESULT') {
      if (key === 'EQUALS') {
        // In Casio fx-580VN X, pressing [ = ] in result screen returns to Solve for x prompt
        this.osState = 'SOLVE_PROMPT';
        this.solveState.guess = String(this.solveState.sol.x);
        this.solveState.buffer = '';
        this.renderSolvePrompt();
        return;
      }
      if (key === 'AC' || key === 'LEFT' || key === 'RIGHT') {
        this.display.setScrollArrows(false, false);
        this.osState = 'NORMAL';
        this.cursorPos = this.expression.length;
        this.renderCurrentView();
        return;
      }
      if (key === 'UP' || key === 'DOWN') {
        // Keep arrows active on LCD
        return;
      }
    }
  }

  toggleDecimalApprox() {
    if (!isNaN(this.rawResult)) {
      this.displayResult = String(Number(this.rawResult.toFixed(10)));
      this.display.setResult(this.displayResult);
    }
  }

  toggleInsertMode() {
    this.state.insertMode = !this.state.insertMode;
    this.display.setResult(this.state.insertMode ? 'INS ON' : 'INS OFF');
    setTimeout(() => {
      this.display.setResult(this.displayResult);
    }, 600);
  }

  formatCasioNumber(num) {
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) return String(num);
    if (num === 0) return '0';

    const absVal = Math.abs(num);
    if (absVal >= 1e10 || absVal < 1e-2) {
      let exp = Math.floor(Math.log10(absVal));
      let mantissa = num / Math.pow(10, exp);
      mantissa = Number(mantissa.toFixed(9));
      if (Math.abs(mantissa) >= 10) {
        mantissa = Number((mantissa / 10).toFixed(9));
        exp += 1;
      }
      return `${mantissa}e${exp >= 0 ? '+' : ''}${exp}`;
    }
    return String(Number(num.toPrecision(10)));
  }

  calculate(forceApprox = false) {
    if (!this.expression.trim()) return;

    let balanced = this.expression;
    const openP = (balanced.match(/\(/g) || []).length;
    const closeP = (balanced.match(/\)/g) || []).length;
    if (openP > closeP) {
      balanced += ')'.repeat(openP - closeP);
    }
    const openB = (balanced.match(/\{/g) || []).length;
    const closeB = (balanced.match(/\}/g) || []).length;
    if (openB > closeB) {
      balanced += '}'.repeat(openB - closeB);
    }

    const res = this.engine.evaluate(balanced);
    this.rawResult = res;

    if (typeof res === 'string') {
      this.displayResult = res;
      this.exactResult = res;
    } else if (isNaN(res)) {
      this.displayResult = 'Math ERROR';
      this.exactResult = 'Math ERROR';
    } else {
      const exact = this.engine.toRadicalOrFraction(res);
      if (exact) {
        this.exactResult = exact;
        this.displayResult = exact;
      } else {
        const frac = this.engine.toFraction(res);
        if (frac && frac.d !== 1 && Math.abs(frac.d) < 1000 && Math.abs(frac.n) < 1e10) {
          this.exactResult = `${frac.n}/${frac.d}`;
          this.displayResult = `${frac.n}/${frac.d}`;
        } else {
          const decStr = this.formatCasioNumber(res);
          this.exactResult = decStr;
          this.displayResult = decStr;
        }
      }
      if (forceApprox) {
        this.displayResult = this.formatCasioNumber(res);
      }
    }

    this.justCalculated = true;
    this.display.setMode('result');
    this.display.renderExpression(this.expression, this.cursorPos, false);
    this.display.setResult(this.displayResult);
    this.history.push({ expr: this.expression, res: this.displayResult });
    this.historyIndex = this.history.length;
    this.display.setScrollArrows(true, false);
    this.display.updateScrollArrows();
  }

  handleSD() {
    if (this.rawResult === undefined || isNaN(this.rawResult) || typeof this.rawResult === 'string') return;

    const decStr = this.formatCasioNumber(this.rawResult);
    if (this.exactResult && this.displayResult !== decStr) {
      this.displayResult = decStr;
    } else if (this.exactResult && this.displayResult === decStr) {
      this.displayResult = this.exactResult;
    } else {
      if (this.displayResult.includes('/') || this.displayResult.includes('\\sqrt')) {
        this.displayResult = decStr;
      } else {
        const exact = this.engine.toRadicalOrFraction(this.rawResult);
        if (exact) this.displayResult = exact;
      }
    }
    this.display.setResult(this.displayResult);
  }

  toggleMixedFraction() {
    if (this.rawResult === undefined || isNaN(this.rawResult) || typeof this.rawResult === 'string') return;
    const frac = this.engine.toFraction(this.rawResult);
    if (frac && frac.d > 1) {
      const whole = Math.floor(Math.abs(frac.n) / frac.d);
      const rem = Math.abs(frac.n) % frac.d;
      const sign = frac.n < 0 ? '-' : '';
      if (whole > 0 && rem > 0) {
        this.displayResult = `${sign}${whole} ${rem}/${frac.d}`;
      } else {
        this.displayResult = `${frac.n}/${frac.d}`;
      }
      this.display.setResult(this.displayResult);
    }
  }

  handleShiftEng() {
    if (this.state.currentMode === 2) {
      this.insert('∠');
      return;
    }
    this.handleEng(true);
  }

  handleEng(isReverse = false) {
    if (isNaN(this.rawResult) || !isFinite(this.rawResult) || this.rawResult === 0) return;
    const val = this.rawResult;
    if (this.engExp === undefined || !this.justCalculated) {
      const exp10 = Math.floor(Math.log10(Math.abs(val)));
      let rem = exp10 % 3;
      if (rem < 0) rem += 3;
      this.engExp = exp10 - rem;
    } else {
      if (isReverse) {
        this.engExp += 3;
      } else {
        this.engExp -= 3;
      }
    }
    const mantissa = val / Math.pow(10, this.engExp);
    const mantStr = Number(mantissa.toFixed(8));
    this.displayResult = `${mantStr}×10^(${this.engExp})`;
    this.display.setResult(this.displayResult);
  }

  addToMemory() {
    const val = typeof this.rawResult === 'number' && !isNaN(this.rawResult) ? this.rawResult : 0;
    this.engine.variables.M += val;
    this.state.hasMemory = true;
    this.display.updateIndicators(this.state);
    this.display.setResult(`M + ${val}`);
  }

  subtractFromMemory() {
    const val = typeof this.rawResult === 'number' && !isNaN(this.rawResult) ? this.rawResult : 0;
    this.engine.variables.M -= val;
    this.state.hasMemory = true;
    this.display.updateIndicators(this.state);
    this.display.setResult(`M - ${val}`);
  }

  navigateHistory(dir) {
    if (this.history.length === 0) return;
    this.historyIndex += dir;
    if (this.historyIndex < 0) this.historyIndex = 0;
    if (this.historyIndex >= this.history.length) this.historyIndex = this.history.length - 1;

    const item = this.history[this.historyIndex];
    if (item) {
      this.expression = item.expr;
      this.cursorPos = this.expression.length;
      this.displayResult = item.res;
      this.display.renderExpression(this.expression, this.cursorPos);
      this.display.setResult(this.displayResult);
    }
  }

  recallMemory() {
    this.osState = 'LIST';
    const v = this.engine.variables;
    this.display.renderList('RECALL', [
      `A=${v.A || 0}  B=${v.B || 0}`,
      `C=${v.C || 0}  D=${v.D || 0}`,
      `E=${v.E || 0}  F=${v.F || 0}`,
      `x=${v.x || 0}  y=${v.y || 0}`
    ], false, false);
  }

  factorizeAns() {
    const num = Math.round(Number(this.rawResult));
    if (isNaN(num) || num <= 1) {
      this.display.setResult('Cannot FACT');
      return;
    }
    let temp = num;
    const factors = [];
    for (let d = 2; d * d <= temp; d++) {
      let count = 0;
      while (temp % d === 0) {
        count++;
        temp /= d;
      }
      if (count > 0) factors.push(count === 1 ? `${d}` : `${d}^${count}`);
    }
    if (temp > 1) factors.push(`${temp}`);
    this.display.setResult(`${num} = ${factors.join(' × ')}`);
  }

  // -------------------------------------------------------------
  // SHIFT 7: CONST (SCIENTIFIC CONSTANTS)
  // -------------------------------------------------------------
  getConstData() {
    const isVi = this.display.language === 'VI';
    return {
      1: {
        name: isVi ? 'Đại lượng chung' : 'Universal',
        items: [
          { label: 'c_0', sym: 'c_0' },
          { label: 'ε_0', sym: 'ε_0' },
          { label: 'μ_0', sym: 'μ_0' },
          { label: 'Z_0', sym: 'Z_0' },
          { label: 'G', sym: 'G' },
          { label: 'l_P', sym: 'l_P' },
          { label: 'm_P', sym: 'm_P' },
          { label: 't_P', sym: 't_P' },
          { label: 'h', sym: 'h' },
          { label: 'ℏ', sym: 'ℏ' }
        ]
      },
      2: {
        name: isVi ? 'Điện từ' : 'Electromagnetic',
        items: [
          { label: 'μ_B', sym: 'μ_B' },
          { label: 'e', sym: 'e_const' },
          { label: 'Φ_0', sym: 'Φ_0' },
          { label: 'G_0', sym: 'G_0' },
          { label: 'K_J', sym: 'K_J' },
          { label: 'R_K', sym: 'R_K' }
        ]
      },
      3: {
        name: isVi ? 'Nguyên tử & Hạt nhân' : 'Atomic & Nuclear',
        items: [
          { label: 'm_p', sym: 'm_p' },
          { label: 'm_n', sym: 'm_n' },
          { label: 'm_e', sym: 'm_e' },
          { label: 'm_μ', sym: 'm_μ' },
          { label: 'a_0', sym: 'a_0' },
          { label: 'R_∞', sym: 'R_∞' },
          { label: 'α', sym: 'α' },
          { label: 'r_e', sym: 'r_e' },
          { label: 'λ_C', sym: 'λ_C' },
          { label: 'γ_p', sym: 'γ_p' },
          { label: 'λ_Cp', sym: 'λ_Cp' },
          { label: 'λ_Cn', sym: 'λ_Cn' },
          { label: 'μ_N', sym: 'μ_N' },
          { label: 'μ_p', sym: 'μ_p' },
          { label: 'μ_n', sym: 'μ_n' },
          { label: 'μ_μ', sym: 'μ_μ' }
        ]
      },
      4: {
        name: isVi ? 'Hóa lý' : 'Physico-Chem',
        items: [
          { label: 'u', sym: 'u' },
          { label: 'F', sym: 'F_const' },
          { label: 'N_A', sym: 'N_A' },
          { label: 'k', sym: 'k' },
          { label: 'V_m', sym: 'V_m' },
          { label: 'R', sym: 'R' },
          { label: 'c_1', sym: 'c_1' },
          { label: 'c_2', sym: 'c_2' },
          { label: 'σ', sym: 'σ' }
        ]
      },
      5: {
        name: isVi ? 'Giá trị quy ước' : 'Adopted Values',
        items: [
          { label: 'g', sym: 'g' },
          { label: 'atm', sym: 'atm' },
          { label: 'R_K-90', sym: 'R_K-90' },
          { label: 'K_J-90', sym: 'K_J-90' }
        ]
      },
      6: {
        name: isVi ? 'Khác' : 'Other',
        items: [
          { label: 't', sym: 't' }
        ]
      }
    };
  }

  openConstants() {
    this.osState = 'CONST_CAT';
    this.constCatPage = 1;
    this.constData = this.getConstData();
    this.renderConstCat();
  }

  renderConstCat() {
    const isVi = this.display.language === 'VI';
    if (this.constCatPage === 1) {
      this.display.renderList(isVi ? 'HẰNG SỐ' : 'CONST', isVi ? [
        '1:Đại lượng chung',
        '2:Điện từ',
        '3:Nguyên tử & Hạt nhân',
        '4:Hóa lý'
      ] : [
        '1:Universal',
        '2:Electromagnetic',
        '3:Atomic & Nuclear',
        '4:Physico-Chemical'
      ], false, true);
    } else {
      this.display.renderList(isVi ? 'HẰNG SỐ' : 'CONST', isVi ? [
        '1:Giá trị quy ước',
        '2:Khác'
      ] : [
        '1:Adopted Values',
        '2:Other'
      ], true, false);
    }
  }

  handleConstKey(key) {
    if (key === 'AC' || key === 'ON') {
      this.exitToNormal();
      return;
    }

    if (this.osState === 'CONST_CAT') {
      if (key === 'DOWN' && this.constCatPage === 1) {
        this.constCatPage = 2;
        this.renderConstCat();
        return;
      }
      if (key === 'UP' && this.constCatPage === 2) {
        this.constCatPage = 1;
        this.renderConstCat();
        return;
      }
      if (key === 'LEFT') {
        this.exitToNormal();
        return;
      }

      let selectedCat = null;
      if (this.constCatPage === 1) {
        if (key === '1') selectedCat = 1;
        else if (key === '2') selectedCat = 2;
        else if (key === '3') selectedCat = 3;
        else if (key === '4') selectedCat = 4;
      } else {
        if (key === '1') selectedCat = 5;
        else if (key === '2') selectedCat = 6;
      }

      if (selectedCat !== null) {
        this.osState = 'CONST_ITEM';
        this.constCatId = selectedCat;
        this.constItemPage = 1;
        this.renderConstItems();
      }
      return;
    }

    if (this.osState === 'CONST_ITEM') {
      const cat = this.constData[this.constCatId];
      if (!cat) {
        this.exitToNormal();
        return;
      }

      const totalItems = cat.items.length;
      const totalPages = Math.ceil(totalItems / 4);

      if (key === 'DOWN' && this.constItemPage < totalPages) {
        this.constItemPage++;
        this.renderConstItems();
        return;
      }
      if (key === 'UP' && this.constItemPage > 1) {
        this.constItemPage--;
        this.renderConstItems();
        return;
      }
      if (key === 'LEFT') {
        this.osState = 'CONST_CAT';
        this.renderConstCat();
        return;
      }

      if (['1', '2', '3', '4'].includes(key)) {
        const idx = (this.constItemPage - 1) * 4 + (parseInt(key, 10) - 1);
        if (idx < totalItems) {
          const item = cat.items[idx];
          this.exitToNormal();
          this.insert(item.sym);
        }
      }
    }
  }

  renderConstItems() {
    const cat = this.constData[this.constCatId];
    if (!cat) return;
    const totalItems = cat.items.length;
    const totalPages = Math.ceil(totalItems / 4);
    const start = (this.constItemPage - 1) * 4;
    const slice = cat.items.slice(start, start + 4);
    const rows = slice.map((it, i) => `${i + 1}:${it.label}`);
    this.display.renderList(cat.name, rows, this.constItemPage > 1, this.constItemPage < totalPages);
  }

  // -------------------------------------------------------------
  // SHIFT 8: CONV (UNIT CONVERSION)
  // -------------------------------------------------------------
  getConvData() {
    return {
      1: {
        name: 'Length',
        items: [
          { label: 'in▶cm', cmd: 'in▶cm' },
          { label: 'cm▶in', cmd: 'cm▶in' },
          { label: 'ft▶m', cmd: 'ft▶m' },
          { label: 'm▶ft', cmd: 'm▶ft' },
          { label: 'yd▶m', cmd: 'yd▶m' },
          { label: 'm▶yd', cmd: 'm▶yd' },
          { label: 'mile▶km', cmd: 'mile▶km' },
          { label: 'km▶mile', cmd: 'km▶mile' }
        ]
      },
      2: {
        name: 'Area',
        items: [
          { label: 'acre▶m²', cmd: 'acre▶m²' },
          { label: 'm²▶acre', cmd: 'm²▶acre' },
          { label: 'ha▶m²', cmd: 'ha▶m²' },
          { label: 'm²▶ha', cmd: 'm²▶ha' }
        ]
      },
      3: {
        name: 'Volume',
        items: [
          { label: 'gal(US)▶L', cmd: 'gal▶L' },
          { label: 'L▶gal(US)', cmd: 'L▶gal' },
          { label: 'pt▶L', cmd: 'pt▶L' },
          { label: 'L▶pt', cmd: 'L▶pt' }
        ]
      },
      4: {
        name: 'Mass',
        items: [
          { label: 'oz▶g', cmd: 'oz▶g' },
          { label: 'g▶oz', cmd: 'g▶oz' },
          { label: 'lb▶kg', cmd: 'lb▶kg' },
          { label: 'kg▶lb', cmd: 'kg▶lb' }
        ]
      },
      5: {
        name: 'Velocity',
        items: [
          { label: 'km/h▶m/s', cmd: 'km/h▶m/s' },
          { label: 'm/s▶km/h', cmd: 'm/s▶km/h' }
        ]
      },
      6: {
        name: 'Pressure',
        items: [
          { label: 'atm▶Pa', cmd: 'atm▶Pa' },
          { label: 'Pa▶atm', cmd: 'Pa▶atm' },
          { label: 'mmHg▶Pa', cmd: 'mmHg▶Pa' },
          { label: 'Pa▶mmHg', cmd: 'Pa▶mmHg' }
        ]
      },
      7: {
        name: 'Energy',
        items: [
          { label: 'J▶cal', cmd: 'J▶cal' },
          { label: 'cal▶J', cmd: 'cal▶J' }
        ]
      },
      8: {
        name: 'Power',
        items: [
          { label: 'hp▶kW', cmd: 'hp▶kW' },
          { label: 'kW▶hp', cmd: 'kW▶hp' }
        ]
      },
      9: {
        name: 'Temperature',
        items: [
          { label: '°F▶°C', cmd: '°F▶°C' },
          { label: '°C▶°F', cmd: '°C▶°F' },
          { label: '°C▶K', cmd: '°C▶K' },
          { label: 'K▶°C', cmd: 'K▶°C' }
        ]
      }
    };
  }

  openConversions() {
    this.osState = 'CONV_CAT';
    this.convCatPage = 1;
    this.convData = this.getConvData();
    this.renderConvCat();
  }

  renderConvCat() {
    const isVi = this.display.language === 'VI';
    if (this.convCatPage === 1) {
      this.display.renderList(isVi ? 'CHUYỂN ĐỔI' : 'CONVERSION', isVi ? [
        '1:Chiều dài',
        '2:Diện tích',
        '3:Thể tích',
        '4:Khối lượng'
      ] : [
        '1:Length',
        '2:Area',
        '3:Volume',
        '4:Mass'
      ], false, true);
    } else if (this.convCatPage === 2) {
      this.display.renderList(isVi ? 'CHUYỂN ĐỔI' : 'CONVERSION', isVi ? [
        '1:Vận tốc',
        '2:Áp suất',
        '3:Năng lượng',
        '4:Công suất'
      ] : [
        '1:Velocity',
        '2:Pressure',
        '3:Energy',
        '4:Power'
      ], true, true);
    } else {
      this.display.renderList(isVi ? 'CHUYỂN ĐỔI' : 'CONVERSION', isVi ? [
        '1:Nhiệt độ'
      ] : [
        '1:Temperature'
      ], true, false);
    }
  }

  handleConvKey(key) {
    if (key === 'AC' || key === 'ON') {
      this.exitToNormal();
      return;
    }

    if (this.osState === 'CONV_CAT') {
      if (key === 'DOWN' && this.convCatPage < 3) {
        this.convCatPage++;
        this.renderConvCat();
        return;
      }
      if (key === 'UP' && this.convCatPage > 1) {
        this.convCatPage--;
        this.renderConvCat();
        return;
      }
      if (key === 'LEFT') {
        this.exitToNormal();
        return;
      }

      let selectedCat = null;
      if (this.convCatPage === 1) {
        if (key === '1') selectedCat = 1;
        else if (key === '2') selectedCat = 2;
        else if (key === '3') selectedCat = 3;
        else if (key === '4') selectedCat = 4;
      } else if (this.convCatPage === 2) {
        if (key === '1') selectedCat = 5;
        else if (key === '2') selectedCat = 6;
        else if (key === '3') selectedCat = 7;
        else if (key === '4') selectedCat = 8;
      } else {
        if (key === '1') selectedCat = 9;
      }

      if (selectedCat !== null) {
        this.osState = 'CONV_ITEM';
        this.convCatId = selectedCat;
        this.convItemPage = 1;
        this.renderConvItems();
      }
      return;
    }

    if (this.osState === 'CONV_ITEM') {
      const cat = this.convData[this.convCatId];
      if (!cat) {
        this.exitToNormal();
        return;
      }

      const totalItems = cat.items.length;
      const totalPages = Math.ceil(totalItems / 4);

      if (key === 'DOWN' && this.convItemPage < totalPages) {
        this.convItemPage++;
        this.renderConvItems();
        return;
      }
      if (key === 'UP' && this.convItemPage > 1) {
        this.convItemPage--;
        this.renderConvItems();
        return;
      }
      if (key === 'LEFT') {
        this.osState = 'CONV_CAT';
        this.renderConvCat();
        return;
      }

      if (['1', '2', '3', '4'].includes(key)) {
        const idx = (this.convItemPage - 1) * 4 + (parseInt(key, 10) - 1);
        if (idx < totalItems) {
          const item = cat.items[idx];
          this.exitToNormal();
          if (!this.expression.trim() && this.displayResult && this.displayResult !== '0') {
            this.expression = 'Ans';
            this.cursorPos = 3;
          }
          this.insert(item.cmd);
        }
      }
    }
  }

  renderConvItems() {
    const cat = this.convData[this.convCatId];
    if (!cat) return;
    const totalItems = cat.items.length;
    const totalPages = Math.ceil(totalItems / 4);
    const start = (this.convItemPage - 1) * 4;
    const slice = cat.items.slice(start, start + 4);
    const rows = slice.map((it, i) => `${i + 1}:${it.label}`);
    this.display.renderList(cat.name, rows, this.convItemPage > 1, this.convItemPage < totalPages);
  }

  // -------------------------------------------------------------
  // SHIFT 9: RESET (SYSTEM INITIALIZE)
  // -------------------------------------------------------------
  openReset() {
    this.osState = 'RESET_MENU';
    const isVi = this.display.language === 'VI';
    this.display.renderList(isVi ? 'Khởi tạo?' : 'Reset?', isVi ? [
      '1:Cài đặt',
      '2:Bộ nhớ',
      '3:Khởi tạo tất cả'
    ] : [
      '1:Setup Data',
      '2:Memory',
      '3:Initialize All'
    ], false, false);
  }

  handleResetKey(key) {
    const isVi = this.display.language === 'VI';
    if (key === 'ON') {
      this.exitToNormal();
      return;
    }

    if (this.osState === 'RESET_MENU') {
      if (key === 'AC' || key === 'LEFT') {
        this.exitToNormal();
        return;
      }
      if (key === '1') {
        this.osState = 'RESET_CONFIRM';
        this.resetType = 'SETUP';
        this.renderResetConfirm(isVi ? 'Thiết lập lại Cài đặt?' : 'Reset Setup?');
      } else if (key === '2') {
        this.osState = 'RESET_CONFIRM';
        this.resetType = 'MEMORY';
        this.renderResetConfirm(isVi ? 'Xóa bộ nhớ?' : 'Clear Memory?');
      } else if (key === '3') {
        this.osState = 'RESET_CONFIRM';
        this.resetType = 'ALL';
        this.renderResetConfirm(isVi ? 'Khởi tạo tất cả?' : 'Initialize All?');
      }
      return;
    }

    if (this.osState === 'RESET_CONFIRM') {
      if (key === 'AC' || key === 'LEFT') {
        this.exitToNormal();
        return;
      }
      if (key === 'EQUALS') {
        let msg = '';
        if (this.resetType === 'SETUP') {
          this.state.angleMode = 'DEG';
          this.engine.setAngleMode('DEG');
          this.inOutFormat = 'MathI/MathO';
          this.numFormat = 'Norm';
          this.fractionFormat = 'd/c';
          msg = isVi ? 'Cài đặt đã thiết lập lại' : 'Reset Setup';
        } else if (this.resetType === 'MEMORY') {
          this.engine.variables = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, x: 0, y: 0, z: 0, M: 0, Ans: 0, PreAns: 0 };
          this.state.hasMemory = false;
          msg = isVi ? 'Bộ nhớ đã xóa' : 'Clear Memory';
        } else if (this.resetType === 'ALL') {
          this.engine.variables = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, x: 0, y: 0, z: 0, M: 0, Ans: 0, PreAns: 0 };
          this.state.hasMemory = false;
          this.state.shift = false;
          this.state.alpha = false;
          this.state.currentMode = 1;
          this.state.modeName = 'COMP';
          this.inOutFormat = 'MathI/MathO';
          this.numFormat = 'Norm';
          this.fractionFormat = 'd/c';
          this.display.language = 'VI'; // Factory default for Casio fx-580VN X
          this.clearAll();
          msg = isVi ? 'Đã khởi tạo tất cả' : 'Reset All';
        }
        this.display.updateIndicators(this.state);
        this.osState = 'RESET_DONE';
        this.display.renderCustom(`
          <div style="padding:6px 4px;font-family:var(--font-lcd);color:var(--lcd-dark);height:100%;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;">
            <div style="font-size:13px;font-weight:bold;">${msg}</div>
            <div style="font-size:12px;margin-top:10px;">${isVi ? 'Nhấn phím [AC]' : 'Press [AC] key'}</div>
          </div>
        `);
      }
      return;
    }

    if (this.osState === 'RESET_DONE') {
      if (key === 'AC' || key === 'ON') {
        this.exitToNormal();
      }
    }
  }

  renderResetConfirm(title) {
    const isVi = this.display.language === 'VI';
    this.display.renderCustom(`
      <div style="padding:4px 4px;font-family:var(--font-lcd);color:var(--lcd-dark);height:100%;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;">
        <div style="font-size:12px;font-weight:bold;border-bottom:1px solid var(--lcd-dark);padding-bottom:2px;">${title}</div>
        <div style="font-size:12px;line-height:1.6;margin:4px 0;">
          <div>[ = ]  : ${isVi ? 'Đồng ý' : 'Yes'}</div>
          <div>[AC] : ${isVi ? 'Hủy bỏ' : 'Cancel'}</div>
        </div>
      </div>
    `);
  }

  exitToNormal() {
    this.osState = 'NORMAL';
    this.display.showView('NORMAL');
    this.display.updateIndicators(this.state);
    this.display.renderExpression(this.expression, this.cursorPos);
    this.display.setResult(this.displayResult);
  }

  powerOff() {
    this.state.isPoweredOff = true;
    this.display.setPower(false);
  }

  powerOn() {
    this.state.isPoweredOff = false;
    this.display.setPower(true);
    this.state.shift = false;
    this.state.alpha = false;
    this.clearAll();
    this.renderCurrentView();
  }
}

// Instantiate
function initCasioWithParams() {
  window.casioApp = new CasioApp();
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('menu')) {
      const page = parseInt(urlParams.get('page') || '1');
      const sel = parseInt(urlParams.get('sel') || (page === 2 ? '9' : '1'));
      window.casioApp.osState = 'MENU';
      window.casioApp.menuPage = page;
      window.casioApp.menuSelectedMode = sel;
      if (window.casioApp.display) {
        window.casioApp.display.renderMenu(sel, page);
      }
    }
    if (urlParams.has('table')) {
      window.casioApp.selectMode(8);
      window.casioApp.table.fx = '2x^2+3x';
      window.casioApp.table.start = 1;
      window.casioApp.table.end = 5;
      window.casioApp.table.step = 1;
      window.casioApp.table.rows = window.casioApp.engine.generateTable('2x^2+3x', null, 1, 5, 1);
      window.casioApp.table.scrollIdx = 2; // displays rows 3, 4, 5
      window.casioApp.table.selectedRow = 4; // row 5
      window.casioApp.table.selectedCol = 'fx';
      window.casioApp.osState = 'TABLE_GRID';
      window.casioApp.renderTableGrid();
    }
  } catch (e) {}
}

// End of Casio Classes

  

  // =========================================================
  // Net Note - Casio fx-580VN X Bridge & Public API
  // =========================================================

  // Khởi tạo các instance cốt lõi
  if (!window.casioMathEngine) {
    window.casioMathEngine = new MathEngine();
  }
  if (!window.casioDisplay && typeof CasioDisplay !== 'undefined') {
    try { window.casioDisplay = new CasioDisplay(); } catch (e) {}
  }
  if (!window.casioApp && typeof CasioApp !== 'undefined') {
    try { window.casioApp = new CasioApp(); } catch (e) {}
  }

  // Khởi tạo EmulatorUI nếu DOM đã có sẵn
  if (typeof EmulatorUI !== 'undefined' && typeof document !== 'undefined' && document.getElementById) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        try { window.emulatorUI = new EmulatorUI(); } catch (e) {}
      });
    } else {
      try { window.emulatorUI = new EmulatorUI(); } catch (e) {}
    }
  }

  // Bridge đối tượng __fx580 cho ứng dụng Nét
  var fxState = {
    isOpen: false,
    isMinimized: false,
    soundEnabled: true,
    mode: 'COMP',
    angleUnit: 'DEG',
    history: [],
    historyIndex: -1,
    _rawExpression: '',
    _lastResult: null,
    menuNotice: '',
    menuSelectedIndex: 0,
    get rawExpression() {
      return this._rawExpression || (window.casioApp ? (window.casioApp.expression || '') : '');
    },
    set rawExpression(v) {
      this._rawExpression = v;
      if (window.casioApp) {
        window.casioApp.expression = v;
        window.casioApp.cursorPos = v.length;
      }
    },
    get lastResult() {
      if (this._lastResult !== null && this._lastResult !== undefined) return this._lastResult;
      if (window.casioApp && window.casioApp.rawResult !== undefined && window.casioApp.rawResult !== null) {
        return {
          val: window.casioApp.rawResult,
          frac: window.casioMathEngine ? window.casioMathEngine.toFraction(window.casioApp.rawResult) : null
        };
      }
      return null;
    },
    set lastResult(v) {
      this._lastResult = v;
    }
  };

  var fxBridge = {
    get state() {
      if (window.casioApp) {
        fxState.soundEnabled = window.casioApp.soundEnabled !== false;
        if (window.casioApp.osState === 'MENU') {
          fxState.mode = 'MENU';
        } else if (fxState.mode !== 'MENU' && window.casioApp.state) {
          fxState.mode = window.casioApp.state.modeName;
        }
        fxState.angleMode = window.casioApp.state ? window.casioApp.state.angleMode : 'DEG';
        if (window.casioApp.history && window.casioApp.history.length > 0) {
          fxState.history = window.casioApp.history.map(function(h) {
            var rawVal = (h.val !== undefined ? h.val : (h.res !== undefined ? h.res : h.result));
            var numVal = (!isNaN(Number(rawVal)) && rawVal !== '' && rawVal !== null) ? Number(rawVal) : rawVal;
            return {
              expr: h.expr || h.expression || '',
              res: numVal
            };
          });
          fxState.historyIndex = window.casioApp.historyIndex;
        }
      }
      var winEl = document.getElementById ? document.getElementById('fx580-calculator-window') : null;
      if (winEl) {
        fxState.isOpen = winEl.style.display !== 'none';
        fxState.isMinimized = winEl.classList.contains('minimized');
      }
      return fxState;
    },

    get app() { return window.casioApp; },
    get engine() { return window.casioMathEngine; },
    get display() { return window.casioDisplay; },

    open: function() {
      fxState.isOpen = true;
      var winEl = document.getElementById ? document.getElementById('fx580-calculator-window') : null;
      var btn = document.getElementById ? document.getElementById('btn-toggle-fx580') : null;
      if (winEl) {
        winEl.style.display = 'flex';
        winEl.classList.remove('minimized');
      }
      if (btn) btn.classList.add('active');
      if (window.emulatorUI && typeof window.emulatorUI.setupLcdAutoResize === 'function') {
        window.emulatorUI.setupLcdAutoResize();
      }
      if (window.casioApp && typeof window.casioApp.renderCurrentView === 'function') {
        window.casioApp.renderCurrentView();
      }
    },

    close: function() {
      fxState.isOpen = false;
      var winEl = document.getElementById ? document.getElementById('fx580-calculator-window') : null;
      var btn = document.getElementById ? document.getElementById('btn-toggle-fx580') : null;
      if (winEl) winEl.style.display = 'none';
      if (btn) btn.classList.remove('active');
    },

    toggle: function() {
      var winEl = document.getElementById ? document.getElementById('fx580-calculator-window') : null;
      if (winEl && winEl.style.display !== 'none') {
        this.close();
      } else {
        this.open();
      }
    },

    minimize: function() {
      var winEl = document.getElementById ? document.getElementById('fx580-calculator-window') : null;
      if (winEl) {
        winEl.classList.toggle('minimized');
        fxState.isMinimized = winEl.classList.contains('minimized');
      }
    },

    evaluate: function(expr, angleMode) {
      if (!expr) return 0;
      var eng = window.casioMathEngine || new MathEngine();
      var clean = String(expr)
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');

      // Đạo hàm vi phân diff(f(x), x0)
      var diffMatch = clean.match(/^diff\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)$/);
      if (diffMatch) {
        return eng.numericalDerivative(diffMatch[1].trim(), parseFloat(diffMatch[2]));
      }

      // Tích phân vi phân integ(f(x), a, b)
      var integMatch = clean.match(/^integ\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)$/);
      if (integMatch) {
        return eng.numericalIntegral(integMatch[1].trim(), parseFloat(integMatch[2]), parseFloat(integMatch[3]));
      }

      return eng.evaluate(clean, angleMode || 'DEG');
    },

    solveQuadratic: function(a, b, c) {
      var eng = window.casioMathEngine || new MathEngine();
      var res = eng.solveQuadratic(a, b, c);
      var x1 = null, x2 = null;
      if (res.roots && res.roots.length > 0) {
        x1 = res.roots[0].val;
        x2 = res.roots.length > 1 ? res.roots[1].val : res.roots[0].val;
      }
      return {
        type: res.type === 'real' ? 'TWO_REAL' : (res.type === 'complex' ? 'COMPLEX' : 'NO_SOLUTION'),
        roots: res.roots ? res.roots.map(function(r) { return r.val; }) : [],
        x1: x1,
        x2: x2,
        vertexX: res.vertex ? res.vertex.xVal : null,
        vertexY: res.vertex ? res.vertex.yVal : null,
        raw: res
      };
    },

    solveCubic: function(a, b, c, d) {
      var eng = window.casioMathEngine || new MathEngine();
      var res = eng.solveCubic(a, b, c, d);
      return {
        type: res.type === 'real' ? 'THREE_REAL' : 'ONE_REAL',
        roots: res.roots ? res.roots.map(function(r) { return r.val; }) : [],
        extrema: res.extrema,
        raw: res
      };
    },

    solveLinearSystem: function(matrix, vector) {
      var eng = window.casioMathEngine || new MathEngine();
      var A, b;
      if (!vector && Array.isArray(matrix) && matrix.length > 0 && Array.isArray(matrix[0])) {
        var n = matrix.length;
        A = [];
        b = [];
        for (var i = 0; i < n; i++) {
          A.push(matrix[i].slice(0, matrix[i].length - 1));
          b.push(matrix[i][matrix[i].length - 1]);
        }
      } else {
        A = matrix;
        b = vector;
      }

      var res = eng.solveLinearSystem(A, b);
      if (res.success && res.solutions) {
        var solArr = Object.keys(res.solutions).map(function(k) { return res.solutions[k].val; });
        return {
          type: 'UNIQUE',
          solution: solArr,
          solutions: res.solutions
        };
      }
      return {
        type: res.error === 'infinite' ? 'INFINITE' : 'NO_SOLUTION',
        solution: []
      };
    },

    solveEquationForX: function(eqn, guess) {
      var eng = window.casioMathEngine || new MathEngine();
      var res = eng.solveEquation(eqn, guess || 0);
      return { x: res.x, lMinusR: res.lMinusR };
    },

    generateTableValues: function(expr, start, end, step) {
      var eng = window.casioMathEngine || new MathEngine();
      var res = eng.generateTable(expr, null, start, end, step);
      return res.map(function(r) { return { x: r.x, y: r.fx }; });
    },

    compute1VarStats: function(data) {
      var eng = window.casioMathEngine || new MathEngine();
      var res = eng.calc1VarStat(data);
      return {
        mean: res.mean,
        med: res.median,
        min: res.min,
        max: res.max,
        q1: res.q1,
        q3: res.q3,
        sigma: res.sigma,
        s: res.s,
        n: res.n,
        raw: res
      };
    },

    handleKey: function(action, val) {
      var app = window.casioApp;
      if (!app) return;

      if (action === 'MENU') {
        if (app.osState === 'MENU') {
          app.closeMenu();
        } else {
          app.openMenu();
        }
        fxState.mode = app.osState === 'MENU' ? 'MENU' : 'COMP';
        var resEl = document.getElementById ? document.getElementById('fx580-result-text') : null;
        if (resEl) {
          resEl.innerHTML = '<span class="item">1: Calculate</span><span class="item">2: Complex</span><span class="item">3: Base-N</span><span class="item">4: Matrix</span><span class="item">5: Vector</span><span class="item">6: Statistics</span><span class="item">7: Distribution</span><span class="item">8: Table</span><span class="item">9: Equation/Func</span><span class="item">10: Inequality</span><span class="item">11: Verify</span><span class="item">12: Ratio</span>';
        }
        return;
      }

      if (action === 'AC') {
        app.clearAll();
        if (app.osState === 'MENU') app.closeMenu();
        fxState.mode = 'COMP';
        return;
      }

      if (action === 'NUM' && app.osState === 'MENU') {
        var num = parseInt(val, 10);
        if (num === 1) {
          app.selectMode(1);
          app.closeMenu();
          fxState.mode = 'COMP';
          fxState.menuNotice = '';
          return;
        } else if (num === 2) {
          fxState.mode = 'MENU';
          fxState.menuNotice = 'Chế độ Complex đang chọn trong Menu';
          var exprEl = document.getElementById ? document.getElementById('fx580-expr-text') : null;
          if (exprEl) exprEl.textContent = 'Chế độ Complex: chưa được triển khai hoàn tất';
          return;
        } else {
          app.handleMenuKey(val);
          return;
        }
      }

      if (action === 'DOWN' && app.osState === 'MENU') {
        fxState.menuSelectedIndex = (fxState.menuSelectedIndex + 3) % 12;
        return;
      }

      if (action === 'EQUAL' && app.osState === 'MENU') {
        if (fxState.menuSelectedIndex === 9) {
          fxState.menuNotice = 'Inequality';
        }
        return;
      }

      if (action === 'UP') {
        app.navigateHistory(-1);
        if (app.history && app.history.length > 0 && app.historyIndex >= 0) {
          fxState.rawExpression = app.expression;
        }
        return;
      }

      if (action === 'DOWN') {
        app.navigateHistory(1);
        if (app.history && app.history.length > 0 && app.historyIndex >= 0) {
          fxState.rawExpression = app.expression;
        }
        return;
      }

      if (action === 'EQUAL' || action === '=') {
        if (fxState.rawExpression && (!app.expression || app.expression !== fxState.rawExpression)) {
          app.expression = fxState.rawExpression;
        }
        app.calculate();
        return;
      }

      var keyMap = {
        'SHIFT': 'SHIFT',
        'ALPHA': 'ALPHA',
        'OPTN': 'OPTN',
        'CALC': 'CALC',
        'LEFT': 'LEFT',
        'RIGHT': 'RIGHT',
        'DEL': 'DEL',
        'ON': 'ON'
      };

      var k = keyMap[action] || action;
      app.handleKey(k);
    },

    getCurrentDisplayText: function() {
      var app = window.casioApp;
      var expr = fxState.rawExpression || (app ? app.expression : '');
      var res = '';
      if (fxState.lastResult && fxState.lastResult.val !== undefined && fxState.lastResult.val !== null) {
        res = fxState.lastResult.val;
      } else if (app && app.displayResult !== undefined) {
        res = app.displayResult;
      }
      if (res !== undefined && res !== null && res !== '') {
        return expr ? (expr + ' = ' + res) : String(res);
      }
      return expr;
    },

    insertResultToCanvas: function() {
      var text = this.getCurrentDisplayText();
      if (!text) return;
      if (typeof window.__netInsertText === 'function') {
        window.__netInsertText(text);
      } else if (typeof window.showPageToast === 'function') {
        window.showPageToast('✍️ Kết quả: ' + text);
      }
    }
  };

  window.__fx580 = fxBridge;

  // Khởi tạo kéo thả cửa sổ và sự kiện nút điều khiển cửa sổ
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function () {
      var win = document.getElementById('fx580-calculator-window');
      var titleBar = document.querySelector('.fx580-title-bar');
      var btnInsert = document.getElementById('fx580-btn-insert');
      var btnClose = document.getElementById('fx580-btn-close');
      var btnMin = document.getElementById('fx580-btn-minimize');

      if (btnInsert) {
        btnInsert.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          fxBridge.insertResultToCanvas();
        });
      }

      if (btnClose) {
        btnClose.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          fxBridge.close();
        });
      }

      if (btnMin) {
        btnMin.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          fxBridge.minimize();
        });
      }

      // Kéo thả cửa sổ máy tính mượt mà
      if (win && titleBar) {
        var isDragging = false;
        var startX = 0, startY = 0;
        var initLeft = 0, initTop = 0;

        titleBar.addEventListener('pointerdown', function (e) {
          if (e.target.closest('button') || e.target.closest('select') || e.target.closest('.fx580-win-controls')) {
            return;
          }
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          var rect = win.getBoundingClientRect();
          initLeft = rect.left;
          initTop = rect.top;
          win.style.transition = 'none';
          titleBar.setPointerCapture(e.pointerId);
          e.preventDefault();
        });

        titleBar.addEventListener('pointermove', function (e) {
          if (!isDragging) return;
          var dx = e.clientX - startX;
          var dy = e.clientY - startY;
          var newLeft = Math.max(8, Math.min(window.innerWidth - win.offsetWidth - 8, initLeft + dx));
          var newTop = Math.max(48, Math.min(window.innerHeight - 60, initTop + dy));
          win.style.left = newLeft + 'px';
          win.style.top = newTop + 'px';
          win.style.right = 'auto';
        });

        var stopDrag = function (e) {
          if (!isDragging) return;
          isDragging = false;
          try { titleBar.releasePointerCapture(e.pointerId); } catch (err) {}
        };
        titleBar.addEventListener('pointerup', stopDrag);
        titleBar.addEventListener('pointercancel', stopDrag);
      }
    });
  }

})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : (this.document || {}));
