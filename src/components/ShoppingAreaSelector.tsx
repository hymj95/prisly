import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Search, Filter, Navigation, Loader2, AlertCircle, Check, Star, Map } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useStoreLocation } from '@/hooks/useStoreLocation';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  distance?: number;
  category?: string;
  city?: string;
}

interface ShoppingAreaSelectorProps {
  onStoreSelect?: (store: Store) => void;
  onAreaSelect?: (area: { location: string; radius: number; stores: Store[] }) => void;
}

const ShoppingAreaSelector: React.FC<ShoppingAreaSelectorProps> = ({ onStoreSelect, onAreaSelect }) => {
  const { t } = useLanguage();
  const { stores: dbStores, userLocation, getCurrentLocation, getNearbyStores, isLoading } = useStoreLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [showMap, setShowMap] = useState(false);
  const [mapboxToken, setMapboxToken] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [popularAreas] = useState([
    'Oslo Sentrum', 'Grünerløkka', 'Majorstuen', 'Frogner', 'Grønland'
  ]);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  const categories = [
    { value: 'all', label: 'Alle kategorier' },
    { value: 'Grocery', label: 'Dagligvare' },
    { value: 'Electronics', label: 'Elektronikk' },
    { value: 'Pharmacy', label: 'Apotek' }
  ];

  // Auto-detect current location
  const handleAutoDetect = async () => {
    setIsDetecting(true);
    setDetectionError(null);
    
    try {
      const location = await getCurrentLocation();
      const nearbyStores = getNearbyStores(location, 20);
      
      if (onAreaSelect) {
        onAreaSelect({
          location: 'Din posisjon',
          radius: 10,
          stores: nearbyStores
        });
      }
    } catch (error) {
      setDetectionError(error instanceof Error ? error.message : 'Kunne ikke finne din posisjon');
    } finally {
      setIsDetecting(false);
    }
  };

  // Search by area name
  const handleAreaSearch = (area: string) => {
    setSelectedArea(area);
    setSearchQuery(area);
    
    // Filter stores by city/area
    const areaStores = dbStores
      .filter(store => 
        store.city?.toLowerCase().includes(area.toLowerCase()) ||
        store.address?.toLowerCase().includes(area.toLowerCase())
      )
      .map(store => {
        if (userLocation) {
          return {
            ...store,
            distance: calculateDistance(
              userLocation.lat,
              userLocation.lng,
              store.latitude,
              store.longitude
            )
          };
        }
        return store;
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    
    if (onAreaSelect) {
      onAreaSelect({
        location: area,
        radius: 15,
        stores: areaStores
      });
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get stores with distances if location available
  const storesWithDistance = dbStores.map(store => {
    if (userLocation) {
      return {
        ...store,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          store.latitude,
          store.longitude
        )
      };
    }
    return store;
  });

  // Filter and sort stores
  const filteredStores = storesWithDistance
    .filter(store => {
      const matchesCategory = selectedCategory === 'all' || 
        store.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.city?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || Infinity) - (b.distance || Infinity);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // Initialize map
  useEffect(() => {
    if (!showMap || !mapContainer.current || map.current || !mapboxToken) return;

    // Set Mapbox access token
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: userLocation ? [userLocation.lng, userLocation.lat] : [10.7522, 59.9139], // Oslo center
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [showMap, userLocation, mapboxToken]);

  // Update map markers when stores change
  useEffect(() => {
    if (!map.current || !showMap) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    filteredStores.forEach(store => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-semibold text-sm">${store.name}</h3>
          <p class="text-xs text-gray-600">${store.address}</p>
          ${store.category ? `<span class="text-xs text-gray-500">${store.category}</span>` : ''}
          ${store.distance ? `<p class="text-xs text-gray-500 mt-1">${store.distance.toFixed(1)} km unna</p>` : ''}
        </div>
      `);

      const marker = new mapboxgl.Marker({
        color: store.id === selectedStore?.id ? '#ef4444' : (store.verified ? '#10b981' : '#6b7280')
      })
        .setLngLat([store.longitude, store.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      marker.getElement().addEventListener('click', () => {
        setSelectedStore(store);
        onStoreSelect?.(store);
      });

      markers.current.push(marker);
    });

    // Focus on selected store or fit all markers
    if (selectedStore && filteredStores.find(s => s.id === selectedStore.id)) {
      map.current.setCenter([selectedStore.longitude, selectedStore.latitude]);
      map.current.setZoom(16);
    } else if (filteredStores.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredStores.forEach(store => {
        bounds.extend([store.longitude, store.latitude]);
      });
      
      if (filteredStores.length === 1) {
        map.current.setCenter([filteredStores[0].longitude, filteredStores[0].latitude]);
        map.current.setZoom(15);
      } else {
        map.current.fitBounds(bounds, { padding: 50 });
      }
    }
  }, [filteredStores, showMap, selectedStore, onStoreSelect]);

  // Handle store selection from list
  const handleStoreClick = (store: Store) => {
    setSelectedStore(store);
    setActiveTab('map');
    setShowMap(true);
    onStoreSelect?.(store);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search Area</TabsTrigger>
          <TabsTrigger value="browse">Browse Stores</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Find Your Shopping Area</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAutoDetect}
                disabled={isDetecting}
              >
                {isDetecting ? (
                  <>
                    <Loader2 size={14} className="mr-2 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <Navigation size={14} className="mr-2" />
                    Use Current Location
                  </>
                )}
              </Button>
            </div>

            {detectionError && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{detectionError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search by city, neighborhood, or zip code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAreaSearch(searchQuery)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Popular Areas:</p>
                <div className="flex flex-wrap gap-2">
                  {popularAreas.map((area) => (
                    <Button
                      key={area}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAreaSearch(area)}
                      className="h-8"
                    >
                      {area}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="browse" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Avstand</SelectItem>
                    <SelectItem value="name">Navn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedArea && (
              <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span className="font-medium">Shopping in: {selectedArea}</span>
                  <Badge variant="secondary">{filteredStores.length} stores found</Badge>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Store Locations</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowMap(!showMap)}
                disabled={!mapboxToken}
              >
                <Map size={14} className="mr-2" />
                {showMap ? 'Hide Map' : 'Show Map'}
              </Button>
            </div>
            
            {!mapboxToken && (
              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Enter your Mapbox Public Token</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Get your free public token from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
                </p>
                <Input
                  placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNr..."
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            )}
            
            {showMap && mapboxToken && (
              <div className="space-y-4">
                <div 
                  ref={mapContainer} 
                  className="w-full h-96 rounded-lg border"
                />
                
                {filteredStores.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Showing {filteredStores.length} stores on map. Click markers to select stores.
                    </span>
                    {selectedStore && (
                      <div className="flex items-center gap-2 px-2 py-1 bg-destructive/10 text-destructive rounded text-xs">
                        <MapPin size={12} />
                        {selectedStore.name}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {!showMap && mapboxToken && (
              <div className="text-center py-8">
                <Map className="mx-auto mb-3 text-muted-foreground" size={32} />
                <p className="text-sm text-muted-foreground">
                  Click "Show Map" to view store locations visually
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Store List */}
      {filteredStores.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            {selectedArea ? `Stores in ${selectedArea}` : 'Available Stores'} ({filteredStores.length})
          </h4>
          
          {filteredStores.map((store) => (
            <Card 
              key={store.id} 
              className={`p-4 hover:shadow-md transition-all cursor-pointer border-l-4 ${
                selectedStore?.id === store.id 
                  ? 'border-l-destructive bg-destructive/5' 
                  : 'border-l-primary/20 hover:border-l-primary'
              }`}
              onClick={() => handleStoreClick(store)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium">{store.name}</h5>
                    {store.verified && (
                      <Badge variant="secondary" className="text-xs bg-success/10 text-success">
                        <Check size={12} className="mr-1" />
                        Verified
                      </Badge>
                    )}
                    {store.category && (
                      <Badge variant="outline" className="text-xs">
                        {store.category}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{store.address}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {store.category && (
                      <Badge variant="secondary" className="text-xs">{store.category}</Badge>
                    )}
                    {store.distance !== undefined && (
                      <span>{store.distance.toFixed(1)} km unna</span>
                    )}
                    {store.verified && (
                      <Badge variant="outline" className="text-xs">
                        <Check size={10} className="mr-1" />
                        Verifisert
                      </Badge>
                    )}
                  </div>
                </div>
                
                <MapPin className="text-muted-foreground flex-shrink-0" size={16} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredStores.length === 0 && !isDetecting && (
        <Card className="p-8 text-center">
          <MapPin className="mx-auto mb-3 text-muted-foreground" size={32} />
          <h4 className="font-medium mb-2">No Stores Found</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Try searching for a different area or use auto-detection to find nearby stores.
          </p>
          <Button onClick={handleAutoDetect} className="w-full">
            <Navigation size={14} className="mr-2" />
            Find Stores Near Me
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ShoppingAreaSelector;