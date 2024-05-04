import axios from 'axios'

const axiosConfig = axios.create({
  baseURL: 'http://localhost:5000/',
  timeout: 15000, // miliseconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

axiosConfig.interceptors.request.use((config) => {
  const token = localStorage.getItem('user-token') // Replace 'user-token' with your token's key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
export default axiosConfig
