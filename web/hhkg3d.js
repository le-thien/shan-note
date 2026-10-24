/**
 * HHKG3D - Module Xoay và Trực quan hóa Hình học không gian 3D (360 độ)
 * Dành cho dự án Nét (Hỗ trợ giáo viên và học sinh dạy & học hình học không gian SGK)
 */

(function(window) {
  'use strict';

  // 1. Định nghĩa mô hình 3D chuẩn hóa (Tọa độ X, Y, Z với Y hướng lên trên)
  const MODELS_3D = {
    'tetrahedron': {
      name: 'Tứ diện S.ABC',
      vertices: [
        [0.0, 1.3, 0.0],          // 0: S
        [-0.8, -0.65, -0.6],      // 1: A
        [-0.15, -0.75, 0.85],     // 2: B
        [0.9, -0.65, -0.35]       // 3: C
      ],
      vertexNames: ['S', 'A', 'B', 'C'],
      faces: [
        [0, 1, 2], // SAB
        [0, 2, 3], // SBC
        [0, 3, 1], // SCA
        [1, 3, 2]  // Đáy ABC (nhìn từ dưới lên hướng ra ngoài)
      ],
      edges: [
        [0, 1], [0, 2], [0, 3],
        [1, 2], [2, 3], [1, 3]
      ],
      defaultRot: { rotX: 0.32, rotY: 0.52 }
    },

    'pyramid-quad': {
      name: 'Hình chóp tứ giác S.ABCD',
      vertices: [
        [-0.1, 1.35, 0.0],        // 0: S
        [-0.55, -0.65, -0.65],    // 1: A
        [-0.9, -0.65, 0.45],      // 2: B
        [0.35, -0.65, 0.85],      // 3: C
        [0.85, -0.65, -0.25]      // 4: D
      ],
      vertexNames: ['S', 'A', 'B', 'C', 'D'],
      faces: [
        [0, 1, 2],    // SAB
        [0, 2, 3],    // SBC
        [0, 3, 4],    // SCD
        [0, 4, 1],    // SDA
        [1, 4, 3, 2]  // Đáy ABCD
      ],
      edges: [
        [0, 1], [0, 2], [0, 3], [0, 4],
        [1, 2], [2, 3], [3, 4], [4, 1]
      ],
      defaultRot: { rotX: 0.32, rotY: 0.48 }
    },

    'pyramid-trapezoid': {
      name: 'Hình chóp đáy hình thang S.ABCD',
      vertices: [
        [-0.1, 1.35, 0.0],        // 0: S
        [-0.65, -0.65, -0.65],    // 1: A
        [-0.95, -0.65, 0.65],     // 2: B
        [0.35, -0.65, 0.65],      // 3: C
        [0.85, -0.65, -0.65]      // 4: D (AD song song BC)
      ],
      vertexNames: ['S', 'A', 'B', 'C', 'D'],
      faces: [
        [0, 1, 2],
        [0, 2, 3],
        [0, 3, 4],
        [0, 4, 1],
        [1, 4, 3, 2]
      ],
      edges: [
        [0, 1], [0, 2], [0, 3], [0, 4],
        [1, 2], [2, 3], [3, 4], [4, 1]
      ],
      defaultRot: { rotX: 0.32, rotY: 0.48 }
    },

    'pyramid-parallelogram': {
      name: 'Hình chóp đáy hình bình hành S.ABCD',
      vertices: [
        [-0.1, 1.35, 0.0],        // 0: S
        [-0.35, -0.65, -0.65],    // 1: A
        [-0.85, -0.65, 0.65],     // 2: B
        [0.45, -0.65, 0.65],      // 3: C
        [0.95, -0.65, -0.65]      // 4: D
      ],
      vertexNames: ['S', 'A', 'B', 'C', 'D'],
      faces: [
        [0, 1, 2],
        [0, 2, 3],
        [0, 3, 4],
        [0, 4, 1],
        [1, 4, 3, 2]
      ],
      edges: [
        [0, 1], [0, 2], [0, 3], [0, 4],
        [1, 2], [2, 3], [3, 4], [4, 1]
      ],
      defaultRot: { rotX: 0.32, rotY: 0.48 }
    },

    'pyramid-pentagon': {
      name: 'Hình chóp đáy ngũ giác S.ABCDE',
      vertices: [
        [0.0, 1.4, 0.0],          // 0: S
        // 5 đỉnh đáy phân bố đều trên mặt phẳng XZ
        [-0.5, -0.65, -0.65],     // 1: A
        [-0.85, -0.65, 0.25],     // 2: B
        [-0.2, -0.65, 0.85],      // 3: C
        [0.65, -0.65, 0.6],       // 4: D
        [0.85, -0.65, -0.3]       // 5: E
      ],
      vertexNames: ['S', 'A', 'B', 'C', 'D', 'E'],
      faces: [
        [0, 1, 2],
        [0, 2, 3],
        [0, 3, 4],
        [0, 4, 5],
        [0, 5, 1],
        [1, 5, 4, 3, 2] // Đáy ngũ giác
      ],
      edges: [
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 2], [2, 3], [3, 4], [4, 5], [5, 1]
      ],
      defaultRot: { rotX: 0.32, rotY: 0.45 }
    },

    'pyramid-regular': {
      name: 'Hình chóp tứ giác đều S.ABCD',
      vertices: [
        [0.0, 1.45, 0.0],         // 0: S
        [-0.7, -0.65, -0.7],      // 1: A
        [-0.7, -0.65, 0.7],       // 2: B
        [0.7, -0.65, 0.7],        // 3: C
        [0.7, -0.65, -0.7],       // 4: D
        [0.0, -0.65, 0.0]         // 5: O (Tâm đáy, hình chiếu của S)
      ],
      vertexNames: ['S', 'A', 'B', 'C', 'D', 'O'],
      faces: [
        [0, 1, 2],
        [0, 2, 3],
        [0, 3, 4],
        [0, 4, 1],
        [1, 4, 3, 2] // Đáy ABCD
      ],
      edges: [
        [0, 1], [0, 2], [0, 3], [0, 4],
        [1, 2], [2, 3], [3, 4], [4, 1],
        [1, 3], // Đường chéo AC
        [2, 4], // Đường chéo BD
        [0, 5]  // Đường cao SO
      ],
      internalEdges: [8, 9, 10], // AC, BD, SO là các đường bên trong
      defaultRot: { rotX: 0.35, rotY: 0.48 }
    }
  };

  // 2. Toán học Xoay 3D và Chiếu phối cảnh
  function rotatePoint3D(pt, rotX, rotY) {
    const [x, y, z] = pt;

    // Quay quanh trục Y (Yaw - xoay ngang 360 độ)
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const x1 = x * cosY + z * sinY;
    const y1 = y;
    const z1 = -x * sinY + z * cosY;

    // Quay quanh trục X (Pitch - nghiêng góc nhìn lên/xuống)
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const x2 = x1;
    const y2 = y1 * cosX - z1 * sinX;
    const z2 = y1 * sinX + z1 * cosX;

    return [x2, y2, z2];
  }

  // Tính vector pháp tuyến của mặt phẳng từ 3 đỉnh đầu tiên
  function computeFaceNormal(p0, p1, p2) {
    const ax = p1[0] - p0[0], ay = p1[1] - p0[1], az = p1[2] - p0[2];
    const bx = p2[0] - p0[0], by = p2[1] - p0[1], bz = p2[2] - p0[2];
    // Cross product: A x B
    return [
      ay * bz - az * by,
      az * bx - ax * bz,
      ax * by - ay * bx
    ];
  }

  // Chiếu mô hình 3D sang mặt phẳng 2D và xác định cạnh đứt / liền
  function projectModel(shapeKey, rotX, rotY, bounds) {
    const model = MODELS_3D[shapeKey];
    if (!model) return null;

    // Xoay tất cả các đỉnh
    const rotated = model.vertices.map(v => rotatePoint3D(v, rotX, rotY));

    // Xác định hướng của từng mặt phẳng (Front-facing vs Back-facing)
    const faceNormals = [];
    const faceFront = [];
    for (let i = 0; i < model.faces.length; i++) {
      const f = model.faces[i];
      const p0 = rotated[f[0]];
      const p1 = rotated[f[1]];
      const p2 = rotated[f[2]];
      const normal = computeFaceNormal(p0, p1, p2);
      faceNormals.push(normal);
      // Hướng nhìn từ +Z nhìn về -Z. Mặt quay về phía người xem nếu normal.z > 0
      faceFront.push(normal[2] > 0);
    }

    // Xác định nét đứt (dashed) hay nét liền (solid) cho từng cạnh:
    // Theo định lý hình học lồi: Cạnh nhìn thấy được (nét liền) nếu nó thuộc ít nhất 1 mặt quay về phía trước
    const edgeStyles = [];
    for (let eIdx = 0; eIdx < model.edges.length; eIdx++) {
      const e = model.edges[eIdx];
      const v1 = e[0], v2 = e[1];

      // Nếu là đường dựng hình nội bộ (như đường chéo AC, BD, đường cao SO của chóp đều)
      if (model.internalEdges && model.internalEdges.includes(eIdx)) {
        edgeStyles.push('dashed');
        continue;
      }

      // Tìm các mặt chứa cạnh này
      let hasFrontFace = false;
      for (let fIdx = 0; fIdx < model.faces.length; fIdx++) {
        const face = model.faces[fIdx];
        const hasV1 = face.includes(v1);
        const hasV2 = face.includes(v2);
        if (hasV1 && hasV2) {
          if (faceFront[fIdx]) {
            hasFrontFace = true;
            break;
          }
        }
      }

      edgeStyles.push(hasFrontFace ? 'solid' : 'dashed');
    }

    // Chiếu tọa độ xoay 3D vào kích thước hộp bounds { cx, cy, scaleX, scaleY }
    const { cx, cy, scaleX, scaleY } = bounds;
    const projectedPoints = rotated.map((v, i) => {
      const px = Math.round(cx + v[0] * scaleX);
      const py = Math.round(cy - v[1] * scaleY); // Y hướng lên trong 3D, hướng xuống trong canvas
      const name = model.vertexNames[i] || '';

      // Tự động căn chỉnh nhãn chữ S, A, B, C... theo hướng vector từ tâm
      let offX = 0, offY = 0;
      if (name === 'S') {
        offX = -4; offY = -12;
      } else {
        const dirX = v[0], dirY = -v[1];
        offX = dirX >= 0 ? 8 : -14;
        offY = dirY >= 0 ? 14 : -6;
      }

      return { x: px, y: py, name: name, offX: offX, offY: offY };
    });

    const edgesWithStyle = model.edges.map((e, idx) => [e[0], e[1], edgeStyles[idx]]);

    return {
      points: projectedPoints,
      edges: edgesWithStyle,
      faces: model.faces,
      faceFront: faceFront,
      rotatedVerts: rotated,
      rotX: rotX,
      rotY: rotY
    };
  }

  // 3. Xoay phần tử HHKG trực tiếp trên trang ghi chú
  function rotateElementOnCanvas(geo, deltaRotX, deltaRotY) {
    if (!geo || !MODELS_3D[geo.shape]) return;

    if (geo.rotX === undefined || geo.rotY === undefined) {
      const def = MODELS_3D[geo.shape].defaultRot;
      geo.rotX = def.rotX;
      geo.rotY = def.rotY;
    }

    geo.rotX = (geo.rotX + deltaRotX);
    // Giới hạn góc nghiêng để không bị lộn ngược hình
    geo.rotX = Math.max(-0.6, Math.min(1.2, geo.rotX));
    geo.rotY = (geo.rotY + deltaRotY) % (Math.PI * 2);

    // Tính toán lại tâm và kích thước từ start và end hiện tại
    const left = Math.min(geo.start.x, geo.end.x);
    const right = Math.max(geo.start.x, geo.end.x);
    const top = Math.min(geo.start.y, geo.end.y);
    const bottom = Math.max(geo.start.y, geo.end.y);
    const w = Math.max(80, right - left);
    const h = Math.max(80, bottom - top);

    const bounds = {
      cx: left + w / 2,
      cy: top + h * 0.55,
      scaleX: w * 0.44,
      scaleY: h * 0.44
    };

    const proj = projectModel(geo.shape, geo.rotX, geo.rotY, bounds);
    if (proj) {
      geo.points = proj.points;
      geo.edges = proj.edges;
      geo.is3D = true;
    }
  }

  // 4. Giao diện Phòng chiếu Không gian 3D 360° (3D Viewer Modal)
  let elModal = null;
  let elCanvas = null;
  let ctx3D = null;
  let activeGeoElement = null;
  let viewerState = {
    shape: 'pyramid-quad',
    rotX: 0.35,
    rotY: 0.5,
    scale: 120,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    isAutoSpin: false,
    spinSpeed: 0.015,
    spinAnimId: null,
    showFaces: true,
    showLabels: true,
    showAxes: false
  };

  function initViewerUI() {
    elModal = document.getElementById('hhkg-viewer-window');
    if (!elModal) return;

    elCanvas = document.getElementById('hhkg-viewer-canvas');
    if (elCanvas) {
      ctx3D = elCanvas.getContext('2d');
      setupViewerMouseEvents();
    }

    // Các nút bấm điều khiển trong Modal 3D
    const btnClose = document.getElementById('hhkg-btn-close-viewer');
    if (btnClose) {
      btnClose.addEventListener('click', closeViewer);
    }

    const btnAutoSpin = document.getElementById('hhkg-btn-modal-autospin');
    if (btnAutoSpin) {
      btnAutoSpin.addEventListener('click', toggleAutoSpin);
    }

    const btnResetView = document.getElementById('hhkg-btn-modal-reset');
    if (btnResetView) {
      btnResetView.addEventListener('click', resetView);
    }

    const btnToggleFaces = document.getElementById('hhkg-btn-modal-faces');
    if (btnToggleFaces) {
      btnToggleFaces.addEventListener('click', () => {
        viewerState.showFaces = !viewerState.showFaces;
        btnToggleFaces.classList.toggle('active', viewerState.showFaces);
        render3DViewer();
      });
    }

    const btnApply = document.getElementById('hhkg-btn-modal-apply');
    if (btnApply) {
      btnApply.addEventListener('click', applyCurrentViewToPage);
    }
  }

  function setupViewerMouseEvents() {
    if (!elCanvas) return;

    elCanvas.addEventListener('mousedown', (e) => {
      viewerState.isDragging = true;
      viewerState.lastX = e.clientX;
      viewerState.lastY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!viewerState.isDragging) return;
      const dx = e.clientX - viewerState.lastX;
      const dy = e.clientY - viewerState.lastY;

      viewerState.rotY += dx * 0.012;
      viewerState.rotX = Math.max(-0.8, Math.min(1.2, viewerState.rotX + dy * 0.012));

      viewerState.lastX = e.clientX;
      viewerState.lastY = e.clientY;

      render3DViewer();
    });

    window.addEventListener('mouseup', () => {
      viewerState.isDragging = false;
    });

    // Cuộn chuột phóng to / thu nhỏ
    elCanvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.92 : 1.08;
      viewerState.scale = Math.max(60, Math.min(260, viewerState.scale * zoomFactor));
      render3DViewer();
    }, { passive: false });
  }

  function render3DViewer() {
    if (!elCanvas || !ctx3D) return;

    const w = elCanvas.width;
    const h = elCanvas.height;
    ctx3D.clearRect(0, 0, w, h);

    // Nền gradient tinh tế tạo chiều sâu phòng chiếu
    const bgGrad = ctx3D.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w / 1.5);
    bgGrad.addColorStop(0, '#1c2420');
    bgGrad.addColorStop(1, '#0e1310');
    ctx3D.fillStyle = bgGrad;
    ctx3D.fillRect(0, 0, w, h);

    const bounds = {
      cx: w / 2,
      cy: h * 0.54,
      scaleX: viewerState.scale,
      scaleY: viewerState.scale
    };

    const proj = projectModel(viewerState.shape, viewerState.rotX, viewerState.rotY, bounds);
    if (!proj) return;

    const model = MODELS_3D[viewerState.shape];

    // 1. Vẽ các mặt phẳng 3D bán trong suốt (Shaded Faces)
    if (viewerState.showFaces && proj.faces) {
      proj.faces.forEach((face, fIdx) => {
        const isFront = proj.faceFront[fIdx];
        if (!isFront) return; // Chỉ tô các mặt quay về phía trước

        ctx3D.save();
        ctx3D.beginPath();
        face.forEach((vIdx, i) => {
          const pt = proj.points[vIdx];
          if (i === 0) ctx3D.moveTo(pt.x, pt.y);
          else ctx3D.lineTo(pt.x, pt.y);
        });
        ctx3D.closePath();

        // Độ sáng dựa trên góc chiếu sáng ảo từ trên cao (0.2, 0.9, 0.4)
        const norm = computeFaceNormal(proj.rotatedVerts[face[0]], proj.rotatedVerts[face[1]], proj.rotatedVerts[face[2]]);
        const len = Math.hypot(norm[0], norm[1], norm[2]) || 1;
        const dot = Math.max(0.1, (norm[0] * 0.2 + norm[1] * 0.8 + norm[2] * 0.5) / len);

        ctx3D.fillStyle = `rgba(34, 197, 94, ${0.15 + dot * 0.22})`;
        ctx3D.fill();
        ctx3D.restore();
      });
    }

    // 2. Vẽ các cạnh (Cạnh nét đứt vẽ trước, nét liền vẽ sau)
    const drawEdges = (isDashed) => {
      proj.edges.forEach((edge) => {
        const style = edge[2];
        if ((isDashed && style !== 'dashed') || (!isDashed && style === 'dashed')) return;

        const p1 = proj.points[edge[0]];
        const p2 = proj.points[edge[1]];
        if (!p1 || !p2) return;

        ctx3D.save();
        if (style === 'dashed') {
          ctx3D.setLineDash([7, 5]);
          ctx3D.strokeStyle = 'rgba(148, 163, 184, 0.85)';
          ctx3D.lineWidth = 1.8;
        } else {
          ctx3D.setLineDash([]);
          ctx3D.strokeStyle = '#4ade80'; // Xanh ngọc lục bảo sắc nét
          ctx3D.lineWidth = 2.4;
        }

        ctx3D.beginPath();
        ctx3D.moveTo(p1.x, p1.y);
        ctx3D.lineTo(p2.x, p2.y);
        ctx3D.stroke();
        ctx3D.restore();
      });
    };

    drawEdges(true);  // Vẽ nét đứt
    drawEdges(false); // Vẽ nét liền

    // 3. Vẽ các điểm đỉnh & Tên đỉnh
    if (viewerState.showLabels) {
      ctx3D.save();
      ctx3D.font = '700 14px -apple-system, sans-serif';
      proj.points.forEach((pt) => {
        // Chấm đỉnh
        ctx3D.beginPath();
        ctx3D.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx3D.fillStyle = '#ffffff';
        ctx3D.fill();
        ctx3D.lineWidth = 1.5;
        ctx3D.strokeStyle = '#15803d';
        ctx3D.stroke();

        // Nhãn tên
        if (pt.name) {
          ctx3D.fillStyle = '#f8fafc';
          ctx3D.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx3D.shadowBlur = 4;
          ctx3D.fillText(pt.name, pt.x + (pt.offX || 0), pt.y + (pt.offY || 0));
        }
      });
      ctx3D.restore();
    }
  }

  function openViewer(element) {
    if (!elModal) initViewerUI();
    if (!elModal) return;

    activeGeoElement = element;
    if (element && element.shape && MODELS_3D[element.shape]) {
      viewerState.shape = element.shape;
      viewerState.rotX = element.rotX !== undefined ? element.rotX : MODELS_3D[element.shape].defaultRot.rotX;
      viewerState.rotY = element.rotY !== undefined ? element.rotY : MODELS_3D[element.shape].defaultRot.rotY;
    }

    const titleEl = document.getElementById('hhkg-viewer-title');
    if (titleEl && MODELS_3D[viewerState.shape]) {
      titleEl.textContent = `📐 PHÒNG CHIẾU 3D 360°: ${MODELS_3D[viewerState.shape].name}`;
    }

    elModal.style.display = 'flex';
    render3DViewer();
  }

  function closeViewer() {
    if (!elModal) return;
    elModal.style.display = 'none';
    if (viewerState.isAutoSpin) {
      stopAutoSpin();
    }
  }

  function toggleAutoSpin() {
    if (viewerState.isAutoSpin) {
      stopAutoSpin();
    } else {
      startAutoSpin();
    }
  }

  function startAutoSpin() {
    viewerState.isAutoSpin = true;
    const btn = document.getElementById('hhkg-btn-modal-autospin');
    if (btn) {
      btn.innerHTML = '<span>⏸ Tạm dừng</span>';
      btn.classList.add('active');
    }

    function spinStep() {
      if (!viewerState.isAutoSpin) return;
      viewerState.rotY = (viewerState.rotY + viewerState.spinSpeed) % (Math.PI * 2);
      render3DViewer();
      viewerState.spinAnimId = requestAnimationFrame(spinStep);
    }
    viewerState.spinAnimId = requestAnimationFrame(spinStep);
  }

  function stopAutoSpin() {
    viewerState.isAutoSpin = false;
    if (viewerState.spinAnimId) {
      cancelAnimationFrame(viewerState.spinAnimId);
      viewerState.spinAnimId = null;
    }
    const btn = document.getElementById('hhkg-btn-modal-autospin');
    if (btn) {
      btn.innerHTML = '<span>▶ Tự động quay 360°</span>';
      btn.classList.remove('active');
    }
  }

  function resetView() {
    const model = MODELS_3D[viewerState.shape];
    if (model) {
      viewerState.rotX = model.defaultRot.rotX;
      viewerState.rotY = model.defaultRot.rotY;
      viewerState.scale = 120;
      render3DViewer();
    }
  }

  function applyCurrentViewToPage() {
    if (activeGeoElement && window.__netApply3DRotation) {
      window.__netApply3DRotation(activeGeoElement, viewerState.rotX, viewerState.rotY);
    }
    closeViewer();
  }

  // 5. Xuất API ra môi trường toàn cục
  window.__hhkg3d = {
    MODELS_3D: MODELS_3D,
    projectModel: projectModel,
    rotateElement: rotateElementOnCanvas,
    openViewer: openViewer,
    closeViewer: closeViewer,
    initUI: initViewerUI,
    render3DViewer: render3DViewer,
    state: viewerState
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewerUI);
  } else {
    initViewerUI();
  }
})(window);
