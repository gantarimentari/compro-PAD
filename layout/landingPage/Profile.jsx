"use client";
import React, { useEffect, useState } from 'react';
import api from '@lib/api.js';
import { sendWA } from '@lib/wa.js';
import Button from '@ds/Button';
import { RightArrowIcon } from '@ds/icons';

export default function Profile() {
  // Initialize with default values
  const [systemData, setSystemData] = useState({
    deskripsi_hero: 'Buat pawrent, nggak ada yang lebih tenang selain tahu hewan kesayangannya sehat. Klinik Dokter Fanina hadir buat bantu jaga mereka tetap ceria. Mulai dari vaksin, check-up, sampai perawatan kecil yang sering terlupa.',
    foto_card: '/images/foto-dokter.png',
    phone:''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isTextHovered, setIsTextHovered] = useState(false);

  const photoCardBorder = '/Assets/photoCard-border-only.svg';

  // fetch from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/api/system-info');

        console.log('📦 System Info (Profile):', res.data);

        // Use snake_case from backend with fallback
        setSystemData({
          deskripsi_hero: res.data.systemInfo?.deskripsi_hero,
          foto_card: res.data.systemInfo?.foto_card || '/images/foto-dokter.png',
          phone: res.data.systemInfo?.phone || '',
        });

      } catch (err) {
        console.error('❌ Error fetching profile:', err);
        
        // Keep default values on error
        setSystemData({
          deskripsi_hero: 'error',
          foto_card: '/images/foto-dokter.png',
          phone: '',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Handle WhatsApp CTA Button
  async function handleSendMessage() {
    try {
      console.log('📞 Starting WhatsApp send...');
      console.log('📱 System phone:', systemData.phone);
      
      // ✅ Validate phone exists
      if (!systemData.phone) {
        alert('❌ Nomor WhatsApp belum tersedia. Silakan hubungi admin untuk menambahkan nomor WhatsApp di System Info.');
        return;
      }

      // ✅ Clean & format phone number (remove spaces, dashes, plus)
      const cleanNumber = systemData.phone.replace(/[\s\-\+]/g, '');
      
      // ✅ Format to international (62xxx)
      let formattedNumber = cleanNumber;
      if (cleanNumber.startsWith('0')) {
        formattedNumber = '62' + cleanNumber.substring(1); // 081234 -> 6281234
      } else if (!cleanNumber.startsWith('62')) {
        formattedNumber = '62' + cleanNumber; // 81234 -> 6281234
      }

      console.log('📱 Clean number:', cleanNumber);
      console.log('📱 Formatted number:', formattedNumber);

      // ✅ CREATE PAYLOAD OBJECT
      const payload = {
        number: formattedNumber,
        text: "Halo! Saya tertarik untuk reservasi di Klinik Dokter Fanina. Mohon informasi lebih lanjut tentang layanan dan jadwal yang tersedia. Terima kasih!"
      };

      console.log('📤 Sending payload:', payload);

      // ✅ CALL sendWA with payload
      const response = await sendWA(payload);

      console.log("✅ WA API Response:", response);

      // ✅ Handle success/error response
      if (response.success || response.status === 200) {
        alert('✅ Pesan berhasil dikirim ke WhatsApp!');
      } else {
        throw new Error(response.error || response.message || 'Gagal mengirim pesan');
      }

    } catch (err) {
      console.error('❌ Error sending WhatsApp:', err);
      
      // ✅ Extract error message
      const errorMsg = err.response?.data?.message 
        || err.response?.data?.error
        || err.message 
        || 'Gagal mengirim pesan WhatsApp. Silakan coba lagi.';
      
      alert(`❌ ${errorMsg}`);
    }
  }


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

            {/* Show loading skeleton or actual content */}
            {isLoading ? (
              <div className="space-y-2 w-full">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            ) : (
              <p className="text-body-1 font-base text-accent-neutral-1000 mb-4">
                {systemData.deskripsi_hero}
              </p>
            )}

            <Button
              onClick={handleSendMessage} 
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
              {/* Container untuk foto dan card */}
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
                  }}
                >
                  {/* Loading state for image */}
                  {isLoading ? (
                    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                      <svg className="animate-spin h-8 w-8 text-gray-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                    </div>
                  ) : (
                    <img 
                      src={systemData.foto_card} 
                      alt="Dokter Hewan Fanina" 
                      onError={(e) => {
                        console.error('❌ Foto tidak ditemukan, using fallback');
                        e.target.src = '/images/foto-dokter.png';
                      }}
                      onLoad={() => console.log('✅ Foto berhasil dimuat:', systemData.foto_card)}
                      className="w-full h-full object-contain"
                      style={{
                        display: 'block',
                      }}
                    />
                  )}
                </div>
                
                {/* SVG Card border */}
                <img 
                  src={photoCardBorder} 
                  alt="Card Border" 
                  onError={(e) => {
                    console.error('❌ Card border SVG tidak ditemukan');
                  }}
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
