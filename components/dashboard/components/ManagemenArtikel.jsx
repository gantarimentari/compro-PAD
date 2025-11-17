'use client';

import React, { useState } from 'react';
import { TrashIcon, PenIcon} from '@ds/icons';
import Button from '@ds/Button';
import Table from '@ds/dashboard/components/Table';
import SearchBar from '@ds/dashboard/layouts/ManagementSearch';
import PageHeader from '@ds/dashboard/layouts/PageHeader';
import {
  TambahArtikelModal,
  EditArtikelModal,
  DeleteConfirmModal
} from '@ds/dashboard/modals';

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
      <PageHeader 
        title="Konten Artikel"
        description="Kelola Artikel dan Konten Edukasi"
        addButtonText="Tambah Artikel"
        onAddClick={() => setIsModalOpen(true)}
      />
     
      <div className="space-y-4">
        <SearchBar
          placeholderText="Cari judul atau kategori..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Table 
          columns={ARTICLE_COLUMNS}
          data={filteredData}
          renderCell={(item, key) => renderCell(item, key, handleEdit, handleDelete)}
        />
      </div>    

      <TambahArtikelModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveArtikel}
      />

      <EditArtikelModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        onSave={handleEditArtikel}
        article={selectedArticle}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={articleToDelete?.title || ''}
        itemType="artikel"
      />
    </div>
  );
}
