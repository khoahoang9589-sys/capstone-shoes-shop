import FacebookLogin from 'react-facebook-login/dist/facebook-login-with-button'
import { signInWithFacebook, errorMessage } from '../services/auth'
import { useNavigate, useLocation } from 'react-router-dom'
import { safeReturnPath } from '../services/auth'

const APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || ''

export default function FacebookLoginButton() {
  const navigate = useNavigate()
  const { state } = useLocation()

  async function handleResponse(response) {
    if (!response?.accessToken) return
    try {
      await signInWithFacebook(response.accessToken)
      navigate(safeReturnPath(state?.from), { replace: true })
    } catch (error) {
      alert(errorMessage(error))
    }
  }

  if (!APP_ID) return null

  return (
    <div className="mt-3">
      <FacebookLogin
        appId={APP_ID}
        autoLoad={false}
        fields="name,email,picture"
        callback={handleResponse}
        cssClass="btn btn-primary w-100"
        icon="fa-facebook"
        textButton=" Đăng nhập với Facebook"
      />
    </div>
  )
}
