'use client';

import React, { useEffect } from 'react';
import { CloseIcon } from '@ds/icons';

const PreviewMediaModal = ({ media, isOpen, onClose }) => {
  const defaultPlaceholder = "/images/placeholder.png";

  useEffect(() => {
    if (media && isOpen) {
      console.log('🎬 Preview Media Props:', media);
      console.log('📹 Video URL:', media.videoUrl);
      console.log('🖼️ Image URL:', media.imageUrl);
      console.log('📂 Category:', media.category);
      console.log('🔍 isVideo check:', media.category === 'Video' || media.videoUrl);
    }
  }, [media, isOpen]);

  if (!isOpen || !media) return null;

  const getYouTubeEmbedUrl = (url) => {
    console.log('🔗 Converting URL:', url);
    
    if (!url) {
      console.log('❌ URL is null/undefined');
      return null;
    }
    
    try {
      let videoId = null;
      
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('youtube.com/embed/')) {
        return url;
      }
      
      const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      console.log('✅ Embed URL:', embedUrl);
      return embedUrl;
    } catch (error) {
      console.error('❌ Error parsing YouTube URL:', error);
      return null;
    }
  };

  // ✅ Fix: Cek video hanya jika videoUrl ada DAN tidak null/undefined
  const isVideo = (media.category === 'Video' && media.videoUrl) || (media.videoUrl && media.videoUrl.trim() !== '');
  const embedUrl = isVideo ? getYouTubeEmbedUrl(media.videoUrl) : null;

  console.log('🎥 Final isVideo:', isVideo);
  console.log('🔗 Final embedUrl:', embedUrl);

  return (
    <div 
      className="fixed inset-0 z-50 bg-accent-neutral-225 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-transparent max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          aria-label="Close modal"
          className="absolute -top-10 right-8 z-20 w-10 h-10 bg-accent-yellow-300 rounded-lg flex shadow-md items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 duration-300 hover:shadow-xl"
        > 
          <CloseIcon className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="relative w-full h-full flex items-center justify-center">
          {!isVideo ? (
            // ✅ Preview Foto
            <div className="flex flex-col items-center">
              <img
                className="max-w-full border-4 max-h-[85vh] object-contain rounded-lg shadow-2xl"
                alt={media.name}
                src={media.imageUrl || defaultPlaceholder}
                onLoad={() => console.log('✅ Image loaded successfully:', media.imageUrl)}
                onError={(e) => { 
                  console.error('❌ Image failed to load:', media.imageUrl);
                  console.error('❌ Error event:', e);
                  e.target.onerror = null; 
                  e.target.src = defaultPlaceholder; 
                }}
              />
              <p className="text-white text-sm mt-4 bg-black bg-opacity-50 px-4 py-2 rounded">
                {media.name}
              </p>
            </div>
          ) : embedUrl ? (
            // ✅ Preview Video YouTube
            <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full border-4 rounded-lg"
                src={embedUrl}
                title={media.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            // ✅ Fallback
            <div className="w-full max-w-4xl aspect-video bg-gray-900 rounded-lg flex items-center justify-center p-8">
              <div className="text-center">
                <p className="text-white text-lg mb-2">Media tidak dapat dimuat</p>
                <p className="text-gray-400 text-sm">Category: {media.category}</p>
                <p className="text-gray-400 text-sm break-all">Video URL: {media.videoUrl || 'null'}</p>
                <p className="text-gray-400 text-sm break-all">Image URL: {media.imageUrl || 'null'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewMediaModal;

