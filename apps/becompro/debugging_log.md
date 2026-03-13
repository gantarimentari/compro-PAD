# Debugging Log — Manajemen Hewan & Jenis Hewan

**Tanggal:** 6 Maret 2026  
**Scope:** Refactor services layer + bug fixing dashboard

---

## Bug #1 — Module Not Found: `@/lib/services/authService`

### Gejala
```
Module not found: Can't resolve '@/lib/services/authService'
./components/dashboard/HeaderDashboard.jsx (4:1)
```

### Root Cause
Di `jsconfig.json`, alias `@/*` di-map ke `src/*`:
```json
"@/*": ["src/*"]
```
Sehingga `@/lib/services/authService` di-resolve ke `src/lib/services/authService` — yang tidak ada. Folder `lib/` ada di root, bukan di dalam `src/`.

### Fix
Tambah alias baru `"@/lib/*": ["lib/*"]` di `jsconfig.json`:
```json
"paths": {
  "@/*": ["src/*"],
  "@ds/*": ["components/*"],
  "@lib/*": ["lib/*"],
  "@/lib/*": ["lib/*"],   // ← tambah ini
  "@layout/*": ["layout/*"]
}
```

### File yang Diubah
- `jsconfig.json`

---

## Bug #2 — Manajemen Hewan Tidak Menampilkan Data

### Gejala
Halaman Manajemen Hewan menampilkan "Tidak ada data yang ditemukan." meski data tersedia di database.

### Root Cause
Logika flatten di `ManagementHewan.jsx` mengasumsikan data `/api/hewan` berbentuk **grouped by owner**:
```js
// Asumsi SALAH:
rawHewanData.forEach(owner => {
  owner.pets?.forEach(pet => { ... });
});
```

Padahal `HewanController::index()` di Laravel mengembalikan **flat array**:
```json
[
  { "id_hewan": 1, "nama_hewan": "Buddy", "pasien": {...}, "jenisHewan": {...} },
  { "id_hewan": 2, "nama_hewan": "Milo",  "pasien": {...}, "jenisHewan": {...} }
]
```

### Fix
Ubah logika flatten agar langsung map dari struktur flat:
```js
const flattenedData = useMemo(() => {
  return rawHewanData.map(hewan => ({
    id: hewan.id_hewan,
    petName: hewan.nama_hewan || `Hewan ${hewan.id_hewan}`,
    species: hewan.jenis_hewan?.nama_jenis || '-',
    ownerName: hewan.pasien?.username || hewan.pasien?.name || '-',
    ownerId: hewan.id_pasien,
    speciesId: hewan.id_jenisHewan,
  }));
}, [rawHewanData]);
```

### File yang Diubah
- `components/dashboard/components/ManagementHewan.jsx`

---

## Bug #3 — Kolom "Jenis Hewan" Selalu Tampil "-"

### Gejala
Data hewan sudah muncul di tabel, tapi kolom Jenis Hewan selalu menampilkan `-`.

### Root Cause
Laravel secara otomatis mengubah nama relasi **camelCase → snake_case** saat serialize ke JSON.

Method relasi di model: `jenisHewan()` → di JSON menjadi `jenis_hewan`.

Kode frontend mengakses `hewan.jenisHewan` yang `undefined`:
```js
// SALAH:
species: hewan.jenisHewan?.nama_jenis || '-',
```

### Fix
```js
// BENAR:
species: hewan.jenis_hewan?.nama_jenis || '-',
```

### Pelajaran
> Laravel serializes Eloquent relationship names from `camelCase` to `snake_case` in JSON responses.  
> `jenisHewan()` → `jenis_hewan` di response JSON.

### File yang Diubah
- `components/dashboard/components/ManagementHewan.jsx`

---

## Bug #4 — Tambah Hewan Gagal Simpan

### Gejala
Alert "Gagal simpan!" muncul saat mencoba menambah hewan baru.

### Root Cause
Dua masalah sekaligus di `TambahHewanModal.jsx`:

