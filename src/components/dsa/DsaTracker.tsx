import React, { useState, useEffect } from 'react';
import {
  Code2,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  ExternalLink,
  Plus,
  Flame,
  Award,
  BookOpen,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { DsaTopic, DsaStats, UserProfile } from '../../types';
import { soundFx } from '../../lib/sound';
import { toast } from '../../lib/toast';

interface DsaTrackerProps {
  dsaList: DsaTopic[];
  profile: UserProfile;
  onToggleComplete: (id: string) => void;
  onAddTopic: (topic: Omit<DsaTopic, 'id'>) => void;
}

export const DsaTracker: React.FC<DsaTrackerProps> = ({
  dsaList,
  profile,
  onToggleComplete,
  onAddTopic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Completed' | 'Pending'>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // LeetCode live stats state
  const [stats, setStats] = useState<DsaStats>({
    totalSolved: 242,
    easySolved: 104,
    mediumSolved: 112,
    hardSolved: 26,
    ranking: 38450,
    acceptanceRate: 72.4,
    submissionCalendar: {},
    isLive: false,
  });
  const [loadingStats, setLoadingStats] = useState(false);

  // New problem form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DsaTopic['category']>('Arrays');
  const [newDifficulty, setNewDifficulty] = useState<DsaTopic['difficulty']>('Medium');
  const [newPattern, setNewPattern] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const fetchLeetCodeStats = async () => {
    if (!profile.leetcodeUsername) return;
    setLoadingStats(true);
    try {
      const res = await fetch(`/api/leetcode/${profile.leetcodeUsername}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        toast.success('LeetCode Profile Synced', {
          description: `Fetched stats for ${profile.leetcodeUsername}`,
        });
      }
    } catch (e) {
      console.warn('Could not fetch LeetCode stats:', e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchLeetCodeStats();
  }, [profile.leetcodeUsername]);

  const categories = ['All', ...Array.from(new Set(dsaList.map((t) => t.category)))];

  const filteredTopics = dsaList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyPattern?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Completed' && item.completed) ||
      (filterStatus === 'Pending' && !item.completed);
    return matchesSearch && matchesCat && matchesDiff && matchesStatus;
  });

  const completedCount = dsaList.filter((t) => t.completed).length;
  const progressPercent = dsaList.length ? Math.round((completedCount / dsaList.length) * 100) : 0;

  const handleToggle = (topic: DsaTopic) => {
    soundFx.playSuccess();
    onToggleComplete(topic.id);
    if (!topic.completed) {
      toast.success(`Problem Solved: ${topic.title}`, {
        description: `+20 XP earned • ${topic.difficulty} difficulty pattern mastered.`,
      });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    soundFx.playSuccess();
    onAddTopic({
      title: newTitle,
      category: newCategory,
      difficulty: newDifficulty,
      keyPattern: newPattern,
      leetcodeUrl: newUrl,
      completed: false,
    });
    toast.success('Problem Added to 75+ Sheet', { description: newTitle });
    setNewTitle('');
    setNewPattern('');
    setNewUrl('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header & LeetCode Sync HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bezel-shell">
          <div className="bezel-core p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="eyebrow-badge">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>CURATED 75+ PATTERNS SHEET</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">DSA Problem Master Tracker</h2>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Master algorithmic patterns tested at Google, Amazon, Microsoft, and top high-frequency tech teams.
                </p>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowAddModal(true);
                }}
                className="btn-island group flex items-center justify-between pl-4 pr-2 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-md shadow-indigo-600/30 border border-white/10 flex-shrink-0 pressable"
              >
                <span className="mr-2.5 tracking-wide">Add Custom Problem</span>
                <div className="btn-icon-wrapper w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Plus className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Syllabus Progress: <strong className="text-white">{completedCount}</strong> / {dsaList.length} Solved
                </span>
                <span className="text-indigo-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden p-0.5 border border-white/5">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* LeetCode Live Stats Card */}
        <div className="lg:col-span-4 bezel-shell">
          <div className="bezel-core p-6 flex flex-col justify-between gap-4 h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  {profile.leetcodeUsername || 'LeetCode Stats'}
                </span>
              </div>
              <button
                onClick={fetchLeetCodeStats}
                disabled={loadingStats}
                className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-slate-900 border border-transparent hover:border-white/5 pressable"
                title="Refresh LeetCode Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-emerald-500/20 shadow-inner">
                <div className="text-[9px] text-emerald-400 font-mono font-bold">EASY</div>
                <div className="text-base font-extrabold text-white font-mono mt-0.5">{stats.easySolved}</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-amber-500/20 shadow-inner">
                <div className="text-[9px] text-amber-400 font-mono font-bold">MEDIUM</div>
                <div className="text-base font-extrabold text-white font-mono mt-0.5">{stats.mediumSolved}</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-rose-500/20 shadow-inner">
                <div className="text-[9px] text-rose-400 font-mono font-bold">HARD</div>
                <div className="text-base font-extrabold text-white font-mono mt-0.5">{stats.hardSolved}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5 font-mono">
              <span>Global Rank: #{stats.ranking.toLocaleString()}</span>
              <span>Total: {stats.totalSolved}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search problems, patterns, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/80"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 pressable cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 pressable cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 pressable cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Topics List Table (Double-Bezel Shell) */}
      <div className="bezel-shell">
        <div className="bezel-core overflow-hidden shadow-2xl p-0">
          {filteredTopics.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white font-display">No matching DSA problems found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try clearing your search query or selecting "All Difficulties" and "All Categories" from the filter bar above.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedDifficulty('All');
                  setFilterStatus('All');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-semibold pressable border border-white/5"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">Status</th>
                    <th className="py-3.5 px-4">Problem Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Difficulty</th>
                    <th className="py-3.5 px-4">Core Pattern</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTopics.map((topic) => (
                    <tr
                      key={topic.id}
                      className={`hover:bg-slate-900/50 transition-colors duration-150 ${
                        topic.completed ? 'bg-emerald-500/[0.03]' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggle(topic)}
                          className="text-emerald-400 pressable"
                          title={topic.completed ? 'Mark as pending' : 'Mark as solved (+15 XP)'}
                        >
                          {topic.completed ? (
                            <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-slate-950" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 hover:text-indigo-400" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-xs sm:text-sm font-display">{topic.title}</div>
                        {topic.notes && <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{topic.notes}</div>}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-white/10 text-slate-300 font-mono text-[10px]">
                          {topic.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[9px] uppercase tracking-wider ${
                            topic.difficulty === 'Easy'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : topic.difficulty === 'Medium'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {topic.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-300 text-[11px] font-mono">
                          {topic.keyPattern || 'Standard Pattern'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {topic.leetcodeUrl ? (
                          <a
                            href={topic.leetcodeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 hover:bg-indigo-600 hover:text-white text-slate-300 border border-white/10 hover:border-indigo-500 pressable text-[11px] font-semibold"
                          >
                            <span>Solve</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-600 text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Problem Modal with Emil scale(0.96) enter animation */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bezel-shell max-w-md w-full animate-fade-in-up">
            <div className="bezel-core p-6">
              <h3 className="text-lg font-bold text-white mb-4 font-display">Add Custom DSA Problem</h3>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Problem Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Alien Dictionary"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Arrays">Arrays</option>
                      <option value="Two Pointers">Two Pointers</option>
                      <option value="Sliding Window">Sliding Window</option>
                      <option value="Linked Lists">Linked Lists</option>
                      <option value="Stacks & Queues">Stacks & Queues</option>
                      <option value="Trees & BST">Trees & BST</option>
                      <option value="Graphs">Graphs</option>
                      <option value="Dynamic Programming">Dynamic Programming</option>
                      <option value="Greedy">Greedy</option>
                      <option value="Trie">Trie</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Key Pattern / Technique</label>
                  <input
                    type="text"
                    placeholder="e.g. Topological Sort BFS"
                    value={newPattern}
                    onChange={(e) => setNewPattern(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">LeetCode / Problem URL</label>
                  <input
                    type="url"
                    placeholder="https://leetcode.com/problems/..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-full text-xs text-slate-400 hover:bg-slate-800 pressable"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 pressable"
                  >
                    Add Problem
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
