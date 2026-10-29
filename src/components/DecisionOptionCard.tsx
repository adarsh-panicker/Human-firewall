import React from 'react';
import { DecisionOption } from '../types/game';

interface DecisionOptionCardProps {
  option: DecisionOption;
  index: number;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (option: DecisionOption) => void;
}

export const DecisionOptionCard: React.FC<DecisionOptionCardProps> = ({
  option,
  index,
  isSelected,
  isDisabled,
  onSelect
}) => {
  const shortcutKey = index + 1;

  return (
    <button
      type="button"
      onClick={() => onSelect(option)}
      disabled={isDisabled}
      className={`group relative w-full p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 flex items-start gap-4 ${
        isSelected
          ? 'bg-cyan-500/10 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/10'
          : isDisabled
          ? 'opacity-60 cursor-not-allowed bg-navy-900/40 border-navy-800'
          : 'bg-navy-900/80 border-navy-700/80 hover:bg-navy-850 hover:border-cyan-500/50 hover:shadow-md hover:shadow-cyan-500/5 active:scale-[0.99]'
      }`}
    >
      {/* Number Badge with Keyboard hint */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 transition-colors ${
        isSelected
          ? 'bg-cyan-400 text-navy-950 shadow'
          : 'bg-navy-800 text-slate-300 border border-navy-700 group-hover:border-cyan-500/60 group-hover:text-cyan-300'
      }`}>
        {shortcutKey}
      </div>

      {/* Decision Option Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className={`text-sm sm:text-base leading-snug font-medium transition-colors ${
          isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
        }`}>
          {option.text}
        </p>
      </div>
    </button>
  );
};
