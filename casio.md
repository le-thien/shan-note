# Đặc tả triển khai module máy tính tương thích fx-580VN X

**Đối tượng thực hiện:** Antigravity và lập trình viên tích hợp.

**Mục đích:** xây dựng một module máy tính khoa học tương thích hành vi fx-580VN X, tích hợp vào công cụ dạy học có lõi Python; bắt đầu từ giao diện, sau đó hiện thực đầy đủ các chức năng theo tài liệu chính thức.

**Ngôn ngữ tài liệu:** tiếng Việt. Tên module, kiểu dữ liệu, mã sự kiện và tên kiểm thử dùng tiếng Anh.

**Loại sản phẩm:** bản triển khai phần mềm độc lập dựa trên đặc tả công khai, không phải firmware, mã nguồn hay sản phẩm chính thức của Casio.

**Quy ước:** MUST = bắt buộc; SHOULD = khuyến nghị; MAY = tùy chọn. Các con số về kích thước giao diện, ngân sách hiệu năng và giới hạn tài nguyên dịch vụ trong tài liệu này là đề xuất của dự án, trừ khi ghi rõ là thông số từ hướng dẫn Casio.

---

## 1. Mệnh lệnh triển khai dành cho Antigravity

Đọc toàn bộ tài liệu trước khi thay đổi mã nguồn. Triển khai theo các mốc; không cố tạo một bản máy tính nhìn có vẻ hoàn chỉnh nhưng các phím, menu hoặc chế độ chỉ là giả lập hình thức.

1. Khảo sát repository hiện có và xác định công nghệ giao diện, backend, cách chạy, cơ chế đăng nhập, lưu dữ liệu và bộ kiểm thử.
2. Giữ nguyên công nghệ và quy ước hiện tại nếu có thể tích hợp sạch. Không tự ý thay framework, tổ chức lại toàn dự án hoặc nâng hàng loạt dependency.
3. Nếu chưa có ứng dụng: đề xuất bản web độc lập với lõi Python, backend FastAPI và frontend TypeScript. Đây là phương án mặc định đề xuất, không phải yêu cầu bắt buộc nếu repository đã có kiến trúc khác.
4. Xây giao diện và luồng tương tác trước, nhưng ghi rõ trạng thái mock. Tiếp theo thay mock bằng engine thực qua một hợp đồng dữ liệu ổn định.
5. Dùng tài liệu Casio làm chuẩn, không dùng trí nhớ hoặc hành vi của máy khác để điền chỗ thiếu.
6. Mọi chức năng phải có đường truy cập từ phím/menu, triển khai backend, định dạng hiển thị, xử lý lỗi và kiểm thử.
7. Không dùng `eval`, `exec`, hoặc parser có thể thực thi mã Python với chuỗi do người dùng nhập.
8. Không tự gọi một bản demo là “đầy đủ”, “100% chính xác” hoặc “giống tuyệt đối máy thật”. Chỉ công bố phạm vi đã kiểm chứng.
9. Nếu cần ảnh bàn phím, số thứ tự menu hoặc thông số chưa xác minh: tạo mục cần đối chiếu có nguồn, không đoán rồi đánh dấu hoàn tất.
10. Sau mỗi mốc, cung cấp danh sách file thay đổi, lệnh chạy, kết quả kiểm thử thực tế và những điểm chưa đạt.

### 1.1. Sản phẩm cuối cùng phải có

- Máy tính tương tác với bàn phím ảo, phím tắt, màn hình nhập công thức và màn hình kết quả.
- Mười hai chế độ chính theo hướng dẫn fx-580VN X.
- Trình soạn thảo công thức hai chiều; không chỉ một ô nhập văn bản.
- Các chức năng SHIFT, ALPHA, SETUP, OPTN, bộ nhớ và lịch sử tương ứng.
- Lõi tính toán Python có thể kiểm thử mà không cần giao diện.
- Adapter nhúng vào ứng dụng dạy học; trạng thái từng phiên độc lập.
- Bảng đối chiếu chức năng với tài liệu và bộ kiểm thử tái lập.
- Tài liệu chạy, tích hợp, hạn chế và báo cáo mức tương thích.

### 1.2. Không thuộc phạm vi lõi

- Giải mã hoặc sao chép firmware Casio.
- Tải script, tài nguyên độc quyền hoặc engine từ ClassPad.net để dùng lại khi chưa có quyền phù hợp.
- Tự động thao tác tài khoản ClassPad của người dùng.
- Đồ thị và CAS toàn năng trong chế độ mô phỏng chuẩn; fx-580VN X không phải máy đồ thị hay hệ CAS tổng quát.
- Tự tạo lời giải từng bước bằng AI rồi xem đó là kết quả của máy fx-580VN X.
- Phần cứng, pin và kiểm tra điện tử thực. Bật/tắt màn hình phần mềm chỉ là hành vi giao diện.

## 2. Nguồn chuẩn và quản lý bằng chứng

### 2.1. Nguồn chính thức

- Hướng dẫn HTML tiếng Việt: https://support.casio.com/global/vi/fx/manual/fx-580VNX_VI
- Hướng dẫn PDF tiếng Việt: https://www.casio.com/content/dam/casio/global/support/manuals/calculators/pdf/004-vi/f/fx-580VNX_VI.pdf
- Trang sản phẩm tìm được: https://www.casio.com/intl/scientific-calculators/product.FX-580VNX
- ClassPad chỉ dùng tham khảo cách tổ chức công cụ giáo dục: https://classpad.net/intl/features/

PDF đã được đọc dưới dạng trích xuất văn bản để lập tài liệu này. Phần trích xuất làm mất nhiều hình phím và có chỗ sai ký tự/công thức; vì vậy chưa đủ để chứng nhận bố cục từng nhãn phím hoặc chuỗi phím vật lý. Trang sản phẩm có kết quả tìm kiếm nhưng công cụ đọc trang không trích xuất được nội dung đầy đủ.

**Bắt buộc:** Antigravity phải xem trực quan trang PDF/ảnh tham chiếu được phép sử dụng trước khi chốt keymap, hình phím, số thứ tự menu và các công thức bị lỗi trích xuất. Không suy luận chức năng từ một chuỗi trống giữa hai hình phím trong bản text.

### 2.2. Mốc trang trong PDF

Các số bên dưới là số trang in trong nội dung hướng dẫn, không đảm bảo bằng chỉ số trang của trình đọc PDF.

| Nội dung | Trang tham chiếu |
|---|---:|
| Bắt đầu, phím phụ, chỉ báo, menu | 4–8 |
| Chế độ và cài đặt | 8–17 |
| Nhập và sửa công thức | 17–24 |
| Thập phân tuần hoàn, chuyển kết quả | 25–32 |
| Số học, phân số, phần trăm, DMS | 33–38 |
| Đa câu lệnh, ENG, FACT, chia dư | 39–44 |
| Lịch sử và bộ nhớ | 44–52 |
| Các hàm, tích phân, vi phân, Σ, ∏ | 53–74 |
| CALC và SOLVE | 74–81 |
| Hằng số và đổi đơn vị | 81–90 |
| Complex và Base-N | 90–99 |
| Matrix và Vector | 99–117 |
| Statistics | 117–155 |
| Distribution | 155–161 |
| Table | 161–164 |
| Equation/Func | 164–171 |
| Inequality, Verify, Ratio | 171–179 |
| Lỗi, độ ưu tiên, stack, miền và độ chính xác | 179–188 |

### 2.3. Thứ tự xử lý xung đột

1. Xác minh rằng nguồn đang nói đúng fx-580VN X và đúng cài đặt/chế độ.
2. Đối chiếu tài liệu HTML, PDF trực quan và ví dụ cụ thể.
3. Nếu có máy thật, ghi lại chuỗi phím, trạng thái ban đầu và ảnh kết quả.
4. Ghi nhận khác biệt thay vì âm thầm sửa tài liệu hoặc chọn kết quả thuận tiện.
5. Nếu chưa kết luận được, giữ trạng thái `needs_verification`; không chứng nhận tương thích ở mục đó.

Ví dụ cần thận trọng: phần đổi đơn vị có thể có lỗi đơn vị khi trích xuất; một số mô tả phương trình có ký tự bị nhận sai; miền góc của Pol và góc cực trong Complex không được mặc nhiên gộp thành một quy tắc.

### 2.4. Hồ sơ đối chiếu

Tạo `spec/feature_matrix.yaml` hoặc định dạng tương đương. Mỗi chức năng có:

- `id`, `mode`, `name`, `source_document`, `source_section`, `printed_page`.
- `entry_path`, `supported_settings`, `input_domain`, `result_type`.
- `memory_effects`, `error_cases`, `limits`, `display_rules`.
- `implementation_status`, `verification_level`, `test_ids`, `known_differences`.

Trạng thái triển khai: `not_started`, `ui_only`, `implemented`, `tested`, `blocked`.

Mức xác minh: `unverified`, `manual_checked`, `reference_device_checked`. Không dùng `implemented` như đồng nghĩa với đã đúng máy thật.

## 3. Khảo sát ứng dụng dạy học trước khi code

Tạo `docs/integration-discovery.md` trước khi phát triển module. Không cần người dùng trả lời lại những thông tin có thể đọc từ repository.

### 3.1. Checklist khảo sát

- Python version, hệ điều hành triển khai, dependency manager, lockfile.
- Framework: Streamlit, Flask, FastAPI, Django, PySide6, PyQt, Tkinter hoặc khác.
- Frontend hiện có, CSS framework, thiết kế component, bundler và test runner.
- Công cụ dạy học là web, desktop, nhúng WebView hay loại khác.
- Cơ chế plugin, routing, modal, sidebar hoặc cửa sổ nổi hiện tại.
- Authentication, session, storage, quyền của giáo viên/học viên.
- Yêu cầu offline và chính sách mạng của môi trường.
- Các quy tắc lint, format, typing, CI và cấu trúc source.
- Các file cấu hình có dữ liệu bí mật: không in giá trị bí mật vào báo cáo.

### 3.2. Quyết định tích hợp theo nền tảng

| Nền tảng hiện có | Cách tích hợp ưu tiên |
|---|---|
| Web có backend Python | Engine Python độc lập; UI theo frontend hiện có; adapter API |
| Streamlit | Custom component cho editor/bàn phím; Python adapter xử lý lõi; tránh rerun toàn trang mỗi phím |
| Django/Flask | Blueprint/app/module phù hợp repository; không tạo backend thứ hai nếu không cần |
| PySide6/PyQt | Engine dùng chung; widget desktop hoặc WebView với bridge hẹp và có kiểm soát |
| Tkinter | Engine dùng chung; đánh giá editor công thức bằng widget riêng hoặc WebView trước khi chốt |
| Chưa có dự án | Đề xuất FastAPI + TypeScript; xin xác nhận nếu kéo theo thay đổi đáng kể ngoài module |

Python là yêu cầu cho lõi. Với ứng dụng web, không hiểu yêu cầu đó thành “không được có JavaScript/TypeScript”. Nếu chủ dự án thật sự yêu cầu toàn bộ UI viết Python, ghi lại quyết định và đánh giá giới hạn editor hai chiều trước khi triển khai.

## 4. Kiến trúc tổng thể

Tách lớp để một thay đổi CSS không ảnh hưởng phép tính, và việc thay thư viện số không làm đổi cách bấm phím.

### 4.1. Các lớp bắt buộc

