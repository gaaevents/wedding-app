import React, { useState, useEffect } from 'react';
import { Plus, Users, Edit, Trash2, RotateCcw, Save, Eye } from 'lucide-react';
import { getEventSeatingPlans, createSeatingPlan, updateSeatingPlan, deleteSeatingPlan } from '../../lib/seating';
import { getEventGuests } from '../../lib/guests';
import { SeatingPlanForm } from './SeatingPlanForm';
import { SeatingChart } from './SeatingChart';
import { TableManager } from './TableManager';
import { Database } from '../../types/database';

type SeatingPlan = Database['public']['Tables']['seating_plans']['Row'];
type Guest = Database['public']['Tables']['guests']['Row'];

interface SeatingPlanManagerProps {
  eventId: string;
  eventTitle: string;
}

export const SeatingPlanManager: React.FC<SeatingPlanManagerProps> = ({ eventId, eventTitle }) => {
  const [seatingPlans, setSeatingPlans] = useState<SeatingPlan[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SeatingPlan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SeatingPlan | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'chart' | 'tables'>('list');

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansData, guestsData] = await Promise.all([
        getEventSeatingPlans(eventId),
        getEventGuests(eventId)
      ]);
      
      setSeatingPlans(plansData);
      setGuests(guestsData.filter(g => g.rsvp_status === 'attending'));
    } catch (err) {
      console.error('Error loading seating data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load seating data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setShowForm(true);
  };

  const handleEditPlan = (plan: SeatingPlan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleSavePlan = async (planData: any) => {
    try {
      if (editingPlan) {
        const updatedPlan = await updateSeatingPlan(editingPlan.id, planData);
        setSeatingPlans(seatingPlans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
      } else {
        const newPlan = await createSeatingPlan({ ...planData, event_id: eventId });
        setSeatingPlans([...seatingPlans, newPlan]);
      }
      setShowForm(false);
      setEditingPlan(null);
    } catch (err) {
      console.error('Error saving seating plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to save seating plan');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this seating plan?')) return;

    try {
      await deleteSeatingPlan(planId);
      setSeatingPlans(seatingPlans.filter(p => p.id !== planId));
    } catch (err) {
      console.error('Error deleting seating plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete seating plan');
    }
  };

  const handleViewPlan = (plan: SeatingPlan) => {
    setSelectedPlan(plan);
    setCurrentView('chart');
  };

  const handleManageTables = (plan: SeatingPlan) => {
    setSelectedPlan(plan);
    setCurrentView('tables');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seating plans...</p>
        </div>
      </div>
    );
  }

  // Show seating chart view
  if (currentView === 'chart' && selectedPlan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('list')}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Seating Plans
          </button>
          <button
            onClick={() => handleManageTables(selectedPlan)}
            className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Manage Tables
          </button>
        </div>
        <SeatingChart seatingPlan={selectedPlan} guests={guests} />
      </div>
    );
  }

  // Show table management view
  if (currentView === 'tables' && selectedPlan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('list')}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Seating Plans
          </button>
          <button
            onClick={() => setCurrentView('chart')}
            className="bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
          >
            View Chart
          </button>
        </div>
        <TableManager 
          seatingPlan={selectedPlan} 
          guests={guests}
          onUpdate={(updatedPlan) => {
            setSelectedPlan(updatedPlan);
            setSeatingPlans(seatingPlans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Seating Plans</h2>
          <p className="text-gray-600">{eventTitle}</p>
        </div>
        <button
          onClick={handleCreatePlan}
          className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Create Seating Plan</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Plans</p>
              <p className="text-2xl font-bold text-gray-800">{seatingPlans.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Attending Guests</p>
              <p className="text-2xl font-bold text-gray-800">{guests.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Seated Guests</p>
              <p className="text-2xl font-bold text-gray-800">
                {guests.filter(g => g.table_number).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Seating Plans List */}
      {seatingPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seatingPlans.map((plan) => {
            const tables = Array.isArray(plan.tables) ? plan.tables as any[] : [];
            const totalSeats = tables.reduce((sum, table) => sum + (table.seats || 0), 0);
            const occupiedSeats = tables.reduce((sum, table) => sum + (table.guests?.length || 0), 0);

            return (
              <div
                key={plan.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{plan.layout} layout</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewPlan(plan)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View seating chart"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditPlan(plan)}
                      className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Edit plan"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tables:</span>
                    <span className="font-medium text-gray-800">{tables.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Seats:</span>
                    <span className="font-medium text-gray-800">{totalSeats}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Occupied:</span>
                    <span className="font-medium text-gray-800">{occupiedSeats}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${totalSeats > 0 ? (occupiedSeats / totalSeats) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewPlan(plan)}
                      className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      View Chart
                    </button>
                    <button
                      onClick={() => handleManageTables(plan)}
                      className="flex-1 bg-green-50 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                    >
                      Manage Tables
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No seating plans yet</h3>
          <p className="text-gray-500 mb-6">
            Create your first seating plan to organize your wedding reception
          </p>
          <button
            onClick={handleCreatePlan}
            className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200"
          >
            Create First Seating Plan
          </button>
        </div>
      )}

      {/* Seating Plan Form Modal */}
      {showForm && (
        <SeatingPlanForm
          seatingPlan={editingPlan}
          eventId={eventId}
          onClose={() => {
            setShowForm(false);
            setEditingPlan(null);
          }}
          onSave={handleSavePlan}
        />
      )}
    </div>
  );
};