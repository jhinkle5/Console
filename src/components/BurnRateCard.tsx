import React from 'react';

interface BurnRateCardProps {
  id?: string;
  hostName?: string;
  currentWatts?: number;
  hourlyRate?: number; // e.g. 0.011
  todayCost?: number;  // e.g. 0.12
  sevenDayCost?: number; // e.g. 1.38
  thirtyDayCost?: number; // e.g. 5.17
}

export const BurnRateCard: React.FC<BurnRateCardProps> = ({
  id,
  hostName = 'HUB',
  currentWatts = 37,
  hourlyRate = 0.011,
  todayCost = 0.12,
  sevenDayCost = 1.38,
  thirtyDayCost = 5.17,
}) => {
  const monthlyProjection = (hourlyRate * 24 * 30.5).toFixed(2);

  return (
    <div
      id={id}
      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg backdrop-blur-md relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 blur-[50px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-amber-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span className="font-bold tracking-wider text-zinc-500 uppercase">BURN RATE</span>
          <span className="text-zinc-600">›</span>
          <span className="bg-zinc-800 text-blue-400 font-mono text-[10px] px-2 py-0.5 rounded-md uppercase font-bold border border-zinc-700/60">
            {hostName}
          </span>
        </div>

        <span className="text-zinc-500 text-[11px] font-mono">
          GPU energy · metered · day tariff
        </span>
      </div>

      {/* Main Content Split: Left (Spending Now) & Right (Stat Boxes) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left Big Metric */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase mb-0.5">
            SPENDING RIGHT NOW
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl lg:text-5xl font-black text-amber-400 tracking-tight font-mono">
              {hourlyRate.toFixed(3)}
            </span>
            <span className="text-sm font-bold text-zinc-400 font-mono">$/h</span>
          </div>
          <div className="text-[11px] text-zinc-400 font-mono mt-1">
            at this rate ≈{' '}
            <span className="text-amber-300 font-semibold">{monthlyProjection} $</span> / month ·{' '}
            <span className="text-zinc-300">{currentWatts} W</span>
          </div>
        </div>

        {/* Right 3 Stat Boxes */}
        <div className="md:col-span-7 grid grid-cols-3 gap-2.5">
          {/* Today */}
          <div className="bg-zinc-800/40 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
              TODAY
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl lg:text-2xl font-black text-[#fafafa] font-mono">
                {todayCost.toFixed(2)}
              </span>
              <span className="text-xs text-zinc-500 font-mono font-medium">$</span>
            </div>
          </div>

          {/* 7 Days */}
          <div className="bg-zinc-800/40 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
              7 DAYS
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl lg:text-2xl font-black text-[#fafafa] font-mono">
                {sevenDayCost.toFixed(2)}
              </span>
              <span className="text-xs text-zinc-500 font-mono font-medium">$</span>
            </div>
          </div>

          {/* 30 Days */}
          <div className="bg-zinc-800/40 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
              30 DAYS
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl lg:text-2xl font-black text-[#fafafa] font-mono">
                {thirtyDayCost.toFixed(2)}
              </span>
              <span className="text-xs text-zinc-500 font-mono font-medium">$</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
