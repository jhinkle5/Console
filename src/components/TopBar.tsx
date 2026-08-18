import React from 'react';
import { HostNode } from '../types';

interface TopBarProps {
  id?: string;
  hosts: HostNode[];
  selectedHostId: string;
  onSelectHost: (id: string) => void;
  onAddHost: () => void;
  timeRange: string;
  onChangeTimeRange: (range: string) => void;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  onManualRefresh: () => void;
  lastUpdated: string;
  isAiAgentOpen?: boolean;
  onToggleAiAgent?: () => void;
  onOpenMobileSidebar?: () => void;
  mcpStatus?: 'idle' | 'active' | 'syncing';
}

export const TopBar: React.FC<TopBarProps> = ({
  id,
  hosts,
  selectedHostId,
  onSelectHost,
  onAddHost,
  timeRange,
  onChangeTimeRange,
  autoRefresh,
  onToggleAutoRefresh,
  onManualRefresh,
  lastUpdated,
  isAiAgentOpen,
  onToggleAiAgent,
  onOpenMobileSidebar,
  mcpStatus = 'idle',
}) => {
  const timeRanges = ['1h', '6h', '24h', '7d', '30d', 'All'];

  return (
    <header
      id={id}
      className="bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none"
    >
      {/* Left: Mobile Menu + Host Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-0.5 max-w-full">
        {/* Mobile sidebar toggle button */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden bg-zinc-800/80 p-1.5 rounded-lg text-zinc-300 hover:text-white border border-zinc-700/50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mr-1 hidden sm:inline">
          HOST:
        </span>

        {/* Host pills */}
        {hosts.map((host) => {
          const isSelected = selectedHostId === host.id;
          const isOffline = host.status === 'offline';

          return (
            <button
              key={host.id}
              onClick={() => onSelectHost(host.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-zinc-800 text-[#fafafa] border border-zinc-700 shadow-sm font-bold ring-1 ring-blue-500/20'
                  : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOffline ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]' : host.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]'
                }`}
              />
              <span>{host.name}</span>
            </button>
          );
        })}

        {/* Add host button */}
        <button
          onClick={onAddHost}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-zinc-200 border border-dashed border-zinc-800 hover:border-zinc-600 transition whitespace-nowrap"
        >
          <span>+ Add host</span>
        </button>
      </div>

      {/* Middle & Right: Time filters, Auto-refresh, Status, Actions */}
      <div className="flex items-center gap-3 ml-auto flex-wrap">
        {/* Time filters */}
        <div className="bg-zinc-900/80 p-0.5 rounded-xl border border-zinc-800 flex items-center text-[11px] font-mono">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => onChangeTimeRange(r)}
              className={`px-2.5 py-0.5 rounded-lg transition ${
                timeRange === r
                  ? 'bg-zinc-800 text-[#fafafa] font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Auto-refresh toggle */}
        <label className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={onToggleAutoRefresh}
            className="rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-0 w-3.5 h-3.5"
          />
          <span className="flex items-center gap-1">
            {autoRefresh && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />}
            auto-refresh
          </span>
        </label>

        {/* Share button */}
        <button className="hidden md:flex items-center gap-1 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono px-3 py-1.5 rounded-xl transition">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          <span>Share</span>
          <span className="text-[10px] text-zinc-500">▾</span>
        </button>

        {/* 1 host behind warning badge */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/30 border border-amber-800/50 px-2.5 py-0.5 rounded-full">
          <span>↑ 1 host behind</span>
        </div>

        {/* MCP Status pill */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-3 py-1 rounded-full">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              mcpStatus === 'active' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-zinc-500'
            }`}
          />
          <span>MCP {mcpStatus}</span>
        </div>

        {/* Last updated timestamp + Refresh trigger */}
        <button
          onClick={onManualRefresh}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 group"
          title="Click to refresh telemetry"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
          <span>updated {lastUpdated}</span>
          <svg
            className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 group-hover:rotate-180 transition-transform duration-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
        </button>

        {/* AI Sentinel Guardian Trigger Button (Bento Capsule with Ping Radar) */}
        <button
          onClick={onToggleAiAgent}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all border ${
            isAiAgentOpen
              ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
              : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/80'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="font-semibold text-xs">AI AGENT: SENTINEL</span>
        </button>
      </div>
    </header>
  );
};
