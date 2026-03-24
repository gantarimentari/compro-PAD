'use client';
import reminderVaksinasiService from '@/lib/services/reminderVaksinasi';
import hewanService from '@/lib/services/hewanService';
import jenisVaksinService from '@/lib/services/jenisVaksinService';
import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PenIcon, TrashIcon } from '@/components/icons';
import Table from '@/components/shared/Table';
import SearchBar from '@/components/shared/ManagementSearch';
import PageHeader from '@/components/shared/PageHeader';
import { TambahReminderVaksinasiModal, DeleteConfirmModal  } from '@/components/dashboard';
import Button from '@/components/ui/Button';
import {
  NEXT_DATE_URGENCY_CLASS,
  REMINDER_QUERY_KEY,
  STATUS_BADGE_CLASS,
  STATUS_FILTER_OPTIONS,
  VACCINATION_COLUMNS,
} from './reminderVaksinasi.constants';
import {
  buildHewanMetaMap,
  buildVaksinMap,
  filterReminderRows,
  mapReminderRows,
} from './reminderVaksinasi.utils';

export default function ReminderVaksinasi() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState(null);

  const handleDelete = (item) => {
    setReminderToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (payload) => reminderVaksinasiService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDER_QUERY_KEY });
    },
  });

  const { data: vaksinasiData = [], isLoading } = useQuery({
    queryKey: REMINDER_QUERY_KEY,
    queryFn: async () => {
      const [rawReminder, rawHewan, rawJenisVaksin] = await Promise.all([
        reminderVaksinasiService.getAll(),
        hewanService.getAll(),
        jenisVaksinService.getAll(),
      ]);

      const hewanMetaMap = buildHewanMetaMap(rawHewan);
      const vaksinMap = buildVaksinMap(rawJenisVaksin);
      return mapReminderRows(rawReminder, hewanMetaMap, vaksinMap);
    },
    staleTime: 5 * 60 * 1000,
  });

  const filteredData = useMemo(() => {
    return filterReminderRows(vaksinasiData, searchQuery, statusFilter);
  }, [vaksinasiData, searchQuery, statusFilter]);

  const renderStatusTag = (status) => {
    return (
      <span className={`inline-flex px-4 py-2 rounded-lg text-body-2 ${STATUS_BADGE_CLASS[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  const renderCell = (item, key) => {
    switch (key) {
      case 'petName': {
        return (
          <div className="whitespace-normal max-w-xs">
            <p className="text-accent-neutral-1000">{item.petName}</p>
            <p className="text-body-5 text-accent-neutral-500">{item.species || '-'}</p>
          </div>
        );
      }
      case 'ownerName': {
        return (
          <div className="whitespace-normal max-w-xs">
            <p className="text-accent-neutral-1000">{item.ownerName}</p>
            <p className="text-body-5  text-accent-neutral-500">{item.ownerPhone || '-'}</p>
          </div>
        );
      }
      case 'vaccinationType': {
        return (
          <div className="whitespace-normal max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[#155DFC] bg-[#EFF6FF] border border-[#BEDBFF] px-3  text-body-2 rounded-full">{item.vaccinationType}</p>
              </div>
            
            <p className="text-body-5 text-accent-neutral-500">Interval: {item.vaccineInterval ?? '-'} bulan</p>
          </div>
        );
      }
      case 'latestVaccinationDate': {
        return (
          <div className="whitespace-normal max-w-xs">
            <p className="text-accent-neutral-1000">{item.latestVaccinationDate}</p>
            
            <p className="text-body-5    text-accent-neutral-500">#1 kali vaksin</p>
          </div>
        );
      }
      case 'nextVaccinationDate': {
        const selectedStyle = NEXT_DATE_URGENCY_CLASS[item.nextVaccinationUrgency] || NEXT_DATE_URGENCY_CLASS.normal;

        return (
          <div className="whitespace-normal max-w-xs">
            <p className={selectedStyle.date}>{item.nextVaccinationDate}</p>
            <p className={`text-body-5 ${selectedStyle.hint}`}>{item.nextVaccinationHint}</p>
          </div>
        );
      }
      case 'status': {
        return renderStatusTag(item.status);
      }
      case 'actions': {
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`px-5 py-2 rounded-lg text-white text-body-2 ${item.status === 'Selesai' ? 'bg-accent-green-450 hover:bg-accent-green-500' : 'bg-[#11A7A4] hover:bg-[#0D8C89]'}`}
            >
              {item.status === 'Selesai' ? 'Selesai' : 'Vaksinasi'}
            </button>
            <button type="button" className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">⟳</button>
            <button type="button" className="p-2 rounded-lg bg-accent-yellow-300 hover:bg-accent-yellow-400">
              <PenIcon className="w-4 h-4" />
            </button>
            <Button
              icon={<TrashIcon className="h-4 w-4" />}
              roundedClass="rounded-lg"
              color="bg-accent-red-300"
              hoverColor="hover:bg-accent-red-400"
              onClick={() => handleDelete(item)}
              label={`Hapus ${item.petName}`}/>
          </div>
        );
      }
      default:
        return item[key] || '-';
    }
  };

  const handleSaveReminder = async (formData) => {
    await createMutation.mutateAsync({
      id_hewan: formData.id_hewan,
      id_jenis_vaksin: formData.id_jenis_vaksin,
      tanggal_vaksin: formData.tanggal_vaksin,
    });
  };
  const handleConfirmDelete = async () => {
    if (!reminderToDelete?.reminderId) {
      alert('ID reminder tidak valid. Silakan refresh halaman lalu coba lagi.');
      return;
    }

    try {
      await reminderVaksinasiService.remove(reminderToDelete.reminderId);
      queryClient.invalidateQueries({ queryKey: REMINDER_QUERY_KEY });
      setIsDeleteModalOpen(false);
      setReminderToDelete(null);
    } catch (err) {
      alert(`Gagal menghapus! ${err?.response?.data?.message || err?.message || ''}`.trim());
    }
  };
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reminder Vaksinasi" 
        description="Kelola pengingat jadwal vaksinasi hewan" 
        addButtonText="Tambah Reminder" 
        onAddClick={() => setIsModalOpen(true)} 
      />
      
      <div className="space-y-4 pb-32">
        <div className="flex flex-col md:flex-row gap-3 justify-start">
          <div className="">
            <SearchBar 
              placeholderText="Cari hewan, vaksin, atau pemilik..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-body-2 text-accent-neutral-800 min-w-[180px] bg-accent-neutral-200 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-body-2"
          >
            {STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-3">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : (
          <Table columns={VACCINATION_COLUMNS} data={filteredData} renderCell={renderCell} />
        )}
      </div>

      <TambahReminderVaksinasiModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveReminder}/>
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} itemName={reminderToDelete?.petName} itemType="reminder vaksinasi" 
      description={"Apakah Anda yakin ingin menghapus reminder ini? Tindakan ini tidak dapat dibatalkan."}/>    
    </div>
  );
}