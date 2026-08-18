import React from 'react';

interface RadialGaugeProps {
  id?: string;
  value: number; // 0 to 100
  title: string;
  subtext: string;
  color: string; // e.g. '#f59e0b' (yellow/amber), '#38bdf8' (cyan/blue), '#22c55e' (green)
  trackColor?: string;
  size?: number;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({
  id,
  value,
  title,
  subtext,
  color,
  trackColor = '#27272a',
  size = 170,
}) => {
  // Semi-circular / open-bottom gauge (approx 240 degrees from 150deg to 390deg)
  const radius = 64;
  const strokeWidth = 9;
  const cx = size / 2;
  const cy = size / 2 - 4;

  const startAngle = 140;
  const endAngle = 400;
  const totalAngle = endAngle - startAngle; // 260 deg

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(x, y, r, endA);
    const end = polarToCartesian(x, y, r, startA);
    const arcSweep = endA - startA <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', r, r, 0, arcSweep, 0, end.x, end.y].join(' ');
  };

  const trackPath = describeArc(cx, cy, radius, startAngle, endAngle);

  // Clamp value
  const clampedVal = Math.min(100, Math.max(0, value));
  const currentAngle = startAngle + (clampedVal / 100) * totalAngle;
  const valuePath = clampedVal > 0 ? describeArc(cx, cy, radius, startAngle, currentAngle) : '';

  // Calculate position of indicator tip dot
  const tipPos = polarToCartesian(cx, cy, radius, currentAngle);

  return (
    <div id={id} className="flex flex-col items-center justify-center flex-1 min-w-[140px] px-2 py-3 select-none">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size * 0.88 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {/* Background track */}
          <path
            d={trackPath}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Filled active value arc */}
          {clampedVal > 0 && (
            <path
              d={valuePath}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          )}

          {/* Tip highlight dot */}
          {clampedVal > 0 && (
            <circle
              cx={tipPos.x}
              cy={tipPos.y}
              r={strokeWidth / 2 + 1.5}
              fill={color}
              className="transition-all duration-700 ease-out"
            />
          )}
        </svg>

        {/* Center label & percentage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-[11px] text-zinc-500 font-mono font-medium -mb-1">%</span>
          <span className="text-4xl font-extrabold text-[#fafafa] tracking-tight font-mono">
            {Math.round(value)}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="text-xs font-bold uppercase tracking-wider text-zinc-300 mt-0.5 font-mono">
        {title}
      </div>

      {/* Subtext info */}
      <div className="text-[11px] text-zinc-400 font-mono mt-0.5 text-center truncate max-w-full">
        {subtext}
      </div>
    </div>
  );
};
