export const KEY_LEGACY = 'bitacora-olvido-v4';
export const KEY_MIRROR = 'bitacora-olvido-v5';
export const DB_NAME = 'bitacora';
export const DB_VERSION = 1;

export const PALETTE = [
  '#C8471F', '#2F5D8A', '#3E6B4F', '#8A5A17', '#7D4A92', '#A63A4B', '#22706B',
];

export const IV = [1, 3, 7, 15, 30];

export const DEFAULT_STEPS: { t: string; s: string }[] = [
  { t: 'Lectura del tema', s: 'o visualización de material / video' },
  { t: 'Graficar o dibujar', s: 'aquellas partes que lo permitan' },
  { t: 'Ejercicios', s: 'resolver de 10 a 20' },
  { t: 'Demostración del tema', s: 'hazla tú, sin mirar apuntes' },
  { t: 'Método Feynman', s: 'explícalo por escrito y reevalúa qué falló' },
];

export const PHRASES = [
  { t: 'Necesito saberlo todo de una manera que pueda explicárselo a un niño.', a: '— Richard Feynman' },
  { t: 'Si no puedes explicarlo en términos simples, no lo has comprendido lo suficiente.', a: '— Albert Einstein' },
  { t: 'La memoria es el centinela del cerebro.', a: '— William Shakespeare' },
  { t: 'No es que sea muy inteligente, es que me quedo con los problemas más tiempo.', a: '— Albert Einstein' },
  { t: 'La mente no es un vaso que llenar, sino una lámpara que encender.', a: '— Plutarco' },
  { t: 'La repetición es la madre del aprendizaje.', a: '— Tony Robbins' },
  { t: 'El que estudia, vive el doble.', a: '— Marco Valerio Marcial' },
  { t: 'Comienza donde estás. Usa lo que tienes. Haz lo que puedas.', a: '— Arthur Ashe' },
  { t: 'La curiosidad es la mecha en la vela del aprendizaje.', a: '— William Arthur Ward' },
  { t: 'El experto en algo fue una vez un principiante.', a: '— Helen Hayes' },
  { t: 'La lectura es a la mente lo que el ejercicio al cuerpo.', a: '— Joseph Addison' },
  { t: 'Lo que oigo, lo olvido; lo que veo, lo recuerdo; lo que hago, lo entiendo.', a: '— Confucio' },
];

export const SOURCES = [
  { tag: 'curva', tagText: 'Curva del olvido',
    cite: 'iSpring Solutions. (s.f.). <span class="tit">Curva del olvido de Ebbinghaus</span>. <span class="src">iSpring Blog.</span>',
    url: 'https://www.ispring.es/blog/curva-del-olvido',
    sum: 'Explica con gráficos y ejemplos la famosa curva del olvido y cómo el repaso espaciado la aplana.' },
  { tag: 'curva', tagText: 'Curva del olvido',
    cite: 'Psicología y Mente. (s.f.). <span class="tit">La curva del olvido de Ebbinghaus: qué es y cómo funciona</span>. <span class="src">Psicología y Mente.</span>',
    url: 'https://psicologiaymente.com/psicologia/curva-del-olvido',
    sum: 'Artículo divulgativo que contextualiza los experimentos originales y propone estrategias prácticas.' },
  { tag: 'bio', tagText: 'Biografía',
    cite: 'Psicología y Mente. (s.f.). <span class="tit">Hermann Ebbinghaus: biografía del psicólogo alemán pionero en el estudio de la memoria</span>. <span class="src">Psicología y Mente.</span>',
    url: 'https://psicologiaymente.com/biografias/hermann-ebbinghaus',
    sum: 'Biografía del padre de la psicología experimental de la memoria.' },
  { tag: 'meta', tagText: 'Métodos de estudio',
    cite: 'Universidad Internacional de La Rioja. (s.f.). <span class="tit">Técnicas de estudio: 11 métodos y estrategias para mejorar el rendimiento académico</span>. <span class="src">UNIR Revista.</span>',
    url: 'https://www.unir.net/revista/educacion/tecnicas-de-estudio/',
    sum: 'Panorama de métodos validados: Pomodoro, Cornell, Feynman, mapas mentales.' },
  { tag: 'bio', tagText: 'Biografía',
    cite: 'Encyclopædia Britannica. (2024). <span class="tit">Hermann Ebbinghaus | Biography, Memory, &amp; Psychology</span>. <span class="src">En Encyclopædia Britannica.</span>',
    url: 'https://www.britannica.com/biography/Hermann-Ebbinghaus',
    sum: 'Entrada enciclopédica que resume la obra Über das Gedächtnis (1885).' },
  { tag: 'meta', tagText: 'Neurociencia',
    cite: 'Cleveland Clinic. (2022, 2 de mayo). <span class="tit">Memory: Types, processes and how to improve</span>. <span class="src">Health Essentials.</span>',
    url: 'https://my.clevelandclinic.org/health/articles/memory',
    sum: 'Guía clínica sobre memoria a corto y largo plazo, el papel del sueño y estrategias de retención.' },
  { tag: 'meta', tagText: 'Métodos de estudio',
    cite: 'IE School of Business. (s.f.). <span class="tit">¿Qué es el método Pomodoro y cómo se aplica?</span> <span class="src">IE Insights.</span>',
    url: 'https://iep.edu.es/que-es-el-metodo-pomodoro/',
    sum: 'Presenta el método de Francesco Cirillo: bloques de 25 minutos de foco + descansos.' },
  { tag: 'meta', tagText: 'Métodos de estudio',
    cite: 'BS Valencia. (s.f.). <span class="tit">La técnica Feynman: el método definitivo para aprender cualquier cosa</span>. <span class="src">Blog BS Valencia.</span>',
    url: 'https://www.bsvalencia.com/es/blog/tecnica-feynman/',
    sum: 'Los cuatro pasos del método Feynman y por qué explicar por escrito prueba el aprendizaje real.' },
  { tag: 'ia', tagText: 'IA y pensamiento',
    cite: 'Universidad de Londres. (2026, marzo). <span class="tit">Cómo usar la inteligencia artificial sin depender de ella</span>. <span class="src">UDLondres Blog.</span>',
    url: 'https://udlondres.com/2026/03/ia-como-usarla-sin-depender-de-ella/',
    sum: 'Reflexión sobre cómo aprovechar la IA como herramienta puntual sin que suplante el esfuerzo cognitivo.' },
  { tag: 'ia', tagText: 'IA y pensamiento',
    cite: 'Aprendizaje Infinito. (s.f.). <span class="tit">Cómo aprender usando la inteligencia artificial</span>. <span class="src">Aprendizaje Infinito Newsletter.</span>',
    url: 'https://www.aprendizajeinfinito.com/p/como-aprender-usando-la-inteligencia',
    sum: 'Uso estratégico de la IA como tutor socrático sin reemplazar el recuerdo activo.' },
  { tag: 'tool', tagText: 'Herramientas',
    cite: 'Campos, C. (s.f.). <span class="tit">Cómo dominar NotebookLM: guía práctica y 5 lecciones básicas</span>. <span class="src">Concepción Campos.</span>',
    url: 'https://concepcioncampos.org/como-dominar-notebooklm-guia-practica-y-5-lecciones-basicas/',
    sum: 'Tutorial práctico de NotebookLM en español.' },
];

