import { UI_STATUS_ROTATION } from './reminderVaksinasi.constants';

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
    const latestVaccinationRawDate = item?.tanggal_vaksin ? new Date(item.tanggal_vaksin) : null;
    const hasValidLatestDate = latestVaccinationRawDate && !Number.isNaN(latestVaccinationRawDate.getTime());
    const nextVaccinationRawDate = hasValidLatestDate && intervalMonths > 0
      ? addMonthsToDate(latestVaccinationRawDate, intervalMonths)
      : null;
    const nextVaccinationDayDiff = getDayDiff(nextVaccinationRawDate);
    const nextVaccinationUrgency = getUrgencyLevel(nextVaccinationDayDiff);

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
      status: UI_STATUS_ROTATION[index % UI_STATUS_ROTATION.length],
    };
  });
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