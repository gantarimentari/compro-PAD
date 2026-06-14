'use client';

import React from 'react';
import { LogOutDoor, PencilIcon, DocumentIcon } from '@/components/icons/UIIcons';
import { InputGroup } from './_components/InputGroup';
import { useUserProfile } from './hooks/useUserProfile';

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
                placeholder="Masukkan nomor telepon"
            />
            <InputGroup 
                label="E-mail" 
                value={user.email}
                isEditing={false}
                readOnly 
            />

            {isEditing ? (
                <>
                <p className="sm:text-h-6 text-body-1 font-bold text-accent-neutral-1000">
                        Ubah Password
                    </p>
                    {/* <div className="space-y-6"> */}
                        <InputGroup
                            label="Password Lama"
                            name="current_password"
                            value={formData.current_password || ''}
                            isEditing={true}
                            type="password"
                            onChange={onChange}
                            error={errors.current_password}
                            placeholder="Masukkan password lama"
                        />
                        <InputGroup
                            label="Password Baru"
                            name="password"
                            value={formData.password || ''}
                            isEditing={true}
                            type="password"
                            onChange={onChange}
                            error={errors.password}
                            placeholder="Masukkan password baru"
                        />
                        <InputGroup
                            label="Konfirmasi Password Baru"
                            name="password_confirmation"
                            value={formData.password_confirmation || ''}
                            isEditing={true}
                            type="password"
                            onChange={onChange}
                            error={errors.password_confirmation}
                            placeholder="Konfirmasi password baru"
                        />
                    {/* </div> */}
                    </>
                
            ) : (
                <InputGroup
                    label="Password"
                    value="••••••••"
                    isEditing={false}
                    type="password"
                    readOnly
                />
                 )}
                
                
           
            
           
                  </div>
    );
};

// --- Main Component ---
export default function UserProfile() {
    const {
        userProfile,
        isLoading,
        isEditing,
        isSaving,
        errors,
        successMessage,
        formData,
        handleChange,
        handleToggleEdit,
        handleSaveProfile,
        handleLogout,
    } = useUserProfile();

    if (isLoading || !userProfile) {
        return (
            <div className="p-8 text-center text-gray-500 min-h-[500px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-yellow-400"></div>
                Memuat data profile... 
            </div>
        );
    }

    return (
        <div className="pt-8 pb-16 px-4">
            <div className="max-w-2xl mx-auto">
                
                {/* Header */}
                <div className="mb-4">
                    <p className="sm:text-h-4 text-h-5 font-bold text-accent-neutral-1000">
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