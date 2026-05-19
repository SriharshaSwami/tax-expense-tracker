import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import Budget from '../models/Budget.js'
import SavingsGoal from '../models/SavingsGoal.js'
import connectDB from '../config/db.js'

dotenv.config()

const seedData = async () => {
  try {
    // 1. Establish Database Connection
    console.log('Connecting to database for seeding...')
    await connectDB()

    // 2. Clear Existing Records
    console.log('Purging existing database structures...')
    await User.deleteMany()
    await Transaction.deleteMany()
    await Budget.deleteMany()
    await SavingsGoal.deleteMany()
    console.log('All collections cleared successfully!')

    // 3. Create Seed Users
    console.log('Registering premium seed users...')
    const seedUsers = await User.create([
      {
        name: 'Demo Account Manager',
        email: 'demo@example.com',
        password: 'password123',
        salary: 1500000, // 15 Lakhs
        taxRegime: 'new',
        avatar: '',
      },
      {
        name: 'Srihari Rao Portfolio',
        email: 'srihari@example.com',
        password: 'password123',
        salary: 2400000, // 24 Lakhs
        taxRegime: 'new',
        avatar: '',
      }
    ])

    const mainUser = seedUsers[0]
    console.log(`Demo Account created: ${mainUser.email} (Password: password123)`)

    // 4. Create Category Budgets (Current Month & Year)
    console.log('Seeding monthly category envelope budgets...')
    const currentMonth = new Date().getMonth() + 1 // 1-12
    const currentYear = new Date().getFullYear()

    const seedBudgets = await Budget.create([
      {
        user: mainUser._id,
        category: 'Food',
        monthlyLimit: 15000,
        spentAmount: 11450,
        month: currentMonth,
        year: currentYear,
        alertThreshold: 80,
      },
      {
        user: mainUser._id,
        category: 'Bills',
        monthlyLimit: 35000,
        spentAmount: 31200,
        month: currentMonth,
        year: currentYear,
        alertThreshold: 90,
      },
      {
        user: mainUser._id,
        category: 'Shopping',
        monthlyLimit: 25000,
        spentAmount: 8500,
        month: currentMonth,
        year: currentYear,
        alertThreshold: 75,
      },
      {
        user: mainUser._id,
        category: 'Travel',
        monthlyLimit: 12000,
        spentAmount: 13500, // Exceeded!
        month: currentMonth,
        year: currentYear,
        alertThreshold: 80,
      },
      {
        user: mainUser._id,
        category: 'Entertainment',
        monthlyLimit: 10000,
        spentAmount: 4200,
        month: currentMonth,
        year: currentYear,
        alertThreshold: 70,
      }
    ])
    console.log(`Seeded ${seedBudgets.length} envelope limit systems.`)

    // 5. Create Savings Goals Milestones
    console.log('Establishing saving goal targets...')
    const sixMonthsOut = new Date()
    sixMonthsOut.setMonth(sixMonthsOut.getMonth() + 6)

    const fourMonthsOut = new Date()
    fourMonthsOut.setMonth(fourMonthsOut.getMonth() + 4)

    const pastMonth = new Date()
    pastMonth.setMonth(pastMonth.getMonth() - 1)

    const seedGoals = await SavingsGoal.create([
      {
        user: mainUser._id,
        title: 'Emergency Reserve Fund',
        targetAmount: 300000,
        currentAmount: 185000,
        deadline: sixMonthsOut,
        status: 'active',
      },
      {
        user: mainUser._id,
        title: 'Venture Capital Crypto Pot',
        targetAmount: 50000,
        currentAmount: 50000, // Fully funded!
        deadline: pastMonth,
        status: 'completed',
      },
      {
        user: mainUser._id,
        title: 'New Macbook Pro 16-inch',
        targetAmount: 220000,
        currentAmount: 95000,
        deadline: fourMonthsOut,
        status: 'active',
      }
    ])
    console.log(`Seeded ${seedGoals.length} savings milestone records.`)

    // 6. Create realistic 25+ Transactions (Incomes & Expenses)
    console.log('Injecting 25+ structured income and expense transactions...')

    // Generate dates spread across past 30 days
    const makeDate = (daysAgo, isWeekend = false) => {
      const d = new Date()
      d.setDate(d.getDate() - daysAgo)
      if (isWeekend) {
        // Force Saturday (6) or Sunday (0)
        const day = d.getDay()
        if (day !== 0 && day !== 6) {
          d.setDate(d.getDate() + (6 - day)) // shift to Saturday
        }
      }
      return d
    }

    const transactions = [
      // INCOMES
      {
        user: mainUser._id,
        title: 'Primary Monthly Salary Credit',
        amount: 125000,
        type: 'income',
        category: 'Salary',
        date: makeDate(28),
        note: 'Direct payroll payout from corporate sponsor'
      },
      {
        user: mainUser._id,
        title: 'Freelance Web Design Retainer',
        amount: 35000,
        type: 'income',
        category: 'Freelance',
        date: makeDate(15),
        note: 'Completed landing page refactoring for client'
      },
      {
        user: mainUser._id,
        title: 'Quarterly Mutual Fund Dividend',
        amount: 12000,
        type: 'income',
        category: 'Investments',
        date: makeDate(10),
        note: 'Nifty 50 Index tracker distribution'
      },
      {
        user: mainUser._id,
        title: 'Freelance Tech Advisory session',
        amount: 15000,
        type: 'income',
        category: 'Freelance',
        date: makeDate(2),
        note: 'Architectural consult call'
      },

      // EXPENSES
      // Bills
      {
        user: mainUser._id,
        title: 'Premium Apartment Rent',
        amount: 22000,
        type: 'expense',
        category: 'Bills',
        date: makeDate(27),
        note: 'BHK society monthly accommodation lease'
      },
      {
        user: mainUser._id,
        title: 'Jio Fiber Broadband bill',
        amount: 1200,
        type: 'expense',
        category: 'Bills',
        date: makeDate(25),
        note: 'High-speed gigabit fiber internet connection'
      },
      {
        user: mainUser._id,
        title: 'Amazon Web Services Cloud VPS',
        amount: 4500,
        type: 'expense',
        category: 'Bills',
        date: makeDate(20),
        note: 'Production microservice deployment hosting costs'
      },
      {
        user: mainUser._id,
        title: 'Tata Power Electricity payout',
        amount: 3500,
        type: 'expense',
        category: 'Bills',
        date: makeDate(12),
        note: 'Summer air conditioning power grids usage'
      },

      // Food & Restaurants
      {
        user: mainUser._id,
        title: 'Whole Foods organic groceries',
        amount: 4500,
        type: 'expense',
        category: 'Food',
        date: makeDate(22),
        note: 'Stocking weekly meal preps'
      },
      {
        user: mainUser._id,
        title: 'Interactive team dinner',
        amount: 3500,
        type: 'expense',
        category: 'Food',
        date: makeDate(19, true), // Weekend!
        note: 'Weekend fine dining with coworkers'
      },
      {
        user: mainUser._id,
        title: 'Zomato weekend delivery',
        amount: 1200,
        type: 'expense',
        category: 'Food',
        date: makeDate(13, true), // Weekend!
        note: 'Weekend late night pizzas'
      },
      {
        user: mainUser._id,
        title: 'Starbucks mocha & snack',
        amount: 650,
        type: 'expense',
        category: 'Food',
        date: makeDate(8),
        note: 'Pair-programming coding session'
      },
      {
        user: mainUser._id,
        title: 'Weekly grocery basket',
        amount: 1600,
        type: 'expense',
        category: 'Food',
        date: makeDate(3),
        note: 'Fresh greens and dairy supply'
      },

      // Travel & Transport
      {
        user: mainUser._id,
        title: 'Ola Outstation weekend cab',
        amount: 3200,
        type: 'expense',
        category: 'Travel',
        date: makeDate(26, true), // Weekend!
        note: 'Weekend escape ride to Pune hills'
      },
      {
        user: mainUser._id,
        title: 'Uber Premier airport drop-off',
        amount: 1800,
        type: 'expense',
        category: 'Travel',
        date: makeDate(24),
        note: 'Catching business flight'
      },
      {
        user: mainUser._id,
        title: 'Shell Unleaded petrol refuel',
        amount: 4000,
        type: 'expense',
        category: 'Travel',
        date: makeDate(16),
        note: 'Refueling car tank'
      },
      {
        user: mainUser._id,
        title: 'Uber Auto daily commute',
        amount: 250,
        type: 'expense',
        category: 'Travel',
        date: makeDate(5),
        note: 'Co-working office transit ride'
      },
      {
        user: mainUser._id,
        title: 'Highways Toll FastTag topup',
        amount: 1000,
        type: 'expense',
        category: 'Travel',
        date: makeDate(1),
        note: 'Expressway toll credits reload'
      },

      // Shopping & Apparel
      {
        user: mainUser._id,
        title: 'Zara seasonal winter coat',
        amount: 6500,
        type: 'expense',
        category: 'Shopping',
        date: makeDate(18),
        note: 'Premium wool fit layout coat'
      },
      {
        user: mainUser._id,
        title: 'Amazon logistics desk stand',
        amount: 2000,
        type: 'expense',
        category: 'Shopping',
        date: makeDate(9),
        note: 'Ergonomic aluminum stand for MacBook'
      },

      // Entertainment & Subscriptions (ML diagnostic auditable!)
      {
        user: mainUser._id,
        title: 'Netflix Premium auto-renew',
        amount: 650,
        type: 'expense',
        category: 'Entertainment',
        date: makeDate(14),
        note: '4K Ultra-HD streaming monthly billing'
      },
      {
        user: mainUser._id,
        title: 'Spotify Family audio subscription',
        amount: 179,
        type: 'expense',
        category: 'Entertainment',
        date: makeDate(11),
        note: 'Premium music accounts monthly lease'
      },
      {
        user: mainUser._id,
        title: 'Weekend IMAX movie ticket',
        amount: 950,
        type: 'expense',
        category: 'Entertainment',
        date: makeDate(6, true), // Weekend!
        note: 'Sci-fi cinema premiere tickets'
      },
      {
        user: mainUser._id,
        title: 'GitHub Copilot subscription',
        amount: 850,
        type: 'expense',
        category: 'Entertainment',
        date: makeDate(4),
        note: 'AI programming assistant auto-renewal'
      },

      // Health
      {
        user: mainUser._id,
        title: 'Fortis Hospital consultation',
        amount: 1500,
        type: 'expense',
        category: 'Health',
        date: makeDate(23),
        note: 'General physician routine checkup'
      },
      {
        user: mainUser._id,
        title: 'Apollo Pharmacy medicines',
        amount: 850,
        type: 'expense',
        category: 'Health',
        date: makeDate(21),
        note: 'Prescribed allergy syrups and vitamins'
      }
    ]

    const seedTransactions = await Transaction.create(transactions)
    console.log(`Successfully seeded ${seedTransactions.length} transaction entries!`)

    console.log('========================================================')
    console.log(' DATABASE SEEDING COMPLETED WITH ABSOLUTE INTEGRITY! ')
    console.log('========================================================')
    
    mongoose.disconnect()
    console.log('Seeder disconnected from database.')
  } catch (error) {
    console.error('Seeder execution error occurred:', error)
    process.exit(1)
  }
}

seedData()
