'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import reminderVaksinasiService from '@/lib/services/reminderVaksinasi';
import hewanService from '@/lib/services/hewanService';
import jenisVaksinService from '@/lib/services/jenisVaksinService';
import { REMINDER_QUERY_KEY } from './reminderVaksinasi.constants';
import { mapReminderTableData } from './reminderVaksinasi.utils';

const toDateOnly = (value) => {
  if (!value) return '';
  const raw = String(value).trim();
  const match = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : '';
};

const getTodayDateOnly = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addMonthsDateOnly = (dateString, monthsToAdd) => {
  const safeDate = toDateOnly(dateString);
  if (!safeDate) return '';

  const [yearStr, monthStr, dayStr] = safeDate.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  const months = Number(monthsToAdd || 0);

  if (!year || !month || !day) return '';

  const base = new Date(year, month - 1, day);
  if (Number.isNaN(base.getTime())) return '';

  base.setMonth(base.getMonth() + months);

  const nextYear = base.getFullYear();
  const nextMonth = String(base.getMonth() + 1).padStart(2, '0');
  const nextDay = String(base.getDate()).padStart(2, '0');
  return `${nextYear}-${nextMonth}-${nextDay}`;
};

export default function useReminderVaksinasiData() {
  const queryClient = useQueryClient();

  const { data: vaksinasiData = [], isLoading } = useQuery({
    queryKey: REMINDER_QUERY_KEY,
    queryFn: async () => {
      const [rawReminder, rawHewan, rawJenisVaksin] = await Promise.all([
        reminderVaksinasiService.getAll(),
        hewanService.getAll(),
        jenisVaksinService.getAll(),
      ]);

      return mapReminderTableData(rawReminder, rawHewan, rawJenisVaksin);
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => reminderVaksinasiService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDER_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (reminderId) => reminderVaksinasiService.remove(reminderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDER_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ reminderId, payload }) =>
      reminderVaksinasiService.update(reminderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDER_QUERY_KEY });
    },
  });

  const sendManualMutation = useMutation({
    mutationFn: (payload) => reminderVaksinasiService.sendManual(payload),
    onSuccess: (response, variables) => {
      const reminderId = variables?.id_vaksinasi ?? variables?.reminderId ?? response?.id_vaksinasi ?? response?.data?.id_vaksinasi;

      if (reminderId) {
        queryClient.setQueryData(REMINDER_QUERY_KEY, (currentData = []) => {
          if (!Array.isArray(currentData)) return currentData;

          return currentData.map((row) => {
            if (String(row?.reminderId) !== String(reminderId)) {
              return row;
            }

            return {
              ...row,
              reminderSent: true,
              status: row?.status === 'Selesai' ? row.status : 'Terkirim',
            };
          });
        });
      }

      queryClient.invalidateQueries({ queryKey: REMINDER_QUERY_KEY });
    },
  });

  const sendScheduledMutation = useMutation({
    mutationFn: () => reminderVaksinasiService.sendScheduled(),
  });

  const createReminder = async (formData) => {
    const firstVaccinationDate = toDateOnly(formData.tanggal_vaksin);
    const todayDate = getTodayDateOnly();
    const seedScheduleDate =
      firstVaccinationDate && firstVaccinationDate >= todayDate
        ? firstVaccinationDate
        : todayDate;
    const intervalMonths = Number(formData.vaccineInterval || 12);
    const nextVaccinationDate = addMonthsDateOnly(firstVaccinationDate || todayDate, intervalMonths);

    const createdReminder = await createMutation.mutateAsync({
      id_hewan: formData.id_hewan,
      dilakukan_oleh: formData.performedBy || 'Admin',
      id_jenis_vaksin: formData.id_jenis_vaksin,
      tanggal_vaksin: seedScheduleDate,
      catatan: formData.notes || null,
    });

    const createdReminderId =
      createdReminder?.data?.id_vaksinasi ??
      createdReminder?.id_vaksinasi ??
      createdReminder?.data?.id ??
      createdReminder?.id ??
      null;

    if (!createdReminderId) {
      throw new Error('Gagal membaca ID reminder yang baru dibuat.');
    }

    await updateMutation.mutateAsync({
      reminderId: createdReminderId,
      payload: {
        status: 'Selesai',
        tanggal_vaksin_aktual: firstVaccinationDate || todayDate,
        dilakukan_oleh: formData.performedBy || 'Admin',
        catatan: formData.notes || null,
      },
    });

    if (nextVaccinationDate) {
      await createMutation.mutateAsync({
        id_hewan: formData.id_hewan,
        dilakukan_oleh: formData.performedBy || 'Admin',
        id_jenis_vaksin: formData.id_jenis_vaksin,
        tanggal_vaksin: nextVaccinationDate,
        catatan: formData.notes || null,
      });
    }

    return createdReminder;
  };

  const deleteReminder = async (reminderId) => {
    if (!reminderId) {    
      throw new Error('ID reminder tidak valid.');
    }

    return deleteMutation.mutateAsync(reminderId);
  };

  const completeVaccination = async (reminderId, vaccinationData) => {
    if (!reminderId) {
      throw new Error('ID reminder tidak valid.');
    }

    const isFinalSchedule = vaccinationData.scheduleType === 'final';

    return updateMutation.mutateAsync({
      reminderId,
      payload: {
        status: isFinalSchedule ? 'Selesai' : 'Dijadwalkan',
        tanggal_vaksin_aktual: vaccinationData.actualVaccinationDate,
        dilakukan_oleh: vaccinationData.performedBy,
        catatan: vaccinationData.notes,
        jadwal_vaksin_berikutnya: isFinalSchedule ? null : vaccinationData.nextVaccinationDate,
        tipe_jadwal: vaccinationData.scheduleType,
      },
    });
  };

  const updateReminder = async (reminderId, formData) => {
    if (!reminderId) {
      throw new Error('ID reminder tidak valid.');
    }

    return updateMutation.mutateAsync({
      reminderId,
      payload: {
        id_hewan: formData.id_hewan,
        id_jenis_vaksin: formData.id_jenis_vaksin,
        tanggal_vaksin: formData.tanggal_vaksin,
        jadwal_vaksin_berikutnya: formData.tanggal_vaksin,
      },
    });
  };

  const sendManualReminder = async ({ reminderId, reminderType = 'same_day' }) => {
    if (!reminderId) {
      throw new Error('ID reminder tidak valid.');
    }

    return sendManualMutation.mutateAsync({
      id_vaksinasi: reminderId,
      reminder_type: reminderType,
    });
  };

  const sendScheduledReminders = async () => {
    return sendScheduledMutation.mutateAsync();
  };

  return {
    vaksinasiData,
    isLoading,
    createReminder,
    updateReminder,
    sendManualReminder,
    sendScheduledReminders,
    deleteReminder,
    completeVaccination,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdating: updateMutation.isPending,
    isSendingReminder: sendManualMutation.isPending,
    isSendingScheduledReminder: sendScheduledMutation.isPending,
  };
}