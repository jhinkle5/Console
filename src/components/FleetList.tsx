import React from 'react';
import { HostNode } from '../types';

interface FleetListProps {
  id?: string;
  hosts: HostNode[];
  selectedHostId: string;
  onSelectHost: (id: string) => void;
  onOpenHostDetail?: (host: HostNode) => void;
  onDiagnoseOfflineHost?: (host: HostNode) => void;
}

export const FleetList: React.FC<FleetListProps> = ({
  id,
  hosts,
  selectedHostId,
  onSelectHost,
  onOpenHostDetail,
  onDiagnoseOfflineHost,
}) => {
  const onlineCount = hosts.filter((h) => h.status !== 'offline').length;

  return (
    <div
      id={id}
      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col shadow-lg backdrop-blur-md relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[50px] pointer-events-none" />

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
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span className="font-bold tracking-wider text-zinc-500 uppercase">FLEET NODES</span>
        </div>
        <span className="text-zinc-500 font-mono text-[11px]">
          {onlineCount} / {hosts.length} online
        </span>
      </div>

      {/* Host Cards Stack */}
      <div className="flex flex-col gap-3">
        {hosts.map((host) => {
          const isSelected = selectedHostId === host.id;
          const isOffline = host.status === 'offline';

          return (
            <div
              key={host.id}
              onClick={() => onSelectHost(host.id)}
              className={`rounded-xl p-3.5 border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-zinc-800/80 border-blue-500/60 shadow-[0_0_15px_rgba(37,99,235,0.15)] ring-1 ring-blue-500/30'
                  : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/50'
              }`}
            >
              {/* Top Row: Name + Badges + OS */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full inline-block ${
                      isOffline
                        ? 'bg-rose-500 animate-pulse shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                        : host.status === 'warning'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]'
                    }`}
                  />
                  <span className="font-bold text-sm text-[#fafafa] font-sans tracking-tight">
                    {host.name}
                  </span>

                  {/* GPU Badge */}
                  {host.hasGpu && (
                    <span className="bg-amber-950/60 text-amber-400 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-amber-800/50">
                      GPU
                    </span>
                  )}

                  {/* Updates Pending Badge */}
                  {Boolean(host.updatesPending) && (
                    <span className="bg-blue-950/60 text-blue-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-blue-800/50">
                      {host.updatesPending} upd
                    </span>
                  )}

                  {/* Disk Warning Badge */}
                  {host.diskAlertBadge && (
                    <span className="bg-rose-950/60 text-rose-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-rose-800/50">
                      {host.diskAlertBadge}
                    </span>
                  )}
                </div>

                {/* OS and Detail Arrow */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenHostDetail?.(host);
                  }}
                  className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 text-[11px] font-mono group"
                  title="Inspect host system metrics"
                >
                  <span className="truncate max-w-[120px]">{host.os}</span>
                  <svg
                    className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </div>

              {/* Middle Row: Metrics or Offline Warning */}
              {isOffline ? (
                <div className="py-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-rose-400 bg-rose-950/20 px-2.5 py-1.5 rounded-lg border border-rose-900/40">
                    <div className="flex items-center gap-1.5 truncate">
                      <span>⚠ OFFLINE · ssh: connect failed</span>
                    </div>
                    {onDiagnoseOfflineHost && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDiagnoseOfflineHost(host);
                        }}
                        className="text-[10px] bg-rose-900/60 hover:bg-rose-800 text-rose-200 px-2 py-0.5 rounded uppercase font-bold shrink-0 ml-2 transition"
                      >
                        Triage AI
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* CPU / RAM / DISK pill bars */}
                  <div className="grid grid-cols-3 gap-2 my-2 font-mono text-[11px]">
                    {/* CPU */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-500 text-[10px] uppercase">CPU</span>
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden flex items-center">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                          style={{ width: `${Math.max(4, host.cpuPercent)}%` }}
                        />
                      </div>
                      <span className="text-zinc-300 text-[10px] font-semibold w-7 text-right">
                        {host.cpuPercent}%
                      </span>
                    </div>

                    {/* RAM */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-500 text-[10px] uppercase">RAM</span>
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden flex items-center">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            host.ramPercent > 85
                              ? 'bg-rose-400'
                              : host.ramPercent > 70
                              ? 'bg-amber-400'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.max(4, host.ramPercent)}%` }}
                        />
                      </div>
                      <span className="text-zinc-300 text-[10px] font-semibold w-7 text-right">
                        {host.ramPercent}%
                      </span>
                    </div>

                    {/* DISK */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-500 text-[10px] uppercase">DISK</span>
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden flex items-center">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            host.diskPercent > 90
                              ? 'bg-rose-500'
                              : host.diskPercent > 80
                              ? 'bg-amber-400'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.max(4, host.diskPercent)}%` }}
                        />
                      </div>
                      <span className="text-zinc-300 text-[10px] font-semibold w-9 text-right">
                        {host.diskPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Cores, Temp, Uptime */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1 border-t border-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <span>{host.cores} cores</span>
                      {host.tempC !== undefined && (
                        <>
                          <span className="text-zinc-700">•</span>
                          <span className="text-zinc-400">{host.tempC}°C</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-zinc-400">
                      <span>↑</span>
                      <span>{host.uptime}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