export const NB_TOOLS: {
  id: string; lbl: string; h: string; pre?: string; post?: string; ph?: string;
  cmd?: string; arg?: string; html?: string; link?: boolean; img?: boolean;
}[] = [
  { id: 'b', lbl: 'B', h: 'Negrita', pre: '**', post: '**', ph: 'negrita', cmd: 'bold' },
  { id: 'i', lbl: 'I', h: 'Cursiva', pre: '*', post: '*', ph: 'cursiva', cmd: 'italic' },
  { id: 'u', lbl: 'U', h: 'Subrayado', cmd: 'underline' },
  { id: 's', lbl: 'S', h: 'Tachado', pre: '~~', post: '~~', ph: 'tachado', cmd: 'strikeThrough' },
  { id: 'h2', lbl: 'H2', h: 'Subtítulo', pre: '## ', post: '\n', ph: 'Subtítulo', cmd: 'formatBlock', arg: 'H2' },
  { id: 'h3', lbl: 'H3', h: 'Sub-subtítulo', pre: '### ', post: '\n', ph: 'Sub-subtítulo', cmd: 'formatBlock', arg: 'H3' },
  { id: 'ul', lbl: '•', h: 'Lista', pre: '- ', post: '\n- ', ph: 'elemento', cmd: 'insertUnorderedList' },
  { id: 'ol', lbl: '1.', h: 'Lista numerada', pre: '1. ', post: '\n2. ', ph: 'elemento', cmd: 'insertOrderedList' },
  { id: 'cb', lbl: '☑', h: 'Checklist', pre: '- [ ] ', post: '\n- [ ] ', ph: 'tarea', html: '<ul><li><input type="checkbox"> tarea</li></ul>' },
  { id: 'q', lbl: '❝', h: 'Cita', pre: '> ', post: '\n', ph: 'cita', cmd: 'formatBlock', arg: 'BLOCKQUOTE' },
  { id: 'code', lbl: '</>', h: 'Bloque de código', pre: '```\n', post: '\n```', ph: 'código', html: '<pre><code>código</code></pre>' },
  { id: 'tbl', lbl: '▦', h: 'Tabla', pre: '| Encabezado | Dato |\n|---|---|\n| celda | celda |', post: '', ph: '', html: '<table><tr><th>Encabezado</th><th>Dato</th></tr><tr><td>celda</td><td>celda</td></tr></table>' },
  { id: 'link', lbl: '🔗', h: 'Enlace', pre: '[', post: '](https://)', ph: 'texto del enlace', link: true },
  { id: 'img', lbl: '🖼', h: 'Imagen (subir desde tu PC)', img: true },
];

export const CURVE_HELP = `<p class="curve-help"><b>Cómo leer tu curva:</b> la <b>línea negra</b> es tu memoria decayendo desde cada sesión; los <b>puntos verdes</b> son repasos que la devuelven al 100% (y aplanan la siguiente caída); el <b>punto naranja</b> es <b>hoy</b> con tu retención estimada; la <b>línea gris punteada</b> predice hacia dónde vas; el <b>círculo naranja</b> marca el día en que cruzarás el <b>umbral de repaso (55%)</b> — tu próxima cita con el tema. <button class="link-btn" data-goto="guia">Guía completa →</button></p>`;
