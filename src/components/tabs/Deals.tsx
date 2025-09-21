import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TrendingDown, MapPin, Clock, Percent, ChevronDown, ChevronUp, Flame, Zap, Target } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useLanguage } from '@/hooks/useLanguage';
import ProductDetail from '../ProductDetail';

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

const mockHotDeals: Deal[] = [
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
  },
  {
    id: 7,
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
    id: 8,
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
];

const mockFlashDeals: Deal[] = [
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
  },
  {
    id: 9,
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
  },
  {
    id: 10,
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
  }
];

const mockLocalDeals: Deal[] = [
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
  },
  {
    id: 11,
    product: 'Local Honey (16oz)',
    brand: 'Hillside Farms',
    originalPrice: 15.99,
    salePrice: 9.99,
    discountPercentage: 38,
    store: 'Farmers Market',
    location: 'City Square',
    distance: 1.2,
    timeLeft: 'Weekend only',
    category: 'Organic'
  },
  {
    id: 12,
    product: 'Fresh Pizza Margherita',
    brand: 'Tony\'s Pizzeria',
    originalPrice: 18.99,
    salePrice: 12.99,
    discountPercentage: 32,
    store: 'Tony\'s Pizzeria',
    location: 'Little Italy',
    distance: 0.9,
    timeLeft: 'Until 9 PM',
    category: 'Food'
  }
];

interface DealSectionProps {
  title: string;
  icon: React.ReactNode;
  deals: Deal[];
  isOpen: boolean;
  onToggle: () => void;
  onDealClick: (deal: Deal) => void;
  onCategoryClick?: (category: string) => void;
}

const DealSection: React.FC<DealSectionProps> = ({ title, icon, deals, isOpen, onToggle, onDealClick, onCategoryClick }) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {icon}
                <h2 className="text-lg font-semibold">{title}</h2>
                <Badge variant="secondary">{deals.length} {t('deals.deals')}</Badge>
              </div>
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3">
            {deals.map((deal) => (
              <Card 
                key={deal.id} 
                className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-card/50"
                onClick={() => onDealClick(deal)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                     <div className="flex items-center gap-2 flex-wrap">
                       <h3 className="font-medium text-sm">{deal.product}</h3>
                       <Badge variant="outline" className="text-xs">{deal.brand}</Badge>
                       <Badge 
                         variant="secondary" 
                         className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                         onClick={(e) => {
                           e.stopPropagation();
                           onCategoryClick?.(deal.category);
                         }}
                       >
                         {deal.category}
                       </Badge>
                     </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{deal.store} • {deal.distance > 0 ? `${deal.distance.toFixed(1)} km` : 'Online'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{deal.timeLeft}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1 ml-4">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-full">
                        <Percent size={12} />
                        <span className="text-xs font-bold">{deal.discountPercentage}% OFF</span>
                      </div>
                    </div>
                    
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground line-through">
                        {formatPrice(deal.originalPrice)}
                      </p>
                      <p className="font-bold text-lg text-success">
                        {formatPrice(deal.salePrice)}
                      </p>
                    </div>
                    
                    <p className="text-xs text-success font-medium">
                      {t('deals.save')} {formatPrice(deal.originalPrice - deal.salePrice)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

interface DealsProps {
  onCategorySelect?: (category: string) => void;
}

const Deals: React.FC<DealsProps> = ({ onCategorySelect }) => {
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [openSections, setOpenSections] = useState({
    hot: true,
    flash: false,
    local: false
  });

  const handleSectionToggle = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDealClick = (deal: Deal) => {
    // Convert deal to product format for ProductDetail
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
    <div className="pb-32 px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-primary">{t('deals.title')}</h1>
        <p className="text-muted-foreground">{t('deals.description')}</p>
      </div>

      {/* Deal Categories */}
      <div className="space-y-4">
        <DealSection
          title={t('home.hotDeals')}
          icon={<Flame className="text-red-500" size={20} />}
          deals={mockHotDeals}
          isOpen={openSections.hot}
          onToggle={() => handleSectionToggle('hot')}
          onDealClick={handleDealClick}
          onCategoryClick={onCategorySelect}
        />

        <DealSection
          title={t('home.flashDeals')}
          icon={<Zap className="text-yellow-500" size={20} />}
          deals={mockFlashDeals}
          isOpen={openSections.flash}
          onToggle={() => handleSectionToggle('flash')}
          onDealClick={handleDealClick}
          onCategoryClick={onCategorySelect}
        />

        <DealSection
          title={t('home.localDeals')}
          icon={<Target className="text-blue-500" size={20} />}
          deals={mockLocalDeals}
          isOpen={openSections.local}
          onToggle={() => handleSectionToggle('local')}
          onDealClick={handleDealClick}
          onCategoryClick={onCategorySelect}
        />
      </div>
    </div>
  );
};

export default Deals;