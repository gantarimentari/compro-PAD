export const NOTIFICATION_COLUMNS =[
  {key: 'recipient', header: 'Recipient'},
  {key: 'channel', header: 'Channel'},
  {key: 'sentAt', header: 'Waktu Kirim'},
  {key: 'type', header: 'Tipe'},
  {key: 'status', header: 'Status Kirim'},
  {key: 'actions', header: 'Aksi', isAction: true},
];

export const NOTIFICATION_TYPE_BADGE_CLASS = {
  Vaksinasi: {
    text: 'text-[#8200DB]',
    bg: 'bg-[#F3E8FF]',
  },
  Reservasi: {
    text: 'text-[#1447E6]',
    bg: 'bg-[#DBEAFE]',
  }

};
export const NOTIFICATION_STATUS_BADGE_CLASS = {
  Sukses: {
    text: 'text-accent-green-450', 
    bg: 'bg-accent-green-50'
  },
  Pending: {
    text: 'text-[#A65F00]', 
    bg: 'bg-[#FEF9C2]' 
  },
  Gagal: {
    text: 'text-[#C10007]', 
    bg: 'bg-[#FFE2E2]'
  }
};