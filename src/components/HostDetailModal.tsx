import React, { useState, useEffect } from 'react';
import { HostNode } from '../types';

interface HostDetailModalProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  host: HostNode | null;
  onTriggerAction?: (action: string) => void;
  onUpdateHost?: (updatedHost: HostNode) => void;
}

export const HostDetailModal: React.FC<HostDetailModalProps> = ({
  id,
  isOpen,
  onClose,
  host,
  onTriggerAction,
  onUpdateHost,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editIp, setEditIp] = useState('');
  const [editOs, setEditOs] = useState('');
  const [editStatus, setEditStatus] = useState<'online' | 'offline' | 'warning' | 'degraded'>('online');
  const [editCores, setEditCores] = useState(4);
  const [editHasGpu, setEditHasGpu] = useState(false);
  const [editGpuName, setEditGpuName] = useState('');

  useEffect(() => {
    if (host) {
      setEditName(host.name);
      setEditIp(host.ip);
      setEditOs(host.os);
      setEditStatus(host.status);
      setEditCores(host.cores);
      setEditHasGpu(host.hasGpu);
      setEditGpuName(host.gpuName || '');
      setIsEditing(false);
    }
  }, [host]);

  if (!isOpen || !host) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const updated: HostNode = {
      ...host,
      name: editName.trim(),
      ip: editIp.trim() || host.ip,
      os: editOs.trim() || host.os,
      status: editStatus,
      cores: editCores,
      hasGpu: editHasGpu,
      gpuName: editGpuName.trim() || host.gpuName,
    };

    onUpdateHost?.(updated);
    setIsEditing(false);
  };

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
                {host.id.startsWith('vm-') && (
                  <span className="bg-purple-950/70 text-purple-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-purple-800/60">
                    VM
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">{host.os}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`text-xs px-3 py-1.5 rounded-xl border font-mono transition flex items-center gap-1.5 ${
                isEditing
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/50'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-white'
              }`}
              title="Edit host name, IP, or OS"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>{isEditing ? 'Cancel Edit' : 'Edit Node / VM'}</span>
            </button>

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
        </div>

        {/* Content Body */}
        {isEditing ? (
          <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-sm font-bold text-zinc-200">Configure Fleet Node / VM</span>
                <span className="text-[10px] text-zinc-500 font-mono">ID: {host.id}</span>
              </div>

              <div>
                <label className="block text-zinc-400 text-[11px] mb-1 font-semibold uppercase">
                  Node / VM Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-blue-500 transition"
                  placeholder="e.g. server-01, proxmox-vm-01"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 text-[11px] mb-1 font-semibold uppercase">
                    IP Address
                  </label>
                  <input
                    type="text"
                    value={editIp}
                    onChange={(e) => setEditIp(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-blue-500 transition"
                    placeholder="10.0.0.15"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-[11px] mb-1 font-semibold uppercase">
                    Operating System / Distro
                  </label>
                  <input
                    type="text"
                    value={editOs}
                    onChange={(e) => setEditOs(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-blue-500 transition"
                    placeholder="e.g. Debian 12 Bookworm, Alpine 3.20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 text-[11px] mb-1 font-semibold uppercase">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-xs focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="warning">Warning</option>
                    <option value="degraded">Degraded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 text-[11px] mb-1 font-semibold uppercase">
                    CPU Cores
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={128}
                    value={editCores}
                    onChange={(e) => setEditCores(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-xs focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-300">
                    <input
                      type="checkbox"
                      checked={editHasGpu}
                      onChange={(e) => setEditHasGpu(e.target.checked)}
                      className="rounded border-zinc-700 text-blue-500 focus:ring-0"
                    />
                    <span className="text-xs">GPU Equipped</span>
                  </label>
                </div>
              </div>

              {editHasGpu && (
                <div>
                  <label className="block text-zinc-400 text-[11px] mb-1 font-semibold uppercase">
                    GPU Model / Name
                  </label>
                  <input
                    type="text"
                    value={editGpuName}
                    onChange={(e) => setEditGpuName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-blue-500 transition"
                    placeholder="e.g. NVIDIA RTX 4090 24GB + RTX 5080 16GB"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-900/40"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
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

            {/* GPU Details: Multiple GPUs or Single GPU */}
            {host.hasGpu && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-blue-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    NVIDIA GPU Telemetry ({host.gpus?.length || 1} Device{host.gpus && host.gpus.length > 1 ? 's' : ''})
                  </span>
                  <span className="text-zinc-400 text-[11px]">
                    Total VRAM: {((host.gpuVramTotalMb || 24576) / 1024).toFixed(0)} GB
                  </span>
                </div>

                {host.gpus && host.gpus.length > 0 ? (
                  host.gpus.map((gpu, idx) => (
                    <div
                      key={gpu.id || idx}
                      className="bg-zinc-900/50 p-4 rounded-2xl border border-blue-900/40 space-y-2.5 backdrop-blur-md"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                              idx === 0
                                ? 'bg-blue-950/70 text-blue-400 border-blue-800/60'
                                : 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60'
                            }`}
                          >
                            GPU {idx}
                          </span>
                          <span className="text-zinc-200 font-semibold">{gpu.name}</span>
                          {gpu.name.includes('5080') && (
                            <span className="bg-emerald-400/20 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                              New Gen
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-mono">
                          {gpu.pcieSlot && <span>{gpu.pcieSlot}</span>}
                          {gpu.driverVersion && <span>{gpu.driverVersion}</span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1 text-zinc-300 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                        <div>
                          <span className="text-zinc-500 block text-[9px] font-bold">VRAM ALLOCATION</span>
                          <span className="text-zinc-200 font-bold">
                            {(gpu.vramUsedMb / 1024).toFixed(1)} / {(gpu.vramTotalMb / 1024).toFixed(1)} GB
                          </span>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">
                            {Math.round((gpu.vramUsedMb / gpu.vramTotalMb) * 100)}% utilized
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[9px] font-bold">THERMALS</span>
                          <span className="text-zinc-200 font-bold">{gpu.tempC}°C</span>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">
                            {gpu.clockMhz ? `${gpu.clockMhz} MHz` : 'Normal'}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[9px] font-bold">POWER & UTIL</span>
                          <span className="text-zinc-200 font-bold">{gpu.powerW} W</span>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">
                            {gpu.utilPercent}% core load
                          </span>
                        </div>
                      </div>

                      {gpu.activeWorkload && (
                        <div className="text-[10px] font-mono text-zinc-400 bg-zinc-950/40 px-2.5 py-1 rounded-lg border border-zinc-800/50 flex items-center justify-between">
                          <span className="text-zinc-500">Active Workload:</span>
                          <span className="text-zinc-300 font-medium">{gpu.activeWorkload}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-zinc-900/50 p-4 rounded-2xl border border-blue-900/40 space-y-2.5 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-bold uppercase tracking-wider text-[11px]">
                        NVIDIA GPU Telemetry
                      </span>
                      <span className="text-zinc-300 font-medium">{host.gpuName || 'GeForce RTX 4090'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 text-zinc-300 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                      <div>
                        <span className="text-zinc-500 block text-[9px] font-bold">VRAM USAGE</span>
                        <span className="text-zinc-200">
                          {host.gpuVramUsedMb || 844} MB / {host.gpuVramTotalMb || 24576} MB
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[9px] font-bold">TEMPERATURE</span>
                        <span className="text-zinc-200">{host.gpuTempC || 40}°C</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[9px] font-bold">POWER BURN</span>
                        <span className="text-zinc-200">{host.gpuPowerW || 37} W</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
