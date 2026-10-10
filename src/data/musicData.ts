import { PianoKeyData, PracticeChord, ScaleDefinition, NotePitch } from '../types/music';

export const PIANO_KEYS: PianoKeyData[] = [
  // C4 to B4
  {
    id: 'C4',
    noteName: 'C',
    midi: 60,
    frequency: 261.63,
    isBlack: false,
    keyboardKey: 'A',
    keyCodes: ['KeyA', 'a', 'A'],
  },
  {
    id: 'C#4',
    noteName: 'C#',
    accidentalName: 'Db',
    midi: 61,
    frequency: 277.18,
    isBlack: true,
    keyboardKey: 'W',
    keyCodes: ['KeyW', 'w', 'W'],
  },
  {
    id: 'D4',
    noteName: 'D',
    midi: 62,
    frequency: 293.66,
    isBlack: false,
    keyboardKey: 'S',
    keyCodes: ['KeyS', 's', 'S'],
  },
  {
    id: 'D#4',
    noteName: 'D#',
    accidentalName: 'Eb',
    midi: 63,
    frequency: 311.13,
    isBlack: true,
    keyboardKey: 'E',
    keyCodes: ['KeyE', 'e', 'E'],
  },
  {
    id: 'E4',
    noteName: 'E',
    midi: 64,
    frequency: 329.63,
    isBlack: false,
    keyboardKey: 'D',
    keyCodes: ['KeyD', 'd', 'D'],
  },
  {
    id: 'F4',
    noteName: 'F',
    midi: 65,
    frequency: 349.23,
    isBlack: false,
    keyboardKey: 'F',
    keyCodes: ['KeyF', 'f', 'F'],
  },
  {
    id: 'F#4',
    noteName: 'F#',
    accidentalName: 'Gb',
    midi: 66,
    frequency: 369.99,
    isBlack: true,
    keyboardKey: 'T',
    keyCodes: ['KeyT', 't', 'T'],
  },
  {
    id: 'G4',
    noteName: 'G',
    midi: 67,
    frequency: 392.00,
    isBlack: false,
    keyboardKey: 'G',
    keyCodes: ['KeyG', 'g', 'G'],
  },
  {
    id: 'G#4',
    noteName: 'G#',
    accidentalName: 'Ab',
    midi: 68,
    frequency: 415.30,
    isBlack: true,
    keyboardKey: 'Y',
    keyCodes: ['KeyY', 'y', 'Y'],
  },
  {
    id: 'A4',
    noteName: 'A',
    midi: 69,
    frequency: 440.00,
    isBlack: false,
    keyboardKey: 'H',
    keyCodes: ['KeyH', 'h', 'H'],
  },
  {
    id: 'A#4',
    noteName: 'A#',
    accidentalName: 'Bb',
    midi: 70,
    frequency: 466.16,
    isBlack: true,
    keyboardKey: 'U',
    keyCodes: ['KeyU', 'u', 'U'],
  },
  {
    id: 'B4',
    noteName: 'B',
    midi: 71,
    frequency: 493.88,
    isBlack: false,
    keyboardKey: 'J',
    keyCodes: ['KeyJ', 'j', 'J'],
  },

  // Octave 5 (C5 to F5)
  {
    id: 'C5',
    noteName: 'C',
    midi: 72,
    frequency: 523.25,
    isBlack: false,
    keyboardKey: 'K',
    keyCodes: ['KeyK', 'k', 'K'],
  },
  {
    id: 'C#5',
    noteName: 'C#',
    accidentalName: 'Db',
    midi: 73,
    frequency: 554.37,
    isBlack: true,
    keyboardKey: 'O',
    keyCodes: ['KeyO', 'o', 'O'],
  },
  {
    id: 'D5',
    noteName: 'D',
    midi: 74,
    frequency: 587.33,
    isBlack: false,
    keyboardKey: 'L',
    keyCodes: ['KeyL', 'l', 'L'],
  },
  {
    id: 'D#5',
    noteName: 'D#',
    accidentalName: 'Eb',
    midi: 75,
    frequency: 622.25,
    isBlack: true,
    keyboardKey: 'P',
    keyCodes: ['KeyP', 'p', 'P'],
  },
  {
    id: 'E5',
    noteName: 'E',
    midi: 76,
    frequency: 659.25,
    isBlack: false,
    keyboardKey: ';',
    keyCodes: ['Semicolon', ';', ':'],
  },
  {
    id: 'F5',
    noteName: 'F',
    midi: 77,
    frequency: 698.46,
    isBlack: false,
    keyboardKey: "'",
    keyCodes: ['Quote', "'", '"'],
  },
];

