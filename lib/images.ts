import { putBlob } from '@/lib/storage';
import { uid } from '@/lib/logic';

const MAX = 1200;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('imagen inválida')); };
    img.src = url;
  });
}

function canvasToBlob(cv: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((res, rej) => cv.toBlob(b => b ? res(b) : rej(new Error('toBlob falló')), type, quality));
}

export async function shrinkImageFile(file: File): Promise<Blob> {
  const img = await loadImage(file);
  let w = img.width, h = img.height;
  const s = Math.min(1, MAX / w, MAX / h);
  if (s < 1) { w = Math.round(w * s); h = Math.round(h * s); }
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  cv.getContext('2d')!.drawImage(img, 0, 0, w, h);
  try { return await canvasToBlob(cv, 'image/webp', 0.75); } catch { /* fallback */ }
  return canvasToBlob(cv, 'image/jpeg', 0.75);
}

export async function saveImageBlob(blob: Blob): Promise<string> {
  const id = 'img' + uid();
  await putBlob(id, blob);
  return id;
}

/* Registro objectURL → id de blob (para el modo WYSIWYG: domToMd resuelve el src) */
const urlToId = new Map<string, string>();

export function registerObjectURL(url: string, id: string) {
  urlToId.set(url, id);
}
export function idFromObjectURL(url: string): string | null {
  return urlToId.get(url) ?? null;
}
