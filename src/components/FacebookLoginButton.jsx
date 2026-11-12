import { useEffect, useRef, useState } from 'react'
import { FaFacebook } from 'react-icons/fa'
import { loadFacebookSdk, requestFacebookToken } from '../services/facebook'
import { signInWithFacebook, errorMessage } from '../services/auth'

const config = {
  appId: import.meta.env.VITE_FACEBOOK_APP_ID?.trim(),
  version: import.meta.env.VITE_FACEBOOK_GRAPH_VERSION?.trim(),
}
const configured = Boolean(config.appId && config.version)

export default function FacebookLoginButton({ disabled, onBusyChange, onSuccess, onError }) {
  const [sdk, setSdk] = useState(null)
  const [loading, setLoading] = useState(configured)
  const [sdkError, setSdkError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [busy, setBusy] = useState(false)
  const inFlight = useRef(false)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])
  useEffect(() => {
    if (!configured) return
    let active = true
    setLoading(true)
    setSdkError('')
    loadFacebookSdk(config)
      .then(facebook => { if (active) setSdk(facebook) })
      .catch(error => { if (active) setSdkError(error.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [attempt])

  function login() {
    if (inFlight.current || disabled) return
    if (!sdk) { setAttempt(value => value + 1); return }
    inFlight.current = true
    setBusy(true)
    onBusyChange(true)
    onError(null)
    requestFacebookToken(sdk)
      .then(token => {
        if (!mounted.current) return
        return signInWithFacebook(token).then(() => {
          if (mounted.current) onSuccess()
        }, error => { if (mounted.current) onError(errorMessage(error)) })
      }, error => { if (mounted.current) onError(error.message) })
      .finally(() => {
        inFlight.current = false
        if (mounted.current) { setBusy(false); onBusyChange(false) }
      })
  }

  return <div className="mt-4">
    <div className="auth-divider mb-3"><span>hoặc</span></div>
    <button type="button" className="btn btn-facebook w-100 d-flex align-items-center justify-content-center gap-2" disabled={!configured || loading || busy || disabled} onClick={login} aria-busy={busy || loading} aria-describedby={!configured || sdkError ? 'facebook-help' : undefined}>
      <FaFacebook size={22} aria-hidden="true" />
      {busy ? 'Đang đăng nhập Facebook…' : loading ? 'Đang tải Facebook…' : sdkError ? 'Thử tải lại Facebook' : 'Tiếp tục với Facebook'}
    </button>
    {!configured && <p id="facebook-help" className="small text-muted mt-2 mb-0">Đăng nhập Facebook chưa được kích hoạt. Bạn có thể đăng nhập bằng email.</p>}
    {sdkError && <p id="facebook-help" className="small text-danger mt-2 mb-0" role="alert">{sdkError}</p>}
  </div>
}
