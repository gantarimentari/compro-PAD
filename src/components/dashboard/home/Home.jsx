"use client";

import React, { useState, useEffect } from 'react';
import dashboardService from '@/lib/services/dashboardService';
import authService from '@/lib/services/authService';
import PageHeader from '@/components/shared/PageHeader';
import { 
  SearchIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PawIcon,
  TotalKunjunganIcon,
  KunjunganBaruIcon,
  RekamMedisIcon,
  WaveHandIcon
} from '@/components/icons';

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State for data
  const [metrics, setMetrics] = useState({
    totalHewan: 0,
    totalKunjungan: 0,
    kunjunganBaru: 0,
    rekamMedis: 0,
  });
  
  const [clinicSummary, setClinicSummary] = useState({
    konsultasi: { count: 0, change: 0, isPositive: true },
    rawatInap: { count: 0, change: 0, isPositive: true },
    pemeriksaanUmum: { count: 0, change: 0, isPositive: true },
    totalHewanDirawat: { count: 0, change: 0, isPositive: true },
  });
  
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState('User');
  
  const itemsPerPage = 4;

  useEffect(() => {
    verifyAuthAndFetchData();
  }, []);

  const verifyAuthAndFetchData = async () => {
    try {
      setLoading(true);
      
      // Verify session is valid by checking current user
      try {
        await authService.getUser();
      } catch (authErr) {
        if (authErr.response?.status === 401) {
          console.error('Session invalid. Redirecting to login...');
          // Clear auth state
          document.cookie = 'auth_status=; max-age=0; path=/';
          document.cookie = 'auth_role=; max-age=0; path=/';
          localStorage.removeItem('user');
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          return;
        }
        // If error is not 401, continue (guest mode)
      }

      // user info from localstorage
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      setUserName(userInfo.username || 'User');

      // fetch statistics
      const stats = await dashboardService.getStatistics();
      setMetrics(stats);

      // fetch ringkasan klinik
      const summary = await dashboardService.getClinicSummary();
      setClinicSummary(summary);

      // fetch recent transactions
      const transactions = await dashboardService.getRecentTransactions();
      setTransactions(transactions);

    } catch (err) {
      // Handle 401 Unauthorized - session expired or invalid
      if (err.response?.status === 401) {
        console.error('Session expired during data fetch. Redirecting to login...');
        // Clear auth state
        document.cookie = 'auth_status=; max-age=0; path=/';
        document.cookie = 'auth_role=; max-age=0; path=/';
        localStorage.removeItem('user');
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      } else {
        console.error('Error fetching dashboard data:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(transaction =>
    transaction.petName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.animalType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.ownerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Paginate transactions
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue-300 mx-auto mb-4"></div>
          <p className="text-body-1 text-accent-neutral-700">Memuat data...</p>
        </div>
      </div>
    );
  }

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
            {metrics.totalHewan}
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
            {metrics.totalKunjungan}
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
            {metrics.kunjunganBaru}
          </h3>
          <p className="text-body-2 text-accent-neutral-700">Kunjungan Baru (Minggu Ini)</p>
        </div>

        {/* Rekam Medis Card */}
        <div className="bg-white rounded-2xl border-[1px] border-accent-neutral-285 shadow-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-14 h-14 rounded-2xl  shadow-e4 bg-gradient-to-r from-[#05df72] to-[#00bc7d] flex items-center justify-center">
              <RekamMedisIcon className="w-7 h-7" color="white" />
            </div>
          </div>
          <h3 className="text-h-6 font-bold text-accent-neutral-800 ">
            {metrics.rekamMedis}
          </h3>
          <p className="text-body-2 text-accent-neutral-700">Rekam Medis</p>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-accent-blue-300 rounded-2xl shadow-xl p-6 flex items-center gap-4 shadow-[0_8px_10px_-6px_rgba(31,162,255,0.3),_0_20px_25px_-5px_rgba(31,162,255,0.3)]">
        <div className="w-20 h-20 rounded-2xl bg-[#4CB5FF] shadow-e4 flex items-center justify-center flex-shrink-0">
          <p className="text-5xl">👋</p>
        </div>
        <div className="flex-1">
          <h2 className="text-h-7 font-bold text-white mb-1">
            Selamat Datang, {userName}!
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
                  {clinicSummary.konsultasi.count}
                </span>
                <div className={`rounded-2xl  px-2 py-1 ${
                  clinicSummary.konsultasi.isPositive ? 'bg-[#F0FDF4]' : 'bg-[#FEF2F2]'
                }`}>
                  <span className={`text-body-2 font-medium ${
                    clinicSummary.konsultasi.isPositive ? 'text-[#00A63E]' : 'text-[#E7000B]'
                  }`}>
                    {clinicSummary.konsultasi.isPositive ? '↑' : '↓'} {clinicSummary.konsultasi.change}%
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
                  {clinicSummary.rawatInap.count}
                </span>
                <div className={`rounded-2xl  px-2 py-1 ${
                  clinicSummary.rawatInap.isPositive ? 'bg-[#F0FDF4]' : 'bg-[#FEF2F2]'
                }`}>
                  <span className={`text-body-2 font-medium ${
                    clinicSummary.rawatInap.isPositive ? 'text-[#00A63E]' : 'text-[#E7000B]'
                  }`}>
                    {clinicSummary.rawatInap.isPositive ? '↑' : '↓'} {clinicSummary.rawatInap.change}%
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
                  {clinicSummary.pemeriksaanUmum.count}
                </span>
                <div className={`rounded-2xl  px-2 py-1 ${
                  clinicSummary.pemeriksaanUmum.isPositive ? 'bg-[#F0FDF4]' : 'bg-[#FEF2F2]'
                }`}>
                  <span className={`text-body-2 font-medium ${
                    clinicSummary.pemeriksaanUmum.isPositive ? 'text-[#00A63E]' : 'text-[#E7000B]'
                  }`}>
                    {clinicSummary.pemeriksaanUmum.isPositive ? '↑' : '↓'} {clinicSummary.pemeriksaanUmum.change}%
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
                  {clinicSummary.totalHewanDirawat.count}
                </h3>
                <p className="text-body-2 text-accent-neutral-800 mb-1">Total Reservasi</p>
              </div>
              <div className='rounded-3xl bg-[#F0FDF4] px-3 py-3'>
                <span className="text-h-7 font-bold text-[#00A63E]">
                  {clinicSummary.totalHewanDirawat.isPositive ? '+' : '-'}{clinicSummary.totalHewanDirawat.change}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Transactions Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-h-8 font-bold text-accent-neutral-1000">
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
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction, index) => (
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
                      {transaction.animalType} • {transaction.ownerName}
                    </p>
                  </div>
                  <p className="text-body-2 text-accent-neutral-700">
                    {transaction.date}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-body-2 text-accent-neutral-700 py-8">
                Tidak ada data hewan
              </p>
            )}
          </div>

          {/* Pagination */}
          {filteredTransactions.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
}

