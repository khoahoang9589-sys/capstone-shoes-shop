import axios from 'axios'
export const TOKEN_KEY = 'accessToken'
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const clearSession = () => localStorage.removeItem(TOKEN_KEY)
export const userApi = axios.create({ baseURL: 'https://shop.cyberlearn.vn/api/Users', timeout: 20000 })
userApi.interceptors.request.use(config => {
  if (getToken()) config.headers.Authorization = `Bearer ${getToken()}`
  return config
})
userApi.interceptors.response.use(response => {
  if (response.data?.statusCode >= 400) {
    const error = new Error(response.data.message)
    error.response = { status: response.data.statusCode, data: response.data }
    return Promise.reject(error)
  }
  return response
})
export function errorMessage(error) {
  if (!error.response) return 'Không thể kết nối máy chủ. Vui lòng thử lại.'
  const message = error.response.data?.message || error.response.data?.content
  return typeof message === 'string' ? message : 'Yêu cầu không thành công. Vui lòng thử lại.'
}
// The live server exposes getProfile; getProfileV2 in the assignment returns 404.
export function getProfile(config = {}) {
  return userApi.post('/getProfile', null, config)
}

export async function signInWithFacebook(facebookToken) {
  if (!facebookToken) throw new Error('Missing Facebook token')
  const { data } = await userApi.post('/facebooklogin', { facebookToken })
  if (typeof data.content?.accessToken !== 'string' || !data.content.accessToken) {
    const error = new Error('Missing access token')
    error.response = { status: 502, data: { message: 'Máy chủ chưa cấp phiên đăng nhập. Vui lòng thử lại.' } }
    throw error
  }
  // Store only the Shoes Shop token, never the Facebook token.
  localStorage.setItem(TOKEN_KEY, data.content.accessToken)
  return data.content
}

export function profileErrorMessage(error, operation) {
  const status = error.response?.status
  const detail = error.response?.data?.content
  if (status >= 500 && typeof detail === 'string' && /Access to the path[\s\S]*is denied/i.test(detail)) {
    return `${operation}: máy chủ CyberSoft bị từ chối quyền ghi tệp. Vui lòng báo quản trị API kiểm tra quyền thư mục lưu ảnh. Bạn vẫn có thể lưu thông tin cá nhân riêng.`
  }
  if (status >= 500) {
    return `${operation}: máy chủ CyberSoft trả lỗi ${status}. Chưa thể xác nhận thay đổi đã được lưu. Vui lòng thử lại sau.`
  }
  return `${operation}: ${errorMessage(error)}`
}
export function safeReturnPath(path) {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') && !path.includes('\\') && !/^\/(login|register)(\/|\?|$)/.test(path) ? path : '/profile'
}
