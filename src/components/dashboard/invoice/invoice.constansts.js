export const STATUS =[
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
    bg: 'bg-accent-green-50' 
  },
  BelumLunas: { 
    text: 'text-[#1447E6]', 
    bg: 'bg-[#DBEAFE]' 
  },
  
};

// Default export for compatibility with InvoiceDashboard import
export default COLUMN;
