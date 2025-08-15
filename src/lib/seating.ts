import { supabase } from './supabase';
import { Database } from '../types/database';

type SeatingPlan = Database['public']['Tables']['seating_plans']['Row'];
type SeatingPlanInsert = Database['public']['Tables']['seating_plans']['Insert'];
type SeatingPlanUpdate = Database['public']['Tables']['seating_plans']['Update'];

// Get all seating plans for an event
export const getEventSeatingPlans = async (eventId: string) => {
  const { data, error } = await supabase
    .from('seating_plans')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching seating plans:', error);
    throw error;
  }

  return data;
};

// Create a new seating plan
export const createSeatingPlan = async (planData: Omit<SeatingPlanInsert, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('seating_plans')
    .insert([planData])
    .select()
    .single();

  if (error) {
    console.error('Error creating seating plan:', error);
    throw error;
  }

  return data;
};

// Update a seating plan
export const updateSeatingPlan = async (planId: string, planData: SeatingPlanUpdate) => {
  const { data, error } = await supabase
    .from('seating_plans')
    .update(planData)
    .eq('id', planId)
    .select()
    .single();

  if (error) {
    console.error('Error updating seating plan:', error);
    throw error;
  }

  return data;
};

// Delete a seating plan
export const deleteSeatingPlan = async (planId: string) => {
  const { error } = await supabase
    .from('seating_plans')
    .delete()
    .eq('id', planId);

  if (error) {
    console.error('Error deleting seating plan:', error);
    throw error;
  }

  return true;
};

// Auto-assign guests to tables
export const autoAssignGuests = async (planId: string, guests: any[]) => {
  // This is a simplified auto-assignment algorithm
  // In a real app, you might want more sophisticated logic
  
  const { data: plan, error: planError } = await supabase
    .from('seating_plans')
    .select('*')
    .eq('id', planId)
    .single();

  if (planError) {
    console.error('Error fetching seating plan:', planError);
    throw planError;
  }

  const tables = Array.isArray(plan.tables) ? plan.tables as any[] : [];
  const unassignedGuests = guests.filter(guest => !guest.table_number);
  
  let currentTableIndex = 0;
  let currentTableCapacity = tables[0]?.seats || 8;
  let currentTableOccupancy = 0;

  for (const guest of unassignedGuests) {
    // Check if current table has space
    const seatsNeeded = guest.plus_one && guest.plus_one_name ? 2 : 1;
    
    if (currentTableOccupancy + seatsNeeded > currentTableCapacity) {
      // Move to next table
      currentTableIndex++;
      if (currentTableIndex >= tables.length) {
        // No more tables available
        break;
      }
      currentTableCapacity = tables[currentTableIndex]?.seats || 8;
      currentTableOccupancy = 0;
    }

    // Assign guest to current table
    const tableNumber = tables[currentTableIndex]?.number;
    if (tableNumber) {
      await supabase
        .from('guests')
        .update({ table_number: tableNumber })
        .eq('id', guest.id);
      
      currentTableOccupancy += seatsNeeded;
    }
  }

  return true;
};

// Get seating statistics
export const getSeatingStats = async (eventId: string) => {
  const [plansData, guestsData] = await Promise.all([
    getEventSeatingPlans(eventId),
    supabase.from('guests').select('*').eq('event_id', eventId).eq('rsvp_status', 'attending')
  ]);

  if (guestsData.error) {
    console.error('Error fetching guests for seating stats:', guestsData.error);
    throw guestsData.error;
  }

  const totalGuests = guestsData.data.length;
  const assignedGuests = guestsData.data.filter(g => g.table_number).length;
  const unassignedGuests = totalGuests - assignedGuests;

  return {
    totalPlans: plansData.length,
    totalGuests,
    assignedGuests,
    unassignedGuests,
    assignmentRate: totalGuests > 0 ? Math.round((assignedGuests / totalGuests) * 100) : 0
  };
};