'use client';

import React, { useState, useEffect, useMemo } from 'react';
import BaseModal from './BaseModal';
import Button from '@ds/Button';

const EditHewanModal = ({ isOpen, onClose, hewan, onSave, ownerOptions = [], jenisHewanOptions = [] }) => {
  const [formData, setFormData] = useState({
    petName: hewan?.petName || '',
    speciesId: hewan?.speciesId || '',
    ownerId: hewan?.ownerId || '',
    birthDate: hewan?.birthDate || '',
  });

  useEffect(() => {
    if (hewan) {
      setFormData({
        petName: hewan.petName || '',
        speciesId: hewan.speciesId || '',
        ownerId: hewan.ownerId || '',
        birthDate: hewan.birthDate || '',
      });
    }
  }, [hewan]);

  // Ambil daftar pemilik dari ownerOptions (dari backend /api/patients)
  const availableOwners = useMemo(() => {
    if (ownerOptions && ownerOptions.length > 0) {
      return ownerOptions.map(owner => ({ id: owner.id, name: owner.name }));
    }
    return [];
  }, [ownerOptions]);

  // Ambil daftar jenis hewan dari jenisHewanOptions (dari backend /api/jenis-hewan)
  const availableSpecies = useMemo(() => {
    if (jenisHewanOptions && jenisHewanOptions.length > 0) {
      return jenisHewanOptions;
    }
    return [];
  }, [jenisHewanOptions]);

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
            Nama Pemilik
          </label>
          <select
            value={formData.ownerId}
            onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none"
            required 
          >
            <option value="">Pilih nama pemilik</option>
            {availableOwners.map((pemilik) => (
              <option key={pemilik.id} value={pemilik.id}>
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
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required              
          />
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Jenis Hewan
          </label>
          <select
            value={formData.speciesId}
            onChange={(e) => setFormData({ ...formData, speciesId: e.target.value })}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none"
            required
          >
            <option value="">Pilih jenis hewan</option>
            {availableSpecies.map((jenis) => (
              <option key={jenis.id_jenisHewan} value={jenis.id_jenisHewan}>
                {jenis.nama_jenis}
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

