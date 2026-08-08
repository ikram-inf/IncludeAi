import React, { useState } from 'react';
import { X, Sparkles, Flower2, Filter, Award, BookOpen } from 'lucide-react';
import { Butterfly, RarityTier } from '../types';
import { ButterflyVisual } from './ButterflyVisual';
import { BUTTERFLY_SPECIES } from '../data/butterflies';
import { MeadowIllustration } from './MeadowIllustration';

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
  const [activeTab, setActiveTab] = useState<'meadow' | 'specimens' | 'stats' | 'encyclopedia'>('meadow');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [selectedButterfly, setSelectedButterfly] = useState<Butterfly | null>(null);

  if (!isOpen) return null;

  const rarityBadgeStyles: Record<RarityTier, string> = {
    Common: 'bg-amber-100 text-amber-800 border-amber-300',
    Uncommon: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Rare: 'bg-sky-100 text-sky-800 border-sky-300',
    Epic: 'bg-purple-100 text-purple-800 border-purple-300',
    Legendary: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  const filteredButterflies = butterflies.filter((b) => {
    if (rarityFilter === 'all') return true;
    return b.rarity.toLowerCase() === rarityFilter.toLowerCase();
  });

  const uniqueSpeciesCount = new Set(butterflies.map((b) => b.species)).size;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2B2A]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] max-h-[720px] bg-[#FAF6EE] rounded-[32px] p-6 sm:p-8 shadow-2xl border border-[#E5E0D5] flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-[#E5E0D5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F8ECC9] text-[#D99B38] flex items-center justify-center shadow-sm font-bold border border-[#E8CF96]">
              <Flower2 className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#D99B38] uppercase">
                FOCUS REWARD SANCTUARY
              </span>
              <h3 className="text-2xl font-serif text-[#4A4A4A]">Butterfly Garden ({butterflies.length})</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E0D5] text-xs text-[#4A4A4A] shadow-sm">
              <span className="font-bold text-[#D99B38]">{butterflies.length}</span> Earned
              <span className="text-[#A09B8E]">|</span>
              <span className="font-bold text-[#D4A373]">{uniqueSpeciesCount} / {BUTTERFLY_SPECIES.length}</span> Species
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full text-[#A09B8E] hover:text-[#4A4A4A] hover:bg-[#E5E0D5]/50 transition-colors"
              aria-label="Close garden"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="relative z-10 flex items-center justify-between gap-2 my-3 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'meadow', title: '🌸 Fluttering Meadow' },
              { id: 'specimens', title: `🦋 Earned Specimens (${butterflies.length})` },
              { id: 'stats', title: '✨ Sanctuary Stats' },
              { id: 'encyclopedia', title: '📜 Species Encyclopedia' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#D99B38] text-white shadow-sm font-semibold scale-102'
                    : 'bg-white/80 text-[#7A6A5E] hover:bg-white border border-[#E5E0D5]'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {activeTab === 'specimens' && (
            <div className="flex items-center gap-1 text-xs text-[#A09B8E]">
              <Filter className="w-3.5 h-3.5" />
              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value)}
                className="bg-white border border-[#E5E0D5] rounded-xl px-2.5 py-1 text-xs text-[#4A4A4A] focus:outline-none"
              >
                <option value="all">All Rarities</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 my-2 bg-[#FDFCFB] rounded-2xl border border-[#E5E0D5] p-3 sm:p-4 shadow-inner flex flex-col overflow-hidden">
          
          {/* TAB 1: FLUTTERING MEADOW */}
          {activeTab === 'meadow' && (
            <div className="relative h-full rounded-2xl border border-[#EAD29C] overflow-hidden shadow-inner flex flex-col justify-between">
              
              {/* Exact Meadow Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/meadow_background.jpg"
                  alt="Fluttering Meadow"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>

              {/* Top Banner overlay */}
              <div className="relative z-10 p-3 flex justify-between items-center text-xs text-[#4A4A4A] font-medium">
                <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-300 shadow-sm text-xs text-[#4A4A4A]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Click any butterfly to view focus details!
                </span>
                <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-amber-200 text-[11px] text-[#8D5E15] font-semibold">
                  {butterflies.length} Fluttering
                </span>
              </div>

              {/* Fluttering Specimens Canvas */}
              <div className="relative z-10 flex-1 my-2">
                {butterflies.map((bf, idx) => {
                  const posX = bf.x ?? (12 + (idx * 20) % 76);
                  const posY = bf.y ?? (25 + (idx * 22) % 55);

                  // Smart tooltip placement so hover tag is never cut off near edges/top
                  const showTooltipBelow = posY < 35;
                  let xAlignClass = 'left-1/2 -translate-x-1/2';
                  if (posX < 22) xAlignClass = 'left-0 translate-x-0';
                  if (posX > 78) xAlignClass = 'right-0 translate-x-0';

                  return (
                    <div
                      key={bf.id ? `${bf.id}-${idx}` : `bf-meadow-${idx}`}
                      onClick={() => setSelectedButterfly(bf)}
                      title={`${bf.species} (${bf.rarity})`}
                      className="absolute cursor-pointer transition-transform hover:scale-130 group hover:z-[9999]"
                      style={{
                        left: `${posX}%`,
                        top: `${posY}%`,
                        zIndex: 20 + idx,
                      }}
                    >
                      <ButterflyVisual
                        primaryColor={bf.primaryColor}
                        secondaryColor={bf.secondaryColor}
                        size={54}
                        wingPattern={bf.wingPattern}
                        isFlapping={true}
                      />
                      {/* Name Tag Tooltip - smartly positioned so it is always fully visible on hover */}
                      <div
                        className={`absolute ${
                          showTooltipBelow ? 'top-full mt-1.5' : 'bottom-full mb-1.5'
                        } ${xAlignClass} px-3 py-1 rounded-full bg-[#2D2B2A] text-white text-[10px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl pointer-events-none z-[9999] border border-amber-200/40`}
                      >
                        {bf.species} ({bf.rarity})
                      </div>
                    </div>
                  );
                })}

                {butterflies.length === 0 && (
                  <div className="h-full flex items-center justify-center text-xs font-semibold text-[#8D5E15] bg-white/70 backdrop-blur-sm rounded-xl mx-8 my-12 shadow-sm border border-amber-200">
                    Complete focus sessions to attract beautiful butterflies to your meadow!
                  </div>
                )}
              </div>

              {/* Bottom Info Bar */}
              <div className="relative z-10 p-2.5 bg-white/90 backdrop-blur-md border-t border-amber-200 flex items-center justify-between text-[11px] text-[#4A4A4A]">
                <div className="flex items-center gap-2">
                  <Flower2 className="w-4 h-4 text-[#D99B38]" />
                  <span>Your garden grows richer with every completed Pomodoro.</span>
                </div>
                <span className="font-semibold text-[#D99B38]">Fluttering Meadow</span>
              </div>
            </div>
          )}

          {/* TAB 2: EARNED SPECIMENS GRID */}
          {activeTab === 'specimens' && (
            <div className="h-full overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredButterflies.map((bf, idx) => (
                <div
                  key={bf.id ? `${bf.id}-${idx}` : `bf-grid-${idx}`}
                  onClick={() => setSelectedButterfly(bf)}
                  className="p-4 rounded-2xl border border-[#E5E0D5] bg-white shadow-sm hover:border-[#D99B38] hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center group"
                >
                  <div className="my-2 group-hover:scale-110 transition-transform">
                    <ButterflyVisual
                      primaryColor={bf.primaryColor}
                      secondaryColor={bf.secondaryColor}
                      size={58}
                      wingPattern={bf.wingPattern}
                      isFlapping={true}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 mb-1">
                    <h4 className="text-xs font-bold text-[#4A4A4A]">{bf.species}</h4>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        rarityBadgeStyles[bf.rarity]
                      }`}
                    >
                      {bf.rarity}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#A09B8E] line-clamp-2 mb-2">
                    "{bf.description}"
                  </p>

                  <div className="mt-auto w-full pt-2 border-t border-[#E5E0D5]/70 flex items-center justify-between text-[10px] text-[#A09B8E]">
                    <span className="truncate">Goal: {bf.sessionGoal}</span>
                    <span>{bf.sessionDuration}m</span>
                  </div>
                </div>
              ))}

              {filteredButterflies.length === 0 && (
                <div className="col-span-full py-12 text-center text-xs text-[#A09B8E]">
                  No specimens match this filter yet. Complete focus sessions to gather more!
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RARITY STATS */}
          {activeTab === 'stats' && (
            <div className="h-full flex flex-col justify-center max-w-lg mx-auto space-y-4">
              <h3 className="text-xl font-serif font-semibold text-[#4A4A4A] text-center mb-2">
                Sanctuary Specimen Rarities
              </h3>

              {(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] as RarityTier[]).map((tier) => {
                const count = butterflies.filter((b) => b.rarity === tier).length;
                return (
                  <div
                    key={tier}
                    className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#E5E0D5] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${rarityBadgeStyles[tier]}`}>
                        {tier}
                      </span>
                      <span className="text-xs text-[#7A6A5E] font-medium">Specimens Earned</span>
                    </div>
                    <span className="text-base font-bold text-[#4A4A4A]">{count}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: SPECIES ENCYCLOPEDIA */}
          {activeTab === 'encyclopedia' && (
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E0D5]/80">
                <p className="text-xs text-[#7A6A5E]">
                  Discover all {BUTTERFLY_SPECIES.length} focus species in your sanctuary dictionary:
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[#A09B8E]">
                  <Filter className="w-3.5 h-3.5" />
                  <select
                    value={rarityFilter}
                    onChange={(e) => setRarityFilter(e.target.value)}
                    className="bg-white border border-[#E5E0D5] rounded-xl px-2.5 py-1 text-xs text-[#4A4A4A] focus:outline-none"
                  >
                    <option value="all">All Rarities</option>
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUTTERFLY_SPECIES.filter(s => rarityFilter === 'all' || s.rarity.toLowerCase() === rarityFilter.toLowerCase()).map((spec, idx) => {
                  const isUnlocked = butterflies.some((b) => b.species === spec.species);
                  const count = butterflies.filter((b) => b.species === spec.species).length;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                        isUnlocked
                          ? 'bg-white border-[#E5E0D5] shadow-sm hover:border-[#D99B38]'
                          : 'bg-[#FAF6EE]/80 border-[#E5E0D5]/70 opacity-80'
                      }`}
                    >
                      <div className="pt-0.5">
                        <ButterflyVisual
                          primaryColor={isUnlocked ? spec.primaryColor : '#A3A3A3'}
                          secondaryColor={isUnlocked ? spec.secondaryColor : '#D4D4D4'}
                          size={48}
                          wingPattern={spec.wingPattern}
                          isFlapping={isUnlocked}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h5 className="text-xs font-bold text-[#4A4A4A] truncate">
                            {spec.species}
                          </h5>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                              rarityBadgeStyles[spec.rarity]
                            }`}
                          >
                            {spec.rarity}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#A09B8E] line-clamp-2 leading-tight mb-1.5">
                          {spec.description}
                        </p>

                        {isUnlocked ? (
                          <div className="flex items-center justify-between pt-1 border-t border-[#E5E0D5]/60 text-[10px]">
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              ✓ Unlocked
                            </span>
                            <span className="font-bold text-[#D99B38]">
                              Collected: {count}
                            </span>
                          </div>
                        ) : (
                          <div className="pt-1 border-t border-[#E5E0D5]/60 text-[10px] text-[#D99B38]">
                            <span className="font-semibold">How to discover:</span>{' '}
                            <span className="text-[#7A6A5E]">{spec.discoveryHint || 'Complete focus sessions to attract this species.'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Selected Specimen Detail Overlay */}
        {selectedButterfly && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#E5E0D5] text-center animate-in zoom-in-95">
              <button
                onClick={() => setSelectedButterfly(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-[#A09B8E] hover:text-[#4A4A4A] hover:bg-[#F5F2ED]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex justify-center my-3">
                <ButterflyVisual
                  primaryColor={selectedButterfly.primaryColor}
                  secondaryColor={selectedButterfly.secondaryColor}
                  size={85}
                  wingPattern={selectedButterfly.wingPattern}
                  isFlapping={true}
                />
              </div>

              <div className="flex items-center justify-center gap-2 mb-2">
                <h4 className="text-base font-bold text-[#4A4A4A]">{selectedButterfly.species}</h4>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    rarityBadgeStyles[selectedButterfly.rarity]
                  }`}
                >
                  {selectedButterfly.rarity}
                </span>
              </div>

              <p className="text-xs text-[#A09B8E] mb-3 italic">
                "{selectedButterfly.description}"
              </p>

              <div className="bg-[#FAF6EE] p-3 rounded-2xl text-xs text-[#4A4A4A] text-left space-y-1 border border-[#E5E0D5]">
                <p>
                  <strong>Goal:</strong> {selectedButterfly.sessionGoal}
                </p>
                <p>
                  <strong>Duration:</strong> {selectedButterfly.sessionDuration} mins
                </p>
              </div>

              <button
                onClick={() => setSelectedButterfly(null)}
                className="w-full mt-4 py-2.5 rounded-2xl bg-[#D99B38] text-white text-xs font-semibold hover:bg-[#C58A2B] transition-colors shadow-sm"
              >
                Close Specimen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
