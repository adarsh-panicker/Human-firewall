import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  BookOpen, 
  Printer, 
  Download, 
  ShieldCheck, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameSession, SkillCategory } from '../types/game';
import { generatePersonalizedReport } from '../engine/reportGenerator';
import { calculateSessionScore, SKILL_LABELS } from '../engine/scoringEngine';
import { soundManager } from '../utils/audio';
import { CyberRadarChart } from './CyberRadarChart';
import { ClearanceCertificateModal } from './ClearanceCertificateModal';

interface ResultsReportProps {
  session: GameSession;
  history: GameSession[];
  onReplay: () => void;
  onPracticeWeakSkill: (skill: SkillCategory) => void;
  onExportJson: () => void;
  onReturnDashboard: () => void;
}

export const ResultsReport: React.FC<ResultsReportProps> = ({
  session,
  history,
  onReplay,
  onPracticeWeakSkill,
  onExportJson,
  onReturnDashboard
}) => {
  const [showFullAudit, setShowFullAudit] = useState<boolean>(false);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);

  const scoreReport = calculateSessionScore(session.decisions);
  const reportData = generatePersonalizedReport(session, scoreReport, history);

  // Trigger celebration if score is high (80+)
  useEffect(() => {
    if (scoreReport.normalizedScore >= 80) {
      soundManager.playAchievement();
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback
      }
    }
  }, [scoreReport.normalizedScore]);

  const handlePrint = () => {
    window.print();
  };

  const getScoreRating = (score: number) => {
    if (score >= 90) return { label: 'Cyber Sentinel', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/40' };
    if (score >= 75) return { label: 'Vigilant Defender', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/40' };
    if (score >= 50) return { label: 'Emerging Firewall', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/40' };
    return { label: 'High Exposure Risk', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/40' };
  };

  const rating = getScoreRating(scoreReport.normalizedScore);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8 print:p-0 print:m-0 print:max-w-none">
      {/* Printable Report Header */}
      <div className="bg-navy-900/90 print-surface border border-navy-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-left relative overflow-hidden">
        {/* Top meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-navy-800 print:border-slate-300">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white print-text-dark tracking-tight">
                Security-Awareness Assessment
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Session ID: {session.sessionId} • Player: {session.displayName || 'Anonymous Operator'} • Role: {session.profile.toUpperCase()}
            </p>
          </div>

          {/* Action buttons (hidden when printing) */}
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => setShowCertModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors"
              title="View & print your digital security clearance badge"
            >
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Clearance Badge</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 border border-navy-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              title="Print clean report or save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 border border-navy-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              title="Download session as JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Big Score Meter & Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-navy-800 print:border-slate-300">
          {/* Main Score Gauge */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-navy-950/70 border border-navy-800 print-surface text-center">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Overall Learning Score
            </span>
            <div className="text-5xl sm:text-6xl font-black text-white print-text-dark tracking-tight">
              {scoreReport.normalizedScore}
              <span className="text-xl text-slate-400 font-normal">/100</span>
            </div>
            <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold border ${rating.bg} ${rating.color}`}>
              {rating.label}
            </div>
          </div>

          {/* Decision Counts */}
          <div className="flex flex-col justify-center gap-3 p-6 rounded-2xl bg-navy-950/70 border border-navy-800 print-surface">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Decisions Breakdown
            </span>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-teal-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Safer Decisions</span>
                </span>
                <span className="font-mono font-bold text-white print-text-dark">{scoreReport.saferCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Risky Choices</span>
                </span>
                <span className="font-mono font-bold text-white print-text-dark">{scoreReport.riskyCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-rose-300 font-medium">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Critical Mistakes</span>
                </span>
                <span className="font-mono font-bold text-white print-text-dark">{scoreReport.criticalCount}</span>
              </div>
            </div>
          </div>

          {/* Historical comparison & strongest skill */}
          <div className="flex flex-col justify-center gap-3 p-6 rounded-2xl bg-navy-950/70 border border-navy-800 print-surface">
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400">Strongest Defense</span>
              <p className="text-sm font-bold text-cyan-300">
                {reportData.strongestSkillLabel}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400">Priority Growth Area</span>
              <p className="text-sm font-bold text-amber-300">
                {reportData.weakestSkillLabel}
              </p>
            </div>
            <div className="text-xs text-slate-300 bg-navy-900 p-2 rounded-lg border border-navy-800">
              {reportData.historyComparison.text}
            </div>
          </div>
        </div>

        {/* Personalized Learning Summary */}
        <div className="py-6 border-b border-navy-800 print:border-slate-300">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            Personalized Learning Summary
          </h3>
          <p className="text-sm sm:text-base text-slate-200 print-text-dark leading-relaxed">
            {reportData.summaryText}
          </p>
        </div>

        {/* Category Skill Profile Visual Breakdown */}
        <div className="py-6 border-b border-navy-800 print:border-slate-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Security Skill Profile & Defensive Radar
            </h3>
            <span className="text-[11px] text-cyan-400 font-mono hidden sm:inline">6-Axis Competency Map</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Radar Chart */}
            <div className="lg:col-span-5 flex justify-center py-2 bg-navy-950/40 rounded-2xl border border-navy-800/80">
              <CyberRadarChart skills={scoreReport.categoryScores} size={250} />
            </div>

            {/* Bars List */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(scoreReport.categoryScores) as SkillCategory[]).map((cat) => {
                const entry = scoreReport.categoryScores[cat];
                return (
                  <div key={cat} className="p-3 rounded-xl bg-navy-950/70 border border-navy-800 print-surface">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-200 print-text-dark">{SKILL_LABELS[cat]}</span>
                      <span className="font-mono font-bold text-cyan-300">{entry.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden border border-navy-800">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          entry.percentage >= 80 ? 'bg-teal-400' : entry.percentage >= 50 ? 'bg-cyan-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${entry.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>{entry.decisionCount} rounds</span>
                      <span>{entry.earned} / {entry.maxPossible} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3 Actionable Personalized Recommendations */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              3 Concrete Digital Habits To Adopt
            </h3>
            <span className="text-[11px] text-cyan-400 font-mono">Empirical Recommendations</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {reportData.recommendations.map((rec, idx) => (
              <div 
                key={rec.id}
                className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 print-surface flex items-start gap-3.5 text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-xs text-cyan-300 shrink-0">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white print-text-dark">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-slate-300 print-text-dark leading-relaxed">
                    {rec.action}
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    Why: {rec.whyItMatters}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decision Audit Trail (Expandable) */}
      <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-5 text-left no-print">
        <button
          onClick={() => setShowFullAudit(!showFullAudit)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white"
        >
          <span>Scenario-by-Scenario Decision Review ({session.decisions.length} rounds)</span>
          {showFullAudit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showFullAudit && (
          <div className="mt-4 space-y-3 pt-3 border-t border-navy-800">
            {session.decisions.map((d, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">
                    Round {idx + 1}: {d.scenarioTitle}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    d.safety === 'safer' ? 'bg-teal-500/20 text-teal-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {d.safety.toUpperCase()} ({d.scoreAwarded > 0 ? `+${d.scoreAwarded}` : d.scoreAwarded} pts)
                  </span>
                </div>
                <p className="text-slate-300">
                  <strong className="text-slate-400">Chosen:</strong> {d.chosenText}
                </p>
                <p className="text-slate-400">
                  <strong className="text-slate-400">Takeaway:</strong> {d.securityPrinciple} — {d.consequence}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTAs */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <button
          onClick={onReturnDashboard}
          className="px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
        >
          Return to Dashboard
        </button>

        <div className="flex items-center gap-3">
          {scoreReport.weakestSkill && (
            <button
              onClick={() => onPracticeWeakSkill(scoreReport.weakestSkill!)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Practice Weak Area ({SKILL_LABELS[scoreReport.weakestSkill]})</span>
            </button>
          )}

          <button
            onClick={onReplay}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-navy-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay Challenge</span>
          </button>
        </div>
      </div>

      {/* Clearance Certificate Modal */}
      <ClearanceCertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        session={session}
      />
    </div>
  );
};
