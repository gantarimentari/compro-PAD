# Reminder Vaksinasi Module

Dokumentasi singkat struktur, alur data, dan dependensi untuk fitur **Reminder Vaksinasi**.

## Struktur Folder

```text
src/
├── app/
│   └── dashboard/
│       └── reminder-vaksinasi/
│           └── page.jsx
├── components/
│   └── dashboard/
│       └── reminder-vaksinasi/
│           ├── ReminderVaksinasi.jsx
│           ├── reminderVaksinasi.constants.js
│           ├── reminderVaksinasi.utils.js
│           ├── README_REMINDER_VAKSINASI.md
            ├── useReminderVaksinasiData.js
│           └── modals/
│               └── TambahReminderVaksinasiModal.jsx
                └── ActionModall.jsx
                └── useActionReminderForm.jsx
                └── useTambahReminderVaksinasiForm
└── lib/
    ├── api.js
    └── services/
        ├── reminderVaksinasi.js
        ├── hewanService.js
        └── jenisVaksinService.js
```

## Peran File

- `page.jsx`
  - Entry route halaman dashboard reminder vaksinasi.
- `ReminderVaksinasi.jsx`
  - Komponen utama: fetch data, filter/search/status, render tabel, create dan delete reminder.
- `reminderVaksinasi.constants.js`
  - Konstanta modul: query key, opsi status, kolom tabel, style badge.
- `reminderVaksinasi.utils.js`
  - Helper modul: normalisasi response API, mapping data reminder, hitung jadwal berikutnya, urgency, dan filter.
- `modals/TambahReminderVaksinasiModal.jsx`
  - Form tambah reminder: fetch opsi hewan+pemilik dan jenis vaksin aktif.

## Alur Data (High-Level)

1. Halaman memanggil paralel:
   - `reminderVaksinasiService.getAll()`
   - `hewanService.getAll()`
   - `jenisVaksinService.getAll()`
2. Data dinormalisasi di `reminderVaksinasi.utils.js`.
3. Data digabung (join by `id_hewan` dan `id_jenis_vaksin`) untuk kebutuhan tabel UI.
4. `nextVaccinationDate` dihitung dari:
   - `latestVaccinationDate + interval (bulan)`.
5. `nextVaccinationHint` dan urgency ditentukan dari selisih hari terhadap tanggal hari ini.
6. Filter search dan status diterapkan sebelum render tabel.

## Endpoint Backend yang Dipakai

- `GET /api/reminder-vaksinasi`
- `POST /api/reminder-vaksinasi`
- `DELETE /api/reminder-vaksinasi/{id}`
- `GET /api/hewan`
- `GET /api/jenis-vaksin`

## Catatan Quality

- Query key modul disatukan via konstanta: `REMINDER_QUERY_KEY`.
- Mapping data dan date logic dipisah ke utils agar komponen utama lebih bersih.
- Delete flow menggunakan `reminderId` backend untuk menghindari mismatch ID UI fallback.
