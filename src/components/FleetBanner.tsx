import React from 'react';
import { HostNode } from '../types';

interface FleetBannerProps {
  id?: string;
  hosts: HostNode[];
  onFilterAttention?: () => void;
  isAttentionFiltered?: boolean;
}

export const FleetBanner: React.FC<FleetBannerProps> = ({
  id,
  hosts,
  onFilterAttention,
  isAttentionFiltered,
}) => {
  const onlineCount = hosts.filter((h) => h.status !== 'offline').length;
  const totalCount = hosts.length;

  const totalUsedRam = hosts.reduce((acc, h) => acc + (h.ramUsedGb || 0), 0);
  const totalRam = hosts.reduce((acc, h) => acc + (h.ramTotalGb || 0), 0);

  const attentionCount = hosts.filter(
    (h) => h.status === 'offline' || h.status === 'warning' || (h.updatesPending && h.updatesPending > 0)
  ).length;

  return (
    <div
      id={id}
      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md mb-4 backdrop-blur-md"
    >
      {/* Left: Status & Attention Trigger */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse inline-block shadow-[0_0_8px_rgba(244,63,94,0.7)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
            FLEET
          </span>
          <span className="text-sm font-bold text-zinc-100 font-mono">
            {onlineCount}/{totalCount} online
          </span>
        </div>

        {/* Attention Badge / Trigger */}
        <button
          onClick={onFilterAttention}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
            isAttentionFiltered
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/30'
              : 'border border-rose-900/60 text-rose-400 bg-rose-950/20 hover:bg-rose-950/40 hover:border-rose-700/80'
          }`}
        >
          <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>{attentionCount} need attention</span>
        </button>
      </div>

      {/* Right: Fleet RAM */}
      <div className="flex items-center gap-1.5 text-xs font-mono bg-zinc-900/60 border border-zinc-800/80 px-3 py-1 rounded-full">
        <span className="text-zinc-500 uppercase text-[10px] tracking-wider font-bold">Fleet RAM</span>
        <span className="font-bold text-zinc-100">{totalUsedRam.toFixed(1)} GB</span>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-400">{totalRam.toFixed(1)} GB</span>
      </div>
    </div>
  );
};
