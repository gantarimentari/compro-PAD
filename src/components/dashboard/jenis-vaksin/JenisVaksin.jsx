'use client';
import jenisVaksinService from '@/lib/services/jenisVaksinService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { TrashIcon, PenIcon, WarningIcon } from '@/components/icons';
import Table from '@/components/shared/Table';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/shared/ManagementSearch';
import PageHeader from '@/components/shared/PageHeader';
import { TambahJenisVaksinModal, DeleteConfirmModal, EditJenisVaksinModal, PreviewJenisVaksinModal } from '@/components/dashboard';
import StatusToggleButton from '@/components/ui/StatusToggleButton';
// import Edit from 'apps/becompro/vendor/laravel/breeze/stubs/inertia-react/resources/js/Pages/Profile/Edit';
import { LoadingTable } from '../shared-modals/LoadingStatement';
const JENIS_VAKSIN_COLUMNS = [
  { key: 'type', header: 'Jenis Vaksin' },
  { key:'interval', header: 'Interval Booster' },
  { key: 'sideEffect', header: 'Efek Samping'},
  { key: 'status', header: 'Status' },
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



export default function JenisVaksin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [vaksinToDelete, setVaksinToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVaksin, setSelectedVaksin] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);


  const { data: jenisVaksinData = [], isLoading } = useQuery({
    queryKey: ['jenis-vaksin'],
    queryFn: async () => {
      const responseData = await jenisVaksinService.getAll();
      const rows = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.data)
          ? responseData.data
          : [];

      return rows.map((item) => {
        const itemId = item.id ?? item.id_vaksinasi ?? item.id_vaksin ?? item.vaksin_id ?? null;
        const rawStatus = String(item.status ?? '').toLowerCase();
        const isActive = rawStatus === 'active' || rawStatus === 'available' || rawStatus === '1' || rawStatus === 'true';

        return {
          id: itemId,
          type: item.nama_vaksin,
          description: item.deskripsi || '',
          interval: item.interval,
          sideEffect: item.efek_samping,
          created_at: item.created_at || item.createdAt || null,
          isActive,

          status: isActive ? 'Available' : 'Unavailable',
        };
      });
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (newVaccine) => jenisVaksinService.create(newVaccine),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jenis-vaksin'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, nextStatus }) => jenisVaksinService.update(id, { status: nextStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jenis-vaksin'] });
    },
    onError: (error) => {
      alert(`Gagal mengubah status: ${error?.response?.data?.message || error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => jenisVaksinService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jenis-vaksin'] });
    },
  });

  const handleSaveVaccine = async (formData) => {
    const vaccinePayload = {
      nama_vaksin: formData.nama_vaksin,
      interval: Number(formData.interval),
      deskripsi: formData.deskripsi,
      efek_samping: formData.efek_samping,
      status: formData.status ? 'active' : 'inactive',
    };

    await createMutation.mutateAsync(vaccinePayload);
  };

  const handleUpdateVaksin = async (id, formData) => {
    const payload = {
      nama_vaksin: formData.nama_vaksin,
      interval: Number(formData.interval),
      deskripsi: formData.deskripsi,
      efek_samping: formData.efek_samping,
      status: formData.status ? 'active' : 'inactive',
    };

    await updateMutation.mutateAsync({ id, payload });
  };

  const handleToggleStatus = (item) => {
    if (item?.id === null || item?.id === undefined || item?.id === '') {
      alert('ID vaksin tidak ditemukan, status tidak bisa diubah.');
      return;
    }

    toggleStatusMutation.mutate({
      id: item.id,
      nextStatus: item.isActive ? 'inactive' : 'active',
    });
  };

  const handlePreview = (item) => {
    setSelectedVaksin(item);
    setIsPreviewModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedVaksin(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item) => {
    setVaksinToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const filteredData = jenisVaksinData.filter((item) =>
    [item.type, item.description, item.interval, item.sideEffect, item.status]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderIntervalBadge = (intervalValue) => {
    const numericValue = Number(intervalValue || 0);
    const safeValue = Number.isNaN(numericValue) || numericValue <= 0 ? 0 : numericValue;
    const isGreen = safeValue >= 12;
    const label = `${safeValue} bulan`;
    const color = isGreen
      ? 'bg-[#F0FDF4] text-accent-green-450 border border-[#B9F8CF]'
      : 'bg-[#FFF7ED]  border-[#FFD6A8] border text-[#F54900]' ;

    return <span className={`px-3 py-1 text-body-2 rounded-full ${color}`}>{label}</span>;
  };

  const handleConfirmDelete = async () => {
    try {
      await jenisVaksinService.remove(vaksinToDelete.id);
      queryClient.invalidateQueries({ queryKey: ['jenis-vaksin'] });
      setIsDeleteModalOpen(false);
      setVaksinToDelete(null);
    } catch (err) {
      alert('Gagal menghapus!');
    }
  };
  const renderCell = (item, key) => {
    switch (key) { 
      case 'type':
        return (
          <div className="whitespace-normal max-w-xs">
            <p className=" text-accent-neutral-1000">{item.type}</p>
            <p className="text-body-2 text-accent-neutral-500 line-clamp-1">{item.description || '-'}</p>
          </div>
        );
      case 'interval':
        return renderIntervalBadge(item.interval);
      case 'sideEffect':
        return (
          <div >
            <p className="text-body-2 text-accent-neutral-800 line-clamp-1">
              {item.sideEffect || '-'}
            </p>
          </div>
        );
      case 'status':
        return <StatusTag status={item.status} />;
      case 'actions':
        return (
          <div className="flex justify-center space-x-2">
            <StatusToggleButton
              isActive={item.isActive}
              onClick={() => handleToggleStatus(item)}
              disabled={toggleStatusMutation.isPending}
              label={item.isActive ? `Ubah ${item.type} menjadi unavailable` : `Ubah ${item.type} menjadi available`}
            />
            <Button
              icon={<WarningIcon className="h-4 w-4" />}
              roundedClass="rounded-lg"
              color="bg-accent-blue-400"
              hoverColor="hover:bg-accent-blue-500"
              focusColor="focus:bg-accent-blue-300"
              onClick={() => handlePreview(item)}
              label={`Info ${item.type}`}
            />
            <Button
              icon={<PenIcon className="h-4 w-4" />}
              roundedClass="rounded-lg"
              color="bg-accent-yellow-300"
              hoverColor="hover:bg-accent-yellow-500"
              focusColor="focus:bg-accent-yellow-400"
              onClick={() => handleEdit(item)}
              label={`Edit ${item.type}`}
            />
            <Button
              icon={<TrashIcon className="h-4 w-4" />}
              roundedClass="rounded-lg"
              color="bg-accent-red-300"
              hoverColor="hover:bg-accent-red-400"
              onClick={() => handleDelete(item)}
              label={`Hapus ${item.type}`}
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
        title="Jenis Vaksin"
        description="Kelola daftar jenis vaksin dan interval booster"
        addButtonText="Tambah Jenis Vaksin"
        onAddClick={() => setIsModalOpen(true)}
      />

      <div className="space-y-4">
        <SearchBar
          placeholderText="Cari nama vaksin atau deskripsi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {isLoading ? (
          <LoadingTable/>
        ) : (
          <Table columns={JENIS_VAKSIN_COLUMNS} data={filteredData} renderCell={renderCell} />
        )}
      </div>

      <TambahJenisVaksinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveVaccine} />
      <EditJenisVaksinModal  isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedVaksin(null);
        }}
        vaksin={selectedVaksin}
        onSave={handleUpdateVaksin}
      />
      <PreviewJenisVaksinModal  isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setSelectedVaksin(null);
        }}
        jenisVaksin={selectedVaksin}
      />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} itemName={vaksinToDelete?.type} itemType="jenis vaksin" description={`Apakah Anda yakin ingin menghapus vaksin "${vaksinToDelete?.type}"? Vaksin yang sudah digunakan di Reminder Vaksinasi tidak akan terpengaruh, namun tidak bisa digunakan untuk jadwal baru. Tindakan ini tidak dapat dibatalkan.`}/>
    </div>
  );
}