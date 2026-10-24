# Nét — Hồ sơ dự án và hướng dẫn xây app Mac với Antigravity

**Ngày lập:** 19/10/2026 · **Phiên bản tài liệu:** 1.0 · **Tên tệp đề xuất:** `NET_PROJECT.md`

**Mục đích:** giữ ngữ cảnh để có thể tiếp tục dự án ở cuộc trò chuyện khác, giao việc cho Antigravity và phát triển ứng dụng macOS mà không phải thiết kế lại từ đầu.

**Trạng thái:** đã có bản mẫu giao diện HTML/CSS/JavaScript; chưa có ứng dụng macOS được biên dịch và kiểm thử. Tài liệu này là hồ sơ và kế hoạch, không phải mã nguồn ứng dụng hoặc bằng chứng các hạng mục đã hoàn thành.

## 1. Ghi nhớ dự án và các quyết định đã thống nhất

Nét là ứng dụng viết tay, chú thích tài liệu và dựng hình học trên Mac, lấy nhu cầu sử dụng Scrble Ink làm tham khảo. Mục tiêu là tạo trải nghiệm riêng phù hợp người dùng, không sao chép thương hiệu hoặc tài sản của phần mềm khác.

| Nội dung | Đã biết / đã thống nhất |
|---|---|
| Người dùng | Chưa có kinh nghiệm lập trình; cần hướng dẫn từng thao tác và câu lệnh có thể sao chép |
| Máy | MacBook Air M5, theo thông tin người dùng cung cấp |
| Thiết bị viết | Bảng vẽ hoặc màn hình bút Wacom / Huion / XP-Pen; chưa biết model cụ thể |
| Ngôn ngữ giao diện | Tiếng Việt |
| Bố cục | Tối ưu vùng viết ngang; nút và lựa chọn công cụ nằm phía trên |
| Phạm vi cuối cùng | Viết/vẽ, tự cuộn, nền giấy, PDF/ảnh, hình học, nhận dạng hình và chữ viết tay, xuất tài liệu |
| Công cụ phát triển mong muốn | Google Antigravity hỗ trợ viết và sửa mã; Xcode xây dựng và chạy ứng dụng Mac |
| Hướng kỹ thuật đề xuất | Swift + WKWebView để tái sử dụng giao diện web; cần kiểm chứng nét bút trước khi chốt lâu dài |
| Dữ liệu | Ưu tiên lưu cục bộ và hoạt động ngoại tuyến; tính năng trực tuyến cần cơ chế đồng ý riêng |
| Mở rộng | Chia mô-đun, có phiên bản định dạng tệp và kiểm thử để thêm chức năng mà không làm hỏng bài cũ |

**Thông tin còn thiếu:** phiên bản macOS, tình trạng cài Xcode, hãng/model bảng vẽ, phiên bản driver, nhu cầu phân phối chỉ cho cá nhân hay cho người khác. Chưa được coi các thông tin này là đã xác nhận.

## 2. Lưu lại giao diện hiện tại

Phần này lưu thiết kế và cách tương tác của mẫu “Nét — Bảng viết cho Mac”. Để giữ nguyên cả giao diện chạy được, cần lưu thêm mã HTML gốc; mô tả Markdown không thay thế mã nguồn đó.

### 2.1. Cấu trúc màn hình

Thứ tự từ trên xuống:

1. **Thanh tiêu đề:** logo chữ `nét.`, phong cách cửa sổ macOS, thông điệp “Một khoảng trống cho mọi ý tưởng”. Dòng “BẢN MẪU TƯƠNG TÁC” chỉ dùng ở bản mẫu.
2. **Thanh thư viện ngang:** ghi chú mới, đang viết, tất cả ghi chú, nhập tài liệu và danh sách ghi chú đang mở.
3. **Thanh tài liệu:** tên ghi chú có thể sửa; trạng thái lưu; số trang; thông tin giấy; thu/phóng; vừa ngang; thiết lập trang; nhập; xuất.
4. **Thanh công cụ viết:** bút, đánh dấu, tẩy, chữ; bảng màu; màu tùy chọn; độ dày; nét liền/nét đứt; hình học; thước; nhận dạng; hoàn tác/làm lại.
5. **Thanh hình học:** đường thẳng, đường tròn, góc theo số đo, tam giác, tam giác vuông, tam giác cân, nội tiếp, tiếp tuyến và thêm hình.
6. **Thanh trang ngang:** nút trang 1, trang 2… và nút thêm trang.
7. **Vùng giấy:** chiếm toàn bộ phần còn lại theo chiều ngang, không có cột bên trái hoặc bên phải thường trực.
8. **Thanh trạng thái dưới:** công cụ đang chọn, hướng dẫn ngắn và phím tắt. Không đặt thêm nhóm điều khiển chính tại đây.

**Nguyên tắc giữ nguyên:** mọi điều khiển chính ở phía trên; thiết lập mở dưới dạng bảng nổi hoặc hộp thoại, không chiếm cố định bề ngang giấy. Khi cửa sổ hẹp, thanh công cụ có thể cuộn ngang hoặc đưa công cụ phụ vào menu, tránh tăng quá nhiều hàng làm mất chiều cao viết.

### 2.2. Phong cách và thông số tham chiếu

