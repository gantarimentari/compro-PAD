// @ds/auth/Button.jsx

/**
 * Komponen Button yang reusable
 * Menggunakan token Design System: Tinggi 60px, Radius 8px
 */
export default function Button({
  type = 'button',
  variant = 'primary',
  onClick,
  children,
  fullWidth = true, // Diabaikan di sini, w-full diatur di class
  icon
}) {
  
  // 1. BASE CLASSES: Mengatur tata letak dan ukuran standar dari Design System
  const baseClasses = `
    flex justify-center items-center 
    text-body-1 font-semibold            /* Font Style dari Design System (misal: 18px Bold) */
    h-[3.75rem]                          /* Tinggi Tombol: 60px */
    rounded-[0.5rem]                     /* Radius: 8px */
    px-8                                 /* Padding horizontal yang cukup */
    shadow-e1                            /* Menggunakan Shadow E1 kustom */
    transition duration-150 
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `; 
  
  // 2. VARIANT CLASSES: Mengatur Warna
  const variantClasses = {
    primary: `
      border-transparent 
      bg-accent-yellow-300             /* Oranye/Kuning Aksen */
      text-accent-neutral-1000          /* Teks Putih */
      hover:bg-accent-yellow-400       /* Hover sedikit lebih gelap */
      focus:ring-accent-yellow-400     /* Ring fokus menggunakan warna aksen */
    `,
    secondary: `
      border border-accent-neutral-300 
      bg-accent-neutral-100            /* Latar Belakang Putih */
      text-accent-neutral-800          /* Teks Abu-abu Gelap */
      hover:bg-accent-neutral-200
      focus:ring-accent-neutral-400
    `,
    google: `
      border border-accent-neutral-300 
      bg-accent-neutral-100 
      text-black 
      hover:bg-accent-neutral-200
      focus:ring-accent-neutral-400
      text-h-7
      px-7

    `,
  };
  

  const widthClass = `w-full max-w-[33.25rem]`; 
  
  return (
    <button
      type={type}
      onClick={onClick}
      // Gabungkan semua class. Perhatikan penggunaan template literals (backticks)
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`} 
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}