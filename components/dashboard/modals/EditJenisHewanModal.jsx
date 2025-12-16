'use client';

import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import Button from '@ds/Button';
import api from '@lib/api';

const EditJenisHewanModal = ({ isOpen, onClose, jenisHewan, onSave }) => {
  const [formData, setFormData] = useState({
    species: jenisHewan?.species || '',
    patient_id: jenisHewan?.patient_id || '', // ✅ Simpan patient_id, bukan ownerName
  });
  const [pemilikList, setPemilikList] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch daftar pemilik dari backend
  useEffect(() => {
    if (isOpen) {
      fetchPemilik();
    }
  }, [isOpen]);
  
  const fetchPemilik = async () => {
    try {
      setLoading(true);
      // ✅ Pastikan endpoint ini mengembalikan list pasien dengan struktur:
      // [{ id: 1, username: "rakai", ... }, { id: 2, username: "john", ... }]
      const response = await api.get('/api/patients');
      console.log('📦 Pemilik list:', response.data);
      
      // ✅ Cek struktur data yang diterima
      if (Array.isArray(response.data)) {
        setPemilikList(response.data);
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Jika backend wrap data dalam object { data: [...] }
        setPemilikList(response.data.data);
      } else {
        console.error('❌ Unexpected data structure:', response.data);
        setPemilikList([]);
      }
    } catch (err) {
      console.error('❌ Error fetching pemilik:', err);
      setPemilikList([]);
    } finally {
      setLoading(false);
    }
  };
  
  // ✅ Update formData saat jenisHewan berubah
  useEffect(() => {
    if (jenisHewan) {
      console.log('📝 Editing jenis hewan:', jenisHewan);
      setFormData({
        species: jenisHewan.species || '',
        patient_id: jenisHewan.patient_id || '', // ✅ Ambil patient_id dari jenisHewan
      });
    }
  }, [jenisHewan]);
  
  if (!isOpen || !jenisHewan) return null;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('💾 Submitting edit:', {
      id: jenisHewan.id,
      formData
    });
    
    try {
      // ✅ Kirim data dengan struktur yang benar
      await onSave(jenisHewan.id, {
        species: formData.species,
        patient_id: parseInt(formData.patient_id) // ✅ Convert ke integer
      });
      
      console.log('✅ Edit jenis hewan berhasil');
      onClose();
    } catch (err) {
      console.error('❌ Error saving jenis hewan:', err);
      alert('Gagal menyimpan perubahan: ' + (err.response?.data?.message || err.message));
    }
  };
  
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Jenis Hewan"
      description="Perbarui jenis hewan"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Nama Pemilik
          </label>
          {/* ✅ Value sekarang menggunakan patient_id */}
          <select
            value={formData.patient_id}
            onChange={(e) => {
              console.log('selected patient_id:', e.target.value);
              setFormData({...formData, patient_id: e.target.value});
            }}
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none"
            required 
            disabled={loading}
          >
            <option value="">
              {loading ? 'Memuat data...' : 'Pilih nama pemilik'}
            </option>
            {/* ✅ Option value sekarang menggunakan patient.id */}
            {pemilikList.map((pemilik) => (
              <option key={pemilik.id} value={pemilik.id}>
                {pemilik.username}
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
            onChange={(e) => setFormData({...formData, species: e.target.value})}
            placeholder="Masukkan jenis hewan"
            className="text-body-2 w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
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

export default EditJenisHewanModal;