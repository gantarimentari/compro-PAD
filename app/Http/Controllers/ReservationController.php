<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;

class ReservationController extends Controller
{
    public function index(){
        $reservations = Reservation::with(['hewan.jenisHewan', 'pasien'])->get();

        $formatted = $reservations->map(function($reservation){
            return [
                'id' => $reservation->id,
                'ownerName' => $reservation->pasien->username,
                'ownerId' => $reservation->id_pasien,
                'petName' => $reservation->hewan->nama_hewan,
                'petId' => $reservation->id_hewan,
                'species' => $reservation->hewan->jenisHewan->nama_jenis,
                'date' => $reservation->tanggal_reservasi->format('d/m/Y'),
                'keluhan' => $reservation->keluhan ?? 'cek kesehatan bulanan',
                'status' => $reservation->status,
            ];
        });

        return response()->json($formatted);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'id_pasien' => 'required|exists:users,id',
            'id_hewan' => 'required|exists:hewan,id_hewan',
            'tanggal_reservasi' => 'required|date',
            'keluhan' => 'required|string',
            'status' => 'nullable|in:pending,belum,selesai,batal',
        ]);

        $reservation = Reservation::create($validated);

        return response()->json($reservation->load(['hewan.jenisHewan', 'pasien']), 201);
    }

    public function show(Reservation $reservation){
        return response()->json($reservation->load(['hewan.jenisHewan', 'pasien']));
    }

    public function update(Request $request, Reservation $reservation){
        try {
            $validated = $request->validate([
                'id_hewan' => 'sometimes|exists:hewan,id_hewan',
                'tanggal_reservasi' => 'sometimes|date',
                'keluhan' => 'nullable|string',
                'status' => 'sometimes|in:pending,belum,selesai,batal',
            ]);

            $reservation->update($validated);
            
            return response()->json($reservation->load(['hewan.jenisHewan', 'pasien']));
        } catch (\Exception $e) {
            \Log::error('Error updating reservation: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return response()->json(['message' => 'Reservasi berhasil dihapus']);
    }

    public function updateStatus(Request $request, Reservation $reservation)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:pending,belum,selesai,batal',
            ]);

            $reservation->update(['status' => $validated['status']]);
            
            return response()->json($reservation);
        } catch (\Exception $e) {
            \Log::error('Error updating status: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
