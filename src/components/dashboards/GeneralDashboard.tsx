import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Star, Heart, Search, Filter } from 'lucide-react';
import { getPublicEvents } from '../../lib/events';
import { Database } from '../../types/database';

type Event = Database['public']['Tables']['events']['Row'];

interface GeneralDashboardProps {
  user: { id: string; name: string; email: string; role: string };
}

export const GeneralDashboard: React.FC<GeneralDashboardProps> = ({ user }) => {
  const [publicEvents, setPublicEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [marketplace] = useState([
    {
      id: '1',
      name: 'Dream Photography',
      category: 'Photography',
      rating: 4.9,
      reviews: 127,
      startingPrice: 2500,
      location: 'Springfield',
      featured: true
    },
    {
      id: '2',
      name: 'Elegant Flowers & Decor',
      category: 'Florist',
      rating: 4.8,
      reviews: 89,
      startingPrice: 800,
      location: 'Oakland',
      featured: false
    },
    {
      id: '3',
      name: 'Sweet Dreams Bakery',
      category: 'Bakery',
      rating: 4.9,
      reviews: 156,
      startingPrice: 400,
      location: 'Springfield',
      featured: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    loadPublicEvents();
  }, []);

  const loadPublicEvents = async () => {
    try {
      setLoading(true);
      const data = await getPublicEvents();
      setPublicEvents(data);
    } catch (err) {
      console.error('Error loading public events:', err);
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = publicEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Discover Weddings</h1>
        <p className="text-gray-600">Explore beautiful weddings and connect with top vendors</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search weddings, venues, or vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="venues">Venues</option>
              <option value="photographers">Photographers</option>
              <option value="caterers">Caterers</option>
              <option value="florists">Florists</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading public weddings...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Featured Weddings */}
      {!loading && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Weddings</h2>
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const coupleNames = Array.isArray(event.couple_names) 
                  ? (event.couple_names as string[]).join(' & ')
                  : 'Wedding';

                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Image Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center">
                      <Heart className="w-12 h-12 text-rose-400" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800">{coupleNames}</h3>
                        <span className="text-sm text-gray-500">Public</span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{event.venue}, {event.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">{event.style}</span>
                          <div className="text-sm text-gray-500">{event.guest_count} guests</div>
                        </div>
                        <button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No public weddings yet</h3>
              <p className="text-gray-500">Check back later for inspiring wedding stories!</p>
            </div>
          )}
        </div>
      )}

      {/* Vendor Marketplace */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Vendor Marketplace</h2>
          <button className="text-rose-600 hover:text-rose-700 font-medium">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketplace.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{vendor.name}</h3>
                  <p className="text-gray-600 text-sm">{vendor.category}</p>
                </div>
                {vendor.featured && (
                  <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium text-gray-800">{vendor.rating}</span>
                  <span className="text-gray-500 text-sm">({vendor.reviews})</span>
                </div>
                <div className="text-gray-500 text-sm">{vendor.location}</div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">Starting at</span>
                  <div className="text-lg font-bold text-gray-800">${vendor.startingPrice}</div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    View Profile
                  </button>
                  <button className="px-3 py-2 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors text-sm font-medium">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Dream Wedding?</h2>
        <p className="text-rose-100 mb-6 text-lg">
          Join thousands of couples who have found their perfect vendors and planned amazing weddings with GA&A Events.
        </p>
        <button className="bg-white text-rose-600 px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg shadow-lg">
          Start Planning Today
        </button>
      </div>
    </div>
  );
};