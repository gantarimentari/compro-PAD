# Quick Commands Reference (Windows PowerShell)

## 🔥 Command untuk Clear Cache & Restart

### ❌ SALAH (ini untuk CMD, bukan PowerShell)
```bash
rmdir /s /q .next
```

### ✅ BENAR (untuk PowerShell)
```powershell
# Hapus folder .next
Remove-Item -Recurse -Force .next

# Atau versi singkat:
rm -r -force .next
```

## 🚀 Langkah Lengkap Troubleshooting

### Jika Design Token atau Styling Tidak Berfungsi:

```powershell
# 1. Stop development server
# Tekan: Ctrl + C di terminal

# 2. Hapus cache Next.js
Remove-Item -Recurse -Force .next

# 3. Restart development server
npm run dev

# 4. Buka browser dan hard refresh:
# Windows: Ctrl + Shift + R
# Atau: Ctrl + F5
```

## 📦 Command NPM Umum

```powershell
# Install dependencies
npm install

# Run development server
npm run dev

# Build untuk production
npm run build

# Start production server
npm start

# Install package baru
npm install nama-package

# Install dev dependency
npm install --save-dev nama-package

# Uninstall package
npm uninstall nama-package
```

## 🧹 Clear All Cache (Deep Clean)

Jika masih ada masalah setelah clear .next:

```powershell
# 1. Stop development server (Ctrl+C)

# 2. Hapus semua cache
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 3. Install ulang dependencies
npm install

# 4. Restart server
npm run dev
```

⚠️ **Warning:** Deep clean akan hapus semua node_modules dan install ulang (butuh waktu ~5-10 menit)

## 🔍 Check Node & NPM Version

```powershell
node --version
npm --version
```

## 📝 Git Commands (Bonus)

```powershell
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "pesan commit"

# Push
git push origin main

# Pull
git pull origin main

# Create new branch
git checkout -b nama-branch

# Switch branch
git checkout nama-branch
```

## 🎯 Quick Fix untuk Error Module Not Found

Jika muncul error `Module not found: Can't resolve '@ds/auth/...'`:

```powershell
# 1. Pastikan jsconfig.json sudah benar
# 2. Clear cache
Remove-Item -Recurse -Force .next

# 3. Restart IDE/Editor (VS Code/Cursor)
# File > Exit, lalu buka lagi

# 4. Restart development server
npm run dev
```

## 💡 Tips PowerShell

### Tab Completion
Ketik beberapa huruf pertama, lalu tekan `Tab` untuk autocomplete:
```powershell
npm r[Tab]  # akan jadi "npm run"
npm run d[Tab]  # akan jadi "npm run dev"
```

### Clear Terminal
```powershell
cls
# atau
clear
```

### Check apakah folder ada
```powershell
Test-Path .next
# Output: True (ada) atau False (tidak ada)
```

### List files di folder
```powershell
Get-ChildItem
# atau versi singkat:
ls
```

---

## 🆘 Troubleshooting Common Errors

### Error: `text-h-4` menampilkan 16px bukan 54px

**Solusi:**
```powershell
Remove-Item -Recurse -Force .next
npm run dev
# Lalu hard refresh browser (Ctrl+Shift+R)
```

### Error: `Module not found: Can't resolve '@ds/...'`

**Solusi:**
1. Cek `jsconfig.json` - pastikan ada `"@ds/*": ["components/*"]`
2. Restart IDE/Editor
3. Clear cache dan restart server

### Error: Port 3000 already in use

**Solusi:**
```powershell
# Kill process di port 3000
npx kill-port 3000

# Atau run di port lain
$env:PORT=3001; npm run dev
```

### Error: Permission Denied (EPERM)

**Solusi:**
1. Close semua aplikasi yang mungkin mengakses folder project
2. Run PowerShell as Administrator
3. Atau restart komputer

---

**Saved for quick reference! 📌**

