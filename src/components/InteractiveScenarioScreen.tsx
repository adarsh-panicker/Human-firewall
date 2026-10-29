import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Clock, 
  Pause, 
  Play, 
  LogOut, 
  Shield, 
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { DecisionOption, Scenario, UserProfile } from '../types/game';
import { SKILL_LABELS, SKILL_COLORS } from '../engine/scoringEngine';
import { SimulatedMessage } from './SimulatedMessage';
import { DecisionOptionCard } from './DecisionOptionCard';
import { OutcomeFeedbackCard } from './OutcomeFeedbackCard';
import { soundManager } from '../utils/audio';

interface InteractiveScenarioScreenProps {
  scenario: Scenario;
  currentRound: number;
  totalRounds: number;
  userProfile: UserProfile;
  onDecisionMade: (option: DecisionOption, timeSpentSeconds: number) => void;
  onContinue: () => void;
  onExit: () => void;
  isBranchingNext: boolean;
  branchTitle?: string;
  adaptiveNote?: string;
}

const DIFFICULTY_CONFIG = {
  beginner: { label: 'Beginner', bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
  intermediate: { label: 'Intermediate', bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
  advanced: { label: 'Advanced', bg: 'bg-violet-500/10 text-violet-300 border-violet-500/30' }
};

export const InteractiveScenarioScreen: React.FC<InteractiveScenarioScreenProps> = ({
  scenario,
  currentRound,
  totalRounds,
  userProfile,
  onDecisionMade,
  onContinue,
  onExit,
  isBranchingNext,
  branchTitle,
  adaptiveNote
}) => {
  // Timer: 60 seconds concept
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<any>(null);

  // Reset state when scenario changes
  useEffect(() => {
    setSecondsRemaining(60);
    setIsPaused(false);
    setHasAnswered(false);
    setSelectedOption(null);
    setShowExitConfirm(false);
    startTimeRef.current = Date.now();
  }, [scenario.id]);

  // Calm timer countdown (non-punitive: counts down to 0, never auto-submits)
  useEffect(() => {
    if (hasAnswered || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Timer reached 0; remains at 0 without forcing or penalizing reading
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasAnswered, isPaused]);

  // Handle option selection
  const handleSelectOption = useCallback((option: DecisionOption) => {
    if (hasAnswered) return; // Prevent double scoring
    setHasAnswered(true);
    setSelectedOption(option);

    // Audio feedback
    if (option.safety === 'safer') {
      soundManager.playSuccess();
    } else {
      soundManager.playWarning();
    }

    const timeSpent = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    onDecisionMade(option, timeSpent);
  }, [hasAnswered, onDecisionMade]);

  // Keyboard navigation: 1-4 for options, Enter to continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if modifier keys pressed
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (!hasAnswered) {
        if (e.key === '1' && scenario.options[0]) handleSelectOption(scenario.options[0]);
        else if (e.key === '2' && scenario.options[1]) handleSelectOption(scenario.options[1]);
        else if (e.key === '3' && scenario.options[2]) handleSelectOption(scenario.options[2]);
        else if (e.key === '4' && scenario.options[3]) handleSelectOption(scenario.options[3]);
      } else {
        if (e.key === 'Enter') {
          e.preventDefault();
          soundManager.playClick();
          onContinue();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasAnswered, scenario.options, handleSelectOption, onContinue]);

  const skillColor = SKILL_COLORS[scenario.category] || SKILL_COLORS.phishing;
  const diffCfg = DIFFICULTY_CONFIG[scenario.difficulty] || DIFFICULTY_CONFIG.beginner;
  const progressPercent = Math.round((currentRound / totalRounds) * 100);

  // Profile-specific narrative flavor if defined
  const profileHint = scenario.profileFlavor?.[userProfile];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col gap-6">
      {/* Top Header Bar: Progress, Timer, Pause, Exit */}
      <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          {/* Category & Difficulty */}
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${skillColor.bg} ${skillColor.text} ${skillColor.border}`}>
              {SKILL_LABELS[scenario.category]}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono border ${diffCfg.bg}`}>
              {diffCfg.label}
            </span>
          </div>

          {/* 60-Second Challenge Timer & Controls */}
          <div className="flex items-center gap-2">
            <div 
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-colors ${
                secondsRemaining <= 10
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                  : 'bg-navy-950 text-cyan-300 border-navy-700'
              }`}
              title="60-Second challenge indicator (does not force or auto-submit)"
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{secondsRemaining}s</span>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? 'Resume scenario timer' : 'Pause scenario timer'}
              className="p-1.5 rounded-lg bg-navy-950 hover:bg-navy-800 border border-navy-700 text-slate-400 hover:text-white transition-colors"
              title={isPaused ? 'Resume timer' : 'Pause timer'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setShowExitConfirm(true)}
              aria-label="Exit current challenge"
              className="p-1.5 rounded-lg bg-navy-950 hover:bg-rose-950/50 border border-navy-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-colors"
              title="Exit challenge"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Round Number */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Round {currentRound} of {totalRounds}</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full h-1.5 bg-navy-950 rounded-full overflow-hidden border border-navy-800">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Adaptive Recommendation Note if present */}
      {adaptiveNote && (
        <div className="bg-cyan-950/40 border border-cyan-500/40 rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-xs text-cyan-200">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{adaptiveNote}</span>
        </div>
      )}

      {/* Scenario Narrative Box */}
      <div className="bg-navy-900/80 border border-navy-700/80 rounded-2xl p-6 text-left shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {scenario.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
          {scenario.narrative}
        </p>

        {/* Profile-specific contextual tip */}
        {profileHint && (
          <div className="inline-flex items-start gap-2 bg-navy-950/80 border border-navy-800 rounded-xl p-3 text-xs text-slate-300">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-200">Contextual Lens:</strong> {profileHint}
            </span>
          </div>
        )}
      </div>

      {/* Simulated Artifact / Message Screen */}
      <SimulatedMessage scenario={scenario} />

      {/* Decision Options */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Choose Your Action</span>
          <span className="hidden sm:inline">Use keys [1] - [{scenario.options.length}]</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {scenario.options.map((option, idx) => (
            <DecisionOptionCard
              key={option.id}
              option={option}
              index={idx}
              isSelected={selectedOption?.id === option.id}
              isDisabled={hasAnswered}
              onSelect={handleSelectOption}
            />
          ))}
        </div>
      </div>

      {/* Outcome Feedback Card once answered */}
      {hasAnswered && selectedOption && (
        <OutcomeFeedbackCard
          scenario={scenario}
          chosenOption={selectedOption}
          onContinue={onContinue}
          isBranchingNext={isBranchingNext}
          branchTitle={branchTitle}
        />
      )}

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <Shield className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Exit Current Challenge?</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Your decisions so far will be saved in your session history. You can start a new challenge anytime.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-700 transition-colors"
              >
                Keep Playing
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onExit();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors"
              >
                Exit to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
