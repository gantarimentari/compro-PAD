# Dokumentasi Sistem Authentication

## 📋 Daftar Isi
1. [Struktur Folder](#struktur-folder)
2. [Halaman-Halaman yang Tersedia](#halaman-halaman-yang-tersedia)
3. [Komponen Reusable](#komponen-reusable)
4. [Cara Navigasi](#cara-navigasi)
5. [Flow Authentication](#flow-authentication)
6. [Best Practices Next.js](#best-practices-nextjs)
7. [Cara Menjalankan](#cara-menjalankan)

---

## 📁 Struktur Folder

```
my-compro/
├── components/
│   └── auth/                    # Komponen reusable untuk auth
│       ├── AuthLayout.jsx       # Layout wrapper
│       ├── Button.jsx           # Komponen button
│       ├── GoogleIcon.jsx       # Icon Google
│       ├── Input.jsx            # Komponen input field
│       ├── Separator.jsx        # Garis pemisah "atau"
│       └── README.md            # Dokumentasi komponen
│
└── src/
    └── app/
        └── auth/                # Halaman-halaman authentication
            ├── login/
            │   └── page.jsx     # Halaman Login
            ├── register/
            │   └── page.jsx     # Halaman Register
            ├── forgotPassword/
            │   └── page.jsx     # Halaman Forgot Password
            └── resetPassword/
                └── page.jsx     # Halaman Reset Password
```

---

## 🌐 Halaman-Halaman yang Tersedia

### 1. Login Page
**URL:** `/auth/login`

**Fitur:**
- Input Email
- Input Password
- Link "Lupa password?" → mengarah ke `/auth/forgotPassword`
- Tombol Login
- Tombol "Sign in with Google"
- Link "Daftar Sekarang" → mengarah ke `/auth/register`

**State Management:**
```jsx
const [formData, setFormData] = useState({
  email: '',
  password: ''
});
```

### 2. Register Page
**URL:** `/auth/register`

**Fitur:**
- Input Username
- Input Email
- Input Password
- Tombol Register
- Tombol "Sign in with Google"
- Link "Login" → mengarah ke `/auth/login`

**State Management:**
```jsx
const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: ''
});
```

### 3. Forgot Password Page
**URL:** `/auth/forgotPassword`

**Fitur:**
- Input Email
- Tombol "Send Verification"
- Success message setelah submit
- Link "Kembali ke Login" → mengarah ke `/auth/login`

**State Management:**
```jsx
const [email, setEmail] = useState('');
const [isSubmitted, setIsSubmitted] = useState(false);
```

### 4. Reset Password Page
**URL:** `/auth/resetPassword`

**Fitur:**
- Input Password Baru
- Input Konfirmasi Password
- Validasi password match
- Validasi minimal 8 karakter
- Error message display
- Info password requirements
- Link "Kembali ke Login" → mengarah ke `/auth/login`

**State Management:**
```jsx
const [formData, setFormData] = useState({
  newPassword: '',
  confirmPassword: ''
});
const [error, setError] = useState('');
```

---

## 🧩 Komponen Reusable

### AuthLayout
Wrapper untuk semua halaman auth, menyediakan background dan container.

```jsx
import AuthLayout from '@/components/auth/AuthLayout';

<AuthLayout>
  {/* Konten halaman */}
</AuthLayout>
```

### Input
Komponen input field dengan styling konsisten.

```jsx
import Input from '@/components/auth/Input';

<Input
  id="email"
  name="email"
  type="email"
  label="E-mail"
  placeholder="Masukkan email"
  required
  value={email}
  onChange={handleChange}
/>
```

### Button
Komponen button dengan berbagai variant (primary, secondary, google).

```jsx
import Button from '@/components/auth/Button';

// Primary button
<Button type="submit" variant="primary">
  Login
</Button>

// Button dengan icon
<Button 
  variant="google"
  icon={<GoogleIcon />}
>
  Sign in with Google
</Button>
```

### Separator
Garis pemisah dengan text di tengah.

```jsx
import Separator from '@/components/auth/Separator';

<Separator />  {/* menampilkan "atau" */}
```

### GoogleIcon
Icon SVG Google.

```jsx
import GoogleIcon from '@/components/auth/GoogleIcon';

<GoogleIcon />
```

---

## 🔀 Cara Navigasi

### Menggunakan Link Component (Recommended)

Next.js menyediakan komponen `Link` untuk navigasi client-side yang lebih cepat:

```jsx
import Link from 'next/link';

{/* Navigasi ke halaman lain */}
<Link href="/auth/login">Login</Link>
<Link href="/auth/register">Register</Link>
<Link href="/auth/forgotPassword">Lupa Password?</Link>
```

**Keuntungan:**
- ✅ Client-side navigation (lebih cepat)
- ✅ Tidak reload seluruh halaman
- ✅ Prefetching otomatis
- ✅ SEO friendly

### Menggunakan useRouter (Programmatic Navigation)

Untuk navigasi setelah action tertentu (misalnya setelah submit form):

```jsx
import { useRouter } from 'next/navigation';

const router = useRouter();

const handleSubmit = (e) => {
  e.preventDefault();
  // ... logic submit
  
  // Redirect ke halaman lain
  router.push('/dashboard');
};
```

---

## 🔐 Flow Authentication

### 1. Flow Login
```
User masuk ke /auth/login
  ↓
Input email & password
  ↓
Klik "Login"
  ↓
Validasi & API call
  ↓
Redirect ke /dashboard (jika berhasil)
```

### 2. Flow Register
```
User klik "Daftar Sekarang" di login page
  ↓
Pindah ke /auth/register
  ↓
Input username, email, password
  ↓
Klik "Register"
  ↓
Validasi & API call
  ↓
Redirect ke /auth/login atau langsung login
```

### 3. Flow Forgot Password
```
User klik "Lupa password?" di login page
  ↓
Pindah ke /auth/forgotPassword
  ↓
Input email
  ↓
Klik "Send Verification"
  ↓
API kirim email dengan link reset
  ↓
User klik link di email
  ↓
Pindah ke /auth/resetPassword?token=xxx
  ↓
Input password baru
  ↓
Klik "Change Password"
  ↓
Redirect ke /auth/login
```

---

## ⚡ Best Practices Next.js

### 1. Client Component vs Server Component

**Client Component** (`'use client'`)
- Digunakan saat butuh interactivity (state, event handlers)
- Semua halaman auth kita menggunakan client component

```jsx
'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  // ...
}
```

### 2. File-based Routing

Next.js menggunakan struktur folder untuk routing:

```
src/app/auth/login/page.jsx        → /auth/login
src/app/auth/register/page.jsx     → /auth/register
src/app/auth/forgotPassword/page.jsx → /auth/forgotPassword
```

### 3. Import Alias

Gunakan `@/` untuk import yang lebih clean:

```jsx
// ❌ Tidak recommended
import Input from '../../../../components/auth/Input';

// ✅ Recommended
import Input from '@/components/auth/Input';
```

### 4. Component Organization

- **Pages** di `src/app/` - untuk routing
- **Components** di `components/` - untuk reusable components
- Setiap komponen fokus pada satu tanggung jawab

---

## 🚀 Cara Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Buka Browser

Akses halaman-halaman berikut:
- Login: http://localhost:3000/auth/login
- Register: http://localhost:3000/auth/register
- Forgot Password: http://localhost:3000/auth/forgotPassword
- Reset Password: http://localhost:3000/auth/resetPassword

---

## 🎯 Next Steps

### 1. Implementasi Backend Integration

```jsx
// Contoh login dengan API
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Simpan token
      localStorage.setItem('token', data.token);
      // Redirect ke dashboard
      router.push('/dashboard');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### 2. Tambahkan Form Validation

Gunakan library seperti:
- **Zod** - untuk schema validation
- **React Hook Form** - untuk form management

```bash
npm install react-hook-form zod @hookform/resolvers
```

### 3. Implementasi Google OAuth

```bash
npm install next-auth
```

### 4. Tambahkan Loading State

```jsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    // ... API call
  } finally {
    setIsLoading(false);
  }
};

// Di button
<Button type="submit" disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Login'}
</Button>
```

### 5. Buat Protected Routes

Untuk halaman dashboard yang hanya bisa diakses setelah login:

```jsx
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
};
```

---

## 📝 Tips untuk Pemula

1. **Pahami File-based Routing**
   - Setiap folder di `app/` jadi route
   - File `page.jsx` adalah halaman yang ditampilkan

2. **Gunakan Komponen Reusable**
   - Jangan copy-paste kode yang sama
   - Buat komponen untuk elemen yang sering dipakai

3. **State Management**
   - Gunakan `useState` untuk data yang berubah
   - Gunakan `useEffect` untuk side effects (API calls, etc)

4. **Navigasi**
   - Gunakan `Link` untuk link biasa
   - Gunakan `useRouter` untuk navigasi setelah action

5. **Console.log adalah Teman**
   - Selalu log data untuk debugging
   - Cek console browser untuk error

---

## 🆘 Troubleshooting

### Error: "Cannot find module '@/components/auth/Input'"

**Solusi:** Pastikan `jsconfig.json` atau `tsconfig.json` sudah ada dan dikonfigurasi:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*", "./*"]
    }
  }
}
```

### Link tidak berfungsi / refresh full page

**Solusi:** Pastikan menggunakan `Link` dari `next/link`, bukan tag `<a>`.

### Styling tidak muncul

**Solusi:** Pastikan Tailwind CSS sudah dikonfigurasi dengan benar di `tailwind.config.js`.

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hooks](https://react.dev/reference/react)

---

**Happy Coding! 🚀**

