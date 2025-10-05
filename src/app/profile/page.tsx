'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { apiClient } from '../../lib/api';

interface UserProfile {
  id: number;
  email: string;
  username: string;
  full_name: string;
  phone: string | null;
  preferred_language: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    email: '',
    username: '',
    full_name: '',
    phone: '',
    preferred_language: 'en'
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        email: profile.email,
        username: profile.username,
        full_name: profile.full_name,
        phone: profile.phone || '',
        preferred_language: profile.preferred_language
      });
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const result = await apiClient.getCurrentUser(token!);
      if (result.success) {
        setProfile(result.data as UserProfile);
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await apiClient.updateProfile(token, profileForm);
      if (result.success) {
        setProfile(result.data as UserProfile);
        setSuccess('Profile updated successfully!');
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('New passwords do not match');
      return;
    }

    setChangingPassword(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await apiClient.changePassword(token, passwordForm);
      if (result.success) {
        setSuccess('Password changed successfully!');
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Profile</h2>
            <p className="text-gray-600">Please wait while we load your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
            <p className="text-gray-600">Unable to load your profile. Please try again.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold mr-6">
                  {profile.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
                  <p className="text-orange-100">@{profile.username}</p>
                  <div className="flex items-center mt-2 space-x-4 text-sm">
                    <span className="bg-white/20 px-3 py-1 rounded-full capitalize">
                      {profile.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full ${
                      profile.is_verified ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {profile.is_verified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Success/Error Messages */}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                {/* Profile Information */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Language
                      </label>
                      <select
                        value={profileForm.preferred_language}
                        onChange={(e) => setProfileForm({...profileForm, preferred_language: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="bn">Bengali</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={updating}
                      className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updating ? 'Updating...' : 'Update Profile'}
                    </button>
                  </form>
                </div>

                {/* Change Password */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.current_password}
                        onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                        minLength={8}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirm_password}
                        onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                        minLength={8}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {changingPassword ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>

                  {/* Account Info */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Information</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Member Since:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
                      <p><strong>Role:</strong> {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</p>
                      <p><strong>Status:</strong> {profile.is_active ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
