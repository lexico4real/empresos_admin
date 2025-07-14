import axios from 'axios'
const baseUrl = 'http://185.113.249.225:3030/api/v1'

const BASE_URL = baseUrl

const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
