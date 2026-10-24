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

  // Tính thể tích khối tròn xoay bằng công thức Simpson
  function calculateRevolutionVolume(funcStr, axis, a, b) {
    const fn = compileMathExpr(funcStr);
    if (!fn) return null;
    const n = 500; // Số phân đoạn Simpson
    const h = (b - a) / n;
    let sum = 0;

    if (axis === 'Ox') {
      // V = pi * integral_a^b [f(x)]^2 dx
      for (let i = 0; i <= n; i++) {
        const x = a + i * h;
        const y = fn(x);
        if (isNaN(y)) return null;
        const val = y * y;
        if (i === 0 || i === n) sum += val;
        else if (i % 2 === 1) sum += 4 * val;
        else sum += 2 * val;
      }
      return Math.PI * (h / 3) * sum;
    } else {
      // Xoay quanh Oy: V = 2 * pi * integral_a^b x * |f(x)| dx (phương pháp vỏ trụ Cylindrical shells)
      for (let i = 0; i <= n; i++) {
        const x = a + i * h;
        const y = fn(x);
        if (isNaN(y)) return null;
        const val = Math.abs(x * y);
        if (i === 0 || i === n) sum += val;
        else if (i % 2 === 1) sum += 4 * val;
        else sum += 2 * val;
      }
      return 2 * Math.PI * (h / 3) * sum;
    }
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

  function drawSolidOfRevolution3D(ctx, widget) {
    const { x, y, width, height, origin, scale } = widget;
    const rev = widget.revolution3D || {};
    const axis = rev.axis || 'Ox';
    const isOy = (axis === 'Oy' || axis === 'oy');

    // 1. Lấy khoảng cận hiển thị của Trục Ox và Trục Oy theo yêu cầu
    const oxMin = (rev.rangeX && rev.rangeX[0] !== undefined) ? rev.rangeX[0] : (rev.range ? rev.range[0] : 0);
    const oxMax = (rev.rangeX && rev.rangeX[1] !== undefined) ? rev.rangeX[1] : (rev.range ? rev.range[1] : 2.5);
    const oyMin = (rev.rangeY && rev.rangeY[0] !== undefined) ? rev.rangeY[0] : -2;
    const oyMax = (rev.rangeY && rev.rangeY[1] !== undefined) ? rev.rangeY[1] : 3;

    // Cận tích phân quay:
    // - Quay quanh Ox: biến x chạy từ oxMin đến oxMax
    // - Quay quanh Oy: bán kính r = x >= 0 chạy từ max(0, oxMin) đến oxMax
    const a = isOy ? Math.max(0, oxMin) : oxMin;
    const b = isOy ? Math.max(a + 0.1, oxMax) : oxMax;

    const angleDeg = rev.angleDeg !== undefined ? rev.angleDeg : 0;
    const angleRad = (angleDeg * Math.PI) / 180;
    const tiltRad = ((rev.tiltDeg || 28) * Math.PI) / 180; // Độ nghiêng phối cảnh

    const fObj = (widget.functions && widget.functions[rev.funcIndex || 0]) || (widget.functions ? widget.functions[0] : null);
    if (!fObj) return;
    const fn = compileMathExpr(fObj.expr);
    if (!fn) return;

    ctx.save();

    // Nền gradient 3D tinh khiết, sáng sủa, tương phản cao
    const bgGrad = ctx.createLinearGradient(x, y, x, y + height);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(1, '#f1f5f9');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(x, y, width, height);

    // Vẽ lưới phối cảnh sàn màu lam xám nhẹ nhàng
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 0.8;
    for (let i = -6; i <= 6; i += 2) {
      const p1 = mathToCanvas(i, -3, widget);
      const p2 = mathToCanvas(i, 3, widget);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y + Math.sin(tiltRad) * 40);
      ctx.lineTo(p2.x, p2.y - Math.sin(tiltRad) * 40);
      ctx.stroke();
    }

    // 2. Vẽ 2 trục tọa độ Ox và Oy với giới hạn hiển thị (ĐẶC BIỆT NHẤN MẠNH TRỤC OY KHI QUAY OY)
    ctx.save();

    // Trục Ox (than xám lịch lãm)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x + 20, origin.y);
    ctx.lineTo(x + width - 20, origin.y);
    ctx.stroke();

    // Mũi tên Ox
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(x + width - 20, origin.y);
    ctx.lineTo(x + width - 28, origin.y - 4);
    ctx.lineTo(x + width - 28, origin.y + 4);
    ctx.fill();

    // Vạch mốc Ox
    ctx.font = '10px -apple-system, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'center';
    const pOxMin = mathToCanvas(oxMin, 0, widget);
    const pOxMax = mathToCanvas(oxMax, 0, widget);
    ctx.beginPath();
    ctx.moveTo(pOxMin.x, origin.y - 4);
    ctx.lineTo(pOxMin.x, origin.y + 4);
    ctx.stroke();
    ctx.fillText(`x=${oxMin}`, pOxMin.x, origin.y + 14);

    ctx.beginPath();
    ctx.moveTo(pOxMax.x, origin.y - 4);
    ctx.lineTo(pOxMax.x, origin.y + 4);
    ctx.stroke();
    ctx.fillText(`x=${oxMax}`, pOxMax.x, origin.y + 14);

    // TRỤC OY: KHI QUAY QUANH OY ĐƯỢC NHẤN MẠNH RỰC RỠ BẰNG MÀU ĐỎ RUBY #dc2626
    if (isOy) {
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.4;

      // Đoạn trục thẳng đứng xuyên tâm
      ctx.beginPath();
      ctx.moveTo(origin.x, y + height - 58);
      ctx.lineTo(origin.x, y + 25);
      ctx.stroke();

      // Mũi tên nhọn trục Oy màu đỏ
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(origin.x, y + 18);
      ctx.lineTo(origin.x - 5, y + 30);
      ctx.lineTo(origin.x + 5, y + 30);
      ctx.fill();

      // Khung nhãn nổi bật: "⟳ TRỤC QUAY Oy"
      ctx.save();
      ctx.fillStyle = 'rgba(254, 226, 226, 0.92)';
      ctx.roundRect(origin.x + 8, y + 18, 126, 18, 4);
      ctx.fill();
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.font = 'bold 11px -apple-system, sans-serif';
      ctx.fillStyle = '#b91c1c';
      ctx.textAlign = 'left';
      ctx.fillText('⟳ Trục quay Oy (Tung)', origin.x + 12, y + 31);
      ctx.restore();

      // Biểu tượng vòng xoay tròn quanh trục Oy màu cam cháy
      ctx.save();
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      safeEllipse(ctx, origin.x, y + 44, 15, 5, 0, 0, Math.PI * 1.7);
      ctx.stroke();
      // Mũi tên nhỏ ở đầu vòng xoay
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(origin.x + 15, y + 44);
      ctx.lineTo(origin.x + 12, y + 40);
      ctx.lineTo(origin.x + 18, y + 41);
      ctx.fill();
      ctx.restore();
    } else {
      // Trục Oy bình thường
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(origin.x, y + height - 58);
      ctx.lineTo(origin.x, y + 25);
      ctx.stroke();

      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(origin.x, y + 25);
      ctx.lineTo(origin.x - 4, y + 33);
      ctx.lineTo(origin.x + 4, y + 33);
      ctx.fill();
    }

    // Vạch chia và mốc cận hiển thị Oy
    ctx.textAlign = 'right';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.fillStyle = isOy ? '#b91c1c' : '#475569';
    const pOyMin = mathToCanvas(0, oyMin, widget);
    const pOyMax = mathToCanvas(0, oyMax, widget);

    ctx.beginPath();
    ctx.moveTo(origin.x - 4, pOyMin.y);
    ctx.lineTo(origin.x + 4, pOyMin.y);
    ctx.stroke();
    ctx.fillText(`y=${oyMin}`, origin.x - 6, pOyMin.y + 3.5);

    ctx.beginPath();
    ctx.moveTo(origin.x - 4, pOyMax.y);
    ctx.lineTo(origin.x + 4, pOyMax.y);
    ctx.stroke();
    ctx.fillText(`y=${oyMax}`, origin.x - 6, pOyMax.y + 3.5);

    ctx.restore();

    // 3. VẼ HÌNH PHẲNG BAN ĐẦU S (Khi angleDeg === 0 hoặc vẽ mờ khi đang quay)
    const slices = 36;
    const step = (b - a) / slices;

    if (!isOy) {
      // Quay quanh Ox: Miền giới hạn bởi y = f(x), trục Ox, x = a, x = b
      ctx.save();
      ctx.beginPath();
      const pStart = mathToCanvas(a, 0, widget);
      ctx.moveTo(pStart.x, pStart.y);
      for (let i = 0; i <= slices; i++) {
        const t = a + i * step;
        const pt = mathToCanvas(t, fn(t) || 0, widget);
        ctx.lineTo(pt.x, pt.y);
      }
      const pEnd = mathToCanvas(b, 0, widget);
      ctx.lineTo(pEnd.x, pEnd.y);
      ctx.closePath();

      // Hình phẳng S quay quanh Ox: Màu Tím Thạch Anh / Violet
      ctx.fillStyle = angleDeg === 0 ? 'rgba(139, 92, 246, 0.42)' : 'rgba(139, 92, 246, 0.14)';
      ctx.fill();
      ctx.strokeStyle = '#7c3aed';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.stroke();

      if (angleDeg === 0) {
        ctx.font = 'bold 11px -apple-system, sans-serif';
        ctx.fillStyle = '#6d28d9';
        ctx.textAlign = 'center';
        const midPt = mathToCanvas((a + b) / 2, (fn((a + b) / 2) || 0) / 2, widget);
        ctx.fillText('📐 Miền S (chuẩn bị quay Ox)', midPt.x, midPt.y);
      }
      ctx.restore();
    } else {
      // Hình phẳng S quay quanh Oy: Màu Vàng Cam Hổ Phách (Amber Gold) rực rỡ, dễ thấy
      ctx.save();
      ctx.beginPath();
      // Bắt đầu từ trục Oy tại y = 0
      const pO = mathToCanvas(0, 0, widget);
      ctx.moveTo(pO.x, pO.y);

      // Đi dọc theo trục Ox đến x = a (nếu a > 0)
      if (a > 0) {
        const pA = mathToCanvas(a, 0, widget);
        ctx.lineTo(pA.x, pA.y);
      }

      // Đi dọc theo đường cong y = f(x) từ x = a đến x = b
      for (let i = 0; i <= slices; i++) {
        const t = a + i * step;
        const pt = mathToCanvas(t, fn(t) || 0, widget);
        ctx.lineTo(pt.x, pt.y);
      }

      // Điểm cuối (b, f(b)) dóng vuông góc về trục Oy tại (0, f(b))
      const yEnd = fn(b) || 0;
      const ptEndOy = mathToCanvas(0, yEnd, widget);
      ctx.lineTo(ptEndOy.x, ptEndOy.y);
      ctx.closePath();

      // Màu vàng cam hổ phách ấm, viền cam cháy nổi bật
      ctx.fillStyle = angleDeg === 0 ? 'rgba(245, 158, 11, 0.45)' : 'rgba(245, 158, 11, 0.15)';
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 3]);
      ctx.stroke();

      if (angleDeg === 0) {
        ctx.font = 'bold 11.5px -apple-system, sans-serif';
        ctx.fillStyle = '#b45309';
        ctx.textAlign = 'center';
        const midX = (a + b) / 2;
        const midY = (fn(midX) || 0) / 2;
        const midPt = mathToCanvas(midX, midY, widget);
        ctx.fillText('📐 Miền S (chuẩn bị quay Oy)', midPt.x, midPt.y);
      }
      ctx.restore();
    }

    // 4. QUÁ TRÌNH XOAY QUÉT 3D TỪ TỪ (Khi angleDeg > 0)
    if (angleDeg > 0) {
      for (let i = 0; i < slices; i++) {
        const t1 = a + i * step;
        const t2 = a + (i + 1) * step;

        if (!isOy) {
          // Xoay quanh Ox
          const r1 = Math.abs(fn(t1) || 0);
          const r2 = Math.abs(fn(t2) || 0);
          const cx1 = origin.x + t1 * scale;
          const cx2 = origin.x + t2 * scale;
          const cy = origin.y;
          const ry1 = r1 * scale;
          const rz1 = ry1 * Math.sin(tiltRad);
          const ry2 = r2 * scale;
          const rz2 = ry2 * Math.sin(tiltRad);

          ctx.beginPath();
          safeEllipse(ctx, cx1, cy, rz1, ry1, 0, -Math.PI / 2, -Math.PI / 2 + angleRad);
          ctx.lineTo(cx2, cy + ry2 * Math.sin(-Math.PI / 2 + angleRad));
          safeEllipse(ctx, cx2, cy, rz2, ry2, 0, -Math.PI / 2 + angleRad, -Math.PI / 2, true);
          ctx.closePath();

          // Quét quanh Ox: Tông Tím Lam Thạch Anh sang trọng
          const grad = ctx.createLinearGradient(cx1, cy - ry1, cx1, cy + ry1);
          grad.addColorStop(0, 'rgba(124, 58, 237, 0.52)');
          grad.addColorStop(0.5, 'rgba(167, 139, 250, 0.22)');
          grad.addColorStop(1, 'rgba(91, 33, 182, 0.58)');
          ctx.fillStyle = grad;
          ctx.fill();
        } else {
          // Quét quanh Oy: TÔNG XANH LAM NGỌC BIỂN PHA LÊ (Crystal Sky Blue) TRONG SUỐT, TƯƠNG PHẢN CAO
          const y1 = fn(t1) || 0;
          const y2 = fn(t2) || 0;
          const cy1 = origin.y - y1 * scale;
          const cy2 = origin.y - y2 * scale;
          const cx = origin.x; // Tâm nằm chính xác trên trục Oy!
          const rx1 = t1 * scale;
          const rz1 = rx1 * Math.sin(tiltRad);
          const rx2 = t2 * scale;
          const rz2 = rx2 * Math.sin(tiltRad);

          ctx.beginPath();
          safeEllipse(ctx, cx, cy1, rx1, rz1, 0, 0, angleRad);
          ctx.lineTo(cx + rx2 * Math.cos(angleRad), cy2 + rz2 * Math.sin(angleRad));
          safeEllipse(ctx, cx, cy2, rx2, rz2, 0, angleRad, 0, true);
          ctx.closePath();

          // Gradient xanh lam pha lê trong suốt, thấy rõ trục đỏ Oy ở giữa
          const grad = ctx.createLinearGradient(cx - rx2, cy1, cx + rx2, cy1);
          grad.addColorStop(0, 'rgba(14, 165, 233, 0.55)');   // Sky 500
          grad.addColorStop(0.3, 'rgba(56, 189, 248, 0.25)'); // Sky 400 trong suốt
          grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.25)');
          grad.addColorStop(1, 'rgba(2, 132, 199, 0.60)');   // Sky 600
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      // Các đường tròn vĩ tuyến (wireframe rings)
      ctx.lineWidth = 1.0;
      const ringStep = Math.max(1, Math.floor(slices / 6));

      for (let i = 0; i <= slices; i += ringStep) {
        const t = a + i * step;

        if (!isOy) {
          const r = Math.abs(fn(t) || 0);
          const cx = origin.x + t * scale;
          const cy = origin.y;
          const ry = r * scale;
          const rz = ry * Math.sin(tiltRad);

          ctx.strokeStyle = 'rgba(109, 40, 217, 0.50)';
          ctx.beginPath();
          safeEllipse(ctx, cx, cy, rz, ry, 0, -Math.PI / 2, -Math.PI / 2 + angleRad);
          ctx.stroke();

          if (angleDeg >= 359 && (i === 0 || i === slices)) {
            ctx.save();
            ctx.fillStyle = 'rgba(167, 139, 250, 0.35)';
            ctx.beginPath();
            safeEllipse(ctx, cx, cy, rz, ry, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        } else {
          // Vĩ tuyến quanh Oy: Màu Xanh Lam Biển Sâu #0284c7 rõ nét
          const yVal = fn(t) || 0;
          const cy = origin.y - yVal * scale;
          const cx = origin.x;
          const rx = t * scale;
          const rz = rx * Math.sin(tiltRad);

          // Nửa sau nét đứt (thể hiện bị che khuất trong không gian)
          ctx.save();
          ctx.strokeStyle = 'rgba(2, 132, 199, 0.40)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          safeEllipse(ctx, cx, cy, rx, rz, 0, Math.PI, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Nửa trước nét liền theo góc quét
          ctx.save();
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          safeEllipse(ctx, cx, cy, rx, rz, 0, 0, Math.min(Math.PI, angleRad));
          ctx.stroke();
          ctx.restore();

          // Nắp khi quét trọn vòng 360 độ
          if (angleDeg >= 359 && (i === 0 || i === slices)) {
            ctx.save();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
            ctx.beginPath();
            safeEllipse(ctx, cx, cy, rx, rz, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // Đường sinh quét tại góc quay hiện tại
      ctx.save();
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= slices; i++) {
        const t = a + i * step;
        if (!isOy) {
          const r = fn(t) || 0;
          const cx = origin.x + t * scale;
          const cy = origin.y;
          const ry = r * scale;
          const rz = ry * Math.sin(tiltRad);
          const curY = cy + ry * Math.sin(-Math.PI / 2 + angleRad);
          const curX = cx + rz * Math.cos(-Math.PI / 2 + angleRad);
          if (i === 0) ctx.moveTo(curX, curY);
          else ctx.lineTo(curX, curY);
        } else {
          // Đường sinh quanh Oy: tại mỗi x, quay quanh trục Oy
          const yVal = fn(t) || 0;
          const cy = origin.y - yVal * scale;
          const cx = origin.x;
          const rx = t * scale;
          const rz = rx * Math.sin(tiltRad);
          const curX = cx + rx * Math.cos(angleRad);
          const curY = cy + rz * Math.sin(angleRad);
          if (i === 0) ctx.moveTo(curX, curY);
          else ctx.lineTo(curX, curY);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // 5. THANH ĐIỀU KHIỂN CHUYỂN ĐỘNG TRỰC TIẾP TRÊN WIDGET (Interactive 3D Control Bar)
    drawWidget3DControls(ctx, widget, a, b, oxMin, oxMax, oyMin, oyMax, isOy);

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

    // Hàng 2: Hiển thị cận Trục Ox và Trục Oy + Thể tích V
    const row2Y = barY + 32;
    ctx.textAlign = 'left';
    ctx.font = '10px -apple-system, sans-serif';

    const fObj = (widget.functions && widget.functions[rev.funcIndex || 0]) || (widget.functions ? widget.functions[0] : null);
    const vol = fObj ? calculateRevolutionVolume(fObj.expr, rev.axis || 'Ox', a, b) : null;
    const volStr = vol !== null ? (Math.round(vol * 1000) / 1000).toString() : '---';

    if (isOy) {
      ctx.fillStyle = '#b91c1c';
      ctx.fillText(`⟳ TRỤC QUAY: Oy (Tung)`, barX + 10, row2Y + 10);
      ctx.fillStyle = '#0369a1';
      ctx.fillText(`Cận x: [${a}; ${b}]   |   V = 2π∫ x·|f(x)|dx ≈ ${volStr} π`, barX + 138, row2Y + 10);
    } else {
      ctx.fillStyle = '#6d28d9';
      ctx.fillText(`⟳ TRỤC QUAY: Ox (Hoành)`, barX + 10, row2Y + 10);
      ctx.fillStyle = '#475569';
      ctx.fillText(`Cận x: [${a}; ${b}]   |   V = π∫ [f(x)]²dx ≈ ${volStr} π`, barX + 150, row2Y + 10);
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

    // Icon & Tiêu đề
    ctx.font = 'bold 11.5px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('📈 Đồ thị hàm số' + (is3D ? ' (3D Tròn xoay)' : ''), x + 10, y - headerH + 18);

    // Nút [⚙️ Sửa hàm]
    const btnEditX = x + width - 180;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.roundRect(btnEditX, y - headerH + 5, 80, 18, 4);
    ctx.fill();
    ctx.font = '10.5px -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('⚙️ Sửa hàm', btnEditX + 10, y - headerH + 18);

    // Nút [🔄 Xoay 3D / 2D]
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

    const btnEditX = x + width - 180;
    if (px >= btnEditX && px <= btnEditX + 80) {
      return 'edit';
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
  // BỘ ĐIỀU KHIỂN MODAL CÀI ĐẶT ĐỒ THỊ & THỂ TÍCH 3D
  // -------------------------------------------------------------
  let currentEditingWidget = null;
  let onApplyCallback = null;
  let spinAnimationId = null;

  function initGraphSettingsUI() {
    const modalEl = document.getElementById('modal-graph-settings');
    if (!modalEl) return;

    // Chuyển Tab
    const tabBtns = modalEl.querySelectorAll('.graph-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetTabId = btn.getAttribute('data-tab');
        modalEl.querySelectorAll('.graph-tab-content').forEach(c => c.classList.remove('active'));
        const targetContent = document.getElementById(targetTabId);
        if (targetContent) targetContent.classList.add('active');
      });
    });

    // Đóng Modal
    const btnClose = document.getElementById('btn-close-graph-modal');
    const btnCancel = document.getElementById('btn-cancel-graph-modal');
    if (btnClose) btnClose.addEventListener('click', closeGraphModal);
    if (btnCancel) btnCancel.addEventListener('click', closeGraphModal);

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
        // Gộp điểm chưa có
        for (const pt of axesOnly) {
          if (!currentEditingWidget.specialPoints.some(ep => Math.abs(ep.x - pt.x) < 0.05 && Math.abs(ep.y - pt.y) < 0.05)) {
            currentEditingWidget.specialPoints.push(pt);
          }
        }
        renderSpecialPointsList();
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
      });
    }

    // Xóa hết điểm
    const btnClearPoints = document.getElementById('btn-clear-all-points');
    if (btnClearPoints) {
      btnClearPoints.addEventListener('click', () => {
        if (!currentEditingWidget) return;
        currentEditingWidget.specialPoints = [];
        renderSpecialPointsList();
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
      });
    }

    // Điều khiển Tab 3: Thể tích 3D
    const chkRevEnable = document.getElementById('chk-rev-enable');
    const revControls = document.getElementById('graph-rev-controls');
    if (chkRevEnable && revControls) {
      chkRevEnable.addEventListener('change', () => {
        revControls.style.opacity = chkRevEnable.checked ? '1' : '0.5';
        revControls.style.pointerEvents = chkRevEnable.checked ? 'auto' : 'none';
        updateVolumeFormula();
      });
    }

    // Nút chọn trục Ox / Oy
    const axisBtns = modalEl.querySelectorAll('.btn-rev-axis');
    axisBtns.forEach(b => {
      b.addEventListener('click', () => {
        axisBtns.forEach(btn => btn.classList.remove('active'));
        b.classList.add('active');
        updateVolumeFormula();
      });
    });

    // Thay đổi cận 1. Trục Ox và 2. Trục Oy
    const inputRevOxMin = document.getElementById('input-rev-ox-min');
    const inputRevOxMax = document.getElementById('input-rev-ox-max');
    const inputRevOyMin = document.getElementById('input-rev-oy-min');
    const inputRevOyMax = document.getElementById('input-rev-oy-max');
    if (inputRevOxMin) inputRevOxMin.addEventListener('input', updateVolumeFormula);
    if (inputRevOxMax) inputRevOxMax.addEventListener('input', updateVolumeFormula);
    if (inputRevOyMin) inputRevOyMin.addEventListener('input', updateVolumeFormula);
    if (inputRevOyMax) inputRevOyMax.addEventListener('input', updateVolumeFormula);

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
      });
    }

    // Nút điều khiển chuyển động xoay: Bắt đầu, Tạm dừng, Về 0°
    const btnRevPlay = document.getElementById('btn-rev-play');
    const btnRevPause = document.getElementById('btn-rev-pause');
    const btnRevReset = document.getElementById('btn-rev-reset');
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
        btnRevPlay.style.display = 'none';
        if (btnRevPause) btnRevPause.style.display = 'inline-flex';

        let currentAngle = parseFloat(inputRevAngle.value) || 0;
        if (currentAngle >= 360) currentAngle = 0;

        const loopSpin = () => {
          // Bước xoay từ từ: 0.8 độ mỗi khung hình nhân với hệ số tốc độ
          const step = 0.8 * currentAnimSpeed;
          currentAngle += step;

          if (currentAngle >= 360) {
            if (chkRevLoop && chkRevLoop.checked) {
              currentAngle = 0;
            } else {
              currentAngle = 360;
              inputRevAngle.value = 360;
              if (labelRevAngle) labelRevAngle.textContent = '360° / 360°';
              stopModalSpin();
              return;
            }
          }

          inputRevAngle.value = Math.round(currentAngle);
          if (labelRevAngle) labelRevAngle.textContent = Math.round(currentAngle) + '° / 360°';
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
      });
    }

    // Scale slider
    const inputScale = document.getElementById('input-graph-scale');
    const labelScale = document.getElementById('label-graph-scale');
    if (inputScale && labelScale) {
      inputScale.addEventListener('input', () => {
        labelScale.textContent = inputScale.value + 'px / đv';
      });
    }

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
      });

      inputExpr.addEventListener('input', () => {
        fn.expr = inputExpr.value;
        updateVolumeFormula();
      });

      inputColor.addEventListener('input', () => {
        fn.color = inputColor.value;
      });

      rangeMin.addEventListener('input', () => {
        if (!fn.range) fn.range = [-5, 5];
        fn.range[0] = rangeMin.value !== '' ? parseFloat(rangeMin.value) : undefined;
      });

      rangeMax.addEventListener('input', () => {
        if (!fn.range) fn.range = [-5, 5];
        fn.range[1] = rangeMax.value !== '' ? parseFloat(rangeMax.value) : undefined;
      });

      btnDel.addEventListener('click', () => {
        if (currentEditingWidget.functions.length <= 1) {
          alert('Cần giữ ít nhất 1 hàm số');
          return;
        }
        currentEditingWidget.functions.splice(idx, 1);
        renderFuncsList();
        updateRevolutionFuncSelect();
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

      chkProj.addEventListener('change', () => pt.showProjection = chkProj.checked);
      inputX.addEventListener('input', () => pt.x = parseFloat(inputX.value) || 0);
      inputY.addEventListener('input', () => pt.y = parseFloat(inputY.value) || 0);
      inputLbl.addEventListener('input', () => pt.label = inputLbl.value);
      inputCol.addEventListener('input', () => pt.color = inputCol.value);
      btnDel.addEventListener('click', () => {
        currentEditingWidget.specialPoints.splice(idx, 1);
        renderSpecialPointsList();
      });

      listEl.appendChild(row);
    });
  }

  function updateRevolutionFuncSelect() {
    const sel = document.getElementById('select-rev-func');
    if (!sel || !currentEditingWidget) return;
    sel.innerHTML = '';
    const funcs = currentEditingWidget.functions || [];
    funcs.forEach((fn, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = `y${idx + 1} = ${fn.expr}`;
      sel.appendChild(opt);
    });
    if (currentEditingWidget.revolution3D && currentEditingWidget.revolution3D.funcIndex !== undefined) {
      sel.value = currentEditingWidget.revolution3D.funcIndex;
    }
    updateVolumeFormula();
  }

  function updateVolumeFormula() {
    const sel = document.getElementById('select-rev-func');
    const inputOxMin = document.getElementById('input-rev-ox-min');
    const inputOxMax = document.getElementById('input-rev-ox-max');
    const inputOyMin = document.getElementById('input-rev-oy-min');
    const inputOyMax = document.getElementById('input-rev-oy-max');
    const formulaText = document.getElementById('rev-formula-text');
    const volumeVal = document.getElementById('rev-volume-val');
    const axisBtn = document.querySelector('.btn-rev-axis.active');

    if (!formulaText || !volumeVal || !currentEditingWidget) return;

    const fIdx = sel ? parseInt(sel.value, 10) || 0 : 0;
    const fObj = currentEditingWidget.functions && currentEditingWidget.functions[fIdx];
    const axis = axisBtn ? axisBtn.getAttribute('data-axis') : 'Ox';
    const isOy = (axis === 'Oy' || axis === 'oy');

    const oxMin = inputOxMin ? parseFloat(inputOxMin.value) || 0 : 0;
    const oxMax = inputOxMax ? parseFloat(inputOxMax.value) || 2.5 : 2.5;
    const oyMin = inputOyMin ? parseFloat(inputOyMin.value) || -2 : -2;
    const oyMax = inputOyMax ? parseFloat(inputOyMax.value) || 3 : 3;

    // Cận tích phân chính theo biến x:
    const a = isOy ? Math.max(0, oxMin) : oxMin;
    const b = isOy ? Math.max(a + 0.1, oxMax) : oxMax;

    if (!fObj || !fObj.expr) {
      formulaText.innerHTML = '---';
      volumeVal.textContent = 'Thể tích tính toán: V ≈ ---';
      return;
    }

    if (!isOy) {
      formulaText.innerHTML = `V = &pi; &int;<sub>${a}</sub><sup>${b}</sup> [${fObj.expr}]<sup>2</sup> dx <span style="font-size: 11px; color: #4a6358; font-weight: normal;">(Quay quanh trục hoành Ox)</span>`;
    } else {
      formulaText.innerHTML = `V = 2&pi; &int;<sub>${a}</sub><sup>${b}</sup> x &middot; |${fObj.expr}| dx <span style="font-size: 11px; color: #1e5e45; font-weight: bold;">(Quay quanh trục tung Oy - Phương pháp Vỏ trụ)</span>`;
    }

    const vol = calculateRevolutionVolume(fObj.expr, axis, a, b);
    if (vol !== null) {
      const rounded = Math.round(vol * 1000) / 1000;
      volumeVal.textContent = `Thể tích tính toán: V ≈ ${rounded} π (đơn vị thể tích)`;
    } else {
      volumeVal.textContent = 'Thể tích tính toán: Không thể tính trên khoảng này';
    }
  }

    function openGraphSettingsModal(widget, callback) {
    if (!widget) return;
    currentEditingWidget = JSON.parse(JSON.stringify(widget)); // Clone sâu để thao tác an toàn
    onApplyCallback = callback;

    const modalEl = document.getElementById('modal-graph-settings');
    if (!modalEl) return;

    // Reset Tabs
    modalEl.querySelectorAll('.graph-tab-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    modalEl.querySelectorAll('.graph-tab-content').forEach((c, i) => c.classList.toggle('active', i === 0));

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

    // Đổ dữ liệu Tab 3 (Revolution 3D)
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
    const chkLoop = document.getElementById('chk-rev-loop');

    if (chkRev) chkRev.checked = !!rev.enabled;
    if (revControls) {
      revControls.style.opacity = rev.enabled ? '1' : '0.5';
      revControls.style.pointerEvents = rev.enabled ? 'auto' : 'none';
    }

    const oxRange = rev.rangeX || rev.range || [0, 2.5];
    const oyRange = rev.rangeY || [-2, 3];
    if (inputOxMin) inputOxMin.value = oxRange[0] !== undefined ? oxRange[0] : 0;
    if (inputOxMax) inputOxMax.value = oxRange[1] !== undefined ? oxRange[1] : 2.5;
    if (inputOyMin) inputOyMin.value = oyRange[0] !== undefined ? oyRange[0] : -2;
    if (inputOyMax) inputOyMax.value = oyRange[1] !== undefined ? oyRange[1] : 3;

    if (inputAngle) inputAngle.value = (rev.angleDeg !== undefined) ? rev.angleDeg : 0;
    if (labelAngle) labelAngle.textContent = (rev.angleDeg !== undefined ? rev.angleDeg : 0) + '° / 360°';
    if (chkLoop) chkLoop.checked = rev.isLoop !== false;

    // Chọn tốc độ (0.5x, 1.0x, 2.0x)
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

    // Thu thập các giá trị từ form
    const inputScale = document.getElementById('input-graph-scale');
    const chkGrid = document.getElementById('chk-graph-grid');
    const chkAxes = document.getElementById('chk-graph-axes');
    const chkRev = document.getElementById('chk-rev-enable');
    const selRevFunc = document.getElementById('select-rev-func');
    const activeAxisBtn = document.querySelector('.btn-rev-axis.active');
    const inputOxMin = document.getElementById('input-rev-ox-min');
    const inputOxMax = document.getElementById('input-rev-ox-max');
    const inputOyMin = document.getElementById('input-rev-oy-min');
    const inputOyMax = document.getElementById('input-rev-oy-max');
    const inputAngle = document.getElementById('input-rev-angle');
    const activeSpeedBtn = document.querySelector('.btn-rev-speed.active');
    const chkLoop = document.getElementById('chk-rev-loop');

    if (inputScale) currentEditingWidget.scale = parseInt(inputScale.value, 10) || 36;
    if (chkGrid) currentEditingWidget.showGrid = chkGrid.checked;
    if (chkAxes) currentEditingWidget.showAxes = chkAxes.checked;

    if (!currentEditingWidget.revolution3D) {
      currentEditingWidget.revolution3D = {};
    }
    currentEditingWidget.revolution3D.enabled = chkRev ? chkRev.checked : false;
    currentEditingWidget.revolution3D.funcIndex = selRevFunc ? parseInt(selRevFunc.value, 10) || 0 : 0;
    currentEditingWidget.revolution3D.axis = activeAxisBtn ? activeAxisBtn.getAttribute('data-axis') : 'Ox';

    const oxMin = inputOxMin ? parseFloat(inputOxMin.value) || 0 : 0;
    const oxMax = inputOxMax ? parseFloat(inputOxMax.value) || 2.5 : 2.5;
    const oyMin = inputOyMin ? parseFloat(inputOyMin.value) || -2 : -2;
    const oyMax = inputOyMax ? parseFloat(inputOyMax.value) || 3 : 3;

    currentEditingWidget.revolution3D.rangeX = [oxMin, oxMax];
    currentEditingWidget.revolution3D.rangeY = [oyMin, oyMax];
    currentEditingWidget.revolution3D.range = currentEditingWidget.revolution3D.axis === 'Ox' ? [oxMin, oxMax] : [Math.max(0, oxMin), Math.max(oxMin + 0.1, oxMax)];
    currentEditingWidget.revolution3D.angleDeg = inputAngle ? parseFloat(inputAngle.value) || 0 : 0;
    currentEditingWidget.revolution3D.speed = activeSpeedBtn ? parseFloat(activeSpeedBtn.getAttribute('data-speed')) || 1.0 : 1.0;
    currentEditingWidget.revolution3D.isLoop = chkLoop ? chkLoop.checked : true;

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
    drawGraphWidget,
    hitTestGraphWidget,
    hitTestWidgetHeaderButtons,
    hitTestWidgetResizeHandle,
    hitTestWidget3DControls,
    openGraphSettingsModal,
    closeGraphModal
  };

})(window);
