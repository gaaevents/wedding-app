import { supabase } from './supabase';
import { Database } from '../types/database';

type Event = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

// Get all events for the current user
export const getUserEvents = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('created_by', user.id)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return data;
};

// Get a single event by ID
export const getEventById = async (eventId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    throw error;
  }

  return data;
};

// Create a new event
export const createEvent = async (eventData: Omit<EventInsert, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        ...eventData,
        created_by: user.id
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw error;
  }

  return data;
};

// Update an existing event
export const updateEvent = async (eventId: string, eventData: EventUpdate) => {
  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', eventId)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    throw error;
  }

  return data;
};

// Delete an event
export const deleteEvent = async (eventId: string) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error('Error deleting event:', error);
    throw error;
  }

  return true;
};

// Get public events for general users
export const getPublicEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_public', true)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching public events:', error);
    throw error;
  }

  return data;
};

// Calculate event progress based on tasks completion
export const calculateEventProgress = async (eventId: string) => {
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('completed')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching tasks for progress calculation:', error);
    return 0;
  }

  if (tasks.length === 0) return 0;

  const completedTasks = tasks.filter(task => task.completed).length;
  return Math.round((completedTasks / tasks.length) * 100);
};

// Update event progress
export const updateEventProgress = async (eventId: string) => {
  const progress = await calculateEventProgress(eventId);
  
  const { error } = await supabase
    .from('events')
    .update({ progress })
    .eq('id', eventId);

  if (error) {
    console.error('Error updating event progress:', error);
    throw error;
  }

  return progress;
};