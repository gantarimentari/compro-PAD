'use client';
import React from 'react';
import { ModalDashedBorder } from '@ds/frame/garisputus';

const ArticleCard = ({ 
  judul, 
  deskripsi, 
  gambar,
  tanggal,
  articleId
}) => {
  return (
    <div className='overflow-hidden relative bg-accent-blue-500 p-6 rounded-lg border-2 border-accent-neutral-1000 shadow-lg'>
      <ModalDashedBorder className="absolute inset-0 pointer-events-none stroke-white z-10" />
      
      {/* Ornamen blue - Desktop version (lg+) */}
      <div 
      className="hidden lg:block absolute pointer-events-none z-[1]"
      style={{
        right: '-340px',
        bottom: '-150px',
        width: '120%',
        height: '120%',
        backgroundImage: "url('/Assets/ornamen-article-blue.svg')",
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    />
      
      {/* Ornamen blue - Tablet version (sm to lg) */}
      <div 
      className="hidden sm:block lg:hidden absolute pointer-events-none z-[1]"
      style={{
        right: '-260px',
        bottom: '-80px',
        width: '80%',
        height: '80%',
        backgroundImage: "url('/Assets/ornamen-article-blue.svg')",
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    />
    
    {/* Ornamen blue - Mobile version (sm ke bawah) */}
      <div 
      className="sm:hidden absolute pointer-events-none z-[1]"
      style={{
        right: '-110px',
        bottom: '-60px',
        width: '80%',
        height: '80%',
        backgroundImage: "url('/Assets/ornamen-article-blue.svg')",
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    />

      
      {/* Flex Container - Image Left, Content Right */}
      <div className='relative z-10 flex flex-row gap-4'>
        {/* Image Section */}
        <div className='flex-shrink-0 w-20 sm:w-40 lg:w-48 z-10'>
          <div className='relative w-full h-full overflow-hidden rounded-lg shadow-md'>
            <img 
              src={gambar} 
              alt={judul}
              className='w-full h-full object-cover transition-transform duration-300'
            />
          </div>
        </div>

        {/* Content Section */}
        <div className='flex flex-col gap-2 flex-1 z-10 '>
          <h3 className='sm:text-h-7 text-body-2 font-bold text-white leading-tight line-clamp-2'>
            {judul}
          </h3>
          <p className='sm:text-body-2 text-body-5 text-white whitespace-pre-line break-words leading-relaxed '>
            {deskripsi}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;

