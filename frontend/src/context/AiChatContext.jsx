import React, { createContext, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Create the context
export const AiChatContext = createContext();

// Create a custom hook to use the AiChatContext
export const useAiChat = () => {
  const context = useContext(AiChatContext);
  if (!context) {
    throw new Error('useAiChat must be used within an AiChatProvider');
  }
  return context;
};

// Create the Provider component
export const AiChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const location = useLocation();
  const isInsightsPage = location.pathname === '/ai-insights';

  // Toggle chat visibility
  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  // Add a new message to the history
  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  // Provide the state and functions to children
  const value = {
    isOpen,
    messages,
    isLoading,
    isInsightsPage,
    toggleChat,
    addMessage,
    setLoading: setIsLoading
  };

  return (
    <AiChatContext.Provider value={value}>
      {children}
    </AiChatContext.Provider>
  );
};
