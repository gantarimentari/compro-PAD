'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import api from '@lib/api.js';
import AuthLayout from '@ds/auth/AuthLayout';
import Input from '@ds/auth/Input';
import Button from '@ds/auth/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Requesting password reset for:', email);

      await api.get('/sanctum/csrf-cookie');

      // ✅ Tambahkan /api prefix jika belum ada di base config
      const res = await api.post('/api/forgot-password', { email });

      console.log('✅ Response:', res.data);
      setIsSubmitted(true);

    } catch (err) {
      console.error('❌ Error:', err);
      console.error('❌ Response:', err.response);
      
      if (err.response?.data?.errors?.email) {
        setError(err.response.data.errors.email[0]);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Gagal mengirim email. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-h-4 font-bold text-accent-neutral">
          Forgot Password
        </h1>
        <p className="mt-2 text-body-2 text-accent-neutral-700">
          Masukkan email Anda untuk menerima link reset password
        </p>
      </div>

      {isSubmitted ? (
        // Success Message
        <div className="mt-8 space-y-6">
          <div className="rounded-lg bg-green-50 p-4 border border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Email Berhasil Dikirim!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Link reset password telah dikirim ke <strong>{email}</strong>.
                    Silakan cek inbox atau folder spam Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/auth/login"
              className="text-body-2 text-accent-blue-400 hover:text-accent-blue-500 font-medium"
            >
              ← Kembali ke Login
            </Link>
          </div>

          <button
            onClick={() => {
              setIsSubmitted(false);
              setEmail('');
            }}
            className="w-full text-body-2 text-accent-neutral-700 hover:text-accent-neutral-1000"
          >
            Kirim ulang email
          </button>
        </div>
      ) : (
        // Form
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

          {/* Input Email */}
          <Input
            id="email"
            name="email"
            type="email"
            label="E-mail"
            placeholder="Masukkan email Anda"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          {/* Submit Button */}
          <div>
            <Button 
              type="submit" 
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Mengirim...' : 'Send Verification'}
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

