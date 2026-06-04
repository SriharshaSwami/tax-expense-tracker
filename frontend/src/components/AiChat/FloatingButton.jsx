import React from 'react';
import { motion } from 'framer-motion';
import { useAiChat } from '../../context/AiChatContext';

const FloatingButton = () => {
  const { toggleChat, isOpen } = useAiChat();

  return (
    <motion.button
      onClick={toggleChat}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
        isOpen 
          ? 'bg-slate-800 hover:bg-slate-900 text-white shadow-xl' 
          : 'bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:shadow-[0_0_25px_rgba(139,92,246,0.8)] hover:scale-105 animate-[pulse_3s_ease-in-out_infinite]'
      }`}
    >
      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-7 h-7">
          <rect x="3" y="6" width="18" height="14" rx="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 11h.01M16 11h.01M9 16h6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2v4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {!isOpen && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
        </span>
      )}
    </motion.button>
  );
};

export default FloatingButton;
