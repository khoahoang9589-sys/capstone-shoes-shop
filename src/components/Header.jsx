// 👤 NGƯỜI LÀM: Hoàng Anh Khoa
// 📌 NHIỆM VỤ: Navbar chứa Logo, Menu điều hướng, icon giỏ hàng có badge số lượng
//
// HƯỚNG DẪN:
// - Dùng NavLink từ react-router-dom (không dùng thẻ <a>)
// - NavLink có prop className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
// - Lấy tổng số lượng giỏ hàng: useSelector(state => state.cartReducer.mangSanPham)
// - Badge hiện khi tongSoLuong > 0
//
// THAM KHẢO: reactjsbc97/src/components/HeaderHomeRoutes.jsx

import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getToken } from '../services/auth'

const Header = () => {
  useLocation()
  const signedIn = Boolean(getToken())
  const quantity = useSelector(state => state.cartReducer.mangSanPham.reduce((total, item) => total + item.soLuong, 0))
  return (
    <header className="app-navbar navbar navbar-expand-md" data-bs-theme="dark">
      <nav className="container" aria-label="Điều hướng chính">
        <NavLink className="navbar-brand" to="/">Shoes Shop</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#shop-navigation" aria-controls="shop-navigation" aria-expanded="false" aria-label="Mở menu"><span className="navbar-toggler-icon" /></button>
        <div className="collapse navbar-collapse" id="shop-navigation"><div className="navbar-nav ms-auto gap-md-2">
          <NavLink className="nav-link" to="/" end>Trang chủ</NavLink>
          <NavLink className="nav-link" to="/search">Tìm kiếm</NavLink>
          <NavLink className="nav-link" to="/carts">Giỏ hàng{quantity > 0 && <span className="badge bg-light text-primary ms-2">{quantity}</span>}</NavLink>
          {signedIn ? <NavLink className="nav-link" to="/profile">Tài khoản</NavLink> : <NavLink className="nav-link" to="/login">Đăng nhập</NavLink>}
        </div></div>
      </nav>
    </header>
  )
}

export default Header
