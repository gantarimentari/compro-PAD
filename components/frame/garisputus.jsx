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

export default FrameGarisPutus;