import React from 'react';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { Task } from '../../types';

interface TaskTimelineProps {
  tasks: Task[];
}

export const TaskTimeline: React.FC<TaskTimelineProps> = ({ tasks }) => {
  const sortedTasks = tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (task: Task) => {
    if (task.completed) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    } else if (daysUntilDue <= 7) {
      return <Clock className="w-5 h-5 text-yellow-500" />;
    } else {
      return <Calendar className="w-5 h-5 text-blue-500" />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const days = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  return (
    <div className="space-y-4">
      {sortedTasks.map((task, index) => (
        <div
          key={task.id}
          className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${
            task.completed
              ? 'border-green-200 bg-green-50'
              : task.priority === 'high'
              ? 'border-red-200 bg-red-50'
              : task.priority === 'medium'
              ? 'border-yellow-200 bg-yellow-50'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          {/* Timeline connector */}
          {index < sortedTasks.length - 1 && (
            <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300" />
          )}
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(task)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className={`font-medium ${
                    task.completed ? 'text-green-700 line-through' : 'text-gray-800'
                  }`}>
                    {task.title}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                    {task.category}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4 text-gray-500">
                  <span>Assigned to: {task.assignee}</span>
                  <span>{getDaysUntilDue(task.dueDate)}</span>
                </div>
                
                {!task.completed && (
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {sortedTasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No tasks yet. Add your first task to get started!</p>
        </div>
      )}
    </div>
  );
};