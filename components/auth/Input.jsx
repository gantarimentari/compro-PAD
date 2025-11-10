import React from 'react';

/**
 * Komponen Input yang reusable untuk semua form
 * @param {string} id - ID untuk input field
 * @param {string} name - Name untuk input field
 * @param {string} type - Type input (text, email, password, dll)
 * @param {string} label - Label yang ditampilkan
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Apakah field wajib diisi
 * @param {string} autoComplete - Autocomplete attribute
 * @param {function} onChange - Handler untuk perubahan nilai
 * @param {string} value - Nilai input
 */
export default function Input({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  required = false,
  autoComplete,
  onChange,
  value
}) {
  return (
    <div>
      <label htmlFor={id} className="block mb-1.5 text-body-1 font-medium text-accent-neutral-1000">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        className="
                      block w-full                    
                      h-[4.125rem]                     
                      border-[0.0625rem] border-accent-yellow-300
                      rounded-[0.625rem]
                      shadow-e2
                      text-body-1 
                      
                      focus:border-accent-yellow-300 focus:ring-primary-orange
                      
                      px-3                           
                    "
        placeholder={placeholder}
      />
    </div>
  );
}

