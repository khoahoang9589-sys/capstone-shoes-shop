import { useNavigate, useLocation } from 'react-router-dom'
import { signInWithFacebook, errorMessage, safeReturnPath } from '../services/auth'

const APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID

export default function FacebookLoginButton() {
  const navigate = useNavigate()
  const { state } = useLocation()

  function handleLogin() {
    if (!window.FB) {
      alert('Facebook SDK bị chặn hoặc chưa tải xong. Vui lòng tắt tiện ích chặn quảng cáo (AdBlock / Brave Shields) và thử lại.')
      return
    }
    window.FB.login(function (response) {
      if (response?.authResponse?.accessToken) {
        signInWithFacebook(response.authResponse.accessToken)
          .then(() => {
            navigate(safeReturnPath(state?.from), { replace: true })
          })
          .catch(error => {
            alert(errorMessage(error))
          })
      }
    }, { scope: 'public_profile,email' })
  }

  if (!APP_ID) return null

  return (
    <div className="mt-3">
      <button type="button" className="btn btn-primary w-100" onClick={handleLogin}>
        Đăng nhập với Facebook
      </button>
    </div>
  )
}
