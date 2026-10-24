import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Gemini Client utility
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
  res.json({
    status: "ok",
    aiConfigured: hasKey,
    timestamp: new Date().toISOString(),
  });
});

// AI Agent Chat & Triage endpoint
app.post("/api/gemini/agent-chat", async (req, res) => {
  try {
    const { message, hostContext, incidentContext, chatHistory } = req.body;
    const ai = getGeminiClient();

    const generateLocalHeuristicResponse = (query: string) => {
      const lower = (query || "").toLowerCase();

      if (
        lower.includes("server-02") ||
        lower.includes("server 02") ||
        lower.includes("server02") ||
        lower.includes("offfline") ||
        lower.includes("offline") ||
        lower.includes("down") ||
        lower.includes("unreachable")
      ) {
        return `### 🚨 Incident Diagnosis: **server-02 Offline**

**Root Cause:**
\`server-02\` (IP: \`10.0.0.12\`) has failed ICMP echo and SSH port 22 heartbeats for 14 consecutive polling intervals. The host interface is currently non-responsive.

**Recommended Remediation:**
\`\`\`bash
# 1. Probe ARP cache on local subnet
arping -I eth0 -c 4 10.0.0.12

# 2. Dispatch Wake-on-LAN magic packet (Broadcast to MAC)
wakeonlan 00:11:32:45:9a:bc

# 3. Check router DHCP binding and lease status
ssh admin@10.0.0.1 "grep -i 'server-02' /var/log/dhcp.leases"
\`\`\`

**Fallback:**
If WoL does not wake the machine within 60s, access the remote IPMI/BMC power controller or trigger a smart plug cycle.`;
      } else if (
        lower.includes("disk") ||
        lower.includes("workstation") ||
        lower.includes("clean") ||
        lower.includes("storage") ||
        lower.includes("space")
      ) {
        return `### 💾 Storage Alert: **Workstation /data (94.3% Capacity)**

**Root Cause Analysis:**
Ubuntu Workstation \`/data\` NVMe mount has only **5.7%** free headroom remaining. Docker container build cache, dangling image layers, and systemd journal logs are the primary consumers.

**Remediation Commands:**
\`\`\`bash
# 1. Clean Docker system cache, images, and unused volumes
docker system prune -af --volumes

# 2. Vacuum systemd journal logs older than 3 days
sudo journalctl --vacuum-time=3d

# 3. Clean apt cache packages
sudo apt-get clean && sudo apt-get autoremove -y

# 4. Inspect largest directories in /data
sudo du -h --max-depth=1 /data | sort -hr | head -n 10
\`\`\`

**Expected Headroom Reclaimed:** ~34.8 GB`;
      } else if (
        lower.includes("gpu") ||
        lower.includes("burn") ||
        lower.includes("cost") ||
        lower.includes("power") ||
        lower.includes("watt") ||
        lower.includes("whisper")
      ) {
        return `### ⚡ GPU Power & Burn Rate Analysis

**Telemetry Summary (NVIDIA RTX 4090 24GB):**
- **Instant Burn:** $0.011 / hour (37W idle baseline)
- **Top Consumer:** \`whisperx\` audio batch transcription container (76% weekly GPU power)
- **VRAM Utilization:** 844 MB / 24,576 MB (3.4% active allocation)

**Optimization Commands:**
\`\`\`bash
# 1. Enable NVIDIA persistence mode
sudo nvidia-smi -pm 1

# 2. Cap GPU power target during low-demand windows (e.g. 250W)
sudo nvidia-smi -pl 250

# 3. Configure WhisperX container to sleep on idle
docker update --restart=on-failure:3 whisperx
\`\`\`

**Projected Savings:** $3.40 / month with 0% impact on inference latency.`;
      } else {
        return `### 🛡️ LabSentinel AI Guardian Status

**Fleet Health Score:** 92 / 100
- **Nodes Online:** 4 of 5 (1 offline: \`server-02\`)
- **GPU Cluster Status:** Optimal (40°C, 37W baseline power)
- **Active Containers:** 39 / 39 Healthy on \`hub\`
- **Pending Patches:** 3 security updates ready on \`server-01\`

**Suggested Actions:**
1. Send Wake-on-LAN packet to \`server-02\`
2. Run \`docker system prune -f\` to relieve storage on \`workstation\`
3. Review pending security patches for \`server-01\``;
      }
    };

    if (!ai) {
      return res.json({
        reply: generateLocalHeuristicResponse(message || ""),
        source: "local-agent-engine",
      });
    }

    const systemInstruction = `You are "LabSentinel AI", an autonomous HomeLab Guardian and DevOps Site Reliability Engineering agent.
You monitor a multi-node home lab cluster consisting of:
- hub (openSUSE Leap 16.1, 56 cores, NVIDIA RTX 4090 24GB, running IBM watsonx Orchestrate Granite 4.2 [18GB VRAM], DeepSeek-R1, WhisperX, Immich, Docker)
- server-01 (Ubuntu 26.04 LTS, 2 cores, 3 pending package updates)
- server-02 (OFFLINE, SSH connection failed at 10.0.0.12, network or power issue)
- workstation (Ubuntu 24.04 LTS, 16 cores, NVIDIA RTX 3080 10GB, /data mount at 94.3% capacity)
- vm-01 (BlackArch Linux, 2 cores, security audit and penetration testing VM)

Current Context:
${hostContext ? JSON.stringify(hostContext, null, 2) : "All fleet nodes operational except server-02 (offline) and workstation (disk alert)."}
${incidentContext ? `Active Incident Details: ${JSON.stringify(incidentContext, null, 2)}` : ""}

Your communication style is concise, highly technical yet accessible, expert in Linux systemd, Docker, NVIDIA GPU drivers, CUDA, ZFS, networking, Ollama LLM serving, and energy cost optimization.
When diagnosing issues or suggesting fixes, always provide:
1. Clear Root Cause explanation
2. Immediate Remediation Action (with exact copyable bash / powershell / docker commands)
3. Prevention Tip
4. Risk assessment (Low / Medium / High)

Keep your response well-structured in markdown format with clear headings and code blocks.`;

    try {
      // Call Gemini 3.7 Flash
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text || generateLocalHeuristicResponse(message || ""),
        source: "gemini-3.7-flash",
      });
    } catch (genError: any) {
      console.warn("Gemini generation failed, smoothly falling back to local heuristic engine:", genError.message);
      return res.json({
        reply: generateLocalHeuristicResponse(message || ""),
        source: "local-agent-fallback",
      });
    }
  } catch (error: any) {
    console.error("Gemini Agent error:", error);
    res.json({
      reply: `### 🛡️ LabSentinel Incident Triage: **server-02 Offline**

**Status:**
\`server-02\` (10.0.0.12) is unreachable via SSH port 22.

**Remediation Command:**
\`\`\`bash
wakeonlan 00:11:32:45:9a:bc
\`\`\``,
      source: "local-agent-engine",
    });
  }
});

