'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/lib/services/authService';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/auth/Input';
import Button from '@/components/auth/Button';
import Separator from '@/components/auth/Separator';
import GoogleIcon from '@/components/auth/GoogleIcon';
import { getBackendUrl } from '@/lib/backendUrl';
import { setFrontendAuthState } from '@/lib/frontendAuth';


export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const res = await authService.login(formData);
      console.log("ISI RESPON DARI BACKEND:", res);

      // Cek apakah response punya property user
      if (res && res.user) {
        const { user } = res;

        setFrontendAuthState(user.role);
        
        // Simpan user info ke localStorage
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect berdasarkan role
        if (user.role === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      } else {
        setError('Login berhasil tapi response tidak lengkap.');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Login gagal. Silakan coba lagi.');
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = getBackendUrl('/auth/google/redirect');
    console.log('Login with Google');
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-h-4 font-bold text-accent-neutral ">
          Login
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Form Login */}
      <form className="text-sm sm:text-body-1 mt-4 sm:mt-8 space-y-2 sm:space-y-3 " onSubmit={handleSubmit}>
        {/* Input Email */}
        <Input
          id="email"
          name="email"
          type="email"
          label="E-mail"
          placeholder="Masukkan email Anda"
          required
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />

        {/* Input Password dengan Link Lupa Password */}
        <div>
          <Input
            id="password"
            name="password"
            type="password"
            label="password" 
            placeholder="Masukkan kata sandi Anda"
            required
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          {/* Link ke halaman Forgot Password */}
          <div className="flex justify-end pt-1">
            <Link 
              href="/auth/forgotPassword" 
              className="text-xs sm:text-body-1 text-accent-blue-200 hover:text-indigo-500"
            >
              lupa password?
            </Link>
          </div>
        </div>

        {/* Tombol Login */}
        <div>
          <Button type="submit" variant="primary">
            Login
          </Button>
        </div>
      </form>



      <Separator />

      {/* Tombol Login dengan Google */}
      <div>
        <Button 
          type="button" 
          variant="google" 
          onClick={handleGoogleLogin}
          icon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>
      </div>

      {/* Link ke halaman Register */}
      <div className="mt-3 sm:mt-4 py-2 sm:pt-4">
        <p className="text-xs sm:text-body-1 text-accent-neutral-700">
          Belum punya akun?{' '}
          <Link 
            href="/auth/register" 
            className="text-xs sm:text-body-1 text-accent-blue-200 hover:text-indigo-500"
          >
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
