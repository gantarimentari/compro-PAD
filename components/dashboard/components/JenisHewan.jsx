'use client';
import React, { useState, useEffect } from 'react';
import api from '@lib/api';
import Button from '@ds/Button';
import { TrashIcon, PenIcon} from '@ds/icons';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import {TambahJenisHewanModal, EditJenisHewanModal,DeleteConfirmModal} from '@ds/dashboard/modals';
// import { headers } from 'next/headers';


const flattenJenisHewan = (data) => {
  const flattened = [];
  data.forEach(jenis => {
    if (jenis.pemilik && jenis.pemilik.length > 0) {
      jenis.pemilik.forEach(pemilik => {
        flattened.push({
          id: `${jenis.id}-${pemilik.id_pemilik}`,
          jenisHewanId: jenis.id,
          species: jenis.nama_jenis,
          name: pemilik.nama_pemilik,
          pemilikId: pemilik.id_pemilik,
        });
      });
    } else {
      // Jika jenis hewan belum ada pemilik
      flattened.push({
        id: `${jenis.id}-0`,
        jenisHewanId: jenis.id,
        species: jenis.nama_jenis,
        name: '-',
        pemilikId: null,
      });
    }
  });
  return flattened;
};

const Species_COLUMNS = [
  {key: 'species', header: 'Jenis Hewan'},
  {key: 'name', header: 'Nama Pemilik'},
  { key: 'actions', header: 'Aksi', isAction: true },
  
];

const renderCell = (item,key, onEdit, onDelete) => {
  switch(key){
    case 'actions':
      return(
        <div className="flex justify-center space-x-2">
          <Button 
            icon={<PenIcon className="h-4 w-4" />} 
            roundedClass="rounded-lg"
            color="bg-accent-yellow-300" 
            hoverColor="hover:bg-accent-yellow-500"
            focusColor="focus:bg-accent-yellow-400"
            onClick={() => onEdit(item)}
            label={`Edit ${item.species}`}
          />
         <Button 
            icon={<TrashIcon className="h-4 w-4" />} 
            roundedClass="rounded-lg"
            color="bg-accent-red-300" 
            hoverColor="hover:bg-accent-red-400"
            onClick={() => onDelete(item)}
            label={`Hapus ${item.species}`}
          />
      </div>
      );
    default:
      return item[key];
  }
}

export default function JenisHewan() {
  const [jenisHewanData, setJenisHewanData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJenis, setSelectedJenis] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jenisToDelete, setJenisToDelete] = useState(null);

  const fetchJenisHewan = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get('/api/jenis-hewan');
      
      console.log('📦 Jenis Hewan Data:', res.data);
      setJenisHewanData(res.data);
    } catch (err) {
      console.error('Error fetching jenis hewan:', err);
      alert('Gagal memuat data jenis hewan');
    }
  };

  useEffect(() => {
    fetchJenisHewan();
  }, []);

  // ✅ Flatten dan filter
  const flattenedData = flattenJenisHewan(jenisHewanData);
  const filteredData = flattenedData.filter(item =>
    item.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleSaveSpecies = async (formData) => {
    try {
      await api.get('/sanctum/csrf-cookie');

      const payload = {
        nama_jenis: formData.species, // Sesuaikan dengan field di modal
      };

      console.log('📤 Sending payload:', payload);

      await api.post('/api/jenis-hewan', payload);
      await fetchJenisHewan();
      setIsModalOpen(false);
      alert('✅ Jenis hewan berhasil ditambahkan!');
    } catch (err) {
      console.error('Error saving jenis hewan:', err);
      alert(`❌ Gagal menyimpan: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = (item) => {
    setSelectedJenis({
      id: item.jenisHewanId,
      species: item.species,
      ownerName: item.name,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSpecies = async (id, formData) => {
    try {
      await api.get('/sanctum/csrf-cookie');

      const payload = {
        nama_jenis: formData.species,
      };

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

  const handleDelete = (item) => {
    setJenisToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (jenisToDelete) {
      try {
        await api.get('/sanctum/csrf-cookie');
        await api.delete(`/api/jenis-hewan/${jenisToDelete.jenisHewanId}`);
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
          placeholderText="Cari jenis hewan..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      <Table
      columns= {Species_COLUMNS}
      data={filteredData}
      renderCell={(item, key) => renderCell(item, key, handleEdit, handleDelete)}/>  
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
  )
}