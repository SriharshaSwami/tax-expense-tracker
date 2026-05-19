import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import EmptyState from '../components/ui/EmptyState'
import { fetchFinancialHealth, fetchSpendingPatterns, fetchRecommendations } from '../services/insightsService'

// Sub-component: RecommendationCard
const RecommendationCard = ({ rec, onAction }) => {
  const getIcon = (category) => {
    switch (category) {
      case 'Savings':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      case 'Tax Optimizer':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.75h-15a2.25 2.25 0 00-2.25 2.25v12a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0019.5 3.75zM9 8.25h.008v.008H9V8.25zm6 7.5h.008v.008H15v-.008z" />
            </svg>
          </div>
        )
      case 'Food':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72M6.75 18h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        )
    }
  }

  const getImpactBadge = (impact) => {
    switch (impact) {
      case 'Critical':
        return <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[9px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Critical Impact</span>
      case 'High':
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[9px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">High Impact</span>
      default:
        return <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[9px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Medium Impact</span>
    }
  }

  return (
    <Card className="flex flex-col justify-between h-full space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          {getIcon(rec.category)}
          {getImpactBadge(rec.impact)}
        </div>
        <div>
          <h4 className="text-sm font-bold text-fin-text-primary">{rec.title}</h4>
          <p className="mt-1 text-xs text-fin-text-muted leading-relaxed">{rec.description}</p>
        </div>
      </div>
      <div className="pt-3.5 border-t border-fin-border">
        <button
          type="button"
          onClick={() => onAction(rec)}
          className="text-xs font-black text-emerald-650 hover:text-emerald-700 transition flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
        >
          {rec.action}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-3.5 w-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </Card>
  )
}

// Sub-component: HealthScoreCard
const HealthScoreCard = ({ score, status, suggestions, totalIncome, totalExpenses }) => {
  const radius = 55
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getScoreColor = (val) => {
    if (val >= 85) return 'text-emerald-500'
    if (val >= 70) return 'text-emerald-450'
    if (val >= 50) return 'text-amber-500'
    return 'text-rose-500'
  }

  const getScoreBgColor = (val) => {
    if (val >= 85) return 'stroke-emerald-500/10'
    if (val >= 70) return 'stroke-emerald-500/5'
    if (val >= 50) return 'stroke-amber-500/10'
    return 'stroke-rose-500/10'
  }

  const getScoreStroke = (val) => {
    if (val >= 85) return 'stroke-emerald-500'
    if (val >= 70) return 'stroke-emerald-400'
    if (val >= 50) return 'stroke-amber-550'
    return 'stroke-rose-500'
  }

  return (
    <Card hoverable={false} className="grid gap-6 md:grid-cols-3 p-6">
      {/* 1. Radial Progress Dial */}
      <div className="flex flex-col items-center justify-center p-4 border-fin-border md:border-r space-y-3">
        <h4 className="text-[10px] font-bold text-fin-text-muted uppercase tracking-widest">Health Score</h4>
        
        <div className="relative flex items-center justify-center">
          <svg className="h-36 w-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r={radius}
              className={`${getScoreBgColor(score)} fill-transparent`}
              strokeWidth="11"
            />
            <motion.circle
              cx="72"
              cy="72"
              r={radius}
              className={`${getScoreStroke(score)} fill-transparent`}
              strokeWidth="11"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center">
            <span className={`text-3xl font-black tracking-tighter ${getScoreColor(score)}`}>{score}</span>
            <span className="text-fin-text-muted text-[10px] font-bold block mt-0.5">/ 100</span>
          </div>
        </div>

        <div>
          <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
            score >= 85 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
            score >= 70 ? 'bg-emerald-500/5 text-emerald-650 dark:text-emerald-400' :
            score >= 50 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-450'
          }`}>
            {status}
          </span>
        </div>
      </div>

      {/* 2. Core Metrics Snapshot */}
      <div className="flex flex-col justify-center p-4 border-fin-border md:border-r space-y-4">
        <h4 className="text-[10px] font-bold text-fin-text-muted uppercase tracking-widest">Metrics Snapshot</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-fin-text-muted font-medium">Inflow Rate:</span>
            <span className="font-bold text-emerald-600">₹{totalIncome.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-fin-text-muted font-medium">Outflow Rate:</span>
            <span className="font-bold text-rose-550">₹{totalExpenses.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-xs border-t border-fin-border pt-3">
            <span className="text-fin-text-secondary font-bold">Monthly Net Surplus:</span>
            <span className={`font-black ${totalIncome - totalExpenses >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              ₹{(totalIncome - totalExpenses).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* 3. AI Suggestions list */}
      <div className="flex flex-col justify-center p-4 space-y-3.5">
        <h4 className="text-[10px] font-bold text-fin-text-muted uppercase tracking-widest">Diagnostic Alerts</h4>
        <ul className="space-y-2">
          {suggestions.map((s, idx) => (
            <li key={`sugg-${idx}`} className="text-xs text-fin-text-secondary flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5 shrink-0">✔</span>
              <span className="leading-relaxed">{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

// Main Component
const AIInsights = () => {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [healthData, setHealthData] = useState(null)
  const [patternData, setPatternData] = useState(null)
  const [recs, setRecs] = useState([])

  const loadData = async () => {
    setLoading(true)
    try {
      const [health, patterns, recommendations] = await Promise.all([
        fetchFinancialHealth(),
        fetchSpendingPatterns(),
        fetchRecommendations(),
      ])

      if (health.success) setHealthData(health)
      if (patterns.success) setPatternData(patterns.patterns)
      if (recommendations.success) setRecs(recommendations.recommendations)
    } catch (err) {
      console.error('Failed to load AI Insights:', err)
      toast.error('Could not retrieve AI diagnostic insights.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleActionClick = (rec) => {
    if (rec.category === 'Tax Optimizer') {
      window.location.href = '/tax-calculator'
    } else {
      toast.success(`Action: "${rec.action}" triggered successfully.`)
    }
  }

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-fin-bg text-fin-text-primary flex flex-col md:flex-row relative">
        <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header user={user} pageTitle="AI Insights" mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
          <main className="flex-1 flex flex-col items-center justify-center space-y-4">
            <svg className="animate-spin h-9 w-9 text-emerald-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-xs font-bold uppercase tracking-widest text-fin-text-muted animate-pulse">
              Running Diagnostic LLMs & Recs...
            </p>
          </main>
        </div>
      </div>
    )
  }

  const savingsRatio = healthData?.metrics?.savingsRatio || 0

  return (
    <div className="min-h-screen bg-fin-bg text-fin-text-primary flex flex-col md:flex-row relative overflow-hidden">
      {/* ambient glows */}
      <div className="absolute top-[-250px] right-[-150px] h-[600px] w-[600px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-150px] left-[-150px] h-[500px] w-[500px] rounded-full bg-indigo-500/3 dark:bg-indigo-500/5 blur-[120px] pointer-events-none z-0" />

      {/* SIDEBAR NAVIGATION */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-35 bg-slate-950/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Header user={user} pageTitle="AI Insights & Recs" mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

        {/* MAIN BODY AREA */}
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 no-scrollbar"
        >
          <SectionHeader
            title="AI Financial Diagnostics"
            subtitle="Intelligent real-time ledger auditing, subscription committed vendor detection, and tax rebates optimization."
          />

          {/* 1. Health Score Section */}
          {healthData && (
            <HealthScoreCard
              score={healthData.score}
              status={healthData.status}
              suggestions={healthData.suggestions}
              totalIncome={healthData.metrics.totalIncome}
              totalExpenses={healthData.metrics.totalExpenses}
            />
          )}

          {/* 2. Spending Patterns & subscription audits */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Behavior Spikes Card */}
            <Card hoverable={false} className="space-y-5">
              <h3 className="text-sm font-bold text-fin-text-primary flex items-center gap-2 border-b border-fin-border pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
                Behavior & Outflows Spikes
              </h3>

              {patternData && (
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-fin-text-secondary mb-2">
                      <span>Highest Spending Area: {patternData.highestCategory}</span>
                      <span className="font-extrabold text-fin-text-primary">₹{patternData.highestAmount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(10, savingsRatio))}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full bg-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Weekend Overspending Alert */}
                  <div className={`p-4 rounded-xl border flex items-start gap-3.5 transition duration-300 ${
                    patternData.weekendOverspending
                      ? 'border-rose-500/15 bg-rose-500/5 text-fin-text-primary'
                      : 'border-fin-border bg-slate-50/40 dark:bg-slate-900/10 text-fin-text-primary'
                  }`}>
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold shadow-fin-sm ${
                      patternData.weekendOverspending ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-100 dark:bg-slate-800 text-fin-text-muted'
                    }`}>
                      {patternData.weekendOverspending ? '⚠️' : '⚡'}
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="font-black text-fin-text-primary">Weekend Spending Velocity</p>
                      <p className="text-fin-text-muted leading-relaxed">
                        {patternData.weekendOverspending
                          ? `Your weekend transactions average ₹${patternData.weekendAvg.toLocaleString('en-IN')}, which is significantly higher than your weekday average of ₹${patternData.weekdayAvg.toLocaleString('en-IN')}. Consider capping weekend outflows.`
                          : `Excellent consistency! Your average weekend expense (₹${patternData.weekendAvg.toLocaleString('en-IN')}) remains balanced compared to weekdays (₹${patternData.weekdayAvg.toLocaleString('en-IN')}).`}
                      </p>
                    </div>
                  </div>

                  {/* Major Spikes */}
                  <div className="space-y-3.5">
                    <p className="text-[10px] font-bold text-fin-text-muted uppercase tracking-widest">Spending Spikes Detected</p>
                    {patternData.spendingSpikes?.length > 0 ? (
                      <div className="space-y-2">
                        {patternData.spendingSpikes.map((spike, idx) => (
                          <div key={`spike-${idx}`} className="flex justify-between items-center rounded-xl border border-fin-border p-3.5 bg-slate-50/50 dark:bg-slate-900/10 text-xs shadow-2xs">
                            <div className="space-y-0.5">
                              <p className="font-bold text-fin-text-primary">{spike.title}</p>
                              <p className="text-[10px] text-fin-text-muted">{new Date(spike.date).toLocaleDateString('en-IN')} • {spike.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-rose-550 dark:text-rose-405">₹{spike.amount.toLocaleString('en-IN')}</p>
                              <p className="text-[9px] font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full mt-1.5 inline-block">
                                {spike.multiple}x typical limit
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-fin-text-muted italic">No abnormal, out-of-character spending spikes detected.</p>
                    )}
                  </div>
                </div>
              )}
            </Card>

            {/* Subscription Auditing Panel */}
            <Card hoverable={false} className="space-y-5">
              <h3 className="text-sm font-bold text-fin-text-primary flex items-center gap-2 border-b border-fin-border pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7C4.767 9.548 4.721 10.77 4.721 12c0 1.233.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Recurring Bill Audits
              </h3>

              {patternData && (
                <div className="space-y-4">
                  <p className="text-xs text-fin-text-secondary leading-relaxed">
                    AI models group monthly transactions to flag active vendor recurring memberships. Audit items below to trim double charges or passive auto-renewals:
                  </p>

                  {patternData.recurringExpenses?.length > 0 ? (
                    <div className="space-y-2">
                      {patternData.recurringExpenses.map((sub, idx) => (
                        <div key={`rec-${idx}`} className="flex justify-between items-center rounded-xl border border-fin-border p-3.5 bg-slate-50/50 dark:bg-slate-900/10 text-xs shadow-2xs">
                          <div className="flex items-center space-x-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black">
                              ⚡
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-bold text-fin-text-primary">{sub.title}</p>
                              <p className="text-[10px] text-fin-text-muted">{sub.category} • Recurring</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-fin-text-primary">₹{sub.avgAmount.toLocaleString('en-IN')}</p>
                            <p className="text-[9px] text-fin-text-muted mt-0.5">{sub.occurrences} consecutive months</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6">
                      <EmptyState
                        title="No Recurring Outflow Items"
                        description="As you record expenditures over consecutive months, our ML algorithms will detect auto-renewing vendor patterns here."
                      />
                    </div>
                  )}

                  {/* smart tip */}
                  <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-4 flex gap-3 text-xs text-fin-text-primary">
                    <span className="text-base shrink-0">💡</span>
                    <div className="space-y-1">
                      <p className="font-extrabold text-emerald-600 dark:text-emerald-400">Proactive Optimization Tip</p>
                      <p className="text-fin-text-muted leading-relaxed">
                        Set up direct debit warnings on credit card statements. Over 18% of middle-income users pay for at least two inactive subscription streams (e.g. streaming, premium trials).
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* 3. Actionable AI Recommendations grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-fin-text-primary flex items-center gap-2 border-b border-fin-border pb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-5 w-5 text-emerald-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.904-4.43m-8.904-.666L2.25 12l8.904-4.43m0 8.334l8.905 4.43L12 12l8.905-4.43M12 12V3" />
              </svg>
              Smart Recommendations
            </h3>
            {recs.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recs.map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    rec={rec}
                    onAction={handleActionClick}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-fin-text-muted italic">No recommendations available. Keep logging data to unlock smart optimization tips.</p>
            )}
          </div>
        </motion.main>
      </div>
    </div>
  )
}

export default AIInsights
