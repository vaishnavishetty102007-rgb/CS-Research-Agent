import React, { useState } from 'react';
import { 
  Briefcase, 
  Cpu, 
  Gauge, 
  Terminal, 
  ChevronRight, 
  Calendar, 
  Database, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles,
  HelpCircle,
  FolderGit2
} from 'lucide-react';
import { StudentProject } from '../data/samplePapers';

interface StudentProjectsViewProps {
  projects: StudentProject[];
  paperTitle: string;
  onAskAboutProject?: (project: StudentProject) => void;
}

export const StudentProjectsView: React.FC<StudentProjectsViewProps> = ({ 
  projects, 
  paperTitle,
  onAskAboutProject 
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(projects[0]?.id || 1);

  const handleCopyResumeBullet = async (id: number, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              3. Future Work & Internship / Resume Projects
              <span className="text-[11px] font-normal text-slate-400 font-mono">
                (Tailored for 3rd-Year CS Students)
              </span>
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            3 Concrete Extension Proposals
          </span>
        </div>
      </div>

      {/* Projects List */}
      <div className="p-5 space-y-4">
        {projects.map((project, index) => {
          const isExpanded = expandedId === project.id;
          return (
            <div 
              key={project.id || index}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded 
                  ? 'bg-slate-950/80 border-indigo-500/40 ring-1 ring-indigo-500/20 shadow-xl' 
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Project Card Header */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : project.id)}
                className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-mono font-bold text-xs mt-0.5">
                    0{index + 1}
                  </span>
                  <div>
                    <h4 className="text-base font-semibold text-slate-100 flex items-center gap-2 flex-wrap">
                      {project.title}
                      <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {project.difficulty}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        ~{project.estimatedWeeks} Weeks Timeline
                      </span>
                      {project.benchmarkDataset && (
                        <span className="flex items-center gap-1 font-mono hidden md:flex">
                          <Database className="w-3 h-3 text-slate-400" />
                          {project.benchmarkDataset}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskAboutProject?.(project);
                    }}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Scaffold Project</span>
                  </button>
                  <div className={`p-1 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Expanded Project Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4">
                  {/* The 3 Core Requirements: Extension, Metric, Tech Stack */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
                    {/* 1. Exact Extension */}
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-sky-400 mb-2">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>THE EXACT EXTENSION</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">
                        "{project.exactExtension}"
                      </p>
                    </div>

                    {/* 2. Targeted Performance Metric */}
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-emerald-400 mb-2">
                        <Gauge className="w-3.5 h-3.5" />
                        <span>TARGETED PERFORMANCE METRIC</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">
                        {project.targetedPerformanceMetric}
                      </p>
                    </div>

                    {/* 3. Recommended Tech Stack */}
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-purple-400 mb-2">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>RECOMMENDED TECH STACK</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {Array.isArray(project.recommendedTechStack) ? (
                          project.recommendedTechStack.map((tech, tIdx) => (
                            <span 
                              key={tIdx}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20"
                            >
                              {tech}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs font-mono text-purple-300">{project.recommendedTechStack}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resume Ready Bullet Point */}
                  <div className="p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-semibold text-indigo-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Resume Bullet Point (Google XYZ Formula)
                      </span>
                      <button
                        onClick={() => handleCopyResumeBullet(project.id, project.resumeBulletPoint)}
                        className="flex items-center gap-1 text-[11px] font-mono text-indigo-300 hover:text-white px-2 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/30 transition-colors"
                      >
                        {copiedId === project.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy for Resume</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 font-mono italic bg-slate-900/60 p-2.5 rounded border border-indigo-500/20">
                      • {project.resumeBulletPoint}
                    </p>
                  </div>

                  {/* Implementation Steps Roadmap */}
                  {project.implementationSteps && project.implementationSteps.length > 0 && (
                    <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800">
                      <h5 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                        Student Implementation Blueprint (Milestones)
                      </h5>
                      <div className="space-y-2">
                        {project.implementationSteps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80 flex-shrink-0 mt-0.5" />
                            <span><strong className="text-slate-200 font-mono">Week {sIdx + 1}:</strong> {step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
