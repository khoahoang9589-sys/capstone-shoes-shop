let sdkPromise

export function loadFacebookSdk({ appId, version }) {
  if (!appId || !/^\d+$/.test(appId) || !/^v\d+\.\d+$/.test(version || '')) {
    return Promise.reject(new Error('Cần cấu hình Facebook App ID và phiên bản Graph API hợp lệ.'))
  }
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    let script
    let finished = false
    let timer
    function complete(error) {
      if (finished) return
      finished = true
      clearTimeout(timer)
      if (script) { script.onload = null; script.onerror = null }
      if (error) { script?.remove(); reject(error); return }
      try {
        if (!window.FB) throw new Error('Không tải được Facebook SDK.')
        window.FB.init({ appId, version, cookie: false, xfbml: false, status: false })
        resolve(window.FB)
      } catch (error) { reject(error) }
    }
    if (window.FB) { complete(); return }
    document.getElementById('shoes-facebook-sdk')?.remove()
    script = document.createElement('script')
    script.id = 'shoes-facebook-sdk'
    script.src = 'https://connect.facebook.net/vi_VN/sdk.js'
    script.async = true
    script.defer = true
    script.crossOrigin = 'anonymous'
    script.onload = () => complete()
    script.onerror = () => complete(new Error('Không tải được Facebook. Hãy kiểm tra mạng hoặc trình chặn nội dung.'))
    timer = setTimeout(() => complete(new Error('Facebook phản hồi quá lâu. Vui lòng thử lại.')), 15000)
    document.head.appendChild(script)
  }).catch(error => { sdkPromise = undefined; throw error })
  return sdkPromise
}

// Call directly from the click handler so the browser can open the login popup.
export function requestFacebookToken(facebook) {
  return new Promise((resolve, reject) => {
    facebook.login(response => {
      const token = response?.authResponse?.accessToken
      if (response?.status === 'connected' && token) resolve(token)
      else reject(new Error('Bạn chưa hoàn tất đăng nhập Facebook. Vui lòng thử lại hoặc dùng email.'))
    }, { scope: 'public_profile,email' })
  })
}
