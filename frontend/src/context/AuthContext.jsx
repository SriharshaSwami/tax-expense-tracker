import { createContext, useContext, useEffect, useState } from 'react'
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  googleLogin,
} from '../services/authService'

const AuthContext = createContext(null)

/**
 * AuthProvider component that wraps the application to provide global authentication state.
 * It manages the current user's session, loading state, and provides methods for login, registration, and logout.
 */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // True while checking initial session

  /**
   * Validates the current session on mount by hitting the /api/auth/me endpoint.
   * If a valid HTTP-only cookie exists, it restores the user session.
   */
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

/**
 * Custom hook to consume the AuthContext.
 * Use this in components to access user data and authentication methods.
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