| Thành phần | Thông số trong mẫu |
|---|---|
| Font | Font hệ thống macOS, ưu tiên `-apple-system`, sau đó BlinkMacSystemFont / Segoe UI / sans-serif |
| Màu chữ chính | `#243c36` |
| Màu hành động chính | `#28634e` |
| Màu đường phân cách | `#e2e6df` |
| Nền ứng dụng | Xám xanh nhạt; vùng làm việc `#e9ece5` |
| Màu giấy sáng | `#fffef9` |
| Màu bảng đen | `#293e35` |
| Mực mặc định | `#30493c` |
| Bảng màu nhanh | `#30493c`, `#537fc1`, `#cf7969`, `#b6a24c` |
| Trang tham chiếu | Hệ tọa độ 1600 × 1060, tỷ lệ ngang; đây không phải kích thước giấy in vật lý |
| Nền ô vuông | Bước lưới 24 đơn vị trong hệ tọa độ trang |
| Nền kẻ dòng | Bước dòng 32 đơn vị |
| Độ dày bút mẫu | 1; 2,5; 5; 10 đơn vị trang |
| Kiểu nét đứt mẫu | Mẫu dash 10 / khoảng trống 7 đơn vị |
| Thu/phóng mẫu | 60–180%, có nút vừa ngang |
| Phím tắt đã có | B: bút; E: tẩy; T: chữ; ⌘Z: hoàn tác; ⌘⇧Z: làm lại |

Khi chuyển sang ứng dụng thật, dùng thanh tiêu đề và nút cửa sổ macOS thật thay cho ba chấm trang trí trong HTML. Không làm xuất hiện hai bộ nút đóng/thu nhỏ/phóng to.

### 2.3. Tương tác hình học cần giữ

- **Đường thẳng:** kéo từ điểm đầu đến điểm cuối; chọn nét liền hoặc nét đứt.
- **Đường tròn:** kéo từ tâm ra để xác định bán kính.
- **Góc cho trước:** nhập số đo, chọn chiều mở; kéo từ đỉnh O để xác định hướng và chiều dài cạnh đầu. Cạnh còn lại và cung góc được dựng tự động.
- **Số đo góc mẫu:** từ 0,1° đến 359,9°, mặc định 60°. Phải kiểm tra cả góc phản lớn hơn 180°.
- **Tam giác thường:** mẫu hiện tại tạo hình theo khung kéo với vị trí đỉnh dựng sẵn; chưa phải thao tác chọn ba đỉnh tùy ý.
- **Tam giác vuông:** có ký hiệu góc vuông.
- **Tam giác cân/đều:** có dấu đánh dấu cạnh bằng nhau.
- **Tam giác nội tiếp:** tạo đồng thời đường tròn và ba đỉnh trên đường tròn.
- **Tiếp tuyến:** kéo từ tâm O đến tiếp điểm T; dựng đường tròn mới, đường tiếp tuyến, bán kính OT và dấu vuông góc tại T.
- **Công cụ phụ:** mũi tên, elip, chữ nhật, thước kẻ và thước đo góc.

### 2.4. Cách lưu bản gốc để giao cho Antigravity

1. Tạo thư mục dự án `NetMac` trên Mac.
2. Lưu tài liệu này thành `NET_PROJECT.md` bằng trình soạn thảo văn bản thuần. Nếu dùng TextEdit, chuyển sang văn bản thuần trước khi lưu để tránh tệp RTF.
3. Tạo thư mục con `reference`.
4. Sao chép **toàn bộ mã HTML của canvas giao diện hiện tại**, từ `<!DOCTYPE html>` đến `</html>`, lưu thành `reference/net-prototype.html`.
5. Chụp màn hình toàn giao diện và các hộp thoại quan trọng, lưu vào `reference/screenshots`.
6. Mở `reference/net-prototype.html` trong trình duyệt để kiểm tra bản sao còn hoạt động.
7. Đưa cả thư mục vào workspace Antigravity. Agent trong Antigravity không tự nhìn thấy cuộc trò chuyện hoặc canvas này.

**Giới hạn của bản lưu này:** tài liệu Markdown lưu yêu cầu, thiết kế và kế hoạch; không nhúng toàn bộ mã HTML hiện tại. Chưa được coi đã sao lưu giao diện chạy được cho đến khi tệp `reference/net-prototype.html` thực sự tồn tại và mở được. Nếu chưa lấy được mã, yêu cầu trích xuất mã nguồn ở bước tiếp theo; không yêu cầu Antigravity tự đoán rồi gọi đó là bản gốc.

## 3. Hiện trạng thật của bản mẫu

Phân biệt rõ “có thao tác thử” với “đã hoàn thiện để sử dụng”. Đây là điểm xuất phát cho kế hoạch phát triển.

