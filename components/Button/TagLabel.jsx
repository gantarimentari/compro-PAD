"use client";
import React from 'react';

/**
 * TagLabel
 * Komponen label kecil seperti badge/tombol dengan border putus-putus.
 * Ukuran otomatis menyesuaikan dengan panjang teks, tapi tetap compact.
 *
 * Props:
 * - label: teks yang ditampilkan
 * - textClass: kelas Tailwind untuk styling teks (warna, ukuran, weight)
 * - bgClass: kelas Tailwind untuk background
 * - borderClass: kelas Tailwind untuk warna border
 * - strokeColor: warna stroke di SVG (border putus-putus)
 * - buttonClass: padding dan kelas tambahan untuk tombol
 * - showDashed: jika false, SVG border tidak dirender (hanya teks/button saja)
 */
export default function TagLabel({
  label = 'Tentang',
  className = '',
  textClass = 'text-accent-neutral-1000 text-h-7 font-bold',
  bgClass = 'bg-white',
  borderClass = 'border-accent-yellow-300',
  strokeColor = 'rgb(255, 171, 47)',
  buttonClass = 'px-3 py-2',
  showDashed = true,
}) {
  return (
    <div
      className={`relative shadow-e2 inline-block rounded-lg border-[1px] ${bgClass} ${borderClass} ${className}`}
    >
      {showDashed && (
        <svg
          className="absolute inset-0 z-0 pointer-events-none p-1 block"
          viewBox="0 0 100 40"
          fill="none"
          preserveAspectRatio="none"
        >
          <rect
            x="1"
            y="1"
            width="98"
            height="38"
            rx="5"
            stroke={strokeColor}
            strokeWidth="1.2"
            strokeDasharray="10 4 3 6 6 4"
          />
        </svg>
      )}

      <button
        className={`relative z-10 shadow-none hover:shadow-none focus:ring-0 whitespace-nowrap ${textClass} ${buttonClass}`}
      >
        {label}
      </button>
    </div>
  );
}

