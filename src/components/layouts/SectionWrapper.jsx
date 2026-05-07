import React from 'react';
import { DashedBorder } from '@/components/ui/frame/garisputus';

export default function SectionWrapper({ 
  children, 
  bgImage = "/Background/bg-green-bone.svg", 
  bgColorClass = "bg-accent-yellow-400",
  className }) {
    return (
      <div className={`relative w-full `}>
        <div
        className={`w-full py-2 ${bgColorClass}`}
        style={{
          backgroundImage: `url('${bgImage}')`,  
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        >
          < DashedBorder className="w-full h-5 relative z-[5]" />
          <div className="container mx-auto px-4">
          {children}
          </div>
          < DashedBorder className="w-full h-5 relative z-[5]" />

        </div>
      </div>

    )

  };
