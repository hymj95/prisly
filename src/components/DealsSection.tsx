import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, MapPin, Clock, Percent } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useLanguage } from '@/hooks/useLanguage';

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

interface DealsSectionProps {
  title: string;
  icon: React.ReactNode;
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
  onViewAll?: () => void;
}

const DealsSection: React.FC<DealsSectionProps> = ({ title, icon, deals, onDealClick, onViewAll }) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <Button variant="outline" size="sm" onClick={onViewAll}>{t('home.viewAll')}</Button>
        </div>

      <div className="grid gap-3">
        {deals.map((deal) => (
          <Card 
            key={deal.id} 
            className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            onClick={() => onDealClick(deal)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-sm">{deal.product}</h3>
                  <Badge variant="outline" className="text-xs">{deal.brand}</Badge>
                  <Badge variant="secondary" className="text-xs">{deal.category}</Badge>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{deal.store} • {deal.distance.toFixed(1)} {t('store.kmAway')}</span>
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
                   Save {formatPrice(deal.originalPrice - deal.salePrice)}
                 </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DealsSection;