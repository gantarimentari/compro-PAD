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
  buttonClass = 'px-4 py-2',
  showDashed = true,
}) {
  return (
    <div
      className={`relative shadow-e2 inline-block rounded-lg border-[1px] ${bgClass} ${borderClass} ${className}`}
    >
      {showDashed && (
        <svg
          className="absolute pointer-events-none block"
          style={{
            left: '4px',
            top: '4px',
            right: '4px',
            bottom: '4px',
            width: 'calc(100% - 8px)',
            height: 'calc(100% - 8px)',
          }}
          preserveAspectRatio="none"
        >
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="5"
            ry="5"
            stroke={strokeColor}
            strokeWidth="1"
            strokeDasharray="20 4 3 6 6 4"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}

      <button
        className={`relative z-10 shadow-none hover:shadow-none focus:ring-0 ${textClass} ${buttonClass}`}
      >
        {label}
      </button>
    </div>
  );
}

