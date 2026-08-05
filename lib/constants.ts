export const KEY_LEGACY = 'bitacora-olvido-v4';
export const KEY_MIRROR = 'bitacora-olvido-v5';
export const DB_NAME = 'bitacora';
export const DB_VERSION = 1;

export const PALETTE = [
  '#C8471F', '#2F5D8A', '#3E6B4F', '#8A5A17', '#7D4A92', '#A63A4B', '#22706B',
];

export const IV = [1, 3, 7, 15, 30];

export const DEFAULT_STEPS: { t: string; s: string }[] = [
  { t: 'Read the topic', s: 'or watch the material / video' },
  { t: 'Graph or sketch', s: 'the parts that allow it' },
  { t: 'Exercises', s: 'solve 10 to 20' },
  { t: 'Demonstrate the topic', s: 'do it yourself, without looking at notes' },
  { t: 'Feynman technique', s: 'explain it in writing and reevaluate what failed' },
];

export const PHRASES = [
  { t: 'I have to know everything in a way I can explain it to a child.', a: '— Richard Feynman' },
  { t: 'If you cannot explain it simply, you do not understand it well enough.', a: '— Albert Einstein' },
  { t: 'Memory is the guardian of the brain.', a: '— William Shakespeare' },
  { t: 'It is not that I am so smart, it is that I stay with problems longer.', a: '— Albert Einstein' },
  { t: 'The mind is not a vessel to be filled, but a lamp to be lit.', a: '— Plutarch' },
  { t: 'Repetition is the mother of learning.', a: '— Tony Robbins' },
  { t: 'He who studies lives twice.', a: '— Martial' },
  { t: 'Start where you are. Use what you have. Do what you can.', a: '— Arthur Ashe' },
  { t: 'Curiosity is the wick in the candle of learning.', a: '— William Arthur Ward' },
  { t: 'An expert in something was once a beginner.', a: '— Helen Hayes' },
  { t: 'Reading is to the mind what exercise is to the body.', a: '— Joseph Addison' },
  { t: 'What I hear, I forget; what I see, I remember; what I do, I understand.', a: '— Confucius' },
];

export const SOURCES = [
  { tag: 'curva', tagText: 'Forgetting curve',
    cite: 'iSpring Solutions. (n.d.). <span class="tit">Ebbinghaus Forgetting Curve</span>. <span class="src">iSpring Blog.</span>',
    url: 'https://www.ispring.es/blog/curva-del-olvido',
    sum: 'Explains the famous forgetting curve with charts and examples, and how spaced repetition flattens it.' },
  { tag: 'curva', tagText: 'Forgetting curve',
    cite: 'Psicología y Mente. (n.d.). <span class="tit">Ebbinghaus’s forgetting curve: what it is and how it works</span>. <span class="src">Psicología y Mente.</span>',
    url: 'https://psicologiaymente.com/psicologia/curva-del-olvido',
    sum: 'An accessible article that contextualizes the original experiments and proposes practical strategies.' },
  { tag: 'bio', tagText: 'Biography',
    cite: 'Psicología y Mente. (n.d.). <span class="tit">Hermann Ebbinghaus: biography of the German psychologist pioneer in the study of memory</span>. <span class="src">Psicología y Mente.</span>',
    url: 'https://psicologiaymente.com/biografias/hermann-ebbinghaus',
    sum: 'Biography of the father of the experimental psychology of memory.' },
  { tag: 'meta', tagText: 'Study methods',
    cite: 'Universidad Internacional de La Rioja. (n.d.). <span class="tit">Study techniques: 11 methods and strategies to improve academic performance</span>. <span class="src">UNIR Revista.</span>',
    url: 'https://www.unir.net/revista/educacion/tecnicas-de-estudio/',
    sum: 'An overview of validated methods: Pomodoro, Cornell, Feynman, mind maps.' },
  { tag: 'bio', tagText: 'Biography',
    cite: 'Encyclopædia Britannica. (2024). <span class="tit">Hermann Ebbinghaus | Biography, Memory, &amp; Psychology</span>. <span class="src">In Encyclopædia Britannica.</span>',
    url: 'https://www.britannica.com/biography/Hermann-Ebbinghaus',
    sum: 'Encyclopedic entry summarizing the work Über das Gedächtnis (1885).' },
  { tag: 'meta', tagText: 'Neuroscience',
    cite: 'Cleveland Clinic. (2022, May 2). <span class="tit">Memory: Types, processes and how to improve</span>. <span class="src">Health Essentials.</span>',
    url: 'https://my.clevelandclinic.org/health/articles/memory',
    sum: 'A clinical guide on short- and long-term memory, the role of sleep and retention strategies.' },
  { tag: 'meta', tagText: 'Study methods',
    cite: 'IE School of Business. (n.d.). <span class="tit">What is the Pomodoro method and how is it applied?</span> <span class="src">IE Insights.</span>',
    url: 'https://iep.edu.es/que-es-el-metodo-pomodoro/',
    sum: 'Presents Francesco Cirillo’s method: 25-minute focus blocks plus breaks.' },
  { tag: 'meta', tagText: 'Study methods',
    cite: 'BS Valencia. (n.d.). <span class="tit">The Feynman technique: the definitive method to learn anything</span>. <span class="src">Blog BS Valencia.</span>',
    url: 'https://www.bsvalencia.com/es/blog/tecnica-feynman/',
    sum: 'The four steps of the Feynman technique and why explaining in writing proves real learning.' },
  { tag: 'ia', tagText: 'AI & thinking',
    cite: 'Universidad de Londres. (2026, March). <span class="tit">How to use artificial intelligence without depending on it</span>. <span class="src">UDLondres Blog.</span>',
    url: 'https://udlondres.com/2026/03/ia-como-usarla-sin-depender-de-ella/',
    sum: 'A reflection on using AI as a one-off tool without letting it replace cognitive effort.' },
  { tag: 'ia', tagText: 'AI & thinking',
    cite: 'Aprendizaje Infinito. (n.d.). <span class="tit">How to learn using artificial intelligence</span>. <span class="src">Aprendizaje Infinito Newsletter.</span>',
    url: 'https://www.aprendizajeinfinito.com/p/como-aprender-usando-la-inteligencia',
    sum: 'Strategic use of AI as a Socratic tutor without replacing active recall.' },
  { tag: 'tool', tagText: 'Tools',
    cite: 'Campos, C. (n.d.). <span class="tit">How to master NotebookLM: practical guide and 5 basic lessons</span>. <span class="src">Concepción Campos.</span>',
    url: 'https://concepcioncampos.org/como-dominar-notebooklm-guia-practica-y-5-lecciones-basicas/',
    sum: 'A practical NotebookLM tutorial in Spanish.' },
];