export const WHITE_KEYS = PIANO_KEYS.filter((k) => !k.isBlack);
export const BLACK_KEYS = PIANO_KEYS.filter((k) => k.isBlack);

export const PRACTICE_CHORDS: PracticeChord[] = [
  // 1. Major Triads
  {
    id: 'c-major',
    name: 'C Major',
    shortName: 'C',
    category: 'major',
    categoryLabel: 'Major Triads',
    description: 'The foundational bright chord of Western music. Pure, balanced, and open.',
    notes: ['C4', 'E4', 'G4'],
    hint: 'Root: C · Major 3rd: E · Perfect 5th: G',
  },
  {
    id: 'f-major',
    name: 'F Major',
    shortName: 'F',
    category: 'major',
    categoryLabel: 'Major Triads',
    description: 'Warm and grounded subdominant chord, cornerstone of classic pop and folk.',
    notes: ['F4', 'A4', 'C5'],
    hint: 'Root: F · Major 3rd: A · Perfect 5th: C',
  },
  {
    id: 'g-major',
    name: 'G Major',
    shortName: 'G',
    category: 'major',
    categoryLabel: 'Major Triads',
    description: 'Energetic and bright dominant chord that naturally resolves back to C.',
    notes: ['G4', 'B4', 'D5'],
    hint: 'Root: G · Major 3rd: B · Perfect 5th: D',
  },
  {
    id: 'd-major',
    name: 'D Major',
    shortName: 'D',
    category: 'major',
    categoryLabel: 'Major Triads',
    description: 'Crisp and triumphant with the black F# key adding signature color.',
    notes: ['D4', 'F#4', 'A4'],
    hint: 'Root: D · Major 3rd: F# · Perfect 5th: A',
  },
  {
    id: 'a-major',
    name: 'A Major',
    shortName: 'A',
    category: 'major',
    categoryLabel: 'Major Triads',
    description: 'Rich, uplifting voicing featuring C# in the middle.',
    notes: ['A4', 'C#5', 'E5'],
    hint: 'Root: A · Major 3rd: C# · Perfect 5th: E',
  },

  // 2. Minor Triads
  {
    id: 'a-minor',
    name: 'A minor',
    shortName: 'Am',
    category: 'minor',
    categoryLabel: 'Minor Triads',
    description: 'Melancholic and intimate. The relative minor of C Major.',
    notes: ['A4', 'C5', 'E5'],
    hint: 'Root: A · Minor 3rd: C · Perfect 5th: E',
  },
  {
    id: 'd-minor',
    name: 'D minor',
    shortName: 'Dm',
    category: 'minor',
    categoryLabel: 'Minor Triads',
    description: 'Soulful and thoughtful minor voicing heard across soundtracks and ballads.',
    notes: ['D4', 'F4', 'A4'],
    hint: 'Root: D · Minor 3rd: F · Perfect 5th: A',
  },
  {
    id: 'e-minor',
    name: 'E minor',
    shortName: 'Em',
    category: 'minor',
    categoryLabel: 'Minor Triads',
    description: 'Deep and contemplative. Resonant, moody, and natural.',
    notes: ['E4', 'G4', 'B4'],
    hint: 'Root: E · Minor 3rd: G · Perfect 5th: B',
  },
  {
    id: 'c-minor',
    name: 'C minor',
    shortName: 'Cm',
    category: 'minor',
    categoryLabel: 'Minor Triads',
    description: 'Dramatic and cinematic with Eb (D#4) setting a dark, emotional tone.',
    notes: ['C4', 'D#4', 'G4'],
    hint: 'Root: C · Minor 3rd: Eb (D#) · Perfect 5th: G',
  },

  // 3. 7th Chords
  {
    id: 'c-maj7',
    name: 'C Major 7',
    shortName: 'Cmaj7',
    category: 'seventh',
    categoryLabel: '7th Chords',
    description: 'Dreamy, lush jazz and neo-soul staple with a shimmering major seventh (B).',
    notes: ['C4', 'E4', 'G4', 'B4'],
    hint: 'Root: C · 3rd: E · 5th: G · Major 7th: B',
  },
  {
    id: 'a-min7',
    name: 'A minor 7',
    shortName: 'Am7',
    category: 'seventh',
    categoryLabel: '7th Chords',
    description: 'Silky and mellow voicing incorporating natural G for a relaxed atmosphere.',
    notes: ['G4', 'A4', 'C5', 'E5'],
    hint: 'Inversion/Voicing: G · A · C · E',
  },
  {
    id: 'd-min7',
    name: 'D minor 7',
    shortName: 'Dm7',
    category: 'seventh',
    categoryLabel: '7th Chords',
    description: 'Classic ii chord in jazz progressions; smooth, sophisticated, and heartfelt.',
    notes: ['D4', 'F4', 'A4', 'C5'],
    hint: 'Root: D · Minor 3rd: F · 5th: A · Flat 7th: C',
  },
  {
    id: 'f-maj7',
    name: 'F Major 7',
    shortName: 'Fmaj7',
    category: 'seventh',
    categoryLabel: '7th Chords',
    description: 'Airy, sunset-like acoustic warmth with the singing top E string.',
    notes: ['F4', 'A4', 'C5', 'E5'],
    hint: 'Root: F · 3rd: A · 5th: C · Major 7th: E',
  },
  {
    id: 'g-7',
    name: 'G Dominant 7',
    shortName: 'G7',
    category: 'seventh',
    categoryLabel: '7th Chords',
    description: 'The definitive tension chord that begs to resolve directly home to C.',
    notes: ['G4', 'B4', 'D5', 'F5'],
    hint: 'Root: G · 3rd: B · 5th: D · Flat 7th: F',
  },

  // 4. Extended Voicings
  {
    id: 'c-add9',
    name: 'C add9',
    shortName: 'Cadd9',
    category: 'extended',
    categoryLabel: 'Extended Voicings',
    description: 'Sparkling and modern. The high D adds acoustic brilliance without tension.',
    notes: ['C4', 'E4', 'G4', 'D5'],
    hint: 'Root: C · 3rd: E · 5th: G · Add 9: D',
  },
  {
    id: 'd-add9',
    name: 'D add9',
    shortName: 'Dadd9',
    category: 'extended',
    categoryLabel: 'Extended Voicings',
    description: 'Expansive, cinematic chord loved by composers and modern indie pianists.',
    notes: ['D4', 'F#4', 'A4', 'E5'],
    hint: 'Root: D · 3rd: F# · 5th: A · Add 9: E',
  },
  {
    id: 'c-sus2',
    name: 'C sus2',
    shortName: 'Csus2',
    category: 'extended',
    categoryLabel: 'Extended Voicings',
    description: 'Floating and uncommitted. Replaces the 3rd with the 2nd for open calm.',
    notes: ['C4', 'D4', 'G4'],
    hint: 'Root: C · Suspended 2nd: D · 5th: G',
  },
  {
    id: 'd-sus4',
    name: 'D sus4',
    shortName: 'Dsus4',
    category: 'extended',
    categoryLabel: 'Extended Voicings',
    description: 'Yearning and anticipation. Replaces the 3rd with the 4th (G) before releasing.',
    notes: ['D4', 'G4', 'A4'],
    hint: 'Root: D · Suspended 4th: G · 5th: A',
  },
  {
    id: 'f-sus2',
    name: 'F sus2',
    shortName: 'Fsus2',
    category: 'extended',
    categoryLabel: 'Extended Voicings',
    description: 'Gentle, modern ambient color that floats effortlessly.',
    notes: ['F4', 'G4', 'C5'],
    hint: 'Root: F · Suspended 2nd: G · 5th: C',
  },
  {
    id: 'a-add9',
    name: 'A add9',
    shortName: 'Aadd9',
    category: 'extended',
    categoryLabel: 'Extended Voicings',
    description: 'Ethereal and evocative voicing featuring the glowing B note next to C#.',
    notes: ['A4', 'B4', 'C#5', 'E5'],
    hint: 'Voicing: A · B · C# · E',
  },
];

