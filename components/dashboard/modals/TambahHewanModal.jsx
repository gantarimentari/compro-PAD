'use client';

import React, { useState, useMemo, useEffect } from 'react';
import BaseModal from './BaseModal';


const TambahHewanModal = ({ isOpen, onClose, onSave, ownerData = [] }) => {
  const [formData, setFormData] = useState({
    petName: '',
    species: '',
    ownerName: ''
  });

  // Ambil daftar pemilik dari ownerData
  const availableOwners = useMemo(() => {
    if (ownerData && ownerData.length > 0) {
      return ownerData.map(owner => ({ id: owner.id, name: owner.name }));
    }
    return [];
  }, [ownerData]);

  // Filter jenis hewan berdasarkan pemilik yang dipilih
  const availableSpecies = useMemo(() => {
    if (!formData.ownerName) {
      return [];
    }
    
    // Cari owner berdasarkan nama
    const selectedOwner = ownerData.find(owner => owner.name === formData.ownerName);
    
    if (selectedOwner && selectedOwner.pets && selectedOwner.pets.length > 0) {
      // Ambil semua jenis hewan unik yang dimiliki pemilik tersebut
      const speciesSet = new Set(selectedOwner.pets.map(pet => pet.species));
      return Array.from(speciesSet);
    }
    
    return [];
  }, [formData.ownerName, ownerData]);

  // Reset species ketika pemilik berubah
  useEffect(() => {
    if (formData.ownerName) {
      setFormData(prev => ({ ...prev, species: '' }));
    }
  }, [formData.ownerName]);

  // Reset form ketika modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        petName: '',
        species: '',
        ownerName: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      petName: '',
      species: '',
      ownerName: ''
    });
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Hewan"
      description="Masukkan data hewan baru"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
      <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Pemilik
          </label>
          <select
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            className={`w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none text-body-2 ${!formData.ownerName ? 'text-accent-neutral-800' : 'text-accent-neutral-1000'}`}
            required 
          >
            <option value="" className='text-accent-neutral-800'>Pilih nama pemilik</option>
            {availableOwners.map((pemilik) => (
              <option key={pemilik.id} value={pemilik.name} className='text-accent-neutral-1000'>
                {pemilik.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Hewan
          </label>
          <input 
            type="text"
            value={formData.petName}
            onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
            placeholder="Masukkan nama hewan"
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800"
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
            className={`w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none text-body-2 ${!formData.species ? 'text-accent-neutral-800' : 'text-accent-neutral-1000'}`}
            required
            disabled={!formData.ownerName || availableSpecies.length === 0}
          >
            <option value="" className='text-accent-neutral-800'>
              {!formData.ownerName 
                ? 'Pilih nama pemilik terlebih dahulu' 
                : availableSpecies.length === 0 
                  ? 'Pemilik ini belum memiliki hewan' 
                  : 'Pilih jenis hewan'}
            </option>
            {availableSpecies.map((jenis, index) => (
              <option key={index} value={jenis} className='text-accent-neutral-1000'>
                {jenis}
              </option>
            ))}
          </select>
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

