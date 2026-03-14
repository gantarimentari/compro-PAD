'use client';

import React, { useState, useEffect } from 'react';
import systemInfoService from '@/lib/services/systemInfoService';
import mediaService from '@/lib/services/mediaService';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import Button from '@ds/ui/Button';
import { UploadIcon, FacebookIcon, InstagramIcon, TwitterIcon, YoutubeDBIcon, AddIcon, DiskSaveIcon, TrashIcon } from '@ds/icons';

export default function SystemInfo() {
  //  Use snake_case to match backend
  const [systemData, setSystemData] = useState({
    clinic_name: '',
    address: '',
    phone: '',
    email: '',
    whatsapp_template: '',
    foto_card: '',
    deskripsi_hero: '',
    judul_video_edukasi: '',
    deskripsi_video_edukasi: '',
    about_us: '',
    judul_layanan_tersedia: '',
    judul_promo_tersedia: '',
    deskripsi_artikel: '',
    judul_footer: '',
    operating_hours: '',
  });

  const [socialMedia, setSocialMedia] = useState([]);
  const [newSocialMedia, setNewSocialMedia] = useState({
    platform: '',
    url: '',
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const platformOptions = [
    { value: 'facebook', label: 'Facebook', icon: FacebookIcon },
    { value: 'instagram', label: 'Instagram', icon: InstagramIcon },
    { value: 'twitter', label: 'Twitter', icon: TwitterIcon },
    { value: 'youtube', label: 'YouTube', icon: YoutubeDBIcon },
  ];

  //  Fetch data
  const fetchSystemInfo = async () => {
    try {
      setIsLoading(true);
      const res = await systemInfoService.get();

      console.log('System Info Response:', res.data);
      console.log('Social Media from systemInfo:', res.data.systemInfo?.socialMedia);

      const fetchedData = res.data.systemInfo || {};
      
      //  Map snake_case from backend
      setSystemData({
        clinic_name: fetchedData.clinic_name || '',
        address: fetchedData.address || '',
        phone: fetchedData.phone || '',
        email: fetchedData.email || '',
        whatsapp_template: fetchedData.whatsapp_template || '',
        foto_card: fetchedData.foto_card || '',
        deskripsi_hero: fetchedData.deskripsi_hero || '',
        judul_video_edukasi: fetchedData.judul_video_edukasi || '',
        deskripsi_video_edukasi: fetchedData.deskripsi_video_edukasi || '',
        about_us: fetchedData.about_us || '',
        judul_layanan_tersedia: fetchedData.judul_layanan_tersedia || '',
        judul_promo_tersedia: fetchedData.judul_promo_tersedia || '',
        deskripsi_artikel: fetchedData.deskripsi_artikel || '',
        judul_footer: fetchedData.judul_footer || '',
        operating_hours: fetchedData.operating_hours || '',
      });

      //  FIX: Social media is inside systemInfo object
      const socialMediaData = fetchedData.socialMedia || [];
      console.log(' Parsed Social Media:', socialMediaData);
      
      //  Add 'id' field from database
      const socialMediaWithIds = socialMediaData.map((item, index) => ({
        id: item.id || index + 1, //  Use real ID from backend
        platform: item.platform || item.name?.toLowerCase() || '',
        url: item.url || item.href || '',
        name: item.name || item.platform,
        href: item.href || item.url,
        icon: item.icon || item.platform?.toLowerCase(),
      }));

      console.log(' Social Media with IDs:', socialMediaWithIds);
      setSocialMedia(socialMediaWithIds);
      
    } catch (err) {
      console.error('Error fetching system info:', err);
      alert('Gagal memuat data sistem');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  const getSocialIcon = (platform) => {
    const option = platformOptions.find(opt => opt.value === platform);
    return option ? option.icon : null;
  };


  const handleInputChange = (field, value) => {
    if (field === 'clinic_name') {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      if (words.length > 15) {
        alert(`Nama klinik maksimal 15 kata!\nSaat ini: ${words.length} kata`);
        return; // Jangan update state
      }
    }
    
    if (field === 'address') {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      if (words.length > 50) {
        alert(`Alamat maksimal 50 kata!\nSaat ini: ${words.length} kata`);
        return; // Jangan update state
      }
    }

    setSystemData(prev => ({
      ...prev,
      [field]: value || ''
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format tidak didukung, coba lagi');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file terlalu besar');
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'foto-cards'); //  Special category
      formData.append('name', 'Foto Card - Hero Section');

      const res = await mediaService.create(formData);

      console.log(' Upload response:', res.data);

      const uploadedUrl = res.data.data.imageUrl;

      setSystemData(prev => ({
        ...prev,
        foto_card: uploadedUrl,
      }));

      alert(' File berhasil diupload');
    } catch (err) {
      console.error('Upload error:', err);
      console.error('Error response:', err.response?.data);
      alert(`Gagal upload: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteSocialMedia = async (id, platform) => {
    try{
      await systemInfoService.removeSocialMedia(id);

      console.log('sosmed berhasil dihapus');

      // Refresh data
      await fetchSystemInfo();
    }catch(err){
      console.error('Error deleting social media:', err);
    
      let errorMessage = 'Gagal menghapus social media!\n\n';
    
      if (err.response?.status === 404) {
        errorMessage += 'Social media tidak ditemukan.\nMungkin sudah dihapus sebelumnya.';
      } else if (err.response?.status === 500) {
        errorMessage += 'Terjadi kesalahan di server.\nSilakan coba lagi.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage += 'Tidak dapat terhubung ke server.\nPastikan backend Laravel sedang berjalan.';
      } else {
        errorMessage += err.response?.data?.message || err.message;
      }

      alert(errorMessage);
    }
  };

  //  Save system info - send snake_case to backend
  const handleSave = async () => {
      // Validasi sebelum submit
    const errors = [];

    // Validasi jam operasional
    if (!systemData.operating_hours || systemData.operating_hours.trim() === '') {
      errors.push('Jam operasional tidak boleh kosong');
    }

    // Validasi nama klinik
    if (!systemData.clinic_name || systemData.clinic_name.trim() === '') {
      errors.push('Nama klinik tidak boleh kosong');
    }

    // Validasi email format (jika diisi)
    if (systemData.email && systemData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(systemData.email)) {
        errors.push('Format email tidak valid');
      }
    }

    // Tampilkan semua error
    if (errors.length > 0) {
      alert('Gagal karena:\n\n' + errors.map((err, i) => `${i + 1}. ${err}`).join('\n'));
      return; // Stop jangan submit
    }
    try {
      await systemInfoService.update(systemData);

      alert(' Data berhasil disimpan!');
      await fetchSystemInfo();
    } catch (err) {
      console.error(' Error saving system info:', err);
      console.error('Error details:', err.response?.data);
      alert(` Gagal menyimpan: ${err.response?.data?.message || err.message}`);
    }
  };

  //  Add social media
  const handleAddSocialMedia = async () => {
    if (newSocialMedia.platform && newSocialMedia.url) {
      try {
        await systemInfoService.addSocialMedia({
          platform: newSocialMedia.platform,
          url: newSocialMedia.url,
        });

        setNewSocialMedia({ platform: '', url: '' });
        await fetchSystemInfo();
        alert(' Social media berhasil ditambahkan!');
      } catch (err) {
        console.error('Error adding social media:', err);
        alert('Gagal menambahkan social media');
      }
    }
  };

  //  Update social media
  const handleUpdateSocialMedia = async (id, newUrl) => {
    try {
      await systemInfoService.updateSocialMedia(id, { url: newUrl });

      alert(' Social media berhasil diupdate!');
    } catch (err) {
      console.error('Error updating social media:', err);
      alert('Gagal mengupdate social media');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="System Info"
          description="Kelola informasi profil sistem klinik"
        />
        <div className="bg-white rounded-3xl border-1 border-accent-neutral-400 shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="System Info"
        description="Kelola informasi profil sistem klinik"
      />

      <div className="bg-white rounded-3xl border-1 border-accent-neutral-400 shadow p-6 space-y-4">
        <h2 className="text-h-8 font-bold text-accent-neutral-1000 mb-4">Profil Sistem</h2>
        
        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Nama Klinik
          </label>
          <textarea
            value={systemData.clinic_name || ''}
            onChange={(e) => handleInputChange('clinic_name', e.target.value)}
            className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none break-words"
            rows={2}
            placeholder="Contoh: Klinik Dokter Hewan Fanina (Max 15 kata)"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Alamat
          </label>
          <textarea
            value={systemData.address || ''}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            rows={3}
            placeholder="Masukkan alamat lengkap (Max 50 kata)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
              Nomor HP
            </label>
            <input
              type="tel"
              value={systemData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>

          <div>
            <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
              Email
            </label>
            <input
              type="email"
              value={systemData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>
        </div>

        <div>
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Foto Card
          </label>
          <div className="relative bg-accent-neutral-200 rounded-lg px-4 py-2 transition duration-150">
            <div className="flex items-center justify-between space-x-2">
              <p className="text-sm text-gray-600">
                {systemData.foto_card ? 'File dipilih' : 'Upload foto disini'}
              </p>
              <div className="flex">
                <UploadIcon className="w-4 h-4" />
              </div>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Deskripsi Hero
          </label>
          <textarea
            value={systemData.deskripsi_hero || ''}
            onChange={(e) => handleInputChange('deskripsi_hero', e.target.value)}
            rows={4}
            className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Judul Video Edukasi
          </label>
          <input
            type="text"
            value={systemData.judul_video_edukasi || ''}
            onChange={(e) => handleInputChange('judul_video_edukasi', e.target.value)}
            className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Deskripsi Video Edukasi
          </label>
          <textarea
            value={systemData.deskripsi_video_edukasi || ''}
            onChange={(e) => handleInputChange('deskripsi_video_edukasi', e.target.value)}
            rows={4}
            className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            About Us
          </label>
          <textarea
            value={systemData.about_us || ''}
            onChange={(e) => handleInputChange('about_us', e.target.value)}
            rows={4}
            placeholder="Klinik Dokter Hewan Fanina hadir sebagai sahabat terpercaya..."
            className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Judul Layanan Tersedia
          </label>
          <input
            type="text"
            value={systemData.judul_layanan_tersedia || ''}
            onChange={(e) => handleInputChange('judul_layanan_tersedia', e.target.value)}
            className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Judul Promo Tersedia
          </label>
          <input
            type="text"
            value={systemData.judul_promo_tersedia || ''}
            onChange={(e) => handleInputChange('judul_promo_tersedia', e.target.value)}
            className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Deskripsi Artikel
          </label>
          <textarea
            value={systemData.deskripsi_artikel || ''}
            onChange={(e) => handleInputChange('deskripsi_artikel', e.target.value)}
            rows={4}
            className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Judul Footer
          </label>
          <input
            type="text"
            value={systemData.judul_footer || ''}
            onChange={(e) => handleInputChange('judul_footer', e.target.value)}
            className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Jam Operasional
          </label>
          <input
            type="text"
            value={systemData.operating_hours || ''}
            onChange={(e) => handleInputChange('operating_hours', e.target.value)}
            placeholder="Senin - Jumat: 08:00 - 17:00"
            className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          />
        </div>

        {/*  Add WhatsApp Template Field */}
        <div className="md:col-span-2">
          <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
            Template Whatsapp
          </label>
          <textarea
            value={systemData.whatsapp_template || ''}
            onChange={(e) => handleInputChange('whatsapp_template', e.target.value)}
            rows={8}
            placeholder="Halo Klinik Dokter Fanina! 👋&#10;&#10;Saya ingin membuat reservasi untuk pemeriksaan hewan peliharaan saya.&#10;&#10;Mohon informasi lebih lanjut mengenai:&#10;• Jadwal yang tersedia&#10;• Jenis layanan yang ditawarkan&#10;• Estimasi biaya pemeriksaan&#10;&#10;Terima kasih! 🐾"
            className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
          />
          <p className="text-caption text-gray-500 mt-1">
            Template pesan yang akan muncul saat user klik "Reservasi via WhatsApp" di landing page
          </p>
        </div>
      </div>

      <div className="w-full">
        <Button
          icon={<DiskSaveIcon className="w-5 h-5" />}
          color="bg-accent-blue-400"
          hoverColor="hover:bg-accent-blue-500"
          focusColor="focus:bg-accent-blue-300"
          roundedClass="rounded-lg"
          onClick={handleSave}
          className='w-full'
        >
          Simpan Perubahan
        </Button>
      </div>

      {/* Social Media Section */}
      <div className="bg-white rounded-2xl border-1 border-accent-neutral-400 shadow p-6 space-y-4">
        <h2 className="text-h-6 font-bold text-accent-neutral-1000 mb-4">Sosial Media</h2>
        
        <div className="space-y-3">
          {socialMedia.map((item) => {
            const IconComponent = getSocialIcon(item.platform);
            return (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-accent-neutral-225 rounded-2xl">
                {/* Icon Platform */}
                <div className="w-10 h-10 rounded-[14px] bg-accent-blue-300 flex items-center shadow-[0_4px_4px_rgba(0,0,0,0.15),_0_8px_10px_-6px_rgba(31,162,255,0.80)] justify-center flex-shrink-0">
                  {IconComponent && <IconComponent className="w-4 h-4 text-white" />}
                </div>
                
                {/* Input URL */}
                <div className="flex-1 space-y-1">
                  <p className="text-body-2 text-accent-neutral-1000">{item.platform}</p>
                  <input
                    type="text"
                    value={item.url || ''}
                    onBlur={(e) => handleUpdateSocialMedia(item.id, e.target.value)}
                    onChange={(e) => {
                      setSocialMedia(socialMedia.map(sm =>
                        sm.id === item.id ? { ...sm, url: e.target.value } : sm
                      ));
                    }}
                    className="w-full text-body-1 font-medium rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  />
                </div>
                
                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteSocialMedia(item.id, item.platform)}
                  className="w-10 h-10 rounded-[14px] bg-accent-red-300 hover:bg-accent-red-400 flex items-center justify-center flex-shrink-0 transition-colors duration-150 shadow-md hover:shadow-lg"
                  title={`Hapus ${item.platform}`}
                >
                  <TrashIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Add New Social Media Form */}
        <div className="bg-white rounded-xl border-2 border-accent-neutral-550 shadow p-6 space-y-4">
          <h3 className="text-h-8 font-bold text-accent-neutral-1000">Tambah Sosial Media Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <select
                value={newSocialMedia.platform || ''}
                onChange={(e) => setNewSocialMedia({ ...newSocialMedia, platform: e.target.value })}
                className="w-full bg-accent-neutral-275 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none"
              >
                <option value="">Pilih platform</option>
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={newSocialMedia.url || ''}
                onChange={(e) => setNewSocialMedia({ ...newSocialMedia, url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-accent-neutral-275 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              />
            </div>
          </div>
          <Button
            icon={<AddIcon className="w-5 h-5" />}
            color="bg-accent-blue-400"
            hoverColor="hover:bg-accent-blue-500"
            roundedClass="rounded-lg"
            onClick={handleAddSocialMedia}
            className='w-full'
          >
            Tambah Sosial Media
          </Button>
        </div>
      </div>
    </div>
  );
}




