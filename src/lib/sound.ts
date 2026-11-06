// Pure WebAudio synthesized Roblox GUI & Studio tactile sound effects (zero external dependencies)

let audioCtx: AudioContext | null = null;
let soundMuted = false;

export function setSoundMuted(muted: boolean) {
  soundMuted = muted;
}

export function isSoundMuted(): boolean {
  return soundMuted;
}

function getCtx(): AudioContext | null {
  if (soundMuted || typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (Ctor) audioCtx = new Ctor();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playRbxClick() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(190, now + 0.045);
  gain.gain.setValueAtTime(0.11, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.048);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.05);
}

export function playRbxHover() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(780, now);
  osc.frequency.exponentialRampToValueAtTime(920, now + 0.018);
  gain.gain.setValueAtTime(0.025, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.022);
}

export function playRbxCoin() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const notes = [987.77, 1318.51]; // B5 -> E6 classic Roblox coin/purchase ding
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.065);
    gain.gain.setValueAtTime(0.1, now + idx * 0.065);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.065 + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + idx * 0.065);
    osc.stop(now + idx * 0.065 + 0.24);
  });
}

export function playStudioSyncChime() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const chord = [523.25, 659.25, 783.99, 1046.5]; // C5 major arpeggio
  chord.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const start = now + i * 0.055;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.08, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.3);
  });
}

export function playPrankRevealSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  // Classic Roblox-esque comical slide + fanfare
  const freqs = [440, 415.3, 392, 349.23];
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    const t = now + i * 0.16;
    osc.frequency.setValueAtTime(f, t);
    if (i === 3) {
      osc.frequency.linearRampToValueAtTime(220, t + 0.45);
    }
    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (i === 3 ? 0.48 : 0.15));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + (i === 3 ? 0.5 : 0.16));
  });
}

export function assetUrl(path: string): string {
  const clean = path.replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${clean}`;
}
