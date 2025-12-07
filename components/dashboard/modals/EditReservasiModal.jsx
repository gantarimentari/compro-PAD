'use client';
import React, { useState, useEffect } from 'react';
import api from '@lib/api';
import BaseModal from './BaseModal';

const EditReservasiModal = ({ isOpen, onClose, onSave, reservasi }) => {
  const [formData, setFormData] = useState({
    ownerId: '',
    petId: '',
    date: '',
    keluhan: '',
  });
  
  const [petOptions, setPetOptions] = useState([]);
  const [isLoadingPets, setIsLoadingPets] = useState(false);

  // ✅ Load data saat modal dibuka
  useEffect(() => {
    if (reservasi && isOpen) {
      console.log('📝 Loading reservation data:', reservasi);
      
      setFormData({
        ownerId: reservasi.ownerId || '',
        petId: reservasi.petId || '',
        date: reservasi.date ? reservasi.date.split('/').reverse().join('-') : '',
        keluhan: reservasi.keluhan || '',
      });
      
      // ✅ Fetch hewan milik pemilik ini
      if (reservasi.ownerId) {
        fetchOwnerPets(reservasi.ownerId);
      }
    }
  }, [reservasi, isOpen]);

  // ✅ Fetch pets by owner ID - Filter dari semua hewan
  const fetchOwnerPets = async (ownerId) => {
    try {
      setIsLoadingPets(true);
      await api.get('/sanctum/csrf-cookie');
      
      console.log('🐾 Fetching all hewan to filter by owner ID:', ownerId);
      
      // ✅ Fetch ALL hewan data (grouped by owner)
      const res = await api.get('/api/hewan');
      console.log('📦 All Hewan Data:', res.data);
      
      // ✅ Find owner's data in grouped structure
      const ownerData = res.data.find(owner => owner.id === parseInt(ownerId));
      
      if (ownerData && ownerData.pets) {
        console.log('✅ Found owner pets:', ownerData.pets);
        
        // ✅ Format pets for dropdown
        const formattedPets = ownerData.pets.map(pet => ({
          id_hewan: pet.id,
          nama_hewan: pet.petName,
          jenis_hewan: {
            nama_jenis: pet.speciesName
          }
        }));
        
        setPetOptions(formattedPets);
        console.log('✅ Formatted pets:', formattedPets);
      } else {
        console.log('⚠️ No pets found for owner:', ownerId);
        setPetOptions([]);
      }
      
    } catch (err) {
      console.error('❌ Error fetching pets:', err);
      console.error('Error details:', err.response?.data);
      setPetOptions([]);
      alert('Gagal memuat data hewan');
    } finally {
      setIsLoadingPets(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ✅ Validation
    if (!formData.petId || !formData.date || !formData.keluhan) {
      alert('❌ Semua field wajib diisi!');
      return;
    }
    
    console.log('📤 Updating Reservation:', {
      id: reservasi.id,
      formData
    });
    
    onSave(reservasi.id, formData);
  };

  // ✅ Reset form saat modal ditutup
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
      description={`Ubah data reservasi untuk ${reservasi.petName}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-3">
        {/* ✅ Info Pemilik (Read-only) */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Pemilik:</strong> {reservasi.ownerName}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            ID: {reservasi.ownerId}
          </p>
        </div>

        {/* ✅ Dropdown Hewan */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-2">
            Hewan <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.petId}
            onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 disabled:opacity-50"
            disabled={isLoadingPets}
            required
          >
            <option value="">
              {isLoadingPets ? 'Memuat hewan...' : 'Pilih hewan'}
            </option>
            {!isLoadingPets && petOptions.length === 0 ? (
              <option disabled>Tidak ada hewan terdaftar</option>
            ) : (
              petOptions.map((pet) => (
                <option key={pet.id_hewan} value={pet.id_hewan}>
                  {pet.nama_hewan} ({pet.jenis_hewan?.nama_jenis || 'Unknown'})
                </option>
              ))
            )}
          </select>
          
          {/* ✅ Status indicator */}
          {!isLoadingPets && (
            <p className="text-xs mt-1">
              {petOptions.length === 0 ? (
                <span className="text-red-500">
                  ⚠️ Pemilik ini belum memiliki hewan terdaftar
                </span>
              ) : (
                <span className="text-green-600">
                  ✅ Ditemukan {petOptions.length} hewan
                </span>
              )}
            </p>
          )}
        </div>

        {/* ✅ Tanggal Reservasi */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-2">
            Tanggal Reservasi <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>

        {/* ✅ Keluhan */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-2">
            Keluhan <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.keluhan}
            onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
            placeholder="Deskripsikan keluhan atau tujuan kunjungan"
            className="w-full bg-accent-neutral-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 min-h-[80px]"
            required
          />
        </div>

        {/* ✅ Buttons */}
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
            disabled={isLoadingPets || petOptions.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditReservasiModal;