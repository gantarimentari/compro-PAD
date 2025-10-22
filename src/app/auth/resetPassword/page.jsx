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
    router.push('/auth/login');
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-h-4 font-extrabold text-gray-900">
          Change Password
        </h1>

      </div>

      {/* Form Reset Password */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* Input Password Baru */}
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          label="enter new password"
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
          label="confirm password"
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



        {/* Tombol Change Password */}
        <div>
          <Button type="submit" variant="primary">
            Change Password
          </Button>
        </div>
      </form>


    </AuthLayout>
  );
}

