import Transaction from '../models/Transaction.js';
import SavingsGoal from '../models/SavingsGoal.js';
import TaxCalculation from '../models/TaxCalculation.js';
import ai from '../config/gemini.js';

// Helper function to generate the comprehensive financial summary
const generateFinancialSummary = async (userId) => {
    // 1. Fetch the user's records
    const transactions = await Transaction.find({ user: userId });
    const savingsGoals = await SavingsGoal.find({ user: userId });
    // Fetch recent tax record if available
    const taxRecords = await TaxCalculation.find({ user: userId }).sort({ createdAt: -1 }).limit(1);
    const latestTax = taxRecords.length > 0 ? taxRecords[0] : null;

    // 2. Calculate summary data & month-over-month comparisons
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalSavings = 0; // overall goals
    const categoryBreakdown = {};

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let currentIncome = 0;
    let currentExpenses = 0;
    let prevIncome = 0;
    let prevExpenses = 0;
    const currentCategoryBreakdown = {};
    const prevCategoryBreakdown = {};

    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const isCurrentMonth = tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      const isPrevMonth = tDate.getMonth() === prevMonth && tDate.getFullYear() === prevYear;

      if (t.type === 'income') {
        totalIncome += t.amount;
        if (isCurrentMonth) currentIncome += t.amount;
        if (isPrevMonth) prevIncome += t.amount;
      } else if (t.type === 'expense') {
        totalExpenses += t.amount;
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;

        if (isCurrentMonth) {
          currentExpenses += t.amount;
          currentCategoryBreakdown[t.category] = (currentCategoryBreakdown[t.category] || 0) + t.amount;
        }
        if (isPrevMonth) {
          prevExpenses += t.amount;
          prevCategoryBreakdown[t.category] = (prevCategoryBreakdown[t.category] || 0) + t.amount;
        }
      }
    });

    savingsGoals.forEach(sg => {
      totalSavings += sg.currentAmount;
    });

    // Month-over-Month Comparisons
    const currentSavings = currentIncome - currentExpenses;
    const prevSavings = prevIncome - prevExpenses;

    const calcChange = (current, prev) => {
      if (prev === 0) return current > 0 ? 100 : 0;
      return ((current - prev) / Math.abs(prev)) * 100;
    };

    const trends = [];
    Object.keys(currentCategoryBreakdown).forEach(cat => {
      const current = currentCategoryBreakdown[cat];
      const prev = prevCategoryBreakdown[cat] || 0;
      if (prev > 0) {
        const change = ((current - prev) / prev) * 100;
        if (change > 0) {
          trends.push(`${cat} spending increased by ${change.toFixed(1)}% compared to last month.`);
        } else if (change < 0) {
          trends.push(`${cat} spending decreased by ${Math.abs(change).toFixed(1)}% compared to last month.`);
        }
      }
    });

    // Calculate Financial Health Score (0-100)
    let healthScore = 50; // Base neutral score
    if (totalIncome > 0) {
      // Expense-to-income ratio (lower is better, max +20, min -20)
      const expenseRatio = totalExpenses / totalIncome;
      if (expenseRatio <= 0.5) healthScore += 20;
      else if (expenseRatio <= 0.8) healthScore += 10;
      else if (expenseRatio > 1) healthScore -= 20;

      // Savings rate (higher is better, max +15)
      const savingsRate = totalSavings / totalIncome;
      if (savingsRate >= 0.2) healthScore += 15;
      else if (savingsRate > 0.05) healthScore += 5;
    }

    // Category diversification (max +5)
    const numCategories = Object.keys(categoryBreakdown).length;
    if (numCategories >= 3) healthScore += 5;

    // Presence of savings goals (max +10)
    if (savingsGoals.length > 0) healthScore += 10;

    // Ensure score is within 0-100
    healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

    // 3. Create the summarized financial object
    return {
      totalIncome,
      totalExpenses,
      savings: totalSavings,
      categoryBreakdown,
      healthScore,
      comparisons: {
        expenseChangePercent: calcChange(currentExpenses, prevExpenses).toFixed(1) + '%',
        incomeChangePercent: calcChange(currentIncome, prevIncome).toFixed(1) + '%',
        savingsChangePercent: calcChange(currentSavings, prevSavings).toFixed(1) + '%',
        trends
      },
      taxAnalysis: latestTax ? {
        inputs: latestTax.inputs,
        result: latestTax.result
      } : "No tax calculations performed yet."
    };
};

export const askAssistant = async (req, res) => {
  try {
    const { question, history, currentContext } = req.body;
    const userId = req.user._id;

    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const summary = await generateFinancialSummary(userId);

    let historyText = '';
    if (history && Array.isArray(history) && history.length > 0) {
      historyText = `\nPrevious Conversation Context:\n` + history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n') + `\n`;
    }
    
    let contextInstructions = '';
    if (currentContext) {
      contextInstructions = `\nUI Context: ${currentContext}\nUse this context to better understand what the user is currently seeing on their screen.\n`;
    }

    // 4. Construct the prompt for Gemini
    const prompt = `System Instructions:

You are RupeeWise AI.
You are a financial assistant for Indian users.

Rules:
* Be concise.
* Use INR (₹).
* Never invent financial data.
* Use only the provided financial summary.
* Suggest savings opportunities when possible.
* Explain tax concepts in simple language.
* Answer questions about Old vs New Regime using ONLY the provided taxAnalysis data.
* NEVER guess or assume deductions/investments that do not exist in the user's data.
* Format answers cleanly.
* When appropriate or asked, explain the user's Financial Health Score.
${contextInstructions}
Financial Summary:
${JSON.stringify(summary, null, 2)}
${historyText}
User Question:
${question}

Generate a helpful answer.`;

    // 5. Send to Gemini
    // We are using @google/genai, so: ai.models.generateContent
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.status(200).json({
      success: true,
      answer: response.text
    });

  } catch (error) {
    console.error('Error in askAssistant:', error);
    
    if (error.status === 429) {
      return res.status(429).json({ 
        success: false, 
        message: 'Rate limit exceeded. Please wait a moment.' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while communicating with the AI assistant', 
      error: error.message 
    });
  }
};

export const getDashboardInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const summary = await generateFinancialSummary(userId);

    const prompt = `Analyze the following financial summary for a user:
${JSON.stringify(summary, null, 2)}

Provide exactly 3 to 5 concise, single-sentence insights. Highlight percentage changes, savings opportunities, tax optimization, or spending trends. 
CRITICAL: Respond ONLY with a raw, valid JSON array of strings. Do not use markdown blocks, do not include \`\`\`json. Just the raw array.
Example: ["You spent 22% more on Food this month.", "Your savings rate improved by 8%."]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let responseText = response.text.trim();
    if (responseText.startsWith('\`\`\`json')) {
      responseText = responseText.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (responseText.startsWith('\`\`\`')) {
      responseText = responseText.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    const insights = JSON.parse(responseText);

    return res.status(200).json({
      success: true,
      insights
    });

  } catch (error) {
    console.error('Error in getDashboardInsights:', error);

    if (error.status === 429) {
      return res.status(429).json({ 
        success: false, 
        message: 'Rate limit exceeded. Please wait a moment.' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred generating insights', 
      error: error.message 
    });
  }
};
