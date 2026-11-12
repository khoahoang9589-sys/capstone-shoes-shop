# Đăng nhập Facebook

Luồng: nút Facebook → Facebook JavaScript SDK (`FB.login`) → Facebook access token → `POST https://shop.cyberlearn.vn/api/Users/facebooklogin` với JSON `{ "facebookToken": "..." }` → lưu content.accessToken của Shoes Shop → chuyển về trang yêu cầu hoặc /profile.

API Facebook login của CyberSoft được xác minh qua Swagger. Chỉ lưu token Shoes Shop; không lưu token Facebook hay App Secret. Đăng xuất trong Profile xóa phiên Shoes Shop, không đăng xuất tài khoản Facebook trên trình duyệt.

## Kích hoạt

Hiện dự án chưa có Facebook App ID nên nút hiển thị nhưng chưa được kích hoạt. Không có App ID mẫu để giả lập đăng nhập thành công.

1. Tạo ứng dụng trong Meta Developers và thiết lập Facebook Login cho website.
2. Sao chép `.env.example` thành `.env.local`, điền App ID và phiên bản Graph API được hỗ trợ trong dashboard của ứng dụng:

   ```dotenv
   VITE_FACEBOOK_APP_ID=APP_ID_CUA_BAN
   VITE_FACEBOOK_GRAPH_VERSION=PHIEN_BAN_GRAPH_API_CUA_APP
   ```

   Phiên bản phải theo định dạng `vNN.N`. Đây là hai giá trị cấu hình công khai. Tuyệt đối không thêm App Secret vào frontend.

3. Trong cấu hình Meta, bật JavaScript SDK login và cấu hình domain/site URL hợp lệ cho địa chỉ chạy website. Sử dụng HTTPS và thiết lập tài khoản tester/developer theo chế độ ứng dụng. Domain chạy thực tế phải khớp cấu hình Meta.
4. Khởi động lại Vite sau khi đổi `.env.local`. File này đã được bỏ qua bởi `.gitignore` qua mẫu `*.local`.
5. Mở /login, bấm Tiếp tục với Facebook, chấp thuận quyền. Kiểm tra request facebooklogin có body facebookToken; server phải trả content.accessToken để vào Profile.

Nút tự tải SDK khi có cấu hình. Nếu tải lỗi có thể thử lại; popup được gọi trực tiếp trong click để tránh bị chặn do chờ tải SDK. Hủy hoặc từ chối đăng nhập không tạo phiên. Trong lúc xác thực Facebook, form mật khẩu bị khóa để tránh hai luồng đăng nhập cùng lúc.

## Kiểm tra

`node --test tests/auth.test.js tests/profile.test.js tests/facebook.test.js` và `npm run build`.

Test dùng SDK/request giả lập để kiểm tra callback thành công, hủy, thiếu cấu hình, JSON gửi đến CyberSoft và việc chỉ lưu token Shoes Shop khi backend chấp nhận. Chưa kiểm thử tài khoản Facebook thật vì chưa có App ID.

Tài liệu tham khảo:

- https://developers.facebook.com/docs/javascript/quickstart/
- https://developers.facebook.com/docs/reference/javascript/FB.login/
- https://shop.cyberlearn.vn/swagger/index.html
