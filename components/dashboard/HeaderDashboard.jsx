"use client";
import React from "react";
import { AdminUserIcon } from "@ds/icons"; 
import Link from "next/link";

const MOCK_ADMIN_PROFILE={
    name: "Admin",
    role: "Administrator",
    // avatarUrl: "/images/hamster.png" 
}
const {name,role}=MOCK_ADMIN_PROFILE;

export default function HeaderDashboard(){
    return(
        <header className=" bg-white w-full shadow-sm p-4">
            <div className="flex items-center justify-end gap-4">
              
              {/* Info Pengguna */}
              <div className="flex flex-col">
                <p className="text-accent-neutral-1000 text-h-8 font-bold">
                  {name}
                </p>
                
              </div>
              <Link 
                href="/"
                className="shadow  w-10 h-10  bg-accent-blue-300 rounded-full flex items-center justify-center text-accent-neutral-1000 hover:bg-accent-blue-400 duration-300 hover:shadow-md"
              >
                  <AdminUserIcon className="w-5 h-5 " color="white" />
              </Link>

            </div>
        </header>
    )
}