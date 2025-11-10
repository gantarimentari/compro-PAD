# 🎨 Icons Component - Quick Guide

## ✅ Icons Sudah Siap!

Semua icons sekarang tersimpan di component global yang mudah digunakan dan di-maintain!

---

## 📁 File Structure

```
components/icons/
├── SocialIcons.jsx   # 7 social media icons
├── UIIcons.jsx       # 12 UI icons
├── index.js          # Central export
└── README.md         # Full documentation
```

---

## 🚀 Quick Start

### Import & Gunakan

```jsx
import { YoutubeIcon, LocationIcon, ClockIcon } from '@ds/icons';

function MyComponent() {
  return (
    <div>
      <YoutubeIcon className="w-6 h-6" />
      <LocationIcon className="w-6 h-6" />
      <ClockIcon className="w-6 h-6" />
    </div>
  );
}
```

---

## 📋 Available Icons

### Social Media (7 icons)
- `YoutubeIcon`
- `InstagramIcon`
- `TwitterIcon`
- `TiktokIcon`
- `LinkedinIcon`
- `WhatsappIcon`
- `FacebookIcon`

### UI Icons (12 icons)
- `LocationIcon`
- `ClockIcon`
- `PhoneIcon`
- `EmailIcon`
- `MapIcon`
- `MenuIcon`
- `CloseIcon`
- `ArrowRightIcon`
- `CheckIcon`
- `SearchIcon`
- `UserIcon`
- `CalendarIcon`

---

## 💡 Usage Examples

### 1. Social Media Links
```jsx
import { YoutubeIcon, InstagramIcon } from '@ds/icons';

<a href="https://youtube.com">
  <YoutubeIcon className="w-6 h-6 text-red-600" />
</a>
```

### 2. Contact Info
```jsx
import { PhoneIcon, LocationIcon } from '@ds/icons';

<div className="flex items-center gap-2">
  <PhoneIcon className="w-5 h-5" />
  <span>+62-123-4567-8999</span>
</div>
```

### 3. Dynamic Icons (dari CMS)
```jsx
import { getSocialIcon } from '@ds/icons';

{socialMedia.map((item) => (
  <a href={item.url}>
    {getSocialIcon(item.icon, { className: 'w-5 h-5' })}
  </a>
))}
```

---

## ⚙️ Props

Semua icons menerima:
- `className` - Tailwind classes
- `color` - Warna (default: "currentColor")

```jsx
<YoutubeIcon className="w-8 h-8 text-red-600 hover:scale-110" />
```

---

## ✨ Benefits

1. **Centralized** - Semua icons di satu tempat
2. **Easy to Use** - Import dan gunakan langsung
3. **Maintainable** - Mudah update atau tambah icon baru
4. **Type-safe** - Clear component names
5. **Performant** - SVG inline, no external requests
6. **Flexible** - Support Tailwind styling

---

## 🔄 Migration

### Before (Inline SVG)
```jsx
<svg className="w-6 h-6" viewBox="0 0 24 24">
  <path d="..." />
</svg>
```

### After (Component)
```jsx
import { YoutubeIcon } from '@ds/icons';

<YoutubeIcon className="w-6 h-6" />
```

---

## 📚 Full Documentation

Lihat `components/icons/README.md` untuk:
- Complete icons list
- Detailed examples
- How to add new icons
- Styling tips
- Best practices

---

## ✅ Already Updated

Footer component sudah menggunakan icons dari global component!

```jsx
import { LocationIcon, ClockIcon, PhoneIcon, getSocialIcon } from '@ds/icons';
```

---

**Status**: ✅ Ready to Use  
**Total Icons**: 19 icons  
**Documentation**: `components/icons/README.md`





