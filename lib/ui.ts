import { PALETTE } from '@/lib/constants';

export const RM = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

export function confetti(el: HTMLElement) {
  if (RM) return;
  const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 3;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span');
    p.className = 'confetti';
    const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 110;
    p.style.cssText = `left:${cx}px;top:${cy}px;background:${PALETTE[i % PALETTE.length]};--tx:${Math.cos(a) * d}px;--ty:${Math.sin(a) * d - 40}px;--r:${Math.random() * 540 - 270}deg`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1000);
  }
}

export function download(name: string, content: string, type: string) {
  const b = new Blob([content], { type }), a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
}
