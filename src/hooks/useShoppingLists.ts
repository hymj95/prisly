import { useState, useEffect } from 'react';

export interface ShoppingItem {
  id: string;
  product: string;
  quantity: number;
  unit: string;
  bestPrice: number;
  bestStore: string;
  bestStoreLocation?: string;
  avgPrice: number;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  estimatedTotal: number;
  status: 'active' | 'completed';
  stores: string[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'prisly-shopping-lists';

const defaultLists: ShoppingList[] = [
  {
    id: '1',
    name: 'Weekly Groceries',
    items: [
      {
        id: '1',
        product: 'Organic Bananas',
        quantity: 2,
        unit: 'lbs',
        bestPrice: 2.49,
        bestStore: 'Whole Foods',
        avgPrice: 2.89,
        checked: false
      },
      {
        id: '2',
        product: 'Coca-Cola 12 Pack',
        quantity: 1,
        unit: 'pack',
        bestPrice: 4.99,
        bestStore: 'Target',
        avgPrice: 5.49,
        checked: true
      },
      {
        id: '3',
        product: 'Bread - Whole Wheat',
        quantity: 1,
        unit: 'loaf',
        bestPrice: 2.99,
        bestStore: 'Walmart',
        avgPrice: 3.29,
        checked: false
      }
    ],
    estimatedTotal: 89.50,
    status: 'active',
    stores: ['Walmart', 'Target', 'Whole Foods'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Electronics Shopping',
    items: [],
    estimatedTotal: 1250.00,
    status: 'completed',
    stores: ['Best Buy', 'Amazon'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  }
];

export const useShoppingLists = () => {
  const [lists, setLists] = useState<ShoppingList[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error('Error parsing stored shopping lists:', error);
        }
      }
    }
    return defaultLists;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    }
  }, [lists]);

  const updateList = (listId: string, updates: Partial<ShoppingList>) => {
    setLists(prev => prev.map(list => 
      list.id === listId 
        ? { ...list, ...updates, updatedAt: new Date().toISOString() }
        : list
    ));
  };

  const addList = (name: string) => {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      items: [],
      estimatedTotal: 0,
      status: 'active',
      stores: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setLists(prev => [newList, ...prev]);
    return newList.id;
  };

  const deleteList = (listId: string) => {
    setLists(prev => prev.filter(list => list.id !== listId));
  };

  const addItemToList = (listId: string, item: Omit<ShoppingItem, 'id'>) => {
    console.log('useShoppingLists addItemToList called with:', listId, item);
    
    const newItem: ShoppingItem = {
      ...item,
      id: Date.now().toString()
    };

    setLists(prev => {
      console.log('Current lists before update:', prev.map(l => ({ id: l.id, name: l.name, itemCount: l.items.length })));
      
      const updated = prev.map(list => {
        if (list.id === listId) {
          const updatedItems = [...list.items, newItem];
          const estimatedTotal = updatedItems.reduce((sum, item) => sum + (item.bestPrice * item.quantity), 0);
          const stores = Array.from(new Set(updatedItems.map(item => item.bestStore)));
          
          const updatedList = {
            ...list,
            items: updatedItems,
            estimatedTotal,
            stores,
            updatedAt: new Date().toISOString()
          };
          
          console.log('Updated list:', updatedList.id, 'new item count:', updatedList.items.length);
          return updatedList;
        }
        return list;
      });
      
      console.log('Lists after update:', updated.map(l => ({ id: l.id, name: l.name, itemCount: l.items.length })));
      return updated;
    });
  };

  const updateItemInList = (listId: string, itemId: string, updates: Partial<ShoppingItem>) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        const updatedItems = list.items.map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        );
        const estimatedTotal = updatedItems.reduce((sum, item) => sum + (item.bestPrice * item.quantity), 0);
        
        return {
          ...list,
          items: updatedItems,
          estimatedTotal,
          updatedAt: new Date().toISOString()
        };
      }
      return list;
    }));
  };

  const removeItemFromList = (listId: string, itemId: string) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        const updatedItems = list.items.filter(item => item.id !== itemId);
        const estimatedTotal = updatedItems.reduce((sum, item) => sum + (item.bestPrice * item.quantity), 0);
        const stores = Array.from(new Set(updatedItems.map(item => item.bestStore)));
        
        return {
          ...list,
          items: updatedItems,
          estimatedTotal,
          stores,
          updatedAt: new Date().toISOString()
        };
      }
      return list;
    }));
  };

  return {
    lists,
    updateList,
    addList,
    deleteList,
    addItemToList,
    updateItemInList,
    removeItemFromList
  };
};