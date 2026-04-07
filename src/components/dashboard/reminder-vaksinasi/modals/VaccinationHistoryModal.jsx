import React from 'react';
import BaseModal from '../../shared-modals/BaseModal';
import { CalenderCheckIcon, JarumSuntikIcon } from '@/components/icons';

const VaccinationHistoryModal = ({
  isOpen,
  onClose,
  reminder,
  historyItems = [],
  nextScheduleDate = '-',
  nextScheduleHint = '-',
}) => {
  const isComplete = reminder?.status === 'Selesai';
  if (!isOpen || !reminder) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-2xl"
      showCloseButton={false}
      overflowHidden
    >
      <section className="relative px-6 py-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-3 text-2xl leading-none text-accent-neutral-500 hover:text-accent-neutral-900"
          aria-label="Tutup"
        >
          ×
        </button>

        <div className="pr-8">
          <h3 className="text-3xl font-bold text-accent-neutral-1000">Riwayat Vaksinasi - {reminder.petName}</h3>
          <p className="text-body-2 text-accent-neutral-800 mt-1">
            {reminder.species || '-'} | Pemilik: {reminder.ownerName || '-'}
          </p>
        </div>
        <div className="mt-6 max-h-[54vh] overflow-y-auto pr-2">
          {historyItems.length === 0 ? (
            <div className="rounded-2xl bg-accent-neutral-100 px-4 py-5 text-body-2 text-accent-neutral-700">
              Belum ada riwayat vaksinasi aktual.
            </div>
          ) : (
            historyItems.map((entry, index, arr) => {
              const isLastItem = index === arr.length - 1;
              return (
              <div key={entry.id || `${entry.date}-${index}`} className={`relative pl-10 ${isLastItem ? '' : 'mb-4'}`}>
                {index > 0 && (
                  <div className="absolute left-[9px] top-0 h-[19px] w-px bg-accent-neutral-200" />
                )}
                {!isLastItem && (
                  <div className="absolute left-[9px] top-[19px] bottom-[-16px] w-px bg-accent-neutral-200" />
                )}

                <div
                  className={`absolute left-0 top-[5px] z-10 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 ${
                    isLastItem ? 'border-[#0081DD] bg-[#0081DD]' : 'border-[#D1D5DC] bg-white'
                  }`}
                >
                  {isLastItem ? <JarumSuntikIcon className="h-2.5 w-2.5" color="white" /> : null}
                </div>

                <div className="rounded-2xl bg-[#F9FAFB] p-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-h-8 font-semibold text-accent-neutral-1000">{entry.title}</p>
                    <p className="text-body-2 text-accent-neutral-800 whitespace-nowrap">{entry.date}</p>
                  </div>
                  <p className="mt-1 text-body-2 text-accent-neutral-800">{entry.notes || '-'}</p>
                  <p className="text-body-2 text-accent-neutral-600 mt-1">Oleh: {entry.performedBy || '-'}</p>
                </div>
              </div>
            );
            })
          )}
          {!isComplete && (
          <div className="relative flex items-start gap-4 pt-4">
            <div className="relative z-10 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-[#05DF72] bg-white">
              <CalenderCheckIcon className="h-2.5 w-2.5 text-[#05DF72]" />
            </div>
            <div className="flex-1 rounded-2xl border border-[#B6ECC8] bg-[#F0FDF4] p-4">
              <p className="text-body-2 font-semibold text-[#008236]">Jadwal Berikutnya</p>
              <div className="flex justify-between items-end mt-1">
                  <p className="text-body-2 font-semibold text-[#016630]">{nextScheduleDate || '-'}</p>
                  <p className="text-body-5 text-[#016630]">{nextScheduleHint || '-'}</p>
                </div>
            </div>
          </div>
        )}
        </div>

        
        
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#000000]/10 text-body-2 text-accent-neutral-900 hover:bg-accent-neutral-100"
          >
            Tutup
          </button>
        </div>
      </section>
    </BaseModal>
  );
};

export default VaccinationHistoryModal;
