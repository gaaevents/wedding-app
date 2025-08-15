import React from 'react';
import { Users, User } from 'lucide-react';
import { Database } from '../../types/database';

type SeatingPlan = Database['public']['Tables']['seating_plans']['Row'];
type Guest = Database['public']['Tables']['guests']['Row'];

interface SeatingChartProps {
  seatingPlan: SeatingPlan;
  guests: Guest[];
}

export const SeatingChart: React.FC<SeatingChartProps> = ({ seatingPlan, guests }) => {
  const tables = Array.isArray(seatingPlan.tables) ? seatingPlan.tables as any[] : [];

  const getGuestsByTable = (tableNumber: number) => {
    return guests.filter(guest => guest.table_number === tableNumber);
  };

  const getTableColor = (tableGuests: Guest[]) => {
    const occupancyRate = tableGuests.length / 8; // Assuming 8 seats per table
    if (occupancyRate >= 1) return 'bg-green-100 border-green-300';
    if (occupancyRate >= 0.75) return 'bg-yellow-100 border-yellow-300';
    if (occupancyRate > 0) return 'bg-blue-100 border-blue-300';
    return 'bg-gray-100 border-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{seatingPlan.name}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-800">{tables.length}</div>
            <div className="text-sm text-gray-600">Tables</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {tables.reduce((sum, table) => sum + (table.seats || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Seats</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{guests.length}</div>
            <div className="text-sm text-gray-600">Attending Guests</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {guests.filter(g => g.table_number).length}
            </div>
            <div className="text-sm text-gray-600">Seated</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="font-semibold text-gray-800 mb-3">Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm text-gray-600">Full Table</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-sm text-gray-600">Nearly Full</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-sm text-gray-600">Partially Filled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span className="text-sm text-gray-600">Empty</span>
          </div>
        </div>
      </div>

      {/* Seating Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="font-semibold text-gray-800 mb-6">Seating Arrangement</h4>
        
        {tables.length > 0 ? (
          <div className="relative min-h-96 bg-gray-50 rounded-lg p-8">
            {tables.map((table) => {
              const tableGuests = getGuestsByTable(table.number);
              const isRound = table.shape === 'round';
              
              return (
                <div
                  key={table.id}
                  className={`absolute border-2 ${getTableColor(tableGuests)} rounded-lg p-4 min-w-32 min-h-32 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow`}
                  style={{
                    left: `${table.position?.x || 100}px`,
                    top: `${table.position?.y || 100}px`,
                    borderRadius: isRound ? '50%' : '8px',
                    width: isRound ? '120px' : '140px',
                    height: isRound ? '120px' : '100px'
                  }}
                >
                  <div className="text-center">
                    <div className="font-bold text-gray-800 mb-1">Table {table.number}</div>
                    <div className="text-xs text-gray-600 mb-2">
                      {tableGuests.length}/{table.seats || 8} seats
                    </div>
                    <div className="flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No tables in this seating plan</p>
          </div>
        )}
      </div>

      {/* Table Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => {
          const tableGuests = getGuestsByTable(table.number);
          
          return (
            <div key={table.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-semibold text-gray-800">Table {table.number}</h5>
                <span className="text-sm text-gray-600">
                  {tableGuests.length}/{table.seats || 8} seats
                </span>
              </div>
              
              {tableGuests.length > 0 ? (
                <div className="space-y-2">
                  {tableGuests.map((guest) => (
                    <div key={guest.id} className="flex items-center space-x-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{guest.name}</span>
                      {guest.plus_one && guest.plus_one_name && (
                        <span className="text-gray-500">+ {guest.plus_one_name}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No guests assigned</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Unassigned Guests */}
      {guests.filter(g => !g.table_number).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Unassigned Guests</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {guests.filter(g => !g.table_number).map((guest) => (
              <div key={guest.id} className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <User className="w-4 h-4 text-yellow-600" />
                <span className="text-gray-700">{guest.name}</span>
                {guest.plus_one && guest.plus_one_name && (
                  <span className="text-gray-500">+ {guest.plus_one_name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};