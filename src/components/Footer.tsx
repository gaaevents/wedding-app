import React from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      // Fallback for external navigation
      window.location.href = `/${page}`;
    }
  };

  const footerLinks = {
    services: [
      { name: 'Wedding Planning', page: 'services/planning' },
      { name: 'Vendor Marketplace', page: 'marketplace' },
      { name: 'Guest Management', page: 'services/guests' },
      { name: 'Budget Tracking', page: 'services/budget' },
      { name: 'Timeline Management', page: 'services/timeline' },
      { name: 'Seating Plans', page: 'services/seating' }
    ],
    company: [
      { name: 'About Us', page: 'about' },
      { name: 'Our Story', page: 'story' },
      { name: 'Team', page: 'team' },
      { name: 'Careers', page: 'careers' },
      { name: 'Press', page: 'press' },
      { name: 'Blog', page: 'blog' }
    ],
    support: [
      { name: 'Help Center', page: 'help' },
      { name: 'Contact Support', page: 'support' },
      { name: 'Getting Started', page: 'getting-started' },
      { name: 'Video Tutorials', page: 'tutorials' },
      { name: 'Community Forum', page: 'community' },
      { name: 'Wedding Tips', page: 'tips' }
    ],
    vendors: [
      { name: 'Become a Vendor', page: 'vendors/join' },
      { name: 'Vendor Login', page: 'vendors/login' },
      { name: 'Vendor Resources', page: 'vendors/resources' },
      { name: 'Success Stories', page: 'vendors/stories' },
      { name: 'Pricing Plans', page: 'vendors/pricing' },
      { name: 'Partner Program', page: 'vendors/partners' }
    ],
    legal: [
      { name: 'Privacy Policy', page: 'privacy' },
      { name: 'Terms of Service', page: 'terms' },
      { name: 'Cookie Policy', page: 'cookies' },
      { name: 'Refund Policy', page: 'refunds' },
      { name: 'Cancellation Policy', page: 'cancellation' },
      { name: 'Dispute Resolution', page: 'disputes' }
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <div>
                <h3 className="text-xl font-bold">GA&A Events</h3>
                <p className="text-sm text-gray-400">Wedding Coordinators</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner in creating unforgettable wedding experiences. 
              From intimate ceremonies to grand celebrations, we bring your dream wedding to life.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-rose-400" />
                <span className="text-gray-300">(555) 123-WEDDING</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-rose-400" />
                <span className="text-gray-300">hello@gaaevents.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span className="text-gray-300">123 Wedding Lane, Love City, LC 12345</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-rose-400">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={() => handleLinkClick(link.page)}
                    className="text-gray-300 hover:text-white transition-colors text-sm text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-rose-400">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={() => handleLinkClick(link.page)}
                    className="text-gray-300 hover:text-white transition-colors text-sm text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-rose-400">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={() => handleLinkClick(link.page)}
                    className="text-gray-300 hover:text-white transition-colors text-sm text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendors */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-rose-400">For Vendors</h4>
            <ul className="space-y-2">
              {footerLinks.vendors.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={() => handleLinkClick(link.page)}
                    className="text-gray-300 hover:text-white transition-colors text-sm text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-md">
            <h4 className="text-lg font-semibold mb-4 text-rose-400">Stay Updated</h4>
            <p className="text-gray-300 text-sm mb-4">
              Get wedding planning tips, vendor spotlights, and exclusive offers delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} GA&A Events. All rights reserved.
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {footerLinks.legal.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.page)}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-xs">
              GA&A Events is a registered trademark. Licensed wedding coordinators serving couples worldwide.
              <br />
              Secure payments powered by Stripe. Optional blockchain payments available.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};