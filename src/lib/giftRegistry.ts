import { supabase } from './supabase';
import { Database } from '../types/database';

type GiftRegistryItem = Database['public']['Tables']['gift_registry_items']['Row'];
type GiftRegistryItemInsert = Database['public']['Tables']['gift_registry_items']['Insert'];
type GiftRegistryItemUpdate = Database['public']['Tables']['gift_registry_items']['Update'];

// Get all gift registry items for an event
export const getEventGiftRegistry = async (eventId: string) => {
  const { data, error } = await supabase
    .from('gift_registry_items')
    .select('*')
    .eq('event_id', eventId)
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching gift registry items:', error);
    throw error;
  }

  return data;
};

// Create a new gift registry item
export const createGiftItem = async (itemData: Omit<GiftRegistryItemInsert, 'id'>) => {
  const { data, error } = await supabase
    .from('gift_registry_items')
    .insert([itemData])
    .select()
    .single();

  if (error) {
    console.error('Error creating gift item:', error);
    throw error;
  }

  return data;
};

// Update a gift registry item
export const updateGiftItem = async (itemId: string, itemData: GiftRegistryItemUpdate) => {
  const { data, error } = await supabase
    .from('gift_registry_items')
    .update(itemData)
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    console.error('Error updating gift item:', error);
    throw error;
  }

  return data;
};

// Delete a gift registry item
export const deleteGiftItem = async (itemId: string) => {
  const { error } = await supabase
    .from('gift_registry_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Error deleting gift item:', error);
    throw error;
  }

  return true;
};

// Get gift registry statistics
export const getGiftRegistryStats = async (eventId: string) => {
  const { data, error } = await supabase
    .from('gift_registry_items')
    .select('price, quantity, purchased')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching gift registry stats:', error);
    throw error;
  }

  const totalItems = data.length;
  const totalValue = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const purchasedValue = data.reduce((sum, item) => sum + (item.price * item.purchased), 0);
  const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
  const purchasedQuantity = data.reduce((sum, item) => sum + item.purchased, 0);

  return {
    totalItems,
    totalValue,
    purchasedValue,
    remainingValue: totalValue - purchasedValue,
    totalQuantity,
    purchasedQuantity,
    remainingQuantity: totalQuantity - purchasedQuantity,
    completionRate: totalValue > 0 ? Math.round((purchasedValue / totalValue) * 100) : 0
  };
};

// Get public gift registry (for guests to view)
export const getPublicGiftRegistry = async (eventId: string) => {
  // First check if the event is public
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('is_public')
    .eq('id', eventId)
    .single();

  if (eventError) {
    console.error('Error checking event visibility:', eventError);
    throw eventError;
  }

  if (!event.is_public) {
    throw new Error('This gift registry is private');
  }

  return getEventGiftRegistry(eventId);
};