import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, TrendingUp, AlertTriangle, PieChart, BarChart3 } from 'lucide-react';
import { getEventBudget, createBudgetItem, updateBudgetItem, deleteBudgetItem, getBudgetSummary, getBudgetAlerts } from '../../lib/budget';
import { BudgetForm } from './BudgetForm';
import { BudgetCard } from './BudgetCard';
import { BudgetChart } from '../charts/BudgetChart';
import { Database } from '../../types/database';

type BudgetItem = Database['public']['Tables']['budget_items']['Row'];

interface BudgetManagerProps {
  eventId: string;
  eventTitle: string;
  totalBudget: number;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({ eventId, eventTitle, totalBudget }) => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [summary, setSummary] = useState({
    totalBudgeted: 0,
    totalSpent: 0,
    remaining: 0,
    percentageUsed: 0,
    isOverBudget: false
  });
  const [alerts, setAlerts] = useState<Array<{
    type: 'error' | 'warning';
    category: string;
    message: string;
    percentage: number;
  }>>([]);

  useEffect(() => {
    loadBudgetData();
  }, [eventId]);

  const loadBudgetData = async () => {
    try {
      setLoading(true);
      const [items, summaryData, alertsData] = await Promise.all([
        getEventBudget(eventId),
        getBudgetSummary(eventId),
        getBudgetAlerts(eventId)
      ]);
      
      setBudgetItems(items);
      setSummary(summaryData);
      setAlerts(alertsData);
    } catch (err) {
      console.error('Error loading budget data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item: BudgetItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSaveItem = async (itemData: any) => {
    try {
      if (editingItem) {
        const updatedItem = await updateBudgetItem(editingItem.id, itemData);
        setBudgetItems(budgetItems.map(item => item.id === updatedItem.id ? updatedItem : item));
      } else {
        const newItem = await createBudgetItem({ ...itemData, event_id: eventId });
        setBudgetItems([...budgetItems, newItem]);
      }
      setShowForm(false);
      setEditingItem(null);
      loadBudgetData(); // Reload to update summary and alerts
    } catch (err) {
      console.error('Error saving budget item:', err);
      setError(err instanceof Error ? err.message : 'Failed to save budget item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this budget item?')) return;

    try {
      await deleteBudgetItem(itemId);
      setBudgetItems(budgetItems.filter(item => item.id !== itemId));
      loadBudgetData(); // Reload to update summary and alerts
    } catch (err) {
      console.error('Error deleting budget item:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete budget item');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading budget...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Budget Management</h2>
          <p className="text-gray-600">{eventTitle}</p>
        </div>
        <button
          onClick={handleCreateItem}
          className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Budget</p>
              <p className="text-2xl font-bold text-gray-800">${summary.totalBudgeted.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-gray-800">${summary.totalSpent.toLocaleString()}</p>
              <p className="text-sm text-red-600">{summary.percentageUsed}% used</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Remaining</p>
              <p className={`text-2xl font-bold ${summary.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(summary.remaining).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {summary.remaining >= 0 ? 'Under budget' : 'Over budget'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              summary.remaining >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <DollarSign className={`w-6 h-6 ${summary.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Budget Alerts</p>
              <p className="text-2xl font-bold text-gray-800">{alerts.length}</p>
              <p className="text-sm text-orange-600">
                {alerts.filter(a => a.type === 'error').length} critical
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Budget Alerts</span>
          </h3>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  alert.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{alert.message}</span>
                  <span className="text-sm">{alert.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Budget Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Budget Items */}
        <div className="lg:col-span-2">
          {budgetItems.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Budget Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgetItems.map((item) => (
                  <BudgetCard
                    key={item.id}
                    budgetItem={item}
                    onEdit={() => handleEditItem(item)}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No budget categories yet</h3>
              <p className="text-gray-500 mb-6">
                Start organizing your wedding budget by creating your first category
              </p>
              <button
                onClick={handleCreateItem}
                className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200"
              >
                Create First Category
              </button>
            </div>
          )}
        </div>

        {/* Budget Chart */}
        <div className="lg:col-span-1">
          {budgetItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Budget Overview</span>
              </h3>
              <BudgetChart budgetItems={budgetItems} />
            </div>
          )}
        </div>
      </div>

      {/* Budget Form Modal */}
      {showForm && (
        <BudgetForm
          budgetItem={editingItem}
          eventId={eventId}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
};