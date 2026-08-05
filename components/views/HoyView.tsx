'use client';

import { useEffect, useRef, useState } from 'react';
import { useBitacora } from '@/store/useBitacora';
import {
  activeIV, calcStreak, curveSVG, esc, fmtD, fmtH, key, milestonesHTML, minsOn,
  queueHTML, subjectOf, subjectsHTML, todayMins, topicStatus, weekMins,
} from '@/lib/logic';
import { RM } from '@/lib/ui';
import PomodoroCard from '@/components/pomodoro/PomodoroCard';

const fmtHM = (v: number) => fmtH(Math.round(v));
const fmtInt = (v: number) => String(Math.round(v));

/* ─── números animados (como tween del original) ─── */
function AnimatedNumber({ value, fmt }: { value: number; fmt: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const first = useRef(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (first.current) {
      first.current = false;
      if (RM) { el.textContent = fmt(value); return; }
      const t0 = performance.now(), dur = 900;
      let raf = 0;
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = fmt(value * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }
    el.textContent = fmt(value);
  }, [value, fmt]);
  return <span ref={ref}>{fmt(value)}</span>;
}

/* ─── encabezado hero + resumen ─── */
function HoyOpening() {
  const state = useBitacora(s => s.state);
  const updateName = useBitacora(s => s.updateName);
  const openModal = useBitacora(s => s.openModal);
  const d = new Date();
  const f = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(d);
  const g = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(d);
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const h = d.getHours();
  const greet = h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches';
  const dueN = state.topics.filter(t => { const s = topicStatus(t, state); return s.diff !== null && s.diff <= 0; }).length;
  const nm = state.name ? `, <b>${esc(state.name)}</b>` : '';
  const wk = weekMins(state);

  return (
    <div className="grid opening">
      <div className="c7">
        <p className="eyebrow">Repaso espaciado contra la curva del olvido · {greet.toLowerCase()}</p>
        <h1>
          <span className="rl"><span>{cap(f)},</span></span>
          <span className="rl"><span>{cap(g)}.</span></span>
        </h1>
        <svg className="underline" viewBox="0 0 470 24" preserveAspectRatio="none" aria-hidden="true">
          <path d="M4 16 C 90 4, 180 24, 280 10 S 420 16, 466 8" />
        </svg>
        <p className="sub">
          ¡{greet}{nm}! Llevas <b>{fmtH(wk)}</b> esta semana y{' '}
          <b>{dueN}</b> {dueN === 1 ? 'repaso espera' : 'repasos esperan'} hoy. La constancia vence a la curva del olvido.{' '}
          <button
            className="edit-name"
            title="Cambiar nombre"
            onClick={async () => {
              const n = await openModal({ title: 'Tu nombre', msg: '¿Cómo te llamas? Solo para saludarte.', inputValue: '' });
              if (n !== null && typeof n === 'string') updateName(n);
            }}
          >
            ✎
          </button>
        </p>
      </div>
      <aside className="card c5" aria-label="Resumen de hoy">
        <div className="card-head">
          <div>
            <p className="eyebrow">Resumen</p>
            <h2>Hoy</h2>
            <p className="card-desc">Tu día de un vistazo: tiempo, racha y repasos.</p>
          </div>
          <span className="head-note">{d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="tiles">
          <div className="tile"><p className="big"><AnimatedNumber value={todayMins(state)} fmt={fmtHM} /></p><p className="lbl">horas hoy</p></div>
          <div className="tile"><p className="big"><AnimatedNumber value={wk} fmt={fmtHM} /></p><p className="lbl">esta semana</p></div>
          <div className="tile"><p className="big"><em><AnimatedNumber value={calcStreak(state)} fmt={fmtInt} /></em></p><p className="lbl">racha · días</p></div>
          <div className="tile"><p className="big"><AnimatedNumber value={state.pomodoros} fmt={fmtInt} /></p><p className="lbl">pomodoros</p></div>
        </div>
        <p
          className="next-due"
          title="Ir a repasos"
          onClick={() => document.getElementById('queueCard')?.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' })}
        >
          <span className="pin">📌</span>
          {dueN > 0
            ? <span><b>{dueN}</b> {dueN === 1 ? 'repaso' : 'repasos'} para hoy · primero: <b>{esc(state.topics.filter(t => { const s = topicStatus(t, state); return s.diff !== null && s.diff <= 0; })[0]?.name ?? '—')}</b> →</span>
            : <span>Sin repasos pendientes ahora mismo. ¡Bien hecho!</span>}
        </p>
      </aside>
    </div>
  );
}

/* ─── barras de últimos 7 días ─── */
function BarsCard() {
  const state = useBitacora(s => s.state);
  const goalDaily = state.weeklyGoal * 60 / 7;
  const el = useRef<HTMLDivElement>(null);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
  const mins = days.map(d => minsOn(state, key(d)));
  const max = Math.max(...mins, goalDaily, 60);
  const tk = key(new Date());
  const Ls = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const total = mins.reduce((a, b) => a + b, 0);

  useEffect(() => {
    const apply = () => {
      el.current?.querySelectorAll('.bar').forEach(b => {
        const bEl = b as HTMLElement;
        bEl.style.transitionDelay = (RM ? 0 : (Number(bEl.dataset.i) || 0) * 70) + 'ms';
        bEl.style.transform = 'scaleY(1)';
      });
    };
    if (RM) apply();
    else requestAnimationFrame(() => requestAnimationFrame(apply));
  }, [state]);

  return (
    <article className="card c5">
      <div className="card-head">
        <div>
          <p className="eyebrow">Últimos 7 días</p>
          <h2>Minutos de estudio</h2>
          <p className="card-desc">Cuánto estudiaste cada día. La línea punteada es tu meta diaria.</p>
        </div>
        <span className="head-note">{fmtH(total)} en total</span>
      </div>
      <div className="bars" ref={el}>
        {days.map((d, i) => {
          const h = Math.max(mins[i] > 0 ? 6 : 3, mins[i] / max * 108);
          const today = key(d) === tk;
          return (
            <div className={'bar-col' + (today ? ' is-today' : '')} key={i}>
              <span className="bar-val">{mins[i] || ''}</span>
              <div
                className={'bar' + (today ? ' today' : '')}
                style={{ height: h + 'px', transform: 'scaleY(0)' }}
                data-i={i}
              />
              <span className="bar-lbl">{Ls[d.getDay()]}</span>
            </div>
          );
        })}
        <div className="goal-line" style={{ bottom: (24 + goalDaily / max * 108) + 'px' }}>
          <i>meta diaria</i>
        </div>
      </div>
    </article>
  );
}

/* ─── meta semanal + heatmap ─── */
function GoalCard() {
  const state = useBitacora(s => s.state);
  const openSettings = useBitacora(s => s.openSettings);
  const wk = weekMins(state);
  const C = 314.16, pct = Math.min(1, wk / (state.weeklyGoal * 60));
  const heat = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (13 - i)); return d; });
  return (
    <article className="card c3">
      <div className="card-head">
        <div>
          <p className="eyebrow">Meta semanal</p>
          <h2>Objetivo</h2>
          <p className="card-desc">Horas que quieres estudiar esta semana. Se edita en ⚙ Ajustes.</p>
        </div>
        <button className="link-btn" onClick={openSettings}>editar</button>
      </div>
      <div className="goal-ring-wrap">
        <div className="gring">
          <svg viewBox="0 0 118 118">
            <circle className="gr-bg" cx="59" cy="59" r="50" />
            <circle className="gr-fg" cx="59" cy="59" r="50" strokeDasharray="314.16" strokeDashoffset={C * (1 - pct)} transform="rotate(-90 59 59)" />
          </svg>
          <div className="gr-center">
            <span className="v">{fmtH(wk)}</span>
            <span className="t">de {state.weeklyGoal} h</span>
          </div>
        </div>
      </div>
      <p className="eyebrow" style={{ marginBottom: '.1rem' }}>Últimos 14 días</p>
      <div className="heat">
        {heat.map((d, i) => {
          const m = minsOn(state, key(d));
          const lvl = m <= 0 ? '' : m < 30 ? 'l1' : m < 60 ? 'l2' : m < 90 ? 'l3' : 'l4';
          return <i key={i} className={lvl} title={`${fmtD(d)}: ${m} min`} />;
        })}
      </div>
      <p className="heat-cap">Cada cuadrado es un día · más color = más estudio</p>
    </article>
  );
}

