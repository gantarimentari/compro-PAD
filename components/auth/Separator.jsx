import React from 'react';

export default function Separator({ text = 'atau' }) {
  return (
    <div className="my-0">
       <span className="bg-white relative flex justify-center  px-4 py-4 text-body-1 text-accent-neutral-700">
         {text}
       </span>
    </div>
  );
}

