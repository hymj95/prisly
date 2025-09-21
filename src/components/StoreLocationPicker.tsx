import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Store, ArrowLeft } from 'lucide-react';
import Map from './Map';

interface Store {
  id: string;
  name: string;
  address: string;
  distance?: number;
  coordinates?: { lat: number; lng: number };
}

interface StoreLocationPickerProps {
  onStoreSelect: (store: Store) => void;
  onBack?: () => void;
  title?: string;
}

const StoreLocationPicker: React.FC<StoreLocationPickerProps> = ({ 
  onStoreSelect, 
  onBack,
  title = "Select Store Location" 
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [nearbyStores, setNearbyStores] = useState<Store[]>([]);
  const [showMap, setShowMap] = useState(false);

  // Mock nearby stores based on location
  const findNearbyStores = (location: { lat: number; lng: number; address: string }) => {
    const mockStores: Store[] = [
      {
        id: '1',
        name: 'Target',
        address: '123 Main St, ' + location.address.split(',').slice(-2).join(','),
        distance: 0.8,
        coordinates: { lat: location.lat + 0.001, lng: location.lng + 0.001 }
      },
      {
        id: '2',
        name: 'Walmart',
        address: '456 Oak Ave, ' + location.address.split(',').slice(-2).join(','),
        distance: 1.2,
        coordinates: { lat: location.lat - 0.002, lng: location.lng + 0.003 }
      },
      {
        id: '3',
        name: 'Whole Foods',
        address: '789 Pine St, ' + location.address.split(',').slice(-2).join(','),
        distance: 1.5,
        coordinates: { lat: location.lat + 0.003, lng: location.lng - 0.001 }
      },
      {
        id: '4',
        name: 'Kroger',
        address: '321 Elm St, ' + location.address.split(',').slice(-2).join(','),
        distance: 2.1,
        coordinates: { lat: location.lat - 0.001, lng: location.lng - 0.002 }
      }
    ];

    return mockStores;
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location);
    const stores = findNearbyStores(location);
    setNearbyStores(stores);
  };

  const handleStoreSelect = (store: Store) => {
    onStoreSelect(store);
  };

  if (showMap) {
    return (
      <div className="pb-20 px-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="icon" onClick={() => setShowMap(false)}>
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-xl font-bold">Select Location on Map</h2>
        </div>
        
        <Map 
          onLocationSelect={handleLocationSelect}
          showSearch={true}
          className="w-full h-[60vh]"
        />
        
        {selectedLocation && (
          <Card className="mt-4 p-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-primary mt-1" size={20} />
              <div className="flex-1">
                <h3 className="font-medium">Selected Location</h3>
                <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        {onBack && (
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft size={20} />
          </Button>
        )}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      {/* Location Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Navigation className="text-primary" size={24} />
            <div>
              <h3 className="font-semibold">Choose Your Location</h3>
              <p className="text-sm text-muted-foreground">Find stores near you</p>
            </div>
          </div>
          
          <Button onClick={() => setShowMap(true)} className="w-full">
            <MapPin size={16} className="mr-2" />
            Select Location on Map
          </Button>
        </div>
      </Card>

      {/* Selected Location */}
      {selectedLocation && (
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <MapPin className="text-primary mt-1" size={20} />
            <div className="flex-1">
              <h3 className="font-medium">Your Location</h3>
              <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Nearby Stores */}
      {nearbyStores.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Nearby Stores</h3>
          {nearbyStores.map((store) => (
            <Card key={store.id} className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
              <div 
                className="flex items-center justify-between"
                onClick={() => handleStoreSelect(store)}
              >
                <div className="flex items-start gap-3">
                  <Store className="text-primary mt-1" size={20} />
                  <div className="flex-1">
                    <h4 className="font-medium">{store.name}</h4>
                    <p className="text-sm text-muted-foreground">{store.address}</p>
                  </div>
                </div>
                <div className="text-right">
                  {store.distance && (
                    <Badge variant="secondary" className="mb-1">
                      {store.distance} km
                    </Badge>
                  )}
                  <Button size="sm" variant="outline">
                    Select
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* No stores message */}
      {selectedLocation && nearbyStores.length === 0 && (
        <Card className="p-6 text-center">
          <Store className="mx-auto text-muted-foreground mb-3" size={48} />
          <h3 className="font-medium mb-2">No stores found nearby</h3>
          <p className="text-sm text-muted-foreground">
            Try selecting a different location or check back later.
          </p>
        </Card>
      )}
    </div>
  );
};

export default StoreLocationPicker;