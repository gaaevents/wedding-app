import React from 'react';
import { Users, UserCheck, UserX, Clock, UsersIcon } from 'lucide-react';

interface RSVPStatsProps {
  stats: {
    total: number;
    attending: number;
    declined: number;
    pending: number;
    plusOnes: number;
    totalAttending: number;
    responseRate: number;
  };
}

export const RSVPStats: React.FC<RSVPStatsProps> = ({ stats }) => {
  const attendingPercentage = stats.total > 0 ? (stats.attending / stats.total) * 100 : 0;
  const declinedPercentage = stats.total > 0 ? (stats.declined / stats.total) * 100 : 0;
  const pendingPercentage = stats.total > 0 ? (stats.pending / stats.total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Guests</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Attending</p>
              <p className="text-2xl font-bold text-gray-800">{stats.attending}</p>
              <p className="text-sm text-green-600">{Math.round(attendingPercentage)}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Declined</p>
              <p className="text-2xl font-bold text-gray-800">{stats.declined}</p>
              <p className="text-sm text-red-600">{Math.round(declinedPercentage)}%</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              <p className="text-sm text-yellow-600">{Math.round(pendingPercentage)}%</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Attending</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalAttending}</p>
              <p className="text-sm text-purple-600">+{stats.plusOnes} plus ones</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">RSVP Progress</h3>
          <span className="text-sm text-gray-600">Response Rate: {stats.responseRate}%</span>
        </div>
        
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

        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div>
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm font-medium text-gray-700">Attending</span>
            </div>
            <div className="text-lg font-bold text-green-600">{stats.attending}</div>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm font-medium text-gray-700">Declined</span>
            </div>
            <div className="text-lg font-bold text-red-600">{stats.declined}</div>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-sm font-medium text-gray-700">Pending</span>
            </div>
            <div className="text-lg font-bold text-yellow-600">{stats.pending}</div>
          </div>
        </div>
      </div>
    </div>
  );
};