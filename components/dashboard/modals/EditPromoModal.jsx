'use client';

import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { ChevronDownIcon } from '@ds/icons';
import SuccessToast from '@ds/ui/SuccessToast';

const EditPromoModal = ({ isOpen, onClose, onSave, promo }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'available',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (promo && isOpen) {
      setFormData({
        title: promo.title || '',
        description: promo.description || '',
        startDate: promo.startDate || '', // Format: YYYY-MM-DD
        endDate: promo.endDate || '',
        status: promo.status.toLowerCase() || 'available',
      });
    }
  }, [promo, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);
    
    try {
      await onSave(promo.id, formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error updating promo:', error);
      alert('Gagal memperbarui promo: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!promo) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Promo"
      description={`Ubah data promo "${promo.title}"`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="pb-6 pt-2 space-y-2 px-6">
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">Judul</label>
          <input
            type='text'
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Masukkan judul promo"
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">Isi Promo</label>
          <textarea
            value={formData.description}
            onChange={(e)=>setFormData({...formData, description: e.target.value})}
            placeholder='Tuliskan deskripsikan promo disini...'
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-2">
            Tanggal Mulai
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e)=>setFormData({...formData, startDate: e.target.value})}
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-2">
            Tanggal Selesai
          </label>
          <input
            type="date"
            value={formData.endDate}
            min={formData.startDate}
            onChange={(e)=>setFormData({...formData, endDate: e.target.value})}
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>

        <div>
            <label className="block text-h-8 font-bold text-accent-neutral-1000">
          Status Promo
          </label>

          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="text-body-2 font-bold w-full bg-accent-neutral-200 px-4 py-2 pr-10
                        rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                        transition duration-150 appearance-none"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>

            <ChevronDownIcon
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5
                        pointer-events-none text-accent-neutral-600"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
      <SuccessToast show={showSuccess} />
    </BaseModal>
  );
};

export default EditPromoModal;

