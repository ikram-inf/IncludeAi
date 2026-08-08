import React from 'react';

interface ButterflyVisualProps {
  primaryColor?: string;
  secondaryColor?: string;
  size?: number;
  wingPattern?: 'monarch' | 'swallowtail' | 'morpho' | 'dream' | 'prism';
  isFlapping?: boolean;
  className?: string;
}

export const ButterflyVisual: React.FC<ButterflyVisualProps> = ({
  primaryColor = '#E37663',
  secondaryColor = '#F87171',
  size = 60,
  wingPattern = 'monarch',
  isFlapping = true,
  className = '',
}) => {
  // Generate a safe unique ID for gradients based on colors and size
  const safeId = `${primaryColor.replace(/[^a-zA-Z0-9]/g, '')}-${secondaryColor.replace(/[^a-zA-Z0-9]/g, '')}-${wingPattern}`;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full drop-shadow-md transition-transform ${
          isFlapping ? 'animate-pulse' : ''
        }`}
        style={{
          filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))',
        }}
      >
        <defs>
          <linearGradient id={`grad-left-${safeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>
          <linearGradient id={`grad-right-${safeId}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>
        </defs>

        {/* Left Wings */}
        <g className={isFlapping ? 'origin-[50px_50px] animate-[flapLeft_1.2s_ease-in-out_infinite]' : ''}>
          {wingPattern === 'swallowtail' && (
            <>
              {/* Swallowtail top left wing */}
              <path
                d="M 50 46 C 25 5, 2 15, 8 52 C 12 72, 42 64, 50 50 Z"
                fill={`url(#grad-left-${safeId})`}
                stroke="#2D231E"
                strokeWidth="2.5"
              />
              {/* Swallowtail tail extension */}
              <path
                d="M 48 52 C 22 58, 12 78, 20 96 C 26 102, 32 86, 48 58 Z"
                fill={secondaryColor}
                stroke="#2D231E"
                strokeWidth="2"
              />
              <circle cx="20" cy="92" r="2.5" fill="#FCD34D" />
            </>
          )}

          {wingPattern === 'morpho' && (
            <>
              {/* Broad curved Morpho wings */}
              <path
                d="M 50 48 C 20 8, 2 28, 5 55 C 8 78, 42 68, 50 52 Z"
                fill={`url(#grad-left-${safeId})`}
                stroke="#1E1B4B"
                strokeWidth="2.5"
              />
              <path
                d="M 48 52 C 20 60, 15 82, 38 92 C 48 95, 50 68, 48 52 Z"
                fill={secondaryColor}
                stroke="#1E1B4B"
                strokeWidth="2"
              />
              <path
                d="M 45 42 Q 22 35 15 50"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                opacity="0.8"
              />
            </>
          )}

          {wingPattern === 'dream' && (
            <>
              {/* Ethereal fairy lobes */}
              <path
                d="M 50 45 C 18 10, 5 35, 12 55 C 20 68, 40 60, 50 50 Z"
                fill={`url(#grad-left-${safeId})`}
                stroke="#3B0764"
                strokeWidth="2"
              />
              <path
                d="M 48 50 C 15 52, 8 75, 28 88 C 42 96, 50 68, 48 50 Z"
                fill={secondaryColor}
                stroke="#3B0764"
                strokeWidth="1.8"
              />
              <circle cx="22" cy="40" r="3" fill="#FFFFFF" opacity="0.9" />
              <circle cx="28" cy="72" r="2" fill="#FFFFFF" opacity="0.9" />
            </>
          )}

          {wingPattern === 'prism' && (
            <>
              {/* Sharp crystalline wings */}
              <polygon
                points="50,45 10,18 2,52 42,62"
                fill={`url(#grad-left-${safeId})`}
                stroke="#0F172A"
                strokeWidth="2.5"
              />
              <polygon
                points="48,52 12,65 28,94 48,60"
                fill={secondaryColor}
                stroke="#0F172A"
                strokeWidth="2"
              />
              <line x1="50" y1="45" x2="10" y2="18" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.7" />
            </>
          )}

          {wingPattern === 'monarch' && (
            <>
              {/* Classic Monarch Wing */}
              <path
                d="M 50 48 C 30 10, 5 20, 10 52 C 15 70, 42 62, 50 52 Z"
                fill={`url(#grad-left-${safeId})`}
                stroke="#2D231E"
                strokeWidth="2.5"
              />
              <path
                d="M 45 45 C 32 25, 18 30, 20 48 C 22 58, 40 55, 45 50 Z"
                fill="none"
                stroke="#FFF"
                strokeWidth="1.5"
                strokeDasharray="2,2"
                opacity="0.8"
              />
              <path
                d="M 48 52 C 25 58, 18 78, 35 90 C 48 95, 50 68, 48 52 Z"
                fill={secondaryColor}
                stroke="#2D231E"
                strokeWidth="2"
              />
            </>
          )}
        </g>

        {/* Right Wings */}
        <g className={isFlapping ? 'origin-[50px_50px] animate-[flapRight_1.2s_ease-in-out_infinite]' : ''}>
          {wingPattern === 'swallowtail' && (
            <>
              <path
                d="M 50 46 C 75 5, 98 15, 92 52 C 88 72, 58 64, 50 50 Z"
                fill={`url(#grad-right-${safeId})`}
                stroke="#2D231E"
                strokeWidth="2.5"
              />
              <path
                d="M 52 52 C 78 58, 88 78, 80 96 C 74 102, 68 86, 52 58 Z"
                fill={secondaryColor}
                stroke="#2D231E"
                strokeWidth="2"
              />
              <circle cx="80" cy="92" r="2.5" fill="#FCD34D" />
            </>
          )}

          {wingPattern === 'morpho' && (
            <>
              <path
                d="M 50 48 C 80 8, 98 28, 95 55 C 92 78, 58 68, 50 52 Z"
                fill={`url(#grad-right-${safeId})`}
                stroke="#1E1B4B"
                strokeWidth="2.5"
              />
              <path
                d="M 52 52 C 80 60, 85 82, 62 92 C 52 95, 50 68, 52 52 Z"
                fill={secondaryColor}
                stroke="#1E1B4B"
                strokeWidth="2"
              />
              <path
                d="M 55 42 Q 78 35 85 50"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                opacity="0.8"
              />
            </>
          )}

          {wingPattern === 'dream' && (
            <>
              <path
                d="M 50 45 C 82 10, 95 35, 88 55 C 80 68, 60 60, 50 50 Z"
                fill={`url(#grad-right-${safeId})`}
                stroke="#3B0764"
                strokeWidth="2"
              />
              <path
                d="M 52 50 C 85 52, 92 75, 72 88 C 58 96, 50 68, 52 50 Z"
                fill={secondaryColor}
                stroke="#3B0764"
                strokeWidth="1.8"
              />
              <circle cx="78" cy="40" r="3" fill="#FFFFFF" opacity="0.9" />
              <circle cx="72" cy="72" r="2" fill="#FFFFFF" opacity="0.9" />
            </>
          )}

          {wingPattern === 'prism' && (
            <>
              <polygon
                points="50,45 90,18 98,52 58,62"
                fill={`url(#grad-right-${safeId})`}
                stroke="#0F172A"
                strokeWidth="2.5"
              />
              <polygon
                points="52,52 88,65 72,94 52,60"
                fill={secondaryColor}
                stroke="#0F172A"
                strokeWidth="2"
              />
              <line x1="50" y1="45" x2="90" y2="18" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.7" />
            </>
          )}

          {wingPattern === 'monarch' && (
            <>
              <path
                d="M 50 48 C 70 10, 95 20, 90 52 C 85 70, 58 62, 50 52 Z"
                fill={`url(#grad-right-${safeId})`}
                stroke="#2D231E"
                strokeWidth="2.5"
              />
              <path
                d="M 55 45 C 68 25, 82 30, 80 48 C 78 58, 60 55, 55 50 Z"
                fill="none"
                stroke="#FFF"
                strokeWidth="1.5"
                strokeDasharray="2,2"
                opacity="0.8"
              />
              <path
                d="M 52 52 C 75 58, 82 78, 65 90 C 52 95, 50 68, 52 52 Z"
                fill={secondaryColor}
                stroke="#2D231E"
                strokeWidth="2"
              />
            </>
          )}
        </g>

        {/* Antennae */}
        <path
          d="M 48 32 Q 40 18 35 15"
          fill="none"
          stroke="#2D231E"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="34" cy="14" r="2.5" fill="#2D231E" />

        <path
          d="M 52 32 Q 60 18 65 15"
          fill="none"
          stroke="#2D231E"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="66" cy="14" r="2.5" fill="#2D231E" />

        {/* Body */}
        <ellipse cx="50" cy="50" rx="4" ry="20" fill="#2D231E" />
        <ellipse cx="50" cy="34" rx="5" ry="5" fill="#2D231E" />
      </svg>
    </div>
  );
};

