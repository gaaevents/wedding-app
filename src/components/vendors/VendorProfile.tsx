import React, { useState, useEffect } from 'react';
import { Save, Upload, Star, MapPin, Phone, Mail, Globe, Plus, X, Camera } from 'lucide-react';
import { getCurrentVendorProfile, createVendorProfile, updateVendorProfile } from '../../lib/vendors';
import { Database } from '../../types/database';

type Vendor = Database['public']['Tables']['vendors']['Row'];

interface VendorProfileProps {
  onSave?: (vendor: Vendor) => void;
}

export const VendorProfile: React.FC<VendorProfileProps> = ({ onSave }) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    email: '',
    phone: '',
    website: '',
    location: '',
    description: '',
    starting_price: 0,
    services: [] as string[],
    photos: [] as string[],
    social_media: {
      instagram: '',
      facebook: '',
      twitter: ''
    }
  });

  const [newService, setNewService] = useState('');
  const [newPhoto, setNewPhoto] = useState('');

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

  useEffect(() => {
    loadVendorProfile();
  }, []);

  const loadVendorProfile = async () => {
    try {
      setLoading(true);
      const profile = await getCurrentVendorProfile();
      
      if (profile) {
        setVendor(profile);
        setFormData({
          name: profile.name,
          category: profile.category,
          email: profile.email,
          phone: profile.phone,
          website: profile.website || '',
          location: profile.location,
          description: profile.description,
          starting_price: profile.starting_price,
          services: Array.isArray(profile.services) ? profile.services as string[] : [],
          photos: Array.isArray(profile.photos) ? profile.photos as string[] : [],
          social_media: profile.social_media as any || { instagram: '', facebook: '', twitter: '' }
        });
      }
    } catch (err) {
      console.error('Error loading vendor profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const vendorData = {
        name: formData.name,
        category: formData.category,
        email: formData.email,
        phone: formData.phone,
        website: formData.website || null,
        location: formData.location,
        description: formData.description,
        starting_price: formData.starting_price,
        services: formData.services,
        photos: formData.photos,
        social_media: formData.social_media
      };

      let savedVendor;
      if (vendor) {
        savedVendor = await updateVendorProfile(vendor.id, vendorData);
      } else {
        savedVendor = await createVendorProfile(vendorData);
      }

      setVendor(savedVendor);
      setSuccess(vendor ? 'Profile updated successfully!' : 'Profile created successfully!');
      onSave?.(savedVendor);
    } catch (err) {
      console.error('Error saving vendor profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData({
        ...formData,
        services: [...formData.services, newService.trim()]
      });
      setNewService('');
    }
  };

  const removeService = (index: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index)
    });
  };

  const addPhoto = () => {
    if (newPhoto.trim() && !formData.photos.includes(newPhoto.trim())) {
      setFormData({
        ...formData,
        photos: [...formData.photos, newPhoto.trim()]
      });
      setNewPhoto('');
    }
  };

  const removePhoto = (index: number) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {vendor ? 'Edit Vendor Profile' : 'Create Vendor Profile'}
        </h1>
        <p className="text-gray-600">
          {vendor ? 'Update your business information and services' : 'Set up your vendor profile to start receiving bookings'}
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Your business name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="business@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Starting Price ($) *
            </label>
            <input
              type="number"
              min="0"
              step="50"
              required
              value={formData.starting_price}
              onChange={(e) => setFormData({ ...formData, starting_price: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="1000"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Describe your business and what makes you special..."
            />
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Services Offered</h3>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Add a service..."
              />
              <button
                type="button"
                onClick={addService}
                className="px-4 py-3 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {formData.services.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg"
                  >
                    <span className="text-gray-700">{service}</span>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Portfolio Photos</h3>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="url"
                value={newPhoto}
                onChange={(e) => setNewPhoto(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPhoto())}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Add photo URL..."
              />
              <button
                type="button"
                onClick={addPhoto}
                className="px-4 py-3 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {formData.photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Camera className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No photos added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Social Media</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="text"
                value={formData.social_media.instagram}
                onChange={(e) => setFormData({
                  ...formData,
                  social_media: { ...formData.social_media, instagram: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="@yourbusiness"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="text"
                value={formData.social_media.facebook}
                onChange={(e) => setFormData({
                  ...formData,
                  social_media: { ...formData.social_media, facebook: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="YourBusinessPage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <input
                type="text"
                value={formData.social_media.twitter}
                onChange={(e) => setFormData({
                  ...formData,
                  social_media: { ...formData.social_media, twitter: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="@yourbusiness"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : (vendor ? 'Update Profile' : 'Create Profile')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};