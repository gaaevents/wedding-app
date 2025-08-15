import { supabase } from './supabase';
import { Database } from '../types/database';

type Vendor = Database['public']['Tables']['vendors']['Row'];
type VendorInsert = Database['public']['Tables']['vendors']['Insert'];
type VendorUpdate = Database['public']['Tables']['vendors']['Update'];
type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type Review = Database['public']['Tables']['reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];

// Get all approved vendors
export const getApprovedVendors = async () => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('is_approved', true)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }

  return data;
};

// Get vendors by category
export const getVendorsByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('category', category)
    .eq('is_approved', true)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching vendors by category:', error);
    throw error;
  }

  return data;
};

// Get vendor by ID
export const getVendorById = async (vendorId: string) => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', vendorId)
    .single();

  if (error) {
    console.error('Error fetching vendor:', error);
    throw error;
  }

  return data;
};

// Create vendor profile (for vendor users)
export const createVendorProfile = async (vendorData: Omit<VendorInsert, 'id' | 'created_at'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('vendors')
    .insert([
      {
        ...vendorData,
        id: user.id // Use user ID as vendor ID
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating vendor profile:', error);
    throw error;
  }

  return data;
};

// Update vendor profile
export const updateVendorProfile = async (vendorId: string, vendorData: VendorUpdate) => {
  const { data, error } = await supabase
    .from('vendors')
    .update(vendorData)
    .eq('id', vendorId)
    .select()
    .single();

  if (error) {
    console.error('Error updating vendor profile:', error);
    throw error;
  }

  return data;
};

// Get current user's vendor profile
export const getCurrentVendorProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No vendor profile found
      return null;
    }
    console.error('Error fetching vendor profile:', error);
    throw error;
  }

  return data;
};

// Search vendors
export const searchVendors = async (searchTerm: string, category?: string, location?: string) => {
  let query = supabase
    .from('vendors')
    .select('*')
    .eq('is_approved', true);

  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (location) {
    query = query.ilike('location', `%${location}%`);
  }

  const { data, error } = await query.order('rating', { ascending: false });

  if (error) {
    console.error('Error searching vendors:', error);
    throw error;
  }

  return data;
};

// Create booking
export const createBooking = async (bookingData: Omit<BookingInsert, 'id' | 'created_at' | 'updated_at'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        ...bookingData,
        couple_id: user.id
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }

  return data;
};

// Get user's bookings
export const getUserBookings = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      vendors (
        name,
        category,
        location,
        photos
      ),
      events (
        title,
        date,
        venue
      )
    `)
    .eq('couple_id', user.id)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }

  return data;
};

// Get vendor's bookings
export const getVendorBookings = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      users!bookings_couple_id_fkey (
        name,
        email
      ),
      events (
        title,
        date,
        venue,
        location
      )
    `)
    .eq('vendor_id', user.id)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching vendor bookings:', error);
    throw error;
  }

  return data;
};

// Update booking status
export const updateBookingStatus = async (bookingId: string, status: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }

  return data;
};

// Get vendor reviews
export const getVendorReviews = async (vendorId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      users (
        name
      )
    `)
    .eq('vendor_id', vendorId)
    .eq('is_verified', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching vendor reviews:', error);
    throw error;
  }

  return data;
};

// Create review
export const createReview = async (reviewData: Omit<ReviewInsert, 'id' | 'user_id' | 'created_at'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert([
      {
        ...reviewData,
        user_id: user.id
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating review:', error);
    throw error;
  }

  return data;
};

// Update vendor rating after new review
export const updateVendorRating = async (vendorId: string) => {
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('rating')
    .eq('vendor_id', vendorId)
    .eq('is_verified', true);

  if (reviewsError) {
    console.error('Error fetching reviews for rating calculation:', reviewsError);
    return;
  }

  if (reviews.length === 0) return;

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const roundedRating = Math.round(averageRating * 10) / 10; // Round to 1 decimal place

  const { error } = await supabase
    .from('vendors')
    .update({ 
      rating: roundedRating,
      review_count: reviews.length
    })
    .eq('id', vendorId);

  if (error) {
    console.error('Error updating vendor rating:', error);
  }
};

// Get featured vendors
export const getFeaturedVendors = async (limit: number = 6) => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('is_approved', true)
    .eq('is_featured', true)
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured vendors:', error);
    throw error;
  }

  return data;
};