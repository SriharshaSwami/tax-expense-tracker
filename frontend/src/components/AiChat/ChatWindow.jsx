import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAiChat } from '../../context/AiChatContext';
import api from '../../utils/api';
import { useLocation } from 'react-router-dom';

const SUGGESTED_PROMPTS = [
  "Where am I overspending?",
  "How can I save ₹5000?",
  "Summarize my financial health"
];

// Custom Markdown Parser to avoid Vite polyfill crashes
const renderMarkdown = (text) => {
  if (!text) return null;
  const paragraphs = text.split('\n\n');
  return paragraphs.map((p, i) => {
    if (p.trim().startsWith('* ') || p.trim().startsWith('- ')) {
      const listItems = p.split('\n').filter(l => l.trim().startsWith('* ') || l.trim().startsWith('- '));
      return (
        <ul key={i} className="list-none space-y-1 ml-1 mb-2 last:mb-0">
          {listItems.map((li, k) => {
            const liText = li.replace(/^[\*\-]\s/, '');
            const boldParts = liText.split(/\*\*(.*?)\*\*/g);
            return (
              <li key={k} className="leading-relaxed flex items-start gap-1.5">
                <span className="text-blue-500 mt-0.5 shrink-0">▹</span>
                <span>
                  {boldParts.map((part, j) => j % 2 === 1 ? <strong key={j} className="font-semibold text-[inherit]">{part}</strong> : <span key={j}>{part}</span>)}
                </span>
              </li>
            );
          })}
        </ul>
      );
    }
    const boldParts = p.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="leading-relaxed mb-2 last:mb-0">
        {boldParts.map((part, j) => j % 2 === 1 ? <strong key={j} className="font-semibold text-[inherit]">{part}</strong> : <span key={j}>{part}</span>)}
      </p>
    );
  });
};

const ChatWindow = () => {
  const { toggleChat, messages, addMessage, isLoading, setLoading } = useAiChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const location = useLocation();

  const getContextString = (pathname) => {
    if (pathname.includes('/savings-goals')) return "The user is currently looking at their Savings Milestones.";
    if (pathname.includes('/tax-calculator')) return "The user is currently evaluating their tax liabilities between old and new regimes.";
    if (pathname.includes('/analytics')) return "The user is looking at their visual expense and income analytics breakdowns.";
    if (pathname.includes('/ai-insights')) return "The user is exploring their AI-generated financial diagnostics and health score.";
    if (pathname.includes('/dashboard')) return "The user is viewing their main financial dashboard summary.";
    return "The user is browsing the application.";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (userText) => {
    if (!userText.trim() || isLoading) return;

    addMessage({ id: Date.now(), role: 'user', content: userText, timestamp: new Date() });
    setLoading(true);

    try {
      const recentHistory = messages.slice(-5).map(m => ({ role: m.role, content: m.content }));
      const contextString = getContextString(location.pathname);
      const response = await api.post('/assistant', { question: userText, history: recentHistory, currentContext: contextString });
      
      if (response.data && response.data.success) {
        addMessage({ id: Date.now() + 1, role: 'assistant', content: response.data.answer, timestamp: new Date() });
      } else {
        addMessage({ id: Date.now() + 1, role: 'assistant', content: "Sorry, I'm having trouble accessing your financial data right now.", timestamp: new Date() });
      }
    } catch (error) {
      console.error('Error communicating with AI:', error);
      let errorMsg = "Sorry, I'm having trouble accessing your financial data right now.";
      if (error.response && error.response.status === 429) {
        errorMsg = "I'm receiving too many requests right now! Please wait a minute and try again.";
      }
      addMessage({ id: Date.now() + 1, role: 'assistant', content: errorMsg, timestamp: new Date() });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    setInput('');
    handleSendMessage(text);
  };

  const handleClear = () => {
    console.warn("Clear conversation requested, but not implemented in context.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden origin-bottom-right"
    >
      {/* Header */}
      <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 shadow-[0_0_10px_rgba(139,92,246,0.5)] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-white">
              <rect x="3" y="6" width="18" height="14" rx="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 11h.01M16 11h.01M9 16h6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 2v4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="font-semibold tracking-wide text-sm">RupeeWise AI</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleClear} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white" title="Reset Conversation">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button onClick={toggleChat} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white" title="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col space-y-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-end space-y-3 pb-2">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-700">How can I help you today?</p>
            </div>
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="self-start text-left bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-200 text-slate-600 hover:text-blue-700 text-xs px-4 py-2 rounded-full shadow-sm transition-colors disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-2 mt-1">
                  <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
              }`}>
                {renderMarkdown(msg.content)}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-2 mt-1">
              <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex space-x-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-300 rounded-full py-2.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all shadow-inner text-slate-800 placeholder-slate-400"
            placeholder="Ask Copilot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-1 w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-90 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatWindow;
