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
  Selesai: { 
    text: 'text-accent-green-450', 
    bg: 'bg-accent-green-50' 
  },
  Terkirim: { 
    text: 'text-[#1447E6]', 
    bg: 'bg-[#DBEAFE]' 
  },
  Terlewat: { 
    text: 'text-[#C10007]', 
    bg: 'bg-[#FFE2E2]' 
  },
  Dijadwalkan: { 
    text: 'text-[#A65F00]', 
    bg: 'bg-[#FEF9C2]' 
  },
};

export const NEXT_DATE_URGENCY_CLASS = {
  overdue: {
    date: 'text-accent-red-400',
    hint: 'text-accent-red-400',
  },
  'very-soon': {
    date: 'text-accent-neutral-1000',
    hint: 'text-[#FF6900]',
  },
  soon: {
    date: 'text-accent-neutral-1000',   
    hint: 'text-[#F0B100]',
  },
  normal: {
    date: 'text-accent-neutral-1000',
    hint: 'text-accent-neutral-600',
  },
};

export const UI_STATUS_ROTATION = ['Selesai', 'Terkirim', 'Terlewat', 'Dijadwalkan'];