| Chức năng | Hiện trạng dựa trên mã mẫu | Việc cần làm |
|---|---|---|
| Bút và đánh dấu | Vẽ bằng Pointer Events, xuất nét SVG | Làm mượt, lưu mẫu lực nhấn theo điểm, kiểm tra độ trễ |
| Lực nhấn | Độ rộng toàn nét thay đổi theo sự kiện hiện tại; chưa là biến thiên độ rộng dọc nét | Bộ dựng nét có độ rộng biến thiên và kiểm thử trên bảng vẽ |
| Tẩy | Xóa toàn phần tử; không kéo tẩy liên tục; không có lịch sử hoàn tác thao tác xóa đúng nghĩa | Command undo/redo và tẩy ổn định |
| Hoàn tác | Chủ yếu thêm/bớt phần tử cuối | Hỗ trợ xóa, di chuyển, sửa hình, nền, trang và giao dịch phức hợp |
| Hình học | Có các mô hình nêu trên | Thêm chọn, kéo, xoay, sửa tham số và ràng buộc |
| Nhận dạng hình | Heuristic đơn giản cho đường thẳng và nét gần tròn | Đo sai số, cho xem trước và cho hoàn tác |
| Nhận dạng chữ | Hộp thoại chèn văn bản ví dụ | Tích hợp OCR thật; kiểm chứng tiếng Việt |
| PDF | Xem thử qua object của trình duyệt | Nhập nhiều trang, chú thích và xuất PDF thật |
| Ảnh | Nhập PNG/JPG/WebP và thêm vào trang | Quản lý ảnh như asset, chọn/kéo/co giãn |
| Trang | Nhiều trang cố định | Lưu ổn định; quyết định cơ chế tự cuộn/trang nối tiếp |
| Tự cuộn | Cuộn vùng nhìn gần mép dưới | Chưa tự tạo giấy liên tục; phải xử lý tọa độ khi viewport đổi |
| Lưu dữ liệu | Trong bộ nhớ phiên; xuất/mở JSON thủ công | Tự lưu, mở tệp gốc, khôi phục và sao lưu |
| Xuất ảnh | PNG/SVG trang hiện tại | Kiểm thử chất lượng, lỗi asset và kích thước lớn |
| Xuất PDF | Gọi hộp thoại in, chủ yếu trang hiện tại | Xuất tài liệu nhiều trang qua quy trình chuyên dụng |
| Thước | Lớp minh họa cố định | Bắt nét, kéo/xoay và thước đo góc thực sự nếu cần |

**Rủi ro cần xử lý:** vẽ nét hiện tại tạo lại đường SVG trong lúc kéo; hiệu năng phải đo với nhiều nét. Dữ liệu `els` đang là chuỗi SVG, chưa phù hợp làm mô hình chỉnh sửa lâu dài. Chức năng tự cuộn và thay đổi tài liệu khi bút đang kéo cần quy tắc rõ ràng để tránh ghi nhầm trang hoặc lệch nét.

## 4. Kiến trúc đề xuất để phát triển và mở rộng

Dùng Swift cho ứng dụng Mac và WKWebView cho giao diện hiện tại là phương án khởi đầu, chưa phải cam kết không thể thay đổi. Chỉ quyết định phần nhập bút lâu dài sau khi thử trên thiết bị thật.

### 4.1. Phân tách trách nhiệm

| Lớp | Trách nhiệm | Không nên làm |
|---|---|---|
| App macOS | Cửa sổ, menu, mở/lưu, vòng đời ứng dụng, quyền truy cập tệp | Chứa toàn bộ thuật toán hình học |
| Giao diện web | Thanh công cụ, hộp thoại, hiển thị tài liệu | Truy cập tùy ý hệ thống tệp |
| Document Core | Mô hình trang/đối tượng, lệnh chỉnh sửa, lịch sử | Phụ thuộc trực tiếp các nút giao diện |
| Renderer | Vẽ nét, hình, ảnh và trạng thái chọn | Dùng DOM làm nguồn dữ liệu duy nhất |
| Geometry | Dựng hình, đo đạc, ràng buộc và kiểm tra sai số | Mỗi nút tự viết một công thức trùng lặp |
| Storage | Đọc/ghi, tự lưu, backup và migration | Ghi đè bài cũ trước khi xác thực |
| PDF/OCR adapters | Tích hợp xử lý tài liệu/nhận dạng | Buộc toàn bộ ứng dụng phụ thuộc một nhà cung cấp |
| Input adapter | Chuẩn hóa chuột, bút, lực nhấn, nút phụ | Mặc định mọi driver cho cùng dữ liệu |

Giữ renderer thay thế được: khởi đầu bằng SVG để tái sử dụng mẫu; nếu benchmark không đạt, có thể thay phần render hoặc nhận bút mà không viết lại toàn bộ giao diện và định dạng tài liệu.

### 4.2. Cấu trúc thư mục dự kiến

Đây là cấu trúc đề xuất để Antigravity tạo, chưa phải các tệp đã có.

```text
NetMac/
  NET_PROJECT.md
  AGENTS.md
  CHANGELOG.md
  reference/
    net-prototype.html
    screenshots/
  docs/
    STATUS.md
    REQUIREMENTS.md
    ARCHITECTURE.md
    DATA_FORMAT.md
    TEST_PLAN.md
    decisions/
    features/
  macOS/
    NetMac.xcodeproj
    NetMac/
      App/
      WebBridge/
      FileServices/
      PDFServices/
      Resources/Web/
  web/
    src/
      ui/
      core/
      input/
      renderer/
      tools/
      geometry/
      services/
    tests/
  fixtures/
    legacy-notes/
    sample-documents/
  scripts/
```

Bản HTML trong `reference` là mốc tham chiếu, không sửa trực tiếp khi phát triển. Mã ứng dụng nằm trong `web` và `macOS`; tài nguyên web cần được đóng gói vào app, không phụ thuộc máy chủ phát triển khi sử dụng.

### 4.3. Mô hình tài liệu

- `Document`: định dạng, phiên bản schema, tiêu đề, danh sách trang, assets và metadata.
- `Page`: kích thước, nền, thứ tự các đối tượng và các lớp nếu có.
- `Object`: ID ổn định, loại, kiểu nét, tọa độ hoặc transform, dữ liệu đặc thù.
- `Stroke`: danh sách điểm `{x, y, pressure, time}` và kiểu bút. Dữ liệu gốc được giữ để có thể dựng lại nét.
- `GeometryObject`: tham số toán học, nhãn và tham chiếu đến các đối tượng khác nếu có ràng buộc.
- `Asset`: ảnh hoặc PDF nguồn, liên kết bằng mã tài sản; không bắt buộc nhúng base64 vào từng đối tượng.
- `Command`: lệnh thêm/xóa/sửa/di chuyển với khả năng undo/redo.

