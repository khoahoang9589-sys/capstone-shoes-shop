// 👤 NGƯỜI LÀM: Nguyễn Thành Trung
// 📌 NHIỆM VỤ: Footer chung cho toàn trang
//
// HƯỚNG DẪN:
// - Hiển thị tên dự án, lớp học, năm
// - Nằm cuối trang (bên dưới <Outlet /> trong HomeTemplate)

import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-links">
          <section className="footer-column" aria-labelledby="footer-help">
            <h2 id="footer-help">GET HELP</h2>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/search?keyword=nike">Nike</Link></li>
              <li><Link to="/search?keyword=adidas">Adidas</Link></li>
              <li><a href="#footer-contact">Contact</a></li>
            </ul>
          </section>
          <section className="footer-column" aria-labelledby="footer-support">
            <h2 id="footer-support">SUPPORT</h2>
            <ul>
              <li><a href="#footer-about">About</a></li>
              <li id="footer-contact">Contact</li>
              <li>Help</li>
              <li>Phone</li>
            </ul>
          </section>
          <section className="footer-column" aria-labelledby="footer-register">
            <h2 id="footer-register">REGISTER</h2>
            <ul>
              <li><Link to="/register">register</Link></li>
              <li><Link to="/login">login</Link></li>
            </ul>
          </section>
        </div>
      </div>
      <div id="footer-about" className="container footer-bottom d-flex flex-wrap justify-content-between gap-3">
        <div><strong>Shoes Shop</strong><p className="small text-muted mb-0 mt-1">© {new Date().getFullYear()} · Capstone ReactJS BC97</p></div>
        <div className="small text-muted"><p className="mb-1">Hoàng Anh Khoa · Frontend & Shopping</p><p className="mb-0">Nguyễn Thành Trung · Design System & Tài khoản</p></div>
      </div>
    </footer>
  )
}

export default Footer
