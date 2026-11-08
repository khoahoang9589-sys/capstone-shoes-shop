# CODE GRAPH — Shoes Shop (Capstone ReactJS BC97)
> Internal — NOT deployed. For AI agent & devs only.
> Last updated: 2026-11-08

## Documentation (docs/)
- `docs/PLAN.md` — Kế hoạch tổng thể, layout, màu sắc, workflow, đặc tả API & phân chia nhiệm vụ
- `docs/CODE_GRAPH.md` — Bản đồ liên kết các file và kiến trúc mã nguồn

## Shared (src/components/)
- `Header.jsx` — Navbar responsive, Logo, NavLinks (Home, Search, Login, Register), Cart icon badge (`useSelector` cartReducer)
- `Footer.jsx` — Thông tin footer chân trang, bản quyền, tech stack

## Templates (src/templates/)
- `HomeTemplate.jsx` — Layout wrapper gồm `<Header />`, `<main><Outlet /></main>`, `<Footer />`

## State Management (src/redux/)
- `store.jsx` — `configureStore` chứa `cartReducer`
- `reducers/cartReducer.jsx` — Slice quản lý giỏ hàng (`themSPVaoGioHang`, `xoaSPKhoiGioHang`, `capNhatSoLuong`, `xoaTatCa`)

## Pages & Routes (src/pages/)
- `HomePage.jsx` — Route `/`: Danh sách giày, fetch API `GET https://shop.cyberlearn.vn/api/Product`, render card, nút thêm giỏ
- `SearchPage.jsx` — Route `/search`: Tìm kiếm giày theo tên và lọc theo khoảng giá bằng Lodash
- `Detail.jsx` — Route `/detail/:id`: Chi tiết giày theo id `GET https://shop.cyberlearn.vn/api/Product/getbyid?id={id}`, chọn số lượng và thêm vào giỏ
- `Carts.jsx` — Route `/carts`: Danh sách sản phẩm trong giỏ (từ Redux), điều chỉnh số lượng, xóa item, tính tổng tiền
- `Login.jsx` — Route `/login`: Form đăng nhập Formik + Yup, chuyển hướng `useNavigate`
- `Register.jsx` — Route `/register`: Form đăng ký Formik + Yup, POST `https://shop.cyberlearn.vn/api/Users/signup`
- `Profile.jsx` — Route `/profile`: Hồ sơ người dùng, thông tin cá nhân và đổi avatar

## Phân chia trách nhiệm
- **Hoàng Anh Khoa**: `HomeTemplate.jsx`, `Header.jsx`, `HomePage.jsx`, `SearchPage.jsx`, `Detail.jsx`, `Carts.jsx`, `store.jsx`, `cartReducer.jsx`
- **Nguyễn Thành Trung**: `Footer.jsx`, `Login.jsx`, `Register.jsx`, `Profile.jsx`, styles `_tokens.css`, `_base.css`, `_layout.css`, `_header.css`
