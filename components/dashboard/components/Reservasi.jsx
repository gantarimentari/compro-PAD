'use client';
import React, { useState, useRef, useEffect } from 'react';
import api from '@lib/api';
import { TrashIcon, PenIcon, ChevronDownIcon } from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import { TambahReservasiModal, DeleteConfirmModal, EditReservasiModal } from '@ds/dashboard/modals';

// Status Dropdown Component
const StatusDropdown = ({ currentStatus, onStatusChange, itemId }) => {
  const [isOpen, setIsOpen] = useState(false);
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
    const handleClickOutside = (event) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleStatusSelect = (status) => {
    onStatusChange(itemId, status);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={buttonRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 hover:shadow-md whitespace-nowrap bg-gray-100 text-gray-800"
      >
        <span>{currentStatusOption.label}</span>
        <ChevronDownIcon 
          className={`w-4 h-4 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          color="currentColor"
        />
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 z-[9999] w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 flex flex-col"
        >
          {statusOptions.map((option) => {
            const isSelected = option.value === currentStatus;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleStatusSelect(option.value)}
                className={`
                  w-full text-left px-3 py-2 text-sm transition-colors text-gray-800
                  ${isSelected ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}
                `}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
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
  const [reservasiData, setReservasiData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reservasiToDelete, setReservasiToDelete] = useState(null);
  const [selectedReservasi, setSelectedReservasi] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ✅ Fetch reservasi dari database
  const fetchReservasi = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get('/api/reservations');

      console.log('📦 Reservasi Data:', res.data);
      setReservasiData(res.data);
    } catch (err) {
      console.error('❌ Error fetching reservations:', err);
      alert('Gagal memuat data reservasi');
    }
  };

  useEffect(() => {
    fetchReservasi();
  }, []);

  // ✅ Filter data (tidak perlu flatten karena data sudah flat dari API)
  const filteredData = reservasiData.filter(item =>
    (item.petName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (item.ownerName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (item.species?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (item.date?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (item.keluhan?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (item.status?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // ✅ Tambah Reservasi
  const handleSaveReservasi = async (formData) => {
    try {
      await api.get('/sanctum/csrf-cookie');

      const payload = {
        id_pasien: formData.ownerId,
        id_hewan: formData.petId,
        tanggal_reservasi: formData.date, // ✅ Fix: Nama field yang benar
        keluhan: formData.keluhan,
        status: 'pending',
      };

      console.log('📤 Sending reservation:', payload); // ✅ Fix: console.log()

      await api.post('/api/reservations', payload);
      await fetchReservasi();
      setIsModalOpen(false);
      alert('✅ Reservasi berhasil ditambahkan!');
    } catch (err) {
      console.error('❌ Error saving reservation:', err);
      alert(`❌ Gagal menyimpan: ${err.response?.data?.message || err.message}`);
    }
  };

  // ✅ Update Status
  const handleStatusChange = async (reservasiId, newStatus) => {
    try {
      await api.get('/sanctum/csrf-cookie');

      await api.patch(`/api/reservations/${reservasiId}/status`, {
        status: newStatus,
      });

      // Update local state
      setReservasiData(reservasiData.map(item =>
        item.id === reservasiId ? { ...item, status: newStatus } : item
      ));

      console.log(`✅ Status updated: ${reservasiId} → ${newStatus}`);
    } catch (err) {
      console.error('❌ Error updating status:', err);
      alert('❌ Gagal mengupdate status');
    }
  };

  // ✅ Edit Reservasi
  const handleEdit = (item) => {
    setSelectedReservasi(item);
    setIsEditModalOpen(true);
  };

  const handleEditReservasi = async (id, formData) => {
    try {
      await api.get('/sanctum/csrf-cookie');

      const payload = {
        id_hewan: formData.petId,
        tanggal_reservasi: formData.date,
        keluhan: formData.keluhan,
      };

      await api.put(`/api/reservations/${id}`, payload);
      await fetchReservasi();
      setIsEditModalOpen(false);
      setSelectedReservasi(null);
      alert('✅ Reservasi berhasil diupdate!');
    } catch (err) {
      console.error('❌ Error updating reservation:', err);
      alert(`❌ Gagal mengupdate: ${err.response?.data?.message || err.message}`);
    }
  };

  // ✅ Delete Reservasi
  const handleDelete = (item) => {
    setReservasiToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (reservasiToDelete) {
      try {
        await api.get('/sanctum/csrf-cookie');
        await api.delete(`/api/reservations/${reservasiToDelete.id}`);
        await fetchReservasi();
        setIsDeleteModalOpen(false);
        setReservasiToDelete(null);
        alert('✅ Reservasi berhasil dihapus!');
      } catch (err) {
        console.error('❌ Error deleting reservation:', err);
        alert('❌ Gagal menghapus reservasi');
      }
    }
  };

  const renderCell = (item, key) => {
    switch (key) {
      case 'status':
        return (
          <StatusDropdown
            currentStatus={item.status || 'pending'}
            onStatusChange={handleStatusChange}
            itemId={item.id}
          />
        );
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
              onClick={() => handleDelete(item)}
              label={`Hapus ${item.petName}`}
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
        title="Reservasi"
        description="Kelola data reservasi"
        addButtonText="Tambah Reservasi"
        onAddClick={() => setIsModalOpen(true)}
      />

      <div className="space-y-4">
        <SearchBar
          placeholderText="Cari nama hewan, jenis, atau pemilik..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Table
          columns={RESERVASI_COLUMNS}
          data={filteredData}
          renderCell={renderCell}
        />
      </div>

      <TambahReservasiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReservasi}
      />

      <EditReservasiModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedReservasi(null);
        }}
        reservasi={selectedReservasi}
        onSave={handleEditReservasi}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setReservasiToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={reservasiToDelete?.petName}
        itemType="reservasi"
      />
    </div>
  );
}