import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import { AuthProvider } from './context/AuthContext'
import { TransactionProvider } from './context/TransactionContext'
import { ThemeProvider } from './context/ThemeContext'
import { FullPageLoader } from './components/ui/Loader'

// Lazy Loaded Route Entry Pages
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Analytics = lazy(() => import('./pages/Analytics'))
const TaxCalculator = lazy(() => import('./pages/TaxCalculator'))
const AIInsights = lazy(() => import('./pages/AIInsights'))
const Budgets = lazy(() => import('./pages/Budgets'))
const SavingsGoals = lazy(() => import('./pages/SavingsGoals'))

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TransactionProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'toast-premium',
                duration: 4000,
                style: {
                  background: 'var(--fin-bg-panel)',
                  color: 'var(--fin-text-primary)',
                  border: '1px solid var(--fin-border)',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '650',
                  padding: '12px 18px',
                  boxShadow: 'var(--fin-shadow-md)',
                }
              }}
            />
            <Suspense fallback={<FullPageLoader label="Loading wealth auditing dashboard..." />}>
              <Routes>
                {/* Public landing or dashboard redirect if already logged in */}
                <Route path="/" element={<Home />} />
                
                {/* Authenticated Only Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tax-calculator"
                  element={
                    <ProtectedRoute>
                      <TaxCalculator />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-insights"
                  element={
                    <ProtectedRoute>
                      <AIInsights />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/budgets"
                  element={
                    <ProtectedRoute>
                      <Budgets />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/savings-goals"
                  element={
                    <ProtectedRoute>
                      <SavingsGoals />
                    </ProtectedRoute>
                  }
                />

                {/* Public Only Guest Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />

                {/* Catch all fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TransactionProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
