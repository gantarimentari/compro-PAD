'use client';

import React, { useState, useEffect, useMemo } from 'react';
import BaseModal from './BaseModal';
import Button from '@ds/Button';
import api from '@lib/api';
import SuccessToast from '@ds/ui/SuccessToast';

const EditHewanModal = ({ isOpen, onClose, hewan, onSave, ownerOptions = [] }) => {
  const [formData, setFormData] = useState({
    petName: hewan?.petName || '',
    speciesId: hewan?.speciesId || '',
    ownerId: hewan?.ownerId || '',
  });

  // fetch api
  const [jenisHewanOptions, setJenisHewanOptions] = useState([]);
  const [isLoadingSpecies, setIsLoadingSpecies] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // update kalo isinya berubah
  useEffect(() => {
    if (hewan) {
      setFormData({
        petName: hewan.petName || '',
        speciesId: hewan.speciesId || '',
        ownerId: hewan.ownerId || '',
      });

      //fetch ownner ketika modal kebuka
      if (hewan.ownerId) {
        fetchJenisHewanByOwner(hewan.ownerId);
      }
    }
  }, [hewan]);

  // fetch berdasarkan id
  const fetchJenisHewanByOwner = async (ownerId) => {
    if (!ownerId) {
      setJenisHewanOptions([]);
      return;
    }

    try {
      setIsLoadingSpecies(true);
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get(`/api/jenis-hewan?id_pasien=${ownerId}`);
      
      const formatted = res.data.map(jenis => ({
        id_jenisHewan: jenis.id_jenisHewan,
        nama_jenis: jenis.nama_jenis,
      }));
      
      console.log('Jenis Hewan for owner:', formatted);
      setJenisHewanOptions(formatted);
    } catch (err) {
      console.error('Error fetching jenis hewan:', err);
      setJenisHewanOptions([]);
    } finally {
      setIsLoadingSpecies(false);
    }
  };

  // handle owner change
  const handleOwnerChange = async (e) => {
    const newOwnerId = e.target.value;
    
    setFormData({ 
      ...formData, 
      ownerId: newOwnerId,
      speciesId: '' // reset jenis hewan if owner change
    });

    // fetch jenis hewan milik owner baru
    await fetchJenisHewanByOwner(newOwnerId);
  };

  // ambil daftar pemilik dari ownerOptions
  const availableOwners = useMemo(() => {
    if (ownerOptions && ownerOptions.length > 0) {
      return ownerOptions.map(owner => ({ id: owner.id, name: owner.name }));
    }
    return [];
  }, [ownerOptions]);

  if (!isOpen || !hewan) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    onSave(hewan.id, formData);
    setTimeout(() => { setShowSuccess(false); onClose(); }, 1500);
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
            value={formData.ownerId}
            onChange={handleOwnerChange}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none text-body-2"
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
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required              
          />
        </div>

        {/* Jenis Hewan - Dynamic berdasarkan owner */}
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Jenis Hewan
          </label>
          <select
            value={formData.speciesId}
            onChange={(e) => setFormData({ ...formData, speciesId: e.target.value })}
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none"
            required
            disabled={!formData.ownerId || isLoadingSpecies} //Disabled jika belum pilih owner atau sedang loading
          >
            <option value="">
              {!formData.ownerId 
                ? 'Pilih pemilik terlebih dahulu'
                : isLoadingSpecies
                ? 'Memuat jenis hewan...'
                : jenisHewanOptions.length === 0
                ? 'Pemilik ini belum memiliki jenis hewan'
                : 'Pilih jenis hewan'}
            </option>
            {jenisHewanOptions.map((jenis) => (
              <option key={jenis.id_jenisHewan} value={jenis.id_jenisHewan}>
                {jenis.nama_jenis}
              </option>
            ))}
          </select>
          
          {/* Helper text */}
          {formData.ownerId && !isLoadingSpecies && jenisHewanOptions.length === 0 && (
            <p className="text-sm text-red-500 mt-1">
              Pemilik ini belum memiliki jenis hewan terdaftar. Silakan tambahkan jenis hewan terlebih dahulu.
            </p>
          )}
        </div>

        {/* Action Buttons */}
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
            disabled={isLoadingSpecies} // Disable submit saat loading
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
      <SuccessToast show={showSuccess} />
    </BaseModal>
  );
};

export default EditHewanModal;

