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
 * @property {string|null} latestVaccinationDateRaw
 * @property {number} latestVaccinationCount
 * @property {string} latestVaccinationCountLabel
 * @property {string} nextVaccinationDate
 * @property {string|null} nextVaccinationDateRaw
 * @property {string} nextVaccinationHint
 * @property {'overdue'|'very-soon'|'soon'|'normal'} nextVaccinationUrgency
 * @property {'Selesai'|'Terkirim'|'Terlewat'|'Dijadwalkan'| 'Pending'} status
 * @property {boolean} reminderSent
 * @property {string} hewanId
 * @property {string} vaksinId
 * @property {string} performedBy
 * @property {string} notes
 * @property {'automatic'|'manual'|'final'|''} scheduleType
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

export const toISODateOnly = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

  const mappedRows = reminderRows.map((item, index) => {
    const hewanId = String(item?.id_hewan ?? item?.hewan?.id_hewan ?? item?.hewan?.id ?? '');
    const vaksinId = String(item?.id_jenis_vaksin ?? '');
    const reminderId = item?.id_vaksinasi ?? item?.id ?? null;
    const hewanMeta = hewanMetaMap.get(hewanId);
    const vaksinMeta = vaksinMap.get(vaksinId);
    const ownerFromReminder = item?.hewan?.pasien;
    const intervalMonths = Number(vaksinMeta?.interval ?? 0);
    const latestVaccinationSource = item?.tanggal_vaksin_aktual ?? null;
    const latestVaccinationRawDate = latestVaccinationSource ? new Date(latestVaccinationSource) : null;
    const hasValidLatestDate = latestVaccinationRawDate && !Number.isNaN(latestVaccinationRawDate.getTime());
    const plannedVaccinationSource = item?.tanggal_vaksin ?? null;
    const plannedVaccinationDate = plannedVaccinationSource ? new Date(plannedVaccinationSource) : null;
    const hasValidPlannedDate = plannedVaccinationDate && !Number.isNaN(plannedVaccinationDate.getTime());
    const persistedNextScheduleSource = item?.jadwal_vaksin_berikutnya ?? null;
    const persistedNextScheduleDate = persistedNextScheduleSource ? new Date(persistedNextScheduleSource) : null;
    const hasValidPersistedNextSchedule = persistedNextScheduleDate && !Number.isNaN(persistedNextScheduleDate.getTime());
    const backendStatusRaw = item?.status ?? item?.status_reminder ?? item?.status_vaksinasi;
    const normalizedBackendStatus = typeof backendStatusRaw === 'string' ? backendStatusRaw.trim().toLowerCase() : '';
    const scheduleTypeRaw = item?.tipe_jadwal ?? item?.schedule_type;
    const normalizedScheduleType = typeof scheduleTypeRaw === 'string' ? scheduleTypeRaw.trim().toLowerCase() : '';
    const hasActualDate = Boolean(item?.tanggal_vaksin_aktual);
    const reminderSent = Boolean(item?.reminder_sent ?? item?.reminderSent ?? false);

    let resolvedStatus = 'Dijadwalkan';
    if (normalizedBackendStatus === 'selesai') {
      resolvedStatus = 'Selesai';
    } else if (normalizedBackendStatus === 'terkirim' || reminderSent) {
      resolvedStatus = 'Terkirim';
    } else if (normalizedBackendStatus === 'terlewat') {
      resolvedStatus = 'Terlewat';
    } else if (normalizedBackendStatus === 'dijadwalkan') {
      resolvedStatus = 'Dijadwalkan';
    } else if (normalizedScheduleType === 'final') {
      resolvedStatus = 'Selesai';
    } else if (normalizedScheduleType === 'automatic' || normalizedScheduleType === 'manual') {
      resolvedStatus = 'Dijadwalkan';
    } else if (typeof backendStatusRaw === 'string' && STATUS_BADGE_CLASS[backendStatusRaw]) {
      resolvedStatus = backendStatusRaw;
    }

    // For active reminders, prioritize editable planned date so UI reflects reschedule/edit immediately.
    const nextVaccinationRawDate = normalizedScheduleType === 'final' || resolvedStatus === 'Selesai'
      ? null
      : (!hasActualDate && hasValidPlannedDate
          ? plannedVaccinationDate
          : (hasValidPersistedNextSchedule
              ? persistedNextScheduleDate
              : (hasValidLatestDate && intervalMonths > 0
                  ? addMonthsToDate(latestVaccinationRawDate, intervalMonths)
                  : null)));
    const nextVaccinationDayDiff = getDayDiff(nextVaccinationRawDate);
    const nextVaccinationUrgency = getUrgencyLevel(nextVaccinationDayDiff);
    const nextVaccinationHint = resolvedStatus === 'Selesai' ? '-' : getNextDateHint(nextVaccinationRawDate);

    if (resolvedStatus !== 'Selesai' && nextVaccinationDayDiff !== null && nextVaccinationDayDiff < 0) {
      resolvedStatus = 'Terlewat';
    }

    return {
      id: reminderId ?? `${hewanId}-${index}`,
      reminderId,
      hewanId,
      vaksinId,
      petName: item?.hewan?.nama_hewan ?? '-',
      species: hewanMeta?.speciesName ?? '-',
      ownerName: ownerFromReminder?.username ?? ownerFromReminder?.name ?? hewanMeta?.ownerName ?? '-',
      ownerPhone: ownerFromReminder?.phone_number ?? ownerFromReminder?.phone ?? hewanMeta?.ownerPhone ?? '-',
      vaccinationType: vaksinMeta?.namaVaksin ?? '-',
      vaccineInterval: vaksinMeta?.interval,
      latestVaccinationDate: hasValidLatestDate ? formatDateID(latestVaccinationRawDate) : '-',
      latestVaccinationDateRaw: hasValidLatestDate ? String(latestVaccinationSource) : null,
      latestVaccinationCount: 0,
      latestVaccinationCountLabel: '-',
      nextVaccinationDate: nextVaccinationRawDate ? formatDateID(nextVaccinationRawDate) : '-',
      nextVaccinationDateRaw: nextVaccinationRawDate
        ? (!hasActualDate && hasValidPlannedDate
            ? toISODateOnly(plannedVaccinationDate)
            : (hasValidPersistedNextSchedule ? persistedNextScheduleSource : toISODateOnly(nextVaccinationRawDate)))
        : null,
      nextVaccinationHint,
      nextVaccinationUrgency,
      status: resolvedStatus,
      reminderSent,
      performedBy: item?.dilakukan_oleh ?? '',
      notes: item?.catatan ?? '',
      scheduleType: ['automatic', 'manual', 'final'].includes(normalizedScheduleType) ? normalizedScheduleType : '',
    };
  });

  const groupedBySeries = new Map();
  mappedRows.forEach((row) => {
    const key = `${row.hewanId}-${row.vaksinId}`;
    if (!groupedBySeries.has(key)) {
      groupedBySeries.set(key, []);
    }
    groupedBySeries.get(key).push(row);
  });

  groupedBySeries.forEach((rowsInSeries) => {
    const completedRows = rowsInSeries
      .filter((row) => Boolean(row.latestVaccinationDateRaw))
      .sort((a, b) => {
        const aTime = new Date(a.latestVaccinationDateRaw).getTime();
        const bTime = new Date(b.latestVaccinationDateRaw).getTime();
        if (aTime === bTime) return String(a.reminderId).localeCompare(String(b.reminderId));
        return aTime - bTime;
      });

    completedRows.forEach((row, index) => {
      row.latestVaccinationCount = index + 1;
      row.latestVaccinationCountLabel = `#${index + 1} kali vaksin`;
    });
  });

  return mappedRows;
};

