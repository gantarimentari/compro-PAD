'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@ds/auth/AuthLayout';
import Input from '@ds/auth/Input';
import Button from '@ds/auth/Button';
import Separator from '@ds/auth/Separator';
import GoogleIcon from '@ds/auth/GoogleIcon';

/**
 * Halaman Login
 * Menggunakan komponen-komponen reusable dan Next.js Link untuk navigasi
 */
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implementasi logic login di sini
    console.log('Login data:', formData);
    // Setelah berhasil login, bisa redirect ke dashboard
    // router.push('/dashboard');
  };

  const handleGoogleLogin = () => {
    // TODO: Implementasi Google OAuth di sini
    console.log('Login with Google');
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-h-4 font-bold text-gray-900 ">
          Login
        </h1>
      </div>

      {/* Form Login */}
      <form className="text-body-1 mt-8 space-y-3 " onSubmit={handleSubmit}>
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
              className="text-body-1  text-accent-blue-200 hover:text-indigo-500"
            >
              lupa password?
            </Link>
          </div>
        </div>

        {/* Tombol Login */}
        <div>
          <Button type="submit" variant="primary" className="text-body-1">
            Login
          </Button>
        </div>
      </form>

      {/* Separator */}
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
      <div className="text-center pt-4">
        <p className="text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link 
            href="/auth/register" 
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
