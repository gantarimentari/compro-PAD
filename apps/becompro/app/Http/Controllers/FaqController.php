<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class FaqController extends Controller
{
    public function index(Request $request)
{
    try {
        $request->validate([
            'q' => 'nullable|string|max:255',
        ]);

        $query = Faq::query();

        // cek user is admin?
        $user = $request->user();
        
        // if not admin, cuma publish yang keliatan
        if (!($user && isset($user->role) && $user->role === 'admin')) {
            $query->where('status', 'publish');
        }
        // jika admin, tampilkan semua (publish + draft)

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($builder) use ($q) {
                $builder->where('question', 'like', '%' . $q . '%')
                    ->orWhere('answer', 'like', '%' . $q . '%');
            });
        }

        $faqs = $query->orderBy('id_faq', 'desc')->paginate(10);

        if ($faqs->isEmpty()) {
            return response()->json([
                'message' => 'Data tidak tersedia',
                'data' => []
            ], 200);
        }

        return response()->json($faqs);
    } catch (\Exception $e) {
        Log::error('Error fetching faq: ' . $e->getMessage());
        return response()->json(['message' => 'Failed to fetch faq'], 500);
    }
}
    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'status' => 'sometimes|in:publish,draft',
        ]);

        try {
            // set default ke draft kalo ga disediakan, gapapa
            if (!isset($validated['status'])) {
                $validated['status'] = 'draft';
            }

            $faq = Faq::create($validated);

            return response()->json([
                'message' => 'Faq created successfully',
                'data' => $faq,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating faq: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create faq'], 500);
        }
    }

    public function show($id)
    {
        try {
            $faq = Faq::findOrFail($id);
            return response()->json($faq);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Faq not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'question' => 'sometimes|string',
            'answer' => 'sometimes|string',
            'status' => 'sometimes|in:publish,draft',
        ]);

        try {
            $faq = Faq::findOrFail($id);
            $faq->update($validated);

            return response()->json([
                'message' => 'Faq updated successfully',
                'data' => $faq,
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Faq not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error updating faq: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update faq'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $faq = Faq::findOrFail($id);
            $faq->delete();

            return response()->json([
                'message' => 'Faq deleted successfully',
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Faq not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting faq: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete faq'], 500);
        }
    }
}