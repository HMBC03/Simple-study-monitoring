'use client';

import { useEffect } from 'react';
import { useBitacora } from '@/store/useBitacora';
import Topbar from '@/components/Topbar';
import HoyView from '@/components/views/HoyView';
import MesaView from '@/components/views/MesaView';
import NotebookView from '@/components/views/NotebookView';
import HistorialView from '@/components/views/HistorialView';
import HerramientasView from '@/components/views/HerramientasView';
import GuiaView from '@/components/views/GuiaView';
import FuentesView from '@/components/views/FuentesView';
import FocusOverlay from '@/components/pomodoro/FocusOverlay';
import SettingsModal from '@/components/SettingsModal';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';

export default function BitacoraApp() {
  const ready = useBitacora(s => s.ready);
  const currentView = useBitacora(s => s.currentView);
  const init = useBitacora(s => s.init);
  const toast = useBitacora(s => s.toast);
  const openModal = useBitacora(s => s.openModal);
  const demo = useBitacora(s => s.demo);
  const wipe = useBitacora(s => s.wipe);

  useEffect(() => {
    void init();
  }, [init]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => document.body.classList.add('in'));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!ready) {
    return (
      <div className="wrap" style={{ paddingTop: '5rem', textAlign: 'center', color: 'var(--ink2)' }}>
        Loading your study log…
      </div>
    );
  }

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Topbar />
      <main className="wrap">
        {currentView === 'hoy' && <HoyView />}
        {currentView === 'mesa' && <MesaView />}
        {currentView === 'notebook' && <NotebookView />}
        {currentView === 'historial' && <HistorialView />}
        {currentView === 'herr' && <HerramientasView />}
        {currentView === 'guia' && <GuiaView />}
        {currentView === 'fuentes' && <FuentesView />}
      </main>
      <footer>
        <span>✦ Spaced repetition and the Feynman technique: free study methods.</span>
        <span>
          <button
            className="link-btn"
            onClick={async () => {
              const ok = await openModal({
                title: 'Reset demo',
                msg: 'Your current data will be replaced with the sample data.',
                okText: 'Reset', danger: true,
              });
              if (!ok) return;
              await demo();
              toast('Demo reset');
            }}
          >
            Reset demo
          </button>
          {' · '}
          <button
            className="btn btn-primary"
            onClick={async () => {
              const ok = await openModal({
                title: 'Start fresh',
                msg: 'The sample topics will be removed and a blank notebook will be started for you to create your own.',
                okText: 'Start', danger: true,
              });
              if (!ok) return;
              await wipe();
              toast('Blank canvas ✦');
            }}
          >
            Start fresh
          </button>
        </span>
      </footer>
      <FocusOverlay />
      <SettingsModal />
      <Modal />
      <Toast />
    </>
  );
}
