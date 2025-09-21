import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, Percent, Filter, SortAsc } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useLanguage } from '@/hooks/useLanguage';
import ProductDetail from './ProductDetail';

interface Deal {
  id: number;
  product: string;
  brand: string;
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  store: string;
  location: string;
  distance: number;
  timeLeft: string;
  category: string;
}

interface CategoryDealsProps {
  category: string;
  onBack: () => void;
}

// Mock data for different categories
const mockDeals: Record<string, Deal[]> = {
  'Electronics': [
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
      id: 3,
      product: 'Sony WH-1000XM4 Headphones',
      brand: 'Sony',
      originalPrice: 349.99,
      salePrice: 229.99,
      discountPercentage: 34,
      store: 'Amazon',
      location: 'Online',
      distance: 0,
      timeLeft: '3 days left',
      category: 'Electronics'
    },
    {
      id: 4,
      product: 'Apple AirPods Pro',
      brand: 'Apple',
      originalPrice: 249.99,
      salePrice: 179.99,
      discountPercentage: 28,
      store: 'Best Buy',
      location: 'Tech Center',
      distance: 2.3,
      timeLeft: '2 hours left',
      category: 'Electronics'
    }
  ],
  'Footwear': [
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
    },
    {
      id: 5,
      product: 'Adidas Ultraboost 22',
      brand: 'Adidas',
      originalPrice: 180.00,
      salePrice: 129.99,
      discountPercentage: 28,
      store: 'Adidas Store',
      location: 'Mall Plaza',
      distance: 3.1,
      timeLeft: '3 days left',
      category: 'Footwear'
    }
  ],
  'Kitchen': [
    {
      id: 6,
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
      id: 7,
      product: 'KitchenAid Stand Mixer',
      brand: 'KitchenAid',
      originalPrice: 379.99,
      salePrice: 249.99,
      discountPercentage: 34,
      store: 'Williams Sonoma',
      location: 'Downtown',
      distance: 1.5,
      timeLeft: '1 week left',
      category: 'Kitchen'
    }
  ],
  'Clothing': [
    {
      id: 8,
      product: 'Levi\'s 501 Jeans',
      brand: 'Levi\'s',
      originalPrice: 79.99,
      salePrice: 39.99,
      discountPercentage: 50,
      store: 'Levi\'s Store',
      location: 'Downtown',
      distance: 1.5,
      timeLeft: '8 hours left',
      category: 'Clothing'
    },
    {
      id: 9,
      product: 'North Face Jacket',
      brand: 'The North Face',
      originalPrice: 199.99,
      salePrice: 129.99,
      discountPercentage: 35,
      store: 'REI',
      location: 'Outdoor Mall',
      distance: 4.2,
      timeLeft: '5 days left',
      category: 'Clothing'
    }
  ],
  'Home & Garden': [
    {
      id: 10,
      product: 'Dyson V11 Vacuum',
      brand: 'Dyson',
      originalPrice: 599.99,
      salePrice: 399.99,
      discountPercentage: 33,
      store: 'Target',
      location: 'Northside Mall',
      distance: 4.1,
      timeLeft: '5 days left',
      category: 'Home & Garden'
    }
  ]
};

const CategoryDeals: React.FC<CategoryDealsProps> = ({ category, onBack }) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'discount' | 'price' | 'distance'>('discount');

  const deals = mockDeals[category] || [];

  const sortedDeals = [...deals].sort((a, b) => {
    switch (sortBy) {
      case 'discount':
        return b.discountPercentage - a.discountPercentage;
      case 'price':
        return a.salePrice - b.salePrice;
      case 'distance':
        return a.distance - b.distance;
      default:
        return 0;
    }
  });

  const handleDealClick = (deal: Deal) => {
    const product = {
      ...deal,
      price: deal.salePrice,
      avgPrice: deal.originalPrice,
      trend: 'down',
      trendPercentage: deal.discountPercentage,
      timeAgo: deal.timeLeft
    };
    setSelectedProduct(product);
  };

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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary">{category} {t('deals.deals')}</h1>
          <p className="text-muted-foreground">{deals.length} {t('deals.deals')} {t('deals.available')}</p>
        </div>
      </div>

      {/* Sort and Filter */}
      <div className="flex items-center gap-3">
        <Button
          variant={sortBy === 'discount' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('discount')}
          className="flex items-center gap-2"
        >
          <Percent size={14} />
          {t('deals.sortByDiscount')}
        </Button>
        <Button
          variant={sortBy === 'price' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('price')}
          className="flex items-center gap-2"
        >
          <SortAsc size={14} />
          {t('deals.sortByPrice')}
        </Button>
        <Button
          variant={sortBy === 'distance' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('distance')}
          className="flex items-center gap-2"
        >
          <MapPin size={14} />
          {t('deals.sortByDistance')}
        </Button>
      </div>

      {/* Deals List */}
      <div className="space-y-4">
        {sortedDeals.map((deal) => (
          <Card 
            key={deal.id} 
            className="p-4 cursor-pointer hover:shadow-minimalist transition-all duration-300 hover:scale-[1.02] rounded-card border-minimal"
            onClick={() => handleDealClick(deal)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-base">{deal.product}</h3>
                  <Badge variant="outline" className="text-xs">{deal.brand}</Badge>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{deal.store} • {deal.distance > 0 ? `${deal.distance} km` : 'Online'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{deal.timeLeft}</span>
                  </div>
                </div>
              </div>

              <div className="text-right space-y-2 ml-4">
                <div className="flex items-center gap-2 justify-end">
                  <div className="flex items-center gap-1 bg-success/10 text-success px-3 py-1 rounded-card">
                    <Percent size={14} />
                    <span className="text-sm font-bold">{deal.discountPercentage}% OFF</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(deal.originalPrice)}
                  </p>
                  <p className="font-bold text-xl text-success">
                    {formatPrice(deal.salePrice)}
                  </p>
                </div>
                
                <p className="text-sm text-success font-medium">
                  {t('deals.save')} {formatPrice(deal.originalPrice - deal.salePrice)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {deals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('deals.noDealsFound')}</p>
        </div>
      )}
    </div>
  );
};

export default CategoryDeals;