import React from 'react';
import { DiagnosticItem, ContainerItem, SystemdService } from '../types';

interface BottomGridProps {
  id?: string;
  hostName?: string;
  containers: ContainerItem[];
  services: SystemdService[];
  diagnostics: DiagnosticItem[];
  onOpenContainers: () => void;
  onOpenServices: () => void;
  onOpenDiagnostics?: (diag: DiagnosticItem) => void;
}

export const BottomGrid: React.FC<BottomGridProps> = ({
  id,
  hostName = 'HUB',
  containers,
  services,
  diagnostics,
  onOpenContainers,
  onOpenServices,
  onOpenDiagnostics,
}) => {
  const healthyContainers = containers.filter((c) => c.status === 'running').length;
  const runningServices = services.filter((s) => s.status === 'active').length;
  const failedServices = services.filter((s) => s.status === 'failed').length;

  return (
    <div id={id} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* CONTAINERS > HUB */}
      <div
        onClick={onOpenContainers}
        className="lg:col-span-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg backdrop-blur-md cursor-pointer hover:border-zinc-700 hover:bg-zinc-800/40 transition-all group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[40px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span className="font-bold tracking-wider text-zinc-500 uppercase">CONTAINERS</span>
            <span className="text-zinc-600">›</span>
          </div>

          <span className="bg-zinc-800 text-blue-400 font-mono text-[10px] px-2 py-0.5 rounded-md uppercase font-bold border border-zinc-700/60">
            {hostName}
          </span>
        </div>

        {/* Content */}
        <div className="my-3">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl font-extrabold text-[#fafafa] font-mono">
              39 <span className="text-lg text-zinc-500 font-normal">/ 39</span>
            </span>
            <span className="bg-emerald-950/70 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-800/60 shadow-[0_0_6px_rgba(52,211,153,0.3)]">
              ALL HEALTHY
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[11px] font-mono text-zinc-500 flex items-center justify-between pt-2 border-t border-zinc-800/50">
          <span>0 problems</span>
          <span className="text-zinc-400 group-hover:text-blue-400 text-[11px] font-semibold flex items-center gap-0.5 transition">
            Inspect ›
          </span>
        </div>
      </div>

      {/* SERVICES > HUB */}
      <div
        onClick={onOpenServices}
        className="lg:col-span-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg backdrop-blur-md cursor-pointer hover:border-zinc-700 hover:bg-zinc-800/40 transition-all group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-[40px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span className="font-bold tracking-wider text-zinc-500 uppercase">SERVICES</span>
            <span className="text-zinc-600">›</span>
          </div>

          <span className="bg-zinc-800 text-blue-400 font-mono text-[10px] px-2 py-0.5 rounded-md uppercase font-bold border border-zinc-700/60">
            {hostName}
          </span>
        </div>

        {/* Content */}
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#fafafa] font-mono">
              91
            </span>
            <span className="text-sm font-mono text-zinc-400 font-medium">
              running
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[11px] font-mono flex items-center justify-between pt-2 border-t border-zinc-800/50">
          <span className="flex items-center gap-1.5">
            <span className="bg-amber-950/60 text-amber-300 text-[10px] px-2 py-0.5 rounded-md font-bold border border-amber-800/50">
              4 failed
            </span>
            <span className="text-zinc-500 text-[10px] truncate max-w-[110px]">— harmless</span>
          </span>
          <span className="text-zinc-400 group-hover:text-amber-400 text-[11px] font-semibold transition">
            ›
          </span>
        </div>
      </div>

      {/* DIAGNOSTICS (6 / 6 GREEN) */}
      <div className="lg:col-span-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-zinc-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span className="font-bold tracking-wider text-zinc-500 uppercase">DIAGNOSTICS</span>
          </div>
          <span className="text-emerald-400 font-mono text-[11px] font-bold flex items-center gap-1.5 bg-zinc-900/80 px-2.5 py-0.5 rounded-full border border-zinc-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            6 / 6 GREEN
          </span>
        </div>

        {/* 6 Diagnostics Grid (2 rows of 3 on large screens, 2 cols on tablet) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {diagnostics.map((diag) => (
            <div
              key={diag.id}
              onClick={() => onOpenDiagnostics?.(diag)}
              className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 flex items-start gap-2.5 hover:border-zinc-700 hover:bg-zinc-800/40 transition cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-zinc-200 font-sans tracking-tight">
                  {diag.name}
                </div>
                <div className="text-[10.5px] font-mono text-zinc-400 truncate mt-0.5">
                  {diag.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
