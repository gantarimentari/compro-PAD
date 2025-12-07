"use client";
import React, { useState } from 'react';
import { DashedBorder } from '@ds/frame/garisputus';
import TagLabel from '../../components/Button/TagLabel';

export default function About() {
  const [aboutUs, setAboutUs] = useState({
    aboutUs: "Klinik Dokter Hewan Fanina hadir sebagai sahabat terpercaya bagi para pemilik hewan peliharaan. Kami melayani berbagai jenis hewan, mulai dari kucing, anjing, kelinci, burung, hingga hewan kecil lainnya. Dengan dukungan tim dokter hewan berpengalaman dan fasilitas yang lengkap, kami berkomitmen memberikan layanan terbaik untuk menjaga kesehatan serta kenyamanan hewan kesayangan Pawrents. Layanan kami mencakup vaksinasi, pemeriksaan kesehatan rutin, dll. Bagi kami, setiap hewan bukan sekadar peliharaan, tetapi bagian dari keluarga yang layak mendapat perhatian penuh.",
    image: "/images/dummy-aboutus.png"
  })
  return (

    <div
      className="relative w-full bg-accent-blue-500 py-4 md:py-4 overflow-x-hidden"
      style={{
        // Dua background: kiri & kanan. Digeser ke luar agar hanya setengah yang kelihatan.
        backgroundImage:
          "url('/Assets/ornamen-blue.svg'), url('/Assets/ornamen-blue.svg')",
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundPosition: '-230px center, calc(100% + 230px) center',
        backgroundSize: '360px 360px, 360px 360px',
      }}
    >

      <DashedBorder className="w-full h-5 relative z-[5]" />
      <div className="container max-w-7xl mx-auto px-4 py-6 md:py-10 relative z-[5]">
        <div className="relative z-[5] w-full rounded-xl bg-accent-blue-500  px-4 py-6 md:px-8 md:py-8 flex flex-col md:flex-row gap-6 md:gap-10 items-center">

          <div className="w-full md:w-[40%] flex justify-center">
            <div className="bg-white border-4 rounded-2xl shadow-lg overflow-hidden max-w-md w-full">
              <img
                src={aboutUs.image}
                alt="Tentang Klinik Fanina"
                className="max-w-full max-h-[450px] object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-[60%] text-left space-y-3 ">
            <div className="flex items-center gap-3 ">
              <TagLabel />
              <img
                src="/title/title-about.svg"
                alt="Klinik Dokter Fanina"
                className="h-[60px] md:h-[80px] w-auto"
              />
            </div>

            <p className="text-body-1 font-base text-white leading-relaxed">
              {aboutUs.aboutUs}
            </p>
          </div>
        </div>
      </div>


      <DashedBorder className="w-full h-5" />
    </div>
  )

}