export const FAQ_COLUMNS = [
  { key: 'question', header: 'judul FAQ', className: 'max-w-xs truncate' },
  { key: 'answer', header: 'Deskripsi', className: 'max-w-sm truncate' },
  { key: 'status', header: 'Status' },
  { key: 'created_at', header: 'Tanggal Ditambahkan' },
  { key: 'actions', header: 'Aksi', isAction: true },
];

export const FAQ_STATUS_BADGE_CLASS = {
  Publish: {
    text: 'text-accent-green-450', 
    bg: 'bg-accent-green-50'
  },
  Draft: {
    text: 'text-[#A65F00]', 
    bg: 'bg-[#FEF9C2]' 
  },
};