// Nguy?n Th?nh Trung ? Design System, Auth & User Management
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import FormField from '../components/FormField'
import ProfileActivity from '../components/ProfileActivity'
import { userApi, getProfile, clearSession, profileErrorMessage } from '../services/auth'
import { profileRules } from '../services/validation'

const Profile = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [uploading, setUploading] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [brokenAvatar, setBrokenAvatar] = useState(false)
  function handleError(error, operation = 'Tải hồ sơ') {
    if ([401, 403].includes(error.response?.status)) {
      clearSession()
      navigate('/login', { replace: true, state: { from: '/profile' } })
    } else setError(profileErrorMessage(error, operation))
  }
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    getProfile({ signal: controller.signal })
      .then(({ data }) => {
        if (!data.content || typeof data.content !== 'object') throw new Error('Invalid profile')
        setProfile(data.content)
      })
      .catch(error => { if (!controller.signal.aborted) handleError(error) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [attempt])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { name: profile?.name || '', phone: profile?.phone || '', gender: profile?.gender ?? true },
    validationSchema: Yup.object(profileRules),
    onSubmit: async (values) => {
      setNotice(''); setError('')
      try {
        const update = { ...values, name: values.name.trim(), email: profile.email }
        await userApi.post('/updateProfile', update)
        setProfile(current => ({ ...current, ...update }))
        setNotice('Đã cập nhật hồ sơ.')
      } catch (error) { handleError(error, 'Lưu thông tin cá nhân') }
    },
  })
  async function uploadAvatar(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setError(''); setNotice('')
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setError('Vui lòng chọn ảnh JPG, PNG hoặc WebP không quá 2 MB.')
      return
    }
    setUploading(true)
    try {
      const body = new FormData()
      body.append('file', file)
      await userApi.post('/uploadavatar', body)
      setNotice('Đã tải ảnh lên máy chủ.')
      try {
        const { data } = await getProfile()
        // Only refresh the avatar so unsaved personal information stays in the form.
        setProfile(current => ({ ...current, avatar: data.content.avatar }))
        setBrokenAvatar(false)
        setNotice('Đã cập nhật ảnh đại diện.')
      } catch (error) { handleError(error, 'Ảnh đã tải lên nhưng tải lại hồ sơ thất bại') }
    } catch (error) { handleError(error, 'Đổi ảnh đại diện') }
    finally { setUploading(false) }
  }
  if (loading) return <div className="py-5 text-center" role="status"><span className="spinner-border text-primary" aria-hidden="true" /><p className="mt-3">Đang tải hồ sơ…</p></div>
  if (!profile) return <div className="alert alert-danger" role="alert">{error}<button className="btn btn-outline-primary ms-3" onClick={() => setAttempt(value => value + 1)}>Thử lại</button></div>
  return (
    <section aria-labelledby="profile-heading">
      <p className="eyebrow">TÀI KHOẢN CỦA BẠN</p>
      <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-4">
        <h1 id="profile-heading" className="mb-0">Hồ sơ cá nhân</h1>
        <button className="btn btn-outline-primary" disabled={uploading || formik.isSubmitting} onClick={() => { clearSession(); navigate('/login', { replace: true }) }}>Đăng xuất</button>
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {notice && <div className="alert alert-success" role="status">{notice}</div>}
      <div className="row g-4">
        <aside className="col-lg-4"><div className="card profile-summary text-center p-4 h-100">
          {profile.avatar && !brokenAvatar ? <img className="profile-avatar mx-auto" src={profile.avatar} alt={`Ảnh đại diện của ${profile.name}`} onError={() => setBrokenAvatar(true)} /> : <div className="profile-avatar avatar-placeholder mx-auto" aria-label="Ảnh đại diện mặc định">{profile.name?.trim().charAt(0).toUpperCase() || '?'}</div>}
          <h2 className="h4 mt-3">{profile.name}</h2><p className="text-muted text-break">{profile.email}</p>
          <label className="form-label mt-3" htmlFor="avatar">Đổi ảnh đại diện</label>
          <input className="form-control" id="avatar" type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadAvatar} disabled={uploading || formik.isSubmitting} aria-describedby="avatar-help" />
          <p id="avatar-help" className="small text-muted mt-2 mb-0" role="status">{uploading ? 'Đang tải ảnh lên…' : 'JPG, PNG, WebP · Tối đa 2 MB. Ảnh được tải lên ngay khi chọn.'}</p>
        </div></aside>
        <div className="col-lg-8"><form className="card p-4" onSubmit={formik.handleSubmit} noValidate aria-busy={formik.isSubmitting}>
          <h2 className="h4 mb-4">Thông tin cá nhân</h2>
          <fieldset disabled={formik.isSubmitting || uploading}>
            <div className="mb-3"><label htmlFor="profile-email" className="form-label">Email</label><input id="profile-email" className="form-control" value={profile.email || ''} readOnly type="email" /></div>
            <FormField formik={formik} name="name" label="Họ tên" autoComplete="name" required />
            <FormField formik={formik} name="phone" label="Số điện thoại" type="tel" autoComplete="tel" required />
            <fieldset className="mb-4"><legend className="form-label fs-6">Giới tính</legend>
              {[['Nam', true], ['Nữ', false]].map(([label, value]) => <label key={label} className="form-check form-check-inline"><input className="form-check-input" name="gender" type="radio" checked={formik.values.gender === value} onChange={() => formik.setFieldValue('gender', value)} />{label}</label>)}
            </fieldset>
            <button className="btn btn-primary" type="submit" disabled={!formik.dirty}>{formik.isSubmitting ? 'Đang lưu…' : 'Lưu thay đổi'}</button>
          </fieldset>
        </form></div>
      </div>
      <ProfileActivity ordersHistory={profile.ordersHistory} />
    </section>
  )
}

export default Profile
