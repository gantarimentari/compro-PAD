'use client';

import React, { useState, useEffect } from 'react';
import api from '@lib/api';
import { TrashIcon, PenIcon, WarningIcon } from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import { DeleteConfirmModal, TambahPromoModal, EditPromoModal, PreviewPromoModal } from '@ds/dashboard/modals';

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
  const [promoData, setPromoData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [promoToDelete, setPromoToDelete] = useState(null);

  //  Fetch promos dari database
  const fetchPromos = async () => {
    try {
      setIsLoading(true);
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get('/api/promos');

      console.log('Promos Data:', res.data);
      setPromoData(res.data);
    } catch (err) {
      console.error('Error fetching promos:', err);
      alert('Gagal memuat data promo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const filteredData = promoData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //  Tambah Promo
  const handleSavePromo = async (formData) => {
    try {
      await api.get('/sanctum/csrf-cookie');

      const payload = {
        title: formData.title,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: formData.status.toLowerCase(),
      };

      console.log('Sending promo:', payload);

      await api.post('/api/promos', payload);
      await fetchPromos();
      setIsModalOpen(false);
      alert(' Promo berhasil ditambahkan!');
    } catch (err) {
      console.error('Error saving promo:', err);
      alert(`Gagal menyimpan: ${err.response?.data?.message || err.message}`);
    }
  };

  //  Edit Promo
  const handleEdit = (item) => {
    setSelectedPromo(item);
    setIsEditModalOpen(true);
  };

  const handleEditPromo = async (id, formData) => {
    try {
      await api.get('/sanctum/csrf-cookie');

      const payload = {
        title: formData.title,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: formData.status.toLowerCase(),
      };

      await api.put(`/api/promos/${id}`, payload);
      await fetchPromos();
      setIsEditModalOpen(false);
      setSelectedPromo(null);
      alert(' Promo berhasil diupdate!');
    } catch (err) {
      console.error('Error updating promo:', err);
      alert(`Gagal mengupdate: ${err.response?.data?.message || err.message}`);
    }
  };

  //  Delete Promo
  const handleDelete = (promo) => {
    setPromoToDelete(promo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (promoToDelete) {
      try {
        await api.get('/sanctum/csrf-cookie');
        await api.delete(`/api/promos/${promoToDelete.id}`);
        await fetchPromos();
        setIsDeleteModalOpen(false);
        setPromoToDelete(null);
        alert(' Promo berhasil dihapus!');
      } catch (err) {
        console.error('Error deleting promo:', err);
        alert('Gagal menghapus promo');
      }
    }
  };

  //  Preview Promo
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
            {[1,2,3,4,5].map(i => (
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
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPromo(null);
        }}
        promo={selectedPromo}
        onSave={handleEditPromo}
      />

      <PreviewPromoModal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setSelectedPromo(null);
        }}
        promo={selectedPromo}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPromoToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={promoToDelete?.title}
        itemType="promo"
      />
    </div>
  );
}

