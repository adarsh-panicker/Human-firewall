import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  GitBranch, 
  Lock, 
  Award, 
  Sparkles
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left">
        <button
          onClick={onClose}
          aria-label="Close how it works modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white tracking-tight">
            How Human Firewall Works
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-cyan-300 font-medium mb-6">
          Every click is a choice. Every choice teaches you something.
        </p>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Mission */}
          <div>
            <h3 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Realistic Branching Dilemmas, Not Static Quizzes</span>
            </h3>
            <p>
              Traditional corporate security training is boring, multiple-choice, and theoretical. Human Firewall drops you directly inside authentic simulated environments: unexpected MFA push alerts, lookalike invoice payment changes, QR codes in building lobbies, vishing calls from "IT Support", dropped flash drives, and rogue Wi-Fi portals.
            </p>
          </div>

          {/* 60 Seconds Concept */}
          <div>
            <h3 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>The 60-Second Concept</span>
            </h3>
            <p>
              Adversaries rely on urgency and distraction. Each round features a calm 60-second visual indicator to simulate fast real-world decisions. <strong>Crucially, it never auto-submits, penalizes slower readers, or locks you out.</strong> You can pause or reflect at any moment.
            </p>
          </div>

          {/* Branching Engine */}
          <div>
            <h3 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-violet-400" />
              <span>Real Consequences & Narrative Branching</span>
            </h3>
            <p>
              If you approve an unexpected MFA request, the story does not simply say "Wrong". It branches immediately into an <em>Account Compromise & Emergency Revocation</em> crisis scenario where you must contain the breach. If you verify an invoice out-of-band, you branch into an incident advisory helping supply chain partners block fraudulent lookalike domains.
            </p>
          </div>

          {/* Transparent Scoring */}
          <div>
            <h3 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-400" />
              <span>Transparent 0-100 Scoring & 6 Defensive Skills</span>
            </h3>
            <p>
              Points are deterministic and locally computed. We measure six foundational security disciplines:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 font-mono text-xs text-slate-200">
              <li className="bg-navy-950 p-2 rounded border border-navy-800">1. Phishing Recognition</li>
              <li className="bg-navy-950 p-2 rounded border border-navy-800">2. Identity Verification</li>
              <li className="bg-navy-950 p-2 rounded border border-navy-800">3. Authentication Safety</li>
              <li className="bg-navy-950 p-2 rounded border border-navy-800">4. Privacy & Data Handling</li>
              <li className="bg-navy-950 p-2 rounded border border-navy-800">5. Incident Response</li>
              <li className="bg-navy-950 p-2 rounded border border-navy-800">6. Safe Browsing</li>
            </ul>
          </div>

          {/* Privacy */}
          <div>
            <h3 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>100% Client-Side Privacy Guarantee</span>
            </h3>
            <p>
              Human Firewall requires zero registration, zero accounts, and zero API keys. All state is kept strictly on your local browser. It works 100% offline via Progressive Web App caching.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>Created by <strong className="text-cyan-300">Adarsh Panicker</strong> for SafeSpace Hacks 2026</span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs transition-colors"
          >
            Understood, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
