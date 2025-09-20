import { useState, useEffect } from 'react';

interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
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

  // Load stores from localStorage
  useEffect(() => {
    const savedStores = localStorage.getItem('prisly-stores');
    if (savedStores) {
      try {
        setStores(JSON.parse(savedStores));
      } catch (error) {
        console.error('Error loading stores:', error);
      }
    }

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

  // Save stores to localStorage
  const saveStores = (newStores: Store[]) => {
    setStores(newStores);
    localStorage.setItem('prisly-stores', JSON.stringify(newStores));
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

  // Add a new store
  const addStore = (store: Omit<Store, 'id'>) => {
    const newStore: Store = {
      ...store,
      id: Date.now().toString()
    };
    const updatedStores = [newStore, ...stores];
    saveStores(updatedStores);
    return newStore;
  };

  // Remove a store
  const removeStore = (storeId: string) => {
    const updatedStores = stores.filter(store => store.id !== storeId);
    saveStores(updatedStores);
    
    // If the selected store was removed, clear selection
    if (selectedStore?.id === storeId) {
      saveSelectedStore(null);
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
    addStore,
    removeStore,
    saveSelectedStore,
    getCurrentLocation,
    getNearbyStores,
    calculateDistance
  };
};