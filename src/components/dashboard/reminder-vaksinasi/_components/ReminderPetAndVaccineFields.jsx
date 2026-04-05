import React from 'react';

const ReminderPetAndVaccineFields = ({
  hewanValue,
  vaksinValue,
  hewanOptions,
  jenisVaksinOptions,
  onHewanChange,
  onVaksinChange,
  isLoadingOptions,
  isSubmitting,
}) => {
  return (
    <>
      <div>
        <label className="block text-h-8 font-bold text-accent-neutral-1000">Pilih Hewan</label>
        <select
          value={hewanValue}
          onChange={(e) => onHewanChange(e.target.value)}
          className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none text-body-2"
          required
          disabled={isLoadingOptions || isSubmitting}
        >
          <option value="">
            {isLoadingOptions ? 'Memuat data hewan...' : 'Pilih nama hewan'}
          </option>
          {hewanOptions.map((hewan) => (
            <option key={hewan.id} value={hewan.id}>
              {hewan.nama_hewan} - {hewan.nama_pemilik}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-h-8 font-bold text-accent-neutral-1000">Jenis Vaksin</label>
        <select
          value={vaksinValue}
          onChange={(e) => onVaksinChange(e.target.value)}
          className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none text-body-2"
          required
          disabled={isLoadingOptions || isSubmitting}
        >
          <option value="">
            {isLoadingOptions ? 'Memuat jenis vaksin...' : 'Pilih jenis vaksin'}
          </option>
          {jenisVaksinOptions.map((vaksin) => (
            <option key={vaksin.id} value={vaksin.id}>
              {vaksin.nama_vaksin}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default ReminderPetAndVaccineFields;