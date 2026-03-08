# 🎨 Icons Component Library

component icons

---

## 📁 Structure

```
components/icons/
├── SocialIcons.jsx    # Social media icons (YouTube, Instagram, dll)
├── UIIcons.jsx        # UI icons (Location, Clock, Phone, dll)
├── index.js           # Central export
└── README.md          # Dokumentasi ini
```

---

## 🚀 Cara Menggunakan

### 1. Import Langsung (Recommended)

```jsx
import { YoutubeIcon, LocationIcon, ClockIcon } from '@ds/icons';

function MyComponent() {
  return (
    <div>
      <YoutubeIcon className="w-6 h-6 text-red-600" />
      <LocationIcon className="w-8 h-8 text-blue-500" />
      <ClockIcon className="w-5 h-5" />
    </div>
  );
}
```

### 2. Import dari File Spesifik

```jsx
import { YoutubeIcon, InstagramIcon } from '@ds/icons/SocialIcons';
import { LocationIcon, PhoneIcon } from '@ds/icons/UIIcons';
```

### 3. Menggunakan Helper Function

```jsx
import { getSocialIcon, getUIIcon } from '@ds/icons';

function MyComponent() {
  const iconName = 'youtube'; // dari database/props
  
  return (
    <div>
      {getSocialIcon(iconName, { className: 'w-6 h-6' })}
      {getUIIcon('location', { className: 'w-8 h-8 text-blue-500' })}
    </div>
  );
}
```

---

## 📋 Available Icons

### Social Media Icons

| Icon Name | Component | Usage |
|-----------|-----------|-------|
| YouTube | `YoutubeIcon` | `<YoutubeIcon />` |
| Instagram | `InstagramIcon` | `<InstagramIcon />` |
| Twitter/X | `TwitterIcon` | `<TwitterIcon />` |
| TikTok | `TiktokIcon` | `<TiktokIcon />` |
| LinkedIn | `LinkedinIcon` | `<LinkedinIcon />` |
| WhatsApp | `WhatsappIcon` | `<WhatsappIcon />` |
| Facebook | `FacebookIcon` | `<FacebookIcon />` |

### UI Icons

| Icon Name | Component | Usage |
|-----------|-----------|-------|
| Location | `LocationIcon` | `<LocationIcon />` |
| Clock | `ClockIcon` | `<ClockIcon />` |
| Phone | `PhoneIcon` | `<PhoneIcon />` |
| Email | `EmailIcon` | `<EmailIcon />` |
| Map | `MapIcon` | `<MapIcon />` |
| Menu | `MenuIcon` | `<MenuIcon />` |
| Close | `CloseIcon` | `<CloseIcon />` |
| Arrow Right | `ArrowRightIcon` | `<ArrowRightIcon />` |
| Check | `CheckIcon` | `<CheckIcon />` |
| Search | `SearchIcon` | `<SearchIcon />` |
| User | `UserIcon` | `<UserIcon />` |
| Calendar | `CalendarIcon` | `<CalendarIcon />` |

---

## ⚙️ Props

Semua icon component menerima props yang sama:

### `className` (optional)
- **Type**: `string`
- **Default**: `"w-5 h-5"` (untuk social icons) atau `"w-6 h-6"` (untuk UI icons)
- **Usage**: Tailwind classes untuk styling

```jsx
<YoutubeIcon className="w-8 h-8 text-red-600 hover:scale-110" />
```

### `color` (optional)
- **Type**: `string`
- **Default**: `"currentColor"`
- **Usage**: Set warna icon (tapi lebih baik pakai Tailwind `text-*` di className)

```jsx
<LocationIcon color="#FF5733" />
// atau lebih baik:
<LocationIcon className="text-red-500" />
```

---

## 💡 Examples

### Example 1: Social Media Links

```jsx
import { YoutubeIcon, InstagramIcon, TwitterIcon } from '@ds/icons';

function SocialLinks() {
  return (
    <div className="flex gap-3">
      <a href="https://youtube.com" className="text-red-600 hover:scale-110 transition">
        <YoutubeIcon className="w-6 h-6" />
      </a>
      <a href="https://instagram.com" className="text-pink-600 hover:scale-110 transition">
        <InstagramIcon className="w-6 h-6" />
      </a>
      <a href="https://twitter.com" className="text-blue-500 hover:scale-110 transition">
        <TwitterIcon className="w-6 h-6" />
      </a>
    </div>
  );
}
```

### Example 2: Contact Information