**Quy tắc quan trọng:** đơn vị tài liệu độc lập pixel màn hình; zoom không làm đổi tọa độ hình. Số đo góc lưu bằng số, không đọc ngược từ nhãn hiển thị.

### 4.4. Hình học có thể chỉnh sửa

Ví dụ, góc phải lưu đỉnh, hướng cạnh đầu, độ dài, số đo và chiều mở. Khi người dùng đổi 60° thành 75°, cập nhật hai cạnh, cung và nhãn cùng lúc.

Tiếp tuyến gắn với đường tròn bằng ID và tham số tiếp điểm; khi tâm/bán kính thay đổi, tính lại tiếp tuyến và dấu vuông góc. Tam giác nội tiếp lưu các đỉnh bằng vị trí trên đường tròn; không cho kéo đỉnh rời đường tròn nếu đang bật ràng buộc.

Bản đầu có thể hỗ trợ các mẫu độc lập trước. Ràng buộc giữa nhiều đối tượng triển khai sau qua mô-đun riêng; không cần xây một hệ hình học động đầy đủ ngay lập tức.

## 5. Chuẩn bị Antigravity và môi trường Mac

Antigravity hỗ trợ tạo/sửa mã và chạy kiểm thử trong workspace được cho phép; không thay thế việc kiểm tra thực tế trên Mac. Các tên menu có thể thay đổi theo phiên bản, vì vậy kiểm tra tài liệu chính thức nếu giao diện khác hướng dẫn.

### 5.1. Cài và kiểm tra

1. Tải Google Antigravity từ mục tải xuống trong trang tài liệu chính thức ở cuối tài liệu. Chọn bản Apple Silicon cho máy được mô tả ở mục 1.
2. Mở tệp cài và đưa ứng dụng vào Applications theo hướng dẫn của nhà cung cấp; đăng nhập khi được yêu cầu.
3. Cài Xcode từ Mac App Store, mở một lần để hoàn tất thiết lập. Dùng phiên bản ổn định tương thích macOS; không cần cài beta chỉ để làm dự án này.
4. Tạo thư mục `NetMac`, đưa hồ sơ và mã mẫu vào như mục 2.4.
5. Mở thư mục đó thành project/workspace trong Antigravity. Chỉ cấp quyền cho thư mục dự án cần dùng.
6. Yêu cầu agent kiểm tra môi trường trước khi cài công cụ bổ sung. Chỉ thêm Node.js hoặc bộ công cụ web nếu kiến trúc và quy trình test đã chọn cần chúng.

Nếu cần kiểm tra từ Terminal, đây là các lệnh chỉ đọc thông tin cơ bản:

```sh
sw_vers
uname -m
xcodebuild -version
xcode-select -p
git --version
```

Nếu lệnh báo lỗi, gửi nguyên thông báo cho agent và yêu cầu giải thích trước khi sửa. Không tự xóa thư mục hệ thống, không tắt Gatekeeper/SIP, không nhập mật khẩu quản trị vào cửa sổ chat.

### 5.2. Quyền và an toàn khi dùng agent

- Chọn chế độ cần duyệt thay đổi/lệnh nếu phiên bản đang dùng cung cấp lựa chọn này.
- Cho phép đọc/sửa trong workspace; yêu cầu xác nhận trước lệnh xóa, cài công cụ, truy cập ngoài dự án, đưa mã lên mạng hoặc phát hành.
- Không đưa khóa API, mật khẩu, bản scan nhạy cảm vào prompt. Dùng dữ liệu mẫu khi kiểm thử.
- Không cho agent commit bí mật hoặc tự tạo repository công khai.
- Dùng Git cục bộ để lưu mốc. Git không đồng nghĩa đã có bản sao ngoài máy; sao lưu riêng theo lựa chọn của chủ dự án.

### 5.3. Tệp ghi nhớ cho agent

Đặt `AGENTS.md` ở gốc workspace để chứa quy tắc ngắn. Theo tài liệu Antigravity đã tra cứu, đây là một vị trí hỗ trợ quy tắc dự án; không nhồi toàn bộ hồ sơ dài vào tệp này.

Nội dung khởi đầu đề xuất:

```markdown
# Quy tắc dự án Nét

- Trước khi làm việc, đọc NET_PROJECT.md và docs/STATUS.md nếu có.
- Người dùng chưa biết lập trình: giải thích bằng tiếng Việt, từng bước.
- Giữ giao diện tham chiếu; công cụ ở trên, vùng viết ngang không có sidebar thường trực.
- Không sửa reference/net-prototype.html; dùng làm mốc đối chiếu.
- Mỗi lần chỉ làm một hạng mục có tiêu chí nghiệm thu.
- Dữ liệu cục bộ trước; không tải tài liệu người dùng lên mạng nếu chưa được đồng ý.
- Logic tài liệu/hình học độc lập giao diện và renderer.
- Mọi thay đổi dữ liệu cần cân nhắc schema, migration và tương thích tệp cũ.
- Thêm kiểm thử cho hành vi mới; kiểm thử hồi quy chức năng cũ.
- Không gọi OCR giả là OCR thật; không tuyên bố kiểm thử bảng vẽ nếu chưa thử thiết bị.
- Không xóa dữ liệu, cài công cụ, phát hành hoặc push mã nếu chưa được duyệt.
- Kết thúc bằng: tệp đổi, test đã chạy, test chưa chạy, hạn chế, bước tiếp theo.
- Cập nhật docs/STATUS.md và CHANGELOG.md khi kết thúc hạng mục.
```

## 6. Các bước phát triển chi tiết bằng Antigravity

