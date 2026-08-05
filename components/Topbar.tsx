'use client';

import { useEffect } from 'react';
import { useBitacora } from '@/store/useBitacora';
import { calcStreak } from '@/lib/logic';
import type { View } from '@/lib/types';

const NAV: { id: View; label: string }[] = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'mesa', label: 'Mesa de estudio' },
  { id: 'notebook', label: 'Cuaderno' },
  { id: 'historial', label: 'Historial' },
  { id: 'herr', label: 'Herramientas' },
  { id: 'guia', label: 'Cómo funciona' },
  { id: 'fuentes', label: 'Fuentes' },
];

export default function Topbar() {
  const view = useBitacora(s => s.currentView);
  const switchView = useBitacora(s => s.switchView);
  const navOpen = useBitacora(s => s.navOpen);
  const setNavOpen = useBitacora(s => s.setNavOpen);
  const openSettings = useBitacora(s => s.openSettings);
  const state = useBitacora(s => s.state);

  const streak = calcStreak(state);
  const date = new Date().toLocaleDateString('es-ES', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.topbar')) setNavOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [setNavOpen]);

  return (
    <header className="topbar">
      <div className="topbar-in">
        <div className="brand">
          <span className="star">✦</span> Bitácora <em>de estudio</em>
        </div>
        <button
          className="burger"
          aria-label="Abrir menú"
          aria-expanded={navOpen}
          aria-controls="mainNav"
          title="Menú"
          onClick={e => { e.stopPropagation(); setNavOpen(!navOpen); }}
        >
          ☰
        </button>
        <nav className={'nav' + (navOpen ? ' open' : '')} id="mainNav" aria-label="Vistas">
          {NAV.map(n => (
            <button
              key={n.id}
              className={view === n.id ? 'active' : ''}
              onClick={() => switchView(n.id)}
            >
              {n.label}
            </button>
          ))}
          <button id="navSettings" title="Repasos, pasos y meta" onClick={openSettings}>
            ⚙ Ajustes
          </button>
        </nav>
        <div className="top-right">
          <span className="nav-date" id="navDate">{date}</span>
          <span className="streak-badge" title="Días seguidos estudiando">
            <svg width="13" height="15" viewBox="0 0 13 15" fill="none" aria-hidden="true">
              <path d="M6.5 0C7 3 10 4.2 10.8 7a4.4 4.4 0 1 1-8.6.4C2.6 4.6 5.8 3.4 6.5 0Z" fill="#C8471F" />
              <path d="M6.4 7.2c.3 1.5 1.7 2 2 3.4a2.1 2.1 0 1 1-4.2.2c.2-1.4 1.8-2 2.2-3.6Z" fill="#F3EEE2" />
            </svg>
            <span id="streakTxt">{streak > 0 ? streak + ' días' : '¡hoy toca!'}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
