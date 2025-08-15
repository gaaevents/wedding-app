import React, { useState, useEffect } from 'react';
import { Heart, Search, Filter, Star, MapPin, Trash2, MessageCircle, Calendar } from 'lucide-react';
import { getFavoriteVendors, removeFavoriteVendor, addFavoriteVendor } from '../../lib/favorites';
import { VendorCard } from '../vendors/VendorCard';
import { VendorDetails } from '../vendors/VendorDetails';
import { BookingModal } from '../vendors/BookingModal';
import { Database } from '../../types/database';

type Vendor = Database['public']['Tables']['vendors']['Row'];

export const FavoritesManager: React.FC = () => {
  const [favorites, setFavorites] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingVendor, setBookingVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavoriteVendors();
      setFavorites(data);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (vendorId: string) => {
    try {
      await removeFavoriteVendor(vendorId);
      setFavorites(favorites.filter(v => v.id !== vendorId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove favorite');
    }
  };

  const handleBookVendor = (vendor: Vendor) => {
    setBookingVendor(vendor);
    setShowBookingModal(true);
  };

  const filteredFavorites = favorites.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Heart className="w-8 h-8 text-rose-500 fill-current" />
            <span>Favorite Vendors</span>
          </h2>
          <p className="text-gray-600">Your saved wedding vendors in one place</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-800">{favorites.length}</div>
          <div className="text-sm text-gray-500">Saved Vendors</div>
        </div>
      </div>

      {/* Search */}
      {favorites.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your favorite vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Favorites Grid */}
      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((vendor) => (
            <div key={vendor.id} className="relative">
              <VendorCard
                vendor={vendor}
                onView={() => setSelectedVendor(vendor)}
                onBook={() => handleBookVendor(vendor)}
              />
              {/* Remove from Favorites Button */}
              <button
                onClick={() => handleRemoveFavorite(vendor.id)}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Remove from favorites"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-rose-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No favorite vendors yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start browsing vendors and save your favorites by clicking the heart icon. 
            They'll appear here for easy access!
          </p>
          <button
            onClick={() => window.location.href = '/vendors'}
            className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-8 py-3 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Browse Vendors
          </button>
        </div>
      ) : (
        /* No Search Results */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No vendors found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      )}

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <VendorDetails
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onBook={() => handleBookVendor(selectedVendor)}
        />
      )}

      {/* Booking Modal */}
      {showBookingModal && bookingVendor && (
        <BookingModal
          vendor={bookingVendor}
          onClose={() => {
            setShowBookingModal(false);
            setBookingVendor(null);
          }}
          onSuccess={() => {
            setShowBookingModal(false);
            setBookingVendor(null);
          }}
        />
      )}
    </div>
  );
};