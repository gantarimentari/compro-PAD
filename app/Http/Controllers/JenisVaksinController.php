<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JenisVaksin;
use Log;

class JenisVaksinController extends Controller
{
        public function index()
    {
        try {
            $jenisVaksin = JenisVaksin::orderBy('nama_vaksin')->get();
            return response()->json($jenisVaksin);
        } catch (\Exception $e) {
            Log::error('Error fetching jenis vaksin: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch jenis vaksin'], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_vaksin'  => 'required|string|max:255|unique:jenis_vaksin,nama_vaksin',
            'interval'     => 'required|integer|min:1',
            'deskripsi'    => 'required|string|max:200',
            'efek_samping' => 'required|string',
            'status'       => 'required|in:active,inactive',
        ]);

        try {
            $jenisVaksin = JenisVaksin::create($validated);
            return response()->json([
                'message' => 'Jenis vaksin created successfully',
                'data'    => $jenisVaksin
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating jenis vaksin: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create jenis vaksin'], 500);
        }
    }

    public function show($id)
    {
        try {
            $jenisVaksin = JenisVaksin::findOrFail($id);
            return response()->json($jenisVaksin);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Jenis vaksin not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama_vaksin'  => 'sometimes|string|max:255|unique:jenis_vaksin,nama_vaksin,' . $id . ',id_vaksinasi',
            'interval'     => 'sometimes|integer|min:1',
            'deskripsi'    => 'sometimes|string|max:200',
            'efek_samping' => 'sometimes|string',
            'status'       => 'sometimes|in:active,inactive',
        ]);

        try {
            $jenisVaksin = JenisVaksin::findOrFail($id);
            $jenisVaksin->update($validated);
            return response()->json([
                'message' => 'Jenis vaksin updated successfully',
                'data'    => $jenisVaksin
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating jenis vaksin: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update jenis vaksin'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $jenisVaksin = JenisVaksin::findOrFail($id);
            $jenisVaksin->delete();
            return response()->json(['message' => 'Jenis vaksin deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting jenis vaksin: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete jenis vaksin'], 500);
        }
    }
}
