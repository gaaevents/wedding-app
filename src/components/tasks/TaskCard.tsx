import React from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, Edit, Trash2, User } from 'lucide-react';
import { Database } from '../../types/database';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onComplete: () => void;
  onDelete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onComplete, onDelete }) => {
  const dueDate = new Date(task.due_date);
  const today = new Date();
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = !task.completed && daysUntilDue < 0;
  const isDueSoon = !task.completed && daysUntilDue <= 3 && daysUntilDue >= 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    if (task.completed) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (isOverdue) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    if (isDueSoon) {
      return <Clock className="w-5 h-5 text-yellow-500" />;
    }
    return <Calendar className="w-5 h-5 text-blue-500" />;
  };

  const getStatusText = () => {
    if (task.completed) return 'Completed';
    if (isOverdue) return `${Math.abs(daysUntilDue)} days overdue`;
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    return `Due in ${daysUntilDue} days`;
  };

  const getCardBorderColor = () => {
    if (task.completed) return 'border-green-200';
    if (isOverdue) return 'border-red-200';
    if (isDueSoon) return 'border-yellow-200';
    return 'border-gray-200';
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 ${getCardBorderColor()} p-6 hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
            {task.title}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
              {task.priority} priority
            </span>
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {task.category}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!task.completed && (
            <button
              onClick={onComplete}
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              title="Mark as complete"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className={`text-sm mb-4 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`font-medium ${
            task.completed ? 'text-green-600' :
            isOverdue ? 'text-red-600' :
            isDueSoon ? 'text-yellow-600' :
            'text-blue-600'
          }`}>
            {getStatusText()}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-gray-500">
          <User className="w-4 h-4" />
          <span>{task.assignee}</span>
        </div>
      </div>

      {/* Due Date */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Due: {dueDate.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};