import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import {
  fetchTransactions,
  fetchSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transactionService'
import toast from 'react-hot-toast'

const TransactionContext = createContext(null)

export const TransactionProvider = ({ children }) => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 })
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    month: '',
    year: '',
    search: '',
  })

  // Load summary totals
  const loadSummary = useCallback(async () => {
    try {
      const data = await fetchSummary()
      if (data.success) {
        setSummary(data.summary)
      }
    } catch (err) {
      console.error('Failed to load transaction summary:', err)
    }
  }, [])

  // Load all transactions matching current filters
  const loadTransactions = useCallback(async (activeFilters = filters) => {
    setLoading(true)
    try {
      const data = await fetchTransactions(activeFilters)
      if (data.success) {
        setTransactions(data.transactions)
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to fetch transactions'
      toast.error(errMsg)
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Automatically refresh transactions and summary when user changes or filters change
  useEffect(() => {
    if (user) {
      loadTransactions(filters)
      loadSummary()
    } else {
      // Reset state on logout
      setTransactions([])
      setSummary({ totalIncome: 0, totalExpense: 0, balance: 0 })
    }
  }, [user, filters, loadTransactions, loadSummary])

  // Add a new transaction
  const addTransaction = async (transactionData) => {
    setLoading(true)
    try {
      const data = await createTransaction(transactionData)
      if (data.success) {
        toast.success(data.message || 'Transaction added successfully')
        // Trigger reload
        await loadTransactions(filters)
        await loadSummary()
        return data.transaction
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to add transaction'
      toast.error(errMsg)
      throw err;
    } finally {
      setLoading(false)
    }
  }

  // Edit a transaction
  const editTransaction = async (id, transactionData) => {
    setLoading(true)
    try {
      const data = await updateTransaction(id, transactionData)
      if (data.success) {
        toast.success(data.message || 'Transaction updated successfully')
        await loadTransactions(filters)
        await loadSummary()
        return data.transaction
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update transaction'
      toast.error(errMsg)
      throw err;
    } finally {
      setLoading(false)
    }
  }

  // Delete a transaction
  const removeTransaction = async (id) => {
    try {
      const data = await deleteTransaction(id)
      if (data.success) {
        toast.success(data.message || 'Transaction deleted successfully')
        await loadTransactions(filters)
        await loadSummary()
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to delete transaction'
      toast.error(errMsg)
      throw err;
    }
  }

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters({
      type: '',
      category: '',
      month: '',
      year: '',
      search: '',
    })
  }

  const value = {
    transactions,
    summary,
    loading,
    filters,
    updateFilters,
    resetFilters,
    loadTransactions,
    loadSummary,
    addTransaction,
    editTransaction,
    removeTransaction,
  }

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
}

export const useTransactions = () => {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider')
  }
  return context
}
