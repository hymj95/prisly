import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { usePriceAlerts } from '@/hooks/usePriceAlerts';
import { useCurrency } from '@/hooks/useCurrency';
import { BarChart3, AlertTriangle, TrendingDown } from 'lucide-react';

interface PriceAlertDialogProps {
  product: any;
  trigger?: React.ReactNode;
}

const PriceAlertDialog: React.FC<PriceAlertDialogProps> = ({ product, trigger }) => {
  const [targetPrice, setTargetPrice] = useState('');
  const [open, setOpen] = useState(false);
  const { createPriceAlert, hasActiveAlert } = usePriceAlerts();
  const { formatPrice } = useCurrency();

  const currentPrice = product.price || product.salePrice || 0;
  const hasAlert = hasActiveAlert(product.product, product.store);

  const handleCreateAlert = async () => {
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      return;
    }

    const result = await createPriceAlert({
      product_name: product.product,
      product_brand: product.brand,
      target_price: price,
      current_price: currentPrice,
      store_name: product.store,
      store_location: product.location,
    });

    if (!result.error) {
      setTargetPrice('');
      setOpen(false);
    }
  };

  const suggestedPrices = [
    Math.max(0.01, currentPrice * 0.9), // 10% off
    Math.max(0.01, currentPrice * 0.8), // 20% off
    Math.max(0.01, currentPrice * 0.7), // 30% off
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" disabled={hasAlert}>
            <BarChart3 className="mr-2" size={16} />
            {hasAlert ? 'Alert Active' : 'Price Alert'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 size={20} />
            Set Price Alert
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Product Info */}
          <Card className="p-3 bg-muted/50">
            <div className="space-y-1">
              <h4 className="font-medium">{product.product}</h4>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Price:</span>
                <span className="font-semibold">{formatPrice(currentPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Store:</span>
                <span className="text-sm">{product.store}</span>
              </div>
            </div>
          </Card>

          {/* Alert Form */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="target-price">Target Price</Label>
              <Input
                id="target-price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Enter target price"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
              />
            </div>

            {/* Suggested Prices */}
            <div>
              <Label className="text-sm text-muted-foreground">Quick Select:</Label>
              <div className="flex gap-2 mt-1">
                {suggestedPrices.map((price, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setTargetPrice(price.toFixed(2))}
                    className="text-xs"
                  >
                    <TrendingDown size={12} className="mr-1" />
                    {formatPrice(price)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Warning */}
            {targetPrice && parseFloat(targetPrice) >= currentPrice && (
              <div className="flex items-start gap-2 p-3 bg-warning/10 text-warning rounded-lg">
                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Price alert tip</p>
                  <p>Your target price is higher than the current price. You'll be notified when the price drops to or below your target.</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateAlert}
              disabled={!targetPrice || parseFloat(targetPrice) <= 0}
              className="flex-1"
            >
              Create Alert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PriceAlertDialog;