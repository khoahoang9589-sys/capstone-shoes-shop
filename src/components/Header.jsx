// 👤 NGƯỜI LÀM: Hoàng Anh Khoa
// 📌 NHIỆM VỤ: Header navbar responsive, hiển thị badge số lượng giỏ hàng
// THAM KHẢO: reactjsbc97/src/components/HeaderHomeRoutes.jsx

import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getToken } from '../services/auth'

const Header = () => {
  const signedIn = Boolean(getToken())
  const { mangSanPham } = useSelector((state) => state.cartReducer)

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const tongSoLuong = mangSanPham.reduce((total, item) => total + (item.soLuong || 0), 0)

  return (
    <header className="app-navbar navbar navbar-expand-md" data-bs-theme="dark">
      <div className="container">
        <NavLink className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <span>👟</span>
          <span>Shoes Shop</span>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-md-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Trang chủ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/search">
                Tìm kiếm
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/carts">
                Giỏ hàng
                {tongSoLuong > 0 && (
                  <span className="badge bg-danger ms-1">{tongSoLuong}</span>
                )}
              </NavLink>
            </li>
            <li className="nav-item">
              {signedIn ? (
                <NavLink className="nav-link" to="/profile">
                  Tài khoản
                </NavLink>
              ) : (
                <NavLink className="nav-link" to="/login">
                  Đăng nhập
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header
