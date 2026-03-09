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

---

## Bug #6 — Submit Pasien Terlihat "Nyasar" ke Endpoint Jenis Hewan

**Tanggal:** 9 Maret 2026  
**Scope:** Debug routing Laravel + request flow Next.js pada manajemen pasien

### Gejala
- Saat melakukan submit tambah pasien (`POST /api/patients`), di Network terlihat response data `jenis hewan`.
- User mengira route `/api/patients` tertukar ke `JenisHewanController`.
- Kasus muncul saat menguji email pasien yang sudah terdaftar.

### Hipotesis Awal
- Route Laravel tertukar atau tidak ter-update karena route cache.
- Ada konflik middleware pada group `auth:sanctum` + `admin`.
- Frontend memanggil endpoint lain secara paralel, lalu hasilnya terbaca sebagai response submit.

### Verifikasi yang Dilakukan

#### 1. Cek definisi route di file
Di `routes/api.php`, route memang sudah benar:
- `Route::apiResource('jenis-hewan', JenisHewanController::class);`
- `Route::apiResource('patients', PatientController::class);`

Urutan route bukan masalah selama URI berbeda.

#### 2. Cek route aktif di runtime Laravel
Gunakan `route:list` untuk memastikan route yang sedang aktif:

```powershell
Set-Location "C:\Users\LENOVO\my-compro\apps\becompro"
php artisan route:list --path=api/patients
php artisan route:list --path=api/jenis-hewan
php artisan route:list | Select-String "api/patients|api/jenis-hewan"
```

Hasil: `POST /api/patients` tetap menuju `API\PatientController@store`.

#### 3. Cek middleware yang menempel

```powershell
Set-Location "C:\Users\LENOVO\my-compro\apps\becompro"
php artisan route:list --path=api/patients -vv
php artisan route:list --path=api/jenis-hewan -vv
```

Hasil: kedua resource memakai stack middleware yang sama (`EnsureFrontendRequestsAreStateful`, `auth:sanctum`, `SubstituteBindings`, `EnsureUserIsAdmin`), tidak ada middleware yang mengalihkan route.

#### 4. Cek resolve route runtime secara programatik

```powershell
Set-Location "C:\Users\LENOVO\my-compro\apps\becompro"
php artisan tinker --execute="dump(app('router')->getRoutes()->match(Illuminate\Http\Request::create('/api/patients','POST'))->getActionName());"
```

Output runtime: `App\Http\Controllers\API\PatientController@store`.

#### 5. Cek frontend service dan request paralel
- `patientService.create()` memanggil `POST /api/patients`.
- Pada halaman manajemen pasien, ada query paralel `jenisHewanService.getAll()` yang memanggil `GET /api/jenis-hewan` untuk opsi dropdown.
- Saat submit pasien gagal validasi (mis. email duplikat), request `jenis-hewan` yang sukses bisa terlihat dominan di Network.

### Root Cause Final
Tidak ada route Laravel yang tertukar. Masalah berasal dari interpretasi Network request ketika ada request paralel di halaman yang sama.

Pada saat email duplikat:
- `POST /api/patients` gagal dengan `422 Unprocessable Entity` (validasi Laravel).
- `GET /api/jenis-hewan` tetap sukses (`200`) dan menampilkan data jenis hewan.

Sehingga terlihat seolah submit pasien "nyasar", padahal sebenarnya submit pasien gagal validasi.

### Fix yang Diterapkan di Frontend
1. Pertahankan axios error asli dari `ManagementPasien` (jangan dibungkus `new Error`) agar payload validasi Laravel tetap terbaca.
2. Tambahkan parsing error validasi email di `TambahPasienModal`:
  - Prioritas baca `response.data.errors.email[0]`.
  - Tampilkan pesan spesifik: "Email sudah terdaftar, gunakan email lain".
3. Tambahkan state `isSubmitting` agar UX submit lebih jelas saat request berjalan.

### File yang Diubah
- `components/dashboard/components/ManagementPasien.jsx`
- `components/dashboard/modals/TambahPasienModal.jsx`

### Checklist Debug Cepat untuk Kasus Serupa
1. Cek route aktif via `php artisan route:list --path=api/<resource> -vv`.
2. Jika ragu cache, jalankan:

```powershell
Set-Location "C:\Users\LENOVO\my-compro\apps\becompro"
php artisan optimize:clear
```

3. Di browser DevTools, filter request per endpoint (contoh: `patients`) dan cocokkan method + status.
4. Pastikan request submit (`POST`) tidak tertukar dengan request list (`GET`) yang berjalan paralel.
5. Untuk error validasi, prioritaskan tampilkan detail `errors` dari backend Laravel.