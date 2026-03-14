'use client';

import React from 'react';
import BaseModal from './BaseModal';
import Button from '@/components/ui/Button';

const DeleteConfirmModal = ({ 
  isOpen, onClose, onConfirm, itemName,
  itemType = 'item', // 'pasien', 'artikel', 'media', 'hewan', dll
  title = null,description = null
}) => {
  const defaultTitle = title || `Hapus ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`;
  const defaultDescription = description || `Apakah Anda yakin ingin menghapus ${itemType} "${itemName}"? Tindakan ini tidak dapat dibatalkan.`;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="p-6">
        <h3 className="text-h-7 font-bold text-accent-neutral-1000 mb-4">
          {defaultTitle}
        </h3>
        <p className="text-accent-neutral-700 mb-6">
          {defaultDescription}
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
          >
            Batal
          </button>
          <Button
            color="bg-accent-red-300" 
            hoverColor="hover:bg-accent-red-400"
            roundedClass="rounded-lg"
            onClick={onConfirm}
            className="px-5 py-1"
          >
            Hapus
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteConfirmModal;

