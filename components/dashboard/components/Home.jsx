"use client";

import React, { useState } from 'react';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import { 
  SearchIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PawIcon,
  TotalKunjunganIcon,
  KunjunganBaruIcon,
  RekamMedisIcon,
  WaveHandIcon
} from '@ds/icons';

// Dummy Data
const MOCK_METRICS = {
  totalHewan: 101,
  totalKunjungan: 10,
  kunjunganBaru: 608,
  rekamMedis: 200,
};

const MOCK_CLINIC_SUMMARY = {
  konsultasi: { count: 172, change: 3.9, isPositive: true },
  rawatInap: { count: 85, change: 0.7, isPositive: false },
  pemeriksaanUmum: { count: 36, change: 8.2, isPositive: true },
  totalHewanDirawat: { count: 295, change: 2.7, isPositive: true },
};

const MOCK_TRANSACTIONS = [
  { id: 1, petName: "Guguk", animalType: "Anjing", date: "21 Oct, 2024" },
  { id: 2, petName: "Meow", animalType: "Kucing", date: "15 Oct, 2024" },
  { id: 3, petName: "Blacky", animalType: "Anjing", date: "10 Oct, 2024" },
  { id: 4, petName: "Twit", animalType: "Burung", date: "05 Oct, 2024" },
  { id: 5, petName: "Bunny", animalType: "Kelinci", date: "01 Oct, 2024" },
  { id: 6, petName: "Goldie", animalType: "Ikan", date: "28 Sep, 2024" },
  { id: 7, petName: "Whiskers", animalType: "Kucing", date: "25 Sep, 2024" },
  { id: 8, petName: "Max", animalType: "Anjing", date: "20 Sep, 2024" },
  { id: 9, petName: "Charlie", animalType: "Anjing", date: "15 Sep, 2024" },
  { id: 10, petName: "Luna", animalType: "Kucing", date: "10 Sep, 2024" },
  { id: 11, petName: "Rocky", animalType: "Anjing", date: "05 Sep, 2024" },
  { id: 12, petName: "Coco", animalType: "Burung", date: "01 Sep, 2024" },
];

