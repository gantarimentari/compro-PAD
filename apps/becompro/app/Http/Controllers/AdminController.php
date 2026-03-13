<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    // get all admin
    public function index()
    {
        try {
            $admins = User::admins()
                ->orderBy('created_at', 'desc')
                ->get();

            // return format yang sesuai dengan frontend
            return response()->json($admins->map(function($admin) {
                return [
                    'id' => $admin->id,
                    'username' => $admin->username,
                    'email' => $admin->email,
                    'phone_number' => $admin->phone_number,
                    'role' => $admin->role,
                    'created_at' => $admin->created_at,
                ];
            }));
        } catch (\Exception $e) {
            \Log::error('Error fetching admins: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // get single admin
    public function show(User $admin)
    {
        if ($admin->role !== 'admin') {
            return response()->json(['error' => 'User is not an admin'], 404);
        }

        return response()->json([
            'id' => $admin->id,
            'adminName' => $admin->username,
            'email' => $admin->email,
            'phoneNumber' => $admin->phone_number,
            'role' => $admin->role,
            'date' => $admin->created_at->format('d/m/Y'),
        ]);
    }

    //create admin
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'username' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email|max:255',
                'password' => 'required|string|min:8',
                'phone_number' => 'nullable|string|max:20',
            ]);

            $admin = User::create([
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone_number' => $validated['phone_number'] ?? null,
                'role' => 'admin',
            ]);

            return response()->json([
                'message' => 'Admin berhasil ditambahkan',
                'data' => $admin,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error creating admin: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create admin',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // update admin
    public function update(Request $request, User $admin)
    {
        try {
            if ($admin->role !== 'admin') {
                return response()->json(['error' => 'User is not an admin'], 404);
            }

            $validated = $request->validate([
                'username' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $admin->id . '|max:255',
                'password' => 'nullable|string|min:8',
                'phone_number' => 'nullable|string|max:20',
            ]);

            $updateData = [];
            
            if (isset($validated['username'])) {
                $updateData['username'] = $validated['username'];
            }
            
            if (isset($validated['email'])) {
                $updateData['email'] = $validated['email'];
            }
            
            if (isset($validated['phone_number'])) {
                $updateData['phone_number'] = $validated['phone_number'];
            }
            
            if (!empty($validated['password'])) {
                $updateData['password'] = Hash::make($validated['password']);
            }

            $admin->update($updateData);

            return response()->json([
                'message' => 'Admin berhasil diupdate',
                'data' => $admin->fresh(),
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error updating admin: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to update admin',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // delete admin
    public function destroy(User $admin)
    {
        try {
            if ($admin->role !== 'admin') {
                return response()->json(['error' => 'User is not an admin'], 404);
            }

            // preventing delete yourself 
            if ($admin->id === auth()->id()) {
                return response()->json([
                    'error' => 'Cannot delete your own account'
                ], 403);
            }

            $admin->delete();

            return response()->json(['message' => 'Admin berhasil dihapus']);
        } catch (\Exception $e) {
            \Log::error('Error deleting admin: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
