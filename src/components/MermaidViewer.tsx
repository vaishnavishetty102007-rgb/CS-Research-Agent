import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  Code2, 
  Layers, 
  Info,
  AlertCircle
} from 'lucide-react';
import { NodeExplanation } from '../data/samplePapers';

interface MermaidViewerProps {
  chart: string;
  nodeExplanations?: NodeExplanation[];
  paperTitle?: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ 
  chart, 
  nodeExplanations = [],
  paperTitle = 'System Architecture'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'diagram' | 'code' | 'nodes'>('diagram');
  const [selectedNode, setSelectedNode] = useState<NodeExplanation | null>(null);

  // Initialize mermaid configuration
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif',
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        useMaxWidth: false,
      },
    });
  }, []);

  // Render chart
  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      if (!chart) return;
      try {
        setRenderError(null);
        // Ensure clean syntax
        let cleanChart = chart.trim();
        if (!cleanChart.startsWith('graph ') && !cleanChart.startsWith('flowchart ')) {
          cleanChart = `graph TD\n${cleanChart}`;
        }
        
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, cleanChart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setRenderError(err.message || 'Syntax error in Mermaid flowchart definition.');
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  const handleCopyCode = async () => {
    try {
      const formattedOutput = `[FLOWCHART]\n${chart}`;
      await navigator.clipboard.writeText(formattedOutput);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${paperTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_architecture.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.5));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.4));
  const resetZoom = () => setZoom(1);

  return (
    <div className={`flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl bg-slate-950' : 'relative'
    }`}>
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90 gap-2">
        <div className="flex items-center space-x-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-medium">
            <Layers className="w-3.5 h-3.5" />
            <span>Mermaid.js (graph TD)</span>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            [FLOWCHART] Spec Compliant
          </span>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
              activeTab === 'diagram'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Flowchart SVG
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all flex items-center gap-1 ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>Mermaid Code</span>
          </button>
          {nodeExplanations.length > 0 && (
            <button
              onClick={() => setActiveTab('nodes')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-all flex items-center gap-1 ${
                activeTab === 'nodes'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Info className="w-3 h-3" />
              <span>Components ({nodeExplanations.length})</span>
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          {activeTab === 'diagram' && (
            <>
              <button
                onClick={zoomOut}
                title="Zoom Out"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-400 font-mono min-w-10 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={zoomIn}
                title="Zoom In"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={resetZoom}
                title="Reset Zoom"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-slate-800 mx-1" />
              <button
                onClick={handleDownloadSvg}
                title="Download Flowchart SVG"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={handleCopyCode}
            title="Copy [FLOWCHART] text segment"
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Canvas / Content */}
      <div 
        ref={containerRef}
        className="relative flex-1 min-h-[360px] max-h-[640px] overflow-auto p-4 flex items-center justify-center bg-slate-950/70"
      >
        {activeTab === 'diagram' && (
          <>
            {renderError ? (
              <div className="flex flex-col items-center justify-center p-6 text-center max-w-md">
                <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
                <h4 className="text-sm font-semibold text-slate-200 mb-1">Mermaid Syntax Warning</h4>
                <p className="text-xs text-slate-400 mb-3">{renderError}</p>
                <div className="w-full bg-slate-900 border border-slate-800 rounded p-3 text-left font-mono text-xs text-slate-300 overflow-x-auto">
                  {chart}
                </div>
              </div>
            ) : svgContent ? (
              <div
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                className="transition-transform duration-150 ease-out inline-block max-w-none [&_svg]:max-w-none [&_svg]:h-auto [&_svg]:drop-shadow-lg"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : (
              <div className="flex items-center space-x-2 text-slate-400 text-sm font-mono">
                <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span>Compiling Architectural Flowchart...</span>
              </div>
            )}
          </>
        )}

        {activeTab === 'code' && (
          <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-2 text-xs text-slate-400 font-mono">
              <span>Labeled Flowchart String Format:</span>
              <span className="text-emerald-400">Pure text segment (No markdown backticks inside Mermaid)</span>
            </div>
            <pre className="w-full flex-1 p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-indigo-300 overflow-auto whitespace-pre leading-relaxed select-all">
{`[FLOWCHART]
${chart}`}
            </pre>
          </div>
        )}

        {activeTab === 'nodes' && (
          <div className="w-full h-full overflow-y-auto max-w-3xl py-2">
            <h4 className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-400 mb-3">
              Architectural Components & Layer Descriptions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {nodeExplanations.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedNode(item)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedNode?.node === item.node
                      ? 'bg-indigo-950/60 border-indigo-500/60 ring-1 ring-indigo-500'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-semibold text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/10">
                      {item.node}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Layer {idx + 1}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Architectural Legend */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-mono text-slate-400">Flowchart Flow:</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Data Input
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" /> Core Layers
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Transformations
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Output / Loss
          </span>
        </div>
        <div className="font-mono text-slate-400 text-[10px]">
          graph TD • Interactive Zoom Enabled
        </div>
      </div>
    </div>
  );
};
