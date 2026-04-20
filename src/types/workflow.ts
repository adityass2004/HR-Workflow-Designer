export enum NodeType {
  Start = "start",
  Task = "task",
  Approval = "approval",
  Automation = "automation",
  End = "end",
  // Performance Map Node Types
  Project = "project",
  MetricInput = "metricInput",
  NorthStar = "northStar",
  KPI = "kpi",
}

export interface BaseNodeData {
  id: string;
  type: NodeType;
  label: string;
  configured: boolean;
  hasError?: boolean;
}

// Existing HR Workflow Node Data
export interface StartNodeData extends BaseNodeData {
  title: string;
  metadata: { key: string; value: string }[];
}

export interface TaskNodeData extends BaseNodeData {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: { key: string; value: string }[];
}

export interface ApprovalNodeData extends BaseNodeData {
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomationNodeData extends BaseNodeData {
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  title: string;
  endMessage: string;
  summaryEnabled: boolean;
}

// Performance Map Node Data
export interface MetricPeriod {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface ProjectNodeData extends BaseNodeData {
  name: string;
  platform: string; // e.g., Asana, Jira
  typeLabel: string; // e.g., Project, Epic
  issueCount: number;
  progress: number;
  status?: string;
  statusColor?: string;
}

export interface MetricNodeData extends BaseNodeData {
  name: string;
  aggregation: string;
  periods: MetricPeriod[];
  goal?: {
    text: string;
    progress: number;
  };
}

export type AnyNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomationNodeData
  | EndNodeData
  | ProjectNodeData
  | MetricNodeData;

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  animated?: boolean;
}

export interface WorkflowGraph {
  nodes: { id: string; type: NodeType; data: AnyNodeData; position: { x: number; y: number } }[];
  edges: WorkflowEdge[];
  version: string;
  createdAt: string;
}
