import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, TrendingUp, MapPin, Clock, Zap } from 'lucide-react';

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
  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gradient">Welcome to PriceTracker</h1>
        <p className="text-muted-foreground">Find the best deals and track prices in real-time</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center gradient-card border-0">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">127</p>
            <p className="text-xs text-muted-foreground">Products Scanned</p>
          </div>
        </Card>
        <Card className="p-4 text-center gradient-card border-0">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-success">$342</p>
            <p className="text-xs text-muted-foreground">Money Saved</p>
          </div>
        </Card>
        <Card className="p-4 text-center gradient-card border-0">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-accent">24</p>
            <p className="text-xs text-muted-foreground">Price Alerts</p>
          </div>
        </Card>
      </div>

      {/* Quick Scan Button */}
      <Card className="p-3 gradient-scan border-0">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Zap className="text-white" size={24} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-white text-sm">Quick Scan</h3>
            <p className="text-xs text-white/80">Get instant price comparison</p>
          </div>
          <Button variant="secondary" size="sm" className="flex-shrink-0">
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
            <Card key={scan.id} className="p-4">
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
                    <span className="font-bold text-lg">${scan.price}</span>
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
                  <p className="text-xs text-muted-foreground">Avg: ${scan.avgPrice}</p>
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