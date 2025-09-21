import { useState, useEffect } from 'react';

interface Store {
  id: string;
  name: string;
  location: string;
  distance?: number;
  country: string;
  type: 'supermarket' | 'electronics' | 'clothing' | 'pharmacy' | 'restaurant' | 'other';
}

// Mock Norwegian stores data
const norwegianStores: Store[] = [
  { id: '1', name: 'Rema 1000', location: 'Oslo Sentrum', country: 'NO', type: 'supermarket' },
  { id: '2', name: 'ICA Maxi', location: 'Bergen Bryggen', country: 'NO', type: 'supermarket' },
  { id: '3', name: 'Kiwi', location: 'Trondheim Midtbyen', country: 'NO', type: 'supermarket' },
  { id: '4', name: 'Coop Mega', location: 'Stavanger Sentrum', country: 'NO', type: 'supermarket' },
  { id: '5', name: 'Meny', location: 'Drammen Storgate', country: 'NO', type: 'supermarket' },
  { id: '6', name: 'Bunnpris', location: 'Kristiansand Kvadraturen', country: 'NO', type: 'supermarket' },
  { id: '7', name: 'Power', location: 'Oslo Byporten', country: 'NO', type: 'electronics' },
  { id: '8', name: 'Elkjøp', location: 'Bergen Xhibition', country: 'NO', type: 'electronics' },
  { id: '9', name: 'Apotek 1', location: 'Trondheim City Syd', country: 'NO', type: 'pharmacy' },
  { id: '10', name: 'Vitusapotek', location: 'Stavanger Kvadrat', country: 'NO', type: 'pharmacy' },
  { id: '11', name: 'H&M', location: 'Oslo Karl Johan', country: 'NO', type: 'clothing' },
  { id: '12', name: 'Cubus', location: 'Bergen Galleriet', country: 'NO', type: 'clothing' },
];

// Country detection for Norway only
const countryCodeToName: Record<string, string> = {
  'NO': 'Norge'
};

export const useLocationStores = () => {
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);

  // Get current country (detected or user-selected)
  const currentCountry = userCountry || detectedCountry;

  // Detect if user is in Norway based on location
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

      const { latitude, longitude } = position.coords;
      
      // Check if coordinates are within Norway's bounds
      // Norway bounds: approximately 57.9-71.2°N, 4.6-31.3°E
      const isInNorway = (
        latitude >= 57.9 && latitude <= 71.2 && 
        longitude >= 4.6 && longitude <= 31.3
      );
      
      if (isInNorway) {
        setDetectedCountry('NO');
      } else {
        // User is outside Norway - you might want to show a message or redirect
        setDetectionError('This app is only available in Norway.');
        setDetectedCountry('NO'); // Still set to NO for store data
      }
      
    } catch (error) {
      console.error('Location detection failed:', error);
      setDetectionError('Could not detect location. App will show Norwegian stores.');
      // Default to Norwegian stores regardless
      setDetectedCountry('NO');
    } finally {
      setIsDetecting(false);
    }
  };

  // Update stores when country changes - always Norwegian stores
  useEffect(() => {
    setStores(norwegianStores);
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
    return [{ code: 'NO', name: 'Norge' }];
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