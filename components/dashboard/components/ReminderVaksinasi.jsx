'use client';

import React, { useState, useMemo } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { SearchIcon, CloseIcon, TrashIcon, AddIcon, PenIcon } from '@ds/icons';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import { TambahReservasiModal, DeleteConfirmModal, EditReservasiModal } from '@ds/dashboard/modals';

const Vaccination_COLUMNS = [
  { key: 'name', header: 'Nama Pasien' },
  { key: 'petName', header: 'Hewan' },
  { key: 'vaccinationDate', header: 'Tanggal Vaksin' },
  { key: 'vaccinationType', header: 'Jenis Vaksin' },
  { key: 'status', header: 'Status Kirim' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

export default function ReminderVaksinasi() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReservasi, setSelectedReservasi] = useState(null);
  const [reservasiToDelete, setReservasiToDelete] = useState(null);

  // --- COMMENTED UNTUK UI CHECK ---
  // const { data: vaksinasiData = [], isLoading } = useQuery({
  //   queryKey: ['vaksinasi'],
  //   queryFn: () => vaccinationService.getAll(),
  //   staleTime: 5 * 60 * 1000,
  // });

  // Dummy data agar tabel tidak kosong saat cek UI
  const vaksinasiData = []; 
  const isLoading = false;

  const filteredData = useMemo(() => {
    return vaksinasiData.filter(item =>
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [vaksinasiData, searchQuery]);

  // Placeholder renderCell agar Table tidak error
  const renderCell = (item, key) => {
    if (key === 'actions') {
      return (
        <div className="flex justify-center space-x-2">
          <button className="p-2 bg-accent-yellow-300 rounded-lg"><PenIcon className="w-4 h-4" /></button>
          <button className="p-2 bg-accent-red-300 rounded-lg"><TrashIcon className="w-4 h-4" /></button>
        </div>
      );
    }
    return item[key] || '-';
  };

  // Placeholder handlers
  const handleSaveReservasi = () => {};
  const handleEditReservasi = () => {};
  const confirmDelete = () => {};

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reminder Vaksinasi" 
        description="Kelola pengingat jadwal vaksinasi hewan" 
        addButtonText="Tambah Reminder" 
        onAddClick={() => setIsModalOpen(true)} 
      />
      
      <div className="space-y-4 pb-32">
        <SearchBar 
          placeholderText="Cari hewan, vaksin, atau pemilik." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-3">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : (
          <Table columns={Vaccination_COLUMNS} data={filteredData} renderCell={renderCell} />
        )}
      </div>

      <TambahReservasiModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveReservasi} />
      <EditReservasiModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} reservasi={selectedReservasi} onSave={handleEditReservasi} />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} itemName={reservasiToDelete?.petName} itemType="reservasi" />
    </div>
  );
}