import React from 'react';

/**

 * @param {ReactNode} children - Konten yang akan ditampilkan
 */
export default function AuthLayout({ children }) {
  const svgBackground = "/Background/login.svg";
  
  const baseClasses = "flex min-h-screen items-center justify-center p-4 bg-repeat bg-fixed";
  
  const backgroundStyle = {
    backgroundImage: `url('${svgBackground}')`,
  };
// ini card
  return (
    <div 
      className={baseClasses}
      style={backgroundStyle}
    >
      <div className="w-full max-w-[35.375rem]
      
          rounded-xl bg-white 
          pt-[0.875rem]        
          pr-[1.6rem]         
          pb-[2rem]             
          pl-[1.6rem]        
          shadow-2xl">
        {children}
      </div>
    </div>
  );
}

