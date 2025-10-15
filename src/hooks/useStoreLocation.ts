import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Store {
  id: string;
  name: string;
  address: string;
  city?: string;
  postal_code?: string;
  latitude: number;
  longitude: number;
  category?: string;
  verified: boolean;
  distance?: number;
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

  // Load stores from Supabase
  useEffect(() => {
    const loadStores = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          const formattedStores = data.map(store => ({
            id: store.id,
            name: store.name,
            address: store.address,
            city: store.city || undefined,
            postal_code: store.postal_code || undefined,
            latitude: Number(store.latitude),
            longitude: Number(store.longitude),
            category: store.category || undefined,
            verified: store.verified
          }));
          setStores(formattedStores);
        }
      } catch (error) {
        console.error('Error loading stores:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStores();

    const savedUserLocation = localStorage.getItem('prisly-user-location');
    if (savedUserLocation) {
      try {
        setUserLocation(JSON.parse(savedUserLocation));
      } catch (error) {
        console.error('Error loading user location:', error);
      }
    }

    const savedSelectedStore = localStorage.getItem('prisly-selected-store');
    if (savedSelectedStore) {
      try {
        setSelectedStore(JSON.parse(savedSelectedStore));
      } catch (error) {
        console.error('Error loading selected store:', error);
      }
    }
  }, []);

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

  // Add a new store
  const addStore = async (store: Omit<Store, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .insert([{
          name: store.name,
          address: store.address,
          city: store.city,
          postal_code: store.postal_code,
          latitude: store.latitude,
          longitude: store.longitude,
          category: store.category,
          verified: store.verified
        }])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        const newStore: Store = {
          id: data.id,
          name: data.name,
          address: data.address,
          city: data.city || undefined,
          postal_code: data.postal_code || undefined,
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          category: data.category || undefined,
          verified: data.verified
        };
        setStores(prev => [newStore, ...prev]);
        return newStore;
      }
    } catch (error) {
      console.error('Error adding store:', error);
    }
    return null;
  };

  // Remove a store
  const removeStore = async (storeId: string) => {
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', storeId);

      if (error) throw error;

      setStores(prev => prev.filter(store => store.id !== storeId));
      
      if (selectedStore?.id === storeId) {
        saveSelectedStore(null);
      }
    } catch (error) {
      console.error('Error removing store:', error);
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
    addStore,
    removeStore,
    saveSelectedStore,
    getCurrentLocation,
    getNearbyStores,
    calculateDistance
  };
};
