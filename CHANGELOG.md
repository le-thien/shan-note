# Nhật ký thay đổi (Changelog)

Mọi thay đổi quan trọng của dự án Nét được ghi lại tại đây theo thời gian thực.

## [Hợp nhất Menu Tệp ▾: Lưu, Save As, Nhập, Xuất, Phím tắt] - 25/10/2026

- **1. Hợp nhất cụm nút ở Header thành duy nhất một menu [Tệp ▾]:**
  - Thay thế các nút riêng lẻ trước đây (`Nhập ▾`, `Xuất ▾`, `...`) bằng một nút dropdown **[Tệp ▾]** đồng bộ, tinh gọn thanh header theo chuẩn phần mềm chuyên nghiệp.
- **2. Đầy đủ các tính năng quản lý tệp:**
  - **Mới (New) (`⌘N`):** Tạo tài liệu mới, thiết lập lại trạng thái 1 trang trắng và khởi tạo ngăn xếp hoàn tác mới.
  - **Lưu (Save) (`⌘S`):** Lưu ngay lập tức toàn bộ trạng thái ghi chú (các trang, nét vẽ, hình học, màu sắc, nền giấy) vào bộ nhớ cục bộ `localStorage` an toàn trên máy.
  - **Lưu thành... (Save As) (`⌘⇧S`):** Xuất toàn bộ dự án thành tệp sao lưu `.net` (định dạng JSON tiêu chuẩn của Nét) tải về máy tính.
  - **Nhập (Import):**
    + *Mở tệp Nét (.net / .json) (`⌘O`):* Nạp lại bài ghi chú đã lưu từ tệp trên máy để tiếp tục làm việc.
    + *Nhập PDF...:* Nạp tài liệu PDF vào các trang vẽ.
    + *Nhập ảnh...:* Chèn hình ảnh minh họa vào trang hiện tại.
  - **Xuất (Export):**
    + *Xuất PDF (`⌘P`):* Hỗ trợ in hoặc lưu sang file PDF chuẩn.
    + *Xuất ảnh PNG:* Tải ảnh độ nét cao của trang đang vẽ.
    + *Xuất văn bản (.txt):* Xuất kết quả nhận dạng OCR.
  - **Tiện ích:** Thông tin Nét & Xóa toàn bộ nội dung trang.
- **3. Trạng thái lưu động & Tự động lưu (Auto-save):**
  - Nhãn trạng thái `· Đã lưu` / `· Đang sửa...` tự động phản hồi theo thời gian thực khi vẽ hoặc sửa tên tài liệu; tự động lưu ngầm sau 1.5 giây nghỉ tay.
  - Tự động khôi phục bài viết trước đó khi người dùng mở lại trang web.

## [Đổi Slogan: Nét — Một khoảng trống cho mọi ý tưởng] - 25/10/2026

- **Cập nhật nhận diện và slogan ứng dụng:**
  - Đổi tiêu đề `<title>` trong `web/index.html` thành: `Nét — Một khoảng trống cho mọi ý tưởng`.
  - Bổ sung thẻ `<meta name="description">` chuẩn SEO và nhận diện ứng dụng.
  - Cập nhật tên ứng dụng và mô tả trong `web/manifest.json`.
  - Nâng phiên bản cache Service Worker lên `net-app-v5` trong `web/sw.js` để tự động làm mới bộ nhớ đệm trình duyệt cho người dùng.

## [Xuất bản Web App lên GitHub Pages] - 25/10/2026

- **1. Đẩy toàn bộ mã nguồn lên GitHub:**
  - Đồng bộ toàn bộ các tính năng hoàn thiện (vẽ viết, 13 dạng hình học, đồ thị hàm số, mô phỏng tròn xoay 3D, máy tính Casio fx-580VN X) lên kho lưu trữ `le-thien/shan-note` tại nhánh `main`.
  - Cấu hình upstream tracking (`origin/main`) hoàn chỉnh cho kho cục bộ.
- **2. Kích hoạt xuất bản GitHub Pages & GitHub Actions:**
  - Kích hoạt thành công tính năng GitHub Pages với nguồn triển khai tự động qua Workflow GitHub Actions (`.github/workflows/deploy.yml`).
  - Triển khai thành công toàn bộ thư mục `web/` lên tên miền chính thức: **`https://le-thien.github.io/shan-note/`**.
  - Kiểm tra kết nối HTTP 200 OK thành công trên toàn cầu.

## [Hiển thị góc chuẩn xác theo tia được chọn trong chức năng Chọn góc] - 25/10/2026

- **1. Hoàn thành tác vụ: Góc hiển thị đúng theo tia được chọn:**
  - Trong chức năng **Chọn góc**, khi hoàn thành tác vụ (người dùng bấm chọn vào 1 trong 2 tia gợi ý nét đứt):
    + **Tia thứ hai:** Vẽ chính xác theo tọa độ và hướng mở (`direction: -1` hoặc `direction: +1`) của tia mà người dùng đã bấm chọn.
    + **Cung tròn góc:** Được vẽ chính xác từ tia cơ sở đến đúng tia thứ hai được chọn, không bao giờ bị vẽ ngược chiều hay lệch hướng.
    + **Nhãn số đo độ (`xx°`):** Luôn tự động tính toán vị trí nằm ở phân giác chính giữa của hai tia tạo góc được chọn, hiển thị rõ ràng và đẹp mắt.
- **2. Đồng bộ toàn diện trên các tương tác hình học:**
  - **Tay cầm xoay góc (`second_pt`):** Tọa độ tay cầm điều khiển ở đầu mút tia thứ hai bám sát theo tia đã chọn. Khi người dùng kéo chuột để xoay góc, tay cầm nhận diện phía chuột kéo và tự động cập nhật cả số đo góc lẫn hướng (`direction`), cho phép người dùng kéo lật qua lại giữa 2 phía cực kỳ mượt mà.
  - **Công cụ Chọn (`Select Tool`):** Hàm `findElementAt` và hiệu ứng hào quang phát sáng `highlightElementShape` bắt trúng chính xác tia thứ hai theo đúng hướng người dùng đã chọn.
  - **Công cụ Tẩy (`Eraser`):** Hàm `erasePartialAt` xóa chính xác góc khi chạm vào đúng tia thứ hai được chọn.
  - **Liên kết động (Dynamic Binding):** Khi cạnh cơ sở hoặc đỉnh góc bị di chuyển hay biến dạng, tia thứ hai tự động tính toán lại vị trí bám sát theo hướng tia đã chọn ban đầu.
- **3. Kiểm thử tự động:**
  - Bổ sung kịch bản kiểm thử hiển thị góc theo tia chọn, kiểm tra tay cầm điều khiển `second_pt`, kiểm tra bắt trúng `findElementAt` và thao tác kéo đổi hướng mượt mà trong `scratch/test_tangent_angle_options.js`. Tất cả các bài kiểm thử đều đạt 100%.

## [Hiển thị 2 Option nét đứt cho Tiếp tuyến & Chọn góc] - 25/10/2026

- **1. Cơ chế hiển thị 2 đường gợi ý nét đứt (Options) trực quan:**
  - **Tác vụ Tiếp tuyến (`tangent`):**
    + Khi người dùng chọn điểm $P$ nằm bên ngoài đường tròn $O$, phần mềm tính toán chính xác cả 2 tiếp tuyến đối xứng đi qua điểm $P$ và 2 tiếp điểm $T_1, T_2$ trên đường tròn.
    + Không tự ý áp đặt 1 đường duy nhất như trước, hệ thống hiển thị đồng thời **2 đường gợi ý bằng nét đứt** (`[8, 6]`) màu xanh ngọc bích, kèm chấm tròn tiếp điểm và nhãn chỉ báo `🎯 Tiếp tuyến 1 (Bấm chọn)` và `🎯 Tiếp tuyến 2 (Bấm chọn)`.
    + Nếu điểm đã chọn nằm *trên* đường tròn (khoảng cách bằng bán kính $R$), hệ thống nhận diện chỉ có duy nhất 1 tiếp tuyến vuông góc bán kính và tự động tạo ngay tiếp tuyến đó.
  - **Tác vụ Chọn góc (`angle`):**
    + Khi người dùng chọn cạnh cơ sở và đỉnh góc, hệ thống tính toán 2 hướng mở góc khả dĩ so với cạnh cơ sở ($-\alpha$ và $+\alpha$).
    + Hiển thị **2 tia gợi ý bằng nét đứt** xuất phát từ đỉnh, kèm cung góc nhỏ xem trước và nhãn chỉ báo `🎯 Hướng 1: α° (Bấm chọn)` và `🎯 Hướng 2: α° (Bấm chọn)`.
    + **Bổ sung ô nhập số đo góc trực tiếp (`floating-angle-box`):** Ngay tại bước này, một khung nhập số đo góc bo tròn mềm mại xuất hiện nổi bật ngay tại đỉnh góc trên trang giấy, đồng thời ô số đo góc trên thanh toolbar cũng hiển thị đồng bộ.
    + Người dùng có thể **gõ trực tiếp số góc cần vẽ** (như 30°, 45°, 90°, 120°...). 2 đường nét đứt và cung góc lập tức co/giãn xoay theo thời gian thực (real-time preview).
    + Sau khi nhập số góc mong muốn, người dùng chỉ việc **nhấp chuột chọn vào 1 đường nét đứt** để hoàn tất vẽ góc.
- **2. Tương tác mượt mà & Chọn đường chuẩn xác:**
  - *Hiệu ứng rê chuột (Hover):* Khi rê chuột gần đường nét đứt nào ($\le 32\text{px}$), đường đó lập tức phát sáng quầng hào quang ngọc bích êm dịu, nét đứt đậm lên và con trỏ chuột chuyển sang dạng bàn tay trỏ (`pointer`).
  - *Nhấp chuột chọn đường:* Người dùng chỉ cần nhấp vào đường cần chọn trên bảng vẽ; hệ thống hoàn tất tạo đối tượng chính thức theo đúng nhánh/hướng đã chọn, xóa sạch 2 đường gợi ý và khung nhập nổi, tự động chuyển về chế độ Chọn và chọn đối tượng mới tạo.
  - *Đổi số đo góc linh hoạt:* Khi người dùng gõ số đo góc trên ô `[ ∡ ... ° ]` (cả trên canvas lẫn toolbar), tia góc xoay mượt mà bám theo đúng hướng mở mà người dùng đã chọn trước đó.
  - *Dynamic Binding:* Tiếp tuyến và góc tạo ra ghi nhớ chính xác nhánh (`branch`) và hướng (`direction`), tự động biến đổi bám sát khi di chuyển hoặc kéo co giãn hình mẹ.
  - *Phím Escape:* Nhấn phím `Escape` sẽ hủy bỏ chế độ gợi ý 2 option và khung nhập nổi, giữ bảng vẽ luôn gọn gàng.
- **3. Bộ kiểm thử tự động chuyên sâu:**
  - Bổ sung kịch bản kiểm thử độc lập `scratch/test_tangent_angle_options.js` kiểm tra toàn bộ trường hợp điểm ngoài, điểm trên đường tròn, 2 hướng góc, nhập số góc vào ô nổi rồi chọn đường, đổi số đo góc và phím Escape đạt 100%.
  - Kiểm thử hồi quy toàn bộ quy trình 4 bước dựng hình và chức năng chọn đơn lẻ đều thành công 100%.

## [Chức năng Chọn chỉ chọn đơn lẻ một đối tượng] - 25/10/2026

- **1. Chuẩn hóa hành vi công cụ Chọn (`Select Tool` - phím `V`):**
  - Khi nhấp chuột vào bất kỳ đối tượng nào (điểm, đường thẳng, tam giác, đường tròn, góc, hình không gian...), hệ thống **chỉ chọn đơn lẻ đúng duy nhất đối tượng đó**, hoàn toàn không tự động gom cả nhóm các hình xung quanh.
  - Khi hover chỉ làm sáng nhẹ đúng hình đang trỏ tới (loại bỏ hiệu ứng sáng cả chùm hình liên kết), giữ bảng vẽ luôn trong trẻo, tinh tế.
  - Sau khi vẽ xong một hình mới (`finishGeoTask`), hệ thống chỉ chọn đơn lẻ hình vừa tạo.
- **2. Lợi ích cho thao tác người dùng:**
  - Người dùng có thể xóa riêng một đường phân giác, đường cao hay đoạn thẳng bằng phím `Delete` mà không vô tình xóa mất hình tam giác cha.
  - Kéo chỉnh và tương tác trên từng đối tượng độc lập, rõ ràng và dễ kiểm soát.

## [Quy trình 4 bước cho các tác vụ Dựng hình] - 25/10/2026

- **1. Thiết lập quy trình 4 bước chuẩn mực cho toàn bộ 6 tác vụ Dựng hình (Phân giác, Vuông góc, Song song, Tiếp tuyến, 2 tiếp tuyến, Chọn góc):**
  - **Bước 1 (Chọn 1 tác vụ):** Khi người dùng nhấp chọn tác vụ từ menu xổ xuống (hoặc click nút Dựng hình), nút chính trên thanh công cụ cập nhật tên và biểu tượng của tác vụ đó.
  - **Bước 2 (Chuyển sang chế độ "Chọn"):** Hệ thống tự động kích hoạt chế độ Chọn (`Select Tool` - phím `V`), con trỏ chuột chuyển ngay sang con trỏ mũi tên nhọn macOS sắc nét, thanh trạng thái hiển thị thông báo hướng dẫn rõ ràng từng đối tượng cần chọn.
  - **Bước 3 (Chọn điểm hoặc đường, rồi tiếp tục chọn đối tượng còn lại):**
    + *Nhấp chọn đối tượng thứ nhất:* Nhận diện chuẩn xác Điểm (điểm rời, đỉnh tam giác/đa giác, đầu mút), Đường thẳng (đoạn thẳng, cạnh tam giác) hoặc Đường tròn. Đối tượng lập tức sáng bừng quầng ngọc bích rực rỡ kèm chỉ báo "✓ Đã chọn" và gợi ý chọn tiếp đối tượng thứ hai.
    + *Nhấp chọn đối tượng thứ hai:* Hệ thống nhận diện đối tượng còn lại tương thích với tính năng của tác vụ.
  - **Bước 4 (Thực hiện tác vụ):** Ngay khi chọn đủ 2 đối tượng (hoặc nhấp trực tiếp vào 1 đỉnh tam giác đối với Phân giác), hệ thống tự động dựng hình ngay lập tức (0ms), gộp nhóm đối tượng mới với hình gốc, tự động chọn hình vừa tạo và tiếp tục giữ ở chế độ Chọn để người dùng dễ dàng thao tác tiếp.
- **2. Hỗ trợ thao tác linh hoạt & An toàn:**
  - Thứ tự chọn linh hoạt: Có thể chọn Điểm trước -> chọn Đường sau, hoặc chọn Đường trước -> chọn Điểm sau.
  - Vẫn giữ nguyên khả năng chọn sẵn 2 đối tượng trước (bằng phím `Cmd`/`Ctrl`) rồi bấm nút tác vụ để dựng ngay.
  - Nhấn phím `Escape` hoặc nhấp công cụ khác tự động dọn sạch trạng thái tác vụ dở dang, đảm bảo bảng vẽ luôn sạch đẹp.
- **3. Bộ kiểm thử tự động toàn diện:**
  - Bổ sung kịch bản kiểm thử độc lập `scratch/test_construction_workflow.js` kiểm tra đầy đủ cả 6 tác vụ thành công 100%.

## [Thêm Tính năng Tính Diện tích hình phẳng (S) & Thể tích tròn xoay (V)] - 24/10/2026

- **1. Bổ sung nút [📐 Tính S & V] trực tiếp trên Header Widget Đồ thị:**
  - Nhấp trực tiếp vào nút `[📐 Tính S & V]` trên thanh điều khiển của widget đồ thị để mở ngay bảng tính toán diện tích & thể tích. Nút tự động sáng ngọc bích khi chế độ đang kích hoạt.
- **2. Bổ sung Tab chuyên biệt trong Modal: [📐 Tính Diện tích (S) & Thể tích (V)]:**
  - Hỗ trợ linh hoạt 3 chế độ tính toán toán học chuẩn Giải tích 12:
    + **1 hàm số ($y = f(x)$):** Hình phẳng giới hạn bởi $y = f(x)$, trục $Ox$ ($y = 0$), và 2 cận $x = a, x = b$. Tích hợp nút `[🎯 Giao trục Ox]` tự động giải nghiệm $f(x)=0$ làm cận.
    + **2 hàm số ($y = f(x), y = g(x)$):**
      * Chế độ tự động: Tự động giải phương trình hoành độ giao điểm $f(x) - g(x) = 0$ để tìm các nghiệm làm cận $x_1, x_2$.
      * Chế độ thủ công: Người dùng tự thêm 2 cận $x = a$ và $x = b$ (hình phẳng giới hạn bởi 4 đường $y = f(x), y = g(x), x = a, x = b$).
    + **3 hàm số ($y = f_1(x), y = f_2(x), y = f_3(x)$):**
      * Chế độ tự động: Tự động tìm 3 giao điểm tạo thành miền kín tam giác cong, chia thành 2 tích phân con với hàm đáy chạy suốt từ $x_A$ đến $x_C$.
      * Chế độ thủ công: Người dùng tự thêm 2 cận $x = a$ và $x = b$.
