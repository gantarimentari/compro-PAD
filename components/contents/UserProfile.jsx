'use client';

import React, { useState, useEffect } from 'react';
import { UserIcon, LogOutDoor, PencilIcon,DocumentIcon} from '@ds/icons/UIIcons'; 
import Link from 'next/link';
// import { ModalDashedBorder } from '@ds/frame/garisputus';

// DUMMY DATA 

const MOCK_USER_DATA = {
    username: 'Falah_UIUX', 
    email: 'fal.ah@example.com',
    phone: '0812-3456-7890',
    password: 'user123456'
};

// SVG Component untuk border putus-putus
const ModalDashedBorder = ({ className, style = {} }) => (
    <svg 
        className={className}
        style={{
            ...style,
            left: '4px',
            top: '4px',
            right: '4px',
            bottom: '4px',
            width: 'calc(100% - 8px)',
            height: 'calc(100% - 8px)',
        }}
        preserveAspectRatio="none"
    >
        <rect 
              x="1"
              y="1"
              width="calc(100% - 2px)"
              height="calc(100% - 2px)"
              rx="5"
              ry="5"
              stroke="rgb(255, 171, 47)"
              strokeWidth="1.5"
              strokeLinecap="square"
              strokeLinejoin="round"
              strokeDasharray="20 4 3 6 6 4"
              fill="none"
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
                <p className="text-h-7 font-medium text-accent-neutral-1000 ">
                    Edit Password
                </p>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-body-1 font-medium text-accent-neutral-1000 mb-2">Password Lama</label>
                        <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300 p-1">
                            {/* Modal Border SVG - Garis Putus-putus dengan jarak dari border */}
                            <ModalDashedBorder className="absolute pointer-events-none z-2" />
                            <input 
                                type="password"
                                className="relative pl-4  z-10 w-full p-3 text-body-1 font-medium bg-transparent rounded-lg focus:outline-none text-accent-neutral-1000"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-body-1 font-medium text-accent-neutral-1000 mb-2">Password Baru</label>
                        <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300 p-1">
                            {/* Modal Border SVG - Garis Putus-putus dengan jarak dari border */}
                            <ModalDashedBorder className="absolute pointer-events-none z-2" />
                            <input 
                                type="password"
                                className="relative pl-4  z-10 w-full p-3 text-body-1 font-medium bg-transparent rounded-lg focus:outline-none text-accent-neutral-1000"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-body-1 font-medium text-accent-neutral-1000 mb-2">Konfirmasi Password Baru</label>
                        <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300 p-1">
                            {/* Modal Border SVG - Garis Putus-putus dengan jarak dari border */}
                            <ModalDashedBorder className="absolute pointer-events-none z-2" />
                            <input 
                                type="password"
                                className="relative pl-4 z-10 w-full p-3 text-body-1 font-medium bg-transparent rounded-lg focus:outline-none text-accent-neutral-1000"
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
        <label className="block text-body-1 font-medium text-accent-neutral-1000 mb-2">{label}</label>
        {isEditing && as === 'input' ? (
            <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300 p-1 ">
                <ModalDashedBorder className="absolute pointer-events-none z-2" />
                <input 
                    type={type}
                    defaultValue={type !== 'password' ? value : ''} 
                    readOnly={readOnly}
                    className={`relative pl-4 z-10 text-body-1 font-medium text-accent-neutral-1000 w-full p-3 bg-transparent rounded-lg focus:outline-none ${readOnly ? 'text-gray-500' : 'text-accent-neutral-1000'}`}
                />
            </div>
        ) : isEditing && as === 'textarea' ? (
            <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300 p-1">
                {/* Modal Border SVG - Garis Putus-putus dengan jarak dari border */}
                <ModalDashedBorder className="absolute pointer-events-none z-2" />
                <textarea 
                    defaultValue={value} 
                    readOnly={readOnly}
                    rows="3"
                    className={`relative pl-4 z-10 text-body-1 font-medium w-full p-3 bg-transparent rounded-lg focus:outline-none ${readOnly ? 'text-gray-500' : 'text-accent-neutral-1000'}`}
                />
            </div>
        ) : (
            // Mode View
            <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300">
                <ModalDashedBorder className="absolute pointer-events-none z-2" />
                <div className={`relative z-10 w-full pl-6 p-3 text-body-1 font-medium ${readOnly ? 'text-gray-500' : 'text-accent-neutral-1000'}`}>
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
                    <p className="sm:text-h-5 text-h-7 font-bold text-accent-neutral-1000">Hai, {userProfile.username}</p>
                </div>

                {/* Konten Utama Profil */}
                <ProfileDetails 
                    user={userProfile} 
                    isEditing={isEditing} 
                    onPasswordChangeClick={handleChangePasswordClick} 
                />

                {/* Tombol Aksi */}
                <div className={`flex gap-2 mt-8 ${isEditing ? 'justify-end' : 'justify-between'}`}>
                    {isEditing ? (
                        <>
                            <button 

                                onClick={handleToggleEdit}
                                className="sm:px-6 px-4 sm:py-4 py-1
                                font-bold 
                                h-10 
                                bg-transparent 
                                sm:text-body-2 text-body-5
                                transition ease-out duration-300 
                                text-accent-red-300 
                                border border-accent-red-300 rounded-md 
                                hover:bg-accent-red-300 hover:text-white   
                                font-medium flex items-center justify-center gap-2"
                            >
                                Batal Perubahan 
                            </button>
                            <button 
                                onClick={handleToggleEdit}
                                className="sm:px-6 px-4 sm:py-4 py-1 h-10 font-bold bg-accent-blue-400 border-accent-blue-400 ease-out duration-300 sm:text-body-2 text-body-5  text-white  rounded-md hover:bg-accent-blue-500 transition  font-medium flex items-center justify-center gap-2"
                            >
                                <DocumentIcon className="sm:w-5 sm:h-5 w-4 w-4" />
                                <span>Simpan Perubahan</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                            href="/"
                                onClick={() => console.log('Logout clicked')}
                               
                                className="sm:px-6 px-4 sm:py-4 py-1
                                font-bold 
                                h-10 
                                bg-transparent 
                                sm:text-body-2 text-body-5
                                transition ease-out duration-300 
                                text-accent-red-300 
                                border border-accent-red-300 rounded-md 
                                hover:bg-accent-red-300 hover:text-white   
                                font-medium flex items-center justify-center gap-2"
                            >
                                <LogOutDoor className="sm:w-5 sm:h-5 w-4 h-4" /> 
                                <span>Logout</span>
                                
                            </Link>
                            
                            <button 
                                onClick={handleToggleEdit}
                                className="sm:px-6 px-4 sm:py-4 py-1 h-10 font-bold bg-accent-yellow-300 border-accent-yellow-300 ease-out duration-300 sm:text-body-2 text-body-5 text-white rounded-md hover:bg-accent-yellow-400 transition font-medium flex items-center justify-center gap-2"
                            >
                                <PencilIcon className="sm:w-5 sm:h-5 w-4 h-4" /> 
                                <span>Edit Profile</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}