'use client';
import React, { useState, useEffect } from 'react';
import api from '@lib/api';
import BaseModal from './BaseModal';

const EditReservasiModal = ({ isOpen, onClose, onSave, reservasi }) => {
  const [formData, setFormData] = useState({
    petId: '',
    date: '',
    keluhan: '',
  });
  
  const [petOptions, setPetOptions] = useState([]);

  // ✅ Load data saat modal dibuka
  useEffect(() => {
    if (reservasi && isOpen) {
      setFormData({
        petId: reservasi.petId || '',
        date: reservasi.date ? reservasi.date.split('/').reverse().join('-') : '', // Convert DD/MM/YYYY to YYYY-MM-DD
        keluhan: reservasi.keluhan || '',
      });
      
      // Fetch hewan milik pemilik ini
      if (reservasi.ownerId) {
        fetchOwnerPets(reservasi.ownerId);
      }
    }
  }, [reservasi, isOpen]);

  const fetchOwnerPets = async (ownerId) => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get('/api/hewan');
      
      const filtered = res.data.filter(pet => pet.id_pasien === parseInt(ownerId));
      setPetOptions(filtered);
      
      console.log('📦 Owner Pets:', filtered);
    } catch (err) {
      console.error('Error fetching pets:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('📤 Updating Reservation:', {
      id: reservasi.id,
      formData
    });
    
    onSave(reservasi.id, formData);
  };

  if (!reservasi) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Reservasi"
      description={`Ubah data reservasi untuk ${reservasi.petName}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-3">
        {/* Info Pemilik (Read-only) */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Pemilik:</strong> {reservasi.ownerName}
          </p>
        </div>

        {/* Dropdown Hewan */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-2">
            Hewan
          </label>
          <select
            value={formData.petId}
            onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          >
            <option value="">Pilih hewan</option>
            {petOptions.map((pet) => (
              <option key={pet.id_hewan} value={pet.id_hewan}>
                {pet.nama_hewan} ({pet.jenis_hewan?.nama_jenis || 'Unknown'})
              </option>
            ))}
          </select>
        </div>

        {/* Tanggal Reservasi */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-2">
            Tanggal Reservasi
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

        {/* Keluhan */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-2">
            Keluhan
          </label>
          <textarea
            value={formData.keluhan}
            onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
            placeholder="Deskripsikan keluhan atau tujuan kunjungan"
            className="w-full bg-accent-neutral-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 min-h-[80px]"
            required
          />
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditReservasiModal;