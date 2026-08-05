import { CURVE_HELP, DEFAULT_STEPS, IV, PALETTE } from '@/lib/constants';
import type { Archived, Entry, Loose, State, Study, Topic, TopicStatus } from '@/lib/types';

/* ─── utilidades de fecha / texto ─── */
export const pad = (n: number) => String(n).padStart(2, '0');
export const now = () => Date.now();
export const key = (d: Date) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
export const parseKey = (s: string) => { const [a, b, c] = s.split('-').map(Number); return new Date(a, b - 1, c); };
export const noon = (s: string | Date) => { const d = typeof s === 'string' ? parseKey(s) : new Date(s); d.setHours(12, 0, 0, 0); return d; };
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const daysAgo = (n: number) => addDays(new Date(), -n);
export const monday = (d: Date) => { const x = new Date(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
export const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const fmtH = (m: number) => { const h = Math.round(m / 6) / 10; return (Number.isInteger(h) ? String(h) : h.toFixed(1).replace('.', ',')) + ' h'; };
export const fmtD = (d: Date) => d.toLocaleDateString('en', { day: 'numeric', month: 'short' });
export const slugNb = (s: string) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'nota';
export const retClass = (r: number) => r >= 70 ? 'g-ok' : r >= 55 ? 'g-warn' : 'g-bad';
export const activeIV = (state: State) => IV.filter((_v, i) => state.ivActive[i]);
export const subjectOf = (state: State, id: string) => state.subjects.find(s => s.id === id);

/* ─── estado: semilla, normalización ─── */
export function seed(): State {
  const k = (n: number) => key(daysAgo(n));
  const st = (off: number, min: number, st5: boolean[], note?: string): Study =>
    ({ ts: Date.now() - off * 864e5, date: k(off), minutes: min, steps: st5, note: note || '' });
  const A = [1, 1, 1, 1, 1].map(Boolean);
  return {
    name: '', weeklyGoal: 20, pomodoros: 7,
    lastNb: { subjId: null, topicId: null, pageId: null, mode: 'w' },
    ivActive: [true, true, true, true, true], stepsOn: true, steps: DEFAULT_STEPS.map(s => ({ ...s })),
    archived: [],
    subjects: [
      { id: 'g', name: 'Geometry', color: PALETTE[0] },
      { id: 'c', name: 'Calculus', color: PALETTE[1] },
      { id: 'h', name: 'Art History', color: PALETTE[2] }],
    topics: [
      { id: 't1', subjectId: 'g', name: 'Area calculations', created: k(22), studies: [st(20, 55, A), st(18, 50, A), st(16, 45, [1, 1, 1, 1, 0].map(Boolean)), st(13, 50, A, 'Compound-shape formulas')],
        notes: [
          { id: 'n1', name: 'Formulas', updatedAt: Date.now(), md: '# Key formulas\n\n- Triangle: `A = (b·h)/2`\n- Circle: `A = πr²`\n- Square: `A = l²`\n\n> A page to collect the formulas you master along the way.' },
          { id: 'n2', name: 'Worked examples', updatedAt: Date.now(), md: '## Triangle: base 10, height 5\n\n`A = (10·5)/2 = 25`\n\n| Shape | Formula | Example |\n|---|---|---|\n| Triangle | (b·h)/2 | 25 |\n| Circle | πr² | — |\n\n- [x] Check units\n- [ ] Practice compound shapes' }] },
      { id: 't2', subjectId: 'g', name: 'Volume calculations', created: k(6), studies: [st(4, 50, A), st(1, 45, A)], notes: [] },
      { id: 't3', subjectId: 'g', name: 'Unit circle and cosine', created: k(9), studies: [st(2, 55, [1, 1, 1, 0, 0].map(Boolean), 'Feynman pending')], notes: [] },
      { id: 't4', subjectId: 'c', name: 'Limits and continuity', created: k(8), studies: [st(5, 50, A), st(2, 45, A)],
        notes: [
          { id: 'n3', name: 'Notes', updatedAt: Date.now(), md: '## What I find hard\n\n- Understanding what the limit means on the graph.\n\n## Ideas\n\n1. The limit is «where it approaches».\n2. Review it with the Feynman technique.' }] },
      { id: 't5', subjectId: 'c', name: 'Derivatives', created: k(4), studies: [st(4, 50, A, 'Chain rule')], notes: [] },
      { id: 't6', subjectId: 'c', name: 'Basic integrals', created: k(1), studies: [], notes: [] },
      { id: 't7', subjectId: 'h', name: 'Italian Renaissance', created: k(30), studies: [st(26, 40, A), st(24, 40, A), st(22, 35, A), st(21, 40, A), st(20, 45, A)],
        notes: [
          { id: 'n4', name: 'Timeline', updatedAt: Date.now(), md: '## Key artists\n\n- **Leonardo da Vinci** (1452–1519)\n- **Michelangelo** (1475–1564)\n\n> Add images of the works studied.' }] }],
    loose: [{ id: uid(), ts: Date.now(), date: key(new Date()), minutes: 25 }] as Loose[],
  };
}

export function normalizeState(st: State): State {
  if (!Array.isArray(st.ivActive) || st.ivActive.length !== 5) st.ivActive = [true, true, true, true, true];
  if (typeof st.stepsOn !== 'boolean') st.stepsOn = true;
  if (!Array.isArray(st.steps) || !st.steps.length) st.steps = DEFAULT_STEPS.map(s => ({ ...s }));
  if (!Array.isArray(st.loose)) st.loose = [];
  if (!Array.isArray(st.archived)) st.archived = [];
  if (typeof st.weeklyGoal !== 'number') st.weeklyGoal = 20;
  if (typeof st.pomodoros !== 'number') st.pomodoros = 0;
  if (!Array.isArray(st.subjects)) st.subjects = [];
  if (!Array.isArray(st.topics)) st.topics = [];
  st.topics.forEach(tp => { if (!Array.isArray(tp.notes)) tp.notes = []; });
  if (!st.lastNb || typeof st.lastNb !== 'object') st.lastNb = { subjId: null, topicId: null, pageId: null, mode: 'w' };
  if (!('subjId' in st.lastNb)) {
    const lnb = st.lastNb as { topicId?: string | null; pageId?: string | null };
    const oldT = st.topics.find(t => t.id === lnb.topicId);
    st.lastNb = { subjId: oldT ? oldT.subjectId : null, topicId: oldT ? oldT.id : null, pageId: lnb.pageId ?? null, mode: 'w' };
  }
  if (st.lastNb.mode !== 'md') st.lastNb.mode = 'w';
  return st;
}

/* ─── métricas ─── */
export function entries(state: State): Entry[] {
  const out: Entry[] = [];
  state.topics.forEach(tp => {
    const sub = subjectOf(state, tp.subjectId);
    tp.studies.forEach(s => out.push({
      kind: 'estudio', date: s.date, ts: s.ts, minutes: s.minutes,
      subName: sub ? sub.name : '—', color: sub ? sub.color : '#8a8272', topic: tp.name, topicId: tp.id, stTs: s.ts,
      steps: s.steps.filter(Boolean).length, stepsTot: s.steps.length, note: s.note }));
  });
  state.archived.forEach((a: Archived) => out.push({
    kind: 'archivo', date: a.date, ts: a.ts, minutes: a.minutes,
    subName: a.subName, color: a.color, topic: a.topic, archId: a.id,
    steps: a.steps.filter(Boolean).length, stepsTot: a.steps.length, note: '↺ archived (topic reset)' }));
  state.loose.forEach(l => out.push({
    kind: 'pomo', date: l.date, ts: l.ts, minutes: l.minutes,
    subName: 'Free session', color: '#8a8272', topic: 'Pomodoro without topic', looseId: l.id, steps: null, note: '' }));
  return out.sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : b.ts - a.ts);
}
export const minsOn = (state: State, k: string) => entries(state).filter(e => e.date === k).reduce((a, e) => a + e.minutes, 0);
export const todayMins = (state: State) => minsOn(state, key(new Date()));
export const weekMins = (state: State) => { const mk = key(monday(new Date())); return entries(state).filter(e => e.date >= mk).reduce((a, e) => a + e.minutes, 0); };
export function calcStreak(state: State) {
  const ds = new Set(entries(state).map(e => e.date)); let n = 0, d = new Date();
  if (!ds.has(key(d))) d = addDays(d, -1);
  while (ds.has(key(d))) { n++; d = addDays(d, -1); }
  return n;
}

/* ─── spaced review ─── */
export function topicStatus(tp: Topic, state: State): TopicStatus {
  const iv = activeIV(state), n = tp.studies.length;
  if (!n) return { cls: 'new', label: 'New', diff: null, due: null, ret: 100, n };
  const last = noon(tp.studies[n - 1].date), today = noon(new Date());
  const since = Math.max(0, (today.getTime() - last.getTime()) / 864e5);
  if (!iv.length) return { cls: 'master', label: 'No active reviews', diff: null, due: null, ret: Math.round(Math.exp(-since / 50) * 100), n };
  const S = iv[Math.min(n - 1, iv.length - 1)] / 0.6;
  const ret = Math.round(Math.exp(-since / S) * 100);
  if (n > iv.length) return { cls: 'master', label: 'Mastered ✓', diff: null, due: null, ret, n };
  const due = addDays(last, iv[n - 1]);
  const diff = Math.round((due.getTime() - today.getTime()) / 864e5);
  let cls: string, label: string;
  if (diff < 0) { cls = 'late'; label = diff === -1 ? 'Overdue 1d' : 'Overdue ' + (-diff) + 'd'; }
  else if (diff === 0) { cls = 'today'; label = 'Review today!'; }
  else if (diff === 1) { cls = 'soon'; label = 'Tomorrow'; }
  else { cls = 'ok'; label = 'In ' + diff + ' days'; }
  return { cls, label, diff, due, ret, n };
}

export function curveSVG(tp: Topic, iv: number[]): string {
  const W = 600, H = 210, L = 38, Rp = 16, T = 22, B = 30;
  const st = [...tp.studies].sort((a, b) => a.date < b.date ? -1 : 1);
  const frame = `<line x1="${L}" y1="${H - B}" x2="${W - Rp}" y2="${H - B}" stroke="rgba(38,34,26,.35)" stroke-width="1.5"/>
    <line x1="${L}" y1="${T}" x2="${L}" y2="${H - B}" stroke="rgba(38,34,26,.35)" stroke-width="1.5"/>`;
  if (!st.length) return `<svg class="curve" viewBox="0 0 ${W} ${H}">${frame}
    <text x="${W / 2}" y="${H / 2}" text-anchor="middle" font-size="12.5" fill="#6E6553" font-style="italic">Your curve starts with your first study session ✦</text></svg>`;
  const stab = (i: number) => ((iv.length ? iv[Math.min(i, iv.length - 1)] : 30)) / 0.6;
  const t0 = noon(st[0].date), dayOf = (d: string | Date) => (noon(d).getTime() - t0.getTime()) / 864e5;
  const todayF = Math.max(0, (noon(new Date()).getTime() - t0.getTime()) / 864e5), n = st.length;
  const nextF = (iv.length && n <= iv.length) ? dayOf(st[n - 1].date) + iv[n - 1] : null;
  const xMax = Math.max(todayF, nextF ?? 0) + 2.5;
  const x = (f: number) => L + f / xMax * (W - L - Rp), y = (r: number) => T + (1 - r) * (H - T - B);
  const halo = `paint-order="stroke" stroke="#FCF9F0" stroke-width="3"`;
  let grid = '';
  [.25, .5, .75, 1].forEach(g => {
    grid += `<line x1="${L}" y1="${y(g)}" x2="${W - Rp}" y2="${y(g)}" stroke="rgba(38,34,26,.08)"/>
    <text x="${L - 5}" y="${y(g) + 3}" text-anchor="end" font-size="8.5" fill="#6E6553" font-family="IBM Plex Mono,monospace">${g * 100}</text>`; });
  const thr = `<line x1="${L}" y1="${y(.55)}" x2="${W - Rp}" y2="${y(.55)}" stroke="rgba(200,71,31,.5)" stroke-dasharray="4 4" stroke-width="1.5"/>
    <text x="${L + 6}" y="${y(.55) - 6}" text-anchor="start" font-size="9" fill="#C8471F" font-family="IBM Plex Mono,monospace" ${halo}>review threshold · 55%</text>`;
  let areas = '', curves = '', connect = '', dots = '', ghost = '';
  st.forEach((s, i) => {
    const f0 = dayOf(s.date), S = stab(i);
    const f1 = Math.min(i < n - 1 ? dayOf(st[i + 1].date) : todayF, todayF);
    const step = Math.max(.15, (f1 - f0) / 80) || .5; const pts: [number, number][] = [];
    for (let f = f0; f <= f1 + 1e-9; f += step) pts.push([x(f), y(Math.exp(-(f - f0) / S))]);
    if (pts.length < 2) pts.push([x(f1), y(Math.exp(-(f1 - f0) / S))]);
    const pl = pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    curves += `<polyline points="${pl}" fill="none" stroke="#26221A" stroke-width="2.5" stroke-linecap="round"/>`;
    areas += `<polygon points="${pl} ${x(f1).toFixed(1)},${y(0)} ${x(f0).toFixed(1)},${y(0)}" fill="rgba(200,71,31,.08)"/>`;
    if (i > 0) {
      const rP = Math.exp(-(f0 - dayOf(st[i - 1].date)) / stab(i - 1));
      connect += `<line x1="${x(f0)}" y1="${y(rP)}" x2="${x(f0)}" y2="${y(1)}" stroke="#3E6B4F" stroke-width="2" stroke-dasharray="2 3"/>`;
    }
    dots += `<circle cx="${x(f0)}" cy="${y(1)}" r="4" fill="${i ? '#3E6B4F' : '#26221A'}" stroke="#FCF9F0" stroke-width="1.5">
      <title>${i ? 'Review R' + i : 'First session'} · ${fmtD(noon(s.date))} · ${s.minutes} min · steps ${s.steps.filter(Boolean).length}/${s.steps.length}</title></circle>`;
    if (i === n - 1 && nextF !== null) {
      const from = Math.max(f0, todayF);
      if (from < nextF) {
        const pts2: string[] = []; const sp = Math.max(.2, (nextF - from) / 60);
        for (let f = from; f <= nextF + 1e-9; f += sp) pts2.push(`${x(f).toFixed(1)},${y(Math.exp(-(f - f0) / S)).toFixed(1)}`);
        curves += `<polyline points="${pts2.join(' ')}" fill="none" stroke="rgba(38,34,26,.4)" stroke-width="2" stroke-dasharray="5 5"/>`;
      }
      const gx = Math.min(Math.max(x(nextF), L + 44), W - Rp - 44);
      ghost += `<circle cx="${x(nextF)}" cy="${y(Math.exp(-(nextF - f0) / S))}" r="5.5" fill="none" stroke="#C8471F" stroke-width="2"/>
        <line x1="${x(nextF)}" y1="${y(.55) + 8}" x2="${x(nextF)}" y2="${H - B - 16}" stroke="rgba(200,71,31,.4)" stroke-dasharray="2 3"/>
        <text x="${gx}" y="${H - B - 6}" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#C8471F" font-family="IBM Plex Mono,monospace" ${halo}>R${n} · ${fmtD(addDays(noon(st[n - 1].date), iv[n - 1]))}</text>`;
    }
  });
  const rT = Math.exp(-(todayF - dayOf(st[n - 1].date)) / stab(n - 1)), hx = x(todayF);
  const hxc = Math.min(Math.max(hx, L + 40), W - Rp - 40);
  const hoy = `<line x1="${hx}" y1="${T}" x2="${hx}" y2="${H - B}" stroke="rgba(200,71,31,.6)" stroke-dasharray="3 4" stroke-width="1.5"/>
    <circle cx="${hx}" cy="${y(rT)}" r="5" fill="#C8471F" stroke="#FCF9F0" stroke-width="2"/>
    <text x="${hxc}" y="${T + 4}" text-anchor="middle" font-size="11" font-weight="bold" fill="#C8471F" font-family="IBM Plex Mono,monospace" ${halo}>today · ${Math.round(rT * 100)}%</text>`;
  let ticks = ''; const tstep = Math.max(1, Math.round(xMax / 4));
  for (let f = 0; f <= xMax; f += tstep) ticks += `<text x="${x(f)}" y="${H - 9}" text-anchor="middle" font-size="9" fill="#6E6553" font-family="IBM Plex Mono,monospace">${fmtD(addDays(t0, Math.round(f)))}</text>`;
  return `<svg class="curve" viewBox="0 0 ${W} ${H}">${grid}${frame}${areas}${thr}${curves}${connect}${ghost}${hoy}${dots}${ticks}</svg>`;
}

export function milestonesHTML(tp: Topic, state: State): string {
  const iv = activeIV(state), n = tp.studies.length,
    done = Math.min(Math.max(n - 1, 0), iv.length), target = Math.max(n, 1);
  return iv.map((d, k) => {
    const kx = k + 1; const cls = kx <= done ? 'done' : (kx === target && n <= iv.length ? 'now' : '');
    return `<span class="ms ${cls}" title="Review ${kx}: ${d} day${d > 1 ? 's' : ''} after"><i></i>R${kx} · ${d}d</span>`;
  }).join('') || '<span style="font-size:.72rem;color:var(--ink2);font-style:italic">No active reviews — enable them in ⚙ Settings.</span>';
}

export const CURVE_HELP_HTML = CURVE_HELP;

/* ─── Markdown (portado del original) ─── */
export function mdToHTML(src: string | null | undefined, resolveSrc?: (s: string) => string): string {
  let t = String(src ?? '').replace(/\r\n/g, '\n');
  const blocks: string[] = [];
  t = t.replace(/```[^\n]*\n([\s\S]*?)```/g, (m, code) => {
    blocks.push('<pre class="md-code"><code>' + esc(code).replace(/^\n+|\n+$/g, '') + '</code></pre>');
    return '\u0000' + String(blocks.length - 1) + '\u0000';
  });
  const resolve = (s: string) => (resolveSrc ? resolveSrc(s) : s);
  const inline = (s: string) => {
    let x = esc(s);
    x = x.replace(/&lt;u&gt;([^<]*)&lt;\/u&gt;/g, '<u>$1</u>');
    x = x.replace(/&lt;sub&gt;([^<]*)&lt;\/sub&gt;/g, '<sub>$1</sub>');
    x = x.replace(/&lt;sup&gt;([^<]*)&lt;\/sup&gt;/g, '<sup>$1</sup>');
    x = x.replace(/&lt;mark&gt;([^<]*)&lt;\/mark&gt;/g, '<mark>$1</mark>');
    x = x.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    x = x.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, src) => `<img src="${resolve(src)}" alt="${alt}" loading="lazy">`);
    x = x.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    x = x.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    x = x.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    x = x.replace(/~~([^~\n]+)~~/g, '<del>$1</del>');
    return x;
  };
  const lines = t.split('\n');
  let html = '', i = 0, list: string | null = null, quote = '', tableRows: string[][] = [];
  const closeList = () => { if (list) { html += '</' + list + '>\n'; list = null; } };
  const closeQuote = () => { if (quote) { html += '<blockquote>\n' + quote + '</blockquote>\n'; quote = ''; } };
  const closeTable = () => {
    if (tableRows.length) {
      html += '<div class="md-table"><table>' + tableRows.map((r, ri) =>
        '<tr>' + r.map(c => '<' + (ri ? 'td' : 'th') + '>' + inline(c) + '</' + (ri ? 'td' : 'th') + '>').join('') + '</tr>').join('') + '</table></div>\n';
    }
    tableRows = [];
  };
  while (i < lines.length) {
    const ln = lines[i], m = ln.match(/^\u0000(\d+)\u0000$/);
    if (m) { closeList(); closeQuote(); closeTable(); html += blocks[+m[1]] + '\n'; i++; continue; }
    if (/^\s*$/.test(ln)) { closeList(); closeQuote(); closeTable(); i++; continue; }
    let cm: RegExpMatchArray | null;
    if ((cm = ln.match(/^(#{1,6})\s+(.*)$/))) { closeList(); closeQuote(); closeTable();
      html += '<h' + cm[1].length + '>' + inline(cm[2]) + '</h' + cm[1].length + '>\n'; i++; continue; }
    if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(ln)) { closeList(); closeQuote(); closeTable();
      html += '<hr>\n'; i++; continue; }
    if ((cm = ln.match(/^>\s?(.*)$/))) {
      closeList(); closeTable();
      if (!quote) { quote = ''; html += '<blockquote>\n'; }
      quote += '<p>' + inline(cm[1]) + '</p>'; i++; continue;
    }
    if ((cm = ln.match(/^\s*[-*]\s+\[([ xX])\]\s+(.*)$/))) {
      closeQuote(); closeTable();
      if (list !== 'ul') { closeList(); list = 'ul'; html += '<ul class="md-cbl">\n'; }
      html += '<li><label class="md-cb"><input type="checkbox" disabled ' + (cm[1].toLowerCase() === 'x' ? 'checked' : '') + '><span>' + inline(cm[2]) + '</span></label></li>\n';
      i++; continue;
    }
    if ((cm = ln.match(/^\s*([-*])\s+(.*)$/))) {
      closeQuote(); closeTable();
      if (list !== 'ul') { closeList(); list = 'ul'; html += '<ul>\n'; }
      html += '<li>' + inline(cm[2]) + '</li>\n'; i++; continue;
    }
    if ((cm = ln.match(/^\s*(\d+)[.)]\s+(.*)$/))) {
      closeQuote(); closeTable();
      if (list !== 'ol') { closeList(); list = 'ol'; html += '<ol>\n'; }
      html += '<li>' + inline(cm[2]) + '</li>\n'; i++; continue;
    }
    if (ln.trim().startsWith('|')) {
      closeList(); closeQuote();
      const cells = ln.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      if (!/^:?-+:?$/.test(cells.join('').replace(/:/g, ''))) tableRows.push(cells);
      i++; continue;
    }
    closeList(); closeQuote(); closeTable();
    html += '<p>' + inline(ln) + '</p>\n'; i++;
  }
  closeList(); closeQuote(); closeTable();
  return html || '<p class="empty">This page is blank. Start writing ✍</p>';
}