const USER_NAME = "Budi";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 4;
  const totalPages = Math.ceil(MOCK_TRANSACTIONS.length / itemsPerPage);

  // Filter transactions based on search
  const filteredTransactions = MOCK_TRANSACTIONS.filter(transaction =>
    transaction.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.animalType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate transactions
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader 
        title="Dashboard" 
        description="Selamat datang kembali di dashboard klinik"
      />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Hewan Card */}
        <div className="bg-white rounded-2xl border-[1px] border-accent-neutral-285 shadow-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-14 h-14 rounded-2xl shadow-e4 bg-gradient-to-r from-[#ffb900] to-[#ff6900] flex items-center justify-center">
              <PawIcon className="w-7 h-7" color="white" />
            </div>
          </div>
          <h3 className="text-h-6 font-bold  text-accent-neutral-800  ">
            {MOCK_METRICS.totalHewan}
          </h3>
          <p className="text-body-2 text-accent-neutral-700">Total Hewan</p>
        </div>

        {/* Total Kunjungan Card */}
        <div className="bg-white rounded-2xl border-[1px] border-accent-neutral-285 shadow-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-14 h-14  shadow-e4 rounded-2xl bg-gradient-to-r from-[#00D5BE] to-[#00B8DB] flex items-center justify-center">
              <TotalKunjunganIcon  className="w-7 h-7" color="white"/>
            </div>
          </div>
          <h3 className="text-h-6 font-bold text-accent-neutral-800 ">
            {MOCK_METRICS.totalKunjungan}
          </h3>
          <p className="text-body-2 text-accent-neutral-700">Total Kunjungan</p>
        </div>

        {/* Kunjungan Baru Card */}
        <div className="bg-white rounded-2xl border-[1px] border-accent-neutral-285 shadow-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-14 h-14 rounded-2xl  shadow-e4 bg-gradient-to-r from-[#fb64b6] to-[#ff2056] flex items-center justify-center">
              <KunjunganBaruIcon className="w-7 h-7"  color="white" />
            </div>
          </div>
          <h3 className="text-h-6 font-bold text-accent-neutral-800 ">
            {MOCK_METRICS.kunjunganBaru}
          </h3>
          <p className="text-body-2 text-accent-neutral-700">Kunjungan Baru</p>
        </div>

        {/* Rekam Medis Card */}
        <div className="bg-white rounded-2xl border-[1px] border-accent-neutral-285 shadow-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-14 h-14 rounded-2xl  shadow-e4 bg-gradient-to-r from-[#05df72] to-[#00bc7d] flex items-center justify-center">
              <RekamMedisIcon className="w-7 h-7" color="white" />
            </div>
          </div>
          <h3 className="text-h-6 font-bold text-accent-neutral-800 ">
            {MOCK_METRICS.rekamMedis}
          </h3>
          <p className="text-body-2 text-accent-neutral-700">Rekam Medis</p>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-accent-blue-300 rounded-2xl shadow-xl p-6 flex items-center gap-4 shadow-[0_8px_10px_-6px_rgba(31,162,255,0.3),_0_20px_25px_-5px_rgba(31,162,255,0.3)]">
        <div className="w-20 h-20 rounded-2xl bg-[#4CB5FF] shadow-e4 flex items-center justify-center flex-shrink-0">
          <p className="text-5xl"  >👋</p>
        </div>
        <div className="flex-1">
          <h2 className="text-h-7 font-bold text-white mb-1">
            Selamat Datang, {USER_NAME}!
          </h2>
          <p className="text-body-1 text-white/90">
            Pantau jadwal perawatan, dan akses rekam medis dengan mudah
          </p>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clinic Summary Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-h-7 font-bold text-accent-neutral-1000 mb-6">
            Ringkasan Klinik
          </h3>
          
          <div className="space-y-4 mb-6">
            {/* Konsultasi */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#ad46ff] to-[#f6339a]"></div>
                <span className="text-body-1  text-accent-neutral-800">Konsultasi</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-body-1 font-bold text-accent-neutral-1000">
                  {MOCK_CLINIC_SUMMARY.konsultasi.count}
                </span>
                <div className={`rounded-2xl  px-2 py-1 ${
                  MOCK_CLINIC_SUMMARY.konsultasi.isPositive ? 'bg-[#F0FDF4]' : 'bg-[#FEF2F2]'
                }` }>
                  <span className={`text-body-2 font-medium ${
                  MOCK_CLINIC_SUMMARY.konsultasi.isPositive ? 'text-[#00A63E]' : 'text-[#E7000B]'
                }`}>
                  {MOCK_CLINIC_SUMMARY.konsultasi.isPositive ? '↑' : '↓'} {MOCK_CLINIC_SUMMARY.konsultasi.change}%
                </span>

                </div>
                
              </div>
            </div>

            {/* Rawat Inap */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-body-1 text-accent-neutral-800">Rawat Inap</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-body-1 font-bold text-accent-neutral-1000">
                  {MOCK_CLINIC_SUMMARY.rawatInap.count}
                </span>
                <div className={`rounded-2xl  px-2 py-1 ${
                  MOCK_CLINIC_SUMMARY.rawatInap.isPositive ? 'bg-[#F0FDF4]' : 'bg-[#FEF2F2]'
                }` }>
                <span className={`text-body-2 font-medium ${
                  MOCK_CLINIC_SUMMARY.rawatInap.isPositive ? 'text-[#00A63E]' : 'text-[#E7000B]'
                }`}>
                  {MOCK_CLINIC_SUMMARY.rawatInap.isPositive ? '↑' : '↓'} {MOCK_CLINIC_SUMMARY.rawatInap.change}%
                </span>

                </div>
                
              </div>
            </div>

            {/* Pemeriksaan Umum */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                <span className="text-body-1 text-accent-neutral-800">Pemeriksaan Umum</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-body-1 font-bold text-accent-neutral-1000">
                  {MOCK_CLINIC_SUMMARY.pemeriksaanUmum.count}
                </span>
                <div className={`rounded-2xl  px-2 py-1 ${
                  MOCK_CLINIC_SUMMARY.pemeriksaanUmum.isPositive ? 'bg-[#F0FDF4]' : 'bg-[#FEF2F2]'
                }` }>
                <span className={`text-body-2 font-medium ${
                  MOCK_CLINIC_SUMMARY.pemeriksaanUmum.isPositive ? 'text-[#00A63E]' : 'text-[#E7000B]'
                }`}>
                  {MOCK_CLINIC_SUMMARY.pemeriksaanUmum.isPositive ? '↑' : '↓'} {MOCK_CLINIC_SUMMARY.pemeriksaanUmum.change}%
                </span>

                </div>
                
              </div>
            </div>
          </div>

          {/* Total Hewan Dirawat */}
          <div className="pt-6 border-t border-accent-neutral-400">
            <div className="flex items-center justify-between">
              <div>
                
                <h3 className="text-h-6 font-bold text-accent-neutral-1000">
                  {MOCK_CLINIC_SUMMARY.totalHewanDirawat.count}
                </h3>
                <p className="text-body-2 text-accent-neutral-800 mb-1">Total Hewan Dirawat</p>
              </div>
              <div className='rounded-3xl bg-[#F0FDF4] px-3 py-3'>
              <span className="text-h-7 font-bold text-[#00A63E]">
                +{MOCK_CLINIC_SUMMARY.totalHewanDirawat.change}%
              </span>
                
              </div>
          
            </div>
          </div>
        </div>

        {/* Latest Transactions Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-h-6 font-bold text-accent-neutral-800">
              Transaksi Terbaru
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 text-body-2 border border-accent-neutral-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue-300 w-48"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-accent-neutral-600" />
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-4 mb-6">
            {paginatedTransactions.map((transaction, index) => (
              <div key={transaction.id} className="flex items-center gap-4 p-3 hover:bg-accent-neutral-225 rounded-lg transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-accent-blue-300 flex items-center justify-center flex-shrink-0 shadow-[0_8px_10px_-6px_rgba(31,162,255,0.3),_0_20px_25px_-5px_rgba(31,162,255,0.3)]">
                  <span className="text-h-8 font-bold text-white">
                    {startIndex + index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-body-1 font-medium text-accent-neutral-800">
                    {transaction.petName}
                  </p>
                  <p className="text-body-2 text-accent-neutral-700">
                    {transaction.animalType}
                  </p>
                </div>
                <p className="text-body-2 text-accent-neutral-700">
                  {transaction.date}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-accent-neutral-400">
            <p className="text-body-2 text-accent-neutral-700">
              Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} dari {filteredTransactions.length} data
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'bg-accent-neutral-225 text-accent-neutral-400 cursor-not-allowed'
                    : 'bg-white text-accent-neutral-800 hover:bg-accent-neutral-225 border border-accent-neutral-400'
                }`}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 3) {
                  pageNum = i + 1;
                } else if (currentPage === 1) {
                  pageNum = i + 1;
                } else if (currentPage === totalPages) {
                  pageNum = totalPages - 2 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-lg text-body-2 font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-accent-blue-300 text-white'
                        : 'bg-white text-accent-neutral-800 hover:bg-accent-neutral-225 border border-accent-neutral-400'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'bg-accent-neutral-225 text-accent-neutral-400 cursor-not-allowed'
                    : 'bg-white text-accent-neutral-800 hover:bg-accent-neutral-225 border border-accent-neutral-400'
                }`}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

