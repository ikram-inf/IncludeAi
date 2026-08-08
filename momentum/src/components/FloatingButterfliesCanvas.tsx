import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Butterfly } from '../types';
import { ButterflyVisual } from './ButterflyVisual';

interface FloatingButterfliesCanvasProps {
  butterflies: Butterfly[];
  onSelectButterfly?: (butterfly: Butterfly) => void;
}

interface RoamingPosition {
  x: number;
  y: number;
  rotation: number;
}

export const FloatingButterfliesCanvas: React.FC<FloatingButterfliesCanvasProps> = ({
  butterflies,
  onSelectButterfly,
}) => {
  // Generate random wandering waypoints for each butterfly
  const [butterflyPaths, setButterflyPaths] = useState<Record<string, RoamingPosition[]>>({});

  useEffect(() => {
    const newPaths: Record<string, RoamingPosition[]> = {};

    butterflies.forEach((bf) => {
      // 4-5 keyframes across viewport percentages
      const keyframes: RoamingPosition[] = [];
      const baseSx = bf.x || Math.random() * 80 + 10;
      const baseSy = bf.y || Math.random() * 80 + 10;

      for (let i = 0; i < 5; i++) {
        const xPct = Math.max(5, Math.min(90, baseSx + (Math.random() * 40 - 20)));
        const yPct = Math.max(8, Math.min(88, baseSy + (Math.random() * 40 - 20)));
        const rot = Math.random() * 40 - 20;
        keyframes.push({ x: xPct, y: yPct, rotation: rot });
      }
      // Loop back to start
      keyframes.push(keyframes[0]);
      newPaths[bf.id] = keyframes;
    });

    setButterflyPaths(newPaths);
  }, [butterflies]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none">
      {butterflies.map((bf, idx) => {
        const waypoints = butterflyPaths[bf.id] || [
          { x: bf.x || 20, y: bf.y || 30, rotation: 0 },
          { x: (bf.x || 20) + 15, y: (bf.y || 30) - 10, rotation: 15 },
          { x: bf.x || 20, y: bf.y || 30, rotation: 0 },
        ];

        // Randomize duration per butterfly for realistic asynchronous motion
        const animDuration = 18 + (idx % 5) * 4;

        return (
          <motion.div
            key={bf.id}
            onClick={() => onSelectButterfly && onSelectButterfly(bf)}
            className="absolute pointer-events-auto cursor-pointer group hover:z-[9999]"
            initial={{
              left: `${waypoints[0].x}%`,
              top: `${waypoints[0].y}%`,
              rotate: waypoints[0].rotation,
            }}
            animate={{
              left: waypoints.map((p) => `${p.x}%`),
              top: waypoints.map((p) => `${p.y}%`),
              rotate: waypoints.map((p) => p.rotation),
            }}
            transition={{
              duration: animDuration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.35 }}
            title={`${bf.species} (${bf.rarity})`}
          >
            <ButterflyVisual
              primaryColor={bf.primaryColor}
              secondaryColor={bf.secondaryColor}
              size={bf.size || 52}
              wingPattern={bf.wingPattern}
              isFlapping={true}
            />

            {/* Species Hover Tag */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-3 py-1 rounded-full bg-[#2D2B2A] text-white text-[10px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl pointer-events-none z-[9999] border border-amber-300/40">
              {bf.species} ({bf.rarity})
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
