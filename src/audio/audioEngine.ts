import { NotePitch, SoundProfile } from '../types/music';
import { PIANO_KEYS } from '../data/musicData';

interface ActiveVoice {
  oscillators: OscillatorNode[];
  filter: BiquadFilterNode;
  gainNode: GainNode;
  tremoloGain?: GainNode;
  lfo?: OscillatorNode;
  lfoGain?: GainNode;
  noteId: NotePitch;
  startTime: number;
  isSustained: boolean;
  isKeyDown: boolean;
  profile: SoundProfile;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private activeVoices: Map<NotePitch, ActiveVoice> = new Map();
  private isSustainActive: boolean = false;
  private soundProfile: SoundProfile = 'grand';
  private masterVolume: number = 0.85;

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master Compressor prevents clipping when playing rich multi-voice chords
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundProfile(profile: SoundProfile) {
    this.soundProfile = profile;
  }

  public getSoundProfile(): SoundProfile {
    return this.soundProfile;
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  public setSustain(active: boolean) {
    this.isSustainActive = active;
    if (!active) {
      this.activeVoices.forEach((voice, noteId) => {
        if (!voice.isKeyDown && voice.isSustained) {
          this.triggerRelease(voice, noteId);
        }
      });
    }
  }

  public getSustain(): boolean {
    return this.isSustainActive;
  }

  public playNote(noteId: NotePitch, velocity: number = 0.85) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const keyData = PIANO_KEYS.find((k) => k.id === noteId);
    if (!keyData) return;

    const freq = keyData.frequency;
    const now = this.ctx.currentTime;

    // Release existing voice for this note cleanly
    if (this.activeVoices.has(noteId)) {
      const existing = this.activeVoices.get(noteId)!;
      this.stopVoiceImmediately(existing);
      this.activeVoices.delete(noteId);
    }

    const oscillators: OscillatorNode[] = [];
    const filter = this.ctx.createBiquadFilter();
    const voiceGain = this.ctx.createGain();

    let tremoloGain: GainNode | undefined;
    let lfo: OscillatorNode | undefined;
    let lfoGain: GainNode | undefined;

    if (this.soundProfile === 'synth') {
      // ═════════════════════════════════════════════════════════════════
      // 1. SYNTH: 80s Lush Analog Polysynth (Juno-106 / Prophet-5)
      // Fat detuned dual saw waves + sub-bass + resonant filter envelope
      // ═════════════════════════════════════════════════════════════════
      const saw1 = this.ctx.createOscillator();
      saw1.type = 'sawtooth';
      saw1.frequency.setValueAtTime(freq * 0.994, now); // Detuned -10 cents flat

      const saw2 = this.ctx.createOscillator();
      saw2.type = 'sawtooth';
      saw2.frequency.setValueAtTime(freq * 1.006, now); // Detuned +10 cents sharp

      const sub = this.ctx.createOscillator();
      sub.type = 'sawtooth';
      sub.frequency.setValueAtTime(freq * 0.5, now); // 1 octave below

      const sawGain = this.ctx.createGain();
      sawGain.gain.setValueAtTime(0.22 * velocity, now);

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.14 * velocity, now);

      saw1.connect(sawGain);
      saw2.connect(sawGain);
      sub.connect(subGain);

      // Resonant 24dB-style low-pass filter with classic brassy envelope sweep
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(4.2, now); // Juicy analog filter resonance
      filter.frequency.setValueAtTime(5200, now);
      filter.frequency.exponentialRampToValueAtTime(1300, now + 0.38);

      sawGain.connect(filter);
      subGain.connect(filter);
      filter.connect(voiceGain);

      // ADSR Envelope: Punchy synth attack, sustains indefinitely while held
      voiceGain.gain.setValueAtTime(0.0001, now);
      voiceGain.gain.exponentialRampToValueAtTime(0.26 * velocity, now + 0.015);
      voiceGain.gain.exponentialRampToValueAtTime(0.20 * velocity, now + 0.28);

      saw1.start(now);
      saw2.start(now);
      sub.start(now);
      oscillators.push(saw1, saw2, sub);
    } else if (this.soundProfile === 'electric') {
      // ═════════════════════════════════════════════════════════════════
      // 2. ELECTRIC: Vintage Fender Rhodes / Wurlitzer Bell E-Piano
      // Chimey metallic tine attack + warm sine/triangle body + analog tremolo
      // ═════════════════════════════════════════════════════════════════
      // Body fundamental: warm sine
      const bodyOsc = this.ctx.createOscillator();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(freq, now);

      // Warm octave overtone: triangle
      const warmOsc = this.ctx.createOscillator();
      warmOsc.type = 'triangle';
      warmOsc.frequency.setValueAtTime(freq * 2, now);

      // Signature crystalline metallic tine bell (4th & 7th partials)
      const tineOsc1 = this.ctx.createOscillator();
      tineOsc1.type = 'sine';
      tineOsc1.frequency.setValueAtTime(freq * 4.02, now);

      const tineOsc2 = this.ctx.createOscillator();
      tineOsc2.type = 'sine';
      tineOsc2.frequency.setValueAtTime(freq * 6.98, now);

      const bodyGain = this.ctx.createGain();
      bodyGain.gain.setValueAtTime(0.32 * velocity, now);

      const warmGain = this.ctx.createGain();
      warmGain.gain.setValueAtTime(0.10 * velocity, now);

      const tineGain = this.ctx.createGain();
      // Fast metallic ping that gives the iconic bell strike
      tineGain.gain.setValueAtTime(0.30 * velocity, now);
      tineGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      bodyOsc.connect(bodyGain);
      warmOsc.connect(warmGain);
      tineOsc1.connect(tineGain);
      tineOsc2.connect(tineGain);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3400, now);
      filter.Q.setValueAtTime(1.4, now);