Làm theo thứ tự dưới đây và chỉ chuyển giai đoạn khi đã nghiệm thu. Mỗi prompt là một lần giao việc, không phải yêu cầu làm tất cả trong một lượt.

### Giai đoạn 0 — Kiểm kê và chốt kế hoạch

**Bạn làm:** mở workspace, cung cấp hồ sơ, HTML gốc và ảnh màn hình. Cho biết bảng vẽ cụ thể nếu đã có.

**Gửi Antigravity:**

> Đọc NET_PROJECT.md, kiểm tra reference/net-prototype.html và môi trường Mac. Chưa sửa mã. Lập kế hoạch Swift + WKWebView, nêu những điểm chưa biết và tạo checklist theo giai đoạn. Nếu không thấy HTML tham chiếu, dừng và báo thiếu; không tự dựng lại rồi gọi là giao diện gốc. Phân biệt việc có thể test tự động với việc cần tôi thao tác thiết bị.

**Đầu ra:** danh sách tệp đầu vào, môi trường, kế hoạch, rủi ro và các tài liệu khởi tạo trong `docs` sau khi được duyệt.

**Nghiệm thu:** agent không nhận nhầm chức năng mô phỏng thành đã hoàn thiện; ghi rõ chưa biết model bảng vẽ và macOS nếu còn thiếu.

### Giai đoạn 1 — Giữ nguyên mẫu và tạo ứng dụng mở được

**Gửi Antigravity:**

> Tạo dự án macOS tối thiểu bằng Swift và WKWebView hiển thị tài nguyên web cục bộ từ giao diện tham chiếu. Giữ bố cục thanh công cụ phía trên, vùng viết ngang, màu sắc và tiếng Việt. Dùng nút cửa sổ Mac thật. Chưa thêm OCR/PDF thật. Hướng dẫn tôi mở dự án trong Xcode và chạy; nêu rõ nếu môi trường chưa build được.

**Công việc kỹ thuật:** đóng gói HTML/CSS/JS trong app; xử lý resize; chặn điều hướng web ngoài dự kiến; thêm thông báo lỗi nếu tài nguyên không tải.

**Bạn kiểm tra:** mở app từ Xcode, viết thử, đổi công cụ, tạo trang, đóng/mở cửa sổ, thay kích thước và vào toàn màn hình.

**Nghiệm thu:** mở và dùng phần viết cơ bản không cần mạng; không có hai bộ nút cửa sổ; không có cột công cụ cố định chiếm vùng viết.

### Giai đoạn 2 — Thử bảng vẽ, quyết định đường nhập bút

**Gửi Antigravity:**

> Tạo bảng chẩn đoán đầu vào: loại con trỏ, tọa độ, lực nhấn, trạng thái nút, tần suất sự kiện và sự kiện hủy. Không thu dữ liệu ra ngoài máy. Hướng dẫn tôi thử với bảng vẽ thật. Sửa xử lý kết thúc nét và cuộn khi đang viết. Chưa tuyên bố hỗ trợ lực nhấn chỉ vì chuột vẽ được.

**Bạn kiểm tra:** nét chậm/nhanh, lực nhẹ/mạnh, nét dài, nhấc bút, chuyển cửa sổ, cuộn, zoom, nút phụ và đầu tẩy nếu thiết bị có.

**Cổng quyết định:** nếu WKWebView không cung cấp dữ liệu cần thiết hoặc không đạt trải nghiệm sau tối ưu, tạo nhánh thử nghiệm nhận bút bằng AppKit rồi so sánh. Không viết lại toàn dự án trước khi đo nguyên nhân.

**Nghiệm thu:** có báo cáo đúng tên thiết bị và driver; không xuất hiện nét bị kẹt; biết rõ tính năng nào hỗ trợ hoặc chưa hỗ trợ. Trải nghiệm “mượt” cần người dùng xác nhận, không chỉ dựa trên log.

### Giai đoạn 3 — Tách mô hình tài liệu và lịch sử thao tác

**Gửi Antigravity:**

> Tách Document Core, renderer và tools; chuyển từ chuỗi SVG là dữ liệu chính sang đối tượng có kiểu. Tạo command undo/redo cho thêm, xóa, sửa, di chuyển. Giữ khả năng nhập net-prototype-v1 theo chiến lược migration an toàn. Viết test tọa độ sau zoom và lịch sử thao tác. Giữ bản tham chiếu nguyên vẹn.

**Công việc:** chuẩn hóa ID; lưu điểm bút; chọn/kéo đối tượng; xử lý thao tác đang dở khi đổi trang; giữ dữ liệu SVG cũ dưới dạng lớp legacy có kiểm soát nếu chưa chuyển đổi được.

**Nghiệm thu:** xóa rồi ⌘Z khôi phục đúng vị trí; sửa hình rồi hoàn tác đúng tham số; đổi zoom không đổi kích thước logic; tệp cũ mở được hoặc có cảnh báo rõ không mất dữ liệu.

### Giai đoạn 4 — Lưu, tự lưu và khôi phục

**Gửi Antigravity:**

> Thiết kế định dạng ghi chú có schemaVersion, assets riêng và migration. Thực hiện New/Open/Save/Save As bằng hộp thoại Mac, tự lưu bản khôi phục cục bộ, ghi nguyên tử và backup. Không dùng bộ nhớ phiên hoặc localStorage làm nơi lưu chính duy nhất. Viết test tệp hỏng, thiếu asset, hết quyền ghi và phiên bản mới hơn.

