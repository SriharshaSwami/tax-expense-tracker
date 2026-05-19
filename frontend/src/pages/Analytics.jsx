import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import ChartCard from '../components/analytics/ChartCard'
import InsightCard from '../components/analytics/InsightCard'
import EmptyState from '../components/ui/EmptyState'
import Card from '../components/ui/Card'
import SectionHeader from '../components/ui/SectionHeader'
import {
  fetchMonthlyAnalytics,
  fetchCategoryBreakdown,
  fetchRecentTrends,
} from '../services/analyticsService'

const Analytics = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Analytical States
  const [monthlyData, setMonthlyData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [insights, setInsights] = useState(null)

  const isDark = theme === 'dark'
  const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)'
  const textColor = isDark ? '#64748b' : '#94a3b8'

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [monthlyRes, categoryRes, trendsRes] = await Promise.all([
          fetchMonthlyAnalytics(),
          fetchCategoryBreakdown(),
          fetchRecentTrends(),
        ])

        if (monthlyRes.success) setMonthlyData(monthlyRes.data)
        if (categoryRes.success) setCategoryData(categoryRes.data)
        if (trendsRes.success) setInsights(trendsRes.insights)
      } catch (err) {
        toast.error('Failed to load analytical insights')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Fintech tailored color palette
  const COLORS = ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#8B5CF6', '#F43F5E']

  const formatRupee = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 dark:bg-slate-900/95 text-white p-3.5 rounded-xl border border-slate-800 shadow-fin-lg text-xs space-y-1.5 backdrop-blur-md">
          <p className="font-bold text-slate-400">{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx} className="font-bold flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}: {formatRupee(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const savingsProgress = insights ? Math.max(0, insights.savingsRate) : 0

  const categoryIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  const monthIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )

  const savingsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  const healthIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  const isAnalyticsEmpty = monthlyData.length === 0 || monthlyData.every(d => d.income === 0 && d.expense === 0)

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  }

  return (
    <div className="min-h-screen bg-fin-bg text-fin-text-primary flex flex-col md:flex-row relative overflow-hidden">
      {/* ambient glows */}
      <div className="absolute top-[-250px] right-[-150px] h-[600px] w-[600px] rounded-full bg-teal-500/5 dark:bg-teal-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-150px] left-[-150px] h-[500px] w-[500px] rounded-full bg-indigo-500/3 dark:bg-indigo-500/5 blur-[120px] pointer-events-none z-0" />

      {/* SIDEBAR NAVIGATION */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* MOBILE MENU INTERACTIVE OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-35 bg-slate-950/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Header user={user} pageTitle="Audit Analytics" mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

        {/* MAIN BODY AREA */}
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 no-scrollbar"
        >
          <SectionHeader
            title="Analytical Insights"
            subtitle="Unlock smart visual metrics, monitor income vs. expense curves, and review your savings rates."
          />

          {/* INSIGHT CARDS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InsightCard
              title="Most Spent Category"
              value={insights?.highestSpendingCategory?.amount > 0 ? insights.highestSpendingCategory.category : 'None'}
              description={insights?.highestSpendingCategory?.amount > 0 ? `Total spent: ${formatRupee(insights.highestSpendingCategory.amount)}` : 'No expenses registered'}
              icon={categoryIcon}
              color="rose"
              loading={loading}
            />
            <InsightCard
              title="Highest Expense Month"
              value={insights?.highestExpenseMonth?.amount > 0 ? insights.highestExpenseMonth.month : 'None'}
              description={insights?.highestExpenseMonth?.amount > 0 ? `Peak expense: ${formatRupee(insights.highestExpenseMonth.amount)}` : 'No periodic spending tracked'}
              icon={monthIcon}
              color="teal"
              loading={loading}
            />
            <InsightCard
              title="Savings Rate (Current Month)"
              value={`${insights ? insights.savingsRate : 0}%`}
              description={insights ? `Net saved: ${formatRupee(insights.currentMonthIncome - insights.currentMonthExpense)}` : ''}
              icon={savingsIcon}
              color="emerald"
              loading={loading}
              progress={savingsProgress}
            />
            <InsightCard
              title="Financial Health"
              value={insights ? insights.financialHealth : 'Stable'}
              description={
                insights?.financialHealth === 'Excellent' ? 'Superb! Saving more than 30% of income.' :
                insights?.financialHealth === 'Healthy' ? 'Healthy! Saving rate between 15% and 30%.' :
                insights?.financialHealth === 'Fair' ? 'Fair. Try minimizing food or shopping costs.' :
                'Deficit! Expense exceeds current monthly income.'
              }
              icon={healthIcon}
              color={
                insights?.financialHealth === 'Excellent' || insights?.financialHealth === 'Healthy' ? 'emerald' :
                insights?.financialHealth === 'Fair' ? 'indigo' : 'rose'
              }
              loading={loading}
            />
          </div>

          {isAnalyticsEmpty && !loading ? (
            <div className="py-8">
              <EmptyState
                title="No Ledger Analytics Available"
                description="Record day-to-day expenditures or add monthly salary listings on your dashboard to unlock custom visual charts and advanced financial audits."
              />
            </div>
          ) : (
            /* CHARTS GRID & DETAILED INSIGHTS */
            <div className="space-y-8">
              {/* Row 1: Line Chart & Pie Chart */}
              <div className="grid gap-8 lg:grid-cols-3">
                {/* 1. LINE CHART: 6-Month Trend Curve */}
                <div className="lg:col-span-2">
                  <ChartCard
                    title="Ledger Trend Curves"
                    subtitle="Track income, expense, and net balances over the past 6 calendar months"
                    loading={loading}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                        <XAxis dataKey="month" stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" iconSize={8} verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12, fontWeight: 650, color: 'var(--fin-text-primary)' }} />
                        <Line type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="balance" name="Net Balance" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>

                {/* 2. PIE CHART: Category Spend Distribution */}
                <div className="lg:col-span-1">
                  <ChartCard
                    title="Category Allocation"
                    subtitle="Visual spending percentage breakdown per category"
                    loading={loading}
                  >
                    {categoryData.length === 0 ? (
                      <div className="h-full w-full flex items-center justify-center text-center p-4">
                        <span className="text-xs text-fin-text-muted">No expenses recorded yet.</span>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="45%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="amount"
                            nameKey="category"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [formatRupee(value), name]} contentStyle={{ fontSize: 12, borderRadius: 10, background: 'var(--fin-card)', borderColor: 'var(--fin-border)', color: 'var(--fin-text-primary)' }} />
                          <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 11, bottom: -10, color: 'var(--fin-text-primary)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </ChartCard>
                </div>
              </div>

              {/* Row 2: Bar Chart Comparison & Category Listing Breakdown */}
              <div className="grid gap-8 lg:grid-cols-2">
                {/* 3. BAR CHART: Income vs Expense Monthly Comparison */}
                <ChartCard
                  title="Income vs Expense Balance"
                  subtitle="Detailed month-by-month financial bar comparison"
                  loading={loading}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                      <XAxis dataKey="month" stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke={textColor} fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" iconSize={8} verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12, fontWeight: 650, color: 'var(--fin-text-primary)' }} />
                      <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* 4. CATEGORY BREAKDOWN TABLE */}
                <Card hoverable={false} className="glass-panel flex flex-col h-96">
                  <div>
                    <h3 className="text-base font-bold text-fin-text-primary tracking-tight">Category Auditing Breakdown</h3>
                    <p className="text-xs text-fin-text-muted mt-0.5">List of expenditures showing exact shares of total wallet outflows</p>
                  </div>

                  <div className="flex-1 overflow-y-auto mt-6 space-y-4 pr-1 no-scrollbar">
                    {categoryData.length === 0 ? (
                      <div className="h-full w-full flex items-center justify-center text-center">
                        <span className="text-xs text-fin-text-muted">No expense records available yet.</span>
                      </div>
                    ) : (
                      categoryData.map((item, index) => (
                        <div key={item.category} className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-full animate-pulse" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                              <span className="font-bold text-fin-text-secondary">{item.category}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-extrabold text-fin-text-primary">{formatRupee(item.amount)}</span>
                              <span className="text-fin-text-muted ml-2 font-bold">({item.percentage}%)</span>
                            </div>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.percentage}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                              className="h-2 rounded-full"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </motion.main>
      </div>
    </div>
  )
}

export default Analytics
