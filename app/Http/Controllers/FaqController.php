<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Faq::query();

            if ($request->filled('context')) {
                $query->where('context', 'like', '%' . $request->context . '%');
            }

            if ($request->filled('keyword')) {
                $query->where('keywords', 'like', '%' . $request->keyword . '%');
            }

            if ($request->filled('q')) {
                $q = $request->q;
                $query->where(function ($builder) use ($q) {
                    $builder->where('question', 'like', '%' . $q . '%')
                        ->orWhere('answer', 'like', '%' . $q . '%')
                        ->orWhere('keywords', 'like', '%' . $q . '%')
                        ->orWhere('context', 'like', '%' . $q . '%');
                });
            }

            $faqs = $query->orderBy('id_faq', 'desc')->paginate(10);

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
            'keywords' => 'required|string|max:100',
            'context' => 'required|string|max:255',
        ]);

        try {
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
        } catch (\Exception $e) {
            return response()->json(['message' => 'Faq not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'question' => 'sometimes|string',
            'answer' => 'sometimes|string',
            'keywords' => 'sometimes|string|max:100',
            'context' => 'sometimes|string|max:255',
        ]);

        try {
            $faq = Faq::findOrFail($id);
            $faq->update($validated);

            return response()->json([
                'message' => 'Faq updated successfully',
                'data' => $faq,
            ]);
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
        } catch (\Exception $e) {
            Log::error('Error deleting faq: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete faq'], 404);
        }
    }
    public function delete($id)
    {
        return $this->destroy($id);
    }
}