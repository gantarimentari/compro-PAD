'use client';
import React from 'react';
import PreviewModal from '../../shared-modals/PreviewModal';

const PreviewFAQModal = ({ isOpen, onClose, faq }) => {
  return (
    <PreviewModal
    isOpen={isOpen}
    onClose={onClose}
     maxWidth="max-w-md"
    title="Detail FAQ"
    description="Detail lengkap FAQ"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Judul
          </label>
          <p className="text-body-2 text-accent-neutral-800">{faq?.question || '-'}</p>
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Status
          </label>
          <p className="text-body-2 text-accent-neutral-800">{faq?.status || '-'}</p>
        </div>
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
          Tanggal Ditambahkan
          </label>
          <p className="text-body-2 text-accent-neutral-800">{faq?.created_at ? new Date(faq.created_at).toLocaleDateString('id-ID') : '-'}</p>
        </div>
        
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Deskripsi
          </label>
          <p className="text-body-2 text-accent-neutral-800">{faq?.answer || '-'}</p>
        </div>
      </div>
    </PreviewModal>
  );
};
export default PreviewFAQModal;