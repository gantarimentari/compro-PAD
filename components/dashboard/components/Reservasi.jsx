'use client';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import reservasiService from '@/lib/services/reservasiService';
import { TrashIcon, PenIcon, ChevronDownIcon } from '@ds/icons';
import Button from '@ds/ui/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import { TambahReservasiModal, DeleteConfirmModal, EditReservasiModal } from '@ds/dashboard/modals';

// --- KOMPONEN DROPDOWN STATUS ---
const StatusDropdown = ({ currentStatus, onStatusChange, itemId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'belum', label: 'Belum' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'batal', label: 'Batal' },
  ];

  const currentStatusOption = statusOptions.find(option => option.value === currentStatus) || statusOptions[0];

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current && isOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({ top: rect.bottom + 4, left: rect.left });
      }
    };
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  return (
    <>
      <div className="relative inline-block" ref={buttonRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 hover:shadow-md"
        >
          <span>{currentStatusOption.label}</span>
          <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} color="currentColor" />
        </button>
      </div>
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed z-[9999] w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
          style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
        >
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => { onStatusChange(itemId, option.value); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${option.value === currentStatus ? 'bg-gray-100 font-medium' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

const RESERVASI_COLUMNS = [
  { key: 'ownerName', header: 'Nama Pasien' },
  { key: 'petName', header: 'Hewan' },
  { key: 'species', header: 'Jenis Hewan' },
  { key: 'date', header: 'Tanggal Reservasi' },
  { key: 'keluhan', header: 'Keluhan' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

export default function Reservasi() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReservasi, setSelectedReservasi] = useState(null);
  const [reservasiToDelete, setReservasiToDelete] = useState(null);

  // --- 1. FETCH DATA (THE REACT QUERY WAY) ---
  const { data: reservasiData = [], isLoading } = useQuery({
    queryKey: ['reservasi'],
    queryFn: () => reservasiService.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  // --- 2. MUTATIONS (FOR CATCHING UPDATES) ---
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => reservasiService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservasi'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => reservasiService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reservasi'] }),
  });

  // --- 3. FILTER LOGIC ---
  const filteredData = useMemo(() => {
    return reservasiData.filter(item =>
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [reservasiData, searchQuery]);

  // --- 4. HANDLERS ---
  const handleSaveReservasi = async (formData) => {
    try {
      await reservasiService.create({
        id_pasien: formData.ownerId,
        id_hewan: formData.petId,
        tanggal_reservasi: formData.date,
        keluhan: formData.keluhan,
      });
      queryClient.invalidateQueries({ queryKey: ['reservasi'] });
      // ❌ Commented: setIsModalOpen(false); - Let modal close after showing toast
      // Modal will close itself after displaying SuccessToast for 1500ms
    } catch (err) {
      console.error('Error saving reservasi:', err);
      throw err; // Re-throw for modal error handling
    }
  };

  const handleEditReservasi = async (id, formData) => {
    try {
      await reservasiService.update(id, {
        id_hewan: formData.petId,
        tanggal_reservasi: formData.date,
        keluhan: formData.keluhan,
      });
      queryClient.invalidateQueries({ queryKey: ['reservasi'] });
      // ❌ Commented: setIsEditModalOpen(false); - Let modal close after showing toast
      // Modal will close itself after displaying SuccessToast for 1500ms
    } catch (err) {
      console.error('Error updating reservasi:', err);
      throw err; // Re-throw for modal error handling
    }
  };

  const confirmDelete = async () => {
    deleteMutation.mutate(reservasiToDelete.id, {
      onSuccess: () => { setIsDeleteModalOpen(false); setReservasiToDelete(null); }
    });
  };

  const renderCell = (item, key) => {
    switch (key) {
      case 'status':
        return (
          <StatusDropdown
            currentStatus={item.status || 'pending'}
            onStatusChange={(id, status) => updateStatusMutation.mutate({ id, status })}
            itemId={item.id}
          />
        );
      case 'actions':
        return (
          <div className="flex justify-center space-x-2">
            <Button icon={<PenIcon className="h-4 w-4" />} roundedClass="rounded-lg"
              color="bg-accent-yellow-300" 
              hoverColor="hover:bg-accent-yellow-500"
              focusColor="focus:bg-accent-yellow-400" onClick={() => { setSelectedReservasi(item); setIsEditModalOpen(true); }} />
            <Button icon={<TrashIcon className="h-4 w-4" />} roundedClass="rounded-lg"
              color="bg-accent-red-300" 
              hoverColor="hover:bg-accent-red-400" onClick={() => { setReservasiToDelete(item); setIsDeleteModalOpen(true); }} />
          </div>
        );
      default:
        return item[key] || '-';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reservasi" description="Kelola data reservasi" addButtonText="Tambah Reservasi" onAddClick={() => setIsModalOpen(true)} />
      
      <div className="space-y-4 pb-32">
        <SearchBar placeholderText="Cari data reservasi..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : (
          <Table columns={RESERVASI_COLUMNS} data={filteredData} renderCell={renderCell} />
        )}
      </div>

      <TambahReservasiModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveReservasi} />
      <EditReservasiModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} reservasi={selectedReservasi} onSave={handleEditReservasi} />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} itemName={reservasiToDelete?.petName} itemType="reservasi" />
    </div>
  );
}