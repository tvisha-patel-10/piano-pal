import React from 'react';
import { PianoKeyData } from '../types/music';

interface KeyProps {
  keyData: PianoKeyData;
  isPressed: boolean;
  isTargetChordKey?: boolean;
  isHarmonizedKey?: boolean;
  onPressStart: (noteId: PianoKeyData['id']) => void;
  onPressEnd: (noteId: PianoKeyData['id']) => void;
  style?: React.CSSProperties;
}

export const Key: React.FC<KeyProps> = ({
  keyData,
  isPressed,
  isTargetChordKey = false,
  isHarmonizedKey = false,
  onPressStart,
  onPressEnd,
  style,
}) => {
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Safe fallback if pointer capture unsupported
    }
    onPressStart(keyData.id);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Safe fallback
    }
    onPressEnd(keyData.id);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Safe fallback
    }
    onPressEnd(keyData.id);
  };

  // Black Key styling
  if (keyData.isBlack) {
    return (
      <div
        style={style}
        className="absolute top-0 z-20 h-[62%] select-none touch-none"
      >
        <button
          type="button"
          aria-label={`Key ${keyData.noteName} (${keyData.keyboardKey})`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className={`relative w-full h-full rounded-b-lg transition-all duration-75 flex flex-col justify-end items-center pb-2 focus:outline-none cursor-pointer border ${
            isPressed
              ? 'translate-y-1 bg-gradient-to-b from-stone-900 via-stone-800 to-amber-950 border-amber-400 shadow-sm shadow-amber-900/50 ring-1 ring-amber-400/40'
              : isHarmonizedKey
              ? 'bg-gradient-to-b from-stone-900 via-stone-800 to-amber-900/80 border-amber-400/80 shadow-md'
              : isTargetChordKey
              ? 'bg-gradient-to-b from-stone-900 via-stone-800 to-indigo-950 border-indigo-400 shadow-md shadow-indigo-950/40'
              : 'bg-gradient-to-b from-stone-900 to-stone-800 hover:from-stone-800 hover:to-stone-700 border-stone-950 shadow-lg shadow-black/30'
          }`}
        >
          {/* Practice target guide marker */}
          {isTargetChordKey && !isPressed && (
            <span className="absolute top-2.5 w-2 h-2 rounded-full bg-indigo-400 ring-2 ring-indigo-200/50" />
          )}

          {/* Key label & physical keyboard letter */}
          <div className="flex flex-col items-center gap-0.5 pointer-events-none pb-0.5">
            <span
              className={`text-xs font-serif font-bold tracking-tight ${
                isPressed
                  ? 'text-amber-300'
                  : isTargetChordKey
                  ? 'text-indigo-200'
                  : 'text-stone-300'
              }`}
            >
              {keyData.noteName}
            </span>
            <span
              className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded transition-colors ${
                isPressed
                  ? 'bg-amber-400 text-stone-950'
                  : isTargetChordKey
                  ? 'bg-indigo-500 text-white'
                  : 'bg-stone-700/80 text-stone-300'
              }`}
            >
              {keyData.keyboardKey}
            </span>
          </div>
        </button>
      </div>
    );
  }

  // White Key styling
  return (
    <div
      style={style}
      className="relative flex-1 h-full select-none touch-none"
    >
      <button
        type="button"
        aria-label={`Key ${keyData.noteName} (${keyData.keyboardKey})`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className={`relative w-full h-full rounded-b-xl border transition-all duration-75 flex flex-col justify-end items-center pb-2.5 focus:outline-none cursor-pointer ${
          isPressed
            ? 'translate-y-1 bg-amber-100 text-amber-950 border-amber-400 shadow-inner ring-1 ring-amber-300/80'
            : isHarmonizedKey
            ? 'bg-gradient-to-b from-amber-50/60 to-amber-100/80 border-amber-300 shadow-sm'
            : isTargetChordKey
            ? 'bg-gradient-to-b from-indigo-50/50 via-white to-indigo-100/70 border-indigo-300 shadow-sm shadow-indigo-100'
            : 'bg-gradient-to-b from-white via-stone-50 to-[#F6F4EE] hover:bg-stone-50 border-stone-300/80 shadow-md shadow-stone-400/20'
        }`}
      >
        {/* Practice target guide marker */}
        {isTargetChordKey && !isPressed && (
          <span className="absolute top-4 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-200/60" />
        )}

        {/* Note label & physical keyboard letter */}
        <div className="flex flex-col items-center gap-1 pointer-events-none pb-0.5">
          <span
            className={`text-base sm:text-lg font-serif font-bold tracking-tight leading-none ${
              isPressed
                ? 'text-amber-950'
                : isTargetChordKey
                ? 'text-indigo-900'
                : 'text-stone-700'
            }`}
          >
            {keyData.noteName}
          </span>
          <span
            className={`text-[11px] font-mono font-medium px-1.5 py-0.5 rounded shadow-xs transition-colors ${
              isPressed
                ? 'bg-amber-400 text-stone-900 font-bold'
                : isTargetChordKey
                ? 'bg-indigo-100 text-indigo-900 ring-1 ring-indigo-300'
                : 'bg-stone-100 text-stone-500 ring-1 ring-stone-200/80'
            }`}
          >
            {keyData.keyboardKey}
          </span>
        </div>
      </button>
    </div>
  );
};
