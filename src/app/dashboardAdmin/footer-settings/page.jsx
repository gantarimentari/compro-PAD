"use client";

import { useState, useEffect } from 'react';

/**
 * Dashboard Admin - Footer Settings
 * 
 * Halaman untuk mengelola konten footer melalui CMS
 * 
 * Features:
 * - Edit informasi kontak klinik
 * - Manage social media links
 * - Update Google Maps location
 * - Preview changes before saving
 * 
 * TODO:
 * - Add authentication check
 * - Add loading states
 * - Add success/error notifications
 * - Add preview modal
 * - Add change history/audit log
 */
export default function FooterSettingsPage() {
  const [footerData, setFooterData] = useState({
    clinicName: '',
    address: '',
    operatingHours: '',
    phone: '',
    phoneDisplay: '',
    mapEmbedUrl: '',
    copyrightText: '',
    socialMedia: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch footer data on mount
  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/footer-settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch footer data');
      }
      
      const data = await response.json();
      setFooterData(data);
      setMessage({ type: '', text: '' });
    } catch (error) {
      console.error('Error fetching footer data:', error);
      setMessage({ 
        type: 'error', 
        text: 'Gagal memuat data footer. Silakan refresh halaman.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setMessage({ type: '', text: '' });

      const response = await fetch('/api/footer-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footerData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update footer settings');
      }

      setMessage({ 
        type: 'success', 
        text: 'Footer settings berhasil diupdate!' 
      });

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error updating footer:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Gagal mengupdate footer settings.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSocialMedia = () => {
    setFooterData({
      ...footerData,
      socialMedia: [
        ...footerData.socialMedia,
        { name: 'Youtube', href: '', icon: 'youtube' }
      ]
    });
  };

  const handleRemoveSocialMedia = (index) => {
    const newSocialMedia = footerData.socialMedia.filter((_, i) => i !== index);
    setFooterData({ ...footerData, socialMedia: newSocialMedia });
  };

  const handleSocialMediaChange = (index, field, value) => {
    const newSocialMedia = [...footerData.socialMedia];
    newSocialMedia[index][field] = value;
    
    // Auto-update name based on icon
    if (field === 'icon') {
      newSocialMedia[index].name = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    setFooterData({ ...footerData, socialMedia: newSocialMedia });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-accent-blue-600 mb-2">
            Footer Settings
          </h1>
          <p className="text-gray-600">
            Kelola informasi kontak dan social media yang tampil di footer website
          </p>
        </div>

        {/* Alert Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-accent-green-100 text-accent-green-600 border border-accent-green-300' 
              : 'bg-accent-red-alpha-10 text-accent-red-400 border border-accent-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl shadow-e2 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
              Informasi Klinik
            </h2>

            {/* Clinic Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Klinik *
              </label>
              <input
                type="text"
                required
                value={footerData.clinicName}
                onChange={(e) => setFooterData({ ...footerData, clinicName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue-600 focus:border-transparent transition-colors"
                placeholder="KLINIK DOKTER HEWAN FANINA"
              />
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alamat Lengkap *
              </label>
              <textarea
                required
                value={footerData.address}
                onChange={(e) => setFooterData({ ...footerData, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue-600 focus:border-transparent transition-colors"
                rows="3"
                placeholder="Jl Bedoet No.74, Mangunan, Caturharjo..."
              />
            </div>

            {/* Operating Hours */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jam Operasional *
              </label>
              <input
                type="text"
                required
                value={footerData.operatingHours}
                onChange={(e) => setFooterData({ ...footerData, operatingHours: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue-600 focus:border-transparent transition-colors"
                placeholder="Senin - Jumat: 08:00 - 17:00 WIB"
              />
            </div>

            {/* Phone Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor Telepon (untuk link) *
                </label>
                <input
                  type="text"
                  required
                  value={footerData.phone}
                  onChange={(e) => setFooterData({ ...footerData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue-600 focus:border-transparent transition-colors"
                  placeholder="+6212345678999"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: +6212345678999 (tanpa spasi atau dash)
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor Telepon (tampilan) *
                </label>
                <input
                  type="text"
                  required
                  value={footerData.phoneDisplay}
                  onChange={(e) => setFooterData({ ...footerData, phoneDisplay: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue-600 focus:border-transparent transition-colors"
                  placeholder="+62-123-4567-8999"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format untuk ditampilkan di website
                </p>
              </div>
            </div>
          </div>

          {/* Social Media Card */}
          <div className="bg-white rounded-xl shadow-e2 p-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Social Media Links
              </h2>
              <button
                type="button"
                onClick={handleAddSocialMedia}
                className="px-4 py-2 bg-accent-blue-600 text-white rounded-lg hover:bg-accent-blue-500 transition-colors text-sm font-medium"
              >
                + Tambah
              </button>
            </div>

            <div className="space-y-3">
              {footerData.socialMedia.map((social, index) => (
                <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg">
                  <div className="flex-none w-32">
                    <select
                      value={social.icon}
                      onChange={(e) => handleSocialMediaChange(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue-600 focus:border-transparent text-sm"
                    >
                      <option value="youtube">YouTube</option>
                      <option value="instagram">Instagram</option>
                      <option value="twitter">Twitter</option>
                      <option value="tiktok">TikTok</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="url"
                      required
                      value={social.href}
                      onChange={(e) => handleSocialMediaChange(index, 'href', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue-600 focus:border-transparent text-sm"
                      placeholder="https://..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSocialMedia(index)}
                    className="flex-none px-3 py-2 bg-accent-red-300 text-white rounded-lg hover:bg-accent-red-400 transition-colors"
                    title="Hapus"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {footerData.socialMedia.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                Belum ada social media link. Klik tombol "Tambah" untuk menambahkan.
              </p>
            )}
          </div>

          {/* Google Maps Card */}
          <div className="bg-white rounded-xl shadow-e2 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
              Google Maps
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Google Maps Embed URL *
              </label>
              <input
                type="url"
                required
                value={footerData.mapEmbedUrl}
                onChange={(e) => setFooterData({ ...footerData, mapEmbedUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue-600 focus:border-transparent transition-colors font-mono text-sm"
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <div className="mt-2 p-3 bg-accent-yellow-100 rounded-lg">
                <p className="text-sm text-gray-700 font-medium mb-1">
                  📍 Cara mendapatkan embed URL:
                </p>
                <ol className="text-sm text-gray-600 space-y-1 ml-4 list-decimal">
                  <li>Buka Google Maps</li>
                  <li>Cari dan pilih lokasi klinik</li>
                  <li>Klik "Share" → "Embed a map"</li>
                  <li>Copy HTML code, ambil URL dari attribute <code className="bg-white px-1 rounded">src="..."</code></li>
                </ol>
              </div>
            </div>

            {/* Map Preview */}
            {footerData.mapEmbedUrl && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preview:
                </label>
                <div className="w-full h-64 rounded-lg overflow-hidden shadow-e2">
                  <iframe
                    src={footerData.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Preview Lokasi"
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Copyright Card */}
          <div className="bg-white rounded-xl shadow-e2 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
              Copyright
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Copyright Text *
              </label>
              <input
                type="text"
                required
                value={footerData.copyrightText}
                onChange={(e) => setFooterData({ ...footerData, copyrightText: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue-600 focus:border-transparent transition-colors"
                placeholder="Klinik Dokter Hewan Fanina. All Rights Reserved."
              />
              <p className="text-xs text-gray-500 mt-1">
                Tahun akan otomatis ditambahkan di depan text ini
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={fetchFooterData}
              disabled={isSaving}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-accent-blue-600 text-white rounded-lg hover:bg-accent-blue-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}



