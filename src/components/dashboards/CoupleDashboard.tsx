import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, DollarSign, Users, Clock, Plus, TrendingUp, Gift, MapPin, Bell, MessageCircle, Camera, Heart, Building, Star } from 'lucide-react';
import { Event, Task, Guest, BudgetItem, GiftRegistryItem } from '../../types';
import { BudgetChart } from '../charts/BudgetChart';
import { TaskTimeline } from '../timeline/TaskTimeline';
import { GuestRSVPChart } from '../charts/GuestRSVPChart';
import { EventsList } from '../events/EventsList';
import { VendorMarketplace } from '../vendors/VendorMarketplace';
import { FavoritesManager } from '../favorites/FavoritesManager';
import { SeatingPlanManager } from '../seating/SeatingPlanManager';
import { BudgetManager } from '../budget/BudgetManager';
import { TaskManager } from '../tasks/TaskManager';
import { GuestManager } from '../guests/GuestManager';
import { GiftRegistryManager } from '../gift-registry/GiftRegistryManager';
import { getUserEvents } from '../../lib/events';
import { getUserBookings } from '../../lib/vendors';
import { Database } from '../../types/database';

type DatabaseEvent = Database['public']['Tables']['events']['Row'];
type Booking = Database['public']['Tables']['bookings']['Row'] & {
  vendors: { name: string; category: string; location: string; photos: any } | null;
  events: { title: string; date: string; venue: string } | null;
};

interface CoupleDashboardProps {
  user: { id: string; name: string; email: string; role: string };
}

