import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useWorkflowStore } from '@/store';
import { type MetricNodeData, NodeType } from '@/types';

const metricNodeSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NodeType),
  label: z.string(),
  configured: z.boolean(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  aggregation: z.string().min(1, 'Aggregation required'),
  periods: z.array(z.object({
    label: z.string().min(1, 'Label required'),
    value: z.string().min(1, 'Value required'),
    change: z.number(),
    trend: z.enum(['up', 'down', 'neutral']),
  })),
  goal: z.object({
    text: z.string(),
    progress: z.number(),
  }).optional(),
});

interface MetricNodeFormProps {
  nodeId: string;
  data: MetricNodeData;
}

const MetricNodeForm: React.FC<MetricNodeFormProps> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const runPerformanceSimulation = useWorkflowStore((state) => state.runPerformanceSimulation);
  
  const { register, control, watch, reset, formState: { errors } } = useForm<MetricNodeData>({
    resolver: zodResolver(metricNodeSchema),
    defaultValues: data,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "periods"
  });

  useEffect(() => {
    reset(data);
  }, [nodeId, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        updateNodeData(nodeId, value as Partial<MetricNodeData>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-1">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Metric Name</label>
        <input
          {...register('name')}
          className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
          placeholder="Metric name..."
        />
        {errors.name && <p className="text-[10px] text-accent-red mt-1">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Aggregation</label>
        <select
          {...register('aggregation')}
          className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
        >
          <option value="Sum">Sum</option>
          <option value="Average">Average</option>
          <option value="Amount increased">Amount increased</option>
          <option value="Percentage">Percentage</option>
        </select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Periods</label>
          <button
            type="button"
            onClick={() => append({ label: 'New Period', value: '0', change: 0, trend: 'neutral' })}
            className="text-[10px] bg-accent-blue/10 text-accent-blue px-2 py-1 rounded hover:bg-accent-blue/20 transition-colors"
          >
            + Add Period
          </button>
        </div>
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {fields.map((field, index) => (
            <div key={field.id} className="p-2 border border-border-default rounded bg-background-primary/50 space-y-2">
              <div className="flex justify-between items-center">
                <input
                  {...register(`periods.${index}.label` as const)}
                  className="bg-transparent text-[10px] font-bold text-text-muted uppercase focus:outline-none w-full"
                  placeholder="Period Label"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-accent-red opacity-50 hover:opacity-100"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  {...register(`periods.${index}.value` as const)}
                  className="bg-background-primary border border-border-default rounded px-2 py-1 text-xs text-text-primary"
                  placeholder="Value"
                />
                <div className="flex gap-1">
                  <input
                    type="number"
                    step="0.01"
                    {...register(`periods.${index}.change` as const, { valueAsNumber: true })}
                    className="bg-background-primary border border-border-default rounded px-2 py-1 text-xs text-text-primary w-full"
                    placeholder="%"
                  />
                  <select
                    {...register(`periods.${index}.trend` as const)}
                    className="bg-background-primary border border-border-default rounded px-1 py-1 text-[10px] text-text-primary"
                  >
                    <option value="up">↑</option>
                    <option value="down">↓</option>
                    <option value="neutral">-</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border-default space-y-3">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">What-If Simulation</label>
        <div className="p-3 bg-accent-blue/5 rounded-lg border border-accent-blue/20 space-y-3">
          <p className="text-[10px] text-text-muted italic">
            Simulate a percentage change in this metric and see how it correlates downstream.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => runPerformanceSimulation(nodeId, 5)}
              className="flex-1 bg-accent-green/20 text-accent-green text-[10px] font-bold py-1.5 rounded hover:bg-accent-green/30 transition-all"
            >
              +5% Impact
            </button>
            <button
              type="button"
              onClick={() => runPerformanceSimulation(nodeId, -5)}
              className="flex-1 bg-accent-red/20 text-accent-red text-[10px] font-bold py-1.5 rounded hover:bg-accent-red/30 transition-all"
            >
              -5% Impact
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border-default space-y-3">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Goal (Optional)</label>
        <div className="space-y-2">
          <input
            {...register('goal.text')}
            className="w-full bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
            placeholder="Goal description..."
          />
          <div className="flex items-center gap-3">
            <input
              type="number"
              {...register('goal.progress', { valueAsNumber: true })}
              className="w-20 bg-background-primary border border-border-default rounded px-3 py-2 text-sm text-text-primary focus:border-accent-blue outline-none transition-colors"
            />
            <span className="text-xs text-text-muted">% complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricNodeForm;
