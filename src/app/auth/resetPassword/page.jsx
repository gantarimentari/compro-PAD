'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@ds/auth/AuthLayout';
import Input from '@ds/auth/Input';
import Button from '@ds/auth/Button';

/**
 * Halaman Reset Password
 * Untuk mengubah password setelah user klik link dari email
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error saat user mulai mengetik
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi password match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Password tidak cocok!');
      return;
    }

    // Validasi minimal length
    if (formData.newPassword.length < 8) {
      setError('Password minimal 8 karakter!');
      return;
    }

    // TODO: Implementasi logic reset password di sini
    console.log('Reset password:', formData.newPassword);
    
    // Redirect ke login setelah berhasil
    // router.push('/auth/login');
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-h-4 font-extrabold text-gray-900">
          Reset Password
        </h1>
        <p className="text-body-2 mt-2 text-gray-600">
          Masukkan password baru Anda
        </p>
      </div>

      {/* Form Reset Password */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* Input Password Baru */}
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          label="Password Baru"
          placeholder="Masukkan password baru"
          required
          autoComplete="new-password"
          value={formData.newPassword}
          onChange={handleChange}
        />

        {/* Input Konfirmasi Password */}
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Konfirmasi Password"
          placeholder="Masukkan ulang password baru"
          required
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Info Password Requirements */}
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-xs text-blue-800">
            Password harus minimal 8 karakter
          </p>
        </div>

        {/* Tombol Change Password */}
        <div>
          <Button type="submit" variant="primary">
            Change Password
          </Button>
        </div>
      </form>

      {/* Link kembali ke Login */}
      <div className="text-center pt-4">
        <p className="text-sm text-gray-600">
          Ingat password Anda?{' '}
          <Link 
            href="/auth/login" 
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Kembali ke Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

