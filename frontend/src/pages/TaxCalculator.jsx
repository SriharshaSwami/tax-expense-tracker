import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import EmptyState from '../components/ui/EmptyState'
import {
  calculateTax,
  saveTaxCalculation,
  fetchTaxHistory,
} from '../services/taxService'

const TaxCalculator = () => {
  const { user } = (() => {
    try {
      return useAuth()
    } catch {
      return { user: { name: 'Srihari Rao', taxRegime: 'NEW', salary: 1200000 } }
    }
  })()
  
  const activeUser = user || { name: 'Srihari Rao', taxRegime: 'NEW', salary: 1200000 }
  const { theme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [history, setHistory] = useState([])

  const isDark = theme === 'dark'
  const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)'
  const textColor = isDark ? '#64748b' : '#94a3b8'

  // Form Inputs State
  const [inputs, setInputs] = useState({
    annualSalary: activeUser.salary || '',
    otherIncome: '',
    hraExemption: '',
    deductions80C: '',
    deductions80D: '',
    homeLoanInterest: '',
    professionalTax: '',
  })

  // Calculation Result State
  const [results, setResults] = useState(null)

  // Fetch History on Mount
  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setHistoryLoading(true)
    try {
      const res = await fetchTaxHistory()
      if (res.success) {
        setHistory(res.data)
      }
    } catch (err) {
      console.error('Failed to load tax history:', err)
    } finally {
      setHistoryLoading(false)
    }
  }

  // Handle Input Changes with strict numeric validations
  const handleChange = (e) => {
    const { name, value } = e.target
    if (value === '') {
      setInputs((prev) => ({ ...prev, [name]: '' }))
      return
    }
    const num = Number(value)
    if (isNaN(num) || num < 0) {
      toast.error('Please enter a positive numeric value!')
      return
    }
    setInputs((prev) => ({ ...prev, [name]: value }))
  }

  const handleReset = () => {
    setInputs({
      annualSalary: '',
      otherIncome: '',
      hraExemption: '',
      deductions80C: '',
      deductions80D: '',
      homeLoanInterest: '',
      professionalTax: '',
    })
    setResults(null)
    toast.success('Form inputs cleared')
  }

  const handleCalculate = async (e) => {
    e.preventDefault()
    if (!inputs.annualSalary && !inputs.otherIncome) {
      toast.error('Please enter Annual Salary or Other Income!')
      return
    }

    setLoading(true)
    try {
      const parsedInputs = {
        annualSalary: Number(inputs.annualSalary) || 0,
        otherIncome: Number(inputs.otherIncome) || 0,
        hraExemption: Number(inputs.hraExemption) || 0,
        deductions80C: Number(inputs.deductions80C) || 0,
        deductions80D: Number(inputs.deductions80D) || 0,
        homeLoanInterest: Number(inputs.homeLoanInterest) || 0,
        professionalTax: Number(inputs.professionalTax) || 0,
      }

      const res = await calculateTax(parsedInputs)
      if (res.success) {
        setResults(res.data)
        toast.success('Tax regimes compared successfully!')
      }
    } catch (err) {
      toast.error('Failed to calculate tax comparison')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!results) return
    setLoading(true)
    try {
      const parsedInputs = {
        annualSalary: Number(inputs.annualSalary) || 0,
        otherIncome: Number(inputs.otherIncome) || 0,
        hraExemption: Number(inputs.hraExemption) || 0,
        deductions80C: Number(inputs.deductions80C) || 0,
        deductions80D: Number(inputs.deductions80D) || 0,
        homeLoanInterest: Number(inputs.homeLoanInterest) || 0,
        professionalTax: Number(inputs.professionalTax) || 0,
      }

      const res = await saveTaxCalculation(parsedInputs)
      if (res.success) {
        toast.success('Calculation saved to history!')
        loadHistory()
      }
    } catch (err) {
      toast.error('Failed to save calculation')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadHistoryInputs = (record) => {
    setInputs({
      annualSalary: record.inputs.annualSalary || '',
      otherIncome: record.inputs.otherIncome || '',
      hraExemption: record.inputs.hraExemption || '',
      deductions80C: record.inputs.deductions80C || '',
      deductions80D: record.inputs.deductions80D || '',
      homeLoanInterest: record.inputs.homeLoanInterest || '',
      professionalTax: record.inputs.professionalTax || '',
    })
    setResults(record.result)
    toast.success('Previous variables restored!')
  }

  const formatRupee = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const PIE_COLORS = ['#EF4444', '#10B981'] // Tax = Red, Take-home = Green

  const generateSavingInsights = () => {
    if (!results) return []
    const list = []
    const old80C = Number(inputs.deductions80C) || 0
    const old80D = Number(inputs.deductions80D) || 0

    if (old80C < 150000) {
      const remaining80C = 150000 - old80C
      list.push({
        title: 'Maximize Section 80C',
        text: `Invest an additional ${formatRupee(remaining80C)} in ELSS Mutual Funds, PPF, or NPS to lower taxable income under the Old Regime.`,
        type: 'info',
      })
    }
    if (old80D < 25000) {
      list.push({
        title: 'Health Insurance Rebate',
        text: 'Save up to ₹25,000 under Section 80D by purchasing medical insurance for self, spouse, or children.',
        type: 'success',
      })
    }
    if (results.savings.recommendedRegime === 'new') {
      list.push({
        title: 'Recommended Regime: NEW',
        text: 'The New Regime provides lower tax slabs and an increased standard deduction of ₹75,000, making it more optimal with your current deductions.',
        type: 'recommend',
      })
    } else {
      list.push({
        title: 'Recommended Regime: OLD',
        text: 'Exemptions like HRA, home loan interest, and Section 80C/80D are heavily lowering your taxable income, saving you tax under the Old Regime.',
        type: 'recommend',
      })
    }
    return list
  }

  const barChartData = results
    ? [
        {
          name: 'Old Regime',
          'Tax Payable': results.oldRegime.taxPayable,
          Deductions: results.oldRegime.totalDeductions,
        },
        {
          name: 'New Regime',
          'Tax Payable': results.newRegime.taxPayable,
          Deductions: results.newRegime.totalDeductions,
        },
      ]
    : []

  const recommendedResult = results
    ? results.savings.recommendedRegime === 'new'
      ? results.newRegime
      : results.oldRegime
    : null

  const pieChartData = results && recommendedResult
    ? [
        { name: 'Tax Paid', value: recommendedResult.taxPayable },
        { name: 'Net Take-Home', value: recommendedResult.grossIncome - recommendedResult.taxPayable },
      ]
    : []

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  }

  return (
    <div className="min-h-screen bg-fin-bg text-fin-text-primary flex flex-col md:flex-row relative overflow-hidden">
      {/* ambient glows */}
      <div className="absolute top-[-250px] right-[-150px] h-[600px] w-[600px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[130px] pointer-events-none z-0" />
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
        <Header
          user={activeUser}
          pageTitle="Tax Regime Slabs Audits"
          setMobileOpen={setMobileMenuOpen}
          mobileOpen={mobileMenuOpen}
        />

        {/* MAIN BODY AREA */}
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 no-scrollbar"
        >
          <SectionHeader
            title="Tax Slabs Comparison"
            subtitle="Compare Old vs. New Tax Regimes (FY 2024-25 Budget revision) and uncover optimized eligible deductions."
          />

          {/* TWO COLUMN CALCULATION GRID */}
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* COLUMN 1: FORM INPUTS (Spans 5 cols) */}
            <Card hoverable={false} className="lg:col-span-5 glass-panel space-y-5">
              <div>
                <h3 className="text-base font-bold tracking-tight text-fin-text-primary">Tax Parameters</h3>
                <p className="text-xs text-fin-text-muted mt-0.5">Key in salary and eligible investment exemptions</p>
              </div>

              <form onSubmit={handleCalculate} className="space-y-4">
                <Input
                  id="annualSalary"
                  name="annualSalary"
                  type="number"
                  label="Annual Gross Salary (₹)"
                  value={inputs.annualSalary}
                  onChange={handleChange}
                  placeholder="e.g. 1200000"
                  helperText="Refer to Form 16 Block A"
                />

                <Input
                  id="otherIncome"
                  name="otherIncome"
                  type="number"
                  label="Other Incomes (₹)"
                  value={inputs.otherIncome}
                  onChange={handleChange}
                  placeholder="e.g. 50000"
                  helperText="Interests, Rent, or Freelancing earnings"
                />

                {/* EXEMPTIONS ACCORDION BOX */}
                <div className="border border-fin-border dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/30 space-y-3.5">
                  <span className="text-[10px] font-bold text-fin-text-secondary uppercase tracking-widest block">
                    Exemptions (Old Regime Slabs)
                  </span>

                  <Input
                    id="hraExemption"
                    name="hraExemption"
                    type="number"
                    label="HRA Exemption (₹)"
                    value={inputs.hraExemption}
                    onChange={handleChange}
                    placeholder="e.g. 150000"
                  />

                  <Input
                    id="deductions80C"
                    name="deductions80C"
                    type="number"
                    label="Sec 80C Investments (₹)"
                    value={inputs.deductions80C}
                    onChange={handleChange}
                    placeholder="EPF, PPF, ELSS (Max 1.5L)"
                  />

                  <Input
                    id="deductions80D"
                    name="deductions80D"
                    type="number"
                    label="Sec 80D Medical Premium (₹)"
                    value={inputs.deductions80D}
                    onChange={handleChange}
                    placeholder="Medical Insurance Policies"
                  />

                  <Input
                    id="homeLoanInterest"
                    name="homeLoanInterest"
                    type="number"
                    label="Sec 24(b) Home Loan Interest (₹)"
                    value={inputs.homeLoanInterest}
                    onChange={handleChange}
                    placeholder="Interest on Self-Occupied Home Loan"
                  />

                  <Input
                    id="professionalTax"
                    name="professionalTax"
                    type="number"
                    label="Professional Tax (PT) (₹)"
                    value={inputs.professionalTax}
                    onChange={handleChange}
                    placeholder="Usually ₹2,500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="flex-1 text-xs"
                  >
                    {loading ? 'Comparing Slabs...' : 'Calculate & Compare'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleReset}
                    className="text-xs"
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Card>

            {/* COLUMN 2: COMPARISON RESULTS (Spans 7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {!results ? (
                <Card hoverable={false} className="glass-panel min-h-[500px] flex flex-col items-center justify-center">
                  <EmptyState
                    title="Regime Comparison Analysis"
                    description="Configure your salary details and eligible investments, then run comparison calculations to render optimized slabs side-by-side curves."
                  />
                </Card>
              ) : (
                /* DETAILED RESULTS */
                <div className="space-y-6">
                  {/* 1. RECOMMENDATION HERO CARD */}
                  <Card hoverable={false} className="border border-emerald-500/15 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        Optimal Advice
                      </span>
                      <h2 className="text-base font-black text-fin-text-primary tracking-tight pt-1.5">
                        {results.savings.amountSaved > 0 ? (
                          <>
                            Choose the <span className="text-emerald-600 dark:text-emerald-400 uppercase font-black">{results.savings.recommendedRegime === 'new' ? 'New Regime' : 'Old Regime'}</span>
                          </>
                        ) : (
                          <>Both regimes cost you the exact same tax</>
                        )}
                      </h2>
                      <p className="text-xs text-fin-text-secondary leading-relaxed">
                        {results.savings.amountSaved > 0 ? (
                          <>
                            You will save exactly <span className="font-extrabold text-emerald-600 dark:text-emerald-405">{formatRupee(results.savings.amountSaved)}</span> in final payable tax.
                          </>
                        ) : (
                          'Your taxable thresholds match perfectly.'
                        )}
                      </p>
                    </div>

                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      Save Comparison
                    </Button>
                  </Card>

                  {/* 2. REGIME SUMMARIES CARDS GRID */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Old Regime Summary Card */}
                    <Card hoverable={false} className="space-y-4">
                      <div className="flex items-center justify-between border-b border-fin-border pb-2">
                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-wide">OLD TAX REGIME</span>
                        <span className="text-[9px] font-bold bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 px-2 py-0.5 rounded-full">Exemptions</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-fin-text-muted">Gross Income:</span>
                          <span className="font-bold text-fin-text-secondary">{formatRupee(results.oldRegime.grossIncome)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-fin-text-muted">Total Deductions:</span>
                          <span className="font-bold text-rose-500">- {formatRupee(results.oldRegime.totalDeductions)}</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-fin-border pt-2">
                          <span className="text-fin-text-secondary">Taxable Income:</span>
                          <span className="font-bold text-fin-text-primary">{formatRupee(results.oldRegime.taxableIncome)}</span>
                        </div>
                        <div className="flex justify-between border-t border-fin-border pt-2 text-sm font-black">
                          <span className="text-fin-text-primary">Final Tax Payable:</span>
                          <span className="text-indigo-600 dark:text-indigo-400">{formatRupee(results.oldRegime.taxPayable)}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-fin-text-muted">
                          <span>Effective Rate:</span>
                          <span>{results.oldRegime.effectiveTaxRate}%</span>
                        </div>
                      </div>
                    </Card>

                    {/* New Regime Summary Card */}
                    <Card hoverable={false} className="space-y-4">
                      <div className="flex items-center justify-between border-b border-fin-border pb-2">
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide">NEW TAX REGIME</span>
                        <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 px-2 py-0.5 rounded-full">Standard</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-fin-text-muted">Gross Income:</span>
                          <span className="font-bold text-fin-text-secondary">{formatRupee(results.newRegime.grossIncome)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-fin-text-muted">Standard Rebates:</span>
                          <span className="font-bold text-emerald-550 dark:text-emerald-400">- {formatRupee(results.newRegime.totalDeductions)}</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-fin-border pt-2">
                          <span className="text-fin-text-secondary">Taxable Income:</span>
                          <span className="font-bold text-fin-text-primary">{formatRupee(results.newRegime.taxableIncome)}</span>
                        </div>
                        <div className="flex justify-between border-t border-fin-border pt-2 text-sm font-black">
                          <span className="text-fin-text-primary">Final Tax Payable:</span>
                          <span className="text-emerald-600 dark:text-emerald-400">{formatRupee(results.newRegime.taxPayable)}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-fin-text-muted">
                          <span>Effective Rate:</span>
                          <span>{results.newRegime.effectiveTaxRate}%</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* 3. RECHARTS COMPARATIVE PLOTS */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Old vs New Comparative Bar Chart */}
                    <Card hoverable={false} className="flex flex-col h-72">
                      <span className="text-xs font-bold text-fin-text-primary pb-4">Old vs. New Slabs Comparatives</span>
                      <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis dataKey="name" fontSize={11} stroke={textColor} tickLine={false} />
                            <YAxis fontSize={11} stroke={textColor} tickLine={false} />
                            <ChartTooltip formatter={(v) => [formatRupee(v)]} contentStyle={{ fontSize: 11, borderRadius: 10, background: 'var(--fin-card)', borderColor: 'var(--fin-border)', color: 'var(--fin-text-primary)' }} />
                            <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11, color: 'var(--fin-text-primary)' }} />
                            <Bar dataKey="Deductions" fill="#6366F1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Tax Payable" fill="#EF4444" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    {/* Tax vs Net Take-Home Pie Chart */}
                    <Card hoverable={false} className="flex flex-col h-72">
                      <span className="text-xs font-bold text-fin-text-primary pb-4">Tax share from Gross Earnings</span>
                      <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="45%"
                              innerRadius={45}
                              outerRadius={65}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {pieChartData.map((e, idx) => (
                                <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <ChartTooltip formatter={(v) => [formatRupee(v)]} contentStyle={{ fontSize: 11, borderRadius: 10, background: 'var(--fin-card)', borderColor: 'var(--fin-border)', color: 'var(--fin-text-primary)' }} />
                            <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11, color: 'var(--fin-text-primary)' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </div>

                  {/* 4. SMART TAX SAVINGS INSIGHTS */}
                  <Card hoverable={false} className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-fin-text-primary tracking-tight">Smart Tax Saving Insights</h3>
                      <p className="text-xs text-fin-text-muted mt-0.5">Personalized strategies to minimize tax liabilities further</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      {generateSavingInsights().map((card, idx) => (
                        <div
                          key={idx}
                          className={`border rounded-xl p-4 space-y-2 hover:shadow-fin-sm transition duration-300 ${
                            card.type === 'recommend'
                              ? 'bg-emerald-500/5 border-emerald-500/15'
                              : card.type === 'success'
                              ? 'bg-teal-500/5 border-teal-500/15'
                              : 'bg-indigo-500/5 border-indigo-500/15'
                          }`}
                        >
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              card.type === 'recommend'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : card.type === 'success'
                                ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-450'
                            }`}
                          >
                            {card.type === 'recommend' ? 'Optimization' : 'Tax Saving Sec'}
                          </span>
                          <h4 className="text-xs font-bold text-fin-text-primary">{card.title}</h4>
                          <p className="text-[10px] text-fin-text-secondary leading-relaxed">{card.text}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* THREE: HISTORICAL TAX COMPARISONS HISTORY PANEL */}
          <Card hoverable={false} className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-fin-text-primary tracking-tight">Tax Audit History</h3>
              <p className="text-xs text-fin-text-muted mt-0.5">Quickly restore variables from previous slab comparison evaluations</p>
            </div>

            {historyLoading ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-2">
                <svg className="animate-spin h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-xs text-fin-text-muted">Loading your history records...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="py-6">
                <EmptyState
                  title="No Saved Tax Slabs Comparisons"
                  description="Calculations you save will populate here for quick comparison."
                />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {history.map((record) => (
                  <div
                    key={record._id}
                    className="border border-fin-border dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/20 hover:bg-white dark:hover:bg-slate-900/50 hover:border-slate-400 dark:hover:border-slate-700 hover:shadow-fin-sm transition duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center text-[10px] text-fin-text-muted mb-2 border-b border-fin-border pb-2">
                        <span>{new Date(record.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span className="font-extrabold uppercase text-emerald-650 bg-emerald-500/10 px-2 py-0.5 rounded-sm">Recommended: {record.result.savings.recommendedRegime}</span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-fin-text-muted">Gross Income:</span>
                          <span className="font-bold text-fin-text-secondary">{formatRupee(record.inputs.annualSalary + record.inputs.otherIncome)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-fin-text-muted">Old Tax Payable:</span>
                          <span className="font-semibold text-fin-text-secondary">{formatRupee(record.result.oldRegime.taxPayable)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-fin-text-muted">New Tax Payable:</span>
                          <span className="font-semibold text-fin-text-secondary">{formatRupee(record.result.newRegime.taxPayable)}</span>
                        </div>
                        <div className="flex justify-between border-t border-fin-border pt-2 text-emerald-600 dark:text-emerald-400 font-extrabold">
                          <span>Exact Savings:</span>
                          <span>{formatRupee(record.result.savings.amountSaved)}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLoadHistoryInputs(record)}
                      className="mt-4 w-full border border-fin-border text-[10px]"
                    >
                      Restore Inputs
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.main>
      </div>
    </div>
  )
}

export default TaxCalculator
