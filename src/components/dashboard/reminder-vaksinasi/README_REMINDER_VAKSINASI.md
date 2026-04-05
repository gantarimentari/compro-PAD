# Reminder Vaksinasi Module

Dokumentasi teknis fitur Reminder Vaksinasi pada dashboard admin.

## Ringkasan Fitur

Modul ini digunakan untuk:

- Menampilkan daftar reminder vaksinasi hewan.
- Menambah reminder vaksinasi baru (sekaligus mencatat vaksinasi pertama sebagai selesai).
- Menandai vaksinasi selesai dan menentukan jadwal berikutnya.
- Mengedit jadwal reminder.
- Menjadwalkan ulang reminder terlewat.
- Mengirim reminder manual per item.
- Mengirim semua reminder sekaligus (bulk/scheduled trigger).
- Melihat riwayat vaksinasi per seri (hewan + jenis vaksin).
- Menghapus seri reminder terkait.

## Struktur Folder

```text
src/
|- app/
|  |- dashboard/
|  |  |- reminder-vaksinasi/
|  |  |  |- page.jsx
|- components/
|  |- dashboard/
|  |  |- reminder-vaksinasi/
|  |  |  |- README_REMINDER_VAKSINASI.md
|  |  |  |- ReminderVaksinasi.jsx
|  |  |  |- useReminderVaksinasiData.js
|  |  |  |- reminderVaksinasi.constants.js
|  |  |  |- reminderVaksinasi.utils.js
|  |  |  |- _components/
|  |  |  |  |- PageHeaderVaksinasi.jsx
|  |  |  |  |- reminderVaksinasi.cells.jsx
|  |  |  |  |- ReminderActionButtons.jsx
|  |  |  |  |- ReminderPetAndVaccineFields.jsx
|  |  |  |  |- PencatatanVaksinasi.jsx
|  |  |  |  |- ScheduleSelector.jsx
|  |  |  |  |- VaccinationInfo.jsx
|  |  |  |- modals/
|  |  |  |  |- TambahReminderVaksinasiModal.jsx
|  |  |  |  |- ActionReminderVaksinasiModal.jsx
|  |  |  |  |- EditReminderModal.jsx
|  |  |  |  |- Reschedule.jsx
|  |  |  |  |- SendReminderModal.jsx
|  |  |  |  |- VaccinationHistoryModal.jsx
|  |  |  |  |- useTambahReminderVaksinasiForm.js
|  |  |  |  |- useActionReminderForm.js

|- lib/
|  |- api.js
|  |- services/
|  |  |- reminderVaksinasi.js
|  |  |- hewanService.js
|  |  |- jenisVaksinService.js
```

## Arsitektur Singkat

1. Halaman route memuat komponen utama Reminder Vaksinasi.
2. Komponen utama memakai hook data `useReminderVaksinasiData`.
3. Hook mengambil data backend paralel:
   - reminder vaksinasi
   - data hewan + pemilik
   - data jenis vaksin
4. Utilitas `mapReminderTableData` melakukan normalisasi dan join data.
5. Data display diringkas per seri memakai `collapseReminderSeries` (key: `hewanId-vaksinId`).
6. Komponen menerapkan search + status filter, lalu render tabel.
7. Semua aksi (create, update, delete, complete, send) menggunakan React Query mutation dan invalidate query key yang sama.

## Peran File Utama

- `page.jsx`
  - Entry route dashboard reminder vaksinasi.
- `ReminderVaksinasi.jsx`
  - Orkestrator UI: state filter, tabel, modal, dan handler aksi.
- `useReminderVaksinasiData.js`
  - Data layer React Query untuk query + mutation.
- `reminderVaksinasi.utils.js`
  - Normalisasi data API, mapping tabel, perhitungan tanggal/hint/urgency, collapse per seri.
- `reminderVaksinasi.constants.js`
  - Konstanta query key, opsi filter status, kolom tabel, dan style status/urgency.
- `modals/*`
  - Setiap aksi user dipisah dalam modal/hook form agar logika tidak menumpuk di komponen utama.
- `lib/services/reminderVaksinasi.js`
  - Wrapper endpoint reminder vaksinasi.

## Alur Bisnis Detail

### 1) Load Data Awal

Pada `useReminderVaksinasiData`:

- Jalankan `Promise.all` untuk `getAll()` reminder, hewan, dan jenis vaksin.
- Map data mentah ke kontrak FE tabel (`mapReminderTableData`).
- Simpan cache dengan query key `['reminder-vaksinasi-list']`.

### 2) Tambah Reminder (Create)

Saat submit Tambah Reminder:

1. Validasi data form dasar (hewan, vaksin, tanggal, dokter/admin).
2. Buat reminder awal via `POST /api/reminder-vaksinasi`.
3. Reminder awal langsung di-update menjadi status selesai dengan tanggal aktual vaksin pertama.
4. Hitung jadwal berikutnya berdasarkan interval vaksin (bulan), lalu buat reminder lanjutan otomatis.

Catatan:

