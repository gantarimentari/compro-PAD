"use client";
import React, { useEffect, useState } from 'react';
import api from '@lib/api';
import { DashedBorder } from '@ds/frame/garisputus';
import TagLabel from '../../components/Button/TagLabel';

export default function About() {
  const [aboutUs, setAboutUs] = useState({
    aboutUs: "Loading...",
    image: "/images/dummy-aboutus.png"
  })
  const [isLoading, setIsLoading]= useState(true);
  const [isCardHovered, setIsCardHovered] = useState(false);

  useEffect(()=>{
    const fetchAboutUs = async ()=>{
      try{
        setIsLoading(true);

        const res = await api.get('/api/system-info');

        console.log('system info(about us):', res.data);

        setAboutUs({
          aboutUs: res.data.systemInfo.about_us,
          image: "/images/dummy-aboutus.png",
        });

      }catch(err){
        console.log('error fetching about:us', err);
        setAboutUs({
          aboutUs:"error",
          image:"/images/dummy-aboutus.png"
        });
      } finally{
        setIsLoading(false);
      }
    };
    fetchAboutUs();
  }, []);

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

            <p className="text-body-1 font-base text-white leading-relaxed">
              {isLoading ? "Memuat... " : aboutUs.aboutUs}
            </p>
          </div>
        </div>
      </div>


      <DashedBorder className="w-full h-5" />
    </div>
  )

}