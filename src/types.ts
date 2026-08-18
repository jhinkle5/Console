export type HostId = 'hub' | 'server-01' | 'server-02' | 'workstation' | 'vm-01' | string;

export type ViewTab = 
  | 'overview'
  | 'gpu'
  | 'costs'
  | 'containers'
  | 'services'
  | 'system'
  | 'disks'
  | 'network'
  | 'security'
  | 'ai-models'
  | 'experiments'
  | 'ai-agent'
  | 'hosts'
  | 'settings'
  | 'backup';

export interface HostNode {
  id: string;
  name: string;
  isHub: boolean;
  status: 'online' | 'offline' | 'warning' | 'degraded';
  hasGpu: boolean;
  os: string;
  osIcon?: string;
  cpuPercent: number;
  ramPercent: number;
  diskPercent: number;
  cores: number;
  tempC?: number;
  uptime: string;
  ip: string;
  errorMessage?: string;
  updatesPending?: number;
  diskAlertBadge?: string;
  loadAvg?: number;
  ramUsedGb?: number;
  ramTotalGb?: number;
  diskUsedGb?: number;
  diskTotalGb?: number;
  gpuName?: string;
  gpuVramUsedMb?: number;
  gpuVramTotalMb?: number;
  gpuTempC?: number;
  gpuPowerW?: number;
  gpuUtilPercent?: number;
}

export interface MetricTimeSeriesPoint {
  time: string;
  rawTimestamp: number;
  gpuUtil: number;
  powerW: number;
  tempC: number;
  cpuUtil: number;
  ramUtil: number;
}

export interface EventInsight {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  timestamp?: string;
  hostId?: string;
  resolved?: boolean;
  actionCommand?: string;
  actionLabel?: string;
}

export interface CostConsumer {
  id: string;
  name: string;
  isGpu: boolean;
  costDollar: number;
  percentage: number;
  avgWatts: number;
  kwh: number;
  category?: 'ai' | 'media' | 'system' | 'browser';
}

export interface ContainerItem {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'exited' | 'restarting' | 'paused';
  health: 'healthy' | 'unhealthy' | 'starting';
  cpuPercent: number;
  memoryMb: number;
  memoryLimitMb: number;
  gpuAssigned?: boolean;
  uptime: string;
  restarts: number;
  ports?: string[];
  logs?: string[];
}

export interface SystemdService {
  name: string;
  description: string;
  status: 'active' | 'failed' | 'inactive' | 'activating';
  subState: string;
  pid?: number;
  memoryMb?: number;
  failReason?: string;
  isHarmless?: boolean;
}

export interface DiagnosticItem {
  id: string;
  name: string;
  status: 'green' | 'amber' | 'red';
  detail: string;
  subdetail?: string;
  checkedAt?: string;
}

export interface AIAgentMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  commandSnippet?: string;
  actionExecuted?: boolean;
  riskRating?: 'Low' | 'Medium' | 'High';
  source?: string;
}

export interface DiskMount {
  device: string;
  mountPoint: string;
  filesystem: string;
  sizeGb: number;
  usedGb: number;
  freeGb: number;
  percent: number;
  smartStatus: 'PASSED' | 'WARNING' | 'FAILED';
  wearPercent?: number;
}

export interface AIModelInstance {
  id: string;
  name: string;
  engine: 'Ollama' | 'vLLM' | 'WhisperX' | 'Immich-ML' | 'LocalAI';
  parameters: string;
  vramUsedMb: number;
  quantization: string;
  contextLength: number;
  tokensPerSec: number;
  status: 'loaded' | 'idle' | 'offloaded';
  requests24h: number;
}
