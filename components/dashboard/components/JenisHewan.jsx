'use client';

import React, { useState, useEffect } from 'react';
import api from '@lib/api';
import Button from '@ds/Button';
import { TrashIcon, PenIcon} from '@ds/icons';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import {TambahJenisHewanModal, EditJenisHewanModal, DeleteConfirmModal} from '@ds/dashboard/modals';

const Species_COLUMNS = [
  {key: 'species', header: 'Jenis Hewan'},
  {key: 'ownerName', header: 'Nama Pemilik'},
  {key: 'actions', header: 'Aksi', isAction: true},
];

export default function JenisHewan() {
  const [jenisHewanData, setJenisHewanData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJenis, setSelectedJenis] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jenisToDelete, setJenisToDelete] = useState(null);

  // ✅ Fetch jenis hewan dengan relasi pasien
  const fetchJenisHewan = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get('/api/jenis-hewan');
      
      console.log('📦 Jenis Hewan Data:', res.data);
      
      // ✅ Transform data untuk table
      const formatted = res.data.map(jenis => ({
        id: jenis.id_jenisHewan,
        species: jenis.nama_jenis,
        ownerId: jenis.id_pasien,
        ownerName: jenis.pasien?.username || jenis.pasien?.name || '-',
        ownerEmail: jenis.pasien?.email || '',
      }));
      
      console.log('✅ Formatted Data:', formatted);
      setJenisHewanData(formatted);
    } catch (err) {
      console.error('Error fetching jenis hewan:', err);
      alert('Gagal memuat data jenis hewan');
    }
  };

  useEffect(() => {
    fetchJenisHewan();
  }, []);

  // ✅ Filter data
  const filteredData = jenisHewanData.filter(item =>
    item.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Handle save jenis hewan baru
  const handleSaveSpecies = async (formData) => {
    try {
      await api.get('/sanctum/csrf-cookie');

      const payload = {
        nama_jenis: formData.species,
        id_pasien: formData.ownerId, // ✅ Send ownerId (not ownerName)
      };

      console.log('📤 Sending payload:', payload);

      await api.post('/api/jenis-hewan', payload);
      await fetchJenisHewan();
      setIsModalOpen(false);
      alert('✅ Jenis hewan berhasil ditambahkan!');
    } catch (err) {
      console.error('Error saving jenis hewan:', err);
      
      // ✅ Better error handling
      const errorMessage = err.response?.data?.message || err.message;
      alert(`❌ Gagal menyimpan: ${errorMessage}`);
    }
  };

  // ✅ Handle edit
  const handleEdit = (item) => {
    setSelectedJenis({
      id: item.id,
      species: item.species,
      ownerId: item.ownerId,
      ownerName: item.ownerName,
    });
    setIsEditModalOpen(true);
  };

  // ✅ Handle update jenis hewan
  const handleUpdateSpecies = async (id, formData) => {
    try {
      await api.get('/sanctum/csrf-cookie');

      const payload = {
        nama_jenis: formData.species,
        // id_pasien tidak bisa diubah (karena jenis hewan milik pasien tertentu)
      };

      console.log('📤 Updating jenis hewan:', payload);

      await api.put(`/api/jenis-hewan/${id}`, payload);
      await fetchJenisHewan();
      setIsEditModalOpen(false);
      setSelectedJenis(null);
      alert('✅ Jenis hewan berhasil diupdate!');
    } catch (err) {
      console.error('Error updating jenis hewan:', err);
      alert(`❌ Gagal mengupdate: ${err.response?.data?.message || err.message}`);
    }
  };

  // ✅ Handle delete
  const handleDelete = (item) => {
    setJenisToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // ✅ Confirm delete
  const handleConfirmDelete = async () => {
    if (jenisToDelete) {
      try {
        await api.get('/sanctum/csrf-cookie');
        await api.delete(`/api/jenis-hewan/${jenisToDelete.id}`);
        await fetchJenisHewan();
        setIsDeleteModalOpen(false);
        setJenisToDelete(null);
        alert('✅ Jenis hewan berhasil dihapus!');
      } catch (err) {
        console.error('Error deleting jenis hewan:', err);
        alert(`❌ ${err.response?.data?.message || 'Gagal menghapus jenis hewan'}`);
      }
    }
  };

  // ✅ Render cell
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
              label={`Edit ${item.species}`}
            />
            <Button 
              icon={<TrashIcon className="h-4 w-4" />} 
              roundedClass="rounded-lg"
              color="bg-accent-red-300" 
              hoverColor="hover:bg-accent-red-400"
              onClick={() => handleDelete(item)}
              label={`Hapus ${item.species}`}
            />
          </div>
        );
      default:
        return item[key] || '-';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Jenis Hewan"
        description="Kelola data jenis hewan"
        addButtonText="Tambah Jenis Hewan"
        onAddClick={() => {
          console.log('Tombol Tambah Jenis Hewan diklik');
          setIsModalOpen(true);
        }}
      />
      
      <div className="space-y-4">
        <SearchBar
          placeholderText="Cari jenis hewan atau nama pemilik..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <Table
          columns={Species_COLUMNS}
          data={filteredData}
          renderCell={renderCell}
        />  
      </div>

      <TambahJenisHewanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSpecies}
      />

      <EditJenisHewanModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedJenis(null);
        }}
        onSave={handleUpdateSpecies}
        jenisHewan={selectedJenis}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setJenisToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={jenisToDelete?.species || ''}
        itemType="jenis hewan"
      />
    </div>
  );
}