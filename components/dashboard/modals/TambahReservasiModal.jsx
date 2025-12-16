'use client';
import React, { useState, useEffect } from 'react';
import api from '@lib/api';
import BaseModal from './BaseModal';

const TambahReservasiModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ownerId: '', // ✅ Logic HEAD: pakai ownerId
    petId: '',   // ✅ Logic HEAD: pakai petId
    date: '',
    keluhan: '',
  });
  
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [petOptions, setPetOptions] = useState([]);
  const [allPets, setAllPets] = useState([]);

  // ✅ Fetch pemilik dan hewan saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      fetchOwners();
      fetchAllPets();
    }
  }, [isOpen]);

  // ✅ Filter hewan berdasarkan pemilik yang dipilih (Logic HEAD)
  useEffect(() => {
    if (formData.ownerId) {
      console.log('🔍 Filtering pets for owner:', formData.ownerId);
      console.log('📦 All Pets:', allPets);
      
      const filtered = allPets.filter(pet => {
        console.log(`   - Pet ${pet.nama_hewan}: id_pasien=${pet.id_pasien}, match=${pet.id_pasien === parseInt(formData.ownerId)}`);
        return pet.id_pasien === parseInt(formData.ownerId);
      });
      
      console.log('✅ Filtered Pets:', filtered);
      setPetOptions(filtered);
      
      // Reset petId jika pemilik berubah
      setFormData(prev => ({ ...prev, petId: '' }));
    } else {
      setPetOptions([]);
    }
  }, [formData.ownerId, allPets]);

  // ✅ Reset form saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        ownerId: '',
        petId: '',
        date: '',
        keluhan: '',
      });
      setPetOptions([]);
    }
  }, [isOpen]);

  // ✅ Fetch owners (Logic HEAD)
  const fetchOwners = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get('/api/patients');
      
      const formatted = res.data.map(patient => ({
        id: patient.id,
        name: patient.username,
        email: patient.email,
      }));
      
      setOwnerOptions(formatted);
      console.log('📦 Owner Options:', formatted);
    } catch (err) {
      console.error('Error fetching owners:', err);
    }
  };

  // ✅ Fetch all pets & flatten (Logic HEAD)
  const fetchAllPets = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get('/api/hewan');
      
      console.log('📦 Raw Hewan Data (Grouped):', res.data);
      
      // ✅ FLATTEN: Transform grouped data ke flat array
      const flatPets = [];
      res.data.forEach(owner => {
        if (owner.pets && owner.pets.length > 0) {
          owner.pets.forEach(pet => {
            flatPets.push({
              id_hewan: pet.id,
              nama_hewan: pet.petName,
              id_pasien: owner.id,
              id_jenisHewan: pet.speciesId,
              jenis_hewan: {
                nama_jenis: pet.speciesName
              }
            });
          });
        }
      });
      
      console.log('✅ Flattened Pets:', flatPets);
      setAllPets(flatPets);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setAllPets([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('📤 Submitting Reservation:', formData);
    
    onSave(formData);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Reservasi"
      description="Buat reservasi baru untuk pasien"
      maxWidth="max-w-lg"
    >
      {/* ✅ UI Baru: px-6 pb-6 pt-2 space-y-2 */}
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
        
        {/* ✅ Dropdown Nama Pemilik - Logic HEAD + UI Baru */}
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

        {/* ✅ Dropdown Hewan - Logic HEAD + UI Baru */}
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
                {pet.nama_hewan} ({pet.jenis_hewan?.nama_jenis || 'Unknown'})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Hewan tersedia: {petOptions.length}
          </p>
        </div>

        {/* ✅ Tanggal Reservasi - Logic HEAD (min validation) + UI Baru */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Tanggal Reservasi
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]} // ✅ Logic HEAD: validasi tanggal
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2"
            required
          />
        </div>

        {/* ✅ Keluhan - Logic HEAD (textarea) + UI Baru */}
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
            disabled={!formData.ownerId || petOptions.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Simpan
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default TambahReservasiModal;