"use client";
import React from 'react';
import BaseModal from '../../shared-modals/BaseModal';
import SuccessToast from '@/components/ui/SuccessToast';
import useTambahReminderVaksinasiForm from './useTambahReminderVaksinasiForm';

const TambahReminderVaksinasiModal = ({
  isOpen,onClose,onSave}) => {
  const {formData,hewanOptions,jenisVaksinOptions,isSubmitting,showSuccess,isLoadingOptions,
    handleHewanChange,handleJenisVaksinChange,handleTanggalChange,handleNotesChange,
    handleSubmit,} = useTambahReminderVaksinasiForm({ isOpen, onClose, onSave });

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Tambah Jadwal Vaksinasi" maxWidth="max-w-lg" description='Input data vaksinasi pertama. Jadwal berikutnya akan dihitung otomatis berdasarkan jenis vaksin'>
      <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
         <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Pilih Hewan
          </label>
          <select
            value={formData.id_hewan}
            onChange={(e) => handleHewanChange(e.target.value)}
            className={`w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none text-body-2 `}
            required
            disabled={isLoadingOptions}
          >
            <option value="" className='text-accent-neutral-800'>{isLoadingOptions ? 'Memuat data hewan...' : 'Pilih nama hewan'}</option>
            {hewanOptions.map((hewan)=>(
              <option key={hewan.id} value={hewan.id}>{hewan.nama_hewan} - {hewan.nama_pemilik}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Jenis Vaksin
          </label>
          <select
            value={formData.id_jenis_vaksin}
            onChange={(e) => handleJenisVaksinChange(e.target.value)}
            className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none text-body-2"
            required
            disabled={isLoadingOptions}
          >
            <option value="" className='text-accent-neutral-800'>
              {isLoadingOptions ? 'Memuat jenis vaksin...' : 'Pilih jenis vaksin'}
            </option>
            {jenisVaksinOptions.map((vaksin) => (
              <option key={vaksin.id} value={vaksin.id}>
                {vaksin.nama_vaksin}
              </option>
            ))}
          </select>



        </div>
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000">
            Tanggal Vaksin Pertama
          </label>
          <input
            type="date"
            value={formData.tanggal_vaksin}
            onChange={(e) => handleTanggalChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
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
  )};



export default TambahReminderVaksinasiModal;