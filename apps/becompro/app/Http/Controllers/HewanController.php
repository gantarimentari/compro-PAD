<?php

namespace App\Http\Controllers;

use App\Models\Hewan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HewanController extends Controller
{
    public function index()
    {
        //  Get all hewans with relationships
        $hewans = Hewan::with(['pasien', 'jenisHewan'])->get();
        
        Log::info('📦 All Hewans:', ['count' => $hewans->count()]);
        
        //  Group by owner/pasien
        $grouped = $hewans->groupBy('id_pasien')->map(function ($hewans, $pasienId) {
            $firstHewan = $hewans->first();
            
            $ownerData = [
                'id' => $pasienId,
                'name' => $firstHewan->pasien->name ?? $firstHewan->pasien->username ?? 'Unknown',
                'email' => $firstHewan->pasien->email ?? '',
                'pets' => $hewans->map(function ($hewan) {
                    return [
                        'id' => $hewan->id_hewan,
                        'petName' => $hewan->nama_hewan,
                        'speciesId' => $hewan->id_jenisHewan, //  Important!
                        'speciesName' => $hewan->jenisHewan->nama_jenis ?? '',
                        'birthDate' => $hewan->tanggal_lahir_hewan,
                    ];
                })->values(),
            ];
            
            //  Log each owner's data
            Log::info("👤 Owner {$pasienId} ({$ownerData['name']}):", [
                'pets_count' => $ownerData['pets']->count(),
                'species_ids' => $ownerData['pets']->pluck('speciesId')->unique()->values()
            ]);
            
            return $ownerData;
        })->values();

        Log::info(' Grouped Data:', ['owners_count' => $grouped->count()]);
        
        return response()->json($grouped);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id_pasien' => 'required|exists:users,id',
            'id_jenisHewan' => 'required|exists:jenis_hewan,id_jenisHewan',
            'nama_hewan' => 'required',
            'tanggal_lahir_hewan' => 'nullable|date',
        ]);

        $hewan = Hewan::create($data);
        return response()->json($hewan->load(['pasien', 'jenisHewan']), 201);
    }

    public function show(Hewan $hewan)
    {
        return response()->json($hewan->load(['pasien', 'jenisHewan']));
    }

    public function update(Request $request, Hewan $hewan)
    {
        $data = $request->validate([
            'id_pasien' => 'required|exists:users,id',
            'id_jenisHewan' => 'required|exists:jenis_hewan,id_jenisHewan',
            'nama_hewan' => 'required',
            'tanggal_lahir_hewan' => 'nullable|date',
        ]);

        $hewan->update($data);
        return response()->json($hewan->load(['pasien', 'jenisHewan']));
    }

    public function destroy(Hewan $hewan)
    {
        $hewan->delete();
        return response()->json(['message' => 'Hewan deleted']);
    }
}