import { supabase } from './supabase';
import { Database } from '../types/database';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

// Get all tasks for an event
export const getEventTasks = async (eventId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('event_id', eventId)
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  return data;
};

// Get all tasks for current user's events
export const getUserTasks = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      events!inner (
        title,
        date,
        venue
      )
    `)
    .eq('events.created_by', user.id)
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching user tasks:', error);
    throw error;
  }

  return data;
};

// Create a new task
export const createTask = async (taskData: Omit<TaskInsert, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([taskData])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return data;
};

// Update a task
export const updateTask = async (taskId: string, taskData: TaskUpdate) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(taskData)
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  return data;
};

// Delete a task
export const deleteTask = async (taskId: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }

  return true;
};

// Mark task as completed
export const completeTask = async (taskId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ 
      completed: true,
      completed_at: new Date().toISOString()
    })
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    console.error('Error completing task:', error);
    throw error;
  }

  return data;
};

// Get overdue tasks
export const getOverdueTasks = async (eventId?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  let query = supabase
    .from('tasks')
    .select(`
      *,
      events!inner (
        title,
        created_by
      )
    `)
    .eq('events.created_by', user.id)
    .eq('completed', false)
    .lt('due_date', new Date().toISOString().split('T')[0]);

  if (eventId) {
    query = query.eq('event_id', eventId);
  }

  const { data, error } = await query.order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching overdue tasks:', error);
    throw error;
  }

  return data;
};

// Get upcoming tasks (next 7 days)
export const getUpcomingTasks = async (eventId?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  let query = supabase
    .from('tasks')
    .select(`
      *,
      events!inner (
        title,
        created_by
      )
    `)
    .eq('events.created_by', user.id)
    .eq('completed', false)
    .gte('due_date', today.toISOString().split('T')[0])
    .lte('due_date', nextWeek.toISOString().split('T')[0]);

  if (eventId) {
    query = query.eq('event_id', eventId);
  }

  const { data, error } = await query.order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching upcoming tasks:', error);
    throw error;
  }

  return data;
};

// Get task statistics
export const getTaskStats = async (eventId?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  let query = supabase
    .from('tasks')
    .select(`
      completed,
      events!inner (
        created_by
      )
    `)
    .eq('events.created_by', user.id);

  if (eventId) {
    query = query.eq('event_id', eventId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching task stats:', error);
    throw error;
  }

  const total = data.length;
  const completed = data.filter(task => task.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    completionRate
  };
};