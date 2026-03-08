<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\Media;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ArticleController extends Controller
{
    /**
     * Convert image to WebP using native PHP GD
     */
    private function convertToWebP($file, $destinationPath)
    {
        try {
            // check if GD extension is loaded
            if (!extension_loaded('gd')) {
                Log::warning('GD extension not available, storing original file');
                return $file->store($destinationPath, 'public');
            }

            // generate filename
            $filename = time() . '_' . uniqid() . '.webp';
            $storagePath = storage_path('app/public/' . $destinationPath);
            
            // create directory if not exists
            if (!file_exists($storagePath)) {
                mkdir($storagePath, 0755, true);
            }
            
            $fullPath = $storagePath . '/' . $filename;

            // get image info
            $imageInfo = @getimagesize($file->path());
            if (!$imageInfo) {
                Log::warning('Cannot read image info, storing original file');
                return $file->store($destinationPath, 'public');
            }

            $mimeType = $imageInfo['mime'];

            // create image resource
            $image = null;
            switch ($mimeType) {
                case 'image/jpeg':
                    $image = @imagecreatefromjpeg($file->path());
                    break;
                case 'image/png':
                    $image = @imagecreatefrompng($file->path());
                    break;
                case 'image/gif':
                    $image = @imagecreatefromgif($file->path());
                    break;
                default:
                    Log::warning('Unsupported image type: ' . $mimeType);
                    return $file->store($destinationPath, 'public');
            }

            if (!$image) {
                Log::warning('Failed to create image resource, storing original file');
                return $file->store($destinationPath, 'public');
            }

            // get dimensions
            $width = imagesx($image);
            $height = imagesy($image);

            // resize if larger than 1920px
            $maxWidth = 1920;
            if ($width > $maxWidth) {
                $ratio = $maxWidth / $width;
                $newWidth = $maxWidth;
                $newHeight = (int)($height * $ratio);
                
                $resized = imagecreatetruecolor($newWidth, $newHeight);
                imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                imagedestroy($image);
                $image = $resized;
            }

            // convert to WebP
            $success = imagewebp($image, $fullPath, 85);
            imagedestroy($image);

            if (!$success) {
                Log::warning('Failed to save WebP, storing original file');
                return $file->store($destinationPath, 'public');
            }

            Log::info('Image converted to WebP successfully: ' . $filename);
            return $destinationPath . '/' . $filename;

        } catch (\Exception $e) {
            Log::error('WebP conversion error: ' . $e->getMessage());
            Log::info('Falling back to original file storage');
            return $file->store($destinationPath, 'public');
        }
    }

    /**
     * Display articles based on user authentication
     * - Public: Only show published articles
     * - Admin: Show all articles (Draft + Publish)
     */
    public function index(Request $request)
    {
        //  Check if user is authenticated admin
        $user = $request->user();
        
        //  If admin authenticated: show ALL, else: only Publish
        if ($user && isset($user->role) && $user->role === 'admin') {
            // Admin: Get ALL articles
            $articles = Article::orderBy('created_at', 'desc')->get();
        } else {
            // Public: Only published articles
            $articles = Article::where('status', 'Publish')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        $formattedArticles = $articles->map(function ($article) {
            $imageUrl = null;
        
            if ($article->image) {
                if (str_starts_with($article->image, 'http')) {
                    $imageUrl = $article->image;
                } else {
                    $imageUrl = url('storage/' . $article->image);
                }
            }

            return [
                'id' => $article->id,
                'title' => $article->title,
                'content' => $article->content,
                'category' => $article->category,
                'status' => $article->status,
                'imageUrl' => $imageUrl,
                'image' => $article->image,
                'created_at' => $article->created_at,
                'updated_at' => $article->updated_at,
            ];
        });

        return response()->json($formattedArticles);
    }

    /**
     * Display ALL articles for admin dashboard
     *  Show both Draft and Publish
     */
    public function indexAdmin()
    {
        //  Get ALL articles (no status filter)
        $articles = Article::orderBy('created_at', 'desc')->get();

        $formattedArticles = $articles->map(function ($article) {
            $imageUrl = null;
        
            if ($article->image) {
                if (str_starts_with($article->image, 'http')) {
                    $imageUrl = $article->image;
                } else {
                    $imageUrl = url('storage/' . $article->image);
                }
            }

            return [
                'id' => $article->id,
                'title' => $article->title,
                'content' => $article->content,
                'category' => $article->category,
                'status' => $article->status, //  Will be 'Draft' or 'Publish'
                'imageUrl' => $imageUrl,
                'image' => $article->image,
                'created_at' => $article->created_at,
                'updated_at' => $article->updated_at,
            ];
        });

        return response()->json($formattedArticles);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:Draft,Publish',
            'author' => 'nullable|string|max:100',
            'publish_date' => 'nullable|date',
            'image' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp|max:10240',
        ]);

        try {
            $imagePath = null;

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                
                $imagePath = $this->convertToWebP($file, 'articles');
                
                Log::info('Article image stored directly', [
                    'path' => $imagePath,
                    'folder' => 'articles',
                    'note' => 'Not saved to media table'
                ]);
            }

            $article = Article::create([
                'title' => $validated['title'],
                'content' => $validated['content'],
                'category' => $validated['category'] ?? 'General',
                'status' => $validated['status'] ?? 'Draft',
                'author' => $validated['author'] ?? 'Admin',
                'publish_date' => $validated['publish_date'] ?? now(),
                'image_url' => $imagePath,
                'image' => $imagePath,
            ]);

            return response()->json([
                'message' => 'Article created successfully',
                'article' => $article
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating article: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'message' => 'Failed to create article',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:Draft,Publish',
            'author' => 'nullable|string|max:100',
            'publish_date' => 'nullable|date',
            'image' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp|max:10240',
        ]);

        try {
            $article = Article::findOrFail($id);

            // Upload gambar baru jika ada
            if ($request->hasFile('image')) {
                // Hapus gambar lama
                if ($article->image_url && Storage::disk('public')->exists($article->image_url)) {
                    Storage::disk('public')->delete($article->image_url);
                    Log::info('Old article image deleted', ['path' => $article->image_url]);
                }

                // Jika ada kolom 'image' terpisah, hapus juga
                if ($article->image && $article->image !== $article->image_url && Storage::disk('public')->exists($article->image)) {
                    Storage::disk('public')->delete($article->image);
                }

                // Upload gambar baru
                $imagePath = $this->convertToWebP($request->file('image'), 'articles');
                $validated['image_url'] = $imagePath;
                $validated['image'] = $imagePath;
            }

            $article->update([
                'title' => $validated['title'],
                'content' => $validated['content'],
                'category' => $validated['category'] ?? $article->category,
                'status' => $validated['status'] ?? $article->status,
                'author' => $validated['author'] ?? $article->author,
                'publish_date' => $validated['publish_date'] ?? $article->publish_date,
                'image_url' => $validated['image_url'] ?? $article->image_url,
                'image' => $validated['image'] ?? $article->image,
            ]);

            return response()->json([
                'message' => 'Article updated successfully',
                'article' => $article
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating article: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update article',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $article = Article::findOrFail($id);

            if ($article->image_url && Storage::disk('public')->exists($article->image_url)) {
                Storage::disk('public')->delete($article->image_url);
                Log::info('Article image deleted from storage', ['path' => $article->image_url]);
            }

            $article->delete();

            return response()->json([
                'message' => 'Article deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting article: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete article',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
