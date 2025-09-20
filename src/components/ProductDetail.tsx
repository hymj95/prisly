import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/hooks/useCurrency';
import { 
  ArrowLeft, 
  TrendingDown, 
  TrendingUp, 
  MapPin, 
  Clock, 
  BarChart3,
  Star,
  Heart,
  Share2,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface ProductDetailProps {
  product: any;
  onBack: () => void;
}

const mockPriceHistory = [
  { date: '2024-01-15', price: 5.99, store: 'Walmart' },
  { date: '2024-01-20', price: 5.49, store: 'Target' },
  { date: '2024-01-25', price: 4.99, store: 'Target' },
  { date: '2024-01-30', price: 5.29, store: 'Kroger' },
  { date: '2024-02-05', price: 4.99, store: 'Target' },
];

const mockStoreComparison = [
  { store: 'Target', location: 'Downtown Mall', price: 4.99, distance: '0.8 mi', lastUpdated: '2h ago', verified: true },
  { store: 'Walmart', location: 'Shopping Center', price: 5.29, distance: '1.2 mi', lastUpdated: '4h ago', verified: true },
  { store: 'Kroger', location: 'Main Street', price: 5.49, distance: '1.5 mi', lastUpdated: '6h ago', verified: false },
  { store: 'Whole Foods', location: 'Uptown', price: 5.99, distance: '2.1 mi', lastUpdated: '1d ago', verified: true },
];

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  const { formatPrice } = useCurrency();
  const PriceChart = () => (
    <div className="h-32 w-full relative">
      <svg className="w-full h-full" viewBox="0 0 300 120">
        <defs>
          <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Price line */}
        <polyline
          fill="none"
          stroke="hsl(var(--success))"
          strokeWidth="3"
          points={mockPriceHistory.map((point, index) => {
            const x = (index / (mockPriceHistory.length - 1)) * 280 + 10;
            const y = 100 - ((point.price - 4.5) / (6.0 - 4.5)) * 80;
            return `${x},${y}`;
          }).join(' ')}
        />
        
        {/* Fill area under line */}
        <polygon
          fill="url(#priceGradient)"
          points={`10,100 ${mockPriceHistory.map((point, index) => {
            const x = (index / (mockPriceHistory.length - 1)) * 280 + 10;
            const y = 100 - ((point.price - 4.5) / (6.0 - 4.5)) * 80;
            return `${x},${y}`;
          }).join(' ')} 290,100`}
        />
        
        {/* Data points */}
        {mockPriceHistory.map((point, index) => {
          const x = (index / (mockPriceHistory.length - 1)) * 280 + 10;
          const y = 100 - ((point.price - 4.5) / (6.0 - 4.5)) * 80;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="hsl(var(--success))"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      
      {/* Price labels */}
      <div className="absolute inset-0 flex items-end justify-between px-2 pb-2">
        {mockPriceHistory.map((point, index) => (
          <div key={index} className="text-xs text-center">
            <div className="font-semibold">${point.price}</div>
            <div className="text-muted-foreground text-xs">{new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pb-20 px-4 pt-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="rounded-full"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{product.product}</h1>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <Heart size={16} />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Share2 size={16} />
          </Button>
        </div>
      </div>

      {/* Current Price Summary */}
      <Card className="p-4 bg-success-solid border-0 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Current Best Price</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{formatPrice(product.price || product.salePrice || 0)}</span>
              <div className="flex items-center gap-1">
                <TrendingDown size={20} />
                <span className="text-sm">{product.trendPercentage || 0}% lower</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1 opacity-90">
              <MapPin size={14} />
              <span className="text-sm">{product.store} • {product.location}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <p className="text-lg font-bold text-muted-foreground">{formatPrice(product.avgPrice || product.originalPrice || 0)}</p>
          <p className="text-xs text-muted-foreground">30-Day Average</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-lg font-bold text-success">{formatPrice(Math.max(0, (product.originalPrice || product.avgPrice || 0) - (product.price || product.salePrice || 0)))}</p>
          <p className="text-xs text-muted-foreground">You Save</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-lg font-bold text-primary">4.2★</p>
          <p className="text-xs text-muted-foreground">User Rating</p>
        </Card>
      </div>

      {/* Price Trend Chart */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">30-Day Price Trend</h3>
            <Badge variant="outline" className="text-xs">
              <TrendingDown size={12} className="mr-1" />
              Trending Down
            </Badge>
          </div>
          <PriceChart />
        </div>
      </Card>

      {/* Store Comparison */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Store Comparison</h3>
          <Button variant="outline" size="sm">
            <MapPin size={14} className="mr-2" />
            Map View
          </Button>
        </div>

        <div className="space-y-2">
          {mockStoreComparison.map((store, index) => (
            <Card key={index} className={`p-4 ${index === 0 ? 'ring-2 ring-success/20 bg-success/5' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{store.store}</h4>
                    {index === 0 && (
                      <Badge variant="secondary" className="text-xs bg-success text-white">
                        Best Price
                      </Badge>
                    )}
                    {store.verified ? (
                      <CheckCircle2 className="text-success" size={14} />
                    ) : (
                      <AlertTriangle className="text-warning" size={14} />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span>{store.location} • {store.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{store.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold">{formatPrice(store.price)}</p>
                  {index === 0 ? (
                    <p className="text-xs text-success">Lowest price</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      +{formatPrice(store.price - mockStoreComparison[0].price)}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button className="w-full bg-primary-solid text-white">
          <MapPin className="mr-2" size={16} />
          Get Directions to Best Price
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline">
            <BarChart3 className="mr-2" size={16} />
            Price Alert
          </Button>
          <Button variant="outline">
            <Star className="mr-2" size={16} />
            Add to Wishlist
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;