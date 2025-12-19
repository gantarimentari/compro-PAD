'use client';

import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import api from '@lib/api';

const TambahJenisHewanModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ownerId: '',
    species: '',
  });
  const [pemilikOptions, setPemilikOptions] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchPemilik();
    }
  }, [isOpen]);

  const fetchPemilik = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get('/api/patients');
      
      // Format data untuk dropdown
      const formatted = res.data.map(patient => ({
        id: patient.id,
        name: patient.username || patient.name,
        email: patient.email,
      }));
      
      setPemilikOptions(formatted);
      console.log('Pemilik Options:', formatted);
    } catch (err) {
      console.error('Error fetching pemilik:', err);
      setPemilikOptions([]);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData({ ownerId: '', species: '' });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Form Data:', formData);
    
    onSave(formData); // Kirim ke parent (JenisHewan.jsx)
    
    // Reset form
    setFormData({ ownerId: '', species: '' });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Jenis Hewan Baru"
      description="Tambahkan jenis hewan baru ke dalam sistem"
      maxWidth="max-w-lg"
    >
      {/* UI Baru: px-6 pb-6 pt-2 space-y-2 */}
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
        
        {/* Dropdown Nama Pemilik - Logic HEAD + UI Baru */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Pemilik
          </label>
          <select
            value={formData.ownerId}
            onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
            className={`text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none ${!formData.ownerId ? 'text-accent-neutral-800' : 'text-accent-neutral-1000'}`}
            required 
          >
            <option value="" className="text-accent-neutral-800">Pilih nama pemilik</option>
            {pemilikOptions && pemilikOptions.length > 0 ? (
              pemilikOptions.map((pemilik) => (
                <option key={pemilik.id} value={pemilik.id} className="text-accent-neutral-1000">
                  {pemilik.name} - {pemilik.email}
                </option>
              ))
            ) : (
              <option disabled>Tidak ada data pemilik</option>
            )}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Total pemilik: {pemilikOptions?.length || 0}
          </p>
        </div>

        {/* Input Jenis Hewan */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Jenis Hewan
          </label>
          <input
            type="text"
            value={formData.species}
            onChange={(e) => setFormData({ ...formData, species: e.target.value })}
            placeholder="Masukkan jenis hewan"
            className="text-body-2 placeholder:text-accent-neutral-800 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Jenis hewan ini akan menjadi milik pemilik yang dipilih
          </p>
        </div>

        {/* Buttons*/}
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

export default TambahJenisHewanModal;