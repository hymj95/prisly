import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Search, Navigation, Loader2, AlertCircle, Star, Map } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useStoreLocation } from '@/hooks/useStoreLocation';
import { supabase } from '@/integrations/supabase/client';
import AddStoreDialog from './AddStoreDialog';
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
  const { stores: dbStores, userLocation, getCurrentLocation, getNearbyStores, calculateDistance, isLoading } = useStoreLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [showMap, setShowMap] = useState(false);
  const [mapboxToken, setMapboxToken] = useState('');
  const [loadingMapToken, setLoadingMapToken] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [popularAreas] = useState([
    'Oslo', 'Sentrum', 'Grünerløkka', 'Majorstuen', 'Frogner', 'Grønland'
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

  // Fetch Mapbox token on mount
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        if (data?.token) {
          setMapboxToken(data.token);
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
      } finally {
        setLoadingMapToken(false);
      }
    };
    fetchMapboxToken();
  }, []);

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

  // Filter and sort stores
  const filteredStores = dbStores
    .filter(store => {
      const matchesCategory = selectedCategory === 'all' || 
        store.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = !searchQuery || 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.city?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
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

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: userLocation ? [userLocation.lng, userLocation.lat] : [10.7522, 59.9139], // Oslo default
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
          ${store.city ? `<p class="text-xs text-gray-500">${store.city}</p>` : ''}
          ${store.distance ? `<p class="text-xs text-gray-500">${store.distance.toFixed(1)} km unna</p>` : ''}
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin" size={32} />
        <span className="ml-3">Laster butikker...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Finn butikker</h2>
        <AddStoreDialog onStoreAdded={() => window.location.reload()} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Søk område</TabsTrigger>
          <TabsTrigger value="browse">Se butikker</TabsTrigger>
          <TabsTrigger value="map">Kart</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Finn ditt handleområde</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAutoDetect}
                disabled={isDetecting}
              >
                {isDetecting ? (
                  <>
                    <Loader2 size={14} className="mr-2 animate-spin" />
                    Finner posisjon...
                  </>
                ) : (
                  <>
                    <Navigation size={14} className="mr-2" />
                    Bruk min posisjon
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
                  placeholder="Søk etter by eller område..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAreaSearch(searchQuery)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Populære områder:</p>
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
                    <SelectValue placeholder="Filtrer etter kategori" />
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
                    <SelectValue placeholder="Sorter etter" />
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
                  <span className="font-medium">Handler i: {selectedArea}</span>
                  <Badge variant="secondary">{filteredStores.length} butikker funnet</Badge>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Butikklokasjon</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowMap(!showMap)}
                disabled={!mapboxToken || loadingMapToken}
              >
                <Map size={14} className="mr-2" />
                {showMap ? 'Skjul kart' : 'Vis kart'}
              </Button>
            </div>
            
            {loadingMapToken && (
              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Laster kart...</p>
                <Loader2 className="animate-spin" size={16} />
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
                      Viser {filteredStores.length} butikker. Klikk på markører for å velge.
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
                  Klikk "Vis kart" for å se butikklokasjon visuelt
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
            {selectedArea ? `Butikker i ${selectedArea}` : 'Tilgjengelige butikker'} ({filteredStores.length})
          </h4>
          <div className="grid gap-3">
            {filteredStores.map((store) => (
              <Card 
                key={store.id}
                className={`p-4 cursor-pointer hover:shadow-md transition-all ${
                  selectedStore?.id === store.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleStoreClick(store)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{store.name}</h3>
                      {store.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verifisert
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{store.address}</span>
                      </div>
                      {store.city && (
                        <p className="text-xs">{store.city}</p>
                      )}
                      {store.category && (
                        <Badge variant="outline" className="text-xs">
                          {store.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {store.distance !== undefined && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">
                        {store.distance.toFixed(1)} km
                      </div>
                      <div className="text-xs text-muted-foreground">unna</div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filteredStores.length === 0 && !isLoading && (
        <Card className="p-8 text-center">
          <MapPin className="mx-auto mb-3 text-muted-foreground" size={48} />
          <h3 className="font-semibold mb-2">Ingen butikker funnet</h3>
          <p className="text-sm text-muted-foreground">
            Prøv å endre søkekriteriene eller bruk en annen kategori
          </p>
        </Card>
      )}
    </div>
  );
};

export default ShoppingAreaSelector;
