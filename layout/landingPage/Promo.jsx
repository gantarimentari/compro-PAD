"use client";
import React, { useState, useEffect } from 'react';
import TagLabel from "@ds/Button/TagLabel";
import { DashedBorder } from '@ds/frame/garisputus';
import PromoCard from './components/PromoCard';
import api from '@lib/api';

export default function Promo() {
  const svgBackground = "/Background/bg-bone-blue.svg";
  
  const backgroundStyle = {
    backgroundImage: `url('${svgBackground}')`,
    backgroundColor: '#005B9C',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
  const [isCardHovered, setIsCardHovered] = useState(false);

  const [promoData, setPromoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPromos();
    fetchSystemInfo();
  }, []);

  // Fetch judul promo dari system info (Logic HEAD)
  const fetchSystemInfo = async () => {
    try {
      const response = await api.get('/api/system-info');
      
      const judul = response.data.systemInfo?.judul_promo_tersedia;
      if (judul) {
        console.log('Judul Promo from DB:', judul);
      }
    } catch (error) {
      console.error('Error fetching system info:', error);
    }
  };

  // Fetch promos (Logic HEAD)
  const fetchPromos = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching promos from API...');
      
      const response = await api.get('/api/public/promos');
      console.log('Promos Response:', response.data);
      
      // Format data dari backend
      const formattedPromos = response.data.map(promo => ({
        id: promo.id,
        title: promo.title,
        description: promo.description,
        status: promo.status,
        tanggalDibuat: promo.created_at,
        startDate: promo.start_date,
        endDate: promo.end_date,
      }));
      
      console.log('Formatted promos:', formattedPromos);
      setPromoData(formattedPromos);
      
    } catch (error) {
      console.error('Error fetching promos:', error);
      
      // Fallback to dummy data
      setPromoData([
        {
          id: 1,
          title: "Diskon 90%",
          description: "Nikmati promo terbesar kami dalam rangka 11.11. Jangan sampai kelewatan Pawrents!",
          status: "available",
          tanggalDibuat: "2024-12-03T10:00:00Z"
        },
        {
          id: 2,
          title: "Gratis Konsultasi",
          description: "Konsultasi gratis dengan dokter hewan berpengalaman selama bulan Desember.",
          status: "available",
          tanggalDibuat: "2024-12-02T14:30:00Z"
        },
        {
          id: 3,
          title: "Vaksinasi Hemat",
          description: "Paket vaksinasi lengkap dengan harga spesial hingga akhir tahun.",
          status: "available",
          tanggalDibuat: "2024-12-01T09:15:00Z"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter promo (Logic HEAD): available, sort by tanggalDibuat, max 3
  const availablePromos = promoData
    .filter(promo => {
      console.log('🔍 Filtering promo:', promo.title, 'status:', promo.status);
      return promo.status?.toLowerCase() === "available";
    })
    .sort((a, b) => new Date(b.tanggalDibuat) - new Date(a.tanggalDibuat))
    .slice(0, 3);

  console.log('Available promos after filter:', availablePromos);

  return (
    <div className="relative w-full bg-accent-blue-500 py-2" style={backgroundStyle}>
      <DashedBorder className="w-full h-10 relative z-[5]" />
      
      <div className="flex flex-col w-full items-center sm:gap-6 gap-3 py-10 px-4 justify-center">
        <TagLabel label='Promo' className='shadow-e4' 
        style={{
          transformOrigin: 'center',
          transform: isCardHovered ? 'rotate(3deg)' : 'rotate(-3deg)',
        }}
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}/>
        <img 
            src="/title/title-promo.svg" 
            alt="promo-desc" 
            className="h-[40px] md:h-[40px] w-auto"
        />

        {/* Promo Cards Section - UI Baru dengan Logic HEAD */}
        <div className="w-full max-w-6xl mx-auto lg:mt-8">
          {isLoading ? (
            // Loading State (Logic HEAD) dengan UI Baru
            <>
              {/* Desktop Loading */}
              <div className="hidden lg:grid grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
              
              {/* Mobile Loading */}
              <div className="lg:hidden flex gap-4 overflow-x-auto px-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-shrink-0 bg-white rounded-xl shadow-lg p-6 animate-pulse" style={{ width: '280px' }}>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            </>
          ) : availablePromos.length === 0 ? (
            // Empty State (Logic HEAD)
            <div className="col-span-3 text-center py-12">
              <p className="text-h-7 font-bold text-white">
                Belum ada promo tersedia
              </p>
              <p className="text-body-2 text-white/80 mt-2">
                Promo akan muncul setelah admin mengunggah
              </p>
            </div>
          ) : (
            // Data State
            <>
              {/* Desktop*/}
              <div className={`hidden lg:flex gap-6 ${availablePromos.length < 3 ? 'justify-center' : 'justify-start flex-wrap'}`}>
                {availablePromos.map((promo) => (
                  <div key={promo.id} className="w-[calc(33.333%-16px)] flex-shrink-0">
                    <PromoCard
                      title={promo.title}
                      description={promo.description}
                    />
                  </div>
                ))}
              </div>

              {/* Mobile/Tablet*/}
              <div className={`lg:hidden flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-2 [&::-webkit-scrollbar]:hidden ${availablePromos.length < 3 ? 'justify-center' : ''}`} 
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none' 
                }}
              >
                {availablePromos.map((promo) => (
                  <div 
                    key={promo.id} 
                    className="flex-shrink-0 snap-center w-[280px] sm:w-[368px]"
                  >
                    <PromoCard
                      title={promo.title}
                      description={promo.description}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      <DashedBorder className="w-full h-5 relative z-[5]" />
    </div>
  );
}