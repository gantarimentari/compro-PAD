<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        $googleUser = Socialite::driver('google')->user();

        // cari user berdasarkan email
        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'username' => $googleUser->getName() ?? 'google_user_'.Str::random(5),
                'password' => bcrypt(Str::random(16)), // password random
            ]
        );

        Auth::login($user);

        // redirect ke frontend
        return redirect('http://localhost:3000/dashboard');
    }
}
