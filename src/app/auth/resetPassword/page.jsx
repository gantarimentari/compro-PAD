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
        email: decodeURIComponent(email) // ✅ Decode email dari URL
      }));
    } else {
      setError('Link reset password tidak valid. Silakan request link baru.');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

      // Redirect ke login setelah 3 detik
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);

    } catch (err) {
      console.error('❌ Error resetting password:', err);
      console.error('❌ Error response:', err.response?.data);
      
      // ✅ Enhanced error handling
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        
        if (errors.email) {
          setError(errors.email[0]);
        } else if (errors.password) {
          setError(errors.password[0]);
        } else if (errors.token) {
          setError('Token reset password tidak valid atau sudah kadaluarsa. Silakan request link baru.');
        } else {
          setError(Object.values(errors)[0][0]); // First error message
        }
      } else if (err.response?.data?.message) {
        // Handle message dari backend (e.g. "passwords.token" atau "passwords.user")
        const message = err.response.data.message;
        
        if (message.includes('token') || message.includes('invalid')) {
          setError('Link reset password tidak valid atau sudah kadaluarsa. Silakan request link baru.');
        } else if (message.includes('user') || message.includes('email')) {
          setError('Email tidak ditemukan dalam sistem.');
        } else {
          setError(message);
        }
      } else {
        setError('Gagal mereset password. Silakan coba lagi atau request link baru.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="text-center">
        <h1 className="sm:text-h-4 text-h-7 font-extrabold text-gray-900">
          Change Password
        </h1>
        <p className="mt-2 text-body-2 text-accent-neutral-700">
          Masukkan password baru Anda
        </p>
      </div>

      {success ? (
        // ✅ Success Message
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
                  Password Berhasil Direset! 🎉
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Password Anda telah berhasil diubah.</p>
                  <p className="mt-1">Mengarahkan ke halaman login dalam 3 detik...</p>
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
                  {/* ✅ Tambahkan link ke forgot password jika token invalid */}
                  {error.includes('tidak valid') || error.includes('kadaluarsa') ? (
                    <Link 
                      href="/auth/forgotPassword"
                      className="mt-2 text-sm font-medium text-red-600 hover:text-red-500 inline-block"
                    >
                      Request link baru →
                    </Link>
                  ) : null}
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
            onChange={handleChange}
            readOnly
            disabled
            className="bg-gray-50"
          />

          {/* Input Password Baru */}
          <Input
            id="password"
            name="password"
            type="password"
            label="Password Baru"
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
            label="Konfirmasi Password"
            placeholder="Ulangi password baru"
            required
            autoComplete="new-password"
            value={formData.password_confirmation}
            onChange={handleChange}
            disabled={loading}
          />

          {/* Password Requirements */}
          <div className="text-sm text-accent-neutral-700 bg-accent-neutral-100 p-3 rounded-lg">
            <p className="font-medium mb-2">Password harus:</p>
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {formData.password.length >= 8 && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className={formData.password.length >= 8 ? 'text-green-700 font-medium' : ''}>
                  Minimal 8 karakter
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  formData.password === formData.password_confirmation && formData.password && formData.password_confirmation 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                }`}>
                  {formData.password === formData.password_confirmation && formData.password && formData.password_confirmation && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className={
                  formData.password === formData.password_confirmation && formData.password && formData.password_confirmation
                    ? 'text-green-700 font-medium' 
                    : ''
                }>
                  Sama dengan konfirmasi password
                </span>
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
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Memproses...
                </span>
              ) : (
                'Reset Password'
              )}
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
 */
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <div className="text-center">
          <h1 className="text-h-4 font-extrabold text-gray-900">
            Reset Password
          </h1>
          <div className="mt-8 flex justify-center">
            <svg className="animate-spin h-8 w-8 text-accent-blue-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </div>
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

