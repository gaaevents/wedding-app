import React from 'react';
import { Shield, Lock, Eye, Users, Database, Mail } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Personal information you provide when creating an account (name, email, phone)',
        'Wedding details and preferences you share while planning your event',
        'Communication records between you and vendors through our platform',
        'Usage data and analytics to improve our services',
        'Payment information processed securely through our payment partners'
      ]
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'To provide and improve our wedding coordination services',
        'To connect you with relevant vendors and service providers',
        'To send important updates about your wedding plans',
        'To provide customer support and respond to your inquiries',
        'To analyze usage patterns and enhance user experience'
      ]
    },
    {
      icon: Users,
      title: 'Information Sharing',
      content: [
        'We share information with vendors only when you initiate contact or bookings',
        'Anonymous analytics data may be shared with trusted partners',
        'We never sell your personal information to third parties',
        'Legal compliance may require disclosure in specific circumstances',
        'Service providers who help us operate our platform under strict agreements'
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        'Industry-standard encryption for all data transmission',
        'Secure servers with regular security audits and updates',
        'Limited access to personal data on a need-to-know basis',
        'Regular backups and disaster recovery procedures',
        'Compliance with GDPR, CCPA, and other privacy regulations'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, use, 
            and protect your personal information.
          </p>
          <div className="mt-6 text-sm text-blue-200">
            Last updated: January 15, 2024
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed">
              At GA&A Events, we are committed to protecting your privacy and ensuring the security 
              of your personal information. This Privacy Policy describes how we collect, use, 
              disclose, and safeguard your information when you use our wedding coordination platform 
              and services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using our services, you agree to the collection and use of information in accordance 
              with this policy. We will not use or share your information with anyone except as 
              described in this Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Privacy Rights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Access & Portability</h3>
                <p className="text-gray-600">
                  You have the right to access your personal data and receive a copy of it in a 
                  structured, machine-readable format.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Correction</h3>
                <p className="text-gray-600">
                  You can update or correct your personal information at any time through your 
                  account settings or by contacting us.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Deletion</h3>
                <p className="text-gray-600">
                  You can request deletion of your personal data, subject to certain legal 
                  obligations we may have to retain some information.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Opt-Out</h3>
                <p className="text-gray-600">
                  You can opt out of marketing communications at any time by using the unsubscribe 
                  link in emails or updating your preferences.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Restriction</h3>
                <p className="text-gray-600">
                  You can request that we restrict the processing of your personal data in 
                  certain circumstances.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Objection</h3>
                <p className="text-gray-600">
                  You have the right to object to certain types of processing, including 
                  direct marketing and profiling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cookies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Cookies & Tracking</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-gray-600 mb-6">
              We use cookies and similar tracking technologies to enhance your experience on our platform. 
              These technologies help us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Essential Cookies</h4>
                <p className="text-gray-600 text-sm">
                  Required for basic functionality, security, and to remember your login status.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Analytics Cookies</h4>
                <p className="text-gray-600 text-sm">
                  Help us understand how you use our platform to improve our services.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Preference Cookies</h4>
                <p className="text-gray-600 text-sm">
                  Remember your settings and preferences for a personalized experience.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Marketing Cookies</h4>
                <p className="text-gray-600 text-sm">
                  Used to show you relevant advertisements and measure campaign effectiveness.
                </p>
              </div>
            </div>
            <p className="text-gray-600 mt-6 text-sm">
              You can control cookie preferences through your browser settings or our cookie consent banner.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Questions About Privacy?</h2>
          <p className="text-xl text-blue-100 mb-8">
            If you have any questions about this Privacy Policy or our data practices, 
            we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:privacy@gaaevents.com"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Email Privacy Team
            </a>
            <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium">
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};