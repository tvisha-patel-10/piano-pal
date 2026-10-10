import React, { useState, useEffect, useRef } from 'react';
import { MusicalScale, SoundProfile } from '../types/music';
import { SCALES } from '../data/musicData';
import { Music, Music2, Volume2, Play, Square } from 'lucide-react';
import { audioEngine } from '../audio/audioEngine';

interface FreeplayControlsProps {
  autoHarmonize: boolean;
  onToggleAutoHarmonize: () => void;
  selectedScale: MusicalScale;
  onScaleChange: (scale: MusicalScale) => void;
  soundProfile: SoundProfile;
  onSoundProfileChange: (profile: SoundProfile) => void;
  lastHarmonizedChord: string | null;
  volume: number;
  onVolumeChange: (vol: number) => void;
}

export const FreeplayControls: React.FC<FreeplayControlsProps> = ({
  autoHarmonize,
  onToggleAutoHarmonize,
  selectedScale,
  onScaleChange,
  soundProfile,
  onSoundProfileChange,
  lastHarmonizedChord,
  volume,
  onVolumeChange,
}) => {
  // Metronome state
  const [metronomePlaying, setMetronomePlaying] = useState(false);
  const [bpm, setBpm] = useState(90);
  const [beat, setBeat] = useState(0);
  const metronomeTimerRef = useRef<number | null>(null);

  // Metronome ticking loop
  useEffect(() => {
    if (!metronomePlaying) {
      if (metronomeTimerRef.current) clearInterval(metronomeTimerRef.current);
      return;
    }

    const intervalMs = (60 / bpm) * 1000;
    let currentBeat = 0;

    metronomeTimerRef.current = window.setInterval(() => {
      currentBeat = (currentBeat + 1) % 4;
      setBeat(currentBeat);
      audioEngine.playMetronomeTick(currentBeat === 0);
    }, intervalMs);

    return () => {
      if (metronomeTimerRef.current) clearInterval(metronomeTimerRef.current);
    };
  }, [metronomePlaying, bpm]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Low-profile, compact freeplay score card */}
      <div className="bg-[#FBF8F2]/90 rounded-xl border border-[#DFD7C7] shadow-md shadow-black/20 backdrop-blur-sm px-3.5 py-2.5 sm:px-4 sm:py-3 transition-all space-y-2">
        {/* Row 1: Auto-Harmonize & Scale on left, Sound Profile on right */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-3">
            {/* Auto-Harmonize Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                role="switch"
                aria-checked={autoHarmonize}
                onClick={onToggleAutoHarmonize}
                className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full transition-colors duration-150 ease-in-out focus:outline-none ${
                  autoHarmonize ? 'bg-amber-600' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out mt-1 ml-1 ${
                    autoHarmonize ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>

              <div className="cursor-pointer flex items-center gap-1.5" onClick={onToggleAutoHarmonize}>
                <Music className={`w-3.5 h-3.5 ${autoHarmonize ? 'text-amber-600' : 'text-stone-400'}`} />
                <span className="text-xs font-bold text-stone-900">Auto-Harmonize</span>
              </div>
            </div>

            {/* Scale / Key Selector Dropdown */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-stone-300/60">
              <label htmlFor="scale-select" className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
                <Music2 className="w-3 h-3 text-stone-400" />
                Key:
              </label>
              <select
                id="scale-select"
                value={selectedScale}
                onChange={(e) => onScaleChange(e.target.value as MusicalScale)}
                className="bg-white/90 border border-stone-300 text-stone-800 text-xs font-medium rounded-md px-2 py-0.5 outline-none cursor-pointer"
              >
                {SCALES.map((scale) => (
                  <option key={scale.id} value={scale.id}>
                    {scale.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sound Profile Selector */}
          <div className="flex items-center gap-0.5 bg-[#EDE6D8]/80 p-0.5 rounded-lg border border-[#D8CEBE]">
            {(
              [
                { id: 'grand', label: 'Grand' },
                { id: 'electric', label: 'Electric' },
                { id: 'synth', label: 'Synth' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSoundProfileChange(p.id)}
                className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                  soundProfile === p.id
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Live Harmony readout on left, Metronome & Volume on right */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-[#E8DFD0]/70">
          {/* Active Auto-Harmonize readout */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
              Harmony:
            </span>
            {lastHarmonizedChord ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold animate-in fade-in duration-100">
                <Music className="w-3 h-3 text-amber-600 fill-amber-500" />
                {lastHarmonizedChord}
              </span>
            ) : (
              <span className="text-xs text-stone-500 font-serif italic">
                {autoHarmonize ? 'Diatonic chords in key' : 'Single manual notes'}
              </span>
            )}
          </div>

          {/* Metronome & Volume slider */}
          <div className="flex items-center gap-3">
            {/* Compact Metronome */}
            <div className="flex items-center gap-1.5 bg-white/70 px-2 py-0.5 rounded-md border border-stone-200">
              <button
                type="button"
                onClick={() => setMetronomePlaying(!metronomePlaying)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  metronomePlaying ? 'bg-amber-600 text-white' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {metronomePlaying ? (
                  <Square className="w-2.5 h-2.5 fill-white" />
                ) : (
                  <Play className="w-2.5 h-2.5 fill-stone-700" />
                )}
                <span>{bpm} BPM</span>
              </button>

              <input
                type="range"
                min="50"
                max="180"
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value, 10))}
                className="w-14 accent-amber-600 cursor-pointer h-1 bg-stone-200 rounded"
              />

              {metronomePlaying && (
                <div className="flex items-center gap-0.5 ml-0.5">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        beat === i ? 'bg-amber-600 scale-125' : 'bg-stone-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Master Volume */}
            <div className="flex items-center gap-1 text-stone-500">
              <Volume2 className="w-3.5 h-3.5 text-stone-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                aria-label="Volume slider"
                className="w-16 accent-amber-600 cursor-pointer h-1 bg-stone-200 rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