/* ─── miniatura de mesa ─── */
function MesaMiniCard() {
  const state = useBitacora(s => s.state);
  const selected = useBitacora(s => s.selectedTopicId);
  const switchView = useBitacora(s => s.switchView);
  const tp = state.topics.find(t => t.id === selected);
  const iv = activeIV(state);
  if (!tp) {
    return (
      <article className="card c7" id="mesaCardMini">
        <div className="card-head">
          <div><p className="eyebrow">Mesa de estudio</p><h2>Tu sesión activa</h2>
            <p className="card-desc">El tema que estás trabajando, con su curva del olvido.</p></div>
          <span id="mesaPillMini"></span>
        </div>
        <div className="mesa-empty">Aún no hay tema seleccionado.</div>
        <div style={{ marginTop: '.9rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn" onClick={() => switchView('mesa')}>Ver vista completa →</button>
        </div>
      </article>
    );
  }
  const s = topicStatus(tp, state), sub = subjectOf(state, tp.subjectId);
  return (
    <article className="card c7" id="mesaCardMini">
      <div className="card-head">
        <div><p className="eyebrow">Mesa de estudio</p><h2>{sub ? sub.name + ' · ' : ''}{tp.name}</h2>
          <p className="card-desc">El tema que estás trabajando, con su curva del olvido.</p></div>
        <span className={'pill ' + s.cls}>{s.label}</span>
      </div>
      <div>
        <div className="curve-box" dangerouslySetInnerHTML={{ __html: curveSVG(tp, iv) }} />
        <div className="milestones" dangerouslySetInnerHTML={{ __html: milestonesHTML(tp, state) }} />
        <p className="mesa-next" style={{ marginTop: '.8rem' }}>
          Retención hoy: <b>{s.n ? s.ret + '%' : '—'}</b> · {s.cls === 'master' ? 'curva completada' : s.n === 0 ? 'primera sesión pendiente' : `próximo repaso: <b>${fmtD(s.due as Date)}</b>`}
        </p>
      </div>
      <div style={{ marginTop: '.9rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn" onClick={() => switchView('mesa')}>Ver vista completa →</button>
      </div>
    </article>
  );
}

/* ─── cola de repasos ─── */
function QueueCard() {
  const state = useBitacora(s => s.state);
  const selectTopic = useBitacora(s => s.selectTopic);
  const switchView = useBitacora(s => s.switchView);
  const { count, html } = queueHTML(state);
  return (
    <article className="card c5" id="queueCard">
      <div className="card-head">
        <div><p className="eyebrow">¿Qué repaso toca?</p><h2>Repasos</h2>
          <p className="card-desc">Temas que debes reestudiar según tus intervalos activos.</p></div>
        <span className="head-note">{count}</span>
      </div>
      <div
        onClick={e => {
          const b = (e.target as HTMLElement).closest('[data-open]');
          if (!b) return;
          selectTopic(b.getAttribute('data-open'));
          switchView('mesa');
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}

/* ─── asignaturas y temas ─── */
function SubjectsCard() {
  const state = useBitacora(s => s.state);
  const collapsed = useBitacora(s => s.collapsed);
  const selected = useBitacora(s => s.selectedTopicId);
  const commit = useBitacora(s => s.commit);
  const toast = useBitacora(s => s.toast);
  const openModal = useBitacora(s => s.openModal);
  const toggleCollapsed = useBitacora(s => s.toggleCollapsed);
  const openSubject = useBitacora(s => s.openSubject);
  const selectTopic = useBitacora(s => s.selectTopic);
  const deleteTopic = useBitacora(s => s.deleteTopic);
  const deleteSubject = useBitacora(s => s.deleteSubject);
  const iv = activeIV(state);

  const [newName, setNewName] = useState('');
  const el = useRef<HTMLDivElement>(null);
  const html = subjectsHTML(state, collapsed, selected);

  useEffect(() => {
    const go = () => el.current?.querySelectorAll('.retbar i').forEach(i => {
      (i as HTMLElement).style.width = ((i as HTMLElement).dataset.w ?? '0') + '%';
    });
    if (RM) go();
    else requestAnimationFrame(() => requestAnimationFrame(go));
  }, [html]);

  return (
    <article className="card c12">
      <div className="card-head">
        <div><p className="eyebrow">Tu mapa de conocimiento</p><h2>Asignaturas y temas</h2>
          <p className="card-desc">Crea asignaturas y agrégales temas. Toca cada asignatura para desplegar sus temas.</p></div>
        <span className="head-note">intervalos<br />{iv.length ? iv.join(' · ') + ' días' : 'sin repasos activos ⚙'}</span>
      </div>
      <form
        className="add-form"
        id="subjForm"
        onSubmit={e => {
          e.preventDefault();
          const nm = newName.trim();
          if (!nm) return;
          commit(s => {
            const id = 'sub' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
            s.subjects.push({ id, name: nm, color: ['#C8471F', '#2F5D8A', '#3E6B4F', '#8A5A17', '#7D4A92', '#A63A4B', '#22706B'][s.subjects.length % 7] });
          });
          setNewName('');
          toast('Asignatura creada: ' + nm);
        }}
      >
        <input
          id="subjName"
          placeholder="Nueva asignatura… (ej. Geometría)"
          maxLength={40}
          required
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button className="btn" type="submit">+ Añadir asignatura</button>
      </form>
      <div
        ref={el}
        id="subjList"
        onClick={async e => {
          const t = e.target as HTMLElement;
          const dt = t.closest('[data-del-topic]');
          if (dt) {
            e.stopPropagation();
            const id = dt.getAttribute('data-del-topic')!;
            const tp = state.topics.find(x => x.id === id);
            const ok = await openModal({
              title: 'Eliminar tema',
              msg: `¿Eliminar <b>«${esc(tp?.name ?? '')}»</b> y todo su historial de repasos?`,
              okText: 'Eliminar', danger: true,
            });
            if (ok) deleteTopic(id);
            return;
          }
          const ds = t.closest('[data-del-subject]');
          if (ds) {
            e.stopPropagation();
            const id = ds.getAttribute('data-del-subject')!;
            const sub = subjectOf(state, id);
            const n = state.topics.filter(x => x.subjectId === id).length;
            const ok = await openModal({
              title: 'Eliminar asignatura',
              msg: `¿Eliminar <b>«${esc(sub?.name ?? '')}»</b> con sus ${n} temas?`,
              okText: 'Eliminar', danger: true,
            });
            if (ok) deleteSubject(id);
            return;
          }
          const sh = t.closest('[data-subhead]');
          if (sh && !t.closest('.del')) {
            toggleCollapsed(sh.getAttribute('data-subhead')!);
            return;
          }
          const tpEl = t.closest('[data-topic]');
          if (tpEl && !t.closest('.del')) {
            selectTopic(tpEl.getAttribute('data-topic'));
          }
        }}
        onSubmit={e => {
          e.preventDefault();
          const f = e.target as HTMLFormElement;
          const subId = f.getAttribute('data-add-topic')!;
          const inp = f.querySelector('input') as HTMLInputElement;
          const nm = inp.value.trim();
          if (!nm) return;
          const id = 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
          commit(s => {
            s.topics.push({ id, subjectId: subId, name: nm, created: key(new Date()), studies: [], notes: [] });
          });
          openSubject(subId);
          selectTopic(id);
          toast('Tema añadido: ' + nm);
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}

export default function HoyView() {
  return (
    <section data-view="hoy">
      <HoyOpening />
      <div className="grid">
        <PomodoroCard />
        <BarsCard />
        <GoalCard />
        <MesaMiniCard />
        <QueueCard />
        <SubjectsCard />
      </div>
    </section>
  );
}
