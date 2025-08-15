import React from 'react';
import { Mail, Phone, User, UserCheck, UserX, Clock, Edit, Trash2, Users } from 'lucide-react';
import { Database } from '../../types/database';

type Guest = Database['public']['Tables']['guests']['Row'];

interface GuestCardProps {
  guest: Guest;
  onEdit: () => void;
  onDelete: () => void;
}

export const GuestCard: React.FC<GuestCardProps> = ({ guest, onEdit, onDelete }) => {
  const getStatusIcon = () => {
    switch (guest.rsvp_status) {
      case 'attending':
        return <UserCheck className="w-5 h-5 text-green-500" />;
      case 'declined':
        return <UserX className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (guest.rsvp_status) {
      case 'attending':
        return 'border-green-200 bg-green-50';
      case 'declined':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  const getStatusText = () => {
    switch (guest.rsvp_status) {
      case 'attending':
        return 'Attending';
      case 'declined':
        return 'Declined';
      default:
        return 'Pending RSVP';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 ${getStatusColor()} p-6 hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{guest.name}</h3>
          <div className="flex items-center space-x-2 mb-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${
              guest.rsvp_status === 'attending' ? 'text-green-600' :
              guest.rsvp_status === 'declined' ? 'text-red-600' :
              'text-yellow-600'
            }`}>
              {getStatusText()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit guest"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove guest"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{guest.email}</span>
        </div>
        {guest.phone && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{guest.phone}</span>
          </div>
        )}
      </div>

      {/* Plus One */}
      {guest.plus_one && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Plus One</span>
          </div>
          {guest.plus_one_name ? (
            <span className="text-sm text-gray-600">{guest.plus_one_name}</span>
          ) : (
            <span className="text-sm text-gray-500 italic">Name not provided</span>
          )}
        </div>
      )}

      {/* Dietary Restrictions */}
      {guest.dietary_restrictions && (
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-1">Dietary Restrictions</div>
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {guest.dietary_restrictions}
          </div>
        </div>
      )}

      {/* Table Assignment */}
      {guest.table_number && (
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-1">Table Assignment</div>
          <div className="text-sm text-gray-600">Table {guest.table_number}</div>
        </div>
      )}

      {/* Notes */}
      {guest.notes && (
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-1">Notes</div>
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {guest.notes}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Invited: {new Date(guest.invited_at).toLocaleDateString()}</span>
          {guest.responded_at && (
            <span>Responded: {new Date(guest.responded_at).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};