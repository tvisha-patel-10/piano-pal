export type NotePitch = 
  | 'C4' | 'C#4' | 'D4' | 'D#4' | 'E4' | 'F4' | 'F#4' | 'G4' | 'G#4' | 'A4' | 'A#4' | 'B4'
  | 'C5' | 'C#5' | 'D5' | 'D#5' | 'E5' | 'F5';

export interface PianoKeyData {
  id: NotePitch;
  noteName: string;
  accidentalName?: string;
  midi: number;
  frequency: number;
  isBlack: boolean;
  keyboardKey: string; // Physical QWERTY key label (e.g. 'A', 'W', etc.)
  keyCodes: string[]; // e.g. ['KeyA', 'a']
}

export type ChordCategory = 'major' | 'minor' | 'seventh' | 'extended';

export interface PracticeChord {
  id: string;
  name: string;
  shortName: string;
  category: ChordCategory;
  categoryLabel: string;
  description: string;
  notes: NotePitch[];
  hint: string;
}

export type MusicalScale = 
  | 'C-major'
  | 'G-major'
  | 'D-major'
  | 'A-major'
  | 'F-major'
  | 'A-minor'
  | 'E-minor'
  | 'D-minor';

export interface ScaleDefinition {
  id: MusicalScale;
  name: string;
  root: string;
  type: 'major' | 'minor';
  notes: string[]; // Pitch classes: 'C', 'D', 'E', etc.
}

export type AppMode = 'practice' | 'freeplay';

export type SoundProfile = 'grand' | 'electric' | 'synth';