**Masalah A — `speciesId` selalu kosong:**  
Backend `JenisHewanController::index()` mengembalikan field `id` (bukan `id_jenisHewan`):
```json
{ "id": 3, "nama_jenis": "Kucing", "pemilik": [...] }
```
Tapi modal membaca `jenis.id_jenisHewan` → `undefined` → `speciesId = ""` → validasi backend gagal.

**Masalah B — Filter jenis hewan per owner tidak berfungsi:**  
`jenisHewanService.getAll(ownerId)` mengirim `?id_pasien=X` ke backend, tapi `JenisHewanController` tidak mengimplementasikan filter tersebut (selalu return semua jenis hewan).

### Fix

**A — Gunakan `jenis.id` yang benar:**
```js
// SALAH:
const formatted = data.map(jenis => ({
  id_jenisHewan: jenis.id_jenisHewan,  // undefined!
  nama_jenis: jenis.nama_jenis,
}));

// BENAR:
const formatted = filtered.map(jenis => ({
  id_jenisHewan: jenis.id,             // dari backend
  nama_jenis: jenis.nama_jenis,
}));
```

**B — Filter client-side dari array `pemilik`:**
```js
const data = await jenisHewanService.getAll(); // tanpa ownerId
const filtered = data.filter(jenis =>
  jenis.pemilik?.some(p => String(p.id_pemilik) === String(ownerId))
);
```

### File yang Diubah
- `components/dashboard/modals/TambahHewanModal.jsx`

---

## Bug #5 — Pemilik Jenis Hewan Tidak Muncul

### Gejala
Setelah menambah jenis hewan dengan pemilik, kolom "Nama Pemilik" di tabel Jenis Hewan tetap menampilkan `-`.

### Root Cause
`JenisHewanController::index()` mengambil pemilik dari relasi **`hewans.pasien`** (pemilik hewan yang *menggunakan* jenis ini):

```php
// Logika LAMA — hanya muncul jika jenis hewan sudah dipakai oleh hewan
$jenisHewans = JenisHewan::with(['hewans.pasien'])->get();
$pemilik = $jenis->hewans->map(fn($h) => [
    'id_pemilik' => $h->pasien->id,
    ...
]);
```

Masalah: jika belum ada hewan yang menggunakan jenis ini, `hewans` kosong → `pemilik` = `[]` → tampil `-`.

Padahal tabel `jenis_hewan` sudah punya kolom `id_pasien` yang langsung menyimpan pemilik.

### Fix

**1. Tambah relasi `pasien()` di model `JenisHewan`:**
```php
// app/Models/JenisHewan.php
public function pasien()
{
    return $this->belongsTo(User::class, 'id_pasien', 'id');
}
```

**2. Ubah controller untuk pakai `id_pasien` langsung:**
```php
// BARU — ambil pemilik dari id_pasien langsung
$jenisHewans = JenisHewan::with(['pasien'])->get();

$formatted = $jenisHewans->map(function($jenis) {
    $pemilik = [];
    if ($jenis->pasien) {
        $pemilik = [[
            'id_pemilik' => $jenis->pasien->id,
            'nama_pemilik' => $jenis->pasien->username,
        ]];
    }
    return [
        'id' => $jenis->id_jenisHewan,
        'nama_jenis' => $jenis->nama_jenis,
        'pemilik' => $pemilik,
    ];
});
```

### File yang Diubah
- `backend/app/Models/JenisHewan.php`
- `backend/app/Http/Controllers/JenisHewanController.php`

---

## Ringkasan Pola Bug yang Ditemukan

| # | Penyebab | Pelajaran |
|---|----------|-----------|
| 1 | jsconfig path alias salah | `@/*` → `src/*`, bukan root. Buat alias terpisah untuk `lib/` |
| 2 | Asumsi struktur API salah | Selalu console.log response sebelum mapping data |
| 3 | Laravel JSON snake_case | Relasi `jenisHewan()` → `jenis_hewan` di JSON |
| 4 | Field key tidak konsisten | Backend return `id`, bukan `id_jenisHewan` |
| 5 | Logika fetch pemilik salah | Ambil dari `id_pasien` langsung, bukan dari relasi hewan |