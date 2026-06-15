import React from 'react';
import { DashedBorder } from '@/components/ui/frame/garisputus';


/**
 * ArticleLayout - Layout untuk halaman artikel dengan background
 * @param {ReactNode} children - Konten yang akan ditampilkan
 */
export default function ArticleLayout({ children }) {
  const svgBackground = "/Background/bg-blue-bone.svg";
  
  const backgroundStyle = {
    backgroundImage: `url('${svgBackground}')`,
    backgroundColor: '#1FA2FF',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="relative w-full">
      <div style={backgroundStyle} className='w-full py-2'
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
