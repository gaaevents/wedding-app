import React from 'react';
import { Heart, Users, Award, Star, CheckCircle, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const stats = [
    { number: '500+', label: 'Happy Couples' },
    { number: '1,200+', label: 'Trusted Vendors' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Support Available' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion for Perfection',
      description: 'We believe every wedding should be a perfect reflection of your love story.'
    },
    {
      icon: Users,
      title: 'Personal Touch',
      description: 'Our dedicated team provides personalized service tailored to your unique vision.'
    },
    {
      icon: Award,
      title: 'Excellence in Service',
      description: 'Award-winning coordination services that exceed expectations every time.'
    },
    {
      icon: Star,
      title: 'Trusted Expertise',
      description: 'Years of experience creating magical moments for couples worldwide.'
    }
  ];

  const team = [
    {
      name: 'Ams TG',
      role: 'Founder & Lead Coordinator',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'With over 15 years in wedding coordination, Grace founded GA&A Events to make dream weddings accessible to everyone.'
    },
    {
      name: 'Nel',
      role: 'Co-Founder & Technology Director',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Alexander brings innovative technology solutions to wedding planning, making the process seamless and enjoyable.'
    },
    {
      name: 'Bianca',
      role: 'Senior Wedding Coordinator',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Sarah specializes in destination weddings and has coordinated over 200 beautiful ceremonies worldwide.'
    },
    {
      name: 'Pia',
      role: 'Vendor Relations Manager',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Michael curates our network of premium vendors, ensuring quality and reliability for every wedding.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About GA&A Events</h1>
          <p className="text-xl text-rose-100 max-w-3xl mx-auto leading-relaxed">
            We're passionate about creating unforgettable wedding experiences that celebrate love, 
            joy, and the beginning of beautiful journeys together.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl font-bold text-rose-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  GA&A Events was born from a simple belief: every couple deserves a wedding that 
                  perfectly captures their unique love story. Founded in 2015 by Grace Anderson and 
                  Alexander Chen, we started as a small team with big dreams.
                </p>
                <p>
                  What began as a local wedding coordination service has grown into a comprehensive 
                  platform that connects couples with the best vendors, provides innovative planning 
                  tools, and delivers exceptional experiences.
                </p>
                <p>
                  Today, we're proud to have helped over 500 couples create their perfect day, 
                  building a network of trusted vendors and a reputation for excellence that 
                  spans the globe.
                </p>
              </div>
              <div className="mt-8">
                <button className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-8 py-3 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 flex items-center space-x-2">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Wedding ceremony"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-rose-600 fill-current" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">500+ Weddings</div>
                    <div className="text-sm text-gray-600">Successfully Coordinated</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and every wedding we coordinate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate professionals dedicated to making your wedding dreams come true.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-rose-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-r from-rose-500 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-rose-100 leading-relaxed mb-8">
            To transform wedding planning from a stressful experience into a joyful journey, 
            providing couples with the tools, vendors, and support they need to create their 
            perfect day while staying true to their vision and budget.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-6 h-6 text-rose-200" />
            <span className="text-rose-100">Committed to your happiness since 2015</span>
          </div>
        </div>
      </section>
    </div>
  );
};