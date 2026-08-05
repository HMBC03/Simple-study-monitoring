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
        <p className="eyebrow">Complete guide</p>
        <h1 className="view-title" style={{ marginBottom: '.6rem' }}>How it works</h1>
        <p>
          This study log turns methods from learning psychology —all public domain and free to use— into a simple daily routine: you study a topic, and the app tells you <b>when to review it</b> so you don&apos;t forget it.
        </p>

        <h2><span className="gnum">1 ·</span> The forgetting curve</h2>
        <p>
          Since Hermann Ebbinghaus&apos;s experiments (1885) we know that what you learn fades exponentially if you don&apos;t review it. Each review “rescues” the memory and makes the next drop slower.
        </p>
        <div className="curve-box" dangerouslySetInnerHTML={{ __html: curveSVG(fake, [1, 3, 7, 15, 30]) }} />
        <div className="legend">
          <span><i className="dot" style={{ background: '#3E6B4F' }}></i> review done</span>
          <span><i className="dot" style={{ background: '#C8471F' }}></i> today / next review</span>
          <span style={{ color: '#C8471F' }}>— — 55% threshold</span>
        </div>

        <h3>How to read the chart, with no prior knowledge</h3>
        <ol>
          <li><b>Vertical axis (0–100):</b> your <b>estimated retention</b>, i.e. how much you remember today of what you studied.</li>
          <li><b>Horizontal axis:</b> the days elapsed, with real dates below.</li>
          <li><b>Solid black line:</b> your memory <b>declining</b> since each session.</li>
          <li><b>Green dots:</b> reviews you already did. Each one brings memory back to ~100% and flattens the next drop.</li>
          <li><b>Orange “today” dot:</b> where you are right now, with your retention percentage.</li>
          <li><b>Dashed gray line:</b> the <b>prediction</b> of where your memory is heading if you don&apos;t review.</li>
          <li><b>Orange circle (R# · date):</b> the day that prediction crosses the threshold: your <b>next scheduled review</b>.</li>
          <li><b>Dashed red line = review threshold (~55%):</b> see below what it means.</li>
        </ol>
        <p>
          <b>What is a threshold?</b> It&apos;s the <b>minimum retention level you decide to tolerate</b> before reviewing. Here we use ~55%: if you review <i>above</i> the threshold, the review is quick and reinforcing; if you let memory fall <i>below</i> it, you&apos;re no longer reviewing but <b>relearning</b> (it costs almost as much as learning from scratch). That&apos;s why, when a review becomes overdue by many days, the log recommends <b>resetting the topic</b> and starting the curve again.
        </p>

        <h2><span className="gnum">2 ·</span> Spaced reviews (1 · 3 · 7 · 15 · 30 days)</h2>
        <p>
          When you study a topic for the first time, your first review is scheduled <b>1 day</b> later. When you complete it, the next one falls <b>3 days</b> later, then <b>7</b>, <b>15</b> and <b>30</b>. After the last one, the topic is <b>Mastered ✓</b>.
        </p>
        <ul>
          <li>The <b>“Reviews”</b> queue shows you what&apos;s overdue, due today and coming up.</li>
          <li>In <b>⚙ Settings</b> you decide <b>how many reviews to activate</b>. The calendar and the curve adapt.</li>
          <li>If a review <b>becomes overdue</b>, the Study desk shows the notice “resetting the review is recommended” with its button to do so (the old history is archived, not lost).</li>
        </ul>

        <h2><span className="gnum">3 ·</span> Your session method</h2>
        <p>The sample template comes with 5 steps inspired by well-known techniques:</p>
        <ol id="guideSteps">
          {state.steps.map((s, i) => (
            <li key={i}><b>{esc(s.t)}</b>{s.s ? ' — ' + esc(s.s) : ''}</li>
          ))}
        </ol>
        <p>
          It&apos;s only a template: in <b>⚙ Settings</b> you can <b>rename, add or remove steps</b>, or <b>disable the checklist</b>. Each step has a ⏱ button that launches a pomodoro and, when it ends, marks that step as complete.
        </p>

        <h2><span className="gnum">4 ·</span> Your data: it&apos;s yours, take care of it</h2>
        <div className="warn-box">
          ⚠️ Everything is stored in your browser&apos;s <b>local storage (IndexedDB)</b>: much more space than before and <b>only in this browser</b>. If you clear browsing data, use incognito mode or switch devices, <b>everything is lost</b>.
        </div>
        <ul>
          <li><b>⬇ Backup .json</b>: downloads <b>all</b> your progress.</li>
          <li><b>⬆ Restore</b>: loads that file and you continue where you left off.</li>
          <li><b>⬇ Report .md</b>: a notebook readable by subject → topic.</li>
        </ul>

        <p style={{ marginTop: '1.4rem' }}>
          <button className="btn btn-primary" style={{ flex: 'none' }} onClick={() => switchView('hoy')}>
            Got it, let&apos;s study! →
          </button>
        </p>
      </article>
    </section>
  );
}
