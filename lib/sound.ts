import { useBitacora } from '@/store/useBitacora';

let audioCtx: AudioContext | null = null;

function getAudio(): AudioContext {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

function chime(freq: number, vol = 0.15, att = 0.05, dec = 1.2) {
  if (!useBitacora.getState().soundOn) return;
  const ctx = getAudio(), now = ctx.currentTime;
  const osc = ctx.createOscillator(), gain = ctx.createGain();
  osc.type = 'sine'; osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(vol, now + att);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + att + dec);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(now); osc.stop(now + att + dec + 0.1);
  const o2 = ctx.createOscillator(), g2 = ctx.createGain();
  o2.type = 'triangle'; o2.frequency.value = freq * 2;
  g2.gain.setValueAtTime(0, now);
  g2.gain.linearRampToValueAtTime(vol * 0.25, now + att);
  g2.gain.exponentialRampToValueAtTime(0.0001, now + att + dec * 0.7);
  o2.connect(g2); g2.connect(ctx.destination);
  o2.start(now); o2.stop(now + att + dec + 0.1);
}

export function playStart() {
  chime(392, 0.12, 0.08, 1.4);
  setTimeout(() => chime(493.88, 0.12, 0.08, 1.2), 180);
  setTimeout(() => chime(587.33, 0.14, 0.08, 1.6), 360);
}

export function playEnd() {
  chime(587.33, 0.18, 0.04, 2.8);
  setTimeout(() => chime(440, 0.16, 0.05, 2.4), 420);
  setTimeout(() => chime(293.66, 0.2, 0.06, 3.2), 900);
}
