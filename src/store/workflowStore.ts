import { create } from 'zustand';
import { 
  addEdge as addReactFlowEdge, 
  applyNodeChanges, 
  applyEdgeChanges, 
  type Node, 
  type Edge, 
  type Connection,
  type NodeChange,
  type EdgeChange
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { NodeType, type AnyNodeData, type SimulationResult, type MetricNodeData, type MetricPeriod } from '@/types';
import { createDefaultNodeData } from '@/utils/nodeFactory';
import { getLayoutedElements } from '@/utils/layout';

interface WorkflowState {
  nodes: Node<AnyNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  isSimulating: boolean;
  simulationResult: SimulationResult | null;
}

interface WorkflowActions {
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (id: string, data: Partial<AnyNodeData>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: Edge | Connection) => void;
  deleteEdge: (id: string) => void;
  updateEdgeLabel: (id: string, label: string) => void;
  setSelectedNode: (id: string | null) => void;
  setSimulating: (val: boolean) => void;
  setSimulationResult: (result: SimulationResult | null) => void;
  resetWorkflow: () => void;
  getNodeById: (id: string) => Node<AnyNodeData> | undefined;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  setWorkflow: (nodes: Node<AnyNodeData>[], edges: Edge[]) => void;
  layoutWorkflow: (direction: 'TB' | 'LR') => void;
  runPerformanceSimulation: (startNodeId: string, percentageChange: number) => void;
}

export type WorkflowStore = WorkflowState & WorkflowActions;

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isSimulating: false,
  simulationResult: null,

  layoutWorkflow: (direction) => {
    const { nodes, edges } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
    set({ nodes: [...layoutedNodes], edges: [...layoutedEdges] });
  },

  setWorkflow: (nodes, edges) => {
    set({ nodes, edges, selectedNodeId: null });
  },

  addNode: (type, position) => {
    const id = uuidv4();
    const newNode: Node<AnyNodeData> = {
      id,
      type,
      position,
      data: createDefaultNodeData(type, id),
    };
    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
  },

  updateNodeData: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data, configured: true } }
          : node
      ),
    }));
  },

  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },

  addEdge: (connection) => {
    set((state) => ({
      edges: addReactFlowEdge(connection, state.edges),
    }));
  },

  deleteEdge: (id) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    }));
  },

  updateEdgeLabel: (id, label) => {
    set((state) => ({
      edges: state.edges.map((edge) =>
        edge.id === id ? { ...edge, label } : edge
      ),
    }));
  },

  setSelectedNode: (id) => {
    set({ selectedNodeId: id });
  },

  setSimulating: (val) => {
    set({ isSimulating: val });
  },

  setSimulationResult: (result) => {
    set({ simulationResult: result });
  },

  resetWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      isSimulating: false,
      simulationResult: null,
    });
  },

  getNodeById: (id) => {
    return get().nodes.find((node) => node.id === id);
  },

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  runPerformanceSimulation: (startNodeId, percentageChange) => {
    const { nodes, edges } = get();
    const updatedNodes = [...nodes];
    const queue: { id: string; impact: number }[] = [{ id: startNodeId, impact: percentageChange }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { id, impact } = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);

      // Update the current node's data with the impact
      const nodeIndex = updatedNodes.findIndex(n => n.id === id);
      if (nodeIndex !== -1) {
        const node = updatedNodes[nodeIndex];
        if (node.data.type === NodeType.MetricInput || node.data.type === NodeType.NorthStar || node.data.type === NodeType.KPI) {
          const metricData = node.data as MetricNodeData;
          const updatedPeriods = metricData.periods.map((p: MetricPeriod) => {
            const numericMatch = p.value.match(/(-?\d+\.?\d*)/);
            const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;
            const unit = p.value.replace(/(-?\d+\.?\d*)/, '');
            
            const newValue = (numericValue * (1 + impact / 100)).toFixed(2);
            const newChange = p.change + impact;

            return {
              ...p,
              change: newChange,
              value: `${newValue}${unit}`,
              trend: newChange >= 0 ? 'up' : 'down'
            };
          });
          updatedNodes[nodeIndex] = {
            ...node,
            data: { ...node.data, periods: updatedPeriods } as MetricNodeData
          };
        }
      }

      // Find children and propagate impact based on correlation
      const outgoingEdges = edges.filter(e => e.source === id);
      for (const edge of outgoingEdges) {
        const correlation = parseFloat(edge.label as string) || 1;
        const childImpact = impact * correlation;
        queue.push({ id: edge.target, impact: childImpact });
      }
    }

    set({ nodes: updatedNodes });
  },
}));

