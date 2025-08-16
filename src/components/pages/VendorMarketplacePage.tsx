import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Heart, MessageCircle, Calendar, Eye, Award, Camera, ChevronDown } from 'lucide-react';
import { getApprovedVendors, searchVendors, getFeaturedVendors } from '../../lib/vendors';
import { VendorCard } from '../vendors/VendorCard';
import { VendorDetails } from '../vendors/VendorDetails';
import { BookingModal } from '../vendors/BookingModal';
import { Database } from '../../types/database';

type Vendor = Database['public']['Tables']['vendors']['Row'];

export const VendorMarketplacePage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [featuredVendors, setFeaturedVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingVendor, setBookingVendor] = useState<Vendor | null>(null);

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
  };

  const handleBookVendor = (vendor: Vendor) => {
    setBookingVendor(vendor);
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-bold mb-6">Vendor Marketplace</h1>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Discover and connect with the best wedding professionals in your area. 
            From photographers to caterers, find trusted vendors for your perfect day.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div>
              <div className="text-3xl font-bold text-white">1,200+</div>
              <div className="text-purple-200">Trusted Vendors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">4.8★</div>
              <div className="text-purple-200">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-purple-200">Happy Couples</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-purple-200">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      {featuredVendors.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Vendors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onView={() => handleVendorClick(vendor)}
                  onBook={() => handleBookVendor(vendor)}
                  featured
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filters */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search vendors by name, service, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Advanced Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Prices</option>
                    <option value="low">Under $1,000</option>
                    <option value="medium">$1,000 - $3,000</option>
                    <option value="high">$3,000+</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'rating' | 'price' | 'reviews')}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
        </div>
      </section>

      {/* Vendors Grid */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              All Vendors {vendors.length > 0 && `(${vendors.length} found)`}
            </h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading vendors...</p>
              </div>
            </div>
          ) : vendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onView={() => handleVendorClick(vendor)}
                  onBook={() => handleBookVendor(vendor)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No vendors found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Are You a Wedding Vendor?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join our marketplace and connect with couples planning their dream weddings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Become a Vendor
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium">
              Vendor Login
            </button>
          </div>
        </div>
      </section>

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