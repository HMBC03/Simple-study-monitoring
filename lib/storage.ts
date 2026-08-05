import { openDB, type IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION, KEY_LEGACY, KEY_MIRROR } from '@/lib/constants';
import { normalizeState, seed } from '@/lib/logic';
import type { State } from '@/lib/types';

let dbPromise: Promise<IDBPDatabase> | null = null;

export function db() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(d) {
        if (!d.objectStoreNames.contains('state')) d.createObjectStore('state');
        if (!d.objectStoreNames.contains('blobs')) d.createObjectStore('blobs');
      },
    });
  }
  return dbPromise;
}

/* Escritura serializada: un solo escritor evita carreras del guardado async */
let writeQueue: Promise<unknown> = Promise.resolve();

export function persist(state: State): Promise<void> {
  writeQueue = writeQueue
    .then(async () => {
      await (await db()).put('state', state, 'main');
      try { localStorage.setItem(KEY_MIRROR, JSON.stringify(state)); } catch { /* mirror opcional */ }
    })
    .catch(err => console.error('persist error', err));
  return writeQueue.then(() => undefined);
}

export const flush = () => writeQueue;

export async function loadInitialState(): Promise<State> {
  let st: State | null = null;
  try {
    st = (await (await db()).get('state', 'main')) as State | null;
  } catch { st = null; }
  if (!st) {
    try {
      const raw = localStorage.getItem(KEY_MIRROR);
      if (raw) st = JSON.parse(raw) as State;
    } catch { st = null; }
  }
  if (!st) {
    const legacy = localStorage.getItem(KEY_LEGACY);
    if (legacy) {
      try {
        st = JSON.parse(legacy) as State;
        localStorage.removeItem(KEY_LEGACY);
      } catch { st = null; }
    }
  }
  if (!st) st = seed();
  normalizeState(st);
  await persist(st);
  return st;
}

export async function requestPersistentStorage(): Promise<void> {
  try {
    if (navigator.storage && navigator.storage.persist) {
      const granted = await navigator.storage.persist();
      console.info('Almacenamiento persistente concedido:', granted);
    }
  } catch { /* no soportado */ }
}

export async function storageEstimate(): Promise<{ usage: number; quota: number } | null> {
  try {
    if (!navigator.storage || !navigator.storage.estimate) return null;
    const est = await navigator.storage.estimate();
    return { usage: est.usage ?? 0, quota: est.quota ?? 0 };
  } catch { return null; }
}

/* ─── Blobs (imágenes del cuaderno) ─── */
export async function putBlob(id: string, blob: Blob): Promise<void> {
  await (await db()).put('blobs', blob, id);
}
export async function getBlob(id: string): Promise<Blob | undefined> {
  return (await (await db()).get('blobs', id)) as Blob | undefined;
}
export async function deleteBlob(id: string): Promise<void> {
  await (await db()).delete('blobs', id);
}
export async function blobIds(): Promise<string[]> {
  return (await (await db()).getAllKeys('blobs')) as string[];
}

export const blobRef = (id: string) => `blob:${id}`;
export const blobIdFromRef = (ref: string) => ref.startsWith('blob:') ? ref.slice(5) : null;

export function collectBlobRefs(md: string): string[] {
  const out: string[] = [];
  const re = /!\[[^\]]*\]\(blob:([^)\s]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) out.push(m[1]);
  return out;
}

export function collectDataUrlRefs(md: string): string[] {
  const out: string[] = [];
  const re = /!\[[^\]]*\]\(data:([^)\s]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) out.push(m[1]);
  return out;
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(r.error);
    r.readAsDataURL(blob);
  });
}

function dataURLToBlob(dataUrl: string): Promise<Blob> {
  return fetch(dataUrl).then(r => r.blob());
}

/* ─── Backup formato v5 ───
   Export: reemplaza refs blob:<id> por data URLs (el archivo queda autocontenido).
   Import: acepta v4 (data URLs) y v5; las data URLs de imágenes se convierten a blobs. */
export async function exportBackupV5(state: State): Promise<string> {
  const st = structuredClone(state);
  for (const tp of st.topics) {
    for (const n of tp.notes) {
      for (const id of collectBlobRefs(n.md)) {
        const blob = await getBlob(id);
        if (blob) {
          try { n.md = n.md.replace(`blob:${id}`, await blobToDataURL(blob)); } catch { /* se queda la ref */ }
        }
      }
    }
  }
  return JSON.stringify({ app: 'bitacora-olvido-v5', exportado: new Date().toISOString(), state: st }, null, 2);
}

export async function importBackup(text: string): Promise<State> {
  const obj = JSON.parse(text);
  const st = obj?.state || obj;
  if (!st || !Array.isArray(st.topics) || !Array.isArray(st.subjects)) {
    throw new Error('formato inválido');
  }
  normalizeState(st);
  for (const tp of st.topics) {
    for (const n of (tp.notes ?? [])) {
      for (const dataUrl of collectDataUrlRefs(n.md)) {
        try {
          const blob = await dataURLToBlob(dataUrl);
          const id = 'img' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
          await putBlob(id, blob);
          n.md = n.md.replace(dataUrl, blobRef(id));
        } catch { /* no convertible: se conserva la data URL */ }
      }
    }
  }
  return st;
}
