import { STATUS_BADGE_CLASS } from './reminderVaksinasi.constants';

/**
 * @typedef {Object} ReminderTableRow
 * @property {string|number} id
 * @property {string|number|null} reminderId
 * @property {string} petName
 * @property {string} species
 * @property {string} ownerName
 * @property {string} ownerPhone
 * @property {string} vaccinationType
 * @property {number|string} vaccineInterval
 * @property {string} latestVaccinationDate
 * @property {string} nextVaccinationDate
 * @property {string} nextVaccinationHint
 * @property {'overdue'|'very-soon'|'soon'|'normal'} nextVaccinationUrgency
 * @property {'Selesai'|'Terkirim'|'Terlewat'|'Dijadwalkan'} status
 */

export const normalizeRows = (rawData) => {
  if (Array.isArray(rawData)) return rawData;
  if (Array.isArray(rawData?.data)) return rawData.data;
  return [];
};

export const formatDateID = (value) =>
  value.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const addMonthsToDate = (dateValue, monthInterval) => {
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return null;

  const result = new Date(parsedDate);
  result.setMonth(result.getMonth() + monthInterval);
  return result;
};

export const getDayDiff = (targetDate) => {
  if (!targetDate) return null;

  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  return Math.ceil((startTarget - startToday) / (1000 * 60 * 60 * 24));
};

export const getUrgencyLevel = (dayDiff) => {
  if (dayDiff === null) return 'normal';
  if (dayDiff < 0) return 'overdue';
  if (dayDiff <= 1) return 'very-soon';
  if (dayDiff < 14) return 'soon';
  return 'normal';
};

export const getNextDateHint = (nextDate) => {
  const dayDiff = getDayDiff(nextDate);

  if (dayDiff === null) return '-';
  if (dayDiff === 0) return 'Hari ini';
  if (dayDiff > 0) return `${dayDiff} hari lagi`;
  return `Terlewat ${Math.abs(dayDiff)} hari`;
};

export const buildHewanMetaMap = (rawHewan) => {
  const groupedHewan = normalizeRows(rawHewan);

  return new Map(
    groupedHewan.flatMap((owner) => {
      const ownerName = owner?.name ?? owner?.username ?? '-';
      const ownerPhone = owner?.phone_number ?? owner?.phone ?? '-';
      const pets = Array.isArray(owner?.pets) ? owner.pets : [];

      return pets.map((pet) => [
        String(pet?.id),
        {
          speciesName: pet?.speciesName ?? '-',
          ownerName,
          ownerPhone,
        },
      ]);
    })
  );
};

export const buildVaksinMap = (rawJenisVaksin) => {
  const vaksinRows = normalizeRows(rawJenisVaksin);

  return new Map(
    vaksinRows.map((item) => [
      String(item?.id_vaksinasi ?? item?.id ?? item?.id_vaksin ?? item?.vaksin_id),
      {
        namaVaksin: item?.nama_vaksin ?? '-',
        interval: item?.interval ?? '-',
      },
    ])
  );
};

