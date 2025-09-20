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
  rating?: number;
  category?: string;
  hours?: string;
}

interface ShoppingAreaSelectorProps {
  onStoreSelect?: (store: Store) => void;
  onAreaSelect?: (area: { location: string; radius: number; stores: Store[] }) => void;
}

const ShoppingAreaSelector: React.FC<ShoppingAreaSelectorProps> = ({ onStoreSelect, onAreaSelect }) => {
  const { t } = useLanguage();
  const { userLocation, getCurrentLocation, getNearbyStores } = useStoreLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [stores, setStores] = useState<Store[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [mapboxToken, setMapboxToken] = useState('');
  const [popularAreas] = useState([
    'Downtown', 'Shopping District', 'Mall Area', 'Suburban Center', 'Business District'
  ]);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Enhanced mock stores with more details
  const mockStores: Store[] = [
    {
      id: '1',
      name: 'Target',
      address: '123 Main St, Downtown',
      latitude: 40.7128,
      longitude: -74.0060,
      verified: true,
      rating: 4.2,
      category: 'Department Store',
      hours: '8:00 AM - 10:00 PM'
    },
    {
      id: '2',
      name: 'Walmart Supercenter',
      address: '456 Shopping Center Blvd',
      latitude: 40.7589,
      longitude: -73.9851,
      verified: true,
      rating: 3.8,
      category: 'Grocery',
      hours: '6:00 AM - 11:00 PM'
    },
    {
      id: '3',
      name: 'Whole Foods Market',
      address: '789 Organic Ave',
      latitude: 40.7282,
      longitude: -74.0776,
      verified: true,
      rating: 4.5,
      category: 'Grocery',
      hours: '7:00 AM - 10:00 PM'
    },
    {
      id: '4',
      name: 'CVS Pharmacy',
      address: '321 Health Street',
      latitude: 40.7505,
      longitude: -73.9934,
      verified: true,
      rating: 4.0,
      category: 'Pharmacy',
      hours: '8:00 AM - 10:00 PM'
    },
    {
      id: '5',
      name: 'Best Buy',
      address: '555 Electronics Way',
      latitude: 40.7420,
      longitude: -74.0030,
      verified: true,
      rating: 4.1,
      category: 'Electronics',
      hours: '10:00 AM - 9:00 PM'
    },
    {
      id: '6',
      name: 'Home Depot',
      address: '777 Hardware Blvd',
      latitude: 40.7350,
      longitude: -74.0150,
      verified: true,
      rating: 4.3,
      category: 'Hardware',
      hours: '6:00 AM - 10:00 PM'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'department', label: 'Department Store' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'hardware', label: 'Hardware' }
  ];

  // Auto-detect current location
  const handleAutoDetect = async () => {
    setIsDetecting(true);
    setDetectionError(null);
    
    try {
      const location = await getCurrentLocation();
      const nearbyStores = simulateNearbyStores(location);
      setStores(nearbyStores);
      
      if (onAreaSelect) {
        onAreaSelect({
          location: 'Current Location',
          radius: 10,
          stores: nearbyStores
        });
      }
    } catch (error) {
      setDetectionError(error instanceof Error ? error.message : 'Failed to detect location');
    } finally {
      setIsDetecting(false);
    }
  };

  // Search by area name
  const handleAreaSearch = (area: string) => {
    setSelectedArea(area);
    setSearchQuery(area);
    
    // Simulate area-based store search
    const areaStores = mockStores.map(store => ({
      ...store,
      distance: Math.random() * 15 + 1 // Random distance 1-16km
    })).sort((a, b) => a.distance! - b.distance!);
    
    setStores(areaStores);
    
    if (onAreaSelect) {
      onAreaSelect({
        location: area,
        radius: 15,
        stores: areaStores
      });
    }
  };

  // Simulate nearby stores based on location
  const simulateNearbyStores = (location: { lat: number; lng: number }) => {
    return mockStores.map(store => {
      const distance = calculateDistance(location.lat, location.lng, store.latitude, store.longitude);
      return { ...store, distance };
    }).filter(store => store.distance! < 20).sort((a, b) => a.distance! - b.distance!);
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

  // Filter and sort stores
  const filteredStores = stores
    .filter(store => {
      const matchesCategory = selectedCategory === 'all' || 
        store.category?.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
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
      center: userLocation ? [userLocation.lng, userLocation.lat] : [-74.0060, 40.7128],
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
          ${store.rating ? `<div class="flex items-center gap-1 mt-1">
            <span class="text-yellow-500">★</span>
            <span class="text-xs">${store.rating}</span>
          </div>` : ''}
          ${store.distance ? `<p class="text-xs text-gray-500">${store.distance.toFixed(1)} km away</p>` : ''}
        </div>
      `);

      const marker = new mapboxgl.Marker({
        color: store.verified ? '#10b981' : '#6b7280'
      })
        .setLngLat([store.longitude, store.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      marker.getElement().addEventListener('click', () => {
        onStoreSelect?.(store);
      });

      markers.current.push(marker);
    });

    // Fit map to show all markers
    if (filteredStores.length > 0) {
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
  }, [filteredStores, showMap, onStoreSelect]);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="search" className="w-full">
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
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
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
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredStores.length} stores on map. Click markers to select stores.
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
              className="p-4 hover:shadow-md transition-all cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary"
              onClick={() => onStoreSelect?.(store)}
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
                    {store.distance !== undefined && (
                      <span>{store.distance.toFixed(1)} km away</span>
                    )}
                    {store.rating && (
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span>{store.rating}</span>
                      </div>
                    )}
                    {store.hours && <span>{store.hours}</span>}
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