import React from 'react';

/**

 * @param {ReactNode} children - Konten yang akan ditampilkan
 */
export default function AuthLayout({ children }) {
  const svgBackground = "/Background/login.svg";
  
  const baseClasses = "flex min-h-screen items-center justify-center px-4 py-6 bg-repeat bg-fixed";

  const backgroundStyle = {
    backgroundImage: `url('${svgBackground}')`,
  };
// ini card
  return (
    <div 
      className={baseClasses}
      style={backgroundStyle}
    >
      <div className="w-full max-w-[300px] sm:max-w-[35.375rem]
          rounded-md sm:rounded-xl bg-white 
          px-4 sm:px-[1.6rem]
          py-3 sm:pt-[0.875rem] sm:pb-[2rem]
          shadow-lg">
        {children}
      </div>
    </div>
  );
}

