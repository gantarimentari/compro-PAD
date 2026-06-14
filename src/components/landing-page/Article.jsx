"use client";
import React, { useState } from 'react';
import TagLabel from '../ui/Button/TagLabel';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { RightArrowIcon } from '@/components/icons';
import ArticleCard from './components/ArticleCard';
import { useSystemInfo, usePublicArticles } from './hooks/useLandingPage';

export default function Article() {
  const [isCardHovered, setIsCardHovered] = useState(false);

  const { data: systemInfoData } = useSystemInfo();
  const { data: rawArticlesData, isLoading } = usePublicArticles();

  const articleData = {
    deskripsi_artikel: systemInfoData?.systemInfo?.deskripsi_artikel || 
      "Artikel adalah halaman yang memuat informasi, pengetahuan, dan edukasi seputar topik tertentu agar Pawrents mendapatkan wawasan baru terkait hewan kesayangannya."
  };

  const stripHtmlPreserveSpace = (html) => {
    if (!html) return '';
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/\n+/g, '\n')
      .trim();
  };

  //  FILTER & PROCESS: Hanya ambil artikel dengan status 'Publish'
  const recentArticles = rawArticlesData ? rawArticlesData
    .filter(article => article.status === 'Publish')
    .slice(0, 2)
    .map(article => ({
      id: article.id,
      title: article.title,
      content: article.content,
      category: article.category,
      status: article.status,
      created_at: article.created_at,
      updated_at: article.updated_at,
      imageUrl: article.imageUrl || '/images/placeholder-article.png',
      contentPreview: stripHtmlPreserveSpace(article.content).substring(0, 200) + '...',
    }))
    : [
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
    ];

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
        className="hidden lg:block absolute pointer-events-none z-[1]"
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
        className="hidden lg:block absolute pointer-events-none z-[1]"
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
      
      <div className="container max-w-7xl mx-auto p-8 lg:pb-8 pb-32 relative z-[5] min-h-[85vh]">
        {/* Header Section */}
        <div className='flex flex-col lg:flex-row items-center gap-4 lg:gap-6 py-10 px-0'>
          <TagLabel label='Artikel' className='shadow-e4' 
          style={{
            transformOrigin: 'center',
            transform: isCardHovered ? 'rotate(3deg)' : 'rotate(-3deg)',
          }}
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
          />
          
          {/* Show loading state + responsive text */}
          {isLoading ? (
            <div className="h-6 bg-gray-200 rounded animate-pulse flex-1"></div>
          ) : (
            <p className='text-body-1 text-black lg:pr-4 flex-1 text-center lg:text-left break-words whitespace-pre-line'>
              {articleData.deskripsi_artikel}
            </p>
          )}
          
          {/* Button - hanya tampil di lg+ */}
          <Link href='/article' className='hidden lg:block'>
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

        {/* Article Cards Section with Loading State */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
          {isLoading ? (
            // Loading skeleton
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
            // Empty state
            <div className="col-span-2 text-center py-12">
              <p className="text-h-7 font-bold text-accent-neutral-1000">
                Belum ada artikel yang dipublikasikan
              </p>
              <p className="text-body-2 text-gray-600 mt-2">
                Artikel akan muncul setelah admin mempublikasikan
              </p>
            </div>
          ) : (
            // Render articles - Use imageUrl prop from database
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

        {/* Button - hanya tampil di mobile (lg ke bawah), di bawah cards */}
        <div className='lg:hidden mt-6 flex justify-center'>
          <Link href='/article' className='w-full'>
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
              className="w-full"
            >
              Lihat Artikel
            </Button>
          </Link>
        </div>

        {/* Button - hanya tampil di lg ke bawah, di bawah cards */}
        <div className='lg:hidden mt-6 flex justify-center'>
          <Link href='/article' className='w-full '>
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
              className="w-full"
            >
              Lihat Artikel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}