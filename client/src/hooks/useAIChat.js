import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useAIChat = (onFormUpdate) => {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          language: i18n.language
        })
      });

      const data = await res.json();
      
      if (data.content) {
        let replyText = data.content;
        let extractedData = {};
        
        // The backend instructs the AI to hide extracted JSON inside HTML comments
        const match = replyText.match(/<!--FORM_DATA:(.*?)-->/);
        if (match) {
          try { 
            extractedData = JSON.parse(match[1]); 
          } catch(e) {
            console.error("Failed to parse extracted JSON:", e);
          }
          replyText = replyText.replace(/<!--FORM_DATA:.*?-->/s, '').trim();
        }

        setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
        
        if (Object.keys(extractedData).length > 0 && onFormUpdate) {
          onFormUpdate(extractedData);
        }
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.error }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
};
