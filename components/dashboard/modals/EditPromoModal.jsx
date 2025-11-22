'use client';

import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { ChevronDownIcon } from '@ds/icons';

const EditPromoModal = ({ isOpen, onClose, onSave, promo }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: ''
  });

  useEffect(() => {
    if (promo) {
      
      const convertDateToInputFormat = (dateString) => {
        if (!dateString) return '';
        if (dateString.includes('/')) {
          const [day, month, year] = dateString.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateString;
      };

      setFormData({
        title: promo.title || '',
        description: promo.description || '',
        startDate: convertDateToInputFormat(promo.startDate) || '',
        endDate: convertDateToInputFormat(promo.endDate) || '',
        status: promo.status || ''
      });
    }
  }, [promo]);

  if (!isOpen || !promo) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(promo.id, formData);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Promo"
      description="Perbarui data promo"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">Judul</label>
          <input
            type='text'
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Masukkan judul promo"
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">Isi Promo</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e)=>setFormData({...formData, description: e.target.value})}
            placeholder='Tuliskan deskripsikan promo disini...'
            className="w-full bg-accent-neutral-200 px-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>
        <div>
          <label className='block text-h-8 font-bold text-accent-neutral-1000'>
            Tanggal Mulai
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e)=>setFormData({...formData, startDate: e.target.value})}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>
        <div>
          <label className='block text-h-8 font-bold text-accent-neutral-1000'>Tanggal Selesai</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e)=>setFormData({...formData, endDate: e.target.value})}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>
        <div>
          <label className='block text-h-8 font-bold text-accent-neutral-1000'>Status</label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e)=>setFormData({...formData, status: e.target.value})}
              className='font-bold w-full bg-accent-neutral-200 px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none'>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
            <ChevronDownIcon 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none text-accent-neutral-600"
            />
          </div>
        </div>
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
            Simpan Perubahan
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditPromoModal;

