// 👤 NGƯỜI LÀM: Hoàng Anh Khoa
// 📌 NHIỆM VỤ: Trang tìm kiếm + lọc giá sản phẩm
//
// HƯỚNG DẪN:
// B1: Call API lấy toàn bộ sản phẩm (dùng lại getAllProduct)
// B2: Input tìm kiếm theo tên → dùng _.filter (lodash) hoặc .filter()
// B3: Lọc theo khoảng giá (minPrice, maxPrice) → dùng lodash
// B4: Render kết quả lọc dạng grid card
//
// LODASH:
//   import _ from 'lodash'
//   const result = _.filter(arrProduct, sp => sp.price >= minPrice && sp.price <= maxPrice)
//
// THAM KHẢO: reactjsbc97/src/pages/AdminPages/ProductManagement.jsx

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import _ from 'lodash'

const SearchPage = () => {
  return (
    <div>SearchPage</div>
  )
}

export default SearchPage
