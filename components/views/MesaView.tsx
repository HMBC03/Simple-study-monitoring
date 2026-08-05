'use client';

import { useEffect, useRef } from 'react';
import { useBitacora } from '@/store/useBitacora';
import { esc, fmtD, mesaBodyHTML, topicStatus } from '@/lib/logic';
import { startPomoFor } from '@/lib/timer';
import { confetti } from '@/lib/ui';

export default function MesaView() {
  const state = useBitacora(s => s.state);
  const selected = useBitacora(s => s.selectedTopicId);
  const selectTopic = useBitacora(s => s.selectTopic);
  const saveSession = useBitacora(s => s.saveSession);
  const resetTopic = useBitacora(s => s.resetTopic);
  const toast = useBitacora(s => s.toast);
  const openModal = useBitacora(s => s.openModal);
  const bodyRef = useRef<HTMLDivElement>(null);

  const tp = state.topics.find(t => t.id === selected);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el || !tp) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const sp = t.closest('[data-steppomo]');
      if (sp) { startPomoFor(tp.id, tp.subjectId, Number(sp.getAttribute('data-steppomo'))); return; }
      if (t.closest('#mesaPomo')) { startPomoFor(tp.id, tp.subjectId, null); return; }
      if (t.closest('#mesaResetT')) {
        void openModal({
          title: 'Reset topic',
          msg: `Reset <b>“${esc(tp.name)}”</b>? Its current sessions will be archived in History and the topic returns to “New” (first session).`,
          okText: 'Reset', danger: true,
        }).then(ok => {
          if (!ok) return;
          resetTopic(tp.id);
          toast('Topic reset ↺ Previous sessions archived in History.');
        });
        return;
      }
      const btn = t.closest('#mesaSave');
      if (btn) {
        const boxes = [...el.querySelectorAll('#stepsList input')];
        const steps = boxes.map(i => (i as HTMLInputElement).checked);
        const minInp = el.querySelector('#mesaMin') as HTMLInputElement | null;
        const noteInp = el.querySelector('#mesaNote') as HTMLInputElement | null;
        const min = Math.max(5, Number(minInp?.value) || 45);
        const note = (noteInp?.value ?? '').trim();
        saveSession(tp.id, min, note, steps);
        const ns = topicStatus(tp, useBitacora.getState().state);
        toast(ns.cls === 'master' ? 'Topic mastered! Curve completed 🎉'
          : ns.due ? `Session logged ✓ Next review: ${fmtD(ns.due)}` : 'Session logged ✓');
        confetti(btn as HTMLElement);
      }
    };
    const onChange = (e: Event) => {
      const inp = e.target as HTMLInputElement;
      if (inp.matches('input') && inp.closest('#stepsList')) {
        const lab = inp.closest('.step');
        if (lab) lab.classList.toggle('on', inp.checked);
      }
    };
    el.addEventListener('click', onClick);
    el.addEventListener('change', onChange);
    return () => {
      el.removeEventListener('click', onClick);
      el.removeEventListener('change', onChange);
    };
  }, [tp, saveSession, resetTopic, toast, openModal]);

  return (
    <section data-view="mesa">
      <div className="view-top">
        <div>
          <p className="eyebrow">Full view · detailed chart</p>
          <h1 className="view-title">Study desk</h1>
          <p className="view-sub">Watch your topic&apos;s forgetting curve, launch pomodoros per step and log your session.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            id="mesaTopicSel"
            style={{ minWidth: 240 }}
            aria-label="Choose topic"
            value={tp?.id ?? ''}
            onChange={e => selectTopic(e.target.value || null)}
          >
            <option value="">— choose a topic —</option>
            {state.subjects.map(sub => {
              const tps = state.topics.filter(t => t.subjectId === sub.id);
              if (!tps.length) return null;
              return (
                <optgroup key={sub.id} label={sub.name}>
                  {tps.map(t => {
                    const s = topicStatus(t, state);
                    return <option key={t.id} value={t.id}>{t.name} ({s.label})</option>;
                  })}
                </optgroup>
              );
            })}
          </select>
          {tp && (
            <span className={'pill ' + topicStatus(tp, state).cls}>
              {topicStatus(tp, state).label}
            </span>
          )}
        </div>
      </div>
      <div className="card">
        {tp ? (
          <div ref={bodyRef} dangerouslySetInnerHTML={{ __html: mesaBodyHTML(tp, state, true) }} />
        ) : (
          <div className="mesa-empty">
            {state.topics.length
              ? 'Pick a topic in the selector above to see its curve in detail.'
              : 'Create a subject and a topic under “Today” to get started. ✍'}
          </div>
        )}
      </div>
    </section>
  );
}
