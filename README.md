# DuHocHaNoi — Website du học & làm việc quốc tế

Bản giao diện khởi đầu cho thương hiệu **DuHocHaNoi**, nằm trong repository `seokillseo-byte/xkld`.

## Đã có trong bản giao diện

- Landing page responsive, ưu tiên mobile.
- Điều hướng đến Du học, Làm việc quốc tế, Quốc gia, Lộ trình, Cẩm nang và Liên hệ.
- Thẻ chương trình và bộ lọc Du học / Làm việc quốc tế.
- Khu vực quốc gia, quy trình tư vấn, yếu tố tin cậy, cảnh báo an toàn, bài viết mẫu, FAQ.
- Form tư vấn có kiểm tra trường bắt buộc và định dạng điện thoại cơ bản.
- Metadata SEO cơ bản, canonical/OG, JSON-LD Organization, cấu trúc heading, liên kết nội bộ.
- Lưu ý rõ form hiện là demo và **không gửi/lưu dữ liệu**.

## Xem trước

GitHub Pages có thể được bật trong Settings → Pages sau khi chọn nhánh và thư mục xuất bản phù hợp. Đây hiện là website tĩnh trong `index.html`, chưa có backend/CMS.

## Việc bắt buộc trước khi đưa vào vận hành

1. Thay hotline, email, địa chỉ, tên pháp nhân, thông tin giấy phép và domain bằng dữ liệu đã xác minh.
2. Xác nhận domain chính thức rồi cập nhật canonical, Open Graph, sitemap và Search Console.
3. Xây dựng các trang chính sách quyền riêng tư, điều khoản dịch vụ, chính sách cookie và cơ chế đồng ý xử lý dữ liệu phù hợp.
4. Kết nối form tới API/CRM có xác thực, chống spam, rate limit, kiểm soát truy cập, lưu trữ an toàn và thời hạn xóa dữ liệu.
5. Thay nội dung/ảnh mẫu bằng thông tin và hình ảnh có quyền sử dụng; rà soát tính chính xác, nguồn và ngày cập nhật của mọi nội dung về visa, tuyển sinh, chi phí, việc làm và pháp luật.
6. Không công bố lời hứa chắc chắn đậu visa, chắc chắn có việc hoặc thu nhập nếu không có căn cứ được xác minh.

## Định hướng phát triển thành CMS chuyên ngành

Xem `CMS-ROADMAP.md` để biết các module đề xuất. Không nên coi website tĩnh này là CMS hoàn chỉnh: chưa có đăng nhập quản trị, cơ sở dữ liệu, quản lý chương trình, workflow biên tập, CRM, upload media hay API.

## SEO và chất lượng

- Tạo trang riêng cho từng quốc gia, chương trình, ngành nghề, trường/đối tác đã xác minh và nhóm câu hỏi có nhu cầu tìm kiếm thực.
- Mỗi trang cần title/description duy nhất, canonical chính xác, breadcrumb, internal links, ảnh tối ưu, nguồn tham khảo và ngày cập nhật.
- Thêm sitemap.xml, robots.txt, Search Console, analytics có cấu hình quyền riêng tư.
- Structured data phải phản ánh nội dung thực sự hiển thị; không thêm đánh giá, giá, tổ chức/giấy phép hoặc dữ liệu giả.
- Đo Core Web Vitals, khả năng truy cập bàn phím, tương phản, nhãn biểu mẫu và trải nghiệm trên thiết bị di động.
