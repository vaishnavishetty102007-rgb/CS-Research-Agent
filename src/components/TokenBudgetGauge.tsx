import React from 'react';
import { ShieldCheck, Zap, AlertCircle, Info, Database } from 'lucide-react';
import { TokenMetrics } from '../data/samplePapers';

interface TokenBudgetGaugeProps {
  metrics: TokenMetrics;
}

export const TokenBudgetGauge: React.FC<TokenBudgetGaugeProps> = ({ metrics }) => {
  const percentage = Math.min(100, Math.round((metrics.totalTokens / metrics.budgetLimit) * 100));

  const isOptimal = metrics.totalTokens < 10000;
  const isEfficient = metrics.totalTokens < 20000;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded bg-indigo-500/10 text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-slate-200">
                Agent Token Budget Guard
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isOptimal 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : isEfficient
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {isOptimal ? 'OPTIMAL EFFICIENCY' : isEfficient ? 'EFFICIENT' : 'NEAR THRESHOLD'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Strict constraint: Analysis & search execution well under 25,000 tokens
            </p>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-xs font-bold text-slate-100">
            {metrics.totalTokens.toLocaleString()} / {metrics.budgetLimit.toLocaleString()} tokens
          </div>
          <div className="text-[10px] text-slate-400">
            {percentage}% of 25k budget used
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 mb-2.5">
        <div 
          className={`h-full transition-all duration-500 ${
            isOptimal ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
            isEfficient ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' :
            'bg-gradient-to-r from-amber-500 to-rose-400'
          }`}
          style={{ width: `${Math.max(percentage, 5)}%` }}
        />
      </div>

      {/* Breakdown chips */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
            Prompt Ingestion: <strong className="text-slate-300">{metrics.promptTokens.toLocaleString()}</strong>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Agent Generation: <strong className="text-slate-300">{metrics.candidateTokens.toLocaleString()}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-400">
          <Zap className="w-3 h-3" />
          <span>{(25000 - metrics.totalTokens).toLocaleString()} tokens headroom remaining</span>
        </div>
      </div>
    </div>
  );
};
