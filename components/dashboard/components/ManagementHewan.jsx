'use client';

import React, { useState, useEffect, useMemo } from 'react';
import api from '@lib/api';
import { TrashIcon, PenIcon} from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import {TambahHewanModal,EditHewanModal,DeleteConfirmModal} from '@ds/dashboard/modals';

// Fungsi untuk flatten data dari owner dengan pets menjadi array hewan
const flattenHewanData = (ownerData) => {
  const flattened = [];
  ownerData.forEach(owner => {
    if (owner.pets && owner.pets.length > 0) {
      owner.pets.forEach(pet => {
        flattened.push({
          id: pet.id, // ✅ Fix: use pet.id instead of pet.petId
          petName: pet.petName || `Hewan ${pet.id}`,
          species: pet.speciesName, // ✅ Fix: use speciesName from backend
          ownerName: owner.name,
          ownerId: owner.id,
          speciesId: pet.speciesId,
          birthDate: pet.birthDate,
          age: pet.age || '-',
        });
      });
    }
  });
  return flattened;
};

const HEWAN_COLUMNS = [
  {key: 'petName', header: 'Nama Hewan'},
  {key: 'species', header: 'Jenis Hewan'},
  {key: 'ownerName', header: 'Pemilik'},
  {key: 'birthDate', header: 'Tanggal Lahir'},
  {key: 'age', header: 'Umur'},
  {key: 'actions', header: 'Aksi', isAction: true},
];

