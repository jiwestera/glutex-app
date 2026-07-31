export type RestSoundType = 'chime' | 'beep' | 'double-beep';

export interface RestSoundSettings {
  type: RestSoundType;
  volume: number; // 0-100
}

const REST_SOUND_KEY = 'glute_app_rest_sound_settings';

const DEFAULT_SETTINGS: RestSoundSettings = {
  type: 'chime',
  volume: 50
};

export const getRestSoundSettings = (): RestSoundSettings => {
  try {
    const saved = localStorage.getItem(REST_SOUND_KEY);
    if (!saved) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch (err) {
    console.error('Failed to load rest sound settings:', err);
    return DEFAULT_SETTINGS;
  }
};

export const saveRestSoundSettings = (settings: RestSoundSettings) => {
  try {
    localStorage.setItem(REST_SOUND_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save rest sound settings:', err);
  }
};

// Gentle envelope so tones fade in/out instead of clicking on/off.
const playTone = (
  ctx: AudioContext,
  startTime: number,
  frequency: number,
  duration: number,
  peakGain: number,
  waveform: OscillatorType = 'sine'
) => {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.type = waveform;
  osc.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.015);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
};

export const playRestSound = (settings?: RestSoundSettings) => {
  const { type, volume } = settings || getRestSoundSettings();
  // Max gain capped well below full-scale so even 100% reads as a soft alert, not a jolt.
  const peakGain = (Math.max(0, Math.min(100, volume)) / 100) * 0.5;
  if (peakGain <= 0) return;

  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;

    if (type === 'chime') {
      playTone(audioCtx, now, 659.25, 0.35, peakGain); // E5
      playTone(audioCtx, now + 0.12, 987.77, 0.45, peakGain); // B5
    } else if (type === 'double-beep') {
      playTone(audioCtx, now, 880, 0.16, peakGain, 'square');
      playTone(audioCtx, now + 0.2, 880, 0.16, peakGain, 'square');
    } else {
      playTone(audioCtx, now, 880, 0.3, peakGain);
    }
  } catch (e) {
    // Audio context unavailable/blocked — fail silently.
  }
};
