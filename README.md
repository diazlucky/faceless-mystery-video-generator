# 🎬 Faceless Mystery Video Generator

Aplikasi web otomatisasi pembuatan video vertikal **9:16** (60–90 detik) khusus niche misteri, konspirasi, dan sejarah tersembunyi yang berjalan lokal di Mac M1.

Aplikasi ini menggunakan **Motion Graphic murni berbasis React / HTML / CSS / SVG** melalui **Remotion** tanpa memerlukan generate gambar AI.

---

## ⚡ Fitur Utama

1. **Topik ke Naskah Otomatis (LLM 9router):** Menghasilkan naskah berkecepatan tinggi bergaya *Casual US English* yang dipecah menjadi 8–14 segmen terstruktur (JSON).
2. **Review Naskah & Segmen Interaktif:** Tabel Tailwind untuk meninjau dan mengedit tipe visual, headline, naskah narasi, dan durasi per segmen secara *real-time*.
3. **4 Template Motion Pure HTML/CSS/SVG (No AI Images):**
   * ⚡ **`KineticText`**: Animasi teks putih tebal berkecepatan tinggi kata-per-kata di atas latar gelap beraksen misteri.
   * 📰 **`Newspaper`**: Tata letak koran kuno warna *parchment* dengan animasi coretan stabilo kuning (*highlighter wipe*).
   * 💻 **`TerminalDOS`**: Layar CRT hacker hitam-hijau dengan efek ketikan real-time dan kotak peringatan merah *"ACCESS DENIED"* yang bergetar (*CSS shake*).
   * 📡 **`RadarGrid`**: Latar grid cyber sci-fi, scanner radar berputar berbasis SVG, dan telemetri koordinat dinamis.
4. **Sinkronisasi Voice Over (VO):** Unggah file audio VO (`.mp3` atau `.wav`) langsung disinkronkan ke video.
5. **Real-time Remotion Player:** Pratinjau langsung komposisi video vertikal 9:16 (1080x1920) langsung di browser.
6. **Ekspor MP4 Server-Side:** Render langsung menjadi file MP4 via `@remotion/renderer` menggunakan akselerasi Apple Silicon Mac M1.

---

## 🛠️ Tech Stack

* **Frontend & Backend:** Next.js 14 (App Router, TypeScript)
* **Video Engine:** Remotion (`@remotion/player`, `@remotion/bundler`, `@remotion/renderer`)
* **Styling:** Tailwind CSS & Lucide React
* **AI Integration:** OpenAI Node.js SDK (koneksi ke 9router / custom base URL)

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Konfigurasi Environment (`.env.local`)
Buka file `.env.local` dan masukkan API Key 9router Anda:

```env
LLM_API_KEY=your_actual_9router_api_key_here
LLM_BASE_URL=https://api.9router.com/v1
LLM_MODEL=gpt-4o-mini
```

### 2. Jalankan Development Server
```bash
npm run dev
```

Buka browser di: [http://localhost:3000](http://localhost:3000)

### 3. Alur Penggunaan
1. **Input Topik:** Masukkan judul/ide misteri (atau pilih dari ide topik cepat) lalu klik **Generate Script**.
2. **Review Naskah:** Sesuaikan tipe visual per segmen, edit naskah, atau atur durasi pada tabel interaktif.
3. **Unggah Voice Over:** Masukkan file audio `.mp3` atau `.wav`.
4. **Preview Video:** Tonton sinkronisasi visual dan audio di Remotion Player.
5. **Render MP4:** Klik **Render MP4 Sekarang** untuk mengekspor video resolusi tinggi 1080x1920. File MP4 akan siap diunduh dalam hitungan detik.

---

## 📂 Struktur Direktori Proyek

```
├── public/
│   ├── renders/                # Hasil ekspor video MP4
│   └── uploads/                # File audio VO yang diunggah
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/       # Endpoint LLM (9router)
│   │   │   ├── render/         # Endpoint Remotion Server-side MP4 Render
│   │   │   └── upload-audio/   # Endpoint upload file audio VO
│   │   ├── globals.css         # Styling global & tema dark mystery
│   │   ├── layout.tsx          # Root Layout
│   │   └── page.tsx            # Dashboard Studio Utama
│   ├── components/
│   │   ├── Header.tsx          # Top bar dashboard
│   │   ├── ScriptInput.tsx     # Step 1: Input topik misteri
│   │   ├── ScriptTable.tsx     # Step 2: Tabel review & editor segmen
│   │   ├── AudioUploader.tsx   # Step 3: Uploader file audio VO
│   │   ├── VideoPreview.tsx    # Step 4: Remotion Player 9:16
│   │   └── ExportButton.tsx    # Step 5: Tombol Render MP4 & download
│   ├── lib/
│   │   ├── types.ts            # Definisi TypeScript
│   │   └── utils.ts            # Helper function
│   └── remotion/
│       ├── components/
│       │   ├── KineticText.tsx # Template visual 1
│       │   ├── Newspaper.tsx   # Template visual 2
│       │   ├── TerminalDOS.tsx # Template visual 3
│       │   └── RadarGrid.tsx   # Template visual 4
│       ├── entry.ts            # Bundler entry point
│       ├── Root.tsx            # Komposisi Remotion Root
│       └── VideoComposition.tsx# Sequencing & sinkronisasi audio
```

