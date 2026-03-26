'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import reminderVaksinasiService from '@/lib/services/reminderVaksinasi';
import hewanService from '@/lib/services/hewanService';
import jenisVaksinService from '@/lib/services/jenisVaksinService';
import { REMINDER_QUERY_KEY } from './reminderVaksinasi.constants';
import { mapReminderTableData } from './reminderVaksinasi.utils';

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

  const createReminder = async (formData) => {
    return createMutation.mutateAsync({
      id_hewan: formData.id_hewan,
      id_jenis_vaksin: formData.id_jenis_vaksin,
      tanggal_vaksin: formData.tanggal_vaksin,
    });
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

    const resolvedStatus = vaccinationData.scheduleType === 'final' ? 'Selesai' : 'Dijadwalkan';

    return updateMutation.mutateAsync({
      reminderId,
      payload: {
        status: resolvedStatus,
        tanggal_vaksin_aktual: vaccinationData.actualVaccinationDate,
        dilakukan_oleh: vaccinationData.performedBy,
        catatan: vaccinationData.notes,
        jadwal_vaksin_berikutnya: vaccinationData.nextVaccinationDate,
        tipe_jadwal: vaccinationData.scheduleType,
      },
    });
  };

  return {
    vaksinasiData,
    isLoading,
    createReminder,
    deleteReminder,
    completeVaccination,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}