1. **Presentation:** vỏ máy, bàn phím, LCD, bảng dữ liệu, panel dạy học.
2. **Input controller:** chuyển pointer/keyboard thành sự kiện phím vật lý hoặc hành động ngữ nghĩa.
3. **State machine:** quyết định sự kiện hợp lệ theo màn hình, chế độ, modifier và tác vụ hiện tại.
4. **Expression editor:** cây công thức đang sửa, placeholder, con trỏ, undo và layout.
5. **Parser/validator:** chuyển biểu thức hoàn chỉnh thành AST; kiểm tra miền và quyền dùng hàm trong chế độ.
6. **Evaluation engine:** số học, hàm, đại số tuyến tính, thống kê, phân phối và solver.
7. **Compatibility layer:** giới hạn, quy tắc làm tròn, side effect, ưu tiên, lỗi và quy tắc hiển thị của fx-580VN X.
8. **Integration/storage:** phiên máy tính, import/export, bridge host và lưu trạng thái được phép.

### 4.2. Luồng xử lý

`Physical input → KeyEvent → Keymap resolver → State reducer → Editor/menu action → Validated AST → Evaluator → Compatibility formatter → ScreenModel → Renderer`.

Không để component nút tự tính toán bằng thư viện riêng. Không để frontend và backend có hai bộ quy tắc ưu tiên độc lập.

### 4.3. Cấu trúc thư mục đề xuất

Điều chỉnh prefix theo repository, nhưng giữ ranh giới trách nhiệm:

- `calculator/core/state.py`, `events.py`, `reducer.py`, `commands.py`.
- `calculator/editor/document.py`, `cursor.py`, `operations.py`, `serialization.py`.
- `calculator/parser/tokens.py`, `lexer.py`, `grammar.py`, `ast.py`, `validation.py`.
- `calculator/engine/numbers.py`, `context.py`, `evaluator.py`, `function_registry.py`.
- `calculator/engine/functions/` cho arithmetic, trig, logs, calculus, discrete, coordinates.
- `calculator/modes/` cho Calculate, Complex, Base-N, Matrix, Vector, Statistics, Distribution, Table, Equation, Inequality, Verify, Ratio.
- `calculator/compatibility/` cho precedence, numeric_policy, domains, display_policy, limits, memory_policy và errors.
- `calculator/catalogs/` cho keys, menus, constants, conversions và localization.
- `calculator/adapters/` cho host, web API hoặc desktop bridge.
- `frontend/calculator/` nếu dự án dùng web.
- `spec/` cho keymap, menu tree, feature matrix, nguồn và known differences.
- `tests/unit/`, `tests/integration/`, `tests/golden/`, `tests/e2e/`, `tests/security/`.
- `docs/` cho thiết lập, kiến trúc, tích hợp và báo cáo tương thích.

### 4.4. Thư viện đề xuất và giới hạn sử dụng

- `fractions.Fraction`: số hữu tỉ chính xác.
- `decimal.Decimal`: nhập số thập phân và chính sách làm tròn có kiểm soát.
- `mpmath`: tính hàm số và số nhiều chữ số khi thích hợp.
- `SymPy`: một số biến đổi chính xác trên AST tin cậy do hệ thống xây dựng; không cung cấp trực tiếp CAS cho người dùng trong chế độ chuẩn.
- `NumPy/SciPy`: đại số tuyến tính, phân phối và thuật toán số nếu môi trường hỗ trợ.
- `pytest`: kiểm thử lõi, state machine và adapter.
- Playwright hoặc công cụ hiện có: kiểm thử UI web.

Không khẳng định phiên bản “mới nhất”. Chọn phiên bản tương thích môi trường, khóa dependency, ghi license và kiểm tra CI. Nếu SciPy quá nặng với bản phân phối đích, quyết định thuật toán thay thế phải được ghi lại và kiểm thử độc lập.

## 5. Thiết kế giao diện: làm trước, nhưng không làm giả chức năng

Mục tiêu là giáo viên và học viên nhìn vào biết cách thao tác như máy tính cầm tay, đồng thời có thể phóng to để giảng dạy. Bố cục cuối cùng phải đối chiếu ảnh máy thật và PDF trực quan.

### 5.1. Hai lớp giao diện

**Lớp máy tính chuẩn** gồm vỏ máy, LCD, phím vật lý và menu nội bộ. Giữ gần với thao tác máy tham chiếu.

**Lớp hỗ trợ dạy học** nằm ngoài vỏ máy: phóng to, lịch sử phím, sao chép kết quả, phát lại thao tác, hướng dẫn và trạng thái tương thích. Không trộn các tính năng này vào menu gốc khiến học viên hiểu nhầm máy thật có chúng.

### 5.2. Bố cục màn hình ứng dụng

- Container nhúng có thể ở panel phải, modal hoặc vùng nội dung theo host.
- Máy tính đặt giữa container, không che nội dung bài học khi thu nhỏ.
- Panel dạy học có thể đóng/mở; mặc định đóng trên màn hình hẹp.
- Có chế độ phóng to LCD độc lập với phóng to toàn bộ máy.
- Có nút đóng/thu gọn của host nằm ngoài vỏ, không giả thành phím OFF.
- Mọi trạng thái mock trong giai đoạn đầu phải có nhãn phát triển dễ thấy.

### 5.3. Kích thước thiết kế đề xuất

Đây là kích thước UI, không phải kích thước phần cứng Casio:

| Thành phần | Đề xuất ban đầu |
|---|---|
| Chiều rộng máy trên desktop | 360–420 CSS px |
| Chiều rộng compact | khoảng 320 CSS px |
| Chiều rộng tối đa có thể phóng to | theo container, có giữ tỷ lệ |
| Vùng bấm trên giao diện thông thường | hướng tới tối thiểu 44 × 44 CSS px |
| Panel lịch sử phím | rộng 260–360 CSS px khi đủ chỗ |
| Kích thước thiết kế tham chiếu | hệ tọa độ logic riêng, không hardcode theo ảnh nền |

Nếu bố cục gốc làm vùng bấm nhỏ trên điện thoại: tăng tỷ lệ hoặc cung cấp bàn phím hỗ trợ ngoài vỏ. Không chồng hitbox khiến bấm một phím nhận phím khác. Ưu tiên vừa chiều ngang và cho cuộn dọc; không ép toàn bộ máy vào viewport thấp bằng cách thu chữ đến mức không đọc được.

### 5.4. Design tokens

Khai báo token cho màu vỏ, viền, LCD, chữ LCD, phím thường, DEL/AC, nhãn SHIFT, nhãn ALPHA, nhãn chế độ, focus ring, khoảng cách và bóng đổ.

Một palette phát triển có thể bắt đầu bằng nền vỏ xanh đen, LCD sáng ngả xanh, chữ đậm gần đen, nhãn SHIFT vàng và ALPHA đỏ. Đây là đề xuất thẩm mỹ, không phải tuyên bố màu chính xác của máy thật. Khi fidelity được duyệt, khóa theme tham chiếu và screenshot baseline.

MUST hỗ trợ nhận biết modifier bằng chữ/chỉ báo, không chỉ bằng màu. Font toán phải hiển thị đủ √, ∫, Σ, ∏, π, ∠, ≠, ≤, ≥, mũ và chỉ số dưới; kiểm tra giấy phép trước khi đóng gói.

### 5.5. Vỏ máy và nhãn thương hiệu

- Dùng component/CSS/SVG do dự án tạo hoặc tài nguyên được cấp phép.
- Không dùng ảnh cả chiếc máy làm UI tương tác duy nhất.
- Không đưa logo chính hãng vào sản phẩm phát hành khi chưa xác minh quyền sử dụng.
- Có thể hiển thị tên riêng của công cụ và dòng “Mô phỏng tương thích fx-580VN X, không phải sản phẩm chính thức của Casio”.
- Nếu yêu cầu giao diện giống sát máy thật, giữ đó là hạng mục cần kiểm tra quyền trước phát hành; không tự đưa ra kết luận pháp lý.

### 5.6. Các vùng LCD

1. Thanh chỉ báo: SHIFT/ALPHA, D/R/G, M, FIX/SCI, định dạng nhập và các chỉ báo ngữ cảnh đã được xác minh.
2. Vùng công thức nhập: công thức hai chiều, con trỏ và dấu tràn/scroll.
3. Vùng kết quả: số, phân số, căn, số phức, bảng hoặc thông báo tùy chế độ.
4. Vùng điều hướng/menu: danh sách, highlight, trang và mũi tên khi cần.

LCD là renderer của `ScreenModel`, không là một ảnh chụp phụ thuộc DOM không thể đọc bằng công nghệ hỗ trợ.

### 5.7. Danh sách màn hình bắt buộc

- OFF; nhập Calculate; kết quả; xem lại lịch sử.
- Main Menu với đủ 12 chế độ và điều hướng theo trang.
- SETUP; OPTN theo từng chế độ và từng ngữ cảnh.
- CALC nhập biến; SOLVE nhập dữ liệu, chọn biến, chờ tính, Continue và kết quả sai số dư.
- Matrix chọn biến, chọn kích thước, editor, MatAns.
- Vector chọn biến, chọn chiều, editor, VctAns.
- Statistics chọn kiểu, editor, thống kê tổng hợp, hồi quy và màn hình tính.
- Distribution chọn kiểu, chọn List/Variable, nhập tham số, danh sách kết quả.
- Table nhập f/g, nhập khoảng, xem bảng, sửa x.
- Equation/Func chọn loại/bậc, editor hệ số, duyệt nghiệm và cực trị theo máy tham chiếu.
- Inequality chọn bậc, dấu so sánh, editor và tập nghiệm.
- Verify nhập chuỗi quan hệ, True/False và tiếp tục kiểm tra.
- Ratio chọn mẫu, nhập hệ số và kết quả.
- RECALL, STO, RESET, contrast, ngôn ngữ, lỗi và quay lại vị trí lỗi.

## 6. Bàn phím ảo và keymap

### 6.1. Không tự đoán bàn phím

Tạo `spec/keymap.yaml` bằng cách đối chiếu trực quan. Mỗi phím vật lý có ID ổn định, vị trí, nhãn chính, nhãn SHIFT, nhãn ALPHA và override theo chế độ.

Những nhóm cần có gồm phím modifier/điều hướng, MENU/SETUP, OPTN/CALC, nhóm mẫu công thức/hàm khoa học, bộ nhớ, số và số học. Vị trí cụ thể phải theo ảnh tham chiếu; không dùng bố cục fx-570, fx-991 hoặc dòng CW thay thế.

Trong giai đoạn layout chưa xác minh, dùng keymap nháp có cờ `verified: false`; không đánh dấu hoàn thành UI fidelity.

### 6.2. Schema phím

Một bản ghi phím chứa:

- `physical_id`: ví dụ tên logic `key_sin`; không phụ thuộc text trên màn hình.
- `geometry`: hàng/cột hoặc tọa độ logic và vùng bấm.
- `primary_label`, `shift_label`, `alpha_label`.
- `primary_action`, `shift_action`, `alpha_action`.
- `mode_overrides` và điều kiện được dùng.
- `aria_label`, `tooltip`, `repeat_policy`.
- `source_reference`, `verified`, `verification_note`.

Tách ID vật lý khỏi hành động: cùng một phím có thể mang hành động khác trong Complex/Base-N hoặc màn hình menu.

### 6.3. Quy tắc modifier

