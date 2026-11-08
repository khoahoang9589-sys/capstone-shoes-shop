// 👤 NGƯỜI LÀM: Nguyễn Thành Trung
// 📌 NHIỆM VỤ: Form đăng nhập với Formik + Yup
//
// HƯỚNG DẪN:
// B1: Dùng useFormik({ initialValues, validationSchema, onSubmit })
//     - initialValues: { email: '', password: '' }
//     - validationSchema: Yup.object({ email: Yup.string().email().required(), password: Yup.string().min(6).required() })
// B2: Binding: value={formik.values.email} onInput={formik.handleChange}
// B3: Hiển thị lỗi: {formik.errors.email}
// B4: onSubmit → gọi API POST /api/Users/signin (mở rộng)
// B5: Nếu thành công → navigate('/profile')
// B6: Nếu thất bại → navigate('/register')
//
// THAM KHẢO: reactjsbc97/src/pages/Login.jsx (dùng useFormik + Yup đầy đủ)

import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { NavLink, useNavigate } from 'react-router-dom'

const Login = () => {
  return (
    <div>Login</div>
  )
}

export default Login
