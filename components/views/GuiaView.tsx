'use client';

import { useBitacora } from '@/store/useBitacora';
import { curveSVG, daysAgo, esc, key } from '@/lib/logic';
import type { Topic } from '@/lib/types';

export default function GuiaView() {
  const state = useBitacora(s => s.state);
  const switchView = useBitacora(s => s.switchView);
  const fake = {
    id: 'fake', subjectId: 'x', name: 'Demo', created: key(new Date()), notes: [],
    studies: [
      { ts: 0, date: key(daysAgo(12)), minutes: 50, steps: [1, 1, 1, 1, 1].map(Boolean), note: '' },
      { ts: 0, date: key(daysAgo(10)), minutes: 45, steps: [1, 1, 1, 1, 1].map(Boolean), note: '' },
      { ts: 0, date: key(daysAgo(6)), minutes: 50, steps: [1, 1, 1, 1, 1].map(Boolean), note: '' },
      { ts: 0, date: key(daysAgo(3)), minutes: 40, steps: [1, 1, 1, 1, 1].map(Boolean), note: '' },
    ],
  } satisfies Topic;

  return (
    <section data-view="guia">
      <article className="card guide">
        <p className="eyebrow">Guía completa</p>
        <h1 className="view-title" style={{ marginBottom: '.6rem' }}>Cómo funciona</h1>
        <p>
          Esta bitácora convierte métodos de la psicología del aprendizaje —todos de dominio público y uso libre— en una rutina diaria simple: estudias un tema, y la app te dice <b>cuándo repasarlo</b> para que no lo olvides.
        </p>

        <h2><span className="gnum">1 ·</span> La curva del olvido</h2>
        <p>
          Desde los experimentos de Hermann Ebbinghaus (1885) sabemos que lo aprendido se desvanece de forma exponencial si no se repasa. Cada repaso «rescata» la memoria y hace que la siguiente caída sea más lenta.
        </p>
        <div className="curve-box" dangerouslySetInnerHTML={{ __html: curveSVG(fake, [1, 3, 7, 15, 30]) }} />
        <div className="legend">
          <span><i className="dot" style={{ background: '#3E6B4F' }}></i> repaso realizado</span>
          <span><i className="dot" style={{ background: '#C8471F' }}></i> hoy / próximo repaso</span>
          <span style={{ color: '#C8471F' }}>— — umbral del 55%</span>
        </div>

        <h3>Cómo leer el gráfico, sin haber leído nada antes</h3>
        <ol>
          <li><b>Eje vertical (0–100):</b> tu <b>retención estimada</b>, es decir, cuánto recuerdas hoy de lo estudiado.</li>
          <li><b>Eje horizontal:</b> los días transcurridos, con fechas reales abajo.</li>
          <li><b>Línea negra sólida:</b> tu memoria <b>cayendo</b> desde cada sesión.</li>
          <li><b>Puntos verdes:</b> repasos que ya hiciste. Cada uno devuelve la memoria a ~100% y aplana la siguiente caída.</li>
          <li><b>Punto naranja «hoy»:</b> dónde estás ahora mismo, con tu porcentaje de retención.</li>
          <li><b>Línea gris punteada:</b> la <b>predicción</b> de hacia dónde va tu memoria si no repasas.</li>
          <li><b>Círculo naranja (R# · fecha):</b> el día en que esa predicción cruzará el umbral: es tu <b>próximo repaso programado</b>.</li>
          <li><b>Línea roja punteada = umbral de repaso (~55%):</b> ver abajo qué significa.</li>
        </ol>
        <p>
          <b>¿Qué es un umbral?</b> Es el <b>límite mínimo de retención que decides tolerar</b> antes de repasar. Aquí usamos ~55%: si repasas <i>por encima</i> del umbral, el repaso es rápido y fortalece; si dejas que la memoria caiga <i>por debajo</i>, ya no estarías repasando sino <b>reaprendiendo</b> (cuesta casi como aprender de cero). Por eso, cuando un repaso se vence por muchos días, la bitácora te recomienda <b>restablecer el tema</b> y empezar la curva de nuevo.
        </p>

        <h2><span className="gnum">2 ·</span> Repasos espaciados (1 · 3 · 7 · 15 · 30 días)</h2>
        <p>
          Cuando estudias un tema por primera vez, se agenda tu primer repaso para <b>1 día</b> después. Al completarlo, el siguiente cae a los <b>3 días</b>, luego <b>7</b>, <b>15</b> y <b>30</b>. Tras el último, el tema queda <b>Dominado ✓</b>.
        </p>
        <ul>
          <li>La cola <b>«Repasos»</b> te muestra lo vencido, lo de hoy y lo próximo.</li>
          <li>En <b>⚙ Ajustes</b> decides <b>cuántos repasos quieres activar</b>. El calendario y la curva se adaptan.</li>
          <li>Si un repaso <b>se venció</b>, verás en la Mesa de estudio el aviso «se recomienda restablecer el repaso» con su botón para hacerlo (el historial viejo se archiva, no se pierde).</li>
        </ul>

        <h2><span className="gnum">3 ·</span> Tu método de sesión</h2>
        <p>La plantilla de ejemplo trae 5 pasos inspirados en técnicas conocidas:</p>
        <ol id="guideSteps">
          {state.steps.map((s, i) => (
            <li key={i}><b>{esc(s.t)}</b>{s.s ? ' — ' + esc(s.s) : ''}</li>
          ))}
        </ol>
        <p>
          Es solo una plantilla: en <b>⚙ Ajustes</b> puedes <b>renombrar, añadir o quitar pasos</b>, o <b>desactivar el checklist</b>. Cada paso tiene un botón ⏱ que lanza un pomodoro y, al terminar, marca ese paso como completo.
        </p>

        <h2><span className="gnum">4 ·</span> Tus datos: son tuyos, cuídalos</h2>
        <div className="warn-box">
          ⚠️ Todo se guarda en el <b>almacenamiento local de tu navegador (IndexedDB)</b>: mucho más espacio que antes y <b>solo en este navegador</b>. Si borras los datos de navegación, usas modo incógnito o cambias de equipo, <b>se pierde todo</b>.
        </div>
        <ul>
          <li><b>⬇ Backup .json</b>: descarga <b>todo</b> tu progreso.</li>
          <li><b>⬆ Cargar</b>: restaura ese archivo y sigues donde ibas.</li>
          <li><b>⬇ Informe .md</b>: un notebook legible por asignatura → tema.</li>
        </ul>

        <p style={{ marginTop: '1.4rem' }}>
          <button className="btn btn-primary" style={{ flex: 'none' }} onClick={() => switchView('hoy')}>
            Entendido, ¡a estudiar! →
          </button>
        </p>
      </article>
    </section>
  );
}