- SHIFT/ALPHA tạo trạng thái chờ theo hành vi tham chiếu, có chỉ báo.
- Resolver xét ngữ cảnh trước khi chọn hành động phụ; không coi SHIFT là trạng thái bật vĩnh viễn.
- Kiểm thử chuỗi SHIFT → phím hàm, ALPHA → biến, nhấn modifier lại, chuyển menu, lỗi và AC.
- Nếu hành vi của hai modifier liên tiếp chưa rõ, tạo golden test cần đối chiếu; không tùy ý cho phép đồng thời.
- Đừng tạo alpha lock nếu máy tham chiếu không có trong luồng đó.
- Nhấn phím vô hiệu không được crash hoặc chèn token tùy tiện.

### 6.4. Keyboard máy tính

Mapping ban đầu của ứng dụng: số → số, Enter → thực hiện/chọn, Backspace → DEL, Escape → hành động hủy/quay lại được định nghĩa, các mũi tên → điều hướng. Đây là phím tắt phần mềm, không phải khẳng định cách Casio Emulator ánh xạ.

- Chỉ nhận phím khi module đang có focus.
- Không chặn Ctrl/Cmd+C, phím của trình đọc màn hình hoặc phím tắt host khi không cần.
- Không nuốt bàn phím ở ô nhập bài giảng.
- Không phát sinh hai sự kiện từ cả pointer và click.
- Dùng pointer events và xử lý pointercancel đúng.
- Giữ phím chỉ repeat ở những hành động đã quy định, như con trỏ hoặc DEL; mặc định không repeat phép tính.
- Paste biểu thức là tính năng hỗ trợ riêng: parse bằng grammar cho phép, có xem trước, không cho paste mã Python.

## 7. State machine và mô hình dữ liệu

### 7.1. CalculatorState

Các trường tối thiểu:

- `schema_version`, `state_revision`, `power`, `mode`, `screen_kind`.
- `modifier`, `menu_stack`, `selected_item`, `viewport`.
- `settings`, `editor_document`, `editor_cursor`, `editor_undo`.
- `result`, `result_view`, `history`, `history_position`.
- `memory`, `mode_data`, `pending_operation`, `error`.
- `compatibility_profile`, `verification_flags`.

Dữ liệu session và metadata host không được trộn vào biểu thức hoặc biến toán học.

### 7.2. ScreenKind

Dùng enum/discriminated union, không dùng nhiều boolean xung đột:

`OFF`, `EXPRESSION_EDIT`, `RESULT`, `MAIN_MENU`, `SETUP_MENU`, `OPTIONS_MENU`, `VARIABLE_PROMPT`, `SOLVE_PROMPT`, `SOLVE_CONTINUE`, `SOLVE_RESULT`, `GRID_EDIT`, `GRID_RESULT`, `COEFFICIENT_EDIT`, `SOLUTION_LIST`, `RANGE_PROMPT`, `RESET_CONFIRM`, `BUSY`, `ERROR`.

`GRID_EDIT` phải có subtype cho Matrix, Vector, Statistics, Distribution và Table; cùng renderer cơ bản nhưng hành vi theo chế độ.

### 7.3. Event và reducer

Phân biệt:

- `PhysicalKeyPressed`, `PhysicalKeyReleased`.
- `InsertTemplate`, `InsertDigit`, `InsertSymbol`, `MoveCursor`, `DeleteAtCursor`.
- `OpenMenu`, `SelectMenuItem`, `ChangeSetting`, `ChangeMode`.
- `EvaluateRequested`, `EvaluationSucceeded`, `EvaluationFailed`, `CancelRequested`.
- `StoreVariable`, `RecallVariable`, `ResetRequested`, `ResetConfirmed`.
- `HostRestoreRequested`, `HostExportRequested` cho adapter.

Reducer thuần trả về state mới và effects; không gọi HTTP, filesystem hoặc chạy solver trong reducer. Effects do worker/adapter thực thi. Mọi kết quả tính toán mang revision và operation ID để bỏ kết quả cũ.

### 7.4. Bất biến trạng thái

- Một phiên có tối đa một phép tính active theo chính sách điều phối.
- Kết quả lỗi không cập nhật Ans như phép tính thành công.
- Chuyển chế độ áp dụng chính sách xóa/giữ riêng, không xóa tất cả mặc định.
- Mỗi menu có đường quay lại hợp lệ; không tạo vòng lặp không thoát.
- Con trỏ luôn tham chiếu slot hợp lệ, kể cả sau DEL/undo/import.
- Không nhận kết quả async từ revision cũ để đè màn hình mới.
- Không có state toàn cục dùng chung dữ liệu nhiều học viên.

## 8. Trình soạn thảo biểu thức hai chiều

Đây là hạng mục lõi, không thể thay bằng textarea rồi hiển thị LaTeX sau khi nhấn bằng.

### 8.1. Hai loại cây khác nhau

**Editor document** phải biểu diễn được công thức chưa hoàn chỉnh: ô trống, phân số chưa có mẫu, dấu ngoặc đang mở, con trỏ nằm trong số mũ.

**Evaluation AST** chỉ biểu diễn biểu thức đã hợp lệ. Việc chuyển từ editor document sang AST cần bước validation; không ép biểu thức dang dở thành số 0 để tính.

### 8.2. Node editor tối thiểu

`Sequence`, `Token`, `Placeholder`, `FractionTemplate`, `MixedFractionTemplate`, `PowerTemplate`, `SquareRootTemplate`, `NthRootTemplate`, `FunctionTemplate`, `LogBaseTemplate`, `IntegralTemplate`, `DerivativeTemplate`, `SumTemplate`, `ProductTemplate`, `AbsoluteTemplate`, `RecurringDecimalTemplate`, `ParenthesisGroup`.

Thêm node hoặc token cho DMS, scientific exponent, angle suffix, matrix/vector reference, relation và multi-statement. Không dùng chuỗi LaTeX làm nguồn dữ liệu duy nhất.

### 8.3. Con trỏ có cấu trúc

Mô hình gồm `node_path`, `slot_id`, `offset`, `affinity`. Offset không đơn thuần là vị trí trong chuỗi UTF-16.

- Trái/phải đi trong slot và ra ngoài mẫu theo quy tắc được kiểm thử.
- Lên/xuống chuyển tử ↔ mẫu, cơ số ↔ số mũ, các cận hoặc ô bảng.
- Khi vào slot trống hiển thị placeholder.
- Khi ra khỏi lũy thừa, số tiếp theo phải nhập ở dòng chính.
- Con trỏ có chiều cao theo slot, có vùng focus được nhìn thấy.
- Cuộn LCD theo caret khi công thức dài.

### 8.4. Các thao tác phải có

- Chèn/xóa chữ số, dấu âm, toán tử và hàm.
- Chèn mẫu tại caret; hỗ trợ bọc biểu thức theo thao tác INS trong định dạng sách giáo khoa khi có nguồn xác minh.
- Chèn và ghi đè trong LineI theo tài liệu.
- DEL ở trong/ngoài mẫu phải có quy tắc rõ, tránh mất toàn bộ biểu thức ngoài ý muốn.
- UNDO theo thao tác máy tham chiếu; redo/toggle phải xác minh. Không mặc nhiên áp dụng stack undo vô hạn của text editor vào chế độ chuẩn.
- Gọi lại lịch sử vào editor có thể chỉnh sửa.
- Serialize/deserialize không mất cấu trúc hoặc caret.
- Xuất plain text và LaTeX là chức năng bổ trợ; không phải định dạng lưu trữ chính.

### 8.5. Rendering

Có thể dùng SVG layout riêng hoặc DOM có cấu trúc. Nếu dùng KaTeX/MathJax cho preview, phải chứng minh việc hit-test, caret và editing có thể đáp ứng yêu cầu; renderer công thức tĩnh tự nó không phải editor.

Tạo layout tree gồm bounding box, baseline, caret stops và hit areas. Test phân số lồng nhau, căn trong mẫu, mũ phân số, log cơ số và tích phân. Không dùng `innerHTML` với input chưa sanitize.

### 8.6. Kịch bản nghiệm thu editor

- Nhập `1/2 + 1/3` bằng mẫu phân số, nhận `5/6`.
- Nhập `(1 + 2/5)^2 × 2`, sửa mẫu 5 thành 7 mà không mất số mũ.
- Nhập `sqrt(2 + sqrt(3))` và di chuyển ra đúng từng lớp.
- Chèn chữ số sau khi rời số mũ không được nối vào số mũ.
- DEL/undo ở ranh giới phân số không làm caret trỏ tới node đã bị xóa.
- Chuyển MathI/LineI tuân thủ chính sách lịch sử/editor đã xác minh, không âm thầm đổi ý nghĩa.

## 9. Parser và ưu tiên phép toán

### 9.1. Pipeline

`Editor document hoặc input hỗ trợ → lexical tokens → parse → AST → mode/domain validation → evaluation`.

Dùng Pratt parser hoặc grammar rõ ràng; chọn một nguồn chuẩn cho bảng precedence. Không chuyển thẳng chuỗi người dùng vào `sympify`, `parse_expr`, `lambdify` hoặc cơ chế tương tự nếu chưa có biên kiểm soát và đánh giá an toàn.

### 9.2. AST tối thiểu

`IntegerLiteral`, `DecimalLiteral`, `RecurringDecimalLiteral`, `RationalLiteral`, `ConstantRef`, `VariableRef`, `UnaryOperation`, `BinaryOperation`, `FunctionCall`, `Power`, `Root`, `Factorial`, `Percent`, `AngleAnnotatedValue`, `DMSValue`, `Assignment`, `MultiStatement`, `RelationChain`, `MatrixRef`, `VectorRef`.

Mỗi node giữ `source_span` hoặc ánh xạ về editor node để báo vị trí lỗi. Token nhập `×10^` phải khác phép nhân số học thông thường khi cần.

### 9.3. Thứ tự ưu tiên theo tài liệu

Từ cao xuống thấp:

1. Ngoặc đơn.
2. Hàm có ngoặc và đối số bên phải.
3. Hàm hậu tố như bình phương, lập phương, nghịch đảo, giai thừa, đơn vị góc, phần trăm; ký hiệu kỹ thuật; lũy thừa/căn theo grammar tham chiếu.
4. Phân số.
5. Dấu âm và ký hiệu cơ số đặc biệt.
6. Lệnh đổi đơn vị và giá trị ước lượng thống kê.
7. Nhân ngầm.
8. nPr, nCr, ký hiệu tọa độ cực.
9. Tích vô hướng.
10. Nhân, chia, chia dư.
11. Cộng, trừ.
12. `and`.
13. `or`, `xor`, `xnor`.

Associativity và tương tác các mẫu phải được kiểm tra riêng. Không coi bảng trên là đủ để suy ra mọi biểu thức lũy thừa lồng nhau.

### 9.4. Các bẫy bắt buộc kiểm thử

- `-2^2 = -4`; `(-2)^2 = 4`.
- `6 ÷ 2(1+2)` theo ví dụ tài liệu được hiểu thành `6 ÷ (2(1+2))`, kết quả 1.
- `4π ÷ 2π` theo ví dụ tài liệu được nhóm thành `4π ÷ (2π)`, kết quả 2.
- Dấu trừ nhị phân không đồng nhất với phím dấu âm.
- `sin(30)+15` khác `sin(30+15)`.
- Chỉ lược ngoặc đóng trong những trường hợp tài liệu cho phép; không tự chữa mọi cú pháp sai.
- `log(x)` mặc định cơ số 10; `ln(x)` cơ số e; mẫu log cơ số có slot riêng.
- Dấu `=` trong phép thực hiện, quan hệ Verify và gán CALC là ba ngữ nghĩa khác nhau.

## 10. Hệ số, độ chính xác và định dạng kết quả

### 10.1. Kiểu giá trị

Không dùng Python float làm kiểu duy nhất. Cần union có kiểu:

