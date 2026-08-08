import React from 'react';
import { NotebookPen, Timer, Sparkles, Flower2, Settings, Bookmark } from 'lucide-react';
import { ActiveModal } from '../types';

interface RightDockProps {
  activeModal: ActiveModal;
  setActiveModal: (modal: ActiveModal) => void;
  butterflyCount: number;
  parkedThoughtsCount?: number;
}

export const RightDock: React.FC<RightDockProps> = ({
  activeModal,
  setActiveModal,
  butterflyCount,
  parkedThoughtsCount = 0,
}) => {
  const dockItems = [
    {
      id: 'todo' as const,
      label: 'To-Do Planner',
      icon: NotebookPen,
    },
    {
      id: 'parkingLot' as const,
      label: 'Thought Parking Lot',
      icon: Bookmark,
      badge: parkedThoughtsCount > 0 ? parkedThoughtsCount : undefined,
    },
    {
      id: 'timer' as const,
      label: 'Focus Timer',
      icon: Timer,
    },
    {
      id: 'chat' as const,
      label: 'Momentum AI',
      icon: Sparkles,
    },
    {
      id: 'garden' as const,
      label: `Sanctuary (${butterflyCount})`,
      icon: Flower2,
      badge: butterflyCount > 0 ? butterflyCount : undefined,
    },
    {
      id: 'settings' as const,
      label: 'Timer & Sensory Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-4 select-none">
      {dockItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeModal === item.id;

        return (
          <div key={item.id} className="relative group flex items-center">
            {/* Tooltip on the left */}
            <div className="absolute right-16 px-3 py-1.5 rounded-xl bg-stone-900/90 text-stone-100 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg backdrop-blur-sm">
              {item.label}
            </div>

            {/* Circular Button */}
            <button
              onClick={() => setActiveModal(isActive ? null : item.id)}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                isActive
                  ? 'bg-[#D99B38] text-white shadow-lg shadow-[#D99B38]/25 scale-110'
                  : 'bg-[#FDFCFB] text-[#A09B8E] hover:text-[#4A4A4A] hover:bg-[#F5F2ED] border border-[#E5E0D5] hover:scale-105'
              }`}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5 stroke-[2]" />

              {/* Badge if present */}
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-1 bg-[#D4A373] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {item.badge}
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};
