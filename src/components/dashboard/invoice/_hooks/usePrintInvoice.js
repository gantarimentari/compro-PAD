import { useState } from 'react';
import InvoiceService from '@/lib/services/invoiceService';

const clinicSettingsCache = {
  data: null,
  loaded: false,
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

export const usePrintInvoice = () => {
  const [isPrinting, setIsPrinting] = useState(false);

  const loadClinicSettings = async () => {
    if (clinicSettingsCache.loaded) {
      return clinicSettingsCache.data;
    }

    try {
      const response = await fetch('/api/footer-settings');
      if (!response.ok) {
        throw new Error('Gagal mengambil data klinik');
      }

      const data = await response.json();
      clinicSettingsCache.data = {
        clinicName: data.clinicName ?? data.clinic_name ?? 'KLINIK DOKTER HEWAN FANINA',
        address: data.address ?? '-',
        operatingHours: data.operatingHours ?? data.operating_hours ?? '-',
        phone: data.phoneDisplay ?? data.phone ?? '-',
        email: data.email ?? '-',
      };
      clinicSettingsCache.loaded = true;
      return clinicSettingsCache.data;
    } catch (error) {
      console.warn('Gagal memuat data klinik untuk invoice:', error);
      clinicSettingsCache.data = {
        clinicName: 'KLINIK DOKTER HEWAN FANINA',
        address: '-',
        operatingHours: '-',
        phone: '-',
        email: '-',
      };
      clinicSettingsCache.loaded = true;
      return clinicSettingsCache.data;
    }
  };

  const handlePrintInvoice = async (invoice) => {
    if (typeof window === 'undefined' || !invoice) return;
    setIsPrinting(true);

    try {
      const invoiceId = invoice.id_invoice ?? invoice.id;
      let fullInvoice = invoice;

      // Load latest data from API to ensure details and relationships are complete
      try {
        const detailResponse = invoiceId ? await InvoiceService.getById(invoiceId) : invoice;
        const rawData = detailResponse?.data ?? detailResponse ?? invoice;
        fullInvoice = normalizeInvoice(rawData);
      } catch (err) {
        console.warn('Gagal memuat detail invoice dari server, menggunakan data lokal:', err);
      }

      // Fetch the HTML template from the server
      const response = await fetch('/api/invoice/template');
      if (!response.ok) {
        throw new Error('Gagal mengambil template invoice');
      }
      const data = await response.json();
      let html = data.html;
      const logoBase64 = data.logo || '';
      const clinicSettings = await loadClinicSettings();

      // Format items
      const items = Array.isArray(fullInvoice.details) ? fullInvoice.details : [];
      const itemRows = items
        .map((item, idx) => {
          const qty = Number(item.qty ?? item.quantity ?? 1);
          const price = Number(item.harga_satuan ?? item.harga ?? 0);
          const itemSubtotal = qty * price;

          return `
            <tr>
              <td class="text-center">${idx + 1}</td>
              <td>
                <span class="item-desc">${item.nama_item ?? '-'}</span>
                
              </td>
              <td class="text-center">${qty}</td>
              <td class="text-right">${currencyFormat(price)}</td>
              <td class="text-right">${currencyFormat(itemSubtotal)}</td>
            </tr>
          `;
        })
        .join('');

      const finalItemRows = itemRows || '<tr><td colspan="5" class="text-center">Tidak ada item layanan/produk</td></tr>';

      // // Status Styling
      // const statusClass = String(fullInvoice.status || '').toLowerCase() === 'lunas'
      //   ? 'status-lunas'
      //   : 'status-belum-lunas';
      // const statusLabel = String(fullInvoice.status || '').toLowerCase() === 'lunas'
      //   ? 'Lunas'
      //   : 'Belum Bayar';

      // Totals
      const subtotalVal = Number(fullInvoice.subtotal || 0);
      const diskonPersen = Number(fullInvoice.diskon_persen || 0);
      const diskonNominal = Number(fullInvoice.diskon_nominal || (subtotalVal * diskonPersen) / 100);

      const afterDiscount = subtotalVal - diskonNominal;
      const pajakPersen = Number(fullInvoice.pajak_persen || 0);
      const pajakNominal = Number(fullInvoice.pajak_nominal || (afterDiscount * pajakPersen) / 100);

      const totalVal = Number(fullInvoice.total || afterDiscount + pajakNominal);

      let diskonSection = '';
      if (diskonPersen > 0) {
        diskonSection = `
          <div class="total-row">
            <span>Diskon (${diskonPersen}%)</span>
            <span>-${currencyFormat(diskonNominal)}</span>
          </div>
        `;
      }

      let pajakSection = '';
      if (pajakPersen > 0) {
        pajakSection = `
          <div class="total-row">
            <span>Pajak (${pajakPersen}%)</span>
            <span>+${currencyFormat(pajakNominal)}</span>
          </div>
        `;
      }

      // Safe fields
      const patientName = fullInvoice.pasien?.name || fullInvoice.pasien?.username || '-';
      const patientPhone = fullInvoice.pasien?.phone_number || fullInvoice.pasien?.phone || '-';
      const patientEmail = fullInvoice.pasien?.email || '-';
      const petName = fullInvoice.hewan?.nama_hewan || fullInvoice.hewan?.petName || '-';
      const petBreed = fullInvoice.hewan?.jenis_hewan?.nama_jenis || fullInvoice.hewan?.jenis_hewan || '-';

      // Replace placeholders
      html = html
        .replace(/{{kode_invoice}}/g, fullInvoice.kode_invoice)
        .replace(/{{tanggal_invoice}}/g, dateFormat(fullInvoice.tanggal_invoice))
        .replace(/{{jatuh_tempo}}/g, dateFormat(fullInvoice.jatuh_tempo) || '-')
        // .replace(/{{status_class}}/g, statusClass)
        // .replace(/{{status_label}}/g, statusLabel)
        .replace(/{{pasien_name}}/g, patientName)
        .replace(/{{pasien_phone}}/g, patientPhone)
        .replace(/{{pasien_email}}/g, patientEmail)
        .replace(/{{hewan_name}}/g, petName)
        .replace(/{{hewan_jenis}}/g, petBreed)
        .replace(/{{clinic_name}}/g, clinicSettings?.clinicName || 'KLINIK DOKTER HEWAN FANINA')
        .replace(/{{clinic_address}}/g, clinicSettings?.address || '-')
        .replace(/{{clinic_phone}}/g, clinicSettings?.phone || '-')
        .replace(/{{clinic_email}}/g, clinicSettings?.email || '-')
        .replace(/{{clinic_hours}}/g, clinicSettings?.operatingHours || '-')
        .replace(/{{logo_base64}}/g, logoBase64)
        .replace(/{{item_rows}}/g, finalItemRows)
        .replace(/{{subtotal}}/g, currencyFormat(subtotalVal))
        .replace(/{{diskon_section}}/g, diskonSection)
        .replace(/{{pajak_section}}/g, pajakSection)
        .replace(/{{total}}/g, currencyFormat(totalVal))
        .replace(/{{catatan}}/g, fullInvoice.catatan || 'Terima kasih atas kunjungan Anda.');

      // Create a temporary container styled behind page content to prevent it rendering blank
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '0';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      tempDiv.style.zIndex = '-9999';
      tempDiv.style.opacity = '1';
      tempDiv.style.pointerEvents = 'none';
      tempDiv.innerHTML = html;
      document.body.appendChild(tempDiv);

      // Load html2pdf dynamically to avoid build-time issues on SSR
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;

      // Wait for fonts to load and style calculations to settle
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Invoice_${String(fullInvoice.kode_invoice || 'invoice').replace(/\//g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      // Target the styled invoice container specifically to render styles cleanly
      const targetElement = tempDiv.querySelector('#invoice-content') || tempDiv;

      // Generate & Download PDF
      await html2pdf().from(targetElement).set(opt).save();

      // Clean up the temporary DOM element
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal mengunduh PDF invoice: ' + error.message);
    } finally {
      setIsPrinting(false);
    }
  };

  return {
    handlePrintInvoice,
    isPrinting,
  };
};
