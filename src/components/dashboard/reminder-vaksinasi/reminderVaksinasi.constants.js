export const REMINDER_QUERY_KEY = ['reminder-vaksinasi-list'];

export const STATUS_FILTER_OPTIONS = [
  'Semua Status',
  'Selesai',
  'Terkirim',
  'Terlewat',
  'Dijadwalkan',
];

export const VACCINATION_COLUMNS = [
  { key: 'petName', header: 'Hewan' },
  { key: 'ownerName', header: 'Pemilik ' },
  { key: 'vaccinationType', header: 'Jenis Vaksin' },
  { key: 'latestVaccinationDate', header: 'Vaksinasi Terakhir' },
  { key: 'nextVaccinationDate', header: 'Jadwal Berikutnya' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

export const STATUS_BADGE_CLASS = {
  Selesai: 'bg-accent-green-50 text-accent-green-450',
  Terkirim: 'bg-accent-blue-50 text-accent-blue-400',
  Terlewat: 'bg-accent-red-50 text-accent-red-450',
  Dijadwalkan: 'bg-accent-yellow-50 text-[#B8860B]',
};

export const NEXT_DATE_URGENCY_CLASS = {
  overdue: {
    date: 'text-accent-red-450',
    hint: 'text-accent-red-450',
  },
  'very-soon': {
    date: 'text-[#F54900]',
    hint: 'text-[#F54900]',
  },
  soon: {
    date: 'text-[#B8860B]',   
    hint: 'text-[#B8860B]',
  },
  normal: {
    date: 'text-accent-neutral-1000',
    hint: 'text-accent-neutral-500',
  },
};

export const UI_STATUS_ROTATION = ['Selesai', 'Terkirim', 'Terlewat', 'Dijadwalkan'];