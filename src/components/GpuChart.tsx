import React, { useState } from 'react';
import { MetricTimeSeriesPoint } from '../types';

interface GpuChartProps {
  id?: string;
  data: MetricTimeSeriesPoint[];
  hostName?: string;
  timeRange?: string;
}

export const GpuChart: React.FC<GpuChartProps> = ({
  id,
  data,
  hostName = 'HUB',
  timeRange = 'last 6h',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [showUtil, setShowUtil] = useState(true);
  const [showPower, setShowPower] = useState(true);
  const [showTemp, setShowTemp] = useState(true);

  const width = 680;
  const height = 180;
  const padLeft = 36;
  const padRight = 36;
  const padTop = 16;
  const padBottom = 26;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Max values for scaling
  const maxUtil = 100;
  const maxPower = 100; // max watts scale
  const maxTemp = 80;   // max temp scale

  const getX = (index: number) => {
    if (data.length <= 1) return padLeft + chartW / 2;
    return padLeft + (index / (data.length - 1)) * chartW;
  };

  const getYUtil = (val: number) => padTop + chartH - (Math.min(maxUtil, Math.max(0, val)) / maxUtil) * chartH;
  const getYPower = (val: number) => padTop + chartH - (Math.min(maxPower, Math.max(0, val)) / maxPower) * chartH;
  const getYTemp = (val: number) => padTop + chartH - (Math.min(maxTemp, Math.max(0, val)) / maxTemp) * chartH;

  const createSvgPath = (getYFn: (v: number) => number, key: 'gpuUtil' | 'powerW' | 'tempC') => {
    if (data.length === 0) return '';
    return data.reduce((acc, point, idx) => {
      const x = getX(idx);
      const y = getYFn(point[key]);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  const pathUtil = createSvgPath(getYUtil, 'gpuUtil');
  const pathPower = createSvgPath(getYPower, 'powerW');
  const pathTemp = createSvgPath(getYTemp, 'tempC');

  const hoveredPoint = hoveredIdx !== null ? data[hoveredIdx] : null;

  return (
    <div id={id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 text-xs flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="M7 16l4-8 4 4 5-9" />
          </svg>
          <span className="font-bold tracking-wider text-zinc-500 uppercase">GPU · UTIL, POWER & TEMP</span>
          <span className="text-zinc-600">›</span>
          <span className="bg-zinc-800 text-blue-400 font-mono text-[10px] px-2 py-0.5 rounded-md uppercase font-bold border border-zinc-700/60">
            {hostName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend toggles */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono select-none bg-zinc-900/80 p-0.5 rounded-xl border border-zinc-800">
            <button
              onClick={() => setShowUtil(!showUtil)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition ${
                showUtil ? 'text-sky-400 bg-sky-950/40 font-bold' : 'text-zinc-600 line-through'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
              <span>GPU %</span>
            </button>

            <button
              onClick={() => setShowPower(!showPower)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition ${
                showPower ? 'text-amber-400 bg-amber-950/40 font-bold' : 'text-zinc-600 line-through'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
              <span>Power W</span>
            </button>

            <button
              onClick={() => setShowTemp(!showTemp)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition ${
                showTemp ? 'text-pink-400 bg-pink-950/40 font-bold' : 'text-zinc-600 line-through'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-pink-500 inline-block shadow-[0_0_6px_rgba(236,72,153,0.6)]" />
              <span>Temp °C</span>
            </button>
          </div>

          <span className="text-zinc-500 text-[11px] font-mono">{timeRange}</span>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full overflow-hidden pt-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padTop + chartH * (1 - ratio);
            return (
              <g key={i}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#27272a"
                  strokeDasharray={ratio === 0 ? '' : '3,4'}
                  strokeWidth="1"
                />
                {/* Left Y label */}
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="#71717a"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {Math.round(ratio * 100)}
                </text>
                {/* Right Y label (Temp scale) */}
                <text
                  x={width - padRight + 6}
                  y={y + 3}
                  textAnchor="start"
                  fill="#71717a"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {Math.round(ratio * 80)}
                </text>
              </g>
            );
          })}

          {/* Time Series Paths */}
          {showUtil && (
            <path
              d={pathUtil}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {showPower && (
            <path
              d={pathPower}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {showTemp && (
            <path
              d={pathTemp}
              fill="none"
              stroke="#ec4899"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Hover Column & Markers */}
          {hoveredIdx !== null && hoveredPoint && (
            <g>
              <line
                x1={getX(hoveredIdx)}
                y1={padTop}
                x2={getX(hoveredIdx)}
                y2={padTop + chartH}
                stroke="#52525b"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              {showUtil && (
                <circle
                  cx={getX(hoveredIdx)}
                  cy={getYUtil(hoveredPoint.gpuUtil)}
                  r="4.5"
                  fill="#38bdf8"
                  stroke="#09090b"
                  strokeWidth="2"
                />
              )}
              {showPower && (
                <circle
                  cx={getX(hoveredIdx)}
                  cy={getYPower(hoveredPoint.powerW)}
                  r="4.5"
                  fill="#f59e0b"
                  stroke="#09090b"
                  strokeWidth="2"
                />
              )}
              {showTemp && (
                <circle
                  cx={getX(hoveredIdx)}
                  cy={getYTemp(hoveredPoint.tempC)}
                  r="4.5"
                  fill="#ec4899"
                  stroke="#09090b"
                  strokeWidth="2"
                />
              )}
            </g>
          )}

          {/* Interactive touch/hover invisible strips */}
          {data.map((point, idx) => {
            const x = getX(idx);
            const w = chartW / data.length;
            return (
              <rect
                key={idx}
                x={x - w / 2}
                y={padTop}
                width={w}
                height={chartH}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredIdx(idx)}
              />
            );
          })}

          {/* X Axis Timestamps */}
          {data.map((point, idx) => {
            const x = getX(idx);
            return (
              <text
                key={idx}
                x={x}
                y={height - 6}
                textAnchor="middle"
                fill={hoveredIdx === idx ? '#fafafa' : '#71717a'}
                fontSize="10"
                fontFamily="monospace"
                fontWeight={hoveredIdx === idx ? 'bold' : 'normal'}
              >
                {point.time}
              </text>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIdx !== null && hoveredPoint && (
          <div
            className="absolute top-2 pointer-events-none bg-zinc-900/95 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs shadow-2xl backdrop-blur-md transition-all z-20"
            style={{
              left: `${Math.min(80, Math.max(10, (hoveredIdx / (data.length - 1)) * 85))}%`,
            }}
          >
            <div className="text-zinc-400 font-mono text-[10px] mb-1 font-bold">
              Timestamp: {hoveredPoint.time}
            </div>
            <div className="grid grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="text-sky-400">
                <span className="text-zinc-500 block text-[9px] font-bold">UTIL</span>
                {hoveredPoint.gpuUtil}%
              </div>
              <div className="text-amber-400">
                <span className="text-zinc-500 block text-[9px] font-bold">POWER</span>
                {hoveredPoint.powerW} W
              </div>
              <div className="text-pink-400">
                <span className="text-zinc-500 block text-[9px] font-bold">TEMP</span>
                {hoveredPoint.tempC}°C
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
