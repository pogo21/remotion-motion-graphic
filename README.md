# Remotion Motion Graphic

Aplikasi motion graphic studio berbasis Next.js + Remotion.

## Prasyarat

- **Node.js** 18+ — [download](https://nodejs.org)
- **Git** — [download](https://git-scm.com)
- **FFmpeg** — untuk render video

  ```bash
  # Windows (winget)
  winget install ffmpeg

  # atau download manual dari https://ffmpeg.org
  ```

## Instalasi

```bash
git clone https://github.com/pogo21/remotion-motion-graphic.git
cd remotion-motion-graphic/remotion-motion-graphic
npm install
npm run dev
```

Buka **http://localhost:3000** di browser.

## Scripts

| Perintah | Keterangan |
|---|---|
| `npm run dev` | Jalankan development server |
| `npm run remotion:studio` | Buka Remotion Studio |
| `npm run remotion:render` | Render video |
| `npm run build` | Build Next.js |

## Struktur

```
remotion-motion-graphic/
├── src/
│   ├── pages/          # Halaman Next.js & API routes
│   ├── remotion/        # Komponen Remotion (motion graphic)
│   └── styles/         # Global CSS (Tailwind)
├── public/             # Static assets
├── scripts/            # Render worker scripts
├── remotion.config.ts  # Konfigurasi Remotion
└── run.bat             # Shortcut langsung (double-click)
```
