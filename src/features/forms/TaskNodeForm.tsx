import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useWorkflowStore } from '@/store';
import { type TaskNodeData, NodeType } from '@/types';
import KeyValueEditor from './components/KeyValueEditor';

const taskNodeSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NodeType),
  label: z.string(),
  configured: z.boolean(),
  hasError: z.boolean().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string(),
  assignee: z.string().min(1, 'Assignee is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  customFields: z.array(z.object({
    key: z.string().min(1, 'Key required'),
    value: z.string().min(1, 'Value required'),
  })),
});

interface TaskNodeFormProps {
  nodeId: string;
  data: TaskNodeData;
}

const TaskNodeForm: React.FC<TaskNodeFormProps> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const { register, control, watch, reset, formState: { errors } } = useForm<TaskNodeData>({
    resolver: zodResolver(taskNodeSchema),
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
        updateNodeData(nodeId, value as Partial<TaskNodeData>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-1">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Task Title</label>
        <input
          {...register('title')}
          className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
          placeholder="Task title..."
        />
        {errors.title && <p className="text-[10px] text-accent-red mt-1">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Description</label>
        <textarea
          {...register('description')}
          className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors min-h-[80px]"
          placeholder="Enter task description..."
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Assignee</label>
        <input
          {...register('assignee')}
          className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
          placeholder="Enter assignee name..."
        />
        {errors.assignee && <p className="text-[10px] text-accent-red mt-1">{errors.assignee.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Due Date</label>
        <input
          type="date"
          {...register('dueDate')}
          className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
        />
        {errors.dueDate && <p className="text-[10px] text-accent-red mt-1">{errors.dueDate.message}</p>}
      </div>

      <KeyValueEditor name="customFields" control={control as any} label="Custom Fields" />
    </div>
  );
};

export default TaskNodeForm;
