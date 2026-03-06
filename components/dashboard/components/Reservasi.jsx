'use client';
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import reservasiService from '@/lib/services/reservasiService';
import { TrashIcon, PenIcon, ChevronDownIcon } from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import { TambahReservasiModal, DeleteConfirmModal, EditReservasiModal } from '@ds/dashboard/modals';

// Status Dropdown Component with Portal
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
        setDropdownPosition({
          top: rect.bottom + 4,
          left: rect.left
        });
      }
    };

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
      updatePosition();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  const handleStatusSelect = (status) => {
    onStatusChange(itemId, status);
    setIsOpen(false);
  };
  
  const dropdownContent = isOpen && (
    <div 
      ref={dropdownRef}
      className="fixed z-[9999] w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`
      }}
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
              ${isSelected 
                ? 'bg-gray-100 font-medium' 
                : 'hover:bg-gray-50'
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="relative inline-block" ref={buttonRef}>
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
      </div>
      {/* Portal to document.body to escape table overflow */}
      {typeof document !== 'undefined' && dropdownContent && createPortal(dropdownContent, document.body)}
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
  const [reservasiData, setReservasiData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reservasiToDelete, setReservasiToDelete] = useState(null);
  const [selectedReservasi, setSelectedReservasi] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  //  Fetch reservasi dari database
  const fetchReservasi = async () => {
    try {
      setIsLoading(true);
      const data = await reservasiService.getAll();
      setReservasiData(data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      alert('Gagal memuat data reservasi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservasi();
  }, []);

  //  Filter data
  const filteredData = reservasiData.filter(item =>
    (item.petName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (item.ownerName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (item.species?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (item.date?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (item.keluhan?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (item.status?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  //  Tambah Reservasi
  const handleSaveReservasi = async (formData) => {
    try {
      await reservasiService.create(payload);
      await fetchReservasi();
      setIsModalOpen(false);
      alert('Reservasi berhasil ditambahkan!');
    } catch (err) {
      console.error('Error saving reservation:', err);
      alert(`Gagal menyimpan: ${err.response?.data?.message || err.message}`);
    }
  };

  //  Update Status
  const handleStatusChange = async (reservasiId, newStatus) => {
    try {
      await reservasiService.updateStatus(reservasiId, newStatus);

      // Update local state
      setReservasiData(reservasiData.map(item =>
        item.id === reservasiId ? { ...item, status: newStatus } : item
      ));

      console.log(`Status updated: ${reservasiId} → ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Gagal mengupdate status');
    }
  };

  //  Edit Reservasi
  const handleEdit = (item) => {
    setSelectedReservasi(item);
    setIsEditModalOpen(true);
  };

  const handleEditReservasi = async (id, formData) => {
    try {
      await reservasiService.update(id, payload);
      await fetchReservasi();
      setIsEditModalOpen(false);
      setSelectedReservasi(null);
      alert('Reservasi berhasil diupdate!');
    } catch (err) {
      console.error('Error updating reservation:', err);
      alert(`Gagal mengupdate: ${err.response?.data?.message || err.message}`);
    }
  };

  //  Delete Reservasi
  const handleDelete = (item) => {
    setReservasiToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (reservasiToDelete) {
      try {
        await reservasiService.remove(reservasiToDelete.id);        await fetchReservasi();
        setIsDeleteModalOpen(false);
        setReservasiToDelete(null);
        alert('Reservasi berhasil dihapus!');
      } catch (err) {
        console.error('Error deleting reservation:', err);
        alert('Gagal menghapus reservasi');
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

      {/* Add pb-32 from 6297f7a for better spacing */}
      <div className="space-y-4 pb-32">
        <SearchBar
          placeholderText="Cari nama hewan, jenis, atau pemilik..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <Table
            columns={RESERVASI_COLUMNS}
            data={filteredData}
            renderCell={renderCell}
          />
        )}
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