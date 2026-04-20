import { useMemo, useEffect } from 'react';
import { useWorkflowStore } from '@/store';
import { validateWorkflow, type ValidationResult } from '@/utils/graphValidator';

export const useValidation = (): ValidationResult => {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);

  const result = useMemo(() => validateWorkflow(nodes, edges), [nodes, edges]);

  useEffect(() => {
    // Map of nodeId -> hasError
    const errorMap = new Map<string, boolean>();
    
    // Initialize all current nodes to false
    nodes.forEach(n => errorMap.set(n.id, false));
    
    // Set true for nodes mentioned in errors
    result.errors.forEach(err => {
      if (err.nodeId) errorMap.set(err.nodeId, true);
    });

    // Update nodes only if hasError state actually changed
    let hasChanges = false;
    const nextNodes = nodes.map(node => {
      const currentErrorState = errorMap.get(node.id) || false;
      if (node.data.hasError !== currentErrorState) {
        hasChanges = true;
        return { ...node, data: { ...node.data, hasError: currentErrorState } };
      }
      return node;
    });

    if (hasChanges) {
      useWorkflowStore.setState({ nodes: nextNodes });
    }
  }, [result, nodes]);

  return result;
};
