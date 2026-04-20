import React from 'react';
import { 
  type EdgeProps, 
  getBezierPath, 
  EdgeLabelRenderer, 
  BaseEdge 
} from 'reactflow';
import { useWorkflowStore } from '@/store';

const CorrelationEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  style = {},
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const updateEdgeLabel = useWorkflowStore((state) => state.updateEdgeLabel);
  const isNegative = typeof label === 'string' && label.startsWith('-');

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: 2,
          stroke: isNegative ? '#ef4444' : '#10b981',
          strokeDasharray: '5,5',
        }} 
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <input
            className={`
              w-12 text-[10px] font-bold text-center rounded border shadow-sm outline-none transition-all
              ${isNegative ? 'bg-accent-red text-white border-accent-red' : 'bg-accent-green text-white border-accent-green'}
            `}
            value={label as string || ''}
            onChange={(evt) => updateEdgeLabel(id, evt.target.value)}
            placeholder="0.0"
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CorrelationEdge;
