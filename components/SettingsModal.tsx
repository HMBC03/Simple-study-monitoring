'use client';

import { useState } from 'react';
import { useBitacora } from '@/store/useBitacora';
import { DEFAULT_STEPS, IV } from '@/lib/constants';

export default function SettingsModal() {
  const open = useBitacora(s => s.settingsOpen);
  if (!open) return null;
  return <SettingsBody />;
}

function SettingsBody() {
  const state = useBitacora(s => s.state);
  const closeSettings = useBitacora(s => s.closeSettings);
  const saveSettings = useBitacora(s => s.saveSettings);
  const toast = useBitacora(s => s.toast);

  const [iv, setIv] = useState(() => [...state.ivActive]);
  const [steps, setSteps] = useState(() => state.steps.map(s => ({ ...s })));
  const [stepsOn, setStepsOn] = useState(() => state.stepsOn);
  const [goal, setGoal] = useState(() => state.weeklyGoal);

  const editStep = (i: number, val: string) => setSteps(prev => prev.map((s, j) => (j === i ? { ...s, t: val } : s)));
  const delStep = (i: number) => setSteps(prev => prev.filter((_, j) => j !== i));

  return (
    <div className="veil" style={{ display: 'flex' }} onClick={() => closeSettings()}>
      <div className="modal wide" role="dialog" aria-modal="true" aria-labelledby="setTitle" onClick={e => e.stopPropagation()}>
        <h3 id="setTitle">⚙ Personaliza tu bitácora</h3>
        <div className="set-body">
          <div className="set-sec">
            <p className="set-title">Repasos espaciados</p>
            <p className="set-note">Activa los intervalos que quieras usar.</p>
            <div className="iv-chips">
              {IV.map((d, i) => (
                <button
                  key={i}
                  className={`iv-chip ${iv[i] ? 'active' : ''}`}
                  type="button"
                  aria-pressed={!!iv[i]}
                  onClick={() => setIv(prev => prev.map((v, j) => (j === i ? !v : v)))}
                >
                  {d} {d === 1 ? 'día' : 'días'}
                </button>
              ))}
            </div>
          </div>
          <div className="set-sec">
            <p className="set-title">Pasos de tu sesión</p>
            <label className="set-toggle">
              <input type="checkbox" checked={stepsOn} onChange={e => setStepsOn(e.target.checked)} />
              Usar checklist antes de guardar cada sesión
            </label>
            <div className={stepsOn ? '' : 'steps-off'}>
              {steps.map((s, i) => (
                <div className="step-edit" key={i}>
                  <span className="se-n">{i + 1}</span>
                  <input
                    data-step={i}
                    value={s.t}
                    maxLength={70}
                    placeholder={`Paso ${i + 1}…`}
                    aria-label={`Paso ${i + 1}`}
                    onChange={e => editStep(i, e.target.value)}
                  />
                  <button className="del" style={{ opacity: 1 }} title="Quitar paso" type="button" onClick={() => delStep(i)}>×</button>
                </div>
              ))}
              <div className="set-links">
                <button className="link-btn" type="button" onClick={() => setSteps(prev => [...prev, { t: '', s: '' }])}>+ Añadir paso</button>
                <button className="link-btn" type="button" onClick={() => setSteps(DEFAULT_STEPS.map(s => ({ ...s })))}>Restaurar plantilla de ejemplo</button>
              </div>
            </div>
          </div>
          <div className="set-sec">
            <p className="set-title">Meta semanal</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="number" min={1} max={168} step={0.5}
                style={{ width: 90 }} value={goal}
                aria-label="Meta semanal en horas"
                onChange={e => setGoal(Number(e.target.value))}
              /> <span style={{ fontSize: '.85rem' }}>horas por semana</span>
            </div>
          </div>
        </div>
        <div className="modal-btns">
          <button className="btn" onClick={() => closeSettings()}>Cancelar</button>
          <button
            className="btn btn-primary" style={{ flex: 'none' }}
            onClick={() => {
              saveSettings(iv, steps.map(s => ({ t: s.t.trim(), s: s.s || '' })).filter(s => s.t), stepsOn, goal);
              closeSettings();
              toast('Ajustes guardados ✓');
            }}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}



