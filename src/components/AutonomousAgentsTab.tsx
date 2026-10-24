import React, { useState } from 'react';
import { AutonomousAgent, AutonomyLevel, AgentExecutionLog } from '../types';
import {
  ShieldAlert,
  Lock,
  Cpu,
  Boxes,
  HardDrive,
  Zap,
  Play,
  Pause,
  RefreshCw,
  Plus,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  Filter,
  Eye,
  Check,
  ChevronDown,
  X,
  Radio,
  Sliders,
  Send,
  ArrowRight
} from 'lucide-react';

interface AutonomousAgentsTabProps {
  id?: string;
  agents: AutonomousAgent[];
  onUpdateAgents: (updater: (prev: AutonomousAgent[]) => AutonomousAgent[]) => void;
  onOpenGuardianDrawer?: () => void;
}

export const AutonomousAgentsTab: React.FC<AutonomousAgentsTabProps> = ({
  id,
  agents,
  onUpdateAgents,
  onOpenGuardianDrawer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [runningAgentId, setRunningAgentId] = useState<string | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // New Agent Form State
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('');
  const [newAgentCategory, setNewAgentCategory] = useState<AutonomousAgent['category']>('sre');
  const [newAgentModel, setNewAgentModel] = useState('IBM watsonx Orchestrate Granite 4.2');
  const [newAgentAutonomy, setNewAgentAutonomy] = useState<AutonomyLevel>('full');
  const [newAgentInterval, setNewAgentInterval] = useState(20);
  const [newAgentGoal, setNewAgentGoal] = useState('');

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3200);
  };

  // Render Category Icon
  const renderAgentIcon = (category: AutonomousAgent['category'], className = 'w-5 h-5') => {
    switch (category) {
      case 'sre':
        return <ShieldAlert className={`${className} text-rose-400`} />;
      case 'security':
        return <Lock className={`${className} text-amber-400`} />;
      case 'vram':
        return <Cpu className={`${className} text-cyan-400`} />;
      case 'containers':
        return <Boxes className={`${className} text-emerald-400`} />;
      case 'storage':
        return <HardDrive className={`${className} text-purple-400`} />;
      case 'energy':
        return <Zap className={`${className} text-yellow-400`} />;
      default:
        return <Activity className={`${className} text-blue-400`} />;
    }
  };

  // Filter agents
  const filteredAgents = agents.filter((agent) => {
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    const matchesQuery =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.currentGoal.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Cycle trigger simulation
  const handleRunCycle = (agentId: string) => {
    setRunningAgentId(agentId);
    triggerToast(`Triggered instant autonomous cycle on ${agents.find(a => a.id === agentId)?.name}...`);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      onUpdateAgents((prev) =>
        prev.map((agent) => {
          if (agent.id !== agentId) return agent;
          const newLog: AgentExecutionLog = {
            id: `log-${Date.now()}`,
            timestamp: timeStr,
            level: 'action',
            message: `Manual trigger executed: Verified system constraints via ${agent.tools[0] || 'kernel.probe'}. All invariants green.`,
            toolUsed: agent.tools[0] || 'system.check',
            latencyMs: Math.floor(Math.random() * 45) + 12,
          };
          return {
            ...agent,
            tasksCompleted: agent.tasksCompleted + 1,
            lastCycle: 'Just now',
            recentLogs: [newLog, ...agent.recentLogs.slice(0, 9)],
          };
        })
      );
      setRunningAgentId(null);
    }, 900);
  };

  // Toggle pause/active
  const handleTogglePause = (agentId: string) => {
    onUpdateAgents((prev) =>
      prev.map((agent) => {
        if (agent.id !== agentId) return agent;
        const nextStatus = agent.status === 'paused' ? 'active' : 'paused';
        triggerToast(`${agent.name} is now ${nextStatus.toUpperCase()}`);
        return {
          ...agent,
          status: nextStatus,
        };
      })
    );
  };

  // Change autonomy level
  const handleChangeAutonomy = (agentId: string, level: AutonomyLevel) => {
    onUpdateAgents((prev) =>
      prev.map((agent) => {
        if (agent.id !== agentId) return agent;
        triggerToast(`Updated ${agent.name} autonomy to ${level.toUpperCase()}`);
        return {
          ...agent,
          autonomyLevel: level,
        };
      })
    );
  };

  // Global autonomy policy setter
  const handleSetAllAutonomy = (level: AutonomyLevel) => {
    onUpdateAgents((prev) =>
      prev.map((agent) => ({
        ...agent,
        autonomyLevel: level,
      }))
    );
    triggerToast(`All agents set to ${level.toUpperCase()} policy`);
  };

  // Create new Agent
  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    const newAgent: AutonomousAgent = {
      id: `agent-${Date.now().toString(36)}`,
      name: newAgentName,
      role: newAgentRole || 'Autonomous Fleet Service Worker',
      category: newAgentCategory,
      avatarIcon: 'Activity',
      model: newAgentModel,
      autonomyLevel: newAgentAutonomy,
      status: 'active',
      healthScore: 100,
      intervalSec: Number(newAgentInterval) || 15,
      lastCycle: 'Just spawned',
      nextCycle: `in ${newAgentInterval}s`,
      currentGoal: newAgentGoal || 'Awaiting initial telemetry ingestion cycle',
      tasksCompleted: 1,
      uptime: '0m',
      tools: ['systemctl.status', 'ping.check', 'journalctl.read'],
      metrics: {
        cpuCostPercent: 0.3,
        ramMb: 240,
        successRate: 100.0,
      },
      recentLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          level: 'success',
          message: `Autonomous Agent spawned and registered with Swarm Bus. Subscribed to local event stream.`,
          toolUsed: 'agent.init',
          latencyMs: 14,
        },
      ],
    };

    onUpdateAgents((prev) => [newAgent, ...prev]);
    setIsDeployModalOpen(false);
    triggerToast(`Deployed new agent: "${newAgentName}"`);

    // Reset form
    setNewAgentName('');
    setNewAgentRole('');
    setNewAgentGoal('');
  };

  const totalActions = agents.reduce((acc, a) => acc + a.tasksCompleted, 0);
  const activeCount = agents.filter((a) => a.status !== 'paused').length;

  return (
    <div id={id} className="space-y-5 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18181b] border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-mono animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Swarm Command Header */}
      <div className="bg-[#121214] border border-[#27272a] rounded-xl p-5 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-32 bg-gradient-to-l from-emerald-500/10 via-cyan-500/5 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Radio className="w-4 h-4 animate-pulse" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Autonomous Agent Fleet
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {activeCount} / {agents.length} Active
                </span>
              </h1>
              <span className="text-xs text-[#a1a1aa] bg-[#18181b] px-2.5 py-1 rounded border border-[#27272a]">
                Swarm Bus: <span className="text-emerald-400 font-mono">ONLINE (0ms latency)</span>
              </span>
            </div>
            <p className="text-xs text-[#a1a1aa] mt-1.5 max-w-2xl leading-relaxed">
              Decentralized continuous loops for automated incident remediation, zero-trust perimeter auditing,
              CUDA VRAM dynamic packing, and ZFS replication. Coordinated via{' '}
              <span className="text-cyan-400 font-medium">IBM watsonx Orchestrate Granite 4.2</span> and local models.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {/* Global Autonomy Selector */}
            <div className="flex items-center bg-[#18181b] border border-[#27272a] rounded-lg p-1 text-xs">
              <span className="text-[10px] uppercase font-mono text-[#71717a] px-2">Global Policy:</span>
              <button
                onClick={() => handleSetAllAutonomy('full')}
                className="px-2.5 py-1 rounded text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                title="All agents execute remediation without approval"
              >
                Full Auto
              </button>
              <button
                onClick={() => handleSetAllAutonomy('supervised')}
                className="px-2.5 py-1 rounded text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-colors"
                title="Agents require confirmation before modifying state"
              >
                Supervised
              </button>
              <button
                onClick={() => handleSetAllAutonomy('observer')}
                className="px-2.5 py-1 rounded text-xs font-medium text-blue-400 hover:bg-blue-500/10 transition-colors"
                title="Telemetry observation only, no actions"
              >
                Observer
              </button>
            </div>

            {/* Deploy New Agent Button */}
            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Deploy Agent</span>
            </button>
          </div>
        </div>

        {/* Global Telemetry KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#27272a]/60">
          <div className="bg-[#18181b]/70 border border-[#27272a] rounded-lg p-3">
            <div className="text-[10px] text-[#a1a1aa] uppercase tracking-wider font-mono">Autonomous Cycles</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5 flex items-center gap-1.5">
              {totalActions.toLocaleString()}
              <span className="text-[10px] font-normal text-emerald-400">↑ 14/min</span>
            </div>
          </div>
          <div className="bg-[#18181b]/70 border border-[#27272a] rounded-lg p-3">
            <div className="text-[10px] text-[#a1a1aa] uppercase tracking-wider font-mono">Primary Model</div>
            <div className="text-xs font-bold text-cyan-300 font-mono mt-1 truncate" title="IBM watsonx Orchestrate Granite 4.2">
              Granite 4.2 (18GB)
            </div>
          </div>
          <div className="bg-[#18181b]/70 border border-[#27272a] rounded-lg p-3">
            <div className="text-[10px] text-[#a1a1aa] uppercase tracking-wider font-mono">Decision Latency</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">24.2 ms</div>
          </div>
          <div className="bg-[#18181b]/70 border border-[#27272a] rounded-lg p-3">
            <div className="text-[10px] text-[#a1a1aa] uppercase tracking-wider font-mono">Success Rate</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">99.7%</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#121214] border border-[#27272a] rounded-xl p-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar text-xs">
          {[
            { id: 'all', label: `All Agents (${agents.length})` },
            { id: 'sre', label: 'SRE & Healing' },
            { id: 'security', label: 'Security' },
            { id: 'vram', label: 'GPU & VRAM' },
            { id: 'containers', label: 'Docker' },
            { id: 'storage', label: 'Storage' },
            { id: 'energy', label: 'Energy' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                selectedCategory === cat.id
                  ? 'bg-[#27272a] text-white border border-[#3f3f46]'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agents, goals, tools..."
            className="w-full bg-[#18181b] border border-[#27272a] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => {
          const isRunning = runningAgentId === agent.id;
          const isPaused = agent.status === 'paused';
          const isInspecting = selectedAgentId === agent.id;

          return (
            <div
              key={agent.id}
              className={`bg-[#121214] border rounded-xl p-4.5 flex flex-col justify-between transition-all duration-200 ${
                isPaused
                  ? 'border-[#27272a]/60 opacity-60'
                  : isRunning
                  ? 'border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50'
                  : 'border-[#27272a] hover:border-[#3f3f46]'
              }`}
            >
              <div>
                {/* Agent Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                        isPaused
                          ? 'bg-[#18181b] border-[#27272a]'
                          : 'bg-[#18181b] border-[#27272a] shadow-inner'
                      }`}
                    >
                      {renderAgentIcon(agent.category, 'w-5 h-5')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                        {agent.name}
                        {agent.status === 'active' && !isPaused && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                        {agent.status === 'executing' && !isPaused && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            RUNNING
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-[#a1a1aa] line-clamp-1">{agent.role}</p>
                    </div>
                  </div>

                  {/* Autonomy Badge / Selector */}
                  <div className="shrink-0">
                    <select
                      value={agent.autonomyLevel}
                      onChange={(e) => handleChangeAutonomy(agent.id, e.target.value as AutonomyLevel)}
                      className={`text-[10px] font-mono px-2 py-1 rounded border appearance-none cursor-pointer focus:outline-none transition-colors ${
                        agent.autonomyLevel === 'full'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          : agent.autonomyLevel === 'supervised'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20'
                      }`}
                      title="Change autonomy level for this agent"
                    >
                      <option value="full">AUTO (Autonomous)</option>
                      <option value="supervised">SUPERVISED (Confirm)</option>
                      <option value="observer">OBSERVER (Read-Only)</option>
                    </select>
                  </div>
                </div>

                {/* Model & Cycle Strip */}
                <div className="flex items-center justify-between text-[11px] text-[#a1a1aa] mt-3 py-1.5 px-2.5 bg-[#18181b] rounded-lg border border-[#27272a]/70">
                  <span className="flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="text-white font-mono text-[10px] truncate">{agent.model}</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#71717a] shrink-0">
                    {agent.intervalSec}s loop • {agent.lastCycle}
                  </span>
                </div>

                {/* Current Active Goal */}
                <div className="mt-3">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">Current Objective</div>
                  <div className="text-xs text-white/90 font-mono mt-0.5 bg-[#09090b] p-2 rounded border border-[#27272a] leading-relaxed flex items-start gap-1.5">
                    <span className="text-emerald-400">›</span>
                    <span>{agent.currentGoal}</span>
                  </div>
                </div>

                {/* Allowed Tools */}
                <div className="mt-3">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] mb-1">Tools Allowed</div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {agent.tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#18181b] text-[#a1a1aa] border border-[#27272a]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions & Expand Trace */}
              <div className="mt-4 pt-3 border-t border-[#27272a] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#a1a1aa]">
                  <span>Tasks Run: <strong className="text-white font-mono">{agent.tasksCompleted}</strong></span>
                  <span>Reliability: <strong className="text-emerald-400 font-mono">{agent.metrics.successRate}%</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunCycle(agent.id)}
                    disabled={isRunning || isPaused}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-medium transition-colors disabled:opacity-40"
                    title="Force immediate autonomous evaluation cycle"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRunning ? 'animate-spin text-emerald-400' : ''}`} />
                    <span>{isRunning ? 'Evaluating...' : 'Run Cycle Now'}</span>
                  </button>

                  <button
                    onClick={() => handleTogglePause(agent.id)}
                    className={`p-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      isPaused
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:text-white'
                    }`}
                    title={isPaused ? 'Resume Agent' : 'Pause Agent'}
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setSelectedAgentId(isInspecting ? null : agent.id)}
                    className={`p-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      isInspecting
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                        : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:text-white'
                    }`}
                    title="View execution logs & traces"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Inline Logs Drawer */}
                {isInspecting && (
                  <div className="mt-3 pt-3 border-t border-[#27272a] text-xs space-y-1.5 bg-[#09090b] p-2.5 rounded-lg font-mono">
                    <div className="text-[10px] text-[#71717a] uppercase font-bold flex items-center justify-between">
                      <span>Execution Trace ({agent.recentLogs.length} events)</span>
                      <button
                        onClick={() => setSelectedAgentId(null)}
                        className="text-[#a1a1aa] hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    {agent.recentLogs.map((log) => (
                      <div key={log.id} className="text-[10px] leading-relaxed border-b border-[#27272a]/40 pb-1 last:border-none">
                        <div className="flex items-center gap-1.5 text-[#71717a]">
                          <span>[{log.timestamp}]</span>
                          <span
                            className={
                              log.level === 'action'
                                ? 'text-cyan-400'
                                : log.level === 'warning'
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }
                          >
                            {log.level.toUpperCase()}
                          </span>
                          {log.toolUsed && <span className="text-[#a1a1aa]">({log.toolUsed})</span>}
                          {log.latencyMs && <span className="text-[#52525b]">{log.latencyMs}ms</span>}
                        </div>
                        <p className="text-[#d4d4d8] mt-0.5">{log.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Swarm Inter-Agent Communication Bus Feed */}
      <div className="bg-[#121214] border border-[#27272a] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Live Swarm Inter-Agent Bus (Broadcast Stream)</h2>
          </div>
          <span className="text-[10px] font-mono text-[#71717a]">Channel: swarm://lab.local/events</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          <div className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] flex items-start gap-2.5">
            <span className="text-emerald-400 text-xs mt-0.5">●</span>
            <div>
              <div className="text-[10px] text-[#71717a]">
                18:08:24 • <strong className="text-rose-400">SRE Fleet Sentinel</strong> ➔ <strong className="text-yellow-400">Watt Optimizer</strong>
              </div>
              <div className="text-white text-xs mt-0.5">
                Probing host `server-02` BMC power state. Holding thermal limits temporarily to prevent clock degradation.
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] flex items-start gap-2.5">
            <span className="text-cyan-400 text-xs mt-0.5">●</span>
            <div>
              <div className="text-[10px] text-[#71717a]">
                18:08:12 • <strong className="text-cyan-400">VRAM Arbitrageur</strong> ➔ <strong className="text-purple-400">All Agents</strong>
              </div>
              <div className="text-white text-xs mt-0.5">
                Allocated 18.0 GB VRAM to `IBM watsonx Orchestrate Granite 4.2`. Reserved 3.1 GB for WhisperX. Ollama queues synchronized.
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] flex items-start gap-2.5">
            <span className="text-amber-400 text-xs mt-0.5">●</span>
            <div>
              <div className="text-[10px] text-[#71717a]">
                18:08:00 • <strong className="text-amber-400">Security Sentinel</strong> ➔ <strong className="text-emerald-400">Container Healer</strong>
              </div>
              <div className="text-white text-xs mt-0.5">
                Fail2ban jail banned IP 185.220.101.44 (port 22). No reverse-proxy breach detected. Safe to continue container healthchecks.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Architecture Guide for Adding Agents */}
      <div className="bg-[#121214] border border-[#27272a] rounded-xl p-5 text-xs text-[#a1a1aa] space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          Where & How to Add or Customize Autonomous Agents in the Codebase
        </h3>
        <p className="leading-relaxed">
          The autonomous agent swarm is completely modular. You can define new autonomous agents, change models, add tools, or configure autonomy levels in these files:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-3">
            <div className="font-mono text-cyan-400 font-semibold text-[11px]">1. /src/data/initialData.ts</div>
            <div className="text-[11px] text-[#a1a1aa] mt-1">
              Locate <code className="text-white bg-[#27272a] px-1 rounded">INITIAL_AUTONOMOUS_AGENTS</code> array. Add new agent objects with their role, underlying model (e.g. Granite 4.2), autonomy policy, and allowed CLI tools.
            </div>
          </div>

          <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-3">
            <div className="font-mono text-cyan-400 font-semibold text-[11px]">2. /src/types.ts</div>
            <div className="text-[11px] text-[#a1a1aa] mt-1">
              Look at <code className="text-white bg-[#27272a] px-1 rounded">AutonomousAgent</code> and <code className="text-white bg-[#27272a] px-1 rounded">AutonomyLevel</code> interfaces to add custom metric fields or tool execution contracts.
            </div>
          </div>

          <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-3">
            <div className="font-mono text-cyan-400 font-semibold text-[11px]">3. /src/components/AutonomousAgentsTab.tsx</div>
            <div className="text-[11px] text-[#a1a1aa] mt-1">
              This component renders the grid, handles real-time cycle dispatches, pauses/resumes, and renders the Swarm Bus communication channel.
            </div>
          </div>
        </div>
      </div>

      {/* Deploy Agent Modal */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-[#27272a] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-[#27272a]">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Plus className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-semibold text-white text-sm">Deploy New Autonomous Agent</h3>
                  <p className="text-[11px] text-[#a1a1aa]">Register an autonomous loop with the Fleet Swarm</p>
                </div>
              </div>
              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="text-[#a1a1aa] hover:text-white p-1 rounded-lg hover:bg-[#27272a]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-white mb-1">Agent Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Network Route & BGP Sentinel"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-white placeholder-[#71717a] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white mb-1">Role / Function</label>
                <input
                  type="text"
                  placeholder="e.g. Real-time packet loss diagnosis & dynamic gateway failover"
                  value={newAgentRole}
                  onChange={(e) => setNewAgentRole(e.target.value)}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-white placeholder-[#71717a] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-white mb-1">Category</label>
                  <select
                    value={newAgentCategory}
                    onChange={(e) => setNewAgentCategory(e.target.value as any)}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="sre">SRE & Self-Healing</option>
                    <option value="security">Security & Zero-Trust</option>
                    <option value="vram">GPU & VRAM</option>
                    <option value="containers">Docker Containers</option>
                    <option value="storage">Storage & ZFS</option>
                    <option value="energy">Energy & Power</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-white mb-1">Autonomy Level</label>
                  <select
                    value={newAgentAutonomy}
                    onChange={(e) => setNewAgentAutonomy(e.target.value as AutonomyLevel)}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="full">Full Autonomous (Auto-exec)</option>
                    <option value="supervised">Supervised (Approval needed)</option>
                    <option value="observer">Observer (Read-Only)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-white mb-1">Inference Engine</label>
                  <select
                    value={newAgentModel}
                    onChange={(e) => setNewAgentModel(e.target.value)}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                  >
                    <option value="IBM watsonx Orchestrate Granite 4.2">IBM watsonx Granite 4.2 (18GB)</option>
                    <option value="deepseek-r1:14b-q4_K_M">deepseek-r1:14b (Ollama)</option>
                    <option value="faster-whisper-medium.en">WhisperX Medium</option>
                    <option value="Local-Rule-Based">Local Heuristic Engine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-white mb-1">Cycle Interval (sec)</label>
                  <input
                    type="number"
                    min="5"
                    max="3600"
                    value={newAgentInterval}
                    onChange={(e) => setNewAgentInterval(Number(e.target.value))}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white mb-1">Initial Goal / Mission</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Monitor latency to Cloudflare 1.1.1.1; trigger MTU clamp if jitter exceeds 50ms"
                  value={newAgentGoal}
                  onChange={(e) => setNewAgentGoal(e.target.value)}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-white placeholder-[#71717a] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#27272a]">
                <button
                  type="button"
                  onClick={() => setIsDeployModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                >
                  Deploy to Swarm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
