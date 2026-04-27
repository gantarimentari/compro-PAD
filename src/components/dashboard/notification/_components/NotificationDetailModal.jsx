import React from 'react';
import { CloseIcon } from '@/components/icons';
import { NOTIFICATION_TYPE_BADGE_CLASS, NOTIFICATION_STATUS_BADGE_CLASS } from '../notif.constants';
import { BaseModal } from '../..';
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

  const typeConfig = NOTIFICATION_TYPE_BADGE_CLASS[notification.type] || {};
  const statusConfig = NOTIFICATION_STATUS_BADGE_CLASS[notification.status] || {};
  const typeClass = `${typeConfig.bg || 'bg-gray-100'} ${typeConfig.text || 'text-gray-1000'}`;
  const statusClass = `${statusConfig.bg || 'bg-gray-100'} ${statusConfig.text || 'text-gray-1000'}`;

  return (
    <BaseModal
      isOpen={isOpen}
      onClick={onClose}
      title="Detail Notifikasi"
      description="Informasi lengkap tentang notifikasi yang dikirim"
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white px-6 pb-6  shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail notifikasi"
          className="absolute right-4 top-4 text-accent-neutral-500 transition hover:text-accent-neutral-900"
        >
          <CloseIcon className="h-5 w-5" />
        </button> */}

        {/* <h2 className="text-h-6 font-bold text-accent-neutral-1000">Detail Notifikasi</h2>
        <p className="mt-1 text-body-2 text-accent-neutral-1000">
          Informasi lengkap tentang notifikasi yang dikirim
        </p> */}

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-body-1 text-accent-neutral-1000">Tipe</p>
            <span className={` inline-flex rounded-lg px-3 py-1 text-body-2 font-medium ${typeClass}`}>
              {notification.type || '-'}
            </span>
          </div>

          <div>
            <p className="text-body-1 text-accent-neutral-1000">Channel</p>
            <span className=" inline-flex rounded-lg border border-accent-neutral-300 px-3 py-1 text-body-2 text-accent-neutral-1000">
              {notification.channel || '-'}
            </span>
          </div>

          <div>
            <p className="text-body-1 text-accent-neutral-1000">Recipient</p>
            <p className=" text-body-2 text-accent-neutral-1000">{notification.recipient || '-'}</p>
          </div>

          <div>
            <p className="text-body-1 text-accent-neutral-1000">Status</p>
            <span className={` inline-flex rounded-lg px-3 py-1 text-body-2   font-medium ${statusClass}`}>
              {notification.status || '-'}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-body-1 text-accent-neutral-1000">Waktu Kirim</p>
          <p className=" text-body-2 text-accent-neutral-1000">{notification.sentAt || '-'}</p>
        </div>

        <div className="mt-5">
          <p className="text-body-1 text-accent-neutral-00">Pesan</p>
          <div className=" py-2 rounded-xl bg-[#F9FAFB] text-body-2 text-accent-neutral-900">
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
    </BaseModal>
  );
}
