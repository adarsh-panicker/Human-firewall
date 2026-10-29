import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Printer, 
  Lock,
  Zap
} from 'lucide-react';
import { GameSession } from '../types/game';

interface ClearanceCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: GameSession;
}

export const ClearanceCertificateModal: React.FC<ClearanceCertificateModalProps> = ({
  isOpen,
  onClose,
  session
}) => {
  if (!isOpen) return null;

  const getRank = (score: number) => {
    if (score >= 90) return { title: 'Master Cyber Sentinel', level: 'Level 5 (Elite Defense)', color: 'text-teal-400' };
    if (score >= 75) return { title: 'Vigilant Defender', level: 'Level 4 (Hardened Perimeter)', color: 'text-cyan-400' };
    if (score >= 50) return { title: 'Active Firewall Operator', level: 'Level 3 (Operational)', color: 'text-amber-400' };
    return { title: 'Defense Trainee', level: 'Level 2 (In Training)', color: 'text-rose-400' };
  };

  const rank = getRank(session.normalizedScore);
  const certDate = new Date(session.startTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const certHash = `HF-${session.sessionId}-${Math.abs(session.normalizedScore * 997).toString(16).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-navy-900 border border-cyan-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto text-center">
        <button
          onClick={onClose}
          aria-label="Close certificate modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors no-print"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Container with decorative border */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 border-2 border-cyan-500/50 shadow-inner relative overflow-hidden">
          {/* Corner accents */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

          {/* Badge Icon */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-400/60 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
              <Zap className="w-5 h-5 text-amber-400 absolute fill-amber-400" />
            </div>
          </div>

          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 inline-block mb-2">
            SafeSpace Hacks 2026 • Security Clearance
          </span>

          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase mb-1">
            Human Firewall Certification
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Verification of Cyber Situational Reflexes & Defensive Decision-Making
          </p>

          <div className="my-6 py-4 border-y border-navy-800 bg-navy-950/60 rounded-xl space-y-1">
            <span className="text-xs text-slate-400 uppercase font-mono">This Certifies That</span>
            <div className="text-xl sm:text-2xl font-black text-cyan-300 tracking-wide font-sans">
              {session.displayName || 'Authorized Defense Operator'}
            </div>
            <span className="text-xs text-slate-400 block font-mono">
              Assigned Role: {session.profile.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6 text-left">
            <div className="bg-navy-900 p-3 rounded-xl border border-navy-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Clearance Rank</span>
              <span className={`text-sm font-bold block ${rank.color}`}>{rank.title}</span>
              <span className="text-[10px] text-slate-400 font-mono">{rank.level}</span>
            </div>
            <div className="bg-navy-900 p-3 rounded-xl border border-navy-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Assessment Score</span>
              <span className="text-xl font-black text-white font-mono block">
                {session.normalizedScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </span>
              <span className="text-[10px] text-teal-400 font-mono">{session.decisions.length} Scenarios Completed</span>
            </div>
          </div>

          {/* Footer of certificate */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-navy-800/80 font-mono gap-2">
            <span>Date Issued: {certDate}</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Verify: {certHash}</span>
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-navy-800 hover:bg-navy-700 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Clearance Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