- Integer/Rational/DecimalNumber.
- ApproximateReal với metadata về độ chính xác.
- ExactDisplayExpression giới hạn cho dạng căn/π được máy hỗ trợ.
- ComplexNumber.
- MatrixValue, VectorValue.
- BooleanValue, SolutionSet, TabularResult, QuotientRemainderResult.

Giá trị dùng cho tính tiếp và chuỗi hiển thị là hai trường khác nhau. Không đọc ngược chuỗi đã format để cập nhật bộ nhớ.

### 10.2. Numeric policy

Hướng dẫn nêu 15 chữ số cho tính nội bộ và độ chính xác nói chung ±1 ở chữ số thứ 10 cho một phép tính đơn; sai số có thể tích lũy. Đây không phải mô tả đầy đủ toàn bộ thuật toán firmware.

- Tạo `NumericPolicy` riêng, có rounding context và kiểm tra miền trung gian/kết quả.
- Có thể tính với guard digits rồi áp dụng policy, nhưng không tuyên bố điều đó tái tạo bit-for-bit máy thật.
- Không lượng tử hóa mọi node một cách tùy tiện thành 15 chữ số rồi xem là chính xác firmware.
- Giữ rational/exact representation khi hợp lệ; side effect bộ nhớ và phép tính xấp xỉ phải theo policy đã được kiểm thử.
- Ghi những trường hợp khác máy tham chiếu vào `known_differences`.

Miền tổng quát tài liệu nêu: 0 hoặc giá trị có độ lớn từ `10^-99` đến `9.999999999 × 10^99`. Quy tắc underflow, overflow và từng hàm phải kiểm tra theo tài liệu/thiết bị; không suy ra mọi giá trị nhỏ đều gây cùng một lỗi.

### 10.3. Định dạng số

- MathI/MathO, MathI/DecimalO, LineI/LineO, LineI/DecimalO.
- Fix 0–9; Sci theo bảng giá trị và quy tắc riêng của lựa chọn 0 cần xác minh.
- Norm 1: hiển thị dạng mũ với độ lớn khác 0 nhỏ hơn `10^-2` hoặc từ `10^10` trở lên.
- Norm 2: ngưỡng nhỏ là `10^-9`; ngưỡng lớn vẫn `10^10`.
- Phân số tối giản, hỗn số và điều kiện tối đa chữ số theo tài liệu.
- Dấu thập phân Dot/Comma; input vẫn theo quy tắc máy, không sửa token dấu phẩy phân cách đối số thành dấu thập phân tùy tiện.
- Digit Separator và quy tắc dấu phân cách nhiều kết quả.
- ENG và dịch mũ theo bội 3; ký hiệu kỹ thuật tương ứng.
- S⇔D phải chuyển giữa các dạng thực sự được phép, không dùng nhận dạng phân số gần đúng vô hạn.
- SHIFT + phép thực hiện dạng xấp xỉ là một hành động riêng, theo keymap đã xác minh.

### 10.4. Dạng chính xác không phải CAS tổng quát

Máy có thể hiển thị căn và bội π trong một số trường hợp, nhưng không được trả mọi biểu thức symbolic mà SymPy tạo ra. Thiết kế `ExactOutputPolicy`:

1. Kiểm tra nguồn gốc và kiểu phép toán.
2. Kiểm tra dạng biểu thức nằm trong tập được hỗ trợ.
3. Kiểm tra giới hạn kích thước/chữ số và chế độ hiển thị.
4. Nếu không đủ điều kiện thì xuất giá trị thập phân theo policy.

Ví dụ `sqrt(2)+sqrt(8)` có thể ra `3sqrt(2)` theo tài liệu; không suy ra `sin(x)` được rút gọn symbolic với biến tự do.

### 10.5. Số thập phân tuần hoàn

- Nhập có cấu trúc phần nguyên, phần không lặp và chu kỳ.
- Chuyển sang rational bằng số nguyên chính xác, không qua float.
- Chu kỳ có thể bắt đầu bằng 0, ví dụ chu kỳ `021`; phải giữ đúng độ dài.
- Dùng chia dài có phát hiện remainder để dựng chu kỳ khi đủ điều kiện.
- Giới hạn dạng đầu ra theo tài liệu; không phát chu kỳ dài hàng triệu chữ số.
- S⇔D có vòng chuyển dạng tùy cài đặt Recurring Dec và kiểu đầu vào/kết quả.

## 11. Cài đặt, bộ nhớ, lịch sử và reset

### 11.1. Giá trị mặc định theo hướng dẫn

| Cài đặt | Mặc định |
|---|---|
| Mode | Calculate |
| Input/Output | MathI/MathO |
| Angle Unit | Degree |
| Number Format | Norm 1 |
| Engineer Symbol | Off |
| Fraction Result | d/c |
| Complex | a+bi |
| Statistics Freq | Off |
| Equation/Func complex roots | On |
| Table | f(x),g(x) |
| Recurring Dec | On |
| Decimal Mark | Dot |
| Digit Separator | Off |
| Language | English ở trạng thái khởi đầu theo bảng hướng dẫn |

Có thể chọn tiếng Việt cho lớp hỗ trợ dạy học mà không âm thầm đổi trạng thái chuẩn của máy. Nếu muốn khởi tạo menu máy bằng tiếng Việt trong sản phẩm, ghi đó là preset của host, không gọi là mặc định phần cứng.

### 11.2. Bộ nhớ

- `Ans`, `PreAns`.
- Biến `A`, `B`, `C`, `D`, `E`, `F`, `x`, `y`, `z`.
- `M` cho bộ nhớ độc lập; M+, M−, STO, RECALL theo máy tham chiếu.
- `MatA`–`MatD`, `MatAns`; `VctA`–`VctD`, `VctAns`.
- PreAns chỉ dùng trong Calculate; thay đổi chế độ có quy tắc xóa riêng.
- Kết quả lỗi không ghi đè Ans.
- Số phức trong Ans khi rời Complex có chính sách phần ảo theo hướng dẫn.
- Chỉ báo M hiện khi bộ nhớ độc lập khác 0.
- RECALL phải có màn hình danh sách biến và định dạng theo tài liệu, không chỉ chèn tên biến.

### 11.3. Side effects đặc biệt

- Pol/Rec cập nhật x/y theo tài liệu và khi dùng trong biểu thức chỉ chuyển giá trị đầu theo quy tắc tương ứng.
- Chia dư cập nhật E/F, bao gồm các trường hợp STO ghi đè có thứ tự đặc biệt.
- Table có thể thay đổi biến x; không dùng biến cục bộ mãi rồi bỏ qua side effect.
- Verify cập nhật Ans thành 1/0.
- Distribution List và Variable có quy tắc Ans khác nhau.

Mỗi side effect phải có test riêng, không chỉ test giá trị trên LCD.

### 11.4. Lịch sử

Các mode tài liệu nêu có lịch sử: Calculate, Complex, Base-N, Verify. Việc xóa khi ON, chuyển chế độ, đổi Input/Output hoặc reset phải xác minh trực quan chuỗi phím do text trích xuất có mất hình.

Tách **lịch sử máy** khỏi **key log của lớp dạy học**. Key log có thể dài hơn nhưng không được làm mode chuẩn nhớ thêm những gì máy thật đã xóa.

### 11.5. RESET

Triển khai Setup Data, Memory và Initialize All thành ba thao tác riêng có xác nhận. Setup Data/Initialize All giữ Language và Contrast theo hướng dẫn; phạm vi xóa dữ liệu phải được mô hình hóa và kiểm thử.

OFF không tự reset toàn bộ. AC không được đồng nghĩa với xóa M, biến và tất cả cài đặt. Import snapshot của host là hành động ngoài máy, phải hiển thị rõ.

## 12. Chế độ Calculate và hàm khoa học

### 12.1. Số học và hàm cơ bản

Hỗ trợ cộng/trừ/nhân/chia, ngoặc, nhân ngầm, phân số/hỗn số, phần trăm, lũy thừa/căn, nghịch đảo, trị tuyệt đối, factorial, nPr/nCr, GCD/LCM, Int/Intg, Rnd, Ran#, RanInt#, ký hiệu khoa học và kỹ thuật.

- `Int(-3.5) = -3`; `Intg(-3.5) = -4`.
- Giai thừa có miền số nguyên 0–69 theo bảng hướng dẫn; không mở rộng bằng gamma trong chế độ chuẩn.
- Ran# tạo một trong các mức 0.000–0.999; không thay bằng số thực tùy ý với vô hạn chữ số.
- RanInt# có miền và giới hạn theo hướng dẫn; kiểm tra các điểm a=b, a>b, ngoài miền, không tự mượn quy tắc của Python.
- Rnd tác động giá trị số được dùng tiếp theo Number Format, không chỉ thay chuỗi hiển thị.

### 12.2. Lượng giác, hyperbolic, logarit

- sin/cos/tan và hàm nghịch đảo; sinh/cosh/tanh và nghịch đảo.
- Degree/Radian/Gradian; hậu tố góc theo từng giá trị.
- Các điểm kỳ dị phải được nhận diện theo đơn vị góc và miền máy, không để `tan(90°)` trả một số cực lớn chỉ vì float.
- Log cơ số 10, log cơ số bất kỳ hợp lệ, ln; `10^x`, `e^x`.
- Căn bậc lẻ số âm phải dùng nhánh thực khi phù hợp, không tùy tiện trả số phức.
- Complex không có nghĩa mọi hàm được phép nhận đối số phức: áp dụng registry theo hướng dẫn.

### 12.3. DMS

Mô hình hóa Degree/Minute/Second và dấu của toàn giá trị. Hỗ trợ nhập, cộng/trừ DMS, nhân/chia với số thực và đổi qua lại thập phân theo tài liệu. Test carry giây → phút → độ, giá trị âm và giới hạn hiển thị.

### 12.4. FACT

Phân tích số nguyên dương tối đa 10 chữ số theo hướng dẫn, nhưng phải áp dụng những giới hạn thừa số mà máy thực có. Không trả phân tích toàn bộ bằng thư viện rồi nhận là đúng máy. Phần không phân tích được phải được trình bày theo hành vi tham chiếu.

### 12.5. Chia dư

Kết quả là cặp thương/số dư, có quy tắc sử dụng thương khi phép chia dư là phần của biểu thức lớn. Một số đầu vào chuyển thành chia thông thường theo tài liệu; không thay trực tiếp bằng `divmod` của Python vì dấu và miền có thể khác.

### 12.6. Đa câu lệnh

Lưu danh sách biểu thức và vị trí đang thực hiện. Nhấn bằng lần lượt cho từng kết quả trung gian, có chỉ báo; cập nhật bộ nhớ ở đúng bước. Không tính hết rồi chỉ hiển thị kết quả cuối.

## 13. CALC, SOLVE, tích phân, vi phân, Σ và ∏

### 13.1. CALC

- Có trong Calculate và Complex theo tài liệu.
- Phân tích các biến thực sự cần hỏi từ AST, có thứ tự được xác minh.
- Hiển thị giá trị hiện tại, cho nhập giá trị mới, tính rồi cho thay dữ liệu để lặp lại.
- Hỗ trợ các dạng biểu thức, đa câu lệnh và gán được tài liệu cho phép.
- Giá trị nhập trong prompt tuân theo dạng nhập tuyến tính của luồng CALC.
- AC/thoát không gây mất cài đặt ngoài phạm vi.

### 13.2. SOLVE

Tài liệu nêu SOLVE dùng phương pháp Newton và chỉ có trong Calculate. Có khả năng chọn biến cần giải khi biểu thức có nhiều biến; không hardcode tất cả chỉ giải cho x.

