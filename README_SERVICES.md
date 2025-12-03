# 📋 Services - Cara Edit Deskripsi Layanan

## Data Layanan

Data layanan ada di file: `layout/landingPage/Services.jsx`

```javascript
const [servicesInfo] = useState({
  "pemeriksaan": {
    nama: "Pemeriksaan & pengobatan umum",
    deskripsi: "Ini deskripsi untuk pemeriksaan..."
  },
  "vaksinasi": {
    nama: "Vaksinasi", 
    deskripsi: "Ini deskripsi untuk vaksinasi..."
  },
  "bedah": {
    nama: "Bedah minor",
    deskripsi: "Ini deskripsi untuk bedah minor..."
  },
  "konsultasi": {
    nama: "Konsultasi",
    deskripsi: "Ini deskripsi untuk konsultasi..."
  }
});
```

## Cara Edit dari Dashboard (Nanti)

Untuk edit dari dashboard admin, data `servicesInfo` bisa diambil dari database atau API.

### Contoh: Ambil dari state/context global

```javascript
// Di dashboard, edit data lalu save ke database
// Di landing page, fetch data dari database

useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/services');
    const data = await response.json();
    setServicesInfo(data);
  };
  fetchData();
}, []);
```

## Struktur Data

- **Key**: "pemeriksaan", "vaksinasi", "bedah", "konsultasi"
  - Jangan diubah, ini dipakai di button onClick
  
- **nama**: Teks yang ditampilkan di button
  - Bisa diubah sesuai kebutuhan
  
- **deskripsi**: Teks yang ditampilkan di modal
  - Bisa multiline dengan `\n` atau langsung pakai line breaks
  - Contoh: `"Baris 1\n\nBaris 2\n\nBaris 3"`

## Button Mapping

- Button "Pemeriksaan & pengobatan umum" → ambil data `servicesInfo.pemeriksaan`
- Button "Vaksinasi" → ambil data `servicesInfo.vaksinasi`
- Button "Bedah minor" → ambil data `servicesInfo.bedah`
- Button "Konsultasi" → ambil data `servicesInfo.konsultasi`

Simple! 🎯

