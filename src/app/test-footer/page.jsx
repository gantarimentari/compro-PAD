"use client";

import Footer from "@ds/shared/Footer";
import HeaderDashboard from "@ds/dashboard/HeaderDashboard";
// import HeaderDashboard from './path/to/HeaderDashboard';

export default function TestFooterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderDashboard />
      
      {/* Hero Section untuk Demo */}
      <div className="bg-gradient-to-br from-accent-blue-600 to-accent-blue-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Footer Component Demo
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6">
            Footer sesuai design Figma dengan CMS-ready system
          </p>
          <a 
            href="#footer" 
            className="inline-block px-8 py-3 bg-accent-yellow-300 text-accent-blue-600 font-semibold rounded-lg hover:bg-accent-yellow-200 transition-colors shadow-lg"
          >
            Lihat Footer
          </a>
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-6 rounded-xl shadow-e2">
            <div className="w-12 h-12 bg-accent-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">CMS Ready</h3>
            <p className="text-gray-600">
              Semua konten bisa diubah dari dashboard admin
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-e2">
            <div className="w-12 h-12 bg-accent-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Responsive</h3>
            <p className="text-gray-600">
              Tampil sempurna di mobile, tablet, dan desktop
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-e2">
            <div className="w-12 h-12 bg-accent-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Interactive Map</h3>
            <p className="text-gray-600">
              Google Maps embedded untuk lokasi klinik
            </p>
          </div>

        </div>

        {/* Usage Example */}
        <div className="mt-16 bg-white rounded-xl shadow-e2 p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Cara Menggunakan</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">1. Basic (dengan default data)</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`import Footer from '@/components/layout/Footer';

export default function Page() {
  return (
    <div>
      {/* Your content */}
      <Footer />
    </div>
  );
}`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">2. Dengan data dari CMS</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`const footerData = {
  clinicName: "KLINIK DOKTER HEWAN FANINA",
  address: "Jl Bedoet No.74...",
  // ... data lainnya dari API
};

<Footer footerData={footerData} />`}</code>
              </pre>
            </div>
          </div>

          <div className="mt-6 p-4 bg-accent-blue-100 rounded-lg">
            <p className="text-accent-blue-800 text-sm">
              <strong>💡 Info:</strong> Lihat file <code className="bg-white px-2 py-1 rounded">FOOTER_CMS_GUIDE.md</code> untuk dokumentasi lengkap!
            </p>
          </div>
        </div>
      </div>

      {/* Anchor untuk scroll */}
      <div id="footer" className="scroll-mt-4"></div>
      
      {/* Footer Component - Menggunakan data default */}
      <Footer />
      
    </div>
  );
}
