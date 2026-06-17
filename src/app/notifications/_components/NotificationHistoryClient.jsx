'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import profileService from '@/lib/services/profileService';
import NotificationDetailModal from '@/app/notifications/_components/NotificationDetailModal';
// import NotificationDetailModal from '@/components/dashboard/notification/_components/NotificationDetailModal';
import { Pagination } from '@/components/Pagination';
import { useNotificationHistory } from '../_hooks/useNotificationHistory';
import { ChevronRightIcon } from '@/components/icons';


const getReminderMessage = (item) => {
  const petName = item?.vaksinasi?.hewan?.nama_hewan || item?.nama_hewan || 'hewan Anda';
  const vaccineName = item?.vaksinasi?.jenisVaksin?.nama_vaksin || item?.nama_vaksin || 'vaksinasi';
  const reminderType = String(item?.reminder_type || item?.reminderType || '')
    .trim()
    .toLowerCase();
  const normalizedNotificationType = String(item?.type || item?.tipe || '').trim().toLowerCase();
  const isVaccineNotification = normalizedNotificationType === 'vaksinasi' || Boolean(reminderType);

  if (!isVaccineNotification) {
    return item?.message || `Vaksinasi rutin untuk ${petName} sudah dikirim.`;
  }

  switch (reminderType) {
    case 'same_day':
    // case 'same-day':
      return `Hari ini jadwal ${vaccineName} untuk ${petName}.`;
    case '3_days_sebelum':
    // case '3-days-sebelum':
      return `Vaksinasi rutin untuk ${petName} dalam waktu 3 hari lagi.`;
    // case '1_day_before':
    case '7_day_before':
    // case '7-day-before':
    // case '7_days_sebelum':
    // case '7_days_before':
      return `Vaksinasi rutin untuk ${petName} dalam waktu 7 hari lagi.`;
    default:
      return item?.message || `Vaksinasi rutin untuk ${petName} sudah dikirim.`;
  }
};

const formatCardSubtitle = (item) => {
  const channel = item?.channel ? String(item.channel).toUpperCase() : 'WA';
  const sentAt = item?.sentAt || item?.waktu_kirim || '-';

  return `Dikirim via ${channel} • ${sentAt}`;
};

const getFilterDateRange = (filter) => {
  if (filter === 'all') {
    return { fromDate: '', toDate: '' };
  }

  const days = Number(filter);

  if (!Number.isFinite(days) || days <= 0) {
    return { fromDate: '', toDate: '' };
  }

  const now = new Date();
  const from = new Date(now);
  from.setDate(now.getDate() - days);

  const formatDate = (date) => date.toISOString().slice(0, 10);
  

  return {
    fromDate: formatDate(from),
    toDate: formatDate(now),
  };
};

const NotificationCard = ({ notification, index, isHighlighted, onDetail }) => (
  <article
    className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-[0_12px_28px_rgba(121,63,0,0.12)] transition-transform duration-200 sm:gap-4 sm:px-5 sm:py-4 ${
      isHighlighted
        ? 'border-white/80 bg-[#fef3d8]'
        : 'border-white/70 bg-white/95'
    }`}
  >
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-[#f1a74f] bg-white text-sm font-semibold text-black">
      {index + 1}
    </div>

    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium leading-6 text-[#3c3c3c] sm:text-[15px]">
        {getReminderMessage(notification)}
      </p>
      {/* <p className="mt-1 text-[11px] font-medium text-[#a06500] sm:text-xs">
        {formatCardSubtitle(notification)}
      </p> */}
    </div>

    <button
      type="button"
      onClick={() => onDetail(notification)}
      className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#4a3300] transition hover:brightness-105 sm:px-4 sm:text-sm ${
        isHighlighted ? 'bg-[#f0a100]' : 'bg-[#ffb52d]'
      }`}
    >
      <span>{isHighlighted ? 'Lihat Kembali' : 'Lihat Detail'}</span>

      <ChevronRightIcon className="h-3 w-3" />
    </button>
  </article>
);

export default function NotificationHistoryClient({ activeFilter = 'all' }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [openedIds, setOpenedIds] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const raw = localStorage.getItem('openedNotifications');
      if (raw) {
        setOpenedIds(JSON.parse(raw));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const profileQuery = useQuery({
    queryKey: ['current-user-profile'],
    queryFn: () => profileService.get(),
    staleTime: 60 * 1000,
  });

  const userId = profileQuery.data?.user?.id;
  const userName = profileQuery.data?.user?.username;

  const notificationsQuery = useNotificationHistory({
    userId,
    page,
    ...getFilterDateRange(activeFilter),
  });

  useEffect(() => {
    if (profileQuery.error?.response?.status === 401 || notificationsQuery.error?.response?.status === 401) {
      router.push('/auth/login');
    }
  }, [notificationsQuery.error, profileQuery.error, router]);

  useEffect(() => {
    setPage(1);
  }, [activeFilter]);

  const notifications = notificationsQuery.data?.data || [];
  const totalPages = notificationsQuery.data?.meta?.totalPages || 1;
  const totalItems = notificationsQuery.data?.meta?.totalItems || 0;
  const isLoading = !isMounted || profileQuery.isLoading || notificationsQuery.isLoading;
  const error = profileQuery.error || notificationsQuery.error;

  const totalVisibleNotifications = useMemo(() => notifications.length, [notifications]);

  const handleOpenDetail = (notification) => {
    setSelectedNotification(notification);
    setIsDetailOpen(true);

    try {
      const id = notification?.id ?? notification?.id_notification;
      if (!id) return;
      if (!openedIds.includes(id)) {
        const next = [...openedIds, id];
        setOpenedIds(next);
        localStorage.setItem('openedNotifications', JSON.stringify(next));
      }
    } catch (e) {
      // ignore storage errors
    }
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedNotification(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 sm:py-10 min-h-[600px]">
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-[82px] rounded-[22px] bg-white/90 shadow-[0_10px_28px_rgba(121,63,0,0.12)]" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[24px] border border-white/70 bg-white/95 px-6 py-5 text-center shadow-[0_10px_28px_rgba(121,63,0,0.12)]">
          <p className="text-base font-semibold text-red-600">
            {error?.response?.status === 401 ? 'Sesi login tidak valid. Silakan masuk kembali.' : (error?.message || 'Gagal memuat notifikasi.')}
          </p>
        </div>
      ) : totalVisibleNotifications > 0 ? (
        <div className="space-y-4 sm:space-y-5">
          {notifications.map((notification, index) => {
            const id = notification.id ?? notification.id_notification ?? `${notification.sentAt}-${index}`;
            const isOpened = openedIds.includes(id);
            return (
              <NotificationCard
                key={id}
                notification={notification}
                index={index}
                isHighlighted={isOpened}
                onDetail={handleOpenDetail}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-[24px] border border-white/70 bg-white/95 px-6 py-8 text-center shadow-[0_10px_28px_rgba(121,63,0,0.12)]">
          <p className="text-base font-semibold text-[#4a3300]">Belum ada riwayat notifikasi.</p>
          <p className="mt-2 text-sm text-[#7b5b20]">
            Saat notifikasi berhasil dikirim, semuanya akan muncul di sini.
          </p>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalData={totalItems}
            handlePageChange={setPage}
          />
        </div>
      ) : null}

      <NotificationDetailModal
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        notification={selectedNotification}
      />
    </div>
  );
}