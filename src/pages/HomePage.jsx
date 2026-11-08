// 👤 NGƯỜI LÀM: Hoàng Anh Khoa
// 📌 NHIỆM VỤ: Trang chủ — hiển thị danh sách sản phẩm giày
//
// HƯỚNG DẪN:
// B1: Khai báo state: arrProduct = [], loading = true, error = null
// B2: Tạo hàm getAllProduct — dùng axios.get(API_URL)
//     API: https://shop.cyberlearn.vn/api/Product
//     Kết quả: res.data.content
// B3: Gọi getAllProduct trong useEffect ([] — chỉ gọi 1 lần khi component mount)
// B4: Render danh sách bằng arrProduct.map(...)
// B5: Nút "Thêm vào giỏ" → dispatch(themSPVaoGioHang(product))
//
// THAM KHẢO: reactjsbc97/src/pages/AdminPages/ProductManagement.jsx (phần call API + render)

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { themSPVaoGioHang } from '../redux/reducers/cartReducer'

const API_URL = 'https://shop.cyberlearn.vn/api/Product'

const HomePage = () => {
  return (
    <div>HomePage</div>
  )
}

export default HomePage
