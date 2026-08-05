'use client';

import { useEffect, useRef } from 'react';
import { useBitacora } from '@/store/useBitacora';

export default function Modal() {
  const modal = useBitacora(s => s.modal);
  const resolveModal = useBitacora(s => s.resolveModal);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      resolveModal(modal.inputValue !== null && modal.inputValue !== undefined ? null : false);
    };
    document.addEventListener('keydown', onKey, true);
    setTimeout(() => {
      if (modal.inputValue !== null && modal.inputValue !== undefined) {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }, 40);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [modal, resolveModal]);

  if (!modal) return null;
  const hasInput = modal.inputValue !== null && modal.inputValue !== undefined;

  return (
    <div
      className="veil"
      onClick={e => {
        if (e.target === e.currentTarget) resolveModal(hasInput ? null : false);
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <h3 id="modalTitle">{modal.title}</h3>
        <p className="m-msg" dangerouslySetInnerHTML={{ __html: modal.msg || '' }} />
        {hasInput && (
          <input
            ref={inputRef}
            type="text"
            id="modalInput"
            defaultValue={String(modal.inputValue ?? '')}
            onKeyDown={e => {
              if (e.key === 'Enter') resolveModal(e.currentTarget.value.trim());
            }}
          />
        )}
        <div className="modal-btns">
          {modal.showCancel !== false && (
            <button className="btn" onClick={() => resolveModal(hasInput ? null : false)}>
              Cancelar
            </button>
          )}
          <button
            className={'btn btn-primary' + (modal.danger ? ' btn-danger' : '')}
            style={{ flex: 'none' }}
            onClick={() => {
              const v = hasInput ? (inputRef.current?.value.trim() ?? '') : true;
              resolveModal(v);
            }}
          >
            {modal.okText || 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
}
