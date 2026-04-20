import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useWorkflowStore } from '@/store';
import { type EndNodeData, NodeType } from '@/types';

const endNodeSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NodeType),
  label: z.string(),
  configured: z.boolean(),
  hasError: z.boolean().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  endMessage: z.string().min(1, 'End message is required'),
  summaryEnabled: z.boolean(),
});

interface EndNodeFormProps {
  nodeId: string;
  data: EndNodeData;
}

const EndNodeForm: React.FC<EndNodeFormProps> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const { register, watch, reset, formState: { errors } } = useForm<EndNodeData>({
    resolver: zodResolver(endNodeSchema),
    defaultValues: data,
  });

  useEffect(() => {
    reset(data);
  }, [nodeId, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      // Always update store if we have a value. The isDirty check was causing 
      // the first change to be lost because isDirty updates after the first watch trigger.
      if (value) {
        updateNodeData(nodeId, value as Partial<EndNodeData>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-1">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Node Title</label>
        <input
          {...register('title')}
          className={`w-full bg-background-primary border rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors ${
            errors.title ? 'border-accent-red' : 'border-border-default'
          }`}
          placeholder="e.g. Success, Rejected..."
        />
        {errors.title && (
          <p className="text-[10px] text-accent-red mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">End Message</label>
        <textarea
          {...register('endMessage')}
          className={`w-full bg-background-primary border rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors min-h-[80px] ${
            errors.endMessage ? 'border-accent-red' : 'border-border-default'
          }`}
          placeholder="Enter message for completion..."
        />
        {errors.endMessage && (
          <p className="text-[10px] text-accent-red mt-1">{errors.endMessage.message}</p>
        )}
      </div>

      <div className="flex items-center gap-3 p-3 bg-background-primary rounded-lg border border-border-default">
        <input
          type="checkbox"
          id="summaryEnabled"
          {...register('summaryEnabled')}
          className="w-4 h-4 rounded border-border-default bg-background-surface text-accent-blue focus:ring-accent-blue"
        />
        <label htmlFor="summaryEnabled" className="text-sm text-text-primary cursor-pointer">
          Enable Workflow Summary
        </label>
      </div>
      <p className="text-[10px] text-text-muted italic px-1">
        If enabled, users will see a detailed summary of all steps upon completion.
      </p>
    </div>
  );
};

export default EndNodeForm;
