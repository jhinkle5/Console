# The Commander (HomeLab Fleet Monitor & AI Guardian)

A modern, production-grade telemetry console and fleet monitoring dashboard built for multi-node HomeLabs, Linux clusters, and GPU inference rigs. Features real-time host inspection, GPU thermal tracking, container metrics, disk capacity alerts, and an autonomous AI Site Reliability Engineering (SRE) Guardian powered by Gemini.

---

## Features

- **Fleet Topology Monitoring**: Live inspection of mixed OS environments:
  - `hub`: openSUSE Leap 16.1 (56 cores, NVIDIA RTX 4090 24GB, Docker / Ollama / WhisperX / Immich)
  - `server-01`: Ubuntu 26.04 LTS (Security patch tracking & pending package sweeps)
  - `server-02`: Proxmox / Baremetal node (Offline ping/SSH detection, automated WoL diagnostics)
  - `workstation`: Ubuntu 24.04 LTS (16 cores, NVIDIA RTX 3080 10GB, `/data` storage telemetry)
  - `vm-01`: BlackArch Linux (Security audit & penetration testing environment)
- **AI Guardian (LabSentinel SRE)**:
  - Context-aware autonomous assistant powered by Google Gemini (`gemini-3.7-flash` / Gemini API).
  - Evaluates live cluster metrics, generates executable remediation scripts (`bash`, `docker`, `powershell`, `journalctl`), and offers a zero-downtime offline heuristic fallback engine.
- **GPU Thermals & Burn Rate**:
  - Live Wattage, VRAM allocations, clock speeds, and hourly electricity cost calculations.
  - Per-workload attribution (e.g. WhisperX audio batching vs. Ollama inference).
- **Service & Container Matrix**: Quick-action modal inspection for Docker containers, systemd units, network ports, and image sizes.
- **Disks & SMART Diagnostics**: Capacity warnings, SSD wear percentages, and filesystem health across Btrfs, ZFS, and ext4 volumes.
- **Terminal CLI Integration**: First-class support for querying the AI Guardian directly from terminal emulators (e.g. Kitty, WezTerm, Alacritty, GNOME Terminal) via `curl` and JSON REST endpoints.

---

## Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion), Lucide Icons
- **Backend API Server**: Node.js, Express, Vite middleware integration, esbuild
- **AI Intelligence**: `@google/genai` TypeScript SDK (Server-side proxy to protect API keys)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- Gemini API Key (optional — a built-in heuristic SRE fallback engine activates automatically if no key is supplied)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/homelab-commander.git
   cd homelab-commander
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional):
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Development Mode

Start the integrated Express API and Vite dev server:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

### Production Build

Compile both the Vite frontend bundle and the standalone bundled CommonJS backend server:
```bash
npm run build
npm start
```

---

## Terminal Integration (Kitty / Bash / Zsh)

You can interact with the AI Guardian directly from your terminal emulator without keeping the browser window in focus.

Add this function to your `~/.bashrc` or `~/.zshrc`:

```bash
commander() {
  if [ -z "$1" ]; then
    echo "Usage: commander \"<your question or diagnostic request>\""
    return 1
  fi
  
  echo "🛰️ Contacting The Commander AI Guardian..."
  
  local response
  response=$(curl -s -X POST "http://localhost:3000/api/gemini/agent-chat" \
    -H "Content-Type: application/json" \
    -d "{\"message\": \"$*\"}")

  if echo "$response" | jq -e . >/dev/null 2>&1; then
    echo "$response" | jq -r '.reply // .error // .'
  else
    echo "$response"
  fi
}
```

Reload your shell:
```bash
source ~/.bashrc
```

Query the cluster from your terminal:
```bash
commander "Why is server-02 offline and how do I wake it?"
commander "Generate cleanup script for workstation /data at 94%"
commander "Analyze GPU burn rate and power limits for RTX 4090"
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check |
| `POST` | `/api/gemini/agent-chat` | Chat directly with LabSentinel AI Guardian |
| `POST` | `/api/gemini/diagnostics` | Trigger automated cluster health diagnosis sweep |

---

## License

MIT License. Feel free to customize and extend for your own homelab or enterprise infrastructure.
