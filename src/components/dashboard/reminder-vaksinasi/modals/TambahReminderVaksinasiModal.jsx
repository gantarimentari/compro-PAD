"use client";
import React, { useEffect, useState } from 'react';
import BaseModal from '../../shared-modals/BaseModal';
import SuccessToast from '@/components/ui/SuccessToast';
import hewanService from '@/lib/services/hewanService';
import jenisVaksinService from '@/lib/services/jenisVaksinService';

const INITIAL_FORM_DATA = {
  id_pasien: '',
  id_hewan: '',
  id_jenis_vaksin: '',
  tanggal_vaksin: '',
  notes: ''
};

const normalizeRows = (rawData) => {
  if (Array.isArray(rawData)) return rawData;
  if (Array.isArray(rawData?.data)) return rawData.data;
  return [];
};

const mapHewanOptions = (hewanData) => {
  return normalizeRows(hewanData).flatMap((owner) => {
    const ownerId = owner.id ?? '';
    const ownerName = owner.name ?? owner.username ?? owner.email ?? 'Unknown';
    const pets = Array.isArray(owner.pets) ? owner.pets : [];

    return pets.map((pet) => ({
      id: pet.id,
      nama_hewan: pet.petName ?? pet.nama_hewan ?? '-',
      nama_pemilik: ownerName,
      id_pasien: ownerId,
    }));
  });
};

const mapJenisVaksinOptions = (jenisVaksinData) => {
  return normalizeRows(jenisVaksinData)
    .map((item) => {
      const itemId = item.id ?? item.id_vaksinasi ?? item.id_vaksin ?? item.vaksin_id ?? null;
      const rawStatus = String(item.status ?? '').toLowerCase();
      const isActive =
        rawStatus === 'active' ||
        rawStatus === 'available' ||
        rawStatus === '1' ||
        rawStatus === 'true';

      return {
        id: itemId,
        nama_vaksin: item.nama_vaksin ?? '-',
        isActive,
      };
    })
    .filter((item) => item.id !== null && item.id !== undefined && item.isActive);
};

const TambahReminderVaksinasiModal = ({
  isOpen,onClose,onSave}) => {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [hewanOptions, setHewanOptions] = useState([]);
  const [jenisVaksinOptions, setJenisVaksinOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchOptions = async () => {
      setIsLoadingOptions(true);

      try {
        const [hewanData, jenisVaksinData] = await Promise.all([
          hewanService.getAll(),
          jenisVaksinService.getAll(),
        ]);

        setHewanOptions(mapHewanOptions(hewanData));
        setJenisVaksinOptions(mapJenisVaksinOptions(jenisVaksinData));
      } catch (error) {
        console.error('Error fetching reminder vaksinasi options:', error);
        setHewanOptions([]);
        setJenisVaksinOptions([]);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [isOpen]);
  
  useEffect(() => { 
    if (!isOpen) {
      setShowSuccess(false);
      setIsSubmitting(false);
      setFormData(INITIAL_FORM_DATA);
    }
  },[isOpen]);

  const handleHewanChange = (selectedId) => {
    const selectedHewan = hewanOptions.find((hewan) => String(hewan.id) === String(selectedId));

    setFormData((prev) => ({
      ...prev,
      id_hewan: selectedId,
      id_pasien: selectedHewan?.id_pasien ? String(selectedHewan.id_pasien) : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSuccess(false);
    setIsSubmitting(true);
    try {
      await onSave(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error creating reminder vaksinasi:', error);
      alert('Gagal menyimpan reminder vaksinasi: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }};
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
            onChange={(e) => setFormData((prev) => ({ ...prev, id_jenis_vaksin: e.target.value }))}
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
            onChange={(e) => setFormData({ ...formData, tanggal_vaksin: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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