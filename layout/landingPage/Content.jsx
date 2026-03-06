"use client";
import React, { useState, useRef, useEffect } from 'react';
import systemInfoService from '@/lib/services/systemInfoService';
import mediaService from '@/lib/services/mediaService';
import { CardDashedBorder } from '@ds/frame/garisputus';
// import { CardDashedBorder } from '@ds/frame/garisputus';

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


export default function Content() {
  // Konstanta GAP (px) agar konsisten di seluruh perhitungan
  const GAP = 40; // 40px = gap-10
  
  const [systemData, setSystemData] = useState({
    // judul_video_edukasi: 'video edukasi kami',
    deksripsi_video_edukasi: '',
  });
  
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(1); 
  const [isLoading, setIsLoading] = useState(true);

  const [isCardHovered, setIsCardHovered] = useState(false);
  const scrollContainerRef = useRef(null); // Untuk mobile
  const desktopScrollContainerRef = useRef(null); // Untuk desktop

  useEffect(()=>{
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const sysRes = await systemInfoService.get();
        console.log('system info(content):', sysRes);

        setSystemData({
          deksripsi_video_edukasi: sysRes.systemInfo.deskripsi_video_edukasi,
        });

        // Fetch tanpa exclude_video, jadi video tetap muncul
        const mediaRes = await mediaService.getAll();
        console.log('📹 Media response (with videos):', mediaRes);

        // Filter hanya video
        const videoList = mediaRes
          .filter(item => item.category === 'Video' && item.videoUrl)
          .slice(0, 3);
        
        console.log('Latest videos for Content:', videoList);
        setVideos(videoList);
      } catch (err) {
        console.error('error fetching content:', err);

        // Fallback dummy data
        setVideos([
          {
            id: 1,
            videoUrl: "https://youtu.be/nl8o9PsJPAQ?si=tq6ilCSkt2WzrDj5",
            name: "Video Edukasi 1"
          },
          {
            id: 2,
            videoUrl: "https://youtu.be/Iq2yDS0XuiY?si=pW6ey2EUAz1OsA5k",
            name: "Video Edukasi 2"
          },
          {
            id: 3,
            videoUrl: "https://youtu.be/ULME6eS9vsM?si=kY10LjlFgV-_lfzk",
            name: "Video Edukasi 3"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fungsi untuk membagi array video menjadi chunks (untuk mobile: 3 video per kolom)
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Fungsi untuk scroll ke video tertentu (center position) - hanya untuk md ke atas
  const scrollToVideo = (index) => {
    const isMdAndUp = window.innerWidth >= 768;
    
    if (!isMdAndUp) {
      // Untuk mobile, tidak perlu scroll center effect
      setSelectedVideo(index);
      return;
    }

    // Untuk desktop
    const container = desktopScrollContainerRef.current;
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

  // Auto-center on mount - hanya untuk md ke atas
  useEffect(() => {
    const handleResize = () => {
      const container = desktopScrollContainerRef.current;
      if (!container) return;

      const isMdAndUp = window.innerWidth >= 768;
      
      // Set scrollPaddingLeft untuk desktop centering
      if (isMdAndUp) {
        container.style.scrollPaddingLeft = 'calc(50% - 200px)';
        scrollToVideo(1); // Start with second video centered
      } else {
        container.style.scrollPaddingLeft = '0px';
      }
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hitung videoColumns untuk mobile (max 3 per column)
  const videoColumns = [];
  for (let i = 0; i < videos.length; i += 3) {
    videoColumns.push(videos.slice(i, i + 3));
  }

  return (
    <div className="flex flex-col relative overflow-hidden" 
    style={{
      backgroundImage: "url('/Background/bg-paw-profile.svg')",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundColor: 'white',
      marginTop: '-165px',
    }}
    >
      {/* Ornamen Kiri - Berputar */}
      <div 
        className="hidden lg:block absolute pointer-events-none z-[1]"
        style={{
          left: '60px',
          top: '265px',
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
        className="hidden lg:block absolute pointer-events-none z-[1]"
        style={{
          right: '40px',
          top: '265px',
          width: '300px',
          height: '300px',
          backgroundImage: "url('/Assets/ornamen-content.svg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          animation: 'rotate 20s linear infinite reverse', // reverse = berlawanan arah
        }}
      />
      {/* ini yagn tab kebawah */}
            <div 
        className="hidden sm:block lg:hidden absolute pointer-events-none z-[1]"
        style={{
          left: '10px',
          top: '170px',
          width: '150px',
          height: '150px',
          backgroundImage: "url('/Assets/ornamen-content.svg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          animation: 'rotate 20s linear infinite',
        }}
      />
      
      {/* Ornamen Kanan - Berputar */}
      <div 
        className="hidden sm:block lg:hidden absolute pointer-events-none z-[1]"
        style={{
          right: '10px',
          top: '170px',
          width: '150px',
          height: '150px',
          backgroundImage: "url('/Assets/ornamen-content.svg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          animation: 'rotate 20s linear infinite reverse', // reverse = berlawanan arah
        }}
      />
      
      

      <div className="container max-w-7xl mx-auto px-6 pt-12 pb-16 md:pt-10  relative z-[5]">
        <div className="flex flex-col items-center lg:gap-2 gap-0 relative z-10 sm:pt-0 pt-8">
          {/* Tag biru dengan border putus-putus putih di dalam */}
          <div 
            className="relative rounded-lg inline-block bg-accent-blue-500 lg:px-8 px-4 py-2 lg:py-4 shadow-lg transition-transform duration-300 cursor-pointer z-50"
            style={{
              transformOrigin: 'center',
              transform: isCardHovered ? 'rotate(0deg)' : 'rotate(-3deg)',
            }}
            onMouseEnter={() => setIsCardHovered(true)}
            onMouseLeave={() => setIsCardHovered(false)}
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 200 60"
              fill="none"
              preserveAspectRatio="none"
              style={{ pointerEvents: 'none' }}
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
            <span className="relative z-10 text-white lg:text-h-6 text-body-2 font-bold whitespace-nowrap" style={{ pointerEvents: 'none' }}>
              Selamat Datang
            </span>
          </div>
          
          {/* Image title-greeting lebih besar dan jarak kecil */}
          <img 
            src="/title/title-greeting.svg" 
            alt="title-greeting" 
            className="lg:h-[80px] h-[40px] w-auto"
          />

             {/* Loading skeleton untuk text */}
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 w-full max-w-2xl">
              <div className="h-8 bg-accent-neutral-200 rounded-lg w-3/4 animate-pulse"></div>
              <div className="h-6 bg-accent-neutral-200 rounded-lg w-full animate-pulse"></div>
              <div className="h-6 bg-accent-neutral-200 rounded-lg w-5/6 animate-pulse"></div>
            </div>
          ) : (
            <>
              <p className='lg:text-h-7 text-body-2 font-bold text-accent-neutral-1000 text-center max-w-2xl leading-relaxed'>
                {/* {systemData.judul_video_edukasi} */}
              </p>
              <p className='text-h-7 font-bold text-accent-neutral-1000 text-center max-w-2xl leading-relaxed'>
                {systemData.deksripsi_video_edukasi}
              </p>
            </>
          )}
        </div>

        {/* Video Carousel Section */}
        <div className="mt-12 md:mt-16 w-full relative">
          {/* Show loading skeleton saat data belum ready */}
          {isLoading ? (
            <VideoCarouselSkeleton />
          ) : (
            <>
              {/* Mobile Layout: Kolom-kolom dengan maksimal 3 video per kolom */}
              <div 
                ref={scrollContainerRef}
                className="flex lg:hidden gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory p-4 [&::-webkit-scrollbar]:hidden"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {videoColumns.map((column, columnIndex) => (
                  <div
                    key={columnIndex}
                    className="flex flex-col gap-4 flex-shrink-0 snap-center items-center"
                    style={{ width: 'calc(100vw - 2rem)' }}
                  >
                    {column.map((video) => {
                      const youtubeEmbedUrl = getYoutubeEmbedUrl(video.videoUrl);
                      
                      return (
                        <div
                          key={video.id}
                          className="w-[250px] cursor-pointer"
                        >
                          <div className="relative bg-accent-yellow-300 rounded-xl shadow-lg overflow-hidden w-full aspect-video">
                            <CardDashedBorder className="absolute inset-0 pointer-events-none z-20 stroke-white"/>
                            
                            <div className="relative p-2 z-10 rounded-sm overflow-hidden w-full h-full">
                              <iframe
                                className="w-full h-full rounded-md"
                                src={youtubeEmbedUrl}
                                title={video.name || `Video ${video.id}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Desktop Layout: Horizontal dengan scale effect */}
              <div 
                ref={desktopScrollContainerRef}
                className="hidden lg:flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory p-6 [&::-webkit-scrollbar]:hidden"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
                onScroll={(e) => {
                  const container = e.target;
                  const scrollLeft = container.scrollLeft;
                  const containerWidth = container.offsetWidth;
                  const gap = GAP;
                  const cardWidth = (containerWidth - gap * 2) / 3;
                  const totalCardWidth = cardWidth + gap;
                  
                  const centerPosition = scrollLeft + containerWidth / 2;
                  let closestIndex = 0;
                  let minDistance = Infinity;
                  
                  videos.forEach((_, index) => {
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
                {videos.map((video, index) => {
                  const isCenter = index === selectedVideo;
                  const youtubeEmbedUrl = getYoutubeEmbedUrl(video.videoUrl);
                    
                  return (
                    <div
                      key={video.id}
                      onClick={() => scrollToVideo(index)}
                      className={`
                        flex-shrink-0 snap-center transition-all duration-500 ease-out cursor-pointer
                        w-[calc((100vw-5rem)/3)] max-w-[400px]
                        ${isCenter 
                          ? 'scale-125 z-20' 
                          : 'scale-75'
                        }
                      `}
                      style={{
                        transformOrigin: 'center center',
                      }}
                    >
                      <div 
                        className={`
                          relative bg-accent-yellow-300 rounded-xl shadow-lg overflow-hidden w-full 
                          h-[200px] 
                          transition-all duration-500 
                          ${isCenter ? 'shadow-2xl' : ''}
                        `}
                      >
                        <CardDashedBorder className="absolute inset-0 pointer-events-none z-20 stroke-white"/>
                        
                        <div className="relative p-3 z-10 rounded-sm overflow-hidden w-full h-full">
                          <iframe
                            className="w-full h-full rounded-md"
                            src={youtubeEmbedUrl}
                            title={video.name || `Video ${video.id}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

// Loading Skeleton Component
const VideoCarouselSkeleton = () => {
  return (
    <div className="hidden md:flex gap-3 overflow-hidden p-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`
            flex-shrink-0 transition-all duration-500
            w-[calc((100vw-5rem)/3)] max-w-[400px]
            ${i === 2 ? 'scale-125' : 'scale-75'}
          `}
          style={{
            transformOrigin: 'center center',
          }}
        >
          <div className="relative bg-accent-yellow-300/50 rounded-xl shadow-lg overflow-hidden w-full h-[200px]">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
              viewBox="0 0 400 200"
              fill="none"
              preserveAspectRatio="none"
            >
              <rect
                x="12"
                y="12"
                width="376"
                height="176"
                rx="12"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="18 4 3 6 6 4"
                fill="none"
                opacity="0.5"
              />
            </svg>
            
            <div className="relative p-3 z-10 w-full h-full flex items-center justify-center">
              <div className="w-full h-full bg-white/30 rounded-md animate-pulse flex items-center justify-center">
                <svg className="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};