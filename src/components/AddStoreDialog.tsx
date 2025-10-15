import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2, MapPin } from 'lucide-react';
import { useStoreLocation } from '@/hooks/useStoreLocation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AddStoreDialogProps {
  onStoreAdded?: () => void;
}

const AddStoreDialog: React.FC<AddStoreDialogProps> = ({ onStoreAdded }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const { addStore, getCurrentLocation } = useStoreLocation();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: 'Oslo',
    postal_code: '',
    latitude: '',
    longitude: '',
    category: 'Grocery'
  });

  const categories = [
    'Grocery',
    'Electronics',
    'Pharmacy',
    'Hardware',
    'Department Store',
    'Clothing',
    'Other'
  ];

  const norwegianCities = [
    'Oslo',
    'Bergen',
    'Trondheim',
    'Stavanger',
    'Kristiansand',
    'Drammen',
    'Tromsø'
  ];

  const handleGetCurrentLocation = async () => {
    setUseCurrentLocation(true);
    try {
      const location = await getCurrentLocation();
      setFormData(prev => ({
        ...prev,
        latitude: location.lat.toString(),
        longitude: location.lng.toString()
      }));
      toast.success('Posisjon hentet!');
    } catch (error) {
      toast.error('Kunne ikke hente posisjon');
      console.error(error);
    } finally {
      setUseCurrentLocation(false);
    }
  };

  const handleGeocodeAddress = async () => {
    if (!formData.address || !formData.city) {
      toast.error('Vennligst fyll ut adresse og by først');
      return;
    }

    setIsGeocoding(true);
    try {
      // Get Mapbox token from edge function
      const { data: tokenData, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
      
      if (tokenError || !tokenData?.token) {
        throw new Error('Kunne ikke hente kart-token');
      }

      // Geocode the address
      const fullAddress = `${formData.address}, ${formData.postal_code ? formData.postal_code + ' ' : ''}${formData.city}, Norge`;
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${tokenData.token}&limit=1&country=no`;
      
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setFormData(prev => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString()
        }));
        toast.success('Koordinater funnet!');
      } else {
        toast.error('Kunne ikke finne koordinater for denne adressen');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Kunne ikke søke etter koordinater');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Du må være innlogget for å legge til butikker');
      return;
    }
    
    if (!formData.name || !formData.address || !formData.latitude || !formData.longitude) {
      toast.error('Vennligst fyll ut alle påkrevde felt');
      return;
    }

    setIsSubmitting(true);
    try {
      const newStore = await addStore({
        name: formData.name,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code || undefined,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        category: formData.category,
        verified: false
      });

      if (newStore) {
        toast.success(`${formData.name} lagt til!`);
        setFormData({
          name: '',
          address: '',
          city: 'Oslo',
          postal_code: '',
          latitude: '',
          longitude: '',
          category: 'Grocery'
        });
        setOpen(false);
        onStoreAdded?.();
      } else {
        toast.error('Kunne ikke legge til butikk. Sjekk at du er innlogget.');
      }
    } catch (error: any) {
      console.error('Error adding store:', error);
      if (error?.message?.includes('row-level security')) {
        toast.error('Du må være innlogget for å legge til butikker');
      } else {
        toast.error('Kunne ikke legge til butikk');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Plus size={16} className="mr-2" />
          Legg til butikk
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Legg til ny butikk</DialogTitle>
          <DialogDescription>
            Fant du ikke butikken du leter etter? Legg den til her!
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Butikknavn *</Label>
            <Input
              id="name"
              placeholder="f.eks. Kiwi Storo"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse *</Label>
            <Input
              id="address"
              placeholder="f.eks. Sandakerveien 24"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city">By</Label>
              <Select
                value={formData.city}
                onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {norwegianCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code">Postnummer</Label>
              <Input
                id="postal_code"
                placeholder="0473"
                value={formData.postal_code}
                onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Koordinater</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGeocodeAddress}
                  disabled={isGeocoding || !formData.address || !formData.city}
                >
                  {isGeocoding ? (
                    <>
                      <Loader2 size={14} className="mr-2 animate-spin" />
                      Søker...
                    </>
                  ) : (
                    'Søk fra adresse'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGetCurrentLocation}
                  disabled={useCurrentLocation}
                >
                  {useCurrentLocation ? (
                    <>
                      <Loader2 size={14} className="mr-2 animate-spin" />
                      Henter...
                    </>
                  ) : (
                    <>
                      <MapPin size={14} className="mr-2" />
                      Min posisjon
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Breddegrad"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
              />
              <Input
                placeholder="Lengdegrad"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Klikk "Søk fra adresse" for automatisk koordinater
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Legger til...
                </>
              ) : (
                'Legg til butikk'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStoreDialog;
