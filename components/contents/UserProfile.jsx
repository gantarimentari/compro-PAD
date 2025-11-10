'use client';

import React, { useState, useEffect } from 'react';
import { UserIcon, LogOutDoor, PencilIcon,DocumentIcon} from '@ds/icons/UIIcons'; 
import Link from 'next/link';

// DUMMY DATA 

const MOCK_USER_DATA = {
    username: 'Falah_UIUX', 
    email: 'fal.ah@example.com',
    phone: '0812-3456-7890',
    password: 'user123456'
};

// SVG Component untuk border putus-putus
const ModalDashedBorder = ({ className }) => (
    <svg 
        className={className}
        width="100%" 
        height="100%" 
        viewBox="0 0 663 297" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
    >
        <rect 
              x="8.9"
              y="7.9"
              width="645.2"
              height="282.2"
              rx="5.1"
              className="stroke-accent-yellow-300"
              strokeWidth="1.8"
              strokeLinecap="square"
              strokeLinejoin="round"
              strokeDasharray="18 8"
              vectorEffect="non-scaling-stroke"
        />
    </svg>
);

// --- ini tu buat info apa aja yang ada di halaman ini  ---
const ProfileDetails = ({ user, isEditing, onPasswordChangeClick }) => {
    return (
        <div className="space-y-6">
            <InputGroup label="Username"  value={user.username} isEditing={isEditing} />
            <InputGroup label="Nomor Telepon" value={user.phone} isEditing={isEditing} />
            <InputGroup label="E-mail" value={user.email} isEditing={isEditing} readOnly /> 
            
            {/* Input Password */}
            <PasswordGroup 
                isEditing={isEditing} 
                onPasswordChangeClick={onPasswordChangeClick}
                password={user.password}
            />
        </div>
    );
};

