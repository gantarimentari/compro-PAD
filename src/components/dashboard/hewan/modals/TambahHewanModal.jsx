'use client';

import React, { useState } from 'react';
import BaseModal from '../../shared-modals/BaseModal';
import jenisHewanService from '@/lib/services/jenisHewanService';
import SuccessToast from '@/components/ui/SuccessToast';

const TambahHewanModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  ownerOptions = [],
}) => {
  const [formData, setFormData] = useState({
    petName: '',
    speciesId: '',
    ownerId: '',
  });
  
  const [jenisHewanOptions, setJenisHewanOptions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //  Fetch jenis hewan saat owner dipilih
  const handleOwnerChange = async (ownerId) => {
    console.log('👤 Owner selected:', ownerId);
    setFormData({ 
      ...formData, 
      ownerId,
      speciesId: '' // Reset species
    });
    
    if (ownerId) {
      //  Fetch jenis hewan milik owner ini
      try {
        const data = await jenisHewanService.getAll();
        console.log('📋 All Jenis Hewan:', data);
        
        // Filter jenis hewan yang dimiliki owner ini (dari array pemilik)
        const filtered = data.filter(jenis =>
          jenis.pemilik?.some(p => String(p.id_pemilik) === String(ownerId))
        );
        
        const formatted = filtered.map(jenis => ({
          id_jenisHewan: jenis.id,
          nama_jenis: jenis.nama_jenis,
        }));
        
        console.log(`✅ Jenis Hewan untuk owner ${ownerId}:`, formatted);
        setJenisHewanOptions(formatted);
      } catch (err) {
        console.error('Error fetching jenis hewan:', err);
        setJenisHewanOptions([]);
      }
    } else {
      setJenisHewanOptions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);
    
    try {
      console.log('Submitting Form Data:', formData);
      await onSave(formData);
      
      // Reset form
      setFormData({
        petName: '',
        speciesId: '',
        ownerId: '',
      });
      setJenisHewanOptions([]);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('❌ Error saving hewan:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message
      });
      
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
      alert('Gagal menyimpan hewan: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Hewan Baru"
      description="Masukkan data hewan pasien"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
        
        {/* Dropdown Pemilik */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Pemilik
          </label>
          <select
            value={formData.ownerId}
            onChange={(e) => handleOwnerChange(e.target.value)}
            className={`w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none text-body-2 ${!formData.ownerId ? 'text-accent-neutral-800' : 'text-accent-neutral-1000'}`}
            required 
          >
            <option value="" className='text-accent-neutral-800'>Pilih nama pemilik</option>
            {ownerOptions && ownerOptions.length > 0 ? (
              ownerOptions.map((owner) => (
                <option key={`owner-${owner.id}`} value={owner.id} className='text-accent-neutral-1000'>
                  {owner.name}
                </option>
              ))
            ) : (
              <option disabled>Tidak ada data pemilik</option>
            )}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Total pemilik: {ownerOptions?.length || 0}
          </p>
        </div>

        {/* Nama Hewan */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Hewan
          </label>
          <input 
            type="text"
            value={formData.petName}
            onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
            placeholder="Masukkan nama hewan"
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800"
            required              
          />
        </div>

        {/*  Dropdown Jenis Hewan - Dynamic by Owner */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Jenis Hewan
          </label>
          <select
            value={formData.speciesId}
            onChange={(e) => setFormData({ ...formData, speciesId: e.target.value })}
            className={`w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none text-body-2 ${!formData.speciesId ? 'text-accent-neutral-800' : 'text-accent-neutral-1000'}`}
            required
            disabled={!formData.ownerId}
          >
            <option value="" className='text-accent-neutral-800'>
              {!formData.ownerId 
                ? 'Pilih pemilik terlebih dahulu' 
                : jenisHewanOptions.length === 0
                ? 'Pemilik belum punya jenis hewan. Tambahkan di menu Jenis Hewan.'
                : 'Pilih jenis hewan'}
            </option>
            {jenisHewanOptions.map((jenis) => (
              <option key={jenis.id_jenisHewan} value={jenis.id_jenisHewan} className='text-accent-neutral-1000'>
                {jenis.nama_jenis}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {formData.ownerId 
              ? `Jenis hewan tersedia: ${jenisHewanOptions.length}`
              : 'Pilih pemilik untuk melihat jenis hewan'}
          </p>
        </div>

        {/* Buttons */}
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
            disabled={!formData.ownerId || jenisHewanOptions.length === 0 || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
      <SuccessToast show={showSuccess} />
    </BaseModal>
  );
};

export default TambahHewanModal;

