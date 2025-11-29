'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@lib/api.js";
import Cookies from 'js-cookie';
import Link from 'next/link';
import AuthLayout from '@ds/auth/AuthLayout';
import Input from '@ds/auth/Input';
import Button from '@ds/auth/Button';
import Separator from '@ds/auth/Separator';
import GoogleIcon from '@ds/auth/GoogleIcon';


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
      // Get CSRF token
      await api.get('/sanctum/csrf-cookie');
      
      // Login request
      const res = await api.post('/api/login', {
        email: formData.email,
        password: formData.password,
      }, {
        headers: {
          'Accept': 'application/json',
          'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'),
        },
        withCredentials: true,
      });

      console.log('Login response:', res.data); // Debug log
      console.log('Response status:', res.status);
      console.log('Full response:', res);
      console.log('Response has user?', res.data?.user);
      console.log('Response keys:', Object.keys(res.data || {}));

      // Cek apakah response punya property user
      if (res.data && res.data.user) {
        const { user } = res.data;
        
        // Simpan user info ke localStorage
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect berdasarkan role
        if (user.role === 'admin') {
          router.push('/dashboardAdmin');
        } else {
          router.push('/');
        }
      } else {
        // Log detail untuk debugging
        console.error('Response tidak memiliki user object');
        console.error('Response data:', res.data);
        setError('Login berhasil tapi response tidak lengkap. Cek console untuk detail.');
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
    window.location.href = 'http://localhost:8000/auth/google/redirect';
    console.log('Login with Google');
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-h-4 font-bold text-accent-neutral ">
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
      <div className="mt-4 pt-4">
        <p className="text-accent-neutral-700 text-body-1">
          Belum punya akun?{' '}
          <Link 
            href="/auth/register" 
            className="text-body-1 text-accent-blue-200 hover:text-indigo-500"
          >
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