// --- Komponen  Password ---
const PasswordGroup = ({ isEditing, onPasswordChangeClick, password }) => {
    if (isEditing) {
       
        return (
            <div className="space-y-6">
                <p className="text-h-4 font-medium text-accent-neutral-1000 ">
                    Edit Password
                </p>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-h-6 font-medium text-accent-neutral-1000 mb-2">Password Lama</label>
                        <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300 p-1">
                            {/* Modal Border SVG - Garis Putus-putus dengan jarak dari border */}
                            <ModalDashedBorder className="absolute inset-0 w-full h-full z-0 pointer-events-none p-1" />
                            <input 
                                type="password"
                                className="relative pl-4  z-10 w-full p-3 text-h-7 font-medium bg-transparent rounded-lg focus:outline-none text-accent-neutral-1000"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-h-6 font-medium text-accent-neutral-1000 mb-2">Password Baru</label>
                        <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300 p-1">
                            {/* Modal Border SVG - Garis Putus-putus dengan jarak dari border */}
                            <ModalDashedBorder className="absolute inset-0 w-full h-full z-0 pointer-events-none p-1" />
                            <input 
                                type="password"
                                className="relative pl-4  z-10 w-full p-3 text-h-7 font-medium bg-transparent rounded-lg focus:outline-none text-accent-neutral-1000"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-h-6 font-medium text-accent-neutral-1000 mb-2">Konfirmasi Password Baru</label>
                        <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300 p-1">
                            {/* Modal Border SVG - Garis Putus-putus dengan jarak dari border */}
                            <ModalDashedBorder className="absolute inset-0 w-full h-full z-0 pointer-events-none p-1" />
                            <input 
                                type="password"
                                className="relative pl-4 z-10 w-full p-3 text-h-7 font-medium bg-transparent rounded-lg focus:outline-none text-accent-neutral-1000"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Mode View (Tidak Edit) - Menampilkan password
    return (
        <InputGroup label="Password" value={password} isEditing={false} type="password" />
    );
};

// --- Helper Component untuk Input (DIUBAH agar support type="password") ---
const InputGroup = ({ label, value, isEditing, readOnly, as = 'input', type = 'text' }) => (
    <div>
        <label className="block text-h-6 font-medium text-accent-neutral-1000 mb-2">{label}</label>
        {isEditing && as === 'input' ? (
            <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300 p-1 ">
                <ModalDashedBorder className="absolute inset-0 w-full h-full z-0 pointer-events-none p-1" />
                <input 
                    type={type}
                    defaultValue={type !== 'password' ? value : ''} 
                    readOnly={readOnly}
                    className={`relative pl-4 z-10 text-h-7 font-medium text-accent-neutral-1000 w-full p-3 bg-transparent rounded-lg focus:outline-none ${readOnly ? 'text-gray-500' : 'text-accent-neutral-1000'}`}
                />
            </div>
        ) : isEditing && as === 'textarea' ? (
            <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300 p-1">
                {/* Modal Border SVG - Garis Putus-putus dengan jarak dari border */}
                <ModalDashedBorder className="absolute inset-0 w-full h-full z-0 pointer-events-none p-1" />
                <textarea 
                    defaultValue={value} 
                    readOnly={readOnly}
                    rows="3"
                    className={`relative pl-4 z-10 text-h-7 font-medium w-full p-3 bg-transparent rounded-lg focus:outline-none ${readOnly ? 'text-gray-500' : 'text-accent-neutral-1000'}`}
                />
            </div>
        ) : (
            // Mode View
            <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300">
                <ModalDashedBorder className="absolute inset-0 pointer-events-none rounded-lg p-1 " />
                <div className={`relative z-10 w-full pl-6 p-3 text-h-7 font-medium ${readOnly ? 'text-gray-500' : 'text-accent-neutral-1000'}`}>
                    {type === 'password' ? '••••••••' : value}
                </div>
            </div>
        )}
    </div>
);


// --- Komponen Utama Profil ---
export default function UserProfile() {
    // State untuk menyimpan data pengguna yang dimuat dari API
    const [userProfile, setUserProfile] = useState(null); // Dimulai dari NULL (kosong)
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Logika Simulasi Fetch Data
    useEffect(() => {
        // TO DO: [BACKEND] Ganti dengan logika API fetch nyata
        setTimeout(() => {
            setUserProfile(MOCK_USER_DATA);
            setIsLoading(false);
        }, 1500);
    }, []);
    
    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleChangePasswordClick = () => {
        // Placeholder untuk aksi ubah password di luar form
        console.log("Tombol Ubah Password diklik (mode View)");
    };

    if (isLoading || !userProfile) {
        return (
            <div className="p-8 text-center text-gray-500 min-h-[500px] flex items-center justify-center">
                Memuat data profile... 
            </div>
        );
    }

    return (
        // Wrapper dengan padding atas dan bawah agar Header rounded terlihat
        <div className="pt-8 pb-16 px-4">
            <div className="max-w-2xl mx-auto ">
                
                {/* Header */}
                <div className="mb-8">
                    <p className="text-h-3 font-bold text-accent-neutral-1000">Hai, {userProfile.username}</p>
                </div>

                {/* Konten Utama Profil */}
                <ProfileDetails 
                    user={userProfile} 
                    isEditing={isEditing} 
                    onPasswordChangeClick={handleChangePasswordClick} 
                />

                {/* Tombol Aksi */}
                <div className="flex justify-between mt-8">
                    {isEditing ? (
                        <>
                            <button 

                                onClick={handleToggleEdit}
                                className="px-6 
                                font-bold 
                                py-4 
                                h-10 
                                bg-transparent 
                                text-body-2 
                                transition ease-out duration-300 
                                text-accent-red-300 
                                border border-accent-red-300 rounded-lg 
                                hover:bg-accent-red-300 hover:text-white   
                                font-medium flex items-center justify-center gap-2"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleToggleEdit}
                                className="px-6 py-4 h-10 font-bold bg-accent-yellow-300 border-accent-yellow-300 ease-out duration-300 text-body-2 text-white  rounded-lg hover:bg-accent-yellow-400 transition  font-medium flex items-center justify-center gap-2"
                            >
                                <DocumentIcon className="w-5 h-5" />
                                <span>Simpan Perubahan</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                            href="/"
                                onClick={() => console.log('Logout clicked')}
                               
                                className="px-6 
                                font-bold 
                                py-4 
                                h-10 
                                bg-transparent 
                                text-body-2 
                                transition ease-out duration-300 
                                text-accent-red-300 
                                border border-accent-red-300 rounded-lg 
                                hover:bg-accent-red-300 hover:text-white   
                                font-medium flex items-center justify-center gap-2"
                            >
                                <LogOutDoor className="w-5 h-5" /> 
                                <span>Logout</span>
                                
                            </Link>
                            
                            <button 
                                onClick={handleToggleEdit}
                                className="px-6 py-4 h-10 font-bold bg-accent-yellow-300 border-accent-yellow-300 ease-out duration-300 text-body-2 text-white  rounded-lg hover:bg-accent-yellow-400 transition  font-medium flex items-center justify-center gap-2"
                            >
                                <PencilIcon className="w-5 h-5" /> 
                                <span>Edit Profile</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}