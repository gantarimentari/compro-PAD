"use client";
import React, { useState } from 'react';
import { DashedBorder } from '@ds/frame/garisputus';
import TagLabel from '../../components/Button/TagLabel';

export default function About() {
  const [aboutUs, setAboutUs] = useState({
    aboutUs: "Klinik Dokter Hewan Fanina hadir sebagai sahabat terpercaya bagi para pemilik hewan peliharaan. Kami melayani berbagai jenis hewan, mulai dari kucing, anjing, kelinci, burung, hingga hewan kecil lainnya. Dengan dukungan tim dokter hewan berpengalaman dan fasilitas yang lengkap, kami berkomitmen memberikan layanan terbaik untuk menjaga kesehatan serta kenyamanan hewan kesayangan Pawrents. Layanan kami mencakup vaksinasi, pemeriksaan kesehatan rutin, dll. Bagi kami, setiap hewan bukan sekadar peliharaan, tetapi bagian dari keluarga yang layak mendapat perhatian penuh.",
    image: "/images/dummy-aboutus.png"
  })
  const [isCardHovered, setIsCardHovered] = useState(false);
  return (

    <div
      className="relative w-full bg-accent-blue-500 py-4 md:py-4 overflow-x-hidden"
    >
      {/* Ornamen Kiri - hanya muncul di lg+ */}
      <div 
        className="hidden lg:block absolute pointer-events-none"
        style={{
          left: '-230px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '360px',
          height: '360px',
          backgroundImage: "url('/Assets/ornamen-blue.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Ornamen Kanan - hanya muncul di lg+ */}
      <div 
        className="hidden lg:block absolute pointer-events-none"
        style={{
          right: '-230px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '360px',
          height: '360px',
          backgroundImage: "url('/Assets/ornamen-blue.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
        }}
      />

      <DashedBorder className="w-full h-5 relative z-[5]" />
      <div className="container max-w-7xl mx-auto px-4 py-6 md:py-10 relative z-[5]">
        <div className="relative z-[5] w-full rounded-xl bg-accent-blue-500  px-4 py-6 md:px-8 md:py-8 flex flex-col lg:flex-row gap-6 lg:gap-10 items-center">

          {/* Header (Tag + Title) - order-1 di mobile (paling atas), lg:order-1 (di dalam kolom teks) */}
          <div className="w-full lg:w-[60%] order-1 lg:order-2">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:mb-4">
              <TagLabel 
                style={{
                  transformOrigin: 'center',
                  transform: isCardHovered ? 'rotate(3deg)' : 'rotate(-3deg)',
                }}
                onMouseEnter={() => setIsCardHovered(true)}
                onMouseLeave={() => setIsCardHovered(false)}
              />
              <img
                src="/title/title-about.svg"
                alt="Klinik Dokter Fanina"
                className="h-[60px] md:h-[80px] w-auto"
              />
            </div>

            {/* Teks panjang - hanya tampil di lg+ */}
            <p className="hidden lg:block text-body-1 font-base text-white leading-relaxed text-justify">
              {aboutUs.aboutUs}
            </p>
          </div>

          {/* Gambar - order-2 di mobile (tengah), order-1 di lg (kiri) */}
          <div className="w-full lg:w-[40%] flex justify-center order-2 lg:order-1">
            <div className="bg-white lg:border-4 rounded-2xl shadow-lg overflow-hidden lg:max-w-md w-full">
              <img
                src={aboutUs.image}
                alt="Tentang Klinik Fanina"
                className="w-full md:max-h-[350px] lg:max-h-[450px] object-cover"
              
              />
            </div>
          </div>

          {/* Teks panjang untuk mobile - order-3 (paling bawah), hidden di lg+ */}
          <div className="w-full order-3 lg:hidden">
            <p className="text-body-2 md:text-body-1 text-white leading-relaxed text-justify">
              {aboutUs.aboutUs}
            </p>
          </div>
        </div>
      </div>


      <DashedBorder className="w-full h-5" />
    </div>
  )

}