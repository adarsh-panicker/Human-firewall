import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Server, 
  Zap, 
  BookOpen, 
  X,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { GameMode, UserProfile } from '../types/game';
import { soundManager } from '../utils/audio';

interface PlayerSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (profile: UserProfile, displayName: string, mode: GameMode) => void;
  initialProfile: UserProfile;
  initialDisplayName: string;
}

const PROFILES: {
  id: UserProfile;
  title: string;
  icon: React.ReactNode;
  desc: string;
  tagline: string;
}[] = [
  {
    id: 'everyday',
    title: 'Everyday User (Home)',
    icon: <User className="w-5 h-5 text-cyan-400" />,
    desc: 'Delivery tracking SMS, streaming billing alerts, bank fraud calls, hacked friend DMs, and smart home cameras.',
    tagline: 'Home & Everyday Life (No Corporate Jargon)'
  },
  {
    id: 'student',
    title: 'Student',
    icon: <GraduationCap className="w-5 h-5 text-amber-400" />,
    desc: 'Campus Wi-Fi, academic portals, peer file shares, student discounts.',
    tagline: 'Academic & campus safety'
  },
  {
    id: 'office',
    title: 'Office Professional',
    icon: <Briefcase className="w-5 h-5 text-teal-400" />,
    desc: 'Invoices, supplier changes, shared documents, corporate chat, and CEO fraud.',
    tagline: 'Workplace & business resilience'
  },
  {
    id: 'admin',
    title: 'IT Administrator',
    icon: <Server className="w-5 h-5 text-violet-400" />,
    desc: 'MFA fatigue, directory security, root CA certificates, forensic triage.',
    tagline: 'Technical & operational depth'
  }
];

const MODES: {
  id: GameMode;
  title: string;
  count: string;
  time: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'quick',
    title: 'Quick Play',
    count: '3 Scenarios',
    time: '~3 Mins',
    desc: 'A rapid evaluation of everyday cybersecurity reflexes.',
    icon: <Zap className="w-5 h-5 text-amber-400" />
  },
  {
    id: 'full',
    title: 'Full Challenge',
    count: '8 Scenarios',
    time: '~8 Mins',
    desc: 'The complete gauntlet across all 6 core security disciplines.',
    icon: <ShieldCheck className="w-5 h-5 text-teal-400" />
  },
  {
    id: 'practice',
    title: 'Practice Mode',
    count: 'Freestyle',
    time: 'Untimed',
    desc: 'Explore any scenario with detailed educational breakdowns and no score penalties.',
    icon: <BookOpen className="w-5 h-5 text-cyan-400" />
  }
];

export const PlayerSetupModal: React.FC<PlayerSetupModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
  initialProfile,
  initialDisplayName
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || 'everyday');
  const [displayName, setDisplayName] = useState<string>(initialDisplayName || '');
  const [mode, setMode] = useState<GameMode>('quick');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    onStartGame(profile, displayName.trim(), mode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close setup modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">
            Player Setup & Challenge Mode
          </h2>
          <p className="text-sm text-slate-400">
            Tailor scenarios and feedback depth to your everyday digital environment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Display Name (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Display Name <span className="text-slate-400 lowercase font-normal">(optional, stored locally)</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex (or leave blank)"
              maxLength={30}
              className="w-full px-4 py-2.5 rounded-xl bg-navy-950/80 border border-navy-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm transition-colors"
            />
          </div>

          {/* Profile Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Your Role Profile
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROFILES.map((p) => {
                const isSelected = profile === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setProfile(p.id);
                    }}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500/50'
                        : 'bg-navy-950/60 border-navy-800 hover:border-navy-700 hover:bg-navy-950'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-navy-900 border border-navy-800 shrink-0">
                      {p.icon}
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                          {p.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                        {p.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Challenge Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MODES.map((m) => {
                const isSelected = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setMode(m.id);
                    }}
                    className={`flex flex-col p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500/50'
                        : 'bg-navy-950/60 border-navy-800 hover:border-navy-700 hover:bg-navy-950'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 rounded-lg bg-navy-900 border border-navy-800">
                        {m.icon}
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-slate-400 bg-navy-900 px-2 py-0.5 rounded border border-navy-800">
                        {m.time}
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                      {m.title}
                    </span>
                    <span className="text-xs text-cyan-400/90 font-mono mb-1">
                      {m.count}
                    </span>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {m.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-navy-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-navy-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Launch {mode === 'quick' ? 'Quick Play' : mode === 'full' ? 'Full Challenge' : 'Practice Library'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
