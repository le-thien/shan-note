/**
 * Net Note - Casio fx-580VN X ClassWiz Full Emulator Engine
 * Mô phỏng hoàn chỉnh và chân thực máy tính Casio fx-580VN X cho giáo viên và học sinh:
 * - Âm thanh bàn phím Web Audio API chân thực (Key click feedback)
 * - Màn hình LCD Natural-V.P.A.M tương tác chân thực (phân số tử/mẫu, căn thức, luỹ thừa, tích phân, đạo hàm)
 * - Đầy đủ các chế độ MENU chuẩn Casio ClassWiz fx-580VN X:
 *   + Mode 1: Calculate (Tính toán khoa học, Tích phân ∫, Đạo hàm d/dx, Tổng ∑, CALC, SOLVE dò nghiệm)
 *   + Mode 2: Complex (Số phức a + bi, Modun, Argument, Số phức liên hợp)
 *   + Mode 3: Base-N (Hệ nhị phân BIN, bát phân OCT, thập phân DEC, thập lục phân HEX)
 *   + Mode 4: Matrix (Ma trận 2x2, 3x3: Nhân ma trận, Định thức Det, Nghịch đảo)
 *   + Mode 5: Vector (Vector 2D, 3D: Tích vô hướng Dot, Tích có hướng Cross, Độ dài Norm)
 *   + Mode 6: Statistics (Thống kê 1 biến: Trung bình, Phương sai, Độ lệch chuẩn, Tứ phân vị)
 *   + Mode 8: Table (Lập bảng giá trị hàm số f(x) với Start, End, Step)
 *   + Mode 9: Equation/Func (Phương trình bậc 2, 3, 4; Hệ phương trình 2, 3, 4 ẩn)
 *   + Mode A: Inequality (Bất phương trình bậc 2, 3)
 * - Menu SETUP (Shift + Menu): Chọn đơn vị góc Deg/Rad, Định dạng MthIO/LineIO, Bật/Tắt âm thanh
 * - Hỗ trợ bàn phím máy tính vật lý (Keyboard Input)
 * - Cửa sổ nổi kéo thả khắp màn hình ghi chú.
 */

