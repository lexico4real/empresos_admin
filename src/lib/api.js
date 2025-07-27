import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_BASE_URL

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
