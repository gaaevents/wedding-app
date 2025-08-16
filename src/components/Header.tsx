import React from 'react';
import { User, LogOut, Home, Calendar } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentUser: { name: string; role: UserRole } | null;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (view: 'landing' | 'dashboard' | 'marketplace') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm border-rose-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center space-x-2 transition-opacity cursor-pointer hover:opacity-80"
            onClick={() => onNavigate('landing')}
          >
            {/* Logo Image */}
            <img
              src="/logo512.png"
              alt="GA&A Events Logo"
              className="w-8 h-8 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">GA&A Events</h1>
              <p className="-mt-1 text-xs text-gray-500">Wedding Coordinators</p>
            </div>
          </div>

          <nav className="items-center hidden space-x-8 md:flex">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center space-x-1 text-gray-600 transition-colors hover:text-rose-600"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => onNavigate('marketplace')}
              className="flex items-center space-x-1 text-gray-600 transition-colors hover:text-rose-600"
            >
              <span>Vendors</span>
            </button>
            {currentUser && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center space-x-1 text-gray-600 transition-colors hover:text-rose-600"
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
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-800">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {currentUser.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 transition-colors hover:text-red-500"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="px-6 py-2 font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 hover:shadow-lg"
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
