import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Code2,
  Calculator,
  GraduationCap,
  Briefcase,
  FolderGit2,
  AlertOctagon,
  Award,
  Timer,
  Bot,
  Compass,
  Linkedin,
  ChevronRight,
  ChevronDown,
  Clock,
  FileCheck,
  Layers,
  HeartPulse,
  CalendarCheck,
  Compass as CompassIcon,
  Home,
  Globe,
} from 'lucide-react';
import { TabType } from '../../types';
import { soundFx } from '../../lib/sound';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  omniCoursesCount?: number;
  onNavigateLanding?: () => void;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
  badge?: string;
  isAi?: boolean;
  category: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Command Center', icon: LayoutDashboard, category: 'Core Center' },
  { id: 'my-day', label: 'My Day (AI Agenda)', icon: CalendarCheck, isAi: true, badge: 'Live', category: 'Adaptive College Hub' },
  { id: 'timetable', label: 'College Timetable', icon: Clock, category: 'Adaptive College Hub' },
  { id: 'assignments', label: 'Assignments Kanban', icon: FileCheck, category: 'Adaptive College Hub' },
  { id: 'flashcards', label: 'Active Recall Cards', icon: Layers, category: 'Adaptive College Hub' },
  { id: 'wellbeing', label: 'Wellbeing & Workload', icon: HeartPulse, category: 'Adaptive College Hub' },
  { id: 'omni-skill', label: 'Omni-Skill Architect', icon: Sparkles, isAi: true, badge: 'Axiom', category: 'AI Intelligence' },
  { id: 'ai-mentor', label: 'AI Placement Mentor', icon: Bot, isAi: true, category: 'AI Intelligence' },
  { id: 'ai-planner', label: 'AI Study Planner', icon: Compass, isAi: true, category: 'AI Intelligence' },
  { id: 'dsa', label: '75+ DSA Patterns', icon: Code2, category: 'Technical Mastery' },
  { id: 'academics', label: 'Academics & Core CS', icon: GraduationCap, category: 'Technical Mastery' },
  { id: 'aptitude', label: 'Aptitude & Formulas', icon: Calculator, category: 'Technical Mastery' },
  { id: 'internships', label: 'Job Applications', icon: Briefcase, category: 'Career & Profile' },
  { id: 'projects', label: 'STAR Projects', icon: FolderGit2, category: 'Career & Profile' },
  { id: 'mistakes', label: 'Mistakes Log', icon: AlertOctagon, category: 'Career & Profile' },
  { id: 'courses', label: 'Certificates Vault', icon: Award, category: 'Career & Profile' },
  { id: 'linkedin', label: 'LinkedIn Checklist', icon: Linkedin, category: 'Career & Profile' },
  { id: 'productivity', label: 'Focus & Productivity', icon: Timer, category: 'Productivity' },
];

const CATEGORY_META: Record<string, { label: string; color: string; badge?: string }> = {
  'Core Center': { label: 'CORE CENTER', color: 'bg-indigo-500' },
  'Adaptive College Hub': { label: 'COLLEGE & WELLBEING', color: 'bg-cyan-500', badge: '5 Tools' },
  'AI Intelligence': { label: 'AI INTELLIGENCE', color: 'bg-purple-500', badge: 'Gemini' },
  'Technical Mastery': { label: 'TECHNICAL MASTERY', color: 'bg-emerald-500' },
  'Career & Profile': { label: 'CAREER & PLACEMENT', color: 'bg-amber-500' },
  'Productivity': { label: 'PRODUCTIVITY', color: 'bg-pink-500' },
};

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onNavigateLanding }) => {
  const categories = Array.from(new Set(NAV_ITEMS.map((item) => item.category)));

  // Maintain collapsible groups state with all open by default
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Ensure active category is always expanded
  const activeCategory = NAV_ITEMS.find((item) => item.id === activeTab)?.category;
  useEffect(() => {
    if (activeCategory && collapsedGroups[activeCategory]) {
      setCollapsedGroups((prev) => ({ ...prev, [activeCategory]: false }));
    }
  }, [activeCategory]);

  const toggleGroup = (category: string) => {
    soundFx.playClick();
    setCollapsedGroups((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleSelect = (id: TabType) => {
    soundFx.playClick();
    onTabChange(id);
  };

  return (
    <aside className="w-64 lg:w-72 flex-shrink-0 p-3 sm:p-4 flex flex-col justify-between overflow-y-auto">
      <div className="space-y-6">
        {/* Landing Page Link Button */}
        {onNavigateLanding && (
          <button
            onClick={() => {
              soundFx.playClick();
              onNavigateLanding();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 pressable transition-all"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Marketing Landing Page</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        )}

        {/* Section Groups */}
        {categories.map((category) => {
          const items = NAV_ITEMS.filter((item) => item.category === category);
          const meta = CATEGORY_META[category] || { label: category, color: 'bg-indigo-500' };
          const isCollapsed = !!collapsedGroups[category];
          const hasActiveItem = items.some((item) => item.id === activeTab);

          return (
            <div key={category} className="space-y-1.5 pb-2 border-b border-white/[0.04] last:border-0">
              {/* Category Header with Collapsible Toggle */}
              <button
                onClick={() => toggleGroup(category)}
                className="w-full px-2 py-1.5 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-slate-400 hover:text-slate-200 transition-colors pressable group"
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.color} inline-block shadow-sm shadow-indigo-500/50`} />
                  <span className={hasActiveItem ? 'text-indigo-300 font-extrabold' : ''}>{meta.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {meta.badge && (
                    <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-slate-800/80 text-slate-400 border border-white/5">
                      {meta.badge}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-transform duration-200 ${
                      isCollapsed ? '-rotate-90' : 'rotate-0'
                    }`}
                  />
                </div>
              </button>

              {/* Items List (Collapsible) */}
              {!isCollapsed && (
                <div className="space-y-1 pt-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold pressable group relative transition-all duration-150 ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-white/20'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent hover:border-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`p-1.5 rounded-lg transition-transform duration-150 flex-shrink-0 group-hover:scale-105 ${
                              isActive
                                ? 'bg-white/20 text-white shadow-inner'
                                : item.isAi
                                ? 'bg-purple-500/15 text-purple-400'
                                : 'bg-slate-800/80 text-slate-400'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate tracking-tight">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {item.badge && (
                            <span
                              className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                                isActive
                                  ? 'bg-white/25 text-white'
                                  : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight
                            className={`w-3 h-3 transition-transform duration-150 ${
                              isActive ? 'text-white translate-x-0.5' : 'text-slate-600 group-hover:text-slate-300'
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Machined Bottom info card */}
      <div className="mt-8 p-3.5 rounded-2xl glass-subtle text-xs shadow-md">
        <div className="flex items-center gap-2 text-indigo-300 font-bold mb-1 font-display">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Hybrid Architecture</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
          Universal Omni-Learning + Placement Acceleration powered by Google Gemini.
        </p>
      </div>
    </aside>
  );
};
