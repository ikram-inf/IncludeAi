import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, ArrowUp, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  initialPrompt = '',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Absolutely — let's make this feel less tangled. ✨

**The big idea:** Big intimidating tasks are much easier when we turn them into a few tiny questions instead of one huge mountain.

**Try asking me:**
1. How to break down an assignment or study task
2. What to do if you're stuck or overwhelmed right now
3. A quick 5-minute starting plan for your current focus goal`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      setInput(`Help me break down: "${initialPrompt}"`);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      if (data.reply) {
        const assistantMsg: ChatMessage = {
          id: `ast-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (e: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `ast-err-${Date.now()}`,
          role: 'assistant',
          content: "Let's take a deep breath. I'm right here with you. Try asking me again or picking one of the quick suggestions below!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Break this into 5-min micro steps',
    "I'm feeling stuck and overwhelmed",
    'Help me get started on something hard',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/20 backdrop-blur-[2px]">
      <div className="relative w-full max-w-xl h-[85vh] max-h-[640px] bg-white rounded-3xl shadow-2xl border border-[#E5E0D5] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#E5E0D5]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#8BA888] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-[#4A4A4A]">Momentum AI</h3>
              <p className="text-xs text-[#A09B8E]">Here to explain, one step at a time</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full text-[#A09B8E] hover:text-[#4A4A4A] hover:bg-[#F5F2ED] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] text-sm rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-[#8BA888] text-white rounded-tr-none'
                    : 'bg-[#F5F2ED] text-[#4A4A4A] border border-[#E5E0D5] rounded-tl-none leading-relaxed whitespace-pre-wrap'
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-[#A09B8E] mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-4 rounded-2xl bg-[#F5F2ED] text-[#8BA888] text-xs font-medium max-w-[60%] border border-[#E5E0D5]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Momentum AI is crafting a clear step...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 pt-2 pb-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-[#F5F2ED] hover:bg-[#E5E0D5] text-[#8BA888] text-xs font-medium whitespace-nowrap transition-colors border border-[#E5E0D5]"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#E5E0D5] bg-[#FDFCFB]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-white rounded-full p-1.5 pl-5 border border-[#E5E0D5] shadow-sm focus-within:ring-2 focus-within:ring-[#8BA888]/30 focus-within:border-[#8BA888]"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a follow-up..."
              className="flex-1 text-sm text-[#4A4A4A] placeholder-[#A09B8E] bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-[#8BA888] hover:bg-[#7A9677] disabled:bg-stone-300 text-white flex items-center justify-center transition-all shadow-sm"
              aria-label="Send message"
            >
              <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
