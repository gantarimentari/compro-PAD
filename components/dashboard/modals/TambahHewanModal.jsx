'use client';

import React, { useState, useMemo, useEffect } from 'react';
import BaseModal from './BaseModal';


const TambahHewanModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  ownerOptions = [],         // ✅ Rename dari ownerData
  jenisHewanOptions = []     // ✅ Tambahkan prop ini
}) => {
  const [formData, setFormData] = useState({
    petName: '',
    speciesId: '',    // ✅ Ubah dari species ke speciesId
    ownerId: '',      // ✅ Ubah dari ownerName ke ownerId
    birthDate: '',    // ✅ Tambahkan field ini
  });

  useEffect(() => {
    console.log('📦 TambahHewanModal Props:', {
      ownerOptions,
      jenisHewanOptions,
      ownerOptionsLength: ownerOptions?.length,
      jenisHewanOptionsLength: jenisHewanOptions?.length
    });
    const invalidJenis = jenisHewanOptions?.filter(j => !j.id_jenisHewan);
    if (invalidJenis && invalidJenis.length > 0) {
      console.error('❌ Invalid Jenis Hewan Data:', invalidJenis);
  }
  }, [ownerOptions, jenisHewanOptions]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        petName: '',
        speciesId: '',
        ownerId: '',
        birthDate: '',
        age: ''
      });
    }
  }, [isOpen]);

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
      age: ''
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
        
        {/* ✅ Dropdown Pemilik */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Pemilik
          </label>
          <select
            value={formData.ownerId}
            onChange={(e) => {
              console.log('Selected Owner ID:', e.target.value);
              setFormData({ ...formData, ownerId: e.target.value });
            }}
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
              <option key="no-owner" disabled>Tidak ada data pemilik</option>
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

        {/* ✅ Dropdown Jenis Hewan */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Jenis Hewan
          </label>
          <select
            value={formData.speciesId}
            onChange={(e) => setFormData({ ...formData, speciesId: e.target.value })}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          >
            <option value="">Pilih jenis hewan</option>
            {jenisHewanOptions && jenisHewanOptions.length > 0 ? (
              jenisHewanOptions
                .filter(jenis => jenis.id_jenisHewan) // ✅ Filter data undefined
                .map((jenis) => (
                  <option 
                    key={`jenis-${jenis.id_jenisHewan}`} 
                    value={jenis.id_jenisHewan}
                  >
                    {jenis.nama_jenis}
                </option>
              ))
          ) : (
            <option disabled>Tidak ada data jenis hewan</option>
          )}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Total jenis hewan: {jenisHewanOptions?.length || 0}
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

