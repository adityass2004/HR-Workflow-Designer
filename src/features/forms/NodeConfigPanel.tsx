import React from 'react';
import { useWorkflowStore } from '@/store';
import { NodeType, type StartNodeData, type TaskNodeData, type ApprovalNodeData, type AutomationNodeData, type EndNodeData, type ProjectNodeData, type MetricNodeData } from '@/types';
import StartNodeForm from './StartNodeForm';
import TaskNodeForm from './TaskNodeForm';
import ApprovalNodeForm from './ApprovalNodeForm';
import AutomationNodeForm from './AutomationNodeForm';
import EndNodeForm from './EndNodeForm';
import ProjectNodeForm from './ProjectNodeForm';
import MetricNodeForm from './MetricNodeForm';

const NodeConfigPanel: React.FC = () => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const renderForm = () => {
    if (!selectedNode) return null;

    const { type } = selectedNode.data;

    switch (type) {
      case NodeType.Start:
        return <StartNodeForm nodeId={selectedNode.id} data={selectedNode.data as StartNodeData} />;
      case NodeType.Task:
        return <TaskNodeForm nodeId={selectedNode.id} data={selectedNode.data as TaskNodeData} />;
      case NodeType.Approval:
        return <ApprovalNodeForm nodeId={selectedNode.id} data={selectedNode.data as ApprovalNodeData} />;
      case NodeType.Automation:
        return <AutomationNodeForm nodeId={selectedNode.id} data={selectedNode.data as AutomationNodeData} />;
      case NodeType.End:
        return <EndNodeForm nodeId={selectedNode.id} data={selectedNode.data as EndNodeData} />;
      case NodeType.Project:
        return <ProjectNodeForm nodeId={selectedNode.id} data={selectedNode.data as ProjectNodeData} />;
      case NodeType.MetricInput:
      case NodeType.NorthStar:
      case NodeType.KPI:
        return <MetricNodeForm nodeId={selectedNode.id} data={selectedNode.data as MetricNodeData} />;
      default:
        return (
          <div className="p-4 text-center text-text-muted italic text-sm">
            Unknown node type: {type}
          </div>
        );
    }
  };

  return (
    <aside className="w-[340px] bg-background-surface border-l border-border-default h-full flex flex-col shrink-0 overflow-hidden shadow-2xl z-30">
      <div className="p-6 border-b border-border-default flex items-center justify-between sticky top-0 bg-background-surface/90 backdrop-blur-md z-10 shrink-0">
        <h2 className="text-sm font-black text-text-primary uppercase tracking-widest">Configuration</h2>
        {selectedNode && (
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-accent-blue/10 text-accent-blue font-black uppercase tracking-tighter border border-accent-blue/20">
            {selectedNode.data.type}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {!selectedNode ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-40">
            <div className="w-16 h-16 rounded-2xl bg-background-primary flex items-center justify-center text-3xl shadow-inner border border-border-default/50">
              🖱️
            </div>
            <div>
              <p className="text-xs font-black text-text-primary uppercase tracking-widest">No node selected</p>
              <p className="text-[10px] text-text-muted mt-2 font-medium">Select a node on the canvas to edit its properties.</p>
            </div>
          </div>
        ) : (
          <div className="pb-20">
            {renderForm()}
          </div>
        )}
      </div>
    </aside>
  );
};

export default NodeConfigPanel;
