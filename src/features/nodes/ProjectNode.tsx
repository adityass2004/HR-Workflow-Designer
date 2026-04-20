import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { type ProjectNodeData } from '@/types';

const ProjectNode: React.FC<NodeProps<ProjectNodeData>> = ({ data, selected }) => {
  const progressColor = data.statusColor === 'green' ? 'bg-accent-green' : 
                       data.statusColor === 'yellow' ? 'bg-accent-amber' : 
                       data.statusColor === 'blue' ? 'bg-accent-blue' : 
                       data.statusColor === 'red' ? 'bg-accent-red' : 'bg-accent-blue';

  return (
    <div className={`w-[320px] bg-background-surface rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 transition-all duration-300
      ${selected ? 'border-accent-blue scale-[1.05] shadow-accent-blue/20' : 'border-border-default/50'}
      ${data.hasError ? 'ring-4 ring-accent-red/30 border-accent-red' : ''}
    `}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner bg-background-primary/50 border border-border-default/50`}>
              {data.platform === 'Asana' ? '🔺' : '🔷'}
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-text-primary leading-tight tracking-tight">{data.name}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-text-muted bg-background-primary px-2 py-0.5 rounded border border-border-default/50 uppercase tracking-tighter">
                  {data.platform}
                </span>
                <span className="text-[10px] text-accent-blue font-bold uppercase tracking-tighter">
                  {data.typeLabel}
                </span>
              </div>
            </div>
          </div>
          <button className="text-text-muted/30 hover:text-accent-blue transition-all p-1 hover:bg-background-primary rounded-lg">
            <span className="text-xs italic font-bold tracking-tighter">Details ↗</span>
          </button>
        </div>

        <div className="space-y-3 mt-6">
          <div className="flex justify-between items-end mb-1">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Completion Progress</span>
            <span className="text-sm font-black text-text-primary">{data.progress}%</span>
          </div>
          <div className="relative h-3 w-full bg-background-primary rounded-full overflow-hidden shadow-inner border border-border-default/30">
            <div 
              className={`absolute top-0 left-0 h-full ${progressColor} transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,0,0,0.2)]`} 
              style={{ width: `${data.progress}%` }} 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-tighter">
                <span className="text-text-primary">{data.issueCount}</span> active issues
              </span>
            </div>
            {data.status && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest text-white shadow-lg ${progressColor} transform hover:scale-105 transition-transform cursor-default`}>
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                {data.status}
              </div>
            )}
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="w-4 h-4 !bg-accent-blue !border-4 !border-background-surface -ml-2 shadow-lg" />
      <Handle type="source" position={Position.Right} className="w-4 h-4 !bg-accent-blue !border-4 !border-background-surface -mr-2 shadow-lg" />
    </div>
  );
};

export default ProjectNode;
