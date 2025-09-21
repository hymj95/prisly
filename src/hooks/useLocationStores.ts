import { useState, useEffect } from 'react';

interface Store {
  id: string;
  name: string;
  location: string;
  distance?: number;
  country: string;
  type: 'supermarket' | 'electronics' | 'clothing' | 'pharmacy' | 'restaurant' | 'other';
}

// Mock store data by country
const storesByCountry: Record<string, Store[]> = {
  'US': [
    { id: '1', name: 'Target', location: 'Downtown Mall', country: 'US', type: 'supermarket' },
    { id: '2', name: 'Best Buy', location: 'Electronics Plaza', country: 'US', type: 'electronics' },
    { id: '3', name: 'Walmart', location: 'Northside', country: 'US', type: 'supermarket' },
    { id: '4', name: 'Whole Foods', location: 'Main Street', country: 'US', type: 'supermarket' },
    { id: '5', name: 'CVS Pharmacy', location: 'City Center', country: 'US', type: 'pharmacy' },
  ],
  'CA': [
    { id: '6', name: 'Loblaws', location: 'Toronto Centre', country: 'CA', type: 'supermarket' },
    { id: '7', name: 'Canadian Tire', location: 'Yorkdale Mall', country: 'CA', type: 'electronics' },
    { id: '8', name: 'Metro', location: 'Downtown Toronto', country: 'CA', type: 'supermarket' },
    { id: '9', name: 'Shoppers Drug Mart', location: 'Queen Street', country: 'CA', type: 'pharmacy' },
  ],
  'GB': [
    { id: '10', name: 'Tesco', location: 'Central London', country: 'GB', type: 'supermarket' },
    { id: '11', name: 'Sainsbury\'s', location: 'Oxford Street', country: 'GB', type: 'supermarket' },
    { id: '12', name: 'Curry\'s PC World', location: 'Westfield', country: 'GB', type: 'electronics' },
    { id: '13', name: 'Boots', location: 'High Street', country: 'GB', type: 'pharmacy' },
  ],
  'DE': [
    { id: '14', name: 'REWE', location: 'Berlin Mitte', country: 'DE', type: 'supermarket' },
    { id: '15', name: 'MediaMarkt', location: 'Potsdamer Platz', country: 'DE', type: 'electronics' },
    { id: '16', name: 'EDEKA', location: 'Charlottenburg', country: 'DE', type: 'supermarket' },
    { id: '17', name: 'dm', location: 'Friedrichshain', country: 'DE', type: 'pharmacy' },
  ],
  'FR': [
    { id: '18', name: 'Carrefour', location: 'Champs-Élysées', country: 'FR', type: 'supermarket' },
    { id: '19', name: 'Fnac', location: 'Les Halles', country: 'FR', type: 'electronics' },
    { id: '20', name: 'Monoprix', location: 'Saint-Germain', country: 'FR', type: 'supermarket' },
    { id: '21', name: 'Pharmacie', location: 'Montmartre', country: 'FR', type: 'pharmacy' },
  ]
};

// Country detection fallback mapping
const countryCodeToName: Record<string, string> = {
  'US': 'United States',
  'CA': 'Canada', 
  'GB': 'United Kingdom',
  'DE': 'Germany',
  'FR': 'France'
};

export const useLocationStores = () => {
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);

  // Get current country (detected or user-selected)
  const currentCountry = userCountry || detectedCountry;

  // Detect user's country based on location
  const detectLocation = async () => {
    setIsDetecting(true);
    setDetectionError(null);

    try {
      // Try to get user's position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false
        });
      });

      // Use a geolocation API to get country from coordinates
      // For demo purposes, we'll simulate country detection based on coordinates
      const { latitude, longitude } = position.coords;
      
      // Simple coordinate-based country detection (mock implementation)
      let country = 'US'; // Default fallback
      
      if (latitude >= 49 && latitude <= 60 && longitude >= -141 && longitude <= -52) {
        country = 'CA'; // Canada
      } else if (latitude >= 50 && latitude <= 59 && longitude >= -8 && longitude <= 2) {
        country = 'GB'; // UK
      } else if (latitude >= 47 && latitude <= 55 && longitude >= 6 && longitude <= 15) {
        country = 'DE'; // Germany
      } else if (latitude >= 42 && latitude <= 51 && longitude >= -5 && longitude <= 8) {
        country = 'FR'; // France
      }

      setDetectedCountry(country);
    } catch (error) {
      console.error('Location detection failed:', error);
      setDetectionError('Could not detect location. Please select your country manually.');
      // Default to US stores if detection fails
      setDetectedCountry('US');
    } finally {
      setIsDetecting(false);
    }
  };

  // Update stores when country changes
  useEffect(() => {
    if (currentCountry) {
      const countryStores = storesByCountry[currentCountry] || storesByCountry['US'];
      setStores(countryStores);
    }
  }, [currentCountry]);

  // Auto-detect location on hook mount
  useEffect(() => {
    detectLocation();
  }, []);

  const setCountryManually = (countryCode: string) => {
    setUserCountry(countryCode);
    setDetectionError(null);
  };

  const getAvailableCountries = () => {
    return Object.keys(storesByCountry).map(code => ({
      code,
      name: countryCodeToName[code] || code
    }));
  };

  return {
    detectedCountry,
    userCountry,
    currentCountry,
    stores,
    isDetecting,
    detectionError,
    detectLocation,
    setCountryManually,
    getAvailableCountries
  };
};