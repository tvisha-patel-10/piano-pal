/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AppMode, ChordCategory, MusicalScale, NotePitch, SoundProfile } from './types/music';
import { PRACTICE_CHORDS, getAutoHarmonizeNotes } from './data/musicData';
import { audioEngine } from './audio/audioEngine';
import { ModeToggle } from './components/ModeToggle';
import { Piano } from './components/Piano';
import { PracticePanel } from './components/PracticePanel';
import { FreeplayControls } from './components/FreeplayControls';
import { SustainPedal } from './components/SustainPedal';

export default function App() {
  // App mode
  const [mode, setMode] = useState<AppMode>('practice');

  // Active playing keys
  const [activeNotes, setActiveNotes] = useState<Set<NotePitch>>(new Set());
  const [harmonizedNotes, setHarmonizedNotes] = useState<Set<NotePitch>>(new Set());
  const [isSustained, setIsSustained] = useState(false);

  // Audio settings
  const [volume, setVolume] = useState(0.85);
  const [soundProfile, setSoundProfile] = useState<SoundProfile>('grand');

  // Practice Mode state
  const [selectedCategory, setSelectedCategory] = useState<ChordCategory | 'all'>('all');
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [isMatched, setIsMatched] = useState(false);

  // Recent notes buffer for rapid arpeggio / rolling chord detection (tight 300ms window)
  const recentNotesRef = useRef<Map<NotePitch, number>>(new Map());
  const [recentNotesDisplay, setRecentNotesDisplay] = useState<Set<NotePitch>>(new Set());

  // Freeplay Mode state
  const [autoHarmonize, setAutoHarmonize] = useState(true);
  const [selectedScale, setSelectedScale] = useState<MusicalScale>('C-major');
  const [lastHarmonizedChord, setLastHarmonizedChord] = useState<string | null>(null);

  // Mapping from trigger note to active harmonized notes in Freeplay
  const harmonyMapRef = useRef<Map<NotePitch, NotePitch[]>>(new Map());

  // Filtered practice chords list
  const filteredChords = useMemo(() => {
    if (selectedCategory === 'all') return PRACTICE_CHORDS;
    return PRACTICE_CHORDS.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  // Current active practice chord
  const currentChord = filteredChords[practiceIndex] || filteredChords[0];

  // Update audio engine settings on change
  useEffect(() => {
    audioEngine.setMasterVolume(volume);
  }, [volume]);

  useEffect(() => {
    audioEngine.setSoundProfile(soundProfile);
  }, [soundProfile]);

  const handleSustainChange = useCallback((active: boolean) => {
    setIsSustained(active);
    audioEngine.setSustain(active);
  }, []);

  // Periodic fast cleanup of recent notes buffer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let changed = false;
      recentNotesRef.current.forEach((time, note) => {
        if (now - time > 300) {
          recentNotesRef.current.delete(note);
          changed = true;
        }
      });
      if (changed) {
        setRecentNotesDisplay(new Set(recentNotesRef.current.keys()));
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // Handle Note Start
  const handleNoteStart = useCallback(
    (noteId: NotePitch) => {
      if (mode === 'freeplay' && autoHarmonize) {
        const harmony = getAutoHarmonizeNotes(noteId, selectedScale);
        harmonyMapRef.current.set(noteId, harmony.notes);
        setLastHarmonizedChord(harmony.chordName);

        harmony.notes.forEach((hNote) => {
          audioEngine.playNote(hNote);
        });

        setActiveNotes((prev) => new Set([...prev, noteId]));
        setHarmonizedNotes((prev) => new Set([...prev, ...harmony.notes]));
      } else {
        audioEngine.playNote(noteId);
        setActiveNotes((prev) => new Set([...prev, noteId]));

        if (mode === 'practice') {
          recentNotesRef.current.set(noteId, Date.now());
          setRecentNotesDisplay(new Set(recentNotesRef.current.keys()));
        }
      }
    },
    [mode, autoHarmonize, selectedScale]
  );

  // Handle Note End
  const handleNoteEnd = useCallback(
    (noteId: NotePitch) => {
      if (mode === 'freeplay' && autoHarmonize) {
        const harmonyNotes = harmonyMapRef.current.get(noteId) || [noteId];
        harmonyNotes.forEach((hNote) => {
          audioEngine.stopNote(hNote);
        });
        harmonyMapRef.current.delete(noteId);

        setActiveNotes((prev) => {
          const next = new Set(prev);
          next.delete(noteId);
          return next;
        });

        const remainingHarmony = new Set<NotePitch>();
        harmonyMapRef.current.forEach((notes) => {
          notes.forEach((n) => remainingHarmony.add(n));
        });
        setHarmonizedNotes(remainingHarmony);
      } else {
        audioEngine.stopNote(noteId);
        setActiveNotes((prev) => {
          const next = new Set(prev);
          next.delete(noteId);
          return next;
        });

        // Instant release from recent notes
        recentNotesRef.current.delete(noteId);
        setRecentNotesDisplay(new Set(recentNotesRef.current.keys()));
      }
    },
    [mode, autoHarmonize]
  );

  // Global window pointerup to prevent any stuck clicked notes
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (mode === 'practice') {
        setActiveNotes((prev) => {
          if (prev.size === 0) return prev;
          prev.forEach((n) => audioEngine.stopNote(n));
          return new Set();
        });
        recentNotesRef.current.clear();
        setRecentNotesDisplay(new Set());
      }
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [mode]);

  // Check Practice Chord Match
  useEffect(() => {
    if (mode !== 'practice' || isMatched || !currentChord) return;

    const targetNotes = currentChord.notes;
    const allNotesMatched = targetNotes.every(
      (n) => activeNotes.has(n) || recentNotesRef.current.has(n)
    );

    if (allNotesMatched) {
      setIsMatched(true);
      audioEngine.playSuccessChime();
    }
  }, [activeNotes, currentChord, isMatched, mode]);

  // Next / Prev chord handlers
  const handlePrevChord = useCallback(() => {
    setIsMatched(false);
    recentNotesRef.current.clear();
    setRecentNotesDisplay(new Set());
    setPracticeIndex((prev) => (prev - 1 + filteredChords.length) % filteredChords.length);
  }, [filteredChords.length]);

  const handleNextChord = useCallback(() => {
    setIsMatched(false);
    recentNotesRef.current.clear();
    setRecentNotesDisplay(new Set());
    setPracticeIndex((prev) => (prev + 1) % filteredChords.length);
  }, [filteredChords.length]);

  // Arrow key shortcuts (ArrowRight for Next, ArrowLeft for Prev)
  useEffect(() => {
    const handleArrowKeyNav = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextChord();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevChord();
      }
    };

    window.addEventListener('keydown', handleArrowKeyNav);
    return () => window.removeEventListener('keydown', handleArrowKeyNav);
  }, [handleNextChord, handlePrevChord]);

  // Mode change handler
  const handleModeChange = (newMode: AppMode) => {
    setIsMatched(false);
    audioEngine.stopAllNotes();
    setActiveNotes(new Set());
    setHarmonizedNotes(new Set());
    recentNotesRef.current.clear();
    setRecentNotesDisplay(new Set());
    setMode(newMode);
  };

  // Replay reference chord
  const handleReplayReference = () => {
    if (!currentChord) return;
    audioEngine.playChordPreview(currentChord.notes, 1600, 40);
  };

  const handleCategoryChange = (cat: ChordCategory | 'all') => {
    setIsMatched(false);
    setSelectedCategory(cat);
    setPracticeIndex(0);
    recentNotesRef.current.clear();
    setRecentNotesDisplay(new Set());
  };

  return (
    <div className="min-h-screen wood-desk-surface text-stone-900 flex flex-col justify-start selection:bg-amber-200 pt-3 sm:pt-4 pb-10">
      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 flex flex-col gap-2.5 sm:gap-3">
        {/* Mode Switcher */}
        <div className="flex items-center justify-center">
          <ModeToggle mode={mode} onModeChange={handleModeChange} />
        </div>

        {/* Dynamic Panel: Practice or Freeplay */}
        {mode === 'practice' ? (
          <PracticePanel
            currentChord={currentChord}
            currentIndex={practiceIndex}
            totalChords={filteredChords.length}
            isMatched={isMatched}
            activeNotes={activeNotes}
            recentNotes={recentNotesDisplay}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onPrevChord={handlePrevChord}
            onNextChord={handleNextChord}
            onReplayReference={handleReplayReference}
          />
        ) : (
          <FreeplayControls
            autoHarmonize={autoHarmonize}
            onToggleAutoHarmonize={() => setAutoHarmonize(!autoHarmonize)}
            selectedScale={selectedScale}
            onScaleChange={setSelectedScale}
            soundProfile={soundProfile}
            onSoundProfileChange={setSoundProfile}
            lastHarmonizedChord={lastHarmonizedChord}
            volume={volume}
            onVolumeChange={setVolume}
          />
        )}

        {/* Piano Keyboard Component */}
        <section aria-label="Interactive Piano Keyboard" className="w-full">
          <Piano
            activeNotes={activeNotes}
            harmonizedNotes={mode === 'freeplay' && autoHarmonize ? harmonizedNotes : new Set()}
            targetChordNotes={mode === 'practice' ? currentChord?.notes : []}
            onNoteStart={handleNoteStart}
            onNoteEnd={handleNoteEnd}
            onSustainChange={handleSustainChange}
          />
        </section>

        {/* Tactile Sustain Pedal */}
        <div className="w-full max-w-5xl mx-auto">
          <SustainPedal
            isSustained={isSustained}
            onToggleSustain={() => handleSustainChange(!isSustained)}
          />
        </div>
      </main>
    </div>
  );
}
