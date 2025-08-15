import React, { useState, useEffect } from 'react';
import { Plus, Gift, Search, Filter, ExternalLink, Check, ShoppingCart } from 'lucide-react';
import { getEventGiftRegistry, createGiftItem, updateGiftItem, deleteGiftItem } from '../../lib/giftRegistry';
import { GiftItemForm } from './GiftItemForm';
import { GiftItemCard } from './GiftItemCard';
import { Database } from '../../types/database';

type GiftRegistryItem = Database['public']['Tables']['gift_registry_items']['Row'];

interface GiftRegistryManagerProps {
  eventId: string;
  eventTitle: string;
}

export const GiftRegistryManager: React.FC<GiftRegistryManagerProps> = ({ eventId, eventTitle }) => {
  const [giftItems, setGiftItems] = useState<GiftRegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GiftRegistryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    'Kitchen & Dining',
    'Home Decor',
    'Bedroom & Bath',
    'Electronics',
    'Outdoor & Garden',
    'Travel',
    'Experience',
    'Cash Fund',
    'Other'
  ];

  useEffect(() => {
    loadGiftRegistry();
  }, [eventId]);

  const loadGiftRegistry = async () => {
    try {
      setLoading(true);
      const data = await getEventGiftRegistry(eventId);
      setGiftItems(data);
    } catch (err) {
      console.error('Error loading gift registry:', err);
      setError(err instanceof Error ? err.message : 'Failed to load gift registry');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item: GiftRegistryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSaveItem = async (itemData: any) => {
    try {
      if (editingItem) {
        const updatedItem = await updateGiftItem(editingItem.id, itemData);
        setGiftItems(giftItems.map(item => item.id === updatedItem.id ? updatedItem : item));
      } else {
        const newItem = await createGiftItem({ ...itemData, event_id: eventId });
        setGiftItems([...giftItems, newItem]);
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error saving gift item:', err);
      setError(err instanceof Error ? err.message : 'Failed to save gift item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this item from your registry?')) return;

    try {
      await deleteGiftItem(itemId);
      setGiftItems(giftItems.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error deleting gift item:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove gift item');
    }
  };

  const handlePurchaseUpdate = async (itemId: string, purchasedQuantity: number) => {
    try {
      const item = giftItems.find(i => i.id === itemId);
      if (!item) return;

      const newPurchased = Math.min(item.purchased + purchasedQuantity, item.quantity);
      const updatedItem = await updateGiftItem(itemId, { purchased: newPurchased });
      setGiftItems(giftItems.map(i => i.id === itemId ? updatedItem : i));
    } catch (err) {
      console.error('Error updating purchase:', err);
      setError(err instanceof Error ? err.message : 'Failed to update purchase');
    }
  };

  const getFilteredItems = () => {
    return giftItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.retailer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const filteredItems = getFilteredItems();
  const totalValue = giftItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const purchasedValue = giftItems.reduce((sum, item) => sum + (item.price * item.purchased), 0);
  const completionRate = totalValue > 0 ? Math.round((purchasedValue / totalValue) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gift registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gift Registry</h2>
          <p className="text-gray-600">{eventTitle}</p>
        </div>
        <button
          onClick={handleCreateItem}
          className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Gift Item</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Items</p>
              <p className="text-2xl font-bold text-gray-800">{giftItems.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Registry Value</p>
              <p className="text-2xl font-bold text-gray-800">${totalValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Purchased</p>
              <p className="text-2xl font-bold text-gray-800">${purchasedValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completion</p>
              <p className="text-2xl font-bold text-gray-800">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-rose-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Registry Progress</span>
          <span className="text-sm text-gray-500">{completionRate}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-rose-500 to-pink-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Search and Filters */}
      {giftItems.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search gift items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Gift Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <GiftItemCard
              key={item.id}
              giftItem={item}
              onEdit={() => handleEditItem(item)}
              onDelete={() => handleDeleteItem(item.id)}
              onPurchaseUpdate={(quantity) => handlePurchaseUpdate(item.id, quantity)}
            />
          ))}
        </div>
      ) : giftItems.length === 0 ? (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No gift items yet</h3>
          <p className="text-gray-500 mb-6">
            Start building your gift registry by adding items you'd love to receive
          </p>
          <button
            onClick={handleCreateItem}
            className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200"
          >
            Add First Gift Item
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No items match your search</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Gift Item Form Modal */}
      {showForm && (
        <GiftItemForm
          giftItem={editingItem}
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