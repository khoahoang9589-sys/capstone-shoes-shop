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
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Header = () => {
  return (
    <div>Header</div>
  )
}

export default Header
