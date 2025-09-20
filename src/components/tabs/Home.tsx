import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, TrendingUp, MapPin, Clock, Zap, Flame, Star, Target, Settings } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import PrislyLogo from '../PrislyLogo';
import ProductDetail from '../ProductDetail';
import DealsSection from '../DealsSection';
import LocationSelector from '../LocationSelector';

const mockRecentScans = [
  {
    id: 1,
    product: 'Coca-Cola 12 Pack',
    brand: 'Coca-Cola',
    price: 4.99,
    store: 'Target',
    location: 'Downtown Mall',
    trend: 'down',
    trendPercentage: 8,
    avgPrice: 5.49,
    timeAgo: '2h ago'
  },
  {
    id: 2,
    product: 'iPhone 15 Pro',
    brand: 'Apple',
    price: 999.99,
    store: 'Best Buy',
    location: 'Tech Center',
    trend: 'up',
    trendPercentage: 3,
    avgPrice: 1049.99,
    timeAgo: '5h ago'
  },
  {
    id: 3,
    product: 'Organic Bananas',
    brand: 'Whole Foods',
    price: 2.49,
    store: 'Whole Foods',
    location: 'Main Street',
    trend: 'down',
    trendPercentage: 15,
    avgPrice: 2.89,
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
    originalPrice: 99.99,
    salePrice: 49.99,
    discountPercentage: 50,
    store: 'Amazon',
    location: 'Online',
    distance: 0,
    timeLeft: '4 hours left',
    category: 'Kitchen'
  },
  {
    id: 4,
    product: 'Organic Extra Virgin Olive Oil',
    brand: 'Trader Joe\'s',
    originalPrice: 12.99,
    salePrice: 7.99,
    discountPercentage: 38,
    store: 'Trader Joe\'s',
    location: 'Westside',
    distance: 3.2,
    timeLeft: '6 hours left',
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

const Home: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string; radius: number } | null>(null);
  const { formatPrice } = useCurrency();

  const handleLocationSelect = (location: { lat: number; lng: number; address: string; radius: number }) => {
    setUserLocation(location);
    setShowLocationSelector(false);
  };

  const handleDealClick = (deal: any) => {
    setSelectedProduct(deal);
  };

  if (selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)} 
      />
    );
  }

  if (showLocationSelector) {
    return (
      <div className="pb-20 px-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="icon" onClick={() => setShowLocationSelector(false)}>
            <MapPin size={20} />
          </Button>
          <h2 className="text-xl font-bold">Set Your Location</h2>
        </div>
        <LocationSelector 
          onLocationSelect={handleLocationSelect}
          currentLocation={userLocation}
        />
      </div>
    );
  }
  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <PrislyLogo size="lg" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary">Welcome to Prisly</h1>
          <p className="text-muted-foreground">Your smart grocery shopping companion</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center bg-card-subtle border-0">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">127</p>
            <p className="text-xs text-muted-foreground">Products Scanned</p>
          </div>
        </Card>
        <Card className="p-4 text-center bg-card-subtle border-0">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-success">{formatPrice(342)}</p>
            <p className="text-xs text-muted-foreground">Money Saved</p>
          </div>
        </Card>
        <Card className="p-4 text-center bg-card-subtle border-0">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">24</p>
            <p className="text-xs text-muted-foreground">Price Alerts</p>
          </div>
        </Card>
      </div>

      {/* Location Banner */}
      {!userLocation && (
        <Card className="p-4 bg-primary/10 border-primary/20">
          <div className="flex items-center gap-4">
            <MapPin className="text-primary" size={20} />
            <div className="flex-1">
              <h3 className="font-medium text-sm">Set Your Shopping Area</h3>
              <p className="text-xs text-muted-foreground">Get personalized deals from stores near you</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowLocationSelector(true)}
            >
              <Settings size={14} className="mr-1" />
              Set Area
            </Button>
          </div>
        </Card>
      )}

      {userLocation && (
        <Card className="p-4 bg-success/10 border-success/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="text-success" size={20} />
              <div>
                <p className="font-medium text-sm">Shopping in {userLocation.radius}km radius</p>
                <p className="text-xs text-muted-foreground">{userLocation.address}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowLocationSelector(true)}
            >
              Change
            </Button>
          </div>
        </Card>
      )}

      {/* Hot Deals Section */}
      <DealsSection 
        title="🔥 Hot Deals"
        icon={<Flame className="text-red-500" size={20} />}
        deals={mockHotDeals}
        onDealClick={handleDealClick}
      />

      {/* Flash Deals Section */}
      <DealsSection 
        title="⚡ Flash Deals"
        icon={<Zap className="text-yellow-500" size={20} />}
        deals={mockFlashDeals}
        onDealClick={handleDealClick}
      />

      {/* Local Deals Section */}
      <DealsSection 
        title="📍 Local Deals"
        icon={<Target className="text-blue-500" size={20} />}
        deals={mockLocalDeals}
        onDealClick={handleDealClick}
      />

      {/* Quick Scan Button */}
      <Card className="p-4 bg-forest-solid border-0">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <Zap className="text-white" size={24} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-white text-sm">Quick Scan</h3>
            <p className="text-xs text-white/80">Get instant price comparison</p>
          </div>
          <Button className="flex-shrink-0 bg-white text-primary hover:bg-white/90">
            Scan
          </Button>
        </div>
      </Card>

      {/* Recent Scans */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Scans</h2>
          <Button variant="outline" size="sm">View All</Button>
        </div>

        <div className="space-y-3">
          {mockRecentScans.map((scan) => (
            <Card 
              key={scan.id} 
              className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
              onClick={() => setSelectedProduct(scan)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{scan.product}</h3>
                    <Badge variant="outline" className="text-xs">{scan.brand}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span>{scan.store} • {scan.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{scan.timeAgo}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{formatPrice(scan.price)}</span>
                    {scan.trend === 'down' ? (
                      <div className="flex items-center gap-1 text-success">
                        <TrendingDown size={16} />
                        <span className="text-xs">{scan.trendPercentage}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-destructive">
                        <TrendingUp size={16} />
                        <span className="text-xs">{scan.trendPercentage}%</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Avg: {formatPrice(scan.avgPrice)}</p>
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