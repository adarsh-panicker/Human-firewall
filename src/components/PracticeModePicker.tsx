import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  Filter, 
  Clock,
  Home,
  Briefcase,
  Search
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
  const [selectedAudience, setSelectedAudience] = useState<'all' | 'everyday' | 'workplace'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>(targetSkill || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScenarios = SCENARIOS.filter(s => {
    // Audience filter
    if (selectedAudience === 'everyday' && s.audience !== 'everyday') return false;
    if (selectedAudience === 'workplace' && s.audience !== 'workplace') return false;

    // Category filter
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchNarrative = s.narrative.toLowerCase().includes(q);
      const matchObjective = s.learningObjective.toLowerCase().includes(q);
      if (!matchTitle && !matchNarrative && !matchObjective) return false;
    }

    return true;
  });

  const everydayCount = SCENARIOS.filter(s => s.audience === 'everyday').length;
  const workplaceCount = SCENARIOS.filter(s => s.audience === 'workplace').length;

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

      {/* Audience Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-navy-900/90 p-3 rounded-2xl border border-navy-800 shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedAudience('all');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedAudience === 'all'
                ? 'bg-cyan-500 text-navy-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-navy-800'
            }`}
          >
            All Challenges ({SCENARIOS.length})
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedAudience('everyday');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedAudience === 'everyday'
                ? 'bg-emerald-500 text-navy-950 shadow-md shadow-emerald-500/20'
                : 'text-emerald-300 hover:text-white hover:bg-navy-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Everyday & Home Life ({everydayCount})</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedAudience('workplace');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedAudience === 'workplace'
                ? 'bg-violet-500 text-white shadow-md shadow-violet-500/20'
                : 'text-violet-300 hover:text-white hover:bg-navy-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Workplace & Enterprise ({workplaceCount})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search delivery, bank, netflix, mfa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 bg-navy-900/60 p-3 rounded-xl border border-navy-800">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Discipline:</span>
        </div>

        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All ({filteredScenarios.length})
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
        {filteredScenarios.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            No scenarios found matching this criteria. Try clearing your filters or search.
          </div>
        ) : (
          filteredScenarios.map((scenario) => {
            const colors = SKILL_COLORS[scenario.category];
            const isBranch = scenario.id.includes('-compromise') || scenario.id.includes('-investigation') || scenario.id.includes('-fraud') || scenario.id.includes('-social-eng') || scenario.id.includes('-verified');
            const isEveryday = scenario.audience === 'everyday';

            return (
              <div
                key={scenario.id}
                className="bg-navy-900/80 border border-navy-800 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-cyan-500/5 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Audience Badge */}
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                        isEveryday
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                          : 'bg-violet-950/80 text-violet-300 border-violet-700/60'
                      }`}>
                        {isEveryday ? <Home className="w-2.5 h-2.5" /> : <Briefcase className="w-2.5 h-2.5" />}
                        <span>{isEveryday ? 'Home Life' : 'Workplace'}</span>
                      </span>

                      {/* Skill Category Badge */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
                        {SKILL_LABELS[scenario.category]}
                      </span>

                      {isBranch && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800">
                          Branch Path
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
          })
        )}
      </div>
    </div>
  );
};
