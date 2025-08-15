import React, { useState } from 'react';
import { Users, Building, Calendar, TrendingUp, DollarSign, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface AdminDashboardProps {
  user: { id: string; name: string; email: string; role: string };
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [stats] = useState({
    totalUsers: 1247,
    totalVendors: 156,
    activeEvents: 89,
    pendingApprovals: 12,
    monthlyRevenue: 45600,
    platformGrowth: 23.5
  });

  const [pendingApprovals] = useState([
    {
      id: '1',
      type: 'vendor',
      name: 'Elegant Flowers & Decor',
      email: 'contact@elegantflowers.com',
      category: 'Florist',
      submittedDate: '2024-03-10'
    },
    {
      id: '2',
      type: 'couple',
      name: 'Amanda & Ryan',
      email: 'amanda.ryan@email.com',
      eventDate: '2024-08-15',
      submittedDate: '2024-03-09'
    }
  ]);

  const [recentActivity] = useState([
    { id: '1', action: 'New vendor registration', user: 'Dream Photography', time: '2 hours ago' },
    { id: '2', action: 'Event created', user: 'Sarah & Michael', time: '4 hours ago' },
    { id: '3', action: 'Payment processed', user: 'Elite Catering', time: '6 hours ago' },
    { id: '4', action: 'User reported issue', user: 'Guest User', time: '8 hours ago' }
  ]);

  const handleApproval = (id: string, approved: boolean) => {
    console.log('Approval:', id, approved);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and management tools</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Vendors</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalVendors}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Events</p>
              <p className="text-2xl font-bold text-gray-800">{stats.activeEvents}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingApprovals}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-gray-800">${(stats.monthlyRevenue / 1000).toFixed(0)}K</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Growth</p>
              <p className="text-2xl font-bold text-gray-800">+{stats.platformGrowth}%</p>
            </div>
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-rose-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Approvals */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Pending Approvals</h3>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  {pendingApprovals.length} pending
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.type === 'vendor'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}>
                            {item.type}
                          </span>
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{item.email}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Submitted: {new Date(item.submittedDate).toLocaleDateString()}</span>
                          {item.type === 'vendor' && item.category && (
                            <span>Category: {item.category}</span>
                          )}
                          {item.type === 'couple' && item.eventDate && (
                            <span>Event: {new Date(item.eventDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproval(item.id, true)}
                          className="px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors text-sm font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproval(item.id, false)}
                          className="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.user}</p>
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
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium">
                  Manage Users
                </button>
                <button className="w-full bg-purple-50 text-purple-700 p-3 rounded-lg hover:bg-purple-100 transition-colors font-medium">
                  Vendor Applications
                </button>
                <button className="w-full bg-green-50 text-green-700 p-3 rounded-lg hover:bg-green-100 transition-colors font-medium">
                  Platform Settings
                </button>
                <button className="w-full bg-red-50 text-red-700 p-3 rounded-lg hover:bg-red-100 transition-colors font-medium">
                  Security Alerts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};