'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@lib/api.js';
import AuthLayout from '@ds/auth/AuthLayout';
import Input from '@ds/auth/Input';
import Button from '@ds/auth/Button';

/**
 * Component untuk form reset password
 * Dipisah karena useSearchParams() harus di dalam Suspense
 */
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    token: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Get token dan email dari URL saat component mount
  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    console.log('🔑 Reset password token:', token);
    console.log('📧 Email:', email);
    
    if (token && email) {
      setFormData(prev => ({ 
        ...prev, 
        token, 
        email 
      }));
    } else {
      setError('Link reset password tidak valid atau sudah kadaluarsa.');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error saat user mengetik
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi password minimal 8 karakter
    if (formData.password.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }

    // Validasi password match
    if (formData.password !== formData.password_confirmation) {
      setError('Password dan konfirmasi password tidak sama');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Resetting password for:', formData.email);

      // Get CSRF token
      await api.get('/sanctum/csrf-cookie');

      // Submit reset password
      const res = await api.post('/api/reset-password', {
        token: formData.token,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });

      console.log('✅ Password reset successful:', res.data);
      setSuccess(true);

      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);

    } catch (err) {
      console.error('❌ Error resetting password:', err);
      
      if (err.response?.data?.errors?.email) {
        setError(err.response.data.errors.email[0]);
      } else if (err.response?.data?.errors?.password) {
        setError(err.response.data.errors.password[0]);
      } else if (err.response?.data?.errors?.token) {
        setError('Token reset password tidak valid atau sudah kadaluarsa.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Gagal mereset password. Silakan coba lagi atau minta link baru.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-h-4 font-extrabold text-gray-900">
          Change Password
        </h1>
        <p className="mt-2 text-body-2 text-accent-neutral-700">
          Masukkan password baru Anda
        </p>
      </div>

      {success ? (
        // Success Message
        <div className="mt-8">
          <div className="rounded-lg bg-green-50 p-4 border border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Password Berhasil Direset!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Password Anda telah berhasil diubah.</p>
                  <p className="mt-1">Mengarahkan ke halaman login...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Form Reset Password
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Input Email (readonly) */}
          <Input
            id="email"
            name="email"
            type="email"
            label="E-mail"
            value={formData.email}
            readOnly
            disabled
            className="bg-gray-50"
          />

          {/* Input Password Baru */}
          <Input
            id="password"
            name="password"
            type="password"
            label="Enter New Password"
            placeholder="Minimal 8 karakter"
            required
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />

          {/* Input Konfirmasi Password */}
          <Input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            label="Confirm Password"
            placeholder="Ulangi password baru"
            required
            autoComplete="new-password"
            value={formData.password_confirmation}
            onChange={handleChange}
            disabled={loading}
          />

          {/* Password Requirements */}
          <div className="text-sm text-accent-neutral-700 bg-accent-neutral-100 p-3 rounded-lg">
            <p className="font-medium mb-1">Password harus:</p>
            <ul className="list-disc list-inside space-y-1">
              <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                Minimal 8 karakter
              </li>
              <li className={formData.password === formData.password_confirmation && formData.password ? 'text-green-600' : ''}>
                Sama dengan konfirmasi password
              </li>
            </ul>
          </div>

          {/* Tombol Change Password */}
          <div>
            <Button 
              type="submit" 
              variant="primary"
              disabled={loading || !formData.token}
            >
              {loading ? 'Memproses...' : 'Change Password'}
            </Button>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <Link 
              href="/auth/login"
              className="text-body-2 text-accent-blue-400 hover:text-accent-blue-500 font-medium"
            >
              ← Kembali ke Login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

/**
 * Main component dengan Suspense wrapper
 * Required karena useSearchParams() harus di dalam Suspense boundary
 */
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <div className="text-center">
          <h1 className="text-h-4 font-extrabold text-gray-900">
            Change Password
          </h1>
          <p className="mt-4 text-body-2 text-accent-neutral-700">
            Loading...
          </p>
        </div>
      </AuthLayout>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

