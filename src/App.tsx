import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';
import { PageRouter } from './components/PageRouter';
import { UserRole } from './types';
import { supabase, getCurrentUserProfile, ensureUserProfile } from './lib/supabase';

function App() {
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | string>('landing');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('Found existing session for user:', session.user.id);
          
          try {
            const profile = await ensureUserProfile(session.user);
            
            if (profile) {
              setCurrentUser({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                role: profile.role as UserRole
              });
              setCurrentView('dashboard');
            } else {
              console.log('No profile could be created or fetched');
            }
          } catch (profileError) {
            console.error('Error loading/creating profile:', profileError);
            // Continue without user but ensure loading stops
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const profile = await ensureUserProfile(session.user);
            
            if (profile) {
              setCurrentUser({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                role: profile.role as UserRole
              });
              setCurrentView('dashboard');
            } else {
              console.log('Failed to get profile after sign in');
            }
          } catch (error) {
            console.error('Error handling sign in:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setCurrentView('landing');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (user: { id: string; name: string; email: string; role: UserRole }) => {
    setCurrentUser(user);
    setShowAuth(false);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setCurrentView('landing');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  // Show loading spinner while checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading GA&A Events...</p>
        </div>
      </div>
    );
  }

  // Render page content based on current view
  const renderContent = () => {
    if (currentView === 'landing') {
      return <LandingPage onGetStarted={() => setShowAuth(true)} />;
    } else if (currentView === 'dashboard') {
      return <Dashboard user={currentUser!} />;
    } else {
      return <PageRouter currentPage={currentView} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-green-50 flex flex-col">
      <Header 
        currentUser={currentUser}
        onLogin={() => setShowAuth(true)}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
      
      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer onNavigate={handleNavigate} />

      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default App;