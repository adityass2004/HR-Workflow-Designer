import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useWorkflowStore } from '@/store';
import { type StartNodeData, NodeType } from '@/types';
import KeyValueEditor from './components/KeyValueEditor';

const startNodeSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NodeType),
  label: z.string(),
  configured: z.boolean(),
  hasError: z.boolean().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  metadata: z.array(z.object({
    key: z.string().min(1, 'Key required'),
    value: z.string().min(1, 'Value required'),
  })),
});

interface StartNodeFormProps {
  nodeId: string;
  data: StartNodeData;
}

const StartNodeForm: React.FC<StartNodeFormProps> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const { register, control, watch, reset, formState: { errors } } = useForm<StartNodeData>({
    resolver: zodResolver(startNodeSchema),
    defaultValues: data,
  });

  // Only reset form when the node ID changes
  useEffect(() => {
    reset(data);
  }, [nodeId, reset]); // Removed 'data' from dependencies

  useEffect(() => {
    const subscription = watch((value) => {
      // Always update store if we have a value. The isDirty check was causing 
      // the first change to be lost because isDirty updates after the first watch trigger.
      if (value) {
        updateNodeData(nodeId, value as Partial<StartNodeData>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-1">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Workflow Title</label>
        <input
          {...register('title')}
          className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
          placeholder="Enter workflow title..."
        />
        {errors.title && <p className="text-[10px] text-accent-red mt-1">{errors.title.message}</p>}
      </div>

      <KeyValueEditor name="metadata" control={control as any} label="Metadata" />
    </div>
  );
};

export default StartNodeForm;
