"use client";

import { useEffect, useState } from 'react';
import BaseModal from '../../shared-modals/BaseModal';
import SuccessToast from '@/components/ui/SuccessToast';
import hewanService from '@/lib/services/hewanService';
import jenisVaksinService from '@/lib/services/jenisVaksinService';
import ReminderPetAndVaccineFields from '../_components/ReminderPetAndVaccineFields';

const INITIAL_FORM_DATA = {
	id_hewan: '',
	id_jenis_vaksin: '',
	tanggal_vaksin: '',
};

const normalizeRows = (rawData) => {
	if (Array.isArray(rawData)) return rawData;
	if (Array.isArray(rawData?.data)) return rawData.data;
	return [];
};

const mapHewanOptions = (hewanData) => {
	return normalizeRows(hewanData).flatMap((owner) => {
		const ownerName = owner.name ?? owner.username ?? owner.email ?? 'Unknown';
		const pets = Array.isArray(owner.pets) ? owner.pets : [];

		return pets.map((pet) => ({
			id: pet.id,
			nama_hewan: pet.petName ?? pet.nama_hewan ?? '-',
			nama_pemilik: ownerName,
		}));
	});
};

const mapJenisVaksinOptions = (jenisVaksinData) => {
	return normalizeRows(jenisVaksinData)
		.map((item) => ({
			id: item.id ?? item.id_vaksinasi ?? item.id_vaksin ?? item.vaksin_id ?? null,
			nama_vaksin: item.nama_vaksin ?? '-',
		}))
		.filter((item) => item.id !== null && item.id !== undefined);
};

const toISODateOnly = (value) => {
	if (!value) return '';

	const raw = String(value).trim();
	const directMatch = raw.match(/^(\d{4}-\d{2}-\d{2})/);
	if (directMatch) {
		return directMatch[1];
	}

	const indoDateMatch = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
	if (indoDateMatch) {
		const [, dd, mm, yyyy] = indoDateMatch;
		return `${yyyy}-${mm}-${dd}`;
	}

	const parsed = new Date(raw);
	if (Number.isNaN(parsed.getTime())) return '';

	const year = parsed.getFullYear();
	const month = String(parsed.getMonth() + 1).padStart(2, '0');
	const day = String(parsed.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const getReminderHewanId = (reminder) => {
	return String(
		reminder?.hewanId ??
		reminder?.id_hewan ??
		reminder?.hewan?.id_hewan ??
		reminder?.hewan?.id ??
		''
	);
};

const getReminderVaksinId = (reminder) => {
	return String(
		reminder?.vaksinId ??
		reminder?.id_jenis_vaksin ??
		reminder?.jenisVaksin?.id_vaksinasi ??
		reminder?.jenisVaksin?.id ??
		''
	);
};

export default function EditReminderModal({ isOpen, onClose, reminder, onSave, isSubmitting = false }) {
	const [formData, setFormData] = useState(INITIAL_FORM_DATA);
	const [hewanOptions, setHewanOptions] = useState([]);
	const [jenisVaksinOptions, setJenisVaksinOptions] = useState([]);
	const [isLoadingOptions, setIsLoadingOptions] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

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
				console.error('Error fetching edit reminder options:', error);
				setHewanOptions([]);
				setJenisVaksinOptions([]);
			} finally {
				setIsLoadingOptions(false);
			}
		};

		fetchOptions();
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen || !reminder) {
			setFormData(INITIAL_FORM_DATA);
			setShowSuccess(false);
			return;
		}

		const fallbackHewanOption = hewanOptions.find((item) => item.nama_hewan === reminder.petName);
		const fallbackVaksinOption = jenisVaksinOptions.find((item) => item.nama_vaksin === reminder.vaccinationType);

		setFormData({
			id_hewan: getReminderHewanId(reminder) || String(fallbackHewanOption?.id ?? ''),
			id_jenis_vaksin: getReminderVaksinId(reminder) || String(fallbackVaksinOption?.id ?? ''),
			tanggal_vaksin: toISODateOnly(
				reminder.nextVaccinationDateRaw ??
				reminder.tanggal_vaksin ??
				reminder.nextVaccinationDate
			),
		});
		setShowSuccess(false);
	}, [isOpen, reminder, hewanOptions, jenisVaksinOptions]);

	if (!isOpen || !reminder) return null;

	const handleSubmit = async (event) => {
		event.preventDefault();
		setShowSuccess(false);

		try {
			await onSave(reminder.reminderId, formData);
			setShowSuccess(true);

			setTimeout(() => {
				setShowSuccess(false);
				onClose();
			}, 1200);
		} catch (error) {
			console.error('Error updating reminder vaksinasi:', error);
			alert(`Gagal memperbarui reminder vaksinasi: ${error?.response?.data?.message || error?.message || ''}`.trim());
		}
	};

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="Edit Reminder"
			description="Perbarui data reminder vaksinasi"
			maxWidth="max-w-lg"
		>
			<form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-2">
				<ReminderPetAndVaccineFields
					hewanValue={formData.id_hewan}
					vaksinValue={formData.id_jenis_vaksin}
					hewanOptions={hewanOptions}
					jenisVaksinOptions={jenisVaksinOptions}
					onHewanChange={(value) => setFormData((prev) => ({ ...prev, id_hewan: value }))}
					onVaksinChange={(value) => setFormData((prev) => ({ ...prev, id_jenis_vaksin: value }))}
					isLoadingOptions={isLoadingOptions}
					isSubmitting={isSubmitting}
				/>

				<div>
					<label className="block text-h-8 font-bold text-accent-neutral-1000">Jadwal Vaksin Berikutnya</label>
					<input
						type="date"
						value={formData.tanggal_vaksin}
						onChange={(e) => setFormData((prev) => ({ ...prev, tanggal_vaksin: e.target.value }))}
						min={new Date().toISOString().split('T')[0]}
						className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2"
						required
						disabled={isSubmitting}
					/>
				</div>

				<div className="flex justify-end space-x-3 pt-3">
					<button
						type="button"
						onClick={onClose}
						className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
						disabled={isSubmitting}
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className="px-6 py-2 bg-accent-blue-400 text-white rounded-lg hover:bg-accent-blue-500 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
					</button>
				</div>
			</form>
			<SuccessToast show={showSuccess} />
		</BaseModal>
	);
}