Luồng bắt buộc:

1. Nhập biểu thức/phương trình.
2. Mở SOLVE qua keymap đã xác minh.
3. Hỏi giá trị biến và giá trị khởi đầu.
4. Chọn biến cần giải theo UI tham chiếu.
5. Tính bằng Newton với giới hạn và chính sách hội tụ có kiểm thử.
6. Hiển thị nghiệm thập phân và `L−R`.
7. Nếu chưa hội tụ, hỗ trợ Continue hoặc lỗi tương ứng.
8. Cho phép hủy, chỉnh dữ liệu và giải lại.

Không dùng symbolic solve để trả toàn bộ nghiệm. Không tự chuyển sang Brent/bisection trong profile tương thích nếu chưa ghi khác biệt; phương pháp khác chỉ có thể dùng trong chế độ hỗ trợ ngoài máy, có nhãn rõ.

Kiểm thử trường hợp phụ thuộc điểm khởi đầu, đạo hàm gần 0, không có biến cần giải, không có nghiệm thực, miền hàm bị vi phạm và biểu thức chứa chức năng bị cấm.

### 13.3. Tích phân số

Hướng dẫn nêu phương pháp Gauss–Kronrod. Có thể dùng thuật toán tương đương được xác định rõ và kiểm thử, nhưng phải ghi rằng tham số nội bộ firmware chưa được biết đầy đủ.

- Tol mặc định `10^-5` khi bỏ qua trong dạng nhập tuyến tính.
- Dạng MathI không cung cấp slot tol như LineI.
- Theo tài liệu, tol được chỉ định từ `10^-14` trở lên; xác minh giới hạn đầy đủ.
- Kiểm tra lệnh bị cấm trong f(x), cận và tol.
- Có Time Out, cancel và kiểm thử hàm dao động/gián đoạn.
- Không thay tích phân số bằng nguyên hàm symbolic trong chế độ chuẩn.

### 13.4. Vi phân số

Hướng dẫn nêu xấp xỉ sai phân trung tâm; tol mặc định `10^-10` trong dạng tuyến tính khi bỏ qua. Triển khai numerical differentiation có kiểm soát sai số, điểm không khả vi và timeout. Không gọi SymPy.diff rồi coi đó là hành vi máy chuẩn.

### 13.5. Tổng và tích

- Biến chạy x; các biến còn lại là hằng trong phép tính theo hướng dẫn.
- Bước cố định 1; a/b nguyên và đúng miền.
- Kiểm tra các lệnh lồng bị cấm.
- Có budget và cancel; budget dịch vụ không được giả làm giới hạn phần cứng đã xác minh.
- Không cần cấp phát mảng đầy đủ để tính một tổng dài.

## 14. Hằng số khoa học và chuyển đổi đơn vị

### 14.1. Hằng số

Hướng dẫn có 47 hằng số dựa trên CODATA 2014. Muốn tương thích máy này, không tự thay bằng bộ CODATA mới hơn.

Catalog phải ghi `id`, nhóm menu, ký hiệu, tên, giá trị decimal string, đơn vị, nguồn và trạng thái xác minh. Phân biệt hằng điện tích sơ cấp mang ký hiệu e với số Euler e trong AST.

Các nhóm theo hướng dẫn: Universal, Electromagnetic, Atomic&Nuclear, Physico-Chem, Adopted Values, Other.

Ví dụ đối chiếu: hằng Planck `6.626070040 × 10^-34`, vận tốc ánh sáng `299792458`, gia tốc chuẩn `9.80665`, hằng Celsius `273.15`. Không rút gọn số chữ số hoặc cập nhật âm thầm.

### 14.2. Chuyển đổi đơn vị

Bao phủ toàn bộ cặp lệnh trong các nhóm Length, Area, Volume, Mass, Velocity, Pressure, Energy, Power và Temperature ở trang 85–90.

- Lưu conversion dưới dạng scale hoặc affine transform.
- Nhiệt độ phải dùng phép affine, không chỉ hệ số nhân.
- Các hệ số máy dùng có thể đã làm tròn; không thay bằng hệ số chính xác khác mà không đánh giá tương thích.
- Thêm test cho cả hai chiều và ví dụ tài liệu; không yêu cầu round-trip tuyệt đối nếu catalog máy đã làm tròn.
- Kiểm tra trực quan những chỗ bản trích xuất sai đơn vị; ghi nhận mâu thuẫn nguồn.

Catalog đầy đủ là điều kiện nghiệm thu, không được thay bằng vài đơn vị phổ biến.

## 15. Chế độ Complex

Hỗ trợ nhập `a+bi`, `r∠θ`, phép toán được phép, Conjg, Abs, Arg, ReP, ImP và lệnh ghi đè kiểu kết quả.

- Dùng Angle Unit hiện tại cho nhập/xuất tọa độ cực.
- Chuẩn hóa góc kết quả theo miền của Complex đã xác minh, kiểm tra riêng điểm ±180°.
- Hỗ trợ dạng chính xác trong những trường hợp máy có thể hiển thị.
- Giới hạn hàm nhận số phức theo manual; không tự cho sin(z), log(z) chỉ vì thư viện hỗ trợ.
- Kiểm tra quy tắc lũy thừa số nguyên của số phức và miền số mũ.
- LineI có thể hiển thị các thành phần trên dòng riêng; renderer không được chỉ nối chuỗi tùy tiện.
- Khi rời mode, áp dụng chính sách Ans/phần ảo theo tài liệu.

## 16. Chế độ Base-N

Tài liệu nêu biểu diễn 32-bit và miền decimal `−2147483648` đến `2147483647`.

- DEC, HEX, BIN, OCT; mặc định DEC khi vào mode theo hướng dẫn.
- Token có prefix cơ số riêng d/h/b/o để trộn đầu vào.
- Nhập A–F theo keymap mode, không thành biến toán học.
- Không nhận phân số hoặc ký pháp số mũ ở những vị trí máy cấm.
- Phần thập phân của kết quả chia bị cắt theo hướng dẫn; số âm cần truncate toward zero, không dùng `//` Python một cách mù quáng.
- AND, OR, XOR, XNOR, NOT và NEG; mask 32-bit đúng chỗ.
- Số âm hiển thị dạng bù hai ở cơ số tương ứng.
- Không biến mọi overflow thành wraparound: phân biệt logic theo bit với số học vượt miền, vì tài liệu có Math ERROR khi vượt miền.
- Kiểm thử BIT31, 0, −1, min/max signed integer, nhập sai chữ số và kết quả tràn.

## 17. Chế độ Matrix

Giới hạn theo hướng dẫn: tối đa 4 hàng × 4 cột; MatA–MatD và MatAns.

### 17.1. Luồng UI

Chọn biến → chọn hàng → chọn cột → nhập lần lượt phần tử → màn hình tính → kết quả dạng grid.

Có Define, Edit, copy/STO và quay lại màn hình tính. MatAns xem được nhưng không sửa trực tiếp như biến ma trận thường.

### 17.2. Phép toán

Cộng/trừ, nhân ma trận, nhân vô hướng, determinant, transpose, Identity, inverse, bình phương/lập phương và Abs từng phần tử theo manual.

- Không cho mọi loại phép chia/power tùy ý chỉ vì thư viện hỗ trợ.
- Sử dụng thuật toán ổn định; phân biệt ma trận suy biến và gần suy biến, ghi sai khác số học.
- Kích thước không hợp lệ → Dimension ERROR theo điều kiện tương ứng.
- Undefined matrix không được coi là ma trận 0.
- Kiểm tra stack ma trận theo profile tương thích.
- Copy ma trận phải deep copy để chỉnh MatB không đổi MatA.

## 18. Chế độ Vector

VctA–VctD và VctAns; véc-tơ 2 hoặc 3 chiều.

Hỗ trợ cộng/trừ, nhân vô hướng, dot, cross theo miền được máy cho phép, Abs/norm, Angle và UnitV.

- Không đánh đồng dot và cross.
- Trường hợp cross của véc-tơ 2 chiều phải xác minh dạng kết quả của máy; không tự dùng scalar hoặc dựng chiều z mà không đối chiếu.
- UnitV của véc-tơ 0 và Angle với véc-tơ 0 phải báo lỗi phù hợp.
- Với arccos, xử lý sai số lân cận ±1 thận trọng; không dùng clamp rộng để che dữ liệu sai.
- Tôn trọng đơn vị góc và giới hạn stack.
- VctAns và luồng sao chép có kiểm thử như Matrix.

## 19. Chế độ Statistics

### 19.1. Tám loại

1. Một biến.
2. Tuyến tính `y=a+bx`.
3. Bậc hai `y=a+bx+cx²`.
4. Logarit `y=a+b ln(x)`.
5. Mũ e `y=a e^(bx)`.
6. Mũ ab `y=a b^x`.
7. Lũy thừa `y=a x^b`.
8. Nghịch đảo `y=a+b/x`.

### 19.2. Editor và giới hạn

| Kiểu | Freq Off | Freq On |
|---|---:|---:|
| Một biến | 160 dòng | 80 dòng |
| Hai biến | 80 dòng | 53 dòng |

Có chèn/xóa dòng, Delete All, chuyển ô, vùng nhập biểu thức và màn hình tính thống kê. Số hiển thị trong ô có thể ngắn hơn giá trị lưu; không làm mất độ chính xác lưu vì chỉ hiển thị tối đa sáu chữ số theo hướng dẫn.

Thay đổi mode, chuyển loại một biến/hai biến hoặc đổi Freq có chính sách xóa dữ liệu theo manual. Không tự giữ dữ liệu trái hành vi máy mà không đưa vào lớp hỗ trợ bên ngoài.

### 19.3. Chỉ số

- n, Σx, Σx²; với hai biến có Σy, Σy², Σxy, Σx³, Σx²y, Σx⁴ theo menu.
- Mean, population variance/std và sample variance/std.
- Min/max; Q1, Med, Q3 ở kiểu được hỗ trợ.
- Hệ số hồi quy a/b/c, r khi có, ước lượng x/y và hai nhánh x cho hồi quy bậc hai.
- Các hàm Norm Dist P/Q/R và chuẩn hóa t trong Statistics, tách khỏi Distribution.

### 19.4. Công thức nền tảng

Với tần số fᵢ: `n=Σfᵢ`, `mean=Σ(fᵢxᵢ)/n`, variance tổng thể chia n và variance mẫu chia n−1. Dùng thuật toán ổn định, kiểm tra n đủ lớn; không tạo danh sách lặp hàng tỷ phần tử để xử lý frequency.

Đối với hồi quy biến đổi, dùng đúng phép biến đổi và miền x/y. Không dùng nonlinear curve fitting tùy ý thay cho mô hình máy. Phương pháp tính tứ phân vị và correlation phải được xác minh, vì mặc định thư viện có thể khác.

### 19.5. Tình huống biên

Dữ liệu rỗng, một mẫu, x trùng nhau, variance bằng 0, frequency không hợp lệ, giá trị log không dương, dữ liệu exponential sai miền, inverse có x=0, hồi quy bậc hai suy biến và ước lượng không tồn tại.

Không tự trả NaN trên LCD. Phải chuyển thành lỗi hoặc thông báo đúng ngữ cảnh.

## 20. Chế độ Distribution

Có bảy loại theo hướng dẫn:

| Loại | Đầu vào chính |
|---|---|
| Normal PD | x, σ, μ |
| Normal CD | Lower, Upper, σ, μ |
| Inverse Normal | Area, σ, μ |
| Binomial PD | x, N, p |
| Binomial CD | x, N, p |
| Poisson PD | x, λ |
| Poisson CD | x, λ |