export function domToMd(root: HTMLElement, srcResolver?: (url: string) => string): string {
  const inline = (n: ChildNode): string => {
    let out = '';
    n.childNodes.forEach(c => {
      if (c.nodeType === 3) { out += c.textContent ?? ''; return; }
      if (c.nodeType !== 1) return;
      const tag = (c as HTMLElement).tagName.toLowerCase(), inner = inline(c);
      if (tag === 'br') out += '\n';
      else if (tag === 'strong' || tag === 'b') out += '**' + inner + '**';
      else if (tag === 'em' || tag === 'i') out += '*' + inner + '*';
      else if (tag === 'u') out += '<u>' + inner + '</u>';
      else if (tag === 'del' || tag === 's' || tag === 'strike') out += '~~' + inner + '~~';
      else if (tag === 'sub') out += '<sub>' + inner + '</sub>';
      else if (tag === 'sup') out += '<sup>' + inner + '</sup>';
      else if (tag === 'mark') out += '<mark>' + inner + '</mark>';
      else if (tag === 'code') out += (c as HTMLElement).closest('pre') ? inner : '`' + inner + '`';
      else if (tag === 'a') out += '[' + inner + '](' + ((c as HTMLAnchorElement).getAttribute('href') || '') + ')';
      else if (tag === 'img') {
        const src = (c as HTMLImageElement).getAttribute('src') || '';
        const alt = ((c as HTMLImageElement).getAttribute('alt') || '').replace(/]/g, '');
        out += '![' + alt + '](' + (srcResolver ? srcResolver(src) : src).replace(/\s/g, '') + ')';
      }
      else if (tag === 'input') out += '';
      else out += inner;
    });
    return out;
  };
  const blocks: { t: string; lvl?: number; md: string }[] = [];
  root.childNodes.forEach(n => {
    if (n.nodeType === 3) { if (n.textContent && n.textContent.trim()) blocks.push({ t: 'p', md: n.textContent }); return; }
    if (n.nodeType !== 1) return;
    const tag = (n as HTMLElement).tagName.toLowerCase();
    if (tag === 'p' || tag === 'div') blocks.push({ t: 'p', md: inline(n) });
    else if (/^h[1-6]$/.test(tag)) blocks.push({ t: 'h', lvl: +tag[1], md: inline(n) });
    else if (tag === 'hr') blocks.push({ t: 'hr', md: '' });
    else if (tag === 'blockquote') blocks.push({ t: 'q', md: inline(n) });
    else if (tag === 'ul' || tag === 'ol') {
      (n as HTMLElement).querySelectorAll(':scope > li').forEach(li => {
        const cb = li.querySelector('input[type=checkbox]');
        const m = inline(li);
        if (cb) blocks.push({ t: 'li', md: '- [' + ((cb as HTMLInputElement).checked ? 'x' : ' ') + '] ' + m });
        else blocks.push({ t: 'li', md: (tag === 'ul' ? '- ' : '1. ') + m });
      });
    }
    else if (tag === 'table') {
      const lines: string[] = [];
      (n as HTMLElement).querySelectorAll('tr').forEach(tr => {
        const cells = [...tr.children].map(td => inline(td).replace(/\|/g, '\\|').trim());
        lines.push('| ' + cells.join(' | ') + ' |');
      });
      if (lines.length) {
        const ncols = (n as HTMLElement).querySelector('tr') ? (n as HTMLElement).querySelector('tr')!.children.length : 2;
        lines.splice(1, 0, '|' + '---|'.repeat(ncols));
        blocks.push({ t: 'raw', md: lines.join('\n') + '\n\n' });
      }
    }
    else if (tag === 'pre') blocks.push({ t: 'code', md: inline(n) });
    else if (tag === 'li') blocks.push({ t: 'li', md: inline(n) });
    else blocks.push({ t: 'p', md: inline(n) });
  });
  let out = '';
  blocks.forEach(b => {
    if (b.t === 'raw') out += b.md;
    else if (b.t === 'h') out += '#'.repeat(b.lvl ?? 2) + ' ' + b.md.trim() + '\n\n';
    else if (b.t === 'p') out += (b.md || '') + '\n\n';
    else if (b.t === 'hr') out += '---\n\n';
    else if (b.t === 'q') out += '> ' + b.md.replace(/\n+/g, '\n> ').trim() + '\n\n';
    else if (b.t === 'li') out += b.md.trim() + '\n';
    else if (b.t === 'code') out += '```\n' + b.md.trim() + '\n```\n\n';
  });
  return out.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

