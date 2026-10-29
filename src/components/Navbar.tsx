import React from 'react';
import { Shield, Zap, Volume2, VolumeX, Home, HelpCircle, Globe } from 'lucide-react';
import { UserProfile } from '../types/game';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: 'welcome' | 'dashboard' | 'practice') => void;
  onLaunchDemo: () => void;
  onOpenHowItWorks: () => void;
  onOpenThreatSandbox: () => void;
  onOpenAiCopilot: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  userProfile: UserProfile;
  displayName: string;
}

const PROFILE_LABELS: Record<UserProfile, string> = {
  everyday: 'Everyday User',
  student: 'Student',
  office: 'Office Professional',
  admin: 'IT Administrator'
};

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onLaunchDemo,
  onOpenHowItWorks,
  onOpenThreatSandbox,
  onOpenAiCopilot,
  soundEnabled,
  onToggleSound,
  userProfile,
  displayName
}) => {
  return (
    <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-md border-b border-navy-800/80 px-4 lg:px-8 py-3 transition-colors no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => onNavigate('welcome')}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan rounded-lg p-1"
          aria-label="Human Firewall Home"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-navy-900 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:border-cyan-400 transition-colors">
            <Shield className="w-6 h-6 text-cyan-400 group-hover:scale-105 transition-transform" />
            <Zap className="w-3.5 h-3.5 text-amber-400 absolute fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                Human Firewall
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-mono font-bold tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-800/80 rounded">
                60-Sec
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              The 60-Second Decision Game <span className="text-slate-500">•</span> <span className="text-cyan-400 font-medium">By Adarsh Panicker</span>
            </p>
          </div>
        </button>

        {/* Center / Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentView !== 'game' && (
            <button
              onClick={onLaunchDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-400 transition-all shadow-sm"
              title="Instant zero-setup demo of the unexpected MFA challenge"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span>Demo Scenario</span>
            </button>
          )}

          <button
            onClick={onOpenAiCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-teal-500/15 to-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 transition-all shadow-sm"
            title="Launch the AI Cyber Copilot & Forensic Threat Deconstruction Lab"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Lab</span>
          </button>

          <button
            onClick={onOpenThreatSandbox}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 hover:text-white border border-navy-700 transition-colors shadow-sm"
            title="Scan any website link to check if it is legitimate, fake, or spam"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Link Scanner</span>
          </button>

          <button
            onClick={onOpenHowItWorks}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white hover:bg-navy-800/80 border border-transparent hover:border-navy-700 transition-colors"
            title="How the game works"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">How It Works</span>
          </button>

          {currentView !== 'welcome' && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800/80 border-transparent hover:border-navy-700'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800/80 border border-transparent hover:border-navy-700 transition-colors"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Profile Pill */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-navy-800 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-left">
              <span className="text-slate-200 font-medium block leading-tight">
                {displayName ? displayName : PROFILE_LABELS[userProfile]}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {PROFILE_LABELS[userProfile]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
