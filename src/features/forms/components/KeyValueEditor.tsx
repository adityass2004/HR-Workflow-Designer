import React from 'react';
import { useFieldArray, type Control } from 'react-hook-form';

interface KeyValueEditorProps {
  name: string;
  control: Control<any>;
  label: string;
}

const KeyValueEditor: React.FC<KeyValueEditorProps> = ({ name, control, label }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{label}</label>
        <button
          type="button"
          onClick={() => append({ key: '', value: '' })}
          className="text-[10px] bg-accent-blue/10 text-accent-blue px-2 py-1 rounded hover:bg-accent-blue/20 transition-colors"
        >
          + Add
        </button>
      </div>
      
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1">
              <input
                {...control.register(`${name}.${index}.key` as const)}
                placeholder="Key"
                className="w-full bg-background-primary border border-border-default rounded px-2 py-1 text-xs text-text-primary focus:border-accent-blue outline-none"
              />
            </div>
            <div className="flex-1 space-y-1">
              <input
                {...control.register(`${name}.${index}.value` as const)}
                placeholder="Value"
                className="w-full bg-background-primary border border-border-default rounded px-2 py-1 text-xs text-text-primary focus:border-accent-blue outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-text-muted hover:text-accent-red p-1 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
        {fields.length === 0 && (
          <div className="text-[10px] text-text-muted italic py-2 text-center border border-dashed border-border-default rounded">
            No items added
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyValueEditor;
