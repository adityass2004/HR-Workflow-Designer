import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useWorkflowStore } from '@/store';
import { type ProjectNodeData, NodeType } from '@/types';

const projectNodeSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NodeType),
  label: z.string(),
  configured: z.boolean(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  platform: z.string().min(1, 'Platform required'),
  typeLabel: z.string().min(1, 'Type required'),
  issueCount: z.number().min(0),
  progress: z.number().min(0).max(100),
  status: z.string().optional(),
  statusColor: z.string().optional(),
});

interface ProjectNodeFormProps {
  nodeId: string;
  data: ProjectNodeData;
}

const ProjectNodeForm: React.FC<ProjectNodeFormProps> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const runPerformanceSimulation = useWorkflowStore((state) => state.runPerformanceSimulation);
  
  const { register, watch, reset, formState: { errors } } = useForm<ProjectNodeData>({
    resolver: zodResolver(projectNodeSchema),
    defaultValues: data,
  });

  useEffect(() => {
    reset(data);
  }, [nodeId, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        updateNodeData(nodeId, value as Partial<ProjectNodeData>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-1">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Project Name</label>
        <input
          {...register('name')}
          className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
          placeholder="Project name..."
        />
        {errors.name && <p className="text-[10px] text-accent-red mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Platform</label>
          <select
            {...register('platform')}
            className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
          >
            <option value="Jira">Jira</option>
            <option value="Asana">Asana</option>
            <option value="Linear">Linear</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Type</label>
          <input
            {...register('typeLabel')}
            className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
            placeholder="e.g. Epic, Task"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Issues</label>
          <input
            type="number"
            {...register('issueCount', { valueAsNumber: true })}
            className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Progress (%)</label>
          <input
            type="number"
            {...register('progress', { valueAsNumber: true })}
            className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Status Text</label>
          <input
            {...register('status')}
            className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
            placeholder="e.g. Done"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Status Color</label>
          <select
            {...register('statusColor')}
            className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
          >
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
            <option value="red">Red</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-border-default space-y-3">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Project Impact Simulation</label>
        <div className="p-3 bg-accent-blue/5 rounded-lg border border-accent-blue/20 space-y-3">
          <p className="text-[10px] text-text-muted italic">
            Simulate the impact of this project on downstream metrics.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => runPerformanceSimulation(nodeId, 10)}
              className="flex-1 bg-accent-green/20 text-accent-green text-[10px] font-bold py-1.5 rounded hover:bg-accent-green/30 transition-all"
            >
              +10% Success
            </button>
            <button
              type="button"
              onClick={() => runPerformanceSimulation(nodeId, -10)}
              className="flex-1 bg-accent-red/20 text-accent-red text-[10px] font-bold py-1.5 rounded hover:bg-accent-red/30 transition-all"
            >
              -10% Risk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectNodeForm;
