import React, { useState } from 'react';
import { RadialGauge } from './RadialGauge';
import { HostNode } from '../types';

interface LabEngineCardProps {
  id?: string;
  selectedHost: HostNode;
  fleetHosts: HostNode[];
}

export const LabEngineCard: React.FC<LabEngineCardProps> = ({
  id,
  selectedHost,
  fleetHosts,
}) => {
  const [scope, setScope] = useState<'this-host' | 'whole-fleet'>('this-host');

  // Compute metrics depending on scope
  const isFleet = scope === 'whole-fleet';

  const gpuVal = isFleet
    ? Math.round(
        fleetHosts
          .filter((h) => h.hasGpu)
          .reduce((acc, h) => acc + (h.gpuUtilPercent || 0), 0) /
          Math.max(1, fleetHosts.filter((h) => h.hasGpu).length)
      )
    : selectedHost.gpuUtilPercent ?? 0;

  const gpuSubtext = isFleet
    ? `${fleetHosts.filter((h) => h.hasGpu).length} GPUs Active · Cluster avg`
    : selectedHost.hasGpu
    ? `${selectedHost.gpuVramUsedMb || 844} MB / ${(
        (selectedHost.gpuVramTotalMb || 24576) / 1024
      ).toFixed(1)} GB • ${selectedHost.gpuTempC || 40}°C`
    : 'No discrete GPU detected';

  const cpuVal = isFleet
    ? Math.round(
        fleetHosts.filter((h) => h.status !== 'offline').reduce((acc, h) => acc + h.cpuPercent, 0) /
          Math.max(1, fleetHosts.filter((h) => h.status !== 'offline').length)
      )
    : selectedHost.cpuPercent;

  const totalFleetCores = fleetHosts.reduce((acc, h) => acc + h.cores, 0);
  const cpuSubtext = isFleet
    ? `${totalFleetCores} cores across ${fleetHosts.length} nodes`
    : `${selectedHost.cores} cores • load ${(selectedHost.loadAvg || 2.39).toFixed(2)}`;

  const totalFleetRamUsed = fleetHosts.reduce((acc, h) => acc + (h.ramUsedGb || 0), 0);
  const totalFleetRam = fleetHosts.reduce((acc, h) => acc + (h.ramTotalGb || 0), 0);

  const ramVal = isFleet
    ? Math.round((totalFleetRamUsed / Math.max(1, totalFleetRam)) * 100)
    : selectedHost.ramPercent;

  const ramSubtext = isFleet
    ? `${totalFleetRamUsed.toFixed(1)} GB / ${totalFleetRam.toFixed(1)} GB`
    : `${(selectedHost.ramUsedGb || 42.5).toFixed(1)} GB / ${(
        selectedHost.ramTotalGb || 125.8
      ).toFixed(1)} GB`;

  return (
    <div
      id={id}
      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg backdrop-blur-md relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs">
          <svg
            className="w-4 h-4 text-zinc-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="font-bold tracking-wider text-zinc-500 uppercase">THE LAB'S ENGINE</span>
          <span className="text-zinc-600">›</span>
          <span className="text-zinc-400 font-mono text-[11px]">
            SHOWING{' '}
            <span className="bg-zinc-800 text-blue-400 px-1.5 py-0.5 rounded-md uppercase font-bold text-[10px] border border-zinc-700/60">
              {selectedHost.id}
            </span>{' '}
            <span className="text-zinc-200 font-sans font-medium">{selectedHost.name}</span>
          </span>
        </div>

        {/* Toggle Pill */}
        <div className="bg-zinc-900/80 p-0.5 rounded-xl flex items-center border border-zinc-800 text-[11px] font-mono">
          <button
            onClick={() => setScope('this-host')}
            className={`px-3 py-1 rounded-lg transition-all ${
              scope === 'this-host'
                ? 'bg-zinc-800 text-[#fafafa] font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            This host
          </button>
          <button
            onClick={() => setScope('whole-fleet')}
            className={`px-3 py-1 rounded-lg transition-all ${
              scope === 'whole-fleet'
                ? 'bg-zinc-800 text-[#fafafa] font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Whole fleet
          </button>
        </div>
      </div>

      {/* 3 Radial Gauges */}
      <div className="grid grid-cols-3 gap-2 items-center divide-x divide-zinc-800/80 pt-2">
        <RadialGauge
          id="gauge-gpu"
          value={gpuVal}
          title="GPU"
          subtext={gpuSubtext}
          color="#f59e0b"
          trackColor="#27272a"
        />
        <RadialGauge
          id="gauge-cpu"
          value={cpuVal}
          title="CPU"
          subtext={cpuSubtext}
          color="#38bdf8"
          trackColor="#27272a"
        />
        <RadialGauge
          id="gauge-ram"
          value={ramVal}
          title="RAM"
          subtext={ramSubtext}
          color="#10b981"
          trackColor="#27272a"
        />
      </div>
    </div>
  );
};
