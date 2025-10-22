'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@ds/auth/AuthLayout';
import Input from '@ds/auth/Input';
import Button from '@ds/auth/Button';

/**
 * Halaman Forgot Password
 * Untuk mengirim verifikasi reset password ke email
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implementasi logic kirim email verifikasi di sini
    console.log('Send verification to:', email);
    setIsSubmitted(true);
    
    // Simulasi: setelah 3 detik kembali ke state awal
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-h-4 font-extrabold text-gray-900">
          Forgot Password
        </h1>
        <p className="text-body-2 mt-2 text-gray-600">
          Masukkan email Anda untuk menerima link reset password
        </p>
      </div>

      {isSubmitted ? (
        // Pesan sukses setelah submit
        <div className="mt-8 rounded-lg bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Email verifikasi telah dikirim! Silakan cek inbox Anda.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Form Input Email
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
          />

          {/* Tombol Send Verification */}
          <div>
            <Button type="submit" variant="primary">
              Send Verification
            </Button>
          </div>
        </form>
      )}

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