- **3. Trực quan hóa hình học trên Canvas 2D:**
  - Tự động tô màu miền diện tích hình phẳng bán trong suốt (`rgba(16, 185, 129, 0.22)`) nằm dưới đường cong đồ thị.
  - Kẻ đường dóng các cận thẳng đứng nét đứt tại $x = a$ và $x = b$ kèm nhãn tọa độ cận.
  - Đánh dấu chấm tròn các giao điểm kèm tọa độ $(x_0; y_0)$.
  - Hiển thị thẻ nhãn kết quả bo góc mini ngay trên đồ thị: `📐 S ≈ ... đvdt | V ≈ ... đvtt`.
- **4. Tích phân số học chính xác cao & Nâng cache `net-app-v4`:**
  - Áp dụng thuật toán Simpson 500 bước cho độ chính xác $< 10^{-6}$, tính toán tức thì cả thể tích quanh $Ox$ và quanh $Oy$ (phương pháp vỏ trụ).
  - Nâng cache Service Worker lên `net-app-v4`.

## [Khôi phục Phiên bản Trước cho Chức năng Vẽ Đồ thị] - 24/10/2026

- **1. Trở lại nguyên bản quy trình vẽ đồ thị trực quan:**
  - Khôi phục hành vi gốc: Bấm vào nút `[ 📈 Đồ thị ]` sẽ trực tiếp tạo/chọn widget đồ thị và mở ngay Bảng cài đặt đa hàm số & Mô phỏng thể tích 3D toàn diện.
  - Loại bỏ hoàn toàn các khung nhập hàm nhanh tạm thời (`context-graph-options`), giữ cho giao diện thanh tiêu đề và thanh công cụ sạch sẽ, tinh gọn đúng thiết kế chuẩn ban đầu.
- **2. Nâng phiên bản Cache Service Worker (`net-app-v3`):**
  - Đảm bảo khi người dùng tải lại trang web (`⌘R` hoặc `F5`), trình duyệt cập nhật tức thì về phiên bản đồ thị chuẩn.

## [Chuẩn bị và Tối ưu hóa Toàn diện để Xuất bản Web App Online / PWA] - 24/10/2026

- **1. Chuẩn hóa bộ tệp tĩnh độc lập (Static Web App):**
  - Toàn bộ tài nguyên nằm gọn trong thư mục `web/` với đường dẫn tương đối 100%, không phụ thuộc máy chủ phát triển hay cấu hình phức tạp.
  - Sẵn sàng xuất bản trực tiếp lên các nền tảng đám mây miễn phí như Netlify, Vercel, hoặc GitHub Pages.