/* ─── HTML builders for views (ported from the original) ─── */
export function mesaBodyHTML(tp: Topic, state: State, xl: boolean): string {
  const s = topicStatus(tp, state), iv = activeIV(state);
  const todayK = key(new Date()), ex = tp.studies.find(x => x.date === todayK);
  const totMin = tp.studies.reduce((a, x) => a + x.minutes, 0);
  let nextTxt: string;
  if (s.n === 0) nextTxt = 'Your first session kicks off the curve. Then review R1 arrives.';
  else if (s.cls === 'master') nextTxt = 'Curve complete: all reviews done. Long-term memory 🎉';
  else nextTxt = `Next review <b>R${s.n}</b>: ${fmtD(s.due as Date)} (${s.diff === 0 ? 'today!' : (s.diff as number) < 0 ? 'overdue' : 'in ' + s.diff + ' days'}). Estimated retention today: <b>${s.ret}%</b>.`;
  const useSteps = state.stepsOn && state.steps.length;
  const lateWarn = s.cls === 'late'
    ? `<div class="warn-box">⚠ <b>Review overdue by ${s.diff === -1 ? '1 day' : (-(s.diff as number)) + ' days'}:</b> your retention fell below the threshold. <b>It is recommended to reset the review</b> (start the curve over) or review it today with a full session.</div>` : '';
  const saveLabel = s.n === 0 ? '✓ Save first session' : s.cls === 'master' ? '✓ Save reinforcement session' : `✓ Save review no. ${s.n} (R${s.n})`;
  const saveExpl = s.n === 0
    ? 'On save: today’s date is logged, minutes are added and review R1 is scheduled.'
    : s.cls === 'master'
      ? 'This topic already completed the whole curve: save reinforcements whenever you like.'
      : `R${s.n} means «review number ${s.n}» (${iv.join(' · ')} days). On save, R${s.n + 1} is scheduled.`;
  return `<div class="mesa-grid">
    <div><div class="curve-box">${curveSVG(tp, iv)}</div>
      <div class="milestones">${milestonesHTML(tp, state)}</div>
      ${CURVE_HELP}</div>
    <div class="mesa-side">
      <div><p class="big-ret ${xl ? 'xl' : ''} ${retClass(s.ret)}">${s.n ? s.ret + '%' : '—'}</p><p class="ret-lbl">estimated retention</p></div>
      <div class="side-meta">
        <span>Sessions: <b>${s.n}</b> · <b>${fmtH(totMin)}</b></span>
        <span>Last: <b>${s.n ? fmtD(noon(tp.studies[s.n - 1].date)) : '—'}</b></span>
        <span>Reviews completed: <b>${Math.min(Math.max(s.n - 1, 0), iv.length)} / ${iv.length}</b></span>
      </div>
      <div class="mesa-actions">
        <button class="btn btn-mini" id="mesaPomo">⏱ Pomodoro for this topic</button>
        <button class="btn btn-mini" id="mesaResetT">↺ Reset topic</button>
      </div>
      ${ex ? `<p class="today-info">✓ Today you already logged ${ex.minutes} min on this topic.</p>` : ''}
      <p class="mesa-next">${nextTxt}</p>
    </div></div>
    ${lateWarn}
    ${useSteps ? `<div class="steps" id="stepsList">${state.steps.map((stp, i) => `
      <div class="step ${ex && ex.steps[i] ? 'on' : ''}">
        <label class="step-check"><input type="checkbox" ${ex && ex.steps[i] ? 'checked' : ''}>
          <span class="n">${i + 1}</span>
          <span class="s-txt">${esc(stp.t)}${stp.s ? `<small>${esc(stp.s)}</small>` : ''}</span></label>
        <button class="step-pomo" data-steppomo="${i}" title="Start a pomodoro; when it ends, this step is marked as complete">⏱</button>
      </div>`).join('')}</div>`
    : `<p style="font-size:.78rem;color:var(--ink2);font-style:italic;margin-bottom:1rem">Checklist disabled — you can enable it in ⚙ Settings.</p>`}
    <div class="mesa-foot">
      <label class="fld"><span>Minutes for this session</span>
        <input class="f-sm" type="number" id="mesaMin" min="5" max="600" step="5" value="45"></label>
      <label class="fld f-grow"><span>Short note (optional)</span>
        <input type="text" id="mesaNote" maxlength="90" placeholder="e.g. Chain rule…" value="${esc(ex ? ex.note : '')}"></label>
      <button class="btn btn-primary" id="mesaSave" style="flex:none">${saveLabel}</button>
    </div>
    <p class="foot-note">${saveExpl}</p>`;
}

