"use client";

import { useEffect, useState } from 'react';
import BaseModal from '../../shared-modals/BaseModal';
import SuccessToast from '@/components/ui/SuccessToast';

export default function RescheduleModal({ isOpen, onClose, onSave, reminder, reschedule }) {
  const [newDate, setNewDate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setNewDate('');
      setShowSuccess(false);
      return;
    }

    setNewDate(reschedule?.nextVaccinationDateRaw || '');
  }, [isOpen, reschedule]);

  if (!isOpen || !reschedule) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newDate) {
      alert('Tanggal baru harus diisi');
      return;
    }

    try {
      await onSave(reminder.reminderId, {
        tanggal_vaksin: newDate,
        jadwal_vaksin_berikutnya: newDate,
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1200);
    } catch (error) {
      console.error('Error rescheduling reminder:', error);
      alert(`Gagal menjadwalkan ulang: ${error?.response?.data?.message || error?.message || ''}`.trim());
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Jadwalkan Ulang"
      description={`Jadwalkan vaksinasi ${reschedule.vaccinationType || ''} untuk ${reschedule.petName || ''} sudah terlewat. Tentukan tanggal baru.`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-4">
        <div className="rounded-xl border border-[#F5C2A4] bg-[#FFF7ED] px-4 py-3 text-body-2 text-[#CA3500]">
          <div className="font-semibold">Jadwal lama: {reschedule.nextVaccinationDate || '-'}</div>
          <div>{reschedule.nextVaccinationHint || '-'}</div>
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">Tanggal Vaksinasi Baru</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#000000]/10 hover:bg-accent-neutral-100 transition duration-150"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-accent-blue-400 text-white hover:bg-accent-blue-500 transition duration-150"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
      <SuccessToast show={showSuccess} />
    </BaseModal>
  );
}