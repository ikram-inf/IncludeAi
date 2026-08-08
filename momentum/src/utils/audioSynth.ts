import { AmbientSound, CompletionChime } from '../types';

let audioCtx: AudioContext | null = null;
let currentNoiseNode: AudioNode | null = null;
let currentGainNode: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCompletionChime(chimeType: CompletionChime = 'softGong', volume: number = 0.6) {
  if (chimeType === 'none' || volume <= 0) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (chimeType === 'softGong') {
      // Warm low Tibetan Gong simulation
      const freqs = [146.83, 220.0, 293.66]; // D3, A3, D4
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2 * volume, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.6);
      });
    } else if (chimeType === 'singingBowl') {
      // Deep resonant Singing Bowl
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, now); // 432 Hz resonant frequency

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25 * volume, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 4.1);
    } else if (chimeType === 'gentleBell') {
      // High delicate crystal bell
      const freqs = [880, 1320]; // A5, E6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0, now + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.15 * volume, now + idx * 0.15 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 2.0);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 2.1);
      });
    } else {
      // Standard soothing major chord chime
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.15 * volume, now + idx * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 2.0);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 2.2);
      });
    }
  } catch (e) {
    console.warn('Audio chime play failed:', e);
  }
}

export function stopAmbientSound() {
  if (currentGainNode && audioCtx) {
    try {
      currentGainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (currentNoiseNode) {
          currentNoiseNode.disconnect();
          currentNoiseNode = null;
        }
        if (currentGainNode) {
          currentGainNode.disconnect();
          currentGainNode = null;
        }
      }, 500);
    } catch {
      // Ignore cleanup errors
    }
  }
}

export function startAmbientSound(sound: AmbientSound, volume: number = 0.3) {
  stopAmbientSound();

  if (sound === 'none') return;

  try {
    const ctx = getAudioContext();
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1);

    if (sound === 'rain' || sound === 'brownNoise') {
      // Pink / Brown Noise generator for Rain or Brown Noise
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (sound === 'brownNoise') {
          // Brown noise equation
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // boost volume
        } else {
          // Rain (Filtered noise)
          output[i] = (lastOut + 0.05 * white) / 1.05;
          lastOut = output[i];
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = sound === 'rain' ? 'bandpass' : 'lowpass';
      filter.frequency.setValueAtTime(sound === 'rain' ? 800 : 350, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start();
      currentNoiseNode = whiteNoise;
    } else if (sound === 'forest' || sound === 'cafe') {
      // Gentle warm drone / atmosphere
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(sound === 'forest' ? 140 : 220, ctx.currentTime);
      osc2.frequency.setValueAtTime(sound === 'forest' ? 280 : 330, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      currentNoiseNode = osc1;
    }

    currentGainNode = gainNode;
  } catch (e) {
    console.warn('Ambient sound start failed:', e);
  }
}
