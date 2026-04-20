import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { type StartNodeData } from '@/types';

const StartNode: React.FC<NodeProps<StartNodeData>> = ({ data, selected }) => {
  return (
    <div className={`w-[200px] bg-background-surface rounded-lg shadow-xl border-2 transition-all overflow-hidden
      ${selected ? 'border-accent-blue' : 'border-transparent'}
      ${data.hasError ? 'ring-2 ring-accent-red' : ''}
    `}>
      <div className="h-1.5 w-full bg-accent-green" />
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-accent-green">▶</span>
          <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider">Start</span>
        </div>
        <h3 className="text-sm font-semibold text-text-primary truncate">{data.title || data.label}</h3>
        <div className="mt-3 flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${data.configured ? 'bg-accent-green' : 'bg-text-muted'}`} />
          <span className="text-[10px] text-text-muted">
            {data.configured ? 'Configured ✓' : 'Not set'}
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 !bg-accent-blue !border-2 !border-background-surface" />
    </div>
  );
};

export default StartNode;
