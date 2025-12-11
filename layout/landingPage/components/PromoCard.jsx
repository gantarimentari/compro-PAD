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
    <div className={`relative ${bgClass} rounded-lg border-2 ${borderColor} shadow-lg p-4 overflow-hidden h-[170px] flex flex-col ${className}`}>
      
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
        className="absolute pointer-events-none z-[1]"
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

      
      <div className="relative p-3 z-10 flex flex-col h-full">
       
        <h3 className="text-h-7 font-bold text-accent-neutral-1000 mb-2">
          {title}
        </h3>
        
        
        <p className="text-body-3 text-accent-neutral-1000 leading-snug line-clamp-4">
          {description}
        </p>
      </div>
    </div>
  );
}
