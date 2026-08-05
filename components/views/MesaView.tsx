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
          title: 'Restablecer tema',
          msg: `¿Restablecer <b>«${esc(tp.name)}»</b>? Sus sesiones actuales se archivarán en el Historial y el tema volverá a «Nuevo» (primera sesión).`,
          okText: 'Restablecer', danger: true,
        }).then(ok => {
          if (!ok) return;
          resetTopic(tp.id);
          toast('Tema restablecido ↺ Lo anterior quedó archivado en Historial.');
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
        toast(ns.cls === 'master' ? '¡Tema dominado! Curva completada 🎉'
          : ns.due ? `Sesión registrada ✓ Próximo repaso: ${fmtD(ns.due)}` : 'Sesión registrada ✓');
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
          <p className="eyebrow">Vista completa · gráfico a detalle</p>
          <h1 className="view-title">Mesa de estudio</h1>
          <p className="view-sub">Observa la curva del olvido de tu tema, lanza pomodoros por paso y registra tu sesión.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            id="mesaTopicSel"
            style={{ minWidth: 240 }}
            aria-label="Elegir tema"
            value={tp?.id ?? ''}
            onChange={e => selectTopic(e.target.value || null)}
          >
            <option value="">— elige un tema —</option>
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
              ? 'Elige un tema en el selector de arriba para ver su curva a detalle.'
              : 'Crea una asignatura y un tema en «Hoy» para empezar. ✍'}
          </div>
        )}
      </div>
    </section>
  );
}
