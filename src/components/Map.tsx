import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Your Mapbox public token
const MAPBOX_TOKEN = 'pk.eyJ1IjoiaHltajk1IiwiYSI6ImNtZnR6aHlkYTBiMnIycXNlM2RjMDdlM2IifQ.3Gh03gmiAD8sI6XKz-ne_w';

interface MapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  showSearch?: boolean;
  className?: string;
  initialLocation?: { lat: number; lng: number };
}

const Map: React.FC<MapProps> = ({ 
  onLocationSelect, 
  showSearch = true, 
  className = "w-full h-96",
  initialLocation 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialLocation ? [initialLocation.lng, initialLocation.lat] : [-74.006, 40.7128], // Default to NYC
      zoom: initialLocation ? 14 : 10,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add geolocate control
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    
    map.current.addControl(geolocateControl, 'top-right');

    // Add click handler for location selection
    if (onLocationSelect) {
      map.current.on('click', async (e) => {
        const { lng, lat } = e.lngLat;
        
        // Add/update marker
        if (marker.current) {
          marker.current.remove();
        }
        marker.current = new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat([lng, lat])
          .addTo(map.current!);

        // Reverse geocoding to get address
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
          );
          const data = await response.json();
          const address = data.features[0]?.place_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          
          onLocationSelect({ lat, lng, address });
        } catch (error) {
          console.error('Error getting address:', error);
          onLocationSelect({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
        }
      });
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [initialLocation, onLocationSelect]);

  const searchLocation = async () => {
    if (!searchQuery.trim() || !map.current) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const address = data.features[0].place_name;
        
        // Fly to location
        map.current.flyTo({
          center: [lng, lat],
          zoom: 14,
          duration: 2000
        });

        // Add/update marker
        if (marker.current) {
          marker.current.remove();
        }
        marker.current = new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat([lng, lat])
          .addTo(map.current);

        // Call location select callback
        if (onLocationSelect) {
          onLocationSelect({ lat, lng, address });
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchLocation();
    }
  };

  return (
    <div className="relative">
      {showSearch && (
        <Card className="absolute top-4 left-4 right-4 z-10 p-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search for a location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={searchLocation} 
              disabled={isLoading || !searchQuery.trim()}
              size="sm"
            >
              {isLoading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Navigation size={16} />
              )}
            </Button>
          </div>
        </Card>
      )}
      
      <div 
        ref={mapContainer} 
        className={`${className} rounded-lg shadow-lg`}
        style={{ minHeight: '300px' }}
      />
      
      {onLocationSelect && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="p-3 bg-white/95 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} />
              <span>Click on the map to select a location</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Map;