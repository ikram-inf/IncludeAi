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
          filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.15))',
        }}
      >
        <defs>
          <linearGradient id={`grad-left-${primaryColor}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>
          <linearGradient id={`grad-right-${primaryColor}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>
        </defs>

        {/* Left Wings */}
        <g className={isFlapping ? 'origin-[50px_50px] animate-[flapLeft_1.2s_ease-in-out_infinite]' : ''}>
          {/* Top Left Wing */}
          <path
            d="M 50 48 C 30 10, 5 20, 10 52 C 15 70, 42 62, 50 52 Z"
            fill={`url(#grad-left-${primaryColor})`}
            stroke="#2D231E"
            strokeWidth="2.5"
          />
          {/* Inner Wing Pattern Detail */}
          <path
            d="M 45 45 C 32 25, 18 30, 20 48 C 22 58, 40 55, 45 50 Z"
            fill="none"
            stroke="#FFF"
            strokeWidth="1.5"
            strokeDasharray="2,2"
            opacity="0.8"
          />
          {/* Bottom Left Wing */}
          <path
            d="M 48 52 C 25 58, 18 78, 35 90 C 48 95, 50 68, 48 52 Z"
            fill={secondaryColor}
            stroke="#2D231E"
            strokeWidth="2"
          />
        </g>

        {/* Right Wings */}
        <g className={isFlapping ? 'origin-[50px_50px] animate-[flapRight_1.2s_ease-in-out_infinite]' : ''}>
          {/* Top Right Wing */}
          <path
            d="M 50 48 C 70 10, 95 20, 90 52 C 85 70, 58 62, 50 52 Z"
            fill={`url(#grad-right-${primaryColor})`}
            stroke="#2D231E"
            strokeWidth="2.5"
          />
          {/* Inner Wing Pattern Detail */}
          <path
            d="M 55 45 C 68 25, 82 30, 80 48 C 78 58, 60 55, 55 50 Z"
            fill="none"
            stroke="#FFF"
            strokeWidth="1.5"
            strokeDasharray="2,2"
            opacity="0.8"
          />
          {/* Bottom Right Wing */}
          <path
            d="M 52 52 C 75 58, 82 78, 65 90 C 52 95, 50 68, 52 52 Z"
            fill={secondaryColor}
            stroke="#2D231E"
            strokeWidth="2"
          />
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
