import React from 'react';
import { Calendar, MapPin, Users, DollarSign, Edit, Eye, Trash2, Heart } from 'lucide-react';
import { Database } from '../../types/database';

type Event = Database['public']['Tables']['events']['Row'];

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onView?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  showActions?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onEdit, 
  onView, 
  onDelete, 
  showActions = true 
}) => {
  const coupleNames = Array.isArray(event.couple_names) 
    ? (event.couple_names as string[]).join(' & ')
    : 'Wedding';

  const daysUntilWedding = Math.ceil(
    (new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-700';
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">{event.title}</h3>
              <p className="text-rose-100">{coupleNames}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)} bg-white/20 text-white`}>
                {event.status}
              </span>
              {event.is_public && (
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Eye className="w-3 h-3" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <div>
                <div className="font-medium">{new Date(event.date).toLocaleDateString()}</div>
                <div className="text-rose-100 text-xs">
                  {daysUntilWedding > 0 ? `${daysUntilWedding} days to go` : 
                   daysUntilWedding === 0 ? 'Today!' : 
                   `${Math.abs(daysUntilWedding)} days ago`}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <div>
                <div className="font-medium">{event.venue}</div>
                <div className="text-rose-100 text-xs">{event.location}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Planning Progress</span>
            <span className="text-sm text-gray-500">{event.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(event.progress || 0)}`}
              style={{ width: `${event.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Guests</div>
              <div className="font-semibold text-gray-800">{event.guest_count}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Budget</div>
              <div className="font-semibold text-gray-800">${event.budget.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="mb-6">
            <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
          </div>
        )}

        {/* Wedding Style */}
        <div className="mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
            {event.style} Style
          </span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex space-x-2">
              {onView && (
                <button
                  onClick={() => onView(event)}
                  className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View</span>
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(event)}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Edit</span>
                </button>
              )}
            </div>
            
            {onDelete && (
              <button
                onClick={() => onDelete(event.id)}
                className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};