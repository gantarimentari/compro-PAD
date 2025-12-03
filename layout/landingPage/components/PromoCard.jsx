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
    <div className={`relative ${bgClass} rounded-lg border-2 ${borderColor} shadow-lg p-6 overflow-hidden ${className}`}>
      
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
          right: '-75px',
          top: '15px',
          width: '140px',
          height: '140px',
          backgroundImage: "url('/Assets/ornamen-promo.svg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      
      <div className="relative z-10">
       
        <h3 className="text-h-7  font-bold text-accent-neutral-1000 mb-2">
          {title}
        </h3>
        
        
        <p className="text-body-3 m text-accent-neutral-1000 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
