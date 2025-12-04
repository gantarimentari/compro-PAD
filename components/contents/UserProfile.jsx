'use client';

import React, { useState, useEffect } from 'react';
import { UserIcon, LogOutDoor, PencilIcon, DocumentIcon } from '@ds/icons/UIIcons'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@lib/api.js'; // ✅ Import API client

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

// --- Password Change Component ---
const PasswordChangeForm = ({ formData, onChange, errors }) => {
    return (
        <div className="space-y-6 mt-8">
            <p className="text-h-4 font-medium text-accent-neutral-1000">
                Ubah Password
            </p>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-h-6 font-medium text-accent-neutral-1000 mb-2">
                        Password Lama
                    </label>
                    <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300 p-1">
                        <ModalDashedBorder className="absolute inset-0 w-full h-full z-0 pointer-events-none p-1" />
                        <input 
                            type="password"
                            name="current_password"
                            value={formData.current_password}
                            onChange={onChange}
                            className="relative pl-4 z-10 w-full p-3 text-h-7 font-medium bg-transparent rounded-lg focus:outline-none text-accent-neutral-1000"
                        />
                    </div>
                    {errors.current_password && (
                        <p className="mt-1 text-sm text-red-500">{errors.current_password}</p>
                    )}
                </div>
                
                <div>
                    <label className="block text-h-6 font-medium text-accent-neutral-1000 mb-2">
                        Password Baru
                    </label>
                    <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300 p-1">
                        <ModalDashedBorder className="absolute inset-0 w-full h-full z-0 pointer-events-none p-1" />
                        <input 
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={onChange}
                            className="relative pl-4 z-10 w-full p-3 text-h-7 font-medium bg-transparent rounded-lg focus:outline-none text-accent-neutral-1000"
                        />
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                </div>
                
                <div>
                    <label className="block text-h-6 font-medium text-accent-neutral-1000 mb-2">
                        Konfirmasi Password Baru
                    </label>
                    <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300 p-1">
                        <ModalDashedBorder className="absolute inset-0 w-full h-full z-0 pointer-events-none p-1" />
                        <input 
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={onChange}
                            className="relative pl-4 z-10 w-full p-3 text-h-7 font-medium bg-transparent rounded-lg focus:outline-none text-accent-neutral-1000"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Input Group Component ---
const InputGroup = ({ label, name, value, isEditing, readOnly, onChange, error }) => (
    <div>
        <label className="block text-h-6 font-medium text-accent-neutral-1000 mb-2">
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
                        className="relative pl-4 z-10 text-h-7 font-medium text-accent-neutral-1000 w-full p-3 bg-transparent rounded-lg focus:outline-none"
                    />
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </>
        ) : (
            <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300">
                <ModalDashedBorder className="absolute inset-0 pointer-events-none rounded-lg p-1" />
                <div className={`relative z-10 w-full pl-6 p-3 text-h-7 font-medium ${readOnly ? 'text-gray-500' : 'text-accent-neutral-1000'}`}>
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
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Form data
    const [formData, setFormData] = useState({
        username: '',
        phone_number: '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // ✅ Fetch user profile from API
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/api/profile');
            
            setUserProfile(res.data.user);
            setFormData({
                username: res.data.user.username,
                phone_number: res.data.user.phone_number || '',
                current_password: '',
                password: '',
                password_confirmation: '',
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
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error for this field
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
                current_password: '',
                password: '',
                password_confirmation: '',
            });
            setErrors({});
        }
        setIsEditing(!isEditing);
        setIsChangingPassword(false);
    };

    // ✅ Save profile changes
    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            setErrors({});
            setSuccessMessage('');

            // Update profile
            const res = await api.put('/api/profile', {
                username: formData.username,
                phone_number: formData.phone_number,
            });

            setUserProfile(res.data.user);
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

    // ✅ Save password change
    const handleSavePassword = async () => {
        try {
            setIsSaving(true);
            setErrors({});
            setSuccessMessage('');

            await api.put('/api/profile/password', {
                current_password: formData.current_password,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            });

            setSuccessMessage('Password berhasil diperbarui!');
            setIsChangingPassword(false);
            setIsEditing(false);
            
            // Reset password fields
            setFormData(prev => ({
                ...prev,
                current_password: '',
                password: '',
                password_confirmation: '',
            }));

            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (err) {
            console.error('❌ Error updating password:', err);
            
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: 'Gagal memperbarui password. Silakan coba lagi.' });
            }
        } finally {
            setIsSaving(false);
        }
    };

    // ✅ Handle logout
    const handleLogout = async () => {
        try {
            await api.post('/api/logout');
            router.push('/auth/login');
        } catch (err) {
            console.error('❌ Logout error:', err);
            // Force logout anyway
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
                    <p className="text-h-3 font-bold text-accent-neutral-1000">
                        Hai, {userProfile.username}
                    </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {successMessage}
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

                {/* Password Change Form (only in edit mode) */}
                {isEditing && isChangingPassword && (
                    <PasswordChangeForm 
                        formData={formData}
                        onChange={handleChange}
                        errors={errors}
                    />
                )}

                {/* Action Buttons */}
                <div className="flex justify-between mt-8">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={handleToggleEdit}
                                disabled={isSaving}
                                className="px-6 font-bold py-4 h-10 bg-transparent text-body-2 transition ease-out duration-300 text-accent-red-300 border border-accent-red-300 rounded-lg hover:bg-accent-red-300 hover:text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                Batal
                            </button>
                            
                            <div className="flex gap-3">
                                {!isChangingPassword && (
                                    <button 
                                        onClick={() => setIsChangingPassword(true)}
                                        disabled={isSaving}
                                        className="px-6 py-4 h-10 font-bold bg-accent-blue-400 text-body-2 text-white rounded-lg hover:bg-accent-blue-500 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        Ubah Password
                                    </button>
                                )}
                                
                                <button 
                                    onClick={isChangingPassword ? handleSavePassword : handleSaveProfile}
                                    disabled={isSaving}
                                    className="px-6 py-4 h-10 font-bold bg-accent-yellow-300 border-accent-yellow-300 ease-out duration-300 text-body-2 text-white rounded-lg hover:bg-accent-yellow-400 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <DocumentIcon className="w-5 h-5" />
                                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleLogout}
                                className="px-6 font-bold py-4 h-10 bg-transparent text-body-2 transition ease-out duration-300 text-accent-red-300 border border-accent-red-300 rounded-lg hover:bg-accent-red-300 hover:text-white font-medium flex items-center justify-center gap-2"
                            >
                                <LogOutDoor className="w-5 h-5" /> 
                                <span>Logout</span>
                            </button>
                            
                            <button 
                                onClick={handleToggleEdit}
                                className="px-6 py-4 h-10 font-bold bg-accent-yellow-300 border-accent-yellow-300 ease-out duration-300 text-body-2 text-white rounded-lg hover:bg-accent-yellow-400 transition font-medium flex items-center justify-center gap-2"
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