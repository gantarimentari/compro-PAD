"use client";
import React from 'react';


export default function PromoCard({
  title = "Diskon 90%",
  description = "Nikmati promo terbesar kami dalam rangka 11.11",
  bgClass = "bg-white",
  borderColor = "border-accent-yellow-300",
  strokeColor = "#FFAB2F",
  className = "",
}) {
  return (
    <div className={`relative ${bgClass} rounded-lg border-2 ${borderColor} shadow-lg p-3 sm:p-4 overflow-hidden h-[140px] sm:h-[170px] flex flex-col ${className}`}>
      
      <svg
        className="absolute pointer-events-none block"
        style={{
          left: '4px',
          top: '4px',
          right: '4px',
          bottom: '4px',
          width: 'calc(100% - 8px)',
          height: 'calc(100% - 8px)',
        }}
        preserveAspectRatio="none"
      >
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="12"
          ry="12"
          stroke={strokeColor}
          strokeWidth="2"
          strokeDasharray="20 4 3 6 6 4"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Ornamen Kuning Setengah - Pojok Kanan Atas */}
      <div 
        className="hidden sm:block absolute pointer-events-none z-[1]"
        style={{
          right: '-80px',
          top: '20px',
          width: '130px',
          height: '130px',
          backgroundImage: "url('/Assets/ornamen-promo.svg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
      <div 
        className=" sm:hidden absolute pointer-events-none z-[1]"
        style={{
          right: '-80px',
          top: '10px',
          width: '120px',
          height: '120px',
          backgroundImage: "url('/Assets/ornamen-promo.svg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      
      <div className="relative p-2 sm:p-3 z-10 flex flex-col h-full">
       
        <h3 className="text-body-1 sm:text-h-7 font-bold text-accent-neutral-1000 mb-1 sm:mb-2">
          {title}
        </h3>
        
        
        <p className="text-[12px] sm:text-body-2  text-accent-neutral-1000 leading-snug sm:line-clamp-4 line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
}
