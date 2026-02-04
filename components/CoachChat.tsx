import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Scissors } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, ChatSender } from '../types';

const CoachChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: ChatSender.BOT,
      text: "Hello. I'm your studio assistant. Need help with fabric choices, color palettes, or design concepts?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: ChatSender.USER,
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.map(m => ({
      role: m.sender === ChatSender.USER ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const responseText = await sendMessageToGemini(history, userMsg.text);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: ChatSender.BOT,
      text: responseText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-3rem)] sm:w-96 bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden flex flex-col h-[500px] max-h-[70vh] animate-slide-up">
          
          {/* Header */}
          <div className="bg-neutral-100 dark:bg-[#111] p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-design-accent text-white rounded-full flex items-center justify-center">
                <Scissors size={14} />
              </div>
              <div>
                <h3 className="text-design-black dark:text-white font-bold text-sm uppercase tracking-wide">Studio AI</h3>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-design-black dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-[#1a1a1a]">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === ChatSender.USER ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === ChatSender.USER 
                      ? 'bg-design-black dark:bg-white text-white dark:text-black rounded-none' 
                      : 'bg-neutral-100 dark:bg-[#222] text-design-black dark:text-gray-300 rounded-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 dark:bg-[#222] px-4 py-3">
                  <span className="text-xs text-gray-500 animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-[#1a1a1a] border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none text-sm text-design-black dark:text-white focus:outline-none placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="p-2 text-design-black dark:text-white hover:opacity-50 transition-opacity disabled:opacity-30"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-design-black dark:bg-white text-white dark:text-black shadow-lg hover:scale-105 transition-transform"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default CoachChat;