"use client";

import { useInvoice } from '@/components/dashboard/invoice/_hooks/useInvoice';
import TambahInvoiceModals from '@/components/dashboard/invoice/modals/TambahInvoiceModals';
import { AddIcon, WarningIcon, PenIcon, PrinterIcon, TrashIcon } from '@/components/icons';
import PageHeader from '@/components/shared/PageHeader';
import SearchBar from '@/components/shared/ManagementSearch';
import Table from '@/components/shared/Table';
import COLUMNS, { STATUS_BADGE_CLASS } from './invoice.constansts';

const currencyFormat = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const dateFormat = (value) => {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};



const renderStatusBadge = (status) => {
  const normalizedStatus = String(status || '').toLowerCase();

  if (normalizedStatus === 'lunas') {
    return 'bg-emerald-100 text-emerald-700';
  }

  return 'bg-amber-100 text-amber-700';
};

export default function InvoiceDashboard() {
  const {
    isModalOpen,
    openModal,
    closeModal,
    formData,
    setFormData,
    handleSave,
    invoices,
    searchQuery,
    handleSearchChange,
    handleConfirmPayment,
    handleDeleteInvoice,
    handlePrintInvoice,
    handleEditInvoice,
    isLoading,
    isRefreshing,
    isSubmitting,
    isDeleting,
    isConfirming,
    isEditing,
    stats,
  } = useInvoice();

  const renderCell = (item, key) => {
    switch (key) {
      case 'kode_invoice':
        return item.kode_invoice;
      case 'tanggal':
        return (
          <div>
            <div className="font-medium text-slate-900">{dateFormat(item.tanggal_invoice)}</div>
            <div className="text-xs text-slate-500">Due: {dateFormat(item.jatuh_tempo)}</div>
          </div>
        );
      case 'pemilik':
        return (
          <div>
            <div className="font-medium text-slate-900">{item.pasien?.username || item.pasien?.name || '-'}</div>
            <div className="text-xs text-slate-500">{item.hewan?.nama_hewan || item.hewan?.petName || '-'}</div>
          </div>
        );
      case 'items':
        return `${item.details_count ?? item.details?.length ?? 0} item`;
      case 'total':
        return (
          <div>
            <div className="font-medium text-slate-900">{currencyFormat(item.total)}</div>
            {Number(item.diskon_persen || 0) > 0 ? <div className="text-xs text-rose-500">Diskon {Number(item.diskon_persen)}%</div> : null}
          </div>
        );
      case 'status':
        return (
          <span className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${renderStatusBadge(item.status)}`}>
            {String(item.status || '').toLowerCase() === 'lunas' ? 'Lunas' : 'Belum Bayar'}
          </span>
        );
      case 'actions':
        return (
          <div className="flex flex-wrap items-center gap-2">
            {String(item.status || '').toLowerCase() !== 'lunas' ? (
              <button
                type="button"
                onClick={() => handleConfirmPayment(item.id_invoice)}
                className="inline-flex h-8 items-center rounded-lg bg-cyan-600 px-3 text-xs font-semibold text-white transition hover:bg-cyan-700"
              >
                Bayar
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => handleEditInvoice(item)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-white transition hover:bg-amber-500"
              title="Edit invoice"
            >
              <PenIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteInvoice(item.id_invoice)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-white transition hover:bg-rose-600"
              title="Hapus invoice"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              // onClick={() => handlePrintInvoice(item)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700"
              title="Detail invoice"
            >
              <WarningIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handlePrintInvoice(item)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-900 transition hover:bg-slate-50"
              title="Cetak invoice"
            >
              <PrinterIcon className="h-4 w-4" />
            </button>
          </div>
        );
      default:
        return item[key] || '-';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoice & Pembayaran"
        description="Kelola tagihan dan pembayaran layanan klinik"
        addButtonText="Buat Invoice"
        onAddClick={openModal}
      />

      <div className="space-y-4 pb-32">
        <div className="flex flex-col gap-3 justify-start">
          <div>
            <SearchBar
              placeholderText="Cari nomor invoice, pemilik, atau hewan..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {isLoading ? (
            <div className="rounded-lg bg-white p-6 text-center text-sm text-slate-500 shadow-xl">
              Memuat invoice...
            </div>
          ) : (
            <Table columns={COLUMNS} data={invoices} renderCell={renderCell} />
          )}

          {isRefreshing ? <p className="text-xs text-slate-400">Memperbarui data...</p> : null}
        </div>
      </div>

      <TambahInvoiceModals
        editingData={isEditing}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        isSubmitting={isSubmitting}
        formData={formData}
        setFormData={setFormData}
      />

      {(isDeleting || isConfirming) ? (
        <div className="fixed bottom-5 right-5 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          {isConfirming ? 'Memproses pembayaran...' : 'Menghapus invoice...'}
        </div>
      ) : null}
    </div>
  );
}