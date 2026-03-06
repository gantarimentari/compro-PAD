'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useMemo } from 'react';
import api from '@lib/api';
import { TrashIcon, PenIcon } from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import { TambahHewanModal, EditHewanModal, DeleteConfirmModal } from '@ds/dashboard/modals';

const HEWAN_COLUMNS = [
  { key: 'petName', header: 'Nama Hewan' },
  { key: 'species', header: 'Jenis Hewan' },
  { key: 'ownerName', header: 'Pemilik' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

export default function ManagementHewan() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHewan, setSelectedHewan] = useState(null);
  const [hewanToDelete, setHewanToDelete] = useState(null);

  // --- 1. FETCH SEMUA DATA (SAT-SET MODE) ---

  // Data Hewan Utama
  const { data: rawHewanData = [], isLoading } = useQuery({
    queryKey: ['hewan-raw'],
    queryFn: async () => {
      const res = await api.get('/api/hewan');
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Data Owner (Pasien)
  const { data: ownerOptions = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const res = await api.get('/api/patients');
      return res.data.map(p => ({ 
        id: p.id, 
        name: p.username || p.name 
      }));
    },
    staleTime: 60 * 60 * 1000,
  });

  // Data Jenis Hewan
  const { data: jenisHewanOptions = [] } = useQuery({
    queryKey: ['jenis-hewan'],
    queryFn: async () => {
      const res = await api.get('/api/jenis-hewan');
      return res.data.map(j => ({ 
        id_jenisHewan: j.id_jenisHewan || j.id, 
        nama_jenis: j.nama_jenis 
      }));
    },
    staleTime: 60 * 60 * 1000,
  });

  // --- 2. LOGIKA FLATTEN DATA ---
  const flattenedData = useMemo(() => {
    const flattened = [];
    rawHewanData.forEach(owner => {
      owner.pets?.forEach(pet => {
        flattened.push({
          id: pet.id,
          petName: pet.petName || `Hewan ${pet.id}`,
          species: pet.speciesName,
          ownerName: owner.name,
          ownerId: owner.id,
          speciesId: pet.speciesId,
        });
      });
    });
    return flattened;
  }, [rawHewanData]);

  const filteredData = useMemo(() => {
    return flattenedData.filter(item =>
      item.ownerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.species?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.petName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [flattenedData, searchQuery]);

  // --- 3. HANDLE ACTIONS (INVALIDATE) ---

  const handleSaveHewan = async (formData) => {
    try {
      await api.post('/api/hewan', {
        id_pasien: formData.ownerId,
        id_jenisHewan: formData.speciesId,
        nama_hewan: formData.petName,
      });
      queryClient.invalidateQueries({ queryKey: ['hewan-raw'] });
      setIsModalOpen(false);
      alert('Berhasil simpan!');
    } catch (err) { alert('Gagal simpan!'); }
  };

  const handleEditHewan = async (id, formData) => {
    try {
      await api.put(`/api/hewan/${id}`, {
        id_pasien: formData.ownerId,
        id_jenisHewan: formData.speciesId,
        nama_hewan: formData.petName,
      });
      queryClient.invalidateQueries({ queryKey: ['hewan-raw'] });
      setIsEditModalOpen(false);
      setSelectedHewan(null);
      alert('Hewan berhasil diupdate!');
    } catch (err) { alert('Gagal update!'); }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/hewan/${hewanToDelete.id}`);
      queryClient.invalidateQueries({ queryKey: ['hewan-raw'] });
      setIsDeleteModalOpen(false);
      setHewanToDelete(null);
    } catch (err) { alert('Gagal hapus!'); }
  };

  const handleEdit = (item) => {
    setSelectedHewan(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    const hewan = flattenedData.find(item => item.id === id);
    setHewanToDelete(hewan);
    setIsDeleteModalOpen(true);
  };

  const renderCell = (item, key) => {
    if (key === 'actions') {
      return (
        <div className="flex justify-center space-x-2">
          <Button icon={<PenIcon className="h-4 w-4" />} color="bg-accent-yellow-300" onClick={() => handleEdit(item)} />
          <Button icon={<TrashIcon className="h-4 w-4" />} color="bg-accent-red-300" onClick={() => handleDelete(item.id)} />
        </div>
      );
    }
    return item[key] || '-';
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Manajemen Hewan" description="Kelola data hewan" addButtonText="Tambah Hewan" onAddClick={() => setIsModalOpen(true)} />

      <div className="space-y-4">
        <SearchBar placeholderText="Cari nama hewan, jenis, atau pemilik..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        
        {/* Sekarang pakai isLoading yang sesuai dengan useQuery */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : (
          <Table columns={HEWAN_COLUMNS} data={filteredData} renderCell={renderCell} />
        )}
      </div>

      <TambahHewanModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveHewan} 
        ownerOptions={ownerOptions} 
        jenisHewanOptions={jenisHewanOptions} 
      />

      <EditHewanModal 
        isOpen={isEditModalOpen} 
        onClose={() => { setIsEditModalOpen(false); setSelectedHewan(null); }} 
        hewan={selectedHewan} 
        onSave={handleEditHewan} 
        ownerOptions={ownerOptions} 
        jenisHewanOptions={jenisHewanOptions} 
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => { setIsDeleteModalOpen(false); setHewanToDelete(null); }} 
        onConfirm={confirmDelete} 
        itemName={hewanToDelete?.petName} 
        itemType="hewan" 
      />
    </div>
  );
}