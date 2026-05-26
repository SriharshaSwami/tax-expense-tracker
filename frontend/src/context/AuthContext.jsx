import { createContext, useContext, useEffect, useState } from 'react'
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  googleLogin,
} from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const data = await getCurrentUser()
      setUser(data?.data?.user || data?.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (credentials) => {
    const data = await loginUser(credentials)
    setUser(data?.data?.user || data?.user)
    return data
  }

  const loginWithGoogle = async (credential) => {
    const data = await googleLogin(credential)
    setUser(data?.data?.user || data?.user)
    return data
  }

  const register = async (userData) => {
    const data = await registerUser(userData)
    setUser(data?.data?.user || data?.user)
    return data
  }

  const logout = async () => {
    await logoutUser()
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
