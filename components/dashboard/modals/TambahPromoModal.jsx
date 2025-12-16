'use client';

import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { ChevronDownIcon } from '@ds/icons';

const TambahPromoModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'available',
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'available',
      });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Promo"
      description="Buat promo baru"
      maxWidth="max-w-lg"
    >
      {/* ✅ UI Baru: px-6 pb-6 pt-2 space-y-2 */}
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
        
        {/* ✅ Judul Promo - UI Baru */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Judul Promo
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Masukkan judul promo"
            className="text-body-2 placeholder:text-accent-neutral-800 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>

        {/* ✅ Deskripsi - UI Baru + textarea (bukan input) */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Deskripsi
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Tuliskan deskripsi promo disini..."
            className="text-body-2 placeholder:text-accent-neutral-800 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 min-h-[80px] resize-none"
            required
          />
        </div>

        {/* ✅ Tanggal Mulai - UI Baru */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Tanggal Mulai
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>

        {/* ✅ Tanggal Selesai - Logic HEAD (min validation) + UI Baru */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Tanggal Selesai
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            min={formData.startDate} // ✅ Logic HEAD: validasi endDate >= startDate
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>

        {/* ✅ Status - UI Baru (dengan ChevronDownIcon) */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Status
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <ChevronDownIcon 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none text-accent-neutral-600"
            />
          </div>
        </div>

        {/* ✅ Buttons - UI Baru */}
        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
          >
            Simpan
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default TambahPromoModal;