'use client';
import React from 'react';
import PreviewModal from '../../shared-modals/PreviewModal';
const PreviewJenisVaksinModal = ({ isOpen, onClose, jenisVaksin }) => {
  if(!isOpen || !jenisVaksin) return null;

  const createdAt = jenisVaksin.created_at || jenisVaksin.createdAt;
  const createdAtDisplay = createdAt ? new Date(createdAt).toLocaleDateString('id-ID') : '-';

  return (
    <PreviewModal
      isOpen={isOpen} onClose={onClose}  maxWidth="max-w-md"
      title={`Detail Vaksinasi ${jenisVaksin.type}`}>
         <div className="space-y-4">
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Interval Booster
          </label>
          <p className="text-body-2 text-accent-neutral-800">{jenisVaksin.interval + ' bulan' || '-'}</p>
        </div>
    
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Status
          </label>
          <p className="text-body-2 text-accent-neutral-800">{jenisVaksin.status || '-'}</p>
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Ditambahkan
          </label>
          <p className="text-body-2 text-accent-neutral-800">{createdAtDisplay}</p>
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Deskripsi
          </label>
          <p className="text-body-2 text-accent-neutral-800">{jenisVaksin.description || '-'}</p>
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Efek Samping Umum Setelah Vaksinasi
          </label>
          <p className="text-body-2 text-accent-neutral-800">{jenisVaksin.sideEffect || '-'}</p>
        </div>
      </div>
      </PreviewModal>

  );
}

export default PreviewJenisVaksinModal;