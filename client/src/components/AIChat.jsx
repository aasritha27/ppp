import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { useAIChat } from '../hooks/useAIChat';

const AIChat = ({ onFormUpdate }) => {
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage } = useAIChat(onFormUpdate);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden relative">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center gap-3">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
          <Bot className="text-amber-600 dark:text-amber-400" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white leading-tight">AI Assistant</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase mt-0.5">Intelligent Helper</p>
        </div>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-950/50 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
            <Bot size={48} className="text-slate-400 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-[80%]">
              Describe your issue naturally, and I will extract the details straight into your form.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => <ChatMessage key={i} message={msg} />)
        )}
        
        {isLoading && (
          <div className="flex items-center gap-2 p-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
            <Loader2 className="animate-spin text-amber-500" size={16} /> AI is thinking...
          </div>
        )}
        {/* Scroll anchor removed */}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 overflow-hidden">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="w-full bg-transparent border-none pl-4 pr-14 py-3 text-sm focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-200 resize-none h-[48px] font-medium"
            onKeyDown={(e) => {
             if (e.key === 'Enter' && !e.shiftKey) {
               e.preventDefault();
               handleSubmit(e);
             }
            }}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white rounded-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;
