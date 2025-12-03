"use client";
import React, { useState } from 'react';
import TagLabel from '../../components/Button/TagLabel';
import Link from "next/link";
import Button from '@ds/Button';
import { RightArrowIcon } from '@ds/icons';
import ServicesCard from './components/ServicesCard';

export default function Services() {
  const [servicesData] = useState({
    judulLayanan: "Kami Hadir untuk Memberi Perawatan Terbaik!",
  });

  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Data layanan - nanti bisa diambil dari dashboard
  const [servicesInfo] = useState({
    "pemeriksaan": {
      nama: "Pemeriksaan & pengobatan umum",
      deskripsi: "Ini deskripsi untuk pemeriksaan dan pengobatan umum. Nanti diisi dari dashboard."
    },
    "vaksinasi": {
      nama: "Vaksinasi", 
      deskripsi: "Ini deskripsi untuk vaksinasi. Nanti diisi dari dashboard."
    },
    "bedah": {
      nama: "Bedah minor",
      deskripsi: "Ini deskripsi untuk bedah minor. Nanti diisi dari dashboard."
    },
    "konsultasi": {
      nama: "Konsultasi",
      deskripsi: "Ini deskripsi untuk konsultasi. Nanti diisi dari dashboard."
    }
  });

  const serviceKeys = Object.keys(servicesInfo);

  const openServiceModal = (serviceKey) => {
    setSelectedService(serviceKey);
    setIsModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

  const handlePrevService = () => {
    const currentIndex = serviceKeys.indexOf(selectedService);
    if (currentIndex > 0) {
      setSelectedService(serviceKeys[currentIndex - 1]);
    }
  };

  const handleNextService = () => {
    const currentIndex = serviceKeys.indexOf(selectedService);
    if (currentIndex < serviceKeys.length - 1) {
      setSelectedService(serviceKeys[currentIndex + 1]);
    }
  };

  const currentServiceData = selectedService ? servicesInfo[selectedService] : null;
  const currentIndex = serviceKeys.indexOf(selectedService);

  return (
    <>
    <div className="flex flex-col relative overflow-hidden" 
      style={{
        backgroundImage: "url('/Background/bg-paw-profile.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundColor: 'white',
      }}>
    <div 
        className="absolute pointer-events-none z-[1]"
        style={{
          left: '-200px',
          top: '30px',
          width: '450px',
          height: '450px',
          backgroundImage: "url('/Assets/ornamen-services.svg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left ',
          animation: 'rotate 20s linear infinite',
        }}
      />
      
      {/* Ornamen Kanan - Berputar */}
      <div 
        className="absolute pointer-events-none z-[1]"
        style={{
          right: '-200px',
          top: '200px',
          width: '450px',
          height: '450px',
          backgroundImage: "url('/Assets/ornamen-services.svg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right',
          animation: 'rotate 20s linear infinite reverse', // reverse = berlawanan arah
        }}
      />    
      <div className="container max-w-7xl mx-auto p-10  relative z-[5]">
        <div className="flex flex-col items-center gap-6 p-4 justify-center">
          {/* Header */}
          <TagLabel label='Layanan' className='shadow-e4' />
          <p className='text-2xl md:text-3xl lg:text-4xl font-bold text-center max-w-3xl px-4'>
            {servicesData.judulLayanan}
          </p>

          {/* Services Grid dengan Doctor di Tengah */}
          <div className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-1 items-center mt-8'>
            {/* Kolom Kiri - 2 Services */}
            <div className='flex flex-col gap-8'>
              <div 
                onClick={() => openServiceModal('pemeriksaan')} 
                className='block w-full cursor-pointer'
              >
                <TagLabel
                  label={servicesInfo.pemeriksaan.nama}
                  className='block w-full shadow-e4 hover:scale-105 transition-transform'
                  textClass='text-body-1 md:text-base lg:text-lg text-accent-neutral-1000'
                  borderClass='border-accent-red-400'
                  strokeColor='#D5143B'
                  buttonClass='w-full text-center py-3'
                />
              </div>
              <div 
                onClick={() => openServiceModal('vaksinasi')} 
                className='block w-full cursor-pointer'
              >
                <TagLabel
                  label={servicesInfo.vaksinasi.nama}
                  className='block w-full shadow-e4 hover:scale-105 transition-transform'
                  textClass='text-body-1 md:text-base lg:text-lg text-accent-neutral-1000'
                  borderClass='border-accent-red-400'
                  strokeColor='#D5143B'
                  buttonClass='w-full text-center py-3'
                />
              </div>
            </div>

            {/* Kolom Tengah - Doctor Illustration */}
            <div className='flex flex-col justify-center items-center'>
              <img 
                src='/Assets/animate-doctor.webp' 
                alt='Doctor Illustration' 
                className='w-50 h-auto md:w-56 lg:w-80 object-contain drop-shadow-lg'
              />
              {/* Button Info Lebih Lanjut - Nempel dengan Gambar Dokter */}
              <Link href='/'>
                <Button 
                  icon={<RightArrowIcon className="h-4 w-4" />} 
                  iconPosition="right"
                  roundedClass="rounded-md"
                  color="bg-accent-yellow-300" 
                  hoverColor="hover:bg-accent-yellow-500"
                  focusColor="focus:bg-accent-yellow-400"
                  label="Reservasi sekarang"
                  textColor="text-accent-neutral-1000"
                  textSize="text-body-2 text-accent-neutral-1000"
                >
                  Info Lebih Lanjut
                </Button>
              </Link>
            </div>

            {/* Kolom Kanan - 2 Services */}
            <div className='flex flex-col gap-8'>
              <div 
                onClick={() => openServiceModal('bedah')} 
                className='block w-full cursor-pointer'
              >
                <TagLabel
                  label={servicesInfo.bedah.nama}
                  className='block w-full shadow-e4 hover:scale-105 transition-transform'
                  textClass='text-body-1 md:text-base lg:text-lg text-accent-neutral-1000'
                  borderClass='border-accent-red-400'
                  strokeColor='#D5143B'
                  buttonClass='w-full text-center py-3'
                />
              </div>
              <div 
                onClick={() => openServiceModal('konsultasi')} 
                className='block w-full cursor-pointer'
              >
                <TagLabel
                  label={servicesInfo.konsultasi.nama}
                  className='block w-full shadow-e4 hover:scale-105 transition-transform'
                  textClass='text-body-1 md:text-base lg:text-lg text-accent-neutral-1000'
                  borderClass='border-accent-red-400'
                  strokeColor='#D5143B'
                  buttonClass='w-full text-center py-3'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Services Card Modal */}
    {currentServiceData && (
      <ServicesCard
        servicesName={currentServiceData.nama}
        servicesDesc={currentServiceData.deskripsi}
        servicesImage={null}
        isOpen={isModalOpen}
        onClose={closeServiceModal}
        onPrev={handlePrevService}
        onNext={handleNextService}
        isFirst={currentIndex === 0}
        isLast={currentIndex === serviceKeys.length - 1}
        currentIndex={currentIndex}
        totalServices={serviceKeys.length}
      />
    )}
    </>
  );
};

