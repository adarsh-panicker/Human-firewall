import React from 'react';
import { SkillCategory } from '../types/game';
import { SKILL_LABELS } from '../engine/scoringEngine';

interface CyberRadarChartProps {
  skills: Record<SkillCategory, { points: number; maxPoints: number; level: number } | { percentage: number }>;
  size?: number;
}

const CATEGORIES: SkillCategory[] = [
  'phishing',
  'verification',
  'authentication',
  'privacy',
  'incident',
  'browsing'
];

export const CyberRadarChart: React.FC<CyberRadarChartProps> = ({ skills, size = 280 }) => {
  const center = size / 2;
  const radius = size * 0.38;
  const angleStep = (Math.PI * 2) / CATEGORIES.length;

  // Compute percentage (0 - 100) for each category
  const percentages = CATEGORIES.map((cat) => {
    const data = skills[cat];
    if (!data) return 30;
    if ('percentage' in data) {
      return Math.max(15, data.percentage);
    }
    const max = data.maxPoints || 1;
    return Math.max(15, Math.round((data.points / max) * 100));
  });

  // Calculate polygon points
  const points = percentages.map((pct, idx) => {
    const angle = idx * angleStep - Math.PI / 2;
    const r = (pct / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // Web rings (25%, 50%, 75%, 100%)
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center justify-center">
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible select-none"
        aria-label="Defensive skills radar polygon"
      >
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.02" />
          </radialGradient>
          <linearGradient id="polyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Background web rings */}
        {rings.map((factor, idx) => {
          const ringPoints = CATEGORIES.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const r = factor * radius;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(' ');

          return (
            <polygon
              key={idx}
              points={ringPoints}
              fill="none"
              stroke="#1E293B"
              strokeWidth="1.2"
              strokeDasharray={idx < 3 ? "2 2" : undefined}
            />
          );
        })}

        {/* Spokes / Axis lines */}
        {CATEGORIES.map((_, idx) => {
          const angle = idx * angleStep - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#334155"
              strokeWidth="1"
            />
          );
        })}

        {/* Skill Area Polygon */}
        <polygon
          points={points}
          fill="url(#polyGrad)"
          stroke="#22D3EE"
          strokeWidth="2.2"
          className="transition-all duration-700 ease-out"
        />

        {/* Nodes / Vertices */}
        {percentages.map((pct, idx) => {
          const angle = idx * angleStep - Math.PI / 2;
          const r = (pct / 100) * radius;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="4"
              fill="#22D3EE"
              stroke="#070C18"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
          );
        })}

        {/* Labels */}
        {CATEGORIES.map((cat, idx) => {
          const angle = idx * angleStep - Math.PI / 2;
          const labelDist = radius + 24;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle);

          // Format label: short 2-word split
          const label = SKILL_LABELS[cat];
          const words = label.split(' ');

          return (
            <text
              key={cat}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] font-mono font-semibold fill-slate-300 pointer-events-none"
            >
              <tspan x={x} dy="-0.4em">{words[0]}</tspan>
              {words[1] && <tspan x={x} dy="1.1em">{words.slice(1).join(' ')}</tspan>}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
