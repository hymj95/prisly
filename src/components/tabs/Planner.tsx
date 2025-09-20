import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MapPin, Clock, CheckCircle2, ShoppingCart, DollarSign, Route } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useShoppingLists } from '@/hooks/useShoppingLists';
import ShoppingListEditor from '../ShoppingListEditor';

const Planner: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lists');
  const [newListName, setNewListName] = useState('');
  const [editingList, setEditingList] = useState<any>(null);
  const { formatPrice } = useCurrency();
  const { lists, addList } = useShoppingLists();

  const handleCreateList = () => {
    if (newListName.trim()) {
      addList(newListName.trim());
      setNewListName('');
    }
  };

  if (editingList) {
    return (
      <ShoppingListEditor
        list={editingList}
        onBack={() => setEditingList(null)}
        onSave={(updatedList) => {
          setEditingList(updatedList);
        }}
      />
    );
  }

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gradient">Shopping Planner</h1>
        <p className="text-muted-foreground">Plan your grocery trips and save money</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lists">My Lists</TabsTrigger>
          <TabsTrigger value="current">Current List</TabsTrigger>
          <TabsTrigger value="route">Route Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="lists" className="space-y-4 mt-6">
          {/* Create New List */}
          <Card className="p-4 bg-card-subtle border-0">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Plus className="text-primary" size={24} />
                <div className="flex-1">
                  <h3 className="font-semibold">Create New Shopping List</h3>
                  <p className="text-sm text-muted-foreground">Start planning your next shopping trip</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter list name..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleCreateList}
                  className="bg-primary-solid text-white"
                >
                  Create
                </Button>
              </div>
            </div>
          </Card>

          {/* Existing Lists */}
          <div className="space-y-3">
            <h3 className="font-semibold">Your Shopping Lists</h3>
            {lists.map((list) => (
              <Card 
                key={list.id} 
                className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                onClick={() => setEditingList(list)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{list.name}</h4>
                      <Badge variant={list.status === 'active' ? 'default' : 'secondary'}>
                        {list.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{list.items.length} items</span>
                      <span>•</span>
                      <span>{list.stores.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <p className="font-bold text-lg">{formatPrice(list.estimatedTotal)}</p>
                    <p className="text-xs text-muted-foreground">Estimated</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="current" className="space-y-4 mt-6">
          <Card className="p-6 text-center">
            <ShoppingCart className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="font-semibold mb-2">Select a Shopping List</h3>
            <p className="text-muted-foreground mb-4">
              Choose a list from the "My Lists" tab to view and edit items
            </p>
            <Button 
              onClick={() => setActiveTab('lists')}
              className="bg-primary-solid text-white"
            >
              View My Lists
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="route" className="space-y-4 mt-6">
          {/* Route Summary */}
          <Card className="p-4 bg-primary-solid border-0 text-white">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Route size={24} />
                <h3 className="font-semibold">Optimized Route</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">12.4 miles</p>
                  <p className="text-sm opacity-90">Total Distance</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">45 minutes</p>
                  <p className="text-sm opacity-90">Est. Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{formatPrice(23.50)}</p>
                  <p className="text-sm opacity-90">Total Savings</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Store Stops */}
          <div className="space-y-3">
            <h3 className="font-semibold">Your Route</h3>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Target</h4>
                    <div className="flex items-center gap-1 text-success">
                      <DollarSign size={14} />
                      <span className="font-semibold">{formatPrice(8.50)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span>123 Main St</span>
                    </div>
                    <span>3 items</span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Whole Foods</h4>
                    <div className="flex items-center gap-1 text-success">
                      <DollarSign size={14} />
                      <span className="font-semibold">{formatPrice(15.00)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span>456 Oak Ave</span>
                    </div>
                    <span>2 items</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full bg-primary-solid text-white">
              <MapPin className="mr-2" size={16} />
              Open in Maps
            </Button>
            <Button variant="outline" className="w-full">
              Start Shopping Trip
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Planner;
