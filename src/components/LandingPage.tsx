import React from 'react';
import { Calendar, Users, DollarSign, CheckCircle, Heart, Star, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Comprehensive timeline and task management for your perfect day'
    },
    {
      icon: Users,
      title: 'Guest Coordination',
      description: 'RSVP tracking, seating plans, and guest list management'
    },
    {
      icon: DollarSign,
      title: 'Budget Tracking',
      description: 'Keep your wedding budget on track with detailed expense monitoring'
    },
    {
      icon: CheckCircle,
      title: 'Vendor Management',
      description: 'Connect with trusted vendors and manage all your contracts'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah & Michael',
      text: 'GA&A Events made our wedding planning stress-free and organized!',
      rating: 5
    },
    {
      name: 'Jessica & David',
      text: 'The vendor network and budget tracking features are incredible.',
      rating: 5
    },
    {
      name: 'Emily & James',
      text: 'Everything we needed in one beautiful, easy-to-use platform.',
      rating: 5
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-100/50 to-green-100/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Heart className="w-16 h-16 text-rose-500 mx-auto mb-6 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Your Dream Wedding
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-green-500">
                Perfectly Coordinated
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              From intimate ceremonies to grand celebrations, GA&A Events provides the ultimate 
              platform for planning, managing, and executing your perfect wedding day.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-8 py-4 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Planning Today</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="text-gray-600 px-8 py-4 rounded-xl hover:bg-white/50 transition-all duration-200 font-medium text-lg">
              Watch Demo
            </button>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-800">500+</div>
              <div className="text-gray-600">Happy Couples</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">1,200+</div>
              <div className="text-gray-600">Trusted Vendors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Everything You Need for Your Perfect Day
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform brings together all the tools you need to plan, 
              coordinate, and execute your dream wedding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-rose-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-rose-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Loved by Couples Everywhere
            </h2>
            <p className="text-xl text-gray-600">
              See what our happy couples have to say about their GA&A Events experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.split(' ')[0][0]}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">Happy Couple</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rose-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Planning Your Perfect Day?
          </h2>
          <p className="text-xl text-rose-100 mb-8 leading-relaxed">
            Join thousands of couples who have trusted GA&A Events to make their wedding dreams come true.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-rose-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};