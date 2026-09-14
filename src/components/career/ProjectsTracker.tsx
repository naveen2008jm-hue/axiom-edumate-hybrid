import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Trash2,
  ExternalLink,
  Github,
  Star,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Scale,
  Stethoscope,
  Award,
  Layers,
} from 'lucide-react';
import { Project, PortfolioCategory, UserProfile } from '../../types';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface ProjectsTrackerProps {
  projects: Project[];
  profile: UserProfile;
  onAddProject: (p: Omit<Project, 'id'>) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
}

const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  'Tech Project',
  'Research Paper',
  'Case Competition',
  'Clinical / Legal Audit',
  'Open Source / Community',
  'Creative Work',
];

export const ProjectsTracker: React.FC<ProjectsTrackerProps> = ({
  projects,
  profile,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PortfolioCategory>('Tech Project');
  const [desc, setDesc] = useState('');
  const [techInput, setTechInput] = useState('React, TypeScript, Ind AS, Evidence Law');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  const filteredProjects = projects.filter((p) => {
    if (categoryFilter === 'All') return true;
    return (p.category || 'Tech Project') === categoryFilter;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    soundFx.playSuccess();
    const techStack = techInput.split(',').map((t) => t.trim()).filter(Boolean);
    onAddProject({
      title,
      category,
      shortDescription: desc,
      techStack,
      githubRepoUrl: githubUrl,
      liveDemoUrl: liveUrl,
      starsCount: 15,
      status: 'Completed',
      highlights: [
        `Executed high-impact ${category.toLowerCase()}: ${title}.`,
        `Synthesized primary methodologies using ${techStack.slice(0, 2).join(' & ')}.`,
        'Formulated quantifiable impact metrics and key conclusions for portfolio presentation.',
      ],
      starBulletPoints: [
        `Situation: Addressed key problem domain within ${category}.`,
        `Task: Formulated objectives and structured execution roadmap.`,
        `Action: Deployed ${techStack.slice(0, 3).join(', ')} with rigorous testing.`,
        `Result: Delivered benchmark outcomes and demonstrated domain depth.`,
      ],
    });
    setTitle('');
    setDesc('');
    setShowAddModal(false);
    toast.success('Portfolio Item Published', {
      description: `Added ${category}: ${title} with STAR method narrative.`,
    });
  };

  const getCategoryIcon = (cat?: PortfolioCategory) => {
    switch (cat) {
      case 'Research Paper':
        return BookOpen;
      case 'Clinical / Legal Audit':
        return Scale;
      case 'Case Competition':
        return Award;
      default:
        return FolderGit2;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header (Double Bezel) */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-indigo-400">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>STAR METHOD & IMPACT PORTFOLIO</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Experience Portfolio & Proof-of-Work
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Frame technical projects, moot court briefs, research papers, clinical audits, and case competitions with quantifiable STAR stories.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-island group flex items-center justify-between pl-4 pr-1.5 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 border border-white/10 flex-shrink-0 pressable"
          >
            <span className="mr-3 tracking-wide">Add Portfolio Item</span>
            <div className="btn-icon-wrapper w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', ...PORTFOLIO_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => {
              soundFx.playClick();
              setCategoryFilter(c);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex-shrink-0 pressable ${
              categoryFilter === c
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((proj) => {
          const CatIcon = getCategoryIcon(proj.category);

          return (
            <div
              key={proj.id}
              className="bezel-shell group hover:scale-[1.005] transition-transform duration-200"
            >
              <div className="bezel-core p-6 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {proj.category || 'Tech Project'}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {proj.status || 'Completed'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white font-display leading-snug">{proj.title}</h3>
                    </div>

                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 transition"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {proj.shortDescription && (
                    <p className="text-xs text-slate-300 leading-relaxed">{proj.shortDescription}</p>
                  )}

                  {/* Skills / Tools Stack */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* STAR Method Highlights */}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1.5 text-xs">
                      <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>Quantified STAR Method Highlights</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {proj.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bottom links */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {proj.githubRepoUrl && (
                      <a
                        href={proj.githubRepoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-white font-mono transition"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Repository</span>
                      </a>
                    )}
                    {proj.liveDemoUrl && (
                      <a
                        href={proj.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-mono transition"
                      >
                        <span>Live Artifact</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">STAR Verified</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white font-display">Add to Experience Portfolio</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Portfolio Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PortfolioCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  {PORTFOLIO_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Project / Research / Case Title</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Consensus Engine, Constitutional Moot Memorial, Clinical Audit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Tools / Methodologies / Statutes / Stack</label>
                <input
                  type="text"
                  placeholder="e.g. PyTorch, TypeScript, IPC/BNS, Ind AS 115, SPSS, ICU Protocols"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Brief Description / Executive Summary</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Summarize context, key methodology, and main takeaways..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Repository / Source URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Live Demo / Paper DOI Link</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition"
                >
                  Save to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
