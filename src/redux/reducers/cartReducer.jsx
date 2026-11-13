// 👤 NGƯỜI LÀM: Hoàng Anh Khoa
// 📌 NHIỆM VỤ: Quản lý state giỏ hàng toàn cục bằng Redux Toolkit
// THAM KHẢO: reactjsbc97/src/redux/reducers/btGioHangReducer.jsx

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  mangSanPham: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. Thêm sản phẩm vào giỏ hàng
    themSPVaoGioHang: (state, action) => {
      const sp = action.payload
      if (!sp || !sp.id) return

      const spFind = state.mangSanPham.find((item) => item.id === sp.id)
      const soLuongThem = action.payload.soLuong || 1

      if (spFind) {
        spFind.soLuong += soLuongThem
      } else {
        state.mangSanPham.push({
          id: sp.id,
          name: sp.name,
          image: sp.image,
          price: Number(sp.price) || 0,
          soLuong: soLuongThem,
          size: sp.size || null,
        })
      }
    },

    // 2. Xóa sản phẩm khỏi giỏ hàng theo id
    xoaSPKhoiGioHang: (state, action) => {
      const id = action.payload
      state.mangSanPham = state.mangSanPham.filter((item) => item.id !== id)
    },

    // 3. Tăng / giảm hoặc cập nhật số lượng
    capNhatSoLuong: (state, action) => {
      const { id, soLuong, delta } = action.payload || {}
      const spFind = state.mangSanPham.find((item) => item.id === id)
      if (!spFind) return

      if (typeof delta === 'number') {
        spFind.soLuong += delta
      } else if (soLuong === 1 || soLuong === -1) {
        spFind.soLuong += soLuong
      } else if (soLuong !== undefined) {
        spFind.soLuong = Math.max(1, Math.floor(Number(soLuong) || 1))
      }

      // Đảm bảo số lượng luôn >= 1
      if (spFind.soLuong < 1) {
        spFind.soLuong = 1
      }
    },

    // 4. Xóa toàn bộ giỏ hàng
    xoaTatCa: (state) => {
      state.mangSanPham = []
    },
  },
})

export const { themSPVaoGioHang, xoaSPKhoiGioHang, capNhatSoLuong, xoaTatCa } = cartSlice.actions
export default cartSlice.reducer
