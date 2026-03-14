'use client';
import React, { useState, useEffect } from 'react';
import hewanService from '@/lib/services/hewanService';
import BaseModal from '../../shared-modals/BaseModal';
import SuccessToast from '@/components/ui/SuccessToast';

const EditReservasiModal = ({ isOpen, onClose, onSave, reservasi }) => {
  const [formData, setFormData] = useState({
    ownerId: '',
    petId: '',
    date: '',
    keluhan: '',
  });
  
  const [petOptions, setPetOptions] = useState([]);
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data saat modal dibuka
  useEffect(() => {
    if (reservasi && isOpen) {
      console.log('📝 Loading reservation data:', reservasi);
      
      setFormData({
        ownerId: reservasi.ownerId || '',
        petId: reservasi.petId || '',
        date: reservasi.date ? reservasi.date.split('/').reverse().join('-') : '',
        keluhan: reservasi.keluhan || '',
      });
      
      if (reservasi.ownerId) {
        fetchOwnerPets(reservasi.ownerId);
      }
    }
  }, [reservasi, isOpen]);

  // fetch pets by owner ID - flatten grouped data
  const fetchOwnerPets = async (ownerId) => {
    try {
      setIsLoadingPets(true);
      const data = await hewanService.getAll();
      console.log('🐾 Raw Pets Data:', data);
      
      // Backend mengirim data grouped by owner
      const ownerData = data.find(owner => String(owner.id) === String(ownerId));
      
      if (ownerData && ownerData.pets && Array.isArray(ownerData.pets)) {
        const formattedPets = ownerData.pets.map(pet => ({
          id_hewan: pet.id,
          nama_hewan: pet.petName,
          jenis_hewan: pet.speciesName,
          speciesId: pet.speciesId,
        }));
        console.log(`✅ Pets for owner ${ownerId}:`, formattedPets);
        setPetOptions(formattedPets);
      } else {
        console.log(`⚠️ No pets found for owner ${ownerId}`);
        setPetOptions([]);
      }
    } catch (err) {
      console.error('Error fetching pets:', err);
      setPetOptions([]);
      alert('Gagal memuat data hewan');
    } finally {
      setIsLoadingPets(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.petId || !formData.date || !formData.keluhan) {
      alert('Semua field wajib diisi!');
      return;
    }
    
    setIsSubmitting(true);
    setShowSuccess(false);
    
    try {
      console.log('Updating Reservation:', {
        id: reservasi.id,
        formData
      });
      
      await onSave(reservasi.id, formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Gagal memperbarui reservasi: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      ownerId: '',
      petId: '',
      date: '',
      keluhan: '',
    });
    setPetOptions([]);
    onClose();
  };

  if (!reservasi) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Reservasi"
      description="Perbarui data reservasi"
      maxWidth='max-w-lg'
    >
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
        
        {/* Nama Pasien */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Nama Pasien
          </label>
          <div className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg border border-accent-neutral-300">
            {reservasi.ownerName}
          </div>
        </div>

        {/* Dropdown Hewan*/}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Hewan
          </label>
          <select
            value={formData.petId}
            onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none disabled:opacity-50"
            disabled={isLoadingPets || petOptions.length === 0}
            required
          >
            <option value="">
              {isLoadingPets 
                ? 'Memuat hewan...' 
                : petOptions.length === 0 
                ? 'Pemilik ini belum memiliki hewan' 
                : 'Pilih hewan'}
            </option>
            {petOptions.map((pet) => (
              <option key={pet.id_hewan} value={pet.id_hewan}>
                {pet.nama_hewan} ({pet.jenis_hewan || 'Unknown'})
              </option>
            ))}
          </select>
        </div>

        {/* Tanggal Reservasi*/}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Tanggal Reservasi
          </label>
          <input
            type='date'
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>

        {/* Keluhan*/}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Keluhan
          </label>
          <textarea
            value={formData.keluhan}
            onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
            placeholder='Deskripsikan keluhan atau tujuan kunjungan'
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 min-h-[80px]"
            required
          />
        </div>

        {/* Buttons*/}
        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoadingPets || petOptions.length === 0 || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
      <SuccessToast show={showSuccess} />
    </BaseModal>
  );
};

export default EditReservasiModal;