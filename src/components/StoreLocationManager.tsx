import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Plus, Check, X, Loader2, AlertCircle, Navigation, Map } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  distance?: number;
}

interface StoreLocationManagerProps {
  onStoreSelect?: (store: Store) => void;
  currentLocation?: { lat: number; lng: number } | null;
}

const StoreLocationManager: React.FC<StoreLocationManagerProps> = ({ onStoreSelect, currentLocation }) => {
  const { t } = useLanguage();
  const [detectedStores, setDetectedStores] = useState<Store[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualStore, setManualStore] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: ''
  });
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(currentLocation || null);
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false);
  const [mapboxToken, setMapboxToken] = useState('');

  // Mock nearby stores for demonstration
  const mockNearbyStores: Store[] = [
    {
      id: '1',
      name: 'Target',
      address: '123 Main St, Downtown',
      latitude: 40.7128,
      longitude: -74.0060,
      verified: true
    },
    {
      id: '2',
      name: 'Walmart Supercenter',
      address: '456 Shopping Center Blvd',
      latitude: 40.7589,
      longitude: -73.9851,
      verified: true
    },
    {
      id: '3',
      name: 'Whole Foods Market',
      address: '789 Organic Ave',
      latitude: 40.7282,
      longitude: -74.0776,
      verified: true
    },
    {
      id: '4',
      name: 'CVS Pharmacy',
      address: '321 Health Street',
      latitude: 40.7505,
      longitude: -73.9934,
      verified: true
    }
  ];

  // Get user's current location
  const getCurrentLocation = () => {
    setIsDetecting(true);
    setDetectionError(null);

    if (!navigator.geolocation) {
      setDetectionError('Geolocation is not supported by this browser');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        detectNearbyStores(location);
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services or add store manually.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timeout.';
            break;
        }
        setDetectionError(errorMessage);
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
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

  // Detect nearby stores
  const detectNearbyStores = (location: { lat: number; lng: number }) => {
    // Simulate API call delay
    setTimeout(() => {
      const storesWithDistance = mockNearbyStores.map(store => ({
        ...store,
        distance: calculateDistance(location.lat, location.lng, store.latitude, store.longitude)
      })).filter(store => store.distance! < 10) // Within 10km
        .sort((a, b) => a.distance! - b.distance!); // Sort by distance

      setDetectedStores(storesWithDistance);
      setIsDetecting(false);
    }, 2000);
  };

  // Reverse geocode coordinates to get address
  const reverseGeocode = async (lat: number, lng: number) => {
    if (!mapboxToken) return;
    
    setIsGeocodingAddress(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`
      );
      const data = await response.json();
      const address = data.features[0]?.place_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
      setManualStore(prev => ({ ...prev, address }));
    } catch (error) {
      console.error('Error getting address:', error);
    } finally {
      setIsGeocodingAddress(false);
    }
  };

  // Handle coordinate changes and auto-fill address
  const handleCoordinateChange = (field: 'latitude' | 'longitude', value: string) => {
    setManualStore(prev => ({ ...prev, [field]: value }));
    
    // Auto-fill address if both coordinates are valid
    const lat = field === 'latitude' ? parseFloat(value) : parseFloat(manualStore.latitude);
    const lng = field === 'longitude' ? parseFloat(value) : parseFloat(manualStore.longitude);
    
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      reverseGeocode(lat, lng);
    }
  };

  // Get current location for manual form
  const useCurrentLocationForManual = () => {
    if (!navigator.geolocation) {
      setDetectionError('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setManualStore(prev => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString()
        }));
        if (mapboxToken) {
          reverseGeocode(lat, lng);
        }
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timeout.';
            break;
        }
        setDetectionError(errorMessage);
      }
    );
  };

  // Handle manual store submission
  const handleManualSubmit = () => {
    if (!manualStore.name || !manualStore.address) {
      return;
    }

    const newStore: Store = {
      id: Date.now().toString(),
      name: manualStore.name,
      address: manualStore.address,
      latitude: parseFloat(manualStore.latitude) || 0,
      longitude: parseFloat(manualStore.longitude) || 0,
      verified: false
    };

    setDetectedStores(prev => [newStore, ...prev]);
    setManualStore({ name: '', address: '', latitude: '', longitude: '' });
    setShowManualInput(false);
  };

  useEffect(() => {
    if (currentLocation) {
      setUserLocation(currentLocation);
      detectNearbyStores(currentLocation);
    }
  }, [currentLocation]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{t('store.storeLocation')}</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={getCurrentLocation}
          disabled={isDetecting}
        >
          {isDetecting ? (
            <>
              <Loader2 size={14} className="mr-2 animate-spin" />
              {t('store.detecting')}
            </>
          ) : (
            <>
              <Navigation size={14} className="mr-2" />
              {t('store.autoDetect')}
            </>
          )}
        </Button>
      </div>

      {/* Detection Error */}
      {detectionError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{detectionError}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isDetecting && (
        <Card className="p-4 text-center">
          <Loader2 className="mx-auto mb-2 animate-spin" size={24} />
          <p className="text-sm text-muted-foreground">{t('store.detectingStores')}</p>
        </Card>
      )}

      {/* Detected Stores */}
      {detectedStores.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            {userLocation ? t('store.nearbyStores') : t('store.availableStores')}
          </h4>
          {detectedStores.map((store) => (
            <Card key={store.id} className="p-3 hover:shadow-md transition-all cursor-pointer" onClick={() => onStoreSelect?.(store)}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium">{store.name}</h5>
                    {store.verified ? (
                      <Badge variant="secondary" className="text-xs bg-success/10 text-success">
                        {t('store.verified')}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        {t('store.manual')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{store.address}</p>
                  {store.distance !== undefined && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {store.distance.toFixed(1)} {t('store.kmAway')}
                    </p>
                  )}
                </div>
                <MapPin className="text-muted-foreground" size={16} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Manual Input Toggle */}
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowManualInput(!showManualInput)}
        >
          <Plus size={14} className="mr-2" />
          {t('store.addManually')}
        </Button>
      </div>

      {/* Manual Input Form */}
      {showManualInput && (
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium mb-2">{t('store.addManually')}</h4>
            <Button variant="ghost" size="sm" onClick={() => setShowManualInput(false)}>
              <X size={14} />
            </Button>
          </div>

          {/* Mapbox Token Input for Address Recognition */}
          {!mapboxToken && (
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <p className="text-sm font-medium">Enable Address Auto-Fill</p>
              <p className="text-xs text-muted-foreground">
                Enter your Mapbox token to automatically recognize addresses from coordinates
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Mapbox public token (optional)"
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" asChild>
                  <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer">
                    <Map size={14} />
                  </a>
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">{t('store.storeName')} *</label>
              <Input
                placeholder="e.g., Target, Walmart"
                value={manualStore.name}
                onChange={(e) => setManualStore(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">{t('store.address')} *</label>
                {isGeocodingAddress && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Loader2 size={12} className="animate-spin" />
                    Getting address...
                  </div>
                )}
              </div>
              <Input
                placeholder="123 Main St, City, State"
                value={manualStore.address}
                onChange={(e) => setManualStore(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Coordinates</label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={useCurrentLocationForManual}
                  disabled={isGeocodingAddress}
                >
                  <Navigation size={12} className="mr-1" />
                  Use Current
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{t('store.latitude')}</label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="40.7128"
                    value={manualStore.latitude}
                    onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{t('store.longitude')}</label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="-74.0060"
                    value={manualStore.longitude}
                    onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
                  />
                </div>
              </div>
              
              {mapboxToken && (
                <p className="text-xs text-muted-foreground">
                  💡 Enter coordinates and the address will be filled automatically
                </p>
              )}
            </div>
            
            <Button 
              onClick={handleManualSubmit}
              disabled={!manualStore.name || !manualStore.address}
              className="w-full"
            >
              <Check size={14} className="mr-2" />
              {t('store.addStore')}
            </Button>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!isDetecting && detectedStores.length === 0 && !detectionError && (
        <Card className="p-8 text-center">
          <MapPin className="mx-auto mb-3 text-muted-foreground" size={32} />
          <h4 className="font-medium mb-2">{t('store.noStoresDetected')}</h4>
          <p className="text-sm text-muted-foreground mb-4">
            {t('store.enableLocation')}
          </p>
          <div className="space-y-2">
            <Button onClick={getCurrentLocation} className="w-full">
              <Navigation size={14} className="mr-2" />
              {t('store.tryAutoDetection')}
            </Button>
            <Button variant="outline" onClick={() => setShowManualInput(true)} className="w-full">
              <Plus size={14} className="mr-2" />
              {t('store.addManually')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StoreLocationManager;