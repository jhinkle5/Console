import React from 'react';
import { ViewTab } from '../types';

interface SidebarProps {
  id?: string;
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  failedServicesCount?: number;
  isCompact?: boolean;
  onToggleCompact?: () => void;
  theme?: 'dark' | 'light' | 'system';
  onChangeTheme?: (t: 'dark' | 'light' | 'system') => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  id,
  activeTab,
  onSelectTab,
  failedServicesCount = 1,
  isCompact = false,
  onToggleCompact,
  theme = 'dark',
  onChangeTheme,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const monitoringNav = [
    { id: 'overview', label: 'Overview', icon: 'grid' },
    { id: 'gpu', label: 'GPU', icon: 'cpu' },
    { id: 'costs', label: 'Costs', icon: 'dollar' },
    { id: 'containers', label: 'Containers', icon: 'box' },
    { id: 'services', label: 'Services', icon: 'layers', badge: failedServicesCount > 0 ? '1' : undefined },
    { id: 'system', label: 'System', icon: 'activity' },
    { id: 'disks', label: 'Disks', icon: 'hard-drive' },
    { id: 'network', label: 'Network', icon: 'wifi' },
    { id: 'security', label: 'Security', icon: 'shield' },
  ];

  const aiNav = [
    { id: 'autonomous-agents', label: 'Autonomous Agents', icon: 'bot-swarm', badge: '6 Active', highlight: true },
    { id: 'ai-models', label: 'AI Models', icon: 'sparkles' },
    { id: 'ai-agent', label: 'AI Guardian Chat', icon: 'bot' },
    { id: 'experiments', label: 'Experiments', icon: 'flask' },
  ];

  const settingsNav = [
    { id: 'hosts', label: 'Hosts', icon: 'server' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'backup', label: 'Backup', icon: 'archive' },
  ];

  const [executingAction, setExecutingAction] = React.useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = React.useState<string | null>(null);

