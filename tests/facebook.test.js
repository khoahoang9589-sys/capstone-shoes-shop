import test from 'node:test'
import assert from 'node:assert/strict'
import { requestFacebookToken, loadFacebookSdk } from '../src/services/facebook.js'
import { userApi, signInWithFacebook } from '../src/services/auth.js'

test('Facebook login requests permissions and returns a token only after authorization', async () => {
  const sdk = { login(callback, options) {
    assert.equal(options.scope, 'public_profile,email')
    callback({ status: 'connected', authResponse: { accessToken: 'facebook-user-token' } })
  } }
  assert.equal(await requestFacebookToken(sdk), 'facebook-user-token')
  await assert.rejects(requestFacebookToken({ login: callback => callback({ status: 'unknown' }) }))
  await assert.rejects(requestFacebookToken({ login: callback => callback({ status: 'connected', authResponse: {} }) }))
})

test('missing configuration fails before downloading the Facebook SDK', async () => {
  await assert.rejects(loadFacebookSdk({ appId: '', version: '' }))
  await assert.rejects(loadFacebookSdk({ appId: '123', version: 'invalid' }))
})

test('exchange sends facebookToken to CyberSoft and stores only the returned shop token', async () => {
  const storage = new Map()
  globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) }
  const originalAdapter = userApi.defaults.adapter
  try {
    userApi.defaults.adapter = async config => {
      assert.equal(config.url, '/facebooklogin')
      assert.equal(config.method, 'post')
      assert.deepEqual(JSON.parse(config.data), { facebookToken: 'facebook-user-token' })
      return { data: { content: { accessToken: 'shop-token' } }, status: 200, headers: {}, config }
    }
    await signInWithFacebook('facebook-user-token')
    assert.deepEqual([...storage.entries()], [['accessToken', 'shop-token']])
    storage.clear()
    userApi.defaults.adapter = async config => ({ data: { content: {} }, status: 200, headers: {}, config })
    await assert.rejects(signInWithFacebook('facebook-user-token'))
    assert.equal(storage.size, 0)
    userApi.defaults.adapter = async config => ({ data: { statusCode: 401, message: 'Invalid Facebook token' }, status: 200, headers: {}, config })
    await assert.rejects(signInWithFacebook('expired-token'))
    assert.equal(storage.size, 0)
    await assert.rejects(signInWithFacebook(''))
  } finally { userApi.defaults.adapter = originalAdapter; delete globalThis.localStorage }
})
