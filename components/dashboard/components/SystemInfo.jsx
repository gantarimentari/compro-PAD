'use client';

import React, { useState, useEffect } from 'react';
import api from '@lib/api';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import Button from '@ds/Button';
import { UploadIcon, FacebookIcon, InstagramIcon, TwitterIcon, YoutubeDBIcon, AddIcon, DiskSaveIcon } from '@ds/icons';

export default function SystemInfo() {
  const [systemData, setSystemData] = useState({
    clinicName: '',
    address: '',
    phone: '',
    email: '',
    fotoCard: null,
    deskripsiHero: '',
    judulVideoEdukasi: '',
    deskripsiVideoEdukasi: '',
    aboutUs: '',
    judulLayananTersedia: '',
    judulPromoTersedia: '',
    deskripsiArtikel: '',
    judulFooter: '',
    operatingHours: '',
  });

  const [socialMedia, setSocialMedia] = useState([]);
  const [newSocialMedia, setNewSocialMedia] = useState({
    platform: '',
    url: '',
  });

  const platformOptions = [
    { value: 'facebook', label: 'Facebook', icon: FacebookIcon },
    { value: 'instagram', label: 'Instagram', icon: InstagramIcon },
    { value: 'twitter', label: 'Twitter', icon: TwitterIcon },
    { value: 'youtube', label: 'YouTube', icon: YoutubeDBIcon },
  ];

  // ✅ Fetch data dari backend
  const fetchSystemInfo = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.get('/api/system-info');

      console.log('📦 System Info:', res.data);

      setSystemData(res.data.systemInfo);
      setSocialMedia(res.data.socialMedia || []);
    } catch (err) {
      console.error('❌ Error fetching system info:', err);
      alert('Gagal memuat data sistem');
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
    setSystemData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: Upload file ke server dan simpan URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setSystemData(prev => ({
          ...prev,
          fotoCard: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Save system info
  const handleSave = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');

      console.log('📤 Saving system info:', systemData);

      await api.put('/api/system-info', systemData);

      alert('✅ Data berhasil disimpan!');
      await fetchSystemInfo();
    } catch (err) {
      console.error('❌ Error saving system info:', err);
      alert(`❌ Gagal menyimpan: ${err.response?.data?.message || err.message}`);
    }
  };

  // ✅ Add social media
  const handleAddSocialMedia = async () => {
    if (newSocialMedia.platform && newSocialMedia.url) {
      try {
        await api.get('/sanctum/csrf-cookie');

        await api.post('/api/social-media', {
          platform: newSocialMedia.platform,
          url: newSocialMedia.url,
        });

        setNewSocialMedia({ platform: '', url: '' });
        await fetchSystemInfo();
        alert('✅ Social media berhasil ditambahkan!');
      } catch (err) {
        console.error('❌ Error adding social media:', err);
        alert('❌ Gagal menambahkan social media');
      }
    }
  };

  // ✅ Update social media
  const handleUpdateSocialMedia = async (id, newUrl) => {
    try {
      await api.get('/sanctum/csrf-cookie');

      await api.put(`/api/social-media/${id}`, { url: newUrl });

      setSocialMedia(socialMedia.map(item =>
        item.id === id ? { ...item, url: newUrl } : item
      ));
    } catch (err) {
      console.error('❌ Error updating social media:', err);
      alert('❌ Gagal mengupdate social media');
    }
  };

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
              Nama Sistem
            </label>
            <input
              type="text"
              value={systemData.clinicName}
              onChange={(e) => handleInputChange('clinicName', e.target.value)}
              className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
              Alamat
            </label>
            <textarea
              // type="textarea"
              value={systemData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full  text-body-2  bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
              Nomor HP
            </label>
            <input
              type="tel"
              value={systemData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full text-body-2  bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
            </div>

          <div >
            <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
              Email
            </label>
            <input
              type="email"
              value={systemData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>
          </div>
          <div className="">
            <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
              Foto Card
            </label>
              <div className="relative bg-accent-neutral-200 rounded-lg px-4 py-2
                   transition duration-150">
                <div className="flex items-center justify-between space-x-2 ">
                  
                  <p className="text-sm text-gray-600">Upload foto disini</p>
                  <div className="flex ">
                    <UploadIcon className="w-4 h-4 " />
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
              value={systemData.deskripsiHero}
              onChange={(e) => handleInputChange('deskripsiHero', e.target.value)}
              rows={4}
              className="w-full text-body-2  bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
              Judul Video Edukasi
            </label>
            <input
              type="text"
              value={systemData.judulVideoEdukasi}
              onChange={(e) => handleInputChange('judulVideoEdukasi', e.target.value)}
              className="w-full text-body-2 bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
              Deskripsi Video Edukasi
            </label>
            <textarea
              value={systemData.deskripsiVideoEdukasi}
              onChange={(e) => handleInputChange('deskripsiVideoEdukasi', e.target.value)}
              rows={4}
              className="w-full text-body-2  bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
              About Us
            </label>
            <textarea
              value={systemData.aboutUs}
              onChange={(e) => handleInputChange('aboutUs', e.target.value)}
              rows={4}
              className="w-full text-body-2  bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
              Judul Layanan Tersedia
            </label>
            <input
              type="text"
              value={systemData.judulLayananTersedia}
              onChange={(e) => handleInputChange('judulLayananTersedia', e.target.value)}
              className="w-full text-body-2  bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
              Judul Promo Tersedia
            </label>
            <input
              type="text"
              value={systemData.judulPromoTersedia}
              onChange={(e) => handleInputChange('judulPromoTersedia', e.target.value)}
              className="w-full text-body-2  bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
              Deskripsi Artikel
            </label>
            <textarea
              value={systemData.deskripsiArtikel}
              onChange={(e) => handleInputChange('deskripsiArtikel', e.target.value)}
              rows={4}
              className="w-full text-body-2  bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
              Judul Footer
            </label>
            <input
              type="text"
              value={systemData.judulFooter}
              onChange={(e) => handleInputChange('judulFooter', e.target.value)}
              className="w-full text-body-2  bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-h-8 font-bold text-accent-neutral-1000 mb-1">
              Jam Operasional
            </label>
            <input
              type="text"
              value={systemData.operatingHours}
              onChange={(e) => handleInputChange('operatingHours', e.target.value)}
              className="w-full text-body-2  bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
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
            className='w-full  '
          >
            Simpan Perubahan
          </Button>
        </div>

      {/* Sosial Media Section */}
      <div className="bg-white rounded-2xl border-1  border-accent-neutral-400 shadow p-6 space-y-4">
        <h2 className="text-h-6 font-bold text-accent-neutral-1000 mb-4">Sosial Media</h2>
        
        <div className="space-y-3">
          {socialMedia.map((item) => {
            const IconComponent = getSocialIcon(item.platform);
            return (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-accent-neutral-225 rounded-2xl">
                <div className="w-10 h-10 rounded-[14px] bg-accent-blue-300 flex items-center shadow-[0_4px_4px_rgba(0,0,0,0.15),_0_8px_10px_-6px_rgba(31,162,255,0.80)] justify-center flex-shrink-0">
                  {IconComponent && <IconComponent className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-body-2 text-accent-neutral-1000">{item.platform}</p>
                  <input
                    type="text"
                    value={item.url}
                    onBlur={(e) => handleUpdateSocialMedia(item.id, e.target.value)}
                    onChange={(e) => {
                      setSocialMedia(socialMedia.map(sm =>
                        sm.id === item.id ? { ...sm, url: e.target.value } : sm
                      ));
                    }}
                    className="w-full text-body-1 font-medium rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  />
                </div>
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
                value={newSocialMedia.platform}
                onChange={(e) => setNewSocialMedia({ ...newSocialMedia, platform: e.target.value })}
                className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                value={newSocialMedia.url}
                onChange={(e) => setNewSocialMedia({ ...newSocialMedia, url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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




