import React from 'react';

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
      {/* Garis Putus-Putus Atas dengan SVG */}
      <svg width="100%" height="5" className="block">
        <line 
          x1="0" 
          y1="1.5" 
          x2="100%" 
          y2="1.5" 
          stroke="white" 
          strokeWidth="13" 
          strokeDasharray="70 30"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Konten dengan Background */}
      <div 
        className="w-full py-8 bg-accent-green-500"
        style={backgroundStyle}
      >
        <div className="container mx-auto px-4">
          {children}
        </div>
      </div>
      
      {/* Garis Putus-Putus Bawah dengan SVG */}
      <svg width="100%" height="3" className="block">
        <line 
          x1="0" 
          y1="1.5" 
          x2="100%" 
          y2="1.5" 
          stroke="white" 
          strokeWidth="13" 
          strokeDasharray="70 30"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}