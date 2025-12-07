"use client";
import React, { useEffect, useState } from 'react';
import TagLabel from '../../components/Button/TagLabel';
import Button from '@ds/Button';
import api from '@lib/api';
import Link from 'next/link';
import { RightArrowIcon } from '@ds/icons';
import ArticleCard from './components/ArticleCard';

export default function Article() {
  const [articleData, setArticleData] = useState({
    deskripsi_artikel: "Artikel adalah halaman yang memuat informasi, pengetahuan, dan edukasi seputar topik tertentu agar Pawrents mendapatkan wawasan baru terkait hewan kesayangannya."
  });
  const [isCardHovered, setIsCardHovered] = useState(false);

  const [recentArticles, setRecentArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const res = await api.get('/api/system-info');
        console.log('📦 System Info (Article):', res.data);

        setArticleData({
          deskripsi_artikel: res.data.systemInfo?.deskripsi_artikel || 
            "Artikel adalah halaman yang memuat informasi, pengetahuan, dan edukasi seputar topik tertentu agar Pawrents mendapatkan wawasan baru terkait hewan kesayangannya."
        });

        const articleRes = await api.get('/api/articles');
        console.log('📦 Articles Response:', articleRes.data);
        
        //  FILTER: Hanya ambil artikel dengan status 'Publish'
        const publishedArticles = articleRes.data.filter(article => article.status === 'Publish');
        console.log(' Published articles only:', publishedArticles);

        //  Process articles: use imageUrl from backend & strip HTML
        const processedArticles = publishedArticles.slice(0, 2).map(article => {
          console.log('🔍 Processing article:', article.id, 'ImageURL:', article.imageUrl);
          
          return {
            id: article.id,
            title: article.title,
            content: article.content,
            category: article.category,
            status: article.status,
            created_at: article.created_at,
            updated_at: article.updated_at,
            //  Use imageUrl from backend (already full URL)
            imageUrl: article.imageUrl || '/images/placeholder-article.png',
            //  Strip HTML tags from content (for preview)
            contentPreview: article.content?.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
          };
        });

        console.log(' Processed articles:', processedArticles);
        setRecentArticles(processedArticles);

      } catch (err) {
        console.error('❌ Error fetching articles:', err);
        
        //  Fallback to dummy data
        setRecentArticles([
          {
            id: 1,
            title: "Cara Merawat Kucing Persia dengan Baik dan Benar",
            content: "Kucing Persia merupakan salah satu ras kucing yang paling populer di dunia.",
            contentPreview: "Kucing Persia merupakan salah satu ras kucing yang paling populer di dunia. Dengan bulu yang panjang dan lebat, kucing Persia memerlukan perawatan khusus agar tetap sehat dan cantik...",
            imageUrl: "/images/gambarkucingarticle.png",
            created_at: "2024-12-02"
          },
          {
            id: 2,
            title: "Pentingnya Vaksinasi Rutin untuk Hewan Peliharaan",
            content: "Vaksinasi adalah salah satu langkah preventif paling penting.",
            contentPreview: "Vaksinasi adalah salah satu langkah preventif paling penting dalam menjaga kesehatan hewan peliharaan Anda. Vaksin membantu melindungi hewan dari berbagai penyakit menular yang berbahaya...",
            imageUrl: "/images/hamster.png",
            created_at: "2024-12-01"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className='min-h-screen flex flex-col relative overflow-hidden'
      style={{
        minHeight: '60vh',
        backgroundImage: "url('/Background/bg-paw-profile.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundColor: 'white',
      }}
    >
      {/* Ornamen Kiri */}
      <div 
        className="absolute pointer-events-none z-[1]"
        style={{
          left: '20px',
          top: '70px',
          width: '200px',
          height: '200px',
          backgroundImage: "url('/Assets/ornamen-article.svg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          animation: 'rotate 12s linear infinite',
        }}
      />
      
      {/* Ornamen Kanan */}
      <div 
        className="absolute pointer-events-none z-[1]"
        style={{
          right: '40px',
          top: '300px',
          width: '200px',
          height: '200px',
          backgroundImage: "url('/Assets/ornamen-article.svg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          animation: 'rotate 12s linear infinite reverse',
        }}
      />
      
      <div className="container max-w-7xl mx-auto p-8 relative z-[5] min-h-[85vh]">
        {/* Header Section */}
        <div className='flex flex-row items-center gap-6 py-10 px-0 justify-center'>
          <TagLabel label='Artikel' className='shadow-e4' 
          style={{
            transformOrigin: 'center',
            transform: isCardHovered ? 'rotate(3deg)' : 'rotate(-3deg)',
          }}
          onMouseEnter={()=> setIsCardHovered(true)}
          onMouseLeave={()=> setIsCardHovered(false)}
          />
          
          {/*  Show loading state */}
          {isLoading ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse flex-1"></div>
          ) : (
            <p className='text-body-1 text-black pr-4'>{articleData.deskripsi_artikel}</p>
          )}
          
          <Link href='/article'>
            <Button 
              icon={<RightArrowIcon className="h-4 w-4" />} 
              iconPosition="right"
              roundedClass="rounded-md"
              color="bg-accent-yellow-300" 
              hoverColor="hover:bg-accent-yellow-500"
              focusColor="focus:bg-accent-yellow-400"
              label="Lihat Artikel"
              textColor="text-accent-neutral-1000"
              textSize="text-body-2"
              className="whitespace-nowrap"
            >
              Lihat Artikel
            </Button>
          </Link>
        </div>

        {/*  Article Cards Section with Loading State */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {isLoading ? (
            //  Loading skeleton
            <>
              {[1, 2].map((i) => (
                <div key={i} className="bg-accent-blue-500 rounded-lg p-6 animate-pulse">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-40 lg:w-48 h-48 bg-blue-400 rounded-lg"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-blue-400 rounded w-3/4"></div>
                      <div className="h-4 bg-blue-400 rounded"></div>
                      <div className="h-4 bg-blue-400 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : recentArticles.length === 0 ? (
            //  Empty state
            <div className="col-span-2 text-center py-12">
              <p className="text-h-7 font-bold text-accent-neutral-1000">
                Belum ada artikel yang dipublikasikan
              </p>
              <p className="text-body-2 text-gray-600 mt-2">
                Artikel akan muncul setelah admin mempublikasikan
              </p>
            </div>
          ) : (
            //  Render articles - Use imageUrl prop
            recentArticles.map((article) => (
              <ArticleCard
                key={article.id}
                judul={article.title}
                deskripsi={article.contentPreview}
                gambar={article.imageUrl}
                tanggal={article.created_at}
                articleId={article.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}