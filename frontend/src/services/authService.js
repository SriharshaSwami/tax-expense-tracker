import api from '../utils/api'

export const registerUser = async (userData) => {
  const { data } = await api.post('/auth/register', userData)
  return data
}

export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials)
  return data
}

export const logoutUser = async () => {
  const { data } = await api.post('/auth/logout')
  return data
}

export const getCurrentUser = async () => {
  const { data } = await api.get('/auth/me')
  return data
}
