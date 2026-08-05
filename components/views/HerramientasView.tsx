'use client';

import { useState } from 'react';

const TOOLS = [
  { tag: 'meta', tagText: 'repaso espaciado', name: 'Anki', desc: 'Tarjetas de memoria con repetición espaciada automática.', url: 'https://apps.ankiweb.net/' },
  { tag: 'tool', tagText: 'notas enlazadas', name: 'Obsidian', desc: 'Cuaderno local en Markdown con enlaces bidireccionales.', url: 'https://obsidian.md/' },
  { tag: 'meta', tagText: 'foco', name: 'Pomofocus', desc: 'Temporizador Pomodoro web minimalista.', url: 'https://pomofocus.io/' },
  { tag: 'bio', tagText: 'cursos libres', name: 'Khan Academy', desc: 'Cursos gratuitos con ejercicios y videos.', url: 'https://es.khanacademy.org/' },
  { tag: 'tool', tagText: 'citas APA', name: 'Zotero', desc: 'Gestor de referencias gratuito con citaciones APA automáticas.', url: 'https://www.zotero.org/' },
  { tag: 'bio', tagText: 'lectura', name: 'Project Gutenberg', desc: 'Más de 70 000 libros libres para tu lectura primaria.', url: 'https://www.gutenberg.org/' },
];

export default function HerramientasView() {
  const [imgFail, setImgFail] = useState<Record<string, boolean>>({});
  const hide = (k: string) => setImgFail(p => ({ ...p, [k]: true }));

  return (
    <section data-view="herr">
      <div className="view-top">
        <div>
          <p className="eyebrow">Complementan tu esfuerzo, no lo reemplazan</p>
          <h1 className="view-title">Herramientas de aprendizaje sugeridas</h1>
          <p className="view-sub">Selección curada para estudiar mejor: primero tu cerebro (lectura, ejercicios, Feynman), después la tecnología como andamio y verificación.</p>
        </div>
      </div>
      <div className="tools-wrap">
        <article className="card tool-feat">
          <p className="eyebrow">Destacada · IA como andamio</p>
          <h2>NotebookLM (Google)</h2>
          <p>Un «cuaderno de investigación» gratuito de Google que <b>responde únicamente con las fuentes que tú subes</b> (PDF, Docs, enlaces web, videos de YouTube, texto) y muestra <b>citaciones clicables</b> en cada afirmación. Por eso es ideal para estudiar: no inventa, te devuelve tu propio material organizado, y te obliga a trabajar con tus apuntes en vez de con respuestas genéricas.</p>
          <div className="nb-figs">
            {!imgFail.f1 && (
              <figure>
                <img loading="lazy" src="https://image.qwenlm.ai/public_source/5a4d554f-47ec-41b9-844c-bf601688ebd4/26ab26334-a126-4261-aad5-6e3c6c9be61e1094.png" alt="Flujo de trabajo de NotebookLM" onError={() => hide('f1')} />
                <figcaption>Flujo típico: de tus fuentes a una guía de estudio en 6 pasos.</figcaption>
              </figure>
            )}
            {!imgFail.f2 && (
              <figure>
                <img loading="lazy" src="https://image.qwenlm.ai/public_source/5a4d554f-47ec-41b9-844c-bf601688ebd4/56ab26334-a126-4261-aad5-6e3c6c9be61e3536.png" alt="Panel principal de NotebookLM" onError={() => hide('f2')} />
                <figcaption>Panel de cuadernos: cada tema puede ser su propio cuaderno.</figcaption>
              </figure>
            )}
          </div>
          <h3>Guía oficial, paso a paso</h3>
          <ol>
            <li><b>Crea un cuaderno</b> en notebooklm.google.com con tu cuenta de Google.</li>
            <li><b>Añade fuentes</b>: hasta 50 por cuaderno (PDF, Docs, enlaces, YouTube, texto pegado).</li>
            <li><b>Pregunta</b> y lee las citaciones en línea: cada respuesta indica de qué fuente sale.</li>
            <li><b>Guarda notas</b> dentro del cuaderno con lo que valga la pena reutilizar.</li>
            <li><b>Genera salidas de estudio</b>: guías de estudio, FAQ, flashcards, quizzes y el <b>Audio Overview</b>, una conversación tipo podcast entre dos anfitriones que resume tus fuentes.</li>
            <li><b>Refina</b> con instrucciones propias («hazme 10 preguntas difíciles de…», «explícalo como para un niño»).</li>
          </ol>
          <p>Consejos del propio equipo de Google: empieza con ~10 fuentes buenas, convierte cada documento en Audio Overview para repasarlo caminando, y haz preguntas específicas en lugar de pedir resúmenes genéricos.</p>
          <div className="warn-box"><b>Cómo usarlo sin depender de él:</b> la lectura, los dibujos y los ejercicios propios van primero. <i>Después</i> la herramienta sirve para verificarse: pedir quizzes, detectar lagunas en la explicación Feynman o aclarar lo que no quedó claro. Copiar el resumen no equivale a aprender: si algo no se puede explicar sin la herramienta, todavía no se domina.</div>
          <p style={{ marginTop: '.6rem' }}>
            <a className="src-link" href="https://notebooklm.google.com/" target="_blank" rel="noopener noreferrer">notebooklm.google.com</a> ·
            <a className="src-link" href="https://support.google.com/gemininotebook/" target="_blank" rel="noopener noreferrer">Ayuda oficial (Google)</a> ·
            <a className="src-link" href="https://blog.google/innovation-and-ai/products/notebooklm-beginner-tips/" target="_blank" rel="noopener noreferrer">Tips oficiales para empezar</a>
          </p>
        </article>
        <div className="tools-grid">
          {TOOLS.map(t => (
            <article className="card tool-card" key={t.name}>
              <span className={`src-tag ${t.tag}`}>{t.tagText}</span>
              <h3>{t.name}</h3>
              <p>{t.desc}</p>
              <a href={t.url} target="_blank" rel="noopener noreferrer">{t.url.replace(/^https?:\/\//, '')} →</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
