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
  Award,
  FileText,
  Filter,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Internship, OpportunityType } from '../../types';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

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

const STAGE_DISPLAY_NAMES: Record<string, string> = {
  'Applied': 'Applied / Registered',
  'Online Assessment': 'Assessment / Prelims',
  'Interviewing': 'Interview / Mains',
  'Offered': 'Offered / Selected',
  'Rejected': 'Archived / Rejected',
};

const OPPORTUNITY_TYPES: OpportunityType[] = [
  'Job',
  'Internship',
  'Government Exam Form',
  'Entrance Exam',
  'Scholarship',
  'Fellowship',
];

export const InternshipsTracker: React.FC<InternshipsTrackerProps> = ({
  internships,
  onAddInternship,
  onUpdateInternship,
  onDeleteInternship,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');

  // Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Senior Associate / Specialist');
  const [oppType, setOppType] = useState<OpportunityType>('Job');
  const [stipend, setStipend] = useState('Competitive CTC / Grant');
  const [location, setLocation] = useState('Hybrid / All-India');
  const [status, setStatus] = useState<Internship['status']>('Applied');
  const [jobLink, setJobLink] = useState('');

  const filteredItems = internships.filter((item) => {
    if (selectedTypeFilter === 'All') return true;
    const itemType = item.opportunityType || 'Job';
    return itemType === selectedTypeFilter;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    soundFx.playSuccess();
    onAddInternship({
      companyName: company,
      roleTitle: role,
      opportunityType: oppType,
      stipendOrCtc: stipend,
      location,
      status,
      jobLink,
      applicationDate: new Date().toISOString().split('T')[0],
      roundsInfo: [
        { roundName: 'Form / Application Submission', date: new Date().toISOString().split('T')[0], status: 'Cleared', notes: 'Submitted via portal' },
      ],
    });
    setCompany('');
    setShowAddModal(false);
    toast.success('Opportunity Pipeline Updated', {
      description: `Tracking ${oppType}: ${role} at ${company}`,
    });
  };

  const getTypeBadgeColor = (type?: OpportunityType) => {
    switch (type) {
      case 'Government Exam Form':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Entrance Exam':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Scholarship':
      case 'Fellowship':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Internship':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      default:
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header (Double Bezel) */}
      <div className="bezel-shell">
        <div className="bezel-core p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-indigo-400">
              <Briefcase className="w-3.5 h-3.5" />
              <span>OPPORTUNITIES & CAREER PIPELINE</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Universal Opportunities Kanban
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage all target roles across disciplines — Jobs, Internships, Govt Civil Exam Forms, Scholarships & Residencies.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-island group flex items-center justify-between pl-4 pr-1.5 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 border border-white/10 flex-shrink-0 pressable"
          >
            <span className="mr-3 tracking-wide">Track Opportunity</span>
            <div className="btn-icon-wrapper w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>

      {/* Opportunity Type Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', ...OPPORTUNITY_TYPES].map((t) => (
          <button
            key={t}
            onClick={() => {
              soundFx.playClick();
              setSelectedTypeFilter(t);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex-shrink-0 pressable ${
              selectedTypeFilter === t
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Kanban Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const itemsInStage = filteredItems.filter((i) => i.status === stage);

          return (
            <div key={stage} className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 min-w-[250px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  {STAGE_DISPLAY_NAMES[stage] || stage}
                </span>
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
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase inline-block mb-1.5 ${getTypeBadgeColor(app.opportunityType)}`}>
                          {app.opportunityType || 'Opportunity'}
                        </span>
                        <h4 className="font-bold text-sm text-white truncate">{app.companyName}</h4>
                        <div className="text-[11px] text-indigo-400 font-medium truncate">{app.roleTitle}</div>
                      </div>
                      <button
                        onClick={() => onDeleteInternship(app.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition flex-shrink-0"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {app.stipendOrCtc && (
                      <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{app.stipendOrCtc}</span>
                      </div>
                    )}

                    {app.location && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{app.location}</span>
                      </div>
                    )}

                    {app.jobLink && (
                      <a
                        href={app.jobLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-mono"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}

                    {/* Stage selector dropdown */}
                    <div className="pt-2 border-t border-slate-900">
                      <select
                        value={app.status}
                        onChange={(e) => onUpdateInternship(app.id, { status: e.target.value as any })}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            Move to: {STAGE_DISPLAY_NAMES[s] || s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {itemsInStage.length === 0 && (
                  <div className="py-6 text-center text-slate-600 text-xs font-mono">
                    Empty Stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white font-display">Track New Opportunity / Exam Form</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Opportunity Type</label>
                <select
                  value={oppType}
                  onChange={(e) => setOppType(e.target.value as OpportunityType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  {OPPORTUNITY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Organization / Firm / Exam Board</label>
                <input
                  type="text"
                  placeholder="e.g. UPSC, Google, AIIMS, Trilegal, KPMG, CSIR"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Role / Designation / Exam Name</label>
                <input
                  type="text"
                  placeholder="e.g. Civil Services Exam 2027, SDE-1, Junior Resident, Legal Associate"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Stipend / CTC / Grant</label>
                  <input
                    type="text"
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Initial Stage</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {STAGE_DISPLAY_NAMES[s] || s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Location / Zone</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Application / Portal URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={jobLink}
                  onChange={(e) => setJobLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
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
                  Save to Kanban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
