'use client';

import React from 'react';
import { BaseModal } from '@/components/dashboard';
import { PrinterIcon } from '@/components/icons';

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatPaymentMethod = (method) => {
  if (!method) return '-';
  const mapping = {
    transfer_bank: 'Transfer Bank',
    qris: 'QRIS',
    tunai: 'Tunai',
  };
  return mapping[method.toLowerCase()] || method;
};

const getStatusStyle = (status) => {
  const normalized = String(status || '').toLowerCase();

  if (normalized === 'lunas') {
    return 'bg-emerald-100 text-emerald-700';
  }

  return 'bg-amber-100 text-amber-700';
};

export default function InvoiceDetailModal({ isOpen, onClose, invoice, onPrint }) {
  if (!isOpen || !invoice) {
    return null;
  }

  const items = Array.isArray(invoice.details) ? invoice.details : [];
  const paymentMethod = invoice.metode_pembayaran || invoice.payment_method || invoice.paymentMethod || null;
  const paymentDate = invoice.tanggal_bayar || invoice.paid_at || invoice.dibayar_pada || null;
  
  const isLunas = String(invoice.status || '').toLowerCase() === 'lunas';
  const displayPayment = isLunas && paymentDate
    ? `${formatDate(paymentDate)} via ${formatPaymentMethod(paymentMethod)}`
    : '-';

  const subtotal = Number(invoice.subtotal || 0);
  const discountValue = Number(invoice.diskon_nominal || 0);
  const discountPercent = Number(invoice.diskon_persen || 0);
  const taxValue = Number(invoice.pajak_nominal || 0);
  const taxPercent = Number(invoice.pajak_persen || 0);
  const total = Number(invoice.total || 0);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl" showCloseButton={false}>
      <div className="relative bg-white">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail invoice"
          className="absolute right-4 top-4 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-balck"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>

        <div className="px-4 pb-4 pt-5 sm:px-5 sm:pt-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-balck sm:text-lg">{invoice.kode_invoice || invoice.id_invoice || 'Detail Invoice'}</h3>
            <p className="text-xs text-slate-500 sm:text-sm">Detail invoice dan rincian biaya</p>
          </div>

          <div className="grid gap-x-8 gap-y-4 rounded-2xl bg-slate-50 px-4 py-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-bold text-balck">Pemilik</p>
              <p className="text-sm font-medium text-accent-neutral-1000">{invoice.pasien?.name || invoice.pasien?.username || '-'}</p>
              <p className="text-xs text-accent-neutral-800">{invoice.pasien?.phone_number || invoice.pasien?.phone || '-'}</p>
            </div>

            <div>
              <p className="text-sm font-bold text-balck">Hewan</p>
              <p className="text-sm font-medium text-accent-neutral-1000">{invoice.hewan?.nama_hewan || invoice.hewan?.petName || '-'} ({invoice.hewan?.jenis_hewan?.nama_jenis || invoice.hewan?.jenis_hewan || '-'})</p>
              
            </div>

            <div>
              <p className="text-sm font-bold text-balck">Tanggal</p>
              <p className="text-sm font-mediumtext-accent-neutral-1000">{invoice.tanggalLabel || formatDate(invoice.tanggal_invoice)}</p>
            </div>

            <div>
              <p className="text-sm font-bold text-balck">Jatuh Tempo</p>
              <p className="text-sm font-medium text-accent-neutral-1000">{invoice.jatuhTempoLabel || formatDate(invoice.jatuh_tempo)}</p>
            </div>

            <div>
              <p className="text-sm font-bold text-balck">Status</p>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(invoice.status)}`}>
                {String(invoice.status || '').toLowerCase() === 'lunas' ? 'Lunas' : 'Belum Bayar'}
              </span>
            </div>

            <div>
              <p className="text-sm font-bold text-balck">Dibayar</p>
              <p className="text-sm text-accent-neutral-1000">{displayPayment}</p>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="grid grid-cols-12 border-b border-slate-200 px-4 py-3 text-sm font-medium text-accent-neutral-1000">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Harga</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            {items.length ? items.map((item, index) => {
              const qty = Number(item.qty ?? item.quantity ?? 1);
              const price = Number(item.harga_satuan ?? item.harga ?? 0);
              const subtotalItem = qty * price;

              return (
                <div key={item.id ?? `${item.nama_item || 'item'}-${index}`} className="grid grid-cols-12 items-center border-b border-slate-200 px-4 py-4 text-sm last:border-b-0">
                  <div className="col-span-6">
                    <p className="text-accent-neutral-1000">{item.nama_item || '-'}</p>
                  </div>
                  <div className="col-span-2 text-center text-accent-neutral-1000">{qty}</div>
                  <div className="col-span-2 text-right text-accent-neutral-1000">{formatCurrency(price)}</div>
                  <div className="col-span-2 text-right font-semibold text-balck">{formatCurrency(subtotalItem)}</div>
                </div>
              );
            }) : (
              <div className="px-4 py-6 text-center text-sm text-slate-500">
                Tidak ada item invoice.
              </div>
            )}
          </div>

          <div className="mt-4 rounded-2xl bg-white px-1">
            <div className="space-y-2 text-sm text-accent-neutral-1000">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {discountPercent > 0 || discountValue > 0 ? (
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span>Diskon{discountPercent > 0 ? ` (${discountPercent}%)` : ''}</span>
                  <span className="text-rose-600">-{formatCurrency(discountValue)}</span>
                </div>
              ) : null}

              {taxPercent > 0 || taxValue > 0 ? (
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span>Pajak{taxPercent > 0 ? ` (${taxPercent}%)` : ''}</span>
                  <span>{formatCurrency(taxValue)}</span>
                </div>
              ) : null}

              <div className="flex items-center justify-between pt-1">
                <span className="text-base font-semibold text-balck">TOTAL</span>
                <span className="text-base font-bold text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {invoice.catatan ? (
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-accent-neutral-1000">
              <p className="mb-1 font-semibold text-balck">Catatan</p>
              <p>{invoice.catatan}</p>
            </div>
          ) : null}

          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onPrint?.(invoice)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-balck transition hover:bg-slate-50"
            >
              <PrinterIcon className="h-4 w-4" />
              Print
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-balck px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
