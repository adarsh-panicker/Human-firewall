import React from 'react';
import { ShieldAlert, Download, RefreshCw, Lock } from 'lucide-react';

interface FooterProps {
  onResetData: () => void;
  onExportData: () => void;
  onOpenHowItWorks: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onResetData,
  onExportData,
  onOpenHowItWorks
}) => {
  return (
    <footer className="mt-auto border-t border-navy-800/80 bg-navy-950/70 py-6 px-4 text-xs text-slate-400 no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Educational Disclaimer */}
        <div className="flex items-start gap-2.5 max-w-2xl text-left">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-slate-400">
            <strong className="text-slate-300">Educational Simulation:</strong> All organizations, domains, and individuals depicted are synthetic. Human Firewall teaches safe digital habits; scores reflect performance within this simulated exercise and do not replace professional compliance or enterprise audits.
          </p>
        </div>

        {/* Local Privacy & Utility actions */}
        <div className="flex items-center flex-wrap gap-4 text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-400" title="All progress is saved in your local browser storage">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Client-Side</span>
          </div>

          <button
            onClick={onExportData}
            className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
            title="Download your full session and score history as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onResetData}
            className="flex items-center gap-1 hover:text-rose-400 transition-colors"
            title="Clear all saved progress and reset to initial state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>

          <button
            onClick={onOpenHowItWorks}
            className="hover:text-slate-200 transition-colors"
          >
            About & Rules
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-navy-900 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-2">
        <span>SafeSpace Hacks 2026 Submission • Human Firewall: The 60-Second Decision Game</span>
        <span>Every click is a choice. Every choice teaches you something.</span>
      </div>
    </footer>
  );
};
