
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
    text-body-1 font-semibold            
    h-[3.75rem]                          
    rounded-[0.5rem]                     
    shadow-e1                           
    transition duration-150 
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `; 
  
  // 2. VARIANT CLASSES: Mengatur Warna
  const variantClasses = {
    primary: `
      border-transparent 
      bg-accent-yellow-300            
      text-accent-neutral-1000         
      hover:bg-accent-yellow-400       
      focus:ring-accent-yellow-400     /* Ring fokus menggunakan warna aksen */
    `,
    secondary: `
      border border-accent-neutral-300 
      bg-accent-neutral-100            /* Latar Belakang Putih */
      text-accent-neutral-800          
      hover:bg-accent-neutral-200
      focus:ring-accent-neutral-400
    `,
    google: `
      border border-accent-yellow-300
      bg-accent-neutral-100 
      text-black 
      hover:bg-accent-neutral-200
      focus:ring-accent-neutral-400
      text-h-7
      py-8
      shadow-e2
      mb-4
      

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