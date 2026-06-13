export const STATUS = [
  'Lunas', 'Belum Lunas'
];

export const COLUMN = [
  { key: 'kode_invoice', header: 'No. Invoice' },
  { key: 'tanggal', header: 'Tanggal' },
  { key: 'pemilik', header: 'Pemilik / Hewan' },
  { key: 'items', header: 'Item' },
  { key: 'total', header: 'Total' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: 'Aksi', isAction: true },
];
export const STATUS_BADGE_CLASS = {
  Lunas: {
    text: 'text-accent-green-450',
    bg: 'bg-accent-green-50',

  },
  'belum lunas': {
    text: 'text-[#A65F00]',
    bg: 'bg-[#FEF9C2]',

  },

};
export const PAYMENT_OPTIONS = [
  { value: 'tunai', label: 'Tunai' },
  { value: 'transfer_bank', label: 'Transfer Bank' },
  { value: 'qris', label: 'QRIS' },
];

// Default export for compatibility with InvoiceDashboard import
export default COLUMN;
