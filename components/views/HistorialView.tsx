'use client';

import { useEffect, useRef, useState } from 'react';
import { useBitacora } from '@/store/useBitacora';
import { informeMd, key, logHTML } from '@/lib/logic';
import { exportBackupV5, importBackup } from '@/lib/storage';
import { download } from '@/lib/ui';

export default function HistorialView() {
  const state = useBitacora(s => s.state);
  const deleteEntry = useBitacora(s => s.deleteEntry);
  const toast = useBitacora(s => s.toast);
  const openModal = useBitacora(s => s.openModal);
  const fileRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const [usage, setUsage] = useState<string | null>(null);
  const { total, html } = logHTML(state);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        if (!navigator.storage?.estimate) return;
        const est = await navigator.storage.estimate();
        if (!alive || !est.quota) return;
        const mb = (n: number) => (n / 1048576).toFixed(1).replace('.', ',');
        setUsage(`Local usage: ${mb(est.usage ?? 0)} MB of ${mb(est.quota)} MB`);
      } catch { /* ignorar */ }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    const onClick = (e: MouseEvent) => {
      const d = (e.target as HTMLElement).closest('[data-del-entry]');
      if (!d) return;
      void openModal({
        title: 'Delete session',
        msg: 'Delete this entry from the history?',
        okText: 'Delete', danger: true,
      }).then(ok => { if (ok) deleteEntry(d.getAttribute('data-del-entry')!); });
    };
    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  }, [deleteEntry, openModal]);

  return (
    <section data-view="historial">
      <div className="view-top">
        <div>
          <p className="eyebrow">Your whole journey</p>
          <h1 className="view-title">History</h1>
          <p className="view-sub">Every logged session, including those archived when you reset a topic.</p>
        </div>
        <div className="head-actions">
          <button
            className="btn btn-tiny"
            onClick={async () => {
              toast('Preparing backup…');
              const json = await exportBackupV5(state);
              download(`study-log-${key(new Date())}.json`, json, 'application/json');
              toast('Backup downloaded ⬇ Keep it to restore in another browser.');
            }}
          >
            ⬇ Backup .json
          </button>
          <button
            className="btn btn-tiny"
            onClick={() => {
              download(`study-log-report-${key(new Date())}.md`, informeMd(state), 'text/markdown');
              toast('Report .md downloaded 📓');
            }}
          >
            ⬇ Report .md
          </button>
          <button className="btn btn-tiny" onClick={() => fileRef.current?.click()}>⬆ Restore</button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={async e => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (!f) return;
              try {
                const text = await f.text();
                const st = await importBackup(text);
                const ok = await openModal({
                  title: 'Restore backup',
                  msg: 'This will <b>replace</b> your current data with the file. Continue?',
                  okText: 'Restore',
                });
                if (!ok) return;
                useBitacora.getState().mut(s => {
                  Object.assign(s, st);
                  normalizeInPlace(s);
                });
                useBitacora.getState().selectTopic(null);
                useBitacora.getState().setNavOpen(false);
                void (await import('@/lib/storage')).persist(st);
                toast(`Backup restored ✓ ${st.subjects.length} subjects, ${st.topics.length} topics.`);
              } catch {
                toast('Invalid file ✕ The backup format was not recognized.');
              }
            }}
          />
        </div>
      </div>
      <div className="card">
        <div className="warn-box">
          ⚠️ <b>Your data lives only in this browser.</b> If you clear the cache or switch devices, download the{' '}
          <b>Backup .json</b> first and restore it with <b>⬆ Restore</b>.
        </div>
        {usage && <p className="head-note" style={{ textAlign: 'left', marginBottom: '.5rem' }}>{usage}</p>}
        <p className="head-note" style={{ textAlign: 'left', marginBottom: '.5rem' }}>{total}</p>
        <div className="scroll" id="logList" ref={logRef} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </section>
  );
}

function normalizeInPlace(s: Record<string, unknown>) {
  // los campos esenciales ya vienen normalizados por importBackup; esto evita `undefined` residuales
  if (typeof s.name !== 'string') s.name = '';
}
