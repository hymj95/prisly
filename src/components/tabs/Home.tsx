import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, TrendingUp, MapPin, Clock, Zap, Flame, Star, Target, Plus } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useLanguage } from '@/hooks/useLanguage';
import PrislyLogo from '../PrislyLogo';
import ProductDetail from '../ProductDetail';
import DealsSection from '../DealsSection';
import StoreLocationManager from '../StoreLocationManager';

interface HomeProps {
  onNavigateToDeals?: () => void;
  onCategorySelect?: (category: string) => void;
  onNavigateToScan?: () => void;
}

const mockRecentScans = [
  {
    id: 1,
    product: 'Coca-Cola 12 Pack',
    brand: 'Coca-Cola',
    price: 159.90,
    store: 'Rema 1000',
    location: 'Oslo Sentrum',
    trend: 'down',
    trendPercentage: 8,
    avgPrice: 174.90,
    timeAgo: '2h ago'
  },
  {
    id: 2,
    product: 'iPhone 15 Pro',
    brand: 'Apple',
    price: 12999.00,
    store: 'Elkjøp',
    location: 'Bergen Xhibition',
    trend: 'up',
    trendPercentage: 3,
    avgPrice: 13499.00,
    timeAgo: '5h ago'
  },
  {
    id: 3,
    product: 'Økologiske Bananer',
    brand: 'Kiwi',
    price: 34.90,
    store: 'Kiwi',
    location: 'Trondheim Midtbyen',
    trend: 'down',
    trendPercentage: 15,
    avgPrice: 39.90,
    timeAgo: '1d ago'
  }
];

const mockHotDeals = [
  {
    id: 1,
    product: 'Samsung 65" 4K Smart TV',
    brand: 'Samsung',
    originalPrice: 899.99,
    salePrice: 599.99,
    discountPercentage: 33,
    store: 'Best Buy',
    location: 'Electronics Plaza',
    distance: 2.3,
    timeLeft: '2 days left',
    category: 'Electronics'
  },
  {
    id: 2,
    product: 'Nike Air Max 270',
    brand: 'Nike',
    originalPrice: 150.00,
    salePrice: 89.99,
    discountPercentage: 40,
    store: 'Foot Locker',
    location: 'City Center',
    distance: 1.8,
    timeLeft: '1 day left',
    category: 'Footwear'
  }
];

const mockFlashDeals = [
  {
    id: 3,
    product: 'Instant Pot Duo 7-in-1',
    brand: 'Instant Pot',
    originalPrice: 1499.00,
    salePrice: 749.00,
    discountPercentage: 50,
    store: 'Elkjøp',
    location: 'Stavanger Kvadrat',
    distance: 0,
    timeLeft: '4 timer igjen',
    category: 'Kitchen'
  },
  {
    id: 4,
    product: 'Økologisk Olivenolje',
    brand: 'Jacobs Utvalgte',
    originalPrice: 189.00,
    salePrice: 119.00,
    discountPercentage: 37,
    store: 'Meny',
    location: 'Drammen Storgate',
    distance: 3.2,
    timeLeft: '6 timer igjen',
    category: 'Grocery'
  }
];

const mockLocalDeals = [
  {
    id: 5,
    product: 'Fresh Atlantic Salmon',
    brand: 'Wild Catch',
    originalPrice: 18.99,
    salePrice: 12.99,
    discountPercentage: 32,
    store: 'Whole Foods',
    location: 'Downtown',
    distance: 0.8,
    timeLeft: 'Today only',
    category: 'Seafood'
  },
  {
    id: 6,
    product: 'Artisan Sourdough Bread',
    brand: 'Local Bakery',
    originalPrice: 6.99,
    salePrice: 4.49,
    discountPercentage: 36,
    store: 'Corner Bakery',
    location: 'Main Street',
    distance: 0.5,
    timeLeft: '2 hours left',
    category: 'Bakery'
  }
];

