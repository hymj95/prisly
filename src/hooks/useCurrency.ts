import { useState, useEffect } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate to USD
}

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.85 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.73 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.25 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.35 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 110 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.92 },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', rate: 8.5 },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', rate: 8.8 },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', rate: 6.3 },
];

const CURRENCY_STORAGE_KEY = 'prisly-currency';

export const useCurrency = () => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (stored) {
        const storedCurrency = JSON.parse(stored);
        const found = currencies.find(c => c.code === storedCurrency.code);
        if (found) return found;
      }
    }
    // Default to Norwegian Krone since app is geolocked to Norway
    return currencies.find(c => c.code === 'NOK') || currencies[0];
  });

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENCY_STORAGE_KEY, JSON.stringify(newCurrency));
    }
  };

  const formatPrice = (basePrice: number, showSymbol: boolean = true): string => {
    // Since we're Norway-focused, treat input as NOK prices
    const formattedPrice = basePrice.toFixed(2);
    
    if (!showSymbol) return formattedPrice;
    
    // Norwegian Krone formatting
    if (currency.code === 'NOK') {
      return `${formattedPrice} kr`;
    }
    
    // Convert from NOK to other currencies if needed
    const nokRate = currencies.find(c => c.code === 'NOK')?.rate || 8.8;
    const convertedPrice = (basePrice / nokRate) * currency.rate;
    
    // For currencies like JPY that don't use decimals
    if (currency.code === 'JPY') {
      return `${currency.symbol}${Math.round(convertedPrice)}`;
    }
    
    return `${currency.symbol}${convertedPrice.toFixed(2)}`;
  };

  const convertPrice = (nokPrice: number): number => {
    // Convert from NOK to selected currency
    const nokRate = currencies.find(c => c.code === 'NOK')?.rate || 8.8;
    return (nokPrice / nokRate) * currency.rate;
  };

  return {
    currency,
    setCurrency,
    formatPrice,
    convertPrice,
    currencies
  };
};