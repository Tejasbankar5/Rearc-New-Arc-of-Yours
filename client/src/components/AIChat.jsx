import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import { useArcStore } from '../store/arcStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: "I am your productivity and engineering mentor. Ask me about coding, DSA, MLOps, or your schedule." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  
  const { arc, sendChatMessage } = useArcStore();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping, isOpen]);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const userMsg = message.trim();
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setMessage('');
    setIsTyping(true);

    try {
      const context = arc ? {
        targetField: arc.targetField,
        goals: arc.goals,
        currentDay: Math.floor((new Date() - new Date(arc.startDate)) / (1000 * 60 * 60 * 24)) + 1
      } : {};
      
      const reply = await sendChatMessage(userMsg, context);
      setChatHistory(prev => [...prev, { role: 'ai', content: reply }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', content: "Connection error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-[#0A0A0F] text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center justify-center z-40 transition-all group overflow-hidden border border-[rgba(168,85,247,0.3)]"
      >
        <div className="absolute inset-0 bg-[rgba(168,85,247,0.1)] rounded-full animate-pulse"></div>
        <div className="absolute inset-1 rounded-full border border-dashed border-[rgba(168,85,247,0.3)] animate-spin" style={{animationDuration:'8s'}}></div>
        <Bot className="w-6 h-6 relative z-10 text-[#A855F7] group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed z-50 flex flex-col overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-[0_0_60px_rgba(168,85,247,0.15)] transition-all duration-300 bg-[#0A0A0F] ${
              isFullscreen 
                ? 'inset-4 rounded-2xl' 
                : 'bottom-28 right-8 w-[400px] h-[600px] rounded-2xl'
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b border-[rgba(255,255,255,0.05)] bg-[#11111A] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.2)] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#A855F7]" />
                </div>
                <div>
                  <span className="font-bold text-white text-sm">AI Mentor</span>
                  <div className="text-[10px] text-[#64748B] uppercase font-bold flex items-center gap-1 tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1 hover:bg-white/10 rounded-md transition-colors text-textMuted hover:text-textMain">
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-md transition-colors text-textMuted hover:text-red-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#030305]">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${msg.role === 'user' ? 'bg-[#A855F7] text-white border-transparent' : 'bg-[#11111A] text-white border-[rgba(255,255,255,0.05)]'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-[#A855F7]" />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm border ${
                    msg.role === 'user' 
                      ? 'bg-[#A855F7] text-white border-transparent rounded-tr-sm whitespace-pre-wrap' 
                      : 'bg-[#11111A] border-[rgba(255,255,255,0.05)] text-white rounded-tl-sm prose prose-sm prose-invert max-w-none'
                  }`}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-surface border border-borderColor text-textMain rounded-tl-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                    <span className="text-xs text-textMuted">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0A0A0F] border-t border-[rgba(255,255,255,0.05)] shrink-0">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
                  placeholder="Ask your mentor anything..."
                  className="w-full bg-[#030305] border border-[rgba(255,255,255,0.08)] rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-[rgba(168,85,247,0.4)] transition-all text-white placeholder:text-[#334155] shadow-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={!message.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#A855F7] text-white rounded-lg hover:opacity-90 disabled:opacity-40 transition-all shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
