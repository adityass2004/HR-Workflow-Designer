import { type Node, type Edge } from 'reactflow';
import { type AnyNodeData, NodeType } from '@/types';

export interface ValidationError {
  nodeId?: string;
  edgeId?: string;
  type: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export function validateWorkflow(nodes: Node<AnyNodeData>[], edges: Edge[]): ValidationResult {
  const errors: ValidationError[] = [];

  // 1. Check for Start Node
  const hrStarts = nodes.filter((n) => n.data?.type === NodeType.Start);
  if (hrStarts.length === 0) {
    errors.push({ type: 'NO_START_NODE', message: 'No start node exists' });
  } else if (hrStarts.length > 1) {
    errors.push({ type: 'MULTIPLE_START_NODES', message: 'More than one start node' });
  }

  // 2. Check for End Node
  const hrEnds = nodes.filter((n) => n.data?.type === NodeType.End);
  if (hrEnds.length === 0) {
    errors.push({ type: 'NO_END_NODE', message: 'No end node exists' });
  }

  // 3. Connectivity & Unconfigured Checks
  nodes.forEach((node) => {
    // Check if node is configured
    if (!node.data?.configured) {
      errors.push({
        nodeId: node.id,
        type: 'UNCONFIGURED_NODE',
        message: `Node "${node.data?.label || 'Unknown'}" is not configured`,
      });
    }

    // DISCONNECTED_NODE: has no incoming edges (only Start node is allowed to have no incoming)
    if (node.data?.type !== NodeType.Start) {
      const hasIncoming = edges.some((e) => e.target === node.id);
      if (!hasIncoming) {
        const nodeName = (node.data as any).name || (node.data as any).title || node.data?.label || 'Unknown';
        errors.push({
          nodeId: node.id,
          type: 'DISCONNECTED_NODE',
          message: `Node "${nodeName}" has no incoming edges`,
        });
      }
    }

    // DEAD_END_NODE: has no outgoing edges (only End and KPI nodes are allowed to have no outgoing)
    const canBeDeadEnd = node.data?.type === NodeType.End || node.data?.type === NodeType.KPI;
    if (!canBeDeadEnd) {
      const hasOutgoing = edges.some((e) => e.source === node.id);
      if (!hasOutgoing) {
        const nodeName = (node.data as any).name || (node.data as any).title || node.data?.label || 'Unknown';
        errors.push({
          nodeId: node.id,
          type: 'DEAD_END_NODE',
          message: `Node "${nodeName}" has no outgoing edges`,
        });
      }
    }
  });

  // 4. Cycle Detection (DFS with explicit stack)
  const adjacencyList = new Map<string, string[]>();
  nodes.forEach((n) => adjacencyList.set(n.id, []));
  edges.forEach((e) => adjacencyList.get(e.source)?.push(e.target));

  const visited = new Set<string>();
  const recStack = new Set<string>();

  for (const node of nodes) {
    if (visited.has(node.id)) continue;

    const stack: { id: string; edgeIndex: number }[] = [{ id: node.id, edgeIndex: 0 }];
    
    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = adjacencyList.get(current.id) || [];

      if (current.edgeIndex === 0) {
        if (recStack.has(current.id)) {
          errors.push({
            nodeId: current.id,
            type: 'CYCLE_DETECTED',
            message: 'Cycle detected in workflow',
          });
          break; // Stop at first cycle entry for this path
        }
        visited.add(current.id);
        recStack.add(current.id);
      }

      if (current.edgeIndex < neighbors.length) {
        const neighbor = neighbors[current.edgeIndex];
        current.edgeIndex++;
        stack.push({ id: neighbor, edgeIndex: 0 });
      } else {
        recStack.delete(current.id);
        stack.pop();
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
