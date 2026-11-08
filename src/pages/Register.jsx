// 👤 NGƯỜI LÀM: Nguyễn Thành Trung
// 📌 NHIỆM VỤ: Form đăng ký tài khoản
//
// HƯỚNG DẪN:
// B1: Dùng useFormik({ initialValues, validationSchema, onSubmit })
//     - initialValues: { name: '', password: '', phone: '', gender: true }
// B2: Validation Yup:
//     - name: required
//     - password: required, min 6
//     - phone: required, matches /^[0-9]{10}$/
//     - gender: required (true = Nam, false = Nữ)
// B3: Binding input + hiển thị lỗi
// B4: onSubmit → POST https://shop.cyberlearn.vn/api/Users/signup
//     Body: { name, password, gender, phone }
//     Nếu thành công → navigate('/login')
// B5: gender dùng radio hoặc select (true/false)
//
// THAM KHẢO: reactjsbc97/src/pages/FormDemo/DemoFormikYup.jsx

import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
  return (
    <div>Register</div>
  )
}

export default Register
