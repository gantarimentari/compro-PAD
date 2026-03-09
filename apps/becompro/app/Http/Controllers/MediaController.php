<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class MediaController extends Controller
{
    /**
     * Get all media with optional filter by days
     *  Exclude category 'foto-cards' from gallery
     *  Exclude 'Video' if exclude_video=true
     */
    public function index(Request $request)
    {
        try {
            $query = Media::query()
                ->where('category', '!=', 'foto-cards') //  Exclude foto-cards
                ->orderBy('created_at', 'desc');

            // tambahkan parameter untuk exclude video
            if ($request->has('exclude_video') && $request->exclude_video === 'true') {
                $query->where('category', '!=', 'Video');
            }

            if ($request->has('days') && $request->days !== 'all') {
                $days = (int) $request->days;
                $cutoffDate = Carbon::now()->subDays($days);
                $query->where('created_at', '>=', $cutoffDate);
            }

            $mediaList = $query->get();

            $formattedMedia = $mediaList->map(function ($item) {
                $imageUrl = null;
                
                if ($item->image_url) {
                    if (str_starts_with($item->image_url, 'http')) {
                        $imageUrl = $item->image_url;
                    } else {
                        $imageUrl = url('storage/' . $item->image_url);
                    }
                }

                return [
                    'id' => $item->id,
                    'timeStamp' => $item->created_at->format('Y-m-d'),
                    'date' => $item->created_at->format('d/m/Y'),
                    'imageUrl' => $imageUrl,
                    'videoUrl' => $item->video_url,
                    'name' => $item->name,
                    'category' => $item->category,
                ];
            });

            Log::info('Gallery items fetched', [
                'count' => $formattedMedia->count(),
                'excluded_categories' => $request->has('exclude_video') && $request->exclude_video === 'true' 
                    ? ['foto-cards', 'Video'] 
                    : ['foto-cards']
            ]);

            return response()->json($formattedMedia);
        } catch (\Exception $e) {
            Log::error('Error in MediaController@index: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to fetch media',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics for filter buttons
     *  Exclude foto-cards from stats
     *  Exclude Video if exclude_video=true
     */
    public function statistics(Request $request)
    {
        try {
            $query = Media::query()->where('category', '!=', 'foto-cards');
            
            // exclude video jika parameter exclude_video=true
            if ($request->has('exclude_video') && $request->exclude_video === 'true') {
                $query->where('category', '!=', 'Video');
            }

            $all = (clone $query)->count();
            
            $last7Days = (clone $query)
                ->where('created_at', '>=', Carbon::now()->subDays(7))
                ->count();
                
            $last14Days = (clone $query)
                ->where('created_at', '>=', Carbon::now()->subDays(14))
                ->count();
                
            $last30Days = (clone $query)
                ->where('created_at', '>=', Carbon::now()->subDays(30))
                ->count();
                
            $last90Days = (clone $query)
                ->where('created_at', '>=', Carbon::now()->subDays(90))
                ->count();

            return response()->json([
                'all' => $all,
                '7' => $last7Days,
                '14' => $last14Days,
                '30' => $last30Days,
                '90' => $last90Days,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in MediaController@statistics: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to fetch statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Convert image to WebP
     */
    private function convertToWebP($file, $destinationPath)
    {
        try {
            if (!extension_loaded('gd')) {
                Log::warning('GD extension not available, storing original file');
                return $file->store($destinationPath, 'public');
            }

            $filename = time() . '_' . uniqid() . '.webp';
            $storagePath = storage_path('app/public/' . $destinationPath);
            
            if (!file_exists($storagePath)) {
                mkdir($storagePath, 0755, true);
            }
            
            $fullPath = $storagePath . '/' . $filename;

            $imageInfo = @getimagesize($file->path());
            if (!$imageInfo) {
                Log::warning('Cannot read image info, storing original file');
                return $file->store($destinationPath, 'public');
            }

            $mimeType = $imageInfo['mime'];

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

            $width = imagesx($image);
            $height = imagesy($image);

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
            return $file->store($destinationPath, 'public');
        }
    }

    /**
     * Store new media
     *  Auto-route to correct folder based on category
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'category' => 'required|string',
                'name' => 'nullable|string',
                'video_url' => 'nullable|string',
                'file' => 'nullable|file|mimes:jpg,jpeg,png,gif|max:10240',
            ]);

            $path = null;
            $mediaName = $validated['name'] ?? null;
            
            //  Route to correct folder based on category
            $storagePath = $validated['category'] === 'foto-cards' 
                ? 'foto-cards'  //  Separate folder for foto_card
                : 'media';      //  Default gallery folder

            if ($request->hasFile('file')) {
                $path = $this->convertToWebP($request->file('file'), $storagePath);
                
                if (!$mediaName) {
                    $mediaName = pathinfo($request->file('file')->getClientOriginalName(), PATHINFO_FILENAME);
                }
            } elseif ($validated['video_url']) {
                if (!$mediaName) {
                    $mediaName = 'Video - ' . now()->format('d/m/Y H:i');
                }
            }

            if (!$mediaName) {
                $mediaName = 'Media - ' . now()->format('d/m/Y H:i');
            }

            $media = Media::create([
                'name' => $mediaName,
                'category' => $validated['category'],
                'image_url' => $path,
                'video_url' => $validated['video_url'] ?? null,
            ]);

            $imageUrl = null;
            if ($media->image_url) {
                $imageUrl = url('storage/' . $media->image_url);
            } elseif ($media->video_url) {
                $imageUrl = $media->video_url;
            }

            Log::info('Media stored', [
                'id' => $media->id,
                'category' => $media->category,
                'storage_path' => $storagePath,
                'folder' => $storagePath === 'foto-cards' ? 'foto-cards (excluded from gallery)' : 'media (visible in gallery)',
            ]);

            return response()->json([
                'message' => 'Media uploaded successfully',
                'data' => [
                    'id' => $media->id,
                    'timeStamp' => $media->created_at->format('Y-m-d'),
                    'date' => $media->created_at->format('d/m/Y'),
                    'imageUrl' => $imageUrl,
                    'videoUrl' => $media->video_url,
                    'name' => $media->name,
                    'category' => $media->category,
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error in MediaController@store: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'message' => 'Failed to upload media',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update media
     */
    public function update(Request $request, $id)
    {
        try {
            $media = Media::findOrFail($id);

            $validated = $request->validate([
                'name' => 'nullable|string',
                'category' => 'nullable|string',
                'video_url' => 'nullable|string',
            ]);

            $media->update($validated);

            Log::info('Media updated', ['id' => $id]);

            return response()->json([
                'message' => 'Media updated successfully',
                'data' => $media
            ]);
        } catch (\Exception $e) {
            Log::error('Error in MediaController@update: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to update media',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete media
     */
    public function destroy($id)
    {
        try {
            $media = Media::findOrFail($id);

            if ($media->image_url) {
                Storage::disk('public')->delete($media->image_url);
            }

            $media->delete();

            Log::info('Media deleted', ['id' => $id]);

            return response()->json([
                'message' => 'Media deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in MediaController@destroy: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to delete media',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
