# # XÂY DỰNG WEBSITE GỢI Ý TRANG PHỤC CÁ NHÂN HÓA DỰA TRÊN HÀNH VI NGƯỜI DÙNG

<!-- ![Logo](docs/images/logo.png) -->

[![GitHub Repo Stars](https://img.shields.io/github/stars/HuynhKhanhDuy2912/tn-da22ttd-110122059-huynhkhanhduy-xaydungwebsitethoitrang-personalized-recommendations?style=social)](https://github.com/HuynhKhanhDuy2912/FashionStore/stargazers) [![GitHub Forks](https://img.shields.io/github/forks/HuynhKhanhDuy2912/FashionStore?style=social)](https://github.com/HuynhKhanhDuy2912/tn-da22ttd-110122059-huynhkhanhduy-xaydungwebsitethoitrang-personalized-recommendations/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/HuynhKhanhDuy2912/tn-da22ttd-110122059-huynhkhanhduy-xaydungwebsitethoitrang-personalized-recommendations)](https://github.com/HuynhKhanhDuy2912/FashionStore/issues) [![GitHub Last Commit](https://img.shields.io/github/last-commit/HuynhKhanhDuy2912/FashionStore)](https://github.com/HuynhKhanhDuy2912/FashionStore/commits/main) [![GitHub Contributors](https://img.shields.io/github/contributors/HuynhKhanhDuy2912/tn-da22ttd-110122059-huynhkhanhduy-xaydungwebsitethoitrang-personalized-recommendations?style=flat&color=blue)](https://github.com/HuynhKhanhDuy2912/tn-da22ttd-110122059-huynhkhanhduy-xaydungwebsitethoitrang-personalized-recommendations/graphs/contributors)

- Sinh viên thực hiện: Huỳnh Khánh Duy
- MSSV: 110122059
- Email: duy2912www@gmail.com

## 🔗 Yêu cầu đề tài

Xây dựng hệ thống thương mại điện tử thời trang tích hợp trí tuệ nhân tạo (AI) để gợi ý sản phẩm cá nhân hóa, phân tích hành vi người dùng và nâng cao trải nghiệm mua sắm trực tuyến.

## 📖 Giới thiệu

**FashionStore** là nền tảng thương mại điện tử thời trang hiện đại, được thiết kế với trọng tâm là **trải nghiệm mua sắm cá nhân hóa** thông qua hệ thống gợi ý sản phẩm AI tiên tiến. Hệ thống sử dụng **Hybrid Recommendation Engine v2.0** kết hợp 6 engines (Content-Based Filtering, Collaborative Filtering, Rule-Based Recommendation, Behavior Analysis, Popularity Scoring, Category Boost) để phân tích hành vi và đưa ra gợi ý chính xác cho từng người dùng.

---

## 🎯 Mục tiêu dự án

- Xây dựng hệ thống e-commerce hoàn chỉnh cho lĩnh vực thời trang.
- Tích hợp hệ thống gợi ý sản phẩm AI cá nhân hóa dựa trên hành vi người dùng.
- Phân tích hành vi người dùng (view, click, add_to_cart, add_to_wishlist, purchase) để xây dựng user profile vector.
- Hiển thị % Match Score (Explainable AI) giúp người dùng hiểu lý do gợi ý.
- Cung cấp dashboard quản trị toàn diện cho admin theo dõi và quản lý hệ thống.

---

## 🛠️ Công nghệ sử dụng

### Backend

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT + Google OAuth 2.0
- **API**: RESTful API
- **File Upload**: Multer + Cloudinary
- **Security**: Helmet, CORS, bcryptjs

### Frontend

- **Build Tool**: Vite
- **Library**: React 18
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **Icons**: Lucide React
- **Charts**: ApexCharts + React ApexCharts
- **Notifications**: React Hot Toast
- **Authentication**: Google OAuth (@react-oauth/google)

### AI & Recommendation Engine

- **🤖 Hybrid Recommendation Engine**: Kết hợp 6 engines
- **Content-Based Filtering** (30%): Cosine similarity giữa user profile và product vectors
- **Collaborative Filtering** (20%): Item co-occurrence matrix từ hành vi tất cả users
- **Rule-Based Recommendation** (20%): 10 business rules thông minh
- **Behavior Analysis** (15%): Category/style/occasion overlap matching
- **Popularity Scoring** (10%): Bayesian average rating
- **Category Boost** (5%): Ưu tiên categories user quan tâm
- **Feature Extraction**: TF-IDF vectorization (21 dimensions)
- **Diversity**: Maximal Marginal Relevance (MMR) algorithm
- **NLP**: Thư viện `natural` cho text processing
- **ML**: `ml-distance` cho similarity metrics

### Payment & Shipping

- **Thanh toán**: VNPay, PayPal (Sandbox)
- **Vận chuyển**: GHN (Giao Hàng Nhanh) API
- **Email**: Nodemailer + SMTP Gmail

### Cloud Services

- **Image Storage**: Cloudinary
- **Push Notification**: Firebase Cloud Messaging (FCM)
- **OAuth**: Google Cloud Platform
- **Deployment**: Cloudflare Pages (Frontend) / Render (Backend)

---

## ⚙️ Kiến trúc Hệ thống

### 🏗️ Architecture Overview

![Dashboard](docs/images/system-architecture.png)

### 📂 Database Schema (MongoDB)

![Dashboard](docs/images/erd.png)

- **Users**: Thông tin người dùng, Google OAuth, role (admin/user)
- **Products**: Sản phẩm thời trang, thuộc tính (style, occasion, season, gender)
- **ProductVariants**: Biến thể sản phẩm (size, color, stock)
- **ProductImages**: Hình ảnh sản phẩm (Cloudinary)
- **Categories**: Danh mục sản phẩm (nested categories)
- **Collections**: Bộ sưu tập sản phẩm theo chủ đề
- **Orders / OrderItems**: Đơn hàng và chi tiết đơn hàng
- **Cart / CartItem**: Giỏ hàng người dùng
- **Wishlist**: Danh sách yêu thích
- **Reviews**: Đánh giá sản phẩm (rating, images, videos)
- **ProductQuestions**: Hỏi đáp sản phẩm (Q&A)
- **Coupons / CouponUsage**: Mã giảm giá và lịch sử sử dụng
- **UserBehavior**: Tracking hành vi người dùng (view, click, purchase...)
- **Payments / PaymentSessions**: Thanh toán VNPay, PayPal
- **Notifications**: Hệ thống thông báo push (Firebase FCM)
- **Banners**: Banner quảng cáo trang chủ
- **SizeGuide**: Hướng dẫn chọn size sản phẩm
- **Addresses**: Sổ địa chỉ người dùng
- **InventoryTransactions**: Lịch sử xuất nhập kho
- **ContactRequests**: Yêu cầu liên hệ hỗ trợ

---

## 🧩 Tính năng chính

### 🛒 Dành cho Khách hàng

- **Duyệt sản phẩm**: Lọc theo danh mục, phong cách, giá, giới tính, dịp sử dụng
- **Chi tiết sản phẩm**: Hình ảnh, video, biến thể (size/color), hướng dẫn chọn size
- **Giỏ hàng & Checkout**: Quản lý giỏ hàng, áp dụng mã giảm giá
- **Thanh toán đa kênh**: VNPay, PayPal, COD
- **Tính phí vận chuyển**: Tích hợp GHN API tự động tính phí
- **Wishlist**: Lưu sản phẩm yêu thích
- **Đánh giá sản phẩm**: Rating 1-5 sao, kèm hình ảnh/video
- **Hỏi đáp sản phẩm**: Q&A trực tiếp trên trang sản phẩm
- **Quản lý đơn hàng**: Theo dõi trạng thái, lịch sử mua hàng
- **Hồ sơ cá nhân**: Quản lý thông tin, địa chỉ, đổi mật khẩu
- **Bộ sưu tập**: Xem sản phẩm theo collection/chủ đề
- **Liên hệ hỗ trợ**: Form liên hệ với email tự động phản hồi
- **Đăng nhập Google**: OAuth 2.0 đăng nhập nhanh

### 🤖 AI & Gợi ý cá nhân hóa

- **Gợi ý cá nhân hóa**: Sản phẩm phù hợp dựa trên hành vi user
- **Sản phẩm tương tự**: "Xem thêm sản phẩm giống" trên trang chi tiết
- **Sản phẩm trending**: Top sản phẩm hot nhất tuần
- **% Match Score**: Hiển thị độ tương thích sản phẩm (Explainable AI)
- **Cold Start handling**: Gợi ý cho user mới chưa có lịch sử

### 👨‍💼 Dành cho Admin

- **Dashboard thống kê**: Doanh thu, đơn hàng, khách hàng, biểu đồ
- **Quản lý sản phẩm**: CRUD sản phẩm, biến thể, hình ảnh
- **Quản lý danh mục**: Phân loại sản phẩm theo tree structure
- **Quản lý đơn hàng**: Xử lý đơn, cập nhật trạng thái
- **Quản lý kho hàng**: Xuất nhập kho, theo dõi tồn kho
- **Quản lý người dùng**: Danh sách, phân quyền, khóa tài khoản
- **Quản lý mã giảm giá**: Tạo coupon, giới hạn sử dụng
- **Quản lý đánh giá**: Duyệt, phản hồi đánh giá sản phẩm
- **Quản lý bộ sưu tập**: Tạo collection, thêm sản phẩm
- **Quản lý banner**: Banner trang chủ, quảng cáo
- **Quản lý liên hệ**: Inbox yêu cầu hỗ trợ, phản hồi email
- **Size Guide**: Quản lý hướng dẫn chọn size
- **Thông báo push**: Gửi notification qua Firebase FCM

---

## 🔧 Development Workflow

1. **Environment Setup**: Cấu hình MongoDB, Cloudinary, Firebase, Google OAuth
2. **Code Development**: JavaScript (ES Modules) với React + Express
3. **Data Seeding**: Scripts import/destroy dữ liệu mẫu
4. **Testing**: Manual testing + API testing (Postman)
5. **Code Quality**: ESLint, Prettier
6. **Deployment**: Cloudflare Pages (Frontend) + Render (Backend)

> ### 🤖 **Hệ thống Gợi ý AI - Hybrid Recommendation Engine v2.0**
>
> **FashionStore** tích hợp hệ thống gợi ý sản phẩm AI mạnh mẽ!
>
> - ✨ **6 Engines** kết hợp scoring đa chiều
> - 🎯 **% Match Score** hiển thị độ tương thích sản phẩm
> - 📊 **21-dimension vectors** biểu diễn đặc trưng sản phẩm
> - 🔍 **Behavior tracking**: View, Click, Cart, Purchase, Wishlist
> - 🧠 **Explainable AI**: Giải thích lý do gợi ý cho người dùng
> - ⚡ **Caching thông minh**: 5 phút rec / 30 phút matrix

---

## 🔌 API Endpoints chính

### Authentication

```http
POST /api/auth/register         # Đăng ký tài khoản
POST /api/auth/login             # Đăng nhập
POST /api/auth/google            # Đăng nhập Google OAuth
POST /api/auth/forgot-password   # Quên mật khẩu
```

### Products

```http
GET    /api/products              # Danh sách sản phẩm (filter, sort, pagination)
GET    /api/products/:id          # Chi tiết sản phẩm
POST   /api/products              # [Admin] Tạo sản phẩm
PUT    /api/products/:id          # [Admin] Cập nhật sản phẩm
DELETE /api/products/:id          # [Admin] Xóa sản phẩm
```

### AI Recommendations

```http
GET    /api/recommendations/me                # Gợi ý cá nhân hóa (Auth required)
GET    /api/recommendations/similar/:productId # Sản phẩm tương tự
GET    /api/recommendations/trending           # Sản phẩm trending
DELETE /api/recommendations/cache              # [Admin] Clear cache
```

### Orders & Payments

```http
POST   /api/orders                # Tạo đơn hàng
GET    /api/orders/me             # Đơn hàng của tôi
POST   /api/payments/vnpay        # Thanh toán VNPay
POST   /api/payments/paypal       # Thanh toán PayPal
```

### User Behaviors (AI Tracking)

```http
POST   /api/user-behaviors        # Ghi nhận hành vi (view, click, purchase...)
GET    /api/user-behaviors/me     # Lịch sử hành vi
```

---

## 🤖 Hệ thống AI Recommendation chi tiết

### Data Flow

```
User Action (view/click/add_to_cart/add_to_wishlist/purchase)
    ↓
UserBehavior Model (tracked với duration, source, metadata)
    ↓
Feature Extraction (+ Duration Boost + Source Multiplier)
    ↓
User Profile Vector (21 dims) + Search Intent Extraction
    ↓
┌──────────────────────────────────────────────┐
│ Content-Based (30%) │ Collaborative (20%)    │
│ cosine similarity   │ co-occurrence matrix   │
├──────────────────────────────────────────────┤
│ Rule-Based (20%)    │ Behavior (15%)         │
│ 10 business rules   │ overlap matching       │
├──────────────────────────────────────────────┤
│ Popularity (10%)    │ Category (5%)          │
└──────────────────────────────────────────────┘
    ↓
Hybrid Scoring (weighted combination)
    ↓
Diversity Filter (MMR algorithm)
    ↓
Min-Max Normalization → % Match Score
    ↓
Cache (5 min rec / 30 min matrix)
    ↓
API Response + Explainable Reasons
```

### Final Scoring Formula (v2.0)

```
Final Score =
  0.30 × Content_Similarity_Score +
  0.20 × Collaborative_Filtering_Score +
  0.20 × Rule_Based_Score +
  0.15 × Behavior_Weight_Score +
  0.10 × Popularity_Score +
  0.05 × Category_Score
```

### Trọng số Hành vi Người dùng

| Action Type              | Weight | Ý nghĩa                     |
| :----------------------- | :----- | :-------------------------- |
| **purchase**             | 5.0    | Mua hàng - Signal mạnh nhất |
| **add_to_cart**          | 4.0    | Thêm giỏ hàng - Ý định mua  |
| **add_to_wishlist**      | 3.5    | Thêm wishlist - Quan tâm    |
| **click**                | 1.5    | Click xem chi tiết          |
| **view_product**         | 1.0    | Xem sản phẩm                |
| **search**               | 0.5    | Tìm kiếm                    |
| **remove_from_wishlist** | -1.5   | Bỏ khỏi wishlist            |
| **remove_from_cart**     | -2.0   | Signal tiêu cực             |

### 10 Business Rules (Rule-Based Engine)

| Rule        | Weight | Description                             |
| :---------- | :----- | :-------------------------------------- |
| Recency     | 15%    | Boost sản phẩm xem trong 7-30 ngày      |
| Popularity  | 15%    | Bayesian average rating                 |
| Style       | 15%    | Match với style preferences             |
| Occasion    | 12%    | Match với dịp user quan tâm             |
| Seasonal    | 10%    | Match với mùa hiện tại                  |
| Discount    | 8%     | Ưu tiên giảm giá cao                    |
| Price Range | 8%     | Trong khoảng 0.5x-1.5x average purchase |
| Stock       | 7%     | Penalize out-of-stock                   |
| Freshness   | 5%     | Boost sản phẩm mới (< 7 ngày)           |
| Wishlist    | 5%     | Boost items trong wishlist              |

---

## 📅 Kế hoạch thực hiện

| Tuần | Thời gian               | Công việc thực hiện                                                                                                                               |
| :--- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | 20/04/2026 - 26/04/2026 | - Hoàn thiện đề cương chi tiết<br>- Nghiên cứu MERN Stack và TailwindCSS<br>- Tìm hiểu cơ bản về hệ thống gợi ý (Recommendation System)           |
| 2    | 27/04/2026 - 03/05/2026 | - Phân tích yêu cầu hệ thống<br>- Thiết kế Use Case Diagram<br>- Thiết kế cơ sở dữ liệu (MongoDB)<br>- Thiết kế giao diện UI/UX (Figma)           |
| 3    | 04/05/2026 - 10/05/2026 | - Xây dựng backend (Node.js + Express)<br>- Xây dựng RESTful API<br>- Chức năng xác thực (JWT, Google Login)                                      |
| 4    | 11/05/2026 - 17/05/2026 | - Xây dựng chức năng người dùng:<br> + Xem sản phẩm<br> + Tìm kiếm, lọc sản phẩm<br> + Giỏ hàng, đặt hàng                                         |
| 5    | 18/05/2026 - 24/05/2026 | - Xây dựng chức năng quản trị (Admin):<br> + Quản lý sản phẩm<br> + Quản lý danh mục<br> + Quản lý đơn hàng<br>- Tích hợp upload ảnh (Cloudinary) |
| 6    | 25/05/2026 - 31/05/2026 | - Xây dựng frontend bằng ReactJS + TailwindCSS<br>- Kết nối API với frontend<br>- Hoàn thiện UI cơ bản                                            |
| 7    | 01/06/2026 - 07/06/2026 | - Thu thập dữ liệu hành vi người dùng (log)<br>- Tiền xử lý dữ liệu<br>- Xây dựng hệ thống gợi ý (Content-based filtering + rule-based filtering) |
| 8    | 08/06/2026 - 14/06/2026 | - Tích hợp hệ thống gợi ý vào website<br>- Tích hợp thanh toán VNPAY<br>- Hoàn thiện chức năng hệ thống                                           |
| 9    | 15/06/2026 - 21/06/2026 | - Kiểm thử hệ thống (test chức năng, fix bug)<br>- Deploy website (Vercel / Render / VPS)<br>- Viết báo cáo                                       |
| 10   | 22/06/2026 - 28/06/2026 | - Hoàn thiện báo cáo<br>- Làm slide thuyết trình<br>- Chuẩn bị demo hệ thống                                                                      |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ và npm
- MongoDB Atlas account (hoặc MongoDB local)
- Cloudinary account (upload hình ảnh)
- Google Cloud Console credentials (OAuth)
- Firebase project (Push notification)
- VNPay Sandbox / PayPal Sandbox (Thanh toán)
- GHN API token (Vận chuyển)

### Installation

```bash
# Clone repository
git clone tn-da22ttd-110122059-huynhkhanhduy-xaydungwebsitethoitrang-personalized-recommendations.git
cd src

# Setup backend
cd backend
npm install
cp .env.example .env
# Cấu hình các biến môi trường trong .env (xem hướng dẫn bên dưới)

# Seed dữ liệu mẫu
npm run seed:import

# Chạy backend server
npm run dev
# Backend chạy tại http://localhost:5000

# Setup frontend (terminal mới)
cd frontend
npm install
cp .env.example .env
# Cấu hình API URL và Firebase trong .env

# Chạy frontend
npm run dev
# Frontend chạy tại http://localhost:3000
```

### Environment Variables Setup

#### Backend (.env)

```bash
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fashionstore

# Server
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Firebase Admin SDK (Push Notification)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# VNPay (Payment)
VNP_TMN_CODE=your_vnpay_tmn_code
VNP_HASH_SECRET=your_vnpay_hash_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:3000/payment/vnpay/callback

# PayPal (Payment)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# GHN (Shipping)
GHN_TOKEN=your_ghn_token
GHN_SHOP_ID=your_shop_id
GHN_BASE_URL=https://online-gateway.ghn.vn/shiip/public-api/v2

# Email (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

#### Frontend (.env)

```bash
# API
VITE_API_BASE_URL=http://localhost:5000/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Firebase (Push Notification)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 📂 Cấu trúc dự án

```
src/
├── backend/
│   ├── config/              # Cấu hình DB, Cloudinary, Firebase
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── firebase.js
│   ├── controllers/         # Request handlers (27 controllers)
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   ├── recommendation.controller.js
│   │   ├── userBehavior.controller.js
│   │   └── ...
│   ├── models/              # MongoDB Schemas (24 models)
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── UserBehavior.js
│   │   └── ...
│   ├── routes/              # API Routes (28 route files)
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── recommendation.routes.js
│   │   └── ...
│   ├── services/            # Business Logic (16 services)
│   │   ├── featureExtraction.service.js
│   │   ├── contentBasedFiltering.service.js
│   │   ├── collaborativeFiltering.service.js
│   │   ├── ruleBasedRecommendation.service.js
│   │   ├── hybridRecommendation.service.js
│   │   ├── order.service.js
│   │   ├── dashboard.service.js
│   │   └── ...
│   ├── middlewares/         # Auth, Error handling
│   ├── utils/               # Helper functions
│   ├── app.js               # Express app configuration
│   └── server.js            # Server entry point
│
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components (28 components)
│   │   │   ├── Layout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── RecommendationSection.jsx
│   │   │   ├── DashboardCharts.jsx
│   │   │   └── ...
│   │   ├── pages/           # Page components (18 pages + 20 admin pages)
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── RecommendationsPage.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboardPage.jsx
│   │   │   │   ├── AdminProductListPage.jsx
│   │   │   │   ├── AdminOrdersPage.jsx
│   │   │   │   └── ...
│   │   │   └── ...
│   │   ├── context/         # React Context (Auth, Cart, Notification)
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utility functions
│   │   ├── App.jsx          # Root component + Routing
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── .gitignore
```

---

## 💡 Hướng dẫn sử dụng Hệ thống Gợi ý AI

### 📝 Quy trình hoạt động

1. **Người dùng duyệt sản phẩm**:
   - Mỗi hành động (view_product, click, search, add_to_cart, add_to_wishlist, purchase...) được tự động tracking
   - Dữ liệu đi kèm: duration (thời gian xem), source (nguồn truy cập), searchKeyword và metadata (categoryId, style, occasion)

2. **Hệ thống xây dựng User Profile**:
   - Vector hóa 21 chiều cho mỗi sản phẩm (style, gender, season, occasion, price, TF-IDF...)
   - Tính weighted average từ các sản phẩm user đã tương tác
   - Áp dụng Recency Decay: `exp(-days/30)` — hành vi gần đây quan trọng hơn

3. **Tạo gợi ý**:
   - 6 engines chạy song song, tính điểm cho mỗi sản phẩm
   - Hybrid scoring kết hợp với weights đã được fine-tune
   - MMR diversity filter đảm bảo đa dạng (max 3 per category, 4 per style)

4. **Hiển thị kết quả**:
   - % Match Score chuẩn hóa (Min-Max Normalization)
   - Lý do gợi ý (Explainable AI)
   - Caching 5 phút, auto-invalidation khi có hành vi mới

### ⚠️ Lưu ý quan trọng

- **Cold Start**: User mới cần ít nhất 1-2 interactions để hệ thống bắt đầu học
- **Cache**: Gợi ý được cache 5 phút, có thể clear thủ công qua API
- **Performance**: Collaborative Matrix cache 30 phút, tự rebuild khi có data mới
- **Diversity**: Hệ thống đảm bảo đa dạng, tránh recommend quá nhiều sản phẩm giống nhau

---

## 📱 Poster

![Dashboard](docs/images/poster.png)

---

## 🤝 Contributing

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng tạo Pull Request hoặc mở Issue trên GitHub.

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 🐛 Bug Reports & Feature Requests

- [⛔ Báo Cáo Lỗi](https://github.com/HuynhKhanhDuy2912/FashionStore/issues/new?title=[Bug])
- [🆕 Yêu Cầu Tính Năng](https://github.com/HuynhKhanhDuy2912/FashionStore/issues/new?title=[Feature+Request])

- 📧 **Support**: Email hỗ trợ tại duy2912www@gmail.com

---

## 📌 License

© 2026 by Huỳnh Khánh Duy. Dự án phục vụ mục đích học tập và nghiên cứu (Khóa luận tốt nghiệp).
