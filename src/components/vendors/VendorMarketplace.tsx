import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Heart, MessageCircle, Calendar, Eye, ChevronDown } from 'lucide-react';
import { getApprovedVendors, searchVendors, getFeaturedVendors } from '../../lib/vendors';
import { addFavoriteVendor, removeFavoriteVendor, isVendorFavorite } from '../../lib/favorites';
import { VendorCard } from './VendorCard';
import { VendorDetails } from './VendorDetails';
import { BookingModal } from './BookingModal';
import { Database } from '../../types/database';

type Vendor = Database['public']['Tables']['vendors']['Row'];

interface VendorMarketplaceProps {
  onVendorSelect?: (vendor: Vendor) => void;
}

export const VendorMarketplace: React.FC<VendorMarketplaceProps> = ({ onVendorSelect }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [featuredVendors, setFeaturedVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingVendor, setBookingVendor] = useState<Vendor | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'reviews'>('rating');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'photographer', label: 'Photography' },
    { value: 'videographer', label: 'Videography' },
    { value: 'venue', label: 'Venues' },
    { value: 'caterer', label: 'Catering' },
    { value: 'florist', label: 'Florists' },
    { value: 'baker', label: 'Bakery' },
    { value: 'musician', label: 'Music' },
    { value: 'dj', label: 'DJ Services' },
    { value: 'planner', label: 'Wedding Planners' },
    { value: 'decorator', label: 'Decorators' },
    { value: 'makeup', label: 'Makeup Artists' },
    { value: 'hair', label: 'Hair Stylists' }
  ];

  useEffect(() => {
    loadVendors();
    loadFeaturedVendors();
    loadFavorites();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const data = await getApprovedVendors();
      setVendors(data);
    } catch (err) {
      console.error('Error loading vendors:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedVendors = async () => {
    try {
      const data = await getFeaturedVendors(6);
      setFeaturedVendors(data);
    } catch (err) {
      console.error('Error loading featured vendors:', err);
    }
  };

  const loadFavorites = async () => {
    try {
      // Load all vendor IDs and check which ones are favorites
      const favoriteSet = new Set<string>();
      for (const vendor of vendors) {
        const isFav = await isVendorFavorite(vendor.id);
        if (isFav) {
          favoriteSet.add(vendor.id);
        }
      }
      setFavorites(favoriteSet);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await searchVendors(searchTerm, selectedCategory);
      
      // Apply price filter
      let filteredData = data;
      if (priceRange !== 'all') {
        filteredData = data.filter(vendor => {
          if (priceRange === 'low') return vendor.starting_price < 1000;
          if (priceRange === 'medium') return vendor.starting_price >= 1000 && vendor.starting_price < 3000;
          if (priceRange === 'high') return vendor.starting_price >= 3000;
          return true;
        });
      }

      // Apply sorting
      filteredData.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'price':
            return a.starting_price - b.starting_price;
          case 'reviews':
            return b.review_count - a.review_count;
          default:
            return 0;
        }
      });

      setVendors(filteredData);
    } catch (err) {
      console.error('Error searching vendors:', err);
      setError(err instanceof Error ? err.message : 'Failed to search vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleVendorClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    onVendorSelect?.(vendor);
  };

  const handleBookVendor = (vendor: Vendor) => {
    setBookingVendor(vendor);
    setShowBookingModal(true);
  };

  const handleToggleFavorite = async (vendor: Vendor) => {
    try {
      const isFav = favorites.has(vendor.id);
      if (isFav) {
        await removeFavoriteVendor(vendor.id);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(vendor.id);
          return newSet;
        });
      } else {
        await addFavoriteVendor(vendor.id);
        setFavorites(prev => new Set(prev).add(vendor.id));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (loading && vendors.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Vendor Marketplace</h1>
        <p className="text-gray-600">Discover and connect with top wedding professionals</p>
      </div>

      {/* Featured Vendors */}
      {featuredVendors.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Vendors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onView={() => handleVendorClick(vendor)}
                onBook={() => handleBookVendor(vendor)}
                onToggleFavorite={() => handleToggleFavorite(vendor)}
                isFavorite={favorites.has(vendor.id)}
                featured
              />
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search vendors by name or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as 'all' | 'low' | 'medium' | 'high')}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="low">Under $1,000</option>
                <option value="medium">$1,000 - $3,000</option>
                <option value="high">$3,000+</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'price' | 'reviews')}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="rating">Sort by Rating</option>
                <option value="price">Sort by Price</option>
                <option value="reviews">Sort by Reviews</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange('all');
                  setSortBy('rating');
                }}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Results */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          All Vendors {vendors.length > 0 && `(${vendors.length} found)`}
        </h2>
        
        {vendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onView={() => handleVendorClick(vendor)}
                onBook={() => handleBookVendor(vendor)}
                onToggleFavorite={() => handleToggleFavorite(vendor)}
                isFavorite={favorites.has(vendor.id)}
              />
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No vendors found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        ) : null}
      </div>

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