      bodyGain.connect(filter);
      warmGain.connect(filter);
      tineGain.connect(filter);

      // Vintage Suitcase Tremolo (4.6 Hz sine modulating amplitude)
      tremoloGain = this.ctx.createGain();
      tremoloGain.gain.setValueAtTime(0.85, now);

      lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(4.6, now);

      lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.14, now); // 14% depth

      lfo.connect(lfoGain);
      lfoGain.connect(tremoloGain.gain);

      filter.connect(tremoloGain);
      tremoloGain.connect(voiceGain);

      // Envelope: instant chime, smooth mellow bell decay
      voiceGain.gain.setValueAtTime(0.0001, now);
      voiceGain.gain.exponentialRampToValueAtTime(0.34 * velocity, now + 0.006);
      voiceGain.gain.exponentialRampToValueAtTime(0.22 * velocity, now + 0.22);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + 6.0);

      bodyOsc.start(now);
      warmOsc.start(now);
      tineOsc1.start(now);
      tineOsc2.start(now);
      lfo.start(now);
      oscillators.push(bodyOsc, warmOsc, tineOsc1, tineOsc2);
    } else {
      // ═════════════════════════════════════════════════════════════════
      // 3. GRAND: Acoustic Concert Grand Piano
      // Felt hammer impact click + triple-string micro-unison chorus + acoustic decay
      // ═════════════════════════════════════════════════════════════════
      // Felt hammer attack transient (percussive wooden punch)
      const hammerOsc = this.ctx.createOscillator();
      hammerOsc.type = 'triangle';
      hammerOsc.frequency.setValueAtTime(freq * 0.5, now);
      const hammerGain = this.ctx.createGain();
      hammerGain.gain.setValueAtTime(0.32 * velocity, now);
      hammerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.024);
      hammerOsc.connect(hammerGain);

      // Triple-string micro-unison chorus (simulating 3 strings per key on grand piano)
      const fund1 = this.ctx.createOscillator();
      fund1.type = 'sine';
      fund1.frequency.setValueAtTime(freq * 0.999, now); // -1.7 cents

      const fund2 = this.ctx.createOscillator();
      fund2.type = 'triangle';
      fund2.frequency.setValueAtTime(freq * 1.001, now); // +1.7 cents

      const fundGain = this.ctx.createGain();
      fundGain.gain.setValueAtTime(0.26 * velocity, now);
      fund1.connect(fundGain);
      fund2.connect(fundGain);

      // Acoustic string harmonic (2nd octave partial)
      const harmOsc = this.ctx.createOscillator();
      harmOsc.type = 'sine';
      harmOsc.frequency.setValueAtTime(freq * 2, now);
      const harmGain = this.ctx.createGain();
      harmGain.gain.setValueAtTime(0.08 * velocity, now);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      harmOsc.connect(harmGain);

      filter.type = 'lowpass';
      // Starts bright on hammer strike and warms down quickly like real strings
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.25);
      filter.Q.setValueAtTime(1.1, now);

      hammerGain.connect(filter);
      fundGain.connect(filter);
      harmGain.connect(filter);
      filter.connect(voiceGain);

      // Acoustic Hammer ADSR
      voiceGain.gain.setValueAtTime(0.0001, now);
      voiceGain.gain.exponentialRampToValueAtTime(0.30 * velocity, now + 0.008);
      voiceGain.gain.exponentialRampToValueAtTime(0.19 * velocity, now + 0.18);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5); // Natural string fade

      hammerOsc.start(now);
      fund1.start(now);
      fund2.start(now);
      harmOsc.start(now);
      oscillators.push(hammerOsc, fund1, fund2, harmOsc);
    }

    voiceGain.connect(this.masterGain);

    const voice: ActiveVoice = {
      oscillators,
      filter,
      gainNode: voiceGain,
      tremoloGain,
      lfo,
      lfoGain,
      noteId,
      startTime: now,
      isSustained: false,
      isKeyDown: true,
      profile: this.soundProfile,
    };

    this.activeVoices.set(noteId, voice);
  }

  public stopNote(noteId: NotePitch) {
    const voice = this.activeVoices.get(noteId);
    if (!voice) return;

    voice.isKeyDown = false;

    if (this.isSustainActive) {
      voice.isSustained = true;
      return;
    }

    this.triggerRelease(voice, noteId);
  }

  private triggerRelease(voice: ActiveVoice, noteId: NotePitch) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Distinct release times per sound profile
    let releaseTime = 0.28;
    if (voice.profile === 'synth') releaseTime = 0.48; // Lush synth pad release trail
    if (voice.profile === 'electric') releaseTime = 0.34; // Resonant electric ring-out

    voice.gainNode.gain.cancelScheduledValues(now);
    voice.gainNode.gain.setValueAtTime(Math.max(voice.gainNode.gain.value, 0.0001), now);
    voice.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);

    setTimeout(() => {
      this.stopVoiceImmediately(voice);
      if (this.activeVoices.get(noteId) === voice) {
        this.activeVoices.delete(noteId);
      }
    }, releaseTime * 1000 + 40);
  }

  private stopVoiceImmediately(voice: ActiveVoice) {
    try {
      voice.oscillators.forEach((osc) => osc.stop());
      if (voice.lfo) voice.lfo.stop();
      if (voice.tremoloGain) voice.tremoloGain.disconnect();
      if (voice.lfoGain) voice.lfoGain.disconnect();
      voice.gainNode.disconnect();
    } catch {
      // Ignore if already disconnected
    }
  }

  public playChordPreview(notes: NotePitch[], durationMs: number = 1600, staggerMs: number = 35) {
    this.initContext();
    notes.forEach((noteId, index) => {
      setTimeout(() => {
        this.playNote(noteId, 0.8);
        setTimeout(() => {
          this.stopNote(noteId);
        }, durationMs - index * staggerMs);
      }, index * staggerMs);
    });
  }

  public playSuccessChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const chimeFrequencies = [523.25, 659.25, 783.99, 1046.5];
    chimeFrequencies.forEach((freq, idx) => {
      const now = (this.ctx?.currentTime || 0) + idx * 0.08;
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.16, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.7);
    });
  }

  public playMetronomeTick(isAccent: boolean = false) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isAccent ? 1200 : 800, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(isAccent ? 0.28 : 0.16, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  public stopAllNotes() {
    this.activeVoices.forEach((voice) => {
      this.stopVoiceImmediately(voice);
    });
    this.activeVoices.clear();
  }
}

export const audioEngine = new AudioEngine();
