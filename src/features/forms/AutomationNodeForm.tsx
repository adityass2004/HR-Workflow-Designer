import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useWorkflowStore } from '@/store';
import { type AutomationNodeData, NodeType } from '@/types';
import { useAutomations } from '@/hooks/useAutomations';

const automationNodeSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NodeType),
  label: z.string(),
  configured: z.boolean(),
  hasError: z.boolean().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  actionId: z.string().min(1, 'Action is required'),
  actionParams: z.record(z.string()),
});

interface AutomationNodeFormProps {
  nodeId: string;
  data: AutomationNodeData;
}

const AutomationNodeForm: React.FC<AutomationNodeFormProps> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const { automations: actions, loading, error } = useAutomations();
  
  const { register, watch, reset, formState: { errors } } = useForm<AutomationNodeData>({
    resolver: zodResolver(automationNodeSchema),
    defaultValues: data,
  });

  const selectedActionId = watch('actionId');
  const selectedAction = useMemo(() => 
    actions.find(a => a.id === selectedActionId), 
    [actions, selectedActionId]
  );

  useEffect(() => {
    reset(data);
  }, [nodeId, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      // Always update store if we have a value. The isDirty check was causing 
      // the first change to be lost because isDirty updates after the first watch trigger.
      if (value) {
        updateNodeData(nodeId, value as Partial<AutomationNodeData>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center space-y-2 h-[200px]">
        <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-text-muted">Loading automation actions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center space-y-2">
        <p className="text-sm text-accent-red">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-1">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Automation Title</label>
        <input
          {...register('title')}
          className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
          placeholder="Automation title..."
        />
        {errors.title && <p className="text-[10px] text-accent-red mt-1">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Select Action</label>
        <select
          {...register('actionId')}
          className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
        >
          <option value="">Select an action...</option>
          {actions.map(action => (
            <option key={action.id} value={action.id}>{action.label}</option>
          ))}
        </select>
        {errors.actionId && <p className="text-[10px] text-accent-red mt-1">{errors.actionId.message}</p>}
      </div>

      {selectedAction && (
        <div className="space-y-3 pt-2 border-t border-border-default">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Parameters</label>
          {selectedAction.params.map(param => (
            <div key={param} className="space-y-1">
              <label className="text-[10px] font-medium text-text-muted capitalize">{param}</label>
              <input
                {...register(`actionParams.${param}` as const)}
                className="w-full bg-background-primary border border-border-default rounded px-2 py-1 text-xs text-text-primary focus:border-accent-blue outline-none transition-colors"
                placeholder={`Enter ${param}...`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutomationNodeForm;