- Normal PD là mật độ, không phải xác suất tại một điểm.
- Normal CD tính khoảng theo đúng quy ước cận.
- Inverse Normal phải xác minh chiều tích lũy; không tự thêm lựa chọn tail không có trên máy.
- Các dạng nhị thức/Poisson có List/Variable theo manual.
- List tối đa 45 mẫu; có editor và kết quả từng dòng.
- σ>0; p trong [0,1]; miền nguyên cho N/x và miền λ theo tài liệu.
- Area=0 hoặc 1 cần xử lý theo hành vi tham chiếu, không tự hiển thị vô cực nếu máy không làm vậy.
- Dữ liệu ngoài miền có thể tạo ERROR từng dòng, khác với lỗi toàn phép tính.
- Theo manual, độ chính xác phân phối lên đến sáu chữ số có nghĩa, nhưng ví dụ có thể hiển thị nhiều chữ số: phân biệt số chữ số hiển thị với mức đảm bảo chính xác.
- Khi sửa dữ liệu, kết quả cũ phải được invalidated theo luồng được mô tả.

## 21. Chế độ Table

- Nhập f(x) hoặc cả f(x), g(x).
- Start, End, Step; mặc định hướng dẫn là 1, 5, 1.
- Tối đa 45 dòng khi một hàm, 30 dòng khi hai hàm.
- Các biến khác x được dùng như hằng tại trạng thái tương ứng.
- Cho sửa x trong bảng và cập nhật f/g cùng dòng.
- Các phím tăng/giảm dựa trên dòng trước và Step cần đối chiếu đúng physical keymap.
- Tạo bảng có side effect lên x theo manual.
- Đổi Input/Output có thể xóa hàm đang nhập theo hướng dẫn.

Tính số dòng bằng arithmetic chính xác khi có thể; không lặp float đến khi sai số vượt End. Kiểm thử Step=0, khoảng không hợp lệ, đúng giới hạn và vượt một dòng. Quy tắc bước âm và ô hàm lỗi phải được đối chiếu, không tự coi mọi trường hợp đều bị cấm hoặc đều được phép.

## 22. Chế độ Equation/Func

### 22.1. Hệ phương trình

Hỗ trợ hệ tuyến tính 2, 3 hoặc 4 ẩn. Có editor hệ số, duyệt nghiệm, lưu nghiệm vào biến và quay lại sửa.

- Phân biệt hệ nghiệm duy nhất, vô nghiệm và vô số nghiệm bằng kiểm tra rank phù hợp.
- Không dùng inverse(A) nhân b làm giải pháp duy nhất.
- Test gần suy biến và hệ số thang đo rất khác nhau.
- Thông báo cuối cùng và thứ tự nghiệm phải theo tham chiếu.

### 22.2. Đa thức

Bậc 2, 3, 4; chế độ cho/không cho nghiệm phức theo SETUP. Có hiển thị các thông tin cực trị của hàm khi máy cung cấp trong luồng tương ứng, không dừng ở danh sách nghiệm.

- Nghiệm bội, căn chính xác khi hỗ trợ, dạng thập phân và thứ tự nghiệm.
- Hệ số đầu bằng 0: xác minh phản ứng của máy; không tự giảm bậc vì thư viện có thể làm được.
- Cài đặt Equation/Func Off không được hiểu thành tự đổi máy sang Complex.
- Đổi loại/bậc có quy tắc xóa hệ số.
- Không bổ sung nghiệm symbolic phức tạp mà LCD máy không thể biểu diễn.

## 23. Chế độ Inequality

Giải đa thức bậc 2–4 với `<`, `≤`, `>`, `≥`.

Mô hình nghiệm là tập khoảng và điểm biên có đóng/mở rõ ràng. Dùng nghiệm thực, bội nghiệm và bảng dấu; không suy ra dấu bằng cách lấy quá ít mẫu tùy tiện.

- Có All Real Numbers và No Solution.
- Kiểm thử nghiệm kép không đổi dấu, nghiệm trùng, khoảng rời nhau và dấu bằng.
- Không cho thay đổi ký pháp kỹ thuật trên màn hình nghiệm nếu máy không hỗ trợ.
- Renderer phải hiển thị quan hệ như trên máy, không chỉ in đối tượng Interval của thư viện.
- Test hệ số đầu âm và bằng 0 theo chính sách đã xác minh.

## 24. Chế độ Verify

Verify kiểm tra giá trị số với giá trị biến hiện tại; không chứng minh đồng nhất thức với mọi biến.

- Hỗ trợ các toán tử quan hệ và chuỗi quan hệ hợp lệ.
- Kiểm tra hạn chế về chiều quan hệ và các tổ hợp bị cấm theo manual.
- True/False cập nhật Ans thành 1/0.
- Có khả năng chuyển vế phải xuống dòng tiếp theo sau một kết quả True trong trường hợp máy hỗ trợ.
- Không dùng epsilon tùy ý như `abs(a-b)<1e-6` cho tất cả phép so sánh; xây policy và test theo số học máy.
- Lỗi miền không biến thành False; giữ phân biệt lỗi phép tính và kết quả phán đoán.

## 25. Chế độ Ratio

Hai mẫu: `A:B=X:D` và `A:B=C:X`.

- Công thức toán học tương ứng: `X=A×D/B` và `X=B×C/A`.
- Manual yêu cầu lỗi Math ERROR khi có hệ số đầu vào 0; không chỉ kiểm tra mẫu số.
- Editor có quy tắc AC đặt hệ số về 1; đổi loại biểu thức có quy tắc riêng về hệ số theo hướng dẫn.
- Hiển thị nghiệm, STO và quay lại editor theo luồng đã xác minh.
- Giới hạn nhập tối đa 10 chữ số mỗi giá trị theo phần Ratio của tài liệu.

## 26. Lỗi, stack và giới hạn

### 26.1. Catalog lỗi

`Math ERROR`, `Stack ERROR`, `Syntax ERROR`, `Argument ERROR`, `Dimension ERROR`, `Variable ERROR`, `Cannot Solve`, `Range ERROR`, `Time Out`.

Mỗi lỗi cần mã nội bộ ổn định, nhãn tương thích, ngữ cảnh, vị trí editor nếu có và hành động phục hồi.

- Trái/phải trên màn hình lỗi đưa về vị trí lỗi khi áp dụng.
- AC trên màn hình lỗi xóa phép nhập lỗi theo hướng dẫn, không xóa toàn bộ bộ nhớ.
- Không hiển thị Python exception, traceback, đường dẫn server hoặc nội dung bí mật cho học viên.
- Lỗi hạ tầng như mất kết nối phải hiển thị ngoài LCD chuẩn, không giả thành Math ERROR.

### 26.2. Stack từ tài liệu

| Loại | Giới hạn nêu trong hướng dẫn |
|---|---:|
| Stack số | 10 mức |
| Stack lệnh | 24 mức |
| Complex | mỗi giá trị chiếm 2 mức stack số |
| Stack ma trận | 3 mức |
| Stack véc-tơ | 5 mức |

Độ sâu AST không bằng mức stack của máy. Cần mô phỏng hoặc phân tích kế hoạch đánh giá để kiểm tra; không dùng `depth > 10` làm thay thế. Các ví dụ stack trong PDF cần xem trực quan và chuyển thành test.

### 26.3. Giới hạn an toàn của dịch vụ

Giới hạn số token, kích thước AST, độ sâu editor, số iteration, thời gian CPU, memory và request rate. Đây là giới hạn vận hành riêng, phải ghi trong cấu hình và báo cáo.

Nếu dịch vụ chặn sớm hơn máy tham chiếu: hiển thị “Tác vụ vượt giới hạn tài nguyên của công cụ” ở lớp host, đánh dấu khác biệt; không lặng lẽ tuyên bố Time Out đó là hành vi chính xác của phần cứng.

## 27. Hợp đồng giữa UI và Python

Các tên bên dưới là API đề xuất nội bộ, không phải API Casio có sẵn.

### 27.1. Engine public interface

- `create_state(profile, initial_settings)` tạo trạng thái hợp lệ.
- `dispatch(state, event)` trả state/effects.
- `evaluate(ast, context, cancellation)` trả kết quả có kiểu và memory patch.
- `render_screen(state)` trả ScreenModel.
- `export_snapshot(state)` và `restore_snapshot(snapshot)` qua validator/migration.
- `get_capabilities()` trả danh sách hỗ trợ thật cùng mức kiểm chứng.

Không expose trực tiếp evaluator không giới hạn cho frontend.

### 27.2. Web transport nếu cần

Endpoint nội bộ đề xuất có namespace riêng của host:

- Tạo/khôi phục phiên máy tính.
- Lấy screen/state snapshot được phép.
- Gửi batch sự kiện có thứ tự.
- Hủy tác vụ active.
- Lấy capabilities và compatibility report.
- Export snapshot theo quyền.

Không bắt buộc dùng đúng đường dẫn hoặc thêm REST nếu desktop gọi engine trực tiếp. Nếu có API, định nghĩa OpenAPI/schema và integration test.

### 27.3. Request envelope

`session_id`, `client_sequence`, `expected_revision`, `event`, `request_id`.

- Server/host tạo hoặc kiểm soát session, không tin session ID của người dùng khác.
- Event allowlist và payload schema chặt.
- Duplicate request không thực hiện M+ hoặc STO lần hai.
- Revision conflict có quy tắc resync, không ghi đè tùy tiện.
- Batch phím phải giữ thứ tự.

### 27.4. Kết quả số trên wire

Số nguyên lớn, rational và decimal truyền dạng string hoặc schema có tử/mẫu string. Không truyền mọi giá trị bằng JSON number vì frontend có thể làm mất độ chính xác.

Result envelope gồm `kind`, `value`, `display_model`, `memory_patch`, `warnings`, `state_revision`. Complex gồm real/imag hoặc kiểu số tương ứng; ma trận có shape và cells; nghiệm có cấu trúc intervals/roots, không chỉ một chuỗi đã format.

### 27.5. Trách nhiệm đồng bộ

Frontend có thể render caret/pressed state ngay, nhưng không tự tính đáp án khác backend. Nếu editor chạy local, schema editor phải dùng chung; backend vẫn validate AST và cài đặt. Có test round-trip payload và test đổi phiên/tabs.

## 28. Tích hợp công cụ dạy học

### 28.1. Interface host đề xuất

- `open`, `close`, `focus`, `resize`.
- `onCalculationCompleted` với kết quả đã được người dùng cho phép chia sẻ.
- `exportExpression`, `exportResult`, `exportKeyLog`.
- `loadSnapshot` từ bài học hoặc bài mẫu có schema được kiểm tra.
- `setTeachingOptions` cho panel hỗ trợ, không âm thầm sửa profile chuẩn.

Các tên là đề xuất của dự án, phải thích ứng convention host.

### 28.2. Nhúng

Ưu tiên component cùng ứng dụng. Chỉ dùng iframe khi cần cô lập và có kế hoạch focus/resize/accessibility.

Nếu dùng iframe/postMessage: allowlist origin, kiểm tra source và message schema; không dùng wildcard để gửi dữ liệu học viên. Nếu WebView: chỉ expose bridge tối thiểu, cấm chạy Python tùy ý từ JavaScript.

### 28.3. Chức năng dạy học mở rộng