export function queueHTML(state: State): { count: string; html: string } {
  const all = state.topics.map(t => ({ t, s: topicStatus(t, state) }));
  const due = all.filter(x => x.s.diff !== null && x.s.diff <= 0).sort((a, b) => (a.s.diff as number) - (b.s.diff as number));
  const news = all.filter(x => x.s.n === 0);
  const soon = all.filter(x => x.s.diff !== null && x.s.diff > 0 && x.s.diff <= 2).sort((a, b) => (a.s.diff as number) - (b.s.diff as number));
  const count = due.length + ' due today';
  const row = (x: { t: Topic; s: TopicStatus }, btn: boolean) => {
    const sub = subjectOf(state, x.t.subjectId);
    return `<div class="qrow"><span class="pill ${x.s.cls}">${x.s.label}</span>
      <div class="q-main"><span class="dot" style="background:${sub ? sub.color : '#888'}"></span>
      <b>${esc(x.t.name)}</b><small>${sub ? esc(sub.name) : ''} · ret. ${x.s.ret}%</small></div>
      ${btn ? `<button class="btn btn-mini" data-open="${x.t.id}">Study →</button>` : ''}</div>`;
  };
  let html = '';
  if (due.length) html += `<p class="q-head">Overdue and today</p>` + due.map(x => row(x, true)).join('');
  if (news.length) html += `<p class="q-head">Not studied yet</p>` + news.map(x => row(x, true)).join('');
  if (soon.length) html += `<p class="q-head">Coming up (1–2 days)</p>` + soon.map(x => row(x, false)).join('');
  html = html || '<p class="empty">All caught up ✦ The forgetting curve has nothing on you.</p>';
  return { count, html };
}

