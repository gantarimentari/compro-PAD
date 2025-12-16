'use client';

import React, { useState, useEffect, useMemo } from 'react';
import BaseModal from './BaseModal';
import Button from '@ds/Button';

const EditHewanModal = ({ isOpen, onClose, hewan, onSave, ownerData = [] }) => {
  const [formData, setFormData] = useState({
    petName: hewan?.petName || '',
    species: hewan?.species || '',
    ownerName: hewan?.ownerName || '',
  });

  useEffect(() => {
    if (hewan) {
      setFormData({
        petName: hewan.petName || '',
        species: hewan.species || '',
        ownerName: hewan.ownerName || '',
      });
    }
  }, [hewan]);

  // Ambil daftar pemilik dari ownerData
  const availableOwners = useMemo(() => {
    if (ownerData && ownerData.length > 0) {
      return ownerData.map(owner => ({ id: owner.id, name: owner.name }));
    }
    return [];
  }, [ownerData]);

  //  jenis hewan berdasarkan pemilik yang dipilih
  const availableSpecies = useMemo(() => {
    if (!formData.ownerName) {
      return [];
    }
    
    // Cari owner berdasarkan nama
    const selectedOwner = ownerData.find(owner => owner.name === formData.ownerName);
    
    if (selectedOwner && selectedOwner.pets && selectedOwner.pets.length > 0) {
      // cari jenis hewan yagn dimiliki owner
      const speciesSet = new Set(selectedOwner.pets.map(pet => pet.species));
      return Array.from(speciesSet);
    }
    
    return [];
  }, [formData.ownerName, ownerData]);

  
  useEffect(() => {
    // Hanya reset jika ownerName berubah dan bukan saat initial load
    if (formData.ownerName && hewan && formData.ownerName !== hewan.ownerName) {
      // Cek apakah species yang sekarang masih valid untuk owner baru
      const selectedOwner = ownerData.find(owner => owner.name === formData.ownerName);
      const isValidSpecies = selectedOwner?.pets?.some(pet => pet.species === formData.species);
      
      // Reset species jika tidak valid untuk owner baru
      if (!isValidSpecies) {
        setFormData(prev => ({ ...prev, species: '' }));
      }
    }
  }, [formData.ownerName, hewan, ownerData, formData.species]);

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
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Pemilik
          </label>
          <select
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none text-body-2"
            required 
          >
            <option value="">Pilih nama pemilik</option>
            {availableOwners.map((pemilik) => (
              <option key={pemilik.id} value={pemilik.name}>
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
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
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
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none"
            required
            disabled={!formData.ownerName || availableSpecies.length === 0}
          >
            <option value="">
              {!formData.ownerName 
                ? 'Pilih nama pemilik terlebih dahulu' 
                : availableSpecies.length === 0 
                  ? 'Pemilik ini belum memiliki hewan' 
                  : 'Pilih jenis hewan'}
            </option>
            {availableSpecies.map((jenis, index) => (
              <option key={index} value={jenis}>
                {jenis}
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