- Lịch sử phím có timestamp tương đối và tên phím dễ đọc.
- Phát lại chuỗi phím từ snapshot ban đầu đã biết.
- Pause/step/stop; hủy replay không làm mất quyền điều khiển.
- Highlight phím tiếp theo.
- Phóng to LCD; sao chép biểu thức/kết quả dạng text/LaTeX.
- Giáo viên chèn kết quả vào bài giảng qua hành động chủ động, không tự gửi.

Không lưu key log nhạy cảm hoặc đồng bộ cả lớp theo mặc định. Nếu có hoạt động chia sẻ học viên, thiết kế quyền và sự đồng ý theo host; không tự triển khai publish.

### 28.4. Phân biệt replay và khôi phục

Replay kiểm tra hành vi nhập từ chuỗi phím. Restore snapshot nạp thẳng trạng thái. Một bài mẫu phải ghi nó dùng cách nào; không dùng restore để che keymap sai trong demo.

## 29. Hiệu năng, hủy tác vụ và bảo mật

### 29.1. Ngân sách hiệu năng đề xuất

Đặt môi trường đo trước khi nghiệm thu: thiết bị, trình duyệt, server và kích thước phiên.

- Phản hồi nhấn phím/caret local: mục tiêu p95 dưới 50 ms.
- Tính cơ bản sau khi engine sẵn sàng: mục tiêu p95 dưới 100 ms trên môi trường chuẩn đã ghi.
- Tác vụ dài: busy indicator rõ, có hủy, không khóa UI.
- Mở panel đang có session: không mất dữ liệu và không tải lại toàn bộ engine không cần thiết.

Đây là mục tiêu kỹ thuật của dự án, không phải tốc độ cam kết của Casio.

### 29.2. Cancellation

Chạy tác vụ số nặng trong worker/process có thể dừng. Timeout HTTP không tự dừng vòng lặp CPU; phải có cooperative cancel và/hoặc cơ chế kill process an toàn. Không gọi blocking evaluator trực tiếp trên event loop của API async.

Khi hủy, kết quả đến muộn không được ghi Ans hoặc state. Ghi quy tắc cập nhật bộ nhớ theo transaction để tránh commit nửa chừng.

### 29.3. An toàn input

- Grammar allowlist; không import, attribute access, filesystem, mạng hoặc gọi hàm tùy ý.
- Chặn payload quá lớn, AST sâu, power/factorial ngoài miền và catalog ID giả.
- Validate snapshot; không pickle dữ liệu không tin cậy.
- Sanitize mọi text/LaTeX/HTML hiển thị.
- Không tải dependency runtime từ CDN bắt buộc nếu sản phẩm yêu cầu offline.
- Auth/CSRF/CORS theo host; kiểm thử truy cập chéo phiên.
- Log không chứa token đăng nhập, dữ liệu cá nhân hoặc toàn bộ bài học mặc định.

### 29.4. Offline

Nếu web dùng Python server từ xa thì không được quảng cáo hoạt động offline. Chỉ tuyên bố offline khi đã có cách chạy engine local, đóng gói tài nguyên và test mất mạng. Pyodide hoặc phương án Python-in-browser là nhánh kiến trúc cần PoC dependency/kích thước riêng, không phải mặc định miễn phí.

## 30. Chiến lược kiểm thử

### 30.1. Năm tầng

1. Unit cho parser, số học, policy, formatter, editor và reducer.
2. Mode integration cho menu → nhập dữ liệu → tính → side effect.
3. Golden test từ ví dụ hướng dẫn.
4. E2E chuỗi phím và screenshot trên các viewport.
5. Differential test với máy thật khi có điều kiện.

Test UI không thay test số; test số trực tiếp không chứng minh phím ảo hoạt động đúng.

### 30.2. Golden fixture

Mỗi case có `id`, source/page, profile, trạng thái đầu, settings, chuỗi physical key hoặc semantic action được ghi rõ, dữ liệu nhập, expected value, expected display, expected memory, expected error, tolerance và bằng chứng.

Không bịa `physical_keys` khi chưa có ảnh đối chiếu. Có thể viết test semantic trước, nhưng phải đánh dấu chưa kiểm chứng keymap.

### 30.3. So sánh kết quả

- Exact rational/integer: so sánh chính xác.
- Giá trị số: absolute/relative tolerance riêng theo chức năng và độ chính xác tài liệu.
- Display: so sánh representation và chuỗi/ScreenModel; không dùng tolerance thay cho hiển thị sai.
- Solver: kiểm tra nghiệm, residual, biến được chọn và quy tắc phụ thuộc điểm khởi đầu.
- Nghiệm đa thức: kiểm tra tập nghiệm và thứ tự hiển thị riêng.
- Random: kiểm tra miền/lưới giá trị, dùng seed riêng cho test phần mềm; không khẳng định cùng RNG với máy thật.

### 30.4. Bộ ca nền tảng bắt buộc

Các kết quả sau là kỳ vọng toán học hoặc ví dụ hướng dẫn; định dạng LCD/chuỗi phím chính xác vẫn phải đối chiếu theo profile.

| ID | Ca kiểm thử | Kỳ vọng chính |
|---|---|---|
| AR-01 | 7×8−4×5 | 36 |
| AR-02 | −2² | −4 |
| AR-03 | (−2)² | 4 |
| AR-04 | 6÷2(1+2) | 1 theo ví dụ nhóm nhân ngầm |
| AR-05 | 4π÷2π | 2 theo ví dụ tài liệu |
| FR-01 | 2/3+1/2 | 7/6 |
| FR-02 | 3 1/4 + 1 2/3 | 4 11/12 khi chọn hỗn số |
| FR-03 | 1/0 | Math ERROR |
| RD-01 | 0.(3) | 1/3 khi chuyển dạng hợp lệ |
| RD-02 | 1.(021) | giữ đúng chu kỳ có số 0 đầu |
| PC-01 | 150×20% | 30 |
| DM-01 | 2°20′30″ + 0°39′30″ | 3°00′00″ |
| TG-01 | sin(30), DEG | 1/2 trong định dạng phù hợp |
| TG-02 | sin(π/2), RAD | 1 |
| TG-03 | sin⁻¹(0.5), DEG | 30 |
| TG-04 | tan(90), DEG | lỗi miền theo policy tham chiếu |
| LG-01 | log base 2 of 16 | 4 |
| LG-02 | ln(e) | 1 |
| EX-01 | √2+√8 | 3√2 nếu đủ điều kiện |
| EX-02 | căn bậc ba của −27 | −3 |
| IN-01 | Int(−3.5), Intg(−3.5) | −3 và −4 |
| FC-01 | 0!, 5! | 1 và 120 |
| FC-02 | 70! | vượt miền factorial máy |
| CO-01 | 10 nPr 4, 10 nCr 4 | 5040 và 210 |
| GC-01 | GCD(28,35), LCM(9,15) | 7 và 45 |
| RN-01 | Rnd(10/3)×3, Fix 3 | 9.999 |
| RN-02 | 10/3×3, Fix 3 | hiển thị 10.000 theo ví dụ policy |
| QR-01 | 5 ÷R 2 | thương 2, dư 1; E/F đúng |
| CP-01 | Pol(√2,√2), DEG | r=2, góc=45; x/y đúng |
| CP-02 | Rec(2,30), DEG | x=√3, y=1 trong dạng phù hợp |
| CA-01 | CALC 3A+B với A=5,B=10 | 25 |
| SO-01 | SOLVE x²−2, khởi đầu 1 | nghiệm dương gần √2 và residual nhỏ |
| SO-02 | SOLVE không có biến | Variable ERROR theo điều kiện |
| IT-01 | tích phân sin(x), 0→π, RAD | gần 2 |
| DF-01 | d/dx của 3x²−5x+2 tại 2 | gần 7 |
| SU-01 | Σ(x+1,1,5) | 20 |
| PR-01 | ∏(x+1,1,5) | 720 |
| CX-01 | (1+i)(1−i) | 2 |
| CX-02 | Conjg(2+3i) | 2−3i |
| CX-03 | Abs(3+4i) | 5 |
| BN-01 | HEX 1F+1 | HEX 20 |
| BN-02 | BIN 1010 and 1100 | BIN 1000 |
| BN-03 | signed max + 1 | overflow theo policy máy, không tự wrap |
| MX-01 | det([[1,2],[3,4]]) | −2 |
| MX-02 | [[1,2],[3,4]]×Identity(2) | giữ ma trận |
| MX-03 | inverse ma trận suy biến | lỗi phù hợp |
| VC-01 | (1,2) dot (3,4) | 11 |
| VC-02 | Abs((2,−1,2)) | 3 |
| VC-03 | UnitV véc-tơ 0 | lỗi phù hợp |
| ST-01 | dữ liệu 1,2,3 | mean=2; population variance=2/3; sample variance=1 |
| ST-02 | x=1,2,3; y=3,5,7 | hồi quy tuyến tính a=1,b=2,r=1 |
| DS-01 | Normal PD x=36,σ=2,μ=35 | gần 0.1760326634 theo ví dụ |
| DS-02 | Binomial PD x=1,N=2,p=0.5 | 0.5 |
| DS-03 | Poisson PD x=0,λ=1 | gần e⁻¹ |
| TB-01 | f=x², start=−1,end=1,step=.5 | 5 dòng, giá trị đúng |
| TB-02 | một hàm 46 dòng | Range ERROR |
| EQ-01 | x²−5x+6=0 | nghiệm 2,3; thứ tự kiểm riêng |
| EQ-02 | x²+1=0, complex On | ±i theo hiển thị phù hợp |
| IQ-01 | x²+2x−3<0 | −3<x<1 |
| IQ-02 | x²≥0 | All Real Numbers |
| IQ-03 | x²<0 | No Solution |
| VF-01 | 3<π<4 | True; Ans=1 |
| VF-02 | 5≤6≥4 | Syntax ERROR theo hạn chế chuỗi |
| RT-01 | 1:2=X:10 | X=5 |
| RT-02 | 1:2=10:X | X=20 |
| RT-03 | hệ số đầu vào bằng 0 | Math ERROR theo manual |
| CV-01 | 100 °C → °F | 212 |
| FM-01 | 1/200, Norm 1 rồi Norm 2 | dạng mũ rồi 0.005 |
| MM-01 | phép tính thành công rồi lỗi | Ans cũ không bị ghi đè bởi lỗi |
| RS-01 | Memory reset | xóa đúng bộ nhớ, không reset ngoài phạm vi |

Bộ ca này chỉ là nền tảng, không đủ để chứng nhận toàn bộ máy. Phải bổ sung tất cả ví dụ tài liệu, ca miền biên, menu, side effect và trường hợp lỗi của từng chức năng.

### 30.5. Kiểm thử editor và UI

- Tab/focus và keyboard không ảnh hưởng host.
- Từng phím bấm có action đúng trong primary/SHIFT/ALPHA/mode override.
- Nhấn nhanh, repeat, pointercancel và hai pointer đồng thời.
- Caret đi qua mọi slot mẫu; xóa/undo/import không hỏng cây.
- Menu dài cuộn và quay lại; không kẹt trong submenu.
- Snapshot ở desktop, tablet và mobile; không mất nhãn hoặc đè phím.
- Screen reader đọc được hàm và nhãn phím cơ bản.
- Tính dài có thể hủy; kết quả cũ không ghi đè.
- Hai máy tính nhúng hoặc hai người dùng không chia sẻ M/Ans ngoài ý muốn.

### 30.6. Property và metamorphic tests

Dùng có giới hạn miền: cộng/trừ rational, transpose hai lần, A×I=A, dot đối xứng, normalize véc-tơ khác 0, conversion round-trip trong tolerance catalog. Không áp dụng các đẳng thức số học như tuyệt đối đúng cho float có giới hạn hoặc biểu thức qua Rnd.

