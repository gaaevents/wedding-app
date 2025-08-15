import { supabase } from './supabase';
import { Database } from '../types/database';

type Guest = Database['public']['Tables']['guests']['Row'];
type GuestInsert = Database['public']['Tables']['guests']['Insert'];
type GuestUpdate = Database['public']['Tables']['guests']['Update'];

// Get all guests for an event
export const getEventGuests = async (eventId: string) => {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', eventId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching guests:', error);
    throw error;
  }

  return data;
};

// Get all guests for current user's events
export const getUserGuests = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('guests')
    .select(`
      *,
      events!inner (
        title,
        date,
        venue,
        created_by
      )
    `)
    .eq('events.created_by', user.id)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching user guests:', error);
    throw error;
  }

  return data;
};

// Create a new guest
export const createGuest = async (guestData: Omit<GuestInsert, 'id' | 'invited_at'>) => {
  const { data, error } = await supabase
    .from('guests')
    .insert([guestData])
    .select()
    .single();

  if (error) {
    console.error('Error creating guest:', error);
    throw error;
  }

  return data;
};

// Update a guest
export const updateGuest = async (guestId: string, guestData: GuestUpdate) => {
  const { data, error } = await supabase
    .from('guests')
    .update(guestData)
    .eq('id', guestId)
    .select()
    .single();

  if (error) {
    console.error('Error updating guest:', error);
    throw error;
  }

  return data;
};

// Delete a guest
export const deleteGuest = async (guestId: string) => {
  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', guestId);

  if (error) {
    console.error('Error deleting guest:', error);
    throw error;
  }

  return true;
};

// Update RSVP status
export const updateRSVP = async (guestId: string, status: 'attending' | 'declined', plusOneName?: string) => {
  const updateData: GuestUpdate = {
    rsvp_status: status,
    responded_at: new Date().toISOString()
  };

  if (plusOneName !== undefined) {
    updateData.plus_one_name = plusOneName;
  }

  const { data, error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', guestId)
    .select()
    .single();

  if (error) {
    console.error('Error updating RSVP:', error);
    throw error;
  }

  return data;
};

// Get RSVP statistics
export const getRSVPStats = async (eventId: string) => {
  const { data, error } = await supabase
    .from('guests')
    .select('rsvp_status, plus_one, plus_one_name')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching RSVP stats:', error);
    throw error;
  }

  const total = data.length;
  const attending = data.filter(guest => guest.rsvp_status === 'attending').length;
  const declined = data.filter(guest => guest.rsvp_status === 'declined').length;
  const pending = data.filter(guest => guest.rsvp_status === 'pending').length;
  
  // Count plus ones
  const plusOnes = data.filter(guest => 
    guest.rsvp_status === 'attending' && 
    guest.plus_one && 
    guest.plus_one_name
  ).length;

  const totalAttending = attending + plusOnes;

  return {
    total,
    attending,
    declined,
    pending,
    plusOnes,
    totalAttending,
    responseRate: total > 0 ? Math.round(((attending + declined) / total) * 100) : 0
  };
};

// Send RSVP reminders
export const sendRSVPReminders = async (eventId: string) => {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', eventId)
    .eq('rsvp_status', 'pending');

  if (error) {
    console.error('Error fetching pending RSVPs:', error);
    throw error;
  }

  // In a real app, this would send emails/notifications
  console.log(`Sending RSVP reminders to ${data.length} guests`);
  
  return data;
};

// Import guests from CSV data
export const importGuests = async (eventId: string, guestsData: Array<{
  name: string;
  email: string;
  phone?: string;
  plus_one?: boolean;
  dietary_restrictions?: string;
  notes?: string;
}>) => {
  const guestsToInsert = guestsData.map(guest => ({
    event_id: eventId,
    ...guest,
    rsvp_status: 'pending' as const
  }));

  const { data, error } = await supabase
    .from('guests')
    .insert(guestsToInsert)
    .select();

  if (error) {
    console.error('Error importing guests:', error);
    throw error;
  }

  return data;
};

// Get guests by table assignment
export const getGuestsByTable = async (eventId: string) => {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', eventId)
    .eq('rsvp_status', 'attending')
    .order('table_number', { ascending: true });

  if (error) {
    console.error('Error fetching guests by table:', error);
    throw error;
  }

  // Group by table number
  const guestsByTable = data.reduce((acc, guest) => {
    const tableNumber = guest.table_number || 0;
    if (!acc[tableNumber]) {
      acc[tableNumber] = [];
    }
    acc[tableNumber].push(guest);
    return acc;
  }, {} as Record<number, Guest[]>);

  return guestsByTable;
};