**Yêu cầu:** lựa chọn định dạng gói hoặc tệp có tài liệu mô tả; trạng thái đang lưu/lưu xong/lỗi lưu là thật; bản khôi phục không ghi đè âm thầm bản người dùng đã lưu.

**Bạn kiểm tra:** lưu bài nhiều trang, đóng/mở app, sửa tiếp, Save As; mô phỏng ứng dụng bị đóng bất ngờ trên dữ liệu thử rồi kiểm tra phục hồi.

**Nghiệm thu:** không báo “đã lưu” trước khi ghi thành công; lỗi ghi có thông báo và giữ bản làm việc; tệp không hợp lệ không làm hỏng tài liệu đang mở.

### Giai đoạn 5 — Hoàn thiện viết, trang và hình học

**Gửi Antigravity theo từng nhóm, không gộp:**

> Hoàn thiện nét bút có lực nhấn theo điểm, làm mượt và tẩy; giữ dữ liệu nét gốc. Benchmark bài nhiều nét. Không thay renderer nếu chưa có số đo chứng minh cần thay.

> Hoàn thiện công cụ chọn/di chuyển/đổi kích thước/đổi màu và nét liền-nét đứt. Thêm thanh thuộc tính phía trên cho đối tượng đang chọn; không tạo sidebar thường trực.

> Hoàn thiện góc nhập số đo, tam giác vuông/cân/đều, nội tiếp và tiếp tuyến trên đường tròn đã có. Tách công thức hình học, thêm kiểm thử ràng buộc và sai số số học. Giữ mô hình cũ tương thích.

**Tự cuộn:** chọn mặc định bản đầu là cuộn vùng nhìn trong trang; khi hết trang, cung cấp thao tác tiếp trang rõ ràng. Giấy vô hạn hoặc tự nối trang là tính năng riêng, không đổi ngầm hành vi.

**Nghiệm thu hình học:** tam giác vuông có tích vô hướng hai cạnh kề xấp xỉ 0; cạnh bằng nhau đạt dung sai định trước; các đỉnh nội tiếp cách tâm bằng bán kính; tiếp tuyến vuông góc bán kính; nhập lại góc cập nhật hình và nhãn.

### Giai đoạn 6 — PDF, ảnh và xuất tài liệu

**Gửi Antigravity:**

> Lập phương án dùng PDFKit phía Mac cho nhập/xuất PDF và lớp chú thích có tọa độ thống nhất với tài liệu. Nếu chọn giải pháp khác, giải thích đánh đổi và giấy phép. Nhập PDF nhiều trang, giữ đúng tỷ lệ/xoay trang, viết lên từng trang, xuất tất cả trang có chú thích. Không dùng window.print làm đường xuất PDF duy nhất.

**Công việc:** quản lý asset; xử lý PDF khóa hoặc lỗi; mapping tọa độ PDF↔trang↔màn hình; tùy chọn xuất bản phẳng để dễ xem và giữ tệp gốc có thể chỉnh sửa.

**Bạn kiểm tra:** PDF dọc/ngang, nhiều kích thước, trang xoay, tiếng Việt, ảnh lớn; mở PDF xuất bằng một ứng dụng đọc khác.

**Nghiệm thu:** không mất trang hoặc lệch chú thích; xuất ảnh/PDF không chứa tay nắm chọn, thước minh họa hay thanh công cụ trừ khi người dùng chủ động yêu cầu.

### Giai đoạn 7 — Nhận dạng hình và chữ viết tay thật

**Gửi Antigravity:**

> Thiết kế RecognitionProvider thay thế được. Trước tiên kiểm tra khả năng nhận dạng cục bộ và ngôn ngữ trên macOS mục tiêu; lập thử nghiệm chữ viết tay tiếng Việt bằng dữ liệu mẫu được phép dùng. Không hứa hỗ trợ chỉ vì có API OCR. Nếu cần dịch vụ ngoài máy, trình bày dữ liệu gửi đi, chi phí và cơ chế đồng ý trước khi tích hợp.

**Luồng mong muốn:** chọn vùng/nét → chọn ngôn ngữ → chạy nhận dạng → xem/sửa kết quả → chèn hoặc thay thế → có thể hoàn tác. Nếu không khả dụng, vô hiệu hóa và giải thích, không đưa văn bản ví dụ thay kết quả.

**Phân biệt:** nhận dạng chữ viết tay, chữ in trong ảnh và công thức toán là ba bài toán khác nhau. Nhận dạng công thức toán chưa được coi là yêu cầu đã hoàn thành bằng OCR văn bản.

**Nghiệm thu:** ghi lại tập thử và lỗi thực tế, đặc biệt dấu tiếng Việt; mất mạng không làm mất bài; nhận dạng hình không tự phá nét gốc mà không thể hoàn tác.

### Giai đoạn 8 — Kiểm thử, đóng gói và sử dụng

**Gửi Antigravity:**

> Chạy checklist hồi quy, đo hiệu năng trên tài liệu mẫu, kiểm tra quyền tệp và xuất bản build Release cho Apple Silicon. Hướng dẫn tôi mở ứng dụng ngoài Xcode. Phân biệt build dùng cá nhân với bản phân phối cho người khác; đề xuất quy trình ký và notarization theo yêu cầu Apple tại thời điểm phát hành. Không tự phát hành hoặc tải ứng dụng lên hệ thống bên ngoài.

**Nghiệm thu:** app mở từ Finder, tải được tài nguyên cục bộ, lưu/mở được sau khi khởi động lại; báo cáo rõ build đã chạy trên máy nào và những test còn thiếu. Không tắt cơ chế bảo mật Mac để che lỗi đóng gói.

## 7. Checklist kiểm thử tối thiểu

