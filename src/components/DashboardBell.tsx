import React, { useState } from 'react';
import { Bell, MapPin, Package, DollarSign, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/useLanguage';
import { useCurrency } from '@/hooks/useCurrency';

interface DashboardBellProps {
  onStoreManagerOpen?: () => void;
}

const DashboardBell: React.FC<DashboardBellProps> = ({ onStoreManagerOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  // Mock data - in real app these would come from props or hooks
  const dashboardData = {
    productsScanned: 127,
    moneySaved: 342,
    priceAlerts: 24,
    currentStore: 'Rema 1000 Oslo Sentrum',
    hasActiveAlerts: true
  };

  const handleStoreLocationClick = () => {
    setIsOpen(false);
    if (onStoreManagerOpen) {
      onStoreManagerOpen();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label="Dashboard overview"
        >
          <Bell size={20} />
          {dashboardData.hasActiveAlerts && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {dashboardData.priceAlerts}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 p-0 bg-background border shadow-lg z-50" 
        align="end"
        sideOffset={8}
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            <h3 className="font-semibold">Dashboard Overview</h3>
          </div>
          
          <Separator />
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Package className="text-primary" size={20} />
              <div>
                <p className="text-lg font-bold text-primary">{dashboardData.productsScanned}</p>
                <p className="text-xs text-muted-foreground">{t('home.productsScanned')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <DollarSign className="text-success" size={20} />
              <div>
                <p className="text-lg font-bold text-success">{formatPrice(dashboardData.moneySaved)}</p>
                <p className="text-xs text-muted-foreground">{t('home.moneySaved')}</p>
              </div>
            </div>
          </div>
          
          {/* Price Alerts */}
          <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-orange-600" size={20} />
              <div>
                <p className="text-lg font-bold text-orange-600">{dashboardData.priceAlerts}</p>
                <p className="text-xs text-muted-foreground">{t('home.priceAlerts')}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">
              Active
            </Badge>
          </div>
          
          <Separator />
          
          {/* Current Store Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="text-primary" size={16} />
              <h4 className="font-medium text-sm">{t('home.storeLocation')}</h4>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">{dashboardData.currentStore}</p>
                <p className="text-xs text-muted-foreground">{t('home.storeLocationDesc')}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleStoreLocationClick}
                className="text-xs px-2 py-1 h-auto"
              >
                <Plus size={12} className="mr-1" />
                {t('home.setStore')}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DashboardBell;