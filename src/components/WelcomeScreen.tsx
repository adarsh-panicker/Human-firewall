import React, { useState } from 'react';
import { 
  Shield, 
  Zap, 
  Play, 
  HelpCircle, 
  Clock, 
  Lock, 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface WelcomeScreenProps {
  onStartPlaying: () => void;
  onLaunchDemo: () => void;
  onOpenHowItWorks: () => void;
  onPracticeMode: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartPlaying,
  onLaunchDemo,
  onOpenHowItWorks,
  onPracticeMode
}) => {
  // Mini interactive preview on the welcome screen
  const [miniDecision, setMiniDecision] = useState<'idle' | 'approved' | 'denied'>('idle');

  const handleMiniApprove = () => {
    soundManager.playWarning();
    setMiniDecision('approved');
  };

  const handleMiniDeny = () => {
    soundManager.playSuccess();
    setMiniDecision('denied');
  };

  const handleResetMini = () => {
    setMiniDecision('idle');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 flex flex-col gap-12">
      {/* Hero Section */}
      <div className="text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-6 animate-pulse-glow">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>SafeSpace Hacks 2026 • By Adarsh Panicker</span>
        </div>

        {/* Logo and Title */}
        <div className="relative mb-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-cyan-500/30 via-navy-800 to-navy-950 border-2 border-cyan-400/50 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
            <Shield className="w-12 h-12 sm:w-14 sm:h-14 text-cyan-400" />
            <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 absolute fill-amber-400 drop-shadow-md" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-2">
          Human Firewall
        </h1>
        <p className="text-xl sm:text-2xl font-medium text-cyan-300 mb-1">
          The 60-Second Decision Game
        </p>
        <p className="text-xs sm:text-sm font-mono text-slate-400 mb-4">
          Created & Designed by <span className="text-cyan-400 font-bold">Adarsh Panicker</span>
        </p>
        <p className="text-slate-300 max-w-2xl text-base sm:text-lg leading-relaxed mb-8">
          <strong className="text-white">Every click is a choice. Every choice teaches you something.</strong>
          <br className="hidden sm:inline" /> Real-world security decisions, instant branching consequences, and personalized digital habits.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              onStartPlaying();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-navy-950 font-bold text-base shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-5 h-5 fill-navy-950" />
            <span>Start Playing</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onLaunchDemo();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-base transition-all hover:border-amber-400"
          >
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>Try Demo Scenario</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenHowItWorks();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-navy-800/80 hover:bg-navy-800 border border-navy-700 text-slate-300 hover:text-white font-medium text-sm transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>How It Works</span>
          </button>
        </div>
      </div>

      {/* Mini Interactive Preview Teaser */}
      <div className="max-w-2xl mx-auto w-full bg-navy-900/90 border border-navy-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-navy-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs uppercase font-mono tracking-wider font-semibold text-cyan-300">
              Interactive Preview • Try a 5-Second Choice
            </span>
          </div>
          <span className="text-xs text-slate-400">Simulated Notification</span>
        </div>

        {/* Simulated Phone Alert Box */}
        <div className="bg-navy-950/80 border border-navy-800 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-200">Account Security Alert</span>
                <span className="text-[11px] text-slate-400">Just now</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Sign-in authorization for <span className="font-mono text-cyan-300">alex.taylor@gmail.com</span>
              </p>
              <div className="mt-2 text-[11px] bg-navy-900/90 p-2 rounded text-slate-300 font-mono border border-navy-800/80">
                📍 Location: Bucharest, Romania • IP: 185.220.101.44
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Decisions */}
        {miniDecision === 'idle' && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleMiniApprove}
              className="flex-1 py-2.5 px-4 rounded-lg bg-navy-800 hover:bg-rose-950/60 border border-navy-700 hover:border-rose-500/50 text-slate-200 hover:text-rose-200 text-xs font-semibold transition-all text-center"
            >
              Approve Prompt
            </button>
            <button
              onClick={handleMiniDeny}
              className="flex-1 py-2.5 px-4 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/50 text-teal-300 text-xs font-semibold transition-all text-center"
            >
              Deny & Block Intruder
            </button>
          </div>
        )}

        {miniDecision === 'approved' && (
          <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-3.5 text-left animate-in fade-in">
            <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Critical Risk: Adversary Session Granted!</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              You did not initiate this login from Romania. Approving it grants an attacker full access to your files (MFA Push Fatigue attack).
            </p>
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={handleResetMini}
                className="text-slate-400 hover:text-slate-200 underline"
              >
                Try again
              </button>
              <button
                onClick={onStartPlaying}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Play the real scenario</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {miniDecision === 'denied' && (
          <div className="bg-teal-950/40 border border-teal-500/40 rounded-xl p-3.5 text-left animate-in fade-in">
            <div className="flex items-center gap-2 text-teal-300 font-semibold text-xs mb-1">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Safer Choice: Attack Blocked!</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Spot on. Never approve unprompted sign-in notifications. Denying stops the intruder from breaching your account, and changing your password protects your personal data.
            </p>
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={handleResetMini}
                className="text-slate-400 hover:text-slate-200 underline"
              >
                Reset preview
              </button>
              <button
                onClick={onStartPlaying}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Start Full Game</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3 Core Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-6 text-left">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4">
            <Compass className="w-5 h-5 text-teal-400" />
          </div>
          <h3 className="font-bold text-lg text-white mb-2">
            Branching Narrative Engine
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Your decisions trigger dynamic storylines. Make a risky choice and enter an active incident recovery branch; make a safe choice and conduct forensic root cause analysis.
          </p>
        </div>

        <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-6 text-left">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="font-bold text-lg text-white mb-2">
            The 60-Second Challenge
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Cyber threats exploit hurried, distracted humans. The calm countdown trains rapid situational awareness without ever auto-submitting or penalizing reading speed.
          </p>
        </div>

        <div className="bg-navy-900/60 border border-navy-800 rounded-2xl p-6 text-left">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mb-4">
            <Award className="w-5 h-5 text-violet-400" />
          </div>
          <h3 className="font-bold text-lg text-white mb-2">
            Personalized Action Plan
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Receive a transparent report measuring 6 defensive skills, complete with 3 concrete actionable habits, comparison with previous runs, and printable exports.
          </p>
        </div>
      </div>

      {/* Privacy and Simulation Callout */}
      <div className="bg-navy-900/40 border border-navy-800/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-base">
              Privacy First & 100% Offline Capable
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Zero registration. Zero tracking. All progress and scoring calculations run entirely inside your browser.
            </p>
          </div>
        </div>

        <button
          onClick={onPracticeMode}
          className="shrink-0 text-xs font-semibold px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 border border-navy-700 text-slate-300 hover:text-white transition-colors"
        >
          Browse Practice Library
        </button>
      </div>
    </div>
  );
};
