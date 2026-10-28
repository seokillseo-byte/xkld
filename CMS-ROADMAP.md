# DuHocHaNoi CMS — Product & SEO Roadmap

## Mục tiêu

Xây dựng website/CMS chuyên ngành cho hai nhóm nhu cầu có hành trình khác nhau: (1) du học; (2) làm việc ở nước ngoài/xuất khẩu lao động. CMS phải hỗ trợ SEO có cấu trúc, nội dung đáng tin cậy, quản lý chương trình và chuyển đổi khách hàng tiềm năng — không chỉ là trình soạn thảo bài viết.

## P0 — Nền tảng an toàn và thông tin doanh nghiệp

- Xác minh pháp nhân, giấy phép/phạm vi dịch vụ, địa chỉ, hotline, email, đội ngũ chuyên môn và đối tác.
- Trang giới thiệu, liên hệ, quy trình dịch vụ, FAQ, chính sách quyền riêng tư, điều khoản, cookie và khiếu nại.
- Phân quyền tối thiểu: Admin, SEO Manager, Editor, Reviewer, Consultant, Read-only.
- Audit log cho thay đổi nội dung quan trọng; sao lưu và khôi phục; quản lý secrets bằng environment variables.
- Lead form: validation phía client và server, rate limiting, chống spam, consent record, phân quyền xem lead, retention/deletion policy.
- Không thu thập hộ chiếu, hồ sơ tài chính hoặc dữ liệu nhạy cảm trong form đầu phễu nếu chưa có nhu cầu và cơ chế bảo vệ phù hợp.

## P1 — CMS nội dung và cấu trúc chuyên ngành

### Content types
- Pages: trang tĩnh, landing page, trang dịch vụ.
- Articles: bài hướng dẫn, tin chính sách, checklist, so sánh.
- Countries: tổng quan điểm đến, ngôn ngữ, điều kiện, chi phí tham khảo, nguồn chính thức, ngày rà soát.
- Study programs: trường/đơn vị tiếp nhận, cấp học, ngành, điều kiện đầu vào, ngôn ngữ, học phí, kỳ nhập học, deadline, hồ sơ, nguồn.
- Work programs / job orders: quốc gia, ngành nghề, mô tả công việc, yêu cầu, hợp đồng, lương/khấu trừ, giờ làm, phí hợp pháp, điều kiện, đơn vị tuyển dụng và nguồn xác minh.
- Partners / institutions: thông tin pháp nhân, phạm vi hợp tác, nguồn xác thực, trạng thái duyệt.
- FAQs, testimonials (chỉ có đồng ý và xác thực), authors, categories, tags, media, redirects.

### Trường dữ liệu dùng chung
- Slug duy nhất; title; meta description; H1; excerpt; body; featured image + alt; author/reviewer; status; created/updated/published_at; last_verified_at; references/sources; related entities; canonical; indexability; social metadata.
- Workflow: Draft → In review → Approved → Scheduled/Published → Needs update → Archived.
- Version history, preview trước xuất bản, lịch xuất bản, người chịu trách nhiệm cập nhật.

## P2 — SEO kỹ thuật và biên tập

- SSR/SSG hoặc HTML render được crawl; URL ổn định, chuẩn hóa trailing slash, redirect 301 và 404/410 đúng.
- XML sitemap tự sinh chỉ gồm URL canonical, indexable, published; robots.txt; canonical; meta robots; Open Graph.
- Breadcrumb và internal-link suggestions; taxonomy có kiểm soát; tránh trang tag mỏng và faceted URL gây trùng lặp.
- Structured data phù hợp với nội dung thực tế (Organization, Article/BlogPosting, BreadcrumbList, Event/Course nếu đủ điều kiện). Không hứa rich result; không gắn dữ liệu giả.
- Quản lý ảnh: WebP/AVIF, responsive sizes, lazy loading dưới màn hình đầu, width/height, alt text có ý nghĩa.
- Redirect manager, broken-link checks, orphan page reports, duplicate title/meta, missing H1, canonical mismatch, sitemap diagnostics.
- Search Console, analytics và consent-aware tracking; dashboard organic landing pages, lead conversion, query clusters.
- Hỗ trợ hreflang chỉ khi có bản dịch thực sự tương ứng; không tạo bản dịch tự động kém chất lượng để mở rộng URL.

