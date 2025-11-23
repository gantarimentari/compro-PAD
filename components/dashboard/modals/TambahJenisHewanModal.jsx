'use client';
import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import api from '@lib/api';

const TambahJenisHewanModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ownerName: '',
    species: '',
  });
  const [pemilikOptions, setPemilikOptions] = useState([]);

  // ✅ Fetch data pemilik dari database
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
        name: patient.username,
        email: patient.email,
      }));
      
      setPemilikOptions(formatted);
      console.log('📦 Pemilik Options:', formatted);
    } catch (err) {
      console.error('Error fetching pemilik:', err);
    }
  };

  // ✅ Reset form saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setFormData({ ownerName: '', species: '' });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('📤 Form Data:', formData);
    
    onSave(formData); // Kirim ke parent (JenisHewan.jsx)
    
    // Reset form
    setFormData({ ownerName: '', species: '' });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Jenis Hewan Baru"
      description="Tambahkan jenis hewan baru ke dalam sistem"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-2">
        {/* ✅ Dropdown Nama Pemilik */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Pemilik
          </label>
          <select
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none"
            required
          >
            <option value="">Pilih nama pemilik</option>
            {pemilikOptions && pemilikOptions.length > 0 ? (
              pemilikOptions.map((pemilik) => (
                <option key={pemilik.id} value={pemilik.name}>
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

        {/* ✅ Input Jenis Hewan */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Jenis Hewan
          </label>
          <input
            type="text"
            value={formData.species}
            onChange={(e) => setFormData({ ...formData, species: e.target.value })}
            placeholder="Masukkan jenis hewan"
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
        </div>

        {/* ✅ Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 font-medium shadow-sm"
          >
            Simpan
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default TambahJenisHewanModal;