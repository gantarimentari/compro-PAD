"use client";
import React, { useState, useRef, useEffect } from "react";
import { AdminUserIcon } from "@/components/icons"; 
import authService from '@/lib/services/authService';
import { useRouter } from "next/navigation";
import { clearFrontendAuthState } from "@/lib/frontendAuth";

const MOCK_ADMIN_PROFILE={
    name: "Admin",
    role: "Administrator",
    // avatarUrl: "/images/hamster.png" 
}
const {name,role}=MOCK_ADMIN_PROFILE;

export default function HeaderDashboard(){
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = async () => {
        try{
          await authService.logout();
          clearFrontendAuthState();
          localStorage.removeItem('admin');
          sessionStorage.clear();
          router.push('/');
        }catch (err){
          console.error('Logout error:', err);
          // force logout anyway
          clearFrontendAuthState();
          localStorage.removeItem('admin');
          sessionStorage.clear();
          router.push('/');
        }
    };

    return(
        <header className="sticky top-0 z-10 bg-white w-full shadow-sm p-6 flex-shrink-0">
            <div className="flex items-center justify-end gap-4">
              {/* Info Pengguna */}
              <div className="flex flex-col">
                <p className="text-accent-neutral-1000 text-body-1 font-bold">
                  {name}
                </p>
              </div>
              
              {/* Admin Icon with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="shadow w-10 h-10 bg-accent-blue-300 rounded-full flex items-center justify-center text-accent-neutral-1000 hover:bg-accent-blue-400 duration-300 hover:shadow-md"
                >
                  <AdminUserIcon className="w-5 h-5" color="white" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-body-1 text-accent-neutral-1000 hover:bg-accent-neutral-225 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
        </header>
    )
}

//research.rakai.co