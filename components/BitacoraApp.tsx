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
        Cargando tu bitácora…
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
        <span>✦ Repaso espaciado y método Feynman: técnicas de estudio libres.</span>
        <span>
          <button
            className="link-btn"
            onClick={async () => {
              const ok = await openModal({
                title: 'Restablecer demo',
                msg: 'Se reemplazarán tus datos actuales por los de ejemplo.',
                okText: 'Restablecer', danger: true,
              });
              if (!ok) return;
              await demo();
              toast('Demo restablecida');
            }}
          >
            Restablecer demo
          </button>
          {' · '}
          <button
            className="btn btn-primary"
            onClick={async () => {
              const ok = await openModal({
                title: 'Comenzar a usar',
                msg: 'Se eliminarán los temas de ejemplo y se iniciará un cuaderno en blanco para crear los tuyos.',
                okText: 'Comenzar', danger: true,
              });
              if (!ok) return;
              await wipe();
              toast('Lienzo en blanco ✦');
            }}
          >
            Comenzar a usar
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
