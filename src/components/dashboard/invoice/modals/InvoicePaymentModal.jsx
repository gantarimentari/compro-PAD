'use client';
import { useState } from 'react';
import React from 'react';
import { BaseModal } from '@/components/dashboard';
import ButtonSaveandClose from '../../shared-modals/ButtonSaveandClose';
import { PAYMENT_OPTIONS } from '../invoice.constants';
const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));



export default function InvoicePaymentModal({
  isOpen,
  onClose,
  onConfirm,
  invoice,
  paymentMethod,
  setPaymentMethod,
  isConfirming,
}) {
  if (!isOpen || !invoice) {
    return null;
  }

  const total = Number(invoice.total || 0);
  const ownerName = invoice.pasien?.name || invoice.pasien?.username || '-';
  const petName = invoice.hewan?.nama_hewan || invoice.hewan?.petName || '-';
  const [error, setError] = useState('');

    const handleConfirmPayment = () => {
      if (!paymentMethod) {
        setError('Silakan pilih metode pembayaran');
        return;
      }
      setError('');
      onConfirm();
    };
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showCloseButton={false}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleConfirmPayment();
        }}
        className="relative bg-white"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup konfirmasi pembayaran"
          className="absolute right-4 top-4 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>

        <div className="px-5 pb-5 pt-6">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-slate-900">Konfirmasi Pembayaran</h3>
            <p className="text-sm text-accent-neutral-700">Catat pembayaran untuk invoice ini</p>
          </div>

          <div className="rounded-2xl bg-[#F9FAFB] px-5 py-4 text-center">
            <p className="text-sm text-accent-neutral-700">{invoice.kode_invoice || invoice.id_invoice || '-'}</p>
            <p className="mt-1 text-sm text-accent-neutral-700">{ownerName} - {petName}</p>
            <p className="mt-2 text-3xl font-semibold text-accent-blue-400">{formatCurrency(total)}</p>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-semibold text-slate-900">Metode Pembayaran</label>
            <select
              value={paymentMethod}
              onChange={(event) => {
                setPaymentMethod(event.target.value);
                if (event.target.value) setError(''); // Langsung hilangkan tulisan merah begitu user memilih opsi
              }}
              // Jika ada error, ganti border menjadi merah biar lebih tegas
              className={`mt-2 w-full rounded-lg bg-[#F3F3F5] px-4 py-2.5 text-body-2 text-black transition outline-none border ${
                error ? 'border-red-500 focus:ring-2 focus:ring-red-100' : 'border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
            >
              <option value="">Pilih metode pembayaran</option>
              {PAYMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
          </div>
          <ButtonSaveandClose
            buttonLabel="Konfirmasi Lunas"
            buttonLabelProcessing="Memproses..."
            onClose={() => {
              setError('');
              onClose();
            }}
            isSubmitting={isConfirming}
          />
        </div>
      </form>
    </BaseModal>
  );
}
