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
      
      {/* Flex Container - Image Left, Content Right */}
      <div className='relative z-10 flex flex-col md:flex-row gap-4'>
        <div 
        className="absolute pointer-events-none z-[1]"
        style={{
          right: '-340px',
          bottom: '-220px',
          width: '100%',
          height: '100%',
          backgroundImage: "url('/Assets/ornamen-article-blue.svg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
        {/* Image Section */}
        <div className='flex-shrink-0 w-full md:w-40 lg:w-48 z-10'>
          <div className='relative w-full h-48 md:h-full overflow-hidden rounded-lg shadow-md'>
            <img 
              src={gambar} 
              alt={judul}
              className='w-full h-full object-cover transition-transform duration-300'
            />
          </div>
        </div>

        {/* Content Section */}
        <div className='flex flex-col gap-2 flex-1 z-10 '>
          <h3 className='text-h-7 font-bold text-white leading-tight'>
            {judul}
          </h3>
          <p className='text-body-3 text-white line-clamp-6'>
            {deskripsi}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;

