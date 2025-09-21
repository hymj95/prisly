import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MapPin, Clock, CheckCircle2, ShoppingCart, DollarSign, Route } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useShoppingLists } from '@/hooks/useShoppingLists';
import { useLanguage } from '@/hooks/useLanguage';
import ShoppingListEditor from '../ShoppingListEditor';

const Planner: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lists');
  const [newListName, setNewListName] = useState('');
  const [editingList, setEditingList] = useState<any>(null);
  const { formatPrice } = useCurrency();
  const { lists, addList } = useShoppingLists();
  const { t } = useLanguage();

  const handleCreateList = () => {
    if (newListName.trim()) {
      addList(newListName.trim());
      setNewListName('');
    }
  };

  if (editingList) {
    // Find the current version of the list from the hook to ensure we have the latest data
    const currentList = lists.find(list => list.id === editingList.id) || editingList;
    
    return (
      <ShoppingListEditor
        list={currentList}
        onBack={() => setEditingList(null)}
        onSave={(updatedList) => {
          // No need to update local state since the hook manages the data
          // Just keep the editing mode active
        }}
      />
    );
  }

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gradient">{t('planner.title')}</h1>
        <p className="text-muted-foreground">{t('planner.subtitle')}</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lists">{t('planner.myLists')}</TabsTrigger>
          <TabsTrigger value="current">{t('planner.currentList')}</TabsTrigger>
          <TabsTrigger value="route">{t('planner.routePlan')}</TabsTrigger>
        </TabsList>

        <TabsContent value="lists" className="space-y-4 mt-6">
          {/* Create New List */}
          <Card className="p-4 bg-card-subtle border-0">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Plus className="text-primary" size={24} />
                <div className="flex-1">
                  <h3 className="font-semibold">{t('planner.createNewList')}</h3>
                  <p className="text-sm text-muted-foreground">{t('planner.startPlanning')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={t('planner.enterListName')}
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleCreateList}
                  className="bg-primary-solid text-white"
                >
                  {t('planner.create')}
                </Button>
              </div>
            </div>
          </Card>

          {/* Existing Lists */}
          <div className="space-y-3">
            <h3 className="font-semibold">{t('planner.yourShoppingLists')}</h3>
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
                      <span>{list.items.length} {t('planner.items')}</span>
                      <span>•</span>
                      <span>{list.stores.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <p className="font-bold text-lg">{formatPrice(list.estimatedTotal)}</p>
                    <p className="text-xs text-muted-foreground">{t('planner.estimated')}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="current" className="space-y-4 mt-6">
          <Card className="p-6 text-center">
            <ShoppingCart className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="font-semibold mb-2">{t('planner.selectList')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('planner.chooseList')}
            </p>
            <Button 
              onClick={() => setActiveTab('lists')}
              className="bg-primary-solid text-white"
            >
              {t('planner.viewMyLists')}
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="route" className="space-y-4 mt-6">
          {/* Route Summary */}
          <Card className="p-4 bg-primary-solid border-0 text-white">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Route size={24} />
                  <h3 className="font-semibold">{t('planner.optimizedRoute')}</h3>
                </div>
              
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">12.4 miles</p>
                    <p className="text-sm opacity-90">{t('planner.totalDistance')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">45 minutes</p>
                    <p className="text-sm opacity-90">{t('planner.estTime')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatPrice(23.50)}</p>
                    <p className="text-sm opacity-90">{t('planner.totalSavings')}</p>
                  </div>
                </div>
            </div>
          </Card>

          {/* Store Stops */}
          <div className="space-y-3">
            <h3 className="font-semibold">{t('planner.yourRoute')}</h3>
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
                    <span>3 {t('planner.items')}</span>
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
                    <span>2 {t('planner.items')}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full bg-primary-solid text-white">
              <MapPin className="mr-2" size={16} />
              {t('planner.openInMaps')}
            </Button>
            <Button variant="outline" className="w-full">
              {t('planner.startTrip')}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Planner;
