import React, { useState } from 'react';
import { 
  BookOpen, 
  Brain, 
  Binary, 
  Copy, 
  Check, 
  Target, 
  Sparkles,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { CoreConcept } from '../data/samplePapers';

interface CoreConceptViewProps {
  concept: CoreConcept;
  paperTitle: string;
}

export const CoreConceptView: React.FC<CoreConceptViewProps> = ({ concept, paperTitle }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'structured' | 'summary'>('structured');

  // Calculate total word count
  const allText = `${concept.problemStatement} ${concept.primaryMethodology} ${concept.mathematicalAlgorithmicBreakthroughs} ${concept.accessibleSummary}`;
  const words = allText.trim().split(/\s+/).filter(Boolean).length;
  const wordLimit = 300;
  const isWithinLimit = words <= wordLimit;

  const handleCopy = async () => {
    const textToCopy = `CORE CONCEPT EXTRACTION: ${paperTitle}
Problem Statement:
${concept.problemStatement}

Primary Methodology:
${concept.primaryMethodology}

Mathematical/Algorithmic Breakthroughs:
${concept.mathematicalAlgorithmicBreakthroughs}

Accessible Summary:
${concept.accessibleSummary}`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 gap-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              1. Core Concept Extraction
              <span className="text-[11px] font-normal text-slate-400 font-mono">
                (Under 300 Words Constraint)
              </span>
            </h3>
          </div>
        </div>

        {/* Word count compliance badge & Controls */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
            isWithinLimit 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            {isWithinLimit ? (
              <FileCheck2 className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span>{words} / {wordLimit} words</span>
            <span className="text-[10px] opacity-75">
              {isWithinLimit ? '(Compliant ✓)' : '(Needs trimming)'}
            </span>
          </div>

          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('structured')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                activeTab === 'structured' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Breakdown
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                activeTab === 'summary' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Plain Summary
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700/60"
            title="Copy Core Concept Summary"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {activeTab === 'structured' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Problem Statement */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2.5">
                  <div className="w-6 h-6 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-300 font-mono">
                    Problem Statement
                  </h4>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {concept.problemStatement}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Challenge Targeted</span>
                <span className="text-rose-400/80">Bottleneck</span>
              </div>
            </div>

            {/* Card 2: Primary Methodology */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2.5">
                  <div className="w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono">
                    Primary Methodology
                  </h4>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {concept.primaryMethodology}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Proposed Novelty</span>
                <span className="text-indigo-400/80">Architecture</span>
              </div>
            </div>

            {/* Card 3: Key Mathematical & Algorithmic Breakthroughs */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2.5">
                  <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Binary className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-300 font-mono">
                    Mathematical Breakthroughs
                  </h4>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {concept.mathematicalAlgorithmicBreakthroughs}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Formal Complexity</span>
                <span className="text-cyan-400/80">Equations & Proof</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 leading-relaxed">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-300">
                Accessible Executive Summary (CS Student & Recruiter Friendly)
              </h4>
            </div>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-serif tracking-wide">
              {concept.accessibleSummary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
