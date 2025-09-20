import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MapPin, Clock, CheckCircle2, ShoppingCart, DollarSign, Route } from 'lucide-react';

const mockShoppingLists = [
  {
    id: 1,
    name: 'Weekly Groceries',
    items: 12,
    estimatedTotal: 89.50,
    status: 'active',
    stores: ['Walmart', 'Target', 'Whole Foods']
  },
  {
    id: 2,
    name: 'Electronics Shopping',
    items: 3,
    estimatedTotal: 1250.00,
    status: 'completed',
    stores: ['Best Buy', 'Amazon']
  }
];

const mockShoppingItems = [
  {
    id: 1,
    product: 'Organic Bananas',
    quantity: 2,
    unit: 'lbs',
    bestPrice: 2.49,
    bestStore: 'Whole Foods',
    avgPrice: 2.89,
    checked: false
  },
  {
    id: 2,
    product: 'Coca-Cola 12 Pack',
    quantity: 1,
    unit: 'pack',
    bestPrice: 4.99,
    bestStore: 'Target',
    avgPrice: 5.49,
    checked: true
  },
  {
    id: 3,
    product: 'Bread - Whole Wheat',
    quantity: 1,
    unit: 'loaf',
    bestPrice: 2.99,
    bestStore: 'Walmart',
    avgPrice: 3.29,
    checked: false
  }
];

const mockOptimizedRoute = {
  totalDistance: '12.4 miles',
  estimatedTime: '45 minutes',
  totalSavings: 23.50,
  stores: [
    { name: 'Target', items: 3, savings: 8.50, address: '123 Main St' },
    { name: 'Whole Foods', items: 2, savings: 15.00, address: '456 Oak Ave' }
  ]
};

const Planner: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lists');
  const [newItemName, setNewItemName] = useState('');

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
          <Card className="p-4 gradient-card border-0">
            <div className="flex items-center gap-3">
              <Plus className="text-primary" size={24} />
              <div className="flex-1">
                <h3 className="font-semibold">Create New Shopping List</h3>
                <p className="text-sm text-muted-foreground">Start planning your next shopping trip</p>
              </div>
              <Button className="gradient-scan">
                Create
              </Button>
            </div>
          </Card>

          {/* Existing Lists */}
          <div className="space-y-3">
            <h3 className="font-semibold">Your Shopping Lists</h3>
            {mockShoppingLists.map((list) => (
              <Card key={list.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{list.name}</h4>
                      <Badge variant={list.status === 'active' ? 'default' : 'secondary'}>
                        {list.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{list.items} items</span>
                      <span>•</span>
                      <span>{list.stores.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <p className="font-bold text-lg">${list.estimatedTotal}</p>
                    <p className="text-xs text-muted-foreground">Estimated</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="current" className="space-y-4 mt-6">
          {/* Add Item */}
          <Card className="p-4">
            <div className="space-y-3">
              <h3 className="font-semibold">Add New Item</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Search or scan product..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1"
                />
                <Button className="gradient-scan">
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </Card>

          {/* Current List Summary */}
          <Card className="p-4 gradient-success border-0">
            <div className="flex items-center justify-between text-white">
              <div className="space-y-1">
                <h3 className="font-semibold">Weekly Groceries</h3>
                <p className="text-sm opacity-90">12 items • Best savings: $23.50</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">$89.50</p>
                <p className="text-sm opacity-90">vs $113.00 avg</p>
              </div>
            </div>
          </Card>

          {/* Shopping Items */}
          <div className="space-y-3">
            {mockShoppingItems.map((item) => (
              <Card key={item.id} className={`p-4 ${item.checked ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full w-8 h-8 ${item.checked ? 'bg-success text-white' : ''}`}
                  >
                    {item.checked && <CheckCircle2 size={16} />}
                  </Button>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${item.checked ? 'line-through' : ''}`}>
                        {item.product}
                      </h4>
                      <div className="text-right">
                        <p className="font-bold">${item.bestPrice}</p>
                        <p className="text-xs text-muted-foreground line-through">
                          ${item.avgPrice}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{item.quantity} {item.unit}</span>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{item.bestStore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="route" className="space-y-4 mt-6">
          {/* Route Summary */}
          <Card className="p-4 gradient-primary border-0 text-white">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Route size={24} />
                <h3 className="font-semibold">Optimized Route</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{mockOptimizedRoute.totalDistance}</p>
                  <p className="text-sm opacity-90">Total Distance</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{mockOptimizedRoute.estimatedTime}</p>
                  <p className="text-sm opacity-90">Est. Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">${mockOptimizedRoute.totalSavings}</p>
                  <p className="text-sm opacity-90">Total Savings</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Store Stops */}
          <div className="space-y-3">
            <h3 className="font-semibold">Your Route</h3>
            {mockOptimizedRoute.stores.map((store, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{store.name}</h4>
                      <div className="flex items-center gap-1 text-success">
                        <DollarSign size={14} />
                        <span className="font-semibold">${store.savings}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{store.address}</span>
                      </div>
                      <span>{store.items} items</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full gradient-scan">
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
