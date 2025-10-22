# Panduan Menggunakan Design Tokens di Next.js + Tailwind CSS

## 🔍 Masalah yang Sering Terjadi

### Kenapa `text-h-4` Menampilkan 16px Bukan 3.375rem (54px)?

Ada beberapa kemungkinan penyebab:

1. **Tailwind belum mengenali class custom Anda**
2. **Browser cache atau Next.js cache**
3. **Development server perlu di-restart**
4. **Tailwind content path tidak mencakup file Anda**

---

## ✅ Solusi Lengkap

### 1. Pastikan Tailwind Config Sudah Benar

File: `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',     // ✅ Scan semua file di src/
    './components/**/*.{js,ts,jsx,tsx,mdx}', // ✅ Scan komponen di root
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        // Design Tokens untuk Typography
        'h-1': ['7.5rem', { lineHeight: '11.25rem' }],      // 120px
        'h-2': ['5.75rem', { lineHeight: '8.625rem' }],     // 92px
        'h-3': ['4.375rem', { lineHeight: '6.5625rem' }],   // 70px
        'h-4': ['3.375rem', { lineHeight: '5.0625rem' }],   // 54px ✅
        'h-5': ['2.625rem', { lineHeight: '3.9375rem' }],   // 42px
        'h-6': ['2rem', { lineHeight: '3rem' }],            // 32px
        'h-7': ['1.5rem', { lineHeight: '2.25rem' }],       // 24px
        
        'body-1': ['1.125rem', { lineHeight: '1.6875rem' }], // 18px
        'body-2': ['0.875rem', { lineHeight: '1.3125rem' }], // 14px
      }
    },
  },
  plugins: [],
}
```

### 2. Cara Menggunakan Design Token

#### ❌ SALAH - Menggunakan Inline Style
```jsx
<h1 style={{ fontSize: '3.375rem' }}>Login</h1>
```

#### ✅ BENAR - Menggunakan Tailwind Class
```jsx
<h1 className="text-h-4 font-extrabold text-gray-900">
  Login
</h1>
```

### 3. Debugging: Cek Apakah Class Ter-generate

Buka browser DevTools dan inspect element:

```html
<!-- ✅ BENAR - Class text-h-4 ter-apply -->
<h1 class="text-h-4 font-extrabold text-gray-900">Login</h1>

Computed styles:
font-size: 54px (3.375rem) ✅
line-height: 81px (5.0625rem) ✅
```

```html
<!-- ❌ SALAH - Class text-h-4 TIDAK ter-apply -->
<h1 class="text-h-4 font-extrabold text-gray-900">Login</h1>

Computed styles:
font-size: 16px ❌ (fallback ke default browser)
```

### 4. Troubleshooting Steps

#### Step 1: Clear Cache dan Restart Server

```bash
# Stop development server (Ctrl+C)

# Hapus folder cache Next.js
rmdir /s /q .next

# Restart development server
npm run dev
```

#### Step 2: Cek Tailwind Content Path

Pastikan file Anda ter-cover di `content` array:

```js
// tailwind.config.js
content: [
  './src/**/*.{js,ts,jsx,tsx,mdx}',     // ✅ Covers src/app/auth/login/page.jsx
  './components/**/*.{js,ts,jsx,tsx,mdx}', // ✅ Covers components/auth/*
],
```

#### Step 3: Verifikasi Class di Inspector

1. Buka browser DevTools (F12)
2. Klik tab "Elements" atau "Inspector"
3. Pilih element `<h1>`
4. Lihat di panel "Computed" atau "Styles"
5. Cari `font-size`

**Jika masih 16px:**
- Class `text-h-4` tidak ter-generate oleh Tailwind
- Restart server dan clear cache

**Jika sudah 54px:**
- ✅ Berhasil!

#### Step 4: Test dengan Class Tailwind Bawaan

Untuk memastikan Tailwind berfungsi, test dengan class bawaan:

```jsx
{/* Test 1: Class bawaan Tailwind */}
<h1 className="text-6xl">Test</h1>  {/* Harusnya 60px */}

{/* Test 2: Custom class Anda */}
<h1 className="text-h-4">Login</h1>  {/* Harusnya 54px */}
```

Jika Test 1 berfungsi tapi Test 2 tidak:
- Ada masalah di config custom Anda
- Perlu restart server

---

## 📚 Daftar Design Tokens yang Tersedia

### Typography (Font Size)

| Class | Size (rem) | Size (px) | Line Height | Penggunaan |
|-------|-----------|-----------|-------------|-----------|
| `text-h-1` | 7.5rem | 120px | 11.25rem | Hero Title - Extra Large |
| `text-h-2` | 5.75rem | 92px | 8.625rem | Hero Title - Large |
| `text-h-3` | 4.375rem | 70px | 6.5625rem | Page Title - Large |
| `text-h-4` | 3.375rem | 54px | 5.0625rem | Page Title - Medium |
| `text-h-5` | 2.625rem | 42px | 3.9375rem | Section Title |
| `text-h-6` | 2rem | 32px | 3rem | Card Title |
| `text-h-7` | 1.5rem | 24px | 2.25rem | Subtitle |
| `text-body-1` | 1.125rem | 18px | 1.6875rem | Body Large |
| `text-body-2` | 0.875rem | 14px | 1.3125rem | Body Small |

### Contoh Penggunaan

