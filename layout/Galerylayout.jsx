import React from 'react';
import { DashedBorder } from '@ds/ui/frame/garisputus';

/**
 * GaleryLayout - Layout untuk halaman galeri dengan background dan garis putus-putus
 * @param {ReactNode} children - Konten yang akan ditampilkan
 */
export default function GaleryLayout({ children }) {
  const svgBackground = "/Background/bg-green-bone.svg";
  
  const backgroundStyle = {
    backgroundColor: 'rgb(15, 119, 116)', // bg-accent-green-500
    backgroundImage: `url('${svgBackground}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="relative w-full">
      {/* Konten dengan Background */}
      <div 
        className="w-full py-2 bg-accent-green-500"
        style={backgroundStyle}
      >
 < DashedBorder className="w-full h-5 relative z-[5]" />
        <div className="container mx-auto px-4">
          {children}
        </div>
        < DashedBorder className="w-full h-5 relative z-[5]" /> 
      </div>
    </div>
  );
}