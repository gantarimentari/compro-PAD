"use client";

// import React from "react";
import React, { useState } from "react";
import { NotificationIcon,UserIcon } from "@ds/icons";
import Link from "next/link";

export default function Header() {
  // SIMULASI STATE LOGIN
    // Ubah nilainya menjadi true untuk melihat tampilan "Sudah Login"
    // Ubah nilainya menjadi false untuk melihat tampilan "Belum Login"
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    // Fungsi simulasi logout
    const handleLogout = () => {
        setIsLoggedIn(false);

    };

  return (
    <header className="w-full bg-white shadow-e2 rounded-b-[14px] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Company Name Section */}
          <div className="flex items-center gap-3">
            <img
              className="h-14 w-auto"
              src="/logo.svg"
              alt="Company Logo"
            />
            <h1 className="text-h-7 text-accent-neutral-1000 font-semibold">
              Praktik Dokter Hewan Fanina
            </h1>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-4">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-body-1 text-accent-neutral-1000  transition-colors">
                Home
              </Link>
              <Link href="/galery" className="text-body-1 text-accent-neutral-1000  transition-colors">
                Galeri
              </Link>
              <Link href="/article" className="text-body-1 text-accent-neutral-1000  transition-colors">
                Artikel
              </Link>
            </nav>
            <button className="w-10 h-10 md:w-11 md:h-11 bg-accent-yellow-300 rounded-lg flex items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 duration-300 hover:shadow-md">
              <NotificationIcon className="w-5 h-5" />
            </button>

 {/* 3. Logic Kondisional untuk Bagian Action */}
              {isLoggedIn ? (
                <UserActions handleLogout={handleLogout} />
              ) : (
                <AuthActions />
                        )}           

           
          </div>
        </div>
      </div>
    </header>
  );
}
const AuthActions = () => (
  <>
    

            <Link 
              href="/auth/login"
              className="px-6 h-10 bg-accent-yellow-300 text-accent-neutral-1000 text-body-2 rounded-lg hover:bg-accent-yellow-400 transition-colors font-medium inline-flex items-center"
            >
              Login
            </Link>
            
            <Link 
              href="/auth/register"
              className="px-6 h-10 border-2 border-accent-yellow-300 text-accent-neutral-1000 text-body-2 rounded-lg hover:bg-accent-neutral-200 transition-colors font-medium inline-flex items-center"
            >
              Register
            </Link>
  </>
 );
 const UserActions = ({ handleLogout }) => (
    <div className="flex items-center space-x-2 md:space-x-4">
        <Link 
            href="/profile"
            aria-label="Go to Dashboard"
            className="w-10 h-10 md:w-11 md:h-11 bg-accent-yellow-300 rounded-lg flex items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 duration-300 hover:shadow-md"
        >
            <UserIcon className="w-5 h-5" />
        </Link>
    </div>
);
