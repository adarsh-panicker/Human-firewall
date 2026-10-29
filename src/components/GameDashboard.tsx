import React, { useState } from 'react';
import { 
  Play, 
  Zap, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight,
  Lock,
  Terminal,
  Flame
} from 'lucide-react';
import { StoredUserData, GameMode, GameSession, SkillCategory } from '../types/game';
import { SKILL_LABELS, SKILL_COLORS } from '../engine/scoringEngine';
import { soundManager } from '../utils/audio';
import { CyberRadarChart } from './CyberRadarChart';
import { ThreatSandboxModal } from './ThreatSandboxModal';

interface GameDashboardProps {
  userData: StoredUserData;
  onStartNewGame: (mode: GameMode) => void;
  onResumeGame: () => void;
  onOpenPractice: () => void;
  onLaunchDemo: () => void;
  onViewSessionReport: (session: GameSession) => void;
  onExportJson: () => void;
  onResetProgress: () => void;
  onOpenSetup: () => void;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({
  userData,
  onStartNewGame,
  onResumeGame,
  onOpenPractice,
  onLaunchDemo,
  onViewSessionReport,
  onExportJson,
  onResetProgress,
  onOpenSetup
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const { stats, achievements, history, activeSession, profile, displayName } = userData;

  const hasActiveSession = activeSession && !activeSession.completed;
  const hasHistory = history.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8 text-left">
      {/* Welcome Banner & Top Stats */}
      <div className="bg-navy-900/90 border border-navy-700/80 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-navy-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300">
                Security Profile Active • {profile.toUpperCase()}
              </span>
              {stats.dailyStreak > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{stats.dailyStreak} Day Streak</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {displayName || 'Cyber Operator'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Test your reflexes against evolving social engineering threats and zero-day psychological tactics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                soundManager.playClick();
                setShowSandbox(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors"
              title="Launch the Domain & URL Threat Sandbox Analyzer"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Threat Sandbox</span>
            </button>
            <button
              onClick={onOpenSetup}
              className="px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Role Profile
            </button>
            <button
              onClick={onLaunchDemo}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Demo Scenario</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-navy-950/70 p-4 rounded-xl border border-navy-800">
            <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
              Best Learning Score
            </span>
            <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">
              {stats.bestScore}
              <span className="text-xs text-slate-400 font-normal">/100</span>
            </div>
          </div>

          <div className="bg-navy-950/70 p-4 rounded-xl border border-navy-800">
            <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
              Challenges Completed
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {stats.totalGamesPlayed}
            </div>
          </div>

          <div className="bg-navy-950/70 p-4 rounded-xl border border-navy-800">
            <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
              Safer Decisions
            </span>
            <div className="text-2xl sm:text-3xl font-black text-teal-400 font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              <span>{stats.saferDecisionsCount}</span>
            </div>
          </div>

          <div className="bg-navy-950/70 p-4 rounded-xl border border-navy-800">
            <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
              Risky Choices
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono flex items-center gap-1.5">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>{stats.riskyDecisionsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Session Resume Banner if present */}
      {hasActiveSession && (
        <div className="bg-gradient-to-r from-teal-950/60 via-cyan-950/60 to-navy-900 border border-cyan-500/40 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-lg animate-pulse-glow">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
              <Play className="w-5 h-5 fill-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">Unfinished Session In Progress</span>
              <h3 className="text-base font-bold text-white">
                Resume {activeSession.mode === 'quick' ? 'Quick Play' : 'Full Challenge'} (Round {activeSession.currentScenarioIndex + 1} of {activeSession.scenarioQueue.length})
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onResumeGame();
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-navy-950 font-bold text-xs transition-colors shrink-0"
          >
            <span>Resume Game</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Game Mode Launchers */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
          Choose Your Next Challenge
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Quick Play */}
          <div className="bg-navy-900/80 border border-navy-800 hover:border-amber-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-amber-500/5 group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-slate-400 bg-navy-950 px-2 py-0.5 rounded border border-navy-800">
                  ~3 Mins
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-1.5">
                Quick Play
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                3 fast-paced realistic scenarios. Ideal for a quick security reflex tune-up.
              </p>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onStartNewGame('quick');
              }}
              className="w-full py-2.5 rounded-xl bg-navy-800 group-hover:bg-amber-500 group-hover:text-navy-950 border border-navy-700 group-hover:border-amber-400 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>Start Quick Play</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Full Challenge */}
          <div className="bg-navy-900/80 border border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-cyan-500/10 group relative">
            <div className="absolute -top-3 right-5 px-2.5 py-0.5 rounded-full bg-cyan-500 text-navy-950 text-[10px] font-bold uppercase tracking-wider">
              Recommended
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-slate-400 bg-navy-950 px-2 py-0.5 rounded border border-navy-800">
                  ~8 Mins
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5">
                Full Challenge
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                8 comprehensive scenarios with active branching storylines and deep adaptive evaluations.
              </p>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onStartNewGame('full');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-navy-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Start Full Challenge</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Practice Library */}
          <div className="bg-navy-900/80 border border-navy-800 hover:border-violet-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-violet-500/5 group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-slate-400 bg-navy-950 px-2 py-0.5 rounded border border-navy-800">
                  Freestyle
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors mb-1.5">
                Practice Library
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Browse all 12 core scenarios + 5 branching storylines with educational takeaways and zero score penalty.
              </p>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenPractice();
              }}
              className="w-full py-2.5 rounded-xl bg-navy-800 group-hover:bg-violet-600 group-hover:text-white border border-navy-700 group-hover:border-violet-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>Explore Library</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Security Skill Profile Grid */}
      <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-6 text-left">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy-800">
          <div>
            <h2 className="text-base font-bold text-white">
              Defensive Skill Competency Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dynamically calculated from your accumulated decisions across all completed challenges.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">Adaptive Radar</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Radar Chart */}
          <div className="lg:col-span-5 flex justify-center py-2 bg-navy-950/40 rounded-2xl border border-navy-800/80">
            <CyberRadarChart skills={stats.skillRatings} size={250} />
          </div>

          {/* Skill Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {(Object.keys(stats.skillRatings) as SkillCategory[]).map((cat) => {
              const item = stats.skillRatings[cat];
              const colors = SKILL_COLORS[cat];
              const pct = item.maxPoints > 0 ? Math.round((item.points / item.maxPoints) * 100) : 0;

              return (
                <div key={cat} className="bg-navy-950/80 p-3.5 rounded-xl border border-navy-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold ${colors.text}`}>
                      {SKILL_LABELS[cat]}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-900 text-slate-300 border border-navy-800">
                      Lvl {item.level} / 5
                    </span>
                  </div>

                  <div className="space-y-1.5 mt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Mastery</span>
                      <span className="font-bold text-white">{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden border border-navy-800">
                      <div 
                        className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, pct)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block text-right">
                      {item.points} / {item.maxPoints} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-6 text-left">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy-800">
          <div>
            <h2 className="text-base font-bold text-white">
              Tactical Achievements
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Badges earned through consistent verification, zero-trust habits, and rapid crisis containment.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400">
            {achievements.filter(a => a.unlockedAt).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {achievements.map((ach) => {
            const isUnlocked = Boolean(ach.unlockedAt);
            return (
              <div 
                key={ach.id}
                className={`p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-navy-950 border-amber-500/40 shadow-sm'
                    : 'bg-navy-950/40 border-navy-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isUnlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-navy-900 text-slate-500'
                  }`}>
                    {isUnlocked ? <Award className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold truncate ${isUnlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                      {ach.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {ach.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sessions Table */}
      {hasHistory && (
        <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-6 text-left">
          <h2 className="text-base font-bold text-white mb-3">
            Recent Assessment History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-navy-950 text-slate-400 font-mono uppercase text-[10px] border-b border-navy-800">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Decisions</th>
                  <th className="py-2.5 px-3">Learning Score</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800">
                {history.slice(-5).reverse().map((s) => (
                  <tr key={s.sessionId} className="hover:bg-navy-950/50">
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {new Date(s.startTime).toLocaleDateString()} {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-navy-800 text-cyan-300 border border-navy-700">
                        {s.mode}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {s.decisions.length} rounds
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {s.normalizedScore} / 100
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onViewSessionReport(s)}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold underline"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings & Local Management Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-navy-950/60 border border-navy-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>All gameplay data is stored in your local browser storage.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data (JSON)</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-navy-700 hover:border-rose-500/40 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Progress</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Reset All Progress?</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              This will permanently delete your session history, achievements, and stats from localStorage. This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowResetConfirm(false);
                  onResetProgress();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Threat Sandbox Modal */}
      <ThreatSandboxModal
        isOpen={showSandbox}
        onClose={() => setShowSandbox(false)}
      />
    </div>
  );
};
