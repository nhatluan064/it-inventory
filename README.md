# 🏢 IT Inventory Management System

Hệ thống quản lý kho thiết bị công nghệ thông tin hiện đại với giao diện thân thiện và tính năng đa nền tảng.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB.svg)
![Firebase](https://img.shields.io/badge/Firebase-12.2.1-FFCA28.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🚀 Tính năng chính

### 📊 Quản lý thiết bị
- ✅ **Danh sách Master** - Quản lý các mẫu thiết bị chuẩn
- ✅ **Thiết bị đã mua** - Theo dõi thiết bị thực tế trong kho
- ✅ **Yêu cầu mua** - Quản lý quy trình mua sắm thiết bị
- ✅ **Cấp phát thiết bị** - Phân bổ thiết bị cho nhân viên
- ✅ **Thu hồi thiết bị** - Quy trình thu hồi và bảo trì

### 📈 Báo cáo và Thống kê
- 📊 **Dashboard tổng quan** với biểu đồ trực quan
- 📋 **Báo cáo chi tiết** theo danh mục và trạng thái
- 📉 **Thống kê xu hướng** theo thời gian
- 🎯 **Phân tích sử dụng** thiết bị

### 🎨 Giao diện và Trải nghiệm
- 📱 **Responsive Design** - Tối ưu cho mọi thiết bị
- 🌙 **Dark/Light Mode** - Chế độ sáng/tối
- 🔍 **Tìm kiếm và Lọc** thông minh
- ⚡ **Lazy Loading** - Tải nhanh và tối ưu hiệu suất

## �️ Công nghệ sử dụng

### Frontend
- **React 19.1.1** - Framework chính
- **Tailwind CSS** - Styling framework
- **Chart.js 4.5.0** - Thư viện biểu đồ
- **Lucide React** - Icon library
- **React Hot Toast** - Notification system

### Backend & Database
- **Firebase 12.2.1** - Backend as a Service
- **Firestore** - NoSQL Database
- **Firebase Auth** - Xác thực người dùng
- **Firebase Hosting** - Deployment platform

### Performance & Tools
- **Webpack Bundle Analyzer** - Phân tích bundle size
- **React.lazy & Suspense** - Code splitting
- **React.memo** - Tối ưu re-rendering
- **Service Workers** - PWA support

## 🏗️ Cấu trúc dự án

```
it-inventory/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── Performance/   # Lazy loading & optimization
│   │   ├── ErrorBoundary/ # Error handling
│   │   └── LoadingStates/ # Loading components
│   ├── views/            # Page components
│   │   ├── Mobile/       # Mobile-optimized views
│   │   └── Desktop/      # Desktop views
│   ├── hooks/            # Custom React hooks
│   ├── modals/           # Modal components
│   ├── utils/            # Utility functions
│   ├── context/          # React Context
│   └── config/           # Configuration files
├── scripts/              # Setup and deployment scripts
├── SECURITY.md          # Security documentation
├── DEPLOYMENT.md        # Deployment guide
└── BUNDLE_ANALYSIS.md   # Performance analysis
```

## 🚀 Cài đặt và Chạy dự án

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm >= 8.0.0
- Firebase account

### 1. Clone dự án
```bash
git clone https://github.com/nhatluan064/it-inventory.git
cd it-inventory
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình Firebase
```bash
npm run setup-env
```
Hoặc tạo file `.env` từ `.env.example` và điền thông tin Firebase.

### 4. Chạy development server
```bash
npm start
```

### 5. Build production
```bash
npm run build
```

### 6. Deploy to Firebase
```bash
npm run deploy
```

## 📊 Performance Optimization

### Bundle Size Analysis
- **Main Bundle**: 312.3 kB (gzipped)
- **Chart Chunks**: 5 separate chunks (~1.4-1.8 kB each)
- **Lazy Loading**: Charts load on-demand
- **Code Splitting**: Optimal caching strategy

### Performance Features
- ⚡ **React.lazy** - Component-level code splitting
- 🧠 **React.memo** - Prevent unnecessary re-renders
- 🔍 **Intersection Observer** - Smart lazy loading
- 📦 **Webpack optimization** - Bundle analysis tools

## 🔐 Bảo mật

- 🔒 **Environment Variables** - Sensitive data protection
- 🛡️ **Firebase Security Rules** - Database access control
- 🔐 **Content Security Policy** - XSS protection
- 📋 **Input Validation** - Data sanitization
## 📋 Tính năng sắp tới

### Phase 3: Tính năng nâng cao
- [ ] 📸 Upload và quản lý hình ảnh thiết bị
- [ ] 💾 Backup/restore dữ liệu tự động
- [ ] 🌙 Dark theme support
- [ ] ⌨️ Keyboard shortcuts
- [ ] 📱 PWA offline support

### Security & Dependencies
- [ ] 🔄 Cập nhật dependencies định kỳ
- [ ] 🔍 Security audit thường xuyên
- [ ] 🛡️ Advanced authentication methods

## 🔧 Troubleshooting

### Lỗi thường gặp

**Firebase connection error:**
```bash
# Kiểm tra cấu hình Firebase
npm run check-firebase-config
```

**Build fails:**
```bash
# Clear cache và rebuild
npm run clean
npm install
npm run build
```

**Performance issues:**
```bash
# Phân tích bundle size
npm run analyze
```

### Debug Steps
1. 🔍 **Firebase Console** - Kiểm tra authentication/database
2. 🌐 **Browser Console** - Xem client-side errors  
3. 📡 **Network Tab** - Kiểm tra API requests
4. ⚡ **Performance Tab** - Phân tích load time

## 🤝 Đóng góp & Hỗ trợ

### Liên hệ
- 📧 **Email**: nhatluan064@gmail.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/nhatluan064/it-inventory/issues)
- 💡 **Feature Requests**: [Discussions](https://github.com/nhatluan064/it-inventory/discussions)
- 📚 **Documentation**: [Wiki](https://github.com/nhatluan064/it-inventory/wiki)

### Quy trình đóng góp
1. **Fork** repository này
2. **Create** feature branch (`git checkout -b feature/ten-tinh-nang`)
3. **Commit** changes (`git commit -m 'Thêm tính năng mới'`)
4. **Push** to branch (`git push origin feature/ten-tinh-nang`)
5. **Open** Pull Request với mô tả chi tiết

## 📄 License

Dự án này được cấp phép theo **MIT License** - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

<div align="center">
  <p><strong>Được tạo với AI Gemini, Claude, ChatGPT, Copilot Github, bởi Nhật Luân IT Networking</strong></p>
  <p>© 2024 IT Inventory Management System | Hệ thống Quản lý Thiết bị CNTT</p>
  
  [![Vietnam](https://img.shields.io/badge/Made%20in-Vietnam-red.svg)](https://vietnam.travel)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>


