'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const REMINDER_QUEUE_STORAGE_KEY = 'reminder-vaksinasi-schedule-queue';
const REMINDER_TYPE_BY_DAY = {
  7: '7_day_before',
  3: '3_days_sebelum',
  0: 'same_day',
};

const getStartOfDay = (value) => new Date(value.getFullYear(), value.getMonth(), value.getDate());

const resolveReminderDispatch = (dateSource) => {
  if (!dateSource) {
    return { dayDiff: null, reminderType: null, canDispatchNow: false };
  }

  const targetDate = new Date(dateSource);
  if (Number.isNaN(targetDate.getTime())) {
    return { dayDiff: null, reminderType: null, canDispatchNow: false };
  }

  const now = new Date();
  const startToday = getStartOfDay(now);
  const startTarget = getStartOfDay(targetDate);
  const dayDiff = Math.ceil((startTarget - startToday) / (1000 * 60 * 60 * 24));
  const reminderType = REMINDER_TYPE_BY_DAY[dayDiff] || null;

  return {
    dayDiff,
    reminderType,
    canDispatchNow: Boolean(reminderType),
  };
};

const readReminderQueue = () => {
  if (typeof window === 'undefined') return [];

  try {
    const rawValue = window.localStorage.getItem(REMINDER_QUEUE_STORAGE_KEY);
    const parsed = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveReminderQueue = (queue) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(REMINDER_QUEUE_STORAGE_KEY, JSON.stringify(queue));
};

const isAlreadySentConflictError = (error) => {
  return (
    error?.response?.status === 409 &&
    String(error?.response?.data?.error || '') === 'reminder_already_sent'
  );
};

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
  const [scheduledReminderIds, setScheduledReminderIds] = useState([]);
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
  const vaksinasiDataRef = useRef(vaksinasiData);
  const sendManualReminderRef = useRef(sendManualReminder);
  const isFlushingQueueRef = useRef(false);

  useEffect(() => {
    vaksinasiDataRef.current = vaksinasiData;
  }, [vaksinasiData]);

  useEffect(() => {
    sendManualReminderRef.current = sendManualReminder;
  }, [sendManualReminder]);

  const syncScheduledReminderIds = useCallback(() => {
    const queue = readReminderQueue();
    const ids = Array.from(
      new Set(
        queue
          .map((item) => String(item?.reminderId || ''))
          .filter(Boolean)
      )
    );

    setScheduledReminderIds((prevIds) => {
      if (prevIds.length === ids.length && prevIds.every((id, index) => id === ids[index])) {
        return prevIds;
      }
      return ids;
    });
  }, []);

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

    if (item?.reminderScheduled) {
      alert('Reminder untuk jadwal ini sudah dijadwalkan.');
      return;
    }

    setReminderToSend(item);
    setIsSendModalOpen(true);
  }, []);

  const flushScheduledReminderQueue = useCallback(async () => {
    if (typeof window === 'undefined' || vaksinasiDataRef.current.length === 0) return;
    if (isFlushingQueueRef.current) return;

    isFlushingQueueRef.current = true;

    try {
      const queue = readReminderQueue();
      if (queue.length === 0) return;

      let nextQueue = [...queue];
      let queueChanged = false;

      for (const queuedItem of queue) {
        const currentReminder = vaksinasiDataRef.current.find(
          (row) => String(row?.reminderId) === String(queuedItem?.reminderId)
        );

        if (!currentReminder || currentReminder.reminderSent || currentReminder.status === 'Selesai') {
          nextQueue = nextQueue.filter((item) => String(item?.reminderId) !== String(queuedItem?.reminderId));
          queueChanged = true;
          continue;
        }

        const dispatchInfo = resolveReminderDispatch(currentReminder.nextVaccinationDateRaw);
        if (!dispatchInfo.canDispatchNow) continue;

        try {
          await sendManualReminderRef.current({
            reminderId: currentReminder.reminderId,
            reminderType: dispatchInfo.reminderType,
          });
          nextQueue = nextQueue.filter((item) => String(item?.reminderId) !== String(queuedItem?.reminderId));
          queueChanged = true;
        } catch (error) {
          if (isAlreadySentConflictError(error)) {
            nextQueue = nextQueue.filter((item) => String(item?.reminderId) !== String(queuedItem?.reminderId));
            queueChanged = true;
            continue;
          }

          console.error('Failed to dispatch scheduled reminder:', error);
        }
      }

      if (queueChanged) {
        saveReminderQueue(nextQueue);
        syncScheduledReminderIds();
      }
    } finally {
      isFlushingQueueRef.current = false;
    }
  }, [syncScheduledReminderIds]);

  useEffect(() => {
    syncScheduledReminderIds();
    void flushScheduledReminderQueue();

    const intervalId = window.setInterval(() => {
      void flushScheduledReminderQueue();
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, [flushScheduledReminderQueue, syncScheduledReminderIds]);

  const scheduledReminderIdSet = useMemo(() => {
    return new Set(scheduledReminderIds.map((id) => String(id)));
  }, [scheduledReminderIds]);

  const displayData = useMemo(() => {
    return collapseReminderSeries(vaksinasiData).map((item) => ({
      ...item,
      reminderScheduled: scheduledReminderIdSet.has(String(item?.reminderId || '')),
    }));
  }, [scheduledReminderIdSet, vaksinasiData]);

  const filteredData = useMemo(() => {
    return filterReminderRows(displayData, searchQuery, statusFilter);
  }, [displayData, searchQuery, statusFilter]);

  const unsentReminderRows = useMemo(() => {
    return displayData.filter((item) => {
      const hasValidReminderId = Boolean(item?.reminderId);
      const isCompleted = item?.status === 'Selesai';
      const alreadySent = Boolean(item?.reminderSent);
      const alreadyScheduled = Boolean(item?.reminderScheduled);

      return hasValidReminderId && !isCompleted && !alreadySent && !alreadyScheduled;
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

              return String(row.reminderId) === String(reminderToDelete.reminderId);
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
      await updateReminder(reminderId, {
        id_hewan: formData?.id_hewan,
        id_jenis_vaksin: formData?.id_jenis_vaksin,
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
      const queue = readReminderQueue();
      const nextQueue = queue.filter((item) => String(item?.reminderId) !== String(reminderToSend.reminderId));

      nextQueue.push({
        reminderId: reminderToSend.reminderId,
        reminderType,
        queuedAt: new Date().toISOString(),
      });

      saveReminderQueue(nextQueue);
      syncScheduledReminderIds();
      setIsSendModalOpen(false);
      setReminderToSend(null);
      alert('Reminder sudah dijadwalkan. Sistem akan mencoba mengirim otomatis saat H-7, H-3, atau hari-H.');
      void flushScheduledReminderQueue();
    } catch (err) {
      alert(`Gagal menjadwalkan reminder! ${err?.response?.data?.message || err?.message || ''}`.trim());
    }
  };

  const handleOpenWhatsApp = async () => {
    try {
      if (unsentReminderRows.length === 0) {
        alert('Tidak ada reminder yang perlu dikirim.');
        return;
      }

      const queue = readReminderQueue();
      const queuedIds = new Set(queue.map((item) => String(item?.reminderId)));
      const nextQueue = [...queue];

      for (const row of unsentReminderRows) {
        if (queuedIds.has(String(row.reminderId))) {
          continue;
        }

        const dispatchInfo = resolveReminderDispatch(row.nextVaccinationDateRaw);
        nextQueue.push({
          reminderId: row.reminderId,
          reminderType: dispatchInfo.reminderType || 'same_day',
          queuedAt: new Date().toISOString(),
        });
      }

      saveReminderQueue(nextQueue);
      syncScheduledReminderIds();
      void flushScheduledReminderQueue();

      alert(
        'Semua reminder sudah masuk antrean. Sistem akan mengirim otomatis hanya saat H-7, H-3, atau hari-H.'
      );
    } catch (err) {
      alert(`Gagal menjadwalkan semua reminder! ${err?.response?.data?.message || err?.message || ''}`.trim());
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