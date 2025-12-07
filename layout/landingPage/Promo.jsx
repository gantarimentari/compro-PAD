"use client";
import TagLabel from "@ds/Button/TagLabel";
import React, { useState } from 'react';
import { DashedBorder } from '@ds/frame/garisputus';
import PromoCard from './components/PromoCard';

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

  // Data promo dummy - nanti diambil dari dashboard/CMS
  const [promoData] = useState([
    {
      id: 1,
      judulPromo: "Diskon 90%",
      isiPromo: "Nikmati promo terbesar kami dalam rangka 11.11. Jangan sampai kelewatan Pawrents! Dapatkan diskon hingga 90% untuk semua layanan grooming dan perawatan hewan kesayangan Anda.",
      status: "available",
      tanggalDibuat: "2024-12-03T10:00:00Z" // ISO 8601 format
    },
    {
      id: 2,
      judulPromo: "Gratis Konsultasi",
      isiPromo: "Konsultasi gratis dengan dokter hewan berpengalaman selama bulan Desember. Diskusikan kesehatan, nutrisi, dan perawatan hewan peliharaan Anda tanpa biaya apapun.",
      status: "available",
      tanggalDibuat: "2024-12-02T14:30:00Z"
    },
    {
      id: 3,
      judulPromo: "Vaksinasi Hemat",
      isiPromo: "Paket vaksinasi lengkap dengan harga spesial hingga akhir tahun. Lindungi hewan kesayangan dari penyakit berbahaya dengan harga terjangkau mulai dari Rp 150.000.",
      status: "available",
      tanggalDibuat: "2024-12-01T09:15:00Z"
    },
    {
      id: 4,
      judulPromo: "Grooming Premium",
      isiPromo: "Diskon 50% untuk layanan grooming premium setiap hari Sabtu dan Minggu. Termasuk mandi, potong kuku, dan styling profesional.",
      status: "unavailable", // tidak ditampilkan
      tanggalDibuat: "2024-11-30T16:45:00Z"
    },
    {
      id: 5,
      judulPromo: "Sterilisasi Murah",
      isiPromo: "Program sterilisasi dengan harga terjangkau untuk mengontrol populasi hewan. Promo sudah berakhir.",
      status: "unavailable", // tidak ditampilkan
      tanggalDibuat: "2024-11-28T11:00:00Z"
    },
    {
      id: 6,
      judulPromo: "Paket Pemeriksaan Rutin",
      isiPromo: "Pemeriksaan kesehatan lengkap + vitamin hanya Rp 200.000. Deteksi dini masalah kesehatan hewan peliharaan Anda dengan paket hemat ini.",
      status: "available",
      tanggalDibuat: "2024-11-29T13:20:00Z"
    }
  ]);

  // Filter promo yang available, sort by tanggalDibuat (terbaru dulu), ambil max 3
  const availablePromos = promoData
    .filter(promo => promo.status === "available")
    .sort((a, b) => new Date(b.tanggalDibuat) - new Date(a.tanggalDibuat))
    .slice(0, 3);
  
  return (
    <div className="relative w-full bg-accent-blue-500 py-2" style={backgroundStyle}>
      <DashedBorder className="w-full h-10 relative z-[5]" />
      
      <div className="flex flex-col w-full items-center gap-6 py-10 px-4 justify-center">
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
        
        {/* Promo Cards Grid - Hanya tampilkan max 3 promo available terbaru */}
        <div className="container max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {availablePromos.map((promo) => (
            <PromoCard
              key={promo.id}
              title={promo.judulPromo}
              description={promo.isiPromo}
            />
          ))}
        </div>
      </div>
      
      <DashedBorder className="w-full h-5 relative z-[5]" />
    </div>
  );
};