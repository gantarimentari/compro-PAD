# Auth Components

Folder ini berisi komponen-komponen reusable untuk halaman-halaman authentication (Login, Register, Forgot Password).

## Struktur Komponen

### 1. **AuthLayout.jsx**
Layout wrapper untuk semua halaman authentication. Menyediakan:
- Background dengan pattern SVG
- Container card putih dengan shadow
- Styling yang konsisten untuk semua halaman auth

**Cara Pakai:**
```jsx
import AuthLayout from '@/components/auth/AuthLayout';

<AuthLayout>
  {/* Konten halaman auth Anda */}
</AuthLayout>
```

### 2. **Input.jsx**
Komponen input field yang reusable dengan styling konsisten.

**Props:**
- `id` - ID untuk input field
- `name` - Name attribute untuk form
- `type` - Type input (text, email, password, dll)
- `label` - Label yang ditampilkan di atas input
- `placeholder` - Placeholder text
- `required` - Boolean, apakah field wajib diisi
- `autoComplete` - Autocomplete attribute
- `value` - Nilai input (controlled component)
- `onChange` - Handler function untuk perubahan nilai

**Cara Pakai:**
```jsx
import Input from '@/components/auth/Input';

<Input
  id="email"
  name="email"
  type="email"
  label="E-mail"
  placeholder="Masukkan email Anda"
  required
  value={formData.email}
  onChange={handleChange}
/>
```

### 3. **Button.jsx**
Komponen button yang reusable dengan berbagai variant.

**Props:**
- `type` - Type button (submit, button) - default: 'button'
- `variant` - Variant style (primary, secondary, google) - default: 'primary'
- `onClick` - Handler function untuk click event
- `children` - Konten/text button
- `fullWidth` - Boolean, apakah button full width - default: true
- `icon` - React component untuk icon (optional)

**Cara Pakai:**
```jsx
import Button from '@/components/auth/Button';

{/* Primary button */}
<Button type="submit" variant="primary">
  Login
</Button>

{/* Button dengan icon */}
<Button 
  type="button" 
  variant="google"
  onClick={handleGoogleLogin}
  icon={<GoogleIcon />}
>
  Sign in with Google
</Button>
```

### 4. **Separator.jsx**
Komponen garis pemisah dengan text "atau" di tengah.

**Props:**
- `text` - Text yang ditampilkan (default: 'atau')

**Cara Pakai:**
```jsx
import Separator from '@/components/auth/Separator';

<Separator />
{/* atau */}
<Separator text="or" />
```

### 5. **GoogleIcon.jsx**
Komponen SVG icon Google yang siap pakai.

**Cara Pakai:**
```jsx
import GoogleIcon from '@/components/auth/GoogleIcon';

<GoogleIcon />
```

## Keuntungan Struktur Ini

1. **Reusable** - Komponen dapat digunakan di berbagai halaman
2. **Maintainable** - Mudah untuk update styling di satu tempat
3. **Consistent** - Tampilan konsisten di semua halaman
4. **Clean Code** - Code lebih bersih dan mudah dibaca
5. **Next.js Best Practice** - Menggunakan fitur Next.js dengan optimal

## Next.js Features yang Digunakan

1. **`'use client'`** - Directive untuk client-side component (karena menggunakan state & event handlers)
2. **`Link` component** - Untuk navigasi antar halaman tanpa full page reload
3. **`@/` alias** - Import path alias yang lebih clean
4. **File-based routing** - Setiap folder di `app/` menjadi route otomatis

## Cara Navigasi Antar Halaman

Gunakan `Link` dari `next/link` untuk navigasi:

```jsx
import Link from 'next/link';

{/* Navigasi ke halaman login */}
<Link href="/auth/login">
  Login
</Link>

{/* Navigasi ke halaman register */}
<Link href="/auth/register">
  Register
</Link>

{/* Navigasi ke forgot password */}
<Link href="/auth/forgotPassword">
  Lupa Password?
</Link>
```

**Keuntungan menggunakan Link:**
- Lebih cepat (client-side navigation)
- Tidak reload seluruh halaman
- Prefetching otomatis
- SEO friendly

## State Management

Setiap halaman menggunakan `useState` untuk manage form data:

```jsx
const [formData, setFormData] = useState({
  email: '',
  password: ''
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
```

## Next Steps

1. Implementasi API integration untuk login/register
2. Tambahkan form validation (bisa pakai library seperti Zod atau React Hook Form)
3. Implementasi Google OAuth
4. Tambahkan loading state
5. Tambahkan error handling
6. Buat halaman dashboard setelah login berhasil

