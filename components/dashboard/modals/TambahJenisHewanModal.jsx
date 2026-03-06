'use client';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import patientService from '@/lib/services/patientService';

const TambahJenisHewanModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ownerId: '',
    species: '',
  });

  // Fetch data pemilik dengan React Query
  const { data: pemilikOptions = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const res = await patientService.getAll();
      return res.map(p => ({
        id: p.id,
        name: p.username || p.name,
        email: p.email,
      }));
    },
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // Reset form saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setFormData({ ownerId: '', species: '' });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Form Data yang akan dikirim:', formData);
    
    onSave(formData);
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
        
        {/* Dropdown Nama Pemilik */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Pemilik
          </label>
          <select
            value={formData.ownerId}
            onChange={(e) => {
              const value = Number(e.target.value);
              console.log('Selected ownerId:', value);
              setFormData({ ...formData, ownerId: value });
            }}
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
            Pilih pemilik yang terkait
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
            placeholder="Contoh: Kucing, Anjing, Burung"
            className="text-body-2 placeholder:text-accent-neutral-800 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Masukkan nama jenis hewan
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