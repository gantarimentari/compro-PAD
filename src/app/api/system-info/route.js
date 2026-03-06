import { NextResponse } from 'next/server';

// Strip trailing /api jika ada, karena kita akan append /api/... sendiri
const LARAVEL_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/api\/?$/, '');

const DEFAULT_SYSTEM_INFO = {
  systemInfo: {
    clinic_name: 'KLINIK DOKTER HEWAN FANINA',
    about_us: 'Klinik Dokter Hewan Fanina hadir untuk menjaga kesehatan hewan kesayangan Anda.',
    deskripsi_hero: 'Buat , nggak ada yang lebih tenang selain tahu hewan kesayangannya sehat. Klinik Dokter Fanina hadir buat bantu jaga mereka tetap ceria.',
    foto_card: '/images/foto-dokter.png',
    phone: '',
    whatsapp_template: '',
    address: 'Jl Bedoet No.74, Mangunan, Caturharjo, Kec. Sleman, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55515',
    operating_hours: 'Senin - Jumat: 08:00 - 17:00 WIB',
    mapEmbedUrl: '',
    mapLink: '',
  },
};

export async function GET() {
  try {
    const response = await fetch(`${LARAVEL_URL}/api/system-info`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json(DEFAULT_SYSTEM_INFO);
  } catch {
    return NextResponse.json(DEFAULT_SYSTEM_INFO);
  }
}
