import React, { useState, useEffect } from 'react';
import { X, DollarSign, Tag, Palette, Building, Save, AlertCircle } from 'lucide-react';
import { Database } from '../../types/database';

type BudgetItem = Database['public']['Tables']['budget_items']['Row'];

interface BudgetFormProps {
  budgetItem?: BudgetItem | null;
  eventId: string;
  onClose: () => void;
  onSave: (budgetData: any) => void;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ budgetItem, eventId, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category: '',
    budgeted: 0,
    spent: 0,
    color: 'bg-blue-500',
    vendors: [] as string[],
    notes: ''
  });

  const [newVendor, setNewVendor] = useState('');

  const categories = [
    'Venue', 'Catering', 'Photography', 'Videography', 'Flowers', 'Music',
    'Transportation', 'Attire', 'Decorations', 'Invitations', 'Beauty',
    'Gifts', 'Honeymoon', 'Legal', 'Insurance', 'Miscellaneous'
  ];

  const colors = [
    { value: 'bg-rose-500', label: 'Rose' },
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-yellow-500', label: 'Yellow' },
    { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-indigo-500', label: 'Indigo' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-orange-500', label: 'Orange' },
    { value: 'bg-teal-500', label: 'Teal' },
    { value: 'bg-gray-500', label: 'Gray' },
    { value: 'bg-emerald-500', label: 'Emerald' }
  ];

  useEffect(() => {
    if (budgetItem) {
      setFormData({
        category: budgetItem.category,
        budgeted: budgetItem.budgeted,
        spent: budgetItem.spent,
        color: budgetItem.color,
        vendors: Array.isArray(budgetItem.vendors) ? budgetItem.vendors as string[] : [],
        notes: budgetItem.notes || ''
      });
    }
  }, [budgetItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const remaining = formData.budgeted - formData.spent;
      await onSave({
        ...formData,
        remaining
      });
    } catch (err) {
      console.error('Error saving budget item:', err);
      setError(err instanceof Error ? err.message : 'Failed to save budget item');
    } finally {
      setLoading(false);
    }
  };

  const addVendor = () => {
    if (newVendor.trim() && !formData.vendors.includes(newVendor.trim())) {
      setFormData({
        ...formData,
        vendors: [...formData.vendors, newVendor.trim()]
      });
      setNewVendor('');
    }
  };

  const removeVendor = (index: number) => {
    setFormData({
      ...formData,
      vendors: formData.vendors.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {budgetItem ? 'Edit Budget Category' : 'Add Budget Category'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Category and Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color *
              </label>
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  required
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  {colors.map(color => (
                    <option key={color.value} value={color.value}>{color.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Budget Amounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budgeted Amount ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  min="0"
                  step="50"
                  required
                  value={formData.budgeted}
                  onChange={(e) => setFormData({ ...formData, budgeted: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Spent ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={formData.spent}
                  onChange={(e) => setFormData({ ...formData, spent: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Remaining Amount Display */}
          {(formData.budgeted > 0 || formData.spent > 0) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Remaining Amount:</span>
                <span className={`text-lg font-bold ${
                  (formData.budgeted - formData.spent) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${Math.abs(formData.budgeted - formData.spent).toLocaleString()}
                  {(formData.budgeted - formData.spent) < 0 && ' over budget'}
                </span>
              </div>
            </div>
          )}

          {/* Vendors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Associated Vendors
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVendor())}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Add vendor name..."
                  />
                </div>
                <button
                  type="button"
                  onClick={addVendor}
                  className="px-4 py-3 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  Add
                </button>
              </div>

              {formData.vendors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.vendors.map((vendor, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg"
                    >
                      <span className="text-gray-700">{vendor}</span>
                      <button
                        type="button"
                        onClick={() => removeVendor(index)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Any additional notes about this budget category..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : (budgetItem ? 'Update Category' : 'Add Category')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};