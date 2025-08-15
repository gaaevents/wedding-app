import React, { useState } from 'react';
import { Search, Filter, Star, MapPin, Heart, MessageCircle, Calendar } from 'lucide-react';
import { Vendor, VendorCategory } from '../../types';

interface VendorMarketplaceProps {
  onVendorSelect?: (vendor: Vendor) => void;
}

export const VendorMarketplace: React.FC<VendorMarketplaceProps> = ({ onVendorSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory | 'all'>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'reviews'>('rating');

  const [vendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'Dream Photography',
      category: 'photographer',
      email: 'contact@dreamphotography.com',
      phone: '(555) 123-4567',
      website: 'www.dreamphotography.com',
      rating: 4.9,
      reviewCount: 127,
      startingPrice: 2500,
      location: 'Springfield',
      description: 'Capturing your most precious moments with artistic flair and professional expertise.',
      services: ['Wedding Photography', 'Engagement Sessions', 'Bridal Portraits', 'Reception Coverage'],
      photos: [
        'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      availability: ['2024-06-15', '2024-07-20', '2024-08-10'],
      isApproved: true,
      isFeatured: true,
      createdAt: '2024-01-15',
      socialMedia: {
        instagram: '@dreamphotography',
        facebook: 'DreamPhotographyStudio'
      }
    },
    {
      id: '2',
      name: 'Elegant Flowers & Decor',
      category: 'florist',
      email: 'hello@elegantflowers.com',
      phone: '(555) 234-5678',
      rating: 4.8,
      reviewCount: 89,
      startingPrice: 800,
      location: 'Oakland',
      description: 'Creating stunning floral arrangements and decor that bring your vision to life.',
      services: ['Bridal Bouquets', 'Centerpieces', 'Ceremony Decor', 'Reception Arrangements'],
      photos: [
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      availability: ['2024-06-15', '2024-07-20'],
      isApproved: true,
      isFeatured: false,
      createdAt: '2024-02-01'
    },
    {
      id: '3',
      name: 'Sweet Dreams Bakery',
      category: 'baker',
      email: 'orders@sweetdreamsbakery.com',
      phone: '(555) 345-6789',
      rating: 4.9,
      reviewCount: 156,
      startingPrice: 400,
      location: 'Springfield',
      description: 'Artisanal wedding cakes and desserts made with love and the finest ingredients.',
      services: ['Wedding Cakes', 'Cupcakes', 'Dessert Tables', 'Custom Designs'],
      photos: [
        'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      availability: ['2024-06-15', '2024-07-20', '2024-08-10'],
      isApproved: true,
      isFeatured: true,
      createdAt: '2024-01-20'
    },
    {
      id: '4',
      name: 'Garden Pavilion',
      category: 'venue',
      email: 'events@gardenpavilion.com',
      phone: '(555) 456-7890',
      rating: 4.7,
      reviewCount: 203,
      startingPrice: 5000,
      location: 'Springfield Gardens',
      description: 'A romantic outdoor venue surrounded by lush gardens and elegant architecture.',
      services: ['Ceremony Space', 'Reception Hall', 'Bridal Suite', 'Catering Kitchen'],
      photos: [
        'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      availability: ['2024-06-15', '2024-07-20'],
      isApproved: true,
      isFeatured: true,
      createdAt: '2024-01-10'
    }
  ]);

  const categories: { value: VendorCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'photographer', label: 'Photography' },
    { value: 'venue', label: 'Venues' },
    { value: 'caterer', label: 'Catering' },
    { value: 'florist', label: 'Florists' },
    { value: 'baker', label: 'Bakery' },
    { value: 'musician', label: 'Music' },
    { value: 'dj', label: 'DJ Services' }
  ];

  const filteredVendors = vendors
    .filter(vendor => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
      const matchesPrice = priceRange === 'all' || 
                          (priceRange === 'low' && vendor.startingPrice < 1000) ||
                          (priceRange === 'medium' && vendor.startingPrice >= 1000 && vendor.startingPrice < 3000) ||
                          (priceRange === 'high' && vendor.startingPrice >= 3000);
      
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.startingPrice - b.startingPrice;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Vendor Marketplace</h1>
        <p className="text-gray-600">Discover and connect with top wedding professionals</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as VendorCategory | 'all')}
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
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={vendor.photos[0]}
                alt={vendor.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {vendor.isFeatured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Featured
                  </span>
                </div>
              )}
              <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="w-4 h-4 text-gray-600 hover:text-rose-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{vendor.name}</h3>
                  <p className="text-gray-600 text-sm capitalize">{vendor.category}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-gray-800">{vendor.rating}</span>
                  </div>
                  <div className="text-xs text-gray-500">({vendor.reviewCount} reviews)</div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vendor.description}</p>

              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{vendor.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">Starting at</span>
                  <div className="text-lg font-bold text-gray-800">
                    ${vendor.startingPrice.toLocaleString()}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact</span>
                  </button>
                  <button 
                    onClick={() => onVendorSelect?.(vendor)}
                    className="px-3 py-2 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors text-sm font-medium flex items-center space-x-1"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No vendors found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};