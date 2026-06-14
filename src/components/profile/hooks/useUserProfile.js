import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import profileService from '@/lib/services/profileService';
import authService from '@/lib/services/authService';
import { clearFrontendAuthState } from '@/lib/frontendAuth';

export const useUserProfile = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    phone_number: '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  // Fetch profile data
  const { data: profileData, isLoading, error: queryError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: profileService.get,
    retry: false,
    enabled: typeof window !== 'undefined',
  });

  const userProfile = profileData?.user;

  // Sync profile data to form state
  useEffect(() => {
    if (userProfile) {
      setFormData({
        username: userProfile.username || '',
        phone_number: userProfile.phone_number || '',
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    }
  }, [userProfile]);

  // Handle unauthorized redirects
  useEffect(() => {
    if (queryError) {
      console.error('❌ Error fetching profile:', queryError);
      if (queryError.response?.status === 401) {
        router.push('/auth/login');
      }
    }
  }, [queryError, router]);

  // Profile details update mutation
  const profileMutation = useMutation({
    mutationFn: profileService.update,
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data);
    },
  });

  // Password update mutation
  const passwordMutation = useMutation({
    mutationFn: profileService.updatePassword,
  });

  // Form input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for phone_number to align with original component's behavior
    if (name === 'phone_number') {
      if (value && !/^[\d\s\-\+\(\)]*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Format nomor telepon tidak valid',
        }));
        return;
      }

      if (/[a-zA-Z]/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Nomor telepon tidak boleh mengandung huruf',
        }));
        return;
      }

      if (value.length > 15) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Nomor telepon maksimal 15 digit',
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleToggleEdit = () => {
    if (isEditing && userProfile) {
      setFormData({
        username: userProfile.username || '',
        phone_number: userProfile.phone_number || '',
        current_password: '',
        password: '',
        password_confirmation: '',
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    setErrors({});
    setSuccessMessage('');

    const newErrors = {};
    if (!formData.username || formData.username.trim() === '') {
      newErrors.username = 'Username tidak boleh kosong';
    }

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

    // Password validation if password fields are touched
    const hasPasswordInput =
      formData.current_password || formData.password || formData.password_confirmation;

    if (hasPasswordInput) {
      if (!formData.current_password) {
        newErrors.current_password = 'Password lama tidak boleh kosong';
      }
      if (!formData.password) {
        newErrors.password = 'Password baru tidak boleh kosong';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password baru minimal 8 karakter';
      }
      if (!formData.password_confirmation) {
        newErrors.password_confirmation = 'Konfirmasi password baru tidak boleh kosong';
      } else if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Konfirmasi password baru tidak cocok';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // 1. Update Profile (username, phone_number)
      await profileMutation.mutateAsync({
        username: formData.username,
        phone_number: formData.phone_number,
      });

      // 2. Update Password if populated
      if (hasPasswordInput) {
        await passwordMutation.mutateAsync({
          current_password: formData.current_password,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        });
      }

      setSuccessMessage('Profile berhasil diperbarui!');
      setIsEditing(false);

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        current_password: '',
        password: '',
        password_confirmation: '',
      }));

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('❌ Error updating profile or password:', err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({ general: 'Gagal memperbarui profile. Silakan coba lagi.' });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      clearFrontendAuthState();
      localStorage.removeItem('user');
      sessionStorage.clear();
      router.push('/');
    } catch (err) {
      console.error('❌ Logout error:', err);
      clearFrontendAuthState();
      localStorage.removeItem('user');
      sessionStorage.clear();
      router.push('/');
    }
  };

  const isSaving = profileMutation.isPending || passwordMutation.isPending;

  return {
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
  };
};
