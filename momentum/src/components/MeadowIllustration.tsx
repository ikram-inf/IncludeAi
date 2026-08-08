import React from 'react';

interface MeadowIllustrationProps {
  className?: string;
}

export const MeadowIllustration: React.FC<MeadowIllustrationProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      {/* Hand-drawn style Meadow SVG matching user drawing */}
      <svg
        viewBox="0 0 1000 650"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full object-cover"
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="meadowSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#87ceeb" />
            <stop offset="65%" stopColor="#b9e7fe" />
            <stop offset="100%" stopColor="#e3f5ff" />
          </linearGradient>

          {/* Sun Radial Glow */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffff80" stopOpacity="1" />
            <stop offset="70%" stopColor="#fffa9e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fff873" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Sky Background */}
        <rect width="1000" height="650" fill="url(#meadowSky)" />

        {/* 2. Bright Glowing Sun at Top Center */}
        <circle cx="500" cy="40" r="110" fill="url(#sunGlow)" />
        <circle cx="500" cy="40" r="60" fill="#fffb77" />

        {/* 3. Fluffy Soft Clouds */}
        <path
          d="M 60 110 Q 90 70 140 80 Q 180 50 230 80 Q 280 80 300 120 Q 180 150 60 110 Z"
          fill="#ffffff"
          opacity="0.85"
        />
        <path
          d="M 680 120 Q 720 70 780 85 Q 830 50 890 85 Q 940 90 960 130 Q 820 160 680 120 Z"
          fill="#ffffff"
          opacity="0.85"
        />

        {/* 4. Left Side Tall Bushes/Trees with Black Ink Outlines */}
        <path
          d="M -20 650 L -20 230 Q 30 180 60 250 Q 110 200 130 280 Q 160 260 170 340 Q 220 320 225 430 Q 180 500 210 650 Z"
          fill="#52b848"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 5. Right Side Tall Bushes/Trees with Black Ink Outlines */}
        <path
          d="M 1020 650 L 1020 200 Q 960 170 920 240 Q 860 210 830 300 Q 780 320 760 410 Q 810 490 800 650 Z"
          fill="#4eb843"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 6. Two Main Rolling Green Hills in Center */}
        {/* Left Hill */}
        <path
          d="M 170 540 Q 200 270 360 270 Q 520 270 510 540 Z"
          fill="#6cc259"
          stroke="#000000"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right Hill */}
        <path
          d="M 480 540 Q 500 220 650 230 Q 800 240 820 540 Z"
          fill="#66c054"
          stroke="#000000"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Grassy Dash Textures on Hills (Hand-drawn look) */}
        <g stroke="#000000" strokeWidth="2.5" strokeLinecap="round">
          <line x1="280" y1="340" x2="295" y2="340" />
          <line x1="310" y1="360" x2="325" y2="360" />
          <line x1="260" y1="380" x2="275" y2="380" />
          <line x1="340" y1="410" x2="355" y2="410" />
          <line x1="380" y1="350" x2="395" y2="350" />
          <line x1="420" y1="390" x2="435" y2="390" />
          <line x1="450" y1="430" x2="465" y2="430" />

          <line x1="560" y1="320" x2="575" y2="320" />
          <line x1="600" y1="340" x2="615" y2="340" />
          <line x1="640" y1="310" x2="655" y2="310" />
          <line x1="580" y1="380" x2="595" y2="380" />
          <line x1="680" y1="370" x2="695" y2="370" />
          <line x1="720" y1="350" x2="735" y2="350" />
          <line x1="750" y1="400" x2="765" y2="400" />
        </g>

        {/* 7. Foreground Low Bush Layers */}
        <path
          d="M -10 650 Q 80 500 210 520 Q 300 480 420 540 Q 550 490 680 540 Q 780 480 880 530 Q 980 470 1010 650 Z"
          fill="#59bd4e"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M -10 650 Q 150 560 300 580 Q 450 530 600 580 Q 750 540 1010 650 Z"
          fill="#78cb6d"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Foreground Grassy Dashes */}
        <g stroke="#000000" strokeWidth="3" strokeLinecap="round">
          <line x1="490" y1="530" x2="510" y2="530" />
          <line x1="520" y1="550" x2="540" y2="550" />
          <line x1="590" y1="535" x2="605" y2="535" />
          <line x1="120" y1="570" x2="140" y2="570" />
          <line x1="220" y1="560" x2="240" y2="560" />
          <line x1="780" y1="560" x2="800" y2="560" />
          <line x1="840" y1="540" x2="860" y2="540" />
        </g>

        {/* 8. Flowers Scattered Across Hills and Bushes */}
        {/* Flower Template Component */}
        {/* Pink Flowers */}
        {[
          { cx: 295, cy: 275, color: '#ffa8ca' },
          { cx: 240, cy: 355, color: '#ffa8ca' },
          { cx: 395, cy: 335, color: '#ffa8ca' },
          { cx: 520, cy: 440, color: '#ffa8ca' },
          { cx: 665, cy: 215, color: '#ffa8ca' },
          { cx: 705, cy: 340, color: '#ffa8ca' },
          { cx: 370, cy: 525, color: '#ffa8ca' },
          { cx: 270, cy: 560, color: '#ffa8ca' },
          { cx: 415, cy: 550, color: '#ffa8ca' },
          { cx: 650, cy: 545, color: '#ffa8ca' },
          { cx: 750, cy: 615, color: '#ffa8ca' },
          { cx: 965, cy: 580, color: '#ffa8ca' },
          { cx: 95, cy: 580, color: '#ffa8ca' },
        ].map((f, i) => (
          <g key={`pink-${i}`}>
            {/* Stem */}
            <path
              d={`M ${f.cx} ${f.cy} L ${f.cx - 2} ${f.cy + 22}`}
              stroke="#000000"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Petals */}
            <circle cx={f.cx - 8} cy={f.cy} r="7" fill={f.color} stroke="#000" strokeWidth="1.5" />
            <circle cx={f.cx + 8} cy={f.cy} r="7" fill={f.color} stroke="#000" strokeWidth="1.5" />
            <circle cx={f.cx} cy={f.cy - 8} r="7" fill={f.color} stroke="#000" strokeWidth="1.5" />
            <circle cx={f.cx} cy={f.cy + 8} r="7" fill={f.color} stroke="#000" strokeWidth="1.5" />
            <circle cx={f.cx - 6} cy={f.cy - 6} r="6" fill={f.color} stroke="#000" strokeWidth="1.5" />
            <circle cx={f.cx + 6} cy={f.cy - 6} r="6" fill={f.color} stroke="#000" strokeWidth="1.5" />
            <circle cx={f.cx - 6} cy={f.cy + 6} r="6" fill={f.color} stroke="#000" strokeWidth="1.5" />
            <circle cx={f.cx + 6} cy={f.cy + 6} r="6" fill={f.color} stroke="#000" strokeWidth="1.5" />
            {/* Center */}
            <circle cx={f.cx} cy={f.cy} r="6" fill="#fffb77" stroke="#000" strokeWidth="1.5" />
          </g>
        ))}

        {/* Red / Coral Flowers */}
        {[
          { cx: 438, cy: 285, color: '#ff6161' },
          { cx: 340, cy: 345, color: '#ff6161' },
          { cx: 442, cy: 505, color: '#ff6161' },
          { cx: 610, cy: 280, color: '#ff6161' },
          { cx: 590, cy: 340, color: '#ff6161' },
          { cx: 760, cy: 255, color: '#ff6161' },
          { cx: 335, cy: 475, color: '#ff6161' },
          { cx: 348, cy: 595, color: '#ff6161' },
          { cx: 590, cy: 615, color: '#ff6161' },
          { cx: 830, cy: 570, color: '#ff6161' },
          { cx: 895, cy: 610, color: '#ff6161' },
          { cx: 180, cy: 540, color: '#ff6161' },
          { cx: 40, cy: 515, color: '#ff6161' },
        ].map((f, i) => (
          <g key={`red-${i}`}>
            {/* Stem */}
            <path
              d={`M ${f.cx} ${f.cy} L ${f.cx + 1} ${f.cy + 22}`}
              stroke="#000000"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Petals */}
            <circle cx={f.cx - 7} cy={f.cy} r="6" fill={f.color} stroke="#000" strokeWidth="1.5" />
            <circle cx={f.cx + 7} cy={f.cy} r="6" fill={f.color} stroke="#000" strokeWidth="1.5" />
            <circle cx={f.cx} cy={f.cy - 7} r="6" fill={f.color} stroke="#000" strokeWidth="1.5" />
            <circle cx={f.cx} cy={f.cy + 7} r="6" fill={f.color} stroke="#000" strokeWidth="1.5" />
            {/* Center */}
            <circle cx={f.cx} cy={f.cy} r="5" fill="#fffb77" stroke="#000" strokeWidth="1.5" />
          </g>
        ))}

        {/* Tiny White/Purple Flower Sprays */}
        {[
          { x: 95, y: 530 },
          { x: 280, y: 490 },
          { x: 605, y: 440 },
          { x: 730, y: 580 },
        ].map((s, i) => (
          <g key={`spray-${i}`} stroke="#000" strokeWidth="1.5" fill="none">
            <path d={`M ${s.x} ${s.y + 20} L ${s.x - 8} ${s.y} M ${s.x} ${s.y + 20} L ${s.x} ${s.y - 5} M ${s.x} ${s.y + 20} L ${s.x + 8} ${s.y}`} />
            <circle cx={s.x - 8} cy={s.y} r="3" fill="#e5d4ff" stroke="#000" />
            <circle cx={s.x} cy={s.y - 5} r="3" fill="#e5d4ff" stroke="#000" />
            <circle cx={s.x + 8} cy={s.y} r="3" fill="#e5d4ff" stroke="#000" />
          </g>
        ))}
      </svg>
    </div>
  );
};
