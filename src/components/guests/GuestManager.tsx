import React, { useState, useEffect } from 'react';
import { Plus, Users, UserCheck, UserX, Clock, Search, Filter, Download, Upload, Mail } from 'lucide-react';
import { getEventGuests, createGuest, updateGuest, deleteGuest, getRSVPStats, sendRSVPReminders } from '../../lib/guests';
import { GuestForm } from './GuestForm';
import { GuestCard } from './GuestCard';
import { RSVPStats } from './RSVPStats';
import { Database } from '../../types/database';

type Guest = Database['public']['Tables']['guests']['Row'];

interface GuestManagerProps {
  eventId: string;
  eventTitle: string;
}

export const GuestManager: React.FC<GuestManagerProps> = ({ eventId, eventTitle }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'attending' | 'declined' | 'pending'>('all');
  const [stats, setStats] = useState({
    total: 0,
    attending: 0,
    declined: 0,
    pending: 0,
    plusOnes: 0,
    totalAttending: 0,
    responseRate: 0
  });

  useEffect(() => {
    loadGuests();
    loadStats();
  }, [eventId]);

  const loadGuests = async () => {
    try {
      setLoading(true);
      const data = await getEventGuests(eventId);
      setGuests(data);
    } catch (err) {
      console.error('Error loading guests:', err);
      setError(err instanceof Error ? err.message : 'Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getRSVPStats(eventId);
      setStats(data);
    } catch (err) {
      console.error('Error loading RSVP stats:', err);
    }
  };

  const handleCreateGuest = () => {
    setEditingGuest(null);
    setShowForm(true);
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setShowForm(true);
  };

  const handleSaveGuest = async (guestData: any) => {
    try {
      if (editingGuest) {
        const updatedGuest = await updateGuest(editingGuest.id, guestData);
        setGuests(guests.map(g => g.id === updatedGuest.id ? updatedGuest : g));
      } else {
        const newGuest = await createGuest({ ...guestData, event_id: eventId });
        setGuests([...guests, newGuest]);
      }
      setShowForm(false);
      setEditingGuest(null);
      loadStats();
    } catch (err) {
      console.error('Error saving guest:', err);
      setError(err instanceof Error ? err.message : 'Failed to save guest');
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm('Are you sure you want to remove this guest?')) return;

    try {
      await deleteGuest(guestId);
      setGuests(guests.filter(g => g.id !== guestId));
      loadStats();
    } catch (err) {
      console.error('Error deleting guest:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove guest');
    }
  };

  const handleSendReminders = async () => {
    try {
      await sendRSVPReminders(eventId);
      alert('RSVP reminders sent successfully!');
    } catch (err) {
      console.error('Error sending reminders:', err);
      setError(err instanceof Error ? err.message : 'Failed to send reminders');
    }
  };

  const getFilteredGuests = () => {
    return guests.filter(guest => {
      const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guest.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || guest.rsvp_status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  };

  const filteredGuests = getFilteredGuests();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading guest list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Guest Management</h2>
          <p className="text-gray-600">{eventTitle}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSendReminders}
            className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Send Reminders</span>
          </button>
          <button
            onClick={handleCreateGuest}
            className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* RSVP Stats */}
      <RSVPStats stats={stats} />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="attending">Attending</option>
            <option value="declined">Declined</option>
            <option value="pending">Pending</option>
          </select>

          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </button>

          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Guests List */}
      {filteredGuests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuests.map((guest) => (
            <GuestCard
              key={guest.id}
              guest={guest}
              onEdit={() => handleEditGuest(guest)}
              onDelete={() => handleDeleteGuest(guest.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {guests.length === 0 ? 'No guests yet' : 'No guests match your filters'}
          </h3>
          <p className="text-gray-500 mb-6">
            {guests.length === 0 
              ? 'Start building your guest list by adding your first guest'
              : 'Try adjusting your search criteria or filters'
            }
          </p>
          {guests.length === 0 && (
            <button
              onClick={handleCreateGuest}
              className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200"
            >
              Add First Guest
            </button>
          )}
        </div>
      )}

      {/* Guest Form Modal */}
      {showForm && (
        <GuestForm
          guest={editingGuest}
          eventId={eventId}
          onClose={() => {
            setShowForm(false);
            setEditingGuest(null);
          }}
          onSave={handleSaveGuest}
        />
      )}
    </div>
  );
};