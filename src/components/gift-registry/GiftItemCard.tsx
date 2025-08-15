import React from 'react';
import { ExternalLink, Edit, Trash2, Gift, Check, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Database } from '../../types/database';

type GiftRegistryItem = Database['public']['Tables']['gift_registry_items']['Row'];

interface GiftItemCardProps {
  giftItem: GiftRegistryItem;
  onEdit: () => void;
  onDelete: () => void;
  onPurchaseUpdate: (quantity: number) => void;
  isPublicView?: boolean;
}

export const GiftItemCard: React.FC<GiftItemCardProps> = ({ 
  giftItem, 
  onEdit, 
  onDelete, 
  onPurchaseUpdate,
  isPublicView = false 
}) => {
  const remainingQuantity = giftItem.quantity - giftItem.purchased;
  const isFullyPurchased = remainingQuantity === 0;
  const progressPercentage = (giftItem.purchased / giftItem.quantity) * 100;

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition-shadow ${
      isFullyPurchased ? 'border-green-200 bg-green-50' : 'border-gray-200'
    }`}>
      {/* Image */}
      {giftItem.image && (
        <div className="mb-4">
          <img
            src={giftItem.image}
            alt={giftItem.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 ${
            isFullyPurchased ? 'text-green-700 line-through' : 'text-gray-800'
          }`}>
            {giftItem.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2">{giftItem.description}</p>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
            {giftItem.category}
          </span>
        </div>
        
        {!isPublicView && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit item"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Price and Quantity */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-gray-800">
            ${giftItem.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600">
            {giftItem.purchased}/{giftItem.quantity} purchased
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isFullyPurchased ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {isFullyPurchased ? (
          <div className="flex items-center space-x-2 text-green-600">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Fully purchased!</span>
          </div>
        ) : (
          <span className="text-sm text-gray-600">
            {remainingQuantity} remaining
          </span>
        )}
      </div>

      {/* Retailer */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Available at:</span>
          <span className="font-medium text-gray-800">{giftItem.retailer}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        {giftItem.url && (
          <a
            href={giftItem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Item</span>
          </a>
        )}
        
        {!isFullyPurchased && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPurchaseUpdate(-1)}
              disabled={giftItem.purchased === 0}
              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPurchaseUpdate(1)}
              disabled={remainingQuantity === 0}
              className="p-2 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Purchase Button for Public View */}
      {isPublicView && !isFullyPurchased && (
        <button
          onClick={() => onPurchaseUpdate(1)}
          className="w-full mt-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Mark as Purchased</span>
        </button>
      )}
    </div>
  );
};