import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useCurrency, Currency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrencySelect = (selectedCurrency: Currency) => {
    setCurrency(selectedCurrency);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <Globe size={16} />
          <span>{currency.symbol} {currency.code}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={cn("transition-transform", isOpen && "rotate-180")} 
        />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border shadow-lg max-h-64 overflow-y-auto">
            <div className="p-2">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => handleCurrencySelect(curr)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left",
                    currency.code === curr.code && "bg-primary/10 text-primary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg">{curr.symbol}</span>
                    <div>
                      <div className="font-medium">{curr.code}</div>
                      <div className="text-sm text-muted-foreground">{curr.name}</div>
                    </div>
                  </div>
                  
                  {currency.code === curr.code && (
                    <Check size={16} className="text-primary" />
                  )}
                </button>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default CurrencySelector;