import { supabase } from './supabase';
import { Database } from '../types/database';

type Vendor = Database['public']['Tables']['vendors']['Row'];

// Get user's favorite vendors
export const getFavoriteVendors = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // For now, we'll use localStorage to store favorites
  // In a real app, you'd want a favorites table in the database
  const favorites = localStorage.getItem(`favorites_${user.id}`);
  const favoriteIds = favorites ? JSON.parse(favorites) : [];

  if (favoriteIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .in('id', favoriteIds)
    .eq('is_approved', true);

  if (error) {
    console.error('Error fetching favorite vendors:', error);
    throw error;
  }

  return data;
};

// Add vendor to favorites
export const addFavoriteVendor = async (vendorId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const favorites = localStorage.getItem(`favorites_${user.id}`);
  const favoriteIds = favorites ? JSON.parse(favorites) : [];

  if (!favoriteIds.includes(vendorId)) {
    favoriteIds.push(vendorId);
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favoriteIds));
  }

  return true;
};

// Remove vendor from favorites
export const removeFavoriteVendor = async (vendorId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const favorites = localStorage.getItem(`favorites_${user.id}`);
  const favoriteIds = favorites ? JSON.parse(favorites) : [];

  const updatedFavorites = favoriteIds.filter((id: string) => id !== vendorId);
  localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites));

  return true;
};

// Check if vendor is in favorites
export const isVendorFavorite = async (vendorId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }

  const favorites = localStorage.getItem(`favorites_${user.id}`);
  const favoriteIds = favorites ? JSON.parse(favorites) : [];

  return favoriteIds.includes(vendorId);
};