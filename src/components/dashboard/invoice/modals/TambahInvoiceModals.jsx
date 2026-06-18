import { useEffect, useState } from 'react';
import BaseModal from '../../shared-modals/BaseModal';
import InputField from '../_components/Inputfield';
import ButtonSaveandClose from '../../shared-modals/ButtonSaveandClose';
import { AddIcon, CloseIcon } from '@/components/icons';
import patientService from '@/lib/services/patientService';
import InvoiceService from '@/lib/services/invoiceService';

const TambahInvoiceModals = ({ editingData, isOpen, onClose, onSave, isSubmitting, isDetailLoading, formData, setFormData }) => {
  const [draftItem, setDraftItem] = useState({
    nama_item: '',
    kategori: '',
    qty: 1,
    harga_satuan: 0,
  });
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [hewanOptions, setHewanOptions] = useState([]);

  const itemList = formData.item || [];

  const currencyFormat = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const subtotal = itemList.reduce((total, item) => total + Number(item.qty || 0) * Number(item.harga_satuan || 0), 0);

  useEffect(() => {
    if (!isOpen) {
      setOwnerOptions([]);
      setHewanOptions([]);
      return;
    }

    const loadOwners = async () => {
      try {
        const data = await patientService.getAll();
        setOwnerOptions(
          (data || []).map((patient) => ({
            id: patient.id,
            label: patient.username || patient.name || patient.email || `Pasien ${patient.id}`,
          }))
        );
      } catch (error) {
        if (error?.response?.status !== 401) {
          console.error('Gagal memuat pasien:', error);
        }
      }
    };

    loadOwners();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !formData.id_pasien) {
      setHewanOptions([]);
      return;
    }

    const loadHewan = async () => {
      try {
        const data = await InvoiceService.getHewanByPasien(formData.id_pasien);
        setHewanOptions(
          (data || []).map((hewan) => ({
            id: hewan.id_hewan,
            label: hewan.nama_hewan || hewan.petName || `Hewan ${hewan.id_hewan}`,
          }))
        );
      } catch (error) {
        if (error?.response?.status !== 401) {
          console.error('Gagal memuat hewan:', error);
        }
        setHewanOptions([]);
      }
    };

    loadHewan();
  }, [formData.id_pasien, isOpen]);

  // const addItem = () => {
  //   if (!draftItem.nama_item.trim()) return;

  //   setFormData((prev) => ({
  //     ...prev,
  //     item: [
  //       ...(prev.item || []),
  //       {
  //         id: `${Date.now()}`,
  //         id_jenis_vaksin: null,
  //         nama_item: draftItem.nama_item,
  //         kategori: draftItem.kategori,
  //         qty: Number(draftItem.qty || 0),
  //         harga_satuan: Number(draftItem.harga_satuan || 0),
  //       },
  //     ],
  //   }));

  //   setDraftItem({
  //     nama_item: '',
  //     kategori: '',
  //     qty: 1,
  //     harga_satuan: 0,
  //   });
  // };
  

