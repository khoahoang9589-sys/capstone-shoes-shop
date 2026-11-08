// 👤 NGƯỜI LÀM: Hoàng Anh Khoa
// 📌 NHIỆM VỤ: Khởi tạo Redux Store — kết nối tất cả reducer
//
// HƯỚNG DẪN:
// - import { configureStore } from '@reduxjs/toolkit'
// - import cartReducer từ ./reducers/cartReducer
// - export const store = configureStore({ reducer: { cartReducer } })
//
// THAM KHẢO: reactjsbc97/src/redux/store.jsx

import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './reducers/cartReducer'

export const store = configureStore({
  reducer: {
    cartReducer,
  },
})
