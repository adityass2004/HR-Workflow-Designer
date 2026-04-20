import React from 'react';
import { NodeType } from '@/types';

const HR_NODES = [
  { type: NodeType.Start, label: 'Start', color: 'bg-accent-green' },
  { type: NodeType.Task, label: 'Task', color: 'bg-accent-blue' },
  { type: NodeType.Approval, label: 'Approval', color: 'bg-accent-amber' },
  { type: NodeType.Automation, label: 'Automation', color: 'bg-purple-500' },
  { type: NodeType.End, label: 'End', color: 'bg-accent-red' },
];

const PERFORMANCE_NODES = [
  { type: NodeType.Project, label: 'Project/Epic', color: 'bg-indigo-600' },
  { type: NodeType.MetricInput, label: 'Metric Input', color: 'bg-emerald-600' },
  { type: NodeType.NorthStar, label: 'North Star', color: 'bg-rose-600' },
  { type: NodeType.KPI, label: 'KPI', color: 'bg-orange-600' },
];

const NodePalette: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('nodeType', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-[220px] bg-background-surface border-r border-border-default p-4 flex flex-col gap-4 h-full shrink-0 overflow-y-auto z-30 shadow-xl relative">
      <div>
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">HR Workflow</h3>
        <div className="flex flex-col gap-3">
          {HR_NODES.map(({ type, label, color }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => onDragStart(e, type)}
              className={`
                flex items-center px-4 py-3 rounded-lg cursor-grab active:cursor-grabbing 
                hover:opacity-90 transition-all text-white font-medium shadow-md
                ${color}
              `}
            >
              <div className="w-2 h-2 rounded-full bg-white mr-3" />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border-default">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Performance Map</h3>
        <div className="flex flex-col gap-3">
          {PERFORMANCE_NODES.map(({ type, label, color }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => onDragStart(e, type)}
              className={`
                flex items-center px-4 py-3 rounded-lg cursor-grab active:cursor-grabbing 
                hover:opacity-90 transition-all text-white font-medium shadow-md
                ${color}
              `}
            >
              <div className="w-2 h-2 rounded-full bg-white mr-3" />
              {label}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto text-xs text-text-muted italic">
        Drag and drop components onto the canvas to design your workflow.
      </div>
    </aside>
  );
};

export default NodePalette;
