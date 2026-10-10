import React from 'react';
import { AppMode } from '../types/music';

interface ModeToggleProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="w-full max-w-xs mx-auto grid grid-cols-2 gap-1.5 p-1 bg-[#1A1009]/80 rounded-xl border border-[#382215]/80 shadow-md">
      {/* Practice Box */}
      <button
        type="button"
        onClick={() => onModeChange('practice')}
        className={`py-1.5 px-3 rounded-lg text-center transition-all duration-150 cursor-pointer border text-xs sm:text-sm ${
          mode === 'practice'
            ? 'bg-[#FFFDF9] text-stone-900 font-serif font-bold border-stone-200 shadow-sm'
            : 'bg-transparent text-stone-400 font-serif border-transparent hover:text-stone-200'
        }`}
      >
        <span>Practice</span>
      </button>

      {/* Freeplay Box */}
      <button
        type="button"
        onClick={() => onModeChange('freeplay')}
        className={`py-1.5 px-3 rounded-lg text-center transition-all duration-150 cursor-pointer border text-xs sm:text-sm ${
          mode === 'freeplay'
            ? 'bg-[#FFFDF9] text-stone-900 font-serif font-bold border-stone-200 shadow-sm'
            : 'bg-transparent text-stone-400 font-serif border-transparent hover:text-stone-200'
        }`}
      >
        <span>Freeplay</span>
      </button>
    </div>
  );
};
