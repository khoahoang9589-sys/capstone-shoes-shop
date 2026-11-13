# CODE GRAPH — Shoes Shop (Capstone ReactJS BC97)
> Internal — NOT deployed. For AI agent & devs only.
> Last updated: 2026-11-13

## Documentation (docs/)
- `docs/PLAN.md` — Kế hoạch tổng thể, layout, màu sắc, workflow, đặc tả API & phân chia nhiệm vụ
- `docs/CODE_GRAPH.md` — Bản đồ liên kết các file và kiến trúc mã nguồn
- `docs/THANH_VIEN_1.md` — Báo cáo bàn giao phần việc của Thành viên 1 (Hoàng Anh Khoa)
- `docs/THANH_VIEN_2.md` — Báo cáo bàn giao phần việc của Thành viên 2 (Nguyễn Thành Trung)
- `docs/FACEBOOK_LOGIN.md` — Hướng dẫn cấu hình đăng nhập Facebook

## Shared Components (src/components/)
- `Header.jsx` — Navbar responsive, Logo Shoes Shop, NavLinks (Home, Search, Carts badge với số lượng SP từ Redux, Profile/Login)
- `Footer.jsx` — Chân trang, bản quyền, tech stack và thông tin liên hệ
- `FormField.jsx` — Component ô nhập liệu tích hợp Formik validation
- `FacebookLoginButton.jsx` — Nút xác thực đăng nhập qua Facebook SDK
- `ProfileActivity.jsx` — Hiển thị hai tab Lịch sử đơn hàng (Order History) và Sản phẩm yêu thích (Favourites)
- `RequireAuth.jsx` — Route guard kiểm tra accessToken trước khi vào `/profile` và `/carts`

## Templates (src/templates/)
- `HomeTemplate.jsx` — Shell layout wrapper: `<Header />`, `<main><Outlet /></main>`, `<Footer />`

## State Management (src/redux/)
- `store.jsx` — Redux Toolkit store kết nối `cartReducer`
- `reducers/cartReducer.jsx` — Slice quản lý giỏ hàng (`themSPVaoGioHang`, `xoaSPKhoiGioHang`, `capNhatSoLuong`, `xoaTatCa`)

## Pages & Routes (src/pages/)
- `HomePage.jsx` — Route `/`: Hero banner, phân loại tabs danh mục (Tất cả, Nike, Adidas, Vans & Converse), danh sách sản phẩm từ API `GET /api/Product`, xem chi tiết và thêm vào giỏ hàng kèm toast phản hồi
- `Detail.jsx` — Route `/detail/:id`: Chi tiết giày từ API `GET /api/Product/getbyid?id={id}`, chọn size, tùy chỉnh số lượng, thêm giỏ hàng, và danh sách sản phẩm tương tự
- `SearchPage.jsx` — Route `/search`: Tìm kiếm giày theo tên, bộ lọc khoảng giá và sắp xếp linh hoạt bằng Lodash (`_.filter`, `_.orderBy`)
- `Carts.jsx` — Route `/carts` (RequireAuth): Quản lý bảng giỏ hàng, tăng/giảm số lượng, xóa từng SP hoặc xóa tất cả, tóm tắt thanh toán, gọi API `POST /api/Users/order`
- `Login.jsx` — Route `/login`: Form đăng nhập Formik + Yup, đăng nhập bằng tài khoản hoặc Facebook
- `Register.jsx` — Route `/register`: Form đăng ký Formik + Yup, gửi thông tin tài khoản mới lên API
- `Profile.jsx` — Route `/profile` (RequireAuth): Quản lý thông tin tài khoản, cập nhật hồ sơ cá nhân và đổi avatar

## Services (src/services/)
- `auth.js` — Cấu hình `userApi` axios instance, quản lý token, `getProfile`, Facebook login handler
- `validation.js` — Quy tắc kiểm tra tính hợp lệ bằng Yup cho Auth & Profile
- `facebook.js` — SDK Facebook wrapper
- `profileData.js` — Dữ liệu và tiện ích hồ sơ

## Test Suites (tests/)
- `tests/cart.test.js` — Kiểm thử giỏ hàng Redux, tính toán tiền/số lượng, lọc Lodash và cấu trúc đặt hàng
- `tests/auth.test.js` — Kiểm thử quy tắc validation, API profile, an toàn return path
- `tests/profile.test.js` — Kiểm thử phân trang đơn hàng, danh sách yêu thích
- `tests/facebook.test.js` — Kiểm thử quy trình Facebook login SDK & CyberSoft exchange token

## Phân chia trách nhiệm
- **Hoàng Anh Khoa (Thành viên 1)**: `Header.jsx`, `HomeTemplate.jsx`, `HomePage.jsx`, `Detail.jsx`, `Carts.jsx`, `SearchPage.jsx`, `store.jsx`, `cartReducer.jsx`, `cart.test.js`
- **Nguyễn Thành Trung (Thành viên 2)**: `Footer.jsx`, `Login.jsx`, `Register.jsx`, `Profile.jsx`, `ProfileActivity.jsx`, `FacebookLoginButton.jsx`, `_tokens.css`, `_base.css`, `_layout.css`, `_header.css`, `_profile.css`, `auth.test.js`, `profile.test.js`, `facebook.test.js`