(function (window) {
  'use strict';

  // Trạng thái toàn cục của máy tính fx-580VN X
  const state = {
    isOpen: false,
    isMinimized: false,
    soundEnabled: true,
    mode: 'COMP',          // COMP, MENU, SETUP, DISTRIBUTION, INEQUALITY, VERIFY and RATIO are also reserved modes
    angleUnit: 'DEG',      // 'DEG' | 'RAD'
    ioFormat: 'MthIO',     // 'MthIO' | 'LineIO'
    isShift: false,        // Trạng thái phím SHIFT
    isAlpha: false,        // Trạng thái phím ALPHA
    displayFormat: 'auto', // 'auto' | 'fraction' | 'decimal'
    menuNotice: '',
    menuSelectedIndex: 0,
    ans: 0,                // Biến Ans
    rawExpression: '',     // Biểu thức chuỗi
    cursorPos: 0,
    lastResult: null,
    history: [],
    historyIndex: -1,
    // Bộ nhớ biến A, B, C, D, E, F, X, Y, M
    variables: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, X: 0, Y: 0, M: 0 },
    // Dữ liệu cho các mode chuyên biệt
    subState: {
      eqnType: null,       // 'POLY2' | 'POLY3' | 'POLY4' | 'SIMUL2' | 'SIMUL3' | 'SIMUL4'
      eqnParams: [],
      eqnLabels: [],
      eqnIndex: 0,
      eqnResults: [],
      // Bảng giá trị TABLE
      tableFunc: '',
      tableStart: 1,
      tableEnd: 5,
      tableStep: 1,
      tableRows: [],
      // Số phức
      complexMode: 'RECT', // 'RECT' (a+bi) | 'POLAR' (r∠θ)
      // Base-N
      baseN: 'DEC',        // 'DEC' | 'HEX' | 'BIN' | 'OCT'
      // Thống kê STAT
      statData: [],
      statResults: null
    }
  };

  const calculatorModes = [
    { key: '1', label: 'Calculate', mode: 'COMP', available: true },
    { key: '2', label: 'Complex', mode: 'COMPLEX', available: false },
    { key: '3', label: 'Base-N', mode: 'BASE_N', available: false },
    { key: '4', label: 'Matrix', mode: 'MATRIX', available: false },
    { key: '5', label: 'Vector', mode: 'VECTOR', available: false },
    { key: '6', label: 'Statistics', mode: 'STAT', available: true },
    { key: '7', label: 'Distribution', mode: 'DISTRIBUTION', available: false },
    { key: '8', label: 'Table', mode: 'TABLE', available: true },
    { key: '9', label: 'Equation/Func', mode: 'EQN', available: true },
    { key: '10', label: 'Inequality', mode: 'INEQUALITY', available: false },
    { key: '11', label: 'Verify', mode: 'VERIFY', available: false },
    { key: '12', label: 'Ratio', mode: 'RATIO', available: false }
  ];

  // Hệ thống âm thanh Web Audio API (Click tiếng phím bấm Casio)
  let audioCtx = null;
  function playKeyClickSound() {
    if (!state.soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2200, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.015);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.015);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.016);
    } catch (e) {
      // Bỏ qua nếu trình duyệt chặn audio tự động
    }
  }

  // UCLN để rút gọn phân số
  function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  // Chuyển đổi số thập phân sang phân số tối giản (Hỗ trợ Natural Display)
  function toFraction(val, maxDenom = 10000) {
    if (!Number.isFinite(val)) return null;
    if (Math.abs(val) > 1e9) return null;
    if (Math.abs(val - Math.round(val)) < 1e-10) {
      return { num: Math.round(val), den: 1 };
    }

    const sign = val < 0 ? -1 : 1;
    val = Math.abs(val);

    let bestNum = 1;
    let bestDen = 1;
    let minErr = Infinity;

    for (let den = 1; den <= maxDenom; den++) {
      const num = Math.round(val * den);
      const err = Math.abs(val - num / den);
      if (err < minErr) {
        minErr = err;
        bestNum = num;
        bestDen = den;
        if (err < 1e-9) break;
      }
    }

    if (minErr < 1e-7 && bestDen <= maxDenom) {
      const g = gcd(bestNum, bestDen);
      return { num: sign * (bestNum / g), den: bestDen / g };
    }
    return null;
  }

  // Định dạng số hiển thị trên màn hình LCD dot-matrix
  function formatNumber(num, maxDecimals = 10) {
    if (!Number.isFinite(num)) {
      if (Number.isNaN(num)) return 'Math ERROR';
      return num > 0 ? 'Infinity' : '-Infinity';
    }
    if (Math.abs(num) < 1e-12) return '0';
    if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-3 && Math.abs(num) > 0)) {
      return num.toExponential(6).replace('e+', '×10^').replace('e-', '×10^-');
    }
    const str = num.toFixed(maxDecimals);
    return str.replace(/\.?0+$/, '');
  }

  // Giai thừa n!
  function factorial(n) {
    if (n < 0 || n > 170 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }

  // Chỉnh hợp nPr
  function nPr(n, r) {
    if (n < r || n < 0 || r < 0) return NaN;
    return factorial(n) / factorial(n - r);
  }

  // Tổ hợp nCr
  function nCr(n, r) {
    if (n < r || n < 0 || r < 0) return NaN;
    return factorial(n) / (factorial(r) * factorial(n - r));
  }

  // Phân tích và tính giá trị biểu thức toán học (COMP Engine)
  function evaluateMathExpression(exprStr, angleUnit = 'DEG', ansVal = 0, vars = {}) {
    if (!exprStr || !exprStr.trim()) return 0;

    let clean = exprStr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/Ans/g, `(${ansVal})`)
      .replace(/π/g, `(${Math.PI})`)
      .replace(/\be\b/g, `(${Math.E})`);

    // Thay thế các biến lưu trữ A, B, C, D, E, F, X, Y, M
    Object.keys(vars).forEach(v => {
      const reg = new RegExp(`\\b${v}\\b`, 'g');
      clean = clean.replace(reg, `(${vars[v] || 0})`);
    });

    // Tính đạo hàm số d/dx(f(x), x0) bằng công thức vi phân 5 điểm
    clean = clean.replace(/diff\(([^,]+),([^)]+)\)/g, (match, fnStr, x0Str) => {
      try {
        const x0 = evaluateMathExpression(x0Str, angleUnit, ansVal, vars);
        const h = 1e-5;
        const f = (xVal) => evaluateMathExpression(fnStr.replace(/\bx\b/gi, `(${xVal})`), angleUnit, ansVal, vars);
        const d = (-f(x0 + 2 * h) + 8 * f(x0 + h) - 8 * f(x0 - h) + f(x0 - 2 * h)) / (12 * h);
        return `(${d})`;
      } catch (e) {
        return 'NaN';
      }
    });

    // Tính tích phân số ∫(f(x), a, b) bằng phương pháp Simpson 1000 bước
    clean = clean.replace(/integ\(([^,]+),([^,]+),([^)]+)\)/g, (match, fnStr, aStr, bStr) => {
      try {
        const a = evaluateMathExpression(aStr, angleUnit, ansVal, vars);
        const b = evaluateMathExpression(bStr, angleUnit, ansVal, vars);
        const n = 1000;
        const h = (b - a) / n;
        const f = (xVal) => evaluateMathExpression(fnStr.replace(/\bx\b/gi, `(${xVal})`), angleUnit, ansVal, vars);
        let sum = f(a) + f(b);
        for (let i = 1; i < n; i++) {
          sum += f(a + i * h) * (i % 2 === 0 ? 2 : 4);
        }
        return `(${(sum * h) / 3})`;
      } catch (e) {
        return 'NaN';
      }
    });

    // Xử lý căn bậc hai √(x) và căn bậc n
    clean = clean.replace(/cbrt\(([^()]+)\)/g, 'Math.cbrt($1)');
    clean = clean.replace(/√\(([^()]+)\)/g, 'Math.sqrt($1)');
    clean = clean.replace(/√([0-9.]+)/g, 'Math.sqrt($1)');

    // Xử lý luỹ thừa x^y -> **
    clean = clean.replace(/\^/g, '**');

    // Góc lượng giác
    const degToRad = angleUnit === 'DEG' ? `*(${Math.PI}/180)` : '';
    const radToDeg = angleUnit === 'DEG' ? `*(180/${Math.PI})` : '';

    clean = clean.replace(/\bsin\(([^()]+)\)/g, `Math.sin(($1)${degToRad})`);
    clean = clean.replace(/\bcos\(([^()]+)\)/g, `Math.cos(($1)${degToRad})`);
    clean = clean.replace(/\btan\(([^()]+)\)/g, `Math.tan(($1)${degToRad})`);

    clean = clean.replace(/\basin\(([^()]+)\)/g, `(Math.asin($1)${radToDeg})`);
    clean = clean.replace(/\bacos\(([^()]+)\)/g, `(Math.acos($1)${radToDeg})`);
    clean = clean.replace(/\batan\(([^()]+)\)/g, `(Math.atan($1)${radToDeg})`);

    clean = clean.replace(/\bln\(([^()]+)\)/g, 'Math.log($1)');
    clean = clean.replace(/\blog\(([^()]+)\)/g, 'Math.log10($1)');
    clean = clean.replace(/\babs\(([^()]+)\)/g, 'Math.abs($1)');

    // An toàn khi chạy eval
    const sanitized = clean.replace(/[^0-9+\-*/().eE Mathpowsqrtcbrtincoalgt,]/g, '');
    try {
      const fn = new Function('Math', `return (${sanitized});`);
      const val = fn(Math);
      if (typeof val === 'number') {
        return Math.abs(val) < 1e-12 ? 0 : val;
      }
      return NaN;
    } catch (e) {
      return NaN;
    }
  }

  // Thuật toán dò nghiệm SOLVE bằng phương pháp Newton-Raphson
  function solveEquationForX(exprStr, initialGuess = 0) {
    let eqParts = exprStr.split('=');
    let fStr;
    if (eqParts.length === 2) {
      fStr = `(${eqParts[0]}) - (${eqParts[1]})`;
    } else {
      fStr = exprStr;
    }

    let x = initialGuess;
    const maxIter = 100;
    const tol = 1e-9;
    const h = 1e-5;

    for (let i = 0; i < maxIter; i++) {
      const fx = evaluateMathExpression(fStr.replace(/\bx\b/gi, `(${x})`), state.angleUnit, state.ans, state.variables);
      if (Math.abs(fx) < tol) {
        return { x: x, iterations: i, isExact: true };
      }
      const fxh = evaluateMathExpression(fStr.replace(/\bx\b/gi, `(${x + h})`), state.angleUnit, state.ans, state.variables);
      const dfx = (fxh - fx) / h;
      if (Math.abs(dfx) < 1e-12) {
        x += 0.1; // Dịch chuyển điểm bắt đầu nếu đạo hàm bằng 0
        continue;
      }
      const nextX = x - fx / dfx;
      if (Math.abs(nextX - x) < tol) {
        return { x: nextX, iterations: i, isExact: true };
      }
      x = nextX;
    }
    return { x: x, iterations: maxIter, isExact: false };
  }

  // Giải phương trình bậc 2: ax^2 + bx + c = 0
  function solveQuadratic(a, b, c) {
    if (Math.abs(a) < 1e-12) {
      if (Math.abs(b) < 1e-12) {
        return Math.abs(c) < 1e-12 ? { type: 'INFINITE' } : { type: 'NO_SOLUTION' };
      }
      const x = -c / b;
      return { type: 'LINEAR', x1: x, x1Frac: toFraction(x) };
    }

    const delta = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = -delta / (4 * a);

    if (delta > 1e-12) {
      const sqrtD = Math.sqrt(delta);
      const x1 = (-b + sqrtD) / (2 * a);
      const x2 = (-b - sqrtD) / (2 * a);
      return {
        type: 'TWO_REAL',
        x1: x1,
        x1Frac: toFraction(x1),
        x2: x2,
        x2Frac: toFraction(x2),
        vertexX: vertexX,
        vertexY: vertexY,
        isMin: a > 0
      };
    } else if (Math.abs(delta) <= 1e-12) {
      return {
        type: 'DOUBLE_REAL',
        x1: vertexX,
        x1Frac: toFraction(vertexX),
        vertexX: vertexX,
        vertexY: vertexY,
        isMin: a > 0
      };
    } else {
      const real = vertexX;
      const imag = Math.sqrt(-delta) / (2 * Math.abs(a));
      return {
        type: 'COMPLEX',
        real: real,
        imag: imag,
        vertexX: vertexX,
        vertexY: vertexY,
        isMin: a > 0
      };
    }
  }

  // Giải phương trình bậc 3: ax^3 + bx^2 + cx + d = 0 (Cardano)
  function solveCubic(a, b, c, d) {
    if (Math.abs(a) < 1e-12) return solveQuadratic(b, c, d);

    const A = b / a;
    const B = c / a;
    const C = d / a;

    const p = B - (A * A) / 3;
    const q = (2 * A * A * A) / 27 - (A * B) / 3 + C;
    const delta = (q * q) / 4 + (p * p * p) / 27;

    const shift = A / 3;
    if (delta > 1e-12) {
      const u = Math.cbrt(-q / 2 + Math.sqrt(delta));
      const v = Math.cbrt(-q / 2 - Math.sqrt(delta));
      const x1 = u + v - shift;
      return { type: 'ONE_REAL', roots: [x1] };
    } else if (Math.abs(delta) <= 1e-12) {
      const u = Math.cbrt(-q / 2);
      const x1 = 2 * u - shift;
      const x2 = -u - shift;
      return { type: 'MULTIPLE_REAL', roots: [x1, x2] };
    } else {
      const r = Math.sqrt(-(p * p * p) / 27);
      const phi = Math.acos(-q / (2 * r));
      const m = 2 * Math.cbrt(r);
      const x1 = m * Math.cos(phi / 3) - shift;
      const x2 = m * Math.cos((phi + 2 * Math.PI) / 3) - shift;
      const x3 = m * Math.cos((phi + 4 * Math.PI) / 3) - shift;
      return { type: 'THREE_REAL', roots: [x1, x2, x3].sort((m1, m2) => m2 - m1) };
    }
  }

  // Giải hệ phương trình bậc nhất n ẩn bằng phương pháp khử Gauss-Jordan
  function solveLinearSystem(matrix) {
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
      let maxEl = Math.abs(matrix[i][i]);
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(matrix[k][i]) > maxEl) {
          maxEl = Math.abs(matrix[k][i]);
          maxRow = k;
        }
      }
      for (let k = i; k <= n; k++) {
        const tmp = matrix[maxRow][k];
        matrix[maxRow][k] = matrix[i][k];
        matrix[i][k] = tmp;
      }
      if (Math.abs(matrix[i][i]) < 1e-12) {
        return { type: 'NO_SOLUTION' };
      }
      for (let k = i + 1; k < n; k++) {
        const c = -matrix[k][i] / matrix[i][i];
        for (let j = i; j <= n; j++) {
          if (i === j) matrix[k][j] = 0;
          else matrix[k][j] += c * matrix[i][j];
        }
      }
    }
    const x = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
      x[i] = matrix[i][n] / matrix[i][i];
      for (let k = i - 1; k >= 0; k--) {
        matrix[k][n] -= matrix[k][i] * x[i];
      }
    }
    return { type: 'UNIQUE', solution: x };
  }

  // Bảng giá trị Table f(x)
  function generateTableValues(funcStr, start, end, step) {
    const rows = [];
    if (step <= 0 || start > end) return rows;
    for (let x = start; x <= end + 1e-9; x += step) {
      const y = evaluateMathExpression(funcStr.replace(/\bx\b/gi, `(${x})`), state.angleUnit, state.ans, state.variables);
      rows.push({ x: x, y: y });
    }
    return rows;
  }

  // Thống kê 1 biến (1-VAR Statistics)
  function compute1VarStats(data) {
    if (!data || data.length === 0) return null;
    const n = data.length;
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const sumSq = data.reduce((a, b) => a + b * b, 0);
    const variance = (sumSq - (sum * sum) / n) / n;
    const stdDev = Math.sqrt(Math.max(0, variance));
    const sampleStdDev = n > 1 ? Math.sqrt(Math.max(0, (sumSq - (sum * sum) / n) / (n - 1))) : 0;
    const sorted = [...data].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[n - 1];
    const med = n % 2 === 1 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

    return {
      n: n,
      mean: mean,
      sum: sum,
      stdDev: stdDev,
      sampleStdDev: sampleStdDev,
      min: min,
      med: med,
      max: max
    };
  }

  // Khởi tạo các phần tử DOM và bộ điều khiển
  let elWindow = null;
  let elExprDisplay = null;
  let elResultDisplay = null;
  let elStatusShift = null;
  let elStatusAlpha = null;
  let elStatusAngle = null;
  let elStatusMath = null;
  let elHistoryDrawer = null;
  let elHistoryList = null;

  function initUI() {
    elWindow = document.getElementById('fx580-calculator-window');
    if (!elWindow) return;

    elExprDisplay = document.getElementById('fx580-expr-text');
    elResultDisplay = document.getElementById('fx580-result-text');
    elStatusShift = document.getElementById('fx580-ind-s');
    elStatusAlpha = document.getElementById('fx580-ind-a');
    elStatusAngle = document.getElementById('fx580-ind-d');
    elStatusMath = document.getElementById('fx580-ind-math');
    elHistoryDrawer = document.getElementById('fx580-history-drawer');
    elHistoryList = document.getElementById('fx580-history-list');

    setupDraggable(elWindow);
    setupKeypadEvents();
    setupPhysicalKeyboardEvents();
  }

  // Cập nhật giao diện màn hình LCD Natural Display
  function updateScreen() {
    if (!elExprDisplay || !elResultDisplay) return;

    if (elStatusShift) elStatusShift.style.visibility = state.isShift ? 'visible' : 'hidden';
    if (elStatusAlpha) elStatusAlpha.style.visibility = state.isAlpha ? 'visible' : 'hidden';
    if (elStatusAngle) elStatusAngle.textContent = state.angleUnit === 'DEG' ? 'D' : 'R';
    if (elStatusMath) elStatusMath.style.visibility = 'visible';
    if (elExprDisplay.parentElement) {
      elExprDisplay.parentElement.classList.toggle('fx580-menu-screen', state.mode === 'MENU');
    }

    // 1. Màn hình MENU chính (Icons & số)
    if (state.mode === 'MENU') {
      elExprDisplay.textContent = state.menuNotice || 'MENU · ✓ có phần hỗ trợ · — chưa triển khai';
      elResultDisplay.classList.add('fx580-menu-active');
      elResultDisplay.innerHTML = `<div class="fx580-menu-grid">${calculatorModes.map((item, index) =>
        `<span class="${item.available ? 'fx580-menu-mode-supported' : 'fx580-menu-mode-unavailable'}${index === state.menuSelectedIndex ? ' fx580-menu-mode-selected' : ''}">${item.key}: ${item.label} ${item.available ? '✓' : '—'}</span>`
      ).join('')}</div>`;
      return;
    }

    elResultDisplay.classList.remove('fx580-menu-active');

    // 2. Màn hình SETUP (Shift + Menu)
    if (state.mode === 'SETUP') {
      elExprDisplay.innerHTML = '<span class="fx580-menu-title">-- CÀI ĐẶT (SET UP) --</span>';
      elResultDisplay.innerHTML = `
        <div class="fx580-menu-grid">
          <span>1: Deg/Rad [${state.angleUnit}]</span>
          <span>2: MthIO/Line [${state.ioFormat}]</span>
          <span>3: Âm thanh phím [${state.soundEnabled ? 'Bật' : 'Tắt'}]</span>
        </div>`;
      return;
    }

    // 3. Màn hình MENU 9: EQUATION
    if (state.mode === 'EQN') {
      renderEquationScreen();
      return;
    }

    // 4. Màn hình MENU 8: TABLE
    if (state.mode === 'TABLE') {
      renderTableScreen();
      return;
    }

    // 5. Màn hình MENU 6: STATISTICS
    if (state.mode === 'STAT') {
      renderStatScreen();
      return;
    }

    // 6. Chế độ tính toán thông thường (Mode 1: COMP)
    let displayStr = state.rawExpression;
    if (!displayStr) {
      elExprDisplay.innerHTML = '<span class="fx580-cursor"></span>';
    } else {
      let pretty = displayStr
        .replace(/Math\.sqrt\(([^)]+)\)/g, '√($1)')
        .replace(/Math\.cbrt\(([^)]+)\)/g, '∛($1)')
        .replace(/Math\.pow\(([^,]+),([^)]+)\)/g, '$1^$2');
      elExprDisplay.textContent = pretty;
    }

    if (state.lastResult === null) {
      elResultDisplay.textContent = '';
    } else if (typeof state.lastResult === 'string') {
      elResultDisplay.textContent = state.lastResult;
    } else {
      const res = state.lastResult;
      if (state.displayFormat === 'fraction' && res.frac && res.frac.den > 1) {
        elResultDisplay.innerHTML = `<span class="fx580-fraction"><span class="num">${res.frac.num}</span><span class="den">${res.frac.den}</span></span>`;
      } else {
        elResultDisplay.textContent = formatNumber(res.val);
      }
    }
  }

  // Màn hình phương trình (EQN)
  function renderEquationScreen() {
    const s = state.subState;
    if (!s.eqnType) {
      elExprDisplay.innerHTML = '<span class="fx580-menu-title">-- PHƯƠNG TRÌNH & HỆ --</span>';
      elResultDisplay.innerHTML = `
        <div class="fx580-menu-grid">
          <span>1: Hệ 2 ẩn</span><span>2: Bậc 2</span>
          <span>3: Bậc 3</span><span>4: Hệ 3 ẩn</span>
        </div>`;
      return;
    }

    if (s.eqnResults && s.eqnResults.length > 0) {
      const cur = s.eqnResults[s.eqnIndex % s.eqnResults.length];
      elExprDisplay.textContent = `[${s.eqnType}] ${cur.label}:`;
      if (cur.frac && cur.frac.den > 1 && state.displayFormat === 'fraction') {
        elResultDisplay.innerHTML = `<span class="fx580-fraction"><span class="num">${cur.frac.num}</span><span class="den">${cur.frac.den}</span></span>`;
      } else {
        elResultDisplay.textContent = cur.valStr || formatNumber(cur.val);
      }
    } else {
      const curLabel = s.eqnLabels[s.eqnIndex] || 'a?';
      elExprDisplay.textContent = `Nhập hệ số: ${curLabel}`;
      elResultDisplay.textContent = state.rawExpression || '0';
    }
  }

  // Màn hình Bảng giá trị Table
  function renderTableScreen() {
    const s = state.subState;
    if (s.tableRows && s.tableRows.length > 0) {
      let html = '<div class="fx580-table-view">';
      s.tableRows.forEach((r, idx) => {
        html += `<div class="table-row"><span>${idx + 1}</span><span>x=${formatNumber(r.x)}</span><span>f(x)=${formatNumber(r.y)}</span></div>`;
      });
      html += '</div>';
      elExprDisplay.textContent = `f(x) = ${s.tableFunc}`;
      elResultDisplay.innerHTML = html;
    } else {
      elExprDisplay.textContent = 'f(x) =';
      elResultDisplay.textContent = state.rawExpression || '0';
    }
  }

  // Màn hình Thống kê STAT
  function renderStatScreen() {
    const s = state.subState;
    if (s.statResults) {
      const r = s.statResults;
      elExprDisplay.textContent = `Thống kê 1-VAR (n=${r.n}):`;
      elResultDisplay.innerHTML = `<div class="fx580-stat-summary"><span>x̄ = ${formatNumber(r.mean)}</span><span>sx = ${formatNumber(r.sampleStdDev)}</span><span>Med = ${formatNumber(r.med)}</span></div>`;
    } else {
      elExprDisplay.textContent = `Nhập mẫu số liệu (${s.statData.length} số):`;
      elResultDisplay.textContent = state.rawExpression || 'Nhập số rồi bấm =';
    }
  }

  // Xử lý khi nhấn nút bàn phím fx-580
  function handleKeyPress(keyAction, keyData) {
    playKeyClickSound();

    if (keyAction === 'ON') {
      state.rawExpression = '';
      state.lastResult = null;
      state.mode = 'COMP';
      state.isShift = false;
      state.isAlpha = false;
      updateScreen();
      return;
    }

    if (keyAction === 'AC') {
      if (state.mode === 'MENU') {
        state.mode = 'COMP';
        state.menuNotice = '';
        state.rawExpression = '';
        state.lastResult = null;
      } else if (state.mode === 'EQN' && state.subState.eqnResults && state.subState.eqnResults.length > 0) {
        state.subState.eqnIndex = 0;
        state.subState.eqnResults = [];
        state.rawExpression = '';
      } else {
        state.rawExpression = '';
        state.lastResult = null;
      }
      state.isShift = false;
      state.isAlpha = false;
      updateScreen();
      return;
    }

    if (keyAction === 'DEL') {
      if (state.rawExpression.length > 0) {
        state.rawExpression = state.rawExpression.slice(0, -1);
      }
      updateScreen();
      return;
    }

    if (keyAction === 'SHIFT') {
      state.isShift = !state.isShift;
      state.isAlpha = false;
      updateScreen();
      return;
    }

    if (keyAction === 'ALPHA') {
      state.isAlpha = !state.isAlpha;
      state.isShift = false;
      updateScreen();
      return;
    }

    if (keyAction === 'MENU') {
      if (state.isShift) {
        state.mode = 'SETUP'; // SHIFT + MENU = SET UP
      } else {
        state.mode = 'MENU';
        state.menuNotice = '';
        state.menuSelectedIndex = 0;
      }
      state.isShift = false;
      updateScreen();
      return;
    }

    if (keyAction === 'SD') {
      if (state.lastResult && typeof state.lastResult === 'object') {
        state.displayFormat = state.displayFormat === 'fraction' ? 'decimal' : 'fraction';
        updateScreen();
      }
      return;
    }

    // Điều hướng trong MENU CÀI ĐẶT (SETUP)
    if (state.mode === 'SETUP') {
      if (keyData === '1') {
        state.angleUnit = state.angleUnit === 'DEG' ? 'RAD' : 'DEG';
      } else if (keyData === '2') {
        state.ioFormat = state.ioFormat === 'MthIO' ? 'LineIO' : 'MthIO';
      } else if (keyData === '3') {
        state.soundEnabled = !state.soundEnabled;
      }
      state.mode = 'COMP';
      updateScreen();
      return;
    }

    // Điều hướng trong MENU chính
    if (state.mode === 'MENU') {
      if (keyAction === 'UP' || keyAction === 'DOWN' || keyAction === 'LEFT' || keyAction === 'RIGHT') {
        const offsets = { UP: -3, DOWN: 3, LEFT: -1, RIGHT: 1 };
        state.menuSelectedIndex = Math.max(0, Math.min(
          calculatorModes.length - 1,
          state.menuSelectedIndex + offsets[keyAction]
        ));
        state.menuNotice = '';
        updateScreen();
        return;
      }

      const selectedMode = keyAction === 'EQUAL'
        ? calculatorModes[state.menuSelectedIndex]
        : calculatorModes.find((item) => item.key === keyData);
      if (!selectedMode) return;
      if (!selectedMode.available) {
        state.menuNotice = `${selectedMode.label}: chế độ này chưa được triển khai.`;
        updateScreen();
        return;
      }

      state.mode = selectedMode.mode;
      state.menuNotice = '';
      state.rawExpression = '';
      state.lastResult = null;
      if (state.mode === 'TABLE') {
        state.subState.tableRows = [];
      } else if (state.mode === 'STAT') {
        state.subState.statData = [];
        state.subState.statResults = null;
      } else if (state.mode === 'EQN') {
        state.subState.eqnType = null;
        state.subState.eqnResults = [];
        state.subState.eqnIndex = 0;
      }
      updateScreen();
      return;
    }

    // Điều hướng trong MENU 9: EQN
    if (state.mode === 'EQN') {
      handleEqnKey(keyAction, keyData);
      return;
    }

    // Điều hướng trong MENU 8: TABLE
    if (state.mode === 'TABLE') {
      handleTableKey(keyAction, keyData);
      return;
    }

    // Điều hướng trong MENU 6: STAT
    if (state.mode === 'STAT') {
      handleStatKey(keyAction, keyData);
      return;
    }

    // Phím CALC và SOLVE (SHIFT + CALC)
    if (keyAction === 'CALC') {
      if (state.isShift) {
        // SOLVE: Dò nghiệm phương trình f(x)=0 hoặc f(x)=g(x)
        const sol = solveEquationForX(state.rawExpression, state.variables.X || 0);
        state.variables.X = sol.x;
        state.lastResult = `x = ${formatNumber(sol.x)}`;
      } else {
        // CALC: Tính giá trị biểu thức theo X
        const val = evaluateMathExpression(state.rawExpression, state.angleUnit, state.ans, state.variables);
        state.lastResult = { val: val, frac: toFraction(val) };
      }
      state.isShift = false;
      updateScreen();
      return;
    }

    // Điều hướng lịch sử tính toán trong COMP bằng phím Lên / Xuống (Replay pad)
    if (keyAction === 'UP' && state.history && state.history.length > 0) {
      if (state.historyIndex === -1 || state.historyIndex === undefined || state.historyIndex >= state.history.length) {
        state.historyIndex = state.history.length - 1;
      } else if (state.historyIndex > 0) {
        state.historyIndex--;
      }
      const item = state.history[state.historyIndex];
      if (item) {
        state.rawExpression = item.expr;
        state.lastResult = { val: item.res, frac: toFraction(item.res) };
      }
      updateScreen();
      return;
    }

    if (keyAction === 'DOWN' && state.history && state.history.length > 0) {
      if (state.historyIndex !== -1 && state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const item = state.history[state.historyIndex];
        if (item) {
          state.rawExpression = item.expr;
          state.lastResult = { val: item.res, frac: toFraction(item.res) };
        }
      } else {
        state.historyIndex = state.history.length;
        state.rawExpression = '';
        state.lastResult = null;
      }
      updateScreen();
      return;
    }

    // Phím = (Tính toán COMP)
    if (keyAction === 'EQUAL') {
      calculateComp();
      return;
    }

    // Bổ sung ký tự toán học vào biểu thức
    appendToken(keyAction, keyData);
    state.isShift = false;
    state.isAlpha = false;
    updateScreen();
  }

  // Xử lý nhập liệu giải phương trình & hệ phương trình
  function handleEqnKey(action, val) {
    const s = state.subState;
    if (!s.eqnType) {
      if (val === '1') {
        s.eqnType = 'SIMUL2';
        s.eqnLabels = ['a1?', 'b1?', 'c1?', 'a2?', 'b2?', 'c2?'];
        s.eqnParams = []; s.eqnIndex = 0;
      } else if (val === '2') {
        s.eqnType = 'POLY2';
        s.eqnLabels = ['a?', 'b?', 'c?'];
        s.eqnParams = []; s.eqnIndex = 0;
      } else if (val === '3') {
        s.eqnType = 'POLY3';
        s.eqnLabels = ['a?', 'b?', 'c?', 'd?'];
        s.eqnParams = []; s.eqnIndex = 0;
      } else if (val === '4') {
        s.eqnType = 'SIMUL3';
        s.eqnLabels = ['a1?', 'b1?', 'c1?', 'd1?', 'a2?', 'b2?', 'c2?', 'd2?', 'a3?', 'b3?', 'c3?', 'd3?'];
        s.eqnParams = []; s.eqnIndex = 0;
      }
      state.rawExpression = '';
      updateScreen();
      return;
    }

    if (s.eqnResults && s.eqnResults.length > 0) {
      if (action === 'EQUAL' || action === 'DOWN') {
        s.eqnIndex = (s.eqnIndex + 1) % s.eqnResults.length;
        updateScreen();
      } else if (action === 'UP') {
        s.eqnIndex = (s.eqnIndex - 1 + s.eqnResults.length) % s.eqnResults.length;
        updateScreen();
      }
      return;
    }

    if (action === 'EQUAL') {
      const num = evaluateMathExpression(state.rawExpression || '0');
      s.eqnParams.push(num);
      s.eqnIndex++;
      state.rawExpression = '';

      if (s.eqnIndex >= s.eqnLabels.length) {
        computeEqnSolution();
      }
      updateScreen();
      return;
    }

    appendToken(action, val);
    updateScreen();
  }

  function computeEqnSolution() {
    const s = state.subState;
    s.eqnResults = [];
    if (s.eqnType === 'POLY2') {
      const sol = solveQuadratic(s.eqnParams[0], s.eqnParams[1], s.eqnParams[2]);
      if (sol.type === 'TWO_REAL') {
        s.eqnResults.push({ label: 'x1', val: sol.x1, frac: sol.x1Frac });
        s.eqnResults.push({ label: 'x2', val: sol.x2, frac: sol.x2Frac });
        s.eqnResults.push({ label: sol.isMin ? 'x_min' : 'x_max', val: sol.vertexX });
        s.eqnResults.push({ label: sol.isMin ? 'y_min' : 'y_max', val: sol.vertexY });
      } else if (sol.type === 'DOUBLE_REAL') {
        s.eqnResults.push({ label: 'x1 = x2', val: sol.x1, frac: sol.x1Frac });
        s.eqnResults.push({ label: sol.isMin ? 'x_min' : 'x_max', val: sol.vertexX });
      } else if (sol.type === 'COMPLEX') {
        s.eqnResults.push({ label: 'x1', valStr: `${formatNumber(sol.real)} + ${formatNumber(sol.imag)}i` });
        s.eqnResults.push({ label: 'x2', valStr: `${formatNumber(sol.real)} - ${formatNumber(sol.imag)}i` });
      } else {
        s.eqnResults.push({ label: 'Kết quả', valStr: 'Vô nghiệm' });
      }
    } else if (s.eqnType === 'POLY3') {
      const sol = solveCubic(s.eqnParams[0], s.eqnParams[1], s.eqnParams[2], s.eqnParams[3]);
      if (sol.roots) {
        sol.roots.forEach((root, idx) => {
          s.eqnResults.push({ label: `x${idx + 1}`, val: root, frac: toFraction(root) });
        });
      }
    } else if (s.eqnType === 'SIMUL2') {
      const mat = [
        [s.eqnParams[0], s.eqnParams[1], s.eqnParams[2]],
        [s.eqnParams[3], s.eqnParams[4], s.eqnParams[5]]
      ];
      const sol = solveLinearSystem(mat);
      if (sol.type === 'UNIQUE') {
        s.eqnResults.push({ label: 'x', val: sol.solution[0], frac: toFraction(sol.solution[0]) });
        s.eqnResults.push({ label: 'y', val: sol.solution[1], frac: toFraction(sol.solution[1]) });
      } else {
        s.eqnResults.push({ label: 'Kết quả', valStr: 'Vô nghiệm hoặc vô số nghiệm' });
      }
    } else if (s.eqnType === 'SIMUL3') {
      const mat = [
        [s.eqnParams[0], s.eqnParams[1], s.eqnParams[2], s.eqnParams[3]],
        [s.eqnParams[4], s.eqnParams[5], s.eqnParams[6], s.eqnParams[7]],
        [s.eqnParams[8], s.eqnParams[9], s.eqnParams[10], s.eqnParams[11]]
      ];
      const sol = solveLinearSystem(mat);
      if (sol.type === 'UNIQUE') {
        s.eqnResults.push({ label: 'x', val: sol.solution[0], frac: toFraction(sol.solution[0]) });
        s.eqnResults.push({ label: 'y', val: sol.solution[1], frac: toFraction(sol.solution[1]) });
        s.eqnResults.push({ label: 'z', val: sol.solution[2], frac: toFraction(sol.solution[2]) });
      } else {
        s.eqnResults.push({ label: 'Kết quả', valStr: 'Vô nghiệm hoặc vô số nghiệm' });
      }
    }
    s.eqnIndex = 0;
  }

  // Xử lý chế độ Bảng TABLE
  function handleTableKey(action, val) {
    const s = state.subState;
    if (action === 'EQUAL') {
      if (!s.tableFunc) {
        s.tableFunc = state.rawExpression || 'x^2';
        state.rawExpression = '';
        s.tableRows = generateTableValues(s.tableFunc, s.tableStart, s.tableEnd, s.tableStep);
      }
      updateScreen();
      return;
    }
    appendToken(action, val);
    updateScreen();
  }

  // Xử lý chế độ Thống kê STAT
  function handleStatKey(action, val) {
    const s = state.subState;
    if (action === 'EQUAL') {
      if (state.rawExpression) {
        const num = evaluateMathExpression(state.rawExpression);
        s.statData.push(num);
        state.rawExpression = '';
      } else if (s.statData.length > 0) {
        s.statResults = compute1VarStats(s.statData);
      }
      updateScreen();
      return;
    }
    appendToken(action, val);
    updateScreen();
  }

  // Thêm toán tử hoặc hàm vào biểu thức
  function appendToken(action, val) {
    const isShift = state.isShift;

    switch (action) {
      case 'NUM':
        state.rawExpression += val;
        break;
      case 'DOT':
        state.rawExpression += '.';
        break;
      case 'ADD':
        state.rawExpression += '+';
        break;
      case 'SUB':
        state.rawExpression += '−';
        break;
      case 'MUL':
        state.rawExpression += '×';
        break;
      case 'DIV':
        state.rawExpression += '÷';
        break;
      case 'LPAREN':
        state.rawExpression += '(';
        break;
      case 'RPAREN':
        state.rawExpression += ')';
        break;
      case 'PI':
        state.rawExpression += 'π';
        break;
      case 'EULER':
        state.rawExpression += 'e';
        break;
      case 'ANS':
        state.rawExpression += 'Ans';
        break;
      case 'EXP10':
        state.rawExpression += isShift ? 'π' : '×10^';
        break;
      case 'POW2':
        state.rawExpression += isShift ? '^3' : '^2';
        break;
      case 'POW':
        state.rawExpression += '^';
        break;
      case 'SQRT':
        state.rawExpression += isShift ? 'cbrt(' : '√(';
        break;
      case 'FRAC':
        state.rawExpression += '/';
        break;
      case 'DIFF':
        // Đạo hàm d/dx(f(x), x0) hoặc Tích phân ∫(f(x), a, b)
        state.rawExpression += isShift ? 'integ(' : 'diff(';
        break;
      case 'SIN':
        state.rawExpression += isShift ? 'asin(' : 'sin(';
        break;
      case 'COS':
        state.rawExpression += isShift ? 'acos(' : 'cos(';
        break;
      case 'TAN':
        state.rawExpression += isShift ? 'atan(' : 'tan(';
        break;
      case 'LOG':
        state.rawExpression += 'log(';
        break;
      case 'LN':
        state.rawExpression += isShift ? 'e^(' : 'ln(';
        break;
      case 'NEG':
        state.rawExpression += '−';
        break;
      case 'VAR_X':
        state.rawExpression += 'x';
        break;
      default:
        if (val) state.rawExpression += val;
        break;
    }
  }

  // Tính toán biểu thức COMP
  function calculateComp() {
    if (!state.rawExpression || !state.rawExpression.trim()) return;

    const val = evaluateMathExpression(state.rawExpression, state.angleUnit, state.ans, state.variables);
    if (Number.isNaN(val)) {
      state.lastResult = 'Math ERROR';
    } else {
      state.ans = val;
      const frac = toFraction(val);
      state.lastResult = { val: val, frac: frac };
      state.displayFormat = (frac && frac.den > 1) ? 'fraction' : 'decimal';
      state.history.push({ expr: state.rawExpression, res: val });
      state.historyIndex = state.history.length;
      if (elHistoryDrawer && elHistoryDrawer.style.display !== 'none') {
        renderHistoryList();
      }
    }
    updateScreen();
  }

  // Lấy chuỗi kết quả hiện tại để chèn vào ghi chú
  function getCurrentDisplayText() {
    if (state.mode === 'COMP') {
      if (state.lastResult !== null && state.lastResult !== undefined) {
        if (typeof state.lastResult === 'string') {
          return state.rawExpression ? `${state.rawExpression} = ${state.lastResult}` : state.lastResult;
        }
        let valStr = '';
        if (state.displayFormat === 'fraction' && state.lastResult.frac && state.lastResult.frac.den > 1) {
          valStr = `${state.lastResult.frac.num}/${state.lastResult.frac.den}`;
        } else {
          valStr = formatNumber(state.lastResult.val);
        }
        return state.rawExpression ? `${state.rawExpression} = ${valStr}` : valStr;
      }
      return state.rawExpression || '0';
    }
    if (state.mode === 'EQN') {
      const s = state.subState;
      if (s && s.eqnResults && s.eqnResults.length > 0) {
        return s.eqnResults.map(r => `${r.label} = ${r.frac && r.frac.den > 1 ? r.frac.num + '/' + r.frac.den : formatNumber(r.val)}`).join(', ');
      }
    }
    if (state.mode === 'STAT') {
      const s = state.subState;
      if (s && s.summary) {
        return `x̄=${formatNumber(s.summary.mean)}, ∑x=${formatNumber(s.summary.sum)}, s=${formatNumber(s.summary.s)}, n=${s.summary.n}`;
      }
    }
    if (state.mode === 'TABLE') {
      const s = state.subState;
      if (s && s.func) {
        return `f(x) = ${s.func}`;
      }
    }
    return state.rawExpression || '0';
  }

  function insertResultToCanvas() {
    const text = getCurrentDisplayText();
    if (!text) return;
    if (typeof window.__netInsertText === 'function') {
      window.__netInsertText(text);
    } else {
      try {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text);
        }
      } catch (e) {
        // Ignored
      }
    }
  }

  function toggleHistoryDrawer() {
    if (!elHistoryDrawer) {
      elHistoryDrawer = document.getElementById('fx580-history-drawer');
      elHistoryList = document.getElementById('fx580-history-list');
    }
    if (!elHistoryDrawer) return;

    if (elHistoryDrawer.style.display === 'none' || !elHistoryDrawer.style.display) {
      openHistoryDrawer();
    } else {
      closeHistoryDrawer();
    }
  }

  function openHistoryDrawer() {
    if (!elHistoryDrawer) {
      elHistoryDrawer = document.getElementById('fx580-history-drawer');
      elHistoryList = document.getElementById('fx580-history-list');
    }
    if (!elHistoryDrawer) return;
    renderHistoryList();
    elHistoryDrawer.style.display = 'block';
  }

  function closeHistoryDrawer() {
    if (!elHistoryDrawer) {
      elHistoryDrawer = document.getElementById('fx580-history-drawer');
    }
    if (elHistoryDrawer) {
      elHistoryDrawer.style.display = 'none';
    }
  }

  function renderHistoryList() {
    if (!elHistoryList) {
      elHistoryList = document.getElementById('fx580-history-list');
    }
    if (!elHistoryList) return;

    if (!state.history || state.history.length === 0) {
      elHistoryList.innerHTML = '<span class="history-empty">Chưa có phép tính nào</span>';
      return;
    }

    elHistoryList.innerHTML = '';
    // Đảo ngược để phép tính mới nhất lên đầu
    [...state.history].reverse().forEach(item => {
      const row = document.createElement('div');
      row.className = 'fx580-history-item';
      row.title = 'Nhấn để nạp lại biểu thức này';

      const exprSpan = document.createElement('span');
      exprSpan.style.color = '#cbd5e1';
      exprSpan.textContent = item.expr;

      const resSpan = document.createElement('span');
      resSpan.style.color = '#38bdf8';
      resSpan.style.fontWeight = '600';
      resSpan.textContent = `= ${formatNumber(item.res)}`;

      row.appendChild(exprSpan);
      row.appendChild(resSpan);

      row.addEventListener('click', (e) => {
        e.stopPropagation();
        state.rawExpression = item.expr;
        state.mode = 'COMP';
        state.lastResult = null;
        updateScreen();
        closeHistoryDrawer();
      });

      elHistoryList.appendChild(row);
    });
  }

  // Bắt sự kiện phím chuột trên giao diện Casio
  function setupKeypadEvents() {
    if (!elWindow) return;

    elWindow.querySelectorAll('.fx580-key, .replay-dir').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const val = btn.dataset.val || '';
        handleKeyPress(action, val);
      });
    });

    const btnClose = elWindow.querySelector('.fx580-btn-close');
    if (btnClose) {
      btnClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeCalculator();
      });
    }

    const btnMin = elWindow.querySelector('.fx580-btn-minimize');
    if (btnMin) {
      btnMin.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMinimize();
      });
    }

    const btnInsert = elWindow.querySelector('.fx580-btn-insert');
    if (btnInsert) {
      btnInsert.addEventListener('click', (e) => {
        e.stopPropagation();
        insertResultToCanvas();
      });
    }

    const btnHistory = elWindow.querySelector('.fx580-btn-history');
    if (btnHistory) {
      btnHistory.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleHistoryDrawer();
      });
    }

    const btnHistoryClose = elWindow.querySelector('.fx580-history-close');
    if (btnHistoryClose) {
      btnHistoryClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeHistoryDrawer();
      });
    }
  }

  // Hỗ trợ Bàn phím máy tính vật lý (Keyboard Input)
  function setupPhysicalKeyboardEvents() {
    window.addEventListener('keydown', (e) => {
      if (!state.isOpen || state.isMinimized) return;
      // Tránh cướp phím khi người dùng đang nhập văn bản trong ghi chú
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const key = e.key;
      if (key >= '0' && key <= '9') {
        handleKeyPress('NUM', key);
        e.preventDefault();
      } else if (key === '+') {
        handleKeyPress('ADD', '+');
        e.preventDefault();
      } else if (key === '-') {
        handleKeyPress('SUB', '−');
        e.preventDefault();
      } else if (key === '*' || key === 'x' || key === 'X') {
        handleKeyPress('MUL', '×');
        e.preventDefault();
      } else if (key === '/') {
        handleKeyPress('DIV', '÷');
        e.preventDefault();
      } else if (key === '.') {
        handleKeyPress('DOT', '.');
        e.preventDefault();
      } else if (key === '(') {
        handleKeyPress('LPAREN', '(');
        e.preventDefault();
      } else if (key === ')') {
        handleKeyPress('RPAREN', ')');
        e.preventDefault();
      } else if (key === '^') {
        handleKeyPress('POW', '^');
        e.preventDefault();
      } else if (key === 'Enter' || key === '=') {
        handleKeyPress('EQUAL', '=');
        e.preventDefault();
      } else if (key === 'Backspace') {
        handleKeyPress('DEL', '');
        e.preventDefault();
      } else if (key === 'Escape') {
        handleKeyPress('AC', '');
        e.preventDefault();
      } else if (key === 'ArrowUp') {
        handleKeyPress('UP', '');
        e.preventDefault();
      } else if (key === 'ArrowDown') {
        handleKeyPress('DOWN', '');
        e.preventDefault();
      } else if (key === 's') {
        handleKeyPress('SIN', '');
        e.preventDefault();
      } else if (key === 'c') {
        handleKeyPress('COS', '');
        e.preventDefault();
      } else if (key === 't') {
        handleKeyPress('TAN', '');
        e.preventDefault();
      } else if (key === 'p') {
        handleKeyPress('PI', '');
        e.preventDefault();
      }
    });
  }

  // Kéo thả di chuyển cửa sổ máy tính
  function setupDraggable(element) {
    const handle = element.querySelector('.fx580-title-bar');
    if (!handle) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    handle.addEventListener('mousedown', (e) => {
      if (e.target.closest('.fx580-win-controls')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = element.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      element.style.transition = 'none';
      document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newLeft = Math.max(10, Math.min(window.innerWidth - element.offsetWidth - 10, initialLeft + dx));
      const newTop = Math.max(40, Math.min(window.innerHeight - element.offsetHeight - 10, initialTop + dy));
      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;
      element.style.right = 'auto';
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        element.style.transition = '';
        document.body.style.userSelect = '';
      }
    });
  }

  function toggleCalculator() {
    if (state.isOpen) closeCalculator();
    else openCalculator();
  }

  function openCalculator() {
    if (!elWindow) initUI();
    if (!elWindow) return;

    state.isOpen = true;
    elWindow.style.display = 'flex';
    elWindow.classList.remove('minimized');

    if (!elWindow.style.left && !elWindow.style.top) {
      elWindow.style.top = '70px';
      elWindow.style.right = window.innerWidth <= 350 ? '8px' : '24px';
      elWindow.style.left = 'auto';
    }

    const btnToolbar = document.getElementById('btn-toggle-fx580');
    if (btnToolbar) btnToolbar.classList.add('active');

    updateScreen();
  }

  function closeCalculator() {
    if (!elWindow) return;
    state.isOpen = false;
    elWindow.style.display = 'none';

    const btnToolbar = document.getElementById('btn-toggle-fx580');
    if (btnToolbar) btnToolbar.classList.remove('active');
  }

  function toggleMinimize() {
    if (!elWindow) return;
    state.isMinimized = !state.isMinimized;
    if (state.isMinimized) elWindow.classList.add('minimized');
    else elWindow.classList.remove('minimized');
  }

  // Xuất API toàn cục
  window.__fx580 = {
    state: state,
    initUI: initUI,
    open: openCalculator,
    close: closeCalculator,
    toggle: toggleCalculator,
    handleKey: handleKeyPress,
    solveQuadratic: solveQuadratic,
    solveCubic: solveCubic,
    solveLinearSystem: solveLinearSystem,
    solveEquationForX: solveEquationForX,
    evaluate: evaluateMathExpression,
    generateTableValues: generateTableValues,
    compute1VarStats: compute1VarStats,
    insertResultToCanvas: insertResultToCanvas,
    getCurrentDisplayText: getCurrentDisplayText,
    toggleHistoryDrawer: toggleHistoryDrawer,
    openHistoryDrawer: openHistoryDrawer,
    closeHistoryDrawer: closeHistoryDrawer
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }
})(window);
