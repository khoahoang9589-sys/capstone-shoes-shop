// 👤 NGƯỜI LÀM: Hoàng Anh Khoa
// 📌 NHIỆM VỤ: Trang chi tiết sản phẩm
//
// HƯỚNG DẪN:
// B1: Lấy id từ URL bằng useParams() → const { id } = useParams()
// B2: Call API: GET https://shop.cyberlearn.vn/api/Product/getbyid?id={id}
//     Kết quả: res.data.content
// B3: Hiển thị: hình ảnh, tên, giá, mô tả
// B4: Nút "Thêm vào giỏ hàng" → dispatch(themSPVaoGioHang(product))
// B5: useEffect phụ thuộc vào [id] — khi id thay đổi thì gọi lại API
//
// THAM KHẢO: reactjsbc97/src/pages/Detail.jsx

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { themSPVaoGioHang } from '../redux/reducers/cartReducer'

const Detail = () => {
  return (
    <div>Detail</div>
  )
}

export default Detail
