import { create } from 'zustand';
import { DEFAULT_STEPS } from '@/lib/constants';
import { key, normalizeState, seed, uid } from '@/lib/logic';
import { loadInitialState, persist, requestPersistentStorage } from '@/lib/storage';
import type { State, View } from '@/lib/types';
import { RM } from '@/lib/ui';

export type ModalOptions = {
  title: string;
  msg?: string;
  inputValue?: string | null;
  okText?: string;
  danger?: boolean;
  showCancel?: boolean;
};

type ModalState = ModalOptions & { resolve: (v: string | boolean | null) => void };

type BitacoraStore = {
  state: State;
  ready: boolean;
  currentView: View;
  selectedTopicId: string | null;
  collapsed: Set<string>;
  navOpen: boolean;
  modal: ModalState | null;
  toastMsg: string | null;
  focusVisible: boolean;
  soundOn: boolean;
  pomoSubjectId: string | null;
  pomoTopicId: string | null;
  pendingStep: number | null;
  pomoTick: number;
  settingsOpen: boolean;

  mut: (fn: (s: State) => void) => void;
  commit: (fn: (s: State) => void) => void;
  init: () => Promise<void>;
  switchView: (v: View) => void;
  toast: (msg: string) => void;
  openModal: (o: ModalOptions) => Promise<string | boolean | null>;
  resolveModal: (v: string | boolean | null) => void;
  setNavOpen: (b: boolean) => void;
  toggleCollapsed: (id: string) => void;
  openSubject: (id: string) => void;
  selectTopic: (id: string | null) => void;
  openSettings: () => void;
  closeSettings: () => void;
  setFocusVisible: (b: boolean) => void;
  setSoundOn: (b: boolean) => void;
  setPomoSelection: (subjId: string | null, topicId: string | null, stepIdx?: number | null) => void;
  bumpPomoTick: () => void;
  updateName: (name: string) => void;
  saveSession: (topicId: string, minutes: number, note: string, steps: boolean[]) => void;
  resetTopic: (topicId: string) => void;
  deleteTopic: (topicId: string) => void;
  deleteSubject: (subjectId: string) => void;
  deleteEntry: (sel: string) => void;
  saveSettings: (iv: boolean[], steps: { t: string; s: string }[], stepsOn: boolean, goal: number) => void;
  wipe: () => Promise<void>;
  demo: () => Promise<void>;
};

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useBitacora = create<BitacoraStore>()((set, get) => ({
  state: seed(),
  ready: false,
  currentView: 'hoy',
  selectedTopicId: null,
  collapsed: new Set<string>(),
  navOpen: false,
  modal: null,
  toastMsg: null,
  focusVisible: false,
  soundOn: true,
  pomoSubjectId: null,
  pomoTopicId: null,
  pendingStep: null,
  pomoTick: 0,
  settingsOpen: false,

  mut: fn => set(s => { fn(s.state); return { ...s, state: { ...s.state } }; }),

  commit: fn => {
    get().mut(fn);
    void persist(get().state);
  },

  init: async () => {
    if (get().ready) return;
    const st = await loadInitialState();
    void requestPersistentStorage();
    set(s => ({ ...s, state: st, ready: true, collapsed: new Set(st.subjects.map(x => x.id)) }));
    if (st.subjects.length > 0 && !localStorage.getItem('hbAlertSeen')) {
      localStorage.setItem('hbAlertSeen', '1');
      void get().openModal({
        title: '✨ This is sample data',
        msg: 'Once you understand it, press <b>Start fresh</b> (below) and the data will be reset so you can create your own topics.',
        okText: 'Got it', showCancel: false,
      });
    }
  },

  switchView: v => {
    set(s => ({ ...s, currentView: v, navOpen: false }));
    window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
  },

  toast: msg => {
    set(s => ({ ...s, toastMsg: msg }));
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set(s => ({ ...s, toastMsg: null })), 3200);
  },

  openModal: o => new Promise(res => set(s => ({ ...s, modal: { ...o, resolve: res } }))),

  resolveModal: v => {
    const m = get().modal;
    if (!m) return;
    set(s => ({ ...s, modal: null }));
    m.resolve(v);
  },

  setNavOpen: b => set(s => ({ ...s, navOpen: b })),
  toggleCollapsed: id => set(s => {
    const next = new Set(s.collapsed);
    if (next.has(id)) next.delete(id); else next.add(id);
    return { ...s, collapsed: next };
  }),
  openSubject: id => set(s => {
    if (!s.collapsed.has(id)) return s;
    const next = new Set(s.collapsed);
    next.delete(id);
    return { ...s, collapsed: next };
  }),
  selectTopic: id => set(s => ({ ...s, selectedTopicId: id })),
  openSettings: () => set(s => ({ ...s, settingsOpen: true })),
  closeSettings: () => set(s => ({ ...s, settingsOpen: false })),
  setFocusVisible: b => set(s => ({ ...s, focusVisible: b })),
  setSoundOn: b => set(s => ({ ...s, soundOn: b })),
  setPomoSelection: (subjId, topicId, stepIdx = null) =>
    set(s => ({ ...s, pomoSubjectId: subjId, pomoTopicId: topicId, pendingStep: stepIdx })),
  bumpPomoTick: () => set(s => ({ ...s, pomoTick: s.pomoTick + 1 })),

  updateName: name => get().commit(s => { s.name = name; }),

  saveSession: (topicId, minutes, note, steps) => {
    get().commit(s => {
      const tp = s.topics.find(t => t.id === topicId);
      if (!tp) return;
      const tk = key(new Date()), ex = tp.studies.find(x => x.date === tk);
      if (ex) {
        if (steps.length) ex.steps = ex.steps.map((v, i) => v || (steps[i] || false));
        ex.minutes += minutes;
        ex.note = note || ex.note;
        ex.ts = Date.now();
      } else {
        tp.studies.push({ ts: Date.now(), date: tk, minutes, steps, note });
      }
    });
  },

  resetTopic: topicId => get().commit(s => {
    const tp = s.topics.find(t => t.id === topicId);
    if (!tp) return;
    const sub = s.subjects.find(x => x.id === tp.subjectId);
    const old = tp.studies.map(x => ({ ...x, id: uid(), topic: tp.name, color: sub ? sub.color : '#8a8272', subName: sub ? sub.name : '—' }));
    s.archived = s.archived.concat(old);
    tp.studies = [];
  }),

  deleteTopic: topicId => {
    const st = get();
    st.commit(s => {
      s.topics = s.topics.filter(t => t.id !== topicId);
      if (s.lastNb.topicId === topicId) s.lastNb = { subjId: null, topicId: null, pageId: null, mode: s.lastNb.mode };
    });
    if (st.selectedTopicId === topicId) set(s => ({ ...s, selectedTopicId: null }));
  },

  deleteSubject: subjectId => {
    const st = get();
    st.commit(s => {
      s.topics = s.topics.filter(t => t.subjectId !== subjectId);
      s.subjects = s.subjects.filter(x => x.id !== subjectId);
      if (s.lastNb && !s.subjects.some(x => x.id === s.lastNb.subjId)) s.lastNb = { subjId: null, topicId: null, pageId: null, mode: s.lastNb.mode };
    });
    const c = new Set(st.collapsed); c.delete(subjectId);
    set(s => ({ ...s, collapsed: c }));
    if (st.selectedTopicId && !get().state.topics.find(t => t.id === st.selectedTopicId)) {
      set(s => ({ ...s, selectedTopicId: null }));
    }
  },

  deleteEntry: sel => get().commit(s => {
    const p = sel.split(':');
    if (p[0] === 't') {
      const tp = s.topics.find(t => t.id === p[1]);
      if (tp) tp.studies = tp.studies.filter(x => String(x.ts) !== p[2]);
    } else if (p[0] === 'a') {
      s.archived = s.archived.filter(a => a.id !== sel.slice(2));
    } else {
      s.loose = s.loose.filter(l => l.id !== sel.slice(2));
    }
  }),

  saveSettings: (iv, steps, stepsOn, goal) => get().commit(s => {
    s.ivActive = iv;
    s.steps = steps.map(x => ({ t: (x.t || '').trim(), s: x.s || '' })).filter(x => x.t);
    s.stepsOn = stepsOn && s.steps.length > 0;
    if (goal > 0 && goal <= 168) s.weeklyGoal = Math.round(goal * 10) / 10;
  }),

  wipe: async () => {
    const nm = get().state.name;
    const st: State = {
      name: nm, weeklyGoal: 20, pomodoros: 0,
      ivActive: [true, true, true, true, true], stepsOn: true,
      steps: DEFAULT_STEPS.map(s => ({ ...s })),
      subjects: [], topics: [], loose: [], archived: [],
      lastNb: { subjId: null, topicId: null, pageId: null, mode: 'w' },
    };
    set(s => ({ ...s, state: st, selectedTopicId: null }));
    await persist(st);
  },

  demo: async () => {
    const st = normalizeState(seed());
    set(s => ({ ...s, state: st, selectedTopicId: null, collapsed: new Set(st.subjects.map(x => x.id)) }));
    await persist(st);
  },
}));
