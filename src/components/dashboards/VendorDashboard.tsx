import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Users, Clock, TrendingUp, Star, MessageCircle, FileText, Bell, Camera, MapPin, Plus, Edit } from 'lucide-react';
import { getVendorBookings, getCurrentVendorProfile } from '../../lib/vendors';
import { VendorProfile } from '../vendors/VendorProfile';
import { Database } from '../../types/database';

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  users: { name: string; email: string } | null;
  events: { title: string; date: string; venue: string; location: string } | null;
};

type Vendor = Database['public']['Tables']['vendors']['Row'];

interface VendorDashboardProps {
  user: { id: string; name: string; email: string; role: string };
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ user }) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile'>('dashboard');
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    try {
      setLoading(true);
      const [vendorProfile, vendorBookings] = await Promise.all([
        getCurrentVendorProfile(),
        getVendorBookings()
      ]);
      
      setVendor(vendorProfile);
      setBookings(vendorBookings);
      
      // If no vendor profile exists, show profile creation
      if (!vendorProfile) {
        setCurrentView('profile');
      }
    } catch (err) {
      console.error('Error loading vendor data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vendor data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = (savedVendor: Vendor) => {
    setVendor(savedVendor);
    setCurrentView('dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your vendor dashboard...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'profile') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          {vendor && (
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-rose-600 hover:text-rose-700 font-medium"
            >
              ← Back to Dashboard
            </button>
          )}
        </div>
        <VendorProfile onSave={handleProfileSave} />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-rose-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Your Vendor Profile</h2>
          <p className="text-gray-600 mb-6">
            Set up your vendor profile to start receiving bookings from couples planning their dream weddings.
          </p>
          <button
            onClick={() => setCurrentView('profile')}
            className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200"
          >
            Create Vendor Profile
          </button>
        </div>
      </div>
    );
  }

  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.amount, 0);

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;

  const upcomingEvents = bookings
    .filter(b => b.status === 'confirmed' && new Date(b.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const recentMessages = [
    { id: '1', from: 'Sarah & Michael', message: 'Can we schedule a call to discuss the timeline?', time: '2 hours ago', unread: true },
    { id: '2', from: 'Jessica & David', message: 'Thank you for the beautiful engagement photos!', time: '1 day ago', unread: false },
    { id: '3', from: 'Emily & James', message: 'What packages do you offer for destination weddings?', time: '2 days ago', unread: true }
  ];

  const monthlyStats = {
    bookings: bookings.filter(b => {
      const bookingDate = new Date(b.created_at);
      const now = new Date();
      return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
    }).length,
    revenue: bookings
      .filter(b => {
        const bookingDate = new Date(b.created_at);
        const now = new Date();
        return bookingDate.getMonth() === now.getMonth() && 
               bookingDate.getFullYear() === now.getFullYear() && 
               b.status === 'completed';
      })
      .reduce((sum, b) => sum + b.amount, 0),
    newClients: bookings.filter(b => {
      const bookingDate = new Date(b.created_at);
      const now = new Date();
      return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
    }).length,
    completedEvents: bookings.filter(b => b.status === 'completed').length
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {vendor.name}!</h1>
            <p className="text-gray-600">Manage your wedding services and grow your business</p>
          </div>
          <button
            onClick={() => setCurrentView('profile')}
            className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Vendor Profile Summary */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{vendor.name}</h2>
            <p className="text-rose-100 mb-4 flex items-center space-x-2 capitalize">
              <span>{vendor.category.replace('_', ' ')}</span>
              <span>•</span>
              <MapPin className="w-4 h-4" />
              <span>{vendor.location}</span>
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold">{vendor.rating.toFixed(1)}</span>
                <span className="text-rose-100">({vendor.review_count} reviews)</span>
              </div>
              <div className="text-rose-100">
                Starting at ${vendor.starting_price.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              <Camera className="w-12 h-12" />
            </div>
            <div className="text-sm">
              {vendor.is_approved ? (
                <span className="bg-green-500/20 text-green-100 px-3 py-1 rounded-full">
                  Approved
                </span>
              ) : (
                <span className="bg-yellow-500/20 text-yellow-100 px-3 py-1 rounded-full">
                  Pending Approval
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600">+12% this month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{confirmedBookings}</p>
              <p className="text-sm text-blue-600">{pendingBookings} pending</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Client Rating</p>
              <p className="text-2xl font-bold text-gray-800">{vendor.rating.toFixed(1)}</p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(vendor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-1">({vendor.review_count})</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Messages</p>
              <p className="text-2xl font-bold text-gray-800">{recentMessages.length}</p>
              <p className="text-sm text-purple-600">
                {recentMessages.filter(m => m.unread).length} unread
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Bookings and Calendar */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Recent Bookings</h3>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-800">{booking.service}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            Client: {booking.users?.name || 'Unknown'}
                          </p>
                          <p className="text-gray-600 text-sm mb-2">
                            Event: {booking.events?.title || 'Unknown Event'}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{booking.time} ({booking.duration}h)</span>
                            </div>
                            <span className="font-medium text-gray-800">${booking.amount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors text-sm">
                            Message
                          </button>
                          <button className="px-3 py-1 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors text-sm">
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No bookings yet</p>
                  <p className="text-sm">Your bookings will appear here once couples start booking your services.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">Upcoming Events</h3>
            </div>
            <div className="p-6">
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm">{event.service}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-600">
                        ${event.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No upcoming events</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Messages</h3>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                  {recentMessages.filter(m => m.unread).length} new
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className={`p-3 rounded-lg border ${
                    message.unread ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-800 text-sm">{message.from}</div>
                      <div className="text-xs text-gray-500">{message.time}</div>
                    </div>
                    <p className="text-sm text-gray-600">{message.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">This Month</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">New Bookings</span>
                  <span className="font-semibold text-blue-600">{monthlyStats.bookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Revenue</span>
                  <span className="font-semibold text-green-600">${monthlyStats.revenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">New Clients</span>
                  <span className="font-semibold text-purple-600">{monthlyStats.newClients}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed Events</span>
                  <span className="font-semibold text-orange-600">{monthlyStats.completedEvents}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium">
                  Update Calendar
                </button>
                <button className="w-full bg-green-50 text-green-700 p-3 rounded-lg hover:bg-green-100 transition-colors font-medium">
                  View Contracts
                </button>
                <button className="w-full bg-purple-50 text-purple-700 p-3 rounded-lg hover:bg-purple-100 transition-colors font-medium">
                  Message Clients
                </button>
                <button className="w-full bg-yellow-50 text-yellow-700 p-3 rounded-lg hover:bg-yellow-100 transition-colors font-medium">
                  Upload Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};