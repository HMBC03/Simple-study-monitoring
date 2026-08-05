'use client';

import { useEffect, useRef, useState } from 'react';
import { useBitacora } from '@/store/useBitacora';
import { beginTimer, getTimer, resetTimer, setPresetDuration, stopTimer, subscribeTimer } from '@/lib/timer';
import { confetti } from '@/lib/ui';

const CIRC = 389.56;
const pad = (n: number) => String(n).padStart(2, '0');

export default function PomodoroCard() {
  const state = useBitacora(s => s.state);
  const soundOn = useBitacora(s => s.soundOn);
  const setSoundOn = useBitacora(s => s.setSoundOn);
  const pomoSubjectId = useBitacora(s => s.pomoSubjectId);
  const pomoTopicId = useBitacora(s => s.pomoTopicId);
  const setPomoSelection = useBitacora(s => s.setPomoSelection);
  const pomoTick = useBitacora(s => s.pomoTick);
  const [snap, setSnap] = useState(getTimer());
  const [done, setDone] = useState(false);
  const selfRef = useRef<HTMLElement>(null);

  useEffect(() => subscribeTimer(() => setSnap(getTimer())), []);
  useEffect(() => {
    if (pomoTick <= 0) return;
    confetti(selfRef.current ?? document.body);
    const t1 = setTimeout(() => setDone(true), 0);
    const t2 = setTimeout(() => setDone(false), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [pomoTick]);

  const running = snap.running;
  const m = Math.floor(snap.left / 60), s = snap.left % 60;
  const offset = CIRC * (1 - snap.left / snap.dur);
  const stateTxt = done ? 'done!' : running ? 'in focus' : (snap.left < snap.dur ? 'paused' : 'ready');

  return (
    <article className="card c4" id="pomoCard" ref={selfRef}>
      <div className="card-head">
        <div><p className="eyebrow">In focus</p><h2>Pomodoro</h2>
          <p className="card-desc">Focus timer. When you start it, you enter full-screen focus mode.</p></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.3rem', alignItems: 'flex-end' }}>
          <span className="head-note" style={{ whiteSpace: 'nowrap' }}>15 · 25 · 50<br />minutes</span>
          <label className="sound-toggle" title="Soft start and end sounds">
            <input type="checkbox" checked={soundOn} onChange={e => setSoundOn(e.target.checked)} />
            <span>🔔 sounds</span>
          </label>
        </div>
      </div>
      <div className="pomo-body">
        <div className="ring-wrap">
          <svg viewBox="0 0 150 150" width="150" height="150">
            <circle className="ring-bg" cx="75" cy="75" r="62" />
            <circle className="ring-fg" cx="75" cy="75" r="62" strokeDasharray="389.56" strokeDashoffset={offset} transform="rotate(-90 75 75)" />
          </svg>
          <div className="ring-digits">
            <span className="time">{pad(m)}:{pad(s)}</span>
            <span className="state">{stateTxt}</span>
          </div>
        </div>
        <select
          aria-label="Subject"
          value={pomoSubjectId ?? ''}
          onChange={e => setPomoSelection(e.target.value || null, null)}
        >
          <option value="">— No subject (free) —</option>
          {state.subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
        </select>
        <select
          aria-label="Topic"
          disabled={!pomoSubjectId}
          value={pomoTopicId ?? ''}
          onChange={e => setPomoSelection(pomoSubjectId, e.target.value || null)}
        >
          <option value="">— choose topic —</option>
          {state.topics.filter(t => t.subjectId === pomoSubjectId).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <div className="presets" role="group" aria-label="Duration">
          {[15, 25, 50].map(min => (
            <button
              key={min}
              className={snap.dur === min * 60 ? 'active' : ''}
              onClick={() => setPresetDuration(min)}
            >
              {min}m
            </button>
          ))}
        </div>
        <div className="pomo-ctrl">
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => { if (running) stopTimer(); else beginTimer(); }}
          >
            {running ? '❚❚ Pause' : '▶ Start'}
          </button>
          <button className="btn" aria-label="Reset" onClick={() => resetTimer()}>↺</button>
        </div>
      </div>
    </article>
  );
}
