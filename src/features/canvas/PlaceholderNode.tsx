import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { type AnyNodeData } from '@/types';

const PlaceholderNode: React.FC<NodeProps<AnyNodeData>> = ({ data, selected }) => {
  return (
    <div className={`px-4 py-2 rounded-md border-2 bg-background-surface shadow-lg min-w-[150px] transition-all
      ${selected ? 'border-accent-blue ring-1 ring-accent-blue' : 'border-border-default'}
      ${data.hasError ? 'border-accent-red' : ''}
    `}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-accent-blue" />
      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase text-text-muted">{data.type}</span>
        <span className="text-sm font-medium text-text-primary">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-accent-blue" />
    </div>
  );
};

export default PlaceholderNode;
