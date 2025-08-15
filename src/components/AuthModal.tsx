import React, { useState } from 'react';
import { X, Heart, User, Building, Users, Crown, AlertCircle, CheckCircle } from 'lucide-react';
import { UserRole } from '../types';
import { supabase, createUserProfile, ensureUserProfile } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: { id: string; name: string; email: string; role: UserRole }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('couple');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const roles = [
    { value: 'couple' as UserRole, label: 'Couple', icon: Heart, description: 'Planning your wedding' },
    { value: 'vendor' as UserRole, label: 'Vendor', icon: Building, description: 'Wedding service provider' },
    { value: 'guest' as UserRole, label: 'Guest', icon: User, description: 'Wedding attendee' },
    { value: 'general' as UserRole, label: 'General', icon: Users, description: 'Browse public events' },
    { value: 'admin' as UserRole, label: 'Admin', icon: Crown, description: 'Platform administrator' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        // Sign in existing user
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) {
          throw new Error(authError.message);
        }

        if (authData.user) {
          // Ensure user profile exists
          const profile = await ensureUserProfile(authData.user);
          
          if (profile) {
            onLogin({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role as UserRole
            });
          } else {
            throw new Error('Failed to load or create user profile');
          }
        }
      } else {
        // Sign up new user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              role: selectedRole
            }
          }
        });

        if (authError) {
          throw new Error(authError.message);
        }

        if (authData.user) {
          // Create user profile
          try {
            const profile = await createUserProfile(authData.user.id, {
              name: formData.name,
              email: formData.email,
              role: selectedRole
            });

            // For email confirmation disabled, log them in immediately
            if (authData.session) {
              onLogin({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                role: profile.role as UserRole
              });
            } else {
              setSuccess('Account created successfully! Please check your email to verify your account.');
            }
          } catch (profileError) {
            console.error('Profile creation error:', profileError);
            // Even if profile creation fails, try to log them in
            if (authData.session) {
              const profile = await ensureUserProfile(authData.user, {
                name: formData.name,
                role: selectedRole
              });
              
              if (profile) {
                onLogin({
                  id: profile.id,
                  name: profile.name,
                  email: profile.email,
                  role: profile.role as UserRole
                });
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role: UserRole, name: string) => {
    setLoading(true);
    setError(null);

    try {
      // Create demo credentials
      const demoEmail = `${name.toLowerCase().replace(/[^a-z]/g, '')}@demo.com`;
      const demoPassword = 'demo123456';

      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (signInError && signInError.message.includes('Invalid login credentials')) {
        // User doesn't exist, create demo account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
          options: {
            data: {
              name,
              role
            }
          }
        });

        if (signUpError) {
          throw new Error(signUpError.message);
        }

        if (signUpData.user) {
          // Create user profile
          const profile = await createUserProfile(signUpData.user.id, {
            name,
            email: demoEmail,
            role
          });

          onLogin({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as UserRole
          });
        }
      } else if (signInData.user) {
        // User exists, ensure profile exists
        const profile = await ensureUserProfile(signInData.user, { name, role });

        if (profile) {
          onLogin({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as UserRole
          });
        }
      } else if (signInError) {
        throw new Error(signInError.message);
      }
    } catch (err) {
      console.error('Demo login error:', err);
      setError(err instanceof Error ? err.message : 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-current" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isLogin ? 'Welcome Back' : 'Join GA&A Events'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          {/* Quick Demo Access */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Demo Access</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => demoLogin('couple', 'Sarah & Michael')}
                disabled={loading}
                className="p-3 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Couple Demo
              </button>
              <button
                onClick={() => demoLogin('vendor', 'Elite Catering')}
                disabled={loading}
                className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Vendor Demo
              </button>
              <button
                onClick={() => demoLogin('guest', 'John Smith')}
                disabled={loading}
                className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Guest Demo
              </button>
              <button
                onClick={() => demoLogin('admin', 'Admin User')}
                disabled={loading}
                className="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Admin Demo
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setIsLogin(true)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    isLogin ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    !isLogin ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      I am a...
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {roles.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setSelectedRole(role.value)}
                          disabled={loading}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            selectedRole === role.value
                              ? 'border-rose-500 bg-rose-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } disabled:opacity-50`}
                        >
                          <div className="flex items-center space-x-3">
                            <role.icon className={`w-5 h-5 ${
                              selectedRole === role.value ? 'text-rose-600' : 'text-gray-400'
                            }`} />
                            <div>
                              <div className="font-medium text-gray-800">{role.label}</div>
                              <div className="text-sm text-gray-500">{role.description}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all disabled:opacity-50"
                      placeholder="Enter your full name"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="Enter your password"
                />
                {!isLogin && (
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};