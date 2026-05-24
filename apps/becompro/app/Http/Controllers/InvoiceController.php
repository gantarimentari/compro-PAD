<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\Hewan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    /**
     * =========================================================
     * LIST SEMUA INVOICE
     * =========================================================
     */
    public function index()
    {
        $invoice = Invoice::with([
            'pasien:id,username',
            'hewan:id_hewan,nama_hewan'
        ])
        ->withCount('details')
        ->latest()
        ->get();

        return response()->json($invoice);
    }

    /**
     * =========================================================
     * AMBIL HEWAN BERDASARKAN PASIEN
     * =========================================================
     */
    public function getHewanByPasien($id_pasien)
    {
        $hewan = Hewan::where('id_pasien', $id_pasien)
            ->get();

        return response()->json($hewan);
    }

    /**
     * =========================================================
     * MEMBUAT INVOICE BARU
     * =========================================================
     */
    public function store(Request $request)
    {
        $request->validate([

            /*
            |--------------------------------------------------------------------------
            | HEADER INVOICE
            |--------------------------------------------------------------------------
            */

            'id_pasien' => 'required|exists:users,id',

            'id_hewan' => 'required|exists:hewan,id_hewan',

            'tanggal_invoice' => 'required|date',

            'jatuh_tempo' => 'nullable|date',

            'diskon_persen' => 'nullable|numeric|min:0',

            'pajak_persen' => 'nullable|numeric|min:0',

            'status' => 'required|in:lunas,belum_lunas',

            'catatan' => 'nullable|string',

            /*
            |--------------------------------------------------------------------------
            | ITEM INVOICE
            |--------------------------------------------------------------------------
            */

            'items' => 'required|array|min:1',

            'items.*.nama_item' => 'required|string',

            'items.*.kategori' => 'nullable|string',

            'items.*.qty' => 'required|integer|min:1',

            'items.*.harga_satuan' =>
                'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {

            /*
            |--------------------------------------------------------------------------
            | HITUNG SUBTOTAL
            |--------------------------------------------------------------------------
            */

            $subtotal = 0;

            foreach ($request->items as $item) {

                $itemSubtotal =
                    $item['qty'] *
                    $item['harga_satuan'];

                $subtotal += $itemSubtotal;
            }

            /*
            |--------------------------------------------------------------------------
            | HITUNG DISKON
            |--------------------------------------------------------------------------
            */

            $diskonPersen =
                $request->diskon_persen ?? 0;

            $diskonNominal =
                $subtotal *
                ($diskonPersen / 100);

            /*
            |--------------------------------------------------------------------------
            | SUBTOTAL SETELAH DISKON
            |--------------------------------------------------------------------------
            */

            $subtotalSetelahDiskon =
                $subtotal - $diskonNominal;

            /*
            |--------------------------------------------------------------------------
            | HITUNG PAJAK
            |--------------------------------------------------------------------------
            */

            $pajakPersen =
                $request->pajak_persen ?? 0;

            $pajakNominal =
                $subtotalSetelahDiskon *
                ($pajakPersen / 100);

            /*
            |--------------------------------------------------------------------------
            | HITUNG TOTAL
            |--------------------------------------------------------------------------
            */

            $total =
                $subtotalSetelahDiskon +
                $pajakNominal;

            /*
            |--------------------------------------------------------------------------
            | BUAT INVOICE
            |--------------------------------------------------------------------------
            */

            $invoice = Invoice::create([

                'id_pasien' => $request->id_pasien,

                'id_hewan' => $request->id_hewan,

                'tanggal_invoice' =>
                    $request->tanggal_invoice,

                'jatuh_tempo' =>
                    $request->jatuh_tempo,

                'subtotal' => $subtotal,

                'diskon_persen' => $diskonPersen,

                'diskon_nominal' => $diskonNominal,

                'pajak_persen' => $pajakPersen,

                'pajak_nominal' => $pajakNominal,

                'total' => $total,

                'status' => $request->status,

                'catatan' => $request->catatan
            ]);

            /*
            |--------------------------------------------------------------------------
            | GENERATE KODE INVOICE
            |--------------------------------------------------------------------------
            */

            $invoice->kode_invoice =
                'INV-' .
                date('Ym') .
                '-' .
                str_pad(
                    $invoice->id_invoice,
                    4,
                    '0',
                    STR_PAD_LEFT
                );

            $invoice->save();

            /*
            |--------------------------------------------------------------------------
            | SIMPAN DETAIL INVOICE
            |--------------------------------------------------------------------------
            */

            foreach ($request->items as $item) {

                InvoiceDetail::create([

                    'id_invoice' =>
                        $invoice->id_invoice,

                    'nama_item' =>
                        $item['nama_item'],

                    'kategori' =>
                        $item['kategori'] ?? null,

                    'qty' =>
                        $item['qty'],

                    'harga_satuan' =>
                        $item['harga_satuan'],

                    'subtotal' =>
                        $item['qty'] *
                        $item['harga_satuan']
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Invoice berhasil dibuat',
                'data' => $invoice->load([
                    'pasien',
                    'hewan',
                    'details'
                ])
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Gagal membuat invoice',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * =========================================================
     * DETAIL INVOICE
     * =========================================================
     */
    public function show($id)
    {
        $invoice = Invoice::with([
            'pasien',
            'hewan',
            'details'
        ])->findOrFail($id);

        return response()->json($invoice);
        
    }
    public function update(Request $request, $id)
    {
        $request->validate([

            /*
            |--------------------------------------------------------------------------
            | HEADER INVOICE
            |--------------------------------------------------------------------------
            */

            'id_pasien' => 'nullable|exists:users,id',

            'id_hewan' => 'nullable|exists:hewan,id_hewan',

            'tanggal_invoice' => 'nullable|date',

            'jatuh_tempo' => 'nullable|date',

            'diskon_persen' => 'nullable|numeric|min:0',

            'pajak_persen' => 'nullable|numeric|min:0',

            'status' => 'nullable|in:lunas,belum_bayar',

            'catatan' => 'nullable|string',

            /*
            |--------------------------------------------------------------------------
            | ITEM INVOICE
            |--------------------------------------------------------------------------
            */

            'items' => 'nullable|array|min:1',

            'items.*.nama_item' => 'required_with:items|string',

            'items.*.kategori' => 'nullable|string',

            'items.*.qty' => 'required_with:items|integer|min:1',

            'items.*.harga_satuan' => 'required_with:items|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {

            $invoice = Invoice::findOrFail($id);

            /*
            |--------------------------------------------------------------------------
            | JIKA ADA ITEMS, HITUNG ULANG TOTAL
            |--------------------------------------------------------------------------
            */

            if ($request->has('items')) {

                $subtotal = 0;

                foreach ($request->items as $item) {

                    $itemSubtotal =
                        $item['qty'] *
                        $item['harga_satuan'];

                    $subtotal += $itemSubtotal;
                }

                /*
                |--------------------------------------------------------------------------
                | HITUNG DISKON
                |--------------------------------------------------------------------------
                */

                $diskonPersen =
                    $request->diskon_persen ?? $invoice->diskon_persen ?? 0;

                $diskonNominal =
                    $subtotal *
                    ($diskonPersen / 100);

                /*
                |--------------------------------------------------------------------------
                | SUBTOTAL SETELAH DISKON
                |--------------------------------------------------------------------------
                */

                $subtotalSetelahDiskon =
                    $subtotal - $diskonNominal;

                /*
                |--------------------------------------------------------------------------
                | HITUNG PAJAK
                |--------------------------------------------------------------------------
                */

                $pajakPersen =
                    $request->pajak_persen ?? $invoice->pajak_persen ?? 0;

                $pajakNominal =
                    $subtotalSetelahDiskon *
                    ($pajakPersen / 100);

                /*
                |--------------------------------------------------------------------------
                | HITUNG TOTAL
                |--------------------------------------------------------------------------
                */

                $total =
                    $subtotalSetelahDiskon +
                    $pajakNominal;

                /*
                |--------------------------------------------------------------------------
                | UPDATE NILAI-NILAI INVOICE
                |--------------------------------------------------------------------------
                */

                $invoice->subtotal = $subtotal;
                $invoice->diskon_persen = $diskonPersen;
                $invoice->diskon_nominal = $diskonNominal;
                $invoice->pajak_persen = $pajakPersen;
                $invoice->pajak_nominal = $pajakNominal;
                $invoice->total = $total;

            }

            /*
            |--------------------------------------------------------------------------
            | UPDATE FIELD LAINNYA
            |--------------------------------------------------------------------------
            */

            $invoice->id_pasien = $request->id_pasien ?? $invoice->id_pasien;
            $invoice->id_hewan = $request->id_hewan ?? $invoice->id_hewan;
            $invoice->tanggal_invoice = $request->tanggal_invoice ?? $invoice->tanggal_invoice;
            $invoice->jatuh_tempo = $request->jatuh_tempo ?? $invoice->jatuh_tempo;
            $invoice->status = $request->status ?? $invoice->status;
            $invoice->catatan = $request->catatan ?? $invoice->catatan;

            $invoice->save();

            /*
            |--------------------------------------------------------------------------
            | HAPUS DAN BUAT ULANG DETAIL INVOICE
            |--------------------------------------------------------------------------
            */

            if ($request->has('items')) {

                $invoice->details()->delete();

                foreach ($request->items as $item) {

                    InvoiceDetail::create([

                        'id_invoice' =>
                            $invoice->id_invoice,

                        'nama_item' =>
                            $item['nama_item'],

                        'kategori' =>
                            $item['kategori'] ?? null,

                        'qty' =>
                            $item['qty'],

                        'harga_satuan' =>
                            $item['harga_satuan'],

                        'subtotal' =>
                            $item['qty'] *
                            $item['harga_satuan']
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Invoice berhasil diperbarui',
                'data' => $invoice->load([
                    'pasien',
                    'hewan',
                    'details'
                ])
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Gagal memperbarui invoice',
                'error' => $e->getMessage()
            ], 500);
        }
    }


public function search(Request $request)
    {
        $query = $request->input('q');

        if (!$query) {
            return response()->json([
                'message' => 'Query tidak boleh kosong',
                'data' => []
            ]);
        }

        $invoices = Invoice::with([
            'pasien:id,username',
            'hewan:id_hewan,nama_hewan'
        ])
        ->where('kode_invoice', 'like', "%{$query}%")
        ->orWhereHas('pasien', function ($subquery) use ($query) {
            $subquery->where('username', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
        })
        ->orWhereHas('hewan', function ($subquery) use ($query) {
            $subquery->where('nama_hewan', 'like', "%{$query}%");
        })
        ->withCount('details')
        ->latest()
        ->get();

        return response()->json([
            'message' => 'Search invoice',
            'data' => $invoices,
            'total' => $invoices->count()
        ]);
    }

    /**
     * =========================================================
     * KONFIRMASI PEMBAYARAN
     * =========================================================
     */
    public function confirmPayment($id)
    {
        $invoice = Invoice::findOrFail($id);

        $invoice->status = 'lunas';

        $invoice->save();

        return response()->json([
            'message' => 'Invoice berhasil dilunasi',
            'data' => $invoice
        ]);
    }

    /**
     * =========================================================
     * HAPUS INVOICE
     * =========================================================
     */
    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);

        $invoice->delete();

        return response()->json([
            'message' => 'Invoice berhasil dihapus'
        ]);
    }
}