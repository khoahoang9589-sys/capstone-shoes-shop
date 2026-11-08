// 👤 NGƯỜI LÀM: Hoàng Anh Khoa
// 📌 NHIỆM VỤ: Trang giỏ hàng — lấy data từ Redux
//
// HƯỚNG DẪN:
// B1: Lấy mangSanPham từ Redux: useSelector(state => state.cartReducer.mangSanPham)
// B2: Render bảng danh sách: hình, tên, giá, số lượng, thành tiền
// B3: Input số lượng → dispatch(capNhatSoLuong({ id, soLuong }))
// B4: Nút xóa từng SP → dispatch(xoaSPKhoiGioHang(id))
// B5: Nút "Xóa tất cả" → dispatch(xoaTatCa())
// B6: Tính tổng tiền: mangSanPham.reduce((total, sp) => total + sp.price * sp.soLuong, 0)
// B7: Nếu giỏ trống → hiện thông báo "Giỏ hàng trống" + link về trang chủ
//
// THAM KHẢO: reactjsbc97/src/pages/DemoRedux/BTGioHang.jsx + GioHangRedux.jsx

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { xoaSPKhoiGioHang, capNhatSoLuong, xoaTatCa } from '../redux/reducers/cartReducer'

const Carts = () => {
  return (
    <div>Carts</div>
  )
}

export default Carts
