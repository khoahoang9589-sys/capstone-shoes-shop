// Nguy?n Th?nh Trung ? Design System, Auth & User Management
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import FacebookLoginButton from '../components/FacebookLoginButton'
import { userApi, TOKEN_KEY, errorMessage, safeReturnPath } from '../services/auth'
import { emailRule, passwordRule } from '../services/validation'

const Login = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [facebookBusy, setFacebookBusy] = useState(false)
  const formik = useFormik({
    initialValues: { email: state?.email || '', password: '' },
    validationSchema: Yup.object({ email: emailRule, password: passwordRule }),
    onSubmit: async (values, helpers) => {
      if (facebookBusy) return
      helpers.setStatus(null)
      try {
        const { data } = await userApi.post('/signin', { ...values, email: values.email.trim() })
        if (!data.content?.accessToken) throw new Error('Missing access token')
        localStorage.setItem(TOKEN_KEY, data.content.accessToken)
        navigate(safeReturnPath(state?.from), { replace: true })
      } catch (error) { helpers.setStatus(errorMessage(error)) }
    },
  })
  return (
    <section className="auth-card card mx-auto" aria-labelledby="login-heading">
      <p className="eyebrow">SHOES SHOP · TÀI KHOẢN</p>
      <h1 id="login-heading">Chào mừng trở lại</h1>
      <p className="text-muted mb-4">Đăng nhập để tiếp tục mua sắm và quản lý hồ sơ.</p>
      {state?.registered && <div className="alert alert-success" role="status">Đăng ký thành công. Bạn có thể đăng nhập ngay.</div>}
      <form onSubmit={formik.handleSubmit} noValidate aria-busy={formik.isSubmitting}>
        {formik.status && <div className="alert alert-danger" role="alert">{formik.status}</div>}
        <fieldset disabled={formik.isSubmitting || facebookBusy}>
          <FormField formik={formik} name="email" label="Email" type="email" autoComplete="email" required />
          <FormField formik={formik} name="password" label="Mật khẩu" type="password" autoComplete="current-password" required />
          <button className="btn btn-primary w-100 mt-2" type="submit">{formik.isSubmitting ? 'Đang đăng nhập…' : 'Đăng nhập'}</button>
        </fieldset>
      </form>
      <FacebookLoginButton disabled={formik.isSubmitting} onBusyChange={setFacebookBusy}
        onError={message => formik.setStatus(message)}
        onSuccess={() => navigate(safeReturnPath(state?.from), { replace: true })} />
      <p className="text-center mt-4 mb-0">Chưa có tài khoản? <Link to="/register" state={{ from: state?.from }}>Đăng ký</Link></p>
    </section>
  )
}

export default Login
