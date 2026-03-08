'use client';
import React from 'react';
import PreviewModal from './PreviewModal';

const PreviewPromoModal = ({ isOpen, onClose, promo }) => {
  if (!isOpen || !promo) return null;

  return (
    <PreviewModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Promo"
      description="Lihat informasi tentang detail promo anda"
      maxWidth="max-w-md"
      emptyMessage="Tidak ada data promo"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Judul
          </label>
          <p className="text-body-1 text-accent-neutral-800">{promo.title || '-'}</p>
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Isi Promo
          </label>
          <p className="text-body-1 text-accent-neutral-800">{promo.description || '-'}</p>
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Tanggal Mulai
          </label>
          <p className="text-body-1 text-accent-neutral-800">{promo.startDate || '-'}</p>
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Tanggal Selesai
          </label>
          <p className="text-body-1 text-accent-neutral-800">{promo.endDate || '-'}</p>
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Status Promo
          </label>
          <p className="text-body-1 text-accent-neutral-800">{promo.status || '-'}</p>
        </div>
      </div>
    </PreviewModal>
  );
};

export default PreviewPromoModal;