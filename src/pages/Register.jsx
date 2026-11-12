// Nguy?n Th?nh Trung ? Design System, Auth & User Management
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import { userApi, errorMessage } from '../services/auth'
import { emailRule, passwordRule, profileRules } from '../services/validation'

const Register = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const formik = useFormik({
    initialValues: { email: '', name: '', password: '', confirmPassword: '', phone: '', gender: true },
    validationSchema: Yup.object({ ...profileRules, email: emailRule, password: passwordRule,
      confirmPassword: Yup.string().required('Vui lòng xác nhận mật khẩu.').oneOf([Yup.ref('password')], 'Mật khẩu xác nhận chưa khớp.'),
    }),
    onSubmit: async ({ confirmPassword, ...values }, helpers) => {
      helpers.setStatus(null)
      try {
        await userApi.post('/signup', { ...values, email: values.email.trim(), name: values.name.trim() })
        navigate('/login', { replace: true, state: { registered: true, email: values.email.trim(), from: state?.from } })
      } catch (error) { helpers.setStatus(errorMessage(error)) }
    },
  })
  return (
    <section className="auth-card auth-card-wide card mx-auto" aria-labelledby="register-heading">
      <p className="eyebrow">SHOES SHOP · TÀI KHOẢN</p>
      <h1 id="register-heading">Tạo tài khoản</h1>
      <p className="text-muted mb-4">Sẵn sàng cho đôi giày tiếp theo của bạn.</p>
      <form onSubmit={formik.handleSubmit} noValidate aria-busy={formik.isSubmitting}>
        {formik.status && <div className="alert alert-danger" role="alert">{formik.status}</div>}
        <fieldset disabled={formik.isSubmitting}>
          <div className="row">
            <div className="col-md-6"><FormField formik={formik} name="name" label="Họ tên" autoComplete="name" required /></div>
            <div className="col-md-6"><FormField formik={formik} name="email" label="Email" type="email" autoComplete="email" required /></div>
            <div className="col-md-6"><FormField formik={formik} name="password" label="Mật khẩu" type="password" autoComplete="new-password" required /></div>
            <div className="col-md-6"><FormField formik={formik} name="confirmPassword" label="Xác nhận mật khẩu" type="password" autoComplete="new-password" required /></div>
            <div className="col-md-6"><FormField formik={formik} name="phone" label="Số điện thoại" type="tel" inputMode="numeric" autoComplete="tel" required /></div>
            <div className="col-md-6"><fieldset className="mb-3"><legend className="form-label fs-6">Giới tính</legend>
              {[['Nam', true], ['Nữ', false]].map(([label, value]) => <label key={label} className="form-check form-check-inline mt-2">
                <input className="form-check-input" type="radio" name="gender" checked={formik.values.gender === value} onChange={() => formik.setFieldValue('gender', value)} />{label}
              </label>)}
            </fieldset></div>
          </div>
          <button className="btn btn-primary w-100 mt-2" type="submit">{formik.isSubmitting ? 'Đang tạo tài khoản…' : 'Đăng ký'}</button>
        </fieldset>
      </form>
      <p className="text-center mt-4 mb-0">Đã có tài khoản? <Link to="/login" state={{ from: state?.from }}>Đăng nhập</Link></p>
    </section>
  )
}

export default Register