// AI Diagnostic Sweep endpoint
app.post("/api/gemini/diagnostics", async (req, res) => {
  try {
    const { fleetState } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        healthScore: 94,
        statusSummary: "Fleet mostly healthy with 1 offline node and 1 high disk utilization warning.",
        anomalies: [
          {
            id: "anom-1",
            host: "server-02",
            severity: "critical",
            title: "Host Unreachable",
            description: "Connection timed out on port 22. No ICMP reply.",
            remediation: "Check power supply, NIC LED indicator, and router ARP table.",
          },
          {
            id: "anom-2",
            host: "workstation",
            severity: "warning",
            title: "/data Exceeding 90% Threshold",
            description: "Current capacity 94.3% on Ubuntu workstation. Write bottlenecks predicted.",
            remediation: "Execute docker system prune -af --volumes and vacuum journalctl.",
          },
          {
            id: "anom-3",
            host: "server-01",
            severity: "info",
            title: "3 Kernel Security Patches",
            description: "Ubuntu 26.04 LTS repository has 3 updates pending.",
            remediation: "Run apt update && apt upgrade -y during low traffic window.",
          },
        ],
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Analyze this HomeLab fleet telemetry and generate a structured health report:
${JSON.stringify(fleetState, null, 2)}
Return JSON with healthScore (number 0-100), statusSummary (string), and anomalies array (id, host, severity 'critical'|'warning'|'info'|'success', title, description, remediation).`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Diagnostics error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HomeLab Monitor server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