const getSeriesKey = (row) => `${row.hewanId}-${row.vaksinId}`;

const getComparableTime = (value) => {
  if (!value) return Number.NEGATIVE_INFINITY;

  const timeValue = new Date(value).getTime();
  return Number.isNaN(timeValue) ? Number.NEGATIVE_INFINITY : timeValue;
};

const getSeriesPriority = (row) => {
  const hasLatest = Boolean(row.latestVaccinationDateRaw);

  return {
    hasLatest,
    latestTime: getComparableTime(row.latestVaccinationDateRaw),
    nextTime: getComparableTime(row.nextVaccinationDateRaw),
    reminderTime: getComparableTime(row.nextVaccinationDateRaw ?? row.latestVaccinationDateRaw),
  };
};

const isBetterSeriesRow = (candidate, current) => {
  const candidatePriority = getSeriesPriority(candidate);
  const currentPriority = getSeriesPriority(current);

  if (candidatePriority.hasLatest !== currentPriority.hasLatest) {
    return candidatePriority.hasLatest;
  }

  if (candidatePriority.latestTime !== currentPriority.latestTime) {
    return candidatePriority.latestTime > currentPriority.latestTime;
  }

  if (candidatePriority.nextTime !== currentPriority.nextTime) {
    return candidatePriority.nextTime > currentPriority.nextTime;
  }

  if (candidatePriority.reminderTime !== currentPriority.reminderTime) {
    return candidatePriority.reminderTime > currentPriority.reminderTime;
  }

  return String(candidate.reminderId ?? candidate.id).localeCompare(String(current.reminderId ?? current.id)) > 0;
};

