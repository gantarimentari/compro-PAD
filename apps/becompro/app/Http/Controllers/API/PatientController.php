<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index()
    {
        // Hanya ambil user dengan role 'user' (pasien), bukan admin
        $patients = User::where('role', 'user')
            ->with('hewans.jenisHewan')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($patients);
    }

    public function store(Request $request)
    {
        // ✅ Validasi sesuai dengan field yang dikirim frontend
        $validated = $request->validate([
            'name' => 'required|string|max:255',           // ✅ Terima 'name'
            'phoneNumber' => 'required|string|max:20',     // ✅ Terima 'phoneNumber'
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // ✅ Map ke field database yang benar
        $patient = User::create([
            'username' => $validated['name'],              // ✅ name -> username
            'phone_number' => $validated['phoneNumber'],   // ✅ phoneNumber -> phone_number
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => 'user',                              // ✅ Set role sebagai 'user' (pasien)
        ]);

        return response()->json($patient->load('hewans.jenisHewan'), 201);
    }

    public function show($id)
    {
        $patient = User::with('hewans.jenisHewan')->findOrFail($id);
        return response()->json($patient);
    }

    public function update(Request $request, $id)
    {
        $patient = User::findOrFail($id);

        // ✅ Validasi update
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phoneNumber' => 'sometimes|string|max:20',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8',
        ]);

        // ✅ Map ke field database
        $updateData = [];
        if (isset($validated['name'])) {
            $updateData['username'] = $validated['name'];
        }
        if (isset($validated['phoneNumber'])) {
            $updateData['phone_number'] = $validated['phoneNumber'];
        }
        if (isset($validated['email'])) {
            $updateData['email'] = $validated['email'];
        }
        if (isset($validated['password'])) {
            $updateData['password'] = bcrypt($validated['password']);
        }

        $patient->update($updateData);

        return response()->json($patient->load('hewans.jenisHewan'));
    }

    public function destroy($id)
    {
        $patient = User::findOrFail($id);
        $patient->delete();
        return response()->json(['message' => 'Patient deleted successfully']);
    }
}