"use client";
import React from "react";
import { GaleryIcon } from "@ds/icons"; 
import Link from "next/link";

export default function Sidebar(){
    return(
      <aside className="w-72 bg-white h-screen shadow-md p-6 flex-shrink-0 overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <img
              className="h-14 w-auto"
              src="/logo.svg"
              alt="Company Logo"
            />
            <p className="text-body-2 text-accent-blue-500 font-bold">
              Praktik Dokter Hewan Fanina
            </p>
          </div>
        </div>
        
        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard" className="flex items-center gap-3 text-accent-neutral-1000 hover:text-accent-blue-500 transition-colors">
            <GaleryIcon className="w-5 h-5" color="black"/>
            <span className="text-body-1 font-medium">Galerii</span>
          </Link>
          {/* Tambahkan link navigasi lainnya di sini */}
        </nav>
      </aside>
    )
}