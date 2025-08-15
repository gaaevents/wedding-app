import React from 'react';
import { FileText, Scale, Shield, AlertTriangle, CheckCircle, Users } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: [
        'By accessing and using GA&A Events services, you accept and agree to be bound by these Terms of Service.',
        'If you do not agree to these terms, please do not use our services.',
        'We may update these terms from time to time, and continued use constitutes acceptance of any changes.',
        'You must be at least 18 years old to use our services or have parental consent.'
      ]
    },
    {
      title: 'Service Description',
      content: [
        'GA&A Events provides wedding coordination and planning services through our digital platform.',
        'We connect couples with vendors, provide planning tools, and facilitate communication.',
        'Our services include budget tracking, guest management, timeline creation, and vendor marketplace access.',
        'We do not guarantee the availability or quality of third-party vendor services.'
      ]
    },
    {
      title: 'User Responsibilities',
      content: [
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree to provide accurate and complete information when using our services.',
        'You will not use our platform for any illegal or unauthorized purposes.',
        'You are responsible for all activities that occur under your account.',
        'You agree to respect the intellectual property rights of others.'
      ]
    },
    {
      title: 'Payment Terms',
      content: [
        'Subscription fees are billed in advance and are non-refundable except as required by law.',
        'Vendor payments are processed securely through our payment partners.',
        'You authorize us to charge your payment method for applicable fees.',
        'Prices may change with 30 days notice to existing subscribers.',
        'Failed payments may result in service suspension or termination.'
      ]
    },
    {
      title: 'Vendor Relationships',
      content: [
        'GA&A Events acts as a platform connecting couples with independent vendors.',
        'We do not employ vendors and are not responsible for their services or conduct.',
        'Contracts for services are between you and the vendor directly.',
        'We may receive commissions from vendors for successful bookings.',
        'Vendor ratings and reviews reflect user opinions and experiences.'
      ]
    },
    {
      title: 'Limitation of Liability',
      content: [
        'Our liability is limited to the amount you paid for our services in the past 12 months.',
        'We are not liable for indirect, incidental, or consequential damages.',
        'We do not guarantee uninterrupted or error-free service.',
        'You use our services at your own risk and discretion.',
        'Some jurisdictions may not allow certain liability limitations.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Please read these terms carefully before using our wedding coordination services.
          </p>
          <div className="mt-6 text-sm text-gray-400">
            Last updated: January 15, 2024
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to GA&A Events</h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms of Service ("Terms") govern your use of GA&A Events' wedding coordination 
                  platform and services. By creating an account or using our services, you agree to 
                  these terms and our Privacy Policy. Please read them carefully.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Terms Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{section.title}</h2>
                <div className="space-y-4">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notices */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Important Notices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <h3 className="text-xl font-semibold text-gray-800">Dispute Resolution</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Any disputes arising from these terms will be resolved through binding arbitration 
                in accordance with the rules of the American Arbitration Association.
              </p>
              <p className="text-gray-600 text-sm">
                You waive your right to participate in class action lawsuits or class-wide arbitration.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">Data Protection</h3>
              </div>
              <p className="text-gray-600 mb-4">
                We are committed to protecting your personal information in accordance with 
                applicable privacy laws including GDPR and CCPA.
              </p>
              <p className="text-gray-600 text-sm">
                See our Privacy Policy for detailed information about data handling practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Termination */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Termination</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">By You</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>You may terminate your account at any time</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Download your data before termination</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>No refunds for unused subscription periods</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">By Us</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>For violation of these terms</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>For fraudulent or illegal activity</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <span>With 30 days notice for convenience</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Questions About These Terms?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Our legal team is available to clarify any questions about these Terms of Service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:legal@gaaevents.com"
              className="bg-white text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Contact Legal Team
            </a>
            <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium">
              Get Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};