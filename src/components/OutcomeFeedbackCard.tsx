import React, { useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  HelpCircle, 
  ArrowRight, 
  Shield, 
  TrendingUp, 
  GitBranch 
} from 'lucide-react';
import { DecisionOption, DecisionSafety, Scenario } from '../types/game';
import { SKILL_LABELS } from '../engine/scoringEngine';

interface OutcomeFeedbackCardProps {
  scenario: Scenario;
  chosenOption: DecisionOption;
  onContinue: () => void;
  isBranchingNext: boolean;
  branchTitle?: string;
}

const SAFETY_CONFIG: Record<DecisionSafety, {
  label: string;
  badgeBg: string;
  borderBg: string;
  textColor: string;
  icon: React.ReactNode;
}> = {
  safer: {
    label: 'Safer Decision',
    badgeBg: 'bg-teal-500/15',
    borderBg: 'border-teal-500/40',
    textColor: 'text-teal-300',
    icon: <CheckCircle2 className="w-5 h-5 text-teal-400" />
  },
  partial: {
    label: 'Partially Correct Decision',
    badgeBg: 'bg-blue-500/15',
    borderBg: 'border-blue-500/40',
    textColor: 'text-blue-300',
    icon: <HelpCircle className="w-5 h-5 text-blue-400" />
  },
  risky: {
    label: 'Risky Decision',
    badgeBg: 'bg-amber-500/15',
    borderBg: 'border-amber-500/40',
    textColor: 'text-amber-300',
    icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
  },
  critical: {
    label: 'Critical Security Mistake',
    badgeBg: 'bg-rose-500/15',
    borderBg: 'border-rose-500/40',
    textColor: 'text-rose-300',
    icon: <AlertOctagon className="w-5 h-5 text-rose-400" />
  }
};

export const OutcomeFeedbackCard: React.FC<OutcomeFeedbackCardProps> = ({
  scenario,
  chosenOption,
  onContinue,
  isBranchingNext,
  branchTitle
}) => {
  const cfg = SAFETY_CONFIG[chosenOption.safety];
  const continueBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus continue button for fast keyboard traversal (Enter / Space)
    continueBtnRef.current?.focus();
  }, []);

  return (
    <div className={`mt-6 rounded-2xl border ${cfg.borderBg} ${cfg.badgeBg} p-5 sm:p-6 text-left shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {/* Top Header Badge & Scores */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-navy-700/60">
        <div className="flex items-center gap-2">
          {cfg.icon}
          <span className={`text-sm sm:text-base font-bold ${cfg.textColor}`}>
            {cfg.label}
          </span>
        </div>

        {/* Score & Skill Pills */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
            chosenOption.score > 0 
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' 
              : chosenOption.score < 0
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-slate-800 text-slate-300 border border-slate-700'
          }`}>
            {chosenOption.score > 0 ? `+${chosenOption.score}` : chosenOption.score} Points
          </span>

          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-navy-900 border border-navy-700 text-slate-300">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>{SKILL_LABELS[chosenOption.skillImpact.skill]}</span>
          </span>
        </div>
      </div>

      {/* Immediate Consequence */}
      <div className="mb-4">
        <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-1">
          Direct Consequence
        </h4>
        <p className="text-sm sm:text-base text-white leading-relaxed font-medium">
          {chosenOption.consequence}
        </p>
      </div>

      {/* Security Principle & Why Safer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-navy-950/70 rounded-xl p-4 border border-navy-800/80 mb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Core Security Principle</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white">{chosenOption.securityPrinciple}:</strong> {scenario.safetyTakeaway}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Why The Safer Action Matters</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {chosenOption.saferExplanation}
          </p>
        </div>
      </div>

      {/* Branching Announcement if applicable */}
      {isBranchingNext && (
        <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-violet-950/40 border border-violet-500/40 flex items-center gap-2.5 text-xs text-violet-200">
          <GitBranch className="w-4 h-4 text-violet-400 shrink-0" />
          <span>
            <strong>Branching Storyline:</strong> Your choice has triggered an active scenario branch{branchTitle ? `: "${branchTitle}"` : ''}.
          </span>
        </div>
      )}

      {/* Continue CTA */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Press <kbd className="px-1.5 py-0.5 rounded bg-navy-900 border border-navy-700 text-slate-300 font-mono">Enter</kbd> to continue
        </span>

        <button
          ref={continueBtnRef}
          onClick={onContinue}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-navy-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] ml-auto"
        >
          <span>{isBranchingNext ? 'Continue Along Branch' : 'Next Scenario'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
