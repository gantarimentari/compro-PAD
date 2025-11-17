'use client';

import React from 'react';
import { CloseIcon } from '@ds/icons';

const PreviewMediaModal = ({ media, isOpen, onClose }) => {
  if (!isOpen || !media) return null;

  const defaultPlaceholder = "/images/gambarkucingarticle.png";

  return (
    <div 
      className="fixed inset-0 z-50 bg-accent-neutral-225 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-transparent max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          aria-label="Close modal"
          className="absolute -top-10 right-8 z-20 w-10 h-10 bg-accent-yellow-300 rounded-lg flex shadow-md items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 duration-300 hover:shadow-xl"
        > 
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="relative w-full h-full flex items-center justify-center">
          {media.category === 'Foto' ? (
            <img
              className="max-w-full border-4 max-h-[85vh] object-contain rounded-lg shadow-2xl"
              alt={media.name}
              src={media.imageUrl || defaultPlaceholder}
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = defaultPlaceholder; 
              }}
            />
          ) : (
            <div className="w-full max-w-4xl aspect-video bg-black rounded-lg flex items-center justify-center">
              <iframe
                className="w-full h-full border-4 rounded-lg"
                src={media.videoUrl?.replace('watch?v=', 'embed/') || ''}
                title={media.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewMediaModal;

