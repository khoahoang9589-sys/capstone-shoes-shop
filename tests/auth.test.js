import test from 'node:test'
import assert from 'node:assert/strict'
import * as Yup from 'yup'
import { emailRule, passwordRule, profileRules } from '../src/services/validation.js'
import { userApi, getProfile, getToken, clearSession, safeReturnPath, errorMessage, profileErrorMessage } from '../src/services/auth.js'

test('validation rejects empty or malformed account information and accepts female gender', async () => {
  const schema = Yup.object({ ...profileRules, email: emailRule, password: passwordRule })
  const valid = { name: 'Nguyễn Thành Trung', email: 'trung@example.com', password: 'abc123', phone: '0901234567', gender: false }
  assert.equal((await schema.validate(valid)).gender, false)
  for (const invalid of [{ email: '' }, { email: 'abc' }, { name: '  ' }, { phone: '123' }, { phone: '090123456x' }, { password: '12345' }]) {
    await assert.rejects(schema.validate({ ...valid, ...invalid }), Yup.ValidationError)
  }
})

test('profile uses the live endpoint and preserves cancellation and auth errors', async () => {
  globalThis.localStorage = { getItem: () => 'test-token' }
  const originalAdapter = userApi.defaults.adapter
  const calls = []
  let failureStatus = null
  userApi.defaults.adapter = async config => {
    calls.push(config.url)
    assert.equal(config.method, 'post')
    assert.equal(config.headers.Authorization, 'Bearer test-token')
    if (failureStatus) {
      const error = new Error('Request failed')
      error.response = { status: failureStatus }
      throw error
    }
    return { data: { content: { name: 'Trung', ordersHistory: [] } }, status: 200, headers: {}, config }
  }
  try {
    await getProfile()
    assert.deepEqual(calls.splice(0), ['/getProfile'])
    for (const status of [401, 403, 404, 500]) {
      failureStatus = status
      await assert.rejects(getProfile(), error => error.response.status === status)
      assert.deepEqual(calls.splice(0), ['/getProfile'])
    }
    const controller = new AbortController()
    controller.abort()
    await assert.rejects(getProfile({ signal: controller.signal }))
    assert.deepEqual(calls, [])
  } finally { userApi.defaults.adapter = originalAdapter; delete globalThis.localStorage }
})

test('return path stays inside the app and avoids auth loops', () => {
  assert.equal(safeReturnPath('/carts?checkout=1'), '/carts?checkout=1')
  for (const path of [undefined, 'https://example.com', '//example.com', '/login', '/register?x=1', '/\\example.com']) {
    assert.equal(safeReturnPath(path), '/profile')
  }
})

test('API sends bearer token, clears session, and surfaces application errors', async () => {
  const storage = new Map([['accessToken', 'test-token']])
  globalThis.localStorage = { getItem: key => storage.get(key) ?? null, removeItem: key => storage.delete(key) }
  const originalAdapter = userApi.defaults.adapter
  try {
    userApi.defaults.adapter = async config => {
      assert.equal(config.headers.Authorization, 'Bearer test-token')
      assert.equal(config.method, 'post')
      return { data: { content: { name: 'Trung' } }, status: 200, headers: {}, config }
    }
    assert.equal((await getProfile()).data.content.name, 'Trung')
    userApi.defaults.adapter = async config => ({ data: { statusCode: 400, message: 'Email đã tồn tại' }, status: 200, headers: {}, config })
    await assert.rejects(userApi.post('/signup'), error => errorMessage(error) === 'Email đã tồn tại')
    clearSession()
    assert.equal(getToken(), null)
  } finally { userApi.defaults.adapter = originalAdapter; delete globalThis.localStorage }
})

test('profile reports which operation failed without exposing a server stack trace', () => {
  const error = { response: { status: 500, data: { message: 'Internal stack trace' } } }
  const message = profileErrorMessage(error, 'Đổi ảnh đại diện')
  assert.match(message, /Đổi ảnh đại diện/)
  assert.match(message, /500/)
  assert.doesNotMatch(message, /Internal stack trace/)
  assert.match(profileErrorMessage({ response: { status: 400, data: { message: 'Invalid image' } } }, 'Đổi ảnh đại diện'), /Invalid image/)
  const permissionError = { response: { status: 500, data: { content: "Access to the path 'C:\\private\\files\\avatar.jpg' is denied." } } }
  const permissionMessage = profileErrorMessage(permissionError, 'Đổi ảnh đại diện')
  assert.match(permissionMessage, /bị từ chối quyền ghi tệp/)
  assert.doesNotMatch(permissionMessage, /private|avatar\.jpg/)
})
