import React, { useState } from 'react';
import { DollarSign, CheckCircle, X, Star, Users, Building, Crown, ArrowRight, Calculator } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'professional' | 'premium'>('professional');

  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for new vendors getting started',
      monthlyPrice: 29,
      yearlyPrice: 290,
      savings: 20,
      icon: Building,
      color: 'blue',
      features: [
        'Basic vendor profile',
        'Up to 10 portfolio photos',
        'Client messaging system',
        'Basic booking management',
        'Mobile app access',
        'Email support'
      ],
      limitations: [
        '5% transaction fee',
        'Limited search visibility',
        'Basic analytics only'
      ],
      popular: false
    },
    {
      name: 'Professional',
      description: 'Most popular for established vendors',
      monthlyPrice: 79,
      yearlyPrice: 790,
      savings: 20,
      icon: Star,
      color: 'purple',
      features: [
        'Enhanced vendor profile',
        'Unlimited portfolio photos',
        'Priority in search results',
        'Advanced booking management',
        'Client review management',
        'Calendar integration',
        'Analytics dashboard',
        'Priority email support',
        'Custom booking forms'
      ],
      limitations: [
        '3% transaction fee'
      ],
      popular: true
    },
    {
      name: 'Premium',
      description: 'For high-volume wedding businesses',
      monthlyPrice: 149,
      yearlyPrice: 1490,
      savings: 20,
      icon: Crown,
      color: 'rose',
      features: [
        'Premium vendor profile',
        'Featured listing placement',
        'Custom branding options',
        'Advanced analytics & insights',
        'Priority customer support',
        'API access for integrations',
        'White-label options',
        'Dedicated account manager',
        'Custom contract templates',
        'Advanced reporting tools'
      ],
      limitations: [
        '2% transaction fee'
      ],
      popular: false
    }
  ];

  const addOns = [
    {
      name: 'Featured Listing',
      description: 'Boost your visibility with featured placement',
      price: 49,
      period: 'month'
    },
    {
      name: 'Premium Support',
      description: '24/7 phone support and dedicated account manager',
      price: 99,
      period: 'month'
    },
    {
      name: 'Custom Branding',
      description: 'White-label your vendor profile with custom branding',
      price: 199,
      period: 'month'
    }
  ];

  const faqs = [
    {
      question: 'What is included in the transaction fee?',
      answer: 'The transaction fee covers secure payment processing, dispute resolution, and platform maintenance. It\'s only charged on successful bookings.'
    },
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing adjustments.'
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No setup fees! All plans include free onboarding and setup assistance to get you started quickly.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and ACH bank transfers for subscription payments.'
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (billingCycle === 'yearly') {
      const yearlyTotal = plan.monthlyPrice * 12;
      const savings = yearlyTotal - plan.yearlyPrice;
      return savings;
    }
    return 0;
  };

  const getColorClasses = (color: string, popular: boolean = false) => {
    const colors = {
      blue: popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200',
      purple: popular ? 'border-purple-500 bg-purple-50' : 'border-gray-200',
      rose: popular ? 'border-rose-500 bg-rose-50' : 'border-gray-200'
    };
    return colors[color as keyof typeof colors] || 'border-gray-200';
  };

  const getButtonClasses = (color: string, popular: boolean = false) => {
    const colors = {
      blue: popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      purple: popular ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      rose: popular ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <DollarSign className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-bold mb-6">Vendor Pricing Plans</h1>
          <p className="text-xl text-purple-100 mb-8">
            Choose the perfect plan to grow your wedding business and connect with more couples
          </p>
          
          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/20 p-1 rounded-lg">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  billingCycle === 'monthly' ? 'bg-white text-purple-600' : 'text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  billingCycle === 'yearly' ? 'bg-white text-purple-600' : 'text-white'
                }`}
              >
                Yearly
                <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const PlanIcon = plan.icon;
              const price = getPrice(plan);
              const savings = getSavings(plan);
              
              return (
                <div
                  key={plan.name}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                    getColorClasses(plan.color, plan.popular)
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
                    <div className={`w-16 h-16 bg-${plan.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <PlanIcon className={`w-8 h-8 text-${plan.color}-600`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="text-4xl font-bold text-gray-800 mb-2">
                      ${price}
                      <span className="text-lg text-gray-500 font-normal">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    
                    {billingCycle === 'yearly' && savings > 0 && (
                      <div className="text-green-600 text-sm font-medium">
                        Save ${savings}/year
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Included Features:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.limitations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Plan Limitations:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, index) => (
                            <li key={index} className="flex items-center space-x-3">
                              <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      getButtonClasses(plan.color, plan.popular)
                    }`}
                  >
                    {plan.popular ? 'Start Free Trial' : 'Choose Plan'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Optional Add-ons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{addon.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{addon.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-800">
                    ${addon.price}
                    <span className="text-sm text-gray-500 font-normal">/{addon.period}</span>
                  </div>
                  <button className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                    Add to Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <Calculator className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Calculate Your Potential Earnings</h2>
              <p className="text-gray-600">
                See how much you could earn with GA&A Events based on your booking volume
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-gray-800 mb-2">$2,500</div>
                <div className="text-gray-600 mb-2">Average booking value</div>
                <div className="text-sm text-gray-500">Based on platform data</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-gray-800 mb-2">8</div>
                <div className="text-gray-600 mb-2">Bookings per month</div>
                <div className="text-sm text-gray-500">Average for active vendors</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">$19,400</div>
                <div className="text-gray-600 mb-2">Monthly potential</div>
                <div className="text-sm text-gray-500">After platform fees</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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