import * as Yup from 'yup'
export const emailRule = Yup.string().trim().email('Email không đúng định dạng.').required('Vui lòng nhập email.')
export const passwordRule = Yup.string().min(6, 'Mật khẩu cần ít nhất 6 ký tự.').required('Vui lòng nhập mật khẩu.')
export const profileRules = {
  name: Yup.string().trim().max(100, 'Họ tên tối đa 100 ký tự.').required('Vui lòng nhập họ tên.'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Số điện thoại cần đúng 10 chữ số.').required('Vui lòng nhập số điện thoại.'),
  gender: Yup.boolean().required('Vui lòng chọn giới tính.'),
}
