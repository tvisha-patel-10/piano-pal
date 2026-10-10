import React, { useEffect } from 'react';
import { NotePitch } from '../types/music';
import { PIANO_KEYS, WHITE_KEYS, BLACK_KEYS } from '../data/musicData';
import { Key } from './Key';

interface PianoProps {
  activeNotes: Set<NotePitch>;
  harmonizedNotes?: Set<NotePitch>;
  targetChordNotes?: NotePitch[];
  onNoteStart: (noteId: NotePitch) => void;
  onNoteEnd: (noteId: NotePitch) => void;
  onSustainChange: (active: boolean) => void;
}

const BLACK_KEY_POSITIONS: Record<string, number> = {
  'C#4': 1,
  'D#4': 2,
  'F#4': 4,
  'G#4': 5,
  'A#4': 6,
  'C#5': 8,
  'D#5': 9,
};

export const Piano: React.FC<PianoProps> = ({
  activeNotes,
  harmonizedNotes = new Set(),
  targetChordNotes = [],
  onNoteStart,
  onNoteEnd,
  onSustainChange,
}) => {
  // Global physical keyboard & window pointer listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        onSustainChange(true);
        return;
      }

      if (e.repeat) return;

      const keyData = PIANO_KEYS.find(
        (k) =>
          k.keyCodes.includes(e.code) ||
          k.keyCodes.includes(e.key) ||
          k.keyCodes.includes(e.key.toLowerCase()) ||
          k.keyboardKey.toLowerCase() === e.key.toLowerCase()
      );

      if (keyData) {
        e.preventDefault();
        onNoteStart(keyData.id);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        onSustainChange(false);
        return;
      }

      const keyData = PIANO_KEYS.find(
        (k) =>
          k.keyCodes.includes(e.code) ||
          k.keyCodes.includes(e.key) ||
          k.keyCodes.includes(e.key.toLowerCase()) ||
          k.keyboardKey.toLowerCase() === e.key.toLowerCase()
      );

      if (keyData) {
        e.preventDefault();
        onNoteEnd(keyData.id);
      }
    };

    const handleWindowBlur = () => {
      activeNotes.forEach((n) => onNoteEnd(n));
      onSustainChange(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [activeNotes, onNoteStart, onNoteEnd, onSustainChange]);

  const targetNotesSet = new Set(targetChordNotes);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Grand Piano Bed / Casing */}
      <div className="relative p-3.5 sm:p-5 pb-5 sm:pb-7 rounded-3xl bg-gradient-to-b from-[#252629] via-[#18191B] to-[#0D0E0F] shadow-2xl shadow-black/80 ring-1 ring-white/10 border border-stone-800">
        {/* Felt Red Rail on top of keys */}
        <div className="h-2.5 w-full rounded-t-lg bg-gradient-to-r from-red-900 via-red-600 to-red-900 shadow-inner mb-0.5 opacity-95" />

        {/* Piano Keyboard Surface - Generous, grand tactile height */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 flex rounded-b-2xl overflow-hidden shadow-2xl bg-[#E8E6E0] select-none">
          {/* White Keys Row (11 keys) */}
          {WHITE_KEYS.map((keyData) => {
            const isPressed = activeNotes.has(keyData.id);
            const isTarget = targetNotesSet.has(keyData.id);
            const isHarmonized = harmonizedNotes.has(keyData.id);

            return (
              <Key
                key={keyData.id}
                keyData={keyData}
                isPressed={isPressed}
                isTargetChordKey={isTarget}
                isHarmonizedKey={isHarmonized}
                onPressStart={onNoteStart}
                onPressEnd={onNoteEnd}
              />
            );
          })}

          {/* Black Keys Row (7 keys overlaid) */}
          {BLACK_KEYS.map((keyData) => {
            const boundaryIndex = BLACK_KEY_POSITIONS[keyData.id];
            if (boundaryIndex === undefined) return null;

            const isPressed = activeNotes.has(keyData.id);
            const isTarget = targetNotesSet.has(keyData.id);
            const isHarmonized = harmonizedNotes.has(keyData.id);

            const leftPct = (boundaryIndex / 11) * 100;
            const widthPct = 5.9;

            return (
              <Key
                key={keyData.id}
                keyData={keyData}
                isPressed={isPressed}
                isTargetChordKey={isTarget}
                isHarmonizedKey={isHarmonized}
                onPressStart={onNoteStart}
                onPressEnd={onNoteEnd}
                style={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  transform: 'translateX(-50%)',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
