# Arsitektur Aplikasi POS dan AI Prediction (Terpisah)

## Tujuan

Memisahkan modul operasional kasir dari layanan AI prediksi agar:
- aplikasi POS tetap cepat, stabil, dan mudah digunakan
- flow buka shift / tutup shift tidak bergantung pada FastAPI
- model AI / forecasting bisa dikembangkan secara independen
- data dapat dipakai untuk analitik tanpa mengganggu operasi harian

---

## Prinsip Arsitektur

1. POS adalah sistem operasional utama.
2. AI adalah service tambahan, bukan core system.
3. Data menjadi penghubung antar modul.
4. Setiap transaksi dan shift harus terdokumentasi dengan jelas.
5. AI membaca data yang sudah jadi, tidak mengubah flow kasir.

---

## Struktur Sistem

### 1) POS App (Frontend / local app)
Bertanggung jawab atas:
- login kasir
- buka shift
- transaksi penjualan
- pembayaran tunai / non-tunai
- petty cash / cash out
- tutup shift
- rekap kas
- laporan harian sederhana

Teknologi yang bisa dipakai:
- Vite + React + TypeScript
- Supabase sebagai storage backend ringan
- local state untuk flow cepat

### 2) AI Service (FastAPI)
Bertanggung jawab atas:
- forecasting penjualan
- rekomendasi stok
- prediksi kebutuhan bahan baku
- insight tren produk
- alert stok kritis

Teknologi yang bisa dipakai:
- FastAPI
- Python
- scikit-learn / XGBoost / LightGBM / stats model

### 3) Data Layer (Shared)
Digunakan bersama oleh kedua sistem.
- Supabase PostgreSQL
- tabel transaksi
- tabel shift
- tabel cash movements
- tabel produk / stok / bahan baku

---

## Alur Operasional POS Tanpa FastAPI

### Buka Shift
1. Kasir login.
2. Sistem membuat record shift baru dengan status OPEN.
3. Kasir menginput starting_cash.
4. Sistem menyimpan nominal awal ke tabel shifts.
5. Shift siap dipakai untuk transaksi.

### Selama Shift Berjalan
- setiap transaksi otomatis tercatat
- setiap pembayaran disimpan dengan metode pembayaran
- cash_in / cash_out dicatat ke cash_movements
- laporan saldo kas bisa dihitung dari data transaksi

### Tutup Shift
1. Kasir menghitung uang fisik di laci.
2. Sistem menghitung expected_cash berdasarkan data final.
3. Sistem mengisi actual_cash.
4. Sistem menghitung difference = actual_cash - expected_cash.
5. Shift status berubah menjadi CLOSED.
6. Pengawas atau manajer bisa menandatangani / review.

---

## Data Model Inti (Tanpa FastAPI)

### Table: shifts
```sql
CREATE TABLE shifts (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    starting_cash DECIMAL(12,2) NOT NULL,
    expected_cash DECIMAL(12,2) DEFAULT 0,
    actual_cash DECIMAL(12,2) DEFAULT 0,
    difference DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'OPEN',
    notes TEXT
);
```

### Table: cash_movements
```sql
CREATE TABLE cash_movements (
    id VARCHAR PRIMARY KEY,
    shift_id VARCHAR REFERENCES shifts(id),
    type VARCHAR(10) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: transactions
```sql
CREATE TABLE transactions (
    id VARCHAR PRIMARY KEY,
    shift_id VARCHAR REFERENCES shifts(id),
    user_id VARCHAR NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'PAID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Rumus Rekonsiliasi

### Basic expected cash
```text
Expected Cash = Starting Cash + Cash Sales + Cash In - Petty Cash Out
```

### Selisih kas
```text
Variance = Actual Cash - Expected Cash
```

### Interpretasi
- Variance = 0 : balanced
- Variance < 0 : shortage
- Variance > 0 : overage

---

## Kenapa Ini Cocok Dipisah dari AI?

Karena tugas keduanya berbeda:

### POS App perlu
- cepat untuk transaksi harian
- mudah diakses kasir
- akurasi kas dan stok
- rekap yang real-time

### AI Service perlu
- komputasi berat
- model machine learning
- analisis historis
- forecast / rekomendasi

Jadi keduanya bukan satu aplikasi monolitik yang harus dipanggil bareng-bareng.

---

## Integrasi dengan AI nanti

Saat AI mulai dibangun, service FastAPI hanya akan membaca data yang sudah ada di database, misalnya:
- transaksi harian
- penjualan per produk
- stok bahan baku
- cash movement
- shift history

Contoh endpoint AI:
- GET /forecast/sales
- GET /forecast/stock
- GET /report/low-stock
- GET /insights/daily

AI tidak perlu ikut mengelola proses kasir. Ia hanya mengambil data dan menghasilkan rekomendasi.

---

## Rekomendasi Implementasi Prioritas

### Prioritas 1: Fungsional POS inti
- login kasir
- buka shift
- transaksi
- cash in/out
- tutup shift
- rekap cash + variance

### Prioritas 2: Data quality
- status final transaction
- validasi void/refund
- pety cash tracking
- audit log

### Prioritas 3: AI prediction
- forecasting sales
- prediksi kebutuhan stok
- rekomendasi menu / bahan baku

---

## Kesimpulan

Sistem POS dan AI sebaiknya dipisah sejak awal. POS tetap fokus pada operasional kasir dan cash reconciliation, sedangkan FastAPI disiapkan sebagai layanan analitik dan prediksi yang membaca data yang sama di database.

Dengan pola ini, projek Anda lebih scalable, lebih bersih secara arsitektur, dan lebih siap untuk pengembangan ke depan.
