'use client';

import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import Button from '@ds/Button';

// Data dummy untuk dropdown pemilik (nanti akan diambil dari ManagementPasien)
const DUMMY_PEMILIK = [
  { id: 1, name: 'andi' },
  { id: 2, name: 'budi' },
  { id: 3, name: 'cinta' },
  { id: 4, name: 'dina' },
  { id: 5, name: 'eko' },
];

// Data dummy untuk dropdown jenis hewan
const JENIS_HEWAN = [
  'Kucing',
  'Anjing',
  'Burung',
  'Hamster',
  'Kelinci',
  'Ikan',
  'Reptil',
  'Lainnya'
];

const EditHewanModal = ({ isOpen, onClose, hewan, onSave }) => {
  const [formData, setFormData] = useState({
    petName: hewan?.petName || '',
    species: hewan?.species || '',
    ownerName: hewan?.ownerName || hewan?.name || '',
  });

  useEffect(() => {
    if (hewan) {
      setFormData({
        petName: hewan.petName,
        species: hewan.species,
        ownerName: hewan.ownerName || hewan.name,
      });
    }
  }, [hewan]);

  if (!isOpen || !hewan) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(hewan.id, formData);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Hewan"
      description="Perbarui data hewan"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-2">
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

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Jenis Hewan
          </label>
          <select
            value={formData.species}
            onChange={(e) => setFormData({ ...formData, species: e.target.value })}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none"
            required        
          >
            <option value="">Pilih jenis hewan</option>
            {JENIS_HEWAN.map((jenis, index) => (
              <option key={index} value={jenis}>
                {jenis}
              </option>
            ))}
          </select>
        </div>

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
            {DUMMY_PEMILIK.map((pemilik) => (
              <option key={pemilik.id} value={pemilik.name}>
                {pemilik.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
          >
            Batal
          </button>
          <Button
            type="submit"
            color="bg-accent-blue-400" 
            hoverColor="hover:bg-accent-blue-500"
            focusColor="focus:bg-accent-blue-300"
            roundedClass="rounded-lg"
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditHewanModal;

