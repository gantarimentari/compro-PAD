"use client";

import Button from '@/components/ui/Button';
import BaseModal from '../../shared-modals/BaseModal';
import { SendIcon } from '@/components/icons';

export default function SendReminderModal({ isOpen, onClose,  onSend, sendReminder, isSending = false }) {
  if (!sendReminder) return null;

  const handleSchedule = () => {
    onSend?.('schedule');
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Kirim Reminder"
      description={`Kirim pengingat vaksinasi ${sendReminder.vaccinationType} untuk hewan ${sendReminder.petName} kepada ${sendReminder.ownerName} (${sendReminder.ownerPhone || '-'})?`}
    >
      <div className='p-6'>
        <div className="flex justify-end space-x-3 ">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-1 rounded-lg border border-[#000000]/10 hover:bg-accent-neutral-100 transition duration-150"
        >
          Batal
        </button>
        <Button
          type="button"
          icon={<SendIcon className="h-4 w-4" color="white" />}
          iconPosition="left"
          color="bg-accent-blue-400"
          hoverColor="hover:bg-accent-blue-500"
          focusColor="focus:ring-accent-blue-400"
          disabled={isSending}
          roundedClass="rounded-lg"
          onClick={handleSchedule}
        >
          {isSending ? 'Menjadwalkan...' : 'Jadwalkan Reminder'}
        </Button>
      </div>
      </div>
      
    </BaseModal>
  );
}
       