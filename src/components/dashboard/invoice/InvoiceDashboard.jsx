"use client";
import { useState } from 'react';
import { useInvoice } from '@/components/dashboard/invoice/_hooks/useInvoice';
import { usePrintInvoice } from '@/components/dashboard/invoice/_hooks/usePrintInvoice';
import TambahInvoiceModals from '@/components/dashboard/invoice/modals/TambahInvoiceModals';
import InvoiceDetailModal from '@/components/dashboard/invoice/modals/InvoiceDetailModal';
import InvoicePaymentModal from '@/components/dashboard/invoice/modals/InvoicePaymentModal';

import { DeleteConfirmModal } from '@/components/dashboard';
import PageHeader from '@/components/shared/PageHeader';
import SearchBar from '@/components/shared/ManagementSearch';

import Table from '@/components/shared/Table';
import COLUMNS from './invoice.constants';
import { LoadingTable } from '../shared-modals/LoadingStatement';
import {tableRenderers} from './_components/TableCell';





export default function InvoiceDashboard() {
  const {
    isModalOpen,
    openModal,
    closeModal,
    formData,
    setFormData,
    handleSave,
    invoices,
    searchQuery,
    handleSearchChange,
    handleSearch,
    handleConfirmPayment,
    handleDeleteInvoice,
    handleConfirmDeleteInvoice,
    handleEditInvoice,
    openDetailModal,
    isLoading,
    isRefreshing,
    isSubmitting,
    isDetailLoading,
    isDeleteModalOpen,
    closeDeleteModal,
    isDetailModalOpen,
    closeDetailModal,
    isPaymentModalOpen,
    closePaymentModal,
    isDeleting,
    isConfirming,
    isEditing,
    paymentMethod,
    setPaymentMethod,
    invoiceToPay,
    invoiceToDelete,
    selectedInvoice,
    handleSubmitPayment,
    stats
  } = useInvoice();

  const { handlePrintInvoice } = usePrintInvoice();
  const [query, setQuery] = useState('');
// const [invoices, setInvoices] = useState([]); 



  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoice & Pembayaran"
        description="Kelola tagihan dan pembayaran layanan klinik"
        addButtonText="Buat Invoice"
        onAddClick={openModal}
      />

      <div className="space-y-4 pb-32">
        <div className="flex flex-col gap-3 justify-start">
          <div>
            <SearchBar
              placeholderText="Cari nomor invoice, pemilik, atau hewan..."
              value={searchQuery}
             onChange={(e) => {
                      handleSearchChange(e);  
                      handleSearch(e.target.value);
                    }}
            />
          </div>

          {isLoading ? (
            <LoadingTable/>
          ) : (
            <Table columns={COLUMNS} data={invoices} 
            renderCell={tableRenderers({
              handleEditInvoice,
              handleDeleteInvoice,
              openDetailModal,
              handlePrintInvoice,
              handleConfirmPayment,
            })} />
          )}

          {/* {isRefreshing ? <p className="text-xs text-slate-400">Memperbarui data...</p> : null} */}
        </div>
      </div>

      <TambahInvoiceModals
        editingData={isEditing}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        isSubmitting={isSubmitting}
        isDetailLoading={isDetailLoading}
        formData={formData}
        setFormData={setFormData}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDeleteInvoice}
        itemName={invoiceToDelete?.kode_invoice || invoiceToDelete?.id_invoice || ''}
        itemType="invoice"
        description={`Apakah Anda yakin ingin menghapus invoice "${invoiceToDelete?.kode_invoice || invoiceToDelete?.id_invoice || '-'}"? Tindakan ini tidak dapat dibatalkan.`}
      />

      <InvoiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        invoice={selectedInvoice}
        onPrint={handlePrintInvoice}
      />

      <InvoicePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        onConfirm={handleSubmitPayment}
        invoice={invoiceToPay}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        isConfirming={isConfirming}
      />

 
    </div>
  );
}