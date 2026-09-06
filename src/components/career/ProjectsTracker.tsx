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
} from 'lucide-react';
import { Project, UserProfile } from '../../types';

interface ProjectsTrackerProps {
  projects: Project[];
  profile: UserProfile;
  onAddProject: (p: Omit<Project, 'id'>) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectsTracker: React.FC<ProjectsTrackerProps> = ({
  projects,
  profile,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [techInput, setTechInput] = useState('React, TypeScript, Node.js');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const techStack = techInput.split(',').map((t) => t.trim()).filter(Boolean);
    onAddProject({
      title,
      shortDescription: desc,
      techStack,
      githubRepoUrl: githubUrl,
      liveDemoUrl: liveUrl,
      starsCount: 12,
      status: 'Completed',
      highlights: [
        `Engineered full-stack ${title} using ${techStack.slice(0, 2).join(' & ')}.`,
        'Optimized system throughput and responsiveness under simulated concurrent user traffic.',
      ],
    });
    setTitle('');
    setDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-indigo-400">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>RESUME & STAR METHOD PORTFOLIO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Engineering Projects & GitHub Showcase</h2>
          <p className="text-xs text-slate-400">
            Frame project impacts with quantifiable STAR bullet points for recruiter resume screening.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-4 relative group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white leading-snug">{proj.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {proj.status || 'Completed'}
                    </span>
                    {proj.starsCount && (
                      <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {proj.starsCount}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDeleteProject(proj.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{proj.shortDescription || proj.description}</p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* STAR Bullet Highlights */}
              {proj.highlights && proj.highlights.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                  <div className="text-[10px] font-mono font-semibold text-indigo-400 uppercase">
                    STAR Resume Bullets:
                  </div>
                  {proj.highlights.map((bullet, bIdx) => (
                    <div key={bIdx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
              {proj.githubRepoUrl && (
                <a
                  href={proj.githubRepoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {proj.liveDemoUrl && (
                <a
                  href={proj.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Add Project to Portfolio</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Consensus Engine"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="High-level architecture and problem solved..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">GitHub Repo URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
