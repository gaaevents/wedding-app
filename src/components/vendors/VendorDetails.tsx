import React, { useState, useEffect } from 'react';
import { X, Star, MapPin, Phone, Mail, Globe, Calendar, MessageCircle, Heart, Award, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { getVendorReviews } from '../../lib/vendors';
import { Database } from '../../types/database';

type Vendor = Database['public']['Tables']['vendors']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'] & {
  users: { name: string } | null;
};

interface VendorDetailsProps {
  vendor: Vendor;
  onClose: () => void;
  onBook: () => void;
}

export const VendorDetails: React.FC<VendorDetailsProps> = ({ vendor, onClose, onBook }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const photos = Array.isArray(vendor.photos) ? vendor.photos as string[] : [];
  const services = Array.isArray(vendor.services) ? vendor.services as string[] : [];
  const socialMedia = vendor.social_media as { instagram?: string; facebook?: string; twitter?: string } | null;

  useEffect(() => {
    loadReviews();
  }, [vendor.id]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getVendorReviews(vendor.id);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          {/* Photo Gallery */}
          {photos.length > 0 ? (
            <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
              <img
                src={photos[currentPhotoIndex]}
                alt={vendor.name}
                className="w-full h-full object-cover"
              />
              
              {/* Photo Navigation */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  {/* Photo Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {photos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {vendor.is_featured && (
                  <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Award className="w-3 h-3" />
                    <span>Featured</span>
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <Camera className="w-16 h-16 mx-auto mb-4" />
                <span>No photos available</span>
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Vendor Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{vendor.name}</h1>
              <p className="text-lg text-gray-600 capitalize mb-4">{vendor.category.replace('_', ' ')}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(vendor.rating)}
                  <span className="font-medium text-gray-800 ml-2">{vendor.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({vendor.review_count} reviews)</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{vendor.location}</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">{vendor.description}</p>
            </div>

            <div className="text-right ml-6">
              <div className="text-sm text-gray-600 mb-1">Starting at</div>
              <div className="text-3xl font-bold text-gray-800 mb-4">
                ${vendor.starting_price.toLocaleString()}
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Message</span>
                </button>
                <button
                  onClick={onBook}
                  className="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Services */}
          {services.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Services Offered</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-lg text-center text-gray-700 font-medium"
                  >
                    {service}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{vendor.phone}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{vendor.email}</span>
              </div>
              {vendor.website && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Reviews ({reviews.length})
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-800">
                            {review.users?.name || 'Anonymous'}
                          </span>
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
                
                {reviews.length > 5 && (
                  <div className="text-center">
                    <button className="text-rose-600 hover:text-rose-700 font-medium">
                      View all {reviews.length} reviews
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No reviews yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};