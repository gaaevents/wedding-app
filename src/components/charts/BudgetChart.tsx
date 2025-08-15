import React from 'react';
import { BudgetItem } from '../../types';

interface BudgetChartProps {
  budgetItems: BudgetItem[];
}

export const BudgetChart: React.FC<BudgetChartProps> = ({ budgetItems }) => {
  const totalBudgeted = budgetItems.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-800 mb-2">
          ${totalSpent.toLocaleString()} / ${totalBudgeted.toLocaleString()}
        </div>
        <div className="text-gray-600 mb-4">Total Budget Progress</div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-rose-500 to-pink-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((totalSpent / totalBudgeted) * 100, 100)}%` }}
          />
        </div>
        <div className="text-sm text-gray-500 mt-2">
          {Math.round((totalSpent / totalBudgeted) * 100)}% of budget used
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Budget by Category</h4>
        {budgetItems.map((item) => (
          <div key={item.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${item.color}`} />
                <span className="font-medium text-gray-700">{item.category}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-800">
                  ${item.spent.toLocaleString()} / ${item.budgeted.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  ${item.remaining.toLocaleString()} remaining
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${item.color}`}
                style={{ width: `${Math.min((item.spent / item.budgeted) * 100, 100)}%` }}
              />
            </div>
            {item.notes && (
              <div className="text-xs text-gray-500 ml-7">{item.notes}</div>
            )}
          </div>
        ))}
      </div>

      {/* Budget Alerts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 className="font-medium text-yellow-800 mb-2">Budget Alerts</h5>
        <div className="space-y-1">
          {budgetItems
            .filter(item => (item.spent / item.budgeted) > 0.9)
            .map(item => (
              <div key={item.id} className="text-sm text-yellow-700">
                • {item.category} is at {Math.round((item.spent / item.budgeted) * 100)}% of budget
              </div>
            ))}
          {budgetItems.filter(item => (item.spent / item.budgeted) > 0.9).length === 0 && (
            <div className="text-sm text-yellow-700">All categories are within budget limits</div>
          )}
        </div>
      </div>
    </div>
  );
};