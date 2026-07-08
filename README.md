# Remotion Motion Graphic

Aplikasi motion graphic studio berbasis Next.js + Remotion. Buat dan render video motion graphic langsung dari browser.

---

## 1. Prasyarat (yang harus diinstall dulu)

### 1.1. Node.js 18+
Node.js dipake buat jalanin server dan npm (Node Package Manager).

- **Download:** https://nodejs.org (pilih versi LTS 18 atau 20)
- **Cek instalasi:** buka CMD/PowerShell, ketik:
  ```bash
  node --version
  npm --version
  ```
  Kalau muncul nomer versi (misal `v18.20.0`), berarti sukses.

### 1.2. Git
Git dipake buat clone/download repo dari GitHub.

- **Download:** https://git-scm.com/download/win
- **Instal:** next-next aja, default setting udah aman
- **Cek instalasi:** buka CMD/PowerShell, ketik:
  ```bash
  git --version
  ```

### 1.3. FFmpeg (opsional, tapi wajib kalau mau render video)
FFmpeg dipake Remotion buat nge-encode video hasil render.

**Cara 1 — via Winget (paling gampang):**
```bash
winget install ffmpeg
```

**Cara 2 — Manual:**
1. Buka https://ffmpeg.org/download.html
2. Klik **Windows** → pilih **ffmpeg-release-full.7z**
3. Extract isinya ke `C:\ffmpeg`
4. Tambahin `C:\ffmpeg\bin` ke PATH Environment Variable:
   - Klik kanan **This PC** → **Properties** → **Advanced system settings**
   - Klik **Environment Variables**
   - Di **System variables**, cari `Path`, klik **Edit** → **New**
   - Tambahin `C:\ffmpeg\bin`
   - Klik OK semua
5. **Cek instalasi:**
   ```bash
   ffmpeg -version
   ```

---

## 2. Download Aplikasi

### 2.1. Clone repo dari GitHub
Buka CMD/PowerShell di folder mana kamu mau nyimpen project ini, lalu ketik:

```bash
git clone https://github.com/pogo21/remotion-motion-graphic.git
```

Ini bakal download semua file ke folder `remotion-motion-graphic`.

### 2.2. Masuk ke folder project
```bash
cd remotion-motion-graphic/remotion-motion-graphic
```

> **Catatan:** Di dalem folder `remotion-motion-graphic` hasil clone, ada folder `remotion-motion-graphic` lagi (itu isi project-nya). Makanya kita `cd` dua kali.

---

## 3. Install Dependencies

Jalanin perintah ini di folder project (setelah `cd` tadi):

```bash
npm install
```

Proses ini bakal download semua library yang dibutuhin (React, Next.js, Remotion, Tailwind, dll) ke folder `node_modules`. **Tunggu sampai selesai** — biasanya 1-3 menit tergantung koneksi.

---

## 4. Jalankan Aplikasi

### 4.1. Start development server
```bash
npm run dev
```

Kalo sukses, bakal muncul kira-kira gini di terminal:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

### 4.2. Buka di browser
Buka browser (Chrome/Edge/Firefox) dan akses:

**http://localhost:3000**

Aplikasi motion graphic studio siap dipake.

> **Mau langsung start?** Double-click file `run.bat` yang ada di folder `remotion-motion-graphic`, dia otomatis jalanin `npm run dev` dan buka browsernya.

---

## 5. Cara Make

| Fitur | Cara |
|---|---|
| **Buat motion graphic** | Ketik script/deskripsi di kolom input, klik tombol generate |
| **Preview** | Lihat hasil motion graphic di player |
| **Edit timeline** | Atur layer, timing, dan animasi di timeline |
| **Render video** | Klik tombol Render, tunggu proses render selesai, video bakal ke-download |

---

## 6. Scripts Lainnya

| Perintah | Keterangan |
|---|---|
| `npm run dev` | Jalankan development server (http://localhost:3000) |
| `npm run remotion:studio` | Buka Remotion Studio untuk preview & edit komposisi |
| `npm run remotion:render` | Render video via CLI |
| `npm run build` | Build production bundle Next.js |

---

## 7. Struktur Folder

```
remotion-motion-graphic/          # root project
├── src/
│   ├── pages/                    # Halaman-halaman web (Next.js)
│   │   ├── index.tsx             # Halaman utama
│   │   ├── _app.tsx              # App wrapper
│   │   └── api/                  # API endpoint (backend)
│   │       ├── render.ts         # Endpoint buat render video
│   │       ├── download.ts       # Endpoint buat download hasil render
│   │       ├── save-background.ts
│   │       └── reset-background.ts
│   ├── remotion/                 # Komponen-komponen Remotion
│   │   ├── index.ts              # Ekspor semua komposisi
│   │   ├── Root.tsx              # Root komposisi
│   │   ├── MotionGraphic.tsx     # Komponen utama motion graphic
│   │   ├── MotionLayer.tsx       # Layer animasi
│   │   ├── MotionBackground.tsx  # Background
│   │   ├── BackgroundDefault.tsx # Background default
│   │   └── script-formatter.ts   # Parser/Formatter script
│   ├── components/               # Komponen UI React
│   │   ├── AppContent.tsx        # Layout utama
│   │   ├── ScriptInput.tsx       # Input buat ngetik script
│   │   ├── PreviewPlayer.tsx     # Player buat preview
│   │   ├── TimelineEditor.tsx    # Editor timeline
│   │   └── RenderButton.tsx      # Tombol render
│   └── styles/
│       └── globals.css           # Global styles (Tailwind)
├── public/                       # File statis (gambar, dll)
├── scripts/                      # Script buat render di background
│   ├── render.mjs
│   └── render-worker.mjs
├── .next/                        # Build cache (auto-generated)
├── node_modules/                 # Library (auto-generated)
├── .remotion-cache/              # Cache Remotion
├── remotion.config.ts            # Konfigurasi Remotion
├── next.config.js                # Konfigurasi Next.js
├── tailwind.config.js            # Konfigurasi Tailwind CSS
├── tsconfig.json                 # Konfigurasi TypeScript
├── package.json                  # Dependencies & scripts
└── run.bat                      # Shortcut buat jalanin apps (double-click)
```
