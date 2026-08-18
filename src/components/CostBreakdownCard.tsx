import React from 'react';
import { CostConsumer } from '../types';

interface CostBreakdownCardProps {
  id?: string;
  consumers: CostConsumer[];
  hostName?: string;
  totalWeekCost?: number;
  onSelectConsumer?: (consumer: CostConsumer) => void;
}

export const CostBreakdownCard: React.FC<CostBreakdownCardProps> = ({
  id,
  consumers,
  hostName = 'HUB',
  totalWeekCost = 1.38,
  onSelectConsumer,
}) => {
  return (
    <div
      id={id}
      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg backdrop-blur-md relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 blur-[50px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 text-xs">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-zinc-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="6" y1="8" x2="10" y2="8" />
            <line x1="6" y1="16" x2="14" y2="16" />
          </svg>
          <span className="font-bold tracking-wider text-zinc-500 uppercase">
            WHAT'S COSTING YOU
          </span>
          <span className="text-zinc-600">›</span>
          <span className="bg-zinc-800 text-blue-400 font-mono text-[10px] px-2 py-0.5 rounded-md uppercase font-bold border border-zinc-700/60">
            {hostName}
          </span>
        </div>

        <span className="text-zinc-500 text-[11px] font-mono">
          this week · <span className="text-amber-400 font-semibold">{totalWeekCost.toFixed(2)} $</span>
        </span>
      </div>

      {/* Breakdown Items */}
      <div className="flex flex-col gap-4 pt-1">
        {consumers.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectConsumer?.(item)}
            className="flex flex-col gap-1.5 cursor-pointer group bg-zinc-900/30 hover:bg-zinc-800/40 p-2.5 rounded-xl border border-transparent hover:border-zinc-800 transition"
          >
            {/* Top row: Name + GPU badge and Cost in Dollars */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-zinc-200 group-hover:text-blue-300 transition">
                  {item.name}
                </span>
                {item.isGpu && (
                  <span className="bg-amber-950/50 text-amber-400 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border border-amber-800/50">
                    GPU
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-0.5">
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {item.costDollar.toFixed(2)}
                </span>
                <span className="font-mono text-zinc-500 text-xs">$</span>
              </div>
            </div>

            {/* Middle row: Progress Bar */}
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700 shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                style={{ width: `${Math.max(2, item.percentage)}%` }}
              />
            </div>

            {/* Bottom row: Percentage of week + Watt avg / kWh */}
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>{item.percentage}% of week</span>
              <span>
                {item.avgWatts} W avg · {item.kwh.toFixed(2)} kWh
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
