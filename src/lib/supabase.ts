import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to get current user profile
export const getCurrentUserProfile = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return null;
    }
    
    if (!user) {
      console.log('No authenticated user found');
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      throw profileError;
    }

    if (!profile) {
      console.log('User profile not found, may need to be created');
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return null;
  }
};

// Helper function to create user profile after signup
export const createUserProfile = async (userId: string, userData: {
  name: string;
  email: string;
  role: string;
}) => {
  try {
    // First check if profile already exists
    const { data: existingProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (existingProfile) {
      console.log('Profile already exists, returning existing profile');
      return existingProfile;
    }

    // Create new profile
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          privacy_accepted: true,
          is_approved: userData.role === 'admin' ? true : false
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    throw error;
  }
};

// Helper function to ensure user profile exists
export const ensureUserProfile = async (user: any, additionalData?: {
  name?: string;
  role?: string;
}) => {
  try {
    // Try to get existing profile
    let profile = await getCurrentUserProfile();
    
    if (!profile && user) {
      // Create profile if it doesn't exist
      const profileData = {
        name: additionalData?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email,
        role: additionalData?.role || 'general'
      };
      
      try {
        profile = await createUserProfile(user.id, profileData);
      } catch (createError) {
        console.error('Failed to create profile, using fallback:', createError);
        // Return a fallback profile if creation fails
        return {
          id: user.id,
          name: profileData.name,
          email: profileData.email,
          role: profileData.role,
          avatar: null,
          phone: null,
          created_at: new Date().toISOString(),
          is_approved: false,
          privacy_accepted: true
        };
      }
    }
    
    return profile;
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    // Return a fallback profile instead of throwing
    if (user) {
      return {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email,
        role: 'general',
        avatar: null,
        phone: null,
        created_at: new Date().toISOString(),
        is_approved: false,
        privacy_accepted: true
      };
    }
    return null;
  }
};