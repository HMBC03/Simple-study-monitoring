'use client';

import { useBitacora } from '@/store/useBitacora';

export default function Toast() {
  const msg = useBitacora(s => s.toastMsg);
  return (
    <div id="toast" role="status" aria-live="polite" className={msg ? 'show' : ''}>
      {msg ?? ''}
    </div>
  );
}
