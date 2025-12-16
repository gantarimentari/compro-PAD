'use client';

import React from 'react';
import PreviewModal from './PreviewModal';

const PreviewPasienModal = ({ isOpen, onClose, pasien }) => {
  if (!isOpen || !pasien) return null;

  return (
    <PreviewModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Hewan Milik ${pasien.name}`}
      description="Daftar hewan yang terdaftar atau nama pasien"
      maxWidth="max-w-md"
      emptyMessage="Belum ada hewan terdaftar"
    >
      {pasien.pets && pasien.pets.length > 0 ? (
        <ul className="">
          {pasien.pets.map((pet, index) => (
            <li key={index} className="flex items-center justify-between bg-accent-neutral-100 rounded-lg py-2">
              <div>
                <p className="text-accent-neutral-1000">{pet.petName} ({pet.species})</p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </PreviewModal>
  );
};

export default PreviewPasienModal;

