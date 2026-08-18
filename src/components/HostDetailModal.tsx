import React from 'react';
import { HostNode } from '../types';

interface HostDetailModalProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  host: HostNode | null;
  onTriggerAction?: (action: string) => void;
}

export const HostDetailModal: React.FC<HostDetailModalProps> = ({
  id,
  isOpen,
  onClose,
  host,
  onTriggerAction,
}) => {
  if (!isOpen || !host) return null;

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-[#09090b] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Header */}
        <div className="bg-zinc-900/80 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-full ${
                host.status === 'offline'
                  ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]'
                  : host.status === 'warning'
                  ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]'
                  : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
              }`}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#fafafa] font-sans">{host.name}</h3>
                <span className="bg-zinc-800 text-zinc-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-zinc-700">
                  {host.ip}
                </span>
                {host.hasGpu && (
                  <span className="bg-blue-950/70 text-blue-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-blue-800/60">
                    GPU
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">{host.os}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded-xl hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body Specs */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
          {/* Status Alert if any */}
          {host.status === 'offline' && (
            <div className="bg-rose-950/40 border border-rose-900/80 rounded-xl p-3.5 text-rose-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>⚠ Host is unreachable over SSH (port 22).</span>
              </div>
              <button
                onClick={() => onTriggerAction?.(`Wake on LAN ${host.name}`)}
                className="bg-rose-900 hover:bg-rose-800 text-rose-100 px-3 py-1.5 rounded-lg text-xs uppercase font-bold transition shadow"
              >
                Send WoL Packet
              </button>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-900/50 p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block uppercase font-bold">CPU Utilization</span>
              <span className="text-xl font-bold text-[#fafafa] mt-0.5 block">{host.cpuPercent}%</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">{host.cores} cores</span>
            </div>

            <div className="bg-zinc-900/50 p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block uppercase font-bold">RAM Memory</span>
              <span className="text-xl font-bold text-[#fafafa] mt-0.5 block">{host.ramPercent}%</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">
                {(host.ramUsedGb || 0).toFixed(1)} / {(host.ramTotalGb || 0).toFixed(1)} GB
              </span>
            </div>

            <div className="bg-zinc-900/50 p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block uppercase font-bold">Primary Storage</span>
              <span className="text-xl font-bold text-[#fafafa] mt-0.5 block">{host.diskPercent}%</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">NVMe Root</span>
            </div>

            <div className="bg-zinc-900/50 p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block uppercase font-bold">System Uptime</span>
              <span className="text-xl font-bold text-[#fafafa] truncate block mt-0.5">{host.uptime}</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">Load avg: {host.loadAvg || '1.14'}</span>
            </div>
          </div>

          {/* GPU Details if present */}
          {host.hasGpu && (
            <div className="bg-zinc-900/50 p-4 rounded-2xl border border-blue-900/40 space-y-2.5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-bold uppercase tracking-wider text-[11px]">
                  NVIDIA GPU Telemetry
                </span>
                <span className="text-zinc-300 font-medium">{host.gpuModel || 'GeForce RTX 4090'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-zinc-300 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                <div>
                  <span className="text-zinc-500 block text-[9px] font-bold">VRAM USAGE</span>
                  <span className="text-zinc-200">{host.gpuVramUsedMb || 844} MB / {host.gpuVramTotalMb || 24576} MB</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] font-bold">TEMPERATURE</span>
                  <span className="text-zinc-200">{host.gpuTempC || 40}°C</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] font-bold">POWER BURN</span>
                  <span className="text-zinc-200">{host.powerWatts || 37} W</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
