import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  distance?: number;
  city?: string;
  category?: string;
}

interface UserLocation {
  lat: number;
  lng: number;
}

export const useStoreLocation = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load stores from database
  useEffect(() => {
    fetchStores();
    loadSavedLocation();
    loadSelectedStore();
  }, []);

  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('name');

      if (error) throw error;

      const formattedStores = data?.map(store => ({
        id: store.id,
        name: store.name,
        address: store.address,
        latitude: Number(store.latitude),
        longitude: Number(store.longitude),
        verified: store.verified,
        city: store.city,
        category: store.category
      })) || [];

      setStores(formattedStores);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedLocation = () => {
    const savedUserLocation = localStorage.getItem('prisly-user-location');
    if (savedUserLocation) {
      try {
        setUserLocation(JSON.parse(savedUserLocation));
      } catch (error) {
        console.error('Error loading user location:', error);
      }
    }
  };

  const loadSelectedStore = () => {
    const savedSelectedStore = localStorage.getItem('prisly-selected-store');
    if (savedSelectedStore) {
      try {
        setSelectedStore(JSON.parse(savedSelectedStore));
      } catch (error) {
        console.error('Error loading selected store:', error);
      }
    }
  };


  // Save user location
  const saveUserLocation = (location: UserLocation) => {
    setUserLocation(location);
    localStorage.setItem('prisly-user-location', JSON.stringify(location));
  };

  // Save selected store
  const saveSelectedStore = (store: Store | null) => {
    setSelectedStore(store);
    if (store) {
      localStorage.setItem('prisly-selected-store', JSON.stringify(store));
    } else {
      localStorage.removeItem('prisly-selected-store');
    }
  };


  // Get current location using browser geolocation
  const getCurrentLocation = (): Promise<UserLocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          saveUserLocation(location);
          resolve(location);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get nearby stores
  const getNearbyStores = (location?: UserLocation, radiusKm: number = 10): Store[] => {
    const currentLocation = location || userLocation;
    if (!currentLocation) return stores;

    return stores
      .map(store => ({
        ...store,
        distance: calculateDistance(
          currentLocation.lat, 
          currentLocation.lng, 
          store.latitude, 
          store.longitude
        )
      }))
      .filter(store => store.distance! <= radiusKm)
      .sort((a, b) => a.distance! - b.distance!);
  };

  return {
    stores,
    userLocation,
    selectedStore,
    isLoading,
    saveSelectedStore,
    getCurrentLocation,
    getNearbyStores,
    calculateDistance,
    refreshStores: fetchStores
  };
};