const addItem = () => {
    // Validasi Nama Item tidak boleh kosong
    if (!draftItem.nama_item.trim()) {
      alert('Nama item tidak boleh kosong!');
      return;
    }

    // 🔑 KUNCI VALIDASI HARGA SATUAN:
    const rawHarga = draftItem.harga_satuan;
    const parsedHarga = Number(rawHarga);

    // Cek jika input kosong atau menghasilkan NaN (bukan angka murni)
    if (rawHarga === '' || rawHarga === null || isNaN(parsedHarga)) {
      alert('Harga Satuan harus diisi dengan angka numerik yang valid!');
      return;
    }

    // Cek jika nilai berharga minus
    if (parsedHarga < 0) {
      alert('Harga Satuan tidak boleh kurang dari 0 atau bernilai minus!');
      return;
    }

    // Cek jika yang diinput berupa karakter strip tunggal '-' atau eksponen 'e'
    if (String(rawHarga).trim() === '-' || String(rawHarga).toLowerCase().includes('e')) {
      alert('Format harga tidak valid. Harap masukkan angka murni!');
      return;
    }

    // 🔑 KUNCI VALIDASI QTY:
    const parsedQty = parseInt(draftItem.qty, 10);
    if (isNaN(parsedQty) || parsedQty < 1) {
      alert('Jumlah Qty minimal harus 1!');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      item: [
        ...(prev.item || []),
        {
          id: `${Date.now()}`,
          id_jenis_vaksin: null,
          nama_item: draftItem.nama_item,
          kategori: draftItem.kategori,
          qty: parsedQty,
          harga_satuan: parsedHarga,
        },
      ],
    }));

    setDraftItem({
      nama_item: '',
      kategori: '',
      qty: 1,
      harga_satuan: 0,
    });
  };

  const removeItem = (id) => {
    setFormData((prev) => ({
      ...prev,
      item: (prev.item || []).filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (typeof onSave !== 'function') return;

    if (itemList.length === 0) {
      alert('Tambahkan minimal 1 item invoice');
      return;
    }

    await onSave({
      ...formData,
      items: itemList,
    });
  };

  const title = editingData ? 'Edit Invoice' : 'Buat Invoice Baru';
  const description = editingData ? 'Edit' : 'Tambahkan';


  return (
    <BaseModal
      maxWidth="max-w-2xl"
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={`${description} item layanan/obat, sistem akan menghitung total otomatis.`}
    >
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-4 px-6 pb-6 pt-2">
        {isDetailLoading ? (
          <div className="absolute inset-0 z-10 rounded-b-lg bg-white/80 backdrop-blur-[1px]">
            <div className="flex h-full flex-col gap-4 p-6">
              <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
              </div>
              <div className="h-40 animate-pulse rounded-xl bg-slate-200" />
              <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="block text-sm font-medium text-accent-neutral-1000">Pemilik (Pasien)</span>
            <select
              value={formData.id_pasien}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  id_pasien: e.target.value,
                  id_hewan: '',
                }))
              }
              className="w-full rounded-lg bg-accent-neutral-275 px-4 py-2.5 text-body-2 text-accent-neutral-1000 outline-none transition focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih pasien</option>
              {ownerOptions.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="block text-sm font-medium text-accent-neutral-1000">Hewan</span>
            <select
              value={formData.id_hewan}
              onChange={(e) => setFormData((prev) => ({ ...prev, id_hewan: e.target.value }))}
              disabled={!formData.id_pasien}
              className="w-full rounded-lg bg-accent-neutral-275 px-4 py-2.5 text-body-2 text-accent-neutral-1000 outline-none transition focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              required
            >
              <option value="">{formData.id_pasien ? 'Pilih hewan' : 'Pilih pasien terlebih dahulu'}</option>
              {hewanOptions.map((hewan) => (
                <option key={hewan.id} value={hewan.id}>
                  {hewan.label}
                </option>
              ))}
            </select>
          </label>

          <InputField
            label="Tanggal Invoice"
            type="date"
            value={formData.tanggal_invoice}
            onChange={(e) => setFormData((prev) => ({ ...prev, tanggal_invoice: e.target.value }))}
            required
          />
          <InputField
            label="Jatuh Tempo"
            type="date"
            value={formData.jatuh_tempo}
            onChange={(e) => setFormData((prev) => ({ ...prev, jatuh_tempo: e.target.value }))}
          />
        </div>

        <div className="border border-[#E5E7EB] rounded-xl p-4">
          <p className="block text-h-8 font-bold text-accent-neutral-1000">Tambah Item</p>

          <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_72px_minmax(0,1fr)_auto]">
            <label className="space-y-1">
              <span className="block text-sm font-medium text-accent-neutral-1000">Nama Item</span>
              <input
                type="text"
                value={draftItem.nama_item}
                onChange={(e) => setDraftItem((prev) => ({ ...prev, nama_item: e.target.value }))}
                className="w-full rounded-lg bg-accent-neutral-275 px-4 py-2.5 text-body-2 text-accent-neutral-1000 outline-none transition focus:ring-2 focus:ring-blue-500"
                placeholder="Nama item"
              />
            </label>

            <label className="space-y-1">
              <span className="block text-sm font-medium text-accent-neutral-1000">Kategori</span>
              <input
                type="text"
                value={draftItem.kategori}
                onChange={(e) => setDraftItem((prev) => ({ ...prev, kategori: e.target.value }))}
                className="w-full rounded-lg bg-accent-neutral-275 px-4 py-2.5 text-body-2 text-accent-neutral-1000 outline-none transition focus:ring-2 focus:ring-blue-500"
                placeholder="Kategori"
              />
            </label>

            <label className="space-y-1">
              <span className="block text-sm font-medium text-accent-neutral-1000">Qty</span>
              <input
                type="number"
                min="1"
                value={draftItem.qty}
                onChange={(e) => setDraftItem((prev) => ({ ...prev, qty: e.target.value }))}
                className="w-full rounded-lg bg-accent-neutral-275 px-4 py-2.5 text-body-2 text-accent-neutral-1000 outline-none transition focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
            </label>

            <label className="space-y-1">
              <span className="block text-sm font-medium text-accent-neutral-1000">Harga Satuan</span>
              <input
                type="number"
                min="0"
                value={draftItem.harga_satuan}
                onChange={(e) => setDraftItem((prev) => ({ ...prev, harga_satuan: e.target.value }))}
                className="w-full rounded-lg bg-accent-neutral-275 px-4 py-2.5 text-body-2 text-accent-neutral-1000 outline-none transition focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </label>

            <button
              type="button"
              onClick={addItem}
              className="mt-[23px] inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 text-sm font-semibold text-white transition hover:bg-[#2563EB]"
            >
              <AddIcon className="h-4 w-4" />
              Tambah
            </button>
          </div>

          <div className="mt-4 overflow-hidden">
            <div className="grid grid-cols-[minmax(0,1.6fr)_72px_minmax(0,0.9fr)_minmax(0,0.9fr)_32px] gap-3 border-b border-[#E5E7EB] px-4 py-3 text-xs font-semibold text-accent-neutral-800">
              <span>Item</span>
              <span>Qty</span>
              <span>Harga</span>
              <span>Subtotal</span>
              <span />
            </div>

            {itemList.length > 0 ? (
              itemList.map((item) => (
                <div key={item.id} className="grid grid-cols-[minmax(0,1.6fr)_72px_minmax(0,0.9fr)_minmax(0,0.9fr)_32px] items-center gap-3 px-4 py-3 text-sm text-accent-neutral-1000">
                  <div>
                    <p className="font-medium">{item.nama_item}</p>
                  </div>
                  <div className="w-fit rounded-lg bg-accent-neutral-275 px-3 py-1.5 text-center text-sm">{item.qty}</div>
                  <span>{currencyFormat(item.harga_satuan)}</span>
                  <span>{currencyFormat(Number(item.qty || 0) * Number(item.harga_satuan || 0))}</span>
                  <button type="button" onClick={() => removeItem(item.id)} className="text-accent-neutral-700 transition hover:text-red-500">
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="px-4 py-5 text-sm text-accent-neutral-700">Belum ada item ditambahkan.</div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-[#F9FAFB] px-4 py-3">
          <div className="grid gap-3 md:grid-cols-2">
            <span className="block h-8 font-bold text-accent-neutral-1000">
              Total <span className="font-normal">({itemList.length} item)</span>
            </span>
            <span className="justify-self-end text-right text-sm font-bold text-accent-blue-400">{currencyFormat(subtotal)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Diskon (%)"
            placeholder="Masukkan diskon"
            type="number"
            value={formData.diskon_persen}
            onChange={(e) => setFormData((prev) => ({ ...prev, diskon_persen: e.target.value }))}
          />
          <InputField
            label="Pajak (%)"
            placeholder="Masukkan pajak"
            type="number"
            value={formData.pajak_persen}
            onChange={(e) => setFormData((prev) => ({ ...prev, pajak_persen: e.target.value }))}
          />
          <label className="space-y-1">
            <span className="block text-sm font-medium text-accent-neutral-1000">Status</span>
            <select
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full rounded-lg bg-accent-neutral-275 px-4 py-2.5 text-body-2 text-accent-neutral-1000 outline-none transition focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="belum_lunas">Belum Lunas</option>
              <option value="lunas">Lunas</option>
            </select>
          </label>
          <InputField
            label="Catatan (Opsional)"
            placeholder="Catatan invoice..."
            value={formData.catatan}
            onChange={(e) => setFormData((prev) => ({ ...prev, catatan: e.target.value }))}
          />
        </div>

        <ButtonSaveandClose
          buttonLabel={editingData ? "Edit Invoice" : "Buat Invoice"}
          buttonLabelProcessing={editingData ? "Menyimpan perubahan..." : "Membuat invoice..."}
          onClose={onClose}
          isSubmitting={isSubmitting}
        />
      </form>
    </BaseModal>
  );
};

export default TambahInvoiceModals;
