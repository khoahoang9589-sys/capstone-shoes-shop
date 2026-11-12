# Bàn giao — Nguyễn Thành Trung

Đã triển khai design system Ocean Blue, footer, đăng ký, đăng nhập, hồ sơ, cập nhật thông tin, tải avatar và hiển thị lịch sử đơn hàng. Form dùng Formik + Yup; token lưu ở khóa `accessToken`, không lưu mật khẩu. Khi API hồ sơ trả 401/403, phiên bị xóa và người dùng quay lại đăng nhập.

## Tích hợp

- `HomeTemplate` ghép Header, Outlet, Footer để các trang con hiển thị được. Header có điều hướng cơ bản và đọc số lượng từ Redux; Thành viên 1 tiếp tục hoàn thiện phần mua sắm.
- `/profile` và `/carts` được bảo vệ bằng `RequireAuth`. Sau đăng nhập, quay lại đường dẫn đang cần truy cập; mặc định là `/profile`.
- Ảnh đề bài ghi getProfileV2 nhưng server thực tế trả 404; đã chuyển sang `POST /api/Users/getProfile` (Network người dùng xác nhận trả 200). Cập nhật dùng `POST /api/Users/updateProfile` (Network trả 200). Cả hai gửi Bearer token. Sau upload avatar cũng dùng getProfile; chỉ cập nhật avatar trong state để giữ dữ liệu cá nhân chưa lưu.
- API cập nhật hồ sơ gửi email, name, phone, gender; không gửi password để tránh vô tình thay đổi mật khẩu.
- Upload avatar gửi `FormData` với trường `file`. Swagger không mô tả tên trường upload; cần kiểm tra thực tế bằng tài khoản thử nghiệm. Giới hạn giao diện: JPG/PNG/WebP, tối đa 2 MB.
- Response uploadavatar thực tế trả HTTP 500 với `Access to the path ... is denied.`: server bị từ chối quyền ghi file trong thư mục wwwroot/files. Cần quản trị API kiểm tra quyền thư mục và cách tạo đường dẫn file; frontend không sửa được quyền server. UI nhận diện lỗi quyền ghi và phân biệt với lưu hồ sơ. Chưa xác nhận upload thành công.
- Giữ các phiên bản thư viện đã có trong dự án. PDF nêu React Router v6, dự án đang dùng v7 với cùng các API khai báo route cần thiết.

## Kiểm tra

Chạy `npm run build` và `node --test tests/auth.test.js tests/profile.test.js` trong thư mục dự án.

## Order history / Favourite

- ProfileActivity hiển thị hai tab theo mẫu, giữ theme Ocean Blue của PLAN.md. Tab hỗ trợ phím mũi tên, Home và End.
- Order history lấy ordersHistory từ hồ sơ, bảng có ID, ảnh, tên (link tới chi tiết), giá, số lượng, thành tiền; 2 đơn hàng mỗi trang. Không tạo đơn hàng mẫu khi chưa có dữ liệu.
- Favourite tải khi mở tab qua `GET /api/Users/getproductfavorite`, đọc content.productsFavorite (hoặc content là mảng). Bỏ yêu thích bằng `GET /api/Users/unlike?productId=...`, chỉ xóa khỏi giao diện sau khi API thành công. Hai API này có trong Swagger và gửi Bearer token.
- Favourite chia 6 sản phẩm/trang; khi bỏ phần tử cuối trang cuối, giao diện chuyển về trang hợp lệ. Có loading, retry, thông báo lỗi và trạng thái trống. Chưa kiểm chứng API yêu thích bằng tài khoản thật.
- Khi Thành viên 1 hoàn thành chức năng đặt hàng/thích sản phẩm, mở lại Profile hoặc tab Favourite để tải dữ liệu mới. Profile không tự tạo đơn hàng hay đánh dấu yêu thích thay cho các trang shopping.

Các bài kiểm tra tự động xác minh validation, giới tính false, đường dẫn trở về an toàn, bearer token, xóa phiên và lỗi API dạng statusCode. Các request trong bài kiểm tra được giả lập; chưa xác minh luồng tài khoản thật và avatar với server.

Kiểm thử thủ công cần phối hợp:

1. Truy cập `/profile` và `/carts` khi chưa đăng nhập: chuyển tới login.
2. Submit form trống, email sai, password ngắn, phone sai và xác nhận mật khẩu sai: lỗi hiện dưới trường tương ứng.
3. Đăng ký tài khoản mới với giới tính Nữ; xác minh gender được gửi là boolean false. Sau thành công chuyển tới login và điền sẵn email.
4. Đăng nhập sai: báo lỗi và giữ form. Đăng nhập đúng: quay về trang yêu cầu; tải lại vẫn giữ phiên.
5. Sửa họ tên/điện thoại/giới tính, lưu, tải lại để kiểm tra dữ liệu được lưu phía server.
6. Upload ảnh hợp lệ; thử file sai định dạng, lớn hơn 2 MB và trường hợp server từ chối.
7. Kiểm tra ở 375px, 768px, desktop; điều hướng bằng bàn phím và mở menu mobile.
8. Đăng xuất rồi vào lại profile. Thử token hết hạn để kiểm tra chuyển về login.
9. Luồng sản phẩm → thêm giỏ → thanh toán cần Thành viên 1 hoàn thành các trang và Redux shopping (hiện vẫn là skeleton); chưa thể kiểm thử E2E đầy đủ.
