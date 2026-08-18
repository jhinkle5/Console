import React, { useState } from 'react';
import { ContainerItem } from '../types';

interface ContainersModalProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  containers: ContainerItem[];
  onRestartContainer?: (id: string) => void;
  onStopContainer?: (id: string) => void;
}

export const ContainersModal: React.FC<ContainersModalProps> = ({
  id,
  isOpen,
  onClose,
  containers,
  onRestartContainer,
  onStopContainer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContainer, setSelectedContainer] = useState<ContainerItem | null>(null);

  if (!isOpen) return null;

  const filtered = containers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.image.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-[#09090b] border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Header */}
        <div className="bg-zinc-900/80 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#fafafa] font-sans">Docker Containers Manager</h3>
                <span className="bg-emerald-950 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-800/60 shadow-[0_0_6px_rgba(52,211,153,0.3)]">
                  {containers.length} Running
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono">Hub node socket: /var/run/docker.sock</p>
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

        {/* Search bar */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/60">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search containers by name or image (e.g. whisperx, ollama, immich)..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Containers Table / List */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          <div className="grid grid-cols-1 gap-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 hover:bg-zinc-900/80 transition flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#fafafa] font-mono text-xs">{item.name}</span>
                      {item.gpuAssigned && (
                        <span className="bg-amber-950/70 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded-md border border-amber-800/50 font-bold">
                          GPU:0
                        </span>
                      )}
                      <span className="bg-emerald-950/60 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-md font-medium">
                        {item.health}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono block truncate max-w-sm mt-0.5">
                      {item.image}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400">
                  <div>
                    <span className="text-zinc-500 block text-[9px] uppercase font-bold">CPU</span>
                    <span className="text-zinc-200 font-bold">{item.cpuPercent}%</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px] uppercase font-bold">Memory</span>
                    <span className="text-zinc-200 font-bold">{(item.memoryMb / 1024).toFixed(2)} GB</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px] uppercase font-bold">Uptime</span>
                    <span className="text-zinc-300">{item.uptime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedContainer(item)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-3 py-1 rounded-lg text-xs font-medium transition"
                    >
                      Logs
                    </button>
                    {onRestartContainer && (
                      <button
                        onClick={() => onRestartContainer(item.id)}
                        className="bg-zinc-800 hover:bg-zinc-700 text-blue-300 border border-zinc-700 px-2.5 py-1 rounded-lg text-xs transition"
                        title="Restart Container"
                      >
                        ↺
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logs Drawer / Inspector */}
        {selectedContainer && (
          <div className="p-4 bg-zinc-950 border-t border-zinc-800 font-mono text-xs max-h-48 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-400 font-bold">
                Logs for: {selectedContainer.name} ({selectedContainer.image})
              </span>
              <button
                onClick={() => setSelectedContainer(null)}
                className="text-zinc-400 hover:text-zinc-200 text-xs"
              >
                Close Logs
              </button>
            </div>
            <div className="bg-black/70 p-3 rounded-xl border border-zinc-800 text-zinc-300 text-[11px] space-y-1">
              {(selectedContainer.logs || ['No recent logs recorded. Container healthy.']).map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
