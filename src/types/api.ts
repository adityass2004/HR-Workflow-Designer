export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStepResult {
  nodeId: string;
  nodeLabel: string;
  status: "success" | "pending" | "failed" | "skipped";
  message?: string;
}

export interface SimulationResult {
  workflowId: string;
  steps: SimulationStepResult[];
  overallStatus: "passed" | "failed";
}
