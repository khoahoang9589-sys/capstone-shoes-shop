// 👤 NGƯỜI LÀM: Hoàng Anh Khoa
// 📌 NHIỆM VỤ: Quản lý state giỏ hàng toàn cục
//
// HƯỚNG DẪN dùng createSlice:
// B1: initialState = { mangSanPham: [] }
//     Mỗi item trong mangSanPham: { id, name, image, price, soLuong }
//
// B2: Tạo slice với 4 reducers:
//
//   themSPVaoGioHang(state, action):
//     - action.payload là object sản phẩm { id, name, image, price }
//     - Kiểm tra xem SP đã có trong mangSanPham chưa (find theo id)
//     - Nếu có: tăng soLuong lên 1
//     - Nếu chưa: push vào mảng với soLuong = 1
//
//   xoaSPKhoiGioHang(state, action):
//     - action.payload là id của SP cần xóa
//     - Dùng .filter() để loại SP có id trùng
//
//   capNhatSoLuong(state, action):
//     - action.payload: { id, soLuong }
//     - Tìm SP theo id rồi gán soLuong mới
//
//   xoaTatCa(state):
//     - Reset mangSanPham về []
//
// THAM KHẢO: reactjsbc97/src/redux/reducers/btGioHangReducer.jsx

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  mangSanPham: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    themSPVaoGioHang: (state, action) => {
      // TODO
    },
    xoaSPKhoiGioHang: (state, action) => {
      // TODO
    },
    capNhatSoLuong: (state, action) => {
      // TODO
    },
    xoaTatCa: (state) => {
      // TODO
    },
  },
})

export const { themSPVaoGioHang, xoaSPKhoiGioHang, capNhatSoLuong, xoaTatCa } = cartSlice.actions

export default cartSlice.reducer
