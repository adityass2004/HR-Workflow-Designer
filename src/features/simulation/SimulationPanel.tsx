import React, { useState } from 'react';
import { useWorkflowStore } from '@/store';
import { useSimulation } from '@/hooks/useSimulation';
import { useValidation } from '@/hooks/useValidation';

const SimulationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { run, isRunning, result } = useSimulation();
  const { valid } = useValidation();
  const setSimulationResult = useWorkflowStore((state) => state.setSimulationResult);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <span className="text-accent-green">✓</span>;
      case 'pending': return <span className="text-accent-amber">⏳</span>;
      case 'failed': return <span className="text-accent-red">✗</span>;
      case 'skipped': return <span className="text-text-muted">↷</span>;
      default: return null;
    }
  };

  return (
    <div className={`
      bg-background-surface/95 backdrop-blur-xl border-t border-border-default transition-all duration-500 z-40 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.2)] shrink-0
      ${isOpen ? 'h-[450px]' : 'h-12'}
    `}>
      {/* Panel Header */}
      <div 
        className="flex items-center justify-between px-6 py-2 border-b border-border-default h-12 shrink-0 cursor-pointer hover:bg-background-primary/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <h2 className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">Workflow Intelligence</h2>
          </div>
          {result && (
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
              result.overallStatus === 'passed' ? 'bg-accent-green text-white' : 'bg-accent-red text-white'
            }`}>
              {result.overallStatus === 'passed' ? '✓ Integrity Verified' : '✗ Issues Detected'}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {result && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSimulationResult(null);
              }}
              className="text-[10px] font-bold text-text-muted hover:text-accent-red transition-all px-3 py-1 rounded-lg hover:bg-accent-red/10"
            >
              Reset Simulation
            </button>
          )}
          <div className={`text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            ▲
          </div>
        </div>
      </div>

      {/* Panel Content */}
      <div className={`flex-1 flex flex-col min-h-0 ${!isOpen ? 'hidden' : ''}`}>
        <div className="p-6 flex gap-8 items-stretch h-full overflow-hidden">
          {/* Controls & Summary */}
          <div className="w-64 flex flex-col gap-6 shrink-0">
            <div className="p-5 bg-background-primary/50 rounded-2xl border border-border-default/50 space-y-4">
              <button
                onClick={run}
                disabled={!valid || isRunning}
                className={`
                  w-full py-3 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all
                  ${!valid || isRunning 
                    ? 'bg-border-default text-text-muted cursor-not-allowed opacity-50' 
                    : 'bg-accent-blue text-white hover:bg-accent-blue/90 shadow-xl shadow-accent-blue/20 active:scale-95'}
                `}
              >
                {isRunning ? 'Processing...' : 'Run Simulation'}
              </button>
              
              {!valid && (
                <div className="flex items-start gap-2 p-3 bg-accent-red/5 rounded-lg border border-accent-red/10">
                  <span className="text-xs">⚠️</span>
                  <p className="text-[10px] text-accent-red font-bold leading-tight uppercase tracking-tight">
                    Graph Invalid: Please resolve validation errors before simulating.
                  </p>
                </div>
              )}

              {isRunning && (
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-background-primary rounded-full overflow-hidden border border-border-default/30">
                    <div className="h-full bg-accent-blue animate-progress origin-left w-full shadow-[0_0_10px_rgba(79,142,247,0.5)]" />
                  </div>
                  <p className="text-[10px] font-black text-accent-blue uppercase tracking-widest text-center animate-pulse">Computing Path...</p>
                </div>
              )}
            </div>

            {result && (
              <div className="p-5 bg-background-primary/30 rounded-2xl border border-border-default/50 flex-1 flex flex-col justify-center text-center space-y-2">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Execution Summary</p>
                <div className="text-3xl font-black text-text-primary tracking-tighter">
                  {result.steps.length} <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Steps</span>
                </div>
                <p className="text-[10px] font-bold text-accent-green uppercase tracking-tighter">100% Successful Coverage</p>
              </div>
            )}
          </div>

          {/* Timeline Results */}
          <div className="flex-1 overflow-y-auto bg-background-primary/20 rounded-2xl border border-border-default/50 p-4 space-y-2 custom-scrollbar">
            {!result && !isRunning && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                <div className="w-16 h-16 rounded-full bg-background-surface flex items-center justify-center text-3xl shadow-inner border border-border-default/50">
                  🧬
                </div>
                <div>
                  <p className="text-xs font-black text-text-primary uppercase tracking-widest">Awaiting Simulation</p>
                  <p className="text-[10px] text-text-muted mt-2 font-medium max-w-[200px]">Connect your metrics and click "Run Simulation" to calculate the performance path.</p>
                </div>
              </div>
            )}
            
            {result?.steps.map((step, i) => (
              <div key={i} className="group flex items-center gap-4 px-5 py-3.5 rounded-xl bg-background-surface/50 border border-border-default/30 hover:border-accent-blue/30 hover:bg-background-surface transition-all duration-300 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-background-primary flex items-center justify-center text-sm shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                  {getStatusIcon(step.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black text-text-primary uppercase tracking-tight truncate">{step.nodeLabel}</p>
                    <span className="w-1 h-1 rounded-full bg-border-default" />
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                      step.status === 'success' ? 'text-accent-green' : 'text-accent-red'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                  {step.message ? (
                    <p className="text-[10px] text-text-muted font-medium mt-0.5 truncate italic">{step.message}</p>
                  ) : (
                    <p className="text-[10px] text-accent-blue font-bold mt-0.5 uppercase tracking-tighter">Data node processed</p>
                  )}
                </div>
                <div className="text-[10px] font-black text-text-muted/20 group-hover:text-text-muted/50 transition-colors">
                  #{String(i + 1).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 0.6s ease-in-out;
        }
      `}} />
    </div>
  );
};

export default SimulationPanel;
