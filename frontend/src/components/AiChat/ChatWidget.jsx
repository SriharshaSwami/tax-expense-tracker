import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAiChat } from '../../context/AiChatContext';
import { useAuth } from '../../context/AuthContext';
import FloatingButton from './FloatingButton';
import ChatWindow from './ChatWindow';

const ChatWidget = () => {
  const { isOpen, isInsightsPage } = useAiChat();
  const { user } = useAuth();

  if (!user || isInsightsPage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      <AnimatePresence>
        {isOpen && <ChatWindow />}
      </AnimatePresence>
      <FloatingButton />
    </div>
  );
};

export default ChatWidget;