```jsx
// Halaman Login - Title
<h1 className="text-h-4 font-extrabold text-gray-900">
  Login
</h1>

// Halaman Register - Title
<h1 className="text-h-4 font-extrabold text-gray-900">
  Register
</h1>

// Hero Section - Extra Large Title
<h1 className="text-h-1 font-bold text-white">
  Welcome to Our Platform
</h1>

// Card Title
<h2 className="text-h-6 font-semibold text-gray-800">
  Card Title
</h2>

// Body Text - Large
<p className="text-body-1 text-gray-600">
  This is a paragraph with larger body text.
</p>

// Body Text - Small
<p className="text-body-2 text-gray-500">
  This is a smaller body text, good for captions or footnotes.
</p>
```

---

## 🎨 Best Practices

### 1. Gunakan Design Tokens untuk Konsistensi

#### ❌ TIDAK KONSISTEN
```jsx
// Setiap halaman pakai size berbeda
<h1 className="text-5xl">Login</h1>      // 48px
<h1 className="text-6xl">Register</h1>   // 60px
<h1 className="text-4xl">Dashboard</h1>  // 36px
```

#### ✅ KONSISTEN dengan Design Tokens
```jsx
// Semua page title pakai token yang sama
<h1 className="text-h-4">Login</h1>      // 54px ✅
<h1 className="text-h-4">Register</h1>   // 54px ✅
<h1 className="text-h-4">Dashboard</h1>  // 54px ✅
```

### 2. Kombinasi dengan Utility Classes Lain

```jsx
<h1 className="text-h-4 font-extrabold text-gray-900 mb-6">
  {/* 
    text-h-4      → 54px font size
    font-extrabold → 800 font weight
    text-gray-900  → Dark gray color
    mb-6          → Margin bottom 1.5rem
  */}
  Login
</h1>
```

### 3. Responsive Design dengan Design Tokens

```jsx
<h1 className="text-h-6 md:text-h-5 lg:text-h-4 font-bold">
  {/* 
    Mobile:  32px (text-h-6)
    Tablet:  42px (text-h-5)
    Desktop: 54px (text-h-4)
  */}
  Responsive Title
</h1>
```

---

## 🔧 Advanced: Menambah Design Token Baru

### 1. Tambah di tailwind.config.js

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        // Token baru untuk caption
        'caption': ['0.75rem', { lineHeight: '1.125rem' }],  // 12px
        
        // Token untuk display text
        'display': ['8rem', { lineHeight: '12rem' }],        // 128px
      },
      
      // Tambah color tokens
      colors: {
        'brand-primary': '#4F46E5',
        'brand-secondary': '#10B981',
        'brand-accent': '#F59E0B',
      },
      
      // Tambah spacing tokens
      spacing: {
        '128': '32rem',  // 512px
        '144': '36rem',  // 576px
      }
    },
  },
}
```

### 2. Gunakan Token Baru

```jsx
<p className="text-caption text-gray-500">
  Small caption text (12px)
</p>

<button className="bg-brand-primary text-white px-6 py-3">
  Primary Button
</button>

<div className="mt-128">
  Content with 512px top margin
</div>
```

---

## 📝 Checklist Troubleshooting

Jika design token tidak berfungsi, cek satu per satu:

- [ ] ✅ Token sudah didefinisikan di `tailwind.config.js` → `theme.extend.fontSize`
- [ ] ✅ File path sudah ter-cover di `content` array
- [ ] ✅ Class ditulis dengan benar (misalnya `text-h-4` bukan `h-4`)
- [ ] ✅ Development server sudah di-restart
- [ ] ✅ Cache sudah di-clear (hapus folder `.next`)
- [ ] ✅ Browser sudah di-refresh (hard refresh: Ctrl+Shift+R)
- [ ] ✅ Tidak ada typo di nama class
- [ ] ✅ File JSX sudah disave

---

## 🚀 Quick Fix untuk Masalah Anda

Jika `text-h-4` masih menampilkan 16px:

### Solusi 1: Hard Restart (Paling Sering Berhasil)

```bash
# 1. Stop server (Ctrl+C)
# 2. Hapus cache
rmdir /s /q .next
# 3. Restart
npm run dev
# 4. Hard refresh browser (Ctrl+Shift+R)
```

### Solusi 2: Verifikasi Konfigurasi

Pastikan `jsconfig.json` benar:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@ds/*": ["components/*"]
    }
  }
}
```

Pastikan `tailwind.config.js` benar:

```js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        'h-4': ['3.375rem', { lineHeight: '5.0625rem' }],
      }
    },
  },
}
```

### Solusi 3: Temporary Workaround (Jika Masih Tidak Berfungsi)

Jika setelah semua langkah di atas masih tidak berfungsi, gunakan arbitrary value sementara:

```jsx
// Temporary workaround
<h1 className="text-[3.375rem] leading-[5.0625rem] font-extrabold">
  Login
</h1>

// Tapi tetap usahakan pakai design token untuk jangka panjang
```

---

## 📖 Resources

- [Tailwind CSS - Font Size](https://tailwindcss.com/docs/font-size)
- [Tailwind CSS - Customizing Your Theme](https://tailwindcss.com/docs/theme)
- [Next.js - Tailwind CSS](https://nextjs.org/docs/app/building-your-application/styling/tailwind-css)

---

**Happy Coding! 🎨**

