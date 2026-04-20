import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useWorkflowStore } from '@/store';
import { type ApprovalNodeData, NodeType } from '@/types';

const approvalNodeSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NodeType),
  label: z.string(),
  configured: z.boolean(),
  hasError: z.boolean().optional(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  approverRole: z.string().min(1, 'Approver role is required'),
  autoApproveThreshold: z.number().min(0).max(100),
});

interface ApprovalNodeFormProps {
  nodeId: string;
  data: ApprovalNodeData;
}

const ApprovalNodeForm: React.FC<ApprovalNodeFormProps> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const { register, watch, reset, formState: { errors } } = useForm<ApprovalNodeData>({
    resolver: zodResolver(approvalNodeSchema),
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
        updateNodeData(nodeId, value as Partial<ApprovalNodeData>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-1">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Approval Title</label>
        <input
          {...register('title')}
          className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
          placeholder="Approval title..."
        />
        {errors.title && <p className="text-[10px] text-accent-red mt-1">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Approver Role</label>
        <input
          {...register('approverRole')}
          className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
          placeholder="e.g. HR Manager, Team Lead..."
        />
        {errors.approverRole && <p className="text-[10px] text-accent-red mt-1">{errors.approverRole.message}</p>}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Auto-Approve Threshold (%)</label>
          <span className="text-xs font-mono text-accent-blue">{watch('autoApproveThreshold')}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          {...register('autoApproveThreshold', { valueAsNumber: true })}
          className="w-full h-1.5 bg-background-primary border-none rounded-lg appearance-none cursor-pointer accent-accent-blue"
        />
        <p className="text-[10px] text-text-muted italic">Automatically approve if score is above this value.</p>
      </div>
    </div>
  );
};

export default ApprovalNodeForm;
