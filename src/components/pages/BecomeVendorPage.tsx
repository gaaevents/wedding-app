import React, { useState } from 'react';
import { Building, Star, DollarSign, Users, CheckCircle, ArrowRight, Award, TrendingUp, Heart } from 'lucide-react';

export const BecomeVendorPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'professional' | 'premium'>('professional');

  const benefits = [
    {
      icon: Users,
      title: 'Connect with Couples',
      description: 'Access thousands of couples actively planning their weddings'
    },
    {
      icon: Star,
      title: 'Build Your Reputation',
      description: 'Showcase your work and collect verified reviews from real clients'
    },
    {
      icon: DollarSign,
      title: 'Grow Your Business',
      description: 'Increase bookings and revenue through our trusted platform'
    },
    {
      icon: Award,
      title: 'Professional Tools',
      description: 'Access booking management, payment processing, and client communication tools'
    }
  ];

  const features = [
    'Professional vendor profile with photo gallery',
    'Direct messaging with potential clients',
    'Booking and contract management system',
    'Secure payment processing',
    'Review and rating system',
    'Calendar integration and availability management',
    'Analytics and performance insights',
    'Mobile app access for on-the-go management'
  ];

  const plans = [
    {
      name: 'Basic',
      price: 29,
      period: 'month',
      description: 'Perfect for new vendors getting started',
      features: [
        'Basic vendor profile',
        'Up to 10 photos',
        'Client messaging',
        'Basic booking management',
        '5% transaction fee'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: 79,
      period: 'month',
      description: 'Most popular for established vendors',
      features: [
        'Enhanced vendor profile',
        'Unlimited photos',
        'Priority in search results',
        'Advanced booking management',
        'Client review management',
        '3% transaction fee',
        'Analytics dashboard'
      ],
      popular: true
    },
    {
      name: 'Premium',
      price: 149,
      period: 'month',
      description: 'For high-volume wedding businesses',
      features: [
        'Premium vendor profile',
        'Featured listing placement',
        'Custom branding options',
        'Advanced analytics',
        'Priority customer support',
        '2% transaction fee',
        'API access',
        'White-label options'
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      business: 'Dream Photography',
      text: 'GA&A Events has transformed my business. I\'ve booked 40% more weddings since joining!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      business: 'Elite Catering',
      text: 'The platform makes it so easy to manage bookings and communicate with couples.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      business: 'Elegant Flowers',
      text: 'Best investment I\'ve made for my wedding business. Highly recommend!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-bold mb-6">Become a Vendor</h1>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Join the premier wedding vendor marketplace and connect with couples planning their dream weddings.
          </p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg">
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Why Join GA&A Events?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Everything You Need to Succeed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                  plan.popular ? 'border-purple-500' : 'border-gray-200'
                } hover:shadow-xl transition-shadow`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold text-gray-800 mb-2">
                    ${plan.price}
                    <span className="text-lg text-gray-500 font-normal">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.popular ? 'Start Free Trial' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">What Our Vendors Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                    {testimonial.name.split(' ')[0][0]}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.business}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Wedding Business?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of successful vendors who trust GA&A Events to connect them with their ideal clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center justify-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium">
              Schedule Demo
            </button>
          </div>
          <div className="mt-6 text-purple-200 text-sm">
            No setup fees • Cancel anytime • 30-day free trial
          </div>
        </div>
      </section>
    </div>
  );
};