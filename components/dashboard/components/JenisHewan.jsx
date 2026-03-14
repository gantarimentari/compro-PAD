'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import jenisHewanService from '@/lib/services/jenisHewanService';
import Button from '@ds/ui/Button';
import { TrashIcon, PenIcon } from '@ds/icons';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import { TambahJenisHewanModal, EditJenisHewanModal, DeleteConfirmModal } from '@ds/dashboard/modals';

const Species_COLUMNS = [
  { key: 'species', header: 'Jenis Hewan' },
  { key: 'ownerName', header: 'Nama Pemilik' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

export default function JenisHewan() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJenis, setSelectedJenis] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jenisToDelete, setJenisToDelete] = useState(null);

  // --- 1. FETCH DATA DENGAN REACT QUERY ---
  const { data: jenisHewanData = [], isLoading } = useQuery({
    queryKey: ['jenis-hewan-full'],
    queryFn: async () => {
      const res = await jenisHewanService.getAll();
      
      console.log('Jenis Hewan Response:', res);
      
      return res.map(jenis => {
        // Backend mengirim field 'pemilik' yang berisi array pemilik
        const owners = jenis.pemilik || [];
        
        // Format nama pemilik dan ambil ownerId
        let ownerDisplay = '-';
        let ownerId = null;
        
        if (owners.length > 0) {
          const firstOwner = owners[0];
          ownerDisplay = firstOwner.nama_pemilik || firstOwner.name || '-';
          // Backend mengirim 'id_pemilik' di response
          ownerId = firstOwner.id_pemilik || firstOwner.id_pasien || firstOwner.id || null;
          
          if (owners.length > 1) {
            ownerDisplay = `${ownerDisplay} (+${owners.length - 1} lainnya)`;
          }
        }
        
        console.log('Mapping jenis hewan:', {
          id: jenis.id,
          species: jenis.nama_jenis,
          ownerId,
          rawOwner: owners[0]
        });
        
        return {
          id: jenis.id,
          species: jenis.nama_jenis,
          ownerName: ownerDisplay,
          ownerId: ownerId,
        };
      });
    },
    staleTime: 5 * 60 * 1000,
  });

  // Filter data
  const filteredData = jenisHewanData.filter(item =>
    item.species?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- 2. HANDLE ACTIONS (SAT-SET MODE) ---

  const handleSaveSpecies = async (formData) => {
    try {
      console.log("Data dari Modal:", formData);
      
      // Validasi ownerId harus ada
      if (!formData.ownerId) {
        alert('Harap pilih pemilik!');
        return;
      }
      
      const payload = {
        nama_jenis: formData.species,
        id_pasien: Number(formData.ownerId),
      };
      
      console.log("Payload yang akan dikirim:", payload);
      
      await jenisHewanService.create(payload);
      queryClient.invalidateQueries({ queryKey: ['jenis-hewan-full'] });
      // ❌ JANGAN close modal di sini! Biarkan modal close sendiri setelah toast
      // setIsModalOpen(false); 
    } catch (err) {
      console.error('Error detail:', err);
      throw err; // Re-throw untuk ditangkap modal
    }
  };

  const handleUpdateSpecies = async (id, formData) => {
    try {
      // Validasi ownerId harus ada
      if (!formData.ownerId) {
        throw new Error('Owner ID tidak ditemukan. Data jenis hewan tidak lengkap.');
      }
      
      await jenisHewanService.update(id, {
        nama_jenis: formData.species,
        id_pasien: Number(formData.ownerId), // Backend memerlukan id_pasien
      });
      queryClient.invalidateQueries({ queryKey: ['jenis-hewan-full'] });
      // ❌ JANGAN close modal di sini! Biarkan modal close sendiri setelah toast
      // setIsEditModalOpen(false);
      // setSelectedJenis(null);
    } catch (err) {
      console.error('Error updating jenis hewan:', err);
      throw err; // Re-throw untuk ditangkap modal
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await jenisHewanService.remove(jenisToDelete.id);
      queryClient.invalidateQueries({ queryKey: ['jenis-hewan-full'] });
      setIsDeleteModalOpen(false);
      setJenisToDelete(null);
    } catch (err) {
      alert('Gagal menghapus!');
    }
  };

  const handleEdit = (item) => {
    setSelectedJenis(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item) => {
    setJenisToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const renderCell = (item, key) => {
    if (key === 'actions') {
      return (
        <div className="flex justify-center space-x-2">
          <Button icon={<PenIcon className="h-4 w-4" />} roundedClass="rounded-lg"
              color="bg-accent-yellow-300" 
              hoverColor="hover:bg-accent-yellow-500"
              focusColor="focus:bg-accent-yellow-400" onClick={() => handleEdit(item)} />
          <Button icon={<TrashIcon className="h-4 w-4" />} roundedClass="rounded-lg"
              color="bg-accent-red-300" 
              hoverColor="hover:bg-accent-red-500"
               onClick={() => handleDelete(item)} />
        </div>
      );
    }
    return item[key] || '-';
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Jenis Hewan" description="Kelola data jenis hewan" addButtonText="Tambah Jenis Hewan" onAddClick={() => setIsModalOpen(true)} />
      
      <div className="space-y-4">
        <SearchBar placeholderText="Cari jenis hewan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : (
          <Table columns={Species_COLUMNS} data={filteredData} renderCell={renderCell} />
        )}
      </div>

      <TambahJenisHewanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveSpecies} />
      <EditJenisHewanModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedJenis(null); }} onSave={handleUpdateSpecies} jenisHewan={selectedJenis} />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setJenisToDelete(null); }} onConfirm={handleConfirmDelete} itemName={jenisToDelete?.species || ''} itemType="jenis hewan" />
    </div>
  );
}