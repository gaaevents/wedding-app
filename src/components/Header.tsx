import React from 'react';
import { Heart, User, LogOut, Home, Calendar } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentUser: { name: string; role: UserRole } | null;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (view: 'landing' | 'dashboard') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  onLogin, 
  onLogout, 
  onNavigate 
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate('landing')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">GA&A Events</h1>
              <p className="text-xs text-gray-500 -mt-1">Wedding Coordinators</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onNavigate('landing')}
              className="flex items-center space-x-1 text-gray-600 hover:text-rose-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button 
              onClick={() => onNavigate('marketplace')}
              className="flex items-center space-x-1 text-gray-600 hover:text-rose-600 transition-colors"
            >
              <span>Vendors</span>
            </button>
            {currentUser && (
              <button 
                onClick={() => onNavigate('dashboard')}
                className="flex items-center space-x-1 text-gray-600 hover:text-rose-600 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-800">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-2 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};