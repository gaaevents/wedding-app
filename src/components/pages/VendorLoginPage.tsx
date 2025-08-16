import React, { useState } from 'react';
import { Building, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase, ensureUserProfile } from '../../lib/supabase';

export const VendorLoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    category: '',
    phone: '',
    location: ''
  });

  const categories = [
    { value: 'photographer', label: 'Photography' },
    { value: 'videographer', label: 'Videography' },
    { value: 'venue', label: 'Venue' },
    { value: 'caterer', label: 'Catering' },
    { value: 'florist', label: 'Florist' },
    { value: 'baker', label: 'Bakery' },
    { value: 'musician', label: 'Music' },
    { value: 'dj', label: 'DJ Services' },
    { value: 'planner', label: 'Wedding Planner' },
    { value: 'decorator', label: 'Decorator' },
    { value: 'makeup', label: 'Makeup Artist' },
    { value: 'hair', label: 'Hair Stylist' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'officiant', label: 'Officiant' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        // Sign in existing vendor
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) {
          throw new Error(authError.message);
        }

        if (authData.user) {
          const profile = await ensureUserProfile(authData.user);
          if (profile && profile.role === 'vendor') {
            setSuccess('Login successful! Redirecting to your dashboard...');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 2000);
          } else {
            throw new Error('This account is not registered as a vendor');
          }
        }
      } else {
        // Sign up new vendor
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              role: 'vendor',
              business_name: formData.businessName,
              category: formData.category,
              phone: formData.phone,
              location: formData.location
            }
          }
        });

        if (authError) {
          throw new Error(authError.message);
        }

        if (authData.user) {
          setSuccess('Account created successfully! Please check your email to verify your account.');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Vendor Portal</h1>
          <p className="text-xl text-purple-100">
            Access your vendor dashboard and manage your wedding business
          </p>
        </div>
      </section>

      {/* Login Form */}
      <section className="py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setIsLogin(true)}
                  disabled={loading}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    isLogin ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  disabled={loading}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    !isLogin ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="John Smith"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Dream Photography"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select your category</option>
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="vendor@business.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In to Dashboard' : 'Create Vendor Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Additional Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-gray-600 text-sm">
                {isLogin ? "Don't have a vendor account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-600 hover:text-purple-700 font-medium ml-1"
                >
                  {isLogin ? 'Sign up here' : 'Sign in here'}
                </button>
              </p>
              
              {isLogin && (
                <button className="text-purple-600 hover:text-purple-700 text-sm">
                  Forgot your password?
                </button>
              )}
            </div>
          </div>

          {/* Benefits Sidebar */}
          <div className="mt-8 bg-purple-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Why Choose GA&A Events?</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 text-sm">Connect with verified couples</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 text-sm">Secure payment processing</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 text-sm">Professional booking management</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 text-sm">Build your reputation with reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};