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
    // Default to USD
    return currencies[0];
  });

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENCY_STORAGE_KEY, JSON.stringify(newCurrency));
    }
  };

  const formatPrice = (usdPrice: number, showSymbol: boolean = true): string => {
    const convertedPrice = usdPrice * currency.rate;
    const formattedPrice = convertedPrice.toFixed(2);
    
    if (!showSymbol) return formattedPrice;
    
    // For currencies like JPY that don't use decimals
    if (currency.code === 'JPY') {
      return `${currency.symbol}${Math.round(convertedPrice)}`;
    }
    
    return `${currency.symbol}${formattedPrice}`;
  };

  const convertPrice = (usdPrice: number): number => {
    return usdPrice * currency.rate;
  };

  return {
    currency,
    setCurrency,
    formatPrice,
    convertPrice,
    currencies
  };
};