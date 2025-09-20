import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  MapPin,
  CheckCircle2,
  Save,
  ShoppingBag,
  Package
} from 'lucide-react';
import { ShoppingList, ShoppingItem, useShoppingLists } from '@/hooks/useShoppingLists';
import { useCurrency } from '@/hooks/useCurrency';
import { useLanguage } from '@/hooks/useLanguage';

interface ShoppingListEditorProps {
  list: ShoppingList;
  onBack: () => void;
  onSave: (list: ShoppingList) => void;
}

const ShoppingListEditor: React.FC<ShoppingListEditorProps> = ({ list, onBack, onSave }) => {
  const [editingName, setEditingName] = useState(false);
  const [listName, setListName] = useState(list.name);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingUnit, setEditingUnit] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('item');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  
  const unitOptions = [
    { value: 'item', label: 'Item(s)' },
    { value: 'lbs', label: 'Pounds' },
    { value: 'kg', label: 'Kilograms' },
    { value: 'oz', label: 'Ounces' },
    { value: 'g', label: 'Grams' },
    { value: 'pack', label: 'Pack(s)' },
    { value: 'box', label: 'Box(es)' },
    { value: 'bottle', label: 'Bottle(s)' },
    { value: 'can', label: 'Can(s)' },
    { value: 'bag', label: 'Bag(s)' },
    { value: 'dozen', label: 'Dozen' },
    { value: 'gallon', label: 'Gallon(s)' },
    { value: 'liter', label: 'Liter(s)' },
    { value: 'ml', label: 'Milliliters' }
  ];
  
  const { formatPrice } = useCurrency();
  const { updateList, addItemToList, updateItemInList, removeItemFromList } = useShoppingLists();
  const { t } = useLanguage();

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
        unit: newItemUnit,
        bestPrice: parseFloat(newItemPrice),
        bestStore: 'Store',
        avgPrice: parseFloat(newItemPrice) * 1.1,
        checked: false
      };
      
      addItemToList(list.id, newItem);
      setNewItemName('');
      setNewItemQuantity('1');
      setNewItemUnit('item');
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
    if (quantity > 0) {
      updateItemInList(list.id, itemId, { quantity });
    }
  };

  const handleUpdateItemUnit = (itemId: string, unit: string) => {
    updateItemInList(list.id, itemId, { unit });
    setEditingUnit(null);
  };

  const incrementQuantity = (itemId: string, currentQuantity: number) => {
    const increment = currentQuantity >= 1 ? 1 : 0.25; // Smaller increments for fractional amounts
    handleUpdateItemQuantity(itemId, currentQuantity + increment);
  };

  const decrementQuantity = (itemId: string, currentQuantity: number) => {
    const decrement = currentQuantity > 1 ? 1 : 0.25; // Smaller decrements for fractional amounts
    const newQuantity = Math.max(0.25, currentQuantity - decrement); // Minimum 0.25
    handleUpdateItemQuantity(itemId, newQuantity);
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
              {list.items.length} {t('planner.items')}
            </span>
          </div>
        </div>

        <Button className="bg-primary-solid text-white">
          <Save size={16} className="mr-2" />
          {t('editor.saved')}
        </Button>
      </div>

      {/* List Summary */}
      <Card className="p-4 bg-gradient-to-r from-success via-success-solid to-success border-0 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold flex items-center gap-2">
              <ShoppingBag size={18} />
              {listName}
            </h3>
            <p className="text-sm opacity-90">
              {list.items.filter(item => !item.checked).length} {t('editor.remaining')} • 
              {list.items.filter(item => item.checked).length} {t('editor.completed')}
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${list.items.length > 0 ? (list.items.filter(item => item.checked).length / list.items.length) * 100 : 0}%` 
                }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{formatPrice(list.estimatedTotal)}</p>
            <p className="text-sm opacity-90">{t('editor.estimatedTotal')}</p>
            <p className="text-xs opacity-75">
              {Math.round(list.items.length > 0 ? (list.items.filter(item => item.checked).length / list.items.length) * 100 : 0)}% Complete
            </p>
          </div>
        </div>
      </Card>

      {/* Add New Item */}
      {showAddItem ? (
        <Card className="p-4 border-2 border-dashed border-primary/20 bg-primary/5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="text-primary" size={20} />
              <h3 className="font-semibold">{t('editor.addNewItem')}</h3>
            </div>
            
            <div className="space-y-3">
              <Input
                placeholder={t('editor.productName')}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="text-base"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Quantity</label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    min="0.01"
                    step="0.01"
                    className="text-base"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Unit</label>
                  <Select value={newItemUnit} onValueChange={setNewItemUnit}>
                    <SelectTrigger className="bg-background border z-50">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50 max-h-60 overflow-y-auto">
                      {unitOptions.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Expected Price</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="text-base"
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAddItem} className="bg-primary-solid text-white flex-1">
                <Plus className="mr-2" size={16} />
                {t('editor.addItem')}
              </Button>
              <Button variant="outline" onClick={() => setShowAddItem(false)}>
                {t('common.cancel')}
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
          {t('editor.addNewItem')}
        </Button>
      )}

      {/* Shopping Items */}
      <div className="space-y-3">
        <h3 className="font-semibold">{t('editor.shoppingItems')}</h3>
        
        {list.items.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">{t('editor.noItems')}</p>
            <Button 
              className="mt-3 bg-primary-solid text-white"
              onClick={() => setShowAddItem(true)}
            >
              {t('editor.addFirstItem')}
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {list.items.map((item) => (
              <Card 
                key={item.id} 
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  item.checked 
                    ? 'opacity-60 bg-success/5 border-success/20' 
                    : 'hover:shadow-md hover:scale-[1.01] border-l-4 border-l-primary/20 hover:border-l-primary'
                }`}
                onClick={() => handleToggleCheck(item.id, !item.checked)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        item.checked
                          ? 'bg-success text-white border-success'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {item.checked && <CheckCircle2 size={16} />}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-medium text-base ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                          {item.product}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={item.checked ? 'secondary' : 'outline'} 
                            className="text-xs"
                          >
                            {item.quantity} {item.unit}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin size={10} />
                            <span>{item.bestStore}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <p className={`font-bold ${item.checked ? 'text-muted-foreground' : ''}`}>
                          {formatPrice(item.bestPrice * item.quantity)}
                        </p>
                        <p className="text-xs text-muted-foreground line-through">
                          {formatPrice(item.avgPrice * item.quantity)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.bestPrice)} each
                        </p>
                      </div>
                    </div>
                    
                    {/* Quantity and Unit Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              decrementQuantity(item.id, item.quantity);
                            }}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              e.stopPropagation();
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value) && value > 0) {
                                handleUpdateItemQuantity(item.id, value);
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-16 h-7 text-xs text-center"
                            min="0.01"
                            step="0.01"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              incrementQuantity(item.id, item.quantity);
                            }}
                          >
                            +
                          </Button>
                        </div>
                        
                        {/* Unit Selector */}
                        <div className="relative">
                          {editingUnit === item.id ? (
                            <Select 
                              value={item.unit} 
                              onValueChange={(value) => handleUpdateItemUnit(item.id, value)}
                              onOpenChange={(open) => !open && setEditingUnit(null)}
                            >
                              <SelectTrigger className="h-7 w-20 text-xs bg-background border z-50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background border shadow-lg z-50">
                                {unitOptions.map((unit) => (
                                  <SelectItem key={unit.value} value={unit.value} className="text-xs">
                                    {unit.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingUnit(item.id);
                              }}
                            >
                              {item.unit}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 h-7 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(item.id);
                        }}
                      >
                        <Trash2 size={12} />
                      </Button>
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
          {t('editor.planRoute')}
        </Button>
        <Button variant="outline" className="w-full">
          {t('editor.shareList')}
        </Button>
      </div>
    </div>
  );
};

export default ShoppingListEditor;