export const NB_TOOLS: {
  id: string; lbl: string; h: string; pre?: string; post?: string; ph?: string;
  cmd?: string; arg?: string; html?: string; link?: boolean; img?: boolean;
}[] = [
  { id: 'b', lbl: 'B', h: 'Bold', pre: '**', post: '**', ph: 'bold text', cmd: 'bold' },
  { id: 'i', lbl: 'I', h: 'Italic', pre: '*', post: '*', ph: 'italic text', cmd: 'italic' },
  { id: 'u', lbl: 'U', h: 'Underline', cmd: 'underline' },
  { id: 's', lbl: 'S', h: 'Strikethrough', pre: '~~', post: '~~', ph: 'struck text', cmd: 'strikeThrough' },
  { id: 'h2', lbl: 'H2', h: 'Subheading', pre: '## ', post: '\n', ph: 'Subheading', cmd: 'formatBlock', arg: 'H2' },
  { id: 'h3', lbl: 'H3', h: 'Sub-subheading', pre: '### ', post: '\n', ph: 'Sub-subheading', cmd: 'formatBlock', arg: 'H3' },
  { id: 'ul', lbl: '•', h: 'List', pre: '- ', post: '\n- ', ph: 'item', cmd: 'insertUnorderedList' },
  { id: 'ol', lbl: '1.', h: 'Numbered list', pre: '1. ', post: '\n2. ', ph: 'item', cmd: 'insertOrderedList' },
  { id: 'cb', lbl: '☑', h: 'Checklist', pre: '- [ ] ', post: '\n- [ ] ', ph: 'task', html: '<ul><li><input type="checkbox"> task</li></ul>' },
  { id: 'q', lbl: '❝', h: 'Quote', pre: '> ', post: '\n', ph: 'quote', cmd: 'formatBlock', arg: 'BLOCKQUOTE' },
  { id: 'code', lbl: '</>', h: 'Code block', pre: '```\n', post: '\n```', ph: 'code', html: '<pre><code>code</code></pre>' },
  { id: 'tbl', lbl: '▦', h: 'Table', pre: '| Heading | Value |\n|---|---|\n| cell | cell |', post: '', ph: '', html: '<table><tr><th>Heading</th><th>Value</th></tr><tr><td>cell</td><td>cell</td></tr></table>' },
  { id: 'link', lbl: '🔗', h: 'Link', pre: '[', post: '](https://)', ph: 'link text', link: true },
  { id: 'img', lbl: '🖼', h: 'Image (upload from your PC)', img: true },
];

export const CURVE_HELP = `<p class="curve-help"><b>How to read your curve:</b> the <b>black line</b> is your memory fading after each session; the <b>green dots</b> are reviews that bring it back to 100% (and flatten the next fade); the <b>orange dot</b> is <b>today</b> with your estimated retention; the <b>gray dashed line</b> predicts where you are heading; the <b>orange circle</b> marks the day you will cross the <b>review threshold (55%)</b> — your next appointment with the topic. <button class="link-btn" data-goto="guia">Full guide →</button></p>`;
