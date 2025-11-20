'use client';

import React from 'react';
import BaseModal from './BaseModal';

const PreviewModal = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children,
  maxWidth = 'max-w-md',
  emptyMessage = 'Tidak ada data untuk ditampilkan'
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      maxWidth={maxWidth}
      overflowHidden={true}
    >
      <div className="p-6 pt-4">
        {children || (
          <p className="text-accent-neutral-600 text-center py-4">{emptyMessage}</p>
        )}
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition duration-150"
          >
            Tutup
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default PreviewModal;

