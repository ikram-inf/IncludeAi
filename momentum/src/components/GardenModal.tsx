import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Info } from 'lucide-react';
import { Butterfly, RarityTier } from '../types';
import { ButterflyVisual } from './ButterflyVisual';
import { BUTTERFLY_SPECIES } from '../data/butterflies';

interface GardenModalProps {
  isOpen: boolean;
  onClose: () => void;
  butterflies: Butterfly[];
}

export const GardenModal: React.FC<GardenModalProps> = ({
  isOpen,
  onClose,
  butterflies,
}) => {
  const [selectedButterfly, setSelectedButterfly] = useState<Butterfly | null>(null);
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);
  // default to the public asset so the garden shows an image (garden.png)
  const [gardenImage] = useState<string | null>('/garden.png');

  if (!isOpen) return null;

  

  const rarityBadgeStyles: Record<RarityTier, string> = {
    Common: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Uncommon: 'bg-amber-100 text-amber-800 border-amber-300',
    Rare: 'bg-sky-100 text-sky-800 border-sky-300',
    Epic: 'bg-purple-100 text-purple-800 border-purple-300',
    Legendary: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/20 backdrop-blur-[2px]">
      <div className="relative w-full max-w-2xl h-[85vh] max-h-[660px] bg-white rounded-3xl p-6 shadow-2xl border border-[#E5E0D5] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F2ED] text-[#8BA888] flex items-center justify-center font-bold">
              🦋
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#8BA888] uppercase">
                FOCUS REWARD SANCTUARY
              </span>
              <h3 className="text-2xl font-normal text-[#4A4A4A]">
                Butterfly Garden ({butterflies.length})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEncyclopedia(!showEncyclopedia)}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E0D5] text-[#4A4A4A] hover:text-stone-900 text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-[#8BA888]" />
              <span>{showEncyclopedia ? 'Back to Garden' : 'Encyclopedia'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full text-[#A09B8E] hover:text-[#4A4A4A] hover:bg-[#F5F2ED] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* View Content: Garden Sanctuary vs Encyclopedia */}
        {showEncyclopedia ? (
          /* Encyclopedia View */
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <p className="text-xs text-[#A09B8E] mb-4">
              Complete Pomodoro focus sessions to discover all rare butterfly species in your sanctuary!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BUTTERFLY_SPECIES.map((spec, idx) => {
                const isUnlocked = butterflies.some(b => b.species === spec.species);
                const count = butterflies.filter(b => b.species === spec.species).length;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-white border-[#E5E0D5] shadow-sm'
                        : 'bg-[#F5F2ED]/60 border-[#E5E0D5]/80 opacity-60'
                    }`}
                  >
                    <div className="relative">
                      <ButterflyVisual
                        primaryColor={isUnlocked ? spec.primaryColor : '#A3A3A3'}
                        secondaryColor={isUnlocked ? spec.secondaryColor : '#D4D4D4'}
                        size={52}
                        wingPattern={spec.wingPattern}
                        isFlapping={isUnlocked}
                      />
                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#8BA888] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {count}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-[#4A4A4A] truncate">
                          {isUnlocked ? spec.species : '??? Discovered via Focus'}
                        </h4>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            rarityBadgeStyles[spec.rarity]
                          }`}
                        >
                          {spec.rarity}
                        </span>
                      </div>
                      <p className="text-xs text-[#A09B8E] line-clamp-2 leading-relaxed">
                        {isUnlocked ? spec.description : 'Complete a focus session to reveal this specimen.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Interactive Flying Garden View */
          <div className="relative flex-1 rounded-2xl bg-gradient-to-b from-[#FDFCFB] via-[#F5F2ED] to-[#E5E0D5]/50 overflow-hidden my-3 border border-[#E5E0D5] shadow-inner">
            {/* Soft decorative background dots */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#8BA888_1px,transparent_1px)] [background-size:24px_24px]" />

            {gardenImage && (
              <img
                src={gardenImage}
                alt="Personal garden photo"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Fixed background image — no user choice required */}

            {/* Flying Butterflies Canvas Container */}
            <div className="relative w-full h-full p-4">
              {butterflies.map((bf) => (
                <div
                  key={bf.id}
                  onClick={() => setSelectedButterfly(bf)}
                  className="absolute cursor-pointer transition-transform duration-1000 hover:scale-125 group z-10"
                  style={{
                    left: `${bf.x}%`,
                    top: `${bf.y}%`,
                  }}
                  title={`Click to inspect ${bf.species}`}
                >
                  <ButterflyVisual
                    primaryColor={bf.primaryColor}
                    secondaryColor={bf.secondaryColor}
                    size={bf.size || 50}
                    wingPattern={bf.wingPattern}
                    isFlapping={true}
                  />

                  {/* Species Name Label Hover Pill */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2.5 py-1 rounded-full bg-[#4A4A4A] text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none">
                    {bf.species}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Info Banner */}
            <div className="absolute bottom-3 left-3 right-3 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-[#E5E0D5] flex items-center justify-between text-xs text-[#4A4A4A]">
              <div className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#8BA888]" />
                <span>Click any butterfly to view session details and rarity!</span>
              </div>
              <span className="font-semibold text-[#4A4A4A]">{butterflies.length} Fluttering</span>
            </div>
          </div>
        )}

        {/* Selected Butterfly Inspection Modal */}
        {selectedButterfly && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/20 backdrop-blur-sm">
            <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#E5E0D5] text-center animate-in zoom-in-95">
              <button
                onClick={() => setSelectedButterfly(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-[#A09B8E] hover:text-[#4A4A4A] hover:bg-[#F5F2ED]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex justify-center my-4">
                <ButterflyVisual
                  primaryColor={selectedButterfly.primaryColor}
                  secondaryColor={selectedButterfly.secondaryColor}
                  size={90}
                  wingPattern={selectedButterfly.wingPattern}
                  isFlapping={true}
                />
              </div>

              <div className="flex items-center justify-center gap-2 mb-2">
                <h4 className="text-lg font-semibold text-[#4A4A4A]">{selectedButterfly.species}</h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    rarityBadgeStyles[selectedButterfly.rarity]
                  }`}
                >
                  {selectedButterfly.rarity}
                </span>
              </div>

              <p className="text-xs text-[#A09B8E] mb-4 italic">
                "{selectedButterfly.description}"
              </p>

              <div className="bg-[#F5F2ED] p-3 rounded-2xl text-xs text-[#4A4A4A] text-left space-y-1 border border-[#E5E0D5]">
                <p>
                  <strong className="text-[#4A4A4A]">Session Goal:</strong> {selectedButterfly.sessionGoal}
                </p>
                <p>
                  <strong className="text-[#4A4A4A]">Duration:</strong> {selectedButterfly.sessionDuration} mins
                </p>
                <p>
                  <strong className="text-[#4A4A4A]">Earned:</strong>{' '}
                  {new Date(selectedButterfly.earnedAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <button
                onClick={() => setSelectedButterfly(null)}
                className="w-full mt-4 py-2.5 rounded-2xl bg-[#8BA888] text-white text-xs font-semibold hover:bg-[#7A9677] transition-colors"
              >
                Back to Garden
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