export const SCALES: ScaleDefinition[] = [
  {
    id: 'C-major',
    name: 'C Major',
    root: 'C',
    type: 'major',
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  },
  {
    id: 'G-major',
    name: 'G Major (1 #)',
    root: 'G',
    type: 'major',
    notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  },
  {
    id: 'D-major',
    name: 'D Major (2 #)',
    root: 'D',
    type: 'major',
    notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  },
  {
    id: 'A-major',
    name: 'A Major (3 #)',
    root: 'A',
    type: 'major',
    notes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  },
  {
    id: 'F-major',
    name: 'F Major (1 b)',
    root: 'F',
    type: 'major',
    notes: ['F', 'G', 'A', 'A#', 'C', 'D', 'E'],
  },
  {
    id: 'A-minor',
    name: 'A Natural Minor',
    root: 'A',
    type: 'minor',
    notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  },
  {
    id: 'E-minor',
    name: 'E Natural Minor (1 #)',
    root: 'E',
    type: 'minor',
    notes: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
  },
  {
    id: 'D-minor',
    name: 'D Natural Minor (1 b)',
    root: 'D',
    type: 'minor',
    notes: ['D', 'E', 'F', 'G', 'A', 'A#', 'C'],
  },
];

// Helper to calculate auto-harmonize notes for a pressed note within a selected scale
export function getAutoHarmonizeNotes(
  pressedNoteId: NotePitch,
  scaleId: string
): { chordName: string; notes: NotePitch[] } {
  const scale = SCALES.find((s) => s.id === scaleId) || SCALES[0];
  const keyData = PIANO_KEYS.find((k) => k.id === pressedNoteId);
  if (!keyData) {
    return { chordName: pressedNoteId, notes: [pressedNoteId] };
  }

  // Extract base note pitch class (e.g. 'C', 'C#', etc.)
  const rawNoteName = keyData.noteName;
  const noteIndexInScale = scale.notes.indexOf(rawNoteName);

  if (noteIndexInScale === -1) {
    // If the note isn't in scale, just play note or simple fifth
    return {
      chordName: `${keyData.noteName} (Non-scale)`,
      notes: [pressedNoteId],
    };
  }

  // Build diatonic triad: Root (degree), 3rd (degree + 2), 5th (degree + 4)
  const rootClass = scale.notes[noteIndexInScale];
  const thirdClass = scale.notes[(noteIndexInScale + 2) % 7];
  const fifthClass = scale.notes[(noteIndexInScale + 4) % 7];

  // Find optimal octave targets within our 1.5 octave range
  const pressedMidi = keyData.midi;

  // Function to find best matching note in keyboard for a pitch class near pressed note
  const findBestVoice = (pitchClass: string, preferHigher: boolean): NotePitch => {
    const candidates = PIANO_KEYS.filter(
      (k) => k.noteName === pitchClass || k.accidentalName === pitchClass
    );
    if (candidates.length === 0) return pressedNoteId;

    if (preferHigher) {
      // Pick note with midi > pressedMidi if available, otherwise closest
      const higher = candidates.filter((c) => c.midi > pressedMidi);
      if (higher.length > 0) return higher[0].id;
    }
    // Else pick closest
    return candidates.reduce((prev, curr) =>
      Math.abs(curr.midi - pressedMidi) < Math.abs(prev.midi - pressedMidi) ? curr : prev
    ).id;
  };

  const thirdPitch = findBestVoice(thirdClass, true);
  const fifthPitch = findBestVoice(fifthClass, true);

  const notesSet = new Set<NotePitch>([pressedNoteId, thirdPitch, fifthPitch]);
  const sortedNotes = Array.from(notesSet).sort((a, b) => {
    const aMidi = PIANO_KEYS.find((k) => k.id === a)?.midi || 0;
    const bMidi = PIANO_KEYS.find((k) => k.id === b)?.midi || 0;
    return aMidi - bMidi;
  });

  // Calculate Roman numeral or chord quality name
  const degree = noteIndexInScale + 1;
  const isMajorScale = scale.type === 'major';
  let quality = '';
  if (isMajorScale) {
    if ([1, 4, 5].includes(degree)) quality = 'Maj';
    else if ([2, 3, 6].includes(degree)) quality = 'min';
    else quality = 'dim';
  } else {
    if ([3, 6, 7].includes(degree)) quality = 'Maj';
    else if ([1, 4, 5].includes(degree)) quality = 'min';
    else quality = 'dim';
  }

  return {
    chordName: `${rootClass} ${quality}`,
    notes: sortedNotes,
  };
}
