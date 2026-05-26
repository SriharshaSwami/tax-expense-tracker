import React, { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const GoogleAuthButton = () => {
  const navigate = useNavigate()
  const { loginWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSuccess = async (credentialResponse) => {
    setIsLoading(true)
    try {
      // Send credential to backend for verification and login
      const response = await loginWithGoogle(credentialResponse.credential)
      
      // The backend uses HTTP-only cookies, but we fulfill the local storage requirement
      if (response?.data?.token) {
        localStorage.setItem('jwt_token', response.data.token)
      }

      toast.success('Google Login Successful!')
      navigate('/dashboard')
    } catch (err) {
      console.error('Google login failed:', err)
      toast.error(err.response?.data?.message || 'Failed to authenticate with Google')
    } finally {
      setIsLoading(false)
    }
  }

  const handleError = () => {
    toast.error('Google Authentication was cancelled or failed.')
  }

  return (
    <div className="flex flex-col items-center justify-center w-full relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-fin-bg/50 backdrop-blur-xs rounded-xl">
          <svg className="animate-spin h-5 w-5 text-fin-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      <div className={`w-full flex justify-center transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          theme="outline"
          size="large"
          shape="pill"
          text="continue_with"
        />
      </div>
    </div>
  )
}

export default GoogleAuthButton
