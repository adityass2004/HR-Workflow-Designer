import { useState, useCallback } from 'react';
import { useWorkflowStore } from '@/store';
import { runSimulation } from '@/api';
import { serializeWorkflow } from '@/utils/serializer';

export const useSimulation = () => {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const setSimulating = useWorkflowStore((state) => state.setSimulating);
  const setSimulationResult = useWorkflowStore((state) => state.setSimulationResult);
  const isRunning = useWorkflowStore((state) => state.isSimulating);
  const result = useWorkflowStore((state) => state.simulationResult);
  
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    try {
      setError(null);
      setSimulating(true);
      setSimulationResult(null);

      const graph = serializeWorkflow(nodes, edges);
      const simulationResult = await runSimulation(graph);

      setSimulationResult(simulationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setSimulating(false);
    }
  }, [nodes, edges, setSimulating, setSimulationResult]);

  return { run, isRunning, result, error };
};
