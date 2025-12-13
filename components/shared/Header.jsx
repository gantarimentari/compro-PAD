"use client";

import React, { useState, useEffect } from "react";
import { NotificationIcon, UserIcon, CloseIcon } from "@ds/icons";
import Link from "next/link";
import api from "@lib/api.js";

export default function Header() {
  //  Start with false (assume guest)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // ✅ Loading state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //  Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);
        const response = await api.get('/api/user');
        
        if (response.data) {
          console.log('✅ User authenticated:', response.data);
          setIsLoggedIn(true);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          console.log('👤 User not authenticated (guest)');
        } else {
          console.error('❌ Auth check error:', err);
        }
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false); // ✅ Stop loading
      }
    };

    checkAuth();
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`
      ${isScrolled 
        ? "fixed top-4 scale-95 rounded-[14px]" 
        : "scale-100"
      } w-full bg-white shadow-e2 rounded-b-[14px] shadow-e4 transition-all duration-1000 ease-in-out z-50 origin-top`}
    >
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Company Name Section */}
          <div className="flex items-center gap-3">
            <img
              className="h-14 w-auto"
              src="/logo.svg"
              alt="Company Logo"
            />
            <h1 className="md:text-h-7 text-accent-neutral-1000 md:semibold font-bold text-body-2">
              Praktik Dokter Hewan Fanina
            </h1>
          </div>

          {/* Action Links - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-body-1 text-accent-neutral-1000 transition-colors">
                Home
              </Link>
              <Link href="/galery" className="text-body-1 text-accent-neutral-1000 transition-colors">
                Galeri
              </Link>
              <Link href="/article" className="text-body-1 text-accent-neutral-1000 transition-colors">
                Artikel
              </Link>
            </nav>
            
            <button className="w-10 h-10 md:w-11 md:h-11 bg-accent-yellow-300 rounded-lg flex items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 duration-300 hover:shadow-md">
              <NotificationIcon className="w-5 h-5" />
            </button>

            {/* ✅ Show loading skeleton saat checking auth */}
            {isCheckingAuth ? (
              <AuthLoadingSkeleton />
            ) : isLoggedIn ? (
              <UserActions />
            ) : (
              <AuthActions />
            )}           
          </div>

          {/* Burger Button - Mobile */}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex flex-col justify-center items-center gap-1.5 p-2 w-10 h-10 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-4 space-y-3">
            {/* Navigation Links */}
            <nav className="flex flex-col items-center justify-center gap-4">
              <Link 
                href="/" 
                className="text-body-1 text-accent-neutral-1000 py-2 transition-colors hover:text-accent-blue-300"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link 
                href="/galery" 
                className="text-body-1 text-accent-neutral-1000 py-2 transition-colors hover:text-accent-blue-300"
                onClick={toggleMenu}
              >
                Galeri
              </Link>
              <Link 
                href="/article" 
                className="text-body-1 text-accent-neutral-1000 py-2 transition-colors hover:text-accent-blue-300"
                onClick={toggleMenu}
              >
                Artikel
              </Link>
            </nav>

            {/* Buttons */}
            <div className="flex flex-col items-center justify-center gap-3 pt-2">
              {/* Notifikasi Button */}
              <button className="w-full bg-accent-yellow-300 text-accent-neutral-1000 rounded-lg px-4 py-3 text-body-2 font-medium flex items-center justify-center gap-2 hover:bg-accent-yellow-400 transition-colors">
                <NotificationIcon className="w-5 h-5" />
                Notifikasi
              </button>

              {/* ✅ Show loading atau buttons sesuai auth status */}
              {isCheckingAuth ? (
                <div className="w-full space-y-3">
                  <div className="w-full h-11 bg-accent-neutral-200 rounded-lg animate-pulse"></div>
                  <div className="w-full h-11 bg-accent-neutral-200 rounded-lg animate-pulse"></div>
                </div>
              ) : !isLoggedIn ? (
                <>
                  <Link 
                    href="/auth/login"
                    className="w-full bg-accent-yellow-300 text-accent-neutral-1000 rounded-lg px-4 py-3 text-body-2 font-medium text-center hover:bg-accent-yellow-400 transition-colors"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  
                  <Link 
                    href="/auth/register"
                    className="w-full bg-white border-2 border-accent-yellow-300 text-accent-neutral-1000 rounded-lg px-4 py-3 text-body-2 font-medium text-center hover:bg-accent-neutral-200 transition-colors"
                    onClick={toggleMenu}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <Link 
                  href="/profile"
                  className="w-full bg-accent-yellow-300 text-accent-neutral-1000 rounded-lg px-4 py-3 text-body-2 font-medium flex items-center justify-center gap-2 hover:bg-accent-yellow-400 transition-colors"
                  onClick={toggleMenu}
                >
                  <UserIcon className="w-5 h-5" />
                  Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ✅ Loading Skeleton Component untuk Desktop
const AuthLoadingSkeleton = () => (
  <div className="flex items-center gap-4">
    <div className="w-20 h-10 bg-accent-neutral-200 rounded-lg animate-pulse"></div>
    <div className="w-24 h-10 bg-accent-neutral-200 rounded-lg animate-pulse"></div>
  </div>
);

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

const UserActions = () => (
  <Link 
    href="/profile"
    aria-label="Go to Profile"
    className="w-10 h-10 md:w-11 md:h-11 bg-accent-yellow-300 rounded-lg flex items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 duration-300 hover:shadow-md"
  >
    <UserIcon className="w-5 h-5" />
  </Link>
);
