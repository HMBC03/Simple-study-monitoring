'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useBitacora } from '@/store/useBitacora';
import { domToMd, esc, key, mdToHTML, now, subjectOf, uid } from '@/lib/logic';
import { blobIdFromRef, blobRef, getBlob } from '@/lib/storage';
import { idFromObjectURL, registerObjectURL, saveImageBlob, shrinkImageFile } from '@/lib/images';
import { NB_TOOLS } from '@/lib/constants';
import { download } from '@/lib/ui';

const slug = (s: string) =>
  String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'nota';

const countWords = (md: string) => (md.trim() ? md.trim().split(/\s+/).length : 0);

type Mode = 'w' | 'md';

export default function NotebookView() {
  const state = useBitacora(s => s.state);
  const commit = useBitacora(s => s.commit);
  const openModal = useBitacora(s => s.openModal);
  const toast = useBitacora(s => s.toast);

  const [chosenSubj, setSubjId] = useState<string | null>(null);
  const [chosenTopic, setTopicId] = useState<string | null>(null);
  const [chosenPage, setPageId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>(() => (state.lastNb?.mode === 'md' ? 'md' : 'w'));
  const [words, setWords] = useState(0);
  const [savedText, setSavedText] = useState('guardado ✓');
  const [savedWarn, setSavedWarn] = useState(false);
  const [updatedAtText, setUpdatedAtText] = useState('—');
  const [preview, setPreview] = useState('');
  const [wysInit, setWysInit] = useState<{ __html: string } | null>(null);

  const taRef = useRef<HTMLTextAreaElement>(null);
  const wysRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef(new Map<string, string>());
  const saveT = useRef<number | null>(null);
  const draftRef = useRef('');
  const savedMdRef = useRef('');
  const selRef = useRef({ subjId: null as string | null, topicId: null as string | null, pageId: null as string | null, mode: 'w' as Mode });
  const stateRef = useRef(state);

  const effSubjId = chosenSubj && state.subjects.some(s => s.id === chosenSubj)
    ? chosenSubj
    : (state.lastNb?.subjId && state.subjects.some(s => s.id === state.lastNb.subjId)
      ? state.lastNb.subjId
      : (state.subjects[0]?.id ?? null));
  const topics = effSubjId ? state.topics.filter(t => t.subjectId === effSubjId) : [];
  const effTopicId = chosenTopic && topics.some(t => t.id === chosenTopic)
    ? chosenTopic
    : (state.lastNb?.topicId && topics.some(t => t.id === state.lastNb.topicId)
      ? state.lastNb.topicId
      : (topics[0]?.id ?? null));
  const effTopic = topics.find(t => t.id === effTopicId) ?? null;
  const effPageId = chosenPage && effTopic?.notes.some(n => n.id === chosenPage)
    ? chosenPage
    : (state.lastNb?.pageId && effTopic?.notes.some(n => n.id === state.lastNb.pageId)
      ? state.lastNb.pageId
      : (effTopic?.notes[0]?.id ?? null));

  useEffect(() => {
    stateRef.current = state;
    selRef.current = { subjId: effSubjId, topicId: effTopicId, pageId: effPageId, mode };
  });

  const subj = state.subjects.find(s => s.id === effSubjId) ?? null;
  const tp = effTopic;
  const pg = tp ? tp.notes.find(n => n.id === effPageId) ?? null : null;

  const resolveIn = (src: string) => {
    const id = blobIdFromRef(src);
    return id && urlsRef.current.has(id) ? urlsRef.current.get(id)! : src;
  };
  const resolveOut = (src: string) => {
    const id = idFromObjectURL(src);
    return id ? blobRef(id) : src;
  };

  useEffect(() => {
    urlsRef.current.forEach(u => URL.revokeObjectURL(u));
    urlsRef.current.clear();
    const t = stateRef.current.topics.find(x => x.id === selRef.current.topicId);
    const p = t?.notes.find(n => n.id === selRef.current.pageId);
    let alive = true;
    void (async () => {
      if (!p) { if (alive) { setWysInit(null); setPreview(''); } return; }
      savedMdRef.current = p.md;
      draftRef.current = p.md;
      setWords(countWords(p.md));
      setUpdatedAtText(p.updatedAt ? 'editado ' + new Date(p.updatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '—');
      for (const id of [...p.md.matchAll(/blob:([A-Za-z0-9-_]+)/g)].map(m => m[1])) {
        if (urlsRef.current.has(id)) continue;
        try {
          const blob = await getBlob(id);
          if (!blob) continue;
          const url = URL.createObjectURL(blob);
          urlsRef.current.set(id, url);
          registerObjectURL(url, id);
        } catch { /* blob faltante: se queda la ref */ }
      }
      if (!alive) return;
      const html = mdToHTML(p.md, resolveIn);
      setWysInit({ __html: html });
      setPreview(html);
    })();
    return () => { alive = false; };
  }, [effPageId]);

  const applySave = useCallback((md: string) => {
    const sel = selRef.current;
    const t = stateRef.current.topics.find(x => x.id === sel.topicId);
    const p = t?.notes.find(n => n.id === sel.pageId);
    if (!t || !p) return;
    const nm = titleRef.current?.value.trim() || p.name;
    commit(s => {
      const t3 = s.topics.find(x => x.id === t.id);
      const p3 = t3?.notes.find(x => x.id === p.id);
      if (!t3 || !p3) return;
      const changed = md !== savedMdRef.current;
      if (changed) p3.md = md;
      if (nm && nm !== p3.name) p3.name = nm;
      if (changed || nm !== p3.name) p3.updatedAt = now();
      s.lastNb = { subjId: sel.subjId, topicId: sel.topicId, pageId: sel.pageId, mode: sel.mode };
    });
    savedMdRef.current = md;
    setUpdatedAtText('editado ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    setSavedText('guardado ✓');
    setSavedWarn(false);
  }, [commit]);

  const saveNow = useCallback(() => {
    if (saveT.current) { clearTimeout(saveT.current); saveT.current = null; }
    applySave(draftRef.current);
  }, [applySave]);

  const flushSave = useCallback(() => {
    if (saveT.current) { clearTimeout(saveT.current); saveT.current = null; }
    applySave(draftRef.current);
  }, [applySave]);

  const scheduleSave = useCallback(() => {
    if (saveT.current) clearTimeout(saveT.current);
    saveT.current = window.setTimeout(() => applySave(draftRef.current), 600);
  }, [applySave]);

  const refreshDraft = useCallback(() => {
    const wys = wysRef.current, ta = taRef.current;
    const md = mode === 'md' ? (ta?.value ?? draftRef.current) : (wys ? domToMd(wys, resolveOut) : draftRef.current);
    draftRef.current = md;
    setWords(countWords(md));
    if (mode === 'md') setPreview(mdToHTML(md, resolveIn));
  }, [mode]);

  const onTaInput = () => { refreshDraft(); scheduleSave(); };
  const onTaKey = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); saveNow(); }
  };
  const onWysInput = () => { refreshDraft(); scheduleSave(); };
  const onWysPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const txt = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, txt);
    refreshDraft(); scheduleSave();
  };
  const onWysKey = (e: React.KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 's') { e.preventDefault(); saveNow(); return; }
    if ((e.ctrlKey || e.metaKey) && ['b', 'i', 'u'].includes(k)) {
      e.preventDefault();
      document.execCommand(k === 'b' ? 'bold' : k === 'i' ? 'italic' : 'underline');
      refreshDraft(); scheduleSave();
    }
  };

  const changeMode = (m: Mode) => {
    if (m === mode) return;
    flushSave();
    setMode(m);
    commit(s => { if (s.lastNb) s.lastNb.mode = m; });
    if (m === 'md') setPreview(mdToHTML(draftRef.current, resolveIn));
    toast(m === 'md'
      ? 'Modo Markdown: escribe con sintaxis #, **, -, [x]'
      : 'Modo Normal: escribe como en Word — Ctrl+B negrita, Ctrl+I cursiva, Ctrl+U subrayado');
  };

  const switchTopic = (id: string) => {
    flushSave();
    setTopicId(id);
    const t2 = topics.find(t => t.id === id);
    setPageId(t2?.notes[0]?.id ?? null);
    commit(s => { s.lastNb = { subjId: selRef.current.subjId, topicId: id, pageId: t2?.notes[0]?.id ?? null, mode: selRef.current.mode }; });
  };
  const switchPage = (id: string) => {
    flushSave();
    setPageId(id);
    commit(s => { s.lastNb = { subjId: selRef.current.subjId, topicId: selRef.current.topicId, pageId: id, mode: selRef.current.mode }; });
  };
  const switchSubject = (id: string) => {
    flushSave();
    setSubjId(id || null);
    const ts = state.topics.filter(t => t.subjectId === id);
    setTopicId(ts[0]?.id ?? null);
    setPageId(ts[0]?.notes[0]?.id ?? null);
    commit(s => { s.lastNb = { subjId: id || null, topicId: ts[0]?.id ?? null, pageId: ts[0]?.notes[0]?.id ?? null, mode: selRef.current.mode }; });
  };

  const addTopic = async () => {
    if (!subj) { toast('Primero crea una asignatura en la vista Hoy'); return; }
    const nm = await openModal({ title: 'Nuevo tema', msg: `¿Cómo se llama este tema del cuaderno (en «${esc(subj.name)}»)?`, inputValue: '' });
    if (nm === null) return;
    const name = typeof nm === 'string' && nm.trim() ? nm.trim() : '';
    const id = uid();
    commit(s => {
      s.topics.push({ id, subjectId: subj.id, name: name || 'Tema ' + (s.topics.filter(t => t.subjectId === subj.id).length + 1), created: key(new Date()), studies: [], notes: [] });
      s.lastNb = { subjId: subj.id, topicId: id, pageId: null, mode: selRef.current.mode };
    });
    setTopicId(id);
    setPageId(null);
    toast('Tema creado: ' + name);
  };

  const addPage = async () => {
    if (!tp) { toast('Primero crea un tema'); return; }
    const nm = await openModal({ title: 'Nuevo subtema', msg: `¿Cómo se llama este subtema (en «${esc(tp.name)}»)?`, inputValue: '' });
    if (nm === null) return;
    const name = typeof nm === 'string' && nm.trim() ? nm.trim() : '';
    const pgn = { id: uid(), name: name || 'Subtema ' + (tp.notes.length + 1), md: '', updatedAt: now() };
    commit(s => {
      const t3 = s.topics.find(t => t.id === tp.id);
      t3?.notes.push(pgn);
      s.lastNb = { subjId: selRef.current.subjId, topicId: tp.id, pageId: pgn.id, mode: selRef.current.mode };
    });
    setPageId(pgn.id);
    toast('Subtema creado: ' + pgn.name);
  };

  const dupPage = () => {
    if (!tp || !pg) return;
    flushSave();
    const c = { id: uid(), name: pg.name + ' (copia)', md: pg.md, updatedAt: now() };
    commit(s => {
      const t3 = s.topics.find(t => t.id === tp.id);
      const idx = t3?.notes.findIndex(n => n.id === pg.id) ?? -1;
      t3?.notes.splice(idx + 1, 0, c);
      s.lastNb = { subjId: selRef.current.subjId, topicId: tp.id, pageId: c.id, mode: selRef.current.mode };
    });
    setPageId(c.id);
    toast('Subtema duplicado ⧉');
  };

  const delPage = () => {
    if (!tp || !pg) return;
    void openModal({
      title: 'Borrar subtema',
      msg: `¿Borrar el subtema <b>«${esc(pg.name)}»</b> de «${esc(tp.name)}»? Su contenido se pierde.`,
      okText: 'Borrar', danger: true,
    }).then(ok => {
      if (!ok) return;
      const rest = tp.notes.filter(n => n.id !== pg.id);
      commit(s => {
        const t3 = s.topics.find(t => t.id === tp.id);
        if (t3) t3.notes = t3.notes.filter(n => n.id !== pg.id);
        s.lastNb = { subjId: selRef.current.subjId, topicId: tp.id, pageId: rest[0]?.id ?? null, mode: selRef.current.mode };
      });
      setPageId(rest[0]?.id ?? null);
      toast('Subtema borrado');
    });
  };

  const exportMd = () => {
    if (!tp || !pg) return;
    const sb = subj ? subjectOf(state, tp.subjectId) : null;
    const md = '# ' + pg.name + '\n\n> Cuaderno de ' + tp.name + (sb ? ' · ' + sb.name : '') +
      '\n> Generado el ' + new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) +
      '\n\n---\n\n' + (pg.md.trim() || '_página vacía_') + '\n';
    download(slug(pg.name) + '.md', md, 'text/markdown');
    toast('Página descargada ⬇ .md');
  };

  const onTool = (x: (typeof NB_TOOLS)[number]) => {
    if (x.img) { fileRef.current?.click(); return; }
    if (mode === 'md' && taRef.current) {
      const ta = taRef.current;
      const a = ta.selectionStart, b = ta.selectionEnd;
      const sel = ta.value.slice(a, b) || x.ph || '';
      if (x.link) ta.value = ta.value.slice(0, a) + '[' + sel + '](https://)' + ta.value.slice(b);
      else if (x.pre || x.post) ta.value = ta.value.slice(0, a) + (x.pre ?? '') + sel + (x.post ?? '') + ta.value.slice(b);
      const np = a + (x.pre ?? '').length + sel.length;
      ta.focus();
      ta.setSelectionRange(np, np + (x.post ?? '').length);
      refreshDraft(); scheduleSave();
      return;
    }
    const wys = wysRef.current;
    if (!wys) return;
    wys.focus();
    if (x.link) {
      void openModal({ title: 'Enlace', msg: '¿A qué URL apunta el enlace?', inputValue: 'https://' }).then(u => {
        if (u === null || u === false) return;
        document.execCommand('createLink', false, String(u));
        refreshDraft(); scheduleSave();
      });
      return;
    }
    if (x.cmd) document.execCommand(x.cmd, false, x.arg ?? undefined);
    else if (x.html) document.execCommand('insertHTML', false, x.html);
    refreshDraft(); scheduleSave();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try {
      const blob = await shrinkImageFile(f);
      const id = await saveImageBlob(blob);
      const ref = blobRef(id);
      if (mode === 'md' && taRef.current) {
        const ta = taRef.current;
        const a = ta.selectionStart, b = ta.selectionEnd;
        ta.value = ta.value.slice(0, a) + '![imagen](' + ref + ')' + ta.value.slice(b);
        refreshDraft(); scheduleSave();
      } else {
        const url = URL.createObjectURL(blob);
        urlsRef.current.set(id, url);
        registerObjectURL(url, id);
        const wys = wysRef.current;
        if (wys) {
          wys.focus();
          document.execCommand('insertHTML', false, '<img src="' + url + '" alt="imagen">');
          refreshDraft(); scheduleSave();
        }
      }
      toast('Imagen añadida ✓ (guardada en tu dispositivo)');
    } catch {
      toast('No se pudo procesar la imagen ✕');
    }
  };

  return (
    <section data-view="notebook">
      <div className="view-top">
        <div>
          <p className="eyebrow">Tu conocimiento escrito</p>
          <h1 className="view-title">Cuaderno</h1>
          <p className="view-sub">La asignatura es tu cuaderno: cada pestaña es un tema y dentro viven los subtemas. Escribe normal (como en Word) o en Markdown; se guarda solo y viaja en tu backup.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <select style={{ minWidth: 240 }} aria-label="Elegir asignatura del cuaderno" value={subj?.id ?? ''} onChange={e => switchSubject(e.target.value)}>
            <option value="">— elige una asignatura —</option>
            {state.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {subj && <span className="pill new" style={{ borderStyle: 'solid' }}>{topics.length} {topics.length === 1 ? 'tema' : 'temas'}</span>}
          <button className="btn btn-mini" onClick={() => void addTopic()}>+ Tema</button>
        </div>
      </div>
      <div className="card nb-card">
        <div className="nb-tabs" role="tablist" aria-label="Temas">
          {topics.map(t => (
            <button key={t.id} className={'nb-tab ' + (t.id === tp?.id ? 'active' : '')} role="tab" title={t.name} onClick={() => switchTopic(t.id)}>
              {t.name}
            </button>
          ))}
          <button className="nb-tab new" title={subj ? 'Nuevo tema en «' + subj.name + '»' : 'Nuevo tema'} onClick={() => void addTopic()}>+ Tema</button>
        </div>
        <div className="nb-stabs" role="tablist" aria-label="Subtemas">
          {tp?.notes.map(n => (
            <button key={n.id} className={'nb-stab ' + (n.id === pg?.id ? 'active' : '')} role="tab" title={n.name} onClick={() => switchPage(n.id)}>
              {n.name}
            </button>
          ))}
          {tp && <button className="nb-tab new" title={'Nuevo subtema en «' + tp.name + '»'} onClick={() => void addPage()}>+ Subtema</button>}
        </div>
        <div className="nb-body">
          {!subj && (
            <div className="mesa-empty" style={{ padding: '3rem 1rem' }}>
              Todavía no hay asignaturas.<br />Crea una en la vista <b>Hoy</b> y sus temas aparecerán aquí como pestañas ✍
            </div>
          )}
          {subj && !tp && (
            <div className="mesa-empty" style={{ padding: '3rem 1rem' }}>
              «{esc(subj.name)}» no tiene temas todavía.<br />Presiona <b>+ Tema</b> para crear la primera pestaña ✍
            </div>
          )}
          {tp && !pg && (
            <div className="mesa-empty" style={{ padding: '3rem 1rem' }}>
              «{esc(tp.name)}» no tiene subtemas todavía.<br />Presiona <b>+ Subtema</b> para escribir tu primer apunte ✍
            </div>
          )}
          {tp && pg && (
            <div className="nb-editor" key={pg.id + mode}>
              <div className="nb-editor-head">
                <input
                  ref={titleRef}
                  id="nbPageTitle"
                  maxLength={60}
                  defaultValue={pg.name}
                  placeholder="Nombre del subtema…"
                  aria-label="Nombre del subtema"
                  onChange={scheduleSave}
                />
                <div className="nb-mode-seg" role="group" aria-label="Modo de escritura">
                  <button className={'nb-mode-btn ' + (mode === 'w' ? 'active' : '')} type="button" title="Escribir normal, como en Word (Ctrl+B negrita, Ctrl+I cursiva, Ctrl+U subrayado)" onClick={() => changeMode('w')}>✏ Normal</button>
                  <button className={'nb-mode-btn ' + (mode === 'md' ? 'active' : '')} type="button" title="Escribir con sintaxis Markdown (#, **, -, [x])" onClick={() => changeMode('md')}># Markdown</button>
                </div>
                <div className="head-actions">
                  <button className="btn btn-mini" title="Descargar esta página como .md" onClick={exportMd}>⬇ .md</button>
                  <button className="btn btn-mini" title="Duplicar esta página" onClick={dupPage}>⧉</button>
                  <button className="btn btn-mini" title="Borrar esta página" onClick={delPage}>🗑</button>
                </div>
              </div>
              <div className="nb-toolbar">
                {NB_TOOLS.map(x => (
                  <button key={x.id} className="nb-tool" title={x.h} type="button" onClick={() => onTool(x)}>{x.lbl}</button>
                ))}
              </div>
              <div className={'nb-panes ' + (mode === 'w' ? 'wys' : 'split')}>
                {mode === 'w' && (
                  <div
                    ref={wysRef}
                    className="nb-wysiwyg"
                    contentEditable
                    role="textbox"
                    aria-multiline="true"
                    spellCheck
                    dangerouslySetInnerHTML={wysInit ?? undefined}
                    onInput={onWysInput}
                    onPaste={onWysPaste}
                    onKeyDown={onWysKey}
                  />
                )}
                <textarea
                  ref={taRef}
                  className="nb-input"
                  hidden={mode === 'w'}
                  placeholder="Escribe tus apuntes aquí… Markdown: # Título, **negrita**, - listas, - [ ] tareas, ![alt](imagen), [texto](url)"
                  spellCheck={false}
                  defaultValue={pg.md}
                  onInput={onTaInput}
                  onKeyDown={onTaKey}
                />
                <div className="nb-preview" hidden={mode === 'w'} aria-label="Vista previa" dangerouslySetInnerHTML={{ __html: preview }} />
              </div>
              <div className="nb-foot">
                <span>{words} palabra{words === 1 ? '' : 's'}</span>
                <span id="nbSaved" className={savedWarn ? 'warn' : ''}>{savedText}</span>
                <span>{updatedAtText}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
    </section>
  );
}
