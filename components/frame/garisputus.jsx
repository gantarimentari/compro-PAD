import React from 'react';


const FrameGarisPutus = ({ children }) => {
  return (
    <div className="relative w-full">
      {/* Garis Atas (Top Border) */}
      <div className="absolute top-0 left-0 right-0 h-px border-t-2 border-dashed border-white z-10"></div>
      
      {/* Konten */}
      {children}
      
      {/* Garis Bawah (Bottom Border) */}
      <div className="absolute bottom-0 left-0 right-0 h-px border-b-2 border-dashed border-white z-10"></div>
    </div>
  );
};

const DashedBorder = ({ className }) => {
  return (
    <svg width="100%" height="5" className="block" >
    
   
    <line 
      x1="0" 
      y1="1.5" 
      x2="100%"  
      y2="1.5" 
      stroke="white" 
      strokeWidth="5" 
      strokeDasharray="50 30"
      strokeLinecap="round"
    />
    
    
    <line 
      x1="0" 
      y1="1.5" 
      x2="100%" 
      y2="1.5" 
      stroke="white" 
      strokeWidth="5" 
      strokeDasharray="5 15" 
      strokeLinecap="round"
    />
    
  </svg>
  )
}
const ModalDashedBorder = ({ className="stroke-accent-yellow-300" }) => (
    <svg 
        className={className}
        width="100%" 
        height="100%" 
        viewBox="0 0 663 297" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
    >
    
    <rect
      x="8.9"
      y="7.9"
      width="645.2"
      height="282.2"
      rx="5.1"
      className={className}
      strokeWidth="1.8"
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeDasharray="18 8"
      vectorEffect="non-scaling-stroke"
    />
    </svg>
);

export { FrameGarisPutus, DashedBorder, ModalDashedBorder };