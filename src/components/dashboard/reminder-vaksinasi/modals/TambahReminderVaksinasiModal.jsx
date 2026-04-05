"use client";
import React from 'react';
import BaseModal from '../../shared-modals/BaseModal';
import SuccessToast from '@/components/ui/SuccessToast';
import useTambahReminderVaksinasiForm from './useTambahReminderVaksinasiForm';
import ReminderPetAndVaccineFields from '../_components/ReminderPetAndVaccineFields';

const TambahReminderVaksinasiModal = ({ isOpen, onClose, onSave }) => {
  const {
    formData,
    hewanOptions,
    jenisVaksinOptions,
    isSubmitting,
    showSuccess,
    isLoadingOptions,
    handleHewanChange,
    handleJenisVaksinChange,
    handleTanggalChange,
    handleNotesChange,
    handlePerformedByChange,
    handleSubmit,
  } = useTambahReminderVaksinasiForm({ isOpen, onClose, onSave });

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Jadwal Vaksinasi"
      maxWidth="max-w-lg"
      description="Data ini akan dianggap sebagai vaksinasi pertama yang sudah dilakukan. Jadwal lanjutan dibuat otomatis dan dikelola lewat tombol Vaksinasi."
    >
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
        <ReminderPetAndVaccineFields
          hewanValue={formData.id_hewan}
          vaksinValue={formData.id_jenis_vaksin}
          hewanOptions={hewanOptions}
          jenisVaksinOptions={jenisVaksinOptions}
          onHewanChange={handleHewanChange}
          onVaksinChange={handleJenisVaksinChange}
          isLoadingOptions={isLoadingOptions}
          isSubmitting={isSubmitting}
        />

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Dilakukan Oleh (Dokter)
          </label>
          <input
            type="text"
            value={formData.performedBy}
            onChange={(e) => handlePerformedByChange(e.target.value)}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2"
            placeholder="Tulis dokter yang melakukan proses vaksinasi"
            required
          />
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Tanggal Vaksin Pertama (Sudah Dilakukan)
          </label>
          <input
            type="date"
            value={formData.tanggal_vaksin}
            onChange={(e) => handleTanggalChange(e.target.value)}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2"
            required
          />
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Catatan (Opsional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Kondisi hewan, reaksi vaksin, dll..."
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800 min-h-[80px] resize-none"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-accent-blue-400 text-white rounded-lg hover:bg-accent-blue-500 transition duration-150"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
      <SuccessToast show={showSuccess} />
    </BaseModal>
  );
};

export default TambahReminderVaksinasiModal;