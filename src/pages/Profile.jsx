// 👤 NGƯỜI LÀM: Nguyễn Thành Trung
// 📌 NHIỆM VỤ: Trang hồ sơ cá nhân
//
// HƯỚNG DẪN:
// B1: Call API GET /api/Users/getProfile (cần token trong header)
//     Token lấy từ localStorage
// B2: Hiển thị: tên, email, số điện thoại, giới tính, avatar
// B3: Chức năng đổi avatar (mở rộng):
//     - Input type="file" để chọn ảnh
//     - Upload lên API PUT /api/Users/uploadAvatar

import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Profile = () => {
  return (
    <div>Profile</div>
  )
}

export default Profile
