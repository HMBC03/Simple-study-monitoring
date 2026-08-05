'use client';

import { useEffect, useState } from 'react';
import { useBitacora } from '@/store/useBitacora';
import { getTimer, resetTimer, resumeTimer, stopTimer, subscribeTimer } from '@/lib/timer';
import { PHRASES } from '@/lib/constants';

const FCIRC = 1193.81;
const pad = (n: number) => String(n).padStart(2, '0');

export default function FocusOverlay() {
  const visible = useBitacora(s => s.focusVisible);
  const state = useBitacora(s => s.state);
  const pomoSubjectId = useBitacora(s => s.pomoSubjectId);
  const pomoTopicId = useBitacora(s => s.pomoTopicId);
  const setFocusVisible = useBitacora(s => s.setFocusVisible);
  const openModal = useBitacora(s => s.openModal);
  const pomoTick = useBitacora(s => s.pomoTick);
  const [snap, setSnap] = useState(getTimer());
  const [phraseIdx, setPhraseIdx] = useState(() => Math.floor(Math.random() * PHRASES.length));
  const [done, setDone] = useState(false);

  useEffect(() => subscribeTimer(() => setSnap(getTimer())), []);

  useEffect(() => {
    if (pomoTick <= 0) return;
    const t1 = setTimeout(() => setDone(true), 0);
    const t2 = setTimeout(() => setDone(false), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [pomoTick]);

  useEffect(() => {
    if (!visible) return;
    const t0 = setTimeout(() => setDone(false), 0);
    const iv = setInterval(() => setPhraseIdx(i => (i + 1) % PHRASES.length), 18000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      stopTimer();
      resetTimer();
      setFocusVisible(false);
    };
    document.addEventListener('keydown', onKey, true);
    return () => { clearTimeout(t0); clearInterval(iv); document.removeEventListener('keydown', onKey, true); };
  }, [visible, setFocusVisible]);

  if (!visible) return null;

  const sub = state.subjects.find(x => x.id === pomoSubjectId);
  const tp = state.topics.find(x => x.id === pomoTopicId);
  const phrase = PHRASES[phraseIdx];
  const m = Math.floor(snap.left / 60), s = snap.left % 60;
  const offset = FCIRC * (1 - snap.left / snap.dur);
  const running = snap.running;
  const pausedState = !running && snap.left > 0 && snap.left < snap.dur;

  return (
    <div className="focus-veil" id="focusVeil">
      <div className="grain" aria-hidden="true" style={{ zIndex: 505 }} />
      <button
        className="focus-close"
        title="Exit focus mode"
        onClick={() => { stopTimer(); resetTimer(); setFocusVisible(false); }}
      >
        ×
      </button>
      <div className="focus-inner">
        <p className="focus-subject">{sub ? sub.name : 'Free session'}</p>
        <p className="focus-topic">{tp ? tp.name : 'Pomodoro without a specific topic'}</p>
        <div className="focus-ring-wrap">
          <svg viewBox="0 0 440 440">
            <circle className="focus-ring-bg" cx="220" cy="220" r="190" />
            <circle className="focus-ring-fg" cx="220" cy="220" r="190" strokeDasharray="1193.81" strokeDashoffset={offset} transform="rotate(-90 220 220)" />
          </svg>
          <div className="focus-digits">
            <span className="focus-time">{pad(m)}:{pad(s)}</span>
            <span className="focus-state">
              {done ? 'completed!' : pausedState ? <span>paused</span> : <><span className="dot-live"></span>in focus</>}
            </span>
          </div>
        </div>
        <p className="focus-phrase">“{phrase.t}”<span className="f-aut">{phrase.a}</span></p>
      </div>
      <div className="focus-foot">
        <button
          className="focus-btn"
          onClick={() => {
            if (running) stopTimer();
            else if (pausedState) resumeTimer();
          }}
        >
          {running || pausedState ? '❚❚ Pause' : '▶ Resume'}
        </button>
        <button
          className="focus-btn"
          onClick={async () => {
            const ok = await openModal({
              title: 'Reset pomodoro',
              msg: 'The current pomodoro stops and the clock returns to its full duration. Continue?',
              okText: 'Reset', danger: true,
            });
            if (!ok) return;
            resetTimer();
            setFocusVisible(false);
            useBitacora.getState().toast('Pomodoro reset ↺');
          }}
        >
          ↺ <span className="short">Stop</span><span className="long">Reset</span>
        </button>
      </div>
    </div>
  );
}
