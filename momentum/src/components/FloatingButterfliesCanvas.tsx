import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Butterfly } from '../types';
import { ButterflyVisual } from './ButterflyVisual';

interface FloatingButterfliesCanvasProps {
  butterflies: Butterfly[];
  onSelectButterfly?: (butterfly: Butterfly) => void;
}

interface Waypoint {
  x: number; // percentage of viewport width
  y: number; // percentage of viewport height
  rotation: number; // bank/tilt angle in degrees (strictly constrained [-20, 20])
  scale: number;
}

// Simple string hash to generate deterministic organic flight patterns
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Generate smooth, continuous natural flight paths that loop gracefully across the entire screen
function generateOrganicFlightPath(bf: Butterfly, index: number): { waypoints: Waypoint[]; duration: number } {
  const seed = hashString(bf.id || `bf-${index}`);
  
  // Base flight duration: 80s to 130s for slow, peaceful, floating drift
  const duration = 80 + (seed % 50);

  const waypoints: Waypoint[] = [];
  const numSteps = 10;

  // Screen zones to ensure butterflies roam freely across the ENTIRE home screen
  const screenZones = [
    { minX: 8, maxX: 35, minY: 10, maxY: 38 },  // Top-left
    { minX: 45, maxX: 88, minY: 12, maxY: 40 }, // Top-right
    { minX: 60, maxX: 92, minY: 45, maxY: 75 }, // Mid-right
    { minX: 35, maxX: 75, minY: 55, maxY: 88 }, // Bottom-center
    { minX: 6, maxX: 38, minY: 50, maxY: 85 },  // Bottom-left
    { minX: 15, maxX: 50, minY: 25, maxY: 65 }, // Center-left
    { minX: 50, maxX: 85, minY: 30, maxY: 70 }, // Center-right
    { minX: 25, maxX: 70, minY: 8, maxY: 35 },  // Top-center
  ];

  // Pick starting zone based on seed and index
  const zoneOffset = (seed + index * 3) % screenZones.length;

  for (let i = 0; i < numSteps; i++) {
    const zoneIndex = (zoneOffset + i) % screenZones.length;
    const zone = screenZones[zoneIndex];

    // Seed-based deterministic position within the zone
    const stepSeed = hashString(`${bf.id || index}-step-${i}`);
    const rawX = zone.minX + (stepSeed % (zone.maxX - zone.minX));
    const rawY = zone.minY + ((stepSeed * 7) % (zone.maxY - zone.minY));

    // Slight scale variation for floating depth effect
    const scale = 0.88 + (stepSeed % 25) / 100; // 0.88 to 1.13

    waypoints.push({
      x: rawX,
      y: rawY,
      rotation: 0, // calculated in second pass
      scale,
    });
  }

  // Second pass: Calculate gentle, realistic bank/tilt angles based on horizontal motion
  // Butterflies tilt slightly in the direction they drift, staying strictly upright [-20°, +20°]
  for (let i = 0; i < numSteps; i++) {
    const curr = waypoints[i];
    const next = waypoints[(i + 1) % numSteps];

    const dx = next.x - curr.x;
    
    // Bank angle proportional to horizontal drift velocity
    // Moving right -> tilt slightly right (+8° to +18°)
    // Moving left -> tilt slightly left (-8° to -18°)
    let tilt = (dx / 40) * 15;

    // Add a small natural flutter wave (±3°)
    const flutterWave = Math.sin((i * Math.PI) / 2 + seed) * 3;
    let bankAngle = tilt + flutterWave;

    // Strictly clamp rotation between -20° and +20° to prevent 360 spins or flipping upside down
    curr.rotation = Math.max(-20, Math.min(20, Math.round(bankAngle)));
  }

  // Ensure seamless loop back to first waypoint with matching rotation
  waypoints.push({
    ...waypoints[0],
    rotation: waypoints[0].rotation,
  });

  return { waypoints, duration };
}

export const FloatingButterfliesCanvas: React.FC<FloatingButterfliesCanvasProps> = ({
  butterflies,
  onSelectButterfly,
}) => {
  // Store generated paths in a persistent ref so state changes don't re-trigger or interrupt flight
  const pathsCacheRef = useRef<Record<string, { waypoints: Waypoint[]; duration: number }>>({});

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none">
      {butterflies.map((bf, idx) => {
        const key = bf.id || `bf-${idx}`;

        if (!pathsCacheRef.current[key]) {
          pathsCacheRef.current[key] = generateOrganicFlightPath(bf, idx);
        }

        const { waypoints, duration } = pathsCacheRef.current[key];

        return (
          <motion.div
            key={key}
            onClick={() => onSelectButterfly && onSelectButterfly(bf)}
            className="absolute pointer-events-auto cursor-pointer group hover:z-[9999]"
            initial={{
              left: `${waypoints[0].x}%`,
              top: `${waypoints[0].y}%`,
              rotate: waypoints[0].rotation,
              scale: waypoints[0].scale,
            }}
            animate={{
              left: waypoints.map((p) => `${p.x}%`),
              top: waypoints.map((p) => `${p.y}%`),
              rotate: waypoints.map((p) => p.rotation),
              scale: waypoints.map((p) => p.scale),
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
              times: waypoints.map((_, i) => i / (waypoints.length - 1)),
            }}
            whileHover={{ scale: 1.4, transition: { duration: 0.2 } }}
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
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-1 rounded-full bg-[#2D2B2A]/90 backdrop-blur-md text-white text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl pointer-events-none z-[9999] border border-amber-300/40">
              {bf.species} <span className="text-amber-300 font-normal">({bf.rarity})</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

