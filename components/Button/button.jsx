
'use client'; 

import React from 'react';
import PropTypes from 'prop-types';

export default function Button({
  type = 'button',
  variant = 'primary',
  size = 'md', // 
  onClick,
  children,
  fullWidth = false,
  disabled = false,
  icon,
  className = '', 
  ...props
}) {
  

  const baseClasses = `
    inline-flex items-center justify-center 
    gap-[8px] 
    rounded-[6px] 
    font-medium 
    transition duration-150 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    whitespace-nowrap 
  `; 
  
  // 2. LOGIKA UKURAN (SIZE CLASSES): Mengatur Padding dan Font Size
  let sizeClasses;
  
  switch (size) {
    case 'sm': // Small: Lebih kecil dari desain Anda
      sizeClasses = 'py-1.5 px-3 text-sm'; 
      break;
    case 'lg': // Large: Lebih besar
      sizeClasses = 'py-3 px-6 text-lg';
      break;
    case 'md': // Medium/Default: Sesuai spesifikasi desain Anda (8px, 14px)
    default:
      sizeClasses = 'py-[8px] px-[14px] text-base';
      break;
  }
  
  // 3. LOGIKA VARIANT (WARNA, BORDER, SHADOW)
  const variantClasses = {
    primary: `
       bg-accent-blue-400
      border border-accent-blue-400  text-white
      shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]
      hover:bg-blue-600 hover:border-blue-600
      focus:ring-[#0081DD]
    `,
    secondary: `
      border border-gray-300 bg-white text-gray-800 
      shadow-sm
      hover:bg-gray-50
      focus:ring-gray-400
    `,
    // Anda bisa tambahkan 'ghost', 'danger', dll. di sini
  };
  
  // 4. LOGIKA LAIN-LAIN (WIDTH & DISABLED)
  const widthClass = fullWidth ? 'w-full' : 'w-fit'; 
  const isDisabled = disabled || props.disabled;
  
  const disabledClasses = isDisabled ? 
    'bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed opacity-70 shadow-none pointer-events-none' 
    : variantClasses[variant];
  
  
  // PENTING: Menggabungkan semua class
  const finalClasses = `${baseClasses} ${sizeClasses} ${widthClass} ${disabledClasses} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      // Semua class digabungkan di sini
      className={finalClasses} 
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
}

// Tambahkan Size ke PropTypes
Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']), // <-- Size baru
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    icon: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
};