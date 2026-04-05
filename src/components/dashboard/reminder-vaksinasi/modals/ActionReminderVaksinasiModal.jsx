"use client";
import React from 'react';
import BaseModal from '../../shared-modals/BaseModal';
import useActionReminderForm from './useActionReminderForm';
import { CheckCircleIcon } from '@/components/icons';
import Button from '@/components/ui/Button';
import { VaccinationInfo } from '../_components/CardVaccinationInfo';
import { ScheduleSelector } from '../_components/ScheduleSelector';
import { PencatatanVaksinasi } from '../_components/PencatatanVaksinasi';

const ActionReminderVaksinasiModal = ({ isOpen, onClose, onSave, reminder, isSubmitting = false }) => {
  const {
    formData,
    calculatedNextDate,
    handleActualDateChange,
    handleScheduleTypeChange,
    handleManualDateChange,
    handlePerformedByChange,
    handleNotesChange,
    handleSubmit,
  } = useActionReminderForm({ isOpen, onClose, onSave, reminder });

  if (!reminder) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Selesai Vaksinasi"
      maxWidth="max-w-lg"
      description="Catat vaksinasi yang sudah dilakukan. Jadwal berikutnya akan dihitung otomatis dari tanggal aktual hari ini."
    >
      <section className="px-6 pb-6 pt-2 space-y-2">
        <VaccinationInfo reminder={reminder} />
        <form onSubmit={handleSubmit} className="pb-2 pt-2 space-y-4">
          <PencatatanVaksinasi
            formData={formData}
            handleActualDateChange={handleActualDateChange}
            handlePerformedByChange={handlePerformedByChange}
            handleNotesChange={handleNotesChange}
          />
          <ScheduleSelector
            calculatedNextDate={calculatedNextDate}
            formData={formData}
            reminder={reminder}
            handleManualDateChange={handleManualDateChange}
            handleScheduleTypeChange={handleScheduleTypeChange}
          />
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#000000]/10 hover:bg-accent-neutral-100 transition duration-150"
            >
              Batal
            </button>
            <Button
              icon={<CheckCircleIcon className="h-4 w-4" />}
              type="submit"
              iconPosition="left"
              color="bg-accent-green-400"
              hoverColor="hover:bg-accent-green-500"
              focusColor="focus:ring-accent-green-400"
              disabled={isSubmitting}
              roundedClass="rounded-lg"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Sekarang'}
            </Button>
          </div>
        </form>
      </section>
    </BaseModal>
  );
};

export default ActionReminderVaksinasiModal;