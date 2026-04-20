import { type Node, type Edge } from 'reactflow';
import { type AnyNodeData, type WorkflowGraph, type WorkflowEdge } from '@/types';

export function serializeWorkflow(nodes: Node<AnyNodeData>[], edges: Edge[]): WorkflowGraph {
  const cleanNodes = nodes.map((node) => ({
    id: node.id,
    type: node.type as any,
    data: { ...node.data },
    position: node.position,
  }));

  const cleanEdges: WorkflowEdge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label as string,
    type: edge.type,
    animated: edge.animated,
  }));

  return {
    nodes: cleanNodes,
    edges: cleanEdges,
    version: "1.0",
    createdAt: new Date().toISOString(),
  };
}

export function deserializeWorkflow(graph: WorkflowGraph): { nodes: Node<AnyNodeData>[], edges: Edge[] } {
  const nodes: Node<AnyNodeData>[] = graph.nodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: n.data,
  }));

  const edges: Edge[] = graph.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: edge.type,
    animated: edge.animated,
  }));

  return { nodes, edges };
}
