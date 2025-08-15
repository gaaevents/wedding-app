import React, { useState, useEffect } from 'react';
import { X, Users, Save, AlertCircle } from 'lucide-react';
import { Database } from '../../types/database';

type SeatingPlan = Database['public']['Tables']['seating_plans']['Row'];

interface SeatingPlanFormProps {
  seatingPlan?: SeatingPlan | null;
  eventId: string;
  onClose: () => void;
  onSave: (planData: any) => void;
}

export const SeatingPlanForm: React.FC<SeatingPlanFormProps> = ({ 
  seatingPlan, 
  eventId, 
  onClose, 
  onSave 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    layout: 'mixed' as 'round' | 'rectangular' | 'mixed',
    tables: [] as any[]
  });

  useEffect(() => {
    if (seatingPlan) {
      setFormData({
        name: seatingPlan.name,
        layout: seatingPlan.layout as 'round' | 'rectangular' | 'mixed',
        tables: Array.isArray(seatingPlan.tables) ? seatingPlan.tables as any[] : []
      });
    }
  }, [seatingPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
    } catch (err) {
      console.error('Error saving seating plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to save seating plan');
    } finally {
      setLoading(false);
    }
  };

  const addTable = () => {
    const newTable = {
      id: Date.now().toString(),
      number: formData.tables.length + 1,
      seats: 8,
      shape: formData.layout === 'round' ? 'round' : 'rectangular',
      position: { x: 100 + (formData.tables.length * 150), y: 100 },
      guests: []
    };

    setFormData({
      ...formData,
      tables: [...formData.tables, newTable]
    });
  };

  const removeTable = (tableId: string) => {
    setFormData({
      ...formData,
      tables: formData.tables.filter(table => table.id !== tableId)
    });
  };

  const updateTable = (tableId: string, updates: any) => {
    setFormData({
      ...formData,
      tables: formData.tables.map(table => 
        table.id === tableId ? { ...table, ...updates } : table
      )
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {seatingPlan ? 'Edit Seating Plan' : 'Create Seating Plan'}
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

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="e.g., Reception Seating"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Table Layout *
              </label>
              <select
                required
                value={formData.layout}
                onChange={(e) => setFormData({ ...formData, layout: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="round">Round Tables</option>
                <option value="rectangular">Rectangular Tables</option>
                <option value="mixed">Mixed Layout</option>
              </select>
            </div>
          </div>

          {/* Tables Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Tables</h3>
              <button
                type="button"
                onClick={addTable}
                className="bg-rose-50 text-rose-700 px-4 py-2 rounded-lg hover:bg-rose-100 transition-colors"
              >
                Add Table
              </button>
            </div>

            {formData.tables.length > 0 ? (
              <div className="space-y-4">
                {formData.tables.map((table) => (
                  <div
                    key={table.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Table Number
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={table.number}
                          onChange={(e) => updateTable(table.id, { number: parseInt(e.target.value) || 1 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Seats
                        </label>
                        <input
                          type="number"
                          min="2"
                          max="20"
                          value={table.seats}
                          onChange={(e) => updateTable(table.id, { seats: parseInt(e.target.value) || 8 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Shape
                        </label>
                        <select
                          value={table.shape}
                          onChange={(e) => updateTable(table.id, { shape: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        >
                          <option value="round">Round</option>
                          <option value="rectangular">Rectangular</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeTable(table.id)}
                          className="w-full bg-red-50 text-red-700 py-2 px-3 rounded hover:bg-red-100 transition-colors text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No tables added yet. Click "Add Table" to get started.</p>
              </div>
            )}
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
              <span>{loading ? 'Saving...' : (seatingPlan ? 'Update Plan' : 'Create Plan')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};