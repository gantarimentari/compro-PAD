"use client";

import React, { useState, useEffect } from "react";
import { NotificationIcon, UserIcon } from "@/components/icons";
import Link from "next/link";
import authService from '@/lib/services/authService';

export default function Header() {
  //  Start with false (assume guest)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //  Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);
        const response = await authService.getUser();
        
        if (response) {
          console.log('User authenticated:', response);
          setIsLoggedIn(true);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          console.log('User not authenticated (guest)');
        } else {
          console.error('Auth check error:', err);
        }
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false); // this for stop loading
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

  const headerShellClassName = `
    fixed inset-x-0 top-0 z-50
    transform-gpu will-change-[padding,transform]
    transition-[padding,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
    ${isScrolled ? "px-4 pt-4 sm:px-6" : "px-0 pt-0"}
  `;

  const headerClassName = `
    w-full bg-white/95 backdrop-blur-md shadow-e2
    transform-gpu origin-top
    transition-[transform,box-shadow,border-radius,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
    ${isScrolled
      ? "scale-[0.985] rounded-[18px] shadow-e4"
      : "scale-100 rounded-b-[14px]"
    }
  `;

  return (
    <>
      <div aria-hidden className="h-20" />
      <div className={headerShellClassName}>
      <header className={headerClassName}>
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
              <Link href="/faq" className="text-body-1 text-accent-neutral-1000 transition-colors">
                FAQ
              </Link>
            </nav>
           

            {/* Show loading skeleton saat checking auth */}
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
            className="lg:hidden flex flex-col justify-center items-center gap-1.5 p-2 w-10 h-10 focus:outline-none transform-gpu"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-700 origin-center transition-[transform,opacity,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 origin-center transition-[transform,opacity,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 origin-center transition-[transform,opacity,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
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
              <Link 
                href="/faq" 
                className="text-body-1 text-accent-neutral-1000 py-2 transition-colors hover:text-accent-blue-300"
                onClick={toggleMenu}
              >
                FAQ
              </Link>
            </nav>

            {/* Buttons */}
            <div className="flex flex-col items-center justify-center gap-3 pt-2">
              {/* Notifikasi Button */}
              

              {/* Show loading atau buttons sesuai auth status */}
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
                <>
                <Link 
                href="/notifications"
                className="w-full bg-accent-yellow-300 text-accent-neutral-1000 rounded-lg px-4 py-3 text-body-2 font-medium flex items-center justify-center gap-2 hover:bg-accent-yellow-400 transition-colors">
                <NotificationIcon className="w-5 h-5" />
                Notifikasi
              </Link>
              <Link 
                  href="/profile"
                  className="w-full bg-accent-yellow-300 text-accent-neutral-1000 rounded-lg px-4 py-3 text-body-2 font-medium flex items-center justify-center gap-2 hover:bg-accent-yellow-400 transition-colors"
                  onClick={toggleMenu}
                >
                  <UserIcon className="w-5 h-5" />
                  Profile
                </Link>
                </>
                
              )}
            </div>
          </div>
        </div>
      </div>
      </header>
      </div>
    </>
  );
}

// Loading Skeleton Component untuk Desktop
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
  <>
    <Link 
    href="/notifications"
    aria-label="Go to Notifications"
    className="w-10 h-10 md:w-11 md:h-11 bg-accent-yellow-300 rounded-lg flex items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 duration-300 hover:shadow-md">
      

      <NotificationIcon className="w-5 h-5" />
      
    </Link>
    <Link 
      href="/profile"
      aria-label="Go to Profile"
      className="w-10 h-10 md:w-11 md:h-11 bg-accent-yellow-300 rounded-lg flex items-center justify-center text-accent-neutral-1000 hover:bg-accent-yellow-400 duration-300 hover:shadow-md"
    >
      <UserIcon className="w-5 h-5" />
    </Link>
  </>
 
);