import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  GraduationCap, 
  Terminal, 
  BookOpen, 
  Lightbulb, 
  Check, 
  Copy,
  Cpu
} from 'lucide-react';
import { StudentProject } from '../data/samplePapers';

interface AdvisorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperTitle: string;
  paperSummary: string;
  selectedProject?: StudentProject | null;
}

interface Message {
  role: 'user' | 'agent';
  content: string;
}

export const AdvisorChatModal: React.FC<AdvisorChatModalProps> = ({
  isOpen,
  onClose,
  paperTitle,
  paperSummary,
  selectedProject,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'agent',
      content: selectedProject 
        ? `Hello! I'm your CS Research & Systems Advisor. You're looking into project: "${selectedProject.title}".\n\nI can scaffold starter PyTorch code, recommend evaluation datasets, or map out a week-by-week implementation plan. What would you like to build first?`
        : `Hello! I'm your CS Research & Systems Advisor. How can I help you understand "${paperTitle}" or implement extensions for your resume?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const quickPrompts = selectedProject ? [
    `Give me starter PyTorch code for ${selectedProject.title}`,
    `How do I measure "${selectedProject.targetedPerformanceMetric}"?`,
    `What are the most common debugging pitfalls for this project?`,
    `What benchmark dataset is easiest to download and run?`,
  ] : [
    `Explain the mathematical intuition in simple terms`,
    `What GPU or hardware do I need to reproduce this?`,
    `How does this compare to standard Transformers?`,
    `Suggest 3 interview questions recruiters might ask about this paper`,
  ];

  const handleSend = async (textToSend?: string) => {
    const question = textToSend || input.trim();
    if (!question || isLoading) return;

    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: question }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          paperTitle,
          paperSummary,
          projectContext: selectedProject ? JSON.stringify(selectedProject) : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setMessages([...newMessages, { role: 'agent', content: data.answer }]);
      } else {
        setMessages([
          ...newMessages,
          { role: 'agent', content: data.error || 'Failed to retrieve response from the advisor.' },
        ]);
      }
    } catch (err: any) {
      setMessages([
        ...newMessages,
        { role: 'agent', content: `Error: ${err.message || 'Network connection failed.'}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[640px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                CS Research & Implementation Advisor
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Online
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono truncate max-w-sm sm:max-w-md">
                Focus: {selectedProject ? selectedProject.title : paperTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400 font-mono">
                {msg.role === 'user' ? (
                  <span>You (Student)</span>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>CS Research Advisor</span>
                  </>
                )}
              </div>
              <div
                className={`relative group max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white font-sans'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 font-sans'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.role === 'agent' && (
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-white bg-slate-900 rounded border border-slate-700"
                    title="Copy Answer"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono py-2">
              <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Advisor is drafting technical solution...</span>
            </div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickPrompts.map((prompt, qIdx) => (
            <button
              key={qIdx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-mono whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3 text-amber-400" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about PyTorch code, metric measurement, mathematical proofs..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
