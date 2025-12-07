"use client";
import React, { useEffect, useState } from 'react';
import api from '@lib/api.js';
import Button from '@ds/Button';
import { RightArrowIcon } from '@ds/icons';

export default function Profile() {
  // System data
  const [systemData, setSystemData] = useState({
    deskripsi_hero: 'Buat pawrent, nggak ada yang lebih tenang selain tahu hewan kesayangannya sehat. Klinik Dokter Fanina hadir buat bantu jaga mereka tetap ceria. Mulai dari vaksin, check-up, sampai perawatan kecil yang sering terlupa.',
    foto_card: '/images/foto-dokter.png',
    phone: '',
    whatsapp_template: '' //  Add template field
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isTextHovered, setIsTextHovered] = useState(false);

  const photoCardBorder = '/Assets/photoCard-border-only.svg';

  //  Fetch system info
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const sysRes = await api.get('/api/system-info');
        console.log('📦 System Info:', sysRes.data);

        setSystemData({
          deskripsi_hero: sysRes.data.systemInfo?.deskripsi_hero || 'Buat pawrent...',
          foto_card: sysRes.data.systemInfo?.foto_card || '/images/foto-dokter.png',
          phone: sysRes.data.systemInfo?.phone || '',
          whatsapp_template: sysRes.data.systemInfo?.whatsapp_template || '', //  Get template
        });

      } catch (err) {
        console.error('❌ Error fetching system info:', err);
        
        setSystemData({
          deskripsi_hero: 'Buat pawrent...',
          foto_card: '/images/foto-dokter.png',
          phone: '',
          whatsapp_template: '', //  Default empty
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  //  Handle Direct WhatsApp - Use Dynamic Template
  const handleOpenWhatsApp = () => {
    try {
      console.log('📱 Opening WhatsApp...');
      console.log('📞 Clinic phone:', systemData.phone);

      //  Validate clinic phone exists
      if (!systemData.phone) {
        alert('❌ Nomor WhatsApp klinik belum tersedia. Silakan hubungi admin.');
        return;
      }

      //  Clean & format clinic's phone number
      const cleanNumber = systemData.phone.replace(/[\s\-\+]/g, '');
      let formattedNumber = cleanNumber;
      
      if (cleanNumber.startsWith('0')) {
        formattedNumber = '62' + cleanNumber.substring(1);
      } else if (!cleanNumber.startsWith('62')) {
        formattedNumber = '62' + cleanNumber;
      }

      //  Validate format
      if (!/^62\d{9,12}$/.test(formattedNumber)) {
        alert('❌ Format nomor WhatsApp klinik tidak valid. Hubungi admin.');
        console.error('Invalid clinic number:', formattedNumber);
        return;
      }

      console.log('📱 Formatted clinic number:', formattedNumber);

      //  Use dynamic template from database OR fallback to default
      const messageTemplate = systemData.whatsapp_template || 
        `Halo Klinik Dokter Fanina! 👋\n\n` +
        `Saya ingin membuat reservasi untuk pemeriksaan hewan peliharaan saya.\n\n` +
        `Mohon informasi lebih lanjut mengenai:\n` +
        `• Jadwal yang tersedia\n` +
        `• Jenis layanan yang ditawarkan\n` +
        `• Estimasi biaya pemeriksaan\n\n` +
        `Terima kasih! 🐾`;

      console.log('📝 Message template:', messageTemplate);

      //  Encode message for URL
      const encodedMessage = encodeURIComponent(messageTemplate);

      //  Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
      
      console.log('🚀 WhatsApp URL:', whatsappUrl);

      //  Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      console.log(' WhatsApp opened successfully');

    } catch (err) {
      console.error('❌ Error opening WhatsApp:', err);
      alert('❌ Gagal membuka WhatsApp. Silakan coba lagi.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto lg:py-16 pb-24 lg:pb-16 relative z-10">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col pt-8 lg:gap-4 gap-2 lg:items-start items-center relative z-20">
            <h1 className="lg:text-h-4 text-h-7 font-bold text-accent-neutral-1000">
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

            {isLoading ? (
              <div className="space-y-2 w-full">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            ) : (
              <p className="lg:text-body-1 text-body-2 font-base text-accent-neutral-1000 mb-4 text-center lg:text-left">
                {systemData.deskripsi_hero}
              </p>
            )}

            <Button
              onClick={handleOpenWhatsApp} 
              icon={<RightArrowIcon className="h-4 w-4" />} 
              iconPosition="right"
              roundedClass="rounded-md"
              color="bg-accent-yellow-300" 
              hoverColor="hover:bg-accent-yellow-500"
              focusColor="focus:bg-accent-yellow-400"
              label="Reservasi via WhatsApp"
              textColor="text-accent-neutral-1000"
              textSize="text-body-2 font-semibold"
            >
              Reservasi Sekarang
            </Button>
          </div>

          {/* Right Content - Photo Card */}
          <div className="hidden lg:flex lg:justify-center lg:justify-end"> 
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
              <div 
                className="relative"
                style={{ 
                  width: '220px',
                  height: '300px',
                  maxWidth: '100%',
                  aspectRatio: '250 / 343',
                }}
              >
                <div 
                  className="absolute inset-0"
                  style={{ 
                    backgroundColor: 'white',
                    borderRadius: '0px 50px 10px 10px',
                    zIndex: 0,
                  }}
                />
                
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
                        e.target.src = '/images/foto-dokter.png';
                      }}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                
                <img 
                  src={photoCardBorder} 
                  alt="Card Border" 
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

      {/* Selendang Section - Layered */}
      <div className="relative  z-30" style={{ 
        height: 'auto', 
        width: '120vw', 
        marginLeft: 'calc(-60vw + 50%)',
        maxWidth: 'none'
      }}>
      
        {/* Selendang Bawah - animasi kiri ke kanan */}
        <img
          src="/Assets/selendang-bawah.webp"
          alt="Selendang Bawah"
          className="w-full h-auto object-cover block"
          style={{ 
            display: 'block', 
            width: '180%', 
            marginLeft: '-5%',
            animation: 'slideLeftToRight 10s cubic-bezier(0.6, 0, 0.4, 1) infinite'
          }}
        />
        {/* Selendang Atas - animasi kanan ke kiri */}
        <img
          src="/Assets/selendang-atas.webp"
          alt="Selendang Atas"
          className="w-full h-auto object-cover absolute top-0 left-0"
          style={{ 
            width: '95%',
            animation: 'slideRightToLeft 10s cubic-bezier(0.6, 0, 0.4, 1) infinite'
          }}
        />
      </div>
    </div>
  );
}
