import React from 'react';

/**
 * Komponen Separator dengan text "atau"

 */
export default function Separator({ text = 'atau' }) {
  return (
    // <div className="relative">
    //   <div className="absolute inset-0 flex items-center">
    //     <div className="w-full border-t border-gray-300" />
    //   </div>
    //   <div className="relative flex justify-center text-sm">
        <span className="bg-white relative flex justify-center  px-6 text-body-1 text-accent-neutral-700">
          {text}
        </span>
    //   </div>
    // </div>
  );
}

