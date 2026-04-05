import React from 'react';
import BaseModal from '../../shared-modals/BaseModal';

const VaccinationHistoryModal = ({
  isOpen,
  onClose,
  reminder,
  historyItems = [],
  nextScheduleDate = '-',
  nextScheduleHint = '-',
}) => {
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

        <div className="mt-6 space-y-4 max-h-[54vh] overflow-y-auto pr-2">
          {historyItems.length === 0 ? (
            <div className="rounded-2xl bg-accent-neutral-100 px-4 py-5 text-body-2 text-accent-neutral-700">
              Belum ada riwayat vaksinasi aktual.
            </div>
          ) : (
            historyItems.map((entry, index) => (
              <div key={entry.id || `${entry.date}-${index}`} className="relative pl-6">
                <div className="absolute left-[7px] top-0 h-full w-px bg-accent-neutral-200" />
                <div className="absolute left-0 top-5 h-[16px] w-[16px] rounded-full border-2 border-[#E5E7EB] bg-[#F9FAFB]" />
                <div className="rounded-2xl bg-[#F9FAFB] px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-h-8 font-semibold text-accent-neutral-1000">{entry.title}</p>
                    <p className="text-body-2 text-accent-neutral-800 whitespace-nowrap">{entry.date}</p>
                  </div>

                  <p className="mt-1 text-body-2 text-accent-neutral-800">{entry.notes || '-'}</p>
                  <p className="text-body-2 text-accent-neutral-600 mt-1">Oleh: {entry.performedBy || '-'}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-[#B6ECC8] bg-[#EBF9EF] px-4 py-4">
          <p className="text-body-2 font-semibold text-[#008236]">Jadwal Berikutnya</p>
          <p className="text-body-2 font-semibold text-[#016630]">{nextScheduleDate || '-'}</p>
          <p className="text-body-5 text-[#016630]">{nextScheduleHint || '-'}</p>
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
