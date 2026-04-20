import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { type EndNodeData } from '@/types';

const EndNode: React.FC<NodeProps<EndNodeData>> = ({ data, selected }) => {
  return (
    <div className={`w-[200px] bg-background-surface rounded-lg shadow-xl border-2 transition-all overflow-hidden
      ${selected ? 'border-accent-blue' : 'border-transparent'}
      ${data.hasError ? 'ring-2 ring-accent-red' : ''}
    `}>
      <div className="h-1.5 w-full bg-accent-red" />
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-accent-red">⏹</span>
          <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider">End</span>
        </div>
        <h3 className="text-sm font-semibold text-text-primary truncate">{data.title || data.label}</h3>
        <p className="text-[10px] text-text-muted truncate mt-0.5 italic">
          {data.endMessage || 'No message set'}
        </p>
        <div className="mt-2 flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${data.configured ? 'bg-accent-green' : 'bg-text-muted'}`} />
          <span className="text-[10px] text-text-muted">
            {data.configured ? 'Configured ✓' : 'Not set'}
          </span>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 !bg-accent-blue !border-2 !border-background-surface" />
    </div>
  );
};

export default EndNode;
