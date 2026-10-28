# DuHocHaNoi — Website du học & làm việc quốc tế

Repository: `seokillseo-byte/xkld`

## Trạng thái hiện tại

Đây là **bản nền giao diện public tĩnh**, chưa phải hệ thống CMS và chưa sẵn sàng nhận dữ liệu khách hàng thật.

### Các trang đã có
- `/` — trang chủ, định hướng du học và làm việc quốc tế.
- `/du-hoc/` — lộ trình và checklist chuẩn bị du học.
- `/xuat-khau-lao-dong/` — tìm hiểu chương trình làm việc ở nước ngoài và checklist an toàn.
- `/quoc-gia/` — danh mục điểm đến.
- `/quoc-gia/nhat-ban/` — trang thông tin khởi tạo về Nhật Bản.
- `/cam-nang/` — thư viện chủ đề kiến thức.
- `/lien-he/` — form demo, hiện không gửi hoặc lưu dữ liệu.
- `/chinh-sach/quyen-rieng-tu/` và `/chinh-sach/dieu-khoan/` — khung nội dung chính sách cần rà soát pháp lý.

### Nền tảng giao diện
- CSS và JavaScript dùng chung tại `assets/css/site.css` và `assets/js/site.js`.
- Thiết kế responsive, điều hướng mobile, thẻ nội dung, FAQ/CTA và form kiểm tra dữ liệu cơ bản.
- Có metadata title/description và robots directive cơ bản.
- `robots.txt` cho phép crawler truy cập; chưa khai báo sitemap vì domain production chưa được xác nhận.

## Chạy thử

Có thể mở `index.html` trực tiếp để xem phần lớn giao diện. Để kiểm tra chính xác các đường dẫn bắt đầu bằng `/`, hãy chạy một static web server ở thư mục gốc hoặc bật GitHub Pages cho nhánh/thư mục phù hợp. Chưa cấu hình deploy trong thay đổi này.

## Những điều chưa được xác minh — không đưa lên production
- Domain chính thức; canonical, sitemap và Open Graph URL cần được cấu hình sau khi xác nhận domain.
- Tên pháp nhân, giấy phép/phạm vi hoạt động, địa chỉ, hotline, email, giờ làm việc và thông tin đối tác.
- Nội dung chương trình, chỉ tiêu, điều kiện, chi phí, lương, thời hạn và mọi tuyên bố về kết quả.
- Các trang chính sách pháp lý hoàn chỉnh.
- Form tư vấn chưa có backend, consent logging, chống spam, lưu trữ an toàn hay tích hợp CRM.
- Chưa có CMS, xác thực/phân quyền, cơ sở dữ liệu, kiểm thử tự động hoặc pipeline CI.

## Lộ trình triển khai

Xem [CMS-ROADMAP.md](CMS-ROADMAP.md) và [CONTENT-QUALITY-CHECKLIST.md](CONTENT-QUALITY-CHECKLIST.md).

Thứ tự khuyến nghị: chốt public UI và nội dung thật → chốt domain/SEO kỹ thuật → thiết kế CMS schema/auth/RBAC/audit log → CRUD và workflow biên tập → lead inbox/CRM → security, accessibility, performance và CI.
