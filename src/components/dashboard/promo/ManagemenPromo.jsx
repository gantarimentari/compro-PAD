'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import promoService from '@/lib/services/promoService';
import { TrashIcon, PenIcon, WarningIcon } from '@/components/icons';
import Button from '@/components/ui/Button';
import Table from '@/components/shared/Table';
import SearchBar from '@/components/shared/ManagementSearch';
import PageHeader from '@/components/shared/PageHeader';
import { DeleteConfirmModal, TambahPromoModal, EditPromoModal, PreviewPromoModal } from '@/components/dashboard';

const PROMO_COLUMNS = [
  { key: 'title', header: 'Judul Promo' },
  { key: 'startDateDisplay', header: 'Tanggal Mulai' },
  { key: 'endDateDisplay', header: 'Tanggal Selesai' },
  { key: 'status', header: 'Status Promo' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

const StatusTag = ({ status }) => {
  const color = status === 'Available'
    ? 'bg-accent-green-50 text-accent-green-450'
    : 'bg-accent-red-50 text-accent-red-450';
  return (
    <span className={`px-4 py-2 text-body-2 rounded-lg w-24 ${color}`}>
      {status}
    </span>
  );
};

export default function ManagemenPromo() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [promoToDelete, setPromoToDelete] = useState(null);

  const { data: promoData = [], isLoading } = useQuery({
    queryKey: ['promos'],
    queryFn: () => promoService.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const filteredData = promoData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSavePromo = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: formData.status.toLowerCase(),
      };
      await promoService.create(payload);
      queryClient.invalidateQueries({ queryKey: ['promos'] });
      // ❌ Commented: setIsModalOpen(false); - Let modal close after showing toast
      // Modal will close itself after displaying SuccessToast for 1500ms
    } catch (err) {
      console.error('Error saving promo:', err);
      throw err; // Re-throw for modal error handling
    }
  };

  const handleEditPromo = async (id, formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: formData.status.toLowerCase(),
      };
      await promoService.update(id, payload);
      queryClient.invalidateQueries({ queryKey: ['promos'] });
      // ❌ Commented: setIsEditModalOpen(false); setSelectedPromo(null); - Let modal close after showing toast
      // Modal will close itself after displaying SuccessToast for 1500ms
    } catch (err) {
      console.error('Error updating promo:', err);
      throw err; // Re-throw for modal error handling
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await promoService.remove(promoToDelete.id);
      queryClient.invalidateQueries({ queryKey: ['promos'] });
      setIsDeleteModalOpen(false);
      setPromoToDelete(null);
      alert('Promo berhasil dihapus!');
    } catch (err) {
      console.error('Error deleting promo:', err);
      alert('Gagal menghapus promo');
    }
  };

  const handleEdit = (item) => {
    setSelectedPromo(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (promo) => {
    setPromoToDelete(promo);
    setIsDeleteModalOpen(true);
  };

  const handlePreview = (item) => {
    setSelectedPromo(item);
    setIsPreviewModalOpen(true);
  };

  const renderCell = (item, key) => {
    switch (key) {
      case 'status':
        return <StatusTag status={item.status} />;
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
              label={`Edit ${item.title}`}
            />
            <Button
              icon={<TrashIcon className="h-4 w-4" />}
              roundedClass="rounded-lg"
              color="bg-accent-red-300"
              hoverColor="hover:bg-accent-red-400"
              onClick={() => handleDelete(item)}
              label={`Hapus ${item.title}`}
            />
            <Button
              icon={<WarningIcon className="h-4 w-4" />}
              roundedClass="rounded-lg"
              color="bg-accent-blue-400"
              hoverColor="hover:bg-accent-blue-500"
              focusColor="focus:bg-accent-blue-300"
              onClick={() => handlePreview(item)}
              label={`Preview ${item.title}`}
            />
          </div>
        );
      default:
        return item[key];
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Managemen Promo"
        description="Kelola promo yang Anda tawarkan"
        addButtonText="Tambah Promo"
        onAddClick={() => setIsModalOpen(true)}
      />
      <div className="space-y-4">
        <SearchBar
          placeholderText="Cari promo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <Table
            columns={PROMO_COLUMNS}
            data={filteredData}
            renderCell={renderCell}
          />
        )}
      </div>

      <TambahPromoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePromo}
      />
      <EditPromoModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedPromo(null); }}
        promo={selectedPromo}
        onSave={handleEditPromo}
      />
      <PreviewPromoModal
        isOpen={isPreviewModalOpen}
        onClose={() => { setIsPreviewModalOpen(false); setSelectedPromo(null); }}
        promo={selectedPromo}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setPromoToDelete(null); }}
        onConfirm={handleConfirmDelete}
        itemName={promoToDelete?.title}
        itemType="promo"
      />
    </div>
  );
}
