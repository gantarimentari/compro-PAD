'use client';

import React, { useState } from 'react';
import { SearchIcon, CloseIcon, TrashIcon, AddIcon, PenIcon, UploadIcon} from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/Table';

// Mock Data
const MOCK_DATA = [
  { 
    id: 1, title: "Manfaat Memelihara Kucing", date: '01/01/2025', category: 'Foto',status: 'Draft',imageUrl: "/images/gambarkucingarticle.png",
    content: "-"
  },
  { 
    id: 2, title: "Manfaat Memelihara Kucing", date: '01/01/2025', category: 'Fun Fact',status: 'Draft', imageUrl: "/images/hamster.png",
    content: "-"
  },
  { 
    id: 3, title: "Pentingnya Vaksinasi Hewan", date: '01/01/2025', category: 'Vaksinasi',status: 'Draft',imageUrl: "/images/gambarkucingarticle.png",
    content: "-"
  },
  { 
    id: 4, title: "Makanan Terbaik untuk Parkit", date: '01/01/2025', category: 'Nutrisi', status: 'Publish', imageUrl: "/images/hamster.png",
    content: "-"
  },
];

// Columns definition
const ARTICLE_COLUMNS = [
  { key: 'title', header: 'Judul' },
  { key: 'category', header: 'Kategori' },
  { key: 'status', header: 'Status' },
  { key: 'date', header: 'Tanggal Ditambahkan' },
  { key: 'actions', header: 'Aksi', isAction: true },
];
    // status tag
const StatusTag = ({ status }) => {
  const color = status === 'Draft' ? 'bg-accent-yellow-150 text-accent-yellow-550' : 'bg-accent-green-50 text-accent-green-450';
  return (
    <span className={`px-4 py-2 text-body-2 rounded-lg w-24    ${color}`}>
      {status}
    </span>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, articleTitle }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Content */}
        <div className="p-6">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Hapus Artikel
          </h2>
          
          {/* Body Text */}
          <p className="text-sm text-gray-700 mb-6">
            Apakah Anda yakin ingin menghapus artikel "{articleTitle}"? Tindakan ini tidak dapat dibatalkan.
          </p>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-150 font-medium"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-6 py-2 bg-accent-red-300 text-white rounded-lg hover:bg-accent-red-400 transition duration-150 font-medium shadow-sm"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tambah Artikel Modal Component
const TambahArtikelModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    isiArtikel: '',
    file: null,
    status: 'Draft'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // Reset form
    setFormData({
      judul: '',
      kategori: '',
      isiArtikel: '',
      file: null,
      status: 'Draft'
    });
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Tambah Artikel</h2>
            <p className="text-sm text-gray-500 mt-1">Buat artikel baru untuk konten edukasi</p>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition duration-150"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul
            </label>
            <input
              type="text"
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              placeholder="Masukkan judul artikel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              required
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none bg-white"
              required
            >
              <option value="">Pilih kategori</option>
              <option value="Kesehatan">Kesehatan</option>
              <option value="Vaksinasi">Vaksinasi</option>
              <option value="Fun Fact">Fun Fact</option>
              <option value="Nutrisi">Nutrisi</option>
            </select>
          </div>

          {/* Isi Artikel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Isi Artikel
            </label>
            <textarea
              value={formData.isiArtikel}
              onChange={(e) => setFormData({ ...formData, isiArtikel: e.target.value })}
              placeholder="Tulis konten artikel disini..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
              required
            />
          </div>

          {/* Upload Media */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Media (Gambar)
            </label>
            <div className="relative">
              <div className="relative border-2 border-gray-300 rounded-lg p-8 text-center transition duration-150">
                <div className="relative z-10">
                  <div className="flex justify-center mb-2">
                    <UploadIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">Upload media anda disini</p>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none bg-white"
            >
              <option value="Draft">Draft</option>
              <option value="Publish">Publish</option>
            </select>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 font-medium shadow-sm"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Artikel Modal Component
const EditArtikelModal = ({ isOpen, onClose, onSave, article }) => {
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    isiArtikel: '',
    file: null,
    status: 'Draft'
  });

  React.useEffect(() => {
    if (article) {
      setFormData({
        judul: article.title || '',
        kategori: article.category || '',
        isiArtikel: article.content || '',
        file: null,
        status: article.status || 'Draft'
      });
    }
  }, [article]);

  if (!isOpen || !article) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(article.id, formData);
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Artikel</h2>
            <p className="text-sm text-gray-500 mt-1">Perbarui konten artikel</p>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition duration-150"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul
            </label>
            <input
              type="text"
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              placeholder="Masukkan judul artikel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              required
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none bg-white"
              required
            >
              <option value="">Pilih kategori</option>
              <option value="Kesehatan">Kesehatan</option>
              <option value="Vaksinasi">Vaksinasi</option>
              <option value="Fun Fact">Fun Fact</option>
              <option value="Nutrisi">Nutrisi</option>
            </select>
          </div>

          {/* Isi Artikel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Isi Artikel
            </label>
            <textarea
              value={formData.isiArtikel}
              onChange={(e) => setFormData({ ...formData, isiArtikel: e.target.value })}
              placeholder="Tulis konten artikel disini..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-none"
              required
            />
          </div>

          {/* Upload Media */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Media (Gambar)
            </label>
            <div className="relative">
              <div className="relative border-2 border-gray-300 rounded-lg p-8 text-center transition duration-150">
                <div className="relative z-10">
                  <div className="flex justify-center mb-2">
                    <UploadIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">Upload media anda disini</p>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 appearance-none bg-white"
            >
              <option value="Draft">Draft</option>
              <option value="Publish">Publish</option>
            </select>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 font-medium shadow-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



// Render cell function
const renderCell = (item, key, onEdit, onDelete) => {
  switch (key) {
      case 'status':
          return <StatusTag status={item.status} />;
      case 'actions':
          return (
              <div className="flex justify-center space-x-2">
                <Button 
                    icon={<PenIcon className="h-4 w-4" />} 
                    roundedClass="rounded-lg"
                    color="bg-accent-yellow-300" 
                    hoverColor="hover:bg-accent-yellow-500"
                    focusColor="focus:bg-accent-yellow-400"
            onClick={() => onEdit(item)}
            label={`Edit ${item.title}`}
                  />
                 <Button 
                    icon={<TrashIcon className="h-4 w-4" />} 
                    roundedClass="rounded-lg"
                    color="bg-accent-red-300" 
                    hoverColor="hover:bg-accent-red-400"
            onClick={() => onDelete(item)}
            label={`Hapus ${item.title}`}
                  />
              </div>
          );
      default:
          return item[key]; 
  }
};

// Main Component
export default function ManagemenArtikel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [articleData, setArticleData] = useState(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query
  const filteredData = articleData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveArtikel = (formData) => {
    // Add new article to the list
    const newArticle = {
      id: articleData.length + 1,
      title: formData.judul,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      category: formData.kategori,
      status: formData.status,
      imageUrl: formData.file ? URL.createObjectURL(formData.file) : '/images/gambarkucingarticle.png',
      content: formData.isiArtikel
    };
    setArticleData([...articleData, newArticle]);
  };

  const handleEditArtikel = (id, formData) => {
    // Update article in the list
    setArticleData(articleData.map(item => 
      item.id === id 
        ? {
            ...item,
            title: formData.judul,
            category: formData.kategori,
            status: formData.status,
            content: formData.isiArtikel,
            imageUrl: formData.file ? URL.createObjectURL(formData.file) : item.imageUrl
          }
        : item
    ));
  };

  const handleDelete = (article) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (articleToDelete) {
      setArticleData(articleData.filter(item => item.id !== articleToDelete.id));
      setIsDeleteModalOpen(false);
      setArticleToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setArticleToDelete(null);
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <div className="space-y-6">
      {/* Header dengan Judul dan Tombol Tambah Artikel */}
    <div className="flex justify-between items-center">
      <div>
          <h1 className="text-h-7 font-bold text-accent-neutral-1000">Konten Artikel</h1>
          <p className="text-body-2 text-accent-neutral-800">Kelola Artikel dan Konten Edukasi</p>
      </div>
        
      <Button 
          icon={<AddIcon />} 
          color="bg-accent-blue-400" 
          hoverColor="hover:bg-accent-blue-500"
          focusColor="focus:bg-accent-blue-300"
          roundedClass="rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          Tambah Artikel
      </Button>
    </div>
     
      {/* Search Bar */}
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="h-5 w-5 text-accent-neutral-800" />
          </div>
          <input
            type="search"
            placeholder="Cari judul atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 text-body-2 text-accent-neutral-800 pr-4 py-2 bg-accent-neutral-200 rounded-xl transition duration-150"
          />
        </div>

        {/* Tabel Data */}
        <Table 
          columns={ARTICLE_COLUMNS}
          data={filteredData}
          renderCell={(item, key) => renderCell(item, key, handleEdit, handleDelete)}
        />
    </div>    

      {/* Modal Tambah Artikel */}
      <TambahArtikelModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveArtikel}
      />

      {/* Modal Edit Artikel */}
      <EditArtikelModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        onSave={handleEditArtikel}
        article={selectedArticle}
      />

      {/* Modal Konfirmasi Hapus */}
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        articleTitle={articleToDelete?.title || ''}
      />
    </div>
  );
}
