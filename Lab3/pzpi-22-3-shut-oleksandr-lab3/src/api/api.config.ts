import axios from 'axios'

const { MODE, VITE_SERVER_URL } = import.meta.env

export const API_URL = MODE === 'production' ? 'production-link' : VITE_SERVER_URL

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
})

$api.interceptors.request.use(
  config => {
    config.withCredentials = true
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

export default $api
