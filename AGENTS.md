# Quy tắc dự án Nét

- Trước khi làm việc, đọc NET_PROJECT.md và docs/STATUS.md nếu có.
- Người dùng chưa biết lập trình: giải thích bằng tiếng Việt, từng bước rõ ràng, dễ hiểu.
- Giữ giao diện tham chiếu; công cụ ở trên, vùng viết ngang không có sidebar thường trực.
- Không sửa reference/net-prototype.html; dùng làm mốc đối chiếu.
- Mỗi lần chỉ làm một hạng mục có tiêu chí nghiệm thu.
- Dữ liệu cục bộ trước; không tải tài liệu người dùng lên mạng nếu chưa được đồng ý.
- Logic tài liệu/hình học độc lập giao diện và renderer.
- Mọi thay đổi dữ liệu cần cân nhắc schema, migration và tương thích tệp cũ.
- Thêm kiểm thử cho hành vi mới; kiểm thử hồi quy chức năng cũ.
- Không gọi OCR giả là OCR thật; không tuyên bố kiểm thử bảng vẽ nếu chưa thử thiết bị thật.
- Không xóa dữ liệu, cài công cụ, phát hành hoặc push mã nếu chưa được duyệt.
- Kết thúc mỗi hạng mục bằng: tệp đổi, test đã chạy, test chưa chạy, hạn chế, bước tiếp theo.
- Cập nhật docs/STATUS.md và CHANGELOG.md khi kết thúc hạng mục.
