'use client';

import { SOURCES } from '@/lib/constants';

export default function FuentesView() {
  const tags = [
    ['curva', 'curva del olvido'],
    ['bio', 'biografías'],
    ['meta', 'métodos'],
    ['ia', 'IA y pensamiento'],
    ['tool', 'herramientas'],
  ] as const;
  return (
    <section data-view="fuentes">
      <div className="view-top">
        <div>
          <p className="eyebrow">Sobre qué se sostiene esta bitácora</p>
          <h1 className="view-title">Fuentes y referencias</h1>
          <p className="view-sub">Este proyecto se basa en búsquedas que buscan fortalecer el aprendizaje <b>sin depender de inteligencia artificial</b>: construir pensamiento profundo, cultivar la memoria propia y mejorar cada día.</p>
        </div>
      </div>
      <div className="card src-intro">
        <p className="lead">
          Cada referencia está citada según las normas <b>APA (7ª edición)</b> e incluye un breve resumen. Áreas:{' '}
          {tags.map(([cls, txt]) => <span key={cls} className={`src-tag ${cls}`}>{txt}</span>)}
          .
        </p>
      </div>
      <div className="src-list">
        {SOURCES.map((f, i) => (
          <article className="src-item" key={i}>
            <p className="src-cite" dangerouslySetInnerHTML={{ __html: f.cite }} />
            <p className="src-sum">{f.sum}</p>
            <a className="src-link" href={f.url} target="_blank" rel="noopener noreferrer">
              {f.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
