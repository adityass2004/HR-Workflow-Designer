import React from 'react';
import { useWorkflowStore } from '@/store';

const CanvasToolbar: React.FC = () => {
  const { layoutWorkflow, resetWorkflow } = useWorkflowStore();

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 p-1.5 bg-background-surface/80 backdrop-blur-md border border-border-default rounded-xl shadow-2xl">
      <button
        onClick={() => layoutWorkflow('LR')}
        className="px-3 py-1.5 text-[10px] font-bold text-text-primary hover:bg-background-primary rounded-lg transition-all flex items-center gap-2"
        title="Auto-layout horizontally"
      >
        <span>↔️</span> Layout Horizontal
      </button>
      <button
        onClick={() => layoutWorkflow('TB')}
        className="px-3 py-1.5 text-[10px] font-bold text-text-primary hover:bg-background-primary rounded-lg transition-all flex items-center gap-2"
        title="Auto-layout vertically"
      >
        <span>↕️</span> Layout Vertical
      </button>
      <div className="w-px h-4 bg-border-default self-center mx-1" />
      <button
        onClick={() => {
          if (confirm('Are you sure you want to clear the entire canvas?')) {
            resetWorkflow();
          }
        }}
        className="px-3 py-1.5 text-[10px] font-bold text-accent-red hover:bg-accent-red/10 rounded-lg transition-all flex items-center gap-2"
      >
        <span>🗑️</span> Reset Canvas
      </button>
    </div>
  );
};

export default CanvasToolbar;
