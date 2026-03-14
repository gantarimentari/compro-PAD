'use client';

import React, { useState, useEffect } from 'react';
import { UserIcon, LogOutDoor, PencilIcon, DocumentIcon } from '@/components/icons/UIIcons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import profileService from '@/lib/services/profileService';
import authService from '@/lib/services/authService';

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

// --- Profile Details Component ---
const ProfileDetails = ({ user, formData, isEditing, onChange, errors }) => {
    return (
        <div className="space-y-6">
            <InputGroup 
                label="Username" 
                name="username"
                value={isEditing ? formData.username : user.username}
                isEditing={isEditing}
                onChange={onChange}
                error={errors.username}
            />
            <InputGroup 
                label="Nomor Telepon" 
                name="phone_number"
                value={isEditing ? formData.phone_number : user.phone_number || '-'}
                isEditing={isEditing}
                onChange={onChange}
                error={errors.phone_number}
            />
            <InputGroup 
                label="E-mail" 
                value={user.email}
                isEditing={false}
                readOnly 
            />
        </div>
    );
};

// --- Input Group Component ---
const InputGroup = ({ label, name, value, isEditing, readOnly, onChange, error }) => (
    <div>
        <label className="block sm:text-h-6 text-body-1 font-medium text-accent-neutral-1000 mb-2">
            {label}
        </label>
        {isEditing && !readOnly ? (
            <>
                <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300 p-1">
                    <ModalDashedBorder className="absolute inset-0 w-full h-full z-0 pointer-events-none p-1" />
                    <input 
                        type="text"
                        name={name}
                        value={value}
                        onChange={onChange}
                        className="relative pl-4 z-10 sm:text-h-7 text-body-1 font-medium text-accent-neutral-1000 w-full p-3 bg-transparent rounded-lg focus:outline-none"
                    />
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </>
        ) : (
            <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300">
                <ModalDashedBorder className="absolute inset-0 pointer-events-none rounded-lg p-1" />
                <div className={`relative z-10 w-full pl-6 p-3 sm:text-h-7 text-body-1 font-medium ${readOnly ? 'text-gray-500' : 'text-accent-neutral-1000'}`}>
                    {value}
                </div>
            </div>
        )}
    </div>
);

