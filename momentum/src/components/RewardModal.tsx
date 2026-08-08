import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Butterfly } from '../types';
import { ButterflyVisual } from './ButterflyVisual';
import { playCompletionChime } from '../utils/audioSynth';

interface RewardModalProps {
  butterfly: Butterfly | null;
  onClaim: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({ butterfly, onClaim }) => {
  useEffect(() => {
    if (!butterfly) return;

    // Play completion chime
    playCompletionChime();

    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E37663', '#D99B38', '#38BDF8', '#7C3AED', '#F59E0B'],
      });
    } catch {
      // Ignore if canvas-confetti fails
    }
  }, [butterfly]);

  if (!butterfly) return null;

  const rarityBadgeStyles = {
    Common: 'bg-amber-100 text-amber-800 border-amber-300',
    Uncommon: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Rare: 'bg-sky-100 text-sky-800 border-sky-300',
    Epic: 'bg-purple-100 text-purple-800 border-purple-300',
    Legendary: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/20 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="relative w-[400px] bg-white rounded-3xl p-10 shadow-2xl border border-[#E5E0D5] text-center overflow-hidden animate-in zoom-in-90 duration-300 flex flex-col items-center">
        {/* Celebration Header */}
        <span className="text-[10px] uppercase tracking-widest text-[#D99B38] font-bold mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D99B38]" />
          <span>Session Complete</span>
        </span>

        <h3 className="text-2xl font-semibold text-[#4A4A4A] mb-1">
          {butterfly.species}
        </h3>

        <p className="text-xs text-[#A09B8E] mb-6 leading-relaxed">
          You focused on "{butterfly.sessionGoal}" for {butterfly.sessionDuration} minutes and unlocked a new specimen.
        </p>

        {/* Butterfly Animation Container */}
        <div className="relative my-4 py-4 flex items-center justify-center">
          {/* Subtle glow circle behind butterfly */}
          <div className="w-28 h-28 bg-[#FAF0D9] rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 animate-pulse border-2 border-[#D99B38] rounded-full opacity-30" />
            <ButterflyVisual
              primaryColor={butterfly.primaryColor}
              secondaryColor={butterfly.secondaryColor}
              size={90}
              wingPattern={butterfly.wingPattern}
              isFlapping={true}
            />
          </div>
        </div>

        {/* Butterfly Info */}
        <div className="mb-6">
          <span
            className={`inline-block text-[10px] font-bold px-3 py-0.5 rounded-full border mb-2 ${
              rarityBadgeStyles[butterfly.rarity] || rarityBadgeStyles.Common
            }`}
          >
            {butterfly.rarity}
          </span>

          <p className="text-xs text-[#A09B8E] px-2 leading-relaxed italic">
            "{butterfly.description}"
          </p>
        </div>

        {/* Claim Action Button */}
        <button
          onClick={onClaim}
          className="w-full py-4 rounded-2xl bg-[#D99B38] hover:bg-[#C58A2B] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 group active:scale-95"
        >
          <span>Release into Focus Garden</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
