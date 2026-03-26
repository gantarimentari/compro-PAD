import { useEffect, useState } from 'react';
import hewanService from '@/lib/services/hewanService';
import jenisVaksinService from '@/lib/services/jenisVaksinService';

const INITIAL_FORM_DATA = {
  id_pasien: '',
  id_hewan: '',
  id_jenis_vaksin: '',
  tanggal_vaksin: '',
  notes: '',
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

export default function useTambahReminderVaksinasiForm({ isOpen, onClose, onSave }) {
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
  }, [isOpen]);

  const handleHewanChange = (selectedId) => {
    const selectedHewan = hewanOptions.find((hewan) => String(hewan.id) === String(selectedId));

    setFormData((prev) => ({
      ...prev,
      id_hewan: selectedId,
      id_pasien: selectedHewan?.id_pasien ? String(selectedHewan.id_pasien) : '',
    }));
  };

  const handleJenisVaksinChange = (value) => {
    setFormData((prev) => ({ ...prev, id_jenis_vaksin: value }));
  };

  const handleTanggalChange = (value) => {
    setFormData((prev) => ({ ...prev, tanggal_vaksin: value }));
  };

  const handleNotesChange = (value) => {
    setFormData((prev) => ({ ...prev, notes: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      alert(`Gagal menyimpan reminder vaksinasi: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
    handleSubmit,
  };
}