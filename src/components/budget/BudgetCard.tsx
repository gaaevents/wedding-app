import React from 'react';
import { DollarSign, Edit, Trash2, TrendingUp, TrendingDown, Building } from 'lucide-react';
import { Database } from '../../types/database';

type BudgetItem = Database['public']['Tables']['budget_items']['Row'];

interface BudgetCardProps {
  budgetItem: BudgetItem;
  onEdit: () => void;
  onDelete: () => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budgetItem, onEdit, onDelete }) => {
  const percentageUsed = budgetItem.budgeted > 0 ? (budgetItem.spent / budgetItem.budgeted) * 100 : 0;
  const isOverBudget = budgetItem.spent > budgetItem.budgeted;
  const isNearBudget = percentageUsed > 90 && !isOverBudget;
  
  const vendors = Array.isArray(budgetItem.vendors) ? budgetItem.vendors as string[] : [];

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-red-500';
    if (isNearBudget) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCardBorderColor = () => {
    if (isOverBudget) return 'border-red-200';
    if (isNearBudget) return 'border-yellow-200';
    return 'border-gray-200';
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 ${getCardBorderColor()} p-6 hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{budgetItem.category}</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${budgetItem.color}`} />
            <span className="text-sm text-gray-600">
              {Math.round(percentageUsed)}% used
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit budget item"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete budget item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Budget Progress</span>
          <span className={`text-sm font-medium ${
            isOverBudget ? 'text-red-600' : isNearBudget ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {Math.round(percentageUsed)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          />
        </div>
      </div>

      {/* Budget Amounts */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-500">Budgeted</div>
          <div className="font-semibold text-gray-800">${budgetItem.budgeted.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Spent</div>
          <div className="font-semibold text-gray-800">${budgetItem.spent.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Remaining</div>
          <div className={`font-semibold ${budgetItem.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(budgetItem.remaining).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Vendors */}
      {vendors.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span>Vendors</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {vendors.map((vendor, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {vendor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {budgetItem.notes && (
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-1">Notes</div>
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {budgetItem.notes}
          </div>
        </div>
      )}

      {/* Status Indicator */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isOverBudget ? (
              <>
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600 font-medium">Over Budget</span>
              </>
            ) : isNearBudget ? (
              <>
                <TrendingUp className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-600 font-medium">Near Limit</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">On Track</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {budgetItem.remaining >= 0 ? 'Under' : 'Over'} by ${Math.abs(budgetItem.remaining).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};