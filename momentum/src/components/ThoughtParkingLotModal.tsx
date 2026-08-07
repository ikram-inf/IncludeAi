import React, { useState } from 'react';
import { X, Plus, Check, Trash2, Bookmark } from 'lucide-react';
import { ParkedThought } from '../types';

interface ThoughtParkingLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  thoughts: ParkedThought[];
  onAddThought: (text: string) => void;
  onToggleThought: (id: string) => void;
  onDeleteThought: (id: string) => void;
}

export const ThoughtParkingLotModal: React.FC<ThoughtParkingLotModalProps> = ({
  isOpen,
  onClose,
  thoughts,
  onAddThought,
  onToggleThought,
  onDeleteThought,
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAddThought(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/20 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5E0D5] animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF5E6] text-[#D4A373] flex items-center justify-center shadow-sm border border-[#F5E6D3]">
              <Bookmark className="w-5 h-5 fill-current stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-[#4A4A4A]">Thought Parking Lot</h3>
              <p className="text-xs text-[#A09B8E] mt-0.5">
                Park distracting thoughts here so you can refocus.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#A09B8E] hover:text-[#4A4A4A] hover:bg-[#F5F2ED] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Input & Park Button Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-6">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. Check grocery list, message Alex..."
            className="flex-1 px-4 py-2.5 rounded-full border border-[#E5E0D5] bg-[#FDFCFB] text-sm text-[#4A4A4A] placeholder-[#C0BBAE] focus:outline-none focus:ring-2 focus:ring-[#D4A373]/40 focus:border-[#D4A373] transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 rounded-full bg-[#E8B49B] text-white text-xs font-semibold hover:bg-[#d9a388] disabled:opacity-50 transition-all flex items-center gap-1 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Park</span>
          </button>
        </form>

        {/* Parked Thoughts List or Empty State */}
        <div className="min-h-[140px] max-h-[220px] overflow-y-auto mb-6 px-1 space-y-2">
          {thoughts.length === 0 ? (
            <div className="h-[120px] flex items-center justify-center text-center">
              <p className="text-xs text-[#A09B8E] italic font-serif">
                Your mind is clear! No parked thoughts right now.
              </p>
            </div>
          ) : (
            thoughts.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  item.resolved
                    ? 'bg-[#F5F2ED]/50 border-[#E5E0D5] opacity-60'
                    : 'bg-[#FDFCFB] border-[#E5E0D5] shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <button
                    onClick={() => onToggleThought(item.id)}
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                      item.resolved
                        ? 'bg-[#8BA888] border-[#8BA888] text-white'
                        : 'border-[#E5E0D5] hover:border-[#8BA888] bg-white'
                    }`}
                  >
                    {item.resolved && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                  <span
                    className={`text-xs text-[#4A4A4A] truncate ${
                      item.resolved ? 'line-through text-[#A09B8E]' : ''
                    }`}
                  >
                    {item.text}
                  </span>
                </div>

                <button
                  onClick={() => onDeleteThought(item.id)}
                  className="p-1 rounded-lg text-[#A09B8E] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  aria-label="Delete thought"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Tip */}
        <div className="pt-3 border-t border-[#E5E0D5] text-center">
          <p className="text-[11px] text-[#A09B8E] leading-relaxed italic">
            Tip: You can review these items once your study session completes.
          </p>
        </div>
      </div>
    </div>
  );
};
