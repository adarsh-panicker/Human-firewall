import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  Filter, 
  Clock
} from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';
import { SkillCategory } from '../types/game';
import { SKILL_LABELS, SKILL_COLORS } from '../engine/scoringEngine';
import { soundManager } from '../utils/audio';

interface PracticeModePickerProps {
  onSelectScenario: (scenarioId: string) => void;
  onBack: () => void;
  targetSkill?: SkillCategory | null;
}

export const PracticeModePicker: React.FC<PracticeModePickerProps> = ({
  onSelectScenario,
  onBack,
  targetSkill
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(targetSkill || 'all');

  const filteredScenarios = SCENARIOS.filter(s => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Practice Scenario Library
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Play individual real-world situations with full educational explanations and zero score pressure.
          </p>
        </div>

        <button
          onClick={onBack}
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-navy-900/60 p-3.5 rounded-xl border border-navy-800">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Category:</span>
        </div>

        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Categories ({SCENARIOS.length})
        </button>

        {Object.entries(SKILL_LABELS).map(([catKey, label]) => (
          <button
            key={catKey}
            onClick={() => setSelectedCategory(catKey)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === catKey
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredScenarios.map((scenario) => {
          const colors = SKILL_COLORS[scenario.category];
          const isBranch = scenario.id.includes('-compromise') || scenario.id.includes('-investigation') || scenario.id.includes('-fraud') || scenario.id.includes('-social-eng');

          return (
            <div
              key={scenario.id}
              className="bg-navy-900/80 border border-navy-800 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-cyan-500/5 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
                      {SKILL_LABELS[scenario.category]}
                    </span>
                    {isBranch && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-violet-300 bg-violet-950/80 border border-violet-800">
                        Branch Storyline
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>~{scenario.estimatedReadingSec}s</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {scenario.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-3">
                  {scenario.narrative}
                </p>

                <div className="text-[11px] text-slate-400 bg-navy-950 p-2.5 rounded-lg border border-navy-800/80 mb-4">
                  <strong className="text-slate-300">Objective:</strong> {scenario.learningObjective}
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onSelectScenario(scenario.id);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-navy-800 hover:bg-cyan-500/20 border border-navy-700 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 font-semibold text-xs transition-all"
              >
                <span>Launch Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
