'use client';

import { SOURCES } from '@/lib/constants';

export default function FuentesView() {
  const tags = [
    ['curva', 'forgetting curve'],
    ['bio', 'biographies'],
    ['meta', 'methods'],
    ['ia', 'AI and thinking'],
    ['tool', 'tools'],
  ] as const;
  return (
    <section data-view="fuentes">
      <div className="view-top">
        <div>
          <p className="eyebrow">What this study log stands on</p>
          <h1 className="view-title">Sources and references</h1>
          <p className="view-sub">This project is based on searches that aim to strengthen learning <b>without depending on artificial intelligence</b>: build deep thinking, cultivate your own memory and improve every day.</p>
        </div>
      </div>
      <div className="card src-intro">
        <p className="lead">
          Each reference is cited according to <b>APA (7th edition)</b> rules and includes a short summary. Areas:{' '}
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
