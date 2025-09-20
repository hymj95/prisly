import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, BarChart3, Calendar, MapPin, Filter } from 'lucide-react';

const mockTrendingProducts = [
  {
    id: 1,
    product: 'iPhone 15 Pro',
    category: 'Electronics',
    currentPrice: 999.99,
    trend: 'down',
    change: -50,
    changePercent: -4.8,
    chartData: [1050, 1020, 1010, 999.99],
    volume: 1250
  },
  {
    id: 2,
    product: 'PlayStation 5',
    category: 'Gaming',
    currentPrice: 499.99,
    trend: 'up',
    change: 30,
    changePercent: 6.4,
    chartData: [470, 485, 490, 499.99],
    volume: 890
  },
  {
    id: 3,
    product: 'Organic Milk 1L',
    category: 'Groceries',
    currentPrice: 3.49,
    trend: 'down',
    change: -0.20,
    changePercent: -5.4,
    chartData: [3.69, 3.59, 3.55, 3.49],
    volume: 2100
  }
];

const mockCategories = [
  { name: 'Electronics', trend: 'down', products: 145, avgChange: -2.3 },
  { name: 'Groceries', trend: 'up', products: 890, avgChange: 1.8 },
  { name: 'Fashion', trend: 'down', products: 320, avgChange: -4.1 },
  { name: 'Home & Garden', trend: 'up', products: 255, avgChange: 3.2 }
];

const Trends: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [timeRange, setTimeRange] = useState('7d');

  const MiniChart = ({ data, trend }: { data: number[], trend: 'up' | 'down' }) => (
    <div className="w-20 h-8 relative">
      <svg className="w-full h-full" viewBox="0 0 80 32">
        <polyline
          fill="none"
          stroke={trend === 'up' ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
          strokeWidth="2"
          points={data.map((value, index) => {
            const x = (index / (data.length - 1)) * 80;
            const y = 32 - ((value - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * 32;
            return `${x},${y}`;
          }).join(' ')}
        />
      </svg>
    </div>
  );

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gradient">Price Trends</h1>
        <p className="text-muted-foreground">Track market movements and find fresh opportunities</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center">
        <div className="flex bg-muted rounded-lg p-1">
          {['24h', '7d', '30d', '3m'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? 'gradient-scan text-white' : ''}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Trending Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4 mt-6">
          {/* Filters */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Hot Products</h3>
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
          </div>

          {/* Product List */}
          <div className="space-y-3">
            {mockTrendingProducts.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{product.product}</h4>
                      <Badge variant="outline" className="text-xs">{product.category}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{product.volume} price reports</span>
                      <span>•</span>
                      <span>Last {timeRange}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <MiniChart data={product.chartData} trend={product.trend as 'up' | 'down'} />
                      <div className="text-right">
                        <p className="font-bold">${product.currentPrice}</p>
                        <div className={`flex items-center gap-1 text-sm ${
                          product.trend === 'up' ? 'text-success' : 'text-destructive'
                        }`}>
                          {product.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          <span>{product.changePercent > 0 ? '+' : ''}{product.changePercent}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* View More */}
          <Button variant="outline" className="w-full">
            View More Products
          </Button>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Category Overview</h3>
            <Button variant="outline" size="sm">
              <BarChart3 size={16} className="mr-2" />
              Detailed View
            </Button>
          </div>

          <div className="space-y-3">
            {mockCategories.map((category, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {category.products} products tracked
                    </p>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className={`flex items-center gap-2 ${
                      category.trend === 'up' ? 'text-success' : 'text-destructive'
                    }`}>
                      {category.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span className="font-semibold">
                        {category.avgChange > 0 ? '+' : ''}{category.avgChange}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Avg change</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Market Insights */}
      <Card className="p-4 gradient-card border-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-primary" size={20} />
            <h3 className="font-semibold">Fresh Market Insights</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              • Fresh produce prices dropped 3.2% this week at farmer's markets
            </p>
            <p className="text-muted-foreground">
              • Organic items show 12% savings compared to conventional stores
            </p>
            <p className="text-muted-foreground">
              • Best shopping time: Early morning for freshest selection & deals
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Trends;