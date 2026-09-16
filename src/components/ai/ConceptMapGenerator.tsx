import React, { useState } from 'react';
import {
  Sparkles,
  GitFork,
  ChevronDown,
  ChevronRight,
  Plus,
  BookOpen,
  Layers,
  Zap,
  RefreshCw,
  Search,
  Award,
} from 'lucide-react';
import { ConceptNode, ConceptMapData, Track } from '../../types';
import { useTrack } from '../../context/TrackContext';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';
import { generateConceptMap } from '../../services/aiService';

interface ConceptMapGeneratorProps {
  onAwardXP?: (amount: number) => void;
}

// Interactive Collapsible Node Component
const TreeNode: React.FC<{
  node: ConceptNode;
  depth: number;
  onSelectNode: (node: ConceptNode) => void;
  selectedId: string | null;
}> = ({ node, depth, onSelectNode, selectedId }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;

  const getDepthBadgeStyle = (d: number) => {
    switch (d) {
      case 0:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold';
      case 1:
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 2:
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-2 relative">
      {/* Node Card */}
      <div
        onClick={() => {
          onSelectNode(node);
          soundFx.playClick();
        }}
        className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer pressable ${
          isSelected
            ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.01]'
            : 'bg-slate-950/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
        }`}
      >
        {hasChildren && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
              soundFx.playClick();
            }}
            className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition mt-0.5"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${getDepthBadgeStyle(depth)}`}>
              {node.category || (depth === 0 ? 'Core Pillar' : `Level ${depth}`)}
            </span>
            <h4 className="text-sm font-bold text-white font-display">{node.title}</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{node.description}</p>

          {node.keyConcepts && node.keyConcepts.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {node.keyConcepts.map((kc, i) => (
                <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-slate-900 border border-white/5 text-slate-300">
                  • {kc}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Render Children with branching line indent */}
      {hasChildren && isExpanded && (
        <div className="pl-6 sm:pl-8 space-y-2 border-l-2 border-indigo-500/20 ml-4">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelectNode={onSelectNode}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ConceptMapGenerator: React.FC<ConceptMapGeneratorProps> = ({ onAwardXP }) => {
  const { track, trackMeta } = useTrack();
  const [topicInput, setTopicInput] = useState(trackMeta.exampleSubjects?.[0] || 'Distributed Systems');
  const [loading, setLoading] = useState(false);
  const [conceptMap, setConceptMap] = useState<ConceptMapData | null>(null);
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);

  const handleGenerate = async (customTopic?: string) => {
    const topic = customTopic || topicInput;
    if (!topic.trim() || loading) return;

    setLoading(true);
    soundFx.playClick();

    try {
      const data = await generateConceptMap(topic, track);
      setConceptMap(data);
      setSelectedNode(data.root || null);
      onAwardXP?.(20);
      soundFx.playLevelUp();
      toast.success('Concept Map Generated!', { description: '+20 XP gained. Hierarchical tree rendered.' });
    } catch (err) {
      console.warn('Concept map error:', err);
      toast.error('Synthesis Error', { description: 'Failed to generate Concept Map.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-purple-950/30 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="eyebrow-badge">
                  <GitFork className="w-3.5 h-3.5 text-indigo-400" />
                  <span>KNOWLEDGE GRAPH ENGINE</span>
                </span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${trackMeta.bgSubtle} ${trackMeta.color} border ${trackMeta.borderAccent}`}>
                  {trackMeta.label}
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white font-display">
                Interactive AI Concept Map Generator
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Transform any {trackMeta.shortLabel} subject into an interactive, 3-tier deep cognitive hierarchy.
                Trace atomic building blocks, core operational protocols, and exam synthesis pathways.
              </p>
            </div>
          </div>

          {/* Search / Topic Input Form */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder={`Enter a topic in ${trackMeta.shortLabel} (e.g. ${
                  track === 'commerce'
                    ? 'Ind AS 115 Revenue Recognition'
                    : track === 'medical'
                    ? 'Acute Myocardial Infarction & Triage'
                    : track === 'law'
                    ? 'Basic Structure Doctrine & Writs'
                    : track === 'competitive_exams'
                    ? 'Cooperative Federalism & Article 280'
                    : 'Operating Systems & Concurrency'
                })`}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="btn-island w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition pressable disabled:opacity-50 flex-shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Graph...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Generate Tree (+20 XP)</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Preset Chips */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] font-mono text-slate-400">Quick Topics:</span>
            {trackMeta.exampleSubjects?.map((sub, i) => (
              <button
                key={i}
                onClick={() => {
                  setTopicInput(sub);
                  handleGenerate(sub);
                }}
                className="text-[11px] font-mono px-3 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition pressable"
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Concept Map Area: Left Tree Diagram + Right Concept Inspector */}
      {conceptMap && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Hierarchical Tree View */}
          <div className="lg:col-span-8 bezel-shell">
            <div className="bezel-core p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                    <GitFork className="w-4 h-4 text-indigo-400" />
                    <span>{conceptMap.topic} — Cognitive Concept Hierarchy</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{conceptMap.summary}</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Interactive Node Tree
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <TreeNode
                  node={conceptMap.root}
                  depth={0}
                  onSelectNode={(n) => setSelectedNode(n)}
                  selectedId={selectedNode?.id || null}
                />
              </div>
            </div>
          </div>

          {/* Right Concept Node Inspector */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bezel-shell">
              <div className="bezel-core p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>Concept Inspector</span>
                  </span>
                  {selectedNode && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase">
                      {selectedNode.category || 'Node'}
                    </span>
                  )}
                </div>

                {selectedNode ? (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <h4 className="text-lg font-bold text-white font-display">{selectedNode.title}</h4>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{selectedNode.description}</p>
                    </div>

                    {selectedNode.keyConcepts && selectedNode.keyConcepts.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase">Key Invariants & Terms</span>
                        <div className="space-y-1.5">
                          {selectedNode.keyConcepts.map((kc, i) => (
                            <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-xs text-slate-200 flex items-center gap-2">
                              <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                              <span>{kc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedNode.children && selectedNode.children.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                          Sub-Branches ({selectedNode.children.length})
                        </span>
                        <div className="space-y-1.5">
                          {selectedNode.children.map((child) => (
                            <div
                              key={child.id}
                              onClick={() => {
                                setSelectedNode(child);
                                soundFx.playClick();
                              }}
                              className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-xs text-slate-300 cursor-pointer pressable flex items-center justify-between"
                            >
                              <span className="font-semibold text-white">{child.title}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Click any node on the left hierarchy tree to inspect its key concepts and sub-branches.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
