import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  X,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { Track, DoubtSolution } from '../../types';
import { useTrack } from '../../context/TrackContext';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';
import { solveAcademicDoubt } from '../../services/aiService';

interface DoubtSolverProps {
  isOpen?: boolean;
  onClose?: () => void;
  onAwardXP?: (amount: number) => void;
}

const SAMPLE_PROMPTS_BY_TRACK: Record<string, string[]> = {
  engineering: [
    "Find the maximum sum subarray with O(n) time and O(1) auxiliary space (Kadane's Algorithm).",
    "Explain Byzantine Fault Tolerance in distributed consensus systems.",
    "Derive the time complexity of building a Binary Heap from an unordered array.",
  ],
  commerce: [
    "Calculate deferred tax liability under Ind AS 12 for temporary depreciation differences.",
    "Explain the DuPont 5-point ROE decomposition with an operational example.",
    "Derive Weighted Average Cost of Capital (WACC) with market-value weights.",
  ],
  medical: [
    "A 45yo patient presents with metabolic acidosis and elevated anion gap of 24 mEq/L. Differentiate causes.",
    "Explain the cardiac action potential phases and the ion channels involved in Phase 0 vs Phase 2.",
    "Describe the pharmacological mechanism of SGLT-2 inhibitors in heart failure.",
  ],
  law: [
    "Explain the exceptions to the rule against hearsay evidence under Bharatiya Sakshya Adhiniyam.",
    "Analyze the Doctrine of Severability under Article 13 of the Constitution of India.",
    "Distinguish between Mens Rea in culpable homicide vs murder under Section 100/101 BNS.",
  ],
  competitive_exams: [
    "Analyze the fiscal federalism implications of 16th Finance Commission terms of reference.",
    "Explain the monetary transmission mechanism in India under the flexible inflation targeting framework.",
    "Evaluate the ecological impacts of Western Ghats eco-sensitive zone demarcation.",
  ],
  humanities: [
    "Critically assess Max Weber's Protestant Ethic and the Spirit of Capitalism thesis.",
    "Explain the structuralist linguistics theory of Ferdinand de Saussure (signifier vs signified).",
    "Analyze the historiographical debate surrounding the Subaltern Studies collective.",
  ],
  other: [
    "Deconstruct first-principles problem solving for complex interdisciplinary systems.",
    "Derive the optimal decision boundary using statistical hypothesis testing.",
  ],
};

