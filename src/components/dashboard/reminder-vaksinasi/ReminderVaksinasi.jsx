'use client';
import React, { useMemo, useState } from 'react';
import Table from '@/components/shared/Table';
import SearchBar from '@/components/shared/ManagementSearch';
import PageHeader from '@/components/shared/PageHeader';
import { TambahReminderVaksinasiModal, DeleteConfirmModal, ActionreminderVaksinasiModal  } from '@/components/dashboard';
import {STATUS_FILTER_OPTIONS,VACCINATION_COLUMNS,} from './reminderVaksinasi.constants';
import {filterReminderRows,} from './reminderVaksinasi.utils';
import useReminderVaksinasiData from './useReminderVaksinasiData';
import { createReminderCellRenderer } from './_components/reminderVaksinasi.cells';

export default function ReminderVaksinasi() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState(null);
  const [isReminderActionModalOpen, setIsReminderActionModalOpen] = useState(false);
  const [reminderToAction, setReminderToAction] = useState(null);
  const {
    vaksinasiData,
    isLoading,
    createReminder,
    deleteReminder,
    completeVaccination,
  } = useReminderVaksinasiData();

  const handleDelete = React.useCallback((item) => {
    setReminderToDelete(item);
    setIsDeleteModalOpen(true);
  }, []);

  const handleOpenAction = React.useCallback((item) => {
    setReminderToAction(item);
    setIsReminderActionModalOpen(true);
  }, []);

  const filteredData = useMemo(() => {
    return filterReminderRows(vaksinasiData, searchQuery, statusFilter);
  }, [vaksinasiData, searchQuery, statusFilter]);

  const renderCell = useMemo(
    () => createReminderCellRenderer({
       onDelete: handleDelete,
       onOpenAction: handleOpenAction
    }),
    [handleDelete, handleOpenAction]
  );

  const handleSaveReminder = async (formData) => {
    await createReminder(formData);
  };

  const handleConfirmDelete = async () => {
    if (!reminderToDelete?.reminderId) {
      alert('ID reminder tidak valid. Silakan refresh halaman lalu coba lagi.');
      return;
    }

    try {
      await deleteReminder(reminderToDelete.reminderId);
      setIsDeleteModalOpen(false);
      setReminderToDelete(null);
    } catch (err) {
      alert(`Gagal menghapus! ${err?.response?.data?.message || err?.message || ''}`.trim());
    }
  };

  const handleConfirmReminderAction = async (vaccinationData) => {
    if (!reminderToAction?.reminderId) {
      alert('ID reminder tidak valid. Silakan refresh halaman lalu coba lagi.');
      return;
    }

    try {
      await completeVaccination(reminderToAction.reminderId, vaccinationData);
      setIsReminderActionModalOpen(false);
      setReminderToAction(null);
    } catch (err) {
      alert(`Gagal menyimpan vaksinasi! ${err?.response?.data?.message || err?.message || ''}`.trim());
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
      <ActionreminderVaksinasiModal isOpen={isReminderActionModalOpen} onClose={() => setIsReminderActionModalOpen(false)}
        onSave={handleConfirmReminderAction} reminder={reminderToAction}
      />
    </div>
  );
}