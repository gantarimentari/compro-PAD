import React from 'react';
import { CloseIcon } from '@/components/icons';
import NOTIFICATION_DUMMY_DATA from '../notifDummy.data';

const buildMessage = (notification) => {
  if (notification?.message) {
    return notification.message;
  }

  const typeLabel = notification?.type || 'Notifikasi';
  const recipientLabel = notification?.recipient || 'penerima';
  const sentAtLabel = notification?.sentAt || '-';

  return `Reminder: ${typeLabel} dikirim ke ${recipientLabel} pada ${sentAtLabel}`;
};

export default function NotificationDetailModal({ isOpen, onClose, notification }) {
  if (!isOpen || !notification) {
    return null;
  }

  const typeClass = NOTIFICATION_DUMMY_DATA[notification.type] || 'bg-gray-100 text-gray-700';
  const statusClass = NOTIFICATION_DUMMY_DATA[notification.status] || 'bg-gray-100 text-gray-700';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail notifikasi"
          className="absolute right-4 top-4 text-accent-neutral-500 transition hover:text-accent-neutral-900"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <h2 className="text-h-6 font-bold text-accent-neutral-1000">Detail Notifikasi</h2>
        <p className="mt-1 text-body-2 text-accent-neutral-700">
          Informasi lengkap tentang notifikasi yang dikirim
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-body-2 text-accent-neutral-700">Tipe</p>
            <span className={`mt-1 inline-flex rounded-lg px-3 py-1 text-sm font-medium ${typeClass}`}>
              {notification.type || '-'}
            </span>
          </div>

          <div>
            <p className="text-body-2 text-accent-neutral-700">Channel</p>
            <span className="mt-1 inline-flex rounded-lg border border-accent-neutral-300 px-3 py-1 text-sm text-accent-neutral-1000">
              {notification.channel || '-'}
            </span>
          </div>

          <div>
            <p className="text-body-2 text-accent-neutral-700">Recipient</p>
            <p className="mt-1 text-body-1 text-accent-neutral-1000">{notification.recipient || '-'}</p>
          </div>

          <div>
            <p className="text-body-2 text-accent-neutral-700">Status</p>
            <span className={`mt-1 inline-flex rounded-lg px-3 py-1 text-sm font-medium ${statusClass}`}>
              {notification.status || '-'}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-body-2 text-accent-neutral-700">Waktu Kirim</p>
          <p className="mt-1 text-body-1 text-accent-neutral-1000">{notification.sentAt || '-'}</p>
        </div>

        <div className="mt-5">
          <p className="text-body-2 text-accent-neutral-700">Pesan</p>
          <div className="mt-1 rounded-xl bg-accent-neutral-100 p-3 text-body-2 text-accent-neutral-900">
            {buildMessage(notification)}
          </div>
        </div>

        <div className="mt-7 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#000624] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#0b1640]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