Kiểm thử tự động bảo vệ logic; kiểm thử thủ công bảo vệ trải nghiệm bút và hành vi macOS. Mỗi kết quả cần ghi “đạt / lỗi / chưa thử”, không mặc định đạt.

| Nhóm | Tình huống bắt buộc |
|---|---|
| Bút | Nét chậm/nhanh, lực nhẹ/mạnh, kéo ra ngoài giấy, mất focus, pointer cancel |
| Tọa độ | Zoom 60/100/180%, resize cửa sổ, cuộn khi viết, màn hình khác tỷ lệ nếu có |
| Hình học | Góc 0,1/60/90/180/270/359,9°, hai chiều mở, kéo rất ngắn, số nhập không hợp lệ |
| Undo/redo | Thêm, xóa, sửa số đo, kéo hình, thao tác nhóm, đổi trang theo phạm vi lịch sử đã quy định |
| Lưu | Bài nhiều trang, ảnh/PDF, tệp hỏng, quyền ghi bị từ chối, khôi phục sau lỗi |
| Tương thích | JSON mẫu cũ, schema hiện tại, schema mới hơn chưa hỗ trợ, thiếu asset |
| PDF/ảnh | Trang xoay, khổ hỗn hợp, nhãn tiếng Việt, xuất toàn bộ trang, mở bằng trình đọc khác |
| Hiệu năng | Bộ mẫu 100 / 1.000 / 5.000 nét; ghi kích thước tệp, thời gian mở/lưu và độ phản hồi trên máy thử |
| Bảo mật | Tệp nhập không thực thi script; thông điệp bridge sai bị từ chối; không tự gửi tài liệu ra ngoài |

Mức số nét trên là bộ dữ liệu thử đề xuất, không phải cam kết hiệu năng đã đạt. Chỉ đặt chỉ tiêu độ trễ và thời gian mở/lưu sau khi có đường cơ sở đo được.

## 8. Cách bổ sung tính năng sau này

Có thể thêm tính năng nếu kiến trúc và dữ liệu được thiết kế như trên. Không thể bảo đảm mọi tính năng tương lai đều thêm được mà không sửa phần lõi, nhưng có thể giới hạn tác động và tránh viết lại toàn ứng dụng.

### 8.1. Quy trình thêm một tính năng

1. Viết mô tả ngắn trong `docs/features`: ai dùng, thao tác, đầu vào, đầu ra và điều không làm.
2. Kiểm tra ảnh hưởng đến dữ liệu, lệnh undo/redo, xuất tệp, quyền riêng tư và giao diện.
3. Tạo nhánh Git hoặc mốc sao lưu trước khi sửa.
4. Thêm loại công cụ và mô-đun riêng; đăng ký vào hệ thống công cụ thay vì chèn logic rải khắp giao diện.
5. Nếu thay dữ liệu, thêm migration và fixture tệp cũ; không chỉ tăng số phiên bản.
6. Viết test cho tính năng và chạy lại checklist liên quan.
7. Cho người dùng thử với tài liệu mẫu trước, không thử lần đầu trên ghi chú quan trọng duy nhất.
8. Cập nhật tài liệu, trạng thái và changelog sau khi nghiệm thu.

### 8.2. Ví dụ mở rộng

| Tính năng sau này | Mô-đun chủ yếu | Lưu ý |
|---|---|---|
| Đồ thị hàm số | Geometry + renderer | Giới hạn miền hiển thị, độ lấy mẫu và đầu vào biểu thức an toàn |
| Trung trực/phân giác | Geometry constraints | Cập nhật khi điểm nguồn thay đổi |
| Nhận dạng công thức toán | Recognition adapter | Cần đánh giá riêng, không đồng nhất OCR chữ |
| Lớp vẽ | Document Core + UI | Tác động thứ tự render, chọn, khóa và xuất |
| Thư viện hình mẫu | Tools + storage | Chèn bản sao độc lập hoặc đối tượng tham chiếu có quy tắc |
| Đồng bộ nhiều máy | Storage + conflict handling | Không thay lưu cục bộ; xử lý xung đột và quyền riêng tư |
| Bản Windows | App shell + platform adapters | Giao diện/core có thể tái sử dụng; Swift shell phải thay |

### 8.3. Prompt chuẩn khi thêm tính năng

> Đọc AGENTS.md, NET_PROJECT.md, docs/STATUS.md và mô hình dữ liệu. Tôi muốn thêm: [tính năng]. Trước khi sửa, nêu tác động đến giao diện, dữ liệu, undo/redo, xuất tệp và tính tương thích. Giữ nguyên thanh công cụ trên cùng và vùng viết ngang. Đề xuất mô-đun cần thêm, migration nếu có, test nghiệm thu và cách quay lui. Chỉ thực hiện sau khi kế hoạch được duyệt; kết thúc bằng báo cáo bằng chứng test và cập nhật tài liệu.

## 9. Bảo vệ dữ liệu và cầu nối web–Mac

Ứng dụng mở tệp do người dùng chọn; HTML giao diện không được có quyền truy cập tùy ý ổ đĩa. Cầu nối JavaScript–Swift là nơi phải kiểm tra chặt chẽ.

