import React, { useState } from 'react';
import { Search, HelpCircle, Book, MessageCircle, Video, Users, ChevronDown, ChevronRight } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Learn the basics of planning your wedding with GA&A Events',
      articles: 12
    },
    {
      icon: Users,
      title: 'Guest Management',
      description: 'Managing RSVPs, seating plans, and guest communications',
      articles: 8
    },
    {
      icon: MessageCircle,
      title: 'Vendor Coordination',
      description: 'Finding, booking, and working with wedding vendors',
      articles: 15
    },
    {
      icon: Video,
      title: 'Budget Planning',
      description: 'Tracking expenses and staying within your wedding budget',
      articles: 6
    }
  ];

  const faqs = [
    {
      question: 'How do I create my first wedding event?',
      answer: 'After signing up, click the "Create Wedding" button on your dashboard. Fill in your wedding details including date, venue, and guest count. You can always edit these details later as your plans evolve.'
    },
    {
      question: 'Can I invite vendors to collaborate on my wedding?',
      answer: 'Yes! You can invite vendors to collaborate by sharing your event details with them. They can then provide quotes, update timelines, and communicate directly through our platform.'
    },
    {
      question: 'How does the budget tracking feature work?',
      answer: 'Our budget tracker lets you set category budgets, track expenses, and see real-time spending updates. You can categorize expenses, upload receipts, and get alerts when approaching budget limits.'
    },
    {
      question: 'Is my wedding information private and secure?',
      answer: 'Absolutely. We use industry-standard encryption and security measures. Your wedding details are only visible to you and vendors you explicitly invite to collaborate.'
    },
    {
      question: 'Can I export my wedding data?',
      answer: 'Yes, you can export your guest lists, vendor contacts, timelines, and other wedding data in various formats including CSV and PDF for your records.'
    },
    {
      question: 'What if I need to change my wedding date?',
      answer: 'You can update your wedding date anytime in your event settings. The system will automatically adjust timelines and notify any connected vendors of the change.'
    },
    {
      question: 'How do I manage RSVPs from guests?',
      answer: 'Guests can RSVP through personalized links you send them. You can track responses in real-time, send reminders to non-responders, and manage dietary restrictions and plus-ones.'
    },
    {
      question: 'Can multiple people manage the same wedding?',
      answer: 'Yes! You can invite your partner, family members, or wedding planner to collaborate on your wedding with different permission levels.'
    }
  ];

  const quickActions = [
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: Video,
      action: 'Watch Now'
    },
    {
      title: 'Live Chat Support',
      description: 'Get instant help from our team',
      icon: MessageCircle,
      action: 'Start Chat'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other couples',
      icon: Users,
      action: 'Join Discussion'
    },
    {
      title: 'Contact Support',
      description: 'Email our support team',
      icon: HelpCircle,
      action: 'Send Email'
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-bold mb-6">Help Center</h1>
          <p className="text-xl text-blue-100 mb-8">
            Find answers, get support, and learn how to make the most of GA&A Events
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-gray-800 rounded-xl border-0 focus:ring-4 focus:ring-white/20 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Get Help Quickly</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <action.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                <button className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors">
                  {action.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <category.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{category.articles} articles</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-4 text-gray-600 border-t border-gray-100">
                    <p className="pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredFAQs.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
              <p className="text-gray-500">Try searching with different keywords or browse our categories above.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Our support team is here to help you every step of the way to your perfect wedding day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Contact Support
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium">
              Schedule a Call
            </button>
          </div>
          <div className="mt-8 text-purple-200 text-sm">
            Average response time: 2 hours • Available 24/7
          </div>
        </div>
      </section>
    </div>
  );
};