"use client";
import React, { useState, useEffect } from 'react';
import TagLabel from '../ui/Button/TagLabel';
import systemInfoService from '@/lib/services/systemInfoService';
import Link from "next/link";
import Button from '@/components/ui/Button';
import { RightArrowIcon } from '@/components/icons';
import ServicesCard from './components/ServicesCard';

export default function Services() {
  const [judulLayanan, setJudulLayanan] = useState("Kami Hadir untuk Memberi Perawatan Terbaik!");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [whatsappData, setWhatsappData] = useState({
    phone: '',
    template: ''
  });

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      setIsLoading(true);
      const response = await systemInfoService.get();
      
      console.log('System Info Response:', response);
      
      const judul = response.systemInfo?.judul_layanan_tersedia;
      if (judul) {
        setJudulLayanan(judul);
        console.log('Judul Layanan from DB:', judul);
      }

      setWhatsappData({
        phone: response.systemInfo?.phone || '',
        template: response.systemInfo?.whatsapp_template || ''
      });

    } catch (error) {
      console.error('Error fetching system info:', error);
      // Gunakan default jika error
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenWhatsApp = () => {
    try {
      console.log('Opening WhatsApp from Services...');
      console.log('Clinic phone:', whatsappData.phone);

      // Validate clinic phone exists
      if (!whatsappData.phone) {
        alert('Nomor WhatsApp klinik belum tersedia. Silakan hubungi admin.');
        return;
      }

      // Clean & format clinic's phone number
      const cleanNumber = whatsappData.phone.replace(/[\s\-\+]/g, '');
      let formattedNumber = cleanNumber;
      
      if (cleanNumber.startsWith('0')) {
        formattedNumber = '62' + cleanNumber.substring(1);
      } else if (!cleanNumber.startsWith('62')) {
        formattedNumber = '62' + cleanNumber;
      }

      // Validate format
      if (!/^62\d{9,12}$/.test(formattedNumber)) {
        alert('Format nomor WhatsApp klinik tidak valid. Hubungi admin.');
        console.error('Invalid clinic number:', formattedNumber);
        return;
      }

      console.log('📱 Formatted clinic number:', formattedNumber);

      // Use dynamic template from database OR fallback to default
      const messageTemplate = whatsappData.template

      console.log('Message template:', messageTemplate);

      // Encode message for URL
      const encodedMessage = encodeURIComponent(messageTemplate);

      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
      
      console.log('WhatsApp URL:', whatsappUrl);

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      console.log('WhatsApp opened successfully');

    } catch (err) {
      console.error('Error opening WhatsApp:', err);
      alert('Gagal membuka WhatsApp. Silakan coba lagi.');
    }
  };

  // Data layanan - nanti bisa diambil dari dashboard
  const [servicesInfo] = useState({
    "pemeriksaan": {
      nama: "Pemeriksaan & pengobatan umum",
      deskripsi: "Layanan pemeriksaan kesehatan menyeluruh untuk hewan peliharaan Anda dengan pendekatan medis yang komprehensif. Tim dokter hewan profesional dan berpengalaman kami siap melakukan pemeriksaan fisik lengkap, tes laboratorium, serta mendiagnosis berbagai kondisi kesehatan mulai dari penyakit ringan seperti flu, diare, muntah, hingga kondisi medis kompleks yang memerlukan perhatian intensif.\n\nKami menangani berbagai keluhan seperti masalah pencernaan, gangguan pernapasan, infeksi kulit, parasit internal dan eksternal, serta penyakit degeneratif pada hewan senior. Setiap pemeriksaan dilakukan dengan teliti menggunakan peralatan medis modern termasuk mikroskop, alat rontgen, dan perangkat diagnostik canggih lainnya.\n\nPengobatan yang diberikan disesuaikan dengan kondisi spesifik hewan Anda, mencakup pemberian obat oral, injeksi, infus, perawatan luka, hingga terapi jangka panjang untuk penyakit kronis. Kami juga menyediakan layanan rawat inap dengan monitoring 24 jam untuk kasus yang memerlukan observasi intensif."
    },
    "vaksinasi": {
      nama: "Vaksinasi", 
      deskripsi: "Program vaksinasi lengkap dan terjadwal untuk melindungi hewan peliharaan dari berbagai penyakit berbahaya dan mematikan. Kami menyediakan vaksin berkualitas tinggi untuk anjing, kucing, kelinci, hamster, dan hewan peliharaan eksotis lainnya sesuai dengan protokol vaksinasi internasional dan rekomendasi dari organisasi kesehatan hewan dunia.\n\nUntuk anjing, kami menyediakan vaksin DHPPI (Distemper, Hepatitis, Parvovirus, Parainfluenza), Rabies, Leptospirosis, dan Kennel Cough. Sedangkan untuk kucing tersedia vaksin Tricat/Tetracat (Panleukopenia, Calicivirus, Rhinotracheitis, Chlamydia) dan Rabies. Vaksinasi dimulai sejak usia 6-8 minggu dengan jadwal booster yang teratur untuk mempertahankan kekebalan optimal.\n\nSebelum vaksinasi, dokter hewan akan melakukan pemeriksaan kesehatan untuk memastikan hewan dalam kondisi fit. Kami juga memberikan kartu vaksinasi resmi dan reminder untuk jadwal vaksinasi berikutnya. Vaksinasi rutin adalah investasi terbaik untuk mencegah penyakit menular berbahaya dan menjaga kesehatan jangka panjang hewan kesayangan Anda."
    },
    "bedah": {
      nama: "Bedah minor",
      deskripsi: "Layanan tindakan bedah minor yang aman dan profesional untuk berbagai kebutuhan medis hewan peliharaan. Prosedur dilakukan oleh dokter hewan bersertifikat dengan pengalaman luas dalam bedah veteriner, didukung oleh ruang operasi yang steril dan peralatan bedah modern.\n\nLayanan bedah minor kami meliputi sterilisasi (ovariohysterectomy untuk betina, kastrasi untuk jantan) yang membantu mengontrol populasi dan mencegah penyakit reproduksi seperti tumor mammae dan pyometra. Kami juga menangani pengangkatan tumor dan massa abnormal (lipoma, kista, abses), debridement dan penjahitan luka traumatis, ekstraksi gigi yang rusak atau terinfeksi, serta prosedur dermatologi seperti pengangkatan skin tag dan papiloma.\n\nSetiap tindakan bedah menggunakan protokol anestesi yang aman dengan monitoring tanda vital (detak jantung, pernapasan, suhu, oksigenasi) selama operasi. Pasca operasi, hewan akan dipantau hingga sadar penuh dan kami memberikan instruksi perawatan di rumah yang jelas, obat anti nyeri, antibiotik jika diperlukan, serta jadwal kontrol luka. Comfort dan keselamatan hewan adalah prioritas utama kami dalam setiap prosedur bedah."
    },
    "konsultasi": {
      nama: "Konsultasi",
      deskripsi: "Layanan konsultasi kesehatan komprehensif dengan dokter hewan berpengalaman untuk memastikan kesejahteraan optimal hewan peliharaan Anda di setiap fase kehidupan. Konsultasi kami mencakup berbagai aspek perawatan mulai dari preventif hingga kuratif dengan pendekatan holistik.\n\nTopik konsultasi meliputi:\n• Nutrisi & Diet: Rekomendasi pakan berkualitas sesuai usia, ras, dan kondisi kesehatan; program diet untuk obesitas atau underweight; nutrisi khusus untuk hewan dengan penyakit ginjal, diabetes, atau alergi makanan\n• Perilaku & Training: Solusi untuk masalah perilaku seperti agresivitas, kecemasan, destruktif, atau toilet training; tips sosialisasi anak hewan dengan lingkungan baru\n• Perawatan Preventif: Jadwal vaksinasi, deworming, kontrol parasit eksternal (kutu, tungau); perawatan gigi dan kebersihan mulut; grooming dan hygiene rutin\n• Kesehatan Reproduksi: Konsultasi breeding, kehamilan, dan persalinan; perawatan anak hewan baru lahir; kapan waktu tepat untuk sterilisasi\n• Geriatri Care: Perawatan khusus hewan senior termasuk suplemen sendi, manajemen penyakit kronis, dan meningkatkan kualitas hidup di usia tua\n• First Aid & Emergency: Panduan pertolongan pertama di rumah untuk kondisi darurat; tanda-tanda bahaya yang memerlukan kunjungan segera ke dokter\n\nKami menyediakan waktu konsultasi yang cukup untuk mendengarkan semua kekhawatiran Anda dan memberikan edukasi lengkap serta rekomendasi berbasis evidence-based medicine. Konsultasi dapat dilakukan secara langsung di klinik atau melalui telemedicine untuk kasus non-emergency."
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
  const [isCardHovered, setIsCardHovered] = useState(false);
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
        className="hidden lg:block absolute pointer-events-none z-[1]"
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
        className="hidden lg:block  absolute pointer-events-none z-[1]"
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
       <div 
        className="lg:hidden absolute pointer-events-none z-[1]"
        style={{
          left: '-70px',
          top: '0px',
          width: '200px',
          height: '200px',
          backgroundImage: "url('/Assets/ornamen-services.svg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left ',
          animation: 'rotate 20s linear infinite',
        }}
      />
      
      {/* Ornamen Kanan - Berputar */}
      <div 
        className="lg:hidden   absolute pointer-events-none z-[1]"
        style={{
          right: '-70px',
          bottom: '0px',
          width: '200px',
          height: '200px',
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
          <TagLabel label='Layanan' className='shadow-e4'
          style={{
            transformOrigin: 'center',
            transform: isCardHovered ? 'rotate(3deg)' : 'rotate(-3deg)',
          }}
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)} />
          
          {/* ✅ Dynamic Title from DB with Loading + Responsive Size */}
          {isLoading ? (
            <div className="h-10 w-2/3 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className='text-h-7 lg:text-h-6 font-bold text-center max-w-3xl px-4'>
              {judulLayanan}
            </p>
          )}

          {/* Services Grid dengan Doctor di Tengah */}
          <div className='w-full max-w-6xl '>
            {/* Layout untuk lg+ (desktop) - Grid 3 kolom */}
            <div className='hidden lg:grid grid-cols-[1fr_auto_1fr] gap-1 items-center'>
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
                    onClick={handleOpenWhatsApp} 
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

            {/* Layout untuk lg ke bawah (mobile/tablet) - Vertikal */}
            <div className='lg:hidden flex flex-col items-center '>
              {/* Doctor Illustration di atas */}
              <img 
                src='/Assets/animate-doctor.webp' 
                alt='Doctor Illustration' 
                className='w-48 md:w-64 h-auto object-contain drop-shadow-lg sm:mb-[-30px] mb-[-22px]'
              />

              {/* 4 Services buttons vertikal */}
              <div className='w-full max-w-md flex flex-col gap-4 pb-4'>
                <div 
                  onClick={() => openServiceModal('pemeriksaan')} 
                  className='block w-full cursor-pointer'
                >
                  <TagLabel
                    label={servicesInfo.pemeriksaan.nama}
                    className='block w-full shadow-e4 hover:scale-105 transition-transform'
                    textClass='text-body-2 md:text-base text-accent-neutral-1000'
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
                    textClass='text-body-2 md:text-base text-accent-neutral-1000'
                    borderClass='border-accent-red-400'
                    strokeColor='#D5143B'
                    buttonClass='w-full text-center py-3'
                  />
                </div>
                <div 
                  onClick={() => openServiceModal('bedah')} 
                  className='block w-full cursor-pointer'
                >
                  <TagLabel
                    label={servicesInfo.bedah.nama}
                    className='block w-full shadow-e4 hover:scale-105 transition-transform'
                    textClass='text-body-2 md:text-base text-accent-neutral-1000'
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
                    textClass='text-body-2 md:text-base text-accent-neutral-1000'
                    borderClass='border-accent-red-400'
                    strokeColor='#D5143B'
                    buttonClass='w-full text-center py-3'
                  />
                </div>
                
              </div>

              {/* Button Info Lebih Lanjut di bawah */}
              <Link href='/'>
                <Button
                  onClick={handleOpenWhatsApp} 
                  icon={<RightArrowIcon className="h-4 w-4" />} 
                  iconPosition="right"
                  roundedClass="rounded-md"
                  color="bg-accent-yellow-300" 
                  hoverColor="hover:bg-accent-yellow-500"
                  focusColor="focus:bg-accent-yellow-400"
                  label="Reservasi sekarang"
                  textColor="text-accent-neutral-1000"
                  textSize="text-body-2"
                >
                  Info Lebih Lanjut
                </Button>
              </Link>
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

