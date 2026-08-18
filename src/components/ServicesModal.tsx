import React, { useState } from 'react';
import { SystemdService } from '../types';

interface ServicesModalProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  services: SystemdService[];
}

export const ServicesModal: React.FC<ServicesModalProps> = ({
  id,
  isOpen,
  onClose,
  services,
}) => {
  const [filter, setFilter] = useState<'all' | 'failed' | 'active'>('all');

  if (!isOpen) return null;

  const filtered = services.filter((s) => {
    if (filter === 'failed') return s.status === 'failed';
    if (filter === 'active') return s.status === 'active';
    return true;
  });

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
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#fafafa] font-sans">systemd Services Inspector</h3>
                <span className="bg-zinc-800 text-zinc-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-zinc-700">
                  {services.length} Total Units
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono">D-Bus communication: Active on /run/systemd/private</p>
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

        {/* Filter Bar */}
        <div className="p-3.5 border-b border-zinc-800 bg-zinc-950/60 flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg transition font-medium ${
              filter === 'all' ? 'bg-zinc-800 text-[#fafafa] font-bold border border-zinc-700' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Units ({services.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3.5 py-1.5 rounded-lg transition font-medium ${
              filter === 'active' ? 'bg-emerald-950/70 text-emerald-300 font-bold border border-emerald-800/60' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Active (91)
          </button>
          <button
            onClick={() => setFilter('failed')}
            className={`px-3.5 py-1.5 rounded-lg transition font-medium ${
              filter === 'failed' ? 'bg-rose-950/70 text-rose-300 font-bold border border-rose-800/60' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Failed (4 harmless)
          </button>
        </div>

        {/* Services List */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-2.5">
          {filtered.map((s, idx) => {
            const isFailed = s.status === 'failed';
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono transition ${
                  isFailed
                    ? 'bg-amber-950/10 border-amber-900/40 text-amber-200'
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:bg-zinc-900/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isFailed ? 'bg-amber-400' : 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-[#fafafa]">{s.name}</span>
                    <span className="text-[11px] text-zinc-500 block mt-0.5">{s.description}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isFailed ? (
                    <div className="text-right">
                      <span className="bg-amber-950 text-amber-300 px-2 py-0.5 rounded-md text-[10px] font-bold border border-amber-800/50">
                        FAILED (Harmless)
                      </span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5 max-w-xs truncate">
                        {s.failReason}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-[11px] text-zinc-400">
                      <span>PID: {s.pid}</span>
                      <span>•</span>
                      <span>Memory: {s.memoryMb} MB</span>
                      <span className="bg-emerald-950/60 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-800/40">
                        active ({s.subState})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