export const CoupleDashboard: React.FC<CoupleDashboardProps> = ({ user }) => {
  const [currentView, setCurrentView] = useState<'overview' | 'events' | 'vendors' | 'favorites' | 'seating' | 'budget' | 'tasks' | 'guests' | 'gifts'>('overview');
  const [events, setEvents] = useState<DatabaseEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<DatabaseEvent | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demo purposes - in a real app, this would come from the database
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      eventId: currentEvent?.id || '1',
      title: 'Book photographer',
      description: 'Schedule engagement and wedding photography sessions',
      dueDate: '2024-03-15',
      assignee: 'Sarah',
      completed: true,
      priority: 'high',
      category: 'Photography',
      createdAt: '2024-02-01',
      completedAt: '2024-03-10'
    },
    {
      id: '2',
      eventId: currentEvent?.id || '1',
      title: 'Send invitations',
      description: 'Mail wedding invitations to all guests',
      dueDate: '2024-04-01',
      assignee: 'Michael',
      completed: false,
      priority: 'high',
      category: 'Invitations',
      createdAt: '2024-02-15'
    },
    {
      id: '3',
      eventId: currentEvent?.id || '1',
      title: 'Cake tasting appointment',
      description: 'Schedule appointment with Sweet Dreams Bakery',
      dueDate: '2024-03-30',
      assignee: 'Sarah',
      completed: false,
      priority: 'medium',
      category: 'Catering',
      createdAt: '2024-02-20'
    }
  ]);

  const [budgetItems] = useState<BudgetItem[]>([
    { id: '1', eventId: currentEvent?.id || '1', category: 'Venue', budgeted: 12000, spent: 12000, remaining: 0, color: 'bg-rose-500', vendors: ['Garden Pavilion'], notes: 'Deposit paid' },
    { id: '2', eventId: currentEvent?.id || '1', category: 'Catering', budgeted: 15000, spent: 13500, remaining: 1500, color: 'bg-blue-500', vendors: ['Elite Catering'], notes: 'Final payment due 30 days before' },
    { id: '3', eventId: currentEvent?.id || '1', category: 'Photography', budgeted: 5000, spent: 4800, remaining: 200, color: 'bg-green-500', vendors: ['Dream Photography'], notes: 'Engagement session completed' },
    { id: '4', eventId: currentEvent?.id || '1', category: 'Flowers', budgeted: 3000, spent: 2200, remaining: 800, color: 'bg-purple-500', vendors: ['Elegant Flowers'], notes: 'Centerpieces ordered' },
    { id: '5', eventId: currentEvent?.id || '1', category: 'Music', budgeted: 2500, spent: 0, remaining: 2500, color: 'bg-yellow-500', vendors: [], notes: 'Still selecting DJ' },
    { id: '6', eventId: currentEvent?.id || '1', category: 'Attire', budgeted: 3500, spent: 2800, remaining: 700, color: 'bg-pink-500', vendors: ['Bridal Boutique'], notes: 'Alterations pending' }
  ]);

  const [guests] = useState<Guest[]>([
    { id: '1', eventId: currentEvent?.id || '1', name: 'John Smith', email: 'john@email.com', rsvpStatus: 'attending', plusOne: true, plusOneName: 'Jane Smith', invitedAt: '2024-02-01', respondedAt: '2024-02-15' },
    { id: '2', eventId: currentEvent?.id || '1', name: 'Emily Johnson', email: 'emily@email.com', rsvpStatus: 'attending', plusOne: false, invitedAt: '2024-02-01', respondedAt: '2024-02-10' },
    { id: '3', eventId: currentEvent?.id || '1', name: 'Robert Brown', email: 'robert@email.com', rsvpStatus: 'declined', plusOne: false, invitedAt: '2024-02-01', respondedAt: '2024-02-20' },
    { id: '4', eventId: currentEvent?.id || '1', name: 'Lisa Davis', email: 'lisa@email.com', rsvpStatus: 'pending', plusOne: true, invitedAt: '2024-02-01' }
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsData, bookingsData] = await Promise.all([
        getUserEvents(),
        getUserBookings()
      ]);
      
      setEvents(eventsData);
      setBookings(bookingsData);
      
      if (eventsData.length > 0) {
        setCurrentEvent(eventsData[0]); // Set the first event as current
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelect = (event: DatabaseEvent) => {
    setCurrentEvent(event);
    setCurrentView('overview');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If no events exist, show events list to create first event
  if (events.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <EventsList onEventSelect={handleEventSelect} />
      </div>
    );
  }

  // Show specific views
  if (currentView === 'events') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('overview')}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
        <EventsList onEventSelect={handleEventSelect} />
      </div>
    );
  }

  if (currentView === 'vendors') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <button
            onClick={() => setCurrentView('overview')}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
        <VendorMarketplace />
      </div>
    );
  }

  if (currentView === 'favorites') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('overview')}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
        <FavoritesManager />
      </div>
    );
  }

  if (currentView === 'seating' && currentEvent) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('overview')}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
        <SeatingPlanManager eventId={currentEvent.id} eventTitle={currentEvent.title} />
      </div>
    );
  }

  if (currentView === 'budget' && currentEvent) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('overview')}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
        <BudgetManager 
          eventId={currentEvent.id} 
          eventTitle={currentEvent.title}
          totalBudget={currentEvent.budget}
        />
      </div>
    );
  }

  if (currentView === 'tasks' && currentEvent) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('overview')}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
        <TaskManager eventId={currentEvent.id} eventTitle={currentEvent.title} />
      </div>
    );
  }

  if (currentView === 'guests' && currentEvent) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('overview')}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
        <GuestManager eventId={currentEvent.id} eventTitle={currentEvent.title} />
      </div>
    );
  }

  if (currentView === 'gifts' && currentEvent) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('overview')}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
        <GiftRegistryManager eventId={currentEvent.id} eventTitle={currentEvent.title} />
      </div>
    );
  }

  // Dashboard overview with current event
  if (!currentEvent) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Event Selected</h2>
          <p className="text-gray-600 mb-6">Select an event to view your dashboard</p>
          <button
            onClick={() => setCurrentView('events')}
            className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200"
          >
            View All Events
          </button>
        </div>
      </div>
    );
  }

  const daysUntilWedding = Math.ceil((new Date(currentEvent.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const attendingGuests = guests.filter(g => g.rsvpStatus === 'attending').length;
  const pendingRSVPs = guests.filter(g => g.rsvpStatus === 'pending').length;

  const upcomingMilestones = [
    { title: 'Send Invitations', date: '2024-04-01', status: 'upcoming' },
    { title: 'Final Headcount', date: '2024-05-15', status: 'upcoming' },
    { title: 'Final Payments Due', date: '2024-06-01', status: 'upcoming' },
    { title: 'Rehearsal Dinner', date: '2024-06-14', status: 'upcoming' }
  ];

  const recentActivity = [
    { id: '1', action: 'Photography contract signed', time: '2 hours ago', type: 'success' },
    { id: '2', action: 'New RSVP received from Emily Johnson', time: '5 hours ago', type: 'info' },
    { id: '3', action: 'Catering payment processed', time: '1 day ago', type: 'success' },
    { id: '4', action: 'Venue walkthrough scheduled', time: '2 days ago', type: 'info' }
  ];

  const coupleNames = Array.isArray(currentEvent.couple_names) 
    ? (currentEvent.couple_names as string[]).join(' & ')
    : 'Your Wedding';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user.name}!</h1>
            <p className="text-gray-600">Let's make your dream wedding come true</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setCurrentView('vendors')}
              className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Building className="w-4 h-4" />
              <span>Find Vendors</span>
            </button>
            <button
              onClick={() => setCurrentView('favorites')}
              className="flex items-center space-x-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <Star className="w-4 h-4" />
              <span>Favorites</span>
            </button>
            <button
              onClick={() => setCurrentView('events')}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Manage Events
            </button>
          </div>
        </div>
      </div>

      {/* Wedding Countdown */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{currentEvent.title}</h2>
            <p className="text-rose-100 mb-4 flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{currentEvent.venue} • {new Date(currentEvent.date).toLocaleDateString()}</span>
            </p>
            <div className="text-4xl font-bold mb-2">
              {daysUntilWedding > 0 ? `${daysUntilWedding} days to go!` : 
               daysUntilWedding === 0 ? 'Today is the day!' : 
               'Congratulations!'}
            </div>
            <p className="text-rose-100">
              {daysUntilWedding > 0 ? 'Your special day is almost here' : 
               daysUntilWedding === 0 ? 'Your wedding day has arrived!' : 
               'Hope you had an amazing wedding!'}
            </p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              <Heart className="w-12 h-12 fill-current" />
            </div>
            <div className="text-sm mb-2">{currentEvent.progress || 0}% Complete</div>
            <div className="w-32 bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${currentEvent.progress || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Budget Progress</p>
              <p className="text-2xl font-bold text-gray-800">
                ${currentEvent.spent.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                of ${currentEvent.budget.toLocaleString()}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentEvent.spent / currentEvent.budget) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Guest RSVPs</p>
              <p className="text-2xl font-bold text-gray-800">{attendingGuests}/{currentEvent.guest_count}</p>
              <p className="text-sm text-blue-600">{pendingRSVPs} pending</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(attendingGuests / currentEvent.guest_count) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tasks Complete</p>
              <p className="text-2xl font-bold text-gray-800">{completedTasks}/{totalTasks}</p>
              <p className="text-sm text-purple-600">{Math.round((completedTasks / totalTasks) * 100)}% done</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Vendor Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
              <p className="text-sm text-orange-600">
                {bookings.filter(b => b.status === 'confirmed').length} confirmed
              </p>
              <div className="flex items-center mt-2">
                <Building className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-xs text-gray-500">
                  {bookings.filter(b => b.status === 'pending').length} pending
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Bookings Section */}
      {bookings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Your Vendor Bookings</h3>
              <button
                onClick={() => setCurrentView('vendors')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Find More Vendors
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.slice(0, 6).map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800">{booking.vendors?.name || 'Unknown Vendor'}</h4>
                      <p className="text-sm text-gray-600 capitalize">{booking.vendors?.category.replace('_', ' ')}</p>
                    </div>
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
                  <p className="text-sm text-gray-600 mb-2">{booking.service}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{new Date(booking.date).toLocaleDateString()}</span>
                    <span className="font-medium text-gray-800">${booking.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Tasks and Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Upcoming Tasks</h3>
                <button 
                  onClick={() => setCurrentView('tasks')}
                  className="flex items-center space-x-2 text-rose-600 hover:text-rose-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Manage Tasks</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <TaskTimeline tasks={tasks} />
            </div>
          </div>

          {/* Budget Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Budget Breakdown</h3>
                <button 
                  onClick={() => setCurrentView('budget')}
                  className="text-rose-600 hover:text-rose-700 font-medium text-sm"
                >
                  Manage Budget
                </button>
              </div>
            </div>
            <div className="p-6">
              <BudgetChart budgetItems={budgetItems} />
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        
        <div className="space-y-6">
          {/* Upcoming Milestones */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">Upcoming Milestones</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingMilestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-rose-500 rounded-full" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{milestone.title}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(milestone.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
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
                <button 
                  onClick={() => setCurrentView('tasks')}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white p-3 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Manage Tasks</span>
                </button>
                <button
                  onClick={() => setCurrentView('vendors')}
                  className="w-full bg-blue-50 text-blue-700 p-3 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Building className="w-4 h-4" />
                  <span>Find Vendors</span>
                </button>
                <button 
                  onClick={() => setCurrentView('guests')}
                  className="w-full bg-purple-50 text-purple-700 p-3 rounded-lg hover:bg-purple-100 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Manage Guests</span>
                </button>
                <button 
                  onClick={() => setCurrentView('budget')}
                  className="w-full bg-green-50 text-green-700 p-3 rounded-lg hover:bg-green-100 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Update Budget</span>
                </button>
                <button 
                  onClick={() => setCurrentView('seating')}
                  className="w-full bg-indigo-50 text-indigo-700 p-3 rounded-lg hover:bg-indigo-100 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Seating Plans</span>
                </button>
                <button 
                  onClick={() => setCurrentView('gifts')}
                  className="w-full bg-yellow-50 text-yellow-700 p-3 rounded-lg hover:bg-yellow-100 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>Gift Registry</span>
                </button>
                <button 
                  onClick={() => setCurrentView('favorites')}
                  className="w-full bg-pink-50 text-pink-700 p-3 rounded-lg hover:bg-pink-100 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Star className="w-4 h-4" />
                  <span>View Favorites</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};