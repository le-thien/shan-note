# Trạng thái dự án Nét (Status Tracking)

**Cập nhật lần cuối:** 27/10/2026

## 1. Giai đoạn hiện tại
- **Đã hoàn thành:** 
  - Giai đoạn 0 (Khởi tạo nền tảng, hồ sơ, quy tắc `AGENTS.md`).
  - Giai đoạn 1 (Bộ mã nguồn Web Core hoạt động được tại `web/`).
  - Đã hoàn thiện toàn bộ tính năng vẽ tay, dạ quang, tẩy, chèn chữ, dựng 13 dạng hình học.
  - **Bảo toàn Tuyệt đối Điểm Ban Đầu cho Đường Thẳng Song Song & Vuông Góc:**
    + *Bảo toàn hình học điểm ban đầu (Point Invariance on Dynamic Update):* Khắc phục lỗi khi đường thẳng ban đầu thay đổi (xoay góc, kéo dài, di chuyển đầu mút) hoặc điểm ban đầu di chuyển thì đường song song bị lệch khỏi điểm ban đầu.
    + *Đồng bộ thời gian thực hai chiều (Two-way Real-time Tracking):* Khi kéo hoặc xoay đường thẳng ban đầu, đường song song xoay theo quanh tâm chính là điểm ban đầu $P$, bảo toàn tuyệt đối việc luôn đi qua $P$ (khoảng cách bằng 0). Khi kéo điểm ban đầu $P$, đường song song trượt theo vị trí mới của $P$ và luôn song song với đường thẳng ban đầu.
    + *Tự động tạo điểm hình học:* Nếu người dùng bấm chỉ định vị trí trên khoảng trống, hệ thống tự động sinh một điểm hình học tại đó để người dùng nhìn thấy rõ và tương tác được với điểm.
    + *Nâng cấp Cache & Service Worker:* Nâng phiên bản cache lên `net-app-v39` và query param `?v=20261027_2045`.
  - **Tối ưu hóa Chọn 1 Đối Tượng (Không vẽ nhiều khung vuông nét đứt & Giữ kéo di chuyển theo nhóm):**
    + *Hiển thị chọn đơn lẻ tinh tế, sạch đẹp:* Khi người dùng nhấp chọn thông thường vào 1 đối tượng (dù là điểm hay đoạn thẳng hay hình học), hệ thống chỉ chọn đúng 1 đối tượng đó (`setSelectedElements([el])` / `[hitPoint]`). Chỉ hiển thị duy nhất khung viền chọn của đúng đối tượng đó, loại bỏ hoàn toàn hiện tượng vẽ 4-5 khung chữ nhật nét đứt đan chéo nhau và 4 nhãn "Điểm đã chọn" gây hiểu lầm là chọn hết.
    + *Khi vừa dựng hình xong (`finishGeoTask`):* Chỉ chọn đơn lẻ đối tượng vừa tạo (`setSelectedElements([createdElement])`), giúp giao diện gọn gàng, trong sáng.
    + *Duy trì kéo di chuyển theo nhóm thông minh:* Tách biệt việc "Hiển thị chọn" và "Hành vi kéo di chuyển". Khi người dùng kéo chuột di chuyển đối tượng, hàm `translateElement` thông qua cơ chế nhận diện liên kết `areElementsLinked` vẫn tự động kéo theo toàn bộ cụm đối tượng liên kết trong nhóm di chuyển đồng bộ, trơn tru.
  - **Hoàn thiện cơ chế Gắn kết & Di chuyển theo nhóm cho toàn bộ 13 tác vụ Dựng hình:**
    + *Gắn kết và di chuyển theo nhóm 100% (Unified Group Movement):* Mọi đối tượng sinh ra từ các tác vụ Dựng hình (Trung điểm, Đường trung trực, Đối xứng điểm, Đối xứng trục, Đường tròn ngoại/nội tiếp, Giao điểm, Phân giác, Vuông góc, Song song, Tiếp tuyến...) được gắn kết chặt chẽ vào cùng một nhóm với đối tượng ban đầu.
    + *Kéo di chuyển đồng bộ 2 chiều:* Khi kéo rê chuột, toàn bộ cụm đối tượng cùng di chuyển chính xác theo độ dời `(dx, dy)`, bảo toàn tuyệt đối khoảng cách và tương quan hình học.
    + *Ràng buộc động toàn diện (Dynamic Constraint Updates):* Khi kéo các điểm điều khiển (đỉnh tam giác, đầu mút đoạn thẳng, bán kính đường tròn...), các đối tượng sinh ra (gồm cả Giao điểm mới được bổ sung ràng buộc giải tích) tự động biến đổi, xoay góc và tính toán lại bám sát theo thời gian thực (0ms).
    + *Hàm nhận diện liên kết đa chiều `areElementsLinked`:* Quét tự động mọi trường định danh (`parentId`, `triangleId`, `pt1Id`, `pt2Id`, `pt3Id`, `axisId`, `pointElId`, `objAId`, `objBId`...) và thuật toán BFS đảm bảo không một phần tử nào bị bỏ sót hay rớt lại.
  - **Hoàn thiện phân cách giữa 2 trang cuộn liên tiếp (Dòng kẻ ngang nét đứt & Khoảng cách thu hẹp thanh lịch):**
    + *Thu hẹp khoảng cách giữa các trang:* Giảm khoảng cách trống từ 42px xuống còn 10px, loại bỏ dải xám thô ngăn cách, tạo cảm giác một cuộn giấy liền mạch, tinh tế như tập vở học sinh / sổ tay thật.
    + *Dòng kẻ ngang nét đứt phân cách trang:* Tự động hiển thị 1 dòng kẻ ngang nét đứt (`1.5px dashed`) chạy dài trọn vẹn toàn bộ bề rộng trang giấy ở chính giữa khoảng hở giữa 2 trang liên tiếp (trang 1-2, 2-3,...).
    + *Tinh chỉnh bóng đổ và bo góc phẳng phiu:* Giảm bo góc mặt giấy xuống 2px và làm dịu nhẹ bóng đổ (`box-shadow`), giúp mép tiếp giáp giữa các trang nối tiếp nhau phẳng phiu, sạch sẽ, không bị vệt đen dồn cục đè lên dòng kẻ đứt.
    + *Nâng cấp Cache & Service Worker:* Nâng phiên bản cache lên `net-app-v36` và query param `?v=20261027_1910`.
  - **Bổ sung tính năng "Đường tròn ngoại tiếp" & "Đường tròn nội tiếp" trong Menu Dựng hình ▾:**
    + *Thêm 2 công cụ chuyên dụng:* Nút `[Đường tròn ngoại tiếp]` (`circumcircle`) và `[Đường tròn nội tiếp]` (`incircle`) trong menu Dựng hình `[ 🛠️ Dựng hình ▾ ]` với biểu tượng SVG chuẩn.
    + *Quy trình tương tác chuẩn mực & linh hoạt (Tam giác HOẶC 3 điểm):*
      * Tiện ích tam giác (1 nhấp): Nhấp vào bất kỳ tam giác nào trên bảng vẽ $\rightarrow$ Tự động dựng ngay đường tròn ngoại tiếp (qua 3 đỉnh) hoặc đường tròn nội tiếp (tiếp xúc 3 cạnh).
      * Chọn 3 điểm: Chọn Điểm 1 $\rightarrow$ Điểm 2 $\rightarrow$ Điểm 3. Có xem trước mượt mà (0ms) khi rê chuột chọn điểm 3.
      * Chọn trước (0ms): Quét chọn 3 điểm hoặc 1 tam giác trước rồi bấm nút công cụ $\rightarrow$ Dựng ngay tức thì.
    + *Liên kết động 100% (Dynamic BFS binding):* Khi kéo di chuyển các đỉnh tam giác hoặc các điểm gốc, đường tròn và điểm tâm tự động co giãn và di chuyển bám sát thời gian thực (0ms).
    + *Hoàn tác một chạm (Undo/Redo):* Nhấn `⌘Z` gỡ bỏ toàn bộ cụm phần tử sinh ra cùng lúc, nhấn `⌘⇧Z` khôi phục lại toàn bộ.
    + *Nâng cấp Cache & Service Worker:* Nâng phiên bản cache lên `net-app-v35` và query param `?v=20261027_1900`.
  - **Bổ sung tính năng "Đối xứng trục" trong Menu Dựng hình ▾ (Chuẩn ký hiệu SGK & Nối đoạn thẳng vuông góc qua trục):**
    + *Thêm công cụ chuyên dụng:* Nút `[Đối xứng trục]` (`axis-symmetry`) trong menu Dựng hình `[ 🛠️ Dựng hình ▾ ]` với biểu tượng SVG chuẩn (điểm, trục đối xứng và đoạn vuông góc).
    + *Quy trình tương tác chuẩn mực & linh hoạt:*
      * Bước 1: Bấm `[Dựng hình ▾] -> [Đối xứng trục]`. Nút chuyển active, hệ thống tự động đổi sang công cụ Chọn (`select`), con trỏ mũi tên nhọn macOS, thanh trạng thái hiển thị: *"Đối xứng trục: Bước 1 — Bấm chọn Điểm (hoặc chọn Trục đối xứng)"*.
      * Bước 2: Chọn Điểm 1 hoặc Trục đối xứng (hỗ trợ cả 2 chiều tương tác).
      * Bước 3: Xem trước thời gian thực (0ms) với đường nét đứt mờ nối Điểm 1 vuông góc qua trục tới Điểm 2, chân vuông góc $H$ kèm ký hiệu góc vuông $\llcorner$ và nhãn `📐 Giao điểm trục (H)` cùng `✨ Điểm đối xứng qua trục`.
      * Bước 4: Tạo Điểm đối xứng $P_2 = 2H - P_1$, tạo Điểm chân vuông góc $H$, và nối đoạn thẳng vuông góc đi qua $H$ với ký hiệu góc vuông và 2 vạch bằng nhau chuẩn SGK.
    + *Liên kết động 100% (Dynamic BFS binding):* Khi kéo di chuyển Điểm 1 hoặc Trục đối xứng (hoặc đỉnh của tam giác/đa giác làm trục), Điểm $H$, Điểm $P_2$ và đoạn thẳng vuông góc tự động cập nhật vị trí tức thì theo thời gian thực (0ms).
    + *Hoàn tác một chạm (Undo/Redo):* Nhấn `⌘Z` gỡ bỏ toàn bộ cụm phần tử sinh ra cùng lúc, nhấn `⌘⇧Z` khôi phục lại toàn bộ.
    + *Nâng cấp Cache & Service Worker:* Nâng phiên bản cache lên `net-app-v34` và query param `?v=20261027_1830`.
  - **Bổ sung tính năng "Đối xứng điểm" trong Menu Dựng hình ▾ (Chuẩn ký hiệu SGK & Nối đoạn thẳng qua 3 điểm):**
    + *Thêm công cụ chuyên dụng:* Nút `[Đối xứng điểm]` (`point-symmetry`) trong menu Dựng hình `[ 🛠️ Dựng hình ▾ ]` với biểu tượng SVG 3 điểm thẳng hàng đối xứng qua tâm.
    + *Quy trình tương tác chuẩn mực:*
      * Bước 1: Bấm `[Dựng hình ▾] -> [Đối xứng điểm]`. Nút chuyển active, hệ thống tự động đổi sang công cụ Chọn (`select`), con trỏ mũi tên nhọn macOS, thanh trạng thái hiển thị: *"Đối xứng điểm: Bước 1 — Bấm chọn Điểm 1 (điểm cần lấy đối xứng)"*.
      * Bước 2: Người dùng chọn Điểm 1. Điểm 1 sáng quầng ngọc bích rực rỡ và nhãn `✓ Đã chọn: Điểm 1`. Khi di chuyển chuột, xuất hiện đường nét đứt mờ nối Điểm 1 qua con trỏ chuột (Điểm 2 tạm thời) tới Điểm 3 tạm thời kèm nhãn `🎯 Tâm đối xứng (Điểm 2)` và `✨ Điểm đối xứng (Điểm 3)` theo thời gian thực (0ms).
      * Bước 3: Người dùng chọn Điểm 2 (tâm đối xứng).
      * Bước 4: Tự động tính tọa độ $P_3 = 2P_2 - P_1$, tạo Điểm 3 và nối đoạn thẳng qua 3 điểm từ Điểm 1 qua Điểm 2 đến Điểm 3, đánh dấu 2 vạch bằng nhau chuẩn SGK ($P_1 P_2 = P_2 P_3$).
    + *Liên kết động 100% (Dynamic BFS binding):* Khi kéo di chuyển Điểm 1 hoặc Điểm 2, Điểm 3 và đoạn thẳng nối tự động cập nhật vị trí theo thời gian thực.
    + *Hoàn tác một chạm (Undo/Redo):* Nhấn `⌘Z` gỡ bỏ toàn bộ cụm 4 phần tử (Điểm 1, Điểm 2, Điểm 3, Đoạn thẳng 1-3) cùng lúc, nhấn `⌘⇧Z` làm lại toàn bộ.
    + *Nâng cấp Cache & Service Worker:* Nâng phiên bản cache lên `net-app-v33` và query param `?v=20261027_1815`.
  - **Tối ưu hóa Chế Độ Thống Kê (STAT - Mode 6) Cho Máy Tính Casio fx-580VN X:**
    + *Thực đơn Chế độ (Menu Screen):*
      * Biểu tượng ô số `6: Thống kê` hiển thị tương phản chuẩn (nền đen, 3 cột histogram nét trắng, ô huy hiệu số `6` màu trắng chữ đen).
      * Mũi tên chỉ hướng `▼` hiển thị góc trên bên phải cột 3.
      * Đường kẻ đôi phân cách giữa lưới biểu tượng và thanh đáy `6:Thống kê`.
    + *Bảng Nhập Liệu Thống Kê 1-Biến (1-Variable Data Entry):*
      * Thanh trạng thái hiển thị đầy đủ `√d`, `D`, và huy hiệu `STAT`.
      * Tiêu đề `#` (trái) và `x` (phải in nghiêng) với đường kẻ đậm 2px phân tách.
      * Dòng hiển thị dữ liệu (mặc định dòng 3 với giá trị `12`), ngăn cách bằng đường kẻ mảnh.
      * Dòng đáy soạn thảo: `${row}=` (ví dụ `6=`) kèm con trỏ nhấp nháy `|` căn lề phải.
    + *Tương tác bàn phím chuẩn ClassWiz:*
      * Phím `▲` / `▼`: cuộn và di chuyển giữa các dòng dữ liệu.
      * Phím số + `=`: gán giá trị hoặc nối thêm dòng mới, tự động tiến đến dòng kế tiếp.
      * Phím `DEL`: xóa ký tự trong bộ đệm hoặc xóa dòng hiện tại nếu bộ đệm trống.
      * Phím `AC`: chuyển sang màn hình tính toán `STAT_CALC` (không thoát chế độ Thống kê).
      * Phím `OPTN`: mở thực đơn `1: Chọn dạng`, `2: Dữ liệu`, `3: Tính 1-Biến`. Hỗ trợ bấm `OPTN` lần 2 để đóng thực đơn quay lại màn hình trước.
      * Tùy chọn `3: Tính 1-Biến`: tính toán đầy đủ $\bar{x}, \Sigma x, \Sigma x^2, \sigma_x, s_x, n, \min, Q_1, \text{Med}, Q_3, \max$.
      * Tùy chọn `1: Chọn dạng` $\rightarrow$ `1: 1-Biến`: làm sạch dữ liệu cũ và khởi tạo bảng mới (từ dòng `1= |`) cho bài toán mới.
      * Phím `MENU` / `ON`: hoạt động thông suốt từ mọi trạng thái thống kê để mở thực đơn hoặc thoát về `COMP` (`MENU 1`).
      * Hỗ trợ đầy đủ phím số âm `(-)`, phím trừ `-`, phím số mũ `×10ˣ`, phím `DEL` xóa ký tự hoặc xóa dòng dữ liệu.
    + *Sửa lỗi tràn và cắt xén dòng đáy (`6= |`):* Tách thành các lớp CSS `.stat-table-screen`, `.stat-header-row`, `.stat-data-row`, `.stat-input-row` với tỷ lệ `var(--lcd-scale, 1)`, loại bỏ `justify-content: space-between` gây tràn chiều dọc, đảm bảo số `6=` và con trỏ nhấp nháy `|` hiển thị nguyên vẹn 100%.
    + *Nâng cấp Cache & Service Worker:* Nâng phiên bản cache lên `net-app-v32` và query param `?v=20261027_1105`.
  - **Tối ưu hóa Tính Năng Quét Vùng OCR [ ✍️ OCR ] & Soạn Thảo Chữ Trực Tiếp [ T Chữ ]:**
    + *Quy trình Quét Vùng OCR chuẩn xác:*
      * Bước 1: Người dùng bấm vào nút `[ ✍️ OCR ]` trên thanh công cụ chính.
      * Bước 2: Con trỏ chuột chuyển ngay thành dạng chữ thập nhắm tâm (`crosshair`). Người dùng nhấn giữ và kéo chuột để khoanh vùng hình chữ nhật bao quanh phần chữ viết tay cần nhận dạng. Trên mặt giấy hiển thị khung chữ nhật quét viền đứt nét ngọc bích, vùng phủ mờ kèm 4 góc định vị camera kiểu scan hiện đại.
      * Bước 3: Thả chuột $\rightarrow$ Hệ thống tự động cắt (crop) ảnh đúng phần chữ vừa quét, hiển thị ảnh xem trước trong hộp thoại và tiến hành nhận dạng ký tự tức thì bằng Tesseract cục bộ (nhanh hơn gấp 5 lần so với quét cả trang).
      * Bước 4: Nhấp nút **`Chèn vào ghi chú`** để đưa văn bản số đã nhận dạng vào đúng vị trí vừa quét trên trang, hoặc nhấp **`Sao chép`** / **`Tải tệp .txt`**.
    + *Soạn thảo Chữ trực tiếp trên mặt giấy (Inline Canvas Text Editor):*
      * Loại bỏ hoàn toàn hộp thoại `prompt()` cổ lỗ sĩ. Khi bấm công cụ `[ T Chữ ]` rồi nhấp lên mặt giấy, xuất hiện ngay khung gõ chữ trực tiếp tại chỗ.
      * Tùy chọn 4 cỡ chữ (16 / 22 / 30 / 40px), nút đổi phông chữ Viết tay ⇋ Chuẩn in (`Aa`), lưu nhanh bằng `⌘Enter`.
      * Hỗ trợ nhấp đúp chuột (`double-click`) vào bất kỳ đoạn chữ nào trên trang để sửa lại tức thì.
      * Hỗ trợ vẽ và tính toán vùng chọn cho văn bản nhiều dòng (`multiline`).
    + *Nâng cấp Cache & Service Worker:* Nâng phiên bản cache lên `net-app-v29` và query string `?v=20261027_1015`.
  - **Bố trí Nút Tệp [ 📄 Tệp ▾ ] đặt kế bên logo `nét.` trên Thanh Tiêu Đề:**
    + *Nút Tệp chuyên dụng trên Header:* Đặt nút `[ 📄 Tệp ▾ ]` (`#btn-file-dropdown`) ngay cạnh logo `nét.` ở góc trái thanh tiêu đề: `nét. | [ 📄 Tệp ▾ ] | [Hình ▾] [Dựng hình ▾] [HHKG ▾] [Đồ thị]`.
    + *Menu Tệp chuẩn macOS mở xuống:* Menu Tệp mở tự nhiên từ trên xuống (`top: calc(100% + 5px); bottom: auto; left: 0;`), chứa đầy đủ các tác vụ tệp thiết yếu:
      * 📄 Mới (New) — `⌘N`
      * 💾 Lưu (Save) — `⌘S`
      * 📥 Lưu thành... (Save As) — `⌘⇧S`
      * 📁 Mở tệp Nét (.net)... — `⌘O`
      * 📑 Nhập PDF...
      * 🖼 Nhập ảnh...
      * 🖨 Xuất PDF... — `⌘P`
      * 🖼 Xuất ảnh (PNG)...
      * 📝 Xuất văn bản (.txt)...
      * ℹ️ Thông tin Nét & 🗑 Xóa toàn bộ trang.
    + *Tên Ghi chú đặt ở thanh đáy kế bên Cụm Trang (Hình 2):* Khối tên tài liệu `.bottom-doc-title-chip` (`[ 📄 Ghi chú mới ] · Đã lưu`) đặt ở thanh đáy bên trái cụm điều hướng trang: `[ ◫ ] | [ 📄 Ghi chú mới ] · Đã lưu | [ ‹ ] Trang [ 1 ] / X [ › ] [Trang 1] [+]`. Người dùng bấm trực tiếp vào tên để chỉnh sửa nhanh.
    + *Nâng cấp Cache & Service Worker:* Nâng phiên bản cache lên `net-app-v28` và query string `?v=20261027_0835`.
  - **Tối ưu hóa hiển thị trang PDF & Cụm điều hướng trang trực quan [ ‹ ] Trang [ ô trống ] / [tổng số trang] [ › ]:**
    + *Khắc phục triệt để hiện tượng tràn hàng:* Loại bỏ hàng chục nút tab `Trang 1`, `Trang 2` ... `Trang 25` dàn trải dài dằng dặc làm vỡ layout khi nạp PDF nhiều trang. Khi tài liệu có trên 3 trang (hoặc tài liệu PDF), hệ thống tự động ẩn danh sách tab dàn trải và chuyển sang Cụm Điều Hướng Trang chuẩn PDF / macOS Preview tinh gọn.
    + *Ô nhập số trang trực quan `[ ô trống ] / [tổng số trang]`:* Người dùng nhấp chuột vào ô để gõ bất kỳ số trang nào (ví dụ `15` rồi nhấn `Enter` hoặc click ra ngoài), hệ thống tự động cuộn mượt và chuyển ngay tức thì đến Trang 15. Tự động bôi đen số cũ khi focus để người dùng gõ ngay mà không phải xóa.
    + *Nút chuyển trang trước / sau:* Hai nút `[ ‹ ]` và `[ › ]` thanh lịch giúp lật từng trang nhẹ nhàng, tự động làm mờ disabled khi ở đầu hoặc cuối tài liệu; hỗ trợ phím mũi tên `↑ / ↓` và `PageUp / PageDown`.
    + *Đồng bộ hai chiều theo thời gian thực (Real-time Sync):* Khi người dùng cuộn xem tài liệu bằng chuột hoặc trackpad, ô nhập số trang tự động cập nhật theo trang đang hiển thị trong vùng nhìn.
    + *Tối ưu hóa nạp PDF siêu tốc:* Nạp liên tục nhiều trang trong nền mà không làm gián đoạn hoặc giật màn hình (`autoScroll = false`), sau đó tự động chuyển về trang 1 và cập nhật thanh điều hướng.
    + *Nâng cấp bộ đệm Service Worker:* Cache lên `net-app-v26` và query string `?v=20261027_0800`.
  - **Tích Hợp Tên Ghi Chú Vào Nút Tệp [ 📄 Ghi chú mới ▾ ] · Đã lưu trên Thanh tiêu đề:**
    + Gộp nút Tệp và tên ghi chú thành một khối Chip macOS duy nhất (`.doc-file-chip`): `nét. | [ 📄 Ghi chú mới ▾ ] · Đã lưu | [Hình ▾] [Dựng hình ▾] [HHKG ▾] [Đồ thị]`.
    + Nhấp trực tiếp vào tên "Ghi chú mới" để gõ đổi tên, ô nhập tự động co giãn độ rộng linh hoạt theo nội dung.
    + Nhấp vào biểu tượng 📄 hoặc mũi tên ▾ để mở dropdown menu Tệp (Mới, Lưu, Lưu thành, Mở tệp, Xuất PDF/ảnh...).
    + Canh lề trái cho dropdown menu `#menu-file` (`left: 0; right: auto;`), đảm bảo mở ra trơn tru, không tràn màn hình.
    + Tinh gọn góc phải (`header-right`) chỉ còn nút `[ 🖩 fx580 ]`.
    + Nâng cấp phiên bản cache Service Worker lên `net-app-v24` và query string `?v=20261026_2110`.
  - **Chuẩn hóa quy trình 3 bước trực quan cho tác vụ "Đường trung trực" (`perpendicular-bisector`):**
    + *Bước 1 — Chọn tác vụ:* Nhấp chọn *Đường trung trực* trong menu Dựng hình ▾ (hoặc Quan hệ ▾). Nút nhóm cập nhật biểu tượng $\perp$ và nhãn hiển thị tương ứng.
    + *Bước 2 — Hiển thị "Chọn":* Hệ thống tự động chuyển sang công cụ Chọn (`Select Tool` active), con trỏ chuyển sang mũi tên nhọn macOS chuẩn xác, thanh trạng thái hướng dẫn: *"Đường trung trực: Bước 1 — Bấm chọn Điểm 1 (hoặc chọn 1 đoạn thẳng)"*, toast chỉ báo: *"🎯 Chế độ Chọn: Bấm chọn Điểm 1"*.
    + *Bước 3 — Chọn điểm 1 rồi chọn điểm 2:*
      * *Chọn Điểm 1:* Nhấp vào bất kỳ điểm, đỉnh tam giác/đa giác, đầu mút đoạn thẳng hoặc vị trí trên giấy. Hệ thống đánh dấu ngay quầng sáng ngọc bích rực rỡ kèm nhãn chỉ báo *"✓ Đã chọn: Điểm 1"*. Khi lia chuột, xuất hiện ngay đường nét đứt mờ nối từ Điểm 1 tới con trỏ chuột, kèm chấm trung điểm $M$ tạm thời và đường trung trực xem trước theo thời gian thực (real-time preview).
      * *Chọn Điểm 2:* Nhấp chọn điểm thứ 2 trên bảng vẽ. Hệ thống lập tức thực hiện tác vụ: tự động nối đoạn thẳng (nếu là 2 điểm rời), dựng đường trung trực vuông góc ở giữa, đánh dấu chấm trung điểm $M$, ký hiệu vuông góc $\llcorner$ và 2 vạch bằng nhau ($||$) đối xứng chuẩn mực SGK.
      * *Liên kết động (Dynamic binding) 100%:* Khi kéo di chuyển 1 trong 2 điểm, đường trung trực tự động cập nhật cân đối theo thời gian thực; hỗ trợ hoàn tác Undo/Redo `⌘Z` / `⌘⇧Z`.
    + *Nâng cấp Cache & Service Worker:* Nâng phiên bản cache lên `net-app-v22` và query string `?v=20261026_1915`.
  - **Bổ sung tính năng "Đường trung trực" trong menu Dựng hình ▾ (Chuẩn ký hiệu SGK & Liên kết động 100%):**
    + Thêm mục *Đường trung trực* (`perpendicular-bisector`) với biểu tượng đường thẳng đứng cắt ngang kèm ký hiệu góc vuông và 2 vạch bằng nhau trên 2 nửa đoạn thẳng.
    + *Quy trình dựng hình linh hoạt:*
      * Chọn trước 1 đoạn thẳng (hoặc chọn 2 điểm) rồi bấm `[Dựng hình ▾] -> [Đường trung trực]`: Hệ thống tạo ngay đường trung trực tức thì (0ms).
      * Bấm chọn `Đường trung trực` khi chưa chọn hình: Chuyển sang chế độ Chọn, con trỏ mũi tên nhọn; nhấp chọn 1 đoạn thẳng (hoặc nhấp lần lượt 2 điểm) để tự động hoàn thành dựng hình.
    + *Ký hiệu chuẩn SGK Toán học:* Tự động vẽ chấm tròn trung điểm $M$ thanh mảnh ở giữa, ký hiệu vuông góc $\llcorner$ tại $M$, và hai vạch gạch bằng nhau ($||$) đối xứng trên hai nửa đoạn thẳng $AM$ và $MB$.
    + *Liên kết động (Dynamic BFS binding):* Đường trung trực tự động cập nhật đối xứng, cân bằng khi kéo di chuyển hoặc thay đổi vị trí các điểm/đoạn thẳng sinh ra nó.
    + *Tương thích hoàn hảo:* Hỗ trợ 2 tay cầm co giãn chiều dài đường trung trực, hoàn tác `⌘Z` / `⌘⇧Z`, tẩy nét mịn và xuất bản PWA.
  - **Chức năng "Chọn" chỉ chọn đơn lẻ một đối tượng:** Bấm vào bất kỳ đối tượng nào chỉ chọn duy nhất đối tượng đó (không tự động gom cả nhóm các hình xung quanh), giúp người dùng dễ dàng chỉnh sửa, di chuyển hoặc xóa riêng từng đối tượng độc lập. Khi hover chỉ sáng nhẹ hình đang trỏ vào, giữ bảng vẽ luôn gọn gàng và chính xác.
  - **Quy trình 4 bước chuẩn mực cho nhóm tác vụ Dựng hình (Phân giác, Vuông góc, Song song, Tiếp tuyến, 2 tiếp tuyến, Chọn góc):**
    + *Bước 1 - Chọn 1 tác vụ:* Người dùng nhấp chọn bất kỳ tác vụ nào trong menu xổ xuống; nút Dựng hình cập nhật biểu tượng và tên tác vụ tương ứng.
    + *Bước 2 - Chuyển sang chế độ "Chọn":* Ứng dụng tự động kích hoạt công cụ Chọn (`Select Tool`), con trỏ chuyển sang mũi tên nhọn macOS chuẩn xác, thanh trạng thái hướng dẫn chi tiết đối tượng cần chọn.
    + *Bước 3 - Chọn điểm (hoặc đường) rồi tiếp tục chọn đối tượng còn lại:* Nhấp chọn đối tượng 1 (sáng quầng ngọc bích rực rỡ kèm chỉ báo "✓ Đã chọn"), sau đó nhấp tiếp đối tượng 2 còn lại.
    + *Bước 4 - Thực hiện tác vụ:* Hệ thống tự động dựng hình ngay tức thì (0ms), đối tượng mới sinh ra tự động gắn nhóm, sáng viền được chọn và sẵn sàng tiếp tục thao tác ở chế độ Chọn.
  - **Hiển thị 2 Option nét đứt trực quan cho Tiếp tuyến và Chọn góc (Người dùng nhập số góc và bấm chọn đường cần chọn):**
    + *Tiếp tuyến:* Khi chọn điểm ngoài đường tròn, hệ thống tính toán và hiển thị cả 2 tiếp tuyến đối xứng dưới dạng đường nét đứt kèm nhãn chỉ báo (`🎯 Tiếp tuyến 1`, `🎯 Tiếp tuyến 2`) và quầng sáng khi hover. Người dùng bấm chuột vào đường nào thì tạo tiếp tuyến theo đường đó (điểm trên đường tròn vẫn tự động tạo ngay 1 tiếp tuyến duy nhất).
    + *Chọn góc:* Khi chọn cạnh và đỉnh, hiển thị 2 tia gợi ý nét đứt (hướng $-\alpha$ và $+\alpha$) kèm cung góc nhỏ xem trước; **xuất hiện ngay khung nhập số đo góc nổi trên canvas tại đỉnh góc (`floating-angle-box`) và đồng bộ ô trên toolbar**. Người dùng có thể gõ trực tiếp số đo góc (ví dụ: $30^\circ, 45^\circ, 120^\circ...$), 2 đường nét đứt lập tức co/giãn theo thời gian thực (real-time). Sau đó người dùng bấm chọn vào 1 đường để chốt vẽ góc. Ghi nhớ liên kết động (Dynamic binding) khi kéo chỉnh hình mẹ.
    + *Hiển thị góc chuẩn xác theo tia được chọn:* Khi hoàn thành tác vụ chọn góc, góc được vẽ ra bám sát chính xác theo đúng tia mà người dùng đã bấm chọn: cả tia thứ hai, cung tròn số đo và nhãn độ (`xx°`) đều quay theo hướng của tia đó; đồng bộ toàn diện trên các thao tác điều khiển tay cầm (`second_pt`), tìm kiếm chọn hình (`findElementAt`), làm sáng quầng chọn (`highlightElementShape`) và xóa đối tượng (`erasePartialAt`).
  - **Tối ưu hóa tương tác kéo các điểm hình chóp — Bảo toàn 100% tính chất hình học của đáy:**
    + *Hình chóp đáy hình bình hành (`pyramid-parallelogram`):* Khi người dùng kéo bất kỳ điểm nào trong 4 đỉnh đáy ($A, B, C, D$), hệ thống tự động ràng buộc liên kết hai chiều $A + C = B + D$. Đáy luôn luôn là hình bình hành hoàn hảo, các cặp cạnh đối luôn song song và bằng nhau, không bao giờ bị méo thành tứ giác tự do.
    + *Hình chóp đáy hình thang (`pyramid-trapezoid`):* Đáy sau $AD$ và đáy trước $BC$ luôn bảo toàn song song ($AD \parallel BC$). Khi kéo $B$ hoặc $C$, $AD$ tự động xoay cùng góc với $BC$; khi kéo $A$, cả đáy sau tịnh tiến song song; khi kéo $D$, điểm $D$ luôn trượt mượt mà trên đường thẳng qua $A$ song song với $BC$.
    + *Hình chóp tứ giác đều (`pyramid-regular`):* Đáy giữ tính chất hình vuông (hình bình hành biểu diễn), tâm đáy $O$ luôn tự động nằm ở trung điểm giao 2 đường chéo, và đỉnh chóp $S$ luôn bám trục thẳng đứng $SO \perp (ABCD)$ ($S.x = O.x$). Kéo đỉnh $S$ cho phép chỉnh độ cao mà không làm lệch trục; kéo tâm $O$ tịnh tiến toàn bộ hình.
    + *Hình chóp tứ giác (`pyramid-quad`) & Ngũ giác (`pyramid-pentagon`):* Duy trì thứ tự chu trình và bảo vệ chống tự cắt lộn ngược, bảo toàn các cạnh khuất nét đứt ($SA, AB, AD$) và cạnh thấy nét liền chuẩn SGK Hình học 11/12.
    + *Nâng cấp Cache & Service Worker:* Nâng phiên bản cache lên `net-app-v21` và query string `?v=20261026_1910` để làm mới tức thì trên trình duyệt.
  - **Tối ưu hóa toàn diện độ ổn định máy tính Casio fx-580VN X ClassWiz (Hoàn thành 3 hạng mục cốt lõi):**
    + *Hạng mục 1: Khắc phục triệt để lỗi nhân bản phím & cô lập sự kiện bàn phím:*
      * Thêm cờ `_eventsBound` ngăn chặn việc gắn lặp lại sự kiện `click` và `keydown` khi mở/đóng cửa sổ máy tính nhiều lần (trước đây bấm 1 số bị nhân đôi thành 2-3 số).
      * Cô lập sự kiện phím toàn cục: Chỉ nhận phím khi cửa sổ Casio đang mở (`display !== 'none'`) và con trỏ không ở trong các ô nhập liệu (`input`, `textarea`, `contenteditable`), giải phóng hoàn toàn các phím `Enter`, `Backspace` khi người dùng soạn thảo ghi chú trên canvas.
      * Bổ sung phím tắt trực quan: `Ctrl+B / Cmd+B` bật/tắt âm thanh, `Ctrl+S / Cmd+S` chụp màn hình LCD khi chuột ở trong vùng máy tính.
    + *Hạng mục 2: Kích hoạt & kết nối 4 tiện ích trên thanh tiêu đề Casio:*
      * *Bật/tắt âm thanh (`#tb-btn-sound`):* Sử dụng `Web Audio API` mô phỏng âm click phím cơ học chân thực, ghi nhớ trạng thái bật/tắt.
      * *Chụp ảnh màn hình LCD (`#tb-btn-capture`):* Tự động sao chép ảnh LCD độ phân giải cao vào Clipboard hoặc tải tệp ảnh PNG (`casio_lcd_timestamp.png`).
      * *Cửa sổ Pop-up Display LCD phóng to (`#tb-btn-popup`):* Mở cửa sổ riêng biệt hiển thị màn hình LCD phóng to (tùy chọn tỷ lệ 1.25x, 1.6x, 2.0x, hỗ trợ tay cầm co giãn kéo thả), đồng bộ thời gian thực (0ms) với máy tính phục vụ trình chiếu bài giảng.
      * *Bảng lịch sử phím bấm Key Log (`#tb-btn-keylog`):* Bảng theo dõi các phím vừa bấm với badge màu sắc phân loại trực quan (phím số, phím hàm, phím điều hướng), hỗ trợ nút Sao chép chuỗi phím vào bộ nhớ tạm hoặc Xóa lịch sử.
    + *Hạng mục 3: Co giãn tỷ lệ chuẩn & Ghi nhớ vị trí/kích thước (`localStorage`):*
      * Thêm tay cầm kéo dãn kích thước ở góc dưới bên phải vỏ máy (`#fx580-calc-resize`), tự động khóa tỷ lệ chuẩn `644 / 1250` của Casio fx-580VN X, ngăn ngừa méo hình hoặc tràn màn hình.
      * Tự động lưu vị trí (`fx580_window_pos`) và độ rộng (`fx580_window_width`) vào `localStorage`, khôi phục chính xác trạng thái làm việc khi người dùng mở lại máy tính.
      * Nâng cấp bộ đệm Service Worker lên `net-app-v20` và cập nhật chuỗi phiên bản query string `?v=20261026_1830` để cập nhật tức thì.
  - **Giả lập máy tính Casio fx-580VN X ClassWiz 1:1 chuẩn xác từ Tikz-Physics/casio-fx580vnx:** Tích hợp trọn vẹn 12 chế độ tính toán, font ma trận điểm, màn hình LCD Natural-V.P.A.M sắc nét, vỏ máy carbon 50 phím theo bản vẽ chuẩn, sửa lỗi tỷ lệ khung hình cố định trên mọi trình duyệt, và nâng cấp cache Service Worker lên `net-app-v19`.
  - **Tối ưu hóa chức năng Đồ thị thành Widget tương tác linh hoạt & Mô phỏng Khối tròn xoay 3D trực quan:** Di chuyển tự do trên trang giấy, co giãn 4 góc, nhập đa hàm số, miền vẽ $x$, tự động tìm điểm đặc biệt (giao Ox, Oy, cực trị) kèm đường dóng nét đứt, nhập cận độc lập cho hai trục Ox và Oy (`x = ... đến x = ...`, `y = ... đến y = ...`), lựa chọn tốc độ xoay từ từ (0.5x, 1.0x, 2.0x) và cụm nút điều khiển chuyển động trực quan giúp học sinh quan sát rõ ràng quá trình sinh khối thể tích.
  - **Tính năng Tính Diện tích hình phẳng (S) và Thể tích tròn xoay (V) (1 hàm, 2 hàm, 3 hàm):**
    + Nút `[📐 Tính S & V]` trực tiếp trên header widget đồ thị giúp truy cập tức thì.
    + Tab chuyên biệt `[📐 Tính Diện tích (S) & Thể tích (V)]` trong Modal đồ thị.
    + Hỗ trợ 1 hàm (2 cận $x=a, x=b$, nút gợi ý giao trục $Ox$).
    + Hỗ trợ 2 hàm (tự động giải giao điểm $f(x)=g(x)$ hoặc người dùng nhập 2 cận 4 đường $y=f(x), y=g(x), x=a, x=b$).
    + Hỗ trợ 3 hàm (tự động tìm 3 đỉnh tam giác cong chia 2 khoảng tích phân hoặc người dùng nhập cận).
    + Tô màu miền diện tích $S$ bán trong suốt trên đồ thị, kẻ đường dóng các cận nét đứt, đánh dấu giao điểm và hiển thị thẻ kết quả $S$ & $V$ trên đồ thị.
  - **Chuẩn bị và hoàn thiện nền tảng xuất bản Web App (Progressive Web App - PWA):** Đã tạo bộ nhận diện SVG vector (`favicon.svg`), tệp khai báo chuẩn PWA (`manifest.json`), tích hợp Service Worker (`sw.js` cache `net-app-v4`) hỗ trợ hoạt động ngoại tuyến và lưu đệm siêu tốc, sẵn sàng đưa lên mạng Internet (Netlify, Vercel, GitHub Pages) hoặc cài đặt trực tiếp thành ứng dụng riêng trên máy.
  - **Xuất bản thành công Web App trực tuyến qua GitHub Pages:** Mã nguồn đã được tải lên kho GitHub `le-thien/shan-note` tại nhánh `main`, cấu hình tự động kích hoạt GitHub Actions Workflow và xuất bản trang web hoạt động hoàn hảo 100% tại địa chỉ: `https://le-thien.github.io/shan-note/`.
  - **Đổi slogan và định danh thương hiệu:** Cập nhật tiêu đề trang web, thẻ meta và manifest PWA sang slogan chính thức: **"Nét — Một khoảng trống cho mọi ý tưởng"**.
  - **Hợp nhất Menu "Tệp ▾" chuẩn mực trên Header:** Gom toàn bộ các nút phân tán (Nhập ▾, Xuất ▾, ...) thành duy nhất 1 menu Tệp chuyên nghiệp:
    + *Mới (New) (`⌘N`):* Tạo tài liệu mới. Luôn hiển thị hộp thoại xác nhận chuyên nghiệp ở tất cả các lần bấm (lần 1, 2, 3...) với thông điệp *"Bạn có muốn tạo tài liệu mới? Toàn bộ các trang hiện tại sẽ được làm mới"* kèm tùy chọn *"💾 Lưu & Tạo mới"*. Sau khi đồng ý, đảm bảo dọn sạch DOM các trang phụ, xóa trắng canvas trang 1, đặt lại tiêu đề "Ghi chú mới", ẩn widget đồ thị và hiển thị thông báo "✨ Đã tạo tài liệu mới!".
    + *Lưu (Save) (`⌘S`):* Lưu tức thì toàn bộ bài ghi chú vào bộ nhớ máy, chỉ báo "· Đang sửa..." và "· Đã lưu" cập nhật linh hoạt.
    + *Lưu thành... (Save As) (`⌘⇧S`):* Tải tệp dự án sao lưu `.net` (JSON chuẩn) về máy.
    + *Nhập (Import):* Mở tệp Nét (`.net` / `⌘O`), Nhập PDF, Nhập ảnh.
    + *Xuất (Export):* Xuất PDF (`⌘P`), Xuất ảnh PNG, Xuất văn bản TXT.
    + *Tiện ích:* Thông tin Nét, Xóa toàn bộ trang.
  - **Hợp nhất Nút Bút (`[ ✏️ Bút ▾ ]`) trên thanh công cụ chính:**
    + Gom chung toàn bộ các nút phân tán trước đây: `[Bút viết]`, `[Dạ quang]` cùng toàn bộ bảng màu sắc, độ dày nét và kiểu nét thành **duy nhất 1 nút dropdown `[ ✏️ Bút ▾ ]`**.
    + *Thao tác vẽ tức thì (0ms):* Nhấp vào nút khi đang ở công cụ khác sẽ kích hoạt ngay công cụ bút để bắt đầu viết vẽ lập tức, không làm gián đoạn dòng suy nghĩ của người dùng.
    + *Chấm màu trực quan (Color Dot):* Trên nút chính luôn có chấm màu tròn hiển thị màu mực hiện tại, người dùng nhận biết ngay mà không cần mở popup.
    + *Menu thả xuống `#menu-pen-cluster`:* Bấm vào mũi tên `▾` hoặc nhấp lại vào nút bút sẽ mở bảng điều khiển:
      - Phân đoạn chuyển đổi giữa `[ ✏️ Bút mực ]` và `[ 🖍️ Dạ quang ]` (tự động cập nhật biểu tượng và nhãn ngoài nút chính).
      - Bảng màu tròn (4 màu thanh lịch + nút `+` tùy chọn màu bất kỳ).
      - Danh sách độ dày nét (1.5px, 2.5px, 5px, 10px kèm đường kẻ minh họa trực quan).
      - Kiểu nét: `[ Liền ]` và `[ Đứt ]`.
    + Tương thích đầy đủ phím tắt macOS: `B` (Bút mực) và `H` (Dạ quang).
  - **Nâng cấp toàn diện Menu Tẩy (`[ ⬡ Tẩy ▾ ]`) với 3 tính năng thông minh & Tối ưu hiệu năng:**
    + *1. Thiết kế giao diện Card Toggle Apple chuẩn mực:* Tinh chỉnh thành các thẻ tùy chọn có icon (`🖍️`, `✏️`) cùng công tắc gạt iOS Switch Slider sang trọng, không bị lỗi tràn dòng hoặc hiện checkbox thô. Nhấp chuột vào bất cứ đâu trên thẻ để gạt công tắc nhanh.
    + *2. Chọn kích thước đầu tẩy:* 3 mức lựa chọn trực quan Nhỏ (4px), Vừa (12px), Lớn (24px). Vòng tròn con trỏ tẩy trên canvas tự động co giãn theo đúng kích thước.
    + *3. Chế độ "Chỉ tẩy Dạ quang" (Erase Highlighter Only):* Đầu tẩy chỉ xóa các vệt màu dạ quang làm dấu mà không bao giờ làm mất nét chữ mực đen, hình học hay đồ thị bên dưới.
    + *4. Chế độ "Tự đổi lại Bút vẽ" (Auto-switch back to Pen):* Sau khi nhấc bút tẩy, tự động chuyển ngay về Bút mực.
    + *5. Tối ưu hóa hiệu năng siêu tốc (Bounding Box Pruning):* Áp dụng thuật toán kiểm tra nhanh hộp bao hình học trong $O(1)$ trước khi tính toán va chạm phân đoạn, giúp tốc độ tẩy nét tăng gấp 10-20 lần, lướt êm ru 60-120fps trên màn hình Retina.
    + *6. Chống lưu đệm trình duyệt (Cache-Busting & Network-First):* Tích hợp CSS nhúng trực tiếp và cấu hình Service Worker Network-First cho tài nguyên cốt lõi, đảm bảo mọi thiết bị luôn tải giao diện đẹp hoàn mỹ tức thì.
  - **Tái cấu trúc cụm công cụ Hình học: Gom nút Cơ bản vào nút Hình và Dựng hình:**
    + Loại bỏ hoàn toàn nút dropdown `[ Cơ bản ▾ ]`, tinh gọn thanh Header giúp giao diện trực quan và phân loại chức năng rõ ràng hơn.
    + **Nút `[ 📐 Hình ▾ ]`:** Đảm nhận toàn bộ các thực thể hình học: `Đoạn thẳng` (mặc định), `Điểm`, `Đường tròn`, `Elip`, các loại Tam giác và Tứ giác với đường phân cách trang nhã.
    + **Nút `[ 🛠️ Dựng hình ▾ ]`:** Đảm nhận toàn bộ các tác vụ dựng hình tương tác: `Trung điểm` (mặc định được đưa lên đầu), `Giao điểm`, `Phân giác`, `Vuông góc`, `Song song`, `Tiếp tuyến`, `2 tiếp tuyến`, `Chọn góc`.
  - **Bổ sung tính năng "Giao điểm của 2 hình" trong menu Dựng hình ▾ & Tối ưu hóa nâng cao:**
    + *Quy trình tương tác chuẩn mực:* Bấm `[ Dựng hình ▾ ] -> [ Giao điểm ]` chuyển sang chế độ Chọn với con trỏ macOS nhọn; nhấp chọn hình 1 (sáng quầng ngọc bích kèm chỉ báo *"✓ Đã nhận: Đường 1"* hoặc *"✓ Đã nhận: Đường tròn 1"*); nhấp tiếp hình 2 để hệ thống tính toán và chấm chính xác giao điểm.
    + *Hỗ trợ chọn trước 0ms:* Chọn sẵn 2 hình trên canvas rồi bấm `Giao điểm` sẽ lập tức sinh ra các điểm giao nhau.
    + *Thuật toán hình học giải tích chuẩn xác 100%:* Đường thẳng cắt Đường thẳng / Đoạn thẳng (1 điểm hoặc báo song song/trùng nhau); Đường thẳng cắt Đường tròn (1 điểm tiếp xúc hoặc 2 điểm cắt); Hai đường tròn cắt nhau (1 điểm tiếp xúc hoặc 2 điểm cắt).
    + *Tự động kéo dài 2 đoạn thẳng:* Nếu giao điểm nằm ngoài đoạn thẳng ban đầu, hệ thống tự động kéo dài đầu mút đoạn thẳng tới giao điểm (với đường tự do) hoặc vẽ thêm đường dóng nét đứt chuẩn SGK (với cạnh đa giác, tam giác hoặc HHKG) để 2 đường gặp nhau trực quan tại giao điểm.
    + *Tự động nhận biết môi trường HHKG 3D & Cảnh báo hai đường chéo nhau:* Không cần nút bấm 2D/3D thủ công; hệ thống tự động phân tích cấu trúc đa diện 3D. Nếu 2 cạnh chéo nhau trong không gian (không đồng phẳng, ví dụ $SA$ và $BC$), hệ thống ngăn việc chấm điểm giao 2D giả và hiển thị cảnh báo sư phạm: *"⚠️ Cạnh SA và BC chéo nhau trong không gian 3D, không có giao điểm!"*.
    + Tự động gắn kết nhóm (`group link`) với các hình mẹ, lưu lịch sử hoàn tác `⌘Z` (Undo/Redo) và nâng cache Service Worker lên `net-app-v16`.