export function subjectsHTML(state: State, collapsed: Set<string>, selectedTopicId: string | null): string {
  const el = state.subjects.map(sub => {
    const topics = state.topics.filter(t => t.subjectId === sub.id);
    const due = topics.filter(t => { const s = topicStatus(t, state); return s.diff !== null && s.diff <= 0; }).length;
    const tot = topics.reduce((a, t) => a + t.studies.reduce((b, s) => b + s.minutes, 0), 0);
    const col = collapsed.has(sub.id);
    return `<div class="subj-block ${col ? 'collapsed' : ''}">
      <div class="subj-head" data-subhead="${sub.id}">
        <span class="chip" style="background:${sub.color}"></span><h3>${esc(sub.name)}</h3>
        <span class="subj-counts">${topics.length} ${topics.length === 1 ? 'topic' : 'topics'} · ${fmtH(tot)}${due ? ` · <b style="color:var(--accent)">${due} today</b>` : ''}</span>
        <button class="del" data-del-subject="${sub.id}" title="Delete subject">×</button>
        <span class="chev">▾</span></div>
      <div class="subj-body" ${col ? 'hidden' : ''}>
        ${topics.map(tp => {
        const s = topicStatus(tp, state);
        return `<div class="topic ${tp.id === selectedTopicId ? 'selected' : ''}" data-topic="${tp.id}">
            <span class="pill ${s.cls}">${s.label}</span>
            <div><p class="t-name">${esc(tp.name)}</p>
              <p class="t-meta">${s.n} ${s.n === 1 ? 'session' : 'sessions'} · ${s.n ? 'last ' + fmtD(noon(tp.studies[s.n - 1].date)) : 'not studied'} · ret. ${s.n ? s.ret + '%' : '—'}</p></div>
            <div class="retbar"><i class="${retClass(s.ret)}" data-w="${s.n ? s.ret : 0}"></i></div>
            <button class="del" data-del-topic="${tp.id}" title="Delete topic">×</button></div>`;
      }).join('') || '<p class="empty" style="padding-left:1.6rem">No topics yet.</p>'}
        <form class="topic-form" data-add-topic="${sub.id}">
          <input placeholder="New topic… (e.g. Volume calculations)" maxlength="60" required>
          <button class="btn btn-mini" type="submit">+ Topic</button></form>
      </div></div>`;
  }).join('');
  if (!state.subjects.length) return '<p class="empty">Create your first subject above to get started. ✍</p>';
  return el;
}

