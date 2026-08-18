import React, { useState } from 'react';

interface MCPAccordionProps {
  id?: string;
}

export const MCPAccordion: React.FC<MCPAccordionProps> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'mcp' | 'docker' | 'telemetry'>('mcp');
  const [copied, setCopied] = useState(false);

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mcpConfig = `{
  "mcpServers": {
    "homelab-monitor": {
      "command": "docker",
      "args": [
        "exec",
        "-i",
        "homelab-guardian",
        "npx",
        "-y",
        "@homelab/mcp-server"
      ],
      "env": {
        "HOMELAB_ENDPOINT": "http://10.0.0.2:3000/api",
        "GPU_METRICS_ENABLED": "true"
      }
    }
  }
}`;

  const dockerSnippet = `services:
  whisperx:
    image: ghcr.io/m-bain/whisperx:latest-cuda
    runtime: nvidia
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_DRIVER_CAPABILITIES=compute,utility
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    ports:
      - "9000:9000"
    restart: unless-stopped`;

  const probeSnippet = `curl -sSL https://get.homelab.local/probe.sh | bash -s -- --hub 10.0.0.2:3000 --token hl_live_894192b0`;

  return (
    <div id={id} className="mt-5 flex flex-col gap-3">
      {/* Accordion Trigger */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-5 py-4 text-left flex items-center justify-between text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 transition select-none"
        >
          <div className="flex items-center gap-2.5">
            <span className={`transition-transform duration-200 text-blue-400 font-bold ${isOpen ? 'rotate-90' : ''}`}>
              ▸
            </span>
            <span className="font-semibold text-zinc-300">
              AI workload · MCP · setup & requirements
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 font-sans">
            {isOpen ? 'Click to collapse' : 'Click to inspect MCP JSON & CUDA config'}
          </span>
        </button>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-5 border-t border-zinc-800 bg-zinc-950/60 text-xs font-mono">
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-3.5 border-b border-zinc-800 pb-3">
              <button
                onClick={() => setActiveTab('mcp')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  activeTab === 'mcp'
                    ? 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                MCP Server Config
              </button>
              <button
                onClick={() => setActiveTab('docker')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  activeTab === 'docker'
                    ? 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Docker GPU Compose
              </button>
              <button
                onClick={() => setActiveTab('telemetry')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  activeTab === 'telemetry'
                    ? 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Probe Install Command
              </button>
            </div>

            {/* Tab content */}
            <div className="relative bg-black/70 border border-zinc-800 rounded-xl p-4 overflow-x-auto">
              <button
                onClick={() =>
                  copySnippet(
                    activeTab === 'mcp'
                      ? mcpConfig
                      : activeTab === 'docker'
                      ? dockerSnippet
                      : probeSnippet
                  )
                }
                className="absolute top-3 right-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] px-2.5 py-1 rounded-lg border border-zinc-700 font-mono transition shadow"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>

              <pre className="text-zinc-300 font-mono text-[11px] leading-relaxed">
                {activeTab === 'mcp' && mcpConfig}
                {activeTab === 'docker' && dockerSnippet}
                {activeTab === 'telemetry' && probeSnippet}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Sub-footer matching screenshot */}
      <div className="text-[11px] font-mono text-zinc-500 leading-relaxed px-2 py-1">
        Self-hosted & open source • single container • no Prometheus/Grafana required • history downsampled on read. GPU services attributed via <code className="text-zinc-400 bg-zinc-900 px-1 py-0.5 rounded border border-zinc-800">/proc/&lt;pid&gt;/cgroup</code> + the Docker API.
        <div className="mt-1 text-zinc-500">
          Ideas welcome — see <span className="text-zinc-400 hover:underline cursor-pointer">CONTRIBUTING.md</span> · issues & PRs always open.
        </div>
      </div>
    </div>
  );
};
