<h1 align="center">🍔 FastFood – Online Food Ordering & Real-Time Delivery</h1>

<p align="center">
  Full-stack food ordering platform with real-time tracking, AI chatbot and VNPay online payment.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/backend-Django%20%2B%20DRF-092E20?style=for-the-badge&logo=django&logoColor=white" />
  <img src="https://img.shields.io/badge/frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/realtime-WebSocket-00897B?style=for-the-badge&logo=websocket&logoColor=white" />
  <img src="https://img.shields.io/badge/payment-VNPay-005BAC?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" />
</p>

<p align="center">
  <a href="#-english-version">English</a> •
  <a href="#-phiên-bản-tiếng-việt">Tiếng Việt</a>
</p>

---

## 🌍 Supported Languages

- 🇬🇧 [English Version](#-english-version)  
- 🇻🇳 [Phiên bản Tiếng Việt](#-phiên-bản-tiếng-việt)

---

## 🇬🇧 ENGLISH VERSION

### ✨ 1. Overview

**FastFood** is a full-stack food ordering and delivery platform designed for students and small restaurants.  
It provides a complete workflow:

> Browse food ➜ Add to cart ➜ Pay (VNPay) ➜ Restaurant processes ➜ Shipper delivers (real-time tracking via WebSocket) ➜ Feedback & analytics

The project uses a modern architecture:

- **Backend:** Django + Django REST Framework + PostgreSQL  
- **Frontend:** React (SPA)  
- **Realtime:** WebSocket (delivery location streaming + live tracking UI)  
- **Payment:** **VNPay online payment gateway**  
- **AI:** OpenAI-powered chatbot for smart support & food suggestions  

---

### 🍱 2. Main Features

#### 👤 2.1 For Customers

- Browse restaurants, categories and food items
- View food details: images, description, price
- Add to cart, update quantities, remove items
- Create orders from the cart
- Manage delivery addresses and contact info
- Track order status: `PENDING` → `CONFIRMED` → `DELIVERING` → `COMPLETED / CANCELED`
- **Pay online using VNPay**
- View order history & details
- Send feedback after receiving the order

#### 🍳 2.2 For Restaurants / Staff

- Manage restaurant profile
- CRUD operations for categories & foods
- Set price, description, image, availability
- Receive & process new orders
- Accept / cancel orders
- Assign orders to shippers
- View basic revenue & order statistics

#### 🚚 2.3 For Shippers

- See assigned orders with full delivery info
- Update order status as they deliver
- Send live GPS location via WebSocket
- Support real-time route tracking on the map (React + Leaflet)

#### 🛠 2.4 For Admin

- Manage all user accounts & roles (admin, staff, shipper, customer)
- Manage restaurants and system configuration
- Monitor global orders and system health

#### 🤖 2.5 AI Chatbot

- Built-in chatbot powered by OpenAI API
- Helps users:
  - Ask about dishes and restaurants
  - Understand ordering/payment flow
  - Get smart recommendations

---

### 💳 3. VNPay Online Payment Integration

FastFood integrates **VNPay** as an online payment gateway:

- Customers can select **VNPay** at checkout
- The system:
  1. Builds a **secure VNPay payment URL** with all required parameters (amount, order info, IP address, timestamps…)
  2. Sorts parameters and **creates an HMAC SHA-512 signature** using the VNPay secret key
  3. Redirects the user to VNPay sandbox/production payment page
  4. VNPay redirects back to a `RETURN_URL` (and/or sends IPN) with transaction info and `vnp_SecureHash`
  5. Server verifies the signature and:
     - Marks the order as **paid** if valid
     - Handles failure/cancel cases safely

- Security highlights:
  - Signature generated with secret key (server-side only)
  - Sorted parameters to ensure consistent hashing
  - Validation on callback to prevent tampering
  - Order status updated in a transaction-safe way

This makes the system **payment-ready for a real e-commerce scenario**, not just cash-on-delivery.

---

### 📡 4. Real-Time Delivery Tracking (WebSocket)

FastFood uses WebSocket for live tracking:

1. **Shipper Client**
   - Periodically reads GPS coordinates
   - Sends `{lat, lng, order_id}` to WebSocket server

2. **WebSocket / Channels Layer**
   - Receives coordinates
   - Broadcasts to a specific “room” for that order/customer

3. **React Frontend**
   - Listens to WebSocket messages
   - Updates the shipper marker on the map using **React-Leaflet**
   - Draws polyline from previous to current locations
   - Re-renders smoothly without reloading the page

Result: a **GrabFood / ShopeeFood-like experience** where customers see the shipper moving on the map in real time.

---

### 🧱 5. Architecture

```text
+---------------------------+         +---------------------------+
|        React SPA         |  REST   |       Django + DRF        |
|  (Customer / Staff /     +-------->+  Auth, Orders, Users,     |
|   Shipper Dashboards)    |         |  Restaurants, Feedback    |
+-----------+--------------+         +---------------+-----------+
            | WebSocket                                |
            v                                          v
   +------------------+                     +---------------------+
   | WebSocket Client | <-----------------> | WebSocket / Channels|
   |  (Tracking UI)   |   Real-time GPS     |  (ASGI Layer)       |
   +------------------+                     +---------------------+

          +-----------------------------------------------+
          |               PostgreSQL DB                  |
          | Users, Restaurants, Foods, Orders, Cart,     |
          | OrderItems, Feedback, Payment Transactions   |
          +-----------------------------------------------+

          +------------------------+
          |       VNPay API       |
          | create payment URL,   |
          | verify callback hash  |
          +------------------------+

          +------------------------+
          |       OpenAI API      |
          |  Chatbot assistant    |
          +------------------------+
```
---

## 🧰 6. Tech Stack

### 🖥 Backend
- **Django** – Core backend framework  
- **Django REST Framework (DRF)** – REST API  
- **PostgreSQL** – Relational database  
- **Django Channels / ASGI** – WebSocket real-time server  
- **JWT Authentication** – Secure stateless login  
- **Custom User Model** – Multiple user roles  
- **VNPay Integration** – Online payment gateway  
- **OpenAI API** – AI chatbot assistant  

### 🎨 Frontend
- **React SPA** – Main user interface  
- **React Router** – Page navigation  
- **Axios / Fetch** – API client  
- **React-Leaflet** – Real-time interactive map  
- **WebSocket Client** – Receive live GPS stream  
- **Tailwind / Custom CSS** – UI styling  

---

## 📂 7. Project Structure

```text
Fast_Food_App/
├── server/
│   ├── fast_food/
│   │   ├── accounts/        # Users, roles, JWT
│   │   ├── restaurants/     # Restaurant + Food management
│   │   ├── ordering/        # Orders, OrderItems, Cart
│   │   ├── feedback/        # User feedback system
│   │   ├── chatbot/         # OpenAI chatbot module
│   │   ├── payments/        # VNPay integration
│   │   ├── settings.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
├── website/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```
---

## 🧪 9. Testing Features

### 💳 VNPay Payment Test

FastFood supports full **VNPay Sandbox** integration to simulate real online payments.

#### ✅ What is supported?
- ✔ Sandbox payment testing  
- ✔ Auto-redirect to VNPay checkout page  
- ✔ HMAC-SHA512 signature validation  
- ✔ Secure order status update after callback  
- ✔ Rejects invalid or tampered VNPay requests  

---

#### 🧭 Recommended Testing Flow

1. 🛒 Create a new order  
2. 💳 Choose **“Pay via VNPay”**  
3. 🌐 VNPay Sandbox opens → simulate bank payment  
4. ↩ VNPay redirects back to your **`RETURN_URL`**  
5. 🧾 Backend verifies `vnp_SecureHash`  
6. 🟢 Order is marked as **PAID** if the signature is valid  

---

### 📡 Real-Time WebSocket Tracking Test

FastFood includes a **real-time delivery tracking system**, similar to GrabFood / ShopeeFood.

#### 🧩 How it works

| Actor      | Action |
|-----------|--------|
| **Shipper** | Sends GPS via WebSocket (`lat`, `lng`, `order_id`) |
| **Server**  | Broadcasts coordinates to the correct order group |
| **Frontend**| Updates the map UI (marker movement + polyline route) |

---

#### 👀 What you will see

- 🚚 Shipper marker **moves smoothly** on React-Leaflet map  
- 🛰 Route polyline **updates continuously**  
- ⚡ **Real-time** updates without refreshing  
- 📡 Latency is extremely low (depends on network)  

---

#### 🧪 Example Testing Payload

```json
{
  "order_id": "12345",
  "lat": 10.762889,
  "lng": 106.682173
}
```
---
## 🙌 10. Contribution

### 🤝 Ways to Contribute

You can help improve FastFood by contributing in any of the following areas:

- 🎨 **UI/UX Enhancements**  
  Improve layout, animations, responsive behavior, and overall user experience.

- 🔔 **Real-time Notifications**  
  Add toast notifications, email alerts, or push notifications for order status.

- 🤖 **AI Chatbot Improvements**  
  Enhance context awareness, add recommendation logic, or improve conversation flow.

- 💳 **More Payment Gateways**  
  Integrate MoMo, ZaloPay, Stripe → expand the system beyond VNPay.

- ⚙️ **Backend Optimization**  
  Improve DB queries, caching, performance tuning, or reduce response latency.

- 🛰 **WebSocket Reliability**  
  Add reconnection logic, heartbeat, or delivery consistency for real-time tracking.

---

### 🧾 Pull Request Guidelines

To contribute code or fixes:

1. 🍴 **Fork** the repository  
2. 🌿 **Create a new branch** (example: `feature/add-vnpay-logging`)  
3. 💻 Implement your changes with clean and readable code  
4. 📝 **Write a clear description** of your PR  
5. 🔍 Ensure it doesn't break existing features  
6. 📤 Submit the **Pull Request**

💛 *Every contribution — big or small — is appreciated!*

---

### 💬 Support & Issues

If you encounter bugs or have feature requests:

- 🐞 Open an **Issue** on GitHub  or Contact: tinhoc7649@gmail.com
- 📸 Attach **screenshots** or **logs** if possible  
- ✍️ Provide steps to reproduce the issue  
- 📌 Specify expected vs actual behavior
- 👤Author: Ngô Thành Danh

We will respond as soon as possible to help you.

---

## 🇻🇳 PHIÊN BẢN TIẾNG VIỆT

### ✨ 1. Tổng Quan

**FastFood** là nền tảng đặt đồ ăn và giao hàng theo thời gian thực, được thiết kế dành cho sinh viên và các nhà hàng quy mô nhỏ.  
Hệ thống hỗ trợ quy trình đầy đủ:

> Xem món ➜ Thêm vào giỏ ➜ Thanh toán (VNPay) ➜ Nhà hàng xử lý ➜ Shipper giao hàng (theo dõi trực tiếp qua WebSocket) ➜ Gửi đánh giá & xem thống kê

Ứng dụng sử dụng kiến trúc hiện đại:

- **Backend:** Django + Django REST Framework + PostgreSQL  
- **Frontend:** React (SPA)  
- **Realtime:** WebSocket (stream GPS + giao diện tracking trực tiếp)  
- **Thanh toán:** Tích hợp **VNPay online**  
- **AI Chatbot:** Tích hợp OpenAI hỗ trợ thông minh  

---

### 🍱 2. Chức Năng Chính

#### 👤 2.1 Dành cho Khách Hàng
- Xem nhà hàng, danh mục và từng món ăn  
- Xem chi tiết món: hình ảnh, mô tả, giá  
- Thêm vào giỏ hàng, chỉnh sửa số lượng  
- Tạo đơn hàng từ giỏ  
- Quản lý địa chỉ giao hàng  
- Theo dõi trạng thái đơn:  
  `CHỜ DUYỆT` → `ĐÃ XÁC NHẬN` → `ĐANG GIAO` → `HOÀN THÀNH / ĐÃ HỦY`  
- **Thanh toán online qua VNPay**  
- Lịch sử đơn hàng  
- Gửi đánh giá sau khi nhận hàng  

#### 🍳 2.2 Dành cho Nhà Hàng / Nhân Viên
- Quản lý thông tin nhà hàng  
- CRUD danh mục & món ăn  
- Cập nhật giá, mô tả, hình ảnh, tình trạng bán  
- Xử lý đơn hàng mới  
- Xác nhận / huỷ đơn  
- Giao đơn cho shipper  
- Xem thống kê doanh thu cơ bản  

#### 🚚 2.3 Dành cho Shipper
- Xem danh sách đơn được giao  
- Cập nhật trạng thái giao hàng  
- Gửi tọa độ GPS theo thời gian thực qua WebSocket  
- Theo dõi tuyến đường và bản đồ trực tiếp (React + Leaflet)  

#### 🛠 2.4 Dành cho Admin
- Quản lý người dùng & phân quyền  
- Quản lý nhà hàng  
- Theo dõi toàn bộ hệ thống & đơn hàng  

#### 🤖 2.5 Chatbot AI (OpenAI)
- Gợi ý món ăn  
- Trả lời câu hỏi về nhà hàng  
- Hướng dẫn quy trình đặt hàng / thanh toán  
- Đưa ra đề xuất thông minh  

---

### 💳 3. Tích Hợp Thanh Toán VNPay

FastFood hỗ trợ thanh toán trực tuyến qua **VNPay**:

- Khách hàng chọn **VNPay** tại bước thanh toán  
- Hệ thống:
  1. Tạo URL thanh toán với đầy đủ tham số (số tiền, mã đơn, IP, timestamp)  
  2. Sắp xếp tham số và tạo **HMAC-SHA512 signature** bằng secret key  
  3. Redirect sang cổng thanh toán VNPay  
  4. VNPay trả về `RETURN_URL` cùng `vnp_SecureHash`  
  5. Backend kiểm tra chữ ký:  
     - Hợp lệ → đánh dấu đơn **ĐÃ THANH TOÁN**  
     - Không hợp lệ → từ chối (anti-tampering)  

- **Tính bảo mật:**
  - Secret key luôn nằm ở server  
  - Chữ ký đảm bảo dữ liệu không bị chỉnh sửa  
  - Kiểm tra callback để tránh giả mạo  
  - Cập nhật trạng thái đơn theo giao dịch thực tế  

---

### 📡 4. Theo Dõi Shipper Thời Gian Thực (WebSocket)

WebSocket được dùng để cập nhật vị trí shipper theo thời gian thực:

1. **Shipper Client**
   - Gửi tọa độ GPS liên tục  
   - Payload: `{lat, lng, order_id}`  

2. **WebSocket / Channels Layer**
   - Nhận dữ liệu  
   - Broadcast đến đúng phòng của đơn hàng đó  

3. **React Frontend**
   - Nhận message WebSocket  
   - Cập nhật marker trên map  
   - Vẽ polyline theo hướng di chuyển  
   - Re-render mượt mà, không cần reload  

Kết quả: người dùng xem được shipper di chuyển từng giây – y hệt GrabFood / ShopeeFood.

---

### 🧱 5. Kiến Trúc Hệ Thống

```text
+---------------------------+         +---------------------------+
|        React SPA         |  REST   |       Django + DRF        |
|  (Customer / Staff /     +-------->+  Auth, Orders, Users,     |
|   Shipper Dashboards)    |         |  Restaurants, Feedback    |
+-----------+--------------+         +---------------+-----------+
            | WebSocket                                |
            v                                          v
   +------------------+                     +---------------------+
   | WebSocket Client | <-----------------> | WebSocket / Channels|
   |  (Tracking UI)   |   Real-time GPS     |  (ASGI Layer)       |
   +------------------+                     +---------------------+

          +-----------------------------------------------+
          |               PostgreSQL DB                  |
          | Users, Restaurants, Foods, Orders, Cart,     |
          | OrderItems, Feedback, Payment Transactions   |
          +-----------------------------------------------+

          +------------------------+
          |       VNPay API       |
          | create payment URL,   |
          | verify callback hash  |
          +------------------------+

          +------------------------+
          |       OpenAI API      |
          |  Chatbot assistant    |
          +------------------------+
```
## 🧰 6. Công Nghệ Sử Dụng (Tech Stack)

FastFood sử dụng kiến trúc tách biệt rõ ràng giữa **Backend – Frontend – Realtime – Payment – AI**, đảm bảo dễ mở rộng và dễ bảo trì.

---

### 🖥 Backend
- **Django Framework**  
  Xử lý logic nghiệp vụ, routing, middleware, bảo mật.

- **Django REST Framework (DRF)**  
  Cung cấp RESTful API chuẩn hóa, serializer, permission, throttling.

- **PostgreSQL**  
  Cơ sở dữ liệu quan hệ mạnh mẽ, đảm bảo tính toàn vẹn và hiệu suất.

- **Django Channels / ASGI** *(nếu dùng realtime backend)*  
  Hỗ trợ WebSocket và giao tiếp hai chiều trong thời gian thực.

- **JWT Authentication**  
  Đăng nhập không trạng thái, bảo mật và tối ưu cho API.

- **Custom User Model**  
  Quản lý nhiều vai trò: admin, staff, shipper, customer.

- **VNPay Payment Integration**  
  Hỗ trợ thanh toán trực tuyến an toàn qua cổng VNPay.

- **OpenAI API**  
  Tích hợp chatbot AI thông minh, gợi ý món ăn và hỗ trợ người dùng.

---

### 🎨 Frontend
- **React SPA (Single Page Application)**  
  Giao diện mượt mà, tải nhanh, trải nghiệm tốt.

- **React Router**  
  Điều hướng trang hiệu quả.

- **Axios / Fetch API**  
  Gửi HTTP request tương tác với backend nhanh chóng.

- **React-Leaflet**  
  Hiển thị bản đồ, marker, polyline cho tính năng tracking shipper theo thời gian thực.

- **WebSocket Client**  
  Nhận dữ liệu GPS real-time.

- **TailwindCSS / Custom CSS**  
  Tối ưu giao diện, dễ tùy biến theo branding.

---

### 🔧 Bổ trợ khác
- `.env` quản lý config và secret  
- Kiến trúc tách biệt **server / website** dễ deploy  
- Hỗ trợ scale theo chiều ngang khi hệ thống mở rộng  

---

## 📂 7. Cấu Trúc Dự Án (Project Structure)

Dưới đây là cấu trúc dự án chuẩn hoá, tách biệt backend – frontend – realtime – thanh toán – AI.

```text
Fast_Food_App/
├── server/
│   ├── fast_food/
│   │   ├── accounts/        # Users + phân quyền + JWT
│   │   ├── restaurants/     # Nhà hàng + danh mục món + món ăn
│   │   ├── ordering/        # Đơn hàng + giỏ hàng + order items
│   │   ├── feedback/        # Hệ thống đánh giá + bình luận
│   │   ├── chatbot/         # Tích hợp OpenAI Chatbot
│   │   ├── payments/        # Tích hợp VNPay
│   │   ├── settings.py      # Cấu hình Django + DB + Apps
│   │   └── urls.py          # Routing API
│   ├── manage.py
│   └── requirements.txt     # Danh sách thư viện Python
│
├── website/
│   ├── src/
│   │   ├── api/             # API service gọi đến backend
│   │   ├── components/      # UI components dùng lại nhiều nơi
│   │   ├── pages/           # Các trang chính (Home, Cart, Order…)
│   │   └── App.jsx          # Root của React App
│   ├── package.json         # Thông tin dependencies FE
│   └── vite.config.js       # Config của Vite
│
└── README.md                # Tài liệu chính của dự án
```
---
## 🧪 9. Kiểm Tra Tính Năng (Testing Features)

### 💳 Kiểm tra Thanh toán VNPay

FastFood hỗ trợ kiểm thử đầy đủ với **VNPay Sandbox**, giúp mô phỏng trải nghiệm thanh toán thật 100%.

#### 🔥 Hỗ trợ:
- ✔ Thanh toán thử trong môi trường sandbox  
- ✔ Tự động chuyển hướng sang trang VNPay  
- ✔ Xác thực chữ ký HMAC-SHA512  
- ✔ Cập nhật trạng thái đơn hàng an toàn  
- ✔ Chặn mọi yêu cầu bị giả mạo hoặc chỉnh sửa dữ liệu  

#### 🧭 Quy trình kiểm thử đề xuất:
1. 🛒 Tạo đơn hàng mới  
2. 💳 Chọn phương thức thanh toán **VNPay**  
3. 🌐 Hệ thống chuyển hướng sang VNPay Sandbox  
4. 🏦 Chọn mô phỏng thanh toán thành công  
5. ↩ VNPay trả về trang `RETURN_URL`  
6. 🧾 Backend kiểm tra chữ ký và dữ liệu trả về  
7. 🟢 Đơn được cập nhật thành **ĐÃ THANH TOÁN**  

---

### 📡 Kiểm tra Theo dõi Shipper Thời gian thực (WebSocket)

FastFood cung cấp tính năng tracking shipper real-time giống GrabFood / ShopeeFood.

#### 🧩 Cách hoạt động:
- **Shipper**: gửi liên tục tọa độ GPS qua WebSocket  
- **Server**: broadcast tọa độ đến nhóm WebSocket của từng đơn  
- **Frontend**: cập nhật bản đồ, di chuyển marker và kéo dài polyline theo thời gian thực  

#### 👀 Trải nghiệm bạn sẽ thấy:
- 🚚 Marker shipper di chuyển mượt mà  
- 🛰 Đường polyline kéo dài theo hướng đi  
- ⚡ Dữ liệu cập nhật ngay lập tức, không cần reload  
- 📡 Độ trễ cực thấp, mượt trên mọi thiết bị  

---

## 🙌 10. Đóng góp phát triển (Contribution)

### 🤝 Các cách bạn có thể đóng góp
- 🎨 Cải thiện UI/UX cho trải nghiệm người dùng tốt hơn  
- 🔔 Thêm tính năng thông báo real-time (toast, email, push)  
- 🤖 Nâng cấp chatbot AI thông minh và ngữ cảnh hơn  
- 💳 Tích hợp thêm cổng thanh toán: MoMo, ZaloPay, Stripe…  
- ⚙️ Tối ưu backend, database và hiệu năng API  
- 🛰 Tăng độ ổn định WebSocket (reconnect, heartbeat, retry…)  

---

### 🧾 Quy trình tạo Pull Request
1. 🍴 **Fork** repository  
2. 🌿 Tạo branch mới  
3. 💻 Code sạch, rõ ràng, dễ đọc  
4. 📝 Ghi chú mô tả thay đổi trong PR  
5. 🔍 Kiểm tra không phá vỡ tính năng hiện tại  
6. 📤 Gửi Pull Request  

💛 *Tất cả đóng góp đều được trân trọng!*

---

### 💬 Báo lỗi & hỗ trợ
Nếu gặp lỗi hoặc muốn yêu cầu tính năng:

- 🐞 Tạo **Issue** trên GitHub  
- 📸 Đính kèm screenshot hoặc log  
- ✍️ Mô tả rõ cách tái hiện vấn đề  
- 📌 Ghi rõ mong đợi của bạn  
- 👤 **Tác giả:** Ngô Thành Danh – tinhoc7649@gmail.com  

Chúng tôi sẽ phản hồi trong thời gian sớm nhất ❤️

---

