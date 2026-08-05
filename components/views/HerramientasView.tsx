'use client';

import { useState } from 'react';

const TOOLS = [
  { tag: 'meta', tagText: 'spaced repetition', name: 'Anki', desc: 'Flashcards with automatic spaced repetition.', url: 'https://apps.ankiweb.net/' },
  { tag: 'tool', tagText: 'linked notes', name: 'Obsidian', desc: 'Local Markdown notebook with bidirectional links.', url: 'https://obsidian.md/' },
  { tag: 'meta', tagText: 'focus', name: 'Pomofocus', desc: 'Minimalist web Pomodoro timer.', url: 'https://pomofocus.io/' },
  { tag: 'bio', tagText: 'free courses', name: 'Khan Academy', desc: 'Free courses with exercises and videos.', url: 'https://www.khanacademy.org/' },
  { tag: 'tool', tagText: 'APA citations', name: 'Zotero', desc: 'Free reference manager with automatic APA citations.', url: 'https://www.zotero.org/' },
  { tag: 'bio', tagText: 'reading', name: 'Project Gutenberg', desc: 'More than 70,000 free books for your primary reading.', url: 'https://www.gutenberg.org/' },
];

export default function HerramientasView() {
  const [imgFail, setImgFail] = useState<Record<string, boolean>>({});
  const hide = (k: string) => setImgFail(p => ({ ...p, [k]: true }));

  return (
    <section data-view="herr">
      <div className="view-top">
        <div>
          <p className="eyebrow">They complement your effort, not replace it</p>
          <h1 className="view-title">Suggested learning tools</h1>
          <p className="view-sub">Curated selection to study better: first your brain (reading, exercises, Feynman), then technology as scaffolding and verification.</p>
        </div>
      </div>
      <div className="tools-wrap">
        <article className="card tool-feat">
          <p className="eyebrow">Featured · AI as scaffolding</p>
          <h2>NotebookLM (Google)</h2>
          <p>A free Google “research notebook” that <b>answers only with the sources you upload</b> (PDF, Docs, web links, YouTube videos, text) and shows <b>clickable citations</b> for every claim. That&apos;s why it&apos;s ideal for studying: it doesn&apos;t make things up, it gives you back your own material organized, and it forces you to work with your notes instead of generic answers.</p>
          <div className="nb-figs">
            {!imgFail.f1 && (
              <figure>
                <img loading="lazy" src="https://image.qwenlm.ai/public_source/5a4d554f-47ec-41b9-844c-bf601688ebd4/26ab26334-a126-4261-aad5-6e3c6c9be61e1094.png" alt="NotebookLM workflow" onError={() => hide('f1')} />
                <figcaption>Typical flow: from your sources to a study guide in 6 steps.</figcaption>
              </figure>
            )}
            {!imgFail.f2 && (
              <figure>
                <img loading="lazy" src="https://image.qwenlm.ai/public_source/5a4d554f-47ec-41b9-844c-bf601688ebd4/56ab26334-a126-4261-aad5-6e3c6c9be61e3536.png" alt="NotebookLM main panel" onError={() => hide('f2')} />
                <figcaption>Notebooks panel: each topic can be its own notebook.</figcaption>
              </figure>
            )}
          </div>
          <h3>Official guide, step by step</h3>
          <ol>
            <li><b>Create a notebook</b> at notebooklm.google.com with your Google account.</li>
            <li><b>Add sources</b>: up to 50 per notebook (PDF, Docs, links, YouTube, pasted text).</li>
            <li><b>Ask</b> and read the inline citations: each answer indicates which source it comes from.</li>
            <li><b>Save notes</b> inside the notebook with anything worth reusing.</li>
            <li><b>Generate study outputs</b>: study guides, FAQ, flashcards, quizzes and the <b>Audio Overview</b>, a podcast-like conversation between two hosts that summarizes your sources.</li>
            <li><b>Refine</b> with your own instructions (“make me 10 hard questions about…”, “explain it like I&apos;m a child”).</li>
          </ol>
          <p>Tips from Google&apos;s own team: start with ~10 good sources, turn each document into an Audio Overview to review it while walking, and ask specific questions instead of requesting generic summaries.</p>
          <div className="warn-box"><b>How to use it without depending on it:</b> reading, drawing and your own exercises come first. <i>Afterwards</i> the tool serves to check yourself: take quizzes, spot gaps in your Feynman explanation or clarify what wasn&apos;t clear. Copying the summary is not learning: if something can&apos;t be explained without the tool, it isn&apos;t mastered yet.</div>
          <p style={{ marginTop: '.6rem' }}>
            <a className="src-link" href="https://notebooklm.google.com/" target="_blank" rel="noopener noreferrer">notebooklm.google.com</a> ·
            <a className="src-link" href="https://support.google.com/gemininotebook/" target="_blank" rel="noopener noreferrer">Official help (Google)</a> ·
            <a className="src-link" href="https://blog.google/innovation-and-ai/products/notebooklm-beginner-tips/" target="_blank" rel="noopener noreferrer">Official tips to get started</a>
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
