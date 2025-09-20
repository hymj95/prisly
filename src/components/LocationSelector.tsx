import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Check } from 'lucide-react';

interface LocationSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string; radius: number }) => void;
  currentLocation?: { lat: number; lng: number; address: string; radius: number } | null;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationSelect, currentLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const circle = useRef<string | null>(null);
  
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);
  const [radius, setRadius] = useState(currentLocation?.radius || 5);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: currentLocation ? [currentLocation.lng, currentLocation.lat] : [-74.006, 40.7128], // Default to NYC
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add click handler
    map.current.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      
      // Update marker
      if (marker.current) {
        marker.current.remove();
      }
      marker.current = new mapboxgl.Marker({ color: '#2D5A27' })
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Get address using reverse geocoding
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`
        );
        const data = await response.json();
        const address = data.features[0]?.place_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        
        setSelectedLocation({ lat, lng, address, radius });
        updateCircle(lat, lng, radius);
      } catch (error) {
        console.error('Error getting address:', error);
        const address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setSelectedLocation({ lat, lng, address, radius });
        updateCircle(lat, lng, radius);
      }
    });

    // Initialize with current location if available
    if (currentLocation) {
      marker.current = new mapboxgl.Marker({ color: '#2D5A27' })
        .setLngLat([currentLocation.lng, currentLocation.lat])
        .addTo(map.current);
      updateCircle(currentLocation.lat, currentLocation.lng, currentLocation.radius);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  const updateCircle = (lat: number, lng: number, radiusKm: number) => {
    if (!map.current) return;

    // Remove existing circle
    if (circle.current) {
      if (map.current.getSource(circle.current)) {
        map.current.removeLayer(circle.current);
        map.current.removeSource(circle.current);
      }
    }

    // Add new circle
    const circleId = 'radius-circle-' + Date.now();
    circle.current = circleId;

    // Create circle geometry (approximation using polygon)
    const points = 64;
    const coordinates = [];
    const radiusInDegrees = radiusKm / 111; // Rough conversion

    for (let i = 0; i < points; i++) {
      const angle = (i * 360) / points;
      const x = lng + radiusInDegrees * Math.cos((angle * Math.PI) / 180);
      const y = lat + radiusInDegrees * Math.sin((angle * Math.PI) / 180);
      coordinates.push([x, y]);
    }
    coordinates.push(coordinates[0]); // Close the polygon

    map.current.addSource(circleId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
      },
    });

    map.current.addLayer({
      id: circleId,
      type: 'fill',
      source: circleId,
      paint: {
        'fill-color': '#2D5A27',
        'fill-opacity': 0.2,
      },
    });
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (selectedLocation) {
      const updated = { ...selectedLocation, radius: newRadius };
      setSelectedLocation(updated);
      updateCircle(selectedLocation.lat, selectedLocation.lng, newRadius);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  if (showTokenInput) {
    return (
      <Card className="p-6 space-y-4">
        <div className="text-center space-y-2">
          <MapPin className="mx-auto text-primary" size={32} />
          <h3 className="font-semibold">Set Your Area</h3>
          <p className="text-sm text-muted-foreground">
            Enter your Mapbox public token to select your preferred shopping area
          </p>
        </div>
        
        <div className="space-y-3">
          <Input
            placeholder="Paste your Mapbox public token here"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <Button 
            onClick={() => setShowTokenInput(false)}
            disabled={!mapboxToken}
            className="w-full"
          >
            Continue
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center">
          <p>Get your free token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a></p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Select Your Area</h3>
          <Button variant="outline" size="sm" onClick={() => setShowTokenInput(true)}>
            Change Token
          </Button>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">Search Radius: {radius} km</label>
            <input
              type="range"
              min="1"
              max="25"
              value={radius}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 km</span>
              <span>25 km</span>
            </div>
          </div>
          
          {selectedLocation && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-1">Selected Location:</p>
              <p className="text-xs text-muted-foreground">{selectedLocation.address}</p>
              <p className="text-xs text-muted-foreground">Radius: {selectedLocation.radius} km</p>
            </div>
          )}
          
          <Button 
            onClick={handleConfirm}
            disabled={!selectedLocation}
            className="w-full"
          >
            <Check size={16} className="mr-2" />
            Confirm Area
          </Button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div ref={mapContainer} className="w-full h-64" />
        <div className="p-3 bg-muted/30 text-xs text-muted-foreground text-center">
          Click on the map to select your preferred shopping area
        </div>
      </Card>
    </div>
  );
};

export default LocationSelector;