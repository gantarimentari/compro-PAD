'use client';

import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import Button from '@ds/ui/Button';
import SuccessToast from '@ds/ui/SuccessToast';

const EditJenisHewanModal = ({ isOpen, onClose, jenisHewan, onSave }) => {
  const [formData, setFormData] = useState({
    species: jenisHewan?.species || '',
    ownerId: jenisHewan?.ownerId || null,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update formData saat jenisHewan berubah
  useEffect(() => {
    if (jenisHewan) {
      setFormData({
        species: jenisHewan.species || '',
        ownerId: jenisHewan.ownerId || null,
      });
      setShowSuccess(false);
    }
  }, [jenisHewan]);
  
  if (!isOpen || !jenisHewan) return null;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);
    
    try {
      await onSave(jenisHewan.id, {
        species: formData.species,
        ownerId: formData.ownerId,
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error saving jenis hewan:', err);
      alert('Gagal menyimpan perubahan: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Jenis Hewan"
      description="Perbarui jenis hewan"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
        
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Jenis Hewan
          </label>
          <input
            type="text"
            value={formData.species}
            onChange={(e) => setFormData({...formData, species: e.target.value})}
            placeholder="Contoh: Kucing, Anjing, Burung"
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
  
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 font-medium"
          >
            Batal
          </button>
          <Button
            type="submit"
            disabled={isSubmitting}
            color="bg-accent-blue-400" 
            hoverColor="hover:bg-accent-blue-500"
            focusColor="focus:bg-accent-blue-300"
            roundedClass="rounded-lg"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
      <SuccessToast show={showSuccess} />
    </BaseModal>
  );
};

export default EditJenisHewanModal;