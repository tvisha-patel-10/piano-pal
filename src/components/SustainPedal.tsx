import React from 'react';

interface SustainPedalProps {
  isSustained: boolean;
  onToggleSustain: () => void;
}

export const SustainPedal: React.FC<SustainPedalProps> = ({
  isSustained,
  onToggleSustain,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 bg-stone-100/95 rounded-2xl border border-stone-300/80 shadow-xl shadow-black/25 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {/* Visual Brass Pedal Indicator */}
        <button
          type="button"
          onClick={onToggleSustain}
          className={`group relative flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all duration-150 border cursor-pointer ${
            isSustained
              ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-amber-950 border-amber-600 shadow-md shadow-amber-400/30 translate-y-0.5'
              : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300 shadow-xs'
          }`}
          title="Click to toggle or hold Spacebar"
        >
          {/* Pedal icon / shape */}
          <span
            className={`w-3.5 h-6 rounded-t-sm rounded-b-md transition-colors shadow-inner ${
              isSustained
                ? 'bg-amber-100 border border-amber-300 ring-2 ring-amber-300/60'
                : 'bg-gradient-to-b from-amber-200 to-amber-400 border border-amber-500/50 group-hover:from-amber-300 group-hover:to-amber-500'
            }`}
          />
          <span className="font-medium text-xs sm:text-sm">
            {isSustained ? 'Sustain Pedal Active' : 'Sustain Pedal'}
          </span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono bg-black/10 rounded border border-black/10">
            SPACE
          </kbd>
        </button>

        <span className="text-xs text-stone-500 hidden md:inline">
          {isSustained
            ? 'Notes will ring past key release until pedal is lifted'
            : 'Hold Spacebar while playing to let notes ring out'}
        </span>
      </div>
    </div>
  );
};
