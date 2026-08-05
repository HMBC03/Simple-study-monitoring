# Bitácora de Estudio

Una web para trackear tu rendimiento de aprendizaje, usar la técnica Pomodoro y potenciar el estudio. Está pensada como un cuaderno de trabajo personal: llevas tus asignaturas y temas, registras cada sesión de estudio y la aplicación te dice cuándo repasar para no olvidar lo aprendido.

Se basa en la **curva del olvido** (Ebbinghaus) y el **repaso espaciado** (1 · 3 · 7 · 15 · 30 días), junto con la técnica **Feynman** para validar lo que realmente dominas.

## Qué hace

- Registra tus **asignaturas** y **temas** con su estado: Nuevo, por repasar, vencido o Dominado.
- Calcula una **retención estimada** (%) y programa el próximo repaso de cada tema.
- **Pomodoro** integrado con modo foco a pantalla completa, duraciones de 15 · 25 · 50 min y sonidos suaves.
- Checklist de **pasos de sesión** personalizables (lectura, ejercicios, método Feynman…).
- **Cuaderno** con subtemas por tema, editor normal (como Word) o Markdown, con vista previa e imágenes (guardadas localmente).
- Estadísticas diarias y semanales, racha de estudio y **historial** completo de sesiones.
- **Backup** descargable (.json) e informe (.md) para llevar tus datos a cualquier navegador.

## Secciones

| Vista | Descripción |
|---|---|
| **Hoy** | Saludo, resumen del día, repasos programados, pomodoro, meta semanal y gestión de asignaturas y temas. |
| **Mesa de estudio** | Gráfico detallado de la curva del olvido del tema elegido, lanzar pomodoros por paso y guardar la sesión. |
| **Cuaderno** | Apuntes por asignatura → tema → subtema, en modo Normal o Markdown, con imágenes y guardado automático. |
| **Historial** | Todas las sesiones registradas, filtros, uso de almacenamiento y backup/restauración. |
| **Herramientas** | Selección de herramientas sugeridas para estudiar mejor (NotebookLM, Anki, Obsidian…). |
| **Cómo funciona** | Guía del método: curva del olvido, umbral de repaso e intervalos espaciados. |
| **Fuentes** | Referencias APA en las que se apoya el método. |

## Privacidad y almacenamiento

Todo vive **exclusivamente en tu navegador** (IndexedDB): no hay servidores ni cuentas. Esto permite guardar imágenes del cuaderno sin tocar el límite de localStorage. Descarga el **Backup .json** periódicamente: si borras los datos de navegación o cambias de equipo, los datos no viajan solos.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Zustand](https://zustand.docs.pmnd.rs) para el estado
- [idb](https://github.com/jakearchibald/idb) para IndexedDB
- Sin librerías de UI: estilos propios, modo foco y `prefers-reduced-motion` soportados

> Proyecto creado y desarrollado con asistencia de modelos de IA: **Qwen** y **DeepSeek**.

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Producción:

```bash
npm run build
npm run start
```

La app es 100% estática en el cliente, así que puede desplegarse en cualquier hosting estático o en Vercel/Netlify.
