<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Promo;

class PublicPromoController extends Controller
{
    /**
     * Get available promos for public view (no auth required)
     */
    public function index()
    {
        try {
            //  Get only available promos, sorted by latest
            $promos = Promo::where('status', 'available')
                ->orderBy('created_at', 'desc')
                ->take(3) // Limit to 3
                ->get(['id', 'title', 'description', 'status', 'created_at', 'start_date', 'end_date']);

            return response()->json($promos);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching promos',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
