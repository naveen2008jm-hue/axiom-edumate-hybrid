import React, { useState } from 'react';
import {
  Award,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { ExternalCourse } from '../../types';

interface CoursesTrackerProps {
  externalCourses: ExternalCourse[];
  onAddCourse: (c: Omit<ExternalCourse, 'id'>) => void;
  onDeleteCourse: (id: string) => void;
}

export const CoursesTracker: React.FC<CoursesTrackerProps> = ({
  externalCourses,
  onAddCourse,
  onDeleteCourse,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('Coursera');
  const [credentialId, setCredentialId] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [certUrl, setCertUrl] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const skillsAcquired = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
    onAddCourse({
      courseTitle: title,
      platform,
      credentialId: credentialId || `CRED-${Date.now()}`,
      skillsAcquired,
      certificateUrl: certUrl,
      completionDate: new Date().toISOString().split('T')[0],
      isVerified: true,
      status: 'Completed',
    });
    setTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400">
            <Award className="w-3.5 h-3.5" />
            <span>CERTIFICATIONS & BADGES VAULT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">External Certifications & Verification</h2>
          <p className="text-xs text-slate-400">
            Showcase verified credentials from Coursera, Udemy, Infosys Springboard, HackerRank, and cloud providers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {externalCourses.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-4 relative group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {c.platform}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                    {c.courseTitle || c.title}
                  </h3>
                </div>
                <button
                  onClick={() => onDeleteCourse(c.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {c.credentialId && (
                <div className="text-[11px] font-mono text-slate-400 truncate">
                  ID: {c.credentialId}
                </div>
              )}

              {c.skillsAcquired && c.skillsAcquired.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {c.skillsAcquired.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] font-mono text-slate-300 border border-slate-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">
                {c.completionDate || 'Verified'}
              </span>
              {c.certificateUrl ? (
                <a
                  href={c.certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-indigo-400 hover:underline text-xs"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Credential Logged</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Add Course Certificate</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Coursera">Coursera</option>
                    <option value="Udemy">Udemy</option>
                    <option value="HackerRank">HackerRank</option>
                    <option value="Infosys Springboard">Infosys Springboard</option>
                    <option value="NPTEL">NPTEL</option>
                    <option value="AWS/GCP">AWS/GCP</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Credential ID</label>
                  <input
                    type="text"
                    placeholder="e.g. UC-88912"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Skills Acquired (comma separated)</label>
                <input
                  type="text"
                  placeholder="Distributed Systems, Spring Boot, Docker"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Certificate Verification URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={certUrl}
                  onChange={(e) => setCertUrl(e.target.value)}
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
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
