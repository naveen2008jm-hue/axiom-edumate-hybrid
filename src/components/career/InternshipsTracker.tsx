import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  ExternalLink,
  Building2,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { Internship } from '../../types';

interface InternshipsTrackerProps {
  internships: Internship[];
  onAddInternship: (item: Omit<Internship, 'id'>) => void;
  onUpdateInternship: (id: string, updates: Partial<Internship>) => void;
  onDeleteInternship: (id: string) => void;
}

const STAGES: Internship['status'][] = [
  'Applied',
  'Online Assessment',
  'Interviewing',
  'Offered',
  'Rejected',
];

export const InternshipsTracker: React.FC<InternshipsTrackerProps> = ({
  internships,
  onAddInternship,
  onUpdateInternship,
  onDeleteInternship,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Software Engineering Intern');
  const [stipend, setStipend] = useState('₹1,00,000 / mo');
  const [location, setLocation] = useState('Bangalore / Hybrid');
  const [status, setStatus] = useState<Internship['status']>('Applied');
  const [jobLink, setJobLink] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    onAddInternship({
      companyName: company,
      roleTitle: role,
      stipendOrCtc: stipend,
      location,
      status,
      jobLink,
      applicationDate: new Date().toISOString().split('T')[0],
      roundsInfo: [
        { roundName: 'Application Submission', date: new Date().toISOString().split('T')[0], status: 'Cleared', notes: 'Applied via portal' },
      ],
    });
    setCompany('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-indigo-400">
            <Briefcase className="w-3.5 h-3.5" />
            <span>PLACEMENT & INTERNSHIP PIPELINE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Job & Internship Kanban Pipeline</h2>
          <p className="text-xs text-slate-400">
            Track applications, online assessment schedules, interview rounds, and offers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Track New Company</span>
        </button>
      </div>

      {/* Kanban Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const itemsInStage = internships.filter((i) => i.status === stage);

          return (
            <div key={stage} className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 min-w-[240px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">{stage}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {itemsInStage.length}
                </span>
              </div>

              <div className="space-y-3">
                {itemsInStage.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition space-y-2.5 relative group shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-white">{app.companyName}</h4>
                        <div className="text-[11px] text-indigo-400">{app.roleTitle}</div>
                      </div>
                      <button
                        onClick={() => onDeleteInternship(app.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {app.stipendOrCtc && (
                      <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>{app.stipendOrCtc}</span>
                      </div>
                    )}

                    {app.location && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{app.location}</span>
                      </div>
                    )}

                    {/* Stage selector dropdown */}
                    <div className="pt-2 border-t border-slate-900">
                      <select
                        value={app.status}
                        onChange={(e) => onUpdateInternship(app.id, { status: e.target.value as any })}
                        className="w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 focus:outline-none focus:border-indigo-500"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            Move to: {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Track Job Application</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Google, Atlassian"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Role Title</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Stipend / CTC</label>
                  <input
                    type="text"
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
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
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
