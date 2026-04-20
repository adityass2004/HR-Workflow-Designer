import React, { useRef } from 'react';
import NodePalette from '@/features/canvas/NodePalette';
import WorkflowCanvas from '@/features/canvas/WorkflowCanvas';
import NodeConfigPanel from '@/features/forms/NodeConfigPanel';
import SimulationPanel from '@/features/simulation/SimulationPanel';
import { useWorkflowStore } from '@/store';
import { serializeWorkflow, deserializeWorkflow } from '@/utils/serializer';
import { getLayoutedElements } from '@/utils/layout';
import sampleWorkflow from '../performance_workflow.json';

const App: React.FC = () => {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const setWorkflow = useWorkflowStore((state) => state.setWorkflow);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLayout = (direction: 'TB' | 'LR') => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
    setWorkflow([...layoutedNodes], [...layoutedEdges]);
  };

  const handleLoadSample = () => {
    const { nodes: newNodes, edges: newEdges } = deserializeWorkflow(sampleWorkflow as any);
    setWorkflow(newNodes, newEdges);
  };

  const handleExport = () => {
    const workflow = serializeWorkflow(nodes, edges);
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const workflow = JSON.parse(content);
        const { nodes: newNodes, edges: newEdges } = deserializeWorkflow(workflow);
        setWorkflow(newNodes, newEdges);
      } catch (err) {
        console.error('Failed to import workflow:', err);
        alert('Invalid workflow file');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-background-primary overflow-hidden text-text-primary">
      {/* Top Navbar - Fixed Height */}
      <header className="h-16 bg-background-surface/80 border-b border-border-default px-6 flex items-center justify-between backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center text-xl shadow-inner border border-accent-blue/20">
            ⚡
          </div>
          <h1 className="text-xl font-black text-text-primary tracking-tight">
            Performance <span className="text-accent-blue italic font-black">Intelligence</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSample}
            className="px-4 py-2 bg-accent-amber/10 hover:bg-accent-amber/20 text-accent-amber rounded-xl transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-accent-amber/20 shadow-sm"
            title="Load the Performance Map sample data"
          >
            <span>⭐</span> Load Sample
          </button>
          <div className="w-px h-6 bg-border-default mx-1" />
          <button
            onClick={() => handleLayout('TB')}
            className="px-4 py-2 bg-background-primary hover:bg-background-surface text-text-primary rounded-xl shadow-sm transition-all border border-border-default text-xs font-black uppercase tracking-widest flex items-center gap-2"
            title="Auto-arrange nodes vertically"
          >
            <span>📐</span> Layout
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-background-primary hover:bg-background-surface text-text-primary rounded-xl shadow-sm transition-all border border-border-default text-xs font-black uppercase tracking-widest flex items-center gap-2"
          >
            <span>📥</span> Import
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-accent-blue text-white rounded-xl shadow-lg hover:shadow-accent-blue/20 transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2"
          >
            <span>📤</span> Export
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Left Sidebar - Fixed Width */}
        <NodePalette />
        
        {/* Center Content - Dynamic Resizing */}
        <main className="flex-1 flex flex-col min-w-0 relative border-x border-border-default bg-background-primary">
          {/* Canvas Container */}
          <div className="flex-1 relative overflow-hidden">
            <WorkflowCanvas />
          </div>

          {/* Bottom Simulation Panel - Segmented, No Overlap */}
          <SimulationPanel />
        </main>

        {/* Right Configuration Panel - Fixed Width */}
        <NodeConfigPanel />
      </div>
    </div>
  );
};

export default App;
