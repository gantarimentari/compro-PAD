<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use Illuminate\Http\Request;

class PromoController extends Controller
{
    public function index(){
        try{
            $promos = Promo::orderBy('start_date', 'desc')->get();

            $formatted = $promos->map(function($promo){
                return [
                    'id' => $promo->id,
                    'title' => $promo->title,
                    'description' => $promo->description,
                    'startDate' => $promo->start_date->format('Y-m-d'), // Format ISO untuk input date
                    'endDate' => $promo->end_date->format('Y-m-d'),
                    'startDateDisplay' => $promo->start_date->format('d/m/Y'), // Format display
                    'endDateDisplay' => $promo->end_date->format('d/m/Y'),
                    'status' => ucfirst($promo->status), // Available/Unavailable
                    'tanggalDibuat'=>$promo->created_at->format('Y-m-d H:i:s'),
                    'created_at' => $promo->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $promo->updated_at->format('Y-m-d H:i:s'),
                ];
            });
            return response()->json($formatted);
        } catch (\Exception $e){
            \Log::error('Error fetching promos:'. $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    } 

     public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'status' => 'nullable|in:available,unavailable',
            ]);

            // Convert status ke lowercase jika ada
            if (isset($validated['status'])) {
                $validated['status'] = strtolower($validated['status']);
            }else {
                $validated['status'] = 'available'; // Default
            }

            $promo = Promo::create($validated);

            return response()->json($promo, 201);
        } catch (\Exception $e) {
            \Log::error('Error creating promo: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Promo $promo)
    {
        return response()->json([
            'id' => $promo->id,
            'title' => $promo->title,
            'description' => $promo->description,
            'startDate' => $promo->start_date->format('Y-m-d'),
            'endDate' => $promo->end_date->format('Y-m-d'),
            'startDateDisplay' => $promo->start_date->format('d/m/Y'),
            'endDateDisplay' => $promo->end_date->format('d/m/Y'),
            'status' => ucfirst($promo->status),
            'tanggalDibuat'=>$promo->created_at,
            'created_at' => $promo->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $promo->updated_at->format('Y-m-d H:i:s'),
        ]);
    }

    public function update(Request $request, Promo $promo)
    {
        try {
            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'start_date' => 'sometimes|date',
                'end_date' => 'sometimes|date|after_or_equal:start_date',
                'status' => 'sometimes|in:available,unavailable',
            ]);

            // Convert status ke lowercase jika ada
            if (isset($validated['status'])) {
                $validated['status'] = strtolower($validated['status']);
            }

            $promo->update($validated);

            return response()->json($promo);
        } catch (\Exception $e) {
            \Log::error('Error updating promo: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Promo $promo)
    {
        $promo->delete();
        return response()->json(['message' => 'Promo berhasil dihapus']);
    }
}