export default function ManagementHewan() {
  const [HewanData, setHewanData] = useState([]);
  const [groupedHewanData, setGroupedHewanData] = useState([]);
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [jenisHewanOptions, setJenisHewanOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHewan, setSelectedHewan] = useState(null);
  const [hewanToDelete, setHewanToDelete] = useState(null);

  useEffect(() => {
    fetchHewanData();
    fetchOwners(); // ✅ Fix: use correct function name
    fetchJenisHewan(); // ✅ Fix: use correct function name
  }, []);

  // ✅ Fetch hewan data (both grouped and flat)
  const fetchHewanData = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get('/api/hewan');
      
      console.log('📦 Raw Grouped Data:', res.data);
      console.log('📦 First owner:', res.data[0]); // ✅ Check structure
      console.log('📦 First owner pets:', res.data[0]?.pets); // ✅ Check pets array
    
      setGroupedHewanData(res.data);
    
      const flattened = flattenHewanData(res.data);
      console.log('📊 Flattened Data for Table:', flattened);
      setHewanData(res.data);
    
    } catch (err) {
      console.error('❌ Error fetching hewan data:', err);
    }
  };

  // ✅ Fetch jenis hewan options
  const fetchJenisHewan = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get('/api/jenis-hewan');
      
      console.log('📦 Raw Jenis Hewan Data:', res.data);
      
      const formatted = res.data.map(jenis => ({
        id_jenisHewan: jenis.id_jenisHewan || jenis.id,
        nama_jenis: jenis.nama_jenis,
      }));
      
      console.log('✅ Formatted Jenis Hewan:', formatted);
      setJenisHewanOptions(formatted);
    } catch (err) {
      console.error('❌ Error fetching jenis hewan:', err);
      setJenisHewanOptions([]);
    }
  };

  // ✅ Fetch owner/patient options
  const fetchOwners = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get('/api/patients');
      
      const formatted = res.data.map(patient => ({
        id: patient.id,
        name: patient.username || patient.name,
        email: patient.email,
        phone_number: patient.phone_number
      }));
      
      console.log('👥 Owner Options:', formatted);
      setOwnerOptions(formatted);
    } catch (err) {
      console.error('❌ Error fetching owners:', err);
      console.error('Response:', err.response?.data);
      setOwnerOptions([]);
    }
  };

  // Flatten data untuk ditampilkan di tabel
  const flattenedData = useMemo(() => flattenHewanData(HewanData), [HewanData]);

  const filteredData = useMemo(() => {
    return flattenedData.filter(item =>
      item.ownerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.species?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.petName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [flattenedData, searchQuery]);

  const handleSaveHewan = async (formData) => {
    try {
      await api.get('/sanctum/csrf-cookie');

      const payload = {
        id_pasien: formData.ownerId,
        id_jenisHewan: formData.speciesId,
        nama_hewan: formData.petName,
        tanggal_lahir_hewan: formData.birthDate || null,
      };

      console.log('📤 Saving Hewan:', payload);

      await api.post('/api/hewan', payload); // ✅ Fix endpoint (plural)

      await fetchHewanData(); // ✅ Refresh data
      setIsModalOpen(false);
      alert('✅ Hewan berhasil ditambahkan!');
    } catch (err) {
      console.error('❌ Error saving hewan:', err);
      console.error('Response:', err.response?.data);
      alert(`❌ Gagal menyimpan hewan: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEditHewan = async (id, formData) => {
    try {
      await api.get('/sanctum/csrf-cookie');

      const payload = {
        id_pasien: formData.ownerId,
        id_jenisHewan: formData.speciesId,
        nama_hewan: formData.petName,
        tanggal_lahir_hewan: formData.birthDate || null,
      };

      await api.put(`/api/hewan/${id}`, payload); // ✅ Fix endpoint (plural)
      await fetchHewanData(); // ✅ Refresh data
      setIsEditModalOpen(false);
      setSelectedHewan(null);
      alert('✅ Hewan berhasil diupdate!');
    } catch (err) {
      console.error('❌ Error updating hewan:', err);
      alert(`❌ Gagal mengupdate hewan: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = (id) => {
    const hewan = flattenedData.find(item => item.id === id);
    setHewanToDelete(hewan);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      await api.delete(`/api/hewan/${hewanToDelete.id}`); // ✅ Fix endpoint (plural)
      await fetchHewanData(); // ✅ Refresh data
      setIsDeleteModalOpen(false);
      setHewanToDelete(null);
      alert('✅ Hewan berhasil dihapus!');
    } catch (err) {
      console.error('❌ Error deleting hewan:', err);
      alert('❌ Gagal menghapus hewan');
    }
  };

  const handleEdit = (item) => {
    setSelectedHewan(item);
    setIsEditModalOpen(true);
  };

  const renderCell = (item, key) => {
    switch (key) {
      case 'actions':
        return (
          <div className="flex justify-center space-x-2">
            <Button 
              icon={<PenIcon className="h-4 w-4" />} 
              roundedClass="rounded-lg"
              color="bg-accent-yellow-300" 
              hoverColor="hover:bg-accent-yellow-500"
              focusColor="focus:bg-accent-yellow-400"
              onClick={() => handleEdit(item)}
              label={`Edit ${item.petName}`}
            />
            <Button 
              icon={<TrashIcon className="h-4 w-4" />} 
              roundedClass="rounded-lg"
              color="bg-accent-red-300" 
              hoverColor="hover:bg-accent-red-400"
              onClick={() => handleDelete(item.id)}
              label={`Hapus ${item.petName}`}
            />
          </div>
        );
      default:
        return item[key] || '-';
    }
  };

  // ✅ Fetch jenis hewan untuk PASIEN TERTENTU
  const fetchJenisHewanByOwner = async (ownerId) => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get(`/api/jenis-hewan?id_pasien=${ownerId}`);
      
      console.log(`📦 Jenis Hewan for Owner ${ownerId}:`, res.data);
      
      return res.data.map(jenis => ({
        id_jenisHewan: jenis.id_jenisHewan,
        nama_jenis: jenis.nama_jenis,
      }));
    } catch (err) {
      console.error('❌ Error fetching jenis hewan by owner:', err);
      return [];
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manajemen Hewan"
        description="Kelola data hewan"
        addButtonText="Tambah Hewan"
        onAddClick={() => setIsModalOpen(true)}
      />

      <div className="space-y-4">
        <SearchBar
          placeholderText="Cari nama hewan, jenis, atau pemilik..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Table 
          columns={HEWAN_COLUMNS}
          data={filteredData}
          renderCell={renderCell}
        />
      </div>

      <TambahHewanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHewan}
        ownerOptions={ownerOptions}
        jenisHewanOptions={jenisHewanOptions}
        existingHewans={groupedHewanData} // ✅ Pass grouped data
      />

      <EditHewanModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedHewan(null);
        }}
        hewan={selectedHewan}
        onSave={handleEditHewan}
        ownerOptions={ownerOptions}
        jenisHewanOptions={jenisHewanOptions}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setHewanToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={hewanToDelete?.petName}
        itemType="hewan"
      />
    </div>
  );
}