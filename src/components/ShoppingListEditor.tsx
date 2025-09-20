import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  MapPin,
  CheckCircle2,
  Save
} from 'lucide-react';
import { ShoppingList, ShoppingItem, useShoppingLists } from '@/hooks/useShoppingLists';
import { useCurrency } from '@/hooks/useCurrency';

interface ShoppingListEditorProps {
  list: ShoppingList;
  onBack: () => void;
  onSave: (list: ShoppingList) => void;
}

const ShoppingListEditor: React.FC<ShoppingListEditorProps> = ({ list, onBack, onSave }) => {
  const [editingName, setEditingName] = useState(false);
  const [listName, setListName] = useState(list.name);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  
  const { formatPrice } = useCurrency();
  const { updateList, addItemToList, updateItemInList, removeItemFromList } = useShoppingLists();

  const handleSaveListName = () => {
    updateList(list.id, { name: listName });
    onSave({ ...list, name: listName });
    setEditingName(false);
  };

  const handleAddItem = () => {
    if (newItemName.trim() && newItemPrice) {
      const newItem = {
        product: newItemName.trim(),
        quantity: parseInt(newItemQuantity) || 1,
        unit: 'item',
        bestPrice: parseFloat(newItemPrice),
        bestStore: 'Store',
        avgPrice: parseFloat(newItemPrice) * 1.1,
        checked: false
      };
      
      addItemToList(list.id, newItem);
      setNewItemName('');
      setNewItemQuantity('1');
      setNewItemPrice('');
      setShowAddItem(false);
    }
  };

  const handleToggleCheck = (itemId: string, checked: boolean) => {
    updateItemInList(list.id, itemId, { checked });
  };

  const handleRemoveItem = (itemId: string) => {
    removeItemFromList(list.id, itemId);
  };

  const handleUpdateItemQuantity = (itemId: string, quantity: number) => {
    updateItemInList(list.id, itemId, { quantity });
  };

  return (
    <div className="pb-20 px-4 pt-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="rounded-full"
        >
          <ArrowLeft size={20} />
        </Button>
        
        <div className="flex-1">
          {editingName ? (
            <div className="flex gap-2">
              <Input
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="text-lg font-bold"
                autoFocus
              />
              <Button size="sm" onClick={handleSaveListName}>
                <Check size={16} />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditingName(false)}>
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{listName}</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingName(true)}
              >
                <Edit2 size={16} />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={list.status === 'active' ? 'default' : 'secondary'}>
              {list.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {list.items.length} items
            </span>
          </div>
        </div>

        <Button className="bg-primary-solid text-white">
          <Save size={16} className="mr-2" />
          Saved
        </Button>
      </div>

      {/* List Summary */}
      <Card className="p-4 bg-success-solid border-0 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">{listName}</h3>
            <p className="text-sm opacity-90">
              {list.items.filter(item => !item.checked).length} remaining • 
              {list.items.filter(item => item.checked).length} completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{formatPrice(list.estimatedTotal)}</p>
            <p className="text-sm opacity-90">Estimated total</p>
          </div>
        </div>
      </Card>

      {/* Add New Item */}
      {showAddItem ? (
        <Card className="p-4">
          <div className="space-y-3">
            <h3 className="font-semibold">Add New Item</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Product name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Qty"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(e.target.value)}
              />
            </div>
            <Input
              type="number"
              step="0.01"
              placeholder="Expected price"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddItem} className="bg-primary-solid text-white">
                Add Item
              </Button>
              <Button variant="outline" onClick={() => setShowAddItem(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowAddItem(true)}
        >
          <Plus className="mr-2" size={16} />
          Add New Item
        </Button>
      )}

      {/* Shopping Items */}
      <div className="space-y-3">
        <h3 className="font-semibold">Shopping Items</h3>
        
        {list.items.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No items in this list yet</p>
            <Button 
              className="mt-3 bg-primary-solid text-white"
              onClick={() => setShowAddItem(true)}
            >
              Add Your First Item
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {list.items.map((item) => (
              <Card key={item.id} className={`p-4 ${item.checked ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full w-8 h-8 ${item.checked ? 'bg-success-solid text-white' : ''}`}
                    onClick={() => handleToggleCheck(item.id, !item.checked)}
                  >
                    {item.checked && <CheckCircle2 size={16} />}
                  </Button>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${item.checked ? 'line-through' : ''}`}>
                        {item.product}
                      </h4>
                      <div className="text-right">
                        <p className="font-bold">{formatPrice(item.bestPrice)}</p>
                        <p className="text-xs text-muted-foreground line-through">
                          {formatPrice(item.avgPrice)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 h-6 text-xs"
                          min="1"
                        />
                        <span>{item.unit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          <span>{item.bestStore}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button className="w-full bg-primary-solid text-white">
          <MapPin className="mr-2" size={16} />
          Plan Shopping Route
        </Button>
        <Button variant="outline" className="w-full">
          Share List
        </Button>
      </div>
    </div>
  );
};

export default ShoppingListEditor;