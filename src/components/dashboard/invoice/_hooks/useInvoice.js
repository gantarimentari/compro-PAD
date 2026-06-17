import { useEffect, useMemo, useState } from 'react';
import InvoiceService from '@/lib/services/invoiceService';
import { useCallback } from 'react';

const invoiceCache = {
  rows: null,
  selectedInvoiceId: null,
  loaded: false,
};

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
    tanggal_bayar: invoice?.tanggal_bayar ?? invoice?.tanggal_pembayaran ?? invoice?.paid_at ?? invoice?.dibayar_pada ?? '',
    metode_pembayaran: invoice?.metode_pembayaran ?? invoice?.payment_method ?? invoice?.paymentMethod ?? '',
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

const normalizeClinicSettings = (settings) => {
  if (!settings) return null;

  return {
    clinicName: settings.clinicName ?? settings.clinic_name ?? 'KLINIK DOKTER HEWAN FANINA',
    address: settings.address ?? '-',
    operatingHours: settings.operatingHours ?? settings.operating_hours ?? '-',
    phone: settings.phoneDisplay ?? settings.phone ?? '-',
    email: settings.email ?? '-',
  };
};

export const useInvoice = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState(() => invoiceCache.rows || []);
  const [selectedInvoice, setSelectedInvoice] = useState(() => {
    if (!invoiceCache.rows?.length) return null;

    if (!invoiceCache.selectedInvoiceId) return invoiceCache.rows[0] || null;

    return invoiceCache.rows.find((item) => String(item.id_invoice) === String(invoiceCache.selectedInvoiceId)) || invoiceCache.rows[0] || null;
  });
  const [isLoading, setIsLoading] = useState(() => !invoiceCache.loaded);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [invoiceToPay, setInvoiceToPay] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);

  const [successToast, setSuccessToast] = useState({ show: false, message: '' });
  const [errorToast, setErrorToast] = useState({ show: false, message: '' });

  const triggerSuccess = useCallback((message) => {
    setSuccessToast({ show: true, message });
    window.clearTimeout(triggerSuccess.timerId);
    triggerSuccess.timerId = window.setTimeout(() => {
      setSuccessToast({ show: false, message: '' });
    }, 2000);
  }, []);

  const triggerError = useCallback((message) => {
    setErrorToast({ show: true, message });
    window.clearTimeout(triggerError.timerId);
    triggerError.timerId = window.setTimeout(() => {
      setErrorToast({ show: false, message: '' });
    }, 3000);
  }, []);

  const syncInvoiceState = useCallback((rows) => {
    setInvoices(rows);
    invoiceCache.rows = rows;
    invoiceCache.loaded = true;

    setSelectedInvoice((prevSelectedInvoice) => {
      const nextSelectedInvoice = prevSelectedInvoice
        ? rows.find((item) => String(item.id_invoice) === String(prevSelectedInvoice.id_invoice)) || rows[0] || null
        : rows[0] || null;

      invoiceCache.selectedInvoiceId = nextSelectedInvoice?.id_invoice ?? null;
      return nextSelectedInvoice;
    });
  }, []);

  const loadInvoices = useCallback( async (silent = false) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await InvoiceService.getAll();
      const rows = normalizeRows(response).map(normalizeInvoice);
      syncInvoiceState(rows);
    } catch (error) {
      console.error('Gagal memuat invoice:', error);
      setInvoices([]);
      invoiceCache.rows = [];
      invoiceCache.selectedInvoiceId = null;
      invoiceCache.loaded = true;
      const errorMsg = error?.response?.data?.message || error?.message || 'Gagal memuat data invoice';
      triggerError(errorMsg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [syncInvoiceState, triggerError]);

  const loadInvoiceDetail = async (invoice) => {
    if (!invoice) return null;

    const invoiceId = invoice.id_invoice ?? invoice.id;
    if (!invoiceId) {
      return normalizeInvoice(invoice);
    }

    const response = await InvoiceService.getById(invoiceId);
    return normalizeInvoice(response?.data ?? response ?? invoice);
  };

  useEffect(() => {
    if (invoiceCache.loaded && Array.isArray(invoiceCache.rows)) {
      setInvoices(invoiceCache.rows);
      setSelectedInvoice(() => {
        const cachedSelectedInvoice = invoiceCache.selectedInvoiceId
          ? invoiceCache.rows.find((item) => String(item.id_invoice) === String(invoiceCache.selectedInvoiceId))
          : null;

        return cachedSelectedInvoice || invoiceCache.rows[0] || null;
      });
      setIsLoading(false);
      return;
    }

    loadInvoices();
  }, [loadInvoices]);

  const resetFormData = () => {
    setFormData(defaultFormData);
    setIsEditing(false);
    setInvoiceToEdit(null);
  };

  const openModal = () => {
    resetFormData();
    setIsModalOpen(true);
  };

  const openPaymentModal = (invoice) => {
    if (!invoice) return;

    setInvoiceToPay(invoice);
    setPaymentMethod('');
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setInvoiceToPay(null);
    setPaymentMethod('');
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleEditInvoice = async (invoice) => {
    if (!invoice) return;

    setInvoiceToEdit(invoice);
    setIsEditing(true);
    setIsDetailLoading(true);
    setIsModalOpen(true);

    try {
      const invoiceDetail = await loadInvoiceDetail(invoice);
      const details = Array.isArray(invoiceDetail?.details) ? invoiceDetail.details : [];

      setFormData({
        id_pasien: invoiceDetail?.pasien?.id ?? invoiceDetail?.id_pasien ?? '',
        id_hewan: invoiceDetail?.hewan?.id_hewan ?? invoiceDetail?.id_hewan ?? '',
        tanggal_invoice: formatDateForInput(invoiceDetail?.tanggal_invoice),
        jatuh_tempo: formatDateForInput(invoiceDetail?.jatuh_tempo),
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
        status: String(invoiceDetail?.status ?? 'belum_lunas')
          .toLowerCase()
          .replace(/\s+/g, '_'),
        catatan: invoiceDetail?.catatan ?? '',
      });
    } catch (error) {
      console.error('Gagal memuat detail invoice untuk edit:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Gagal memuat detail invoice';
      triggerError(errorMsg);
      closeModal();
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetFormData();
  };

  const handleSave = async (payload) => {
    setIsSubmitting(true);

    try {
      const invoiceId = invoiceToEdit?.id_invoice ?? invoiceToEdit?.id;
      // Normalize status to lowercase with underscores (e.g. "Belum Lunas" -> "belum_lunas")
      // to satisfy backend validation
      const cleanStatus = String(payload.status || '')
        .toLowerCase()
        .replace(/\s+/g, '_');

      const formattedPayload = {
        ...payload,
        status: cleanStatus,
      };

      if (isEditing && invoiceId) {
        await InvoiceService.update(invoiceId, formattedPayload);
        triggerSuccess('Invoice berhasil diperbarui');
      } else {
        await InvoiceService.create(formattedPayload);
        triggerSuccess('Invoice berhasil dibuat');
      }
      await loadInvoices(true);
      closeModal();
    } catch (error) {
      console.error('Gagal menyimpan invoice:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Gagal menyimpan invoice';
      triggerError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSearch = async (keyword) => {
    const trimmed = (keyword || '').trim();
    if (!trimmed) {
      loadInvoices(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await InvoiceService.search(trimmed);
      const rows = normalizeRows(response).map(normalizeInvoice);
      syncInvoiceState(rows);
    } catch (error) {
      console.error("Gagal search invoice:", error);
      syncInvoiceState([]);
      const errorMsg = error?.response?.data?.message || error?.message || 'Gagal mencari invoice';
      triggerError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  const openDeleteModal = (invoice) => {
    if (!invoice) return;

    setInvoiceToDelete(invoice);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setInvoiceToDelete(null);
  };

  const handleSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const openDetailModal = (invoice) => {
    if (!invoice) return;

    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);

    loadInvoiceDetail(invoice)
      .then((detailInvoice) => {
        if (!detailInvoice) return;

        setSelectedInvoice(detailInvoice);
        invoiceCache.selectedInvoiceId = detailInvoice.id_invoice ?? null;
      })
      .catch((error) => {
        console.warn('Gagal memuat detail invoice untuk modal, menggunakan data tabel:', error);
        setSelectedInvoice(invoice);
      });
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleConfirmPayment = (invoice) => {
    openPaymentModal(invoice);
  };

  const handleSubmitPayment = async () => {
    const invoiceId = invoiceToPay?.id_invoice ?? invoiceToPay?.id;
    if (!invoiceId) return;

    setIsConfirming(true);

    try {
      await InvoiceService.confirmPayment(invoiceId, {
        metode_pembayaran: paymentMethod,
      });
      triggerSuccess('Pembayaran berhasil dikonfirmasi');
      await loadInvoices(true);
      closePaymentModal();
    } catch (error) {
      console.error('Gagal mengonfirmasi pembayaran invoice:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Gagal mengonfirmasi pembayaran invoice';
      triggerError(errorMsg);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleDeleteInvoice = (invoice) => {
    openDeleteModal(invoice);
  };

  const handleConfirmDeleteInvoice = async () => {
    const invoiceId = invoiceToDelete?.id_invoice ?? invoiceToDelete?.id;
    if (!invoiceId) return;

    setIsDeleting(true);

    try {
      await InvoiceService.delete(invoiceId);
      triggerSuccess('Invoice berhasil dihapus');
      await loadInvoices(true);

      if (selectedInvoice?.id_invoice && String(selectedInvoice.id_invoice) === String(invoiceId)) {
        setSelectedInvoice(null);
      }

      closeDeleteModal();
    } catch (error) {
      console.error('Gagal menghapus invoice:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Gagal menghapus invoice';
      triggerError(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };


  const selectedInvoiceSummary = selectedInvoice
    ? {
      ...selectedInvoice,
      tanggalLabel: dateFormat(selectedInvoice.tanggal_invoice),
      jatuhTempoLabel: dateFormat(selectedInvoice.jatuh_tempo),
      // dibayarLabel: dateFormat(selectedInvoice.tanggal_pembayaran),
    }
    : null;

  const stats = useMemo(() => {
    const total = invoices.length;
    const lunas = invoices.filter((invoice) => String(invoice.status || '').toLowerCase() === 'lunas').length;
    const belumLunas = total - lunas;

    return {
      total,
      lunas,
      belumLunas,
    };
  }, [invoices]);



  return {
    isModalOpen,
    isDeleteModalOpen,
    isDetailModalOpen,
    isPaymentModalOpen,
    openModal: () => {
      resetFormData();
      setIsModalOpen(true);
    },
    closeDeleteModal,
    closeDetailModal,
    formatDateForInput,
    closePaymentModal,
    closeModal: () => {
      setIsModalOpen(false);
      resetFormData();
    },
    formData,
    setFormData,
    resetFormData,
    invoices,
    rawInvoices: invoices,
    selectedInvoice: selectedInvoiceSummary,
    searchQuery,
    handleSearchChange,
    handleSearch,
    handleSelectInvoice,
    openDetailModal,
    openPaymentModal,
    handleConfirmPayment,
    handleSubmitPayment,
    handleDeleteInvoice,
    handleConfirmDeleteInvoice,
    handleEditInvoice,
    handleSave,
    isLoading,
    isEditing,
    isRefreshing,
    isSubmitting,
    isDetailLoading,
    isDeleting,
    isConfirming,
    paymentMethod,
    setPaymentMethod,
    invoiceToPay,
    invoiceToDelete,
    stats,
    successToast,
    errorToast,
    triggerSuccess,
    triggerError,
  };

};
