'use client';
import React, { useState, useEffect } from 'react';
import patientService from '@/lib/services/patientService';
import hewanService from '@/lib/services/hewanService';
import BaseModal from './BaseModal';
import SuccessToast from '@ds/ui/SuccessToast';

const TambahReservasiModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ownerId: '',
    petId: '',
    date: '',
    keluhan: '',
  });
  
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [petOptions, setPetOptions] = useState([]);
  const [allPets, setAllPets] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOwners();
      fetchAllPets();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.ownerId) {
            
      const filtered = allPets.filter(pet => 
        String(pet.id_pasien) === String(formData.ownerId)
      );
      
      setPetOptions(filtered);
      // Reset petId jika pemilik berubah
      setFormData(prev => ({ ...prev, petId: '' }));
    } else {
      setPetOptions([]);
    }
  }, [formData.ownerId, allPets]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        ownerId: '',
        petId: '',
        date: '',
        keluhan: '',
      });
      setPetOptions([]);
      setShowSuccess(false);
    }
  }, [isOpen]);

  const fetchOwners = async () => {
    try {
      const data = await patientService.getAll();
      const formatted = data.map(patient => ({
        id: patient.id,
        name: patient.username,
        email: patient.email,
      }));
      setOwnerOptions(formatted);
    } catch (err) {
      console.error('Error fetching owners:', err);
    }
  };

  const fetchAllPets = async () => {
    try {
      const data = await hewanService.getAll();
      console.log('🐾 Raw Pets Data from Backend:', data);
      
      // Backend mengirim data grouped by owner, perlu di-flatten
      const flatPets = [];
      data.forEach(owner => {
        if (owner.pets && Array.isArray(owner.pets)) {
          owner.pets.forEach(pet => {
            flatPets.push({
              id_hewan: pet.id,
              nama_hewan: pet.petName,
              id_pasien: owner.id,
              jenis_hewan: pet.speciesName,
              speciesId: pet.speciesId,
            });
          });
        }
      });
      
      console.log('📋 Flattened Pets for Reservasi:', flatPets);
      setAllPets(flatPets);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setAllPets([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);
    
    try {
      console.log('Submitting Reservation:', formData);
      await onSave(formData);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving reservation:', error);
      alert('Gagal menyimpan reservasi: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Reservasi"
      description="Buat reservasi baru untuk pasien"
      maxWidth="max-w-lg"
    >
      {/*px-6 pb-6 pt-2 space-y-2 */}
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
        
        {/*Dropdown Nama Pemilik */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Pasien
          </label>
          <select
            value={formData.ownerId}
            onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
            className={`w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none text-body-2 ${!formData.ownerId ? 'text-accent-neutral-800' : 'text-accent-neutral-1000'}`}
            required
          >
            <option value="" className='text-accent-neutral-800'>Pilih nama pemilik</option>
            {ownerOptions.map((owner) => (
              <option key={owner.id} value={owner.id} className='text-accent-neutral-1000'>
                {owner.name} - {owner.email}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Total pemilik: {ownerOptions.length}
          </p>
        </div>

        {/*Dropdown Hewan*/}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Hewan
          </label>
          <select
            value={formData.petId}
            onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
            className={`w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none text-body-2 disabled:opacity-50 ${!formData.petId ? 'text-accent-neutral-800' : 'text-accent-neutral-1000'}`}
            required
            disabled={!formData.ownerId}
          >
            <option value="" className='text-accent-neutral-800'>
              {!formData.ownerId
                ? 'Pilih pemilik terlebih dahulu'
                : petOptions.length === 0
                ? 'Pemilik ini belum memiliki hewan'
                : 'Pilih hewan'}
            </option>
            {petOptions.map((pet) => (
              <option key={pet.id_hewan} value={pet.id_hewan} className='text-accent-neutral-1000'>
                {pet.nama_hewan} ({pet.jenis_hewan || 'Unknown'})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Hewan tersedia: {petOptions.length}
          </p>
        </div>

        {/* Tanggal Reservasi */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Tanggal Reservasi
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2"
            required
          />
        </div>

        {/*Keluhan*/}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Keluhan
          </label>
          <textarea
            value={formData.keluhan}
            onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
            placeholder="Deskripsikan keluhan atau tujuan kunjungan"
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800 min-h-[80px] resize-none"
            required
          />
        </div>

        {/*Buttons*/}
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
            disabled={!formData.ownerId || petOptions.length === 0 || isSubmitting}
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

export default TambahReservasiModal;