export const collapseReminderSeries = (rows) => {
  const groupedRows = new Map();

  rows.forEach((row) => {
    const seriesKey = getSeriesKey(row);
    const currentRow = groupedRows.get(seriesKey);

    if (!currentRow || isBetterSeriesRow(row, currentRow)) {
      groupedRows.set(seriesKey, row);
    }
  });

  return Array.from(groupedRows.entries()).map(([seriesKey, visibleRow]) => {
    const seriesRows = rows.filter((row) => getSeriesKey(row) === seriesKey);
    const completedRows = seriesRows
      .filter((row) => Boolean(row.latestVaccinationDateRaw))
      .sort((a, b) => getComparableTime(a.latestVaccinationDateRaw) - getComparableTime(b.latestVaccinationDateRaw));

    const activeRows = seriesRows
      .filter((row) => !row.latestVaccinationDateRaw && row.status !== 'Selesai')
      .sort((a, b) => {
        const aTime = getComparableTime(a.nextVaccinationDateRaw);
        const bTime = getComparableTime(b.nextVaccinationDateRaw);
        if (aTime !== bTime) return aTime - bTime;
        return String(a.reminderId ?? a.id).localeCompare(String(b.reminderId ?? b.id));
      });

    const latestCompletedRow = completedRows[completedRows.length - 1];
    const actionRow = activeRows[0] ?? latestCompletedRow ?? visibleRow;
    const latestRow = latestCompletedRow ?? actionRow;
    const nextScheduleRow = activeRows[0] ?? latestCompletedRow ?? actionRow;

    return {
      ...actionRow,
      latestVaccinationDate: latestRow.latestVaccinationDate,
      latestVaccinationDateRaw: latestRow.latestVaccinationDateRaw,
      latestVaccinationCount: completedRows.length,
      latestVaccinationCountLabel: completedRows.length > 0 ? `#${completedRows.length} kali vaksin` : '-',
      nextVaccinationDate: nextScheduleRow.nextVaccinationDate,
      nextVaccinationDateRaw: nextScheduleRow.nextVaccinationDateRaw,
      nextVaccinationHint: nextScheduleRow.nextVaccinationHint,
      nextVaccinationUrgency: nextScheduleRow.nextVaccinationUrgency,
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