'use client';

import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import Button from '@ds/ui/Button';
import SuccessToast from '@ds/ui/SuccessToast';

const EditJenisVaksinModal = ({ isOpen, onClose, vaksin, onSave }) => {
  const [formData, setFormData] = useState({
    nama_vaksin: '',
    interval: '',
    deskripsi: '',
    efek_samping: '',
    status: true
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (vaksin) {
      setFormData({
        nama_vaksin: vaksin.type || '',
        interval: vaksin.interval || '',
        deskripsi: vaksin.description || '',
        efek_samping: vaksin.sideEffect || '',
        status: vaksin.isActive ?? (String(vaksin.status).toLowerCase() === 'available')
      });
    }
  }, [vaksin, isOpen]);
  if (!isOpen || !vaksin) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);
    try {
      await onSave(vaksin.id, formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving vaccine type:', error);
      alert('Gagal menyimpan perubahan: ' + (error?.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Jenis Vaksin"
    description='Perbarui data jenis vaksin'  maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">Nama Vaksin</label>
          <input 
            type="text" 
            value={formData.nama_vaksin}
            onChange={(e) => setFormData({...formData, nama_vaksin: e.target.value})}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2"
            required
          />
        </div>
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">Interval Booster (bulan)</label>
          <input
            type="number"
            value={formData.interval} 
            onChange={(e) => setFormData({...formData, interval: e.target.value})}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2"
            required
          />
        </div>
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">Deskripsi</label>
          <textarea
            value={formData.deskripsi}    
            onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2"
            required
          />

        </div>
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">Efek Samping</label>
          <textarea
            value={formData.efek_samping}    
            onChange={(e) => setFormData({...formData, efek_samping: e.target.value})}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2"
            required
          />
        </div>
        <div className="flex items-center space-x-2 pt-2">
          <input
            id="aktif"
            type="checkbox"
            checked={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
            className="w-4 h-4 text-blue-600 bg-accent-neutral-200 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="aktif" className="text-body-2 text-accent-neutral-1000 cursor-pointer">
            Aktif (tersedia untuk dipilih di Reminder Vaksinasi)
          </label>
        </div>
        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
          >
            Batal
          </button>
          <Button
            type="submit"
            disabled={isSubmitting}
            color="bg-blue-600"
            hoverColor="hover:bg-blue-700"
            roundedClass="rounded-lg"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
     <SuccessToast show={showSuccess} />
    </BaseModal>
  );
}
export default EditJenisVaksinModal;