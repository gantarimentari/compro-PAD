"use client";
import React, { useState } from 'react';
import TagLabel from '../../components/Button/TagLabel';
import Button from '@ds/Button';
import Link from 'next/link';
import { RightArrowIcon } from '@ds/icons';
import ArticleCard from './components/ArticleCard';

export default function Article() {
  const [articleData] = useState({
    deskripsiArtikel: "Artikel adalah halaman yang memuat informasi, pengetahuan, dan edukasi seputar topik tertentu agar Pawrents mendapatkan wawasan baru terkait hewan kesayangannya."
  });

  // Dummy data untuk 2 artikel terbaru
  const [recentArticles] = useState([
    {
      id: 1,
      judul: "Cara Merawat Kucing Persia dengan Baik dan Benar",
      deskripsi: "Kucing Persia merupakan salah satu ras kucing yang paling populer di dunia. Dengan bulu yang panjang dan lebat, kucing Persia memerlukan perawatan khusus agar tetap sehat dan cantik. Perawatan rutin seperti menyisir bulu setiap hari sangat penting untuk mencegah bulu kusut dan mengurangi hairball. Selain itu, kebersihan mata dan telinga juga harus diperhatikan karena kucing Persia cenderung memiliki masalah pada bagian tersebut.",
      gambar: "/images/gambarkucingarticle.png",
      tanggal: "2024-12-02"
    },
    {
      id: 2,
      judul: "Pentingnya Vaksinasi Rutin untuk Hewan Peliharaan",
      deskripsi: "Vaksinasi adalah salah satu langkah preventif paling penting dalam menjaga kesehatan hewan peliharaan Anda. Vaksin membantu melindungi hewan dari berbagai penyakit menular yang berbahaya dan bahkan mematikan. Untuk anjing, vaksin DHPPI dan rabies sangat direkomendasikan, sementara untuk kucing, vaksin tricat dan rabies adalah yang paling umum. Jadwal vaksinasi harus dimulai sejak hewan masih berusia muda dan dilanjutkan dengan booster secara berkala.",
      gambar: "/images/hamster.png",
      tanggal: "2024-12-01"
    }
  ]);

  return (
    <div className='min-h-screen flex flex-col relative overflow-hidden'
      style={{
      backgroundImage: "url('/Background/bg-paw-profile.svg')",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundColor: 'white',
    }}
    >
      {/* Ornamen Kiri - Berputar */}
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
      
      {/* Ornamen Kanan - Berputar */}
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
      
      <div className="container max-w-7xl mx-auto p-8 relative z-[5]">
        {/* Header Section */}
        <div className='flex flex-row items-center gap-6 py-10 px-0justify-center'>
          <TagLabel label='Artikel' className='shadow-e4' />
          <p className='text-body-1 text-black pr-4'>{articleData.deskripsiArtikel}</p>
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

        {/* Article Cards Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 '>
          {recentArticles.map((article) => (
            <ArticleCard
              key={article.id}
              judul={article.judul}
              deskripsi={article.deskripsi}
              gambar={article.gambar}
              tanggal={article.tanggal}
              articleId={article.id}
            />
          ))}
        </div>
      </div>
      
      
    </div>
    
  )
};