export function logHTML(state: State): { total: string; html: string } {
  const list = entries(state).slice(0, 150), total = entries(state).reduce((a, e) => a + e.minutes, 0);
  const totalTxt = entries(state).length + ' sessions · ' + fmtH(total) + ' total study time';
  const html = list.map(e => `<div class="sess">
      <span class="sess-date">${noon(e.date).toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
      <span class="sess-subj"><span class="dot" style="background:${e.color}"></span><span class="nm">${esc(e.topic)}</span></span>
      <span class="sess-min">${e.minutes}′</span>
      <span class="sess-note">${e.kind === 'estudio' ? esc(e.subName) + ' · steps ' + e.steps + '/' + (e.stepsTot || 5) + (e.note ? ' · “' + esc(e.note) + '”' : '') : esc(e.note)}</span>
      <button class="del" data-del-entry="${e.kind === 'estudio' ? 't:' + e.topicId + ':' + e.stTs : e.kind === 'archivo' ? 'a:' + e.archId : 'l:' + e.looseId}" title="Delete">×</button></div>`).join('') || '<p class="empty">No sessions logged yet.</p>';
  return { total: totalTxt, html };
}

export function informeMd(state: State): string {
  const iv = activeIV(state);
  let md = `# 📓 Study log — Report\n\n`;
  md += `_Generated on ${new Date().toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}_\n\n`;
  md += `> **Active reviews:** ${iv.length ? iv.join(' · ') + ' days' : 'none'}\n`;
  md += `> **Session method:** ${state.stepsOn ? state.steps.map(s => s.t).join(' → ') : 'no checklist'}\n\n`;
  const ents = entries(state), tot = ents.reduce((a, e) => a + e.minutes, 0);
  md += `**Totals:** ${state.topics.length} topics · ${ents.length} sessions · ${fmtH(tot)} · ${calcStreak(state)}-day streak · ${state.pomodoros} pomodoros\n\n`;
  md += `| Topic | Subject | Sessions | Hours | Status |\n|---|---|---|---|---|\n`;
  state.topics.forEach(tp => {
    const sub = subjectOf(state, tp.subjectId), s = topicStatus(tp, state);
    md += `| ${tp.name} | ${sub ? sub.name : '—'} | ${s.n} | ${fmtH(tp.studies.reduce((a, x) => a + x.minutes, 0))} | ${s.label} |\n`;
  });
  md += `\n---\n\n`;
  state.subjects.forEach(sub => {
    const topics = state.topics.filter(t => t.subjectId === sub.id); if (!topics.length) return;
    const totS = topics.reduce((a, t) => a + t.studies.reduce((b, s) => b + s.minutes, 0), 0);
    md += `## ${sub.name}\n_${topics.length} topics · ${fmtH(totS)}_\n\n`;
    topics.forEach(tp => {
      const s = topicStatus(tp, state);
      md += `### ${tp.name}\n- Status: **${s.label}** · ${s.n} sessions · retention: ${s.n ? s.ret + '%' : '—'}\n`;
      if (tp.studies.length) {
        md += '\n| Date | Minutes | Steps | Note |\n|---|---|---|---|\n';
        [...tp.studies].sort((a, b) => a.date < b.date ? -1 : 1).forEach(x => {
          md += `| ${x.date} | ${x.minutes}′ | ${x.steps.filter(Boolean).length}/${x.steps.length} | ${x.note || ''} |\n`;
        });
      }
      if (tp.notes && tp.notes.length) {
        md += `\n#### Notebook\n\n`;
        tp.notes.forEach(n => { md += `##### ${n.name}\n\n${n.md.trim() || '_empty page_'}\n\n`; });
      }
      md += '\n';
    });
    md += `---\n\n`;
  });
  return md;
}
