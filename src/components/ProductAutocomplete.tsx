import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, DollarSign } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  expectedPrice: number;
  bestStore: string;
  storeLocation: string;
  unit: string;
  barcode?: string;
}

interface ProductAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onProductSelect: (product: Product) => void;
  placeholder?: string;
  className?: string;
}

// Mock Norwegian product database
const norwegianProducts: Product[] = [
  {
    id: '1',
    name: 'Coca-Cola Classic 12 Pack',
    brand: 'Coca-Cola',
    category: 'Drikke',
    expectedPrice: 159.90,
    bestStore: 'Rema 1000',
    storeLocation: 'Oslo Sentrum',
    unit: 'pack',
    barcode: '123456789'
  },
  {
    id: '2',
    name: 'Økologiske Bananer',
    brand: 'Kiwi',
    category: 'Frukt',
    expectedPrice: 34.90,
    bestStore: 'Kiwi',
    storeLocation: 'Trondheim Midtbyen',
    unit: 'kg'
  },
  {
    id: '3',
    name: 'Fersk Atlantisk Laks',
    brand: 'Norsk Sjømat',
    category: 'Fisk',
    expectedPrice: 249.00,
    bestStore: 'Coop Mega',
    storeLocation: 'Bergen Bryggen',
    unit: 'kg'
  },
  {
    id: '4',
    name: 'Melk Helmelk 1L',
    brand: 'Tine',
    category: 'Meieri',
    expectedPrice: 18.90,
    bestStore: 'Rema 1000',
    storeLocation: 'Oslo Sentrum',
    unit: 'liter'
  },
  {
    id: '5',
    name: 'Brød Grovbrød',
    brand: 'Baker Hansen',
    category: 'Bakeri',
    expectedPrice: 39.90,
    bestStore: 'ICA Maxi',
    storeLocation: 'Stavanger Kvadrat',
    unit: 'item'
  },
  {
    id: '6',
    name: 'iPhone 15 Pro 256GB',
    brand: 'Apple',
    category: 'Elektronikk',
    expectedPrice: 12999.00,
    bestStore: 'Elkjøp',
    storeLocation: 'Oslo Byporten',
    unit: 'item'
  },
  {
    id: '7',
    name: 'Samsung 65" 4K Smart TV',
    brand: 'Samsung',
    category: 'Elektronikk',
    expectedPrice: 8999.00,
    bestStore: 'Power',
    storeLocation: 'Bergen Storsenter',
    unit: 'item'
  },
  {
    id: '8',
    name: 'Pasta Spaghetti 500g',
    brand: 'Barilla',
    category: 'Tørrmat',
    expectedPrice: 24.90,
    bestStore: 'Meny',
    storeLocation: 'Drammen Storgate',
    unit: 'pack'
  },
  {
    id: '9',
    name: 'Kaffe Evergood',
    brand: 'Evergood',
    category: 'Drikke',
    expectedPrice: 89.90,
    bestStore: 'Bunnpris',
    storeLocation: 'Kristiansand Kvadraturen',
    unit: 'pack'
  },
  {
    id: '10',
    name: 'Yoghurt Naturell 1kg',
    brand: 'Tine',
    category: 'Meieri',
    expectedPrice: 42.90,
    bestStore: 'Kiwi',
    storeLocation: 'Trondheim Midtbyen',
    unit: 'kg'
  }
];

const ProductAutocomplete: React.FC<ProductAutocompleteProps> = ({
  value,
  onChange,
  onProductSelect,
  placeholder = "Type product name...",
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const { formatPrice } = useCurrency();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = norwegianProducts.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.brand.toLowerCase().includes(value.toLowerCase()) ||
        product.category.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6); // Limit to 6 suggestions

      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setActiveSuggestion(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (product: Product) => {
    onChange(product.name);
    onProductSelect(product);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestion >= 0 && activeSuggestion < suggestions.length) {
          handleSuggestionClick(suggestions[activeSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        break;
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }, 200);
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleInputBlur}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        className={className}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto bg-background border shadow-lg">
          <div className="p-2">
            {suggestions.map((product, index) => (
              <div
                key={product.id}
                ref={el => suggestionRefs.current[index] = el}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  index === activeSuggestion 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleSuggestionClick(product)}
              >
                <div className="flex items-start gap-3">
                  <Package className="text-primary mt-1" size={16} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm text-success">
                          {formatPrice(product.expectedPrice)}
                        </p>
                        <p className="text-xs text-muted-foreground">per {product.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <MapPin size={10} />
                      <span className="truncate">{product.bestStore} - {product.storeLocation}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProductAutocomplete;