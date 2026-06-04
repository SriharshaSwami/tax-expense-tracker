import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const AIInsightsWidget = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await api.get('/assistant/insights');
        if (response.data.success && response.data.insights) {
          setInsights(response.data.insights);
        }
      } catch (err) {
        console.error('Failed to fetch AI insights:', err);
        setError('Unable to load AI insights at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-center space-x-3 h-32">
        <div className="w-5 h-5 rounded-full bg-blue-500 animate-pulse"></div>
        <span className="text-slate-500 font-medium">FinPulse AI is analyzing your finances...</span>
      </div>
    );
  }

  if (error || insights.length === 0) {
    return null; // Silently hide if there's an error or no insights
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 shadow-md text-white mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold tracking-wide text-blue-50">AI Financial Insights</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-colors"
          >
            <p className="text-blue-50 text-sm leading-relaxed">{insight}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIInsightsWidget;
