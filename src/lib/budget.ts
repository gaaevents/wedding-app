import { supabase } from './supabase';
import { Database } from '../types/database';

type BudgetItem = Database['public']['Tables']['budget_items']['Row'];
type BudgetItemInsert = Database['public']['Tables']['budget_items']['Insert'];
type BudgetItemUpdate = Database['public']['Tables']['budget_items']['Update'];

// Get all budget items for an event
export const getEventBudget = async (eventId: string) => {
  const { data, error } = await supabase
    .from('budget_items')
    .select('*')
    .eq('event_id', eventId)
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching budget items:', error);
    throw error;
  }

  return data;
};

// Create a new budget item
export const createBudgetItem = async (budgetData: Omit<BudgetItemInsert, 'id'>) => {
  const { data, error } = await supabase
    .from('budget_items')
    .insert([budgetData])
    .select()
    .single();

  if (error) {
    console.error('Error creating budget item:', error);
    throw error;
  }

  return data;
};

// Update a budget item
export const updateBudgetItem = async (budgetId: string, budgetData: BudgetItemUpdate) => {
  const { data, error } = await supabase
    .from('budget_items')
    .update(budgetData)
    .eq('id', budgetId)
    .select()
    .single();

  if (error) {
    console.error('Error updating budget item:', error);
    throw error;
  }

  return data;
};

// Delete a budget item
export const deleteBudgetItem = async (budgetId: string) => {
  const { error } = await supabase
    .from('budget_items')
    .delete()
    .eq('id', budgetId);

  if (error) {
    console.error('Error deleting budget item:', error);
    throw error;
  }

  return true;
};

// Get budget summary
export const getBudgetSummary = async (eventId: string) => {
  const { data, error } = await supabase
    .from('budget_items')
    .select('budgeted, spent')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching budget summary:', error);
    throw error;
  }

  const totalBudgeted = data.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = data.reduce((sum, item) => sum + item.spent, 0);
  const remaining = totalBudgeted - totalSpent;
  const percentageUsed = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  return {
    totalBudgeted,
    totalSpent,
    remaining,
    percentageUsed,
    isOverBudget: totalSpent > totalBudgeted
  };
};

// Update budget item with vendor booking
export const updateBudgetWithBooking = async (eventId: string, category: string, amount: number, vendorName: string) => {
  // Find existing budget item for this category
  const { data: existingItems, error: fetchError } = await supabase
    .from('budget_items')
    .select('*')
    .eq('event_id', eventId)
    .eq('category', category)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching budget item:', fetchError);
    throw fetchError;
  }

  if (existingItems) {
    // Update existing budget item
    const vendors = Array.isArray(existingItems.vendors) ? existingItems.vendors as string[] : [];
    if (!vendors.includes(vendorName)) {
      vendors.push(vendorName);
    }

    const newSpent = existingItems.spent + amount;
    const newRemaining = existingItems.budgeted - newSpent;

    const { data, error } = await supabase
      .from('budget_items')
      .update({
        spent: newSpent,
        remaining: newRemaining,
        vendors
      })
      .eq('id', existingItems.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating budget item:', error);
      throw error;
    }

    return data;
  } else {
    // Create new budget item
    const newBudgetItem = {
      event_id: eventId,
      category,
      budgeted: amount * 1.2, // Set budget 20% higher than first expense
      spent: amount,
      remaining: (amount * 1.2) - amount,
      color: getBudgetCategoryColor(category),
      vendors: [vendorName]
    };

    const { data, error } = await supabase
      .from('budget_items')
      .insert([newBudgetItem])
      .select()
      .single();

    if (error) {
      console.error('Error creating budget item:', error);
      throw error;
    }

    return data;
  }
};

// Get budget category color
const getBudgetCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Venue': 'bg-rose-500',
    'Catering': 'bg-blue-500',
    'Photography': 'bg-green-500',
    'Videography': 'bg-purple-500',
    'Flowers': 'bg-pink-500',
    'Music': 'bg-yellow-500',
    'Transportation': 'bg-indigo-500',
    'Attire': 'bg-red-500',
    'Decorations': 'bg-orange-500',
    'Stationery': 'bg-teal-500'
  };

  return colors[category] || 'bg-gray-500';
};

// Get budget alerts
export const getBudgetAlerts = async (eventId: string) => {
  const { data, error } = await supabase
    .from('budget_items')
    .select('*')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching budget alerts:', error);
    throw error;
  }

  const alerts = [];

  for (const item of data) {
    const percentageUsed = item.budgeted > 0 ? (item.spent / item.budgeted) * 100 : 0;
    
    if (percentageUsed > 100) {
      alerts.push({
        type: 'error' as const,
        category: item.category,
        message: `${item.category} is over budget by $${(item.spent - item.budgeted).toLocaleString()}`,
        percentage: Math.round(percentageUsed)
      });
    } else if (percentageUsed > 90) {
      alerts.push({
        type: 'warning' as const,
        category: item.category,
        message: `${item.category} is at ${Math.round(percentageUsed)}% of budget`,
        percentage: Math.round(percentageUsed)
      });
    }
  }

  return alerts;
};

// Initialize default budget categories
export const initializeDefaultBudget = async (eventId: string, totalBudget: number) => {
  const defaultCategories = [
    { category: 'Venue', percentage: 40, color: 'bg-rose-500' },
    { category: 'Catering', percentage: 30, color: 'bg-blue-500' },
    { category: 'Photography', percentage: 10, color: 'bg-green-500' },
    { category: 'Flowers', percentage: 8, color: 'bg-pink-500' },
    { category: 'Music', percentage: 5, color: 'bg-yellow-500' },
    { category: 'Attire', percentage: 4, color: 'bg-purple-500' },
    { category: 'Transportation', percentage: 2, color: 'bg-indigo-500' },
    { category: 'Miscellaneous', percentage: 1, color: 'bg-gray-500' }
  ];

  const budgetItems = defaultCategories.map(cat => ({
    event_id: eventId,
    category: cat.category,
    budgeted: Math.round((totalBudget * cat.percentage) / 100),
    spent: 0,
    remaining: Math.round((totalBudget * cat.percentage) / 100),
    color: cat.color,
    vendors: []
  }));

  const { data, error } = await supabase
    .from('budget_items')
    .insert(budgetItems)
    .select();

  if (error) {
    console.error('Error initializing budget:', error);
    throw error;
  }

  return data;
};