```jsx
import { LocationIcon, PhoneIcon, EmailIcon } from '@ds/icons';

function ContactInfo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <LocationIcon className="w-6 h-6 text-blue-600" />
        <span>Jl. Example No. 123</span>
      </div>
      
      <div className="flex items-center gap-3">
        <PhoneIcon className="w-6 h-6 text-green-600" />
        <span>+62-123-4567-8999</span>
      </div>
      
      <div className="flex items-center gap-3">
        <EmailIcon className="w-6 h-6 text-red-600" />
        <span>info@example.com</span>
      </div>
    </div>
  );
}
```

### Example 3: Dynamic Icons (dari CMS/Database)

```jsx
import { getSocialIcon } from '@ds/icons';

function DynamicSocialLinks({ socialMedia }) {
  return (
    <div className="flex gap-3">
      {socialMedia.map((item) => (
        <a 
          key={item.name}
          href={item.url}
          className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-yellow-300"
        >
          {getSocialIcon(item.icon, { className: 'w-5 h-5' })}
        </a>
      ))}
    </div>
  );
}

// Usage:
const socialData = [
  { name: 'YouTube', icon: 'youtube', url: 'https://youtube.com' },
  { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com' },
];

<DynamicSocialLinks socialMedia={socialData} />
```

### Example 4: Button dengan Icon

```jsx
import { ArrowRightIcon, CheckIcon } from '@ds/icons';

function Buttons() {
  return (
    <div className="space-x-4">
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
        <span>Next</span>
        <ArrowRightIcon className="w-4 h-4" />
      </button>
      
      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg">
        <CheckIcon className="w-4 h-4" />
        <span>Submit</span>
      </button>
    </div>
  );
}
```

---

## ➕ Menambah Icon Baru

### 1. Tambah di File yang Sesuai

Buka `SocialIcons.jsx` atau `UIIcons.jsx`:

```jsx
// Di SocialIcons.jsx
export const TelegramIcon = ({ className = "w-5 h-5", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill={color}>
    <path d="M... SVG path here..." />
  </svg>
);
```

### 2. Tambah ke Icon Map

```jsx
export const socialIconsMap = {
  // ... existing icons
  telegram: TelegramIcon,
};
```

### 3. Export di index.js

```jsx
export {
  // ... existing exports
  TelegramIcon,
} from './SocialIcons';
```

### 4. Gunakan!

```jsx
import { TelegramIcon } from '@ds/icons';

<TelegramIcon className="w-6 h-6 text-blue-500" />
```

---

## 🎨 Styling Tips

### Ukuran

```jsx
<Icon className="w-4 h-4" />   // Small (16px)
<Icon className="w-5 h-5" />   // Default (20px)
<Icon className="w-6 h-6" />   // Medium (24px)
<Icon className="w-8 h-8" />   // Large (32px)
<Icon className="w-12 h-12" /> // XL (48px)
```

### Warna

```jsx
<Icon className="text-blue-600" />
<Icon className="text-red-500" />
<Icon className="text-white" />
<Icon className="text-gray-700" />
```

### Hover Effects

```jsx
<Icon className="hover:text-blue-600 hover:scale-110 transition-all" />
<Icon className="hover:rotate-12 transition-transform" />
```

### Kombinasi

```jsx
<Icon className="w-6 h-6 text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-300" />
```

---

## 📚 Best Practices

1. **Gunakan Tailwind classes** untuk styling, bukan inline styles
2. **Consistent sizing** - gunakan ukuran yang konsisten di seluruh app
3. **Semantic naming** - pastikan nama icon jelas dan deskriptif
4. **Accessibility** - tambahkan `aria-label` untuk icon-only buttons:
   ```jsx
   <button aria-label="Open menu">
     <MenuIcon />
   </button>
   ```
5. **Performance** - icons sudah optimized sebagai SVG inline

---

## 🔍 Where Icons Are Used

- **Footer**: Social media icons, contact icons
- **Navigation**: Menu, close, search icons
- **Forms**: Check, arrow icons
- **CTA Buttons**: Arrow right icon
- **Contact sections**: Location, phone, email, clock icons

---

## 📞 Support

Jika butuh icon baru atau ada pertanyaan:
1. Check available icons list di atas
2. Lihat examples untuk usage patterns
3. Follow "Menambah Icon Baru" guide

---

**Last Updated**: October 30, 2025  
**Version**: 1.0.0  
**Total Icons**: 19 (7 social + 12 UI)

