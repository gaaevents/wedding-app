import React from 'react';
import { Guest } from '../../types';

interface GuestRSVPChartProps {
  guests: Guest[];
}

export const GuestRSVPChart: React.FC<GuestRSVPChartProps> = ({ guests }) => {
  const attending = guests.filter(g => g.rsvpStatus === 'attending').length;
  const declined = guests.filter(g => g.rsvpStatus === 'declined').length;
  const pending = guests.filter(g => g.rsvpStatus === 'pending').length;
  const total = guests.length;

  const attendingPercentage = (attending / total) * 100;
  const declinedPercentage = (declined / total) * 100;
  const pendingPercentage = (pending / total) * 100;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-800 mb-2">
          {attending} / {total} Guests
        </div>
        <div className="text-gray-600">RSVP Status</div>
      </div>

      {/* Visual Chart */}
      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
        <div className="h-full flex">
          <div 
            className="bg-green-500 transition-all duration-300"
            style={{ width: `${attendingPercentage}%` }}
          />
          <div 
            className="bg-red-500 transition-all duration-300"
            style={{ width: `${declinedPercentage}%` }}
          />
          <div 
            className="bg-yellow-500 transition-all duration-300"
            style={{ width: `${pendingPercentage}%` }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="flex items-center justify-center space-x-2 mb-1">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-gray-700">Attending</span>
          </div>
          <div className="text-lg font-bold text-green-600">{attending}</div>
          <div className="text-xs text-gray-500">{Math.round(attendingPercentage)}%</div>
        </div>
        <div>
          <div className="flex items-center justify-center space-x-2 mb-1">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-sm font-medium text-gray-700">Declined</span>
          </div>
          <div className="text-lg font-bold text-red-600">{declined}</div>
          <div className="text-xs text-gray-500">{Math.round(declinedPercentage)}%</div>
        </div>
        <div>
          <div className="flex items-center justify-center space-x-2 mb-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-sm font-medium text-gray-700">Pending</span>
          </div>
          <div className="text-lg font-bold text-yellow-600">{pending}</div>
          <div className="text-xs text-gray-500">{Math.round(pendingPercentage)}%</div>
        </div>
      </div>
    </div>
  );
};