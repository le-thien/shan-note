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

  // Điều hướng trang PDF & Đa trang (Page Navigator)
  const pageNavControl = document.getElementById('page-nav-control');
  const btnPagePrev = document.getElementById('btn-page-prev');
  const btnPageNext = document.getElementById('btn-page-next');
  const inputPageNumber = document.getElementById('input-page-number');
  const pageNavTotal = document.getElementById('page-nav-total');

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
    strokeWidth: 1.5,
    dashStyle: 'solid', // 'solid' | 'dashed'
    penSmoothing: 'ultra', // Luôn luôn cố định ở chế độ Siêu siêu mượt (Ultra Streamline)
    lastSmoothedPressure: 0.5,
    streamlinePos: null,
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
    // Quét kéo chọn vùng (Area / Marquee Selection)
    isAreaSelecting: false,
    isFromAreaSelect: false,
    areaSelectStart: null,
    areaSelectCurrent: null,
    areaSelectPage: null,
    // Bộ nhớ đệm cho Cắt / Sao chép / Dán đối tượng
    clipboardElements: [],
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
    if (typeof getCurrentToolCursor === 'function') {
      targetCanvas.style.cursor = getCurrentToolCursor();
    }

    const targetCtx = targetCanvas.getContext('2d');
    targetCtx.scale(dpr, dpr);
  }

  function setupRetinaCanvas() {
    document.querySelectorAll('canvas.main-canvas, #main-canvas').forEach(c => {
      setupRetinaCanvasFor(c);
    });
    renderPage();
  }

  // Chuyển đổi tọa độ con trỏ chuột/bút thành tọa độ thực của Canvas trên từng trang (Tối ưu Reflow với bộ đệm BoundingClientRect)
  function getCanvasCoordinates(e) {
    const targetCanvas = state.activeCanvas || (e && e.currentTarget) || (e && e.target && e.target.closest('canvas')) || getCanvasForPage(state.currentPage) || canvas;
    const rect = (state.isDrawing && state.cachedCanvasRect && state.cachedCanvasTarget === targetCanvas)
      ? state.cachedCanvasRect
      : targetCanvas.getBoundingClientRect();
    if (state.isDrawing && !state.cachedCanvasRect) {
      state.cachedCanvasRect = rect;
      state.cachedCanvasTarget = targetCanvas;
    }
    const dims = getCanvasDimensions();
    const scaleX = dims.width / (rect.width || dims.width);
    const scaleY = dims.height / (rect.height || dims.height);
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      pressure: e.pressure && e.pressure > 0 ? e.pressure : 0.5,
      pointerType: e.pointerType || 'mouse',
      time: (e && e.timeStamp) ? e.timeStamp : Date.now()
    };
  }

  // Quản lý cập nhật hình thu nhỏ (Thumbnail) theo cơ chế hoãn thông minh (Debounce), không chiếm dụng luồng vẽ bút
  const pendingThumbnails = new Set();
  let thumbnailDebounceTimer = null;
  function scheduleThumbnailUpdate(p) {
    if (!p) return;
    pendingThumbnails.add(p);
    if (thumbnailDebounceTimer) return;
    thumbnailDebounceTimer = setTimeout(() => {
      thumbnailDebounceTimer = null;
      const list = Array.from(pendingThumbnails);
      pendingThumbnails.clear();
      for (const pg of list) {
        if (typeof updateThumbnail === 'function') {
          updateThumbnail(pg);
        }
      }
    }, 350);
  }

  function renderAllPages() {
    renderPage('all');
  }

  // 4. Cơ chế vẽ lại các trang (Renderer tối ưu hiệu năng cao - Chỉ render trang hiện tại nếu không chỉ định)
  function renderPage(targetPageNum) {
    let pageNums;
    if (targetPageNum === 'all' || targetPageNum === true) {
      pageNums = Object.keys(state.pages).map(Number);
    } else if (typeof targetPageNum === 'number') {
      pageNums = [targetPageNum];
    } else if (Array.isArray(targetPageNum)) {
      pageNums = targetPageNum;
    } else {
      // Mặc định chỉ vẽ lại trang hiện tại (Tránh duyệt lại toàn bộ các trang khác khi người dùng đang viết)
      pageNums = [state.currentPage || 1];
    }
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
        drawElement(el, p);
      }

      // Hiển thị khung viền chọn và các nút điều khiển (CHỈ khi đang ở công cụ Chọn đối tượng)
      if (state.activeTool === 'select') {
        const selectedList = state.selectedElements && state.selectedElements.length > 0
          ? state.selectedElements
          : (state.selectedElement ? [state.selectedElement] : []);

        // Helper phân giải 2 đầu mút thực tế của cạnh đang chọn / đang hover
        const resolveEdgeSegment = (edgeObj) => {
          if (!edgeObj || !edgeObj.element) return null;
          const edgeEl = edgeObj.element;
          let eStart = edgeObj.start;
          let eEnd = edgeObj.end;
          if (
            edgeEl.shape === 'line' ||
            edgeEl.shape === 'perpendicular' ||
            edgeEl.shape === 'parallel' ||
            edgeEl.shape === 'bisector' ||
            edgeEl.shape === 'tangent' ||
            edgeEl.shape === 'perpendicular-bisector'
          ) {
            eStart = edgeEl.start;
            eEnd = edgeEl.end;
          } else if (edgeEl.points && edgeObj.v1Index !== undefined && edgeObj.v2Index !== undefined) {
            eStart = edgeEl.points[edgeObj.v1Index] || eStart;
            eEnd = edgeEl.points[edgeObj.v2Index] || eEnd;
          } else if (edgeEl.shape === 'inscribed-triangle' && edgeEl.triPoints && edgeObj.v1Index !== undefined && edgeObj.v2Index !== undefined) {
            eStart = edgeEl.triPoints[edgeObj.v1Index] || eStart;
            eEnd = edgeEl.triPoints[edgeObj.v2Index] || eEnd;
          }
          if (!eStart || !eEnd) return null;
          return { start: eStart, end: eEnd };
        };

        // Helper phân giải tọa độ thực tế của Điểm / Đỉnh đang chọn
        const resolveVertexCoords = (vObj) => {
          if (!vObj || !vObj.element) return null;
          const vEl = vObj.element;
          if (vEl.shape === 'point') return vEl.start;
          if (vEl.points && vObj.vIndex !== undefined && vEl.points[vObj.vIndex]) {
            return vEl.points[vObj.vIndex];
          }
          if (vEl.shape === 'inscribed-triangle' && vEl.triPoints && vObj.vIndex !== undefined && vEl.triPoints[vObj.vIndex]) {
            return vEl.triPoints[vObj.vIndex];
          }
          if (vObj.handleId && vObj.handleId.startsWith('p') && vEl.points) {
            const idx = parseInt(vObj.handleId.replace('p', ''), 10);
            if (!isNaN(idx) && vEl.points[idx]) return vEl.points[idx];
          }
          if (vObj.handleId && vObj.handleId.startsWith('tri_') && vEl.triPoints) {
            const idx = parseInt(vObj.handleId.replace('tri_', ''), 10);
            if (!isNaN(idx) && vEl.triPoints[idx]) return vEl.triPoints[idx];
          }
          if (vObj.handleId === 'center' && vEl.start) return vEl.start;
          if (vObj.handleId === 'start' && vEl.start) return vEl.start;
          if (vObj.handleId === 'end' && vEl.end) return vEl.end;
          if (vObj.handleId === 'foot' && vEl.foot) return vEl.foot;
          if (vObj.handleId === 'midpoint' && vEl.midpoint) return vEl.midpoint;
          if (vObj.handleId === 'tangentPoint' && vEl.tangentPoint) return vEl.tangentPoint;
          if (vObj.x !== undefined && vObj.y !== undefined) return { x: vObj.x, y: vObj.y };
          return null;
        };

        const isSingleSubElementSelect =
          selectedList.length === 1 &&
          !state.isFromAreaSelect &&
          ((state.selectedVertex && state.selectedVertex.element === selectedList[0]) ||
           (state.selectedEdge && state.selectedEdge.element === selectedList[0]));

        for (const el of selectedList) {
          if (elements.includes(el)) {
            if (selectedList.length === 1) {
              // Nếu chỉ chọn 1 Đỉnh hoặc 1 Cạnh bằng thao tác bấm chuột đơn -> KHÔNG vẽ viền sáng cả hình và KHÔNG vẽ khung nét đứt bao quanh cả hình!
              // Chỉ khi Quét chọn cả hình (state.isFromAreaSelect === true) hoặc chọn đối tượng không tách cạnh/đỉnh mới vẽ khung bao toàn hình.
              if (!isSingleSubElementSelect) {
                drawSelectionOutline(el);
              }
            } else {
              highlightElementShape(targetCtx, el, true);
            }
          }
        }

        // Nếu có nhiều hơn 1 đối tượng được chọn: vẽ 1 khung bao tổng thể (Unified Selection Frame)
        if (selectedList.length > 1 && state.currentPage === p && !state.isAreaSelecting) {
          drawUnifiedSelectionBoundingBox(targetCtx, selectedList);
        }

        // Làm sáng nhẹ đúng bộ phận đang hover (Ưu tiên: Đỉnh -> Cạnh -> Thân hình)
        if (!state.isDrawing && state.currentPage === p) {
          if (state.hoverEdge && state.hoverEdge.element && elements.includes(state.hoverEdge.element)) {
            const seg = resolveEdgeSegment(state.hoverEdge);
            if (seg) {
              const hEdgeEl = state.hoverEdge.element;
              targetCtx.save();
              targetCtx.strokeStyle = '#10b981';
              targetCtx.lineWidth = (hEdgeEl.width || 2) + 5;
              targetCtx.lineCap = 'round';
              targetCtx.globalAlpha = 0.35;
              targetCtx.beginPath();
              targetCtx.moveTo(seg.start.x, seg.start.y);
              targetCtx.lineTo(seg.end.x, seg.end.y);
              targetCtx.stroke();
              targetCtx.restore();
            }
          } else if (state.hoverElement && elements.includes(state.hoverElement) && !state.hoverHandle) {
            if (!selectedList.includes(state.hoverElement)) {
              highlightElementShape(targetCtx, state.hoverElement, false);
            }
          }
        }

        // Làm sáng mờ 2 đối tượng tạo nên giao điểm khi rê chuột vào giao điểm ở tác vụ Điểm
        if (state.activeTool === 'geo' && state.activeGeo === 'point' && state.hoverIntersectionElements && state.hoverIntersectionElements.length > 0) {
          for (const hEl of state.hoverIntersectionElements) {
            if (elements.includes(hEl)) {
              highlightElementShape(targetCtx, hEl, false);
            }
          }
        }

        // Chỉ vẽ toàn bộ chốt điều khiển của cả hình khi Quét chọn cả hình (state.isFromAreaSelect) hoặc chọn đối tượng nguyên khối
        if (selectedList.length > 0 && !isSingleSubElementSelect) {
          for (const el of selectedList) {
            if (elements.includes(el)) {
              drawControlHandles(el);
            }
          }
        } else if (selectedList.length === 0) {
          // Khi chưa có hình nào được chọn: Nếu hover trúng 1 đỉnh cụ thể, chỉ vẽ chấm tròn của đỉnh đó
          if (state.hoverHandle && elements.includes(state.hoverHandle.element)) {
            const hh = state.hoverHandle.handle;
            if (hh && !hh.isRotate2D && !hh.isRotate3D) {
              targetCtx.save();
              targetCtx.beginPath();
              targetCtx.arc(hh.x, hh.y, 6, 0, Math.PI * 2);
              targetCtx.fillStyle = '#ffffff';
              targetCtx.fill();
              targetCtx.lineWidth = 2.2;
              targetCtx.strokeStyle = '#10b981';
              targetCtx.stroke();
              targetCtx.restore();
            }
          } else if (state.hoverElement && elements.includes(state.hoverElement) && !state.hoverEdge) {
            drawControlHandles(state.hoverElement, true);
          }
        }

        // Vẽ sáng RIÊNG CẠNH ĐÃ CHỌN (selectedEdge) - chỉ sáng đúng 1 cạnh đó + 2 đầu mút của cạnh
        if (state.selectedEdge && state.currentPage === p && !state.activeHandle && !state.isDrawing && !state.isFromAreaSelect) {
          const edgeEl = state.selectedEdge.element;
          if (edgeEl && elements.includes(edgeEl) && isElementSelected(edgeEl)) {
            const seg = resolveEdgeSegment(state.selectedEdge);
            if (seg) {
              targetCtx.save();
              targetCtx.strokeStyle = '#10b981';
              targetCtx.lineWidth = (edgeEl.width || 2) + 6;
              targetCtx.lineCap = 'round';
              targetCtx.globalAlpha = 0.6;
              targetCtx.beginPath();
              targetCtx.moveTo(seg.start.x, seg.start.y);
              targetCtx.lineTo(seg.end.x, seg.end.y);
              targetCtx.stroke();

              // Vẽ 2 chấm tròn ở 2 đầu mút của riêng cạnh được chọn để người dùng biết rõ giới hạn cạnh
              targetCtx.globalAlpha = 1;
              for (const ep of [seg.start, seg.end]) {
                targetCtx.beginPath();
                targetCtx.arc(ep.x, ep.y, 5, 0, Math.PI * 2);
                targetCtx.fillStyle = '#ffffff';
                targetCtx.fill();
                targetCtx.lineWidth = 2.2;
                targetCtx.strokeStyle = '#10b981';
                targetCtx.stroke();
              }
              targetCtx.restore();
            }
          } else {
            state.selectedEdge = null;
          }
        }

        // Vẽ sáng RIÊNG ĐỈNH / ĐIỂM ĐÃ CHỌN (selectedVertex) - chỉ sáng đúng 1 đỉnh/điểm đó + mũi tên chỉ báo
        if (state.selectedVertex && state.currentPage === p && !state.activeHandle && !state.isDrawing && !state.isFromAreaSelect) {
          const vEl = state.selectedVertex.element;
          if (vEl && elements.includes(vEl) && isElementSelected(vEl)) {
            const vPt = resolveVertexCoords(state.selectedVertex);
            if (vPt) {
              targetCtx.save();
              targetCtx.beginPath();
              targetCtx.arc(vPt.x, vPt.y, 14, 0, Math.PI * 2);
              targetCtx.fillStyle = 'rgba(16, 185, 129, 0.35)';
              targetCtx.fill();
              targetCtx.beginPath();
              targetCtx.arc(vPt.x, vPt.y, 6, 0, Math.PI * 2);
              targetCtx.fillStyle = '#10b981';
              targetCtx.fill();
              targetCtx.strokeStyle = '#ffffff';
              targetCtx.lineWidth = 2.2;
              targetCtx.stroke();
              targetCtx.restore();
              drawSharpArrowIndicator(targetCtx, vPt.x, vPt.y, state.selectedVertex.name || 'Đỉnh', true);
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

      // Hiển thị vòng tròn đầu tẩy trực quan khi đang kéo tẩy nét trên mặt giấy
      if (state.activeTool === 'eraser' && state.eraserMode === 'partial' && state.isDrawing && state.eraserCursorPoint && state.currentPage === p) {
        const eRad = state.eraserRadius || 12;
        targetCtx.save();
        targetCtx.beginPath();
        targetCtx.arc(state.eraserCursorPoint.x, state.eraserCursorPoint.y, eRad, 0, Math.PI * 2);
        targetCtx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
        targetCtx.lineWidth = 1;
        targetCtx.setLineDash([2, 2]);
        targetCtx.fillStyle = 'rgba(239, 68, 68, 0.08)';
        targetCtx.fill();
        targetCtx.stroke();

        targetCtx.beginPath();
        targetCtx.arc(state.eraserCursorPoint.x, state.eraserCursorPoint.y, 1, 0, Math.PI * 2);
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

      // Hiển thị khung quét nhận dạng chữ viết tay (OCR Scan Box)
      if (state.activeTool === 'ocr' && state.isOcrScanning && state.ocrScanStart && state.ocrScanCurrent && state.currentPage === p) {
        const sx = state.ocrScanStart.x;
        const sy = state.ocrScanStart.y;
        const cx = state.ocrScanCurrent.x;
        const cy = state.ocrScanCurrent.y;
        const bx = Math.min(sx, cx);
        const by = Math.min(sy, cy);
        const bw = Math.abs(cx - sx);
        const bh = Math.abs(cy - sy);

        targetCtx.save();
        // Lớp mờ nền vùng quét
        targetCtx.fillStyle = 'rgba(40, 99, 78, 0.12)';
        targetCtx.fillRect(bx, by, bw, bh);

        // Viền nét đứt
        targetCtx.strokeStyle = '#28634e';
        targetCtx.lineWidth = 2;
        targetCtx.setLineDash([6, 4]);
        targetCtx.strokeRect(bx, by, bw, bh);
        targetCtx.setLineDash([]);

        // 4 góc định vị camera kiểu scan
        const arm = Math.min(16, Math.max(6, Math.min(bw, bh) / 3));
        targetCtx.lineWidth = 3;
        targetCtx.strokeStyle = '#1e4f3e';

        // Góc trên trái
        targetCtx.beginPath();
        targetCtx.moveTo(bx, by + arm);
        targetCtx.lineTo(bx, by);
        targetCtx.lineTo(bx + arm, by);
        targetCtx.stroke();

        // Góc trên phải
        targetCtx.beginPath();
        targetCtx.moveTo(bx + bw - arm, by);
        targetCtx.lineTo(bx + bw, by);
        targetCtx.lineTo(bx + bw, by + arm);
        targetCtx.stroke();

        // Góc dưới trái
        targetCtx.beginPath();
        targetCtx.moveTo(bx, by + bh - arm);
        targetCtx.lineTo(bx, by + bh);
        targetCtx.lineTo(bx + arm, by + bh);
        targetCtx.stroke();

        // Góc dưới phải
        targetCtx.beginPath();
        targetCtx.moveTo(bx + bw - arm, by + bh);
        targetCtx.lineTo(bx + bw, by + bh);
        targetCtx.lineTo(bx + bw, by + bh - arm);
        targetCtx.stroke();

        // Nhãn chỉ báo nổi
        targetCtx.fillStyle = '#1e4f3e';
        targetCtx.font = 'bold 12px var(--font-main, sans-serif)';
        targetCtx.fillText(`🔍 Vùng quét OCR: ${Math.round(bw)} × ${Math.round(bh)} px`, bx + 4, by > 22 ? by - 6 : by + bh + 16);
        targetCtx.restore();
      }

      // Hiển thị khung quét chọn vùng (Area / Marquee Selection Box)
      if (state.activeTool === 'select' && state.isAreaSelecting && state.areaSelectStart && state.areaSelectCurrent && state.currentPage === p) {
        drawAreaSelectionSweepBox(targetCtx, state.areaSelectStart, state.areaSelectCurrent, elements);
      }

      ctx = prevCtx;

      if (typeof scheduleThumbnailUpdate === 'function') {
        scheduleThumbnailUpdate(p);
      } else if (typeof updateThumbnail === 'function') {
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
      if (el.isPdfPage) return [];
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
    } else if (el.shape === 'perpendicular' || el.shape === 'perpendicular-bisector') {
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

    // Tay cầm xoay 2D cho các đối tượng phẳng (tam giác, tứ giác, chữ nhật, bình hành, thoi, đoạn thẳng, nét vẽ, ảnh...)
    // Hiển thị trực quan khi người dùng chọn 1 đối tượng hoặc bật showRotationHandle
    const isSingleSelected = state.activeTool === 'select' && state.selectedElements && state.selectedElements.length === 1 && state.selectedElements[0] === el;
    if ((state.showRotationHandle || isSingleSelected) && (el.type === 'geo' || el.type === 'stroke' || el.type === 'image') && !isSolidShape(el.shape) && el.shape !== 'point') {
      const box = getElementBoundingBox(el);
      if (box && ((box.maxX - box.minX >= 15) || (box.maxY - box.minY >= 15))) {
        const cx = (box.minX + box.maxX) / 2;
        const cy = (box.minY + box.maxY) / 2;
        handles.push({
          id: 'rot2d',
          x: cx,
          y: box.minY - 32,
          isRotate2D: true,
          topY: box.minY - 10,
          cx: cx,
          cy: cy,
          cursor: 'grab',
          name: 'Tay cầm xoay 🔄 (Kéo chuột để xoay đối tượng)'
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

  function isSecondaryBoundHandle(el, h) {
    if (!el || !h) return false;
    if (el.shape === 'line') {
      if (h.id === 'start' && el.startBinding) return true;
      if (h.id === 'end' && el.endBinding) return true;
    }
    if (el.shape === 'tangent' || el.shape === 'perpendicular' || el.shape === 'parallel' || el.shape === 'perpendicular-bisector' || el.shape === 'bisector') {
      if (el.binding) return true;
    }
    return false;
  }

  // Tìm điểm nút điều khiển dưới con trỏ với bán kính rộng (28px - 34px) và luôn ưu tiên nút gần nhất
  function findHandleAt(x, y, maxDistance = 28) {
    let best = null;
    let bestScore = Infinity;

    function checkElementHandles(el, limitDist, bonus = 0) {
      if (!el) return;
      const handles = getControlHandles(el);
      for (const h of handles) {
        const d = Math.hypot(h.x - x, h.y - y);
        if (d <= limitDist) {
          const penalty = isSecondaryBoundHandle(el, h) ? 14 : 0;
          const score = d + penalty - bonus;
          if (score < bestScore) {
            bestScore = score;
            best = { handle: h, element: el, distance: d };
          }
        }
      }
    }

    // 1. Các nút điều khiển của phần tử đang được chọn
    if (state.selectedElement) {
      checkElementHandles(state.selectedElement, maxDistance + 6, 2);
    }

    // 2. Nếu có danh sách nhiều đối tượng đang chọn
    if (state.selectedElements && state.selectedElements.length > 0) {
      for (const el of state.selectedElements) {
        checkElementHandles(el, maxDistance + 4, 2);
      }
    }

    // 3. Tìm trong tất cả các hình vẽ trên trang (ưu tiên nút gốc / chủ thể điều khiển)
    const list = state.pages[state.currentPage] || [];
    for (let i = list.length - 1; i >= 0; i--) {
      const el = list[i];
      if (el.type === 'geo' || el.type === 'image' || el.type === 'graph-widget') {
        checkElementHandles(el, maxDistance, 0);
      }
    }
    return best;
  }

  // Bắt dính thông minh (Magnetic Snapping) cho đỉnh tam giác hoặc đầu mút đoạn thẳng vào các điểm/hình khác
  function findSnapTargetForHandle(point, currentEl, currentHandle, maxDist = 22) {
    const list = state.pages[state.currentPage] || [];
    let best = null;
    let minDist = maxDist;
    const depSet = currentEl ? new Set(getDependentElements(currentEl)) : new Set();

    function testPt(px, py, label, targetEl, vIndex, pointKey) {
      const d = Math.hypot(point.x - px, point.y - py);
      if (d < minDist) {
        minDist = d;
        best = { x: px, y: py, label: label, element: targetEl, vIndex, pointKey };
      }
    }

    for (let i = list.length - 1; i >= 0; i--) {
      const el = list[i];
      if (el.type !== 'geo') continue;
      if (depSet.has(el)) continue;

      if (el.shape === 'point') {
        if (el !== currentEl) testPt(el.start.x, el.start.y, 'Điểm', el, undefined, 'start');
      } else if (el.shape === 'line' || el.shape === 'tangent') {
        if (el.tangentPoint && el !== currentEl) testPt(el.tangentPoint.x, el.tangentPoint.y, 'Tiếp điểm T', el, undefined, 'tangentPoint');
        if (el !== currentEl || (currentHandle && currentHandle.id !== 'start')) testPt(el.start.x, el.start.y, 'Đầu mút', el, undefined, 'start');
        if (el !== currentEl || (currentHandle && currentHandle.id !== 'end')) testPt(el.end.x, el.end.y, 'Đầu mút', el, undefined, 'end');
      } else if (el.shape === 'triangle' || el.shape === 'right-triangle' || el.shape === 'isosceles-triangle' || el.shape === 'rectangle' || el.shape === 'square' || el.shape === 'parallelogram' || el.shape === 'rhombus' || isSolidShape(el.shape)) {
        if (el.points) {
          el.points.forEach((p, idx) => {
            if (el !== currentEl || !currentHandle || currentHandle.index !== idx) {
              testPt(p.x, p.y, p.name ? `Đỉnh ${p.name}` : `Đỉnh ${idx + 1}`, el, idx, undefined);
            }
          });
        }
      } else if (el.shape === 'circle' || el.shape === 'inscribed-triangle' || el.shape === 'two-tangents' || el.shape === 'ellipse') {
        if (el !== currentEl) {
          testPt(el.start.x, el.start.y, 'Tâm O', el, undefined, 'start');
          if (el.tangentPoint1) testPt(el.tangentPoint1.x, el.tangentPoint1.y, 'Tiếp điểm T1', el, undefined, 'tangentPoint1');
          if (el.tangentPoint2) testPt(el.tangentPoint2.x, el.tangentPoint2.y, 'Tiếp điểm T2', el, undefined, 'tangentPoint2');
        }
      }
    }

    const circSnap = checkCircleSnap(point, currentEl);
    if (circSnap && !depSet.has(circSnap.circle) && (!best || Math.hypot(point.x - circSnap.x, point.y - circSnap.y) < minDist)) {
      return { x: circSnap.x, y: circSnap.y, label: 'Chu vi đường tròn', isCircle: true, circle: circSnap.circle, angle: circSnap.angle };
    }

    return best;
  }

  // Kiểm tra bắt dính và gắn chặt vào đường tròn gần nhất (Circle Snapping)
  function checkCircleSnap(point, ignoreEl = null) {
    const list = state.pages[state.currentPage] || [];
    const snapDist = 24;

    for (const item of list) {
      if (item === ignoreEl) continue;
      if (item.type === 'geo' && (item.shape === 'circle' || item.shape === 'inscribed-triangle' || item.shape === 'two-tangents')) {
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

  // Con trỏ cây bút mực thanh lịch và bút dạ quang nghiêng 45 độ, đầu ngòi đặt chính xác tại tọa độ vẽ (1 27)
  const PEN_CURSOR = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><path d='M1 27 L6.5 24 L24.5 6 C25.8 4.7 25.8 2.6 24.5 1.3 C23.2 0 21.1 0 19.8 1.3 L2 19 L0 26 Z' fill='none' stroke='%23ffffff' stroke-width='2.2' stroke-linejoin='round'/><path d='M6.5 24 L24.5 6 C25.8 4.7 25.8 2.6 24.5 1.3 C23.2 0 21.1 0 19.8 1.3 L2 19 Z' fill='%23243c36'/><path d='M5 19 L19.8 4.2 L21.5 5.9 L6.7 20.7 Z' fill='%23ffffff' opacity='0.35'/><line x1='5.2' y1='20.8' x2='8.2' y2='23.8' stroke='%23e2b93b' stroke-width='1.8' stroke-linecap='round'/><path d='M2 19 L6.5 24 L1 27 Z' fill='%23cbd5e1' stroke='%23475569' stroke-width='0.6'/><line x1='1' y1='27' x2='4.2' y2='21.8' stroke='%231e293b' stroke-width='0.75'/><circle cx='1.2' cy='26.8' r='1' fill='%2310b981'/></svg>\") 1 27, crosshair";
  const HIGHLIGHTER_CURSOR = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><path d='M1 27 L6 27 L25 8 C26.2 6.8 26.2 4.8 25 3.6 L23.4 2 C22.2 0.8 20.2 0.8 19 2 L1 20 Z' fill='none' stroke='%23ffffff' stroke-width='2.2' stroke-linejoin='round'/><path d='M6 24 L24.5 5.5 C25.5 4.5 25.5 3 24.5 2 C23.5 1 22 1 21 2 L2.5 20.5 Z' fill='%2328634e'/><path d='M5 19.5 L19.5 5 L21 6.5 L6.5 21 Z' fill='%23ffffff' opacity='0.35'/><path d='M1 27 L6 27 L4 23 L0 25 Z' fill='%2310b981' fill-opacity='0.85' stroke='%23ffffff' stroke-width='0.5'/><line x1='1' y1='27' x2='6' y2='27' stroke='%23059669' stroke-width='1.5' stroke-linecap='round'/></svg>\") 1 27, crosshair";

  function getPenCursor() {
    return state.activeTool === 'highlighter' ? HIGHLIGHTER_CURSOR : PEN_CURSOR;
  }

  // Con trỏ vòng tròn đo đúng kích thước đầu tẩy theo thời gian thực (Real-time Eraser Circle Cursor)
  function getEraserCursor(radius) {
    const r = Math.max(3, Math.min(32, Math.round(radius || 12)));
    const size = Math.max(24, Math.ceil((r + 2) * 2));
    const cx = Math.floor(size / 2);
    const cy = Math.floor(size / 2);
    return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'><circle cx='${cx}' cy='${cy}' r='${r}' fill='rgba(239,68,68,0.12)' stroke='%23ef4444' stroke-width='1.5' stroke-dasharray='3 2'/><circle cx='${cx}' cy='${cy}' r='1.2' fill='%23ef4444'/></svg>") ${cx} ${cy}, crosshair`;
  }

  function getCurrentToolCursor() {
    if (state.activeTool === 'select') return SHARP_ARROW_CURSOR;
    if (state.activeTool === 'pen') return PEN_CURSOR;
    if (state.activeTool === 'highlighter') return HIGHLIGHTER_CURSOR;
    if (state.activeTool === 'eraser') return getEraserCursor(state.eraserRadius || 12);
    if (state.activeTool === 'geo' && state.activeGeo === 'midpoint') return SHARP_ARROW_CURSOR;
    return 'crosshair';
  }

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
      } else if (el.shape === 'line' || el.shape === 'perpendicular' || el.shape === 'parallel' || el.shape === 'tangent' || el.shape === 'bisector' || el.shape === 'perpendicular-bisector') {
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

          if (el.shape === 'cone' && el.points[1] && el.points[3]) {
            const O = el.points[1], B = el.points[3];
            const rx = Math.max(15, Math.abs(B.x - O.x)), ry = Math.max(8, rx * 0.28);
            c.save();
            c.beginPath();
            c.ellipse(O.x, O.y, rx, ry, 0, 0, Math.PI * 2);
            c.lineWidth = (el.width || 2) + glowWidth;
            c.strokeStyle = strokeGlow;
            c.stroke();
            c.restore();
          } else if (el.shape === 'cylinder' && el.points[0] && el.points[2] && el.points[3] && el.points[5]) {
            const O1 = el.points[0], B1 = el.points[2];
            const rx1 = Math.max(15, Math.abs(B1.x - O1.x)), ry1 = Math.max(8, rx1 * 0.28);
            const O2 = el.points[3], B2 = el.points[5];
            const rx2 = Math.max(15, Math.abs(B2.x - O2.x)), ry2 = Math.max(8, rx2 * 0.28);
            c.save();
            c.lineWidth = (el.width || 2) + glowWidth;
            c.strokeStyle = strokeGlow;
            c.beginPath();
            c.ellipse(O1.x, O1.y, rx1, ry1, 0, 0, Math.PI * 2);
            c.stroke();
            c.beginPath();
            c.ellipse(O2.x, O2.y, rx2, ry2, 0, 0, Math.PI * 2);
            c.stroke();
            c.restore();
          } else if (el.shape === 'sphere' && el.points[0] && el.points[1]) {
            const O = el.points[0], M = el.points[1];
            const R = Math.max(15, Math.hypot(M.x - O.x, M.y - O.y));
            const ry = Math.max(8, R * 0.30);
            c.save();
            c.lineWidth = (el.width || 2) + glowWidth;
            c.strokeStyle = strokeGlow;
            c.beginPath();
            c.arc(O.x, O.y, R, 0, Math.PI * 2);
            c.stroke();
            c.beginPath();
            c.ellipse(O.x, O.y, R, ry, 0, 0, Math.PI * 2);
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

    // 2. Với các hình (không phải điểm hoặc đoạn thẳng đơn lẻ), vẽ thêm viền đứt nét kèm 4 góc tay cầm định vị trực quan
    if (el.type !== 'geo' || (el.shape !== 'point' && el.shape !== 'line')) {
      const box = getElementBoundingBox(el);
      if (box) {
        ctx.save();
        ctx.strokeStyle = 'rgba(40, 99, 78, 0.65)';
        ctx.lineWidth = 1.3;
        ctx.setLineDash([5, 4]);

        const pad = 10;
        const w = (box.maxX - box.minX) + pad * 2;
        const h = (box.maxY - box.minY) + pad * 2;
        const x = box.minX - pad;
        const y = box.minY - pad;

        ctx.strokeRect(x, y, w, h);
        ctx.setLineDash([]);

        // 4 góc tay cầm tròn định vị chuẩn xác
        const corners = [
          { x: x, y: y },
          { x: x + w, y: y },
          { x: x + w, y: y + h },
          { x: x, y: y + h }
        ];
        for (const cp of corners) {
          ctx.beginPath();
          ctx.arc(cp.x, cp.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.lineWidth = 1.8;
          ctx.strokeStyle = '#28634e';
          ctx.stroke();
        }

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
      if (el.shape === 'circle' || el.shape === 'inscribed-triangle') {
        const r = Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
        return {
          minX: el.start.x - r,
          maxX: el.start.x + r,
          minY: el.start.y - r,
          maxY: el.start.y + r
        };
      }
      if (el.shape === 'two-tangents') {
        const r = el.radius || Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
        let minX = el.start.x - r;
        let maxX = el.start.x + r;
        let minY = el.start.y - r;
        let maxY = el.start.y + r;
        if (el.end) {
          minX = Math.min(minX, el.end.x);
          maxX = Math.max(maxX, el.end.x);
          minY = Math.min(minY, el.end.y);
          maxY = Math.max(maxY, el.end.y);
        }
        return { minX, maxX, minY, maxY };
      }
      if (el.shape === 'sphere') {
        const r = Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
        return {
          minX: el.start.x - r,
          maxX: el.start.x + r,
          minY: el.start.y - r,
          maxY: el.start.y + r
        };
      }
      if (el.shape === 'cone') {
        const rx = Math.max(20, Math.abs(el.end.x - el.start.x));
        const ry = Math.max(8, Math.round(rx * 0.32));
        return {
          minX: el.start.x - rx,
          maxX: el.start.x + rx,
          minY: Math.min(el.start.y, el.end.y - ry),
          maxY: Math.max(el.start.y, el.end.y + ry)
        };
      }
      if (el.shape === 'cylinder') {
        const rx = Math.max(20, Math.abs(el.end.x - el.start.x) / 2);
        const ry = Math.max(8, Math.round(rx * 0.3));
        const cx = (el.start.x + el.end.x) / 2;
        return {
          minX: cx - rx,
          maxX: cx + rx,
          minY: Math.min(el.start.y, el.end.y) - ry,
          maxY: Math.max(el.start.y, el.end.y) + ry
        };
      }
      if (el.shape === 'angle') {
        const rad = ((el.angleDeg || 60) * Math.PI) / 180;
        const armLen = el.armLength || 65;
        const baseDir = (typeof el.baseDir === 'number') ? el.baseDir : Math.atan2(el.end.y - el.start.y, el.end.x - el.start.x);
        const dir = (el.direction !== undefined) ? el.direction : ((el.binding && el.binding.direction !== undefined) ? el.binding.direction : -1);
        const p2 = el.secondPoint || {
          x: el.start.x + armLen * Math.cos(baseDir + dir * rad),
          y: el.start.y + armLen * Math.sin(baseDir + dir * rad)
        };
        return {
          minX: Math.min(el.start.x, el.end.x, p2.x),
          maxX: Math.max(el.start.x, el.end.x, p2.x),
          minY: Math.min(el.start.y, el.end.y, p2.y),
          maxY: Math.max(el.start.y, el.end.y, p2.y)
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
      const fontSize = el.fontSize || 22;
      const lineHeight = Math.round(fontSize * 1.35);
      const lines = (el.text || '').split('\n');
      let maxLen = 0;
      for (const line of lines) {
        if (line.length > maxLen) maxLen = line.length;
      }
      const approxWidth = Math.max(40, maxLen * (fontSize * 0.58));
      const totalHeight = Math.max(fontSize, lines.length * lineHeight);
      return {
        minX: el.x,
        maxX: el.x + approxWidth,
        minY: el.y - 4,
        maxY: el.y + totalHeight + 4
      };
    } else if (el.type === 'image') {
      return {
        minX: el.x,
        maxX: el.x + el.width,
        minY: el.y,
        maxY: el.y + el.height
      };
    } else if (el.type === 'graph-widget') {
      return {
        minX: el.x || 0,
        maxX: (el.x || 0) + (el.width || 420),
        minY: el.y || 0,
        maxY: (el.y || 0) + (el.height || 360)
      };
    }
    return null;
  }

  // Tính hộp bao tổng thể (Combined Bounding Box) cho một danh sách đối tượng
  function getCombinedBoundingBox(elements) {
    if (!elements || elements.length === 0) return null;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const el of elements) {
      const box = getElementBoundingBox(el);
      if (box) {
        if (box.minX < minX) minX = box.minX;
        if (box.maxX > maxX) maxX = box.maxX;
        if (box.minY < minY) minY = box.minY;
        if (box.maxY > maxY) maxY = box.maxY;
      }
    }
    if (!isFinite(minX) || !isFinite(maxX) || !isFinite(minY) || !isFinite(maxY)) return null;
    return { minX, maxX, minY, maxY };
  }

  // Kiểm tra đoạn thẳng có cắt qua hình chữ nhật hay không
  function lineIntersectsRect(p1, p2, rect) {
    if (!p1 || !p2 || !rect) return false;
    const minX = rect.minX, maxX = rect.maxX, minY = rect.minY, maxY = rect.maxY;
    function ccw(A, B, C) {
      return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
    }
    function intersect(A, B, C, D) {
      return ccw(A, C, D) !== ccw(B, C, D) && ccw(A, B, C) !== ccw(A, B, D);
    }
    const tl = { x: minX, y: minY }, tr = { x: maxX, y: minY };
    const br = { x: maxX, y: maxY }, bl = { x: minX, y: maxY };
    return intersect(p1, p2, tl, tr) || intersect(p1, p2, tr, br) ||
           intersect(p1, p2, br, bl) || intersect(p1, p2, bl, tl);
  }

  // Kiểm tra một đối tượng có nằm trong hoặc cắt qua vùng quét chữ nhật hay không
  function isElementInSelectionBox(el, rect) {
    if (!el || !rect) return false;
    if (el.isPdfPage) return false; // Không quét chọn nhầm trang PDF nền
    const box = getElementBoundingBox(el);
    if (!box) return false;

    // 1. Không giao cắt với hộp bao -> Chắc chắn không chọn
    if (box.maxX < rect.minX || box.minX > rect.maxX || box.maxY < rect.minY || box.minY > rect.maxY) {
      return false;
    }

    // 2. Hộp bao nằm trọn bên trong vùng quét -> Chọn
    if (box.minX >= rect.minX && box.maxX <= rect.maxX && box.minY >= rect.minY && box.maxY <= rect.maxY) {
      return true;
    }

    // 3. Giao cắt một phần:
    // Với nét vẽ tự do (stroke)
    if (el.type === 'stroke' && el.points && el.points.length > 0) {
      return el.points.some(p => p.x >= rect.minX && p.x <= rect.maxX && p.y >= rect.minY && p.y <= rect.maxY);
    }

    // Với hình học (geo)
    if (el.type === 'geo') {
      if (el.shape === 'point' && el.start) {
        return el.start.x >= rect.minX && el.start.x <= rect.maxX && el.start.y >= rect.minY && el.start.y <= rect.maxY;
      }
      if (el.points && el.points.length > 0) {
        return el.points.some(p => p.x >= rect.minX && p.x <= rect.maxX && p.y >= rect.minY && p.y <= rect.maxY);
      }
      if (el.start && el.end) {
        if ((el.start.x >= rect.minX && el.start.x <= rect.maxX && el.start.y >= rect.minY && el.start.y <= rect.maxY) ||
            (el.end.x >= rect.minX && el.end.x <= rect.maxX && el.end.y >= rect.minY && el.end.y <= rect.maxY)) {
          return true;
        }
        if (lineIntersectsRect(el.start, el.end, rect)) return true;
      }
      if (el.shape === 'circle' || el.shape === 'ellipse') {
        if (el.start && el.start.x >= rect.minX && el.start.x <= rect.maxX && el.start.y >= rect.minY && el.start.y <= rect.maxY) {
          return true;
        }
      }
    }

    // Với văn bản, ảnh, widget... giao cắt hộp bao là chọn
    return true;
  }

  // Kiểm tra một điểm có nằm trong hộp bao hay không
  function isPointInsideBox(px, py, box, pad = 12) {
    if (!box) return false;
    return px >= (box.minX - pad) && px <= (box.maxX + pad) &&
           py >= (box.minY - pad) && py <= (box.maxY + pad);
  }

  // Sao chép sâu một nhóm đối tượng, cấp phát ID mới và cập nhật các liên kết nội bộ
  function cloneElementsGroup(elements, offset = { dx: 25, dy: 25 }) {
    if (!elements || elements.length === 0) return [];
    const idMap = new Map();
    const groupMap = new Map();
    const clones = elements.map(el => {
      const clone = JSON.parse(JSON.stringify(el));
      const oldId = clone.id;
      const newId = 'el_' + Date.now().toString(36) + '_' + (elementIdCounter++);
      clone.id = newId;
      if (oldId) idMap.set(oldId, newId);
      if (clone.groupId) {
        if (!groupMap.has(clone.groupId)) {
          groupMap.set(clone.groupId, 'grp_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6));
        }
        clone.groupId = groupMap.get(clone.groupId);
      }
      return clone;
    });

    for (const clone of clones) {
      if (clone.parentId) clone.parentId = idMap.has(clone.parentId) ? idMap.get(clone.parentId) : null;
      if (clone.triangleId) clone.triangleId = idMap.has(clone.triangleId) ? idMap.get(clone.triangleId) : null;
      if (clone.axisId) clone.axisId = idMap.has(clone.axisId) ? idMap.get(clone.axisId) : null;
      if (clone.pt1Id) clone.pt1Id = idMap.has(clone.pt1Id) ? idMap.get(clone.pt1Id) : null;
      if (clone.pt2Id) clone.pt2Id = idMap.has(clone.pt2Id) ? idMap.get(clone.pt2Id) : null;
      if (clone.pt3Id) clone.pt3Id = idMap.has(clone.pt3Id) ? idMap.get(clone.pt3Id) : null;
      if (clone.startBinding) {
        const pId = clone.startBinding.parentId || clone.startBinding.elementId;
        if (pId && !idMap.has(pId)) {
          delete clone.startBinding;
        } else {
          if (clone.startBinding.parentId && idMap.has(clone.startBinding.parentId)) clone.startBinding.parentId = idMap.get(clone.startBinding.parentId);
          if (clone.startBinding.elementId && idMap.has(clone.startBinding.elementId)) clone.startBinding.elementId = idMap.get(clone.startBinding.elementId);
        }
      }
      if (clone.endBinding) {
        const pId = clone.endBinding.parentId || clone.endBinding.elementId;
        if (pId && !idMap.has(pId)) {
          delete clone.endBinding;
        } else {
          if (clone.endBinding.parentId && idMap.has(clone.endBinding.parentId)) clone.endBinding.parentId = idMap.get(clone.endBinding.parentId);
          if (clone.endBinding.elementId && idMap.has(clone.endBinding.elementId)) clone.endBinding.elementId = idMap.get(clone.endBinding.elementId);
        }
      }
      if (clone.binding) {
        let missingParent = false;
        for (const k in clone.binding) {
          const val = clone.binding[k];
          if (val && typeof val === 'string' && val.startsWith('el_')) {
            if (idMap.has(val)) {
              clone.binding[k] = idMap.get(val);
            } else {
              missingParent = true;
            }
          }
        }
        if (missingParent) {
          delete clone.binding;
        }
      }
      if (offset.dx !== 0 || offset.dy !== 0) {
        const dummySet = new Set();
        translateElement(clone, offset.dx, offset.dy, dummySet);
      }
    }
    return clones;
  }

  // Tác vụ: Cắt các đối tượng đang chọn
  function cutSelectedElements() {
    const selected = (state.selectedElements || []).filter(el => (state.pages[state.currentPage] || []).includes(el));
    if (selected.length === 0) return;
    state.clipboardElements = JSON.parse(JSON.stringify(selected));
    const list = state.pages[state.currentPage] || [];
    const before = [...list];
    state.pages[state.currentPage] = list.filter(el => !selected.includes(el));
    pushCommand({
      type: 'page-replace',
      before: before,
      after: [...state.pages[state.currentPage]]
    });
    setSelectedElements([]);
    hideFloatingSelectionBar();
    renderPage();
    showPageToast(`✂️ Đã cắt ${selected.length} đối tượng`);
  }

  // Tác vụ: Sao chép các đối tượng đang chọn
  function copySelectedElements() {
    const selected = (state.selectedElements || []).filter(el => (state.pages[state.currentPage] || []).includes(el));
    if (selected.length === 0) return;
    state.clipboardElements = JSON.parse(JSON.stringify(selected));
    showPageToast(`📋 Đã sao chép ${selected.length} đối tượng`);
  }

  // Tác vụ: Dán các đối tượng từ bộ nhớ đệm
  function pasteClipboardElements(targetPoint = null) {
    if (!state.clipboardElements || state.clipboardElements.length === 0) return;
    const box = getCombinedBoundingBox(state.clipboardElements);
    let offset = { dx: 25, dy: 25 };
    if (targetPoint && box) {
      const curCenterX = (box.minX + box.maxX) / 2;
      const curCenterY = (box.minY + box.maxY) / 2;
      offset = { dx: targetPoint.x - curCenterX, dy: targetPoint.y - curCenterY };
    }
    const clones = cloneElementsGroup(state.clipboardElements, offset);
    const list = state.pages[state.currentPage] || [];
    const before = [...list];
    state.pages[state.currentPage] = [...list, ...clones];
    pushCommand({
      type: 'page-replace',
      before: before,
      after: [...state.pages[state.currentPage]]
    });
    setSelectedElements(clones);
    showFloatingSelectionBar(clones);
    renderPage();
    showPageToast(`📋 Đã dán ${clones.length} đối tượng`);
  }

  // Tác vụ: Nhân bản các đối tượng đang chọn
  function duplicateSelectedElements() {
    const selected = (state.selectedElements || []).filter(el => (state.pages[state.currentPage] || []).includes(el));
    if (selected.length === 0) return;
    const clones = cloneElementsGroup(selected, { dx: 25, dy: 25 });
    const list = state.pages[state.currentPage] || [];
    const before = [...list];
    state.pages[state.currentPage] = [...list, ...clones];
    pushCommand({
      type: 'page-replace',
      before: before,
      after: [...state.pages[state.currentPage]]
    });
    setSelectedElements(clones);
    showFloatingSelectionBar(clones);
    renderPage();
    showPageToast(`📑 Đã nhân bản ${clones.length} đối tượng`);
  }

  // Tác vụ: Xóa các đối tượng đang chọn
  function deleteSelectedElements() {
    const selected = (state.selectedElements || []).filter(el => (state.pages[state.currentPage] || []).includes(el));
    if (selected.length === 0) return;
    const list = state.pages[state.currentPage] || [];
    const before = [...list];
    state.pages[state.currentPage] = list.filter(el => !selected.includes(el));
    pushCommand({
      type: 'page-replace',
      before: before,
      after: [...state.pages[state.currentPage]]
    });
    setSelectedElements([]);
    hideFloatingSelectionBar();
    renderPage();
    showPageToast(`🗑 Đã xóa ${selected.length} đối tượng`);
  }

  // Tác vụ: Đổi màu cho tất cả các đối tượng đang chọn
  function changeSelectedElementsColor(newColor) {
    const selected = (state.selectedElements || []).filter(el => (state.pages[state.currentPage] || []).includes(el));
    if (selected.length === 0 || !newColor) return;
    const list = state.pages[state.currentPage] || [];
    const before = JSON.parse(JSON.stringify(list));
    for (const el of selected) {
      if (el.color !== undefined) el.color = newColor;
      if (el.stroke !== undefined) el.stroke = newColor;
      if (el.fill && el.fill !== 'transparent' && el.fill !== 'none') {
        el.fill = newColor;
      }
    }
    pushCommand({
      type: 'page-replace',
      before: before,
      after: JSON.parse(JSON.stringify(state.pages[state.currentPage]))
    });
    const dot = document.getElementById('fsb-color-dot');
    if (dot) dot.style.backgroundColor = newColor;
    renderPage();
    showPageToast(`🎨 Đã đổi màu ${selected.length} đối tượng`);
  }

  // Tác vụ: Xoay các đối tượng đang chọn 90°
  function rotateSelectedElements(rad = Math.PI / 2) {
    const selected = (state.selectedElements || []).filter(el => (state.pages[state.currentPage] || []).includes(el));
    if (selected.length === 0) return;
    const box = getCombinedBoundingBox(selected);
    if (!box) return;
    const cx = (box.minX + box.maxX) / 2;
    const cy = (box.minY + box.maxY) / 2;
    const list = state.pages[state.currentPage] || [];
    const before = JSON.parse(JSON.stringify(list));
    const rotSet = new Set();
    for (const el of selected) {
      rotateElement2D(el, cx, cy, rad, rotSet);
    }
    for (const el of rotSet) {
      updateDependentBindings(el);
    }
    pushCommand({
      type: 'page-replace',
      before: before,
      after: JSON.parse(JSON.stringify(state.pages[state.currentPage]))
    });
    showFloatingSelectionBar(selected);
    renderPage();
    showPageToast(`🔄 Đã xoay các đối tượng`);
  }

  // Tác vụ: Đổi kiểu nét (Liền ⇋ Đứt) cho các đối tượng đang chọn
  function toggleSelectedElementsDash() {
    const selected = (state.selectedElements || []).filter(el => (state.pages[state.currentPage] || []).includes(el));
    if (selected.length === 0) return;
    const list = state.pages[state.currentPage] || [];
    const before = JSON.parse(JSON.stringify(list));

    if (state.selectedEdge) {
      const eEl = state.selectedEdge.element;
      if (eEl && isSolidShape(eEl.shape) && eEl.edges) {
        const v1 = state.selectedEdge.v1Index;
        const v2 = state.selectedEdge.v2Index;
        const ed = eEl.edges.find(e => (e[0] === v1 && e[1] === v2) || (e[0] === v2 && e[1] === v1));
        if (ed) {
          ed[2] = (ed[2] === 'dashed') ? 'solid' : 'dashed';
          pushCommand({
            type: 'page-replace',
            before: before,
            after: JSON.parse(JSON.stringify(state.pages[state.currentPage]))
          });
          updateFloatingBarState(selected);
          renderPage();
          showPageToast(ed[2] === 'dashed' ? '〰️ Cạnh đã chuyển sang Nét đứt' : '➖ Cạnh đã chuyển sang Nét liền');
          return;
        }
      } else if (eEl && eEl.points && state.selectedEdge.isPolygonEdge) {
        if (!eEl.edgeDashes) eEl.edgeDashes = {};
        const v1 = state.selectedEdge.v1Index;
        eEl.edgeDashes[v1] = (eEl.edgeDashes[v1] === 'dashed') ? 'solid' : 'dashed';
        pushCommand({
          type: 'page-replace',
          before: before,
          after: JSON.parse(JSON.stringify(state.pages[state.currentPage]))
        });
        updateFloatingBarState(selected);
        renderPage();
        showPageToast(eEl.edgeDashes[v1] === 'dashed' ? '〰️ Cạnh đã chuyển sang Nét đứt' : '➖ Cạnh đã chuyển sang Nét liền');
        return;
      }
    }

    const firstEl = selected[0];
    const isCurrentDashed = firstEl.dash === 'dashed' || firstEl.dashStyle === 'dashed';
    const newDash = isCurrentDashed ? 'solid' : 'dashed';
    for (const el of selected) {
      el.dash = newDash;
      el.dashStyle = newDash;
    }
    pushCommand({
      type: 'page-replace',
      before: before,
      after: JSON.parse(JSON.stringify(state.pages[state.currentPage]))
    });
    updateFloatingBarState(selected);
    renderPage();
    showPageToast(newDash === 'dashed' ? '〰️ Đã chuyển sang Nét đứt' : '➖ Đã chuyển sang Nét liền');
  }

  // Tác vụ: Đổi độ dày nét cho các đối tượng đang chọn
  function changeSelectedElementsWidth(newWidth) {
    const numW = Math.round(Math.max(1, Math.min(5, parseFloat(newWidth) || 1.5)) * 10) / 10;
    const selected = (state.selectedElements || []).filter(el => (state.pages[state.currentPage] || []).includes(el));
    if (selected.length === 0 || !numW) return;
    const list = state.pages[state.currentPage] || [];
    const before = JSON.parse(JSON.stringify(list));
    for (const el of selected) {
      el.width = numW;
    }
    pushCommand({
      type: 'page-replace',
      before: before,
      after: JSON.parse(JSON.stringify(state.pages[state.currentPage]))
    });
    updateFloatingBarState(selected);
    renderPage();
    showPageToast(`📏 Độ dày nét: ${numW}px`);
  }

  // Nhóm các đối tượng được chọn lại với nhau (⌘G)
  function groupSelectedElements() {
    const selected = (state.selectedElements && state.selectedElements.length > 0)
      ? state.selectedElements
      : (state.selectedElement ? [state.selectedElement] : []);
    if (selected.length < 2) {
      showPageToast('⚠️ Cần chọn ít nhất 2 đối tượng để nhóm (⌘G)');
      return;
    }
    const pageEls = state.pages[state.currentPage] || [];
    const existingGroupIds = new Set();
    for (const el of selected) {
      if (el && el.groupId) existingGroupIds.add(el.groupId);
    }
    const targetSet = new Set(selected);
    if (existingGroupIds.size > 0) {
      for (const item of pageEls) {
        if (item && item.groupId && existingGroupIds.has(item.groupId)) {
          targetSet.add(item);
        }
      }
    }
    const allToGroup = Array.from(targetSet);
    const newGroupId = 'grp_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const items = allToGroup.map(el => {
      ensureElementId(el);
      return {
        element: el,
        beforeGroupId: el.groupId || null,
        afterGroupId: newGroupId,
        beforeManualGroup: Boolean(el.isManualGroup),
        afterManualGroup: true,
        beforeUngrouped: Boolean(el.isUngrouped),
        afterUngrouped: false
      };
    });
    for (const it of items) {
      it.element.groupId = newGroupId;
      it.element.isManualGroup = true;
      it.element.isUngrouped = false;
    }
    pushCommand({
      type: 'group-elements',
      items: items
    });
    state.isFromAreaSelect = true;
    setSelectedElements(allToGroup);
    updateFloatingBarState(allToGroup);
    renderPage();
    showPageToast(`🔗 Đã nhóm ${allToGroup.length} đối tượng (⌘G)`);
  }

  // Rã nhóm các đối tượng đang chọn (⌘⇧G)
  function ungroupSelectedElements() {
    const selected = (state.selectedElements && state.selectedElements.length > 0)
      ? state.selectedElements
      : (state.selectedElement ? [state.selectedElement] : []);
    const groupIds = new Set();
    const targetSet = new Set();
    for (const el of selected) {
      if (!el) continue;
      if (el.groupId) groupIds.add(el.groupId);
      const connected = getGroupElements(el);
      if (connected.length > 1) {
        for (const c of connected) {
          targetSet.add(c);
          if (c.groupId) groupIds.add(c.groupId);
        }
      }
    }
    const pageEls = state.pages[state.currentPage] || [];
    for (const el of pageEls) {
      if (el && el.groupId && groupIds.has(el.groupId)) {
        targetSet.add(el);
      }
    }
    const toUngroup = Array.from(targetSet);
    if (toUngroup.length === 0) {
      showPageToast('⚠️ Các đối tượng đang chọn không thuộc nhóm nào');
      return;
    }
    const items = toUngroup.map(el => ({
      element: el,
      beforeGroupId: el.groupId || null,
      afterGroupId: null,
      beforeManualGroup: Boolean(el.isManualGroup),
      afterManualGroup: false,
      beforeUngrouped: Boolean(el.isUngrouped),
      afterUngrouped: true
    }));
    for (const it of items) {
      it.element.groupId = null;
      it.element.isManualGroup = false;
      it.element.isUngrouped = true;
    }
    pushCommand({
      type: 'ungroup-elements',
      items: items
    });
    updateFloatingBarState(selected);
    renderPage();
    showPageToast(`🔓 Đã rã nhóm ${toUngroup.length} đối tượng (⌘⇧G)`);
  }

  // Đồng bộ trạng thái hiển thị của các nút trên thanh tác vụ nhanh theo đối tượng đang chọn
  function updateFloatingBarState(elements) {
    if (!elements || elements.length === 0) return;
    const bar = document.getElementById('floating-selection-bar');
    if (!bar) return;
    const firstEl = elements[0];

    // Cập nhật chấm màu
    const activeCol = firstEl.color || firstEl.stroke || '#28634e';
    const dot = bar.querySelector('#fsb-color-dot');
    if (dot) dot.style.backgroundColor = activeCol;

    // Cập nhật nút kiểu nét
    const isDashed = firstEl.dash === 'dashed' || firstEl.dashStyle === 'dashed';
    const iconSolid = bar.querySelector('#fsb-dash-icon-solid');
    const iconDashed = bar.querySelector('#fsb-dash-icon-dashed');
    const labelDash = bar.querySelector('#fsb-dash-label');
    const btnDash = bar.querySelector('#fsb-btn-dash');

    if (firstEl.type === 'image') {
      if (btnDash) btnDash.style.display = 'none';
    } else {
      if (btnDash) btnDash.style.display = 'inline-flex';
      if (iconSolid) iconSolid.style.display = isDashed ? 'none' : 'inline-block';
      if (iconDashed) iconDashed.style.display = isDashed ? 'inline-block' : 'none';
      if (labelDash) labelDash.textContent = isDashed ? 'Nét đứt' : 'Nét liền';
      if (btnDash) {
        btnDash.classList.toggle('active', isDashed);
        btnDash.title = isDashed ? 'Đang là Nét đứt (Bấm để đổi thành Nét liền)' : 'Đang là Nét liền (Bấm để đổi thành Nét đứt)';
      }
    }

    // Cập nhật nút độ dày nét
    const btnWidth = bar.querySelector('#fsb-btn-width');
    const labelWidth = bar.querySelector('#fsb-width-label');
    const fsbSlider = bar.querySelector('#fsb-width-slider');
    if (firstEl.type === 'image') {
      if (btnWidth) btnWidth.style.display = 'none';
    } else {
      if (btnWidth) btnWidth.style.display = 'inline-flex';
      const curW = Math.round((firstEl.width !== undefined ? firstEl.width : 1.5) * 10) / 10;
      if (labelWidth) labelWidth.textContent = `${curW}px`;
      if (fsbSlider) fsbSlider.value = String(Math.max(1, Math.min(5, curW)));
      const wItems = bar.querySelectorAll('.fsb-width-item');
      wItems.forEach(item => {
        const itemW = parseFloat(item.dataset.width);
        item.classList.toggle('active', Math.abs(itemW - curW) < 0.05);
      });
    }

    // Cập nhật nút nhóm và rã nhóm
    const btnGroup = bar.querySelector('#fsb-btn-group');
    const btnUngroup = bar.querySelector('#fsb-btn-ungroup');
    const allSameManualGroup = elements && elements.length >= 2 &&
      Boolean(elements[0].groupId && elements[0].isManualGroup) &&
      elements.every(el => el.groupId === elements[0].groupId && el.isManualGroup);
    if (btnGroup) {
      btnGroup.style.display = (elements && elements.length >= 2 && !allSameManualGroup) ? 'inline-flex' : 'none';
    }
    if (btnUngroup) {
      const hasGroup = elements && elements.some(el => Boolean(el.groupId) || (!el.isUngrouped && getGroupElements(el).length > 1));
      btnUngroup.style.display = hasGroup ? 'inline-flex' : 'none';
    }
  }

  // Khởi tạo phần tử Thanh tác vụ nhanh vùng chọn
  function createFloatingSelectionBar() {
    let bar = document.getElementById('floating-selection-bar');
    if (bar) return bar;

    bar = document.createElement('div');
    bar.className = 'floating-selection-bar';
    bar.id = 'floating-selection-bar';
    bar.style.display = 'none';

    bar.innerHTML = `
      <div class="fsb-group">
        <button type="button" class="fsb-btn" id="fsb-btn-cut" title="Cắt đối tượng (⌘X)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
            <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
            <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
          </svg>
          <span>Cắt</span>
        </button>
        <button type="button" class="fsb-btn" id="fsb-btn-copy" title="Sao chép (⌘C)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Chép</span>
        </button>
        <button type="button" class="fsb-btn" id="fsb-btn-duplicate" title="Nhân bản (⌘D)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="8" y="8" width="12" height="12" rx="2"></rect>
            <path d="M4 16V4a2 2 0 0 1 2-2h12"></path>
            <line x1="14" y1="11" x2="14" y2="17"></line>
            <line x1="11" y1="14" x2="17" y2="14"></line>
          </svg>
          <span>Nhân bản</span>
        </button>
        <button type="button" class="fsb-btn" id="fsb-btn-group" title="Nhóm các đối tượng lại với nhau (⌘G)" style="display:none;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <span>Nhóm</span>
        </button>
        <button type="button" class="fsb-btn" id="fsb-btn-ungroup" title="Rã nhóm các đối tượng (⌘⇧G)" style="display:none;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18.84 12.25l1.72-1.71a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M5.16 11.75l-1.72 1.71a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            <line x1="2" y1="2" x2="22" y2="22"></line>
          </svg>
          <span>Rã nhóm</span>
        </button>
      </div>
      <div class="fsb-divider"></div>
      <div class="fsb-group">
        <div class="fsb-color-picker-wrap">
          <button type="button" class="fsb-btn" id="fsb-btn-color" title="Đổi màu nét / hình">
            <span class="fsb-color-dot" id="fsb-color-dot" style="background:#28634e;"></span>
            <span>Màu</span>
          </button>
          <div class="fsb-color-palette" id="fsb-color-palette" style="display:none;">
            <span class="fsb-color-swatch" data-color="#30493c" style="background:#30493c;" title="Mực xanh đậm"></span>
            <span class="fsb-color-swatch" data-color="#537fc1" style="background:#537fc1;" title="Xanh dương"></span>
            <span class="fsb-color-swatch" data-color="#cf7969" style="background:#cf7969;" title="Đỏ cam"></span>
            <span class="fsb-color-swatch" data-color="#b6a24c" style="background:#b6a24c;" title="Vàng kim"></span>
            <span class="fsb-color-swatch" data-color="#10b981" style="background:#10b981;" title="Ngọc bích"></span>
            <span class="fsb-color-swatch" data-color="#243c36" style="background:#243c36;" title="Đen mực"></span>
            <input type="color" id="fsb-custom-color" class="fsb-custom-color-input" title="Chọn màu bất kỳ" value="#28634e">
          </div>
        </div>
        <button type="button" class="fsb-btn" id="fsb-btn-dash" title="Đổi kiểu nét: Nét liền ⇋ Nét đứt">
          <svg id="fsb-dash-icon-solid" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="2" y1="12" x2="22" y2="12"></line>
          </svg>
          <svg id="fsb-dash-icon-dashed" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="4 3" style="display:none;">
            <line x1="2" y1="12" x2="22" y2="12"></line>
          </svg>
          <span id="fsb-dash-label">Nét liền</span>
        </button>
        <div class="fsb-width-picker-wrap">
          <button type="button" class="fsb-btn" id="fsb-btn-width" title="Đổi độ dày nét">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6" stroke-width="1.5"></line>
              <line x1="3" y1="12" x2="21" y2="12" stroke-width="2.5"></line>
              <line x1="3" y1="18" x2="21" y2="18" stroke-width="4"></line>
            </svg>
            <span id="fsb-width-label">Độ dày</span>
          </button>
          <div class="fsb-width-palette" id="fsb-width-palette" style="display:none;">
            <input type="range" id="fsb-width-slider" min="1" max="5" step="0.1" value="1.5" title="Kéo chọn độ dày nét thập phân (1 – 5)" style="width:90px; accent-color:#235b47; cursor:pointer; margin:0 4px;">
            <div class="fsb-width-item" data-width="1" title="1px">
              <span class="fsb-width-line" style="height:1px;"></span>
              <span>1</span>
            </div>
            <div class="fsb-width-item" data-width="1.5" title="Mặc định (1.5px)">
              <span class="fsb-width-line" style="height:1.5px;"></span>
              <span>1.5</span>
            </div>
            <div class="fsb-width-item" data-width="2" title="2px">
              <span class="fsb-width-line" style="height:2px;"></span>
              <span>2</span>
            </div>
            <div class="fsb-width-item" data-width="3" title="3px">
              <span class="fsb-width-line" style="height:3px;"></span>
              <span>3</span>
            </div>
            <div class="fsb-width-item" data-width="4" title="4px">
              <span class="fsb-width-line" style="height:4px;"></span>
              <span>4</span>
            </div>
            <div class="fsb-width-item" data-width="5" title="5px">
              <span class="fsb-width-line" style="height:5px;"></span>
              <span>5</span>
            </div>
          </div>
        </div>
        <button type="button" class="fsb-btn" id="fsb-btn-rotate" title="Xoay 90°">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
          </svg>
          <span>Xoay</span>
        </button>
      </div>
      <div class="fsb-divider"></div>
      <div class="fsb-group">
        <button type="button" class="fsb-btn fsb-btn-delete" id="fsb-btn-delete" title="Xóa đối tượng (Delete / Backspace)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span>Xóa</span>
        </button>
        <button type="button" class="fsb-btn fsb-btn-close" id="fsb-btn-close" title="Bỏ chọn (Escape)">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    // Ngăn chặn nổi bọt sự kiện để không gây kích hoạt vẽ trên canvas
    bar.addEventListener('pointerdown', (e) => e.stopPropagation());
    bar.addEventListener('mousedown', (e) => e.stopPropagation());
    bar.addEventListener('click', (e) => e.stopPropagation());

    bar.querySelector('#fsb-btn-cut').addEventListener('click', (e) => {
      e.stopPropagation();
      cutSelectedElements();
    });

    bar.querySelector('#fsb-btn-copy').addEventListener('click', (e) => {
      e.stopPropagation();
      copySelectedElements();
    });

    bar.querySelector('#fsb-btn-duplicate').addEventListener('click', (e) => {
      e.stopPropagation();
      duplicateSelectedElements();
    });

    const btnGroup = bar.querySelector('#fsb-btn-group');
    if (btnGroup) {
      btnGroup.addEventListener('click', (e) => {
        e.stopPropagation();
        groupSelectedElements();
      });
    }

    const btnUngroup = bar.querySelector('#fsb-btn-ungroup');
    if (btnUngroup) {
      btnUngroup.addEventListener('click', (e) => {
        e.stopPropagation();
        ungroupSelectedElements();
      });
    }

    bar.querySelector('#fsb-btn-dash').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSelectedElementsDash();
    });

    bar.querySelector('#fsb-btn-rotate').addEventListener('click', (e) => {
      e.stopPropagation();
      rotateSelectedElements(Math.PI / 2);
    });

    bar.querySelector('#fsb-btn-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteSelectedElements();
    });

    bar.querySelector('#fsb-btn-close').addEventListener('click', (e) => {
      e.stopPropagation();
      state.isFromAreaSelect = false;
      setSelectedElements([]);
      hideFloatingSelectionBar();
      renderPage();
    });

    const btnColor = bar.querySelector('#fsb-btn-color');
    const paletteColor = bar.querySelector('#fsb-color-palette');
    const btnWidth = bar.querySelector('#fsb-btn-width');
    const paletteWidth = bar.querySelector('#fsb-width-palette');

    btnColor.addEventListener('click', (e) => {
      e.stopPropagation();
      if (paletteWidth) paletteWidth.style.display = 'none';
      paletteColor.style.display = (paletteColor.style.display === 'flex') ? 'none' : 'flex';
    });

    btnWidth.addEventListener('click', (e) => {
      e.stopPropagation();
      if (paletteColor) paletteColor.style.display = 'none';
      paletteWidth.style.display = (paletteWidth.style.display === 'flex') ? 'none' : 'flex';
    });

    paletteColor.querySelectorAll('.fsb-color-swatch').forEach(sw => {
      sw.addEventListener('click', (e) => {
        e.stopPropagation();
        const col = sw.dataset.color;
        changeSelectedElementsColor(col);
        paletteColor.style.display = 'none';
      });
    });

    paletteWidth.querySelectorAll('.fsb-width-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const w = item.dataset.width;
        changeSelectedElementsWidth(w);
        paletteWidth.style.display = 'none';
      });
    });

    const fsbSlider = bar.querySelector('#fsb-width-slider');
    if (fsbSlider) {
      fsbSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        const numW = Math.round(Math.max(1, Math.min(5, parseFloat(e.target.value) || 1.5)) * 10) / 10;
        const selected = (state.selectedElements || []).filter(el => (state.pages[state.currentPage] || []).includes(el));
        for (const el of selected) {
          el.width = numW;
        }
        updateFloatingBarState(selected);
        renderPage();
      });
      fsbSlider.addEventListener('change', (e) => {
        e.stopPropagation();
        changeSelectedElementsWidth(e.target.value);
      });
    }

    const customColor = bar.querySelector('#fsb-custom-color');
    customColor.addEventListener('input', (e) => {
      e.stopPropagation();
      changeSelectedElementsColor(e.target.value);
    });

    document.addEventListener('pointerdown', (e) => {
      if (bar.style.display !== 'none' && !bar.contains(e.target)) {
        if (paletteColor) paletteColor.style.display = 'none';
        if (paletteWidth) paletteWidth.style.display = 'none';
      }
    });

    return bar;
  }

  // Hiển thị thanh tác vụ nhanh tại vị trí phía trên hộp bao đối tượng (CHỈ HIỂN THỊ KHI QUÉT VÙNG CHỌN)
  function showFloatingSelectionBar(elements) {
    if (!state.isFromAreaSelect || !elements || elements.length === 0 || state.activeTool !== 'select') {
      hideFloatingSelectionBar();
      return;
    }
    const box = getCombinedBoundingBox(elements);
    if (!box) {
      hideFloatingSelectionBar();
      return;
    }

    const sheet = (typeof getPaperSheetForPage === 'function' ? getPaperSheetForPage(state.currentPage) : null) ||
                  document.querySelector(`.paper-sheet[data-page="${state.currentPage}"]`) ||
                  document.querySelector('.paper-sheet');
    if (!sheet) return;

    let bar = createFloatingSelectionBar();
    if (bar.parentNode !== sheet) {
      sheet.appendChild(bar);
    }

    updateFloatingBarState(elements);

    // Đóng các palette nếu đang mở
    const palColor = bar.querySelector('#fsb-color-palette');
    if (palColor) palColor.style.display = 'none';
    const palWidth = bar.querySelector('#fsb-width-palette');
    if (palWidth) palWidth.style.display = 'none';

    const centerX = (box.minX + box.maxX) / 2;
    const barW = 430;
    const pad = 14;
    const dims = getCanvasDimensions();
    let posX = Math.max(barW / 2 + 10, Math.min((dims.width || 1600) - barW / 2 - 10, centerX));
    let posY = box.minY - 42;

    if (posY < 55) {
      posY = box.maxY + pad + 38;
      bar.classList.add('fsb-position-below');
    } else {
      bar.classList.remove('fsb-position-below');
    }

    bar.style.left = `${posX}px`;
    bar.style.top = `${posY}px`;
    bar.style.display = 'flex';
  }

  // Ẩn thanh tác vụ nhanh vùng chọn
  function hideFloatingSelectionBar() {
    const bar = document.getElementById('floating-selection-bar');
    if (bar) {
      bar.style.display = 'none';
      const palColor = bar.querySelector('#fsb-color-palette');
      if (palColor) palColor.style.display = 'none';
      const palWidth = bar.querySelector('#fsb-width-palette');
      if (palWidth) palWidth.style.display = 'none';
    }
  }

  // Vẽ khung quét chọn vùng thời gian thực
  function drawAreaSelectionSweepBox(targetCtx, startPt, currPt, elements) {
    const bx = Math.min(startPt.x, currPt.x);
    const by = Math.min(startPt.y, currPt.y);
    const bw = Math.abs(currPt.x - startPt.x);
    const bh = Math.abs(currPt.y - startPt.y);

    targetCtx.save();
    // Lớp phủ nền mờ ngọc bích êm dịu
    targetCtx.fillStyle = 'rgba(40, 99, 78, 0.08)';
    targetCtx.fillRect(bx, by, bw, bh);

    // Viền nét đứt
    targetCtx.strokeStyle = '#28634e';
    targetCtx.lineWidth = 1.5;
    targetCtx.setLineDash([5, 4]);
    targetCtx.strokeRect(bx, by, bw, bh);
    targetCtx.setLineDash([]);

    // 4 góc định vị camera kiểu scan hiện đại
    const arm = Math.min(14, Math.max(5, Math.min(bw, bh) / 4));
    targetCtx.lineWidth = 2.5;
    targetCtx.strokeStyle = '#1e4f3e';

    // Góc trên trái
    targetCtx.beginPath();
    targetCtx.moveTo(bx, by + arm);
    targetCtx.lineTo(bx, by);
    targetCtx.lineTo(bx + arm, by);
    targetCtx.stroke();

    // Góc trên phải
    targetCtx.beginPath();
    targetCtx.moveTo(bx + bw - arm, by);
    targetCtx.lineTo(bx + bw, by);
    targetCtx.lineTo(bx + bw, by + arm);
    targetCtx.stroke();

    // Góc dưới trái
    targetCtx.beginPath();
    targetCtx.moveTo(bx, by + bh - arm);
    targetCtx.lineTo(bx, by + bh);
    targetCtx.lineTo(bx + arm, by + bh);
    targetCtx.stroke();

    // Góc dưới phải
    targetCtx.beginPath();
    targetCtx.moveTo(bx + bw - arm, by + bh);
    targetCtx.lineTo(bx + bw, by + bh);
    targetCtx.lineTo(bx + bw, by + bh - arm);
    targetCtx.stroke();

    // Phát sáng các đối tượng nằm trong vùng quét để xem trước
    const rect = { minX: bx, maxX: bx + bw, minY: by, maxY: by + bh };
    let matchCount = 0;
    if (elements && elements.length > 0) {
      for (const el of elements) {
        if (isElementInSelectionBox(el, rect)) {
          highlightElementShape(targetCtx, el, false);
          matchCount++;
        }
      }
    }

    // Huy hiệu đếm số đối tượng được bao quanh
    if (matchCount > 0 && bw > 55 && bh > 35) {
      const badgeText = `🎯 ${matchCount} đối tượng`;
      targetCtx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      const textWidth = targetCtx.measureText(badgeText).width;
      const badgeW = textWidth + 14;
      const badgeH = 20;
      const badgeX = bx + bw - badgeW - 6;
      const badgeY = by + bh - badgeH - 6;

      targetCtx.fillStyle = 'rgba(40, 99, 78, 0.9)';
      targetCtx.beginPath();
      targetCtx.roundRect ? targetCtx.roundRect(badgeX, badgeY, badgeW, badgeH, 10) : targetCtx.rect(badgeX, badgeY, badgeW, badgeH);
      targetCtx.fill();

      targetCtx.fillStyle = '#ffffff';
      targetCtx.fillText(badgeText, badgeX + 7, badgeY + 14);
    }

    targetCtx.restore();
  }

  // Vẽ khung bao tổng thể khi chọn nhiều đối tượng
  function drawUnifiedSelectionBoundingBox(targetCtx, selectedList) {
    const uBox = getCombinedBoundingBox(selectedList);
    if (!uBox) return;

    targetCtx.save();
    const pad = 12;
    const ubx = uBox.minX - pad;
    const uby = uBox.minY - pad;
    const ubw = (uBox.maxX - uBox.minX) + pad * 2;
    const ubh = (uBox.maxY - uBox.minY) + pad * 2;

    targetCtx.strokeStyle = 'rgba(40, 99, 78, 0.7)';
    targetCtx.lineWidth = 1.5;
    targetCtx.setLineDash([6, 4]);
    targetCtx.strokeRect(ubx, uby, ubw, ubh);
    targetCtx.setLineDash([]);

    // 4 góc tay cầm tròn
    const cornerPts = [
      { x: ubx, y: uby },
      { x: ubx + ubw, y: uby },
      { x: ubx + ubw, y: uby + ubh },
      { x: ubx, y: uby + ubh }
    ];
    for (const cp of cornerPts) {
      targetCtx.fillStyle = '#ffffff';
      targetCtx.strokeStyle = '#28634e';
      targetCtx.lineWidth = 2;
      targetCtx.beginPath();
      targetCtx.arc(cp.x, cp.y, 4.5, 0, Math.PI * 2);
      targetCtx.fill();
      targetCtx.stroke();
    }
    targetCtx.restore();
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

    // Gán groupId cho tất cả các đối tượng tham gia liên kết
    for (const m of allMembers) {
      ensureElementId(m);
      m.groupId = targetGroupId;
      m.isUngrouped = false;
    }

    // Sáp nhập tất cả các đối tượng thuộc các nhóm này trên trang hiện tại
    for (const item of pageEls) {
      if (!item) continue;
      if (allMembers.includes(item) || (item.groupId && groupIdsToMerge.has(item.groupId))) {
        ensureElementId(item);
        item.groupId = targetGroupId;
        item.isUngrouped = false;
      }
    }
  }

  // Kiểm tra 2 đối tượng hình học có gắn kết hoặc liên kết ràng buộc với nhau hay không
  function areElementsLinked(a, b) {
    if (!a || !b || a === b) return false;
    // 1. Cùng chung groupId
    if (a.groupId && b.groupId && a.groupId === b.groupId) return true;

    // Nếu người dùng đã chủ động bấm Rã nhóm (⌘⇧G) trên một trong hai đối tượng và chưa gộp lại -> Không tự động kéo theo nhau nữa
    if (a.isUngrouped || b.isUngrouped) return false;

    // 2. Liên kết binding từ a tới b (quét mọi trường ID trong binding)
    if (a.binding) {
      for (const k in a.binding) {
        if (a.binding[k] && a.binding[k] === b.id) return true;
      }
    }

    // 3. Liên kết binding từ b tới a
    if (b.binding) {
      for (const k in b.binding) {
        if (b.binding[k] && b.binding[k] === a.id) return true;
      }
    }

    // 4. Liên kết startBinding / endBinding
    const checkSE = (binding, target) => {
      return binding && (binding.parentId === target.id || binding.elementId === target.id);
    };
    if (checkSE(a.startBinding, b) || checkSE(a.endBinding, b)) return true;
    if (checkSE(b.startBinding, a) || checkSE(b.endBinding, a)) return true;

    return false;
  }

  // Lấy tất cả các đối tượng cùng nhóm và liên kết phụ thuộc với el trên trang hiện tại
  function getGroupElements(el) {
    if (!el) return [];
    if (el.isUngrouped && !el.groupId) return [el];
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
        if (areElementsLinked(curr, item)) {
          groupSet.add(item);
          queue.push(item);
        }
      }
    }

    // Đảm bảo tất cả các phần tử trong nhóm đều có chung 1 targetGroupId (nếu chưa bị rã nhóm)
    const groupArr = Array.from(groupSet);
    if (groupArr.length > 1) {
      let targetGroupId = groupArr.find(item => item.groupId)?.groupId;
      if (!targetGroupId) {
        ensureElementId(groupArr[0]);
        targetGroupId = 'grp_' + groupArr[0].id;
      }
      for (const item of groupArr) {
        if (!item.isUngrouped) {
          ensureElementId(item);
          item.groupId = targetGroupId;
        }
      }
    }

    return groupArr.length > 0 ? groupArr : [el];
  }

  // Lấy tất cả các hình con, cháu, chắt... phụ thuộc vào parentEl (chuỗi đa cấp 1 -> 2 -> 3 -> 4 -> 5...)
  function getDependentElements(parentEl) {
    if (!parentEl || !parentEl.id) return [];
    const pageEls = state.pages[state.currentPage] || [];
    const depSet = new Set();
    const queue = [parentEl];

    while (queue.length > 0) {
      const curr = queue.shift();
      if (!curr || !curr.id) continue;

      for (const child of pageEls) {
        if (!child || child === curr || depSet.has(child)) continue;
        let isDep = false;
        if (child.binding) {
          for (const k in child.binding) {
            if (child.binding[k] && child.binding[k] === curr.id) {
              isDep = true;
              break;
            }
          }
        }
        if (child.startBinding && (child.startBinding.parentId === curr.id || child.startBinding.elementId === curr.id)) {
          isDep = true;
        }
        if (child.endBinding && (child.endBinding.parentId === curr.id || child.endBinding.elementId === curr.id)) {
          isDep = true;
        }
        if (isDep) {
          depSet.add(child);
          queue.push(child);
        }
      }
    }

    return Array.from(depSet);
  }

  // Dịch chuyển vị trí đối tượng theo vector (dx, dy), tự động tịnh tiến các đối tượng con và đối tượng cùng nhóm
  function translateElement(el, dx, dy, movedSet = new Set(), selectedList = []) {
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
      if (el.tangentPoint1) {
        el.tangentPoint1.x += dx;
        el.tangentPoint1.y += dy;
      }
      if (el.tangentPoint2) {
        el.tangentPoint2.x += dx;
        el.tangentPoint2.y += dy;
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
      if (el.midpoint) {
        el.midpoint.x += dx;
        el.midpoint.y += dy;
      }
      if (el.segStart) {
        el.segStart.x += dx;
        el.segStart.y += dy;
      }
      if (el.segEnd) {
        el.segEnd.x += dx;
        el.segEnd.y += dy;
      }
      if (el.binding && el.binding.pointRef) {
        el.binding.pointRef.x += dx;
        el.binding.pointRef.y += dy;
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
        if (areElementsLinked(el, child)) {
          translateElement(child, dx, dy, movedSet, selectedList);
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
      if (el.tangentPoint1) rotPt(el.tangentPoint1);
      if (el.tangentPoint2) rotPt(el.tangentPoint2);
      if (el.secondPoint) rotPt(el.secondPoint);
      if (el.p1) rotPt(el.p1);
      if (el.p2) rotPt(el.p2);
      if (el.points) {
        for (const p of el.points) rotPt(p);
      }
      if (el.midpoint) rotPt(el.midpoint);
      if (el.segStart) rotPt(el.segStart);
      if (el.segEnd) rotPt(el.segEnd);
      if (typeof el.baseDir === 'number') {
        el.baseDir += rad;
      } else if (el.baseDir && typeof el.baseDir === 'object') {
        const bx = el.baseDir.x || 0;
        const by = el.baseDir.y || 0;
        el.baseDir = { x: bx * cos - by * sin, y: bx * sin + by * cos };
      }
      if (el.normDir && typeof el.normDir === 'object') {
        const nx = el.normDir.x || 0;
        const ny = el.normDir.y || 0;
        el.normDir = { x: nx * cos - ny * sin, y: nx * sin + ny * cos };
      }
      if (el.axisDir && typeof el.axisDir === 'object') {
        const ax = el.axisDir.x || 0;
        const ay = el.axisDir.y || 0;
        el.axisDir = { x: ax * cos - ay * sin, y: ax * sin + ay * cos };
      }
      if (el.shape === 'ellipse') {
        el.rotation = (el.rotation || 0) + rad;
      }
      if (el.bisectorAngle !== undefined) el.bisectorAngle += rad;
      if (el.arm1Angle !== undefined) el.arm1Angle += rad;
      if (el.arm2Angle !== undefined) el.arm2Angle += rad;
      if (el.angles) {
        el.angles = el.angles.map(a => a + rad);
      }
      if (el.binding) {
        if (el.binding.pointRef) rotPt(el.binding.pointRef);
        if (typeof el.binding.angle === 'number') el.binding.angle += rad;
        if (typeof el.binding.offset === 'number') {
          el.binding.offset += rad;
        } else if (el.binding.offset && typeof el.binding.offset === 'object') {
          const ox = el.binding.offset.dx || 0;
          const oy = el.binding.offset.dy || 0;
          el.binding.offset = { dx: ox * cos - oy * sin, dy: ox * sin + oy * cos };
        }
      }
      if (el.startBinding && typeof el.startBinding.angle === 'number') {
        el.startBinding.angle += rad;
      }
      if (el.endBinding && typeof el.endBinding.angle === 'number') {
        el.endBinding.angle += rad;
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
        if (areElementsLinked(el, child)) {
          rotateElement2D(child, cx, cy, rad, rotatedSet);
        }
      }
    }
  }

  // Trích xuất tọa độ một điểm đặc biệt trên đối tượng (Điểm rời, Tâm O, Tiếp điểm T, Đỉnh đa giác, Chân vuông góc, Trung điểm, Đầu mút...)
  function resolveElementPoint(el, vIndex, pointKey) {
    if (!el) return null;
    if (pointKey === 'tangentPoint' && el.tangentPoint) {
      return { x: el.tangentPoint.x, y: el.tangentPoint.y };
    }
    if (pointKey === 'tangentPoint1' && el.tangentPoint1) {
      return { x: el.tangentPoint1.x, y: el.tangentPoint1.y };
    }
    if (pointKey === 'tangentPoint2' && el.tangentPoint2) {
      return { x: el.tangentPoint2.x, y: el.tangentPoint2.y };
    }
    if (pointKey === 'foot' && el.foot) {
      return { x: el.foot.x, y: el.foot.y };
    }
    if (pointKey === 'midpoint' && el.midpoint) {
      return { x: el.midpoint.x, y: el.midpoint.y };
    }
    if (pointKey === 'center' && (el.center || el.start)) {
      const c = el.center || el.start;
      return { x: c.x, y: c.y };
    }
    if (pointKey === 'start' && el.start) {
      return { x: el.start.x, y: el.start.y };
    }
    if (pointKey === 'end' && el.end) {
      return { x: el.end.x, y: el.end.y };
    }
    if (vIndex !== undefined && vIndex !== null && vIndex >= 0) {
      if (el.points && el.points[vIndex]) {
        return { x: el.points[vIndex].x, y: el.points[vIndex].y };
      }
      if (el.angles && el.angles[vIndex] !== undefined && el.start && el.end) {
        const r = el.radius || Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
        return {
          x: el.start.x + r * Math.cos(el.angles[vIndex]),
          y: el.start.y + r * Math.sin(el.angles[vIndex])
        };
      }
    }
    if (el.shape === 'point' && el.start) {
      return { x: el.start.x, y: el.start.y };
    }
    if (el.tangentPoint && el.shape === 'tangent' && !pointKey) {
      return { x: el.tangentPoint.x, y: el.tangentPoint.y };
    }
    if (el.start) {
      return { x: el.start.x, y: el.start.y };
    }
    if (el.x !== undefined && el.y !== undefined) {
      return { x: el.x, y: el.y };
    }
    return null;
  }

  // Cập nhật lại hình học cho 1 hình con khi hình sinh ra nó bị biến động (kéo đỉnh, đổi bán kính, kéo đầu mút...)
  function updateSingleBinding(child, parentEl) {
    if (!child || !child.binding || !parentEl) return;
    const b = child.binding;

    // 1. Trung điểm (Midpoint)
    if (b.type === 'midpoint_segment' || b.isSegment) {
      const pEl = b.parentId ? (findElementById(b.parentId) || parentEl) : parentEl;
      if (pEl && pEl.start && pEl.end) {
        child.start.x = (pEl.start.x + pEl.end.x) / 2;
        child.start.y = (pEl.start.y + pEl.end.y) / 2;
        child.end.x = child.start.x;
        child.end.y = child.start.y;
        child.p1 = { x: pEl.start.x, y: pEl.start.y };
        child.p2 = { x: pEl.end.x, y: pEl.end.y };
      }
    } else if (b.type === 'midpoint_triangle_edge') {
      const pEl = b.parentId ? (findElementById(b.parentId) || parentEl) : parentEl;
      if (pEl && pEl.points && b.v1Index !== undefined && b.v2Index !== undefined) {
        const pA = pEl.points[b.v1Index];
        const pB = pEl.points[b.v2Index];
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
      const pEl = b.parentId ? (findElementById(b.parentId) || parentEl) : parentEl;
      if (pEl && pEl.angles && b.v1Index !== undefined && b.v2Index !== undefined) {
        const r = Math.hypot(pEl.end.x - pEl.start.x, pEl.end.y - pEl.start.y);
        const pA = { x: pEl.start.x + r * Math.cos(pEl.angles[b.v1Index]), y: pEl.start.y + r * Math.sin(pEl.angles[b.v1Index]) };
        const pB = { x: pEl.start.x + r * Math.cos(pEl.angles[b.v2Index]), y: pEl.start.y + r * Math.sin(pEl.angles[b.v2Index]) };
        child.start.x = (pA.x + pB.x) / 2;
        child.start.y = (pA.y + pB.y) / 2;
        child.end.x = child.start.x;
        child.end.y = child.start.y;
        child.p1 = { x: pA.x, y: pA.y };
        child.p2 = { x: pB.x, y: pB.y };
      }
    } else if (b.type === 'midpoint_points') {
      const ptA = findElementById(b.ptAId);
      const ptB = findElementById(b.ptBId);
      if (ptA && ptB) {
        const pA = resolveElementPoint(ptA, b.vAIndex, b.pointKeyA);
        const pB = resolveElementPoint(ptB, b.vBIndex, b.pointKeyB);
        if (pA && pB) {
          child.start.x = (pA.x + pB.x) / 2;
          child.start.y = (pA.y + pB.y) / 2;
          child.end.x = child.start.x;
          child.end.y = child.start.y;
          child.p1 = { x: pA.x, y: pA.y };
          child.p2 = { x: pB.x, y: pB.y };
        }
      }
    }

    // 2. Tia phân giác (Bisector)
    else if (b.type === 'bisector_triangle') {
      const pEl = b.parentId ? (findElementById(b.parentId) || parentEl) : parentEl;
      if (pEl && pEl.points && pEl.points.length >= 3 && b.vertexIndex !== undefined) {
        const pts = pEl.points;
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
      const pEl = b.parentId ? (findElementById(b.parentId) || parentEl) : parentEl;
      if (pEl && pEl.start) {
        const V = { x: pEl.start.x, y: pEl.start.y };
        const armLength = pEl.armLength || Math.max(80, Math.hypot(pEl.end.x - pEl.start.x, pEl.end.y - pEl.start.y));
        const baseAngle = pEl.baseDir !== undefined ? pEl.baseDir : Math.atan2(pEl.end.y - pEl.start.y, pEl.end.x - pEl.start.x);
        const rad = ((pEl.angleDeg || 60) * Math.PI) / 180;
        const secondAngle = baseAngle - rad;
        const bisectorAngle = (baseAngle + secondAngle) / 2;
        child.start = V;
        child.end = { x: V.x + armLength * Math.cos(bisectorAngle), y: V.y + armLength * Math.sin(bisectorAngle) };
        child.arm1Angle = secondAngle;
        child.arm2Angle = baseAngle;
        child.bisectorAngle = bisectorAngle;
      }
    }

    // 3. Tiếp tuyến (Tangent)
    else if (b.type === 'circle_tangent') {
      const pEl = b.parentId ? (findElementById(b.parentId) || parentEl) : parentEl;
      if (pEl && pEl.start) {
        const O = { x: pEl.start.x, y: pEl.start.y };
        const R = pEl.radius || Math.hypot(pEl.end.x - pEl.start.x, pEl.end.y - pEl.start.y);
        child.center = O;
        child.radius = R;
        const currentTanLength = Math.hypot(child.end.x - child.start.x, child.end.y - child.start.y) || 180;
        const halfLen = currentTanLength / 2;

        if (b.onCircle) {
          let ang = b.angle !== undefined ? b.angle : 0;
          if (b.pointElId) {
            const ptEl = findElementById(b.pointElId);
            const pt = resolveElementPoint(ptEl, b.pointVertexIndex, b.pointKey);
            if (pt) {
              ang = Math.atan2(pt.y - O.y, pt.x - O.x);
              b.angle = ang;
            }
          }
          const T = { x: O.x + R * Math.cos(ang), y: O.y + R * Math.sin(ang) };
          child.tangentPoint = T;
          const uPerp = { x: -Math.sin(ang), y: Math.cos(ang) };
          child.start = { x: T.x - halfLen * uPerp.x, y: T.y - halfLen * uPerp.y };
          child.end = { x: T.x + halfLen * uPerp.x, y: T.y + halfLen * uPerp.y };
        } else {
          let pt = null;
          if (b.pointElId) {
            const ptEl = findElementById(b.pointElId);
            pt = resolveElementPoint(ptEl, b.pointVertexIndex, b.pointKey);
            if (pt) {
              b.offset = { dx: pt.x - O.x, dy: pt.y - O.y };
            }
          }
          if (!pt && b.offset) {
            pt = { x: O.x + b.offset.dx, y: O.y + b.offset.dy };
          }
          if (pt) {
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
              child.start = { x: pt.x, y: pt.y };
              child.end = { x: T.x + 45 * uTan.x, y: T.y + 45 * uTan.y };
            }
          }
        }
      }
    } else if (b.type === 'two_tangents') {
      const pEl = b.parentId ? (findElementById(b.parentId) || parentEl) : parentEl;
      if (pEl && pEl.shape === 'circle') {
        const O = { x: pEl.start.x, y: pEl.start.y };
        const R = pEl.radius || Math.hypot(pEl.end.x - pEl.start.x, pEl.end.y - pEl.start.y);
        child.start = { x: O.x, y: O.y };
        child.radius = R;
      }
      if (b.pointElId) {
        const ptEl = findElementById(b.pointElId);
        const pt = resolveElementPoint(ptEl, b.pointVertexIndex, b.pointKey);
        if (pt) {
          child.end = { x: pt.x, y: pt.y };
        }
      }
      if (child.start && child.end) {
        const d = Math.hypot(child.end.x - child.start.x, child.end.y - child.start.y);
        const radius = child.radius || Math.max(30, Math.min(120, d * 0.45));
        const effD = Math.max(radius + 1, d);
        const angle = Math.atan2(child.end.y - child.start.y, child.end.x - child.start.x);
        const beta = Math.acos(Math.max(-1, Math.min(1, radius / effD)));
        child.tangentPoint1 = {
          x: child.start.x + radius * Math.cos(angle - beta),
          y: child.start.y + radius * Math.sin(angle - beta)
        };
        child.tangentPoint2 = {
          x: child.start.x + radius * Math.cos(angle + beta),
          y: child.start.y + radius * Math.sin(angle + beta)
        };
      }
    }

    // 4. Đường vuông góc (Perpendicular)
    else if (b.type === 'perpendicular') {
      let A = null, B = null;
      const baseEl = b.parentId ? findElementById(b.parentId) : parentEl;
      if (baseEl) {
        if (baseEl.shape === 'line' || baseEl.shape === 'perpendicular' || baseEl.shape === 'parallel' || baseEl.shape === 'tangent' || baseEl.shape === 'perpendicular-bisector') {
          A = baseEl.start; B = baseEl.end;
        } else if (baseEl.points && b.v1Index !== undefined && b.v2Index !== undefined) {
          A = baseEl.points[b.v1Index]; B = baseEl.points[b.v2Index];
        }
      }
      if (A && B) {
        const vx = B.x - A.x, vy = B.y - A.y;
        const lenV = Math.hypot(vx, vy) || 1;
        const uBase = { x: vx / lenV, y: vy / lenV };
        let P = b.pointRef || child.start;
        if (b.pointElId) {
          const ptEl = findElementById(b.pointElId);
          const resolvedP = resolveElementPoint(ptEl, b.pointVertexIndex, b.pointKey);
          if (resolvedP) P = resolvedP;
        }
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

    // 4b. Đường trung trực (Perpendicular Bisector)
    else if (b.type === 'perpendicular_bisector') {
      let A = null, B = null;
      if (b.ptAId || b.ptBId) {
        const ptAEl = b.ptAId ? findElementById(b.ptAId) : null;
        const ptBEl = b.ptBId ? findElementById(b.ptBId) : null;
        if (ptAEl) {
          A = resolveElementPoint(ptAEl, b.vAIndex, b.pointKeyA);
        } else if (child.segStart) {
          A = child.segStart;
        }
        if (ptBEl) {
          B = resolveElementPoint(ptBEl, b.vBIndex, b.pointKeyB);
        } else if (child.segEnd) {
          B = child.segEnd;
        }
      } else {
        const pEl = b.parentId ? (findElementById(b.parentId) || parentEl) : parentEl;
        if (pEl) {
          if (pEl.shape === 'line' || pEl.shape === 'perpendicular' || pEl.shape === 'parallel' || pEl.shape === 'tangent' || pEl.shape === 'perpendicular-bisector') {
            A = pEl.start; B = pEl.end;
          } else if (pEl.points && b.v1Index !== undefined && b.v2Index !== undefined) {
            A = pEl.points[b.v1Index]; B = pEl.points[b.v2Index];
          }
        }
      }
      if (A && B) {
        const vx = B.x - A.x, vy = B.y - A.y;
        const lenV = Math.hypot(vx, vy) || 1;
        const uBase = { x: vx / lenV, y: vy / lenV };
        const uNorm = { x: -uBase.y, y: uBase.x };
        const Mx = (A.x + B.x) / 2;
        const My = (A.y + B.y) / 2;
        const M = { x: Mx, y: My };
        const halfL = child.halfLength || Math.max(75, lenV * 0.65);
        child.midpoint = M;
        child.baseDir = uBase;
        child.normDir = uNorm;
        child.segStart = { x: A.x, y: A.y };
        child.segEnd = { x: B.x, y: B.y };
        child.start = { x: M.x - halfL * uNorm.x, y: M.y - halfL * uNorm.y };
        child.end = { x: M.x + halfL * uNorm.x, y: M.y + halfL * uNorm.y };
      }
    }

    // 5. Đường song song (Parallel)
    else if (b.type === 'parallel') {
      // 1. Xác định đường thẳng gốc AB
      let A = null, B = null;
      const baseEl = b.parentId ? findElementById(b.parentId) : (parentEl.shape !== 'point' ? parentEl : null);
      if (baseEl) {
        if (baseEl.shape === 'line' || baseEl.shape === 'perpendicular' || baseEl.shape === 'parallel' || baseEl.shape === 'tangent' || baseEl.shape === 'perpendicular-bisector') {
          A = baseEl.start;
          B = baseEl.end;
        } else if (baseEl.points && b.v1Index !== undefined && b.v2Index !== undefined) {
          A = baseEl.points[b.v1Index];
          B = baseEl.points[b.v2Index];
        }
      }

      // 2. Xác định Điểm ban đầu P mà đường song song phải luôn luôn đi qua
      let P = null;
      if (b.pointElId) {
        const ptEl = findElementById(b.pointElId);
        P = resolveElementPoint(ptEl, b.pointVertexIndex, b.pointKey);
      }
      if (!P && b.pointRef) {
        P = b.pointRef;
      }
      if (!P) {
        P = { x: (child.start.x + child.end.x) / 2, y: (child.start.y + child.end.y) / 2 };
      }

      // 3. Cập nhật đường song song đi qua P và có phương song song với AB
      if (A && B && P) {
        const vx = B.x - A.x, vy = B.y - A.y;
        const lenV = Math.hypot(vx, vy) || 1;
        const uBase = { x: vx / lenV, y: vy / lenV };
        child.baseDir = uBase;

        // Tính hình chiếu H của P lên đường thẳng gốc AB
        const t = (P.x - A.x) * uBase.x + (P.y - A.y) * uBase.y;
        const H = { x: A.x + t * uBase.x, y: A.y + t * uBase.y };

        const tA = (A.x - H.x) * uBase.x + (A.y - H.y) * uBase.y;
        const tB = (B.x - H.x) * uBase.x + (B.y - H.y) * uBase.y;

        let p1 = { x: P.x + (tA - 15) * uBase.x, y: P.y + (tA - 15) * uBase.y };
        let p2 = { x: P.x + (tB + 15) * uBase.x, y: P.y + (tB + 15) * uBase.y };

        if (Math.hypot(p2.x - p1.x, p2.y - p1.y) < 50) {
          const halfLen = Math.max(80, lenV / 2);
          p1 = { x: P.x - halfLen * uBase.x, y: P.y - halfLen * uBase.y };
          p2 = { x: P.x + halfLen * uBase.x, y: P.y + halfLen * uBase.y };
        }

        child.start = p1;
        child.end = p2;
        b.pointRef = { x: P.x, y: P.y };
      }
    }

    // 5b. Điểm đối xứng (Point Symmetry - Point 3)
    else if (b.type === 'point_symmetry_pt3') {
      let A = null, B = null;
      if (b.pt1Id && b.pt2Id) {
        const pt1El = findElementById(b.pt1Id);
        const pt2El = findElementById(b.pt2Id);
        if (pt1El && pt2El) {
          A = resolveElementPoint(pt1El, b.v1Index, b.pointKey1);
          B = resolveElementPoint(pt2El, b.v2Index, b.pointKey2);
        }
      }
      if (A && B) {
        const x3 = 2 * B.x - A.x;
        const y3 = 2 * B.y - A.y;
        child.start = { x: x3, y: y3 };
        child.end = { x: x3, y: y3 };
      }
    }

    // 5c. Đoạn thẳng nối qua 3 điểm đối xứng (Point Symmetry - Line 1-3)
    else if (b.type === 'point_symmetry_line') {
      let A = null, B = null;
      if (b.pt1Id && b.pt2Id) {
        const pt1El = findElementById(b.pt1Id);
        const pt2El = findElementById(b.pt2Id);
        if (pt1El && pt2El) {
          A = resolveElementPoint(pt1El, b.v1Index, b.pointKey1);
          B = resolveElementPoint(pt2El, b.v2Index, b.pointKey2);
        }
      }
      if (A && B) {
        const x3 = 2 * B.x - A.x;
        const y3 = 2 * B.y - A.y;
        child.start = { x: A.x, y: A.y };
        child.end = { x: x3, y: y3 };
        child.midpoint = { x: B.x, y: B.y };
      }
    }

    // 5d. Điểm đối xứng qua trục (Axis Symmetry - Point, H, Line)
    else if (b.type === 'axis_symmetry_point' || b.type === 'axis_symmetry_h' || b.type === 'axis_symmetry_line') {
      let P1 = null, A = null, B = null;
      if (b.ptId) {
        const ptEl = findElementById(b.ptId);
        if (ptEl) P1 = resolveElementPoint(ptEl, b.ptVIndex, b.ptKey);
      }
      if (b.axisId) {
        const axisEl = findElementById(b.axisId);
        if (axisEl) {
          if (axisEl.points && b.v1Index !== undefined && b.v2Index !== undefined) {
            A = axisEl.points[b.v1Index];
            B = axisEl.points[b.v2Index];
          } else if (axisEl.start && axisEl.end) {
            A = axisEl.start;
            B = axisEl.end;
          }
        }
      }
      if (!A || !B) {
        A = b.axisStart;
        B = b.axisEnd;
      }

      if (P1 && A && B) {
        const vx = B.x - A.x, vy = B.y - A.y;
        const len = Math.hypot(vx, vy) || 1;
        const ux = vx / len, uy = vy / len;
        const t = (P1.x - A.x) * ux + (P1.y - A.y) * uy;
        const H = { x: A.x + t * ux, y: A.y + t * uy };
        const P2 = { x: 2 * H.x - P1.x, y: 2 * H.y - P1.y };

        if (b.type === 'axis_symmetry_point') {
          child.start = { x: P2.x, y: P2.y };
          child.end = { x: P2.x, y: P2.y };
        } else if (b.type === 'axis_symmetry_h') {
          child.start = { x: H.x, y: H.y };
          child.end = { x: H.x, y: H.y };
        } else if (b.type === 'axis_symmetry_line') {
          child.start = { x: P1.x, y: P1.y };
          child.end = { x: P2.x, y: P2.y };
          child.midpoint = { x: H.x, y: H.y };
          child.axisDir = { x: ux, y: uy };
        }
      }
    }

    // 5.5. Đường tròn ngoại tiếp (Circumcircle) & Tâm ngoại tiếp (Circumcenter)
    else if (b.type === 'circumcircle' || b.type === 'circumcircle_center') {
      let p1 = null, p2 = null, p3 = null;
      if (b.triangleId) {
        const tri = findElementById(b.triangleId);
        if (tri && tri.points && tri.points.length >= 3) {
          p1 = tri.points[0]; p2 = tri.points[1]; p3 = tri.points[2];
        }
      }
      if (!p1 || !p2 || !p3) {
        const el1 = findElementById(b.pt1Id);
        const el2 = findElementById(b.pt2Id);
        const el3 = findElementById(b.pt3Id);
        if (el1) p1 = resolveElementPoint(el1, b.v1Index, b.pointKey1);
        if (el2) p2 = resolveElementPoint(el2, b.v2Index, b.pointKey2);
        if (el3) p3 = resolveElementPoint(el3, b.v3Index, b.pointKey3);
      }
      if (p1 && p2 && p3) {
        const x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y, x3 = p3.x, y3 = p3.y;
        const D = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
        if (Math.abs(D) > 1e-4) {
          const sq1 = x1 * x1 + y1 * y1;
          const sq2 = x2 * x2 + y2 * y2;
          const sq3 = x3 * x3 + y3 * y3;
          const x0 = (sq1 * (y2 - y3) + sq2 * (y3 - y1) + sq3 * (y1 - y2)) / D;
          const y0 = (sq1 * (x3 - x2) + sq2 * (x1 - x3) + sq3 * (x2 - x1)) / D;
          const R = Math.hypot(x1 - x0, y1 - y0);

          if (b.type === 'circumcircle_center') {
            child.start = { x: x0, y: y0 };
            child.end = { x: x0, y: y0 };
          } else if (b.type === 'circumcircle') {
            child.start = { x: x0, y: y0 };
            child.end = { x: x0 + R, y: y0 };
            child.radius = R;
          }
        }
      }
    }

    // 5.6. Đường tròn nội tiếp (Incircle) & Tâm nội tiếp (Incenter)
    else if (b.type === 'incircle' || b.type === 'incircle_center') {
      let p1 = null, p2 = null, p3 = null;
      if (b.triangleId) {
        const tri = findElementById(b.triangleId);
        if (tri && tri.points && tri.points.length >= 3) {
          p1 = tri.points[0]; p2 = tri.points[1]; p3 = tri.points[2];
        }
      }
      if (!p1 || !p2 || !p3) {
        const el1 = findElementById(b.pt1Id);
        const el2 = findElementById(b.pt2Id);
        const el3 = findElementById(b.pt3Id);
        if (el1) p1 = resolveElementPoint(el1, b.v1Index, b.pointKey1);
        if (el2) p2 = resolveElementPoint(el2, b.v2Index, b.pointKey2);
        if (el3) p3 = resolveElementPoint(el3, b.v3Index, b.pointKey3);
      }
      if (p1 && p2 && p3) {
        const x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y, x3 = p3.x, y3 = p3.y;
        const a = Math.hypot(x3 - x2, y3 - y2);
        const bLen = Math.hypot(x1 - x3, y1 - y3);
        const c = Math.hypot(x2 - x1, y2 - y1);
        const peri = a + bLen + c;
        if (peri > 1e-4) {
          const xI = (a * x1 + bLen * x2 + c * x3) / peri;
          const yI = (a * y1 + bLen * y2 + c * y3) / peri;
          const S = 0.5 * Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
          const r = S / (peri / 2);

          if (b.type === 'incircle_center') {
            child.start = { x: xI, y: yI };
            child.end = { x: xI, y: yI };
          } else if (b.type === 'incircle') {
            child.start = { x: xI, y: yI };
            child.end = { x: xI + r, y: yI };
            child.radius = r;
          }
        }
      }
    }

    // 6. Điểm gắn trên đường tròn (Point on Circle)
    else if (b.type === 'point_on_circle') {
      const pEl = b.parentId ? (findElementById(b.parentId) || parentEl) : parentEl;
      if (pEl && pEl.start) {
        const O = { x: pEl.start.x, y: pEl.start.y };
        const R = pEl.radius || Math.hypot(pEl.end.x - pEl.start.x, pEl.end.y - pEl.start.y);
        const ang = b.angle !== undefined ? b.angle : 0;
        child.start = { x: O.x + R * Math.cos(ang), y: O.y + R * Math.sin(ang) };
        child.end = { x: child.start.x, y: child.start.y };
      }
    }

    // 7. Điểm gắn trên đường thẳng / cạnh hình học (Point on Line / Segment)
    else if (b.type === 'point_on_line') {
      const pEl = b.parentId ? (findElementById(b.parentId) || parentEl) : parentEl;
      let A = null, B = null;
      if (pEl) {
        if (pEl.shape === 'line' || pEl.shape === 'perpendicular' || pEl.shape === 'parallel' || pEl.shape === 'tangent' || pEl.shape === 'bisector') {
          A = pEl.start;
          B = pEl.end;
        } else if (pEl.points && b.v1Index !== undefined && b.v2Index !== undefined) {
          A = pEl.points[b.v1Index];
          B = pEl.points[b.v2Index];
        } else if (pEl.shape === 'inscribed-triangle' && b.v1Index !== undefined && b.v2Index !== undefined) {
          const r = Math.hypot(pEl.end.x - pEl.start.x, pEl.end.y - pEl.start.y);
          const angles = pEl.angles || [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
          A = { x: pEl.start.x + r * Math.cos(angles[b.v1Index]), y: pEl.start.y + r * Math.sin(angles[b.v1Index]) };
          B = { x: pEl.start.x + r * Math.cos(angles[b.v2Index]), y: pEl.start.y + r * Math.sin(angles[b.v2Index]) };
        }
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
      const pEl = b.parentId ? (findElementById(b.parentId) || parentEl) : parentEl;
      let A = null, B = null;
      if (pEl) {
        if (pEl.shape === 'line' || pEl.shape === 'perpendicular' || pEl.shape === 'parallel' || pEl.shape === 'tangent' || pEl.shape === 'bisector') {
          A = pEl.start; B = pEl.end;
        } else if (pEl.points && b.v1Index !== undefined && b.v2Index !== undefined) {
          A = pEl.points[b.v1Index]; B = pEl.points[b.v2Index];
        }
      }
      if (A && B) {
        let V = null;
        let other = null;
        if (b.pointElId) {
          const ptEl = findElementById(b.pointElId);
          if (ptEl) V = ptEl.start || ptEl;
        }
        if (!V) {
          if (b.isVAtV1 !== false) {
            V = A; other = B;
          } else {
            V = B; other = A;
          }
        } else {
          other = (Math.hypot(V.x - A.x, V.y - A.y) < Math.hypot(V.x - B.x, V.y - B.y)) ? B : A;
        }
        child.start = { x: V.x, y: V.y };
        const baseDir = Math.atan2(other.y - V.y, other.x - V.x);
        child.baseDir = baseDir;
        const armLen = child.armLength || Math.max(90, Math.hypot(other.x - V.x, other.y - V.y));
        const rad = ((child.angleDeg || 60) * Math.PI) / 180;
        const dir = (b.direction !== undefined) ? b.direction : (child.direction !== undefined ? child.direction : -1);
        const secondAngle = baseDir + dir * rad;
        child.end = { x: child.start.x + armLen * Math.cos(baseDir), y: child.start.y + armLen * Math.sin(baseDir) };
        child.secondPoint = { x: child.start.x + armLen * Math.cos(secondAngle), y: child.start.y + armLen * Math.sin(secondAngle) };
      }
    }

    // 10. Giao điểm giữa 2 đối tượng hình học (Intersection)
    else if (b.type === 'intersection') {
      const elA = findElementById(b.objAId);
      const elB = findElementById(b.objBId);
      if (elA && elB) {
        let gA = null;
        if (b.v1IndexA !== undefined && b.v2IndexA !== undefined && elA.points && elA.points[b.v1IndexA] && elA.points[b.v2IndexA]) {
          gA = { type: 'line', start: elA.points[b.v1IndexA], end: elA.points[b.v2IndexA], element: elA };
        } else {
          gA = extractGeoGeometry(elA);
        }
        let gB = null;
        if (b.v1IndexB !== undefined && b.v2IndexB !== undefined && elB.points && elB.points[b.v1IndexB] && elB.points[b.v2IndexB]) {
          gB = { type: 'line', start: elB.points[b.v1IndexB], end: elB.points[b.v2IndexB], element: elB };
        } else {
          gB = extractGeoGeometry(elB);
        }
        if (gA && gB) {
          let pts = [];
          if (gA.type === 'line' && gB.type === 'line') {
            const pt = findLineLineIntersection(gA.start, gA.end, gB.start, gB.end);
            if (pt) pts = [pt];
          } else if (gA.type === 'line' && gB.type === 'circle') {
            pts = findLineCircleIntersection(gA.start, gA.end, gB.center, gB.radius);
          } else if (gA.type === 'circle' && gB.type === 'line') {
            pts = findLineCircleIntersection(gB.start, gB.end, gA.center, gA.radius);
          } else if (gA.type === 'circle' && gB.type === 'circle') {
            pts = findCircleCircleIntersection(gA.center, gA.radius, gB.center, gB.radius);
          }
          const ptIdx = b.ptIndex || 0;
          if (pts && pts[ptIdx]) {
            child.start = { x: pts[ptIdx].x, y: pts[ptIdx].y };
            child.end = { x: pts[ptIdx].x, y: pts[ptIdx].y };
          }
        }
      }
    }
  }

  // Cập nhật đầu mút của đoạn thẳng gắn vào cạnh hoặc đường tròn khi hình cha bị thay đổi
  function updateSingleStartEndBinding(child, parentEl, endpointKey) {
    if (!child) return;
    const b = child[endpointKey + 'Binding'];
    if (!b) return;
    const pEl = b.parentId ? (findElementById(b.parentId) || parentEl) : (b.elementId ? (findElementById(b.elementId) || parentEl) : parentEl);
    if (!pEl) return;

    if (b.type === 'point_on_circle') {
      const O = { x: pEl.start.x, y: pEl.start.y };
      const R = pEl.radius || Math.hypot(pEl.end.x - pEl.start.x, pEl.end.y - pEl.start.y);
      const ang = b.angle !== undefined ? b.angle : 0;
      child[endpointKey] = {
        x: O.x + R * Math.cos(ang),
        y: O.y + R * Math.sin(ang)
      };
    } else if (b.type === 'point_on_line') {
      let A = null, B = null;
      if (pEl.shape === 'line' || pEl.shape === 'perpendicular' || pEl.shape === 'parallel' || pEl.shape === 'tangent' || pEl.shape === 'bisector') {
        A = pEl.start; B = pEl.end;
      } else if (pEl.points && b.v1Index !== undefined && b.v2Index !== undefined && pEl.points[b.v1Index] && pEl.points[b.v2Index]) {
        A = pEl.points[b.v1Index]; B = pEl.points[b.v2Index];
      }
      if (A && B) {
        const t = b.t !== undefined ? b.t : 0.5;
        child[endpointKey] = {
          x: A.x + t * (B.x - A.x),
          y: A.y + t * (B.y - A.y)
        };
      }
    } else if (b.type === 'point') {
      const pt = resolveElementPoint(pEl, b.vIndex, b.pointKey);
      if (pt) {
        child[endpointKey] = { x: pt.x, y: pt.y };
      }
    }
  }

  // Tự động cập nhật tất cả các đối tượng phụ thuộc vào initialParent theo chuỗi lan truyền đa cấp (1 -> 2 -> 3 -> 4 -> 5...)
  function updateDependentBindings(initialParent) {
    if (!initialParent || !initialParent.id) return;
    const pageEls = state.pages[state.currentPage] || [];
    const queue = [initialParent];
    let steps = 0;
    const MAX_STEPS = Math.max(100, pageEls.length * 8);

    while (queue.length > 0 && steps < MAX_STEPS) {
      steps++;
      const currentParent = queue.shift();
      if (!currentParent || !currentParent.id) continue;

      for (const child of pageEls) {
        if (!child || child === currentParent) continue;
        let isDirectChild = false;

        // 1. Kiểm tra child có ràng buộc binding phụ thuộc vào currentParent hay không
        if (child.binding) {
          for (const k in child.binding) {
            if (child.binding[k] && child.binding[k] === currentParent.id) {
              isDirectChild = true;
              break;
            }
          }
        }

        // 2. Kiểm tra startBinding / endBinding
        let startDep = false;
        if (child.startBinding && (child.startBinding.parentId === currentParent.id || child.startBinding.elementId === currentParent.id)) {
          startDep = true;
          isDirectChild = true;
        }
        let endDep = false;
        if (child.endBinding && (child.endBinding.parentId === currentParent.id || child.endBinding.elementId === currentParent.id)) {
          endDep = true;
          isDirectChild = true;
        }

        if (isDirectChild) {
          if (child.binding) {
            updateSingleBinding(child, currentParent);
          }
          if (startDep) {
            updateSingleStartEndBinding(child, currentParent, 'start');
          }
          if (endDep) {
            updateSingleStartEndBinding(child, currentParent, 'end');
          }

          // child đã được cập nhật theo tính chất dựng hình mới nhất của currentParent
          // Đưa child vào queue để tiếp tục lan truyền cập nhật cho các đối tượng 3, 4, 5... phụ thuộc vào child
          if (!queue.includes(child)) {
            queue.push(child);
          }
        }
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
    if (state.activeTool === 'select' && state.selectedElements.length > 0 && !state.isDrawing && !state.isAreaSelecting && state.isFromAreaSelect) {
      showFloatingSelectionBar(state.selectedElements);
    } else {
      hideFloatingSelectionBar();
    }
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
    if (state.selectedElements.length >= 2) {
      state.isFromAreaSelect = true;
    } else if (state.selectedElements.length <= 1) {
      state.isFromAreaSelect = false;
    }
    updateSelectionStatus();
    if (state.activeTool === 'select' && state.selectedElements.length > 0 && !state.isDrawing && !state.isAreaSelecting && state.isFromAreaSelect) {
      showFloatingSelectionBar(state.selectedElements);
    } else {
      hideFloatingSelectionBar();
    }
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
          if (el.shape === 'sphere' && el.points && el.points[0] && el.points[1]) {
            const R = Math.hypot(el.points[1].x - el.points[0].x, el.points[1].y - el.points[0].y);
            const d = Math.hypot(x - el.points[0].x, y - el.points[0].y);
            if (Math.abs(d - R) <= 18 || d <= 20) return el;
          }
          if (el.shape === 'cone' && el.points && el.points[1] && el.points[3]) {
            const O = el.points[1], B = el.points[3];
            const rx = Math.max(15, Math.abs(B.x - O.x)), ry = Math.max(8, rx * 0.28);
            const dx = (x - O.x) / rx, dy = (y - O.y) / ry;
            if (Math.abs(Math.hypot(dx, dy) - 1) <= 0.3) return el;
          }
          if (el.shape === 'cylinder' && el.points && el.points[0] && el.points[2] && el.points[3]) {
            const O1 = el.points[0], B1 = el.points[2];
            const rx1 = Math.max(15, Math.abs(B1.x - O1.x)), ry1 = Math.max(8, rx1 * 0.28);
            if (Math.abs(Math.hypot((x - O1.x) / rx1, (y - O1.y) / ry1) - 1) <= 0.3) return el;
            const O2 = el.points[3], B2 = el.points[5];
            if (B2) {
              const rx2 = Math.max(15, Math.abs(B2.x - O2.x)), ry2 = Math.max(8, rx2 * 0.28);
              if (Math.abs(Math.hypot((x - O2.x) / rx2, (y - O2.y) / ry2) - 1) <= 0.3) return el;
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
        const box = getElementBoundingBox(el);
        if (box && x >= box.minX - 8 && x <= box.maxX + 8 && y >= box.minY - 8 && y <= box.maxY + 8) {
          return el;
        }
      } else if (el.type === 'image') {
        if (el.isPdfPage) continue; // Bỏ qua trang PDF nền, không chọn nhầm khi tương tác ghi chú
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

  // Thuật toán Chaikin's Corner Smoothing kết hợp tối ưu kích thước điểm cực gọn
  function chaikinSmooth(points, iterations = 1) {
    if (!points || points.length < 3) return points;
    let current = points;
    for (let it = 0; it < iterations; it++) {
      const smoothed = [current[0]];
      for (let i = 0; i < current.length - 1; i++) {
        const p0 = current[i];
        const p1 = current[i + 1];
        const pr0 = (p0.pr !== undefined && p0.pr > 0) ? p0.pr : ((p0.smoothedPressure !== undefined && p0.smoothedPressure > 0) ? p0.smoothedPressure : ((p0.pressure !== undefined && p0.pressure > 0) ? p0.pressure : 0.5));
        const pr1 = (p1.pr !== undefined && p1.pr > 0) ? p1.pr : ((p1.smoothedPressure !== undefined && p1.smoothedPressure > 0) ? p1.smoothedPressure : ((p1.pressure !== undefined && p1.pressure > 0) ? p1.pressure : 0.5));

        const x1 = Math.round((0.75 * p0.x + 0.25 * p1.x) * 10) / 10;
        const y1 = Math.round((0.75 * p0.y + 0.25 * p1.y) * 10) / 10;
        const pMed0 = Math.round((0.75 * pr0 + 0.25 * pr1) * 100) / 100;
        smoothed.push({ x: x1, y: y1, pr: pMed0 });

        const x2 = Math.round((0.25 * p0.x + 0.75 * p1.x) * 10) / 10;
        const y2 = Math.round((0.25 * p0.y + 0.75 * p1.y) * 10) / 10;
        const pMed1 = Math.round((0.25 * pr0 + 0.75 * pr1) * 100) / 100;
        smoothed.push({ x: x2, y: y2, pr: pMed1 });
      }
      smoothed.push(current[current.length - 1]);
      current = smoothed;
    }
    return current;
  }

  // Dựng từng loại phần tử
  function drawElement(el, pageNum = null) {
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
        const r = Math.max(1, (el.width || 1.5) / 2);
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
        if (el.points.length === 2) {
          ctx.moveTo(el.points[0].x, el.points[0].y);
          ctx.lineTo(el.points[1].x, el.points[1].y);
        } else {
          ctx.moveTo(el.points[0].x, el.points[0].y);
          for (let i = 1; i < el.points.length - 1; i++) {
            const p1 = el.points[i];
            const p2 = el.points[i + 1];
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
          }
          const lastPt = el.points[el.points.length - 1];
          ctx.lineTo(lastPt.x, lastPt.y);
        }
        ctx.stroke();
      } else {
        ctx.globalAlpha = 1.0;
        if (el.points.length === 2 || el.smoothing === 'normal') {
          for (let i = 1; i < el.points.length; i++) {
            const p1 = el.points[i - 1];
            const p2 = el.points[i];
            const pr1 = (p1.pr !== undefined && p1.pr > 0) ? p1.pr : ((p1.smoothedPressure !== undefined && p1.smoothedPressure > 0) ? p1.smoothedPressure : ((p1.pressure !== undefined && p1.pressure > 0) ? p1.pressure : 0.5));
            const pr2 = (p2.pr !== undefined && p2.pr > 0) ? p2.pr : ((p2.smoothedPressure !== undefined && p2.smoothedPressure > 0) ? p2.smoothedPressure : ((p2.pressure !== undefined && p2.pressure > 0) ? p2.pressure : 0.5));
            const pressureMultiplier = (pr1 + pr2) / 2;
            ctx.lineWidth = Math.max(1, (el.width || 1.5) * (0.6 + pressureMultiplier * 0.8));

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        } else {
          // Thuật toán mực số Siêu mượt: Gom cụm đường cong (Batching) Quadratic Bezier qua trung điểm kết hợp Tapering 2 đầu
          const pts = el.points;
          const totalPts = pts.length;
          let midPrev = {
            x: (pts[0].x + pts[1].x) / 2,
            y: (pts[0].y + pts[1].y) / 2
          };

          // Hàm tính độ dày có tapering mềm mại ở đầu và đuôi nét
          const getTaperedWidth = (baseW, pr, index) => {
            let taper = 1.0;
            if (totalPts >= 6) {
              if (index < 3) {
                taper = 0.45 + 0.55 * (index / 3);
              } else if (index >= totalPts - 3) {
                taper = 0.35 + 0.65 * ((totalPts - 1 - index) / 3);
              }
            }
            return Math.max(0.8, baseW * (0.6 + pr * 0.8) * taper);
          };

          // 1. Phân đoạn đầu từ P0 đến Trung điểm Mid1
          const pr0 = (pts[0].pr !== undefined && pts[0].pr > 0) ? pts[0].pr : ((pts[0].smoothedPressure !== undefined && pts[0].smoothedPressure > 0) ? pts[0].smoothedPressure : ((pts[0].pressure !== undefined && pts[0].pressure > 0) ? pts[0].pressure : 0.5));
          let currentLineWidth = getTaperedWidth(el.width || 1.5, pr0, 0);
          ctx.lineWidth = currentLineWidth;
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          ctx.lineTo(midPrev.x, midPrev.y);

          // 2. Các phân đoạn uốn lượn trung gian liên tục C1 (Gom stroke để giảm tải GPU 10x)
          for (let i = 1; i < pts.length - 1; i++) {
            const pCurr = pts[i];
            const pNext = pts[i + 1];
            const midCurr = {
              x: (pCurr.x + pNext.x) / 2,
              y: (pCurr.y + pNext.y) / 2
            };
            const pr = (pCurr.pr !== undefined && pCurr.pr > 0) ? pCurr.pr : ((pCurr.smoothedPressure !== undefined && pCurr.smoothedPressure > 0) ? pCurr.smoothedPressure : ((pCurr.pressure !== undefined && pCurr.pressure > 0) ? pCurr.pressure : 0.5));
            const nextLineWidth = getTaperedWidth(el.width || 1.5, pr, i);

            // Chỉ stroke và đổi lineWidth khi độ chênh lệch >= 0.25px (giảm từ hàng trăm draw call xuống vài call)
            if (Math.abs(nextLineWidth - currentLineWidth) >= 0.25) {
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(midPrev.x, midPrev.y);
              ctx.lineWidth = nextLineWidth;
              currentLineWidth = nextLineWidth;
            }

            ctx.quadraticCurveTo(pCurr.x, pCurr.y, midCurr.x, midCurr.y);
            midPrev = midCurr;
          }

          // 3. Phân đoạn cuối vuốt nhẹ từ Trung điểm cuối đến điểm nhấc bút
          const pLast = pts[pts.length - 1];
          ctx.lineTo(pLast.x, pLast.y);
          ctx.stroke();
        }
      }
    } else if (el.type === 'text') {
      const fontSize = el.fontSize || 22;
      const fontWeight = el.fontWeight || 'normal';
      const fontFam = el.fontFamily || '"Caveat", "Dancing Script", cursive';
      ctx.font = `${fontWeight} ${fontSize}px ${fontFam}`;
      ctx.fillStyle = el.color || state.color || '#28634e';
      ctx.textBaseline = 'top';

      const lines = (el.text || '').split('\n');
      const lineHeight = Math.round(fontSize * 1.35);
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], el.x, el.y + i * lineHeight);
      }
    } else if (el.type === 'image') {
      if (!el.img && el.src) {
        el.img = new Image();
        el.img.src = el.src;
        el.img.onload = () => {
          renderPage(pageNum || state.currentPage);
          if (typeof scheduleThumbnailUpdate === 'function') {
            scheduleThumbnailUpdate(pageNum || state.currentPage);
          } else {
            updateThumbnail(pageNum || state.currentPage);
          }
        };
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

  const SOLID_SHAPES = [
    'tetrahedron',
    'pyramid-quad',
    'pyramid-trapezoid',
    'pyramid-parallelogram',
    'pyramid-pentagon',
    'pyramid-regular',
    'pyramid-sa-triangle',
    'pyramid-sa-parallelogram',
    'pyramid-sa-trapezoid',
    'pyramid-sa-quad',
    'prism-stand',
    'prism-oblique',
    'box-rect',
    'cone',
    'cylinder',
    'sphere'
  ];

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
      const S = { x: left + w * 0.38, y: top, name: '', offX: 0, offY: -10 };
      const A = { x: left + w * 0.10, y: top + h * 0.72, name: '', offX: -14, offY: 2 };
      const B = { x: left + w * 0.45, y: bottom, name: '', offX: -8, offY: 15 };
      const C = { x: right, y: top + h * 0.74, name: '', offX: 8, offY: 4 };

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
      const S = { x: left + w * 0.36, y: top, name: '', offX: 0, offY: -10 };
      const A = { x: left + w * 0.22, y: top + h * 0.65, name: '', offX: -14, offY: 0 };
      const B = { x: left, y: bottom - h * 0.06, name: '', offX: -14, offY: 10 };
      const C = { x: left + w * 0.70, y: bottom, name: '', offX: 2, offY: 16 };
      const D = { x: right, y: top + h * 0.68, name: '', offX: 8, offY: 2 };

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
      const S = { x: left + w * 0.35, y: top, name: '', offX: 0, offY: -10 };
      const A = { x: left + w * 0.15, y: top + h * 0.62, name: '', offX: -14, offY: 0 };
      const D = { x: right, y: top + h * 0.62, name: '', offX: 8, offY: 2 };
      const B = { x: left + w * 0.05, y: bottom, name: '', offX: -14, offY: 14 };
      const C = { x: left + w * 0.65, y: bottom, name: '', offX: 4, offY: 15 };

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
      const S = { x: left + w * 0.38, y: top, name: '', offX: 0, offY: -10 };
      const A = { x: left + w * 0.30, y: top + h * 0.62, name: '', offX: -14, offY: 0 };
      const D = { x: right, y: top + h * 0.62, name: '', offX: 8, offY: 2 };
      const B = { x: left, y: bottom, name: '', offX: -14, offY: 14 };
      const C = { x: right - w * 0.30, y: bottom, name: '', offX: 8, offY: 14 };

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
      const S = { x: left + w * 0.40, y: top, name: '', offX: 0, offY: -10 };
      const A = { x: left + w * 0.20, y: top + h * 0.60, name: '', offX: -14, offY: 0 };
      const B = { x: left, y: top + h * 0.80, name: '', offX: -14, offY: 10 };
      const C = { x: left + w * 0.40, y: bottom, name: '', offX: -6, offY: 15 };
      const D = { x: left + w * 0.80, y: bottom - h * 0.08, name: '', offX: 6, offY: 14 };
      const E = { x: right, y: top + h * 0.64, name: '', offX: 8, offY: 2 };

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
      const A = { x: left + w * 0.30, y: top + h * 0.65, name: '', offX: -14, offY: 0 };
      const D = { x: right, y: top + h * 0.65, name: '', offX: 8, offY: 2 };
      const B = { x: left, y: bottom, name: '', offX: -14, offY: 14 };
      const C = { x: right - w * 0.30, y: bottom, name: '', offX: 8, offY: 14 };

      const O = {
        x: (A.x + C.x) / 2,
        y: (A.y + C.y) / 2,
        name: '',
        offX: 6,
        offY: 12
      };
      const S = { x: O.x, y: top, name: '', offX: 0, offY: -10 };

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
    } else if (shape === 'pyramid-sa-triangle') {
      // Chóp S.ABC có SA ⊥ (ABC)
      const A = { x: left + w * 0.22, y: top + h * 0.65, name: '', offX: -14, offY: 0 };
      const S = { x: A.x, y: top, name: '', offX: 0, offY: -10 };
      const B = { x: left, y: bottom, name: '', offX: -14, offY: 14 };
      const C = { x: right, y: top + h * 0.72, name: '', offX: 8, offY: 4 };

      points = [S, A, B, C];
      edges = [
        [0, 1, 'dashed'], // SA đường cao thẳng đứng vuông góc mặt đáy
        [1, 3, 'dashed'], // AC cạnh đáy sau
        [1, 2, 'solid'],  // AB cạnh đáy trước-trái
        [2, 3, 'solid'],  // BC cạnh đáy trước
        [0, 2, 'solid'],  // SB cạnh bên trước
        [0, 3, 'solid']   // SC cạnh bên phải
      ];
    } else if (shape === 'pyramid-sa-parallelogram') {
      // Chóp S.ABCD có SA ⊥ (ABCD) đáy hình bình hành
      const A = { x: left + w * 0.28, y: top + h * 0.62, name: '', offX: -14, offY: 0 };
      const S = { x: A.x, y: top, name: '', offX: 0, offY: -10 };
      const B = { x: left, y: bottom, name: '', offX: -14, offY: 14 };
      const D = { x: right, y: top + h * 0.62, name: '', offX: 8, offY: 2 };
      const C = { x: right - w * 0.28, y: bottom, name: '', offX: 8, offY: 14 };

      points = [S, A, B, C, D];
      edges = [
        [0, 1, 'dashed'], // SA vuông góc đáy
        [1, 4, 'dashed'], // AD đáy sau
        [1, 2, 'dashed'], // AB đáy trong
        [2, 3, 'solid'],  // BC đáy trước
        [3, 4, 'solid'],  // CD đáy phải
        [0, 2, 'solid'],  // SB
        [0, 3, 'solid'],  // SC
        [0, 4, 'solid']   // SD
      ];
    } else if (shape === 'pyramid-sa-trapezoid') {
      // Chóp S.ABCD có SA ⊥ (ABCD) đáy hình thang
      const A = { x: left + w * 0.18, y: top + h * 0.62, name: '', offX: -14, offY: 0 };
      const S = { x: A.x, y: top, name: '', offX: 0, offY: -10 };
      const D = { x: right, y: top + h * 0.62, name: '', offX: 8, offY: 2 };
      const B = { x: left + w * 0.05, y: bottom, name: '', offX: -14, offY: 14 };
      const C = { x: left + w * 0.65, y: bottom, name: '', offX: 4, offY: 15 };

      points = [S, A, B, C, D];
      edges = [
        [0, 1, 'dashed'], // SA
        [1, 4, 'dashed'], // AD đáy sau
        [1, 2, 'dashed'], // AB
        [2, 3, 'solid'],  // BC
        [3, 4, 'solid'],  // CD
        [0, 2, 'solid'],  // SB
        [0, 3, 'solid'],  // SC
        [0, 4, 'solid']   // SD
      ];
    } else if (shape === 'pyramid-sa-quad') {
      // Chóp S.ABCD có SA ⊥ (ABCD) đáy tứ giác
      const A = { x: left + w * 0.22, y: top + h * 0.65, name: '', offX: -14, offY: 0 };
      const S = { x: A.x, y: top, name: '', offX: 0, offY: -10 };
      const B = { x: left, y: bottom - h * 0.06, name: '', offX: -14, offY: 10 };
      const C = { x: left + w * 0.70, y: bottom, name: '', offX: 2, offY: 16 };
      const D = { x: right, y: top + h * 0.68, name: '', offX: 8, offY: 2 };

      points = [S, A, B, C, D];
      edges = [
        [0, 1, 'dashed'], // SA
        [1, 4, 'dashed'], // AD
        [1, 2, 'dashed'], // AB
        [2, 3, 'solid'],  // BC
        [3, 4, 'solid'],  // CD
        [0, 2, 'solid'],  // SB
        [0, 3, 'solid'],  // SC
        [0, 4, 'solid']   // SD
      ];
    } else if (shape === 'prism-stand') {
      // Lăng trụ đứng tam giác ABC.A'B'C' (cạnh bên vuông góc đáy)
      const A = { x: left + w * 0.15, y: bottom - h * 0.15, name: '', offX: -14, offY: 0 };
      const B = { x: left + w * 0.45, y: bottom, name: '', offX: -8, offY: 14 };
      const C = { x: right, y: bottom - h * 0.14, name: '', offX: 8, offY: 4 };
      const hPrism = h * 0.65;
      const A1 = { x: A.x, y: A.y - hPrism, name: '', offX: -16, offY: -6 };
      const B1 = { x: B.x, y: B.y - hPrism, name: '', offX: -8, offY: -10 };
      const C1 = { x: C.x, y: C.y - hPrism, name: '', offX: 8, offY: -6 };

      points = [A, B, C, A1, B1, C1];
      edges = [
        [0, 2, 'dashed'], // AC
        [0, 3, 'dashed'], // AA'
        [0, 1, 'solid'],  // AB
        [1, 2, 'solid'],  // BC
        [3, 4, 'solid'],  // A'B'
        [4, 5, 'solid'],  // B'C'
        [3, 5, 'solid'],  // A'C'
        [1, 4, 'solid'],  // BB'
        [2, 5, 'solid']   // CC'
      ];
    } else if (shape === 'prism-oblique') {
      // Lăng trụ xiên ABC.A'B'C'
      const A = { x: left + w * 0.10, y: bottom - h * 0.15, name: '', offX: -14, offY: 0 };
      const B = { x: left + w * 0.40, y: bottom, name: '', offX: -8, offY: 14 };
      const C = { x: right - w * 0.20, y: bottom - h * 0.14, name: '', offX: 8, offY: 4 };
      const hPrism = h * 0.65;
      const slantX = w * 0.20;
      const A1 = { x: A.x + slantX, y: A.y - hPrism, name: '', offX: -16, offY: -6 };
      const B1 = { x: B.x + slantX, y: B.y - hPrism, name: '', offX: -8, offY: -10 };
      const C1 = { x: C.x + slantX, y: C.y - hPrism, name: '', offX: 8, offY: -6 };

      points = [A, B, C, A1, B1, C1];
      edges = [
        [0, 2, 'dashed'], // AC
        [0, 3, 'dashed'], // AA'
        [0, 1, 'solid'],  // AB
        [1, 2, 'solid'],  // BC
        [3, 4, 'solid'],  // A'B'
        [4, 5, 'solid'],  // B'C'
        [3, 5, 'solid'],  // A'C'
        [1, 4, 'solid'],  // BB'
        [2, 5, 'solid']   // CC'
      ];
    } else if (shape === 'box-rect') {
      // Hình hộp chữ nhật / Hình lập phương ABCD.A'B'C'D'
      const A = { x: left + w * 0.25, y: bottom - h * 0.20, name: '', offX: -14, offY: 0 };
      const D = { x: right, y: bottom - h * 0.20, name: '', offX: 8, offY: 2 };
      const B = { x: left, y: bottom, name: '', offX: -14, offY: 14 };
      const C = { x: right - w * 0.25, y: bottom, name: '', offX: 8, offY: 14 };
      const hBox = h * 0.60;
      const A1 = { x: A.x, y: A.y - hBox, name: '', offX: -16, offY: -6 };
      const D1 = { x: D.x, y: D.y - hBox, name: '', offX: 8, offY: -6 };
      const B1 = { x: B.x, y: B.y - hBox, name: '', offX: -14, offY: -8 };
      const C1 = { x: C.x, y: C.y - hBox, name: '', offX: 8, offY: -8 };

      points = [A, B, C, D, A1, B1, C1, D1];
      edges = [
        [0, 3, 'dashed'], // AD
        [0, 1, 'dashed'], // AB
        [0, 4, 'dashed'], // AA'
        [1, 2, 'solid'],  // BC
        [2, 3, 'solid'],  // CD
        [4, 5, 'solid'],  // A'B'
        [5, 6, 'solid'],  // B'C'
        [6, 7, 'solid'],  // C'D'
        [7, 4, 'solid'],  // D'A'
        [1, 5, 'solid'],  // BB'
        [2, 6, 'solid'],  // CC'
        [3, 7, 'solid']   // DD'
      ];
    } else if (shape === 'cone') {
      // Hình nón tròn xoay (đỉnh S, tâm đáy O, đường kính đáy AB)
      const S = { x: left + w * 0.50, y: top, name: '', offX: 0, offY: -10 };
      const O = { x: left + w * 0.50, y: bottom - h * 0.14, name: '', offX: 0, offY: 14 };
      const A = { x: left + w * 0.08, y: O.y, name: '', offX: -14, offY: 2 };
      const B = { x: right - w * 0.08, y: O.y, name: '', offX: 8, offY: 2 };

      points = [S, O, A, B];
      edges = [
        [0, 2, 'solid'],  // SA đường sinh trái
        [0, 3, 'solid'],  // SB đường sinh phải
        [0, 1, 'dashed'], // SO trục cao
        [1, 3, 'dashed']  // OB bán kính đáy
      ];
    } else if (shape === 'cylinder') {
      // Hình trụ tròn xoay (tâm đáy trên O1, tâm đáy dưới O2)
      const O1 = { x: left + w * 0.50, y: top + h * 0.14, name: '', offX: 0, offY: -12 };
      const A1 = { x: left + w * 0.08, y: O1.y, name: '', offX: -16, offY: 2 };
      const B1 = { x: right - w * 0.08, y: O1.y, name: '', offX: 8, offY: 2 };

      const O2 = { x: left + w * 0.50, y: bottom - h * 0.14, name: '', offX: 0, offY: 14 };
      const A2 = { x: left + w * 0.08, y: O2.y, name: '', offX: -14, offY: 2 };
      const B2 = { x: right - w * 0.08, y: O2.y, name: '', offX: 8, offY: 2 };

      points = [O1, A1, B1, O2, A2, B2];
      edges = [
        [1, 4, 'solid'],  // A'A đường sinh trái
        [2, 5, 'solid'],  // B'B đường sinh phải
        [0, 3, 'dashed'], // O'O trục
        [3, 5, 'dashed']  // OB bán kính đáy dưới
      ];
    } else if (shape === 'sphere') {
      // Mặt cầu / Khối cầu (tâm O, bán kính R, điểm xích đạo M)
      const O = { x: left + w * 0.50, y: top + h * 0.50, name: '', offX: -6, offY: -10 };
      const R = Math.min(w, h) * 0.46;
      const M = { x: O.x + R, y: O.y, name: '', offX: 10, offY: 2 };

      points = [O, M];
      edges = [
        [0, 1, 'dashed'] // OM bán kính
      ];
    }

    return { points, edges };
  }



  function updateRegularPyramidCenterAndApex(el) {
    if (!el.points || el.points.length < 6) return;
    const A = el.points[1], C = el.points[3];
    const ox = Math.round((A.x + C.x) / 2);
    const oy = Math.round((A.y + C.y) / 2);
    const prevO = el.points[5] || {};
    el.points[5] = {
      x: ox,
      y: oy,
      name: prevO.name || '',
      offX: prevO.offX !== undefined ? prevO.offX : 6,
      offY: prevO.offY !== undefined ? prevO.offY : 12
    };
    if (el.points[0]) {
      el.points[0].x = ox; // Giữ trục thẳng đứng SO chuẩn SGK
    }
  }

  function handleSolidShapeDrag(el, h, target) {
    if (!el.points || !el.points[h.index]) return;

    const idx = h.index;
    const shape = el.shape;

    if (shape === 'pyramid-parallelogram') {
      // 0: S, 1: A, 2: B, 3: C, 4: D
      // Đáy là hình bình hành ABCD: A + C = B + D <=> D = A + C - B
      if (idx === 0) {
        // Đỉnh S: di chuyển tự do
        el.points[0].x = target.x;
        el.points[0].y = target.y;
      } else if (idx === 1) {
        // Kéo A: giữ B, C -> cập nhật D = A + C - B (đáy sau AD luôn song song và bằng BC)
        el.points[1].x = target.x;
        el.points[1].y = target.y;
        el.points[4].x = Math.round(target.x + el.points[3].x - el.points[2].x);
        el.points[4].y = Math.round(target.y + el.points[3].y - el.points[2].y);
      } else if (idx === 2) {
        // Kéo B: giữ A, D -> cập nhật C = B + D - A (đáy trước BC luôn song song và bằng AD)
        el.points[2].x = target.x;
        el.points[2].y = target.y;
        el.points[3].x = Math.round(target.x + el.points[4].x - el.points[1].x);
        el.points[3].y = Math.round(target.y + el.points[4].y - el.points[1].y);
      } else if (idx === 3) {
        // Kéo C: giữ A, B -> cập nhật D = A + C - B (cạnh DC luôn song song và bằng AB)
        el.points[3].x = target.x;
        el.points[3].y = target.y;
        el.points[4].x = Math.round(el.points[1].x + target.x - el.points[2].x);
        el.points[4].y = Math.round(el.points[1].y + target.y - el.points[2].y);
      } else if (idx === 4) {
        // Kéo D: giữ A, B -> cập nhật C = B + D - A
        el.points[4].x = target.x;
        el.points[4].y = target.y;
        el.points[3].x = Math.round(el.points[2].x + target.x - el.points[1].x);
        el.points[3].y = Math.round(el.points[2].y + target.y - el.points[1].y);
      }
    } else if (shape === 'pyramid-trapezoid') {
      // 0: S, 1: A, 2: B, 3: C, 4: D
      // Đáy hình thang: AD song song BC. AD là đáy sau, BC là đáy trước.
      if (idx === 0) {
        el.points[0].x = target.x;
        el.points[0].y = target.y;
      } else if (idx === 1) {
        // Kéo A: dịch chuyển cả đáy sau AD theo vector độ dời
        const dx = target.x - el.points[1].x;
        const dy = target.y - el.points[1].y;
        el.points[1].x = target.x;
        el.points[1].y = target.y;
        el.points[4].x += dx;
        el.points[4].y += dy;
      } else if (idx === 2) {
        // Kéo B: thay đổi đáy trước BC
        // AD giữ nguyên hướng song song với BC: D = A + lenAD * u_BC
        const lenAD = Math.max(15, Math.hypot(el.points[4].x - el.points[1].x, el.points[4].y - el.points[1].y));
        el.points[2].x = target.x;
        el.points[2].y = target.y;
        const vx = el.points[3].x - target.x;
        const vy = el.points[3].y - target.y;
        const vLen = Math.hypot(vx, vy);
        if (vLen > 2) {
          el.points[4].x = Math.round(el.points[1].x + (vx / vLen) * lenAD);
          el.points[4].y = Math.round(el.points[1].y + (vy / vLen) * lenAD);
        }
      } else if (idx === 3) {
        // Kéo C: thay đổi đáy trước BC
        // AD giữ nguyên hướng song song với BC: D = A + lenAD * u_BC
        const lenAD = Math.max(15, Math.hypot(el.points[4].x - el.points[1].x, el.points[4].y - el.points[1].y));
        el.points[3].x = target.x;
        el.points[3].y = target.y;
        const vx = target.x - el.points[2].x;
        const vy = target.y - el.points[2].y;
        const vLen = Math.hypot(vx, vy);
        if (vLen > 2) {
          el.points[4].x = Math.round(el.points[1].x + (vx / vLen) * lenAD);
          el.points[4].y = Math.round(el.points[1].y + (vy / vLen) * lenAD);
        }
      } else if (idx === 4) {
        // Kéo D: thay đổi độ dài đáy AD, nhưng D luôn nằm trên đường thẳng qua A song song BC
        const vx = el.points[3].x - el.points[2].x;
        const vy = el.points[3].y - el.points[2].y;
        const vLenSq = vx * vx + vy * vy;
        if (vLenSq > 4) {
          let t = ((target.x - el.points[1].x) * vx + (target.y - el.points[1].y) * vy) / vLenSq;
          t = Math.max(0.12, t);
          el.points[4].x = Math.round(el.points[1].x + t * vx);
          el.points[4].y = Math.round(el.points[1].y + t * vy);
        }
      }
    } else if (shape === 'pyramid-regular') {
      // 0: S, 1: A, 2: B, 3: C, 4: D, 5: O
      // Đáy ABCD là hình bình hành (biểu diễn hình vuông): A + C = B + D.
      // O là tâm đáy: O = (A + C) / 2.
      // S luôn nằm thẳng đứng trên tâm O: S.x = O.x.
      if (idx === 0) {
        // Kéo S: điều chỉnh chiều cao hình chóp
        el.points[0].y = target.y;
        if (el.points[5]) {
          el.points[0].x = el.points[5].x; // Trục thẳng đứng SO
        } else {
          el.points[0].x = target.x;
        }
      } else if (idx === 1) {
        // Kéo A
        el.points[1].x = target.x;
        el.points[1].y = target.y;
        el.points[4].x = Math.round(target.x + el.points[3].x - el.points[2].x);
        el.points[4].y = Math.round(target.y + el.points[3].y - el.points[2].y);
        updateRegularPyramidCenterAndApex(el);
      } else if (idx === 2) {
        // Kéo B
        el.points[2].x = target.x;
        el.points[2].y = target.y;
        el.points[3].x = Math.round(target.x + el.points[4].x - el.points[1].x);
        el.points[3].y = Math.round(target.y + el.points[4].y - el.points[1].y);
        updateRegularPyramidCenterAndApex(el);
      } else if (idx === 3) {
        // Kéo C
        el.points[3].x = target.x;
        el.points[3].y = target.y;
        el.points[4].x = Math.round(el.points[1].x + target.x - el.points[2].x);
        el.points[4].y = Math.round(el.points[1].y + target.y - el.points[2].y);
        updateRegularPyramidCenterAndApex(el);
      } else if (idx === 4) {
        // Kéo D
        el.points[4].x = target.x;
        el.points[4].y = target.y;
        el.points[3].x = Math.round(el.points[2].x + target.x - el.points[1].x);
        el.points[3].y = Math.round(el.points[2].y + target.y - el.points[1].y);
        updateRegularPyramidCenterAndApex(el);
      } else if (idx === 5) {
        // Kéo tâm O: tịnh tiến toàn bộ đáy và đỉnh
        const dx = target.x - el.points[5].x;
        const dy = target.y - el.points[5].y;
        for (let i = 1; i <= 5; i++) {
          el.points[i].x += dx;
          el.points[i].y += dy;
        }
        el.points[0].x += dx;
      }
    } else if (shape === 'pyramid-quad') {
      // 0: S, 1: A, 2: B, 3: C, 4: D
      // Đáy tứ giác lồi tự do: bảo đảm không tự cắt lộn ngược
      if (idx === 0) {
        el.points[0].x = target.x;
        el.points[0].y = target.y;
      } else if (idx === 1) {
        // A là đỉnh sau bên trái: A.y < B.y - 10, A.x < D.x - 15
        el.points[1].x = Math.min(target.x, el.points[4].x - 15);
        el.points[1].y = Math.min(target.y, el.points[2].y - 10);
      } else if (idx === 2) {
        // B là đỉnh trước bên trái: B.y > A.y + 10, B.x < C.x - 15
        el.points[2].x = Math.min(target.x, el.points[3].x - 15);
        el.points[2].y = Math.max(target.y, el.points[1].y + 10);
      } else if (idx === 3) {
        // C là đỉnh trước bên phải: C.x > B.x + 15, C.y > D.y + 10
        el.points[3].x = Math.max(target.x, el.points[2].x + 15);
        el.points[3].y = Math.max(target.y, el.points[4].y + 10);
      } else if (idx === 4) {
        // D là đỉnh sau bên phải: D.x > A.x + 15, D.y < C.y - 10
        el.points[4].x = Math.max(target.x, el.points[1].x + 15);
        el.points[4].y = Math.min(target.y, el.points[3].y - 10);
      }
    } else if (shape === 'pyramid-pentagon') {
      // 0: S, 1..5: A, B, C, D, E
      if (idx === 0) {
        el.points[0].x = target.x;
        el.points[0].y = target.y;
      } else {
        // Đỉnh đáy: giữ A và E ở tầng sau (y nhỏ hơn tầng trước B, C, D)
        if (idx === 1) {
          el.points[1].x = target.x;
          el.points[1].y = Math.min(target.y, el.points[2].y - 10);
        } else if (idx === 5) {
          el.points[5].x = target.x;
          el.points[5].y = Math.min(target.y, el.points[4].y - 10);
        } else {
          el.points[idx].x = target.x;
          el.points[idx].y = target.y;
        }
      }
    } else if (shape === 'pyramid-sa-triangle') {
      // Chóp S.ABC có SA ⊥ (ABC) tại A (S.x = A.x)
      if (idx === 0) {
        el.points[0].x = el.points[1].x;
        el.points[0].y = target.y;
      } else if (idx === 1) {
        el.points[1].x = target.x;
        el.points[1].y = target.y;
        el.points[0].x = target.x;
      } else {
        el.points[idx].x = target.x;
        el.points[idx].y = target.y;
      }
    } else if (shape === 'pyramid-sa-parallelogram') {
      // Chóp S.ABCD có SA ⊥ (ABCD) đáy HBH: S.x = A.x, D = A + C - B
      if (idx === 0) {
        el.points[0].x = el.points[1].x;
        el.points[0].y = target.y;
      } else if (idx === 1) {
        el.points[1].x = target.x;
        el.points[1].y = target.y;
        el.points[0].x = target.x;
        el.points[4].x = Math.round(target.x + el.points[3].x - el.points[2].x);
        el.points[4].y = Math.round(target.y + el.points[3].y - el.points[2].y);
      } else if (idx === 2) {
        el.points[2].x = target.x;
        el.points[2].y = target.y;
        el.points[3].x = Math.round(target.x + el.points[4].x - el.points[1].x);
        el.points[3].y = Math.round(target.y + el.points[4].y - el.points[1].y);
      } else if (idx === 3) {
        el.points[3].x = target.x;
        el.points[3].y = target.y;
        el.points[4].x = Math.round(el.points[1].x + target.x - el.points[2].x);
        el.points[4].y = Math.round(el.points[1].y + target.y - el.points[2].y);
      } else if (idx === 4) {
        el.points[4].x = target.x;
        el.points[4].y = target.y;
        el.points[3].x = Math.round(el.points[2].x + target.x - el.points[1].x);
        el.points[3].y = Math.round(el.points[2].y + target.y - el.points[1].y);
      }
    } else if (shape === 'pyramid-sa-trapezoid') {
      // Chóp S.ABCD có SA ⊥ (ABCD) đáy hình thang: S.x = A.x, AD song song BC
      if (idx === 0) {
        el.points[0].x = el.points[1].x;
        el.points[0].y = target.y;
      } else if (idx === 1) {
        const dx = target.x - el.points[1].x;
        const dy = target.y - el.points[1].y;
        el.points[1].x = target.x;
        el.points[1].y = target.y;
        el.points[0].x = target.x;
        el.points[4].x += dx;
        el.points[4].y += dy;
      } else if (idx === 2 || idx === 3) {
        el.points[idx].x = target.x;
        el.points[idx].y = target.y;
        const baseAngle = Math.atan2(el.points[3].y - el.points[2].y, el.points[3].x - el.points[2].x);
        const topLen = Math.hypot(el.points[4].x - el.points[1].x, el.points[4].y - el.points[1].y);
        el.points[4].x = Math.round(el.points[1].x + topLen * Math.cos(baseAngle));
        el.points[4].y = Math.round(el.points[1].y + topLen * Math.sin(baseAngle));
      } else if (idx === 4) {
        const vx = el.points[3].x - el.points[2].x;
        const vy = el.points[3].y - el.points[2].y;
        const vLen = Math.hypot(vx, vy);
        if (vLen > 1) {
          const ux = vx / vLen, uy = vy / vLen;
          const proj = (target.x - el.points[1].x) * ux + (target.y - el.points[1].y) * uy;
          const clampedProj = Math.max(30, proj);
          el.points[4].x = Math.round(el.points[1].x + clampedProj * ux);
          el.points[4].y = Math.round(el.points[1].y + clampedProj * uy);
        }
      }
    } else if (shape === 'pyramid-sa-quad') {
      if (idx === 0) {
        el.points[0].x = el.points[1].x;
        el.points[0].y = target.y;
      } else if (idx === 1) {
        el.points[1].x = target.x;
        el.points[1].y = target.y;
        el.points[0].x = target.x;
      } else {
        el.points[idx].x = target.x;
        el.points[idx].y = target.y;
      }
    } else if (shape === 'prism-stand') {
      if (idx >= 3) {
        const diffH = target.y - el.points[idx].y;
        for (let i = 3; i <= 5; i++) {
          el.points[i].y += diffH;
        }
      } else {
        const dx = target.x - el.points[idx].x;
        const dy = target.y - el.points[idx].y;
        el.points[idx].x = target.x;
        el.points[idx].y = target.y;
        el.points[idx + 3].x += dx;
        el.points[idx + 3].y += dy;
      }
    } else if (shape === 'prism-oblique') {
      if (idx >= 3) {
        const dx = target.x - el.points[idx].x;
        const dy = target.y - el.points[idx].y;
        for (let i = 3; i <= 5; i++) {
          el.points[i].x += dx;
          el.points[i].y += dy;
        }
      } else {
        el.points[idx].x = target.x;
        el.points[idx].y = target.y;
      }
    } else if (shape === 'box-rect') {
      if (idx >= 4) {
        const diffH = target.y - el.points[idx].y;
        for (let i = 4; i <= 7; i++) {
          el.points[i].y += diffH;
        }
      } else {
        const dx = target.x - el.points[idx].x;
        const dy = target.y - el.points[idx].y;
        el.points[idx].x = target.x;
        el.points[idx].y = target.y;
        el.points[idx + 4].x += dx;
        el.points[idx + 4].y += dy;
      }
    } else if (shape === 'cone' || shape === 'cylinder' || shape === 'sphere') {
      el.points[idx].x = target.x;
      el.points[idx].y = target.y;
    } else {
      // tetrahedron hoặc hình chóp khác
      el.points[idx].x = target.x;
      el.points[idx].y = target.y;
    }

    // Cập nhật bounding box start / end
    const xs = el.points.map(pt => pt.x);
    const ys = el.points.map(pt => pt.y);
    el.start = { x: Math.min(...xs), y: Math.min(...ys) };
    el.end = { x: Math.max(...xs), y: Math.max(...ys) };
  }

  function drawSolidShape(context, geo) {
    if (!geo.points || !geo.edges) return;

    // Đảm bảo cạnh đáy khuất AB [1, 2] khởi tạo nét đứt nếu chưa được người dùng can thiệp
    if (geo.shape && geo.shape.startsWith('pyramid') && !geo.shape.startsWith('pyramid-sa-')) {
      for (const edge of geo.edges) {
        if (((edge[0] === 1 && edge[1] === 2) || (edge[0] === 2 && edge[1] === 1)) && edge[2] === undefined) {
          edge[2] = 'dashed';
        }
      }
    }

    // 1. Vẽ các cạnh đoạn thẳng
    for (const edge of geo.edges) {
      const p1 = geo.points[edge[0]];
      const p2 = geo.points[edge[1]];
      if (!p1 || !p2) continue;

      const eKey = Math.min(edge[0], edge[1]) + '_' + Math.max(edge[0], edge[1]);
      const dashStyle = (geo.edgeDashes && geo.edgeDashes[eKey]) ? geo.edgeDashes[eKey] : edge[2];
      const edgeColor = (geo.edgeColors && geo.edgeColors[eKey]) ? geo.edgeColors[eKey] : (geo.color || '#184e3a');

      context.save();
      context.strokeStyle = edgeColor;
      if (dashStyle === 'dashed') {
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

    // 2. Ký hiệu vuông góc ∟ tại đỉnh A cho các hình chóp SA ⊥ đáy
    if (geo.shape && geo.shape.startsWith('pyramid-sa-')) {
      const S = geo.points[0];
      const A = geo.points[1];
      const D_or_C = geo.points[4] || geo.points[3];
      if (S && A && D_or_C) {
        const sqSize = 8;
        const vRightX = (D_or_C.x - A.x) > 0 ? 1 : -1;
        context.save();
        context.setLineDash([]);
        context.strokeStyle = geo.color || '#184e3a';
        context.lineWidth = 1.3;
        context.beginPath();
        context.moveTo(A.x, A.y - sqSize);
        context.lineTo(A.x + sqSize * vRightX, A.y - sqSize);
        context.lineTo(A.x + sqSize * vRightX, A.y);
        context.stroke();
        context.restore();
      }
    }

    // 3. Đường cong elip / đường tròn cho khối tròn xoay (hình nón, hình trụ, mặt cầu)
    if (geo.shape === 'cone') {
      const O = geo.points[1], B = geo.points[3];
      if (O && B) {
        const rx = Math.max(15, Math.abs(B.x - O.x));
        const ry = Math.max(8, rx * 0.28);
        context.save();
        context.strokeStyle = geo.color || '#184e3a';
        context.lineWidth = geo.width || 2;
        // Nửa sau (khuất): nét đứt
        context.setLineDash([7, 5]);
        context.beginPath();
        context.ellipse(O.x, O.y, rx, ry, 0, Math.PI, Math.PI * 2);
        context.stroke();
        // Nửa trước (thấy): nét liền
        context.setLineDash([]);
        context.beginPath();
        context.ellipse(O.x, O.y, rx, ry, 0, 0, Math.PI);
        context.stroke();
        context.restore();
      }
    } else if (geo.shape === 'cylinder') {
      const O1 = geo.points[0], B1 = geo.points[2];
      const O2 = geo.points[3], B2 = geo.points[5];
      if (O1 && B1 && O2 && B2) {
        const rx = Math.max(15, Math.abs(B1.x - O1.x));
        const ry = Math.max(8, rx * 0.28);
        context.save();
        context.strokeStyle = geo.color || '#184e3a';
        context.lineWidth = geo.width || 2;
        // Đáy trên: toàn bộ nét liền
        context.setLineDash([]);
        context.beginPath();
        context.ellipse(O1.x, O1.y, rx, ry, 0, 0, Math.PI * 2);
        context.stroke();
        // Đáy dưới nửa sau: nét đứt
        context.setLineDash([7, 5]);
        context.beginPath();
        context.ellipse(O2.x, O2.y, rx, ry, 0, Math.PI, Math.PI * 2);
        context.stroke();
        // Đáy dưới nửa trước: nét liền
        context.setLineDash([]);
        context.beginPath();
        context.ellipse(O2.x, O2.y, rx, ry, 0, 0, Math.PI);
        context.stroke();
        context.restore();
      }
    } else if (geo.shape === 'sphere') {
      const O = geo.points[0], M = geo.points[1];
      if (O && M) {
        const R = Math.max(15, Math.hypot(M.x - O.x, M.y - O.y));
        const ry = Math.max(8, R * 0.30);
        context.save();
        context.strokeStyle = geo.color || '#184e3a';
        context.lineWidth = geo.width || 2;
        // Đường tròn lớn ngoài: nét liền
        context.setLineDash([]);
        context.beginPath();
        context.arc(O.x, O.y, R, 0, Math.PI * 2);
        context.stroke();
        // Xích đạo nửa sau: nét đứt
        context.setLineDash([7, 5]);
        context.beginPath();
        context.ellipse(O.x, O.y, R, ry, 0, Math.PI, Math.PI * 2);
        context.stroke();
        // Xích đạo nửa trước: nét liền
        context.setLineDash([]);
        context.beginPath();
        context.ellipse(O.x, O.y, R, ry, 0, 0, Math.PI);
        context.stroke();
        context.restore();
      }
    }

    // 4. Vẽ nhãn tên các đỉnh (A, B, C, S...) và tên cạnh HHKG (nếu người dùng đặt tên)
    for (const p of geo.points) {
      if (p && p.name) {
        drawMathLabel(context, p.name, p.x + (p.offX || 0), p.y + (p.offY || 0), geo.color || '#184e3a', false);
      }
    }
    if (geo.edgeNames && geo.edges) {
      for (let eIdx = 0; eIdx < geo.edges.length; eIdx++) {
        const edge = geo.edges[eIdx];
        const i1 = edge[0], i2 = edge[1];
        const eKey = Math.min(i1, i2) + '_' + Math.max(i1, i2);
        const eName = geo.edgeNames[eKey] || geo.edgeNames[i1 + '_' + i2] || geo.edgeNames[eIdx];
        if (eName && geo.points[i1] && geo.points[i2]) {
          const p1 = geo.points[i1], p2 = geo.points[i2];
          const mx = (p1.x + p2.x) / 2;
          const my = (p1.y + p2.y) / 2;
          const dx = p2.x - p1.x, dy = p2.y - p1.y;
          const len = Math.hypot(dx, dy) || 1;
          let nx = -dy / len, ny = dx / len;
          if (ny > 0) { nx = -nx; ny = -ny; }
          const eColor = (geo.edgeColors && geo.edgeColors[eKey]) ? geo.edgeColors[eKey] : (geo.color || '#184e3a');
          drawMathLabel(context, eName, mx + nx * 12 - 3, my + ny * 12 + 4, eColor, true);
        }
      }
    }
  }

  function drawMathLabel(context, text, x, y, color, isItalic = false) {
    if (!text) return;
    context.save();
    context.font = isItalic
      ? 'italic 600 13px "STIX Two Math", "Cambria Math", -apple-system, sans-serif'
      : '600 13px -apple-system, BlinkMacSystemFont, sans-serif';
    context.lineJoin = 'round';
    context.lineWidth = 3.2;
    context.strokeStyle = 'rgba(255, 255, 255, 0.92)';
    context.strokeText(text, x, y);
    context.fillStyle = color || '#184e3a';
    context.fillText(text, x, y);
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

      if (geo.isSymmetryLine) {
        const p1 = start;
        const p3 = end;
        const p2 = geo.midpoint || { x: (p1.x + p3.x) / 2, y: (p1.y + p3.y) / 2 };
        const segLen = Math.hypot(p3.x - p1.x, p3.y - p1.y) || 1;
        const u = { x: (p3.x - p1.x) / segLen, y: (p3.y - p1.y) / segLen };
        const v = { x: -u.y, y: u.x };

        const M1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        const M2 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
        const tickLen = 5;
        const tickSpacing = 2.2;

        context.save();
        context.beginPath();
        context.moveTo(M1.x - v.x * tickLen - u.x * tickSpacing, M1.y - v.y * tickLen - u.y * tickSpacing);
        context.lineTo(M1.x + v.x * tickLen - u.x * tickSpacing, M1.y + v.y * tickLen - u.y * tickSpacing);
        context.moveTo(M1.x - v.x * tickLen + u.x * tickSpacing, M1.y - v.y * tickLen + u.y * tickSpacing);
        context.lineTo(M1.x + v.x * tickLen + u.x * tickSpacing, M1.y + v.y * tickLen + u.y * tickSpacing);

        context.moveTo(M2.x - v.x * tickLen - u.x * tickSpacing, M2.y - v.y * tickLen - u.y * tickSpacing);
        context.lineTo(M2.x + v.x * tickLen - u.x * tickSpacing, M2.y + v.y * tickLen - u.y * tickSpacing);
        context.moveTo(M2.x - v.x * tickLen + u.x * tickSpacing, M2.y - v.y * tickLen + u.y * tickSpacing);
        context.lineTo(M2.x + v.x * tickLen + u.x * tickSpacing, M2.y + v.y * tickLen + u.y * tickSpacing);
        context.lineWidth = 1.4;
        context.strokeStyle = geo.color || state.color;
        context.stroke();
        context.restore();
      }

      if (geo.isAxisSymmetryLine) {
        const p1 = start;
        const p2 = end;
        const H = geo.midpoint || { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        const segLen = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
        const vPerp = { x: (p2.x - p1.x) / segLen, y: (p2.y - p1.y) / segLen };
        let uAxis = geo.axisDir;
        if (!uAxis) {
          uAxis = { x: -vPerp.y, y: vPerp.x };
        }

        context.save();
        // 1. Ký hiệu góc vuông tại chân đường vuông góc H
        const s = 11;
        context.beginPath();
        context.moveTo(H.x + uAxis.x * s, H.y + uAxis.y * s);
        context.lineTo(H.x + uAxis.x * s + vPerp.x * s, H.y + uAxis.y * s + vPerp.y * s);
        context.lineTo(H.x + vPerp.x * s, H.y + vPerp.y * s);
        context.lineWidth = 1.3;
        context.strokeStyle = geo.color || state.color;
        context.stroke();

        // 2. Ký hiệu 2 vạch bằng nhau trên 2 nửa P1-H và H-P2
        const M1 = { x: (p1.x + H.x) / 2, y: (p1.y + H.y) / 2 };
        const M2 = { x: (H.x + p2.x) / 2, y: (H.y + p2.y) / 2 };
        const tickLen = 5;
        const tickSpacing = 2.2;

        context.beginPath();
        context.moveTo(M1.x - uAxis.x * tickLen - vPerp.x * tickSpacing, M1.y - uAxis.y * tickLen - vPerp.y * tickSpacing);
        context.lineTo(M1.x + uAxis.x * tickLen - vPerp.x * tickSpacing, M1.y + uAxis.y * tickLen - vPerp.y * tickSpacing);
        context.moveTo(M1.x - uAxis.x * tickLen + vPerp.x * tickSpacing, M1.y - uAxis.y * tickLen + vPerp.y * tickSpacing);
        context.lineTo(M1.x + uAxis.x * tickLen + vPerp.x * tickSpacing, M1.y + uAxis.y * tickLen + vPerp.y * tickSpacing);

        context.moveTo(M2.x - uAxis.x * tickLen - vPerp.x * tickSpacing, M2.y - uAxis.y * tickLen - vPerp.y * tickSpacing);
        context.lineTo(M2.x + uAxis.x * tickLen - vPerp.x * tickSpacing, M2.y + uAxis.y * tickLen - vPerp.y * tickSpacing);
        context.moveTo(M2.x - uAxis.x * tickLen + vPerp.x * tickSpacing, M2.y - uAxis.y * tickLen + vPerp.y * tickSpacing);
        context.lineTo(M2.x + uAxis.x * tickLen + vPerp.x * tickSpacing, M2.y + uAxis.y * tickLen + vPerp.y * tickSpacing);
        context.lineWidth = 1.4;
        context.stroke();
        context.restore();
      }
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

      if ((geo.edgeDashes && Object.keys(geo.edgeDashes).length > 0) || (geo.edgeColors && Object.keys(geo.edgeColors).length > 0)) {
        for (let j = 0; j < 3; j++) {
          const ptA = geo.points[j];
          const ptB = geo.points[(j + 1) % 3];
          context.save();
          if (geo.edgeColors && geo.edgeColors[j]) {
            context.strokeStyle = geo.edgeColors[j];
          }
          const eDash = (geo.edgeDashes && geo.edgeDashes[j]) ? geo.edgeDashes[j] : (geo.dash || 'solid');
          if (eDash === 'dashed') {
            context.setLineDash([8, 6]);
          } else {
            context.setLineDash([]);
          }
          context.beginPath();
          context.moveTo(ptA.x, ptA.y);
          context.lineTo(ptB.x, ptB.y);
          context.stroke();
          context.restore();
        }
      } else {
        context.beginPath();
        context.moveTo(geo.points[0].x, geo.points[0].y);
        context.lineTo(geo.points[1].x, geo.points[1].y);
        context.lineTo(geo.points[2].x, geo.points[2].y);
        context.closePath();
        context.stroke();
      }

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

      if ((geo.edgeDashes && Object.keys(geo.edgeDashes).length > 0) || (geo.edgeColors && Object.keys(geo.edgeColors).length > 0)) {
        const n = geo.points.length;
        for (let j = 0; j < n; j++) {
          const ptA = geo.points[j];
          const ptB = geo.points[(j + 1) % n];
          context.save();
          if (geo.edgeColors && geo.edgeColors[j]) {
            context.strokeStyle = geo.edgeColors[j];
          }
          const eDash = (geo.edgeDashes && geo.edgeDashes[j]) ? geo.edgeDashes[j] : (geo.dash || 'solid');
          if (eDash === 'dashed') {
            context.setLineDash([8, 6]);
          } else {
            context.setLineDash([]);
          }
          context.beginPath();
          context.moveTo(ptA.x, ptA.y);
          context.lineTo(ptB.x, ptB.y);
          context.stroke();
          context.restore();
        }
      } else {
        context.beginPath();
        context.moveTo(geo.points[0].x, geo.points[0].y);
        for (let i = 1; i < geo.points.length; i++) {
          context.lineTo(geo.points[i].x, geo.points[i].y);
        }
        context.closePath();
        context.stroke();
      }
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

      if ((geo.edgeDashes && Object.keys(geo.edgeDashes).length > 0) || (geo.edgeColors && Object.keys(geo.edgeColors).length > 0)) {
        const triPts = [p1, p2, p3];
        for (let j = 0; j < 3; j++) {
          const ptA = triPts[j];
          const ptB = triPts[(j + 1) % 3];
          context.save();
          if (geo.edgeColors && geo.edgeColors[j]) {
            context.strokeStyle = geo.edgeColors[j];
          }
          const eDash = (geo.edgeDashes && geo.edgeDashes[j]) ? geo.edgeDashes[j] : (geo.dash || 'solid');
          if (eDash === 'dashed') {
            context.setLineDash([8, 6]);
          } else {
            context.setLineDash([]);
          }
          context.beginPath();
          context.moveTo(ptA.x, ptA.y);
          context.lineTo(ptB.x, ptB.y);
          context.stroke();
          context.restore();
        }
      } else {
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.lineTo(p3.x, p3.y);
        context.closePath();
        context.stroke();
      }
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

      // Hiển thị chấm tròn tiếp điểm T rõ ràng trên đường tròn
      if (geo.tangentPoint) {
        context.save();
        context.setLineDash([]);
        context.beginPath();
        context.arc(geo.tangentPoint.x, geo.tangentPoint.y, 4, 0, Math.PI * 2);
        context.fillStyle = geo.color || state.color || '#184e3a';
        context.fill();
        context.lineWidth = 1.5;
        context.strokeStyle = '#ffffff';
        context.stroke();
        context.restore();
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

      if (geo.name) {
        const offX = geo.offX !== undefined ? geo.offX : 8;
        const offY = geo.offY !== undefined ? geo.offY : -8;
        drawMathLabel(context, geo.name, start.x + offX, start.y + offY, geo.color || state.color || '#28634e', false);
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
      geo.tangentPoint1 = t1;
      geo.tangentPoint2 = t2;

      // 2 đoạn tiếp tuyến MT1 và MT2
      context.beginPath();
      context.moveTo(end.x, end.y);
      context.lineTo(t1.x, t1.y);
      context.moveTo(end.x, end.y);
      context.lineTo(t2.x, t2.y);
      context.stroke();

      // Hiển thị 2 chấm tròn tiếp điểm T1 và T2 rõ ràng trên đường tròn
      context.save();
      context.setLineDash([]);
      for (const tp of [t1, t2]) {
        context.beginPath();
        context.arc(tp.x, tp.y, 4, 0, Math.PI * 2);
        context.fillStyle = geo.color || state.color || '#184e3a';
        context.fill();
        context.lineWidth = 1.5;
        context.strokeStyle = '#ffffff';
        context.stroke();
      }
      context.restore();
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
    } else if (shape === 'perpendicular-bisector') {
      // 1. Kẻ đường thẳng trung trực xuyên suốt từ start đến end
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();

      const M = geo.midpoint || { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
      const lenPerp = Math.hypot(end.x - start.x, end.y - start.y) || 1;
      const v = { x: (end.x - start.x) / lenPerp, y: (end.y - start.y) / lenPerp }; // Hướng đường trung trực
      let u = geo.baseDir;
      if (!u && geo.segStart && geo.segEnd) {
        const segLen = Math.hypot(geo.segEnd.x - geo.segStart.x, geo.segEnd.y - geo.segStart.y) || 1;
        u = { x: (geo.segEnd.x - geo.segStart.x) / segLen, y: (geo.segEnd.y - geo.segStart.y) / segLen };
      }
      if (!u) {
        u = { x: -v.y, y: v.x };
      }

      // 2. Ký hiệu góc vuông chuẩn SGK tại trung điểm M
      const s = 12;
      context.beginPath();
      context.moveTo(M.x + u.x * s, M.y + u.y * s);
      context.lineTo(M.x + u.x * s + v.x * s, M.y + u.y * s + v.y * s);
      context.lineTo(M.x + v.x * s, M.y + v.y * s);
      context.stroke();

      // 3. Ký hiệu đoạn thẳng bằng nhau (2 gạch đôi) trên 2 nửa đoạn thẳng AM và MB
      if (geo.segStart && geo.segEnd) {
        const A = geo.segStart;
        const B = geo.segEnd;
        const M1 = { x: (A.x + M.x) / 2, y: (A.y + M.y) / 2 };
        const M2 = { x: (M.x + B.x) / 2, y: (M.y + B.y) / 2 };
        const tickLen = 5.5;
        const tickSpacing = 2.4;

        // Vẽ 2 vạch song song trên nửa AM
        context.beginPath();
        context.moveTo(M1.x - v.x * tickLen - u.x * tickSpacing, M1.y - v.y * tickLen - u.y * tickSpacing);
        context.lineTo(M1.x + v.x * tickLen - u.x * tickSpacing, M1.y + v.y * tickLen - u.y * tickSpacing);
        context.moveTo(M1.x - v.x * tickLen + u.x * tickSpacing, M1.y - v.y * tickLen + u.y * tickSpacing);
        context.lineTo(M1.x + v.x * tickLen + u.x * tickSpacing, M1.y + v.y * tickLen + u.y * tickSpacing);
        context.stroke();

        // Vẽ 2 vạch song song trên nửa MB
        context.beginPath();
        context.moveTo(M2.x - v.x * tickLen - u.x * tickSpacing, M2.y - v.y * tickLen - u.y * tickSpacing);
        context.lineTo(M2.x + v.x * tickLen - u.x * tickSpacing, M2.y + v.y * tickLen - u.y * tickSpacing);
        context.moveTo(M2.x - v.x * tickLen + u.x * tickSpacing, M2.y - v.y * tickLen + u.y * tickSpacing);
        context.lineTo(M2.x + v.x * tickLen + u.x * tickSpacing, M2.y + v.y * tickLen + u.y * tickSpacing);
        context.stroke();
      }

      // 4. Chấm điểm trung điểm M tròn nhỏ thanh lịch
      context.beginPath();
      context.arc(M.x, M.y, 2.5, 0, Math.PI * 2);
      context.fillStyle = geo.color || state.color;
      context.fill();
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

    // Vẽ nhãn tên tùy chỉnh cho các đỉnh, điểm đặc biệt và các cạnh / đường thẳng 2D (nếu người dùng đã đặt tên)
    const labelColor = geo.color || state.color || '#184e3a';
    if (geo.points && geo.points.length >= 3) {
      let cx = 0, cy = 0;
      const n = geo.points.length;
      for (let i = 0; i < n; i++) {
        cx += geo.points[i].x;
        cy += geo.points[i].y;
      }
      cx /= n;
      cy /= n;

      for (let i = 0; i < n; i++) {
        const p = geo.points[i];
        if (p && p.name) {
          let offX = p.offX, offY = p.offY;
          if (offX === undefined || offY === undefined) {
            const dx = p.x - cx, dy = p.y - cy;
            const d = Math.hypot(dx, dy) || 1;
            offX = (dx / d) * 14 - 4;
            offY = (dy / d) * 14 + 4;
          }
          drawMathLabel(context, p.name, p.x + offX, p.y + offY, labelColor, false);
        }
      }

      if (geo.edgeNames) {
        for (let i = 0; i < n; i++) {
          const eName = geo.edgeNames[i] || geo.edgeNames['edge_' + i];
          if (eName) {
            const p1 = geo.points[i];
            const p2 = geo.points[(i + 1) % n];
            const mx = (p1.x + p2.x) / 2;
            const my = (p1.y + p2.y) / 2;
            const dx = mx - cx, dy = my - cy;
            const d = Math.hypot(dx, dy) || 1;
            const eColor = (geo.edgeColors && geo.edgeColors[i]) ? geo.edgeColors[i] : labelColor;
            drawMathLabel(context, eName, mx + (dx / d) * 14 - 4, my + (dy / d) * 14 + 4, eColor, true);
          }
        }
      }
    } else if (shape === 'inscribed-triangle' && start && end) {
      const r = Math.hypot(end.x - start.x, end.y - start.y);
      const angles = geo.angles || [-Math.PI / 2, (5 * Math.PI) / 6, Math.PI / 6];
      const vPts = angles.map(a => ({ x: start.x + r * Math.cos(a), y: start.y + r * Math.sin(a), a }));
      if (geo.vertexNames) {
        for (let i = 0; i < 3; i++) {
          const vName = geo.vertexNames[i];
          if (vName && vPts[i]) {
            const lx = start.x + (r + 15) * Math.cos(vPts[i].a) - 4;
            const ly = start.y + (r + 15) * Math.sin(vPts[i].a) + 4;
            drawMathLabel(context, vName, lx, ly, labelColor, false);
          }
        }
      }
      if (geo.edgeNames) {
        for (let i = 0; i < 3; i++) {
          const eName = geo.edgeNames[i] || geo.edgeNames['inscribed_' + i];
          if (eName) {
            const p1 = vPts[i], p2 = vPts[(i + 1) % 3];
            const mx = (p1.x + p2.x) / 2;
            const my = (p1.y + p2.y) / 2;
            const dx = mx - start.x, dy = my - start.y;
            const d = Math.hypot(dx, dy) || 1;
            const eColor = (geo.edgeColors && geo.edgeColors[i]) ? geo.edgeColors[i] : labelColor;
            drawMathLabel(context, eName, mx + (dx / d) * 13 - 4, my + (dy / d) * 13 + 4, eColor, true);
          }
        }
      }
      if (geo.centerName) {
        drawMathLabel(context, geo.centerName, start.x + 8, start.y - 8, labelColor, false);
      }
    } else if (
      shape === 'line' ||
      shape === 'perpendicular' ||
      shape === 'parallel' ||
      shape === 'bisector' ||
      shape === 'tangent' ||
      shape === 'perpendicular-bisector'
    ) {
      if (geo.name && start && end) {
        const t = 0.56;
        const mx = start.x + (end.x - start.x) * t;
        const my = start.y + (end.y - start.y) * t;
        const dx = end.x - start.x, dy = end.y - start.y;
        const len = Math.hypot(dx, dy) || 1;
        let nx = -dy / len, ny = dx / len;
        if (ny > 0) { nx = -nx; ny = -ny; }
        drawMathLabel(context, geo.name, mx + nx * 13 - 3, my + ny * 13 + 4, labelColor, true);
      }
      if (geo.startName && start) {
        drawMathLabel(context, geo.startName, start.x + 8, start.y - 8, labelColor, false);
      }
      if (geo.endName && end) {
        drawMathLabel(context, geo.endName, end.x + 8, end.y - 8, labelColor, false);
      }
      if (geo.foot && geo.footName) {
        drawMathLabel(context, geo.footName, geo.foot.x + 8, geo.foot.y - 8, labelColor, false);
      }
      if (geo.midpoint && geo.midpointName) {
        drawMathLabel(context, geo.midpointName, geo.midpoint.x + 8, geo.midpoint.y - 8, labelColor, false);
      }
      if (geo.tangentPoint && geo.tangentPointName) {
        drawMathLabel(context, geo.tangentPointName, geo.tangentPoint.x + 8, geo.tangentPoint.y - 8, labelColor, false);
      }
    } else if (shape === 'circle' || shape === 'ellipse' || shape === 'two-tangents') {
      if (geo.centerName && start) {
        drawMathLabel(context, geo.centerName, start.x + 8, start.y - 8, labelColor, false);
      }
      if (geo.endName && end) {
        drawMathLabel(context, geo.endName, end.x + 8, end.y - 8, labelColor, false);
      }
      if (geo.name && start && end) {
        const r = geo.radius || Math.hypot(end.x - start.x, end.y - start.y);
        drawMathLabel(context, geo.name, start.x + r * 0.72 + 8, start.y - r * 0.72 - 6, labelColor, true);
      }
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

      if (el.shape === 'line' || el.shape === 'perpendicular' || el.shape === 'parallel' || el.shape === 'tangent' || el.shape === 'bisector' || el.shape === 'perpendicular-bisector') {
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

  // Tìm đỉnh hoặc điểm đã có gần (x, y) nhất (ưu tiên Điểm rời, Tâm O, Tiếp điểm T, Đỉnh hình trước Đầu mút đoạn thẳng)
  function findPointAt(x, y, maxDist = 18) {
    const list = state.pages[state.currentPage] || [];
    let best = null;
    let bestScore = Infinity;

    function checkPt(pt, name, el, extra = {}, priority = 1) {
      if (!pt) return;
      const d = Math.hypot(x - pt.x, y - pt.y);
      if (d < maxDist) {
        // Ưu tiên: priority = 0 (Điểm rời, Tâm O, Tiếp điểm T, Đỉnh đa giác, Chân vuông góc, Trung điểm) > priority = 1 (Đầu mút đoạn thẳng)
        const score = d + priority * 6;
        if (score < bestScore) {
          bestScore = score;
          best = { x: pt.x, y: pt.y, name: name, element: el, ...extra };
        }
      }
    }

    for (let i = list.length - 1; i >= 0; i--) {
      const el = list[i];
      if (el.type !== 'geo') continue;

      if (el.shape === 'circle' || el.shape === 'inscribed-triangle' || el.shape === 'two-tangents' || el.shape === 'ellipse') {
        checkPt(el.start, 'Tâm O', el, { pointKey: 'start' }, 0);
      }
      if (el.shape === 'point') {
        checkPt(el.start, el.name ? `Điểm ${el.name}` : 'Điểm', el, { pointKey: 'start' }, 0);
      }
      if (el.tangentPoint) {
        checkPt(el.tangentPoint, 'Tiếp điểm T', el, { pointKey: 'tangentPoint' }, 0);
      }
      if (el.tangentPoint1) {
        checkPt(el.tangentPoint1, 'Tiếp điểm T1', el, { pointKey: 'tangentPoint1' }, 0);
      }
      if (el.tangentPoint2) {
        checkPt(el.tangentPoint2, 'Tiếp điểm T2', el, { pointKey: 'tangentPoint2' }, 0);
      }
      if (el.foot) {
        checkPt(el.foot, 'Chân vuông góc H', el, { pointKey: 'foot' }, 0);
      }
      if (el.midpoint) {
        checkPt(el.midpoint, 'Trung điểm M', el, { pointKey: 'midpoint' }, 0);
      }
      if (el.points) {
        el.points.forEach((p, idx) => checkPt(p, p.name ? `Đỉnh ${p.name}` : `Đỉnh ${idx + 1}`, el, { vIndex: idx }, 0));
      }
      if (el.start && el.shape !== 'circle' && el.shape !== 'ellipse' && el.shape !== 'point' && el.shape !== 'inscribed-triangle' && el.shape !== 'two-tangents') {
        checkPt(el.start, 'Điểm đầu', el, { pointKey: 'start' }, 1);
      }
      if (el.end && el.shape !== 'circle' && el.shape !== 'ellipse' && el.shape !== 'point' && el.shape !== 'inscribed-triangle') {
        checkPt(el.end, el.shape === 'two-tangents' ? 'Điểm giao tiếp tuyến' : 'Điểm cuối', el, { pointKey: 'end' }, el.shape === 'two-tangents' ? 0 : 1);
      }
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
    state.hoverIntersectionElements = null;
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

    // 5. Nếu có đối tượng vừa tạo, chỉ chọn đơn lẻ đối tượng đó để giao diện gọn gàng, không bị nhiều khung chữ nhật
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
        pointVertexIndex: (point && (point.vertexIndex !== undefined || point.vIndex !== undefined)) ? (point.vertexIndex !== undefined ? point.vertexIndex : point.vIndex) : undefined,
        pointKey: (point && point.pointKey) ? point.pointKey : undefined,
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
    const p1_1 = { x: px, y: py };
    const p2_1 = { x: T1.x + 45 * uTan1.x, y: T1.y + 45 * uTan1.y };

    // Nhánh 1: ang + beta
    const T2 = { x: O.x + R * Math.cos(ang + beta), y: O.y + R * Math.sin(ang + beta) };
    const vx2 = T2.x - px, vy2 = T2.y - py;
    const len2 = Math.hypot(vx2, vy2) || 1;
    const uTan2 = { x: vx2 / len2, y: vy2 / len2 };
    const p1_2 = { x: px, y: py };
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
        pointVertexIndex: (point && (point.vertexIndex !== undefined || point.vIndex !== undefined)) ? (point.vertexIndex !== undefined ? point.vertexIndex : point.vIndex) : undefined,
        pointKey: (point && point.pointKey) ? point.pointKey : undefined,
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

    const effD = Math.max(R + 1, d);
    const angle = Math.atan2(py - O.y, px - O.x);
    const beta = Math.acos(Math.max(-1, Math.min(1, R / effD)));
    const t1 = {
      x: O.x + R * Math.cos(angle - beta),
      y: O.y + R * Math.sin(angle - beta)
    };
    const t2 = {
      x: O.x + R * Math.cos(angle + beta),
      y: O.y + R * Math.sin(angle + beta)
    };

    const newGeo = {
      type: 'geo',
      shape: 'two-tangents',
      binding: circleEl ? {
        type: 'two_tangents',
        parentId: circleEl.id,
        pointElId: ptEl ? ptEl.id : null,
        pointVertexIndex: (point && (point.vertexIndex !== undefined || point.vIndex !== undefined)) ? (point.vertexIndex !== undefined ? point.vertexIndex : point.vIndex) : undefined,
        pointKey: (point && point.pointKey) ? point.pointKey : undefined
      } : null,
      start: { x: O.x, y: O.y },
      end: { x: px, y: py },
      tangentPoint1: t1,
      tangentPoint2: t2,
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

  // Tìm giao điểm gần nhất giữa 2 đường thẳng hoặc giữa đường thẳng và đường tròn quanh tọa độ point
  function findIntersectionSnapAtPoint(point, maxDist = 24) {
    if (!point) return null;
    const list = state.pages[state.currentPage] || [];
    if (!list || list.length < 2) return null;

    const lines = [];
    const circles = [];

    for (let i = 0; i < list.length; i++) {
      const el = list[i];
      if (!el || el.type !== 'geo') continue;

      if (el.shape === 'line' || el.shape === 'perpendicular' || el.shape === 'parallel' || el.shape === 'tangent' || el.shape === 'bisector' || el.shape === 'perpendicular-bisector' || el.shape === 'arrow') {
        if (el.start && el.end) {
          lines.push({
            element: el,
            start: el.start,
            end: el.end,
            edgeId: 'main'
          });
        }
      } else if (isSolidShape(el.shape) && el.edges && el.points) {
        el.edges.forEach((edge, eIdx) => {
          const v1 = edge[0];
          const v2 = edge[1];
          if (el.points[v1] && el.points[v2]) {
            lines.push({
              element: el,
              start: el.points[v1],
              end: el.points[v2],
              edgeId: `solid_${eIdx}`,
              v1Index: v1,
              v2Index: v2,
              isSolidEdge: true
            });
          }
        });
      } else if (el.points && el.points.length >= 3) {
        const n = el.points.length;
        for (let j = 0; j < n; j++) {
          lines.push({
            element: el,
            start: el.points[j],
            end: el.points[(j + 1) % n],
            edgeId: `edge_${j}`,
            v1Index: j,
            v2Index: (j + 1) % n,
            isPolygonEdge: true
          });
        }
      }

      if (el.shape === 'circle' || el.shape === 'inscribed-triangle' || el.shape === 'two-tangents') {
        if (el.start) {
          const r = el.radius || (el.end ? Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y) : 0);
          if (r > 0) {
            circles.push({
              element: el,
              center: el.start,
              radius: r
            });
          }
        }
      }
    }

    let bestSnap = null;
    let minDist = maxDist;

    // 1. Cặp Line - Line
    for (let i = 0; i < lines.length; i++) {
      for (let j = i + 1; j < lines.length; j++) {
        const l1 = lines[i];
        const l2 = lines[j];

        if (l1.element === l2.element) {
          if (l1.isPolygonEdge && (l1.v1Index === l2.v2Index || l1.v2Index === l2.v1Index)) {
            continue;
          }
          if (l1.isSolidEdge && areSolidEdgesSkew(l1.element, l1.v1Index, l1.v2Index, l2.v1Index, l2.v2Index)) {
            continue;
          }
        }

        const pt = findLineLineIntersection(l1.start, l1.end, l2.start, l2.end);
        if (!pt) continue;

        const dMouse = Math.hypot(point.x - pt.x, point.y - pt.y);
        if (dMouse < minDist) {
          const dSeg1 = distToSegment(pt.x, pt.y, l1.start.x, l1.start.y, l1.end.x, l1.end.y);
          const dSeg2 = distToSegment(pt.x, pt.y, l2.start.x, l2.start.y, l2.end.x, l2.end.y);
          if (dSeg1 < 250 && dSeg2 < 250) {
            minDist = dMouse;
            bestSnap = {
              x: pt.x,
              y: pt.y,
              type: 'line-line',
              elementA: l1.element,
              elementB: l2.element,
              v1IndexA: l1.v1Index,
              v2IndexA: l1.v2Index,
              v1IndexB: l2.v1Index,
              v2IndexB: l2.v2Index,
              ptIndex: 0,
              label: 'Giao điểm'
            };
          }
        }
      }
    }

    // 2. Cặp Line - Circle
    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < circles.length; j++) {
        const line = lines[i];
        const circ = circles[j];
        if (line.element === circ.element) continue;

        const pts = findLineCircleIntersection(line.start, line.end, circ.center, circ.radius);
        if (!pts || pts.length === 0) continue;

        for (let pIdx = 0; pIdx < pts.length; pIdx++) {
          const pt = pts[pIdx];
          const dMouse = Math.hypot(point.x - pt.x, point.y - pt.y);
          if (dMouse < minDist) {
            const dSeg = distToSegment(pt.x, pt.y, line.start.x, line.start.y, line.end.x, line.end.y);
            if (dSeg < 150) {
              minDist = dMouse;
              bestSnap = {
                x: pt.x,
                y: pt.y,
                type: 'line-circle',
                elementA: line.element,
                elementB: circ.element,
                v1IndexA: line.v1Index,
                v2IndexA: line.v2Index,
                ptIndex: pIdx,
                label: 'Giao điểm'
              };
            }
          }
        }
      }
    }

    // 3. Cặp Circle - Circle
    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const c1 = circles[i];
        const c2 = circles[j];
        if (c1.element === c2.element) continue;

        const pts = findCircleCircleIntersection(c1.center, c1.radius, c2.center, c2.radius);
        if (!pts || pts.length === 0) continue;

        for (let pIdx = 0; pIdx < pts.length; pIdx++) {
          const pt = pts[pIdx];
          const dMouse = Math.hypot(point.x - pt.x, point.y - pt.y);
          if (dMouse < minDist) {
            minDist = dMouse;
            bestSnap = {
              x: pt.x,
              y: pt.y,
              type: 'circle-circle',
              elementA: c1.element,
              elementB: c2.element,
              ptIndex: pIdx,
              label: 'Giao điểm'
            };
          }
        }
      }
    }

    return bestSnap;
  }

  // Trích xuất hình học (line hoặc circle) từ đối tượng được nhấp chọn
  function extractGeoGeometry(obj) {
    if (!obj) return null;
    if (obj.center && obj.radius) {
      return { type: 'circle', center: obj.center, radius: obj.radius, element: obj.element || obj };
    }
    const circ = getCircleFromElement(obj);
    if (circ) return { type: 'circle', center: circ.center, radius: circ.radius, element: circ.element || obj };
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
    if (el.shape === 'pyramid-regular' || el.shape === 'pyramid-quad' || el.shape === 'pyramid-parallelogram' || el.shape === 'pyramid-trapezoid' || el.shape === 'pyramid-sa-parallelogram' || el.shape === 'pyramid-sa-trapezoid' || el.shape === 'pyramid-sa-quad') {
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
    pts.forEach((pt, ptIdx) => {
      const newPoint = {
        type: 'geo',
        shape: 'point',
        start: { x: pt.x, y: pt.y },
        end: { x: pt.x, y: pt.y },
        color: state.color || '#184e3a',
        width: Math.max(state.strokeWidth || 3, 3),
        binding: {
          type: 'intersection',
          objAId: gA.element ? gA.element.id : null,
          objBId: gB.element ? gB.element.id : null,
          ptIndex: ptIdx
        }
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
    const parent = parentEl || (edge ? (edge.element || (edge.shape || edge.id ? edge : null)) : null);
    const ptEl = (point && point.element) ? point.element : (point && (point.shape === 'point' || point.id) ? point : null);
    if (parent) ensureElementId(parent);
    if (ptEl) ensureElementId(ptEl);
    const px = (point.x !== undefined) ? point.x : (point.start ? point.start.x : 0);
    const py = (point.y !== undefined) ? point.y : (point.start ? point.start.y : 0);

    let finalPtEl = ptEl;
    if (!finalPtEl) {
      finalPtEl = {
        type: 'geo',
        shape: 'point',
        start: { x: px, y: py },
        end: { x: px, y: py },
        color: state.color || '#28634e',
        width: 3
      };
      ensureElementId(finalPtEl);
      pushNewElement(finalPtEl);
    }

    const A = edge.start || (edge.points && edge.v1Index !== undefined ? edge.points[edge.v1Index] : { x: 0, y: 0 });
    const B = edge.end || (edge.points && edge.v2Index !== undefined ? edge.points[edge.v2Index] : { x: 100, y: 0 });
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
        pointElId: finalPtEl ? finalPtEl.id : null,
        pointVertexIndex: (point && (point.vertexIndex !== undefined || point.vIndex !== undefined)) ? (point.vertexIndex !== undefined ? point.vertexIndex : point.vIndex) : undefined,
        pointKey: (point && point.pointKey) ? point.pointKey : undefined,
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
    const parentsToLink = [parent, finalPtEl].filter(Boolean);
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
    const parent = parentEl || (edge ? (edge.element || (edge.shape || edge.id ? edge : null)) : null);
    const ptEl = (point && point.element) ? point.element : (point && (point.shape === 'point' || point.id) ? point : null);
    if (parent) ensureElementId(parent);
    if (ptEl) ensureElementId(ptEl);
    const px = (point.x !== undefined) ? point.x : (point.start ? point.start.x : 0);
    const py = (point.y !== undefined) ? point.y : (point.start ? point.start.y : 0);

    let finalPtEl = ptEl;
    if (!finalPtEl) {
      finalPtEl = {
        type: 'geo',
        shape: 'point',
        start: { x: px, y: py },
        end: { x: px, y: py },
        color: state.color || '#28634e',
        width: 3
      };
      ensureElementId(finalPtEl);
      pushNewElement(finalPtEl);
    }

    const A = edge.start || (edge.points && edge.v1Index !== undefined ? edge.points[edge.v1Index] : { x: 0, y: 0 });
    const B = edge.end || (edge.points && edge.v2Index !== undefined ? edge.points[edge.v2Index] : { x: 100, y: 0 });
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
        pointElId: finalPtEl ? finalPtEl.id : null,
        pointVertexIndex: (point && (point.vertexIndex !== undefined || point.vIndex !== undefined)) ? (point.vertexIndex !== undefined ? point.vertexIndex : point.vIndex) : undefined,
        pointKey: (point && point.pointKey) ? point.pointKey : undefined,
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
    const parentsToLink = [parent, finalPtEl].filter(Boolean);
    if (parentsToLink.length > 0) {
      linkGroupMulti(parentsToLink, newGeo);
    }
    pushNewElement(newGeo);
    finishGeoTask(newGeo);
    statusToolInfo.textContent = '✨ Đã dựng đường song song (tự động gắn kết thành 1 nhóm với hình). Kéo 2 chấm đầu mút để thu hẹp hoặc mở rộng độ dài.';
    return newGeo;
  }

  // Dựng đường trung trực của đoạn thẳng (hoặc 2 điểm)
  function constructPerpendicularBisector(ptA, ptB, bindingInfo = null, parentEl = null) {
    const Ax = (ptA.x !== undefined) ? ptA.x : (ptA.start ? ptA.start.x : 0);
    const Ay = (ptA.y !== undefined) ? ptA.y : (ptA.start ? ptA.start.y : 0);
    const Bx = (ptB.x !== undefined) ? ptB.x : (ptB.start ? ptB.start.x : 0);
    const By = (ptB.y !== undefined) ? ptB.y : (ptB.start ? ptB.start.y : 0);

    const vx = Bx - Ax;
    const vy = By - Ay;
    const lenV = Math.hypot(vx, vy) || 1;
    const uBase = { x: vx / lenV, y: vy / lenV };
    const uNorm = { x: -uBase.y, y: uBase.x };

    const Mx = (Ax + Bx) / 2;
    const My = (Ay + By) / 2;
    const M = { x: Mx, y: My };

    // Chiều dài đường trung trực đối xứng 2 phía qua trung điểm M
    const halfL = Math.max(75, lenV * 0.65);
    const p1 = { x: Mx - halfL * uNorm.x, y: My - halfL * uNorm.y };
    const p2 = { x: Mx + halfL * uNorm.x, y: My + halfL * uNorm.y };

    if (!bindingInfo && parentEl && !Array.isArray(parentEl)) {
      ensureElementId(parentEl);
      bindingInfo = {
        type: 'perpendicular_bisector',
        parentId: parentEl.id
      };
    }

    const newGeo = {
      type: 'geo',
      shape: 'perpendicular-bisector',
      binding: bindingInfo,
      start: p1,
      end: p2,
      halfLength: halfL,
      midpoint: M,
      baseDir: uBase,
      normDir: uNorm,
      segStart: { x: Ax, y: Ay },
      segEnd: { x: Bx, y: By },
      color: state.color,
      width: state.strokeWidth,
      dash: state.dashStyle
    };

    ensureElementId(newGeo);

    if (parentEl) {
      if (Array.isArray(parentEl)) {
        linkGroupMulti(parentEl, newGeo);
      } else {
        linkGroup(parentEl, newGeo);
      }
    }

    pushNewElement(newGeo);
    finishGeoTask(newGeo);
    statusToolInfo.textContent = '✨ Đã dựng đường trung trực (vuông góc tại trung điểm kèm ký hiệu bằng nhau chuẩn SGK). Kéo 2 đầu mút để thu hẹp hoặc mở rộng.';
    showPageToast('✨ Đã dựng đường trung trực chuẩn SGK!');
    return newGeo;
  }

  function constructPerpendicularBisectorFromEdge(edge) {
    if (!edge) return null;
    const start = edge.start || edge.p1;
    const end = edge.end || edge.p2;
    if (!start || !end) return null;
    const parent = edge.element || edge.parentEl;
    if (parent) ensureElementId(parent);
    let bindingInfo = null;
    if (parent) {
      bindingInfo = {
        type: 'perpendicular_bisector',
        parentId: parent.id,
        v1Index: edge.v1Index,
        v2Index: edge.v2Index
      };
    }
    return constructPerpendicularBisector(start, end, bindingInfo, parent);
  }

  // Dựng đối xứng điểm: Điểm 3 là điểm đối xứng của Điểm 1 qua Điểm 2, nối đoạn thẳng qua 3 điểm
  function constructPointSymmetry(pt1, pt2, el1 = null, el2 = null) {
    if (!pt1 || !pt2) return null;
    const x3 = 2 * pt2.x - pt1.x;
    const y3 = 2 * pt2.y - pt1.y;

    const elementsToAdd = [];

    // 1. Đảm bảo Điểm 1 tồn tại trên trang
    let p1El = (el1 && el1.shape === 'point') ? el1 : null;
    if (!p1El) {
      p1El = {
        type: 'geo',
        shape: 'point',
        start: { x: pt1.x, y: pt1.y },
        end: { x: pt1.x, y: pt1.y },
        color: state.color,
        width: state.strokeWidth || 3,
        dash: 'solid'
      };
      ensureElementId(p1El);
      elementsToAdd.push(p1El);
    } else {
      ensureElementId(p1El);
    }

    // 2. Đảm bảo Điểm 2 tồn tại trên trang (tâm đối xứng)
    let p2El = (el2 && el2.shape === 'point') ? el2 : null;
    if (!p2El) {
      p2El = {
        type: 'geo',
        shape: 'point',
        start: { x: pt2.x, y: pt2.y },
        end: { x: pt2.x, y: pt2.y },
        color: state.color,
        width: state.strokeWidth || 3,
        dash: 'solid'
      };
      ensureElementId(p2El);
      elementsToAdd.push(p2El);
    } else {
      ensureElementId(p2El);
    }

    // 3. Tạo Điểm 3 là điểm đối xứng của Điểm 1 qua Điểm 2
    const p3El = {
      type: 'geo',
      shape: 'point',
      binding: {
        type: 'point_symmetry_pt3',
        pt1Id: p1El.id,
        pt2Id: p2El.id
      },
      start: { x: x3, y: y3 },
      end: { x: x3, y: y3 },
      color: state.color,
      width: state.strokeWidth || 3,
      dash: 'solid'
    };
    ensureElementId(p3El);
    elementsToAdd.push(p3El);

    // 4. Nối đoạn thẳng qua 3 điểm (từ Điểm 1 qua Điểm 2 đến Điểm 3)
    const lineEl = {
      type: 'geo',
      shape: 'line',
      isSymmetryLine: true,
      binding: {
        type: 'point_symmetry_line',
        pt1Id: p1El.id,
        pt2Id: p2El.id,
        pt3Id: p3El.id
      },
      midpoint: { x: pt2.x, y: pt2.y },
      start: { x: pt1.x, y: pt1.y },
      end: { x: x3, y: y3 },
      color: state.color,
      width: state.strokeWidth,
      dash: state.dashStyle || 'solid'
    };
    ensureElementId(lineEl);
    elementsToAdd.push(lineEl);

    // 5. Gắn kết toàn bộ thành 1 nhóm để dịch chuyển và biến đổi đồng bộ
    linkGroupMulti([p1El, p2El, p3El], lineEl);

    // 6. Đưa các phần tử mới vào trang và lưu lịch sử hoàn tác Undo
    if (!state.pages[state.currentPage]) state.pages[state.currentPage] = [];
    for (const el of elementsToAdd) {
      state.pages[state.currentPage].push(el);
    }
    pushCommand({
      type: 'add-multiple',
      elements: elementsToAdd
    });

    // 7. Chuyển sang công cụ Chọn và chọn Điểm 3 vừa tạo
    finishGeoTask(p3El);
    statusToolInfo.textContent = '✨ Đã tạo Điểm 3 đối xứng với Điểm 1 qua Điểm 2 và nối đoạn thẳng qua 3 điểm (chuẩn ký hiệu SGK).';
    showPageToast('✨ Đã dựng Đối xứng điểm & Nối đoạn thẳng qua 3 điểm!');
    return { p1: p1El, p2: p2El, p3: p3El, line: lineEl };
  }

  // Dựng đối xứng trục: Điểm đối xứng của một điểm qua một đường thẳng (trục đối xứng)
  function constructAxisSymmetry(point, edge, elPoint = null, elEdge = null) {
    if (!point || !edge) return null;

    const px = (point.x !== undefined) ? point.x : (point.start ? point.start.x : 0);
    const py = (point.y !== undefined) ? point.y : (point.start ? point.start.y : 0);

    const A = edge.start || (edge.points ? edge.points[0] : null);
    const B = edge.end || (edge.points ? edge.points[1] : null);
    if (!A || !B) return null;

    const vx = B.x - A.x;
    const vy = B.y - A.y;
    const len = Math.hypot(vx, vy) || 1;
    const ux = vx / len;
    const uy = vy / len;

    // Chiếu điểm P1 lên trục AB tìm chân đường vuông góc H
    const t = (px - A.x) * ux + (py - A.y) * uy;
    const H = { x: A.x + t * ux, y: A.y + t * uy };

    // Tọa độ điểm đối xứng P2 qua trục: P2 = 2H - P1
    const p2x = 2 * H.x - px;
    const p2y = 2 * H.y - py;

    const axisEl = elEdge || edge.element || null;
    const ptEl = elPoint || (point.element ? point.element : (point.shape === 'point' ? point : null));

    const elementsToAdd = [];

    // 1. Đảm bảo Điểm 1 tồn tại trên trang
    let p1El = (ptEl && ptEl.shape === 'point') ? ptEl : null;
    if (!p1El) {
      p1El = {
        type: 'geo',
        shape: 'point',
        start: { x: px, y: py },
        end: { x: px, y: py },
        color: state.color,
        width: state.strokeWidth || 3,
        dash: 'solid'
      };
      ensureElementId(p1El);
      elementsToAdd.push(p1El);
    } else {
      ensureElementId(p1El);
    }

    // 2. Tạo Điểm chân vuông góc H (trung điểm trên trục)
    const hEl = {
      type: 'geo',
      shape: 'point',
      isMidpoint: true,
      binding: {
        type: 'axis_symmetry_h',
        ptId: p1El.id,
        axisId: axisEl ? axisEl.id : null,
        v1Index: edge.v1Index,
        v2Index: edge.v2Index,
        axisStart: { x: A.x, y: A.y },
        axisEnd: { x: B.x, y: B.y }
      },
      start: { x: H.x, y: H.y },
      end: { x: H.x, y: H.y },
      color: state.color,
      width: state.strokeWidth || 3,
      dash: 'solid'
    };
    ensureElementId(hEl);
    elementsToAdd.push(hEl);

    // 3. Tạo Điểm 2 là điểm đối xứng của Điểm 1 qua trục
    const p2El = {
      type: 'geo',
      shape: 'point',
      binding: {
        type: 'axis_symmetry_point',
        ptId: p1El.id,
        axisId: axisEl ? axisEl.id : null,
        v1Index: edge.v1Index,
        v2Index: edge.v2Index,
        axisStart: { x: A.x, y: A.y },
        axisEnd: { x: B.x, y: B.y }
      },
      start: { x: p2x, y: p2y },
      end: { x: p2x, y: p2y },
      color: state.color,
      width: state.strokeWidth || 3,
      dash: 'solid'
    };
    ensureElementId(p2El);
    elementsToAdd.push(p2El);

    // 4. Đoạn thẳng vuông góc nối Điểm 1 và Điểm 2 (đi qua H)
    const lineEl = {
      type: 'geo',
      shape: 'line',
      isAxisSymmetryLine: true,
      binding: {
        type: 'axis_symmetry_line',
        ptId: p1El.id,
        axisId: axisEl ? axisEl.id : null,
        v1Index: edge.v1Index,
        v2Index: edge.v2Index,
        axisStart: { x: A.x, y: A.y },
        axisEnd: { x: B.x, y: B.y }
      },
      midpoint: { x: H.x, y: H.y },
      axisDir: { x: ux, y: uy },
      start: { x: px, y: py },
      end: { x: p2x, y: p2y },
      color: state.color,
      width: state.strokeWidth,
      dash: state.dashStyle || 'solid'
    };
    ensureElementId(lineEl);
    elementsToAdd.push(lineEl);

    // 5. Gắn kết toàn bộ thành 1 nhóm để dịch chuyển và biến đổi đồng bộ
    const groupParents = [p1El, axisEl, hEl, p2El].filter(Boolean);
    linkGroupMulti(groupParents, lineEl);

    // 6. Đưa các phần tử mới vào trang và lưu lịch sử hoàn tác Undo
    if (!state.pages[state.currentPage]) state.pages[state.currentPage] = [];
    for (const el of elementsToAdd) {
      state.pages[state.currentPage].push(el);
    }
    pushCommand({
      type: 'add-multiple',
      elements: elementsToAdd
    });

    // 7. Chuyển sang công cụ Chọn và chọn Điểm đối xứng vừa tạo
    finishGeoTask(p2El);
    statusToolInfo.textContent = '✨ Đã tạo Điểm đối xứng qua trục và nối đoạn thẳng vuông góc (chuẩn ký hiệu SGK).';
    showPageToast('✨ Đã dựng Đối xứng trục & Nối đoạn thẳng vuông góc!');
    return { p1: p1El, p2: p2El, h: hEl, line: lineEl };
  }

  // Dựng Đường tròn ngoại tiếp (qua 3 điểm hoặc tam giác)
  function constructCircumcircle(p1, p2, p3, el1 = null, el2 = null, el3 = null, triangleEl = null) {
    if (!p1 || !p2 || !p3) return null;

    const x1 = (p1.x !== undefined) ? p1.x : (p1.start ? p1.start.x : 0);
    const y1 = (p1.y !== undefined) ? p1.y : (p1.start ? p1.start.y : 0);
    const x2 = (p2.x !== undefined) ? p2.x : (p2.start ? p2.start.x : 0);
    const y2 = (p2.y !== undefined) ? p2.y : (p2.start ? p2.start.y : 0);
    const x3 = (p3.x !== undefined) ? p3.x : (p3.start ? p3.start.x : 0);
    const y3 = (p3.y !== undefined) ? p3.y : (p3.start ? p3.start.y : 0);

    const D = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
    if (Math.abs(D) < 1e-4) {
      showPageToast('⚠️ 3 điểm thẳng hàng, không thể tạo đường tròn ngoại tiếp!');
      return null;
    }

    const sq1 = x1 * x1 + y1 * y1;
    const sq2 = x2 * x2 + y2 * y2;
    const sq3 = x3 * x3 + y3 * y3;

    const x0 = (sq1 * (y2 - y3) + sq2 * (y3 - y1) + sq3 * (y1 - y2)) / D;
    const y0 = (sq1 * (x3 - x2) + sq2 * (x1 - x3) + sq3 * (x2 - x1)) / D;
    const R = Math.hypot(x1 - x0, y1 - y0);

    const elementsToAdd = [];

    let ptEl1 = el1 || (p1.shape === 'point' ? p1 : (p1.element ? p1.element : null));
    let ptEl2 = el2 || (p2.shape === 'point' ? p2 : (p2.element ? p2.element : null));
    let ptEl3 = el3 || (p3.shape === 'point' ? p3 : (p3.element ? p3.element : null));

    if (!triangleEl) {
      if (!ptEl1) {
        ptEl1 = { type: 'geo', shape: 'point', start: { x: x1, y: y1 }, end: { x: x1, y: y1 }, color: state.color, width: state.strokeWidth || 3, dash: 'solid' };
        ensureElementId(ptEl1); elementsToAdd.push(ptEl1);
      } else { ensureElementId(ptEl1); }

      if (!ptEl2) {
        ptEl2 = { type: 'geo', shape: 'point', start: { x: x2, y: y2 }, end: { x: x2, y: y2 }, color: state.color, width: state.strokeWidth || 3, dash: 'solid' };
        ensureElementId(ptEl2); elementsToAdd.push(ptEl2);
      } else { ensureElementId(ptEl2); }

      if (!ptEl3) {
        ptEl3 = { type: 'geo', shape: 'point', start: { x: x3, y: y3 }, end: { x: x3, y: y3 }, color: state.color, width: state.strokeWidth || 3, dash: 'solid' };
        ensureElementId(ptEl3); elementsToAdd.push(ptEl3);
      } else { ensureElementId(ptEl3); }
    } else {
      ensureElementId(triangleEl);
    }

    const centerEl = {
      type: 'geo',
      shape: 'point',
      binding: {
        type: 'circumcircle_center',
        triangleId: triangleEl ? triangleEl.id : null,
        pt1Id: ptEl1 ? ptEl1.id : null,
        pt2Id: ptEl2 ? ptEl2.id : null,
        pt3Id: ptEl3 ? ptEl3.id : null
      },
      start: { x: x0, y: y0 },
      end: { x: x0, y: y0 },
      color: state.color,
      width: state.strokeWidth || 3,
      dash: 'solid'
    };
    ensureElementId(centerEl);
    elementsToAdd.push(centerEl);

    const circleEl = {
      type: 'geo',
      shape: 'circle',
      binding: {
        type: 'circumcircle',
        triangleId: triangleEl ? triangleEl.id : null,
        pt1Id: ptEl1 ? ptEl1.id : null,
        pt2Id: ptEl2 ? ptEl2.id : null,
        pt3Id: ptEl3 ? ptEl3.id : null
      },
      start: { x: x0, y: y0 },
      end: { x: x0 + R, y: y0 },
      radius: R,
      color: state.color,
      width: state.strokeWidth || 2.5,
      dash: state.dashStyle || 'solid'
    };
    ensureElementId(circleEl);
    elementsToAdd.push(circleEl);

    const groupParents = [triangleEl, ptEl1, ptEl2, ptEl3, centerEl].filter(Boolean);
    linkGroupMulti(groupParents, circleEl);

    if (!state.pages[state.currentPage]) state.pages[state.currentPage] = [];
    for (const el of elementsToAdd) {
      state.pages[state.currentPage].push(el);
    }
    pushCommand({
      type: 'add-multiple',
      elements: elementsToAdd
    });

    finishGeoTask(circleEl);
    statusToolInfo.textContent = '✨ Đã dựng Đường tròn ngoại tiếp đi qua 3 điểm (tâm O xác định chuẩn xác).';
    showPageToast('✨ Đã dựng Đường tròn ngoại tiếp!');
    return { center: centerEl, circle: circleEl, pt1: ptEl1, pt2: ptEl2, pt3: ptEl3 };
  }

  // Dựng Đường tròn nội tiếp tam giác
  function constructIncircle(p1, p2, p3, triangleEl = null, el1 = null, el2 = null, el3 = null) {
    if (!p1 || !p2 || !p3) return null;

    const x1 = (p1.x !== undefined) ? p1.x : (p1.start ? p1.start.x : 0);
    const y1 = (p1.y !== undefined) ? p1.y : (p1.start ? p1.start.y : 0);
    const x2 = (p2.x !== undefined) ? p2.x : (p2.start ? p2.start.x : 0);
    const y2 = (p2.y !== undefined) ? p2.y : (p2.start ? p2.start.y : 0);
    const x3 = (p3.x !== undefined) ? p3.x : (p3.start ? p3.start.x : 0);
    const y3 = (p3.y !== undefined) ? p3.y : (p3.start ? p3.start.y : 0);

    const a = Math.hypot(x3 - x2, y3 - y2);
    const b = Math.hypot(x1 - x3, y1 - y3);
    const c = Math.hypot(x2 - x1, y2 - y1);
    const peri = a + b + c;

    if (peri < 1e-4) return null;

    const xI = (a * x1 + b * x2 + c * x3) / peri;
    const yI = (a * y1 + b * y2 + c * y3) / peri;

    const S = 0.5 * Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
    if (S < 1e-4) {
      showPageToast('⚠️ 3 điểm thẳng hàng, không thể tạo đường tròn nội tiếp!');
      return null;
    }
    const pHalf = peri / 2;
    const r = S / pHalf;

    const elementsToAdd = [];

    let ptEl1 = el1 || (p1.shape === 'point' ? p1 : (p1.element ? p1.element : null));
    let ptEl2 = el2 || (p2.shape === 'point' ? p2 : (p2.element ? p2.element : null));
    let ptEl3 = el3 || (p3.shape === 'point' ? p3 : (p3.element ? p3.element : null));

    if (!triangleEl) {
      if (!ptEl1) {
        ptEl1 = { type: 'geo', shape: 'point', start: { x: x1, y: y1 }, end: { x: x1, y: y1 }, color: state.color, width: state.strokeWidth || 3, dash: 'solid' };
        ensureElementId(ptEl1); elementsToAdd.push(ptEl1);
      } else { ensureElementId(ptEl1); }

      if (!ptEl2) {
        ptEl2 = { type: 'geo', shape: 'point', start: { x: x2, y: y2 }, end: { x: x2, y: y2 }, color: state.color, width: state.strokeWidth || 3, dash: 'solid' };
        ensureElementId(ptEl2); elementsToAdd.push(ptEl2);
      } else { ensureElementId(ptEl2); }

      if (!ptEl3) {
        ptEl3 = { type: 'geo', shape: 'point', start: { x: x3, y: y3 }, end: { x: x3, y: y3 }, color: state.color, width: state.strokeWidth || 3, dash: 'solid' };
        ensureElementId(ptEl3); elementsToAdd.push(ptEl3);
      } else { ensureElementId(ptEl3); }

      // Tự động tạo tam giác nối 3 đỉnh để thấy rõ đường tròn tiếp xúc 3 cạnh
      const autoTriangle = {
        type: 'geo',
        shape: 'triangle',
        points: [{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }],
        start: { x: Math.min(x1, x2, x3), y: Math.min(y1, y2, y3) },
        end: { x: Math.max(x1, x2, x3), y: Math.max(y1, y2, y3) },
        color: state.color,
        width: state.strokeWidth || 2.5,
        dash: 'solid'
      };
      ensureElementId(autoTriangle);
      elementsToAdd.push(autoTriangle);
      triangleEl = autoTriangle;
    } else {
      ensureElementId(triangleEl);
    }

    const centerEl = {
      type: 'geo',
      shape: 'point',
      binding: {
        type: 'incircle_center',
        triangleId: triangleEl ? triangleEl.id : null,
        pt1Id: ptEl1 ? ptEl1.id : null,
        pt2Id: ptEl2 ? ptEl2.id : null,
        pt3Id: ptEl3 ? ptEl3.id : null
      },
      start: { x: xI, y: yI },
      end: { x: xI, y: yI },
      color: state.color,
      width: state.strokeWidth || 3,
      dash: 'solid'
    };
    ensureElementId(centerEl);
    elementsToAdd.push(centerEl);

    const circleEl = {
      type: 'geo',
      shape: 'circle',
      binding: {
        type: 'incircle',
        triangleId: triangleEl ? triangleEl.id : null,
        pt1Id: ptEl1 ? ptEl1.id : null,
        pt2Id: ptEl2 ? ptEl2.id : null,
        pt3Id: ptEl3 ? ptEl3.id : null
      },
      start: { x: xI, y: yI },
      end: { x: xI + r, y: yI },
      radius: r,
      color: state.color,
      width: state.strokeWidth || 2.5,
      dash: state.dashStyle || 'solid'
    };
    ensureElementId(circleEl);
    elementsToAdd.push(circleEl);

    const groupParents = [triangleEl, ptEl1, ptEl2, ptEl3, centerEl].filter(Boolean);
    linkGroupMulti(groupParents, circleEl);

    if (!state.pages[state.currentPage]) state.pages[state.currentPage] = [];
    for (const el of elementsToAdd) {
      state.pages[state.currentPage].push(el);
    }
    pushCommand({
      type: 'add-multiple',
      elements: elementsToAdd
    });

    finishGeoTask(circleEl);
    statusToolInfo.textContent = '✨ Đã dựng Đường tròn nội tiếp tiếp xúc 3 cạnh tam giác (tâm I xác định chuẩn xác).';
    showPageToast('✨ Đã dựng Đường tròn nội tiếp!');
    return { center: centerEl, circle: circleEl, pt1: ptEl1, pt2: ptEl2, pt3: ptEl3 };
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

    // Xác định xem V nằm ở điểm bắt đầu (v1Index) hay điểm kết thúc (v2Index) của cạnh
    let isVAtV1 = true;
    if (edge.points && edge.v1Index !== undefined && edge.v2Index !== undefined) {
      const pA = edge.points[edge.v1Index];
      const pB = edge.points[edge.v2Index];
      if (pA && pB) {
        isVAtV1 = (Math.hypot(pA.x - V.x, pA.y - V.y) <= Math.hypot(pB.x - V.x, pB.y - V.y));
      }
    } else if (edge.start && edge.end) {
      isVAtV1 = (Math.hypot(edge.start.x - V.x, edge.start.y - V.y) <= Math.hypot(edge.end.x - V.x, edge.end.y - V.y));
    }

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
        isVAtV1: isVAtV1,
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
    if (el.shape === 'line' || el.shape === 'perpendicular' || el.shape === 'parallel' || el.shape === 'tangent' || el.shape === 'bisector' || el.shape === 'perpendicular-bisector') {
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

    // Trường hợp 0: Người dùng đã chọn từ 3 đối tượng trở lên
    if (selectedList.length >= 3) {
      if (geoShape === 'circumcircle' || geoShape === 'incircle') {
        const ptA = getPointFromElement(selectedList[0]);
        const ptB = getPointFromElement(selectedList[1]);
        const ptC = getPointFromElement(selectedList[2]);
        if (ptA && ptB && ptC) {
          if (geoShape === 'circumcircle') {
            constructCircumcircle(ptA, ptB, ptC, selectedList[0], selectedList[1], selectedList[2]);
          } else {
            constructIncircle(ptA, ptB, ptC, null, selectedList[0], selectedList[1], selectedList[2]);
          }
          return true;
        }
      }
    }

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
      } else if (geoShape === 'perpendicular-bisector') {
        const ptA = getPointFromElement(elA) || (elA.shape === 'point' ? elA.start : null) || elA.start;
        const ptB = getPointFromElement(elB) || (elB.shape === 'point' ? elB.start : null) || elB.start;
        if (ptA && ptB) {
          ensureElementId(elA);
          ensureElementId(elB);
          let bindingInfo = null;
          let parentEl = [elA, elB];
          if (elA.shape === 'point' && elB.shape === 'point') {
            bindingInfo = { type: 'perpendicular_bisector', ptAId: elA.id, ptBId: elB.id };
          }
          constructPerpendicularBisector(ptA, ptB, bindingInfo, parentEl);
          return true;
        }
      } else if (geoShape === 'point-symmetry') {
        const ptA = getPointFromElement(elA) || (elA.shape === 'point' ? elA.start : null) || elA.start;
        const ptB = getPointFromElement(elB) || (elB.shape === 'point' ? elB.start : null) || elB.start;
        if (ptA && ptB) {
          constructPointSymmetry(ptA, ptB, elA, elB);
          return true;
        }
      } else if (geoShape === 'axis-symmetry') {
        const ptA = getPointFromElement(elA) || (elA.shape === 'point' ? elA.start : null);
        const ptB = getPointFromElement(elB) || (elB.shape === 'point' ? elB.start : null);
        const lineA = getLineOrEdgeFromElement(elA, ptB);
        const lineB = getLineOrEdgeFromElement(elB, ptA);
        let point = null;
        let line = null;
        let elPoint = null;
        let elEdge = null;
        if (ptA && lineB) {
          point = ptA;
          line = lineB;
          elPoint = elA;
          elEdge = elB;
        } else if (ptB && lineA) {
          point = ptB;
          line = lineA;
          elPoint = elB;
          elEdge = elA;
        }
        if (point && line) {
          constructAxisSymmetry(point, line, elPoint, elEdge);
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
      } else if (geoShape === 'circumcircle' || geoShape === 'incircle') {
        const ptA = getPointFromElement(elA);
        const ptB = getPointFromElement(elB);
        if (ptA && ptB) {
          state.construction = { p1: ptA, p2: ptB, el1: elA, el2: elB, points: [ptA, ptB] };
          const toolName = geoShape === 'circumcircle' ? 'ngoại tiếp' : 'nội tiếp';
          statusToolInfo.textContent = `Đường tròn ${toolName}: Đã nhận 2 điểm. Hãy bấm chọn tiếp Điểm thứ 3 trên bảng vẽ.`;
          showPageToast(`✓ Đã nhận 2 điểm. Bấm chọn tiếp Điểm 3!`);
          renderPage();
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

      if (geoShape === 'perpendicular-bisector') {
        if (el.shape === 'line' || el.shape === 'perpendicular' || el.shape === 'parallel') {
          ensureElementId(el);
          constructPerpendicularBisector(el.start, el.end, { type: 'perpendicular_bisector', parentId: el.id }, el);
          return true;
        }
        if (el.points && el.points.length >= 2) {
          ensureElementId(el);
          constructPerpendicularBisector(el.points[0], el.points[1], {
            type: 'perpendicular_bisector',
            parentId: el.id,
            v1Index: 0,
            v2Index: 1
          }, el);
          return true;
        }
        if (line) {
          constructPerpendicularBisectorFromEdge(line);
          return true;
        }
        if (pt) {
          state.construction = { point: pt, circle: null, line: null, edges: [], point1El: el };
          statusToolInfo.textContent = 'Đường trung trực: Đã nhận 1 điểm. Hãy bấm chọn tiếp điểm thứ 2 (hoặc đoạn thẳng) trên bảng vẽ.';
          renderPage();
          return true;
        }
      }

      if (geoShape === 'point-symmetry') {
        if (pt) {
          state.construction = { point: pt, circle: null, line: null, edges: [], point1El: el };
          statusToolInfo.textContent = '✓ Đã nhận Điểm 1. Bấm chọn tiếp Điểm 2 (tâm đối xứng) để tạo điểm đối xứng.';
          showPageToast('✓ Đã nhận Điểm 1. Bấm chọn tiếp Điểm 2 (tâm đối xứng)!');
          renderPage();
          return true;
        }
      }

      if (geoShape === 'axis-symmetry') {
        if (pt) {
          state.construction = { point: pt, circle: null, line: null, edges: [], point1El: el };
          statusToolInfo.textContent = '✓ Đã nhận Điểm 1. Bấm chọn tiếp Trục đối xứng (đoạn thẳng / cạnh) để tạo điểm đối xứng.';
          showPageToast('✓ Đã nhận Điểm 1. Bấm chọn tiếp Trục đối xứng!');
          renderPage();
          return true;
        } else if (line) {
          state.construction = { point: null, circle: null, line: line, edges: [], lineEl: el };
          statusToolInfo.textContent = '✓ Đã nhận Trục đối xứng. Bấm chọn tiếp Điểm cần lấy đối xứng.';
          showPageToast('✓ Đã nhận Trục đối xứng. Bấm chọn tiếp Điểm!');
          renderPage();
          return true;
        }
      }

      if (geoShape === 'circumcircle' || geoShape === 'incircle') {
        if (el.shape === 'triangle' || el.shape === 'right-triangle' || el.shape === 'isosceles-triangle' || (el.points && el.points.length === 3)) {
          const pts = (el.points && el.points.length >= 3) ? el.points : [
            { x: (el.start.x + el.end.x) / 2, y: el.start.y },
            { x: el.start.x, y: el.end.y },
            { x: el.end.x, y: el.end.y }
          ];
          if (geoShape === 'circumcircle') {
            constructCircumcircle(pts[0], pts[1], pts[2], null, null, null, el);
          } else {
            constructIncircle(pts[0], pts[1], pts[2], el);
          }
          return true;
        }
        if (pt) {
          state.construction = { p1: pt, el1: el, points: [pt] };
          const toolName = geoShape === 'circumcircle' ? 'ngoại tiếp' : 'nội tiếp';
          statusToolInfo.textContent = `Đường tròn ${toolName}: Đã nhận Điểm 1. Hãy bấm chọn tiếp Điểm thứ 2.`;
          showPageToast(`✓ Đã nhận Điểm 1. Bấm chọn tiếp Điểm 2!`);
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
      hitPoint = { x: directPointEl.start.x, y: directPointEl.start.y, element: directPointEl, pointKey: 'start' };
    }
    if (!hitPoint) {
      const v = findPointAt(point.x, point.y, 26);
      if (v) {
        hitPoint = {
          x: v.x,
          y: v.y,
          element: v.element,
          vertexIndex: (v.vIndex !== undefined ? v.vIndex : v.vertexIndex),
          vIndex: (v.vIndex !== undefined ? v.vIndex : v.vertexIndex),
          pointKey: v.pointKey
        };
      }
    }
    if (!hitPoint) {
      const h = findHandleAt(point.x, point.y, 28);
      if (h && h.handle) {
        const pKey = (h.handle.id === 'center' || h.handle.id === 'start' || h.handle.id === 'point') ? 'start' : (h.handle.id === 'end' || h.handle.id === 'ext_point' ? 'end' : undefined);
        hitPoint = { x: h.handle.x, y: h.handle.y, element: h.element, vertexIndex: h.handle.index, vIndex: h.handle.index, pointKey: pKey };
      }
    }

    // 2. Tìm Cạnh / Đoạn thẳng
    const hitEdge = findEdgeAt(point.x, point.y, 26);

    // 3. Tìm Đường tròn
    const hitCircle = findCircleAt(point.x, point.y, 26);

    // ==========================================================
    // TÁC VỤ: ĐƯỜNG TRUNG TRỰC (1 đoạn thẳng hoặc 2 điểm)
    // ==========================================================
    if (task === 'perpendicular-bisector') {
      // 1. NẾU ĐÃ CHỌN ĐIỂM 1 -> LẦN NHẤP TIẾP THEO BẮT BUỘC LÀ ĐIỂM 2!
      if (state.construction.point) {
        const pt1 = state.construction.point;
        const pt2 = hitPoint || { x: point.x, y: point.y };
        if (Math.hypot(pt2.x - pt1.x, pt2.y - pt1.y) < 6) return true;

        const el1 = state.construction.point1El;
        const el2 = hitPoint ? hitPoint.element : null;
        let bindingInfo = null;
        let parentEl = null;

        let idx1 = (pt1.vIndex !== undefined) ? pt1.vIndex : (pt1.vertexIndex !== undefined ? pt1.vertexIndex : -1);
        if (idx1 === -1 && el1 && el1.points) {
          for (let i = 0; i < el1.points.length; i++) {
            if (Math.hypot(el1.points[i].x - pt1.x, el1.points[i].y - pt1.y) < 16) { idx1 = i; break; }
          }
        }
        let idx2 = (pt2.vIndex !== undefined) ? pt2.vIndex : (pt2.vertexIndex !== undefined ? pt2.vertexIndex : -1);
        if (idx2 === -1 && el2 && el2.points) {
          for (let i = 0; i < el2.points.length; i++) {
            if (Math.hypot(el2.points[i].x - pt2.x, el2.points[i].y - pt2.y) < 16) { idx2 = i; break; }
          }
        }
        const keyA = pt1.pointKey;
        const keyB = pt2.pointKey;

        if (el1 && el2 && el1 === el2 && el1.points && idx1 !== -1 && idx2 !== -1) {
          ensureElementId(el1);
          bindingInfo = { type: 'perpendicular_bisector', parentId: el1.id, v1Index: idx1, v2Index: idx2 };
          parentEl = el1;
        } else if (el1 || el2) {
          if (el1) ensureElementId(el1);
          if (el2) ensureElementId(el2);
          bindingInfo = {
            type: 'perpendicular_bisector',
            ptAId: el1 ? el1.id : null,
            vAIndex: idx1 !== -1 ? idx1 : undefined,
            pointKeyA: keyA,
            ptBId: el2 ? el2.id : null,
            vBIndex: idx2 !== -1 ? idx2 : undefined,
            pointKeyB: keyB
          };
          parentEl = [el1, el2].filter(Boolean);
        }

        // Tự động nối đoạn thẳng nếu là 2 điểm chưa có đoạn thẳng nối trực tiếp
        let segLine = null;
        if (!el1 || !el2 || el1 !== el2 || keyA !== keyB) {
          segLine = {
            type: 'geo',
            shape: 'line',
            start: { x: pt1.x, y: pt1.y },
            end: { x: pt2.x, y: pt2.y },
            color: state.color,
            width: state.strokeWidth,
            dash: 'solid',
            startBinding: el1 ? { type: 'point', elementId: el1.id, vIndex: idx1 !== -1 ? idx1 : undefined, pointKey: keyA } : null,
            endBinding: el2 ? { type: 'point', elementId: el2.id, vIndex: idx2 !== -1 ? idx2 : undefined, pointKey: keyB } : null
          };
          ensureElementId(segLine);
          pushNewElement(segLine);

          const parentsToLink = [el1, el2].filter(Boolean);
          if (parentsToLink.length > 0) {
            linkGroupMulti(parentsToLink, segLine);
          }
        }

        const perpBisector = constructPerpendicularBisector(pt1, pt2, bindingInfo, parentEl);
        if (perpBisector && segLine) {
          linkGroup(segLine, perpBisector);
        }
        state.pendingConstruction = null;
        state.construction = { point: null, circle: null, line: null, edges: [] };
        state.constructionHoverPoint = null;
        return true;
      }

      // 2. CHƯA CHỌN ĐIỂM 1: Tiện ích nhấp trực tiếp vào cạnh hoặc đoạn thẳng
      if (hitEdge && (!hitPoint || hitPoint.element !== hitEdge.element)) {
        constructPerpendicularBisectorFromEdge(hitEdge);
        state.pendingConstruction = null;
        state.construction = { point: null, circle: null, line: null, edges: [] };
        state.constructionHoverPoint = null;
        return true;
      }

      const directEl = findElementAt(point.x, point.y);
      if (directEl && directEl.type === 'geo' && (directEl.shape === 'line' || directEl.shape === 'perpendicular' || directEl.shape === 'parallel' || directEl.shape === 'tangent') && !hitPoint) {
        ensureElementId(directEl);
        constructPerpendicularBisector(directEl.start, directEl.end, { type: 'perpendicular_bisector', parentId: directEl.id }, directEl);
        state.pendingConstruction = null;
        state.construction = { point: null, circle: null, line: null, edges: [] };
        state.constructionHoverPoint = null;
        return true;
      }

      // 3. CHỌN ĐIỂM 1 (BƯỚC 1 CỦA CHỌN 2 ĐIỂM)
      state.construction.point = hitPoint || { x: point.x, y: point.y };
      state.construction.point1El = hitPoint ? hitPoint.element : null;
      statusToolInfo.textContent = '✓ Đã chọn Điểm 1. Bấm chọn tiếp Điểm 2 để dựng đường trung trực.';
      showPageToast('✓ Đã nhận Điểm 1. Bấm chọn tiếp Điểm 2!');
      renderPage();
      return true;
    }

    // ==========================================================
    // TÁC VỤ: ĐỐI XỨNG ĐIỂM (Chọn Điểm 1 -> Chọn Điểm 2)
    // ==========================================================
    if (task === 'point-symmetry') {
      // 1. NẾU ĐÃ CHỌN ĐIỂM 1 -> LẦN NHẤP TIẾP THEO BẮT BUỘC LÀ ĐIỂM 2 (TÂM ĐỐI XỨNG)!
      if (state.construction.point) {
        const pt1 = state.construction.point;
        const pt2 = hitPoint || { x: point.x, y: point.y };
        if (Math.hypot(pt2.x - pt1.x, pt2.y - pt1.y) < 6) return true;

        const el1 = state.construction.point1El;
        const el2 = hitPoint ? hitPoint.element : null;

        constructPointSymmetry(pt1, pt2, el1, el2);
        state.pendingConstruction = null;
        state.construction = { point: null, circle: null, line: null, edges: [] };
        state.constructionHoverPoint = null;
        return true;
      }

      // 2. CHỌN ĐIỂM 1 (BƯỚC 1 CỦA ĐỐI XỨNG ĐIỂM)
      state.construction.point = hitPoint || { x: point.x, y: point.y };
      state.construction.point1El = hitPoint ? hitPoint.element : null;
      statusToolInfo.textContent = '✓ Đã chọn Điểm 1. Bấm chọn tiếp Điểm 2 (tâm đối xứng) để tạo điểm đối xứng.';
      showPageToast('✓ Đã nhận Điểm 1. Bấm chọn tiếp Điểm 2 (tâm đối xứng)!');
      renderPage();
      return true;
    }

    // ==========================================================
    // TÁC VỤ: ĐỐI XỨNG TRỤC (Chọn Điểm -> Chọn Trục hoặc ngược lại)
    // ==========================================================
    if (task === 'axis-symmetry') {
      // 1. NẾU ĐÃ CHỌN ĐIỂM 1 -> LẦN NHẤP TIẾP THEO LÀ TRỤC ĐỐI XỨNG
      if (state.construction.point) {
        let edge = hitEdge;
        let edgeEl = hitEdge ? hitEdge.element : null;
        if (!edge) {
          const directEl = findElementAt(point.x, point.y);
          if (directEl && directEl.type === 'geo') {
            edge = getLineOrEdgeFromElement(directEl, point);
            edgeEl = directEl;
          }
        }
        if (edge) {
          const pt1 = state.construction.point;
          const el1 = state.construction.point1El;
          constructAxisSymmetry(pt1, edge, el1, edgeEl);
          state.pendingConstruction = null;
          state.construction = { point: null, circle: null, line: null, edges: [] };
          state.constructionHoverPoint = null;
          state.constructionHoverEdge = null;
          return true;
        }
        return true;
      }

      // 2. NẾU ĐÃ CHỌN TRỤC ĐỐI XỨNG -> LẦN NHẤP TIẾP THEO LÀ ĐIỂM
      if (state.construction.line) {
        const edge = state.construction.line;
        const edgeEl = state.construction.lineEl || edge.element;
        const pt1 = hitPoint || { x: point.x, y: point.y };
        const el1 = hitPoint ? hitPoint.element : null;
        constructAxisSymmetry(pt1, edge, el1, edgeEl);
        state.pendingConstruction = null;
        state.construction = { point: null, circle: null, line: null, edges: [] };
        state.constructionHoverPoint = null;
        state.constructionHoverEdge = null;
        return true;
      }

      // 3. CHƯA CHỌN GÌ -> ƯU TIÊN KIỂM TRA CLICK TRÚNG TRỤC ĐỐI XỨNG TRƯỚC
      let edge = hitEdge;
      let edgeEl = hitEdge ? hitEdge.element : null;
      if (!edge && !hitPoint) {
        const directEl = findElementAt(point.x, point.y);
        if (directEl && directEl.type === 'geo' && directEl.shape !== 'point') {
          edge = getLineOrEdgeFromElement(directEl, point);
          edgeEl = directEl;
        }
      }

      if (edge && !hitPoint) {
        state.construction.line = edge;
        state.construction.lineEl = edgeEl;
        statusToolInfo.textContent = '✓ Đã chọn Trục đối xứng. Bấm chọn tiếp Điểm cần lấy đối xứng.';
        showPageToast('✓ Đã nhận Trục đối xứng. Bấm chọn tiếp Điểm!');
        renderPage();
        return true;
      }

      // 4. CHỌN ĐIỂM 1
      state.construction.point = hitPoint || { x: point.x, y: point.y };
      state.construction.point1El = hitPoint ? hitPoint.element : null;
      statusToolInfo.textContent = '✓ Đã chọn Điểm 1. Bấm chọn tiếp Trục đối xứng (đoạn thẳng / cạnh) để tạo điểm đối xứng.';
      showPageToast('✓ Đã nhận Điểm 1. Bấm chọn tiếp Trục đối xứng!');
      renderPage();
      return true;
    }

    // ==========================================================
    // TÁC VỤ: ĐƯỜNG TRÒN NGOẠI TIẾP & NỘI TIẾP (Chọn tam giác HOẶC chọn 3 điểm)
    // ==========================================================
    if (task === 'circumcircle' || task === 'incircle') {
      const isCircum = (task === 'circumcircle');
      const toolLabel = isCircum ? 'ngoại tiếp' : 'nội tiếp';

      // 1. Nếu click vào một tam giác có sẵn: dựng ngay lập tức!
      const directEl = findElementAt(point.x, point.y);
      let triEl = null;
      if (directEl && directEl.type === 'geo' && (directEl.shape === 'triangle' || directEl.shape === 'right-triangle' || directEl.shape === 'isosceles-triangle' || (directEl.points && directEl.points.length === 3))) {
        triEl = directEl;
      }
      if (triEl) {
        const pts = (triEl.points && triEl.points.length >= 3) ? triEl.points : [
          { x: (triEl.start.x + triEl.end.x) / 2, y: triEl.start.y },
          { x: triEl.start.x, y: triEl.end.y },
          { x: triEl.end.x, y: triEl.end.y }
        ];
        if (isCircum) {
          constructCircumcircle(pts[0], pts[1], pts[2], null, null, null, triEl);
        } else {
          constructIncircle(pts[0], pts[1], pts[2], triEl);
        }
        state.pendingConstruction = null;
        state.construction = { point: null, circle: null, line: null, edges: [] };
        state.constructionHoverPoint = null;
        return true;
      }

      // 2. Chọn từng điểm trong 3 điểm
      const curPt = hitPoint || { x: point.x, y: point.y };
      const curEl = hitPoint ? hitPoint.element : null;

      if (!state.construction.p1) {
        // ĐÃ CHỌN ĐIỂM 1
        state.construction.p1 = curPt;
        state.construction.el1 = curEl;
        statusToolInfo.textContent = `✓ Đã chọn Điểm 1. Bấm chọn tiếp Điểm 2 để dựng đường tròn ${toolLabel}.`;
        showPageToast(`✓ Đã nhận Điểm 1. Bấm chọn tiếp Điểm 2!`);
        renderPage();
        return true;
      } else if (!state.construction.p2) {
        // ĐÃ CHỌN ĐIỂM 2
        if (Math.hypot(curPt.x - state.construction.p1.x, curPt.y - state.construction.p1.y) < 6) return true;
        state.construction.p2 = curPt;
        state.construction.el2 = curEl;
        statusToolInfo.textContent = `✓ Đã chọn Điểm 2. Bấm chọn tiếp Điểm 3 để hoàn thành đường tròn ${toolLabel}.`;
        showPageToast(`✓ Đã nhận Điểm 2. Bấm chọn tiếp Điểm 3!`);
        renderPage();
        return true;
      } else {
        // ĐÃ CHỌN ĐIỂM 3 -> THỰC HIỆN DỰNG HÌNH!
        if (Math.hypot(curPt.x - state.construction.p2.x, curPt.y - state.construction.p2.y) < 6) return true;
        const p1 = state.construction.p1;
        const p2 = state.construction.p2;
        const p3 = curPt;
        const el1 = state.construction.el1;
        const el2 = state.construction.el2;
        const el3 = curEl;

        if (isCircum) {
          constructCircumcircle(p1, p2, p3, el1, el2, el3);
        } else {
          constructIncircle(p1, p2, p3, null, el1, el2, el3);
        }
        state.pendingConstruction = null;
        state.construction = { point: null, circle: null, line: null, edges: [] };
        state.constructionHoverPoint = null;
        return true;
      }
    }

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
    if (state.activeGeo === 'perpendicular-bisector') {
      const vertex = findPointAt(point.x, point.y, 25);
      const directEl = findElementAt(point.x, point.y);
      const clickedPt = vertex || (directEl && directEl.shape === 'point' ? { x: directEl.start.x, y: directEl.start.y, element: directEl, pointKey: 'start' } : { x: point.x, y: point.y });
      const clickedEl = vertex ? vertex.element : (directEl && directEl.shape === 'point' ? directEl : null);

      // Nếu đã có Điểm 1 -> bắt buộc nhấp lần này là Điểm 2!
      if (state.construction.point) {
        const pt1 = state.construction.point;
        const pt2 = clickedPt;
        if (Math.hypot(pt2.x - pt1.x, pt2.y - pt1.y) < 6) return;

        const el1 = state.construction.point1El;
        const el2 = clickedEl;
        let bindingInfo = null;
        let parentEl = null;

        let idx1 = (pt1.vIndex !== undefined) ? pt1.vIndex : (pt1.vertexIndex !== undefined ? pt1.vertexIndex : -1);
        if (idx1 === -1 && el1 && el1.points) {
          for (let i = 0; i < el1.points.length; i++) {
            if (Math.hypot(el1.points[i].x - pt1.x, el1.points[i].y - pt1.y) < 16) { idx1 = i; break; }
          }
        }
        let idx2 = (pt2.vIndex !== undefined) ? pt2.vIndex : (pt2.vertexIndex !== undefined ? pt2.vertexIndex : -1);
        if (idx2 === -1 && el2 && el2.points) {
          for (let i = 0; i < el2.points.length; i++) {
            if (Math.hypot(el2.points[i].x - pt2.x, el2.points[i].y - pt2.y) < 16) { idx2 = i; break; }
          }
        }
        const keyA = pt1.pointKey;
        const keyB = pt2.pointKey;

        if (el1 && el2 && el1 === el2 && el1.points && idx1 !== -1 && idx2 !== -1) {
          ensureElementId(el1);
          bindingInfo = { type: 'perpendicular_bisector', parentId: el1.id, v1Index: idx1, v2Index: idx2 };
          parentEl = el1;
        } else if (el1 || el2) {
          if (el1) ensureElementId(el1);
          if (el2) ensureElementId(el2);
          bindingInfo = {
            type: 'perpendicular_bisector',
            ptAId: el1 ? el1.id : null,
            vAIndex: idx1 !== -1 ? idx1 : undefined,
            pointKeyA: keyA,
            ptBId: el2 ? el2.id : null,
            vBIndex: idx2 !== -1 ? idx2 : undefined,
            pointKeyB: keyB
          };
          parentEl = [el1, el2].filter(Boolean);
        }

        constructPerpendicularBisector(pt1, pt2, bindingInfo, parentEl);
        state.construction = { point: null, circle: null, line: null, edges: [] };
        state.constructionHoverPoint = null;
        return;
      }

      // Chưa có Điểm 1: Tiện ích nhấp vào cạnh hoặc đoạn thẳng
      const edge = findEdgeAt(point.x, point.y, 28);
      if (edge && (!vertex)) {
        constructPerpendicularBisectorFromEdge(edge);
        state.construction = { point: null, circle: null, line: null, edges: [] };
        state.constructionHoverPoint = null;
        return;
      }

      if (directEl && directEl.type === 'geo' && (directEl.shape === 'line' || directEl.shape === 'perpendicular' || directEl.shape === 'parallel' || directEl.shape === 'tangent') && !vertex) {
        ensureElementId(directEl);
        constructPerpendicularBisector(directEl.start, directEl.end, { type: 'perpendicular_bisector', parentId: directEl.id }, directEl);
        state.construction = { point: null, circle: null, line: null, edges: [] };
        state.constructionHoverPoint = null;
        return;
      }

      // Nhấp chọn Điểm 1:
      state.construction.point = clickedPt;
      state.construction.point1El = clickedEl;
      statusToolInfo.textContent = 'Đường trung trực: Đã chọn Điểm 1. Hãy nhấp tiếp Điểm 2 để vẽ đường trung trực.';
      showPageToast('✓ Đã nhận Điểm 1. Bấm chọn tiếp Điểm 2!');
      renderPage();
      return;
    }

    if (state.activeGeo === 'point-symmetry') {
      const vertex = findPointAt(point.x, point.y, 25);
      const directEl = findElementAt(point.x, point.y);
      const clickedPt = vertex || { x: point.x, y: point.y };
      const clickedEl = vertex ? vertex.element : (directEl && directEl.shape === 'point' ? directEl : null);

      if (state.construction.point) {
        const pt1 = state.construction.point;
        const pt2 = clickedPt;
        if (Math.hypot(pt2.x - pt1.x, pt2.y - pt1.y) < 6) return;

        const el1 = state.construction.point1El;
        const el2 = clickedEl;

        constructPointSymmetry(pt1, pt2, el1, el2);
        state.construction = { point: null, circle: null, line: null, edges: [] };
        state.constructionHoverPoint = null;
        return;
      }

      state.construction.point = clickedPt;
      state.construction.point1El = clickedEl;
      statusToolInfo.textContent = '✓ Đã chọn Điểm 1. Bấm chọn tiếp Điểm 2 (tâm đối xứng) để tạo điểm đối xứng.';
      showPageToast('✓ Đã nhận Điểm 1. Bấm chọn tiếp Điểm 2 (tâm đối xứng)!');
      renderPage();
      return;
    }

    if (state.activeGeo === 'axis-symmetry') {
      const vertex = findPointAt(point.x, point.y, 25);
      const edge = findEdgeAt(point.x, point.y, 25);
      const directEl = findElementAt(point.x, point.y);

      // TH 1: Đã có Điểm 1 -> Tìm trục đối xứng
      if (state.construction.point) {
        let chosenEdge = edge;
        let chosenEl = edge ? edge.element : null;
        if (!chosenEdge && directEl && directEl.type === 'geo' && directEl.shape !== 'point') {
          chosenEdge = getLineOrEdgeFromElement(directEl, point);
          chosenEl = directEl;
        }
        if (chosenEdge) {
          const pt1 = state.construction.point;
          const el1 = state.construction.point1El;
          constructAxisSymmetry(pt1, chosenEdge, el1, chosenEl);
          state.construction = { point: null, circle: null, line: null, edges: [] };
          state.constructionHoverPoint = null;
          state.constructionHoverEdge = null;
          return;
        }
        return;
      }

      // TH 2: Đã có Trục -> Tìm điểm
      if (state.construction.line) {
        const clickedPt = vertex || { x: point.x, y: point.y };
        const clickedEl = vertex ? vertex.element : (directEl && directEl.shape === 'point' ? directEl : null);
        const chosenEdge = state.construction.line;
        const chosenEl = state.construction.lineEl || chosenEdge.element;
        constructAxisSymmetry(clickedPt, chosenEdge, clickedEl, chosenEl);
        state.construction = { point: null, circle: null, line: null, edges: [] };
        state.constructionHoverPoint = null;
        state.constructionHoverEdge = null;
        return;
      }

      // TH 3: Chưa có gì
      let chosenEdge = edge;
      let chosenEl = edge ? edge.element : null;
      if (!chosenEdge && !vertex && directEl && directEl.type === 'geo' && directEl.shape !== 'point') {
        chosenEdge = getLineOrEdgeFromElement(directEl, point);
        chosenEl = directEl;
      }

      if (chosenEdge && !vertex) {
        state.construction.line = chosenEdge;
        state.construction.lineEl = chosenEl;
        statusToolInfo.textContent = '✓ Đã chọn Trục đối xứng. Bấm chọn tiếp Điểm cần lấy đối xứng.';
        showPageToast('✓ Đã nhận Trục đối xứng. Bấm chọn tiếp Điểm!');
        renderPage();
        return;
      }

      const clickedPt = vertex || { x: point.x, y: point.y };
      const clickedEl = vertex ? vertex.element : (directEl && directEl.shape === 'point' ? directEl : null);
      state.construction.point = clickedPt;
      state.construction.point1El = clickedEl;
      statusToolInfo.textContent = '✓ Đã chọn Điểm 1. Bấm chọn tiếp Trục đối xứng (đoạn thẳng / cạnh) để tạo điểm đối xứng.';
      showPageToast('✓ Đã nhận Điểm 1. Bấm chọn tiếp Trục đối xứng!');
      renderPage();
      return;
    }

    if (state.activeGeo === 'circumcircle' || state.activeGeo === 'incircle') {
      const isCircum = (state.activeGeo === 'circumcircle');
      const toolLabel = isCircum ? 'ngoại tiếp' : 'nội tiếp';

      // 1. Kiểm tra nhấp vào tam giác có sẵn
      const directEl = findElementAt(point.x, point.y);
      let triEl = null;
      if (directEl && directEl.type === 'geo' && (directEl.shape === 'triangle' || directEl.shape === 'right-triangle' || directEl.shape === 'isosceles-triangle' || (directEl.points && directEl.points.length === 3))) {
        triEl = directEl;
      }
      if (triEl) {
        const pts = (triEl.points && triEl.points.length >= 3) ? triEl.points : [
          { x: (triEl.start.x + triEl.end.x) / 2, y: triEl.start.y },
          { x: triEl.start.x, y: triEl.end.y },
          { x: triEl.end.x, y: triEl.end.y }
        ];
        if (isCircum) {
          constructCircumcircle(pts[0], pts[1], pts[2], null, null, null, triEl);
        } else {
          constructIncircle(pts[0], pts[1], pts[2], triEl);
        }
        state.construction = { point: null, circle: null, line: null, edges: [] };
        state.constructionHoverPoint = null;
        return;
      }

      // 2. Nhấp chọn 3 điểm
      const vertex = findPointAt(point.x, point.y, 25);
      const clickedPt = vertex || { x: point.x, y: point.y };
      const clickedEl = vertex ? vertex.element : (directEl && directEl.shape === 'point' ? directEl : null);

      if (!state.construction.p1) {
        state.construction.p1 = clickedPt;
        state.construction.el1 = clickedEl;
        statusToolInfo.textContent = `✓ Đã chọn Điểm 1. Bấm chọn tiếp Điểm 2 để dựng đường tròn ${toolLabel}.`;
        showPageToast(`✓ Đã nhận Điểm 1. Bấm chọn tiếp Điểm 2!`);
        renderPage();
        return;
      } else if (!state.construction.p2) {
        if (Math.hypot(clickedPt.x - state.construction.p1.x, clickedPt.y - state.construction.p1.y) < 6) return;
        state.construction.p2 = clickedPt;
        state.construction.el2 = clickedEl;
        statusToolInfo.textContent = `✓ Đã chọn Điểm 2. Bấm chọn tiếp Điểm 3 để hoàn thành đường tròn ${toolLabel}.`;
        showPageToast(`✓ Đã nhận Điểm 2. Bấm chọn tiếp Điểm 3!`);
        renderPage();
        return;
      } else {
        if (Math.hypot(clickedPt.x - state.construction.p2.x, clickedPt.y - state.construction.p2.y) < 6) return;
        const p1 = state.construction.p1;
        const p2 = state.construction.p2;
        const p3 = clickedPt;
        const el1 = state.construction.el1;
        const el2 = state.construction.el2;
        const el3 = clickedEl;

        if (isCircum) {
          constructCircumcircle(p1, p2, p3, el1, el2, el3);
        } else {
          constructIncircle(p1, p2, p3, null, el1, el2, el3);
        }
        state.construction = { point: null, circle: null, line: null, edges: [] };
        state.constructionHoverPoint = null;
        return;
      }
    }

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
      const interSnap = findIntersectionSnapAtPoint(point, 24);
      if (interSnap) {
        ensureElementId(interSnap.elementA);
        ensureElementId(interSnap.elementB);
        const newPoint = {
          type: 'geo',
          shape: 'point',
          start: { x: interSnap.x, y: interSnap.y },
          end: { x: interSnap.x, y: interSnap.y },
          color: state.color || '#184e3a',
          width: Math.max(state.strokeWidth || 3, 3),
          binding: {
            type: 'intersection',
            objAId: interSnap.elementA.id,
            objBId: interSnap.elementB.id,
            v1IndexA: interSnap.v1IndexA,
            v2IndexA: interSnap.v2IndexA,
            v1IndexB: interSnap.v1IndexB,
            v2IndexB: interSnap.v2IndexB,
            ptIndex: interSnap.ptIndex || 0
          }
        };
        ensureElementId(newPoint);
        linkGroupMulti([interSnap.elementA, interSnap.elementB], newPoint);
        pushNewElement(newPoint);
        state.hoverSnapPoint = null;
        state.hoverIntersectionElements = null;
        finishGeoTask(newPoint);
        statusToolInfo.textContent = '✨ Đã tạo giao điểm (tự động gắn kết chặt với cả 2 hình).';
        renderPage();
        return;
      }

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
      const hitVertex = findPointAt(point.x, point.y, 25);
      const hitHandle = findHandleAt(point.x, point.y, 28);
      const hitPointEl = findElementAt(point.x, point.y);

      let clickedPt = null;
      let clickedEl = null;

      if (hitVertex) {
        clickedPt = {
          x: hitVertex.x,
          y: hitVertex.y,
          vIndex: hitVertex.vIndex,
          vertexIndex: hitVertex.vIndex,
          pointKey: hitVertex.pointKey
        };
        clickedEl = hitVertex.element || hitVertex;
      } else if (hitHandle && hitHandle.element && hitHandle.element.type === 'geo') {
        const pKey = (hitHandle.handle.id === 'center' || hitHandle.handle.id === 'start' || hitHandle.handle.id === 'point') ? 'start' : (hitHandle.handle.id === 'end' || hitHandle.handle.id === 'ext_point' ? 'end' : undefined);
        clickedPt = {
          x: hitHandle.handle.x,
          y: hitHandle.handle.y,
          vIndex: hitHandle.handle.index,
          vertexIndex: hitHandle.handle.index,
          pointKey: pKey
        };
        clickedEl = hitHandle.element;
      } else if (hitPointEl && hitPointEl.type === 'geo' && hitPointEl.shape === 'point') {
        clickedPt = { x: hitPointEl.start.x, y: hitPointEl.start.y, pointKey: 'start' };
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

        if (el1 && el2 && el1 === el2 && el1.points && el1.points.length >= 3) {
          ensureElementId(el1);
          let idx1 = pt1.vIndex !== undefined ? pt1.vIndex : -1;
          let idx2 = pt2.vIndex !== undefined ? pt2.vIndex : -1;
          if (idx1 === -1 || idx2 === -1) {
            for (let i = 0; i < el1.points.length; i++) {
              if (idx1 === -1 && Math.hypot(el1.points[i].x - pt1.x, el1.points[i].y - pt1.y) < 14) idx1 = i;
              if (idx2 === -1 && Math.hypot(el1.points[i].x - pt2.x, el1.points[i].y - pt2.y) < 14) idx2 = i;
            }
          }
          if (idx1 !== -1 && idx2 !== -1) {
            bindingInfo = { type: 'midpoint_triangle_edge', parentId: el1.id, v1Index: idx1, v2Index: idx2 };
            parentEl = el1;
          }
        } else if (el1 || el2) {
          if (el1) ensureElementId(el1);
          if (el2) ensureElementId(el2);
          bindingInfo = {
            type: 'midpoint_points',
            ptAId: el1 ? el1.id : null,
            vAIndex: pt1.vIndex !== undefined ? pt1.vIndex : pt1.vertexIndex,
            pointKeyA: pt1.pointKey,
            ptBId: el2 ? el2.id : null,
            vBIndex: pt2.vIndex !== undefined ? pt2.vIndex : pt2.vertexIndex,
            pointKeyB: pt2.pointKey
          };
          parentEl = [el1, el2].filter(Boolean);
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

      const isPB = (state.pendingConstruction === 'perpendicular-bisector' || state.activeGeo === 'perpendicular-bisector');
      const isPS = (state.pendingConstruction === 'point-symmetry' || state.activeGeo === 'point-symmetry');
      const isAS = (state.pendingConstruction === 'axis-symmetry' || state.activeGeo === 'axis-symmetry');
      const ptLabel = (isPB || isPS || isAS) ? '✓ Đã chọn: Điểm 1' : '✓ Đã chọn: Điểm';
      drawSharpArrowIndicator(ctx, p.x, p.y, ptLabel, true);

      // Hiệu ứng xem trước thời gian thực cho Đối xứng trục (khi đã chọn Điểm 1 và rê chuột qua một trục/cạnh)
      if (isAS && state.constructionHoverEdge) {
        const edge = state.constructionHoverEdge;
        const A = edge.start || (edge.points ? edge.points[0] : null);
        const B = edge.end || (edge.points ? edge.points[1] : null);
        if (A && B) {
          const vx = B.x - A.x;
          const vy = B.y - A.y;
          const len = Math.hypot(vx, vy) || 1;
          const ux = vx / len;
          const uy = vy / len;
          const t = (p.x - A.x) * ux + (p.y - A.y) * uy;
          const H = { x: A.x + t * ux, y: A.y + t * uy };
          const p2 = { x: 2 * H.x - p.x, y: 2 * H.y - p.y };
          const distH = Math.hypot(p2.x - p.x, p2.y - p.y);

          ctx.save();
          // Đoạn thẳng nét đứt mờ nối Điểm 1 -> H -> Điểm 2
          ctx.beginPath();
          ctx.setLineDash([5, 4]);
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineWidth = 1.8;
          ctx.strokeStyle = 'rgba(22, 163, 74, 0.7)';
          ctx.stroke();

          // Chân vuông góc H tạm thời
          ctx.beginPath();
          ctx.arc(H.x, H.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#15803d';
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          // Ký hiệu góc vuông tại H
          if (distH > 14) {
            const sqLen = 8;
            const dirX = (p.x - H.x) / (distH / 2 || 1);
            const dirY = (p.y - H.y) / (distH / 2 || 1);
            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.moveTo(H.x + dirX * sqLen, H.y + dirY * sqLen);
            ctx.lineTo(H.x + dirX * sqLen + ux * sqLen, H.y + dirY * sqLen + uy * sqLen);
            ctx.lineTo(H.x + ux * sqLen, H.y + uy * sqLen);
            ctx.lineWidth = 1.4;
            ctx.strokeStyle = '#15803d';
            ctx.stroke();
          }

          // Điểm 2 tạm thời (điểm đối xứng)
          ctx.beginPath();
          ctx.arc(p2.x, p2.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#dc2626';
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          // Nhãn chỉ dẫn
          drawSharpArrowIndicator(ctx, H.x, H.y, '📐 Giao điểm trục (H)', true);
          drawSharpArrowIndicator(ctx, p2.x, p2.y, '✨ Điểm đối xứng qua trục', true);

          ctx.restore();
        }
      }

      // Hiệu ứng xem trước thời gian thực cho Đối xứng điểm
      if (isPS && state.constructionHoverPoint) {
        const p2 = state.constructionHoverPoint;
        const dist = Math.hypot(p2.x - p.x, p2.y - p.y);
        if (dist > 8) {
          const p3 = { x: 2 * p2.x - p.x, y: 2 * p2.y - p.y };
          ctx.save();
          // Đoạn thẳng nét đứt mờ nối Điểm 1 -> Điểm 2 -> Điểm 3
          ctx.beginPath();
          ctx.setLineDash([5, 4]);
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineWidth = 1.8;
          ctx.strokeStyle = 'rgba(22, 163, 74, 0.7)';
          ctx.stroke();

          // Điểm 2 tạm thời (tâm đối xứng)
          ctx.beginPath();
          ctx.arc(p2.x, p2.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#15803d';
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          // Điểm 3 tạm thời (điểm đối xứng)
          ctx.beginPath();
          ctx.arc(p3.x, p3.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#dc2626';
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          // Vạch bằng nhau đôi trên P1-P2 và P2-P3
          const u = { x: (p3.x - p.x) / (dist * 2), y: (p3.y - p.y) / (dist * 2) };
          const v = { x: -u.y, y: u.x };
          const M1 = { x: (p.x + p2.x) / 2, y: (p.y + p2.y) / 2 };
          const M2 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
          const tickLen = 5;
          const tickSpacing = 2.2;

          ctx.beginPath();
          ctx.setLineDash([]);
          ctx.moveTo(M1.x - v.x * tickLen - u.x * tickSpacing, M1.y - v.y * tickLen - u.y * tickSpacing);
          ctx.lineTo(M1.x + v.x * tickLen - u.x * tickSpacing, M1.y + v.y * tickLen - u.y * tickSpacing);
          ctx.moveTo(M1.x - v.x * tickLen + u.x * tickSpacing, M1.y - v.y * tickLen + u.y * tickSpacing);
          ctx.lineTo(M1.x + v.x * tickLen + u.x * tickSpacing, M1.y + v.y * tickLen + u.y * tickSpacing);

          ctx.moveTo(M2.x - v.x * tickLen - u.x * tickSpacing, M2.y - v.y * tickLen - u.y * tickSpacing);
          ctx.lineTo(M2.x + v.x * tickLen - u.x * tickSpacing, M2.y + v.y * tickLen - u.y * tickSpacing);
          ctx.moveTo(M2.x - v.x * tickLen + u.x * tickSpacing, M2.y - v.y * tickLen + u.y * tickSpacing);
          ctx.lineTo(M2.x + v.x * tickLen + u.x * tickSpacing, M2.y + v.y * tickLen + u.y * tickSpacing);
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = '#15803d';
          ctx.stroke();

          // Nhãn chỉ dẫn cho Điểm 2 và Điểm 3
          drawSharpArrowIndicator(ctx, p2.x, p2.y, '🎯 Tâm đối xứng (Điểm 2)', true);
          drawSharpArrowIndicator(ctx, p3.x, p3.y, '✨ Điểm đối xứng (Điểm 3)', true);

          ctx.restore();
        }
      }

      // Hiệu ứng xem trước thời gian thực cho Đường trung trực (nối từ Điểm 1 tới con trỏ chuột)
      if (isPB && state.constructionHoverPoint) {
        const p2 = state.constructionHoverPoint;
        const dist = Math.hypot(p2.x - p.x, p2.y - p.y);
        if (dist > 8) {
          ctx.save();
          // Đoạn thẳng nét đứt mờ nối 2 điểm
          ctx.beginPath();
          ctx.setLineDash([5, 4]);
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = 'rgba(22, 163, 74, 0.45)';
          ctx.stroke();

          // Trung điểm M tạm thời
          const Mx = (p.x + p2.x) / 2;
          const My = (p.y + p2.y) / 2;
          ctx.beginPath();
          ctx.arc(Mx, My, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#15803d';
          ctx.fill();

          // Đường vuông góc trung trực xem trước
          const nx = -(p2.y - p.y) / dist;
          const ny = (p2.x - p.x) / dist;
          const halfL = Math.max(50, dist * 0.65);
          ctx.beginPath();
          ctx.setLineDash([7, 4]);
          ctx.moveTo(Mx - halfL * nx, My - halfL * ny);
          ctx.lineTo(Mx + halfL * nx, My + halfL * ny);
          ctx.lineWidth = 2.2;
          ctx.strokeStyle = '#16a34a';
          ctx.stroke();

          ctx.restore();
        }
      }
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
      const isASLine = (state.pendingConstruction === 'axis-symmetry' || state.activeGeo === 'axis-symmetry');
      const lineLabel = (state.pendingConstruction === 'intersection' || state.activeGeo === 'intersection') ? '✓ Đã nhận: Đường 1' : (isASLine ? '✓ Đã chọn: Trục đối xứng' : '✓ Đã chọn: Đường thẳng');
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

    // 5. Hiển thị các điểm p1, p2 và hiệu ứng xem trước cho Đường tròn ngoại tiếp / nội tiếp
    const isCircum = (state.pendingConstruction === 'circumcircle' || state.activeGeo === 'circumcircle');
    const isIncircle = (state.pendingConstruction === 'incircle' || state.activeGeo === 'incircle');
    if (isCircum || isIncircle) {
      if (state.construction.p1) {
        const p1 = state.construction.p1;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#16a34a';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#184e3a';
        ctx.fill();
        drawSharpArrowIndicator(ctx, p1.x, p1.y, '✓ Đã chọn: Điểm 1', true);
      }
      if (state.construction.p2) {
        const p2 = state.construction.p2;
        ctx.beginPath();
        ctx.arc(p2.x, p2.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#16a34a';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p2.x, p2.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#184e3a';
        ctx.fill();
        drawSharpArrowIndicator(ctx, p2.x, p2.y, '✓ Đã chọn: Điểm 2', true);
      }

      // Khi đã có p1, p2 và đang rê chuột (p3 tạm thời)
      if (state.construction.p1 && state.construction.p2 && state.constructionHoverPoint) {
        const p1 = state.construction.p1;
        const p2 = state.construction.p2;
        const p3 = state.constructionHoverPoint;
        const dist = Math.hypot(p3.x - p2.x, p3.y - p2.y);

        if (dist > 8) {
          if (isCircum) {
            const D = 2 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
            if (Math.abs(D) > 1e-4) {
              const sq1 = p1.x * p1.x + p1.y * p1.y;
              const sq2 = p2.x * p2.x + p2.y * p2.y;
              const sq3 = p3.x * p3.x + p3.y * p3.y;
              const x0 = (sq1 * (p2.y - p3.y) + sq2 * (p3.y - p1.y) + sq3 * (p1.y - p2.y)) / D;
              const y0 = (sq1 * (p3.x - p2.x) + sq2 * (p1.x - p3.x) + sq3 * (p2.x - p1.x)) / D;
              const R = Math.hypot(p1.x - x0, p1.y - y0);

              if (R < 2500) {
                ctx.save();
                ctx.beginPath();
                ctx.setLineDash([5, 4]);
                ctx.arc(x0, y0, R, 0, Math.PI * 2);
                ctx.lineWidth = 1.8;
                ctx.strokeStyle = 'rgba(22, 163, 74, 0.7)';
                ctx.stroke();

                ctx.beginPath();
                ctx.setLineDash([]);
                ctx.arc(x0, y0, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#dc2626';
                ctx.fill();
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = '#ffffff';
                ctx.stroke();
                drawSharpArrowIndicator(ctx, x0, y0, '🎯 Tâm ngoại tiếp (O)', true);
                drawSharpArrowIndicator(ctx, p3.x, p3.y, 'Điểm 3 (Bấm để hoàn tất)', true);
                ctx.restore();
              }
            }
          } else if (isIncircle) {
            const a = Math.hypot(p3.x - p2.x, p3.y - p2.y);
            const b = Math.hypot(p1.x - p3.x, p1.y - p3.y);
            const c = Math.hypot(p2.x - p1.x, p2.y - p1.y);
            const peri = a + b + c;
            if (peri > 1e-4) {
              const xI = (a * p1.x + b * p2.x + c * p3.x) / peri;
              const yI = (a * p1.y + b * p2.y + c * p3.y) / peri;
              const S = 0.5 * Math.abs(p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
              const r = S / (peri / 2);

              if (r > 3 && r < 1000) {
                ctx.save();
                ctx.beginPath();
                ctx.setLineDash([4, 4]);
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.closePath();
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = 'rgba(22, 163, 74, 0.5)';
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(xI, yI, r, 0, Math.PI * 2);
                ctx.lineWidth = 1.8;
                ctx.strokeStyle = 'rgba(22, 163, 74, 0.75)';
                ctx.stroke();

                ctx.beginPath();
                ctx.setLineDash([]);
                ctx.arc(xI, yI, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#dc2626';
                ctx.fill();
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = '#ffffff';
                ctx.stroke();
                drawSharpArrowIndicator(ctx, xI, yI, '🎯 Tâm nội tiếp (I)', true);
                drawSharpArrowIndicator(ctx, p3.x, p3.y, 'Điểm 3 (Bấm để hoàn tất)', true);
                ctx.restore();
              }
            }
          }
        }
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
    const effCursor = cursorStyle || (typeof getCurrentToolCursor === 'function' ? getCurrentToolCursor() : PEN_CURSOR);
    if (document.body && document.body.classList) {
      document.body.classList.toggle('select-mode', state.activeTool === 'select');
      document.body.classList.toggle('highlighter-mode', state.activeTool === 'highlighter');
      document.body.classList.toggle('eraser-mode', state.activeTool === 'eraser');
    }
    document.querySelectorAll('canvas.main-canvas, #main-canvas').forEach(c => {
      c.style.cursor = effCursor;
    });
  }

  // 5. Xử lý sự kiện bút vẽ Pointer Events
  function handlePointerDown(e) {
    // Bỏ qua bấm chuột phải trong pointerdown để sự kiện contextmenu (Đặt tên / Đổi tên) xử lý sạch sẽ
    if (e && e.button === 2) {
      return;
    }
    // Cơ chế Palm Rejection: Nếu đang viết bằng bút stylus / Apple Pencil (pen), bỏ qua mọi chạm lòng bàn tay (touch)
    if (state.isDrawing && state.activePointerType === 'pen' && e && e.pointerType === 'touch') {
      return;
    }
    state.activePointerType = (e && e.pointerType) || 'mouse';
    if (e && e.target && e.target.closest && e.target.closest('.net-rename-popover')) {
      return;
    }
    closeRenamePopover();
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
    state.cachedCanvasRect = targetCanvas.getBoundingClientRect();
    state.cachedCanvasTarget = targetCanvas;
    try {
      targetCanvas.setPointerCapture(e.pointerId);
    } catch (err) {}

    const point = getCanvasCoordinates(e);

    // Cập nhật trạng thái lực nhấn
    // Nếu người dùng đang nhấp vào khung nhập số đo góc nổi trên canvas
    if (e.target && e.target.closest && e.target.closest('.floating-angle-box')) {
      return;
    }

    // Xử lý công cụ OCR: Nhấn chuột bắt đầu khoanh vùng nhận dạng chữ viết tay
    if (state.activeTool === 'ocr') {
      state.isOcrScanning = true;
      state.ocrScanStart = { x: point.x, y: point.y };
      state.ocrScanCurrent = { x: point.x, y: point.y };
      state.isDrawing = false;
      renderPage();
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

        // 1. Kiểm tra trúng điểm hình học rời (Ưu tiên 1A: Điểm rời độc lập)
        const hitPoint = findElementAt(point.x, point.y);
        if (hitPoint && hitPoint.type === 'geo' && hitPoint.shape === 'point') {
          state.lastClickedNamingTarget = {
            category: 'point',
            kind: 'point-element',
            element: hitPoint,
            x: hitPoint.start.x,
            y: hitPoint.start.y,
            title: 'Điểm hình học'
          };
          state.selectedVertex = {
            element: hitPoint,
            handleId: 'point',
            x: hitPoint.start.x,
            y: hitPoint.start.y,
            name: hitPoint.name ? `Điểm ${hitPoint.name}` : 'Điểm'
          };
          state.selectedEdge = null;
          state.isFromAreaSelect = false;
          hideFloatingSelectionBar();
          setSelectedElements([hitPoint]);
          state.isDrawing = true;
          state.dragLast = { x: point.x, y: point.y };
          state.totalMoved = { dx: 0, dy: 0 };

          // Nếu là điểm điều khiển động (điểm trượt trên đường tròn/đoạn thẳng hoặc điểm gốc tự do có hình con phụ thuộc)
          // và chưa bị khóa cứng bằng Nhóm thủ công (isManualGroup) -> kích hoạt chế độ kéo điều chỉnh động (activeHandle)
          const isDynamicControlPoint = !hitPoint.isManualGroup && (
            (hitPoint.binding && (hitPoint.binding.type === 'point_on_circle' || hitPoint.binding.type === 'point_on_line' || hitPoint.binding.type === 'point_on_segment')) ||
            (!hitPoint.binding && getDependentElements(hitPoint).length > 0)
          );
          if (isDynamicControlPoint) {
            const ptName = hitPoint.name ? `Điểm ${hitPoint.name}` : 'Điểm điều khiển';
            state.activeHandle = {
              handle: { id: 'point', x: hitPoint.start.x, y: hitPoint.start.y, name: ptName, cursor: 'grabbing' },
              element: hitPoint
            };
            state.hoverHandle = null;
            state.hoverPointTarget = null;
            state.lastDragPoint = { x: point.x, y: point.y };
            state.handleAdjustInitial = JSON.parse(JSON.stringify(hitPoint));
            const deps = getDependentElements(hitPoint);
            state.handleAdjustDependentsInitial = deps.map(d => ({ element: d, before: JSON.parse(JSON.stringify(d)) }));
            state.pendingSingleSelect = null;
            canvas.style.cursor = 'grabbing';
            statusToolInfo.textContent = `🎯 Đang di chuyển: ${ptName} (Các đường và hình phụ thuộc tự động biến đổi theo)`;
            renderPage();
            return;
          }

          state.pendingSingleSelect = hitPoint;
          canvas.style.cursor = 'grabbing';
          renderPage();
          return;
        }

        // 2. Ưu tiên 1B: Kiểm tra trúng ĐỈNH (Vertex / Handle) trong bán kính lõi 18px để phân biệt chính xác Đỉnh với Cạnh
        const hitHandle = findHandleAt(point.x, point.y, 18);
        if (hitHandle) {
          if (!hitHandle.handle.isRotate2D && !hitHandle.handle.isRotate3D) {
            state.lastClickedNamingTarget = resolveNamingTargetFromHandle(hitHandle.element, hitHandle.handle);
            state.selectedVertex = {
              element: hitHandle.element,
              vIndex: hitHandle.handle.index,
              handleId: hitHandle.handle.id,
              x: hitHandle.handle.x,
              y: hitHandle.handle.y,
              name: hitHandle.handle.name || 'Đỉnh'
            };
            state.selectedEdge = null;
          }
          state.activeHandle = hitHandle;
          state.isDrawing = true;
          hideFloatingSelectionBar();
          state.isFromAreaSelect = false;
          setSelectedElements([hitHandle.element]);
          state.hoverHandle = null;
          state.hoverEdge = null;
          state.hoverPointTarget = null;
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
          statusToolInfo.textContent = `🎯 Đã chọn: ${hitHandle.handle.name} (Kéo để điều chỉnh đỉnh, Chuột phải để đặt/đổi tên)`;
          renderPage();
          return;
        }

        // 3. Ưu tiên 2: Kiểm tra chọn CẠNH / ĐOẠN THẲNG (ngoài vùng lõi đỉnh 18px) hoặc chọn thân hình
        const el = findElementAt(point.x, point.y);
        if (el) {
          const clickedEdge = findEdgeAt(point.x, point.y, 22);
          if (clickedEdge && clickedEdge.element === el) {
            state.lastClickedNamingTarget = resolveNamingTargetFromEdge(clickedEdge);
            if (!(el.groupId && el.isManualGroup && !e.altKey)) {
              state.selectedEdge = clickedEdge;
              state.selectedVertex = null;
            }
          } else if (el.type === 'geo' && (el.shape === 'line' || el.shape === 'perpendicular' || el.shape === 'parallel' || el.shape === 'bisector' || el.shape === 'tangent' || el.shape === 'perpendicular-bisector')) {
            state.lastClickedNamingTarget = {
              category: 'line',
              kind: 'line-element',
              element: el,
              x: point.x,
              y: point.y,
              title: 'Đường thẳng / Đoạn thẳng'
            };
            if (!(el.groupId && el.isManualGroup && !e.altKey)) {
              state.selectedEdge = {
                element: el,
                start: el.start,
                end: el.end,
                dist: 0
              };
              state.selectedVertex = null;
            }
          }
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

          if (!e.altKey && state.selectedElements && state.selectedElements.length > 1 && state.selectedElements.includes(el)) {
            // Đang giữ nhóm nhiều đối tượng đã chọn: kéo rê cả nhóm
            state.isDrawing = true;
            state.dragLast = { x: point.x, y: point.y };
            state.totalMoved = { dx: 0, dy: 0 };
            state.pendingSingleSelect = null;
            canvas.style.cursor = 'grabbing';
            hideFloatingSelectionBar();
            return;
          }

          let targets = [el];
          // Chỉ tự động bung chọn toàn bộ nhóm khi người dùng đã chủ động Nhóm thủ công (⌘G / isManualGroup)
          // và không giữ phím Alt/Option (Alt+Click cho phép chọn sâu 1 phần tử con trong nhóm thủ công)
          if (el.groupId && el.isManualGroup && !e.altKey) {
            const pageEls = state.pages[state.currentPage] || [];
            const grp = pageEls.filter(item => item && item.groupId === el.groupId);
            if (grp.length > 1) {
              targets = grp;
            }
          }
          state.isFromAreaSelect = targets.length > 1;
          hideFloatingSelectionBar();
          setSelectedElements(targets);
          state.isDrawing = true;
          state.dragLast = { x: point.x, y: point.y };
          state.totalMoved = { dx: 0, dy: 0 };
          state.pendingSingleSelect = targets.length === 1 ? el : null;
          canvas.style.cursor = 'grabbing';
        } else {
          // Bấm ra ngoài khoảng trống canvas:
          // Nếu bấm vào bên trong khung bao của nhóm đối tượng đang chọn -> Kéo di chuyển cả nhóm
          if (state.selectedElements && state.selectedElements.length > 1) {
            const uBox = getCombinedBoundingBox(state.selectedElements);
            if (uBox && isPointInsideBox(point.x, point.y, uBox, 10)) {
              state.isDrawing = true;
              state.dragLast = { x: point.x, y: point.y };
              state.totalMoved = { dx: 0, dy: 0 };
              state.pendingSingleSelect = null;
              canvas.style.cursor = 'grabbing';
              hideFloatingSelectionBar();
              return;
            }
          }
          // Bấm vào khoảng trống: Xóa chọn và Bắt đầu quét kéo chọn vùng (Area / Marquee Selection)
          state.isFromAreaSelect = false;
          setSelectedElements([]);
          hideFloatingSelectionBar();
          state.isAreaSelecting = true;
          state.areaSelectStart = { x: point.x, y: point.y };
          state.areaSelectCurrent = { x: point.x, y: point.y };
          state.areaSelectPage = pageNum;
          setCanvasCursor('crosshair');
          statusToolInfo.textContent = 'Công cụ: Chọn — Nhấn giữ và kéo chuột để khoanh vùng chọn các đối tượng';
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
      openInlineTextEditor(point.x, point.y);
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
            state.geoStartSnapBinding = { type: 'point', elementId: ptSnap.element.id, vIndex: ptSnap.vIndex, pointKey: ptSnap.pointKey };
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
      const pr = (point.pressure && point.pressure > 0) ? point.pressure : 0.5;
      point.smoothedPressure = pr;
      state.lastSmoothedPressure = pr;
      state.streamlinePos = { x: point.x, y: point.y };
      state.currentPath = [point];

      // Vẽ ngay điểm chấm ban đầu (hỗ trợ chấm câu, dấu chấm chữ i, chữ j)
      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = state.color;
      ctx.globalAlpha = state.activeTool === 'highlighter' ? 0.35 : 1.0;
      ctx.beginPath();
      const dotRadius = state.activeTool === 'highlighter' 
        ? (state.strokeWidth * 3.5) / 2 
        : Math.max(0.8, (state.strokeWidth * (0.6 + pr * 0.8)) / 2);
      ctx.arc(point.x, point.y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function handlePointerMove(e) {
    // Bỏ qua chạm lòng bàn tay khi đang viết bằng bút stylus
    if (state.isDrawing && state.activePointerType === 'pen' && e && e.pointerType === 'touch') {
      return;
    }
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

    // Xử lý công cụ OCR: Cập nhật vùng quét chữ viết tay theo con trỏ chuột
    if (state.activeTool === 'ocr') {
      if (state.isOcrScanning) {
        state.ocrScanCurrent = { x: point.x, y: point.y };
        renderPage();
      }
      return;
    }

    // 1. Kéo điều chỉnh từng chấm tròn điều khiển (Control Handle)
    if (state.activeHandle && state.isDrawing) {
      hideFloatingSelectionBar();
      state.hoverHandle = null;
      state.hoverPointTarget = null;
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
        const bKey = (h.id === 'start') ? 'startBinding' : 'endBinding';
        if (snap && snap.element) {
          ensureElementId(snap.element);
          el[bKey] = { type: 'point', elementId: snap.element.id, vIndex: snap.vIndex, pointKey: snap.pointKey };
        } else if (snap && snap.isCircle && snap.circle) {
          ensureElementId(snap.circle);
          el[bKey] = { type: 'point_on_circle', parentId: snap.circle.id, angle: snap.angle };
        } else {
          delete el[bKey];
        }
        state.hoverSnapPoint = snap ? { x: snap.x, y: snap.y, label: snap.label } : null;
      } else if (el.shape === 'triangle' || el.shape === 'right-triangle' || el.shape === 'isosceles-triangle') {
        const snap = findSnapTargetForHandle(point, el, h, 24);
        const target = snap ? { x: snap.x, y: snap.y } : { x: point.x, y: point.y };
        el.points[h.index] = { ...(el.points[h.index] || {}), x: target.x, y: target.y };

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
        el.points[idx] = { ...(el.points[idx] || {}), x: target.x, y: target.y };
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
          el.points[0] = { ...(el.points[0] || {}), x: opp.x - side, y: opp.y - side };
          el.points[1] = { ...(el.points[1] || {}), x: opp.x, y: opp.y - side };
          el.points[2] = { ...(el.points[2] || {}), x: opp.x, y: opp.y };
          el.points[3] = { ...(el.points[3] || {}), x: opp.x - side, y: opp.y };
        } else if (h.index === 1) {
          el.points[0] = { ...(el.points[0] || {}), x: opp.x, y: opp.y - side };
          el.points[1] = { ...(el.points[1] || {}), x: opp.x + side, y: opp.y - side };
          el.points[2] = { ...(el.points[2] || {}), x: opp.x + side, y: opp.y };
          el.points[3] = { ...(el.points[3] || {}), x: opp.x, y: opp.y };
        } else if (h.index === 2) {
          el.points[0] = { ...(el.points[0] || {}), x: opp.x, y: opp.y };
          el.points[1] = { ...(el.points[1] || {}), x: opp.x + side, y: opp.y };
          el.points[2] = { ...(el.points[2] || {}), x: opp.x + side, y: opp.y + side };
          el.points[3] = { ...(el.points[3] || {}), x: opp.x, y: opp.y + side };
        } else if (h.index === 3) {
          el.points[0] = { ...(el.points[0] || {}), x: opp.x - side, y: opp.y };
          el.points[1] = { ...(el.points[1] || {}), x: opp.x, y: opp.y };
          el.points[2] = { ...(el.points[2] || {}), x: opp.x, y: opp.y + side };
          el.points[3] = { ...(el.points[3] || {}), x: opp.x - side, y: opp.y + side };
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
          el.points[0] = { ...(el.points[0] || {}), x: cx, y: cy - ry };
          el.points[2] = { ...(el.points[2] || {}), x: cx, y: cy + ry };
        } else {
          const rx = Math.max(5, Math.abs(target.x - cx));
          el.points[1] = { ...(el.points[1] || {}), x: cx + rx, y: cy };
          el.points[3] = { ...(el.points[3] || {}), x: cx - rx, y: cy };
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
        el.points[idx] = { ...(el.points[idx] || {}), x: target.x, y: target.y };
        if (idx === 0) {
          el.points[2] = { ...(el.points[2] || {}), x: el.points[1].x + el.points[3].x - target.x, y: el.points[1].y + el.points[3].y - target.y };
        } else if (idx === 1) {
          el.points[3] = { ...(el.points[3] || {}), x: el.points[0].x + el.points[2].x - target.x, y: el.points[0].y + el.points[2].y - target.y };
        } else if (idx === 2) {
          el.points[0] = { ...(el.points[0] || {}), x: el.points[1].x + el.points[3].x - target.x, y: el.points[1].y + el.points[3].y - target.y };
        } else if (idx === 3) {
          el.points[1] = { ...(el.points[1] || {}), x: el.points[0].x + el.points[2].x - target.x, y: el.points[0].y + el.points[2].y - target.y };
        }
        const xs = el.points.map(p => p.x);
        const ys = el.points.map(p => p.y);
        el.start = { x: Math.min(...xs), y: Math.min(...ys) };
        el.end = { x: Math.max(...xs), y: Math.max(...ys) };
        state.hoverSnapPoint = snap ? { x: snap.x, y: snap.y, label: snap.label } : null;
      } else if (isSolidShape(el.shape)) {
        const snap = findSnapTargetForHandle(point, el, h, 24);
        const target = snap ? { x: snap.x, y: snap.y } : { x: point.x, y: point.y };
        handleSolidShapeDrag(el, h, target);
        state.hoverSnapPoint = snap ? { x: snap.x, y: snap.y, label: snap.label } : null;
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
          if (el.radius !== undefined) {
            el.radius = Math.max(5, Math.hypot(point.x - el.start.x, point.y - el.start.y));
          }
        } else if (h.id === 'center') {
          const dx = point.x - el.start.x;
          const dy = point.y - el.start.y;
          translateElement(el, dx, dy);
        }
      } else if (el.shape === 'two-tangents') {
        if (h.id === 'ext_point') {
          // Di chuyển điểm ngoài M (tiếp tuyến xoay theo M)
          el.end = { x: point.x, y: point.y };
          const cx = el.start.x, cy = el.start.y;
          const r = el.radius || Math.max(18, Math.hypot(el.end.x - cx, el.end.y - cy) * 0.48);
          const d = Math.hypot(el.end.x - cx, el.end.y - cy);
          if (d > r + 1) {
            const baseAngle = Math.atan2(el.end.y - cy, el.end.x - cx);
            const alpha = Math.acos(Math.min(1, Math.max(-1, r / d)));
            const a1 = baseAngle + alpha;
            const a2 = baseAngle - alpha;
            el.tangentPoint1 = { x: cx + r * Math.cos(a1), y: cy + r * Math.sin(a1) };
            el.tangentPoint2 = { x: cx + r * Math.cos(a2), y: cy + r * Math.sin(a2) };
          }
          if (el.binding && el.binding.type === 'two_tangents') {
            el.binding.offset = { dx: el.end.x - cx, dy: el.end.y - cy };
            if (el.binding.pointElId) {
              const ptEl = findElementById(el.binding.pointElId);
              if (ptEl && ptEl.shape === 'point') {
                ptEl.start = { x: el.end.x, y: el.end.y };
                ptEl.end = { x: el.end.x, y: el.end.y };
                updateDependentBindings(ptEl);
              }
            }
          }
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
      } else if (el.shape === 'tangent' && h.id === 'start' && el.binding && el.binding.type === 'circle_tangent' && !el.binding.onCircle) {
        const snap = findSnapTargetForHandle(point, el, h, 20);
        const targetPt = snap ? { x: snap.x, y: snap.y } : { x: point.x, y: point.y };
        state.hoverSnapPoint = snap ? { x: snap.x, y: snap.y, label: snap.label } : null;
        const circle = findElementById(el.binding.parentId);
        if (circle && circle.start) {
          el.binding.offset = { dx: targetPt.x - circle.start.x, dy: targetPt.y - circle.start.y };
          if (el.binding.pointElId) {
            const ptEl = findElementById(el.binding.pointElId);
            if (ptEl) {
              if (ptEl.shape === 'point') {
                ptEl.start = { x: targetPt.x, y: targetPt.y };
                ptEl.end = { x: targetPt.x, y: targetPt.y };
              } else if (ptEl.points && el.binding.pointVertexIndex !== undefined && ptEl.points[el.binding.pointVertexIndex]) {
                ptEl.points[el.binding.pointVertexIndex].x = targetPt.x;
                ptEl.points[el.binding.pointVertexIndex].y = targetPt.y;
              }
              updateDependentBindings(ptEl);
            }
          }
          updateSingleBinding(el, circle);
        } else {
          el.start = { x: targetPt.x, y: targetPt.y };
        }
      } else if (el.shape === 'perpendicular' || el.shape === 'parallel' || el.shape === 'tangent' || el.shape === 'perpendicular-bisector') {
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
        } else if (el.binding && (el.binding.type === 'point_on_line' || el.binding.type === 'point_on_segment')) {
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
          const snap = findSnapTargetForHandle(point, el, h);
          const targetPt = snap ? { x: snap.x, y: snap.y } : { x: point.x, y: point.y };
          state.activeSnapTarget = snap || null;
          el.start = { x: targetPt.x, y: targetPt.y };
          el.end = { x: targetPt.x, y: targetPt.y };
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
      if (state.isAreaSelecting && state.areaSelectStart) {
        state.areaSelectCurrent = { x: point.x, y: point.y };
        setCanvasCursor('crosshair');
        renderPage();
        return;
      }

      const selectedList = state.selectedElements && state.selectedElements.length > 0
        ? state.selectedElements
        : (state.selectedElement ? [state.selectedElement] : []);

      if (state.isDrawing && selectedList.length > 0) {
        const dx = point.x - state.dragLast.x;
        const dy = point.y - state.dragLast.y;
        state.totalMoved.dx += dx;
        state.totalMoved.dy += dy;
        if (Math.hypot(state.totalMoved.dx, state.totalMoved.dy) > 3) {
          hideFloatingSelectionBar();
        }
        const movedSet = new Set();
        for (const el of selectedList) {
          translateElement(el, dx, dy, movedSet, selectedList);
        }
        for (const el of movedSet) {
          updateDependentBindings(el);
        }
        state.dragLast = { x: point.x, y: point.y };
        renderPage();
      } else {
        // 1. Ưu tiên 1A: Kiểm tra xem có đang hover trúng ĐIỂM hình học rời hay không
        const hoverPoint = findElementAt(point.x, point.y);
        const isPointEl = hoverPoint && hoverPoint.type === 'geo' && hoverPoint.shape === 'point';

        if (isPointEl) {
          setCanvasCursor(SHARP_ARROW_CURSOR);
          if (state.hoverPointTarget !== hoverPoint || state.hoverHandle !== null || state.hoverEdge !== null) {
            state.hoverPointTarget = hoverPoint;
            state.hoverHandle = null;
            state.hoverEdge = null;
            state.hoverElement = null;
            renderPage();
          }
          statusToolInfo.textContent = '🎯 Đang nhắm: Điểm - Nhấp để chọn riêng điểm (Chuột phải để đặt/đổi tên)';
          return;
        } else if (state.hoverPointTarget) {
          state.hoverPointTarget = null;
          renderPage();
        }

        // 2. Ưu tiên 1B: Kiểm tra xem có đang hover trúng ĐỈNH / ĐẦU MÚT (Handle) trong bán kính lõi 18px
        const hitHandle = findHandleAt(point.x, point.y, 18);
        if (hitHandle) {
          setCanvasCursor(SHARP_ARROW_CURSOR);
          const isSame = state.hoverHandle && state.hoverHandle.handle && state.hoverHandle.handle.id === hitHandle.handle.id && state.hoverHandle.element === hitHandle.element;
          if (!isSame || state.hoverEdge !== null) {
            state.hoverHandle = hitHandle;
            state.hoverEdge = null;
            state.hoverElement = null;
            renderPage();
          }
          statusToolInfo.textContent = `🎯 Đang nhắm: ${hitHandle.handle.name} - Nhấp chọn riêng đỉnh, kéo để chỉnh, Chuột phải để đặt/đổi tên`;
          return;
        } else if (state.hoverHandle) {
          state.hoverHandle = null;
          renderPage();
        }

        // 3. Ưu tiên 2: Kiểm tra xem có đang hover trúng CẠNH / ĐOẠN THẲNG (ngoài vùng lõi đỉnh 18px)
        const hitEdge = findEdgeAt(point.x, point.y, 20);
        if (hitEdge) {
          setCanvasCursor(SHARP_ARROW_CURSOR);
          const isSameEdge =
            state.hoverEdge &&
            state.hoverEdge.element === hitEdge.element &&
            state.hoverEdge.v1Index === hitEdge.v1Index &&
            state.hoverEdge.v2Index === hitEdge.v2Index;
          if (!isSameEdge || state.hoverElement !== null) {
            state.hoverEdge = hitEdge;
            state.hoverElement = null;
            renderPage();
          }
          statusToolInfo.textContent = '🎯 Đang nhắm: Cạnh / Đoạn thẳng - Nhấp để chọn riêng cạnh, Chuột phải để đổi nét đứt/liền, đổi màu, đặt tên';
          return;
        } else if (state.hoverEdge) {
          state.hoverEdge = null;
          renderPage();
        }

        // 4. Nếu không trúng Đỉnh và không trúng Cạnh, kiểm tra hover vào thân đối tượng khác (văn bản, ảnh, đường tròn...)
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

        if ((state.pendingConstruction === 'perpendicular-bisector' || state.activeGeo === 'perpendicular-bisector' || state.pendingConstruction === 'point-symmetry' || state.activeGeo === 'point-symmetry') && state.construction && state.construction.point) {
          const oldX = state.constructionHoverPoint ? state.constructionHoverPoint.x : null;
          const oldY = state.constructionHoverPoint ? state.constructionHoverPoint.y : null;
          if (oldX !== point.x || oldY !== point.y) {
            state.constructionHoverPoint = { x: point.x, y: point.y };
            renderPage();
          }
        }

        if ((state.pendingConstruction === 'axis-symmetry' || state.activeGeo === 'axis-symmetry') && state.construction) {
          if (state.construction.point) {
            let edge = findEdgeAt(point.x, point.y, 25);
            if (!edge) {
              const directEl = findElementAt(point.x, point.y);
              if (directEl && directEl.type === 'geo' && directEl.shape !== 'point') {
                edge = getLineOrEdgeFromElement(directEl, point);
              }
            }
            if (state.constructionHoverEdge !== edge) {
              state.constructionHoverEdge = edge;
              renderPage();
            }
          } else if (state.construction.line) {
            const oldX = state.constructionHoverPoint ? state.constructionHoverPoint.x : null;
            const oldY = state.constructionHoverPoint ? state.constructionHoverPoint.y : null;
            if (oldX !== point.x || oldY !== point.y) {
              state.constructionHoverPoint = { x: point.x, y: point.y };
              renderPage();
            }
          }
        }

        if ((state.pendingConstruction === 'circumcircle' || state.activeGeo === 'circumcircle' || state.pendingConstruction === 'incircle' || state.activeGeo === 'incircle') && state.construction) {
          const oldX = state.constructionHoverPoint ? state.constructionHoverPoint.x : null;
          const oldY = state.constructionHoverPoint ? state.constructionHoverPoint.y : null;
          if (oldX !== point.x || oldY !== point.y) {
            state.constructionHoverPoint = { x: point.x, y: point.y };
            renderPage();
          }
        }
      }
      return;
    }

    // Kiểm tra hover bắt dính hoặc hiển thị đầu tẩy khi chưa kéo vẽ
    if (!state.isDrawing) {
      if (state.activeTool === 'eraser') {
        state.eraserCursorPoint = { x: point.x, y: point.y };
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
        const interSnap = findIntersectionSnapAtPoint(point, 24);
        let snapCoord = null;
        let hoverElements = null;

        if (interSnap) {
          snapCoord = { x: interSnap.x, y: interSnap.y, label: 'Giao điểm', interSnap };
          hoverElements = [interSnap.elementA, interSnap.elementB];
        } else {
          const hoverPt = findPointAt(point.x, point.y, 18);
          const hoverCirc = !hoverPt ? checkCircleSnap(point) : null;
          const hoverEdge = (!hoverPt && !hoverCirc) ? findEdgeAt(point.x, point.y, 24) : null;

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
        }

        const oldCoord = state.hoverSnapPoint ? { x: state.hoverSnapPoint.x, y: state.hoverSnapPoint.y, label: state.hoverSnapPoint.label } : null;
        const newCoord = snapCoord ? { x: snapCoord.x, y: snapCoord.y, label: snapCoord.label } : null;
        const elementsChanged = JSON.stringify((state.hoverIntersectionElements || []).map(e => e.id)) !== JSON.stringify((hoverElements || []).map(e => e.id));

        if (JSON.stringify(oldCoord) !== JSON.stringify(newCoord) || elementsChanged) {
          state.hoverSnapPoint = snapCoord;
          state.hoverIntersectionElements = hoverElements;
          renderPage();
        }
        if (snapCoord) {
          if (snapCoord.interSnap) {
            statusToolInfo.textContent = `🎯 Đang nhắm: Giao điểm (Nhấp để tạo điểm gắn chặt với 2 hình)`;
          } else {
            statusToolInfo.textContent = `🎯 Đang nhắm: ${snapCoord.label} (Nhấp để tạo điểm gắn liền với hình)`;
          }
        } else {
          statusToolInfo.textContent = 'Điểm: Nhấp vào vị trí bất kỳ để tạo điểm (rê đến giao điểm, đường thẳng hoặc đường tròn để gắn liền)';
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
      const curRad = state.eraserRadius || 12;
      if (state.eraserMode === 'partial') {
        state.eraserCursorPoint = { x: point.x, y: point.y };
        const last = state.eraserLastPoint || point;
        const dist = Math.hypot(point.x - last.x, point.y - last.y);
        const stepDist = Math.max(3, curRad * 0.6);
        if (dist > stepDist) {
          const steps = Math.min(8, Math.ceil(dist / stepDist));
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
        const last = state.eraserLastPoint || point;
        const dist = Math.hypot(point.x - last.x, point.y - last.y);
        if (dist > 8) {
          const steps = Math.min(8, Math.ceil(dist / 8));
          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            eraseElementAt(last.x + t * (point.x - last.x), last.y + t * (point.y - last.y));
          }
        } else {
          eraseElementAt(point.x, point.y);
        }
        state.eraserLastPoint = { x: point.x, y: point.y };
      }
      return;
    } else if (state.activeTool === 'geo' && state.geoStartPoint) {
      if (state.activeGeo === 'perpendicular' || state.activeGeo === 'parallel' || state.activeGeo === 'bisector' || state.activeGeo === 'tangent' || state.activeGeo === 'point' || state.activeGeo === 'angle' || state.activeGeo === 'midpoint' || state.activeGeo === 'intersection' || state.activeGeo === 'perpendicular-bisector' || state.activeGeo === 'point-symmetry' || state.activeGeo === 'axis-symmetry' || state.activeGeo === 'circumcircle' || state.activeGeo === 'incircle') {
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
      const rawEvents = (typeof e.getCoalescedEvents === 'function')
        ? e.getCoalescedEvents()
        : [];
      const eventsToProcess = (rawEvents && rawEvents.length > 0) ? rawEvents : [e];

      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = state.color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (state.dashStyle === 'dashed') {
        ctx.setLineDash([10, 7]);
      } else {
        ctx.setLineDash([]);
      }

      for (let evIdx = 0; evIdx < eventsToProcess.length; evIdx++) {
        const ev = eventsToProcess[evIdx];
        const pt = getCanvasCoordinates(ev);
        const lastPt = state.currentPath.length > 0 ? state.currentPath[state.currentPath.length - 1] : null;

        if (lastPt) {
          const dx = pt.x - lastPt.x;
          const dy = pt.y - lastPt.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Khử rung tay: bỏ qua các điểm di chuyển quá bé (< 1.2px) trừ khi là điểm cuối của loạt event
          if (dist < 1.2 && evIdx < eventsToProcess.length - 1) {
            continue;
          }

          // Làm mượt lực nhấn & độ dày nét
          if (pt.pointerType === 'pen' && pt.pressure > 0) {
            state.lastSmoothedPressure = (state.lastSmoothedPressure * 0.65) + (pt.pressure * 0.35);
          } else {
            const dt = Math.max(1, (pt.time || Date.now()) - (lastPt.time || Date.now()));
            const velocity = dist / dt;
            const velocityFactor = Math.max(0.2, Math.min(1.0, 1.0 - (velocity - 0.5) * 0.25));
            state.lastSmoothedPressure = (state.lastSmoothedPressure * 0.7) + (velocityFactor * 0.3);
          }
        }

        // Bộ lọc động học Streamline Stabilizer (Luôn luôn Siêu siêu mượt khử sạch rung giật thời gian thực)
        const smoothingFactor = 0.36;
        if (state.streamlinePos) {
          state.streamlinePos.x += (pt.x - state.streamlinePos.x) * smoothingFactor;
          state.streamlinePos.y += (pt.y - state.streamlinePos.y) * smoothingFactor;
          pt.x = state.streamlinePos.x;
          pt.y = state.streamlinePos.y;
        } else {
          state.streamlinePos = { x: pt.x, y: pt.y };
        }

        pt.smoothedPressure = state.lastSmoothedPressure || 0.5;
        state.currentPath.push(pt);

        if (state.activeTool === 'highlighter') {
          ctx.globalAlpha = 0.35;
          ctx.lineWidth = state.strokeWidth * 3.5;
        } else {
          ctx.globalAlpha = 1.0;
          const prMid = lastPt ? (pt.smoothedPressure + lastPt.smoothedPressure) / 2 : pt.smoothedPressure;
          ctx.lineWidth = Math.max(1, state.strokeWidth * (0.6 + prMid * 0.8));
        }

        const len = state.currentPath.length;
        if (state.penSmoothing === 'normal') {
          // Chế độ tiêu chuẩn
          if (len >= 2) {
            ctx.beginPath();
            ctx.moveTo(state.currentPath[len - 2].x, state.currentPath[len - 2].y);
            ctx.lineTo(state.currentPath[len - 1].x, state.currentPath[len - 1].y);
            ctx.stroke();
          }
        } else {
          // Chế độ Siêu mượt (Mặc định): Quadratic Bezier qua trung điểm
          if (len === 2) {
            const mid = {
              x: (state.currentPath[0].x + state.currentPath[1].x) / 2,
              y: (state.currentPath[0].y + state.currentPath[1].y) / 2
            };
            ctx.beginPath();
            ctx.moveTo(state.currentPath[0].x, state.currentPath[0].y);
            ctx.lineTo(mid.x, mid.y);
            ctx.stroke();
          } else if (len >= 3) {
            const pPrev2 = state.currentPath[len - 3];
            const pPrev1 = state.currentPath[len - 2];
            const pCurr = state.currentPath[len - 1];

            const midPrev = {
              x: (pPrev2.x + pPrev1.x) / 2,
              y: (pPrev2.y + pPrev1.y) / 2
            };
            const midCurr = {
              x: (pPrev1.x + pCurr.x) / 2,
              y: (pPrev1.y + pCurr.y) / 2
            };

            ctx.beginPath();
            ctx.moveTo(midPrev.x, midPrev.y);
            ctx.quadraticCurveTo(pPrev1.x, pPrev1.y, midCurr.x, midCurr.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    }
  }

  function finishDrawing(e) {
    state.activePointerType = null;
    const targetCanvas = (e && (e.currentTarget || (e.target && e.target.closest('canvas')))) || getCanvasForPage(state.currentPage) || canvas;
    const pageNum = parseInt((targetCanvas && targetCanvas.dataset.page) || state.currentPage, 10);
    if (!isNaN(pageNum) && pageNum !== state.currentPage) {
      state.currentPage = pageNum;
    }
    if (targetCanvas) ctx = targetCanvas.getContext('2d');
    const point = getCanvasCoordinates(e);

    // Kết thúc quét vùng OCR
    if (state.activeTool === 'ocr') {
      if (state.isOcrScanning) {
        state.isOcrScanning = false;
        const start = state.ocrScanStart;
        const current = state.ocrScanCurrent;
        state.ocrScanStart = null;
        state.ocrScanCurrent = null;
        renderPage();

        if (start && current) {
          const minX = Math.min(start.x, current.x);
          const maxX = Math.max(start.x, current.x);
          const minY = Math.min(start.y, current.y);
          const maxY = Math.max(start.y, current.y);
          const w = maxX - minX;
          const h = maxY - minY;

          if (w >= 16 && h >= 16) {
            processOcrCropBox(minX, minY, w, h);
          } else {
            showPageToast('💡 Vui lòng kéo một vùng quét lớn hơn quanh phần chữ viết tay');
          }
        }
      }
      return;
    }

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
      const releasedHandle = state.activeHandle;
      state.lastRotateAngle = undefined;
      state.lastDragPoint = null;
      state.activeHandle = null;
      state.hoverHandle = null;
      state.hoverPointTarget = null;
      state.hoverSnapPoint = null;
      state.isDrawing = false;
      state.selectedEdge = null;
      if (releasedHandle && releasedHandle.handle && !releasedHandle.handle.isRotate2D && !releasedHandle.handle.isRotate3D && el) {
        state.selectedVertex = {
          element: el,
          vIndex: releasedHandle.handle.index,
          handleId: releasedHandle.handle.id,
          x: releasedHandle.handle.x,
          y: releasedHandle.handle.y,
          name: releasedHandle.handle.name || 'Đỉnh'
        };
      } else {
        state.selectedVertex = null;
      }
      if (state.activeTool === 'select') {
        setCanvasCursor(SHARP_ARROW_CURSOR);
        if (el) {
          state.isFromAreaSelect = false;
          setSelectedElements([el]);
          hideFloatingSelectionBar();
        }
      } else {
        canvas.style.cursor = 'default';
      }
      renderPage();
      return;
    }

    // Kết thúc di chuyển hoặc quét chọn vùng bằng Chọn đối tượng (hỗ trợ nhóm nhiều đối tượng)
    if (state.activeTool === 'select') {
      if (state.isAreaSelecting && state.areaSelectStart && state.areaSelectCurrent) {
        state.isAreaSelecting = false;
        const dx = Math.abs(state.areaSelectCurrent.x - state.areaSelectStart.x);
        const dy = Math.abs(state.areaSelectCurrent.y - state.areaSelectStart.y);
        if (dx > 6 || dy > 6) {
          const rect = {
            minX: Math.min(state.areaSelectStart.x, state.areaSelectCurrent.x),
            maxX: Math.max(state.areaSelectStart.x, state.areaSelectCurrent.x),
            minY: Math.min(state.areaSelectStart.y, state.areaSelectCurrent.y),
            maxY: Math.max(state.areaSelectStart.y, state.areaSelectCurrent.y)
          };
          const pageElements = state.pages[state.currentPage] || [];
          const matched = pageElements.filter(el => isElementInSelectionBox(el, rect));
          if (matched.length > 0) {
            state.isFromAreaSelect = true;
            setSelectedElements(matched);
            showFloatingSelectionBar(matched);
            showPageToast(`🎯 Đã chọn ${matched.length} đối tượng`);
          } else {
            state.isFromAreaSelect = false;
            setSelectedElements([]);
            hideFloatingSelectionBar();
          }
        } else {
          state.isFromAreaSelect = false;
          setSelectedElements([]);
          hideFloatingSelectionBar();
        }
        state.areaSelectStart = null;
        state.areaSelectCurrent = null;
        state.isDrawing = false;
        setCanvasCursor(SHARP_ARROW_CURSOR);
        renderPage();
        return;
      }

      const selectedList = state.selectedElements && state.selectedElements.length > 0
        ? state.selectedElements
        : (state.selectedElement ? [state.selectedElement] : []);

      if (selectedList.length > 0 && (Math.abs(state.totalMoved.dx) > 3 || Math.abs(state.totalMoved.dy) > 3)) {
        pushCommand({
          type: 'move-multiple',
          elements: [...selectedList],
          dx: state.totalMoved.dx,
          dy: state.totalMoved.dy
        });
        state.pendingSingleSelect = null;
        if (state.isFromAreaSelect) {
          showFloatingSelectionBar(selectedList);
        } else {
          hideFloatingSelectionBar();
        }
      } else if (state.pendingSingleSelect) {
        if (state.pendingSingleSelect.groupId && state.pendingSingleSelect.isManualGroup && !(e && e.altKey)) {
          const groupMembers = (state.pages[state.currentPage] || []).filter(item => item && item.groupId === state.pendingSingleSelect.groupId);
          if (groupMembers.length > 1) {
            state.isFromAreaSelect = true;
            setSelectedElements(groupMembers);
            showFloatingSelectionBar(groupMembers);
          } else {
            state.isFromAreaSelect = false;
            setSelectedElements([state.pendingSingleSelect]);
            hideFloatingSelectionBar();
          }
        } else {
          // Chỉ chọn đơn lẻ một đối tượng duy nhất theo yêu cầu (KHÔNG hiện thanh nổi)
          state.isFromAreaSelect = false;
          setSelectedElements([state.pendingSingleSelect]);
          hideFloatingSelectionBar();
        }
        state.pendingSingleSelect = null;
      } else if (selectedList.length > 0) {
        if (state.isFromAreaSelect || selectedList.length > 1) {
          showFloatingSelectionBar(selectedList);
        } else {
          hideFloatingSelectionBar();
        }
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
      if (state.activeGeo === 'perpendicular' || state.activeGeo === 'parallel' || state.activeGeo === 'bisector' || state.activeGeo === 'tangent' || state.activeGeo === 'point' || state.activeGeo === 'angle' || state.activeGeo === 'midpoint' || state.activeGeo === 'intersection' || state.activeGeo === 'perpendicular-bisector' || state.activeGeo === 'point-symmetry' || state.activeGeo === 'axis-symmetry' || state.activeGeo === 'circumcircle' || state.activeGeo === 'incircle') {
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
            endSnapBinding = { type: 'point', elementId: ptSnap.element.id, vIndex: ptSnap.vIndex, pointKey: ptSnap.pointKey };
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
        const cx = state.geoStartPoint.x, cy = state.geoStartPoint.y;
        const d = Math.hypot(finalEnd.x - cx, finalEnd.y - cy);
        const r = Math.max(35, Math.min(130, d * 0.45));
        newGeo.radius = r;
        if (d > r + 1) {
          const baseAngle = Math.atan2(finalEnd.y - cy, finalEnd.x - cx);
          const alpha = Math.acos(Math.min(1, Math.max(-1, r / d)));
          const a1 = baseAngle + alpha;
          const a2 = baseAngle - alpha;
          newGeo.tangentPoint1 = { x: cx + r * Math.cos(a1), y: cy + r * Math.sin(a1) };
          newGeo.tangentPoint2 = { x: cx + r * Math.cos(a2), y: cy + r * Math.sin(a2) };
        }
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
      const len = state.currentPath ? state.currentPath.length : 0;
      if (len >= 2 && state.penSmoothing !== 'normal') {
        // Nối mượt mà từ trung điểm cuối đến điểm kết thúc nhấc bút
        const pLast2 = state.currentPath[len - 2];
        const pLast1 = state.currentPath[len - 1];
        const midLast = {
          x: (pLast2.x + pLast1.x) / 2,
          y: (pLast2.y + pLast1.y) / 2
        };
        ctx.save();
        const dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.strokeStyle = state.color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (state.dashStyle === 'dashed') {
          ctx.setLineDash([10, 7]);
        } else {
          ctx.setLineDash([]);
        }
        if (state.activeTool === 'highlighter') {
          ctx.globalAlpha = 0.35;
          ctx.lineWidth = state.strokeWidth * 3.5;
        } else {
          ctx.globalAlpha = 1.0;
          const pr = (pLast1.smoothedPressure !== undefined && pLast1.smoothedPressure > 0) ? pLast1.smoothedPressure : ((pLast1.pressure !== undefined && pLast1.pressure > 0) ? pLast1.pressure : 0.5);
          ctx.lineWidth = Math.max(1, state.strokeWidth * (0.6 + pr * 0.8));
        }
        ctx.beginPath();
        ctx.moveTo(midLast.x, midLast.y);
        ctx.lineTo(pLast1.x, pLast1.y);
        ctx.stroke();
        ctx.restore();
      }

      if (len > 0) {
        let rawPoints = state.currentPath;
        let simplified = [];
        for (let i = 0; i < rawPoints.length; i++) {
          const pt = rawPoints[i];
          const pr = (pt.smoothedPressure !== undefined && pt.smoothedPressure > 0) ? pt.smoothedPressure : ((pt.pressure !== undefined && pt.pressure > 0) ? pt.pressure : 0.5);
          if (i === 0 || i === rawPoints.length - 1) {
            simplified.push({
              x: Math.round(pt.x * 10) / 10,
              y: Math.round(pt.y * 10) / 10,
              pr: Math.round(pr * 100) / 100
            });
          } else {
            const last = simplified[simplified.length - 1];
            if (Math.hypot(pt.x - last.x, pt.y - last.y) >= 0.8) {
              simplified.push({
                x: Math.round(pt.x * 10) / 10,
                y: Math.round(pt.y * 10) / 10,
                pr: Math.round(pr * 100) / 100
              });
            }
          }
        }
        let finalPoints = simplified;
        if (finalPoints.length >= 4) {
          finalPoints = chaikinSmooth(finalPoints, 1);
        }
        pushNewElement({
          type: 'stroke',
          tool: state.activeTool,
          points: finalPoints,
          color: state.color,
          width: state.strokeWidth,
          dash: state.dashStyle,
          smoothing: 'ultra'
        });
        if (typeof scheduleThumbnailUpdate === 'function') {
          scheduleThumbnailUpdate(pageNum);
        }
      }
      state.currentPath = [];
      state.streamlinePos = null;
      state.cachedCanvasRect = null;
      state.cachedCanvasTarget = null;
      // Tối ưu hóa cực đỉnh: Nét bút đã được vẽ mượt mà trực tiếp lên Canvas trong sự kiện di chuyển bút.
      // Không gọi renderPage() để xóa sạch Canvas và vẽ lại hàng nghìn nét cũ -> Tốc độ nhấc bút 0ms tức thì!
      return;
    }
    state.cachedCanvasRect = null;
    state.cachedCanvasTarget = null;
    renderPage(pageNum);
  }

  function handlePointerLeave(e) {
    state.cachedCanvasRect = null;
    state.cachedCanvasTarget = null;
    if (state.hoverPointTarget || state.hoverSnapPoint || state.eraserCursorPoint || state.hoverHandle || state.hoverElement || state.hoverIntersectionElements) {
      state.hoverPointTarget = null;
      state.hoverSnapPoint = null;
      state.hoverIntersectionElements = null;
      state.eraserCursorPoint = null;
      state.hoverHandle = null;
      state.hoverElement = null;
      renderPage(state.currentPage);
    }
  }

  // 5b. Hệ thống Đặt tên / Đổi tên Điểm, Đỉnh & Đường thẳng bằng Chuột phải (Right-Click Rename Popover)
  let renamePopoverEl = null;
  let activeRenameTarget = null;
  let alternateRenameTarget = null;

  function resolveNamingTargetFromHandle(el, handle) {
    if (!el || !handle) return null;
    if (el.shape === 'point') {
      return {
        category: 'point',
        kind: 'point-element',
        element: el,
        x: el.start.x,
        y: el.start.y,
        title: el.isMidpoint ? 'Trung điểm' : 'Điểm hình học'
      };
    }
    if (handle.index !== undefined && el.points && el.points[handle.index]) {
      const pt = el.points[handle.index];
      return {
        category: 'point',
        kind: 'polygon-vertex',
        element: el,
        vIndex: handle.index,
        x: pt.x,
        y: pt.y,
        title: isSolidShape(el.shape) ? 'Đỉnh khối HHKG' : 'Đỉnh hình học'
      };
    }
    if (el.shape === 'inscribed-triangle' && handle.index !== undefined) {
      return {
        category: 'point',
        kind: 'inscribed-vertex',
        element: el,
        vIndex: handle.index,
        x: handle.x,
        y: handle.y,
        title: 'Đỉnh tam giác nội tiếp'
      };
    }
    if (handle.id === 'center' && el.start) {
      return {
        category: 'point',
        kind: 'center-point',
        element: el,
        x: el.start.x,
        y: el.start.y,
        title: 'Tâm hình học'
      };
    }
    if (handle.id === 'start' && el.start) {
      return {
        category: 'point',
        kind: 'start-point',
        element: el,
        x: el.start.x,
        y: el.start.y,
        title: 'Đầu mút đường thẳng'
      };
    }
    if ((handle.id === 'end' || handle.id === 'external') && el.end) {
      return {
        category: 'point',
        kind: 'end-point',
        element: el,
        x: el.end.x,
        y: el.end.y,
        title: handle.id === 'external' ? 'Điểm ngoài đường tròn' : 'Đầu mút đường thẳng'
      };
    }
    if (handle.id === 'foot' && el.foot) {
      return {
        category: 'point',
        kind: 'foot-point',
        element: el,
        x: el.foot.x,
        y: el.foot.y,
        title: 'Chân đường vuông góc'
      };
    }
    if (handle.id === 'midpoint' && el.midpoint) {
      return {
        category: 'point',
        kind: 'midpoint-point',
        element: el,
        x: el.midpoint.x,
        y: el.midpoint.y,
        title: 'Trung điểm'
      };
    }
    if (handle.id === 'tangentPoint' && el.tangentPoint) {
      return {
        category: 'point',
        kind: 'tangent-point',
        element: el,
        x: el.tangentPoint.x,
        y: el.tangentPoint.y,
        title: 'Tiếp điểm'
      };
    }
    return null;
  }

  function resolveNamingTargetFromEdge(edgeHit) {
    if (!edgeHit || !edgeHit.element) return null;
    const el = edgeHit.element;
    const mx = (edgeHit.start.x + edgeHit.end.x) / 2;
    const my = (edgeHit.start.y + edgeHit.end.y) / 2;
    if (
      el.shape === 'line' ||
      el.shape === 'perpendicular' ||
      el.shape === 'parallel' ||
      el.shape === 'bisector' ||
      el.shape === 'tangent' ||
      el.shape === 'perpendicular-bisector'
    ) {
      return {
        category: 'line',
        kind: 'line-element',
        element: el,
        x: mx,
        y: my,
        title: 'Đường thẳng / Đoạn thẳng'
      };
    }
    if (isSolidShape(el.shape) && edgeHit.v1Index !== undefined && edgeHit.v2Index !== undefined) {
      const eKey = Math.min(edgeHit.v1Index, edgeHit.v2Index) + '_' + Math.max(edgeHit.v1Index, edgeHit.v2Index);
      return {
        category: 'line',
        kind: 'solid-edge',
        element: el,
        edgeKey: eKey,
        v1Index: edgeHit.v1Index,
        v2Index: edgeHit.v2Index,
        x: mx,
        y: my,
        title: 'Cạnh khối HHKG'
      };
    }
    if (el.points && el.points.length >= 3 && edgeHit.v1Index !== undefined) {
      return {
        category: 'line',
        kind: 'polygon-edge',
        element: el,
        edgeIndex: edgeHit.v1Index,
        x: mx,
        y: my,
        title: 'Cạnh đa giác'
      };
    }
    if (el.shape === 'inscribed-triangle' && edgeHit.v1Index !== undefined) {
      return {
        category: 'line',
        kind: 'inscribed-edge',
        element: el,
        edgeIndex: edgeHit.v1Index,
        x: mx,
        y: my,
        title: 'Cạnh tam giác nội tiếp'
      };
    }
    return {
      category: 'line',
      kind: 'line-element',
      element: el,
      x: mx,
      y: my,
      title: 'Đường thẳng / Cạnh'
    };
  }

  function resolveNamingTargetAt(x, y) {
    const list = state.pages[state.currentPage] || [];
    let bestPoint = null;
    let bestPointScore = Infinity;

    const considerPoint = (candidate, dist, priorityBonus = 0) => {
      const score = dist - priorityBonus;
      if (score < bestPointScore) {
        bestPointScore = score;
        bestPoint = { ...candidate, dist };
      }
    };

    for (let i = list.length - 1; i >= 0; i--) {
      const el = list[i];
      if (!el || el.type !== 'geo') continue;

      if (el.shape === 'point' && el.start) {
        const d = Math.hypot(x - el.start.x, y - el.start.y);
        if (d <= 26) {
          considerPoint({
            category: 'point',
            kind: 'point-element',
            element: el,
            x: el.start.x,
            y: el.start.y,
            title: el.isMidpoint ? 'Trung điểm' : 'Điểm hình học'
          }, d, 6);
        }
      } else if (el.points && el.points.length > 0) {
        for (let j = 0; j < el.points.length; j++) {
          const p = el.points[j];
          if (!p) continue;
          const d = Math.hypot(x - p.x, y - p.y);
          if (d <= 26) {
            considerPoint({
              category: 'point',
              kind: 'polygon-vertex',
              element: el,
              vIndex: j,
              x: p.x,
              y: p.y,
              title: isSolidShape(el.shape) ? 'Đỉnh khối HHKG' : 'Đỉnh hình học'
            }, d, 5);
          }
        }
      } else if (el.shape === 'inscribed-triangle' && el.start && el.end) {
        const r = Math.hypot(el.end.x - el.start.x, el.end.y - el.start.y);
        const angles = el.angles || [-Math.PI / 2, (5 * Math.PI) / 6, Math.PI / 6];
        for (let j = 0; j < 3; j++) {
          const vx = el.start.x + r * Math.cos(angles[j]);
          const vy = el.start.y + r * Math.sin(angles[j]);
          const d = Math.hypot(x - vx, y - vy);
          if (d <= 26) {
            considerPoint({
              category: 'point',
              kind: 'inscribed-vertex',
              element: el,
              vIndex: j,
              x: vx,
              y: vy,
              title: 'Đỉnh tam giác nội tiếp'
            }, d, 5);
          }
        }
        const dc = Math.hypot(x - el.start.x, y - el.start.y);
        if (dc <= 22) {
          considerPoint({
            category: 'point',
            kind: 'center-point',
            element: el,
            x: el.start.x,
            y: el.start.y,
            title: 'Tâm đường tròn ngoại tiếp'
          }, dc, 4);
        }
      } else if ((el.shape === 'circle' || el.shape === 'ellipse' || el.shape === 'two-tangents') && el.start) {
        const dc = Math.hypot(x - el.start.x, y - el.start.y);
        if (dc <= 24) {
          considerPoint({
            category: 'point',
            kind: 'center-point',
            element: el,
            x: el.start.x,
            y: el.start.y,
            title: el.shape === 'ellipse' ? 'Tâm Elip' : 'Tâm đường tròn'
          }, dc, 4);
        }
        if (el.shape === 'two-tangents' && el.end) {
          const de = Math.hypot(x - el.end.x, y - el.end.y);
          if (de <= 26) {
            considerPoint({
              category: 'point',
              kind: 'end-point',
              element: el,
              x: el.end.x,
              y: el.end.y,
              title: 'Điểm ngoài đường tròn'
            }, de, 5);
          }
        }
      } else if (
        el.shape === 'line' ||
        el.shape === 'perpendicular' ||
        el.shape === 'parallel' ||
        el.shape === 'bisector' ||
        el.shape === 'tangent' ||
        el.shape === 'perpendicular-bisector'
      ) {
        if (el.foot) {
          const df = Math.hypot(x - el.foot.x, y - el.foot.y);
          if (df <= 24) {
            considerPoint({
              category: 'point',
              kind: 'foot-point',
              element: el,
              x: el.foot.x,
              y: el.foot.y,
              title: 'Chân đường vuông góc'
            }, df, 4);
          }
        }
        if (el.midpoint) {
          const dm = Math.hypot(x - el.midpoint.x, y - el.midpoint.y);
          if (dm <= 24) {
            considerPoint({
              category: 'point',
              kind: 'midpoint-point',
              element: el,
              x: el.midpoint.x,
              y: el.midpoint.y,
              title: 'Trung điểm'
            }, dm, 4);
          }
        }
        if (el.tangentPoint) {
          const dt = Math.hypot(x - el.tangentPoint.x, y - el.tangentPoint.y);
          if (dt <= 24) {
            considerPoint({
              category: 'point',
              kind: 'tangent-point',
              element: el,
              x: el.tangentPoint.x,
              y: el.tangentPoint.y,
              title: 'Tiếp điểm'
            }, dt, 4);
          }
        }
        if (el.start) {
          const ds = Math.hypot(x - el.start.x, y - el.start.y);
          if (ds <= 22) {
            considerPoint({
              category: 'point',
              kind: 'start-point',
              element: el,
              x: el.start.x,
              y: el.start.y,
              title: 'Đầu mút đường thẳng'
            }, ds, 1);
          }
        }
        if (el.end) {
          const de = Math.hypot(x - el.end.x, y - el.end.y);
          if (de <= 22) {
            considerPoint({
              category: 'point',
              kind: 'end-point',
              element: el,
              x: el.end.x,
              y: el.end.y,
              title: 'Đầu mút đường thẳng'
            }, de, 1);
          }
        }
      }
    }

    let bestLine = null;
    const edgeHit = findEdgeAt(x, y, 24);
    if (edgeHit) {
      bestLine = resolveNamingTargetFromEdge(edgeHit);
      if (bestLine) {
        bestLine.dist = edgeHit.dist;
        bestLine.edgeHit = edgeHit;
      }
    } else {
      const circleHit = findCircleAt(x, y, 20);
      if (circleHit && circleHit.element) {
        bestLine = {
          category: 'line',
          kind: 'circle-element',
          element: circleHit.element,
          x: x,
          y: y,
          dist: circleHit.dist,
          title: 'Đường tròn'
        };
      }
    }

    if (bestPoint && bestLine) {
      const isBareEndpoint = bestPoint.kind === 'start-point' || bestPoint.kind === 'end-point';
      if (isBareEndpoint && bestPoint.dist > 10 && (bestLine.dist || 0) <= 10) {
        return { primaryTarget: bestLine, alternateTarget: bestPoint };
      }
      return { primaryTarget: bestPoint, alternateTarget: bestLine };
    }
    if (bestPoint) {
      return { primaryTarget: bestPoint, alternateTarget: null };
    }
    if (bestLine) {
      return { primaryTarget: bestLine, alternateTarget: null };
    }

    // Fallback: Nếu người dùng vừa bấm chọn 1 điểm/đỉnh hoặc đường thẳng ở bước Chọn trước đó rồi bấm chuột phải
    if (state.lastClickedNamingTarget && state.lastClickedNamingTarget.element && list.includes(state.lastClickedNamingTarget.element)) {
      const dLast = Math.hypot(x - (state.lastClickedNamingTarget.x || x), y - (state.lastClickedNamingTarget.y || y));
      if (dLast <= 90 || state.selectedElement === state.lastClickedNamingTarget.element) {
        return { primaryTarget: state.lastClickedNamingTarget, alternateTarget: null };
      }
    }
    if (state.selectedElement && list.includes(state.selectedElement)) {
      const sel = state.selectedElement;
      if (sel.type === 'geo' && sel.shape === 'point') {
        return {
          primaryTarget: {
            category: 'point',
            kind: 'point-element',
            element: sel,
            x: sel.start.x,
            y: sel.start.y,
            title: sel.isMidpoint ? 'Trung điểm' : 'Điểm hình học'
          },
          alternateTarget: null
        };
      }
      if (
        sel.type === 'geo' &&
        (sel.shape === 'line' || sel.shape === 'perpendicular' || sel.shape === 'parallel' || sel.shape === 'bisector' || sel.shape === 'tangent' || sel.shape === 'perpendicular-bisector')
      ) {
        return {
          primaryTarget: {
            category: 'line',
            kind: 'line-element',
            element: sel,
            x: (sel.start.x + sel.end.x) / 2,
            y: (sel.start.y + sel.end.y) / 2,
            title: 'Đường thẳng / Đoạn thẳng'
          },
          alternateTarget: null
        };
      }
    }

    return null;
  }

  function getTargetCurrentName(target) {
    if (!target || !target.element) return '';
    const el = target.element;
    switch (target.kind) {
      case 'point-element':
      case 'line-element':
      case 'circle-element':
        return el.name || '';
      case 'polygon-vertex':
        return (el.points && el.points[target.vIndex] && el.points[target.vIndex].name) || '';
      case 'inscribed-vertex':
        return (el.vertexNames && el.vertexNames[target.vIndex]) || '';
      case 'center-point':
        return el.centerName || '';
      case 'start-point':
        return el.startName || '';
      case 'end-point':
        return el.endName || '';
      case 'foot-point':
        return el.footName || '';
      case 'midpoint-point':
        return el.midpointName || '';
      case 'tangent-point':
        return el.tangentPointName || '';
      case 'polygon-edge':
      case 'inscribed-edge':
        return (el.edgeNames && (el.edgeNames[target.edgeIndex] || el.edgeNames['edge_' + target.edgeIndex])) || '';
      case 'solid-edge':
        return (el.edgeNames && el.edgeNames[target.edgeKey]) || '';
      default:
        return el.name || '';
    }
  }

  function applyNameToTarget(target, rawName, recordHistory = true) {
    if (!target || !target.element) return false;
    const el = target.element;
    const newName = (rawName !== undefined && rawName !== null) ? String(rawName).trim() : '';
    const prevName = getTargetCurrentName(target);
    if (prevName === newName) return false;

    const beforeSnapshot = recordHistory ? JSON.parse(JSON.stringify(el)) : null;

    switch (target.kind) {
      case 'point-element':
      case 'line-element':
      case 'circle-element':
        el.name = newName;
        break;
      case 'polygon-vertex':
        if (el.points && el.points[target.vIndex]) {
          el.points[target.vIndex].name = newName;
        }
        break;
      case 'inscribed-vertex':
        if (!el.vertexNames) el.vertexNames = {};
        el.vertexNames[target.vIndex] = newName;
        break;
      case 'center-point':
        el.centerName = newName;
        break;
      case 'start-point':
        el.startName = newName;
        break;
      case 'end-point':
        el.endName = newName;
        break;
      case 'foot-point':
        el.footName = newName;
        break;
      case 'midpoint-point':
        el.midpointName = newName;
        break;
      case 'tangent-point':
        el.tangentPointName = newName;
        break;
      case 'polygon-edge':
      case 'inscribed-edge':
        if (!el.edgeNames) el.edgeNames = {};
        el.edgeNames[target.edgeIndex] = newName;
        delete el.edgeNames['edge_' + target.edgeIndex];
        break;
      case 'solid-edge':
        if (!el.edgeNames) el.edgeNames = {};
        el.edgeNames[target.edgeKey] = newName;
        break;
      default:
        el.name = newName;
        break;
    }

    if (recordHistory && beforeSnapshot) {
      pushCommand({
        type: 'modify-element',
        element: el,
        before: beforeSnapshot,
        after: JSON.parse(JSON.stringify(el))
      });
    }

    renderPage();
    if (newName) {
      showPageToast(`🏷️ Đã ${prevName ? 'đổi tên thành' : 'đặt tên'} "${newName}"`);
    } else if (prevName) {
      showPageToast(`🗑️ Đã xóa tên "${prevName}"`);
    }
    return true;
  }

  function getTargetCurrentDash(target) {
    if (!target || !target.element) return 'solid';
    const el = target.element;
    if (target.kind === 'solid-edge') {
      if (el.edgeDashes && el.edgeDashes[target.edgeKey]) {
        return el.edgeDashes[target.edgeKey];
      }
      if (el.edges) {
        for (const edge of el.edges) {
          const eKey = Math.min(edge[0], edge[1]) + '_' + Math.max(edge[0], edge[1]);
          if (eKey === target.edgeKey) {
            return edge[2] === 'dashed' ? 'dashed' : 'solid';
          }
        }
      }
      return 'solid';
    }
    if (target.kind === 'polygon-edge' || target.kind === 'inscribed-edge') {
      if (el.edgeDashes && el.edgeDashes[target.edgeIndex]) {
        return el.edgeDashes[target.edgeIndex];
      }
      return el.dash === 'dashed' ? 'dashed' : 'solid';
    }
    return el.dash === 'dashed' ? 'dashed' : 'solid';
  }

  function applyDashToTarget(target, newDash, recordHistory = true) {
    if (!target || !target.element) return false;
    const dashVal = newDash === 'dashed' ? 'dashed' : 'solid';
    const prevDash = getTargetCurrentDash(target);
    if (prevDash === dashVal) return false;

    const el = target.element;
    const beforeSnapshot = recordHistory ? JSON.parse(JSON.stringify(el)) : null;

    if (target.kind === 'solid-edge') {
      if (!el.edgeDashes) el.edgeDashes = {};
      el.edgeDashes[target.edgeKey] = dashVal;
      if (el.edges) {
        for (const edge of el.edges) {
          const eKey = Math.min(edge[0], edge[1]) + '_' + Math.max(edge[0], edge[1]);
          if (eKey === target.edgeKey) {
            edge[2] = dashVal;
          }
        }
      }
    } else if (target.kind === 'polygon-edge' || target.kind === 'inscribed-edge') {
      if (!el.edgeDashes) el.edgeDashes = {};
      el.edgeDashes[target.edgeIndex] = dashVal;
    } else {
      el.dash = dashVal;
    }

    if (recordHistory && beforeSnapshot) {
      pushCommand({
        type: 'modify-element',
        element: el,
        before: beforeSnapshot,
        after: JSON.parse(JSON.stringify(el))
      });
    }

    renderPage();
    showPageToast(dashVal === 'dashed' ? '╌╌ Đã chuyển đoạn thẳng sang Nét đứt' : '━━ Đã chuyển đoạn thẳng sang Nét liền');
    return true;
  }

  function getTargetCurrentColor(target) {
    if (!target || !target.element) return state.color || '#30493c';
    const el = target.element;
    if (target.kind === 'solid-edge') {
      return (el.edgeColors && el.edgeColors[target.edgeKey]) || el.color || state.color || '#184e3a';
    }
    if (target.kind === 'polygon-edge' || target.kind === 'inscribed-edge') {
      return (el.edgeColors && el.edgeColors[target.edgeIndex]) || el.color || state.color || '#30493c';
    }
    return el.color || state.color || '#30493c';
  }

  function applyColorToTarget(target, newColor, recordHistory = true) {
    if (!target || !target.element || !newColor) return false;
    const colorVal = String(newColor).trim();
    const prevColor = getTargetCurrentColor(target);
    if (prevColor && prevColor.toLowerCase() === colorVal.toLowerCase()) return false;

    const el = target.element;
    const beforeSnapshot = recordHistory ? JSON.parse(JSON.stringify(el)) : null;

    if (target.kind === 'solid-edge') {
      if (!el.edgeColors) el.edgeColors = {};
      el.edgeColors[target.edgeKey] = colorVal;
    } else if (target.kind === 'polygon-edge' || target.kind === 'inscribed-edge') {
      if (!el.edgeColors) el.edgeColors = {};
      el.edgeColors[target.edgeIndex] = colorVal;
    } else {
      el.color = colorVal;
    }

    if (recordHistory && beforeSnapshot) {
      pushCommand({
        type: 'modify-element',
        element: el,
        before: beforeSnapshot,
        after: JSON.parse(JSON.stringify(el))
      });
    }

    renderPage();
    showPageToast('🎨 Đã đổi màu thành công');
    return true;
  }

  function closeRenamePopover() {
    if (renamePopoverEl) {
      renamePopoverEl.remove();
      renamePopoverEl = null;
    }
    activeRenameTarget = null;
    alternateRenameTarget = null;
  }

  function openRenamePopover(resolved, clientX, clientY) {
    closeRenamePopover();
    if (!resolved || !resolved.primaryTarget) return;

    activeRenameTarget = resolved.primaryTarget;
    alternateRenameTarget = resolved.alternateTarget || null;

    const currentName = getTargetCurrentName(activeRenameTarget);
    const isPoint = activeRenameTarget.category === 'point';
    const isLine = activeRenameTarget.category === 'line';
    const actionLabel = currentName ? 'Đổi tên' : 'Đặt tên';
    const targetBadge = isPoint ? `📍 ${activeRenameTarget.title || 'Điểm / Đỉnh'}` : `📏 ${activeRenameTarget.title || 'Đoạn thẳng / Cạnh'}`;
    const quickChips = isPoint
      ? ['A', 'B', 'C', 'D', 'S', 'M', 'N', 'H', 'I', 'O', "A'", "B'", "C'"]
      : ['d', 'd₁', 'd₂', 'Δ', 'a', 'b', 'c', 'h', 'l', 'R'];

    const currentDash = isLine ? getTargetCurrentDash(activeRenameTarget) : 'solid';
    const currentColor = getTargetCurrentColor(activeRenameTarget);
    const quickColors = [
      { hex: '#30493c', title: 'Xanh rừng' },
      { hex: '#111827', title: 'Đen' },
      { hex: '#dc2626', title: 'Đỏ' },
      { hex: '#2563eb', title: 'Xanh dương' },
      { hex: '#d97706', title: 'Cam đậm' },
      { hex: '#7c3aed', title: 'Tím' },
      { hex: '#0891b2', title: 'Xanh ngọc' },
      { hex: '#db2777', title: 'Hồng đậm' }
    ];

    const pop = document.createElement('div');
    pop.className = 'net-rename-popover';
    pop.addEventListener('pointerdown', (ev) => ev.stopPropagation());
    pop.addEventListener('contextmenu', (ev) => ev.preventDefault());

    let switchBtnHtml = '';
    if (alternateRenameTarget) {
      const altIsPoint = alternateRenameTarget.category === 'point';
      const altLabel = altIsPoint ? '📍 Chọn Đỉnh/Điểm' : '📏 Chọn Đoạn/Cạnh';
      switchBtnHtml = `<button type="button" class="net-rename-switch-btn" id="btn-rename-switch" title="Chuyển sang thao tác cho ${alternateRenameTarget.title}">${altLabel}</button>`;
    }

    let lineStyleSectionHtml = '';
    if (isLine) {
      lineStyleSectionHtml = `
        <div class="net-rename-divider"></div>
        <div class="net-rename-style-row">
          <span class="net-rename-sublabel">Kiểu nét:</span>
          <div class="net-rename-dash-group">
            <button type="button" class="net-rename-dash-btn${currentDash === 'solid' ? ' active' : ''}" data-dash="solid" id="btn-net-dash-solid">
              <span class="dash-preview solid"></span> Nét liền
            </button>
            <button type="button" class="net-rename-dash-btn${currentDash === 'dashed' ? ' active' : ''}" data-dash="dashed" id="btn-net-dash-dashed">
              <span class="dash-preview dashed"></span> Nét đứt
            </button>
          </div>
        </div>
        <div class="net-rename-style-row">
          <span class="net-rename-sublabel">Màu sắc:</span>
          <div class="net-rename-color-group">
            ${quickColors.map(c => `<button type="button" class="net-rename-color-dot${currentColor.toLowerCase() === c.hex.toLowerCase() ? ' active' : ''}" data-color="${c.hex}" title="${c.title}" style="background:${c.hex};"></button>`).join('')}
            <label class="net-rename-color-custom" title="Chọn màu tùy chỉnh">
              <input type="color" id="input-net-custom-color" value="${currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#30493c'}" />
              <span>🎨</span>
            </label>
          </div>
        </div>
      `;
    }

    pop.innerHTML = `
      <div class="net-rename-header">
        <span class="net-rename-title">${actionLabel}: <strong>${targetBadge}</strong></span>
        ${switchBtnHtml}
      </div>
      <div class="net-rename-input-row">
        <input type="text" id="input-net-rename" class="net-rename-input" maxlength="16" placeholder="${isPoint ? 'VD: A, S, M, O...' : 'VD: d, Δ, a, h...'}" value="${currentName.replace(/"/g, '&quot;')}" autocomplete="off" spellcheck="false" />
        <button type="button" id="btn-net-rename-save" class="net-rename-btn primary">${actionLabel}</button>
      </div>
      <div class="net-rename-chips" id="net-rename-chips">
        ${quickChips.map(ch => `<button type="button" class="net-rename-chip${currentName === ch ? ' active' : ''}" data-chip="${ch}">${ch}</button>`).join('')}
      </div>
      ${lineStyleSectionHtml}
      <div class="net-rename-footer">
        ${currentName ? '<button type="button" id="btn-net-rename-clear" class="net-rename-btn danger">Xóa tên</button>' : '<span class="net-rename-hint">Nhấn Enter để lưu · Esc để đóng</span>'}
        <button type="button" id="btn-net-rename-cancel" class="net-rename-btn ghost">Đóng</button>
      </div>
    `;

    document.body.appendChild(pop);
    renamePopoverEl = pop;

    const vw = window.innerWidth || 1024;
    const vh = window.innerHeight || 768;
    const popWidth = 304;
    const popHeight = isLine ? 256 : 168;
    const left = Math.max(12, Math.min(vw - popWidth - 12, (clientX || 240) + 6));
    const top = Math.max(12, Math.min(vh - popHeight - 12, (clientY || 180) + 6));
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;

    const inputEl = pop.querySelector('#input-net-rename');
    const saveBtn = pop.querySelector('#btn-net-rename-save');
    const clearBtn = pop.querySelector('#btn-net-rename-clear');
    const cancelBtn = pop.querySelector('#btn-net-rename-cancel');
    const switchBtn = pop.querySelector('#btn-rename-switch');
    const customColorInputEl = pop.querySelector('#input-net-custom-color');

    const commitRename = (val) => {
      applyNameToTarget(activeRenameTarget, val, true);
      closeRenamePopover();
    };

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        commitRename(inputEl ? inputEl.value : '');
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        commitRename('');
      });
    }
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        closeRenamePopover();
      });
    }
    if (switchBtn) {
      switchBtn.addEventListener('click', () => {
        openRenamePopover(
          { primaryTarget: alternateRenameTarget, alternateTarget: activeRenameTarget },
          left - 6,
          top - 6
        );
      });
    }

    pop.querySelectorAll('.net-rename-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const chipVal = btn.getAttribute('data-chip') || '';
        commitRename(chipVal);
      });
    });

    // Xử lý đổi Nét liền / Nét đứt ngay lập tức khi bấm chuột phải vào đoạn thẳng
    pop.querySelectorAll('.net-rename-dash-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dashVal = btn.getAttribute('data-dash') || 'solid';
        applyDashToTarget(activeRenameTarget, dashVal, true);
        pop.querySelectorAll('.net-rename-dash-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-dash') === dashVal);
        });
      });
    });

    // Xử lý đổi màu đoạn thẳng ngay lập tức khi bấm vào chấm màu
    pop.querySelectorAll('.net-rename-color-dot').forEach(btn => {
      btn.addEventListener('click', () => {
        const colorVal = btn.getAttribute('data-color') || '#30493c';
        applyColorToTarget(activeRenameTarget, colorVal, true);
        pop.querySelectorAll('.net-rename-color-dot').forEach(b => {
          b.classList.toggle('active', (b.getAttribute('data-color') || '').toLowerCase() === colorVal.toLowerCase());
        });
        if (customColorInputEl) customColorInputEl.value = colorVal;
      });
    });

    if (customColorInputEl) {
      customColorInputEl.addEventListener('input', (ev) => {
        const colorVal = ev.target.value;
        if (colorVal) {
          applyColorToTarget(activeRenameTarget, colorVal, true);
          pop.querySelectorAll('.net-rename-color-dot').forEach(b => {
            b.classList.toggle('active', (b.getAttribute('data-color') || '').toLowerCase() === colorVal.toLowerCase());
          });
        }
      });
    }

    if (inputEl) {
      inputEl.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          commitRename(inputEl.value);
        } else if (ev.key === 'Escape') {
          ev.preventDefault();
          closeRenamePopover();
        }
      });
      // Chỉ tự động focus bàn phím trên máy tính chuột vật lý; không tự nhảy bàn phím ảo trên iPad/máy tính bảng
      const isTouchDevice = (typeof window !== 'undefined') && (
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
        ('ontouchstart' in window) ||
        (navigator && navigator.maxTouchPoints > 0)
      );
      if (!isTouchDevice) {
        setTimeout(() => {
          inputEl.focus();
          inputEl.select();
        }, 10);
      }
    }
  }

  function handleCanvasContextMenu(e) {
    if (!e) return;
    e.preventDefault();

    // 1. Tuyệt đối không mở hộp đặt tên khi đang viết vẽ (Bút, Dạ quang, Tẩy...) hoặc đang đặt bút vẽ dở
    if (state.isDrawing || state.activeTool === 'pen' || state.activeTool === 'highlighter' || state.activeTool === 'eraser' || state.activeTool !== 'select') {
      return;
    }
    const targetCanvas = (e.currentTarget || (e.target && e.target.closest && e.target.closest('canvas'))) || getCanvasForPage(state.currentPage) || canvas;
    const pageNum = parseInt((targetCanvas && targetCanvas.dataset && targetCanvas.dataset.page) || state.currentPage, 10);
    if (!isNaN(pageNum) && pageNum !== state.currentPage) {
      state.currentPage = pageNum;
      updatePageTabsActive(pageNum, false);
    }
    state.activeCanvas = targetCanvas;
    const point = getCanvasCoordinates(e);

    // Cho phép bấm chuột phải đặt tên / đổi tên ngay trong chế độ Chọn (hoặc bất kỳ lúc nào bấm chuột phải trúng điểm/đường)
    const resolved = resolveNamingTargetAt(point.x, point.y);
    if (resolved && resolved.primaryTarget) {
      const ptTarget = resolved.primaryTarget;
      if (ptTarget.element) {
        state.isFromAreaSelect = false;
        hideFloatingSelectionBar();
        setSelectedElements([ptTarget.element]);
        if (ptTarget.category === 'point') {
          state.selectedVertex = {
            element: ptTarget.element,
            vIndex: ptTarget.vIndex,
            handleId: ptTarget.kind === 'center-point' ? 'center'
              : ptTarget.kind === 'start-point' ? 'start'
              : ptTarget.kind === 'end-point' ? 'end'
              : ptTarget.kind === 'foot-point' ? 'foot'
              : ptTarget.kind === 'midpoint-point' ? 'midpoint'
              : ptTarget.kind === 'tangent-point' ? 'tangentPoint'
              : undefined,
            x: ptTarget.x,
            y: ptTarget.y,
            name: ptTarget.title || 'Đỉnh'
          };
          state.selectedEdge = null;
        } else if (ptTarget.category === 'line') {
          if (ptTarget.edgeHit) {
            state.selectedEdge = ptTarget.edgeHit;
          } else {
            const hitE = findEdgeAt(point.x, point.y, 26);
            if (hitE && hitE.element === ptTarget.element) {
              state.selectedEdge = hitE;
            }
          }
          state.selectedVertex = null;
        }
        renderPage();
      }
      openRenamePopover(resolved, e.clientX, e.clientY);
    } else {
      closeRenamePopover();
      if (state.activeTool === 'select') {
        showPageToast('💡 Bấm chuột phải vào Điểm, Đỉnh hoặc Đường thẳng/Cạnh để Đặt tên / Đổi tên');
      }
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
    targetCanvas.addEventListener('contextmenu', handleCanvasContextMenu);
    targetCanvas.addEventListener('dblclick', (e) => {
      const point = getCanvasCoordinates(e);
      const el = findElementAt(point.x, point.y);
      if (el && el.type === 'text') {
        openInlineTextEditor(el.x, el.y, el);
        return;
      }
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
        return;
      }
      if (el && state.activeTool === 'select') {
        if (el.isManualGroup && state.selectedElements && state.selectedElements.length > 1) {
          // Nhấp đúp vào 1 đối tượng thuộc Nhóm thủ công -> Chọn sâu riêng đối tượng con đó để tinh chỉnh
          state.isFromAreaSelect = false;
          setSelectedElements([el]);
          hideFloatingSelectionBar();
          renderPage();
          showPageToast('🎯 Đã chọn riêng đối tượng trong nhóm');
          return;
        }
        const connectedGroup = getGroupElements(el);
        if (connectedGroup.length > 1) {
          // Nhấp đúp vào đối tượng trong cụm hình liên kết tự động -> Chọn toàn bộ cụm hình và hiện thanh tác vụ nổi
          state.isFromAreaSelect = true;
          setSelectedElements(connectedGroup);
          showFloatingSelectionBar(connectedGroup);
          renderPage();
          showPageToast(`🔗 Đã chọn cả cụm liên kết (${connectedGroup.length} đối tượng)`);
        }
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
      if (el.isPdfPage) return; // Bảo vệ trang PDF nền không bị tẩy xóa
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
          // Chỉ làm mịn cục bộ các phân đoạn cắt ngang vòng tròn tẩy (Localized Sub-segment Interpolation)
          // Giúp vết cắt tẩy chuẩn xác tuyệt đối nhưng không làm phình to số lượng điểm của toàn bộ nét
          const densePoints = [];
          const stepSize = Math.max(1.2, Math.min(2.5, radius / 5));
          for (let j = 0; j < el.points.length; j++) {
            const p1 = el.points[j];
            densePoints.push(p1);
            if (j < el.points.length - 1) {
              const p2 = el.points[j + 1];
              // Chỉ làm mịn đoạn nếu đoạn đó nằm trong hoặc giao thoa với vòng tròn tẩy
              if (distToSegment(x, y, p1.x, p1.y, p2.x, p2.y) <= radius + 2) {
                const segLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);
                if (segLen > stepSize) {
                  const steps = Math.min(12, Math.ceil(segLen / stepSize));
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
          }

          // Phân tách các điểm còn nằm ngoài bán kính tẩy thành các nét con
          const subStrokes = [];
          let currentRun = [];
          const createSubStroke = (pts) => {
            if (pts.length < 2) return null;
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            for (let k = 0; k < pts.length; k++) {
              const pt = pts[k];
              if (pt.x < minX) minX = pt.x;
              if (pt.x > maxX) maxX = pt.x;
              if (pt.y < minY) minY = pt.y;
              if (pt.y > maxY) maxY = pt.y;
            }
            return {
              type: 'stroke',
              tool: el.tool,
              points: pts,
              color: el.color,
              width: el.width,
              dash: el.dash,
              _bbox: { minX, maxX, minY, maxY }
            };
          };

          for (let j = 0; j < densePoints.length; j++) {
            const pt = densePoints[j];
            if (Math.hypot(pt.x - x, pt.y - y) > radius) {
              currentRun.push(pt);
            } else {
              const s = createSubStroke(currentRun);
              if (s) subStrokes.push(s);
              currentRun = [];
            }
          }
          const lastS = createSubStroke(currentRun);
          if (lastS) subStrokes.push(lastS);

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
      } else if (el.type === 'geo' && (el.shape === 'line' || el.shape === 'perpendicular' || el.shape === 'parallel' || el.shape === 'bisector' || el.shape === 'tangent' || el.shape === 'perpendicular-bisector')) {
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
    if (state.undoStacks[page].length > 60) {
      state.undoStacks[page].shift();
    }
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
      } else if (cmd.type === 'add-multiple') {
        for (const el of cmd.elements) {
          const idx = elements.indexOf(el);
          if (idx !== -1) elements.splice(idx, 1);
          if (state.selectedElements) {
            const sIdx = state.selectedElements.indexOf(el);
            if (sIdx !== -1) state.selectedElements.splice(sIdx, 1);
          }
        }
        if (state.selectedElement && cmd.elements.includes(state.selectedElement)) {
          state.selectedElement = (state.selectedElements && state.selectedElements.length > 0) ? state.selectedElements[0] : null;
        }
      } else if (cmd.type === 'move') {
        const movedSet = new Set();
        translateElement(cmd.element, -cmd.dx, -cmd.dy, movedSet);
        for (const movedEl of movedSet) {
          updateDependentBindings(movedEl);
        }
      } else if (cmd.type === 'move-multiple') {
        const movedSet = new Set();
        for (const el of cmd.elements) {
          translateElement(el, -cmd.dx, -cmd.dy, movedSet);
        }
        for (const movedEl of movedSet) {
          updateDependentBindings(movedEl);
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
      } else if (cmd.type === 'group-elements' || cmd.type === 'ungroup-elements') {
        for (const item of cmd.items) {
          if (item.element) {
            item.element.groupId = item.beforeGroupId;
            if (item.beforeManualGroup !== undefined) item.element.isManualGroup = item.beforeManualGroup;
            if (item.beforeUngrouped !== undefined) item.element.isUngrouped = item.beforeUngrouped;
          }
        }
        if (state.selectedElements && state.selectedElements.length > 0) {
          updateFloatingBarState(state.selectedElements);
        }
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
      } else if (cmd.type === 'add-multiple') {
        for (const el of cmd.elements) {
          elements.push(el);
        }
      } else if (cmd.type === 'move') {
        const movedSet = new Set();
        translateElement(cmd.element, cmd.dx, cmd.dy, movedSet);
        for (const movedEl of movedSet) {
          updateDependentBindings(movedEl);
        }
      } else if (cmd.type === 'move-multiple') {
        const movedSet = new Set();
        for (const el of cmd.elements) {
          translateElement(el, cmd.dx, cmd.dy, movedSet);
        }
        for (const movedEl of movedSet) {
          updateDependentBindings(movedEl);
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
      } else if (cmd.type === 'group-elements' || cmd.type === 'ungroup-elements') {
        for (const item of cmd.items) {
          if (item.element) {
            item.element.groupId = item.afterGroupId;
            if (item.afterManualGroup !== undefined) item.element.isManualGroup = item.afterManualGroup;
            if (item.afterUngrouped !== undefined) item.element.isUngrouped = item.afterUngrouped;
          }
        }
        if (state.selectedElements && state.selectedElements.length > 0) {
          updateFloatingBarState(state.selectedElements);
        }
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
        statusToolInfo.textContent = 'Công cụ: Chọn (Bấm vào đối tượng hoặc kéo quét vùng để chọn; cắt, xóa, sao chép)';
        if (state.selectedElements && state.selectedElements.length > 0 && state.isFromAreaSelect) {
          showFloatingSelectionBar(state.selectedElements);
        } else {
          hideFloatingSelectionBar();
        }
      } else {
        state.isFromAreaSelect = false;
        hideFloatingSelectionBar();
      }

      if (state.activeTool === 'eraser') {
        setCanvasCursor(getEraserCursor(state.eraserRadius || 12));
        state.selectedElement = null;
        statusToolInfo.textContent = state.eraserMode === 'partial'
          ? `Công cụ: Tẩy nét (Cỡ tẩy: ${state.eraserRadius || 12}px)`
          : `Công cụ: Tẩy cả hình (Cỡ tẩy: ${state.eraserRadius || 12}px)`;
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
        const toolCursor = (state.activeTool === 'pen' || state.activeTool === 'highlighter') ? getPenCursor() : 'crosshair';
        setCanvasCursor(toolCursor);
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
        penIconSlot.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L19 9L15 21L12 17L9 21L5 9L12 2Z" fill="currentColor" fill-opacity="0.15"/><path d="M12 2L19 9L15 21L12 17L9 21L5 9L12 2Z"/><line x1="12" y1="2" x2="12" y2="12"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>';
      }
      if (btnPenTypePenEl) btnPenTypePenEl.classList.add('active');
      if (btnPenTypeHighlighterEl) btnPenTypeHighlighterEl.classList.remove('active');
      if (toolPen) toolPen.title = 'Bút vẽ (Phím B) / Nhấp để chọn loại bút, màu và nét';
    }

    state.activeGeo = null;
    setSelectedElements([]);
    hideFloatingSelectionBar();
    setCanvasCursor(mode === 'highlighter' ? HIGHLIGHTER_CURSOR : PEN_CURSOR);

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

  // Chọn độ dày nét bằng thanh trượt số thập phân từ 1 đến 5 (mặc định 1.5) bên trong dropdown Bút ▾
  const inputPenSizeSlider = document.getElementById('input-pen-size-slider');
  const penSizeValueBadge = document.getElementById('pen-size-value-badge');
  const penSizeLiveLine = document.getElementById('pen-size-live-line');
  const penSizeTicks = document.querySelectorAll('.pen-size-tick');

  function applyPenStrokeWidth(rawVal) {
    const parsed = parseFloat(rawVal);
    const val = Math.round(Math.max(1, Math.min(5, isNaN(parsed) ? 1.5 : parsed)) * 10) / 10;
    state.strokeWidth = val;
    if (inputPenSizeSlider && Math.abs(parseFloat(inputPenSizeSlider.value) - val) > 0.001) {
      inputPenSizeSlider.value = String(val);
    }
    if (penSizeValueBadge) {
      if ('value' in penSizeValueBadge) {
        if (document.activeElement !== penSizeValueBadge) {
          penSizeValueBadge.value = String(val);
        }
      } else {
        penSizeValueBadge.textContent = String(val);
      }
    }
    if (penSizeLiveLine) {
      penSizeLiveLine.style.height = `${Math.max(1, Math.min(7, val * 1.3))}px`;
    }
    penSizeTicks.forEach(t => {
      t.classList.toggle('active', Math.abs(parseFloat(t.dataset.size) - val) < 0.02);
    });
    statusToolInfo.textContent = `Công cụ: ${state.activeTool === 'highlighter' ? 'Dạ quang' : 'Bút viết'} (Màu: ${state.color}, Nét: ${state.strokeWidth})`;
  }

  if (inputPenSizeSlider) {
    inputPenSizeSlider.addEventListener('input', (e) => {
      e.stopPropagation();
      const val = Math.round(parseFloat(e.target.value) * 10) / 10;
      if (penSizeValueBadge && 'value' in penSizeValueBadge) {
        penSizeValueBadge.value = String(val);
      }
      applyPenStrokeWidth(val);
    });
    inputPenSizeSlider.addEventListener('click', (e) => e.stopPropagation());
  }

  if (penSizeValueBadge && 'value' in penSizeValueBadge) {
    penSizeValueBadge.addEventListener('click', (e) => e.stopPropagation());
    penSizeValueBadge.addEventListener('input', (e) => {
      e.stopPropagation();
      const v = parseFloat(e.target.value);
      if (!isNaN(v) && v >= 1 && v <= 5) {
        applyPenStrokeWidth(v);
      }
    });
    penSizeValueBadge.addEventListener('change', (e) => {
      e.stopPropagation();
      applyPenStrokeWidth(e.target.value);
      penSizeValueBadge.value = String(state.strokeWidth);
    });
  }

  penSizeTicks.forEach(tick => {
    tick.addEventListener('click', (e) => {
      e.stopPropagation();
      const v = parseFloat(tick.dataset.size);
      if (penSizeValueBadge && 'value' in penSizeValueBadge) {
        penSizeValueBadge.value = String(v);
      }
      applyPenStrokeWidth(v);
    });
  });

  document.querySelectorAll('.pen-size-row').forEach(row => {
    row.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.pen-size-row').forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      applyPenStrokeWidth(row.dataset.size);
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

    const isConstructionTask = ['bisector', 'perpendicular', 'parallel', 'tangent', 'two-tangents', 'angle', 'intersection', 'perpendicular-bisector', 'point-symmetry', 'axis-symmetry', 'circumcircle', 'incircle'].includes(geoName);

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

    // NẾU LÀ CÁC TÁC VỤ DỰNG HÌNH: PHÂN GIÁC, VUÔNG GÓC, SONG SONG, TIẾP TUYẾN, 2 TIẾP TUYẾN, CHỌN GÓC, GIAO ĐIỂM, TRUNG TRỰC, ĐỐI XỨNG ĐIỂM, ĐỐI XỨNG TRỤC, NGOẠI TIẾP, NỘI TIẾP
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
      } else if (state.activeGeo === 'perpendicular-bisector') {
        statusToolInfo.textContent = 'Đường trung trực: Bước 1 — Bấm chọn Điểm 1 (hoặc chọn 1 đoạn thẳng)';
      } else if (state.activeGeo === 'point-symmetry') {
        statusToolInfo.textContent = 'Đối xứng điểm: Bước 1 — Bấm chọn Điểm 1 (điểm cần lấy đối xứng)';
      } else if (state.activeGeo === 'axis-symmetry') {
        statusToolInfo.textContent = 'Đối xứng trục: Bước 1 — Bấm chọn Điểm (hoặc chọn Trục đối xứng)';
      } else if (state.activeGeo === 'circumcircle') {
        statusToolInfo.textContent = 'Đường tròn ngoại tiếp: Bấm chọn tam giác HOẶC lần lượt chọn 3 điểm trên bảng vẽ';
      } else if (state.activeGeo === 'incircle') {
        statusToolInfo.textContent = 'Đường tròn nội tiếp: Bấm chọn tam giác HOẶC lần lượt chọn 3 đỉnh trên bảng vẽ';
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

      if (geoName === 'perpendicular-bisector') {
        showPageToast('🎯 Chế độ Chọn: Bấm chọn Điểm 1 để dựng đường trung trực');
      } else if (geoName === 'point-symmetry') {
        showPageToast('🎯 Chế độ Chọn: Bấm chọn Điểm 1 để lấy đối xứng qua Điểm 2');
      } else if (geoName === 'axis-symmetry') {
        showPageToast('🎯 Chế độ Chọn: Bấm chọn Điểm hoặc Trục để lấy đối xứng qua trục');
      } else if (geoName === 'circumcircle') {
        showPageToast('🎯 Chế độ Chọn: Bấm chọn tam giác hoặc 3 điểm để vẽ đường tròn ngoại tiếp');
      } else if (geoName === 'incircle') {
        showPageToast('🎯 Chế độ Chọn: Bấm chọn tam giác hoặc 3 đỉnh để vẽ đường tròn nội tiếp');
      } else {
        showPageToast('🎯 Đã chuyển sang chế độ Chọn: Bấm chọn các đối tượng trên bảng vẽ');
      }
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
    } else if (state.activeGeo === 'pyramid-sa-triangle') {
      statusToolInfo.textContent = 'Chóp SA ⊥ đáy tam giác: Kéo chuột để vẽ hình chóp S.ABC (đường cao SA ⟂ đáy, ký hiệu vuông góc)';
    } else if (state.activeGeo === 'pyramid-sa-parallelogram') {
      statusToolInfo.textContent = 'Chóp SA ⊥ đáy hình bình hành: Kéo chuột để vẽ hình chóp S.ABCD (SA ⟂ đáy, đáy hình bình hành)';
    } else if (state.activeGeo === 'pyramid-sa-trapezoid') {
      statusToolInfo.textContent = 'Chóp SA ⊥ đáy hình thang: Kéo chuột để vẽ hình chóp S.ABCD (SA ⟂ đáy, đáy hình thang)';
    } else if (state.activeGeo === 'pyramid-sa-quad') {
      statusToolInfo.textContent = 'Chóp SA ⊥ đáy tứ giác: Kéo chuột để vẽ hình chóp S.ABCD (SA ⟂ đáy, đáy tứ giác)';
    } else if (state.activeGeo === 'prism-stand') {
      statusToolInfo.textContent = 'Lăng trụ đứng / đều: Kéo chuột để vẽ lăng trụ đứng ABC.A\'B\'C\' (các cạnh bên ⟂ đáy)';
    } else if (state.activeGeo === 'prism-oblique') {
      statusToolInfo.textContent = 'Lăng trụ xiên: Kéo chuột để vẽ hình lăng trụ xiên ABC.A\'B\'C\'';
    } else if (state.activeGeo === 'box-rect') {
      statusToolInfo.textContent = 'Hình hộp chữ nhật / Lập phương: Kéo chuột để vẽ hình hộp ABCD.A\'B\'C\'D\'';
    } else if (state.activeGeo === 'cone') {
      statusToolInfo.textContent = 'Hình nón tròn xoay: Kéo chuột để vẽ hình nón (đỉnh S, trục SO ⟂ đáy, đáy elip phối cảnh)';
    } else if (state.activeGeo === 'cylinder') {
      statusToolInfo.textContent = 'Hình trụ tròn xoay: Kéo chuột để vẽ hình trụ (2 đáy elip phối cảnh, trục O\'O ⟂ đáy)';
    } else if (state.activeGeo === 'sphere') {
      statusToolInfo.textContent = 'Mặt cầu / Khối cầu: Kéo chuột để vẽ mặt cầu (đường tròn lớn, tâm O, bán kính R, xích đạo elip)';
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

  // Chọn kích thước đầu tẩy bằng thanh trượt (kéo giống bên Bút) từ 3px đến 50px
  const inputEraserSizeSlider = document.getElementById('input-eraser-size-slider');
  const eraserSizeValueBadge = document.getElementById('eraser-size-value-badge');
  const eraserSizeLiveCircle = document.getElementById('eraser-size-live-circle');
  const eraserSizeTicks = document.querySelectorAll('.eraser-size-tick');

  function applyEraserRadius(rawVal) {
    const parsed = parseInt(rawVal, 10);
    const val = Math.max(3, Math.min(50, isNaN(parsed) ? 12 : parsed));
    state.eraserRadius = val;

    if (inputEraserSizeSlider && parseInt(inputEraserSizeSlider.value, 10) !== val) {
      inputEraserSizeSlider.value = String(val);
    }
    if (eraserSizeValueBadge) {
      if ('value' in eraserSizeValueBadge) {
        if (document.activeElement !== eraserSizeValueBadge) {
          eraserSizeValueBadge.value = String(val);
        }
      } else {
        eraserSizeValueBadge.textContent = String(val);
      }
    }
    if (eraserSizeLiveCircle) {
      const previewSize = Math.max(4, Math.min(20, Math.round(val * 0.55)));
      eraserSizeLiveCircle.style.width = `${previewSize}px`;
      eraserSizeLiveCircle.style.height = `${previewSize}px`;
    }
    eraserSizeTicks.forEach(t => {
      const rad = parseInt(t.dataset.rad, 10);
      t.classList.toggle('active', rad === val);
    });

    if (state.activeTool === 'eraser') {
      setCanvasCursor(getEraserCursor(val));
      statusToolInfo.textContent = `Công cụ: ${state.eraserMode === 'partial' ? 'Tẩy nét' : 'Tẩy cả hình'} (Cỡ tẩy: ${val}px)`;
      renderPage();
    }
  }

  if (inputEraserSizeSlider) {
    inputEraserSizeSlider.addEventListener('input', (e) => {
      e.stopPropagation();
      applyEraserRadius(e.target.value);
    });
    inputEraserSizeSlider.addEventListener('change', (e) => {
      e.stopPropagation();
      applyEraserRadius(e.target.value);
    });
  }

  if (eraserSizeValueBadge) {
    eraserSizeValueBadge.addEventListener('input', (e) => {
      e.stopPropagation();
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val >= 3 && val <= 50) {
        applyEraserRadius(val);
      }
    });
    eraserSizeValueBadge.addEventListener('change', (e) => {
      e.stopPropagation();
      applyEraserRadius(e.target.value);
    });
    eraserSizeValueBadge.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyEraserRadius(e.target.value);
        eraserSizeValueBadge.blur();
      }
    });
  }

  eraserSizeTicks.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      applyEraserRadius(btn.dataset.rad);
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

  // Cập nhật màu mực đồng bộ cho toàn bộ giao diện cây bút và chấm màu
  function updateActivePenColor(col) {
    if (!col) return;
    document.documentElement.style.setProperty('--active-pen-color', col);
    const penDot = document.getElementById('pen-active-color-dot');
    if (penDot) penDot.style.backgroundColor = col;
  }
  updateActivePenColor(state.color || '#30493c');

  // Bảng màu nhanh
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      state.color = swatch.dataset.color;
      updateActivePenColor(state.color);
      statusToolInfo.textContent = `Công cụ: ${state.activeTool} (Màu: ${state.color})`;
    });
  });

  if (customColorInput) {
    customColorInput.addEventListener('input', (e) => {
      state.color = e.target.value;
      colorSwatches.forEach(s => s.classList.remove('active'));
      updateActivePenColor(state.color);
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
  const btnFileDropdown = document.getElementById('btn-file-dropdown');
  const btnFileMenu = document.getElementById('btn-file-menu');
  const btnFileArrow = document.getElementById('btn-file-dropdown-arrow');
  const docFileChip = document.getElementById('doc-file-chip');
  const menuFile = document.getElementById('menu-file');
  const btnFileSave = document.getElementById('btn-file-save');
  const btnFileSaveAs = document.getElementById('btn-file-save-as');
  const btnFileOpenRecent = document.getElementById('btn-file-open-recent');
  const btnFileImportProject = document.getElementById('btn-file-import-project');
  const inputProjectFile = document.getElementById('input-project-file');
  const saveBadge = document.getElementById('save-badge');
  const docTitleInput = document.getElementById('doc-title');

  // Hàm tự động căn chỉnh độ rộng ô tiêu đề theo số lượng chữ
  function adjustDocTitleWidth() {
    if (!docTitleInput) return;
    const len = docTitleInput.value ? docTitleInput.value.length : 11;
    docTitleInput.style.width = Math.max(88, Math.min(220, len * 8.2 + 14)) + 'px';
  }

  // Mở/đóng dropdown Menu Tệp
  const handleToggleFileMenu = (e) => {
    if (e) e.stopPropagation();
    if (menuFile) {
      toggleDropdownMenu(btnFileDropdown || docFileChip || btnFileMenu, menuFile);
    }
  };

  if (btnFileDropdown) {
    btnFileDropdown.addEventListener('click', handleToggleFileMenu);
  }
  if (btnFileMenu) {
    btnFileMenu.addEventListener('click', handleToggleFileMenu);
  }
  if (btnFileArrow) {
    btnFileArrow.addEventListener('click', handleToggleFileMenu);
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

  // 1. Lưu (Save) - Lưu vào localStorage của trình duyệt (Tối ưu hóa chuỗi hóa 1 lần & Hoãn khi đang viết)
  function saveProject(isManual = false) {
    if (!isManual && state.isDrawing) {
      if (typeof markUnsaved === 'function') markUnsaved();
      return;
    }
    try {
      const data = getProjectData();
      const jsonStr = JSON.stringify(data);
      if (jsonStr.length < 4.5 * 1024 * 1024) {
        localStorage.setItem('net_saved_project', jsonStr);
      }

      // Cập nhật giao diện "Ghi chú gần nhất" không nhân đôi dung lượng JSON vào localStorage
      const totalElements = Object.values(data.state && data.state.pages ? data.state.pages : {}).reduce((sum, list) => sum + (list ? list.length : 0), 0);
      const isCustomTitle = data.title && data.title !== 'Ghi chú mới';
      if (totalElements > 0 || isCustomTitle) {
        updateRecentDocUI(data.title);
      }

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

  // 1.1. Cập nhật trạng thái hiển thị của nút "Mở ghi chú gần nhất" trên menu Tệp
  function updateRecentDocUI(directTitle) {
    const btnOpenRecent = document.getElementById('btn-file-open-recent');
    const recentDocName = document.getElementById('recent-doc-name');
    if (!btnOpenRecent) return;

    if (directTitle) {
      btnOpenRecent.removeAttribute('disabled');
      btnOpenRecent.style.opacity = '1';
      btnOpenRecent.style.cursor = 'pointer';
      btnOpenRecent.title = `Mở lại ghi chú: "${directTitle}"`;
      if (recentDocName) {
        recentDocName.textContent = directTitle;
        recentDocName.style.display = 'inline-block';
      }
      return;
    }

    try {
      const recentStr = localStorage.getItem('net_recent_project') || localStorage.getItem('net_saved_project');
      if (recentStr) {
        const parsed = JSON.parse(recentStr);
        const totalElements = parsed && parsed.state && parsed.state.pages 
          ? Object.values(parsed.state.pages).reduce((sum, list) => sum + (list ? list.length : 0), 0)
          : 0;
        const isCustomTitle = parsed && parsed.title && parsed.title !== 'Ghi chú mới';
        if (totalElements > 0 || isCustomTitle) {
          const title = (parsed && parsed.title) ? parsed.title.trim() : 'Ghi chú gần nhất';
          btnOpenRecent.removeAttribute('disabled');
          btnOpenRecent.style.opacity = '1';
          btnOpenRecent.style.cursor = 'pointer';
          btnOpenRecent.title = `Mở lại ghi chú: "${title}"`;
          if (recentDocName) {
            recentDocName.textContent = title;
            recentDocName.style.display = 'inline-block';
          }
          return;
        }
      }
    } catch (e) {
      if (typeof console !== 'undefined' && typeof console.warn === 'function') {
        console.warn('Lỗi đọc ghi chú gần nhất:', e);
      }
    }

    if (recentDocName) {
      recentDocName.textContent = '';
      recentDocName.style.display = 'none';
    }
    btnOpenRecent.title = 'Chưa có ghi chú nào được lưu trước đó';
  }

  // 1.2. Nạp dữ liệu ghi chú vào ứng dụng (dùng chung cho Mở tệp .net và Mở ghi chú gần nhất)
  function loadProjectData(data, toastMsg = '📂 Đã mở tệp Nét thành công!') {
    if (!data || !data.state || !data.state.pages) {
      alert('Định dạng tệp không hợp lệ! Vui lòng chọn tệp .net hoặc .json của Nét.');
      return false;
    }

    // 1. Dọn sạch các trang phụ > 1 trong DOM
    if (pagesContainer) {
      const wrappers = Array.from(pagesContainer.querySelectorAll('.paper-wrapper'));
      wrappers.forEach(w => {
        const p = parseInt(w.dataset.page, 10);
        if (p > 1) {
          w.remove();
        }
      });
    }

    // 2. Xóa các hộp nhập nổi hoặc góc nổi
    document.querySelectorAll('.floating-angle-box').forEach(b => b.remove());

    // 3. Khôi phục tiêu đề
    if (docTitleInput && data.title) {
      docTitleInput.value = data.title;
      adjustDocTitleWidth();
    }

    // 4. Khôi phục dữ liệu state
    state.pages = data.state.pages || { 1: [] };
    state.pageTitles = data.state.pageTitles || { 1: 'Trang 1' };
    state.currentPage = data.state.currentPage || 1;
    state.undoStacks = {};
    state.redoStacks = {};
    state.selectedElement = null;
    state.selectedElements = [];
    state.selectedEdge = null;
    state.selectedVertex = null;
    state.pendingSingleSelect = null;
    state.activeHandle = null;
    state.hoverHandle = null;
    state.hoverElement = null;

    // 5. Khôi phục hướng giấy & lưới giấy
    if (data.state.orientation && data.state.orientation !== state.orientation) {
      setOrientation(data.state.orientation);
    }
    if (data.state.gridType) {
      document.querySelectorAll('.paper-sheet').forEach(sheet => {
        sheet.className = `paper-sheet paper-${data.state.gridType}`;
      });
      if (typeof selectGrid !== 'undefined' && selectGrid) selectGrid.value = data.state.gridType;
    }

    // 6. Đảm bảo DOM cho các trang p > 1
    const pageKeys = Object.keys(state.pages).map(Number).sort((a, b) => a - b);
    pageKeys.forEach(p => {
      if (p > 1 && typeof ensurePageInDOM === 'function') {
        ensurePageInDOM(p);
      }
    });

    // 7. Cuộn về đầu và render lại
    if (canvasContainer) {
      canvasContainer.scrollTop = 0;
      canvasContainer.scrollLeft = 0;
    }

    updatePageListBar();
    renderPage('all');
    renderThumbnails();
    updateUndoState();
    saveProject(false);
    if (toastMsg) showPageToast(toastMsg);
    return true;
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
        loadProjectData(data, '📂 Đã mở tệp Nét thành công!');
      } catch (err) {
        alert('Không thể mở tệp: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  // Tự động lưu sau khi chỉnh sửa (Tối ưu hóa: Debounce 3.5s và lưu trong luồng rỗi Idle Callback để không bao giờ gây khựng nét vẽ)
  let autoSaveTimer = null;
  function markUnsaved() {
    if (saveBadge) {
      saveBadge.textContent = '· Đang sửa...';
      saveBadge.className = 'badge-saved';
      saveBadge.style.color = '#d97706';
    }
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => saveProject(false), { timeout: 2500 });
      } else {
        saveProject(false);
      }
    }, 3500);
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
      adjustDocTitleWidth();
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

  if (btnFileOpenRecent) {
    btnFileOpenRecent.addEventListener('click', () => {
      closeAllDropdowns();
      const recentStr = localStorage.getItem('net_recent_project') || localStorage.getItem('net_saved_project');
      if (!recentStr) {
        showPageToast('ℹ️ Chưa có ghi chú gần nhất nào được lưu.');
        return;
      }
      let parsed = null;
      try {
        parsed = JSON.parse(recentStr);
      } catch (err) {
        showPageToast('⚠️ Tệp ghi chú gần nhất không hợp lệ.');
        return;
      }
      if (!parsed || !parsed.state || !parsed.state.pages) {
        showPageToast('ℹ️ Ghi chú gần nhất chưa có nội dung.');
        return;
      }

      const currentTotal = Object.values(state.pages || {}).reduce((sum, list) => sum + (list ? list.length : 0), 0);
      if (currentTotal > 0) {
        const title = parsed.title ? `"${parsed.title}"` : 'gần nhất';
        const ok = confirm(`Trang hiện tại đang có nét vẽ. Bạn có muốn mở ghi chú ${title} không?\n(Trang hiện tại sẽ được thay thế)`);
        if (!ok) return;
      }

      loadProjectData(parsed, `📂 Đã mở lại: ${parsed.title || 'Ghi chú gần nhất'}`);
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
    docTitleInput.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    docTitleInput.addEventListener('input', () => {
      adjustDocTitleWidth();
      markUnsaved();
    });
    adjustDocTitleWidth();
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
    // ⌘P hoặc Ctrl+P -> Xuất PDF (Print / Export PDF)
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      const btnExportPdf = document.getElementById('btn-export-pdf');
      if (btnExportPdf) btnExportPdf.click();
      return;
    }
  });

  // Khởi động ứng dụng: Luôn bắt đầu bằng 1 trang trắng mới (theo yêu cầu người dùng)
  // Tự động bảo lưu dữ liệu ghi chú cũ vào net_recent_project để người dùng mở lại khi cần
  try {
    const lastSaved = localStorage.getItem('net_saved_project');
    const existingRecent = localStorage.getItem('net_recent_project');
    if (lastSaved && !existingRecent) {
      const parsed = JSON.parse(lastSaved);
      if (parsed && parsed.state && parsed.state.pages) {
        const totalElements = Object.values(parsed.state.pages).reduce((sum, list) => sum + (list ? list.length : 0), 0);
        if (totalElements > 0 || (parsed.title && parsed.title !== 'Ghi chú mới')) {
          localStorage.setItem('net_recent_project', lastSaved);
        }
      }
    }
  } catch (err) {
    if (typeof console !== 'undefined' && typeof console.warn === 'function') {
      console.warn('Lỗi kiểm tra ghi chú cũ:', err);
    }
  }
  updateRecentDocUI();

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

  function updatePageNav() {
    const totalPages = Object.keys(state.pages).length || 1;
    const cur = state.currentPage || 1;
    if (pageNavTotal) pageNavTotal.textContent = totalPages;
    if (inputPageNumber && document.activeElement !== inputPageNumber) {
      inputPageNumber.value = cur;
      const digits = String(cur).length;
      inputPageNumber.style.width = Math.max(28, digits * 9 + 12) + 'px';
    }
    if (btnPagePrev) {
      const isFirst = (cur <= 1);
      btnPagePrev.disabled = isFirst;
      btnPagePrev.classList.toggle('disabled', isFirst);
    }
    if (btnPageNext) {
      const isLast = (cur >= totalPages);
      btnPageNext.disabled = isLast;
      btnPageNext.classList.toggle('disabled', isLast);
    }

    // Tự động tối ưu hiển thị: Khi có nhiều hơn 3 trang (như tài liệu PDF),
    // ẩn danh sách các nút tab dàn trải để thanh điều hướng luôn tinh gọn, chuẩn mực
    if (pagesList) {
      if (totalPages > 3) {
        pagesList.style.display = 'none';
      } else {
        pagesList.style.display = 'flex';
      }
    }
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
    updatePageNav();
  }

  function renderAllTabs() {
    updatePageNav();
    if (!pagesList) return;
    const pageNums = Object.keys(state.pages).map(Number).sort((a, b) => a - b);
    const totalPages = pageNums.length;
    if (totalPages > 3) {
      pagesList.style.display = 'none';
      return;
    }
    pagesList.style.display = 'flex';
    pagesList.innerHTML = '';
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
    const pageKeys = Object.keys(state.pages).map(Number);
    const newPageNum = (pageKeys.length > 0 ? Math.max(...pageKeys) : 0) + 1;
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

  // Xử lý sự kiện cụm điều hướng trang: [ ‹ ] Trang [ 1 ] / 25 [ › ]
  function commitPageInput() {
    if (!inputPageNumber) return;
    const val = parseInt(inputPageNumber.value.trim(), 10);
    const totalPages = Object.keys(state.pages).length || 1;
    if (isNaN(val)) {
      inputPageNumber.value = state.currentPage;
      return;
    }
    const targetPage = Math.max(1, Math.min(totalPages, val));
    inputPageNumber.value = targetPage;
    const digits = String(targetPage).length;
    inputPageNumber.style.width = Math.max(28, digits * 9 + 12) + 'px';

    if (targetPage !== state.currentPage) {
      switchPage(targetPage, true);
      showPageToast(`📄 Đã chuyển đến Trang ${targetPage} / ${totalPages}`);
    }
  }

  if (inputPageNumber) {
    // Tự động bôi đen toàn bộ số cũ khi người dùng nhấp vào để gõ ngay số mới
    inputPageNumber.addEventListener('focus', () => {
      inputPageNumber.select();
    });

    // Khi người dùng bấm Enter: chuyển ngay đến trang đó
    inputPageNumber.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitPageInput();
        inputPageNumber.blur();
      } else if (e.key === 'Escape') {
        inputPageNumber.value = state.currentPage;
        inputPageNumber.blur();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (state.currentPage > 1) switchPage(state.currentPage - 1, true);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const totalPages = Object.keys(state.pages).length;
        if (state.currentPage < totalPages) switchPage(state.currentPage + 1, true);
      }
    });

    // Khi người dùng click ra ngoài (blur): chuyển đến trang nếu số hợp lệ
    inputPageNumber.addEventListener('blur', () => {
      commitPageInput();
    });
  }

  // Nút lùi về trang trước [ ‹ ]
  if (btnPagePrev) {
    btnPagePrev.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.currentPage > 1) {
        switchPage(state.currentPage - 1, true);
      }
    });
  }

  // Nút tiến tới trang tiếp theo [ › ]
  if (btnPageNext) {
    btnPageNext.addEventListener('click', (e) => {
      e.stopPropagation();
      const totalPages = Object.keys(state.pages).length;
      if (state.currentPage < totalPages) {
        switchPage(state.currentPage + 1, true);
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
    renderAllPages();
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
        renderPage(bestPage);
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

  function fitCanvasToWidth() {
    const dims = getCanvasDimensions();
    const containerWidth = canvasContainer.clientWidth - 48;
    const fitZoom = containerWidth / dims.width;
    updateZoom(Math.min(1.4, Math.max(0.4, fitZoom)));
  }

  btnZoomIn.addEventListener('click', () => updateZoom(state.zoom + 0.1));
  btnZoomOut.addEventListener('click', () => updateZoom(state.zoom - 0.1));
  if (btnZoomReset) {
    btnZoomReset.addEventListener('click', fitCanvasToWidth);
  }

  // 10. Xuất ảnh PNG & Xóa trang
  btnExportPng.addEventListener('click', () => {
    closeAllDropdowns();
    const curCanvas = getCanvasForPage(state.currentPage) || canvas;
    const link = document.createElement('a');
    link.download = `Net-${document.getElementById('doc-title').value || 'Note'}-Trang${state.currentPage}.png`;
    link.href = curCanvas.toDataURL('image/png');
    link.click();
  });

  if (btnClearCanvas) {
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
  }

  // 11. Phím tắt chuẩn Mac (Keyboard Shortcuts)
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || (e.target.isContentEditable)) return;

    if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
      if (e.key.toLowerCase() === 'x' && state.activeTool === 'select' && state.selectedElements && state.selectedElements.length > 0) {
        e.preventDefault();
        cutSelectedElements();
        return;
      }
      if (e.key.toLowerCase() === 'c' && state.activeTool === 'select' && state.selectedElements && state.selectedElements.length > 0) {
        e.preventDefault();
        copySelectedElements();
        return;
      }
      if (e.key.toLowerCase() === 'v' && state.activeTool === 'select' && state.clipboardElements && state.clipboardElements.length > 0) {
        e.preventDefault();
        pasteClipboardElements();
        return;
      }
      if (e.key.toLowerCase() === 'd' && state.activeTool === 'select' && state.selectedElements && state.selectedElements.length > 0) {
        e.preventDefault();
        duplicateSelectedElements();
        return;
      }
      if (e.key.toLowerCase() === 'g' && state.activeTool === 'select') {
        e.preventDefault();
        groupSelectedElements();
        return;
      }
    }

    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'g' && state.activeTool === 'select') {
      e.preventDefault();
      ungroupSelectedElements();
      return;
    }

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
      state.isFromAreaSelect = false;
      hideFloatingSelectionBar();
      if (state.selectedElements && state.selectedElements.length > 0) {
        setSelectedElements([]);
        renderPage();
      }
      if (state.activeTool === 'geo' || state.activeTool === 'graph' || state.pendingConstruction || state.pendingOptions || (state.construction && (state.construction.point || state.construction.line || state.construction.circle || (state.construction.edges && state.construction.edges.length > 0)))) {
        finishGeoTask();
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      if (state.selectedElements && state.selectedElements.length > 0) {
        deleteSelectedElements();
      }
    }
  });

  // ==========================================================================
  // HỘP THOẠI SOẠN THẢO CHỮ TRỰC TIẾP TRÊN TRANG (INLINE TEXT EDITOR)
  // ==========================================================================
  let activeInlineTextEditor = null;
  function closeInlineTextEditor() {
    if (activeInlineTextEditor && activeInlineTextEditor.parentNode) {
      activeInlineTextEditor.parentNode.removeChild(activeInlineTextEditor);
    }
    activeInlineTextEditor = null;
  }

  function openInlineTextEditor(x, y, existingElement = null) {
    closeInlineTextEditor();

    const currentSheet = document.querySelector(`.paper-sheet-${state.currentPage}`) || document.querySelector('.paper-sheet') || document.body;
    const dims = getCanvasDimensions();

    const editor = document.createElement('div');
    editor.className = 'inline-text-editor-container';

    let currentFontSize = existingElement ? (existingElement.fontSize || 22) : (state.lastTextFontSize || 22);
    let currentColor = existingElement ? (existingElement.color || state.color) : (state.color || '#28634e');
    let currentFontFamily = existingElement ? (existingElement.fontFamily || '"Caveat", cursive') : (state.lastTextFontFamily || '"Caveat", cursive');

    editor.innerHTML = `
      <div class="inline-text-toolbar">
        <div class="inline-text-sizes">
          <button type="button" class="btn-inline-size ${currentFontSize === 16 ? 'active' : ''}" data-size="16">16</button>
          <button type="button" class="btn-inline-size ${currentFontSize === 22 ? 'active' : ''}" data-size="22">22</button>
          <button type="button" class="btn-inline-size ${currentFontSize === 30 ? 'active' : ''}" data-size="30">30</button>
          <button type="button" class="btn-inline-size ${currentFontSize === 40 ? 'active' : ''}" data-size="40">40</button>
        </div>
        <button type="button" class="btn-inline-size btn-inline-font" title="Đổi phông chữ Viết tay ⇋ Tiêu chuẩn">Aa</button>
      </div>
      <textarea class="inline-text-textarea" placeholder="Gõ văn bản ghi chú (Enter để xuống dòng)..."></textarea>
      <div class="inline-text-actions">
        ${existingElement ? '<button type="button" class="btn-inline-action btn-inline-cancel btn-inline-delete" style="color:#ef4444;margin-right:auto;">Xóa</button>' : ''}
        <button type="button" class="btn-inline-action btn-inline-cancel btn-inline-close">Hủy</button>
        <button type="button" class="btn-inline-action btn-inline-save">✓ Xong</button>
      </div>
    `;

    const textarea = editor.querySelector('.inline-text-textarea');
    if (existingElement) {
      textarea.value = existingElement.text || '';
    }
    textarea.style.fontSize = currentFontSize + 'px';
    textarea.style.color = currentColor;
    textarea.style.fontFamily = currentFontFamily;

    // Giới hạn tọa độ để không tràn ra ngoài trang
    const posX = Math.max(10, Math.min(x, dims.width - 260));
    const posY = Math.max(10, Math.min(y, dims.height - 180));
    editor.style.left = posX + 'px';
    editor.style.top = posY + 'px';

    currentSheet.appendChild(editor);
    activeInlineTextEditor = editor;

    setTimeout(() => {
      textarea.focus();
      if (existingElement) {
        textarea.select();
      }
    }, 50);

    // Đổi cỡ chữ
    editor.querySelectorAll('.btn-inline-size[data-size]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        editor.querySelectorAll('.btn-inline-size[data-size]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFontSize = parseInt(btn.dataset.size, 10);
        state.lastTextFontSize = currentFontSize;
        textarea.style.fontSize = currentFontSize + 'px';
      });
    });

    // Đổi font
    const btnFont = editor.querySelector('.btn-inline-font');
    if (btnFont) {
      btnFont.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentFontFamily.includes('Caveat')) {
          currentFontFamily = 'var(--font-main, sans-serif)';
        } else {
          currentFontFamily = '"Caveat", "Dancing Script", cursive';
        }
        state.lastTextFontFamily = currentFontFamily;
        textarea.style.fontFamily = currentFontFamily;
      });
    }

    const saveText = () => {
      const val = textarea.value.trim();
      if (val) {
        if (existingElement) {
          const before = JSON.parse(JSON.stringify(existingElement));
          existingElement.text = val;
          existingElement.fontSize = currentFontSize;
          existingElement.fontFamily = currentFontFamily;
          existingElement.color = currentColor;
          pushCommand({
            type: 'modify-element',
            element: existingElement,
            before: before,
            after: JSON.parse(JSON.stringify(existingElement))
          });
        } else {
          const newEl = {
            id: 'el_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5),
            type: 'text',
            text: val,
            x: x,
            y: y,
            fontSize: currentFontSize,
            fontFamily: currentFontFamily,
            color: currentColor
          };
          pushNewElement(newEl);
        }
        renderPage();
      }
      closeInlineTextEditor();
    };

    editor.querySelector('.btn-inline-save').addEventListener('click', (e) => {
      e.stopPropagation();
      saveText();
    });

    editor.querySelector('.btn-inline-close').addEventListener('click', (e) => {
      e.stopPropagation();
      closeInlineTextEditor();
    });

    const btnDel = editor.querySelector('.btn-inline-delete');
    if (btnDel && existingElement) {
      btnDel.addEventListener('click', (e) => {
        e.stopPropagation();
        const list = state.pages[state.currentPage] || [];
        const idx = list.indexOf(existingElement);
        if (idx !== -1) {
          list.splice(idx, 1);
          pushCommand({
            type: 'erase',
            element: existingElement,
            index: idx
          });
          renderPage();
        }
        closeInlineTextEditor();
      });
    }

    textarea.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        saveText();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeInlineTextEditor();
      }
    });
  }

  // ==========================================================================
  // XỬ LÝ NHẬN DẠNG CHỮ VIẾT TAY (OCR) & QUÉT VÙNG
  // ==========================================================================
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
    if (!ocrModal) return;
    ocrModal.style.display = 'flex';

    // Hiển thị ảnh xem trước vùng quét nếu có
    const previewWrap = document.getElementById('ocr-crop-preview-wrap');
    const previewImg = document.getElementById('ocr-crop-preview-img');
    const previewDims = document.getElementById('ocr-crop-dimensions');
    if (state.lastOcrCrop && state.lastOcrCrop.canvas && previewWrap && previewImg) {
      previewImg.src = state.lastOcrCrop.canvas.toDataURL('image/png');
      if (previewDims) {
        previewDims.textContent = `${Math.round(state.lastOcrCrop.box.width)} × ${Math.round(state.lastOcrCrop.box.height)} px`;
      }
      previewWrap.style.display = 'block';
    } else if (previewWrap) {
      previewWrap.style.display = 'none';
    }

    // Thu thập các đoạn chữ đã có trên trang nếu ô kết quả chưa có gì
    const textElements = (state.pages[state.currentPage] || [])
      .filter(el => el.type === 'text')
      .map(el => el.text);

    if (textElements.length > 0 && !ocrResultText.value.trim() && !state.lastOcrCrop) {
      ocrResultText.value = textElements.join('\n');
      updateCharCount();
    }
  }

  function closeOcrModal() {
    if (!ocrModal) return;
    ocrModal.style.display = 'none';
  }

  function updateCharCount() {
    if (!ocrCharCount || !ocrResultText) return;
    const len = ocrResultText.value.length;
    ocrCharCount.textContent = `${len} ký tự`;
  }

  // Xử lý cắt ảnh đúng vùng người dùng vừa khoanh quét trên mặt giấy
  function processOcrCropBox(x, y, w, h) {
    const activeCanvas = getCanvasForPage(state.currentPage) || canvas;
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = Math.round(w);
    cropCanvas.height = Math.round(h);
    const cropCtx = cropCanvas.getContext('2d');

    // Nền trắng, vẽ đúng vùng khoanh
    cropCtx.fillStyle = '#ffffff';
    cropCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
    cropCtx.drawImage(activeCanvas, x, y, w, h, 0, 0, cropCanvas.width, cropCanvas.height);

    state.lastOcrCrop = {
      canvas: cropCanvas,
      box: { x, y, width: w, height: h },
      page: state.currentPage
    };

    openOcrModal();
    // Tự động kích hoạt nhận dạng tức thì cho vùng vừa quét
    if (btnRunOcr) {
      btnRunOcr.click();
    }
  }

  if (ocrResultText) ocrResultText.addEventListener('input', updateCharCount);
  if (btnCloseOcrModal) btnCloseOcrModal.addEventListener('click', closeOcrModal);
  if (ocrModal) {
    ocrModal.addEventListener('click', (e) => {
      if (e.target === ocrModal) closeOcrModal();
    });
  }

  // Khi bấm nút OCR trên thanh công cụ: Kích hoạt chế độ quét vùng khoanh chữ
  if (btnOcr) {
    btnOcr.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.activeTool === 'ocr') {
        // Nếu đang ở OCR mà bấm lại: chuyển về bút
        setPenToolMode('pen');
        showPageToast('✏️ Đã quay lại Bút viết');
        return;
      }

      toolButtons.forEach(b => b.classList.remove('active'));
      btnOcr.classList.add('active');
      state.activeTool = 'ocr';
      setCanvasCursor('crosshair');
      showPageToast('🔍 Nhấn và kéo chuột khoanh vùng chữ viết tay cần nhận dạng');
      if (statusToolInfo) {
        statusToolInfo.textContent = '✍️ Công cụ OCR: Nhấn và kéo chuột trên mặt giấy để khoanh vùng chữ viết tay cần chuyển thành văn bản.';
      }
    });
  }

  // Bắt đầu quá trình nhận dạng chữ từ Canvas (Ưu tiên vùng crop vừa quét)
  if (btnRunOcr) {
    btnRunOcr.addEventListener('click', async () => {
      btnRunOcr.disabled = true;
      if (ocrSpinner) {
        ocrSpinner.style.display = 'inline-block';
        ocrSpinner.textContent = 'Đang nhận dạng chữ viết tay...';
      }

      const lang = selectOcrLang ? selectOcrLang.value : 'vie'; // 'vie' hoặc 'eng'

      try {
        let recognizedLines = [];

        // 1. Nhận dạng hình ảnh nét vẽ trên Canvas bằng Tesseract cục bộ
        if (window.Tesseract) {
          let ocrTarget = null;
          if (state.lastOcrCrop && state.lastOcrCrop.canvas) {
            ocrTarget = state.lastOcrCrop.canvas;
          } else {
            const activeCanvas = getCanvasForPage(state.currentPage) || canvas;
            const ocrCanvas = document.createElement('canvas');
            ocrCanvas.width = activeCanvas.width;
            ocrCanvas.height = activeCanvas.height;
            const ocrCtx = ocrCanvas.getContext('2d');
            ocrCtx.fillStyle = '#ffffff';
            ocrCtx.fillRect(0, 0, ocrCanvas.width, ocrCanvas.height);
            ocrCtx.drawImage(activeCanvas, 0, 0);
            ocrTarget = ocrCanvas;
          }

          const result = await window.Tesseract.recognize(ocrTarget, lang, {
            logger: m => {
              if (m.status === 'recognizing text' && ocrSpinner) {
                ocrSpinner.textContent = `Đang nhận dạng: ${Math.round(m.progress * 100)}%`;
              }
            }
          });

          const textOutput = result.data.text.trim();
          if (textOutput) {
            recognizedLines.push(textOutput);
          }
        } else {
          // Thông báo trung thực nếu Tesseract CDN chưa tải về hoặc offline
          recognizedLines.push('[Trang hiện tại chưa tải được thư viện OCR offline. Khi đóng gói thành App macOS, Nét sẽ sử dụng trực tiếp Apple Vision Handwriting Recognition tích hợp sẵn trong máy].');
        }

        if (ocrResultText) {
          ocrResultText.value = recognizedLines.join('\n\n');
        }
        updateCharCount();
        if (ocrSpinner) {
          ocrSpinner.textContent = 'Hoàn thành!';
          setTimeout(() => {
            ocrSpinner.style.display = 'none';
          }, 1500);
        }
      } catch (err) {
        console.error('Lỗi nhận dạng:', err);
        if (ocrSpinner) ocrSpinner.textContent = 'Không thể quét nét chữ. Vui lòng thử lại!';
      } finally {
        btnRunOcr.disabled = false;
      }
    });
  }

  // Chèn văn bản đã nhận dạng vào lại trang ghi chú
  if (btnInsertOcr) {
    btnInsertOcr.addEventListener('click', () => {
      const content = ocrResultText ? ocrResultText.value.trim() : '';
      if (!content) {
        showPageToast('⚠️ Chưa có nội dung văn bản để chèn vào ghi chú!');
        return;
      }

      let insertX = 120;
      let insertY = 200;
      if (state.lastOcrCrop && state.lastOcrCrop.box) {
        insertX = Math.round(state.lastOcrCrop.box.x);
        insertY = Math.round(state.lastOcrCrop.box.y + state.lastOcrCrop.box.height + 14);
      } else {
        const dims = getCanvasDimensions();
        insertX = Math.round(dims.width / 4);
        insertY = 250;
      }

      const newTextEl = {
        id: 'el_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5),
        type: 'text',
        text: content,
        x: insertX,
        y: insertY,
        fontSize: 22,
        fontFamily: '"Caveat", "Dancing Script", cursive',
        color: state.color || '#28634e'
      };

      pushNewElement(newTextEl);
      closeOcrModal();
      renderPage();

      // Tự động chọn đối tượng và chuyển sang công cụ Chọn để người dùng kéo chỉnh
      setSelectedElements([newTextEl]);
      state.activeTool = 'select';
      toolButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-tool') === 'select'));
      setCanvasCursor(SHARP_ARROW_CURSOR);
      updateContextualToolbar('select');
      showPageToast('✨ Đã chèn văn bản OCR vào ghi chú! Bạn có thể kéo di chuyển hoặc nhấp đúp để sửa.');
    });
  }

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

      showPageToast('⏳ Đang mở tệp PDF...');
      try {
        if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = window.pdfjsLib.getDocument({
          data: arrayBuffer,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true
        });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;

        if (numPages === 0) {
          alert('Tệp PDF không có trang nào!');
          return;
        }

        // Kiểm tra xem toàn bộ sổ tay có đang hoàn toàn trống hay không
        const isDocCompletelyEmpty = Object.values(state.pages).every(list => !list || list.length === 0);
        if (isDocCompletelyEmpty) {
          doResetToNew();
        }

        const startPage = state.currentPage;
        const currentElements = state.pages[startPage] || [];
        const isCurrentEmpty = currentElements.length === 0;

        // Tự động tối ưu hướng giấy Dọc / Ngang theo trang 1 nếu bắt đầu từ trang trắng
        const firstPdfPage = await pdf.getPage(1);
        const vFirst = firstPdfPage.getViewport({ scale: 1.0 });
        const isPdfLandscape = vFirst.width > vFirst.height;
        if (isCurrentEmpty && Object.keys(state.pages).length === 1) {
          setOrientation(isPdfLandscape ? 'landscape' : 'portrait');
        }

        const dims = getCanvasDimensions();
        const padX = 24;
        const padY = 24;
        const maxW = dims.width - padX * 2;
        const maxH = dims.height - padY * 2;

        showPageToast(`📄 Tìm thấy ${numPages} trang. Đang nạp siêu tốc...`);

        let currentTargetPage = startPage;

        // Xử lý từng trang và hiển thị ngay lập tức (Progressive Streaming)
        for (let p = 1; p <= numPages; p++) {
          showPageToast(`⏳ Đang nhập trang ${p}/${numPages}...`);

          const page = (p === 1) ? firstPdfPage : await pdf.getPage(p);
          const baseViewport = page.getViewport({ scale: 1.0 });

          // Tính toán kích thước vừa vặn trang giấy
          const scaleFit = Math.min(maxW / baseViewport.width, maxH / baseViewport.height);
          const w = Math.round(baseViewport.width * scaleFit);
          const h = Math.round(baseViewport.height * scaleFit);
          const x = Math.round((dims.width - w) / 2);
          const y = Math.round((dims.height - h) / 2);

          // Render với tỷ lệ sắc nét Retina (scale 1.5) nhưng dùng JPEG để tăng tốc gấp 15 lần
          const renderScale = Math.min(2.0, Math.max(1.2, scaleFit * 1.5));
          const viewport = page.getViewport({ scale: renderScale });

          const offCanvas = document.createElement('canvas');
          offCanvas.width = Math.round(viewport.width);
          offCanvas.height = Math.round(viewport.height);
          const offCtx = offCanvas.getContext('2d', { alpha: false });

          // Nền trắng tinh khiết
          offCtx.fillStyle = '#ffffff';
          offCtx.fillRect(0, 0, offCanvas.width, offCanvas.height);

          await page.render({
            canvasContext: offCtx,
            viewport: viewport,
            intent: 'display'
          }).promise;

          // JPEG chất lượng 0.88: siêu sắc nét cho tài liệu, nén nhỏ 10x-15x, mã hóa 0ms
          const dataUrl = offCanvas.toDataURL('image/jpeg', 0.88);

          // Dọn bộ nhớ canvas tạm
          offCanvas.width = 0;
          offCanvas.height = 0;

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
            isLocked: true, // Cố định làm nền tài liệu
            pdfPageNum: p,
            pdfFileName: file.name,
            id: `pdf_p${p}_${Date.now()}`
          };

          let targetPageNum;
          if (p === 1) {
            if (isCurrentEmpty) {
              targetPageNum = startPage;
            } else {
              targetPageNum = createNewPage(false);
            }
          } else {
            // Kiểm tra xem trang kế tiếp đã tồn tại và đang hoàn toàn trống không (tránh nhảy cóc bỏ trắng trang 2)
            const nextCandidate = currentTargetPage + 1;
            if (state.pages[nextCandidate] && state.pages[nextCandidate].length === 0) {
              targetPageNum = nextCandidate;
              ensurePageInDOM(targetPageNum);
            } else {
              targetPageNum = createNewPage(false);
            }
          }
          currentTargetPage = targetPageNum;

          if (!state.pages[targetPageNum]) state.pages[targetPageNum] = [];
          state.pages[targetPageNum].push(imgEl);

          // Chờ ảnh giải mã trong luồng ngầm trước khi vẽ
          if (pdfImg.decode) {
            await pdfImg.decode().catch(() => {});
          } else {
            await new Promise((res) => {
              if (pdfImg.complete) res();
              else {
                pdfImg.onload = res;
                pdfImg.onerror = res;
              }
            });
          }

          // Vẽ ngay lập tức trang vừa nạp lên màn hình
          renderPage(targetPageNum);
          updateThumbnail(targetPageNum);

          // Nhường luồng cho trình duyệt cập nhật UI không bị đơ
          await new Promise(r => setTimeout(r, 0));
        }

        renderAllTabs();
        renderThumbnails();
        updatePageNav();
        updateSidebarCount();
        switchPage(startPage, false);
        renderPage('all');
        showPageToast(`✅ Đã nhập thành công toàn bộ ${numPages} trang PDF sắc nét!`);
        saveProject(false);
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
  setCanvasCursor(getPenCursor());
  renderAllTabs();
  renderThumbnails();
  updateScrollBanner();
  // Tự động căn vừa màn hình khi mở
  setTimeout(() => {
    fitCanvasToWidth();
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
      findPointAt,
      resolveElementPoint,
      drawGeometricShape,
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
      getDependentElements,
      updateDependentBindings,
      constructTangent,
      constructTwoTangents,
      constructPerpendicular,
      constructParallel,
      constructPerpendicularBisector,
      constructPerpendicularBisectorFromEdge,
      constructPointSymmetry,
      constructAxisSymmetry,
      constructCircumcircle,
      constructIncircle,
      constructIntersectionFromTwoObjects,
      areElementsLinked,
      updateSingleBinding,
      translateElement,
      SOLID_SHAPES,
      isSolidShape,
      computeSolidShapeData,
      handleSolidShapeDrag,
      updateRegularPyramidCenterAndApex,
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
      removeFloatingAngleBox,
      findIntersectionSnapAtPoint,
      handlePointerDown,
      handlePointerMove,
      finishDrawing,
      isElementInSelectionBox,
      getElementBoundingBox,
      getCombinedBoundingBox,
      cloneElementsGroup,
      toggleElementSelection,
      cutSelectedElements,
      copySelectedElements,
      pasteClipboardElements,
      duplicateSelectedElements,
      deleteSelectedElements,
      changeSelectedElementsColor,
      rotateSelectedElements,
      groupSelectedElements,
      ungroupSelectedElements,
      showFloatingSelectionBar,
      hideFloatingSelectionBar,
      resolveNamingTargetAt,
      resolveNamingTargetFromHandle,
      resolveNamingTargetFromEdge,
      getTargetCurrentName,
      applyNameToTarget,
      getTargetCurrentDash,
      applyDashToTarget,
      getTargetCurrentColor,
      applyColorToTarget,
      openRenamePopover,
      closeRenamePopover,
      handleCanvasContextMenu
    };
    window.__netRotate2D = rotateElement2D;
    window.__netAnimateSmoothRotation3D = animateSmoothRotation3D;
    window.__netSwitchPage = switchPage;
  }
});