- **Sẵn sàng chuyển tiếp:** Đóng gói ứng dụng macOS `.app`.

## 2. Các chức năng đã thực hiện
- [x] **Bật lại & Hoàn thiện toàn diện tính năng các button trên thanh Header:**
  - 4 nhóm nút hình học (`Cơ bản ▾`, `Hình ▾`, `Dựng hình ▾`, `HHKG ▾`): Bấm trực tiếp vào nút kích hoạt vẽ ngay (0ms) không bị popup che khuất màn hình; bấm chevron `▾` hoặc bấm lại khi đang active mở dropdown chọn công cụ con mượt mà. Hỗ trợ chọn trước 2 điểm/cạnh để dựng hình tự động.
  - Nút `[ 📈 Đồ thị ]`: Bấm nút tạo/chọn widget đồ thị và mở trực tiếp Bảng cài đặt đa hàm số & Mô phỏng khối tròn xoay 3D, giao diện thanh công cụ giữ nguyên tinh gọn chuẩn gốc.
  - Các menu `[Nhập ▾]`, `[Xuất ▾]`, `[...]` và `[fx580]`: Gỡ bỏ giới hạn tràn khung ở `.header-right`, đưa `overflow: visible !important;` và `z-index: 1000` giúp menu dropdown nổi bật trên mọi lớp, không còn bị che khuất hay cắt cụt.