export const DoubtSolverModal: React.FC<DoubtSolverProps> = ({
  isOpen,
  onClose,
  onAwardXP,
}) => {
  const { track, trackMeta, config } = useTrack();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const samplePrompts = SAMPLE_PROMPTS_BY_TRACK[track] || SAMPLE_PROMPTS_BY_TRACK.engineering;

  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState(config.subjects[0]?.name || 'Core Subject');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<DoubtSolution | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error('File Too Large', { description: 'Please upload an image under 4MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result);
      soundFx.playSuccess();
      toast.success('Question Snapshot Attached', { description: 'Image will be analyzed by Gemini Vision.' });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() && !imageBase64) {
      toast.error('Empty Submission', { description: 'Please enter a problem statement or upload an image.' });
      return;
    }

    setLoading(true);
    soundFx.playClick();

    try {
      const newSolution = await solveAcademicDoubt({
        question: question.trim(),
        imageBase64: imageBase64 || undefined,
        track,
        subject,
      });

      if (imagePreview) {
        newSolution.imageUrl = imagePreview;
      }

      setSolution(newSolution);
      onAwardXP?.(20);
      soundFx.playLevelUp();
      toast.success('🎉 Doubt Solved Step-by-Step!', {
        description: '+20 XP gained. Analytical resolution generated.',
      });
    } catch (err) {
      console.error(err);
      toast.error('Resolution Error', { description: 'Generating offline analytical breakdown.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopySolution = () => {
    if (!solution) return;
    const text = `Problem: ${solution.question}\nConcept: ${solution.conceptIdentified}\nSubject: ${solution.subject}\n\nKey Rules:\n${solution.keyRulesOrFormulas.map((r) => `• ${r}`).join('\n')}\n\nSteps:\n${solution.steps.map((s) => `${s.stepNumber}. ${s.title}: ${s.explanation}`).join('\n')}\n\nCommon Traps:\n${solution.commonTraps.map((t) => `! ${t}`).join('\n')}\n\nFinal Answer: ${solution.finalAnswer}`;
    navigator.clipboard.writeText(text);
    soundFx.playClick();
    toast.info('Solution Copied to Clipboard');
  };

  const content = (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="eyebrow-badge">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>MULTIMODAL AI PROBLEM RESOLVER</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                AI Deep Doubt Solver ({config.name})
              </h2>
              <p className="text-xs text-slate-400">
                Submit formulas, exam problems, diagram snapshots, or case studies for instant step-by-step deconstruction.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${trackMeta.bgSubtle} ${trackMeta.color} border ${trackMeta.borderAccent}`}>
                {trackMeta.shortLabel} Vertical
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Solver Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form & Sample Prompts */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bezel-shell p-6 bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>Submit Problem or Upload Snapshot</span>
            </h3>

            {/* Form */}
            <form onSubmit={handleSolve} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                    Subject Module
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {config.subjects.map((sub, i) => (
                      <option key={i} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                    Question Snapshot
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-dashed border-slate-700 text-xs text-slate-300 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{imagePreview ? 'Replace Image' : 'Attach Diagram'}</span>
                  </button>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative inline-block border border-indigo-500/30 rounded-2xl overflow-hidden bg-slate-950 p-1.5">
                  <img src={imagePreview} alt="Question Snapshot" className="h-28 object-contain rounded-xl" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2.5 right-2.5 p-1 rounded-full bg-slate-900/90 text-rose-400 hover:bg-rose-500 hover:text-white transition shadow-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                  Problem Description / Question Prompt
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={`Type or paste your ${config.name} question...`}
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deconstructing Problem with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    <span>Deconstruct & Solve Problem (+20 XP)</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Preset Sample Problems */}
          <div className="bezel-shell p-4 bg-slate-900/60 border border-slate-800 space-y-2.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
              Sample High-Yield Problems ({config.name}):
            </span>
            <div className="space-y-1.5">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(p);
                    soundFx.playClick();
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-indigo-950/40 border border-slate-800/80 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white transition flex items-center justify-between group"
                >
                  <span className="truncate mr-2 font-medium">{p}</span>
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Resolution Output */}
        <div className="lg:col-span-6">
          {solution ? (
            <div className="bezel-shell p-6 bg-slate-900 border border-indigo-500/30 space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase">
                    Identified Core Concept
                  </span>
                  <h4 className="text-base font-bold text-white mt-1.5 font-display">{solution.conceptIdentified}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Subject: {solution.subject} • {config.name}</p>
                </div>
                <button
                  onClick={handleCopySolution}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>

              {/* Key Rules & Formulas */}
              {solution.keyRulesOrFormulas.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">Governing Rules & Formulas</span>
                  <div className="flex flex-wrap gap-2">
                    {solution.keyRulesOrFormulas.map((rule, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-indigo-300 font-mono">
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Step-by-Step Derivation */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">Step-by-Step Resolution Walkthrough</span>
                <div className="space-y-2.5">
                  {solution.steps.map((step) => (
                    <div key={step.stepNumber} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 font-mono">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[11px] text-indigo-300">
                          {step.stepNumber}
                        </span>
                        <span>{step.title}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pl-7">{step.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Traps */}
              {solution.commonTraps.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Common Traps & Pitfalls</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
                    {solution.commonTraps.map((trap, idx) => (
                      <li key={idx}>{trap}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Final Deterministic Answer */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-300 uppercase">Deterministic Invariant / Final Answer</div>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed font-medium">{solution.finalAnswer}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bezel-shell p-12 text-center bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center space-y-3 h-full min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                <Lightbulb className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-200">Awaiting Problem Input</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Submit a problem statement or choose from sample high-yield questions on the left to see the step-by-step AI resolution breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // If used as modal with isOpen=false, return null; otherwise render content
  if (isOpen === false) return null;

  if (isOpen === true && onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <div className="max-w-5xl w-full my-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white z-10"
          >
            <X className="w-5 h-5" />
          </button>
          {content}
        </div>
      </div>
    );
  }

  return content;
};
