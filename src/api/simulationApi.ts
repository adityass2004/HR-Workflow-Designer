import { 
  type WorkflowGraph, 
  type SimulationResult, 
  type SimulationStepResult,
  NodeType 
} from '@/types';

export async function runSimulation(graph: WorkflowGraph): Promise<SimulationResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const steps: SimulationStepResult[] = [];
      const visited = new Set<string>();
      const queue: string[] = [];

      // Find start nodes: HR Start nodes OR Performance Project nodes
      const startNodes = graph.nodes.filter(n => n.type === NodeType.Start || n.type === NodeType.Project);
      startNodes.forEach(n => {
        queue.push(n.id);
        visited.add(n.id);
      });

      while (queue.length > 0) {
        const nodeId = queue.shift()!;
        const node = graph.nodes.find(n => n.id === nodeId);
        
        if (!node) continue;

        let status: SimulationStepResult['status'] = 'success';
        let message: string | undefined;

        switch (node.type) {
          case NodeType.Start:
          case NodeType.Project:
            status = 'success';
            break;
          case NodeType.Task:
            status = 'pending';
            message = 'Waiting for human input';
            break;
          case NodeType.Approval: {
            const approvalData = node.data as any; // Cast to access specific fields
            status = (approvalData.autoApproveThreshold || 0) > 0 ? 'success' : 'pending';
            if (status === 'pending') message = 'Manual approval required';
            break;
          }
          case NodeType.Automation: {
            const autoData = node.data as any;
            if (autoData.actionId) {
              status = 'success';
            } else {
              status = 'failed';
              message = 'No action configured';
            }
            break;
          }
          case NodeType.End:
          case NodeType.MetricInput:
          case NodeType.NorthStar:
          case NodeType.KPI:
            status = 'success';
            break;
        }

        const data = node.data as any;
        const nodeLabel = data.name || data.title || data.label || node.type;

        steps.push({
          nodeId: node.id,
          nodeLabel,
          status,
          message,
        });

        // Find neighbors via edges
        const outgoingEdges = graph.edges.filter(e => e.source === nodeId);
        for (const edge of outgoingEdges) {
          if (!visited.has(edge.target)) {
            visited.add(edge.target);
            queue.push(edge.target);
          }
        }
      }

      const overallStatus = steps.some(s => s.status === 'failed') ? 'failed' : 'passed';

      resolve({
        workflowId: 'current-simulation',
        steps,
        overallStatus,
      });
    }, 600);
  });
}
