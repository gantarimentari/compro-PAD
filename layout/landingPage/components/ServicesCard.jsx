'use client';
import React from 'react';
import { ModalDashedBorder } from '@ds/frame/garisputus';
import { CloseCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@ds/icons';

const ServicesCard = ({ 
  servicesName, 
  servicesDesc, 
  servicesImage,
  isOpen, 
  onClose, 
  onPrev, 
  onNext,
  isFirst = false,
  isLast = false,
  currentIndex = 0,
  totalServices = 4
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 pb-10 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative z-10 p-6 md:p-8 overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-accent-neutral-1000">
              {servicesName}
            </h2>
            <button 
              onClick={onClose} 
              aria-label="Close modal"
              className="w-10 h-10 md:w-11 md:h-11 bg-accent-yellow-300 rounded-lg flex items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 duration-300 hover:shadow-md"
            >
              <CloseCircleIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
          
          <div className="w-full h-px bg-accent-neutral-200 mb-6" />
          
          {/* Content */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Description Section */}
            <div className="w-full flex flex-col gap-4">
              <div className="relative bg-white p-6 md:p-8 rounded-lg border-2 border-accent-red-300">
                <ModalDashedBorder className="absolute inset-0 pointer-events-none stroke-accent-red-400" />
                <div className="relative z-10 text-base text-accent-neutral-1000 leading-relaxed">
                  {/* Render deskripsi dengan support untuk line breaks */}
                  <div className="whitespace-pre-line">
                    {servicesDesc}
                  </div>
                </div>
              </div>
              
              {/* Navigation Buttons with Dots */}
              <div className="flex items-center justify-between mt-4">
                {/* Dot Indicators */}
                <div className="flex gap-2 items-center">
                  {Array.from({ length: totalServices }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'bg-accent-yellow-400 '
                          : 'bg-accent-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  <button 
                    onClick={onPrev}
                    disabled={isFirst}
                    aria-label="Previous service"
                    className={`w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center text-accent-neutral-1000 duration-300 hover:shadow-md ${
                      isFirst 
                        ? 'bg-accent-neutral-250 opacity-50 cursor-not-allowed' 
                        : 'bg-accent-neutral-250 hover:bg-accent-yellow-400'
                    }`}
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={onNext}
                    disabled={isLast}
                    aria-label="Next service"
                    className={`w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center text-accent-neutral-1000 duration-300 hover:shadow-md ${
                      isLast 
                        ? 'bg-accent-yellow-300 opacity-50 cursor-not-allowed' 
                        : 'bg-accent-yellow-300 hover:bg-accent-yellow-400'
                    }`}
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full h-px bg-accent-neutral-200 mt-6" />
        </div>
      </div>
    </div>
  );
};

export default ServicesCard;