- **2. Bổ sung bộ nhận diện & Biểu tượng ứng dụng SVG độ nét cao:**
  - Thiết kế [favicon.svg](file:///Users/thien/shan.note/web/favicon.svg) với tông màu xanh rừng `#28634e`, viền vàng kim và logo thư pháp chữ `nét.` thanh lịch, sắc nét trên mọi màn hình Retina.
- **3. Cấu hình Web App Manifest chuẩn Progressive Web App (PWA):**
  - Bổ sung [manifest.json](file:///Users/thien/shan.note/web/manifest.json) với chế độ hiển thị `standalone`, màu nền `#e9ece5`, màu chủ đề `#28634e`.
  - Cho phép người dùng bấm nút "Cài đặt ứng dụng" trên Chrome/Edge hoặc "Thêm vào Dock / Thêm vào Màn hình chính" trên Safari (macOS Sonoma+, iPhone/iPad) để sử dụng như một ứng dụng độc lập, không có thanh địa chỉ trình duyệt.
- **4. Tích hợp Service Worker hỗ trợ Offline & Cache tốc độ cao:**
  - Bổ sung [sw.js](file:///Users/thien/shan.note/web/sw.js) và tự động đăng ký trong [index.html](file:///Users/thien/shan.note/web/index.html).
  - Tự động lưu trữ đệm các tệp mã nguồn để mở tức thì và có thể sử dụng bình thường ngay cả khi thiết bị mất kết nối Internet.

## [Bật lại & Hoàn thiện toàn diện tính năng các button trên thanh Header] - 24/10/2026

- **1. Hoàn thiện 4 nhóm nút Dựng hình học (Cơ bản ▾, Hình ▾, Dựng hình ▾, HHKG ▾):**
  - **Bấm là kích hoạt vẽ ngay (0ms):** Bấm trực tiếp vào thân nút (hoặc chuyển từ công cụ khác sang) lập tức kích hoạt ngay công cụ hình học đang chọn (Đoạn thẳng, Tam giác, Phân giác, Tứ diện...) để vẽ ngay trên giấy, đóng sạch các menu xổ không che khuất màn hình vẽ.
  - **Mở menu tùy chọn mượt mà:** Bấm vào biểu tượng mũi tên chevron `▾` (hoặc bấm lại khi công cụ đang active) sẽ mở menu thả xuống để người dùng chọn hình/công cụ khác.
  - **Dựng hình tự động từ lựa chọn trước:** Hỗ trợ chọn trước 2 điểm/cạnh/đường tròn rồi bấm nút để xuất ngay Trung điểm, Phân giác, Vuông góc, Song song, Tiếp tuyến.
- **2. Hoàn thiện nút [ 📈 Đồ thị ] và nhập hàm trực quan:**
  - Bấm vào nút `[ 📈 Đồ thị ]` giữ nguyên trạng thái active của công cụ, hiển thị ngay ô nhập hàm nhanh `y = [ x^2 ] [ Vẽ ]` trên thanh công cụ và tự động bắt nét vào ô nhập.
  - Nhấp chuột lên bất kỳ vị trí nào trên trang giấy khi đang chọn Đồ thị sẽ tạo ngay Widget đồ thị tại đúng tọa độ bấm chuột.
  - Nhấp đúp (`dblclick`) vào nút Đồ thị hoặc bấm lại khi đang active sẽ mở Modal Cài đặt đa hàm số, Tọa độ đặc biệt & Mô phỏng thể tích 3D.
- **3. Khắc phục triệt để hiển thị các Menu Header [Nhập ▾], [Xuất ▾], [...] và [fx580]:**
  - Gỡ bỏ giới hạn `overflow-x: auto` ở `.header-right`, đưa `overflow: visible !important;` và `z-index: 1000` giúp menu Nhập (PDF, Ảnh), Xuất (PDF, PNG, TXT), và Tùy chọn trang (...) nổi lên trên mọi lớp, không còn bị che khuất hay cắt cụt.
  - Bật/tắt mượt mà máy tính Casio fx-580VN X, đồng bộ màu sắc active trên thanh tiêu đề.

## [Khắc phục lỗi & Nhấn mạnh Mô phỏng Hình quay quanh Trục Oy (Tung)] - 24/10/2026

- **1. Khắc phục triệt để lỗi khi bấm chọn Trục Oy:**
  - Sửa lỗi biến `ry2` chưa được khai báo (`ReferenceError: Can't find variable: ry2`) khiến canvas ném lỗi và dừng hiển thị khi chọn trục Oy.
  - Tích hợp hàm `safeEllipse` chống tràn bán kính âm/NaN, đảm bảo an toàn tuyệt đối cho mọi góc nhìn phối cảnh và môi trường trình duyệt.
- **2. Nhấn mạnh bản chất hình học khi quay quanh Trục Oy (Toán 12):**
  - **Trục quay Oy nổi bật ở giữa:** Trục tung $Oy$ được tô đậm với độ dày 2.4px, có mũi tên nhọn và nhãn chữ nổi bật `⟳ Trục quay Oy (Tung)` kèm vòng cung xoay tròn $\circlearrowleft$ quanh đỉnh trục để học sinh nhận biết ngay trục quay thẳng đứng.
  - **Hình phẳng ban đầu $S$ bên cạnh trục Oy:** Tại góc $0^\circ$, hình phẳng $S$ nằm sát trục $Oy$ được tô màu xanh ngọc bích rõ nét kèm nhãn `📐 Hình phẳng S (quay quanh trục Oy)`.
  - **Đường tròn vĩ tuyến & Đường sinh 3D chính xác:**
    + Tâm của các đường tròn vĩ tuyến nằm chính xác trên trục $Oy$ tại độ cao $(0, f(x))$.
    + Bán kính quay quanh trục $Oy$ là $r = x \ge 0$, nửa sau nét đứt và nửa trước nét liền, quét tạo thành khối tròn xoay quanh trục tung (như paraboloid úp ngược, bình hoa...).
  - **Tính toán thể tích chuẩn xác theo phương pháp vỏ trụ:**
    + Cập nhật công thức: $V = 2\pi \int_a^b x \cdot |f(x)| dx$ trên cả bảng cài đặt và thanh đáy widget, trả về thể tích chính xác không còn bị lỗi "Không thể tính trên khoảng này".
- **3. Tái thiết kế Bảng màu Trực quan, Tương phản cao và Sắc nét:**
  - Nền không gian 3D chuyển sang nền trắng tinh khiết sáng sủa (`#ffffff` -> `#f1f5f9`), lưới sàn lam xám nhẹ nhàng.
  - **Trục quay Oy:** Tô màu Đỏ Ruby `#dc2626` nổi bật nhất ở trung tâm, nhãn chữ đóng khung đỏ và vòng cung xoay cam cháy `#ea580c`.
  - **Hình phẳng ban đầu S:** Chuyển sang màu Vàng Cam Hổ Phách `#f59e0b` trong suốt, viền cam đất `#d97706` dễ phân biệt diện tích ban đầu.
  - **Thân khối tròn xoay 3D:** Dùng màu Xanh Lam Ngọc Biển Pha Lê (`rgba(14, 165, 233, 0.55)` đến `rgba(2, 132, 199, 0.60)`) trong suốt, nhìn xuyên thấu qua khối thấy rõ trục quay đỏ ở tâm.
  - **Đường sinh:** Màu đỏ cam rực rỡ `#f97316` dày 2.4px uốn lượn rõ nét.
  - **Đường tròn vĩ tuyến:** Nét đứt nửa sau và nét liền nửa trước màu xanh lam biển sâu `#0284c7`.

## [Nâng cấp Mô phỏng Thể tích Khối tròn xoay 3D: Cận Ox/Oy, Tốc độ xoay và Chuyển động trực quan] - 24/10/2026

- **1. Khoảng hiển thị riêng biệt cho hai trục Ox và Oy:**
  - Bổ sung ô nhập cụ thể và rõ ràng: `1. Trục Ox hiển thị từ x = ... đến x = ...` và `2. Trục Oy hiển thị từ y = ... đến y = ...` trên cả Modal cài đặt và thanh thông số trực tiếp dưới đáy widget 3D.
  - Cho phép quan sát và định vị chính xác cận tích phân của khối tròn xoay theo từng trục tương ứng ($V_{Ox}$ theo $x \in [a, b]$, $V_{Oy}$ theo $y \in [c, d]$).
- **2. Lựa chọn tốc độ xoay từ từ (Speed Control):**
  - Tích hợp 3 nút chuyển đổi tốc độ xoay hoạt họa: `[ 🐢 0.5x (Chậm) ]`, `[ 🚶 1.0x (Chuẩn) ]`, `[ 🚀 2.0x (Nhanh) ]`.
  - Tốc độ 0.5x xoay chậm rãi $0.4^\circ/\text{frame}$ (chu kỳ 15 giây), tốc độ 1.0x xoay $0.8^\circ/\text{frame}$ (chu kỳ 7.5 giây) và 2.0x xoay $1.6^\circ/\text{frame}$ (chu kỳ 3.8 giây).
- **3. Điều khiển chuyển động trực quan cho học sinh quan sát:**
  - Bổ sung cụm nút điều khiển phát chuyển động: `[ ▶ Bắt đầu quay ]`, `[ ⏸ Tạm dừng ]`, `[ ↺ Về 0° ]` và tùy chọn lặp lại liên tục `Lặp lại liên tục`.
  - Tại góc $0^\circ$, hiển thị rõ nét hình phẳng gốc màu xanh ngọc bích bán trong suốt, đường sinh cong màu cam và các đường dóng cận $x=a, x=b$ nét đứt; khi quay từ từ, khối tròn xoay được sinh ra dần dần trong không gian giúp học sinh hiểu sâu sắc bản chất bài toán tích phân Toán 12.
  - Tích hợp thanh điều khiển hoạt họa trực tiếp ngay trên widget đồ thị trên trang giấy để thao tác giảng dạy thuận tiện mà không cần mở lại hộp thoại.

## [Widget Đồ thị hàm số & Mô phỏng Khối tròn xoay 3D] - 24/10/2026

- **1. Chuyển đổi đồ thị thành Widget tương tác di động trên Canvas:**
  - Đồ thị và hệ trục Oxy được đóng gói thành một đối tượng Widget (`graph-widget`) độc lập trên trang giấy, không còn là các nét vẽ rời rạc cắm cứng giữa trang.
  - Hỗ trợ di chuyển toàn bộ khối đồ thị (gồm hệ trục Oxy, các hàm số và điểm đặc biệt) bằng công cụ Chọn (`V`) hoặc thanh nắm kéo trên đầu widget.
  - Bổ sung 4 tay cầm co giãn ở 4 góc để phóng to/thu nhỏ kích thước widget; hỗ trợ điều chỉnh tỉ lệ thu phóng trục số (scale).
  - Có thanh điều khiển mini trên đỉnh widget gồm nút `[⚙️ Sửa hàm]` và `[🔄 Thể tích 3D]`.
- **2. Bảng điều khiển tham số hàm số (Graph Settings Modal):**
  - Mở bảng cài đặt linh hoạt bằng cách bấm nút `[ 📈 Đồ thị ]` trên thanh công cụ, nhấp nút `[⚙️ Sửa hàm]` trên widget, hoặc nhấp đúp (`dblclick`) vào đồ thị.
  - **Tab 1 - Đa hàm số & Miền vẽ:** Cho phép thêm không giới hạn các hàm số $y_1, y_2, y_3...$, chọn màu sắc riêng, kiểu nét và giới hạn khoảng vẽ $x \in [x_{min}, x_{max}]$ cho từng hàm.
  - **Tab 2 - Tọa độ điểm đặc biệt:** Hỗ trợ nút tự động dò nghiệm giao điểm với trục $Ox$, giao trục $Oy$ và các điểm cực trị (CĐ, CT); cho phép thêm điểm đặc biệt thủ công kèm đường dóng nét đứt vuông góc tới 2 trục và nhãn tọa độ $(x_0; y_0)$.
- **3. Mô phỏng Thể tích Khối tròn xoay 3D (Solid of Revolution):**
  - Chuyển đổi linh hoạt giữa mặt phẳng 2D Oxy và mô hình phối cảnh 3D trực tiếp trên widget.
  - Hỗ trợ xoay quanh trục $Ox$ hoặc $Oy$ trên đoạn tích phân $[a, b]$.
  - Tự động dựng miền phẳng ban đầu và quét tạo dải vành khuyên 3D cùng các đường tròn vĩ tuyến phối cảnh (wireframe rings).
  - Thanh trượt điều chỉnh góc quét $0^\circ \rightarrow 360^\circ$ và nút `[ ▶ Tự động quay ]` (Spin) hoạt họa mượt mà.
  - Tích hợp công thức và tính toán thể tích tích phân số chuẩn xác bằng phương pháp Simpson: $V_{Ox} = \pi \int_a^b [f(x)]^2 dx$ và $V_{Oy} = 2\pi \int_a^b x |f(x)| dx$.
- **4. Hoàn tác / Làm lại & Lưu trữ an toàn:**
  - Mọi thao tác tạo widget, di chuyển, co giãn, chỉnh sửa hàm hay đổi chế độ 3D đều hỗ trợ trọn vẹn Undo/Redo (`⌘Z` / `⌘⇧Z`).


- Dựng lại vỏ máy bo tròn với viền sáng, thân xám than, logo và màn hình LCD lớn theo bố cục ảnh người dùng gửi.
- Sắp xếp lại cụm SHIFT/ALPHA, Replay 4 chiều, MENU/ON, đưa OPTN vào hàng chức năng và giữ đủ các phím khoa học cùng bàn phím số hiện có.
- Giữ các tiện ích riêng của Nét (Chèn, Lịch sử, thu nhỏ, đóng) mà không thay đổi API thao tác phím.
- Kiểm tra trực quan ở kích thước cửa sổ hẹp; chưa đối chiếu hình học phím với tài liệu Casio hoặc máy thật.

## [Hoàn thiện menu 12 chế độ và công bố phạm vi fx580] - 22/10/2026

- Menu fx580 liệt kê đủ 12 chế độ theo phạm vi của `casio.md`; dùng lưới gọn trên LCD, có trạng thái chọn và hỗ trợ điều hướng bằng các phím mũi tên cùng phím xác nhận.
- Các chế độ đã có một phần chức năng được giữ nguyên đường vào. Chế độ chưa triển khai không còn bị bỏ khỏi menu: khi chọn, LCD báo rõ và ở lại menu; phím AC quay lại Calculate.
- Chuyển nút fx580 sang cụm nút cố định bên phải tiêu đề và cho cụm công cụ bên trái cuộn ngang, tránh nút mở máy bị lớp điều khiển “Nhập” che.
- Thêm [`spec/feature_matrix.json`](./spec/feature_matrix.json) để ghi trạng thái hỗ trợ và mức xác minh từng mode; thêm [`docs/integration-discovery.md`](./docs/integration-discovery.md) để ghi lại công nghệ host và các blocker hiện tại.
- Cập nhật trạng thái dự án: prototype chưa được xác minh với máy thật; evaluator `new Function` và keymap chưa đối chiếu vẫn là các việc cần xử lý.

## [Nút xoay để ra ngoài hình & Cần thì mới chọn] - 21/10/2026

- **1. Đưa nút xoay ra ngoài hình vẽ:**
  - **Khoảng cách thoáng đãng, an toàn:** Tay cầm xoay 2D (`rot2d`) và 3D (`rot3d`) được chuyển ra vị trí hoàn toàn BÊN NGOÀI HÌNH với khoảng cách cách đỉnh/mép trên khung bao 48px (`minY - 48px` và `pTop.y - 48px`), nối nét đứt thanh mảnh.
  - **Tránh bấm nhầm 100%:** Bán kính bắt chuột (30px) của nút xoay và đỉnh hình hoàn toàn tách biệt, người dùng có thể thoải mái bấm chọn hoặc kéo đỉnh trên cùng ($S$ hay $A$) mà không bao giờ bị dính nhầm vào nút xoay.
- **2. Cơ chế "Cần thì mới chọn" (On-Demand Rotation):**
  - **Mặc định ẩn trên canvas:** Khi nhấp chọn hình (Select mode), nút xoay trên canvas hoàn toàn không xuất hiện, giữ cho hình vẽ luôn thông thoáng, sạch đẹp.
  - **Cụm điều khiển xoay trên thanh công cụ ngoài hình:** Khi chọn bất kỳ hình nào có thể xoay (tam giác, tứ giác, đa giác, đoạn thẳng, hình chóp, hình ảnh...), thanh công cụ phía trên hiển thị cụm điều khiển xoay gồm nút `[🔄 Xoay]`, `[↶ 45°]`, `[↷ 45°]`.
  - **Bật/Tắt xoay tự do:** Bấm nút `[🔄 Xoay]` trên thanh công cụ để bật tay cầm xoay ngoài hình trên canvas và kéo xoay chuột tự do; bấm lại lần nữa để tắt và ẩn tay cầm xoay.
  - **Xoay nhanh tức thì:** Có thể bấm trực tiếp các nút `[↶ 45°]` và `[↷ 45°]` trên thanh công cụ để xoay hình mượt mà quanh tâm mà không cần hiện tay cầm xoay trên hình vẽ.
  - **Tự động dọn dẹp:** Khi người dùng bấm ra ngoài khoảng trống canvas để hủy chọn hình, chế độ xoay và cụm điều khiển tự động ẩn và hoàn tất dọn dẹp.

## [Khắc phục triệt để vệt rác và chấm hào quang khi xoay hình] - 21/10/2026

- **1. Xác định chính xác nguồn gốc lỗi:**
  - Vệt đường màu xanh ngọc bo tròn hai đầu (`lineWidth = width + 6`, `#10b981`) và chấm tròn có hào quang mờ (`arc(14)`, `rgba(16, 185, 129, 0.4)`) chính là các nét vẽ trực quan của `state.selectedEdge` và `state.selectedVertex` (vốn chỉ phục vụ tính năng dựng góc theo số đo khi giữ phím `Cmd / Ctrl`).
  - Trước đây, khi người dùng nhấp chuột bình thường không giữ Cmd vào tay cầm xoay (`rot2d` / `rot3d`) hoặc cạnh của hình, hệ thống đã vô tình gán tay cầm xoay vào `selectedVertex` và gán cạnh vào `selectedEdge`.
  - Khi xoay hình, hình học đã di chuyển tới góc xoay mới, nhưng hai biến trên vẫn lưu tọa độ tĩnh cũ và không hề được dọn dẹp khi nhả chuột, dẫn đến việc `renderPage` tiếp tục vẽ vệt và chấm xanh trơ trọi tại vị trí cũ như hình ảnh người dùng chụp lại.
- **2. Giải pháp khắc phục toàn diện:**
  - **Tách bạch nhấp chuột thường và nhấp giữ Cmd:** Trong thao tác nhấp chuột bình thường (`!isMultiKey`), luôn xóa sạch `state.selectedEdge = null; state.selectedVertex = null;`. Tuyệt đối không gán đỉnh/cạnh ngoài ý muốn khi người dùng chỉ bấm vào tay cầm xoay hoặc chọn hình.
  - **Dọn sạch khi xoay:** Trong các hàm xoay `rotateElement2D`, `animateSmoothRotation3D`, `handlePointerMove` khi kéo tay cầm xoay, và các nút xoay trên thanh công cụ HHKG, hệ thống luôn tự động đặt `state.selectedEdge = null; state.selectedVertex = null;`.
  - **Dọn sạch khi nhả chuột:** Khi kết thúc thao tác kéo chỉnh tay cầm hoặc xoay hình (`finishDrawing`), đảm bảo dọn sạch hoàn toàn hai biến trên.
  - **Ràng buộc an toàn trong hàm vẽ (`renderPage`):** Chỉ hiển thị vệt sáng cạnh và hào quang đỉnh khi đối tượng đang thực sự nằm trong danh sách được chọn (`isElementSelected`) và đỉnh được chọn phải là đỉnh hình học hợp lệ (bỏ qua mọi tay cầm xoay/resize).
  - **Bảo toàn 100% tính năng dựng góc:** Thao tác chọn cạnh rồi giữ `Cmd` chọn đỉnh để vẽ góc theo số đo trong `test_angle_tool.js` vẫn hoạt động chuẩn xác và hoàn hảo.

## [Tối ưu hóa cuộn trang, cuộn mượt hơn & Bấm số trang chuẩn xác 100%] - 21/10/2026

- **1. Bấm số trang đúng chuẩn xác 100%:**
  - **Khắc phục lỗi kiểm tra canvas trang:** Sửa lỗi hàm `getCanvasForPage` và `ensurePageInDOM` trước đây luôn trả về canvas Trang 1 cho mọi trang mới sinh. Giờ đây hệ thống kiểm tra chính xác `canvas[data-page="${pageNum}"]`, giúp tất cả các trang từ 1 đến N đều được sinh trong DOM đầy đủ và đúng thứ tự liên tục.
  - **Bảo toàn số trang khi chuyển trang:** Khi bấm tab số trang (Trang 1, Trang 2, Trang 3...), hệ thống thiết lập cờ `isProgrammaticScroll = true` và cuộn thẳng đến chính xác tọa độ trang đích (`targetWrapper.offsetTop - 24`). Các sự kiện cuộn trung gian không bao giờ can thiệp đè ngược hay làm nhảy số trang.
- **2. Cuộn mượt hơn (Smooth Scrolling):**
  - **Hoạt họa cuộn mượt `smoothScrollTo`:** Xây dựng bộ điều khiển cuộn chuyển trang chuyên dụng sử dụng `requestAnimationFrame` và hàm gia tốc `easeOutCubic` kéo dài 300ms, lướt êm ái, nhẹ nhàng đến đúng trang mà không bị giật cục.
  - **Hủy cuộn tức thì khi người dùng can thiệp:** Lắng nghe cử chỉ con lăn chuột/trackpad (`wheel`) hoặc chạm cảm ứng (`touchstart`) để tự động nhả quyền điều khiển cho người dùng ngay lập tức, không gây tranh chấp hoặc giật khựng.
  - **Cuộn tự do Native 60fps/120fps:** Loại bỏ `scroll-behavior: smooth` khỏi CSS `.canvas-workspace`, cho phép thao tác cuộn bằng chuột và trackpad phản hồi tức thì với tốc độ khung hình gốc của màn hình Mac, loại bỏ hoàn toàn độ trễ, giật lag hay hiện tượng trôi chuột (floaty).
- **3. Tối ưu hóa hiệu năng & chống spam trang:**
  - **Nhận diện trang thông minh theo diện tích hiển thị (Visible Area):** Khi cuộn tự do bằng tay, hệ thống tính toán diện tích nhìn thực tế (`visibleHeight`) của mỗi trang trong tầm mắt người dùng. Trang nào chiếm diện tích lớn nhất trên màn hình sẽ tự động kích hoạt tab tương ứng; chạm đỉnh chắc chắn là Trang 1, chạm đáy chắc chắn là Trang cuối.
  - **Loại bỏ việc sinh trang tràn lan khi đang đọc:** Loại bỏ ngưỡng tự động sinh trang cũ (`remainingDown < 260px`). Banner chân trang chỉ hiển thị thanh tiến trình trực quan khi gần đáy, và chỉ tự động sinh trang khi người dùng kéo vượt đáy có chủ đích (`remainingDown <= 5px` có debounce).
  - **Thêm trang nhẹ nhàng (`appendSingleThumbnail`):** Khi sinh trang mới, hệ thống chỉ thêm một ô thumbnail duy nhất thay vì hủy và vẽ lại toàn bộ các canvas trang thu nhỏ, giúp thao tác cuộn và tạo trang nhẹ nhàng, 0 frame drop.

## [Xoay hình đồng bộ các cạnh/yếu tố hình & Chuyển động xoay mượt mà] - 21/10/2026

- **1. Đồng bộ các yếu tố hình khi xoay:**
  - **Xoay cụm hình phẳng 2D (`rotateElement2D`):** Khi dùng công cụ Chọn (`select`) xoay hình phẳng (tam giác, tứ giác, đa giác, đoạn thẳng...) quanh tâm xoay $(cx, cy)$, toàn bộ các đỉnh, cạnh, điểm gắn trên cạnh, đoạn thẳng nối các cạnh, trung điểm, tia phân giác và góc đều cùng quay một góc chính xác quanh tâm, đảm bảo trọn vẹn sự thống nhất hình học ban đầu.
  - **Bổ sung tay cầm xoay `rot2d` trực quan:** Với mọi hình phẳng 2D, khi chọn hình sẽ hiển thị tay cầm tròn có biểu tượng xoay `🔄` màu xanh ngọc nối nét đứt phía trên đỉnh hình. Người dùng chỉ cần kéo chuột là xoay được toàn bộ hình cùng tất cả các yếu tố con.
  - **Đồng bộ hóa hình không gian 3D (HHKG):**
    - Khi vẽ đoạn thẳng nối 2 đỉnh của hình 3D (hoặc đa giác), hệ thống tự động lưu chỉ số đỉnh `vIndex` vào `startBinding` và `endBinding`.
    - Khi xoay hình 3D (bằng tay cầm xoay `🔄` trên đỉnh chóp, qua các nút xoay $\pm 45^\circ$, tự động quay 360°, hoặc từ Phòng chiếu 3D), hàm `updateDependentBindings` được gọi liên tục sau mỗi khung hình giúp các điểm trên cạnh và đoạn thẳng nối các đỉnh bám chặt chính xác vào đỉnh 3D mới.
- **2. Chuyển động xoay mượt mà hơn (Smooth Motion):**
  - **Hoạt họa lướt êm với Easing (`easeOutCubic`):** Hai nút xoay trái / phải $45^\circ$ (`btnHhkgRotLeft`, `btnHhkgRotRight`) được nâng cấp với `animateSmoothRotation3D`, sử dụng `requestAnimationFrame` và hàm gia tốc `easeOutCubic` ($1 - (1-t)^3$) kéo dài 280-300ms, mang lại chuyển động xoay lướt êm ái, nhẹ nhàng, tự nhiên thay vì giật nhảy góc tức thì.
  - **Tự động quay mượt mà 60fps/120fps:** Nút Tự quay (`btnHhkgAutoSpin`) được chuyển đổi từ `setInterval` sang vòng lặp `requestAnimationFrame` tính theo delta-time thực tế giữa các khung hình, loại bỏ hoàn toàn hiện tượng khựng giật.
  - **Làm mịn tay cầm xoay chuột:** Điều chỉnh độ nhạy góc kéo chuột tay cầm xoay cho cảm giác đầm tay, phản hồi mượt mà và không rung lắc.
  - **Khả năng tương thích môi trường:** Bổ sung hàm tiện ích `getRaf()` giúp hoạt họa hoạt động tin cậy trên cả trình duyệt hiện đại lẫn các môi trường kiểm thử tự động.

## [Đoạn thẳng gắn trên 2 cạnh/đường tròn di chuyển theo hình & Tia phân giác tự động biến đổi theo các yếu tố hình] - 21/10/2026

- **1. Đoạn thẳng tạo ra từ 2 đầu mút nằm trên 2 cạnh hoặc đường tròn được di chuyển theo hình:**
  - **Tự động bắt dính cạnh & đường tròn khi vẽ:** Nâng cấp công cụ Đoạn thẳng (`line`), khi bắt đầu nhấn chuột hoặc khi nhả chuột kết thúc, hệ thống tự động nhận diện đỉnh điểm, chu vi đường tròn (`checkCircleSnap`), và cạnh của bất kỳ hình học nào (`findEdgeAt` qua `projectPointOnSegment`). Tọa độ 2 đầu mút được chiếu vuông góc chính xác lên cạnh/chu vi kèm vòng tròn bắt dính và nhãn trực quan.
  - **Gắn kết nhóm & ràng buộc hai đầu mút:** Đoạn thẳng mới tự động lưu `startBinding` và `endBinding` (`point_on_line`, `point_on_circle`, hoặc `point`), đồng thời tự động sáp nhập chung mã nhóm (`groupId`) với các hình chứa 2 đầu mút qua `linkGroupMulti`.
  - **Di chuyển đồng bộ:** Khi người dùng dịch chuyển hình cha (tam giác, đường tròn, hình bình hành...) hoặc dịch chuyển chính đoạn thẳng, toàn bộ các đối tượng liên quan tự động dịch chuyển song song cùng nhau.
  - **Thích ứng khi hình biến dạng:** Khi người dùng kéo đỉnh tam giác thay đổi hình dạng hoặc thay đổi bán kính đường tròn, 2 đầu mút của đoạn thẳng tự động trượt bám chặt đúng vị trí hình học trên cạnh và chu vi mới thông qua hàm `updateSingleStartEndBinding`.
- **2. Tia phân giác tự động thay đổi khi các yếu tố hình thay đổi:**
  - **Phân giác tam giác & đa giác:** Mở rộng cho mọi đa giác ($N \ge 3$). Khi kéo bất kỳ đỉnh nào của tam giác/đa giác, tia phân giác tự động tính lại đỉnh gốc $V$, hướng phân giác chia đôi góc $u_1 + u_2$, và tự động tìm lại giao điểm chính xác với cạnh đối diện.
  - **Phân giác từ 2 cạnh / 2 đoạn thẳng:** Khi tạo phân giác từ 2 đoạn thẳng rời nhau hoặc 2 cạnh bất kỳ, hệ thống lưu đầy đủ `edge1Info`, `edge2Info`. Khi bất kỳ đoạn thẳng nào bị kéo dài, thu ngắn, xoay góc hoặc dịch chuyển, tia phân giác tự động xác định lại đỉnh chung và hướng chia đôi góc chính xác tới từng độ.
  - **Phân giác từ góc theo số đo:** Khi người dùng thay đổi số đo độ của góc hoặc kéo đỉnh góc, tia phân giác tự động cập nhật hướng chia đôi góc tương ứng.
  - **Khắc phục triệt để lỗi duyệt trang:** Nâng cấp `findElementById` duyệt an toàn trên `state.pages` dạng dictionary, đảm bảo hệ thống tìm kiếm phần tử hoạt động ổn định trên mọi môi trường.

## [Điểm gắn liền đường thẳng/đường tròn & Dịch chuyển đồng bộ toàn diện bộ công cụ hình học] - 21/10/2026

- **1. Chức năng tạo "Điểm" tự động gắn liền và thống nhất với đường thẳng / đường tròn:**
  - **Tự động bắt dính & căn chỉnh:** Khi bật công cụ tạo Điểm (`point`) và di chuột lại gần một đoạn thẳng, cạnh đa giác hoặc đường tròn, hệ thống tự động chiếu vuông góc điểm vào đối tượng kèm vòng ngắm tâm đôi và nhãn hướng dẫn `🎯 Đang nhắm: Điểm trên đường tròn` / `🎯 Đang nhắm: Điểm trên đường thẳng`.
  - **Liên kết hình học bền vững:** Điểm được tạo gắn mã liên kết `point_on_circle` hoặc `point_on_line` cùng `groupId` thống nhất với đối tượng gốc.
  - **Cơ chế trượt điểm:** Khi chọn riêng điểm để kéo di chuyển, điểm sẽ tự động trượt mượt mà dọc theo chu vi đường tròn hoặc dọc theo đoạn thẳng ($0 \le t \le 1$).
  - **Tự động bám theo hình học:** Khi chỉnh sửa đỉnh của đoạn thẳng, đa giác hoặc thay đổi bán kính đường tròn, điểm được gắn sẽ tự động cập nhật lại vị trí chính xác tương ứng.
- **2. Dịch chuyển đồng bộ toàn diện cho toàn bộ tính năng ở Hình 1 (Cơ bản, Hình, Dựng hình, HHKG):**
  - **Thuật toán gom cụm liên kết hai chiều (BFS Graph Traversal):** Nâng cấp `getGroupElements` duyệt toàn bộ đồ thị quan hệ hình học qua `groupId` và `binding` (`parentId`, `ptAId`, `ptBId`, `parent1Id`, `parent2Id`, `pointElId`). Mọi đối tượng có liên hệ với nhau lập tức được thống nhất vào cùng một mã nhóm duy nhất.
  - **Dịch chuyển 1 đối tượng $\rightarrow$ tất cả dịch chuyển theo:** Khi dùng công cụ Chọn (`select`) nhấp vào điểm hoặc bất kỳ thành phần nào trong nhóm (ví dụ: đường vuông góc, tiếp tuyến, đoạn thẳng nối các điểm, góc), toàn bộ cụm đối tượng sẽ cùng phát sáng viền ngọc bích và cùng tịnh tiến song song, đảm bảo nguyên tắc lựa chọn và bảo toàn cấu trúc hình học ban đầu.
  - **Liên kết đa chiều cho bộ dựng hình:**
    - Đường vuông góc (`constructPerpendicular`): Tự động liên kết đường cơ sở + điểm ban đầu + đường vuông góc mới.
    - Đường song song (`constructParallel`): Tự động liên kết đường cơ sở + điểm ban đầu + đường song song mới.
    - Tiếp tuyến & Cặp tiếp tuyến (`constructTangent`, `constructTwoTangents`): Tự động liên kết đường tròn + điểm ban đầu + các tiếp tuyến.
    - Góc theo số đo (`constructAngleFromLineAndPoint`): Tự động liên kết đường cơ sở + đỉnh ban đầu + góc.
    - Đoạn thẳng nối các điểm / đường tròn: Tự động gộp nhóm khi bắt dính cả hai đầu mút.
  - **Bảo toàn hoàn tác:** Tương thích hoàn toàn với hệ thống `⌘Z` / `⌘⇧Z`, khi dịch chuyển cả cụm có thể hoàn tác về vị trí cũ trong 1 thao tác duy nhất.

## [Tính năng Xoay Hình học Không gian 3D 360 độ: Trực tiếp trên trang & Phòng chiếu 3D chuyên sâu] - 20/10/2026

- **1. Xoay 3D trực tiếp trên trang bằng tay cầm xoay `🔄`:**
  - Khi bấm chọn bất kỳ hình không gian nào (Tứ diện, hình chóp các loại), phía trên đỉnh chóp $S$ sẽ xuất hiện tay cầm xoay `🔄` màu xanh ngọc.
  - Người dùng có thể kéo rê chuột sang trái/phải để xoay tròn 360° quanh trục thẳng đứng, hoặc kéo lên/xuống để thay đổi góc nhìn nghiêng (Pitch) ngay tại chỗ trên trang giấy.
  - Tự động lưu lịch sử Hoàn tác / Làm lại (`⌘Z` / `⌘⇧Z`).
- **2. Thanh điều khiển xoay 3D tức thì trên Toolbar:**
  - Tự động xuất hiện cụm `[🔄 Xoay 3D 360°] [↶ 45°] [↷ 45°] [▶ Quay]` khi chọn hình không gian.
  - Nút `↶ 45°` và `↷ 45°`: Xoay nhanh từng góc $45^\circ$ tức thì.
  - Nút `▶ Quay` / `⏸ Dừng`: Tự động quay tròn 360° liên tục trên trang giấy để cả lớp quan sát trực quan.
- **3. Phòng chiếu Không gian 3D chuyên sâu (3D Interactive Viewer):**
  - Bấm nút `[🔄 Xoay 3D 360°]` để mở phòng chiếu 3D toàn diện.
  - Tương tác kéo xoay 360 độ tự do bằng chuột hoặc bút vẽ, cuộn bánh xe chuột để phóng to/thu nhỏ.
  - **Chế độ Mặt phẳng bán trong suốt (Shaded Faces):** Tô màu các mặt phẳng $SAB, SBC, SCD...$ với ánh sáng 3D mờ ảo (translucent) giúp học sinh nhìn thấu các mặt đáy và mặt bên.
  - **Nút "✍️ Áp dụng vào trang":** Chọn được góc nhìn ưng ý nhất trong phòng chiếu 3D, bấm một chạm để cập nhật ngay góc nhìn đó vào hình vẽ trên trang ghi chú.
- **4. Thuật toán tự động chuyển đổi nét đứt / nét liền theo hình học 3D lồi:**
  - Cạnh nào quay ra phía trước tự động là nét liền (solid).
  - Cạnh nào bị che khuất ở phía sau tự động chuyển thành nét đứt (dashed), bám sát 100% chuẩn mực phối cảnh SGK Toán học.

## [Tham khảo MathDa CalcES: Tích hợp nút Chèn kết quả vào ghi chú & Ngăn kéo Lịch sử tính toán] - 20/10/2026

- **1. Nút "✍️ Chèn" kết quả vào trang ghi chú:**
  - Bổ sung nút `[✍️ Chèn]` trên thanh tiêu đề của máy tính Casio fx-580.
  - Khi bấm, kết quả tính toán hoặc biểu thức hiện tại (ở mọi chế độ: COMP, EQN nghiệm phương trình, STAT các chỉ số thống kê, TABLE hàm số) sẽ được tự động tạo thành đối tượng chữ (`text`) và đặt ngay ngắn giữa trang ghi chú đang mở.
  - Tích hợp hoàn toàn vào hệ thống Hoàn tác / Làm lại (`⌘Z` / `⌘⇧Z`), đi kèm thông báo Toast sinh động.
- **2. Ngăn kéo "📋 Lịch sử" tính toán & Tương tác 2 chiều:**
  - Bổ sung nút `[📋]` trên thanh tiêu đề mở ngăn kéo trượt hiển thị toàn bộ các phép tính đã thực hiện từ trước tới nay.
  - Mỗi dòng ghi nhớ biểu thức và kết quả tính toán.
  - Người dùng có thể nhấp chuột vào bất kỳ phép tính cũ nào để nạp lại ngay vào màn hình máy tính để chỉnh sửa hoặc tính toán tiếp.
- **3. Điều hướng bộ nhớ bằng phím bánh xe Replay Lên/Xuống (UP / DOWN):**
  - Tái hiện chính xác cơ chế của máy tính Casio thật: Bấm phím mũi tên Lên trên bánh xe kim loại để xem lại biểu thức liền trước, bấm Xuống để tiến về biểu thức mới hơn.

## [Tối ưu & Nâng cấp toàn diện máy tính Casio fx-580VN X: Trải nghiệm hoàn toàn như máy thật] - 20/10/2026

- **1. Âm thanh bấm phím thật (Web Audio API Key Click):**
  - Tích hợp âm thanh click phím tự nhiên khi gõ bất kỳ nút nào, mang lại cảm giác lún phím và phản hồi cơ học như máy thật.
  - Có thể bật/tắt âm thanh trong Menu SETUP (Shift + Menu).
- **2. Hỗ trợ bàn phím máy tính vật lý (Keyboard Input):**
  - Cho phép người dùng gõ trực tiếp từ bàn phím rời: các số 0-9, phép tính `+ - * /`, dấu chấm, dấu ngoặc `()`, số mũ `^`, phím `Enter` (bằng `=`), `Backspace` (DEL), `Escape` (AC), phím mũi tên Lên/Xuống/Trái/Phải, phím tắt nhanh `s` (sin), `c` (cos), `t` (tan), `p` ($\pi$).
- **3. Tính năng CALC & SOLVE (Dò nghiệm Newton-Raphson):**
  - **Phím CALC:** Tính nhanh giá trị biểu thức theo biến số $x$.
  - **Phím SOLVE (SHIFT + CALC):** Tự động giải và dò nghiệm của phương trình $f(x)=0$ hoặc $f(x)=g(x)$ bằng phương pháp tiếp tuyến Newton-Raphson.
- **4. Đạo hàm tại 1 điểm $\frac{d}{dx}$ & Tích phân xác định $\int$:**
  - Tính đạo hàm số $\left.\frac{d}{dx}(f(x))\right|_{x=x_0}$ chuẩn xác với công thức sai phân vi phân 5 điểm.
  - Tính tích phân số $\int_a^b f(x) dx$ chuẩn xác với phương pháp Simpson 1000 phân đoạn.
- **5. Mở rộng hệ thống MENU đầy đủ:**
  - **Mode 6: Statistics (Thống kê 1-VAR):** Nhập mẫu số liệu xuất trung bình $\bar{x}$, phương sai, độ lệch chuẩn $s_x$, cỡ mẫu $n$, trung vị $\text{Med}$, min, max.
  - **Mode 8: Table (Bảng giá trị hàm số):** Khảo sát hàm số $f(x)$ với Start, End, Step.
  - **Mode 9: Equation (Phương trình & Hệ):** Giải phương trình bậc 2, bậc 3; Giải hệ 2 và 3 phương trình bậc nhất bằng phương pháp khử Gauss-Jordan.
  - **Menu SETUP (SHIFT + MENU):** Đổi đơn vị góc Deg/Rad, đổi hiển thị MthIO/LineIO, bật/tắt âm thanh.

## [Tinh chỉnh đầu tẩy "Từng tí": Siêu nhỏ gọn, đường viền cực mảnh và độ cắt gọt chính xác cao] - 20/10/2026

- **1. Đầu tẩy siêu nhỏ và thanh thoát:**
  - Giảm bán kính đầu tẩy mặc định xuống còn $3\text{px}$ (đường kính $6\text{px}$), giúp người dùng dễ dàng tẩy tỉa từng đoạn dư thừa nhỏ li ti hoặc mấu thừa ở giao điểm mà không chạm vào nét bên cạnh.
  - Vòng tròn con trỏ chỉ báo đầu tẩy được thiết kế lại siêu mỏng: nét vẽ viền $0.6\text{px}$, nét đứt li ti $[1.5, 1.5]$, màu đỏ nhạt trong suốt $4\%$, chấm tâm định vị $0.5\text{px}$.
- **2. Độ cắt gọt phân đoạn mịn từng pixel:**
  - Thu nhỏ khoảng cách bước lấy mẫu nội suy phân đoạn xuống còn $1.0\text{px}$ cho cả nét vẽ tay lẫn đường thẳng/đa giác hình học, giúp vết cắt tẩy ngọt và mịn màng như dao mổ, không bị răng cưa.
  - Khắc phục hiện tượng "phình to" vùng tẩy: Tinh chỉnh khoảng cách va chạm (`hitR`) bám khít khao đúng chu vi vòng tròn hiển thị, tẩy chạm đúng vào đâu thì chỉ xóa đúng vùng đó.
- **3. Tự động co giãn theo kích cỡ nét vẽ:**
  - Tích hợp tỉ lệ bán kính tẩy từ $2.5\text{px}$ (khi nét mảnh $1.5\text{px}$) đến tối đa $5.5\text{px}$ (khi nét rất đậm $10\text{px}$), luôn đảm bảo sự tinh tế và thanh mảnh ở mọi chế độ vẽ.

## [Khắc phục & Nâng cấp toàn diện chức năng "Tẩy (Từng tí)": Xóa phân đoạn mịn cho cả Nét vẽ và Hình học] - 20/10/2026

- **1. Khắc phục triệt để lỗi không xóa được:**
  - Sửa lỗi trước đây chỉ xóa được nét bút và đoạn thẳng rời, hoàn toàn không xóa được bất kỳ hình học nào khác (tam giác, hình chóp, chữ nhật...).
  - Nâng bán kính đầu tẩy từ 8px lên 16px (đường kính 32px) giúp diện tích chạm tẩy tự nhiên, nhạy bén và không bị hụt nét.
  - Tối ưu hóa bước nội suy khi kéo tẩy, loại bỏ vòng lặp tính toán dư thừa giúp thao tác rê tẩy siêu mượt, không hề có độ trễ.
- **2. Mở rộng xóa từng tí trên toàn bộ các loại hình học & khối 3D:**
  - **Hình học không gian (Tứ diện, hình chóp các loại):** Rê đầu tẩy qua cạnh nào sẽ xóa riêng biệt đúng cạnh đó (ví dụ: muốn xóa cạnh AB, cạnh SA...), giữ nguyên vẹn toàn bộ các cạnh còn lại của hình chóp.
  - **Đa giác phẳng (Tam giác, hình chữ nhật, hình bình hành, hình thoi...):** Rê qua cạnh nào xóa cạnh đó, các cạnh còn lại của đa giác tự động bảo toàn thành các đoạn thẳng độc lập để tiếp tục chỉnh sửa.
  - **Đoạn thẳng & các đường dựng hình (Vuông góc, song song, phân giác, tiếp tuyến):** Cắt gọt phân đoạn mịn hoặc thu ngắn đoạn thẳng.
  - **Nét viết tự do & dạ quang:** Cắt xẻ phân đoạn mượt mà, tính toán chuẩn xác cả bề rộng nét viết.
  - **Đường tròn, elip, góc, điểm, chữ:** Xóa sạch sẽ ngay khi chạm đầu tẩy.
- **3. Hiển thị vòng tròn tẩy sắc nét & Hoàn tác trọn vẹn:**
  - Con trỏ hiển thị vòng tròn viền đứt màu đỏ trực quan di chuyển mượt mà theo đầu tẩy.
  - Ghi nhận đầy đủ lịch sử Hoàn tác / Làm lại (`⌘Z` / `⌘⇧Z`).

## [Bổ sung nhóm HHKG (Hình học không gian) giữa Dựng hình và Đồ thị với 6 hình cơ bản chuẩn SGK] - 20/10/2026

- **1. Thêm nhóm dropdown `[ ⛶ HHKG ▾ ]` vào thanh công cụ:**
  - Vị trí chuẩn mực: Đặt ngay giữa cụm "Dựng hình" (kèm các ô nhập góc, elip) và nút "Đồ thị".
  - Giữ nguyên giao diện không sidebar, phục vụ tối ưu cho giáo viên và học sinh dạy & học hình học không gian.
  - Phục hồi tự động nhãn dropdown về `HHKG` sau khi hoàn thành thao tác vẽ hoặc nhấn `Escape`.
- **2. Bổ sung 6 hình học không gian cơ bản theo chuẩn SGK Toán 11 & 12:**
  - **Tứ diện ($S.ABC$):** Đáy tam giác $ABC$, cạnh khuất $AC$ vẽ bằng nét đứt phối cảnh, 5 cạnh còn lại nét liền.
  - **Hình chóp tứ giác ($S.ABCD$):** Cạnh đáy khuất $AB, AD$ nét đứt, cạnh bên $SA$ nét đứt, 5 cạnh còn lại nét liền.
  - **Hình chóp đáy hình thang ($S.ABCD$):** Đáy lớn $AD$ song song đáy nhỏ $BC$, $AB, AD$ và $SA$ nét đứt.
  - **Hình chóp đáy hình bình hành ($S.ABCD$):** Đáy hình bình hành $ABCD$ ($AD \parallel BC, AB \parallel CD$), $AB, AD$ và $SA$ nét đứt.
  - **Hình chóp đáy ngũ giác ($S.ABCDE$):** Đáy ngũ giác 5 đỉnh, cạnh đáy khuất $EA, AB$ và cạnh bên $SA$ nét đứt.
  - **Hình chóp tứ giác đều ($S.ABCD$):** Đáy hình vuông/bình hành phối cảnh, tâm đáy $O$, đường cao $SO \perp$ đáy nét đứt, 2 đường chéo $AC, BD$ nét đứt, cạnh $AB, AD$ và cạnh bên $SA$ nét đứt.
- **3. Trải nghiệm tương tác và tự động hóa:**
  - **Kéo vẽ trực quan & Live preview:** Nắm kéo chuột trên giấy để định cỡ hình; hình 3D hiển thị nét đứt và nét liền trực tiếp ngay trong khi rê chuột.
  - **Tự động gắn nhãn đỉnh:** Hiển thị tự động tên các đỉnh ($S, A, B, C, D, E, O$) cạnh các điểm góc.
  - **Điểm điều khiển (Handles) & Bắt dính (Snap):** Mỗi đỉnh có điểm điều khiển riêng; khi kéo điều chỉnh đỉnh, các cạnh tự co giãn theo; hỗ trợ bắt dính nam châm (Magnetic Snap) vào đỉnh các hình khác.
  - **Tâm $O$ thông minh ở hình chóp đều:** Khi kéo các đỉnh đáy $A, B, C, D$, tâm $O$ tự động cập nhật vị trí trung điểm hai đường chéo.
  - **Tìm cạnh & Chọn hình:** Hỗ trợ click/hover vào bất kỳ cạnh nào của khối 3D để chọn hoặc di chuyển cả hình (`translateElement`).

## [Thêm nút "Trung điểm": Chọn điểm 1 -> Chọn điểm 2 (hoặc điểm Cmd điểm) -> Hiển thị trung điểm] - 20/10/2026

- **1. Thêm lại nút "Trung điểm" vào menu `[ · Cơ bản ▾ ]`:**
  - Nút "Trung điểm" được bổ sung trở lại vào menu Cơ bản với biểu tượng đoạn thẳng có chấm trung điểm ở giữa.
- **2. Quy trình thao tác chọn điểm và hiển thị trung điểm:**
  - Khi bấm nút "Trung điểm": Con trỏ hiển thị con trỏ chọn (mũi tên nhọn chuẩn xác) để người dùng chọn điểm.
  - Người dùng nhấp chọn **Điểm 1** (đỉnh tam giác, đầu mút đoạn thẳng hoặc điểm rời) -> Điểm 1 hiển thị vòng ngắm xanh ngọc thanh thoát.
  - Sau đó nhấp chọn **Điểm 2** (có thể nhấp trực tiếp hoặc giữ phím `Cmd`/`Ctrl` nhấp điểm 2).
  - Hệ thống lập tức hiển thị đoạn thẳng nối 2 điểm và xuất ngay **trung điểm chính giữa** kèm vạch ký hiệu bằng nhau.
  - Tự động gộp nhóm trung điểm với hình chứa điểm và chuyển công cụ sang Chọn (`Select`).
- **3. Hỗ trợ chọn trước 2 điểm bằng phím Cmd:**
  - Người dùng có thể ở công cụ Chọn, giữ Cmd chọn sẵn 2 điểm rồi bấm nút "Trung điểm" để sinh ngay tức thì.
- **4. Bảng vẽ tinh gọn, sạch sẽ:**
  - Không còn các khung popup chữ đen (`🎯 Đoạn thẳng (Bấm tạo ngay trung điểm)`) che màn hình, mang lại trải nghiệm viết vẽ mượt mà và trực quan.

## [Xóa hoàn toàn chức năng/nút "Trung điểm" khỏi menu Cơ bản] - 20/10/2026

- **1. Xóa bỏ nút "Trung điểm" khỏi thanh công cụ:**
  - Gỡ bỏ mục "Trung điểm" khỏi menu xổ `[ · Cơ bản ▾ ]` trong giao diện HTML.
  - Đặt công cụ **"Đoạn thẳng"** làm công cụ con mặc định và biểu tượng mặc định của nhóm Cơ bản.
- **2. Xóa bỏ toàn bộ các hiệu ứng chỉ báo và hover:**
  - Xóa bỏ khung popup chữ màu đen (`🎯 Đoạn thẳng (Bấm tạo ngay trung điểm)`, `🎯 Điểm 1...`, `🎯 Điểm 2...`) và vòng tròn tâm.
  - Xóa bỏ quầng sáng xanh ngọc trên cạnh khi rê chuột, giữ bảng vẽ luôn sạch sẽ, thoáng mắt khi vẽ hình.
  - Xóa bỏ các nhánh xử lý liên quan đến chế độ `midpoint` trong logic dựng hình để ứng dụng nhẹ nhàng, mượt mà.

## [Hoàn tác các thiết lập cho button "Trung điểm" về hành vi chuẩn] - 20/10/2026

- **1. Xóa bỏ hoàn toàn các thiết lập tùy biến tạm thời của button "Trung điểm":**
  - Xóa bỏ việc tự động ép chuyển sang công cụ Chọn (`Select`) khi bấm nút Trung điểm.
  - Xóa bỏ cờ `pendingMidpointMode` và `midpointFirstPoint` khỏi trạng thái ứng dụng (`state`).
  - Xóa bỏ việc bắt chặn nhấp điểm / giữ Cmd trong công cụ Chọn đối với trung điểm, giữ công cụ Chọn thuần túy cho việc chọn, di chuyển, kéo handle và hỗ trợ "Chọn góc".
- **2. Khôi phục hành vi công cụ dựng hình chuẩn:**
  - Bấm vào nút "Trung điểm" trong nhóm `[ · Cơ bản ▾ ]` sẽ kích hoạt trực tiếp công cụ Trung điểm (`state.activeTool = 'geo'`, `state.activeGeo = 'midpoint'`).
  - Hỗ trợ đầy đủ các thao tác trực quan chuẩn mực:
    1. Nhấp trực tiếp 1 cạnh (đoạn thẳng, cạnh tam giác) để sinh ngay trung điểm chính giữa kèm vạch ký hiệu bằng nhau.
    2. Nhấp lần lượt 2 điểm bất kỳ để sinh ngay trung điểm nối giữa 2 điểm.
    3. Hỗ trợ chọn trước 2 điểm hoặc 1 cạnh rồi bấm nút "Trung điểm" để sinh tức thì.
  - Hiển thị viền ngắm / chấm ngắm (hover highlight) trên cạnh và điểm khi rê chuột.
  - Tự động gộp nhóm trung điểm với hình chứa cạnh/điểm và phục hồi tên nhóm về "Cơ bản".

## [Cải tiến nút Trung điểm: Xóa chọn cũ -> Chuyển sang tùy biến Chọn -> Bấm (Điểm Cmd Điểm) -> Xuất Trung điểm] - 20/10/2026

- **1. Xóa sạch mọi ghi nhớ chọn điểm phía trước & Chuyển sang tùy biến Chọn:**
  - Khắc phục triệt để tình trạng các điểm hay hình đang chọn từ thao tác trước vô tình kích hoạt tạo trung điểm ngoài ý muốn.
  - Ngay khi người dùng bấm vào nút "Trung điểm" trong nhóm `[ · Cơ bản ▾ ]`, ứng dụng **xóa trắng toàn bộ ghi nhớ chọn điểm / hình phía trước** (`selectedElements`, `selectedVertex`, `selectedEdge`, `midpointFirstPoint`), bảng vẽ trở về trạng thái sạch sẽ.
  - Tự động kích hoạt công cụ **Chọn** (`Select`), con trỏ canvas lập tức chuyển sang **con trỏ Chọn mũi tên nhọn** chuẩn xác.
  - Hệ thống bật cờ chế độ sẵn sàng tạo trung điểm và hiển thị hướng dẫn: *"Trung điểm: Bấm chọn điểm thứ nhất, sau đó giữ Cmd bấm chọn điểm thứ 2 để xuất trung điểm."*
- **2. Thao tác (Điểm Cmd Điểm) xuất trung điểm ngay lập tức:**
  - Người dùng bấm chọn điểm thứ 1 (đỉnh tam giác, đầu mút đoạn thẳng hoặc điểm rời), điểm 1 sáng quầng ngọc bích.
  - Người dùng giữ phím `Cmd` (trên Mac) hoặc `Ctrl` bấm chọn điểm thứ 2 (đỉnh khác của tam giác, đầu mút khác hoặc điểm rời khác).
  - Hệ thống lập tức hiển thị đoạn thẳng đậm nối 2 điểm và **hiển thị TRUNG ĐIỂM ngay lập tức** kèm 2 vạch ký hiệu bằng nhau chuẩn mực SGK!
- **3. Tự động gộp nhóm động & phục hồi tên nhóm:**
  - Trung điểm tự động được liên kết nhóm với hình chứa 2 điểm đó (di chuyển hình thì trung điểm đi theo đồng bộ, biến dạng đỉnh thì trung điểm tự cập nhật vị trí theo thời gian thực).
  - Nhãn dropdown `[ · Cơ bản ▾ ]` tự động phục hồi về tên chuẩn "Cơ bản".
  - Hoàn tác / Làm lại (`⌘Z` / `⌘⇧Z`) bảo toàn trọn vẹn.

## [Đổi lại Dựng góc thành "Chọn góc" tương tác: Chọn 1 đường, 1 điểm, vẽ đường còn lại theo số đo & hiện ô điều chỉnh] - 20/10/2026

- **1. Đổi tên thành "Chọn góc" & Chuyển con trỏ Chọn tức thì:**
  - Nút chức năng trong nhóm `[ ⦜ Dựng hình ▾ ]` được đổi tên từ "Dựng góc" thành **"Chọn góc"**.
  - Khi bấm vào nút "Chọn góc", con trỏ canvas lập tức chuyển sang con trỏ **Chọn** (mũi tên nhọn chuẩn xác) và giữ nguyên con trỏ Chọn trong suốt quá trình thao tác.
- **2. Quy trình tương tác chuẩn hóa: Chọn (cạnh cmd đỉnh) rồi mới vẽ góc:**
  - **Cách 1 (Chuẩn theo yêu cầu):**
    - Bước 1: Dùng công cụ Chọn (`Select`), nhấp chọn một **cạnh** (cạnh tam giác, hình bình hành, chữ nhật, hoặc đoạn thẳng), cạnh sáng viền ngọc bích.
    - Bước 2: Giữ phím `Cmd` (trên Mac) hoặc `Ctrl` nhấp chọn một **đỉnh** (đỉnh tam giác, đầu mút đoạn thẳng hoặc điểm), đỉnh sáng chấm ngọc bích rực rỡ.
    - Bước 3: Bấm nút "Chọn góc": Hệ thống lập tức dựng ngay đường còn lại theo số đo cho trước (0ms) từ đỉnh đã chọn, không cần phải nhấp lại trên giấy!
  - **Cách 2 (Bấm nút trước):**
    - Người dùng bấm nút "Chọn góc" trước -> con trỏ chuyển sang Chọn -> nhấp chọn cạnh rồi nhấp chọn đỉnh để vẽ góc.
- **3. Ẩn/Hiện thông minh ô số đo góc `[ ∡ 60 ° ]`:**
  - Bình thường ô số đo được ẩn gọn gàng trên thanh công cụ; chỉ khi vẽ xong góc (hoặc khi người dùng click chọn đối tượng góc), ô số đo mới hiện lên để điều chỉnh.
  - Sau khi vẽ xong góc, ô số đo tự động được chọn sẵn nội dung (auto-focus & select) để người dùng có thể gõ ngay số đo mong muốn (ví dụ 45°, 90°, 120°...).
  - Khi gõ số đo mới, đường còn lại tự động xoay theo số đo mới theo thời gian thực (0ms).
- **4. Hỗ trợ điểm điều khiển kéo xoay & Gộp nhóm động:**
  - Đầu mút của đường còn lại có chấm điều khiển kéo thả: người dùng có thể nắm kéo trực tiếp trên giấy để xoay góc, số đo trên ô input tự động đồng bộ theo.
  - Tự động gộp nhóm với đường cơ sở ban đầu, hỗ trợ di chuyển đồng bộ và hoàn tác/làm lại (`⌘Z` / `⌘⇧Z`) trọn vẹn.

## [Bổ sung các loại hình học mới: Hình bình hành, Hình vuông, Hình chữ nhật, Hình thoi, Elip có nhập 2 trục] - 20/10/2026

- **1. Bổ sung đầy đủ 5 loại hình học mới vào menu `[ △ Hình ▾ ]`:**
  - **Hình chữ nhật (`rectangle`):** Kéo vẽ theo góc hộp bao, 4 đỉnh vuông góc chuẩn mực, hỗ trợ kéo 4 góc để co giãn và giữ góc vuông.
  - **Hình vuông (`square`):** Kéo vẽ hình vuông đều 4 cạnh, bảo toàn tính chất hình vuông khi kéo điều chỉnh góc.
  - **Hình bình hành (`parallelogram`):** Kéo vẽ với góc nghiêng tự nhiên, 2 cặp cạnh đối diện luôn song song và bằng nhau ($P_0P_1 \parallel P_3P_2$ và $P_0P_3 \parallel P_1P_2$).
  - **Hình thoi (`rhombus`):** Kéo vẽ với 4 cạnh bằng nhau, 2 đường chéo vuông góc cắt nhau tại trung điểm mỗi đường; kéo đỉnh đường chéo dọc để chỉnh trục dọc, kéo đỉnh ngang để chỉnh trục ngang.
  - **Hình elip (`ellipse` - nhập số đo 2 trục):** Kéo vẽ trực quan trên giấy hoặc nhập trước 2 bán trục $a$ (ngang) và $b$ (dọc) trên thanh công cụ rồi click một điểm trên giấy để tạo ngay elip theo kích thước mong muốn.
- **2. Thanh nhập số đo 2 bán trục $a, b$ cho Elip (`#geo-ellipse-axes-container`):**
  - Tự động hiển thị khi chọn công cụ Elip hoặc khi bấm chọn bất kỳ hình elip nào trên trang.
  - Đồng bộ số đo theo thời gian thực khi kéo vẽ hoặc khi kéo các điểm điều khiển (handles) của elip.
  - Cho phép người dùng gõ số đo trực tiếp vào ô $a$ và $b$ để thay đổi kích thước elip đang chọn tức thì.
- **3. Tương tác & Điểm điều khiển (Control Handles & Hit Testing):**
  - Nâng cấp thuật toán kiểm tra chạm đa giác tổng quát `hitTestPolygon` dùng Ray-casting, nhận diện chính xác cả lòng và cạnh của tất cả các tứ giác mới.
  - Hỗ trợ bắt dính đỉnh (snapping), bắt dính cạnh (`findEdgeAt`), dựng trung điểm, đường vuông góc, song song lên bất kỳ cạnh nào của các tứ giác.
  - Tự động gộp nhóm, hoàn tác/làm lại (`⌘Z`/`⌘⇧Z`) và phục hồi nhãn nút `[ △ Hình ▾ ]` theo đúng quy tắc.

## [Sắp xếp lại cụm hình học theo 3 nhóm chuẩn: Cơ bản; Hình; Dựng hình] - 20/10/2026

- **1. Bố cục tinh gọn theo đúng 3 nhóm chuẩn SGK Hình học:**
  - `[ · Cơ bản ▾ ]`: Tập hợp các yếu tố hình học cơ bản gồm **Trung điểm**, **Đoạn thẳng**, **Đường tròn**, **Điểm**.
  - `[ △ Hình ▾ ]`: Tập hợp các dạng hình học phẳng gồm **Tam giác thường**, **Tam giác vuông**, **Tam giác cân**, **Tam giác nội tiếp**, **Đường tròn**.
  - `[ ⦜ Dựng hình ▾ ]`: Tập hợp toàn bộ các phép dựng hình & quan hệ hình học gồm **Phân giác**, **Vuông góc**, **Song song**, **Tiếp tuyến**, **2 tiếp tuyến**, **Dựng góc**.
  - Đi liền sau là ô nhập số đo góc `[ ∡ 60 ° ]` và nút vẽ `[ 📈 Đồ thị ]`.
- **2. Đồng bộ tự động phục hồi tên chuẩn:**
  - Cả 3 nhóm luôn tự động trở về đúng tên `Cơ bản`, `Hình`, `Dựng hình` ngay sau khi người dùng vẽ xong hình hoặc chuyển đổi công cụ.

## [Tự động hiển thị lại đúng tên các nút hình học sau khi hoàn thành tác vụ] - 20/10/2026

- **1. Phục hồi đúng tên & biểu tượng ban đầu (Auto-reset labels & icons):**
  - Khắc phục triệt để tình trạng các nút dropdown hình học trên thanh Header (`[Trung điểm ▾]`, `[Tam giác cân ▾]`, `[Phân giác ▾]`, `[Đường tròn ▾]`) bị đổi tên vĩnh viễn theo chức năng con vừa chọn (như Đoạn thẳng, Tam giác vuông, Vuông góc, Tiếp tuyến...) mà không đổi lại.
  - Ngay sau khi hoàn thành thao tác dựng hình (kéo vẽ xong đoạn thẳng, vẽ xong tam giác, tạo xong trung điểm, phân giác, đường vuông góc/song song, tiếp tuyến hay vẽ xong đồ thị hàm số):
    - Toàn bộ 4 nút dropdown lập tức được phục hồi đúng tên và đúng biểu tượng chuẩn ban đầu:
      1. `[ · Trung điểm ▾ ]`
      2. `[ △ Tam giác cân ▾ ]`
      3. `[ ∠ Phân giác ▾ ]`
      4. `[ ⏱ Đường tròn ▾ ]`
- **2. Tự động phục hồi khi chuyển đổi công cụ hoặc hủy thao tác:**
  - Khi người dùng bấm chuyển sang các công cụ viết vẽ khác (Bút viết, Dạ quang, Tẩy, Chọn, Chèn chữ, OCR...) hoặc nhấn phím `Escape`, toàn bộ nhãn các nhóm hình học cũng tự động trở về đúng tên mặc định.
- **3. Tự động chuyển tiếp sang công cụ Chọn (Select Tool):**
  - Sau khi dựng xong một đối tượng hình học, ứng dụng tự động chuyển sang công cụ Chọn (`Select`) và kích hoạt quầng sáng ngọc bích cùng các điểm điều khiển (control handles) của hình vừa tạo, giúp người dùng có thể kéo chỉnh sửa đỉnh/đầu mút hoặc di chuyển hình ngay lập tức.

## [Khắc phục triệt để lỗi menu dropdown bị che khuất: Luôn hiển thị lên trên cùng] - 20/10/2026

- **1. Xếp tầng hiển thị tuyệt đối (Stacking Context & Z-Index):**
  - Khắc phục lỗi menu xổ xuống từ thanh tiêu đề (`[Trung điểm ▾]`, `[Tam giác cân ▾]`, `[Phân giác ▾]`, `[Đường tròn ▾]`, `[Nhập ▾]`, `[Xuất ▾]`, `[...]`) bị thanh công cụ bên dưới (`primary-toolbar`) cắt đôi và che mất các mục lựa chọn phía trên.
  - Thiết lập `.app-header` có `position: relative` và `z-index: 500` cao hơn hẳn thanh công cụ chính (`z-index: 100`).
  - Toàn bộ menu dropdown (`.geo-dropdown-menu`, `.header-dropdown-menu`, `.toolbar-dropdown-menu`, `.context-select-menu`, `.bottom-dropdown-menu`) được nâng lên `z-index: 3500` nổi bật tuyệt đối trên bề mặt trang giấy và các thanh công cụ.
- **2. Đồng bộ tự động trên toàn bộ hệ thống menu:**
  - Khi bất kỳ menu dropdown nào được mở, thanh công cụ chứa nó tự động nhận lớp `.has-dropdown-open` (`z-index: 2500`) và container nhận `.open` (`z-index: 3000`), đảm bảo 100% menu luôn nổi lên trên cùng, không bao giờ bị bất kỳ thành phần nào khác che khuất.
  - Hộp thoại Modal (`.modal-backdrop`) được đặt ở tầng `z-index: 9999` để quản lý hộp thoại phủ lên toàn bộ giao diện.

## [Sắp xếp lại giao diện: Đưa cụm Hình học & Đồ thị lên sát bên phải chữ '· Đã lưu'] - 20/10/2026

- **1. Tái bố trí thanh tiêu đề (App Header):**
  - Di chuyển toàn bộ cụm công cụ Dựng hình học và Đồ thị (`[Trung điểm ▾]`, `[Tam giác cân ▾]`, `[Phân giác ▾]`, `[Đường tròn ▾]`, `[∡ 60 °]`, `|`, `[📈 Đồ thị]`) từ thanh công cụ chính lên đặt **ngay sát bên phải huy hiệu `· Đã lưu`** trên thanh tiêu đề trên cùng theo đúng ảnh minh họa của người dùng.
  - Tích hợp khung nhập hàm số toán học `y = ... [Vẽ]` ngay cạnh nút Đồ thị khi được kích hoạt.
- **2. Tối ưu hóa thanh công cụ chính (Primary Toolbar):**
  - Thanh công cụ chính bên dưới trở nên vô cùng thông thoáng, tập trung trọn vẹn vào các công cụ thao tác viết vẽ trực tiếp: `[Chọn]`, `[Bút]`, `[Dạ quang]`, `[Tẩy ▾]`, `[Chữ]`, `[✍️ OCR]`, cụm `[Hoàn tác] [Làm lại]` và toàn bộ cụm thuộc tính `[Bảng màu]`, `[Độ dày]`, `[Kiểu nét]`.
- **3. Kiểm thử & Tương thích:**
  - Bảo toàn 100% hoạt động của các menu xổ chọn hình học, tạo hình tự động, vẽ đồ thị, gộp nhóm động và hoàn tác/làm lại.

## [Gộp nhóm tự động & Ràng buộc hình học động khi di chuyển và biến động hình] - 20/10/2026

- **1. Tự động gộp nhóm (Automatic Grouping) giữa hình sinh ra và hình gốc:**
  - Khi sinh một đối tượng hình học phụ thuộc (**Trung điểm**, **Tia phân giác**, **Tiếp tuyến / 2 Tiếp tuyến**, **Đường vuông góc**, **Đường song song**), đối tượng sinh ra tự động liên kết với hình gốc thành **1 nhóm duy nhất** thông qua mã định danh `groupId`.
  - **Chọn trọn bộ nhóm trong 1 cú nhấp (Single-click Group Selection):** Khi dùng công cụ Chọn (`V`) bấm vào bất kỳ hình nào trong nhóm (hình mẹ hoặc hình con), toàn bộ các phần tử trong nhóm đều được chọn cùng lúc (`getGroupElements`).
  - **Hiệu ứng quầng sáng ngọc bích đồng bộ:** Toàn bộ các hình trong nhóm cùng bừng sáng quầng ngọc bích rực rỡ khi rê chuột (hover) hoặc khi được chọn, giúp người dùng nhận diện ngay mối quan hệ gắn kết giữa chúng.

- **2. Di chuyển đồng bộ (Synchronized Translation) khi dời hình:**
  - Khi dùng công cụ Chọn nắm kéo hình mẹ (hoặc bất kỳ hình nào trong nhóm), toàn bộ các đối tượng phụ thuộc sinh ra từ hình sẽ di chuyển nhịp nhàng theo hình gốc.
  - Sử dụng cơ chế `movedSet` chống dịch chuyển lặp lại (tránh lỗi double distance $2\times\Delta x$), đảm bảo khoảng cách tương đối giữa các hình luôn được bảo toàn tuyệt đối.

- **3. Ràng buộc hình học động theo thời gian thực khi có biến động (Dynamic Live Bindings):**
  - **Khi hình gốc bị biến động** (nắm kéo điểm nút điều khiển handle làm biến dạng đỉnh tam giác, co giãn đầu mút đoạn thẳng, thay đổi tâm/bán kính đường tròn, thay đổi số đo góc):
    - **Trung điểm (Midpoint):** Luôn tự động tính lại tọa độ trung điểm chính xác giữa 2 đầu mút đoạn thẳng hoặc cạnh tam giác ngay trong khi đang kéo thả chuột (`updateDependentBindings`).
    - **Tia phân giác (Angle Bisector):** Khi kéo dời một đỉnh bất kỳ của tam giác, tia phân giác tại đỉnh đó (hoặc đỉnh đối diện) tự động tính toán lại phương phân giác, tự động kéo dài cắt đúng cạnh đối diện và cập nhật cung góc bằng nhau theo thời gian thực.
    - **Tiếp tuyến (Tangent & Two-tangents):** Khi kéo thay đổi bán kính hoặc tâm đường tròn, tiếp tuyến và các tiếp điểm tự động bám sát chu vi mới của đường tròn.
    - **Đường vuông góc & Đường song song:** Tự động xoay phương và vị trí chân đường vuông góc / phương song song khi đường thẳng cơ sở bị xoay hoặc thay đổi góc.

- **4. Hoàn tác / Làm lại toàn diện (`⌘Z` / `⌘⇧Z`):**
  - Bổ sung lệnh `modify-element-group` lưu snapshot trạng thái hình học của cả hình mẹ và toàn bộ các hình con phụ thuộc. Khi nhấn hoàn tác, cả nhóm cùng quay trở lại hình dạng và vị trí trước biến động.

## [Tối ưu hóa cách chọn & hiển thị chấm trung điểm thanh mảnh] - 20/10/2026

- **1. Thiết lập cách chọn tạo trung điểm tối ưu & trực quan:**
  - **1 Cú nhấp chuột trực tiếp vào CẠNH (Đoạn thẳng hoặc cạnh tam giác):**
    - Vùng nhận diện cạnh được nới rộng lên 28px. Khi rê chuột qua cạnh bất kỳ, toàn bộ đoạn thẳng/cạnh phát sáng quầng xanh ngọc rực rỡ (`rgba(34, 197, 94, 0.42)`) kèm chỉ báo nhắm `🎯 Đoạn thẳng (Bấm tạo ngay trung điểm)`.
    - **Xem trước trực tiếp (Live Preview):** Hiển thị chấm tròn nhỏ thanh mảnh xem trước ở chính giữa đoạn thẳng trước khi nhấp chuột. Nhấp chuột là đoạn thẳng sáng đậm lên và trung điểm xuất hiện ngay.
  - **Nhấp chọn 2 ĐIỂM (hoặc 2 đỉnh):**
    - Rê chuột vào Điểm 1: Điểm sáng quầng ngọc bích `🎯 Điểm 1 (Bấm để chọn)`.
    - Nhấp Điểm 1: Điểm 1 phát sáng cố định kèm nhãn `✓ Điểm 1: Đã chọn`.
    - Rê chuột sang Điểm 2: Điểm 2 sáng lên `🎯 Điểm 2`, xuất hiện **đường nối nét đứt xem trước mờ kèm chấm trung điểm ở giữa** trước mắt.
    - Nhấp Điểm 2: Hoàn tất tạo trung điểm ngay lập tức.
  - **Tự động từ công cụ Chọn (`Select Tool`):** Chọn trước 1 đoạn thẳng hoặc giữ `⌘`/`Ctrl` chọn 2 điểm rồi bấm nút "Trung điểm" (hoặc phím `M`) để tạo ngay tức thì.

- **2. Cách hiển thị chấm trung điểm thanh mảnh & tinh tế:**
  - **Chấm trung điểm có nét mảnh bằng nét của đoạn thẳng:** Chấm tròn nhỏ thanh mảnh, bán kính vừa vặn $r \approx 2.2 - 2.5\text{px}$, màu sắc đồng điệu với đoạn thẳng, tệp hoàn hảo vào thân đoạn thẳng mà không bị thô dày.
  - **Không vẽ ký hiệu vạch gạch chéo:** Giữ mặt hình học sạch sẽ, thanh thoát, tập trung vào điểm chia đôi đoạn thẳng theo đúng yêu cầu người dùng.
  - **Bảo toàn khi di chuyển:** Khi kéo di chuyển trung điểm hoặc di chuyển đoạn thẳng bằng công cụ Chọn, chấm trung điểm luôn di chuyển chính xác và mượt mà.
  - **Hỗ trợ đầy đủ Hoàn tác / Làm lại (`⌘Z` / `⌘⇧Z`).**

## [Tối ưu hóa cách chọn 2 cạnh & hiển thị tia phân giác chuẩn SGK Hình học] - 20/10/2026

- **1. Thiết lập cách chọn 2 cạnh của góc tối ưu & trực quan:**
  - **Phản hồi tức thì 0ms (Instant PointerDown):** Bắt sự kiện chọn cạnh/đỉnh ngay khi vừa chạm chuột/bút (`pointerdown`), loại bỏ hoàn toàn tình trạng trượt hoặc trễ do xê dịch chuột trước khi nhả chuột (`pointerup`).
  - **Nới rộng vùng nhận diện cạnh (Hit Radius 28px):** Tăng bán kính phát hiện cạnh từ 20px lên 28px giúp người dùng dễ dàng chạm trúng cạnh của tam giác hoặc đoạn thẳng mà không sợ bị lệch ra ngoài.
  - **Chỉ báo trực quan khi rê chuột (Interactive Hover Glow):**
    - Khi rê chuột qua một cạnh: Cạnh đó sáng bừng lên với quầng sáng ngọc bích `rgba(34, 197, 94, 0.35)` kèm chỉ báo nhắm `🎯 Cạnh 1 (Bấm để chọn)`.
    - Sau khi nhấp chọn Cạnh 1: Cạnh 1 phát sáng rực rỡ cố định kèm huy hiệu `✓ Cạnh 1: Đã chọn`.
    - Khi rê chuột đến Cạnh 2: Cạnh 2 phát sáng kèm chỉ báo `🎯 Cạnh 2 (Bấm tạo phân giác)` và **đường nét đứt mô phỏng trước tia phân giác (Live Preview)** xuất hiện tức thì để người dùng xem trước vị trí đường phân giác trước khi nhấp chuột.
  - **Đột phá tiện lợi: 1 Cú nhấp chuột vào ĐỈNH GÓC của Tam giác:**
    - Người dùng chỉ cần nhấp trực tiếp vào đỉnh của tam giác (ví dụ đỉnh $A$ của tam giác $ABC$).
    - Hệ thống tự động nhận diện đỉnh và 2 cạnh kề của tam giác, tự động dựng ngay tia phân giác của góc tại đỉnh đó cắt thẳng vào cạnh đối diện $BC$.
  - **Dựng tự động từ công cụ Chọn (Select Tool) hoặc từ Góc theo số đo (`angle`):**
    - Chọn trước 2 đoạn thẳng bằng phím `⌘`/`Ctrl` rồi bấm "Phân giác" $\rightarrow$ tự động dựng tia phân giác.
    - Chọn 1 đối tượng góc (`shape: angle`) rồi bấm "Phân giác" $\rightarrow$ tự động chia đôi góc thành 2 góc bằng nhau.

- **2. Cách hiển thị tia phân giác chuẩn mực theo SGK Toán học:**
  - **Tia phân giác trong tam giác cắt chuẩn xác cạnh đối diện:**
    - Khi dựng phân giác của góc tam giác, tia phân giác kéo dài từ đỉnh $A$ và **cắt chính xác cạnh đối diện $BC$ tại chân đường phân giác $D$** (nhờ thuật toán tính giao điểm đoạn thẳng `rayIntersectSegment`).
    - Có chấm điều khiển (handle) ở đầu mút $D$ cho phép người dùng nắm kéo dài ra ngoài tam giác hoặc thu ngắn lại tùy ý theo đúng phương phân giác.
  - **Ký hiệu hai góc bằng nhau $\widehat{V}_1 = \widehat{V}_2$ chuẩn mực:**
    - Thay thế cách vẽ 2 cung lệch bán kính trước đây.
    - Vẽ 2 vòng cung thanh thoát có **cùng bán kính $R = 26px$** nằm ở 2 bên tia phân giác.
    - Ở chính giữa mỗi cung có **1 vạch gạch chéo ngắn (tick mark)** cắt vuông góc qua cung tròn. Đây là ký hiệu toán học chuẩn mực của SGK Việt Nam thể hiện hai góc bằng nhau một cách rõ ràng và chuyên nghiệp nhất.
  - **Hỗ trợ đầy đủ Hoàn tác / Làm lại (`⌘Z` / `⌘⇧Z`):** Toàn bộ thao tác tạo tia phân giác và điều chỉnh độ dài đều được lưu vết vào lịch sử thao tác.

## [Mũi tên nhọn chuẩn xác & Hiệu ứng phát sáng rực rỡ khi chọn đối tượng] - 20/10/2026

- **Con trỏ Mũi tên nhọn chuẩn xác cho công cụ Chọn (macOS Sharp Arrow Pointer):**
  - Biểu tượng con trỏ chuột trên vùng giấy vẽ khi dùng công cụ Chọn hiển thị chuẩn mũi tên nhọn $\nwarrow$ màu xanh ngọc đậm viền trắng sắc nét.
  - Điểm ngắm (hotspot `3, 3`) nằm ngay tại đầu nhọn của mũi tên, giúp người dùng chạm và bấm chọn chính xác từng điểm ảnh (pixel-perfect).
  - Giữ vững con trỏ mũi tên nhọn xuyên suốt khi rê qua các đỉnh tam giác, đầu mút đoạn thẳng, điểm hình học và các thân hình, không còn bị đổi sang các con trỏ gây rối mắt.
- **Hiệu ứng phát sáng rực rỡ (Luminous Emerald Glow) khi chọn đối tượng để dễ hình dung:**
  - Khi người dùng nhấp chọn bất kỳ đối tượng nào (hoặc khi rê chuột hover qua), toàn bộ hình dáng hình học thực tế (đoạn thẳng, đường tròn, tam giác, tam giác nội tiếp, 2 tiếp tuyến, nét vẽ tự do, văn bản, ảnh) lập tức **sáng bừng lên với quầng sáng ngọc bích rực rỡ** (`rgba(34, 197, 94, 0.45)`, bóng mờ mềm mại và nét lõi xanh đậm).
  - **Tô nhẹ lòng tam giác:** Riêng các dạng tam giác (thường, vuông, cân, nội tiếp), hệ thống phủ thêm lớp màu xanh ngọc nhẹ trong lòng tam giác (`rgba(34, 197, 94, 0.09)`), giúp mắt nhận diện trọn vẹn diện tích và hình dạng tam giác đang được chọn.
  - Khi chọn nhiều đối tượng (bằng `⌘`/`Ctrl` click), tất cả các đối tượng trong nhóm đều cùng nhau phát sáng đồng bộ.
  - Đối với đối tượng Điểm, hiển thị quầng sáng kép đi kèm chỉ báo mũi tên nhọn ghim thẳng vào tâm điểm.

## [Tối ưu hóa phản hồi tức thì & Bổ sung đoạn thẳng đậm trước khi xuất hiện trung điểm] - 20/10/2026

- **Tối ưu hóa tốc độ phản hồi cực nhanh (Instant 0ms Latency):**
  - Xử lý các thao tác chọn điểm và dựng hình ngay trên sự kiện chạm `pointerdown`, loại bỏ hoàn toàn cảm giác chậm hoặc phải chờ thả chuột `pointerup`.
- **Hiển thị đoạn thẳng đậm hơn để người dùng dễ hình dung trước khi xuất hiện trung điểm:**
  - Khi người dùng chọn 2 điểm (bằng phím `⌘`/`Ctrl` trong công cụ Chọn) hoặc bấm 2 điểm trong công cụ Trung điểm:
    - Đoạn thẳng nối 2 điểm đó lập tức **sáng bừng lên với nét đậm 4.5px và quầng sáng xanh ngọc 11px**, giúp mắt định hình rõ ràng đoạn thẳng.
    - Sau khoảng 200ms, chấm tròn nhỏ trung điểm xuất hiện tại chính giữa đoạn thẳng.
- **Tự động sinh trung điểm ngay từ công cụ Chọn:**
  - Trong công cụ Chọn, khi bấm 1 điểm rồi giữ `⌘` (Mac) hoặc `Ctrl` (Windows) bấm thêm 1 điểm, hệ thống tự động làm đậm đoạn thẳng và sinh ngay chấm trung điểm mà không cần phải bấm thêm menu.
- **Bổ sung tính năng "Trung điểm" vào menu xổ Cơ bản:**
  - Thêm lựa chọn **"Trung điểm"** vào menu `[Cơ bản ▾]` (cùng nhóm với Điểm, Đoạn thẳng, Đường tròn) kèm phím tắt `M`.
  - Hỗ trợ đầy đủ di chuyển, bắt dính nam châm và Hoàn tác / Làm lại (`⌘Z` / `⌘⇧Z`).

## [Tối ưu hóa điều chỉnh đỉnh tam giác & 2 đầu đoạn thẳng] - 20/10/2026

- **Tối ưu hóa công cụ Chọn (Select Tool) khi thao tác với đỉnh tam giác và đầu mút đoạn thẳng:**
  - **Mở rộng vùng bấm nhạy bén gấp đôi (28px - 34px):** Bán kính phát hiện tay cầm điều khiển (handle) được tăng từ 14px lên 28px (và 34px khi đối tượng đã chọn). Người dùng chỉ cần nhấp chuột hoặc chạm bút gần đỉnh/đầu mút là hệ thống lập tức bắt trúng nút điều khiển, loại bỏ hoàn toàn tình trạng bấm trượt thành kéo di chuyển cả hình vẽ.
  - **Chỉ báo ngắm đỉnh trực quan (Interactive Hover Glow):** Khi rê chuột gần bất kỳ đỉnh tam giác hoặc đầu mút đoạn thẳng nào, điểm nút tự động nở lớn nổi bật với viền hào quang xanh ngọc lấp lánh (vòng sáng 14px), con trỏ đổi sang hình chữ thập `crosshair`, và thanh trạng thái hiển thị rõ tên đỉnh đang nhắm (`🎯 Đang nhắm: Đỉnh tam giác... / Đầu mút...`).
  - **Bắt dính thông minh (Magnetic Snapping 24px):** Khi kéo đỉnh tam giác hoặc đầu mút đoạn thẳng, hệ thống tự động hút dính mượt mà vào các điểm hình học, đỉnh tam giác khác hoặc chu vi đường tròn gần đó kèm vòng ngắm chỉ báo vị trí.
  - **Khóa góc 45° với phím Shift:** Khi kéo đầu mút đoạn thẳng, nhấn giữ phím `Shift` sẽ khóa theo góc bội số của 45° (ngang, dọc, chéo 45°).
  - **Hỗ trợ đầy đủ Hoàn tác / Làm lại (Undo/Redo):** Toàn bộ thao tác kéo đỉnh hoặc co giãn đầu mút đều được ghi nhận vào lịch sử `⌘Z` / `⌘⇧Z`.

## [Khắc phục sự cố bút viết & hoàn thiện các menu xổ hình học] - 20/10/2026

- **Khắc phục triệt để sự cố Bút viết chưa viết được trên bảng vẽ:**
  - Loại bỏ lỗi tham chiếu `statusPressureInfo` và `statusToolInfo` gây gián đoạn chu trình bắt sự kiện chuột/bút (`pointerdown` & `pointermove`).
  - Đảm bảo ma trận co giãn màn hình sắc nét Retina (DPR Scaling) luôn được duy trì liên tục, cố định tọa độ 1:1 khi rê vẽ bút và dạ quang.
  - Xử lý mượt mà cả khi chấm từng chấm nhỏ (dot của chữ 'i', dấu chấm câu, dấu phẩy) và rê nét dài liên tục.
- **Khắc phục sự cố Menu xổ hình học chưa hiển thị đối tượng:**
  - Sửa lỗi thanh công cụ chính bị ẩn tràn (`overflow-x: auto`), cho phép cả 4 nhóm dropdown (`Cơ bản`, `Tam giác`, `Quan hệ`, `Đường tròn`) xổ xuống trực quan nổi lên trên mặt giấy vẽ với `z-index: 2000`.
  - Tích hợp biểu tượng hình học trực quan sắc nét (Điểm, Đoạn thẳng, Đường tròn, Tam giác thường/vuông/cân, Vuông góc, Song song, Phân giác, Dựng góc, Nội tiếp, Tiếp tuyến) cạnh từng tên gọi trong menu xổ.
  - Tự động cập nhật tên và biểu tượng trên nút nhóm cha khi người dùng chọn hình học bất kỳ.
- **Rà soát toàn diện và kiểm tra kiểm thử:**
  - Kiểm tra toàn bộ vòng đời tương tác Bút vẽ, Dạ quang, Tẩy, Chọn đối tượng, Dựng hình học và Đồ thị trên JavaScriptCore đảm bảo 100% hoạt động mượt mà, không còn bất kỳ lỗi runtime nào.

## [Khôi phục đầy đủ tính năng sẵn sàng sử dụng ngay] - 20/10/2026

- **Giữ nguyên giao diện 1 hàng tinh gọn & đưa đầy đủ tính năng ra ngoài sẵn sàng sử dụng:**
  - Bố cục 1 hàng liền mạch, trực quan: `[Chọn] [Bút] [Dạ quang] [Tẩy ▾] [Chữ] | [Cơ bản ▾] [Tam giác ▾] [Quan hệ ▾] [Đường tròn ▾] | [∡ 60°] | [Đồ thị] | [↶] [↷] | [Màu: ● ● ● ● (+)] [Độ dày: [━ ▾]] [Kiểu nét: [Liền ▾]]`.
  - **Bút viết & Dạ quang:** Tách thành 2 nút độc lập, bấm là viết ngay tức thì; loại bỏ hoàn toàn việc nhảy menu popup độ dày tự động làm gián đoạn việc vẽ.
  - **Tẩy ▾:** Bấm là chuyển sang tẩy ngay; bấm mũi tên `▾` để chọn giữa Tẩy từng tí (Tẩy nét) hoặc Tẩy cả hình (Đối tượng).
  - **13 Công cụ hình học trực quan:** Bốn nhóm Cơ bản, Tam giác, Quan hệ, Đường tròn và Ô đo góc 60° hiển thị sẵn sàng, bấm chọn hình nào là kéo vẽ ngay hình đó.
  - **Bảng màu & Cỡ nét luôn hiển thị:** Sẵn sàng cho cả viết bút và vẽ các dạng hình học.

## [Đưa thanh tùy chọn lên cùng hàng 1] - 20/10/2026

- **Hợp nhất thanh tùy chọn lên hàng 1 duy nhất (Single Unified Toolbar):**
  - Chuyển toàn bộ các tùy chọn ngữ cảnh (Màu sắc, Độ dày nét, Kiểu nét, các menu Hình học, Đồ thị, cỡ Tẩy, OCR) từ hàng thứ 2 lên nằm chung trên **hàng 1 duy nhất** bên cạnh các nút công cụ chính và Hoàn tác/Làm lại.
  - Bố cục 1 hàng liền mạch: `[Chọn] [Bút ▾] [Tẩy ▾] [Chữ] | [Hình học ▾] [Đồ thị] | [↶] [↷] | [Màu: ● ● ● ● (+) | Độ dày: [━ ▾] | Kiểu nét: [Liền ▾]]`.
  - Loại bỏ hoàn toàn dải thanh hàng 2 riêng biệt, giúp giải phóng và mở rộng thêm ~40px chiều cao cho vùng giấy viết vẽ ghi chép.
  - Giữ nguyên 100% chức năng tương tác và cơ chế tự động mở menu xổ kế tiếp.

## [Menu xổ gom Bút & Dạ quang & Chuyển tiếp tùy chọn] - 20/10/2026

- **Gom Bút & Dạ quang vào menu xổ `[Bút ▾]`:**
  - Thay thế 2 nút Bút và Dạ quang riêng lẻ bằng một nút menu xổ duy nhất trên thanh công cụ chính.
  - Bấm vào nút hoặc mũi tên để xổ menu chọn giữa **Bút viết (Mực thường)** và **Bút dạ quang (Đánh dấu)**.
  - Tự động cập nhật biểu tượng và tên trên nút thanh chính theo loại vừa chọn.
- **Chuyển tiếp tự động sang menu xổ tùy chọn (Hình 2):**
  - Ngay sau khi chọn 1 loại bút, hệ thống kích hoạt loại bút đó và tự động mở tiếp menu xổ của **Độ dày `[━ ▾]`** (hoặc sẵn sàng cho **Kiểu nét `[Liền ▾]`**) trên thanh tùy chọn.
  - Tinh chỉnh nút chọn màu có viền tròn kép thanh lịch và các nút `[━ ▾]`, `[Liền ▾]` có khung hộp bo góc khớp chuẩn hình 2.

## [Tái thiết kế giao diện toàn diện theo 4 hình đề xuất] - 20/10/2026

- **Tầng 1 - Thanh tiêu đề tài liệu (App Header):**
  - Đưa tên tài liệu sang bên trái: `nét. | Ghi chú hình học & bài tập · Đã lưu` (bấm vào để đổi tên trực tiếp, huy hiệu "· Đã lưu" màu nhẹ bên cạnh).
  - Loại bỏ hoàn toàn slogan khỏi màn hình soạn thảo và bỏ 3 nút tròn đỏ-vàng-xanh trang trí web.
  - Gom các menu góc phải: `[Nhập ▾]` (Nhập PDF..., Nhập ảnh...), `[Xuất ▾]` (Xuất PDF..., Xuất ảnh PNG..., Xuất văn bản .txt...), `[...]` (Thông tin Nét, Xóa toàn bộ trang).
- **Tầng 2 - Thanh công cụ chính (Primary Toolbar):**
  - Bố cục thuần thao tác: `[Chọn] [Bút] [Dạ quang] [Tẩy ▾] [Chữ]  |  [Hình học ▾] [Đồ thị]  |  [↶] [↷]`.
  - Gom menu `Tẩy ▾`: Tẩy từng tí (Tẩy nét), Tẩy cả hình (Đối tượng), Xóa toàn bộ hình trên trang.
  - Menu `Hình học ▾`: Hình học phẳng / Hình học không gian.
  - Thêm nút `Đồ thị` chuyên dụng cho vẽ hàm số toán học.
  - Hoàn tác / Làm lại đặt cạnh nhóm chính ở vị trí cố định.
  - Nút kích hoạt (active) dùng nền xanh nhạt dịu mắt (`rgba(40, 99, 78, 0.12)`) và chữ/icon xanh đậm, loại bỏ viền hộp cứng.
- **Tầng 3 - Thanh tùy chọn theo công cụ (Contextual Option Bar):**
  - Tự động thay đổi linh hoạt theo công cụ đang chọn:
    - *Bút & Dạ quang:* Bảng 4 màu nhanh + nút `+` tùy chọn, Độ dày nét `[━ ▾]` (1.5px, 2.5px, 5px, 10px), Kiểu nét `[Liền ▾] / [Đứt ▾]`.
    - *Hình học phẳng:* 4 nhóm dropdown `[Cơ bản ▾]`, `[Tam giác ▾]`, `[Dựng hình ▾]`, `[Đường tròn ▾]`. **Ô góc 60° chỉ xuất hiện khi chọn Dựng góc**.
    - *Đồ thị:* `y = [Nhập hàm số...] [Vẽ đồ thị] | [Thiết lập trục Oxy]`, tích hợp parser và renderer tự động vẽ đồ thị hàm số toán học lên giấy.
    - *Tẩy:* Lựa chọn cỡ đầu tẩy Nhỏ (8px), Vừa (14px), Lớn (24px).
    - *Chọn đối tượng:* Gợi ý phím tắt và nút `[✍️ Nhận dạng chữ (OCR)]`.
- **Tầng 4 - Vùng làm việc chính:**
  - Cột thu nhỏ trang bên trái: tiêu đề 1 dòng `TRANG · X    [«]`.
  - Giấy vẽ canvas: **Loại bỏ hoàn toàn nhãn `● Trang 1` to đè lên mặt giấy**, giữ không gian trang vẽ sạch sẽ và thoáng đãng.
- **Tầng 5 - Thanh đáy (App Bottom Bar):**
  - Bố cục: `[ ◫ ] [Trang 1] [Trang 2] [+]            [Hiển thị ▾] · − 100% + · [Vừa ngang]`.
  - Menu `Hiển thị ▾`: Chuyển đổi kiểu nền giấy (Ô vuông, Kẻ dòng, Giấy trơn) và Hướng trang (Khổ dọc, Khổ ngang).
  - Cụm thu phóng Zoom và nút `Vừa ngang` đặt ở góc phải thanh đáy.

## [Giai đoạn 0 & Giai đoạn 1] - 19/10/2026

### Đã thêm:
- **Cấu trúc dự án:** Tạo các thư mục `docs/`, `web/`, `macOS/`, `reference/`.
- **Tài liệu quy tắc:** Tạo [AGENTS.md](file:///Users/thien/shan.note/AGENTS.md) và chuẩn hóa [NET_PROJECT.md](file:///Users/thien/shan.note/NET_PROJECT.md).
- **Bộ mã nguồn Web Core (Giai đoạn 1):**
  - [web/index.html](file:///Users/thien/shan.note/web/index.html): Giao diện ứng dụng hoàn chỉnh chuẩn macOS; bổ sung 4 công cụ hình học mới: **2 Tiếp tuyến**, **Vuông góc**, **Song song**, **Phân giác**; loại bỏ hoàn toàn chấm tròn tô màu đen `fill="currentColor"` trong các icon, chuyển sang nét thanh `fill="none"`.
  - [web/style.css](file:///Users/thien/shan.note/web/style.css): Hệ thống kiểu dáng theo bảng màu chuẩn Nét (`#243c36`, `#28634e`, `#fffef9`), lưới ô vuông 24px, kẻ dòng 32px, bổ sung kiểu dáng hộp thoại OCR dạng sheet nổi macOS.
  - [web/app.js](file:///Users/thien/shan.note/web/app.js): Xử lý vẽ nét tự nhiên, nhận diện lực nhấn bút (`pressure`), 12 công cụ hình học tương tác, loại bỏ toàn bộ `context.fill()` tô cục màu đen khi vẽ hình học (tâm $O$ vẽ dấu thập thanh mảnh không tô màu, không tô màu tại tiếp điểm hay đỉnh, tam giác cân đánh dấu bằng vạch chéo thanh mảnh).

## [Dựng hình hình học tương tác: Vuông góc, Song song & Phân giác] - 19/10/2026
- **Vuông góc (Perpendicular):** Chuyển sang cơ chế chọn 1 điểm và 1 đường thẳng/cạnh (bấm điểm trước hoặc đường thẳng trước đều được). Vẽ đường thẳng vuông góc qua điểm đó kèm ký hiệu góc vuông chuẩn xác tại chân đường vuông góc; có 2 điểm điều khiển ở 2 đầu mút để người dùng nắm kéo thu hẹp hoặc mở rộng độ dài đường thẳng theo ý muốn.
- **Song song (Parallel):** Cơ chế chọn 1 điểm và 1 đường thẳng/cạnh. Vẽ đường thẳng song song qua điểm đó kèm ký hiệu mũi tên song song; có 2 điểm điều khiển ở 2 đầu mút để kéo thu hẹp hoặc mở rộng độ dài đường thẳng theo phương song song.
- **Phân giác (Angle Bisector):** Chuyển sang cơ chế chọn 2 cạnh (2 cạnh tam giác hoặc 2 đoạn thẳng bất kỳ). Tự động tìm đỉnh/giao điểm và tính toán hướng tia phân giác; vẽ đường phân giác kèm 2 cung góc bằng nhau ở đỉnh; có điểm điều khiển đầu mút để kéo thu hẹp hoặc mở rộng độ dài tia phân giác (ví dụ kéo dài cắt cạnh đối diện của tam giác).
- **Phản hồi trực quan (Visual Feedback):** Vẽ vòng tròn sáng quanh điểm đã chọn và vệt sáng viền quanh đường thẳng/cạnh đã chọn trong lúc thao tác, thanh trạng thái hiển thị hướng dẫn từng bước bằng tiếng Việt rõ ràng.

## [Công cụ Điểm, Chọn đối tượng, Tiếp tuyến mới & Tẩy 2 chế độ] - 19/10/2026
- **Nút tạo điểm hình học:** Thêm nút "Điểm" trên thanh công cụ hình học; cho phép nhấp tạo điểm hình học độc lập trên giấy; hỗ trợ chấm điều khiển di chuyển.
- **Công cụ Chọn đối tượng (Select Tool) & Chọn nhiều đối tượng:** Biểu tượng con trỏ chuột mũi tên chuẩn Mac; bấm chọn nét vẽ hoặc hình để xem khung viền đứt nét; **bấm và giữ phím Command (trên Mac) hoặc Ctrl (trên Win) để chọn 2, 3... đối tượng cùng lúc**; nắm kéo di chuyển cả nhóm đồng thời; nhấn phím `Backspace` hoặc `Delete` để xóa tất cả các hình đang chọn; phím tắt `V` hoặc `S`.
- **Dựng hình tự động từ 2 đối tượng chọn trước:** Khi người dùng chọn trước 2 đối tượng (bằng công cụ Chọn và giữ ⌘/Ctrl), sau đó bấm vào nút công cụ hình học tương ứng sẽ tự động dựng hình ngay tức thì:
  - Chọn 1 điểm + 1 đường thẳng/cạnh $\rightarrow$ bấm **Vuông góc** sẽ xuất hiện ngay đường vuông góc.
  - Chọn 1 điểm + 1 đường thẳng/cạnh $\rightarrow$ bấm **Song song** sẽ xuất hiện ngay đường song song.
  - Chọn 2 cạnh $\rightarrow$ bấm **Phân giác** sẽ xuất hiện ngay tia phân giác của góc tạo bởi 2 cạnh.
  - Chọn 1 điểm + 1 đường tròn $\rightarrow$ bấm **Tiếp tuyến** hoặc **2 Tiếp tuyến** sẽ xuất hiện ngay tiếp tuyến.
- **Tiếp tuyến theo điểm & đường tròn (Tangent):** Đổi sang cơ chế: chọn 1 điểm (ngoài đường tròn hoặc trên đường tròn) + chọn 1 đường tròn $\rightarrow$ tự động dựng tiếp tuyến chính xác; có ký hiệu vuông góc tại tiếp điểm; có 2 chấm điều khiển ở 2 đầu mút để kéo thu hẹp hoặc mở rộng độ dài đường tiếp tuyến.
## [Chỉ báo Mũi tên nhọn & Ưu tiên chọn ĐIỂM khi nằm lẫn lộn nhiều hình] - 19/10/2026
- **Ưu tiên tuyệt đối đối tượng là ĐIỂM khi nhấp chuột / rê chuột:** Trong thuật toán tìm phần tử `findElementAt`, đối tượng điểm (`shape === 'point'`) được kiểm tra ưu tiên hàng đầu trong bán kính 22px. Loại bỏ triệt để hiện tượng click vào điểm nhưng lại bị dính nhầm vào tam giác, đường thẳng hay đường tròn nằm xung quanh.
- **Chỉ báo Mũi tên nhọn (Sharp Arrow Pointer Indicator):** 
  - Khi rê chuột đến gần điểm trong công cụ Chọn, hiển thị hình chiếc phi tiêu/mũi tên nhọn chuẩn phong cách macOS $\nwarrow$ ghim thẳng đầu nhọn vào tâm điểm, kèm vòng tròn ngắm tâm sắc nét và nhãn "Điểm", giúp người dùng nhìn thấy trước và chắc chắn 100% đang trỏ trúng điểm.
  - Khi điểm được chọn, mũi tên nhọn và vòng tròn ngắm tâm ghim chặt vào điểm để nhận diện tức thì điểm đã chọn.
  - Khi vẽ đoạn thẳng, đầu mút bắt dính nam châm cũng hiển thị mũi tên nhọn chỉ vào điểm đích.
- **Kiểm tra hình học chính xác:** Thay thế việc dùng bounding box hình chữ nhật lớn của tam giác và đoạn thẳng bằng kiểm tra khoảng cách hình học thực tế (`distToSegment` cho đoạn thẳng, tọa độ trọng tâm cho tam giác), tránh chiếm dụng không gian của các điểm lân cận.

## [Tối ưu hóa công cụ Tẩy: 2 nút trực quan rõ ràng, đầu tẩy nhỏ gọn & siêu mượt] - 19/10/2026
- **Hiển thị trực quan 2 nút chọn loại tẩy:** Bố trí 2 nút riêng biệt ngay trên thanh công cụ: **Xóa hết hình** (Option 1) và **Xóa từng tí** (Option 2), giúp người dùng nhìn thấy ngay tức thì và chuyển đổi chỉ với 1 cú click (hoặc nhấn phím `E` để đổi qua lại).
- **Đầu tẩy nhỏ hơn (r = 8px):** Thu nhỏ bán kính từ 16px xuống 8px kèm tâm điểm ngắm đỏ sắc nét, giúp xóa tỉ mỉ từng chi tiết nhỏ mà không xóa lấn sang nét bên cạnh.
- **Tẩy siêu mượt mà:** Bổ sung thuật toán nội suy liên tục bước 2.5px theo đường rê chuột kết hợp lấy mẫu mịn 2px, loại bỏ hoàn toàn hiện tượng răng cưa hay đứt quãng khi đưa tẩy nhanh.

## [Cuộn hết 1 trang - Cuộn tiếp tự động sinh trang mới] - 19/10/2026
- **Cuộn liên tục tự nhiên:** Khi cuộn chuột hoặc vuốt 2 ngón trên trackpad xuống hết trang hiện tại, tiếp tục cuộn có chủ đích sẽ tự động sinh ngay Trang mới (Trang 2, Trang 3...), tự động tạo thẻ tab trên thanh điều hướng và đưa vùng nhìn lên đầu trang mới một cách mượt mà.
- **Điều hướng hai chiều giữa các trang:**
  - Nếu ở trang giữa (ví dụ Trang 1 khi đã có Trang 2): cuộn qua đáy trang sẽ tự động chuyển tiếp sang Trang 2.
  - Khi ở đỉnh trang (ví dụ Trang 2) và cuộn ngược lên trên: tự động quay lại đáy trang trước đó (Trang 1).
- **Thẻ chỉ báo & Thanh tiến trình nạp (Interactive Scroll Banner):** Cuối mỗi trang giấy xuất hiện thẻ chỉ báo `Hết Trang X - Cuộn tiếp để sinh Trang mới...` đi kèm thanh tiến trình trực quan theo lực cuộn. Người dùng có thể cuộn tiếp hoặc bấm trực tiếp vào thẻ để sinh trang ngay tức thì.
- **Bảo vệ chống gián đoạn:** Tích hợp bộ đệm chống nhảy trang kép (cooldown 500ms) và tự động khóa tính năng khi người dùng đang giữ chuột vẽ nét, di chuyển đối tượng hay sử dụng tẩy.

## [Tinh chỉnh đường song song: Thuần nét thẳng, không vẽ mũi tên] - 19/10/2026
- **Loại bỏ mũi tên:** Khi dựng hoặc vẽ đường thẳng song song mới qua một điểm, đường thẳng được vẽ dưới dạng nét thẳng thanh thoát, sạch sẽ, không còn ký hiệu mũi tên ở giữa đường thẳng nữa. Người dùng vẫn có đầy đủ 2 chấm tròn điều khiển ở 2 đầu mút để nắm kéo thu hẹp hoặc kéo dài đường song song theo ý muốn.

## [Dán ảnh (Cmd+V / Ctrl+V), Kéo to - Thu nhỏ & Nhập tệp PDF] - 19/10/2026
- **Dán ảnh siêu nhanh bằng `⌘V` / `Ctrl+V`:** Hỗ trợ dán trực tiếp ảnh chụp màn hình hoặc ảnh từ clipboard vào trang hiện tại; ảnh tự động căn chỉnh kích thước vừa vặn và đặt ở vị trí trung tâm tầm nhìn.
## [Thanh cuộn trang liên tục - Thấy cùng lúc đầu trang 2 và cuối trang 1] - 19/10/2026
- **Trải nghiệm cuộn dọc tài liệu liên tục (Continuous Document Stream):**
  - Chuyển đổi mô hình hiển thị từng trang đơn lẻ sang luồng trang dọc nối tiếp nhau (`.pages-container` với khoảng cách 36px giữa các trang).
  - Người dùng có thể cuộn tự do và dừng ở bất kỳ vị trí nào để quan sát đồng thời nửa cuối của Trang 1 và nửa đầu của Trang 2 trên cùng một màn hình (như Goodnotes, Notability).
  - Mỗi trang sở hữu thẻ góc hiển thị số trang tinh tế (`page-corner-tag`), lưới nền riêng và canvas độc lập bảo toàn nguyên vẹn tọa độ $1600 \times 1060$.
- **Vẽ và thao tác tương tác liền mạch trên từng trang:**
  - Nhấp chuột hoặc đặt bút vào trang nào sẽ tự động kích hoạt trang đó; toàn bộ công cụ Bút, Dạ quang, Tẩy 2 chế độ, Dựng hình học, Dán ảnh và Kéo co giãn ảnh hoạt động chính xác trên canvas của trang tương ứng.
  - Sử dụng cơ chế `setPointerCapture` giúp các nét vẽ hay thao tác kéo chỉnh điểm không bị đứt quãng khi con trỏ di chuyển qua lại giữa các trang.
- **Đồng bộ tab trang & cuộn điều hướng mượt mà:**
  - Khi người dùng cuộn xem tài liệu, ứng dụng tự động tính toán trang gần tâm màn hình nhất để làm nổi bật tab trang tương ứng trên thanh công cụ.
  - Bấm vào tab trang bất kỳ sẽ cuộn mượt (`scrollIntoView`) đưa trang đó vào giữa tầm nhìn.
  - Cuộn vượt qua đáy của trang cuối cùng sẽ kích hoạt thanh nạp và tự động sinh trang mới nối tiếp vào cuối tài liệu.

## [Cơ chế hiển thị trang giấy theo chiều dọc & Cột trang thu nhỏ bên trái màn hình] - 20/10/2026
- **Khổ giấy hiển thị theo chiều dọc (Portrait Mode):**
  - Mặc định áp dụng khổ giấy đứng $1100 \times 1560$ (tỷ lệ chuẩn A4 cao hơn rộng), tối ưu hóa trải nghiệm ghi chép, đọc tài liệu và viết toán học tự nhiên.
  - Tích hợp cụm nút chuyển đổi linh hoạt: **Khổ dọc** ($1100 \times 1560$) và **Khổ ngang** ($1600 \times 1060$) ngay trên thanh công cụ quản lý trang.
- **Cột danh sách trang thu nhỏ bên trái màn hình (Left Vertical Thumbnail Sidebar):**
  - Hiển thị theo chiều dọc bên trái màn hình đúng y như hình ảnh mẫu yêu cầu:
    - Số thứ tự trang (`1`, `2`...) to rõ ràng ở bên trái.
    - Thẻ giấy thu nhỏ màu trắng với canvas hiển thị trực tiếp hình ảnh nội dung vẽ thực tế của từng trang (live preview).
    - Trang đang chọn được làm nổi bật với nền xanh đậm hoàng gia (`#0b57cf`) và số trang trắng sáng; các trang khác có nền xám nhẹ dịu mắt (`#f0f2f5`).
  - Nhấp chọn trang thu nhỏ bất kỳ sẽ cuộn mượt và kích hoạt trang đó ngay lập tức.
  - Khi người dùng vẽ nét hoặc sửa đổi nội dung trên trang chính, hình ảnh xem trước ở cột bên trái tự động cập nhật ngay tức thì.
  - Tự động đồng bộ vị trí trang active ở cột bên trái khi cuộn ở vùng vẽ chính.
  - Nút bật/tắt "Trang bên trái" trên thanh công cụ giúp người dùng có thể thu gọn hoặc mở rộng cột sidebar dễ dàng, bảo đảm không có sidebar thường trực khi muốn tập trung viết toàn màn hình.

## [Tối ưu cuộn trang siêu mượt mà & Hiển thị trang nối tiếp liên tục thứ tự 1, 2...] - 20/10/2026
- **Loại bỏ triệt để hiện tượng giật/khựng khi cuộn (Ultra-smooth 60/120fps Scrolling):**
  - Xóa bỏ hoàn toàn việc chặn sự kiện chuột `e.preventDefault()` trên sự kiện `wheel`, chuyển sang cơ chế cuộn tự nhiên thụ động (`{ passive: true }`), trả lại 100% độ mượt quán tính (kinetic momentum scrolling) của bàn rê cảm ứng Mac (Trackpad) và chuột cuộn.
  - Loại bỏ việc kích hoạt `scrollIntoView({ behavior: 'smooth' })` trong khi người dùng đang cuộn; khi cuộn chỉ cập nhật trạng thái `.active` của tab và thumbnail, chống xung đột hoạt ảnh cuộn làm đứng hình hoặc giật cục.
  - Sử dụng phương thức cuộn nội bộ `canvasContainer.scrollTo({ top: offset, behavior: 'smooth' })` khi bấm chọn tab hoặc thumbnail, loại bỏ xê dịch thanh tiêu đề hay khung ngoài của ứng dụng.
- **Hiển thị trang nối tiếp liên tục thấy rõ thứ tự 1, 2...:**
  - Khởi tạo mặc định sẵn **Trang 1** và **Trang 2** nối tiếp nhau ngay từ đầu, cho phép người dùng nhìn thấy rõ ràng phần cuối của Trang 1 nối tiếp với phần đầu của Trang 2 qua khoảng đệm thanh lịch 42px.
  - Thêm **Huy hiệu tab đầu trang** (`.paper-header-badge`) gắn liền ở cạnh trên mỗi tờ giấy và **Huy hiệu mặt giấy** (`.page-top-badge`) ở góc trên bên trái, cùng với thẻ góc dưới (`.page-corner-tag`), giúp thứ tự các trang `Trang 1`, `Trang 2`, `Trang 3`... luôn hiển thị trực quan và nổi bật.
  - Cột thumbnail bên trái và thanh tab trên cùng hiển thị đầy đủ thứ tự `1`, `2`... ngay khi khởi động.
- **Tự động nối tiếp trang mới siêu mượt khi cuộn gần đến đáy:**
  - Khi cuộn đến gần cuối tài liệu (còn cách đáy dưới 260px), hệ thống tự động nối thêm Trang tiếp theo (Trang 3, Trang 4...) vào luồng giấy một cách mượt mà, không gián đoạn thao tác cuộn, mang lại cảm giác viết và đọc vô tận như một cuộn giấy dài liền mạch.

## [Gom nhóm thanh công cụ hình học theo 4 chủ đề có menu xổ xuống] - 20/10/2026
- **Gom gọn thanh hình học theo đúng cấu trúc thiết kế yêu cầu:**
  - Thay vì dàn trải 13 nút chiếm toàn bộ chiều ngang thanh công cụ, các công cụ hình học được phân loại khoa học thành 4 nhóm chủ đề chính có menu xổ xuống (Dropdown) kèm biểu tượng và mũi tên `▾`:
    1. **`[Cơ bản ▾]`**: Điểm, Đoạn thẳng, Đường tròn.
    2. **`[Tam giác ▾]`**: Tam giác, Tam giác vuông, Tam giác cân.
    3. **`[Quan hệ ▾]`**: Vuông góc, Song song, Phân giác.
    4. **`[Đường tròn ▾]`**: Nội tiếp, Tiếp tuyến, 2 tiếp tuyến.
  - **Giữ riêng công cụ Góc `[∡ Góc: 60°]`**: Bố trí sau vạch phân cách thẳng đứng `|`, bảo toàn ô nhập số đo góc chính xác.
- **Trải nghiệm tương tác mượt mà chuẩn macOS:**
  - Nhấp vào nút chủ đề để mở menu danh sách lựa chọn trực quan có icon và tên gọi tiếng Việt rõ ràng.
  - Nút chủ đề tự động đổi màu nổi bật (Active) và cập nhật icon hiển thị theo công cụ con đang được kích hoạt.
  - Tự động đóng menu khi nhấp chọn công cụ, khi nhấp ra ngoài hoặc khi nhấn phím `Escape`.
  - **Sửa lỗi hiển thị menu xổ xuống:** Khắc phục triệt để việc menu bị thanh công cụ cắt ẩn (do `overflow-x: auto`), thiết lập `overflow: visible !important`, tăng tầng lớp `z-index: 99999` và gắn lệnh điều khiển hiển thị trực tiếp (`style.display = 'flex'`), bảo đảm khi bấm vào bất kỳ nhóm nào (`Cơ bản ▾`, `Tam giác ▾`, `Quan hệ ▾`, `Đường tròn ▾`) menu đều bật ra tức thì và nổi bật trên màn hình.

## [Tinh gọn thanh quản lý trang & Thanh bên chuẩn phong cách macOS] - 20/10/2026
- **Bố cục thanh quản lý trang tinh gọn 1 dòng (Theo gợi ý hình 2 & 4):**
  - **Nút "Trang bên trái" biểu tượng `[ ◫ ]`:** Chỉ giữ biểu tượng thanh bên, thu gọn 28×28px, tooltip "Hiện/ẩn danh sách trang". Khi bật, sử dụng nền xanh nhạt `rgba(40, 99, 78, 0.12)` thay vì xanh đậm. Bổ sung vách phân cách mảnh `|` phía sau.
  - **Dropdown Hướng trang `[ 🗎 Dọc ▾ ]`:** Đổi nhãn nút thành `"Dọc ▾"` (hoặc `"Ngang ▾"`), menu có nhãn **HƯỚNG TRANG** gồm Khổ dọc A4 đứng và Khổ ngang A4.
  - **Cụm tab trang ở giữa:** Giảm nền khối bao ngoài; tab đang chọn có nền trắng, chữ đậm và viền nhẹ; **bỏ chấm xanh** chỉ báo thừa thãi theo yêu cầu. Hỗ trợ cuộn ngang dãy tab khi có nhiều trang mà không bị co nhỏ hay rớt dòng.
  - **Nút Thêm trang `[+]` liền sau tab cuối:** Đặt nút `+` nhỏ gọn ngay sau tab cuối cùng, bỏ nút "+ Thêm trang" lớn ở góc phải và nút "+ Thêm" trong thanh bên để loại bỏ trùng lặp.
  - **Menu `[...]` bên phải thanh trang:** Bổ sung menu thao tác trang hiện tại gồm: **Đổi tên trang...**, **Nhân bản trang** và **Xóa trang** (chữ đỏ, có xác nhận và ngăn cách riêng).
- **Làm gọn thanh bên (Thumbnail Sidebar - Theo gợi ý hình 3):**
  - Phần đầu thanh bên gói gọn trong 1 dòng: `TRANG · X    [«]` với số lượng trang tự động cập nhật và nút `[«]` thu gọn thanh bên để mở rộng diện tích vẽ.
  - Thẻ ảnh thu nhỏ hiển thị đúng tỷ lệ khổ giấy ($1100 \times 1560$ hoặc $1600 \times 1060$), có viền xanh lá bo quanh khi trang đang được chọn.
  - Nút menu `···` nhỏ bên cạnh tên trang chỉ hiện ra khi rê chuột (hover) hoặc khi trang đang kích hoạt.
- **Đồng nhất giao diện & Giảm tương phản lưới:**
  - Giảm độ tương phản lưới giấy ô vuông (`rgba(36, 60, 54, 0.05)`) để nét viết và hình vẽ trở thành trọng tâm.
  - Đồng bộ chiều cao thanh quản lý trang 38px, viền mảnh nhẹ nhàng chuẩn phong cách macOS cao cấp.
