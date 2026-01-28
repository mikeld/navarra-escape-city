
import { Phase } from '../types';

// Default SFX (Base64 encoded to work immediately without assets)
const SFX_DATA = {
  CLICK: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=', // Silent placeholder, will be synthesized
  SUCCESS: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAAAA=', // Placeholder
  ERROR: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAAAA=',   // Placeholder
};

type AudioTrack = 'MENU' | 'FORTRESS' | 'WATER' | 'KNOWLEDGE' | 'FINAL';

class AudioManager {
  private bgmAudio: HTMLAudioElement | null = null;
  private nextBgmAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;
  private currentTrack: string | null = null;
  private audioContext: AudioContext | null = null;

  constructor() {
    const savedMute = localStorage.getItem('estella_muted');
    this.isMuted = savedMute === 'true';

    // Initialize Web Audio API for synthesized SFX
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported");
    }
  }

  // --- PUBLIC API ---

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('estella_muted', String(this.isMuted));

    if (this.bgmAudio) {
      this.bgmAudio.muted = this.isMuted;
    }
    if (this.nextBgmAudio) {
      this.nextBgmAudio.muted = this.isMuted;
    }
    return this.isMuted;
  }

  public getMuteState(): boolean {
    return this.isMuted;
  }

  public async playBGM(track: AudioTrack) {
    if (this.currentTrack === track) return;

    // Resume context if suspended (browser policy)
    this.resumeContext();

    const src = this.getTrackSource(track);
    if (!src) return;

    // Crossfade Logic
    const newAudio = new Audio(src);
    newAudio.loop = true;
    newAudio.volume = 0; // Start silent
    newAudio.muted = this.isMuted;

    this.nextBgmAudio = newAudio;

    try {
      await newAudio.play();
      this.fadeIn(newAudio);
      if (this.bgmAudio) {
        this.fadeOut(this.bgmAudio);
      }
      this.bgmAudio = newAudio;
      this.currentTrack = track;
    } catch (e) {
      console.warn("Autoplay prevented. User interaction required.", e);
    }
  }

  public stopBGM() {
    if (this.bgmAudio) {
      this.fadeOut(this.bgmAudio);
      this.bgmAudio = null;
      this.currentTrack = null;
    }
  }

  public playSFX(type: 'CLICK' | 'SUCCESS' | 'ERROR' | 'REVEAL') {
    if (this.isMuted) return;
    this.resumeContext();

    // Use synthesized sounds for immediate feedback without loading files
    if (this.audioContext) {
      this.playSynthesizedSFX(type);
    }
  }

  // --- INTERNAL HELPERS ---

  private resumeContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  private getTrackSource(track: AudioTrack): string {
    // TEMPORAL: Audio files disabled until added to project
    // TODO: Add audio files to public/assets/audio/ folder
    // In a real app, these would be URLs from Firebase or local assets
    // Using placeholder/demo sounds or standard paths

    // Temporarily return empty to avoid 404 errors
    return '';

    /* Uncomment when audio files are available:
    switch (track) {
      case 'MENU': return '/assets/audio/bgm_menu.mp3'; // Cinematic
      case 'FORTRESS': return '/assets/audio/bgm_wind.mp3'; // Wind & Stone
      case 'WATER': return '/assets/audio/bgm_river.mp3'; // Water flow
      case 'KNOWLEDGE': return '/assets/audio/bgm_chant.mp3'; // Gregorian/Echo
      case 'FINAL': return '/assets/audio/bgm_final.mp3';
      default: return '';
    }
    */
  }

  private fadeIn(audio: HTMLAudioElement) {
    let vol = 0;
    const interval = setInterval(() => {
      if (vol < this.volume) {
        vol += 0.05;
        audio.volume = Math.min(vol, this.volume);
      } else {
        clearInterval(interval);
      }
    }, 100);
  }

  private fadeOut(audio: HTMLAudioElement) {
    let vol = audio.volume;
    const interval = setInterval(() => {
      if (vol > 0) {
        vol -= 0.05;
        audio.volume = Math.max(0, vol);
      } else {
        clearInterval(interval);
        audio.pause();
        audio.src = "";
        if (this.bgmAudio === audio) this.bgmAudio = null; // Clean up only if it's the main one
      }
    }, 100);
  }

  // Simple Synthesizer for SFX so we don't depend on external files immediately
  private playSynthesizedSFX(type: 'CLICK' | 'SUCCESS' | 'ERROR' | 'REVEAL') {
    if (!this.audioContext) return;
    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'CLICK':
        // High, short blip (Mechanical click)
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'SUCCESS':
        // Major chord arpeggio (Medieval/Magical)
        this.playTone(523.25, now, 0.3, 'sine'); // C
        this.playTone(659.25, now + 0.1, 0.3, 'sine'); // E
        this.playTone(783.99, now + 0.2, 0.6, 'sine'); // G
        break;

      case 'ERROR':
        // Dissonant buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;

      case 'REVEAL':
        // Magical shimmering
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.linearRampToValueAtTime(2000, now + 1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.5);
        gain.gain.linearRampToValueAtTime(0, now + 1);
        osc.start(now);
        osc.stop(now + 1);
        break;
    }
  }

  private playTone(freq: number, time: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.start(time);
    osc.stop(time + duration);
  }
}

export const audioManager = new AudioManager();
