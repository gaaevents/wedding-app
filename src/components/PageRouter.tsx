import React from 'react';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { HelpPage } from './pages/HelpPage';
import { ContactPage } from './pages/ContactPage';
import { ServicesPage } from './pages/ServicesPage';
import { VendorMarketplacePage } from './pages/VendorMarketplacePage';
import { BecomeVendorPage } from './pages/BecomeVendorPage';
import { VendorLoginPage } from './pages/VendorLoginPage';
import { PricingPage } from './pages/PricingPage';

interface PageRouterProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const PageRouter: React.FC<PageRouterProps> = ({ currentPage, onNavigate }) => {
  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'marketplace':
        return <VendorMarketplacePage />;
      case 'vendors/join':
        return <BecomeVendorPage />;
      case 'vendors/login':
        return <VendorLoginPage />;
      case 'vendors/pricing':
        return <PricingPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'help':
        return <HelpPage />;
      case 'support':
        return <ContactPage />;
      case 'services/planning':
      case 'services/guests':
      case 'services/budget':
      case 'services/timeline':
      case 'services/seating':
        return <ServicesPage service={currentPage.split('/')[1]} />;
      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
              <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
              <button
                onClick={() => onNavigate('landing')}
                className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200"
              >
                Go Home
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      {renderPage()}
      
      {/* Back to Home Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => onNavigate('landing')}
          className="bg-rose-600 text-white p-3 rounded-full shadow-lg hover:bg-rose-700 transition-colors"
          title="Back to Home"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </div>
    </div>
  );
};