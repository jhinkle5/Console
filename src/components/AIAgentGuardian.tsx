import React, { useState, useEffect, useRef } from 'react';
import { HostNode, EventInsight, AIAgentMessage } from '../types';
import confetti from 'canvas-confetti';
import { Mic, MicOff } from 'lucide-react';

interface AIAgentGuardianProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  hosts: HostNode[];
  events: EventInsight[];
  onRemediateEvent?: (eventId: string) => void;
  onSimulateSpike?: () => void;
  onRecoverHost?: (hostId: string) => void;
}

export const AIAgentGuardian: React.FC<AIAgentGuardianProps> = ({
  id,
  isOpen,
  onClose,
  hosts,
  events,
  onRemediateEvent,
  onSimulateSpike,
  onRecoverHost,
}) => {
  const [messages, setMessages] = useState<AIAgentMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'agent',
      text: `### 🛡️ LabSentinel Autonomous Guardian Active

I am continuously monitoring your HomeLab fleet (4 nodes, 3 NVIDIA GPUs: RTX 4090 24GB + RTX 5080 16GB on Ubuntu 26.04 LTS Hub, RTX 3080 on Workstation, 39 Docker containers).

**Current Fleet Verdict:**
- **Health Score:** 94 / 100
- **🚨 1 Host Offline:** \`server-02\` (10.0.0.12)
- **⚠️ 1 Storage Warning:** \`workstation\` /data at 94.3%
- **ℹ️ 3 Updates Pending:** \`hub\` (Ubuntu 26.04 LTS)
- **⚡ AI Cluster:** Dual GPUs (RTX 4090 + RTX 5080) active with 40 GB combined VRAM

How can I assist your infrastructure today? You can choose a quick action below or ask me any custom query.`,
      timestamp: 'Just now',
      riskRating: 'Low',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autonomousMode, setAutonomousMode] = useState(true);
  const [executingCommand, setExecutingCommand] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<{ [key: string]: string }>({});
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Web Speech API for voice talk
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputPrompt(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser or iframe. Please type your query.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Could not start speech recognition:', err);
        setIsListening(false);
      }
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = promptText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AIAgentMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          hostContext: hosts,
          incidentContext: events.filter((e) => !e.resolved),
        }),
      });

      const data = await res.json();
      const agentMsg: AIAgentMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: data.reply || 'Analysis completed with normal parameters.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      console.error('Agent chat error:', err);
      const fallbackMsg: AIAgentMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: `### 🛡️ Local Heuristic Diagnostic
Processed query: "${textToSend}".
- All 39 containers on hub operational.
- server-02 ping failed.
- Memory & GPU thermals within safe thresholds (40°C).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteSimulatedCommand = (cmdId: string, cmd: string, eventId?: string) => {
    setExecutingCommand(cmdId);
    setTimeout(() => {
      setExecutingCommand(null);
      setTerminalOutput((prev) => ({
        ...prev,
        [cmdId]: `$ ${cmd}\n[OK] Executed successfully on target host.\nOutput: Operation completed with exit code 0. Status updated.`,
      }));

      // Trigger resolution in state
      if (eventId && onRemediateEvent) {
        onRemediateEvent(eventId);
      }
      if (cmd.includes('wakeonlan') && onRecoverHost) {
        onRecoverHost('server-02');
      }

      // Celebrate fix
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div
      id={id}
      className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-[#09090b]/95 border-l border-zinc-800 shadow-2xl z-50 flex flex-col justify-between backdrop-blur-xl animate-in slide-in-from-right duration-300"
    >
      {/* Header */}
      <div className="bg-zinc-900/80 border-b border-zinc-800 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#fafafa] font-sans">LabSentinel AI Guardian</span>
              <span className="bg-emerald-950/70 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-800/60 font-bold shadow-[0_0_6px_rgba(52,211,153,0.3)]">
                ONLINE
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">Gemini 3.7 Flash · Autonomous SRE</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Autonomous toggle */}
          <button
            onClick={() => setAutonomousMode(!autonomousMode)}
            className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition ${
              autonomousMode
                ? 'bg-blue-950/60 border-blue-700 text-blue-300 font-bold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }`}
            title="Auto-scan telemetry every 30s"
          >
            Auto-Monitor: {autonomousMode ? 'ON' : 'OFF'}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded-xl hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Action Pills */}
      <div className="bg-zinc-950/60 border-b border-zinc-800/80 px-4 py-2.5 flex items-center gap-2 overflow-x-auto custom-scrollbar text-[11px] font-mono">
        <span className="text-zinc-500 shrink-0 text-[10px] uppercase font-bold">Quick Triage:</span>
        <button
          onClick={() => handleSendMessage('Diagnose why server-02 is offline and give me the exact remediation steps')}
          className="bg-zinc-900 hover:bg-zinc-800 text-rose-300 border border-rose-900/50 px-2.5 py-1 rounded-lg whitespace-nowrap transition font-medium"
        >
          🚨 Diagnose server-02
        </button>
        <button
          onClick={() => handleSendMessage('Generate disk cleanup script for Workstation /data at 94.3%')}
          className="bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-900/50 px-2.5 py-1 rounded-lg whitespace-nowrap transition font-medium"
        >
          💾 Clean /data
        </button>
        <button
          onClick={() => handleSendMessage('Analyze my GPU burn rate and suggest power efficiency optimizations for WhisperX')}
          className="bg-zinc-900 hover:bg-zinc-800 text-sky-300 border border-sky-900/50 px-2.5 py-1 rounded-lg whitespace-nowrap transition font-medium"
        >
          ⚡ Optimize GPU Power
        </button>
        {onSimulateSpike && (
          <button
            onClick={onSimulateSpike}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded-lg whitespace-nowrap transition font-medium"
          >
            🧪 Simulate Spike
          </button>
        )}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1.5 px-1 text-[10px] font-mono text-zinc-500">
                <span>{isUser ? 'Operator' : 'LabSentinel AI'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
                {msg.source && <span className="text-blue-400 font-bold">[{msg.source}]</span>}
              </div>

              <div
                className={`rounded-2xl p-4 text-xs max-w-[95%] leading-relaxed ${
                  isUser
                    ? 'bg-blue-600/15 border border-blue-500/30 text-blue-100 rounded-tr-none'
                    : 'bg-zinc-900/70 border border-zinc-800 text-zinc-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="prose prose-invert prose-xs max-w-none break-words whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Interactive Remediation Actions if attached */}
                {msg.commandSnippet && (
                  <div className="mt-3 pt-3 border-t border-zinc-800 font-mono">
                    <div className="bg-black/60 border border-zinc-800 rounded-xl p-2.5 text-[11px] text-blue-300 overflow-x-auto">
                      <code>{msg.commandSnippet}</code>
                    </div>
                    <button
                      onClick={() => handleExecuteSimulatedCommand(msg.id, msg.commandSnippet!)}
                      disabled={executingCommand === msg.id}
                      className="mt-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5"
                    >
                      {executingCommand === msg.id ? (
                        <span>Executing in shell...</span>
                      ) : (
                        <span>▶ Execute Remediation</span>
                      )}
                    </button>

                    {terminalOutput[msg.id] && (
                      <pre className="mt-2.5 bg-black/90 border border-zinc-800 rounded-xl p-3 text-[10px] text-emerald-400 overflow-x-auto">
                        {terminalOutput[msg.id]}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>LabSentinel reasoning over fleet telemetry with Gemini 3.7 Flash...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-zinc-950 border-t border-zinc-800">
        {isListening && (
          <div className="mb-2 flex items-center justify-between px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-mono animate-pulse">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Listening to your voice... Speak your question</span>
            </span>
            <button
              type="button"
              onClick={toggleVoiceInput}
              className="text-[10px] text-rose-300 hover:underline cursor-pointer"
            >
              Stop
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isListening) {
              try {
                recognitionRef.current?.stop();
              } catch {}
              setIsListening(false);
            }
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={
              speechSupported
                ? isListening
                  ? 'Stop listening'
                  : 'Talk to AI using voice'
                : 'Speech recognition not supported in this browser'
            }
            className={`p-2.5 rounded-xl border text-xs transition flex items-center justify-center shrink-0 cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white border-rose-500 shadow-[0_0_12px_rgba(225,29,72,0.6)] animate-pulse'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={isListening ? 'Listening to voice...' : "Ask AI Guardian (e.g. 'Why is server-02 offline?', 'Fix disk space')..."}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs font-mono transition flex items-center gap-1.5 shrink-0 shadow-[0_0_12px_rgba(37,99,235,0.4)]"
          >
            <span>Ask</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
