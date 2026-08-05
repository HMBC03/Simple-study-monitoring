'use client';

import { useEffect } from 'react';
import { useBitacora } from '@/store/useBitacora';
import { calcStreak } from '@/lib/logic';
import type { View } from '@/lib/types';

const NAV: { id: View; label: string }[] = [
  { id: 'hoy', label: 'Today' },
  { id: 'mesa', label: 'Study desk' },
  { id: 'notebook', label: 'Notebook' },
  { id: 'historial', label: 'History' },
  { id: 'herr', label: 'Tools' },
  { id: 'guia', label: 'How it works' },
  { id: 'fuentes', label: 'Sources' },
];

export default function Topbar() {
  const view = useBitacora(s => s.currentView);
  const switchView = useBitacora(s => s.switchView);
  const navOpen = useBitacora(s => s.navOpen);
  const setNavOpen = useBitacora(s => s.setNavOpen);
  const openSettings = useBitacora(s => s.openSettings);
  const state = useBitacora(s => s.state);

  const streak = calcStreak(state);
  const date = new Date().toLocaleDateString('en', {
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
          <span className="star">✦</span> Study <em>log</em>
        </div>
        <button
          className="burger"
          aria-label="Open menu"
          aria-expanded={navOpen}
          aria-controls="mainNav"
          title="Menu"
          onClick={e => { e.stopPropagation(); setNavOpen(!navOpen); }}
        >
          ☰
        </button>
        <nav className={'nav' + (navOpen ? ' open' : '')} id="mainNav" aria-label="Views">
          {NAV.map(n => (
            <button
              key={n.id}
              className={view === n.id ? 'active' : ''}
              onClick={() => switchView(n.id)}
            >
              {n.label}
            </button>
          ))}
          <button id="navSettings" title="Reviews, steps and weekly goal" onClick={openSettings}>
            ⚙ Settings
          </button>
        </nav>
        <div className="top-right">
          <span className="nav-date" id="navDate">{date}</span>
          <span className="streak-badge" title="Days studied in a row">
            <svg width="13" height="15" viewBox="0 0 13 15" fill="none" aria-hidden="true">
              <path d="M6.5 0C7 3 10 4.2 10.8 7a4.4 4.4 0 1 1-8.6.4C2.6 4.6 5.8 3.4 6.5 0Z" fill="#C8471F" />
              <path d="M6.4 7.2c.3 1.5 1.7 2 2 3.4a2.1 2.1 0 1 1-4.2.2c.2-1.4 1.8-2 2.2-3.6Z" fill="#F3EEE2" />
            </svg>
            <span id="streakTxt">{streak > 0 ? streak + ' days' : 'today counts!'}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
