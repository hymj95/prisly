import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, TrendingUp, MapPin, Clock, Zap } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import PrislyLogo from '../PrislyLogo';
import ProductDetail from '../ProductDetail';

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

const Home: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { formatPrice } = useCurrency();

  if (selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)} 
      />
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
            <p className="text-2xl font-bold text-secondary">24</p>
            <p className="text-xs text-muted-foreground">Price Alerts</p>
          </div>
        </Card>
      </div>

      {/* Quick Scan Button */}
      <Card className="p-4 bg-accent-solid border-0">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <Zap className="text-foreground" size={24} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-foreground text-sm">Quick Scan</h3>
            <p className="text-xs text-muted-foreground">Get instant price comparison</p>
          </div>
          <Button className="flex-shrink-0 bg-primary-solid text-primary-foreground hover:bg-primary-hover">
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