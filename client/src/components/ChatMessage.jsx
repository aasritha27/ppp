import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isBot = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-4 w-full ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0 border border-amber-200 dark:border-amber-800">
          <Bot size={16} className="text-amber-600 dark:text-amber-400" />
        </div>
      )}
      
      <div className={`px-4 py-3 rounded-2xl max-w-[85%] ${
        isBot 
          ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-sm shadow-sm' 
          : 'bg-amber-600 dark:bg-amber-500 text-white rounded-tr-sm shadow-md'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-slate-600 dark:text-slate-300" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
