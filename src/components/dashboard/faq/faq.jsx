'use client';
import {useFaq} from './_hooks/useFaq';
import PageHeader from '@/components/shared/PageHeader';
import SearchBar from '@/components/shared/ManagementSearch';
import TambahFAQModal from '@/components/dashboard/faq/modals/TambahFAQModal';
import Table from '@/components/shared/Table';
import { DeleteConfirmModal} from '@/components/dashboard';
import {FAQ_COLUMNS} from './faq.constants';
import { tableRenderers } from './_components/TableCell';
import SuccessToast from '@/components/ui/SuccessToast';
import PreviewFAQModal from './modals/PreviewFAQModal';

export default function FAQ() {

  const {
    faqs,
    isLoading,
    isModalOpen,
    closeModal,
    openModal,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    openDeleteModal,
    handleDelete,
    editingData,
    openEditModal,
    handleSave,
    isSaving,
    successToast,
    isPreviewOpen,
    selectedFaq,
    openPreviewModal,
    closePreviewModal,
  } = useFaq();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Frequently Asked Questions"
        description="kelola pertanyaan-pertanyaan yang sering diajukan pasien"
        addButtonText="Tambah FAQ"
        onAddClick={openModal}
      />

      <div className="space-y-4">
        <SearchBar
          placeholderText="Cari judul, atau deskripsi..."
          value=""
          onChange={() => {}}
        />

        {isLoading ? (
          <div className="space-y-3 rounded-lg bg-white p-6 shadow-xl">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <Table
            columns={FAQ_COLUMNS}
            renderCell={tableRenderers(openEditModal, openDeleteModal, openPreviewModal)}
            data={faqs}
          />
        )}
      </div>

      <TambahFAQModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editingData={editingData}
        isSubmitting={isSaving}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        itemType="FAQ"
        description="Apakah Anda yakin ingin menghapus FAQ ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDelete}
      />
      <PreviewFAQModal
        isOpen={isPreviewOpen}
        onClose={closePreviewModal}
        faq={selectedFaq}
      />


      <SuccessToast show={successToast.show} message={successToast.message} />

    </div>
  );
}
