'use client';

import React, { useState } from 'react';
import authService from '@/lib/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/auth/Input';
import Button from '@/components/auth/Button';
import Separator from '@/components/auth/Separator';
import GoogleIcon from '@/components/auth/GoogleIcon';
import { getBackendUrl } from '@/lib/backendUrl';

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

  const [error, setError] = useState('');
  const [errors, setErrors]= useState({});
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]){
      setErrors(prev=> ({ ...prev, [name]: ''}));
    }
    if(error){
      setError('');
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if(!formData.password || formData.password.trim() === ''){
      newErrors.password = 'password harus terisi';
    } else if(formData.password.length < 8){
      newErrors.password = 'Password at least 8 characters'
    }

    if (Object.keys(newErrors).length > 0){
      setErrors(newErrors);
      return;
    }

    try{
      await authService.register(formData);
    router.push('/');
    } catch(err){
      if(err.response?.data?.errors){
        setErrors(err.response.data.errors);
      }else{
      console.error(err.response?.data);
      setError(err.response?.data?.message || 'register gagal');
      }
    }
  };

  const handleGoogleRegister = () => {
    // TODO: Implementasi Google OAuth di sini
    window.location.href = getBackendUrl('/auth/google/redirect');
    console.log('Register with Google');
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="text-center">
        <h1 className="sm:text-h-4 text-h-7 font-bold text-accent-neutral ">
          Register
        </h1>
      </div>

      {/*error message*/}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

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

        {/*error password handling*/ }
        {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}

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
      <div className=" py-4">
        <p className="text-accent-neutral-700 sm:text-body-1 text-xs">
          Sudah punya akun?{' '}
          <Link 
            href="/auth/login" 
            className="sm:text-body-1 text-xs text-accent-blue-200 hover:text-indigo-500"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
