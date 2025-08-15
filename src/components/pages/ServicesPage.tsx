import React from 'react';
import { Calendar, Users, DollarSign, CheckCircle, Clock, MapPin, Heart, Star } from 'lucide-react';

interface ServicesPageProps {
  service?: string;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ service = 'planning' }) => {
  const services = {
    planning: {
      title: 'Wedding Planning',
      icon: Calendar,
      description: 'Comprehensive wedding planning tools to organize every detail of your special day',
      features: [
        'Timeline creation and management',
        'Task assignment and tracking',
        'Milestone reminders',
        'Vendor coordination',
        'Budget integration',
        'Real-time progress tracking'
      ],
      benefits: [
        'Stay organized throughout your planning journey',
        'Never miss important deadlines',
        'Collaborate with your partner and vendors',
        'Track progress with visual indicators'
      ]
    },
    guests: {
      title: 'Guest Management',
      icon: Users,
      description: 'Streamline your guest list management, RSVPs, and seating arrangements',
      features: [
        'Digital guest list management',
        'RSVP tracking and reminders',
        'Dietary restrictions tracking',
        'Plus-one management',
        'Seating plan creation',
        'Guest communication tools'
      ],
      benefits: [
        'Effortless RSVP collection and tracking',
        'Automated reminder systems',
        'Visual seating plan creation',
        'Comprehensive guest information storage'
      ]
    },
    budget: {
      title: 'Budget Tracking',
      icon: DollarSign,
      description: 'Keep your wedding expenses on track with detailed budget management tools',
      features: [
        'Category-based budget allocation',
        'Expense tracking and receipts',
        'Vendor payment scheduling',
        'Budget alerts and warnings',
        'Spending analytics',
        'Cost comparison tools'
      ],
      benefits: [
        'Stay within your budget limits',
        'Track every expense automatically',
        'Get alerts before overspending',
        'Make informed financial decisions'
      ]
    },
    timeline: {
      title: 'Timeline Management',
      icon: Clock,
      description: 'Create and manage detailed wedding day timelines and schedules',
      features: [
        'Day-of timeline creation',
        'Vendor schedule coordination',
        'Buffer time management',
        'Timeline sharing with vendors',
        'Real-time updates',
        'Backup plan integration'
      ],
      benefits: [
        'Ensure perfect timing on your wedding day',
        'Coordinate all vendors seamlessly',
        'Reduce stress with detailed planning',
        'Handle unexpected changes smoothly'
      ]
    },
    seating: {
      title: 'Seating Plans',
      icon: MapPin,
      description: 'Design beautiful seating arrangements that bring your guests together',
      features: [
        'Visual seating chart designer',
        'Table shape and size options',
        'Guest relationship mapping',
        'Dietary restriction integration',
        'Multiple layout options',
        'Print-ready seating charts'
      ],
      benefits: [
        'Create harmonious table arrangements',
        'Accommodate guest preferences',
        'Visualize your reception layout',
        'Easy modifications and updates'
      ]
    }
  };

  const currentService = services[service as keyof typeof services] || services.planning;
  const ServiceIcon = currentService.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ServiceIcon className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-bold mb-6">{currentService.title}</h1>
          <p className="text-xl text-rose-100 leading-relaxed">
            {currentService.description}
          </p>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentService.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-6 bg-gray-50 rounded-xl">
                <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-4 h-4 text-rose-600" />
                </div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Choose Our {currentService.title}?</h2>
          <div className="space-y-6">
            {currentService.benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-gray-700 text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Set Up</h3>
              <p className="text-gray-600">
                Create your account and input your wedding details to get started with our {currentService.title.toLowerCase()} tools.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Customize</h3>
              <p className="text-gray-600">
                Tailor the features to match your specific needs and preferences for your unique wedding.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Execute</h3>
              <p className="text-gray-600">
                Use our tools to manage and execute your plans seamlessly, with real-time updates and support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-rose-500 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-rose-100 mb-8">
            Join thousands of couples who have successfully planned their dream weddings with GA&A Events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-rose-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Start Free Trial
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};