"use client";
import React, { useState } from 'react';
import Button from '@ds/Button';
import { RightArrowIcon } from '@ds/icons';
  

export default function Profile() {
  const [systemData, setSystemData] = useState({
    deskripsiHero: `Buat pawrent, nggak ada yang lebih tenang selain tahu hewan kesayangannya sehat. Klinik Dokter Fanina hadir buat bantu jaga mereka tetap ceria. Mulai dari vaksin, check-up, sampai perawatan kecil yang sering terlupa.`,
    photoCard: '/images/foto-dokter.png',
   
  });
  
  // Debug: Log path
  console.log('Photo path:', systemData.photoCard);
  const [isHovered, setIsHovered] = useState(false);
  const [isTextHovered, setIsTextHovered] = useState(false);
  const photoCardBorder = '/Assets/photoCard-border-only.svg';

  return (
    <div className="max-w-7xl mx-auto py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col gap-4 items-start">
            <h1 className="text-h-4 font-bold text-accent-neutral-1000">
              Halo{' '}
              <span 
                className="cursor-pointer transition-colors duration-300"
                style={{
                  color: isTextHovered ? 'rgb(106, 193, 255)' : 'rgb(51, 51, 51)',
                }}
                onMouseEnter={() => setIsTextHovered(true)}
                onMouseLeave={() => setIsTextHovered(false)}
              >
                Pawrents!
              </span> 
            </h1>
            <p className="text-body-1 font-base text-accent-neutral-1000 mb-4">
              {systemData.deskripsiHero}
            </p>
            <Button 
              icon={<RightArrowIcon className="h-4 w-4" />} 
              iconPosition="right"
              roundedClass="rounded-md"
              color="bg-accent-yellow-300" 
              hoverColor="hover:bg-accent-yellow-500"
              focusColor="focus:bg-accent-yellow-400"
              label="Reservasi sekarang"
              textColor="text-accent-neutral-1000"
              textSize="text-body-2 font-semibold"
            >
              Reservasi Sekarang
            </Button>
          </div>

          {/* Right Content - Photo Card */}
          <div className="flex justify-center md:justify-end"> 
            <div 
              className="cursor-pointer transition-all duration-300 ease-in-out relative"
              style={{
                transform: isHovered 
                  ? 'rotate(10deg) translateX(0px)' 
                  : 'rotate(0deg) translateX(0px)',
                filter: isHovered 
                  ? 'drop-shadow(6.25px 14px 35.9px #1FA2FF) drop-shadow(9px 16px 0px rgba(0,91,156,0.2)) drop-shadow(0px 2.5px 2.5px rgba(0,0,0,0.25))'
                  : 'none',
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Container untuk foto dan card - fleksibel dengan aspect ratio */}
              <div 
                className="relative"
                style={{ 
                  width: '220px',
                  height: '300px',
                  maxWidth: '100%',
                  aspectRatio: '250 / 343',
                }}
              >
                {/* Background putih untuk card */}
                <div 
                  className="absolute inset-0"
                  style={{ 
                    backgroundColor: 'white',
                    borderRadius: '0px 50px 10px 10px',
                    zIndex: 0,
                  }}
                />
                
                {/* Container untuk foto dengan padding dari border */}
                <div
                  className="absolute overflow-hidden"
                  style={{
                    top: '30px',
                    left: '35px',
                    right: '35px',
                    bottom: '30px',
                    borderRadius: '3px',
                    zIndex: 1,
                    // backgroundColor: '#f9f9f9', // Fallback background jika foto tidak load
                  }}
                >
                  {/* Foto Dokter - object-contain untuk menjaga proporsi */}
                  <img 
                    src={systemData.photoCard} 
                    alt="Dokter" 
                    onError={(e) => {
                      console.error('Foto tidak ditemukan');
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => console.log('Foto berhasil dimuat!')}
                    className="w-full h-full object-contain"
                    style={{
                      display: 'block',
                    }}
                  />
                </div>
                
                {/* SVG Card border dashed di atas foto - hanya border, tanpa background */}
                <img 
                  src={photoCardBorder} 
                  alt="Card Border" 
                  onError={(e) => {
                    console.error('Card border SVG tidak ditemukan');
                  }}
                  onLoad={() => console.log('Card border berhasil dimuat')}
                  className="absolute left-0 w-full h-full"
                  style={{
                    zIndex: 2,
                    pointerEvents: 'none',
                    objectFit: 'contain',
                  }}
                />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
