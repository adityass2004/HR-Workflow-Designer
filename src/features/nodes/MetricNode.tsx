import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { type MetricNodeData, NodeType } from '@/types';

const MetricNode: React.FC<NodeProps<MetricNodeData>> = ({ data, selected, type }) => {
  const isNorthStar = type === NodeType.NorthStar;

  return (
    <div className={`
      bg-background-surface rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 transition-all duration-300 overflow-visible
      ${selected ? 'border-accent-blue scale-[1.05] shadow-accent-blue/20' : 'border-border-default/50'}
      ${data.hasError ? 'ring-4 ring-accent-red/30 border-accent-red' : ''}
      ${isNorthStar ? 'w-[400px] ring-2 ring-accent-blue/20' : 'w-[340px]'}
    `}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner bg-background-primary/50 border border-border-default/50`}>
              {isNorthStar ? '⭐' : '📈'}
            </div>
            <div className="flex flex-col">
              <span className={`font-black text-text-primary leading-tight tracking-tight ${isNorthStar ? 'text-xl' : 'text-base'}`}>
                {data.name}
              </span>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] font-black text-white px-2 py-0.5 rounded-lg uppercase tracking-widest shadow-sm ${
                  isNorthStar ? 'bg-rose-600' : 'bg-accent-blue/80'
                }`}>
                  {type.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-[11px] text-text-muted font-bold tracking-tight bg-background-primary px-2 py-0.5 rounded border border-border-default/30">
                  {data.aggregation}
                </span>
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-background-primary/30 text-text-muted/20 border border-border-default/10">
             <span className="text-lg">📊</span>
          </div>
        </div>

        {data.periods && data.periods.length > 0 && (
          <div className="grid grid-cols-3 gap-4 bg-background-primary/40 p-4 rounded-2xl border border-border-default/50 shadow-inner">
            {data.periods.map((period, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-[10px] font-black text-text-muted uppercase tracking-widest truncate">{period.label}</div>
                <div className="text-sm font-black text-text-primary tracking-tighter leading-none">{period.value}</div>
                <div className={`text-[11px] font-black flex items-center gap-1 ${
                  period.trend === 'up' ? 'text-accent-green' : 
                  period.trend === 'down' ? 'text-accent-red' : 'text-text-muted'
                }`}>
                  <span className="text-[14px] leading-none">{period.trend === 'up' ? '▴' : period.trend === 'down' ? '▾' : '•'}</span>
                  {period.change}%
                </div>
              </div>
            ))}
          </div>
        )}

        {data.goal && (
          <div className="mt-6 pt-5 border-t border-border-default/50">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs">🎯</span>
                <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">{data.goal.text}</span>
              </div>
              <span className="text-xs font-black text-accent-amber bg-accent-amber/10 px-2 py-0.5 rounded-full border border-accent-amber/20">
                {data.goal.progress}%
              </span>
            </div>
            <div className="relative h-3 w-full bg-background-primary rounded-full overflow-hidden shadow-inner border border-border-default/30">
              <div 
                className="absolute top-0 left-0 h-full bg-accent-amber transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(245,158,11,0.4)]" 
                style={{ width: `${data.goal.progress}%` }} 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
            </div>
          </div>
        )}
      </div>
      
      {type !== NodeType.KPI && (
        <Handle type="source" position={Position.Right} className="w-4 h-4 !bg-accent-blue !border-4 !border-background-surface -mr-2 shadow-lg" />
      )}
      <Handle type="target" position={Position.Left} className="w-4 h-4 !bg-accent-blue !border-4 !border-background-surface -ml-2 shadow-lg" />
    </div>
  );
};

export default MetricNode;
