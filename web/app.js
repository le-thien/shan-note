/**
 * Nét — Bảng viết & Dựng hình học cho Mac (App Logic)
 * Bám sát yêu cầu kỹ thuật & kiến trúc trong NET_PROJECT.md
 */

document.addEventListener('DOMContentLoaded', () => {
  // Đảm bảo tiêu đề luôn bám sát slogan mới
  document.title = "Nét — Một khoảng trống cho mọi ý tưởng";

  // 1. Tham chiếu phần tử DOM
  const canvas = document.getElementById('main-canvas') || document.querySelector('.main-canvas');
  let ctx = canvas ? canvas.getContext('2d') : null;
  const paperSheet = document.getElementById('paper-sheet') || document.querySelector('.paper-sheet');
  const canvasContainer = document.getElementById('canvas-container');
  const pagesContainer = document.getElementById('pages-container');

  function getCanvasForPage(pageNum = state.currentPage) {
    if (pageNum !== undefined && pageNum !== null) {
      const specific = document.querySelector(`canvas[data-page="${pageNum}"]`);
      if (specific) return specific;
    }
    return document.querySelector('.main-canvas') || canvas;
  }
  function getPaperSheetForPage(pageNum = state.currentPage) {
    if (pageNum !== undefined && pageNum !== null) {
      const specific = document.querySelector(`.paper-sheet[data-page="${pageNum}"]`);
      if (specific) return specific;
    }
    return document.querySelector('.paper-sheet') || paperSheet;
  }
  function getPaperWrapperForPage(pageNum = state.currentPage) {
    if (pageNum !== undefined && pageNum !== null) {
      const specific = document.querySelector(`.paper-wrapper[data-page="${pageNum}"]`);
      if (specific) return specific;
    }
    return document.querySelector('.paper-wrapper');
  }

  // Nút công cụ
  const toolButtons = document.querySelectorAll('.tool-btn');
  const geoButtons = document.querySelectorAll('.geo-btn');
  const colorSwatches = document.querySelectorAll('.color-swatch');
  const customColorInput = document.getElementById('input-custom-color');
  const sizeButtons = document.querySelectorAll('.size-btn');
  const strokeSolidBtn = document.getElementById('stroke-solid');
  const strokeDashedBtn = document.getElementById('stroke-dashed');
  const selectGrid = document.getElementById('select-grid');
  const angleDegreesInput = document.getElementById('input-angle-degrees');
  const angleInputContainer = document.getElementById('geo-angle-input-container');
  const ellipseAxisAInput = document.getElementById('input-ellipse-axis-a');
  const ellipseAxisBInput = document.getElementById('input-ellipse-axis-b');
  const ellipseAxesContainer = document.getElementById('geo-ellipse-axes-container');

  // Quản lý trang & Hoàn tác
  const pagesList = document.getElementById('pages-list');
  const btnAddPage = document.getElementById('btn-add-page');
  const btnUndo = document.getElementById('btn-undo');
  const btnRedo = document.getElementById('btn-redo');

  // Sidebar trang thu nhỏ bên trái & Khổ giấy dọc/ngang
  const pagesSidebar = document.getElementById('pages-sidebar');
  const pagesThumbnailList = document.getElementById('pages-thumbnail-list');
  const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
  const btnSidebarCollapse = document.getElementById('btn-sidebar-collapse');
  const sidebarTitle = document.getElementById('sidebar-title');
  const btnSidebarAddPage = document.getElementById('btn-sidebar-add-page');
  const btnOrientPortrait = document.getElementById('btn-orient-portrait');
  const btnOrientLandscape = document.getElementById('btn-orient-landscape');
  const orientDropdownContainer = document.getElementById('orient-dropdown-container');
  const btnOrientDropdown = document.getElementById('btn-orient-dropdown');
  const orientDropdownLabel = document.getElementById('orient-dropdown-label');
  const orientDropdownIcon = document.getElementById('orient-dropdown-icon');

  // Menu tùy chọn thao tác trang [...]
  const pageMoreContainer = document.getElementById('page-more-container');
  const btnPageMore = document.getElementById('btn-page-more');
  const btnPageRename = document.getElementById('btn-page-rename');
  const btnPageDuplicate = document.getElementById('btn-page-duplicate');
  const btnPageDelete = document.getElementById('btn-page-delete');

  // Phóng to / Thu nhỏ & Xuất file
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnZoomReset = document.getElementById('btn-zoom-reset');
  const zoomLevelDisplay = document.getElementById('zoom-level');
  const btnExportPng = document.getElementById('btn-export-png');
  const btnClearCanvas = document.getElementById('btn-clear-canvas');

  // Thanh trạng thái
  const statusToolInfo = document.getElementById('status-tool-info') || { textContent: '' };
  const statusPressureInfo = document.getElementById('status-pressure-info') || { textContent: '' };

  // 2. Trạng thái ứng dụng (Application State)
  const state = {
    orientation: 'portrait', // 'portrait' (khổ dọc 1100x1560) | 'landscape' (khổ ngang 1600x1060)
    activeTool: 'pen', // 'pen' | 'highlighter' | 'eraser' | 'select' | 'text' | 'geo'
    activeGeo: null,   // 'line' | 'circle' | 'angle' | 'triangle' | 'right-triangle' | 'isosceles-triangle' | 'inscribed-triangle' | 'tangent'
    color: '#30493c',
    strokeWidth: 2.5,
    dashStyle: 'solid', // 'solid' | 'dashed'
    currentPage: 1,
    zoom: 1.0,
    isDrawing: false,
    currentPath: [],
    geoStartPoint: null,
    // Công cụ chọn đối tượng và điểm nút điều khiển (Select / Multi-Select / Vertex Handles)
    selectedElement: null,
    selectedElements: [],
    selectedEdge: null,
    selectedVertex: null,
    pendingSingleSelect: null,
    activeHandle: null,
    hoverHandle: null,
    hoverElement: null,
    handleAdjustInitial: null,
    dragLast: null,
    totalMoved: { dx: 0, dy: 0 },
    // Trạng thái bật hiển thị tay cầm xoay bên ngoài hình (mặc định tắt, cần mới chọn)
    showRotationHandle: false,
    // Chỉ báo mũi tên nhọn khi hover trúng điểm hình học
    hoverPointTarget: null,
    // Chế độ tẩy: 'object' (xóa hết đối tượng) hoặc 'partial' (xóa từng tí khi rê tẩy vào)
    eraserMode: 'partial',
    eraserRadius: 12,
    eraseHighlighterOnly: false,
    autoSwitchToPen: false,
    eraserCursorPoint: null,
    eraserLastPoint: null,
    // Trạng thái hover xem trước cho Trung điểm và Phân giác
    midpointHoverEdge: null,
    midpointHoverPoint: null,
    bisectorHoverEdge: null,
    bisectorHoverVertex: null,
    // Trạng thái chọn điểm, đường tròn và cạnh để dựng hình (Vuông góc, Song song, Phân giác, Tiếp tuyến, Chọn góc)
    construction: { point: null, circle: null, line: null, edges: [] },
    pendingConstruction: null,
    // 2 tùy chọn gợi ý nét đứt cho Tiếp tuyến và Chọn góc (để người dùng bấm chọn)
    pendingOptions: null,
    hoveredOptionIndex: -1,
    // Tiêu đề/tên riêng của từng trang
    pageTitles: {
      1: 'Trang 1',
      2: 'Trang 2'
    },
    // Dữ liệu từng trang lưu danh sách các phần tử (Objects) - khởi tạo sẵn Trang 1 và Trang 2 nối tiếp
    pages: {
      1: [],
      2: []
    },
    // Ngăn xếp hoàn tác / làm lại theo từng trang
    undoStacks: { 1: [], 2: [] },
    redoStacks: { 1: [], 2: [] }
  };

  // Lấy kích thước chuẩn của trang giấy theo khổ Dọc hoặc Ngang
  function getCanvasDimensions() {
    if (state.orientation === 'portrait') {
      return { width: 1100, height: 1560 };
    }
    return { width: 1600, height: 1060 };
  }

  // 3. Khởi tạo Canvas sắc nét cho màn hình Retina (hỗ trợ nhiều trang liên tục)
  function setupRetinaCanvasFor(targetCanvas) {
    if (!targetCanvas) return;
    const dpr = window.devicePixelRatio || 1;
    const dims = getCanvasDimensions();

    targetCanvas.width = dims.width * dpr;
    targetCanvas.height = dims.height * dpr;
    targetCanvas.style.width = '100%';
    targetCanvas.style.height = '100%';

    const targetCtx = targetCanvas.getContext('2d');
    targetCtx.scale(dpr, dpr);
  }

  function setupRetinaCanvas() {
    document.querySelectorAll('canvas.main-canvas, #main-canvas').forEach(c => {
      setupRetinaCanvasFor(c);
    });
    renderPage();
  }

  // Chuyển đổi tọa độ con trỏ chuột/bút thành tọa độ thực của Canvas trên từng trang
  function getCanvasCoordinates(e) {
    const targetCanvas = state.activeCanvas || (e && e.currentTarget) || (e && e.target && e.target.closest('canvas')) || getCanvasForPage(state.currentPage) || canvas;
    const rect = targetCanvas.getBoundingClientRect();
    const dims = getCanvasDimensions();
    const scaleX = dims.width / (rect.width || dims.width);
    const scaleY = dims.height / (rect.height || dims.height);
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      pressure: e.pressure && e.pressure > 0 ? e.pressure : 0.5,
      pointerType: e.pointerType || 'mouse'
    };
  }

  // 4. Cơ chế vẽ lại toàn bộ các trang (Renderer)
  function renderPage(targetPageNum) {
    const pageNums = targetPageNum ? [targetPageNum] : Object.keys(state.pages).map(Number);
    for (const p of pageNums) {
      const pageCanvas = (typeof ensurePageInDOM === 'function' ? ensurePageInDOM(p) : null) || getCanvasForPage(p);
      if (!pageCanvas) continue;
      const targetCtx = pageCanvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;

      targetCtx.setTransform(1, 0, 0, 1, 0, 0);
      targetCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
      targetCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const prevCtx = ctx;
      ctx = targetCtx;

      const elements = state.pages[p] || [];
      for (const el of elements) {
        drawElement(el);
      }

      // Hiển thị khung viền chọn và các nút điều khiển (CHỈ khi đang ở công cụ Chọn đối tượng)
      if (state.activeTool === 'select') {
        const selectedList = state.selectedElements && state.selectedElements.length > 0
          ? state.selectedElements
          : (state.selectedElement ? [state.selectedElement] : []);

        for (const el of selectedList) {
          if (elements.includes(el)) {
            drawSelectionOutline(el);
          }
        }

        // Làm sáng nhẹ hình đang hover nhưng chưa chọn để người dùng dễ hình dung trước khi bấm (chỉ sáng đơn lẻ một đối tượng)
        if (state.hoverElement && elements.includes(state.hoverElement)) {
          if (!selectedList.includes(state.hoverElement)) {
            highlightElementShape(targetCtx, state.hoverElement, false);
          }
        }

        if (selectedList.length > 0) {
          for (const el of selectedList) {
            if (elements.includes(el)) {
              drawControlHandles(el);
            }
          }
        } else if (selectedList.length === 0) {
          // Khi chưa có hình nào được chọn: Nếu hover gần đỉnh/đầu mút hoặc hình học, vẽ các chấm điều khiển trực quan đón trước
          if (state.hoverHandle && elements.includes(state.hoverHandle.element)) {
            drawControlHandles(state.hoverHandle.element, true);
          } else if (state.hoverElement && elements.includes(state.hoverElement)) {
            drawControlHandles(state.hoverElement, true);
          }
        }

        // Vẽ sáng cạnh đã chọn (selectedEdge) - chỉ vẽ khi phần tử đang được chọn và không trong thao tác kéo/xoay hình
        if (state.selectedEdge && state.currentPage === p && !state.activeHandle && !state.isDrawing) {
          const edgeEl = state.selectedEdge.element;
          if (edgeEl && elements.includes(edgeEl) && isElementSelected(edgeEl)) {
            let eStart = state.selectedEdge.start;
            let eEnd = state.selectedEdge.end;
            if (edgeEl.shape === 'line') {
              eStart = edgeEl.start;
              eEnd = edgeEl.end;
            } else if (edgeEl.points && state.selectedEdge.v1Index !== undefined && state.selectedEdge.v2Index !== undefined) {
              eStart = edgeEl.points[state.selectedEdge.v1Index];
              eEnd = edgeEl.points[state.selectedEdge.v2Index];
            }
            if (eStart && eEnd) {
              targetCtx.save();
              targetCtx.strokeStyle = '#10b981';
              targetCtx.lineWidth = (edgeEl.width || 2) + 6;
              targetCtx.lineCap = 'round';
              targetCtx.globalAlpha = 0.55;
              targetCtx.beginPath();
              targetCtx.moveTo(eStart.x, eStart.y);
              targetCtx.lineTo(eEnd.x, eEnd.y);
              targetCtx.stroke();
              targetCtx.restore();
            }
          } else {
            state.selectedEdge = null;
          }
        }

        // Vẽ sáng đỉnh đã chọn (selectedVertex) - chỉ vẽ đỉnh hình học thật sự của phần tử đang được chọn và không trong thao tác kéo/xoay hình
        if (state.selectedVertex && state.currentPage === p && !state.activeHandle && !state.isDrawing) {
          const vEl = state.selectedVertex.element;
          if (vEl && elements.includes(vEl) && isElementSelected(vEl)) {
            let vPt = null;
            if (vEl.shape === 'point') {
              vPt = vEl.start;
            } else if (vEl.points && state.selectedVertex.vIndex !== undefined && vEl.points[state.selectedVertex.vIndex]) {
              vPt = vEl.points[state.selectedVertex.vIndex];
            } else if (state.selectedVertex.handleId && state.selectedVertex.handleId.startsWith('p') && vEl.points) {
              const idx = parseInt(state.selectedVertex.handleId.replace('p', ''), 10);
              if (!isNaN(idx) && vEl.points[idx]) {
                vPt = vEl.points[idx];
              }
            } else if (vEl.shape === 'line' && (state.selectedVertex.handleId === 'start' || state.selectedVertex.handleId === 'end')) {
              vPt = vEl[state.selectedVertex.handleId];
            }
            if (vPt) {
              targetCtx.save();
              targetCtx.beginPath();
              targetCtx.arc(vPt.x, vPt.y, 14, 0, Math.PI * 2);
              targetCtx.fillStyle = 'rgba(16, 185, 129, 0.4)';
              targetCtx.fill();
              targetCtx.beginPath();
              targetCtx.arc(vPt.x, vPt.y, 5.5, 0, Math.PI * 2);
              targetCtx.fillStyle = '#10b981';
              targetCtx.fill();
              targetCtx.strokeStyle = '#ffffff';
              targetCtx.lineWidth = 2;
              targetCtx.stroke();
              targetCtx.restore();
            } else {
              state.selectedVertex = null;
            }
          } else {
            state.selectedVertex = null;
          }
        }
      }

      // Hiển thị chỉ báo mũi tên nhọn khi hover trúng điểm trong công cụ Chọn đối tượng
      if (state.activeTool === 'select' && state.hoverPointTarget && !isElementSelected(state.hoverPointTarget) && elements.includes(state.hoverPointTarget)) {
        drawSharpArrowIndicator(targetCtx, state.hoverPointTarget.start.x, state.hoverPointTarget.start.y, 'Điểm', false);
      }

      // Hiển thị chỉ báo mũi tên nhọn khi hover trúng đỉnh tam giác hoặc đầu mút
      if (state.activeTool === 'select' && state.hoverHandle && elements.includes(state.hoverHandle.element)) {
        const h = state.hoverHandle.handle;
        drawSharpArrowIndicator(targetCtx, h.x, h.y, h.name || 'Đỉnh', false);
      }

      // Hiển thị vòng tròn bắt dính và mũi tên nhọn khi kéo chỉnh đỉnh tam giác hoặc đoạn thẳng
      if (state.activeTool === 'select' && state.activeHandle && state.hoverSnapPoint && state.currentPage === p) {
        drawSharpArrowIndicator(targetCtx, state.hoverSnapPoint.x, state.hoverSnapPoint.y, state.hoverSnapPoint.label || 'Bắt dính', true);
      }

      // Hiển thị vòng tròn bắt dính và mũi tên nhọn khi vẽ đoạn thẳng hoặc tạo điểm gắn trên đường thẳng / đường tròn
      if (state.activeTool === 'geo' && (state.activeGeo === 'line' || state.activeGeo === 'point') && state.hoverSnapPoint && state.currentPage === p) {
        drawSharpArrowIndicator(targetCtx, state.hoverSnapPoint.x, state.hoverSnapPoint.y, state.hoverSnapPoint.label || 'Bắt dính điểm', false);
      }

      // Hiển thị vòng tròn đầu tẩy siêu nhỏ gọn, cực mảnh, thanh thoát khi ở chế độ xóa từng tí
      if (state.activeTool === 'eraser' && state.eraserMode === 'partial' && state.eraserCursorPoint && state.currentPage === p) {
        targetCtx.save();
        targetCtx.beginPath();
        targetCtx.arc(state.eraserCursorPoint.x, state.eraserCursorPoint.y, state.eraserRadius || 3, 0, Math.PI * 2);
        targetCtx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
        targetCtx.lineWidth = 0.6;
        targetCtx.setLineDash([1.5, 1.5]);
        targetCtx.fillStyle = 'rgba(239, 68, 68, 0.04)';
        targetCtx.fill();
        targetCtx.stroke();

        targetCtx.beginPath();
        targetCtx.arc(state.eraserCursorPoint.x, state.eraserCursorPoint.y, 0.5, 0, Math.PI * 2);
        targetCtx.fillStyle = '#ef4444';
        targetCtx.fill();
        targetCtx.restore();
      }

      // Hiển thị các điểm và cạnh đang được chọn trong quá trình dựng hình
      if ((state.activeTool === 'geo' || state.activeTool === 'select') && state.construction && (state.pendingConstruction || state.construction.point || state.construction.line || state.construction.circle || (state.construction.edges && state.construction.edges.length > 0)) && state.currentPage === p) {
        drawConstructionHighlights();
      }

      // Hiển thị 2 tùy chọn nét đứt cho Tiếp tuyến hoặc Chọn góc (để người dùng bấm chọn)
      if (state.pendingOptions && state.currentPage === p) {
        drawPendingOptions(targetCtx);
      }

      ctx = prevCtx;

      if (typeof updateThumbnail === 'function') {
        updateThumbnail(p);
      }
    }

    const curCanvas = getCanvasForPage(state.currentPage);
    if (curCanvas) ctx = curCanvas.getContext('2d');
    if (typeof updateThumbnailActive === 'function') {
      updateThumbnailActive(state.currentPage);
    }
  }

  // Lấy danh sách các điểm nút điều khiển (Control Handles) của một hình học hoặc ảnh
  function getControlHandles(el) {
    if (!el) return [];
    const handles = [];

    // Nút điều khiển 4 góc cho ảnh để người dùng dễ dàng phóng to / thu nhỏ
    if (el.type === 'image') {
      handles.push({ id: 'top_left', x: el.x, y: el.y, cursor: 'nwse-resize', name: 'Góc trên-trái (kéo để co giãn)' });
      handles.push({ id: 'top_right', x: el.x + el.width, y: el.y, cursor: 'nesw-resize', name: 'Góc trên-phải (kéo để co giãn)' });
      handles.push({ id: 'bottom_left', x: el.x, y: el.y + el.height, cursor: 'nesw-resize', name: 'Góc dưới-trái (kéo để co giãn)' });
      handles.push({ id: 'bottom_right', x: el.x + el.width, y: el.y + el.height, cursor: 'nwse-resize', name: 'Góc dưới-phải (kéo để co giãn)' });
      return handles;
    }

    // Nút điều khiển 4 góc cho Graph Widget
    if (el.type === 'graph-widget') {
      handles.push({ id: 'top_left', x: el.x, y: el.y, cursor: 'nwse-resize', name: 'Góc co giãn đồ thị (trên-trái)', isWidgetResize: true });
      handles.push({ id: 'top_right', x: el.x + el.width, y: el.y, cursor: 'nesw-resize', name: 'Góc co giãn đồ thị (trên-phải)', isWidgetResize: true });
      handles.push({ id: 'bottom_left', x: el.x, y: el.y + el.height, cursor: 'nesw-resize', name: 'Góc co giãn đồ thị (dưới-trái)', isWidgetResize: true });
      handles.push({ id: 'bottom_right', x: el.x + el.width, y: el.y + el.height, cursor: 'nwse-resize', name: 'Góc co giãn đồ thị (dưới-phải)', isWidgetResize: true });
      return handles;
    }

    if (el.type !== 'geo') return [];

    if (el.shape === 'line') {
      const snapStart = checkCircleSnap(el.start, el);
      const snapEnd = checkCircleSnap(el.end, el);
      handles.push({ id: 'start', x: el.start.x, y: el.start.y, name: 'Đầu mút 1', isSnapped: !!snapStart });
      handles.push({ id: 'end', x: el.end.x, y: el.end.y, name: 'Đầu mút 2', isSnapped: !!snapEnd });
    } else if (el.shape === 'triangle' || el.shape === 'right-triangle' || el.shape === 'isosceles-triangle') {
      if (!el.points || el.points.length !== 3) {
        if (el.shape === 'right-triangle') {
          el.points = [
            { x: el.start.x, y: el.start.y },
            { x: el.start.x, y: el.end.y },
            { x: el.end.x, y: el.end.y }
          ];
        } else {
          el.points = [
            { x: (el.start.x + el.end.x) / 2, y: el.start.y },
            { x: el.start.x, y: el.end.y },
            { x: el.end.x, y: el.end.y }
          ];
        }
      }
      handles.push({ id: 'p0', index: 0, x: el.points[0].x, y: el.points[0].y, name: 'Đỉnh 1' });
      handles.push({ id: 'p1', index: 1, x: el.points[1].x, y: el.points[1].y, name: 'Đỉnh 2' });
      handles.push({ id: 'p2', index: 2, x: el.points[2].x, y: el.points[2].y, name: 'Đỉnh 3' });
    } else if (el.shape === 'rectangle' || el.shape === 'square' || el.shape === 'parallelogram' || el.shape === 'rhombus') {
      if (!el.points || el.points.length !== 4) {
        const dx = el.end.x - el.start.x;
        const dy = el.end.y - el.start.y;
        if (el.shape === 'square') {
          const s = Math.max(Math.abs(dx), Math.abs(dy));
          const sx = (dx >= 0 ? 1 : -1) * s;
          const sy = (dy >= 0 ? 1 : -1) * s;
          el.points = [
            { x: el.start.x, y: el.start.y },
            { x: el.start.x + sx, y: el.start.y },
            { x: el.start.x + sx, y: el.start.y + sy },
            { x: el.start.x, y: el.start.y + sy }
          ];
        } else if (el.shape === 'rhombus') {
          const cx = (el.start.x + el.end.x) / 2;
          const cy = (el.start.y + el.end.y) / 2;
          const rx = Math.abs(dx) / 2;
          const ry = Math.abs(dy) / 2;
          el.points = [
            { x: cx, y: cy - ry },
            { x: cx + rx, y: cy },
            { x: cx, y: cy + ry },
            { x: cx - rx, y: cy }
          ];
        } else if (el.shape === 'parallelogram') {
          const skew = dx * 0.25;
          el.points = [
            { x: el.start.x + skew, y: el.start.y },
            { x: el.end.x, y: el.start.y },
            { x: el.end.x - skew, y: el.end.y },
            { x: el.start.x, y: el.end.y }
          ];
        } else {
          el.points = [
            { x: el.start.x, y: el.start.y },
            { x: el.end.x, y: el.start.y },
            { x: el.end.x, y: el.end.y },
            { x: el.start.x, y: el.end.y }
          ];
        }
      }
      for (let i = 0; i < 4; i++) {
        handles.push({ id: `p${i}`, index: i, x: el.points[i].x, y: el.points[i].y, name: `Đỉnh ${i + 1}` });
      }
    } else if (isSolidShape(el.shape)) {
      if (!el.points || el.points.length === 0) {
        const data = computeSolidShapeData(el.shape, el.start, el.end);
        el.points = data.points;
        el.edges = data.edges;
        el.is3D = true;
      }
      for (let i = 0; i < el.points.length; i++) {
        const p = el.points[i];
        handles.push({
          id: `p${i}`,
          index: i,
          x: p.x,
          y: p.y,
          name: p.name ? `Đỉnh ${p.name}` : `Đỉnh ${i + 1}`
        });
      }
      // Tay cầm xoay 3D (3D Rotation Handle): đưa ra ngoài đỉnh hình, chỉ hiển thị khi người dùng cần và bấm chọn
      const pTop = el.points[0];
      if (pTop && state.showRotationHandle) {
        handles.push({
          id: 'rot3d',
          x: pTop.x,
          y: pTop.y - 48,
          topY: pTop.y,
          isRotate3D: true,
          cursor: 'grab',
          name: 'Tay cầm xoay 3D 360° (Kéo chuột sang trái/phải để xoay)'
        });
      }
    } else if (el.shape === 'ellipse') {
      const rx = el.rx || 60;
      const ry = el.ry || 40;
      handles.push({ id: 'center', x: el.start.x, y: el.start.y, name: 'Tâm elip O' });
      handles.push({ id: 'axis_a', x: el.start.x + rx, y: el.start.y, name: 'Bán trục a (ngang)' });
      handles.push({ id: 'axis_b', x: el.start.x, y: el.start.y - ry, name: 'Bán trục b (dọc)' });
    } else if (el.shape === 'inscribed-triangle') {
      const r = Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
      if (!el.angles || el.angles.length !== 3) {
        el.angles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
      }
      for (let i = 0; i < 3; i++) {
        handles.push({
          id: `angle_${i}`,
          index: i,
          x: el.start.x + r * Math.cos(el.angles[i]),
          y: el.start.y + r * Math.sin(el.angles[i]),
          name: `Đỉnh nội tiếp ${i + 1}`,
          isSnapped: true
        });
      }
      handles.push({ id: 'center', x: el.start.x, y: el.start.y, name: 'Tâm đường tròn O' });
    } else if (el.shape === 'circle') {
      handles.push({ id: 'center', x: el.start.x, y: el.start.y, name: 'Tâm O' });
      handles.push({ id: 'radius', x: el.end.x, y: el.end.y, name: 'Bán kính R' });
    } else if (el.shape === 'tangent') {
      handles.push({ id: 'start', x: el.start.x, y: el.start.y, name: 'Đầu mút 1 (kéo thu hẹp/mở rộng)' });
      handles.push({ id: 'end', x: el.end.x, y: el.end.y, name: 'Đầu mút 2 (kéo thu hẹp/mở rộng)' });
    } else if (el.shape === 'point') {
      handles.push({ id: 'point', x: el.start.x, y: el.start.y, name: 'Điểm' });
    } else if (el.shape === 'two-tangents') {
      // 2 Tiếp tuyến: tâm O, điểm ngoài M
      handles.push({ id: 'center', x: el.start.x, y: el.start.y, name: 'Tâm O' });
      handles.push({ id: 'ext_point', x: el.end.x, y: el.end.y, name: 'Điểm giao nhau M (kéo 2 tiếp tuyến)' });
    } else if (el.shape === 'perpendicular') {
      handles.push({ id: 'start', x: el.start.x, y: el.start.y, name: 'Đầu mút 1 (kéo thu hẹp/mở rộng)' });
      handles.push({ id: 'end', x: el.end.x, y: el.end.y, name: 'Đầu mút 2 (kéo thu hẹp/mở rộng)' });
    } else if (el.shape === 'parallel') {
      handles.push({ id: 'start', x: el.start.x, y: el.start.y, name: 'Đầu mút 1 (kéo thu hẹp/mở rộng)' });
      handles.push({ id: 'end', x: el.end.x, y: el.end.y, name: 'Đầu mút 2 (kéo thu hẹp/mở rộng)' });
    } else if (el.shape === 'bisector') {
      handles.push({ id: 'start', x: el.start.x, y: el.start.y, name: 'Đỉnh góc V' });
      handles.push({ id: 'end', x: el.end.x, y: el.end.y, name: 'Đầu mút tia phân giác (kéo thu hẹp/mở rộng)' });
    } else if (el.shape === 'angle') {
      const armLen = el.armLength || 90;
      const deg = el.angleDeg || 60;
      const rad = (deg * Math.PI) / 180;
      const baseDir = (el.baseDir !== undefined) ? el.baseDir : Math.atan2(el.end.y - el.start.y, el.end.x - el.start.x);
      const dir = (el.direction !== undefined) ? el.direction : ((el.binding && el.binding.direction !== undefined) ? el.binding.direction : -1);
      const p2 = el.secondPoint || {
        x: el.start.x + armLen * Math.cos(baseDir + dir * rad),
        y: el.start.y + armLen * Math.sin(baseDir + dir * rad)
      };
      handles.push({ id: 'start', x: el.start.x, y: el.start.y, name: 'Đỉnh góc V' });
      handles.push({ id: 'second_pt', x: p2.x, y: p2.y, name: 'Đầu mút đường thứ hai (kéo xoay số đo góc)' });
    }

    // Tay cầm xoay 2D cho các hình phẳng (tam giác, tứ giác, chữ nhật, bình hành, thoi, đoạn thẳng...)
    // Đưa ra ngoài hình (cách mép trên 48px) và chỉ hiển thị khi người dùng cần và bấm chọn
    if (state.showRotationHandle && el.type === 'geo' && !isSolidShape(el.shape) && el.shape !== 'point' && handles.length > 0) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const h of handles) {
        if (h.x < minX) minX = h.x;
        if (h.x > maxX) maxX = h.x;
        if (h.y < minY) minY = h.y;
        if (h.y > maxY) maxY = h.y;
      }
      if (minX !== Infinity && (maxX - minX >= 15 || maxY - minY >= 15)) {
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        handles.push({
          id: 'rot2d',
          x: cx,
          y: minY - 48,
          isRotate2D: true,
          topY: minY,
          cx: cx,
          cy: cy,
          cursor: 'grab',
          name: 'Tay cầm xoay hình 🔄 (Kéo chuột để xoay toàn bộ hình và các yếu tố liên quan)'
        });
      }
    }

    return handles;
  }

  // Vẽ các chấm tròn điều khiển (Control Handles) với kích thước rõ nét, dễ nhìn và phản hồi tương tác
  function drawControlHandles(el, isHoverPreview = false) {
    const handles = getControlHandles(el);
    if (handles.length === 0) return;

    ctx.save();
    for (const h of handles) {
      const isHovered = (state.hoverHandle && state.hoverHandle.handle && state.hoverHandle.handle.id === h.id && state.hoverHandle.element === el);
      const isActive = (state.activeHandle && state.activeHandle.handle && state.activeHandle.handle.id === h.id && state.activeHandle.element === el);

      // Nếu là tay cầm xoay 3D hoặc xoay 2D
      if (h.isRotate3D || h.isRotate2D) {
        const topY = h.topY !== undefined ? h.topY : (el.points && el.points[0] ? el.points[0].y : (h.y + 48));
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(h.x, topY);
        ctx.lineTo(h.x, h.y);
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'rgba(22, 163, 74, 0.7)';
        ctx.stroke();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(h.x, h.y, (isHovered || isActive) ? 12 : 10.5, 0, Math.PI * 2);
        ctx.fillStyle = (isHovered || isActive) ? '#16a34a' : '#28634e';
        ctx.fill();
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.save();
        ctx.font = '700 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('🔄', h.x, h.y);
        ctx.restore();
        continue;
      }

      // Nếu đang hover hoặc đang kéo chấm này: vẽ vòng hào quang tương tác lớn bên ngoài
      if (isHovered || isActive) {
        ctx.beginPath();
        ctx.arc(h.x, h.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.22)';
        ctx.fill();
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = '#16a34a';
        ctx.stroke();
      } else if (h.isSnapped) {
        ctx.beginPath();
        ctx.arc(h.x, h.y, 11, 0, Math.PI * 2);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Đổ bóng nổi bật cho chấm điều khiển
      ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
      ctx.shadowBlur = isHovered ? 7 : 4;
      ctx.shadowOffsetY = 1.5;

      const baseRadius = (isHovered || isActive) ? 8.5 : (isHoverPreview ? 6.5 : 7.5);

      // Nền trắng tinh khiết
      ctx.beginPath();
      ctx.arc(h.x, h.y, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = isHoverPreview ? 'rgba(255, 255, 255, 0.9)' : '#ffffff';
      ctx.fill();

      // Viền xanh đậm nổi bật đặc trưng của Nét
      ctx.lineWidth = isHoverPreview ? 2 : 2.5;
      ctx.strokeStyle = isHoverPreview ? 'rgba(24, 78, 58, 0.7)' : '#184e3a';
      ctx.stroke();

      // Tâm điểm tiêu cự ở chính giữa (focal dot)
      ctx.beginPath();
      ctx.arc(h.x, h.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = (isHovered || isActive) ? '#16a34a' : '#184e3a';
      ctx.fill();
    }
    ctx.restore();
  }

  // Tìm điểm nút điều khiển dưới con trỏ với bán kính rộng (28px - 34px) và luôn ưu tiên nút gần nhất
  function findHandleAt(x, y, maxDistance = 28) {
    let best = null;
    let minDist = maxDistance;

    // 1. Ưu tiên cao nhất: Các nút điều khiển của phần tử đang được chọn (bán kính rộng tới 34px)
    if (state.selectedElement) {
      const handles = getControlHandles(state.selectedElement);
      for (const h of handles) {
        const d = Math.hypot(h.x - x, h.y - y);
        if (d <= maxDistance + 6 && d < minDist) {
          minDist = d;
          best = { handle: h, element: state.selectedElement, distance: d };
        }
      }
      if (best) return best;
    }

    // 2. Nếu có danh sách nhiều đối tượng đang chọn
    if (state.selectedElements && state.selectedElements.length > 0) {
      for (const el of state.selectedElements) {
        const handles = getControlHandles(el);
        for (const h of handles) {
          const d = Math.hypot(h.x - x, h.y - y);
          if (d <= maxDistance + 4 && d < minDist) {
            minDist = d;
            best = { handle: h, element: el, distance: d };
          }
        }
      }
      if (best) return best;
    }

    // 3. Tìm trong tất cả các hình vẽ trên trang (ưu tiên hình vẽ gần nhất)
    const list = state.pages[state.currentPage] || [];
    for (let i = list.length - 1; i >= 0; i--) {
      const el = list[i];
      if (el.type === 'geo' || el.type === 'image' || el.type === 'graph-widget') {
        const handles = getControlHandles(el);
        for (const h of handles) {
          const d = Math.hypot(h.x - x, h.y - y);
          if (d <= maxDistance && d < minDist) {
            minDist = d;
            best = { handle: h, element: el, distance: d };
          }
        }
      }
    }
    return best;
  }

  // Bắt dính thông minh (Magnetic Snapping) cho đỉnh tam giác hoặc đầu mút đoạn thẳng vào các điểm/hình khác
  function findSnapTargetForHandle(point, currentEl, currentHandle, maxDist = 22) {
    const list = state.pages[state.currentPage] || [];
    let best = null;
    let minDist = maxDist;

    function testPt(px, py, label) {
      const d = Math.hypot(point.x - px, point.y - py);
      if (d < minDist) {
        minDist = d;
        best = { x: px, y: py, label: label };
      }
    }

    for (let i = list.length - 1; i >= 0; i--) {
      const el = list[i];
      if (el.type !== 'geo') continue;

      if (el.shape === 'point') {
        if (el !== currentEl) testPt(el.start.x, el.start.y, 'Điểm');
      } else if (el.shape === 'line') {
        if (el !== currentEl || currentHandle.id !== 'start') testPt(el.start.x, el.start.y, 'Đầu mút');
        if (el !== currentEl || currentHandle.id !== 'end') testPt(el.end.x, el.end.y, 'Đầu mút');
      } else if (el.shape === 'triangle' || el.shape === 'right-triangle' || el.shape === 'isosceles-triangle' || el.shape === 'rectangle' || el.shape === 'square' || el.shape === 'parallelogram' || el.shape === 'rhombus' || isSolidShape(el.shape)) {
        if (el.points) {
          el.points.forEach((p, idx) => {
            if (el !== currentEl || currentHandle.index !== idx) {
              testPt(p.x, p.y, p.name ? `Đỉnh ${p.name}` : `Đỉnh ${idx + 1}`);
            }
          });
        }
      } else if (el.shape === 'circle' || el.shape === 'inscribed-triangle' || el.shape === 'two-tangents' || el.shape === 'ellipse') {
        if (el !== currentEl) testPt(el.start.x, el.start.y, 'Tâm O');
      }
    }

    const circSnap = checkCircleSnap(point, currentEl);
    if (circSnap && (!best || Math.hypot(point.x - circSnap.x, point.y - circSnap.y) < minDist)) {
      return { x: circSnap.x, y: circSnap.y, label: 'Chu vi đường tròn', isCircle: true };
    }

    return best;
  }

  // Kiểm tra bắt dính và gắn chặt vào đường tròn gần nhất (Circle Snapping)
  function checkCircleSnap(point, ignoreEl = null) {
    const list = state.pages[state.currentPage] || [];
    const snapDist = 24;

    for (const item of list) {
      if (item === ignoreEl) continue;
      if (item.type === 'geo' && (item.shape === 'circle' || item.shape === 'inscribed-triangle' || item.shape === 'tangent' || item.shape === 'two-tangents')) {
        const r = item.radius || Math.hypot(item.end.x - item.start.x, item.end.y - item.start.y);
        const d = Math.hypot(point.x - item.start.x, point.y - item.start.y);

        if (Math.abs(d - r) <= snapDist) {
          const angle = Math.atan2(point.y - item.start.y, point.x - item.start.x);
          return {
            x: item.start.x + r * Math.cos(angle),
            y: item.start.y + r * Math.sin(angle),
            circle: item,
            angle: angle
          };
        }
      }
    }
    return null;
  }

  // Vẽ chỉ báo mũi tên nhọn định vị chính xác đối tượng là điểm khi nằm lẫn lộn nhiều hình
  function drawSharpArrowIndicator(c, tx, ty, label = 'Điểm', isSelected = false) {
    c.save();

    // 1. Vòng tròn ngắm tâm đôi sắc nét quanh điểm
    c.beginPath();
    c.arc(tx, ty, isSelected ? 12 : 9, 0, Math.PI * 2);
    c.strokeStyle = isSelected ? '#28634e' : '#10b981';
    c.lineWidth = 1.8;
    if (!isSelected) {
      c.setLineDash([3, 3]);
    } else {
      c.setLineDash([]);
    }
    c.stroke();

    c.beginPath();
    c.arc(tx, ty, 3.5, 0, Math.PI * 2);
    c.fillStyle = isSelected ? '#28634e' : '#10b981';
    c.fill();

    // 2. Mũi tên nhọn chuẩn phong cách icon Chọn (macOS cursor) chỉ thẳng đầu nhọn vào tâm điểm
    const tipX = tx - 4;
    const tipY = ty - 4;

    c.save();
    c.shadowColor = 'rgba(0, 0, 0, 0.3)';
    c.shadowBlur = 6;
    c.shadowOffsetX = 1;
    c.shadowOffsetY = 2;

    // Tam giác nhọn chính của mũi tên
    c.beginPath();
    c.moveTo(tipX, tipY);
    c.lineTo(tipX - 22, tipY - 11);
    c.lineTo(tipX - 16, tipY - 16);
    c.lineTo(tipX - 11, tipY - 22);
    c.closePath();

    c.fillStyle = isSelected ? '#1b4332' : '#243c36';
    c.fill();
    c.strokeStyle = '#ffffff';
    c.lineWidth = 2;
    c.stroke();

    // Cán đuôi mũi tên
    c.beginPath();
    c.moveTo(tipX - 16, tipY - 16);
    c.lineTo(tipX - 26, tipY - 26);
    c.lineWidth = 2.5;
    c.strokeStyle = isSelected ? '#1b4332' : '#243c36';
    c.stroke();
    c.restore();

    // 3. Nhãn thông báo nổi bên cạnh mũi tên
    if (label) {
      c.save();
      c.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const textWidth = c.measureText(label).width;
      const tagX = tipX - 28 - textWidth;
      const tagY = tipY - 30;

      // Nền nhãn
      c.fillStyle = isSelected ? '#1b4332' : '#2d6a4f';
      if (typeof c.roundRect === 'function') {
        c.beginPath();
        c.roundRect(tagX - 6, tagY - 12, textWidth + 12, 18, 4);
        c.fill();
      } else {
        c.fillRect(tagX - 6, tagY - 12, textWidth + 12, 18);
      }

      // Chữ nhãn
      c.fillStyle = '#ffffff';
      c.textBaseline = 'middle';
      c.fillText(label, tagX, tagY - 3);
      c.restore();
    }

    c.restore();
  }

  // Con trỏ mũi tên nhọn chuẩn xác cho công cụ Chọn (macOS sharp arrow pointer)
  const SHARP_ARROW_CURSOR = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M3 3l7.2 17.5 3.2-7.1 7.1-3.2L3 3z' fill='%23184e3a' stroke='%23ffffff' stroke-width='1.5' stroke-linejoin='round'/></svg>\") 3 3, default";

  // Lớp phát sáng rực rỡ (Luminous Glow) cho hình học đối tượng khi chọn hoặc hover để người dùng dễ hình dung
  function highlightElementShape(c, el, isSelected = true) {
    if (!el) return;
    c.save();
    const glowAlpha = isSelected ? 0.45 : 0.22;
    const glowWidth = isSelected ? 10 : 5;
    const strokeGlow = isSelected ? `rgba(34, 197, 94, ${glowAlpha})` : `rgba(16, 185, 129, ${glowAlpha})`;
    const coreColor = isSelected ? '#184e3a' : '#10b981';

    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.shadowColor = isSelected ? 'rgba(34, 197, 94, 0.7)' : 'rgba(16, 185, 129, 0.4)';
    c.shadowBlur = isSelected ? 14 : 7;

    if (el.type === 'geo') {
      if (el.shape === 'point') {
        // Điểm hình học: Vẽ quầng sáng kép và chỉ báo mũi tên nhọn
        c.beginPath();
        c.arc(el.start.x, el.start.y, isSelected ? 13 : 9, 0, Math.PI * 2);
        c.fillStyle = isSelected ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.15)';
        c.fill();
        c.lineWidth = 2.5;
        c.strokeStyle = coreColor;
        c.stroke();
        drawSharpArrowIndicator(c, el.start.x, el.start.y, isSelected ? 'Điểm đã chọn' : 'Điểm', isSelected);
      } else if (el.shape === 'line' || el.shape === 'perpendicular' || el.shape === 'parallel' || el.shape === 'tangent' || el.shape === 'bisector') {
        // Đoạn thẳng: phát sáng toàn bộ chiều dài đoạn thẳng
        c.beginPath();
        c.moveTo(el.start.x, el.start.y);
        c.lineTo(el.end.x, el.end.y);
        c.lineWidth = (el.width || 2.5) + glowWidth;
        c.strokeStyle = strokeGlow;
        c.stroke();

        c.beginPath();
        c.moveTo(el.start.x, el.start.y);
        c.lineTo(el.end.x, el.end.y);
        c.lineWidth = (el.width || 2.5) + 1.8;
        c.strokeStyle = coreColor;
        c.stroke();
      } else if (el.shape === 'circle') {
        const r = el.radius || Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
        c.beginPath();
        c.arc(el.start.x, el.start.y, r, 0, Math.PI * 2);
        c.lineWidth = (el.width || 2.5) + glowWidth;
        c.strokeStyle = strokeGlow;
        c.stroke();

        c.beginPath();
        c.arc(el.start.x, el.start.y, r, 0, Math.PI * 2);
        c.lineWidth = (el.width || 2.5) + 1.8;
        c.strokeStyle = coreColor;
        c.stroke();
      } else if (el.shape === 'triangle' || el.shape === 'right-triangle' || el.shape === 'isosceles-triangle' || el.shape === 'rectangle' || el.shape === 'square' || el.shape === 'parallelogram' || el.shape === 'rhombus') {
        const pts = (el.points && el.points.length >= 3) ? el.points : [
          { x: (el.start.x + el.end.x) / 2, y: el.start.y },
          { x: el.start.x, y: el.end.y },
          { x: el.end.x, y: el.end.y }
        ];
        // Tô nhẹ lòng hình để mắt dễ dàng nhận diện trọn vẹn hình
        c.beginPath();
        c.moveTo(pts[0].x, pts[0].y);
        for (let j = 1; j < pts.length; j++) {
          c.lineTo(pts[j].x, pts[j].y);
        }
        c.closePath();
        c.fillStyle = isSelected ? 'rgba(34, 197, 94, 0.09)' : 'rgba(34, 197, 94, 0.04)';
        c.fill();

        // Các cạnh hình phát sáng quầng sáng xanh ngọc
        c.lineWidth = (el.width || 2.5) + glowWidth;
        c.strokeStyle = strokeGlow;
        c.stroke();

        c.lineWidth = (el.width || 2.5) + 1.8;
        c.strokeStyle = coreColor;
        c.stroke();
      } else if (el.shape === 'ellipse') {
        const rx = el.rx || 60;
        const ry = el.ry || 40;
        c.beginPath();
        c.ellipse(el.start.x, el.start.y, rx, ry, el.rotation || 0, 0, Math.PI * 2);
        c.fillStyle = isSelected ? 'rgba(34, 197, 94, 0.09)' : 'rgba(34, 197, 94, 0.04)';
        c.fill();

        c.lineWidth = (el.width || 2.5) + glowWidth;
        c.strokeStyle = strokeGlow;
        c.stroke();

        c.lineWidth = (el.width || 2.5) + 1.8;
        c.strokeStyle = coreColor;
        c.stroke();
      } else if (isSolidShape(el.shape)) {
        if (el.points && el.edges) {
          if (el.shape && el.shape.startsWith('pyramid')) {
            for (const edge of el.edges) {
              if ((edge[0] === 1 && edge[1] === 2) || (edge[0] === 2 && edge[1] === 1)) {
                edge[2] = 'dashed';
              }
            }
          }
          for (const edge of el.edges) {
            const p1 = el.points[edge[0]];
            const p2 = el.points[edge[1]];
            if (!p1 || !p2) continue;
            c.save();
            if (edge[2] === 'dashed') c.setLineDash([7, 5]);
            else c.setLineDash([]);
            c.beginPath();
            c.moveTo(p1.x, p1.y);
            c.lineTo(p2.x, p2.y);
            c.lineWidth = (el.width || 2) + glowWidth;
            c.strokeStyle = strokeGlow;
            c.stroke();
            c.lineWidth = (el.width || 2) + 1.8;
            c.strokeStyle = coreColor;
            c.stroke();
            c.restore();
          }
        }
      } else if (el.shape === 'inscribed-triangle') {
        const r = Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
        c.beginPath();
        c.arc(el.start.x, el.start.y, r, 0, Math.PI * 2);
        c.lineWidth = (el.width || 2.5) + glowWidth;
        c.strokeStyle = strokeGlow;
        c.stroke();

        const angles = (el.angles && el.angles.length === 3) ? el.angles : [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
        const p1 = { x: el.start.x + r * Math.cos(angles[0]), y: el.start.y + r * Math.sin(angles[0]) };
        const p2 = { x: el.start.x + r * Math.cos(angles[1]), y: el.start.y + r * Math.sin(angles[1]) };
        const p3 = { x: el.start.x + r * Math.cos(angles[2]), y: el.start.y + r * Math.sin(angles[2]) };

        c.beginPath();
        c.moveTo(p1.x, p1.y);
        c.lineTo(p2.x, p2.y);
        c.lineTo(p3.x, p3.y);
        c.closePath();
        c.fillStyle = isSelected ? 'rgba(34, 197, 94, 0.09)' : 'rgba(34, 197, 94, 0.04)';
        c.fill();
        c.lineWidth = (el.width || 2.5) + glowWidth;
        c.strokeStyle = strokeGlow;
        c.stroke();

        c.lineWidth = (el.width || 2.5) + 1.8;
        c.strokeStyle = coreColor;
        c.stroke();
      } else if (el.shape === 'two-tangents') {
        const r = el.radius || Math.max(30, Math.min(120, Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y) * 0.45));
        c.beginPath();
        c.arc(el.start.x, el.start.y, r, 0, Math.PI * 2);
        c.lineWidth = (el.width || 2.5) + glowWidth;
        c.strokeStyle = strokeGlow;
        c.stroke();

        const d = Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
        if (d > r) {
          const baseAngle = Math.atan2(el.end.y - el.start.y, el.end.x - el.start.x);
          const alpha = Math.acos(Math.min(1, Math.max(-1, r / d)));
          const t1 = { x: el.start.x + r * Math.cos(baseAngle + alpha), y: el.start.y + r * Math.sin(baseAngle + alpha) };
          const t2 = { x: el.start.x + r * Math.cos(baseAngle - alpha), y: el.start.y + r * Math.sin(baseAngle - alpha) };
          c.beginPath();
          c.moveTo(el.end.x, el.end.y);
          c.lineTo(t1.x, t1.y);
          c.moveTo(el.end.x, el.end.y);
          c.lineTo(t2.x, t2.y);
          c.lineWidth = (el.width || 2.5) + glowWidth;
          c.strokeStyle = strokeGlow;
          c.stroke();
        }
      } else if (el.shape === 'angle') {
        const armLen = el.armLength || 90;
        const deg = el.angleDeg || 60;
        const rad = (deg * Math.PI) / 180;
        const baseDir = (el.baseDir !== undefined) ? el.baseDir : Math.atan2(el.end.y - el.start.y, el.end.x - el.start.x);
        const dir = (el.direction !== undefined) ? el.direction : ((el.binding && el.binding.direction !== undefined) ? el.binding.direction : -1);
        const p2 = el.secondPoint || {
          x: el.start.x + armLen * Math.cos(baseDir + dir * rad),
          y: el.start.y + armLen * Math.sin(baseDir + dir * rad)
        };
        c.beginPath();
        if (!el.onlySecondArm) {
          c.moveTo(el.end.x, el.end.y);
          c.lineTo(el.start.x, el.start.y);
          c.lineTo(p2.x, p2.y);
        } else {
          c.moveTo(el.start.x, el.start.y);
          c.lineTo(p2.x, p2.y);
        }
        c.lineWidth = (el.width || 2.5) + glowWidth;
        c.strokeStyle = strokeGlow;
        c.stroke();

        c.lineWidth = (el.width || 2.5) + 1.8;
        c.strokeStyle = coreColor;
        c.stroke();
      }
    } else if (el.type === 'stroke') {
      if (el.points && el.points.length > 1) {
        c.beginPath();
        c.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) {
          c.lineTo(el.points[i].x, el.points[i].y);
        }
        c.lineWidth = (el.width || 2.5) + glowWidth;
        c.strokeStyle = strokeGlow;
        c.stroke();
      }
    } else if (el.type === 'text') {
      const box = getElementBoundingBox(el);
      if (box) {
        c.beginPath();
        const pad = 6;
        c.strokeRect(box.minX - pad, box.minY - pad, (box.maxX - box.minX) + pad * 2, (box.maxY - box.minY) + pad * 2);
        c.lineWidth = 2.5;
        c.strokeStyle = coreColor;
        c.stroke();
      }
    } else if (el.type === 'image') {
      c.beginPath();
      const pad = 4;
      c.strokeRect(el.x - pad, el.y - pad, el.width + pad * 2, el.height + pad * 2);
      c.lineWidth = (glowWidth / 2) + 1.5;
      c.strokeStyle = strokeGlow;
      c.stroke();
    }
    c.restore();
  }

  // Vẽ khung chọn và hiệu ứng phát sáng sáng rực rỡ để người dùng dễ hình dung đối tượng
  function drawSelectionOutline(el) {
    if (!el) return;
    // 1. Làm chính hình vẽ SÁNG BỪNG LÊN với quầng sáng ngọc bích
    highlightElementShape(ctx, el, true);

    // 2. Với các hình lớn (không phải điểm), vẽ thêm viền đứt nét nhẹ nhàng tinh tế
    if (el.type !== 'geo' || el.shape !== 'point') {
      const box = getElementBoundingBox(el);
      if (box) {
        ctx.save();
        ctx.strokeStyle = 'rgba(40, 99, 78, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);

        const pad = 10;
        const w = (box.maxX - box.minX) + pad * 2;
        const h = (box.maxY - box.minY) + pad * 2;
        const x = box.minX - pad;
        const y = box.minY - pad;

        ctx.strokeRect(x, y, w, h);
        ctx.restore();
      }
    }
  }

  // Tính hộp giới hạn (Bounding Box) của từng loại đối tượng
  function getElementBoundingBox(el) {
    if (!el) return null;
    if (el.type === 'geo') {
      if (el.shape === 'point') {
        return {
          minX: el.start.x - 7,
          maxX: el.start.x + 7,
          minY: el.start.y - 7,
          maxY: el.start.y + 7
        };
      }
      if (el.shape === 'ellipse') {
        const rx = el.rx || 60;
        const ry = el.ry || 40;
        return {
          minX: el.start.x - rx,
          maxX: el.start.x + rx,
          minY: el.start.y - ry,
          maxY: el.start.y + ry
        };
      }
      if (el.shape === 'circle' || el.shape === 'inscribed-triangle' || el.shape === 'two-tangents') {
        const r = Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
        return {
          minX: el.start.x - r,
          maxX: el.start.x + r,
          minY: el.start.y - r,
          maxY: el.start.y + r
        };
      }
      if (el.points && el.points.length > 0) {
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (const p of el.points) {
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        }
        return { minX, maxX, minY, maxY };
      }
      return {
        minX: Math.min(el.start.x, el.end.x),
        maxX: Math.max(el.start.x, el.end.x),
        minY: Math.min(el.start.y, el.end.y),
        maxY: Math.max(el.start.y, el.end.y)
      };
    } else if (el.type === 'stroke') {
      if (!el.points || el.points.length === 0) return null;
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const p of el.points) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
      return { minX, maxX, minY, maxY };
    } else if (el.type === 'text') {
      return {
        minX: el.x,
        maxX: el.x + (el.text ? el.text.length * 12 : 80),
        minY: el.y - 24,
        maxY: el.y + 8
      };
    } else if (el.type === 'image') {
      return {
        minX: el.x,
        maxX: el.x + el.width,
        minY: el.y,
        maxY: el.y + el.height
      };
    }
    return null;
  }

  let elementIdCounter = 1;
  function ensureElementId(el) {
    if (!el) return null;
    if (!el.id) {
      el.id = 'el_' + Date.now().toString(36) + '_' + (elementIdCounter++);
    }
    return el.id;
  }

  function findElementById(id) {
    if (!id) return null;
    const pagesObj = state.pages || {};
    const pagesList = Array.isArray(pagesObj) ? pagesObj : Object.values(pagesObj);
    for (const page of pagesList) {
      if (!page || !Array.isArray(page)) continue;
      const found = page.find(el => el && el.id === id);
      if (found) return found;
    }
    return null;
  }

  // Gộp đối tượng sinh ra vào cùng 1 nhóm với đối tượng sinh ra nó
  function linkGroup(parentEl, childEl) {
    if (!parentEl || !childEl) return;
    linkGroupMulti([parentEl], childEl);
  }

  // Gộp đối tượng sinh ra từ nhiều đối tượng vào cùng 1 nhóm chung
  function linkGroupMulti(parentEls, childEl) {
    const validParents = (parentEls || []).filter(Boolean);
    if (validParents.length === 0 || !childEl) return;
    ensureElementId(childEl);
    validParents.forEach(ensureElementId);

    const allMembers = [...validParents, childEl];
    const pageEls = state.pages[state.currentPage] || [];

    // Tìm groupId đã có hoặc tạo mới
    let targetGroupId = null;
    for (const m of allMembers) {
      if (m.groupId) {
        targetGroupId = m.groupId;
        break;
      }
    }
    if (!targetGroupId) {
      targetGroupId = 'grp_' + validParents[0].id;
    }

    // Thu thập các groupId cần sáp nhập
    const groupIdsToMerge = new Set();
    for (const m of allMembers) {
      if (m.groupId) groupIdsToMerge.add(m.groupId);
    }

    // Sáp nhập tất cả các đối tượng thuộc các nhóm này trên trang hiện tại
    for (const item of pageEls) {
      if (!item) continue;
      if (allMembers.includes(item) || (item.groupId && groupIdsToMerge.has(item.groupId))) {
        ensureElementId(item);
        item.groupId = targetGroupId;
      }
    }
    childEl.groupId = targetGroupId;
  }

  // Lấy tất cả các đối tượng cùng nhóm và liên kết phụ thuộc với el trên trang hiện tại
  function getGroupElements(el) {
    if (!el) return [];
    const pageEls = state.pages[state.currentPage] || [];
    
    // Thu thập tất cả các phần tử liên kết qua groupId hoặc qua binding hai chiều
    const groupSet = new Set();
    const queue = [el];
    groupSet.add(el);

    while (queue.length > 0) {
      const curr = queue.shift();
      if (!curr) continue;

      for (const item of pageEls) {
        if (!item || groupSet.has(item)) continue;

        let isLinked = false;
        // Cùng groupId
        if (curr.groupId && item.groupId && curr.groupId === item.groupId) {
          isLinked = true;
        }
        // Liên kết binding (item là con của curr)
        if (item.binding && (
          item.binding.parentId === curr.id ||
          item.binding.ptAId === curr.id ||
          item.binding.ptBId === curr.id ||
          item.binding.parent1Id === curr.id ||
          item.binding.parent2Id === curr.id ||
          item.binding.pointElId === curr.id
        )) {
          isLinked = true;
        }
        // Liên kết binding (curr là con của item)
        if (curr.binding && (
          curr.binding.parentId === item.id ||
          curr.binding.ptAId === item.id ||
          curr.binding.ptBId === item.id ||
          curr.binding.parent1Id === item.id ||
          curr.binding.parent2Id === item.id ||
          curr.binding.pointElId === item.id
        )) {
          isLinked = true;
        }
        // Liên kết startBinding / endBinding của đoạn thẳng
        const hasStartEndBindingToItem = (curr.startBinding && (curr.startBinding.parentId === item.id || curr.startBinding.elementId === item.id)) ||
          (curr.endBinding && (curr.endBinding.parentId === item.id || curr.endBinding.elementId === item.id));
        const itemHasStartEndBindingToCurr = (item.startBinding && (item.startBinding.parentId === curr.id || item.startBinding.elementId === curr.id)) ||
          (item.endBinding && (item.endBinding.parentId === curr.id || item.endBinding.elementId === curr.id));
        if (hasStartEndBindingToItem || itemHasStartEndBindingToCurr) {
          isLinked = true;
        }

        if (isLinked) {
          groupSet.add(item);
          queue.push(item);
        }
      }
    }

    // Đảm bảo tất cả các phần tử trong nhóm đều có chung 1 targetGroupId
    const groupArr = Array.from(groupSet);
    if (groupArr.length > 1) {
      let targetGroupId = groupArr.find(item => item.groupId)?.groupId;
      if (!targetGroupId) {
        ensureElementId(groupArr[0]);
        targetGroupId = 'grp_' + groupArr[0].id;
      }
      for (const item of groupArr) {
        ensureElementId(item);
        item.groupId = targetGroupId;
      }
    }

    return groupArr.length > 0 ? groupArr : [el];
  }

  // Lấy tất cả các hình con phụ thuộc vào parentEl
  function getDependentElements(parentEl) {
    if (!parentEl || !parentEl.id) return [];
    const pageEls = state.pages[state.currentPage] || [];
    return pageEls.filter(child => {
      if (!child) return false;
      if (child.binding) {
        const b = child.binding;
        if (b.parentId === parentEl.id || b.ptAId === parentEl.id || b.ptBId === parentEl.id || b.parent1Id === parentEl.id || b.parent2Id === parentEl.id || b.pointElId === parentEl.id) return true;
      }
      if (child.startBinding && (child.startBinding.parentId === parentEl.id || child.startBinding.elementId === parentEl.id)) return true;
      if (child.endBinding && (child.endBinding.parentId === parentEl.id || child.endBinding.elementId === parentEl.id)) return true;
      return false;
    });
  }

  // Dịch chuyển vị trí đối tượng theo vector (dx, dy), tự động tịnh tiến các đối tượng con và đối tượng cùng nhóm
  function translateElement(el, dx, dy, movedSet = new Set()) {
    if (!el || movedSet.has(el)) return;
    movedSet.add(el);

    if (el.type === 'geo') {
      if (el.start) {
        el.start.x += dx;
        el.start.y += dy;
      }
      if (el.end) {
        el.end.x += dx;
        el.end.y += dy;
      }
      if (el.foot) {
        el.foot.x += dx;
        el.foot.y += dy;
      }
      if (el.tangentPoint) {
        el.tangentPoint.x += dx;
        el.tangentPoint.y += dy;
      }
      if (el.center) {
        el.center.x += dx;
        el.center.y += dy;
      }
      if (el.p1) {
        el.p1.x += dx;
        el.p1.y += dy;
      }
      if (el.p2) {
        el.p2.x += dx;
        el.p2.y += dy;
      }
      if (el.secondPoint) {
        el.secondPoint.x += dx;
        el.secondPoint.y += dy;
      }
      if (el.points) {
        for (const p of el.points) {
          p.x += dx;
          p.y += dy;
        }
      }
    } else if (el.type === 'stroke') {
      for (const p of el.points) {
        p.x += dx;
        p.y += dy;
      }
    } else if (el.type === 'text') {
      el.x += dx;
      el.y += dy;
    } else if (el.type === 'image') {
      el.x += dx;
      el.y += dy;
    } else if (el.type === 'graph-widget') {
      el.x += dx;
      el.y += dy;
      if (el.origin) {
        el.origin.x += dx;
        el.origin.y += dy;
      }
    }

    // Tự động tịnh tiến các hình phụ thuộc hoặc cùng nhóm với el (hai chiều)
    const pageEls = state.pages[state.currentPage] || [];
    for (const child of pageEls) {
      if (child && !movedSet.has(child)) {
        const isChildBinding = child.binding && (
          child.binding.parentId === el.id ||
          child.binding.ptAId === el.id ||
          child.binding.ptBId === el.id ||
          child.binding.parent1Id === el.id ||
          child.binding.parent2Id === el.id ||
          child.binding.pointElId === el.id
        );
        const isParentBinding = el.binding && (
          el.binding.parentId === child.id ||
          el.binding.ptAId === child.id ||
          el.binding.ptBId === child.id ||
          el.binding.parent1Id === child.id ||
          el.binding.parent2Id === child.id ||
          el.binding.pointElId === child.id
        );
        const isChildStartEnd = (child.startBinding && (child.startBinding.parentId === el.id || child.startBinding.elementId === el.id)) ||
          (child.endBinding && (child.endBinding.parentId === el.id || child.endBinding.elementId === el.id));
        const isParentStartEnd = (el.startBinding && (el.startBinding.parentId === child.id || el.startBinding.elementId === child.id)) ||
          (el.endBinding && (el.endBinding.parentId === child.id || el.endBinding.elementId === child.id));
        const isSameGroup = el.groupId && child.groupId && child.groupId === el.groupId;
        if (isChildBinding || isParentBinding || isChildStartEnd || isParentStartEnd || isSameGroup) {
          translateElement(child, dx, dy, movedSet);
        }
      }
    }
  }

  // Xoay một đối tượng hoặc cụm đối tượng 2D quanh tâm (cx, cy) một góc rad (tất cả các cạnh và yếu tố cùng quay)
  function rotateElement2D(el, cx, cy, rad, rotatedSet = new Set()) {
    if (!el || rotatedSet.has(el)) return;
    rotatedSet.add(el);
    state.selectedEdge = null;
    state.selectedVertex = null;

    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    function rotPt(p) {
      if (!p) return;
      const dx = p.x - cx;
      const dy = p.y - cy;
      p.x = cx + dx * cos - dy * sin;
      p.y = cy + dx * sin + dy * cos;
    }

    if (el.type === 'geo') {
      if (el.start) rotPt(el.start);
      if (el.end) rotPt(el.end);
      if (el.foot) rotPt(el.foot);
      if (el.center) rotPt(el.center);
      if (el.tangentPoint) rotPt(el.tangentPoint);
      if (el.secondPoint) rotPt(el.secondPoint);
      if (el.p1) rotPt(el.p1);
      if (el.p2) rotPt(el.p2);
      if (el.points) {
        for (const p of el.points) rotPt(p);
      }
      if (el.baseDir !== undefined) el.baseDir += rad;
      if (el.bisectorAngle !== undefined) el.bisectorAngle += rad;
      if (el.arm1Angle !== undefined) el.arm1Angle += rad;
      if (el.arm2Angle !== undefined) el.arm2Angle += rad;
      if (el.angles) {
        el.angles = el.angles.map(a => a + rad);
      }
    } else if (el.type === 'stroke' && el.points) {
      for (const p of el.points) rotPt(p);
    } else if (el.type === 'text') {
      const dx = el.x - cx;
      const dy = el.y - cy;
      el.x = cx + dx * cos - dy * sin;
      el.y = cy + dx * sin + dy * cos;
    } else if (el.type === 'image') {
      const dx = el.x - cx;
      const dy = el.y - cy;
      el.x = cx + dx * cos - dy * sin;
      el.y = cy + dx * sin + dy * cos;
    }

    // Tự động xoay các phần tử cùng nhóm hoặc liên kết hai chiều
    const pageEls = state.pages[state.currentPage] || [];
    for (const child of pageEls) {
      if (child && !rotatedSet.has(child)) {
        const isChildBinding = child.binding && (
          child.binding.parentId === el.id ||
          child.binding.ptAId === el.id ||
          child.binding.ptBId === el.id ||
          child.binding.parent1Id === el.id ||
          child.binding.parent2Id === el.id ||
          child.binding.pointElId === el.id
        );
        const isParentBinding = el.binding && (
          el.binding.parentId === child.id ||
          el.binding.ptAId === child.id ||
          el.binding.ptBId === child.id ||
          el.binding.parent1Id === child.id ||
          el.binding.parent2Id === child.id ||
          el.binding.pointElId === child.id
        );
        const isChildStartEnd = (child.startBinding && (child.startBinding.parentId === el.id || child.startBinding.elementId === el.id)) ||
          (child.endBinding && (child.endBinding.parentId === el.id || child.endBinding.elementId === el.id));
        const isParentStartEnd = (el.startBinding && (el.startBinding.parentId === child.id || el.startBinding.elementId === child.id)) ||
          (el.endBinding && (el.endBinding.parentId === child.id || el.endBinding.elementId === child.id));
        const isSameGroup = el.groupId && child.groupId && child.groupId === el.groupId;
        if (isChildBinding || isParentBinding || isChildStartEnd || isParentStartEnd || isSameGroup) {
          rotateElement2D(child, cx, cy, rad, rotatedSet);
        }
      }
    }
  }

  // Cập nhật lại hình học cho 1 hình con khi hình sinh ra nó bị biến động (kéo đỉnh, đổi bán kính, kéo đầu mút...)
  function updateSingleBinding(child, parentEl) {
    if (!child || !child.binding || !parentEl) return;
    const b = child.binding;

    // 1. Trung điểm (Midpoint)
    if (b.type === 'midpoint_segment' || b.isSegment) {
      if (parentEl.start && parentEl.end) {
        child.start.x = (parentEl.start.x + parentEl.end.x) / 2;
        child.start.y = (parentEl.start.y + parentEl.end.y) / 2;
        child.end.x = child.start.x;
        child.end.y = child.start.y;
        child.p1 = { x: parentEl.start.x, y: parentEl.start.y };
        child.p2 = { x: parentEl.end.x, y: parentEl.end.y };
      }
    } else if (b.type === 'midpoint_triangle_edge') {
      if (parentEl.points && b.v1Index !== undefined && b.v2Index !== undefined) {
        const pA = parentEl.points[b.v1Index];
        const pB = parentEl.points[b.v2Index];
        if (pA && pB) {
          child.start.x = (pA.x + pB.x) / 2;
          child.start.y = (pA.y + pB.y) / 2;
          child.end.x = child.start.x;
          child.end.y = child.start.y;
          child.p1 = { x: pA.x, y: pA.y };
          child.p2 = { x: pB.x, y: pB.y };
        }
      }
    } else if (b.type === 'midpoint_inscribed_edge') {
      if (parentEl.angles && b.v1Index !== undefined && b.v2Index !== undefined) {
        const r = Math.hypot(parentEl.end.x - parentEl.start.x, parentEl.end.y - parentEl.start.y);
        const pA = { x: parentEl.start.x + r * Math.cos(parentEl.angles[b.v1Index]), y: parentEl.start.y + r * Math.sin(parentEl.angles[b.v1Index]) };
        const pB = { x: parentEl.start.x + r * Math.cos(parentEl.angles[b.v2Index]), y: parentEl.start.y + r * Math.sin(parentEl.angles[b.v2Index]) };
        child.start.x = (pA.x + pB.x) / 2;
        child.start.y = (pA.y + pB.y) / 2;
        child.end.x = child.start.x;
        child.end.y = child.start.y;
      }
    } else if (b.type === 'midpoint_points') {
      const ptA = findElementById(b.ptAId);
      const ptB = findElementById(b.ptBId);
      if (ptA && ptB) {
        const aX = ptA.start ? ptA.start.x : ptA.x;
        const aY = ptA.start ? ptA.start.y : ptA.y;
        const bX = ptB.start ? ptB.start.x : ptB.x;
        const bY = ptB.start ? ptB.start.y : ptB.y;
        child.start.x = (aX + bX) / 2;
        child.start.y = (aY + bY) / 2;
        child.end.x = child.start.x;
        child.end.y = child.start.y;
      }
    }

    // 2. Tia phân giác (Bisector)
    else if (b.type === 'bisector_triangle') {
      if (parentEl.points && parentEl.points.length >= 3 && b.vertexIndex !== undefined) {
        const pts = parentEl.points;
        const n = pts.length;
        const vIdx = b.vertexIndex;
        const V = pts[vIdx];
        const nextPt = pts[(vIdx + 1) % n];
        const prevPt = pts[(vIdx - 1 + n) % n];
        const dir1 = { x: nextPt.x - V.x, y: nextPt.y - V.y };
        const dir2 = { x: prevPt.x - V.x, y: prevPt.y - V.y };
        const len1 = Math.hypot(dir1.x, dir1.y) || 1;
        const len2 = Math.hypot(dir2.x, dir2.y) || 1;
        const u1 = { x: dir1.x / len1, y: dir1.y / len1 };
        const u2 = { x: dir2.x / len2, y: dir2.y / len2 };
        const sumX = u1.x + u2.x, sumY = u1.y + u2.y;
        const lenS = Math.hypot(sumX, sumY);
        const bisectorDir = lenS < 1e-4 ? { x: -u1.y, y: u1.x } : { x: sumX / lenS, y: sumY / lenS };

        child.start = { x: V.x, y: V.y };
        if (n === 3) {
          const hit = rayIntersectSegment(V, bisectorDir, nextPt, prevPt);
          if (hit && hit.t > 15) {
            child.end = hit.point;
          } else {
            const L = Math.max(90, Math.min(280, (len1 + len2) / 2));
            child.end = { x: V.x + L * bisectorDir.x, y: V.y + L * bisectorDir.y };
          }
        } else {
          let bestHit = null;
          let minT = Infinity;
          for (let j = 0; j < n; j++) {
            if (j === vIdx || j === (vIdx - 1 + n) % n) continue;
            const pA = pts[j];
            const pB = pts[(j + 1) % n];
            const h = rayIntersectSegment(V, bisectorDir, pA, pB);
            if (h && h.t > 15 && h.t < minT) {
              minT = h.t;
              bestHit = h;
            }
          }
          if (bestHit) {
            child.end = bestHit.point;
          } else {
            const L = Math.max(90, Math.min(280, (len1 + len2) / 2));
            child.end = { x: V.x + L * bisectorDir.x, y: V.y + L * bisectorDir.y };
          }
        }
        child.arm1Angle = Math.atan2(u1.y, u1.x);
        child.arm2Angle = Math.atan2(u2.y, u2.x);
        child.bisectorAngle = Math.atan2(bisectorDir.y, bisectorDir.x);
      }
    } else if (b.type === 'bisector_angle') {
      const V = { x: parentEl.start.x, y: parentEl.start.y };
      const armLength = parentEl.armLength || Math.max(80, Math.hypot(parentEl.end.x - parentEl.start.x, parentEl.end.y - parentEl.start.y));
      const baseAngle = parentEl.baseDir !== undefined ? parentEl.baseDir : Math.atan2(parentEl.end.y - parentEl.start.y, parentEl.end.x - parentEl.start.x);
      const rad = ((parentEl.angleDeg || 60) * Math.PI) / 180;
      const secondAngle = baseAngle - rad;
      const bisectorAngle = (baseAngle + secondAngle) / 2;
      child.start = V;
      child.end = { x: V.x + armLength * Math.cos(bisectorAngle), y: V.y + armLength * Math.sin(bisectorAngle) };
      child.arm1Angle = secondAngle;
      child.arm2Angle = baseAngle;
      child.bisectorAngle = bisectorAngle;
    }

    // 3. Tiếp tuyến (Tangent)
    else if (b.type === 'circle_tangent') {
      const O = { x: parentEl.start.x, y: parentEl.start.y };
      const R = parentEl.radius || Math.hypot(parentEl.end.x - parentEl.start.x, parentEl.end.y - parentEl.start.y);
      child.center = O;
      child.radius = R;
      const currentTanLength = Math.hypot(child.end.x - child.start.x, child.end.y - child.start.y) || 180;
      const halfLen = currentTanLength / 2;

      if (b.onCircle) {
        const ang = b.angle !== undefined ? b.angle : 0;
        const T = { x: O.x + R * Math.cos(ang), y: O.y + R * Math.sin(ang) };
        child.tangentPoint = T;
        const uPerp = { x: -Math.sin(ang), y: Math.cos(ang) };
        child.start = { x: T.x - halfLen * uPerp.x, y: T.y - halfLen * uPerp.y };
        child.end = { x: T.x + halfLen * uPerp.x, y: T.y + halfLen * uPerp.y };
      } else if (b.offset) {
        const pt = { x: O.x + b.offset.dx, y: O.y + b.offset.dy };
        const d = Math.hypot(pt.x - O.x, pt.y - O.y);
        if (d > R + 2) {
          const ang = Math.atan2(pt.y - O.y, pt.x - O.x);
          const beta = Math.acos(Math.max(-1, Math.min(1, R / d)));
          const branchSign = (b.branch === 1) ? 1 : -1;
          const T = { x: O.x + R * Math.cos(ang + branchSign * beta), y: O.y + R * Math.sin(ang + branchSign * beta) };
          child.tangentPoint = T;
          const vx = T.x - pt.x, vy = T.y - pt.y;
          const len = Math.hypot(vx, vy) || 1;
          const uTan = { x: vx / len, y: vy / len };
          child.start = { x: pt.x - 20 * uTan.x, y: pt.y - 20 * uTan.y };
          child.end = { x: T.x + 35 * uTan.x, y: T.y + 35 * uTan.y };
        }
      }
    } else if (b.type === 'two_tangents') {
      const O = { x: parentEl.start.x, y: parentEl.start.y };
      const R = parentEl.radius || Math.hypot(parentEl.end.x - parentEl.start.x, parentEl.end.y - parentEl.start.y);
      child.start = { x: O.x, y: O.y };
      child.radius = R;
    }

    // 4. Đường vuông góc (Perpendicular)
    else if (b.type === 'perpendicular') {
      let A = null, B = null;
      if (parentEl.shape === 'line' || parentEl.shape === 'perpendicular' || parentEl.shape === 'parallel') {
        A = parentEl.start; B = parentEl.end;
      } else if (parentEl.points && b.v1Index !== undefined && b.v2Index !== undefined) {
        A = parentEl.points[b.v1Index]; B = parentEl.points[b.v2Index];
      }
      if (A && B) {
        const vx = B.x - A.x, vy = B.y - A.y;
        const lenV = Math.hypot(vx, vy) || 1;
        const uBase = { x: vx / lenV, y: vy / lenV };
        const P = b.pointRef || child.start;
        const t = (P.x - A.x) * uBase.x + (P.y - A.y) * uBase.y;
        const H = { x: A.x + t * uBase.x, y: A.y + t * uBase.y };
        child.foot = H;
        child.baseDir = uBase;
        const distPH = Math.hypot(P.x - H.x, P.y - H.y);
        if (distPH > 8) {
          const uPerp = { x: (P.x - H.x) / distPH, y: (P.y - H.y) / distPH };
          child.start = { x: H.x - 20 * uPerp.x, y: H.y - 20 * uPerp.y };
          child.end = { x: P.x + 35 * uPerp.x, y: P.y + 35 * uPerp.y };
        } else {
          const uNorm = { x: -uBase.y, y: uBase.x };
          child.start = { x: P.x - 90 * uNorm.x, y: P.y - 90 * uNorm.y };
          child.end = { x: P.x + 90 * uNorm.x, y: P.y + 90 * uNorm.y };
        }
      }
    }

    // 5. Đường song song (Parallel)
    else if (b.type === 'parallel') {
      let A = null, B = null;
      if (parentEl.shape === 'line' || parentEl.shape === 'perpendicular' || parentEl.shape === 'parallel') {
        A = parentEl.start; B = parentEl.end;
      } else if (parentEl.points && b.v1Index !== undefined && b.v2Index !== undefined) {
        A = parentEl.points[b.v1Index]; B = parentEl.points[b.v2Index];
      }
      if (A && B) {
        const vx = B.x - A.x, vy = B.y - A.y;
        const lenV = Math.hypot(vx, vy) || 1;
        const uBase = { x: vx / lenV, y: vy / lenV };
        child.baseDir = uBase;
        const mid = { x: (child.start.x + child.end.x) / 2, y: (child.start.y + child.end.y) / 2 };
        const halfLen = Math.hypot(child.end.x - child.start.x, child.end.y - child.start.y) / 2 || 80;
        child.start = { x: mid.x - halfLen * uBase.x, y: mid.y - halfLen * uBase.y };
        child.end = { x: mid.x + halfLen * uBase.x, y: mid.y + halfLen * uBase.y };
      }
    }

    // 6. Điểm gắn trên đường tròn (Point on Circle)
    else if (b.type === 'point_on_circle') {
      const O = { x: parentEl.start.x, y: parentEl.start.y };
      const R = parentEl.radius || Math.hypot(parentEl.end.x - parentEl.start.x, parentEl.end.y - parentEl.start.y);
      const ang = b.angle !== undefined ? b.angle : 0;
      child.start = { x: O.x + R * Math.cos(ang), y: O.y + R * Math.sin(ang) };
      child.end = { x: child.start.x, y: child.start.y };
    }

    // 7. Điểm gắn trên đường thẳng / cạnh hình học (Point on Line / Segment)
    else if (b.type === 'point_on_line') {
      let A = null, B = null;
      if (parentEl.shape === 'line' || parentEl.shape === 'perpendicular' || parentEl.shape === 'parallel' || parentEl.shape === 'tangent' || parentEl.shape === 'bisector') {
        A = parentEl.start;
        B = parentEl.end;
      } else if (parentEl.points && b.v1Index !== undefined && b.v2Index !== undefined) {
        A = parentEl.points[b.v1Index];
        B = parentEl.points[b.v2Index];
      } else if (parentEl.shape === 'inscribed-triangle' && b.v1Index !== undefined && b.v2Index !== undefined) {
        const r = Math.hypot(parentEl.end.x - parentEl.start.x, parentEl.end.y - parentEl.start.y);
        const angles = parentEl.angles || [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
        A = { x: parentEl.start.x + r * Math.cos(angles[b.v1Index]), y: parentEl.start.y + r * Math.sin(angles[b.v1Index]) };
        B = { x: parentEl.start.x + r * Math.cos(angles[b.v2Index]), y: parentEl.start.y + r * Math.sin(angles[b.v2Index]) };
      }
      if (A && B) {
        const t = b.t !== undefined ? b.t : 0.5;
        child.start = { x: A.x + t * (B.x - A.x), y: A.y + t * (B.y - A.y) };
        child.end = { x: child.start.x, y: child.start.y };
      }
    }

    // 8. Tia phân giác giữa 2 cạnh rời nhau (Bisector of Two Edges)
    else if (b.type === 'bisector_two_edges') {
      const p1 = findElementById(b.parent1Id);
      const p2 = findElementById(b.parent2Id);
      if (p1 && p2) {
        let edge1 = null;
        if (p1.points && b.edge1Info && b.edge1Info.v1Index !== undefined && b.edge1Info.v2Index !== undefined) {
          edge1 = { start: p1.points[b.edge1Info.v1Index], end: p1.points[b.edge1Info.v2Index], element: p1 };
        } else {
          edge1 = getLineOrEdgeFromElement(p1, child.start);
        }
        let edge2 = null;
        if (p2.points && b.edge2Info && b.edge2Info.v1Index !== undefined && b.edge2Info.v2Index !== undefined) {
          edge2 = { start: p2.points[b.edge2Info.v1Index], end: p2.points[b.edge2Info.v2Index], element: p2 };
        } else {
          edge2 = getLineOrEdgeFromElement(p2, child.start);
        }

        if (edge1 && edge2 && edge1.start && edge1.end && edge2.start && edge2.end) {
          const A1 = edge1.start, B1 = edge1.end;
          const A2 = edge2.start, B2 = edge2.end;
          let V = null, dir1 = null, dir2 = null, oppositeSeg = null;

          if (Math.hypot(A1.x - A2.x, A1.y - A2.y) <= 16) {
            V = { x: (A1.x + A2.x) / 2, y: (A1.y + A2.y) / 2 };
            dir1 = { x: B1.x - V.x, y: B1.y - V.y };
            dir2 = { x: B2.x - V.x, y: B2.y - V.y };
            oppositeSeg = { p1: B1, p2: B2 };
          } else if (Math.hypot(A1.x - B2.x, A1.y - B2.y) <= 16) {
            V = { x: (A1.x + B2.x) / 2, y: (A1.y + B2.y) / 2 };
            dir1 = { x: B1.x - V.x, y: B1.y - V.y };
            dir2 = { x: A2.x - V.x, y: A2.y - V.y };
            oppositeSeg = { p1: B1, p2: A2 };
          } else if (Math.hypot(B1.x - A2.x, B1.y - A2.y) <= 16) {
            V = { x: (B1.x + A2.x) / 2, y: (B1.y + A2.y) / 2 };
            dir1 = { x: A1.x - V.x, y: A1.y - V.y };
            dir2 = { x: B2.x - V.x, y: B2.y - V.y };
            oppositeSeg = { p1: A1, p2: B2 };
          } else if (Math.hypot(B1.x - B2.x, B1.y - B2.y) <= 16) {
            V = { x: (B1.x + B2.x) / 2, y: (B1.y + B2.y) / 2 };
            dir1 = { x: A1.x - V.x, y: A1.y - V.y };
            dir2 = { x: A2.x - V.x, y: A2.y - V.y };
            oppositeSeg = { p1: A1, p2: A2 };
          }

          if (!V) {
            const d1x = B1.x - A1.x, d1y = B1.y - A1.y;
            const d2x = B2.x - A2.x, d2y = B2.y - A2.y;
            const det = d1x * d2y - d1y * d2x;
            if (Math.abs(det) > 1e-5) {
              const t = ((A2.x - A1.x) * d2y - (A2.y - A1.y) * d2x) / det;
              V = { x: A1.x + t * d1x, y: A1.y + t * d1y };
              const mid1 = { x: (A1.x + B1.x) / 2, y: (A1.y + B1.y) / 2 };
              const mid2 = { x: (A2.x + B2.x) / 2, y: (A2.y + B2.y) / 2 };
              dir1 = { x: mid1.x - V.x, y: mid1.y - V.y };
              dir2 = { x: mid2.x - V.x, y: mid2.y - V.y };
            }
          }

          if (V && dir1 && dir2) {
            const len1 = Math.hypot(dir1.x, dir1.y) || 1;
            const len2 = Math.hypot(dir2.x, dir2.y) || 1;
            const u1 = { x: dir1.x / len1, y: dir1.y / len1 };
            const u2 = { x: dir2.x / len2, y: dir2.y / len2 };
            const sumX = u1.x + u2.x, sumY = u1.y + u2.y;
            const lenS = Math.hypot(sumX, sumY);
            const bisectorDir = lenS < 1e-4 ? { x: -u1.y, y: u1.x } : { x: sumX / lenS, y: sumY / lenS };

            child.start = V;
            let pEnd = null;
            if (oppositeSeg) {
              const hit = rayIntersectSegment(V, bisectorDir, oppositeSeg.p1, oppositeSeg.p2);
              if (hit && hit.t > 15) pEnd = hit.point;
            }
            if (!pEnd) {
              const L1 = Math.hypot(B1.x - A1.x, B1.y - A1.y);
              const L2 = Math.hypot(B2.x - A2.x, B2.y - A2.y);
              const L = Math.max(90, Math.min(280, (L1 + L2) / 2));
              pEnd = { x: V.x + L * bisectorDir.x, y: V.y + L * bisectorDir.y };
            }
            child.end = pEnd;
            child.arm1Angle = Math.atan2(u1.y, u1.x);
            child.arm2Angle = Math.atan2(u2.y, u2.x);
            child.bisectorAngle = Math.atan2(bisectorDir.y, bisectorDir.x);
          }
        }
      }
    }

    // 9. Góc vẽ từ đường và điểm đỉnh (Angle from Line & Vertex)
    else if (b.type === 'angle_from_line') {
      let A = null, B = null;
      if (parentEl.shape === 'line' || parentEl.shape === 'perpendicular' || parentEl.shape === 'parallel' || parentEl.shape === 'tangent' || parentEl.shape === 'bisector') {
        A = parentEl.start; B = parentEl.end;
      } else if (parentEl.points && b.v1Index !== undefined && b.v2Index !== undefined) {
        A = parentEl.points[b.v1Index]; B = parentEl.points[b.v2Index];
      }
      if (A && B) {
        const baseDir = Math.atan2(B.y - A.y, B.x - A.x);
        child.baseDir = baseDir;
        const armLen = child.armLength || Math.max(90, Math.hypot(B.x - A.x, B.y - A.y));
        const rad = ((child.angleDeg || 60) * Math.PI) / 180;
        const dir = (b.direction !== undefined) ? b.direction : (child.direction !== undefined ? child.direction : -1);
        const secondAngle = baseDir + dir * rad;
        child.end = { x: child.start.x + armLen * Math.cos(baseDir), y: child.start.y + armLen * Math.sin(baseDir) };
        child.secondPoint = { x: child.start.x + armLen * Math.cos(secondAngle), y: child.start.y + armLen * Math.sin(secondAngle) };
      }
    }
  }

  // Cập nhật đầu mút của đoạn thẳng gắn vào cạnh hoặc đường tròn khi hình cha bị thay đổi
  function updateSingleStartEndBinding(child, parentEl, endpointKey) {
    if (!child || !parentEl) return;
    const b = child[endpointKey + 'Binding'];
    if (!b) return;

    if (b.type === 'point_on_circle') {
      const O = { x: parentEl.start.x, y: parentEl.start.y };
      const R = parentEl.radius || Math.hypot(parentEl.end.x - parentEl.start.x, parentEl.end.y - parentEl.start.y);
      const ang = b.angle !== undefined ? b.angle : 0;
      child[endpointKey] = {
        x: O.x + R * Math.cos(ang),
        y: O.y + R * Math.sin(ang)
      };
    } else if (b.type === 'point_on_line') {
      let A = null, B = null;
      if (parentEl.shape === 'line' || parentEl.shape === 'perpendicular' || parentEl.shape === 'parallel' || parentEl.shape === 'tangent' || parentEl.shape === 'bisector') {
        A = parentEl.start; B = parentEl.end;
      } else if (parentEl.points && b.v1Index !== undefined && b.v2Index !== undefined && parentEl.points[b.v1Index] && parentEl.points[b.v2Index]) {
        A = parentEl.points[b.v1Index]; B = parentEl.points[b.v2Index];
      }
      if (A && B) {
        const t = b.t !== undefined ? b.t : 0.5;
        child[endpointKey] = {
          x: A.x + t * (B.x - A.x),
          y: A.y + t * (B.y - A.y)
        };
      }
    } else if (b.type === 'point') {
      if (parentEl.shape === 'point') {
        child[endpointKey] = { x: parentEl.start.x, y: parentEl.start.y };
      } else if (parentEl.points && b.vIndex !== undefined && parentEl.points[b.vIndex]) {
        child[endpointKey] = { x: parentEl.points[b.vIndex].x, y: parentEl.points[b.vIndex].y };
      }
    }
  }

  // Tự động cập nhật tất cả các đối tượng phụ thuộc vào parentEl
  function updateDependentBindings(parentEl) {
    if (!parentEl || !parentEl.id) return;
    const pageEls = state.pages[state.currentPage] || [];
    for (const child of pageEls) {
      if (!child) continue;
      if (child.binding) {
        const b = child.binding;
        if (
          b.parentId === parentEl.id ||
          b.ptAId === parentEl.id ||
          b.ptBId === parentEl.id ||
          b.parent1Id === parentEl.id ||
          b.parent2Id === parentEl.id ||
          b.pointElId === parentEl.id
        ) {
          updateSingleBinding(child, parentEl);
        }
      }
      if (child.startBinding && (child.startBinding.parentId === parentEl.id || child.startBinding.elementId === parentEl.id)) {
        updateSingleStartEndBinding(child, parentEl, 'start');
      }
      if (child.endBinding && (child.endBinding.parentId === parentEl.id || child.endBinding.elementId === parentEl.id)) {
        updateSingleStartEndBinding(child, parentEl, 'end');
      }
    }
  }

  // Kiểm tra một phần tử có đang được chọn không
  function isElementSelected(el) {
    if (!el) return false;
    return (state.selectedElements && state.selectedElements.includes(el)) || state.selectedElement === el;
  }

  // Cập nhật danh sách đối tượng được chọn
  function setSelectedElements(elements) {
    state.selectedElements = (elements || []).filter(Boolean);
    state.selectedElement = state.selectedElements.length > 0 ? state.selectedElements[0] : null;
    updateSelectionStatus();
  }

  // Bật/tắt chọn đối tượng khi giữ Command (Mac) hoặc Ctrl (Win)
  function toggleElementSelection(el) {
    if (!el) return;
    if (!state.selectedElements) state.selectedElements = [];
    const idx = state.selectedElements.indexOf(el);
    if (idx !== -1) {
      state.selectedElements.splice(idx, 1);
    } else {
      state.selectedElements.push(el);
    }
    state.selectedElement = state.selectedElements.length > 0 ? state.selectedElements[0] : null;
    updateSelectionStatus();
  }

  // Cập nhật văn bản trạng thái hiển thị số lượng đối tượng đang chọn
  function updateSelectionStatus() {
    if (ellipseAxesContainer) {
      const isSingleEllipse = state.selectedElements && state.selectedElements.length === 1 && state.selectedElements[0].shape === 'ellipse';
      if (isSingleEllipse) {
        ellipseAxesContainer.style.display = 'inline-flex';
        const el = state.selectedElements[0];
        if (ellipseAxisAInput) ellipseAxisAInput.value = Math.round(el.rx || 60);
        if (ellipseAxisBInput) ellipseAxisBInput.value = Math.round(el.ry || 40);
      } else if (state.activeGeo !== 'ellipse') {
        ellipseAxesContainer.style.display = 'none';
      }
    }

    if (angleInputContainer) {
      const isSingleAngle = state.selectedElements && state.selectedElements.length === 1 && state.selectedElements[0].shape === 'angle';
      if (isSingleAngle) {
        angleInputContainer.style.display = 'inline-flex';
        const el = state.selectedElements[0];
        if (angleDegreesInput) angleDegreesInput.value = el.angleDeg || 60;
      } else if (state.activeGeo !== 'angle') {
        angleInputContainer.style.display = 'none';
      }
    }

    const hhkgControls = document.getElementById('hhkg-3d-controls');
    const btnToggleRotation = document.getElementById('btn-toggle-rotation');
    const btnHhkgRotate3D = document.getElementById('btn-hhkg-rotate-3d');
    const btnHhkgAutoSpin = document.getElementById('btn-hhkg-auto-spin');

    if (hhkgControls) {
      const selected = (state.selectedElements && state.selectedElements.length === 1) ? state.selectedElements[0] : null;
      const isSolid = selected && isSolidShape(selected.shape);
      const is2DRotatable = selected && ((selected.type === 'geo' && selected.shape !== 'point') || selected.type === 'image');

      if (isSolid || is2DRotatable) {
        hhkgControls.style.display = 'inline-flex';
        if (btnToggleRotation) {
          btnToggleRotation.classList.toggle('active', !!state.showRotationHandle);
        }
        if (btnHhkgRotate3D) {
          btnHhkgRotate3D.style.display = isSolid ? 'inline-flex' : 'none';
        }
        if (btnHhkgAutoSpin) {
          btnHhkgAutoSpin.style.display = isSolid ? 'inline-flex' : 'none';
        }
      } else {
        hhkgControls.style.display = 'none';
        state.showRotationHandle = false;
        if (btnToggleRotation) btnToggleRotation.classList.remove('active');
      }
    }

    if (state.activeTool !== 'select') return;
    const count = (state.selectedElements || []).length;
    if (count === 0) {
      statusToolInfo.textContent = 'Công cụ: Chọn đối tượng (Nhấp để chọn đơn lẻ một đối tượng, kéo để di chuyển, Delete để xóa)';
    } else if (count === 1) {
      const el = state.selectedElements[0];
      if (isSolidShape(el.shape)) {
        statusToolInfo.textContent = 'Đã chọn Hình không gian (Bấm nút [🔄 Xoay] trên thanh công cụ để hiện tay cầm xoay ngoài hình hoặc bấm ↶ 45° / ↷ 45°)';
      } else if (el.type === 'geo' && el.shape === 'ellipse') {
        statusToolInfo.textContent = 'Đã chọn Elip (Chỉnh số đo bán trục a, b hoặc bấm [🔄 Xoay] trên thanh công cụ để xoay)';
      } else if (el.type === 'geo' && el.shape === 'angle') {
        statusToolInfo.textContent = `Đã chọn Góc ${el.angleDeg || 60}° (Điều chỉnh số đo hoặc bấm [🔄 Xoay] trên thanh công cụ để xoay)`;
      } else if (el.type === 'geo' && el.shape !== 'point') {
        statusToolInfo.textContent = 'Đã chọn hình (Bấm [🔄 Xoay] trên thanh công cụ để hiện tay cầm xoay ngoài hình hoặc bấm ↶ 45° / ↷ 45°)';
      } else {
        statusToolInfo.textContent = 'Đã chọn đối tượng (Kéo để di chuyển hoặc nhấn Delete để xóa)';
      }
    } else if (count === 2) {
      const isTwoPoints = state.selectedElements.every(el => el.type === 'geo' && el.shape === 'point');
      if (isTwoPoints) {
        statusToolInfo.textContent = 'Đã chọn 2 điểm! Bấm [Dựng hình ▾] -> [Trung điểm] hoặc phím M để xuất ngay trung điểm.';
      } else {
        statusToolInfo.textContent = 'Đã chọn 2 đối tượng (Bấm nút Vuông góc, Song song, Phân giác, Tiếp tuyến hoặc Trung điểm để dựng hình ngay)';
      }
    } else {
      statusToolInfo.textContent = `Đã chọn ${count} đối tượng (Kéo để di chuyển cả nhóm, nhấn Delete để xóa)`;
    }
  }

  // Sự kiện khi người dùng gõ số đo bán trục a hoặc b trên toolbar
  function handleEllipseAxisInputChange() {
    if (!state.selectedElements || state.selectedElements.length !== 1) return;
    const el = state.selectedElements[0];
    if (el.shape !== 'ellipse') return;
    const a = Math.max(5, parseFloat(ellipseAxisAInput.value) || 60);
    const b = Math.max(5, parseFloat(ellipseAxisBInput.value) || 40);
    el.rx = a;
    el.ry = b;
    renderPage();
  }
  if (ellipseAxisAInput) {
    ellipseAxisAInput.addEventListener('input', handleEllipseAxisInputChange);
  }
  if (ellipseAxisBInput) {
    ellipseAxisBInput.addEventListener('input', handleEllipseAxisInputChange);
  }

  // Cập nhật số đo góc theo thời gian thực cho 2 tùy chọn nét đứt (options)
  function updatePendingAngleDegrees(newDeg) {
    if (!state.pendingOptions || state.pendingOptions.type !== 'angle') return;
    const deg = Math.max(1, Math.min(359, newDeg || 60));
    state.pendingOptions.deg = deg;
    const { V, baseDir, armLen } = state.pendingOptions;
    const rad = (deg * Math.PI) / 180;

    const secondAngle1 = baseDir - rad;
    const secondPt1 = {
      x: V.x + armLen * Math.cos(secondAngle1),
      y: V.y + armLen * Math.sin(secondAngle1)
    };

    const secondAngle2 = baseDir + rad;
    const secondPt2 = {
      x: V.x + armLen * Math.cos(secondAngle2),
      y: V.y + armLen * Math.sin(secondAngle2)
    };

    if (state.pendingOptions.options && state.pendingOptions.options.length === 2) {
      const opt1 = state.pendingOptions.options[0];
      opt1.angleDeg = deg;
      opt1.secondAngle = secondAngle1;
      opt1.secondPoint = secondPt1;
      opt1.name = `Góc ${deg}° (Hướng 1)`;

      const opt2 = state.pendingOptions.options[1];
      opt2.angleDeg = deg;
      opt2.secondAngle = secondAngle2;
      opt2.secondPoint = secondPt2;
      opt2.name = `Góc ${deg}° (Hướng 2)`;
    }

    statusToolInfo.textContent = `✨ Số đo góc: ${deg}°. Vui lòng nhấp chuột chọn 1 trong 2 đường nét đứt để vẽ góc.`;
    renderPage();
  }

  // Hiển thị khung nhập số đo góc nổi trực tiếp trên canvas tại đỉnh góc
  function showFloatingAngleBox(V, baseDir, currentDeg) {
    removeFloatingAngleBox();
    const sheet = (typeof getPaperSheetForPage === 'function' ? getPaperSheetForPage(state.currentPage) : null) ||
                  document.querySelector(`.paper-sheet[data-page="${state.currentPage}"]`) ||
                  document.querySelector('.paper-sheet');
    if (!sheet) return;

    const box = document.createElement('div');
    box.className = 'floating-angle-box';
    box.id = 'floating-angle-box';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'floating-angle-icon';
    iconSpan.textContent = '∡';
    box.appendChild(iconSpan);

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'floating-angle-input';
    input.id = 'input-floating-angle';
    input.value = currentDeg;
    input.min = '1';
    input.max = '359';
    input.step = '1';
    input.title = 'Nhập số đo góc cần vẽ';
    box.appendChild(input);
    box._inputElement = input;

    const degSpan = document.createElement('span');
    degSpan.className = 'floating-angle-deg';
    degSpan.textContent = '°';
    box.appendChild(degSpan);

    const hintSpan = document.createElement('span');
    hintSpan.className = 'floating-angle-hint';
    hintSpan.textContent = 'Nhập số góc rồi bấm vào 1 trong 2 đường nét đứt để vẽ';
    box.appendChild(hintSpan);

    // Tính vị trí đặt box lệch khỏi đỉnh V theo hướng ngược tia cơ sở khoảng 75px
    const dirNorm = (baseDir !== undefined) ? baseDir : 0;
    const offsetDist = 75;
    let boxX = V.x - offsetDist * Math.cos(dirNorm);
    let boxY = V.y - offsetDist * Math.sin(dirNorm);

    // Đảm bảo không tràn ra ngoài mép giấy
    boxX = Math.max(160, Math.min(940, boxX));
    boxY = Math.max(40, Math.min(1500, boxY));

    box.style.left = `${boxX}px`;
    box.style.top = `${boxY}px`;

    sheet.appendChild(box);

    input.addEventListener('input', () => {
      const val = Math.max(1, Math.min(359, parseFloat(input.value) || 60));
      updatePendingAngleDegrees(val);
      if (angleDegreesInput) angleDegreesInput.value = val;
    });

      input.addEventListener('keydown', (e) => {
        e.stopPropagation();
        if (e.key === 'Escape') {
          finishGeoTask();
        } else if (e.key === 'Enter') {
          input.blur();
        }
      });

      input.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
      });

      input.addEventListener('mousedown', (e) => {
        e.stopPropagation();
      });

    setTimeout(() => {
      input.focus();
      input.select();
    }, 50);
  }

  // Xóa khung nhập số đo góc nổi trên canvas
  function removeFloatingAngleBox() {
    const box = document.getElementById('floating-angle-box');
    if (box) {
      if (typeof box.remove === 'function') {
        box.remove();
      } else if (box.parentNode) {
        box.parentNode.removeChild(box);
      }
    }
  }

  // Sự kiện khi người dùng gõ số đo góc trên toolbar
  function handleAngleDegreesInputChange() {
    const deg = Math.max(1, Math.min(359, parseFloat(angleDegreesInput.value) || 60));

    // Nếu đang trong trạng thái chờ chọn 1 trong 2 hướng mở góc nét đứt
    if (state.pendingOptions && state.pendingOptions.type === 'angle') {
      updatePendingAngleDegrees(deg);
      const floatInp = document.getElementById('input-floating-angle');
      if (floatInp && floatInp.value !== String(deg)) {
        floatInp.value = deg;
      }
      return;
    }

    if (!state.selectedElements || state.selectedElements.length !== 1) return;
    const el = state.selectedElements[0];
    if (el.shape !== 'angle') return;
    el.angleDeg = deg;
    const armLen = el.armLength || 90;
    const rad = (deg * Math.PI) / 180;
    const baseDir = (el.baseDir !== undefined) ? el.baseDir : Math.atan2(el.end.y - el.start.y, el.end.x - el.start.x);
    const dir = (el.direction !== undefined) ? el.direction : ((el.binding && el.binding.direction !== undefined) ? el.binding.direction : -1);
    el.secondPoint = {
      x: el.start.x + armLen * Math.cos(baseDir + dir * rad),
      y: el.start.y + armLen * Math.sin(baseDir + dir * rad)
    };
    renderPage();
  }
  if (angleDegreesInput) {
    angleDegreesInput.addEventListener('input', handleAngleDegreesInputChange);
  }

  // Kiểm tra điểm (px, py) có chạm vào các cạnh hoặc bên trong đa giác bất kỳ không
  function hitTestPolygon(px, py, points, threshold = 16) {
    if (!points || points.length < 3) return false;
    const n = points.length;
    // 1. Kiểm tra khoảng cách đến tất cả các cạnh
    for (let i = 0; i < n; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % n];
      if (distToSegment(px, py, p1.x, p1.y, p2.x, p2.y) <= threshold) return true;
    }
    // 2. Thuật toán Ray-casting kiểm tra bên trong thân đa giác
    let inside = false;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xi = points[i].x, yi = points[i].y;
      const xj = points[j].x, yj = points[j].y;
      const intersect = ((yi > py) !== (yj > py)) &&
        (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // Giữ lại tên cũ để tương thích nếu nơi khác có gọi
  function hitTestTriangle(px, py, points, threshold = 16) {
    return hitTestPolygon(px, py, points, threshold);
  }

  // Tìm đối tượng nằm dưới con trỏ chuột/bút (Ưu tiên tuyệt đối đối tượng là ĐIỂM khi nằm lẫn lộn nhiều hình)
  function findElementAt(x, y) {
    const list = state.pages[state.currentPage] || [];

    // ƯU TIÊN 1: Tìm đối tượng là ĐIỂM trong bán kính 22px
    // Giúp người dùng chắc chắn chọn trúng điểm dù nằm lẫn lộn giữa nhiều hình phức tạp
    let bestPoint = null;
    let minPointDist = 22;
    for (let i = list.length - 1; i >= 0; i--) {
      const el = list[i];
      if (el.type === 'geo' && el.shape === 'point') {
        const d = Math.hypot(x - el.start.x, y - el.start.y);
        if (d < minPointDist) {
          minPointDist = d;
          bestPoint = el;
        }
      }
    }
    if (bestPoint) return bestPoint;

    // ƯU TIÊN 2: Tìm các đối tượng hình học khác và nét vẽ
    for (let i = list.length - 1; i >= 0; i--) {
      const el = list[i];
      if (el.type === 'geo') {
        if (el.shape === 'circle') {
          const r = Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
          const dist = Math.hypot(x - el.start.x, y - el.start.y);
          if (Math.abs(dist - r) <= 18 || dist <= r) return el;
        } else if (el.shape === 'ellipse') {
          const rx = el.rx || 60;
          const ry = el.ry || 40;
          const dx = x - el.start.x;
          const dy = y - el.start.y;
          const norm = Math.hypot(dx / rx, dy / ry);
          if (norm <= 1.05 || Math.abs(norm - 1.0) <= (18 / Math.min(rx, ry))) return el;
        } else if (el.shape === 'inscribed-triangle' || el.shape === 'two-tangents') {
          const r = Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
          const dist = Math.hypot(x - el.start.x, y - el.start.y);
          if (dist <= r + 20) return el;
        } else if (el.shape === 'angle') {
          const armLen = el.armLength || 90;
          const deg = el.angleDeg || 60;
          const rad = (deg * Math.PI) / 180;
          const baseDir = (el.baseDir !== undefined) ? el.baseDir : Math.atan2(el.end.y - el.start.y, el.end.x - el.start.x);
          const dir = (el.direction !== undefined) ? el.direction : ((el.binding && el.binding.direction !== undefined) ? el.binding.direction : -1);
          const p2 = el.secondPoint || {
            x: el.start.x + armLen * Math.cos(baseDir + dir * rad),
            y: el.start.y + armLen * Math.sin(baseDir + dir * rad)
          };
          if (Math.hypot(x - el.start.x, y - el.start.y) <= 18) return el;
          if (distToSegment(x, y, el.start.x, el.start.y, p2.x, p2.y) <= 16) return el;
          if (!el.onlySecondArm && distToSegment(x, y, el.start.x, el.start.y, el.end.x, el.end.y) <= 16) return el;
        } else if (isSolidShape(el.shape)) {
          if (el.points && el.edges) {
            for (const edge of el.edges) {
              const p1 = el.points[edge[0]];
              const p2 = el.points[edge[1]];
              if (p1 && p2 && distToSegment(x, y, p1.x, p1.y, p2.x, p2.y) <= 18) {
                return el;
              }
            }
          }
        } else if (el.points && el.points.length >= 3) {
          // Bắt trúng tam giác, hình chữ nhật, vuông, bình hành, thoi theo cạnh hoặc bên trong thân
          if (hitTestPolygon(x, y, el.points, 16)) return el;
        } else {
          // Đoạn thẳng / đường thẳng: kiểm tra khoảng cách đến đoạn thẳng thay vì bounding box
          if (distToSegment(x, y, el.start.x, el.start.y, el.end.x, el.end.y) <= 16) return el;
        }
      } else if (el.type === 'stroke') {
        let hit = false;
        for (let j = 0; j < el.points.length; j++) {
          if (Math.hypot(el.points[j].x - x, el.points[j].y - y) <= 16) {
            hit = true;
            break;
          }
          if (j < el.points.length - 1) {
            if (distToSegment(x, y, el.points[j].x, el.points[j].y, el.points[j + 1].x, el.points[j + 1].y) <= 16) {
              hit = true;
              break;
            }
          }
        }
        if (hit) return el;
      } else if (el.type === 'text') {
        if (Math.hypot(el.x - x, el.y - y) <= 35) return el;
      } else if (el.type === 'image') {
        if (x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height) {
          return el;
        }
      } else if (el.type === 'graph-widget') {
        if (window.__GraphWidget && typeof window.__GraphWidget.hitTestGraphWidget === 'function') {
          if (window.__GraphWidget.hitTestGraphWidget(el, x, y)) {
            return el;
          }
        }
      }
    }
    return null;
  }

  // Dựng từng loại phần tử
  function drawElement(el) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (el.dash === 'dashed') {
      ctx.setLineDash([10, 7]);
    } else {
      ctx.setLineDash([]);
    }

    if (el.type === 'stroke') {
      if (!el.points || el.points.length === 0) {
        ctx.restore();
        return;
      }
      if (el.points.length === 1) {
        ctx.fillStyle = el.color;
        ctx.globalAlpha = el.tool === 'highlighter' ? 0.35 : 1.0;
        ctx.beginPath();
        const r = Math.max(1, (el.width || 2.5) / 2);
        ctx.arc(el.points[0].x, el.points[0].y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }

      ctx.strokeStyle = el.color;
      ctx.fillStyle = el.color;

      if (el.tool === 'highlighter') {
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = el.width * 3.5;
        ctx.beginPath();
        ctx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) {
          ctx.lineTo(el.points[i].x, el.points[i].y);
        }
        ctx.stroke();
      } else {
        ctx.globalAlpha = 1.0;
        for (let i = 1; i < el.points.length; i++) {
          const p1 = el.points[i - 1];
          const p2 = el.points[i];
          const pr1 = (p1.pressure !== undefined && p1.pressure > 0) ? p1.pressure : 0.5;
          const pr2 = (p2.pressure !== undefined && p2.pressure > 0) ? p2.pressure : 0.5;
          const pressureMultiplier = (pr1 + pr2) / 2;
          ctx.lineWidth = Math.max(1, (el.width || 2.5) * (0.6 + pressureMultiplier * 0.8));

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    } else if (el.type === 'text') {
      ctx.font = '20px "Caveat", cursive';
      ctx.fillStyle = el.color;
      ctx.fillText(el.text, el.x, el.y);
    } else if (el.type === 'image') {
      if (!el.img && el.src) {
        el.img = new Image();
        el.img.src = el.src;
        el.img.onload = () => renderPage();
      }
      if (el.img && el.img.complete && el.img.naturalWidth > 0) {
        ctx.drawImage(el.img, el.x, el.y, el.width, el.height);
      }
    } else if (el.type === 'geo') {
      ctx.strokeStyle = el.color;
      ctx.lineWidth = el.width;
      drawGeometricShape(ctx, el);
    } else if (el.type === 'graph-widget') {
      if (window.__GraphWidget && typeof window.__GraphWidget.drawGraphWidget === 'function') {
        const isSel = (state.activeTool === 'select' && (state.selectedElement === el || (state.selectedElements && state.selectedElements.includes(el))));
        const isHov = (state.activeTool === 'select' && state.hoverElement === el);
        window.__GraphWidget.drawGraphWidget(ctx, el, isSel, isHov);
      }
    }

    ctx.restore();
  }

  const SOLID_SHAPES = ['tetrahedron', 'pyramid-quad', 'pyramid-trapezoid', 'pyramid-parallelogram', 'pyramid-pentagon', 'pyramid-regular'];

  function isSolidShape(shape) {
    return shape && SOLID_SHAPES.includes(shape);
  }

  function computeSolidShapeData(shape, start, end) {
    const left = Math.min(start.x, end.x);
    const right = Math.max(start.x, end.x);
    const top = Math.min(start.y, end.y);
    const bottom = Math.max(start.y, end.y);
    const w = Math.max(50, right - left);
    const h = Math.max(50, bottom - top);

    let points = [];
    let edges = [];

    if (shape === 'tetrahedron') {
      const S = { x: left + w * 0.38, y: top, name: 'S', offX: 0, offY: -10 };
      const A = { x: left + w * 0.10, y: top + h * 0.72, name: 'A', offX: -14, offY: 2 };
      const B = { x: left + w * 0.45, y: bottom, name: 'B', offX: -8, offY: 15 };
      const C = { x: right, y: top + h * 0.74, name: 'C', offX: 8, offY: 4 };

      points = [S, A, B, C];
      edges = [
        [0, 1, 'solid'],
        [0, 2, 'solid'],
        [0, 3, 'solid'],
        [1, 2, 'solid'],
        [2, 3, 'solid'],
        [1, 3, 'dashed']
      ];
    } else if (shape === 'pyramid-quad') {
      const S = { x: left + w * 0.36, y: top, name: 'S', offX: 0, offY: -10 };
      const A = { x: left + w * 0.22, y: top + h * 0.65, name: 'A', offX: -14, offY: 0 };
      const B = { x: left, y: bottom - h * 0.06, name: 'B', offX: -14, offY: 10 };
      const C = { x: left + w * 0.70, y: bottom, name: 'C', offX: 2, offY: 16 };
      const D = { x: right, y: top + h * 0.68, name: 'D', offX: 8, offY: 2 };

      points = [S, A, B, C, D];
      edges = [
        [1, 4, 'dashed'],
        [1, 2, 'dashed'],
        [2, 3, 'solid'],
        [3, 4, 'solid'],
        [0, 1, 'dashed'],
        [0, 2, 'solid'],
        [0, 3, 'solid'],
        [0, 4, 'solid']
      ];
    } else if (shape === 'pyramid-trapezoid') {
      const S = { x: left + w * 0.35, y: top, name: 'S', offX: 0, offY: -10 };
      const A = { x: left + w * 0.15, y: top + h * 0.62, name: 'A', offX: -14, offY: 0 };
      const D = { x: right, y: top + h * 0.62, name: 'D', offX: 8, offY: 2 };
      const B = { x: left + w * 0.05, y: bottom, name: 'B', offX: -14, offY: 14 };
      const C = { x: left + w * 0.65, y: bottom, name: 'C', offX: 4, offY: 15 };

      points = [S, A, B, C, D];
      edges = [
        [1, 4, 'dashed'],
        [1, 2, 'dashed'],
        [2, 3, 'solid'],
        [3, 4, 'solid'],
        [0, 1, 'dashed'],
        [0, 2, 'solid'],
        [0, 3, 'solid'],
        [0, 4, 'solid']
      ];
    } else if (shape === 'pyramid-parallelogram') {
      const S = { x: left + w * 0.38, y: top, name: 'S', offX: 0, offY: -10 };
      const A = { x: left + w * 0.30, y: top + h * 0.62, name: 'A', offX: -14, offY: 0 };
      const D = { x: right, y: top + h * 0.62, name: 'D', offX: 8, offY: 2 };
      const B = { x: left, y: bottom, name: 'B', offX: -14, offY: 14 };
      const C = { x: right - w * 0.30, y: bottom, name: 'C', offX: 8, offY: 14 };

      points = [S, A, B, C, D];
      edges = [
        [1, 4, 'dashed'],
        [1, 2, 'dashed'],
        [2, 3, 'solid'],
        [3, 4, 'solid'],
        [0, 1, 'dashed'],
        [0, 2, 'solid'],
        [0, 3, 'solid'],
        [0, 4, 'solid']
      ];
    } else if (shape === 'pyramid-pentagon') {
      const S = { x: left + w * 0.40, y: top, name: 'S', offX: 0, offY: -10 };
      const A = { x: left + w * 0.20, y: top + h * 0.60, name: 'A', offX: -14, offY: 0 };
      const B = { x: left, y: top + h * 0.80, name: 'B', offX: -14, offY: 10 };
      const C = { x: left + w * 0.40, y: bottom, name: 'C', offX: -6, offY: 15 };
      const D = { x: left + w * 0.80, y: bottom - h * 0.08, name: 'D', offX: 6, offY: 14 };
      const E = { x: right, y: top + h * 0.64, name: 'E', offX: 8, offY: 2 };

      points = [S, A, B, C, D, E];
      edges = [
        [5, 1, 'dashed'],
        [1, 2, 'dashed'],
        [2, 3, 'solid'],
        [3, 4, 'solid'],
        [4, 5, 'solid'],
        [0, 1, 'dashed'],
        [0, 2, 'solid'],
        [0, 3, 'solid'],
        [0, 4, 'solid'],
        [0, 5, 'solid']
      ];
    } else if (shape === 'pyramid-regular') {
      const A = { x: left + w * 0.30, y: top + h * 0.65, name: 'A', offX: -14, offY: 0 };
      const D = { x: right, y: top + h * 0.65, name: 'D', offX: 8, offY: 2 };
      const B = { x: left, y: bottom, name: 'B', offX: -14, offY: 14 };
      const C = { x: right - w * 0.30, y: bottom, name: 'C', offX: 8, offY: 14 };

      const O = {
        x: (A.x + C.x) / 2,
        y: (A.y + C.y) / 2,
        name: 'O',
        offX: 6,
        offY: 12
      };
      const S = { x: O.x, y: top, name: 'S', offX: 0, offY: -10 };

      points = [S, A, B, C, D, O];
      edges = [
        [1, 4, 'dashed'],
        [1, 2, 'dashed'],
        [2, 3, 'solid'],
        [3, 4, 'solid'],
        [0, 1, 'dashed'],
        [0, 2, 'solid'],
        [0, 3, 'solid'],
        [0, 4, 'solid'],
        [1, 3, 'dashed'],
        [2, 4, 'dashed'],
        [0, 5, 'dashed']
      ];
    }

    return { points, edges };
  }

  function drawSolidShape(context, geo) {
    if (!geo.points || !geo.edges) return;

    // Đảm bảo cạnh đáy khuất AB [1, 2] luôn là nét đứt theo đúng chuẩn SGK Hình học 11/12
    if (geo.shape && geo.shape.startsWith('pyramid')) {
      for (const edge of geo.edges) {
        if ((edge[0] === 1 && edge[1] === 2) || (edge[0] === 2 && edge[1] === 1)) {
          edge[2] = 'dashed';
        }
      }
    }

    for (const edge of geo.edges) {
      const p1 = geo.points[edge[0]];
      const p2 = geo.points[edge[1]];
      if (!p1 || !p2) continue;

      context.save();
      if (edge[2] === 'dashed') {
        context.setLineDash([7, 5]);
      } else {
        context.setLineDash([]);
      }

      context.beginPath();
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.stroke();
      context.restore();
    }

    context.save();
    context.font = '600 12.5px -apple-system, sans-serif';
    context.fillStyle = geo.color || '#184e3a';
    for (const p of geo.points) {
      if (p && p.name) {
        context.fillText(p.name, p.x + (p.offX || 0), p.y + (p.offY || 0));
      }
    }
    context.restore();
  }

  // Dựng các hình học chính xác
  function drawGeometricShape(context, geo) {
    const { shape, start, end, angleDeg } = geo;

    if (isSolidShape(shape)) {
      if (!geo.points || !geo.edges || geo.points.length === 0) {
        const data = computeSolidShapeData(shape, start, end);
        geo.points = data.points;
        geo.edges = data.edges;
        geo.is3D = true;
      }
      drawSolidShape(context, geo);
      return;
    }

    if (shape === 'line') {
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    } else if (shape === 'circle') {
      const radius = Math.hypot(end.x - start.x, end.y - start.y);
      context.beginPath();
      context.arc(start.x, start.y, radius, 0, Math.PI * 2);
      context.stroke();

      // Tâm O thanh mảnh: dấu thập nhỏ không tô màu
      context.beginPath();
      context.moveTo(start.x - 3.5, start.y);
      context.lineTo(start.x + 3.5, start.y);
      context.moveTo(start.x, start.y - 3.5);
      context.lineTo(start.x, start.y + 3.5);
      context.stroke();
    } else if (shape === 'angle') {
      const armLength = geo.armLength || Math.max(80, Math.hypot(end.x - start.x, end.y - start.y));
      const baseAngle = (geo.baseDir !== undefined) ? geo.baseDir : Math.atan2(end.y - start.y, end.x - start.x);
      const rad = (angleDeg * Math.PI) / 180;
      const dir = (geo.direction !== undefined) ? geo.direction : ((geo.binding && geo.binding.direction !== undefined) ? geo.binding.direction : -1);

      // Cạnh 1 (Tia cơ sở): Chỉ vẽ nếu không phải onlySecondArm
      if (!geo.onlySecondArm) {
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(start.x + armLength * Math.cos(baseAngle), start.y + armLength * Math.sin(baseAngle));
        context.stroke();
      }

      // Cạnh 2 (Tia được chọn theo số đo góc)
      const p2 = geo.secondPoint || {
        x: start.x + armLength * Math.cos(baseAngle + dir * rad),
        y: start.y + armLength * Math.sin(baseAngle + dir * rad)
      };
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(p2.x, p2.y);
      context.stroke();

      // Hướng thực tế của tia thứ 2 được chọn
      const actualSecondAngle = Math.atan2(p2.y - start.y, p2.x - start.x);

      // Cung góc từ tia cơ sở đến đúng tia được chọn
      const arcRadius = Math.min(42, armLength * 0.42);
      let diff = actualSecondAngle - baseAngle;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      while (diff > Math.PI) diff -= 2 * Math.PI;

      context.beginPath();
      context.arc(start.x, start.y, arcRadius, baseAngle, baseAngle + diff, diff < 0);
      context.stroke();

      // Nhãn số đo góc nằm giữa 2 tia
      const midAngle = baseAngle + diff / 2;
      const textX = start.x + (arcRadius + 18) * Math.cos(midAngle);
      const textY = start.y + (arcRadius + 18) * Math.sin(midAngle);
      context.font = '600 12.5px -apple-system, sans-serif';
      context.fillStyle = geo.color;
      context.fillText(`${angleDeg}°`, textX - 8, textY + 4);
    } else if (shape === 'triangle' || shape === 'right-triangle' || shape === 'isosceles-triangle') {
      if (!geo.points || geo.points.length !== 3) {
        if (shape === 'right-triangle') {
          geo.points = [
            { x: start.x, y: start.y },
            { x: start.x, y: end.y },
            { x: end.x, y: end.y }
          ];
        } else {
          geo.points = [
            { x: (start.x + end.x) / 2, y: start.y },
            { x: start.x, y: end.y },
            { x: end.x, y: end.y }
          ];
        }
      }

      context.beginPath();
      context.moveTo(geo.points[0].x, geo.points[0].y);
      context.lineTo(geo.points[1].x, geo.points[1].y);
      context.lineTo(geo.points[2].x, geo.points[2].y);
      context.closePath();
      context.stroke();

      if (shape === 'right-triangle') {
        const p1 = geo.points[1];
        const v0 = { x: geo.points[0].x - p1.x, y: geo.points[0].y - p1.y };
        const v2 = { x: geo.points[2].x - p1.x, y: geo.points[2].y - p1.y };
        const l0 = Math.hypot(v0.x, v0.y) || 1;
        const l2 = Math.hypot(v2.x, v2.y) || 1;
        const s = 14;
        const u0 = { x: (v0.x / l0) * s, y: (v0.y / l0) * s };
        const u2 = { x: (v2.x / l2) * s, y: (v2.y / l2) * s };

        context.beginPath();
        context.moveTo(p1.x + u0.x, p1.y + u0.y);
        context.lineTo(p1.x + u0.x + u2.x, p1.y + u0.y + u2.y);
        context.lineTo(p1.x + u2.x, p1.y + u2.y);
        context.stroke();
      } else if (shape === 'isosceles-triangle') {
        const p0 = geo.points[0];
        const p1 = geo.points[1];
        const p2 = geo.points[2];
        const m1 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
        const m2 = { x: (p0.x + p2.x) / 2, y: (p0.y + p2.y) / 2 };
        // Đoạn vuông góc nhỏ đánh dấu 2 cạnh bằng nhau, không tô màu
        const v1 = { x: p1.x - p0.x, y: p1.y - p0.y };
        const len1 = Math.hypot(v1.x, v1.y) || 1;
        const n1 = { x: (-v1.y / len1) * 5, y: (v1.x / len1) * 5 };

        const v2 = { x: p2.x - p0.x, y: p2.y - p0.y };
        const len2 = Math.hypot(v2.x, v2.y) || 1;
        const n2 = { x: (-v2.y / len2) * 5, y: (v2.x / len2) * 5 };

        context.beginPath();
        context.moveTo(m1.x - n1.x, m1.y - n1.y);
        context.lineTo(m1.x + n1.x, m1.y + n1.y);
        context.moveTo(m2.x - n2.x, m2.y - n2.y);
        context.lineTo(m2.x + n2.x, m2.y + n2.y);
        context.stroke();
      }
    } else if (shape === 'rectangle' || shape === 'square' || shape === 'parallelogram' || shape === 'rhombus') {
      if (!geo.points || geo.points.length !== 4) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        if (shape === 'square') {
          const s = Math.max(Math.abs(dx), Math.abs(dy));
          const sx = (dx >= 0 ? 1 : -1) * s;
          const sy = (dy >= 0 ? 1 : -1) * s;
          geo.points = [
            { x: start.x, y: start.y },
            { x: start.x + sx, y: start.y },
            { x: start.x + sx, y: start.y + sy },
            { x: start.x, y: start.y + sy }
          ];
        } else if (shape === 'rhombus') {
          const cx = (start.x + end.x) / 2;
          const cy = (start.y + end.y) / 2;
          const rx = Math.abs(dx) / 2;
          const ry = Math.abs(dy) / 2;
          geo.points = [
            { x: cx, y: cy - ry },
            { x: cx + rx, y: cy },
            { x: cx, y: cy + ry },
            { x: cx - rx, y: cy }
          ];
        } else if (shape === 'parallelogram') {
          const skew = dx * 0.25;
          geo.points = [
            { x: start.x + skew, y: start.y },
            { x: end.x, y: start.y },
            { x: end.x - skew, y: end.y },
            { x: start.x, y: end.y }
          ];
        } else {
          geo.points = [
            { x: start.x, y: start.y },
            { x: end.x, y: start.y },
            { x: end.x, y: end.y },
            { x: start.x, y: end.y }
          ];
        }
      }

      context.beginPath();
      context.moveTo(geo.points[0].x, geo.points[0].y);
      for (let i = 1; i < geo.points.length; i++) {
        context.lineTo(geo.points[i].x, geo.points[i].y);
      }
      context.closePath();
      context.stroke();
    } else if (shape === 'ellipse') {
      const rx = geo.rx || 60;
      const ry = geo.ry || 40;
      context.beginPath();
      context.ellipse(start.x, start.y, rx, ry, geo.rotation || 0, 0, Math.PI * 2);
      context.stroke();

      // Tâm O elip: dấu thập thanh mảnh không tô màu
      context.beginPath();
      context.moveTo(start.x - 3.5, start.y);
      context.lineTo(start.x + 3.5, start.y);
      context.moveTo(start.x, start.y - 3.5);
      context.lineTo(start.x, start.y + 3.5);
      context.stroke();
    } else if (shape === 'inscribed-triangle') {
      const radius = Math.hypot(end.x - start.x, end.y - start.y);
      context.beginPath();
      context.arc(start.x, start.y, radius, 0, Math.PI * 2);
      context.stroke();

      // Tâm đường tròn O: dấu thập thanh mảnh không tô màu
      context.beginPath();
      context.moveTo(start.x - 3.5, start.y);
      context.lineTo(start.x + 3.5, start.y);
      context.moveTo(start.x, start.y - 3.5);
      context.lineTo(start.x, start.y + 3.5);
      context.stroke();

      if (!geo.angles || geo.angles.length !== 3) {
        geo.angles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
      }

      const p1 = { x: start.x + radius * Math.cos(geo.angles[0]), y: start.y + radius * Math.sin(geo.angles[0]) };
      const p2 = { x: start.x + radius * Math.cos(geo.angles[1]), y: start.y + radius * Math.sin(geo.angles[1]) };
      const p3 = { x: start.x + radius * Math.cos(geo.angles[2]), y: start.y + radius * Math.sin(geo.angles[2]) };

      context.beginPath();
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.lineTo(p3.x, p3.y);
      context.closePath();
      context.stroke();
    } else if (shape === 'tangent') {
      // Tiếp tuyến của đường tròn đi qua điểm đã chọn
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();

      // Ký hiệu góc vuông tại tiếp điểm với bán kính
      if (geo.tangentPoint && geo.center) {
        const s = 13;
        const T = geo.tangentPoint;
        const O = geo.center;
        const radLen = Math.hypot(O.x - T.x, O.y - T.y) || 1;
        const radU = { x: (O.x - T.x) / radLen, y: (O.y - T.y) / radLen };
        const tanLen = Math.hypot(end.x - start.x, end.y - start.y) || 1;
        const tanU = { x: (end.x - start.x) / tanLen, y: (end.y - start.y) / tanLen };

        context.beginPath();
        context.moveTo(T.x + radU.x * s, T.y + radU.y * s);
        context.lineTo(T.x + radU.x * s + tanU.x * s, T.y + radU.y * s + tanU.y * s);
        context.lineTo(T.x + tanU.x * s, T.y + tanU.y * s);
        context.stroke();
      }
    } else if (shape === 'point') {
      if (geo.isMidpoint) {
        // Chấm trung điểm thanh mảnh, kích thước nét mảnh bằng nét của đoạn thẳng (không có vạch gạch chéo)
        const r = Math.max(2, Math.min(3, (geo.width || state.strokeWidth || 2.5) * 0.95));
        context.beginPath();
        context.arc(start.x, start.y, r, 0, Math.PI * 2);
        context.fillStyle = geo.color || state.color;
        context.fill();
      } else {
        // Chấm điểm hình học thông thường
        context.beginPath();
        context.arc(start.x, start.y, 4, 0, Math.PI * 2);
        context.fillStyle = geo.color || state.color;
        context.fill();
        context.lineWidth = 1.5;
        context.strokeStyle = '#ffffff';
        context.stroke();
      }
    } else if (shape === 'two-tangents') {
      // 2 Tiếp tuyến cắt nhau tại 1 điểm ngoài M, có thể di chuyển điểm đó, không vẽ bán kính
      const d = Math.hypot(end.x - start.x, end.y - start.y);
      const radius = geo.radius || Math.max(30, Math.min(120, d * 0.45));
      geo.radius = radius;

      // Đường tròn
      context.beginPath();
      context.arc(start.x, start.y, radius, 0, Math.PI * 2);
      context.stroke();

      // Tâm O: dấu thập thanh mảnh không tô màu
      context.beginPath();
      context.moveTo(start.x - 3.5, start.y);
      context.lineTo(start.x + 3.5, start.y);
      context.moveTo(start.x, start.y - 3.5);
      context.lineTo(start.x, start.y + 3.5);
      context.stroke();

      const effD = Math.max(radius + 1, d);
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      const beta = Math.acos(radius / effD);

      // 2 tiếp điểm T1, T2
      const t1 = {
        x: start.x + radius * Math.cos(angle - beta),
        y: start.y + radius * Math.sin(angle - beta)
      };
      const t2 = {
        x: start.x + radius * Math.cos(angle + beta),
        y: start.y + radius * Math.sin(angle + beta)
      };

      // 2 đoạn tiếp tuyến MT1 và MT2 (không tô màu điểm)
      context.beginPath();
      context.moveTo(end.x, end.y);
      context.lineTo(t1.x, t1.y);
      context.moveTo(end.x, end.y);
      context.lineTo(t2.x, t2.y);
      context.stroke();
    } else if (shape === 'perpendicular') {
      // Đường thẳng vuông góc đi qua điểm đã chọn
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();

      // Ký hiệu góc vuông tại chân đường vuông góc (foot)
      if (geo.foot && geo.baseDir) {
        const s = 13;
        const u = geo.baseDir;
        const len = Math.hypot(end.x - start.x, end.y - start.y) || 1;
        const v = { x: (end.x - start.x) / len, y: (end.y - start.y) / len };
        context.beginPath();
        context.moveTo(geo.foot.x + u.x * s, geo.foot.y + u.y * s);
        context.lineTo(geo.foot.x + u.x * s + v.x * s, geo.foot.y + u.y * s + v.y * s);
        context.lineTo(geo.foot.x + v.x * s, geo.foot.y + v.y * s);
        context.stroke();
      }
    } else if (shape === 'parallel') {
      // Đường thẳng song song đi qua điểm đã chọn (thuần nét thẳng, không vẽ mũi tên)
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    } else if (shape === 'bisector') {
      // 1. Đường tia phân giác từ đỉnh start đến end
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();

      // 2. Ký hiệu 2 cung góc bằng nhau kèm vạch gạch chéo chuẩn SGK Toán học
      const bisectorAngle = Math.atan2(end.y - start.y, end.x - start.x);
      const a1 = geo.arm1Angle !== undefined ? geo.arm1Angle : bisectorAngle - 0.45;
      const a2 = geo.arm2Angle !== undefined ? geo.arm2Angle : bisectorAngle + 0.45;

      // Hai cung tròn có cùng bán kính R chuẩn mực
      const R = 26;

      // Vẽ cung góc 1 (từ cạnh 1 đến tia phân giác)
      drawAngleArc(context, start, R, a1, bisectorAngle);
      // Vẽ cung góc 2 (từ tia phân giác đến cạnh 2)
      drawAngleArc(context, start, R, bisectorAngle, a2);

      // Vạch gạch chéo ngắn (tick mark) ở chính giữa cung 1 thể hiện góc bằng nhau
      let diff1 = bisectorAngle - a1;
      while (diff1 < -Math.PI) diff1 += 2 * Math.PI;
      while (diff1 > Math.PI) diff1 -= 2 * Math.PI;
      const midAngle1 = a1 + diff1 / 2;
      const tickLen = 4.5;
      context.beginPath();
      context.moveTo(start.x + (R - tickLen) * Math.cos(midAngle1), start.y + (R - tickLen) * Math.sin(midAngle1));
      context.lineTo(start.x + (R + tickLen) * Math.cos(midAngle1), start.y + (R + tickLen) * Math.sin(midAngle1));
      context.stroke();

      // Vạch gạch chéo ngắn (tick mark) ở chính giữa cung 2 thể hiện góc bằng nhau
      let diff2 = a2 - bisectorAngle;
      while (diff2 < -Math.PI) diff2 += 2 * Math.PI;
      while (diff2 > Math.PI) diff2 -= 2 * Math.PI;
      const midAngle2 = bisectorAngle + diff2 / 2;
      context.beginPath();
      context.moveTo(start.x + (R - tickLen) * Math.cos(midAngle2), start.y + (R - tickLen) * Math.sin(midAngle2));
      context.lineTo(start.x + (R + tickLen) * Math.cos(midAngle2), start.y + (R + tickLen) * Math.sin(midAngle2));
      context.stroke();
    }
  }

  // Vẽ mũi tên ký hiệu song song
  function drawArrowHead(context, point, dir) {
    const s = 7;
    const perp = { x: -dir.y, y: dir.x };
    context.beginPath();
    context.moveTo(point.x - dir.x * s + perp.x * (s * 0.6), point.y - dir.y * s + perp.y * (s * 0.6));
    context.lineTo(point.x, point.y);
    context.lineTo(point.x - dir.x * s - perp.x * (s * 0.6), point.y - dir.y * s - perp.y * (s * 0.6));
    context.stroke();
  }

  // Vẽ cung tròn góc giữa 2 góc hướng (không bị vẽ ngược/tròn đầy)
  function drawAngleArc(c, center, r, angFrom, angTo) {
    let diff = angTo - angFrom;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    c.beginPath();
    c.arc(center.x, center.y, r, angFrom, angFrom + diff, diff < 0);
    c.stroke();
  }

  // Khoảng cách từ điểm (px, py) đến đoạn thẳng (ax, ay)-(bx, by)
  function distToSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(px - ax, py - ay);
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
    const projX = ax + t * dx;
    const projY = ay + t * dy;
    return Math.hypot(px - projX, py - projY);
  }

  // Chiếu điểm (px, py) vuông góc lên đoạn thẳng (ax, ay)-(bx, by), trả về tọa độ và tỉ lệ t (0 <= t <= 1)
  function projectPointOnSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return { x: ax, y: ay, t: 0 };
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
    return {
      x: ax + t * dx,
      y: ay + t * dy,
      t: t
    };
  }

  // Tìm cạnh hoặc đoạn thẳng gần vị trí (x, y) nhất
  function findEdgeAt(x, y, maxDist = 20) {
    const list = state.pages[state.currentPage] || [];
    let best = null;
    let minDist = maxDist;

    function checkEdge(el, a, b, edgeId, extra = {}) {
      if (!a || !b) return;
      const d = distToSegment(x, y, a.x, a.y, b.x, b.y);
      if (d < minDist) {
        minDist = d;
        best = {
          element: el,
          start: { x: a.x, y: a.y },
          end: { x: b.x, y: b.y },
          edgeId: edgeId,
          ...extra
        };
      }
    }

    for (let i = list.length - 1; i >= 0; i--) {
      const el = list[i];
      if (el.type !== 'geo') continue;

      if (el.shape === 'line' || el.shape === 'perpendicular' || el.shape === 'parallel' || el.shape === 'bisector') {
        checkEdge(el, el.start, el.end, 'main', { isLine: true });
      } else if (isSolidShape(el.shape) && el.edges && el.points) {
        el.edges.forEach((edge, eIdx) => {
          const v1 = edge[0];
          const v2 = edge[1];
          if (el.points[v1] && el.points[v2]) {
            checkEdge(el, el.points[v1], el.points[v2], `solid_${eIdx}`, {
              v1Index: v1,
              v2Index: v2,
              isSolidEdge: true
            });
          }
        });
      } else if (el.points && el.points.length >= 3) {
        const n = el.points.length;
        for (let j = 0; j < n; j++) {
          checkEdge(el, el.points[j], el.points[(j + 1) % n], `edge_${j}`, {
            v1Index: j,
            v2Index: (j + 1) % n,
            isPolygonEdge: true
          });
        }
      } else if (el.shape === 'inscribed-triangle') {
        const r = Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
        const angles = el.angles || [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
        const pts = angles.map(ang => ({
          x: el.start.x + r * Math.cos(ang),
          y: el.start.y + r * Math.sin(ang)
        }));
        for (let j = 0; j < 3; j++) {
          checkEdge(el, pts[j], pts[(j + 1) % 3], `inscribed_${j}`, {
            v1Index: j,
            v2Index: (j + 1) % 3,
            isInscribedEdge: true
          });
        }
      }
    }
    return best;
  }

  // Tìm đỉnh hoặc điểm đã có gần (x, y) nhất
  function findPointAt(x, y, maxDist = 18) {
    const list = state.pages[state.currentPage] || [];
    let best = null;
    let minDist = maxDist;

    function checkPt(pt, name, el, extra = {}) {
      if (!pt) return;
      const d = Math.hypot(x - pt.x, y - pt.y);
      if (d < minDist) {
        minDist = d;
        best = { x: pt.x, y: pt.y, name: name, element: el, ...extra };
      }
    }

    for (let i = list.length - 1; i >= 0; i--) {
      const el = list[i];
      if (el.type !== 'geo') continue;

      if (el.shape === 'circle' || el.shape === 'inscribed-triangle' || el.shape === 'two-tangents' || el.shape === 'ellipse') {
        checkPt(el.start, 'Tâm O', el);
      }
      if (el.shape === 'point') {
        checkPt(el.start, 'Điểm', el);
      }
      if (el.tangentPoint) {
        checkPt(el.tangentPoint, 'Tiếp điểm T', el);
      }
      if (el.points) {
        el.points.forEach((p, idx) => checkPt(p, p.name ? `Đỉnh ${p.name}` : `Đỉnh ${idx + 1}`, el, { vIndex: idx }));
      }
      if (el.start && el.shape !== 'circle' && el.shape !== 'ellipse') checkPt(el.start, 'Điểm đầu', el);
      if (el.end && el.shape !== 'circle' && el.shape !== 'ellipse') checkPt(el.end, 'Điểm cuối', el);
    }
    return best;
  }

  // Tìm đường tròn gần vị trí (x, y) nhất
  function findCircleAt(x, y, maxDist = 24) {
    const list = state.pages[state.currentPage] || [];
    let best = null;
    let minDist = maxDist;

    for (let i = list.length - 1; i >= 0; i--) {
      const el = list[i];
      if (el.type !== 'geo') continue;
      if (el.shape === 'circle' || el.shape === 'inscribed-triangle' || el.shape === 'two-tangents') {
        const r = el.radius || Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
        const d = Math.hypot(x - el.start.x, y - el.start.y);
        const distToRim = Math.abs(d - r);
        if (distToRim < minDist || d < 20) {
          minDist = distToRim;
          best = {
            element: el,
            center: { x: el.start.x, y: el.start.y },
            radius: r
          };
        }
      }
    }
    return best;
  }

  // Cấu hình nhãn & biểu tượng mặc định ban đầu: Hình; Dựng hình; HHKG
  const DEFAULT_GEO_GROUPS = {
    shapes: {
      btnId: 'btn-group-shapes',
      label: 'Hình',
      defaultGeo: 'line',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="4" y1="20" x2="20" y2="4"/></svg>'
    },
    construction: {
      btnId: 'btn-group-construction',
      label: 'Dựng hình',
      defaultGeo: 'midpoint',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>'
    },
    hhkg: {
      btnId: 'btn-group-hhkg',
      label: 'HHKG',
      defaultGeo: 'tetrahedron',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 L2 18 L12 22 L22 18 Z"/><path d="M12 2 L12 22"/></svg>'
    }
  };

  // Khôi phục lại đúng tên và biểu tượng ban đầu theo thứ tự: Hình; Dựng hình; HHKG
  function resetGeoDropdownLabels() {
    Object.values(DEFAULT_GEO_GROUPS).forEach(cfg => {
      const btn = document.getElementById(cfg.btnId);
      if (btn) {
        const lbl = btn.querySelector('.geo-group-label');
        const icn = btn.querySelector('.geo-group-icon');
        if (lbl) lbl.textContent = cfg.label;
        if (icn) icn.innerHTML = cfg.icon;
      }
    });

    // Đặt lại active item bên trong từng dropdown menu về mặc định
    document.querySelectorAll('.geo-dropdown-item').forEach(item => {
      const g = item.dataset.group;
      const geo = item.dataset.geo;
      if (DEFAULT_GEO_GROUPS[g] && DEFAULT_GEO_GROUPS[g].defaultGeo === geo) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Kết thúc một tác vụ hình học: phục hồi đúng tên các nút, tắt active, chuyển về công cụ Chọn
  function finishGeoTask(createdElement = null) {
    // 1. Phục hồi đúng tên và biểu tượng cho các nhóm dropdown hình học
    resetGeoDropdownLabels();

    // 2. Tắt active trên các nút nhóm hình học
    document.querySelectorAll('.geo-group-btn').forEach(gb => gb.classList.remove('active'));
    const toolGraph = document.getElementById('tool-graph');
    if (toolGraph) toolGraph.classList.remove('active');

    // 3. Reset trạng thái dựng hình
    state.activeGeo = null;
    state.geoStartPoint = null;
    state.hoverSnapPoint = null;
    state.construction = { point: null, circle: null, line: null, edges: [] };
    state.pendingConstruction = null;
    state.pendingOptions = null;
    state.hoveredOptionIndex = -1;
    removeFloatingAngleBox();
    closeAllDropdowns();

    // 4. Chuyển sang công cụ Chọn (Select tool) để người dùng có thể thao tác với hình vừa tạo
    const toolSelect = document.getElementById('tool-select');
    if (toolSelect) {
      toolButtons.forEach(b => b.classList.remove('active'));
      toolSelect.classList.add('active');
      state.activeTool = 'select';
      setCanvasCursor(SHARP_ARROW_CURSOR);
      statusToolInfo.textContent = 'Công cụ: Chọn đối tượng (Bấm để chọn đơn lẻ đối tượng, kéo để di chuyển, Delete để xóa)';
      updateContextualToolbar('select');
    }

    // 5. Nếu có đối tượng vừa tạo, chỉ chọn đơn lẻ đối tượng đó
    if (createdElement) {
      setSelectedElements([createdElement]);
    }

    renderPage();
  }

  // Dựng tiếp tuyến cho đường tròn đi qua 1 điểm (trên hoặc ngoài đường tròn)
  function constructTangent(point, circle, bindingInfo = null) {
    const O = circle.center || (circle.start ? { x: circle.start.x, y: circle.start.y } : { x: 0, y: 0 });
    const R = circle.radius || (circle.end ? Math.hypot(circle.end.x - circle.start.x, circle.end.y - circle.start.y) : 50);
    const px = (point.x !== undefined) ? point.x : (point.start ? point.start.x : 0);
    const py = (point.y !== undefined) ? point.y : (point.start ? point.start.y : 0);
    const d = Math.hypot(px - O.x, py - O.y);

    if (d < R - 8) {
      statusToolInfo.textContent = 'Điểm đã chọn nằm bên trong đường tròn, không thể kẻ tiếp tuyến!';
      state.construction = { point: null, circle: null, line: null, edges: [] };
      state.pendingConstruction = null;
      renderPage();
      return null;
    }

    const circleEl = circle.element || (circle.shape === 'circle' ? circle : null);
    const ptEl = (point && point.element) ? point.element : (point && point.shape === 'point' ? point : null);

    // TRƯỜNG HỢP 1: Điểm nằm TRÊN đường tròn (chỉ có duy nhất 1 tiếp tuyến)
    if (Math.abs(d - R) <= 15) {
      if (circleEl) ensureElementId(circleEl);
      if (ptEl) ensureElementId(ptEl);
      const ang = Math.atan2(py - O.y, px - O.x);
      const T = { x: O.x + R * Math.cos(ang), y: O.y + R * Math.sin(ang) };
      const uPerp = { x: -Math.sin(ang), y: Math.cos(ang) };
      const p1 = { x: T.x - 90 * uPerp.x, y: T.y - 90 * uPerp.y };
      const p2 = { x: T.x + 90 * uPerp.x, y: T.y + 90 * uPerp.y };

      const bInfo = circleEl ? {
        type: 'circle_tangent',
        parentId: circleEl.id,
        pointElId: ptEl ? ptEl.id : null,
        onCircle: true,
        angle: ang
      } : null;

      const newGeo = {
        type: 'geo',
        shape: 'tangent',
        binding: bInfo,
        start: p1,
        end: p2,
        tangentPoint: T,
        center: { x: O.x, y: O.y },
        radius: R,
        color: state.color,
        width: state.strokeWidth,
        dash: state.dashStyle
      };

      ensureElementId(newGeo);
      const parentsToLink = [circleEl, ptEl].filter(Boolean);
      if (parentsToLink.length > 0) linkGroupMulti(parentsToLink, newGeo);
      pushNewElement(newGeo);
      finishGeoTask(newGeo);
      statusToolInfo.textContent = '✨ Đã dựng tiếp tuyến tại điểm trên đường tròn.';
      return newGeo;
    }

    // TRƯỜNG HỢP 2: Điểm nằm NGOÀI đường tròn (có 2 tiếp tuyến) -> HIỂN THỊ 2 OPTION NÉT ĐỨT ĐỂ NGƯỜI DÙNG BẤM CHỌN
    const ang = Math.atan2(py - O.y, px - O.x);
    const beta = Math.acos(Math.max(-1, Math.min(1, R / d)));

    // Nhánh 0: ang - beta
    const T1 = { x: O.x + R * Math.cos(ang - beta), y: O.y + R * Math.sin(ang - beta) };
    const vx1 = T1.x - px, vy1 = T1.y - py;
    const len1 = Math.hypot(vx1, vy1) || 1;
    const uTan1 = { x: vx1 / len1, y: vy1 / len1 };
    const p1_1 = { x: px - 25 * uTan1.x, y: py - 25 * uTan1.y };
    const p2_1 = { x: T1.x + 45 * uTan1.x, y: T1.y + 45 * uTan1.y };

    // Nhánh 1: ang + beta
    const T2 = { x: O.x + R * Math.cos(ang + beta), y: O.y + R * Math.sin(ang + beta) };
    const vx2 = T2.x - px, vy2 = T2.y - py;
    const len2 = Math.hypot(vx2, vy2) || 1;
    const uTan2 = { x: vx2 / len2, y: vy2 / len2 };
    const p1_2 = { x: px - 25 * uTan2.x, y: py - 25 * uTan2.y };
    const p2_2 = { x: T2.x + 45 * uTan2.x, y: T2.y + 45 * uTan2.y };

    state.pendingOptions = {
      type: 'tangent',
      point: point,
      circle: circle,
      options: [
        {
          id: 1,
          name: 'Tiếp tuyến 1',
          branch: 0,
          start: p1_1,
          end: p2_1,
          tangentPoint: T1
        },
        {
          id: 2,
          name: 'Tiếp tuyến 2',
          branch: 1,
          start: p1_2,
          end: p2_2,
          tangentPoint: T2
        }
      ]
    };

    state.hoveredOptionIndex = -1;
    state.construction = { point: null, circle: null, line: null, edges: [] };
    state.pendingConstruction = null;
    state.activeTool = 'select';
    toolButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-tool') === 'select'));
    setCanvasCursor(SHARP_ARROW_CURSOR);
    updateContextualToolbar('select');

    statusToolInfo.textContent = '✨ Có 2 đường tiếp tuyến gợi ý (nét đứt). Bấm vào đường cần chọn trên bảng vẽ.';
    renderPage();
    return null;
  }

  // Hoàn tất dựng tiếp tuyến khi người dùng đã bấm chọn 1 trong 2 đường gợi ý
  function finalizeChosenTangent(opt) {
    if (!state.pendingOptions || state.pendingOptions.type !== 'tangent') return null;
    const { point, circle } = state.pendingOptions;
    const O = circle.center || (circle.start ? { x: circle.start.x, y: circle.start.y } : { x: 0, y: 0 });
    const R = circle.radius || (circle.end ? Math.hypot(circle.end.x - circle.start.x, circle.end.y - circle.start.y) : 50);
    const px = (point.x !== undefined) ? point.x : (point.start ? point.start.x : 0);
    const py = (point.y !== undefined) ? point.y : (point.start ? point.start.y : 0);

    const circleEl = circle.element || (circle.shape === 'circle' ? circle : null);
    const ptEl = (point && point.element) ? point.element : (point && point.shape === 'point' ? point : null);

    let bindingInfo = null;
    if (circleEl) {
      ensureElementId(circleEl);
      if (ptEl) ensureElementId(ptEl);
      bindingInfo = {
        type: 'circle_tangent',
        parentId: circleEl.id,
        pointElId: ptEl ? ptEl.id : null,
        onCircle: false,
        branch: opt.branch,
        offset: { dx: px - O.x, dy: py - O.y }
      };
    }

    const newGeo = {
      type: 'geo',
      shape: 'tangent',
      binding: bindingInfo,
      start: opt.start,
      end: opt.end,
      tangentPoint: opt.tangentPoint,
      center: { x: O.x, y: O.y },
      radius: R,
      color: state.color,
      width: state.strokeWidth,
      dash: state.dashStyle
    };

    ensureElementId(newGeo);
    const parentsToLink = [circleEl, ptEl].filter(Boolean);
    if (parentsToLink.length > 0) {
      linkGroupMulti(parentsToLink, newGeo);
    }
    pushNewElement(newGeo);
    state.pendingOptions = null;
    state.hoveredOptionIndex = -1;
    finishGeoTask(newGeo);
    statusToolInfo.textContent = '✨ Đã hoàn tất dựng tiếp tuyến (tự động gắn kết thành 1 nhóm với đường tròn).';
    renderPage();
    return newGeo;
  }

  // Dựng 2 tiếp tuyến cắt nhau cho đường tròn từ 1 điểm ngoài đường tròn
  function constructTwoTangents(point, circle) {
    const O = circle.center || (circle.start ? { x: circle.start.x, y: circle.start.y } : { x: 0, y: 0 });
    const R = circle.radius || (circle.end ? Math.hypot(circle.end.x - circle.start.x, circle.end.y - circle.start.y) : 50);
    const px = (point.x !== undefined) ? point.x : (point.start ? point.start.x : 0);
    const py = (point.y !== undefined) ? point.y : (point.start ? point.start.y : 0);
    const d = Math.hypot(px - O.x, py - O.y);

    if (d <= R + 2) {
      statusToolInfo.textContent = 'Điểm đã chọn phải nằm bên ngoài đường tròn để dựng 2 tiếp tuyến!';
      state.construction = { point: null, circle: null, line: null, edges: [] };
      renderPage();
      return false;
    }

    const circleEl = circle.element || (circle.shape === 'circle' ? circle : null);
    const ptEl = (point && point.element) ? point.element : (point && point.shape === 'point' ? point : null);
    if (circleEl) ensureElementId(circleEl);
    if (ptEl) ensureElementId(ptEl);

    const newGeo = {
      type: 'geo',
      shape: 'two-tangents',
      binding: circleEl ? {
        type: 'two_tangents',
        parentId: circleEl.id,
        pointElId: ptEl ? ptEl.id : null
      } : null,
      start: { x: O.x, y: O.y },
      end: { x: px, y: py },
      radius: R,
      color: state.color,
      width: state.strokeWidth,
      dash: state.dashStyle
    };

    ensureElementId(newGeo);
    const parentsToLink = [circleEl, ptEl].filter(Boolean);
    if (parentsToLink.length > 0) {
      linkGroupMulti(parentsToLink, newGeo);
    }
    pushNewElement(newGeo);
    finishGeoTask(newGeo);
    statusToolInfo.textContent = '✨ Đã dựng 2 tiếp tuyến cắt nhau (tự động gắn kết thành 1 nhóm với hình). Kéo điểm giao nhau để điều chỉnh.';
    return true;
  }

  // Dựng trung điểm giữa 2 điểm (hoặc của một đoạn thẳng)
  function constructMidpoint(ptA, ptB, bindingInfo = null, parentEl = null) {
    if (!ptA || !ptB) return null;
    const mx = (ptA.x + ptB.x) / 2;
    const my = (ptA.y + ptB.y) / 2;
    const newPoint = {
      type: 'geo',
      shape: 'point',
      isMidpoint: true,
      binding: bindingInfo,
      p1: { x: ptA.x, y: ptA.y },
      p2: { x: ptB.x, y: ptB.y },
      start: { x: mx, y: my },
      end: { x: mx, y: my },
      color: state.color,
      width: state.strokeWidth || 3,
      dash: 'solid'
    };
    ensureElementId(newPoint);
    if (parentEl) {
      if (Array.isArray(parentEl)) {
        parentEl.forEach(ensureElementId);
        linkGroupMulti(parentEl, newPoint);
      } else {
        ensureElementId(parentEl);
        if (newPoint.binding) {
          newPoint.binding.parentId = parentEl.id;
        }
        linkGroup(parentEl, newPoint);
      }
    } else if (bindingInfo && bindingInfo.parentId) {
      const p = findElementById(bindingInfo.parentId);
      if (p) linkGroup(p, newPoint);
    }
    pushNewElement(newPoint);
    state.midpointHoverEdge = null;
    state.midpointHoverPoint = null;
    finishGeoTask(newPoint);
    statusToolInfo.textContent = `✨ Đã tạo trung điểm tại (${Math.round(mx)}, ${Math.round(my)}) (tự động gắn kết thành 1 nhóm với hình).`;
    return newPoint;
  }

  // Kích hoạt tạo trung điểm với phản hồi tức thì: hiển thị đoạn thẳng đậm trước rồi sinh trung điểm
  function triggerMidpointWithHighlight(ptA, ptB, bindingInfo = null, parentEl = null) {
    if (!ptA || !ptB) return null;
    state.midpointHighlightSegment = {
      p1: { x: ptA.x, y: ptA.y },
      p2: { x: ptB.x, y: ptB.y }
    };
    statusToolInfo.textContent = '📏 Đã nhận 2 điểm: Hiển thị đoạn thẳng đậm... Trung điểm chuẩn bị xuất hiện!';
    renderPage();

    if (state.midpointTimer) clearTimeout(state.midpointTimer);
    state.midpointTimer = setTimeout(() => {
      const mid = constructMidpoint(ptA, ptB, bindingInfo, parentEl);
      // Giữ đoạn thẳng hiển thị đậm thêm 650ms nữa để đối chiếu rồi tự tắt nhẹ nhàng
      setTimeout(() => {
        state.midpointHighlightSegment = null;
        renderPage();
      }, 650);
    }, 200);
  }

  // ==========================================================
  // CÁC HÀM TÍNH TOÁN VÀ DỰNG GIAO ĐIỂM (INTERSECTION)
  // ==========================================================

  // Tìm giao điểm giữa 2 đường thẳng đi qua (p1, p2) và (p3, p4)
  function findLineLineIntersection(p1, p2, p3, p4) {
    if (!p1 || !p2 || !p3 || !p4) return null;
    const dx1 = p2.x - p1.x;
    const dy1 = p2.y - p1.y;
    const dx2 = p4.x - p3.x;
    const dy2 = p4.y - p3.y;
    const denom = dx1 * dy2 - dy1 * dx2;
    if (Math.abs(denom) < 1e-6) {
      return null; // Song song hoặc trùng nhau
    }
    const t = ((p3.x - p1.x) * dy2 - (p3.y - p1.y) * dx2) / denom;
    return {
      x: p1.x + t * dx1,
      y: p1.y + t * dy1
    };
  }

  // Tìm giao điểm giữa đường thẳng (p1, p2) và đường tròn (center, radius)
  function findLineCircleIntersection(p1, p2, center, radius) {
    if (!p1 || !p2 || !center || radius <= 0) return [];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) return [];
    const ux = dx / len;
    const uy = dy / len;
    const vx = p1.x - center.x;
    const vy = p1.y - center.y;
    const b = 2 * (vx * ux + vy * uy);
    const c = (vx * vx + vy * vy) - radius * radius;
    const delta = b * b - 4 * c;

    if (delta < -1e-4) {
      return []; // Không cắt
    }
    if (Math.abs(delta) <= 1e-4) {
      const t = -b / 2;
      return [{ x: p1.x + t * ux, y: p1.y + t * uy }];
    }
    const sqrtDelta = Math.sqrt(delta);
    const t1 = (-b - sqrtDelta) / 2;
    const t2 = (-b + sqrtDelta) / 2;
    return [
      { x: p1.x + t1 * ux, y: p1.y + t1 * uy },
      { x: p1.x + t2 * ux, y: p1.y + t2 * uy }
    ];
  }

  // Tìm giao điểm giữa 2 đường tròn (c1, r1) và (c2, r2)
  function findCircleCircleIntersection(c1, r1, c2, r2) {
    if (!c1 || !c2 || r1 <= 0 || r2 <= 0) return [];
    const d = Math.hypot(c2.x - c1.x, c2.y - c1.y);
    if (d < 1e-4) return []; // Đồng tâm
    if (d > r1 + r2 + 1e-4) return []; // Không chạm nhau
    if (d < Math.abs(r1 - r2) - 1e-4) return []; // Chứa nhau không chạm

    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    let h2 = r1 * r1 - a * a;
    if (h2 < 0) h2 = 0;
    const h = Math.sqrt(h2);

    const p0x = c1.x + (a * (c2.x - c1.x)) / d;
    const p0y = c1.y + (a * (c2.y - c1.y)) / d;

    if (h < 1e-4) {
      return [{ x: p0x, y: p0y }];
    }

    const nx = -(c2.y - c1.y) / d;
    const ny = (c2.x - c1.x) / d;
    return [
      { x: p0x + h * nx, y: p0y + h * ny },
      { x: p0x - h * nx, y: p0y - h * ny }
    ];
  }

  // Trích xuất hình học (line hoặc circle) từ đối tượng được nhấp chọn
  function extractGeoGeometry(obj) {
    if (!obj) return null;
    if (obj.center && obj.radius) {
      return { type: 'circle', center: obj.center, radius: obj.radius, element: obj.element || obj };
    }
    if (obj.start && obj.end) {
      return {
        type: 'line',
        start: obj.start,
        end: obj.end,
        element: obj.element || obj,
        v1Index: obj.v1Index,
        v2Index: obj.v2Index,
        isSolidEdge: !!obj.isSolidEdge,
        isPolygonEdge: !!obj.isPolygonEdge
      };
    }
    const circ = getCircleFromElement(obj);
    if (circ) return { type: 'circle', center: circ.center, radius: circ.radius, element: circ.element || obj };
    const line = getLineOrEdgeFromElement(obj);
    if (line) {
      return {
        type: 'line',
        start: line.start,
        end: line.end,
        element: line.element || obj,
        v1Index: line.v1Index,
        v2Index: line.v2Index,
        isSolidEdge: !!line.isSolidEdge,
        isPolygonEdge: !!line.isPolygonEdge
      };
    }
    return null;
  }

  // Kiểm tra 2 cạnh của khối HHKG 3D có chéo nhau trong không gian hay không
  function areSolidEdgesSkew(el, v1A, v2A, v1B, v2B) {
    if (v1A === undefined || v2A === undefined || v1B === undefined || v2B === undefined) {
      return false;
    }
    // 1. Có chung đỉnh -> Cắt nhau tại đỉnh chung (không chéo nhau)
    if (v1A === v1B || v1A === v2B || v2A === v1B || v2A === v2B) {
      return false;
    }

    const model = (window.__hhkg3d && window.__hhkg3d.MODELS_3D) ? window.__hhkg3d.MODELS_3D[el.shape] : null;
    if (!model || !model.faces) {
      return false;
    }

    const allFour = [v1A, v2A, v1B, v2B];

    // 2. Kiểm tra xem có mặt nào trong model chứa cả 4 đỉnh hay không
    for (const face of model.faces) {
      if (allFour.every(v => face.includes(v))) {
        return false; // Cùng thuộc 1 mặt phẳng -> Đồng phẳng!
      }
    }

    // 3. Kiểm tra các mặt phẳng chéo / thiết diện đối xứng đặc biệt
    if (el.shape === 'pyramid-regular' || el.shape === 'pyramid-quad' || el.shape === 'pyramid-parallelogram' || el.shape === 'pyramid-trapezoid') {
      const diagPlanes = [
        [0, 1, 3], // Mặt đối xứng qua đường chéo AC
        [0, 2, 4]  // Mặt đối xứng qua đường chéo BD
      ];
      for (const plane of diagPlanes) {
        if (allFour.every(v => plane.includes(v))) {
          return false;
        }
      }
    }

    // Không có mặt phẳng nào chứa cả 4 đỉnh -> 2 đường CHÉO NHAU!
    return true;
  }

  // Tự động kéo dài đoạn thẳng hoặc vẽ nét dóng đến giao điểm M nếu M nằm ngoài
  function extendSegmentToPoint(geoObj, M) {
    if (!geoObj || !geoObj.start || !geoObj.end || !M) return null;
    const p1 = geoObj.start;
    const p2 = geoObj.end;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const lenSq = dx * dx + dy * dy;
    if (lenSq < 1e-6) return null;

    // Chiếu M lên đường thẳng chứa đoạn: p(t) = p1 + t * (p2 - p1)
    const t = ((M.x - p1.x) * dx + (M.y - p1.y) * dy) / lenSq;

    // Nếu M đã nằm trong đoạn thẳng [0, 1] (hoặc cách đầu mút < 1px): không cần kéo dài
    if (t >= -0.01 && t <= 1.01) {
      return null;
    }

    const closerToP2 = (t > 1);
    const closerPt = closerToP2 ? p2 : p1;

    // Trường hợp 1: Nếu là đoạn thẳng rời tự do (line, perpendicular, parallel...)
    // Kéo dài trực tiếp đầu mút của đoạn thẳng tới điểm giao M
    if (geoObj.element && geoObj.element.shape === 'line' && !geoObj.isSolidEdge && !geoObj.isPolygonEdge) {
      if (closerToP2) {
        geoObj.element.end = { x: M.x, y: M.y };
      } else {
        geoObj.element.start = { x: M.x, y: M.y };
      }
      return geoObj.element;
    }

    // Trường hợp 2: Cạnh của tam giác, đa giác hoặc cạnh của khối HHKG 3D
    // Vẽ thêm 1 đoạn nét dóng nối từ đỉnh/đầu mút gần M tới điểm giao M
    const isSolid = geoObj.isSolidEdge || (geoObj.element && isSolidShape(geoObj.element.shape));
    const extLine = {
      type: 'geo',
      shape: 'line',
      start: { x: closerPt.x, y: closerPt.y },
      end: { x: M.x, y: M.y },
      color: (geoObj.element && geoObj.element.color) ? geoObj.element.color : (state.color || '#184e3a'),
      width: (geoObj.element && geoObj.element.width) ? geoObj.element.width : (state.strokeWidth || 2),
      dash: isSolid ? 'dashed' : 'dashed' // Chuẩn nét dóng hình học SGK
    };
    ensureElementId(extLine);
    if (geoObj.element) {
      ensureElementId(geoObj.element);
      linkGroup(geoObj.element, extLine);
    }
    pushNewElement(extLine);
    return extLine;
  }

  // Dựng giao điểm giữa 2 đối tượng hình học
  function constructIntersectionFromTwoObjects(objA, objB) {
    const gA = extractGeoGeometry(objA);
    const gB = extractGeoGeometry(objB);
    if (!gA || !gB) {
      showPageToast('⚠️ Vui lòng nhấp chọn 2 đường thẳng hoặc đường tròn hợp lệ!');
      statusToolInfo.textContent = 'Vui lòng chọn 2 đường thẳng, đoạn thẳng hoặc đường tròn để tìm giao điểm.';
      return false;
    }

    // 1. KIỂM TRA ĐẶC BIỆT CHO HÌNH HỌC KHÔNG GIAN (HHKG 3D)
    // Nếu cả 2 cạnh cùng thuộc một khối HHKG 3D: kiểm tra chéo nhau vs đồng phẳng
    if (gA.type === 'line' && gB.type === 'line' && gA.element && gB.element && gA.element === gB.element && isSolidShape(gA.element.shape)) {
      if (gA.v1Index !== undefined && gB.v1Index !== undefined) {
        const isSkew = areSolidEdgesSkew(gA.element, gA.v1Index, gA.v2Index, gB.v1Index, gB.v2Index);
        if (isSkew) {
          const model = (window.__hhkg3d && window.__hhkg3d.MODELS_3D) ? window.__hhkg3d.MODELS_3D[gA.element.shape] : null;
          let nameA = 'cạnh 1';
          let nameB = 'cạnh 2';
          if (model && model.vertexNames) {
            nameA = `${model.vertexNames[gA.v1Index]}${model.vertexNames[gA.v2Index]}`;
            nameB = `${model.vertexNames[gB.v1Index]}${model.vertexNames[gB.v2Index]}`;
          }
          showPageToast(`⚠️ Cạnh ${nameA} và ${nameB} chéo nhau trong không gian 3D, không có giao điểm!`);
          statusToolInfo.textContent = `⚠️ Cạnh ${nameA} và ${nameB} là hai đường thẳng chéo nhau trong không gian 3D (không cùng thuộc mặt phẳng nào), nên không thể có giao điểm.`;
          return false;
        }
      }
    }

    let pts = [];
    if (gA.type === 'line' && gB.type === 'line') {
      const pt = findLineLineIntersection(gA.start, gA.end, gB.start, gB.end);
      if (!pt) {
        showPageToast('⚠️ Hai đường thẳng song song hoặc trùng nhau!');
        statusToolInfo.textContent = 'Hai đường thẳng song song hoặc trùng nhau, không có giao điểm duy nhất.';
        return false;
      }
      pts = [pt];
    } else if (gA.type === 'line' && gB.type === 'circle') {
      pts = findLineCircleIntersection(gA.start, gA.end, gB.center, gB.radius);
    } else if (gA.type === 'circle' && gB.type === 'line') {
      pts = findLineCircleIntersection(gB.start, gB.end, gA.center, gA.radius);
    } else if (gA.type === 'circle' && gB.type === 'circle') {
      pts = findCircleCircleIntersection(gA.center, gA.radius, gB.center, gB.radius);
    }

    if (!pts || pts.length === 0) {
      showPageToast('⚠️ Hai hình không có điểm giao nhau!');
      statusToolInfo.textContent = 'Hai hình không có điểm giao nhau. Hãy chọn 2 hình có vị trí cắt nhau.';
      return false;
    }

    // 2. TỰ ĐỘNG KÉO DÀI ĐOẠN THẲNG NẾU GIAO ĐIỂM NẰM NGOÀI
    let extendedA = null;
    let extendedB = null;
    if (pts.length === 1 && gA.type === 'line') {
      extendedA = extendSegmentToPoint(gA, pts[0]);
    }
    if (pts.length === 1 && gB.type === 'line') {
      extendedB = extendSegmentToPoint(gB, pts[0]);
    }

    const parentElements = [];
    if (gA.element) parentElements.push(gA.element);
    if (gB.element && gB.element !== gA.element) parentElements.push(gB.element);
    if (extendedA && !parentElements.includes(extendedA)) parentElements.push(extendedA);
    if (extendedB && !parentElements.includes(extendedB)) parentElements.push(extendedB);

    const createdPoints = [];
    pts.forEach(pt => {
      const newPoint = {
        type: 'geo',
        shape: 'point',
        start: { x: pt.x, y: pt.y },
        end: { x: pt.x, y: pt.y },
        color: state.color || '#184e3a',
        width: Math.max(state.strokeWidth || 3, 3)
      };
      ensureElementId(newPoint);
      if (parentElements.length > 0) {
        parentElements.forEach(ensureElementId);
        linkGroupMulti(parentElements, newPoint);
      }
      pushNewElement(newPoint);
      createdPoints.push(newPoint);
    });

    setSelectedElements(createdPoints);
    finishGeoTask(createdPoints[0]);

    const hasExtension = (extendedA || extendedB);
    const extNote = hasExtension ? ' (và tự động kéo dài đoạn thẳng)' : '';

    if (pts.length === 1) {
      showPageToast(`✨ Đã xác định giao điểm${extNote}!`);
      statusToolInfo.textContent = `✨ Đã xác định giao điểm tại (${Math.round(pts[0].x)}, ${Math.round(pts[0].y)})${extNote} (tự động gắn kết thành 1 nhóm với hình).`;
    } else {
      showPageToast(`✨ Đã xác định ${pts.length} giao điểm cắt nhau!`);
      statusToolInfo.textContent = `✨ Đã xác định ${pts.length} giao điểm cắt nhau (tự động gắn kết thành 1 nhóm với hình).`;
    }
    renderPage();
    return true;
  }

  // Dựng đường vuông góc qua 1 điểm và vuông góc với 1 đường thẳng
  function constructPerpendicular(point, edge, bindingInfo = null, parentEl = null) {
    const parent = parentEl || (edge ? edge.element : null);
    const ptEl = (point && point.element) ? point.element : (point && point.shape === 'point' ? point : null);
    if (parent) ensureElementId(parent);
    if (ptEl) ensureElementId(ptEl);
    const px = (point.x !== undefined) ? point.x : (point.start ? point.start.x : 0);
    const py = (point.y !== undefined) ? point.y : (point.start ? point.start.y : 0);
    const A = edge.start;
    const B = edge.end;
    const vx = B.x - A.x;
    const vy = B.y - A.y;
    const lenV = Math.hypot(vx, vy) || 1;
    const uBase = { x: vx / lenV, y: vy / lenV }; // Vector đơn vị cạnh đáy
    const uNorm = { x: -uBase.y, y: uBase.x };   // Vector pháp tuyến

    // Chiếu điểm P lên đường thẳng chứa cạnh AB tìm chân đường vuông góc H
    const t = (px - A.x) * uBase.x + (py - A.y) * uBase.y;
    const H = { x: A.x + t * uBase.x, y: A.y + t * uBase.y };

    const distPH = Math.hypot(px - H.x, py - H.y);
    let p1, p2;

    if (distPH > 8) {
      const uPerp = { x: (px - H.x) / distPH, y: (py - H.y) / distPH };
      // Đầu mút 1: kéo nhẹ qua chân vuông góc để tạo giao cắt rõ ràng
      p1 = { x: H.x - 20 * uPerp.x, y: H.y - 20 * uPerp.y };
      // Đầu mút 2: kéo dài qua điểm P
      p2 = { x: px + 35 * uPerp.x, y: py + 35 * uPerp.y };
    } else {
      // Nếu điểm P nằm ngay trên đường thẳng
      p1 = { x: px - 90 * uNorm.x, y: py - 90 * uNorm.y };
      p2 = { x: px + 90 * uNorm.x, y: py + 90 * uNorm.y };
    }

    if (!bindingInfo && parent) {
      bindingInfo = {
        type: 'perpendicular',
        parentId: parent.id,
        pointElId: ptEl ? ptEl.id : null,
        edgeId: edge ? edge.edgeId : null,
        v1Index: edge ? edge.v1Index : null,
        v2Index: edge ? edge.v2Index : null,
        pointRef: { x: px, y: py }
      };
    }

    const newGeo = {
      type: 'geo',
      shape: 'perpendicular',
      binding: bindingInfo,
      start: p1,
      end: p2,
      foot: H,
      baseDir: uBase,
      color: state.color,
      width: state.strokeWidth,
      dash: state.dashStyle
    };

    ensureElementId(newGeo);
    const parentsToLink = [parent, ptEl].filter(Boolean);
    if (parentsToLink.length > 0) {
      linkGroupMulti(parentsToLink, newGeo);
    }
    pushNewElement(newGeo);
    finishGeoTask(newGeo);
    statusToolInfo.textContent = '✨ Đã dựng đường vuông góc (tự động gắn kết thành 1 nhóm với hình). Kéo 2 chấm đầu mút để thu hẹp hoặc mở rộng độ dài.';
    return newGeo;
  }

  // Dựng đường song song qua 1 điểm và song song với 1 đường thẳng
  function constructParallel(point, edge, bindingInfo = null, parentEl = null) {
    const parent = parentEl || (edge ? edge.element : null);
    const ptEl = (point && point.element) ? point.element : (point && point.shape === 'point' ? point : null);
    if (parent) ensureElementId(parent);
    if (ptEl) ensureElementId(ptEl);
    const px = (point.x !== undefined) ? point.x : (point.start ? point.start.x : 0);
    const py = (point.y !== undefined) ? point.y : (point.start ? point.start.y : 0);
    const A = edge.start;
    const B = edge.end;
    const vx = B.x - A.x;
    const vy = B.y - A.y;
    const lenV = Math.hypot(vx, vy) || 1;
    const uBase = { x: vx / lenV, y: vy / lenV };

    const t = (px - A.x) * uBase.x + (py - A.y) * uBase.y;
    const H = { x: A.x + t * uBase.x, y: A.y + t * uBase.y };

    const tA = (A.x - H.x) * uBase.x + (A.y - H.y) * uBase.y;
    const tB = (B.x - H.x) * uBase.x + (B.y - H.y) * uBase.y;

    let p1 = { x: px + (tA - 15) * uBase.x, y: py + (tA - 15) * uBase.y };
    let p2 = { x: px + (tB + 15) * uBase.x, y: py + (tB + 15) * uBase.y };

    if (Math.hypot(p2.x - p1.x, p2.y - p1.y) < 50) {
      p1 = { x: px - 80 * uBase.x, y: py - 80 * uBase.y };
      p2 = { x: px + 80 * uBase.x, y: py + 80 * uBase.y };
    }

    if (!bindingInfo && parent) {
      bindingInfo = {
        type: 'parallel',
        parentId: parent.id,
        pointElId: ptEl ? ptEl.id : null,
        edgeId: edge ? edge.edgeId : null,
        v1Index: edge ? edge.v1Index : null,
        v2Index: edge ? edge.v2Index : null,
        pointRef: { x: px, y: py }
      };
    }

    const newGeo = {
      type: 'geo',
      shape: 'parallel',
      binding: bindingInfo,
      start: p1,
      end: p2,
      baseDir: uBase,
      color: state.color,
      width: state.strokeWidth,
      dash: state.dashStyle
    };

    ensureElementId(newGeo);
    const parentsToLink = [parent, ptEl].filter(Boolean);
    if (parentsToLink.length > 0) {
      linkGroupMulti(parentsToLink, newGeo);
    }
    pushNewElement(newGeo);
    finishGeoTask(newGeo);
    statusToolInfo.textContent = '✨ Đã dựng đường song song (tự động gắn kết thành 1 nhóm với hình). Kéo 2 chấm đầu mút để thu hẹp hoặc mở rộng độ dài.';
    return newGeo;
  }

  // Tìm giao điểm của tia (V, dir) với đoạn thẳng (p1, p2)
  function rayIntersectSegment(V, dir, p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const det = dir.x * dy - dir.y * dx;
    if (Math.abs(det) < 1e-6) return null;
    const t = ((p1.x - V.x) * dy - (p1.y - V.y) * dx) / det;
    const s = ((p1.x - V.x) * dir.y - (p1.y - V.y) * dir.x) / det;
    if (t > 1e-2 && s >= -0.05 && s <= 1.05) {
      const clampedS = Math.max(0, Math.min(1, s));
      return {
        point: { x: p1.x + clampedS * dx, y: p1.y + clampedS * dy },
        t: t,
        s: clampedS
      };
    }
    return null;
  }

  // Dựng tia phân giác từ góc tạo bởi 2 cạnh
  function constructBisector(edge1, edge2, bindingInfo = null, parentEl = null) {
    const A1 = edge1.start, B1 = edge1.end;
    const A2 = edge2.start, B2 = edge2.end;

    let V = null;
    let dir1 = null;
    let dir2 = null;
    let oppositeSeg = null;

    // 1. Kiểm tra 2 cạnh có chung đỉnh không (dung sai 14px)
    if (Math.hypot(A1.x - A2.x, A1.y - A2.y) <= 14) {
      V = { x: (A1.x + A2.x) / 2, y: (A1.y + A2.y) / 2 };
      dir1 = { x: B1.x - V.x, y: B1.y - V.y };
      dir2 = { x: B2.x - V.x, y: B2.y - V.y };
      oppositeSeg = { p1: B1, p2: B2 };
    } else if (Math.hypot(A1.x - B2.x, A1.y - B2.y) <= 14) {
      V = { x: (A1.x + B2.x) / 2, y: (A1.y + B2.y) / 2 };
      dir1 = { x: B1.x - V.x, y: B1.y - V.y };
      dir2 = { x: A2.x - V.x, y: A2.y - V.y };
      oppositeSeg = { p1: B1, p2: A2 };
    } else if (Math.hypot(B1.x - A2.x, B1.y - A2.y) <= 14) {
      V = { x: (B1.x + A2.x) / 2, y: (B1.y + A2.y) / 2 };
      dir1 = { x: A1.x - V.x, y: A1.y - V.y };
      dir2 = { x: B2.x - V.x, y: B2.y - V.y };
      oppositeSeg = { p1: A1, p2: B2 };
    } else if (Math.hypot(B1.x - B2.x, B1.y - B2.y) <= 14) {
      V = { x: (B1.x + B2.x) / 2, y: (B1.y + B2.y) / 2 };
      dir1 = { x: A1.x - V.x, y: A1.y - V.y };
      dir2 = { x: A2.x - V.x, y: A2.y - V.y };
      oppositeSeg = { p1: A1, p2: A2 };
    }

    // 2. Nếu không chung đỉnh, tìm giao điểm của 2 đường thẳng chứa 2 cạnh
    if (!V) {
      const d1x = B1.x - A1.x, d1y = B1.y - A1.y;
      const d2x = B2.x - A2.x, d2y = B2.y - A2.y;
      const det = d1x * d2y - d1y * d2x;

      if (Math.abs(det) < 1e-5) {
        statusToolInfo.textContent = 'Hai cạnh song song, không tạo thành góc cắt nhau!';
        state.construction = { point: null, line: null, edges: [] };
        renderPage();
        return null;
      }

      const t = ((A2.x - A1.x) * d2y - (A2.y - A1.y) * d2x) / det;
      V = { x: A1.x + t * d1x, y: A1.y + t * d1y };

      const mid1 = { x: (A1.x + B1.x) / 2, y: (A1.y + B1.y) / 2 };
      const mid2 = { x: (A2.x + B2.x) / 2, y: (A2.y + B2.y) / 2 };
      dir1 = { x: mid1.x - V.x, y: mid1.y - V.y };
      dir2 = { x: mid2.x - V.x, y: mid2.y - V.y };
    }

    const len1 = Math.hypot(dir1.x, dir1.y) || 1;
    const len2 = Math.hypot(dir2.x, dir2.y) || 1;
    const u1 = { x: dir1.x / len1, y: dir1.y / len1 };
    const u2 = { x: dir2.x / len2, y: dir2.y / len2 };

    const sumX = u1.x + u2.x;
    const sumY = u1.y + u2.y;
    const lenS = Math.hypot(sumX, sumY);
    let bisectorDir;

    if (lenS < 1e-4) {
      bisectorDir = { x: -u1.y, y: u1.x };
    } else {
      bisectorDir = { x: sumX / lenS, y: sumY / lenS };
    }

    let pEnd = null;

    // 3. Nếu là 2 cạnh tam giác có chung đỉnh, tính giao điểm chuẩn xác với cạnh đối diện
    if (oppositeSeg) {
      const hit = rayIntersectSegment(V, bisectorDir, oppositeSeg.p1, oppositeSeg.p2);
      if (hit && hit.t > 15) {
        pEnd = hit.point;
      }
    }

    // 4. Nếu không cắt cạnh đối diện (hoặc 2 cạnh rời nhau), lấy độ dài hợp lý
    if (!pEnd) {
      const L1 = Math.hypot(B1.x - A1.x, B1.y - A1.y);
      const L2 = Math.hypot(B2.x - A2.x, B2.y - A2.y);
      const L = Math.max(90, Math.min(280, (L1 + L2) / 2));
      pEnd = { x: V.x + L * bisectorDir.x, y: V.y + L * bisectorDir.y };
    }

    if (!bindingInfo && edge1 && edge2) {
      const el1 = edge1.element;
      const el2 = edge2.element;
      if (el1 && el2 && el1 === el2 && el1.points && el1.points.length === 3) {
        ensureElementId(el1);
        let commonVertex = -1;
        for (let i = 0; i < 3; i++) {
          if (Math.hypot(el1.points[i].x - V.x, el1.points[i].y - V.y) < 14) {
            commonVertex = i;
            break;
          }
        }
        if (commonVertex !== -1) {
          bindingInfo = { type: 'bisector_triangle', parentId: el1.id, vertexIndex: commonVertex };
          parentEl = el1;
        }
      } else if (el1 && el2) {
        ensureElementId(el1);
        ensureElementId(el2);
        bindingInfo = {
          type: 'bisector_two_edges',
          parent1Id: el1.id,
          parent2Id: el2.id,
          edge1Info: {
            v1Index: edge1.v1Index,
            v2Index: edge1.v2Index,
            edgeId: edge1.edgeId,
            isLine: edge1.isLine
          },
          edge2Info: {
            v1Index: edge2.v1Index,
            v2Index: edge2.v2Index,
            edgeId: edge2.edgeId,
            isLine: edge2.isLine
          }
        };
        parentEl = [el1, el2];
      }
    }

    const newGeo = {
      type: 'geo',
      shape: 'bisector',
      binding: bindingInfo,
      start: V,
      end: pEnd,
      arm1Angle: Math.atan2(u1.y, u1.x),
      arm2Angle: Math.atan2(u2.y, u2.x),
      bisectorAngle: Math.atan2(bisectorDir.y, bisectorDir.x),
      color: state.color,
      width: state.strokeWidth,
      dash: state.dashStyle
    };

    ensureElementId(newGeo);
    if (parentEl) {
      if (Array.isArray(parentEl)) linkGroupMulti(parentEl, newGeo);
      else linkGroup(parentEl, newGeo);
    }
    pushNewElement(newGeo);
    state.bisectorHoverEdge = null;
    state.bisectorHoverVertex = null;
    finishGeoTask(newGeo);
    statusToolInfo.textContent = '✨ Đã dựng tia phân giác (tự động gắn kết thành 1 nhóm với hình). Kéo đầu mút để thu hẹp hoặc mở rộng độ dài.';
    return newGeo;
  }

  // Dựng tia phân giác từ 1 đỉnh của tam giác (chỉ cần 1 click vào đỉnh)
  function constructBisectorFromTriangleVertex(triangleEl, vertexIndex) {
    const pts = triangleEl.points;
    if (!pts || pts.length !== 3) return null;
    ensureElementId(triangleEl);
    const V = pts[vertexIndex];
    const nextPt = pts[(vertexIndex + 1) % 3];
    const prevPt = pts[(vertexIndex + 2) % 3];

    const edge1 = { element: triangleEl, start: V, end: nextPt, edgeId: `edge_${vertexIndex}` };
    const edge2 = { element: triangleEl, start: V, end: prevPt, edgeId: `edge_${(vertexIndex + 2) % 3}` };

    const bindingInfo = {
      type: 'bisector_triangle',
      parentId: triangleEl.id,
      vertexIndex: vertexIndex
    };

    return constructBisector(edge1, edge2, bindingInfo, triangleEl);
  }

  // Dựng tia phân giác từ 1 đối tượng góc theo số đo (Angle object)
  function constructBisectorFromAngle(angleEl) {
    ensureElementId(angleEl);
    const V = { x: angleEl.start.x, y: angleEl.start.y };
    const armLength = Math.max(80, Math.hypot(angleEl.end.x - angleEl.start.x, angleEl.end.y - angleEl.start.y));
    const baseAngle = Math.atan2(angleEl.end.y - angleEl.start.y, angleEl.end.x - angleEl.start.x);
    const rad = ((angleEl.angleDeg || 60) * Math.PI) / 180;
    const secondAngle = baseAngle - rad;
    const bisectorAngle = (baseAngle + secondAngle) / 2;
    const pEnd = {
      x: V.x + armLength * Math.cos(bisectorAngle),
      y: V.y + armLength * Math.sin(bisectorAngle)
    };

    const newGeo = {
      type: 'geo',
      shape: 'bisector',
      binding: {
        type: 'bisector_angle',
        parentId: angleEl.id
      },
      start: V,
      end: pEnd,
      arm1Angle: secondAngle,
      arm2Angle: baseAngle,
      bisectorAngle: bisectorAngle,
      color: state.color,
      width: state.strokeWidth,
      dash: state.dashStyle
    };

    ensureElementId(newGeo);
    linkGroup(angleEl, newGeo);
    pushNewElement(newGeo);
    state.bisectorHoverEdge = null;
    state.bisectorHoverVertex = null;
    finishGeoTask(newGeo);
    statusToolInfo.textContent = '✨ Đã dựng tia phân giác cho góc đã chọn (tự động gắn kết thành 1 nhóm với hình).';
    return newGeo;
  }

  // Dựng góc từ 1 đường đã chọn và 1 điểm (đỉnh góc): vẽ đường còn lại theo số đo cho trước
  function constructAngleFromLineAndPoint(edge, point) {
    if (!edge || !point) return null;
    const A = edge.start;
    const B = edge.end;
    let V = { x: point.x, y: point.y };

    // Hút vào đầu mút gần nhất nếu khoảng cách <= 24px
    const distA = Math.hypot(V.x - A.x, V.y - A.y);
    const distB = Math.hypot(V.x - B.x, V.y - B.y);
    let baseDir = 0;
    if (distA <= 24) {
      V = { x: A.x, y: A.y };
      // Đỉnh tại A: tia cơ sở hướng từ A -> B
      baseDir = Math.atan2(B.y - A.y, B.x - A.x);
    } else if (distB <= 24) {
      V = { x: B.x, y: B.y };
      // Đỉnh tại B: tia cơ sở hướng từ B -> A
      baseDir = Math.atan2(A.y - B.y, A.x - B.x);
    } else {
      // Đỉnh nằm ở giữa hoặc ngoài: lấy hướng theo vectơ AB
      baseDir = Math.atan2(B.y - A.y, B.x - A.x);
    }

    const armLen = Math.max(90, Math.hypot(B.x - A.x, B.y - A.y));
    const deg = parseFloat(angleDegreesInput ? angleDegreesInput.value : 60) || 60;
    const rad = (deg * Math.PI) / 180;

    // Hướng mở 1: baseDir - rad (direction: -1)
    const secondAngle1 = baseDir - rad;
    const secondPt1 = {
      x: V.x + armLen * Math.cos(secondAngle1),
      y: V.y + armLen * Math.sin(secondAngle1)
    };

    // Hướng mở 2: baseDir + rad (direction: 1)
    const secondAngle2 = baseDir + rad;
    const secondPt2 = {
      x: V.x + armLen * Math.cos(secondAngle2),
      y: V.y + armLen * Math.sin(secondAngle2)
    };

    state.pendingOptions = {
      type: 'angle',
      edge: edge,
      point: point,
      V: V,
      baseDir: baseDir,
      armLen: armLen,
      deg: deg,
      options: [
        {
          id: 1,
          name: `Góc ${deg}° (Hướng 1)`,
          direction: -1,
          start: { x: V.x, y: V.y },
          end: { x: V.x + armLen * Math.cos(baseDir), y: V.y + armLen * Math.sin(baseDir) },
          secondPoint: secondPt1,
          secondAngle: secondAngle1,
          angleDeg: deg
        },
        {
          id: 2,
          name: `Góc ${deg}° (Hướng 2)`,
          direction: 1,
          start: { x: V.x, y: V.y },
          end: { x: V.x + armLen * Math.cos(baseDir), y: V.y + armLen * Math.sin(baseDir) },
          secondPoint: secondPt2,
          secondAngle: secondAngle2,
          angleDeg: deg
        }
      ]
    };

    state.hoveredOptionIndex = -1;
    state.construction = { point: null, circle: null, line: null, edges: [] };
    state.pendingConstruction = null;
    state.activeTool = 'select';
    // Hiện ô số đo góc trên toolbar và đồng bộ giá trị
    if (angleInputContainer) {
      angleInputContainer.style.display = 'inline-flex';
    }
    if (angleDegreesInput) {
      angleDegreesInput.value = deg;
    }

    // Hiển thị khung nhập số đo góc nổi trực tiếp trên canvas tại đỉnh góc
    showFloatingAngleBox(V, baseDir, deg);

    statusToolInfo.textContent = `✨ Số đo góc: ${deg}°. Nhập số góc vào ô rồi bấm chọn 1 trong 2 đường nét đứt để vẽ.`;
    renderPage();
    return null;
  }

  // Hoàn tất dựng góc khi người dùng bấm chọn 1 trong 2 hướng mở gợi ý
  function finalizeChosenAngle(opt) {
    if (!state.pendingOptions || state.pendingOptions.type !== 'angle') return null;
    const { edge, point, V, baseDir, armLen, deg } = state.pendingOptions;
    const ptEl = (point && point.element) ? point.element : (point && point.shape === 'point' ? point : null);
    if (edge.element) ensureElementId(edge.element);
    if (ptEl) ensureElementId(ptEl);

    const newAngle = {
      type: 'geo',
      shape: 'angle',
      start: { x: V.x, y: V.y },
      baseDir: baseDir,
      end: { x: V.x + armLen * Math.cos(baseDir), y: V.y + armLen * Math.sin(baseDir) },
      secondPoint: opt.secondPoint,
      armLength: armLen,
      angleDeg: deg,
      direction: opt.direction,
      color: state.color,
      width: state.strokeWidth,
      dash: state.dashStyle,
      onlySecondArm: true,
      parentEdge: edge,
      binding: edge.element ? {
        type: 'angle_from_line',
        parentId: edge.element.id,
        pointElId: ptEl ? ptEl.id : null,
        edgeId: edge.edgeId,
        v1Index: edge.v1Index,
        v2Index: edge.v2Index,
        baseDir: baseDir,
        angleDeg: deg,
        direction: opt.direction
      } : null
    };

    ensureElementId(newAngle);
    const parentsToLink = [edge.element, ptEl].filter(Boolean);
    if (parentsToLink.length > 0) {
      linkGroupMulti(parentsToLink, newAngle);
    }

    pushNewElement(newAngle);
    state.pendingOptions = null;
    state.hoveredOptionIndex = -1;
    finishGeoTask(newAngle);

    // Tự động chuyển sang công cụ Chọn với con trỏ Chọn
    state.activeTool = 'select';
    toolButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-tool') === 'select'));
    setCanvasCursor(SHARP_ARROW_CURSOR);
    updateContextualToolbar('select');

    // Tự động chọn góc vừa tạo để người dùng thấy quầng sáng và điều khiển
    setSelectedElements([newAngle]);

    // Hiện ô số đo độ để người dùng có thể điều chỉnh
    if (angleInputContainer) {
      angleInputContainer.style.display = 'inline-flex';
    }
    if (angleDegreesInput) {
      angleDegreesInput.value = deg;
      setTimeout(() => {
        angleDegreesInput.focus();
        angleDegreesInput.select();
      }, 50);
    }
    statusToolInfo.textContent = `✨ Đã vẽ đường theo hướng góc ${deg}°. Nhập số đo trên ô [ ∡ ${deg} ° ] để điều chỉnh.`;
    renderPage();
    return newAngle;
  }

  // Chọn 1 trong 2 tùy chọn nét đứt (Tiếp tuyến hoặc Chọn góc)
  function applyChosenOption(index) {
    if (!state.pendingOptions || !state.pendingOptions.options || !state.pendingOptions.options[index]) return null;
    const opt = state.pendingOptions.options[index];
    if (state.pendingOptions.type === 'tangent') {
      return finalizeChosenTangent(opt);
    } else if (state.pendingOptions.type === 'angle') {
      return finalizeChosenAngle(opt);
    }
    return null;
  }

  // Trích xuất tọa độ điểm từ một phần tử
  function getPointFromElement(el) {
    if (!el || el.type !== 'geo') return null;
    if (el.shape === 'point') return { x: el.start.x, y: el.start.y, element: el };
    return null;
  }

  // Trích xuất đường thẳng hoặc cạnh từ một phần tử
  function getLineOrEdgeFromElement(el, nearPoint = null) {
    if (!el || el.type !== 'geo') return null;
    if (el.shape === 'line' || el.shape === 'perpendicular' || el.shape === 'parallel' || el.shape === 'tangent' || el.shape === 'bisector') {
      return { start: { x: el.start.x, y: el.start.y }, end: { x: el.end.x, y: el.end.y }, element: el, isLine: true };
    }
    if (el.points && el.points.length >= 2) {
      if (el.points.length === 2) {
        return { start: el.points[0], end: el.points[1], element: el, v1Index: 0, v2Index: 1 };
      }
      if (nearPoint) {
        let best = null, minDist = Infinity;
        const n = el.points.length;
        for (let i = 0; i < n; i++) {
          const p1 = el.points[i];
          const p2 = el.points[(i + 1) % n];
          const d = distToSegment(nearPoint.x, nearPoint.y, p1.x, p1.y, p2.x, p2.y);
          if (d < minDist) {
            minDist = d;
            best = { start: p1, end: p2, element: el, v1Index: i, v2Index: (i + 1) % n };
          }
        }
        return best;
      }
      return { start: el.points[0], end: el.points[1], element: el, v1Index: 0, v2Index: 1 };
    }
    return null;
  }

  // Trích xuất đường tròn từ một phần tử
  function getCircleFromElement(el) {
    if (!el || el.type !== 'geo') return null;
    if (el.shape === 'circle') {
      const r = el.radius || Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
      return { center: { x: el.start.x, y: el.start.y }, radius: r, element: el };
    }
    if (el.shape === 'two-tangents' || el.shape === 'inscribed-triangle') {
      const r = el.radius || Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
      return { center: { x: el.start.x, y: el.start.y }, radius: r, element: el };
    }
    return null;
  }

  // Tự động dựng hình ngay nếu người dùng đã bấm chọn trước 2 (hoặc 1) đối tượng tương ứng
  function tryConstructFromSelection(geoShape, selectedList) {
    if (geoShape === 'angle') {
      let edge = state.selectedEdge;
      let vertex = state.selectedVertex;

      if (!edge && selectedList && selectedList.length > 0) {
        for (const el of selectedList) {
          const l = getLineOrEdgeFromElement(el, vertex);
          if (l) { edge = l; break; }
        }
      }
      if (!vertex && selectedList && selectedList.length > 0) {
        for (const el of selectedList) {
          const pt = getPointFromElement(el);
          if (pt) { vertex = pt; break; }
        }
      }

      if (edge && vertex) {
        constructAngleFromLineAndPoint(edge, vertex);
        state.selectedEdge = null;
        state.selectedVertex = null;
        return true;
      }

      if (edge && !vertex) {
        state.construction = { point: null, circle: null, line: edge, edges: [] };
        setCanvasCursor(SHARP_ARROW_CURSOR);
        statusToolInfo.textContent = 'Chọn góc: Đã nhận cạnh. Hãy nhấp chọn 1 đỉnh (hoặc đầu mút) để vẽ góc theo số đo.';
        renderPage();
        return true;
      }

      if (vertex && !edge) {
        state.construction = { point: vertex, circle: null, line: null, edges: [] };
        setCanvasCursor(SHARP_ARROW_CURSOR);
        statusToolInfo.textContent = 'Chọn góc: Đã nhận đỉnh. Hãy nhấp chọn 1 đường thẳng (hoặc cạnh) để vẽ góc theo số đo.';
        renderPage();
        return true;
      }
    }

    if (!selectedList || selectedList.length === 0) return false;

    // Trường hợp 1: Người dùng đã chọn 2 đối tượng
    if (selectedList.length === 2) {
      const elA = selectedList[0];
      const elB = selectedList[1];

      if (geoShape === 'perpendicular' || geoShape === 'parallel') {
        const ptA = getPointFromElement(elA);
        const ptB = getPointFromElement(elB);

        let point = ptA || ptB;
        let line = null;

        if (ptA) {
          line = getLineOrEdgeFromElement(elB, ptA);
        } else if (ptB) {
          line = getLineOrEdgeFromElement(elA, ptB);
        } else {
          // Nếu cả 2 đều là đường thẳng, lấy điểm đầu của đường 1 và đường 2 làm chuẩn
          const lA = getLineOrEdgeFromElement(elA);
          const lB = getLineOrEdgeFromElement(elB);
          if (lA && lB) {
            point = lA.start;
            line = lB;
          }
        }

        if (point && line) {
          if (geoShape === 'perpendicular') {
            constructPerpendicular(point, line);
            statusToolInfo.textContent = '✨ Đã dựng đường vuông góc từ 2 đối tượng đã chọn (tự động gắn kết thành 1 nhóm).';
          } else {
            constructParallel(point, line);
            statusToolInfo.textContent = '✨ Đã dựng đường song song từ 2 đối tượng đã chọn (tự động gắn kết thành 1 nhóm).';
          }
          return true;
        }
      } else if (geoShape === 'bisector') {
        const lineA = getLineOrEdgeFromElement(elA);
        const lineB = getLineOrEdgeFromElement(elB);
        if (lineA && lineB) {
          constructBisector(lineA, lineB);
          statusToolInfo.textContent = '✨ Đã dựng đường phân giác từ 2 cạnh đã chọn (tự động gắn kết thành 1 nhóm).';
          return true;
        }
      } else if (geoShape === 'tangent' || geoShape === 'two-tangents') {
        const ptA = getPointFromElement(elA), circB = getCircleFromElement(elB);
        const ptB = getPointFromElement(elB), circA = getCircleFromElement(elA);

        const point = ptA || ptB;
        const circle = ptA ? circB : (ptB ? circA : null);

        if (point && circle) {
          if (geoShape === 'tangent') {
            constructTangent(point, circle);
            statusToolInfo.textContent = '✨ Đã dựng tiếp tuyến từ điểm và đường tròn đã chọn (tự động gắn kết thành 1 nhóm).';
          } else {
            constructTwoTangents(point, circle);
            statusToolInfo.textContent = '✨ Đã dựng 2 tiếp tuyến cắt nhau từ điểm và đường tròn đã chọn (tự động gắn kết thành 1 nhóm).';
          }
          return true;
        }
      } else if (geoShape === 'line') {
        const ptA = getPointFromElement(elA);
        const ptB = getPointFromElement(elB);
        if (ptA && ptB) {
          const newGeo = {
            type: 'geo',
            shape: 'line',
            start: { x: ptA.x, y: ptA.y },
            end: { x: ptB.x, y: ptB.y },
            color: state.color,
            width: state.strokeWidth,
            dash: state.dashStyle
          };
          ensureElementId(newGeo);
          linkGroupMulti([elA, elB], newGeo);
          pushNewElement(newGeo);
          finishGeoTask(newGeo);
          statusToolInfo.textContent = 'Đã nối đoạn thẳng giữa 2 điểm đã chọn (tự động gắn kết thành 1 nhóm).';
          return true;
        }
      } else if (geoShape === 'midpoint') {
        const ptA = getPointFromElement(elA) || (elA.shape === 'point' ? elA.start : null) || elA.start;
        const ptB = getPointFromElement(elB) || (elB.shape === 'point' ? elB.start : null) || elB.start;
        if (ptA && ptB) {
          ensureElementId(elA);
          ensureElementId(elB);
          let bindingInfo = null;
          let parentEl = [elA, elB];
          if (elA.shape === 'point' && elB.shape === 'point') {
            bindingInfo = { type: 'midpoint_points', ptAId: elA.id, ptBId: elB.id };
          }
          triggerMidpointWithHighlight(ptA, ptB, bindingInfo, parentEl);
          return true;
        }
      } else if (geoShape === 'angle') {
        const ptA = getPointFromElement(elA);
        const ptB = getPointFromElement(elB);
        let point = ptA || ptB;
        let line = null;
        if (ptA) {
          line = getLineOrEdgeFromElement(elB, ptA);
        } else if (ptB) {
          line = getLineOrEdgeFromElement(elA, ptB);
        }
        if (point && line) {
          constructAngleFromLineAndPoint(line, point);
          return true;
        }
      } else if (geoShape === 'intersection') {
        return constructIntersectionFromTwoObjects(elA, elB);
      }
    }

    // Trường hợp 2: Người dùng đã chọn 1 đối tượng, nạp sẵn vào construction
    if (selectedList.length === 1) {
      const el = selectedList[0];
      const pt = getPointFromElement(el);
      const line = getLineOrEdgeFromElement(el);
      const circ = getCircleFromElement(el);

      if (geoShape === 'intersection') {
        const geoObj = extractGeoGeometry(el);
        if (geoObj) {
          state.construction = { point: null, circle: null, line: null, edges: [], firstObject: geoObj };
          if (geoObj.type === 'circle') state.construction.circle = geoObj;
          if (geoObj.type === 'line') state.construction.line = geoObj;
          const name = geoObj.type === 'circle' ? 'đường tròn' : 'đường thẳng';
          statusToolInfo.textContent = `Giao điểm: Đã nhận ${name} 1. Hãy nhấp chọn hình thứ 2 để xác định giao điểm.`;
          showPageToast(`✓ Đã nhận ${name} 1. Chọn tiếp hình 2!`);
          renderPage();
          return true;
        }
      }

      if (geoShape === 'midpoint') {
        if (el.shape === 'line' || el.shape === 'perpendicular' || el.shape === 'parallel') {
          ensureElementId(el);
          triggerMidpointWithHighlight(el.start, el.end, { type: 'midpoint_segment', parentId: el.id }, el);
          return true;
        }
        if (el.points && el.points.length === 3) {
          ensureElementId(el);
          triggerMidpointWithHighlight(el.points[0], el.points[1], {
            type: 'midpoint_triangle_edge',
            parentId: el.id,
            v1Index: 0,
            v2Index: 1
          }, el);
          return true;
        }
        if (pt) {
          state.construction = { point: pt, circle: null, line: null, edges: [] };
          statusToolInfo.textContent = 'Trung điểm: Đã nhận 1 điểm. Hãy bấm chọn tiếp điểm thứ 2 trên bảng vẽ.';
          renderPage();
          return true;
        }
      }

      if (geoShape === 'perpendicular' || geoShape === 'parallel') {
        if (pt) {
          state.construction = { point: pt, circle: null, line: null, edges: [] };
          statusToolInfo.textContent = `${geoShape === 'perpendicular' ? 'Vuông góc' : 'Song song'}: Đã nhận 1 điểm. Hãy bấm chọn tiếp 1 đường thẳng trên bảng vẽ.`;
          renderPage();
          return true;
        } else if (line) {
          state.construction = { point: null, circle: null, line: line, edges: [] };
          statusToolInfo.textContent = `${geoShape === 'perpendicular' ? 'Vuông góc' : 'Song song'}: Đã nhận 1 đường thẳng. Hãy bấm chọn tiếp 1 điểm trên bảng vẽ.`;
          renderPage();
          return true;
        }
      } else if (geoShape === 'bisector') {
        if (el.shape === 'angle') {
          constructBisectorFromAngle(el);
          return true;
        }
        if (line) {
          state.construction = { point: null, circle: null, line: null, edges: [line] };
          statusToolInfo.textContent = 'Phân giác: Đã nhận cạnh thứ nhất. Hãy bấm chọn tiếp cạnh thứ 2 (hoặc bấm đỉnh góc) trên bảng vẽ.';
          renderPage();
          return true;
        }
      } else if (geoShape === 'tangent' || geoShape === 'two-tangents') {
        if (pt) {
          state.construction = { point: pt, circle: null, line: null, edges: [] };
          statusToolInfo.textContent = `${geoShape === 'tangent' ? 'Tiếp tuyến' : '2 Tiếp tuyến'}: Đã nhận 1 điểm. Hãy bấm chọn tiếp 1 đường tròn trên bảng vẽ.`;
          renderPage();
          return true;
        } else if (circ) {
          state.construction = { point: null, circle: circ, line: null, edges: [] };
          statusToolInfo.textContent = `${geoShape === 'tangent' ? 'Tiếp tuyến' : '2 Tiếp tuyến'}: Đã nhận 1 đường tròn. Hãy bấm chọn tiếp 1 điểm trên bảng vẽ.`;
          renderPage();
          return true;
        }
      } else if (geoShape === 'angle') {
        if (line) {
          state.construction = { point: null, circle: null, line: line, edges: [] };
          statusToolInfo.textContent = 'Chọn góc: Đã nhận 1 đường. Hãy bấm chọn tiếp 1 điểm (đỉnh góc) trên bảng vẽ.';
          renderPage();
          return true;
        } else if (pt) {
          state.construction = { point: pt, circle: null, line: null, edges: [] };
          statusToolInfo.textContent = 'Chọn góc: Đã nhận 1 điểm. Hãy bấm chọn tiếp 1 đường trên bảng vẽ.';
          renderPage();
          return true;
        }
      }
    }

    return false;
  }

  // Xử lý chọn đối tượng và tự động thực hiện tác vụ dựng hình khi đang ở chế độ Chọn (Select Tool)
  function handleConstructionSelectionClick(point, e) {
    if (!state.pendingConstruction) return false;
    const task = state.pendingConstruction;

    // 1. Tìm Điểm: điểm rời, hoặc đỉnh tam giác/đa giác, hoặc đầu mút handle
    let hitPoint = null;
    const directPointEl = findElementAt(point.x, point.y);
    if (directPointEl && directPointEl.type === 'geo' && directPointEl.shape === 'point') {
      hitPoint = { x: directPointEl.start.x, y: directPointEl.start.y, element: directPointEl };
    }
    if (!hitPoint) {
      const v = findPointAt(point.x, point.y, 26);
      if (v) {
        hitPoint = { x: v.x, y: v.y, element: v.element, vertexIndex: (v.vIndex !== undefined ? v.vIndex : v.vertexIndex) };
      }
    }
    if (!hitPoint) {
      const h = findHandleAt(point.x, point.y, 28);
      if (h && h.handle) {
        hitPoint = { x: h.handle.x, y: h.handle.y, element: h.element };
      }
    }

    // 2. Tìm Cạnh / Đoạn thẳng
    const hitEdge = findEdgeAt(point.x, point.y, 26);

    // 3. Tìm Đường tròn
    const hitCircle = findCircleAt(point.x, point.y, 26);

    // ==========================================================
    // TÁC VỤ 1 & 2: VUÔNG GÓC & SONG SONG (1 điểm + 1 đường)
    // ==========================================================
    if (task === 'perpendicular' || task === 'parallel') {
      const taskName = task === 'perpendicular' ? 'vuông góc' : 'song song';

      // Trường hợp 1: Chưa chọn đối tượng nào
      if (!state.construction.point && !state.construction.line) {
        if (hitEdge && (!hitPoint || hitPoint.element !== hitEdge.element)) {
          state.construction.line = hitEdge;
          statusToolInfo.textContent = `✓ Đã chọn Đường thẳng. Tiếp tục chọn 1 điểm để thực hiện tác vụ ${taskName}.`;
          showPageToast(`✓ Đã nhận đường thẳng. Chọn tiếp điểm!`);
          renderPage();
          return true;
        } else if (hitPoint) {
          state.construction.point = hitPoint;
          statusToolInfo.textContent = `✓ Đã chọn Điểm. Tiếp tục chọn 1 đường thẳng (hoặc cạnh) để thực hiện tác vụ ${taskName}.`;
          showPageToast(`✓ Đã nhận điểm. Chọn tiếp đường thẳng!`);
          renderPage();
          return true;
        } else {
          // Người dùng bấm ra khoảng trống: lấy ngay điểm tại tọa độ click
          state.construction.point = { x: point.x, y: point.y };
          statusToolInfo.textContent = `✓ Đã chọn Điểm tại vị trí bấm. Tiếp tục chọn 1 đường thẳng để thực hiện tác vụ ${taskName}.`;
          showPageToast(`✓ Đã nhận điểm. Chọn tiếp đường thẳng!`);
          renderPage();
          return true;
        }
      }

      // Trường hợp 2: Đã có đường thẳng, tiếp tục chọn điểm -> Thực hiện tác vụ
      if (state.construction.line && !state.construction.point) {
        const pt = hitPoint || { x: point.x, y: point.y };
        if (task === 'perpendicular') {
          constructPerpendicular(pt, state.construction.line);
        } else {
          constructParallel(pt, state.construction.line);
        }
        state.pendingConstruction = null;
        return true;
      }

      // Trường hợp 3: Đã có điểm, tiếp tục chọn đường thẳng -> Thực hiện tác vụ
      if (state.construction.point && !state.construction.line) {
        if (hitEdge) {
          if (task === 'perpendicular') {
            constructPerpendicular(state.construction.point, hitEdge);
          } else {
            constructParallel(state.construction.point, hitEdge);
          }
          state.pendingConstruction = null;
          return true;
        } else if (hitPoint) {
          // Bấm sang điểm khác: đổi điểm đã chọn
          state.construction.point = hitPoint;
          statusToolInfo.textContent = `✓ Đã đổi sang Điểm mới. Tiếp tục chọn 1 đường thẳng để thực hiện tác vụ ${taskName}.`;
          renderPage();
          return true;
        }
      }
      return false;
    }

    // ==========================================================
    // TÁC VỤ 3: PHÂN GIÁC (1 đỉnh tam giác hoặc 2 cạnh)
    // ==========================================================
    if (task === 'bisector') {
      // 1. Tiện ích siêu nhanh: Nhấp trực tiếp vào 1 đỉnh tam giác -> Dựng ngay tia phân giác!
      if (hitPoint && hitPoint.element && hitPoint.element.points && hitPoint.element.points.length === 3) {
        let vIdx = hitPoint.vertexIndex;
        if (vIdx === undefined) {
          vIdx = hitPoint.element.points.findIndex(p => Math.hypot(p.x - hitPoint.x, p.y - hitPoint.y) < 10);
        }
        if (vIdx !== -1 && vIdx !== undefined) {
          constructBisectorFromTriangleVertex(hitPoint.element, vIdx);
          state.pendingConstruction = null;
          return true;
        }
      }

      // 2. Chọn lần lượt 2 cạnh
      if (hitEdge) {
        if (!state.construction.edges || state.construction.edges.length === 0) {
          state.construction.edges = [hitEdge];
          statusToolInfo.textContent = '✓ Đã chọn Cạnh thứ nhất. Tiếp tục chọn Cạnh thứ 2 để thực hiện tác vụ phân giác.';
          showPageToast('✓ Đã chọn Cạnh 1. Chọn tiếp Cạnh 2!');
          renderPage();
          return true;
        } else {
          const edge1 = state.construction.edges[0];
          if (edge1.element === hitEdge.element && edge1.edgeId === hitEdge.edgeId) {
            statusToolInfo.textContent = 'Bạn vừa bấm lại cạnh cũ. Hãy chọn một cạnh khác để tạo thành góc!';
            return true;
          }
          // Đã có đủ 2 cạnh -> Thực hiện tác vụ!
          constructBisector(edge1, hitEdge);
          state.pendingConstruction = null;
          return true;
        }
      }
      return false;
    }

    // ==========================================================
    // TÁC VỤ 4 & 5: TIẾP TUYẾN & 2 TIẾP TUYẾN (1 điểm + 1 đường tròn)
    // ==========================================================
    if (task === 'tangent' || task === 'two-tangents') {
      const isTwo = task === 'two-tangents';
      const taskName = isTwo ? '2 tiếp tuyến' : 'tiếp tuyến';

      // Trường hợp 1: Chưa chọn gì
      if (!state.construction.point && !state.construction.circle) {
        if (hitCircle) {
          state.construction.circle = hitCircle;
          statusToolInfo.textContent = `✓ Đã chọn Đường tròn. Tiếp tục chọn 1 điểm (${isTwo ? 'ngoài đường tròn' : 'trên hoặc ngoài đường tròn'}) để thực hiện tác vụ ${taskName}.`;
          showPageToast('✓ Đã nhận đường tròn. Chọn tiếp điểm!');
          renderPage();
          return true;
        } else if (hitPoint) {
          state.construction.point = hitPoint;
          statusToolInfo.textContent = `✓ Đã chọn Điểm. Tiếp tục chọn Đường tròn để thực hiện tác vụ ${taskName}.`;
          showPageToast('✓ Đã nhận điểm. Chọn tiếp đường tròn!');
          renderPage();
          return true;
        } else {
          // Bấm khoảng trống: lấy điểm tại vị trí bấm
          state.construction.point = { x: point.x, y: point.y };
          statusToolInfo.textContent = `✓ Đã chọn Điểm tại vị trí bấm. Tiếp tục chọn Đường tròn để thực hiện tác vụ ${taskName}.`;
          showPageToast('✓ Đã nhận điểm. Chọn tiếp đường tròn!');
          renderPage();
          return true;
        }
      }

      // Trường hợp 2: Đã có đường tròn, tiếp tục chọn điểm -> Thực hiện tác vụ
      if (state.construction.circle && !state.construction.point) {
        const pt = hitPoint || { x: point.x, y: point.y };
        if (isTwo) {
          constructTwoTangents(pt, state.construction.circle);
        } else {
          constructTangent(pt, state.construction.circle);
        }
        state.pendingConstruction = null;
        return true;
      }

      // Trường hợp 3: Đã có điểm, tiếp tục chọn đường tròn -> Thực hiện tác vụ
      if (state.construction.point && !state.construction.circle) {
        if (hitCircle) {
          if (isTwo) {
            constructTwoTangents(state.construction.point, hitCircle);
          } else {
            constructTangent(state.construction.point, hitCircle);
          }
          state.pendingConstruction = null;
          return true;
        } else if (hitPoint) {
          state.construction.point = hitPoint;
          statusToolInfo.textContent = `✓ Đã đổi sang Điểm mới. Tiếp tục chọn Đường tròn để thực hiện tác vụ ${taskName}.`;
          renderPage();
          return true;
        }
      }
      return false;
    }

    // ==========================================================
    // TÁC VỤ 6: CHỌN GÓC (1 đường + 1 điểm đỉnh)
    // ==========================================================
    if (task === 'angle') {
      // Trường hợp 1: Chưa chọn gì
      if (!state.construction.point && !state.construction.line) {
        if (hitEdge && (!hitPoint || hitPoint.element !== hitEdge.element)) {
          state.construction.line = hitEdge;
          statusToolInfo.textContent = '✓ Đã chọn Đường thẳng. Tiếp tục chọn 1 Điểm đỉnh để dựng góc theo số đo.';
          showPageToast('✓ Đã chọn Đường. Chọn tiếp Điểm đỉnh!');
          renderPage();
          return true;
        } else if (hitPoint) {
          state.construction.point = hitPoint;
          statusToolInfo.textContent = '✓ Đã chọn Điểm đỉnh. Tiếp tục chọn 1 Đường thẳng để dựng góc theo số đo.';
          showPageToast('✓ Đã chọn Điểm đỉnh. Chọn tiếp Đường thẳng!');
          renderPage();
          return true;
        } else {
          state.construction.point = { x: point.x, y: point.y };
          statusToolInfo.textContent = '✓ Đã chọn Điểm đỉnh tại vị trí bấm. Tiếp tục chọn 1 Đường thẳng để dựng góc.';
          showPageToast('✓ Đã chọn Điểm đỉnh. Chọn tiếp Đường thẳng!');
          renderPage();
          return true;
        }
      }

      // Trường hợp 2: Đã có đường, tiếp tục chọn điểm đỉnh -> Thực hiện tác vụ
      if (state.construction.line && !state.construction.point) {
        const pt = hitPoint || { x: point.x, y: point.y };
        constructAngleFromLineAndPoint(state.construction.line, pt);
        state.pendingConstruction = null;
        return true;
      }

      // Trường hợp 3: Đã có điểm đỉnh, tiếp tục chọn đường -> Thực hiện tác vụ
      if (state.construction.point && !state.construction.line) {
        if (hitEdge) {
          constructAngleFromLineAndPoint(hitEdge, state.construction.point);
          state.pendingConstruction = null;
          return true;
        } else if (hitPoint) {
          state.construction.point = hitPoint;
          statusToolInfo.textContent = '✓ Đã đổi sang Điểm đỉnh mới. Tiếp tục chọn 1 Đường thẳng để dựng góc.';
          renderPage();
          return true;
        }
      }
      return false;
    }

    // ==========================================================
    // TÁC VỤ 7: GIAO ĐIỂM (2 đường / đoạn thẳng hoặc đường tròn)
    // ==========================================================
    if (task === 'intersection') {
      const hitCircle = findCircleAt(point.x, point.y, 26);
      const hitEdge = findEdgeAt(point.x, point.y, 26);
      const hitObj = hitCircle || hitEdge;

      if (!hitObj) {
        statusToolInfo.textContent = 'Giao điểm: Hãy nhấp vào đường thẳng, cạnh hoặc đường tròn để chọn hình!';
        return false;
      }

      // Trường hợp 1: Chưa chọn hình nào
      if (!state.construction.firstObject) {
        state.construction.firstObject = hitObj;
        if (hitObj.center) {
          state.construction.circle = hitObj;
          state.construction.line = null;
        } else {
          state.construction.line = hitObj;
          state.construction.circle = null;
        }
        const objName = hitObj.center ? 'Đường tròn' : 'Đường thẳng';
        statusToolInfo.textContent = `✓ Đã chọn ${objName} 1. Tiếp tục nhấp chọn hình thứ hai để tìm giao điểm!`;
        showPageToast(`✓ Đã nhận ${objName} 1. Chọn tiếp hình 2!`);
        renderPage();
        return true;
      }

      // Trường hợp 2: Đã chọn hình 1, người dùng bấm hình 2
      const firstObj = state.construction.firstObject;
      const sameElement = (firstObj.element === hitObj.element);
      const sameEdge = (firstObj.edgeId && hitObj.edgeId && firstObj.edgeId === hitObj.edgeId);
      if (sameElement && (sameEdge || (!firstObj.edgeId && !hitObj.edgeId))) {
        statusToolInfo.textContent = 'Bạn vừa bấm lại hình cũ. Hãy chọn một hình khác để tìm giao điểm!';
        return true;
      }

      // Đã có 2 hình khác nhau -> Thực hiện tác vụ!
      constructIntersectionFromTwoObjects(firstObj, hitObj);
      state.pendingConstruction = null;
      state.construction = { point: null, circle: null, line: null, edges: [], firstObject: null };
      return true;
    }

    return false;
  }

  // Xử lý thao tác nhấp chuột/bút khi đang ở chế độ dựng hình (Vuông góc, Song song, Phân giác)
  function handleConstructionClick(point) {
    if (state.activeGeo === 'perpendicular' || state.activeGeo === 'parallel') {
      const mode = state.activeGeo;
      const modeName = mode === 'perpendicular' ? 'vuông góc' : 'song song';
      const edge = findEdgeAt(point.x, point.y);
      const vertex = findPointAt(point.x, point.y);

      // Nếu chưa chọn gì
      if (!state.construction.line && !state.construction.point) {
        if (edge) {
          state.construction.line = edge;
          statusToolInfo.textContent = `Đã chọn đường thẳng. Hãy bấm chọn 1 điểm để vẽ đường ${modeName}.`;
        } else {
          state.construction.point = vertex || { x: point.x, y: point.y };
          statusToolInfo.textContent = `Đã chọn điểm. Hãy bấm chọn 1 đường thẳng (hoặc cạnh) để vẽ đường ${modeName}.`;
        }
        renderPage();
        return;
      }

      // Đã có đường thẳng, chờ chọn điểm
      if (state.construction.line && !state.construction.point) {
        const pt = vertex || { x: point.x, y: point.y };
        if (mode === 'perpendicular') {
          constructPerpendicular(pt, state.construction.line);
        } else {
          constructParallel(pt, state.construction.line);
        }
        return;
      }

      // Đã có điểm, chờ chọn đường thẳng
      if (state.construction.point && !state.construction.line) {
        if (edge) {
          if (mode === 'perpendicular') {
            constructPerpendicular(state.construction.point, edge);
          } else {
            constructParallel(state.construction.point, edge);
          }
        } else {
          // Bấm điểm khác: cập nhật lại điểm
          state.construction.point = vertex || { x: point.x, y: point.y };
          statusToolInfo.textContent = `Đã đổi điểm. Hãy bấm chọn 1 đường thẳng (hoặc cạnh) để vẽ đường ${modeName}.`;
          renderPage();
        }
        return;
      }
    } else if (state.activeGeo === 'bisector') {
      // 1. Tiện ích siêu nhanh: Nhấp trực tiếp vào đỉnh góc tam giác
      const vertexHit = findPointAt(point.x, point.y, 24);
      if (vertexHit && vertexHit.element && vertexHit.element.points && vertexHit.element.points.length === 3) {
        const pts = vertexHit.element.points;
        let vIdx = -1;
        for (let i = 0; i < 3; i++) {
          if (Math.hypot(pts[i].x - vertexHit.x, pts[i].y - vertexHit.y) < 6) {
            vIdx = i;
            break;
          }
        }
        if (vIdx !== -1) {
          constructBisectorFromTriangleVertex(vertexHit.element, vIdx);
          return;
        }
      }

      // 2. Nhấp chọn cạnh (hoặc đoạn thẳng)
      const edge = findEdgeAt(point.x, point.y, 28);
      if (!edge) {
        statusToolInfo.textContent = 'Hãy nhấp vào đỉnh tam giác hoặc chọn 2 cạnh để vẽ tia phân giác.';
        return;
      }

      if (state.construction.edges.length === 0) {
        state.construction.edges.push(edge);
        statusToolInfo.textContent = 'Đã chọn cạnh thứ nhất. Hãy nhấp tiếp cạnh thứ hai (hoặc nhấp đỉnh góc) để vẽ phân giác.';
        renderPage();
      } else {
        const edge1 = state.construction.edges[0];
        const edge2 = edge;
        if (edge1.element === edge2.element && edge1.edgeId === edge2.edgeId) {
          statusToolInfo.textContent = 'Bạn vừa bấm lại cạnh cũ. Hãy chọn một cạnh khác để tạo thành góc!';
          return;
        }
        constructBisector(edge1, edge2);
      }
    } else if (state.activeGeo === 'tangent' || state.activeGeo === 'two-tangents') {
      const isTwo = state.activeGeo === 'two-tangents';
      const toolName = isTwo ? '2 tiếp tuyến' : 'tiếp tuyến';
      const circle = findCircleAt(point.x, point.y);
      const vertex = findPointAt(point.x, point.y);

      // Nếu chưa chọn gì
      if (!state.construction.circle && !state.construction.point) {
        if (circle) {
          state.construction.circle = circle;
          statusToolInfo.textContent = `Đã chọn đường tròn. Hãy bấm chọn 1 điểm (${isTwo ? 'ngoài đường tròn' : 'trên hoặc ngoài đường tròn'}) để vẽ ${toolName}.`;
        } else {
          state.construction.point = vertex || { x: point.x, y: point.y };
          statusToolInfo.textContent = `Đã chọn điểm. Hãy bấm chọn đường tròn để vẽ ${toolName}.`;
        }
        renderPage();
        return;
      }

      // Đã có đường tròn, chờ chọn điểm
      if (state.construction.circle && !state.construction.point) {
        const pt = vertex || { x: point.x, y: point.y };
        if (isTwo) {
          constructTwoTangents(pt, state.construction.circle);
        } else {
          constructTangent(pt, state.construction.circle);
        }
        return;
      }

      // Đã có điểm, chờ chọn đường tròn
      if (state.construction.point && !state.construction.circle) {
        if (circle) {
          if (isTwo) {
            constructTwoTangents(state.construction.point, circle);
          } else {
            constructTangent(state.construction.point, circle);
          }
        } else {
          state.construction.point = vertex || { x: point.x, y: point.y };
          statusToolInfo.textContent = `Đã đổi điểm. Hãy bấm chọn đường tròn để vẽ ${toolName}.`;
          renderPage();
        }
        return;
      }
    } else if (state.activeGeo === 'angle') {
      const edge = findEdgeAt(point.x, point.y, 24);
      const vertex = findPointAt(point.x, point.y, 22);

      // Nếu chưa chọn gì
      if (!state.construction.line && !state.construction.point) {
        if (edge) {
          state.construction.line = edge;
          statusToolInfo.textContent = 'Đã chọn đường. Hãy bấm chọn 1 điểm (đỉnh góc) để vẽ đường còn lại theo số đo.';
        } else {
          state.construction.point = vertex || { x: point.x, y: point.y };
          statusToolInfo.textContent = 'Đã chọn điểm. Hãy bấm chọn 1 đường để vẽ đường còn lại theo số đo.';
        }
        renderPage();
        return;
      }

      // Đã có đường, chờ chọn điểm
      if (state.construction.line && !state.construction.point) {
        const pt = vertex || { x: point.x, y: point.y };
        constructAngleFromLineAndPoint(state.construction.line, pt);
        return;
      }

      // Đã có điểm, chờ chọn đường
      if (state.construction.point && !state.construction.line) {
        if (edge) {
          constructAngleFromLineAndPoint(edge, state.construction.point);
        } else {
          state.construction.point = vertex || { x: point.x, y: point.y };
          statusToolInfo.textContent = 'Đã đổi điểm. Hãy bấm chọn 1 đường để vẽ đường còn lại theo số đo.';
          renderPage();
        }
        return;
      }
    } else if (state.activeGeo === 'intersection') {
      const circle = findCircleAt(point.x, point.y, 26);
      const edge = findEdgeAt(point.x, point.y, 26);
      const hitObj = circle || edge;
      if (!hitObj) {
        statusToolInfo.textContent = 'Giao điểm: Hãy nhấp vào đường thẳng, cạnh hoặc đường tròn để chọn hình!';
        return;
      }
      if (!state.construction.firstObject) {
        state.construction.firstObject = hitObj;
        if (hitObj.center) {
          state.construction.circle = hitObj;
          state.construction.line = null;
        } else {
          state.construction.line = hitObj;
          state.construction.circle = null;
        }
        const name = hitObj.center ? 'đường tròn' : 'đường thẳng';
        statusToolInfo.textContent = `✓ Đã chọn ${name} 1. Hãy nhấp tiếp hình thứ 2 để tìm giao điểm.`;
        showPageToast(`✓ Đã nhận ${name} 1. Chọn tiếp hình 2!`);
        renderPage();
        return;
      }
      const firstObj = state.construction.firstObject;
      const sameElement = (firstObj.element === hitObj.element);
      const sameEdge = (firstObj.edgeId && hitObj.edgeId && firstObj.edgeId === hitObj.edgeId);
      if (sameElement && (sameEdge || (!firstObj.edgeId && !hitObj.edgeId))) {
        statusToolInfo.textContent = 'Bạn vừa bấm lại hình cũ. Hãy chọn một hình khác để tìm giao điểm!';
        return;
      }
      constructIntersectionFromTwoObjects(firstObj, hitObj);
      state.construction = { point: null, circle: null, line: null, edges: [], firstObject: null };
      return;
    } else if (state.activeGeo === 'point') {
      const circSnap = checkCircleSnap(point);
      const edgeSnap = findEdgeAt(point.x, point.y, 24);

      const distToCirc = circSnap ? Math.hypot(point.x - circSnap.x, point.y - circSnap.y) : Infinity;
      let distToEdge = Infinity;
      let edgeProj = null;

      if (edgeSnap) {
        const A = edgeSnap.start;
        const B = edgeSnap.end;
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        const lenSq = dx * dx + dy * dy;
        const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((point.x - A.x) * dx + (point.y - A.y) * dy) / lenSq));
        edgeProj = { x: A.x + t * dx, y: A.y + t * dy, t: t };
        distToEdge = Math.hypot(point.x - edgeProj.x, point.y - edgeProj.y);
      }

      let ptX = point.x;
      let ptY = point.y;
      let bindingInfo = null;
      let parentEl = null;
      let msg = 'Đã tạo điểm độc lập.';

      if (circSnap && distToCirc < distToEdge && distToCirc <= 24) {
        ptX = circSnap.x;
        ptY = circSnap.y;
        parentEl = circSnap.circle;
        ensureElementId(parentEl);
        bindingInfo = {
          type: 'point_on_circle',
          parentId: parentEl.id,
          angle: circSnap.angle
        };
        msg = '✨ Đã tạo điểm trên đường tròn (tự động gắn liền và thống nhất với đường tròn).';
      } else if (edgeSnap && distToEdge <= 24) {
        ptX = edgeProj.x;
        ptY = edgeProj.y;
        parentEl = edgeSnap.element;
        ensureElementId(parentEl);
        bindingInfo = {
          type: 'point_on_line',
          parentId: parentEl.id,
          edgeId: edgeSnap.edgeId,
          v1Index: edgeSnap.v1Index,
          v2Index: edgeSnap.v2Index,
          t: edgeProj.t
        };
        msg = '✨ Đã tạo điểm trên đường thẳng (tự động gắn liền và thống nhất với đường thẳng).';
      }

      const newPoint = {
        type: 'geo',
        shape: 'point',
        start: { x: ptX, y: ptY },
        end: { x: ptX, y: ptY },
        binding: bindingInfo,
        color: state.color,
        width: state.strokeWidth
      };

      ensureElementId(newPoint);
      if (parentEl) {
        linkGroup(parentEl, newPoint);
      }
      pushNewElement(newPoint);
      state.hoverSnapPoint = null;
      finishGeoTask(newPoint);
      statusToolInfo.textContent = msg;
      return;
    } else if (state.activeGeo === 'midpoint') {
      // 1. Tìm điểm hoặc đỉnh mà người dùng vừa nhấp vào (bán kính nhận diện 28px)
      const hitHandle = findHandleAt(point.x, point.y, 28);
      const hitVertex = findPointAt(point.x, point.y, 25);
      const hitPointEl = findElementAt(point.x, point.y);

      let clickedPt = null;
      let clickedEl = null;

      if (hitHandle && hitHandle.element && hitHandle.element.type === 'geo') {
        clickedPt = { x: hitHandle.handle.x, y: hitHandle.handle.y };
        clickedEl = hitHandle.element;
      } else if (hitVertex) {
        clickedPt = { x: hitVertex.x, y: hitVertex.y };
        clickedEl = hitVertex.element || hitVertex;
      } else if (hitPointEl && hitPointEl.type === 'geo' && hitPointEl.shape === 'point') {
        clickedPt = { x: hitPointEl.start.x, y: hitPointEl.start.y };
        clickedEl = hitPointEl;
      } else {
        clickedPt = { x: point.x, y: point.y };
      }

      if (!state.construction.point) {
        // ĐÃ CHỌN ĐIỂM 1
        state.construction.point = clickedPt;
        state.construction.point1El = clickedEl;
        setCanvasCursor(SHARP_ARROW_CURSOR);
        statusToolInfo.textContent = 'Trung điểm: Đã chọn điểm 1. Hãy nhấp tiếp điểm thứ 2 (hoặc điểm Cmd điểm) để hiển thị trung điểm.';
        renderPage();
        return;
      } else {
        // ĐÃ CHỌN ĐIỂM 2
        const pt1 = state.construction.point;
        const pt2 = clickedPt;
        const el1 = state.construction.point1El;
        const el2 = clickedEl;

        // Tránh nhấp trùng điểm 1
        if (Math.hypot(pt2.x - pt1.x, pt2.y - pt1.y) < 6) {
          return;
        }

        state.construction.point = null;
        state.construction.point1El = null;

        let bindingInfo = null;
        let parentEl = null;

        if (el1 && el2 && el1 === el2 && el1.points && el1.points.length === 3) {
          ensureElementId(el1);
          let idx1 = -1, idx2 = -1;
          for (let i = 0; i < 3; i++) {
            if (Math.hypot(el1.points[i].x - pt1.x, el1.points[i].y - pt1.y) < 14) idx1 = i;
            if (Math.hypot(el1.points[i].x - pt2.x, el1.points[i].y - pt2.y) < 14) idx2 = i;
          }
          if (idx1 !== -1 && idx2 !== -1) {
            bindingInfo = { type: 'midpoint_triangle_edge', parentId: el1.id, v1Index: idx1, v2Index: idx2 };
            parentEl = el1;
          }
        } else if (el1 && el2 && el1.shape === 'point' && el2.shape === 'point') {
          ensureElementId(el1);
          ensureElementId(el2);
          bindingInfo = { type: 'midpoint_points', ptAId: el1.id, ptBId: el2.id };
          parentEl = [el1, el2];
        } else if (el1) {
          parentEl = el1;
        } else if (el2) {
          parentEl = el2;
        }

        triggerMidpointWithHighlight(pt1, pt2, bindingInfo, parentEl);
        statusToolInfo.textContent = '✨ Đã hiển thị trung điểm giữa 2 điểm đã chọn.';
        return;
      }
    }
  }

  // Vẽ các điểm và cạnh đang được chọn trong quá trình dựng hình
  function drawConstructionHighlights() {
    if (!state.construction) return;

    ctx.save();

    // 1. Vẽ điểm đã chọn
    if (state.construction.point) {
      const p = state.construction.point;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#16a34a';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#184e3a';
      ctx.fill();

      drawSharpArrowIndicator(ctx, p.x, p.y, '✓ Đã chọn: Điểm', true);
    }

    // 2. Vẽ đường thẳng đã chọn
    if (state.construction.line) {
      const l = state.construction.line;
      ctx.beginPath();
      ctx.moveTo(l.start.x, l.start.y);
      ctx.lineTo(l.end.x, l.end.y);
      ctx.lineWidth = 8;
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.45)';
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(l.start.x, l.start.y);
      ctx.lineTo(l.end.x, l.end.y);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#184e3a';
      ctx.stroke();

      const midX = (l.start.x + l.end.x) / 2;
      const midY = (l.start.y + l.end.y) / 2;
      const lineLabel = (state.pendingConstruction === 'intersection' || state.activeGeo === 'intersection') ? '✓ Đã nhận: Đường 1' : '✓ Đã chọn: Đường thẳng';
      drawSharpArrowIndicator(ctx, midX, midY, lineLabel, true);
    }

    // 3. Vẽ đường tròn đã chọn (cho Tiếp tuyến hoặc Giao điểm)
    if (state.construction.circle) {
      const c = state.construction.circle;
      ctx.beginPath();
      ctx.arc(c.center.x, c.center.y, c.radius, 0, Math.PI * 2);
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.45)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(c.center.x, c.center.y, c.radius, 0, Math.PI * 2);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#184e3a';
      ctx.stroke();

      const circLabel = (state.pendingConstruction === 'intersection' || state.activeGeo === 'intersection') ? '✓ Đã nhận: Đường tròn 1' : '✓ Đã chọn: Đường tròn';
      drawSharpArrowIndicator(ctx, c.center.x, c.center.y - c.radius, circLabel, true);
    }

    // 4. Vẽ các cạnh đã chọn và hiệu ứng xem trước cho phân giác
    if ((state.activeTool === 'geo' || state.activeTool === 'select') && (state.activeGeo === 'bisector' || state.pendingConstruction === 'bisector')) {
      // 4.1. Xem trước khi rê chuột vào đỉnh tam giác
      if (state.bisectorHoverVertex && state.bisectorHoverVertex.element) {
        const hv = state.bisectorHoverVertex;
        const pts = hv.element.points;
        const V = pts[hv.vertexIndex];
        const nextP = pts[(hv.vertexIndex + 1) % 3];
        const prevP = pts[(hv.vertexIndex + 2) % 3];

        ctx.save();
        ctx.beginPath();
        ctx.arc(V.x, V.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#16a34a';
        ctx.stroke();

        drawSharpArrowIndicator(ctx, V.x, V.y, 'Đỉnh góc (Bấm để vẽ tia phân giác)', true);

        // Tính tia phân giác xem trước
        const u1 = { x: nextP.x - V.x, y: nextP.y - V.y };
        const u2 = { x: prevP.x - V.x, y: prevP.y - V.y };
        const l1 = Math.hypot(u1.x, u1.y) || 1, l2 = Math.hypot(u2.x, u2.y) || 1;
        const n1 = { x: u1.x / l1, y: u1.y / l1 }, n2 = { x: u2.x / l2, y: u2.y / l2 };
        const sx = n1.x + n2.x, sy = n1.y + n2.y;
        const sl = Math.hypot(sx, sy) || 1;
        const bDir = { x: sx / sl, y: sy / sl };
        const hit = rayIntersectSegment(V, bDir, nextP, prevP);
        const targetP = hit ? hit.point : { x: V.x + 130 * bDir.x, y: V.y + 130 * bDir.y };

        ctx.beginPath();
        ctx.moveTo(V.x, V.y);
        ctx.lineTo(targetP.x, targetP.y);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(22, 163, 74, 0.85)';
        ctx.setLineDash([7, 4]);
        ctx.stroke();

        // 2 cung góc xem trước
        const bAng = Math.atan2(targetP.y - V.y, targetP.x - V.x);
        const a1 = Math.atan2(n1.y, n1.x);
        const a2 = Math.atan2(n2.y, n2.x);
        drawAngleArc(ctx, V, 24, a1, bAng);
        drawAngleArc(ctx, V, 24, bAng, a2);
        ctx.restore();
      }

      // 4.2. Cạnh 1 đã chọn
      if (state.construction.edges && state.construction.edges.length > 0) {
        const e1 = state.construction.edges[0];
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(e1.start.x, e1.start.y);
        ctx.lineTo(e1.end.x, e1.end.y);
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.45)';
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(e1.start.x, e1.start.y);
        ctx.lineTo(e1.end.x, e1.end.y);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#184e3a';
        ctx.stroke();

        const mid1X = (e1.start.x + e1.end.x) / 2;
        const mid1Y = (e1.start.y + e1.end.y) / 2;
        drawSharpArrowIndicator(ctx, mid1X, mid1Y, '✓ Cạnh 1: Đã chọn', true);
        ctx.restore();

        // 4.3. Rê chuột vào Cạnh 2: hiển thị quầng sáng và xem trước tia phân giác
        if (state.bisectorHoverEdge) {
          const e2 = state.bisectorHoverEdge;
          const isSame = (e2.element === e1.element && e2.edgeId === e1.edgeId);
          if (!isSame) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(e2.start.x, e2.start.y);
            ctx.lineTo(e2.end.x, e2.end.y);
            ctx.lineWidth = 8;
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.35)';
            ctx.lineCap = 'round';
            ctx.stroke();

            const mid2X = (e2.start.x + e2.end.x) / 2;
            const mid2Y = (e2.start.y + e2.end.y) / 2;
            drawSharpArrowIndicator(ctx, mid2X, mid2Y, '🎯 Cạnh 2 (Bấm tạo phân giác)', false);
            ctx.restore();
          }
        }
      } else if (state.bisectorHoverEdge && !state.bisectorHoverVertex) {
        // Chưa chọn cạnh 1, hover vào cạnh bất kỳ
        const he = state.bisectorHoverEdge;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(he.start.x, he.start.y);
        ctx.lineTo(he.end.x, he.end.y);
        ctx.lineWidth = 8;
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.35)';
        ctx.lineCap = 'round';
        ctx.stroke();

        const midX = (he.start.x + he.end.x) / 2;
        const midY = (he.start.y + he.end.y) / 2;
        drawSharpArrowIndicator(ctx, midX, midY, '🎯 Cạnh 1 (Bấm để chọn)', false);
        ctx.restore();
      }
    }


    // 5. Hiển thị đoạn thẳng đậm hơn giữa 2 điểm để người dùng dễ hình dung
    if (state.midpointHighlightSegment) {
      const seg = state.midpointHighlightSegment;
      ctx.save();
      // Quầng sáng mềm bên ngoài để thu hút mắt nhìn
      ctx.beginPath();
      ctx.moveTo(seg.p1.x, seg.p1.y);
      ctx.lineTo(seg.p2.x, seg.p2.y);
      ctx.lineWidth = 11;
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.38)';
      ctx.lineCap = 'round';
      ctx.stroke();

      // Đoạn thẳng đậm nét màu xanh đậm chuẩn mực
      ctx.beginPath();
      ctx.moveTo(seg.p1.x, seg.p1.y);
      ctx.lineTo(seg.p2.x, seg.p2.y);
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = '#184e3a';
      ctx.lineCap = 'round';
      ctx.stroke();

      // 2 chấm đầu mút nổi bật
      ctx.beginPath();
      ctx.arc(seg.p1.x, seg.p1.y, 6, 0, Math.PI * 2);
      ctx.arc(seg.p2.x, seg.p2.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#184e3a';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.restore();
    } else if (state.activeTool === 'select' && state.selectedElements && state.selectedElements.length === 2) {
      // Khi chọn 2 điểm trong công cụ Chọn: hiển thị đường nối đậm nét đứt nhẹ nhàng
      const elA = state.selectedElements[0];
      const elB = state.selectedElements[1];
      const pA = (elA.type === 'geo' && elA.shape === 'point') ? elA.start : getPointFromElement(elA);
      const pB = (elB.type === 'geo' && elB.shape === 'point') ? elB.start : getPointFromElement(elB);
      if (pA && pB) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = 'rgba(24, 78, 58, 0.55)';
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  // Vẽ 2 tùy chọn nét đứt (Tiếp tuyến hoặc Chọn góc) để người dùng bấm chọn
  function drawPendingOptions(c) {
    if (!state.pendingOptions || !state.pendingOptions.options) return;
    const po = state.pendingOptions;
    const targetCtx = c || ctx;
    if (!targetCtx) return;

    targetCtx.save();

    if (po.type === 'tangent') {
      const opts = po.options;
      for (let i = 0; i < opts.length; i++) {
        const opt = opts[i];
        const isHovered = (state.hoveredOptionIndex === i);

        // 1. Quầng sáng phát quang (glow) khi rê chuột vào gần
        if (isHovered) {
          targetCtx.save();
          targetCtx.beginPath();
          targetCtx.moveTo(opt.start.x, opt.start.y);
          targetCtx.lineTo(opt.end.x, opt.end.y);
          targetCtx.lineWidth = 14;
          targetCtx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
          targetCtx.lineCap = 'round';
          targetCtx.stroke();
          targetCtx.restore();
        }

        // 2. Đường tiếp tuyến nét đứt chính
        targetCtx.save();
        targetCtx.beginPath();
        targetCtx.moveTo(opt.start.x, opt.start.y);
        targetCtx.lineTo(opt.end.x, opt.end.y);
        targetCtx.setLineDash([8, 6]);
        targetCtx.lineWidth = isHovered ? 3.5 : 2.5;
        targetCtx.strokeStyle = isHovered ? '#059669' : '#10b981';
        targetCtx.lineCap = 'round';
        targetCtx.stroke();
        targetCtx.restore();

        // 3. Vòng tròn tiếp điểm T
        if (opt.tangentPoint) {
          targetCtx.save();
          targetCtx.beginPath();
          targetCtx.arc(opt.tangentPoint.x, opt.tangentPoint.y, isHovered ? 6 : 4.5, 0, Math.PI * 2);
          targetCtx.fillStyle = isHovered ? '#059669' : '#10b981';
          targetCtx.fill();
          targetCtx.lineWidth = 2;
          targetCtx.strokeStyle = '#ffffff';
          targetCtx.stroke();
          targetCtx.restore();
        }

        // 4. Nhãn chỉ báo (Badge)
        const midX = (opt.start.x + opt.end.x) / 2;
        const midY = (opt.start.y + opt.end.y) / 2;
        const dx = opt.end.x - opt.start.x;
        const dy = opt.end.y - opt.start.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const sign = (i === 0) ? 1 : -1;
        const badgeX = midX + sign * 24 * nx;
        const badgeY = midY + sign * 24 * ny;

        const labelText = `🎯 Tiếp tuyến ${i + 1} (Bấm chọn)`;
        drawSharpArrowIndicator(targetCtx, badgeX, badgeY, labelText, isHovered);
      }
    } else if (po.type === 'angle') {
      const opts = po.options;
      const V = po.V;
      const armLen = po.armLen || 90;
      const baseDir = po.baseDir || 0;

      // 1. Làm nổi bật cạnh cơ sở làm mốc
      targetCtx.save();
      targetCtx.beginPath();
      targetCtx.moveTo(V.x, V.y);
      targetCtx.lineTo(V.x + armLen * Math.cos(baseDir), V.y + armLen * Math.sin(baseDir));
      targetCtx.lineWidth = 4;
      targetCtx.strokeStyle = 'rgba(24, 78, 58, 0.4)';
      targetCtx.stroke();
      targetCtx.restore();

      for (let i = 0; i < opts.length; i++) {
        const opt = opts[i];
        const isHovered = (state.hoveredOptionIndex === i);
        const secondPt = opt.secondPoint;

        // 2. Quầng sáng phát quang khi rê chuột
        if (isHovered) {
          targetCtx.save();
          targetCtx.beginPath();
          targetCtx.moveTo(V.x, V.y);
          targetCtx.lineTo(secondPt.x, secondPt.y);
          targetCtx.lineWidth = 14;
          targetCtx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
          targetCtx.lineCap = 'round';
          targetCtx.stroke();
          targetCtx.restore();
        }

        // 3. Tia góc nét đứt
        targetCtx.save();
        targetCtx.beginPath();
        targetCtx.moveTo(V.x, V.y);
        targetCtx.lineTo(secondPt.x, secondPt.y);
        targetCtx.setLineDash([8, 6]);
        targetCtx.lineWidth = isHovered ? 3.5 : 2.5;
        targetCtx.strokeStyle = isHovered ? '#059669' : '#10b981';
        targetCtx.lineCap = 'round';
        targetCtx.stroke();
        targetCtx.restore();

        // 4. Cung góc nhỏ xem trước ở đỉnh V
        targetCtx.save();
        targetCtx.beginPath();
        const arcR = 36;
        const anticlockwise = (opt.direction === -1);
        targetCtx.arc(V.x, V.y, arcR, baseDir, opt.secondAngle, anticlockwise);
        targetCtx.setLineDash([4, 3]);
        targetCtx.lineWidth = 2;
        targetCtx.strokeStyle = isHovered ? '#059669' : '#10b981';
        targetCtx.stroke();
        targetCtx.restore();

        // 5. Nhãn chỉ báo (Badge) ở trung điểm tia
        const midX = (V.x + secondPt.x) / 2;
        const midY = (V.y + secondPt.y) / 2;
        const labelText = `🎯 Hướng ${i + 1}: ${opt.angleDeg}° (Bấm chọn)`;
        drawSharpArrowIndicator(targetCtx, midX, midY, labelText, isHovered);
      }
    }

    targetCtx.restore();
  }

  // Đặt con trỏ chuột đồng bộ cho tất cả các trang
  function setCanvasCursor(cursorStyle) {
    if (document.body && document.body.classList) {
      if (state.activeTool === 'select') {
        document.body.classList.add('select-mode');
      } else {
        document.body.classList.remove('select-mode');
      }
    }
    document.querySelectorAll('canvas.main-canvas, #main-canvas').forEach(c => {
      c.style.cursor = cursorStyle;
    });
  }

  // 5. Xử lý sự kiện bút vẽ Pointer Events
  function handlePointerDown(e) {
    e.preventDefault();
    const targetCanvas = (e && (e.currentTarget || (e.target && e.target.closest('canvas')))) || getCanvasForPage(state.currentPage) || canvas;
    const pageNum = parseInt((targetCanvas && targetCanvas.dataset.page) || state.currentPage, 10);
    if (!isNaN(pageNum) && pageNum !== state.currentPage) {
      state.currentPage = pageNum;
      updatePageTabsActive(pageNum, false);
      updateUndoState();
      updateScrollBanner();
    }
    state.activeCanvas = targetCanvas;
    ctx = targetCanvas.getContext('2d');
    try {
      targetCanvas.setPointerCapture(e.pointerId);
    } catch (err) {}

    const point = getCanvasCoordinates(e);

    // Cập nhật trạng thái lực nhấn
    // Nếu người dùng đang nhấp vào khung nhập số đo góc nổi trên canvas
    if (e.target && e.target.closest && e.target.closest('.floating-angle-box')) {
      return;
    }

    // Nếu có 2 tùy chọn nét đứt (Tiếp tuyến hoặc Chọn góc) đang chờ người dùng bấm chọn
    if (state.pendingOptions && state.pendingOptions.options) {
      let chosenIdx = -1;
      let minDist = Infinity;
      const opts = state.pendingOptions.options;
      for (let i = 0; i < opts.length; i++) {
        const opt = opts[i];
        const p1 = opt.start;
        const p2 = (state.pendingOptions.type === 'tangent') ? opt.end : opt.secondPoint;
        if (p1 && p2) {
          const d = distToSegment(point.x, point.y, p1.x, p1.y, p2.x, p2.y);
          if (d < minDist) {
            minDist = d;
            if (d <= 32) chosenIdx = i;
          }
        }
      }
      if (chosenIdx !== -1) {
        applyChosenOption(chosenIdx);
        return;
      } else {
        statusToolInfo.textContent = '✨ Vui lòng bấm chuột chọn 1 trong 2 đường nét đứt gợi ý (hoặc nhấn phím Escape để hủy).';
        return;
      }
    }

    // Xử lý công cụ Chọn đối tượng (hỗ trợ chọn cạnh, giữ Cmd chọn đỉnh, kéo handle, di chuyển nhóm)
    if (state.activeTool === 'select') {
      // Nếu có tác vụ dựng hình đang chờ (Bước 3 & Bước 4 theo yêu cầu)
      if (state.pendingConstruction) {
        const handled = handleConstructionSelectionClick(point, e);
        if (handled) return;
      }

      const isMultiKey = e.metaKey || e.ctrlKey || e.shiftKey;

      if (isMultiKey) {
        // NGƯỜI DÙNG GIỮ CMD / CTRL: CHỌN ĐỈNH HOẶC CHỌN CẠNH HOẶC CHỌN THÊM ĐỐI TƯỢNG
        // 1. Kiểm tra bấm trúng điểm hình học rời
        const hitPoint = findElementAt(point.x, point.y);
        if (hitPoint && hitPoint.type === 'geo' && hitPoint.shape === 'point') {
          state.selectedVertex = { x: hitPoint.start.x, y: hitPoint.start.y, element: hitPoint, name: 'Điểm' };
          toggleElementSelection(hitPoint);
          state.isDrawing = false;
          if (state.selectedEdge) {
            statusToolInfo.textContent = '🎯 Đã chọn cạnh và đỉnh. Bấm nút [Chọn góc] để vẽ góc theo số đo.';
          } else {
            statusToolInfo.textContent = '🎯 Đã chọn đỉnh. Bấm nút [Chọn góc] để vẽ đường còn lại theo số đo (hoặc giữ Cmd chọn cạnh).';
          }
          renderPage();
          return;
        }

        // 2. Kiểm tra bấm trúng đỉnh (handle) của tam giác/hình/đầu mút đoạn thẳng
        const hitHandle = findHandleAt(point.x, point.y, 30);
        if (hitHandle && hitHandle.element && hitHandle.element.type === 'geo') {
          state.selectedVertex = {
            x: hitHandle.handle.x,
            y: hitHandle.handle.y,
            element: hitHandle.element,
            handleId: hitHandle.handle.id,
            name: hitHandle.handle.name
          };
          state.isDrawing = false;
          state.activeHandle = null;
          if (!isElementSelected(hitHandle.element)) {
            state.selectedElements.push(hitHandle.element);
            state.selectedElement = hitHandle.element;
          }
          if (state.selectedEdge) {
            statusToolInfo.textContent = `🎯 Đã chọn cạnh và đỉnh (${hitHandle.handle.name || 'Đỉnh'}). Bấm nút [Chọn góc] để vẽ góc theo số đo.`;
          } else {
            statusToolInfo.textContent = `🎯 Đã chọn đỉnh (${hitHandle.handle.name || 'Đỉnh'}). Bấm nút [Chọn góc] để vẽ đường còn lại theo số đo (hoặc giữ Cmd chọn cạnh).`;
          }
          renderPage();
          return;
        }

        // 3. Kiểm tra bấm trúng cạnh (edge) của hình hoặc đoạn thẳng
        const hitEdge = findEdgeAt(point.x, point.y, 28);
        if (hitEdge && hitEdge.element) {
          state.selectedEdge = hitEdge;
          state.isDrawing = false;
          if (!isElementSelected(hitEdge.element)) {
            state.selectedElements.push(hitEdge.element);
            state.selectedElement = hitEdge.element;
          }
          if (state.selectedVertex) {
            statusToolInfo.textContent = '🎯 Đã chọn cạnh và đỉnh. Bấm nút [Chọn góc] để vẽ góc theo số đo.';
          } else {
            statusToolInfo.textContent = '🎯 Đã chọn cạnh. Giữ Cmd bấm chọn đỉnh rồi bấm nút [Chọn góc] để vẽ góc theo số đo.';
          }
          renderPage();
          return;
        }

        // 4. Nếu không trúng đỉnh/cạnh cụ thể mà trúng thân hình
        const el = findElementAt(point.x, point.y);
        if (el) {
          toggleElementSelection(el);
          state.isDrawing = false;
          renderPage();
          return;
        }
      } else {
        // BẤM BÌNH THƯỜNG (KHÔNG GIỮ CMD / CTRL)
        // Luôn dọn sạch lựa chọn cạnh/đỉnh vẽ góc để không để lại vệt sáng rác khi di chuyển hoặc xoay hình
        state.selectedEdge = null;
        state.selectedVertex = null;

        // 1. Kiểm tra trúng điểm hình học rời
        const hitPoint = findElementAt(point.x, point.y);
        if (hitPoint && hitPoint.type === 'geo' && hitPoint.shape === 'point') {
          setSelectedElements([hitPoint]);
          state.isDrawing = true;
          state.dragLast = { x: point.x, y: point.y };
          state.totalMoved = { dx: 0, dy: 0 };
          state.pendingSingleSelect = hitPoint;
          canvas.style.cursor = 'grabbing';
          renderPage();
          return;
        }

        // 2. Kiểm tra trúng đỉnh (handle) để kéo điều chỉnh hình hoặc xoay hình
        const hitHandle = findHandleAt(point.x, point.y, 30);
        if (hitHandle) {
          state.activeHandle = hitHandle;
          state.isDrawing = true;
          state.lastDragPoint = { x: point.x, y: point.y };
          state.handleAdjustInitial = JSON.parse(JSON.stringify(hitHandle.element));
          const deps = getDependentElements(hitHandle.element);
          state.handleAdjustDependentsInitial = deps.map(d => ({ element: d, before: JSON.parse(JSON.stringify(d)) }));
          if (hitHandle.element.type === 'image') {
            state.handleResizeInitial = {
              x: hitHandle.element.x,
              y: hitHandle.element.y,
              width: hitHandle.element.width,
              height: hitHandle.element.height
            };
          }
          canvas.style.cursor = hitHandle.handle.cursor || 'crosshair';
          statusToolInfo.textContent = `🎯 Đang chỉnh: ${hitHandle.handle.name} (Kéo để điều chỉnh hình, các đối tượng sinh ra tự động biến đổi theo)`;
          renderPage();
          return;
        }

        // 3. Kiểm tra chọn thân hình
        const el = findElementAt(point.x, point.y);
        if (el) {
          if (el.type === 'graph-widget') {
            const headerBtn = window.__GraphWidget ? window.__GraphWidget.hitTestWidgetHeaderButtons(el, point.x, point.y) : null;
            if (headerBtn === 'edit') {
              window.__GraphWidget.openGraphSettingsModal(el, (updated) => {
                const before = JSON.parse(JSON.stringify(el));
                Object.assign(el, updated);
                pushCommand({
                  type: 'modify-element',
                  element: el,
                  before: before,
                  after: JSON.parse(JSON.stringify(el))
                });
                renderPage();
                showPageToast('📈 Đã cập nhật đồ thị hàm số!');
              });
              setSelectedElements([el]);
              state.isDrawing = false;
              renderPage();
              return;
            } else if (headerBtn === 'area_volume') {
              window.__GraphWidget.openGraphSettingsModal(el, (updated) => {
                const before = JSON.parse(JSON.stringify(el));
                Object.assign(el, updated);
                pushCommand({
                  type: 'modify-element',
                  element: el,
                  before: before,
                  after: JSON.parse(JSON.stringify(el))
                });
                renderPage();
                showPageToast('📐 Đã cập nhật Diện tích (S) & Thể tích (V)!');
              }, 'tab-graph-area-volume');
              setSelectedElements([el]);
              state.isDrawing = false;
              renderPage();
              return;
            } else if (headerBtn === 'toggle3d') {
              if (!el.revolution3D) el.revolution3D = { enabled: false };
              el.revolution3D.enabled = !el.revolution3D.enabled;
              setSelectedElements([el]);
              renderPage();
              showPageToast(el.revolution3D.enabled ? '🔄 Chế độ 3D Khối tròn xoay' : '⏹ Chế độ 2D Oxy');
              state.isDrawing = false;
              return;
            }

            // Kiểm tra click các nút điều khiển trực tiếp trên thanh 3D của widget
            if (el.revolution3D && el.revolution3D.enabled && window.__GraphWidget) {
              const ctrl3DBtn = window.__GraphWidget.hitTestWidget3DControls(el, point.x, point.y);
              if (ctrl3DBtn) {
                if (ctrl3DBtn === 'play_pause') {
                  el.revolution3D.isPlaying = !el.revolution3D.isPlaying;
                  if (el.revolution3D.isPlaying) {
                    startGraph3DAnimationLoop();
                  }
                  renderPage();
                } else if (ctrl3DBtn === 'reset') {
                  el.revolution3D.angleDeg = 0;
                  el.revolution3D.isPlaying = false;
                  renderPage();
                } else if (ctrl3DBtn === 'speed_05') {
                  el.revolution3D.speed = 0.5;
                  renderPage();
                } else if (ctrl3DBtn === 'speed_10') {
                  el.revolution3D.speed = 1.0;
                  renderPage();
                } else if (ctrl3DBtn === 'speed_20') {
                  el.revolution3D.speed = 2.0;
                  renderPage();
                }
                setSelectedElements([el]);
                state.isDrawing = false;
                return;
              }
            }
          }

          setSelectedElements([el]);
          state.isDrawing = true;
          state.dragLast = { x: point.x, y: point.y };
          state.totalMoved = { dx: 0, dy: 0 };
          state.pendingSingleSelect = el;
          canvas.style.cursor = 'grabbing';
        } else {
          // Bấm ra ngoài khoảng trống canvas: xóa chọn
          setSelectedElements([]);
          setCanvasCursor(SHARP_ARROW_CURSOR);
        }
        renderPage();
        return;
      }
    }

    state.isDrawing = true;

    if (state.activeTool === 'eraser') {
      if (state.eraserMode === 'partial') {
        state.eraserDragBefore = [...(state.pages[state.currentPage] || [])];
        state.eraserDragModified = false;
        state.eraserLastPoint = { x: point.x, y: point.y };
        state.eraserCursorPoint = { x: point.x, y: point.y };
        erasePartialAt(point.x, point.y, state.eraserRadius);
      } else {
        eraseElementAt(point.x, point.y);
      }
    } else if (state.activeTool === 'text') {
      const userText = prompt('Nhập chữ cần chèn vào ghi chú:');
      if (userText) {
        pushNewElement({
          type: 'text',
          text: userText,
          x: point.x,
          y: point.y,
          color: state.color
        });
      }
      state.isDrawing = false;
    } else if (state.activeTool === 'graph') {
      const inputFunc = document.getElementById('input-graph-func');
      const funcStr = (inputFunc && inputFunc.value) ? inputFunc.value.trim() : 'x^2';
      if (window.__GraphWidget) {
        const widget = window.__GraphWidget.createDefaultGraphWidget(point.x, point.y);
        if (funcStr) {
          widget.functions = [{
            id: 'fn_1',
            expr: funcStr,
            color: state.color || '#28634e',
            width: 2.5,
            dash: 'solid',
            range: [-5, 5],
            visible: true
          }];
          widget.specialPoints = window.__GraphWidget.autoFindSpecialPoints(funcStr, [-5, 5]);
        }
        pushNewElement(widget);
        setSelectedElements([widget]);
        state.activeTool = 'select';
        toolButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-tool') === 'select'));
        setCanvasCursor(SHARP_ARROW_CURSOR);
        updateContextualToolbar('select');
        renderPage();
        showPageToast('📈 Đã tạo đồ thị hàm số tại vị trí bấm chuột!');
      }
      state.isDrawing = false;
      return;
    } else if (state.activeTool === 'geo') {
      // Phản hồi tức thì ngay khi chạm bút / nhấn chuột cho công cụ Điểm, Trung điểm, Phân giác và Chọn góc
      if (state.activeGeo === 'point' || state.activeGeo === 'bisector' || state.activeGeo === 'angle' || state.activeGeo === 'midpoint') {
        state.isDrawing = false;
        handleConstructionClick(point);
        return;
      }
      let startPoint = point;
      state.geoStartSnapEl = null;
      if (state.activeGeo === 'line') {
        // Tối ưu đoạn thẳng: ưu tiên bắt dính chính xác vào điểm/đỉnh/chu vi/cạnh
        state.geoStartSnapBinding = null;
        const ptSnap = findPointAt(point.x, point.y, 22);
        if (ptSnap) {
          startPoint = { x: ptSnap.x, y: ptSnap.y };
          state.geoStartSnapEl = ptSnap.element;
          if (ptSnap.element) {
            ensureElementId(ptSnap.element);
            state.geoStartSnapBinding = { type: 'point', elementId: ptSnap.element.id, vIndex: ptSnap.vIndex };
          }
          state.hoverSnapPoint = { x: ptSnap.x, y: ptSnap.y };
        } else {
          const snap = checkCircleSnap(point);
          if (snap) {
            startPoint = { x: snap.x, y: snap.y };
            state.geoStartSnapEl = snap.circle;
            ensureElementId(snap.circle);
            state.geoStartSnapBinding = {
              type: 'point_on_circle',
              parentId: snap.circle.id,
              angle: snap.angle
            };
            state.hoverSnapPoint = { x: snap.x, y: snap.y };
          } else {
            const edgeSnap = findEdgeAt(point.x, point.y, 22);
            if (edgeSnap) {
              const proj = projectPointOnSegment(point.x, point.y, edgeSnap.start.x, edgeSnap.start.y, edgeSnap.end.x, edgeSnap.end.y);
              startPoint = { x: proj.x, y: proj.y };
              state.geoStartSnapEl = edgeSnap.element;
              ensureElementId(edgeSnap.element);
              state.geoStartSnapBinding = {
                type: 'point_on_line',
                parentId: edgeSnap.element.id,
                t: proj.t,
                edgeId: edgeSnap.edgeId,
                v1Index: edgeSnap.v1Index,
                v2Index: edgeSnap.v2Index
              };
              state.hoverSnapPoint = { x: proj.x, y: proj.y };
            }
          }
        }
      } else if (state.activeGeo === 'circle') {
        const ptSnap = findPointAt(point.x, point.y, 22);
        if (ptSnap) {
          startPoint = { x: ptSnap.x, y: ptSnap.y };
          state.geoStartSnapEl = ptSnap.element;
        }
      }
      state.geoStartPoint = startPoint;
    } else {
      // Bút vẽ hoặc Dạ quang
      state.currentPath = [point];
    }
  }

  function handlePointerMove(e) {
    const targetCanvas = (e && (e.currentTarget || (e.target && e.target.closest('canvas')))) || getCanvasForPage(state.currentPage) || canvas;
    const pageNum = parseInt((targetCanvas && targetCanvas.dataset.page) || state.currentPage, 10);
    if (!state.isDrawing && !isNaN(pageNum) && pageNum !== state.currentPage) {
      state.currentPage = pageNum;
      updatePageTabsActive(pageNum, false);
      updateUndoState();
      updateScrollBanner();
    }
    ctx = targetCanvas.getContext('2d');
    const point = getCanvasCoordinates(e);

    // 1. Kéo điều chỉnh từng chấm tròn điều khiển (Control Handle)
    if (state.activeHandle && state.isDrawing) {
      const el = state.activeHandle.element;
      const h = state.activeHandle.handle;

      // Xoay 3D trực tiếp trên trang bằng tay cầm xoay rot3d
      if (h.isRotate3D) {
        state.selectedEdge = null;
        state.selectedVertex = null;
        if (state.lastDragPoint) {
          const dx = point.x - state.lastDragPoint.x;
          const dy = point.y - state.lastDragPoint.y;
          // Tinh chỉnh tỉ lệ làm mịn để xoay đầm, êm ái và không rung giật
          const dRotY = dx * 0.009;
          const dRotX = -dy * 0.009;
          if (window.__hhkg3d && typeof window.__hhkg3d.rotateElement === 'function') {
            window.__hhkg3d.rotateElement(el, dRotX, dRotY);
            updateDependentBindings(el);
          }
        }
        state.lastDragPoint = { x: point.x, y: point.y };
        renderPage();
        return;
      }

      // Xoay 2D cho hình phẳng hoặc cụm hình bằng tay cầm rot2d
      if (h.isRotate2D) {
        state.selectedEdge = null;
        state.selectedVertex = null;
        const cx = h.cx !== undefined ? h.cx : (el.start ? el.start.x : point.x);
        const cy = h.cy !== undefined ? h.cy : (el.start ? el.start.y : point.y);
        const currentAngle = Math.atan2(point.y - cy, point.x - cx);
        if (state.lastRotateAngle !== undefined) {
          let deltaAngle = currentAngle - state.lastRotateAngle;
          while (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;
          while (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;

          // Xoay toàn bộ các đối tượng trong cụm liên kết (cùng nhóm hoặc đang được chọn)
          const elementsToRotate = getGroupElements(el);
          const rotatedSet = new Set();
          for (const item of elementsToRotate) {
            rotateElement2D(item, cx, cy, deltaAngle, rotatedSet);
            updateDependentBindings(item);
          }
        }
        state.lastRotateAngle = currentAngle;
        renderPage();
        return;
      }

      if (el.type === 'image') {
        const ar = el.aspectRatio || (el.width / el.height) || 1;
        if (h.id === 'bottom_right') {
          const newW = Math.max(30, point.x - el.x);
          el.width = Math.round(newW);
          el.height = Math.round(newW / ar);
        } else if (h.id === 'bottom_left') {
          const right = el.x + el.width;
          const newW = Math.max(30, right - point.x);
          el.x = Math.round(right - newW);
          el.width = Math.round(newW);
          el.height = Math.round(newW / ar);
        } else if (h.id === 'top_right') {
          const bottom = el.y + el.height;
          const newW = Math.max(30, point.x - el.x);
          const newH = Math.round(newW / ar);
          el.y = Math.round(bottom - newH);
          el.width = Math.round(newW);
          el.height = newH;
        } else if (h.id === 'top_left') {
          const right = el.x + el.width;
          const bottom = el.y + el.height;
          const newW = Math.max(30, right - point.x);
          const newH = Math.round(newW / ar);
          el.x = Math.round(right - newW);
          el.y = Math.round(bottom - newH);
          el.width = Math.round(newW);
          el.height = newH;
        }
      } else if (el.type === 'graph-widget' && h.isWidgetResize) {
        if (h.id === 'bottom_right') {
          el.width = Math.max(260, point.x - el.x);
          el.height = Math.max(200, point.y - el.y);
        } else if (h.id === 'bottom_left') {
          const right = el.x + el.width;
          el.width = Math.max(260, right - point.x);
          el.x = right - el.width;
          el.height = Math.max(200, point.y - el.y);
        } else if (h.id === 'top_right') {
          const bottom = el.y + el.height;
          el.width = Math.max(260, point.x - el.x);
          el.height = Math.max(200, bottom - point.y);
          el.y = bottom - el.height;
        } else if (h.id === 'top_left') {
          const right = el.x + el.width;
          const bottom = el.y + el.height;
          el.width = Math.max(260, right - point.x);
          el.x = right - el.width;
          el.height = Math.max(200, bottom - point.y);
          el.y = bottom - el.height;
        }
        if (el.origin) {
          el.origin.x = el.x + el.width / 2;
          el.origin.y = el.y + el.height / 2;
        }
        renderPage();
        return;
      } else if (el.shape === 'line') {
        const snap = findSnapTargetForHandle(point, el, h, 24);
        let target = snap ? { x: snap.x, y: snap.y } : { x: point.x, y: point.y };

        // Hỗ trợ giữ phím Shift để khóa góc 0°, 45°, 90°, 135°, 180°
        if (e && e.shiftKey) {
          const anchor = (h.id === 'start') ? el.end : el.start;
          const dx = target.x - anchor.x;
          const dy = target.y - anchor.y;
          const dist = Math.hypot(dx, dy);
          let angle = Math.atan2(dy, dx);
          angle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
          target = { x: anchor.x + dist * Math.cos(angle), y: anchor.y + dist * Math.sin(angle) };
        }

        if (h.id === 'start') el.start = target;
        else el.end = target;
        state.hoverSnapPoint = snap ? { x: snap.x, y: snap.y, label: snap.label } : null;
      } else if (el.shape === 'triangle' || el.shape === 'right-triangle' || el.shape === 'isosceles-triangle') {
        const snap = findSnapTargetForHandle(point, el, h, 24);
        const target = snap ? { x: snap.x, y: snap.y } : { x: point.x, y: point.y };
        el.points[h.index] = target;

        // Cập nhật bounding box start/end
        const xs = el.points.map(p => p.x);
        const ys = el.points.map(p => p.y);
        el.start = { x: Math.min(...xs), y: Math.min(...ys) };
        el.end = { x: Math.max(...xs), y: Math.max(...ys) };
        state.hoverSnapPoint = snap ? { x: snap.x, y: snap.y, label: snap.label } : null;
      } else if (el.shape === 'rectangle') {
        const snap = findSnapTargetForHandle(point, el, h, 24);
        const target = snap ? { x: snap.x, y: snap.y } : { x: point.x, y: point.y };
        const idx = h.index;
        el.points[idx] = { x: target.x, y: target.y };
        if (idx === 0) {
          el.points[1].y = target.y;
          el.points[3].x = target.x;
        } else if (idx === 1) {
          el.points[0].y = target.y;
          el.points[2].x = target.x;
        } else if (idx === 2) {
          el.points[3].y = target.y;
          el.points[1].x = target.x;
        } else if (idx === 3) {
          el.points[2].y = target.y;
          el.points[0].x = target.x;
        }
        const xs = el.points.map(p => p.x);
        const ys = el.points.map(p => p.y);
        el.start = { x: Math.min(...xs), y: Math.min(...ys) };
        el.end = { x: Math.max(...xs), y: Math.max(...ys) };
        state.hoverSnapPoint = snap ? { x: snap.x, y: snap.y, label: snap.label } : null;
      } else if (el.shape === 'square') {
        const snap = findSnapTargetForHandle(point, el, h, 24);
        const target = snap ? { x: snap.x, y: snap.y } : { x: point.x, y: point.y };
        const opp = el.points[(h.index + 2) % 4];
        const dx = target.x - opp.x;
        const dy = target.y - opp.y;
        const side = Math.max(Math.abs(dx), Math.abs(dy));
        if (h.index === 0) {
          el.points[0] = { x: opp.x - side, y: opp.y - side };
          el.points[1] = { x: opp.x, y: opp.y - side };
          el.points[2] = { x: opp.x, y: opp.y };
          el.points[3] = { x: opp.x - side, y: opp.y };
        } else if (h.index === 1) {
          el.points[0] = { x: opp.x, y: opp.y - side };
          el.points[1] = { x: opp.x + side, y: opp.y - side };
          el.points[2] = { x: opp.x + side, y: opp.y };
          el.points[3] = { x: opp.x, y: opp.y };
        } else if (h.index === 2) {
          el.points[0] = { x: opp.x, y: opp.y };
          el.points[1] = { x: opp.x + side, y: opp.y };
          el.points[2] = { x: opp.x + side, y: opp.y + side };
          el.points[3] = { x: opp.x, y: opp.y + side };
        } else if (h.index === 3) {
          el.points[0] = { x: opp.x - side, y: opp.y };
          el.points[1] = { x: opp.x, y: opp.y };
          el.points[2] = { x: opp.x, y: opp.y + side };
          el.points[3] = { x: opp.x - side, y: opp.y + side };
        }
        const xs = el.points.map(p => p.x);
        const ys = el.points.map(p => p.y);
        el.start = { x: Math.min(...xs), y: Math.min(...ys) };
        el.end = { x: Math.max(...xs), y: Math.max(...ys) };
        state.hoverSnapPoint = snap ? { x: snap.x, y: snap.y, label: snap.label } : null;
      } else if (el.shape === 'rhombus') {
        const snap = findSnapTargetForHandle(point, el, h, 24);
        const target = snap ? { x: snap.x, y: snap.y } : { x: point.x, y: point.y };
        const cx = (el.points[1].x + el.points[3].x) / 2;
        const cy = (el.points[0].y + el.points[2].y) / 2;
        if (h.id === 'p0' || h.id === 'p2') {
          const ry = Math.max(5, Math.abs(target.y - cy));
          el.points[0] = { x: cx, y: cy - ry };
          el.points[2] = { x: cx, y: cy + ry };
        } else {
          const rx = Math.max(5, Math.abs(target.x - cx));
          el.points[1] = { x: cx + rx, y: cy };
          el.points[3] = { x: cx - rx, y: cy };
        }
        const xs = el.points.map(p => p.x);
        const ys = el.points.map(p => p.y);
        el.start = { x: Math.min(...xs), y: Math.min(...ys) };
        el.end = { x: Math.max(...xs), y: Math.max(...ys) };
        state.hoverSnapPoint = snap ? { x: snap.x, y: snap.y, label: snap.label } : null;
      } else if (el.shape === 'parallelogram') {
        const snap = findSnapTargetForHandle(point, el, h, 24);
        const target = snap ? { x: snap.x, y: snap.y } : { x: point.x, y: point.y };
        const idx = h.index;
        el.points[idx] = { x: target.x, y: target.y };
        if (idx === 0) {
          el.points[2] = { x: el.points[1].x + el.points[3].x - target.x, y: el.points[1].y + el.points[3].y - target.y };
        } else if (idx === 1) {
          el.points[3] = { x: el.points[0].x + el.points[2].x - target.x, y: el.points[0].y + el.points[2].y - target.y };
        } else if (idx === 2) {
          el.points[0] = { x: el.points[1].x + el.points[3].x - target.x, y: el.points[1].y + el.points[3].y - target.y };
        } else if (idx === 3) {
          el.points[1] = { x: el.points[0].x + el.points[2].x - target.x, y: el.points[0].y + el.points[2].y - target.y };
        }
        const xs = el.points.map(p => p.x);
        const ys = el.points.map(p => p.y);
        el.start = { x: Math.min(...xs), y: Math.min(...ys) };
        el.end = { x: Math.max(...xs), y: Math.max(...ys) };
        state.hoverSnapPoint = snap ? { x: snap.x, y: snap.y, label: snap.label } : null;
      } else if (isSolidShape(el.shape)) {
        const snap = findSnapTargetForHandle(point, el, h, 24);
        const target = snap ? { x: snap.x, y: snap.y } : { x: point.x, y: point.y };
        if (el.points && el.points[h.index]) {
          const p = el.points[h.index];
          el.points[h.index] = { x: target.x, y: target.y, name: p.name, offX: p.offX, offY: p.offY };

          // Nếu là hình chóp tứ giác đều (pyramid-regular), khi kéo đỉnh đáy A, B, C, D thì O tự động là tâm AC và BD
          if (el.shape === 'pyramid-regular' && el.points.length >= 6) {
            if (h.index >= 1 && h.index <= 4) {
              const A = el.points[1], C = el.points[3];
              el.points[5] = {
                x: Math.round((A.x + C.x) / 2),
                y: Math.round((A.y + C.y) / 2),
                name: 'O',
                offX: 6,
                offY: 12
              };
            }
          }
          const xs = el.points.map(pt => pt.x);
          const ys = el.points.map(pt => pt.y);
          el.start = { x: Math.min(...xs), y: Math.min(...ys) };
          el.end = { x: Math.max(...xs), y: Math.max(...ys) };
          state.hoverSnapPoint = snap ? { x: snap.x, y: snap.y, label: snap.label } : null;
        }
      } else if (el.shape === 'ellipse') {
        if (h.id === 'center') {
          const dx = point.x - el.start.x;
          const dy = point.y - el.start.y;
          translateElement(el, dx, dy);
        } else if (h.id === 'axis_a') {
          el.rx = Math.max(5, Math.round(Math.abs(point.x - el.start.x)));
          if (ellipseAxisAInput) ellipseAxisAInput.value = el.rx;
        } else if (h.id === 'axis_b') {
          el.ry = Math.max(5, Math.round(Math.abs(point.y - el.start.y)));
          if (ellipseAxisBInput) ellipseAxisBInput.value = el.ry;
        }
      } else if (el.shape === 'inscribed-triangle') {
        if (h.id.startsWith('angle_')) {
          // Xoay đỉnh tam giác trượt quanh chu vi đường tròn
          const angle = Math.atan2(point.y - el.start.y, point.x - el.start.x);
          el.angles[h.index] = angle;
        } else if (h.id === 'center') {
          // Di chuyển cả đường tròn và tam giác nội tiếp
          const dx = point.x - el.start.x;
          const dy = point.y - el.start.y;
          translateElement(el, dx, dy);
        }
      } else if (el.shape === 'circle') {
        if (h.id === 'radius') {
          el.end = { x: point.x, y: point.y };
        } else if (h.id === 'center') {
          const dx = point.x - el.start.x;
          const dy = point.y - el.start.y;
          translateElement(el, dx, dy);
        }
      } else if (el.shape === 'two-tangents') {
        if (h.id === 'ext_point') {
          // Di chuyển điểm ngoài M (tiếp tuyến xoay theo M)
          el.end = { x: point.x, y: point.y };
        } else if (h.id === 'center') {
          // Di chuyển cả đường tròn và các tiếp tuyến
          const dx = point.x - el.start.x;
          const dy = point.y - el.start.y;
          translateElement(el, dx, dy);
        }
      } else if (el.shape === 'angle') {
        if (h.id === 'start') {
          const dx = point.x - el.start.x;
          const dy = point.y - el.start.y;
          translateElement(el, dx, dy);
        } else if (h.id === 'second_pt') {
          const base = (el.baseDir !== undefined ? el.baseDir : 0);
          const curDir = Math.atan2(point.y - el.start.y, point.x - el.start.x);
          let diffRad = curDir - base;
          while (diffRad < -Math.PI) diffRad += Math.PI * 2;
          while (diffRad > Math.PI) diffRad -= Math.PI * 2;
          let deg = Math.round((Math.abs(diffRad) * 180) / Math.PI);
          deg = Math.max(1, Math.min(180, deg));
          el.angleDeg = deg;
          el.direction = diffRad >= 0 ? 1 : -1;
          if (el.binding) el.binding.direction = el.direction;
          const armLen = Math.hypot(point.x - el.start.x, point.y - el.start.y);
          el.armLength = Math.max(30, Math.round(armLen));
          const rad = base + el.direction * (deg * Math.PI / 180);
          el.secondPoint = {
            x: Math.round(el.start.x + el.armLength * Math.cos(rad)),
            y: Math.round(el.start.y + el.armLength * Math.sin(rad))
          };
          if (angleDegreesInput) angleDegreesInput.value = deg;
          if (angleInputContainer) angleInputContainer.style.display = 'inline-flex';
        }
      } else if (el.shape === 'perpendicular' || el.shape === 'parallel' || el.shape === 'tangent') {
        const dx = el.end.x - el.start.x;
        const dy = el.end.y - el.start.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        if (h.id === 'start') {
          const vx = point.x - el.end.x;
          const vy = point.y - el.end.y;
          const t = vx * ux + vy * uy;
          el.start = { x: el.end.x + t * ux, y: el.end.y + t * uy };
        } else if (h.id === 'end') {
          const vx = point.x - el.start.x;
          const vy = point.y - el.start.y;
          const t = vx * ux + vy * uy;
          el.end = { x: el.start.x + t * ux, y: el.start.y + t * uy };
        }
      } else if (el.shape === 'point') {
        if (el.binding && el.binding.type === 'point_on_circle') {
          const parent = findElementById(el.binding.parentId);
          if (parent) {
            const O = { x: parent.start.x, y: parent.start.y };
            const R = parent.radius || Math.hypot(parent.end.x - parent.start.x, parent.end.y - parent.start.y);
            const ang = Math.atan2(point.y - O.y, point.x - O.x);
            el.binding.angle = ang;
            el.start = { x: O.x + R * Math.cos(ang), y: O.y + R * Math.sin(ang) };
            el.end = { x: el.start.x, y: el.start.y };
          } else {
            el.start = { x: point.x, y: point.y };
            el.end = { x: point.x, y: point.y };
          }
        } else if (el.binding && el.binding.type === 'point_on_line') {
          const parent = findElementById(el.binding.parentId);
          let A = null, B = null;
          if (parent) {
            if (parent.shape === 'line' || parent.shape === 'perpendicular' || parent.shape === 'parallel' || parent.shape === 'tangent' || parent.shape === 'bisector') {
              A = parent.start; B = parent.end;
            } else if (parent.points && el.binding.v1Index !== undefined && el.binding.v2Index !== undefined) {
              A = parent.points[el.binding.v1Index]; B = parent.points[el.binding.v2Index];
            } else if (parent.shape === 'inscribed-triangle' && el.binding.v1Index !== undefined && el.binding.v2Index !== undefined) {
              const r = Math.hypot(parent.end.x - parent.start.x, parent.end.y - parent.start.y);
              const angles = parent.angles || [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
              A = { x: parent.start.x + r * Math.cos(angles[el.binding.v1Index]), y: parent.start.y + r * Math.sin(angles[el.binding.v1Index]) };
              B = { x: parent.start.x + r * Math.cos(angles[el.binding.v2Index]), y: parent.start.y + r * Math.sin(angles[el.binding.v2Index]) };
            }
          }
          if (A && B) {
            const dx = B.x - A.x, dy = B.y - A.y;
            const lenSq = dx * dx + dy * dy;
            const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((point.x - A.x) * dx + (point.y - A.y) * dy) / lenSq));
            el.binding.t = t;
            el.start = { x: A.x + t * dx, y: A.y + t * dy };
            el.end = { x: el.start.x, y: el.start.y };
          } else {
            el.start = { x: point.x, y: point.y };
            el.end = { x: point.x, y: point.y };
          }
        } else {
          el.start = { x: point.x, y: point.y };
          el.end = { x: point.x, y: point.y };
        }
      } else if (el.shape === 'bisector') {
        if (h.id === 'end') {
          const dx = el.end.x - el.start.x;
          const dy = el.end.y - el.start.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const vx = point.x - el.start.x;
          const vy = point.y - el.start.y;
          const t = Math.max(20, vx * ux + vy * uy);
          el.end = { x: el.start.x + t * ux, y: el.start.y + t * uy };
        } else if (h.id === 'start') {
          const dx = point.x - el.start.x;
          const dy = point.y - el.start.y;
          translateElement(el, dx, dy);
        }
      }

      updateDependentBindings(el);
      renderPage();
      return;
    }

    // 2. Di chuyển đối tượng bằng Chọn đối tượng (hỗ trợ di chuyển 1 hoặc nhiều đối tượng cùng lúc)
    if (state.activeTool === 'select') {
      const selectedList = state.selectedElements && state.selectedElements.length > 0
        ? state.selectedElements
        : (state.selectedElement ? [state.selectedElement] : []);

      if (state.isDrawing && selectedList.length > 0) {
        const dx = point.x - state.dragLast.x;
        const dy = point.y - state.dragLast.y;
        const movedSet = new Set();
        for (const el of selectedList) {
          translateElement(el, dx, dy, movedSet);
        }
        state.totalMoved.dx += dx;
        state.totalMoved.dy += dy;
        state.dragLast = { x: point.x, y: point.y };
        renderPage();
      } else {
        // 1. Kiểm tra xem có đang hover trúng ĐIỂM hình học hay không
        const hoverPoint = findElementAt(point.x, point.y);
        const isPointEl = hoverPoint && hoverPoint.type === 'geo' && hoverPoint.shape === 'point';

        if (isPointEl) {
          setCanvasCursor(SHARP_ARROW_CURSOR);
          if (state.hoverPointTarget !== hoverPoint || state.hoverHandle !== null) {
            state.hoverPointTarget = hoverPoint;
            state.hoverHandle = null;
            renderPage();
          }
          statusToolInfo.textContent = '🎯 Đang nhắm: Điểm - Nhấp để chọn (hoặc giữ ⌘/Ctrl để chọn nhiều)';
          return;
        } else if (state.hoverPointTarget) {
          state.hoverPointTarget = null;
          renderPage();
        }

        // 2. Kiểm tra xem có đang hover trúng ĐỈNH TAM GIÁC hoặc ĐẦU MÚT ĐOẠN THẲNG (Handle)
        const hitHandle = findHandleAt(point.x, point.y, 28);
        if (hitHandle) {
          setCanvasCursor(SHARP_ARROW_CURSOR);
          const isSame = state.hoverHandle && state.hoverHandle.handle && state.hoverHandle.handle.id === hitHandle.handle.id && state.hoverHandle.element === hitHandle.element;
          if (!isSame) {
            state.hoverHandle = hitHandle;
            state.hoverElement = hitHandle.element;
            renderPage();
          }
          statusToolInfo.textContent = `🎯 Đang nhắm: ${hitHandle.handle.name} - Bấm kéo để điều chỉnh hình`;
          return;
        } else if (state.hoverHandle) {
          state.hoverHandle = null;
          renderPage();
        }

        // 3. Nếu không trúng handle, kiểm tra hover vào thân hình học
        const hoverEl = findElementAt(point.x, point.y);
        if (hoverEl) {
          setCanvasCursor(SHARP_ARROW_CURSOR);
          if (state.hoverElement !== hoverEl) {
            state.hoverElement = hoverEl;
            renderPage();
          }
        } else {
          setCanvasCursor(SHARP_ARROW_CURSOR);
          if (state.hoverElement) {
            state.hoverElement = null;
            renderPage();
          }
        }
      }
      return;
    }

    // Kiểm tra hover bắt dính hoặc hiển thị đầu tẩy khi chưa kéo vẽ
    if (!state.isDrawing) {
      if (state.activeTool === 'eraser') {
        canvas.style.cursor = 'crosshair';
        if (state.eraserMode === 'partial') {
          state.eraserCursorPoint = { x: point.x, y: point.y };
          renderPage();
        }
        return;
      }
      if (state.activeTool === 'geo' && state.activeGeo === 'line') {
        const hoverPt = findPointAt(point.x, point.y, 22);
        const hoverCirc = !hoverPt ? checkCircleSnap(point) : null;
        let snapCoord = hoverPt ? { x: hoverPt.x, y: hoverPt.y } : (hoverCirc ? { x: hoverCirc.x, y: hoverCirc.y } : null);
        if (!snapCoord) {
          const hoverEdge = findEdgeAt(point.x, point.y, 22);
          if (hoverEdge) {
            const proj = projectPointOnSegment(point.x, point.y, hoverEdge.start.x, hoverEdge.start.y, hoverEdge.end.x, hoverEdge.end.y);
            snapCoord = { x: proj.x, y: proj.y };
          }
        }
        if (JSON.stringify(state.hoverSnapPoint) !== JSON.stringify(snapCoord)) {
          state.hoverSnapPoint = snapCoord;
          renderPage();
        }
        canvas.style.cursor = state.hoverSnapPoint ? 'default' : 'crosshair';
        return;
      }
      if (state.activeTool === 'geo' && state.activeGeo === 'point') {
        const hoverPt = findPointAt(point.x, point.y, 18);
        const hoverCirc = !hoverPt ? checkCircleSnap(point) : null;
        const hoverEdge = (!hoverPt && !hoverCirc) ? findEdgeAt(point.x, point.y, 24) : null;

        let snapCoord = null;
        if (hoverPt) {
          snapCoord = { x: hoverPt.x, y: hoverPt.y, label: 'Điểm' };
        } else if (hoverCirc) {
          snapCoord = { x: hoverCirc.x, y: hoverCirc.y, label: 'Điểm trên đường tròn' };
        } else if (hoverEdge) {
          const A = hoverEdge.start;
          const B = hoverEdge.end;
          const dx = B.x - A.x, dy = B.y - A.y;
          const lenSq = dx * dx + dy * dy;
          const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((point.x - A.x) * dx + (point.y - A.y) * dy) / lenSq));
          snapCoord = { x: A.x + t * dx, y: A.y + t * dy, label: 'Điểm trên đường thẳng' };
        }

        const oldCoord = state.hoverSnapPoint ? { x: state.hoverSnapPoint.x, y: state.hoverSnapPoint.y, label: state.hoverSnapPoint.label } : null;
        const newCoord = snapCoord ? { x: snapCoord.x, y: snapCoord.y, label: snapCoord.label } : null;
        if (JSON.stringify(oldCoord) !== JSON.stringify(newCoord)) {
          state.hoverSnapPoint = snapCoord;
          renderPage();
        }
        if (snapCoord) {
          statusToolInfo.textContent = `🎯 Đang nhắm: ${snapCoord.label} (Nhấp để tạo điểm gắn liền với hình)`;
        } else {
          statusToolInfo.textContent = 'Điểm: Nhấp vào vị trí bất kỳ để tạo điểm (nhấp trên đường thẳng/đường tròn để gắn liền)';
        }
        canvas.style.cursor = snapCoord ? 'pointer' : 'crosshair';
        return;
      }
      if (state.activeTool === 'geo' && state.activeGeo === 'bisector') {
        // Hover đỉnh tam giác hoặc cạnh
        const vHit = findPointAt(point.x, point.y, 24);
        let newHoverVertex = null;
        if (vHit && vHit.element && vHit.element.points && vHit.element.points.length === 3) {
          const pts = vHit.element.points;
          let vIdx = -1;
          for (let i = 0; i < 3; i++) {
            if (Math.hypot(pts[i].x - vHit.x, pts[i].y - vHit.y) < 6) {
              vIdx = i;
              break;
            }
          }
          if (vIdx !== -1) {
            newHoverVertex = { element: vHit.element, vertexIndex: vIdx, point: vHit };
          }
        }

        const newHoverEdge = !newHoverVertex ? findEdgeAt(point.x, point.y, 28) : null;

        let needsRender = false;
        if (JSON.stringify(state.bisectorHoverVertex) !== JSON.stringify(newHoverVertex)) {
          state.bisectorHoverVertex = newHoverVertex;
          needsRender = true;
        }
        if (JSON.stringify(state.bisectorHoverEdge) !== JSON.stringify(newHoverEdge)) {
          state.bisectorHoverEdge = newHoverEdge;
          needsRender = true;
        }
        if (needsRender) renderPage();
        canvas.style.cursor = (state.bisectorHoverVertex || state.bisectorHoverEdge) ? 'pointer' : 'crosshair';
        return;
      }
      if (state.activeTool === 'geo' && (state.activeGeo === 'angle' || state.activeGeo === 'midpoint')) {
        setCanvasCursor(SHARP_ARROW_CURSOR);
        return;
      }
    }

    // Cập nhật hover cho 2 tùy chọn nét đứt (Tiếp tuyến hoặc Chọn góc)
    if (!state.isDrawing && state.pendingOptions && state.pendingOptions.options) {
      let closestIdx = -1;
      let minDist = Infinity;
      const opts = state.pendingOptions.options;
      for (let i = 0; i < opts.length; i++) {
        const opt = opts[i];
        const p1 = opt.start;
        const p2 = (state.pendingOptions.type === 'tangent') ? opt.end : opt.secondPoint;
        if (p1 && p2) {
          const d = distToSegment(point.x, point.y, p1.x, p1.y, p2.x, p2.y);
          if (d < minDist) {
            minDist = d;
            if (d <= 32) closestIdx = i;
          }
        }
      }
      if (state.hoveredOptionIndex !== closestIdx) {
        state.hoveredOptionIndex = closestIdx;
        renderPage();
      }
      if (closestIdx !== -1) {
        canvas.style.cursor = 'pointer';
        return;
      } else {
        setCanvasCursor(SHARP_ARROW_CURSOR);
      }
    }

    if (!state.isDrawing) return;

    statusPressureInfo.textContent = `Lực nhấn bút: ${(point.pressure * 100).toFixed(0)}%`;

    if (state.activeTool === 'eraser') {
      if (state.eraserMode === 'partial') {
        state.eraserCursorPoint = { x: point.x, y: point.y };
        const last = state.eraserLastPoint || point;
        const dist = Math.hypot(point.x - last.x, point.y - last.y);
        const curRad = state.eraserRadius || 3;
        const stepDist = Math.max(1.2, curRad * 0.6);
        if (dist > stepDist) {
          const steps = Math.ceil(dist / stepDist);
          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            erasePartialAt(last.x + t * (point.x - last.x), last.y + t * (point.y - last.y), curRad);
          }
        } else {
          erasePartialAt(point.x, point.y, curRad);
        }
        state.eraserLastPoint = { x: point.x, y: point.y };
        renderPage();
      } else {
        eraseElementAt(point.x, point.y);
      }
      return;
    } else if (state.activeTool === 'geo' && state.geoStartPoint) {
      if (state.activeGeo === 'perpendicular' || state.activeGeo === 'parallel' || state.activeGeo === 'bisector' || state.activeGeo === 'tangent' || state.activeGeo === 'point' || state.activeGeo === 'angle' || state.activeGeo === 'midpoint' || state.activeGeo === 'intersection') {
        return;
      }
      let previewEnd = point;
      if (state.activeGeo === 'line') {
        const ptSnap = findPointAt(point.x, point.y, 22);
        if (ptSnap) {
          previewEnd = { x: ptSnap.x, y: ptSnap.y };
          state.hoverSnapPoint = { x: ptSnap.x, y: ptSnap.y };
        } else {
          const snap = checkCircleSnap(point);
          if (snap) {
            previewEnd = { x: snap.x, y: snap.y };
            state.hoverSnapPoint = { x: snap.x, y: snap.y };
          } else {
            const edgeSnap = findEdgeAt(point.x, point.y, 22);
            if (edgeSnap) {
              const proj = projectPointOnSegment(point.x, point.y, edgeSnap.start.x, edgeSnap.start.y, edgeSnap.end.x, edgeSnap.end.y);
              previewEnd = { x: proj.x, y: proj.y };
              state.hoverSnapPoint = { x: proj.x, y: proj.y };
            } else {
              state.hoverSnapPoint = null;
            }
          }
        }
      }

      renderPage();
      const previewGeo = {
        type: 'geo',
        shape: state.activeGeo,
        start: state.geoStartPoint,
        end: previewEnd,
        color: state.color,
        width: state.strokeWidth,
        dash: state.dashStyle,
        angleDeg: parseFloat(angleDegreesInput.value) || 60
      };
      if (state.activeGeo === 'two-tangents') {
        const d = Math.hypot(previewEnd.x - state.geoStartPoint.x, previewEnd.y - state.geoStartPoint.y);
        previewGeo.radius = Math.max(35, Math.min(130, d * 0.45));
      } else if (state.activeGeo === 'perpendicular') {
        previewGeo.perpHeight = 90;
      } else if (state.activeGeo === 'parallel') {
        previewGeo.offset = 45;
      } else if (state.activeGeo === 'bisector') {
        previewGeo.angleDeg = parseFloat(angleDegreesInput.value) || 60;
      } else if (state.activeGeo === 'rectangle') {
        previewGeo.points = [
          { x: state.geoStartPoint.x, y: state.geoStartPoint.y },
          { x: previewEnd.x, y: state.geoStartPoint.y },
          { x: previewEnd.x, y: previewEnd.y },
          { x: state.geoStartPoint.x, y: previewEnd.y }
        ];
      } else if (state.activeGeo === 'square') {
        const dx = previewEnd.x - state.geoStartPoint.x;
        const dy = previewEnd.y - state.geoStartPoint.y;
        const side = Math.max(Math.abs(dx), Math.abs(dy));
        const sX = (dx >= 0 ? 1 : -1) * side;
        const sY = (dy >= 0 ? 1 : -1) * side;
        previewGeo.points = [
          { x: state.geoStartPoint.x, y: state.geoStartPoint.y },
          { x: state.geoStartPoint.x + sX, y: state.geoStartPoint.y },
          { x: state.geoStartPoint.x + sX, y: state.geoStartPoint.y + sY },
          { x: state.geoStartPoint.x, y: state.geoStartPoint.y + sY }
        ];
      } else if (state.activeGeo === 'parallelogram') {
        const dx = previewEnd.x - state.geoStartPoint.x;
        const dy = previewEnd.y - state.geoStartPoint.y;
        const skew = dx * 0.25;
        previewGeo.points = [
          { x: state.geoStartPoint.x + skew, y: state.geoStartPoint.y },
          { x: previewEnd.x, y: state.geoStartPoint.y },
          { x: previewEnd.x - skew, y: previewEnd.y },
          { x: state.geoStartPoint.x, y: previewEnd.y }
        ];
      } else if (state.activeGeo === 'rhombus') {
        const cx = (state.geoStartPoint.x + previewEnd.x) / 2;
        const cy = (state.geoStartPoint.y + previewEnd.y) / 2;
        const rx = Math.abs(previewEnd.x - state.geoStartPoint.x) / 2;
        const ry = Math.abs(previewEnd.y - state.geoStartPoint.y) / 2;
        previewGeo.points = [
          { x: cx, y: cy - ry },
          { x: cx + rx, y: cy },
          { x: cx, y: cy + ry },
          { x: cx - rx, y: cy }
        ];
      } else if (state.activeGeo === 'ellipse') {
        const cx = (state.geoStartPoint.x + previewEnd.x) / 2;
        const cy = (state.geoStartPoint.y + previewEnd.y) / 2;
        const rx = Math.max(5, Math.abs(previewEnd.x - state.geoStartPoint.x) / 2);
        const ry = Math.max(5, Math.abs(previewEnd.y - state.geoStartPoint.y) / 2);
        previewGeo.start = { x: cx, y: cy };
        previewGeo.rx = rx;
        previewGeo.ry = ry;
        if (ellipseAxisAInput) ellipseAxisAInput.value = Math.round(rx);
        if (ellipseAxisBInput) ellipseAxisBInput.value = Math.round(ry);
      } else if (isSolidShape(state.activeGeo)) {
        const solidData = computeSolidShapeData(state.activeGeo, state.geoStartPoint, previewEnd);
        previewGeo.points = solidData.points;
        previewGeo.edges = solidData.edges;
        previewGeo.is3D = true;
      }

      drawElement(previewGeo);
    } else if (state.activeTool === 'pen' || state.activeTool === 'highlighter') {
      state.currentPath.push(point);

      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = state.color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (state.activeTool === 'highlighter') {
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = state.strokeWidth * 3.5;
      } else {
        ctx.globalAlpha = 1.0;
        const pr = (point.pressure !== undefined && point.pressure > 0) ? point.pressure : 0.5;
        ctx.lineWidth = Math.max(1, state.strokeWidth * (0.6 + pr * 0.8));
      }

      const len = state.currentPath.length;
      if (len >= 2) {
        ctx.beginPath();
        ctx.moveTo(state.currentPath[len - 2].x, state.currentPath[len - 2].y);
        ctx.lineTo(state.currentPath[len - 1].x, state.currentPath[len - 1].y);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function finishDrawing(e) {
    const targetCanvas = (e && (e.currentTarget || (e.target && e.target.closest('canvas')))) || getCanvasForPage(state.currentPage) || canvas;
    const pageNum = parseInt((targetCanvas && targetCanvas.dataset.page) || state.currentPage, 10);
    if (!isNaN(pageNum) && pageNum !== state.currentPage) {
      state.currentPage = pageNum;
    }
    if (targetCanvas) ctx = targetCanvas.getContext('2d');
    const point = getCanvasCoordinates(e);

    // Kết thúc kéo chỉnh chấm điều khiển
    if (state.activeHandle) {
      const el = state.activeHandle.element;
      if (el && el.type === 'image' && state.handleResizeInitial) {
        if (el.width !== state.handleResizeInitial.width || el.height !== state.handleResizeInitial.height) {
          pushCommand({
            type: 'resize-image',
            element: el,
            before: { ...state.handleResizeInitial },
            after: { x: el.x, y: el.y, width: el.width, height: el.height }
          });
        }
        state.handleResizeInitial = null;
      } else if (el && state.handleAdjustInitial) {
        const beforeJson = JSON.stringify(state.handleAdjustInitial);
        const afterJson = JSON.stringify(el);
        if (beforeJson !== afterJson) {
          updateDependentBindings(el);
          pushCommand({
            type: 'modify-element-group',
            element: el,
            before: state.handleAdjustInitial,
            after: JSON.parse(afterJson),
            dependents: (state.handleAdjustDependentsInitial || []).map(item => ({
              element: item.element,
              before: item.before,
              after: JSON.parse(JSON.stringify(item.element))
            }))
          });
        }
        state.handleAdjustInitial = null;
        state.handleAdjustDependentsInitial = null;
      }
      state.lastRotateAngle = undefined;
      state.lastDragPoint = null;
      state.activeHandle = null;
      state.hoverSnapPoint = null;
      state.isDrawing = false;
      state.selectedEdge = null;
      state.selectedVertex = null;
      if (state.activeTool === 'select') {
        setCanvasCursor(SHARP_ARROW_CURSOR);
      } else {
        canvas.style.cursor = 'default';
      }
      renderPage();
      return;
    }

    // Kết thúc di chuyển đối tượng bằng Chọn đối tượng (hỗ trợ nhóm nhiều đối tượng)
    if (state.activeTool === 'select') {
      const selectedList = state.selectedElements && state.selectedElements.length > 0
        ? state.selectedElements
        : (state.selectedElement ? [state.selectedElement] : []);

      if (selectedList.length > 0 && (Math.abs(state.totalMoved.dx) > 1 || Math.abs(state.totalMoved.dy) > 1)) {
        pushCommand({
          type: 'move-multiple',
          elements: [...selectedList],
          dx: state.totalMoved.dx,
          dy: state.totalMoved.dy
        });
        state.pendingSingleSelect = null;
      } else if (state.pendingSingleSelect) {
        // Chỉ chọn đơn lẻ một đối tượng duy nhất theo yêu cầu
        setSelectedElements([state.pendingSingleSelect]);
        state.pendingSingleSelect = null;
      }
      state.isDrawing = false;
      setCanvasCursor(SHARP_ARROW_CURSOR);
      renderPage();
      return;
    }

    if (state.activeTool === 'eraser') {
      const wasModified = state.eraserDragModified;
      if (state.eraserMode === 'partial' && state.eraserDragModified && state.eraserDragBefore) {
        pushCommand({
          type: 'page-replace',
          before: state.eraserDragBefore,
          after: [...(state.pages[state.currentPage] || [])]
        });
      }
      state.eraserLastPoint = null;
      state.eraserDragBefore = null;
      state.eraserDragModified = false;
      state.isDrawing = false;
      renderPage();

      // Nếu bật tính năng "Tự đổi lại Bút vẽ sau khi tẩy xong"
      if (state.autoSwitchToPen && wasModified) {
        setPenToolMode('pen');
        showPageToast('✏️ Đã tự động chuyển về Bút viết');
      }
      return;
    }

    if (!state.isDrawing) return;
    state.isDrawing = false;

    if (state.activeTool === 'geo') {
      if (state.activeGeo === 'perpendicular' || state.activeGeo === 'parallel' || state.activeGeo === 'bisector' || state.activeGeo === 'tangent' || state.activeGeo === 'point' || state.activeGeo === 'angle' || state.activeGeo === 'midpoint' || state.activeGeo === 'intersection') {
        const d = state.geoStartPoint ? Math.hypot(point.x - state.geoStartPoint.x, point.y - state.geoStartPoint.y) : 0;
        state.geoStartPoint = null;
        if (d < 25) {
          handleConstructionClick(point);
        }
        renderPage();
        return;
      }

      if (!state.geoStartPoint) return;

      let finalEnd = point;
      let endSnapEl = null;
      let endSnapBinding = null;
      if (state.activeGeo === 'line') {
        const ptSnap = findPointAt(point.x, point.y, 22);
        if (ptSnap) {
          finalEnd = { x: ptSnap.x, y: ptSnap.y };
          endSnapEl = ptSnap.element;
          if (ptSnap.element) {
            ensureElementId(ptSnap.element);
            endSnapBinding = { type: 'point', elementId: ptSnap.element.id, vIndex: ptSnap.vIndex };
          }
        } else {
          const snap = checkCircleSnap(point);
          if (snap) {
            finalEnd = { x: snap.x, y: snap.y };
            endSnapEl = snap.circle;
            ensureElementId(snap.circle);
            endSnapBinding = {
              type: 'point_on_circle',
              parentId: snap.circle.id,
              angle: snap.angle
            };
          } else {
            const edgeSnap = findEdgeAt(point.x, point.y, 22);
            if (edgeSnap) {
              const proj = projectPointOnSegment(point.x, point.y, edgeSnap.start.x, edgeSnap.start.y, edgeSnap.end.x, edgeSnap.end.y);
              finalEnd = { x: proj.x, y: proj.y };
              endSnapEl = edgeSnap.element;
              ensureElementId(edgeSnap.element);
              endSnapBinding = {
                type: 'point_on_line',
                parentId: edgeSnap.element.id,
                t: proj.t,
                edgeId: edgeSnap.edgeId,
                v1Index: edgeSnap.v1Index,
                v2Index: edgeSnap.v2Index
              };
            }
          }
        }
      }

      const newGeo = {
        type: 'geo',
        shape: state.activeGeo,
        start: state.geoStartPoint,
        end: finalEnd,
        color: state.color,
        width: state.strokeWidth,
        dash: state.dashStyle,
        angleDeg: parseFloat(angleDegreesInput.value) || 60
      };
      if (state.geoStartSnapBinding) {
        newGeo.startBinding = state.geoStartSnapBinding;
      }
      if (endSnapBinding) {
        newGeo.endBinding = endSnapBinding;
      }

      // Khởi tạo các đỉnh tam giác hoặc góc tam giác nội tiếp và hình học mới
      if (state.activeGeo === 'triangle' || state.activeGeo === 'isosceles-triangle') {
        newGeo.points = [
          { x: (state.geoStartPoint.x + finalEnd.x) / 2, y: state.geoStartPoint.y },
          { x: state.geoStartPoint.x, y: finalEnd.y },
          { x: finalEnd.x, y: finalEnd.y }
        ];
      } else if (state.activeGeo === 'right-triangle') {
        newGeo.points = [
          { x: state.geoStartPoint.x, y: state.geoStartPoint.y },
          { x: state.geoStartPoint.x, y: finalEnd.y },
          { x: finalEnd.x, y: finalEnd.y }
        ];
      } else if (state.activeGeo === 'rectangle') {
        newGeo.points = [
          { x: state.geoStartPoint.x, y: state.geoStartPoint.y },
          { x: finalEnd.x, y: state.geoStartPoint.y },
          { x: finalEnd.x, y: finalEnd.y },
          { x: state.geoStartPoint.x, y: finalEnd.y }
        ];
      } else if (state.activeGeo === 'square') {
        const dx = finalEnd.x - state.geoStartPoint.x;
        const dy = finalEnd.y - state.geoStartPoint.y;
        const side = Math.max(Math.abs(dx), Math.abs(dy));
        const sX = (dx >= 0 ? 1 : -1) * side;
        const sY = (dy >= 0 ? 1 : -1) * side;
        newGeo.points = [
          { x: state.geoStartPoint.x, y: state.geoStartPoint.y },
          { x: state.geoStartPoint.x + sX, y: state.geoStartPoint.y },
          { x: state.geoStartPoint.x + sX, y: state.geoStartPoint.y + sY },
          { x: state.geoStartPoint.x, y: state.geoStartPoint.y + sY }
        ];
      } else if (state.activeGeo === 'parallelogram') {
        const dx = finalEnd.x - state.geoStartPoint.x;
        const dy = finalEnd.y - state.geoStartPoint.y;
        const skew = dx * 0.25;
        newGeo.points = [
          { x: state.geoStartPoint.x + skew, y: state.geoStartPoint.y },
          { x: finalEnd.x, y: state.geoStartPoint.y },
          { x: finalEnd.x - skew, y: finalEnd.y },
          { x: state.geoStartPoint.x, y: finalEnd.y }
        ];
      } else if (state.activeGeo === 'rhombus') {
        const cx = (state.geoStartPoint.x + finalEnd.x) / 2;
        const cy = (state.geoStartPoint.y + finalEnd.y) / 2;
        const rx = Math.abs(finalEnd.x - state.geoStartPoint.x) / 2;
        const ry = Math.abs(finalEnd.y - state.geoStartPoint.y) / 2;
        newGeo.points = [
          { x: cx, y: cy - ry },
          { x: cx + rx, y: cy },
          { x: cx, y: cy + ry },
          { x: cx - rx, y: cy }
        ];
      } else if (state.activeGeo === 'ellipse') {
        const dragDist = Math.hypot(finalEnd.x - state.geoStartPoint.x, finalEnd.y - state.geoStartPoint.y);
        const inA = ellipseAxisAInput ? (parseFloat(ellipseAxisAInput.value) || 60) : 60;
        const inB = ellipseAxisBInput ? (parseFloat(ellipseAxisBInput.value) || 40) : 40;
        if (dragDist < 6) {
          // Click đơn: dùng số đo 2 bán trục đã nhập trước
          newGeo.start = { x: state.geoStartPoint.x, y: state.geoStartPoint.y };
          newGeo.rx = inA;
          newGeo.ry = inB;
        } else {
          // Kéo chuột: tính bán trục từ hộp bao
          const cx = (state.geoStartPoint.x + finalEnd.x) / 2;
          const cy = (state.geoStartPoint.y + finalEnd.y) / 2;
          const rx = Math.max(5, Math.abs(finalEnd.x - state.geoStartPoint.x) / 2);
          const ry = Math.max(5, Math.abs(finalEnd.y - state.geoStartPoint.y) / 2);
          newGeo.start = { x: cx, y: cy };
          newGeo.rx = rx;
          newGeo.ry = ry;
          if (ellipseAxisAInput) ellipseAxisAInput.value = Math.round(rx);
          if (ellipseAxisBInput) ellipseAxisBInput.value = Math.round(ry);
        }
      } else if (state.activeGeo === 'inscribed-triangle') {
        newGeo.angles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
      } else if (state.activeGeo === 'two-tangents') {
        const d = Math.hypot(finalEnd.x - state.geoStartPoint.x, finalEnd.y - state.geoStartPoint.y);
        newGeo.radius = Math.max(35, Math.min(130, d * 0.45));
      } else if (isSolidShape(state.activeGeo)) {
        const solidData = computeSolidShapeData(state.activeGeo, state.geoStartPoint, finalEnd);
        newGeo.points = solidData.points;
        newGeo.edges = solidData.edges;
        newGeo.is3D = true;
      }

      ensureElementId(newGeo);
      if (state.activeGeo === 'line') {
        const snapParents = [state.geoStartSnapEl, endSnapEl].filter(Boolean);
        if (snapParents.length > 0) {
          linkGroupMulti(snapParents, newGeo);
        }
      } else if (state.activeGeo === 'circle' && state.geoStartSnapEl) {
        linkGroup(state.geoStartSnapEl, newGeo);
      }
      state.geoStartSnapEl = null;
      state.geoStartSnapBinding = null;

      pushNewElement(newGeo);
      state.geoStartPoint = null;
      state.hoverSnapPoint = null;
      finishGeoTask(newGeo);
    } else if (state.activeTool === 'pen' || state.activeTool === 'highlighter') {
      if (state.currentPath && state.currentPath.length > 0) {
        pushNewElement({
          type: 'stroke',
          tool: state.activeTool,
          points: [...state.currentPath],
          color: state.color,
          width: state.strokeWidth,
          dash: state.dashStyle
        });
      }
      state.currentPath = [];
    }
    renderPage();
  }

  function handlePointerLeave(e) {
    if (state.hoverPointTarget || state.hoverSnapPoint || state.eraserCursorPoint || state.hoverHandle || state.hoverElement) {
      state.hoverPointTarget = null;
      state.hoverSnapPoint = null;
      state.eraserCursorPoint = null;
      state.hoverHandle = null;
      state.hoverElement = null;
      renderPage(state.currentPage);
    }
  }

  function attachCanvasEvents(targetCanvas) {
    if (!targetCanvas || targetCanvas.__eventsAttached) return;
    targetCanvas.__eventsAttached = true;
    targetCanvas.addEventListener('pointerdown', handlePointerDown);
    targetCanvas.addEventListener('pointermove', handlePointerMove);
    targetCanvas.addEventListener('pointerup', finishDrawing);
    targetCanvas.addEventListener('pointercancel', finishDrawing);
    targetCanvas.addEventListener('pointerleave', handlePointerLeave);
    targetCanvas.addEventListener('dblclick', (e) => {
      const point = getCanvasCoordinates(e);
      const el = findElementAt(point.x, point.y);
      if (el && el.type === 'graph-widget' && window.__GraphWidget) {
        window.__GraphWidget.openGraphSettingsModal(el, (updated) => {
          const before = JSON.parse(JSON.stringify(el));
          Object.assign(el, updated);
          pushCommand({
            type: 'modify-element',
            element: el,
            before: before,
            after: JSON.parse(JSON.stringify(el))
          });
          renderPage();
          showPageToast('📈 Đã cập nhật đồ thị hàm số!');
        });
      }
    });
  }

  document.querySelectorAll('canvas.main-canvas, #main-canvas').forEach(c => {
    attachCanvasEvents(c);
  });

  // Xóa nét gần vị trí con trỏ (chế độ xóa hết đối tượng)
  function eraseElementAt(x, y) {
    const list = state.pages[state.currentPage] || [];
    const el = findElementAt(x, y);
    if (el) {
      // Nếu đang bật "Chỉ tẩy dạ quang", bỏ qua nét mực thường và hình học
      if (state.eraseHighlighterOnly && el.tool !== 'highlighter') {
        return;
      }
      const idx = list.indexOf(el);
      if (idx !== -1) {
        list.splice(idx, 1);
        if (state.selectedElement === el) state.selectedElement = null;
        pushCommand({
          type: 'erase',
          element: el,
          index: idx
        });
        state.eraserDragModified = true;
        renderPage();
      }
    }
  }

  // Xóa một phần nhỏ nét vẽ khi đưa tẩy đến (chế độ tẩy phân đoạn / từng tí)
  function erasePartialAt(x, y, radius = 12) {
    const list = state.pages[state.currentPage] || [];
    let modified = false;

    for (let i = list.length - 1; i >= 0; i--) {
      const el = list[i];
      if (!el) continue;

      // Nếu đang bật "Chỉ tẩy dạ quang", chỉ tác động lên nét bút dạ quang
      if (state.eraseHighlighterOnly && el.tool !== 'highlighter') {
        continue;
      }

      if (el.type === 'stroke') {
        // Tối ưu hóa cực nhanh: Kiểm tra nhanh hộp bao (Bounding Box) trước khi duyệt từng điểm
        if (!el._bbox && el.points && el.points.length > 0) {
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          for (let pIdx = 0; pIdx < el.points.length; pIdx++) {
            const pt = el.points[pIdx];
            if (pt.x < minX) minX = pt.x;
            if (pt.x > maxX) maxX = pt.x;
            if (pt.y < minY) minY = pt.y;
            if (pt.y > maxY) maxY = pt.y;
          }
          el._bbox = { minX, maxX, minY, maxY };
        }
        if (el._bbox) {
          const pad = radius + (el.width || 2) + 2;
          if (x < el._bbox.minX - pad || x > el._bbox.maxX + pad ||
              y < el._bbox.minY - pad || y > el._bbox.maxY + pad) {
            continue; // Nằm ngoài phạm vi -> bỏ qua tức thì (0ms)!
          }
        }

        // Kiểm tra xem đầu tẩy có chạm vào nét vẽ không (chuẩn xác theo vòng tròn tẩy)
        let touches = false;
        const hitR = radius + Math.min(0.5, (el.width || 2) / 4);
        for (let j = 0; j < el.points.length; j++) {
          if (Math.hypot(el.points[j].x - x, el.points[j].y - y) <= hitR) {
            touches = true;
            break;
          }
          if (j < el.points.length - 1) {
            if (distToSegment(x, y, el.points[j].x, el.points[j].y, el.points[j + 1].x, el.points[j + 1].y) <= hitR) {
              touches = true;
              break;
            }
          }
        }

        if (touches) {
          // Làm mịn các đoạn dài với bước nhảy siêu nhỏ 1px để vết cắt tẩy tròn đẹp, chính xác
          const densePoints = [];
          for (let j = 0; j < el.points.length; j++) {
            const p1 = el.points[j];
            densePoints.push(p1);
            if (j < el.points.length - 1) {
              const p2 = el.points[j + 1];
              const segLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
              if (segLen > 1.0) {
                const steps = Math.ceil(segLen / 1.0);
                for (let s = 1; s < steps; s++) {
                  const t = s / steps;
                  densePoints.push({
                    x: p1.x + t * (p2.x - p1.x),
                    y: p1.y + t * (p2.y - p1.y),
                    pressure: (p1.pressure || 0.5) * (1 - t) + (p2.pressure || 0.5) * t
                  });
                }
              }
            }
          }

          // Phân tách các điểm còn nằm ngoài bán kính tẩy thành các nét con
          const subStrokes = [];
          let currentRun = [];
          for (let j = 0; j < densePoints.length; j++) {
            const pt = densePoints[j];
            if (Math.hypot(pt.x - x, pt.y - y) > radius) {
              currentRun.push(pt);
            } else {
              if (currentRun.length >= 2) {
                subStrokes.push({
                  type: 'stroke',
                  tool: el.tool,
                  points: currentRun,
                  color: el.color,
                  width: el.width,
                  dash: el.dash
                });
              }
              currentRun = [];
            }
          }
          if (currentRun.length >= 2) {
            subStrokes.push({
              type: 'stroke',
              tool: el.tool,
              points: currentRun,
              color: el.color,
              width: el.width,
              dash: el.dash
            });
          }

          if (state.selectedElement === el) state.selectedElement = null;
          list.splice(i, 1, ...subStrokes);
          modified = true;
          state.eraserDragModified = true;
        }
      } else if (el.type === 'geo' && isSolidShape(el.shape) && el.edges && el.points) {
        // Hỗ trợ xóa từng cạnh của hình học không gian (Tứ diện, hình chóp các loại)
        let edgeRemoved = false;
        const newEdges = [];
        const hitR = radius + Math.min(0.5, (el.width || 2) / 4);
        for (let eIdx = 0; eIdx < el.edges.length; eIdx++) {
          const edge = el.edges[eIdx];
          const p1 = el.points[edge[0]];
          const p2 = el.points[edge[1]];
          if (p1 && p2 && distToSegment(x, y, p1.x, p1.y, p2.x, p2.y) <= hitR) {
            edgeRemoved = true;
          } else {
            newEdges.push(edge);
          }
        }
        if (edgeRemoved) {
          if (newEdges.length === 0) {
            list.splice(i, 1);
          } else {
            el.edges = newEdges;
          }
          if (state.selectedElement === el) state.selectedElement = null;
          modified = true;
          state.eraserDragModified = true;
        }
      } else if (el.type === 'geo' && el.points && el.points.length >= 3) {
        // Hỗ trợ xóa từng cạnh của đa giác phẳng (tam giác, hình chữ nhật, hình bình hành...)
        let edgeTouched = false;
        const n = el.points.length;
        const remainingEdges = [];
        const hitR = radius + Math.min(0.5, (el.width || 2) / 4);
        for (let j = 0; j < n; j++) {
          const p1 = el.points[j];
          const p2 = el.points[(j + 1) % n];
          if (distToSegment(x, y, p1.x, p1.y, p2.x, p2.y) <= hitR) {
            edgeTouched = true;
          } else {
            remainingEdges.push({ start: { x: p1.x, y: p1.y }, end: { x: p2.x, y: p2.y } });
          }
        }
        if (edgeTouched) {
          const replacementLines = remainingEdges.map(edge => ({
            type: 'geo',
            shape: 'line',
            start: edge.start,
            end: edge.end,
            color: el.color,
            width: el.width,
            dash: el.dash
          }));
          list.splice(i, 1, ...replacementLines);
          if (state.selectedElement === el) state.selectedElement = null;
          modified = true;
          state.eraserDragModified = true;
        }
      } else if (el.type === 'geo' && (el.shape === 'line' || el.shape === 'perpendicular' || el.shape === 'parallel' || el.shape === 'bisector' || el.shape === 'tangent')) {
        // Hỗ trợ cắt gọt phân đoạn cho đoạn thẳng và các đường hình học
        const hitR = radius + Math.min(0.5, (el.width || 2) / 4);
        if (distToSegment(x, y, el.start.x, el.start.y, el.end.x, el.end.y) <= hitR) {
          const segLen = Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
          const steps = Math.max(20, Math.ceil(segLen / 1.0));
          const densePoints = [];
          for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            densePoints.push({
              x: el.start.x + t * (el.end.x - el.start.x),
              y: el.start.y + t * (el.end.y - el.start.y),
              pressure: 0.5
            });
          }
          const subStrokes = [];
          let currentRun = [];
          for (let j = 0; j < densePoints.length; j++) {
            const pt = densePoints[j];
            if (Math.hypot(pt.x - x, pt.y - y) > radius) {
              currentRun.push(pt);
            } else {
              if (currentRun.length >= 2) {
                subStrokes.push({
                  type: 'stroke',
                  tool: 'pen',
                  points: currentRun,
                  color: el.color,
                  width: el.width,
                  dash: el.dash
                });
              }
              currentRun = [];
            }
          }
          if (currentRun.length >= 2) {
            subStrokes.push({
              type: 'stroke',
              tool: 'pen',
              points: currentRun,
              color: el.color,
              width: el.width,
              dash: el.dash
            });
          }
          if (state.selectedElement === el) state.selectedElement = null;
          list.splice(i, 1, ...subStrokes);
          modified = true;
          state.eraserDragModified = true;
        }
      } else if (el.type === 'geo' && el.shape === 'angle') {
        // Xóa góc khi chạm vào đỉnh hoặc một trong hai tia
        const rad = ((el.angleDeg || 60) * Math.PI) / 180;
        const armLen = el.armLength || 65;
        const baseDir = (el.baseDir !== undefined) ? el.baseDir : Math.atan2(el.end.y - el.start.y, el.end.x - el.start.x);
        const dir = (el.direction !== undefined) ? el.direction : ((el.binding && el.binding.direction !== undefined) ? el.binding.direction : -1);
        const p2 = el.secondPoint || {
          x: el.start.x + armLen * Math.cos(baseDir + dir * rad),
          y: el.start.y + armLen * Math.sin(baseDir + dir * rad)
        };
        const hitArm1 = !el.onlySecondArm && distToSegment(x, y, el.start.x, el.start.y, el.end.x, el.end.y) <= radius + 3;
        const hitArm2 = distToSegment(x, y, el.start.x, el.start.y, p2.x, p2.y) <= radius + 3;
        if (hitArm1 || hitArm2 || Math.hypot(x - el.start.x, y - el.start.y) <= radius + 3) {
          list.splice(i, 1);
          if (state.selectedElement === el) state.selectedElement = null;
          modified = true;
          state.eraserDragModified = true;
        }
      } else if (el.type === 'geo' && (el.shape === 'circle' || el.shape === 'two-tangents' || el.shape === 'inscribed-triangle')) {
        const r = el.radius || Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
        const d = Math.hypot(x - el.start.x, y - el.start.y);
        if (Math.abs(d - r) <= radius + (el.width || 2) / 2 || d <= radius + 4) {
          list.splice(i, 1);
          if (state.selectedElement === el) state.selectedElement = null;
          modified = true;
          state.eraserDragModified = true;
        }
      } else if (el.type === 'geo' && el.shape === 'ellipse') {
        const rx = el.rx || 60;
        const ry = el.ry || 40;
        const dx = x - el.start.x;
        const dy = y - el.start.y;
        const norm = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
        if (Math.abs(Math.sqrt(norm) - 1) <= (radius + 4) / Math.min(rx, ry)) {
          list.splice(i, 1);
          if (state.selectedElement === el) state.selectedElement = null;
          modified = true;
          state.eraserDragModified = true;
        }
      } else if (el.type === 'geo' && el.shape === 'point') {
        if (Math.hypot(el.start.x - x, el.start.y - y) <= radius + 5) {
          list.splice(i, 1);
          if (state.selectedElement === el) state.selectedElement = null;
          modified = true;
          state.eraserDragModified = true;
        }
      } else if (el.type === 'text') {
        if (Math.hypot(el.x - x, el.y - y) <= radius + 15) {
          list.splice(i, 1);
          if (state.selectedElement === el) state.selectedElement = null;
          modified = true;
          state.eraserDragModified = true;
        }
      }
    }

    if (modified) {
      renderPage();
    }
  }

  // 6. Quản lý Hoàn tác & Làm lại (Undo / Redo với Command Pattern)
  function pushCommand(cmd) {
    const page = state.currentPage;
    if (!state.undoStacks[page]) state.undoStacks[page] = [];
    state.undoStacks[page].push(cmd);
    state.redoStacks[page] = []; // Xóa redo khi có thao tác mới
    updateUndoState();
    if (typeof markUnsaved === 'function') markUnsaved();
  }

  function pushNewElement(element) {
    if (!state.pages[state.currentPage]) state.pages[state.currentPage] = [];
    state.pages[state.currentPage].push(element);
    pushCommand({
      type: 'add',
      element: element
    });
  }

  function undo() {
    const page = state.currentPage;
    const undoStack = state.undoStacks[page];
    const elements = state.pages[page];

    if (undoStack && undoStack.length > 0) {
      const cmd = undoStack.pop();
      if (!state.redoStacks[page]) state.redoStacks[page] = [];
      state.redoStacks[page].push(cmd);

      if (cmd.type === 'add') {
        const idx = elements.indexOf(cmd.element);
        if (idx !== -1) elements.splice(idx, 1);
        if (state.selectedElements) {
          const sIdx = state.selectedElements.indexOf(cmd.element);
          if (sIdx !== -1) state.selectedElements.splice(sIdx, 1);
        }
        if (state.selectedElement === cmd.element) {
          state.selectedElement = (state.selectedElements && state.selectedElements.length > 0) ? state.selectedElements[0] : null;
        }
      } else if (cmd.type === 'move') {
        translateElement(cmd.element, -cmd.dx, -cmd.dy);
      } else if (cmd.type === 'move-multiple') {
        const movedSet = new Set();
        for (const el of cmd.elements) {
          translateElement(el, -cmd.dx, -cmd.dy, movedSet);
        }
      } else if (cmd.type === 'erase') {
        elements.splice(cmd.index, 0, cmd.element);
      } else if (cmd.type === 'page-replace') {
        state.pages[page] = [...cmd.before];
        if (state.selectedElements) {
          state.selectedElements = state.selectedElements.filter(el => state.pages[page].includes(el));
          state.selectedElement = state.selectedElements.length > 0 ? state.selectedElements[0] : null;
        }
      } else if (cmd.type === 'resize-image') {
        cmd.element.x = cmd.before.x;
        cmd.element.y = cmd.before.y;
        cmd.element.width = cmd.before.width;
        cmd.element.height = cmd.before.height;
      } else if (cmd.type === 'modify-element') {
        Object.assign(cmd.element, JSON.parse(JSON.stringify(cmd.before)));
        updateDependentBindings(cmd.element);
      } else if (cmd.type === 'modify-element-group') {
        Object.assign(cmd.element, JSON.parse(JSON.stringify(cmd.before)));
        if (cmd.dependents) {
          for (const dep of cmd.dependents) {
            Object.assign(dep.element, JSON.parse(JSON.stringify(dep.before)));
          }
        }
        updateDependentBindings(cmd.element);
      }

      renderPage();
      updateUndoState();
    }
  }

  function redo() {
    const page = state.currentPage;
    const redoStack = state.redoStacks[page];
    const elements = state.pages[page];

    if (redoStack && redoStack.length > 0) {
      const cmd = redoStack.pop();
      if (!state.undoStacks[page]) state.undoStacks[page] = [];
      state.undoStacks[page].push(cmd);

      if (cmd.type === 'add') {
        elements.push(cmd.element);
      } else if (cmd.type === 'move') {
        translateElement(cmd.element, cmd.dx, cmd.dy);
      } else if (cmd.type === 'move-multiple') {
        const movedSet = new Set();
        for (const el of cmd.elements) {
          translateElement(el, cmd.dx, cmd.dy, movedSet);
        }
      } else if (cmd.type === 'erase') {
        const idx = elements.indexOf(cmd.element);
        if (idx !== -1) elements.splice(idx, 1);
        if (state.selectedElements) {
          const sIdx = state.selectedElements.indexOf(cmd.element);
          if (sIdx !== -1) state.selectedElements.splice(sIdx, 1);
        }
        if (state.selectedElement === cmd.element) {
          state.selectedElement = (state.selectedElements && state.selectedElements.length > 0) ? state.selectedElements[0] : null;
        }
      } else if (cmd.type === 'page-replace') {
        state.pages[page] = [...cmd.after];
        if (state.selectedElements) {
          state.selectedElements = state.selectedElements.filter(el => state.pages[page].includes(el));
          state.selectedElement = state.selectedElements.length > 0 ? state.selectedElements[0] : null;
        }
      } else if (cmd.type === 'resize-image') {
        cmd.element.x = cmd.after.x;
        cmd.element.y = cmd.after.y;
        cmd.element.width = cmd.after.width;
        cmd.element.height = cmd.after.height;
      } else if (cmd.type === 'modify-element') {
        Object.assign(cmd.element, JSON.parse(JSON.stringify(cmd.after)));
        updateDependentBindings(cmd.element);
      } else if (cmd.type === 'modify-element-group') {
        Object.assign(cmd.element, JSON.parse(JSON.stringify(cmd.after)));
        if (cmd.dependents) {
          for (const dep of cmd.dependents) {
            Object.assign(dep.element, JSON.parse(JSON.stringify(dep.after)));
          }
        }
        updateDependentBindings(cmd.element);
      }

      renderPage();
      updateUndoState();
    }
  }

  function updateUndoState() {
    const page = state.currentPage;
    btnUndo.disabled = !(state.undoStacks[page] && state.undoStacks[page].length > 0);
    btnRedo.disabled = !(state.redoStacks[page] && state.redoStacks[page].length > 0);
  }

  btnUndo.addEventListener('click', undo);
  btnRedo.addEventListener('click', redo);

  // 7. Chuyển đổi công cụ & Thanh tùy chọn theo công cụ
  function updateContextualToolbar(tool) {
    const penSec = document.getElementById('context-pen-options');
    const selectSec = document.getElementById('context-select-options');

    // Bảng màu & nét vẽ luôn hiển thị sẵn sàng cho cả Bút, Dạ quang và Hình học
    if (penSec) penSec.style.display = 'flex';
    if (selectSec) selectSec.style.display = (tool === 'select') ? 'flex' : 'none';
  }

  // Đóng toàn bộ các menu dropdown trên toàn ứng dụng
  // Đóng toàn bộ các menu dropdown trên toàn ứng dụng
  function closeAllDropdowns() {
    document.querySelectorAll('.header-dropdown-menu, .toolbar-dropdown-menu, .context-select-menu, .geo-dropdown-menu, .bottom-dropdown-menu').forEach(menu => {
      menu.classList.remove('show');
      menu.style.display = 'none';
    });
    document.querySelectorAll('.toolbar-dropdown-container, .geo-group-dropdown, .header-dropdown-container, .bottom-dropdown-container, .context-dropdown-wrap').forEach(d => {
      d.classList.remove('open');
    });
    document.querySelectorAll('.app-header, .primary-toolbar, .app-bottombar').forEach(bar => {
      bar.classList.remove('has-dropdown-open');
    });
  }

  // Toggle dropdown menu tiện lợi
  function toggleDropdownMenu(buttonEl, menuEl) {
    if (!menuEl) return;
    const isShown = menuEl.classList.contains('show') || menuEl.style.display === 'flex';
    closeAllDropdowns();
    if (!isShown) {
      menuEl.classList.add('show');
      menuEl.style.display = 'flex';
      const container = buttonEl ? buttonEl.closest('.toolbar-dropdown-container, .geo-group-dropdown, .header-dropdown-container, .bottom-dropdown-container, .context-dropdown-wrap') : null;
      if (container) {
        container.classList.add('open');
        const parentBar = container.closest('.app-header, .primary-toolbar, .app-bottombar');
        if (parentBar) parentBar.classList.add('has-dropdown-open');
      }
    }
  }

  // Bắt sự kiện click các nút công cụ chính trên Primary Toolbar (Bấm là vẽ ngay)
  toolButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tool = btn.dataset.tool;

      // Nếu bấm vào nút Bút (hoặc chevron của nút Bút)
      const chevron = e.target.closest('.tool-chevron');
      if (tool === 'pen') {
        const menuPen = document.getElementById('menu-pen-cluster');
        const isPenActive = (state.activeTool === 'pen' || state.activeTool === 'highlighter');
        if (chevron || isPenActive) {
          e.stopPropagation();
          toggleDropdownMenu(btn, menuPen);
          return;
        }
      }

      // Nếu bấm vào chevron của nút Tẩy thì toggle menu chọn chế độ tẩy
      if (chevron && tool === 'eraser') {
        e.stopPropagation();
        const menu = document.getElementById('menu-eraser');
        toggleDropdownMenu(btn, menu);
        return;
      }

      toolButtons.forEach(b => b.classList.remove('active'));
      geoButtons.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.geo-group-btn').forEach(gb => gb.classList.remove('active'));
      closeAllDropdowns();
      resetGeoDropdownLabels();

      btn.classList.add('active');
      state.activeTool = tool;
      state.activeGeo = null;

      if (tool === 'eraser') {
        if (!state.eraserMode) state.eraserMode = 'partial';
      }

      state.hoverPointTarget = null;
      state.construction = { point: null, circle: null, line: null, edges: [] };
      state.pendingConstruction = null;

      const toolNames = {
        pen: 'Bút viết',
        highlighter: 'Dạ quang',
        eraser: state.eraserMode === 'partial' ? 'Tẩy từng tí' : 'Tẩy cả hình',
        select: 'Chọn đối tượng',
        text: 'Chèn chữ',
        geo: 'Hình học',
        graph: 'Đồ thị'
      };

      if (state.activeTool === 'select') {
        setCanvasCursor(SHARP_ARROW_CURSOR);
        statusToolInfo.textContent = 'Công cụ: Chọn đối tượng (Nhấp để chọn đơn lẻ một đối tượng, kéo để di chuyển, Delete để xóa)';
      } else if (state.activeTool === 'eraser') {
        setCanvasCursor('crosshair');
        state.selectedElement = null;
        statusToolInfo.textContent = state.eraserMode === 'partial'
          ? 'Công cụ: Tẩy nét (Rê đầu tẩy nhỏ qua nét để cắt gọt mịn)'
          : 'Công cụ: Tẩy cả hình (Chạm vào nét hoặc hình là xóa trọn vẹn)';
        renderPage();
      } else if (state.activeTool === 'graph') {
        const pageEls = state.pages[state.currentPage] || [];
        let targetWidget = (state.selectedElement && state.selectedElement.type === 'graph-widget')
          ? state.selectedElement
          : pageEls.find(el => el && el.type === 'graph-widget');

        if (!targetWidget && window.__GraphWidget) {
          const dims = getCanvasDimensions();
          targetWidget = window.__GraphWidget.createDefaultGraphWidget(dims.width / 2, dims.height / 2);
          const beforeList = [...pageEls];
          pageEls.push(targetWidget);
          pushCommand({
            type: 'page-replace',
            before: beforeList,
            after: [...pageEls]
          });
        }

        // Chuyển sang công cụ Select và chọn widget này
        state.activeTool = 'select';
        toolButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-tool') === 'select'));
        setCanvasCursor(SHARP_ARROW_CURSOR);
        if (targetWidget) {
          setSelectedElements([targetWidget]);
          renderPage();

          if (window.__GraphWidget) {
            window.__GraphWidget.openGraphSettingsModal(targetWidget, (updated) => {
              const before = JSON.parse(JSON.stringify(targetWidget));
              Object.assign(targetWidget, updated);
              pushCommand({
                type: 'modify-element',
                element: targetWidget,
                before: before,
                after: JSON.parse(JSON.stringify(targetWidget))
              });
              renderPage();
              showPageToast('📈 Đã cập nhật đồ thị hàm số!');
            });
          }
        }
        return;
      } else {
        setCanvasCursor('crosshair');
        state.selectedElement = null;
        statusToolInfo.textContent = `Công cụ: ${toolNames[state.activeTool] || state.activeTool} (Màu: ${state.color}, Nét: ${state.strokeWidth}px)`;
        renderPage();
      }

      updateContextualToolbar(state.activeTool);
    });
  });

  // Quản lý chuyển đổi chế độ Bút mực / Bút dạ quang trong dropdown Bút ▾
  function setPenToolMode(mode) {
    const penIconSlot = document.getElementById('pen-icon-slot');
    const labelPenMain = document.getElementById('label-pen-main');
    const btnPenTypePenEl = document.getElementById('btn-pen-type-pen');
    const btnPenTypeHighlighterEl = document.getElementById('btn-pen-type-highlighter');
    const toolPen = document.getElementById('tool-pen');

    if (mode === 'highlighter') {
      state.activeTool = 'highlighter';
      if (labelPenMain) labelPenMain.textContent = 'Dạ quang';
      if (penIconSlot) {
        penIconSlot.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 11-6 6v3h3l6-6"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>';
      }
      if (btnPenTypeHighlighterEl) btnPenTypeHighlighterEl.classList.add('active');
      if (btnPenTypePenEl) btnPenTypePenEl.classList.remove('active');
      if (toolPen) toolPen.title = 'Bút dạ quang đánh dấu (Phím H) / Nhấp để chọn loại bút, màu và nét';
    } else {
      state.activeTool = 'pen';
      if (labelPenMain) labelPenMain.textContent = 'Bút';
      if (penIconSlot) {
        penIconSlot.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>';
      }
      if (btnPenTypePenEl) btnPenTypePenEl.classList.add('active');
      if (btnPenTypeHighlighterEl) btnPenTypeHighlighterEl.classList.remove('active');
      if (toolPen) toolPen.title = 'Bút vẽ (Phím B) / Nhấp để chọn loại bút, màu và nét';
    }

    state.activeGeo = null;
    state.selectedElement = null;
    setCanvasCursor('crosshair');

    toolButtons.forEach(b => b.classList.remove('active'));
    if (toolPen) toolPen.classList.add('active');
    statusToolInfo.textContent = `Công cụ: ${state.activeTool === 'highlighter' ? 'Dạ quang' : 'Bút viết'} (Màu: ${state.color}, Nét: ${state.strokeWidth}px)`;
    renderPage();
  }

  const btnPenTypePen = document.getElementById('btn-pen-type-pen');
  const btnPenTypeHighlighter = document.getElementById('btn-pen-type-highlighter');

  if (btnPenTypePen) {
    btnPenTypePen.addEventListener('click', (e) => {
      e.stopPropagation();
      setPenToolMode('pen');
    });
  }

  if (btnPenTypeHighlighter) {
    btnPenTypeHighlighter.addEventListener('click', (e) => {
      e.stopPropagation();
      setPenToolMode('highlighter');
    });
  }

  // Chọn độ dày nét bên trong dropdown Bút ▾
  document.querySelectorAll('.pen-size-row').forEach(row => {
    row.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.pen-size-row').forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      state.strokeWidth = parseFloat(row.dataset.size);
      state.eraserRadius = Math.max(2.5, Math.min(5.5, Math.round(state.strokeWidth * 1.1 * 10) / 10));
      statusToolInfo.textContent = `Công cụ: ${state.activeTool === 'highlighter' ? 'Dạ quang' : 'Bút viết'} (Màu: ${state.color}, Nét: ${state.strokeWidth}px)`;
    });
  });

  // Chọn kiểu nét (Liền / Đứt) bên trong dropdown Bút ▾
  document.querySelectorAll('.pen-dash-segmented .style-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.pen-dash-segmented .style-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.dashStyle = btn.dataset.dash;
    });
  });

  // Dropdown Tẩy ▾ (Tẩy từng tí, Tẩy cả hình, Xóa toàn bộ hình trên trang)
  const menuEraser = document.getElementById('menu-eraser');
  const btnEraserPartial = document.getElementById('btn-eraser-partial');
  const btnEraserObject = document.getElementById('btn-eraser-object');
  const btnClearCanvasFromEraser = document.getElementById('btn-clear-canvas-from-eraser');
  const labelEraser = document.getElementById('label-eraser');

  if (btnEraserPartial) {
    btnEraserPartial.addEventListener('click', (e) => {
      e.stopPropagation();
      state.eraserMode = 'partial';
      if (labelEraser) labelEraser.textContent = 'Tẩy (Từng tí)';
      btnEraserPartial.classList.add('active');
      if (btnEraserObject) btnEraserObject.classList.remove('active');
      closeAllDropdowns();
      const toolEraser = document.getElementById('tool-eraser');
      if (toolEraser) toolEraser.click();
    });
  }

  if (btnEraserObject) {
    btnEraserObject.addEventListener('click', (e) => {
      e.stopPropagation();
      state.eraserMode = 'object';
      if (labelEraser) labelEraser.textContent = 'Tẩy (Cả hình)';
      btnEraserObject.classList.add('active');
      if (btnEraserPartial) btnEraserPartial.classList.remove('active');
      closeAllDropdowns();
      const toolEraser = document.getElementById('tool-eraser');
      if (toolEraser) toolEraser.click();
    });
  }

  if (btnClearCanvasFromEraser) {
    btnClearCanvasFromEraser.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      if (confirm('Bạn có chắc muốn xóa toàn bộ hình vẽ và ghi chú trên trang hiện tại?')) {
        const beforePage = [...(state.pages[state.currentPage] || [])];
        state.pages[state.currentPage] = [];
        pushCommand({
          type: 'page-replace',
          before: beforePage,
          after: []
        });
        renderPage();
        showPageToast('🗑️ Đã xóa sạch toàn bộ nội dung trang!');
      }
    });
  }

  // Dropdown Hình học ▾ (Hình học phẳng / Hình học không gian)
  const menuGeoMode = document.getElementById('menu-geometry-mode');
  const btnGeoModePlane = document.getElementById('btn-geomode-plane');
  const btnGeoModeSpace = document.getElementById('btn-geomode-space');
  const labelGeoMain = document.getElementById('label-geo-main');

  if (btnGeoModePlane) {
    btnGeoModePlane.addEventListener('click', (e) => {
      e.stopPropagation();
      btnGeoModePlane.classList.add('active');
      if (btnGeoModeSpace) btnGeoModeSpace.classList.remove('active');
      if (labelGeoMain) labelGeoMain.textContent = 'Hình học phẳng';
      closeAllDropdowns();
      const toolGeo = document.getElementById('tool-geo-main');
      if (toolGeo) toolGeo.click();
    });
  }

  if (btnGeoModeSpace) {
    btnGeoModeSpace.addEventListener('click', (e) => {
      e.stopPropagation();
      btnGeoModeSpace.classList.add('active');
      if (btnGeoModePlane) btnGeoModePlane.classList.remove('active');
      if (labelGeoMain) labelGeoMain.textContent = 'Hình không gian';
      closeAllDropdowns();
      showPageToast('📐 Chế độ Hình học không gian (Hình chóp, lăng trụ, nón, cầu...)');
      const toolGeo = document.getElementById('tool-geo-main');
      if (toolGeo) toolGeo.click();
    });
  }

  // Hàm dùng chung cập nhật thông tin và hướng dẫn công cụ hình học
  function activateGeoTool(geoName, targetGroupBtn, targetItemBtn) {
    if (!geoName) return;

    const isConstructionTask = ['bisector', 'perpendicular', 'parallel', 'tangent', 'two-tangents', 'angle', 'intersection'].includes(geoName);

    // 1. Tắt trạng thái active ở các công cụ khác
    toolButtons.forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.geo-group-btn').forEach(gb => gb.classList.remove('active'));

    if (targetItemBtn) {
      const parentMenu = targetItemBtn.closest('.geo-dropdown-menu');
      if (parentMenu) {
        parentMenu.querySelectorAll('.geo-btn').forEach(b => b.classList.remove('active'));
        targetItemBtn.classList.add('active');
      }
      // Cập nhật biểu tượng và nhãn hiển thị trên nút nhóm cha
      if (targetGroupBtn) {
        const itemSvg = targetItemBtn.querySelector('svg');
        const groupIcon = targetGroupBtn.querySelector('.geo-group-icon');
        if (itemSvg && groupIcon) groupIcon.innerHTML = itemSvg.outerHTML;
        const itemSpan = targetItemBtn.querySelector('span');
        const groupLabel = targetGroupBtn.querySelector('.geo-group-label');
        if (itemSpan && groupLabel) groupLabel.textContent = itemSpan.textContent.trim();
      }
    }

    // NẾU LÀ CÁC TÁC VỤ DỰNG HÌNH: PHÂN GIÁC, VUÔNG GÓC, SONG SONG, TIẾP TUYẾN, 2 TIẾP TUYẾN, CHỌN GÓC, GIAO ĐIỂM
    // Thực hiện đúng quy trình 4 bước theo yêu cầu:
    // 1. Chọn 1 tác vụ -> 2. Chuyển sang chế độ "Chọn" -> 3. Chọn điểm/đường rồi chọn đối tượng còn lại -> 4. Thực hiện tác vụ
    if (isConstructionTask) {
      const toolSelect = document.getElementById('tool-select');
      if (toolSelect) toolSelect.classList.add('active');
      state.activeTool = 'select';
      state.activeGeo = geoName;
      state.pendingConstruction = geoName;
      state.hoverPointTarget = null;
      state.construction = { point: null, circle: null, line: null, edges: [], firstObject: null };
      setCanvasCursor(SHARP_ARROW_CURSOR);

      if (state.activeGeo === 'perpendicular') {
        statusToolInfo.textContent = 'Vuông góc: Bấm chọn 1 điểm (hoặc đường), rồi tiếp tục chọn đối tượng còn lại để thực hiện tác vụ';
      } else if (state.activeGeo === 'parallel') {
        statusToolInfo.textContent = 'Song song: Bấm chọn 1 điểm (hoặc đường), rồi tiếp tục chọn đối tượng còn lại để thực hiện tác vụ';
      } else if (state.activeGeo === 'bisector') {
        statusToolInfo.textContent = 'Phân giác: Bấm chọn cạnh thứ nhất (hoặc 1 đỉnh tam giác), rồi chọn tiếp cạnh thứ 2 để thực hiện tác vụ';
      } else if (state.activeGeo === 'angle') {
        statusToolInfo.textContent = 'Chọn góc: Bấm chọn 1 đường (hoặc đỉnh), rồi chọn đối tượng còn lại để thực hiện tác vụ';
      } else if (state.activeGeo === 'tangent') {
        statusToolInfo.textContent = 'Tiếp tuyến: Bấm chọn 1 điểm (trên hoặc ngoài đường tròn), rồi chọn đường tròn để thực hiện tác vụ';
      } else if (state.activeGeo === 'two-tangents') {
        statusToolInfo.textContent = '2 tiếp tuyến: Bấm chọn 1 điểm ngoài đường tròn, rồi chọn đường tròn để thực hiện tác vụ';
      } else if (state.activeGeo === 'intersection') {
        statusToolInfo.textContent = 'Giao điểm: Bấm chọn đường thứ nhất (hoặc đường tròn), rồi chọn tiếp hình thứ 2 để xác định giao điểm';
      }

      showPageToast('🎯 Đã chuyển sang chế độ Chọn: Bấm chọn các đối tượng trên bảng vẽ');
      updateContextualToolbar('select');
      renderPage();
      return;
    }

    if (targetGroupBtn) targetGroupBtn.classList.add('active');

    // 2. Kích hoạt trạng thái hình học vẽ tự do thông thường
    state.activeTool = 'geo';
    state.activeGeo = geoName;
    state.pendingConstruction = null;
    state.hoverPointTarget = null;
    state.construction = { point: null, circle: null, line: null, edges: [] };

    // 3. Con trỏ chuột phù hợp
    if (state.activeGeo === 'midpoint') {
      setCanvasCursor(SHARP_ARROW_CURSOR);
    } else {
      setCanvasCursor('crosshair');
    }

    // 4. Hướng dẫn chi tiết trên thanh trạng thái
    if (state.activeGeo === 'midpoint') {
      statusToolInfo.textContent = 'Trung điểm: Bấm chọn điểm thứ 1, sau đó chọn điểm thứ 2 (hoặc điểm Cmd điểm) để hiển thị trung điểm';
    } else if (state.activeGeo === 'point') {
      statusToolInfo.textContent = 'Điểm: Nhấp vào vị trí bất kỳ để tạo điểm hình học';
    } else if (state.activeGeo === 'line') {
      setSelectedElements([]);
      statusToolInfo.textContent = 'Đoạn thẳng: Kéo từ điểm này sang điểm kia (bắt dính điểm/chu vi)';
    } else if (state.activeGeo === 'rectangle') {
      statusToolInfo.textContent = 'Hình chữ nhật: Kéo chuột để vẽ hình chữ nhật góc vuông chuẩn';
    } else if (state.activeGeo === 'square') {
      statusToolInfo.textContent = 'Hình vuông: Kéo chuột để vẽ hình vuông đều 4 cạnh';
    } else if (state.activeGeo === 'parallelogram') {
      statusToolInfo.textContent = 'Hình bình hành: Kéo chuột để vẽ hình bình hành (2 cặp cạnh đối song song)';
    } else if (state.activeGeo === 'rhombus') {
      statusToolInfo.textContent = 'Hình thoi: Kéo chuột để vẽ hình thoi (4 cạnh bằng nhau, 2 đường chéo vuông góc)';
    } else if (state.activeGeo === 'circle') {
      statusToolInfo.textContent = 'Đường tròn: Kéo chuột từ tâm ra ngoài để định bán kính';
    } else if (state.activeGeo === 'ellipse') {
      if (ellipseAxesContainer) ellipseAxesContainer.style.display = 'inline-flex';
      statusToolInfo.textContent = 'Elip: Kéo để vẽ elip hoặc nhập số đo bán trục a, b trên thanh công cụ rồi click để tạo ngay';
    } else if (state.activeGeo === 'triangle') {
      statusToolInfo.textContent = 'Tam giác: Kéo chuột để định kích thước tam giác';
    } else if (state.activeGeo === 'right-triangle') {
      statusToolInfo.textContent = 'Tam giác vuông: Kéo chuột để vẽ tam giác vuông chuẩn';
    } else if (state.activeGeo === 'isosceles-triangle') {
      statusToolInfo.textContent = 'Tam giác cân: Kéo chuột để vẽ tam giác cân đối xứng';
    } else if (state.activeGeo === 'inscribed-triangle') {
      statusToolInfo.textContent = 'Tam giác nội tiếp: Kéo chuột để vẽ tam giác nội tiếp đường tròn';
    } else if (state.activeGeo === 'tetrahedron') {
      statusToolInfo.textContent = 'Tứ diện: Kéo chuột để vẽ hình tứ diện S.ABC (đáy tam giác, nét đứt phối cảnh SGK)';
    } else if (state.activeGeo === 'pyramid-quad') {
      statusToolInfo.textContent = 'Hình chóp tứ giác: Kéo chuột để vẽ hình chóp S.ABCD (nét đứt phối cảnh SGK)';
    } else if (state.activeGeo === 'pyramid-trapezoid') {
      statusToolInfo.textContent = 'Hình chóp đáy hình thang: Kéo chuột để vẽ hình chóp S.ABCD đáy hình thang (đáy lớn nét đứt)';
    } else if (state.activeGeo === 'pyramid-parallelogram') {
      statusToolInfo.textContent = 'Hình chóp đáy hình bình hành: Kéo chuột để vẽ hình chóp S.ABCD đáy hình bình hành';
    } else if (state.activeGeo === 'pyramid-pentagon') {
      statusToolInfo.textContent = 'Hình chóp đáy ngũ giác: Kéo chuột để vẽ hình chóp S.ABCDE đáy ngũ giác';
    } else if (state.activeGeo === 'pyramid-regular') {
      statusToolInfo.textContent = 'Hình chóp tứ giác đều: Kéo chuột để vẽ hình chóp đều S.ABCD (đường cao SO ⟂ đáy)';
    } else {
      statusToolInfo.textContent = `Hình học: ${geoName} (Màu: ${state.color})`;
    }

    if (state.activeGeo !== 'ellipse' && ellipseAxesContainer) {
      const isSingleEllipse = state.selectedElements && state.selectedElements.length === 1 && state.selectedElements[0].shape === 'ellipse';
      if (!isSingleEllipse) ellipseAxesContainer.style.display = 'none';
    }
    if (state.activeGeo !== 'angle' && angleInputContainer) {
      const isSingleAngle = state.selectedElements && state.selectedElements.length === 1 && state.selectedElements[0].shape === 'angle';
      if (!isSingleAngle) angleInputContainer.style.display = 'none';
    }

    updateContextualToolbar('geo');
    renderPage();
  }

  // Quản lý các nhóm menu xổ xuống của thanh hình học (Hình, Dựng hình, HHKG)
  const geoGroupButtons = document.querySelectorAll('.geo-group-btn');
  geoGroupButtons.forEach(groupBtn => {
    groupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentDropdown = groupBtn.closest('.geo-group-dropdown');
      if (!parentDropdown) return;
      const menu = parentDropdown.querySelector('.geo-dropdown-menu');
      const isChevron = !!e.target.closest('.tool-chevron');
      const isAlreadyActive = groupBtn.classList.contains('active') && state.activeTool === 'geo';

      // Kích hoạt ngay công cụ đang chọn trong nhóm
      const activeItem = menu ? (menu.querySelector('.geo-dropdown-item.active') || menu.querySelector('.geo-dropdown-item')) : null;
      if (activeItem) {
        activateGeoTool(activeItem.dataset.geo, groupBtn, activeItem);
      }

      // Nếu đang có đối tượng được chọn và có thể dựng hình tự động từ selection (ví dụ chọn 2 điểm -> bấm Trung điểm)
      const selectedList = (state.selectedElements && state.selectedElements.length > 0)
        ? [...state.selectedElements]
        : (state.selectedElement ? [state.selectedElement] : []);
      if (activeItem && tryConstructFromSelection(activeItem.dataset.geo, selectedList)) {
        closeAllDropdowns();
        return;
      }

      // Mở menu xổ xuống nếu bấm vào chevron hoặc nút đã active từ trước
      if (isChevron || isAlreadyActive) {
        toggleDropdownMenu(groupBtn, menu);
      } else {
        closeAllDropdowns();
      }
    });
  });

  // Chọn hình học cụ thể trong menu con
  geoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const groupDropdown = btn.closest('.geo-group-dropdown');
      const parentBtn = groupDropdown ? groupDropdown.querySelector('.geo-group-btn') : null;

      // Khôi phục nhãn các nhóm khác về chuẩn trước khi gán nhóm hiện tại
      resetGeoDropdownLabels();

      // Kích hoạt công cụ đã chọn
      activateGeoTool(btn.dataset.geo, parentBtn, btn);
      closeAllDropdowns();

      const selectedList = (state.selectedElements && state.selectedElements.length > 0)
        ? [...state.selectedElements]
        : (state.selectedElement ? [state.selectedElement] : []);

      if (tryConstructFromSelection(state.activeGeo, selectedList)) {
        return;
      }
    });
  });

  // Dropdown Độ dày nét [━ ▾] trong Contextual Bar
  const btnSizeDropdown = document.getElementById('btn-size-dropdown');
  const menuSizeOptions = document.getElementById('menu-size-options');
  const labelStrokeSize = document.getElementById('label-stroke-size');

  if (btnSizeDropdown && menuSizeOptions) {
    btnSizeDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdownMenu(btnSizeDropdown, menuSizeOptions);
    });

    menuSizeOptions.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuSizeOptions.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.strokeWidth = parseFloat(btn.dataset.size);
        state.eraserRadius = Math.max(2.5, Math.min(5.5, Math.round(state.strokeWidth * 1.1 * 10) / 10));
        if (labelStrokeSize) {
          const line = labelStrokeSize.querySelector('.size-line');
          if (line) line.style.height = `${Math.min(6, Math.max(1.5, state.strokeWidth))}px`;
        }
        closeAllDropdowns();
      });
    });
  }

  // Dropdown Kiểu nét [Liền ▾] trong Contextual Bar
  const btnDashDropdown = document.getElementById('btn-dash-dropdown');
  const menuDashOptions = document.getElementById('menu-dash-options');
  const labelStrokeDash = document.getElementById('label-stroke-dash');

  if (btnDashDropdown && menuDashOptions) {
    btnDashDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdownMenu(btnDashDropdown, menuDashOptions);
    });

    menuDashOptions.querySelectorAll('.style-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDashOptions.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.dashStyle = btn.dataset.dash;
        if (labelStrokeDash) {
          labelStrokeDash.textContent = state.dashStyle === 'dashed' ? 'Đứt' : 'Liền';
        }
        closeAllDropdowns();
      });
    });
  }

  // Thiết lập Cỡ đầu tẩy (Nhỏ 4px, Vừa 12px, Lớn 24px)
  document.querySelectorAll('.btn-eraser-size').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.btn-eraser-size').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.eraserRadius = parseInt(btn.dataset.rad, 10) || 12;
      statusToolInfo.textContent = `Công cụ: ${state.eraserMode === 'partial' ? 'Tẩy từng tí' : 'Tẩy cả hình'} (Cỡ tẩy: ${state.eraserRadius}px)`;
    });
  });

  // Tùy chọn thông minh trong menu Tẩy: Chỉ tẩy dạ quang & Tự động quay lại Bút
  const chkEraseHighlighterOnly = document.getElementById('chk-erase-highlighter-only');
  const chkAutoSwitchToPen = document.getElementById('chk-auto-switch-to-pen');
  const rowEraseHighlighter = document.getElementById('row-erase-highlighter');
  const rowAutoSwitch = document.getElementById('row-auto-switch');

  if (chkEraseHighlighterOnly) {
    chkEraseHighlighterOnly.addEventListener('change', (e) => {
      e.stopPropagation();
      state.eraseHighlighterOnly = chkEraseHighlighterOnly.checked;
      showPageToast(state.eraseHighlighterOnly ? '🖍️ Đã bật: Chỉ tẩy nét bút dạ quang' : '✨ Đã tắt: Tẩy mọi nét vẽ');
    });
  }

  if (rowEraseHighlighter) {
    rowEraseHighlighter.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.tagName !== 'INPUT' && chkEraseHighlighterOnly) {
        chkEraseHighlighterOnly.checked = !chkEraseHighlighterOnly.checked;
        chkEraseHighlighterOnly.dispatchEvent(new Event('change'));
      }
    });
  }

  if (chkAutoSwitchToPen) {
    chkAutoSwitchToPen.addEventListener('change', (e) => {
      e.stopPropagation();
      state.autoSwitchToPen = chkAutoSwitchToPen.checked;
      showPageToast(state.autoSwitchToPen ? '✏️ Đã bật: Tự động đổi về Bút sau khi tẩy' : '✨ Đã tắt: Giữ nguyên chế độ tẩy');
    });
  }

  if (rowAutoSwitch) {
    rowAutoSwitch.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.tagName !== 'INPUT' && chkAutoSwitchToPen) {
        chkAutoSwitchToPen.checked = !chkAutoSwitchToPen.checked;
        chkAutoSwitchToPen.dispatchEvent(new Event('change'));
      }
    });
  }

  // Bảng màu nhanh
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      state.color = swatch.dataset.color;
      const penDot = document.getElementById('pen-active-color-dot');
      if (penDot) penDot.style.backgroundColor = state.color;
      statusToolInfo.textContent = `Công cụ: ${state.activeTool} (Màu: ${state.color})`;
    });
  });

  if (customColorInput) {
    customColorInput.addEventListener('input', (e) => {
      state.color = e.target.value;
      colorSwatches.forEach(s => s.classList.remove('active'));
      const penDot = document.getElementById('pen-active-color-dot');
      if (penDot) penDot.style.backgroundColor = state.color;
    });
  }

  // Xử lý vẽ đồ thị toán học (Math Function Plotter)
  const btnPlotGraph = document.getElementById('btn-plot-graph');
  const inputGraphFunc = document.getElementById('input-graph-func');
  const btnGraphGridToggle = document.getElementById('btn-graph-grid-toggle');

  function plotMathematicalGraph(funcStr) {
    if (!funcStr || !funcStr.trim() || !window.__GraphWidget) return;
    const cleanFn = window.__GraphWidget.compileMathExpr(funcStr);
    if (!cleanFn) {
      alert('Hàm số không hợp lệ. Vui lòng nhập biểu thức như: x^2, sin(x), 2*x - 3, 0.5*x^2 - 2, sqrt(4 - x^2)');
      return;
    }

    const pageEls = state.pages[state.currentPage] || [];
    let widget = (state.selectedElement && state.selectedElement.type === 'graph-widget')
      ? state.selectedElement
      : pageEls.find(el => el && el.type === 'graph-widget');

    const beforePage = JSON.parse(JSON.stringify(pageEls));

    if (widget) {
      // Cập nhật hàm đầu tiên của widget
      if (!widget.functions || widget.functions.length === 0) {
        widget.functions = [{
          id: 'fn_1',
          expr: funcStr.trim(),
          color: state.color || '#28634e',
          width: 2.5,
          dash: 'solid',
          range: [-5, 5],
          visible: true
        }];
      } else {
        widget.functions[0].expr = funcStr.trim();
        widget.functions[0].color = state.color || '#28634e';
      }
      // Tự động tìm lại các điểm đặc biệt (giao Ox, Oy, cực trị)
      widget.specialPoints = window.__GraphWidget.autoFindSpecialPoints(funcStr.trim(), widget.functions[0].range);
    } else {
      // Tạo widget mới tại vị trí trung tâm
      const dims = getCanvasDimensions();
      widget = window.__GraphWidget.createDefaultGraphWidget(dims.width / 2, dims.height / 2);
      widget.functions = [{
        id: 'fn_1',
        expr: funcStr.trim(),
        color: state.color || '#28634e',
        width: 2.5,
        dash: 'solid',
        range: [-5, 5],
        visible: true
      }];
      widget.specialPoints = window.__GraphWidget.autoFindSpecialPoints(funcStr.trim(), [-5, 5]);
      pageEls.push(widget);
    }

    pushCommand({
      type: 'page-replace',
      before: beforePage,
      after: [...pageEls]
    });

    state.activeTool = 'select';
    toolButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-tool') === 'select'));
    setCanvasCursor(SHARP_ARROW_CURSOR);
    setSelectedElements([widget]);

    renderPage();
    showPageToast(`📈 Đã vẽ đồ thị y = ${funcStr.trim()} dạng Widget!`);
    finishGeoTask(widget);
  }

  // Nút lưới tọa độ Oxy nếu có

  if (btnGraphGridToggle) {
    btnGraphGridToggle.addEventListener('click', () => {
      const dims = getCanvasDimensions();
      const originX = Math.round(dims.width / 2);
      const originY = Math.round(dims.height / 2);
      const axisColor = '#5e726b';

      const axisElements = [
        { type: 'geo', geo: 'line', x1: originX - 350, y1: originY, x2: originX + 350, y2: originY, color: axisColor, width: 1.5, dashStyle: 'solid' },
        { type: 'geo', geo: 'line', x1: originX, y1: originY + 280, x2: originX, y2: originY - 280, color: axisColor, width: 1.5, dashStyle: 'solid' },
        { type: 'text', x: originX - 18, y: originY + 18, text: 'O', color: axisColor, fontSize: 14 },
        { type: 'text', x: originX + 355, y: originY + 5, text: 'x', color: axisColor, fontSize: 14 },
        { type: 'text', x: originX + 6, y: originY - 285, text: 'y', color: axisColor, fontSize: 14 }
      ];

      const beforePage = [...(state.pages[state.currentPage] || [])];
      state.pages[state.currentPage].push(...axisElements);
      pushCommand({
        type: 'page-replace',
        before: beforePage,
        after: [...state.pages[state.currentPage]]
      });
      renderPage();
      showPageToast('📐 Đã dựng hệ trục toạ độ Oxy giữa trang!');
    });
  }

  // Bật/tắt Máy tính Casio fx-580VN X
  const btnToggleFx580 = document.getElementById('btn-toggle-fx580');
  if (btnToggleFx580) {
    btnToggleFx580.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAllDropdowns();
      if (window.__fx580 && typeof window.__fx580.toggle === 'function') {
        window.__fx580.toggle();
      }
    });
  }

  // Cung cấp API cho máy tính Casio fx-580 chèn kết quả trực tiếp vào trang ghi chú
  window.__netInsertText = function(text) {
    if (!text) return;
    const dims = getCanvasDimensions();
    const newEl = {
      type: 'text',
      text: text,
      x: Math.round(dims.width / 2 - 120),
      y: Math.round(dims.height / 2 - 20),
      color: state.color || '#28634e'
    };
    pushNewElement(newEl);
    renderPage();
    showPageToast(`✍️ Đã chèn kết quả "${text}" vào trang ghi chú!`);
  };

  // ========================================================
  // BỘ ĐIỀU KHIỂN XOAY HÌNH HỌC (2D & 3D) TRÊN THANH CÔNG CỤ
  // ========================================================
  const btnToggleRotation = document.getElementById('btn-toggle-rotation');
  const btnHhkgRotate3D = document.getElementById('btn-hhkg-rotate-3d');
  const btnHhkgRotLeft = document.getElementById('btn-hhkg-rot-left');
  const btnHhkgRotRight = document.getElementById('btn-hhkg-rot-right');
  const btnHhkgAutoSpin = document.getElementById('btn-hhkg-auto-spin');

  let autoSpinRafId = null;
  let lastSpinTime = null;
  let isRotatingAnim = false;

  function stopAutoSpin() {
    if (autoSpinRafId) {
      cancelAnimationFrame(autoSpinRafId);
      autoSpinRafId = null;
    }
    if (btnHhkgAutoSpin) {
      btnHhkgAutoSpin.textContent = '▶ Quay';
      btnHhkgAutoSpin.classList.remove('active');
    }
  }

  function getRaf() {
    if (typeof requestAnimationFrame !== 'undefined') return requestAnimationFrame;
    if (typeof window !== 'undefined' && window.requestAnimationFrame) return window.requestAnimationFrame;
    return null;
  }

  // Animation xoay hình chuyển động mượt mà (smooth animated rotation)
  function animateSmoothRotation3D(el, deltaRotX, deltaRotY, duration = 280) {
    if (!el || !window.__hhkg3d || isRotatingAnim) return;
    state.selectedEdge = null;
    state.selectedVertex = null;
    isRotatingAnim = true;
    const before = JSON.parse(JSON.stringify(el));
    const startTime = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    let lastProgress = 0;
    const raf = getRaf();

    function step(now) {
      const currentTime = now || (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Easing easeOutCubic: lướt nhanh ban đầu và êm ái dừng lại
      const ease = 1 - Math.pow(1 - progress, 3);
      const stepDelta = ease - lastProgress;
      lastProgress = ease;

      window.__hhkg3d.rotateElement(el, deltaRotX * stepDelta, deltaRotY * stepDelta);
      updateDependentBindings(el);
      renderPage();

      if (progress < 1) {
        if (raf) {
          raf(step);
        } else {
          isRotatingAnim = false;
        }
      } else {
        isRotatingAnim = false;
        pushCommand({
          type: 'modify-element',
          element: el,
          before: before,
          after: JSON.parse(JSON.stringify(el))
        });
      }
    }

    if (raf) {
      raf(step);
    } else {
      window.__hhkg3d.rotateElement(el, deltaRotX, deltaRotY);
      updateDependentBindings(el);
      renderPage();
      isRotatingAnim = false;
    }
  }

  // Animation vòng lặp xoay từ từ mô phỏng khối tròn xoay 3D cho đồ thị
  let graph3DAnimFrameId = null;
  function updateGraph3DAnimations() {
    let hasPlaying = false;
    const currentElements = state.pages[state.currentPage] || [];
    currentElements.forEach(el => {
      if (el.type === 'graph-widget' && el.revolution3D && el.revolution3D.enabled && el.revolution3D.isPlaying) {
        hasPlaying = true;
        const speed = el.revolution3D.speed || 1.0;
        // Tốc độ từ từ: 0.8 độ mỗi frame nhân hệ số tốc độ (0.5x, 1.0x, 2.0x)
        const step = 0.8 * speed;
        el.revolution3D.angleDeg = (el.revolution3D.angleDeg || 0) + step;
        if (el.revolution3D.angleDeg >= 360) {
          if (el.revolution3D.isLoop !== false) {
            el.revolution3D.angleDeg = 0;
          } else {
            el.revolution3D.angleDeg = 360;
            el.revolution3D.isPlaying = false;
          }
        }
      }
    });

    if (hasPlaying) {
      renderPage();
      const raf = getRaf();
      if (raf) graph3DAnimFrameId = raf(updateGraph3DAnimations);
    } else {
      graph3DAnimFrameId = null;
    }
  }

  function startGraph3DAnimationLoop() {
    if (!graph3DAnimFrameId) {
      const raf = getRaf();
      if (raf) graph3DAnimFrameId = raf(updateGraph3DAnimations);
    }
  }

  function getSelectedRotatableElement() {
    if (state.selectedElements && state.selectedElements.length === 1) {
      const el = state.selectedElements[0];
      if (isSolidShape(el.shape) || (el.type === 'geo' && el.shape !== 'point') || el.type === 'image') {
        return el;
      }
    }
    const pageEls = state.pages[state.currentPage] || [];
    for (let i = pageEls.length - 1; i >= 0; i--) {
      const el = pageEls[i];
      if (isSolidShape(el.shape) || (el.type === 'geo' && el.shape !== 'point') || el.type === 'image') {
        return el;
      }
    }
    return null;
  }

  function getSelectedSolidElement() {
    const el = getSelectedRotatableElement();
    if (el && isSolidShape(el.shape)) return el;
    return null;
  }

  // Xoay hình 2D quanh tâm hình một góc deltaRad bằng nút trên thanh công cụ
  function rotateSelectedElement2D(deltaRad) {
    const el = getSelectedRotatableElement();
    if (!el) return;
    const pageEls = state.pages[state.currentPage] || [];
    if (!pageEls.includes(el)) return;

    // Tính tâm xoay từ các đỉnh của hình
    const handles = getControlHandles(el);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const h of handles) {
      if (h.isRotate2D || h.isRotate3D) continue;
      if (h.x < minX) minX = h.x;
      if (h.x > maxX) maxX = h.x;
      if (h.y < minY) minY = h.y;
      if (h.y > maxY) maxY = h.y;
    }
    const cx = minX !== Infinity ? (minX + maxX) / 2 : (el.start ? el.start.x : 0);
    const cy = minY !== Infinity ? (minY + maxY) / 2 : (el.start ? el.start.y : 0);

    const elementsToRotate = getGroupElements(el);
    const rotatedSet = new Set();
    const beforeList = elementsToRotate.map(item => ({ item, before: JSON.parse(JSON.stringify(item)) }));

    for (const item of elementsToRotate) {
      rotateElement2D(item, cx, cy, deltaRad, rotatedSet);
      updateDependentBindings(item);
    }

    pushCommand({
      type: 'modify-element-group',
      element: el,
      before: beforeList[0].before,
      after: JSON.parse(JSON.stringify(el)),
      dependents: beforeList.slice(1).map(b => ({
        element: b.item,
        before: b.before,
        after: JSON.parse(JSON.stringify(b.item))
      }))
    });

    state.selectedEdge = null;
    state.selectedVertex = null;
    renderPage();
  }

  // Nút Bật/Tắt tay cầm xoay bên ngoài hình
  if (btnToggleRotation) {
    btnToggleRotation.addEventListener('click', (e) => {
      e.stopPropagation();
      state.showRotationHandle = !state.showRotationHandle;
      btnToggleRotation.classList.toggle('active', !!state.showRotationHandle);
      if (state.showRotationHandle) {
        showPageToast('🔄 Đã hiện tay cầm xoay bên ngoài hình. Kéo chuột để xoay tự do!');
      } else {
        showPageToast('Đã ẩn tay cầm xoay');
      }
      renderPage();
    });
  }

  if (btnHhkgRotate3D) {
    btnHhkgRotate3D.addEventListener('click', (e) => {
      e.stopPropagation();
      const el = getSelectedSolidElement();
      if (el && window.__hhkg3d) {
        window.__hhkg3d.openViewer(el);
      } else {
        showPageToast('💡 Hãy vẽ hoặc chọn một hình không gian (Tứ diện, hình chóp) trước');
      }
    });
  }

  if (btnHhkgRotLeft) {
    btnHhkgRotLeft.addEventListener('click', (e) => {
      e.stopPropagation();
      state.selectedEdge = null;
      state.selectedVertex = null;
      const el = getSelectedRotatableElement();
      if (!el) return;
      if (isSolidShape(el.shape) && window.__hhkg3d) {
        animateSmoothRotation3D(el, 0, -Math.PI / 4, 300);
      } else {
        rotateSelectedElement2D(-Math.PI / 4);
      }
    });
  }

  if (btnHhkgRotRight) {
    btnHhkgRotRight.addEventListener('click', (e) => {
      e.stopPropagation();
      state.selectedEdge = null;
      state.selectedVertex = null;
      const el = getSelectedRotatableElement();
      if (!el) return;
      if (isSolidShape(el.shape) && window.__hhkg3d) {
        animateSmoothRotation3D(el, 0, Math.PI / 4, 300);
      } else {
        rotateSelectedElement2D(Math.PI / 4);
      }
    });
  }

  if (btnHhkgAutoSpin) {
    btnHhkgAutoSpin.addEventListener('click', (e) => {
      e.stopPropagation();
      state.selectedEdge = null;
      state.selectedVertex = null;
      const el = getSelectedSolidElement();
      if (!el || !window.__hhkg3d) return;

      if (autoSpinRafId) {
        stopAutoSpin();
      } else {
        btnHhkgAutoSpin.textContent = '⏸ Dừng';
        btnHhkgAutoSpin.classList.add('active');
        lastSpinTime = (typeof performance !== 'undefined' ? performance.now() : Date.now());
        const raf = getRaf();

        function spinStep(now) {
          if (!state.pages[state.currentPage] || !state.pages[state.currentPage].includes(el)) {
            stopAutoSpin();
            return;
          }
          const currentTime = now || (typeof performance !== 'undefined' ? performance.now() : Date.now());
          const dt = Math.min(0.08, (currentTime - lastSpinTime) / 1000);
          lastSpinTime = currentTime;

          // Xoay tròn mượt mà chuẩn 60fps/120fps với tốc độ quay 0.8 rad/s
          window.__hhkg3d.rotateElement(el, 0, 0.8 * dt);
          updateDependentBindings(el);
          renderPage();

          if (raf) {
            autoSpinRafId = raf(spinStep);
          }
        }

        if (raf) {
          autoSpinRafId = raf(spinStep);
        }
      }
    });
  }

  // Hook áp dụng góc nhìn xoay từ Phòng chiếu 3D vào hình vẽ trên trang giấy
  window.__netApply3DRotation = function(el, rotX, rotY) {
    if (!el || !window.__hhkg3d) return;
    const before = JSON.parse(JSON.stringify(el));
    const deltaX = rotX - (el.rotX || 0.35);
    const deltaY = rotY - (el.rotY || 0.5);
    window.__hhkg3d.rotateElement(el, deltaX, deltaY);
    updateDependentBindings(el);
    pushCommand({
      type: 'modify-element',
      element: el,
      before: before,
      after: JSON.parse(JSON.stringify(el))
    });
    renderPage();
    showPageToast('✨ Đã áp dụng góc nhìn 3D mới vào hình vẽ!');
  };

  // ==========================================================================
  // MENU TỆP ▾ THỐNG NHẤT (Lưu, Lưu thành..., Nhập, Xuất, Tiện ích)
  // ==========================================================================
  const btnFileMenu = document.getElementById('btn-file-menu');
  const menuFile = document.getElementById('menu-file');
  const btnFileSave = document.getElementById('btn-file-save');
  const btnFileSaveAs = document.getElementById('btn-file-save-as');
  const btnFileImportProject = document.getElementById('btn-file-import-project');
  const inputProjectFile = document.getElementById('input-project-file');
  const saveBadge = document.getElementById('save-badge');
  const docTitleInput = document.getElementById('doc-title');

  // Mở/đóng dropdown Menu Tệp
  if (btnFileMenu && menuFile) {
    btnFileMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdownMenu(btnFileMenu, menuFile);
    });
  }

  // Thu thập dữ liệu toàn bộ tài liệu Nét (Schema chuẩn v1)
  function getProjectData() {
    return {
      version: 1,
      appName: 'Nét',
      slogan: 'Một khoảng trống cho mọi ý tưởng',
      savedAt: new Date().toISOString(),
      timestamp: Date.now(),
      title: docTitleInput ? docTitleInput.value.trim() : 'Ghi chú hình học',
      state: {
        orientation: state.orientation,
        currentPage: state.currentPage,
        pages: state.pages,
        pageOrder: state.pageOrder || Object.keys(state.pages).map(Number).sort((a, b) => a - b),
        gridType: (typeof selectGrid !== 'undefined' && selectGrid) ? selectGrid.value : 'blank'
      }
    };
  }

  // 1. Lưu (Save) - Lưu vào localStorage của trình duyệt
  function saveProject(isManual = false) {
    try {
      const data = getProjectData();
      localStorage.setItem('net_saved_project', JSON.stringify(data));
      if (saveBadge) {
        saveBadge.textContent = '· Đã lưu';
        saveBadge.className = 'badge-saved';
        saveBadge.style.color = '#28634e';
      }
      if (isManual) {
        showPageToast('💾 Đã lưu ghi chú thành công!');
      }
    } catch (err) {
      console.warn('Lỗi lưu cục bộ:', err);
      if (isManual) {
        showPageToast('⚠️ Bộ nhớ cục bộ bị đầy, hãy dùng "Lưu thành..." để tải tệp về máy.');
      }
    }
  }

  // 2. Lưu thành... (Save As) - Xuất file dự án .net về máy tính
  function saveAsProject() {
    const data = getProjectData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const rawTitle = docTitleInput ? docTitleInput.value.trim() : 'ghi-chu-net';
    const cleanTitle = rawTitle.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9 -]/g, '').trim() || 'ghi-chu-net';
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cleanTitle}.net`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showPageToast('📄 Đã tải tệp sao lưu (.net) về máy!');
  }

  // 3. Mở tệp Nét (.net / .json) từ máy tính
  function importProject(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || !data.state || !data.state.pages) {
          alert('Định dạng tệp không hợp lệ! Vui lòng chọn tệp .net hoặc .json của Nét.');
          return;
        }
        if (docTitleInput && data.title) {
          docTitleInput.value = data.title;
        }
        state.pages = data.state.pages || {};
        if (data.state.orientation && data.state.orientation !== state.orientation) {
          setOrientation(data.state.orientation);
        }
        if (data.state.gridType) {
          document.querySelectorAll('.paper-sheet').forEach(sheet => {
            sheet.className = `paper-sheet paper-${data.state.gridType}`;
          });
          if (typeof selectGrid !== 'undefined' && selectGrid) selectGrid.value = data.state.gridType;
        }
        state.currentPage = data.state.currentPage || 1;
        updatePageListBar();
        renderPage();
        saveProject(false);
        showPageToast('📂 Đã mở tệp Nét thành công!');
      } catch (err) {
        alert('Không thể mở tệp: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  // Tự động lưu sau khi chỉnh sửa (Auto-save debounce 1.5s)
  let autoSaveTimer = null;
  function markUnsaved() {
    if (saveBadge) {
      saveBadge.textContent = '· Đang sửa...';
      saveBadge.className = 'badge-saved';
      saveBadge.style.color = '#d97706';
    }
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      saveProject(false);
    }, 1500);
  }

  // 0. Tạo mới (New)
  const btnFileNew = document.getElementById('btn-file-new');
  const newConfirmModal = document.getElementById('new-confirm-modal');
  const btnCloseNewModal = document.getElementById('btn-close-new-modal');
  const btnNewCancel = document.getElementById('btn-new-cancel');
  const btnNewDiscard = document.getElementById('btn-new-discard');
  const btnNewSaveAndCreate = document.getElementById('btn-new-save-and-create');

  function openNewConfirmModal() {
    if (newConfirmModal) {
      newConfirmModal.style.display = 'flex';
    }
  }

  function closeNewConfirmModal() {
    if (newConfirmModal) {
      newConfirmModal.style.display = 'none';
    }
  }

  // Định nghĩa hàm cập nhật đồng bộ các thanh phân trang và thumbnail
  function updatePageListBar() {
    if (typeof renderAllTabs === 'function') renderAllTabs();
    if (typeof updatePageTabsActive === 'function') updatePageTabsActive(state.currentPage || 1, true);
    if (typeof renderThumbnails === 'function') renderThumbnails();
    if (typeof updateScrollBanner === 'function') updateScrollBanner();
    if (typeof updateSidebarCount === 'function') updateSidebarCount();
  }

  function doResetToNew() {
    // 1. Reset toàn bộ dữ liệu trang trong state
    state.pages = { 1: [] };
    state.currentPage = 1;
    state.pageTitles = { 1: 'Trang 1' };
    state.undoStacks = { 1: [] };
    state.redoStacks = { 1: [] };
    state.selectedElement = null;
    state.selectedElements = [];
    state.selectedEdge = null;
    state.selectedVertex = null;
    state.pendingSingleSelect = null;
    state.activeHandle = null;
    state.hoverHandle = null;
    state.hoverElement = null;

    // 2. Dọn sạch DOM: Xóa các trang phụ (trang 2, 3, 4...) chỉ giữ lại duy nhất trang 1
    if (pagesContainer) {
      const wrappers = Array.from(pagesContainer.querySelectorAll('.paper-wrapper'));
      wrappers.forEach(w => {
        const p = parseInt(w.dataset.page, 10);
        if (p > 1) {
          w.remove();
        }
      });
    }

    // 3. Xóa sạch mọi nét vẽ và các hộp nhập nổi trên canvas trang 1
    document.querySelectorAll('.floating-angle-box').forEach(b => b.remove());
    const canvas1 = getCanvasForPage(1) || canvas;
    if (canvas1) {
      const targetCtx = canvas1.getContext('2d');
      targetCtx.setTransform(1, 0, 0, 1, 0, 0);
      targetCtx.clearRect(0, 0, canvas1.width, canvas1.height);
      const dpr = window.devicePixelRatio || 1;
      targetCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // 4. Đặt lại tiêu đề tài liệu về "Ghi chú mới"
    if (docTitleInput) {
      docTitleInput.value = 'Ghi chú mới';
    }

    // 5. Ẩn widget đồ thị nếu đang mở
    const graphWidget = document.getElementById('graph-widget');
    if (graphWidget) {
      graphWidget.style.display = 'none';
    }

    // 6. Đưa thanh cuộn về vị trí đầu tiên
    if (canvasContainer) {
      canvasContainer.scrollTop = 0;
      canvasContainer.scrollLeft = 0;
    }

    // 7. Cập nhật danh sách trang, thumbnails và renderer
    updatePageListBar();
    renderPage(1);
    updateUndoState();

    // 8. Tự động lưu trạng thái trang trắng
    saveProject(false);

    // 9. Hiển thị thông báo toast
    showPageToast('✨ Đã tạo tài liệu mới!');
  }

  function createNewProject() {
    // Luôn luôn hiển thị hộp thoại xác nhận ở mọi lần bấm (lần 1, 2, 3, 4...)
    openNewConfirmModal();
  }

  if (btnCloseNewModal) btnCloseNewModal.addEventListener('click', closeNewConfirmModal);
  if (btnNewCancel) btnNewCancel.addEventListener('click', closeNewConfirmModal);
  if (newConfirmModal) {
    newConfirmModal.addEventListener('click', (e) => {
      if (e.target === newConfirmModal) closeNewConfirmModal();
    });
  }

  if (btnNewDiscard) {
    btnNewDiscard.addEventListener('click', () => {
      closeNewConfirmModal();
      doResetToNew();
    });
  }

  if (btnNewSaveAndCreate) {
    btnNewSaveAndCreate.addEventListener('click', () => {
      closeNewConfirmModal();
      saveAsProject(); // Tải tệp sao lưu .net về máy
      saveProject(false);
      setTimeout(() => {
        doResetToNew();
      }, 350);
    });
  }

  // Gán sự kiện cho các mục trong menu Tệp
  if (btnFileNew) {
    btnFileNew.addEventListener('click', () => {
      closeAllDropdowns();
      createNewProject();
    });
  }

  if (btnFileSave) {
    btnFileSave.addEventListener('click', () => {
      closeAllDropdowns();
      saveProject(true);
    });
  }

  if (btnFileSaveAs) {
    btnFileSaveAs.addEventListener('click', () => {
      closeAllDropdowns();
      saveAsProject();
    });
  }

  if (btnFileImportProject && inputProjectFile) {
    btnFileImportProject.addEventListener('click', () => {
      closeAllDropdowns();
      inputProjectFile.click();
    });

    inputProjectFile.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) importProject(file);
      inputProjectFile.value = '';
    });
  }

  if (docTitleInput) {
    docTitleInput.addEventListener('input', markUnsaved);
  }

  // Phím tắt bàn phím toàn cục cho menu Tệp (⌘N, ⌘S, ⌘⇧S, ⌘O, ⌘P)
  window.addEventListener('keydown', (e) => {
    // ⌘N hoặc Ctrl+N -> Tạo mới (New)
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      createNewProject();
      return;
    }
    // ⌘S hoặc Ctrl+S -> Lưu (Save)
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveProject(true);
      return;
    }
    // ⌘⇧S hoặc Ctrl+Shift+S -> Lưu thành... (Save As)
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveAsProject();
      return;
    }
    // ⌘O hoặc Ctrl+O -> Mở tệp Nét (Open)
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'o') {
      e.preventDefault();
      if (inputProjectFile) inputProjectFile.click();
      return;
    }
  });

  // Tự động khôi phục bản ghi chú đã lưu từ lần trước khi mở app (nếu có)
  try {
    const lastSaved = localStorage.getItem('net_saved_project');
    if (lastSaved) {
      const parsed = JSON.parse(lastSaved);
      if (parsed && parsed.state && parsed.state.pages) {
        const totalElements = Object.values(state.pages).reduce((sum, list) => sum + (list ? list.length : 0), 0);
        if (totalElements === 0 && Object.keys(parsed.state.pages).length > 0) {
          state.pages = parsed.state.pages;
          if (docTitleInput && parsed.title) docTitleInput.value = parsed.title;
          if (parsed.state.currentPage) state.currentPage = parsed.state.currentPage;
          updatePageListBar();
          renderPage();
        }
      }
    }
  } catch (err) {
    console.warn('Lỗi khôi phục ghi chú cũ:', err);
  }

  const btnImportImage = document.getElementById('btn-import-image');
  const inputImageFile = document.getElementById('input-image-file');
  if (btnImportImage && inputImageFile) {
    btnImportImage.addEventListener('click', () => {
      closeAllDropdowns();
      inputImageFile.click();
    });

    inputImageFile.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        insertImageToCurrentPage(loadEvt.target.result);
      };
      reader.readAsDataURL(file);
      inputImageFile.value = '';
    });
  }

  const btnExportPdf = document.getElementById('btn-export-pdf');
  if (btnExportPdf) {
    btnExportPdf.addEventListener('click', () => {
      closeAllDropdowns();
      window.print();
    });
  }

  const btnDocAbout = document.getElementById('btn-doc-about');
  if (btnDocAbout) {
    btnDocAbout.addEventListener('click', () => {
      closeAllDropdowns();
      alert('Nét — Một khoảng trống cho mọi ý tưởng.\n\n• Công cụ viết tay & dựng hình học chính xác cho Mac.\n• Hỗ trợ nhập PDF, chèn ảnh, vẽ đồ thị & tính S/V, giả lập Casio fx-580VN X.\n• Toàn bộ dữ liệu xử lý an toàn trực tiếp trên máy của bạn.');
    });
  }

  // Dropdown Hiển thị ▾ (Lưới giấy + Hướng trang ở Thanh đáy - Theo Hình 4)
  const btnDisplayDropdown = document.getElementById('btn-display-dropdown');
  const menuDisplay = document.getElementById('menu-display');
  if (btnDisplayDropdown && menuDisplay) {
    btnDisplayDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdownMenu(btnDisplayDropdown, menuDisplay);
    });

    // Chọn kiểu lưới giấy
    menuDisplay.querySelectorAll('[data-grid]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const gridType = item.dataset.grid;
        menuDisplay.querySelectorAll('[data-grid]').forEach(it => {
          it.classList.toggle('active', it === item);
          const check = it.querySelector('.menu-check');
          if (check) check.style.display = (it === item) ? 'inline-block' : 'none';
        });

        document.querySelectorAll('.paper-sheet').forEach(sheet => {
          sheet.className = `paper-sheet paper-${gridType}`;
        });
        if (selectGrid) selectGrid.value = gridType;
        closeAllDropdowns();
        showPageToast(`Nền giấy: ${gridType === 'grid' ? 'Ô vuông' : gridType === 'lines' ? 'Kẻ dòng' : 'Giấy trơn'}`);
      });
    });

    // Chọn hướng trang (Dọc / Ngang)
    const btnBottomPortrait = document.getElementById('btn-orient-portrait');
    const btnBottomLandscape = document.getElementById('btn-orient-landscape');
    if (btnBottomPortrait) {
      btnBottomPortrait.addEventListener('click', (e) => {
        e.stopPropagation();
        setOrientation('portrait');
        btnBottomPortrait.classList.add('active');
        if (btnBottomLandscape) btnBottomLandscape.classList.remove('active');
        const checkP = btnBottomPortrait.querySelector('.menu-check');
        const checkL = btnBottomLandscape ? btnBottomLandscape.querySelector('.menu-check') : null;
        if (checkP) checkP.style.display = 'inline-block';
        if (checkL) checkL.style.display = 'none';
        closeAllDropdowns();
      });
    }

    if (btnBottomLandscape) {
      btnBottomLandscape.addEventListener('click', (e) => {
        e.stopPropagation();
        setOrientation('landscape');
        btnBottomLandscape.classList.add('active');
        if (btnBottomPortrait) btnBottomPortrait.classList.remove('active');
        const checkP = btnBottomPortrait ? btnBottomPortrait.querySelector('.menu-check') : null;
        const checkL = btnBottomLandscape.querySelector('.menu-check');
        if (checkP) checkP.style.display = 'none';
        if (checkL) checkL.style.display = 'inline-block';
        closeAllDropdowns();
      });
    }
  }

  // Đóng mọi menu khi click ra ngoài hoặc nhấn phím Escape
  document.addEventListener('click', () => {
    closeAllDropdowns();
  });

  // 8. Quản lý Trang (Pages) & Cuộn nối tiếp nhiều trang liên tục (Continuous Document Stream)
  const paperWrapper = document.getElementById('paper-wrapper');
  const scrollNewPageBanner = document.getElementById('scroll-new-page-banner');
  const scrollNewPageTitle = document.getElementById('scroll-new-page-title');
  const scrollNewPageHint = document.getElementById('scroll-new-page-hint');
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const pageToast = document.getElementById('page-toast-notification');

  let pageToastTimer = null;
  function showPageToast(message) {
    if (!pageToast) return;
    pageToast.textContent = message;
    pageToast.classList.add('show');
    clearTimeout(pageToastTimer);
    pageToastTimer = setTimeout(() => {
      pageToast.classList.remove('show');
    }, 1800);
  }

  // Khởi tạo trang trong DOM nếu chưa có
  function ensurePageInDOM(pageNum) {
    let existingCanvas = document.querySelector(`canvas[data-page="${pageNum}"]`);
    if (existingCanvas) return existingCanvas;

    const dims = getCanvasDimensions();
    const wrapper = document.createElement('div');
    wrapper.className = `paper-wrapper paper-wrapper-${pageNum}`;
    wrapper.id = `paper-wrapper-${pageNum}`;
    wrapper.dataset.page = pageNum;
    wrapper.style.width = `${dims.width * state.zoom}px`;
    wrapper.style.height = `${dims.height * state.zoom}px`;

    const sheet = document.createElement('div');
    const gridStyle = selectGrid ? selectGrid.value : 'grid';
    sheet.className = `paper-sheet paper-${gridStyle} paper-sheet-${pageNum}`;
    sheet.id = `paper-sheet-${pageNum}`;
    sheet.dataset.page = pageNum;
    sheet.style.width = `${dims.width}px`;
    sheet.style.height = `${dims.height}px`;
    sheet.style.transform = `scale(${state.zoom})`;

    const pageCanvas = document.createElement('canvas');
    pageCanvas.className = `main-canvas canvas-page-${pageNum}`;
    pageCanvas.id = `canvas-page-${pageNum}`;
    pageCanvas.dataset.page = pageNum;
    pageCanvas.width = dims.width;
    pageCanvas.height = dims.height;

    const cornerTag = document.createElement('div');
    cornerTag.className = 'page-corner-tag';
    cornerTag.textContent = state.pageTitles[pageNum] || `Trang ${pageNum}`;
    sheet.appendChild(cornerTag);

    sheet.appendChild(pageCanvas);
    wrapper.appendChild(sheet);

    if (pagesContainer) {
      // Chèn đúng vị trí thứ tự trang (không bị nhảy lộn xộn)
      const existingWrappers = Array.from(pagesContainer.querySelectorAll('.paper-wrapper'));
      let inserted = false;
      for (const w of existingWrappers) {
        const wp = parseInt(w.dataset.page, 10);
        if (wp > pageNum) {
          pagesContainer.insertBefore(wrapper, w);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        pagesContainer.appendChild(wrapper);
      }
    }

    setupRetinaCanvasFor(pageCanvas);
    attachCanvasEvents(pageCanvas);

    return pageCanvas;
  }

  // Cập nhật số lượng trang trên header thanh bên (TRANG · 2)
  function updateSidebarCount() {
    if (sidebarTitle) {
      const total = Object.keys(state.pages).length;
      sidebarTitle.textContent = `TRANG · ${total}`;
    }
  }

  // Thêm một ô thumbnail duy nhất khi sinh trang mới (tránh hủy vẽ lại toàn bộ gây giật cuộn)
  function appendSingleThumbnail(p) {
    if (!pagesThumbnailList) return;
    if (document.getElementById(`thumb-canvas-${p}`)) {
      updateThumbnail(p);
      return;
    }
    const isPortrait = state.orientation === 'portrait';
    const thumbWidth = 148;
    const thumbHeight = isPortrait ? 210 : 98;
    const isCurrent = p === state.currentPage;

    const item = document.createElement('div');
    item.className = `page-thumb-item ${isCurrent ? 'active' : ''}`;
    item.dataset.page = p;

    const cardEl = document.createElement('div');
    cardEl.className = 'thumb-card';
    cardEl.style.width = `${thumbWidth}px`;
    cardEl.style.height = `${thumbHeight}px`;

    const tCanvas = document.createElement('canvas');
    tCanvas.className = 'thumb-canvas';
    tCanvas.id = `thumb-canvas-${p}`;
    tCanvas.width = thumbWidth * 2;
    tCanvas.height = thumbHeight * 2;

    cardEl.appendChild(tCanvas);

    const footerEl = document.createElement('div');
    footerEl.className = 'thumb-footer';

    const labelEl = document.createElement('span');
    labelEl.className = 'thumb-label';
    labelEl.textContent = state.pageTitles[p] || `Trang ${p}`;

    const moreBtn = document.createElement('button');
    moreBtn.className = 'thumb-more-btn';
    moreBtn.title = 'Tùy chọn trang';
    moreBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>';

    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      switchPage(p, true);
      if (pageMoreContainer) {
        pageMoreContainer.classList.toggle('open');
      }
    });

    footerEl.appendChild(labelEl);
    footerEl.appendChild(moreBtn);

    item.appendChild(cardEl);
    item.appendChild(footerEl);

    item.addEventListener('click', () => {
      switchPage(p, true);
    });

    pagesThumbnailList.appendChild(item);
    updateThumbnail(p);
    updateSidebarCount();
  }

  // 8.1 Quản lý danh sách trang thu nhỏ bên trái (Làm gọn theo hình 3)
  function renderThumbnails() {
    if (!pagesThumbnailList) return;
    const pageNums = Object.keys(state.pages).map(Number).sort((a, b) => a - b);
    pagesThumbnailList.innerHTML = '';

    for (const p of pageNums) {
      appendSingleThumbnail(p);
    }
    updateSidebarCount();
  }

  function updateThumbnail(p) {
    const tCanvas = document.getElementById(`thumb-canvas-${p}`);
    if (!tCanvas) return;
    const tCtx = tCanvas.getContext('2d');
    const pCanvas = getCanvasForPage(p);
    if (!pCanvas) return;

    tCtx.save();
    tCtx.clearRect(0, 0, tCanvas.width, tCanvas.height);
    tCtx.fillStyle = '#ffffff';
    tCtx.fillRect(0, 0, tCanvas.width, tCanvas.height);
    tCtx.drawImage(pCanvas, 0, 0, tCanvas.width, tCanvas.height);
    tCtx.restore();
  }

  function updateThumbnailActive(pageNum, scrollThumb = false) {
    document.querySelectorAll('.page-thumb-item').forEach(item => {
      const isCur = parseInt(item.dataset.page, 10) === pageNum;
      item.classList.toggle('active', isCur);
      if (isCur && scrollThumb) {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  function updatePageTabsActive(pageNumber, scrollTabs = false) {
    document.querySelectorAll('.page-tab').forEach(tab => {
      const isCurrent = parseInt(tab.dataset.page, 10) === pageNumber;
      tab.classList.toggle('active', isCurrent);
      if (isCurrent && scrollTabs) {
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    });
    updateThumbnailActive(pageNumber, scrollTabs);
  }

  function renderAllTabs() {
    if (!pagesList) return;
    pagesList.innerHTML = '';
    const pageNums = Object.keys(state.pages).map(Number).sort((a, b) => a - b);
    for (const p of pageNums) {
      const tab = document.createElement('button');
      tab.className = `page-tab ${p === state.currentPage ? 'active' : ''}`;
      tab.dataset.page = p;
      tab.textContent = state.pageTitles[p] || `Trang ${p}`;
      pagesList.appendChild(tab);
    }
  }

  function updateScrollBanner() {
    if (!scrollNewPageBanner) return;
    const totalPages = Object.keys(state.pages).length;
    if (scrollNewPageTitle) scrollNewPageTitle.textContent = `Hết Trang ${totalPages}`;
    if (scrollNewPageHint) scrollNewPageHint.textContent = `Cuộn tiếp để tự động sinh Trang ${totalPages + 1} (hoặc bấm vào đây)`;
    if (scrollProgressBar) {
      scrollProgressBar.style.width = '0%';
    }
    scrollNewPageBanner.classList.remove('active');
  }

  // Quản lý animation cuộn trang mượt mà (smooth scroll controller)
  let scrollAnimId = null;
  let isProgrammaticScroll = false;

  function cancelSmoothScroll() {
    if (scrollAnimId) {
      const cancelRaf = (typeof cancelAnimationFrame !== 'undefined' ? cancelAnimationFrame : (typeof window !== 'undefined' && window.cancelAnimationFrame ? window.cancelAnimationFrame : null));
      if (cancelRaf) cancelRaf(scrollAnimId);
      scrollAnimId = null;
    }
    isProgrammaticScroll = false;
  }

  function smoothScrollTo(container, targetY, duration = 300, onComplete) {
    if (!container) return;
    cancelSmoothScroll();

    const startY = container.scrollTop;
    const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
    const clampedTargetY = Math.max(0, Math.min(maxScroll, Math.round(targetY)));
    const distance = clampedTargetY - startY;

    if (Math.abs(distance) < 2) {
      container.scrollTop = clampedTargetY;
      isProgrammaticScroll = false;
      if (onComplete) onComplete();
      return;
    }

    isProgrammaticScroll = true;
    const startTime = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    const raf = getRaf();

    function step(now) {
      const currentTime = now || (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Easing easeOutCubic: lướt nhanh ban đầu và êm ái dừng lại
      const ease = 1 - Math.pow(1 - progress, 3);
      container.scrollTop = Math.round(startY + distance * ease);

      if (progress < 1) {
        if (raf) {
          scrollAnimId = raf(step);
        } else {
          container.scrollTop = clampedTargetY;
          isProgrammaticScroll = false;
          if (onComplete) onComplete();
        }
      } else {
        container.scrollTop = clampedTargetY;
        scrollAnimId = null;
        setTimeout(() => {
          isProgrammaticScroll = false;
        }, 50);
        if (onComplete) onComplete();
      }
    }

    if (raf) {
      scrollAnimId = raf(step);
    } else {
      container.scrollTop = clampedTargetY;
      isProgrammaticScroll = false;
      if (onComplete) onComplete();
    }
  }

  // Chuyển trang: bấm số trang sẽ cuộn đến đúng số trang đó 100%
  function switchPage(pageNumber, smoothScroll = true) {
    const num = parseInt(pageNumber, 10);
    if (isNaN(num)) return;

    state.currentPage = num;
    if (!state.pages[num]) state.pages[num] = [];
    if (!state.undoStacks[num]) state.undoStacks[num] = [];
    if (!state.redoStacks[num]) state.redoStacks[num] = [];
    if (!state.pageTitles[num]) state.pageTitles[num] = `Trang ${num}`;

    ensurePageInDOM(num);
    updatePageTabsActive(num, true);

    const targetWrapper = getPaperWrapperForPage(num);
    if (targetWrapper && canvasContainer) {
      // Vị trí cuộn chuẩn xác tuyệt đối đến trang (với đệm trên 24px để thấy rõ thẻ đầu trang)
      const targetScrollTop = Math.max(0, targetWrapper.offsetTop - 24);
      if (smoothScroll) {
        smoothScrollTo(canvasContainer, targetScrollTop, 300, () => {
          state.currentPage = num;
          updatePageTabsActive(num, true);
        });
      } else {
        cancelSmoothScroll();
        canvasContainer.scrollTop = targetScrollTop;
        updatePageTabsActive(num, true);
      }
    }

    renderPage(num);
    updateUndoState();
    updateScrollBanner();
  }

  function createNewPage(autoScroll = true) {
    const newPageNum = Object.keys(state.pages).length + 1;
    state.pages[newPageNum] = [];
    state.undoStacks[newPageNum] = [];
    state.redoStacks[newPageNum] = [];
    state.pageTitles[newPageNum] = `Trang ${newPageNum}`;

    ensurePageInDOM(newPageNum);

    let tab = pagesList ? pagesList.querySelector(`.page-tab[data-page="${newPageNum}"]`) : null;
    if (!tab && pagesList) {
      tab = document.createElement('button');
      tab.className = 'page-tab';
      tab.dataset.page = newPageNum;
      tab.textContent = state.pageTitles[newPageNum];
      pagesList.appendChild(tab);
    }

    appendSingleThumbnail(newPageNum);

    if (autoScroll) {
      switchPage(newPageNum, true);
      showPageToast(`✨ Đã sinh Trang ${newPageNum} mới`);
    } else {
      updateScrollBanner();
    }
    return newPageNum;
  }

  // Thao tác Đổi tên trang
  function renamePage(p) {
    const cur = state.pageTitles[p] || `Trang ${p}`;
    const newTitle = prompt('Nhập tên mới cho trang:', cur);
    if (newTitle && newTitle.trim()) {
      state.pageTitles[p] = newTitle.trim();
      const tab = pagesList ? pagesList.querySelector(`.page-tab[data-page="${p}"]`) : null;
      if (tab) tab.textContent = state.pageTitles[p];
      const headerBadge = document.querySelector(`.paper-wrapper-${p} .paper-header-badge`);
      if (headerBadge) headerBadge.innerHTML = `<span class="badge-dot"></span>${state.pageTitles[p]}`;
      const topBadge = document.querySelector(`.paper-sheet-${p} .page-top-badge`);
      if (topBadge) topBadge.textContent = state.pageTitles[p];
      const cornerTag = document.querySelector(`.paper-sheet-${p} .page-corner-tag`);
      if (cornerTag) cornerTag.textContent = state.pageTitles[p];
      renderThumbnails();
      showPageToast(`✏️ Đã đổi tên thành "${state.pageTitles[p]}"`);
    }
    if (pageMoreContainer) pageMoreContainer.classList.remove('open');
  }

  // Thao tác Nhân bản trang
  function duplicatePage(sourcePageNum) {
    const newPageNum = Object.keys(state.pages).length + 1;
    const elementsCopy = JSON.parse(JSON.stringify(state.pages[sourcePageNum] || []));
    state.pages[newPageNum] = elementsCopy;
    state.undoStacks[newPageNum] = [];
    state.redoStacks[newPageNum] = [];
    state.pageTitles[newPageNum] = `${state.pageTitles[sourcePageNum] || 'Trang ' + sourcePageNum} (Bản sao)`;

    ensurePageInDOM(newPageNum);
    renderAllTabs();
    renderThumbnails();
    switchPage(newPageNum, true);
    showPageToast(`📑 Đã nhân bản Trang ${sourcePageNum}`);
    if (pageMoreContainer) pageMoreContainer.classList.remove('open');
  }

  // Thao tác Xóa trang
  function deletePage(targetPageNum) {
    const total = Object.keys(state.pages).length;
    if (total <= 1) {
      showPageToast('⚠️ Không thể xóa trang duy nhất trong tài liệu');
      if (pageMoreContainer) pageMoreContainer.classList.remove('open');
      return;
    }
    const pageTitle = state.pageTitles[targetPageNum] || `Trang ${targetPageNum}`;
    if (!confirm(`Bạn có chắc chắn muốn xóa "${pageTitle}" không?`)) {
      if (pageMoreContainer) pageMoreContainer.classList.remove('open');
      return;
    }

    const wrapper = getPaperWrapperForPage(targetPageNum);
    if (wrapper) wrapper.remove();

    const newPages = {};
    const newUndo = {};
    const newRedo = {};
    const newTitles = {};
    let newIdx = 1;

    const sortedNums = Object.keys(state.pages).map(Number).sort((a, b) => a - b);
    for (const p of sortedNums) {
      if (p === targetPageNum) continue;
      newPages[newIdx] = state.pages[p];
      newUndo[newIdx] = state.undoStacks[p] || [];
      newRedo[newIdx] = state.redoStacks[p] || [];
      newTitles[newIdx] = state.pageTitles[p] || `Trang ${newIdx}`;

      const wrap = getPaperWrapperForPage(p);
      if (wrap && p !== newIdx) {
        wrap.className = `paper-wrapper paper-wrapper-${newIdx}`;
        wrap.id = `paper-wrapper-${newIdx}`;
        wrap.dataset.page = newIdx;
        const headerBadge = wrap.querySelector('.paper-header-badge');
        if (headerBadge) headerBadge.innerHTML = `<span class="badge-dot"></span>${newTitles[newIdx]}`;
        const sheet = wrap.querySelector('.paper-sheet');
        if (sheet) {
          sheet.className = sheet.className.replace(`paper-sheet-${p}`, `paper-sheet-${newIdx}`);
          sheet.id = `paper-sheet-${newIdx}`;
          sheet.dataset.page = newIdx;
        }
        const canvas = wrap.querySelector('.main-canvas');
        if (canvas) {
          canvas.className = canvas.className.replace(`canvas-page-${p}`, `canvas-page-${newIdx}`);
          canvas.id = `canvas-page-${newIdx}`;
          canvas.dataset.page = newIdx;
        }
      }
      newIdx++;
    }

    state.pages = newPages;
    state.undoStacks = newUndo;
    state.redoStacks = newRedo;
    state.pageTitles = newTitles;

    renderAllTabs();
    renderThumbnails();
    const targetSwitch = Math.min(targetPageNum, Object.keys(state.pages).length);
    switchPage(targetSwitch, true);
    showPageToast(`🗑️ Đã xóa trang thành công`);
    if (pageMoreContainer) pageMoreContainer.classList.remove('open');
  }

  if (btnAddPage) {
    btnAddPage.addEventListener('click', () => {
      createNewPage(true);
    });
  }

  if (pagesList) {
    pagesList.addEventListener('click', (e) => {
      const tab = e.target.closest('.page-tab');
      if (tab && tab.dataset.page) {
        const p = parseInt(tab.dataset.page, 10);
        if (!isNaN(p)) switchPage(p, true);
      }
    });
  }

  // Menu tùy chọn [...] bên phải
  if (btnPageMore && pageMoreContainer) {
    btnPageMore.addEventListener('click', (e) => {
      e.stopPropagation();
      pageMoreContainer.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!pageMoreContainer.contains(e.target)) {
        pageMoreContainer.classList.remove('open');
      }
    });
  }

  if (btnPageRename) {
    btnPageRename.addEventListener('click', () => renamePage(state.currentPage));
  }
  if (btnPageDuplicate) {
    btnPageDuplicate.addEventListener('click', () => duplicatePage(state.currentPage));
  }
  if (btnPageDelete) {
    btnPageDelete.addEventListener('click', () => deletePage(state.currentPage));
  }

  if (scrollNewPageBanner) {
    scrollNewPageBanner.addEventListener('click', () => {
      createNewPage(true);
    });
  }

  // Chuyển đổi hướng trang Dọc / Ngang (Hỗ trợ Dropdown menu)
  function setOrientation(newOrient) {
    if (state.orientation === newOrient) {
      if (orientDropdownContainer) orientDropdownContainer.classList.remove('open');
      return;
    }
    state.orientation = newOrient;
    const dims = getCanvasDimensions();

    document.documentElement.style.setProperty('--canvas-width', `${dims.width}px`);
    document.documentElement.style.setProperty('--canvas-height', `${dims.height}px`);

    if (btnOrientPortrait && btnOrientLandscape) {
      btnOrientPortrait.classList.toggle('active', newOrient === 'portrait');
      btnOrientLandscape.classList.toggle('active', newOrient === 'landscape');

      const checkPortrait = btnOrientPortrait.querySelector('.orient-check');
      const checkLandscape = btnOrientLandscape.querySelector('.orient-check');
      if (checkPortrait) checkPortrait.style.display = newOrient === 'portrait' ? 'inline-block' : 'none';
      if (checkLandscape) checkLandscape.style.display = newOrient === 'landscape' ? 'inline-block' : 'none';
    }

    if (orientDropdownLabel) {
      orientDropdownLabel.textContent = newOrient === 'portrait' ? 'Dọc' : 'Ngang';
    }
    if (orientDropdownIcon) {
      orientDropdownIcon.innerHTML = newOrient === 'portrait'
        ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="3" width="12" height="18" rx="2"/></svg>'
        : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="12" rx="2"/></svg>';
    }

    if (orientDropdownContainer) {
      orientDropdownContainer.classList.remove('open');
    }

    document.querySelectorAll('.paper-wrapper').forEach(w => {
      w.style.width = `${dims.width * state.zoom}px`;
      w.style.height = `${dims.height * state.zoom}px`;
    });

    document.querySelectorAll('.paper-sheet').forEach(s => {
      s.style.width = `${dims.width}px`;
      s.style.height = `${dims.height}px`;
    });

    setupRetinaCanvas();
    renderPage();
    renderThumbnails();
    showPageToast(newOrient === 'portrait' ? '📄 Hướng trang: Chiều dọc (A4 đứng)' : '📄 Hướng trang: Chiều ngang (A4 ngang)');
  }

  if (btnOrientDropdown && orientDropdownContainer) {
    btnOrientDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      orientDropdownContainer.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!orientDropdownContainer.contains(e.target)) {
        orientDropdownContainer.classList.remove('open');
      }
    });
  }

  if (btnOrientPortrait) {
    btnOrientPortrait.addEventListener('click', () => setOrientation('portrait'));
  }
  if (btnOrientLandscape) {
    btnOrientLandscape.addEventListener('click', () => setOrientation('landscape'));
  }

  if (btnToggleSidebar) {
    btnToggleSidebar.addEventListener('click', () => {
      if (!pagesSidebar) return;
      const isCollapsed = pagesSidebar.classList.toggle('collapsed');
      btnToggleSidebar.classList.toggle('active', !isCollapsed);
    });
  }

  if (btnSidebarCollapse) {
    btnSidebarCollapse.addEventListener('click', () => {
      if (!pagesSidebar) return;
      pagesSidebar.classList.add('collapsed');
      if (btnToggleSidebar) btnToggleSidebar.classList.remove('active');
    });
  }

  if (btnSidebarAddPage) {
    btnSidebarAddPage.addEventListener('click', () => {
      createNewPage(true);
    });
  }

  // Tự động nhận diện và làm nổi bật tab trang tương ứng khi người dùng cuộn giữa các trang
  let scrollSyncTimer = null;
  let isAutoAppendingPage = false;

  // Lắng nghe tương tác thủ công từ chuột / trackpad / cảm ứng để hủy cuộn tự động nếu người dùng can thiệp
  canvasContainer.addEventListener('wheel', () => {
    if (isProgrammaticScroll) {
      cancelSmoothScroll();
    }
  }, { passive: true });

  canvasContainer.addEventListener('touchstart', () => {
    if (isProgrammaticScroll) {
      cancelSmoothScroll();
    }
  }, { passive: true });

  canvasContainer.addEventListener('scroll', () => {
    if (state.isDrawing) return;

    // Nếu đang trong quá trình cuộn tự động có chủ đích đến trang vừa bấm, KHÔNG can thiệp đè trang
    if (isProgrammaticScroll) {
      return;
    }

    const containerHeight = canvasContainer.clientHeight;
    const scrollHeight = canvasContainer.scrollHeight;
    const scrollTop = canvasContainer.scrollTop;
    const remainingDown = scrollHeight - scrollTop - containerHeight;

    // Cập nhật thanh tiến trình chân trang (Banner)
    if (scrollNewPageBanner) {
      if (remainingDown < 280) {
        scrollNewPageBanner.classList.add('active');
        if (scrollProgressBar) {
          const pct = Math.min(100, Math.max(0, (1 - remainingDown / 280) * 100));
          scrollProgressBar.style.width = `${pct}%`;
        }
      } else {
        scrollNewPageBanner.classList.remove('active');
        if (scrollProgressBar) {
          scrollProgressBar.style.width = '0%';
        }
      }
    }

    // Tự động sinh trang mới khi cuộn sát đáy (cách đáy <= 5px) với debounce chống spam trang
    if (remainingDown <= 5 && !isAutoAppendingPage) {
      isAutoAppendingPage = true;
      createNewPage(false);
      setTimeout(() => {
        isAutoAppendingPage = false;
      }, 600);
    }

    // Nhận diện chính xác trang người dùng đang xem theo diện tích hiển thị (Visible Area)
    clearTimeout(scrollSyncTimer);
    scrollSyncTimer = setTimeout(() => {
      if (isProgrammaticScroll) return;

      const containerRect = canvasContainer.getBoundingClientRect();
      let bestPage = state.currentPage;
      let maxVisibleHeight = -1;

      // Nếu cuộn chạm đỉnh -> chắc chắn Trang 1
      if (canvasContainer.scrollTop <= 20) {
        bestPage = 1;
      }
      // Nếu cuộn chạm đáy -> chắc chắn Trang cuối
      else if (remainingDown <= 20) {
        const pageNums = Object.keys(state.pages).map(Number).sort((a, b) => a - b);
        if (pageNums.length > 0) bestPage = pageNums[pageNums.length - 1];
      }
      else {
        document.querySelectorAll('.paper-wrapper').forEach(wrapper => {
          const rect = wrapper.getBoundingClientRect();
          const visibleTop = Math.max(rect.top, containerRect.top);
          const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);

          if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            const p = parseInt(wrapper.dataset.page, 10);
            if (!isNaN(p)) bestPage = p;
          }
        });
      }

      if (bestPage !== state.currentPage && !isProgrammaticScroll) {
        state.currentPage = bestPage;
        updatePageTabsActive(bestPage, false);
        updateUndoState();
        updateScrollBanner();
      }
    }, 40);
  }, { passive: true });

  // 9. Thu / Phóng & Vừa ngang cho tất cả các trang
  function updateZoom(newZoom) {
    state.zoom = Math.min(1.8, Math.max(0.4, newZoom));
    const dims = getCanvasDimensions();
    document.querySelectorAll('.paper-sheet').forEach(sheet => {
      sheet.style.transform = `scale(${state.zoom})`;
    });
    document.querySelectorAll('.paper-wrapper').forEach(wrapper => {
      wrapper.style.width = `${dims.width * state.zoom}px`;
      wrapper.style.height = `${dims.height * state.zoom}px`;
    });
    zoomLevelDisplay.textContent = `${Math.round(state.zoom * 100)}%`;
  }

  btnZoomIn.addEventListener('click', () => updateZoom(state.zoom + 0.1));
  btnZoomOut.addEventListener('click', () => updateZoom(state.zoom - 0.1));
  btnZoomReset.addEventListener('click', () => {
    const dims = getCanvasDimensions();
    const containerWidth = canvasContainer.clientWidth - 48;
    const fitZoom = containerWidth / dims.width;
    updateZoom(Math.min(1.4, Math.max(0.4, fitZoom)));
  });

  // 10. Xuất ảnh PNG & Xóa trang
  btnExportPng.addEventListener('click', () => {
    closeAllDropdowns();
    const curCanvas = getCanvasForPage(state.currentPage) || canvas;
    const link = document.createElement('a');
    link.download = `Net-${document.getElementById('doc-title').value || 'Note'}-Trang${state.currentPage}.png`;
    link.href = curCanvas.toDataURL('image/png');
    link.click();
  });

  btnClearCanvas.addEventListener('click', () => {
    closeAllDropdowns();
    if (confirm('Bạn có chắc muốn xóa sạch toàn bộ nội dung của trang này?')) {
      state.pages[state.currentPage] = [];
      state.undoStacks[state.currentPage] = [];
      state.redoStacks[state.currentPage] = [];
      renderPage();
      updateUndoState();
    }
  });

  // 11. Phím tắt chuẩn Mac (Keyboard Shortcuts)
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    } else if (e.key.toLowerCase() === 'b') {
      setPenToolMode('pen');
    } else if (e.key.toLowerCase() === 'v' || e.key.toLowerCase() === 's') {
      document.getElementById('tool-select').click();
    } else if (e.key.toLowerCase() === 'h') {
      setPenToolMode('highlighter');
    } else if (e.key.toLowerCase() === 'e') {
      const activeObj = document.getElementById('tool-eraser-object');
      const activePart = document.getElementById('tool-eraser-partial');
      if (state.activeTool === 'eraser') {
        if (state.eraserMode === 'object' && activePart) {
          activePart.click();
        } else if (activeObj) {
          activeObj.click();
        }
      } else {
        if (state.eraserMode === 'partial' && activePart) {
          activePart.click();
        } else if (activeObj) {
          activeObj.click();
        }
      }
    } else if (e.key.toLowerCase() === 't') {
      document.getElementById('tool-text').click();
    } else if (e.key.toLowerCase() === 'm') {
      const selectedList = state.selectedElements && state.selectedElements.length > 0
        ? [...state.selectedElements]
        : (state.selectedElement ? [state.selectedElement] : []);
      if (selectedList.length >= 1 && tryConstructFromSelection('midpoint', selectedList)) {
        return;
      }
      const btnMidpoint = document.querySelector('.geo-btn[data-geo="midpoint"]');
      if (btnMidpoint) btnMidpoint.click();
    } else if (e.key === 'Escape') {
      closeAllDropdowns();
      if (state.activeTool === 'geo' || state.activeTool === 'graph' || state.pendingConstruction || state.pendingOptions || (state.construction && (state.construction.point || state.construction.line || state.construction.circle || (state.construction.edges && state.construction.edges.length > 0)))) {
        finishGeoTask();
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      const selectedList = state.selectedElements && state.selectedElements.length > 0
        ? [...state.selectedElements]
        : (state.selectedElement ? [state.selectedElement] : []);

      if (selectedList.length > 0) {
        const list = state.pages[state.currentPage] || [];
        const beforePage = [...list];
        let anyDeleted = false;

        for (const el of selectedList) {
          const idx = list.indexOf(el);
          if (idx !== -1) {
            list.splice(idx, 1);
            anyDeleted = true;
          }
        }

        if (anyDeleted) {
          setSelectedElements([]);
          pushCommand({
            type: 'page-replace',
            before: beforePage,
            after: [...list]
          });
          renderPage();
        }
      }
    }
  });

  // 12. Xử lý Nhận dạng chữ viết tay (OCR) & Xuất tệp văn bản (.txt)
  const btnOcr = document.getElementById('btn-ocr');
  const btnExportTxt = document.getElementById('btn-export-txt');
  const ocrModal = document.getElementById('ocr-modal');
  const btnCloseOcrModal = document.getElementById('btn-close-ocr-modal');
  const btnRunOcr = document.getElementById('btn-run-ocr');
  const ocrSpinner = document.getElementById('ocr-spinner');
  const ocrResultText = document.getElementById('ocr-result-text');
  const ocrCharCount = document.getElementById('ocr-char-count');
  const btnCopyOcr = document.getElementById('btn-copy-ocr');
  const btnSaveTxt = document.getElementById('btn-save-txt');
  const btnInsertOcr = document.getElementById('btn-insert-ocr');
  const selectOcrLang = document.getElementById('select-ocr-lang');

  function openOcrModal() {
    ocrModal.style.display = 'flex';
    // Thu thập các đoạn chữ đã có trên trang
    const textElements = (state.pages[state.currentPage] || [])
      .filter(el => el.type === 'text')
      .map(el => el.text);

    if (textElements.length > 0 && !ocrResultText.value.trim()) {
      ocrResultText.value = textElements.join('\n');
      updateCharCount();
    }
  }

  function closeOcrModal() {
    ocrModal.style.display = 'none';
  }

  function updateCharCount() {
    const len = ocrResultText.value.length;
    ocrCharCount.textContent = `${len} ký tự`;
  }

  ocrResultText.addEventListener('input', updateCharCount);
  btnOcr.addEventListener('click', openOcrModal);
  btnCloseOcrModal.addEventListener('click', closeOcrModal);
  ocrModal.addEventListener('click', (e) => {
    if (e.target === ocrModal) closeOcrModal();
  });

  // Bắt đầu quá trình nhận dạng chữ từ Canvas
  btnRunOcr.addEventListener('click', async () => {
    btnRunOcr.disabled = true;
    ocrSpinner.style.display = 'inline-block';
    ocrSpinner.textContent = 'Đang nhận dạng chữ viết tay...';

    const lang = selectOcrLang.value; // 'vie' hoặc 'eng'

    try {
      // 1. Thu thập văn bản gõ sẵn (nếu có)
      const existingTexts = (state.pages[state.currentPage] || [])
        .filter(el => el.type === 'text')
        .map(el => el.text);

      let recognizedLines = [...existingTexts];

      // 2. Nhận dạng hình ảnh nét vẽ trên Canvas bằng Tesseract cục bộ
      if (window.Tesseract) {
        // Tạo canvas phụ tối ưu độ tương phản cho OCR
        const activeCanvas = getCanvasForPage(state.currentPage) || canvas;
        const ocrCanvas = document.createElement('canvas');
        ocrCanvas.width = activeCanvas.width;
        ocrCanvas.height = activeCanvas.height;
        const ocrCtx = ocrCanvas.getContext('2d');

        // Nền trắng, vẽ lại canvas
        ocrCtx.fillStyle = '#ffffff';
        ocrCtx.fillRect(0, 0, ocrCanvas.width, ocrCanvas.height);
        ocrCtx.drawImage(activeCanvas, 0, 0);

        const result = await window.Tesseract.recognize(ocrCanvas, lang, {
          logger: m => {
            if (m.status === 'recognizing text') {
              ocrSpinner.textContent = `Đang nhận dạng: ${Math.round(m.progress * 100)}%`;
            }
          }
        });

        const textOutput = result.data.text.trim();
        if (textOutput) {
          recognizedLines.push(textOutput);
        }
      } else {
        // Dự phòng nếu không có mạng tải CDN Tesseract
        if (recognizedLines.length === 0) {
          recognizedLines.push('[Trang hiện tại chưa có văn bản ký tự số. Khi đóng gói thành App macOS, Nét sẽ sử dụng trực tiếp Apple Vision Handwriting Recognition tích hợp sẵn trong máy].');
        }
      }

      ocrResultText.value = recognizedLines.join('\n\n');
      updateCharCount();
      ocrSpinner.textContent = 'Hoàn thành!';
      setTimeout(() => {
        ocrSpinner.style.display = 'none';
      }, 1500);
    } catch (err) {
      console.error('Lỗi nhận dạng:', err);
      ocrSpinner.textContent = 'Không thể quét nét chữ. Vui lòng thử lại!';
    } finally {
      btnRunOcr.disabled = false;
    }
  });

  // Sao chép văn bản vào Clipboard
  btnCopyOcr.addEventListener('click', async () => {
    const text = ocrResultText.value;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      const originalText = btnCopyOcr.textContent;
      btnCopyOcr.textContent = '✓ Đã sao chép';
      setTimeout(() => {
        btnCopyOcr.textContent = originalText;
      }, 2000);
    } catch (err) {
      alert('Không thể sao chép tự động: ' + err);
    }
  });

  // Tải về máy dạng tệp văn bản .txt
  function exportAsTextFile(content, fileName) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  btnSaveTxt.addEventListener('click', () => {
    const content = ocrResultText.value.trim();
    if (!content) {
      alert('Chưa có nội dung văn bản để xuất tệp!');
      return;
    }
    const docName = document.getElementById('doc-title').value.trim() || 'Ghi-chu';
    exportAsTextFile(content, `${docName}-Trang${state.currentPage}.txt`);
  });

  // Nút xuất .txt trực tiếp trên thanh công cụ trên cùng
  btnExportTxt.addEventListener('click', () => {
    closeAllDropdowns();
    // Nếu trong modal đã có nội dung, xuất nội dung đó
    let content = ocrResultText.value.trim();
    if (!content) {
      // Thu thập chữ trên trang
      const texts = (state.pages[state.currentPage] || [])
        .filter(el => el.type === 'text')
        .map(el => el.text);
      content = texts.join('\n');
    }

    if (!content) {
      // Mở modal để người dùng quét chữ viết tay
      openOcrModal();
      return;
    }

    const docName = document.getElementById('doc-title').value.trim() || 'Ghi-chu';
    exportAsTextFile(content, `${docName}-Trang${state.currentPage}.txt`);
  });

  // Chèn lại văn bản nhận dạng vào trang ghi chú
  btnInsertOcr.addEventListener('click', () => {
    const text = ocrResultText.value.trim();
    if (!text) return;

    pushNewElement({
      type: 'text',
      text: text,
      x: 100,
      y: 150,
      color: state.color
    });

    renderPage();
    closeOcrModal();
  });

  // 13. Xử lý Dán ảnh (Cmd+V / Ctrl+V), Kéo thả ảnh & Nhập tệp PDF
  const btnImportPdf = document.getElementById('btn-import-pdf');
  const inputPdfFile = document.getElementById('input-pdf-file');

  function insertImageToCurrentPage(dataUrl, customCoords = null) {
    const img = new Image();
    img.onload = () => {
      const naturalW = img.naturalWidth || 600;
      const naturalH = img.naturalHeight || 400;
      const ar = naturalW / naturalH;

      let w = Math.min(naturalW, 700);
      let h = Math.round(w / ar);
      if (h > 550) {
        h = 550;
        w = Math.round(h * ar);
      }

      let x, y;
      if (customCoords) {
        x = Math.round(customCoords.x - w / 2);
        y = Math.round(customCoords.y - h / 2);
      } else {
        const activeC = getCanvasForPage(state.currentPage) || canvas;
        const rect = activeC.getBoundingClientRect();
        const dims = getCanvasDimensions();
        const viewportCenterY = canvasContainer.scrollTop + canvasContainer.clientHeight / 2;
        const canvasY = Math.max(0, Math.min(dims.height, ((viewportCenterY - rect.top) / (rect.height || dims.height)) * dims.height));
        x = Math.max(40, Math.min(dims.width - w - 40, Math.round((dims.width - w) / 2)));
        y = Math.max(40, Math.min(dims.height - h - 40, Math.round(canvasY - h / 2)));
      }

      const imgEl = {
        type: 'image',
        src: dataUrl,
        img: img,
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(w),
        height: Math.round(h),
        aspectRatio: ar,
        id: 'img_' + Date.now()
      };

      pushNewElement(imgEl);
      setSelectedElements([imgEl]);
      // Tự động kích hoạt công cụ Chọn để người dùng nhìn thấy các chấm kéo co giãn ngay
      document.getElementById('tool-select').click();
      renderPage();
      showPageToast('🖼️ Đã dán ảnh vào trang. Kéo 4 góc để phóng to / thu nhỏ.');
    };
    img.src = dataUrl;
  }

  // Dán ảnh bằng phím tắt Cmd+V (trên Mac) hoặc Ctrl+V (trên Windows)
  window.addEventListener('paste', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (!e.clipboardData || !e.clipboardData.items) return;

    for (const item of e.clipboardData.items) {
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = item.getAsFile();
        if (!blob) continue;

        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          insertImageToCurrentPage(loadEvt.target.result);
        };
        reader.readAsDataURL(blob);
        break;
      }
    }
  });

  // Nhập tệp PDF vào trang ghi chú
  if (btnImportPdf && inputPdfFile) {
    btnImportPdf.addEventListener('click', () => {
      closeAllDropdowns();
      inputPdfFile.click();
    });

    inputPdfFile.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!window.pdfjsLib) {
        alert('Đang tải thư viện PDF.js, vui lòng thử lại sau giây lát.');
        return;
      }

      showPageToast('⏳ Đang xử lý tệp PDF...');
      try {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;

        if (numPages === 0) {
          alert('Tệp PDF không có trang nào!');
          return;
        }

        const startPage = state.currentPage;
        const currentElements = state.pages[startPage] || [];
        const isCurrentEmpty = currentElements.length === 0;

        for (let p = 1; p <= numPages; p++) {
          const page = await pdf.getPage(p);
          const viewport = page.getViewport({ scale: 2.0 }); // Độ phân giải 2x sắc nét
          const offCanvas = document.createElement('canvas');
          offCanvas.width = viewport.width;
          offCanvas.height = viewport.height;
          const offCtx = offCanvas.getContext('2d');

          await page.render({ canvasContext: offCtx, viewport: viewport }).promise;
          const dataUrl = offCanvas.toDataURL('image/png');

          const dims = getCanvasDimensions();
          const maxW = dims.width - 80;
          const maxH = dims.height - 80;
          const ratio = Math.min(maxW / viewport.width, maxH / viewport.height);
          const w = Math.round(viewport.width * ratio);
          const h = Math.round(viewport.height * ratio);
          const x = Math.round((dims.width - w) / 2);
          const y = Math.round((dims.height - h) / 2);

          const pdfImg = new Image();
          pdfImg.src = dataUrl;

          const imgEl = {
            type: 'image',
            src: dataUrl,
            img: pdfImg,
            x: x,
            y: y,
            width: w,
            height: h,
            aspectRatio: w / h,
            isPdfPage: true,
            pdfPageNum: p,
            pdfFileName: file.name,
            id: `pdf_p${p}_${Date.now()}`
          };

          let targetPageNum;
          if (p === 1 && isCurrentEmpty) {
            targetPageNum = startPage;
          } else {
            targetPageNum = createNewPage();
          }

          if (!state.pages[targetPageNum]) state.pages[targetPageNum] = [];
          state.pages[targetPageNum].push(imgEl);
        }

        switchPage(startPage);
        renderPage();
        showPageToast(`✅ Đã nhập thành công ${numPages} trang PDF! Bạn có thể viết và chú thích trực tiếp.`);
      } catch (err) {
        console.error('Lỗi nạp tệp PDF:', err);
        alert('Không thể mở tệp PDF này: ' + (err.message || 'Lỗi không xác định'));
      } finally {
        inputPdfFile.value = '';
      }
    });
  }

  // Hỗ trợ Kéo thả (Drag & Drop) tệp PDF hoặc hình ảnh vào vùng làm việc
  canvasContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    canvasContainer.classList.add('drag-over');
  });

  canvasContainer.addEventListener('dragleave', () => {
    canvasContainer.classList.remove('drag-over');
  });

  canvasContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    canvasContainer.classList.remove('drag-over');
    if (!e.dataTransfer || !e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const file = e.dataTransfer.files[0];
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      if (inputPdfFile) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputPdfFile.files = dataTransfer.files;
        inputPdfFile.dispatchEvent(new Event('change'));
      }
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        insertImageToCurrentPage(loadEvt.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  // Bắt đầu khởi tạo
  setupRetinaCanvas();
  renderAllTabs();
  renderThumbnails();
  updateScrollBanner();
  // Tự động căn vừa màn hình khi mở
  setTimeout(() => {
    btnZoomReset.click();
  }, 100);

  if (typeof window !== 'undefined') {
    window.__netInternal = {
      state,
      getCanvasCoordinates,
      getControlHandles,
      handlePointerMove,
      findHandleAt,
      findElementAt,
      findEdgeAt,
      findSnapTargetForHandle,
      pushCommand,
      undo,
      redo,
      renderPage,
      setSelectedElements,
      constructMidpoint,
      triggerMidpointWithHighlight,
      tryConstructFromSelection,
      constructBisector,
      constructBisectorFromTriangleVertex,
      constructBisectorFromAngle,
      rayIntersectSegment,
      linkGroup,
      linkGroupMulti,
      getGroupElements,
      updateDependentBindings,
      constructTangent,
      constructTwoTangents,
      constructPerpendicular,
      constructParallel,
      translateElement,
      SOLID_SHAPES,
      isSolidShape,
      computeSolidShapeData,
      DEFAULT_GEO_GROUPS,
      erasePartialAt,
      eraseElementAt,
      checkCircleSnap,
      constructAngleFromLineAndPoint,
      projectPointOnSegment,
      updateSingleStartEndBinding,
      rotateElement2D,
      rotateSelectedElement2D,
      getSelectedRotatableElement,
      animateSmoothRotation3D,
      switchPage,
      smoothScrollTo,
      createNewPage,
      ensurePageInDOM,
      handleConstructionSelectionClick,
      activateGeoTool,
      applyChosenOption,
      finalizeChosenTangent,
      finalizeChosenAngle,
      finishGeoTask,
      updatePendingAngleDegrees,
      showFloatingAngleBox,
      removeFloatingAngleBox
    };
    window.__netRotate2D = rotateElement2D;
    window.__netAnimateSmoothRotation3D = animateSmoothRotation3D;
    window.__netSwitchPage = switchPage;
  }
});

