import api from './api'

export async function requestLoginOtp(email, password) {
  const res = await api.post('/users/otp', { email, password })
  const secret = res.data?.secret
  return secret
}

export async function loginWithOtp(email, password, otp, secret) {
  if (!secret) throw new Error('Missing login secret')

  const res = await api.post('/users/sign-in', {
    email,
    password,
    otp,
    secret,
  })

  const { accessToken } = res.data
  localStorage.setItem('accessToken', accessToken)
  return accessToken
}

export async function getAllCustomers(params = {}) {
  return api.get('/users', { params })
}