  const handleTriggerQuickControl = (name: string, description: string, successMsg: string) => {
    setExecutingAction(name);
    setActionFeedback(description);
    setTimeout(() => {
      setExecutingAction(null);
      setActionFeedback(successMsg);
      setTimeout(() => {
        setActionFeedback(null);
      }, 3000);
    }, 1200);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'grid':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        );
      case 'cpu':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" />
            <line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" />
            <line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" />
            <line x1="20" y1="14" x2="23" y2="14" />
            <line x1="1" y1="9" x2="4" y2="9" />
            <line x1="1" y1="14" x2="4" y2="14" />
          </svg>
        );
      case 'dollar':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        );
      case 'box':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        );
      case 'layers':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        );
      case 'activity':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        );
      case 'hard-drive':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="12" x2="2" y2="12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            <line x1="6" y1="16" x2="6.01" y2="16" />
            <line x1="10" y1="16" x2="10.01" y2="16" />
          </svg>
        );
      case 'wifi':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case 'bot-swarm':
        return (
          <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
            <path d="M4 14a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z" />
            <path d="M16 14a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2z" />
            <path d="M12 8v4" />
            <path d="M8 12l-1 2" />
            <path d="M16 12l1 2" />
          </svg>
        );
      case 'bot':
        return (
          <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8.01" y2="16" />
            <line x1="16" y1="16" x2="16.01" y2="16" />
          </svg>
        );
      case 'sparkles':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3l1.912 5.888L20 10.8l-6.088 1.912L12 18.6l-1.912-5.888L4 10.8l6.088-1.912L12 3z" />
          </svg>
        );
      case 'flask':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
            <path d="M8.5 2h7" />
            <path d="M7 16h10" />
          </svg>
        );
      case 'server':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
            <line x1="6" y1="6" x2="6.01" y2="6" />
            <line x1="6" y1="18" x2="6.01" y2="18" />
          </svg>
        );
      case 'settings':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        );
      case 'archive':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="21 8 21 21 3 21 3 8" />
            <rect x="1" y="3" width="22" height="5" />
            <line x1="10" y1="12" x2="14" y2="12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId as ViewTab);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id={id}
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col justify-between bg-[#0e1117] border-r border-zinc-800/80 transition-all duration-300 ${
          isCompact ? 'w-16' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Header & Scrollable Nav */}
        <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar p-3">
          {/* Logo & Version */}
          <div className="flex items-center justify-between px-2 py-2 mb-3">
            <div className="flex items-center gap-2.5">
              {/* Gold/Yellow node icon */}
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-amber-400" />
                </div>
              </div>

              {!isCompact && (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-zinc-100 tracking-tight font-sans">
                    The Commander
                  </span>
                  <span className="bg-zinc-800 text-zinc-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-700/60">
                    v0.17.3
                  </span>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-zinc-400 hover:text-zinc-200 p-1"
            >
              ✕
            </button>
          </div>

          {/* Infrastructure Quick Controls (2x2 Grid) */}
          {!isCompact && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-2.5 mb-4 text-xs font-mono">
              <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-zinc-500 uppercase px-0.5 mb-2">
                <span>QUICK CONTROLS</span>
                {executingAction && (
                  <span className="text-amber-400 flex items-center gap-1 font-normal lowercase text-[9px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    running
                  </span>
                )}
              </div>

              {/* 2x2 Action Grid */}
              <div className="grid grid-cols-2 gap-1.5">
                {/* Button 1: Lock Lab */}
                <button
                  onClick={() =>
                    handleTriggerQuickControl(
                      'lock-lab',
                      'Dropping WAN firewall rules to isolate lab...',
                      '🔒 Lab isolated (WAN traffic dropped)'
                    )
                  }
                  disabled={!!executingAction}
                  title="Drop firewall rule to isolate networks"
                  className={`bg-zinc-950/80 hover:bg-zinc-800 border text-left p-2 rounded-lg transition group flex flex-col justify-between ${
                    executingAction === 'lock-lab'
                      ? 'border-amber-500/80 bg-amber-950/30 text-amber-200'
                      : 'border-zinc-800/80 hover:border-zinc-700 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <span>🔒</span>
                    <span className="truncate">Lock Lab</span>
                  </div>
                  <span className="text-[9px] text-zinc-500 group-hover:text-zinc-400 truncate mt-0.5 font-sans">
                    Isolate networks
                  </span>
                </button>

                {/* Button 2: Cycle Hub */}
                <button
                  onClick={() =>
                    handleTriggerQuickControl(
                      'cycle-hub',
                      'Sending soft reboot signal to primary node...',
                      '🔄 Hub node reboot signal dispatched'
                    )
                  }
                  disabled={!!executingAction}
                  title="Soft reboot the main cluster node"
                  className={`bg-zinc-950/80 hover:bg-zinc-800 border text-left p-2 rounded-lg transition group flex flex-col justify-between ${
                    executingAction === 'cycle-hub'
                      ? 'border-blue-500/80 bg-blue-950/30 text-blue-200'
                      : 'border-zinc-800/80 hover:border-zinc-700 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <span>🔄</span>
                    <span className="truncate">Cycle Hub</span>
                  </div>
                  <span className="text-[9px] text-zinc-500 group-hover:text-zinc-400 truncate mt-0.5 font-sans">
                    Reboot node
                  </span>
                </button>

                {/* Button 3: Trim Disks */}
                <button
                  onClick={() =>
                    handleTriggerQuickControl(
                      'trim-disks',
                      'Executing fstrim macros across SSD mounts...',
                      '🧹 Trim complete (3.8 GB reclaimed)'
                    )
                  }
                  disabled={!!executingAction}
                  title="Trigger storage cleanup macros"
                  className={`bg-zinc-950/80 hover:bg-zinc-800 border text-left p-2 rounded-lg transition group flex flex-col justify-between ${
                    executingAction === 'trim-disks'
                      ? 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200'
                      : 'border-zinc-800/80 hover:border-zinc-700 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <span>🧹</span>
                    <span className="truncate">Trim Disks</span>
                  </div>
                  <span className="text-[9px] text-zinc-500 group-hover:text-zinc-400 truncate mt-0.5 font-sans">
                    Storage cleanup
                  </span>
                </button>

                {/* Button 4: VPN Reset */}
                <button
                  onClick={() =>
                    handleTriggerQuickControl(
                      'vpn-reset',
                      'Flushing tunnels & restarting wg0 interface...',
                      '🌐 WireGuard tunnels recycled'
                    )
                  }
                  disabled={!!executingAction}
                  title="Flush and restart active tunnels"
                  className={`bg-zinc-950/80 hover:bg-zinc-800 border text-left p-2 rounded-lg transition group flex flex-col justify-between ${
                    executingAction === 'vpn-reset'
                      ? 'border-sky-500/80 bg-sky-950/30 text-sky-200'
                      : 'border-zinc-800/80 hover:border-zinc-700 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <span>🌐</span>
                    <span className="truncate">VPN Reset</span>
                  </div>
                  <span className="text-[9px] text-zinc-500 group-hover:text-zinc-400 truncate mt-0.5 font-sans">
                    Flush tunnels
                  </span>
                </button>
              </div>

              {/* Action Live Status / Toast */}
              {actionFeedback && (
                <div className="mt-2 pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-300 font-mono flex items-center gap-1.5 animate-in fade-in">
                  <span className="text-blue-400">›</span>
                  <span className="truncate">{actionFeedback}</span>
                </div>
              )}
            </div>
          )}

          {/* Section: MONITORING */}
          <div className="mb-4">
            {!isCompact && (
              <div className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase px-2 mb-1">
                MONITORING
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {monitoringNav.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition select-none ${
                      isActive
                        ? 'bg-zinc-800/90 text-zinc-100 font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-amber-400' : 'text-zinc-400'}>
                        {renderIcon(item.icon)}
                      </span>
                      {!isCompact && <span>{item.label}</span>}
                    </div>

                    {!isCompact && item.badge && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: AI */}
          <div className="mb-4">
            {!isCompact && (
              <div className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase px-2 mb-1">
                AI
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {aiNav.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition select-none ${
                      isActive
                        ? 'bg-zinc-800/90 text-zinc-100 font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    } ${item.highlight ? 'ring-1 ring-amber-500/30' : ''}`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-amber-400' : 'text-zinc-400'}>
                        {renderIcon(item.icon)}
                      </span>
                      {!isCompact && (
                        <span className={item.highlight ? 'text-amber-300 font-semibold' : ''}>
                          {item.label}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: SETTINGS */}
          <div className="mb-2">
            {!isCompact && (
              <div className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase px-2 mb-1">
                SETTINGS
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {settingsNav.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition select-none ${
                      isActive
                        ? 'bg-zinc-800/90 text-zinc-100 font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-amber-400' : 'text-zinc-400'}>
                        {renderIcon(item.icon)}
                      </span>
                      {!isCompact && <span>{item.label}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer: Theme, Compact, Language */}
        <div className="p-3 border-t border-zinc-800/80 bg-[#0b0e14] text-xs font-mono">
          {!isCompact && (
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 text-zinc-400">
                <span>☾</span>
                <span>Dark</span>
              </div>
              <button
                onClick={onToggleCompact}
                className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 text-[11px]"
              >
                <span>⊞</span>
                <span>Compact</span>
              </button>
            </div>
          )}

          {/* Theme pill selector */}
          <div className="bg-[#141822] p-0.5 rounded-lg border border-zinc-800 flex items-center text-[10px]">
            {(['dark', 'light', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => onChangeTheme?.(t)}
                className={`flex-1 py-0.5 text-center capitalize rounded transition ${
                  theme === t
                    ? 'bg-zinc-800 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};