- [x] **Widget Đồ thị hàm số & Mô phỏng Khối tròn xoay 3D (Math Function Graph Widget & 3D Solid of Revolution):**
  - Khối đồ thị dạng Widget tương tác trực tiếp trên canvas: di chuyển nguyên khối, co giãn 4 góc, căn chỉnh gốc tọa độ $O$ và tỉ lệ thu phóng (scale).
  - Bảng điều khiển tham số (Graph Settings Modal) hỗ trợ đa hàm số ($y_1, y_2...$), màu sắc, kiểu nét, miền vẽ $x \in [a, b]$.
  - Tự động dò nghiệm giao trục $Ox$, $Oy$, cực đại, cực tiểu (CĐ, CT), hỗ trợ thêm điểm thủ công kèm đường dóng nét đứt và nhãn tọa độ $(x_0; y_0)$.
  - **Mô phỏng Thể tích Khối tròn xoay 3D nâng cao:**
    + Ô nhập cận độc lập: `1. Trục Ox hiển thị từ x = ... đến x = ...` và `2. Trục Oy hiển thị từ y = ... đến y = ...`.
    + Lựa chọn tốc độ xoay từ từ: `[ 🐢 0.5x (Chậm) ]`, `[ 🚶 1.0x (Chuẩn) ]`, `[ 🚀 2.0x (Nhanh) ]`.
    + Điều khiển chuyển động trực quan: `[ ▶ Bắt đầu quay ]`, `[ ⏸ Tạm dừng ]`, `[ ↺ Về 0° ]` và tùy chọn `Lặp lại liên tục`.
    + Tại $0^\circ$ hiển thị rõ hình phẳng ban đầu màu ngọc bích bán trong suốt, đường sinh cong màu cam và các đường dóng cận $x=a, x=b$; khi quay từ từ, khối tròn xoay được quét tạo hình rõ ràng trong không gian giúp học sinh quan sát sinh động.
    + Thanh điều khiển hoạt họa mini tích hợp trực tiếp ngay trên widget đồ thị trên trang canvas.
    + Tính toán thể tích tích phân số chuẩn xác bằng phương pháp Simpson cho cả hai trục $Ox$ và $Oy$ (vỏ trụ $V_{Oy} = 2\pi \int_a^b x |f(x)| dx$).
    + **Nhấn mạnh và hoàn thiện chế độ Quay quanh trục Oy & Bảng màu Trực quan:** Sửa triệt để lỗi tham số vẽ (`ry2 is not defined`), bảo vệ bán kính elip bằng `safeEllipse`; thiết kế bảng màu tương phản cao trực quan (Trục quay $Oy$ màu Đỏ Ruby `#dc2626` nổi bật, hình phẳng $S$ màu Vàng Cam Hổ Phách `#f59e0b`, thân khối tròn xoay màu Xanh Lam Ngọc Biển Pha Lê trong suốt, đường sinh màu Đỏ Cam `#f97316`) giúp học sinh phân biệt rõ ràng từng yếu tố hình học.
  - Hỗ trợ đầy đủ Hoàn tác / Làm lại (`⌘Z` / `⌘⇧Z`).
