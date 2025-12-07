'use client';

import React, { useState, useEffect, useMemo } from 'react';
import BaseModal from './BaseModal';
import api from '@lib/api';

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
    birthDate: '',
  });
  
  const [jenisHewanOptions, setJenisHewanOptions] = useState([]);

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
        await api.get('/sanctum/csrf-cookie');
        const res = await api.get(`/api/jenis-hewan?id_pasien=${ownerId}`);
        
        const formatted = res.data.map(jenis => ({
          id_jenisHewan: jenis.id_jenisHewan,
          nama_jenis: jenis.nama_jenis,
        }));
        
        console.log('📦 Jenis Hewan for this owner:', formatted);
        setJenisHewanOptions(formatted);
      } catch (err) {
        console.error('❌ Error fetching jenis hewan:', err);
        setJenisHewanOptions([]);
      }
    } else {
      setJenisHewanOptions([]);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '-';
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years > 0) {
      return months > 0 ? `${years} tahun ${months} bulan` : `${years} tahun`;
    } else if (months > 0) {
      return `${months} bulan`;
    } else {
      const days = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
      return `${days} hari`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('📤 Submitting Form Data:', formData);
    
    onSave(formData);
    
    // Reset form
    setFormData({
      petName: '',
      speciesId: '',
      ownerId: '',
      birthDate: '',
    });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Hewan Baru"
      description="Masukkan data hewan pasien"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-3">
        
        {/* Dropdown Pemilik */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Pemilik
          </label>
          <select
            value={formData.ownerId}
            onChange={(e) => handleOwnerChange(e.target.value)}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required 
          >
            <option value="">Pilih nama pemilik</option>
            {ownerOptions && ownerOptions.length > 0 ? (
              ownerOptions.map((owner) => (
                <option key={`owner-${owner.id}`} value={owner.id}>
                  {owner.name} - {owner.email}
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
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
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
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
            disabled={!formData.ownerId}
          >
            <option value="">
              {!formData.ownerId 
                ? 'Pilih pemilik terlebih dahulu' 
                : jenisHewanOptions.length === 0
                ? 'Pemilik belum punya jenis hewan. Tambahkan di menu Jenis Hewan.'
                : 'Pilih jenis hewan'}
            </option>
            {jenisHewanOptions.map((jenis) => (
              <option key={jenis.id_jenisHewan} value={jenis.id_jenisHewan}>
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

        {/* Tanggal Lahir */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Tanggal Lahir (Opsional)
          </label>
          <input 
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            max={new Date().toISOString().split('T')[0]}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.birthDate && (
            <p className="text-sm text-blue-600 mt-1">
              Umur: {calculateAge(formData.birthDate)}
            </p>
          )}
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
            Simpan
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default TambahHewanModal;

