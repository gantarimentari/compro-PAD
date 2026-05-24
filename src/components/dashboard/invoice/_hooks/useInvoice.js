import { useEffect, useMemo, useState } from 'react';
import InvoiceService from '@/lib/services/invoiceService';

const defaultFormData = {
  id_pasien: '',
  id_hewan: '',
  tanggal_invoice: '',
  jatuh_tempo: '',
  item: [],
  diskon_persen: 0,
  pajak_persen: 0,
  status: 'belum_lunas',
  catatan: '',
};

const currencyFormat = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const dateFormat = (value) => {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const normalizeInvoice = (invoice) => {
  const details = Array.isArray(invoice?.details) ? invoice.details : [];

  return {
    id_invoice: invoice?.id_invoice ?? invoice?.id ?? null,
    kode_invoice: invoice?.kode_invoice ?? invoice?.invoice_number ?? '-',
    tanggal_invoice: invoice?.tanggal_invoice ?? '',
    jatuh_tempo: invoice?.jatuh_tempo ?? '',
    subtotal: Number(invoice?.subtotal ?? 0),
    diskon_persen: Number(invoice?.diskon_persen ?? 0),
    diskon_nominal: Number(invoice?.diskon_nominal ?? 0),
    pajak_persen: Number(invoice?.pajak_persen ?? 0),
    pajak_nominal: Number(invoice?.pajak_nominal ?? 0),
    total: Number(invoice?.total ?? 0),
    status: invoice?.status ?? 'belum_lunas',
    catatan: invoice?.catatan ?? '',
    pasien: invoice?.pasien ?? null,
    hewan: invoice?.hewan ?? null,
    details,
    details_count: Number(invoice?.details_count ?? details.length ?? 0),
  };
};

const normalizeRows = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

export const useInvoice = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadInvoices = async (silent = false) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await InvoiceService.getAll();
      const rows = normalizeRows(response).map(normalizeInvoice);
      setInvoices(rows);

      if (rows.length > 0 && !selectedInvoice) {
        setSelectedInvoice(rows[0]);
      }

      if (selectedInvoice) {
        const matchedInvoice = rows.find((item) => String(item.id_invoice) === String(selectedInvoice.id_invoice));
        setSelectedInvoice(matchedInvoice || rows[0] || null);
      }
    } catch (error) {
      console.error('Gagal memuat invoice:', error);
      setInvoices([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const resetFormData = () => {
    setFormData(defaultFormData);
    setIsEditing(false);
  };

  const openModal = () => {
    resetFormData();
    setIsModalOpen(true);
  };

  const handleEditInvoice = async (invoice) => {
    if (!invoice) return;

    setIsEditing(true);
    setIsModalOpen(true);

    try {
      const invoiceId = invoice.id_invoice ?? invoice.id;
      const detailResponse = invoiceId ? await InvoiceService.getById(invoiceId) : invoice;
      const invoiceDetail = detailResponse?.data ?? detailResponse ?? invoice;
      const details = Array.isArray(invoiceDetail?.details) ? invoiceDetail.details : [];

      setFormData({
        id_pasien: invoiceDetail?.pasien?.id ?? invoiceDetail?.id_pasien ?? '',
        id_hewan: invoiceDetail?.hewan?.id_hewan ?? invoiceDetail?.id_hewan ?? '',
        tanggal_invoice: invoiceDetail?.tanggal_invoice ?? '',
        jatuh_tempo: invoiceDetail?.jatuh_tempo ?? '',
        item: details.map((d) => ({
          id: d.id ?? `${Date.now()}-${Math.random()}`,
          id_jenis_vaksin: null,
          nama_item: d.nama_item,
          kategori: d.kategori ?? '',
          qty: d.qty ?? d.quantity ?? 1,
          harga_satuan: d.harga_satuan ?? d.harga ?? 0,
        })),
        diskon_persen: invoiceDetail?.diskon_persen ?? 0,
        pajak_persen: invoiceDetail?.pajak_persen ?? 0,
        status: invoiceDetail?.status ?? 'belum_lunas',
        catatan: invoiceDetail?.catatan ?? '',
      });
    } catch (error) {
      console.error('Gagal memuat detail invoice untuk edit:', error);
      alert(error?.response?.data?.message || error?.message || 'Gagal memuat detail invoice');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetFormData();
  };

  const handleSave = async (payload) => {
    setIsSubmitting(true);

    try {
      await InvoiceService.create(payload);
      await loadInvoices(true);
      closeModal();
    } catch (error) {
      console.error('Gagal menyimpan invoice:', error);
      alert(error?.response?.data?.message || error?.message || 'Gagal menyimpan invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleConfirmPayment = async (invoiceId) => {
    if (!invoiceId) return;

    const confirmed = window.confirm('Tandai invoice ini sebagai lunas?');
    if (!confirmed) return;

    setIsConfirming(true);

    try {
      await InvoiceService.confirmPayment(invoiceId);
      await loadInvoices(true);
    } catch (error) {
      console.error('Gagal mengonfirmasi pembayaran invoice:', error);
      alert(error?.response?.data?.message || error?.message || 'Gagal mengonfirmasi pembayaran invoice');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!invoiceId) return;

    const confirmed = window.confirm('Hapus invoice ini? Tindakan ini tidak bisa dibatalkan.');
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await InvoiceService.delete(invoiceId);
      await loadInvoices(true);

      if (selectedInvoice?.id_invoice && String(selectedInvoice.id_invoice) === String(invoiceId)) {
        setSelectedInvoice(null);
      }
    } catch (error) {
      console.error('Gagal menghapus invoice:', error);
      alert(error?.response?.data?.message || error?.message || 'Gagal menghapus invoice');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrintInvoice = (invoice) => {
    if (typeof window === 'undefined' || !invoice) return;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    const items = Array.isArray(invoice.details) ? invoice.details : [];
    const itemRows = items
      .map(
        (item) => `
          <tr>
            <td>${item.nama_item ?? '-'}</td>
            <td>${item.qty ?? 0}</td>
            <td>${currencyFormat(item.harga_satuan ?? 0)}</td>
            <td>${currencyFormat(item.subtotal ?? 0)}</td>
          </tr>
        `
      )
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>${invoice.kode_invoice}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
            h1 { margin: 0 0 8px; }
            .muted { color: #6b7280; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
            th { background: #f9fafb; }
            .summary { margin-top: 20px; display: grid; gap: 8px; max-width: 320px; }
          </style>
        </head>
        <body>
          <h1>${invoice.kode_invoice}</h1>
          <div class="muted">${invoice.pasien?.username ?? '-'} / ${invoice.hewan?.nama_hewan ?? '-'}</div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Harga</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows || '<tr><td colspan="4">Tidak ada item</td></tr>'}
            </tbody>
          </table>
          <div class="summary">
            <div><strong>Total:</strong> ${currencyFormat(invoice.total)}</div>
            <div><strong>Status:</strong> ${invoice.status === 'lunas' ? 'Lunas' : 'Belum Bayar'}</div>
          </div>
          <script>window.onload = function(){ window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredInvoices = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return invoices;

    return invoices.filter((invoice) => {
      const searchValues = [
        invoice.kode_invoice,
        invoice.pasien?.username,
        invoice.pasien?.name,
        invoice.hewan?.nama_hewan,
        invoice.hewan?.petName,
        invoice.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchValues.includes(normalizedQuery);
    });
  }, [invoices, searchQuery]);

  const selectedInvoiceSummary = selectedInvoice
    ? {
        ...selectedInvoice,
        tanggalLabel: dateFormat(selectedInvoice.tanggal_invoice),
        jatuhTempoLabel: dateFormat(selectedInvoice.jatuh_tempo),
      }
    : null;

  const stats = useMemo(() => {
    const total = invoices.length;
    const lunas = invoices.filter((invoice) => invoice.status === 'lunas').length;
    const belumLunas = total - lunas;

    return {
      total,
      lunas,
      belumLunas,
    };
  }, [invoices]);

  return {
    isModalOpen,
    openModal: () => {
      resetFormData();
      setIsModalOpen(true);
    },
    closeModal: () => {
      setIsModalOpen(false);
      resetFormData();
    },
    formData,
    setFormData,
    resetFormData,
    invoices: filteredInvoices,
    rawInvoices: invoices,
    selectedInvoice: selectedInvoiceSummary,
    searchQuery,
    handleSearchChange,
    handleSelectInvoice,
    handleConfirmPayment,
    handleDeleteInvoice,
    handlePrintInvoice,
    handleEditInvoice,
    handleSave,
    isLoading,
    isEditing,
    isRefreshing,
    isSubmitting,
    isDeleting,
    isConfirming,
    stats,
  };

};
 