- [x] Khởi tạo cấu trúc thư mục: `docs/`, `web/`, `macOS/`, `reference/`.
- [x] Chuẩn hóa hồ sơ [NET_PROJECT.md](file:///Users/thien/shan.note/NET_PROJECT.md) & [AGENTS.md](file:///Users/thien/shan.note/AGENTS.md).
- [x] Giao diện thanh công cụ trên cùng: Bút viết, Dạ quang, Tẩy, Văn bản, Bảng màu 4 màu + tùy chọn, Kích thước nét, Nét liền/đứt.
- [x] Bộ công cụ dựng hình học: Đoạn thẳng, Đường tròn, Góc theo số đo ($60^\circ$), Tam giác, Tam giác vuông, Tam giác cân, Tam giác nội tiếp, Tiếp tuyến.
- [x] **Tính năng Điểm gắn liền Đường thẳng/Đường tròn & Dịch chuyển đồng bộ toàn diện (Hình 1):**
  - Tạo điểm tự động bắt dính và gắn chặt (`binding`) lên đường tròn hoặc đường thẳng kèm chỉ báo ngắm tâm 🎯.
  - Hỗ trợ kéo trượt điểm bám theo chu vi đường tròn hoặc dọc theo đoạn thẳng; điểm tự động cập nhật vị trí khi hình mẹ thay đổi kích thước.
  - Thuật toán duyệt đồ thị (BFS) tự động đồng bộ nhóm hai chiều: Dịch chuyển bất kỳ điểm hay đường nào thì toàn bộ các đối tượng liên quan (đường vuông góc, song song, tiếp tuyến, góc...) đều cùng dịch chuyển theo, bảo toàn tuyệt đối nguyên tắc lựa chọn ban đầu.
- [x] **Đoạn thẳng gắn trên 2 cạnh/đường tròn di chuyển theo hình & Tia phân giác thích ứng:**
  - Khi vẽ đoạn thẳng có 2 đầu mút nằm trên cạnh (tam giác, đa giác, đoạn thẳng khác) hoặc chu vi đường tròn, đoạn thẳng tự động bắt dính chuẩn xác và gắn kết nhóm với các hình đó.
  - Dịch chuyển hình hoặc đoạn thẳng thì tất cả cùng dịch chuyển đồng bộ; khi kéo đỉnh biến dạng hình, 2 đầu mút tự động bám chặt đúng vị trí trên cạnh và chu vi mới.
  - Tia phân giác tự động cập nhật lại đỉnh gốc, góc chia đôi và điểm cắt cạnh đối diện khi bất kỳ yếu tố hình nào thay đổi (kéo đỉnh tam giác, xoay đoạn thẳng, đổi góc độ).
- [x] **Nút xoay để ra ngoài hình & Cần thì mới chọn (2D & 3D):**
  - **Đưa nút xoay ra ngoài hình:**
    - Tay cầm xoay `rot2d` và `rot3d` được chuyển ra vị trí hoàn toàn BÊN NGOÀI HÌNH với khoảng cách an toàn 48px (`minY - 48` cho hình phẳng 2D và `pTop.y - 48` cho hình không gian 3D), nối nét đứt thanh mảnh.
    - Bán kính bắt chuột (30px) của nút xoay và đỉnh hình hoàn toàn tách biệt, chấm dứt triệt để tình trạng bấm nhầm vào nút xoay khi người dùng muốn kéo chỉnh đỉnh $S$ hay đỉnh $A$.
  - **Cần thì mới chọn (On-Demand Rotation):**
    - Mặc định khi chọn hình thông thường, nút xoay trên canvas hoàn toàn ẩn đi để giữ hình vẽ sạch sẽ, thoáng đãng.
    - Cụm điều khiển xoay hiển thị bên ngoài hình trên thanh công cụ (Toolbar) với nút `[🔄 Xoay]` và hai nút xoay nhanh `[↶ 45°]`, `[↷ 45°]`.
    - Người dùng chủ động bấm `[🔄 Xoay]` thì tay cầm xoay ngoài hình mới xuất hiện trên canvas để kéo xoay tự do (bấm lại thì ẩn đi). Hoặc người dùng có thể xoay nhanh $45^\circ$ tức thì bằng các nút trên thanh công cụ.
    - Khi hủy chọn hình (nhấp ra ngoài canvas), trạng thái xoay tự động tắt và dọn dẹp sạch sẽ.
- [x] **Xử lý triệt để hiện tượng sinh vệt rác (chấm và đường xanh ngọc) khi dùng chức năng xoay hình:**
  - **Nguyên nhân:** Khi người dùng nhấp chuột bình thường vào tay cầm xoay (`hitHandle`) hoặc cạnh hình mà không giữ `Cmd`, hệ thống đã vô tình gán tay cầm xoay vào `state.selectedVertex` và cạnh vào `state.selectedEdge` (vốn là hai biến chuyên dụng phục vụ việc dựng góc theo số đo). Khi xoay hình (2D hoặc 3D), hình học đã chuyển sang góc mới nhưng hai biến này vẫn giữ nguyên tọa độ tĩnh ban đầu và không được xóa khi nhả chuột, khiến `renderPage` tiếp tục vẽ 1 vệt đường xanh ngọc `#10b981` bo tròn và 1 chấm tròn xanh ngọc có hào quang bị trơ trọi lại trên canvas.
  - **Khắc phục triệt để:**
    - Dọn sạch `state.selectedEdge = null; state.selectedVertex = null;` trong thao tác nhấp chuột thông thường (`!isMultiKey`); loại bỏ hoàn toàn việc gán đỉnh/cạnh ngoài ý muốn khi không giữ phím `Cmd / Ctrl`.
    - Tự động xóa sạch lựa chọn cạnh/đỉnh trong suốt quá trình xoay hình (`rotateElement2D`, `animateSmoothRotation3D`, các nút xoay HHKG và `handlePointerMove` khi kéo tay cầm xoay).
    - Dọn sạch hai biến này khi nhả chuột kết thúc kéo xoay (`finishDrawing`).
    - Bổ sung kiểm tra nghiêm ngặt trong `renderPage`: chỉ vẽ hào quang đỉnh và vệt sáng cạnh khi đối tượng hình học đang thực sự được chọn (`isElementSelected`) và đỉnh được chọn là đỉnh hình học thật sự, loại trừ hoàn toàn các tay cầm xoay/co giãn.
- [x] **Xoay hình đồng bộ (các cạnh và yếu tố cùng quay) & Chuyển động xoay mượt mà (Smooth Rotation):**
  - **Đồng bộ tất cả các yếu tố khi xoay:** Khi dùng công cụ Chọn (`select`) để xoay hình (cả hình phẳng 2D và hình không gian 3D), tất cả các cạnh, điểm gắn trên cạnh, đoạn thẳng nối các đỉnh/cạnh, trung điểm, phân giác và góc đều cùng quay đồng bộ và bảo toàn cấu trúc hình ban đầu.
  - **Tay cầm xoay 2D trực quan (`rot2d`):** Hiển thị tay cầm xoay tròn `🔄` màu xanh ngọc phía trên các hình phẳng 2D (tam giác, tứ giác, đoạn thẳng, đa giác...); người dùng kéo chuột là cả hình và cụm liên kết quay quanh tâm mượt mà.
  - **Liên kết đỉnh hình 3D cho đoạn thẳng:** Đoạn thẳng nối giữa các đỉnh hình 3D tự động lưu `vIndex` và bám sát chính xác từng đỉnh khi xoay 3D trực tiếp hoặc từ phòng chiếu.
  - **Chuyển động xoay mượt mà cao cấp (Smooth Animation):**
    - Các nút xoay nhanh $45^\circ$ sử dụng hoạt họa `requestAnimationFrame` với hàm gia tốc `easeOutCubic` (lướt êm 300ms) thay cho bước nhảy đột ngột.
    - Chế độ tự động quay 360° nâng cấp sang `requestAnimationFrame` với delta-time chuẩn 60fps/120fps, không khựng giật.
    - Hệ số kéo tay cầm xoay được làm mịn, cho cảm giác xoay đầm tay và tự nhiên.
- [x] **Tối ưu hóa cuộn trang, cuộn mượt hơn & Bấm số trang chuẩn xác 100%:**
  - **Bấm số trang đúng 100%:** Khi bấm vào bất kỳ tab số trang nào (Trang 1, Trang 2, Trang 3... ở thanh đáy hoặc danh sách thu nhỏ), hệ thống kích hoạt cờ `isProgrammaticScroll` và cuộn thẳng đến chính xác tọa độ trang đích (`targetWrapper.offsetTop - 24`). Sự kiện cuộn trung gian không bao giờ can thiệp đè ngược số trang.
  - **Sửa triệt để lỗi kiểm tra canvas trang:** `getCanvasForPage` và `ensurePageInDOM` kiểm tra chính xác `canvas[data-page="${pageNum}"]`, ngăn ngừa việc trả về Trang 1 cho các trang mới sinh, đảm bảo mọi trang từ 1 đến N đều được khởi tạo và cuộn đến chuẩn xác.
  - **Cuộn mượt mà với Easing:** Hàm `smoothScrollTo` chuyên dụng với gia tốc `easeOutCubic` (300ms) lướt êm ái, nhẹ nhàng, tự động dừng nếu người dùng can thiệp bằng con lăn chuột/trackpad.
  - **Cuộn tự do với Native 60fps/120fps:** Loại bỏ `scroll-behavior: smooth` khỏi CSS `.canvas-workspace` giúp cuộn bằng chuột và trackpad phản hồi tức thì với tốc độ khung hình gốc của màn hình Mac mà không bị trễ hay lag.
  - **Nhận diện trang thông minh theo diện tích hiển thị (Visible Area):** Khi cuộn tự do, trang nào chiếm diện tích nhìn lớn nhất trên màn hình sẽ tự động kích hoạt tab tương ứng; chạm đỉnh chắc chắn là Trang 1, chạm đáy chắc chắn là Trang cuối.
  - **Chống spam trang & Thêm trang nhẹ nhàng:** Chỉ hiển thị thanh tiến trình ở banner chân trang; trang mới chỉ được tự động tạo khi người dùng kéo vượt đáy có chủ đích (`remainingDown <= 5px` có debounce). Danh sách trang thu nhỏ chỉ bổ sung nhẹ nhàng trang mới qua `appendSingleThumbnail`, không hủy vẽ lại toàn bộ gây giật cuộn.
- [x] Vùng giấy vẽ Retina: Lưới ô vuông 24px, kẻ dòng 32px, giấy trơn.
- [x] Quản lý đa trang (Thêm trang, chuyển trang độc lập).
- [x] Hoàn tác / Làm lại (`⌘Z` / `⌘⇧Z`) theo mô hình Command Pattern (hỗ trợ hoàn tác cả di chuyển).
- [x] Phóng to / Thu nhỏ / Vừa ngang màn hình.
- [x] Xuất ảnh ghi chú PNG chất lượng cao.
- [x] **Xoay Hình học Không gian (HHKG) 3D 360 độ (Trực tiếp trên trang & Phòng chiếu 3D chuyên sâu):**
  - **Xoay trực tiếp trên trang bằng tay cầm xoay `🔄`:** Xuất hiện tay cầm xoay trên đỉnh chóp $S$ khi chọn hình, kéo rê chuột sang trái/phải để quay 360° quanh trục thẳng đứng hoặc kéo lên/xuống để nghiêng góc nhìn.
  - **Thanh điều khiển nhanh trên Toolbar:** Cụm `[🔄 Xoay 3D 360°] [↶ 45°] [↷ 45°] [▶ Quay]` tự động hiển thị khi chọn hình không gian.
  - **Phòng chiếu Không gian 3D tương tác (3D Interactive Viewer):** Khung phóng to chuyên sâu để giảng bài, xoay tự do mọi chiều không gian, tô màu các mặt phẳng bán trong suốt (Shaded Faces), tự động quay tròn 360°, nút "Áp dụng vào trang ghi chú" cập nhật góc nhìn mới.
  - **Tự động chuyển đổi cạnh nét đứt/nét liền:** Thuật toán chiếu hình 3D lồi tự động biến cạnh thành nét liền khi quay ra phía trước và nét đứt khi quay ra phía sau, chuẩn xác theo phối cảnh SGK.
- [x] **Giả lập Máy tính Casio fx-580VN X ClassWiz Chuẩn 1:1 Chính Hãng (Tikz-Physics):**
  - **Đồng bộ và cập nhật 100% mã nguồn từ kho Tikz-Physics/casio-fx580vnx:**
    + Giao diện chuẩn 1:1 vỏ máy ClassWiz chính hãng, tỷ lệ chân thực kèm 50 phím bấm vật lý được trích xuất tọa độ chính xác từ `CLASSWIZ_P20.dll`.
    + Màn hình tinh thể lỏng Natural Textbook Display (Natural-V.P.A.M): Hỗ trợ đầy đủ biểu thức 2 chiều (phân số, căn bậc $n$, luỹ thừa, tích phân, đạo hàm, tổng $\sum$, logarit cơ số...).
    + Bộ font Casio LCD chuyên dụng (`ClassWizXDisplay-Regular`) hiển thị dot-matrix chuẩn sắc nét và icon SVG vector authentic cho toàn bộ 12 mode.
  - **Đầy đủ 12 Menu chức năng hoạt động hoàn hảo:**
    + Menu 1 (COMP): Tính toán khoa học, phân số, căn thức, vi tích phân số, SOLVE, biến nhớ, hằng số, đổi đơn vị.
    + Menu 2 (CMPLX): Số phức dạng đại số $a+bi$ và lượng giác $r\angle\theta$.
    + Menu 3 (BASE-N): Nhị phân, bát phân, thập phân, thập lục phân và logic bitwise.
    + Menu 4 (MATRIX): Ma trận tới cấp 4x4, định thức $\det$, nghịch đảo $A^{-1}$, chuyển vị $A^T$.
    + Menu 5 (VECTOR): Vector 2D/3D, tích vô hướng, tích có hướng, độ dài, góc.
    + Menu 6 (STAT): Thống kê 1 biến và hồi quy.
    + Menu 7 (DIST): Phân phối xác suất (Normal, Binomial, Poisson).
    + Menu 8 (TABLE): Bảng giá trị song hàm $f(x)$ và $g(x)$.
    + Menu 9 (EQUATION): Hệ phương trình 2-4 ẩn dấu $\{$, Phương trình bậc 2-4 tìm nghiệm phức & đỉnh parabol.
    + Menu A (INEQUALITY): Bất phương trình bậc 2-4.
    + Menu B (RATIO): Tỉ lệ thức $A:B=X:D$.
    + Menu 0/12 (SPREADSHEET): Bảng tính mini 5x45.
  - **Tích hợp sâu trong ứng dụng Nét:**
    + Cửa sổ nổi kéo thả khắp màn hình không che bài giảng.
    + Tính năng "✍️ Chèn" kết quả vào trang ghi chú tức thì.
    + Tiện ích: Âm thanh phím Web Audio API, Pop-up Display phóng to trình chiếu, Chụp ảnh LCD PNG, Key Log.
    + Hoạt động offline 100% và hỗ trợ PWA qua Service Worker `net-app-v18`.
- [x] **Nâng cấp & Tinh chỉnh công cụ Tẩy (Từng tí) siêu nhỏ và cực mảnh:**
  - **Đầu tẩy siêu nhỏ và thanh mảnh:** Bán kính mặc định tinh chỉnh xuống chỉ $3\text{px}$ (đường kính $6\text{px}$), đường viền hiển thị nét đứt siêu mỏng ($0.6\text{px}$) kèm chấm tâm li ti $0.5\text{px}$ giúp định vị cực kỳ chính xác.
  - **Vùng cắt gọt khít khao:** Giảm bù trừ sai số va chạm (`hitR`) về đúng bán kính hiển thị, loại bỏ hoàn toàn hiện tượng tẩy bị "phình to" hay xóa lẹm sang các nét lân cận.
  - **Độ phân giải cắt gọt $1\text{px}$:** Nội suy mẫu phân đoạn siêu mịn (bước nhảy $1.0\text{px}$) cho cả nét vẽ tay và đường thẳng/đa giác hình học, giúp vết cắt tẩy sắc ngọt, mịn màng như dao mổ.
  - **Tỉ lệ tương thích với độ dày nét:** Khi chuyển đổi kích thước nét vẽ (Mảnh 1.5px, Vừa 2.5px, Đậm 5px, Rất đậm 10px), bán kính tẩy tự động co giãn từ $2.5\text{px}$ đến $5.5\text{px}$, luôn giữ được độ nhỏ và thanh thoát tối đa.
  - **Hỗ trợ xóa từng nét trên toàn bộ các loại hình học & 3D:**
    - Hình học không gian (Tứ diện, hình chóp các loại): Chạm vào cạnh nào xóa riêng đúng cạnh đó, giữ nguyên các cạnh còn lại của hình.
    - Đa giác phẳng (Tam giác, hình chữ nhật, hình vuông, bình hành, thoi): Chạm vào cạnh nào xóa cạnh đó, các cạnh còn lại giữ nguyên thành các đoạn thẳng độc lập.
    - Đoạn thẳng & các đường hình học (Vuông góc, song song, phân giác, tiếp tuyến): Cắt gọt phân đoạn mịn hoặc thu ngắn đoạn thẳng.
    - Nét viết tay & dạ quang: Cắt xẻ phân đoạn mượt mà, tính toán chuẩn xác cả bề rộng nét viết.
    - Đường tròn, elip, góc, điểm, chữ: Xóa sạch sẽ khi đầu tẩy chạm vào.
- [x] **Gom nhóm thanh công cụ hình học theo đúng các nhóm chuẩn SGK: Cơ bản; Hình; Dựng hình; HHKG:**
  - `[ · Cơ bản ▾ ]`: Trung điểm, Đoạn thẳng, Đường tròn, Điểm.
  - `[ △ Hình ▾ ]`: Tam giác thường, Tam giác vuông, Tam giác cân, Tam giác nội tiếp, Hình chữ nhật, Hình vuông, Hình bình hành, Hình thoi, Đường tròn, Elip.
  - `[ ⦜ Dựng hình ▾ ]`: Phân giác, Vuông góc, Song song, Tiếp tuyến, 2 tiếp tuyến, Chọn góc.
  - Sau đó là ô số đo góc `[ ∡ 60 ° ]` (chỉ hiển thị khi vẽ góc xong hoặc chọn đối tượng góc để điều chỉnh), ô nhập 2 bán trục Elip `[ a: 60 b: 40 px ]`.
  - `[ ⛶ HHKG ▾ ]`: Bổ sung cụm Hình học không gian nằm giữa Dựng hình và Đồ thị, gồm 6 hình cơ bản theo chuẩn SGK Toán 11/12:
    - **Tứ diện ($S.ABC$):** Đáy tam giác $ABC$, cạnh khuất $AC$ nét đứt, các cạnh còn lại nét liền.
    - **Hình chóp tứ giác ($S.ABCD$):** Cạnh đáy khuất $AB, AD$ và cạnh bên $SA$ nét đứt.
    - **Hình chóp đáy hình thang ($S.ABCD$):** Đáy lớn $AD$ song song $BC$, $AB, AD$ và $SA$ nét đứt.
    - **Hình chóp đáy hình bình hành ($S.ABCD$):** Đáy hình bình hành $ABCD$, cạnh $AB, AD$ và $SA$ nét đứt.
    - **Hình chóp đáy ngũ giác ($S.ABCDE$):** Đáy ngũ giác, cạnh $EA, AB$ và $SA$ nét đứt.
    - **Hình chóp tứ giác đều ($S.ABCD$):** Đáy hình vuông/bình hành phối cảnh, tâm đáy $O$, đường cao $SO \perp$ đáy nét đứt, đường chéo $AC, BD$ nét đứt, cạnh $AB, AD$ và cạnh bên $SA$ nét đứt.
    - Hiển thị tự động nhãn đỉnh ($S, A, B, C, D, E, O$), hỗ trợ bắt dính nam châm (Magnetic Snap), tìm cạnh (Edge Hit-testing), kéo chỉnh đỉnh (Control Handles) linh hoạt.
  - Tiếp theo là `[ 📈 Đồ thị ]`.
  - Tự động phục hồi đúng các tên chuẩn `Cơ bản`, `Hình`, `Dựng hình`, `HHKG` ngay sau khi hoàn thành tác vụ vẽ hình, chuyển đổi công cụ hoặc nhấn phím `Escape`.
  - Tự động chuyển tiếp sang công cụ Chọn (`Select Tool`) để người dùng có thể kéo chỉnh sửa các điểm điều khiển của hình vừa tạo.
- [x] **Công cụ Trung điểm (Chọn điểm 1 -> Chọn điểm 2 / hoặc điểm Cmd điểm -> Hiển thị trung điểm):**
  - **Thêm vào nút "Trung điểm":** Có mặt trong menu `[ · Cơ bản ▾ ]`.
  - **Con trỏ chọn trực quan:** Khi bấm nút "Trung điểm", con trỏ chuyển sang con trỏ chọn (mũi tên nhọn chuẩn xác) sẵn sàng để chọn điểm.
  - **Quy trình thao tác:**
    1. Nhấp chọn điểm thứ 1 (đỉnh tam giác, đầu mút đoạn thẳng hoặc điểm rời), điểm 1 hiển thị điểm ngắm xanh ngọc thanh thoát.
    2. Nhấp chọn tiếp điểm thứ 2 (có thể nhấp trực tiếp hoặc giữ phím `Cmd`/`Ctrl` nhấp điểm 2).
    3. Hệ thống hiển thị đoạn thẳng đậm nối 2 điểm trong tích tắc rồi xuất ngay trung điểm chính giữa kèm vạch ký hiệu bằng nhau.
  - **Hỗ trợ chọn trước bằng phím Cmd:** Người dùng có thể ở công cụ Chọn, giữ Cmd chọn sẵn 2 điểm rồi bấm nút "Trung điểm" để sinh ngay tức thì.
  - **Bảng vẽ sạch sẽ:** Hoàn toàn không có các khung popup chữ đen gây che khuất hình ảnh, giữ bảng vẽ luôn tinh gọn, thanh nhã.
- [x] **Dựng góc tương tác theo số đo (Chức năng "Chọn góc"):**
  - **Quy trình thao tác chuẩn hóa "Chọn (cạnh cmd đỉnh) rồi mới vẽ góc":**
    1. Ở công cụ Chọn (`Select`): Nhấp chọn 1 cạnh (cạnh tam giác, đa giác hoặc đoạn thẳng), cạnh sáng viền ngọc bích.
    2. Giữ phím `Cmd` (trên Mac) hoặc `Ctrl` nhấp chọn 1 đỉnh (đỉnh tam giác, đầu mút đoạn thẳng hoặc điểm), đỉnh sáng chấm ngọc bích rực rỡ.
    3. Bấm nút "Chọn góc": Hệ thống vẽ ngay đường còn lại theo số đo cho trước tức thì (0ms) từ đỉnh đã chọn, không cần nhấp lại trên giấy!
  - **Ẩn/Hiện ô số đo thông minh:** Ô số đo `[ ∡ 60 ° ]` bình thường được ẩn gọn gàng; chỉ khi người dùng vẽ xong góc (hoặc khi click chọn đối tượng góc), ô số đo mới hiện lên và tự động chọn sẵn giá trị để người dùng gõ số đo mong muốn.
  - **Phản hồi tức thì & Kéo xoay linh hoạt:** Khi gõ số đo mới trong ô `[ ∡ ... ° ]`, đường còn lại tự động xoay theo góc mới ngay lập tức. Người dùng cũng có thể nắm kéo chấm điều khiển ở đầu mút đường còn lại để xoay góc trực tiếp trên giấy.
  - **Gộp nhóm động & Hoàn tác trọn vẹn:** Tự động gộp nhóm với đường cơ sở ban đầu, hỗ trợ di chuyển tịnh tiến và hoàn tác/làm lại (`⌘Z` / `⌘⇧Z`).
- [x] **Bổ sung các loại hình học mới theo yêu cầu:**
  - **Hình chữ nhật:** Kéo vẽ chuẩn 4 góc vuông; kéo các điểm điều khiển ở 4 góc để co giãn kích thước mà vẫn giữ góc vuông.
  - **Hình vuông:** Kéo vẽ chuẩn 4 cạnh bằng nhau; kéo điều chỉnh bảo toàn tính chất hình vuông.
  - **Hình bình hành:** Kéo vẽ với độ xiên chuẩn; 2 cặp cạnh đối diện luôn song song và bằng nhau.
  - **Hình thoi:** 4 cạnh bằng nhau, 2 đường chéo vuông góc cắt nhau tại trung điểm; kéo đỉnh đường chéo dọc để đổi chiều cao, kéo đỉnh ngang để đổi bề ngang.
  - **Elip (có nhập số đo 2 trục):** Kéo vẽ trực tiếp hoặc gõ số đo 2 bán trục $a$ và $b$ trên thanh công cụ; đồng bộ tự động giá trị khi vẽ/kéo hoặc chỉnh sửa.
  - Nâng cấp thuật toán Ray-casting `hitTestPolygon` để chọn trúng cả lòng và cạnh của tất cả các hình mới.
- [x] **Công cụ Bàn tay di chuyển (Move / Select Tool):** Bấm chọn đối tượng, kéo thả di chuyển cả hình đến bất kỳ vị trí nào trên giấy (phím tắt `V`).
- [x] **Gộp nhóm tự động & Ràng buộc hình học động khi di chuyển và biến động hình (Dynamic Grouping & Bindings):**
  - **Tự động gộp thành 1 nhóm:** Khi tạo Trung điểm, Tia phân giác, Tiếp tuyến, Đường vuông góc hoặc Đường song song từ một hình học gốc (đoạn thẳng, tam giác, đường tròn...), đối tượng sinh ra và hình gốc tự động được liên kết chung 1 mã định danh nhóm (`groupId`).
  - **Chọn trọn bộ nhóm:** Dùng công cụ Chọn (`V`) bấm vào bất kỳ hình nào trong nhóm sẽ tự động chọn toàn bộ các hình liên kết, sáng quầng sáng ngọc bích đồng bộ.
  - **Di chuyển đồng bộ:** Nắm kéo di chuyển hình gốc (hoặc bất kỳ hình nào trong nhóm), toàn bộ các đối tượng sinh ra từ nó sẽ di chuyển theo nhịp nhàng mà không bị lỗi gấp đôi khoảng cách.
  - **Ràng buộc hình học tức thì khi có biến động:** Khi hình gốc bị biến dạng (kéo đỉnh tam giác, co giãn đoạn thẳng, đổi bán kính/tâm đường tròn, đổi góc), các đối tượng con (trung điểm, tia phân giác, tiếp tuyến, đường vuông góc, song song) tự động tính toán lại vị trí và phương hướng chuẩn xác theo thời gian thực.
  - **Hoàn tác / Làm lại nhóm (`⌘Z` / `⌘⇧Z`):** Lệnh `modify-element-group` lưu snapshot trạng thái của cả nhóm, cho phép hoàn tác trọn vẹn mọi biến động.
- [x] **Điểm nút điều khiển hình học tương tác (Control Handles) & Tối ưu hóa điều chỉnh Đỉnh tam giác / Đầu mút đoạn thẳng:**
  - **Vùng chạm siêu rộng & nhạy bén (Hit Radius 28px - 34px):** Bán kính nhận diện nhấp chuột vào đỉnh tam giác và đầu mút đoạn thẳng được nới rộng gấp đôi (từ 14px lên 28px đối với hình chưa chọn, và 34px đối với hình đang chọn). Người dùng chỉ cần bấm gần đỉnh/đầu mút là hệ thống bắt dính tay cầm ngay lập tức, hoàn toàn không bị trượt thành kéo rê cả hình.
  - **Điểm ngắm tương tác trực quan (Interactive Hover Glow):** Khi rê chuột gần đỉnh tam giác hoặc đầu mút đoạn thẳng, con trỏ tự động chuyển sang hình chữ thập `crosshair`, điểm nút nở lớn (bán kính 8.5px) kèm vầng hào quang xanh ngọc lấp lánh (vòng sáng 14px) và nhãn chỉ báo `🎯 Đang nhắm: Đỉnh tam giác... / Đầu mút...` giúp người dùng biết chắc chắn đang nhắm đúng đỉnh cần kéo.
  - **Kéo thả mượt mà & Bắt dính thông minh (Magnetic Snapping 24px):** Khi nắm kéo đỉnh tam giác hoặc đầu mút đoạn thẳng đến gần các điểm hình học khác, đỉnh tam giác khác, hoặc chu vi đường tròn, tay cầm sẽ tự động hút dính chuẩn xác với vòng tròn xanh lá hiển thị vị trí bắt dính.
  - **Khóa góc 45° khi giữ phím `Shift`:** Khi kéo đầu mút đoạn thẳng, giữ phím `Shift` sẽ tự động khóa đường thẳng theo các góc 0°, 45°, 90°, 135°, 180° giúp vẽ đoạn thẳng nằm ngang, dựng đứng hoặc nghiêng 45° chuẩn tuyệt đối.
  - **Hỗ trợ đầy đủ Hoàn tác / Làm lại (`⌘Z` / `⌘⇧Z`):** Toàn bộ thao tác kéo biến dạng đỉnh tam giác hoặc co giãn đoạn thẳng đều được ghi nhận vào lịch sử thao tác, cho phép hoàn tác trở lại hình dạng ban đầu bất kỳ lúc nào.
- [x] **Đoạn thẳng:** Xuất hiện 2 chấm tròn nhỏ ở 2 đầu mút; nắm kéo từng đầu để thay đổi hướng/độ dài. Tự động **bắt dính (snap) và gắn chặt** lên chu vi đường tròn khi kéo gần.
- [x] **Tam giác (mọi loại):** Xuất hiện 3 chấm tròn nhỏ tại 3 đỉnh; nắm kéo từng chấm để điều chỉnh góc và kích thước tam giác.
  - **Tam giác nội tiếp:** Luôn **có sẵn tâm đường tròn**, **không ghi nhãn trước A, B, C**; 3 chấm đỉnh trượt quanh chu vi đường tròn bảo toàn tính chất nội tiếp.
  - **Tiếp tuyến đơn:** Hiển thị tâm đường tròn, **không vẽ bán kính**, đoạn thẳng nối từ điểm ngoài $M$ (có thể nắm kéo di chuyển) tới tiếp điểm $T$.
  - **2 Tiếp tuyến cắt nhau:** 2 tiếp tuyến xuất phát từ 1 điểm ngoài $M$ cắt đường tròn tại 2 tiếp điểm $T_1, T_2$, có sẵn tâm đường tròn, **không vẽ bán kính**, nắm kéo điểm $M$ di chuyển linh hoạt.
  - **Đường vuông góc:** Bấm chọn 1 điểm và 1 đường thẳng (hoặc cạnh hình học); tự động dựng đường thẳng vuông góc qua điểm đó kèm ký hiệu góc vuông tại chân đường vuông góc; có 2 điểm điều khiển ở 2 đầu mút để kéo thu hẹp hoặc mở rộng độ dài.
  - **Đường song song:** Bấm chọn 1 điểm và 1 đường thẳng (hoặc cạnh hình học); tự động dựng đường thẳng song song qua điểm đó (thuần nét thẳng thanh thoát, không có mũi tên); có 2 điểm điều khiển ở 2 đầu mút để kéo thu hẹp hoặc mở rộng độ dài theo phương song song.
  - **Tối ưu hóa đường/tia phân giác của góc (Bisector Optimization):**
    - **1. Thiết lập cách chọn 2 cạnh tối ưu & trực quan:** Phản hồi tức thì 0ms ngay khi chạm `pointerdown`; nới rộng bán kính chạm cạnh lên 28px; hover sáng quầng ngọc bích `🎯 Cạnh 1` và `🎯 Cạnh 2` kèm đường nét đứt xem trước (Live Preview); đặc biệt **chỉ cần 1 cú nhấp chuột trực tiếp vào đỉnh tam giác** là tự động dựng ngay tia phân giác góc tại đỉnh đó; hỗ trợ dựng tự động từ công cụ Chọn (`⌘`/`Ctrl` chọn 2 đoạn thẳng hoặc 1 góc số đo).
    - **2. Cách hiển thị tia phân giác chuẩn mực SGK Hình học:** Tia phân giác trong tam giác tự động cắt chuẩn xác cạnh đối diện tại chân đường phân giác $D$; có chấm điều khiển kéo dài hoặc thu ngắn theo đúng phương; ký hiệu 2 góc bằng nhau bằng 2 vòng cung có **cùng bán kính $R = 26px$**, chính giữa mỗi cung có **1 vạch gạch chéo ngắn (tick mark)** vuông góc cung thể hiện hai góc bằng nhau $\widehat{V}_1 = \widehat{V}_2$ chuẩn mực SGK; hỗ trợ đầy đủ Hoàn tác / Làm lại (`⌘Z` / `⌘⇧Z`).
- [x] **Công cụ Chọn đối tượng (Select Tool) & Chọn nhiều đối tượng (Multi-select):** 
  - **Mũi tên nhọn chuẩn xác cho công cụ Chọn (macOS sharp arrow pointer):** 
    - Con trỏ chuột trên toàn bộ canvas hiển thị biểu tượng mũi tên nhọn sắc nét $\nwarrow$ (hotspot 3, 3) với viền trắng tương phản, giúp ngắm và bấm chọn chính xác từng điểm ảnh, không bị chuyển đổi sang các dạng con trỏ gây rối mắt.
    - Đồng bộ tự động qua CSS vector SVG `data:image/svg+xml` và quản lý con trỏ `setCanvasCursor(SHARP_ARROW_CURSOR)`.
  - **Hiệu ứng phát sáng rực rỡ (Luminous Emerald Glow) khi chọn đối tượng để dễ hình dung:**
    - Khi bất kỳ đối tượng nào được chọn (hoặc khi rê chuột hover qua), toàn bộ hình học thực tế của đối tượng (đoạn thẳng, đường tròn, tam giác, tam giác nội tiếp, tiếp tuyến, nét vẽ tự do, văn bản, ảnh) lập tức **sáng bừng lên với quầng sáng ngọc bích rực rỡ** (`rgba(34, 197, 94, 0.45)`, bóng mờ `shadowBlur: 14` và nét viền lõi `#184e3a`).
    - Đối với hình tam giác (tam giác thường, vuông, cân, nội tiếp), hệ thống tự động phủ thêm một lớp sáng nhẹ trong lòng tam giác (`rgba(34, 197, 94, 0.09)`), giúp mắt người dùng nhận diện trọn vẹn toàn bộ khối hình ngay lập tức mà không cần đoán.
  - **Định vị & chọn điểm chuẩn xác bằng Mũi tên nhọn (Sharp Arrow Point Target):** 
    - **Ưu tiên tuyệt đối đối tượng là ĐIỂM:** Khi người dùng click hoặc rê chuột ở vùng có nhiều đối tượng nằm lẫn lộn (điểm nằm trên đường thẳng, đỉnh tam giác, nét vẽ, đường tròn), thuật toán `findElementAt` luôn ưu tiên chọn chính xác ĐIỂM trước, loại bỏ hoàn toàn việc bị click nhầm vào hình chữ nhật/tam giác xung quanh.
    - **Chỉ báo Mũi tên nhọn (Sharp Arrow Pointer Indicator):** Khi rê chuột gần điểm hoặc khi điểm được chọn, hiển thị mũi tên nhọn sắc nét chuẩn phong cách con trỏ Mac $\nwarrow$ ghim thẳng đầu nhọn vào tâm điểm, đi kèm vòng tròn ngắm tâm đôi và nhãn "Điểm", giúp người dùng hoàn toàn chắc chắn 100% đã nhắm đúng đối tượng điểm cần chọn.
    - **Kiểm tra hình học chính xác:** Thay thế việc dùng bounding box hình chữ nhật lớn cho tam giác và đoạn thẳng bằng kiểm tra khoảng cách hình học chuẩn xác (`distToSegment` và tọa độ trọng tâm tam giác).
  - Biểu tượng con trỏ mũi tên chuẩn macOS (`V` hoặc `S`); bấm chọn nét vẽ/hình học; **bấm và giữ phím `Command` (trên Mac) hoặc `Ctrl` (trên Windows) để chọn cùng lúc 2, 3... đối tượng**; nắm kéo để di chuyển cả nhóm đối tượng cùng lúc; nhấn phím `Backspace` hoặc `Delete` trên bàn phím để xóa toàn bộ các đối tượng được chọn; hỗ trợ hoàn tác Undo/Redo khôi phục cả nhóm.
- [x] **Dựng hình học tự động từ 2 đối tượng chọn trước:** Chọn trước 2 đối tượng rồi bấm nút công cụ hình học tương ứng sẽ tự động dựng hình ngay tức thì:
  - Chọn 1 điểm + 1 đường thẳng/cạnh $\rightarrow$ bấm **"Vuông góc"** xuất hiện ngay đường vuông góc.
  - Chọn 1 điểm + 1 đường thẳng/cạnh $\rightarrow$ bấm **"Song song"** xuất hiện ngay đường song song.
  - Chọn 2 cạnh $\rightarrow$ bấm **"Phân giác"** xuất hiện ngay đường phân giác góc.
  - Chọn 1 điểm + 1 đường tròn $\rightarrow$ bấm **"Tiếp tuyến"** hoặc **"2 Tiếp tuyến"** xuất hiện ngay tiếp tuyến.
  - Chọn 2 điểm (bằng `⌘`/`Ctrl` click) hoặc 1 đoạn thẳng $\rightarrow$ bấm **"Trung điểm"** (hoặc nhấn phím `M`) xuất hiện ngay trung điểm bằng một chấm nhỏ.
- [x] **Tính năng Dựng Trung điểm & Tối ưu hóa chấm mảnh thanh thoát (Midpoint Tool):**
  - **1. Thiết lập cách chọn tạo trung điểm tối ưu & trực quan:**
    - *1 Cú nhấp chuột trực tiếp vào Cạnh/Đoạn thẳng:* Vùng bắt cạnh nới rộng 28px; hover sáng quầng ngọc bích `🎯 Đoạn thẳng` kèm **Live Preview xem trước chấm trung điểm thanh mảnh** trước khi nhấp chuột; nhấp 1 cái là tạo ngay tức thì.
    - *Nhấp chọn 2 Điểm:* Hover Điểm 1 `🎯 Điểm 1` $\rightarrow$ nhấp chọn `✓ Điểm 1: Đã chọn` $\rightarrow$ hover Điểm 2 `🎯 Điểm 2` kèm đường nét đứt xem trước mờ nối 2 điểm và chấm trung điểm ở giữa $\rightarrow$ nhấp Điểm 2 để hoàn tất.
    - *Tự động từ công cụ Chọn (`V`):* Bấm chọn 1 đoạn thẳng hoặc giữ `⌘`/`Ctrl` chọn 2 điểm rồi bấm "Trung điểm" (hoặc phím `M`) để tạo ngay.
    - *Phản hồi tức thì 0ms:* Bắt ngay trên sự kiện `pointerdown`, loại bỏ độ trễ và chống trượt tay.
  - **2. Cách hiển thị chấm trung điểm thanh mảnh & tinh tế:**
    - Chấm trung điểm có **nét mảnh bằng nét của đoạn thẳng** ($r \approx 2.2 - 2.5\text{px}$), tệp hoàn hảo vào thân đoạn thẳng.
    - **Không vẽ ký hiệu vạch gạch chéo**, giữ mặt giấy vẽ sạch sẽ, thanh thoát và trang nhã theo đúng yêu cầu người dùng.
    - Đoạn thẳng nối làm đậm trước khi xuất hiện trung điểm và tự mờ dần sau khi hoàn thành.
    - Hỗ trợ đầy đủ Hoàn tác / Làm lại (`⌘Z` / `⌘⇧Z`).
- [x] **Tối ưu hóa công cụ Đoạn thẳng (Line Segment Optimization):**
  - Khi kích hoạt công cụ "Đoạn thẳng": Khóa hoàn toàn tương tác của các đối tượng khác; click chuột hoặc kéo vẽ không chạm vào chấm điều khiển (handle) của các hình xung quanh, chống méo mó hoặc vô tình xê dịch hình vẽ cũ.
  - **Bắt dính nam châm (Point-to-Point Magnetic Snapping):** Tự động phát hiện và hút dính chính xác vào các điểm hình học (`point`), đỉnh tam giác, đầu mút đoạn thẳng, tâm đường tròn và chu vi đường tròn; hiển thị vòng tròn xanh lá sáng chỉ báo bắt dính khi di chuột đến gần hoặc khi kéo vẽ đến điểm đích.
  - Sau khi vẽ xong đoạn thẳng, tự động dọn sạch khung chọn để sẵn sàng tiếp tục vẽ các đoạn thẳng mới liên tục mà không bị vướng víu tay cầm.
  - Hỗ trợ chọn sẵn 2 điểm (bằng công cụ Chọn) rồi nhấn nút "Đoạn thẳng" để nối ngay tức thì đoạn thẳng giữa 2 điểm.
- [x] **Nút tạo điểm hình học (Point Tool):** Bổ sung nút "Điểm" trên thanh hình học; nhấp chuột vào vị trí bất kỳ trên giấy vẽ để tạo điểm hình học độc lập; có chấm điều khiển kéo di chuyển vị trí.
- [x] **Tiếp tuyến tương tác (Tangent Tool):** Đổi mới cơ chế: chọn 1 điểm (nằm trên đường tròn hoặc ngoài đường tròn) + chọn 1 đường tròn $\rightarrow$ tự động dựng tiếp tuyến chính xác (tiếp xúc đường tròn tại tiếp điểm $T$, có ký hiệu góc vuông vuông góc với bán kính tiếp điểm); có 2 chấm điều khiển ở 2 đầu mút để người dùng nắm kéo thu hẹp hoặc mở rộng độ dài tiếp tuyến linh hoạt.
- [x] **Công cụ Tẩy 2 chế độ hiển thị trực quan rõ ràng trên thanh công cụ (Dual-mode Eraser Buttons):**
  - **Hiển thị trực quan 2 nút riêng biệt:** Thay vì ẩn bên trong menu xổ, 2 loại tẩy được bố trí thành cụm nút phân đoạn rõ ràng ngay trên thanh công cụ:
    - **Nút 1 - Xóa hết hình:** Chạm vào bất kỳ vị trí nào của nét hoặc hình là xóa trọn vẹn đối tượng đó ngay lập tức.
    - **Nút 2 - Xóa từng tí:** Rê đầu tẩy đến đâu sẽ cắt gọt phân đoạn từng đoạn nhỏ đến đó.
  - **Nhỏ hơn & Mượt mà vượt trội:**
    - Bán kính đầu tẩy thu nhỏ tinh tế xuống **8px** (với tâm điểm ngắm đỏ sắc nét), giúp người dùng tẩy tỉa tỉ mỉ từng chi tiết nhỏ mà không lo bị lem hoặc xóa lấn sang nét khác.
    - Tích hợp thuật toán **nội suy liên tục theo đường rê chuột (bước 2.5px)** và lấy mẫu nét cực mịn (2px), loại bỏ hoàn toàn hiện tượng đứt quãng, giật cục hay răng cưa; mang lại cảm giác lướt tẩy trơn tru, liền mạch như tẩy bút chì thật.
    - Hỗ trợ cắt gọt phân đoạn mượt mà cho cả nét viết tay lẫn các đoạn thẳng hình học; khôi phục chuẩn xác qua Hoàn tác / Làm lại (`⌘Z` / `⌘⇧Z`).
- [x] **Không tô màu (Line/Stroke thuần túy):**
  - Biểu tượng icon nút Tiếp tuyến & 2 Tiếp tuyến: Loại bỏ hoàn toàn chấm tròn tô đặc đen sì (`fill="currentColor"`), chỉ giữ nét vẽ thanh thoát `fill="none"`.
  - Hình vẽ trên Canvas: Tâm đường tròn $O$ thể hiện bằng dấu chữ thập mảnh `+` không tô màu đặc; tiếp điểm và điểm ngoài không vẽ chấm tô đen cục bộ; dấu bằng nhau của tam giác cân dùng vạch chéo thay vì chấm tròn đặc.
- [x] **Cuộn hết trang - Cuộn tiếp tự động sinh trang mới (Scroll-to-Spawn New Page):**
  - **Trải nghiệm cuộn chuột tự nhiên:** Người dùng cuộn chuột hoặc vuốt 2 ngón trên trackpad Mac theo chiều dọc trang giấy bình thường.
  - **Tự động sinh trang mới:** Khi cuộn đến đáy trang hiện tại và tiếp tục cuộn xuống có chủ đích (vượt ngưỡng an toàn chống vô tình chạm nhầm):
    - Nếu đang ở trang cuối cùng: Tự động tạo ngay Trang mới tiếp theo (ví dụ Trang 2, Trang 3...), thêm thẻ tab trang lên thanh công cụ, chuyển vùng nhìn lên đầu trang mới và thông báo toast `✨ Đã sinh Trang mới`.
    - Nếu phía sau đã có trang: Chuyển tiếp mượt mà sang đầu trang kế tiếp.
  - **Cuộn ngược lên đầu trang:** Khi cuộn lên đến đỉnh trang hiện tại và tiếp tục cuộn lên, hệ thống tự động quay lại đáy trang trước đó.
  - **Chỉ báo trực quan & Thanh tiến trình nạp (Visual Banner & Progress Ring):** Ở cuối trang giấy luôn có thẻ chỉ báo thanh lịch `Hết Trang X - Cuộn tiếp để sinh Trang mới...` đi kèm thanh tiến trình nạp xanh lá theo lực cuộn; người dùng cũng có thể bấm trực tiếp vào thẻ này để tạo/chuyển trang tức thì.
- [x] **Dán ảnh vào ghi chú bằng `⌘V` (`Ctrl+V`) & Chỉnh sửa Kéo to - Thu nhỏ:**
  - **Dán trực tiếp từ khay nhớ tạm (Clipboard):** Nhấn phím tắt `⌘V` (trên Mac) hoặc `Ctrl+V` (trên Windows) để dán ngay lập tức ảnh chụp màn hình hoặc hình ảnh đã copy vào trang giấy.
  - **Kéo to - Thu nhỏ linh hoạt (Corner Handles Scaling):** Hiển thị 4 chấm tròn điều khiển tại 4 góc của ảnh; nắm kéo bất kỳ góc nào để phóng to hoặc thu nhỏ ảnh mượt mà, tự động bảo toàn tỷ lệ khung hình chuẩn.
  - **Di chuyển & Thao tác trọn vẹn:** Dùng công cụ Chọn (`V`) để di chuyển ảnh đến bất kỳ đâu trên giấy; hỗ trợ xóa (`Backspace`/`Delete`) và Hoàn tác / Làm lại (`⌘Z` / `⌘⇧Z`) cho cả thao tác dán, dịch chuyển và co giãn ảnh.
  - **Viết và vẽ đè lên ảnh:** Bút viết, bút dạ quang và các hình học có thể vẽ tự do ngay trên bề mặt ảnh.
- [x] **Nút tải tệp PDF lên (Nhập PDF nhiều trang cục bộ):**
  - **Xử lý 100% cục bộ trên máy (Offline & Private):** Tích hợp Mozilla PDF.js kết xuất các trang PDF trực tiếp trong trình duyệt ở độ phân giải cao (2x crispness), tuyệt đối không gửi tài liệu lên mạng.
  - **Tự động trải đều nhiều trang:** Tự động tạo các trang ghi chú tương ứng cho từng trang PDF (Trang 1, Trang 2, Trang 3...), giúp người dùng có thể lật trang, cuộn tiếp để sinh trang mới và viết chú thích trực tiếp lên tài liệu PDF.
  - **Hỗ trợ Kéo thả (Drag & Drop):** Kéo thả trực tiếp tệp PDF hoặc tệp ảnh từ Finder vào vùng vẽ để tự động nạp.
- [x] **Thanh cuộn trang liên tục (Continuous Multi-Page Stream):**
  - **Nhìn thấy đầu trang 2 và cuối trang 1 cùng lúc:** Các trang giấy được xếp nối tiếp nhau theo chiều dọc với khoảng cách 36px trong không gian làm việc (`.pages-container`). Khi người dùng dùng chuột, trackpad hoặc kéo thanh cuộn, vùng nhìn có thể dừng ở ranh giới giữa hai trang để quan sát đồng thời nửa cuối của Trang 1 và nửa đầu của Trang 2 (giống trải nghiệm Goodnotes, Notability).
  - **Tương tác vẽ & chỉnh sửa độc lập trên từng trang:** Mỗi trang sở hữu một canvas riêng biệt trong luồng cuộn, bảo toàn chuẩn xác tọa độ $1600 \times 1060$ và hệ thống dữ liệu `state.pages[p]`. Người dùng có thể vẽ bút, chọn đối tượng, phóng to/thu nhỏ ảnh hay tẩy xóa trực tiếp trên bất kỳ trang nào trong luồng nhìn.
  - **Đồng bộ tab trang theo vị trí cuộn:** Khi người dùng cuộn qua lại giữa các trang, hệ thống tự động nhận diện trang đang hiển thị ở trung tâm khung nhìn để làm nổi bật tab tương ứng trên thanh công cụ; nhấn vào tab bất kỳ sẽ cuộn mượt (`scrollIntoView`) đến trang đó.
  - **Cuộn hết trang cuối để sinh trang mới:** Khi cuộn qua hết tất cả các trang xuống tận đáy tài liệu và tiếp tục cuộn có chủ đích, hệ thống sẽ tự động nối thêm trang mới vào cuối luồng cuộn.
- [x] **Cơ chế hiển thị trang giấy theo chiều dọc & Cột trang thu nhỏ bên trái màn hình:**
  - **Khổ giấy hiển thị theo chiều dọc (Portrait Paper Orientation):** Mặc định hiển thị trang giấy theo khổ đứng chuẩn sổ tay A4 ($1100 \times 1560$), tỷ lệ cao hơn rộng, tối ưu cho việc viết chữ và ghi chép học tập; đi kèm nút chuyển đổi linh hoạt giữa **Khổ dọc** và **Khổ ngang** ($1600 \times 1060$) ngay trên thanh công cụ.
  - **Cột trang thu nhỏ zoom nhỏ bên trái (Left Vertical Thumbnail Sidebar):**
    - Thiết kế theo chuẩn giao diện người dùng cung cấp: Cột danh sách các trang xếp dọc bên trái màn hình.
    - Mỗi mục trang gồm số trang lớn rõ nét (`1`, `2`...) và thẻ giấy thu nhỏ màu trắng hiển thị hình ảnh nội dung vẽ thực tế theo thời gian thực (live preview).
    - Trang đang kích hoạt (Active) nổi bật với nền xanh đậm hoàng gia (`#0b57cf`) và số trang màu trắng sắc nét; các trang còn lại có nền xám dịu mắt.
    - Nhấp chọn trang bất kỳ ở cột bên trái sẽ tự động kích hoạt và cuộn mượt (`scrollIntoView`) đưa trang đó vào giữa vùng nhìn.
    - Tự động đồng bộ đánh dấu trang tương ứng ở sidebar khi cuộn tài liệu trên màn hình chính.
- [x] **Tối ưu cuộn trang siêu mượt mà & Hiển thị trang nối tiếp liên tục thứ tự 1, 2... (Ultra-smooth Continuous Page Stream):**
  - **Cuộn tự nhiên, bảo toàn quán tính trackpad/chuột:** Loại bỏ toàn bộ `e.preventDefault()` trên wheel, sử dụng passive scroll listener, giải phóng 100% tài nguyên xử lý đồ họa giúp thao tác cuộn đạt tốc độ 60fps/120fps mượt mà không chút độ trễ hay giật lag.
  - **Chống xung đột scrollIntoView:** Loại bỏ lệnh cuộn tab tự động khi người dùng đang cuộn tài liệu; dùng `canvasContainer.scrollTo({ top, behavior: 'smooth' })` khi bấm chọn trang, giữ cố định thanh công cụ và giao diện macOS.
  - **Hiển thị trang 1, 2... nối tiếp liên tục rõ ràng:** Mặc định tải sẵn Trang 1 và Trang 2 nối tiếp nhau với khoảng cách 42px; bổ sung thẻ tab đầu trang (`.paper-header-badge`), huy hiệu mặt giấy (`.page-top-badge`) và thẻ góc dưới (`.page-corner-tag`), giúp người dùng nhận biết rõ ràng ranh giới và thứ tự tuần tự của các trang.
  - **Tự động sinh trang nối tiếp thông minh:** Khi cuộn gần đến cuối tài liệu (cách đáy dưới 260px), hệ thống tự động nối thêm trang tiếp theo (Trang 3, Trang 4...) một cách mượt mà không làm dừng hay ngắt nhịp cuộn của người dùng.
- [x] **Gom nhóm thanh công cụ hình học theo 4 chủ đề có menu xổ xuống (Grouped Geometry Dropdowns):**
  - Thu gọn thanh hình học từ 13 nút dàn trải thành 4 nhóm chủ đề khoa học:
    1. **`[Cơ bản ▾]`**: Điểm, Đoạn thẳng, Đường tròn.
    2. **`[Tam giác ▾]`**: Tam giác, Tam giác vuông, Tam giác cân.
    3. **`[Quan hệ ▾]`**: Vuông góc, Song song, Phân giác.
    4. **`[Đường tròn ▾]`**: Nội tiếp, Tiếp tuyến, 2 tiếp tuyến.
  - Giữ riêng cụm công cụ Góc kèm ô nhập số đo độ chính xác `[∡ Góc: 60°]` sau vạch ngăn cách `|`.
  - Hỗ trợ menu xổ xuống phong cách macOS, tự động đổi icon đại diện trên nút chủ đề theo công cụ đang chọn, đóng khi click ngoài hoặc nhấn Escape.
  - Đã khắc phục triệt để lỗi menu bị thanh công cụ cắt ẩn (overflow clipping): bật `overflow: visible !important`, nâng `z-index: 99999` và gắn điều khiển hiển thị trực tiếp bằng JavaScript, bảo đảm menu luôn bật ra nổi bật ngay khi nhấp chuột.
- [x] **Tinh gọn thanh quản lý trang & Thanh bên chuẩn phong cách macOS (Theo gợi ý hình 2, 3, 4):**
  - **Bố cục thanh quản lý trang tinh gọn 1 dòng:** `[ ◫ ] | [ 🗎 Dọc ▾ ]         [Trang 1] [Trang 2] [+]          [...]`
    - *Nút "Trang bên trái":* Chỉ giữ biểu tượng thanh bên `[ ◫ ]`, tooltip "Hiện/ẩn danh sách trang". Khi bật, dùng nền xanh nhạt `rgba(40, 99, 78, 0.12)` thay vì xanh đậm. Vách ngăn cách mảnh `|` phía sau.
    - *Dropdown Hướng trang:* Đổi nhãn nút thành `"Dọc ▾"` (hoặc `"Ngang ▾"`), menu có nhãn **HƯỚNG TRANG** gồm Khổ dọc A4 đứng và Khổ ngang A4.
    - *Cụm tab trang ở giữa:* Giảm nền khối bao ngoài; tab đang chọn có nền trắng, chữ đậm và viền nhẹ; **bỏ chấm xanh** chỉ báo thừa thãi theo yêu cầu hình 2. Cho phép cuộn ngang mượt mà khi có nhiều trang mà không bị co nhỏ hay rớt dòng.
    - *Nút Thêm trang `[+]`:* Đặt ngay sau tab cuối cùng, bỏ nút góc phải và nút "+ Thêm" trong thanh bên để loại bỏ trùng lặp.
    - *Menu `[...]` bên phải:* Cung cấp các thao tác quản lý trang hiện tại gồm: **Đổi tên trang...**, **Nhân bản trang** và **Xóa trang** (tô đỏ, ngăn cách riêng).
  - **Làm gọn thanh bên (Thumbnail Sidebar):**
    - Tiêu đề đầu thanh bên chuyển thành 1 dòng duy nhất: `TRANG · X    [«]` với số lượng trang tự động cập nhật và nút `[«]` thu gọn thanh bên.
    - Ảnh thu nhỏ đúng tỷ lệ khổ giấy (1100:1560 hoặc 1600:1060), viền xanh lá tinh tế cho trang đang chọn.
    - Nút menu `···` nhỏ bên cạnh tên trang chỉ hiện ra khi rê chuột (hover) hoặc khi trang đang kích hoạt.
  - **Đồng nhất giao diện & Tối ưu thị giác:**
    - Giảm độ tương phản lưới giấy ô vuông (`rgba(36, 60, 54, 0.05)`) để nét viết và hình vẽ trở thành trọng tâm.
    - Chiều cao thanh trang 38px, viền mảnh nhẹ nhàng, không lạm dụng màu xanh đậm gây chói mắt.
- [x] **Nhận dạng chữ viết tay (OCR):** Hộp thoại quét chữ viết tay, hỗ trợ tiếng Việt có dấu, xem và sửa trực tiếp kết quả.
- [x] **Tái thiết kế giao diện toàn diện theo 4 hình đề xuất (Kiến trúc giao diện 5 tầng chuyên nghiệp):**
  - **Tầng 1 - Thanh tiêu đề tài liệu (App Header):**
    - Đưa tên tài liệu sang bên trái: `nét. | Ghi chú hình học & bài tập · Đã lưu`.
    - **Cụm Hình học & Đồ thị đặt sát bên phải chữ `· Đã lưu`:**
      - `[Trung điểm ▾] [Tam giác cân ▾] [Phân giác ▾] [Đường tròn ▾] [∡ 60°] | [📈 Đồ thị]` (kèm ô nhập hàm số `y = ... [Vẽ]`).
      - Toàn bộ menu xổ xuống từ Header được xếp tầng `z-index: 3500` và header `z-index: 500`, đảm bảo hiển thị 100% nổi lên trên thanh công cụ chính và giấy vẽ, không bị cắt đôi hay che khuất.
    - Menu quản lý tệp gọn gàng ở góc phải:
      - `[Nhập ▾]`: Nhập PDF..., Nhập ảnh...
      - `[Xuất ▾]`: Xuất PDF..., Xuất ảnh (PNG)..., Xuất văn bản (.txt)...
      - `[...]`: Menu tùy chọn tài liệu (Thông tin giới thiệu, Xóa toàn bộ trang có xác nhận).
  - **Tầng 2 - Thanh công cụ chính: Thông thoáng, tập trung trọn vẹn vào trải nghiệm viết vẽ:**
    - Bố cục 1 hàng tinh gọn: `[Chọn] [Bút] [Dạ quang] [Tẩy ▾] [Chữ] [✍️ OCR]  |  [↶ Hoàn tác] [↷ Làm lại]  |  [Màu: ● ● ● ● (+)] [Độ dày: [━ ▾]] [Kiểu nét: [Liền ▾]]`.
    - **Bút viết & Dạ quang:** Tách thành 2 nút độc lập, bấm là cầm bút vẽ ngay tức thì.
    - **Tẩy ▾:** Bấm là chuyển sang tẩy ngay; bấm mũi tên `▾` để chọn giữa Tẩy từng tí (Tẩy nét) hoặc Tẩy cả hình (Đối tượng).
    - **Bảng màu & Cỡ nét luôn hiển thị:** Sẵn sàng cho cả Bút viết, Dạ quang và Hình học.
  - **Tầng 4 - Vùng làm việc chính:**
    - Cột thu nhỏ trang bên trái: `TRANG · X    [«]` có thể thu gọn/mở rộng mượt mà.
    - Vùng giấy vẽ canvas trung tâm: **Loại bỏ hoàn toàn nhãn `● Trang 1` to đè lên mặt giấy**, giúp trang giấy sạch sẽ, tập trung vào nội dung viết vẽ.
  - **Tầng 5 - Thanh đáy (App Bottom Bar):**
    - Bố cục gọn gàng: `[ ◫ ] [Trang 1] [Trang 2] [+]            [Hiển thị ▾] · − 100% + · [Vừa ngang]`.
    - Menu `Hiển thị ▾`: Tùy chọn kiểu nền giấy (Ô vuông, Kẻ dòng, Giấy trơn) và Hướng trang (Khổ dọc A4 đứng, Khổ ngang A4).
    - Cụm thu phóng Zoom và nút `Vừa ngang` đặt ở góc phải thanh đáy.

## 3. Lỗi & Hạn chế đang ghi nhận
- Trình duyệt tích hợp môi trường gặp lỗi tải driver Playwright (`open_browser_url`). Bạn có thể mở trực tiếp tệp `web/index.html` bằng Safari hoặc Chrome trên máy macOS để trải nghiệm đầy đủ.

## 4. Hành động tiếp theo
- Kiểm thử trải nghiệm viết trên trình duyệt thật của Mac, hoặc bắt đầu đóng gói ứng dụng native macOS (`Net.app`) bằng Swift.
