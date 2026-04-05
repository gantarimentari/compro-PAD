'use client';
import React, { useMemo, useState } from 'react';
import Table from '@/components/shared/Table';
import SearchBar from '@/components/shared/ManagementSearch';
// import PageHeader from '@/components/shared/PageHeader';
import PageHeaderVaksinasi from './_components/PageHeaderVaksinasi';
import { TambahReminderVaksinasiModal, DeleteConfirmModal, ActionReminderVaksinasiModal } from '@/components/dashboard';
import {STATUS_FILTER_OPTIONS,VACCINATION_COLUMNS,} from './reminderVaksinasi.constants';
import { collapseReminderSeries, filterReminderRows, } from './reminderVaksinasi.utils';
import useReminderVaksinasiData from './useReminderVaksinasiData';
import { createReminderCellRenderer } from './_components/reminderVaksinasi.cells';
import VaccinationHistoryModal from './modals/VaccinationHistoryModal';
import RescheduleModal from './modals/Reschedule';
import EditReminderModal from './modals/EditReminderModal';
import SendReminderModal from './modals/SendReminderModal';

export default function ReminderVaksinasi() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState(null);
  const [isReminderActionModalOpen, setIsReminderActionModalOpen] = useState(false);
  const [reminderToAction, setReminderToAction] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [reminderToHistory, setReminderToHistory] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [reminderToReschedule, setReminderToReschedule] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [reminderToSend, setReminderToSend] = useState(null);
  const [reminderToEdit, setReminderToEdit] = useState(null);
  const {
    vaksinasiData,
    isLoading,
    createReminder,updateReminder,
    sendManualReminder,
    deleteReminder,
    completeVaccination,
    isUpdating,
    isSendingReminder,
    isSendingScheduledReminder,
  } = useReminderVaksinasiData();

  const handleDelete = React.useCallback((item) => {
    setReminderToDelete(item);
    setIsDeleteModalOpen(true);
  }, []);

  const handleOpenAction = React.useCallback((item) => {
    setReminderToAction(item);
    setIsReminderActionModalOpen(true);
  }, []);

  const handleOpenHistory = React.useCallback((item) => {
    setReminderToHistory(item);
    setIsHistoryModalOpen(true);
  }, []);

  const handleOpenEdit = React.useCallback((item) => {
    setReminderToEdit(item);
    setIsEditModalOpen(true);
  }, []);

  const handleOpenSchedule = React.useCallback((item) => {
    setReminderToReschedule(item);
    setIsRescheduleModalOpen(true);
  }, []);

  const handleOpenSend = React.useCallback((item) => {
    if (!item?.reminderId) {
      alert('ID reminder tidak valid. Silakan refresh halaman lalu coba lagi.');
      return;
    }

    if (item?.reminderSent) {
      alert('Reminder untuk jadwal ini sudah dikirim.');
      return;
    }

    setReminderToSend(item);
    setIsSendModalOpen(true);
  }, []);

  const displayData = useMemo(() => {
    return collapseReminderSeries(vaksinasiData);
  }, [vaksinasiData]);

  const filteredData = useMemo(() => {
    return filterReminderRows(displayData, searchQuery, statusFilter);
  }, [displayData, searchQuery, statusFilter]);

  const unsentReminderRows = useMemo(() => {
    return displayData.filter((item) => {
      const hasValidReminderId = Boolean(item?.reminderId);
      const isCompleted = item?.status === 'Selesai';
      const alreadySent = Boolean(item?.reminderSent);

      return hasValidReminderId && !isCompleted && !alreadySent;
    });
  }, [displayData]);

  const unsendCount = useMemo(() => {
    return unsentReminderRows.length;
  }, [unsentReminderRows]);

  const historyItems = useMemo(() => {
    if (!reminderToHistory) return [];

    return vaksinasiData
      .filter((row) => row.hewanId === reminderToHistory.hewanId && row.vaksinId === reminderToHistory.vaksinId)
      .filter((row) => Boolean(row.latestVaccinationDateRaw))
      .sort((a, b) => new Date(a.latestVaccinationDateRaw) - new Date(b.latestVaccinationDateRaw))
      .map((row, index) => ({
        id: row.reminderId,
        title: `Vaksinasi #${index + 1}`,
        date: row.latestVaccinationDate,
        notes: row.notes,
        performedBy: row.performedBy,
      }));
  }, [vaksinasiData, reminderToHistory]);

  const renderCell = useMemo(
    () => createReminderCellRenderer({
       onDelete: handleDelete,
       onOpenAction: handleOpenAction,
       onOpenHistory: handleOpenHistory,
       onOpenEdit: handleOpenEdit,
       onOpenSchedule: handleOpenSchedule,
       onOpenSend: handleOpenSend,
    }),
      [handleDelete, handleOpenAction, handleOpenHistory, handleOpenEdit, handleOpenSchedule, handleOpenSend]
  );

  const handleSaveReminder = async (formData) => {
    await createReminder(formData);
  };

  const handleConfirmDelete = async () => {
    if (!reminderToDelete) {
      alert('ID reminder tidak valid. Silakan refresh halaman lalu coba lagi.');
      return;
    }

    try {
      const relatedReminderIds = Array.from(
        new Set(
          vaksinasiData
            .filter((row) => {
              if (reminderToDelete.hewanId && reminderToDelete.vaksinId) {
                return row.hewanId === reminderToDelete.hewanId && row.vaksinId === reminderToDelete.vaksinId;
              }
              return row.reminderId === reminderToDelete.reminderId;
            })
            .map((row) => row.reminderId)
            .filter(Boolean)
        )
      );

      if (relatedReminderIds.length === 0) {
        throw new Error('ID reminder tidak ditemukan.');
      }

      for (const reminderId of relatedReminderIds) {
        await deleteReminder(reminderId);
      }

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

  const handleSaveEditReminder = async (reminderId, formData) => {
    if (!reminderId) {
      alert('ID reminder tidak valid. Silakan refresh halaman lalu coba lagi.');
      return;
    }

    try {
      const sourceHewanId = String(reminderToEdit?.hewanId ?? '');
      const sourceVaksinId = String(reminderToEdit?.vaksinId ?? '');
      const targetHewanId = String(formData?.id_hewan ?? '');
      const targetVaksinId = String(formData?.id_jenis_vaksin ?? '');

      const isSeriesMoved =
        sourceHewanId &&
        sourceVaksinId &&
        targetHewanId &&
        targetVaksinId &&
        (sourceHewanId !== targetHewanId || sourceVaksinId !== targetVaksinId);

      if (isSeriesMoved) {
        const relatedReminderIds = Array.from(
          new Set(
            vaksinasiData
              .filter((row) =>
                String(row?.hewanId ?? '') === sourceHewanId &&
                String(row?.vaksinId ?? '') === sourceVaksinId
              )
              .map((row) => row?.reminderId)
              .filter(Boolean)
          )
        );

        for (const relatedReminderId of relatedReminderIds) {
          await updateReminder(relatedReminderId, {
            id_hewan: targetHewanId,
            id_jenis_vaksin: targetVaksinId,
          });
        }
      }

      await updateReminder(reminderId, {
        tanggal_vaksin: formData?.tanggal_vaksin,
      });

      setIsEditModalOpen(false);
      setReminderToEdit(null);
    } catch (err) {
      alert(`Gagal menyimpan perubahan reminder! ${err?.response?.data?.message || err?.message || ''}`.trim());
    }
  };

  const handleSaveReschedule = async (reminderId, formData) => {
    if (!reminderId) {
      alert('ID reminder tidak valid. Silakan refresh halaman lalu coba lagi.');
      return;
    }

    try {
      await updateReminder(reminderId, formData);
      setIsRescheduleModalOpen(false);
      setReminderToReschedule(null);
    } catch (err) {
      alert(`Gagal menjadwalkan ulang reminder! ${err?.response?.data?.message || err?.message || ''}`.trim());
    }
  };

  const handleSendReminder = async (reminderType) => {
    if (!reminderToSend?.reminderId) {
      alert('ID reminder tidak valid. Silakan refresh halaman lalu coba lagi.');
      return;
    }

    try {
      await sendManualReminder({
        reminderId: reminderToSend.reminderId,
        reminderType,
      });
      setIsSendModalOpen(false);
      setReminderToSend(null);
      // alert(`Reminder berhasil dikirim ke ${reminderToSend.ownerName} (${reminderToSend.ownerPhone || '-'})`);
    } catch (err) {
      alert(`Gagal mengirim reminder! ${err?.response?.data?.message || err?.message || ''}`.trim());
    }
  };

  const handleOpenWhatsApp = async () => {
    const resolveReminderType = (dateSource) => {
      if (!dateSource) return 'same_day';

      const targetDate = new Date(dateSource);
      if (Number.isNaN(targetDate.getTime())) return 'same_day';

      const now = new Date();
      const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const dayDiff = Math.ceil((startTarget - startToday) / (1000 * 60 * 60 * 24));

      if (dayDiff >= 7) return '7_day_before';
      if (dayDiff >= 3) return '3_days_sebelum';
      return 'same_day';
    };

    try {
      if (unsentReminderRows.length === 0) {
        alert('Tidak ada reminder yang perlu dikirim.');
        return;
      }

      let sentCount = 0;
      let failedCount = 0;

      for (const row of unsentReminderRows) {
        try {
          await sendManualReminder({
            reminderId: row.reminderId,
            reminderType: resolveReminderType(row.nextVaccinationDateRaw),
          });
          sentCount += 1;
        } catch (error) {
          failedCount += 1;
        }
      }

      alert(
        `Kirim semua reminder selesai. Berhasil: ${sentCount}${failedCount > 0 ? `, Gagal: ${failedCount}` : ''}`
      );
    } catch (err) {
      alert(`Gagal kirim semua reminder! ${err?.response?.data?.message || err?.message || ''}`.trim());
    }
  };

  return (
    <div className="space-y-6">
      <PageHeaderVaksinasi 
        title="Reminder Vaksinasi" 
        description="Kelola pengingat jadwal vaksinasi hewan" 
        addButtonText="Tambah Reminder" 
        onAddClick={() => setIsModalOpen(true)}
        handleOpenWhatsApp={handleOpenWhatsApp}
        unsendCount={unsendCount}
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

      <TambahReminderVaksinasiModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      onSave={handleSaveReminder}/>
      <DeleteConfirmModal 
      isOpen={isDeleteModalOpen} 
      onClose={() => setIsDeleteModalOpen(false)} 
      onConfirm={handleConfirmDelete} 
      itemName={reminderToDelete?.petName} 
      itemType="reminder vaksinasi" 
      description={"Apakah Anda yakin ingin menghapus reminder ini? Tindakan ini tidak dapat dibatalkan."}/>    
      <ActionReminderVaksinasiModal isOpen={isReminderActionModalOpen} onClose={() => setIsReminderActionModalOpen(false)}
        onSave={handleConfirmReminderAction} reminder={reminderToAction} isSubmitting={isUpdating}
      />
      <VaccinationHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        reminder={reminderToHistory}
        historyItems={historyItems}
        nextScheduleDate={reminderToHistory?.nextVaccinationDate}
        nextScheduleHint={reminderToHistory?.status === 'Selesai' ? '-' : reminderToHistory?.nextVaccinationHint}
      />
      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setReminderToReschedule(null);
        }}
        reminder={reminderToReschedule}
        reschedule={reminderToReschedule}
        onSave={handleSaveReschedule}
      />
      <EditReminderModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setReminderToEdit(null);
        }}
        reminder={reminderToEdit}
        onSave={handleSaveEditReminder}
        isSubmitting={isUpdating}
      />
      <SendReminderModal
        isOpen={isSendModalOpen}
        onClose={() => {
          setIsSendModalOpen(false);
          setReminderToSend(null);
        }}
        onSend={handleSendReminder}
        sendReminder={reminderToSend}
        isSending={isSendingReminder || isSendingScheduledReminder}
      />
    </div>
  );
}