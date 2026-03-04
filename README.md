# ppwl5-latihan Refactor

cara pakai:
1. Setup **db.sql**
2. Jalankan:
```bash
bun install
bun --watch index.ts
```

## Issue
1. 📁 Struktur Kacau: Semua logic ada di satu file (`index.ts`). Lokasi file tidak diletakkan di `src/`.
```
index.ts
db.ts
```
2. Tailwind belum di build ke `public/css/style.css`.
3. File `.env` (secret) & `database.sqlite` (development cache) ter-ekspos di repo. 