- Tanggal seed dijaga agar tidak di bawah hari ini.
- Jika ID reminder hasil create tidak terbaca, proses dianggap gagal.

### 3) Selesai Vaksinasi

Action modal mendukung tipe jadwal:

- `automatic`: tanggal berikutnya dihitung otomatis dari `actualVaccinationDate + interval`.
- `manual`: tanggal berikutnya diisi manual.
- `final`: menutup seri (tanpa jadwal berikutnya).

Payload update akan mengirim:

- status (`Selesai` atau `Dijadwalkan`)
- tanggal aktual vaksin
- dokter/admin pelaksana
- catatan
- jadwal berikutnya (opsional/null)
- tipe jadwal

### 4) Collapse Series untuk Tampilan Tabel

Satu seri = kombinasi hewan + jenis vaksin.

- Modul memilih satu row representatif per seri untuk ditampilkan.
- Riwayat vaksin selesai tetap dihitung untuk label `#N kali vaksin`.
- Row aktif terdekat dipakai untuk aksi dan informasi jadwal berikutnya.

### 5) Status dan Urgency

Status final row ditentukan dari kombinasi:

- status dari backend
- `reminder_sent`
- `scheduleType`
- kondisi tanggal (misalnya lewat jatuh tempo -> `Terlewat`)

Urgency jadwal berikutnya:

- `overdue`: jika sudah lewat
- `very-soon`: <= 1 hari
- `soon`: < 14 hari
- `normal`: selain itu

### 6) Kirim Reminder

Ada 2 mode:

- Kirim per item (manual): dari `SendReminderModal`.
- Kirim semua: tombol `Kirim Semua Reminder` di header.

`SendReminderModal` memilih `reminder_type` otomatis berdasarkan selisih hari ke tanggal target:

- `>= 7 hari` -> `7_day_before`
- `>= 3 hari` -> `3_days_sebelum`
- lainnya -> `same_day`

### 7) Delete Reminder

Delete di level UI akan menghapus semua reminder dalam seri terkait (hewan + vaksin), bukan hanya satu row display.

## Endpoint yang Digunakan

Endpoint inti reminder:

- `GET /api/reminder-vaksinasi`
- `POST /api/reminder-vaksinasi`
- `PUT /api/reminder-vaksinasi/{id}`
- `DELETE /api/reminder-vaksinasi/{id}`
- `POST /api/reminder-vaksinasi/send-manual`
- `POST /api/reminder-vaksinasi/send-scheduled`

Endpoint referensi data:

- `GET /api/hewan`
- `GET /api/jenis-vaksin`

Catatan auth:

- Untuk endpoint kirim reminder, service memanggil `GET /sanctum/csrf-cookie` sebelum `POST`.

## Kontrak Data FE (Ringkas)

Row tabel hasil mapping umumnya memuat:

- `reminderId`
- `hewanId`, `vaksinId`
- `petName`, `species`
- `ownerName`, `ownerPhone`
- `vaccinationType`, `vaccineInterval`
- `latestVaccinationDate`, `latestVaccinationDateRaw`
- `nextVaccinationDate`, `nextVaccinationDateRaw`
- `nextVaccinationHint`, `nextVaccinationUrgency`
- `status`, `reminderSent`
- `performedBy`, `notes`, `scheduleType`

## Daftar Aksi UI

Tersedia aksi berikut dari tabel:

- Tambah reminder baru.
- Catat vaksinasi selesai.
- Lihat riwayat vaksinasi.
- Edit reminder.
- Jadwalkan ulang.
- Kirim reminder.
- Hapus reminder.

## Error Handling dan Validasi

- Validasi ID reminder sebelum update/delete/send.
- Notifikasi error ditampilkan lewat `alert` dengan fallback message dari backend.
- Opsi hewan dan jenis vaksin diambil ulang saat modal dibuka.
- Jenis vaksin untuk tambah reminder difilter hanya status aktif.

## Checklist Pengujian Manual

1. Tambah reminder baru -> data tampil dan seri terbentuk benar.
2. Tandai vaksinasi selesai (automatic/manual/final) -> status dan jadwal berikutnya sesuai.
3. Kirim reminder per item -> status terkirim dan tidak bisa kirim ulang item yang sama.
4. Kirim semua reminder -> jumlah terkirim sesuai respons API.
5. Edit jadwal -> tanggal baru tersimpan.
6. Reschedule item terlewat -> tanggal baru mengubah hint/urgency.
7. Hapus reminder -> semua item terkait seri ikut terhapus.
8. Search + filter status -> hasil tabel sesuai.

## Catatan Teknis

- Query key tunggal modul: `REMINDER_QUERY_KEY`.
- Utility date dan mapping dipisah untuk menjaga komponen UI tetap ringan.
- Normalisasi respons API mendukung dua bentuk umum: array langsung atau `{ data: [] }`.

## Known Limitation

- Beberapa notifikasi error/sukses masih menggunakan `alert`; bisa ditingkatkan ke toast agar UX konsisten.
- Penamaan `reminder_type` untuk 3 hari menggunakan string `3_days_sebelum`; pastikan ini memang kontrak backend final.
