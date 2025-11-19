'use client';
import React, { useState, useMemo, useEffect } from 'react';
import BaseModal from './BaseModal';

const TambahReservasiModal = ({ isOpen, onClose, onSave, ownerData = [] }) => {
  const [formData, setFormData] = useState({
    
    ownerName: '',
    petName: '',
    date: '',
    keluhan: '',
    // status: 'Belum Reservasi'
  });
  const availableOwners = useMemo(()=>{
    if (ownerData && ownerData.length > 0) {
      return ownerData.map(owner => ({ id: owner.id, name: owner.name }));
    }
    return [];
  }, [ownerData]);

  const availablePets = useMemo(()=>{
    if(!formData.ownerName) {
      return [];

    }
    const selectedOwner = ownerData.find(owner => owner.name === formData.ownerName);
    if (selectedOwner && selectedOwner.pets && selectedOwner.pets.length > 0) {
      const petName = new Set(selectedOwner.pets.map(pet => pet.petName));
      return Array.from(petName);
  }
    return [];
  }, [formData.ownerName, ownerData]);

  useEffect(()=>{
    if(formData.ownerName){
      setFormData(prev => ({...prev, petName: ''}));
    }
  }, [formData.ownerName]);

  useEffect(()=>{
    if(!isOpen){
      setFormData({
        ownerName: '',
        petName: '',
        date: '',
        keluhan: '',
      });
    }
  }, [isOpen]);

  const handleSubmit = (e)=>{
    e.preventDefault();
    onSave(formData);
    setFormData({
      ownerName: '',
      petName: '',
      date: '',
      keluhan: '',
    });
    onClose();
  };
  return (
    <BaseModal
    isOpen={isOpen}
      onClose={onClose}
      title="Tambah Reservasi"
      description="Buat reservasi baru untuk pasien"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-2">
        <div>
          <label className='block text-h-8 font-bold text-accent-neutral-1000'>
            Nama Pasien
          </label>
          <select
           value={formData.ownerName}
           onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
           className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none"
           required >
            <option value="">Pilih nama pemilik</option>
            {availableOwners.map((pemilik) => (
              <option key={pemilik.id} value={pemilik.name}>
                {pemilik.name}
              </option>
            ))}
           </select>
        </div>
        <div>
          <label className='block text-h-8 font-bold text-accent-neutral-1000'>
            Hewan 
          </label>
          <select
           value={formData.petName}
           onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
           className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none"
           required 
           disabled={!formData.ownerName || availablePets.length === 0}
           >
            <option value="">
              {!formData.ownerName
              ? 'Pilih Hewan' 
              : availablePets.length === 0
              ? 'Pemilik ini belum memiliki hewan'
              : 'Pilih hewan'}
            </option>
            {availablePets.map((hewan, index) => (
              <option key={index} value={hewan}>
                {hewan}
              </option>
            ))}


           </select>
           </div>
           <div>
            <label className='block text-h-8 font-bold text-accent-neutral-1000'>
              Tanggal
            </label>
            <input
            type="date"
            value={formData.date}
            onChange={(e)=>setFormData({...formData, date: e.target.value})}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required>
            </input>
           </div>
           <div>
            <label className='block text-h-8 font-bold text-accent-neutral-1000'>
              Keluhan
            </label>
            <input
            type="text"
            value={formData.keluhan}
            onChange={(e)=>setFormData({...formData, keluhan: e.target.value})}
            placeholder='Deskripsikan keluhan atau tujuan kunjungan'
            className="w-full bg-accent-neutral-200 px-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            required>
            </input>

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
export default TambahReservasiModal;