import React, { useState } from 'react';
import { Users, User, Plus, X, Save } from 'lucide-react';
import { updateSeatingPlan } from '../../lib/seating';
import { updateGuest } from '../../lib/guests';
import { Database } from '../../types/database';

type SeatingPlan = Database['public']['Tables']['seating_plans']['Row'];
type Guest = Database['public']['Tables']['guests']['Row'];

interface TableManagerProps {
  seatingPlan: SeatingPlan;
  guests: Guest[];
  onUpdate: (updatedPlan: SeatingPlan) => void;
}

export const TableManager: React.FC<TableManagerProps> = ({ seatingPlan, guests, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const tables = Array.isArray(seatingPlan.tables) ? seatingPlan.tables as any[] : [];
  const unassignedGuests = guests.filter(guest => !guest.table_number);

  const getGuestsByTable = (tableNumber: number) => {
    return guests.filter(guest => guest.table_number === tableNumber);
  };

  const assignGuestToTable = async (guestId: string, tableNumber: number) => {
    try {
      setLoading(true);
      await updateGuest(guestId, { table_number: tableNumber });
      
      // Update local state would happen through parent component refresh
      window.location.reload(); // Simple refresh for now
    } catch (err) {
      console.error('Error assigning guest to table:', err);
      setError(err instanceof Error ? err.message : 'Failed to assign guest');
    } finally {
      setLoading(false);
    }
  };

  const removeGuestFromTable = async (guestId: string) => {
    try {
      setLoading(true);
      await updateGuest(guestId, { table_number: null });
      
      // Update local state would happen through parent component refresh
      window.location.reload(); // Simple refresh for now
    } catch (err) {
      console.error('Error removing guest from table:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove guest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Manage Table Assignments</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-800">{tables.length}</div>
            <div className="text-sm text-gray-600">Tables</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{guests.length}</div>
            <div className="text-sm text-gray-600">Total Guests</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {guests.filter(g => g.table_number).length}
            </div>
            <div className="text-sm text-gray-600">Assigned</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{unassignedGuests.length}</div>
            <div className="text-sm text-gray-600">Unassigned</div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tables */}
        <div className="lg:col-span-2">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Tables</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tables.map((table) => {
              const tableGuests = getGuestsByTable(table.number);
              const availableSeats = (table.seats || 8) - tableGuests.length;
              
              return (
                <div key={table.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-semibold text-gray-800">Table {table.number}</h5>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      availableSeats === 0 ? 'bg-red-100 text-red-700' :
                      availableSeats <= 2 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {availableSeats} seats left
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {tableGuests.map((guest) => (
                      <div key={guest.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{guest.name}</span>
                          {guest.plus_one && guest.plus_one_name && (
                            <span className="text-xs text-gray-500">+ {guest.plus_one_name}</span>
                          )}
                        </div>
                        <button
                          onClick={() => removeGuestFromTable(guest.id)}
                          disabled={loading}
                          className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    {tableGuests.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No guests assigned</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    Capacity: {table.seats || 8} seats • Shape: {table.shape}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unassigned Guests */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Unassigned Guests ({unassignedGuests.length})
          </h4>
          
          {unassignedGuests.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-3">
                {unassignedGuests.map((guest) => (
                  <div key={guest.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-700">{guest.name}</span>
                      {guest.plus_one && guest.plus_one_name && (
                        <span className="text-sm text-gray-500">+ {guest.plus_one_name}</span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-600">
                        Assign to table:
                      </label>
                      <select
                        onChange={(e) => {
                          const tableNumber = parseInt(e.target.value);
                          if (tableNumber) {
                            assignGuestToTable(guest.id, tableNumber);
                          }
                        }}
                        disabled={loading}
                        className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:opacity-50"
                      >
                        <option value="">Select table...</option>
                        {tables.map((table) => {
                          const tableGuests = getGuestsByTable(table.number);
                          const availableSeats = (table.seats || 8) - tableGuests.length;
                          const seatsNeeded = guest.plus_one && guest.plus_one_name ? 2 : 1;
                          
                          return (
                            <option 
                              key={table.id} 
                              value={table.number}
                              disabled={availableSeats < seatsNeeded}
                            >
                              Table {table.number} ({availableSeats} seats left)
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h5 className="font-medium text-gray-800 mb-2">All guests assigned!</h5>
              <p className="text-sm text-gray-600">
                Every guest has been assigned to a table.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};