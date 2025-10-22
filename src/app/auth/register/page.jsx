'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@ds/auth/AuthLayout';
import Input from '@ds/auth/Input';
import Button from '@ds/auth/Button';
import Separator from '@ds/auth/Separator';
import GoogleIcon from '@ds/auth/GoogleIcon';

/**
 * Halaman Register
 * Menggunakan komponen-komponen reusable dan Next.js Link untuk navigasi
 */
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
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
    // TODO: Implementasi logic register di sini
    console.log('Register data:', formData);
    // Setelah berhasil register, bisa redirect ke login atau langsung login
    // router.push('/auth/login');
  };

  const handleGoogleRegister = () => {
    // TODO: Implementasi Google OAuth di sini
    console.log('Register with Google');
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-h-4 font-bold text-accent-neutral ">
          Register
        </h1>
      </div>

      {/* Form Register */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* Input Username */}
        <Input
          id="username"
          name="username"
          type="text"
          label="Username"
          placeholder="Masukkan username Anda"
          required
          autoComplete="username"
          value={formData.username}
          onChange={handleChange}
        />

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

        {/* Input Password */}
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Masukkan kata sandi Anda"
          required
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
        />

        {/* Tombol Register */}
        <div>
          <Button type="submit" variant="primary">
            Register
          </Button>
        </div>
      </form>

      {/* Separator */}
      <Separator />

      {/* Tombol Register dengan Google */}
      <div>
        <Button 
          type="button" 
          variant="google" 
          onClick={handleGoogleRegister}
          icon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>
      </div>

      {/* Link ke halaman Login */}
      <div className=" pt-4">
        <p className="text-accent-neutral-700 text-body-1">
          Sudah punya akun?{' '}
          <Link 
            href="/auth/login" 
            className="text-body-1 text-accent-blue-200 hover:text-indigo-500"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
