import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Gift, Camera, MessageCircle } from 'lucide-react';

interface GuestDashboardProps {
  user: { id: string; name: string; email: string; role: string };
}

export const GuestDashboard: React.FC<GuestDashboardProps> = ({ user }) => {
  const [invitations] = useState([
    {
      id: '1',
      coupleName: 'Sarah & Michael',
      eventDate: '2024-06-15',
      venue: 'Garden Pavilion',
      address: '123 Rose Garden Lane, Springfield',
      rsvpStatus: 'pending',
      eventType: 'Wedding Ceremony & Reception',
      time: '4:00 PM'
    },
    {
      id: '2',
      coupleName: 'Jessica & David',
      eventDate: '2024-07-20',
      venue: 'Riverside Manor',
      address: '456 River View Drive, Oakland',
      rsvpStatus: 'attending',
      eventType: 'Wedding Reception',
      time: '6:00 PM'
    }
  ]);

  const [rsvpForm, setRsvpForm] = useState({
    attendance: '',
    guestCount: 1,
    dietaryRestrictions: '',
    message: ''
  });

  const handleRsvp = (invitationId: string, status: 'attending' | 'declined') => {
    // Handle RSVP logic here
    console.log('RSVP:', invitationId, status);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user.name}!</h1>
        <p className="text-gray-600">Your wedding invitations and event details</p>
      </div>

      {/* Invitations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {invitations.map((invitation) => (
          <div key={invitation.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Event Header */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{invitation.coupleName}</h2>
                  <p className="text-rose-100">{invitation.eventType}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  invitation.rsvpStatus === 'attending'
                    ? 'bg-green-500/20 text-green-100'
                    : invitation.rsvpStatus === 'declined'
                    ? 'bg-red-500/20 text-red-100'
                    : 'bg-yellow-500/20 text-yellow-100'
                }`}>
                  {invitation.rsvpStatus === 'pending' ? 'Please RSVP' : invitation.rsvpStatus}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{new Date(invitation.eventDate).toLocaleDateString()}</div>
                    <div className="text-sm text-rose-100">{invitation.time}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{invitation.venue}</div>
                    <div className="text-sm text-rose-100">{invitation.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-6">
              {invitation.rsvpStatus === 'pending' && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Please RSVP</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Will you attend?
                      </label>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleRsvp(invitation.id, 'attending')}
                          className="flex-1 bg-green-50 text-green-700 p-3 rounded-lg hover:bg-green-100 transition-colors font-medium"
                        >
                          Yes, I'll be there!
                        </button>
                        <button
                          onClick={() => handleRsvp(invitation.id, 'declined')}
                          className="flex-1 bg-red-50 text-red-700 p-3 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        >
                          Sorry, can't make it
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of guests
                      </label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                        <option value="1">Just me</option>
                        <option value="2">2 people (with +1)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dietary restrictions (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Any dietary restrictions or allergies?"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message to the couple (optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Share your excitement or well wishes..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {invitation.rsvpStatus === 'attending' && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-700">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">You're all set!</span>
                    </div>
                    <p className="text-green-600 text-sm mt-1">
                      Looking forward to celebrating with you!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      <Gift className="w-4 h-4" />
                      <span>Gift Registry</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                      <Camera className="w-4 h-4" />
                      <span>Photo Sharing</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100">
                <button className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Message the Couple</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 font-medium">
            View All Invitations
          </button>
          <button className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
            Update Profile
          </button>
          <button className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium">
            Share Photos
          </button>
        </div>
      </div>
    </div>
  );
};