- Chỉ cho phép tập lệnh cầu nối xác định trước, ví dụ mở/lưu/xuất/chọn tệp; xác thực loại và kích thước dữ liệu.
- Không nhận lệnh shell hoặc đường dẫn tùy ý từ JavaScript.
- Không chạy HTML/SVG script nhập từ tài liệu; làm sạch dữ liệu và giới hạn kích thước/số lượng đối tượng.
- Giới hạn điều hướng WKWebView về tài nguyên ứng dụng; liên kết ngoài có quy tắc mở riêng.
- Đọc tệp qua quyền được macOS cấp; bổ sung xử lý sandbox/bookmark nếu mô hình phân phối yêu cầu.
- Ghi tệp theo cách nguyên tử; kiểm tra đọc lại được; có backup hoặc recovery.
- Không nhúng khóa API vào HTML/JavaScript hoặc Git. Thiết kế giữ bí mật phù hợp nếu dùng dịch vụ ngoài.

## 10. Cách tiếp tục dự án mà không mất ngữ cảnh

Tài liệu không làm Antigravity tự nhớ mãi. Ngữ cảnh cần nằm trong workspace, được cập nhật theo tiến độ và được đọc lại khi bắt đầu phiên mới.

### 10.1. Nội dung `docs/STATUS.md`

Luôn giữ các mục:

- Giai đoạn hiện tại và bản build gần nhất.
- Những chức năng đã thực hiện, kèm bằng chứng test.
- Những chức năng còn mô phỏng hoặc chưa thử.
- Lỗi đang mở và cách tái hiện.
- Quyết định kỹ thuật mới và lý do.
- Mốc Git gần nhất có thể chạy được.
- Hành động tiếp theo duy nhất cần làm.

### 10.2. Prompt bắt đầu phiên mới

> Tiếp tục dự án Nét trong workspace này. Đọc AGENTS.md, NET_PROJECT.md, docs/STATUS.md và CHANGELOG.md trước. Kiểm tra mã hiện tại, không mặc định mọi kế hoạch đã triển khai. Tóm tắt ngắn: đang ở đâu, điều gì còn thiếu, bước tiếp theo. Không thiết kế lại giao diện hoặc đổi kiến trúc nếu chưa có lý do và chưa được duyệt.

### 10.3. Khi agent báo đã xong

Yêu cầu trả lời bốn câu: đã đổi tệp nào; đã chạy test/build nào; tôi cần bấm gì để kiểm tra; điều gì vẫn chưa hoạt động. Nếu chưa build hoặc chưa có thiết bị thử, ghi đúng “chưa kiểm chứng”.

## 11. Trình tự ưu tiên và các mốc bàn giao

Ưu tiên nét bút và giữ dữ liệu trước tính năng thông minh. Không cần hoàn thành OCR mới có thể có một bản ứng dụng hữu ích.

| Mốc | Nội dung bàn giao | Điều kiện chuyển tiếp |
|---|---|---|
| M0 | Hồ sơ + HTML tham chiếu + ảnh giao diện | Mở được bản HTML đã sao lưu |
| M1 | App Mac giữ giao diện, viết thử được | Chạy ngoại tuyến từ Xcode; bố cục đúng |
| M2 | Báo cáo bảng vẽ và đường nhập bút | Kiểm thử thiết bị thật, ghi rõ giới hạn |
| M3 | Document Core + lưu/tự lưu/khôi phục | Đóng/mở không mất dữ liệu thử; undo đúng |
| M4 | Viết ổn định + hình học chỉnh sửa được | Đạt test hình học và trải nghiệm người dùng |
| M5 | PDF/ảnh và xuất nhiều trang | Mở tài liệu xuất bằng ứng dụng khác không lệch |
| M6 | Nhận dạng thật nếu khả thi | Đánh giá tiếng Việt và quyền riêng tư rõ ràng |
| M7 | Build Release dùng ngoài Xcode | Kiểm thử Finder, lưu/mở, hướng dẫn cài và sao lưu |

**Việc nên làm ngay:** lưu Markdown này, lấy mã HTML gốc vào `reference/net-prototype.html`, mở workspace trong Antigravity và thực hiện Giai đoạn 0. Chưa giao lệnh xây toàn bộ tính năng cùng một lúc.

## 12. Nguồn tham khảo và ranh giới xác minh

Thông tin Antigravity dưới đây được tra cứu ngày 19/10/2026. Các đường dẫn dùng để kiểm tra hướng dẫn cài đặt và quy tắc dự án; những phiên bản, hạn mức hoặc giao diện mới hơn cần kiểm tra lại khi bắt đầu.

- [Google Antigravity — Get started](https://antigravity.google/docs/getting-started): cài đặt, lựa chọn môi trường, mở dự án và bắt đầu phiên làm việc.
- [Google Antigravity — Rules](https://antigravity.google/docs/rules): quy tắc dự án, `AGENTS.md` / `GEMINI.md` và cách áp dụng theo thư mục.

**Nguồn yêu cầu và giao diện:** các trao đổi của chủ dự án cùng mã HTML canvas Nét được cung cấp trong cuộc trò chuyện. **Các cấu trúc thư mục, lộ trình, tiêu chí test và kiến trúc trong tài liệu là đề xuất phát triển**, chưa phải kết quả đã triển khai.

| Ngày / mốc | Sự kiện | Con số / trạng thái chính |
|---|---|---|
| 19/10/2026 | Lập hồ sơ dự án từ bản mẫu hiện tại | Tài liệu 1.0; trang tham chiếu 1600 × 1060 |
| Bước kế tiếp | Lưu HTML và kiểm kê workspace | M0; chưa xác nhận có bản sao trên Mac |
| Trước khi chốt nhập bút | Kiểm thử bảng vẽ thật | M2; model/driver còn thiếu |
| Trước khi dùng thường xuyên | Nghiệm thu lưu và khôi phục | M3; không coi lưu phiên là đủ |
| Khi mở rộng | Thêm mô-đun, migration và test | Không bỏ tương thích tệp cũ |
