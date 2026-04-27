"use client"; // Wajib kalau pakai useEffect & useState
import { useEffect, useState } from 'react';
import notificationService from '@/lib/services/notificationService'; // Sesuaikan path-nya

export default function NotificationPage() {
  // 1. Siapkan "Piring" (State) untuk menampung data
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Siapkan "Pelayan" (useEffect) untuk ambil data pas halaman dibuka
  useEffect(() => {
    const fetchNotif = async () => {
      try {
        const res = await notificationService.getAll();
       
        console.log("Isi data dari BE:", res.data);
        if (res && res.data){
           setNotifications(res.data); // Masukkan data dari BE ke piring (state)
        }else{
          setNotifications(data);
        }
      } catch (error) {
        console.error("Waduh, gagal ambil data:", error);
      } finally {
        setLoading(false); // Matikan loading kalau sudah selesai (berhasil/gagal)
      }
    };

    fetchNotif();
  }, []); // [] artinya cuma jalan 1x pas halaman pertama kali muncul

  // 3. Tampilkan di layar
  if (loading) return <p>Sabar ya, lagi loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Notifikasi Saya</h1>
      <ul>
  {/* Pastikan notifications itu Array sebelum di .map */}
  {Array.isArray(notifications) && notifications.length > 0 ? (
    notifications.map((notif) => (
      <li key={notif.id_notification} className="border-b py-2">
        <p className="font-semibold">
          {/* Sesuai dokumen Rakai, pakai nama field yang benar */}
          {notif.tipe} - {notif.status}
        </p>
        <p className="text-sm text-gray-600">
          Penerima: {notif.recipient} ({notif.channel})
        </p>
      </li>
    ))
  ) : (
    <p>Tidak ada notifikasi atau data sedang disiapkan...</p>
  )}
</ul>
    </div>
  );
}