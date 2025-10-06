🏢 IT Inventory - Hệ thống Quản lý Thiết bị CNTT
Một hệ thống quản lý kho thiết bị công nghệ thông tin hiện đại, được xây dựng với giao diện thân thiện, tính năng mạnh mẽ và khả năng mở rộng.

✨ Tính năng nổi bật
📊 Quản lý Vòng đời Thiết bị
Master List: Quản lý danh sách các mẫu thiết bị chuẩn của công ty.

Theo dõi Kho: Nắm bắt số lượng và trạng thái của từng thiết bị thực tế.

Quy trình Mua sắm: Tạo và quản lý các yêu cầu mua sắm thiết bị mới.

Cấp phát & Thu hồi: Theo dõi vòng đời của thiết bị từ khi cấp phát cho nhân viên đến khi thu hồi và bảo trì.

📈 Báo cáo và Phân tích
Dashboard Trực quan: Biểu đồ thống kê tổng quan về tình trạng kho.

Báo cáo Động: Xuất báo cáo chi tiết theo nhiều tiêu chí (danh mục, trạng thái, người dùng).

Phân tích Xu hướng: Theo dõi và dự báo nhu cầu sử dụng thiết bị theo thời gian.

🎨 Trải nghiệm Người dùng
Thiết kế Responsive: Giao diện tối ưu, hoạt động mượt mà trên cả máy tính và thiết bị di động.

Chế độ Sáng/Tối: Tự động chuyển đổi giao diện để bảo vệ mắt người dùng.

Tối ưu Hiệu năng: Sử dụng các kỹ thuật Lazy Loading và Code Splitting để đảm bảo tốc độ tải trang nhanh nhất.

🛠️ Công nghệ sử dụng
Lĩnh vực Công nghệ Phiên bản
Frontend React 19.1.1
Tailwind CSS
Chart.js 4.5.0
Backend & Database Firebase 12.2.1
Firestore, Firebase Auth, Firebase Hosting
CI/CD GitHub Actions
Tối ưu hóa Webpack Bundle Analyzer, React.lazy, React.memo

Xuất sang Trang tính
🚀 Cài đặt và Chạy dự án
Yêu cầu hệ thống
Node.js v16.0.0 trở lên

npm v8.0.0 trở lên

Một tài khoản Firebase

Các bước cài đặt
Clone repository về máy:

Bash

git clone https://github.com/nhatluan064/it-inventory.git
cd it-inventory
Cài đặt các gói phụ thuộc:

Bash

npm install
Cấu hình môi trường (Firebase):

Sao chép file .env.example thành một file mới tên là .env.

Điền các thông tin cấu hình Firebase của bạn vào file .env.

Bash

# Hoặc chạy script để tự động hóa

npm run setup-env
Chạy dự án ở chế độ development:

Bash

npm start
Build dự án cho production:

Bash

npm run build
🔐 Bảo mật
Dự án chú trọng đến bảo mật với các biện pháp:

Biến môi trường (.env): Toàn bộ key nhạy cảm được quản lý qua biến môi trường và không bao giờ commit lên repository.

Firebase Security Rules: Phân quyền truy cập dữ liệu chi tiết, đảm bảo người dùng chỉ có thể xem/sửa những gì được phép.

Content Security Policy (CSP): Giúp ngăn chặn các cuộc tấn công Cross-Site Scripting (XSS).

🤝 Đóng góp
Mọi sự đóng góp đều được chào đón! Vui lòng tham khảo quy trình sau:

Fork repository này.

Tạo một Feature Branch mới (git checkout -b feature/AmazingFeature).

Commit các thay đổi của bạn (git commit -m 'feat: Add some AmazingFeature').

Push lên branch (git push origin feature/AmazingFeature).

Mở một Pull Request với mô tả chi tiết về những thay đổi.

Nếu bạn gặp lỗi hoặc có ý tưởng mới, hãy tạo một Issue tại đây.

📄 Giấy phép
Dự án này được cấp phép theo MIT License. Xem chi tiết tại file LICENSE.

<div align="center">
<p>Được phát triển bởi <strong>Nhật Luân IT Networking</strong></p>
<p><em>Hệ thống Quản lý Thiết bị CNTT - © 2024</em></p>
</div>
