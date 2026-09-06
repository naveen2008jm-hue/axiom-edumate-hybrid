import React from 'react';
import {
  Linkedin,
  CheckCircle2,
  Circle,
  Sparkles,
  ExternalLink,
  Users,
} from 'lucide-react';
import { LinkedInTask } from '../../types';

interface LinkedinChecklistProps {
  tasks: LinkedInTask[];
  onToggleTask: (id: string) => void;
}

export const LinkedinChecklist: React.FC<LinkedinChecklistProps> = ({ tasks, onToggleTask }) => {
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const categories = Array.from(new Set(tasks.map((t) => t.category)));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-sky-400">
            <Linkedin className="w-3.5 h-3.5" />
            <span>RECRUITER VISIBILITY & NETWORKING</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">LinkedIn & Personal Branding Optimization</h2>
          <p className="text-xs text-slate-400">
            Step-by-step checklist to attract engineering recruiters, alumni referrals, and hiring managers.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 font-mono text-xs flex-shrink-0">
          <span className="text-slate-400">Readiness:</span>
          <span className="text-sky-400 font-bold">{progress}%</span>
          <span className="text-slate-500">({completedCount}/{tasks.length})</span>
        </div>
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const categoryTasks = tasks.filter((t) => t.category === category);

          return (
            <div key={category} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <span>{category}</span>
              </h3>

              <div className="space-y-2.5">
                {categoryTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition ${
                      task.isCompleted
                        ? 'bg-sky-500/5 border-sky-500/20 text-slate-300'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <button className="mt-0.5 text-sky-400">
                      {task.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 fill-sky-500 text-slate-950" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className={`text-xs font-semibold ${task.isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.taskTitle || task.title || task.taskKey}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{task.description}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                      +10 XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