const Home: React.FC<HomeProps> = ({ onNavigateToDeals, onCategorySelect, onNavigateToScan }) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showStoreManager, setShowStoreManager] = useState(false);
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const handleDealClick = (deal: any) => {
    setSelectedProduct(deal);
  };

  const handleViewAllDeals = () => {
    if (onNavigateToDeals) {
      onNavigateToDeals();
    }
  };

  const handleStoreSelect = (store: any) => {
    console.log('Selected store:', store);
    setShowStoreManager(false);
  };

  if (showStoreManager) {
    return (
      <div className="pb-20 px-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="icon" onClick={() => setShowStoreManager(false)}>
            <MapPin size={20} />
          </Button>
          <h2 className="text-xl font-bold">{t('store.storeLocation')}</h2>
        </div>
        <StoreLocationManager onStoreSelect={handleStoreSelect} />
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)} 
      />
    );
  }
  return (
    <div className="pb-20 px-6 pt-8 space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <PrislyLogo size="xl" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary">{t('home.welcome')}</h1>
          <p className="text-lg text-muted-foreground">{t('home.tagline')}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center bg-background border-minimal rounded-card shadow-card">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">127</p>
            <p className="text-xs text-muted-foreground">{t('home.productsScanned')}</p>
          </div>
        </Card>
        <Card className="p-4 text-center bg-background border-minimal rounded-card shadow-card">
          <div className="space-y-1">
            <p className="text-xl font-bold text-success">{formatPrice(342)}</p>
            <p className="text-xs text-muted-foreground">{t('home.moneySaved')}</p>
          </div>
        </Card>
        <Card className="p-4 text-center bg-background border-minimal rounded-card shadow-card">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">24</p>
            <p className="text-xs text-muted-foreground">{t('home.priceAlerts')}</p>
          </div>
        </Card>
      </div>

      {/* Store Location Banner */}
      <Card className="p-6 bg-primary/5 border-primary/20 rounded-card">
        <div className="flex items-center gap-4">
          <MapPin className="text-primary" size={24} />
          <div className="flex-1">
          <h3 className="font-semibold text-base">{t('home.storeLocation')}</h3>
            <p className="text-sm text-muted-foreground">{t('home.storeLocationDesc')}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowStoreManager(true)}
            className="font-medium"
          >
            <Plus size={16} className="mr-2" />
            {t('home.setStore')}
          </Button>
        </div>
      </Card>

      {/* Quick Scan Button */}
      <Card className="p-6 bg-primary-solid border-0 rounded-card">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <Zap className="text-white" size={28} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-white text-base">{t('home.quickScan')}</h3>
            <p className="text-sm text-white/90">{t('home.quickScanDesc')}</p>
          </div>
          <Button 
            onClick={() => onNavigateToScan && onNavigateToScan()}
            className="flex-shrink-0 bg-white text-primary hover:bg-white/95 font-medium px-6"
          >
            {t('home.scan')}
          </Button>
        </div>
      </Card>

      {/* Hot Deals Section */}
      <DealsSection 
        title={t('home.hotDeals')}
        icon={<Flame className="text-primary" size={20} />}
        deals={mockHotDeals}
        onDealClick={handleDealClick}
        onViewAll={handleViewAllDeals}
        onCategoryClick={onCategorySelect}
      />

      {/* Flash Deals Section */}
      <DealsSection 
        title={t('home.flashDeals')}
        icon={<Zap className="text-secondary" size={20} />}
        deals={mockFlashDeals}
        onDealClick={handleDealClick}
        onViewAll={handleViewAllDeals}
        onCategoryClick={onCategorySelect}
      />

      {/* Local Deals Section */}
      <DealsSection 
        title={t('home.localDeals')}
        icon={<Target className="text-accent-foreground" size={20} />}
        deals={mockLocalDeals}
        onDealClick={handleDealClick}
        onViewAll={handleViewAllDeals}
        onCategoryClick={onCategorySelect}
      />

      {/* Recent Scans */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t('home.recentScans')}</h2>
          <Button variant="outline" size="sm" className="font-medium">{t('home.viewAll')}</Button>
        </div>

        <div className="space-y-4">
          {mockRecentScans.map((scan) => (
            <Card 
              key={scan.id} 
              className="p-6 cursor-pointer hover:shadow-minimalist transition-all duration-300 hover:scale-[1.01] rounded-card border-minimal"
              onClick={() => setSelectedProduct(scan)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-base">{scan.product}</h3>
                    <Badge variant="outline" className="text-xs font-medium">{scan.brand}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      <span>{scan.store} • {scan.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>{scan.timeAgo}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xl">{formatPrice(scan.price)}</span>
                    {scan.trend === 'down' ? (
                      <div className="flex items-center gap-1 text-success">
                        <TrendingDown size={18} />
                        <span className="text-sm font-medium">{scan.trendPercentage}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-destructive">
                        <TrendingUp size={18} />
                        <span className="text-sm font-medium">{scan.trendPercentage}%</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{t('home.avg')}: {formatPrice(scan.avgPrice)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;