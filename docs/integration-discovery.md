# Khảo sát tích hợp fx-580

**Ngày khảo sát:** 22/10/2026  
**Phạm vi:** cấu trúc hiện có trong workspace Nét; chưa đánh giá bản macOS đóng gói.

## Kết quả

- Ứng dụng hiện tại là web app tĩnh: HTML, CSS và JavaScript nằm trong `web/`.
- Giao diện máy tính được nhúng trong `web/index.html`, tạo kiểu tại `web/style.css` và xử lý trong `web/fx580.js`.
- Ứng dụng gọi module qua API toàn cục `window.__fx580`; nút mở/đóng nằm trên thanh công cụ của ứng dụng.
- Không tìm thấy backend Python, API server, dependency manifest hoặc test runner chuẩn trong workspace được khảo sát. Kiểm thử fx580 hiện có là script JavaScript chạy bằng JavaScript for Automation trên macOS.
- Trạng thái máy và lịch sử hiện nằm trong bộ nhớ trang; chưa có lưu phiên độc lập hoặc hợp đồng snapshot.
- Một số mode đã có luồng tính toán cơ bản; nhiều mode khác chưa được triển khai dù được liệt kê trong đặc tả.
- `evaluateMathExpression` hiện biên dịch biểu thức bằng `new Function`. Cách này không đáp ứng yêu cầu parser an toàn trong `casio.md`, vì vậy không được coi là lõi tương thích có thể phát hành.
- Keymap và vị trí phím trong HTML chưa được đối chiếu trực quan với tài liệu fx-580VN X. Không dùng bố cục hiện tại làm bằng chứng tương thích phần cứng.

## Quyết định tích hợp cho mốc này

- Giữ UI và hành vi của ứng dụng chủ trong `web/`; không đưa framework hoặc dependency mới vào.
- Mốc này chỉ hoàn thiện điều hướng menu và công bố chính xác phạm vi hỗ trợ. Chưa thêm backend Python vì repository hiện không có runtime/backend để tích hợp; việc chọn cách đóng gói lõi Python sẽ là quyết định kiến trúc riêng trước khi bắt đầu lõi Calculate.
- Nút fx580 được đặt trong cụm nút cố định bên phải thanh tiêu đề; nhóm công cụ dài bên trái có thể cuộn ngang để không che hoặc chặn nút.
- Tạo bảng trạng thái ban đầu tại [`../spec/feature_matrix.json`](../spec/feature_matrix.json). Các mục được ghi `unverified` cho tới khi có đối chiếu với manual hoặc thiết bị.
- Không có tài liệu PDF/ảnh bàn phím được đối chiếu trực quan trong mốc này. Keymap cần được lập ở mốc UI kế tiếp và giữ cờ chưa xác minh cho tới lúc có bằng chứng.

## Lệnh kiểm tra hiện có

```sh
osascript -l JavaScript scratch/test_fx580.js
```

Lệnh trên đã chạy trong môi trường macOS và thành công ở mốc này. Đây là kiểm thử hồi quy của module giao diện/engine hiện tại, không phải chứng nhận tương thích với máy thật.

Đã mở `web/index.html` trong trình duyệt tích hợp ở viewport 320 px: nút fx580 bấm được, cửa sổ nằm gọn trong viewport, menu hiển thị đủ 12 mode và chọn Complex hiện thông báo chưa triển khai.