## 31. Lộ trình thực hiện: từ giao diện đến đầy đủ chức năng

Mỗi giai đoạn kết thúc bằng một bản chạy được và báo cáo ngắn. Không đưa dự báo thời gian cố định khi chưa khảo sát codebase và nguồn kiểm thử.

### Giai đoạn 0 — Khảo sát và đóng băng đặc tả nguồn

**Đầu ra:** discovery report, lựa chọn adapter, feature matrix sơ bộ, nguồn PDF/HTML, kế hoạch keymap và danh sách điểm chưa xác minh.

**Nghiệm thu:** không thay đổi framework ngoài phạm vi; xác định được lệnh chạy app hiện có; có test baseline trước khi thêm module.

### Giai đoạn 1 — Vỏ máy, LCD và bàn phím

**Đầu ra:** responsive calculator shell, LCD renderer, key components, pressed/focus states, panel dạy học và keymap nháp.

**Nghiệm thu:** không dùng ảnh nguyên máy để giả UI; mọi phím có ID; không bấm trùng; có nhãn mock; screenshot các viewport. Đối chiếu geometry/nhãn trước khi đánh dấu fidelity đạt.

### Giai đoạn 2 — State machine và menu

**Đầu ra:** đủ 12 chế độ trong menu, SETUP, OPTN có cấu trúc theo context, bật/tắt, modifier và menu stack.

**Nghiệm thu:** có thể đi vào/quay ra mọi màn hình; mode chưa có engine hiển thị “chưa triển khai” ở môi trường phát triển thay vì đáp án giả. Không release chức năng giả cho học viên.

### Giai đoạn 3 — Editor và Calculate cơ bản

**Đầu ra:** số, phép toán, ngoặc, phân số, căn, power, con trỏ, DEL/AC, parser, rational, formatter, lỗi cơ bản.

**Nghiệm thu:** vượt ca ưu tiên, phân số và editor; không dùng eval; đường UI→engine→LCD chạy thật.

### Giai đoạn 4 — Máy tính khoa học và trạng thái

**Đầu ra:** hàm khoa học, DMS, ENG, phần trăm, tuần hoàn, FACT, chia dư, hằng số, conversions, bộ nhớ, lịch sử, reset và định dạng.

**Nghiệm thu:** đầy đủ catalog đã đối chiếu; bộ nhớ có test side effects; không dùng kết quả thư viện vượt khả năng hiển thị máy.

### Giai đoạn 5 — CALC/SOLVE và phép tính số

**Đầu ra:** CALC, chọn biến SOLVE, Newton/Continue, tích phân, vi phân, Σ, ∏, worker và cancel.

**Nghiệm thu:** không treo UI; không tính symbolic thay số; hủy không commit Ans; kiểm tra tol, miền và lệnh bị cấm.

### Giai đoạn 6 — Complex và Base-N

**Đầu ra:** UI/function đầy đủ, policy complex và signed 32-bit.

**Nghiệm thu:** bitwise/overflow đúng policy, phase/angle và hàm phức được giới hạn theo manual.

### Giai đoạn 7 — Matrix và Vector

**Đầu ra:** grid editor, biến/Ans riêng, copy, tất cả phép toán được tài liệu mô tả.

**Nghiệm thu:** giới hạn kích thước/stack, Dimension ERROR và memory isolation; không chỉ có API mà thiếu editor.

### Giai đoạn 8 — Statistics và Distribution

**Đầu ra:** tám kiểu thống kê, bảy kiểu phân phối, editor/Freq, hồi quy/ước lượng, P/Q/R/t, List/Variable.

**Nghiệm thu:** đúng giới hạn dòng, cách xóa dữ liệu, miền và sai số; từng nhánh menu đều có test.

### Giai đoạn 9 — Table, Equation, Inequality, Verify và Ratio

**Đầu ra:** mọi editor, nghiệm/khoảng, cực trị được hỗ trợ, chuỗi quan hệ và tỷ lệ.

**Nghiệm thu:** không bỏ phần hiển thị/hành vi phụ của Equation/Func; kiểm tra nghiệm bội và điều kiện zero trong Ratio.

### Giai đoạn 10 — Tích hợp và chứng nhận phạm vi

**Đầu ra:** host adapter hoàn chỉnh, packaging, tài liệu chạy, báo cáo test, accessibility, bảo mật và compatibility report.

**Nghiệm thu:** không còn mục scope cốt lõi chưa triển khai nếu định phát hành nhãn “đầy đủ theo tài liệu”; những mục chưa xác minh thiết bị phải nêu rõ. Bản trung gian vẫn có thể phát hành với nhãn phạm vi cụ thể.

## 32. Quy tắc làm việc với Antigravity

### 32.1. Trước mỗi thay đổi

- Đọc module liên quan và test hiện có.
- Xác định source section và test nào chứng minh hành vi.
- Nêu file dự kiến thay đổi; hạn chế sửa file không liên quan.
- Xử lý dữ liệu thiếu bằng mục cần xác minh, không hardcode giả.

### 32.2. Trong khi triển khai

- Commit hoặc checkpoint từng phần nhỏ theo workflow dự án.
- Giữ type annotations và ranh giới module rõ.
- Viết regression test trước/sau khi sửa lỗi hành vi.
- Không thêm TODO thay cho tính năng rồi báo hoàn tất.
- Không bỏ kiểm thử thất bại hoặc nới tolerance chỉ để CI xanh.
- Chỉ cập nhật screenshot baseline sau khi đã xem thay đổi.
- Không nâng dependency hoặc xóa dữ liệu ngoài phạm vi mà không có lý do và chấp thuận phù hợp.

### 32.3. Báo cáo sau mỗi mốc

Báo rõ: đã làm, file thay đổi, cách chạy, test đã chạy, kết quả thực tế, test chưa chạy và lý do, chức năng còn thiếu, mức đối chiếu nguồn và bước kế tiếp.

Nếu môi trường không chạy được test, ghi “chưa chạy được”; không ghi “passed” dựa vào đọc code. Nếu không có máy thật, không ghi `reference_device_checked`.

### 32.4. Tác vụ đầu tiên cụ thể

Antigravity phải bắt đầu bằng:

1. Khảo sát repository và tạo discovery report.
2. Chọn cách nhúng phù hợp, không ép framework mới.
3. Tạo feature matrix bao phủ đủ 12 chế độ và các nhóm dùng chung.
4. Tạo keymap có nguồn; đối chiếu trực quan trước khi khóa geometry.
5. Xây shell/LCD/keypad responsive.
6. Xây state machine và menu với trạng thái mock được ghi nhãn.
7. Tạo test cho sự kiện phím, focus và điều hướng.
8. Chỉ sau đó triển khai lát cắt Calculate thật với phân số, ưu tiên và editor.

Không bắt đầu bằng một script Python duy nhất có hàng trăm `if` và một ô nhập chuỗi; kiến trúc đó không đáp ứng yêu cầu thao tác phím, editor hai chiều và tích hợp lâu dài.

## 33. Definition of Done

### 33.1. Giao diện

- [ ] Vỏ máy/bàn phím đối chiếu đúng mẫu; keymap có nguồn xác minh.
- [ ] Mọi phím có hành vi hoặc quy tắc vô hiệu đúng context.
- [ ] Modifier, menu, editor, grid, lỗi và màn hình nghiệm đầy đủ.
- [ ] Giao diện responsive, focus và touch dùng được trong host.
- [ ] Không còn mock bị trình bày như kết quả thật.

### 33.2. Chức năng

- [ ] Calculate và toàn bộ nhóm hàm dùng chung.
- [ ] CALC, SOLVE và phép tính số.
- [ ] Complex và Base-N.
- [ ] Matrix và Vector.
- [ ] Statistics và Distribution.
- [ ] Table và Equation/Func, gồm thông tin cực trị được hỗ trợ.
- [ ] Inequality, Verify và Ratio.
- [ ] Hằng số/đơn vị đầy đủ; cài đặt/bộ nhớ/lịch sử/reset đầy đủ.
- [ ] Giới hạn miền, stack, lỗi và formatting có policy và test.

### 33.3. Chất lượng và tích hợp

- [ ] Lõi Python kiểm thử độc lập với UI.
- [ ] Không dùng eval/exec hoặc parser có thể thực thi input.
- [ ] Session isolation, validation snapshot, giới hạn tài nguyên và cancel hoạt động.
- [ ] Mọi feature thuộc scope có ít nhất ca bình thường, biên/lỗi phù hợp và đường UI kiểm chứng.
- [ ] Có golden fixtures, test report và known differences.
- [ ] Có tài liệu dependency/license và cách chạy tái lập.
- [ ] Không hứa offline hoặc tương thích tuyệt đối nếu chưa kiểm chứng.

### 33.4. Cách đặt nhãn phát hành

- **UI prototype:** chỉ dùng kiểm tra thiết kế, không phục vụ tính toán học tập.
- **Functional alpha:** nêu rõ các mode đang hỗ trợ và phần thiếu.
- **Manual-covered release:** mọi chức năng trong phạm vi tài liệu đã triển khai, có test theo nguồn và báo cáo các điểm còn chưa kiểm chứng.
- **Device-verified scope:** chỉ áp dụng cho các chức năng/ca đã đối chiếu máy tham chiếu, không tự mở rộng thành chứng nhận mọi trường hợp.

## 34. Hồ sơ bàn giao

| Hồ sơ | Nội dung bắt buộc |
|---|---|
| README | Cài đặt, chạy dev/production, lệnh test, yêu cầu môi trường |
| Integration discovery | Nền tảng host, adapter đã chọn, quyết định và ràng buộc |
| Architecture | Các lớp, state flow, editor/AST, worker và storage |
| Feature matrix | Từng chức năng, nguồn, triển khai, test và mức xác minh |
| Keymap/menu specification | Từng phím, nhãn, context, menu path và bằng chứng |
| Numeric compatibility | Miền, precision, rounding, exact output, stack và khác biệt |
| Testing guide | Fixtures, tolerance, golden, E2E và cách bổ sung case |
| Compatibility report | Đã hỗ trợ gì, đã đối chiếu gì, chỗ thiếu/sai và giới hạn |
| Host integration guide | Interface, focus, session, import/export và lỗi hạ tầng |
| Security/dependency notes | Input handling, isolation, license và đóng gói |

## 35. Bảng tổng kết triển khai

| Thứ tự | Hạng mục | Điều kiện để chuyển bước |
|---:|---|---|
| 1 | Khảo sát host và nguồn | Có discovery, source map và kế hoạch tích hợp |
| 2 | Giao diện từ vỏ đến LCD/phím | Dùng được trên các viewport; keymap có bằng chứng |
| 3 | State machine và editor | Điều hướng, modifier, caret và serialization ổn định |
| 4 | Lõi Python và Calculate | Parser an toàn, ưu tiên/format/bộ nhớ có test |
| 5 | Các chức năng số và chế độ chuyên biệt | Đủ chức năng lẫn UI, giới hạn và lỗi từng mode |
| 6 | Tích hợp, kiểm thử và báo cáo | Chạy tái lập, không mock ẩn, công bố đúng phạm vi |

**Nguyên tắc cuối:** “đầy đủ” được chứng minh bằng bảng chức năng có nguồn, đường thao tác có thể thực hiện, kết quả đúng, side effect đúng và bộ kiểm thử tái lập — không bằng số lượng nút trên giao diện hoặc số hàm mà một thư viện toán có thể tính.