import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, BarChart3, Calendar, MapPin, Filter } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useLanguage } from '@/hooks/useLanguage';

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
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

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
        <h1 className="text-2xl font-bold text-gradient">{t('trends.title')}</h1>
        <p className="text-muted-foreground">{t('trends.subtitle')}</p>
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
          <TabsTrigger value="products">{t('trends.trendingProducts')}</TabsTrigger>
          <TabsTrigger value="categories">{t('trends.categories')}</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4 mt-6">
          {/* Filters */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{t('trends.hotProducts')}</h3>
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" />
              {t('trends.filter')}
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
                      <span>{product.volume} {t('trends.priceReports')}</span>
                      <span>•</span>
                      <span>Last {timeRange}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <MiniChart data={product.chartData} trend={product.trend as 'up' | 'down'} />
                      <div className="text-right">
                        <p className="font-bold">{formatPrice(product.currentPrice)}</p>
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
            {t('trends.viewMore')}
          </Button>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{t('trends.categoryOverview')}</h3>
            <Button variant="outline" size="sm">
              <BarChart3 size={16} className="mr-2" />
              {t('trends.detailedView')}
            </Button>
          </div>

          <div className="space-y-3">
            {mockCategories.map((category, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {category.products} {t('trends.productsTracked')}
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
                    <p className="text-xs text-muted-foreground">{t('trends.avgChange')}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Market Insights */}
      <Card className="p-4 bg-card-subtle border-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-primary" size={20} />
              <h3 className="font-semibold">{t('trends.freshInsights')}</h3>
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