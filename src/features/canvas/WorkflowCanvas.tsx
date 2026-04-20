import React, { useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  useReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionLineType,
  BackgroundVariant,
  type OnConnect,
  type Node,
  type Edge,
  type Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from '@/store';
import { nodeTypes } from '@/features/nodes';
import CorrelationEdge from './CorrelationEdge';
import CanvasToolbar from './CanvasToolbar';
import { NodeType } from '@/types';
import { useDropHandler } from './hooks/useDropHandler';
import { useValidation } from '@/hooks/useValidation';

const edgeTypes = {
  correlation: CorrelationEdge,
};

const WorkflowCanvasInternal: React.FC = () => {
  const { 
    nodes, 
    edges, 
    setSelectedNode, 
    addEdge, 
    deleteNode, 
    deleteEdge,
    onNodesChange,
    onEdgesChange
  } = useWorkflowStore();
  const { onDragOver, onDrop } = useDropHandler();
  const { valid, errors } = useValidation();
  const { fitView } = useReactFlow();
  const prevNodesCount = useRef(nodes.length);

  // Auto-fit view when nodes are imported (count changes significantly)
  useEffect(() => {
    if (nodes.length > 0 && prevNodesCount.current === 0) {
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 800 });
      }, 50);
    }
    prevNodesCount.current = nodes.length;
  }, [nodes.length, fitView]);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      // 1. Prevent self-connections
      if (params.source === params.target) return;

      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);

      if (!sourceNode || !targetNode) return;

      // 2. HR Start node constraint: Only one outgoing edge
      if (sourceNode.data?.type === NodeType.Start) {
        const hasOutgoing = edges.some(e => e.source === sourceNode.id);
        if (hasOutgoing) {
          alert('HR Start node can only have one outgoing connection');
          return;
        }
      }

      // 3. HR End node constraint: No outgoing edges
      if (sourceNode.data?.type === NodeType.End) {
        alert('HR End node cannot have outgoing connections');
        return;
      }

      // 4. End node constraint: Only one incoming edge (optional but common)
      // If we want to allow multiple paths to End, we leave this. 
      // The README doesn't explicitly forbid multiple incoming to End.

      const isPerformanceEdge = [
        NodeType.Project, 
        NodeType.MetricInput, 
        NodeType.NorthStar, 
        NodeType.KPI
      ].includes(sourceNode.data?.type as NodeType);

      const newEdge = {
        ...params,
        type: isPerformanceEdge ? 'correlation' : 'smoothstep',
        label: isPerformanceEdge ? '0.0' : '',
        animated: true,
      };

      addEdge(newEdge);
    },
    [addEdge, nodes, edges]
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      deleted.forEach((node) => deleteNode(node.id));
    },
    [deleteNode]
  );

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      deleted.forEach((edge) => deleteEdge(edge.id));
    },
    [deleteEdge]
  );

  return (
    <div className="w-full h-full bg-background-primary relative overflow-hidden" onDrop={onDrop} onDragOver={onDragOver}>
      {!valid && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 group">
          <div className="bg-accent-red/90 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-md cursor-help flex items-center gap-2 border border-accent-red/20">
            <span className="text-sm font-bold">{errors.length} issues found</span>
            <span className="text-[10px] bg-white/20 px-1.5 rounded">HOVER TO VIEW</span>
          </div>
          
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-background-surface border border-border-default rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
            <div className="p-2 bg-accent-red/10 border-b border-border-default">
              <span className="text-[10px] font-bold text-accent-red uppercase tracking-wider">Validation Errors</span>
            </div>
            <div className="max-h-60 overflow-y-auto p-2 space-y-2">
              {errors.map((err, i) => (
                <div key={i} className="text-xs text-text-primary flex gap-2 items-start p-1.5 rounded hover:bg-background-primary transition-colors">
                  <span className="text-accent-red mt-0.5">•</span>
                  <span>{err.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node.id)}
        onPaneClick={() => setSelectedNode(null)}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.5, duration: 1000 }}
        snapToGrid
        snapGrid={[20, 20]}
        connectionLineType={ConnectionLineType.SmoothStep}
        deleteKeyCode="Delete"
        className="workflow-canvas"
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
      >
        <Background 
          color="#333" 
          gap={20} 
          size={1.5} 
          variant={BackgroundVariant.Dots}
          className="opacity-30"
        />
        <Controls 
          position="bottom-left" 
          className="!bg-background-surface !border-border-default !shadow-2xl !m-4" 
        />
        <CanvasToolbar />
        <MiniMap 
          position="bottom-right"
          nodeColor={(node) => {
            switch (node.data.type) {
              case 'start': return '#10b981';
              case 'project': return '#4f8ef7';
              case 'metricInput': return '#f59e0b';
              case 'northStar': return '#e11d48';
              case 'kpi': return '#f59e0b';
              case 'end': return '#ef4444';
              default: return '#4f8ef7';
            }
          }}
          maskColor="rgba(15, 17, 23, 0.8)"
          className="!bg-background-surface border border-border-default rounded-xl overflow-hidden shadow-2xl"
        />
      </ReactFlow>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .workflow-canvas .react-flow__pane {
          background-color: #0f1117;
        }
        .workflow-canvas .react-flow__handle {
          width: 8px;
          height: 8px;
          background: #4f8ef7;
        }
      `}} />
    </div>
  );
};

const WorkflowCanvas: React.FC = () => {
  return <WorkflowCanvasInternal />;
};

export default WorkflowCanvas;
