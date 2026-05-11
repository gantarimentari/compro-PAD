import React from 'react';
import { CloseCircleIcon } from '@/components/icons';
import  { ModalDashedBorder } from '@/components/ui/frame/garisputus';


const buildMessage = (notification) => {
  if (notification?.message_content) {
    return notification.message_content;
  }
if (notification?.message) {
    return notification.message;
  }}
export default function NotificationDetailModal({ isOpen, onClose, notification }) {
  if (!isOpen || !notification) {
    return null;
  }
  return(
    <div 
      className="fixed inset-0 pb-10 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative z-10 p-6 md:p-8 overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-accent-neutral-1000 flex-1 min-w-0">
              Notifikasi
            </h2>
            <button 
              onClick={onClose} 
              aria-label="Close modal"
              className="w-10 h-10 md:w-11 md:h-11 flex-shrink-0 bg-accent-yellow-300 rounded-lg flex items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 duration-300 hover:shadow-md"
            >
              <CloseCircleIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
          
          <div className="w-full h-px bg-accent-neutral-200 mb-6" />
          
          {/* Content */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Description Section */}
            
            <div className="w-full flex flex-col gap-4">
              <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300">
                {/* SVG Border - tidak ikut scroll */}
                <ModalDashedBorder className="absolute inset-0 pointer-events-none p-1 stroke-accent-yellow-400 z-20" />
                
                {/* Content area - tidak perlu scroll karena sudah dipaginasi */}
                <div className="p-6 md:p-8">
                  <div className="relative z-10 text-base text-accent-neutral-1000 leading-relaxed">
                    {/* Tampilkan konten halaman saat ini */}
                    <div className="py-4 px-2 whitespace-pre-wrap text-body-2 text-accent-neutral-900 leading-relaxed">
            {buildMessage(notification) || 'Tidak ada konten pesan'}
          </div>
                  </div>
                </div>
              </div>
              
            
            </div>
          </div>
          
          {/* <div className="w-full h-px bg-accent-neutral-200 mt-6" /> */}
        </div>
      </div>
    </div>

  )
};

