import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, ArrowUp, Loader2, Mic, ListFilter } from 'lucide-react';
import { ChatMessage } from '../types';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onOpenWatchAndLearn?: () => void;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  initialPrompt = '',
  onOpenWatchAndLearn,
}) => {
  const [selectedMode, setSelectedMode] = useState<'explain' | 'task'>('explain');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello! I'm Momentum AI. 🌸\n\nHow can I support your focus today? You can ask me to explain any topic simply or break down a task into micro-steps.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          mode: selectedMode,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.reply) {
        const assistantMsg: ChatMessage = {
          id: `ast-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ast-err-${Date.now()}`,
          role: 'assistant',
          content: "Let's take a deep breath. I'm right here with you. Try asking me again or picking one of the options above!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMode = (mode: 'explain' | 'task') => {
    setSelectedMode(mode);
    if (mode === 'explain') {
      handleSend("Explain a topic simply in clear, gentle steps");
    } else {
      handleSend("Break down my current task into 3 easy micro-steps");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2928]/35 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg h-[88vh] max-h-[660px] bg-[#FAF6EE] rounded-[32px] p-6 sm:p-7 shadow-2xl border border-[#E5E0D5] flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header matching warm yellow background style */}
        <div className="flex items-start justify-between pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#D99B38] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-[#2C2928]">Momentum AI</h3>
              <p className="text-xs text-[#78726A]">Here to explain, one step at a time</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#9C9589] hover:text-[#2C2928] hover:bg-[#EAE4D8] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Action Pills Bar matching warm yellow palette */}
        <div className="flex items-center gap-2 my-2">
          <button
            onClick={() => handleSelectMode('explain')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              selectedMode === 'explain'
                ? 'bg-[#D99B38] text-white'
                : 'bg-white border border-[#E5E0D5] text-[#2C2928] hover:bg-[#FDFCFB]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2]" />
            <span>Explain a topic</span>
          </button>

          <button
            onClick={() => handleSelectMode('task')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              selectedMode === 'task'
                ? 'bg-[#D99B38] text-white'
                : 'bg-white border border-[#E5E0D5] text-[#2C2928] hover:bg-[#FDFCFB]'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5 stroke-[2]" />
            <span>Break down a task</span>
          </button>
        </div>

        {/* Messages Container matching warm yellow palette */}
        <div className="flex-1 overflow-y-auto my-2 pr-1 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] text-xs sm:text-sm rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-[#D99B38] text-white rounded-tr-sm'
                    : 'bg-[#F8ECC9] border border-[#E8CF96] text-[#2C2928] rounded-tl-sm leading-relaxed whitespace-pre-wrap'
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-[#A09A8F] mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#F8ECC9] text-[#8D5E15] text-xs font-medium max-w-[70%] border border-[#E8CF96]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Momentum AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input & Video Sources Controls matching warm yellow palette */}
        <div className="pt-2 space-y-2.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a follow-up..."
              className="w-full pl-5 pr-20 py-3 rounded-full bg-white border border-[#E5E0D5] text-xs sm:text-sm text-[#2C2928] placeholder-[#A09A8F] focus:outline-none focus:ring-2 focus:ring-[#D99B38]/30 shadow-sm"
            />
            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                type="button"
                className="p-1.5 text-[#A09A8F] hover:text-[#2C2928] transition-colors"
                title="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-full bg-[#D99B38] hover:bg-[#C58A2B] disabled:opacity-40 text-white transition-colors shadow-sm"
                aria-label="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* Video sources button matching warm yellow palette */}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenWatchAndLearn) {
                onOpenWatchAndLearn();
              }
            }}
            className="w-full py-3 rounded-2xl bg-[#F8ECC9] hover:bg-[#F2E0B5] text-[#2C2928] text-xs font-semibold border border-[#E8CF96] transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Video sources</span>
          </button>
        </div>
      </div>
    </div>
  );
};