// --- Main Component ---
export default function UserProfile() {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Form data - hanya username dan phone_number
    const [formData, setFormData] = useState({
        username: '',
        phone_number: '',
    });

    //  Fetch user profile from API
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true);
            const res = await profileService.get();
            
            setUserProfile(res.user);
            setFormData({
                username: res.user.username,
                phone_number: res.user.phone_number || '',
            });
        } catch (err) {
            console.error('❌ Error fetching profile:', err);
            
            // If unauthorized, redirect to login
            if (err.response?.status === 401) {
                router.push('/auth/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // ✅ Validasi khusus untuk phone_number
        if (name === 'phone_number') {
            // Cek apakah ada karakter selain angka, +, -, spasi, atau tanda kurung
            if (value && !/^[\d\s\-\+\(\)]*$/.test(value)) {
                setErrors(prev => ({ 
                    ...prev, 
                    [name]: 'Format nomor telepon tidak valid' 
                }));
                return; // Stop, jangan update formData
            }
            
            // Cek apakah ada huruf
            if (/[a-zA-Z]/.test(value)) {
                setErrors(prev => ({ 
                    ...prev, 
                    [name]: 'Nomor telepon tidak boleh mengandung huruf' 
                }));
                return;
            }
            
            // Validasi panjang (opsional, sesuaikan dengan kebutuhan)
            if (value.length > 15) {
                setErrors(prev => ({ 
                    ...prev, 
                    [name]: 'Nomor telepon maksimal 15 digit' 
                }));
                return;
            }
        }
        
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error for this field jika valid
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Toggle edit mode
    const handleToggleEdit = () => {
        if (isEditing) {
            // Reset form
            setFormData({
                username: userProfile.username,
                phone_number: userProfile.phone_number || '',
            });
            setErrors({});
        }
        setIsEditing(!isEditing);
    };

    //  Save profile changes
    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            setErrors({});
            setSuccessMessage('');

            // ✅ Validasi frontend sebelum submit
            const newErrors = {};
            
            // Validasi username
            if (!formData.username || formData.username.trim() === '') {
                newErrors.username = 'Username tidak boleh kosong';
            }
            
            // Validasi phone_number
            if (formData.phone_number) {
                if (/[a-zA-Z]/.test(formData.phone_number)) {
                    newErrors.phone_number = 'Nomor telepon tidak boleh mengandung huruf';
                } else if (!/^[\d\s\-\+\(\)]*$/.test(formData.phone_number)) {
                    newErrors.phone_number = 'Format nomor telepon tidak valid';
                } else if (formData.phone_number.replace(/[\s\-\+\(\)]/g, '').length < 10) {
                    newErrors.phone_number = 'Nomor telepon minimal 10 digit';
                } else if (formData.phone_number.length > 15) {
                    newErrors.phone_number = 'Nomor telepon maksimal 15 digit';
                }
            }
            
            // Jika ada error, tampilkan dan stop
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            // Update profile
            const res = await profileService.update({
                username: formData.username,
                phone_number: formData.phone_number,
            });

            setUserProfile(res.user);
            setSuccessMessage('Profile berhasil diperbarui!');
            setIsEditing(false);

            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (err) {
            console.error('❌ Error updating profile:', err);
            
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: 'Gagal memperbarui profile. Silakan coba lagi.' });
            }
        } finally {
            setIsSaving(false);
        }
    };

    //  Handle logout
    const handleLogout = async () => {
        try {
            await authService.logout();
            localStorage.removeItem('user');
            sessionStorage.clear();
            router.push('/');
        } catch (err) {
            console.error('❌ Logout error:', err);
            // Force logout anyway
            localStorage.removeItem('user');
            sessionStorage.clear();
            router.push('/');
        }
    };

    if (isLoading || !userProfile) {
        return (
            <div className="p-8 text-center text-gray-500 min-h-[500px] flex items-center justify-center">
                Memuat data profile... 
            </div>
        );
    }

    return (
        <div className="pt-8 pb-16 px-4">
            <div className="max-w-2xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <p className="sm:text-h-3 text-h-5 font-bold text-accent-neutral-1000">
                        Hai, {userProfile.username}
                    </p>
                </div>

                {/* Success Toast */}
                {successMessage && (
                    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white border border-green-200 shadow-lg rounded-2xl px-6 py-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-body-2 font-semibold text-accent-neutral-1000">{successMessage}</p>
                    </div>
                )}

                {/* Error Message */}
                {errors.general && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {errors.general}
                    </div>
                )}

                {/* Profile Details */}
                <ProfileDetails 
                    user={userProfile} 
                    formData={formData}
                    isEditing={isEditing}
                    onChange={handleChange}
                    errors={errors}
                />

                {/* Action Buttons */}
                <div className="flex justify-between mt-8 gap-2">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={handleToggleEdit}
                                disabled={isSaving}
                                className="sm:px-6 px-4 font-bold sm:py-4 py-2 h-10 bg-transparent sm:text-body-2 text-body-5 transition ease-out duration-300 text-accent-red-300 border border-accent-red-300 rounded-lg hover:bg-accent-red-300 hover:text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                Batal Perubahan 
                            </button>
                            
                            <button 
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="sm:px-6 px-4 sm:py-4 py-2 h-10 font-bold bg-accent-yellow-300 border-accent-yellow-300 ease-out duration-300 sm:text-body-2 text-body-5 text-white rounded-lg hover:bg-accent-yellow-400 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <DocumentIcon className="sm:w-5 sm:h-5 w-4 h-4" />
                                <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleLogout}
                                className="sm:px-6 px-4 font-bold sm:py-4 py-2 h-10 bg-transparent sm:text-body-2 text-body-5 transition ease-out duration-300 text-accent-red-300 border border-accent-red-300 rounded-lg hover:bg-accent-red-300 hover:text-white font-medium flex items-center justify-center gap-2"
                            >
                                <LogOutDoor className="sm:w-5 sm:h-5 w-4 h-4" /> 
                                <span>Logout</span>
                            </button>
                            
                            <button 
                                onClick={handleToggleEdit}
                                className="sm:px-6 px-4 sm:py-4 py-2 h-10 font-bold bg-accent-yellow-300 border-accent-yellow-300 ease-out duration-300 sm:text-body-2 text-body-5 text-white rounded-lg hover:bg-accent-yellow-400 transition font-medium flex items-center justify-center gap-2"
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