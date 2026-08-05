# Study Bitácora (Study Log)

A web app to track your learning performance, use the Pomodoro technique and boost your studying. It works as a personal study notebook: you keep your subjects and topics, log every study session, and the app tells you when to review so you never forget what you've learned.

It is based on the **forgetting curve** (Ebbinghaus) and **spaced repetition** (1 · 3 · 7 · 15 · 30 days), together with the **Feynman technique** to validate what you truly master.

## What it does

- Tracks your **subjects** and **topics** with their status: New, due for review, overdue or Mastered.
- Estimates your **retention** (%) and schedules the next review for each topic.
- Built-in **Pomodoro** with fullscreen focus mode, 15 · 25 · 50 min durations and soft sounds.
- Customizable **session steps** checklist (reading, exercises, Feynman technique…).
- **Notebook** with subtopics per topic, a Word-like editor or Markdown with live preview and images (stored locally).
- Daily and weekly statistics, study streak and a complete session **history**.
- Downloadable **backup** (.json) and report (.md) to carry your data to any browser.

## Sections

| View | Description |
|---|---|
| **Today** | Greeting, day summary, due reviews, pomodoro, weekly goal and subject/topic management. |
| **Study desk** | Detailed forgetting-curve chart of the selected topic, per-step pomodoros and session logging. |
| **Notebook** | Notes by subject → topic → subtopic, in Normal or Markdown mode, with images and autosave. |
| **History** | Every logged session, storage usage and backup/restore. |
| **Tools** | A curated selection of study tools (NotebookLM, Anki, Obsidian…). |
| **How it works** | The method explained: forgetting curve, review threshold and spaced intervals. |
| **Sources** | APA references behind the method. |

## Privacy & storage

Everything lives **exclusively in your browser** (IndexedDB): no servers, no accounts. This allows notebook images without hitting the localStorage limit. Download the **.json Backup** regularly: if you clear browsing data or switch devices, the data doesn't travel on its own.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Zustand](https://zustand.docs.pmnd.rs) for state
- [idb](https://github.com/jakearchibald/idb) for IndexedDB
- No UI libraries: custom styles, focus mode and `prefers-reduced-motion` supported

> Project created and developed with AI model assistance: **Qwen** and **DeepSeek**.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production:

```bash
npm run build
npm run start
```

The app is fully static on the client, so it can be deployed to any static host or Vercel/Netlify.
