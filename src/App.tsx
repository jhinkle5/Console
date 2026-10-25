import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { FleetBanner } from './components/FleetBanner';
import { FleetList } from './components/FleetList';
import { LabEngineCard } from './components/LabEngineCard';
import { GpuChart } from './components/GpuChart';
import { BurnRateCard } from './components/BurnRateCard';
import { EventFeedCard } from './components/EventFeedCard';
import { CostBreakdownCard } from './components/CostBreakdownCard';
import { BottomGrid } from './components/BottomGrid';
import { MCPAccordion } from './components/MCPAccordion';
import { AIAgentGuardian } from './components/AIAgentGuardian';
import { ContainersModal } from './components/ContainersModal';
import { ServicesModal } from './components/ServicesModal';
import { HostDetailModal } from './components/HostDetailModal';
import { AIModelsTab } from './components/AIModelsTab';
import { AutonomousAgentsTab } from './components/AutonomousAgentsTab';

import {
  INITIAL_HOSTS,
  INITIAL_CHART_HISTORY,
  INITIAL_EVENTS,
  INITIAL_COST_CONSUMERS,
  INITIAL_DIAGNOSTICS,
  INITIAL_CONTAINERS,
  INITIAL_SERVICES,
  INITIAL_AI_MODELS,
  INITIAL_AUTONOMOUS_AGENTS,
} from './data/initialData';
import { ViewTab, HostNode, EventInsight, AutonomousAgent } from './types';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [isSidebarCompact, setIsSidebarCompact] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

  // Fleet & Host State
  const [hosts, setHosts] = useState<HostNode[]>(INITIAL_HOSTS);
  const [selectedHostId, setSelectedHostId] = useState<string>('hub');
  const [isAttentionFiltered, setIsAttentionFiltered] = useState<boolean>(false);

  // Telemetry & Metrics State
  const [gpuTelemetry, setGpuTelemetry] = useState(INITIAL_CHART_HISTORY);
  const [events, setEvents] = useState<EventInsight[]>(INITIAL_EVENTS);
  const [costConsumers] = useState(INITIAL_COST_CONSUMERS);
  const [containers, setContainers] = useState(INITIAL_CONTAINERS);
  const [services] = useState(INITIAL_SERVICES);
  const [diagnostics] = useState(INITIAL_DIAGNOSTICS);
  const [aiModels] = useState(INITIAL_AI_MODELS);
  const [autonomousAgents, setAutonomousAgents] = useState<AutonomousAgent[]>(INITIAL_AUTONOMOUS_AGENTS);

  // Time filters & Auto refresh
  const [timeRange, setTimeRange] = useState('6h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('18:08:37');

  // Modals & AI Agent Drawer
  const [isAiAgentOpen, setIsAiAgentOpen] = useState(false);
  const [isContainersModalOpen, setIsContainersModalOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [inspectingHost, setInspectingHost] = useState<HostNode | null>(null);

  const selectedHost = hosts.find((h) => h.id === selectedHostId) || hosts[0];

  // Auto-refresh telemetry simulation
  const refreshTelemetry = useCallback(() => {
    const now = new Date();
    setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    // Slight realistic jitter to CPU/watts
    setHosts((prev) =>
      prev.map((h) => {
        if (h.status === 'offline') return h;
        const jitter = (Math.random() - 0.5) * 2;
        return {
          ...h,
          cpuPercent: Math.max(1, Math.min(99, Math.round(h.cpuPercent + jitter))),
        };
      })
    );
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(refreshTelemetry, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshTelemetry]);

  // AI Agent Action Handlers
  const handleRemediateEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, resolved: true } : e))
    );
  };

  const handleRecoverHost = (hostId: string) => {
    setHosts((prev) =>
      prev.map((h) => (h.id === hostId ? { ...h, status: 'online', uptime: '0m' } : h))
    );
    setEvents((prev) =>
      prev.map((e) => (e.title.includes(hostId) ? { ...e, resolved: true } : e))
    );
  };

  const handleSimulateSpike = () => {
    // Inject a GPU spike in chart and host
    setHosts((prev) =>
      prev.map((h) =>
        h.id === 'hub'
          ? { ...h, gpuUtilPercent: 94, gpuTempC: 68, gpuPowerW: 285 }
          : h
      )
    );
    setGpuTelemetry((prev) => [
      ...prev,
      {
        time: '18:10',
        rawTimestamp: 11,
        gpuUtil: 94,
        powerW: 285,
        tempC: 68,
        cpuUtil: 28,
        ramUtil: 36,
        gpu1Util: 18,
        gpu1PowerW: 48,
        gpu1TempC: 41,
      },
    ]);
  };

  const handleUpdateHost = (updatedHost: HostNode) => {
    setHosts((prev) => prev.map((h) => (h.id === updatedHost.id ? updatedHost : h)));
    setInspectingHost(updatedHost);
  };

  const handleAskAIWithEvent = (evt: EventInsight) => {
    setIsAiAgentOpen(true);
  };

  // Filtered hosts if attention pill is active
  const displayedHosts = isAttentionFiltered
    ? hosts.filter(
        (h) =>
          h.status === 'offline' ||
          h.status === 'warning' ||
          (h.updatesPending && h.updatesPending > 0)
      )
    : hosts;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090b] text-[#fafafa] font-sans antialiased select-none relative">
      {/* Left Navigation Sidebar */}
      <Sidebar
        id="main-sidebar"
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'ai-agent') {
            setIsAiAgentOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        failedServicesCount={1}
        isCompact={isSidebarCompact}
        onToggleCompact={() => setIsSidebarCompact(!isSidebarCompact)}
        theme={theme}
        onChangeTheme={setTheme}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Column */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden bg-[#09090b] relative">
        {/* Top Navigation Bar */}
        <TopBar
          id="main-topbar"
          hosts={hosts}
          selectedHostId={selectedHostId}
          onSelectHost={(id) => setSelectedHostId(id)}
          onAddHost={() => setIsAiAgentOpen(true)}
          timeRange={timeRange}
          onChangeTimeRange={setTimeRange}
          autoRefresh={autoRefresh}
          onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
          onManualRefresh={refreshTelemetry}
          lastUpdated={lastUpdated}
          isAiAgentOpen={isAiAgentOpen}
          onToggleAiAgent={() => setIsAiAgentOpen(!isAiAgentOpen)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          mcpStatus="idle"
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar space-y-4">
          {/* If Dedicated Autonomous Agents Swarm tab is chosen in sidebar */}
          {activeTab === 'autonomous-agents' ? (
            <AutonomousAgentsTab
              id="autonomous-agents-view"
              agents={autonomousAgents}
              onUpdateAgents={setAutonomousAgents}
              onOpenGuardianDrawer={() => setIsAiAgentOpen(true)}
            />
          ) : activeTab === 'ai-models' || activeTab === 'experiments' ? (
            <AIModelsTab
              id="ai-models-view"
              models={aiModels}
              gpuHost={hosts.find((h) => h.hasGpu) || hosts[0]}
            />
          ) : (
            <>
              {/* Fleet Status Banner */}
              <FleetBanner
                id="fleet-banner"
                hosts={hosts}
                isAttentionFiltered={isAttentionFiltered}
                onFilterAttention={() => setIsAttentionFiltered(!isAttentionFiltered)}
              />

              {/* Main 3-Column Dashboard Matrix (matches screenshot) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Column 1: FLEET List (Left) */}
                <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4">
                  <FleetList
                    id="fleet-list"
                    hosts={displayedHosts}
                    selectedHostId={selectedHostId}
                    onSelectHost={(id) => setSelectedHostId(id)}
                    onOpenHostDetail={(host) => setInspectingHost(host)}
                    onDiagnoseOfflineHost={(host) => {
                      setInspectingHost(host);
                      setIsAiAgentOpen(true);
                    }}
                  />
                </div>

                {/* Column 2: Engine Radial Gauges + GPU Chart + Burn Rate (Center) */}
                <div className="lg:col-span-8 xl:col-span-5 flex flex-col gap-4">
                  {/* The Lab's Engine Gauges */}
                  <LabEngineCard
                    id="lab-engine-card"
                    selectedHost={selectedHost}
                    fleetHosts={hosts}
                  />

                  {/* GPU Time-Series Chart */}
                  <GpuChart
                    id="gpu-telemetry-chart"
                    data={gpuTelemetry}
                    hostName={selectedHost.name.toUpperCase()}
                  />

                  {/* Burn Rate Card */}
                  <BurnRateCard
                    id="burn-rate-card"
                    hostName={selectedHost.name.toUpperCase()}
                    hourlyRate={0.011}
                    currentWatts={selectedHost.powerWatts || 37}
                    todayCost={0.12}
                    sevenDayCost={1.38}
                    thirtyDayCost={5.17}
                  />
                </div>

                {/* Column 3: Event & Insight Feed + What's Costing You (Right) */}
                <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-4">
                  {/* Event & Insight Feed */}
                  <EventFeedCard
                    id="event-feed-card"
                    events={events}
                    onTriggerAction={(evt) => handleRemediateEvent(evt.id)}
                    onAskAI={handleAskAIWithEvent}
                  />

                  {/* What's Costing You Breakdown */}
                  <CostBreakdownCard
                    id="cost-breakdown-card"
                    consumers={costConsumers}
                    hostName={selectedHost.name.toUpperCase()}
                    totalWeekCost={1.38}
                    onSelectConsumer={(c) => {
                      setIsAiAgentOpen(true);
                    }}
                  />
                </div>
              </div>

              {/* Bottom Grid: Containers, Services, Diagnostics */}
              <BottomGrid
                id="bottom-grid"
                hostName={selectedHost.name.toUpperCase()}
                containers={containers}
                services={services}
                diagnostics={diagnostics}
                onOpenContainers={() => setIsContainersModalOpen(true)}
                onOpenServices={() => setIsServicesModalOpen(true)}
                onOpenDiagnostics={(diag) => {
                  setIsAiAgentOpen(true);
                }}
              />

              {/* MCP Accordion & Requirements */}
              <MCPAccordion id="mcp-accordion" />
            </>
          )}
        </main>
      </div>

      {/* AI Agent Guardian Slide-Over Panel */}
      <AIAgentGuardian
        id="ai-agent-guardian"
        isOpen={isAiAgentOpen}
        onClose={() => setIsAiAgentOpen(false)}
        hosts={hosts}
        events={events}
        onRemediateEvent={handleRemediateEvent}
        onSimulateSpike={handleSimulateSpike}
        onRecoverHost={handleRecoverHost}
      />

      {/* Deep Inspection Modals */}
      <ContainersModal
        id="containers-modal"
        isOpen={isContainersModalOpen}
        onClose={() => setIsContainersModalOpen(false)}
        containers={containers}
        onRestartContainer={(id) => {
          setContainers((prev) =>
            prev.map((c) => (c.id === id ? { ...c, uptime: '10s', cpuPercent: 1.2 } : c))
          );
        }}
      />

      <ServicesModal
        id="services-modal"
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
        services={services}
      />

      <HostDetailModal
        id="host-detail-modal"
        isOpen={inspectingHost !== null}
        onClose={() => setInspectingHost(null)}
        host={inspectingHost}
        onUpdateHost={handleUpdateHost}
        onTriggerAction={(action) => {
          if (action.includes('server-02')) {
            handleRecoverHost('server-02');
          }
        }}
      />
    </div>
  );
}
