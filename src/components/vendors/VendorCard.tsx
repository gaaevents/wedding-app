import React from 'react';
import { Star, MapPin, Heart, MessageCircle, Calendar, Eye, Award, Camera } from 'lucide-react';
import { Database } from '../../types/database';

type Vendor = Database['public']['Tables']['vendors']['Row'];

interface VendorCardProps {
  vendor: Vendor;
  onView?: () => void;
  onBook?: () => void;
  onMessage?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  featured?: boolean;
}

export const VendorCard: React.FC<VendorCardProps> = ({ 
  vendor, 
  onView, 
  onBook, 
  onMessage,
  onToggleFavorite,
  isFavorite = false,
  featured = false 
}) => {
  const photos = Array.isArray(vendor.photos) ? vendor.photos as string[] : [];
  const services = Array.isArray(vendor.services) ? vendor.services as string[] : [];
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {photos.length > 0 ? (
          <img
            src={photos[0]}
            alt={vendor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <Camera className="w-12 h-12 mx-auto mb-2" />
              <span className="text-sm">No photos</span>
            </div>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {featured && (
            <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Award className="w-3 h-3" />
              <span>Featured</span>
            </span>
          )}
          {vendor.is_featured && !featured && (
            <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              Premium
            </span>
          )}
        </div>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors shadow-lg ${
              isFavorite 
                ? 'bg-rose-500 text-white hover:bg-rose-600' 
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-rose-500'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-rose-600 transition-colors">
              {vendor.name}
            </h3>
            <p className="text-gray-600 text-sm capitalize mb-2">{vendor.category.replace('_', ' ')}</p>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{vendor.location}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium text-gray-800">{vendor.rating.toFixed(1)}</span>
            </div>
            <div className="text-xs text-gray-500">({vendor.review_count} reviews)</div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vendor.description}</p>

        {/* Services */}
        {services.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {services.slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {service}
                </span>
              ))}
              {services.length > 3 && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  +{services.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-600">Starting at</span>
            <div className="text-lg font-bold text-gray-800">
              ${vendor.starting_price.toLocaleString()}
            </div>
          </div>
          
          <div className="flex space-x-2">
            {onView && (
              <button
                onClick={onView}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            )}
            
            {onMessage && (
              <button
                onClick={onMessage}
                className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center space-x-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message</span>
              </button>
            )}
            
            {onBook && (
              <button 
                onClick={onBook}
                className="px-3 py-2 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors text-sm font-medium flex items-center space-x-1"
              >
                <Calendar className="w-4 h-4" />
                <span>Book</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};