import React from 'react';
import { EventInsight } from '../types';

interface EventFeedCardProps {
  id?: string;
  events: EventInsight[];
  onTriggerAction?: (event: EventInsight) => void;
  onAskAI?: (event: EventInsight) => void;
}

export const EventFeedCard: React.FC<EventFeedCardProps> = ({
  id,
  events,
  onTriggerAction,
  onAskAI,
}) => {
  const activeEvents = events.filter((e) => !e.resolved);

  return (
    <div
      id={id}
      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg backdrop-blur-md relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 blur-[50px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 text-xs">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-zinc-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="font-bold tracking-wider text-zinc-500 uppercase">
            EVENT & INSIGHT FEED
          </span>
        </div>
        <span className="text-zinc-500 font-mono text-[11px] bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-full">
          {activeEvents.length} active
        </span>
      </div>

      {/* Events List */}
      <div className="flex flex-col gap-2.5">
        {events.map((evt) => {
          let iconBg = 'bg-blue-950/50 text-blue-400 border-blue-800/60';
          let borderStyle = 'border-zinc-800/80 bg-zinc-900/40';

          if (evt.type === 'critical') {
            iconBg = 'bg-rose-950/60 text-rose-400 border-rose-800/80';
            borderStyle = 'border-rose-900/40 bg-rose-950/10';
          } else if (evt.type === 'warning') {
            iconBg = 'bg-amber-950/60 text-amber-400 border-amber-800/80';
            borderStyle = 'border-amber-900/40 bg-amber-950/10';
          } else if (evt.type === 'success') {
            iconBg = 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80';
            borderStyle = 'border-zinc-800/80 bg-zinc-900/40';
          }

          return (
            <div
              key={evt.id}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${borderStyle} ${
                evt.resolved ? 'opacity-40 line-through' : 'hover:border-zinc-700'
              }`}
            >
              {/* Type Icon Badge */}
              <div
                className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${iconBg}`}
              >
                {evt.type === 'critical' && (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
                {evt.type === 'warning' && (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )}
                {evt.type === 'info' && (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                )}
                {evt.type === 'success' && (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>

              {/* Title & Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#fafafa] font-sans tracking-tight">
                    {evt.title}
                  </span>
                  {evt.timestamp && (
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {evt.timestamp}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5 leading-relaxed">
                  {evt.description}
                </p>

                {/* Remediation Action / AI Prompt Trigger */}
                {(evt.actionCommand || onAskAI) && !evt.resolved && (
                  <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-zinc-800/50">
                    {onAskAI && (
                      <button
                        onClick={() => onAskAI(evt)}
                        className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-blue-300 border border-zinc-700/60 px-2.5 py-1 rounded-lg font-mono font-semibold flex items-center gap-1 transition"
                      >
                        <span>⚡ Ask AI Guardian</span>
                      </button>
                    )}
                    {evt.actionCommand && onTriggerAction && (
                      <button
                        onClick={() => onTriggerAction(evt)}
                        className="text-[10px] bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/50 px-2.5 py-1 rounded-lg font-mono font-medium flex items-center gap-1 transition"
                      >
                        <span>Fix: {evt.actionLabel || 'Execute'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
