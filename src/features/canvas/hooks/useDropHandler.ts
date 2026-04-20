import { useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import { useWorkflowStore } from '@/store';
import { NodeType } from '@/types';

export const useDropHandler = () => {
  const reactFlowInstance = useReactFlow();
  const addNode = useWorkflowStore((state) => state.addNode);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('nodeType') as NodeType;

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [reactFlowInstance, addNode]
  );

  return { onDragOver, onDrop };
};
