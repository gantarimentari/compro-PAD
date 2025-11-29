'use client';

import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';

const EditPromoModal = ({ isOpen, onClose, onSave, promo }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'available',
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(promo.id, formData);
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
      <form onSubmit={handleSubmit} className="p-6 space-y-3">
        {/* Same fields as TambahPromoModal */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-2">
            Judul Promo
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-2">
            Deskripsi
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-accent-neutral-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
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
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            min={formData.startDate}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-2">
            Status Promo
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditPromoModal;

