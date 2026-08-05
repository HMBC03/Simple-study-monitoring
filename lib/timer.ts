import { key, uid } from '@/lib/logic';
import { playEnd, playStart } from '@/lib/sound';
import { persist } from '@/lib/storage';
import { useBitacora } from '@/store/useBitacora';
import { RM } from '@/lib/ui';

export type TimerSnapshot = { dur: number; left: number; running: boolean };

const T = { dur: 1500, left: 1500, running: false, end: 0, iv: null as number | null };

const listeners = new Set<() => void>();
const emit = () => listeners.forEach(f => f());

export function subscribeTimer(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
export const getTimer = (): TimerSnapshot => ({ dur: T.dur, left: T.left, running: T.running });

const pad = (n: number) => String(n).padStart(2, '0');
let DEFAULT_TITLE = 'Bitácora de Estudio';
if (typeof document !== 'undefined') DEFAULT_TITLE = document.title;

function updateTitle() {
  document.title = T.running
    ? `⏱ ${pad(Math.floor(T.left / 60))}:${pad(T.left % 60)} · Bitácora`
    : DEFAULT_TITLE;
}

export function stopTimer() {
  if (T.iv !== null) { clearInterval(T.iv); T.iv = null; }
  T.running = false;
  updateTitle();
  emit();
}

export function resumeTimer() {
  T.end = Date.now() + T.left * 1000;
  T.running = true;
  T.iv = window.setInterval(tick, 250);
  updateTitle();
  emit();
}

export function setPresetDuration(min: number) {
  stopTimer();
  T.dur = min * 60;
  T.left = T.dur;
  emit();
}

export function resetTimer() {
  stopTimer();
  T.left = T.dur;
  useBitacora.getState().setFocusVisible(false);
  emit();
}

export function beginTimer() {
  try { playStart(); } catch { /* audio no disponible */ }
  T.end = Date.now() + T.left * 1000;
  T.running = true;
  T.iv = window.setInterval(tick, 250);
  useBitacora.getState().setFocusVisible(true);
  updateTitle();
  emit();
}

export function startPomoFor(topicId: string, subjectId: string | null, stepIdx: number | null) {
  const st = useBitacora.getState();
  st.setPomoSelection(subjectId, topicId, stepIdx);
  stopTimer();
  T.left = T.dur;
  beginTimer();
}

function tick() {
  T.left = Math.max(0, Math.round((T.end - Date.now()) / 1000));
  updateTitle();
  emit();
  if (T.left <= 0) completeTimer();
}

function completeTimer() {
  stopTimer();
  T.left = T.dur;
  const st = useBitacora.getState();
  const mins = T.dur / 60, tk = key(new Date());
  const topicId = st.pomoTopicId;
  const stepIdx = st.pendingStep;
  const topicName = st.state.topics.find(t => t.id === topicId)?.name ?? null;
  const msg = topicName
    ? `Pomodoro done! +${mins} min on “${topicName}”${stepIdx != null && st.state.stepsOn ? ` · step ${stepIdx + 1} ✓` : ''} ⏱`
    : `Pomodoro completed! +${mins} min ⏱`;
  st.mut(s => {
    const tp = s.topics.find(t => t.id === topicId);
    if (tp) {
      let study = tp.studies.find(x => x.date === tk);
      if (study) study.minutes += mins;
      else {
        study = { ts: Date.now(), date: tk, minutes: mins, steps: s.steps.map(() => false), note: '' };
        tp.studies.push(study);
      }
      if (stepIdx != null && s.stepsOn) {
        while (study.steps.length < s.steps.length) study.steps.push(false);
        study.steps[stepIdx] = true;
      }
    } else {
      s.loose.push({ id: uid(), ts: Date.now(), date: tk, minutes: mins });
    }
    s.pomodoros++;
  });
  void persist(st.state);
  st.setPomoSelection(null, null, null);
  st.toast(msg);
  st.bumpPomoTick();
  playEnd();
  if (RM) st.setFocusVisible(false);
  else setTimeout(() => useBitacora.getState().setFocusVisible(false), 1500);
  emit();
}
