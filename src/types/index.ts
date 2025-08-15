export type UserRole = 'admin' | 'vendor' | 'couple' | 'guest' | 'general';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
  isApproved: boolean;
  privacyAccepted: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  coupleNames: string[];
  guestCount: number;
  budget: number;
  spent: number;
  isPublic: boolean;
  progress: number;
  description?: string;
  location: string;
  style: string;
  photos: string[];
  createdBy: string;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  completedAt?: string;
}

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  rsvpStatus: 'pending' | 'attending' | 'declined';
  plusOne?: boolean;
  plusOneName?: string;
  dietaryRestrictions?: string;
  table?: number;
  notes?: string;
  invitedAt: string;
  respondedAt?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  email: string;
  phone: string;
  website?: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  location: string;
  description: string;
  services: string[];
  photos: string[];
  availability: string[];
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export type VendorCategory = 
  | 'photographer' 
  | 'videographer' 
  | 'venue' 
  | 'caterer' 
  | 'florist' 
  | 'musician' 
  | 'dj' 
  | 'baker' 
  | 'planner' 
  | 'decorator' 
  | 'transportation' 
  | 'officiant' 
  | 'makeup' 
  | 'hair' 
  | 'dress' 
  | 'suit' 
  | 'jewelry' 
  | 'invitations' 
  | 'favors';

export interface BudgetItem {
  id: string;
  eventId: string;
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  color: string;
  vendors: string[];
  notes?: string;
}

export interface Booking {
  id: string;
  eventId: string;
  vendorId: string;
  coupleId: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  amount: number;
  status: 'inquiry' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  method: 'stripe' | 'crypto' | 'cash' | 'check';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface GiftRegistryItem {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  purchased: number;
  retailer: string;
  url?: string;
  image?: string;
  category: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  eventId?: string;
  content: string;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface SeatingPlan {
  id: string;
  eventId: string;
  name: string;
  tables: Table[];
  layout: 'round' | 'rectangular' | 'mixed';
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  id: string;
  number: number;
  seats: number;
  shape: 'round' | 'rectangular';
  position: { x: number; y: number };
  guests: string[];
}

export interface Review {
  id: string;
  vendorId: string;
  userId: string;
  eventId: string;
  rating: number;
  comment: string;
  photos?: string[];
  createdAt: string;
  isVerified: boolean;
}