## P3 — Quản lý lead và vận hành tư vấn

- Inbox lead với nguồn/landing page/UTM, nhu cầu, quốc gia, trạng thái, người phụ trách, lịch sử liên hệ và ghi chú.
- Pipeline có thể cấu hình, nhắc việc, phân công, xuất dữ liệu có quyền hạn và audit log.
- Tích hợp email/SMS/Zalo/CRM qua adapter, có retry, idempotency, webhook signature và log lỗi.
- Không gửi tin nhắn hàng loạt hoặc chia sẻ dữ liệu lead ngoài mục đích đã thông báo.

## P4 — Phân tích và tối ưu

- Báo cáo theo landing page, quốc gia, loại chương trình, nguồn traffic, conversion rate và chất lượng lead.
- A/B testing có kiểm soát; không che nội dung chính với crawler hoặc tạo trang doorway.
- Page performance budget, accessibility checks, security scanning, unit/integration/e2e tests và CI.

## Kiến trúc triển khai gợi ý

- Frontend public: framework hỗ trợ SSR/SSG để HTML nội dung có thể crawl.
- Admin CMS: ứng dụng riêng hoặc route bảo vệ, RBAC, MFA cho vai trò quản trị.
- API/service layer: validation server-side, authorization ở từng tài nguyên, rate limits, audit logs.
- PostgreSQL cho dữ liệu quan hệ; object storage cho media; cache chỉ khi cần.
- Queue cho email, webhook, import/export và tác vụ nền; không để request người dùng phụ thuộc tác vụ dài.
- Environments riêng dev/staging/production; migration có kiểm soát; secrets không commit; backup/restore được kiểm thử.

## Definition of Done cho từng module

- Có schema và migration; API contract được ghi lại; phân quyền server-side; validation và xử lý lỗi.
- Có test cho luồng thành công, lỗi, quyền truy cập và dữ liệu biên.
- Có trạng thái loading/empty/error trong UI, accessibility cơ bản, responsive.
- Có tài liệu cấu hình, dữ liệu mẫu được gắn nhãn rõ và không dùng số liệu/đánh giá giả làm bằng chứng.
- CI chạy qua mà không nới lỏng hoặc xóa test để làm xanh.

## Gợi ý thứ tự triển khai

1. Audit repository và xác nhận stack hiện có.
2. Hoàn thiện UI public và design system.
3. Thiết kế schema CMS + auth/RBAC + audit logs.
4. CRUD nội dung và workflow biên tập.
5. Country/program pages, SEO metadata, redirects, sitemap.
6. Lead capture có consent + inbox CRM.
7. Analytics, monitoring, security review, accessibility/performance.
8. Import nội dung thật, QA pháp lý và SEO trước khi phát hành.


## Trạng thái triển khai — 2026-10-28

### Public UI foundation (đang hoàn thiện)
- Đã tách CSS/JavaScript dùng chung để các trang public sử dụng nhất quán.
- Đã tạo các trang tĩnh: trang chủ, du học, làm việc quốc tế, danh mục quốc gia, Nhật Bản, cẩm nang, liên hệ và hai khung chính sách.
- Form vẫn là demo; không gửi/lưu lead. Không có backend/CMS ở giai đoạn này.
- Đã loại bỏ canonical và Organization JSON-LD dùng domain chưa được xác minh. Chỉ thêm lại sau khi chốt domain và xác minh thông tin pháp nhân.
- Chưa thêm sitemap XML vì cần domain canonical thật.

### Gate trước khi bắt đầu CMS
1. Duyệt bố cục và luồng điều hướng public trên desktop/mobile.
2. Xác minh toàn bộ thông tin pháp lý/liên hệ/chương trình; thay dữ liệu mẫu.
3. Chốt domain production, canonical host và chiến lược deploy.
4. Sau đó mới thiết kế schema CMS, auth/RBAC, audit log và API lead có kiểm soát.

Checklist chi tiết: [CONTENT-QUALITY-CHECKLIST.md](CONTENT-QUALITY-CHECKLIST.md).
