"use client";
import React, { useState } from 'react';
import BaseModal from './BaseModal';
import jenisHewanService from '@/lib/services/jenisHewanService';
import SuccessToast from '@ds/ui/SuccessToast';

const TambahJenisVaksinModal = ({
  isOpen, onClose, onSave}) => {
    const [formData, setFormData] = useState({
      vaccineName: '',
      interval: '',
      description: '',
      sideEffect: '',
      isActive: true
    });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
return (
  <BaseModal isOpen={isOpen} onClose={onClose} title="Tambah Jenis Vaksin" axWidth="max-w-lg">
    <form className="px-6 pb-6 pt-2 space-y-2">
      <div>
        <label className="block text-h-8 font-bold text-accent-neutral-1000"> 
        Nama Vaksin
      </label>
      <input
      type="type"
      value={formData.vaccineName}
      onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
      placeholder="Masukkan nama vaksin"
      className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800"
      required/>
      </div>

      <div>
        <label className="block text-h-8 font-bold text-accent-neutral-1000">
        Interval Vaksinasi (dalam bulan)
      </label>
      <input
      type="number"
      value={formData.interval}
      onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
      placeholder="Masukkan interval vaksinasi dalam bulan"
      className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800"
      required/>
      </div>
      <div>
        <label className="block text-h-8 font-bold text-accent-neutral-1000">
        Deskripsi
      </label>
      <textarea
      value={formData.description}
      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      placeholder="Masukkan deskripsi vaksin"
      className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800"
      required/>
      </div>
      <div>
        <label className="block text-h-8 font-bold text-accent-neutral-1000">
        Efek Samping
      </label>
      <textarea
      value={formData.sideEffect}
      onChange={(e) => setFormData({ ...formData, sideEffect: e.target.value })}
      placeholder="Masukkan efek samping vaksin"
      className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800"
      required/>
      </div>
      <div className="flex items-center space-x-2 pt-2">
  <input
    id="aktif"
    type="checkbox"
    checked={formData.isActive}
    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      
      

    </form>
    <SuccessToast show={showSuccess} />
    </BaseModal>
)};

export default TambahJenisVaksinModal;