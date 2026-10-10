import React from 'react';
import { PracticeChord, ChordCategory, NotePitch } from '../types/music';
import { Volume2, ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { PIANO_KEYS } from '../data/musicData';

interface PracticePanelProps {
  currentChord: PracticeChord;
  currentIndex: number;
  totalChords: number;
  isMatched: boolean;
  activeNotes: Set<NotePitch>;
  recentNotes: Set<NotePitch>;
  selectedCategory: ChordCategory | 'all';
  onCategoryChange: (category: ChordCategory | 'all') => void;
  onPrevChord: () => void;
  onNextChord: () => void;
  onReplayReference: () => void;
}

export const PracticePanel: React.FC<PracticePanelProps> = ({
  currentChord,
  currentIndex,
  totalChords,
  isMatched,
  activeNotes,
  selectedCategory,
  onCategoryChange,
  onPrevChord,
  onNextChord,
  onReplayReference,
}) => {
  // Category tabs
  const categories: { id: ChordCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'major', label: 'Major Triads' },
    { id: 'minor', label: 'Minor Triads' },
    { id: 'seventh', label: '7th Chords' },
    { id: 'extended', label: 'Extended' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Ultra-compact, low-profile chord card to keep piano high on the screen */}
      <div className="relative overflow-hidden bg-[#FBF8F2]/90 rounded-xl border border-[#DFD7C7] shadow-md shadow-black/20 backdrop-blur-sm px-3.5 py-2.5 sm:px-4 sm:py-3 transition-all space-y-2">
        {/* Row 1: Categories on left, Action buttons on right */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-0.5 bg-[#EDE6D8]/80 rounded-lg border border-[#D8CEBE]">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`px-2 py-0.5 text-[11px] font-medium rounded transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-white/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Action Buttons: Hear Chord & Next Chord (single-line, compact) */}
          <div className="flex flex-row items-center gap-1.5 shrink-0 ml-auto">
            <button
              type="button"
              onClick={onReplayReference}
              className="h-8 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-300/80 shadow-2xs transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="whitespace-nowrap font-bold">Hear Chord</span>
            </button>

            {isMatched ? (
              <button
                type="button"
                onClick={onNextChord}
                className="h-8 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 animate-pulse"
              >
                <span className="whitespace-nowrap font-bold">Next Chord</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono bg-emerald-900/60 rounded">
                  →
                </kbd>
              </button>
            ) : (
              <div className="h-8 flex items-center gap-0.5 border border-stone-200 rounded-lg p-0.5 bg-stone-50 shrink-0 whitespace-nowrap">
                <button
                  type="button"
                  onClick={onPrevChord}
                  aria-label="Previous Chord"
                  className="h-full px-1.5 rounded text-stone-600 hover:text-stone-900 hover:bg-white transition-colors cursor-pointer flex items-center justify-center shrink-0"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onNextChord}
                  aria-label="Next Chord"
                  className="h-full flex items-center gap-1 px-2 rounded text-stone-700 hover:text-stone-950 hover:bg-white text-xs font-bold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <span className="whitespace-nowrap font-bold">Next</span>
                  <ChevronRight className="w-3 h-3" />
                  <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono bg-stone-200/80 text-stone-600 rounded">
                    →
                  </kbd>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Chord Name + Required Notes on left, Completion Status or Hint on right */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-[#E8DFD0]/70">
          {/* Chord Name & Required notes together on same line */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight leading-none">
                {currentChord.name}
              </span>
              <span className="text-xs font-mono text-amber-700 font-bold">
                ({currentChord.shortName})
              </span>
              <span className="text-[11px] text-stone-400 font-serif italic hidden md:inline ml-1">
                {currentIndex + 1}/{totalChords}
              </span>
            </div>

            {/* Required Notes pills */}
            <div className="flex items-center gap-1.5 pl-1 sm:pl-2 sm:border-l border-stone-300/60">
              <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider hidden sm:inline">
                Play:
              </span>
              {currentChord.notes.map((noteId) => {
                const keyData = PIANO_KEYS.find((k) => k.id === noteId);
                const noteLabel = keyData?.noteName || noteId;
                const keyboardKey = keyData?.keyboardKey || '';
                const isNoteActive = activeNotes.has(noteId);

                return (
                  <div
                    key={noteId}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded border text-xs transition-all duration-75 ${
                      isNoteActive
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-xs scale-102'
                        : 'bg-white/80 border-[#DFD6C6] text-stone-700'
                    }`}
                  >
                    <span className={isNoteActive ? 'text-emerald-700 font-bold' : 'text-stone-900 font-semibold'}>
                      {noteLabel}
                    </span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/5 text-stone-600 font-bold">
                      {keyboardKey}
                    </span>
                    {isNoteActive && (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 ml-0.2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Completion status banner or hint */}
          <div>
            {isMatched ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold animate-in fade-in duration-150">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Completed! Press Next (→)</span>
              </div>
            ) : (
              <span className="text-[11px] text-stone-500 font-serif italic hidden lg:inline">
                {currentChord.hint}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
