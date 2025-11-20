'use client';
import React, { useState } from 'react';
import BaseModal from './BaseModal';

// Data dummy dropdown pemilik 
const DUMMY_JENIS = [
  { id: 1, name: 'andi'  },
  { id: 2, name: 'budi' },
  { id: 3, name: 'cinta' },
  { id: 4, name: 'dina' },
  { id: 5, name: 'eko' },
];

const TambahJenisHewanModal = ({isOpen, onClose, onSave})=>{
  const [formData, setFormData] = useState({
    ownerName: '',
    species: '',
  });
  const handleSubmit =(e)=>{
    e.preventDefault();
    onSave(formData);
      setFormData({
        ownerName: '',
        species: '',
      })
    onClose();
  };

  return (
    <BaseModal
    isOpen={isOpen}
      onClose={onClose}
     title="Tambah Jenis Hewan Baru"
      description="Tambahkan jenis hewan baru ke dalam sistem "
      maxWidth="max-w-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-2">
          <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Pemilik
          </label>
          <select
          value={formData.ownerName}
          onChange={(e)=> setFormData({...formData, ownerName: e.target.value})}
          className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none"
            required 
          >
            <option value=" "></option>
            {DUMMY_JENIS.map((pemilik)=>(
              <option key={pemilik.id} value={pemilik.name}>
              {pemilik.name}
            </option>
            ))}
          </select>
          </div>
          <div>
            <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Jenis Hewan
            </label>
            <input
            type="text"
            value={formData.species}
            onChange={(e)=> setFormData({...formData, species: e.target.value})}
            placeholder="Masukkan jenis hewan"
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required
            />
          </div>
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
  )
};
export default TambahJenisHewanModal;