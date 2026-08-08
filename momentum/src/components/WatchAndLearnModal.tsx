import React, { useState, useEffect } from 'react';
import { X, Mic, ArrowUp } from 'lucide-react';

interface WatchAndLearnModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearchQuery?: string;
}

export const WatchAndLearnModal: React.FC<WatchAndLearnModalProps> = ({
  isOpen,
  onClose,
  initialSearchQuery = '',
}) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setQuery(initialSearchQuery || '');
    }
  }, [isOpen, initialSearchQuery]);

  if (!isOpen) return null;

  const currentTopic = query.trim() || 'Study Focus';

  const handleOpenSource = (prefix: string) => {
    const q = prefix ? `${prefix} ${currentTopic}` : currentTopic;
    const targetUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleOpenSource('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2928]/35 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF6EE] rounded-[32px] p-6 sm:p-8 shadow-2xl border border-[#E5E0D5] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-[#9C9589] hover:text-[#2C2928] hover:bg-[#EAE4D8] transition-colors"
          aria-label="Close Watch & Learn"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Header matching warm yellow background style */}
        <div className="mb-6 pr-8">
          <span className="text-[10px] font-bold text-[#D99B38] uppercase tracking-[0.2em] block mb-1">
            VIDEO SOURCES
          </span>
          <h2 className="text-3xl font-serif font-normal text-[#2C2928] mb-2">
            Watch & learn
          </h2>
          <p className="text-xs text-[#78726A] leading-relaxed">
            YouTube videos only—choose an educator and explore this topic at your own pace.
          </p>
        </div>

        {/* Video Source Options matching warm yellow palette */}
        <div className="space-y-3 mb-6">
          {/* Khan Academy */}
          <button
            onClick={() => handleOpenSource('Khan Academy')}
            className="w-full text-left p-4 rounded-2xl bg-white border border-[#E5E0D5] shadow-sm hover:border-[#D99B38] hover:shadow transition-all group cursor-pointer"
          >
            <h4 className="text-sm font-semibold text-[#2C2928] group-hover:text-[#C58A2B] transition-colors">
              Khan Academy on YouTube
            </h4>
            <p className="text-xs text-[#8C857B] mt-0.5">
              Classroom-style explanations
            </p>
          </button>

          {/* Crash Course */}
          <button
            onClick={() => handleOpenSource('Crash Course')}
            className="w-full text-left p-4 rounded-2xl bg-white border border-[#E5E0D5] shadow-sm hover:border-[#D99B38] hover:shadow transition-all group cursor-pointer"
          >
            <h4 className="text-sm font-semibold text-[#2C2928] group-hover:text-[#C58A2B] transition-colors">
              Crash Course on YouTube
            </h4>
            <p className="text-xs text-[#8C857B] mt-0.5">
              Visual topic overviews
            </p>
          </button>

          {/* TED-Ed */}
          <button
            onClick={() => handleOpenSource('TED-Ed')}
            className="w-full text-left p-4 rounded-2xl bg-white border border-[#E5E0D5] shadow-sm hover:border-[#D99B38] hover:shadow transition-all group cursor-pointer"
          >
            <h4 className="text-sm font-semibold text-[#2C2928] group-hover:text-[#C58A2B] transition-colors">
              TED-Ed on YouTube
            </h4>
            <p className="text-xs text-[#8C857B] mt-0.5">
              Animated lessons
            </p>
          </button>

          {/* Direct YouTube results */}
          <button
            onClick={() => handleOpenSource('')}
            className="w-full text-left p-4 rounded-2xl bg-white border border-[#E5E0D5] shadow-sm hover:border-[#D99B38] hover:shadow transition-all group cursor-pointer"
          >
            <h4 className="text-sm font-semibold text-[#2C2928] group-hover:text-[#C58A2B] transition-colors">
              YouTube results
            </h4>
            <p className="text-xs text-[#8C857B] mt-0.5">
              Videos for your exact question
            </p>
          </button>
        </div>

        {/* Bottom Follow-Up Input Bar matching warm yellow palette */}
        <form onSubmit={handleFollowUpSubmit} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a follow-up..."
            className="w-full pl-5 pr-20 py-3 rounded-full bg-white border border-[#E5E0D5] text-xs text-[#2C2928] placeholder-[#A09A8F] focus:outline-none focus:ring-2 focus:ring-[#D99B38]/30 shadow-sm"
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
              className="p-2 rounded-full bg-[#D99B38] text-white hover:bg-[#C58A2B] transition-colors shadow-sm"
              title="Submit & Search YouTube"
            >
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
