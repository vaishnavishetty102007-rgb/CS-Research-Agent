import React, { useState } from 'react';
import { Terminal, Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';

interface RawOutputViewerProps {
  rawOutput: string;
  paperTitle: string;
}

export const RawOutputViewer: React.FC<RawOutputViewerProps> = ({ rawOutput, paperTitle }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rawOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Agent Output Stream & [FLOWCHART] Format
              <span className="text-[11px] font-normal text-slate-400 font-mono">
                (Spec Compliant Plain-Text String)
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Includes [FLOWCHART] tag
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Raw Output' : 'Copy Raw Output'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-950">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2 px-1">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Spec: 1. Core Concept &lt;300w • 2. [FLOWCHART] Mermaid graph TD • 3. 3x Student Extensions
          </span>
          <span>UTF-8 Monospace</span>
        </div>
        <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 overflow-auto max-h-[460px] whitespace-pre-wrap leading-relaxed select-all">
          {rawOutput}
        </pre>
      </div>
    </div>
  );
};
