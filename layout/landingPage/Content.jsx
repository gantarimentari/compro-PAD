"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ModalDashedBorder } from '@ds/frame/garisputus';
// Fungsi helper untuk convert YouTube link jadi embed URL
const getYoutubeEmbedUrl = (youtubeLink) => {
  if (!youtubeLink) return '';
  
  let videoId = '';
  
  if (youtubeLink.includes('watch?v=')) {
    // Format: youtube.com/watch?v=VIDEO_ID
    videoId = youtubeLink.split('watch?v=')[1]?.split('&')[0];
  } else if (youtubeLink.includes('youtu.be/')) {
    // Format: youtu.be/VIDEO_ID
    videoId = youtubeLink.split('youtu.be/')[1]?.split('?')[0];
  } else if (youtubeLink.includes('/embed/')) {
    // Sudah format embed
    return youtubeLink;
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};


const dummyVideos = [
  {
    id: 1,
    youtubeLink: "https://youtu.be/nl8o9PsJPAQ?si=tq6ilCSkt2WzrDj5"
  },
  {
    id: 2,
    youtubeLink: "https://youtu.be/Iq2yDS0XuiY?si=pW6ey2EUAz1OsA5k" 
  },
  {
    id: 3,
    youtubeLink: "https://youtu.be/ULME6eS9vsM?si=kY10LjlFgV-_lfzk"
  },
  {
    id: 4,
    youtubeLink: "https://www.youtube.com/watch?v=kJQP7kiw5Fk"
  },
  {
    id: 5,
    youtubeLink: "https://www.youtube.com/watch?v=L_jWHffIx5E"
  }
];

export default function Content() {
  // Konstanta GAP (px) agar konsisten di seluruh perhitungan
  const GAP = 40; // 40px = gap-10
  
  const [systemData, setSystemData] = useState({
    judulVideoEdukasi: "Belajar tentang hewan jadi gampang! Yuk temukan tips, info, dan fun fact seru bareng kami"
  });
  
  const [selectedVideo, setSelectedVideo] = useState(1); 
  const scrollContainerRef = useRef(null);

  // Fungsi untuk scroll ke video tertentu (center position)
  const scrollToVideo = (index) => {
    const container = scrollContainerRef.current;
    if (container) {
      const containerWidth = container.offsetWidth;
      const gap = GAP; // mengikuti kelas gap-10
      const cardWidth = (containerWidth - gap * 2) / 3; // 3 cards visible
      const scrollPosition = index * (cardWidth + gap) - (containerWidth / 2 - cardWidth / 2);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
    setSelectedVideo(index);
  };

  // Auto-center on mount
  useEffect(() => {
    scrollToVideo(1); // Start with second video centered
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" 
    style={{
      backgroundImage: "url('/Background/bg-paw-profile.svg')",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundColor: 'white',
      marginTop: '-175px',
    }}
    >
      {/* Ornamen Kiri - Berputar */}
      <div 
        className="absolute pointer-events-none z-[1]"
        style={{
          left: '60px',
          top: '285px',
          width: '300px',
          height: '300px',
          backgroundImage: "url('/Assets/ornamen-content.svg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          animation: 'rotate 20s linear infinite',
        }}
      />
      
      {/* Ornamen Kanan - Berputar */}
      <div 
        className="absolute pointer-events-none z-[1]"
        style={{
          right: '40px',
          top: '285px',
          width: '300px',
          height: '300px',
          backgroundImage: "url('/Assets/ornamen-content.svg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          animation: 'rotate 20s linear infinite reverse', // reverse = berlawanan arah
        }}
      />
      
      

      <div className="container max-w-7xl mx-auto px-4 py-6 md:py-10 relative z-[5]">
        <div className="flex flex-col items-center gap-2">
          {/* Tag biru dengan border putus-putus putih di dalam */}
          <div className="relative rounded-lg inline-block bg-accent-blue-500  px-8 py-4 shadow-lg">
            {/* Border putus-putus putih di dalam */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 200 60"
              fill="none"
              preserveAspectRatio="none"
            >
              <rect
                x="3"
                y="3"
                width="194"
                height="54"
                rx="6"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="18 4 3 6 6 4"
                fill="none"
              />
            </svg>
            
            {/* Teks */}
            <span className="relative z-10 text-white text-h-6  font-bold whitespace-nowrap">
              Selamat Datang
            </span>
          </div>
          
          {/* Image title-greeting lebih besar dan jarak kecil */}
          <img 
            src="/title/title-greeting.svg" 
            alt="title-greeting" 
            className="h-[80px] md:h-[100px] w-auto"
          />
          <p className='text-h-7 font-bold text-accent-neutral-1000 text-center max-w-2xl leading-relaxed'>
            {systemData.judulVideoEdukasi}
          </p>
        </div>

        {/* Video Carousel Section */}
        <div className="mt-12 md:mt-16 w-full relative">
          <div 
            ref={scrollContainerRef}
            className=" flex  gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory p-6 [&::-webkit-scrollbar]:hidden"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollPaddingLeft: 'calc(50% - 200px)', // Centering offset
            }}
            onScroll={(e) => {
              const container = e.target;
              const scrollLeft = container.scrollLeft;
              const containerWidth = container.offsetWidth;
              const gap = GAP; // gap-10
              const cardWidth = (containerWidth - gap * 2) / 3;
              const totalCardWidth = cardWidth + gap;
              
              // Hitung video mana yang paling dekat dengan center
              const centerPosition = scrollLeft + containerWidth / 2;
              let closestIndex = 0;
              let minDistance = Infinity;
              
              dummyVideos.forEach((_, index) => {
                const cardCenter = index * totalCardWidth + cardWidth / 2;
                const distance = Math.abs(centerPosition - cardCenter);
                if (distance < minDistance) {
                  minDistance = distance;
                  closestIndex = index;
                }
              });
              
              if (closestIndex !== selectedVideo) {
                setSelectedVideo(closestIndex);
              }
            }}
          >
            {dummyVideos.map((video, index) => {
              const isCenter = index === selectedVideo;
              const youtubeEmbedUrl = getYoutubeEmbedUrl(video.youtubeLink);
                
                return (
                  <div
                    key={video.id}
                    onClick={() => scrollToVideo(index)}
                    className={`
                      flex-shrink-0 snap-center transition-all duration-500 ease-out cursor-pointer gap-2
                      ${isCenter 
                        ? 'scale-125 z-20' 
                        : 'scale-75'
                      }
                    `}
                    style={{
                      width: 'calc((100vw - 5rem) / 3)', // 3 cards visible, accounting for 2 gaps (2 * 2.5rem)
                      maxWidth: '400px',
                      transformOrigin: 'center center',
                    }}
                  >

                   <div className={`relative bg-accent-yellow-300 rounded-xl shadow-lg overflow-hidden w-full h-[200px] transition-all duration-500 ${isCenter ? 'shadow-2xl' : ''}`}>
                     {/* Border putus-putus kuning di dalam card */}
                     <ModalDashedBorder className="absolute inset-0 pointer-events-none z-20 stroke-white"/>
                     
                     {/* Video Container - Full height, tanpa title */}
                     <div className="relative p-3 z-10 rounded-sm overflow-hidden w-full h-full">
                       <iframe
                         className="w-full h-full rounded-md"
                         src={youtubeEmbedUrl}
                         title={`Video ${video.id}`}
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                         allowFullScreen
                       />
                     </div>
                   </div>
                </div>
              );
            })}
          </div>
          
         
        </div>

      </div>

    </div>
  )
}