export const mapReminderRows = (rawReminder, hewanMetaMap, vaksinMap) => {
  const reminderRows = normalizeRows(rawReminder);

  return reminderRows.map((item, index) => {
    const hewanId = String(item?.id_hewan ?? item?.hewan?.id_hewan ?? item?.hewan?.id ?? '');
    const vaksinId = String(item?.id_jenis_vaksin ?? '');
    const reminderId = item?.id_vaksinasi ?? item?.id ?? null;
    const hewanMeta = hewanMetaMap.get(hewanId);
    const vaksinMeta = vaksinMap.get(vaksinId);
    const ownerFromReminder = item?.hewan?.pasien;
    const intervalMonths = Number(vaksinMeta?.interval ?? 0);
    const latestVaccinationSource = item?.tanggal_vaksin_aktual ?? item?.tanggal_vaksin;
    const latestVaccinationRawDate = latestVaccinationSource ? new Date(latestVaccinationSource) : null;
    const hasValidLatestDate = latestVaccinationRawDate && !Number.isNaN(latestVaccinationRawDate.getTime());
    const persistedNextScheduleSource = item?.jadwal_vaksin_berikutnya ?? null;
    const persistedNextScheduleDate = persistedNextScheduleSource ? new Date(persistedNextScheduleSource) : null;
    const hasValidPersistedNextSchedule = persistedNextScheduleDate && !Number.isNaN(persistedNextScheduleDate.getTime());
    const nextVaccinationRawDate = hasValidPersistedNextSchedule
      ? persistedNextScheduleDate
      : (hasValidLatestDate && intervalMonths > 0 ? addMonthsToDate(latestVaccinationRawDate, intervalMonths) : null);
    const nextVaccinationDayDiff = getDayDiff(nextVaccinationRawDate);
    const nextVaccinationUrgency = getUrgencyLevel(nextVaccinationDayDiff);
    const backendStatusRaw = item?.status ?? item?.status_reminder ?? item?.status_vaksinasi;
    const normalizedBackendStatus = typeof backendStatusRaw === 'string' ? backendStatusRaw.trim().toLowerCase() : '';
    const scheduleTypeRaw = item?.tipe_jadwal ?? item?.schedule_type;
    const normalizedScheduleType = typeof scheduleTypeRaw === 'string' ? scheduleTypeRaw.trim().toLowerCase() : '';
    const hasActualDate = Boolean(item?.tanggal_vaksin_aktual);

    let resolvedStatus = 'Dijadwalkan';
    if (normalizedBackendStatus === 'selesai') {
      resolvedStatus = 'Selesai';
    } else if (normalizedBackendStatus === 'terkirim') {
      resolvedStatus = 'Terkirim';
    } else if (normalizedBackendStatus === 'terlewat') {
      resolvedStatus = 'Terlewat';
    } else if (normalizedBackendStatus === 'dijadwalkan') {
      resolvedStatus = 'Dijadwalkan';
    } else if (normalizedScheduleType === 'final') {
      resolvedStatus = 'Selesai';
    } else if (normalizedScheduleType === 'automatic' || normalizedScheduleType === 'manual') {
      resolvedStatus = 'Dijadwalkan';
    } else if (hasActualDate && !hasValidPersistedNextSchedule) {
      resolvedStatus = 'Selesai';
    } else if (typeof backendStatusRaw === 'string' && STATUS_BADGE_CLASS[backendStatusRaw]) {
      resolvedStatus = backendStatusRaw;
    }

    return {
      id: reminderId ?? `${hewanId}-${index}`,
      reminderId,
      petName: item?.hewan?.nama_hewan ?? '-',
      species: hewanMeta?.speciesName ?? '-',
      ownerName: ownerFromReminder?.username ?? ownerFromReminder?.name ?? hewanMeta?.ownerName ?? '-',
      ownerPhone: ownerFromReminder?.phone_number ?? ownerFromReminder?.phone ?? hewanMeta?.ownerPhone ?? '-',
      vaccinationType: vaksinMeta?.namaVaksin ?? '-',
      vaccineInterval: vaksinMeta?.interval,
      latestVaccinationDate: hasValidLatestDate ? formatDateID(latestVaccinationRawDate) : '-',
      nextVaccinationDate: nextVaccinationRawDate ? formatDateID(nextVaccinationRawDate) : '-',
      nextVaccinationHint: getNextDateHint(nextVaccinationRawDate),
      nextVaccinationUrgency,
      status: resolvedStatus,
    };
  });
};

/**
 * Single adapter for FE internal contract.
 * Convert raw backend payloads into stable table rows consumed by UI.
 *
 * @param {unknown} rawReminder
 * @param {unknown} rawHewan
 * @param {unknown} rawJenisVaksin
 * @returns {ReminderTableRow[]}
 */
export const mapReminderTableData = (rawReminder, rawHewan, rawJenisVaksin) => {
  const hewanMetaMap = buildHewanMetaMap(rawHewan);
  const vaksinMap = buildVaksinMap(rawJenisVaksin);
  return mapReminderRows(rawReminder, hewanMetaMap, vaksinMap);
};

export const filterReminderRows = (rows, searchQuery, statusFilter) => {
  const searchValue = searchQuery.toLowerCase();

  return rows.filter((item) => {
    const matchesSearch =
      item.petName.toLowerCase().includes(searchValue) ||
      item.ownerName.toLowerCase().includes(searchValue) ||
      item.vaccinationType.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === 'Semua Status' ||
      item.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });
};