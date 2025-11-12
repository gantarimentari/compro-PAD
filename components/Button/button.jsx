"use client";
import React from 'react';

/**
 * Button Component
 * Digunakan untuk tombol dengan icon dan/atau text
 * Icon akan otomatis diubah menjadi warna putih agar terlihat jelas di atas latar belakang berwarna.
 */
export default function Button({ 
  icon, 
  color, 
  onClick, 
  label, 
  hoverColor, 
  focusColor, 
  size, 
  rounded = 'full',
  roundedClass,
  className = '',
  children 
}) {
  
  // Mapping untuk rounded class - gunakan roundedClass jika ada, atau gunakan rounded prop
  let finalRoundedClass;
  if (roundedClass) {
    finalRoundedClass = roundedClass;
  } else {
    finalRoundedClass = rounded === 'full' ? 'rounded-full' : rounded === 'lg' ? 'rounded-lg' : 'rounded-md';
  }
  
  // Jika tidak ada icon dan tidak ada children, return button kosong
  if (!icon && !children) {
    return (
      <button
        type="button" 
        onClick={onClick}
        aria-label={label}
        className={` 
          p-2 ${color} ${finalRoundedClass}
          flex items-center justify-center text-white
          transition duration-150 hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-accent-blue-150 
          ${focusColor || ''} 
          ${hoverColor || ''} 
          ${size || ''}
          ${className}
        `}
      >
      </button>
    );
  }

  // Kloning icon dan atur warnanya menjadi putih jika icon ada
  let iconWithColor = null;
  if (icon) {
    iconWithColor = React.cloneElement(icon, { 
      color: 'white',
      className: icon.props?.className || 'w-5 h-5'
    });
  }

  // Jika ada children (text), gunakan padding yang lebih besar
  const paddingClass = children ? 'px-4 py-2' : 'p-2';
  // Gunakan gap untuk spacing antara icon dan text
  const gapClass = icon && children ? 'gap-2' : '';

  return (
    <button
      type="button" 
      onClick={onClick}
      aria-label={label || (typeof children === 'string' ? children : undefined)}
      className={` 
        ${paddingClass} ${color} ${finalRoundedClass}
        flex items-center justify-center text-white
        transition duration-150 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-accent-blue-150 
        ${focusColor || ''} 
        ${hoverColor || ''} 
        ${size || ''}
        ${gapClass}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {iconWithColor}
      {children}
    </button>
  );
}