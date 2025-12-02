"use client";
import React from 'react';
import Button from './Button';

/**
 * TentangLabel
 * Komponen label tombol "Tentang" dengan border putus-putus seperti desain.
 * Bisa digunakan ulang di halaman lain dengan mengubah teks melalui prop `label`.
 */
export default function TagLabel({ label = 'Tentang', className = '' }) {
  return (
    <div className={`relative shadow-e2 inline-block bg-white rounded-lg border-[1px] border-accent-yellow-300 ${className}`}>
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
          stroke="rgb(255, 171, 47)"
          strokeWidth="1.2"
          strokeDasharray="10 4 3 6 6 4"
        />
      </svg>

      <Button
        type="button"
        color="bg-transparent"
        textColor="text-accent-neutral-1000"
        textSize="text-h-7 font-bold"
        rounded="lg"
        className="relative z-10 px-3 py-2 shadow-none hover:shadow-none focus:ring-0"
      >
        {label}
      </Button>
    </div>
  );
}


