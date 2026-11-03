/**
 * NÉT — Graph Widget & 3D Solid of Revolution Module (graph_widget.js)
 * Chức năng:
 * 1. Khối Đồ thị tương tác dạng Widget trên Canvas (di chuyển, co giãn, đổi tỉ lệ).
 * 2. Hỗ trợ đa hàm số y = f(x), chọn màu, miền vẽ [xmin, xmax].
 * 3. Điểm tọa độ đặc biệt (giao điểm Ox/Oy, cực trị, giao điểm giữa các hàm) kèm đường dóng nét đứt.
 * 4. Mô phỏng 3D Khối tròn xoay (Solid of Revolution) quay quanh trục Ox hoặc Oy tính thể tích.
 */

(function (global) {
  'use strict';

  // Parser biểu thức toán học an toàn
  function compileMathExpr(exprStr) {
    if (!exprStr || !exprStr.trim()) return null;
    let clean = exprStr.trim()
      .replace(/–/g, '-')
      .replace(/−/g, '-')
      .replace(/\^/g, '**')
      .replace(/\bpi\b/gi, 'Math.PI')
      .replace(/\be\b/g, 'Math.E')
      .replace(/\bsin\b/gi, 'Math.sin')
      .replace(/\bcos\b/gi, 'Math.cos')
      .replace(/\btan\b/gi, 'Math.tan')
      .replace(/\bcot\b/gi, '(1/Math.tan)')
      .replace(/\bsqrt\b/gi, 'Math.sqrt')
      .replace(/\babs\b/gi, 'Math.abs')
      .replace(/\bln\b/gi, 'Math.log')
      .replace(/\blog\b/gi, 'Math.log10')
      .replace(/\bexp\b/gi, 'Math.exp');

    // Thêm phép nhân ngầm: số đứng trước x hoặc ngoặc (ví dụ 2x -> 2*x, 3(x) -> 3*(x))
    clean = clean.replace(/(\d)([a-zA-Z\(])/g, '$1*$2');
    clean = clean.replace(/(\))([a-zA-Z\d\(])/g, '$1*$2');

    try {
      const fn = new Function('x', `
        try {
          with (Math) {
            const res = ${clean};
            return (typeof res === 'number' && !isNaN(res) && isFinite(res)) ? res : NaN;
          }
        } catch (e) {
          return NaN;
        }
      `);
      // Thử đánh giá
      fn(1);
      return fn;
    } catch (e) {
      console.warn('Lỗi biên dịch biểu thức hàm số:', exprStr, e);
      return null;
    }
  }

  // Khởi tạo một đối tượng Graph Widget mặc định
  function createDefaultGraphWidget(centerX, centerY) {
    const width = 560;
    const height = 400;
    const x = Math.round(centerX - width / 2);
    const y = Math.round(centerY - height / 2);

    return {
      id: 'graph_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      type: 'graph-widget',
      x: x,
      y: y,
      width: width,
      height: height,
      origin: { x: x + width / 2, y: y + height / 2 },
      scale: 36, // 36px = 1 đơn vị
      showGrid: true,
      showAxes: true,
      functions: [
        {
          id: 'fn_1',
          expr: 'x^2 - 2*x - 1',
          color: '#28634e', // Ngọc bích đặc trưng của Nét
          width: 2.5,
          dash: 'solid',
          range: [-3.5, 4.5],
          visible: true
        }
      ],
      specialPoints: [
        { x: 1, y: -2, label: 'I(1; -2)', showProjection: true, color: '#cf7969' },
        { x: 0, y: -1, label: 'C(0; -1)', showProjection: true, color: '#537fc1' }
      ],
      revolution3D: {
        enabled: false,
        axis: 'Ox', // 'Ox' hoặc 'Oy'
        funcIndex: 0,
        rangeX: [0, 2.5], // Trục Ox hiển thị x = 0 đến x = 2.5
        rangeY: [-2, 3],  // Trục Oy hiển thị y = -2 đến y = 3
        range: [0, 2.5],  // Đoạn [a, b]
        angleDeg: 0, // Bắt đầu từ 0 độ để học sinh thấy hình phẳng ban đầu
        tiltDeg: 28, // Góc nghiêng nhìn 3D (độ)
        rotDeg: 25, // Góc xoay quanh trục
        speed: 1.0, // Tốc độ xoay: 0.5 (chậm), 1.0 (chuẩn), 2.0 (nhanh)
        isPlaying: false, // Trạng thái đang xoay chuyển động
        loop: true, // Tự động lặp lại chu kỳ
        holdFrames: 0
      }
    };
  }

  // Chuyển đổi giữa hệ tọa độ toán học (Math Coordinates) và Canvas Pixel Coordinates
  function mathToCanvas(gx, gy, widget) {
    return {
      x: widget.origin.x + gx * widget.scale,
      y: widget.origin.y - gy * widget.scale
    };
  }

  function canvasToMath(px, py, widget) {
    return {
      x: (px - widget.origin.x) / widget.scale,
      y: (widget.origin.y - py) / widget.scale
    };
  }

  // Tự động tìm các điểm đặc biệt cho 1 hàm (Giao Ox, Oy, Cực trị)
  function autoFindSpecialPoints(funcStr, range) {
    const fn = compileMathExpr(funcStr);
    if (!fn) return [];
    const minX = (range && range[0] !== undefined) ? range[0] : -8;
    const maxX = (range && range[1] !== undefined) ? range[1] : 8;

    const points = [];
    const eps = 0.001;

    // 1. Giao điểm với Oy (x = 0)
    if (minX <= 0 && maxX >= 0) {
      const y0 = fn(0);
      if (!isNaN(y0)) {
        points.push({
          x: 0,
          y: Math.round(y0 * 100) / 100,
          label: `Oy(0; ${Math.round(y0 * 100) / 100})`,
          showProjection: true,
          color: '#537fc1'
        });
      }
    }

    // 2. Tìm nghiệm f(x) = 0 và Cực trị f'(x) = 0 bằng quét chia nhị phân
    const step = 0.05;
    let prevX = minX;
    let prevY = fn(prevX);
    let prevD = isNaN(prevY) ? NaN : (fn(prevX + eps) - fn(prevX - eps)) / (2 * eps);

    for (let x = minX + step; x <= maxX; x += step) {
      const curY = fn(x);
      if (isNaN(curY)) {
        prevX = x;
        prevY = NaN;
        prevD = NaN;
        continue;
      }

      // Nghiệm f(x) = 0 (đổi dấu y)
      if (!isNaN(prevY) && prevY * curY <= 0 && Math.abs(curY - prevY) < 10) {
        // Dò nhị phân nghiệm
        let left = prevX, right = x;
        for (let iter = 0; iter < 12; iter++) {
          const mid = (left + right) / 2;
          const midY = fn(mid);
          if (fn(left) * midY <= 0) right = mid;
          else left = mid;
        }
        const rootX = Math.round(((left + right) / 2) * 100) / 100;
        if (!points.some(p => Math.abs(p.x - rootX) < 0.08 && Math.abs(p.y) < 0.08)) {
          points.push({
            x: rootX,
            y: 0,
            label: `(${rootX}; 0)`,
            showProjection: true,
            color: '#28634e'
          });
        }
      }

      // Cực trị f'(x) = 0 (đổi dấu đạo hàm)
      const curD = (fn(x + eps) - fn(x - eps)) / (2 * eps);
      if (!isNaN(prevD) && !isNaN(curD) && prevD * curD <= 0 && Math.abs(curD - prevD) < 20) {
        let left = prevX, right = x;
        for (let iter = 0; iter < 12; iter++) {
          const mid = (left + right) / 2;
          const dMid = (fn(mid + eps) - fn(mid - eps)) / (2 * eps);
          if (prevD * dMid <= 0) right = mid;
          else left = mid;
        }
        const extX = Math.round(((left + right) / 2) * 100) / 100;
        const extY = Math.round(fn(extX) * 100) / 100;
        if (!points.some(p => Math.abs(p.x - extX) < 0.08 && Math.abs(p.y - extY) < 0.08)) {
          const typeLabel = prevD > 0 ? 'CĐ' : 'CT';
          points.push({
            x: extX,
            y: extY,
            label: `${typeLabel}(${extX}; ${extY})`,
            showProjection: true,
            color: '#cf7969'
          });
        }
      }

      prevX = x;
      prevY = curY;
      prevD = curD;
    }

    return points;
  }

  // Tính thể tích khối tròn xoay bằng công thức Simpson (hỗ trợ cả 1 hàm f(x) hoặc miền giới hạn bởi 2 hàm f(x), g(x))
  function calculateRevolutionVolume(funcStr, axis, a, b, func2Str = null) {
    const fn1 = compileMathExpr(funcStr);
    if (!fn1) return null;
    const fn2 = (func2Str && String(func2Str).trim()) ? compileMathExpr(func2Str) : null;
    if (a === b) return 0;
    const xMin = Math.min(a, b);
    const xMax = Math.max(a, b);
    const n = 500; // Số phân đoạn Simpson chẵn
    const h = (xMax - xMin) / n;
    let sum = 0;

    if (axis === 'Ox' || axis === 'ox') {
      // Phương pháp Đĩa / Vành khăn (Disk / Washer Method):
      // V = pi * integral_a^b |[f(x)]^2 - [g(x)]^2| dx
      for (let i = 0; i <= n; i++) {
        const x = xMin + i * h;
        const y1 = fn1(x);
        const y2 = fn2 ? fn2(x) : 0;
        if (isNaN(y1) || isNaN(y2) || !isFinite(y1) || !isFinite(y2)) return null;
        const val = Math.abs(y1 * y1 - y2 * y2);
        if (i === 0 || i === n) sum += val;
        else if (i % 2 === 1) sum += 4 * val;
        else sum += 2 * val;
      }
      return Math.PI * (h / 3) * sum;
    } else {
      // Xoay quanh Oy — Phương pháp Vỏ trụ (Cylindrical Shells Method):
      // V = 2 * pi * integral_a^b |x| * |f(x) - g(x)| dx
      for (let i = 0; i <= n; i++) {
        const x = xMin + i * h;
        const y1 = fn1(x);
        const y2 = fn2 ? fn2(x) : 0;
        if (isNaN(y1) || isNaN(y2) || !isFinite(y1) || !isFinite(y2)) return null;
        const val = Math.abs(x * (y1 - y2));
        if (i === 0 || i === n) sum += val;
        else if (i % 2 === 1) sum += 4 * val;
        else sum += 2 * val;
      }
      return 2 * Math.PI * (h / 3) * sum;
    }
  }

  // =============================================================
  // THUẬT TOÁN TÍNH DIỆN TÍCH (S) VÀ THỂ TÍCH TRÒN XOAY (V)
  // =============================================================

  // Tìm nghiệm của hàm số f(x) = 0 trên đoạn [minX, maxX]
  function findFunctionRoots(funcStr, minX = -12, maxX = 12) {
    const fn = compileMathExpr(funcStr);
    if (!fn) return [];
    const roots = [];
    const step = 0.04;
    let prevX = minX;
    let prevY = fn(prevX);

    for (let x = minX + step; x <= maxX + step * 0.5; x += step) {
      const curY = fn(x);
      if (isNaN(curY) || !isFinite(curY)) {
        prevX = x;
        prevY = curY;
        continue;
      }

      if (!isNaN(prevY) && isFinite(prevY) && Math.abs(curY - prevY) < 40) {
        if (prevY === 0) {
          roots.push(Number(prevX.toFixed(4)));
        } else if (curY === 0) {
          roots.push(Number(x.toFixed(4)));
        } else if (prevY * curY < 0) {
          let left = prevX;
          let right = x;
          for (let iter = 0; iter < 24; iter++) {
            const mid = (left + right) / 2;
            const midY = fn(mid);
            if (isNaN(midY) || Math.abs(midY) < 1e-7) {
              left = mid;
              break;
            }
            if (prevY * midY < 0) {
              right = mid;
            } else {
              left = mid;
            }
          }
          const rootVal = Number(left.toFixed(4));
          if (!roots.some(r => Math.abs(r - rootVal) < 0.015)) {
            roots.push(rootVal);
          }
        }
      }

      prevX = x;
      prevY = curY;
    }

    return roots.sort((a, b) => a - b);
  }

  // Tìm các giao điểm giữa 2 hàm số f(x) và g(x)
  function findTwoFunctionsIntersections(expr1, expr2, minX = -12, maxX = 12) {
    const fn1 = compileMathExpr(expr1);
    const fn2 = compileMathExpr(expr2);
    if (!fn1 || !fn2) return [];

    const diffFn = (x) => fn1(x) - fn2(x);
    const roots = [];
    const step = 0.04;
    let prevX = minX;
    let prevY = diffFn(prevX);

    for (let x = minX + step; x <= maxX + step * 0.5; x += step) {
      const curY = diffFn(x);
      if (isNaN(curY) || !isFinite(curY)) {
        prevX = x;
        prevY = curY;
        continue;
      }

      if (!isNaN(prevY) && isFinite(prevY) && Math.abs(curY - prevY) < 50) {
        if (prevY === 0) {
          roots.push(Number(prevX.toFixed(4)));
        } else if (curY === 0) {
          roots.push(Number(x.toFixed(4)));
        } else if (prevY * curY < 0) {
          let left = prevX;
          let right = x;
          for (let iter = 0; iter < 24; iter++) {
            const mid = (left + right) / 2;
            const midY = diffFn(mid);
            if (isNaN(midY) || Math.abs(midY) < 1e-7) {
              left = mid;
              break;
            }
            if (prevY * midY < 0) {
              right = mid;
            } else {
              left = mid;
            }
          }
          const rootVal = Number(left.toFixed(4));
          if (!roots.some(r => Math.abs(r - rootVal) < 0.015)) {
            roots.push(rootVal);
          }
        }
      }

      prevX = x;
      prevY = curY;
    }

    return roots.sort((a, b) => a - b).map(rx => ({
      x: rx,
      y: Number(fn1(rx).toFixed(4))
    }));
  }

  // Tích phân Simpson số học
  function integrateSimpson(fn, a, b, n = 500) {
    if (a === b) return 0;
    if (a > b) {
      const tmp = a; a = b; b = tmp;
    }
    const h = (b - a) / n;
    let sum = 0;
    for (let i = 0; i <= n; i++) {
      const x = a + i * h;
      const y = fn(x);
      if (isNaN(y) || !isFinite(y)) return null;
      if (i === 0 || i === n) sum += y;
      else if (i % 2 === 1) sum += 4 * y;
      else sum += 2 * y;
    }
    return (h / 3) * sum;
  }

  // Tính toán chi tiết Diện tích hình phẳng (S) và Thể tích (V)
  function calculateAreaAndVolumeDetailed(config) {
    const { funcCount, expr1, expr2, expr3, boundMode, customA, customB, axis } = config;
    const ax = axis || 'Ox';

    const fn1 = compileMathExpr(expr1);
    const fn2 = expr2 ? compileMathExpr(expr2) : null;
    const fn3 = expr3 ? compileMathExpr(expr3) : null;

    if (!fn1) {
      return { success: false, error: 'Hàm số f(x) không hợp lệ.' };
    }

    if (funcCount === 1) {
      let a = parseFloat(customA);
      let b = parseFloat(customB);
      if (isNaN(a)) a = 0;
      if (isNaN(b)) b = 2;
      if (a > b) { const t = a; a = b; b = t; }

      const areaFn = (x) => Math.abs(fn1(x));
      const areaVal = integrateSimpson(areaFn, a, b);

      let volVal = null;
      let volFormula = '';
      if (ax === 'Ox') {
        const volFn = (x) => Math.pow(fn1(x), 2);
        const intVal = integrateSimpson(volFn, a, b);
        volVal = intVal !== null ? Math.PI * intVal : null;
        volFormula = `V = &pi; &int;<sub>${a}</sub><sup>${b}</sup> [${expr1}]<sup>2</sup> dx`;
      } else {
        const volFn = (x) => Math.abs(x * fn1(x));
        const intVal = integrateSimpson(volFn, a, b);
        volVal = intVal !== null ? 2 * Math.PI * intVal : null;
        volFormula = `V = 2&pi; &int;<sub>${a}</sub><sup>${b}</sup> x &middot; |${expr1}| dx`;
      }

      return {
        success: true,
        funcCount: 1,
        a: a,
        b: b,
        area: areaVal,
        volume: volVal,
        areaFormula: `S = &int;<sub>${a}</sub><sup>${b}</sup> |${expr1}| dx`,
        volumeFormula: volFormula,
        intersections: [],
        regions: [{ a: a, b: b, fTop: (x) => Math.max(0, fn1(x)), fBot: (x) => Math.min(0, fn1(x)) }]
      };
    } else if (funcCount === 2) {
      if (!fn2) return { success: false, error: 'Hàm số thứ hai g(x) không hợp lệ.' };

      let a = parseFloat(customA);
      let b = parseFloat(customB);
      const inters = findTwoFunctionsIntersections(expr1, expr2);

      if (boundMode === 'auto') {
        if (inters.length < 2) {
          return {
            success: false,
            intersections: inters,
            error: `Tìm thấy ${inters.length} giao điểm. Cần ít nhất 2 giao điểm để tạo miền khép kín. Bạn có thể chọn 'Tự nhập 2 cận x = a và x = b'.`
          };
        }
        a = inters[0].x;
        b = inters[1].x;
      } else {
        if (isNaN(a)) a = 0;
        if (isNaN(b)) b = 2;
        if (a > b) { const t = a; a = b; b = t; }
      }

      const areaFn = (x) => Math.abs(fn1(x) - fn2(x));
      const areaVal = integrateSimpson(areaFn, a, b);

      let volVal = null;
      let volFormula = '';
      if (ax === 'Ox') {
        const volFn = (x) => Math.abs(Math.pow(fn1(x), 2) - Math.pow(fn2(x), 2));
        const intVal = integrateSimpson(volFn, a, b);
        volVal = intVal !== null ? Math.PI * intVal : null;
        volFormula = `V = &pi; &int;<sub>${a}</sub><sup>${b}</sup> |[${expr1}]<sup>2</sup> - [${expr2}]<sup>2</sup>| dx`;
      } else {
        const volFn = (x) => Math.abs(x * (fn1(x) - fn2(x)));
        const intVal = integrateSimpson(volFn, a, b);
        volVal = intVal !== null ? 2 * Math.PI * intVal : null;
        volFormula = `V = 2&pi; &int;<sub>${a}</sub><sup>${b}</sup> x &middot; |(${expr1}) - (${expr2})| dx`;
      }

      return {
        success: true,
        funcCount: 2,
        a: a,
        b: b,
        area: areaVal,
        volume: volVal,
        areaFormula: `S = &int;<sub>${a}</sub><sup>${b}</sup> |(${expr1}) - (${expr2})| dx`,
        volumeFormula: volFormula,
        intersections: inters,
        regions: [{ a: a, b: b, fTop: (x) => Math.max(fn1(x), fn2(x)), fBot: (x) => Math.min(fn1(x), fn2(x)) }]
      };
    } else if (funcCount === 3) {
      if (!fn2 || !fn3) return { success: false, error: 'Cần đủ 3 hàm số hợp lệ để tính toán.' };

      let a = parseFloat(customA);
      let b = parseFloat(customB);

      const pts12 = findTwoFunctionsIntersections(expr1, expr2);
      const pts23 = findTwoFunctionsIntersections(expr2, expr3);
      const pts31 = findTwoFunctionsIntersections(expr3, expr1);
      const allPts = [...pts12, ...pts23, ...pts31].sort((p, q) => p.x - q.x);

      let regions = [];
      let totalArea = 0;
      let totalVol = 0;

      if (boundMode === 'auto') {
        if (pts12.length === 0 || pts23.length === 0 || pts31.length === 0) {
          return {
            success: false,
            intersections: allPts,
            error: 'Không tìm đủ 3 giao điểm tạo thành miền kín tam giác cong. Bạn có thể chọn chế độ \'Tự nhập 2 cận x = a và x = b\'.'
          };
        }
        const p12 = pts12[0];
        const p23 = pts23[0];
        const p31 = pts31[0];

        // Gán thông tin cặp hàm cho từng điểm để xác định đường đáy xuyên suốt
        const triPts = [
          { pt: p12, pair: [1, 2], other: 3 },
          { pt: p23, pair: [2, 3], other: 1 },
          { pt: p31, pair: [3, 1], other: 2 }
        ].sort((m, n) => m.pt.x - n.pt.x);

        a = triPts[0].pt.x;
        const midX = triPts[1].pt.x;
        b = triPts[2].pt.x;

        // Điểm ở giữa là triPts[1], hàm còn lại chạy xuyên suốt từ xA đến xC
        const baseFuncIndex = triPts[1].other;
        const fnBase = baseFuncIndex === 1 ? fn1 : (baseFuncIndex === 2 ? fn2 : fn3);

        const seg1OtherIdx = triPts[0].pair.find(idx => idx !== baseFuncIndex) || triPts[0].pair[0];
        const fnSeg1 = seg1OtherIdx === 1 ? fn1 : (seg1OtherIdx === 2 ? fn2 : fn3);

        const seg2OtherIdx = triPts[2].pair.find(idx => idx !== baseFuncIndex) || triPts[2].pair[0];
        const fnSeg2 = seg2OtherIdx === 1 ? fn1 : (seg2OtherIdx === 2 ? fn2 : fn3);

        const segments = [
          { x0: a, x1: midX, fA: fnBase, fB: fnSeg1 },
          { x0: midX, x1: b, fA: fnBase, fB: fnSeg2 }
        ];

        for (const seg of segments) {
          const { x0, x1, fA, fB } = seg;
          if (Math.abs(x1 - x0) < 0.001) continue;

          const segArea = integrateSimpson((x) => Math.abs(fA(x) - fB(x)), x0, x1);
          if (segArea !== null) totalArea += segArea;

          if (ax === 'Ox') {
            const segVol = integrateSimpson((x) => Math.abs(Math.pow(fA(x), 2) - Math.pow(fB(x), 2)), x0, x1);
            if (segVol !== null) totalVol += Math.PI * segVol;
          } else {
            const segVol = integrateSimpson((x) => Math.abs(x * (fA(x) - fB(x))), x0, x1);
            if (segVol !== null) totalVol += 2 * Math.PI * segVol;
          }

          regions.push({ a: x0, b: x1, fTop: (x) => Math.max(fA(x), fB(x)), fBot: (x) => Math.min(fA(x), fB(x)) });
        }
      } else {
        if (isNaN(a)) a = 0;
        if (isNaN(b)) b = 3;
        if (a > b) { const t = a; a = b; b = t; }

        const segArea = integrateSimpson((x) => {
          const y1 = fn1(x), y2 = fn2(x), y3 = fn3(x);
          return Math.max(y1, y2, y3) - Math.min(y1, y2, y3);
        }, a, b);
        totalArea = segArea || 0;

        if (ax === 'Ox') {
          const segVol = integrateSimpson((x) => {
            const y1 = fn1(x), y2 = fn2(x), y3 = fn3(x);
            const yMax = Math.max(y1, y2, y3);
            const yMin = Math.min(y1, y2, y3);
            return Math.abs(yMax * yMax - yMin * yMin);
          }, a, b);
          totalVol = segVol !== null ? Math.PI * segVol : 0;
        } else {
          const segVol = integrateSimpson((x) => {
            const y1 = fn1(x), y2 = fn2(x), y3 = fn3(x);
            return Math.abs(x * (Math.max(y1, y2, y3) - Math.min(y1, y2, y3)));
          }, a, b);
          totalVol = segVol !== null ? 2 * Math.PI * segVol : 0;
        }

        regions.push({
          a: a,
          b: b,
          fTop: (x) => Math.max(fn1(x), fn2(x), fn3(x)),
          fBot: (x) => Math.min(fn1(x), fn2(x), fn3(x))
        });
      }

      return {
        success: true,
        funcCount: 3,
        a: a,
        b: b,
        area: totalArea,
        volume: totalVol,
        areaFormula: `S = &int;<sub>${a}</sub><sup>${b}</sup> (y<sub>trên</sub> - y<sub>dưới</sub>) dx`,
        volumeFormula: ax === 'Ox'
          ? `V = &pi; &int;<sub>${a}</sub><sup>${b}</sup> |y<sub>trên</sub><sup>2</sup> - y<sub>dưới</sub><sup>2</sup>| dx`
          : `V = 2&pi; &int;<sub>${a}</sub><sup>${b}</sup> x &middot; (y<sub>trên</sub> - y<sub>dưới</sub>) dx`,
        intersections: allPts,
        regions: regions
      };
    }

    return { success: false, error: 'Không thể xác định cấu hình.' };
  }

  // Vẽ vùng diện tích hình phẳng (S), đường dóng các cận và badge kết quả trên Canvas 2D
  function drawAreaCalculationRegion(ctx, widget) {
    const areaCalc = widget.areaCalc;
    if (!areaCalc || !areaCalc.enabled) return;

    const { x, y, width, height, origin, scale } = widget;
    const { funcCount, func1, func2, func3, boundMode, a, b, axis, drawFill, drawLines, showBadge } = areaCalc;

    const calcRes = calculateAreaAndVolumeDetailed({
      funcCount: funcCount || 1,
      expr1: func1 || (widget.functions && widget.functions[0] && widget.functions[0].expr),
      expr2: func2,
      expr3: func3,
      boundMode: boundMode || 'auto',
      customA: a,
      customB: b,
      axis: axis || 'Ox'
    });

    if (!calcRes || !calcRes.success) return;

    ctx.save();

    // 1. Tô màu các miền diện tích hình phẳng
    if (drawFill !== false && calcRes.regions && calcRes.regions.length > 0) {
      for (const reg of calcRes.regions) {
        const minX = Math.max(reg.a, (x - origin.x) / scale);
        const maxX = Math.min(reg.b, (x + width - origin.x) / scale);
        if (minX >= maxX) continue;

        const mathStep = 1.5 / scale;
        ctx.beginPath();

        let started = false;
        for (let gx = minX; gx <= maxX + mathStep * 0.5; gx += mathStep) {
          const gy = reg.fTop(gx);
          if (isNaN(gy)) continue;
          const pt = mathToCanvas(gx, gy, widget);
          if (!started) {
            ctx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }

        for (let gx = maxX; gx >= minX - mathStep * 0.5; gx -= mathStep) {
          const gy = reg.fBot(gx);
          if (isNaN(gy)) continue;
          const pt = mathToCanvas(gx, gy, widget);
          ctx.lineTo(pt.x, pt.y);
        }

        ctx.closePath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
        ctx.fill();

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
        ctx.lineWidth = 1.0;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // 2. Kẻ đường dóng các cận thẳng đứng nét đứt tại x = a và x = b
    if (drawLines !== false) {
      const boundPoints = [calcRes.a, calcRes.b];
      ctx.save();
      ctx.strokeStyle = 'rgba(5, 150, 105, 0.75)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);

      for (const bx of boundPoints) {
        if (isNaN(bx)) continue;
        const px = origin.x + bx * scale;
        if (px >= x && px <= x + width) {
          ctx.beginPath();
          ctx.moveTo(px, y + 20);
          ctx.lineTo(px, y + height - 20);
          ctx.stroke();

          ctx.font = 'bold 10.5px -apple-system, BlinkMacSystemFont, sans-serif';
          ctx.fillStyle = '#065f46';
          ctx.textAlign = 'center';
          ctx.fillText(`x = ${Number(bx.toFixed(2))}`, px, origin.y + 14);
        }
      }
      ctx.restore();
    }

    // 3. Đánh dấu các giao điểm nếu có
    if (calcRes.intersections && calcRes.intersections.length > 0) {
      ctx.save();
      for (const ip of calcRes.intersections) {
        const pt = mathToCanvas(ip.x, ip.y, widget);
        if (pt.x >= x && pt.x <= x + width && pt.y >= y && pt.y <= y + height) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#dc2626';
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          ctx.font = 'bold 10px -apple-system, sans-serif';
          ctx.fillStyle = '#991b1b';
          ctx.textAlign = 'left';
          ctx.fillText(`(${Number(ip.x.toFixed(2))}; ${Number(ip.y.toFixed(2))})`, pt.x + 5, pt.y - 4);
        }
      }
      ctx.restore();
    }

    // 4. Thẻ nhãn kết quả S & V bo góc ở góc đồ thị
    if (showBadge !== false && calcRes.area !== null) {
      const areaStr = Number(calcRes.area.toFixed(3));
      const volStr = calcRes.volume !== null ? Number(calcRes.volume.toFixed(3)) : '---';
      const badgeText = `📐 S ≈ ${areaStr} đvdt  |  V ≈ ${volStr} đvtt`;

      ctx.save();
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
      const textWidth = ctx.measureText(badgeText).width;
      const bw = textWidth + 20;
      const bh = 24;
      const bx = x + width - bw - 10;
      const by = y + height - bh - 10;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 6);
      ctx.fill();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.2;
      ctx.shadowColor = 'rgba(16, 185, 129, 0.25)';
      ctx.shadowBlur = 6;
      ctx.stroke();

      ctx.fillStyle = '#065f46';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, bx + 10, by + bh / 2);
      ctx.restore();
    }

    ctx.restore();
  }

  // -------------------------------------------------------------
  // VẼ GRAPH WIDGET TRÊN CANVAS 2D
  // -------------------------------------------------------------
  function drawGraphWidget(ctx, widget, isSelected, isHover) {
    ctx.save();

    const { x, y, width, height, origin, scale } = widget;
    const rev = widget.revolution3D;
    const is3D = rev && rev.enabled;

    // 1. Nền widget & đường viền bo góc
    ctx.save();
    ctx.beginPath();
    const radius = 10;
    ctx.roundRect(x, y, width, height, radius);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Viền bao quanh widget khi chọn hoặc hover
    if (isSelected) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.0;
      ctx.shadowColor = 'rgba(16, 185, 129, 0.35)';
      ctx.shadowBlur = 12;
      ctx.stroke();
    } else if (isHover) {
      ctx.strokeStyle = 'rgba(40, 99, 78, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    } else {
      ctx.strokeStyle = 'rgba(36, 60, 54, 0.12)';
      ctx.lineWidth = 1.0;
      ctx.stroke();
    }
    ctx.restore();

    // 2. Clip nội dung trong lòng khung widget (trừ header)
    ctx.save();
    ctx.beginPath();
    ctx.rect(x + 1, y + 1, width - 2, height - 2);
    ctx.clip();

    if (is3D) {
      // Chế độ 3D: Khối tròn xoay mô phỏng thể tích
      drawSolidOfRevolution3D(ctx, widget);
    } else {
      // Chế độ 2D: Lưới, Hệ trục Oxy, Đồ thị các hàm số & Điểm đặc biệt
      drawGraph2D(ctx, widget);
    }

    ctx.restore(); // Kết thúc clip lòng widget

    // 3. Header thanh công cụ mini trên đầu widget (khi widget được chọn hoặc hover)
    if (isSelected || isHover) {
      drawWidgetHeader(ctx, widget, isSelected);
    }

    // 4. Các chấm tay cầm co giãn 4 góc khi được chọn
    if (isSelected) {
      drawWidgetResizeHandles(ctx, widget);
    }

    ctx.restore();
  }

  // Vẽ chế độ 2D
  function drawGraph2D(ctx, widget) {
    const { x, y, width, height, origin, scale, showGrid, showAxes } = widget;

    // Lưới ô vuông mờ
    if (showGrid !== false) {
      ctx.save();
      ctx.strokeStyle = 'rgba(40, 99, 78, 0.08)';
      ctx.lineWidth = 0.8;

      // Đường dọc
      const leftMathX = Math.floor((x - origin.x) / scale);
      const rightMathX = Math.ceil((x + width - origin.x) / scale);
      for (let gx = leftMathX; gx <= rightMathX; gx++) {
        const px = origin.x + gx * scale;
        if (px >= x && px <= x + width) {
          ctx.beginPath();
          ctx.moveTo(px, y);
          ctx.lineTo(px, y + height);
          ctx.stroke();
        }
      }

      // Đường ngang
      const topMathY = Math.ceil((origin.y - y) / scale);
      const bottomMathY = Math.floor((origin.y - (y + height)) / scale);
      for (let gy = bottomMathY; gy <= topMathY; gy++) {
        const py = origin.y - gy * scale;
        if (py >= y && py <= y + height) {
          ctx.beginPath();
          ctx.moveTo(x, py);
          ctx.lineTo(x + width, py);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // Hệ trục tọa độ Oxy
    if (showAxes !== false) {
      ctx.save();
      const axisColor = '#4a6358';
      ctx.strokeStyle = axisColor;
      ctx.fillStyle = axisColor;
      ctx.lineWidth = 1.4;

      // Trục Ox
      const clampedOy = Math.max(y + 18, Math.min(y + height - 18, origin.y));
      ctx.beginPath();
      ctx.moveTo(x + 8, clampedOy);
      ctx.lineTo(x + width - 10, clampedOy);
      ctx.stroke();

      // Mũi tên Ox
      ctx.beginPath();
      ctx.moveTo(x + width - 10, clampedOy);
      ctx.lineTo(x + width - 18, clampedOy - 4.5);
      ctx.lineTo(x + width - 18, clampedOy + 4.5);
      ctx.closePath();
      ctx.fill();

      // Trục Oy
      const clampedOx = Math.max(x + 18, Math.min(x + width - 18, origin.x));
      ctx.beginPath();
      ctx.moveTo(clampedOx, y + height - 8);
      ctx.lineTo(clampedOx, y + 10);
      ctx.stroke();

      // Mũi tên Oy
      ctx.beginPath();
      ctx.moveTo(clampedOx, y + 10);
      ctx.lineTo(clampedOx - 4.5, y + 18);
      ctx.lineTo(clampedOx + 4.5, y + 18);
      ctx.closePath();
      ctx.fill();

      // Nhãn O, x, y
      ctx.font = 'italic 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('O', clampedOx - 14, clampedOy + 15);
      ctx.fillText('x', x + width - 14, clampedOy - 8);
      ctx.fillText('y', clampedOx + 8, y + 16);

      // Vạch chia số (Tick marks)
      ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      const stepX = scale >= 30 ? 1 : 2;
      const leftX = Math.floor((x - origin.x) / scale);
      const rightX = Math.ceil((x + width - origin.x) / scale);

      for (let gx = leftX; gx <= rightX; gx += stepX) {
        if (gx === 0) continue;
        const px = origin.x + gx * scale;
        if (px >= x + 20 && px <= x + width - 25) {
          ctx.beginPath();
          ctx.moveTo(px, clampedOy - 3);
          ctx.lineTo(px, clampedOy + 3);
          ctx.stroke();
          ctx.fillText(gx.toString(), px, clampedOy + 13);
        }
      }

      ctx.textAlign = 'right';
      const stepY = scale >= 30 ? 1 : 2;
      const topY = Math.ceil((origin.y - y) / scale);
      const bottomY = Math.floor((origin.y - (y + height)) / scale);

      for (let gy = bottomY; gy <= topY; gy += stepY) {
        if (gy === 0) continue;
        const py = origin.y - gy * scale;
        if (py >= y + 25 && py <= y + height - 20) {
          ctx.beginPath();
          ctx.moveTo(clampedOx - 3, py);
          ctx.lineTo(clampedOx + 3, py);
          ctx.stroke();
          ctx.fillText(gy.toString(), clampedOx - 6, py + 3.5);
        }
      }
      ctx.restore();
    }

    // Vẽ vùng tính Diện tích hình phẳng (S) và Thể tích (V) (nằm dưới đường cong)
    drawAreaCalculationRegion(ctx, widget);

    // Vẽ các đường đồ thị hàm số
    if (widget.functions && Array.isArray(widget.functions)) {
      widget.functions.forEach((fObj, idx) => {
        if (!fObj || fObj.visible === false || !fObj.expr) return;
        drawSingleFunction(ctx, widget, fObj);
      });
    }

    // Vẽ các điểm đặc biệt & đường dóng nét đứt
    if (widget.specialPoints && Array.isArray(widget.specialPoints)) {
      widget.specialPoints.forEach(sp => {
        drawSpecialPoint(ctx, widget, sp);
      });
    }
  }

  // Vẽ 1 hàm số
  function drawSingleFunction(ctx, widget, fObj) {
    const fn = compileMathExpr(fObj.expr);
    if (!fn) return;

    const { x, y, width, height, origin, scale } = widget;
    const minMathX = (fObj.range && fObj.range[0] !== undefined)
      ? Math.max(fObj.range[0], (x - origin.x) / scale)
      : (x - origin.x) / scale;
    const maxMathX = (fObj.range && fObj.range[1] !== undefined)
      ? Math.min(fObj.range[1], (x + width - origin.x) / scale)
      : (x + width - origin.x) / scale;

    ctx.save();
    ctx.strokeStyle = fObj.color || '#28634e';
    ctx.lineWidth = fObj.width || 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (fObj.dash === 'dashed') {
      ctx.setLineDash([8, 5]);
    } else {
      ctx.setLineDash([]);
    }

    // Bước lấy mẫu thích ứng theo pixel (khoảng 1.2px/mẫu)
    const pxStep = 1.2;
    const mathStep = pxStep / scale;

    let isDrawingSegment = false;
    let lastPy = null;
    ctx.beginPath();

    for (let gx = minMathX; gx <= maxMathX; gx += mathStep) {
      const gy = fn(gx);
      if (isNaN(gy) || !isFinite(gy)) {
        isDrawingSegment = false;
        continue;
      }

      const px = origin.x + gx * scale;
      const py = origin.y - gy * scale;

      // Xử lý tiệm cận đứng hoặc nhảy vọt ra ngoài khung nhìn
      const isOutVertical = (py < y - 50 || py > y + height + 50);
      if (isOutVertical) {
        isDrawingSegment = false;
        lastPy = py;
        continue;
      }

      // Phát hiện nhảy gián đoạn (như hàm tan, 1/x)
      if (lastPy !== null && Math.abs(py - lastPy) > height * 0.75) {
        isDrawingSegment = false;
      }

      if (!isDrawingSegment) {
        ctx.moveTo(px, py);
        isDrawingSegment = true;
      } else {
        ctx.lineTo(px, py);
      }
      lastPy = py;
    }
    ctx.stroke();

    // Vẽ nhãn tên hàm nhỏ thanh nhã ở cuối đường
    const endX = maxMathX;
    const endY = fn(endX);
    if (!isNaN(endY) && isFinite(endY)) {
      const labelPt = mathToCanvas(endX, endY, widget);
      if (labelPt.x >= x && labelPt.x <= x + width - 20 && labelPt.y >= y + 15 && labelPt.y <= y + height - 15) {
        ctx.font = 'italic 11px -apple-system, sans-serif';
        ctx.fillStyle = fObj.color || '#28634e';
        ctx.fillText(`y = ${fObj.expr}`, labelPt.x + 4, labelPt.y - 4);
      }
    }

    ctx.restore();
  }

  // Vẽ điểm đặc biệt có đường dóng tọa độ
  function drawSpecialPoint(ctx, widget, sp) {
    const pt = mathToCanvas(sp.x, sp.y, widget);
    const { x, y, width, height, origin } = widget;

    // Chỉ vẽ khi điểm nằm trong hoặc gần khung
    if (pt.x < x - 20 || pt.x > x + width + 20 || pt.y < y - 20 || pt.y > y + height + 20) return;

    ctx.save();
    const pointColor = sp.color || '#cf7969';

    // Đường dóng nét đứt vuông góc tới Ox và Oy
    if (sp.showProjection !== false) {
      ctx.save();
      ctx.strokeStyle = 'rgba(74, 99, 88, 0.45)';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([4, 4]);

      // Dóng xuống Ox
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(pt.x, origin.y);
      ctx.stroke();

      // Dóng sang Oy
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(origin.x, pt.y);
      ctx.stroke();
      ctx.restore();
    }

    // Vẽ chấm tròn điểm
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = pointColor;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Nhãn tên điểm và tọa độ (x, y)
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = pointColor;
    const coordStr = `(${Number(sp.x.toFixed(2))}, ${Number(sp.y.toFixed(2))})`;
    const label = sp.label ? `${sp.label} ${coordStr}` : coordStr;
    ctx.fillText(label, pt.x + 6, pt.y - 6);

    ctx.restore();
  }

  // Hàm vẽ elip an toàn, chống tràn bán kính âm/NaN và tương thích mọi môi trường
  function safeEllipse(ctx, cx, cy, rx, ry, rot, sa, ea, ccw) {
    if (isNaN(cx) || isNaN(cy) || isNaN(rx) || isNaN(ry)) return;
    rx = Math.max(0.01, Math.abs(rx));
    ry = Math.max(0.01, Math.abs(ry));
    if (typeof ctx.ellipse === 'function') {
      ctx.ellipse(cx, cy, rx, ry, rot || 0, sa, ea, !!ccw);
    } else {
      ctx.save();
      ctx.translate(cx, cy);
      if (rot) ctx.rotate(rot);
      ctx.scale(rx, ry);
      ctx.arc(0, 0, 1, sa, ea, !!ccw);
      ctx.restore();
    }
  }

  // ============================================================================
  // THUẬT TOÁN TỐI ƯU MÔ PHỎNG 3D KHỐI TRÒN XOAY QUANH TRỤC Ox VÀ Oy
  // (Parametric 3D Surface Mesh + Painter's Depth Sorting + Lambertian Shading
  //  + Representative Differential Slice ΔV: Disk/Washer cho Ox & Cylindrical Shell cho Oy)
  // ============================================================================
  function project3DSolidPoint(X, Y, Z, origin, scale, tiltRad, yawRad = 0.22) {
    const cosT = Math.cos(tiltRad);
    const sinT = Math.sin(tiltRad);
    const sinYaw = Math.sin(yawRad);
    // Phối cảnh trục đo nghiêng 3D chuẩn sách giáo khoa Giải tích 12:
    // - Trục X nằm ngang (hơi chếch nhẹ theo chiều sâu Z)
    // - Trục Y thẳng đứng
    // - Trục Z hướng ra phía người nhìn (Z > 0 là phía trước mặt phẳng Oxy, Z < 0 là phía sau)
    const sx = origin.x + (X - Z * sinYaw) * scale;
    const sy = origin.y - (Y * cosT - Z * sinT) * scale;
    const depth = Z * cosT + Y * sinT * 0.35;
    return { x: sx, y: sy, depth };
  }

  function computeQuadNormalShade(P00, P10, P11, P01) {
    const ux = P10.X - P00.X, uy = P10.Y - P00.Y, uz = P10.Z - P00.Z;
    const vx = P01.X - P00.X, vy = P01.Y - P00.Y, vz = P01.Z - P00.Z;
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;
    // Nguồn sáng định hướng từ góc trên-trái-trước: L = (-0.35, 0.65, 0.67)
    const dot = Math.abs(nx * (-0.35) + ny * 0.65 + nz * 0.67);
    return Math.min(1, Math.max(0.25, 0.32 + 0.68 * dot));
  }

  function drawSolidOfRevolution3D(ctx, widget, isModalPreview = false) {
    const { x, y, width, height, origin, scale } = widget;
    const rev = widget.revolution3D || {};
    const axis = rev.axis || 'Ox';
    const isOy = (axis === 'Oy' || axis === 'oy');

    // 1. Lấy khoảng cận quay [a, b]
    const oxMin = (rev.rangeX && rev.rangeX[0] !== undefined) ? rev.rangeX[0] : (rev.range ? rev.range[0] : 0);
    const oxMax = (rev.rangeX && rev.rangeX[1] !== undefined) ? rev.rangeX[1] : (rev.range ? rev.range[1] : 2.5);
    const oyMin = (rev.rangeY && rev.rangeY[0] !== undefined) ? rev.rangeY[0] : -2;
    const oyMax = (rev.rangeY && rev.rangeY[1] !== undefined) ? rev.rangeY[1] : 3;

    const rawMin = Math.min(oxMin, oxMax);
    const rawMax = Math.max(oxMin, oxMax);
    const a = isOy ? Math.max(0, rawMin) : rawMin;
    const b = isOy ? Math.max(a + 0.1, rawMax) : (Math.abs(rawMax - rawMin) < 0.05 ? rawMin + 1 : rawMax);

    const angleDeg = rev.angleDeg !== undefined ? rev.angleDeg : 0;
    const angleRad = (Math.max(0, Math.min(360, angleDeg)) * Math.PI) / 180;
    const tiltDeg = rev.tiltDeg !== undefined ? rev.tiltDeg : 28;
    const tiltRad = (tiltDeg * Math.PI) / 180;
    const yawRad = isOy ? 0.18 : 0.24;
    const showSlice = rev.showSlice !== false;

    const funcs = widget.functions || [];
    const fObj = funcs[rev.funcIndex || 0] || funcs[0];
    if (!fObj || !fObj.expr) return;
    const fn1 = compileMathExpr(fObj.expr);
    if (!fn1) return;

    const func2Idx = rev.func2Index !== undefined ? rev.func2Index : -1;
    const f2Obj = (func2Idx >= 0 && funcs[func2Idx]) ? funcs[func2Idx] : null;
    const fn2 = (f2Obj && f2Obj.expr) ? compileMathExpr(f2Obj.expr) : null;
    const safeF1 = (t) => { const v = fn1(t); return (isNaN(v) || !isFinite(v)) ? 0 : v; };
    const safeF2 = (t) => { if (!fn2) return 0; const v = fn2(t); return (isNaN(v) || !isFinite(v)) ? 0 : v; };

    ctx.save();

    // Nền 3D Studio sáng rõ, độ tương phản cao
    const bgGrad = ctx.createLinearGradient(x, y, x, y + height);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(1, '#f1f5f9');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(x, y, width, height);

    // 2. Vẽ mặt phẳng lưới phối cảnh 3D (mặt phẳng Z = 0 và sàn tham chiếu)
    ctx.save();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
    ctx.lineWidth = 0.8;
    for (let gx = -6; gx <= 6; gx += 1) {
      const p1 = project3DSolidPoint(gx, 0, -2.5, origin, scale, tiltRad, yawRad);
      const p2 = project3DSolidPoint(gx, 0, 2.5, origin, scale, tiltRad, yawRad);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    for (let gz = -2; gz <= 2; gz += 1) {
      if (gz === 0) continue;
      const p1 = project3DSolidPoint(-6, 0, gz, origin, scale, tiltRad, yawRad);
      const p2 = project3DSolidPoint(6, 0, gz, origin, scale, tiltRad, yawRad);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    ctx.restore();

    // Hàm vẽ đoạn trục tọa độ Ox, Oy (có thể gọi trước và sau khối 3D để tạo hiệu ứng trục xuyên tâm)
    const drawCoordinateAxes3D = (onlyForegroundAxis = false) => {
      ctx.save();
      const bottomLimit = isModalPreview ? (y + height - 14) : (y + height - 58);

      if (!onlyForegroundAxis) {
        // Trục Ox
        ctx.strokeStyle = !isOy ? '#6d28d9' : '#334155';
        ctx.lineWidth = !isOy ? 2.4 : 1.6;
        ctx.beginPath();
        ctx.moveTo(x + 16, origin.y);
        ctx.lineTo(x + width - 16, origin.y);
        ctx.stroke();

        // Mũi tên Ox
        ctx.fillStyle = !isOy ? '#6d28d9' : '#334155';
        ctx.beginPath();
        ctx.moveTo(x + width - 14, origin.y);
        ctx.lineTo(x + width - 23, origin.y - 4.5);
        ctx.lineTo(x + width - 23, origin.y + 4.5);
        ctx.fill();

        // Nhãn x & vạch cận a, b
        ctx.font = 'bold 11px -apple-system, sans-serif';
        ctx.fillText('x', x + width - 18, origin.y - 8);

        ctx.font = '10px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        const pA = project3DSolidPoint(a, 0, 0, origin, scale, tiltRad, yawRad);
        const pB = project3DSolidPoint(b, 0, 0, origin, scale, tiltRad, yawRad);
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(pA.x, origin.y - 4);
        ctx.lineTo(pA.x, origin.y + 4);
        ctx.moveTo(pB.x, origin.y - 4);
        ctx.lineTo(pB.x, origin.y + 4);
        ctx.stroke();
        ctx.fillText(`a=${Number(a.toFixed(2))}`, pA.x, origin.y + 14);
        ctx.fillText(`b=${Number(b.toFixed(2))}`, pB.x, origin.y + 14);

        // Nếu quay quanh Ox: vẽ biểu tượng vòng xoay tròn quanh trục Ox ở bên phải
        if (!isOy) {
          const ringX = Math.min(x + width - 38, Math.max(origin.x + 50, pB.x + 24));
          ctx.save();
          ctx.strokeStyle = '#7c3aed';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          safeEllipse(ctx, ringX, origin.y, 5, 14, 0, -Math.PI * 0.75, Math.PI * 0.85);
          ctx.stroke();
          ctx.fillStyle = '#7c3aed';
          ctx.beginPath();
          ctx.moveTo(ringX - 4, origin.y + 12);
          ctx.lineTo(ringX - 8, origin.y + 7);
          ctx.lineTo(ringX - 1, origin.y + 7);
          ctx.fill();
          ctx.restore();
        }

        // Trục Oy
        ctx.strokeStyle = isOy ? '#dc2626' : '#334155';
        ctx.lineWidth = isOy ? 2.4 : 1.6;
        ctx.beginPath();
        ctx.moveTo(origin.x, bottomLimit);
        ctx.lineTo(origin.x, y + 18);
        ctx.stroke();

        // Mũi tên Oy
        ctx.fillStyle = isOy ? '#dc2626' : '#334155';
        ctx.beginPath();
        ctx.moveTo(origin.x, y + 14);
        ctx.lineTo(origin.x - 4.5, y + 23);
        ctx.lineTo(origin.x + 4.5, y + 23);
        ctx.fill();
        ctx.font = 'bold 11px -apple-system, sans-serif';
        ctx.fillText('y', origin.x - 12, y + 22);

        if (isOy) {
          // Biểu tượng vòng xoay quanh trục đứng Oy
          ctx.save();
          ctx.strokeStyle = '#ea580c';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          safeEllipse(ctx, origin.x, y + 34, 15, 5, 0, 0, Math.PI * 1.65);
          ctx.stroke();
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.moveTo(origin.x + 15, y + 34);
          ctx.lineTo(origin.x + 11, y + 30);
          ctx.lineTo(origin.x + 18, y + 30);
          ctx.fill();
          ctx.restore();
        }

        // Nhãn hiệu Trục quay góc trên trái
        ctx.save();
        const badgeText = isOy ? '⟳ TRỤC QUAY: Oy (Trục tung)' : '⟳ TRỤC QUAY: Ox (Trục hoành)';
        ctx.font = 'bold 10.5px -apple-system, sans-serif';
        const bw = ctx.measureText(badgeText).width + 16;
        ctx.fillStyle = isOy ? 'rgba(254, 226, 226, 0.94)' : 'rgba(237, 233, 254, 0.94)';
        ctx.beginPath();
        ctx.roundRect(x + 10, y + 10, bw, 20, 5);
        ctx.fill();
        ctx.strokeStyle = isOy ? '#dc2626' : '#7c3aed';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = isOy ? '#b91c1c' : '#5b21b6';
        ctx.textAlign = 'left';
        ctx.fillText(badgeText, x + 18, y + 24);
        ctx.restore();
      } else {
        // Vẽ nét đứt mờ của trục quay xuyên qua tâm khối 3D để học sinh thấy rõ tâm đối xứng
        ctx.save();
        ctx.setLineDash([4, 3]);
        ctx.lineWidth = 1.4;
        if (!isOy) {
          const pA = project3DSolidPoint(a, 0, 0, origin, scale, tiltRad, yawRad);
          const pB = project3DSolidPoint(b, 0, 0, origin, scale, tiltRad, yawRad);
          ctx.strokeStyle = 'rgba(109, 40, 217, 0.65)';
          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.lineTo(pB.x, pB.y);
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(220, 38, 38, 0.65)';
          ctx.beginPath();
          ctx.moveTo(origin.x, bottomLimit - 10);
          ctx.lineTo(origin.x, y + 26);
          ctx.stroke();
        }
        ctx.restore();
      }
      ctx.restore();
    };

    // Vẽ hệ trục nền
    drawCoordinateAxes3D(false);

    // 3. TẠO LƯỚI BỀ MẶT 3D THAM SỐ & SẮP XẾP ĐỘ SÂU (PAINTER'S ALGORITHM)
    const nx = isModalPreview ? 28 : 36;
    const dx = (b - a) / nx;

    if (angleDeg > 0.5) {
      const nAlpha = Math.max(8, Math.min(40, Math.ceil((angleDeg / 360) * (isModalPreview ? 30 : 38))));
      const dAlpha = angleRad / nAlpha;
      const quads = [];

      const pushSurfaceQuad = (P00, P10, P11, P01, colorType) => {
        const s00 = project3DSolidPoint(P00.X, P00.Y, P00.Z, origin, scale, tiltRad, yawRad);
        const s10 = project3DSolidPoint(P10.X, P10.Y, P10.Z, origin, scale, tiltRad, yawRad);
        const s11 = project3DSolidPoint(P11.X, P11.Y, P11.Z, origin, scale, tiltRad, yawRad);
        const s01 = project3DSolidPoint(P01.X, P01.Y, P01.Z, origin, scale, tiltRad, yawRad);
        const avgDepth = (s00.depth + s10.depth + s11.depth + s01.depth) * 0.25;
        const shade = computeQuadNormalShade(P00, P10, P11, P01);
        quads.push({ s00, s10, s11, s01, avgDepth, shade, colorType });
      };

      if (!isOy) {
        // ===============================================================
        // TRƯỜNG HỢP 1: QUAY QUANH TRỤC HOÀNH Ox (PHƯƠNG PHÁP ĐĨA / VÀNH KHĂN)
        // P(x, alpha) = (x, R(x)*cos(alpha), R(x)*sin(alpha))
        // ===============================================================
        for (let i = 0; i < nx; i++) {
          const x0 = a + i * dx;
          const x1 = a + (i + 1) * dx;
          const yOuter0 = safeF1(x0);
          const yOuter1 = safeF1(x1);
          const yInner0 = safeF2(x0);
          const yInner1 = safeF2(x1);

          for (let j = 0; j < nAlpha; j++) {
            const a0 = j * dAlpha;
            const a1 = (j + 1) * dAlpha;
            const c0 = Math.cos(a0), s0 = Math.sin(a0);
            const c1 = Math.cos(a1), s1 = Math.sin(a1);

            // Mặt cong ngoài y = f(x)
            pushSurfaceQuad(
              { X: x0, Y: yOuter0 * c0, Z: yOuter0 * s0 },
              { X: x1, Y: yOuter1 * c0, Z: yOuter1 * s0 },
              { X: x1, Y: yOuter1 * c1, Z: yOuter1 * s1 },
              { X: x0, Y: yOuter0 * c1, Z: yOuter0 * s1 },
              'ox-outer'
            );

            // Mặt cong trong y = g(x) (nếu có hàm thứ 2 khác 0)
            if (fn2 && (Math.abs(yInner0) > 1e-3 || Math.abs(yInner1) > 1e-3)) {
              pushSurfaceQuad(
                { X: x0, Y: yInner0 * c0, Z: yInner0 * s0 },
                { X: x1, Y: yInner1 * c0, Z: yInner1 * s0 },
                { X: x1, Y: yInner1 * c1, Z: yInner1 * s1 },
                { X: x0, Y: yInner0 * c1, Z: yInner0 * s1 },
                'ox-inner'
              );
            }
          }
        }
      } else {
        // ===============================================================
        // TRƯỜNG HỢP 2: QUAY QUANH TRỤC TUNG Oy (PHƯƠNG PHÁP VỎ TRỤ / ĐĨA NGANG)
        // Điểm (x, y) quay quanh trục đứng Oy với bán kính r = x:
        // P(x, alpha) = (x*cos(alpha), y, x*sin(alpha))
        // ===============================================================
        for (let i = 0; i < nx; i++) {
          const x0 = a + i * dx;
          const x1 = a + (i + 1) * dx;
          const yTop0 = safeF1(x0);
          const yTop1 = safeF1(x1);
          const yBot0 = safeF2(x0);
          const yBot1 = safeF2(x1);

          for (let j = 0; j < nAlpha; j++) {
            const a0 = j * dAlpha;
            const a1 = (j + 1) * dAlpha;
            const c0 = Math.cos(a0), s0 = Math.sin(a0);
            const c1 = Math.cos(a1), s1 = Math.sin(a1);

            // Mặt cong phía trên y = f(x) xoay quanh Oy
            pushSurfaceQuad(
              { X: x0 * c0, Y: yTop0, Z: x0 * s0 },
              { X: x1 * c0, Y: yTop1, Z: x1 * s0 },
              { X: x1 * c1, Y: yTop1, Z: x1 * s1 },
              { X: x0 * c1, Y: yTop0, Z: x0 * s1 },
              'oy-top'
            );

            // Mặt đáy dưới y = g(x) (hoặc y = 0) xoay quanh Oy
            pushSurfaceQuad(
              { X: x0 * c0, Y: yBot0, Z: x0 * s0 },
              { X: x1 * c0, Y: yBot1, Z: x1 * s0 },
              { X: x1 * c1, Y: yBot1, Z: x1 * s1 },
              { X: x0 * c1, Y: yBot0, Z: x0 * s1 },
              'oy-bottom'
            );
          }
        }

        // Thành trụ ngoài tại biên x = b (từ y = g(b) đến y = f(b)) để khép kín khối thể tích 3D
        const ybTop = safeF1(b);
        const ybBot = safeF2(b);
        if (Math.abs(ybTop - ybBot) > 1e-3 && b > 1e-3) {
          for (let j = 0; j < nAlpha; j++) {
            const a0 = j * dAlpha;
            const a1 = (j + 1) * dAlpha;
            const c0 = Math.cos(a0), s0 = Math.sin(a0);
            const c1 = Math.cos(a1), s1 = Math.sin(a1);
            pushSurfaceQuad(
              { X: b * c0, Y: ybBot, Z: b * s0 },
              { X: b * c0, Y: ybTop, Z: b * s0 },
              { X: b * c1, Y: ybTop, Z: b * s1 },
              { X: b * c1, Y: ybBot, Z: b * s1 },
              'oy-wall-outer'
            );
          }
        }

        // Thành trụ trong tại biên x = a (nếu a > 0)
        const yaTop = safeF1(a);
        const yaBot = safeF2(a);
        if (a > 0.05 && Math.abs(yaTop - yaBot) > 1e-3) {
          for (let j = 0; j < nAlpha; j++) {
            const a0 = j * dAlpha;
            const a1 = (j + 1) * dAlpha;
            const c0 = Math.cos(a0), s0 = Math.sin(a0);
            const c1 = Math.cos(a1), s1 = Math.sin(a1);
            pushSurfaceQuad(
              { X: a * c0, Y: yaBot, Z: a * s0 },
              { X: a * c0, Y: yaTop, Z: a * s0 },
              { X: a * c1, Y: yaTop, Z: a * s1 },
              { X: a * c1, Y: yaBot, Z: a * s1 },
              'oy-wall-inner'
            );
          }
        }
      }

      // Sắp xếp các mảnh bề mặt từ xa đến gần (Painter's Algorithm: avgDepth tăng dần)
      quads.sort((qA, qB) => qA.avgDepth - qB.avgDepth);

      // Vẽ từng mảnh tứ giác với độ sáng bóng 3D (Lambertian Shading)
      for (const q of quads) {
        const sh = q.shade;
        let fillCol = '';
        let strokeCol = '';
        if (q.colorType === 'ox-outer') {
          const r = Math.round(95 + 75 * sh);
          const g = Math.round(45 + 65 * sh);
          const bl = Math.round(185 + 65 * sh);
          fillCol = `rgba(${r}, ${g}, ${bl}, 0.46)`;
          strokeCol = `rgba(${r}, ${g}, ${bl}, 0.16)`;
        } else if (q.colorType === 'ox-inner') {
          const r = Math.round(210 * sh);
          const g = Math.round(110 + 70 * sh);
          const bl = Math.round(60 + 40 * sh);
          fillCol = `rgba(${r}, ${g}, ${bl}, 0.36)`;
          strokeCol = `rgba(${r}, ${g}, ${bl}, 0.15)`;
        } else if (q.colorType === 'oy-top') {
          const r = Math.round(12 + 55 * sh);
          const g = Math.round(125 + 85 * sh);
          const bl = Math.round(190 + 60 * sh);
          fillCol = `rgba(${r}, ${g}, ${bl}, 0.50)`;
          strokeCol = `rgba(${r}, ${g}, ${bl}, 0.18)`;
        } else if (q.colorType === 'oy-wall-outer') {
          const r = Math.round(8 + 38 * sh);
          const g = Math.round(105 + 70 * sh);
          const bl = Math.round(168 + 65 * sh);
          fillCol = `rgba(${r}, ${g}, ${bl}, 0.44)`;
          strokeCol = `rgba(${r}, ${g}, ${bl}, 0.16)`;
        } else {
          const r = Math.round(30 + 60 * sh);
          const g = Math.round(140 + 70 * sh);
          const bl = Math.round(200 + 45 * sh);
          fillCol = `rgba(${r}, ${g}, ${bl}, 0.26)`;
          strokeCol = `rgba(${r}, ${g}, ${bl}, 0.10)`;
        }

        ctx.beginPath();
        ctx.moveTo(q.s00.x, q.s00.y);
        ctx.lineTo(q.s10.x, q.s10.y);
        ctx.lineTo(q.s11.x, q.s11.y);
        ctx.lineTo(q.s01.x, q.s01.y);
        ctx.closePath();
        ctx.fillStyle = fillCol;
        ctx.fill();
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // 4. VẼ CÁC VÒNG VĨ TUYẾN (WIREFRAME RINGS: NÉT ĐỨT Ở MẶT SAU Z < 0, NÉT LIỀN Ở MẶT TRƯỚC Z >= 0)
      const ringCount = 6;
      const ringStep = Math.max(1, Math.floor(nx / ringCount));
      for (let i = 0; i <= nx; i += ringStep) {
        const tx = a + i * dx;
        const yVal = safeF1(tx);
        const stepsArc = 40;
        const dA = angleRad / stepsArc;

        // Vẽ nửa sau (sin(alpha) < 0 -> Z < 0) bằng nét đứt, nửa trước (sin(alpha) >= 0 -> Z >= 0) bằng nét liền
        for (const isFrontPass of [false, true]) {
          ctx.save();
          if (!isFrontPass) {
            ctx.setLineDash([4, 3]);
            ctx.lineWidth = 1.0;
            ctx.strokeStyle = isOy ? 'rgba(2, 132, 199, 0.42)' : 'rgba(109, 40, 217, 0.42)';
          } else {
            ctx.setLineDash([]);
            ctx.lineWidth = (i === 0 || i === nx) ? 1.8 : 1.2;
            ctx.strokeStyle = isOy ? '#0284c7' : '#6d28d9';
          }
          ctx.beginPath();
          let penDown = false;
          for (let k = 0; k <= stepsArc; k++) {
            const al = k * dA;
            const c = Math.cos(al), s = Math.sin(al);
            const P3 = !isOy
              ? { X: tx, Y: yVal * c, Z: yVal * s }
              : { X: tx * c, Y: yVal, Z: tx * s };
            const isFront = P3.Z >= -1e-4;
            if (isFront === isFrontPass) {
              const scr = project3DSolidPoint(P3.X, P3.Y, P3.Z, origin, scale, tiltRad, yawRad);
              if (!penDown) {
                ctx.moveTo(scr.x, scr.y);
                penDown = true;
              } else {
                ctx.lineTo(scr.x, scr.y);
              }
            } else {
              penDown = false;
            }
          }
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // Vẽ đường trục xuyên tâm khối 3D
    drawCoordinateAxes3D(true);

    // 5. VẼ LÁT CẮT VI PHÂN MẪU ΔV (ĐĨA TRÒN / VÀNH KHĂN CHO Ox — VỎ TRỤ / ĐĨA NGANG CHO Oy)
    if (showSlice && b > a + 0.05) {
      const xm = (a + b) * 0.5;
      const ym1 = safeF1(xm);
      const ym2 = safeF2(xm);
      const sliceSweep = angleDeg > 15 ? angleRad : Math.PI * 2;
      const sliceSteps = 44;

      ctx.save();
      if (!isOy) {
        // Đĩa tròn / Vành khăn mẫu vuông góc với trục Ox tại x = xm
        ctx.beginPath();
        for (let k = 0; k <= sliceSteps; k++) {
          const al = (k / sliceSteps) * sliceSweep;
          const pt = project3DSolidPoint(xm, ym1 * Math.cos(al), ym1 * Math.sin(al), origin, scale, tiltRad, yawRad);
          if (k === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        if (fn2 && Math.abs(ym2) > 1e-3) {
          for (let k = sliceSteps; k >= 0; k--) {
            const al = (k / sliceSteps) * sliceSweep;
            const pt = project3DSolidPoint(xm, ym2 * Math.cos(al), ym2 * Math.sin(al), origin, scale, tiltRad, yawRad);
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          const centerPt = project3DSolidPoint(xm, 0, 0, origin, scale, tiltRad, yawRad);
          ctx.lineTo(centerPt.x, centerPt.y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.42)';
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Bán kính R = |f(x)| từ trục Ox lên đỉnh đĩa
        const cPt = project3DSolidPoint(xm, 0, 0, origin, scale, tiltRad, yawRad);
        const rPt = project3DSolidPoint(xm, ym1, 0, origin, scale, tiltRad, yawRad);
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(cPt.x, cPt.y);
        ctx.lineTo(rPt.x, rPt.y);
        ctx.stroke();

        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 10px -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('R = |f(x)|', (cPt.x + rPt.x) / 2 + 4, (cPt.y + rPt.y) / 2);
      } else {
        // Vỏ trụ mẫu (Cylindrical Shell) bán kính r = xm, chiều cao h = |f(xm) - g(xm)| quay quanh trục Oy
        ctx.beginPath();
        for (let k = 0; k <= sliceSteps; k++) {
          const al = (k / sliceSteps) * sliceSweep;
          const pt = project3DSolidPoint(xm * Math.cos(al), ym1, xm * Math.sin(al), origin, scale, tiltRad, yawRad);
          if (k === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // Thanh đứng chiều cao h = |f(x)| tại mặt phẳng gốc alpha = 0 và tại góc đang quét alpha = angleRad
        const pBot0 = project3DSolidPoint(xm, ym2, 0, origin, scale, tiltRad, yawRad);
        const pTop0 = project3DSolidPoint(xm, ym1, 0, origin, scale, tiltRad, yawRad);
        const pAxisOy = project3DSolidPoint(0, ym1, 0, origin, scale, tiltRad, yawRad);

        // Đường bán kính r = x từ trục Oy ra điểm (xm, ym1)
        ctx.save();
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 1.6;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(pAxisOy.x, pAxisOy.y);
        ctx.lineTo(pTop0.x, pTop0.y);
        ctx.stroke();
        ctx.restore();

        // Chiều cao h = f(x) của vỏ trụ
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(pBot0.x, pBot0.y);
        ctx.lineTo(pTop0.x, pTop0.y);
        ctx.stroke();

        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 10px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('r = x', (pAxisOy.x + pTop0.x) / 2, pTop0.y - 5);
      }
      ctx.restore();
    }

    // 6. VẼ MIỀN PHẲNG GỐC S TẠI GÓC 0° VÀ LÁ MẶT CẮT ĐANG QUÉT TẠI GÓC θ
    const drawCrossSectionLeaf = (alpha, isInitialLeaf) => {
      const cosA = Math.cos(alpha);
      const sinA = Math.sin(alpha);
      ctx.save();
      ctx.beginPath();

      for (let i = 0; i <= nx; i++) {
        const tx = a + i * dx;
        const yTop = safeF1(tx);
        const P3 = !isOy
          ? { X: tx, Y: yTop * cosA, Z: yTop * sinA }
          : { X: tx * cosA, Y: yTop, Z: tx * sinA };
        const scr = project3DSolidPoint(P3.X, P3.Y, P3.Z, origin, scale, tiltRad, yawRad);
        if (i === 0) ctx.moveTo(scr.x, scr.y);
        else ctx.lineTo(scr.x, scr.y);
      }

      for (let i = nx; i >= 0; i--) {
        const tx = a + i * dx;
        const yBot = safeF2(tx);
        const P3 = !isOy
          ? { X: tx, Y: yBot * cosA, Z: yBot * sinA }
          : { X: tx * cosA, Y: yBot, Z: tx * sinA };
        const scr = project3DSolidPoint(P3.X, P3.Y, P3.Z, origin, scale, tiltRad, yawRad);
        ctx.lineTo(scr.x, scr.y);
      }
      ctx.closePath();

      if (isInitialLeaf) {
        const isZero = angleDeg <= 0.5;
        ctx.fillStyle = !isOy
          ? (isZero ? 'rgba(139, 92, 246, 0.42)' : 'rgba(139, 92, 246, 0.18)')
          : (isZero ? 'rgba(245, 158, 11, 0.45)' : 'rgba(245, 158, 11, 0.20)');
        ctx.fill();
        ctx.strokeStyle = !isOy ? '#7c3aed' : '#d97706';
        ctx.lineWidth = isZero ? 2.0 : 1.4;
        ctx.setLineDash([4, 3]);
        ctx.stroke();

        if (isZero) {
          const midX = (a + b) * 0.5;
          const midY = (safeF1(midX) + safeF2(midX)) * 0.5;
          const midScr = project3DSolidPoint(midX, midY, 0, origin, scale, tiltRad, yawRad);
          ctx.font = 'bold 11px -apple-system, sans-serif';
          ctx.fillStyle = !isOy ? '#5b21b6' : '#b45309';
          ctx.textAlign = 'center';
          ctx.fillText(isOy ? '📐 Miền S (quay quanh Oy)' : '📐 Miền S (quay quanh Ox)', midScr.x, midScr.y);
        }
      } else {
        // Lá mặt cắt đang quét tại góc theta
        ctx.fillStyle = 'rgba(249, 115, 22, 0.35)';
        ctx.fill();
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 2.2;
        ctx.setLineDash([]);
        ctx.stroke();
      }
      ctx.restore();
    };

    // Vẽ lá mặt cắt gốc tại 0°
    drawCrossSectionLeaf(0, true);
    // Nếu đang quét dở (0° < angleDeg < 359°), vẽ lá mặt cắt đang quét tại góc angleRad
    if (angleDeg > 0.5 && angleDeg < 359.5) {
      drawCrossSectionLeaf(angleRad, false);
    }

    // 7. THANH ĐIỀU KHIỂN CHUYỂN ĐỘNG TRỰC TIẾP TRÊN WIDGET (Ẩn khi ở khung Preview nhỏ trong Modal)
    if (!isModalPreview) {
      drawWidget3DControls(ctx, widget, a, b, oxMin, oxMax, oyMin, oyMax, isOy);
    }

    ctx.restore();
  }

  // Vẽ thanh điều khiển chuyển động trực tiếp trên widget ở chế độ 3D
  function drawWidget3DControls(ctx, widget, a, b, oxMin, oxMax, oyMin, oyMax, isOy) {
    const { x, y, width, height } = widget;
    const rev = widget.revolution3D || {};
    const barH = 50;
    const barY = y + height - barH - 8;
    const barX = x + 10;
    const barW = width - 20;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 8);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.fill();
    ctx.strokeStyle = isOy ? 'rgba(2, 132, 199, 0.35)' : 'rgba(124, 58, 237, 0.30)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Nút [ ▶ Bắt đầu ] / [ ⏸ Tạm dừng ]
    const isPlaying = !!rev.isPlaying;
    const currentSpeed = rev.speed || 1.0;
    const btnPlayX = barX + 8;
    const btnPlayY = barY + 6;
    ctx.beginPath();
    ctx.roundRect(btnPlayX, btnPlayY, 78, 20, 4);
    ctx.fillStyle = isPlaying ? '#ef4444' : (isOy ? '#0284c7' : '#7c3aed');
    ctx.fill();
    ctx.font = 'bold 10.5px -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(isPlaying ? '⏸ Tạm dừng' : '▶ Bắt đầu', btnPlayX + 39, btnPlayY + 14);

    // Nút [ ↺ 0° ]
    const btnResetX = btnPlayX + 84;
    ctx.beginPath();
    ctx.roundRect(btnResetX, btnPlayY, 44, 20, 4);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.stroke();
    ctx.fillStyle = '#334155';
    ctx.fillText('↺ 0°', btnResetX + 22, btnPlayY + 14);

    // 3 nút tốc độ: [ 0.5x ] [ 1x ] [ 2x ]
    const speeds = [0.5, 1.0, 2.0];
    let spX = btnResetX + 50;
    for (const sp of speeds) {
      const isAct = Math.abs(currentSpeed - sp) < 0.1;
      ctx.beginPath();
      ctx.roundRect(spX, btnPlayY, 34, 20, 4);
      ctx.fillStyle = isAct ? (isOy ? '#0284c7' : '#7c3aed') : '#ffffff';
      ctx.fill();
      ctx.strokeStyle = isAct ? (isOy ? '#0284c7' : '#7c3aed') : 'rgba(148, 163, 184, 0.4)';
      ctx.stroke();
      ctx.fillStyle = isAct ? '#ffffff' : '#64748b';
      ctx.fillText(`${sp}x`, spX + 17, btnPlayY + 14);
      spX += 38;
    }

    // Góc quét hiện tại
    const angleDeg = Math.round(rev.angleDeg || 0);
    ctx.font = 'bold 11px -apple-system, sans-serif';
    ctx.fillStyle = isOy ? '#0284c7' : '#7c3aed';
    ctx.textAlign = 'right';
    const axisName = isOy ? 'trục Oy' : 'trục Ox';
    ctx.fillText(`📐 Quét quanh ${axisName}: ${angleDeg}° / 360°`, barX + barW - 10, btnPlayY + 14);

    // Hàng 2: Hiển thị cận + Thể tích V chuẩn xác (cả dạng hệ số π và số thập phân)
    const row2Y = barY + 32;
    ctx.textAlign = 'left';
    ctx.font = '10px -apple-system, sans-serif';

    const funcs = widget.functions || [];
    const fObj = funcs[rev.funcIndex || 0] || funcs[0] || null;
    const f2Idx = rev.func2Index !== undefined ? rev.func2Index : -1;
    const f2Obj = (f2Idx >= 0 && funcs[f2Idx]) ? funcs[f2Idx] : null;
    const vol = fObj ? calculateRevolutionVolume(fObj.expr, rev.axis || 'Ox', a, b, f2Obj ? f2Obj.expr : null) : null;
    const volDecStr = vol !== null ? Number(vol.toFixed(3)).toString() : '---';
    const volPiCoeff = vol !== null ? Number((vol / Math.PI).toFixed(3)).toString() : '---';

    if (isOy) {
      ctx.fillStyle = '#b91c1c';
      ctx.fillText(`⟳ TRỤC QUAY: Oy (Tung)`, barX + 10, row2Y + 10);
      ctx.fillStyle = '#0369a1';
      ctx.fillText(`Cận [${Number(a.toFixed(2))}; ${Number(b.toFixed(2))}]  |  V ≈ ${volPiCoeff}π ≈ ${volDecStr} (đvtt)`, barX + 138, row2Y + 10);
    } else {
      ctx.fillStyle = '#6d28d9';
      ctx.fillText(`⟳ TRỤC QUAY: Ox (Hoành)`, barX + 10, row2Y + 10);
      ctx.fillStyle = '#475569';
      ctx.fillText(`Cận [${Number(a.toFixed(2))}; ${Number(b.toFixed(2))}]  |  V ≈ ${volPiCoeff}π ≈ ${volDecStr} (đvtt)`, barX + 150, row2Y + 10);
    }

    ctx.restore();
  }

    // Hit test các nút điều khiển trực tiếp trên thanh 3D của widget
  function hitTestWidget3DControls(widget, px, py) {
    if (!widget.revolution3D || !widget.revolution3D.enabled) return null;
    const { x, y, width, height } = widget;
    const barH = 50;
    const barY = y + height - barH - 8;
    const barX = x + 10;
    const barW = width - 20;

    if (px < barX || px > barX + barW || py < barY || py > barY + barH) return null;

    const btnPlayX = barX + 8;
    const btnPlayY = barY + 6;
    if (px >= btnPlayX && px <= btnPlayX + 78 && py >= btnPlayY && py <= btnPlayY + 20) {
      return 'play_pause';
    }

    const btnResetX = btnPlayX + 84;
    if (px >= btnResetX && px <= btnResetX + 44 && py >= btnPlayY && py <= btnPlayY + 20) {
      return 'reset';
    }

    let spX = btnResetX + 50;
    if (px >= spX && px <= spX + 34 && py >= btnPlayY && py <= btnPlayY + 20) return 'speed_05';
    spX += 38;
    if (px >= spX && px <= spX + 34 && py >= btnPlayY && py <= btnPlayY + 20) return 'speed_10';
    spX += 38;
    if (px >= spX && px <= spX + 34 && py >= btnPlayY && py <= btnPlayY + 20) return 'speed_20';

  }

  // -------------------------------------------------------------
  // HEADER THANH ĐIỀU KHIỂN & TAY CẦM RESIZE WIDGET
  // -------------------------------------------------------------
  function drawWidgetHeader(ctx, widget, isSelected) {
    const { x, y, width } = widget;
    const headerH = 26;
    const rev = widget.revolution3D;
    const is3D = rev && rev.enabled;

    ctx.save();
    // Thanh header mờ phong cách macOS
    ctx.fillStyle = isSelected ? '#28634e' : 'rgba(40, 99, 78, 0.85)';
    ctx.beginPath();
    ctx.roundRect(x, y - headerH + 2, width, headerH, [6, 6, 0, 0]);
    ctx.fill();

    const isAreaActive = widget.areaCalc && widget.areaCalc.enabled;

    // Icon & Tiêu đề
    ctx.font = 'bold 11.5px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('📈 Đồ thị hàm số' + (is3D ? ' (3D Tròn xoay)' : ''), x + 10, y - headerH + 18);

    // Nút 1: [⚙️ Sửa hàm]
    const btnEditX = x + width - 275;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.roundRect(btnEditX, y - headerH + 5, 82, 18, 4);
    ctx.fill();
    ctx.font = '10.5px -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('⚙️ Sửa hàm', btnEditX + 11, y - headerH + 18);

    // Nút 2: [📐 Tính S & V]
    const btnAreaX = x + width - 188;
    ctx.fillStyle = isAreaActive ? '#10b981' : 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.roundRect(btnAreaX, y - headerH + 5, 92, 18, 4);
    ctx.fill();
    ctx.font = 'bold 10.5px -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('📐 Tính S & V', btnAreaX + 10, y - headerH + 18);

    // Nút 3: [🔄 Xoay 3D / 2D]
    const btn3DX = x + width - 92;
    ctx.fillStyle = is3D ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.roundRect(btn3DX, y - headerH + 5, 84, 18, 4);
    ctx.fill();
    ctx.font = 'bold 10.5px -apple-system, sans-serif';
    ctx.fillStyle = is3D ? '#243c36' : '#ffffff';
    ctx.fillText(is3D ? '⏹ Chế độ 2D' : '🔄 Thể tích 3D', btn3DX + 8, y - headerH + 18);

    ctx.restore();
  }

  // Chấm tay cầm co giãn 4 góc widget
  function drawWidgetResizeHandles(ctx, widget) {
    const { x, y, width, height } = widget;
    const corners = [
      { id: 'top_left', cx: x, cy: y },
      { id: 'top_right', cx: x + width, cy: y },
      { id: 'bottom_left', cx: x, cy: y + height },
      { id: 'bottom_right', cx: x + width, cy: y + height }
    ];

    ctx.save();
    for (const c of corners) {
      ctx.beginPath();
      ctx.arc(c.cx, c.cy, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }
    ctx.restore();
  }

  // -------------------------------------------------------------
  // VA CHẠM (Hit testing) VÀ TƯƠNG TÁC CHUỘT
  // -------------------------------------------------------------
  function hitTestGraphWidget(widget, px, py) {
    const { x, y, width, height } = widget;
    const headerH = 26;
    // Bắt trúng cả thân widget hoặc thanh header
    return (px >= x && px <= x + width && py >= y - headerH && py <= y + height);
  }

  function hitTestWidgetHeaderButtons(widget, px, py) {
    const { x, y, width } = widget;
    const headerH = 26;
    if (py < y - headerH || py > y) return null;

    const btnEditX = x + width - 275;
    if (px >= btnEditX && px <= btnEditX + 82) {
      return 'edit';
    }

    const btnAreaX = x + width - 188;
    if (px >= btnAreaX && px <= btnAreaX + 92) {
      return 'area_volume';
    }

    const btn3DX = x + width - 92;
    if (px >= btn3DX && px <= btn3DX + 84) {
      return 'toggle3d';
    }

    return 'header_drag';
  }

  function hitTestWidgetResizeHandle(widget, px, py, hitR = 14) {
    const { x, y, width, height } = widget;
    const corners = [
      { id: 'top_left', cx: x, cy: y },
      { id: 'top_right', cx: x + width, cy: y },
      { id: 'bottom_left', cx: x, cy: y + height },
      { id: 'bottom_right', cx: x + width, cy: y + height }
    ];

    for (const c of corners) {
      if (Math.hypot(px - c.cx, py - c.cy) <= hitR) {
        return c.id;
      }
    }
    return null;
  }

  // -------------------------------------------------------------
  // BỘ ĐIỀU KHIỂN MODAL CÀI ĐẶT ĐỒ THỊ & THỂ TÍCH 3D (CÓ LIVE PREVIEW)
  // -------------------------------------------------------------
  let currentEditingWidget = null;
  let onApplyCallback = null;
  let spinAnimationId = null;
  let modalPreviewMode = '2d'; // '2d' hoặc '3d'

  function setModalPreviewMode(mode) {
    modalPreviewMode = mode === '3d' ? '3d' : '2d';
    const btn2D = document.getElementById('btn-preview-mode-2d');
    const btn3D = document.getElementById('btn-preview-mode-3d');
    const hint3D = document.getElementById('preview-3d-hint');
    if (btn2D) btn2D.classList.toggle('active', modalPreviewMode === '2d');
    if (btn3D) btn3D.classList.toggle('active', modalPreviewMode === '3d');
    if (hint3D) hint3D.style.display = modalPreviewMode === '3d' ? 'block' : 'none';
    renderModalLivePreview();
  }

  function syncDraftStateFromModalInputs() {
    if (!currentEditingWidget) return;
    const inputScale = document.getElementById('input-graph-scale');
    const chkGrid = document.getElementById('chk-graph-grid');
    const chkAxes = document.getElementById('chk-graph-axes');
    if (inputScale) currentEditingWidget.scale = parseInt(inputScale.value, 10) || 36;
    if (chkGrid) currentEditingWidget.showGrid = chkGrid.checked;
    if (chkAxes) currentEditingWidget.showAxes = chkAxes.checked;

    // Đồng bộ cấu hình Diện tích (S) & Thể tích (V)
    const chkAreaEnable = document.getElementById('chk-area-enable');
    const activePill = document.querySelector('#group-area-func-count .btn-pill-choice.active');
    const funcCount = activePill ? parseInt(activePill.getAttribute('data-count'), 10) || 1 : 1;
    const activeCalcAxisBtn = document.querySelector('.btn-calc-axis.active');
    const chkFill = document.getElementById('chk-area-draw-fill');
    const chkLines = document.getElementById('chk-area-draw-lines');
    const chkBadge = document.getElementById('chk-area-draw-badge');

    let boundMode = 'auto';
    let customA = 0, customB = 2;
    let f1Expr = '', f2Expr = '', f3Expr = '';
    const funcs = currentEditingWidget.functions || [];

    if (funcCount === 1) {
      const sel1f = document.getElementById('select-area-1f');
      const idx = sel1f ? parseInt(sel1f.value, 10) || 0 : 0;
      f1Expr = funcs[idx] ? funcs[idx].expr : 'x^2';
      const inA = document.getElementById('input-area-1f-a');
      const inB = document.getElementById('input-area-1f-b');
      customA = inA ? parseFloat(inA.value) || 0 : 0;
      customB = inB ? parseFloat(inB.value) || 2 : 2;
      boundMode = 'manual';
    } else if (funcCount === 2) {
      const sel2f1 = document.getElementById('select-area-2f-1');
      const sel2f2 = document.getElementById('select-area-2f-2');
      const idx1 = sel2f1 ? parseInt(sel2f1.value, 10) || 0 : 0;
      const idx2 = sel2f2 ? parseInt(sel2f2.value, 10) || 0 : 0;
      f1Expr = funcs[idx1] ? funcs[idx1].expr : 'x^2';
      f2Expr = funcs[idx2] ? funcs[idx2].expr : 'x';
      const rAuto = document.querySelector('input[name="radio-area-2f-bound"][value="auto"]');
      boundMode = rAuto && rAuto.checked ? 'auto' : 'manual';
      const inA = document.getElementById('input-area-2f-a');
      const inB = document.getElementById('input-area-2f-b');
      customA = inA ? parseFloat(inA.value) || 0 : 0;
      customB = inB ? parseFloat(inB.value) || 2 : 2;
    } else if (funcCount === 3) {
      const sel3f1 = document.getElementById('select-area-3f-1');
      const sel3f2 = document.getElementById('select-area-3f-2');
      const sel3f3 = document.getElementById('select-area-3f-3');
      const idx1 = sel3f1 ? parseInt(sel3f1.value, 10) || 0 : 0;
      const idx2 = sel3f2 ? parseInt(sel3f2.value, 10) || 0 : 0;
      const idx3 = sel3f3 ? parseInt(sel3f3.value, 10) || 0 : 0;
      f1Expr = funcs[idx1] ? funcs[idx1].expr : 'x^2';
      f2Expr = funcs[idx2] ? funcs[idx2].expr : '2-x';
      f3Expr = funcs[idx3] ? funcs[idx3].expr : '-x';
      const rAuto = document.querySelector('input[name="radio-area-3f-bound"][value="auto"]');
      boundMode = rAuto && rAuto.checked ? 'auto' : 'manual';
      const inA = document.getElementById('input-area-3f-a');
      const inB = document.getElementById('input-area-3f-b');
      customA = inA ? parseFloat(inA.value) || 0 : 0;
      customB = inB ? parseFloat(inB.value) || 3 : 3;
    }

    currentEditingWidget.areaCalc = {
      enabled: chkAreaEnable ? chkAreaEnable.checked : true,
      funcCount: funcCount,
      func1: f1Expr,
      func2: f2Expr,
      func3: f3Expr,
      boundMode: boundMode,
      a: customA,
      b: customB,
      axis: activeCalcAxisBtn ? activeCalcAxisBtn.getAttribute('data-axis') : 'Ox',
      drawFill: chkFill ? chkFill.checked : true,
      drawLines: chkLines ? chkLines.checked : true,
      showBadge: chkBadge ? chkBadge.checked : true
    };

    // Đồng bộ cấu hình Mô phỏng 3D
    const chkRev = document.getElementById('chk-rev-enable');
    const selRevFunc = document.getElementById('select-rev-func');
    const selRevFunc2 = document.getElementById('select-rev-func2');
    const activeAxisBtn = document.querySelector('.btn-rev-axis.active');
    const inputOxMin = document.getElementById('input-rev-ox-min');
    const inputOxMax = document.getElementById('input-rev-ox-max');
    const inputOyMin = document.getElementById('input-rev-oy-min');
    const inputOyMax = document.getElementById('input-rev-oy-max');
    const inputAngle = document.getElementById('input-rev-angle');
    const inputTilt = document.getElementById('input-rev-tilt');
    const chkSlice = document.getElementById('chk-rev-show-slice');
    const activeSpeedBtn = document.querySelector('.btn-rev-speed.active');
    const chkLoop = document.getElementById('chk-rev-loop');

    if (!currentEditingWidget.revolution3D) {
      currentEditingWidget.revolution3D = {};
    }
    currentEditingWidget.revolution3D.enabled = chkRev ? chkRev.checked : false;
    currentEditingWidget.revolution3D.funcIndex = selRevFunc ? parseInt(selRevFunc.value, 10) || 0 : 0;
    currentEditingWidget.revolution3D.func2Index = selRevFunc2 ? parseInt(selRevFunc2.value, 10) : -1;
    currentEditingWidget.revolution3D.axis = activeAxisBtn ? activeAxisBtn.getAttribute('data-axis') : 'Ox';

    const oxMin = inputOxMin && inputOxMin.value !== '' ? parseFloat(inputOxMin.value) : 0;
    const oxMax = inputOxMax && inputOxMax.value !== '' ? parseFloat(inputOxMax.value) : 2.5;
    const oyMin = inputOyMin && inputOyMin.value !== '' ? parseFloat(inputOyMin.value) : -2;
    const oyMax = inputOyMax && inputOyMax.value !== '' ? parseFloat(inputOyMax.value) : 3;

    currentEditingWidget.revolution3D.rangeX = [isNaN(oxMin) ? 0 : oxMin, isNaN(oxMax) ? 2.5 : oxMax];
    currentEditingWidget.revolution3D.rangeY = [isNaN(oyMin) ? -2 : oyMin, isNaN(oyMax) ? 3 : oyMax];
    currentEditingWidget.revolution3D.range = currentEditingWidget.revolution3D.axis === 'Ox'
      ? [currentEditingWidget.revolution3D.rangeX[0], currentEditingWidget.revolution3D.rangeX[1]]
      : [Math.max(0, currentEditingWidget.revolution3D.rangeX[0]), Math.max(currentEditingWidget.revolution3D.rangeX[0] + 0.1, currentEditingWidget.revolution3D.rangeX[1])];
    currentEditingWidget.revolution3D.angleDeg = inputAngle ? parseFloat(inputAngle.value) || 0 : 0;
    currentEditingWidget.revolution3D.tiltDeg = inputTilt ? parseFloat(inputTilt.value) || 28 : 28;
    currentEditingWidget.revolution3D.showSlice = chkSlice ? chkSlice.checked : true;
    currentEditingWidget.revolution3D.speed = activeSpeedBtn ? parseFloat(activeSpeedBtn.getAttribute('data-speed')) || 1.0 : 1.0;
    currentEditingWidget.revolution3D.isLoop = chkLoop ? chkLoop.checked : true;
  }

  function renderModalLivePreview() {
    if (!currentEditingWidget) return;
    const previewCanvas = document.getElementById('graph-modal-preview-canvas');
    if (!previewCanvas || typeof previewCanvas.getContext !== 'function') return;
    const pCtx = previewCanvas.getContext('2d');
    if (!pCtx) return;

    syncDraftStateFromModalInputs();

    const pw = previewCanvas.width || 360;
    const ph = previewCanvas.height || 320;
    pCtx.clearRect(0, 0, pw, ph);

    const previewScale = Math.max(16, Math.min(54, Math.round((currentEditingWidget.scale || 36) * 0.78)));
    const tempWidget = {
      ...currentEditingWidget,
      x: 0,
      y: 0,
      width: pw,
      height: ph,
      origin: { x: Math.round(pw * 0.45), y: Math.round(ph * 0.54) },
      scale: previewScale
    };

    const summaryEl = document.getElementById('preview-live-summary');
    if (modalPreviewMode === '3d') {
      drawSolidOfRevolution3D(pCtx, tempWidget, true);
      if (summaryEl) {
        const rev = tempWidget.revolution3D || {};
        const ax = rev.axis || 'Ox';
        const ang = Math.round(rev.angleDeg || 0);
        summaryEl.textContent = `🔄 Mô phỏng 3D quanh trục ${ax} — Góc quét: ${ang}° / 360° (Nghiêng ${Math.round(rev.tiltDeg || 28)}°)`;
      }
    } else {
      drawGraph2D(pCtx, tempWidget);
      if (summaryEl) {
        const fCount = (tempWidget.functions || []).filter(f => f && f.visible !== false).length;
        summaryEl.textContent = `📊 Đang hiển thị ${fCount} đồ thị hàm số trên hệ trục Oxy`;
      }
    }
  }

  function initGraphSettingsUI() {
    const modalEl = document.getElementById('modal-graph-settings');
    if (!modalEl) return;

    // Chuyển Tab (tự động chuyển khung Xem trước sang 3D khi bấm vào Tab 4)
    const tabBtns = modalEl.querySelectorAll('.graph-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetTabId = btn.getAttribute('data-tab');
        modalEl.querySelectorAll('.graph-tab-content').forEach(c => c.classList.remove('active'));
        const targetContent = document.getElementById(targetTabId);
        if (targetContent) targetContent.classList.add('active');
        if (targetTabId === 'tab-graph-revolution') {
          setModalPreviewMode('3d');
        } else {
          setModalPreviewMode('2d');
        }
      });
    });

    // Nút chuyển chế độ xem trước 2D / 3D ở cột phải
    const btnPrev2D = document.getElementById('btn-preview-mode-2d');
    const btnPrev3D = document.getElementById('btn-preview-mode-3d');
    if (btnPrev2D) btnPrev2D.addEventListener('click', () => setModalPreviewMode('2d'));
    if (btnPrev3D) btnPrev3D.addEventListener('click', () => setModalPreviewMode('3d'));

    // Kéo chuột trực tiếp trên Canvas Preview 3D để đổi góc nghiêng 3D & góc quét
    const previewCanvas = document.getElementById('graph-modal-preview-canvas');
    if (previewCanvas) {
      let isDraggingPreview = false;
      let lastPreviewPt = null;
      previewCanvas.addEventListener('pointerdown', (ev) => {
        isDraggingPreview = true;
        lastPreviewPt = { x: ev.clientX, y: ev.clientY };
      });
      previewCanvas.addEventListener('pointermove', (ev) => {
        if (!isDraggingPreview || !lastPreviewPt || !currentEditingWidget) return;
        const dx = ev.clientX - lastPreviewPt.x;
        const dy = ev.clientY - lastPreviewPt.y;
        lastPreviewPt = { x: ev.clientX, y: ev.clientY };
        if (modalPreviewMode === '3d') {
          const inputTilt = document.getElementById('input-rev-tilt');
          const labelTilt = document.getElementById('label-rev-tilt');
          const curTilt = inputTilt ? (parseFloat(inputTilt.value) || 28) : 28;
          const nextTilt = Math.max(12, Math.min(55, Math.round(curTilt + dy * 0.35)));
          if (inputTilt) inputTilt.value = nextTilt;
          if (labelTilt) labelTilt.textContent = nextTilt + '°';

          const inputAngle = document.getElementById('input-rev-angle');
          const labelAngle = document.getElementById('label-rev-angle');
          if (inputAngle && Math.abs(dx) > 1) {
            const curAng = parseFloat(inputAngle.value) || 0;
            const nextAng = Math.max(0, Math.min(360, Math.round(curAng + dx * 0.8)));
            inputAngle.value = nextAng;
            if (labelAngle) labelAngle.textContent = nextAng + '° / 360°';
          }
          renderModalLivePreview();
        }
      });
      previewCanvas.addEventListener('pointerup', () => { isDraggingPreview = false; });
      previewCanvas.addEventListener('pointerleave', () => { isDraggingPreview = false; });
    }

    // Đóng Modal
    const btnClose = document.getElementById('btn-close-graph-modal');
    const btnCancel = document.getElementById('btn-cancel-graph-modal');
    if (btnClose) btnClose.addEventListener('click', closeGraphModal);
    if (btnCancel) btnCancel.addEventListener('click', closeGraphModal);

    // Dải nút Mẫu hàm số nhanh 1 chạm
    modalEl.querySelectorAll('.btn-func-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!currentEditingWidget) return;
        const expr = btn.getAttribute('data-expr') || 'x^2';
        const rMin = parseFloat(btn.getAttribute('data-min'));
        const rMax = parseFloat(btn.getAttribute('data-max'));
        if (!currentEditingWidget.functions || currentEditingWidget.functions.length === 0) {
          currentEditingWidget.functions = [{
            id: 'fn_' + Date.now(),
            expr: expr,
            color: '#28634e',
            width: 2.5,
            dash: 'solid',
            range: [!isNaN(rMin) ? rMin : -3, !isNaN(rMax) ? rMax : 3],
            visible: true
          }];
        } else {
          currentEditingWidget.functions[0].expr = expr;
          if (!isNaN(rMin) && !isNaN(rMax)) {
            currentEditingWidget.functions[0].range = [rMin, rMax];
          }
        }
        const inOxMin = document.getElementById('input-rev-ox-min');
        const inOxMax = document.getElementById('input-rev-ox-max');
        if (inOxMin && !isNaN(rMin)) inOxMin.value = Math.max(0, rMin);
        if (inOxMax && !isNaN(rMax)) inOxMax.value = rMax;
        renderFuncsList();
        updateRevolutionFuncSelect();
        updateAreaVolumeTabUI();
        renderModalLivePreview();
      });
    });

    // Nút Thêm hàm số
    const btnAddFunc = document.getElementById('btn-add-graph-func');
    if (btnAddFunc) {
      btnAddFunc.addEventListener('click', () => {
        if (!currentEditingWidget) return;
        const newIdx = (currentEditingWidget.functions ? currentEditingWidget.functions.length : 0) + 1;
        const defaultColors = ['#28634e', '#537fc1', '#cf7969', '#b6a24c', '#8b5cf6'];
        const color = defaultColors[(newIdx - 1) % defaultColors.length];
        const newFn = {
          id: 'fn_' + Date.now(),
          expr: newIdx === 2 ? '2 - x' : 'sin(x)',
          color: color,
          width: 2.2,
          dash: 'solid',
          range: [-4, 4],
          visible: true
        };
        if (!currentEditingWidget.functions) currentEditingWidget.functions = [];
        currentEditingWidget.functions.push(newFn);
        renderFuncsList();
        updateRevolutionFuncSelect();
        updateAreaVolumeTabUI();
        renderModalLivePreview();
      });
    }

    // Nút Gợi ý tự động tìm điểm Ox, Oy
    const btnFindAxes = document.getElementById('btn-find-axes-points');
    if (btnFindAxes) {
      btnFindAxes.addEventListener('click', () => {
        if (!currentEditingWidget || !currentEditingWidget.functions || currentEditingWidget.functions.length === 0) return;
        const f0 = currentEditingWidget.functions[0];
        const found = autoFindSpecialPoints(f0.expr, f0.range);
        const axesOnly = found.filter(p => p.x === 0 || p.y === 0);
        if (!currentEditingWidget.specialPoints) currentEditingWidget.specialPoints = [];
        for (const pt of axesOnly) {
          if (!currentEditingWidget.specialPoints.some(ep => Math.abs(ep.x - pt.x) < 0.05 && Math.abs(ep.y - pt.y) < 0.05)) {
            currentEditingWidget.specialPoints.push(pt);
          }
        }
        renderSpecialPointsList();
        renderModalLivePreview();
      });
    }

    // Nút Gợi ý tìm cực trị
    const btnFindExtrema = document.getElementById('btn-find-extrema');
    if (btnFindExtrema) {
      btnFindExtrema.addEventListener('click', () => {
        if (!currentEditingWidget || !currentEditingWidget.functions || currentEditingWidget.functions.length === 0) return;
        const f0 = currentEditingWidget.functions[0];
        const found = autoFindSpecialPoints(f0.expr, f0.range);
        const extremaOnly = found.filter(p => p.label && (p.label.includes('CĐ') || p.label.includes('CT')));
        if (!currentEditingWidget.specialPoints) currentEditingWidget.specialPoints = [];
        for (const pt of extremaOnly) {
          if (!currentEditingWidget.specialPoints.some(ep => Math.abs(ep.x - pt.x) < 0.05 && Math.abs(ep.y - pt.y) < 0.05)) {
            currentEditingWidget.specialPoints.push(pt);
          }
        }
        renderSpecialPointsList();
        renderModalLivePreview();
      });
    }

    // Nút Tìm giao điểm giữa 2 đồ thị
    const btnFindInters = document.getElementById('btn-find-intersections-pts');
    if (btnFindInters) {
      btnFindInters.addEventListener('click', () => {
        if (!currentEditingWidget || !currentEditingWidget.functions || currentEditingWidget.functions.length < 2) return;
        const f0 = currentEditingWidget.functions[0];
        const f1 = currentEditingWidget.functions[1];
        const inters = findTwoFunctionsIntersections(f0.expr, f1.expr);
        if (!currentEditingWidget.specialPoints) currentEditingWidget.specialPoints = [];
        inters.forEach((pt, idx) => {
          const rx = Math.round(pt.x * 100) / 100;
          const ry = Math.round(pt.y * 100) / 100;
          if (!currentEditingWidget.specialPoints.some(ep => Math.abs(ep.x - rx) < 0.05 && Math.abs(ep.y - ry) < 0.05)) {
            currentEditingWidget.specialPoints.push({
              x: rx,
              y: ry,
              label: `M${idx + 1}(${rx}; ${ry})`,
              showProjection: true,
              color: '#dc2626'
            });
          }
        });
        renderSpecialPointsList();
        renderModalLivePreview();
      });
    }

    // Xóa hết điểm
    const btnClearPoints = document.getElementById('btn-clear-all-points');
    if (btnClearPoints) {
      btnClearPoints.addEventListener('click', () => {
        if (!currentEditingWidget) return;
        currentEditingWidget.specialPoints = [];
        renderSpecialPointsList();
        renderModalLivePreview();
      });
    }

    // Thêm điểm đặc biệt thủ công
    const btnAddPoint = document.getElementById('btn-add-custom-point');
    if (btnAddPoint) {
      btnAddPoint.addEventListener('click', () => {
        if (!currentEditingWidget) return;
        if (!currentEditingWidget.specialPoints) currentEditingWidget.specialPoints = [];
        currentEditingWidget.specialPoints.push({
          x: 1,
          y: 1,
          label: 'A(1; 1)',
          showProjection: true,
          color: '#cf7969'
        });
        renderSpecialPointsList();
        renderModalLivePreview();
      });
    }

    // Điều khiển Tab 4: Thể tích 3D
    const chkRevEnable = document.getElementById('chk-rev-enable');
    const revControls = document.getElementById('graph-rev-controls');
    if (chkRevEnable && revControls) {
      chkRevEnable.addEventListener('change', () => {
        revControls.style.opacity = chkRevEnable.checked ? '1' : '0.6';
        revControls.style.pointerEvents = 'auto';
        if (chkRevEnable.checked) setModalPreviewMode('3d');
        updateVolumeFormula();
        renderModalLivePreview();
      });
    }

    const selRevFunc = document.getElementById('select-rev-func');
    const selRevFunc2 = document.getElementById('select-rev-func2');
    if (selRevFunc) selRevFunc.addEventListener('change', () => { updateVolumeFormula(); renderModalLivePreview(); });
    if (selRevFunc2) selRevFunc2.addEventListener('change', () => { updateVolumeFormula(); renderModalLivePreview(); });

    // Nút chọn trục Ox / Oy
    const axisBtns = modalEl.querySelectorAll('.btn-rev-axis');
    axisBtns.forEach(b => {
      b.addEventListener('click', () => {
        axisBtns.forEach(btn => btn.classList.remove('active'));
        b.classList.add('active');
        setModalPreviewMode('3d');
        updateVolumeFormula();
        renderModalLivePreview();
      });
    });

    // Thay đổi cận quay [a, b]
    const inputRevOxMin = document.getElementById('input-rev-ox-min');
    const inputRevOxMax = document.getElementById('input-rev-ox-max');
    const inputRevOyMin = document.getElementById('input-rev-oy-min');
    const inputRevOyMax = document.getElementById('input-rev-oy-max');
    if (inputRevOxMin) inputRevOxMin.addEventListener('input', () => { updateVolumeFormula(); renderModalLivePreview(); });
    if (inputRevOxMax) inputRevOxMax.addEventListener('input', () => { updateVolumeFormula(); renderModalLivePreview(); });
    if (inputRevOyMin) inputRevOyMin.addEventListener('input', () => { updateVolumeFormula(); renderModalLivePreview(); });
    if (inputRevOyMax) inputRevOyMax.addEventListener('input', () => { updateVolumeFormula(); renderModalLivePreview(); });

    // Nút đồng bộ cận tự động cho Khối tròn xoay 3D
    const btnRevAutoBounds = document.getElementById('btn-rev-auto-bounds');
    if (btnRevAutoBounds) {
      btnRevAutoBounds.addEventListener('click', () => {
        if (!currentEditingWidget || !currentEditingWidget.functions) return;
        const f1Idx = selRevFunc ? parseInt(selRevFunc.value, 10) || 0 : 0;
        const f2Idx = selRevFunc2 ? parseInt(selRevFunc2.value, 10) : -1;
        const f1 = currentEditingWidget.functions[f1Idx];
        const f2 = f2Idx >= 0 ? currentEditingWidget.functions[f2Idx] : null;
        if (!f1 || !f1.expr) return;
        if (f2 && f2.expr) {
          const inters = findTwoFunctionsIntersections(f1.expr, f2.expr);
          if (inters.length >= 2) {
            if (inputRevOxMin) inputRevOxMin.value = inters[0].x;
            if (inputRevOxMax) inputRevOxMax.value = inters[1].x;
          }
        } else {
          const roots = findFunctionRoots(f1.expr);
          if (roots.length >= 2) {
            if (inputRevOxMin) inputRevOxMin.value = roots[0];
            if (inputRevOxMax) inputRevOxMax.value = roots[roots.length - 1];
          } else if (roots.length === 1) {
            if (inputRevOxMin) inputRevOxMin.value = Math.max(0, roots[0]);
            if (inputRevOxMax) inputRevOxMax.value = Number((roots[0] + 2).toFixed(2));
          }
        }
        updateVolumeFormula();
        renderModalLivePreview();
      });
    }

    // Góc nghiêng 3D & Lát cắt vi phân mẫu
    const inputRevTilt = document.getElementById('input-rev-tilt');
    const labelRevTilt = document.getElementById('label-rev-tilt');
    const chkRevSlice = document.getElementById('chk-rev-show-slice');
    if (inputRevTilt) {
      inputRevTilt.addEventListener('input', () => {
        if (labelRevTilt) labelRevTilt.textContent = inputRevTilt.value + '°';
        setModalPreviewMode('3d');
        renderModalLivePreview();
      });
    }
    if (chkRevSlice) {
      chkRevSlice.addEventListener('change', () => {
        setModalPreviewMode('3d');
        renderModalLivePreview();
      });
    }

    // Nút tốc độ xoay từ từ (0.5x, 1.0x, 2.0x)
    let currentAnimSpeed = 1.0;
    const speedBtns = modalEl.querySelectorAll('.btn-rev-speed');
    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentAnimSpeed = parseFloat(btn.getAttribute('data-speed')) || 1.0;
        if (currentEditingWidget && currentEditingWidget.revolution3D) {
          currentEditingWidget.revolution3D.speed = currentAnimSpeed;
        }
      });
    });

    // Slider góc quay 3D
    const inputRevAngle = document.getElementById('input-rev-angle');
    const labelRevAngle = document.getElementById('label-rev-angle');
    if (inputRevAngle && labelRevAngle) {
      inputRevAngle.addEventListener('input', () => {
        labelRevAngle.textContent = inputRevAngle.value + '° / 360°';
        if (chkRevEnable && !chkRevEnable.checked) {
          chkRevEnable.checked = true;
          if (revControls) revControls.style.opacity = '1';
        }
        setModalPreviewMode('3d');
        renderModalLivePreview();
      });
    }

    // Nút điều khiển chuyển động xoay: Bắt đầu, Tạm dừng, Về 0°, Trọn 360°
    const btnRevPlay = document.getElementById('btn-rev-play');
    const btnRevPause = document.getElementById('btn-rev-pause');
    const btnRevReset = document.getElementById('btn-rev-reset');
    const btnRevFull360 = document.getElementById('btn-rev-full360');
    const chkRevLoop = document.getElementById('chk-rev-loop');

    function stopModalSpin() {
      if (spinAnimationId) {
        cancelAnimationFrame(spinAnimationId);
        spinAnimationId = null;
      }
      if (btnRevPlay) btnRevPlay.style.display = 'inline-flex';
      if (btnRevPause) btnRevPause.style.display = 'none';
    }

    if (btnRevPlay) {
      btnRevPlay.addEventListener('click', () => {
        if (!inputRevAngle) return;
        if (chkRevEnable && !chkRevEnable.checked) {
          chkRevEnable.checked = true;
          if (revControls) revControls.style.opacity = '1';
        }
        setModalPreviewMode('3d');
        btnRevPlay.style.display = 'none';
        if (btnRevPause) btnRevPause.style.display = 'inline-flex';

        let currentAngle = parseFloat(inputRevAngle.value) || 0;
        if (currentAngle >= 360) currentAngle = 0;

        const loopSpin = () => {
          const step = 1.2 * currentAnimSpeed;
          currentAngle += step;

          if (currentAngle >= 360) {
            if (chkRevLoop && chkRevLoop.checked) {
              currentAngle = 0;
            } else {
              currentAngle = 360;
              inputRevAngle.value = 360;
              if (labelRevAngle) labelRevAngle.textContent = '360° / 360°';
              renderModalLivePreview();
              stopModalSpin();
              return;
            }
          }

          inputRevAngle.value = Math.round(currentAngle);
          if (labelRevAngle) labelRevAngle.textContent = Math.round(currentAngle) + '° / 360°';
          renderModalLivePreview();
          spinAnimationId = requestAnimationFrame(loopSpin);
        };

        if (spinAnimationId) cancelAnimationFrame(spinAnimationId);
        spinAnimationId = requestAnimationFrame(loopSpin);
      });
    }

    if (btnRevPause) {
      btnRevPause.addEventListener('click', stopModalSpin);
    }

    if (btnRevReset) {
      btnRevReset.addEventListener('click', () => {
        stopModalSpin();
        if (inputRevAngle) inputRevAngle.value = 0;
        if (labelRevAngle) labelRevAngle.textContent = '0° / 360°';
        setModalPreviewMode('3d');
        renderModalLivePreview();
      });
    }

    if (btnRevFull360) {
      btnRevFull360.addEventListener('click', () => {
        stopModalSpin();
        if (chkRevEnable && !chkRevEnable.checked) {
          chkRevEnable.checked = true;
          if (revControls) revControls.style.opacity = '1';
        }
        if (inputRevAngle) inputRevAngle.value = 360;
        if (labelRevAngle) labelRevAngle.textContent = '360° / 360°';
        setModalPreviewMode('3d');
        renderModalLivePreview();
      });
    }

    // Scale slider & Grid/Axes checkboxes
    const inputScale = document.getElementById('input-graph-scale');
    const labelScale = document.getElementById('label-graph-scale');
    const chkGrid = document.getElementById('chk-graph-grid');
    const chkAxes = document.getElementById('chk-graph-axes');
    if (inputScale && labelScale) {
      inputScale.addEventListener('input', () => {
        labelScale.textContent = inputScale.value + 'px / đv';
        renderModalLivePreview();
      });
    }
    if (chkGrid) chkGrid.addEventListener('change', renderModalLivePreview);
    if (chkAxes) chkAxes.addEventListener('change', renderModalLivePreview);

    // ---------------------------------------------------------
    // SỰ KIỆN TAB DIỆN TÍCH (S) VÀ THỂ TÍCH (V)
    // ---------------------------------------------------------
    const chkAreaEnable = document.getElementById('chk-area-enable');
    const areaControls = document.getElementById('graph-area-controls');
    if (chkAreaEnable && areaControls) {
      chkAreaEnable.addEventListener('change', () => {
        areaControls.style.opacity = chkAreaEnable.checked ? '1' : '0.5';
        areaControls.style.pointerEvents = chkAreaEnable.checked ? 'auto' : 'none';
        updateAreaVolumeTabUI();
        renderModalLivePreview();
      });
    }

    // Nút chuyển số hàm: 1 hàm / 2 hàm / 3 hàm
    const pillBtns = modalEl.querySelectorAll('#group-area-func-count .btn-pill-choice');
    pillBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        pillBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateAreaVolumeTabUI();
        renderModalLivePreview();
      });
    });

    // Lắng nghe thay đổi select các hàm số
    ['select-area-1f', 'select-area-2f-1', 'select-area-2f-2', 'select-area-3f-1', 'select-area-3f-2', 'select-area-3f-3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => { updateAreaVolumeTabUI(); renderModalLivePreview(); });
    });

    // Lắng nghe thay đổi các ô nhập cận
    ['input-area-1f-a', 'input-area-1f-b', 'input-area-2f-a', 'input-area-2f-b', 'input-area-3f-a', 'input-area-3f-b'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => { updateAreaVolumeTabUI(); renderModalLivePreview(); });
    });

    // Lắng nghe radio cận tự động / cận thủ công
    modalEl.querySelectorAll('input[name="radio-area-2f-bound"], input[name="radio-area-3f-bound"]').forEach(r => {
      r.addEventListener('change', () => { updateAreaVolumeTabUI(); renderModalLivePreview(); });
    });

    ['chk-area-draw-fill', 'chk-area-draw-lines', 'chk-area-draw-badge'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', renderModalLivePreview);
    });

    // Nút [🎯 Giao trục Ox] tự động tìm nghiệm của f(x)=0 làm cận
    const btnRoots1f = document.getElementById('btn-area-1f-roots');
    if (btnRoots1f) {
      btnRoots1f.addEventListener('click', () => {
        const sel = document.getElementById('select-area-1f');
        const fIdx = sel ? parseInt(sel.value, 10) || 0 : 0;
        const fn = currentEditingWidget && currentEditingWidget.functions && currentEditingWidget.functions[fIdx];
        if (!fn || !fn.expr) return;

        const roots = findFunctionRoots(fn.expr);
        if (roots.length >= 2) {
          const inA = document.getElementById('input-area-1f-a');
          const inB = document.getElementById('input-area-1f-b');
          if (inA) inA.value = roots[0];
          if (inB) inB.value = roots[roots.length - 1];
          updateAreaVolumeTabUI();
          renderModalLivePreview();
        } else if (roots.length === 1) {
          const inA = document.getElementById('input-area-1f-a');
          const inB = document.getElementById('input-area-1f-b');
          if (inA) inA.value = roots[0];
          if (inB) inB.value = Number((roots[0] + 2).toFixed(2));
          updateAreaVolumeTabUI();
          renderModalLivePreview();
        }
      });
    }

    // Nút chuyển trục quay Thể tích (Ox, Oy)
    const calcAxisBtns = modalEl.querySelectorAll('.btn-calc-axis');
    calcAxisBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        calcAxisBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateAreaVolumeTabUI();
        renderModalLivePreview();
      });
    });

    // Nút Áp dụng vào Đồ thị
    const btnApply = document.getElementById('btn-apply-graph-modal');
    if (btnApply) {
      btnApply.addEventListener('click', applyGraphModalChanges);
    }
  }

  function renderFuncsList() {
    const listEl = document.getElementById('graph-funcs-list');
    if (!listEl || !currentEditingWidget) return;
    listEl.innerHTML = '';

    const funcs = currentEditingWidget.functions || [];
    funcs.forEach((fn, idx) => {
      const row = document.createElement('div');
      row.className = 'graph-func-row' + (fn.visible === false ? ' disabled' : '');

      row.innerHTML = `
        <input type="checkbox" class="chk-func-vis" title="Bật/Tắt hiển thị" ${fn.visible !== false ? 'checked' : ''}>
        <span class="func-prefix">y<sub>${idx + 1}</sub> =</span>
        <input type="text" class="func-input-expr" value="${fn.expr || ''}" placeholder="ví dụ: x^2 - 2*x - 1">
        <input type="color" class="func-color-picker" value="${fn.color || '#28634e'}" title="Màu đồ thị">
        <div class="func-range-wrap">
          <span>x &isin; [</span>
          <input type="number" step="0.5" class="func-input-range range-min" value="${(fn.range && fn.range[0] !== undefined) ? fn.range[0] : ''}" placeholder="-&infin;">
          <span>;</span>
          <input type="number" step="0.5" class="func-input-range range-max" value="${(fn.range && fn.range[1] !== undefined) ? fn.range[1] : ''}" placeholder="+&infin;">
          <span>]</span>
        </div>
        <button type="button" class="btn-func-del" title="Xóa hàm này">&times;</button>
      `;

      // Event handlers cho từng hàng
      const chkVis = row.querySelector('.chk-func-vis');
      const inputExpr = row.querySelector('.func-input-expr');
      const inputColor = row.querySelector('.func-color-picker');
      const rangeMin = row.querySelector('.range-min');
      const rangeMax = row.querySelector('.range-max');
      const btnDel = row.querySelector('.btn-func-del');

      chkVis.addEventListener('change', () => {
        fn.visible = chkVis.checked;
        row.classList.toggle('disabled', !fn.visible);
        renderModalLivePreview();
      });

      inputExpr.addEventListener('input', () => {
        fn.expr = inputExpr.value;
        updateRevolutionFuncSelect();
        updateAreaVolumeTabUI();
        renderModalLivePreview();
      });

      inputColor.addEventListener('input', () => {
        fn.color = inputColor.value;
        renderModalLivePreview();
      });

      rangeMin.addEventListener('input', () => {
        if (!fn.range) fn.range = [-5, 5];
        fn.range[0] = rangeMin.value !== '' ? parseFloat(rangeMin.value) : undefined;
        renderModalLivePreview();
      });

      rangeMax.addEventListener('input', () => {
        if (!fn.range) fn.range = [-5, 5];
        fn.range[1] = rangeMax.value !== '' ? parseFloat(rangeMax.value) : undefined;
        renderModalLivePreview();
      });

      btnDel.addEventListener('click', () => {
        if (currentEditingWidget.functions.length <= 1) {
          return;
        }
        currentEditingWidget.functions.splice(idx, 1);
        renderFuncsList();
        updateRevolutionFuncSelect();
        updateAreaVolumeTabUI();
        renderModalLivePreview();
      });

      listEl.appendChild(row);
    });
  }

  function renderSpecialPointsList() {
    const listEl = document.getElementById('graph-points-list');
    if (!listEl || !currentEditingWidget) return;
    listEl.innerHTML = '';

    const pts = currentEditingWidget.specialPoints || [];
    if (pts.length === 0) {
      listEl.innerHTML = '<div style="font-size: 11.5px; color: #888; font-style: italic; padding: 6px;">Chưa có điểm tọa độ đặc biệt nào. Bấm nút Gợi ý hoặc Thêm điểm để tạo.</div>';
      return;
    }

    pts.forEach((pt, idx) => {
      const row = document.createElement('div');
      row.className = 'graph-point-row';
      row.innerHTML = `
        <label><input type="checkbox" class="chk-pt-proj" ${pt.showProjection !== false ? 'checked' : ''} title="Hiện đường dóng nét đứt tới Ox, Oy"> Dóng trục</label>
        <span>x:</span>
        <input type="number" step="0.1" class="pt-input-coord pt-x" value="${pt.x}">
        <span>y:</span>
        <input type="number" step="0.1" class="pt-input-coord pt-y" value="${pt.y}">
        <input type="text" class="pt-input-label" value="${pt.label || ''}" placeholder="Nhãn điểm (ví dụ: A(1; 2))">
        <input type="color" class="func-color-picker pt-color" value="${pt.color || '#cf7969'}" title="Màu điểm">
        <button type="button" class="btn-func-del pt-del" title="Xóa điểm này">&times;</button>
      `;

      const chkProj = row.querySelector('.chk-pt-proj');
      const inputX = row.querySelector('.pt-x');
      const inputY = row.querySelector('.pt-y');
      const inputLbl = row.querySelector('.pt-input-label');
      const inputCol = row.querySelector('.pt-color');
      const btnDel = row.querySelector('.pt-del');

      chkProj.addEventListener('change', () => { pt.showProjection = chkProj.checked; renderModalLivePreview(); });
      inputX.addEventListener('input', () => { pt.x = parseFloat(inputX.value) || 0; renderModalLivePreview(); });
      inputY.addEventListener('input', () => { pt.y = parseFloat(inputY.value) || 0; renderModalLivePreview(); });
      inputLbl.addEventListener('input', () => { pt.label = inputLbl.value; renderModalLivePreview(); });
      inputCol.addEventListener('input', () => { pt.color = inputCol.value; renderModalLivePreview(); });
      btnDel.addEventListener('click', () => {
        currentEditingWidget.specialPoints.splice(idx, 1);
        renderSpecialPointsList();
        renderModalLivePreview();
      });

      listEl.appendChild(row);
    });
  }

  function updateRevolutionFuncSelect() {
    const sel = document.getElementById('select-rev-func');
    const sel2 = document.getElementById('select-rev-func2');
    if (!sel || !currentEditingWidget) return;
    const prev1 = sel.value;
    const prev2 = sel2 ? sel2.value : '-1';
    sel.innerHTML = '';
    if (sel2) {
      sel2.innerHTML = '<option value="-1">Trục tọa độ (y = 0)</option>';
    }
    const funcs = currentEditingWidget.functions || [];
    funcs.forEach((fn, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = `y${idx + 1} = ${fn.expr}`;
      sel.appendChild(opt);
      if (sel2) {
        const opt2 = document.createElement('option');
        opt2.value = idx;
        opt2.textContent = `y${idx + 1} = ${fn.expr}`;
        sel2.appendChild(opt2);
      }
    });
    if (prev1 !== '' && parseInt(prev1, 10) < funcs.length) {
      sel.value = prev1;
    } else if (currentEditingWidget.revolution3D && currentEditingWidget.revolution3D.funcIndex !== undefined) {
      sel.value = currentEditingWidget.revolution3D.funcIndex;
    }
    if (sel2) {
      if (prev2 !== '' && parseInt(prev2, 10) < funcs.length) {
        sel2.value = prev2;
      } else if (currentEditingWidget.revolution3D && currentEditingWidget.revolution3D.func2Index !== undefined) {
        sel2.value = currentEditingWidget.revolution3D.func2Index;
      }
    }
    updateVolumeFormula();
  }

  function updateVolumeFormula() {
    const sel = document.getElementById('select-rev-func');
    const sel2 = document.getElementById('select-rev-func2');
    const inputOxMin = document.getElementById('input-rev-ox-min');
    const inputOxMax = document.getElementById('input-rev-ox-max');
    const formulaText = document.getElementById('rev-formula-text');
    const volumeVal = document.getElementById('rev-volume-val');
    const axisBtn = document.querySelector('.btn-rev-axis.active');

    if (!formulaText || !volumeVal || !currentEditingWidget) return;

    const funcs = currentEditingWidget.functions || [];
    const fIdx = sel ? parseInt(sel.value, 10) || 0 : 0;
    const f2Idx = sel2 ? parseInt(sel2.value, 10) : -1;
    const fObj = funcs[fIdx];
    const f2Obj = (f2Idx >= 0 && funcs[f2Idx]) ? funcs[f2Idx] : null;
    const axis = axisBtn ? axisBtn.getAttribute('data-axis') : 'Ox';
    const isOy = (axis === 'Oy' || axis === 'oy');

    const oxMin = inputOxMin && inputOxMin.value !== '' ? parseFloat(inputOxMin.value) : 0;
    const oxMax = inputOxMax && inputOxMax.value !== '' ? parseFloat(inputOxMax.value) : 2.5;
    const rawMin = Math.min(isNaN(oxMin) ? 0 : oxMin, isNaN(oxMax) ? 2.5 : oxMax);
    const rawMax = Math.max(isNaN(oxMin) ? 0 : oxMin, isNaN(oxMax) ? 2.5 : oxMax);

    const a = isOy ? Math.max(0, rawMin) : rawMin;
    const b = isOy ? Math.max(a + 0.1, rawMax) : rawMax;

    if (!fObj || !fObj.expr) {
      formulaText.innerHTML = '---';
      volumeVal.textContent = 'Thể tích tính toán: V ≈ ---';
      return;
    }

    if (!isOy) {
      if (f2Obj && f2Obj.expr) {
        formulaText.innerHTML = `V<sub>Ox</sub> = &pi; &int;<sub>${a}</sub><sup>${b}</sup> |(${fObj.expr})<sup>2</sup> &minus; (${f2Obj.expr})<sup>2</sup>| dx`;
      } else {
        formulaText.innerHTML = `V<sub>Ox</sub> = &pi; &int;<sub>${a}</sub><sup>${b}</sup> [${fObj.expr}]<sup>2</sup> dx <span style="font-size: 11px; color: #5b21b6; font-weight: 600;">(Phương pháp Đĩa tròn quanh Ox)</span>`;
      }
    } else {
      if (f2Obj && f2Obj.expr) {
        formulaText.innerHTML = `V<sub>Oy</sub> = 2&pi; &int;<sub>${a}</sub><sup>${b}</sup> x &middot; |(${fObj.expr}) &minus; (${f2Obj.expr})| dx`;
      } else {
        formulaText.innerHTML = `V<sub>Oy</sub> = 2&pi; &int;<sub>${a}</sub><sup>${b}</sup> x &middot; |${fObj.expr}| dx <span style="font-size: 11px; color: #0284c7; font-weight: 600;">(Phương pháp Vỏ trụ quanh Oy)</span>`;
      }
    }

    const vol = calculateRevolutionVolume(fObj.expr, axis, a, b, f2Obj ? f2Obj.expr : null);
    if (vol !== null) {
      const piCoeff = Number((vol / Math.PI).toFixed(4));
      const decVal = Number(vol.toFixed(4));
      volumeVal.textContent = `Thể tích: V ≈ ${piCoeff}π ≈ ${decVal} (đơn vị thể tích)`;
    } else {
      volumeVal.textContent = 'Thể tích tính toán: Không thể tính trên khoảng này';
    }
  }

  // =============================================================
  // ĐỒNG BỘ VÀ TÍNH TOÁN TAB DIỆN TÍCH (S) & THỂ TÍCH (V)
  // =============================================================
  function updateAreaVolumeTabUI() {
    if (!currentEditingWidget) return;
    const funcs = currentEditingWidget.functions || [];

    const sel1f = document.getElementById('select-area-1f');
    const sel2f1 = document.getElementById('select-area-2f-1');
    const sel2f2 = document.getElementById('select-area-2f-2');
    const sel3f1 = document.getElementById('select-area-3f-1');
    const sel3f2 = document.getElementById('select-area-3f-2');
    const sel3f3 = document.getElementById('select-area-3f-3');

    const fillSelect = (sel, defaultIdx) => {
      if (!sel) return;
      const prevVal = sel.value;
      sel.innerHTML = '';
      funcs.forEach((fn, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = `y${idx + 1} = ${fn.expr}`;
        sel.appendChild(opt);
      });
      if (prevVal !== '' && parseInt(prevVal, 10) < funcs.length) {
        sel.value = prevVal;
      } else if (defaultIdx !== undefined && defaultIdx < funcs.length) {
        sel.value = defaultIdx;
      }
    };

    fillSelect(sel1f, 0);
    fillSelect(sel2f1, 0);
    fillSelect(sel2f2, Math.min(1, funcs.length - 1));
    fillSelect(sel3f1, 0);
    fillSelect(sel3f2, Math.min(1, funcs.length - 1));
    fillSelect(sel3f3, Math.min(2, funcs.length - 1));

    const activePill = document.querySelector('#group-area-func-count .btn-pill-choice.active');
    const funcCount = activePill ? parseInt(activePill.getAttribute('data-count'), 10) || 1 : 1;

    const sec1 = document.getElementById('area-sec-1func');
    const sec2 = document.getElementById('area-sec-2funcs');
    const sec3 = document.getElementById('area-sec-3funcs');
    if (sec1) sec1.style.display = funcCount === 1 ? 'block' : 'none';
    if (sec2) sec2.style.display = funcCount === 2 ? 'block' : 'none';
    if (sec3) sec3.style.display = funcCount === 3 ? 'block' : 'none';

    let boundMode = 'auto';
    let aVal = 0, bVal = 2;
    let expr1 = '', expr2 = '', expr3 = '';

    if (funcCount === 1) {
      const fIdx = sel1f ? parseInt(sel1f.value, 10) || 0 : 0;
      expr1 = funcs[fIdx] ? funcs[fIdx].expr : 'x^2';
      const inA = document.getElementById('input-area-1f-a');
      const inB = document.getElementById('input-area-1f-b');
      aVal = inA ? parseFloat(inA.value) || 0 : 0;
      bVal = inB ? parseFloat(inB.value) || 2 : 2;
      boundMode = 'manual';
    } else if (funcCount === 2) {
      const f1Idx = sel2f1 ? parseInt(sel2f1.value, 10) || 0 : 0;
      const f2Idx = sel2f2 ? parseInt(sel2f2.value, 10) || 0 : 0;
      expr1 = funcs[f1Idx] ? funcs[f1Idx].expr : 'x^2';
      expr2 = funcs[f2Idx] ? funcs[f2Idx].expr : 'x';

      const radioAuto = document.querySelector('input[name="radio-area-2f-bound"][value="auto"]');
      const isAuto = radioAuto ? radioAuto.checked : true;
      boundMode = isAuto ? 'auto' : 'manual';

      const infoBox = document.getElementById('area-2f-auto-info');
      const manualInputs = document.getElementById('area-2f-manual-inputs');
      const lblInfo = document.getElementById('label-area-2f-intersections');

      if (isAuto) {
        if (infoBox) infoBox.style.display = 'flex';
        if (manualInputs) manualInputs.style.display = 'none';

        const inters = findTwoFunctionsIntersections(expr1, expr2);
        if (inters.length >= 2) {
          aVal = inters[0].x;
          bVal = inters[1].x;
          if (lblInfo) {
            lblInfo.innerHTML = `Đã tìm thấy ${inters.length} giao điểm: <b>${inters.map(p => `(${p.x}; ${p.y})`).join(', ')}</b>. Cận [x₁ = ${aVal}; x₂ = ${bVal}].`;
          }
        } else if (inters.length === 1) {
          aVal = inters[0].x;
          bVal = inters[0].x + 2;
          if (lblInfo) {
            lblInfo.innerHTML = `⚠️ Chỉ có 1 giao điểm tại (${inters[0].x}; ${inters[0].y}). Hãy chọn "Tự nhập 2 cận x = a và x = b".`;
          }
        } else {
          if (lblInfo) {
            lblInfo.innerHTML = `⚠️ Hai đồ thị không cắt nhau trên miền khảo sát. Hãy chọn "Tự nhập 2 cận x = a và x = b".`;
          }
        }
      } else {
        if (infoBox) infoBox.style.display = 'none';
        if (manualInputs) manualInputs.style.display = 'flex';
        const inA = document.getElementById('input-area-2f-a');
        const inB = document.getElementById('input-area-2f-b');
        aVal = inA ? parseFloat(inA.value) || 0 : 0;
        bVal = inB ? parseFloat(inB.value) || 2 : 2;
      }
    } else if (funcCount === 3) {
      const f1Idx = sel3f1 ? parseInt(sel3f1.value, 10) || 0 : 0;
      const f2Idx = sel3f2 ? parseInt(sel3f2.value, 10) || 0 : 0;
      const f3Idx = sel3f3 ? parseInt(sel3f3.value, 10) || 0 : 0;
      expr1 = funcs[f1Idx] ? funcs[f1Idx].expr : 'x^2';
      expr2 = funcs[f2Idx] ? funcs[f2Idx].expr : '2-x';
      expr3 = funcs[f3Idx] ? funcs[f3Idx].expr : '-x';

      const radioAuto = document.querySelector('input[name="radio-area-3f-bound"][value="auto"]');
      const isAuto = radioAuto ? radioAuto.checked : true;
      boundMode = isAuto ? 'auto' : 'manual';

      const infoBox = document.getElementById('area-3f-auto-info');
      const manualInputs = document.getElementById('area-3f-manual-inputs');
      const lblInfo = document.getElementById('label-area-3f-intersections');

      if (isAuto) {
        if (infoBox) infoBox.style.display = 'flex';
        if (manualInputs) manualInputs.style.display = 'none';

        const p12 = findTwoFunctionsIntersections(expr1, expr2);
        const p23 = findTwoFunctionsIntersections(expr2, expr3);
        const p31 = findTwoFunctionsIntersections(expr3, expr1);
        if (p12.length > 0 && p23.length > 0 && p31.length > 0) {
          const tri = [p12[0], p23[0], p31[0]].sort((u, v) => u.x - v.x);
          aVal = tri[0].x;
          bVal = tri[2].x;
          if (lblInfo) {
            lblInfo.innerHTML = `Đã tìm thấy 3 đỉnh miền kín: <b>${tri.map(p => `(${p.x}; ${p.y})`).join(', ')}</b>.`;
          }
        } else {
          if (lblInfo) {
            lblInfo.innerHTML = `⚠️ Không tìm đủ 3 giao điểm tạo thành miền kín tam giác cong. Hãy chọn "Tự nhập 2 cận".`;
          }
        }
      } else {
        if (infoBox) infoBox.style.display = 'none';
        if (manualInputs) manualInputs.style.display = 'flex';
        const inA = document.getElementById('input-area-3f-a');
        const inB = document.getElementById('input-area-3f-b');
        aVal = inA ? parseFloat(inA.value) || 0 : 0;
        bVal = inB ? parseFloat(inB.value) || 3 : 3;
      }
    }

    const activeAxisBtn = document.querySelector('.btn-calc-axis.active');
    const axis = activeAxisBtn ? activeAxisBtn.getAttribute('data-axis') : 'Ox';

    const formulaArea = document.getElementById('area-formula-display');
    const valArea = document.getElementById('area-value-display');
    const formulaVol = document.getElementById('volume-formula-display');
    const valVol = document.getElementById('volume-value-display');

    const res = calculateAreaAndVolumeDetailed({
      funcCount: funcCount,
      expr1: expr1,
      expr2: expr2,
      expr3: expr3,
      boundMode: boundMode,
      customA: aVal,
      customB: bVal,
      axis: axis
    });

    if (res && res.success) {
      if (formulaArea) formulaArea.innerHTML = res.areaFormula;
      if (valArea) {
        valArea.textContent = `S ≈ ${Number(res.area.toFixed(4))} (đvdt)`;
        valArea.style.color = '#047857';
      }
      if (formulaVol) formulaVol.innerHTML = res.volumeFormula;
      if (valVol) {
        if (res.volume !== null) {
          const piC = Number((res.volume / Math.PI).toFixed(4));
          valVol.textContent = `V ≈ ${piC}π ≈ ${Number(res.volume.toFixed(4))} (đvtt)`;
        } else {
          valVol.textContent = 'Không thể tính trên khoảng này';
        }
        valVol.style.color = '#047857';
      }
    } else {
      if (valArea) {
        valArea.textContent = res ? res.error : 'Không thể tính toán';
        valArea.style.color = '#b91c1c';
      }
      if (valVol) {
        valVol.textContent = '---';
        valVol.style.color = '#b91c1c';
      }
    }
  }

  function openGraphSettingsModal(widget, callback, initialTab = null) {
    if (!widget) return;
    currentEditingWidget = JSON.parse(JSON.stringify(widget)); // Clone sâu để thao tác an toàn
    onApplyCallback = callback;

    const modalEl = document.getElementById('modal-graph-settings');
    if (!modalEl) return;

    const targetTab = initialTab || (currentEditingWidget.revolution3D && currentEditingWidget.revolution3D.enabled ? 'tab-graph-revolution' : 'tab-graph-funcs');
    modalEl.querySelectorAll('.graph-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === targetTab);
    });
    modalEl.querySelectorAll('.graph-tab-content').forEach(c => {
      c.classList.toggle('active', c.id === targetTab);
    });

    // Đổ dữ liệu Tab 1
    renderFuncsList();
    const inputScale = document.getElementById('input-graph-scale');
    const labelScale = document.getElementById('label-graph-scale');
    const chkGrid = document.getElementById('chk-graph-grid');
    const chkAxes = document.getElementById('chk-graph-axes');

    if (inputScale) inputScale.value = currentEditingWidget.scale || 36;
    if (labelScale) labelScale.textContent = (currentEditingWidget.scale || 36) + 'px / đv';
    if (chkGrid) chkGrid.checked = currentEditingWidget.showGrid !== false;
    if (chkAxes) chkAxes.checked = currentEditingWidget.showAxes !== false;

    // Đổ dữ liệu Tab 2
    renderSpecialPointsList();

    // Đổ dữ liệu Tab 3: Diện tích & Thể tích (S & V)
    const areaCalc = currentEditingWidget.areaCalc || {};
    const chkAreaEnable = document.getElementById('chk-area-enable');
    const areaControls = document.getElementById('graph-area-controls');
    if (chkAreaEnable) chkAreaEnable.checked = areaCalc.enabled !== false;
    if (areaControls) {
      areaControls.style.opacity = (areaCalc.enabled !== false) ? '1' : '0.5';
      areaControls.style.pointerEvents = (areaCalc.enabled !== false) ? 'auto' : 'none';
    }

    const targetFuncCount = areaCalc.funcCount || (currentEditingWidget.functions ? Math.min(3, Math.max(1, currentEditingWidget.functions.length)) : 1);
    const pillBtns = modalEl.querySelectorAll('#group-area-func-count .btn-pill-choice');
    pillBtns.forEach(b => {
      const cnt = parseInt(b.getAttribute('data-count'), 10) || 1;
      b.classList.toggle('active', cnt === targetFuncCount);
    });

    if (areaCalc.a !== undefined) {
      const in1a = document.getElementById('input-area-1f-a');
      const in2a = document.getElementById('input-area-2f-a');
      const in3a = document.getElementById('input-area-3f-a');
      if (in1a) in1a.value = areaCalc.a;
      if (in2a) in2a.value = areaCalc.a;
      if (in3a) in3a.value = areaCalc.a;
    }
    if (areaCalc.b !== undefined) {
      const in1b = document.getElementById('input-area-1f-b');
      const in2b = document.getElementById('input-area-2f-b');
      const in3b = document.getElementById('input-area-3f-b');
      if (in1b) in1b.value = areaCalc.b;
      if (in2b) in2b.value = areaCalc.b;
      if (in3b) in3b.value = areaCalc.b;
    }

    if (areaCalc.boundMode) {
      const r2 = modalEl.querySelector(`input[name="radio-area-2f-bound"][value="${areaCalc.boundMode}"]`);
      if (r2) r2.checked = true;
      const r3 = modalEl.querySelector(`input[name="radio-area-3f-bound"][value="${areaCalc.boundMode}"]`);
      if (r3) r3.checked = true;
    }

    const calcAxisBtns = modalEl.querySelectorAll('.btn-calc-axis');
    calcAxisBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-axis') === (areaCalc.axis || 'Ox'));
    });

    const chkFill = document.getElementById('chk-area-draw-fill');
    const chkLines = document.getElementById('chk-area-draw-lines');
    const chkBadge = document.getElementById('chk-area-draw-badge');
    if (chkFill) chkFill.checked = areaCalc.drawFill !== false;
    if (chkLines) chkLines.checked = areaCalc.drawLines !== false;
    if (chkBadge) chkBadge.checked = areaCalc.showBadge !== false;

    updateAreaVolumeTabUI();

    // Đổ dữ liệu Tab 4: Mô phỏng Thể tích 3D
    updateRevolutionFuncSelect();
    const rev = currentEditingWidget.revolution3D || {};
    const chkRev = document.getElementById('chk-rev-enable');
    const revControls = document.getElementById('graph-rev-controls');
    const inputOxMin = document.getElementById('input-rev-ox-min');
    const inputOxMax = document.getElementById('input-rev-ox-max');
    const inputOyMin = document.getElementById('input-rev-oy-min');
    const inputOyMax = document.getElementById('input-rev-oy-max');
    const inputAngle = document.getElementById('input-rev-angle');
    const labelAngle = document.getElementById('label-rev-angle');
    const inputTilt = document.getElementById('input-rev-tilt');
    const labelTilt = document.getElementById('label-rev-tilt');
    const chkSlice = document.getElementById('chk-rev-show-slice');
    const chkLoop = document.getElementById('chk-rev-loop');

    if (chkRev) chkRev.checked = !!rev.enabled;
    if (revControls) {
      revControls.style.opacity = rev.enabled ? '1' : '0.85';
      revControls.style.pointerEvents = 'auto';
    }

    const oxRange = rev.rangeX || rev.range || [0, 2.5];
    const oyRange = rev.rangeY || [-2, 3];
    if (inputOxMin) inputOxMin.value = oxRange[0] !== undefined ? oxRange[0] : 0;
    if (inputOxMax) inputOxMax.value = oxRange[1] !== undefined ? oxRange[1] : 2.5;
    if (inputOyMin) inputOyMin.value = oyRange[0] !== undefined ? oyRange[0] : -2;
    if (inputOyMax) inputOyMax.value = oyRange[1] !== undefined ? oyRange[1] : 3;

    if (inputAngle) inputAngle.value = (rev.angleDeg !== undefined) ? rev.angleDeg : 0;
    if (labelAngle) labelAngle.textContent = (rev.angleDeg !== undefined ? rev.angleDeg : 0) + '° / 360°';
    if (inputTilt) inputTilt.value = (rev.tiltDeg !== undefined) ? rev.tiltDeg : 28;
    if (labelTilt) labelTilt.textContent = ((rev.tiltDeg !== undefined) ? rev.tiltDeg : 28) + '°';
    if (chkSlice) chkSlice.checked = rev.showSlice !== false;
    if (chkLoop) chkLoop.checked = rev.isLoop !== false;

    const currentSpeed = rev.speed || 1.0;
    const speedBtns = modalEl.querySelectorAll('.btn-rev-speed');
    speedBtns.forEach(b => {
      const sp = parseFloat(b.getAttribute('data-speed')) || 1.0;
      b.classList.toggle('active', Math.abs(sp - currentSpeed) < 0.1);
    });

    const axisBtns = modalEl.querySelectorAll('.btn-rev-axis');
    axisBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-axis') === (rev.axis || 'Ox'));
    });

    const btnPlay = document.getElementById('btn-rev-play');
    const btnPause = document.getElementById('btn-rev-pause');
    if (btnPlay) btnPlay.style.display = 'inline-flex';
    if (btnPause) btnPause.style.display = 'none';

    updateVolumeFormula();

    modalEl.style.display = 'flex';
    setModalPreviewMode(targetTab === 'tab-graph-revolution' || rev.enabled ? '3d' : '2d');
  }

  function closeGraphModal() {
    const modalEl = document.getElementById('modal-graph-settings');
    if (modalEl) modalEl.style.display = 'none';
    if (spinAnimationId) {
      cancelAnimationFrame(spinAnimationId);
      spinAnimationId = null;
    }
    const btnRevPlay = document.getElementById('btn-rev-play');
    const btnRevPause = document.getElementById('btn-rev-pause');
    if (btnRevPlay) btnRevPlay.style.display = 'inline-flex';
    if (btnRevPause) btnRevPause.style.display = 'none';
  }

  function applyGraphModalChanges() {
    if (!currentEditingWidget) return;
    syncDraftStateFromModalInputs();
    closeGraphModal();
    if (typeof onApplyCallback === 'function') {
      onApplyCallback(currentEditingWidget);
    }
  }

  // Khởi tạo UI khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGraphSettingsUI);
  } else {
    initGraphSettingsUI();
  }

  // Xuất API toàn cục
  global.__GraphWidget = {
    compileMathExpr,
    createDefaultGraphWidget,
    mathToCanvas,
    canvasToMath,
    autoFindSpecialPoints,
    calculateRevolutionVolume,
    calculateAreaAndVolumeDetailed,
    findTwoFunctionsIntersections,
    findFunctionRoots,
    project3DSolidPoint,
    drawGraphWidget,
    drawSolidOfRevolution3D,
    renderModalLivePreview,
    hitTestGraphWidget,
    hitTestWidgetHeaderButtons,
    hitTestWidgetResizeHandle,
    hitTestWidget3DControls,
    openGraphSettingsModal,
    closeGraphModal
  };

})(window);
